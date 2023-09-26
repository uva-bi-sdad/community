import type {Entity, Order, Summary} from '../../types'
import type Community from '../index'
import type {SiteInputs} from '../inputs/index'
import {summary_levels} from '../summary_levels'
import {BaseOutput} from './index'

export class OutputLegend extends BaseOutput {
  type: 'legend'
  clickto?: SiteInputs
  palette: string
  variable: string
  state = ''
  parsed: {
    summary?: Summary
    order?: Order
    time: number
    color: string
    bins: number
    rank: boolean
  } = {time: 0, color: '', bins: 0, rank: false}
  queue: {lock: boolean; cooldown: number | NodeJS.Timeout; reset: () => void; e?: HTMLElement; trigger?: () => void} =
    {
      lock: false,
      cooldown: -1,
      reset: function () {
        this.lock = false
      },
    }
  integer = false
  entity: Entity
  parts: {
    ticks: HTMLElement
    scale: HTMLElement
    summary: HTMLElement
  }
  ticks = {
    center: document.createElement('div'),
    min: document.createElement('div'),
    max: document.createElement('div'),
    entity: document.createElement('div'),
  }
  current_palette = ''
  constructor(e: HTMLElement, site: Community) {
    super(e, site)
    this.mouseover = this.mouseover.bind(this)
    this.mouseout = this.mouseout.bind(this)
    this.click = this.click.bind(this)
    this.update = this.update.bind(this)
    e.addEventListener('mousemove', this.mouseover)
    e.addEventListener('mouseout', this.mouseout)
    e.addEventListener('click', this.click)
    this.variable = this.e.dataset.variable
    this.queue.trigger = function (this: OutputLegend) {
      this.mouseover(this.queue.e)
    }.bind(this)
    this.queue.reset = this.queue.reset.bind(this.queue)
    this.parts = {
      ticks: this.e.querySelector('.legend-ticks'),
      scale: this.e.querySelector('.legend-scale'),
      summary: this.e.querySelector('.legend-summary'),
    }
    this.parts.ticks.dataset.of
    this.parts.scale.dataset.of
    this.parts.summary.dataset.of
    this.parts.summary.appendChild(this.ticks.center)
    this.parts.summary.appendChild(this.ticks.min)
    this.parts.summary.appendChild(this.ticks.max)
    this.parts.ticks.appendChild(this.ticks.entity)
  }
  init() {
    this.site.add_dependency(this.view, {type: 'update', id: this.id})
    const view = this.site.dataviews[this.view]
    if ('string' === typeof view.time_agg && view.time_agg in this.site.inputs)
      this.site.add_dependency(view.time_agg, {type: 'update', id: this.id})
    if (!this.palette) {
      if (view.palette) {
        this.palette = view.palette
        if (view.palette in this.site.inputs) this.site.add_dependency(view.palette, {type: 'update', id: this.id})
      } else {
        this.palette =
          'settings.palette' in this.site.inputs ? 'settings.palette' : (this.site.spec.settings.palette as string)
      }
    }
    if (this.variable) {
      if (this.variable in this.site.inputs) this.site.add_dependency(this.variable, {type: 'update', id: this.id})
    } else if (view.y in this.site.inputs) this.site.add_dependency(view.y, {type: 'update', id: this.id})
    if (this.palette in this.site.inputs) {
      const palette = this.site.inputs[this.palette]
      if (palette.e) {
        palette.e.addEventListener('change', this.update)
      }
    }
    const click_ref = this.e.dataset.click
    if (click_ref in this.site.inputs) this.clickto = this.site.inputs[click_ref]
    Object.keys(this.ticks).forEach((t: keyof typeof this.ticks) => {
      const div = document.createElement('div')
      let p = document.createElement('p')
      this.ticks[t].dataset.of
      this.ticks[t].className = 'legend-tick'
      this.ticks[t].appendChild(div)
      div.dataset.of
      div.appendChild(p)
      p.dataset.of
      if ('m' !== t.substring(0, 1)) {
        div.appendChild((p = document.createElement('p')))
        p.dataset.of
        div.appendChild((p = document.createElement('p')))
        p.dataset.of
        if ('entity' === t) {
          this.ticks[t].firstElementChild.lastElementChild.classList.add('entity')
        } else {
          this.ticks[t].firstElementChild.firstElementChild.classList.add('summary')
        }
      }
    })
    this.ticks.entity.firstElementChild.classList.add('hidden')
    this.ticks.max.className = 'legend-tick-end max'
    this.ticks.min.className = 'legend-tick-end min'
    this.ticks.center.style.left = '50%'
    this.update()
  }
  show(e: Entity) {
    if (e && e.features.name) {
      const view = this.site.dataviews[this.view],
        summary = this.parsed.summary,
        time = this.parsed.time,
        color = this.parsed.color,
        string = summary && 'string' === summary.type,
        min = summary && !string ? summary.min[time] : 0,
        range = summary ? (string ? summary.levels.length - min : summary.range[time]) : 1,
        n = summary.n[time],
        subset = n === view.n_selected.dataset ? 'rank' : 'subset_rank',
        es = this.site.data.entities[e.features.id].views[this.view],
        value = e.get_value(color, time),
        p =
          ((string ? value in summary.level_ids : 'number' === typeof value)
            ? this.site.spec.settings.color_by_order
              ? NaN
              : Math.max(0, Math.min(1, range ? ((string ? summary.level_ids[value] : value) - min) / range : 0.5))
            : NaN) * 100,
        container = this.ticks.entity,
        t = container.firstElementChild.children[1] as HTMLElement
      if (isFinite(p)) {
        t.parentElement.classList.remove('hidden')
        t.innerText = this.site.data.format_value(value, this.integer) as string
        container.style.left = p + '%'
        ;(container.firstElementChild.firstElementChild as HTMLElement).innerText =
          (p > 96 || p < 4) && e.features.name.length > 13 ? e.features.name.substring(0, 12) + '…' : e.features.name
      } else if (this.site.spec.settings.color_by_order && color in es[subset]) {
        const i = es[subset][color][time],
          po = n > 1 ? (i / (n - 1)) * 100 : 0
        ;(container.firstElementChild.firstElementChild as HTMLElement).innerText =
          i > -1 && (po > 96 || po < 4) && e.features.name.length > 13
            ? e.features.name.substring(0, 12) + '…'
            : e.features.name
        if (i > -1) {
          t.parentElement.classList.remove('hidden')
          t.innerText = '# ' + (n - i)
          container.style.left = po + '%'
        }
      }
      container.style.marginLeft = -container.getBoundingClientRect().width / 2 + 'px'
    }
  }
  revert() {
    this.ticks.entity.firstElementChild.classList.add('hidden')
  }
  async update() {
    const view = this.site.dataviews[this.view],
      variable = this.site.valueOf(this.variable || view.y) as string,
      d = view.get.dataset(),
      var_info = await this.site.data.get_variable(variable, view),
      time = this.site.valueOf(view.time_agg),
      palettes = this.site.palettes
    if (null !== time && view.valid && var_info && this.view in var_info.views) {
      const y =
          ('number' === typeof time ? time - this.site.data.meta.times[d].range[0] : 0) - var_info.time_range[d][0],
        summary = var_info.views[this.view].summaries[d],
        ep = (this.site.valueOf(this.palette) as string).toLowerCase(),
        pn =
          ep in palettes
            ? ep
            : (this.site.spec.settings.palette as string) in palettes
            ? (this.site.spec.settings.palette as string)
            : this.site.defaults.palette,
        p = palettes[pn],
        s = this.parts.scale,
        ticks = this.ticks
      this.parsed.summary = summary
      this.parsed.order = var_info.views[this.view].order[d][y]
      this.parsed.time = y
      this.parsed.color = variable
      if (summary && y < summary.n.length) {
        this.integer = d in var_info.info && 'integer' === var_info.info[d].type
        const refresh = this.site.spec.settings.color_by_order !== this.parsed.rank,
          bins = s.querySelectorAll('span'),
          odd = p.odd,
          remake =
            'discrete' === p.type
              ? !bins.length || p.colors.length !== this.parsed.bins
              : !s.firstElementChild || 'SPAN' !== s.firstElementChild.tagName
        this.parsed.bins = p.colors.length
        if (pn + this.site.spec.settings.color_scale_center !== this.current_palette || refresh) {
          this.current_palette = pn + this.site.spec.settings.color_scale_center
          this.parsed.rank = this.site.spec.settings.color_by_order as boolean
          if (remake) s.innerHTML = ''
          if ('discrete' === p.type) {
            let i = 0,
              n = Math.ceil(p.colors.length / 2),
              div = document.createElement('div'),
              span = document.createElement('span')
            if (remake) {
              s.appendChild(div)
              div.dataset.of = this.id
              div.style.left = '0px'
              const prop = (1 / (n - odd / 2)) * 100 + '%'
              for (; i < n; i++) {
                div.appendChild(span)
                span.dataset.of = this.id
                span.style.backgroundColor = p.colors[i]
                span.style.width = prop
              }
              if (odd) span.style.width = ((1 / (n - odd / 2)) * 100) / 2 + '%'
              s.appendChild((div = document.createElement('div')))
              div.dataset.of = this.id
              div.style.right = '0px'
              for (i = Math.floor(p.colors.length / 2), n = p.colors.length; i < n; i++) {
                div.appendChild((span = document.createElement('span')))
                span.dataset.of = this.id
                span.style.backgroundColor = p.colors[i]
                span.style.width = prop
              }
              if (odd) span.style.width = ((1 / (Math.ceil(p.colors.length / 2) - odd / 2)) * 100) / 2 + '%'
            } else {
              for (; i < n; i++) {
                bins[i].style.backgroundColor = p.colors[i]
              }
              for (i = Math.floor(p.colors.length / 2), n = p.colors.length; i < n; i++) {
                bins[i + odd].style.backgroundColor = p.colors[i]
              }
            }
          } else if ('continuous-polynomial' !== p.type) {
            if (remake) {
              s.appendChild(document.createElement('span'))
              s.appendChild(document.createElement('span'))
            }
            ;(s.firstElementChild as HTMLElement).style.background =
              'linear-gradient(0.25turn, rgb(' +
              p.colors[2][0][0] +
              ', ' +
              p.colors[2][0][1] +
              ', ' +
              p.colors[2][0][2] +
              '), rgb(' +
              p.colors[1][0] +
              ', ' +
              p.colors[1][1] +
              ', ' +
              p.colors[1][2] +
              '))'
            ;(s.lastElementChild as HTMLElement).style.background =
              'linear-gradient(0.25turn, rgb(' +
              p.colors[1][0] +
              ', ' +
              p.colors[1][1] +
              ', ' +
              p.colors[1][2] +
              '), rgb(' +
              p.colors[0][0][0] +
              ', ' +
              p.colors[0][0][1] +
              ', ' +
              p.colors[0][0][2] +
              '))'
          }
        }
        const center = this.site.spec.settings.color_scale_center as keyof Summary | 'none'
        if ('string' === var_info.type) {
          ticks.center.classList.remove('hidden')
          ;(ticks.min.firstElementChild.firstElementChild as HTMLElement).innerText = var_info.levels[0]
          ;(ticks.max.firstElementChild.firstElementChild as HTMLElement).innerText =
            var_info.levels[var_info.levels.length - 1]
        } else if (this.site.spec.settings.color_by_order) {
          ticks.center.classList.add('hidden')
          ;(ticks.min.firstElementChild.firstElementChild as HTMLElement).innerText =
            '# ' + (summary.n[y] ? summary.n[y] : 0)
          ;(ticks.max.firstElementChild.firstElementChild as HTMLElement).innerText = '# ' + (summary.n[y] ? 1 : 0)
        } else {
          const state =
            '' +
            summary.n[y] +
            summary.min[y] +
            summary.max[y] +
            this.site.spec.settings.digits +
            center +
            this.site.spec.settings.summary_selection
          if (remake || refresh || state !== this.state) {
            this.state = state
            ticks.center.classList.remove('hidden')
            ;(ticks.min.firstElementChild.firstElementChild as HTMLElement).innerText =
              (summary.n[y]
                ? isFinite(summary.min[y])
                  ? this.site.data.format_value(summary.min[y], this.integer)
                  : NaN
                : NaN) + ''
            ;(ticks.max.firstElementChild.firstElementChild as HTMLElement).innerText =
              (summary.n[y]
                ? isFinite(summary.max[y])
                  ? this.site.data.format_value(summary.max[y], this.integer)
                  : NaN
                : NaN) + ''
            if ('none' === center) {
              ;(ticks.center.firstElementChild.lastElementChild as HTMLElement).innerText =
                summary_levels[this.site.spec.settings.summary_selection as string] + ' median'
              ;(ticks.center.firstElementChild.children[1] as HTMLElement).innerText = this.site.data.format_value(
                summary.median[y]
              ) as string
              ticks.center.style.left = summary.norm_median[y] * 100 + '%'
            } else {
              ;(ticks.center.firstElementChild.lastElementChild as HTMLElement).innerText =
                summary_levels[this.site.spec.settings.summary_selection as string] + ' ' + center
              ;(ticks.center.firstElementChild.children[1] as HTMLElement).innerText = this.site.data.format_value(
                (summary[center] as number[])[y]
              ) as string
              ticks.center.style.left = summary[('norm_' + center) as 'norm_mean'][y] * 100 + '%'
            }
            ticks.center.style.marginLeft = -ticks.center.getBoundingClientRect().width / 2 + 'px'
          }
        }
        if (this.site.spec.settings.color_by_order || 'none' === center) {
          ;(s.firstElementChild as HTMLElement).style.width = '50%'
          ;(s.lastElementChild as HTMLElement).style.width = '50%'
        } else {
          ;(s.firstElementChild as HTMLElement).style.width = summary[('norm_' + center) as 'norm_mean'][y] * 100 + '%'
          ;(s.lastElementChild as HTMLElement).style.width =
            100 - summary[('norm_' + center) as 'norm_mean'][y] * 100 + '%'
        }
      }
    }
  }
  mouseover(e: MouseEvent | HTMLElement) {
    if (!this.queue.lock && 'clientX' in e) {
      this.queue.lock = true
      const s = this.parts.scale.getBoundingClientRect(),
        p = (Math.max(s.x, Math.min(s.x + s.width, e.clientX)) - s.x) / s.width
      let entity: Entity
      if (this.site.spec.settings.color_by_order) {
        if (this.parsed.order && this.parsed.order.length)
          entity =
            this.site.data.entities[
              this.parsed.order[
                Math.max(
                  this.parsed.summary.missing[this.parsed.time],
                  Math.min(this.parsed.order.length - 1, Math.floor((this.parsed.order.length - 1) * p))
                )
              ][0]
            ]
      } else if ('min' in this.parsed.summary) {
        const min = this.parsed.summary.min[this.parsed.time],
          max = this.parsed.summary.max[this.parsed.time],
          tv = min + p * (max - min)
        let i, n
        if (this.parsed.order && this.parsed.order.length) {
          n = this.parsed.summary.missing[this.parsed.time]
          if (n < this.parsed.order.length) {
            if (1 === this.parsed.order.length || !p) {
              entity = this.site.data.entities[this.parsed.order[n][0]]
            } else {
              for (i = this.parsed.order.length - 2; i >= n; --i) {
                if ((this.parsed.order[i][1] + this.parsed.order[i + 1][1]) / 2 <= tv) break
              }
              i++
              entity = this.site.data.entities[this.parsed.order[i][0]]
            }
          }
        }
      }
      if (entity) {
        this.show(entity)
        if (!this.entity || entity.features.id !== this.entity.features.id) {
          if (!this.entity) {
            this.entity = entity
          } else this.site.subs.update(this.id, 'revert', this.entity)
          this.site.subs.update(this.id, 'show', entity)
          this.entity = entity
        }
      }
      setTimeout(this.queue.reset, 200)
    } else {
      if ((this.queue.cooldown as number) > 0) clearTimeout(this.queue.cooldown)
      this.queue.e = e as HTMLElement
      this.queue.cooldown = setTimeout(this.queue.trigger, 100)
    }
  }
  mouseout(e: MouseEvent) {
    const target = e.relatedTarget as HTMLElement
    if (target && this.id !== target.dataset.of) {
      if ((this.queue.cooldown as number) > 0) clearTimeout(this.queue.cooldown)
      this.queue.cooldown = -1
      this.revert()
      if (this.entity) {
        this.site.subs.update(this.id, 'revert', this.entity)
        this.entity = undefined
      }
    }
  }
  click() {
    if (this.clickto && this.entity) {
      this.revert()
      this.clickto.set(this.entity.features.id)
    }
  }
}
