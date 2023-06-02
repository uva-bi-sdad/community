import DataHandler from '.'
import {Entity, Features} from '../types'

export function tall(
  this: DataHandler,
  entity: Entity,
  time_range: number[],
  feats: Features,
  vars: string[],
  sep: string
): string {
  if (entity.group in this.meta.times) {
    const op: string[] = [],
      time = this.meta.times[entity.group].value as number[]
    let tr = ''
    Object.keys(feats).forEach(f => {
      tr += '"' + entity.features[feats[f]] + '"' + sep
    })
    vars.forEach(k => {
      const vc = entity.variables[k].code
      if (vc in entity.data) {
        const range: [number, number] = this.meta.variables[entity.group][k].time_range
        let r = ''
        const yn = time_range[1] + 1
        for (let y = time_range[0]; y < yn; y++) {
          if (y >= range[0] && y <= range[1]) {
            const vec = entity.data[vc]
            const value = Array.isArray(vec) ? vec[y - range[0]] : vec
            if (!isNaN(value)) {
              r += (r ? '\n' : '') + tr + time[y] + sep + '"' + k + '"' + sep + value
            }
          }
        }
        if (r) op.push(r)
      }
    })
    return op.join('\n')
  }
  return ''
}

export function mixed(
  this: DataHandler,
  entity: Entity,
  time_range: number[],
  feats: Features,
  vars: string[],
  sep: string
): string {
  if (entity.group in this.meta.times) {
    const op: string[] = [],
      time = this.meta.times[entity.group].value as number[]
    let tr = ''
    Object.keys(feats).forEach(f => {
      tr += '"' + entity.features[feats[f]] + '"' + sep
    })
    const yn = time_range[1] + 1
    for (let y = time_range[0]; y < yn; y++) {
      let r = tr + time[y]
      vars.forEach((k: string) => {
        const vc = entity.variables[k].code
        if (vc in entity.data) {
          const trange = this.meta.variables[entity.group][k].time_range
          const vec = entity.data[vc]
          let value = NaN
          if (Array.isArray(vec)) {
            if (y >= trange[0] && y <= trange[1]) value = vec[y - trange[0]]
          } else if (y === trange[0]) {
            value = vec
          }
          r += sep + (isNaN(value) ? 'NA' : value)
        } else r += sep + 'NA'
      })
      op.push(r)
    }
    return op.join('\n')
  }
  return ''
}

export function wide(
  this: DataHandler,
  entity: Entity,
  time_range: number[],
  feats: Features,
  vars: string[],
  sep: string
): string {
  if (entity.group in this.meta.times) {
    let r = ''
    Object.keys(feats).forEach(f => {
      r += (r ? sep : '') + '"' + entity.features[feats[f]] + '"'
    })
    vars.forEach(k => {
      const vc = entity.variables[k].code
      const range: [number, number] = this.meta.ranges[k]
      const trange: [number, number] = this.meta.variables[entity.group][k].time_range
      const yn = time_range[1] + 1
      for (let y = time_range[0]; y < yn; y++) {
        if (y >= range[0] && y <= range[1]) {
          if (vc in entity.data) {
            const vec = entity.data[vc]
            let value = NaN
            if (Array.isArray(vec)) {
              if (y >= trange[0] && y <= trange[1]) value = vec[y - trange[0]]
            } else if (y === trange[0]) {
              value = vec
            }
            r += sep + (isNaN(value) ? 'NA' : value)
          } else r += sep + 'NA'
        }
      }
    })
    return r
  }
  return ''
}
