var c = require('../dev/community')
var expect = require('chai').expect
const assert = require('chai').expect

;(fs = require('fs')),
  ({window} = new (require('jsdom').JSDOM)(fs.readFileSync('../test_site/docs/index.html').toString(), {
    url: 'http://localhost/',
    pretendToBeVisual: true,
  })),
  (document = window.document),
  (site = JSON.parse(fs.readFileSync('../test_site/docs/settings.json').toString()))
site.data = JSON.parse(fs.readFileSync('../test_site/docs/mtcars.json').toString())

// execute site script
require('../../dev/community.js')(window, document, site)

describe('init', function () {
  context('With argument', function () {
    it('should create a table', function () {
      expect(init()).to.equal()
    })
  })
})
