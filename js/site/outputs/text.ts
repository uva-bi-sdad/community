import DataHandler from '../../data_handler/index'
import type {SiteCondition} from '../../types'
import type Community from '../index'
import {tooltip_clear, tooltip_trigger} from '../utils'
import {BaseOutput} from './index'

type Text = {
  text: string[]
  parts: HTMLElement
  button?: {[index: string]: {text: string[]; type: string; target: string | string[]; trigger: () => void}}
  condition?: SiteCondition[]
}
type TextSpec = {
  text: Text[]
  condition?: SiteCondition[]
}

export class OutputText extends BaseOutput {
  type: 'text'
  spec: TextSpec
  text: Text[] | Text[][]
  condition: SiteCondition[]
  depends: Map<string, SiteCondition> = new Map()
  constructor(e: HTMLElement, site: Community) {
    super(e, site)
    this.text = this.spec.text
    this.condition = this.spec.condition
  }
  init() {
    this.text.forEach(oi => {
      if (Array.isArray(oi)) {
        this.e.appendChild(document.createElement('span'))
        oi.forEach(this.prep)
      } else {
        this.prep(oi)
        this.e.appendChild(oi.parts)
      }
    })
    this.condition.forEach(c => {
      if (c.id in this.site.inputs) this.site.add_dependency(c.id, {type: 'display', id: this.id})
    })
    this.depends.forEach(d => this.site.add_dependency(d.id, {type: 'update', id: this.id}))
    this.update()
  }
  update() {
    this.depends.forEach(d => {
      d.parsed = this.site.valueOf(d.id) as string
      if (d.parsed in this.site.data.entities) {
        d.parsed = this.site.data.entities[d.parsed].features.name
      }
    })
    this.text.forEach((o, i) => {
      let pass = true,
        s: Text
      if (Array.isArray(o)) {
        for (let t = o.length; t--; ) {
          if ('condition' in o[t]) {
            for (let c = o[t].condition.length; c--; ) {
              pass = o[t].condition[c].check()
              if (!pass) break
            }
          }
          if (pass) {
            s = o[t]
            break
          }
        }
      } else {
        if ('condition' in o) {
          for (let t = o.condition.length; t--; ) {
            pass = o.condition[t].check()
            if (!pass) break
          }
        }
        if (pass) s = o
      }
      if (pass) {
        s.text.forEach((k, i) => {
          if (Array.isArray(k)) {
            k.forEach(ki => {
              if (
                'default' === ki.id ||
                DataHandler.checks[ki.type](this.site.valueOf(ki.id), this.site.valueOf(ki.value))
              )
                k = ki.text
            })
          }
          if (this.depends.has(k)) {
            ;(s.parts.children[i] as HTMLElement).innerText = this.depends.get(k).parsed
          } else if (k in s.button) {
            let text = ''
            s.button[k].text.forEach(b => {
              text = (this.depends.has(b) ? this.depends.get(b).parsed : b) + text
            })
            ;(s.parts.children[i] as HTMLElement).innerText = text
          } else (s.parts.children[i] as HTMLElement).innerText = k
        })
        if (Array.isArray(this.text[i])) {
          this.e.children[i].innerHTML = ''
          this.e.children[i].appendChild(s.parts)
        } else s.parts.classList.remove('hidden')
      } else s.parts.classList.add('hidden')
    })
  }
  prep(text: Text) {
    if (!('button' in text)) text.button = {}
    if ('string' === typeof text.text) text.text = [text.text]
    text.parts = document.createElement('span')
    text.text.forEach(k => {
      if (k in text.button) {
        const p = text.button[k],
          button = document.createElement('button')
        text.parts.appendChild(button)
        button.type = 'button'
        p.trigger = tooltip_trigger.bind({id: this.id + p.text, note: p.target, wrapper: button})
        if ('note' === p.type) {
          button.setAttribute('aria-description', p.target as string)
          button.setAttribute('data-of', this.id + p.text)
          button.className = 'has-note'
          button.addEventListener('mouseover', p.trigger)
          button.addEventListener('focus', p.trigger)
          button.addEventListener('blur', tooltip_clear)
        } else {
          button.className = 'btn btn-link'
          if (!Array.isArray(p.target)) p.target = [p.target]
          const m = new Map()
          p.target.forEach(t => {
            const u = this.site.inputs[t],
              k = p.type as keyof typeof u
            if (u && 'function' === typeof u[k]) m.set(t, u[k])
          })
          if (m.size) {
            button.setAttribute('aria-label', p.text.join(''))
            button.addEventListener(
              'click',
              function (this: Map<string, () => void>) {
                this.forEach(f => f())
              }.bind(m)
            )
          }
        }
      } else {
        text.parts.appendChild(document.createElement('span'))
      }
      // if (k in this.site.inputs) this.depends.set(k, {id: k, u: this.site.inputs[k], parsed: ''})
    })
    if ('condition' in text) {
      for (let i = text.condition.length; i--; ) {
        const c = text.condition[i]
        if (c.id) {
          if ('default' === c.id) {
            c.check = function () {
              return true
            }
          } else {
            this.depends.set(c.id, c)
            c.site = this.site
            c.check = function (this: SiteCondition) {
              return (
                'default' === this.id ||
                DataHandler.checks[this.type](this.site.valueOf(this.id), this.site.valueOf(this.value))
              )
            }.bind(c)
          }
        }
      }
    }
  }
}
