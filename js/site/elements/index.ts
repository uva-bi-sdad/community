import {Generic, LogicalObject, SiteRule, SiteSpec} from '../../types'
import Community from '../index'
import {patterns} from '../patterns'
import {tooltip_clear, tooltip_trigger} from '../utils'
import {InputButton} from './button'
import {Combobox} from './combobox'
import {OutputInfo} from './info'
import {OutputMap} from './map'
import {InputNumber} from './number'
import {Select} from './select'
import {Virtual} from './virtual'

export type ElementTypes = 'number' | 'button' | 'select' | 'combobox' | 'plotly' | 'virtual'
export type SiteElement = Combobox | Select | InputNumber | InputButton | Virtual
export type RegisteredElements = {[index: string]: SiteElement}
export type OutputTypes = 'info' | 'map'
export type SiteOutputs = OutputInfo | OutputMap
export type RegisteredOutputs = {[index: string]: SiteOutputs}

export abstract class BaseInput {
  type: ElementTypes
  input = true
  site: Community
  e: HTMLElement
  wrapper: HTMLElement
  id: string
  settings: {[index: string]: any} = {}
  default: string | number
  source: boolean | string | number | (string | number)[]
  optionSource: string
  subset: string
  selection_subset: string
  depends: string | LogicalObject
  variable: string
  dataset: string
  view: string
  note: string
  current_index = -1
  previous: boolean | string | number | (string | number)[] = ''
  state = ''
  setting?: string
  deferred?: boolean
  rule?: SiteRule
  constructor(e: HTMLElement, site: Community) {
    this.e = e
    this.site = site
    this.default = e.dataset.default
    this.optionSource = e.dataset.optionsource
    this.subset = e.dataset.subset || 'all'
    this.selection_subset = e.dataset.selectionsubset || this.subset
    this.depends = e.dataset.depends
    this.variable = e.dataset.variable
    this.dataset = e.dataset.dataset
    this.view = e.dataset.view
    this.id = e.id || this.optionSource || 'ui' + site.page.elementCount++
    this.note = e.getAttribute('aria-description') || ''
    this.type = e.dataset.autotype as ElementTypes
    if (this.type in site.spec) {
      const spec = site.spec[this.type as keyof SiteSpec] as SiteElement
      if (this.id in spec) this.settings = (spec as any)[this.id]
    }
    if (e.parentElement)
      this.wrapper = e.parentElement.classList.contains('wrapper') ? e.parentElement : e.parentElement.parentElement
    if (this.wrapper) {
      if (this.note) this.wrapper.classList.add('has-note')
      this.wrapper.setAttribute('data-of', this.id)
      ;['div', 'span', 'label', 'fieldset', 'legend', 'input', 'button'].forEach(type => {
        const c = this.wrapper.querySelectorAll(type)
        if (c.length) c.forEach(ci => ci.setAttribute('data-of', this.id))
      })
    }
    if (this.note) {
      this.wrapper.addEventListener('mouseover', tooltip_trigger.bind(this))
      const p = 'DIV' !== e.tagName ? e : e.querySelector('input')
      if (p) {
        p.addEventListener('focus', tooltip_trigger.bind(this))
        p.addEventListener('blur', tooltip_clear.bind(this))
      }
    }
    if (patterns.number.test(this.default)) this.default = +this.default
  }
  value() {
    if (Array.isArray(this.source)) return this.source
    const v = this.site.valueOf(this.source)
    return 'undefined' === typeof v ? this.site.valueOf(this.default) : v
  }
  set(v: any) {
    this.source = v
  }
  reset() {
    this.set(this.site.valueOf(this.default))
  }
}

export abstract class BaseOutput {
  type: OutputTypes
  input = false
  site: Community
  view: string
  e: HTMLElement
  tab?: HTMLElement
  id: string
  note: string
  color?: string
  x?: string
  y?: string
  reference_options: Generic = {}
  spec: {[index: string]: any} = {}
  deferred = false
  constructor(e: HTMLElement, site: Community) {
    this.e = e
    this.tab = 'tabpanel' === e.parentElement.getAttribute('role') ? e.parentElement : void 0
    this.site = site
    this.view = e.dataset.view
    this.id = e.id || 'ui' + site.page.elementCount++
    this.note = e.getAttribute('aria-description') || ''
    this.type = e.dataset.autotype as OutputTypes
    if (this.type in site.spec) {
      const spec = site.spec[this.type as keyof SiteSpec] as SiteElement
      if (this.id in spec) this.spec = (spec as any)[this.id]
    }
  }
}
