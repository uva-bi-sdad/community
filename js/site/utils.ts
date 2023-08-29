import {MeasureInfo, SitePage, OptionSets, SiteElement} from '../types'
import type {Combobox} from './elements/combobox'
import type {Select} from './elements/select'
import {patterns} from './patterns'

export function set_description(e: HTMLElement, info: MeasureInfo) {
  let description = info.long_description || info.description || info.short_description || ''
  const subs: Map<string, string> = new Map()
  for (let l; (l = patterns.href.exec(description)); ) {
    subs.set(l[0], '<a href="' + l[1] + '" target="_blank" rel="noreferrer">' + (l.length > 2 ? l[2] : l[1]) + '</a>')
  }
  if (subs.size) {
    subs.forEach((f, r) => {
      description = description.replace(r, f)
    })
  }
  let has_html = patterns.has_html.test(description)
  if (has_html) {
    const tags = description.split(patterns.bracket_content)
    for (let i = tags.length; i--; ) {
      const t = tags[i]
      if (t && '/' !== t.substring(0, 1)) {
        const p = t.split(patterns.space),
          n = p.length
        has_html = patterns.html_tags.test(p[0])
        if (!has_html) break
        for (let a = 1; a < n; a++) {
          has_html = patterns.html_attributes.test(p[a])
          if (!has_html) break
        }
        if (!has_html) break
      }
    }
  }
  e[has_html ? 'innerHTML' : 'innerText'] = description
}

export function toggle_input(u: Combobox | Select, enable?: boolean) {
  if (enable && !u.e.classList.contains('locked')) {
    u.e.removeAttribute('disabled')
    u.e.classList.remove('disabled')
    // if (u instanceof Combobox) u.input_element.removeAttribute('disabled')
  } else {
    u.e.setAttribute('disabled', 'true')
    u.e.classList.add('disabled')
    // if (u instanceof Combobox) u.input_element.setAttribute('disabled', 'true')
  }
}

export function trigger_resize() {
  window.dispatchEvent(new Event('resize'))
}

export function content_resize(this: SitePage, e?: Event | boolean) {
  const full = e && 'boolean' === typeof e,
    f = this[full ? 'wrap' : 'content']
  if (!full) {
    f.style.top =
      (this.top_menu && 'open' === this.top_menu.dataset.state
        ? this.top_menu.getBoundingClientRect().height
        : this.content_bounds.top +
          ((!this.top_menu && !this.left_menu && !this.right_menu) ||
          (this.right_menu && 'open' === this.right_menu.dataset.state) ||
          (this.left_menu && 'open' === this.left_menu.dataset.state)
            ? 0
            : 40)) + 'px'
    f.style.bottom =
      this.content_bounds.bottom +
      (!this.bottom_menu || 'closed' === this.bottom_menu.dataset.state
        ? 0
        : this.bottom_menu.getBoundingClientRect().height) +
      'px'
    f.style.left =
      this.content_bounds.left +
      (!this.left_menu || 'closed' === this.left_menu.dataset.state
        ? 0
        : this.left_menu.getBoundingClientRect().width) +
      'px'
  }
  f.style.right =
    this.content_bounds[full ? 'outer_right' : 'right'] +
    (!this.right_menu || 'closed' === this.right_menu.dataset.state
      ? 0
      : this.right_menu.getBoundingClientRect().width) +
    'px'
}

