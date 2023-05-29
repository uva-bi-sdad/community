import {UnparsedObject} from '../types'

export const defaults: UnparsedObject = {
  file_format: 'csv',
  table_format: 'mixed',
  features: {ID: 'id', Name: 'name'},
  feature_conditions: [],
  variables: {
    filter_by: [],
    conditions: [],
  },
}

export const options: {[index: string]: string[]} = {
  file_format: ['csv', 'tsv'],
  table_format: ['tall', 'mixed', 'wide'],
  filter_components: ['first', 'min', 'mean', 'sum', 'max', 'last'],
}
