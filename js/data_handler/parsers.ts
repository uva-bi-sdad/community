import {patterns} from './patterns'
import {Filter, Query, RawQuery, UnparsedObject} from '../types'
import * as params from './export_params'
import {group_checks} from './checks'

export function query(q: RawQuery): Query {
  const f: UnparsedObject = JSON.parse(JSON.stringify(params.defaults))
  if ('string' === typeof q) {
    if ('?' === q[0]) q = q.substring(1)
    const aq = q.split('&')
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
        if (patterns.operator_start.test(k) && k[k.length - 1] in this.checks) {
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
          if (tf.value) {
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
          tf.check = group_checks[tf.operator].bind(tf.value || tf.value)
          f.feature_conditions.push(tf)
        } else if (tf.name in this.variables) {
          tf.check = (
            tf.time_component
              ? function (d: number | number[], adj: number) {
                  const multi = 'number' !== typeof d,
                    i = this.condition.component - adj
                  return multi
                    ? this.check(d[i], this.condition.value)
                    : !i
                    ? this.check(d, this.condition.value)
                    : false
                }
              : function (s: {[index: string]: string}) {
                  return this.check(s[this.condition.component], this.condition.value)
                }
          ).bind({check: this.checks[tf.operator], condition: tf})
          if (-1 === f.variables.filter_by.indexOf(tf.name)) f.variables.filter_by.push(tf.name)
          f.variables.conditions.push(tf)
        }
      }
    })
  if (!('time_range' in f)) f.time_range = [0, this.meta.overall.value.length ? this.meta.overall.value.length - 1 : 0]
  return f as Query
}
