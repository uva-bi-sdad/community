import type Community from '../index'
import {BaseInput} from './index'

export class InputRadio extends BaseInput {
  type: 'radio'
  options: NodeListOf<HTMLInputElement>
  values: (string | number)[] = []
  source: string | number
  constructor(e: HTMLElement, site: Community) {
    super(e, site)
    this.listen = this.listen.bind(this)
    this.options = e.querySelectorAll('input')
    this.options.forEach(o => {
      this.values.push(o.value)
      o.addEventListener('click', this.listen)
    })
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
    const e = document.createElement('div'),
      s = 'TRUE' === this.e.dataset.switch,
      input = document.createElement('input'),
      label = document.createElement('label')
    e.className = 'form-check' + (s ? ' form-switch' : '')
    e.appendChild(input)
    e.appendChild(label)
    input.autocomplete = 'off'
    input.className = 'form-check-input'
    if (s) input.role = 'switch'
    input.type = 'radio'
    input.name = this.e.id + '_options'
    input.id = this.e.id + '_option' + this.e.childElementCount
    input.value = value
    label.innerText = display || this.site.data.format_label(value)
    label.className = 'form-check-label'
    label.setAttribute('for', e.firstElementChild.id)
    if (!noadd) this.e.appendChild(e)
    return input
  }
}
