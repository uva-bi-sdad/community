import {Generic} from '../types'

export const storage = {
  name: window.location.pathname || 'default',
  perm: window.localStorage,
  set: function (opt: string, value: boolean | string | number) {
    const s: Generic = JSON.parse(this.perm.getItem(this.name) || '{}')
    s[opt] = value
    this.perm.setItem(this.name, JSON.stringify(s))
  },
  get: function (opt: string) {
    const s: Generic = JSON.parse(this.perm.getItem(this.name) || '{}')
    return s[opt]
  },
}
