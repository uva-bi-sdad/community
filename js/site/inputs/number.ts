import {BaseInput} from './index'
import type Community from '../index'
import type {LogicalObject} from '../../types'

export type NumberSpec = {}

export class InputNumber extends BaseInput {
  type: 'number' = 'number'
  e: HTMLInputElement
  default: string | number
  source: number
  parsed = {min: -Infinity, max: Infinity}
  min: string | number
  default_min: boolean
  min_ref: number
  min_indicator?: HTMLElement
  max: string | number
  default_max: boolean
  max_ref: number
  max_indicator?: HTMLElement
  step?: number
  current_default: number
  previous: number
  off_default?: boolean
  value: () => number
  ref: boolean
  range: [number, number]
  depends: LogicalObject
  constructor(e: HTMLElement, site: Community) {
    super(e, site)
    this.listen = this.listen.bind(this)
    e.addEventListener('change', this.listen)
    this.update = this.update.bind(this)
    const up = e.parentElement.parentElement.querySelector('.number-up')
    const down = e.parentElement.parentElement.querySelector('.number-down')
    if (down) {
      down.addEventListener('click', () => {
        this.set(Math.max(this.parsed.min, this.value() - 1))
      })
    }
    if (up) {
      up.addEventListener('click', () => {
        this.set(Math.min(this.parsed.max, this.value() + 1))
      })
    }
  }
  get() {
    this.set(this.e.value)
  }
  set(v: string | number, check?: boolean) {
    if (!v) v = null
    if ('string' === typeof v) v = parseFloat(v)
    if (isFinite(v) && v !== this.source) {
      this.previous = parseFloat(this.e.value)
      if (check) {
        if (isFinite(this.parsed.min) && v < this.parsed.min) {
          v = this.parsed.min
        } else if (isFinite(this.parsed.max) && v > this.parsed.max) {
          v = this.parsed.max
        }
      }
      this.off_default = v !== this.current_default
      this.source = v
      this.e.value = v + ''
      this.current_index = v - this.parsed.min
      if ('range' === this.e.type) {
        ;(this.e.nextElementSibling.firstElementChild as HTMLElement).innerText = this.e.value
      }
      this.site.request_queue(this.id)
    }
  }
  listen() {
    this.set(this.e.value, true)
  }
  async update() {
    const view = this.site.dataviews[this.view],
      variable = this.site.valueOf(this.variable || view.y) as string
    // if (!view.time_range) view.time_range = {time: []}
    let d = view.get ? view.get.dataset() : (this.site.valueOf(this.dataset) as string),
      min = (this.site.valueOf(this.min) || view.time) as string | number | undefined,
      max = (this.site.valueOf(this.max) || view.time) as string | number | undefined
    if ('string' === typeof min && this.site.patterns.minmax.test(min))
      min = (this.site.inputs[this.min] as InputNumber).min
    if ('string' === typeof max && this.site.patterns.minmax.test(max))
      max = (this.site.inputs[this.max] as InputNumber).max
    this.parsed.min = isNaN(this.min_ref)
      ? 'undefined' === typeof min
        ? view.time_range.time[0]
        : 'number' === typeof min
        ? min
        : min in this.site.data.variables
        ? this.site.data.variables[min].info[d || this.site.data.variables[min].datasets[0]].min
        : parseFloat(min)
      : this.min_ref
    this.parsed.max = isNaN(this.max_ref)
      ? 'undefined' === typeof max
        ? view.time_range.time[1]
        : 'number' === typeof max
        ? max
        : max in this.site.data.variables
        ? this.site.data.variables[max].info[d || this.site.data.variables[max].datasets[0]].max
        : parseFloat(max)
      : this.min_ref
    if (this.default_min) {
      this.current_default = this.parsed.min
    } else if (this.default_max) {
      this.current_default = this.parsed.max
    }
    if (this.ref && variable in this.site.data.variables) {
      this.range[0] = isNaN(this.min_ref) ? Math.max(view.time_range.time[0], this.parsed.min) : this.min_ref
      this.e.min = this.range[0] + ''
      this.range[1] = isNaN(this.max_ref) ? Math.min(view.time_range.time[1], this.parsed.max) : this.max_ref
      this.e.max = this.range[1] + ''
      if (!this.depends[view.y]) {
        this.depends[view.y] = true
        this.site.add_dependency(view.y, {type: 'update', id: this.id})
      }
      if (this.source > this.parsed.max || this.source < this.parsed.min) this.reset()
      // this.variable = await this.site.data.get_variable(variable, this.view)
    } else {
      this.e.min = this.parsed.min + ''
      if (this.parsed.min > this.source || (!this.source && this.default_min)) this.set(this.parsed.min)
      this.e.max = this.parsed.max + ''
      if (this.parsed.max < this.source || (!this.source && this.default_max)) this.set(this.parsed.max)
    }
  }
}
