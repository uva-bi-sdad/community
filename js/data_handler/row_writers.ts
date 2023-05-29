import {Entity, Features} from '../types'

export function tall(entity: Entity, time_range: number[], feats: Features, vars: string[], sep: string): string {
  if (entity.group in this.meta.times) {
    const op: string[] = [],
      time: number[] = this.meta.times[entity.group].value
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
            const value: number = 'number' === typeof entity.data[vc] ? entity.data[vc] : entity.data[vc][y - range[0]]
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

export function mixed(entity: Entity, time_range: number[], feats: Features, vars: string[], sep: string): string {
  if (entity.group in this.meta.times) {
    const op: string[] = [],
      time: number[] = this.meta.times[entity.group].value
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
          const trange: [number, number] = this.meta.variables[entity.group][k].time_range
          const value: number =
            y < trange[0] || y > trange[1]
              ? NaN
              : trange[0] === trange[1]
              ? y === trange[0]
                ? entity.data[vc]
                : NaN
              : entity.data[vc][y - trange[0]]
          r += sep + (isNaN(value) ? 'NA' : value)
        } else r += sep + 'NA'
      })
      op.push(r)
    }
    return op.join('\n')
  }
  return ''
}

export function wide(entity: Entity, time_range: number[], feats: Features, vars: string[], sep: string): string {
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
            const value: number =
              y < trange[0] || y > trange[1]
                ? NaN
                : trange[0] === trange[1]
                ? y === trange[0]
                  ? entity.data[vc]
                  : NaN
                : y < trange[0] || y > trange[1]
                ? NaN
                : entity.data[vc][y - trange[0]]
            r += sep + (isNaN(value) ? 'NA' : value)
          } else r += sep + 'NA'
        }
      }
    })
    return r
  }
  return ''
}
