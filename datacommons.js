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
  this.views = views
  this.variables = {}
  this.repos = {}
  this.providers = {}
  this.dists = {}
  this.uids = {}
  this.files = {}
  this.page = {
    menu: {
      check_all: document.getElementById('refresh_button'),
    },
    body: document.getElementsByClassName('content')[0],
    container: document.createElement('div'),
    tooltip: document.createElement('div'),
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
  this.page.container.appendChild(this.page.tabs.repos)
  this.requester.onmessage = m => {
    const d = JSON.parse(m.data)
    if (d.response) {
      this.repos[d.repo].providers[d.provider] = JSON.parse(d.response)
      const r = this.repos[d.repo],
        p = r.providers[d.provider],
        mismatches = []
      var i = 0,
        n = 0,
        fs,
        uid,
        any_matches = false,
        status = p.status ? p.status : p.message ? 'ERROR' : 'OK'
      r.distributions[d.provider].display.lastElementChild.lastElementChild.className = ''
      if ('OK' === status) {
        r.distributions[d.provider].display.classList.add('passed-check')
        r.distributions[d.provider].display.classList.remove('failed-check')
        if ('github' === d.provider) {
          for (n = p.length; i < n; i++) {
            if (Object.hasOwn(this.uids, p[i].name)) {
              any_matches = true
              uid = this.uids[p[i].name]
              this.files[uid].remote.github = p[i]
              if (!Object.hasOwn(r.all_files, this.files[uid].local.github.md5)) mismatches.push(p[i].name)
            }
          }
        } else if ('dataverse' === d.provider) {
          for (fs = p.data.latestVersion.files, n = fs.length; i < n; i++) {
            if (Object.hasOwn(this.uids, fs[i].dataFile.filename)) {
              any_matches = true
              uid = this.uids[fs[i].dataFile.filename]
              this.files[uid].remote.dataverse = fs[i].dataFile
              if (!Object.hasOwn(r.all_files, this.files[uid].local.dataverse.md5))
                mismatches.push(fs[i].dataFile.filename)
            }
          }
        }
        if (!any_matches) {
          status = 'WARN'
          p.message = n
            ? 'None of the distribution files match those from the local record.'
            : 'The distribution had no files.'
        } else if (mismatches.length) {
          status = 'WARN'
          p.message =
            (mismatches.length === 1 ? 'A file was' : 'Files were') +
            ' not associated with the distribution on record: ' +
            mismatches
        }
      }
      if ('OK' !== status) {
        r.distributions[d.provider].display.classList.remove('passed-check')
        r.distributions[d.provider].display.classList.add('failed-check')
        r.distributions[d.provider].display.lastElementChild.setAttribute('aria-description', p.message)
      }
      r.distributions[d.provider].display.lastElementChild.lastElementChild.innerText = status
      this.display_repo(d.repo)
    }
  }
  if (this.page.menu.check_all) {
    this.page.menu.check_all.addEventListener('click', () => {
      var r, p
      for (r in this.repos)
        if (Object.hasOwn(this.repos, r)) {
          for (p in this.repos[r].distributions)
            if (Object.hasOwn(this.repos[r].distributions, p)) {
              this.request_provider(r, p)
            }
        }
    })
  }
  var k,
    r,
    h,
    fn,
    f,
    p,
    e,
    uid,
    id = 0
  e = document.createElement('div')
  e.className = 'toast'
  e.role = 'alert'
  e.setAttribute('aria-live', 'assertive')
  e.setAttribute('aria-atomic', 'true')
  e.appendChild(document.createElement('div'))
  e.lastElementChild.className = 'toast-header'
  e.lastElementChild.appendChild(document.createElement('strong'))
  e.lastElementChild.lastElementChild.className = 'me-auto'
  e.lastElementChild.appendChild(document.createElement('button'))
  e.lastElementChild.lastElementChild.type = 'button'
  e.lastElementChild.lastElementChild.className = 'btn-close'
  e.lastElementChild.lastElementChild.setAttribute('data-bs-dismiss', 'toast')
  e.lastElementChild.lastElementChild.setAttribute('aria-label', 'close')
  e.appendChild(document.createElement('div'))
  e.lastElementChild.className = 'toast-body'
  this.page.toast = new bootstrap.Toast(e)
  this.page.body.insertAdjacentElement('afterEnd', e)
  e = this.page.tooltip
  e.className = 'hover-note hidden'
  e.appendChild(document.createElement('p'))
  this.page.body.insertAdjacentElement('afterEnd', e)
  this.page.body.parentElement.addEventListener('mouseover', e => {
    const ontarget = e.target.getAttribute('aria-description'),
      note = ontarget || e.target.parentElement.getAttribute('aria-description')
    if (note) {
      this.page.tooltip.firstElementChild.innerText = note
      this.page.tooltip.classList.remove('hidden')
      const b = (ontarget ? e.target : e.target.parentElement).getBoundingClientRect(),
        tb = this.page.tooltip.getBoundingClientRect()
      this.page.tooltip.style.top = b.bottom + 10 + 'px'
      this.page.tooltip.style.left = Math.max(0, b.left + b.width / 2 - tb.width / 2) + 'px'
    } else {
      this.page.tooltip.classList.add('hidden')
    }
  })
  for (var k in manifest.repos)
    if (Object.hasOwn(manifest.repos, k)) {
      r = this.repos[k] = manifest.repos[k]
      r.checks = {}
      r.providers = {}
      r.file_ids = []
      r.ufiles = {}
      r.all_files = manifest.files[k]
      for (h in r.all_files)
        if (Object.hasOwn(r.all_files, h)) {
          f = r.all_files[h]
          fn = f.name
          if ('string' === typeof f.providers) f.providers = [f.providers]
          uid = ''
          if (Object.hasOwn(this.uids, h)) {
            uid = this.uids[h]
          } else if (Object.hasOwn(this.uids, fn)) {
            uid = this.uids[fn]
          }
          if (!uid) {
            uid = 'f' + id++
            this.uids[h] = this.uids[fn] = uid
          }
          f.uid = uid
          if (!Object.hasOwn(this.files, uid)) {
            this.files[uid] = {content: f, local: {}, remote: {}, display: document.createElement('div')}
          }
          if (!Object.hasOwn(r.ufiles, uid)) {
            r.file_ids.push(uid)
            r.ufiles[uid] = this.files[uid]
          }
          if (Object.hasOwn(r.files, fn)) {
            r.files[fn].uid = uid
            r.files[fn].date = this.format.date(new Date(r.files[fn].date))
            r.files[fn].parent = r
            this.files[uid].local.github = r.files[fn]
          }
          for (p in r.distributions)
            if (Object.hasOwn(r.distributions, p)) {
              if (!Object.hasOwn(this.dists, p)) this.dists[p] = {}
              if (!Object.hasOwn(this.dists[p], r.distributions[p].doi)) this.dists[p][r.distributions[p].doi] = {}
              this.dists[p][r.distributions[p].doi][k] = r
              if (r.distributions[p].files && Object.hasOwn(r.distributions[p].files, fn)) {
                r.distributions[p].files[fn].uid = uid
                r.distributions[p].files[fn].parent = r.distributions[p]
                this.files[uid].local[p] = r.distributions[p].files[fn]
                if (
                  Object.hasOwn(r.distributions[p].files[fn], 'date') &&
                  'string' === typeof r.distributions[p].files[fn].date
                ) {
                  r.distributions[p].files[fn].date = this.format.date(new Date(r.distributions[p].files[fn].date))
                }
              }
            }
        }
      this.page.tabs.repos.appendChild(this.display_repo(k))
    }
}

