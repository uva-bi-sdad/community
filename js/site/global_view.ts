import Community from '.'
import {DataViewParsed, Entities, Entity, FilterParsed} from '../types'

export class GlobalView {
  registered: Entities = {}
  entities: Map<string, Entity> = new Map()
  selected: string[] = []
  select_ids: {[index: string]: boolean} = {}
  filters: Map<string, FilterParsed> = new Map()
  times: number[]
  dataview: DataViewParsed
  constructor(site: Community) {
    // this.times = site.data.meta.overall.value
    // this.dataview = site.dataviews[site.defaults.dataview].parsed
  }
  filter_state(q: string[], agg?: number) {
    const as_state = !q
    if (as_state) q = []
    this.filters.forEach(f => {
      const component =
        'selected' === f.component
          ? this.times['undefined' === typeof agg ? this.dataview.time_agg : agg]
          : f.time_component
          ? this.times[f.component as number]
          : f.component
      if (f.value) q.push(f.variable + '[' + component + ']' + f.operator + f.value + (as_state ? f.active : ''))
    })
    return q.join('&')
  }
  id_state() {
    return Object.keys(this.select_ids).join(',')
  }
}
