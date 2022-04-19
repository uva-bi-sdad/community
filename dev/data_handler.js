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
  this.defaults = defaults
  this.settings = settings
  this.info = settings && settings.metadata.info
  this.variables = {}
  this.variable_codes = {}
  this.variable_info = {}
  this.entities = {}
  this.meta = {
    times: {},
    variables: {},
  }
  this.loaded = {}
  this.inited = {}
  this.sets = {}
  this.data_maps = {}
  this.data_queue = {}
  data = data || {}
  if ('string' === typeof settings.metadata.datasets) settings.metadata.datasets = [settings.metadata.datasets]
  for (var k, i = settings.metadata.datasets.length; i--; ) {
    k = settings.metadata.datasets[i]
    this.loaded[k] = Object.hasOwn(data, k)
    if (this.loaded[k]) {
      this.sets[k] = data[k]
    } else {
      this.retrieve(k, settings.metadata.info[k].site_file)
    }
  }
  this.map_variables()
}

function quantile(p, n, o, x) {
  var a = p * (n - 1),
    ap = a % 1,
    bp = 1 - ap,
    b = o + Math.ceil(a)
  a = o + Math.floor(a)
  return x[a][1] * ap + x[b][1] * bp
}

function make_variable_reference(c) {
  for (
    var e = document.createElement('li'), s = '', i = c.author.length, j = 1 === i ? '' : 2 === i ? ' & ' : ', & ';
    i--;

  ) {
    s = (i ? j : '') + c.author[i].family + ', ' + c.author[i].given.substring(0, 1) + '.' + s
    j = ', '
  }
  e.innerHTML =
    s +
    ' (' +
    c.year +
    '). ' +
    c.title +
    '. <em>' +
    c.journal +
    (c.volume ? ', ' + c.volume : '') +
    '</em>' +
    (c.page ? ', ' + c.page : '') +
    '.' +
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

const patterns = {
  seps: /[\s._-]/g,
  word_start: /\b(\w)/g,
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
    sort_a1: function (a, b) {
      return isNaN(a[1]) ? (isNaN(b[1]) ? 0 : -1) : isNaN(b[1]) ? 1 : a[1] - b[1]
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
  retrieve: async function (name, url) {
    const f = new window.XMLHttpRequest()
    f.onreadystatechange = () => {
      if (4 === f.readyState) {
        if (200 === f.status) {
          const d = JSON.parse(f.responseText)
          this.sets[name] = d
          this.loaded[name] = true
          if (Object.hasOwn(d, '_meta')) {
            if (Object.hasOwn(this.variables, d._meta.time.name)) {
              this.meta.times[name] = d._meta.time
              this.meta.times[name].info = this.variables[this.meta.times[name].name]
              this.meta.times[name].info.is_time = true
              if ('object' !== typeof this.meta.times[name].value)
                this.meta.times[name].value = [this.meta.times[name].value]
              this.meta.times[name].n = this.meta.times[name].value.length
              this.meta.times[name].is_single = 1 === this.meta.times[name].n
              this.meta.times[name].range = [
                this.meta.times[name].value[0],
                this.meta.times[name].value[this.meta.times[name].n - 1],
              ]
            } else {
              this.meta.times[name] = {value: [0], n: 1, range: [0, 0], name: this.defaults.time, is_single: true}
            }
            this.meta.variables[name] = d._meta.variables || {}
            for (var k in this.meta.variables[name])
              if (Object.hasOwn(this.variables, k)) {
                this.variables[k].name = k
                this.variables[k].code = this.meta.variables[name][k].code
                this.variables[k].time_range[name] = this.meta.variables[name][k].time_range
                this.variable_codes[this.variables[k].code] = this.variables[k]
              }
            delete d._meta
          }
          if (this.settings.settings.partial_init) {
            this.load_id_maps()
          } else {
            for (var k in this.loaded) if (Object.hasOwn(this.loaded, k) && !this.loaded[k]) return void 0
            this.load_id_maps()
          }
        } else {
          throw new Error('load_data failed: ' + f.responseText)
        }
      }
    }
    f.open('GET', url, true)
    f.send()
  },
  load_id_maps: async function () {
    var ids, i, f, k, has_map
    for (k in this.info)
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
              f = new window.XMLHttpRequest()
              f.onreadystatechange = function (url, fi) {
                if (4 === f.readyState) {
                  if (200 === f.status) {
                    this.data_maps[url].resource = JSON.parse(f.responseText)
                    this.data_maps[url].retrieved = true
                    for (var k, i = this.data_maps[url].queue.length; i--; ) {
                      k = this.data_maps[url].queue[i]
                      if (Object.hasOwn(this.info, k) && this.info[k].schema.fields.length > fi) {
                        this.info[k].schema.fields[fi].ids = this.data_maps[k] = Object.hasOwn(
                          this.data_maps[url].resource,
                          k
                        )
                          ? this.data_maps[url].resource[k]
                          : this.data_maps[url].resource
                        this.map_entities(k)
                      }
                    }
                    // for (k in _c)
                    //   if (Object.hasOwn(_c, k)) {
                    //     request_queue(k)
                    //   }
                    this.hooks.data_load && this.hooks.data_load()
                  } else {
                    throw new Error('load_id_maps failed: ' + f.responseText)
                  }
                }
              }.bind(this, ids[i].map, i)
              f.open('GET', ids[i].map, true)
              f.send()
            }
          }
        if (!has_map) {
          this.data_maps[k] = {}
          this.map_entities(k)
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
              if (levels ? Object.hasOwn(levels, value) : 'number' === typeof value) {
                mss.n[y]++
              } else mss.missing[y]++
            }
          }
          if (levels ? Object.hasOwn(levels, value) : 'number' === typeof value) {
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
  map_variables: async function () {
    var k, v, i, t, m, l
    for (k in this.info)
      if (Object.hasOwn(this.info, k)) {
        this.data_queue[k] = {}
        m = this.info[k]
        m.id_vars = []
        for (v = m.schema.fields, i = m.ids.length; i--; ) m.id_vars.push(m.ids[i].variable)
        for (i = v.length; i--; ) {
          if (Object.hasOwn(this.variables, v[i].name)) {
            this.variables[v[i].name].datasets.push(k)
            this.variables[v[i].name].info[k] = v[i]
            if ('string' === v[i].type) {
              for (l in v[i].table)
                if (Object.hasOwn(v[i].table, l) && !Object.hasOwn(this.variables[v[i].name].levels_ids, l)) {
                  this.variables[v[i].name].levels_ids[l] = this.variables[v[i].name].levels.length
                  this.variables[v[i].name].levels.push(l)
                }
            }
          } else {
            this.variables[v[i].name] = {datasets: [k], info: {}, time_range: {}}
            this.variables[v[i].name].info[k] = v[i]
            this.variables[v[i].name].type = v[i].type
            if ('string' === v[i].type) {
              this.variables[v[i].name].levels = []
              this.variables[v[i].name].levels_ids = {}
              for (l in v[i].table)
                if (Object.hasOwn(v[i].table, l)) {
                  this.variables[v[i].name].levels_ids[l] = this.variables[v[i].name].levels.length
                  this.variables[v[i].name].levels.push(l)
                }
            }
            this.variables[v[i].name].meta = this.variables[v[i].name].info[k].info
            if (!this.variables[v[i].name].meta)
              this.variables[v[i].name].meta = {
                full_name: v[i].name,
                measure: v[i].name.split(':')[1],
                short_name: this.format_label(v[i].name),
                type: 'integer',
              }
            this.variables[v[i].name].meta.full_name = v[i].name
            if (!Object.hasOwn(this.variables[v[i].name].meta, 'measure'))
              this.variables[v[i].name].meta.measure = v[i].name.split(':')[1] || v[i].name
            if (!Object.hasOwn(this.variables[v[i].name].meta, 'short_name'))
              this.variables[v[i].name].meta.short_name = this.format_label(v[i].name)
            if (!Object.hasOwn(this.variables[v[i].name].meta, 'long_name'))
              this.variables[v[i].name].meta.long_name = this.variables[v[i].name].meta.short_name
            if (!Object.hasOwn(this.variable_info, v[i].name))
              this.variable_info[v[i].name] = this.variables[v[i].name].meta
          }
        }
        if (Object.hasOwn(m, '_references')) {
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
        if (Object.hasOwn(this.sets[g], id)) {
          overwrite = this.data_maps[g][id]
          f = overwrite || {id: id, name: id}
          f.id = id
          if (Object.hasOwn(this.entities, id)) {
            this.entities[id].group = g
            this.entities[id].data = this.sets[g][id]
            this.entities[id].variables = this.variables
            if (!Object.hasOwn(this.entities[id], 'features')) this.entities[id].features = {}
            for (k in f)
              if ('id' === k || (Object.hasOwn(f, k) && (overwrite || !Object.hasOwn(this.entities[id].features, k))))
                this.entities[id].features[k] = f[k]
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
  },
}

if ('undefined' !== typeof module) module.export = DataHandler
