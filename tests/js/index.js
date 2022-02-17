/*
  # test site must first be built in R:
  init_site("test_site", dir = "../test_site")
  source("../test_site/build.R")
  site_build("../test_site")
*/

// prepare environment
const assert = require("assert"),
  fs = require("fs"),
  { window } = new (require("jsdom").JSDOM)(fs.readFileSync("../test_site/docs/index.html").toString(), {
    url: "http://localhost/",
    pretendToBeVisual: true,
  }),
  document = window.document,
  site = JSON.parse(fs.readFileSync("../test_site/docs/settings.json").toString())
site.data = JSON.parse(fs.readFileSync("../test_site/docs/mtcars.json").toString())

// execute site script
require("../../community.js")(window, document, site)

// tests
describe("Initially...", function () {
  it("onload is set", function () {
    assert(!!window.onload)
  })
  it("onload runs", function () {
    window.onload()
    assert(document.body.children[0])
  })
})
