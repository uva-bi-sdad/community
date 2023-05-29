import type {Data, Entities, IdMap} from '../types'

export function data(d: Data, name: string) {
  this.sets[name] = d
  this.loaded[name] = true
  if (!(name in this.info)) this.info[name] = {schema: {fields: []}, ids: []}
  if ('_meta' in d) {
    this.meta.times[name] = d._meta.time
    if ('object' !== typeof this.meta.times[name].value) this.meta.times[name].value = [this.meta.times[name].value]
    this.meta.times[name].n = this.meta.times[name].value.length
    this.meta.times[name].is_single = 1 === this.meta.times[name].n
    this.meta.times[name].range = [
      this.meta.times[name].value[0],
      this.meta.times[name].value[this.meta.times[name].n - 1],
    ]
    if (d._meta.time.name in this.variables) {
      this.meta.times[name].info = this.variables[this.meta.times[name].name]
      this.meta.times[name].info.is_time = true
    }
    if (this.meta.times[name].range[0] < this.meta.overall.range[0])
      this.meta.overall.range[0] = this.meta.times[name].range[0]
    if (this.meta.times[name].range[1] > this.meta.overall.range[1])
      this.meta.overall.range[1] = this.meta.times[name].range[1]
    this.meta.times[name].value.forEach((v: number) => {
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

export async function id_maps() {
  this.metadata.datasets.forEach((k: string) => {
    let has_map = false
    this.info[k].ids.forEach((id: IdMap, i: number) => {
      if ('map' in id) {
        has_map = true
        const map = id.map
        if (map in this.data_maps) {
          if (this.data_maps[map].retrieved) {
            this.info[k].schema.fields[i].ids = this.data_maps[k] =
              k in this.data_maps[map].resource ? this.data_maps[map].resource[k] : this.data_maps[map].resource
            this.map_entities(k)
          } else {
            if (-1 === this.data_maps[map].queue.indexOf(k)) this.data_maps[map].queue.push(k)
          }
        } else if ('string' !== typeof map || id.map_content) {
          if (id.map_content) {
            this.data_maps[map] = {queue: [], resource: JSON.parse(id.map_content), retrieved: true}
            this.info[k].schema.fields[i].ids = this.data_maps[k] =
              k in this.data_maps[map].resource ? this.data_maps[map].resource[k] : this.data_maps[map].resource
          } else {
            this.data_maps[k] = map
          }
          this.map_entities(k)
        } else {
          this.data_maps[map] = {queue: [k], resource: {}, retrieved: false}
          if (this.settings.entity_info && map in this.settings.entity_info) {
            const e = this.settings.entity_info
            if ('string' === typeof e[map]) e[map] = JSON.parse(e[map])
            this.ingest_map(e[map], map, i)
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
            f.onreadystatechange = function (url: string, fi: number) {
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
      this.data_maps[k] = {}
      this.map_entities(k)
    }
  })
}

export function map(m: Entities, url: string, field: string) {
  this.data_maps[url].resource = m
  this.data_maps[url].retrieved = true
  this.data_maps[url].queue.forEach((k: string) => {
    if (this.info[k].schema.fields.length > field) {
      this.info[k].schema.fields[field].ids = this.data_maps[k] =
        k in this.data_maps[url].resource ? this.data_maps[url].resource[k] : this.data_maps[url].resource
      this.map_entities(k)
    }
  })
  this.hooks.data_load && this.hooks.data_load()
}
