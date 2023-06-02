import {Entity} from '../types'

export function single(this: Entity, v: string, t: number) {
  if (t < 0) return NaN
  if (this.variables[v].is_time) {
    return Array.isArray(this.time.value) && t < this.time.value.length ? this.time.value[t] : NaN
  } else {
    v = this.variables[v].code
    return 0 === t && v in this.data ? this.data[v] : NaN
  }
}

export function multi(this: Entity, v: string, t: number) {
  if (t < 0) return NaN
  if (this.variables[v].is_time) {
    return Array.isArray(this.time.value) ? this.time.value[t] : this.time.value
  } else {
    v = this.variables[v].code
    const value = this.data[v]
    return v in this.data ? (Array.isArray(value) ? (t < value.length ? value[t] : NaN) : 0 === t ? value : NaN) : NaN
  }
}

export function row_time(
  this: {i: number; o: number; format_value: Function},
  d: number[],
  type: string,
  row: {offset: number; int: boolean}
) {
  const i = this.i - (row.offset - this.o)
  return d && i >= 0 && i < d.length ? ('number' === typeof d[i] ? this.format_value(d[i], row.int) : d[i]) : NaN
}
