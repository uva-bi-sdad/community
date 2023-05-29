import * as params from './export_params'
import {group_checks, export_checks} from './checks'
import {passes_filter, passes_feature_filter} from './filter_check'
import {patterns} from './patterns'
import * as row_writers from './row_writers'
import type {Query, Entity, Features, Entities} from '../types'

export async function exporter(query_string: string, entities: Entities, in_browser: boolean, all_data: boolean) {
  if (!in_browser) await this.data_ready
  const query: Query = this.parse_query(query_string)
  entities = entities || this.entities
  if (-1 === params.options.file_format.indexOf(query.file_format)) query.file_format = params.defaults.file_format
  if (!(query.table_format in row_writers)) query.table_format = params.defaults.table_format
  const res = {statusCode: 400, headers: {'Content-Type': 'text/plain; charset=utf-8'}, body: 'Invalid Request'},
    inc: string[] =
      query.include && query.include.length
        ? 'string' === typeof query.include
          ? query.include.split(',')
          : query.include
        : Object.keys(this.variables),
    exc = query.exclude || [],
    vars: string[] = [],
    feats: Features = query.features || JSON.parse(JSON.stringify(params.defaults.features)),
    rows: string[] = [],
    range = [Infinity, -Infinity],
    sep = 'csv' === query.file_format ? ',' : '\t',
    rw: Function = row_writers[query.table_format].bind(this),
    no_filter = !query.variables.filter_by.length,
    no_feature_filter = !query.feature_conditions.length,
    in_group: Function = !('dataset' in query)
      ? () => true
      : group_checks[query.dataset.operator].bind(query.dataset.value)
  inc.forEach((ii: string) => {
    if (ii in this.features && !(ii in feats)) {
      feats[ii] = this.format_label(ii)
    }
  })
  for (const k in export_checks)
    if (k in query) {
      const r: string = export_checks[k]('include' === k ? inc : query[k], this.variables)
      if (r) {
        res.body = 'Failed check for ' + k + ': ' + r
        return res
      }
    }
  Object.keys(this.variable_codes).forEach((k: string) => {
    if (-1 !== inc.indexOf(this.variable_codes[k].name) && -1 === exc.indexOf(this.variable_codes[k].name)) {
      vars.push(this.variable_codes[k].name)
      const tr: [number, number] = this.meta.ranges[this.variable_codes[k].name]
      if (tr[0] < range[0]) range[0] = tr[0]
      if (tr[1] > range[1]) range[1] = tr[1]
    }
  })
  if (query.time_range[0] < range[0]) query.time_range[0] = range[0]
  if (query.time_range[1] > range[1]) query.time_range[1] = range[1]
  rows.push(Object.keys(feats).join(sep))
  if ('wide' === query.table_format) {
    vars.forEach((vi: string) => {
      const tr: [number, number] = this.meta.ranges[vi],
        yn = Math.min(query.time_range[1], tr[1]) + 1
      for (let y = Math.max(query.time_range[0], tr[0]); y < yn; y++) {
        rows[0] += sep + vi + '_' + this.meta.overall.value[y]
      }
    })
  } else rows[0] += sep + 'time' + sep + ('mixed' === query.table_format ? vars : ['variable', 'value']).join(sep)
  let first_entity = ''
  Object.keys(entities).forEach((k: string) => {
    const e: Entity = entities[k]
    if (
      in_group(e.group) &&
      (no_feature_filter || passes_feature_filter(entities, k, query.feature_conditions)) &&
      (no_filter || passes_filter(e, query.time_range, query.variables, this.variables))
    ) {
      const r: string = rw(e, query.time_range, feats, vars, sep)
      if (r) {
        if (!first_entity) first_entity = k
        rows.push(r)
      }
    }
  })
  res.headers['Content-Type'] = 'text/' + (',' === sep ? 'csv' : 'plain') + '; charset=utf-8'
  res.body = rows.join('\n')
  const times: number[] = this.meta.overall.value,
    filename =
      'export_' +
      (in_browser && !all_data && first_entity
        ? entities[first_entity].group + '_'
        : query.dataset
        ? query.dataset.value + '_'
        : '') +
      (query.time_range[0] === query.time_range[1]
        ? times[query.time_range[0]]
        : times[query.time_range[0]] + '-' + times[query.time_range[1]]) +
      '_' +
      (1 === vars.length
        ? this.variables[vars[0]].meta.short_name.toLowerCase().replace(patterns.non_letter_num, '-')
        : vars.length + '-variables') +
      '_' +
      (rows.join('\n').split('\n').length - 1) +
      'x' +
      rows[0].split(sep).length
  if (in_browser) {
    const e = document.createElement('a')
    document.body.appendChild(e)
    e.rel = 'noreferrer'
    e.target = '_blank'
    e.download = filename + '.' + query.file_format
    e.href = URL.createObjectURL(new Blob([res.body], {type: res.headers['Content-Type']}))
    setTimeout(function () {
      e.dispatchEvent(new MouseEvent('click'))
      URL.revokeObjectURL.bind(null, e.href)
      document.body.removeChild(e)
    }, 0)
  } else {
    res.statusCode = 200
    res.headers['Content-Disposition'] = 'attachment; filename=' + filename + '.' + query.file_format
    return res
  }
}
