import DataHandler from '../data_handler/index'
import {Conditionals, DataSets, MapInfo, Query, RegisteredElements, SiteElement, SiteSpec} from '../types'
import {defaults} from './defaults'
import BaseInput from './elements/index'
import {GlobalView} from './global_view'
import {patterns} from './patterns'
import {storage} from './storage'
import {Subscriptions} from './subscriptions'
import * as conditionals from './conditionals'
import * as utils from './utils'
import {palettes} from './palettes'
import {Select} from './elements/select'
import {Combobox} from './elements/combobox'
import {InputNumber} from './elements/number'
import {SiteDataView} from './elements/dataview'
import {Page} from './page'

type Queue = {
  timeout: NodeJS.Timer | number
  elements: Map<string, boolean>
}

type Dependency = {
  id: string
  type: 'rule' | 'update' | keyof Conditionals | keyof BaseInput
  conditional?: keyof Conditionals
  uid?: string
  rule?: number
}

type Tree = {
  _n: {children: number; parents: number}
  children: {[index: string]: Tree}
  parents: {[index: string]: Tree}
}

const elements = {
  combobox: Combobox,
  select: Select,
  number: InputNumber,
  virtual: InputNumber,
}

export default class Community {
  spec: SiteSpec
  storage = storage
  patterns = patterns
  palettes = palettes
  conditionals: Conditionals
  data: DataHandler
  page: Page
  view: GlobalView
  subs: Subscriptions
  registered_elements: Map<string, SiteElement> = new Map()
  defaults = defaults
  dataviews: {[index: string]: SiteDataView} = {}
  inputs: RegisteredElements = {}
  dependencies: {[index: string]: Dependency[]} = {}
  url_options: {[index: string]: boolean | string} = {}
  queue: Queue = {timeout: 0, elements: new Map()}
  tree: {[index: string]: Tree} = {}
  maps: MapInfo = {
    queue: {},
    waiting: {},
    overlay_property_selectors: [],
  }
  meta = {
    retain_state: true,
    lock_after: '',
  }
  state = ''
  query = ''
  parsed_query: Query = {}
  endpoint?: string
  constructor(spec: SiteSpec) {
    if (spec) {
      this.spec = spec
      spec.active = this
    }
    this.query = window.location.search.replace('?', '')
    const bound_conditionals: any = {}
    Object.keys(conditionals).forEach(
      k => (bound_conditionals[k] = conditionals[k as keyof typeof conditionals].bind(this))
    )
    this.conditionals = bound_conditionals
    // register input elements
    console.log('loaded')
    if (this.spec.dataviews) {
      this.defaults.dataview = Object.keys(this.spec.dataviews)[0]
    } else {
      this.spec.dataviews = {}
      this.spec.dataviews[this.defaults.dataview] = {}
    }
    this.init = this.init.bind(this)
    this.run_queue = this.run_queue.bind(this)
    this.data = new DataHandler(this.spec, defaults, this.data as unknown as DataSets, {
      init: this.init.bind(this),
      onload: () => {
        if (this.data.inited) clearTimeout(this.data.inited.load_screen as NodeJS.Timeout)
        setTimeout(this.drop_load_screen.bind(this), 600)
        delete this.data.onload
      },
      data_load: () => {
        Object.keys(this.dependencies).forEach(this.request_queue)
      },
    })
  }
  init() {
    this.subs = new Subscriptions(this.inputs)
    this.view = new GlobalView(this)
    Object.keys(this.spec.dataviews).forEach(id => new SiteDataView(this, id, this.spec.dataviews[id]))
    new Page(this)
    if (this.data.variables) {
      const variable = Object.keys(this.data.variables)
      this.defaults.variable = variable[variable.length - 1]
    }
    if (!this.spec.map) this.spec.map = {}
    if (!this.spec.map._overlay_property_selectors) this.spec.map._overlay_property_selectors = []
    document.querySelectorAll('.auto-input').forEach((e: HTMLElement) => {
      if (e.dataset.autotype in elements) {
        const u = new elements[e.dataset.autotype as keyof typeof elements](e, this)
        this.registered_elements.set(u.id, u)
        this.inputs[u.id] = u
      }
    })
  }
  global_update() {
    this.meta.retain_state = false
    this.queue.elements.forEach(this.request_queue)
  }
  global_reset() {
    this.meta.retain_state = false
    this.registered_elements.forEach((u, k) => {
      if (!u.setting && u.reset) {
        u.reset()
        this.request_queue(k)
      }
    })
  }
  clear_storage() {
    if (window.localStorage) storage.perm.removeItem(storage.name)
    window.location.reload()
  }
  request_queue(waiting: boolean | string | number, id?: string | number) {
    if ('boolean' !== typeof waiting) {
      id = waiting
      waiting = false
    }
    id = id + ''
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
      const d = this.refresh_conditions(k) as string
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
          dd = c.dataset ? (this.valueOf(c.dataset) as string) : view ? view.get.dataset() : v
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
            if ('function' === typeof fun) (fun as Function)()
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
                ri.parsed[k].forEach((u: Select) => {
                  u.e.classList.remove('locked')
                  utils.toggle_input(u, true)
                })
              } else if (k in this.inputs) {
                this.inputs[k].set(this.valueOf(ri.effects[k]) as string)
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
              ri.parsed[k].forEach((u: Select) => {
                u.e.classList.add('locked')
                utils.toggle_input(u)
              })
            } else if ('default' in ri) {
              if (k in this.inputs) {
                this.inputs[k].set(this.valueOf(ri.default) as string)
              }
            }
          })
        })
        if (id === this.meta.lock_after) this.meta.retain_state = true
      }
    }
  }
  valueOf(v: boolean | string | number | (string | number)[]): boolean | string | number | (string | number)[] {
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
        // if (!u.range || u.range[0] !== u.range[1]) {
        //   let v = u.value()
        //   if ('off_default' in u ? u.off_default : v !== u.default) {
        //     if (Array.isArray(v)) v = v.join(',')
        //     if ('' !== v && null != v && '-1' != v) s += (s ? '&' : '?') + k + '=' + v
        //   }
        // }
      }
    })
    if (this.data && this.view.filters.size) s += (s ? '&' : '?') + this.view.filter_state([])
    return window.location.protocol + '//' + window.location.host + window.location.pathname + s
  }
  gtag(...args: any) {
    if (this.spec.settings.tracking) (window as any).dataLayer.push(arguments)
  }
  drop_load_screen() {
    if (!this.data || this.data.inited) clearTimeout(+this.data.inited.load_screen)
    this.page.wrap.style.visibility = 'visible'
    this.page.load_screen.style.display = 'none'
    if (this.spec.tutorials && 'tutorial' in this.url_options) {
      setTimeout(
        this.page.tutorials.start_tutorial.bind(this.page.tutorials, {
          target: {dataset: {name: this.url_options.tutorial}},
        }),
        0
      )
    }
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
