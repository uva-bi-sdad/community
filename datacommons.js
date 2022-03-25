'use strict'
if (!Object.hasOwn) {
  Object.defineProperty(Object, 'hasOwn', {
    value: function (object, property) {
      if (object == null) {
        throw new TypeError('Cannot convert undefined or null to object')
      }
      return Object.prototype.hasOwnProperty.call(Object(object), property)
    },
    configurable: true,
    enumerable: false,
    writable: true,
  })
}

function DataCommons(definition, manifest, views) {
  this.definition = definition
  this.manifest = manifest
  this.views = {}
  this.variables = {}
  this.repos = {}
  this.providers = {}
  this.dists = {}
  this.files = {}
  this.table_hashes = {}
  this.page = {
    menu: {
      reset: document.getElementById('reset_button'),
      views: document.getElementById('views_button'),
    },
    body: document.getElementsByClassName('content')[0],
    container: document.createElement('div'),
    tabs: {
      repos: document.createElement('div'),
      files: document.createElement('div'),
      variables: document.createElement('div'),
    },
    repos: {},
    files: {},
    order: [],
  }
  this.page.body.appendChild(this.page.container)
  this.page.container.className = 'commons'
  this.requester.onmessage = m => {
    const d = JSON.parse(m.data)
    if (d.response) {
      this.repos[d.repo].providers[d.provider] = JSON.parse(d.response)
    }
  }
  var k, r, fn, f, p
  for (var k in manifest.repos)
    if (Object.hasOwn(manifest.repos, k)) {
      r = this.repos[k] = manifest.repos[k]
      r.providers = {}
      this.get_provider(k, 'github')
      r.all_files = manifest.files[k]
      for (p in r.distributions) if (Object.hasOwn(r.distributions, p)) this.get_provider(k, p)
      for (fn in r.all_files)
        if (Object.hasOwn(r.all_files, fn)) {
          f = r.all_files[fn]
          if ('string' === typeof f.providers) f.providers = [f.providers]
          if (Object.hasOwn(this.files, f.name)) {
            this.files[f.name].versions.push(f)
          } else {
            this.files[f.name] = {content: f, versions: [], locations: {}}
            if (Object.hasOwn(r.files, f.name)) {
              r.files[f.name].parent = r
              this.files[f.name].locations.github = r.files[f.name]
            }
            for (p in r.distributions)
              if (Object.hasOwn(r.distributions, p) && Object.hasOwn(r.distributions[p].files, f.name)) {
                r.distributions[p].files[f.name].parent = r.distributions[p]
                this.files[f.name].locations[p] = r.distributions[p].files[f.name]
              }
          }
        }
    }
}

DataCommons.prototype = {
  constructor: DataCommons,
  requester: new Worker('request.js'),
  make_file_link: function (name, provider) {
    const f = this.files[name]
    var url = ''
    if (f) {
      if ('github' === provider) {
        if (Object.hasOwn(f.locations, 'github')) {
          url =
            f.locations.github.parent.url +
            '/' +
            ((f.locations.github.parent.providers.github &&
              f.locations.github.parent.providers.github.default_branch) ||
              'master') +
            '/' +
            f.locations.github.location +
            '/' +
            f.name
        }
      } else if ('dataverse' === provider) {
        if (Object.hasOwn(f.locations, 'dataverse')) {
          url = f.locations.dataverse.parent.server + '/file.xhtml?fileId=' + f.id
        }
      }
    }
    return url
  },
  get_provider_api: function (type, provider) {
    if ('dataverse' === type) {
      return provider.server + 'api/datasets/:persistentId?persistentId=doi:' + provider.doi
    }
  },
  get_provider: async function (repo, provider) {
    const api =
      'github' === provider
        ? 'https://api.github.com/repos/' + repo
        : this.get_provider_api(provider, this.repos[repo].distributions[provider])
    if (api) {
      this.requester.postMessage(JSON.stringify({repo: repo, provider: provider, url: api}))
    }
  },
}