export function fill_ids_options(u: Combobox | Select, d: string, out: OptionSets, onend?: Function) {
  if (!(d in u.site.data.sets)) {
    u.site.data.data_queue[d][u.id] = () => {
      u.loader && u.e.removeEventListener('click', u.loader)
      fill_ids_options(u, d, out, onend)
      u.set_current()
      u.current_set = d
    }
    return
  }
  out[d] = {options: [], values: {}, display: {}}
  const current = u.values,
    s = out[d].options as HTMLOptionElement[],
    values = out[d].values,
    disp = out[d].display,
    combobox = 'combobox' === u.type
  let ck = !u.sensitive && !!u.current_set,
    n = 0
  if (u.settings.group) {
    u.groups = {e: [], by_name: {}}
    if (combobox && u.settings.accordion) {
      u.listbox.classList.add('accordion')
      u.listbox.id = u.id + '-listbox'
    }
  }
  Object.keys(u.site.data.entities).forEach(k => {
    const entity = u.site.data.entities[k]
    if (d === entity.group) {
      if (ck && !(k in current)) {
        u.sensitive = true
        ck = false
      }
      if (u.groups) {
        let groups = entity.features[u.settings.group] || ['No Group']
        if (!Array.isArray(groups)) groups = [groups]
        for (let g = groups.length; g--; ) {
          const group: string = groups[g]
          if (!(group in u.groups.by_name)) {
            const e = document.createElement(combobox ? 'div' : 'optgroup')
            if (combobox) {
              const id = u.id + '_' + group.replace(patterns.seps, '-')
              let ee
              if (u.settings.accordion) {
                e.setAttribute('data-group', group)
                e.className = 'combobox-group accordion-item combobox-component'
                e.appendChild((ee = document.createElement('div')))
                ee.className = 'accordion-header combobox-component'
                ee.appendChild((ee = document.createElement('button')))
                ee.id = id + '-label'
                ee.innerText = group
                ee.type = 'button'
                ee.className = 'accordion-button combobox-component collapsed'
                ee.setAttribute('data-bs-toggle', 'collapse')
                ee.setAttribute('data-bs-target', '#' + id)
                ee.setAttribute('aria-expanded', 'false')
                ee.setAttribute('aria-controls', id)
                e.appendChild((ee = document.createElement('div')))
                ee.id = id
                ee.className = 'combobox-component accordion-collapse collapse'
                ee.setAttribute('data-bs-parent', '#' + u.id + '-listbox')
                ee.appendChild((ee = document.createElement('div')))
                ee.className = 'accordion-body combobox-component'
                ee.role = 'group'
                ee.setAttribute('aria-labelledby', id + '-label')
              } else {
                e.className = 'combobox-group combobox-component'
                e.id = id
                e.role = 'group'
                e.appendChild((ee = document.createElement('div')))
                ee.appendChild((ee = document.createElement('label')))
                ee.dataset.for = id
                ee.innerText = group
                ee.id = id + '-label'
                ee.className = 'combobox-group-label combobox-component'
              }
            } else {
              e.setAttribute('aria-label', group)
            }
            u.groups.by_name[group] = e
            u.groups.e.push(e)
          }
          const o = u.add(k, entity.features.name, true)
          o.setAttribute('data-group', group)
          if (combobox && u.settings.accordion) {
            u.groups.by_name[group].lastElementChild.lastElementChild.appendChild(o)
          } else {
            u.groups.by_name[group].appendChild(o)
          }
        }
      } else {
        s.push(u.add(k, entity.features.name) as HTMLOptionElement)
        values[k] = n
        disp[entity.features.name] = n++
      }
    }
  })
  if (u.settings.group) {
    n = 0
    Object.keys(u.groups.by_name).forEach(g => {
      u.groups.by_name[g].querySelectorAll(combobox ? '.combobox-option' : 'option').forEach((c: HTMLOptionElement) => {
        s.push(c)
        values[combobox ? c.dataset.value : c.value] = n
        disp[c.innerText] = n++
      })
    })
  }
  onend && onend()
}

export function fill_variables_options(u: Combobox | Select, d: string, out: OptionSets) {
  out[d] = {options: [], values: {}, display: {}}
  const current = u.values,
    s = out[d].options as HTMLOptionElement[],
    values = out[d].values,
    disp = out[d].display,
    combobox = 'combobox' === u.type
  let ck = !u.sensitive && !!u.current_set,
    n = 0
  if (u.settings.group) {
    u.groups = {e: [], by_name: {}}
    if (combobox && u.settings.accordion) {
      u.listbox.classList.add('accordion')
      u.listbox.id = u.id + '-listbox'
    }
  }
  const url_set = u.site.url_options[u.id] as string
  let ck_suffix = false
  if (url_set && !(url_set in u.site.data.variables)) {
    u.site.url_options[u.id] = url_set.replace(patterns.pre_colon, '')
    if (!(url_set in u.site.data.variables)) ck_suffix = true
  }
  u.site.data.info[d].schema.fields.forEach(m => {
    const v = u.site.data.variables[m.name]
    if (v && !v.is_time) {
      const l = u.site.data.format_label(m.name)
      if (ck && !(m.name in current)) {
        u.sensitive = true
        ck = false
      }
      if (u.groups) {
        let groups = (m.info && m.info[u.settings.group as keyof MeasureInfo]) || ['No Group']
        if (!Array.isArray(groups)) groups = [groups as string]
        for (let g = groups.length; g--; ) {
          const group: string = groups[g]
          if (!(group in u.groups.by_name)) {
            const e = document.createElement(combobox ? 'div' : 'optgroup')
            if (combobox) {
              const id = u.id + '_' + group.replace(patterns.seps, '-')
              let ee
              if (u.settings.accordion) {
                e.setAttribute('data-group', group)
                e.className = 'combobox-group accordion-item combobox-component'
                e.appendChild((ee = document.createElement('div')))
                ee.className = 'accordion-header combobox-component'
                ee.appendChild((ee = document.createElement('button')))
                ee.id = id + '-label'
                ee.innerText = group
                ee.type = 'button'
                ee.className = 'accordion-button combobox-component collapsed'
                ee.setAttribute('data-bs-toggle', 'collapse')
                ee.setAttribute('data-bs-target', '#' + id)
                ee.setAttribute('aria-expanded', 'false')
                ee.setAttribute('aria-controls', id)
                e.appendChild((ee = document.createElement('div')))
                ee.id = id
                ee.className = 'combobox-component accordion-collapse collapse'
                ee.setAttribute('data-bs-parent', '#' + u.id + '-listbox')
                ee.appendChild((ee = document.createElement('div')))
                ee.className = 'accordion-body combobox-component'
                ee.role = 'group'
                ee.setAttribute('aria-labelledby', id + '-label')
              } else {
                e.className = 'combobox-group combobox-component'
                e.role = 'group'
                e.appendChild((ee = document.createElement('div')))
                ee.appendChild((ee = document.createElement('label')))
                ee.dataset.for = id
                ee.innerText = group
                ee.id = id
                ee.className = 'combobox-group-label combobox-component'
              }
            } else {
              e.setAttribute('aria-label', group)
            }
            u.groups.by_name[group] = e
            u.groups.e.push(e)
          }
          const o = u.add(m.name, l, true, m)
          o.setAttribute('data-group', group)
          if (combobox && u.settings.accordion) {
            u.groups.by_name[group].lastElementChild.lastElementChild.appendChild(o)
          } else {
            u.groups.by_name[group].appendChild(o)
          }
        }
      } else {
        s.push(u.add(m.name, l, true, m) as HTMLOptionElement)
        s[n].id = u.id + '-option' + n
        values[m.name] = n
        disp[l] = n++
      }
      if (ck_suffix && url_set === m.name.replace(patterns.pre_colon, '')) {
        u.site.url_options[u.id] = m.name
        ck_suffix = false
      }
    }
  })
  if (u.settings.group) {
    n = 0
    Object.keys(u.groups.by_name).forEach(g => {
      u.groups.by_name[g].querySelectorAll(combobox ? '.combobox-option' : 'option').forEach((c: HTMLOptionElement) => {
        s.push(c)
        s[n].id = u.id + '-option' + n
        values[combobox ? c.dataset.value : c.value] = n
        disp[(c.firstChild && c.firstChild.textContent) || c.innerText] = n++
      })
    })
  }
  if (!u.settings.clearable && !(u.default in u.site.data.variables)) u.default = u.site.defaults.variable
}

