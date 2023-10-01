import type {MeasureInfo, MeasureSource, OptionSets, ResourceField, SlimNote} from '../types'
import type {InputCombobox} from './inputs/combobox'
import type {SiteInputs} from './inputs/index'
import type {InputSelect} from './inputs/select'
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

export function toggle_input(u: InputCombobox | InputSelect, enable?: boolean) {
  if (enable && !u.e.classList.contains('locked')) {
    u.e.removeAttribute('disabled')
    u.e.classList.remove('disabled')
    if ('combobox' === u.type) u.input_element.removeAttribute('disabled')
  } else {
    u.e.setAttribute('disabled', 'true')
    u.e.classList.add('disabled')
    if ('combobox' === u.type) u.input_element.setAttribute('disabled', 'true')
  }
}

export function fill_ids_options(u: InputCombobox | InputSelect, d: string, out: OptionSets, onend?: Function) {
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
    out[d].groups = {e: [], by_name: {}}
    if (combobox && u.settings.accordion) {
      u.listbox.classList.add('accordion')
      u.listbox.id = u.id + '-listbox'
    }
  }
  const ugroup = out[d].groups
  Object.keys(u.site.data.entities).forEach(k => {
    const entity = u.site.data.entities[k]
    if (d === entity.group) {
      if (ck && !(k in current)) {
        u.sensitive = true
        ck = false
      }
      if (ugroup) {
        let groups = entity.features[u.settings.group] || ['No Group']
        if (!Array.isArray(groups)) groups = [groups]
        for (let g = groups.length; g--; ) {
          const group: string = groups[g]
          if (!(group in ugroup.by_name)) {
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
            ugroup.by_name[group] = e
            ugroup.e.push(e)
          }
          const o = u.add(k, entity.features.name, true)
          o.setAttribute('data-group', group)
          if (combobox && u.settings.accordion) {
            ugroup.by_name[group].lastElementChild.lastElementChild.appendChild(o)
          } else {
            ugroup.by_name[group].appendChild(o)
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
    Object.keys(ugroup.by_name).forEach(g => {
      ugroup.by_name[g].querySelectorAll(combobox ? '.combobox-option' : 'option').forEach((c: HTMLOptionElement) => {
        s.push(c)
        values[combobox ? c.dataset.value : c.value] = n
        disp[c.innerText] = n++
      })
    })
  }
  onend && onend()
}

export function fill_variables_options(u: InputCombobox | InputSelect, d: string, out: OptionSets) {
  out[d] = {options: [], values: {}, display: {}}
  const current = u.values,
    s = out[d].options as HTMLOptionElement[],
    values = out[d].values,
    disp = out[d].display,
    combobox = 'combobox' === u.type
  let ck = !u.sensitive && !!u.current_set,
    n = 0
  if (u.settings.group) {
    out[d].groups = {e: [], by_name: {}}
    if (combobox && u.settings.accordion) {
      u.listbox.classList.add('accordion')
      u.listbox.id = u.id + '-listbox'
    }
  }
  const url_set = u.site.url_options[u.id] as string,
    ugroup = out[d].groups
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
      if (ugroup) {
        let groups = (m.info && m.info[u.settings.group as keyof MeasureInfo]) || ['No Group']
        if (!Array.isArray(groups)) groups = [groups as string]
        for (let g = groups.length; g--; ) {
          const group = groups[g] as string
          if (!(group in ugroup.by_name)) {
            const e = document.createElement(combobox ? 'div' : 'optgroup')
            if (combobox) {
              const id = u.id + '_' + group.replace(patterns.seps, '-')
              let ee
              if (u.settings.accordion) {
                e.dataset.group = group
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
            ugroup.by_name[group] = e
            ugroup.e.push(e)
          }
          const o = u.add(m.name, l, true, m)
          o.dataset.group = group
          if (combobox && u.settings.accordion) {
            ugroup.by_name[group].lastElementChild.lastElementChild.appendChild(o)
          } else {
            ugroup.by_name[group].appendChild(o)
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
    Object.keys(ugroup.by_name).forEach(g => {
      ugroup.by_name[g].querySelectorAll(combobox ? '.combobox-option' : 'option').forEach((c: HTMLOptionElement) => {
        s.push(c)
        s[n].id = u.id + '-option' + n
        values[combobox ? c.dataset.value : c.value] = n
        disp[(c.firstChild && c.firstChild.textContent) || c.innerText] = n++
      })
    })
  }
  if (!u.settings.clearable && !(u.default in u.site.data.variables)) u.default = u.site.defaults.variable
}

export function fill_overlay_properties_options(u: InputCombobox | InputSelect, source: string, out: OptionSets) {
  out[source] = {options: [], values: {}, display: {}}
  const current = u.values,
    s = out[source].options as HTMLOptionElement[],
    values = out[source].values,
    disp = out[source].display,
    combobox = 'combobox' === u.type
  let ck = !u.sensitive && !!u.current_set,
    n = 0
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

export function fill_levels_options(u: InputCombobox | InputSelect, d: string, v: string, out: OptionSets) {
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

export function tooltip_trigger(this: SiteInputs | SlimNote): void {
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

export function make_summary_table(
  formatter: (v: number) => string | number,
  parent: HTMLElement,
  summary?: ResourceField,
  additional?: {[index: string]: string}
) {
  parent.classList.add('info-summary-wrapper')
  const table = document.createElement('table'),
    headers = document.createElement('tr'),
    row = document.createElement('tr')
  table.className = 'info-summary'
  table.appendChild(document.createElement('thead'))
  table.appendChild(document.createElement('tbody'))
  table.firstElementChild.appendChild(headers)
  table.lastElementChild.appendChild(row)
  if (additional) {
    Object.keys(additional).forEach(h => {
      const th = document.createElement('th'),
        td = document.createElement('td')
      headers.appendChild(th)
      th.innerText = h
      row.appendChild(td)
      td.innerText = additional[h]
    })
  }
  ;['NAs', 'Min', 'Q1', 'Mean', 'Median', 'Q3', 'Max'].forEach(h => {
    const lower = h.toLowerCase() as keyof ResourceField
    if (!summary || lower in summary) {
      const th = document.createElement('th'),
        td = document.createElement('td')
      headers.appendChild(th)
      th.innerText = h
      row.appendChild(td)
      td.innerText = summary ? formatter(summary[lower] as number) + '' : 'NA'
    }
  })
  parent.appendChild(table)
  return table
}

export function make_variable_source(s: MeasureSource, table?: boolean) {
  const e = document.createElement(table ? 'tr' : 'div')
  let div = document.createElement('div'),
    a = document.createElement('a'),
    span = document.createElement('span'),
    td = document.createElement('td'),
    p = document.createElement('p')
  if (table) {
    if (s.name) {
      e.appendChild(td)
      if (s.url) {
        td.appendChild(a)
        a.target = '_blank'
        a.rel = 'noreferrer'
        a.href = s.url
        a.innerText = s.name
      } else {
        td.appendChild(span)
        span.innerText = s.name
      }
    }
    if (s.date_accessed) {
      e.appendChild((td = document.createElement('td')))
      td.appendChild((span = document.createElement('span')))
      span.innerText = s.date_accessed
    }
  } else {
    e.className = 'card'
    if (s.name) {
      e.appendChild(div)
      div.className = 'card-header'
      if (s.url) {
        div.appendChild(a)
        a.target = '_blank'
        a.rel = 'noreferrer'
        a.href = s.url
        a.innerText = s.name
      } else {
        div.appendChild(span)
        span.innerText = s.name
      }
    }
    e.appendChild(document.createElement('div'))
    e.lastElementChild.className = 'card-body'
    if (s.location) {
      e.lastElementChild.appendChild(p)
      p.appendChild((span = document.createElement('span')))
      span.innerText = 'Location: '
      p.appendChild((span = document.createElement('span')))
      if (s.location_url) {
        span.appendChild((a = document.createElement('a')))
        a.target = '_blank'
        a.rel = 'noreferrer'
        a.href = s.location_url
        a.innerText = s.location
      } else {
        span.innerText = s.location
      }
    }
    if (s.date_accessed) {
      e.lastElementChild.appendChild((p = document.createElement('p')))
      p.appendChild((span = document.createElement('span')))
      span.innerText = 'Date Accessed: '
      p.appendChild((span = document.createElement('span')))
      span.innerText = s.date_accessed
    }
  }
  return e
}
