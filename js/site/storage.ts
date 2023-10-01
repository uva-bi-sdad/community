import type {Generic} from '../types'

export const storage: {
  name: string
  perm: Storage
  copy: Generic
  set(opt: string, value: boolean | string | number): void
  get(opt?: string): string | number | boolean | Generic
} = {
  name: window.location.pathname || 'default',
  perm: window.localStorage,
  copy: {},
  set: function (opt: string, value: boolean | string | number) {
    const s: Generic = JSON.parse(this.perm.getItem(this.name) || '{}')
    s[opt] = value
    this.perm.setItem(this.name, JSON.stringify(s))
  },
  get: function (opt?: string) {
    const s: Generic = JSON.parse(this.perm.getItem(this.name) || '{}')
    return opt ? s[opt] : s
  },
}
