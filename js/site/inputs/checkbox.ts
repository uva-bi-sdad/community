import type Community from '../index'
import {BaseInput} from './index'

export class InputCheckbox extends BaseInput {
  type: 'checkbox'
  options: NodeListOf<HTMLInputElement>
  values: (string | number)[] = []
  source: (string | number)[]
  current_index: number[]
  off_default: boolean
  constructor(e: HTMLElement, site: Community) {
    super(e, site)
    this.listen = this.listen.bind(this)
    this.options = e.querySelectorAll('input')
    this.options.forEach(o => {
      this.values.push(o.value)
      o.addEventListener('click', this.listen)
    })
    if ('string' === typeof this.default) this.default = this.default.split(',')
    this.get()
  }
  get() {
    this.source = []
    this.current_index = []
    this.off_default = false
    this.options.forEach((o, i) => {
      if (o.checked) {
        this.source.push(this.values[i])
        this.current_index.push(i)
      } else {
        this.off_default = true
      }
    })
    this.site.request_queue(this.id)
  }
  set(v: string | number | (string | number)[]) {
    if (Array.isArray(v)) {
      this.source = []
      this.current_index = []
      this.off_default = false
      this.values.forEach((cv, i) => {
        if (-1 !== v.indexOf(cv)) {
          this.source.push(cv)
          this.current_index.push(i)
          this.options[i].checked = true
        } else {
          this.off_default = true
          this.options[i].checked = false
        }
      })
    } else {
      if ('string' === typeof v) {
        this.set('' === v ? this.values : v.split(','))
        return
      } else {
        if (-1 !== v) {
          this.options[v].checked = true
          this.off_default = false
          this.options.forEach(o => {
            if (!o.checked) this.off_default = true
          })
        }
      }
    }
    this.site.request_queue(this.id)
  }
  listen(e: MouseEvent) {
    const input = e.target as HTMLInputElement
    if (input.checked) {
      this.source.push(input.value)
      this.current_index.push(this.values.indexOf(input.value))
      this.off_default = false
      this.options.forEach(o => {
        if (!o.checked) this.off_default = true
      })
    } else {
      let i = this.source.indexOf(input.value)
      if (i !== -1) {
        this.off_default = true
        this.source.splice(i, 1)
        this.current_index.splice(i, 1)
      }
    }
    this.site.request_queue(this.id)
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
    input.type = 'checkbox'
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
