import {ActiveElement, Entity, RegisteredElements} from '../types'

export class Subscriptions {
  elements: RegisteredElements
  subs: {[index: string]: Map<string, ActiveElement>}
  constructor(elements: RegisteredElements) {
    this.elements = elements
    this.subs = {}
  }
  add(id: string, o: ActiveElement) {
    if (!(id in this.subs)) this.subs[id] = new Map()
    this.subs[id].set(o.id, o)
  }
  update(id: string, fun: string, e: Entity) {
    if (id in this.subs) {
      const tu = this.elements[id]
      this.subs[id].forEach(u => {
        if (fun in u) (u[fun as keyof ActiveElement] as Function)(e, tu)
      })
    }
  }
}
