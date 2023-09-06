import Community from './site/index'
import {Combobox, ComboboxSpec} from './site/elements/combobox'
import {OutputPlotly} from './site/elements/plotly'
import {Select, SelectSpec} from './site/elements/select'
import {Tutorials} from './site/tutorials'
import {InputNumber, NumberSpec} from './site/elements/number'
import {InputButton} from './site/elements/button'
import {DataViewSpec, SiteDataView} from './site/elements/dataview'
import {Virtual} from './site/elements/virtual'

export type Generic = {[index: string]: boolean | string | number}
export type ObjectIndex = {[index: string]: number}

export type UnparsedObject = {
  [index: string]:
    | string
    | string[]
    | number
    | number[]
    | Filter
    | Filter[]
    | MeasureInfos
    | Generic
    | {
        filter_by: string[]
        conditions: Filter[]
      }
  feature_conditions?: Filter[]
  variables?: {
    filter_by: string[]
    conditions: Filter[]
  }
  time_range?: number[]
  variable_info?: MeasureInfos
  short_name?: string
  features?: Features
  file_format?: FileFormats
  table_format?: TableFormats
}

export type Filter = {
  name?: string
  component?: string | number
  operator: string
  value: string | string[]
  time_component?: boolean
  check?: Function
}

export type FilterParsed = {
  e: HTMLElement
  variable: string
  component: string | number
  time_component?: string
  operator: string
  value: number | string
  value_type?: string
  value_source?: number | string
  active: boolean
  id: string
  passed: number
  failed: number
  info: ResourceFields
  view: SiteDataView
  summary?: {
    add: {
      Dataset: string
      First: string
      Last: string
    }
    f: FilterParsed
    table: HTMLTableElement
    update: () => void
    times: number[]
    format: (v: number, int?: boolean) => string | number
  }
}

export type VectorSummary = {
  missing: number
  first: number
  min: number
  mean: number
  sum: number
  max: number
  last: number
}

export interface Summary {
  type: 'string' | 'number'
  filled: boolean
  missing: number[]
  n: number[]
  sum: number[]
  max: number[]
  q3: number[]
  mean: number[]
  range: number[]
  norm_median: number[]
  break_median: number[]
  lower_median_min: number[]
  lower_median_range: number[]
  upper_median_min: number[]
  upper_median_range: number[]
  norm_mean: number[]
  break_mean: number[]
  lower_mean_min: number[]
  lower_mean_range: number[]
  upper_mean_min: number[]
  upper_mean_range: number[]
  median: number[]
  q1: number[]
  min: number[]
  mode: string[]
  levels: string[]
  level_ids: {[index: string]: number}
}

type Summaries = {[index: string]: Summary}

export type MeasureInfo = {
  full_name?: string
  type?: string
  measure?: string
  name?: string
  default?: string
  long_name?: string
  short_name?: string
  description?: string
  long_description?: string
  short_description?: string
  levels?: string[]
  source?: Generic | {[index: string]: Generic}
  categories?: string[] | MeasureInfos
  variants?: string[] | MeasureInfos
}

export type MeasureInfos = {
  [index: string]: MeasureInfo | References | undefined
  _references?: References
}

export type Variable = {
  code: string
  name: string
  datasets?: string[]
  time_range: {[index: string]: [number, number, number?]}
  type?: string
  info: ResourceFields
  levels?: string[]
  level_ids?: {[index: string]: number}
  table?: Generic
  meta?: MeasureInfo | UnparsedObject
  order?: Order[]
  is_time?: boolean
  views: {[index: string]: VariableView}
}

export type Variables = {
  [index: string]: Variable
}

export type Features = {[index: string]: string}

export type LogicalObject = {[index: string]: number | boolean}

type Time = {
  name: string
  value: number[]
  range?: number[]
  n?: number
  is_single?: boolean
  info?: Variable
}

type VariableMeta = {
  [index: string]: {code: string; time_range: [number, number]}
}

export type MetaTime = {
  times: {[index: string]: Time}
  variables: {[index: string]: VariableMeta}
  ranges: {[index: string]: [number, number]}
  overall: {
    range: [number, number]
    value: number[]
  }
}

