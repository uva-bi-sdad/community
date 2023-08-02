import Community from '..'
import {SitePlotly} from '../../types'
import {Combobox} from './combobox'

export const elements = {
  combobox: Combobox,
  select: Combobox,
}
export type Options = NodeListOf<HTMLElement> | HTMLElement[]
type OptionIndex = {[index: string]: number}
export type OptionSets = {
  [index: string]: {
    options: Options
    values: OptionIndex
    display: OptionIndex
  }
}

export class BaseInput {
  type: keyof typeof elements
  source: string | number | (string | number)[]
  default: string | number
  optionSource: string
  depends: string
  variable: string
  dataset: string
  view: string
  id: string
  note: string
  current_index = -1
  previous = ''
  e: HTMLElement
  settings: {[index: string]: any} = {}
  input = true
  site: Community
  range?: number[]
  input_element?: HTMLInputElement
  state?: string
  deferred?: boolean
  set?: (value?: any) => void
  reset?: Function
  add?: Function
  setting?: string
  tiles?: {[index: string]: any}
  overlay?: any
  overlay_control?: any
  map?: {[index: string]: any}
  update?: Function
  options?: Options | SitePlotly
  values?: OptionIndex
  display?: OptionIndex
  option_sets?: OptionSets
  current_set?: string
  sensitive?: boolean
  expanded?: boolean
  constructor(e: HTMLElement, site: Community) {
    this.site = site
    this.e = e
    this.type = e.dataset.autoType as keyof typeof elements
    this.default = e.dataset.default
    this.optionSource = e.dataset.optionSource
    this.depends = e.dataset.depends
    this.variable = e.dataset.variable
    this.dataset = e.dataset.dataset
    this.view = e.dataset.view
    this.id = e.id || this.optionSource || 'ui' + site.page.elementCount++
    this.note = e.getAttribute('aria-description') || ''
    if (this.type in site.spec && this.id in site.spec[this.type]) this.settings = site.spec[this.type][this.id]
  }
  value() {
    if (Array.isArray(this.source)) return this.source
    const v = this.site.valueOf(this.source)
    return 'undefined' === typeof v ? this.site.valueOf(this.default) : v
  }
  toggle() {}
}
