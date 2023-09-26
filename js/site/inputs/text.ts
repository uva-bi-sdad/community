import type Community from '../index'
import {BaseInput} from './index'

export class InputText extends BaseInput {
  type: 'text'
  e: HTMLInputElement
  source: string
  constructor(e: HTMLElement, site: Community) {
    super(e, site)
  }
  get() {
    this.set(this.e.value)
  }
  set(v: string) {
    this.previous = this.e.checked
    this.e.value = this.source = v
    this.site.request_queue(this.id)
  }
  listen(e: MouseEvent) {
    this.set(this.e.value)
  }
}
