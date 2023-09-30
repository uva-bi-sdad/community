import type {SiteSpec} from '../../types'
import type Community from '../index'
import type {OutputDataTable} from './datatables'
import type {OutputInfo} from './info'
import type {OutputLegend} from './legend'
import type {OutputMap} from './map'
import type {OutputPlotly} from './plotly'
import type {OutputTable} from './table'
import type {OutputText} from './text'

type OutputTypes = 'info' | 'map' | 'plotly' | 'text' | 'datatable' | 'table' | 'legend'
export type SiteOutputs =
  | OutputInfo
  | OutputMap
  | OutputPlotly
  | OutputText
  | OutputDataTable
  | OutputTable
  | OutputLegend
export type RegisteredOutputs = {[index: string]: SiteOutputs}

export abstract class BaseOutput {
  type: OutputTypes
  input = false
  site: Community
  view: string
  e: HTMLElement
  tab?: HTMLElement
  id: string
  note: string
  color?: string
  x?: string
  y?: string
  spec: {[index: string]: any} = {}
  deferred = false
  constructor(e: HTMLElement, site: Community) {
    this.e = e
    this.tab = 'tabpanel' === e.parentElement.getAttribute('role') ? e.parentElement : void 0
    this.site = site
    this.view = e.dataset.view || site.defaults.dataview
    this.id = e.id || 'ui' + site.page.elementCount++
    this.note = e.getAttribute('aria-description') || ''
    this.type = e.dataset.autotype as OutputTypes
    if (this.type in site.spec) {
      const spec = site.spec[this.type as keyof SiteSpec] as SiteOutputs
      if (this.id in spec) this.spec = (spec as any)[this.id]
    }
  }
}
