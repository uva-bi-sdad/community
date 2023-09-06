import {Filter, FilterParsed, ResourceField, Summary, VariableFilterParsed} from '../types'
import {Combobox} from './elements/combobox'
import type Community from './index'
import {filter_components} from './static_refs'
import type {TutorialManager} from './tutorials'
import {fill_ids_options, make_summary_table, toggle_input, tooltip_clear, tooltip_trigger} from './utils'

interface Modal {
  init: boolean
  e: HTMLElement
  header: HTMLElement
  body: HTMLElement
}

export interface FilterUI extends Modal {
  conditions: HTMLElement
  variable_filters: HTMLElement
  entity_filters: HTMLElement
  entity_inputs: {[index: string]: Combobox}
}

export interface InfoUI extends Modal {
  body: HTMLElement
  title: HTMLElement
  description: HTMLElement
  name: HTMLElement
  sources: HTMLElement
  references: HTMLElement
  origin: HTMLElement
  source_file: HTMLElement
}

export class Page {
  site: Community
  load_screen: HTMLElement
  wrap: HTMLElement
  navbar: HTMLElement
  content: HTMLElement
  menus: NodeListOf<HTMLElement>
  panels: NodeListOf<HTMLElement>
  overlay: HTMLElement = document.createElement('div')
  selection: HTMLElement = document.createElement('span')
  script_style: HTMLStyleElement = document.createElement('style')
  modal: {info: InfoUI; filter: FilterUI} = {
    info: {
      init: false,
      e: document.createElement('div'),
      header: document.createElement('div'),
      body: document.createElement('div'),
      title: document.createElement('div'),
      description: document.createElement('div'),
      name: document.createElement('tr'),
      sources: document.createElement('div'),
      references: document.createElement('div'),
      origin: document.createElement('div'),
      source_file: document.createElement('div'),
    },
    filter: {
      init: false,
      e: document.createElement('div'),
      header: document.createElement('p'),
      body: document.createElement('div'),
      conditions: document.createElement('div'),
      variable_filters: document.createElement('div'),
      entity_filters: document.createElement('div'),
      entity_inputs: {},
    },
  }
  tooltip = {
    showing: '',
    e: document.createElement('div'),
  }
  content_bounds = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    outer_right: 0,
  }
  elementCount = 0
  top_menu?: HTMLElement
  right_menu?: HTMLElement
  bottom_menu?: HTMLElement
  left_menu?: HTMLElement
  tutorials?: TutorialManager
  constructor(site: Community) {
    this.site = site
    this.load_screen = document.getElementById('load_screen')
    this.wrap = document.getElementById('site_wrap')
    this.navbar = document.querySelector('.navbar')
    this.content = document.querySelector('.content')
    this.menus = document.querySelectorAll('menu-wrapper')
    this.panels = document.querySelectorAll('panel')
    this.resize = this.resize.bind(this)
    this.tooltip.e.className = 'tooltip hidden'
    this.tooltip.e.appendChild(document.createElement('p'))
    document.body.appendChild(this.tooltip.e)
    document.body.addEventListener('mouseover', tooltip_clear.bind(this))
  }
  init() {
    const e = this.modal.filter
    let p = document.createElement('p'),
      span = document.createElement('span'),
      div = document.createElement('div'),
      tr = document.createElement('tr')
    e.body.className = 'filter-dialog'
    // entity filter
    e.body.appendChild(e.entity_filters)
    e.entity_filters.appendChild(e.header)
    e.header.className = 'h6'
    e.header.innerText = 'Select Entities'
    span.className = 'note'
    span.innerText = '(click disabled selectors to load)'
    e.header.appendChild(span)
    e.entity_filters.appendChild(div)
    div.className = 'row'
    e.entity_inputs = {}
    Object.keys(this.site.data.loaded)
      .reverse()
      .forEach(d => {
        const u = Combobox.create(this.site, d, void 0, {search: true, multi: true, clearable: true}, 'filter.' + d)
        e.entity_inputs[d] = u
        e.entity_filters.lastElementChild.appendChild((div = document.createElement('div')))
        div.className = 'col-sm'
        div.appendChild(u.e.parentElement)
        u.e.parentElement.classList.add('form-floating')
        u.listbox.classList.add('multi')
        u.option_sets = {}
        u.dataset = d
        u.loader = () => {
          u.site.data.retrieve(u.dataset, u.site.data.info[u.dataset].site_file)
          u.e.removeEventListener('click', u.loader)
        }
        if (!u.site.data.loaded[d]) {
          u.e.addEventListener('click', u.loader)
        }
        u.onchange = () => {
          this.site.conditionals.id_filter()
          this.site.request_queue('_entity_filter')
        }
        fill_ids_options(u, d, u.option_sets, () => {
          u.set_current()
          toggle_input(u, !!u.options.length)
          Object.keys(u.values).forEach(id => {
            u.site.view.entities.set(id, u.site.data.entities[id])
          })
          u.site.view.registered[d] = true
          u.set(u.id in u.site.url_options ? (u.site.url_options[u.id] as string).split(',') : -1)
        })
        toggle_input(u, !!u.options.length)
      })

    e.body.appendChild(e.variable_filters)
    e.variable_filters.appendChild(p)
    p.className = 'h6'
    p.innerText = 'Variable Conditions'
    // variable filter dropdown
    e.variable_filters.appendChild((div = document.createElement('div')))
    div.className = 'row'
    div.appendChild((div = document.createElement('div')))
    div.className = 'col'
    div.appendChild((div = document.createElement('div')))
    const filter_select = Combobox.create(
      this.site,
      'Add Variable Condition',
      void 0,
      {strict: true, search: true, clearable: true, floating: true, accordion: true, group: 'category'},
      'filter_variable_dropdown'
    )
    filter_select.input = false
    filter_select.settings.filter_table = document.querySelector('.filter-body')
    filter_select.onchange = () => {
      const value = filter_select.value() as string
      if (value in this.site.data.variables) {
        this.add_filter_condition(value)
        this.selection.innerText = ''
        const input = document.querySelectorAll('.filter-body .combobox-input') as NodeListOf<HTMLElement>
        if (input && input.length) input[input.length - 1].focus()
      }
    }
    filter_select.view = this.site.defaults.dataview
    filter_select.option_sets = {}
    filter_select.optionSource = 'variables'
    this.site.add_dependency(this.site.defaults.dataview, {type: 'options', id: filter_select.id})
    e.variable_filters.firstElementChild.appendChild(filter_select.e.parentElement)
    // variable filter table
    e.variable_filters.appendChild((div = document.createElement('div')))
    div.className = 'hidden'
    div.appendChild(e.conditions)
    e.conditions.className = 'table'
    e.conditions.appendChild(document.createElement('thead'))
    e.conditions.lastElementChild.className = 'filter-header'
    e.conditions.lastElementChild.appendChild(document.createElement('tbody'))
    e.conditions.lastElementChild.className = 'filter-body'
    e.conditions.firstElementChild.appendChild(tr)
    ;['Variable', 'Result', 'Active', 'Component', 'Operator', 'Value', 'Remove'].forEach(h => {
      const th = document.createElement('th')
      tr.appendChild(th)
      if ('Component' === h || 'Result' === h) {
        const l =
          'Component' === h
            ? {
                wrapper: document.createElement('label'),
                id: 'filter_component_header',
                note: 'Component refers to which single value to filter on for each entity; select a dynamic time reference, or enter a time.',
              }
            : {
                wrapper: document.createElement('label'),
                id: 'filter_result_header',
                note: 'Passing / total entities across loaded datasets.',
              }
        th.appendChild(l.wrapper)
        th.className = 'has-note'
        l.wrapper.innerText = h
        l.wrapper.id = l.id
        l.wrapper.setAttribute('data-of', l.id)
        l.wrapper.setAttribute('aria-description', l.note)
        th.addEventListener('mouseover', tooltip_trigger.bind(l))
      } else {
        th.innerText = h
      }
    })
    e.variable_filters.lastElementChild.appendChild((p = document.createElement('p')))
    p.className = 'note'
    p.innerText = 'Summaries are across time within each unfiltered dataset.'
    if (this.site.query) {
      this.site.parsed_query = this.site.data.parse_query(this.site.query)
      if (this.site.parsed_query.variables.conditions.length) {
        this.site.parsed_query.variables.conditions.forEach(f => {
          const info = this.site.data.variable_info[f.name]
          if (info) this.add_filter_condition(f.name, f)
        })
      }
    }
  }
  resize(e?: Event | boolean) {
    const full = e && 'boolean' === typeof e,
      f = this[full ? 'wrap' : 'content']
    if (!full) {
      f.style.top =
        (this.top_menu && 'open' === this.top_menu.dataset.state
          ? this.top_menu.getBoundingClientRect().height
          : this.content_bounds.top +
            ((!this.top_menu && !this.left_menu && !this.right_menu) ||
            (this.right_menu && 'open' === this.right_menu.dataset.state) ||
            (this.left_menu && 'open' === this.left_menu.dataset.state)
              ? 0
              : 40)) + 'px'
      f.style.bottom =
        this.content_bounds.bottom +
        (!this.bottom_menu || 'closed' === this.bottom_menu.dataset.state
          ? 0
          : this.bottom_menu.getBoundingClientRect().height) +
        'px'
      f.style.left =
        this.content_bounds.left +
        (!this.left_menu || 'closed' === this.left_menu.dataset.state
          ? 0
          : this.left_menu.getBoundingClientRect().width) +
        'px'
    }
    f.style.right =
      this.content_bounds[full ? 'outer_right' : 'right'] +
      (!this.right_menu || 'closed' === this.right_menu.dataset.state
        ? 0
        : this.right_menu.getBoundingClientRect().width) +
      'px'
  }
  add_filter_condition(variable: string, presets?: VariableFilterParsed | Filter) {
    presets = presets || {operator: '>=', value: 0}
    let tr = document.createElement('tr'),
      td = document.createElement('td'),
      p = document.createElement('p'),
      label = document.createElement('label'),
      div = document.createElement('div'),
      input = document.createElement('input'),
      select = document.createElement('select'),
      button = document.createElement('button')
    const f: FilterParsed = {
        e: tr,
        variable: variable,
        component: presets.component || 'last',
        operator: presets.operator || '>=',
        value: (presets.value as string | number) || 0,
        active: true,
        id: variable + '_' + Date.now(),
        passed: 0,
        failed: 0,
        info: this.site.data.variables[variable].info,
        view: this.site.dataviews[this.site.defaults.dataview],
      },
      d = f.view.get.dataset(),
      range = f.info[d].time_range,
      times = this.site.data.meta.overall.value
    this.site.view.filters.set(f.id, f)
    if ('number' === typeof f.component) f.component = times[f.component] + ''
    // variable name
    tr.appendChild(document.createElement('td'))
    tr.lastElementChild.appendChild(p)
    p.id = f.id
    p.className = 'cell-text'
    p.innerText = f.info[d].info.short_name
    tr.lastElementChild.appendChild(document.createElement('p'))
    f.summary = {
      f,
      table: make_summary_table(this.site.data.format_value, tr, f.info[d], f.summary.add),
      update: function () {
        const d = f.view.get.dataset(),
          range = f.info[d].time_range
        if (d !== this.add.Dataset) {
          this.add.Dataset = d
          this.add.First = this.times[range[0]] + '' || 'NA'
          this.add.Last = this.times[range[1]] + '' || 'NA'
          const s = this.f.info[d],
            cells = this.table.firstElementChild.children as HTMLCollectionOf<HTMLTableCellElement>
          for (let i = cells.length; i--; ) {
            const h = cells[i].innerText as keyof typeof this.add,
              n = h.toLowerCase() as keyof ResourceField
            cells[i].innerText = n in s ? this.format(s[n] as number) + '' : this.add[h]
          }
        }
      },
      add: {
        Dataset: d,
        First: times[range[0]] + '' || 'NA',
        Last: times[range[1]] + '' || 'NA',
      },
      times: this.site.data.meta.overall.value,
      format: this.site.data.format_value,
    }
    // filter result
    tr.appendChild(td)
    td.appendChild((p = document.createElement('p')))
    p.setAttribute('aria-describedby', f.id)
    p.className = 'cell-text'
    p.innerText = '0/0'
    // active switch
    tr.appendChild((td = document.createElement('td')))
    td.appendChild(label)
    label.innerText = 'Active'
    label.className = 'filter-label'
    label.id = f.id + '_switch'
    tr.appendChild(div)
    div.className = 'form-check form-switch filter-form-input'
    div.appendChild(input)
    input.className = 'form-check-input'
    input.type = 'checkbox'
    input.role = 'switch'
    input.setAttribute('aria-labelledby', f.id + '_switch')
    input.setAttribute('aria-describedby', f.id)
    input.checked = true
    input.addEventListener('change', () => {
      f.active = !f.active
      this.site.request_queue('_base_filter')
    })
    // component combobox
    tr.appendChild((td = document.createElement('td')))
    td.appendChild((label = document.createElement('label')))
    label.innerText = 'Component'
    label.className = 'filter-label'
    label.id = f.id + '_component'
    const comp_select = Combobox.create(this.site, 'component', filter_components.Time)
    comp_select.default = f.component
    comp_select.set(f.component)
    tr.lastElementChild.appendChild(comp_select.e.parentElement)
    comp_select.e.parentElement.removeChild(comp_select.e.parentElement.lastElementChild)
    comp_select.e.parentElement.classList.add('filter-form-input')
    comp_select.e.setAttribute('aria-labelledby', f.id + '_component')
    comp_select.input_element.setAttribute('aria-labelledby', f.id + '_component')
    comp_select.input_element.setAttribute('aria-describedby', f.id)
    comp_select.listbox.setAttribute('aria-labelledby', f.id + '_component')
    comp_select.onchange = () => {
      f.component = comp_select.value() as string
      this.site.request_queue('_base_filter')
    }
    // operator select
    tr.appendChild((td = document.createElement('td')))
    td.appendChild((label = document.createElement('label')))
    label.innerText = 'Operator'
    label.className = 'filter-label'
    label.id = f.id + '_operator'
    tr.lastElementChild.appendChild(select)
    select.className = 'form-select filter-form-input'
    select.setAttribute('aria-labelledby', f.id + '_operator')
    select.setAttribute('aria-describedby', f.id)
    select.addEventListener('change', e => {
      f.operator = (e.target as HTMLSelectElement).selectedOptions[0].value
      this.site.request_queue('_base_filter')
    })
    ;['>=', '=', '!=', '<='].forEach(k => {
      const option = document.createElement('option')
      select.appendChild(option)
      option.value = option.innerText = k
      if (k === f.operator) option.selected = true
    })
    // value input
    tr.appendChild((td = document.createElement('td')))
    td.appendChild((label = document.createElement('label')))
    label.innerText = 'Value'
    label.className = 'filter-label'
    label.id = f.id + '_value'
    const value_select = Combobox.create(this.site, 'component', ['min', 'q1', 'median', 'mean', 'q3', 'max'])
    value_select.value_type = 'number'
    value_select.default = f.value
    value_select.set(f.value)
    td.appendChild(value_select.e.parentElement)
    value_select.e.parentElement.removeChild(value_select.e.parentElement.lastElementChild)
    value_select.e.parentElement.classList.add('filter-form-input')
    value_select.e.setAttribute('aria-labelledby', f.id + '_value')
    value_select.input_element.setAttribute('aria-labelledby', f.id + '_value')
    value_select.input_element.setAttribute('aria-describedby', f.id)
    value_select.listbox.setAttribute('aria-labelledby', f.id + '_value')
    value_select.onchange = async function (this: Combobox, f: FilterParsed) {
      f.value = this.value() as number | string
      if (this.site.patterns.number.test(f.value + '')) {
        f.value = +f.value
        f.value_source = ''
      } else {
        f.view.reparse()
        const v = await this.site.data.get_variable(f.variable, f.view),
          s = v && v.views[f.view.id].summaries[f.view.parsed.dataset]
        if (s && f.value in s) {
          const a = f.view.parsed.variable_values.get(f.id),
            k = f.value as keyof Summary,
            time = a.comp_fun(a, f.view.parsed) as number
          f.value_source = f.value
          f.value = (s[k] as (number | string)[])[time]
        }
      }
      this.site.request_queue('_base_filter')
    }.bind(value_select, f)
    // remove button
    tr.appendChild((td = document.createElement('td')))
    td.appendChild((label = document.createElement('label')))
    label.innerText = 'Remove'
    label.className = 'filter-label'
    label.id = f.id + '_remove'
    td.appendChild(button)
    button.className = 'btn-close filter-form-input'
    button.type = 'button'
    button.setAttribute('aria-labelledby', f.id + '_remove')
    button.setAttribute('aria-describedby', f.id)
    button.addEventListener(
      'mouseup',
      function (this: {filter: FilterParsed; site: Community}, e: MouseEvent) {
        if (!e.button) {
          this.filter.e.parentElement.removeChild(this.filter.e)
          this.site.view.filters.delete(this.filter.id)
          if (!this.site.view.filters.size)
            this.site.page.modal.filter.variable_filters.lastElementChild.classList.add('hidden')
          this.site.request_queue('_base_filter')
        }
      }.bind({filter: f, site: this.site})
    )
    this.site.request_queue('_base_filter')
    this.site.page.modal.filter.conditions.lastElementChild.appendChild(tr)
    this.site.page.modal.filter.variable_filters.lastElementChild.classList.remove('hidden')
  }
}
