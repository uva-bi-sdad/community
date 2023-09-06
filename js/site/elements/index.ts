import {LogicalObject, SiteElement, SiteSpec} from '../../types'
import Community from '../index'
import {patterns} from '../patterns'
import {tooltip_clear, tooltip_trigger} from '../utils'

export type ElementTypes = 'number' | 'button' | 'select' | 'combobox' | 'plotly' | 'virtual'

export default abstract class BaseInput {
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
  constructor(e: HTMLElement, site: Community) {
    this.e = e
    this.site = site
    this.default = e.dataset.default
    this.optionSource = e.dataset.optionSource
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
