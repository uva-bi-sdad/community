import type Community from './index'
import type {Entities, Entity, FilterParsed, LogicalObject} from '../types'
import type {DataViewParsed} from './dataview'

export class GlobalView {
  site: Community
  registered: LogicalObject = {}
  selection: Entities = {}
  entities: Map<string, Entity> = new Map()
  selected: string[] = []
  select_ids: {[index: string]: boolean} = {}
  filters: Map<string, FilterParsed> = new Map()
  times: number[]
  dataview: DataViewParsed
  states = {
    id_state: 'initial',
    filter_state: 'initial',
  }
  constructor(site: Community) {
    this.site = site
  }
  init() {
    this.times = this.site.data.meta.overall.value
    this.dataview = this.site.dataviews[this.site.defaults.dataview].parsed
  }
  filter_state(q?: string[], agg?: number) {
    const as_state = !q
    if (as_state) q = []
    this.filters.forEach(f => {
      const component =
        'selected' === f.component
          ? this.times['undefined' === typeof agg ? this.dataview.time_agg : agg]
          : f.time_component
          ? this.times[f.component as number]
          : f.component
      if (f.value) q.push(f.variable + '[' + component + ']' + f.operator + f.value + (as_state ? f.active : ''))
    })
    return q.join('&')
  }
  id_state() {
    return Object.keys(this.select_ids).join(',')
  }
  id_filter() {
    const ids: {[index: string]: boolean} = {}
    this.selected = []
    this.select_ids = ids
    if (this.site.data.metadata.datasets) {
      const inputs = this.site.page.modal.filter.entity_inputs
      this.site.data.metadata.datasets.forEach(d => {
        if (d in inputs) {
          const s = inputs[d].value() as string[],
            cs: string[] = []
          if (Array.isArray(s)) {
            s.forEach(id => {
              const e = this.site.data.entities[id]
              if (e) {
                cs.push(id)
                this.selected.push(id)
                ids[id] = true
                if (e.relations) {
                  Object.keys(e.relations.parents).forEach(k => (ids[k] = true))
                  Object.keys(e.relations.children).forEach(k => (ids[k] = true))
                }
              }
            })
            inputs[d].source = cs
          }
        }
      })
    }
  }
}
