import DataHandler from '../data_handler'
import {ActiveDataview, Conditionals, DataSets, RegisteredElements, SitePage, SiteSpec} from '../types'
import {defaults} from './defaults'
import {BaseInput} from './elements'
import {GlobalView} from './global_view'
import {patterns} from './patterns'
import {storage} from './storage'
import {Subscriptions} from './subscriptions'
import * as conditionals from './conditionals'
import * as utils from './utils'
import {palettes} from './palettes'
import {init} from './initialize'

type Queue = {
  timeout: NodeJS.Timer | number
  elements: Map<string, boolean>
}

type Dependency = {
  id: string
  type: 'rule' | keyof Conditionals | keyof BaseInput
  conditional?: keyof Conditionals
  uid?: string
  rule?: number
}

type Tree = {
  _n: {children: number; parents: number}
  children: {[index: string]: Tree}
  parents: {[index: string]: Tree}
}

export default class Community {
  spec: SiteSpec
  storage = storage
  patterns = patterns
  palettes = palettes
  conditionals = conditionals as Conditionals
  init = init
  data: DataHandler
  page: SitePage
  view: GlobalView
  subs: Subscriptions
  registered_elements: Map<string, BaseInput> = new Map()
  defaults = defaults
  dataviews: {[index: string]: ActiveDataview} = {}
  inputs: RegisteredElements = {}
  dependencies: {[index: string]: Dependency[]} = {}
  url_options: {[index: string]: boolean | string} = {}
  queue: Queue = {timeout: 0, elements: new Map()}
  tree: {[index: string]: Tree} = {}
  meta = {
    retain_state: true,
    lock_after: '',
  }
  state = ''
  constructor(spec: SiteSpec) {
    this.spec = spec
    this.page = {
      load_screen: document.getElementById('load_screen'),
      wrap: document.getElementById('site_wrap'),
      navbar: document.querySelector('.navbar'),
      content: document.querySelector('.content'),
      overlay: document.createElement('div'),
      menus: document.getElementsByClassName('menu-wrapper'),
      panels: document.getElementsByClassName('panel'),
      script_style: document.createElement('style'),
      modal: {
        info: {
          init: false,
          e: document.createElement('div'),
          header: document.createElement('div'),
          body: document.createElement('div'),
          title: document.createElement('div'),
          description: document.createElement('div'),
          name: document.createElement('tr'),
          sources: document.createElement('div'),
          references: document.createElement('div'),
          origin: document.createElement('div'),
          source_file: document.createElement('div'),
        },
        filter: {
          init: false,
          e: document.createElement('div'),
          header: document.createElement('div'),
          conditions: document.createElement('div'),
          variable_filters: document.createElement('div'),
          entity_filters: document.createElement('div'),
          entity_inputs: {},
        },
      },
      content_bounds: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        outer_right: 0,
      },
      elementCount: 0,
      resize: function (e?: Event | boolean) {
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
      },
    }
    window.onload = () => {
      this.data = new DataHandler(this.spec, defaults, this.data as unknown as DataSets, {
        init: this.init,
        onload: function () {
          if (this.data.inited) clearTimeout(this.data.inited.load_screen)
          setTimeout(this.drop_load_screen, 600)
          delete this.onload
        },
        data_load: function (this: Community) {
          Object.keys(this.dependencies).forEach(this.request_queue)
        }.bind(this),
      })
      this.subs = new Subscriptions(this.inputs)
      this.view = new GlobalView(this)
    }
  }
  global_update() {
    this.meta.retain_state = false
    this.queue.elements.forEach(this.request_queue)
  }
  request_queue(waiting: boolean, id: string) {
    if (!waiting) {
      this.queue.elements.set(id, true)
      if (this.queue.timeout !== 0) clearTimeout(this.queue.timeout)
      this.queue.timeout = setTimeout(this.run_queue, 20)
      this.meta.lock_after = id
    }
  }
  run_queue() {
    if (this.queue.timeout !== 0) clearTimeout(this.queue.timeout)
    this.queue.timeout = -1
    this.queue.elements.forEach((_, k) => {
      const d = this.refresh_conditions(k)
      if (d) {
        if (!(k in this.data.data_queue[d])) this.data.data_queue[d][k] = this.run_queue
        return false
      }
      this.queue.elements.set(k, false)
    })
    let k = this.get_options_url()
    if (this.data.inited.first && k !== this.state) {
      this.state = k
      Object.keys(this.url_options).forEach(s => {
        const v = this.url_options[s]
        if ('string' === typeof v && patterns.embed_setting.test(s))
          k += '&' + s + '=' + ('navcolor' === s ? v.replace(patterns.hashes, '%23') : v)
      })
      if (!this.spec.settings.hide_url_parameters) {
        window.history.replaceState(Date.now(), '', k)
      }
      setTimeout(this.page.resize, 50)
    }
  }
  refresh_conditions(id: string) {
    if (id in this.dependencies) {
      const c = this.inputs[id],
        d = this.dependencies[id],
        r: number[] = [],
        v = c && c.value() + ''
      if (c && (!this.meta.retain_state || c.state !== v)) {
        const view = this.dataviews[c.view],
          dd = c.dataset ? this.valueOf(c.dataset) : view ? view.get.dataset() : v
        if (this.data.info && dd in this.data.loaded && !this.data.loaded[dd]) {
          if (!c.deferred) this.data.retrieve(dd, this.data.info[dd].site_file)
          return dd
        }
        c.state = v
        d.forEach(di => {
          if ('rule' === di.type) {
            if (-1 === r.indexOf(di.rule)) {
              r.push(di.rule)
            }
          } else if (di.conditional) {
            this.conditionals[di.conditional](this.inputs[di.id], c)
          } else {
            const fun = this.inputs[di.id][di.type as keyof BaseInput]
            if ('function' === typeof fun) {
              fun()
            }
          }
        })
        r.forEach(i => {
          let pass = false
          const ri = this.spec.rules[i],
            n = ri.condition.length
          for (let i = 0; i < n; i++) {
            const ck = ri.condition[i]
            pass = ck.check()
            if (ck.any && pass) break
          }
          Object.keys(ri.effects).forEach(k => {
            if (pass) {
              if ('display' === k) {
                ri.parsed[k].e.classList.remove('hidden')
              } else if ('lock' === k) {
                ri.parsed[k].forEach(u => {
                  u.e.classList.remove('locked')
                  utils.toggle_input(u, true)
                })
              } else if (k in this.inputs) {
                this.inputs[k].set(this.valueOf(ri.effects[k]))
              }
            } else if ('display' === k) {
              const e = ri.parsed[k]
              if (!e.e.classList.contains('hidden')) {
                e.e.classList.add('hidden')
                if (e.u && e.u.reset) e.u.reset()
                e.e.querySelectorAll('.auto-input').forEach(c => {
                  const input = this.inputs[c.id]
                  if (input && input.reset) input.reset()
                })
              }
            } else if ('lock' === k) {
              ri.parsed[k].forEach(u => {
                u.e.classList.add('locked')
                utils.toggle_input(u)
              })
            } else if ('default' in ri) {
              if (k in this.inputs) {
                this.inputs[k].set(this.valueOf(ri.default))
              }
            }
          })
        })
        if (id === this.meta.lock_after) this.meta.retain_state = true
      }
    }
  }
  valueOf(v: string | number | (string | number)[]): string | number | (string | number)[] {
    if ('string' === typeof v && v in this.inputs) {
      const u = this.inputs[v]
      if (u.value) v = this.valueOf(u.value())
    }
    return v
  }
  get_options_url() {
    let s = ''
    this.registered_elements.forEach((u, k) => {
      if (u.input && !patterns.settings.test(k)) {
        if (!u.range || u.range[0] !== u.range[1]) {
          let v = u.value()
          if ('off_default' in u ? u.off_default : v !== u.default) {
            if (Array.isArray(v)) v = v.join(',')
            if ('' !== v && null != v && '-1' != v) s += (s ? '&' : '?') + k + '=' + v
          }
        }
      }
    })
    if (this.data && this.view.filters.size) s += (s ? '&' : '?') + this.view.filter_state([])
    return window.location.protocol + '//' + window.location.host + window.location.pathname + s
  }
  gtag(...args: any) {
    if (this.spec.settings.tracking) (window as any).dataLayer.push(arguments)
  }
  add_dependency(id: string, o: Dependency): void {
    if (!(id in this.dependencies)) this.dependencies[id] = []
    if (!o.uid) o.uid = JSON.stringify(o)
    if (o.type in this.conditionals) {
      o.conditional = o.type as keyof Conditionals
    }
    const c = this.dependencies[id]
    for (let i = c.length; i--; ) if (o.uid === c[i].uid) return void 0
    c.push(o)
    if (!(id in this.tree)) this.tree[id] = {_n: {children: 0, parents: 0}, children: {}, parents: {}}
    if (!(o.id in this.tree)) this.tree[o.id] = {_n: {children: 0, parents: 0}, children: {}, parents: {}}
    this.tree[id].children[o.id] = this.tree[o.id]
    this.tree[id]._n.children++
    this.tree[o.id].parents[id] = this.tree[id]
    this.tree[o.id]._n.parents++
    c.sort((a, b) => {
      return !(a.id in this.tree) || !(b.id in this.tree)
        ? -Infinity
        : this.tree[a.id]._n.children - this.tree[b.id]._n.children
    })
    this.request_queue(false, id)
  }
}