DataCommons.prototype = {
  constructor: DataCommons,
  requester: new Worker('request.js'),
  rates: {github: {resources: {core: {remaining: 0, reset: -Infinity}}}},
  queues: {
    distributions: [],
  },
  format: {
    date: Intl.DateTimeFormat('en-us', {month: '2-digit', day: '2-digit', year: '2-digit'}).format,
    time: Intl.DateTimeFormat('en-us', {hour: 'numeric', minute: 'numeric'}).format,
    size: function (b) {
      return b < 1e6 ? b / 1e3 + ' KB' : b < 1e9 ? b / 1e6 + ' MB' : b / 1e9 + ' GB'
    },
  },
  checks: {
    has_files: {
      name: 'Files',
      description: 'Number of latent files between the repository and distributions.',
      check: function (r) {
        return r.file_ids.length
      },
    },
    has_dist: {
      name: 'Dist',
      description: 'Has an associated distribution repository.',
      check: function (r) {
        return Object.keys(r.distributions).length > 1
      },
    },
    aligned: {
      name: 'Aligned',
      description: 'All latent file instances are aligned.',
      check: function (r) {
        var f,
          k,
          p,
          h,
          s,
          uid,
          fck,
          ck = true
        for (uid in r.ufiles)
          if (Object.hasOwn(r.ufiles, uid)) {
            f = r.ufiles[uid]
            p = Object.hasOwn(f.local, 'github') ? 'github' : 'dataverse'
            for (k in f.local)
              if (Object.hasOwn(f.local, k)) {
                h = 'github' === k ? 'sha' : 'md5'
                s = Object.hasOwn(f.remote, k) ? 'remote' : 'local'
                fck = true
                if ('remote' === s) fck = f.local[k][h] === f.remote[k][h]
                fck = fck && f.local[p].md5 === f.local[k].md5
                if (!fck) ck = false
                f.local[k].display.classList[fck ? 'remove' : 'add']('failed-check')
                f.local[k].display.lastElementChild.setAttribute('aria-description', 'Source: ' + s)
                f.local[k].display.lastElementChild.innerText = f[s][k][h]
              }
          }
        return ck
      }.bind(this),
    },
  },
  check: function (r) {
    for (var k in this.checks)
      if (Object.hasOwn(this.checks, k)) {
        const ck = this.checks[k].check(r)
        r.checks[k].lastElementChild.innerText = ck
        r.checks[k].classList[ck ? 'remove' : 'add']('failed-check')
      }
  },
  display_repo: function (repo) {
    const r = this.repos[repo],
      exists = Object.hasOwn(this.page.repos, repo),
      e = exists ? this.page.repos[repo] : document.createElement('div')
    if (Object.hasOwn(this.repos, repo)) {
      var h, ee, eee, c
      if (!exists) {
        this.page.repos[repo] = e
        e.className = 'repo_container card'
        e.appendChild((ee = document.createElement('div')))
        ee.className = 'repo_header card-header'
        c = repo.split('/')
        ee.appendChild(document.createElement('span'))
        ee.lastElementChild.innerText = c[0] + '/'
        ee.appendChild(document.createElement('span'))
        ee.lastElementChild.innerText = c[1]
        ee.appendChild((ee = document.createElement('span')))
        ee.className = 'repo_links'
        if (!Object.hasOwn(r, 'distributions')) r.distributions = {}
        r.distributions.github = {url: r.url}
        for (h in r.distributions)
          if (Object.hasOwn(r.distributions, h)) {
            r.distributions[h].display = document.createElement('div')
            ee.appendChild(r.distributions[h].display)
            ee.lastElementChild.className = 'status-chip'
            ee.lastElementChild.appendChild((eee = document.createElement('a')))
            eee.target = '_blank'
            eee.rel = 'noreferrer'
            eee.innerText = h
            eee.href = this.get_provider_link(h, repo)
            ee.lastElementChild.appendChild((eee = document.createElement('button')))
            eee.className = 'btn'
            eee.appendChild(document.createElement('span'))
            eee.lastElementChild.innerText = 'check'
            eee.addEventListener('click', this.request_provider.bind(this, repo, h))
          }
        e.appendChild(document.createElement('div'))
        e.lastElementChild.className = 'repo_body card-body'
        e.lastElementChild.appendChild((ee = document.createElement('div')))
        ee.className = 'repo_status'
        for (h in this.checks)
          if (Object.hasOwn(this.checks, h)) {
            ee.appendChild((r.checks[h] = document.createElement('div')))
            ee.lastElementChild.className = 'status-chip'
            ee.lastElementChild.setAttribute('aria-description', this.checks[h].description)
            ee.lastElementChild.appendChild(document.createElement('span'))
            ee.lastElementChild.firstElementChild.innerText = this.checks[h].name
            ee.lastElementChild.appendChild(document.createElement('span'))
          }
        e.lastElementChild.appendChild((ee = document.createElement('div')))
        ee.className = 'repo_files'
        for (h in r.all_files)
          if (Object.hasOwn(r.all_files, h)) {
            ee.appendChild(this.display_file(h))
          }
      }
      this.check(r)
    }
    return e
  },
  display_file: function (file) {
    if (Object.hasOwn(this.uids, file)) {
      const uid = this.uids[file],
        f = this.files[uid],
        e = f.display
      var p, ee
      if (!e.childElementCount) {
        e.addEventListener('click', this.show_file_contents.bind(this))
        e.className = 'file'
        e.appendChild(document.createElement('p'))
        e.lastElementChild.innerText = f.content.name
        e.lastElementChild.className = 'file-name'
        e.appendChild(document.createElement('p'))
        e.lastElementChild.className = 'file-info'
        e.lastElementChild.appendChild(document.createElement('span'))
        e.lastElementChild.lastElementChild.className = 'file-info-entry'
        e.lastElementChild.lastElementChild.innerText = 'pulled: '
        e.lastElementChild.appendChild(document.createElement('span'))
        e.lastElementChild.appendChild(document.createElement('span'))
        e.lastElementChild.lastElementChild.className = 'file-info-entry'
        e.lastElementChild.lastElementChild.innerText = 'git sha: '
        e.lastElementChild.appendChild(document.createElement('span'))
        e.lastElementChild.appendChild(document.createElement('span'))
        e.lastElementChild.lastElementChild.className = 'file-info-entry'
        e.lastElementChild.lastElementChild.innerText = 'md5: '
        e.lastElementChild.appendChild(document.createElement('span'))
        p = Object.hasOwn(f.local, 'github') ? 'github' : 'dataverse'
        if (Object.hasOwn(f.local, p)) {
          e.lastElementChild.children[1].innerText = f.local[p].date
          e.lastElementChild.children[3].innerText = f.local[p].sha || 'none'
          e.lastElementChild.children[5].innerText = f.local[p].md5
        }
        e.appendChild(document.createElement('div'))
        e.lastElementChild.className = 'file-locations'
        for (p in f.local)
          if (Object.hasOwn(f.local, p)) {
            f.local[p].display = document.createElement('div')
            e.lastElementChild.appendChild(f.local[p].display)
            f.local[p].display.className = 'status-chip'
            f.local[p].display.appendChild((ee = document.createElement('a')))
            ee.target = '_blank'
            ee.rel = 'noreferrer'
            ee.href = this.make_file_link(uid, p)
            ee.innerText = p
            ee.className = p + '-file'
            f.local[p].display.appendChild(document.createElement('span'))
          }
        if (!e.lastElementChild.childElementCount) {
          console.log(f)
        }
      }
      return e
    } else return document.createElement('div')
  },
  show_file_contents: function (e) {
    console.log(this.files[e.target.getAttribute('hash')])
  },
  make_file_link: function (uid, provider) {
    const f = this.files[uid]
    if (f) {
      if ('github' === provider) {
        if (Object.hasOwn(f.local, 'github')) {
          return (
            f.local.github.parent.url +
            '/blob/' +
            ((f.local.github.parent.providers.github && f.local.github.parent.providers.github.default_branch) ||
              'master') +
            '/' +
            f.local.github.location +
            '/' +
            f.content.name
          )
        }
      }
      const pl = f.local[provider]
      if ('dataverse' === provider) {
        if (Object.hasOwn(f.local, 'dataverse')) {
          return pl.parent.server + 'file.xhtml?fileId=' + pl.id
        }
      }
    }
  },
  get_provider_link: function (provider, repo, api) {
    if ('github' === provider) {
      return api ? 'https://api.github.com/repos/' + repo + '/contents/data' : 'https://github.com/' + repo
    }
    const pl = this.repos[repo].distributions[provider]
    if ('dataverse' === provider) {
      return pl.server + (api ? 'api/datasets/:persistentId' : 'dataset.xhtml') + '?persistentId=doi:' + pl.doi
    }
  },
  request_provider: function (repo, provider) {
    const api = this.get_provider_link(provider, repo, true)
    if (api) {
      this.queues.distributions.push({repo: repo, provider: provider, url: api})
      this.prompt_dist_requester()
    }
  },
  prompt_dist_requester: async function () {
    for (var i = this.queues.distributions.length, r; i--; ) {
      r = this.queues.distributions[i]
      if ('github' === r.provider) {
        if (this.rates.github.resources.core.remaining > 0) {
          this.rates.github.resources.core.remaining--
        } else {
          if (Date.now() / 1e3 > this.rates.github.resources.core.reset) {
            if (!this.rates.github.resources.core.queued) {
              const f = new XMLHttpRequest()
              f.onreadystatechange = () => {
                if (4 === f.readyState) {
                  if (200 !== f.status) {
                    throw new TypeError('failed to retrieve github rate limit; ' + f.responseText)
                  } else {
                    this.rates.github = JSON.parse(f.responseText)
                    this.prompt_dist_requester()
                  }
                }
              }
              f.open('GET', 'https://api.github.com/rate_limit', true)
              f.send()
              this.rates.github.resources.core.queued = true
            }
          } else {
            this.page.toast._element.firstElementChild.firstElementChild.innerText = 'GitHub Rate Limit'
            this.page.toast._element.lastElementChild.innerText =
              "This IP has reached GitHub's API rate limit; this will reset at " +
              this.format.time(new Date(this.rates.github.resources.core.reset * 1e3)) +
              ' (in ' +
              Math.round((this.rates.github.resources.core.reset - Date.now() / 1e3) / 60) +
              ' minutes).'
            this.page.toast.show()
            this.requester.onmessage({
              data: JSON.stringify({
                response: JSON.stringify({
                  status: 'WARN',
                  message: this.page.toast._element.lastElementChild.innerText,
                }),
                repo: r.repo,
                provider: r.provider,
              }),
            })
            this.queues.distributions.splice(i, 1)
          }
          continue
        }
      }
      this.requester.postMessage(JSON.stringify(this.queues.distributions.splice(i, 1)[0]))
    }
  },
}
