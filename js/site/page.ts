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
  time_range: HTMLElement
}

export interface InfoUI extends Modal {
  body: HTMLElement
  title: HTMLElement
  description: HTMLElement
  name: HTMLElement
  type: HTMLElement
  sources: HTMLElement
  references: HTMLElement
  origin: HTMLElement
  source_file: HTMLElement
}

type Side = 'top' | 'left' | 'bottom' | 'right'
class PageMenu {
  e: HTMLElement
  wrapper: HTMLElement
  toggler?: HTMLButtonElement
  side: Side
  page: Page
  timeout: number | NodeJS.Timeout = -1
  constructor(e: HTMLElement, page: Page) {
    this.e = e
    this.wrapper = e.parentElement
    this.page = page
    this.hide = this.hide.bind(this)
    this.toggle = this.toggle.bind(this)
    const has_toggler = e.lastElementChild.tagName === 'BUTTON'
    if (has_toggler) this.toggler = e.lastElementChild as HTMLButtonElement
    if (e.classList.contains('menu-top')) {
      this.side = 'top'
      page.top_menu = this
      e.style.left = page.content_bounds.left + 'px'
      e.style.right = page.content_bounds.right + 'px'
      if (has_toggler) {
        this.toggler.addEventListener('click', this.toggle)
        this.toggler.style.top = page.content_bounds.top + 'px'
      }
    } else if (e.classList.contains('menu-right')) {
      this.side = 'right'
      page.right_menu = this
      e.style.right = page.content_bounds.right + 'px'
      if (has_toggler) {
        this.toggler.addEventListener('click', this.toggle)
        this.toggler.style.top = page.content_bounds.top + 'px'
      }
    } else if (e.classList.contains('menu-bottom')) {
      this.side = 'bottom'
      page.bottom_menu = this
      page.content_bounds.bottom = 40
      page.bottom_menu.e.style.left = page.content_bounds.left + 'px'
      page.bottom_menu.e.style.right = page.content_bounds.right + 'px'
      if (has_toggler) {
        this.toggler.addEventListener('click', this.toggle)
      }
    } else if (e.classList.contains('menu-left')) {
      this.side = 'left'
      page.left_menu = this
      e.style.left = page.content_bounds.left + 'px'
      if (has_toggler) {
        this.toggler.addEventListener('click', this.toggle)
        this.toggler.style.top = page.content_bounds.top + 'px'
      }
    }
  }
  hide() {
    this.timeout = -1
    this.e.firstElementChild.classList.add('hidden')
    this.page.resize()
  }
  toggle() {
    if (this.timeout !== -1) clearTimeout(this.timeout)
    this.timeout = -1
    if ('closed' === this.e.dataset.state) {
      this.e.dataset.state = 'open'
      this.e.firstElementChild.classList.remove('hidden')
      this.e.style[this.side] = '0px'
      this.page.content.style[this.side] =
        this.e.getBoundingClientRect()['left' === this.side || 'right' === this.side ? 'width' : 'height'] + 'px'
      if ('top' === this.side || 'bottom' === this.side)
        this.toggler.style[this.side] = this.page.content_bounds[this.side] + 'px'
      setTimeout(this.page.trigger_resize, 300)
    } else {
      this.e.dataset.state = 'closed'
      if ('left' === this.side || 'right' === this.side) {
        this.e.style[this.side] = -this.e.getBoundingClientRect().width + 'px'
        this.page.content.style[this.side] = this.page.content_bounds[this.side] + 'px'
      } else {
        const b = this.e.getBoundingClientRect()
        this.page.content.style[this.side] = this.page.content_bounds[this.side] + ('top' === this.side ? 40 : 0) + 'px'
        this.e.style[this.side] = -b.height + ('top' === this.side ? this.page.content_bounds.top : 0) + 'px'
        if ('top' === this.side || 'bottom' === this.side) this.toggler.style[this.side] = b.height + 'px'
      }
      this.timeout = setTimeout(this.hide, 300)
    }
  }
}

