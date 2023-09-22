import DataHandler from '../../data_handler/index'
import {Entities, Entity, Filter, Generic, VariableFilterParsed} from '../../types'
import {defaults} from '../defaults'
import Community from '../index'
import {component_fun} from '../time_funs'

export type DataViewSpec = {
  palette?: string
  y?: string
  x?: string
  time_agg?: string
  // time_filters?: SiteConditions
  dataset?: string
  ids?: string
  // features?: Generic
}

export type DataViewParsed = {
  dataset: string
  ids: EntitySelection
  features: string
  variables: string
  time_filters: string
  time_agg: number
  id_source: string
  palette: string
  variable_values: Map<string, VariableFilterParsed>
  feature_values: {[index: string]: Filter}
}

type VariableCondition = {
  variable: string
  type?: string
  value?: string | number
  operator?: string
  component?: string
}
type EntitySelection = {[index: string]: boolean | Entity}

export class SiteDataView {
  id: string
  palette: string
  y: string
  x: string
  time: string
  time_agg: string | number
  time_filters: VariableCondition[]
  time_range = {
    dataset: '',
    variable: '',
    filtered: [-Infinity, Infinity],
    filtered_index: [-Infinity, Infinity],
    index: [-Infinity, Infinity],
    time: [-Infinity, Infinity],
  }
  dataset: string
  ids: string
  features: Generic
  state: string
  valid: boolean
  get: {
    dataset: () => string
    single_id: () => string
    ids: () => EntitySelection
    features: () => string
    variables: () => string
    time_filters: () => string
  }
  checks: {
    dataset: (e: Entity) => boolean
    ids: (e: Entity) => boolean
    features: (e: Entity) => boolean
    variables: (e: Entity) => boolean
  }
  site: Community
  parsed: DataViewParsed = {
    dataset: '',
    ids: {},
    features: '',
    variables: '',
    time_filters: '',
    time_agg: 0,
    id_source: '',
    palette: '',
    variable_values: new Map(),
    feature_values: {},
  }
  selection: {[index: string]: Entities} = {
    ids: {},
    features: {},
    variables: {},
    dataset: {},
    filtered: {},
    full_filter: {},
    all: {},
  }
  n_selected: {[index: string]: number} = {
    ids: 0,
    features: 0,
    variables: 0,
    dataset: 0,
    filtered: 0,
    full_filter: 0,
    all: 0,
  }
  variables: VariableCondition[]
  times: boolean[]
  constructor(site: Community, id: string, spec?: DataViewSpec) {
    this.site = site
    this.id = id
    site.dataviews[id] = this
    if (spec)
      Object.keys(spec).forEach((k: keyof DataViewSpec) => {
        this[k] = spec[k]
      })
    if ('string' === typeof this.palette && this.palette in this.site.inputs) {
      this.site.add_dependency(this.palette, {type: 'dataview', id: id})
    }
    if ('string' === typeof this.dataset && this.dataset in this.site.inputs) {
      this.site.add_dependency(this.dataset, {type: 'dataview', id: id})
    }
    if ('string' === typeof this.ids && this.ids in this.site.inputs) {
      this.site.add_dependency(this.ids, {type: 'dataview', id: id})
    }
    this.site.add_dependency(id, {type: 'time_range', id: id})
    this.site.add_dependency('view.filter', {type: 'dataview', id: id})
    this.site.add_dependency('view.id', {type: 'dataview', id: id})
    if (this.x in this.site.inputs) this.site.add_dependency(this.x, {type: 'time_range', id: id})
    if (this.y in this.site.inputs) this.site.add_dependency(this.y, {type: 'time_range', id: id})
    if (this.features) {
      Object.keys(this.features).forEach(f => {
        const value = this.features[f]
        if ('string' === typeof value && value in this.site.inputs) {
          this.site.add_dependency(value, {type: 'dataview', id: id})
        }
      })
    }
    if (this.variables) {
      this.variables.forEach(v => {
        if (v.variable in this.site.inputs) {
          this.site.add_dependency(v.variable, {type: 'dataview', id: id})
        }
        if (!('type' in v)) v.type = '='
        if (v.type in this.site.inputs) {
          this.site.add_dependency(v.type, {type: 'dataview', id: id})
        }
        if (!('value' in v)) v.value = 0
        if ('string' === typeof v.value && v.value in this.site.inputs) {
          this.site.add_dependency(v.value, {type: 'dataview', id: id})
        }
      })
    }
    this.compile()
    // this.reparse()
  }
  value() {
    if (this.get) {
      this.reparse()
      return (
        '' +
        this.parsed.dataset +
        this.site.view.entities.size +
        this.site.data.inited[this.parsed.dataset] +
        this.parsed.id_source +
        Object.keys(this.parsed.ids) +
        this.parsed.features +
        this.parsed.variables +
        this.site.spec.settings.summary_selection
      )
    }
  }
  update() {
    const state = this.value()
    if (state !== this.state) {
      if (this.site.data.inited[this.parsed.dataset]) {
        this.valid = true
        this.n_selected.ids = 0
        this.n_selected.children = 0
        this.n_selected.features = 0
        this.n_selected.variables = 0
        this.n_selected.dataset = 0
        this.n_selected.filtered = 0
        this.n_selected.full_filter = 0
        this.n_selected.all = 0
        this.selection.ids = {}
        this.selection.children = {}
        this.selection.features = {}
        this.selection.variables = {}
        this.selection.dataset = {}
        this.selection.filtered = {}
        this.selection.full_filter = {}
        this.selection.all = {}
        this.site.view.filters.forEach(f => {
          f.passed = 0
          f.failed = 0
        })
        this.site.view.entities.forEach(e => {
          const c = this.check(e),
            id = e.features.id
          if (c.ids) {
            this.selection.ids[id] = e
            this.n_selected.ids++
            c.all++
          }
          if (c.features) {
            this.selection.features[id] = e
            this.n_selected.features++
            c.all++
          }
          if (c.variables) {
            this.selection.variables[id] = e
            this.n_selected.variables++
            c.all++
          }
          if (c.dataset) {
            this.selection.dataset[id] = e
            this.n_selected.dataset++
            c.all++
          }
          if (c.dataset && c.ids) {
            this.selection.children[id] = e
            this.n_selected.children++
          }
          if (c.features && c.variables) {
            this.selection.full_filter[id] = e
            this.n_selected.full_filter++
          }
          if (c.variables && c.features && c.ids) {
            this.selection.filtered[id] = e
            this.n_selected.filtered++
          }
          if (4 === c.all) {
            this.selection.all[id] = e
            this.n_selected.all++
          }
        })
        this.state = state
        this.site.request_queue(this.id)
      } else {
        this.valid = false
        this.site.data.data_queue[this.parsed.dataset][this.id] = () => {
          return this.update
        }
      }
    }
  }
  compile() {
    this.times = []
    if (this.time_filters) {
      this.time_filters = [
        {variable: defaults.time, type: '>=', value: 'filter.time_min'},
        {variable: defaults.time, type: '<=', value: 'filter.time_max'},
      ]
      this.site.add_dependency(this.id + '_time', {type: 'min', id: 'filter.time_min'})
      this.site.add_dependency(this.id + '_time', {type: 'max', id: 'filter.time_max'})
      this.time_filters.forEach(f => {
        if ('string' === typeof f.value && f.value in this.site.inputs) {
          this.site.add_dependency(f.value, {type: 'time_filters', id: this.id})
        }
      })
    }
    this.get = {
      dataset: () => {
        let d = defaults.dataset
        if ('string' === typeof this.dataset && this.dataset in this.site.inputs) {
          d = this.site.valueOf(this.site.inputs[this.dataset].value()) as string
          if (!(d in this.site.data.data_queue)) {
            d = defaults.dataset
            this.site.inputs[this.dataset].set(d)
          }
        } else {
          d = this.site.valueOf(this.dataset) as string
        }
        return d in this.site.data.data_queue ? d : defaults.dataset
      },
      single_id: () => {
        const id = this.site.valueOf(
          'string' === typeof this.ids && this.ids in this.site.inputs ? this.site.inputs[this.ids].value() : this.ids
        )
        return 'string' === typeof id ? id : ''
      },
      ids: () => {
        const id = this.site.valueOf(
          'string' === typeof this.ids && this.ids in this.site.inputs ? this.site.inputs[this.ids].value() : this.ids
        )
        if ('string' === typeof id && '' !== id && '-1' !== id) {
          const ids: {[index: string]: boolean} = {},
            e = this.site.data.entities[id]
          ids[id] = true
          if (e && e.relations) Object.keys(e.relations.children).forEach(k => (ids[k] = true))
          return ids
        } else if (this.site.view.entities.size) {
          return this.site.view.selection
        }
        return {}
      },
      features: () => {
        let s = ''
        this.features &&
          Object.keys(this.features).forEach(k => {
            s += k + this.site.valueOf(this.features[k])
          })
        return s
      },
      variables: () => {
        if (this.variables || this.site.view.filters.size) {
          if (!this.parsed.variable_values.size) this.reparse()
          let s = ''
          this.parsed.variable_values.forEach(vi => {
            vi.filter.summary.update()
            s += vi.name + vi.operator + vi.component + vi.value + vi.active
          })
          return s
        } else return ''
      },
      time_filters: () => {
        let s = ''
        this.time_filters &&
          this.time_filters.forEach(f => {
            s += f.value in this.site.inputs ? this.site.valueOf(f.value) : f.value
          })
        return s
      },
    }
    this.checks = {
      dataset: (e: Entity) => {
        return this.parsed.dataset === e.group
      },
      ids: (e: Entity) => {
        return e.features && this.ids_check(this.parsed.ids, e.features.id)
      },
      features: (e: Entity) => {
        if (e.features) {
          let k,
            v,
            pass = true
          for (k in this.parsed.feature_values) {
            if (k in this.parsed.feature_values) {
              v = this.parsed.feature_values[k]
              pass = DataHandler.checks[v.operator](this.value, this.site.valueOf(e.features[k]))
              if (!pass) break
            }
          }
          return pass
        } else return true
      },
      variables: (e: Entity) => {
        if (e.data) {
          let pass = true
          this.parsed.variable_values.forEach(v => {
            if (v.active && !isNaN(+v.value)) {
              const ev = e.get_value(v.name, v.comp_fun(v, this.parsed)),
                ck = !isNaN(ev) && DataHandler.checks[v.operator](ev, this.value)
              v.filter[ck ? 'passed' : 'failed']++
              if (pass && !ck) pass = false
            } else {
              v.filter.failed++
            }
          })
          return pass
        } else return true
      },
    }
  }
  ids_check(a: EntitySelection, b: string) {
    return !a || b in a
  }
  check(e: Entity) {
    return {
      ids: !this.ids || this.checks.ids(e),
      features: !this.features || this.checks.features(e),
      variables: (!this.variables && !this.site.view.filters.size) || this.checks.variables(e),
      dataset: !this.dataset || this.checks.dataset(e),
      all: 0,
    }
  }
  reparse() {
    this.parsed.dataset = this.get.dataset()
    this.parsed.ids = this.get.ids()
    this.parsed.time_filters = this.get.time_filters()
    this.parsed.time_agg =
      this.parsed.dataset in this.site.data.meta.times
        ? (this.site.valueOf(this.time_agg) as number) - this.site.data.meta.times[this.parsed.dataset].range[0]
        : 0
    if ('string' === typeof this.ids) {
      const u = this.site.inputs[this.ids]
      if (
        this.ids in this.site.inputs &&
        (('virtual' === u.type && u.source in this.site.inputs) ||
          ('depends' in u && (u.depends as string) in this.site.inputs))
      ) {
        this.parsed.id_source = (
          'virtual' === u.type
            ? this.site.valueOf(this.site.inputs[u.source].dataset)
            : this.site.inputs[u.depends as string].value()
        ) as string
      }
    }
    if (this.palette) this.parsed.palette = this.site.valueOf(this.palette) as string
    if (this.features) {
      this.parsed.feature_values = {}
      for (const k in this.features)
        if (k in this.features) {
          const value = this.site.valueOf(this.features[k]) as string | string[]
          this.parsed.feature_values[k] = {
            value: value,
            operator: 'string' === typeof value ? 'equals' : 'includes',
          }
        }
      this.parsed.features = this.get.features()
    } else this.parsed.features = ''
    this.parsed.variable_values.clear()
    if (this.site.view.filters.size)
      this.site.view.filters.forEach(f => {
        this.parsed.variable_values.set(f.id, {
          filter: f,
          name: f.variable,
          range: this.site.data.variables[f.variable].info[this.parsed.dataset].time_range,
          operator: f.operator,
          value: f.value ? +f.value : NaN,
          value_type: 'number',
          component: f.component,
          active: f.active,
          comp_fun: component_fun(this.site.data.meta.overall.value, f.component),
        })
      })
    if (this.variables || this.parsed.variable_values.size) {
      if (this.variables)
        this.variables.forEach(v => {
          const value = this.site.valueOf(v.value) as string | number
          this.parsed.variable_values.set(this.parsed.variable_values.size + '', {
            name: v.variable,
            operator: v.operator,
            value: value,
            component: v.component,
            active: true,
            comp_fun: component_fun(this.site.data.meta.overall.value, v.component),
          })
        })
      this.parsed.variables = this.get.variables()
    } else this.parsed.variables = ''
  }
}
