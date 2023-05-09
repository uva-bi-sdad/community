void (function () {
  'use strict'
  function DataHandler(settings, defaults, data, hooks) {
    this.hooks = hooks || {}
    this.defaults = defaults || {dataview: 'default_view', time: 'time'}
    this.settings = settings || {}
    this.metadata = this.settings.metadata || {}
    this.info = this.metadata.info || {}
    this.features = {}
    this.variables = {}
    this.variable_codes = {}
    this.variable_info = {}
    this.references = {}
    this.entities = {}
    this.entity_tree = {}
    this.meta = {
      times: {},
      variables: {},
      ranges: {},
      overall: {
        range: [Infinity, -Infinity],
        value: [],
      },
    }
    this.loaded = {}
    this.inited = {}
    this.inited_summary = {}
    this.summary_ready = {}
    this.sets = data || {}
    this.data_maps = {}
    this.data_queue = {}
    this.data_promise = {}
    this.data_processed = {}
    this.load_requests = {}
    this.in_browser = 'undefined' === typeof module
    this.data_ready = new Promise(resolve => {
      this.all_data_ready = resolve
    })
    if ('string' === typeof this.metadata.datasets) this.metadata.datasets = [this.metadata.datasets]
    const init = () => {
      if (!('datasets' in this.metadata)) this.metadata.datasets = Object.keys(this.info)
      if ('measure_info' in this.metadata) {
        const info = this.metadata.measure_info
        this.metadata.datasets.forEach(d => {
          if ('_references' in info) this.info[d]._references = info._references
          const v = this.info[d].schema.fields
          v.forEach(e => (e.name in info ? (e.info = info[e.name]) : ''))
        })
      }
      this.map_variables()
      this.metadata.datasets.forEach(k => {
        this.loaded[k] = k in this.sets
        this.inited[k] = false
        this.data_processed[k] = new Promise(resolve => {
          this.data_promise[k] = resolve
        })
        if (k in this.info)
          this.info[k].site_file = (this.metadata.url ? this.metadata.url + '/' : '') + this.info[k].name + '.json'
        if (this.loaded[k]) {
          this.ingest_data(this.sets[k], k)
        } else if (
          !this.in_browser ||
          (this.settings.settings && !this.settings.settings.partial_init) ||
          !this.defaults.dataset ||
          k === this.defaults.dataset
        )
          this.retrieve(k, this.info[k].site_file)
      })
    }
    if ('package' in this.metadata && !('info' in this.metadata)) {
      if ('undefined' === typeof window) {
        require('https')
          .get(this.metadata.url + this.metadata.package, r => {
            const c = []
            r.on('data', d => {
              c.push(d)
            })
            r.on('end', () => {
              this.info = {}
              const dp = JSON.parse(c.join(''))
              if (dp.measure_info) this.metadata.measure_info = dp.measure_info
              dp.resources.forEach(r => (this.info[r.name] = r))
              init()
            })
          })
          .end()
      } else {
        const f = new window.XMLHttpRequest()
        f.onreadystatechange = () => {
          if (4 === f.readyState) {
            if (200 === f.status) {
              this.info = {}
              const dp = JSON.parse(f.responseText)
              if (dp.measure_info) this.metadata.measure_info = dp.measure_info
              dp.resources.forEach(r => (this.info[r.name] = r))
              init()
            } else {
              throw new Error('failed to load datapackage: ' + f.responseText)
            }
          }
        }
        f.open('GET', this.metadata.url + this.metadata.package)
        f.send()
      }
    } else {
      init()
    }
  }

  function quantile(p, n, o, x, l1) {
    const a = p * (n - 1),
      ap = a % 1,
      bp = 1 - ap,
      b = o + Math.ceil(a),
      i = o + Math.floor(a)
    return l1 ? x[i] * ap + x[b] * bp : x[i][1] * ap + x[b][1] * bp
  }

  function vector_summary(vec, range) {
    if ('object' === typeof vec) {
      const n = Math.min(range[1] + 1, vec.length),
        r = {
          missing: 0,
          first: vec[0],
          min: Infinity,
          mean: 0,
          sum: 0,
          max: -Infinity,
          last: vec[n - 1],
        }
      var on = 0
      for (let i = Math.max(range[0], 0); i < n; i++) {
        const v = vec[i]
        if (isNaN(v)) {
          r.missing++
        } else {
          on++
          if (r.min > v) r.min = v
          if (r.max < v) r.max = v
          r.sum += v
        }
      }
      r.mean = on ? r.sum / on : 0
      return r
    } else {
      return {missing: isNaN(vec) + 0, first: vec, min: vec, mean: vec, sum: vec, max: vec, last: vec}
    }
  }

  function passes_filter(entity, time_range, filter, variables) {
    const s = {},
      adjs = {}
    for (let i = filter.filter_by.length; i--; ) {
      const f = filter.filter_by[i]
      const c = variables[f].code
      if (!(c in entity.data)) return false
      const r =
        entity.group in variables[f].info
          ? variables[f].info[entity.group].time_range
          : variables[f].time_range[entity.group]
      if (!r) return false
      adjs[f] = r[0]
      s[f] = vector_summary(entity.data[c], [
        time_range[0] - r[0],
        Math.max(time_range[1] - r[0], time_range[1] - r[1]),
      ])
    }
    for (let i = filter.conditions.length; i--; ) {
      const co = filter.conditions[i]
      if (
        !(co.time_component ? co.check(entity.data[variables[co.name].code], adjs[co.name] || 0) : co.check(s[co.name]))
      )
        return false
    }
    return true
  }

  function passes_feature_filter(entities, id, filter) {
    const entity = entities[id]
    for (var i = filter.length; i--; )
      if (filter[i].value !== '-1')
        if ('id' === filter[i].name) {
          var pass = false
          filter[i].value.forEach(id => {
            if (!pass) {
              const group = id in entities && entities[id].group
              if (
                group && group in entity.features
                  ? id === entity.features[group]
                  : id.length < entity.features.id.length
                  ? id === entity.features.id.substring(0, id.length)
                  : id === entity.features.id
              )
                pass = true
            }
          })
          return pass
        } else if (!filter[i].check(entity.features[filter[i].name])) return false
    return true
  }

  const patterns = {
      seps: /[\s._-]/g,
      comma: /,/,
      word_start: /\b(\w)/g,
      single_operator: /([<>!])([^=])/,
      greater: /%3E$/,
      less: /%3C$/,
      operator_start: /[<>!]$/,
      component: /^(.+)\[(.+)\]/,
      number: /^[0-9.+-]+$/,
      non_letter_num: /[^0-9a-z]+/g,
    },
    export_defaults = {
      file_format: 'csv',
      table_format: 'mixed',
      features: {ID: 'id', Name: 'name'},
      feature_conditions: [],
      variables: {
        filter_by: [],
        conditions: [],
      },
    },
    export_options = {
      file_format: ['csv', 'tsv'],
      table_format: ['tall', 'mixed', 'wide'],
      filter_components: ['first', 'min', 'mean', 'sum', 'max', 'last'],
    },
    row_writers = {
      tall: function (entity, time_range, feats, vars, sep) {
        if (entity.group in this.meta.times) {
          const op = [],
            time = this.meta.times[entity.group].value
          var tr = ''
          Object.keys(feats).forEach(f => {
            tr += '"' + entity.features[feats[f]] + '"' + sep
          })
          vars.forEach(k => {
            const vc = entity.variables[k].code
            if (vc in entity.data) {
              const range = this.meta.variables[entity.group][k].time_range
              var r = ''
              const yn = time_range[1] + 1
              for (let y = time_range[0]; y < yn; y++) {
                if (y >= range[0] && y <= range[1]) {
                  const value = 'number' === typeof entity.data[vc] ? entity.data[vc] : entity.data[vc][y - range[0]]
                  if (!isNaN(value)) {
                    r += (r ? '\n' : '') + tr + time[y] + sep + '"' + k + '"' + sep + value
                  }
                }
              }
              if (r) op.push(r)
            }
          })
          return op.join('\n')
        }
      },
      mixed: function (entity, time_range, feats, vars, sep) {
        if (entity.group in this.meta.times) {
          const op = [],
            time = this.meta.times[entity.group].value
          var tr = ''
          Object.keys(feats).forEach(f => {
            tr += '"' + entity.features[feats[f]] + '"' + sep
          })
          const yn = time_range[1] + 1
          for (let y = time_range[0]; y < yn; y++) {
            var r = tr + time[y]
            vars.forEach(k => {
              const vc = entity.variables[k].code
              if (vc in entity.data) {
                const trange = this.meta.variables[entity.group][k].time_range
                const value =
                  y < trange[0] || y > trange[1]
                    ? NaN
                    : trange[0] === trange[1]
                    ? y === trange[0]
                      ? entity.data[vc]
                      : NaN
                    : entity.data[vc][y - trange[0]]
                r += sep + (isNaN(value) ? 'NA' : value)
              } else r += sep + 'NA'
            })
            op.push(r)
          }
          return op.join('\n')
        }
      },
      wide: function (entity, time_range, feats, vars, sep) {
        if (entity.group in this.meta.times) {
          var r = ''
          Object.keys(feats).forEach(f => {
            r += (r ? sep : '') + '"' + entity.features[feats[f]] + '"'
          })
          vars.forEach(k => {
            const vc = entity.variables[k].code
            const range = this.meta.ranges[k]
            const trange = this.meta.variables[entity.group][k].time_range
            const yn = time_range[1] + 1
            for (let y = time_range[0]; y < yn; y++) {
              if (y >= range[0] && y <= range[1]) {
                if (vc in entity.data) {
                  const value =
                    y < trange[0] || y > trange[1]
                      ? NaN
                      : trange[0] === trange[1]
                      ? y === trange[0]
                        ? entity.data[vc]
                        : NaN
                      : y < trange[0] || y > trange[1]
                      ? NaN
                      : entity.data[vc][y - trange[0]]
                  r += sep + (isNaN(value) ? 'NA' : value)
                } else r += sep + 'NA'
              }
            }
          })
          return r
        }
      },
    },
    group_checks = {
      '!': function (v) {
        return this !== v
      },
      '=': function (v) {
        return this === v
      },
      includes: function (v) {
        return -1 !== this.indexOf(v)
      },
      excludes: function (v) {
        return -1 === this.indexOf(v)
      },
    }

  DataHandler.prototype = {
    constructor: DataHandler,
    checks: {
      '!': function (a) {
        return !a || -1 == a
      },
      '': function (a) {
        return !!a && -1 != a
      },
      '=': function (a, b) {
        return a === b
      },
      '!=': function (a, b) {
        return a != b
      },
      '>': function (a, b) {
        return a > b
      },
      '<': function (a, b) {
        return a < b
      },
      '>=': function (a, b) {
        return a >= b
      },
      '<=': function (a, b) {
        return a <= b
      },
      equals: function (s, e) {
        return !s || -1 == s || s === e
      },
      includes: function (s, e) {
        return !s || !s.length || -1 !== s.indexOf(e)
      },
      excludes: function (s, e) {
        return !s || !s.length || -1 === s.indexOf(e)
      },
      sort_a1: function (a, b) {
        return isNaN(a[1]) ? (isNaN(b[1]) ? 0 : -1) : isNaN(b[1]) ? 1 : a[1] - b[1]
      },
    },
    export_checks: {
      file_format: function (a) {
        return -1 === export_options.file_format.indexOf(a)
      },
      table_format: function (a) {
        return -1 === export_options.table_format.indexOf(a)
      },
      include: function (a, vars) {
        for (let i = a.length; i--; ) {
          if (!(a[i] in vars)) return a[i]
        }
        return ''
      },
    },
    retrievers: {
      single: function (v, t) {
        if (t < 0) return NaN
        if (this.variables[v].is_time) {
          return t < this.time.value.length ? this.time.value[t] : NaN
        } else {
          v = this.variables[v].code
          return 0 === t && v in this.data ? this.data[v] : NaN
        }
      },
      multi: function (v, t) {
        if (t < 0) return NaN
        if (this.variables[v].is_time) {
          return this.time.value[t]
        } else {
          v = this.variables[v].code
          return v in this.data
            ? 'object' === typeof this.data[v]
              ? t < this.data[v].length
                ? this.data[v][t]
                : NaN
              : 0 === t
              ? this.data[v]
              : NaN
            : NaN
        }
      },
      vector: function (r) {
        if (this.variables[r.variable].is_time) {
          return r.entity.time.value
        } else {
          const v = this.variables[r.variable].code
          return v in r.entity.data
            ? 'object' === typeof r.entity.data[v]
              ? r.entity.data[v]
              : [r.entity.data[v]]
            : [NaN]
        }
      },
      row_time: function (d, type, row) {
        const i = this.i - (row.offset - this.o)
        return d && i >= 0 && i < d.length ? ('number' === typeof d[i] ? this.format_value(d[i], row.int) : d[i]) : NaN
      },
    },
    format_value: function (v, int) {
      if (null === v || isNaN(v)) {
        return NaN
      } else if (int) {
        return v
      } else {
        return v.toFixed(this.settings.settings.digits > 0 ? this.settings.settings.digits : 0)
      }
    },
    format_label: function (l) {
      return 'string' !== typeof l
        ? ''
        : l in this.variables && this.variables[l].meta && this.variables[l].meta.short_name
        ? this.variables[l].meta.short_name
        : l.replace(patterns.seps, ' ').replace(patterns.word_start, function (w) {
            return w.toUpperCase()
          })
    },
    ingest_data: function (d, name) {
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
        this.meta.times[name].value.forEach(v => {
          if (-1 === this.meta.overall.value.indexOf(v)) this.meta.overall.value.push(v)
        })
        this.meta.overall.value.sort()
        this.meta.variables[name] = d._meta.variables || {}
        Object.keys(this.meta.variables[name]).forEach(k => {
          if (!(k in this.variables)) {
            this.variables[k] = {
              datasets: [name],
              info: {},
              time_range: {},
              type: NaN,
              meta: {
                full_name: k,
                measure: k.split(':')[1] || k,
                short_name: this.format_label(k),
                long_name: k,
                type: NaN,
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
    },
    retrieve: async function (name, url) {
      if (!this.load_requests[name]) {
        this.load_requests[name] = url
        const f = new window.XMLHttpRequest()
        f.onreadystatechange = () => {
          if (4 === f.readyState) {
            if (200 === f.status) {
              this.ingest_data(JSON.parse(f.responseText), name)
            } else {
              throw new Error('load_data failed: ' + f.responseText)
            }
          }
        }
        f.open('GET', url, true)
        f.send()
      }
    },
    ingest_map: function (m, url, field) {
      this.data_maps[url].resource = m
      this.data_maps[url].retrieved = true
      this.data_maps[url].queue.forEach(k => {
        if (this.info[k].schema.fields.length > field) {
          this.info[k].schema.fields[field].ids = this.data_maps[k] =
            k in this.data_maps[url].resource ? this.data_maps[url].resource[k] : this.data_maps[url].resource
          this.map_entities(k)
        }
      })
      this.hooks.data_load && this.hooks.data_load()
    },
    load_id_maps: async function () {
      this.metadata.datasets.forEach(k => {
        var has_map = false
        this.info[k].ids.forEach((id, i) => {
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
              if ('undefined' === typeof window) {
                require('https')
                  .get(id.map, r => {
                    const c = []
                    r.on('data', d => {
                      c.push(d)
                    })
                    r.on('end', () => {
                      this.ingest_map(JSON.parse(c.join('')), r.req.protocol + '//' + r.req.host + r.req.path, i)
                    })
                  })
                  .end()
              } else {
                const f = new window.XMLHttpRequest()
                f.onreadystatechange = function (url, fi) {
                  if (4 === f.readyState) {
                    if (200 === f.status) {
                      this.ingest_map(JSON.parse(f.responseText), url, fi)
                    } else {
                      throw new Error('load_id_maps failed: ' + f.responseText)
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
    },
    init_summary: function (v, d) {
      if (!this.inited_summary[d + v]) {
        ;(this.in_browser ? Object.keys(this.settings.dataviews) : ['default_view']).forEach(view => {
          const vi = this.variables[v]
          if (!(view in vi))
            vi[view] = {order: {}, selected_order: {}, selected_summaries: {}, summaries: {}, state: {}}
          if (!(d in vi.time_range)) {
            vi.time_range[d] = [0, this.meta.times[d].n - 1]
          }
          const ny = (vi.time_range[d][2] = vi.time_range[d][1] - vi.time_range[d][0] + 1)
          const m = vi[view],
            c = vi.code
          if (d in this.sets) {
            var o
            const da = this.sets[d]
            const n = this.info[d].entity_count
            const at = !n || n > 65535 ? Uint32Array : n > 255 ? Uint16Array : Uint8Array
            const info = vi.info[d]
            const is_string = 'string' === info.type
            if ('order' in info) {
              o = info.order
              Object.keys(da).forEach(k => {
                if (!(k in this.entities)) {
                  this.entities[k] = {}
                }
                if (!(view in this.entities[k])) this.entities[k][view] = {summary: {}, rank: {}, subset_rank: {}}
                this.entities[k][view].rank[v] = new at(ny)
                this.entities[k][view].subset_rank[v] = new at(ny)
              })
            } else {
              info.order = o = []
              for (let y = ny; y--; ) {
                o.push([])
              }
              Object.keys(da).forEach(k => {
                const dak = da[k]
                if ('_meta' !== k && c in dak) {
                  const ev = dak[c]
                  if (1 === ny) {
                    if (is_string && ev in vi.levels_ids) {
                      o[0].push([k, vi.levels_ids[ev]])
                    } else if ('number' !== typeof ev) {
                      dak[c] = NaN
                      o[0].push([k, NaN])
                    } else o[0].push([k, ev])
                  } else {
                    for (let y = ny; y--; ) {
                      if (is_string && ev[y] in vi.levels_ids) {
                        ev[y] = vi.levels_ids[ev[y]]
                      } else if ('number' !== typeof ev[y]) ev[y] = NaN
                      o[y].push([k, ev[y]])
                    }
                    Object.freeze(ev)
                  }
                  if (!(k in this.entities)) {
                    this.entities[k] = {}
                  }
                  if (!(view in this.entities[k])) this.entities[k][view] = {summary: {}, rank: {}, subset_rank: {}}
                  const eview = this.entities[k][view]
                  if (!(v in eview.rank)) {
                    eview.rank[v] = new at(ny)
                    eview.subset_rank[v] = new at(ny)
                  }
                }
              })
            }
            o.forEach((ev, y) => {
              ev = o[y]
              if (!Object.isFrozen(ev)) {
                ev.sort(this.checks.sort_a1)
                Object.freeze(ev)
              }
              ev.forEach((r, i) => {
                this.entities[r[0]][view].rank[v][y] = i
              })
            })
          }
          if (!(d in m.summaries)) {
            m.order[d] = []
            m.selected_order[d] = []
            m.selected_summaries[d] = {n: [], missing: []}
            if ('string' === vi.info[d].type) {
              m.table = {}
              vi.levels.forEach(l => {
                m.table[l] = []
                for (let y = ny; y--; ) m.table[l].push(0)
              })
              m.summaries[d] = {
                filled: false,
                missing: [],
                n: [],
                mode: [],
                level_ids: vi.levels_ids,
                levels: vi.levels,
              }
              for (let y = ny; y--; ) {
                m.order[d].push([])
                m.selected_order[d].push([])
                m.summaries[d].missing.push(0)
                m.summaries[d].n.push(0)
                m.summaries[d].mode.push('')
              }
            } else {
              m.summaries[d] = {
                filled: false,
                missing: [],
                n: [],
                sum: [],
                max: [],
                q3: [],
                mean: [],
                range: [],
                norm_median: [],
                break_median: [],
                lower_median_min: [],
                lower_median_range: [],
                upper_median_min: [],
                upper_median_range: [],
                norm_mean: [],
                break_mean: [],
                lower_mean_min: [],
                lower_mean_range: [],
                upper_mean_min: [],
                upper_mean_range: [],
                median: [],
                q1: [],
                min: [],
              }
              for (let y = ny; y--; ) {
                m.order[d].push([])
                m.selected_order[d].push([])
                m.selected_summaries[d].n.push(0)
                m.selected_summaries[d].missing.push(0)
                m.summaries[d].missing.push(0)
                m.summaries[d].n.push(0)
                m.summaries[d].sum.push(0)
                m.summaries[d].max.push(-Infinity)
                m.summaries[d].q3.push(0)
                m.summaries[d].mean.push(0)
                m.summaries[d].norm_median.push(0)
                m.summaries[d].break_median.push(-1)
                m.summaries[d].lower_median_min.push(-1)
                m.summaries[d].lower_median_range.push(-1)
                m.summaries[d].upper_median_min.push(-1)
                m.summaries[d].upper_median_range.push(-1)
                m.summaries[d].norm_mean.push(0)
                m.summaries[d].break_mean.push(-1)
                m.summaries[d].lower_mean_min.push(-1)
                m.summaries[d].lower_mean_range.push(-1)
                m.summaries[d].upper_mean_min.push(-1)
                m.summaries[d].upper_mean_range.push(-1)
                m.summaries[d].median.push(0)
                m.summaries[d].q1.push(0)
                m.summaries[d].min.push(Infinity)
              }
            }
            Object.seal(m.order[d])
            Object.seal(m.selected_order[d])
            Object.seal(m.selected_summaries[d])
            Object.seal(m.summaries[d])
          }
        })
      }
    },
    calculate_summary: async function (measure, view, full) {
      const v = this.settings.dataviews[view]
      const dataset = v.get.dataset()
      await this.data_processed[dataset]
      const summaryId = dataset + measure
      if (!this.inited_summary[summaryId]) this.init_summary(measure, dataset)
      this.inited_summary[summaryId] = new Promise(resolve => {
        this.summary_ready[summaryId] = resolve
      })
      const variable = this.variables[measure],
        m = variable[view]
      if (m.state[dataset] !== v.state) {
        const s = v.selection[this.settings.settings.summary_selection],
          a = v.selection.all,
          mo = m.order[dataset],
          mso = m.selected_order[dataset],
          mss = m.selected_summaries[dataset],
          ms = m.summaries[dataset],
          ny = variable.time_range[dataset][2],
          order = variable.info[dataset].order,
          levels = variable.levels,
          levels_ids = variable.levels_ids,
          subset = v.n_selected[this.settings.settings.summary_selection] !== v.n_selected.dataset
        for (let y = ny; y--; ) {
          mo[y] = subset ? [] : order[y]
          mso[y] = subset ? [] : order[y]
          mss.missing[y] = 0
          mss.n[y] = 0
          ms.missing[y] = 0
          ms.n[y] = 0
          if (levels) {
            ms.mode[y] = ''
            levels.forEach(k => (m.table[k][y] = 0))
          } else {
            ms.sum[y] = 0
            ms.mean[y] = 0
            ms.max[y] = -Infinity
            ms.min[y] = Infinity
            ms.break_mean[y] = -1
            ms.break_median[y] = -1
          }
        }
        order.forEach((o, y) => {
          const moy = mo[y],
            msoy = mso[y]
          var rank = 0
          o.forEach(oi => {
            const k = oi[0],
              value = oi[1]
            if (k in s) {
              const en = s[k][view],
                present = !isNaN(value)
              if (!y) {
                if (!(measure in en.summary)) en.summary[measure] = {n: 0, overall: ms, order: mo}
                en.summary[measure].n = 0
              }
              if (full && subset) {
                moy.push(oi)
                if (k in a) {
                  msoy.push(oi)
                  if (present) {
                    mss.n[y]++
                  } else mss.missing[y]++
                }
              }
              if (present) {
                en.subset_rank[measure][y] = rank++
                en.summary[measure].n++
                ms.n[y]++
                if (levels) {
                  m.table[levels[value]][y]++
                } else {
                  ms.sum[y] += value
                  if (value > ms.max[y]) ms.max[y] = value
                  if (value < ms.min[y]) ms.min[y] = value
                }
              } else ms.missing[y]++
            }
          })
        })
        if (full) {
          mo.forEach((o, y) => {
            if (levels) {
              if (ms.n[y]) {
                let l = 0
                Object.keys(m.table).forEach(k => {
                  if (m.table[k][y] > m.table[levels[l]][y]) l = levels_ids[k]
                })
                ms.mode[y] = levels[l]
              } else ms.mode[y] = NaN
            } else {
              if (ms.n[y]) {
                ms.mean[y] = ms.sum[y] / ms.n[y]
                if (!isFinite(ms.min[y])) ms.min[y] = ms.mean[y]
                if (!isFinite(ms.max[y])) ms.max[y] = ms.mean[y]
                ms.range[y] = ms.max[y] - ms.min[y]
                if (1 === ms.n[y]) {
                  ms.q3[y] = ms.median[y] = ms.q1[y] = null == o[0][1] ? ms.mean[y] : o[0][1]
                } else {
                  ms.median[y] = quantile(0.5, ms.n[y], ms.missing[y], o)
                  ms.q3[y] = quantile(0.75, ms.n[y], ms.missing[y], o)
                  ms.q1[y] = quantile(0.25, ms.n[y], ms.missing[y], o)
                }
                const n = o.length
                for (let i = ms.missing[y], bmd = false, bme = false; i < n; i++) {
                  if (!bmd && o[i][1] > ms.median[y]) {
                    ms.break_median[y] = i - 1
                    bmd = true
                  }
                  if (!bme && o[i][1] > ms.mean[y]) {
                    ms.break_mean[y] = i - 1
                    bme = true
                  }
                  if (bmd && bme) break
                }
              } else {
                ms.max[y] = 0
                ms.q3[y] = 0
                ms.median[y] = 0
                ms.q1[y] = 0
                ms.min[y] = 0
              }
              if (ms.n[y]) {
                ms.norm_median[y] = ms.range[y] ? (ms.median[y] - ms.min[y]) / ms.range[y] : 0.5
                if (-1 !== ms.break_median[y]) {
                  ms.lower_median_min[y] = ms.norm_median[y] - (o[ms.missing[y]][1] - ms.min[y]) / ms.range[y]
                  ms.lower_median_range[y] =
                    ms.norm_median[y] - ((o[ms.break_median[y]][1] - ms.min[y]) / ms.range[y] - ms.lower_median_min[y])
                  ms.upper_median_min[y] = ms.norm_median[y] - (o[ms.break_median[y]][1] - ms.min[y]) / ms.range[y]
                  ms.upper_median_range[y] =
                    (o[o.length - 1][1] - ms.min[y]) / ms.range[y] - ms.norm_median[y] - ms.upper_median_min[y]
                }
                ms.norm_mean[y] = ms.range[y] ? (ms.mean[y] - ms.min[y]) / ms.range[y] : 0.5
                if (-1 !== ms.break_mean[y]) {
                  ms.lower_mean_min[y] = ms.norm_mean[y] - (o[ms.missing[y]][1] - ms.min[y]) / ms.range[y]
                  ms.lower_mean_range[y] =
                    ms.norm_mean[y] - ((o[ms.break_mean[y]][1] - ms.min[y]) / ms.range[y] - ms.lower_mean_min[y])
                  ms.upper_mean_min[y] = ms.norm_mean[y] - (o[ms.break_mean[y]][1] - ms.min[y]) / ms.range[y]
                  ms.upper_mean_range[y] =
                    (o[o.length - 1][1] - ms.min[y]) / ms.range[y] - ms.norm_mean[y] - ms.upper_mean_min[y]
                }
              }
            }
          })
        } else {
          for (let y = 0; y < ny; y++) {
            if (ms.n[y]) {
              if (levels) {
                q1 = 0
                m.table.forEach(k => {
                  if (m.table[k][y] > m.table[levels[q1]][y]) q1 = levels_ids[k]
                })
                ms.mode[y] = levels[q1]
              } else ms.mean[y] = ms.sum[y] / ms.n[y]
            } else {
              ms[levels ? 'mode' : 'mean'][y] = NaN
            }
          }
        }
        ms.filled = true
        m.state[dataset] = v.state
        this.summary_ready[summaryId]()
      } else await this.summary_ready[summaryId]
    },
    map_variables: function () {
      this.metadata.datasets.forEach(k => {
        this.data_queue[k] = {}
        const m = this.info[k]
        if (m) {
          m.id_vars = m.ids.map(id => id.variable)
          m.schema.fields.forEach(v => {
            const vn = v.name
            if (vn in this.variables) {
              const ve = this.variables[vn]
              ve.datasets.push(k)
              ve.info[k] = v
              if ('string' === v.type) {
                ve.levels = []
                ve.levels_ids = {}
                ;((v.info && v.info.levels) || Object.keys(v.table)).forEach(l => {
                  if (!(l in ve.levels_ids)) {
                    ve.levels_ids[l] = ve.levels.length
                    ve.levels.push(l)
                  }
                })
              }
            } else {
              const ve = (this.variables[vn] = {
                datasets: [k],
                info: {},
                time_range: {},
                type: v.type,
              })
              ve.info[k] = v
              if ('string' === v.type) {
                ve.levels = []
                ve.levels_ids = {}
                ;(v.info.levels || Object.keys(v.table)).forEach(l => {
                  ve.levels_ids[l] = ve.levels.length
                  ve.levels.push(l)
                })
              }
              ve.meta = ve.info[k].info
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
    },
    map_entities: async function (g) {
      if (g in this.sets && !this.inited[g]) {
        const s = this.sets[g],
          time = this.meta.times[g],
          retriever = this.retrievers[time.is_single ? 'single' : 'multi'],
          datasets = Object.keys(this.sets),
          infos = this.info
        Object.keys(s).forEach(id => {
          const si = s[id],
            l = id.length
          if ('_meta' !== id) {
            const overwrite = this.data_maps[g][id]
            const f = overwrite || {id: id, name: id}
            f.id = id
            const e =
              id in this.entities
                ? this.entities[id]
                : {
                    group: g,
                    data: si,
                    variables: this.variables,
                    features: f,
                  }
            if (id in this.entities) {
              e.group = g
              e.data = si
              e.variables = this.variables
              if (!('features' in e)) e.features = {}
            } else {
              this.entities[id] = e
            }
            if (!(id in this.entity_tree)) this.entity_tree[id] = {parents: {}, children: {}}
            const rel = this.entity_tree[id]
            e.relations = rel
            Object.keys(f).forEach(k => {
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
              datasets.forEach(d => {
                const p = infos[d].id_length
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
            ;(this.in_browser ? Object.keys(this.settings.dataviews) : ['default_view']).forEach(v => {
              if (!(v in e)) {
                e[v] = {summary: {}, rank: {}, subset_rank: {}}
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
            Object.keys(this.data_queue[g]).forEach(id => {
              this.data_queue[g][id]()
              delete this.data_queue[g][id]
            })
          this.hooks.onload && this.hooks.onload(g)
        }, 0)
      }
      for (const k in this.info)
        if (Object.prototype.hasOwnProperty.call(this.info, k) && !this.inited[k]) return void 0
      this.all_data_ready()
    },
    parse_query: function (q) {
      const f = JSON.parse(JSON.stringify(export_defaults))
      if ('string' === typeof q) {
        if ('?' === q[0]) q = q.substring(1)
        const aq = q.split('&')
        q = {}
        aq.forEach(aqi => {
          const a = aqi.split('=')
          q[a[0]] = a.length > 1 ? a[1] : ''
        })
      }
      q &&
        Object.keys(q).forEach(k => {
          if ('include' === k || 'exclude' === k || k in f) {
            f[k] = q[k]
          } else {
            let a = []
            if (patterns.single_operator.test(k)) {
              a = k.replace(patterns.single_operator, '$1=$2').split('=')
              if (a.length > 1) {
                k = a[0]
                q[k] = a[1]
              }
            }
            const aq = patterns.component.exec(k),
              tf = {
                name: k.replace(patterns.greater, '>').replace(patterns.less, '<'),
                component: 'mean',
                operator: '=',
                value: patterns.number.test(q[k]) ? Number(q[k]) : q[k],
              }
            if ('object' === typeof q[k]) {
              if ('component' in q[k]) tf.component = q[k].component
              if ('operator' in q[k]) tf.operator = q[k].operator
              if ('value' in q[k]) tf.value = q[k].value
            }
            k = tf.name
            if (aq) {
              if (-1 !== export_options.filter_components.indexOf(aq[2])) {
                tf.component = aq[2]
                tf.name = aq[1]
              } else if (patterns.number.test(aq[2])) {
                const time = Number(aq[2])
                const i =
                  time > 0 && time < this.meta.overall.value.length ? time : this.meta.overall.value.indexOf(time)
                if (-1 !== i) {
                  tf.time_component = true
                  tf.component = i
                  tf.name = aq[1]
                }
              }
            }
            if (patterns.operator_start.test(k) && k[k.length - 1] in this.checks) {
              tf.operator = k[k.length - 1]
              if (!a.length) tf.operator += '='
              if (k === tf.name) tf.name = k.substring(0, k.length - 1)
            }
            if (undefined === tf.value || '-1' == tf.value) return
            if (('=' === tf.operator || '!' === tf.operator) && patterns.comma.test(tf.value)) {
              tf.value = tf.value.split(',')
              tf.operator = '=' === tf.operator ? 'includes' : 'excludes'
            }
            if ('time_range' === tf.name) {
              if ('object' === typeof tf.value) {
                f.time_range = [
                  this.meta.overall.value.indexOf(Number(tf.value[0])),
                  this.meta.overall.value.indexOf(Number(tf.value[1])),
                ]
              } else {
                const i = this.meta.overall.value.indexOf(Number(tf.value))
                f.time_range =
                  '=' === tf.operator ? [i, i] : '>' === tf.operator ? [i, this.meta.overall.value.length - 1] : [0, i]
              }
              if (-1 === f.time_range[0]) f.time_range[0] = 0
              if (-1 === f.time_range[1])
                f.time_range[1] = this.meta.overall.value.length ? this.meta.overall.value.length - 1 : 0
            } else if ('dataset' === tf.name) {
              f.dataset = tf
            } else if (tf.name in this.features) {
              if ('id' === tf.name) {
                tf.value = Array.isArray(tf.value) ? tf.value : String(tf.value).split(',')
              }
              tf.check = group_checks[tf.operator].bind(tf.value)
              f.feature_conditions.push(tf)
            } else if (tf.name in this.variables) {
              tf.check = (
                tf.time_component
                  ? function (d, adj) {
                      const multi = 'number' !== typeof d,
                        i = this.condition.component - adj
                      return multi
                        ? this.check(d[i], this.condition.value)
                        : !i
                        ? this.check(d, this.condition.value)
                        : false
                    }
                  : function (s) {
                      return this.check(s[this.condition.component], this.condition.value)
                    }
              ).bind({check: this.checks[tf.operator], condition: tf})
              if (-1 === f.variables.filter_by.indexOf(tf.name)) f.variables.filter_by.push(tf.name)
              f.variables.conditions.push(tf)
            }
          }
        })
      if (!('time_range' in f))
        f.time_range = [0, this.meta.overall.value.length ? this.meta.overall.value.length - 1 : 0]
      return f
    },
    export: async function (query, entities, in_browser, all_data) {
      if (!in_browser) await this.data_ready
      query = this.parse_query(query)
      entities = entities || this.entities
      if (-1 === export_options.file_format.indexOf(query.file_format)) query.file_format = export_defaults.file_format
      if (!(query.table_format in row_writers)) query.table_format = export_defaults.table_format
      const res = {statusCode: 400, headers: {'Content-Type': 'text/plain; charset=utf-8'}, body: 'Invalid Request'},
        inc =
          query.include && query.include.length
            ? 'string' === typeof query.include
              ? query.include.split(',')
              : query.include
            : Object.keys(this.variables),
        exc = query.exclude || [],
        vars = [],
        feats = query.features || JSON.parse(JSON.stringify(export_defaults.features)),
        rows = [],
        range = [Infinity, -Infinity],
        sep = 'csv' === query.file_format ? ',' : '\t',
        rw = row_writers[query.table_format].bind(this),
        no_filter = !query.variables.filter_by.length,
        no_feature_filter = !query.feature_conditions.length,
        in_group = !('dataset' in query) ? void 0 : group_checks[query.dataset.operator].bind(query.dataset.value)
      inc.forEach(ii => {
        if (ii in this.features && !(ii in feats)) {
          feats[ii] = this.format_label(ii)
        }
      })
      for (const k in this.export_checks)
        if (k in query) {
          const r = this.export_checks[k]('include' === k ? inc : query[k], this.variables)
          if (r) {
            res.body = 'Failed check for ' + k + ': ' + r
            return res
          }
        }
      Object.keys(this.variable_codes).forEach(k => {
        if (-1 !== inc.indexOf(this.variable_codes[k].name) && -1 === exc.indexOf(this.variable_codes[k].name)) {
          vars.push(this.variable_codes[k].name)
          const tr = this.meta.ranges[this.variable_codes[k].name]
          if (tr[0] < range[0]) range[0] = tr[0]
          if (tr[1] > range[1]) range[1] = tr[1]
        }
      })
      if (query.time_range[0] < range[0]) query.time_range[0] = range[0]
      if (query.time_range[1] > range[1]) query.time_range[1] = range[1]
      rows.push(Object.keys(feats).join(sep))
      if ('wide' === query.table_format) {
        vars.forEach(vi => {
          const tr = this.meta.ranges[vi],
            yn = Math.min(query.time_range[1], tr[1]) + 1
          for (let y = Math.max(query.time_range[0], tr[0]); y < yn; y++) {
            rows[0] += sep + vi + '_' + this.meta.overall.value[y]
          }
        })
      } else rows[0] += sep + 'time' + sep + ('mixed' === query.table_format ? vars : ['variable', 'value']).join(sep)
      let first_entity = ''
      Object.keys(entities).forEach(k => {
        const e = entities[k]
        if (
          (!in_group || in_group(e.group)) &&
          (no_feature_filter || passes_feature_filter(entities, k, query.feature_conditions)) &&
          (no_filter || passes_filter(e, query.time_range, query.variables, this.variables))
        ) {
          const r = rw(e, query.time_range, feats, vars, sep)
          if (r) {
            if (!first_entity) first_entity = k
            rows.push(r)
          }
        }
      })
      res.headers['Content-Type'] = 'text/' + (',' === sep ? 'csv' : 'plain') + '; charset=utf-8'
      res.body = rows.join('\n')
      const times = this.meta.overall.value,
        filename =
          'export_' +
          (in_browser && !all_data && first_entity
            ? entities[first_entity].group + '_'
            : query.dataset
            ? query.dataset.value + '_'
            : '') +
          (query.time_range[0] === query.time_range[1]
            ? times[query.time_range[0]]
            : times[query.time_range[0]] + '-' + times[query.time_range[1]]) +
          '_' +
          (1 === vars.length
            ? this.variables[vars[0]].meta.short_name.toLowerCase().replace(patterns.non_letter_num, '-')
            : vars.length + '-variables') +
          '_' +
          (rows.join('\n').split('\n').length - 1) +
          'x' +
          rows[0].split(sep).length
      if (in_browser) {
        const e = document.createElement('a')
        document.body.appendChild(e)
        e.rel = 'noreferrer'
        e.target = '_blank'
        e.download = filename + '.' + query.file_format
        e.href = URL.createObjectURL(new Blob([res.body], {type: res.headers['Content-Type']}))
        setTimeout(function () {
          e.dispatchEvent(new MouseEvent('click'))
          URL.revokeObjectURL.bind(null, e.href)
          document.body.removeChild(e)
        }, 0)
      } else {
        res.statusCode = 200
        res.headers['Content-Disposition'] = 'attachment; filename=' + filename + '.' + query.file_format
        return res
      }
    },
  }

  if ('undefined' === typeof module) {
    window.DataHandler = DataHandler
  } else {
    module.exports = DataHandler
  }
})()
