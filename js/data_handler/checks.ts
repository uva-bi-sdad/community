import {options} from './export_params'

export const group_checks: {[index: string]: Function} = {
  '!': function (this: number, v: number): boolean {
    return this !== v
  },
  '=': function (this: number, v: number): boolean {
    return this === v
  },
  includes: function (v: number): boolean {
    return -1 !== this.indexOf(v)
  },
  excludes: function (v: number): boolean {
    return -1 === this.indexOf(v)
  },
}

export const export_checks: {[index: string]: Function} = {
  file_format: function (a: string): boolean {
    return -1 === options.file_format.indexOf(a)
  },
  table_format: function (a: string): boolean {
    return -1 === options.table_format.indexOf(a)
  },
  include: function (a: string, vars: {[index: string]: string}): string {
    for (let i = a.length; i--; ) {
      if (!(a[i] in vars)) return a[i]
    }
    return ''
  },
}

export const value_checks: {[index: string]: Function} = {
  '!': function (a: number): boolean {
    return !a || -1 == a
  },
  '': function (a: number): boolean {
    return !!a && -1 != a
  },
  '=': function (a: number, b: number): boolean {
    return a === b
  },
  '!=': function (a: number, b: number): boolean {
    return a != b
  },
  '>': function (a: number, b: number): boolean {
    return a > b
  },
  '<': function (a: number, b: number): boolean {
    return a < b
  },
  '>=': function (a: number, b: number): boolean {
    return a >= b
  },
  '<=': function (a: number, b: number): boolean {
    return a <= b
  },
  equals: function (s: number, e: string | number): boolean {
    return !s || -1 == s || s === e
  },
  includes: function (s: (string | number)[], e: string | number): boolean {
    return !s || !s.length || -1 !== s.indexOf(e)
  },
  excludes: function (s: (string | number)[], e: string | number): boolean {
    return !s || !s.length || -1 === s.indexOf(e)
  },
}
