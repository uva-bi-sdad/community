'use strict'
function DataHandler(settings, defaults, data, hooks) {
  if (!Object.hasOwn) {
    Object.defineProperty(Object, 'hasOwn', {
      value: function (object, property) {
        if (object == null) {
          throw new TypeError('Cannot convert undefined or null to object')
        }
        return Object.prototype.hasOwnProperty.call(Object(object), property)
      },
      configurable: true,
      enumerable: false,
      writable: true,
    })
  }
  this.hooks = hooks || {}
  this.defaults = defaults || {dataview: 'default_view', time: 'time'}
  this.settings = settings
  this.info = (settings && settings.metadata.info) || {}
  this.features = {}
  this.variables = {}
  this.variable_codes = {}
  this.variable_info = {}
  this.entities = {}
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
  this.sets = {}
  this.data_maps = {}
  this.data_queue = {}
  this.in_browser = 'undefined' === typeof module
  this.data_ready = new Promise(resolve => {
    this.all_data_ready = resolve
  })
  data = data || {}
  if ('string' === typeof settings.metadata.datasets) settings.metadata.datasets = [settings.metadata.datasets]
  this.map_variables()
  for (var k, i = settings.metadata.datasets.length; i--; ) {
    k = settings.metadata.datasets[i]
    this.loaded[k] = Object.hasOwn(data, k)
    if (this.loaded[k]) {
      this.ingest_data(data[k], k)
    } else {
      this.retrieve(k, settings.metadata.info[k].site_file)
    }
  }
}

function quantile(p, n, o, x, l1) {
  var a = p * (n - 1),
    ap = a % 1,
    bp = 1 - ap,
    b = o + Math.ceil(a)
  a = o + Math.floor(a)
  return l1 ? x[a] * ap + x[b] * bp : x[a][1] * ap + x[b][1] * bp
}

function make_variable_reference(c) {
  for (
    var e = document.createElement('li'), s = '', i = c.author.length, j = 1 === i ? '' : 2 === i ? ' & ' : ', & ';
    i--;

  ) {
    s =
      (i ? j : '') + c.author[i].family + (c.author[i].given ? ', ' + c.author[i].given.substring(0, 1) + '.' : '') + s
    j = ', '
  }
  e.innerHTML =
    s +
    ' (' +
    c.year +
    '). ' +
    c.title +
    '.' +
    (c.journal
      ? ' <em>' + c.journal + (c.volume ? ', ' + c.volume : '') + '</em>' + (c.page ? ', ' + c.page : '') + '.'
      : '') +
    (c.version ? ' Version ' + c.version + '.' : '') +
    (c.doi || c.url
      ? (c.doi ? ' doi: ' : ' url: ') +
        (c.doi || c.url
          ? '<a rel="noreferrer" target="_blank" href="' +
            (c.doi ? 'https://doi.org/' + c.doi : c.url) +
            '">' +
            (c.doi || c.url.replace(patterns.http, '')) +
            '</a>'
          : '')
      : '')
  return e
}

function vector_summary(vec, range) {
  if ('object' === typeof vec) {
    var n = Math.min(range[1] + 1, vec.length),
      on = 0,
      i = Math.max(range[0], 0),
      o = [],
      v
    const r = {
      first: vec[0],
      min: Infinity,
      mean: 0,
      sum: 0,
      max: -Infinity,
      last: vec[n - 1],
    }
    for (; i < n; i++) {
      v = vec[i]
      o.push(v)
      if (!isNaN(v)) {
        on++
        if (r.min > v) r.min = v
        if (r.max < v) r.max = v
        r.sum += v
      }
    }
    r.mean = on ? r.sum / on : 0
    return r
  } else {
    return {first: vec, min: vec, mean: vec, max: vec, last: vec}
  }
}

function passes_filter(entity, time_range, filter, codes) {
  const s = {}
  for (var i = filter.filter_by.length, r; i--; ) {
    if (!Object.hasOwn(entity.data, filter.filter_by[i])) return false
    r = codes[filter.filter_by[i]].time_range[entity.group]
    s[filter.filter_by[i]] = vector_summary(entity.data[filter.filter_by[i]], [
      time_range[0] - r[0],
      Math.max(time_range[1] - r[0], time_range[1] - r[1]),
    ])
  }
  for (i = filter.conditions.length; i--; ) {
    if (!filter.conditions[i].check(s[filter.conditions[i].name])) return false
  }
  return true
}

