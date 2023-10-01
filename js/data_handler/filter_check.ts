import {Filter, VariableFilter, Variables, VectorSummary, Entity} from '../types'

function vector_summary(vec: number | number[], range: number[]): VectorSummary {
  if (Array.isArray(vec)) {
    const n = Math.min(range[1] + 1, vec.length),
      r: VectorSummary = {
        missing: 0,
        first: vec[0],
        min: Infinity,
        mean: 0,
        sum: 0,
        max: -Infinity,
        last: vec[n - 1],
      }
    let on = 0
    for (let i = Math.max(range[0], 0); i < n; i++) {
      const v = vec[i]
      if ('number' === typeof v) {
        if (isNaN(v)) {
          r.missing++
        } else {
          on++
          if (r.min > v) r.min = v
          if (r.max < v) r.max = v
          r.sum += v
        }
      } else {
        if ('NA' !== v) on++
      }
    }
    r.mean = on ? r.sum / on : 0
    return r
  } else {
    return {missing: Number(isNaN(vec)) + 0, first: vec, min: vec, mean: vec, sum: vec, max: vec, last: vec}
  }
}

export function passes_filter(
  entity: Entity,
  time_range: number[],
  filter: VariableFilter,
  variables: Variables
): boolean {
  const s: {[index: string]: VectorSummary} = {},
    adjs: {[index: string]: number} = {}
  for (let i = filter.filter_by.length; i--; ) {
    const f = filter.filter_by[i]
    const c = variables[f].code
    if (!(c in entity.data)) return false
    const r =
      entity.group in variables[f].info
        ? variables[f].info[entity.group].time_range
        : variables[f].time_range[entity.group]
    if (!r) return false
    adjs[f] = r[0]
    s[f] = vector_summary(entity.data[c], [time_range[0] - r[0], Math.max(time_range[1] - r[0], time_range[1] - r[1])])
  }
  for (let i = filter.conditions.length; i--; ) {
    const co = filter.conditions[i]
    if (
      !(co.time_component ? co.check(entity.data[variables[co.name].code], adjs[co.name] || 0) : co.check(s[co.name]))
    )
      return false
  }
  return true
}

export function passes_feature_filter(entities: {[index: string]: Entity}, id: string, filter: Filter[]): boolean {
  const entity = entities[id]
  for (let i = filter.length; i--; ) {
    const value = filter[i].value
    if (value !== '-1') {
      let pass = false
      const ck = (id: string) => {
        if (!pass) {
          const group = id in entities && entities[id].group
          if (
            group && group in entity.features
              ? id === entity.features[group]
              : id.length < entity.features.id.length
              ? id === entity.features.id.substring(0, id.length)
              : id === entity.features.id
          )
            pass = true
        }
      }
      if ('id' === filter[i].name && Array.isArray(value)) {
        value.forEach(ck)
        return pass
      } else {
        ck(value + '')
        return pass
      }
    }
  }
  return true
}
