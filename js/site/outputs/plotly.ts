import type {SiteInputs} from '../inputs/index'
import {BaseOutput} from './index'
import Community from '../index'
import {Entity, Summary} from '../../types'
import type {Layout, Config, Data, PlotData, PlotlyHTMLElement} from 'plotly.js'
import {SiteDataView} from '../dataview'

export type PlotlySpec = {
  [index: string]: Layout | Config | Data | string[] | string
  layout: Layout
  config: Config
  data: Data
  subto?: string[]
}

type PlotlyTrace = {
  x?: number[]
  y?: number[]
  line?: {color: string}
  median?: number[]
  q3?: number[]
  q1?: number[]
  upperfence: number[]
  lowerfence: number[]
}

export class OutputPlotly extends BaseOutput {
  type: 'plotly' = 'plotly'
  e: PlotlyHTMLElement
  dark_theme: boolean
  clickto?: SiteInputs
  previous_span = 1
  base_trace?: string
  traces: {[index: string]: string} = {}
  parsed: {
    x?: string
    y?: string
    dataset?: string
    color?: string
    palette?: string
    time?: number
    base_trace?: string
    summary?: Summary
    y_range?: number[]
    x_range?: number[]
    view?: SiteDataView
  } = {}
  style?: Layout
  time: string
  spec: PlotlySpec
  queue: number | NodeJS.Timeout = -1
  state: string = ''
  reference_options: {[index: string]: string} = {}
  constructor(e: HTMLElement, site: Community) {
    super(e, site)
    this.queue_init = this.queue_init.bind(this)
    this.mouseover = this.mouseover.bind(this)
    this.mouseout = this.mouseout.bind(this)
    this.click = this.click.bind(this)
    this.x = e.dataset.x
    this.y = e.dataset.y
    this.color = e.dataset.color
    this.time = e.dataset.colorTime
    Object.keys(this.spec).forEach(k => {
      const opt = this.spec[k]
      if ('string' === typeof opt && opt in site.inputs) this.reference_options[k] = opt
    })
    if (this.tab) {
      document.getElementById(e.parentElement.getAttribute('aria-labelledby')).addEventListener(
        'click',
        function (this: OutputPlotly) {
          if (!this.e.parentElement.classList.contains('active')) {
            setTimeout(this.update, 155)
            setTimeout(this.site.page.trigger_resize, 155)
          }
        }.bind(this)
      )
    }
  }
  init() {
    if (this.x && !(this.x in this.site.data.variables)) {
      this.site.add_dependency(this.x, {type: 'update', id: this.id})
    }
    if (this.y && !(this.y in this.site.data.variables)) {
      this.site.add_dependency(this.y, {type: 'update', id: this.id})
    }
    if (this.color && !(this.color in this.site.data.variables)) {
      this.site.add_dependency(this.color, {type: 'update', id: this.id})
    }
    if (this.time in this.site.inputs) {
      this.site.add_dependency(this.time, {type: 'update', id: this.id})
    }
    if (this.view) {
      this.site.add_dependency(this.view, {type: 'update', id: this.id})
      this.site.add_dependency(this.view + '_filter', {type: 'update', id: this.id})
      if (this.site.dataviews[this.view].time_agg in this.site.dataviews)
        this.site.add_dependency(this.site.dataviews[this.view].time_agg as string, {type: 'update', id: this.id})
    } else this.view = this.site.defaults.dataview
    this.spec.data.forEach((p: PlotData, i: number) => {
      Object.keys(p).forEach(k => {
        if (this.site.patterns.period.test(k)) {
          const es = k.split('.'),
            n = es.length - 1
          let pl: {[index: string]: string | {[index: string]: string}} = null
          es.forEach((e, ei) => {
            pl = pl ? (pl[e] = ei === n ? p[k] : {}) : (p[e] = {})
          })
        }
      })
      if (!('textfont' in p)) p.textfont = {}
      if (!('color' in p.textfont)) p.textfont.color = this.site.defaults.background_highlight
      if (!('line' in p)) p.line = {}
      if (!('color' in p.line)) p.line.color = this.site.defaults.background_highlight
      if (!('marker' in p)) p.marker = {}
      p.marker.size = 8
      if (!('color' in p.marker)) p.marker.color = this.site.defaults.background_highlight
      if (!('line' in p.marker)) p.marker.line = {}
      if (!('color' in p.marker.line)) p.marker.line.color = this.site.defaults.background_highlight
      if (!('text' in p)) p.text = []
      if (!('x' in p)) p.x = []
      if ('box' === p.type) {
        p.hoverinfo = 'none'
      } else if (!('y' in p)) p.y = []
      this.traces[p.type] = JSON.stringify(p)
      if (!i) {
        this.base_trace = p.type
        if (this.base_trace in this.site.inputs)
          this.site.add_dependency(this.base_trace, {type: 'update', id: this.id})
      }
    })
    const click_ref = this.e.dataset.click
    if (click_ref in this.site.inputs) this.clickto = this.site.inputs[click_ref]
    this.queue_init()
  }
  show(e: Entity) {
    this.revert()
    let trace = this.make_data_entry(
      e,
      0,
      0,
      'hover_line',
      this.site.defaults['border_highlight_' + this.site.spec.settings.theme_dark]
    )
    if (trace) {
      trace.line.width = 4
      trace.marker.size = 12
      Plotly.addTraces(this.e, trace, this.e.data.length)
    }
  }
  revert() {
    const data = this.e.data
    if (data.length && 'hover_line' === data[data.length - 1].name) Plotly.deleteTraces(this.e, data.length - 1)
  }
  queue_init() {
    const showing = this.deferred || !this.tab || this.tab.classList.contains('show')
    if (showing && window.Plotly) {
      Plotly.newPlot(this.e, this.spec.data, this.spec.layout, this.spec.config)
      this.e.on('plotly_hover', this.mouseover).on('plotly_unhover', this.mouseout).on('plotly_click', this.click)
      this.update_theme()
      this.update()
    } else {
      this.deferred = true
      setTimeout(this.queue_init, showing ? 0 : 2000)
    }
  }
  mouseover(d: PlotMouseEvent) {
    if (d.points && 1 === d.points.length && this.e.data[d.points[0].fullData.index]) {
      Plotly.restyle(this.e, {'line.width': 5}, d.points[0].fullData.index)
      this.site.subs.update(this.id, 'show', this.site.data.entities[d.points[0].data.id])
    }
  }
  mouseout(d: PlotMouseEvent) {
    if (d.points && 1 === d.points.length && this.e.data[d.points[0].fullData.index]) {
      Plotly.restyle(this.e, {'line.width': 2}, d.points[0].fullData.index)
      this.site.subs.update(this.id, 'revert', this.site.data.entities[d.points[0].data.id])
    }
  }
  click(d: PlotMouseEvent) {
    this.clickto && this.clickto.set(d.points[0].data.id)
  }
  async update(pass?: boolean) {
    if ((this.queue as number) > 0) clearTimeout(this.queue)
    this.queue = -1
    if (!pass) {
      if (!this.tab || this.tab.classList.contains('show')) this.queue = setTimeout(() => this.update(true), 50)
    } else {
      if (this.e.layout) {
        const v = this.site.dataviews[this.view],
          s = v.selection && v.selection.all,
          d = v.get.dataset(),
          y = this.site.inputs[this.time || v.time_agg],
          parsed = this.parsed
        if (this.site.data.inited[d] && s && v.time_range.filtered.length) {
          parsed.base_trace = this.site.valueOf(this.base_trace) as string
          parsed.x = this.site.valueOf(this.x) as string
          parsed.y = this.site.valueOf(this.y) as string
          parsed.color = this.site.valueOf(this.color || v.y || parsed.y) as string
          const varx = await this.site.data.get_variable(parsed.x, v),
            vary = await this.site.data.get_variable(parsed.y, v),
            varcol = await this.site.data.get_variable(parsed.color, v)
          parsed.x_range = varx.time_range[d]
          parsed.y_range = vary.time_range[d]
          parsed.view = v
          parsed.dataset = d
          parsed.palette = (this.site.valueOf(v.palette) || this.site.spec.settings.palette) as string
          if (!(parsed.palette in this.site.palettes)) parsed.palette = this.site.defaults.palette
          parsed.time =
            (y ? (y.value() as number) - this.site.data.meta.times[d].range[0] : 0) - varcol.time_range[d][0]
          parsed.summary = varcol.views[this.view].summaries[d]
          const ns = parsed.summary.n,
            display_time = ns[parsed.time] ? parsed.time : 0,
            summary = vary.views[this.view].summaries[d],
            n = ns[display_time],
            subset = n !== v.n_selected.dataset,
            rank = subset ? 'subset_rank' : 'rank',
            order = subset ? varcol.views[this.view].order[d][display_time] : varcol.info[d].order[display_time],
            traces = []
          let i = parsed.summary.missing[display_time],
            k: string,
            b: PlotlyTrace,
            fn = order ? order.length : 0,
            settings = this.site.spec.settings,
            lim = (settings.trace_limit as number) || 0,
            jump,
            state =
              v.value() +
              v.get.time_filters() +
              d +
              parsed.x +
              parsed.y +
              parsed.time +
              parsed.palette +
              parsed.color +
              settings.summary_selection +
              settings.color_scale_center +
              settings.color_by_order +
              settings.trace_limit +
              settings.show_empty_times
          lim = jump = lim && lim < n ? Math.ceil(Math.min(lim / 2, n / 2)) : 0
          Object.keys(this.reference_options).forEach(
            (k: keyof PlotlySpec) => (this.spec[k] = this.site.valueOf(this.reference_options[k]))
          )
          for (; i < fn; i++) {
            if (order[i][0] in s) {
              k = order[i][0]
              const e = s[k]
              state += k
              traces.push(this.make_data_entry(e, e.views[this.view][rank][parsed.color][parsed.time], n))
              if (lim && !--jump) break
            }
          }
          if (lim && i < fn) {
            for (jump = i, i = fn - 1; i > jump; i--) {
              if (order[i][0] in s) {
                k = order[i][0]
                const e = s[k]
                state += k
                traces.push(this.make_data_entry(e, e.views[this.view][rank][parsed.color][parsed.time], n))
                if (!--lim) break
              }
            }
          }
          state += traces.length && traces[0].type
          if (settings.boxplots && 'box' in this.traces && s[k]) {
            state += 'box' + settings.iqr_box
            b = JSON.parse(this.traces.box)
            traces.push(b)
            b.line.color = this.site.defaults.border
            b.median = summary.median
            b.q3 = summary.q3
            b.q1 = summary.q1
            if (settings.iqr_box) {
              b.upperfence = []
              b.lowerfence = []
              b.q1.forEach((q1, i) => {
                if (isNaN(b.median[i])) b.median[i] = 0
                const n = (b.q3[i] - q1) * 1.5,
                  med = b.median[i]
                b.q3[i] = isNaN(b.q3[i]) ? med : Math.max(med, b.q3[i])
                b.upperfence[i] = b.q3[i] + n
                b.q1[i] = isNaN(b.q1[i]) ? med : Math.min(med, q1)
                b.lowerfence[i] = q1 - n
              })
            } else {
              b.upperfence = summary.max
              b.lowerfence = summary.min
            }
            if (settings.show_empty_times) {
              b.x = b.q1.map((_, i) => s[k].get_value(parsed.x, i + parsed.y_range[0]))
            } else {
              b.x = []
              for (i = b.q1.length; i--; ) {
                if (ns[i]) {
                  b.x[i] = s[k].get_value(parsed.x, i + parsed.y_range[0])
                }
              }
            }
          }
          if (state !== this.state) {
            if ('boolean' !== typeof this.e.layout.yaxis.title)
              this.e.layout.yaxis.title =
                this.site.data.format_label(parsed.y) +
                ((settings.trace_limit as number) < v.n_selected.all ? ' (' + settings.trace_limit + ' extremes)' : '')
            if ('boolean' !== typeof this.e.layout.xaxis.title)
              this.e.layout.xaxis.title = this.site.data.format_label(parsed.x)
            this.e.layout.yaxis.autorange = false
            this.e.layout.yaxis.range = [Infinity, -Infinity]
            if (!b) b = {upperfence: summary.max, lowerfence: summary.min}
            let any_skipped = false
            summary.min.forEach((min, i) => {
              if (settings.show_empty_times || ns[i]) {
                const l = Math.min(b.lowerfence[i], min),
                  u = Math.max(b.upperfence[i], summary.max[i])
                if (this.e.layout.yaxis.range[0] > l) this.e.layout.yaxis.range[0] = l
                if (this.e.layout.yaxis.range[1] < u) this.e.layout.yaxis.range[1] = u
              } else any_skipped = true
            })
            const r = (this.e.layout.yaxis.range[1] - this.e.layout.yaxis.range[0]) / 10
            this.e.layout.yaxis.range[0] -= r
            this.e.layout.yaxis.range[1] += r
            if (this.e.layout.yaxis.range[1] > 100) {
              const yinfo = vary.info[d].info
              if (yinfo && 'percent' === (yinfo.aggregation_method || yinfo.type)) this.e.layout.yaxis.range[1] = 100
            }
            if (this.site.data.variables[parsed.x].is_time) {
              const start = v.time_range.filtered[0],
                end = v.time_range.filtered[1],
                adj = any_skipped && end > start ? Math.log(end - start) : 0.5
              if (this.e.layout.xaxis.autorange) {
                this.e.layout.xaxis.autorange = false
                this.e.layout.xaxis.type = 'linear'
                this.e.layout.xaxis.dtick = 1
                this.e.layout.xaxis.range = [start - adj, end + adj]
              } else {
                this.e.layout.xaxis.range[0] = start - adj
                this.e.layout.xaxis.range[1] = end + adj
              }
            }
            if (b.lowerfence.length < this.previous_span) {
              Plotly.newPlot(this.e, traces, this.e.layout, this.e.config)
              this.e
                .on('plotly_hover', this.mouseover)
                .on('plotly_unhover', this.mouseout)
                .on('plotly_click', this.click)
            } else {
              Plotly.react(this.e, traces, this.e.layout, this.e.config)
            }
            setTimeout(this.site.page.trigger_resize, 300)
            this.previous_span = b.lowerfence.length
            this.state = state
          }
        }
      }
    }
  }
  make_data_entry(e: Entity, rank: number, total: number, name?: string, color?: string) {
    const data = this.site.data
    if (e.data && this.parsed.x in data.variables) {
      const x = data.get_value({variable: this.parsed.x, entity: e}),
        y = data.get_value({variable: this.parsed.y, entity: e}),
        t = JSON.parse(this.traces[this.base_trace]),
        yr = data.variables[this.parsed.y].time_range[this.parsed.dataset],
        xr = data.variables[this.parsed.x].time_range[this.parsed.dataset],
        n = Math.min(yr[1], xr[1]) + 1,
        ns = this.parsed.summary.n
      for (let i = Math.max(yr[0], xr[0]); i < n; i++) {
        if (this.site.spec.settings.show_empty_times || ns[i - this.parsed.y_range[0]]) {
          t.text.push(e.features.name)
          t.x.push(this.parsed.x_range[0] <= i && i <= this.parsed.x_range[1] ? x[i - this.parsed.x_range[0]] : NaN)
          t.y.push(this.parsed.y_range[0] <= i && i <= this.parsed.y_range[1] ? y[i - this.parsed.y_range[0]] : NaN)
        }
      }
      t.type = this.parsed.base_trace
      t.color =
        t.line.color =
        t.marker.color =
        t.textfont.color =
          color ||
          this.site.get_color(
            e.get_value(this.parsed.color, this.parsed.time),
            this.parsed.palette,
            this.parsed.summary,
            this.parsed.time,
            rank,
            total
          ) ||
          this.site.defaults.border
      if ('bar' === t.type) t.marker.line.width = 0
      t.name = name || e.features.name
      t.id = e.features.id
      return t
    }
  }
  update_theme() {
    if (this.dark_theme !== this.site.spec.settings.theme_dark) {
      this.dark_theme = this.site.spec.settings.theme_dark as boolean
      const s = getComputedStyle(document.body)
      if (!('style' in this)) {
        this.style = this.spec.layout
        if (!('font' in this.style)) this.style.font = {}
        if (!('modebar' in this.style)) this.style.modebar = {}
        if (!('font' in this.style.xaxis)) this.style.xaxis.font = {}
        if (!('font' in this.style.yaxis)) this.style.yaxis.font = {}
      }
      this.style.paper_bgcolor = s.backgroundColor
      this.style.plot_bgcolor = s.backgroundColor
      this.style.font.color = s.color
      this.style.modebar.bgcolor = s.backgroundColor
      this.style.modebar.color = s.color
      if (this.e._fullLayout.xaxis.showgrid) this.style.xaxis.gridcolor = s.borderColor
      if (this.e._fullLayout.yaxis.showgrid) this.style.yaxis.gridcolor = s.borderColor
      this.style.xaxis.font.color = s.color
      this.style.yaxis.font.color = s.color
      Plotly.relayout(this.e, this.spec.layout)
    }
  }
}
