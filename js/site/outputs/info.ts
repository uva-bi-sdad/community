import type {Entity, LogicalObject, MeasureInfo, Summary, Variable} from '../../types'
import type Community from '../index'
import {filter_components} from '../static_refs'
import {make_summary_table, make_variable_source} from '../utils'
import {value_types} from '../value_types'
import {BaseOutput, SiteOutputs} from './index'

type InfoSpec = {
  title?: string
  body?: {name: string; value: string; style: string}[]
  subto?: string[]
  dataview: string
  variable?: string
  default?: {body?: string; title?: string}
  variable_info?: boolean
  show_summary?: boolean
  floating?: boolean
}

type Parsed = {
  data?: string
  variables?: string
  features?: string
  summary?: HTMLTableElement
  filter?: HTMLTableElement
}

class InfoPart {
  parent: OutputInfo
  text: string
  value_source: string
  parsed: Parsed = {}
  ref = true
  selection = false
  base?: HTMLButtonElement | HTMLParagraphElement
  temp?: HTMLButtonElement | HTMLParagraphElement
  default?: HTMLButtonElement | HTMLParagraphElement
  rows?: {name: InfoPart; value: InfoPart}[]
  constructor(parent: OutputInfo, text: string) {
    this.parent = parent
    this.text = text
    if ('value' === text) {
      this.parsed.data = parent.spec.variable
    } else if ('summary' === text) {
      parent.spec.show_summary = true
    } else if ('filter' === text) {
      const e = document.createElement('table')
      e.className = 'info-filter'
      this.parsed.filter = e
    }
    const patterns = parent.site.patterns
    if (patterns.features.test(text)) {
      this.parsed.features = text.replace(patterns.features, '')
    } else if (parent.site.patterns.data.test(text)) {
      this.parsed.data = text.replace(patterns.data, '')
    } else if (patterns.variables.test(text)) {
      this.parsed.variables = text.replace(patterns.variables, '')
    } else this.ref = false
  }
  get(entity?: Entity, caller?: SiteOutputs) {
    if (this.ref && this.parent.site.data) {
      if (entity)
        if ('features' in this.parsed) {
          return entity.features[this.parsed.features]
        } else if ('data' in this.parsed) {
          if ('value' === this.text) {
            this.parsed.data = this.parent.site.valueOf(
              this.parent.spec.variable || caller.color || caller.y || this.parent.site.dataviews[this.parent.view].y
            ) as string
          } else if (this.text in this.parent.site.inputs)
            this.parsed.data = this.parent.site.valueOf(this.text) as string
          if (!(this.parsed.data in this.parent.site.data.variables)) return this.parsed.data
          const info = this.parent.site.data.variables[this.parsed.data],
            v = this.parent.site.data.format_value(
              entity.get_value(this.parsed.data, this.parent.time),
              info && info.info[entity.group] && 'integer' === info.info[entity.group].type
            )
          let type = info.meta.unit || info.meta.type
          if (info.meta.aggregation_method && !(type in value_types)) type = info.meta.aggregation_method
          return (!isNaN(v as number) && type in value_types ? value_types[type](v) : v) + ''
        }
      const info = this.parent.site.data.variable_info
      if ('data' in this.parsed) {
        return this.parent.site.data.meta.times[this.parent.dataset].value[this.parent.time_agg] + ''
      } else if ('variables' in this.parsed && (this.value_source || this.parent.v in info)) {
        const v = this.parent.site.valueOf(this.value_source || this.parent.v) as string,
          i = info[v] as MeasureInfo
        return (this.parsed.variables in i ? i[this.parsed.variables as keyof MeasureInfo] : this.text) as string
      }
      return this.text
    } else return this.text
  }
}

