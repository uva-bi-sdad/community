import {Entity} from '../types'
import {RegisteredElements, SiteOutputs} from './elements/index'

export class Subscriptions {
  elements: RegisteredElements
  subs: {[index: string]: Map<string, SiteOutputs>}
  constructor(elements: RegisteredElements) {
    this.elements = elements
    this.subs = {}
  }
  add(id: string, o: SiteOutputs) {
    if (!(id in this.subs)) this.subs[id] = new Map()
    this.subs[id].set(o.id, o)
  }
  update(id: string, fun: string, e: Entity) {
    if (id in this.subs) {
      const tu = this.elements[id]
      this.subs[id].forEach(u => {
        if (fun in u) (u[fun as keyof SiteOutputs] as Function)(e, tu)
      })
    }
  }
}
