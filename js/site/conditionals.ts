import type Community from './index'
import DataHandler from '../data_handler/index'
import type {BaseInput} from './inputs/index'
import type {Combobox} from './inputs/combobox'
import type {InputNumber} from './inputs/number'
import {tooltip_icon_rule} from './static_refs'
import {fill_ids_options, fill_levels_options, fill_variables_options, toggle_input} from './utils'
import type {SiteDataView} from './dataview'
import type {OutputInfo} from './outputs/info'
import type {OutputPlotly} from './outputs/plotly'
import type {OutputMap} from './outputs/map'

export function setting(this: Community, u: BaseInput) {
  const current = this.spec.settings[u.setting],
    v = u.value() as typeof current,
    theme = v ? 'dark' : 'light'
  if (v !== this.spec.settings[u.setting]) {
    this.spec.settings[u.setting] = v
    if ('theme_dark' === u.setting) {
      v
        ? document.body.classList.replace('light-theme', 'dark-theme')
        : document.body.classList.replace('dark-theme', 'light-theme')
      if (this.spec.plotly) Object.keys(this.spec.plotly).forEach(k => (this.outputs[k] as OutputPlotly).update_theme())
      if (this.spec.map)
        Object.keys(this.spec.map).forEach(k => {
          const u = this.outputs[k] as OutputMap
          if (u && theme in u.tiles) {
            Object.keys(u.tiles).forEach(l => {
              if (theme !== l) u.tiles[l].removeFrom(u.map)
            })
            u.tiles[theme].addTo(u.map)
          }
        })
    } else if ('hide_url_parameters' === u.setting) {
      window.history.replaceState(
        Date.now(),
        '',
        this.spec.settings.hide_url_parameters
          ? window.location.protocol + '//' + window.location.host + window.location.pathname
          : this.get_options_url()
      )
    } else if ('hide_tooltips' === u.setting) {
      v ? this.page.script_style.sheet.insertRule(tooltip_icon_rule, 0) : this.page.script_style.sheet.deleteRule(0)
    } else if ('map_overlay' === u.setting) {
      Object.keys(this.spec.map).forEach(id => {
        if ('_' !== id[0]) {
          const mu = this.outputs[id] as OutputMap
          if (v) {
            mu.update()
          } else {
            mu.overlay.clearLayers()
            mu.overlay_control.remove()
          }
        }
      })
    } else if ('tracking' === u.setting) {
      if (v && this.spec.tag_id) {
        this.gtag('js', new Date())
        this.gtag('config', this.spec.tag_id)
        this.gtag('consent', 'default', {analytics_storage: 'denied'})
      }
      this.gtag('consent', 'update', {analytics_storage: v ? 'granted' : 'denied'})
    } else {
      this.global_update()
    }
    this.gtag('event', 'setting', {event_category: u.setting, event_label: v})
    this.storage.set(u.setting, this.spec.settings[u.setting])
  }
}
export function options(this: Community, u: Combobox) {
  const no_view = !u.view || !this.dataviews[u.view].selection,
    d = (this.valueOf(u.dataset || no_view ? '' : this.spec.dataviews[u.view].dataset) ||
      this.defaults.dataset) as string,
    va = this.valueOf(u.variable) as string,
    k = d + (va ? va : ''),
    combobox = 'combobox' === u.type
  if (!(k in u.option_sets)) {
    if (this.patterns.variable.test(u.optionSource)) {
      if ('number' === typeof u.default && -1 === u.default) u.default = this.defaults.variable
      fill_variables_options(u, d, u.option_sets)
    } else if (this.patterns.levels.test(u.optionSource)) {
      fill_levels_options(u, d, va, u.option_sets)
    } else if (this.patterns.ids.test(u.optionSource)) {
      fill_ids_options(u, d, u.option_sets)
    }
  }
  if (k in u.option_sets) {
    const fresh = k !== u.current_set && (u.sensitive || !u.current_set),
      c = u[combobox ? 'listbox' : 'e']
    if (fresh || u.filter || u.selection_subset) {
      if (fresh) {
        c.innerHTML = ''
        u.values = u.option_sets[k].values
        u.display = u.option_sets[k].display
        u.options = u.option_sets[k].options as HTMLDivElement[]
      }
      let ns = 0
      if ('ID' === u.variable || this.patterns.ids.test(u.optionSource)) {
        const value = u.value()
        let selection = -1 === value || '' === value ? u.subset : u.selection_subset,
          v = {}
        if (!no_view) {
          if (selection in this.inputs) selection = this.valueOf(selection) as string
          if ('siblings' === selection) {
            const rel = this.data.entity_tree && this.data.entity_tree[value as string]
            if (rel) {
              const parents = Object.keys(rel.parents)
              if (parents.length) {
                v = {}
                parents.forEach(id => {
                  v = {...v, ...this.data.entity_tree[id].children}
                })
              }
            }
          } else {
            v = this.dataviews[u.view].selection[selection]
          }
        }
        u.options.forEach((si: HTMLDivElement) => {
          if (fresh && !u.groups) c.appendChild(si)
          if (no_view || si.dataset.value in v) {
            si.classList.remove('hidden')
            ns++
          } else {
            si.classList.add('hidden')
          }
        })
      } else if (fresh) {
        u.options.forEach(si => {
          si.classList.remove('hidden')
          if (!u.groups) c.appendChild(si)
          ns++
        })
      } else ns++
      if (fresh && u.groups) u.groups.e.forEach(e => c.appendChild(e))
      toggle_input(u, !!ns)
      u.current_set = k
      if (fresh) {
        if (combobox) {
          u.source = []
        } else {
          ;(u.e as HTMLSelectElement).selectedIndex = -1
          u.source = ''
        }
        u.id in this.url_options
          ? u.set(this.url_options[u.id] as string | number)
          : u.state in u.values
          ? u.set(u.state)
          : u.reset()
      }
      if (u.filter) u.filter()
    }
  }
}
export async function min(this: Community, u: InputNumber, c: InputNumber) {
  let cv = c.value() as string | number,
    uv = u.value(),
    v = this.dataviews[u.view || c.view],
    variable
  if ('string' === typeof cv) {
    cv = this.patterns.minmax.test(cv) ? c.parsed.min : parseFloat(cv)
  }
  if (v && v.y) {
    variable = this.valueOf(v.y) as string
    if (variable in this.data.variables) {
      if (!v.time_range.time.length) await this.conditionals.time_range(v, u, true)
      cv = Math.max(v.time_range.time[0], cv)
    }
    u.update()
  }
  u.e.min = ('undefined' === typeof u.parsed.min ? cv : Math.max(u.parsed.min, cv)) + ''
  if (!u.e.value) {
    u.reset()
  } else if ('number' === typeof uv && isFinite(uv) && uv < cv) {
    u.set(cv)
  }
  if (u.min_indicator) (u.min_indicator.firstElementChild as HTMLElement).innerText = cv + ''
}
export async function max(this: Community, u: InputNumber, c: InputNumber) {
  let cv = c.value() as string | number,
    uv = u.value(),
    v = this.dataviews[u.view || c.view],
    variable: string
  if ('string' === typeof cv) {
    cv = this.patterns.minmax.test(cv) ? c.parsed.min : parseFloat(cv)
  }
  if (v && v.y) {
    variable = this.valueOf(v.y) as string
    if (variable in this.data.variables) {
      if (!v.time_range.time.length) await this.conditionals.time_range(v, u, true)
      cv = Math.min(v.time_range.time[1], cv)
    }
    u.update()
  }
  u.e.max = ('undefined' === typeof u.parsed.max ? cv : Math.min(u.parsed.max, cv)) + ''
  if (!u.e.value) {
    u.reset()
  } else if ('number' === typeof uv && isFinite(uv) && uv > cv) {
    u.set(cv)
  }
  if (u.max_indicator) (u.max_indicator.firstElementChild as HTMLElement).innerText = cv + ''
}
export function time_filters(this: Community, u: SiteDataView) {
  u.time_range.filtered[0] = Infinity
  u.time_range.filtered[1] = -Infinity
  const d = u.get.dataset(),
    time = this.data.meta.times[d],
    current = u.time_range.filtered_index + ''
  if (!this.data.inited[d]) return
  for (let i = time.n; i--; ) {
    let pass = false
    if (i >= u.time_range.index[0] && i <= u.time_range.index[1]) {
      for (let f = u.time_filters.length; f--; ) {
        const v: {[index: string]: number} = {},
          tf = u.time_filters[f]
        if (!(tf.value in v)) v[tf.value] = this.valueOf(tf.value) as number
        pass = DataHandler.checks[tf.type](time.value[i], v[tf.value])
        if (!pass) break
      }
    }
    u.times[i] = pass
    if (pass) {
      if (u.time_range.filtered[0] > time.value[i]) u.time_range.filtered[0] = time.value[i]
      if (u.time_range.filtered[1] < time.value[i]) u.time_range.filtered[1] = time.value[i]
    }
  }
  u.time_range.filtered_index = [
    u.time_range.index[0] + u.time_range.filtered[0] - u.time_range.time[0],
    u.time_range.index[1] + u.time_range.filtered[1] - u.time_range.time[1],
  ]
  if (current !== u.time_range.filtered_index + '') {
    const c = this.dependencies[u.id + '_filter']
    if (c)
      c.forEach(ci => {
        if ('update' === ci.type) {
          if (ci.id in this.inputs) {
            ;(this.inputs[ci.id] as InputNumber).update()
          } else {
            ;(this.outputs[ci.id] as OutputInfo).update()
          }
        } else if (ci.type in this.conditionals) {
          this.conditionals[ci.type as keyof typeof this.conditionals](this.inputs[ci.id], u)
        }
      })
  }
}
export async function time_range(this: Community, u: SiteDataView, c?: BaseInput, passive?: boolean) {
  const v = c && (c.value() as string),
    d = u.get.dataset(),
    tv = u.time ? (this.valueOf(u.time) as string) : this.defaults.time,
    t = tv in this.data.variables ? this.data.variables[tv].info[d].min : 1,
    s = this.dependencies[u.id + '_time'],
    variable = v in this.data.variables ? v : (this.valueOf(u.y) as string)
  let r = variable && (await this.data.get_variable(variable, u))
  if (r) {
    const reset = d + variable != u.time_range.dataset + u.time_range.variable
    const range = r.time_range[d]
    if (-1 !== range[0]) {
      u.time_range.dataset = d
      u.time_range.variable = variable
      u.time_range.index[0] = range[0]
      u.time_range.time[0] = u.time_range.filtered[0] = t + range[0]
      u.time_range.index[1] = range[1]
      u.time_range.time[1] = u.time_range.filtered[1] = t + range[1]
    }
    if (!passive && s) {
      s.forEach(si => {
        const su = this.inputs[si.id] as InputNumber,
          value = su.value() as number
        if ('min' === si.type) {
          if (reset || (isFinite(u.time_range.time[0]) && parseFloat(su.e.min) !== u.time_range.time[0])) {
            su.e.min = u.time_range.time[0] + ''
            if (reset || !this.meta.retain_state || u.time_range.time[0] > value) {
              su.current_default = u.time_range.time[0]
              su.set(su.current_default)
            }
          }
        } else if ('max' === si.type) {
          if (reset || (isFinite(u.time_range.time[1]) && parseFloat(su.e.max) !== u.time_range.time[1])) {
            su.e.max = u.time_range.time[1] + ''
            if (reset || !this.meta.retain_state || u.time_range.time[1] < value || value < u.time_range.time[0]) {
              su.current_default = u.time_range.time[1]
              su.set(su.current_default)
            }
          }
        }
      })
      this.conditionals.time_filters(u)
    }
  } else {
    u.time_range.dataset = d
    u.time_range.index[0] = 0
    u.time_range.time[0] = u.time_range.filtered[0] = 1
    u.time_range.index[1] = 0
    u.time_range.time[1] = u.time_range.filtered[1] = 1
  }
}
