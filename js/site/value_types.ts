export const value_types: {[index: string]: Function} = {
  percent: function (v: number): string {
    return v + '%'
  },
  'drive time': function (v: number): string {
    return v + ' minutes'
  },
  minutes: function (v: number): string {
    return v + ' minutes'
  },
  dollar: function (v: number): string {
    return '$' + v
  },
  'internet speed': function (v: number): string {
    return v + ' MB/s'
  },
}
