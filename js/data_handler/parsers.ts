import {patterns} from './patterns'
import {Filter, MeasureInfo, MeasureInfos, Query, UnparsedObject} from '../types'
import * as params from './export_params'
import {group_checks} from './checks'
import DataHandler from '.'

const ps = {
  any: /\{(?:categor|variant)/,
  category: /\{categor(?:y|ies)(\.[^}]+?)?\}/g,
  variant: /\{variants?(\.[^}]+?)?\}/g,
  all: /\{(?:categor(?:y|ies)|variants?)(\.[^}]+?)?\}/g,
  desc: /description$/,
}

function replace_dynamic(e: string, p: RegExp, s: UnparsedObject, v?: UnparsedObject, d = 'default'): string {
  p.lastIndex = 0
  for (let m, k; (m = p.exec(e)); ) {
    const ss = v && 'v' === m[0].substring(1, 2) ? v : s
    k = m[1] ? m[1].substring(1) : d
    if (!(k in ss)) {
      if ('description' in ss && ps.desc.test(k)) {
        k = d = 'description'
      } else if (k === d) {
        k = 'default'
      }
    }
    const r = ss[k]
    if (r && 'string' === typeof r) {
      while (e.includes(m[0])) e = e.replace(m[0], r)
      p.lastIndex = 0
    }
  }
  return e
}

function prepare_source(name: string, o: UnparsedObject, s: UnparsedObject, p: RegExp): UnparsedObject {
  const r: UnparsedObject = {name: name}
  Object.keys(o).forEach(n => {
    const e = o[n]
    r[n] = 'string' === typeof e ? replace_dynamic(e, p, s) : e
  })
  if (!('default' in r)) r.default = name
  return r
}

export function measure_info(info: MeasureInfos): MeasureInfos {
  Object.keys(info).forEach(name => {
    if (ps.any.test(name)) {
      const base = info[name] as MeasureInfo
      const bn = Object.keys(base)
      if (base.categories || base.variants) {
        const categories: {[index: string]: any} = Array.isArray(base.categories) ? {} : base.categories || {}
        const variants: {[index: string]: any} = Array.isArray(base.variants) ? {} : base.variants || {}
        const cats: string[] = Array.isArray(base.categories) ? base.categories : Object.keys(categories)
        if (!cats.length) cats.push('')
        const vars: string[] = Array.isArray(base.variants) ? base.variants : Object.keys(variants)
        if (!vars.length) cats.push('')
        cats.forEach(cn => {
          vars.forEach(vn => {
            const cs = prepare_source(cn, categories[cn] || {}, variants[vn] || {}, ps.variant)
            const vs = prepare_source(vn, variants[vn] || {}, categories[cn] || {}, ps.category)
            const s = {...cs, ...vs}
            const r: any = {}
            bn.forEach((k: keyof MeasureInfo) => {
              if ('categories' !== k && 'variants' !== k) {
                const temp = base[k]
                r[k] = 'string' === typeof temp ? replace_dynamic(temp, ps.all, cs, vs, k) : temp
              }
            })
            Object.keys(s).forEach(k => {
              if (
                !(k in r) &&
                'default' !== k &&
                'name' !== k &&
                ('description' !== k || !(r.long_description || r.short_description))
              )
                r[k] = s[k]
            })
            info[replace_dynamic(name, ps.all, cs, vs)] = r as MeasureInfo
          })
        })
      }
    }
  })
  return info
}

