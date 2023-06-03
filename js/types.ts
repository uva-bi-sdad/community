export type UnparsedObject = {[index: string]: any}

export type Filter = {
  name: string
  component: string | number
  operator: string
  value: string | string[]
  time_component: boolean
  check: Function
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
  full_name: string
  type: string
  measure: string
  name: string
  long_name: string
  short_name: string
  description: string
  long_description: string
  short_description: string
  levels: string[]
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
  info: {[index: string]: ResourceField}
  levels?: string[]
  level_ids?: {[index: string]: number}
  table?: {[index: string]: string}
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
  value: number | number[]
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
  features: {[index: string]: string}
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
}

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

type DataviewSelection = {[index: string]: Entities}

type DataView = {
  state: string
  get: {[index: string]: Function}
  selection: DataviewSelection
  n_selected: {[index: string]: number}
}

export type Settings = {
  settings?: {[index: string]: string}
  dataviews?: {[index: string]: DataView}
  metadata?: Metadata
  entity_info?: EntityFeatureSet | {[index: string]: string}
}

type Reference = {
  title: string
}

export type References = {[index: string]: Reference}

export type RawQuery = string | {[index: string]: string | {[index: string]: string}}

export type Query = {
  dataset: Filter
  feature_conditions: Filter[]
  variables: VariableFilter
  time_range: [number, number]
  file_format: 'csv' | 'tsv'
  table_format: 'tall' | 'mixed' | 'wide'
  features: {[index: string]: string}
  include: string | string[]
  exclude: string | string[]
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
  state: {[index: string]: string}
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
