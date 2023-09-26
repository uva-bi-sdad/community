import DataHandler from '../../data_handler/index'
import type {Generic, SiteCondition} from '../../types'
import type Community from '../index'
import {BaseInput} from './index'

export type VirtualSpec = {
  id: string
  states: {
    condition: SiteCondition[]
    value: string
  }[]
  default: string
  display: Generic
}

export class InputVirtual extends BaseInput {
  type: 'virtual'
  states: {
    condition: SiteCondition[]
    value: string | number
  }[] = []
  source: string | number
  values: (string | number)[] = []
  constructor(spec: VirtualSpec, site: Community) {
    const e = document.createElement('input')
    e.id = spec.id
    super(e, site)
    this.settings = spec
    if (this.settings.source) {
      this.source = this.default = this.settings.source
    }
    if (this.source) this.values.push(this.source)
    if (this.settings.states) this.states = this.settings.states
    const p: {[index: string]: {type: 'update'; id: string}} = {}
    this.states.forEach(si => {
      this.values.push(si.value)
      si.condition.forEach(c => {
        p[c.id] = {type: 'update', id: this.id}
        this.site.add_dependency(c.id, p[c.id])
      })
    })
  }
  init() {
    this.values.forEach(id => {
      if ('string' === typeof id && id in this.site.inputs) this.site.add_dependency(id, {type: 'update', id: this.id})
    })
  }
  update() {
    this.source = void 0
    for (let p, i = this.states.length; i--; ) {
      p = true
      for (let c = this.states[i].condition.length; c--; ) {
        const r = this.states[i].condition[c]
        if (DataHandler.checks[r.type](this.site.valueOf(r.id), this.site.valueOf(r.value))) {
          if (r.any) {
            p = true
            break
          }
        } else p = false
      }
      if (p) {
        this.source = this.states[i].value
        break
      }
    }
    if (!this.source) this.source = this.default
    if (this.source !== this.previous) {
      this.previous = this.source
      this.site.request_queue(this.id)
    } else if (this.source in this.site.inputs) {
      const r = this.site.inputs[this.source].value()
      if (r !== this.previous) {
        this.previous = r
        this.site.request_queue(this.id)
      }
    }
  }
  value() {
    return this.site.valueOf(this.source)
  }
  set(v: string | number) {
    if (-1 !== this.values.indexOf(v)) {
      this.previous = this.source
      this.source = v
    } else if (this.source) {
      const c = this.site.inputs[this.source]
      if (
        'values' in c &&
        (Array.isArray(c.values) ? -1 !== c.values.indexOf(v) : v in c.values || ('display' in c && v in c.display))
      ) {
        c.set(v)
      }
    }
    this.site.request_queue(this.id)
  }
}
