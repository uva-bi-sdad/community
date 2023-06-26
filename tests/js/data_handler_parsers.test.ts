import {describe, expect, test} from '@jest/globals'
import * as parser from '../../js/data_handler/parsers'

describe('measure info', function () {
  test('dynamic entries are expanded', async () => {
    const info = parser.measure_info({
      'measure_{category}_{variant.name}': {
        short_name: 'Measure {category} {variant}',
        long_name: 'Measure {category} {variant}',
        long_description: 'Measure {category} {variant}.',
        categories: ['a', 'b'],
        variants: {
          v1: {default: 'V one', short_name: 'V1', description: 'Vee One'},
          v2: {short_name: 'V2', source: {name: 'source name'}},
        },
      },
    })
    expect(Object.keys(info)).toStrictEqual([
      'measure_{category}_{variant.name}',
      'measure_a_v1',
      'measure_a_v2',
      'measure_b_v1',
      'measure_b_v2',
    ])
    expect(info.measure_a_v1).toStrictEqual({
      short_name: 'Measure a V1',
      long_name: 'Measure a V one',
      long_description: 'Measure a Vee One.',
    })
    expect(info.measure_a_v2).toStrictEqual({
      short_name: 'Measure a V2',
      long_name: 'Measure a v2',
      long_description: 'Measure a v2.',
      source: {name: 'source name'},
    })
  })
})
