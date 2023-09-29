import {BaseInput} from './index'
import type Community from '../index'
import type {Generic, ObjectIndex, OptionSets, ResourceField} from '../../types'
import {options_filter, set_current_options} from '../common_methods'

export type SelectSpec = {
  group?: string
  filters?: Generic
}

export class InputSelect extends BaseInput {
  type: 'select' = 'select'
  e: HTMLSelectElement
  default: string | number
  current_filter: {[index: string]: string} = {}
  groups: {e: HTMLElement[]; by_name: {[index: string]: HTMLElement}}
  options: HTMLOptionElement[]
  values: ObjectIndex = {}
  display: ObjectIndex = {}
  option_sets: OptionSets = {}
  current_set = ''
  sensitive = false
  deferred = false
  filter = options_filter
  reformat_label = false
  constructor(e: HTMLElement, site: Community) {
    super(e, site)
    this.listen = this.listen.bind(this)
    e.addEventListener('change', this.listen)
    this.options = [...e.querySelectorAll('option')]
    if (this.optionSource && this.site.patterns.ids.test(this.optionSource)) {
      e.addEventListener('click', this.loader)
      this.deferred = true
    } else if (
      'number' === typeof this.default &&
      this.default > -1 &&
      this.options.length &&
      this.default < this.options.length
    ) {
      this.default = this.options[this.default].value || this.options[this.default].dataset.value
    }
    if (this.options.length) {
      this.reformat_label = true
      this.options.forEach((e, i) => {
        e.dataset.value = e.value
        this.values[e.value] = i
        if (this.reformat_label) this.reformat_label = e.value === e.innerText
      })
      const group: NodeListOf<HTMLOptGroupElement> = e.querySelectorAll('optgroup')
      if (group.length) {
        this.groups = {e: [], by_name: {}}
        group.forEach(e => {
          const name = e.dataset.group
          this.groups.e.push(e)
          this.groups.by_name[name] = e
        })
      }
    }
  }
  init() {
    this.options.forEach((e, i) => {
      if (this.reformat_label) e.innerText = this.site.data.format_label(e.value)
      this.display[e.innerText] = i
    })
  }
  set_current = set_current_options
  get() {
    this.set(this.e.selectedIndex)
  }
  set(v: string | number) {
    if ('string' === typeof v && !(v in this.values) && this.site.patterns.number.test(v)) v = +v
    if ('number' === typeof v) v = this.options[v] ? this.options[v].value : v
    if (!(v in this.values) && v in this.display) v = this.options[this.display[v]].value
    if (v !== this.source) {
      this.e.selectedIndex = v in this.values ? this.values[v] : -1
      this.source = v
      this.site.request_queue(this.id)
    }
  }
  listen(e: MouseEvent) {
    this.set((e.target as HTMLSelectElement).selectedIndex)
  }
  add(value: string, display?: string, noadd?: boolean, meta?: ResourceField) {
    const e = document.createElement('option')
    e.value = value
    e.innerText = display || this.site.data.format_label(value)
    if (meta && meta.info) {
      e.title = (meta.info.description || meta.info.short_description) as string
    }
    if (!noadd) this.e.appendChild(e)
    this.options.push(e)
    return e
  }
  loader() {
    if (!this.e.classList.contains('locked')) {
      this.deferred = false
      this.e.removeEventListener('click', this.loader)
      this.site.request_queue(this.id)
    }
  }
}
