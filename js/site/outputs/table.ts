import type {Entity, ObjectIndex, Order, Summary, Variable} from '../../types'
import type {SiteDataView} from '../dataview'
import type Community from '../index'
import type {SiteInputs} from '../inputs/index'
import type {DataTableSpec} from './datatables'
import {BaseOutput} from './index'

export class OutputTable extends BaseOutput {
  type: 'table'
  clickto?: SiteInputs
  spec: DataTableSpec
  parsed: {
    summary?: Summary
    order?: Order
    time?: number
    color?: string
    dataset?: string
    time_index?: ObjectIndex
    time_range?: number[]
    variable?: Variable
  } = {}
  time: string
  queue: number | NodeJS.Timeout = -1
  state: string = ''
  reference_options: {[index: string]: string} = {}
  header: {
    title: string
    data?: string | Function
    type?: string
    render?: Function
    dataset?: string
    variable?: string
  }[] = []
  rows: {[index: string]: HTMLTableRowElement} = {}
  parts = {
    head: document.createElement('thead'),
    body: document.createElement('tbody'),
  }
  current_variable = ''
  constructor(e: HTMLElement, site: Community) {
    super(e, site)
    this.mouseover = this.mouseover.bind(this)
    this.mouseout = this.mouseout.bind(this)
    this.click = this.click.bind(this)
    this.parts.head.appendChild(document.createElement('tr'))
    this.e.appendChild(this.parts.head)
    this.e.appendChild(this.parts.body)
    if (this.click) this.e.classList.add('interactive')
    if ('string' === typeof this.spec.variables) this.spec.variable_source = this.spec.variables
    const click_ref = e.dataset.click
    if (click_ref in this.site.inputs) this.clickto = this.site.inputs[click_ref]
    Object.keys(this.spec).forEach(k => {
      const opt = this.spec[k]
      if ('string' === typeof opt && opt in site.inputs) this.reference_options[k] = opt
    })
    this.e.addEventListener('mouseover', this.mouseover)
    this.e.addEventListener('mouseout', this.mouseout)
    if (this.tab) {
      document.getElementById(e.parentElement.getAttribute('aria-labelledby')).addEventListener(
        'click',
        function (this: OutputTable) {
          if (!this.e.parentElement.classList.contains('active')) {
            setTimeout(this.update, 155)
            setTimeout(this.site.page.trigger_resize, 155)
          }
        }.bind(this)
      )
    }
  }
  init() {
    if (this.spec.variable_source in this.site.inputs)
      this.site.add_dependency(this.spec.variable_source, {type: 'update', id: this.id})
    if (this.view) {
      this.site.add_dependency(this.view, {type: 'update', id: this.id})
      this.site.add_dependency(this.view + '_filter', {type: 'update', id: this.id})
      this.site.add_dependency(this.site.dataviews[this.view].time_agg as string, {type: 'update', id: this.id})
    } else this.view = this.site.defaults.dataview
    this.update()
  }
  show(e: Entity) {
    if (e.features) {
      const row = this.rows[e.features.id]
      if (row && row.parentElement) {
        row.classList.add('highlighted')
        if (this.site.spec.settings.table_autoscroll) {
          const h = this.e.parentElement.getBoundingClientRect().height,
            top = row.getBoundingClientRect().y - row.parentElement.getBoundingClientRect().y
          this.e.parentElement.scroll({
            top: h > this.e.scrollHeight - top ? this.e.parentElement.scrollHeight : top,
            behavior: (this.site.spec.settings.table_scroll_behavior as ScrollBehavior) || 'smooth',
          })
        }
      }
    }
  }
  revert(e: Entity) {
    if (e.features && e.features.id in this.rows) {
      this.rows[e.features.id].classList.remove('highlighted')
    }
  }
  createHeader(v: SiteDataView) {
    const dataset = this.parsed.dataset,
      time = this.site.data.meta.times[dataset],
      tr = this.parts.head.firstElementChild,
      range = this.parsed.variable.time_range[dataset],
      start = range[0],
      end = range[1] + 1,
      ns = this.parsed.summary.n
    let th = document.createElement('th'),
      span = document.createElement('span')
    this.parsed.time_index = {}
    tr.innerHTML = ''
    tr.appendChild(th)
    th.appendChild(span)
    span.innerText = 'Name'
    for (let i = start, nshowing = 0; i < end; i++) {
      if (v.times[i] && (this.site.spec.settings.show_empty_times || ns[i - start])) {
        this.parsed.time_index[time.value[i]] = nshowing++
        tr.appendChild((th = document.createElement('th')))
        th.appendChild((span = document.createElement('span')))
        span.innerText = time.value[i] + ''
      }
    }
  }
  appendRows(v: SiteDataView) {
    const es = this.parsed.order,
      variable = this.parsed.variable,
      times = this.site.data.meta.times[this.parsed.dataset].value,
      range = variable.time_range[this.parsed.dataset],
      start = range[0],
      dn = range[1] - start + 1,
      selection = v.selection.all
    this.current_variable = variable.code + this.parsed.dataset
    this.parts.body.innerHTML = ''
    for (let n = es.length; n--; ) {
      const id = es[n][0]
      if (id in selection) {
        const e = this.site.data.entities[id],
          d = e.data[variable.code],
          tr = document.createElement('tr')
        this.rows[id] = tr
        tr.dataset.entityId = id
        let td = document.createElement('td')
        td.innerText = e.features.name
        tr.appendChild(td)
        if (Array.isArray(d)) {
          for (let i = 0; i < dn; i++) {
            if (v.times[i + start] && times[i + start] in this.parsed.time_index) {
              tr.appendChild((td = document.createElement('td')))
              td.innerText = this.site.data.format_value(d[i]) as string
              if (i === this.parsed.time) td.classList.add('highlighted')
            }
          }
        } else {
          tr.appendChild((td = document.createElement('td')))
          td.innerText = this.site.data.format_value(d) as string
          td.dataset.entityId = id
          td.classList.add('highlighted')
        }
        this.parts.body.appendChild(tr)
      }
    }
    if (
      this.site.spec.settings.table_autoscroll &&
      this.parts.head.firstElementChild.childElementCount > 2 &&
      this.parts.head.firstElementChild.childElementCount > this.parsed.time + 1
    ) {
      const w = this.e.parentElement.getBoundingClientRect().width,
        col = this.parts.head.firstElementChild.children[this.parsed.time + 1].getBoundingClientRect()
      this.e.parentElement.scroll({
        left: col.x - this.e.getBoundingClientRect().x + col.width + 16 - w,
        behavior: (this.site.spec.settings.table_scroll_behavior as ScrollBehavior) || 'smooth',
      })
    }
  }
  async update(pass?: boolean) {
    if ((this.queue as number) > 0) clearTimeout(this.queue)
    this.queue = -1
    if (!pass) {
      if (!this.tab || this.tab.classList.contains('show')) this.queue = setTimeout(() => this.update(true), 50)
    } else {
      let vn =
        this.spec.variable_source &&
        (this.site.valueOf(this.spec.variable_source) as string).replace(this.site.patterns.all_periods, '\\.')
      const v = this.site.dataviews[this.view],
        d = v.get.dataset(),
        time = this.site.valueOf(v.time_agg),
        state =
          d +
          v.value() +
          v.get.time_filters() +
          this.site.spec.settings.digits +
          vn +
          time +
          this.site.spec.settings.show_empty_times
      if (!this.site.data.inited[d]) return
      if (state !== this.state) {
        this.state = state
        Object.keys(this.reference_options).forEach(
          k => (this.spec[k] = this.site.valueOf(this.reference_options[k]) as string)
        )
        const variable = await this.site.data.get_variable(vn, v)
        this.parsed.dataset = d
        this.parsed.color = vn
        this.parsed.variable = variable
        this.parsed.time_range = variable.time_range[d]
        this.parsed.time =
          ('number' === typeof time ? time - this.site.data.meta.times[d].range[0] : 0) - this.parsed.time_range[0]
        this.parsed.summary = variable.views[this.view].summaries[d]
        this.parsed.order = variable.views[this.view].order[d][this.parsed.time]
        this.createHeader(v)
        this.appendRows(v)
      }
    }
  }
  mouseover(e: MouseEvent) {
    const target = e.target as HTMLElement,
      row = 'TD' === target.tagName ? target.parentElement : target,
      id = row.dataset.entityId
    if (id) {
      row.classList.add('highlighted')
      this.site.subs.update(this.id, 'show', this.site.data.entities[id])
    }
  }
  mouseout(e: MouseEvent) {
    const target = e.target as HTMLElement,
      row = 'TD' === target.tagName ? target.parentElement : target,
      id = row.dataset.entityId
    if (id) {
      row.classList.remove('highlighted')
      this.site.subs.update(this.id, 'revert', this.site.data.entities[id])
    }
  }
  click(e: MouseEvent) {
    const target = e.target as HTMLElement,
      row = 'TD' === target.tagName ? target.parentElement : target,
      id = row.dataset.entityId
    if (this.clickto && id) this.clickto.set(id)
  }
}
