import type Community from '../index'
import {BaseInput} from './index'

export class InputButtonGroup extends BaseInput {
  type: 'buttongroup'
  options: NodeListOf<HTMLInputElement>
  values: (string | number)[] = []
  source: string | number
  constructor(e: HTMLElement, site: Community) {
    super(e, site)
    this.options = e.querySelectorAll('input')
  }
  get() {
    for (let i = this.options.length; i--; ) {
      if (this.options[i].checked) {
        this.set(i)
        break
      }
    }
  }
  set(v: string | number) {
    this.previous = this.value()
    this.current_index = 'string' === typeof v ? this.values.indexOf(v) : v
    if (-1 !== this.current_index) {
      this.source =
        this.values[this.current_index] in this.site.inputs
          ? (this.site.valueOf(this.values[this.current_index]) as string)
          : this.values[this.current_index]
      this.options[this.current_index].checked = true
    } else this.source = undefined
    this.site.request_queue(this.id)
  }
  listen(e: MouseEvent) {
    this.set((e.target as HTMLInputElement).value)
  }
  add(value: string, display?: string, noadd?: boolean) {
    const input = document.createElement('input'),
      label = document.createElement('label')
    input.autocomplete = 'off'
    input.className = 'btn-check'
    input.type = 'radio'
    input.name = this.e.id + '_options'
    input.id = this.e.id + '_option' + this.e.childElementCount
    input.value = value
    label.innerText = display || this.site.data.format_label(value)
    label.className = 'btn btn-primary'
    label.dataset.for = this.e.firstElementChild.id
    if (!noadd) {
      this.e.appendChild(input)
      this.e.appendChild(label)
    }
    return input
  }
}
