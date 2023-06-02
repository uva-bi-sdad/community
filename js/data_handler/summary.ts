import DataHandler from '.'
import type {Order, Data, Variable, VariableView, EntityData, Summary, MeasureInfo} from '../types'

function sort_a1(a: [string, number], b: [string, number]): number {
  return isNaN(a[1]) ? (isNaN(b[1]) ? 0 : -1) : isNaN(b[1]) ? 1 : a[1] - b[1]
}

function summary_template(): Summary {
  return {
    type: 'number',
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
    mode: [],
    level_ids: {},
    levels: [],
  }
}

export function init(this: DataHandler, v: string, d: string) {
  if (!this.inited_summary[d + v]) {
    ;(this.in_browser ? Object.keys(this.settings.dataviews) : ['default_view']).forEach((view: string) => {
      const vi: Variable = this.variables[v]
      if (!(view in vi.views))
        vi.views[view] = {
          order: {},
          selected_order: {},
          selected_summaries: {},
          summaries: {},
          state: {},
          table: {},
        }
      if (!(d in vi.time_range)) {
        vi.time_range[d] = [0, this.meta.times[d].n - 1]
      }
      const ny = (vi.time_range[d][2] = vi.time_range[d][1] - vi.time_range[d][0] + 1)
      const m: VariableView = vi.views[view],
        c = vi.code
      if (d in this.sets) {
        const da: Data = this.sets[d]
        const n: number = this.info[d].entity_count
        const at = !n || n > 65535 ? Uint32Array : n > 255 ? Uint16Array : Uint8Array
        const info = vi.info[d]
        const is_string = 'string' === info.type
        let o = info.order
        if (o) {
          Object.keys(da).forEach((k: string) => {
            if (!(k in this.entities)) return
            if (!(view in this.entities[k])) this.entities[k].views[view] = {summary: {}, rank: {}, subset_rank: {}}
            this.entities[k].views[view].rank[v] = new at(ny)
            this.entities[k].views[view].subset_rank[v] = new at(ny)
          })
        } else {
          info.order = o = []
          for (let y = ny; y--; ) {
            o.push([])
          }
          Object.keys(da).forEach((k: string) => {
            const dak = da[k] as EntityData
            if ('_meta' !== k && c in dak) {
              const ev: number | number[] = dak[c]
              if (Array.isArray(ev)) {
                for (let y = ny; y--; ) {
                  if (is_string && ev[y] in vi.level_ids) {
                    ev[y] = vi.level_ids[ev[y]]
                  } else if ('number' !== typeof ev[y]) ev[y] = NaN
                  o[y].push([k, ev[y]])
                }
                Object.freeze(ev)
              } else {
                if (is_string && ev in vi.level_ids) {
                  o[0].push([k, vi.level_ids[ev]])
                } else if ('number' !== typeof ev) {
                  dak[c] = NaN
                  o[0].push([k, NaN])
                } else o[0].push([k, ev])
              }
              if (!(k in this.entities)) return
              if (!(view in this.entities[k].views))
                this.entities[k].views[view] = {summary: {}, rank: {}, subset_rank: {}}
              const eview = this.entities[k].views[view]
              if (!(v in eview.rank)) {
                eview.rank[v] = new at(ny)
                eview.subset_rank[v] = new at(ny)
              }
            }
          })
        }
        o.forEach((ev: Order, y: number) => {
          if (!Object.isFrozen(ev)) {
            ev.sort(sort_a1)
            Object.freeze(ev)
          }
          ev.forEach((r, i) => {
            this.entities[r[0]].views[view].rank[v][y] = i
          })
        })
      }
      if (!(d in m.summaries)) {
        m.order[d] = []
        m.selected_order[d] = []
        m.selected_summaries[d] = summary_template()
        const s = summary_template()
        if ('string' === vi.info[d as keyof MeasureInfo].type) {
          s.type = 'string'
          s.level_ids = vi.level_ids
          s.levels = vi.levels
          m.table = {}
          vi.levels.forEach((l: string) => {
            m.table[l] = []
            for (let y = ny; y--; ) m.table[l].push(0)
          })
          for (let y = ny; y--; ) {
            m.order[d].push([])
            m.selected_order[d].push([])
            s.missing.push(0)
            s.n.push(0)
            s.mode.push('')
          }
          m.summaries[d] = s
        } else {
          for (let y = ny; y--; ) {
            m.order[d].push([])
            m.selected_order[d].push([])
            m.selected_summaries[d].n.push(0)
            m.selected_summaries[d].missing.push(0)
            s.missing.push(0)
            s.n.push(0)
            s.sum.push(0)
            s.max.push(-Infinity)
            s.q3.push(0)
            s.mean.push(0)
            s.norm_median.push(0)
            s.break_median.push(-1)
            s.lower_median_min.push(-1)
            s.lower_median_range.push(-1)
            s.upper_median_min.push(-1)
            s.upper_median_range.push(-1)
            s.norm_mean.push(0)
            s.break_mean.push(-1)
            s.lower_mean_min.push(-1)
            s.lower_mean_range.push(-1)
            s.upper_mean_min.push(-1)
            s.upper_mean_range.push(-1)
            s.median.push(0)
            s.q1.push(0)
            s.min.push(Infinity)
          }
          m.summaries[d] = s
        }
        Object.seal(m.order[d])
        Object.seal(m.selected_order[d])
        Object.seal(m.selected_summaries[d])
        Object.seal(m.summaries[d])
      }
    })
  }
}

