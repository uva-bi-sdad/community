import {describe, expect, test} from '@jest/globals'
import Community from '../../js/site'
import type {SiteSpec} from '../../js/types'

const site: SiteSpec = {}

describe('when initialized empty', () => {
  jest.useFakeTimers()
  new Community(site)
  test('loadscreen is dropped', async () => {
    jest.runAllTimers()
    expect(site.active && site.active.page.wrap.style.visibility).toEqual('visible')
  })
})
