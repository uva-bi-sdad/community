import type {
  Circle,
  Control,
  FeatureGroup,
  GeoJSONOptions,
  Layer,
  LeafletEvent,
  LeafletMouseEvent,
  Map,
  Polygon,
} from 'leaflet'
import DataHandler from '../../data_handler/index'
import {Entity, MeasureInfo, Summary} from '../../types'
import Community, {Dependency} from '../index'
import {BaseOutput, SiteElement} from './index'
import {SiteDataView} from './dataview'
import {palettes} from '../palettes'
import {InputNumber} from './number'
import {fill_overlay_properties_options} from '../utils'

export type LayerSource = {
  name?: string
  url: string
  time?: number
  id_property?: string
  processed?: boolean
  property_summaries?: {}
}
export type MapLayer = {
  name?: string
  url: string
  id_property?: string
  time?: number
  retrieved?: boolean
  processed?: boolean
  property_summaries?: {
    [index: string]: [number, number, number]
  }
  callbacks?: Function[]
}
type Tiles = {url: string; options?: {[index: string]: any}}
type Options = {[index: string]: boolean | number | string | (number | string)[]}
export type LayerFilter = {
  feature: string
  operator: string
  value: string
  check?: Function
}
type Overlay = {
  variable: string
  source: string | LayerSource[]
  filter?: LayerFilter | LayerFilter[]
}
export type MapSpec = {
  shapes?: MapLayer[]
  overlays?: Overlay[]
  options: Options
  tiles?: Tiles | {light: Tiles; dark: Tiles}
}

export type MeasureLayer = {
  source?: string | LayerSource[]
  filter?: LayerFilter[]
}

type MapParsed = {
  dataset?: string
  color?: string
  time?: number
  view?: SiteDataView
  palette?: string
  summary?: Summary
}

