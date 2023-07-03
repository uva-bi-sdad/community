'use strict'
function DataCommons(definition, manifest, views) {
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
  this.definition = definition
  this.manifest = manifest
  this.views = views
  this.named_view = {}
  this.counts = {views: 0, repos: 0, files: 0, variables: 0, ids: 0}
  this.variables = new Map()
  this.ids = {}
  this.repos = {}
  this.providers = {}
  this.dists = {}
  this.file_ids = {}
  this.files = {}
  this.page = {
    current_tab: '#search',
    menu: {
      check_all: document.getElementById('refresh_button'),
    },
    body: document.getElementsByClassName('content')[0],
    container: document.createElement('div'),
    tooltip: document.createElement('div'),
    tabs: {
      search: document.createElement('div'),
      repos: document.createElement('div'),
      views: document.createElement('div'),
    },
    modal: {
      frame: document.createElement('div'),
      title: document.createElement('div'),
      body: document.createElement('div'),
      files: document.createElement('div'),
      dashboards: document.createElement('div'),
      measure_info: document.createElement('div'),
    },
    views: {},
    repos: {},
    files: {},
    order: [],
  }
  this.page.body.appendChild(this.page.container)
  this.page.container.className = 'commons'
  this.page.container.appendChild(this.page.tabs.repos)
  this.page.container.appendChild(this.page.tabs.search)
  const m = this.page.modal
  document.body.appendChild(m.frame)
  m.frame.className = 'modal fade'
  m.frame.id = 'general_modal'
  m.frame.tabIndex = -1
  m.frame.setAttribute('data-bs-theme', 'dark')
  m.frame.setAttribute('aria-labelledby', 'general_modal_label')
  m.frame.setAttribute('aria-hidden', 'true')
  m.frame.appendChild(document.createElement('div'))
  m.frame.lastElementChild.className = 'modal-dialog'
  m.frame.lastElementChild.appendChild(document.createElement('div'))
  m.frame.lastElementChild.lastElementChild.className = 'modal-content'
  m.frame.lastElementChild.lastElementChild.appendChild(m.title)
  m.title.className = 'modal-header'
  m.title.appendChild(document.createElement('h3'))
  m.title.firstElementChild.className = 'modal-title'
  m.title.firstElementChild.id = 'general_modal_label'
  m.title.appendChild(document.createElement('button'))
  m.title.lastElementChild.type = 'button'
  m.title.lastElementChild.className = 'btn-close'
  m.title.lastElementChild.setAttribute('data-bs-dismiss', 'modal')
  m.title.lastElementChild.setAttribute('aria-label', 'Close')
  m.frame.lastElementChild.lastElementChild.appendChild(m.body)
  m.body.className = 'modal-body'
  m.body.appendChild(m.files)
  m.files.appendChild(document.createElement('h4'))
  m.files.lastElementChild.innerText = 'Data Files'
  m.files.appendChild(document.createElement('ul'))
  m.body.appendChild(m.dashboards)
  m.dashboards.appendChild(document.createElement('h4'))
  m.dashboards.lastElementChild.innerText = 'Dashboards'
  m.dashboards.appendChild(document.createElement('ul'))
  m.body.appendChild(m.measure_info)
  m.measure_info.appendChild(document.createElement('h4'))
  m.measure_info.lastElementChild.innerText = 'Measure Info'
  m.measure_info.appendChild(document.createElement('ul'))
  m.measure_info.appendChild(document.createElement('table'))
  !(() => {
    let e = document.createElement('div')
    this.page.tabs.search.appendChild(e)
    e.className = 'search-wrapper'
    e.appendChild((e = document.createElement('div')))
    e.className = 'search-field'
    e.appendChild(document.createElement('label'))
    e.lastElementChild.setAttribute('for', 'searchInput')
    e.lastElementChild.className = 'form-label'
    e.lastElementChild.innerText = 'Search Variables'
    e.appendChild(document.createElement('input'))
    e.lastElementChild.type = 'text'
    e.lastElementChild.id = 'searchInput'
    e.lastElementChild.className = 'form-control'
    e.lastElementChild.addEventListener('keyup', this.search.bind(this))
    this.page.tabs.search.firstElementChild.appendChild((e = document.createElement('div')))
    e.className = 'search-results'
  })()
  this.requester.onmessage = m => {
    const d = m.data
    if (d.response) {
      if (!json_start.test(d.response)) d.response = JSON.stringify({message: d.response})
      const resp = JSON.parse(d.response)
      var status = 200 !== d.status ? d.status : resp.status ? resp.status : resp.message ? 'ERROR' : 'OK'
      if ('provider' === d.type) {
        this.repos[d.repo].providers[d.provider + d.dir] = JSON.parse(d.response)
        const r = this.repos[d.repo],
          p = r.providers[d.provider + d.dir],
          mismatches = [],
          e = r.distributions[d.provider].display
        var i = 0,
          n = 0,
          fs,
          uid,
          any_matches = false
        e.lastElementChild.lastElementChild.className = ''
        if ('OK' === status) {
          e.classList.add('passed-check')
          e.classList.remove('failed-check')
          if ('github' === d.provider) {
            for (n = p.length; i < n; i++) {
              if (Object.hasOwn(this.file_ids, p[i].path)) {
                any_matches = true
                uid = this.file_ids[p[i].path]
                this.files[uid].remote.github = p[i]
                if (!Object.hasOwn(r.all_files, this.files[uid].local.github.md5)) mismatches.push(p[i].path)
              }
            }
          } else if ('dataverse' === d.provider) {
            for (fs = p.data.latestVersion.files, n = fs.length; i < n; i++) {
              if (Object.hasOwn(this.file_ids, fs[i].dataFile.filename)) {
                any_matches = true
                uid = this.file_ids[fs[i].dataFile.filename]
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
          e.classList.remove('passed-check')
          e.classList.add('failed-check')
          e.lastElementChild.setAttribute('aria-description', p.message)
        }
        e.lastElementChild.lastElementChild.innerText = status
        this.display_repo(d.repo)
      } else if ('view' === d.type) {
        const v = this.named_view[d.view]
        v.checks.github.lastElementChild.innerText = status
        if ('OK' === status) {
          var k, i, f
          for (k in resp)
            if (Object.hasOwn(resp, k)) {
              if (!Object.hasOwn(this.repos, k)) {
                resp.message = 'A listed repository is not a part of this data commons: ' + k + '.'
                status = 'FAIL'
                break
              }
              for (i = resp[k].files.length; i--; ) {
                f = resp[k].files[i]
                if (!Object.hasOwn(this.file_ids, f.md5)) {
                  resp.message = 'One of the files in ' + k + ' was not found in the data commons: ' + f.md5
                  status = 'FAIL'
                  break
                }
              }
            }
        }
        if ('OK' === status) {
          v.manifest = resp
          v.checks.github.classList.add('passed-check')
        } else {
          v.checks.github.lastElementChild.setAttribute('aria-description', resp.message)
          v.checks.github.classList.remove('passed-check')
          v.checks.github.classList.add('failed-check')
        }
      } else if ('datapackage' === d.type) {
        if (Object.hasOwn(d, 'index')) {
          this.named_view[d.view].view.children[d.index].datapackage = resp
          this.check_child(this.named_view[d.view], d.index)
        } else {
          this.named_view[d.view].datapackage = resp
          this.check_view(this.named_view[d.view])
        }
      }
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
    i,
    id = 0,
    file_prefix = /^.*(?:\d{4}(?:q\d)?_)|\..*$/g,
    json_start = /^[[{]/
  this.page.current_tab = window.location.hash || this.page.current_tab
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
  for (k in this.page.tabs)
    if (Object.hasOwn(this.page.tabs, k)) {
      this.page.menu[k] = e = document.createElement('button')
      e.addEventListener('click', this.show_tab.bind(this))
      this.page.menu.check_all.insertAdjacentElement('beforeBegin', e)
      e.innerText = k
      e.className = 'btn'
      e.type = 'button'
      p = k + '_tab'
      e.id = p + '_button'
      e.setAttribute('aria-controls', p)
      this.page.container.appendChild((e = this.page.tabs[k]))
      e.className = 'hidden'
      e.role = 'tabpanel'
      e.id = p
      e.setAttribute('aria-labelledby', p + '_button')
      if (this.page.current_tab === '#' + k) this.show_tab({target: this.page.menu[k]})
    }
  for (k in manifest.repos)
    if (Object.hasOwn(manifest.repos, k)) {
      this.counts.repos++
      r = this.repos[k] = manifest.repos[k]
      r.checks = {}
      r.providers = {}
      r.file_ids = []
      r.ufiles = {}
      r.all_files = manifest.files[k]
      r.variables = {}
      for (h in r.all_files)
        if (Object.hasOwn(r.all_files, h)) {
          f = r.all_files[h]
          fn = f.name
          if ('string' === typeof f.providers) f.providers = [f.providers]
          uid = ''
          if (Object.hasOwn(this.file_ids, h)) {
            uid = this.file_ids[h]
          } else if (Object.hasOwn(this.file_ids, fn)) {
            uid = this.file_ids[fn]
          }
          if (!uid) {
            uid = 'f' + id++
            this.file_ids[h] = this.file_ids[fn] = uid
          }
          f.uid = uid
          if (!Object.hasOwn(this.files, uid)) {
            this.counts.files++
            this.files[uid] = {
              content: f,
              local: {},
              remote: {},
              display: document.createElement('div'),
            }
            f.prefix = f.name.replace(file_prefix, '')
            if (f.variables) {
              if ('string' === typeof f.variables) f.variables = [f.variables]
              for (i = f.variables.length; i--; ) {
                p = f.variables[i]
                if (!(p in r.variables)) {
                  this.counts.variables++
                  const e = document.createElement('div')
                  r.variables[p] = {
                    string: p.toLowerCase(),
                    display: e,
                    files: [],
                    repos: [],
                    info: {},
                    info_files: [],
                  }
                  this.variables.set(p, r.variables[p])
                  e.className = 'variable'
                  e.appendChild(document.createElement('button'))
                  e.lastElementChild.type = 'button'
                  e.lastElementChild.innerText = p
                  e.lastElementChild.className = 'btn'
                  e.lastElementChild.setAttribute('data-bs-toggle', 'modal')
                  e.lastElementChild.setAttribute('data-bs-target', '#general_modal')
                  e.lastElementChild.addEventListener(
                    'click',
                    function (e, v) {
                      const s = v.info
                      this.page.modal.title.firstElementChild.innerText = s.short_name || s.long_name
                      this.page.modal.files.lastElementChild.innerHTML = ''
                      v.files.forEach(f => {
                        const li = document.createElement('li')
                        li.appendChild(document.createElement('a'))
                        li.lastElementChild.target = '_blank'
                        li.lastElementChild.rel = 'noreferrer'
                        li.lastElementChild.innerText = v.repos[0] + ': ' + f.content.name
                        li.lastElementChild.href = this.repos[v.repos[0]].base_url + '/' + f.content.name
                        this.page.modal.files.lastElementChild.appendChild(li)
                      })
                      this.page.modal.dashboards.lastElementChild.innerHTML = ''
                      this.views.forEach(view => {
                        if (v.name in view.variables) {
                          const li = document.createElement('li')
                          li.appendChild(document.createElement('a'))
                          li.lastElementChild.target = '_blank'
                          li.lastElementChild.rel = 'noreferrer'
                          li.lastElementChild.href = view.view.url + '?selected_variable=' + v.name
                          li.lastElementChild.innerText = view.name
                          this.page.modal.dashboards.lastElementChild.appendChild(li)
                        }
                      })
                      this.page.modal.measure_info.children[1].innerHTML = ''
                      v.info_files.forEach(f => {
                        f = f.replace(/^[^\/]+\//, '')
                        const li = document.createElement('li')
                        li.appendChild(document.createElement('a'))
                        li.lastElementChild.target = '_blank'
                        li.lastElementChild.rel = 'noreferrer'
                        li.lastElementChild.innerText = v.repos[0] + ': ' + f
                        li.lastElementChild.href = this.repos[v.repos[0]].base_url + '/' + f
                        this.page.modal.measure_info.children[1].appendChild(li)
                      })
                      this.page.modal.measure_info.lastElementChild.innerHTML = ''
                      this.page.modal.measure_info.appendChild(
                        this.display_object({measure: v.name, ...s}, this.page.modal.measure_info.lastElementChild)
                      )
                    }.bind(this, null, r.variables[p])
                  )
                  e.appendChild(document.createElement('p'))
                  e.lastElementChild.className = 'variable-name'
                  e.appendChild(document.createElement('p'))
                }
                const v = r.variables[p]
                v.files.push(this.files[uid])
                if (-1 === v.repos.indexOf(k)) v.repos.push(k)
              }
            }
            if (f.ids) {
              if ('string' === typeof f.ids) f.ids = [f.ids]
              f.ids.forEach(id => {
                if (!(id in this.ids)) {
                  this.counts.ids++
                  const e = document.createElement('div')
                  this.ids[id] = {display: e, files: []}
                  e.className = 'id'
                  e.appendChild(document.createElement('p'))
                  e.lastElementChild.innerText = id
                  e.lastElementChild.className = 'h5'
                }
                this.ids[id].files.push(this.files[uid])
              })
            }
          }
          if (!Object.hasOwn(r.ufiles, uid)) {
            r.file_ids.push(uid)
            r.ufiles[uid] = this.files[uid]
          }
          if (Object.hasOwn(r.files, fn)) {
            r.files[fn].uid = uid
            r.files[fn].parent = r
            r.url = 'https://github.com/' + k
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
              }
            }
        }
      this.page.tabs.repos.appendChild(this.display_repo(k))
    }
  Object.keys(manifest.variables).forEach(file => {
    const infos = manifest.variables[file]
    Object.keys(infos).forEach(v => {
      if (this.variables.has(v)) {
        const r = this.variables.get(v)
        r.info_files.push(file)
        r.name = v
        r.info = infos[v]
        r.display.children[0].innerText = r.info.short_name || r.info.long_name || v
        r.display.children[1].innerText = v
        r.display.children[2].innerText = r.info.short_description || r.info.long_description || ''
        r.string += ' ' + JSON.stringify(r.info).toLowerCase()
      }
    })
  })
  this.counts.views = views.length
  for (i = views.length; i--; ) {
    this.named_view[views[i].name] = views[i]
    views[i].parent = this
    views[i].checks = {}
    this.page.tabs.views.appendChild(this.display_view(views[i]))
    if (Object.hasOwn(views[i].view, 'remote'))
      this.requester.postMessage({
        type: 'datapackage',
        view: views[i].name,
        url: 'https://raw.githubusercontent.com/' + views[i].view.remote + '/main/docs/data/datapackage.json',
      })
  }
}

DataCommons.prototype = {
  constructor: DataCommons,
  requester: new Worker('request.js'),
  rates: {
    github: {resources: {core: {remaining: 0, reset: -Infinity}}},
  },
  queues: {
    distributions: [],
  },
  format: {
    date: Intl.DateTimeFormat('en-us', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit',
    }).format,
    time: Intl.DateTimeFormat('en-us', {hour: 'numeric', minute: 'numeric'}).format,
    size: function (b) {
      return b < 1e6 ? b / 1e3 + ' KB' : b < 1e9 ? b / 1e6 + ' MB' : b / 1e9 + ' GB'
    },
  },
  checks: {
    has_files: {
      name: 'Files',
      domain: 'repo',
      description: 'Number of latent files between the repository and distributions.',
      check: function (r) {
        return r.file_ids.length
      },
    },
    has_dist: {
      name: 'Dist',
      domain: 'repo',
      description: 'Has an associated distribution repository.',
      check: function (r) {
        return Object.keys(r.distributions).length > 1
      },
    },
    aligned: {
      name: 'Aligned',
      domain: 'repo',
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
                f.local[k].display.classList[fck && s === 'local' ? 'add' : 'remove']('pending-check')
                f.local[k].display.classList[fck ? 'remove' : 'add']('failed-check')
                f.local[k].display.lastElementChild.setAttribute('aria-description', 'Source: ' + s)
                f.local[k].display.lastElementChild.innerText = f[s][k][h]
              }
          }
        return ck
      }.bind(this),
    },
    missed_variables: {
      name: 'All Variables',
      domain: 'view',
      description: 'All of the requested variables were found in a dataset.',
      check: function (v) {
        v.missed_variables = []
        for (var all = true, i = v.view.variables.length, name; i--; ) {
          name = v.view.variables[i]
          if (v.parent.variables.has(name)) {
            v.variables[name].firstElementChild.innerText = v.parent.variables.get(name).files.length
            v.variables[name].firstElementChild.classList.add('passed-check')
          } else {
            v.variables[name].firstElementChild.classList.remove('passed-check')
            v.variables[name].firstElementChild.innerText = 0
            v.missed_variables.push(name)
            all = false
          }
        }
        return all
      },
    },
    missed_ids: {
      name: 'All IDs',
      domain: 'view',
      description: 'All of the requested IDs were found in a dataset.',
      check: function (v) {
        v.missed_ids = []
        for (var all = true, i = v.view.ids.length, id; i--; ) {
          id = v.view.ids[i]
          if (Object.hasOwn(v.parent.ids, id)) {
            v.ids[id].firstElementChild.innerText = v.parent.ids[id].files.length
            v.ids[id].classList.add('hidden')
          } else {
            v.ids[id].firstElementChild.innerText = 0
            v.ids[id].classList.remove('hidden')
            v.missed_ids.push(id)
            all = false
          }
        }
        return all
      },
    },
    datapackage: {
      name: 'datapackage',
      domain: 'view',
      description: 'Retrieved the associated datapackage.json file.',
      check: function (v) {
        return Object.hasOwn(v, 'datapackage')
      },
    },
    updated: {
      name: 'Up-To-Date',
      domain: 'child',
      description: "The child site's datapackage points to the same files as the parent's.",
      check: function (v, ch) {
        if (Object.hasOwn(v, 'datapackage')) {
          var ck = false,
            i = v.datapackage.resources.length
          if (
            Object.hasOwn(v.view.children[ch], 'datapackage') &&
            i === v.view.children[ch].datapackage.resources.length
          )
            for (; i--; ) {
              ck = v.datapackage.resources[i].md5 === v.view.children[ch].datapackage.resources[i].md5
              if (!ck) break
            }
          return ck
        } else return true
      },
    },
  },
  show_tab: function (e) {
    if (!e.target.classList.contains('active') && Object.hasOwn(this.page.tabs, e.target.innerText)) {
      const c = e.target.parentElement.getElementsByClassName('active')
      for (var i = c.length; i--; ) {
        this.page.tabs[c[i].innerText].classList.add('hidden')
        c[i].classList.remove('disabled')
        c[i].classList.remove('active')
      }
      this.page.tabs[e.target.innerText].classList.remove('hidden')
      e.target.classList.add('disabled')
      e.target.classList.add('active')
      this.page.current_tab = e.target.innerText
      window.history.replaceState(Date.now(), '', '#' + this.page.current_tab)
    }
  },
  check_repo: function (r) {
    for (var k in this.checks)
      if (Object.hasOwn(this.checks, k) && 'repo' === this.checks[k].domain) {
        const ck = this.checks[k].check(r)
        r.checks[k].lastElementChild.innerText = ck
        r.checks[k].classList[ck ? 'remove' : 'add']('failed-check')
      }
  },
  check_view: function (v) {
    var k, i
    for (k in this.checks)
      if (Object.hasOwn(this.checks, k) && 'view' === this.checks[k].domain) {
        const ck = this.checks[k].check(v)
        v.checks[k].lastElementChild.innerText = ck
        v.checks[k].classList[ck ? 'remove' : 'add']('failed-check')
        if ('missed_ids' === k || 'missed_variables' === k)
          this.page.views[v.name].lastElementChild.children['missed_ids' === k ? 2 : 1].classList[
            ck ? 'add' : 'remove'
          ]('hidden')
      }
    if (Object.hasOwn(v.view, 'children')) for (i = v.view.children.length; i--; ) this.check_child(v, i)
  },
  check_child: function (v, ch) {
    for (var k in this.checks)
      if (Object.hasOwn(this.checks, k) && 'child' === this.checks[k].domain) {
        const ck = this.checks[k].check(v, ch)
        v.view.children[ch].parts[k].lastElementChild.innerText = ck
        v.view.children[ch].parts[k].classList[ck ? 'remove' : 'add']('failed-check')
      }
  },
  display_object: function (s, t) {
    if (!t) t = document.createElement('table')
    Object.keys(s).forEach(f => {
      const r = document.createElement('tr'),
        h = document.createElement('th'),
        c = document.createElement('td')
      r.appendChild(h)
      r.appendChild(c)
      h.innerText = f
      if (Array.isArray(s[f])) {
        if ('string' === typeof s[f][0]) {
          c.innerText = s[f].join(', ')
        } else {
          s[f].forEach(e => {
            c.appendChild(this.display_object(e))
          })
        }
      } else if ('object' === typeof s[f]) {
        c.appendChild(this.display_object(s[f]))
      } else {
        c.innerText = s[f]
      }
      t.appendChild(r)
    })
    return t
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
        ee.className = 'repo_links card-links'
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
        ee.className = 'repo_status card-status'
        for (h in this.checks)
          if (Object.hasOwn(this.checks, h) && 'repo' === this.checks[h].domain) {
            ee.appendChild((r.checks[h] = document.createElement('div')))
            ee.lastElementChild.className = 'status-chip'
            ee.lastElementChild.setAttribute('aria-description', this.checks[h].description)
            ee.lastElementChild.appendChild(document.createElement('span'))
            ee.lastElementChild.firstElementChild.innerText = this.checks[h].name
            ee.lastElementChild.appendChild(document.createElement('span'))
          }
        e.lastElementChild.appendChild((ee = document.createElement('div')))
        ee.className = 'repo_files card-section accordion'
        ee.id = 'file-list-container-' + repo
        ee.setAttribute('data-bs-theme', 'dark')
        ee.appendChild((ee = document.createElement('div')))
        ee.className = 'accordion-item'
        ee.appendChild((ee = document.createElement('h2')))
        ee.className = 'accordion-header'
        ee.appendChild(document.createElement('button'))
        ee.lastElementChild.innerText = 'Data Files'
        ee.lastElementChild.className = 'accordion-button collapsed'
        ee.lastElementChild.type = 'button'
        ee.lastElementChild.setAttribute('data-bs-toggle', 'collapse')
        ee.lastElementChild.setAttribute('data-bs-target', '#file-list-' + repo)
        ee.lastElementChild.setAttribute('aria-expanded', 'false')
        ee.lastElementChild.setAttribute('aria-controls', 'file-list-' + repo)
        ee.insertAdjacentElement('afterend', (ee = document.createElement('div')))
        ee.id = 'file-list-' + repo
        ee.className = 'accordion-collapse collapse'
        ee.setAttribute('data-bs-parent', '#file-list-container-' + repo)
        ee.appendChild((ee = document.createElement('div')))
        for (h in r.all_files)
          if (Object.hasOwn(r.all_files, h)) {
            ee.appendChild(this.display_file(h))
          }
      }
      this.check_repo(r)
    }
    return e
  },
  display_file: function (file) {
    if (Object.hasOwn(this.file_ids, file)) {
      const uid = this.file_ids[file],
        f = this.files[uid],
        e = f.display
      var p, ee
      if (!e.childElementCount) {
        e.className = 'entry'
        e.appendChild(document.createElement('p'))
        e.lastElementChild.innerText = f.content.name
        e.lastElementChild.className = 'entry-name'
        e.appendChild(document.createElement('p'))
        e.lastElementChild.className = 'entry-info'
        e.lastElementChild.appendChild(document.createElement('span'))
        e.lastElementChild.lastElementChild.className = 'entry-info-entry'
        e.lastElementChild.lastElementChild.innerText = 'git sha: '
        e.lastElementChild.appendChild(document.createElement('span'))
        e.lastElementChild.appendChild(document.createElement('span'))
        e.lastElementChild.lastElementChild.className = 'entry-info-entry'
        e.lastElementChild.lastElementChild.innerText = 'md5: '
        e.lastElementChild.appendChild(document.createElement('span'))
        p = Object.hasOwn(f.local, 'github') ? 'github' : 'dataverse'
        if (Object.hasOwn(f.local, p)) {
          e.lastElementChild.children[1].innerText = f.local[p].sha || 'none'
          e.lastElementChild.children[3].innerText = f.local[p].md5
        } else {
          e.lastElementChild.classList.add('hidden')
        }
        e.appendChild(document.createElement('div'))
        e.lastElementChild.className = 'entry-checks'
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
      }
      return e
    } else return document.createElement('div')
  },
  display_view: function (v) {
    const exists = Object.hasOwn(this.page.views, v.name),
      e = exists ? this.page.views[v.name] : document.createElement('div')
    var h, ee, eee, i, w
    if (!exists) {
      v.variables = {}
      v.ids = {}
      this.page.views[v.name] = e
      e.className = 'view_container card'
      e.appendChild((ee = document.createElement('div')))
      ee.className = 'view_header card-header'
      ee.appendChild(document.createElement('span'))
      if (v.view.url) {
        ee.lastElementChild.appendChild((eee = document.createElement('a')))
        eee.target = '_blank'
        eee.rel = 'noreferrer'
        eee.href = v.view.url
        eee.innerText = v.name
      } else {
        ee.lastElementChild.innerText = v.name
      }
      ee.appendChild((ee = document.createElement('span')))
      ee.className = 'view_links card-links'
      if (v.view.remote) {
        ee.appendChild(document.createElement('div'))
        ee.lastElementChild.className = 'status-chip'
        v.checks.github = ee.lastElementChild
        ee.lastElementChild.appendChild((eee = document.createElement('a')))
        eee.target = '_blank'
        eee.rel = 'noreferrer'
        eee.href = 'https://github.com/' + v.view.remote
        eee.innerText = 'github'
        ee.lastElementChild.appendChild((eee = document.createElement('button')))
        eee.className = 'btn'
        eee.appendChild(document.createElement('span'))
        eee.lastElementChild.innerText = 'check'
        eee.addEventListener(
          'click',
          this.request_manifest.bind(
            this,
            v,
            'https://raw.githubusercontent.com/' + v.view.remote + '/main/docs/data/manifest.json'
          )
        )
      }
      e.appendChild(document.createElement('div'))
      e.lastElementChild.className = 'view_body card-body'
      e.lastElementChild.appendChild((ee = document.createElement('div')))
      ee.className = 'view_status card-status'
      for (h in this.checks)
        if (Object.hasOwn(this.checks, h) && 'view' === this.checks[h].domain) {
          ee.appendChild((v.checks[h] = document.createElement('div')))
          ee.lastElementChild.className = 'status-chip'
          ee.lastElementChild.setAttribute('aria-description', this.checks[h].description)
          ee.lastElementChild.appendChild(document.createElement('span'))
          ee.lastElementChild.firstElementChild.innerText = this.checks[h].name
          ee.lastElementChild.appendChild(document.createElement('span'))
        }

      // variable table
      e.lastElementChild.appendChild((eee = document.createElement('div')))
      eee.className = 'card-section'
      eee.appendChild(document.createElement('p'))
      eee.lastElementChild.innerText = 'Variables'
      eee.lastElementChild.className = 'card-section-header'
      eee.appendChild(document.createElement('table'))
      eee.lastElementChild.appendChild(document.createElement('thead'))
      eee.lastElementChild.lastElementChild.appendChild(document.createElement('tr'))
      eee.lastElementChild.lastElementChild.lastElementChild.appendChild(document.createElement('th'))
      eee.lastElementChild.lastElementChild.lastElementChild.lastElementChild.innerText = 'Files'
      eee.lastElementChild.lastElementChild.lastElementChild.appendChild(document.createElement('th'))
      eee.lastElementChild.lastElementChild.lastElementChild.lastElementChild.innerText = 'Name'
      eee.lastElementChild.appendChild((eee = document.createElement('tbody')))
      for (w = 0, i = v.view.variables.length; i--; ) {
        eee.appendChild((v.variables[v.view.variables[i]] = document.createElement('tr')))
        eee.lastElementChild.appendChild(document.createElement('td'))
        eee.lastElementChild.lastElementChild.innerText = 0
        eee.lastElementChild.appendChild(document.createElement('td'))
        eee.lastElementChild.lastElementChild.innerText = v.view.variables[i]
        if (v.view.variables[i].length > w) w = v.view.variables[i].length
      }

      // ids table
      e.lastElementChild.appendChild((eee = document.createElement('div')))
      eee.className = 'card-section'
      eee.appendChild(document.createElement('p'))
      eee.lastElementChild.innerText = 'Missing IDs'
      eee.lastElementChild.className = 'card-section-header'
      eee.appendChild(document.createElement('table'))
      eee.lastElementChild.appendChild(document.createElement('thead'))
      eee.lastElementChild.lastElementChild.appendChild(document.createElement('tr'))
      eee.lastElementChild.lastElementChild.lastElementChild.appendChild(document.createElement('th'))
      eee.lastElementChild.lastElementChild.lastElementChild.lastElementChild.innerText = 'Files'
      eee.lastElementChild.lastElementChild.lastElementChild.appendChild(document.createElement('th'))
      eee.lastElementChild.lastElementChild.lastElementChild.lastElementChild.innerText = 'ID'
      eee.lastElementChild.appendChild((eee = document.createElement('tbody')))
      for (w = 0, i = v.view.ids.length; i--; ) {
        eee.appendChild((v.ids[v.view.ids[i]] = document.createElement('tr')))
        eee.lastElementChild.classList.add('hidden')
        eee.lastElementChild.appendChild(document.createElement('td'))
        eee.lastElementChild.lastElementChild.innerText = 0
        eee.lastElementChild.appendChild(document.createElement('td'))
        eee.lastElementChild.lastElementChild.innerText = v.view.ids[i]
        if (v.view.ids[i].length > w) w = v.view.ids[i].length
      }

      if (v.view.children.length) {
        v.checks.children = []
        e.lastElementChild.appendChild((ee = document.createElement('div')))
        ee.className = 'card-section'
        ee.appendChild(document.createElement('p'))
        ee.lastElementChild.innerText = 'Children'
        ee.lastElementChild.className = 'card-section-header'
        for (i = v.view.children.length; i--; ) {
          eee = document.createElement('div')
          eee.className = 'status-chip'
          eee.appendChild(document.createElement('span'))
          eee.firstElementChild.innerText = 'github'
          eee.appendChild(document.createElement('a'))
          eee.lastElementChild.target = '_blank'
          eee.lastElementChild.rel = 'noreferrer'
          eee.lastElementChild.innerText = v.view.children[i].remote
          eee.lastElementChild.href = 'https://github.com/' + v.view.children[i].remote
          v.view.children[i].parts = {repo: eee}
          for (h in this.checks)
            if (Object.hasOwn(this.checks, h) && 'child' === this.checks[h].domain) {
              v.view.children[i].parts[h] = eee = document.createElement('div')
              eee.className = 'status-chip'
              eee.appendChild(document.createElement('span'))
              eee.firstElementChild.innerText = this.checks[h].name
              eee.appendChild(document.createElement('span'))
            }
          ee.appendChild(document.createElement('div'))
          ee.lastElementChild.className = 'entry'
          ee.lastElementChild.appendChild(document.createElement('p'))
          ee.lastElementChild.lastElementChild.appendChild((eee = document.createElement('a')))
          eee.parentElement.className = 'entry-name'
          eee.target = '_blank'
          eee.rel = 'noreferrer'
          eee.innerText = v.view.children[i].name
          eee.href = v.view.children[i].url
          ee.lastElementChild.appendChild((eee = document.createElement('div')))
          eee.className = 'entry-checks'
          for (h in v.view.children[i].parts)
            if (Object.hasOwn(v.view.children[i].parts, h)) eee.appendChild(v.view.children[i].parts[h])
          this.requester.postMessage({
            type: 'datapackage',
            view: v.name,
            index: i,
            url: 'https://raw.githubusercontent.com/' + v.view.children[i].remote + '/main/docs/data/datapackage.json',
          })
        }
      }
    }
    this.check_view(v)
    return e
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
              'main') +
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
      return api ? 'https://api.github.com/repos/' + repo + '/contents/' : 'https://github.com/' + repo
    }
    const pl = this.repos[repo].distributions[provider]
    if ('dataverse' === provider) {
      return pl.server + (api ? 'api/datasets/:persistentId' : 'dataset.xhtml') + '?persistentId=doi:' + pl.doi
    }
  },
  request_manifest: function (o, url) {
    this.requester.postMessage({type: 'view', view: o.name, url: url})
  },
  request_provider: function (repo, provider) {
    const api = this.get_provider_link(provider, repo, true)
    if (api) {
      const dirname = /\/[^\/]+$/,
        dirs = [],
        files = this.repos[repo].files
      Object.keys(files).forEach(f => {
        files[f].display && files[f].display.classList.add('failed-check')
        const path = f.replace(dirname, '')
        if (-1 === dirs.indexOf(path)) dirs.push(path)
      })
      dirs.forEach(dir => {
        this.queues.distributions.push({
          type: 'provider',
          repo: repo,
          provider: provider,
          dir: dir,
          url: api + '/' + dir,
        })
      })
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
          if (Date.now() > this.rates.github.resources.core.reset) {
            if (!this.rates.github.resources.core.queued) {
              const f = new XMLHttpRequest()
              f.onreadystatechange = () => {
                if (4 === f.readyState) {
                  if (200 !== f.status) {
                    throw new TypeError('failed to retrieve github rate limit; ' + f.responseText)
                  } else {
                    this.rates.github = JSON.parse(f.responseText)
                    this.rates.github.resources.core.reset = Date.now() + this.rates.github.resources.core.reset / 1e3
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
              this.format.time(new Date(this.rates.github.resources.core.reset)) +
              ' (in ' +
              Math.round((this.rates.github.resources.core.reset - Date.now()) / 6e4) +
              ' minutes).'
            this.page.toast.show()
            this.requester.onmessage({
              data: {
                response: JSON.stringify({
                  status: 'WARN',
                  message: this.page.toast._element.lastElementChild.innerText,
                }),
                repo: r.repo,
                provider: r.provider,
              },
            })
            this.queues.distributions.splice(i, 1)
          }
          continue
        }
      }
      this.requester.postMessage(this.queues.distributions.splice(i, 1)[0])
    }
  },
  search: function (e) {
    const o = this.page.tabs.search.firstElementChild.lastElementChild
    const q = (e.target ? e.target.value : e).toLowerCase()
    o.innerHTML = ''
    if (q.length > 1) {
      const matches = document.createElement('div')
      this.variables.forEach((v, name) => {
        if (v.string.includes(q)) {
          matches.appendChild(v.display)
        }
      })
      o.appendChild(matches)
    }
  },
}

if ('undefined' !== typeof module) module.export = DataCommons