export class OutputInfo extends BaseOutput {
  type: 'info' = 'info'
  dataset: string
  time_agg: number
  time: number
  v: string
  showing = false
  has_default = false
  selection = false
  processed = false
  depends: LogicalObject = {}
  parts: {
    title?: InfoPart
    body?: {
      base: HTMLElement
      temp: HTMLElement
      default: HTMLElement
      rows: {base: HTMLElement; temp: HTMLElement; name: InfoPart; value: InfoPart}[]
    }
  } = {}
  var: Variable
  summary: Summary
  options: InfoSpec
  queue: number | NodeJS.Timeout
  constructor(e: HTMLElement, site: Community) {
    super(e, site)
    this.update = this.update.bind(this)
    this.has_default = this.spec.default && (!!this.spec.default.title || !!this.spec.default.body)
    this.site.subs.add(this.view, this)
    if (this.spec.floating) {
      document.body.appendChild(this.e)
      this.e.classList.add('hidden')
      document.addEventListener(
        'mousemove',
        function (this: OutputInfo, e: MouseEvent) {
          if (this.showing) {
            const f = this.site.page.content.getBoundingClientRect()
            this.e.style.top = (e.y > f.height / 2 ? e.y - this.e.getBoundingClientRect().height - 10 : e.y + 10) + 'px'
            this.e.style.left = (e.x > f.width / 2 ? e.x - this.e.getBoundingClientRect().width - 10 : e.x + 10) + 'px'
          }
        }.bind(this)
      )
    }
    if (this.spec.title) {
      this.parts.title = new InfoPart(this, this.spec.title)
      if (
        this.spec.variable_info &&
        'variables' in this.parts.title.parsed &&
        this.site.patterns.measure_name.test(this.parts.title.parsed.variables)
      ) {
        this.parts.title.base = document.createElement('button')
        this.parts.title.base.type = 'button'
        this.parts.title.base.setAttribute('data-bs-toggle', 'modal')
        this.parts.title.base.setAttribute('data-bs-target', '#variable_info_display')
        this.parts.title.base.addEventListener('click', this.site.page.show_variable_info)
      } else this.parts.title.base = document.createElement('p')
      this.parts.title.base.appendChild(document.createElement('span'))
      this.parts.title.temp = document.createElement('p')
      this.parts.title.default = document.createElement('p')
      this.parts.title.temp.className =
        this.parts.title.base.className =
        this.parts.title.default.className =
          'info-title hidden'
      if (this.has_default && this.spec.default.title) {
        this.e.appendChild(this.parts.title.default)
        this.parts.title.default.innerText = this.spec.default.title
      }
      if (!this.parts.title.ref)
        (this.parts.title.base.firstElementChild as HTMLElement).innerText = this.parts.title.get()
      this.e.appendChild(this.parts.title.base)
      this.e.appendChild(this.parts.title.temp)
      this.parts.title.base.classList.add('hidden')
      this.parts.title.temp.classList.add('hidden')
    }
    if (this.spec.body || (this.has_default && this.spec.default.body)) {
      this.parts.body = {
        base: document.createElement('div'),
        temp: document.createElement('div'),
        default: document.createElement('div'),
        rows: [],
      }
      this.parts.body.temp.className =
        this.parts.body.base.className =
        this.parts.body.default.className =
          'info-body hidden'
      if (this.has_default && this.spec.default.body) this.parts.body.default.innerText = this.spec.default.body
      let h = 0
      this.spec.body &&
        (this.spec.body as {name: string; value: string; style: string}[]).forEach((op, i) => {
          const p = {
              name: new InfoPart(this, op.name),
              value: new InfoPart(this, op.value),
              base: document.createElement('div'),
              temp: document.createElement('div'),
            },
            base = document.createElement('div'),
            temp = document.createElement('div')
          this.parts.body.rows[i] = p
          this.parts.body.base.appendChild(p.base)
          this.parts.body.temp.appendChild(p.temp)
          p.temp.className = p.base.className = 'info-body-row-' + op.style
          h += 24 + ('stack' === op.style ? 24 : 0)
          if (p.name) {
            if (
              this.spec.variable_info &&
              'variables' in p.name.parsed &&
              this.site.patterns.measure_name.test(p.name.parsed.variables)
            ) {
              p.base.appendChild(document.createElement('button'))
              p.base.lastElementChild.role = 'button'
              p.base.lastElementChild.setAttribute('data-bs-toggle', 'modal')
              p.base.lastElementChild.setAttribute('data-bs-target', '#variable_info_display')
              p.base.lastElementChild.addEventListener('click', this.site.page.show_variable_info)
            } else p.base.appendChild(base)
            p.temp.appendChild(temp)
            base.className = temp.className = 'info-body-row-name'
            base.innerText = temp.innerText = p.name.get()
          }
          if (p.value) {
            p.base.appendChild(document.createElement('div'))
            p.temp.appendChild(document.createElement('div'))
          }
        })
      this.e.style.minHeight = h + 'px'
      this.e.appendChild(this.parts.body.base)
      this.e.appendChild(this.parts.body.default)
      this.e.appendChild(this.parts.body.temp)
    }
  }
  init() {
    if (this.spec.title && 'summary' === this.spec.title) {
      this.parts.title.parsed.summary = make_summary_table(this.site.data.format_value, this.e)
    }
    if (this.parts.body && this.parts.body.rows)
      this.parts.body.rows.forEach(r => {
        if (r.name && 'summary' === r.name.text)
          r.name.parsed.summary = make_summary_table(this.site.data.format_value, this.e)
        if (r.value) {
          if ('summary' === r.value.text) {
            r.value.parsed.summary = make_summary_table(this.site.data.format_value, this.e)
            r.base.lastElementChild.appendChild(r.value.parsed.summary)
          } else if ('filter' in r.value.parsed) {
            r.base.lastElementChild.appendChild(r.value.parsed.filter)
          } else {
            const base = r.base.lastElementChild as HTMLElement,
              temp = r.temp.lastElementChild as HTMLElement
            temp.className = base.className =
              'info-body-row-value' + ('statement' === r.value.parsed.variables ? ' statement' : '')
            if (r.name.ref && 'value' === r.value.text) r.value.ref = true
            if (!r.value.ref) temp.innerText = base.innerText = r.value.get()
          }
        }
      })
    this.update()
  }
  show(e: Entity, u: SiteOutputs) {
    this.update(e, u)
    this.showing = true
    if (this.spec.floating) this.e.classList.remove('hidden')
    if (this.parts.title) {
      if (this.selection) {
        this.parts.title.base.classList.add('hidden')
      } else this.parts.title.default.classList.add('hidden')
      this.parts.title.temp.classList.remove('hidden')
    }
    if (this.parts.body) {
      if (this.selection) {
        this.parts.body.base.classList.add('hidden')
      } else this.parts.body.default.classList.add('hidden')
      this.parts.body.temp.classList.remove('hidden')
    }
  }
  revert() {
    this.showing = false
    if (this.spec.floating) {
      this.e.classList.add('hidden')
    } else {
      if (this.parts.title) {
        if (this.selection) {
          this.parts.title.base.classList.remove('hidden')
        } else if (this.has_default) this.parts.title.default.classList.remove('hidden')
        this.parts.title.temp.classList.add('hidden')
      }
      if (this.parts.body) {
        if (this.selection) {
          this.parts.body.base.classList.remove('hidden')
        } else if (this.has_default) this.parts.body.default.classList.remove('hidden')
        this.parts.body.temp.classList.add('hidden')
      }
    }
  }
  async update(entity?: Entity, caller?: SiteOutputs, pass?: boolean) {
    const v = this.site.dataviews[this.view]
    if (!v) return
    const y = this.site.inputs[v.time_agg]
    this.v = this.site.valueOf(this.spec.variable || (caller && (caller.color || caller.y)) || v.y) as string
    this.dataset = v.get.dataset()
    if (y && !(this.dataset in this.site.data.meta.times)) {
      if (!(this.id in this.site.data.data_queue[this.dataset]))
        this.site.data.data_queue[this.dataset][this.id] = this.update
      return
    }
    this.time_agg = y ? (y.value() as number) - this.site.data.meta.times[this.dataset].range[0] : 0
    const time_range = this.v in this.site.data.variables && this.site.data.variables[this.v].time_range[this.dataset]
    this.time = time_range ? this.time_agg - time_range[0] : 0
    if (this.spec.show_summary) {
      this.var = this.v && (await this.site.data.get_variable(this.v, this.site.dataviews[this.view]))
      this.summary = this.view in this.var.views && this.var.views[this.view].summaries[this.dataset]
    }
    if (!this.processed) {
      this.processed = true
      if (!this.spec.floating) {
        this.site.add_dependency(this.view, {type: 'update', id: this.id})
        if (v.y in this.site.inputs) this.site.add_dependency(v.y, {type: 'update', id: this.id})
        if (y) this.site.add_dependency(v.time_agg as string, {type: 'update', id: this.id})
        if (this.spec.variable in this.site.inputs)
          this.site.add_dependency(this.spec.variable, {type: 'update', id: this.id})
      }
      if (this.parts.body)
        this.parts.body.rows.forEach(p => {
          if (!p.value.ref && p.value.text in this.site.inputs && 'variables' in p.name.parsed) {
            p.name.value_source = p.value.value_source = p.value.text
            p.value.ref = true
            p.value.parsed.data = ''
          }
        })
    }
    if (entity) {
      // hover information
      if (this.parts.title) {
        this.parts.title.temp.innerText = this.parts.title.get(entity, caller)
      }
      if (this.parts.body) {
        this.parts.body.rows.forEach(p => {
          if (p.name.ref) {
            if (p.name.value_source) p.name.value_source = p.value.text
            const e = p.name.get(entity, caller)
            if ('object' !== typeof e) {
              ;(p.temp.firstElementChild as HTMLElement).innerText = this.parse_variables(
                e,
                p.value.parsed.variables,
                entity
              )
            }
          }
          if (p.value.ref) {
            if (p.value.value_source) p.value.value_source = p.value.text
            const e = p.value.get(entity, caller)
            if ('object' !== typeof e) {
              ;(p.temp.lastElementChild as HTMLElement).innerText = this.parse_variables(
                e,
                p.value.parsed.variables,
                entity
              )
            }
          }
        })
      }
    } else if (!this.spec.floating) {
      if ((this.queue as number) > 0) clearTimeout(this.queue)
      this.queue = -1
      if (!pass) {
        if (!this.tab || this.tab.classList.contains('show'))
          this.queue = setTimeout(() => this.update(void 0, void 0, true), 50)
      } else {
        // base information
        entity = this.site.data.entities[v.get.single_id()]
        if (entity) {
          // when showing a selected region
          this.selection = true
          if (this.parts.title) {
            this.parts.title.base.classList.remove('hidden')
            this.parts.title.default.classList.add('hidden')
          }
          if (this.parts.body && this.has_default) this.parts.body.default.classList.add('hidden')
        } else {
          // when no ID is selected
          this.selection = false
          if (this.parts.title) {
            if (this.has_default) {
              this.parts.title.base.classList.add('hidden')
              this.parts.title.default.classList.remove('hidden')
            } else if (!this.parts.title.ref || !('features' in this.parts.title.parsed))
              this.parts.title.base.classList.remove('hidden')
          }
          if (this.parts.body) {
            this.parts.body.base.classList.add('hidden')
            if (this.has_default) this.parts.body.default.classList.remove('hidden')
          }
        }
        if (this.parts.title) {
          ;(this.parts.title.base.firstElementChild as HTMLElement).innerText = this.parts.title.get(entity, caller)
        }
        if (this.parts.body) {
          if (!this.spec.subto) this.parts.body.base.classList.remove('hidden')
          this.parts.body.rows.forEach(p => {
            if ('summary' in p.value.parsed) {
              this.fill_summary_table(p.value.parsed.summary, this.summary, this.time)
            } else if ('filter' in p.value.parsed) {
              const e = p.value.parsed.filter
              let n = 0
              e.innerHTML = ''
              if (this.site.view.selected.length) {
                n++
                const s = document.createElement('tr')
                s.className = 'filter-display'
                let ss = document.createElement('td'),
                  span = document.createElement('span')
                s.appendChild(ss)
                ss.appendChild(span)
                span.className = 'syntax-variable'
                span.innerText = 'Select Entities'
                s.appendChild((ss = document.createElement('td')))
                ss.appendChild((span = document.createElement('span')))
                span.className = 'syntax-operator'
                span.innerText = ':'
                s.appendChild((ss = document.createElement('td')))
                ss.setAttribute('colspan', '2')
                ss.appendChild((span = document.createElement('span')))
                span.className = 'syntax-value'
                let ids = ''
                this.site.view.selected.forEach(id => {
                  const entity = this.site.data.entities[id]
                  ids += (ids ? ', ' : '') + (entity && entity.features ? entity.features.name : id)
                })
                span.innerText = ids
                e.appendChild(s)
              }
              this.site.view.filters.forEach(f => {
                const checked = f.passed + f.failed
                if (f.active && checked) {
                  const result = f.passed + '/' + checked
                  ;(f.e.children[1].lastElementChild as HTMLElement).innerText = result
                  n++
                  const s = document.createElement('tr'),
                    info = this.site.data.variable_info[f.variable]
                  s.className = 'filter-display'
                  let ss = document.createElement('td'),
                    span = document.createElement('span')
                  s.appendChild(ss)
                  ss.appendChild(span)
                  span.className = 'syntax-variable'
                  span.title = f.variable
                  span.innerText = info.short_name as string
                  ss.appendChild((span = document.createElement('span')))
                  span.innerText = ' ('
                  ss.appendChild((span = document.createElement('span')))
                  span.className = 'syntax-component'
                  span.innerText = f.component as string
                  ss.appendChild((span = document.createElement('span')))
                  span.innerText = ')'
                  ss = document.createElement('td')
                  s.appendChild(ss)
                  ss.appendChild((span = document.createElement('span')))
                  span.className = 'syntax-operator'
                  span.innerText = f.operator
                  ss = document.createElement('td')
                  s.appendChild(ss)
                  ss.appendChild((span = document.createElement('span')))
                  span.className = 'syntax-value'
                  span.innerText = (
                    'number' === typeof f.value ? this.site.data.format_value(f.value) : f.value
                  ) as string
                  ss = document.createElement('td')
                  s.appendChild(ss)
                  ss.appendChild((span = document.createElement('span')))
                  span.innerText = '(' + (f.value_source ? f.value_source + '; ' : '') + result + ')'
                  e.appendChild(s)
                }
              })
              this.e.classList[n ? 'remove' : 'add']('hidden')
            }
            if (('variables' in p.value.parsed || 'summary' in p.value.parsed) && !(v.y in this.depends)) {
              this.depends[v.y] = true
              this.site.add_dependency(v.y, {type: 'update', id: this.id})
            } else if ('filter' in p.value.parsed && !('viewFilter' in this.depends)) {
              this.depends.viewFilter = true
              this.site.add_dependency('view.filter', {type: 'update', id: this.id})
            }
            if (p.name.ref) {
              if (p.name.value_source) p.name.value_source = p.value.text
              const e = p.name.get(entity, caller)
              if ('object' !== typeof e) {
                ;(p.base.firstElementChild as HTMLElement).innerText = e
              }
            }
            if (p.value.ref) {
              const e = p.value.get(entity, caller)
              if (Array.isArray(e)) {
                if ('sources' === p.value.parsed.variables) {
                  p.base.innerHTML = ''
                  p.base.appendChild(document.createElement('table'))
                  p.base.lastElementChild.className = 'source-table'
                  p.base.firstElementChild.appendChild(document.createElement('thead'))
                  p.base.firstElementChild.firstElementChild.appendChild(document.createElement('tr'))
                  p.base.firstElementChild.firstElementChild.firstElementChild.appendChild(document.createElement('th'))
                  p.base.firstElementChild.firstElementChild.firstElementChild.appendChild(document.createElement('th'))
                  ;(
                    p.base.firstElementChild.firstElementChild.firstElementChild.firstElementChild as HTMLElement
                  ).innerText = 'Source'
                  ;(
                    p.base.firstElementChild.firstElementChild.firstElementChild.lastElementChild as HTMLElement
                  ).innerText = 'Accessed'
                  p.base.firstElementChild.appendChild(document.createElement('tbody'))
                  e.forEach(ei => {
                    p.base.firstElementChild.lastElementChild.appendChild(make_variable_source(ei, true))
                  })
                }
              } else {
                ;(p.base.lastElementChild as HTMLElement).innerText = this.parse_variables(
                  e,
                  p.value.parsed.variables,
                  entity
                )
              }
            }
          })
        }
      }
    }
    this.revert()
  }
  parse_variables(s: string, type: string, entity: Entity) {
    if ('statement' === type) {
      const patterns = this.site.patterns
      for (let m, v; (m = patterns.mustache.exec(s)); ) {
        if ('value' === m[1]) {
          v = entity
            ? this.site.data.format_value(
                entity.get_value(this.v, this.time),
                this.dataset in this.site.data.variables[this.v].info &&
                  'integer' === this.site.data.variables[this.v].info[this.dataset].type
              )
            : NaN
          const info = this.site.data.variable_info[this.v] as MeasureInfo
          let type = info.unit || info.type
          if (info.aggregation_method && !(type in value_types)) type = info.aggregation_method
          s = s.replace(m[0], !isNaN(v as number) && type in value_types ? value_types[type](v) : v)
          patterns.mustache.lastIndex = 0
        } else if (entity) {
          if ('region_name' === m[1]) {
            s = s.replace(m[0], entity.features.name)
            patterns.mustache.lastIndex = 0
          } else if (patterns.features.test(m[1])) {
            s = s.replace(m[0], entity.features[m[1].replace(patterns.features, '')])
            patterns.mustache.lastIndex = 0
          } else if (patterns.variables.test(m[1])) {
            s = s.replace(
              m[0],
              entity.variables[this.v][m[1].replace(patterns.variables, '') as keyof Variable] as string
            )
            patterns.mustache.lastIndex = 0
          } else if (patterns.data.test(m[1])) {
            s = s.replace(m[0], entity.get_value(m[1].replace(patterns.data, ''), this.time))
            patterns.mustache.lastIndex = 0
          }
        }
      }
    }
    return s
  }
  fill_summary_table(table: HTMLTableElement, summary: Summary, time: number) {
    const e = table.lastElementChild.children as HTMLCollectionOf<HTMLTableRowElement>
    filter_components.summary.forEach((c: keyof Summary, i) => {
      e[i].innerText = this.site.data.format_value((summary[c] as number[])[time], 0 === i) as string
    })
  }
}
