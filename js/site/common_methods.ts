import type {MeasureInfo} from '../types'
import type {InputCombobox} from './inputs/combobox'
import type {InputSelect} from './inputs/select'

export function options_filter(this: InputCombobox | InputSelect) {
  if (this.settings.filters) {
    Object.keys(this.settings.filters).forEach(f => {
      this.current_filter[f] = this.site.valueOf(this.settings.filters[f]) as keyof MeasureInfo
    })
    let first = ''
    Object.keys(this.values).forEach((v, i) => {
      let pass = false
      if (v in this.site.data.variables && 'meta' in this.site.data.variables[v]) {
        const info = this.site.data.variables[v].meta as MeasureInfo
        for (const k in this.current_filter)
          if (k in info) {
            pass = info[k as keyof MeasureInfo] === this.current_filter[k]
            if (!pass) break
          }
      }
      if (pass && !first) first = v
      this.options[i].classList[pass ? 'remove' : 'add']('hidden')
    })
    this.current_index = this.values[this.value() as string]
    if (first && (-1 === this.current_index || this.options[this.current_index].classList.contains('hidden'))) {
      this.set(first)
    }
  }
}

export function set_current_options(this: InputCombobox | InputSelect) {
  const to = this.option_sets[this.dataset]
  this.values = to.values
  this.display = to.display
  this.options = to.options as typeof this.options
  this.groups = to.groups
  this.source = ''
  this.id in this.site.url_options
    ? this.set(this.site.url_options[this.id] as string)
    : this.state in this.values
    ? this.set(this.state)
    : this.reset()
}
