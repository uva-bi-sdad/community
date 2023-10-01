import type {VariableFilterParsed} from '../types'
import type {DataViewParsed} from './dataview'
import {patterns} from './patterns'

type TimeFuns = {
  number: Function
  first: Function
  selected: Function
  last: Function
}

const time_funs = {
  number: function (this: number, v: VariableFilterParsed) {
    return this - v.range[0]
  },
  first: function (v: VariableFilterParsed) {
    return 0
  },
  selected: function (v: VariableFilterParsed, p: DataViewParsed) {
    return p.time_agg - v.range[0]
  },
  last: function (v: VariableFilterParsed) {
    return v.range[1] - v.range[0]
  },
}

export function component_fun(times: number[], c: string | number): Function {
  if ('string' === typeof c && patterns.number.test(c)) {
    c = times.indexOf(+c)
    if (-1 === c)
      return function () {
        return NaN
      }
  }
  return 'number' === typeof c
    ? time_funs.number.bind(c)
    : c in time_funs
    ? time_funs[c as keyof TimeFuns]
    : function () {
        return NaN
      }
}
