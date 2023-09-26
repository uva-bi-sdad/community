import {BaseInput} from './index'
import type Community from '../index'
import {patterns} from '../patterns'
import type {Generic} from '../../types'

export class InputButton extends BaseInput {
  type: 'button'
  e: HTMLButtonElement
  target: string
  text: string
  api?: string
  notification: HTMLElement
  constructor(e: HTMLElement, site: Community) {
    super(e, site)
    this.update = this.update.bind(this)
    this.target = this.e.dataset.target
    if ('copy' === this.target) this.settings.endpoint = site.endpoint
    if ('filter' === this.target) {
      e.setAttribute('data-bs-toggle', 'modal')
      e.setAttribute('data-bs-target', '#filter_display')
      this.notification = document.createElement('span')
      this.notification.className = 'filter-notification hidden'
      e.parentElement.appendChild(this.notification)
      site.add_dependency('view.filter', {type: 'update', id: this.id})
      site.add_dependency('view.id', {type: 'update', id: this.id})
      if (site.data) this.update()
    } else
      e.addEventListener(
        'click',
        this.settings.effects
          ? 'export' === this.target || 'copy' === this.target
            ? () => {
                const f: {[index: string]: boolean | string | number | (string | number)[]} = {},
                  s = this.settings,
                  v = site.dataviews[s.dataview],
                  d = v && v.parsed.dataset
                Object.keys(s.query).forEach(k => (f[k] = site.valueOf(s.query[k])))
                if (v) {
                  if (!('include' in f) && v.y) f.include = site.valueOf(v.y)
                  if (!('id' in f) && v.ids) f.id = site.valueOf(v.ids)
                }
                if ('copy' === this.target || this.api) {
                  let q = []
                  if ('id' in f && '' !== f.id && -1 != f.id) {
                    q.push('id=' + f.id)
                  } else {
                    if (site.view.selected.length) q.push('id=' + site.view.selected.join(','))
                  }
                  if (v) {
                    if (!f.time_range && v.time_range.filtered_index + '' !== v.time_range.index + '') {
                      q.push(
                        'time_range=' +
                          site.data.meta.times[d].value[v.time_range.filtered_index[0]] +
                          ',' +
                          site.data.meta.times[d].value[v.time_range.filtered_index[1]]
                      )
                    }
                    if (!v.features) v.features = {}
                    Object.keys(v.features).forEach(k => {
                      if (!(k in f)) {
                        let fv = site.valueOf(v.features[k])
                        if (Array.isArray(fv)) fv = fv.join(',')
                        f[k] = fv
                        q.push(k + '=' + fv)
                      }
                    })
                    if (site.view.filters.size) site.view.filter_state(q, v.parsed.time_agg)
                  }
                  Object.keys(f).forEach(k => {
                    if (!patterns.exclude_query.test(k) && !(k in v.features)) q.push(k + '=' + f[k])
                  })
                  const k = s.endpoint + (q.length ? '?' + q.join('&') : '')
                  if (this.api) {
                    window.location.href = k
                  } else {
                    navigator.clipboard.writeText(k).then(
                      () => {
                        if ('Copied!' !== e.innerText) {
                          this.text = e.innerText
                          e.innerText = 'Copied!'
                          setTimeout(() => {
                            e.innerText = this.text
                          }, 500)
                          site.gtag('event', 'export', {event_category: 'api link'})
                        }
                      },
                      e => {
                        if (e !== this.e.innerText) {
                          this.text = this.e.innerText
                          this.e.innerText = e
                          setTimeout(() => {
                            this.e.innerText = this.text
                          }, 1500)
                        }
                      }
                    )
                  }
                } else {
                  if (v && 'selection' in v) {
                    if (!f.time_range)
                      f.time_range =
                        site.data.meta.times[d].value[v.time_range.filtered_index[0]] +
                        ',' +
                        site.data.meta.times[d].value[v.time_range.filtered_index[1]]
                    site.data.export(f as Generic, v.selection.all, true)
                  } else site.data.export(f as Generic, site.data.entities, true, true)
                  site.gtag('event', 'export', {event_category: 'download'})
                }
              }
            : () => {
                Object.keys(this.settings.effects).forEach(k => {
                  this.settings.effects[k] === '' || -1 == this.settings.effects[k]
                    ? site.inputs[k].reset()
                    : site.inputs[k].set(this.settings.effects[k])
                })
              }
          : 'refresh' === this.target
          ? site.global_update
          : 'reset_selection' === this.target
          ? site.global_reset
          : 'reset_storage' === this.target
          ? site.clear_storage
          : () => {
              if (this.target in site.inputs) site.inputs[this.target].reset()
            }
      )
  }
  update() {
    let n = +(0 !== this.site.view.selected.length)
    this.site.view.filters.forEach(f => (n += +f.active))
    if (n) {
      this.notification.innerText = n + ''
      this.notification.classList.remove('hidden')
    } else {
      this.notification.classList.add('hidden')
    }
  }
}