export class Page {
  site: Community
  load_screen: HTMLElement
  wrap: HTMLElement
  navbar: DOMRect | {height: number}
  content: HTMLElement
  menus: PageMenu[] = []
  panels: NodeListOf<HTMLElement>
  overlay = document.createElement('div')
  selection = document.createElement('span')
  script_style = document.createElement('style')
  modal: {info: InfoUI; filter: FilterUI} = {
    info: {
      init: false,
      e: document.createElement('div'),
      header: document.createElement('div'),
      body: document.createElement('div'),
      title: document.createElement('div'),
      description: document.createElement('div'),
      name: document.createElement('tr'),
      type: document.createElement('tr'),
      sources: document.createElement('div'),
      references: document.createElement('div'),
      origin: document.createElement('div'),
      source_file: document.createElement('div'),
    },
    filter: {
      init: false,
      e: document.createElement('div'),
      header: document.createElement('div'),
      body: document.createElement('div'),
      conditions: document.createElement('div'),
      variable_filters: document.createElement('div'),
      entity_filters: document.createElement('div'),
      entity_inputs: {},
      time_range: document.createElement('div'),
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
  top_menu?: PageMenu
  right_menu?: PageMenu
  bottom_menu?: PageMenu
  left_menu?: PageMenu
  tutorials?: TutorialManager
  constructor(site: Community) {
    this.site = site
    this.load_screen = document.getElementById('load_screen')
    this.wrap = document.getElementById('site_wrap')
    const navbar = document.querySelector('.navbar')
    this.navbar = navbar ? navbar.getBoundingClientRect() : {height: 0}
    this.content = document.querySelector('.content')
    this.panels = document.querySelectorAll('.panel')
    this.init_panel = this.init_panel.bind(this)
    this.resize = this.resize.bind(this)
    window.addEventListener('resize', this.resize)
    this.tooltip.e.className = 'tooltip hidden'
    this.tooltip.e.appendChild(document.createElement('p'))
    document.body.appendChild(this.tooltip.e)
    document.body.addEventListener('mouseover', tooltip_clear.bind(this))
    this.overlay.className = 'content-overlay'
    document.body.appendChild(this.overlay)
    document.body.className =
      site.storage.get('theme_dark') || site.spec.settings.theme_dark ? 'dark-theme' : 'light-theme'
    this.content_bounds.top = this.navbar.height
  }
  init() {
    this.panels.length && this.panels.forEach(this.init_panel)
    document.querySelectorAll('.menu-wrapper').forEach((m: HTMLElement) => {
      const menu = new PageMenu(m, this)
      this.menus.push(menu)
      if (this.site.url_options.close_menus && 'open' === menu.wrapper.dataset.state) menu.toggler.click()
    })
    if (this.content) {
      this.content.style.top =
        (this.top_menu ? this.top_menu.e.getBoundingClientRect().height : this.navbar.height) + 'px'
    }
    this.init_variable_info()
    this.init_filter()
  }
  init_panel(p: HTMLElement) {
    const side = p.classList.contains('panel-left') ? 'left' : 'right'
    this.content_bounds[side] = p.getBoundingClientRect().width
    p.style.marginTop = this.content_bounds.top + 'px'
    p.lastElementChild.addEventListener('click', () => {
      const w = p.getBoundingClientRect().width,
        bw = p.lastElementChild.getBoundingClientRect().width
      if ('true' === p.lastElementChild.getAttribute('aria-expanded')) {
        this.content_bounds[side] = bw
        if (this.top_menu) this.top_menu.e.style[side] = bw + 'px'
        if (this.bottom_menu) this.bottom_menu.e.style[side] = bw + 'px'
        p.style[side] = -w + bw + 'px'
        p.lastElementChild.setAttribute('aria-expanded', 'false')
      } else {
        this.content_bounds[side] = w
        if (this.top_menu) this.top_menu.e.style[side] = w + 'px'
        if (this.bottom_menu) this.bottom_menu.e.style[side] = w + 'px'
        p.style[side] = '0px'
        p.lastElementChild.setAttribute('aria-expanded', 'true')
      }
      this.resize()
      setTimeout(this.trigger_resize, 200)
    })
  }
  init_variable_info() {
    const e = this.modal.info,
      button = document.createElement('button'),
      a = document.createElement('a')
    let th = document.createElement('th'),
      p = document.createElement('p'),
      div = document.createElement('div'),
      ul = document.createElement('ul')
    document.body.appendChild(e.e)
    this.modal.info.init = true
    e.e.id = 'variable_info_display'
    e.e.className = 'modal fade'
    e.e.setAttribute('tabindex', '-1')
    e.e.setAttribute('aria-labelledby', 'variable_info_title')
    e.e.setAttribute('aria-hidden', 'true')
    e.e.appendChild(div)
    div.className = 'modal-dialog modal-dialog-scrollable'
    div.appendChild((div = document.createElement('div')))
    div.className = 'modal-content'
    div.appendChild(e.header)
    e.header.className = 'modal-header'
    e.header.appendChild(document.createElement('p'))
    e.header.firstElementChild.className = 'h5 modal-title'
    e.header.firstElementChild.id = 'variable_info_title'
    e.header.appendChild(button)
    button.type = 'button'
    button.className = 'btn-close'
    button.setAttribute('data-bs-dismiss', 'modal')
    button.title = 'close'
    e.header.insertAdjacentElement('afterend', e.body)
    e.body.className = 'modal-body'
    e.body.appendChild((e.title = document.createElement('p')))
    e.title.className = 'h4'
    e.body.appendChild((e.description = document.createElement('p')))

    e.body.appendChild(document.createElement('table'))
    e.body.lastElementChild.className = 'info-feature-table'

    e.body.lastElementChild.appendChild((e.name = document.createElement('tr')))
    e.name.appendChild(th)
    th.innerText = 'Name'
    e.name.appendChild(document.createElement('td'))

    e.body.lastElementChild.appendChild((e.type = document.createElement('tr')))
    e.type.appendChild((th = document.createElement('th')))
    th.innerText = 'Type'
    e.type.appendChild(document.createElement('td'))

    e.body.appendChild(e.sources)
    e.sources.appendChild(p)
    p.innerText = 'Sources'
    p.className = 'h3'
    e.sources.appendChild((div = document.createElement('div')))
    div.className = 'sources-cards'

    e.body.appendChild(e.references)
    e.references.appendChild((p = document.createElement('p')))
    p.className = 'h3'
    p.innerText = 'References'
    e.references.appendChild(ul)
    ul.className = 'reference-list'

    e.body.appendChild(e.origin)
    e.origin.appendChild((p = document.createElement('p')))
    p.className = 'h3'
    p.innerText = 'Origin'
    e.origin.appendChild((ul = document.createElement('ul')))
    ul.className = 'origin-list'

    e.body.appendChild(e.source_file)
    e.source_file.className = 'info-source-file'
    e.source_file.appendChild(a)
    a.innerText = 'source'
    a.target = '_blank'
    a.rel = 'noreferrer'
  }
  init_filter() {
    // set up filter's time range
    const e = this.modal.filter,
      button = document.createElement('button')
    let p = document.createElement('p'),
      div = document.createElement('div'),
      input = document.createElement('input'),
      label = document.createElement('label'),
      span = document.createElement('span'),
      tr = document.createElement('tr')
    document.body.appendChild(e.e)
    this.modal.filter.init = true
    e.e.id = 'filter_display'
    e.e.className = 'modal fade'
    e.e.setAttribute('aria-labelledby', 'filter_title')
    e.e.setAttribute('aria-hidden', 'true')
    e.e.appendChild(div)
    div.className = 'modal-dialog'
    div.appendChild((div = document.createElement('div')))
    div.className = 'modal-content'
    div.appendChild(e.header)

    e.header.className = 'modal-header'
    e.header.appendChild(p)
    p.className = 'h5 modal-title'
    p.id = 'filter_title'
    p.innerText = 'Filter'
    e.header.appendChild(button)
    button.type = 'button'
    button.className = 'btn-close'
    button.setAttribute('data-bs-dismiss', 'modal')
    button.title = 'close'
    e.header.insertAdjacentElement('afterend', e.body)
    e.body.className = 'modal-body filter-dialog'
    e.body.appendChild((p = document.createElement('p')))
    p.className = 'h6'
    p.innerText = 'Time Range'

    e.body.appendChild(e.time_range)
    e.time_range.className = 'row'

    e.time_range.appendChild((div = document.createElement('div')))
    div.className = 'col'
    div.appendChild((div = document.createElement('div')))
    div.className = 'form-floating text-wrapper wrapper'
    div.appendChild(input)
    input.className = 'form-control auto-input'
    input.setAttribute('data-autoType', 'number')
    input.setAttribute('data-default', 'min')
    input.max = 'filter.time_max'
    input.type = 'number'
    input.id = 'filter.time_min'
    input.appendChild(label)
    label.innerText = 'First Time'
    label.setAttribute('for', 'filter.time_min')
    e.time_range.appendChild((div = document.createElement('div')))
    div.className = 'col'
    div.appendChild((div = document.createElement('div')))
    div.className = 'form-floating text-wrapper wrapper'
    div.appendChild((input = document.createElement('input')))
    input.className = 'form-control auto-input'
    input.setAttribute('data-autoType', 'number')
    input.setAttribute('data-default', 'max')
    input.min = 'filter.time_min'
    input.type = 'number'
    input.id = 'filter.time_max'
    div.appendChild((label = document.createElement('label')))
    label.innerText = 'Last Time'
    label.setAttribute('for', 'filter.time_max')

    // entity filter
    e.body.appendChild(e.entity_filters)
    e.entity_filters.appendChild((p = document.createElement('p')))
    p.className = 'h6'
    p.innerText = 'Select Entities'
    span.className = 'note'
    span.innerText = '(click disabled selectors to load)'
    p.appendChild(span)
    e.entity_filters.appendChild((div = document.createElement('div')))
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
    e.variable_filters.appendChild((p = document.createElement('p')))
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
        (this.top_menu && 'open' === this.top_menu.e.dataset.state
          ? this.top_menu.e.getBoundingClientRect().height
          : this.content_bounds.top +
            ((!this.top_menu && !this.left_menu && !this.right_menu) ||
            (this.right_menu && 'open' === this.right_menu.e.dataset.state) ||
            (this.left_menu && 'open' === this.left_menu.e.dataset.state)
              ? 0
              : 40)) + 'px'
      f.style.bottom =
        this.content_bounds.bottom +
        (!this.bottom_menu || 'closed' === this.bottom_menu.e.dataset.state
          ? 0
          : this.bottom_menu.e.getBoundingClientRect().height) +
        'px'
      f.style.left =
        this.content_bounds.left +
        (!this.left_menu || 'closed' === this.left_menu.e.dataset.state
          ? 0
          : this.left_menu.e.getBoundingClientRect().width) +
        'px'
    }
    f.style.right =
      this.content_bounds[full ? 'outer_right' : 'right'] +
      (!this.right_menu || 'closed' === this.right_menu.e.dataset.state
        ? 0
        : this.right_menu.e.getBoundingClientRect().width) +
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
  trigger_resize() {
    window.dispatchEvent(new Event('resize'))
  }
}
