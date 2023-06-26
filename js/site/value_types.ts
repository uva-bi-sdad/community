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
  dollars: function (v: number): string {
    return '$' + v
  },
  'Mb/s': function (v: number): string {
    return v + ' Mbps'
  },
}