export function query(this: DataHandler, q: any): Query {
  const f: UnparsedObject = JSON.parse(JSON.stringify(params.defaults))
  if ('string' === typeof q) {
    if ('?' === q[0]) q = q.substring(1)
    const aq: string[] = q.split('&')
    q = {}
    aq.forEach(aqi => {
      const a = aqi.split('=')
      q[a[0]] = a.length > 1 ? a[1] : ''
    })
  }
  q &&
    Object.keys(q).forEach(k => {
      if ('include' === k || 'exclude' === k || k in f) {
        f[k] = q[k]
      } else {
        let a: string[] = []
        if (patterns.single_operator.test(k)) {
          a = k.replace(patterns.single_operator, '$1=$2').split('=')
          if (a.length > 1) {
            k = a[0]
            q[k] = a[1]
          }
        }
        const aq = patterns.component.exec(k),
          tf: Filter = {
            name: k.replace(patterns.greater, '>').replace(patterns.less, '<'),
            component: 'mean',
            operator: '=',
            value: patterns.number.test(q[k]) ? Number(q[k]) : q[k],
            time_component: false,
            check: () => false,
          }
        if ('object' === typeof q[k]) {
          if ('component' in q[k]) tf.component = q[k].component
          if ('operator' in q[k]) tf.operator = q[k].operator
          if ('value' in q[k]) tf.value = q[k].value
        }
        k = tf.name
        if (aq) {
          if (-1 !== params.options.filter_components.indexOf(aq[2])) {
            tf.component = aq[2]
            tf.name = aq[1]
          } else if (patterns.number.test(aq[2])) {
            const time = Number(aq[2])
            const i = time > 0 && time < this.meta.overall.value.length ? time : this.meta.overall.value.indexOf(time)
            if (-1 !== i) {
              tf.time_component = true
              tf.component = i
              tf.name = aq[1]
            }
          }
        }
        if (patterns.operator_start.test(k) && k[k.length - 1] in DataHandler.checks) {
          tf.operator = k[k.length - 1]
          if (!a.length) tf.operator += '='
          if (k === tf.name) tf.name = k.substring(0, k.length - 1)
        }
        if (undefined === tf.value || '-1' == tf.value) return
        if (
          ('=' === tf.operator || '!' === tf.operator) &&
          'string' === typeof tf.value &&
          patterns.comma.test(tf.value)
        ) {
          tf.value = tf.value.split(',')
          tf.operator = '=' === tf.operator ? 'includes' : 'excludes'
        }
        if ('time_range' === tf.name) {
          if (Array.isArray(tf.value)) {
            f.time_range = [
              this.meta.overall.value.indexOf(Number(tf.value[0])),
              this.meta.overall.value.indexOf(Number(tf.value[1])),
            ]
          } else {
            const i = this.meta.overall.value.indexOf(Number(tf.value))
            f.time_range =
              '=' === tf.operator ? [i, i] : '>' === tf.operator ? [i, this.meta.overall.value.length - 1] : [0, i]
          }
          if (-1 === f.time_range[0]) f.time_range[0] = 0
          if (-1 === f.time_range[1])
            f.time_range[1] = this.meta.overall.value.length ? this.meta.overall.value.length - 1 : 0
        } else if ('dataset' === tf.name) {
          f.dataset = tf
        } else if (tf.name in this.features) {
          if ('id' === tf.name && !tf.value) tf.value = String(tf.value).split(',')
          tf.check = group_checks[tf.operator].bind(tf.value)
          f.feature_conditions.push(tf)
        } else if (tf.name in this.variables) {
          tf.check = (
            tf.time_component
              ? function (this: {check: Function; condition: Filter}, d: number | number[], adj: number) {
                  const multi = 'number' !== typeof d,
                    i = 'number' === typeof this.condition.component ? this.condition.component - adj : 0
                  return multi
                    ? this.check(d[i], this.condition.value)
                    : !i
                    ? this.check(d, this.condition.value)
                    : false
                }
              : function (this: {check: Function; condition: Filter}, s: {[index: string]: string}) {
                  return this.check(s[this.condition.component], this.condition.value)
                }
          ).bind({check: DataHandler.checks[tf.operator], condition: tf})
          if (-1 === f.variables.filter_by.indexOf(tf.name)) f.variables.filter_by.push(tf.name)
          f.variables.conditions.push(tf)
        }
      }
    })
  if (!('time_range' in f)) f.time_range = [0, this.meta.overall.value.length ? this.meta.overall.value.length - 1 : 0]
  return f as Query
}
