import DataHandler from '.'
import type {Data, EntityFeatureSet, EntityFeatures, IdMap} from '../types'

export function data(this: DataHandler, d: Data, name: string) {
  this.sets[name] = d
  this.loaded[name] = true
  if (!(name in this.info)) this.info[name] = {name: name, site_file: name + '.json', schema: {fields: []}, ids: []}
  if ('_meta' in d) {
    const time = d._meta.time
    this.meta.times[name] = time
    if ('number' === typeof time.value) time.value = [time.value as number]
    const times = time.value as number[]
    time.n = times.length
    time.is_single = 1 === time.n
    time.range = [times[0], times[time.n - 1]]
    if (d._meta.time.name in this.variables) {
      time.info = this.variables[time.name]
      time.info.is_time = true
    }
    if (time.range[0] < this.meta.overall.range[0]) this.meta.overall.range[0] = time.range[0]
    if (time.range[1] > this.meta.overall.range[1]) this.meta.overall.range[1] = time.range[1]
    times.forEach((v: number) => {
      if (-1 === this.meta.overall.value.indexOf(v)) this.meta.overall.value.push(v)
    })
    this.meta.overall.value.sort()
    this.meta.variables[name] = d._meta.variables || {}
    Object.keys(this.meta.variables[name]).forEach((k: string) => {
      if (!(k in this.variables)) {
        this.variables[k] = {
          datasets: [name],
          info: {},
          time_range: {},
          type: 'unknown',
          name: k,
          code: k,
          views: {},
          meta: {
            full_name: k,
            measure: k.split(':')[1] || k,
            short_name: this.format_label(k),
            long_name: k,
            type: 'unknown',
          },
        }
        this.variable_info[k] = this.variables[k].meta
      }
      this.variables[k].name = k
      this.variables[k].code = this.meta.variables[name][k].code
      const t = this.meta.variables[name][k].time_range
      this.variables[k].time_range[name] = t
      this.variable_codes[this.variables[k].code] = this.variables[k]
      if (-1 !== t[0]) {
        if (k in this.meta.ranges) {
          if (t[0] < this.meta.ranges[k][0]) this.meta.ranges[k][0] = t[0]
          if (t[1] > this.meta.ranges[k][1]) this.meta.ranges[k][1] = t[1]
        } else {
          this.meta.ranges[k] = [t[0], t[1]]
        }
      }
    })
  }
  this.load_id_maps()
}

export async function id_maps(this: DataHandler) {
  this.metadata.datasets &&
    this.metadata.datasets.forEach((k: string) => {
      let has_map = false
      this.info[k].ids.forEach((id: IdMap, i: number) => {
        if ('map' in id) {
          has_map = true
          const map = id.map
          if (map in this.data_maps) {
            if (this.data_maps[map].retrieved) {
              const features = (
                k in this.data_maps[map].resource ? this.data_maps[map].resource[k] : this.data_maps[map].resource
              ) as EntityFeatures
              this.info[k].schema.fields[i].ids = this.entity_features[k] = features
              this.map_entities(k)
            } else {
              const queue = this.data_maps[map].queue as string[]
              if (-1 === queue.indexOf(k)) queue.push(k)
            }
          } else if ('string' !== typeof map || id.map_content) {
            if ('string' === typeof map) {
              this.data_maps[map] = {queue: [], resource: JSON.parse(id.map_content), retrieved: true}
              const features = (
                k in this.data_maps[map].resource ? this.data_maps[map].resource[k] : this.data_maps[map].resource
              ) as EntityFeatures
              this.info[k].schema.fields[i].ids = this.entity_features[k] = features
            } else {
              this.entity_features[k] = map
            }
            this.map_entities(k)
          } else {
            this.data_maps[map] = {queue: [k], resource: {}, retrieved: false}
            if (this.settings.entity_info && map in this.settings.entity_info) {
              const e = this.settings.entity_info
              if ('string' === typeof e[map]) e[map] = JSON.parse(e[map] as string)
              this.ingest_map(e[map] as EntityFeatures, map, i)
            } else if ('undefined' === typeof window) {
              require('https')
                .get(map, (r: {req: {protocol: string; host: string; path: string}; on: Function}) => {
                  const c: string[] = []
                  r.on('data', (d: string) => {
                    c.push(d)
                  })
                  r.on('end', () => {
                    this.ingest_map(JSON.parse(c.join('')), r.req.protocol + '//' + r.req.host + r.req.path, i)
                  })
                })
                .end()
            } else {
              const f = new window.XMLHttpRequest()
              f.onreadystatechange = function (this: DataHandler, url: string, fi: number) {
                if (4 === f.readyState) {
                  if (200 === f.status) {
                    this.ingest_map(JSON.parse(f.responseText), url, fi)
                  } else {
                    throw new Error('data_handler.ingester.id_maps failed: ' + f.responseText)
                  }
                }
              }.bind(this, map, i)
              f.open('GET', map, true)
              f.send()
            }
          }
        }
      })
      if (!has_map) {
        this.entity_features[k] = {}
        this.map_entities(k)
      }
    })
}

export function map(this: DataHandler, m: EntityFeatures | EntityFeatureSet, url: string, field: number) {
  this.data_maps[url].resource = m
  this.data_maps[url].retrieved = true
  this.data_maps[url].queue.forEach((k: string) => {
    if (this.info[k].schema.fields.length > field) {
      if (!(k in this.entity_features)) this.entity_features[k] = {}
      const features = (
        k in this.data_maps[url].resource ? this.data_maps[url].resource[k] : this.data_maps[url].resource
      ) as EntityFeatures
      this.info[k].schema.fields[field].ids = this.entity_features[k] = features
      this.map_entities(k)
    }
  })
  this.hooks.data_load && this.hooks.data_load()
}