export class OutputMap extends BaseOutput {
  time: string
  parsed: MapParsed = {}
  clickto?: SiteElement
  layers: {[index: string]: FeatureGroup} = {}
  overlays: Overlay[] = []
  map: Map
  overlay: FeatureGroup<Layer>
  displaying: FeatureGroup<Layer>
  overlay_control: Control
  tiles: {[index: string]: any} = {}
  fresh_shapes = false
  has_time = false
  by_time: number[] = []
  queue: number | NodeJS.Timeout
  spec: MapSpec
  options: Options
  triggers: {[index: string]: MeasureLayer} = {}
  vstate = ''
  cstate = ''
  constructor(e: HTMLElement, site: Community) {
    super(e, site)
    this.queue_init = this.queue_init.bind(this)
    this.mouseover = this.mouseover.bind(this)
    this.mouseout = this.mouseout.bind(this)
    this.click = this.click.bind(this)
    this.color = this.e.getAttribute('data-color')
    const click_ref = this.e.getAttribute('data-click')
    if (click_ref in site.inputs) this.clickto = site.inputs[click_ref]
    this.options = this.spec.options
    const dep: Dependency = {type: 'update', id: this.id},
      view = site.dataviews[this.view]
    if (view) {
      if (view.time_agg in site.inputs) site.add_dependency(view.time_agg as string, dep)
      if (view.y) site.add_dependency(view.y, dep)
    } else this.view = site.defaults.dataview
    site.add_dependency(this.view, dep)
    if (this.color in site.inputs) site.add_dependency(this.color, dep)
    if (this.time) site.add_dependency(this.time, dep)
    if (!this.e.style.height) this.e.style.height = this.options.height ? (this.options.height as string) : '400px'
    if (site.spec.settings.overlays_from_measures && site.data.variable_info) {
      if (!Array.isArray(this.spec.overlays)) this.spec.overlays = []
      Object.keys(this.site.data.variable_info).forEach(variable => {
        const info = site.data.variable_info[variable] as MeasureInfo
        if (info.layer && info.layer.source) {
          const source: {url: string; time: number}[] = [],
            layer: Overlay = {variable: variable, source: source}
          if ('string' === typeof info.layer.source && site.patterns.time_ref.test(info.layer.source)) {
            const temp = info.layer.source
            for (let range = site.data.meta.ranges[variable], y = range[0], max = range[1] + 1, time; y < max; y++) {
              time = site.data.meta.overall.value[y]
              source.push({url: temp.replace(this.site.patterns.time_ref, time + ''), time: time})
            }
          }
          site.patterns.time_ref.lastIndex = 0
          if (info.layer.filter && Array.isArray(info.layer.filter)) layer.filter = info.layer.filter
          this.overlays.push(layer)
        }
      })
    }
  }
  init() {
    this.queue_init()
  }
  queue_init() {
    const theme = this.site.spec.settings.theme_dark ? 'dark' : 'light',
      showing = this.deferred || !this.tab || this.tab.classList.contains('show')
    if (showing && window.L) {
      this.map = window.L.map(this.e, this.options)
      this.overlay = window.L.featureGroup().addTo(this.map)
      this.displaying = window.L.featureGroup().addTo(this.map)
      this.overlay_control = window.L.control
        .layers()
        .setPosition('topleft')
        .addOverlay(this.overlay, 'Overlay')
        .addTo(this.map)
      const tiles = this.spec.tiles
      if (tiles) {
        if ('url' in tiles) {
          this.tiles[theme] = window.L.tileLayer(tiles.url, tiles.options)
          this.tiles[theme].addTo(this.map)
        } else {
          Object.keys(tiles).forEach((k: 'dark' | 'light') => {
            this.tiles[k] = window.L.tileLayer(tiles[k].url, tiles[k].options)
            if (theme === k) this.tiles[k].addTo(this.map)
          })
        }
      }
      const time = this.site.data.meta.overall.value[this.site.dataviews[this.view].parsed.time_agg]
      this.spec.shapes.forEach((shape: MapLayer, i: number) => {
        const has_time = 'time' in shape
        if (has_time) {
          if (!this.has_time) {
            this.has_time = true
            this.site.add_dependency(this.view, {type: 'update', id: this.id})
          }
          this.by_time.push(+shape.time)
        }
        let k = shape.name
        if (!k) shape.name = k = this.site.spec.metadata.datasets[i < this.site.spec.metadata.datasets.length ? i : 0]
        const mapId = k + (has_time ? shape.time : '')
        if (!(mapId in this.site.maps.queue)) this.site.maps.queue[mapId] = shape
        this.site.data.inited[mapId + this.id] = false
        if (
          (this.site.data.loaded[k] || k === this.site.spec.settings.background_shapes) &&
          (k === mapId || (time && this.by_time.length && shape.time == this.match_time(time)))
        )
          this.retrieve_layer(shape)
      })
      if (this.has_time) this.by_time.sort()
      if (Array.isArray(this.spec.overlays)) {
        this.spec.overlays.forEach(l => {
          if ('string' === typeof l.source) l.source = [{url: l.source}]
          const source = l.source
          source.forEach(s => {
            s.processed = false
            s.property_summaries = {}
            this.site.maps.queue[s.url] = s
          })
          this.triggers[l.variable] = {source}
          const fs = l.filter
          if (fs) {
            const fa = Array.isArray(fs) ? fs : [fs]
            this.triggers[l.variable].filter = fa
            fa.forEach(f => {
              f.check = DataHandler.checks[f.operator]
            })
          }
        })
      }
    } else {
      this.deferred = true
      setTimeout(this.queue_init, showing ? 0 : 2000)
    }
  }
  match_time(time: number) {
    let i = this.by_time.length
    for (; i--; ) if (!i || this.by_time[i] <= time) break
    return this.by_time[i]
  }
  show(e: Entity) {
    if (e.layer && e.layer[this.id]) {
      const highlight_style = {
          color: 'var(--border-highlight)',
          weight: (this.site.spec.settings.polygon_outline as number) + 1,
          fillOpacity: 1,
        },
        layer = e.layer[this.id]
      if ('has_time' in layer) {
        if (!this.site.data.inited[this.parsed.dataset + this.id]) {
          const time = this.match_time(
            this.site.data.meta.overall.value[
              this.site.data.variables[this.parsed.color].time_range[this.parsed.dataset][0] + this.parsed.time
            ]
          )
          if (layer[time]) (layer[time] as FeatureGroup).setStyle(highlight_style)
        }
      } else if (layer.setStyle) {
        layer.setStyle(highlight_style)
      }
    }
  }
  revert(e: Entity) {
    if (e.layer && e.layer[this.id]) {
      const default_style = {
          color: 'var(--border)',
          weight: this.site.spec.settings.polygon_outline as number,
          fillOpacity: 0.7,
        },
        layer = e.layer[this.id]
      if ('has_time' in layer) {
        if (!this.site.data.inited[this.parsed.dataset + this.id]) {
          const time = this.match_time(
            this.site.data.meta.overall.value[
              this.site.data.variables[this.parsed.color].time_range[this.parsed.dataset][0] + this.parsed.time
            ]
          )
          if (layer[time]) (layer[time] as FeatureGroup).setStyle(default_style)
        }
      } else {
        layer.setStyle(default_style)
      }
    }
  }
  mouseover(e: LeafletEvent) {
    e.target.setStyle({
      color: 'var(--border-highlight)',
    })
    this.site.subs.update(
      this.id,
      'show',
      this.site.data.entities[e.target.feature.properties[e.target.source.id_property]]
    )
  }
  mouseout(e: LeafletEvent) {
    this.site.subs.update(
      this.id,
      'revert',
      this.site.data.entities[e.target.feature.properties[e.target.source.id_property]]
    )
    e.target.setStyle({
      color: 'var(--border)',
    })
  }
  click(e: LeafletEvent) {
    if (this.clickto) this.clickto.set(e.target.feature.properties[e.target.source.id_property])
  }
  async update(entity?: Entity, caller?: SiteElement, pass?: boolean) {
    if ((this.queue as number) > 0) clearTimeout(this.queue)
    this.queue = -1
    if (!pass) {
      if (!this.tab || this.tab.classList.contains('show'))
        this.queue = setTimeout(() => this.update(void 0, void 0, true), 50)
    } else {
      if (this.view && this.displaying) {
        const parsed = this.parsed,
          view = this.site.dataviews[this.view],
          d = view.get.dataset(),
          time = this.site.valueOf(view.time_agg),
          map_time = this.options.has_time ? this.match_time(time as number) : '',
          inited = d + map_time + this.id in this.site.data.inited,
          mapId = inited ? d + map_time : d
        if (this.site.maps.queue && mapId in this.site.maps.queue && !this.site.data.inited[mapId + this.id]) {
          if (!inited || null !== time)
            this.retrieve_layer(this.site.maps.queue[mapId], () => this.update(void 0, void 0, true))
          return
        }
        if (!view.valid && this.site.data.inited[d]) {
          view.state = ''
          this.site.conditionals.dataview(view, void 0, true)
        }
        parsed.view = view
        parsed.dataset = d
        const vstate =
            view.value() +
            mapId +
            this.site.spec.settings.background_shapes +
            this.site.spec.settings.background_top +
            this.site.spec.settings.background_polygon_outline +
            this.site.data.inited[this.options.background_shapes as string],
          a = view.selection.all,
          s =
            view.selection[this.site.spec.settings.background_shapes && this.options.background_shapes ? 'ids' : 'all'],
          c = this.site.valueOf(this.color || view.y) as string
        if (this.site.spec.settings.map_overlay && c in this.triggers) {
          this.show_overlay(this.triggers[c], this.site.data.meta.overall.value[view.parsed.time_agg])
        } else {
          this.overlay_control.remove()
          this.overlay.clearLayers()
        }
        if (this.site.data.inited[mapId + this.id] && s && view.valid) {
          const ys = this.time
              ? (this.site.inputs[this.time] as InputNumber)
              : view.time_agg
              ? view.time_agg in this.site.inputs
                ? (this.site.inputs[view.time_agg] as InputNumber)
                : parseInt(view.time_agg as string)
              : 0,
            time_input = 'number' !== typeof ys
          parsed.palette = (this.site.valueOf(view.palette) || this.site.spec.settings.palette) as string
          if (!(parsed.palette in palettes)) parsed.palette = this.site.defaults.palette
          const varc = await this.site.data.get_variable(c, this.site.dataviews[this.view]),
            summary = varc.views[this.view].summaries[d],
            time =
              (time_input && ys.parsed ? (ys.value() as number) - this.site.data.meta.times[d].range[0] : 0) -
              varc.time_range[d][0]
          parsed.summary = summary
          parsed.time = time
          parsed.color = c
          const subset = !time_input && summary.n[ys] === view.n_selected.dataset ? 'rank' : 'subset_rank'
          if (vstate !== this.vstate) {
            ;(this.map as any)._zoomAnimated = 'none' !== this.site.spec.settings.map_animations
            Object.keys(this.reference_options).forEach(k => {
              this.options[k] = this.site.valueOf(this.reference_options[k])
              if ('zoomAnimation' === k) (this.map as any)._zoomAnimated = this.options[k]
            })
            this.displaying.clearLayers()
            this.fresh_shapes = true
            this.vstate = ''
            let n = 0
            Object.keys(s).forEach(k => {
              const skl = s[k].layer && s[k].layer[this.id]
              if (skl) {
                const fg = k in a,
                  cl = 'has_time' in skl ? (skl[map_time] as FeatureGroup) : skl
                if (cl && (fg || this.options.background_shapes === this.site.data.entities[k].group)) {
                  n++
                  ;(cl.options as GeoJSONOptions).interactive = fg
                  cl.addTo(this.displaying)
                  if (fg) {
                    if (this.site.spec.settings.background_top) cl.bringToBack()
                  } else {
                    if (!this.site.spec.settings.background_top) cl.bringToBack()
                    cl.setStyle({
                      fillOpacity: 0,
                      color: 'var(--border-highlight)',
                      weight: this.site.spec.settings.background_polygon_outline as number,
                    })
                  }
                  if (!this.vstate) this.vstate = vstate
                }
              }
            })
            this.overlay.bringToFront()
            if (n)
              if ('fly' === this.site.spec.settings.map_animations) {
                setTimeout(() => this.map.flyToBounds(this.displaying.getBounds()), 400)
              } else {
                this.map.fitBounds(this.displaying.getBounds())
              }
          }

          // coloring
          const k =
            c +
            this.vstate +
            parsed.palette +
            time +
            this.site.spec.settings.polygon_outline +
            this.site.spec.settings.color_by_order +
            this.site.spec.settings.color_scale_center
          if (k !== this.cstate) {
            this.cstate = k
            if (this.id in this.site.maps) {
              const ls = (this.displaying as any)._layers
              const n = summary.n[time]
              Object.keys(ls).forEach(id => {
                const lsi = ls[id]
                if (d === lsi.entity.group) {
                  const e = a[lsi.entity.features.id],
                    es = e && e.views[this.view][subset]
                  lsi.setStyle({
                    fillOpacity: 0.7,
                    color: 'var(--border)',
                    fillColor:
                      e && c in es
                        ? pal(e.get_value(c, time), parsed.palette, summary, time, es[c][time], n)
                        : this.site.defaults.missing,
                    weight: this.site.spec.settings.polygon_outline,
                  })
                }
              })
            } else {
              if (!(d in this.site.maps.waiting)) this.site.maps.waiting[d] = []
              if (-1 === this.site.maps.waiting[d].indexOf(this.id)) this.site.maps.waiting[d].push(this.id)
              if (-1 === this.site.maps.waiting[d].indexOf(this.view)) this.site.maps.waiting[d].push(this.view)
            }
          }
        }
      }
    }
  }
  async retrieve_layer(source: MapLayer, callback?: Function) {
    const mapId = source.name ? source.name + (source.time || '') : source.url
    if (!('_raw' in this.site.spec.map)) this.site.spec.map._raw = {}
    if (source.url in this.site.spec.map._raw) {
      this.process_layer(source)
      this.site.maps.queue[mapId].retrieved = true
      callback && callback()
    } else {
      if (this.site.maps.queue[mapId] && 'retrieved' in this.site.maps.queue[mapId]) {
        if (callback) {
          if (!this.site.maps.queue[mapId].callbacks) this.site.maps.queue[mapId].callbacks = []
          this.site.maps.queue[mapId].callbacks.push(callback)
        }
      } else {
        this.site.maps.queue[mapId].retrieved = false
        const f = new window.XMLHttpRequest()
        f.onreadystatechange = () => {
          if (4 === f.readyState && 200 === f.status) {
            this.site.spec.map._raw[source.url] = f.responseText
            if (source.name) {
              this.site.maps.queue[mapId].retrieved = true
            }
            if (this.site.maps.queue[mapId].callbacks) {
              if (callback) this.site.maps.queue[mapId].callbacks.push(callback)
              this.site.maps.queue[mapId].callbacks.forEach(f => f())
            } else callback && callback()
          }
        }
        f.open('GET', source.url, true)
        f.send()
      }
    }
  }
  process_layer(source: MapLayer) {
    const has_time = 'time' in source,
      layerId = source.name + (has_time ? source.time : '')
    this.layers[layerId] = window.L.geoJSON(JSON.parse(this.site.spec.map._raw[source.url]), {
      onEachFeature: (f, l: Polygon) => {
        l.on({
          mouseover: this.mouseover,
          mouseout: this.mouseout,
          click: this.click,
        })
        l.setStyle({weight: 0, fillOpacity: 0})
        ;(l as any).source = source
        const p = l.feature.properties
        let id = p[source.id_property]
        if (!(id in this.site.data.entities) && this.site.patterns.leading_zeros.test(id))
          id = p[source.id_property] = id.replace(this.site.patterns.leading_zeros, '')
        if (id in this.site.data.entities) {
          if (!('layer' in this.site.data.entities[id])) this.site.data.entities[id].layer = {}
        } else {
          this.site.data.entities[id] = {layer: {}, features: {id: id}}
        }
        if (has_time) {
          if (!(this.id in this.site.data.entities[id].layer))
            this.site.data.entities[id].layer[this.id] = {has_time: true}
          this.site.data.entities[id].layer[this.id][source.time] = l
        } else this.site.data.entities[id].layer[this.id] = l
        ;(l as any).entity = this.site.data.entities[id]
        if (this.site.data.entities[id].features)
          Object.keys(p).forEach(f => {
            if (!(f in this.site.data.entities[id].features)) {
              if (
                'name' === f.toLowerCase() &&
                (!('name' in this.site.data.entities[id].features) ||
                  this.site.data.entities[id].features.id === this.site.data.entities[id].features.name)
              ) {
                this.site.data.entities[id].features[f.toLowerCase()] = p[f]
              } else {
                this.site.data.entities[id].features[f] = p[f]
              }
            }
          })
      },
    })
    this.site.data.inited[layerId + this.id] = true
    if (this.site.maps.waiting && this.site.maps.waiting[source.name]) {
      for (let i = this.site.maps.waiting[source.name].length; i--; ) {
        this.site.request_queue(this.site.maps.waiting[source.name][i])
      }
    }
  }
  show_overlay(o: MeasureLayer, time: number) {
    let i = 0,
      source = '',
      s = o.source
    if ('string' === typeof o.source) {
      source = o.source
    } else {
      for (i = o.source.length; i--; ) {
        if (!o.source[i].time || time === o.source[i].time) {
          if (o.source[i].name) delete o.source[i].name
          source = o.source[i].url
          break
        }
      }
    }
    if (source) {
      if (source in this.site.spec.map._raw) {
        if (!(source in this.layers)) {
          const property_summaries: {[index: string]: [number, number, number]} = {}
          if (!this.site.maps.queue[source].processed) {
            this.site.maps.queue[source].property_summaries = property_summaries
          }
          this.layers[source] = window.L.geoJSON(JSON.parse(this.site.spec.map._raw[source]), {
            pointToLayer: (point, coords) => window.L.circleMarker(coords),
            onEachFeature: l => {
              const props = l.properties
              if (props) {
                Object.keys(props).forEach(f => {
                  const v = props[f]
                  if ('number' === typeof v) {
                    if (!(f in property_summaries)) property_summaries[f] = [Infinity, -Infinity, 0]
                    if (v < property_summaries[f][0]) property_summaries[f][0] = v
                    if (v > property_summaries[f][1]) property_summaries[f][1] = v
                  }
                })
              }
            },
          }).on('mouseover', (l: LeafletMouseEvent) => {
            const layer = l.propagatedFrom
            if (layer && !layer._tooltip) {
              const props = layer.feature && layer.feature.properties
              if (props) {
                const e = document.createElement('table')
                Object.keys(props).forEach(f => {
                  const v = props[f],
                    r = document.createElement('tr')
                  r.appendChild(document.createElement('td'))
                  r.appendChild(document.createElement('td'))
                  ;(r.firstElementChild as HTMLElement).innerText = f
                  ;(r.firstElementChild as HTMLElement).innerText = v
                  e.appendChild(r)
                })
                layer.bindTooltip(e)
                layer.openTooltip()
              }
            }
          })
          Object.keys(property_summaries).forEach(f => {
            property_summaries[f][2] = property_summaries[f][1] - property_summaries[f][0]
            if (!property_summaries[f][2]) delete property_summaries[f]
          })
          this.site.maps.overlay_property_selectors.forEach(u => {
            if (!(source in u.option_sets)) {
              fill_overlay_properties_options(u, source, u.option_sets)
              u.dataset = source
              u.variable = ''
            }
          })
        }
        this.site.maps.overlay_property_selectors.forEach(u => {
          u.dataset = source
          this.site.conditionals.options(u)
        })
        this.overlay.clearLayers()
        let n = 0
        const summaries = this.site.spec.settings.circle_property && this.site.maps.queue[source].property_summaries,
          prop_summary = summaries && summaries[this.site.spec.settings.circle_property as string]
        this.layers[source].eachLayer((l: Circle) => {
          if (o.filter) {
            for (let i = o.filter.length; i--; ) {
              if (!o.filter[i].check(l.feature.properties[o.filter[i].feature], o.filter[i].value)) return
            }
          }
          n++
          l.setRadius(
            prop_summary
              ? ((l.feature.properties[this.site.spec.settings.circle_property as string] - prop_summary[0]) /
                  prop_summary[2] +
                  0.5) *
                  (this.site.spec.settings.circle_radius as number)
              : (this.site.spec.settings.circle_radius as number)
          ).setStyle({
            weight: this.site.spec.settings.polygon_outline as number,
            color: 'white',
            opacity: 0.5,
            fillOpacity: 0.5,
            fillColor: 'black',
          })
          l.addTo(this.overlay)
        })
        if (n) this.overlay_control.addTo(this.map)
      } else return this.retrieve_layer(o.source[i] as LayerSource, this.show_overlay.bind(null, o, time))
    }
  }
}
