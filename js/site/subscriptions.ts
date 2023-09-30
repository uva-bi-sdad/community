import type {Entity} from '../types'
import type Community from './index'
import type {SiteOutputs} from './outputs/index'

export class Subscriptions {
  site: Community
  subs: {[index: string]: Map<string, SiteOutputs>}
  constructor(site: Community) {
    this.site = site
    this.subs = {}
  }
  add(id: string, o: SiteOutputs) {
    if (!(id in this.subs)) this.subs[id] = new Map()
    this.subs[id].set(o.id, o)
  }
  update(id: string, fun: string, e: Entity) {
    if (id in this.subs) {
      const tu = this.site.outputs[id]
      this.subs[id].forEach(u => {
        if (fun in u) (u[fun as keyof SiteOutputs] as Function)(e, tu)
      })
    }
  }
}
