import {BaseInput} from '.'
import Community from '..'
import {SitePlotly} from '../../types'

declare namespace Plotly {
  export function relayout(e: HTMLElement, layout: {[index: string]: any}): void
}

export class OutputPlotly extends BaseInput {
  style: {[index: string]: any}
  dark_theme: string
  options: SitePlotly
  constructor(e: HTMLElement, site: Community) {
    super(e, site)
    this.dark_theme = site.spec.settings.theme_dark
    this.style = this.options.layout
    if (!('font' in this.style)) this.style.font = {}
    if (!('modebar' in this.style)) this.style.modebar = {}
    if (!('font' in this.style.xaxis)) this.style.xaxis.font = {}
  }
  update_theme() {
    if (this.dark_theme !== this.site.spec.settings.theme_dark) {
      this.dark_theme = this.site.spec.settings.theme_dark
      const s = getComputedStyle(document.body)
      this.style.paper_bgcolor = s.backgroundColor
      this.style.plot_bgcolor = s.backgroundColor
      this.style.font.color = s.color
      this.style.modebar.bgcolor = s.backgroundColor
      this.style.modebar.color = s.color
      if ((this.e as any)._fullLayout.xaxis.showgrid) this.style.xaxis.gridcolor = s.borderColor
      if ((this.e as any)._fullLayout.yaxis.showgrid) this.style.yaxis.gridcolor = s.borderColor
      this.style.xaxis.font.color = s.color
      this.style.yaxis.font.color = s.color
      Plotly.relayout(this.e, this.options.layout)
    }
  }
}
