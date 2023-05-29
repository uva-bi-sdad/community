import {Entity} from '../types'

export function single(v: string, t: number) {
  if (t < 0) return NaN
  if (this.variables[v].is_time) {
    return t < this.time.value.length ? this.time.value[t] : NaN
  } else {
    v = this.variables[v].code
    return 0 === t && v in this.data ? this.data[v] : NaN
  }
}

export function multi(v: string, t: number) {
  if (t < 0) return NaN
  if (this.variables[v].is_time) {
    return this.time.value[t]
  } else {
    v = this.variables[v].code
    return v in this.data
      ? 'object' === typeof this.data[v]
        ? t < this.data[v].length
          ? this.data[v][t]
          : NaN
        : 0 === t
        ? this.data[v]
        : NaN
      : NaN
  }
}

export function vector(r: {variable: string; entity: Entity}) {
  if (this.variables[r.variable].is_time) {
    return r.entity.time.value
  } else {
    const v = this.variables[r.variable].code
    return v in r.entity.data ? ('object' === typeof r.entity.data[v] ? r.entity.data[v] : [r.entity.data[v]]) : [NaN]
  }
}

export function row_time(d: number[], type: string, row: {offset: number; int: boolean}) {
  const i = this.i - (row.offset - this.o)
  return d && i >= 0 && i < d.length ? ('number' === typeof d[i] ? this.format_value(d[i], row.int) : d[i]) : NaN
}