export type Relations = {
  parents: {[index: string]: Relations}
  children: {[index: string]: Relations}
}

export type EntityData = {[index: string]: number | number[]}

type EntityView = {
  summary: EntitySummaries
  rank: {[index: string]: Uint8Array | Uint16Array | Uint32Array}
  subset_rank: {[index: string]: Uint8Array | Uint16Array | Uint32Array}
}

export type Entity = {
  group: string
  data: EntityData
  features: Features
  get_value: Function
  layer: {[index: string]: Object}
  relations: Relations
  time: Time
  variables: Variables
  views: {[index: string]: EntityView}
}

export type Entities = {[index: string]: Entity}

export type VariableFilter = {
  filter_by: string[]
  conditions: Filter[]
}

export type VariableFilterParsed = {
  filter?: FilterParsed
  name?: string
  range?: [number, number]
  operator: string
  value: string | number
  value_type?: string
  component?: string | number
  active?: boolean
  comp_fun?: Function
}

type EntityMeta = {time: Time; variables: VariableMeta}

export type Data = {
  [index: string]: EntityData | EntityMeta
  _meta: EntityMeta
}

export type DataSets = {[index: string]: Data}

export type IdMap = {map: string; variable: string; map_content: string}

export type DataPackage = {
  name: string
  title: string
  license: {
    name: string
    url: string
    version: string
    id: string
  }
  resources: DataResource[]
  measure_info: MeasureInfos
}

export type ResourceField = {
  duplicates: number
  max: number
  mean: number
  min: number
  missing: number
  name: string
  sd: number
  time_range: [number, number]
  type: string
  info: MeasureInfo
  ids?: EntityFeatures
  table?: {[index: string]: number}
  order?: Order[]
  levels?: {[index: string]: {id: string; name: string}}
}

export type ResourceFields = {[index: string]: ResourceField}

export type DataResource = {
  bytes?: number
  created?: string
  encoding?: string
  entity_count?: number
  filename?: string
  format?: string
  id_length?: number
  ids: IdMap[]
  last_modified?: string
  md5?: string
  name: string
  profile?: string
  row_count?: number
  schema: {fields: ResourceField[]}
  sha512?: string
  sources?: string[]
  time?: string
  site_file: string
  _references?: References
  id_vars?: string[]
}

export type Metadata = {
  package?: string
  url?: string
  files?: string[]
  datasets: string[]
  info?: {[index: string]: DataResource}
  measure_info?: MeasureInfos
}

export type Settings = {
  settings?: Generic
  dataviews?: {[index: string]: DataViewSpec}
  view_names?: string[]
  metadata?: Metadata
  entity_info?: EntityFeatureSet | Generic
}

type Reference = {
  title: string
}

export type References = {[index: string]: Reference}

export type RawQuery = boolean | string | number | {[index: string]: boolean | string | number | Generic}

type FileFormats = 'csv' | 'tsv'
type TableFormats = 'tall' | 'mixed' | 'wide'
export type Query = {
  dataset?: Filter
  feature_conditions?: Filter[]
  variables?: VariableFilter
  time_range?: [number, number]
  file_format?: FileFormats
  table_format?: TableFormats
  features?: Features
  include?: string | string[]
  exclude?: string | string[]
}

export type Order = [string, number][]

type Orders = {[index: string]: Order[]}

type EntitySummaries = {
  [index: string]: {
    n: number
    overall: Summary
    order: Order[]
  }
}

export type VariableView = {
  order: Orders
  selected_order: Orders
  selected_summaries: Summaries
  summaries: Summaries
  table: {[index: string]: number[]}
  state: Generic
}

export type Promises = {[index: string]: Promise<void>}

export type EntityFeatures = {[index: string]: Features}
export type EntityFeatureSet = {[index: string]: {[index: string]: Features}}

export type DataMaps = {
  [index: string]: {
    queue: string[]
    resource: EntityFeatures | EntityFeatureSet
    retrieved: boolean
  }
}

