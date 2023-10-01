import {describe, expect, test} from '@jest/globals'
import Community from '../../js/site'
import type {SiteSpec} from '../../js/types'
import {InputCombobox} from '../../js/site/inputs/combobox'

const site: SiteSpec = {}

describe('creating a combobox', () => {
  jest.useFakeTimers()
  new Community(site)
  jest.runAllTimers()
  if (site.active) {
    const u = InputCombobox.create(site.active, 'combobox', {g1: ['a', 'b']})
    test('options are filled', async () => {
      expect(u.groups.by_name.g1.childElementCount).toEqual(3)
    })
    test('selection can be made', async () => {
      u.set(0)
      expect(u.value()).toEqual('a')
      u.set('b')
      expect(u.value()).toEqual('b')
    })
  }
})
