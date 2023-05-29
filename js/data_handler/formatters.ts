import {patterns} from './patterns'

export function value(v: null | number, int: boolean): number | string {
  if (null === v || isNaN(v)) {
    return NaN
  } else if (int) {
    return v
  } else {
    return v.toFixed(this.settings.settings.digits > 0 ? this.settings.settings.digits : 0)
  }
}

export function label(l: string): string {
  return 'string' !== typeof l
    ? ''
    : l in this.variables && this.variables[l].meta && this.variables[l].meta.short_name
    ? this.variables[l].meta.short_name
    : l.replace(patterns.seps, ' ').replace(patterns.word_start, function (w) {
        return w.toUpperCase()
      })
}