function quantile(p: number, n: number, o: number, x: Order): number {
  const a = p * (n - 1),
    ap = a % 1,
    bp = 1 - ap,
    b = o + Math.ceil(a),
    i = o + Math.floor(a)
  return x[i][1] * ap + x[b][1] * bp
}

export async function calculate(this: DataHandler, measure: string, view: string, full: boolean): Promise<void> {
  const v = this.settings.dataviews[view]
  const dataset: string = v.get.dataset()
  await this.data_processed[dataset]
  const summaryId = dataset + measure
  if (!this.inited_summary[summaryId]) this.init_summary(measure, dataset)
  this.inited_summary[summaryId] = new Promise(resolve => {
    this.summary_ready[summaryId] = resolve
  })
  const variable = this.variables[measure],
    m = variable.views[view]
  if (m.state[dataset] !== v.state) {
    const s = v.selection[this.settings.settings.summary_selection],
      a = v.selection.all,
      mo = m.order[dataset],
      mso = m.selected_order[dataset],
      ny = variable.time_range[dataset][2],
      order = variable.info[dataset].order,
      levels = variable.levels,
      level_ids = variable.level_ids,
      subset = v.n_selected[this.settings.settings.summary_selection] !== v.n_selected.dataset,
      mss = m.selected_summaries[dataset],
      ms = m.summaries[dataset],
      is_string = 'string' === variable.type
    for (let y = ny; y--; ) {
      mo[y] = subset ? [] : order[y]
      mso[y] = subset ? [] : order[y]
      mss.missing[y] = 0
      mss.n[y] = 0
      ms.missing[y] = 0
      ms.n[y] = 0
      if (is_string) {
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
      let rank = 0
      o.forEach(oi => {
        const k = oi[0],
          value = oi[1]
        if (k in s) {
          const en = s[k].views[view],
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
            if (is_string) {
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
        if (is_string) {
          if (ms.n[y]) {
            let l = 0
            Object.keys(m.table).forEach(k => {
              if (m.table[k][y] > m.table[levels[l]][y]) l = level_ids[k]
            })
            ms.mode[y] = levels[l]
          } else ms.mode[y] = ''
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
              const v = o[i][1]
              if ('number' === typeof v) {
                if (!bmd && v > ms.median[y]) {
                  ms.break_median[y] = i - 1
                  bmd = true
                }
                if (!bme && v > ms.mean[y]) {
                  ms.break_mean[y] = i - 1
                  bme = true
                }
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
          if (is_string) {
            let q1 = 0
            Object.keys(m.table).forEach(k => {
              if (m.table[k][y] > m.table[levels[q1]][y]) q1 = level_ids[k]
            })
            ms.mode[y] = levels[q1]
          } else ms.mean[y] = ms.sum[y] / ms.n[y]
        } else {
          ms[is_string ? 'mode' : 'mean'][y] = NaN
        }
      }
    }
    ms.filled = true
    m.state[dataset] = v.state
    this.summary_ready[summaryId]()
  } else await this.summary_ready[summaryId]
}