function passes_feature_filter(entity, filter) {
  for (var i = filter.length; i--; ) if (!filter[i].check(entity.features[filter[i].name])) return false
  return true
}

const patterns = {
    seps: /[\s._-]/g,
    comma: /,/,
    word_start: /\b(\w)/g,
    single_operator: /([<>!])([^=])/,
    operator_start: /[<>!]$/,
    component: /^(.+)\[(.+)\]/,
    number: /^[0-9.+-]+$/,
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
      const op = [],
        time = this.meta.times[entity.group].value
      var tr = '',
        yn = 0,
        y = 0,
        vc,
        i = 0,
        r = '',
        n = vars.length,
        f,
        range,
        v
      for (f in feats)
        if (Object.hasOwn(feats, f)) {
          tr += '"' + entity.features[feats[f]] + '"' + sep
        }
      for (; i < n; i++) {
        vc = entity.variables[vars[i]].code
        if (Object.hasOwn(entity.data, vc)) {
          range = this.meta.variables[entity.group][vars[i]].time_range
          r = ''
          for (yn = time_range[1] + 1, y = time_range[0]; y < yn; y++) {
            if (y >= range[0] && y <= range[1]) {
              v = 'number' === typeof entity.data[vc] ? entity.data[vc] : entity.data[vc][y]
              if (!isNaN(v)) {
                r += (r ? '\n' : '') + tr + time[y] + sep + '"' + vars[i] + '"' + sep + v
              }
            }
          }
          if (r) op.push(r)
        }
      }
      return op.join('\n')
    },
    mixed: function (entity, time_range, feats, vars, sep) {
      const op = [],
        time = this.meta.times[entity.group].value
      var tr = '',
        yn = 0,
        y = 0,
        vc,
        i = 0,
        r = '',
        n = vars.length,
        f,
        trange,
        v
      for (f in feats)
        if (Object.hasOwn(feats, f)) {
          tr += '"' + entity.features[feats[f]] + '"' + sep
        }
      for (yn = time_range[1] + 1, y = time_range[0]; y < yn; y++) {
        r = tr + time[y]
        for (i = 0; i < n; i++) {
          vc = entity.variables[vars[i]].code
          if (Object.hasOwn(entity.data, vc)) {
            trange = this.meta.variables[entity.group][vars[i]].time_range
            v =
              y < trange[0] || y > trange[1]
                ? NaN
                : trange[0] === trange[1]
                ? y === trange[0]
                  ? entity.data[vc]
                  : NaN
                : entity.data[vc][y - trange[0]]
            r += sep + (isNaN(v) ? 'NA' : v)
          } else r += sep + 'NA'
        }
        op.push(r)
      }
      return op.join('\n')
    },
    wide: function (entity, time_range, feats, vars, sep) {
      var yn = this.meta.overall.value.length,
        y = 0,
        vc,
        i = 0,
        r = '',
        n = vars.length,
        f,
        trange,
        range,
        v
      for (f in feats)
        if (Object.hasOwn(feats, f)) {
          r += (r ? sep : '') + '"' + entity.features[feats[f]] + '"'
        }
      for (i = 0; i < n; i++) {
        vc = entity.variables[vars[i]].code
        range = this.meta.ranges[vars[i]]
        trange = this.meta.variables[entity.group][vars[i]].time_range
        for (yn = time_range[1] + 1, y = time_range[0]; y < yn; y++) {
          if (y >= range[0] && y <= range[1]) {
            if (Object.hasOwn(entity.data, vc)) {
              v =
                y < trange[0] || y > trange[1]
                  ? NaN
                  : trange[0] === trange[1]
                  ? y === trange[0]
                    ? entity.data[vc]
                    : NaN
                  : y < trange[0] || y > trange[1]
                  ? NaN
                  : entity.data[vc][y - trange[0]]
              r += sep + (isNaN(v) ? 'NA' : v)
            } else r += sep + 'NA'
          }
        }
      }
      return r
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
      for (var i = a.length; i--; ) {
        if (!Object.hasOwn(vars, a[i])) return a[i]
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
        return 0 === t && Object.hasOwn(this.data, v) ? this.data[v] : NaN
      }
    },
    multi: function (v, t) {
      if (t < 0) return NaN
      if (this.variables[v].is_time) {
        return this.time.value[t]
      } else {
        v = this.variables[v].code
        return Object.hasOwn(this.data, v)
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
        return Object.hasOwn(r.entity.data, v)
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
      return 'unknown'
    } else if (int) {
      return v
    } else {
      if (this.settings.settings.digits > 0) {
        const d = Math.pow(10, this.settings.settings.digits),
          r = (Math.round(v * d) / d + '').split('.')
        return (
          r[0] + ('.' + (1 === r.length ? '' : r[1]) + '0000000000').substring(0, this.settings.settings.digits + 1)
        )
      } else return Math.round(v)
    }
  },
  format_label: function (l) {
    return Object.hasOwn(this.variables, l) && this.variables[l].meta && this.variables[l].meta.short_name
      ? this.variables[l].meta.short_name
      : l.replace(patterns.seps, ' ').replace(patterns.word_start, function (w) {
          return w.toUpperCase()
        })
  },
  ingest_data: function (d, name) {
    this.sets[name] = d
    this.loaded[name] = true
    var k, t, i
    if (!Object.hasOwn(this.info, name)) this.info[name] = {schema: {fields: []}, ids: []}
    if (Object.hasOwn(d, '_meta')) {
      this.meta.times[name] = d._meta.time
      if ('object' !== typeof this.meta.times[name].value) this.meta.times[name].value = [this.meta.times[name].value]
      this.meta.times[name].n = this.meta.times[name].value.length
      this.meta.times[name].is_single = 1 === this.meta.times[name].n
      this.meta.times[name].range = [
        this.meta.times[name].value[0],
        this.meta.times[name].value[this.meta.times[name].n - 1],
      ]
      if (Object.hasOwn(this.variables, d._meta.time.name)) {
        this.meta.times[name].info = this.variables[this.meta.times[name].name]
        this.meta.times[name].info.is_time = true
      }
      if (this.meta.times[name].range[0] < this.meta.overall.range[0])
        this.meta.overall.range[0] = this.meta.times[name].range[0]
      if (this.meta.times[name].range[1] > this.meta.overall.range[1])
        this.meta.overall.range[1] = this.meta.times[name].range[1]
      for (i = this.meta.times[name].value.length; i--; ) {
        if (-1 === this.meta.overall.value.indexOf(this.meta.times[name].value[i])) {
          this.meta.overall.value.push(this.meta.times[name].value[i])
          this.meta.overall.value.sort()
        }
      }
      this.meta.variables[name] = d._meta.variables || {}
      for (k in this.meta.variables[name]) {
        if (!Object.hasOwn(this.variables, k)) {
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
        this.variables[k].time_range[name] = t = this.meta.variables[name][k].time_range
        this.variable_codes[this.variables[k].code] = this.variables[k]
        if (-1 !== t[0]) {
          if (Object.hasOwn(this.meta.ranges, k)) {
            if (t[0] < this.meta.ranges[k][0]) this.meta.ranges[k][0] = t[0]
            if (t[1] > this.meta.ranges[k][1]) this.meta.ranges[k][1] = t[1]
          } else {
            this.meta.ranges[k] = [t[0], t[1]]
          }
        }
      }
    }
    if (this.in_browser && this.settings.settings.partial_init && k === this.defaults.dataset) {
      this.load_id_maps()
    } else {
      for (k in this.loaded) if (Object.hasOwn(this.loaded, k) && !this.loaded[k]) return void 0
      this.load_id_maps()
    }
  },
  retrieve: async function (name, url) {
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
  },
  ingest_map: function (m, url, field) {
    this.data_maps[url].resource = m
    this.data_maps[url].retrieved = true
    for (var k, i = this.data_maps[url].queue.length; i--; ) {
      k = this.data_maps[url].queue[i]
      if (Object.hasOwn(this.info, k) && this.info[k].schema.fields.length > field) {
        this.info[k].schema.fields[field].ids = this.data_maps[k] = Object.hasOwn(this.data_maps[url].resource, k)
          ? this.data_maps[url].resource[k]
          : this.data_maps[url].resource
        this.map_entities(k)
      }
    }
    this.hooks.data_load && this.hooks.data_load()
  },
  load_id_maps: async function () {
    for (var si = this.settings.metadata.datasets.length, ids, i, f, k, has_map; si--; ) {
      k = this.settings.metadata.datasets[si]
      if (Object.hasOwn(this.sets, k)) {
        for (ids = this.info[k].ids, i = ids.length, has_map = false; i--; )
          if (Object.hasOwn(ids[i], 'map')) {
            has_map = true
            if (Object.hasOwn(this.data_maps, ids[i].map)) {
              if (this.data_maps[ids[i].map].retrieved) {
                this.info[k].schema.fields[i].ids = this.data_maps[k] = Object.hasOwn(
                  this.data_maps[ids[i].map].resource,
                  k
                )
                  ? this.data_maps[ids[i].map].resource[k]
                  : this.data_maps[ids[i].map].resource
                this.map_entities(k)
              } else {
                if (-1 === this.data_maps[ids[i].map].queue.indexOf(k)) this.data_maps[ids[i].map].queue.push(k)
              }
            } else if ('string' !== typeof ids[i].map || ids[i].map_content) {
              if (ids[i].map_content) {
                this.data_maps[ids[i].map] = {queue: [], resource: JSON.parse(ids[i].map_content), retrieved: true}
                this.info[k].schema.fields[i].ids = this.data_maps[k] = Object.hasOwn(
                  this.data_maps[ids[i].map].resource,
                  k
                )
                  ? this.data_maps[ids[i].map].resource[k]
                  : this.data_maps[ids[i].map].resource
              } else {
                this.data_maps[k] = ids[i].map
              }
              this.map_entities(k)
            } else {
              this.data_maps[ids[i].map] = {queue: [k], resource: {}, retrieved: false}
              if ('undefined' !== typeof window) {
                f = new window.XMLHttpRequest()
                f.onreadystatechange = function (url, fi) {
                  if (4 === f.readyState) {
                    if (200 === f.status) {
                      this.ingest_map(JSON.parse(f.responseText), url, fi)
                    } else {
                      throw new Error('load_id_maps failed: ' + f.responseText)
                    }
                  }
                }.bind(this, ids[i].map, i)
                f.open('GET', ids[i].map, true)
                f.send()
              } else {
                const fi = i
                require('https')
                  .get(ids[fi].map, r => {
                    const c = []
                    r.on('data', d => {
                      c.push(d)
                    })
                    r.on('end', () => {
                      this.ingest_map(JSON.parse(c.join('')), r.req.protocol + '//' + r.req.host + r.req.path, fi)
                    })
                  })
                  .end()
              }
            }
          }
        if (!has_map) {
          this.data_maps[k] = {}
          this.map_entities(k)
        }
      }
    }
  },
  init_summaries: async function (view) {
    view = view || this.defaults.dataview
    var m, o, v, vi, d, y, i, l, k, da, ev, ny, n, at, c
    for (v in this.variables)
      if (Object.hasOwn(this.variables, v)) {
        vi = this.variables[v]
        c = vi.code
        if (!Object.hasOwn(vi, view)) vi[view] = {order: {}, selected_order: {}, selected_summaries: {}, summaries: {}}
        m = vi[view]
        for (d in vi.info) {
          if (Object.hasOwn(this.sets, d)) {
            if (!Object.hasOwn(vi.time_range, d)) {
              vi.time_range[d] = [0, this.meta.times[d].n - 1]
            }
            vi.time_range[d][2] = ny = vi.time_range[d][1] - vi.time_range[d][0] + 1
            if (Object.hasOwn(this.sets, d) && !Object.hasOwn(vi.info[d], 'order')) {
              vi.info[d].order = o = []
              for (y = ny; y--; ) {
                o.push([])
              }
              da = this.sets[d]
              n = this.info[d].entity_count
              at = !n || n > 65535 ? Uint32Array : n > 255 ? Uint16Array : Uint8Array
              for (k in da)
                if ('_meta' !== k && Object.hasOwn(da, k) && Object.hasOwn(da[k], c)) {
                  ev = da[k][c]
                  if (1 === ny) {
                    if ('number' !== typeof ev) da[k][c] = ev = NaN
                    o[0].push([k, ev])
                  } else {
                    for (y = ny; y--; ) {
                      if ('number' !== typeof ev[y]) ev[y] = NaN
                      o[y].push([k, ev[y]])
                    }
                    Object.freeze(ev)
                  }
                  if (!Object.hasOwn(this.entities, k)) {
                    this.entities[k] = {rank: {}, subset_rank: {}}
                  }
                  this.entities[k].rank[v] = new at(ny)
                  this.entities[k].subset_rank[v] = new at(ny)
                }
              for (y = ny; y--; ) {
                ev = o[y]
                ev.sort(this.checks.sort_a1)
                Object.freeze(ev)
                for (i = ev.length; i--; ) {
                  this.entities[ev[i][0]].rank[v][y] = i
                }
              }
              Object.freeze(o)
            }
            if (!Object.hasOwn(m.summaries, d)) {
              m.order[d] = []
              m.selected_order[d] = []
              m.selected_summaries[d] = {n: [], missing: []}
              if ('string' === vi.info[d].type) {
                m.table = {}
                for (l in vi.levels_ids)
                  if (Object.hasOwn(vi.levels_ids, l)) {
                    m.table[l] = []
                    for (y = ny; y--; ) m.table[l].push(0)
                  }
                m.summaries[d] = {
                  filled: false,
                  missing: [],
                  n: [],
                  mode: [],
                  level_ids: vi.levels_ids,
                  levels: vi.levels,
                }
                for (y = ny; y--; ) {
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
                for (y = ny; y--; ) {
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
          }
        }
      }
  },
  calculate_summary: async function (measure, view, full) {
    if (!Object.hasOwn(this.variables[measure], view))
      this.variables[measure][view] = JSON.parse(JSON.stringify(this.variables[measure][this.defaults.dataview]))
    const v = this.settings.dataviews[view],
      s = v.selection[this.settings.settings.summary_selection],
      a = v.selection.all,
      dataset = v.get.dataset(),
      m = this.variables[measure][view],
      mo = m.order[dataset],
      mso = m.selected_order[dataset],
      mss = m.selected_summaries[dataset],
      ms = m.summaries[dataset],
      ny = this.variables[measure].time_range[dataset][2],
      order = this.variables[measure].info[dataset].order,
      levels = this.variables[measure].levels_ids,
      subset = v.n_selected.all !== v.n_selected.dataset
    for (var i, k, value, en, l, o, y = ny, rank, bmd, bme, n; y--; ) {
      mo[y] = subset ? [] : order[y]
      mso[y] = subset ? [] : order[y]
      mss.missing[y] = 0
      mss.n[y] = 0
      ms.missing[y] = 0
      ms.n[y] = 0
      if (levels) {
        ms.mode[y] = ''
        for (k in levels) if (Object.hasOwn(levels, k)) m.table[k][y] = 0
      } else {
        ms.sum[y] = 0
        ms.mean[y] = 0
        ms.max[y] = -Infinity
        ms.min[y] = Infinity
        ms.break_mean[y] = -1
        ms.break_median[y] = -1
      }
    }
    for (y = 0; y < ny; y++) {
      o = order[y]
      for (i = o.length, rank = v.n_selected[this.settings.settings.summary_selection]; i--; ) {
        k = o[i][0]
        value = o[i][1]
        if (Object.hasOwn(s, k)) {
          en = s[k]
          if (!y) {
            if (!Object.hasOwn(en.summary, measure)) en.summary[measure] = {n: 0, overall: ms, order: mo}
            en.summary[measure].n = 0
          }
          en.subset_rank[measure][y] = --rank
          if (full && subset) {
            mo[y].splice(0, 0, o[i])
            if (Object.hasOwn(a, k)) {
              mso[y].splice(0, 0, o[i])
              if (levels ? Object.hasOwn(levels, value) : !isNaN(value)) {
                mss.n[y]++
              } else mss.missing[y]++
            }
          }
          if (levels ? Object.hasOwn(levels, value) : !isNaN(value)) {
            en.summary[measure].n++
            ms.n[y]++
            if (levels) {
              m.table[value][y]++
            } else {
              ms.sum[y] += value
              if (value > ms.max[y]) ms.max[y] = value
              if (value < ms.min[y]) ms.min[y] = value
            }
          } else ms.missing[y]++
        }
      }
    }
    if (full) {
      for (y = 0; y < ny; y++) {
        o = mo[y]
        if (levels) {
          if (ms.n[y]) {
            l = 0
            for (k in m.table)
              if (Object.hasOwn(m.table, k)) {
                if (m.table[k][y] > m.table[this.variables[measure].levels[l]][y]) l = levels[k]
              }
            ms.mode[y] = this.variables[measure].levels[l]
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
            for (i = ms.missing[y], n = o.length, bmd = false, bme = false; i < n; i++) {
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
            ms.norm_median[y] = ms.range[y] ? (ms.median[y] - ms.min[y]) / ms.range[y] : ms.median[y]
            if (-1 !== ms.break_median[y]) {
              ms.lower_median_min[y] = ms.norm_median[y] - (o[ms.missing[y]][1] - ms.min[y]) / ms.range[y]
              ms.lower_median_range[y] =
                ms.norm_median[y] - ((o[ms.break_median[y]][1] - ms.min[y]) / ms.range[y] - ms.lower_median_min[y])
              ms.upper_median_min[y] = ms.norm_median[y] - (o[ms.break_median[y]][1] - ms.min[y]) / ms.range[y]
              ms.upper_median_range[y] =
                (o[o.length - 1][1] - ms.min[y]) / ms.range[y] - ms.norm_median[y] - ms.upper_median_min[y]
            }
            ms.norm_mean[y] = ms.range[y] ? (ms.mean[y] - ms.min[y]) / ms.range[y] : ms.mean[y]
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
      }
    } else {
      for (y = 0; y < ny; y++) {
        if (ms.n[y]) {
          if (levels) {
            q1 = 0
            for (k in m.table)
              if (Object.hasOwn(m.table, k)) {
                if (m.table[k][y] > m.table[this.variables[measure].levels[q1]][y]) q1 = levels[k]
              }
            ms.mode[y] = this.variables[measure].levels[q1]
          } else ms.mean[y] = ms.sum[y] / ms.n[y]
        } else {
          ms[levels ? 'mode' : 'mean'][y] = NaN
        }
      }
    }
    ms.filled = true
  },
  map_variables: function () {
    var k, v, vn, i, t, m, l
    for (k in this.info)
      if (Object.hasOwn(this.info, k)) {
        this.data_queue[k] = {}
        m = this.info[k]
        m.id_vars = []
        for (v = m.schema.fields, i = m.ids.length; i--; ) m.id_vars.push(m.ids[i].variable)
        for (i = v.length; i--; ) {
          vn = v[i].name
          if (Object.hasOwn(this.variables, vn)) {
            this.variables[vn].datasets.push(k)
            this.variables[vn].info[k] = v[i]
            if ('string' === v[i].type) {
              for (l in v[i].table)
                if (Object.hasOwn(v[i].table, l) && !Object.hasOwn(this.variables[vn].levels_ids, l)) {
                  this.variables[vn].levels_ids[l] = this.variables[vn].levels.length
                  this.variables[vn].levels.push(l)
                }
            }
          } else {
            this.variables[vn] = {
              datasets: [k],
              info: {},
              time_range: {},
              type: v[i].type,
            }
            this.variables[vn].info[k] = v[i]
            if ('string' === v[i].type) {
              this.variables[vn].levels = []
              this.variables[vn].levels_ids = {}
              for (l in v[i].table)
                if (Object.hasOwn(v[i].table, l)) {
                  this.variables[vn].levels_ids[l] = this.variables[vn].levels.length
                  this.variables[vn].levels.push(l)
                }
            }
            this.variables[vn].meta = this.variables[vn].info[k].info
            if (!this.variables[vn].meta)
              this.variables[vn].meta = {
                full_name: vn,
                measure: vn.split(':')[1],
                short_name: this.format_label(vn),
                type: 'integer',
              }
            this.variables[vn].meta.full_name = vn
            if (!Object.hasOwn(this.variables[vn].meta, 'measure'))
              this.variables[vn].meta.measure = vn.split(':')[1] || vn
            if (!Object.hasOwn(this.variables[vn].meta, 'short_name'))
              this.variables[vn].meta.short_name = this.format_label(vn)
            if (!Object.hasOwn(this.variables[vn].meta, 'long_name'))
              this.variables[vn].meta.long_name = this.variables[vn].meta.short_name
            if (!Object.hasOwn(this.variable_info, vn)) this.variable_info[vn] = this.variables[vn].meta
          }
        }
        if (this.in_browser && Object.hasOwn(m, '_references')) {
          if (!Object.hasOwn(this.variable_info, '_references')) this.variable_info._references = {}
          for (t in m._references)
            if (Object.hasOwn(m._references, t))
              this.variable_info._references[t] = {
                reference: m._references[t],
                element: make_variable_reference(m._references[t]),
              }
        }
      }
  },
  map_entities: async function (g) {
    var id,
      f,
      k,
      overwrite = false
    if (Object.hasOwn(this.sets, g) && !this.inited[g]) {
      for (id in this.sets[g]) {
        if ('_meta' !== id && Object.hasOwn(this.sets[g], id)) {
          overwrite = this.data_maps[g][id]
          f = overwrite || {id: id, name: id}
          f.id = id
          if (Object.hasOwn(this.entities, id)) {
            this.entities[id].group = g
            this.entities[id].data = this.sets[g][id]
            this.entities[id].variables = this.variables
            if (!Object.hasOwn(this.entities[id], 'features')) this.entities[id].features = {}
            for (k in f)
              if (Object.hasOwn(f, k)) {
                if (
                  'id' === k ||
                  (Object.hasOwn(f, k) && (overwrite || !Object.hasOwn(this.entities[id].features, k)))
                ) {
                  this.entities[id].features[k] = f[k]
                }
              }
            this.entities[id].summary = {}
            if (!Object.hasOwn(this.entities[id], 'rank')) {
              this.entities[id].rank = {}
              this.entities[id].subset_rank = {}
            }
          } else {
            this.entities[id] = {
              group: g,
              data: this.sets[g][id],
              variables: this.variables,
              features: f,
              summary: {},
              rank: {},
              subset_rank: {},
            }
          }
          for (k in f)
            if (Object.hasOwn(f, k) && !Object.hasOwn(this.features, k)) this.features[k] = this.format_label(k)
          this.entities[id].time = this.meta.times[g]
          this.entities[id].get_value = this.retrievers[this.meta.times[g].is_single ? 'single' : 'multi'].bind(
            this.entities[id]
          )
          if (f && Object.hasOwn(f, 'district') && id.length > 4) {
            f.county = id.substring(0, 5)
          }
        }
      }
      this.inited[g] = true
      this.init_summaries().then(() => {
        if (!this.inited.first) {
          this.hooks.init && this.hooks.init()
          this.inited.first = true
        }
        for (id in this.data_queue[g])
          if (Object.hasOwn(this.data_queue[g], id)) {
            this.data_queue[g][id]()
            delete this.data_queue[g][id]
          }
        this.hooks.onload && this.hooks.onload()
      })
    }
    for (k in this.info) if (Object.hasOwn(this.info, k) && !this.inited[k]) return void 0
    this.all_data_ready()
  },
  parse_query: function (q) {
    const f = JSON.parse(JSON.stringify(export_defaults))
    var k, a, i, aq, tf
    if ('string' === typeof q) {
      if ('?' === q[0]) q = q.substring(1)
      aq = q.split('&')
      q = {}
      for (i = aq.length; i--; ) {
        a = aq[i].split('=')
        q[a[0]] = a.length > 1 ? a[1] : ''
      }
    }
    for (k in q)
      if (Object.hasOwn(q, k)) {
        if ('include' === k || 'exclude' === k || Object.hasOwn(f, k)) {
          f[k] = q[k]
        } else {
          a = []
          if (patterns.single_operator.test(k)) {
            a = k.replace(patterns.single_operator, '$1=$2').split('=')
            if (a.length > 1) {
              k = a[0]
              q[k] = a[1]
            }
          }
          aq = patterns.component.exec(k)
          tf = {name: k, component: 'mean', operator: '=', value: patterns.number.test(q[k]) ? Number(q[k]) : q[k]}
          if ('object' === typeof q[k]) {
            if (Object.hasOwn(q[k], 'component')) tf.component = q[k].component
            if (Object.hasOwn(q[k], 'operator')) tf.operator = q[k].operator
            if (Object.hasOwn(q[k], 'value')) tf.value = q[k].value
          }
          if (aq && -1 !== export_options.filter_components.indexOf(aq[2])) {
            tf.component = aq[2]
            tf.name = aq[1]
          }
          if (patterns.operator_start.test(k) && Object.hasOwn(this.checks, k[k.length - 1])) {
            tf.operator = k[k.length - 1]
            if (('<' === tf.operator || '>' === tf.operator) && !a.length) tf.operator += '='
            if (k === tf.name) tf.name = k.substring(0, k.length - 1)
          }
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
              i = this.meta.overall.value.indexOf(Number(tf.value))
              f.time_range =
                '=' === tf.operator ? [i, i] : '>' === tf.operator ? [i, this.meta.overall.value.length - 1] : [0, i]
            }
            if (-1 === f.time_range[0]) f.time_range[0] = 0
            if (-1 === f.time_range[1])
              f.time_range[1] = this.meta.overall.value.length ? this.meta.overall.value.length - 1 : 0
          } else if ('dataset' === tf.name) {
            f.dataset = tf
          } else if (Object.hasOwn(this.features, tf.name)) {
            tf.check = group_checks[tf.operator].bind(tf.value)
            f.feature_conditions.push(tf)
          } else if (Object.hasOwn(this.variables, tf.name)) {
            tf.check = function (s) {
              return this.check(s[this.condition.component], this.condition.value)
            }.bind({check: this.checks[tf.operator], condition: tf})
            tf.name = this.variables[tf.name].code
            if (-1 === f.variables.filter_by.indexOf(tf.name)) f.variables.filter_by.push(tf.name)
            f.variables.conditions.push(tf)
          }
        }
      }
    if (!Object.hasOwn(f, 'time_range'))
      f.time_range = [0, this.meta.overall.value.length ? this.meta.overall.value.length - 1 : 0]
    return f
  },
  export: async function (query, entities, in_browser) {
    await this.data_ready
    query = this.parse_query(query)
    entities = entities || this.entities
    if (-1 === export_options.file_format.indexOf(query.file_format)) query.file_format = export_defaults.file_format
    if (!Object.hasOwn(row_writers, query.table_format)) query.table_format = export_defaults.table_format
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
      in_group = !Object.hasOwn(query, 'dataset')
        ? void 0
        : group_checks[query.dataset.operator].bind(query.dataset.value)
    for (var n = inc.length, i = 0, k, r, tr, yn, y; i < n; i++)
      if (Object.hasOwn(this.features, inc[i]) && !Object.hasOwn(feats, inc[i])) {
        feats[inc[i]] = this.format_label(inc[i])
      }
    for (k in this.export_checks)
      if (Object.hasOwn(query, k)) {
        r = this.export_checks[k]('include' === k ? inc : query[k], this.variables)
        if (r) {
          res.body = 'Failed check for ' + k + ': ' + r
          return res
        }
      }
    for (k in this.variable_codes)
      if (
        Object.hasOwn(this.variable_codes, k) &&
        -1 !== inc.indexOf(this.variable_codes[k].name) &&
        -1 === exc.indexOf(this.variable_codes[k].name)
      ) {
        vars.push(this.variable_codes[k].name)
        tr = this.meta.ranges[this.variable_codes[k].name]
        if (tr[0] < range[0]) range[0] = tr[0]
        if (tr[1] > range[1]) range[1] = tr[1]
      }
    if (query.time_range[0] < range[0]) query.time_range[0] = range[0]
    if (query.time_range[1] > range[1]) query.time_range[1] = range[1]
    rows.push(Object.keys(feats).join(sep))
    if ('wide' === query.table_format) {
      for (n = vars.length, i = 0; i < n; i++) {
        for (
          tr = this.meta.ranges[vars[i]],
            yn = Math.min(query.time_range[1], tr[1]) + 1,
            y = Math.max(query.time_range[0], tr[0]);
          y < yn;
          y++
        ) {
          rows[0] += sep + vars[i] + '_' + this.meta.overall.value[y]
        }
      }
    } else rows[0] += sep + 'time' + sep + ('mixed' === query.table_format ? vars : ['variable', 'value']).join(sep)
    for (k in entities)
      if (
        Object.hasOwn(entities, k) &&
        (!in_group || in_group(entities[k].group)) &&
        (no_feature_filter || passes_feature_filter(entities[k], query.feature_conditions)) &&
        (no_filter || passes_filter(entities[k], query.time_range, query.variables, this.variable_codes))
      ) {
        r = rw(entities[k], query.time_range, feats, vars, sep)
        if (r) rows.push(r)
      }
    res.headers['Content-Type'] = 'text/' + (',' === sep ? 'csv' : 'plain') + '; charset=utf-8'
    res.body = rows.join('\n')
    if (in_browser) {
      const e = document.createElement('a')
      document.body.appendChild(e)
      e.rel = 'noreferrer'
      e.target = '_blank'
      e.download = 'data_export.' + query.file_format
      e.href = URL.createObjectURL(new Blob([res.body], {type: res.headers['Content-Type']}))
      setTimeout(function () {
        e.dispatchEvent(new MouseEvent('click'))
        URL.revokeObjectURL.bind(null, e.href)
        document.body.removeChild(e)
      }, 0)
    } else {
      res.statusCode = 200
      res.headers['Content-Disposition'] = 'attachment; filename=data_export.' + query.file_format
      return res
    }
  },
}

if ('undefined' !== typeof module) module.exports = DataHandler