export interface ActiveElement {
  id: string
  e: HTMLElement
  update?: Function
  set?: Function
  reset?: Function
  toggle?: Function
  close?: Function
  expanded?: boolean
  value?: Function
  deferred?: boolean
  input?: boolean
  range?: number[]
  default: string | number
  state: string
  dataset: string
  view: string
  site: Community
}

export interface ActiveTable extends ActiveElement {
  parsed: {
    summary: {n: number}
    order: Orders
    time: number
    color: string
    dataset: string
    time_index: {[index: number]: number}
  }
}

export type SiteElement = Combobox | Select | InputNumber | InputButton | Virtual
export type RegisteredElements = {[index: string]: SiteElement}

export type Conditionals = {
  setting: Function
  options: Function
  set_current: Function
  min: Function
  max: Function
  dataview: Function
  time_filters: Function
  time_range: Function
  id_filter: Function
}

type SiteCondition = {
  id: string
  type: string
  value: string
  any: boolean
  check: Function
}
export type SiteConditions = SiteCondition[]

type SiteRule = {
  condition: SiteConditions
  effects: {[index: string]: string}
  parsed: {
    lock?: Map<string, SiteElement>
    display: {
      e: HTMLElement
      u: ActiveElement
    }
  }
  default?: string
}

type SiteVariable = {
  id: string
  states: {
    condition: SiteConditions
    value: string
  }[]
  default: string
  display: Generic
}

type SiteInfoBody = {
  name: string
  value: string
  style: string
}

type SiteInfo = {
  title?: string
  body?: SiteInfoBody[]
  default?: {
    title?: string
    body?: string
  }
  floating?: boolean
  dataview?: string
  subto?: string[]
  variable?: string
  variable_info?: boolean
}

type SiteText = {
  text: {
    text: string | string[]
    condition?: SiteConditions
    button?: {
      [index: string]: {
        text: string[]
        type: string
        target: string
      }
    }
  }[]
  condition?: SiteConditions
}

type SiteButton = {
  effects: string | Generic
  dataview?: string
  query?: Query
  api?: boolean
}

export type SitePlotly = {
  layout: {[index: string]: any}
  config: {[index: string]: any}
  data: {[index: string]: any}
  subto: string[]
  u: OutputPlotly
}

type MapLayer = {
  name: string
  url: string
  id_property: string
  time?: number
  retrieved?: boolean
  property_summaries?: {
    [index: string]: [number, number, number]
  }
}

export type SiteMap = {
  shapes: MapLayer[]
  overlays?: {
    variable: string
    source?: {
      name: string
      url: string
      time?: number
    }[]
    options: {[index: string]: boolean | number | string | (number | string)[]}
    tiles: {
      [index: string]: {
        url: string
        options?: {[index: string]: any}
      }
    }
  }
  u: SiteElement
}

type SiteLegend = {
  palette: string
  subto: string | string[]
}

type SiteCredits = {
  name: string
  url: string
  description?: string
  version?: string
}

export type SiteSpec = {
  settings: Generic
  metadata: Metadata
  endpoint: string
  aggregated: boolean
  rules?: SiteRule[]
  variables?: SiteVariable[]
  dataviews?: {[index: string]: DataViewSpec}
  info?: {[index: string]: SiteInfo}
  text?: {[index: string]: SiteText}
  combobox?: {[index: string]: ComboboxSpec}
  select?: {[index: string]: SelectSpec}
  button?: {[index: string]: SiteButton}
  datatable?: {[index: string]: any}
  plotly?: {[index: string]: SitePlotly}
  map?: {
    [index: string]: SiteMap | string[]
    _raw?: string[]
  }
  legend?: {[index: string]: SiteLegend}
  credits?: {[index: string]: SiteCredits}
  tutorials?: Tutorials
  tag_id?: string
  number?: NumberSpec
  active?: Community
}

export type MapInfo = {
  queue: {[index: string]: MapLayer}
  waiting: {[index: string]: string[]}
  overlay_property_selectors: SiteElement[]
}

export type OptionSets = {
  [index: string]: {
    options: HTMLOptionElement[]
    values: ObjectIndex
    display: ObjectIndex
  }
}
