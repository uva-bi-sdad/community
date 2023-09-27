import type Community from '../index'
import {BaseInput} from './index'

export class InputSwitch extends BaseInput {
  type: 'switch'
  e: HTMLInputElement
  source: boolean
  constructor(e: HTMLElement, site: Community) {
    super(e, site)
    this.listen = this.listen.bind(this)
    e.addEventListener('change', this.listen)
  }
  get() {
    this.set(this.e.checked)
  }
  set(v: string | boolean) {
    if ('string' === typeof v) v = 'on' === v || 'true' === v
    if (v !== this.source) {
      this.previous = this.e.checked
      this.e.checked = this.source = v
      this.site.request_queue(this.id)
    }
  }
  listen(e: MouseEvent) {
    this.set(this.e.checked)
  }
}