export function fill_overlay_properties_options(u: Combobox | Select, source: string, out: OptionSets) {
  out[source] = {options: [], values: {}, display: {}}
  const current = u.values,
    s = out[source].options as HTMLOptionElement[],
    values = out[source].values,
    disp = out[source].display,
    combobox = 'combobox' === u.type
  let ck = !u.sensitive && !!u.current_set,
    n = 0
  if (u.settings.group) {
    u.groups = {e: [], by_name: {}}
  }
  Object.keys(u.site.maps.queue[source].property_summaries).forEach(v => {
    const l = u.site.data.format_label(v)
    if (ck && !(l in current)) {
      u.sensitive = true
      ck = false
    }
    s.push(u.add(v, l) as HTMLOptionElement)
    s[n].id = u.id + '-option' + n
    values[v] = n
    disp[l] = n++
  })
}

export function fill_levels_options(u: Combobox | Select, d: string, v: string, out: OptionSets) {
  const m = u.site.data.variables[v].info[d],
    t = 'string' === m.type ? 'levels' : 'ids',
    l = m[t]
  if (l) {
    const k = d + v
    out[k] = {options: [], values: {}, display: {}}
    const current = u.values,
      s = out[k].options as HTMLOptionElement[],
      values = out[k].values,
      disp = out[k].display
    let ck = !u.sensitive && !!u.current_set,
      n = 0
    Object.keys(l).forEach(k => {
      const lk = l[k]
      if (ck && !(k in current)) {
        u.sensitive = true
        ck = false
      }
      s.push(u.add(lk.id, lk.name, true) as HTMLOptionElement)
      values[lk.id] = n
      disp[lk.name] = n++
    })
  } else if ('ids' === t) {
    u.site.data.data_queue[d][u.id] = function () {
      return fill_levels_options(u, d, v, out)
    }
  }
}

export function tooltip_trigger(this: SiteElement): void {
  if (this.site.spec.settings.hide_tooltips || this.id === this.site.page.tooltip.showing) return void 0
  const tooltip = this.site.page.tooltip
  tooltip.showing = this.id
  ;(tooltip.e.firstElementChild as HTMLElement).innerText = this.note
  tooltip.e.classList.remove('hidden')
  const p = this.wrapper.getBoundingClientRect(),
    t = tooltip.e.getBoundingClientRect()
  tooltip.e.style.left = Math.max(0, Math.min(p.x, p.x + p.width / 2 - t.width / 2)) + 'px'
  tooltip.e.style.top = p.y + (p.y < t.height ? p.height + 5 : -t.height - 5) + 'px'
}

export function tooltip_clear(this: SiteElement, e: MouseEvent) {
  const target = e.target as HTMLElement
  if (
    this.site.page.tooltip.showing &&
    ('blur' === e.type || this.site.page.tooltip.showing !== (target.dataset.of || target.id))
  ) {
    this.site.page.tooltip.showing = ''
    this.site.page.tooltip.e.classList.add('hidden')
  }
}
