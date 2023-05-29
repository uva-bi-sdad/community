export const patterns: {[index: string]: RegExp} = {
  seps: /[\s._-]/g,
  comma: /,/,
  word_start: /\b(\w)/g,
  single_operator: /([<>!])([^=])/,
  greater: /%3E$/,
  less: /%3C$/,
  operator_start: /[<>!]$/,
  component: /^(.+)\[(.+)\]/,
  number: /^[0-9.+-]+$/,
  non_letter_num: /[^0-9a-z]+/g,
}
