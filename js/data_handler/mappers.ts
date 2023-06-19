import DataHandler from '.'
import type {Entity, EntityData, IdMap, ResourceField, UnparsedObject, Variable} from '../types'

export function variables(this: DataHandler) {
  this.metadata.datasets.forEach((k: string) => {
    this.data_queue[k] = {}
    const m = this.info[k]
    if (m) {
      m.id_vars = m.ids.map((id: IdMap) => id.variable)
      m.schema.fields.forEach((v: ResourceField) => {
        const vn = v.name
        if (vn in this.variables) {
          const ve = this.variables[vn]
          ve.datasets.push(k)
          ve.info[k] = v
          if ('string' === v.type) {
            ve.levels = []
            ve.level_ids = {}
            ;((v.info && v.info.levels) || Object.keys(v.table)).forEach(l => {
              if (!(l in ve.level_ids)) {
                ve.level_ids[l] = ve.levels.length
                ve.levels.push(l)
              }
            })
          }
        } else {
          const ve: Variable = (this.variables[vn] = {
            datasets: [k],
            info: {full_name: k, type: 'unknown'} as UnparsedObject,
            time_range: {},
            type: v.type,
            code: k,
            name: k,
            meta: v.info,
            levels: [],
            level_ids: {},
            table: {},
            order: [],
            views: {},
          })
          ve.info[k] = v
          if ('string' === v.type) {
            ve.levels = []
            ve.level_ids = {}
            ;(v.info.levels || Object.keys(v.table)).forEach(l => {
              ve.level_ids[l] = ve.levels.length
              ve.levels.push(l)
            })
          }
          if (!ve.meta)
            ve.meta = {
              full_name: vn,
              measure: vn.split(':')[1] || vn,
              short_name: this.format_label(vn),
              type: 'integer',
            }
          ve.meta.full_name = vn
          if (!('measure' in ve.meta)) ve.meta.measure = vn.split(':')[1] || vn
          if (!('short_name' in ve.meta)) ve.meta.short_name = this.format_label(vn)
          if (!('long_name' in ve.meta)) ve.meta.long_name = ve.meta.short_name
          if (!(vn in this.variable_info)) this.variable_info[vn] = ve.meta
        }
      })
    }
  })
}

export async function entities(this: DataHandler, g: string): Promise<void> {
  if (g in this.sets && !this.inited[g] && g in this.meta.times) {
    const s = this.sets[g],
      time = this.meta.times[g],
      retriever = DataHandler.retrievers[time.is_single ? 'single' : 'multi'],
      datasets = Object.keys(this.sets),
      infos = this.info
    Object.keys(s).forEach((id: string) => {
      const si = s[id] as EntityData,
        l = id.length
      if ('_meta' !== id) {
        const overwrite = this.entity_features[g][id]
        const f = overwrite || {id: id, name: id}
        f.id = id
        if (!f.name) f.name = id
        const e = (
          id in this.entities
            ? this.entities[id]
            : {
                group: g,
                data: si,
                variables: this.variables,
                features: f,
                views: {},
              }
        ) as Entity
        if (id in this.entities) {
          e.group = g
          e.data = si
          e.variables = this.variables
          if (!e.features) e.features = {}
        } else {
          this.entities[id] = e
        }
        if (!(id in this.entity_tree)) this.entity_tree[id] = {parents: {}, children: {}}
        const rel = this.entity_tree[id]
        e.relations = rel
        Object.keys(f).forEach((k: string) => {
          if (!(k in this.features)) this.features[k] = this.format_label(k)
          if ('id' === k || overwrite || !(k in e.features)) {
            e.features[k] = f[k]
          }
          if (-1 !== this.metadata.datasets.indexOf(k)) {
            if (!(f[k] in this.entity_tree)) this.entity_tree[f[k]] = {parents: {}, children: {}}
            this.entity_tree[f[k]].children[id] = rel
            rel.parents[f[k]] = this.entity_tree[f[k]]
          }
        })
        if (infos) {
          datasets.forEach((d: string) => {
            const p = d in infos && infos[d].id_length
            if (p && p < l) {
              const sl = id.substring(0, p)
              if (sl in this.sets[d]) {
                if (!(sl in this.entity_tree)) this.entity_tree[sl] = {parents: {}, children: {}}
                this.entity_tree[sl].children[id] = rel
                rel.parents[sl] = this.entity_tree[sl]
              }
            }
          })
        }
        this.settings.view_names.forEach((v: string) => {
          if (!(v in e.views)) {
            e.views[v] = {summary: {}, rank: {}, subset_rank: {}}
          }
        })
        e.time = time
        e.get_value = retriever.bind(e)
      }
    })
    this.inited[g] = true
    this.data_promise[g]()
    setTimeout(() => {
      if (!this.inited.first) {
        this.hooks.init && this.hooks.init()
        this.inited.first = true
      }
      g in this.data_queue &&
        Object.keys(this.data_queue[g]).forEach((id: string) => {
          this.data_queue[g][id]()
          delete this.data_queue[g][id]
        })
      this.hooks.onload && this.hooks.onload(g)
    }, 0)
  }
  for (const k in this.info) if (Object.prototype.hasOwnProperty.call(this.info, k) && !this.inited[k]) return void 0
  this.all_data_ready()
}
