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
