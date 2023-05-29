import {options} from './export_params'

export const group_checks: {[index: string]: Function} = {
  '!': function (v: number): boolean {
    return this !== v
  },
  '=': function (v: number): boolean {
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
