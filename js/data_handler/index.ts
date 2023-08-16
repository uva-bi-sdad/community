'use strict'
import {value_checks} from './checks'
import {exporter} from './exporter'
import * as retrievers from './retrievers'
import * as formatter from './formatters'
import * as ingester from './ingesters'
import * as summary from './summary'
import * as mapper from './mappers'
import * as parser from './parsers'
import type {
  Settings,
  Variable,
  Metadata,
  MeasureInfos,
  DataSets,
  Features,
  Variables,
  References,
  Entities,
  Relations,
  MetaTime,
  LogicalObject,
  Promises,
  DataMaps,
  DataResource,
  MeasureInfo,
  DataPackage,
  EntityFeatureSet,
  Entity,
} from '../types'

export default class DataHandler {
  constructor(
    settings?: Settings,
    defaults?: {[index: string]: string},
    data?: DataSets,
    hooks?: {[index: string]: Function}
  ) {
    if (hooks) this.hooks = hooks
    if (defaults) this.defaults = defaults
    if (settings) this.settings = settings
    if (this.settings.metadata) this.metadata = this.settings.metadata
    if (data) this.sets = data
    this.get_value = this.get_value.bind(this)
    this.dynamic_load = 'dataviews' in this.settings && this.settings.settings && !!this.settings.settings.partial_init
    this.settings.view_names = this.dynamic_load ? Object.keys(this.settings.dataviews) : ['default_view']
    if ('string' === typeof this.metadata.datasets) this.metadata.datasets = [this.metadata.datasets]
    const init = () => {
      if (!this.metadata.datasets || !this.metadata.datasets.length) {
        this.metadata.datasets = Object.keys(this.info)
        if (!this.metadata.datasets.length) this.metadata.datasets = Object.keys(this.sets)
      }
      if (this.metadata.measure_info) {
        const info = parser.measure_info(this.metadata.measure_info)
        this.metadata.datasets.forEach((d: string) => {
          if (info._references) this.info[d]._references = info._references
          const v = this.info[d].schema.fields
          v.forEach(e => (e.name in info ? (e.info = info[e.name] as MeasureInfo) : ''))
        })
      }
      this.map_variables()
      this.metadata.datasets.forEach((k: string) => {
        this.loaded[k] = k in this.sets
        this.inited[k] = false
        this.data_processed[k] = new Promise(resolve => {
          this.data_promise[k] = resolve
        })
        if (k in this.info)
          this.info[k].site_file = (this.metadata.url ? this.metadata.url + '/' : '') + this.info[k].name + '.json'
        if (this.loaded[k]) {
          this.ingest_data(this.sets[k], k)
        } else if (
          !this.dynamic_load ||
          (this.settings.settings && !this.settings.settings.partial_init) ||
          !this.defaults.dataset ||
          k === this.defaults.dataset
        )
          this.retrieve(k, this.info[k].site_file)
      })
    }
    if (this.metadata.package && !this.metadata.info) {
      if ('undefined' === typeof window) {
        require('https')
          .get(this.metadata.url + this.metadata.package, (r: {on: Function}) => {
            const c: string[] = []
            r.on('data', (d: string) => {
              c.push(d)
            })
            r.on('end', () => {
              this.info = {}
              const dp: DataPackage = JSON.parse(c.join(''))
              if (dp.measure_info) this.metadata.measure_info = dp.measure_info
              dp.resources.forEach((r: DataResource) => (this.info[r.name] = r))
              init()
            })
          })
          .end()
      } else {
        const f = new window.XMLHttpRequest()
        f.onreadystatechange = () => {
          if (4 === f.readyState) {
            if (200 === f.status) {
              this.info = {}
              const dp = JSON.parse(f.responseText)
              if (dp.measure_info) this.metadata.measure_info = dp.measure_info
              dp.resources.forEach((r: DataResource) => (this.info[r.name] = r))
              init()
            } else {
              throw new Error('failed to load datapackage: ' + f.responseText)
            }
          }
        }
        f.open('GET', this.metadata.url + this.metadata.package)
        f.send()
      }
    } else {
      if (this.metadata.info) this.info = this.metadata.info
      init()
    }
  }
  hooks: {[index: string]: Function} = {}
  defaults: {[index: string]: string} = {dataview: 'default_view', time: 'time'}
  settings: Settings = {}
  metadata: Metadata = {datasets: []}
  info: {[index: string]: DataResource} = {}
  sets: DataSets = {}
  dynamic_load = false
  all_data_ready: Function = () => false
  data_ready: Promise<void> = new Promise(resolve => {
    this.all_data_ready = resolve
  })
  features: Features = {}
  variables: Variables = {}
  variable_codes: Variables = {}
  variable_info: MeasureInfos = {}
  references: References = {}
  entities: Entities = {}
  entity_tree: {[index: string]: Relations} = {}
  meta: MetaTime = {
    times: {},
    variables: {},
    ranges: {},
    overall: {
      range: [Infinity, -Infinity],
      value: [],
    },
  }
  loaded: LogicalObject = {}
  onload: () => {}
  inited: {[index: string]: number | NodeJS.Timeout | boolean} = {}
  inited_summary: Promises = {}
  summary_ready: {[index: string]: Function} = {}
  entity_features: EntityFeatureSet = {}
  data_maps: DataMaps = {}
  data_queue: {[index: string]: {[index: string]: Function}} = {}
  data_promise: {[index: string]: Function} = {}
  data_processed: Promises = {}
  load_requests: {[index: string]: string} = {}
  retrieve = async function (this: DataHandler, name: string, url: string) {
    if (!this.load_requests[name]) {
      this.load_requests[name] = url
      const f = new window.XMLHttpRequest()
      f.onreadystatechange = () => {
        if (4 === f.readyState) {
          if (200 === f.status) {
            this.ingest_data(JSON.parse(f.responseText), name)
          } else {
            throw new Error('DataHandler.retrieve failed: ' + f.responseText)
          }
        }
      }
      f.open('GET', url, true)
      f.send()
    }
  }
  format_value = formatter.value
  format_label = formatter.label
  ingest_data = ingester.data
  ingest_map = ingester.map
  load_id_maps = ingester.id_maps
  init_summary = summary.init
  calculate_summary = summary.calculate
  map_variables = mapper.variables
  map_entities = mapper.entities
  parse_query = parser.query
  export = exporter
  get_variable = async function (this: DataHandler, variable: string, view: string): Promise<Variable> {
    if (variable in this.variables) await this.calculate_summary(variable, view, true)
    return this.variables[variable]
  }
  get_value = function vector(this: DataHandler, r: {variable: string; entity: Entity}): number[] {
    if (this.variables[r.variable].is_time) {
      return r.entity.time.value as number[]
    } else {
      const v = this.variables[r.variable].code
      return (
        v in r.entity.data ? (Array.isArray(r.entity.data[v]) ? r.entity.data[v] : [r.entity.data[v]]) : [NaN]
      ) as number[]
    }
  }
  public static retrievers = retrievers
  public static checks = value_checks
}
