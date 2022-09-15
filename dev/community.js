void (function () {
  const community = function (window, document, site) {
    'use strict'
    const palettes = {
        // discrete palettes from https://colorbrewer2.org
        rdylbu7: {
          name: 'Red-Yellow-Blue (7)',
          type: 'discrete',
          colors: ['#d73027', '#fc8d59', '#fee090', '#adadad', '#e0f3f8', '#91bfdb', '#4575b4'],
        },
        orrd7: {
          name: 'Orange-Red (7)',
          type: 'discrete',
          colors: ['#fef0d9', '#fdd49e', '#fdbb84', '#fc8d59', '#ef6548', '#d7301f', '#990000'],
        },
        gnbu7: {
          name: 'Green-Blue (7)',
          type: 'discrete',
          colors: ['#a8ddb5', '#ccebc5', '#f0f9e8', '#adadad', '#4eb3d3', '#2b8cbe', '#08589e'],
        },
        brbg7: {
          name: 'Brown-Teal (7)',
          type: 'discrete',
          colors: ['#8c510a', '#d8b365', '#f6e8c3', '#adadad', '#c7eae5', '#5ab4ac', '#01665e'],
        },
        puor7: {
          name: 'Purple-Orange (7)',
          type: 'discrete',
          colors: ['#b35806', '#f1a340', '#fee0b6', '#adadad', '#d8daeb', '#998ec3', '#542788'],
        },
        prgn6: {
          name: 'Purple-Green (6)',
          type: 'discrete',
          colors: ['#762a83', '#af8dc3', '#e7d4e8', '#d9f0d3', '#7fbf7b', '#1b7837'],
        },
        reds5: {
          name: 'Red (5)',
          type: 'discrete',
          colors: ['#f1eef6', '#d7b5d8', '#df65b0', '#dd1c77', '#980043'],
        },
        greens5: {
          name: 'Green (5)',
          type: 'discrete',
          colors: ['#ffffcc', '#c2e699', '#78c679', '#31a354', '#006837'],
        },
        paired4: {
          name: 'Blue-Green (4)',
          type: 'discrete',
          colors: ['#1f78b4', '#a6cee3', '#b2df8a', '#33a02c'],
        },
        greys4: {
          name: 'Grey (4)',
          type: 'discrete',
          colors: ['#f7f7f7', '#cccccc', '#969696', '#525252'],
        },
        grey: {
          name: 'Grey',
          type: 'continuous',
          colors: [
            [
              [70, 70, 70],
              [80, 80, 80],
            ],
            [150, 150, 150],
            [
              [230, 230, 230],
              [-80, -80, -80],
            ],
          ],
        },
        brown: {
          name: 'Brown',
          type: 'continuous',
          colors: [
            [
              [131, 30, 0],
              [62, 85, 95],
            ],
            [193, 115, 95],
            [
              [255, 200, 190],
              [-62, -85, -95],
            ],
          ],
        },
        purple: {
          name: 'Purple',
          type: 'continuous',
          colors: [
            [
              [90, 14, 213],
              [52.5, 89, 16],
            ],
            [142.5, 103, 229],
            [
              [195, 192, 245],
              [-52.5, -89, -16],
            ],
          ],
        },
        prgn: {
          name: 'Purple-Green',
          type: 'continuous-divergent',
          colors: [
            [
              [27, 120, 55],
              [207, 107, 168.5],
            ],
            [234, 227, 223.5],
            [
              [118, 42, 131],
              [116, 185, 92.5],
            ],
          ],
        },
        puor: {
          name: 'Purple-Orange',
          type: 'continuous-divergent',
          colors: [
            [
              [179, 88, 6],
              [56, 133, 202.5],
            ],
            [235, 221, 208.5],
            [
              [84, 39, 136],
              [151, 182, 72.5],
            ],
          ],
        },
        rdbu: {
          name: 'Red-Blue',
          type: 'continuous-divergent',
          colors: [
            [
              [69, 117, 180],
              [170, 116.5, 16],
            ],
            [239, 233.5, 196],
            [
              [215, 48, 39],
              [24, 185.5, 157],
            ],
          ],
        },
        vik: {
          name: 'vik',
          type: 'continuous-polynomial',
          colors: [
            [97.031, 18.4251, 0.4149],
            [461.7602, 637.5326, 244.4647],
            [-2434.798, -2838.5427, -5893.4695],
            [9665.3469, 14405.823, 44072.722],
            [-2575.9109, -25871.106, -109792.1319],
            [-42510.0569, 8528.3288, 120953.8594],
            [63342.3061, 14006.291, -59644.4457],
            [-26045.0391, -8868.9621, 10155.5667],
          ],
        },
        lajolla: {
          name: 'lajolla',
          type: 'continuous-polynomial',
          colors: [
            [256.0016, 255.9138, 204.945],
            [-187.6735, -46.2889, -768.5655],
            [1022.785, -1057.5602, 1782.0325],
            [-2032.382, 1490.8271, -1785.9056],
            [966.8373, -617.1949, 567.7715],
          ],
        },
      },
      patterns = {
        seps: /[\s._-]/g,
        period: /\./,
        all_periods: /\./g,
        word_start: /\b(\w)/g,
        settings: /^settings\./,
        features: /^features\./,
        filter: /^filter\./,
        data: /^data\./,
        variables: /^variables\./,
        palette: /^pal/,
        datasets: /^dat/,
        variable: /^var/,
        levels: /^lev/,
        ids: /^ids/,
        minmax: /^m[inax]{2}$/,
        int_types: /^(?:year|integer)$/,
        end_punct: /[.?!]$/,
        mustache: /\{(.*?)\}/g,
        measure_name: /(?:^measure|_name)$/,
        http: /^https?:\/\//,
        bool: /^(?:true|false)$/,
        number: /^[\d-][\d.,]*$/,
        leading_zeros: /^0+/,
        url_spaces: /%20/g,
        hashes: /#/g,
        embed_setting: /^(?:hide_|navcolor|close_menus)/,
        median: /^med/i,
        location_string: /^[^?]*/,
      },
      tooltip_icon_rule =
        'button.has-note::after,.button-wrapper.has-note button::before,.has-note legend::before,.has-note label::before,.wrapper.has-note > div > label::before{display:none}',
      conditionals = {
        setting: function (u) {
          const v = u.value(),
            theme = v ? 'dark' : 'light'
          if (v !== site.settings[u.setting]) {
            site.settings[u.setting] = v
            if ('theme_dark' === u.setting) {
              v
                ? document.body.classList.replace('light-theme', 'dark-theme')
                : document.body.classList.replace('dark-theme', 'light-theme')
              if (site.plotly) Object.keys(site.plotly).forEach(k => update_plot_theme(site.plotly[k].u))
              if (site.map)
                Object.keys(site.map).forEach(k => {
                  const u = site.map[k].u
                  if (u && theme in u.tiles) {
                    Object.keys(u.tiles).forEach(l => {
                      if (theme !== l) u.tiles[l].removeFrom(u.map)
                    })
                    u.tiles[theme].addTo(u.map)
                  }
                })
            } else if ('hide_url_parameters' === u.setting) {
              window.history.replaceState(
                Date.now(),
                '',
                site.settings.hide_url_parameters
                  ? window.location.protocol + '//' + window.location.host + window.location.pathname
                  : get_options_url()
              )
            } else if ('hide_tooltips' === u.setting) {
              v ? page.script_style.sheet.insertRule(tooltip_icon_rule, 0) : page.script_style.sheet.removeRule(0)
            } else if ('map_overlay' === u.setting) {
              Object.keys(site.map).forEach(id => {
                if ('_' !== id[0]) {
                  if (v) {
                    site.map[id].u.update()
                  } else {
                    site.map[id].u.overlay.clearLayers()
                    site.map[id].u.overlay_control.remove()
                  }
                }
              })
            } else {
              global_update()
            }
            storage.set(u.setting, site.settings[u.setting])
          }
        },
        options: function (u) {
          const no_view = !u.view || !site.dataviews[u.view].selection,
            d = valueOf(u.dataset),
            va = valueOf(u.variable),
            k = d + (va ? va : '')
          if (!(k in u.option_sets)) {
            if (patterns.variable.test(u.options_source)) {
              fill_variables_options(u, d, u.option_sets)
            } else if (patterns.levels.test(u.options_source)) {
              fill_levels_options(u, d, va, u.option_sets)
            } else if (patterns.ids.test(u.options_source)) {
              fill_ids_options(u, d, u.option_sets)
            }
          }
          if (k in u.option_sets) {
            const fresh = k !== u.current_set && (u.sensitive || !u.current_set)
            if (fresh) {
              u.e.innerHTML = ''
              u.values = u.option_sets[k].values
              u.display = u.option_sets[k].display
              u.options = u.option_sets[k].options
            }
            var ns = 0
            if ('ID' === u.variable || 'ids' === u.options_source) {
              const v = no_view ? {} : site.dataviews[u.view].selection[u.subset]
              u.options.forEach(si => {
                if (fresh) u.e.appendChild(si)
                if (no_view || si.value in v) {
                  si.classList.remove('hidden')
                  ns++
                } else {
                  si.classList.add('hidden')
                }
              })
            } else if (fresh) {
              u.options.forEach(si => {
                si.classList.remove('hidden')
                u.e.appendChild(si)
                ns++
              })
            } else ns++
            u.e[ns ? 'removeAttribute' : 'setAttribute']('disabled', true)
            u.current_set = k
            if (fresh) {
              u.e.selectedIndex = -1
              u.source = ''
            }
            fresh ? (u.id in site.url_options ? u.set(site.url_options[u.id]) : u.reset()) : u.set(u.value())
            if (u.filter) u.filter()
          }
        },
        min: async function (u, c) {
          var cv = c.value(),
            uv = u.value(),
            v = _u[u.view || c.view],
            variable
          if (patterns.minmax.test(cv)) cv = c.parsed.min
          if (v && v.y) {
            variable = valueOf(v.y)
            if (variable in site.data.variables) {
              if (!v.time_range.time.length) await conditionals.time_range(v, u, true)
              cv = Math.max(v.time_range.time[0], parseFloat(cv))
            }
            u.update()
          }
          u.e.min = 'undefined' === typeof u.parsed.min ? parseFloat(cv) : Math.max(u.parsed.min, parseFloat(cv))
          if (!u.e.value) {
            u.reset()
          } else if ('number' === typeof uv && isFinite(uv) && uv < cv) {
            u.set(cv)
          }
        },
        max: async function (u, c) {
          var cv = c.value(),
            uv = u.value(),
            v = _u[u.view || c.view],
            variable
          if (patterns.minmax.test(cv)) cv = c.parsed.max
          if (v && v.y) {
            variable = valueOf(v.y)
            if (variable in site.data.variables) {
              if (!v.time_range.time.length) await conditionals.time_range(v, u, true)
              cv = Math.min(v.time_range.time[1], parseFloat(cv))
            }
            u.update()
          }
          u.e.max = 'undefined' === typeof u.parsed.max ? parseFloat(cv) : Math.min(u.parsed.max, parseFloat(cv))
          if (!u.e.value) {
            u.reset()
          } else if ('number' === typeof uv && isFinite(uv) && uv > cv) {
            u.set(cv)
          }
        },
        dataview: function (f) {
          f = f || _u[defaults.dataview]
          const state = f.value()
          if (state !== f.state) {
            if (site.data.inited[f.parsed.dataset]) {
              f.valid = true
              f.n_selected.ids = 0
              f.n_selected.children = 0
              f.n_selected.features = 0
              f.n_selected.variables = 0
              f.n_selected.dataset = 0
              f.n_selected.filtered = 0
              f.n_selected.full_filter = 0
              f.n_selected.all = 0
              f.selection.ids = {}
              f.selection.children = {}
              f.selection.features = {}
              f.selection.variables = {}
              f.selection.dataset = {}
              f.selection.filtered = {}
              f.selection.full_filter = {}
              f.selection.all = {}
              Object.keys(site.data.entities).forEach(id => {
                const c = f.check(site.data.entities[id])
                c.all = 0
                if (c.ids) {
                  f.selection.ids[id] = site.data.entities[id]
                  f.n_selected.ids++
                  c.all++
                }
                if (c.features) {
                  f.selection.features[id] = site.data.entities[id]
                  f.n_selected.features++
                  c.all++
                }
                if (c.variables) {
                  f.selection.variables[id] = site.data.entities[id]
                  f.n_selected.variables++
                  c.all++
                }
                if (c.dataset) {
                  f.selection.dataset[id] = site.data.entities[id]
                  f.n_selected.dataset++
                  c.all++
                }
                if (c.features && c.variables) {
                  f.selection.full_filter[id] = site.data.entities[id]
                  f.n_selected.full_filter++
                }
                if (c.dataset && c.ids) {
                  f.selection.children[id] = site.data.entities[id]
                  f.n_selected.children++
                }
                if (c.variables && c.features && c.dataset) {
                  f.selection.filtered[id] = site.data.entities[id]
                  f.n_selected.filtered++
                }
                if (4 === c.all) {
                  f.selection.all[id] = site.data.entities[id]
                  f.n_selected.all++
                }
              })
              request_queue(f.id)
            } else {
              f.valid = false
              site.data.data_queue[f.parsed.dataset][f.id] = function () {
                return conditionals.dataview(f)
              }
              if (site.data.loaded[f.parsed.dataset]) site.data.load_id_maps()
            }
          }
        },
        time_filters: function (u) {
          u.time_range.filtered[0] = Infinity
          u.time_range.filtered[1] = -Infinity
          const d = u.get.dataset(),
            time = site.data.meta.times[d],
            c = _c[u.id + '_filter']
          if (!site.data.inited[d]) return void 0
          for (let i = time.n; i--; ) {
            let pass = false
            if (i >= u.time_range.index[0] && i <= u.time_range.index[1]) {
              for (let f = u.time_filters.length; f--; ) {
                const v = {},
                  tf = u.time_filters[f]
                if (!(tf.value in v)) v[tf.value] = valueOf(tf.value)
                pass = DataHandler.prototype.checks[tf.type](time.value[i], v[tf.value])
                if (!pass) break
              }
            }
            u.times[i] = pass
            if (pass) {
              if (u.time_range.filtered[0] > time.value[i]) u.time_range.filtered[0] = time.value[i]
              if (u.time_range.filtered[1] < time.value[i]) u.time_range.filtered[1] = time.value[i]
            }
          }
          u.time_range.filtered_index = [
            u.time_range.index[0] + u.time_range.filtered[0] - u.time_range.time[0],
            u.time_range.index[1] + u.time_range.filtered[1] - u.time_range.time[1],
          ]
          if (c)
            c.forEach(ci => {
              if ('update' === ci.type) {
                _u[ci.id].update()
              } else if (ci.type in conditionals) {
                conditionals[ci.type](_u[ci.id], u)
              }
            })
        },
        time_range: async function (u, c, passive) {
          const v = c && c.value(),
            d = u.get.dataset(),
            tv = u.time ? valueOf(u.time) : defaults.time,
            t = tv in site.data.variables ? site.data.variables[tv].info[d].min : 1,
            s = _c[u.id + '_time'],
            variable = v in site.data.variables ? v : valueOf(u.y)
          if (!site.data.inited[d]) return void 0
          var r = variable && (await get_variable(variable, u.id))
          if (r) {
            const reset = d + variable != u.time_range.dataset + u.time_range.variable
            r = r.time_range[d]
            if (-1 !== r[0]) {
              u.time_range.dataset = d
              u.time_range.variable = variable
              u.time_range.index[0] = r[0]
              u.time_range.time[0] = u.time_range.filtered[0] = t + r[0]
              u.time_range.index[1] = r[1]
              u.time_range.time[1] = u.time_range.filtered[1] = t + r[1]
            }
            if (!passive && s) {
              s.forEach(si => {
                const su = _u[si.id]
                const value = su.value()
                if ('min' === si.type) {
                  if (reset || (isFinite(u.time_range.time[0]) && parseFloat(su.e.min) !== u.time_range.time[0])) {
                    su.e.min = u.time_range.time[0]
                    if (reset || !meta.retain_state || u.time_range.time[0] > value) su.set(u.time_range.time[0])
                  }
                } else if ('max' === si.type) {
                  if (reset || (isFinite(u.time_range.time[1]) && parseFloat(su.e.max) !== u.time_range.time[1])) {
                    su.e.max = u.time_range.time[1]
                    if (reset || !meta.retain_state || u.time_range.time[1] < value || value < u.time_range.time[0])
                      su.set(u.time_range.time[1])
                  }
                }
              })
              conditionals.time_filters(u)
            }
          } else {
            u.time_range.dataset = d
            u.time_range.index[0] = 0
            u.time_range.time[0] = u.time_range.filtered[0] = 1
            u.time_range.index[1] = 0
            u.time_range.time[1] = u.time_range.filtered[1] = 1
          }
        },
      },
      elements = {
        button: {
          init: function (o) {
            o.target = o.e.getAttribute('target')
            if ('copy' === o.target) o.settings.endpoint = site.endpoint
            if ('filter' === o.target) {
              o.e.setAttribute('data-bs-toggle', 'modal')
              o.e.setAttribute('data-bs-target', '#filter_display')
            } else
              o.e.addEventListener(
                'click',
                o.settings.effects
                  ? 'export' === o.target || 'copy' === o.target
                    ? function () {
                        const f = {},
                          s = this.settings,
                          v = _u[s.dataview],
                          d = v && v.parsed.dataset
                        Object.keys(s.query).forEach(k => (f[k] = valueOf(s.query[k])))
                        if (v) {
                          if (!('include' in f) && v.y) f.include = valueOf(v.y)
                          if (!('id' in f) && v.ids) f.id = valueOf(v.ids)
                        }
                        if ('copy' === this.target || this.api) {
                          var q = []
                          if ('include' in f) q.push('include=' + f.include)
                          if ('dataset' in f) q.push('dataset=' + f.dataset)
                          if ('id' in f) q.push('id=' + f.id)
                          if (v) {
                            if (!f.time_range)
                              q.push(
                                'time_range=' +
                                  site.data.meta.times[d].value[v.time_range.filtered_index[0]] +
                                  ',' +
                                  site.data.meta.times[d].value[v.time_range.filtered_index[1]]
                              )
                            if (v.features)
                              Object.keys(v.features).forEach(k => {
                                if (!(k in f)) {
                                  f[k] = valueOf(v.features[k])
                                  if (Array.isArray(f[k])) f[k] = f[k].join(',')
                                  q.push(k + '=' + f[k])
                                }
                              })
                            if (site.data.filter)
                              site.data.filter.forEach(f => {
                                const value = Number(f.value)
                                if (!isNaN(value))
                                  q.push(
                                    f.variable +
                                      '[' +
                                      site.data.meta.overall.value[v.parsed.time_agg] +
                                      ']' +
                                      f.operator +
                                      value
                                  )
                              })
                          }
                          const k = s.endpoint + (q.length ? '?' + q.join('&') : '')
                          if (this.api) {
                            window.location.href = k
                          } else {
                            navigator.clipboard.writeText(k).then(
                              () => {
                                if ('Copied!' !== o.e.innerText) {
                                  o.text = o.e.innerText
                                  o.e.innerText = 'Copied!'
                                  setTimeout(function () {
                                    o.e.innerText = o.text
                                  }, 500)
                                }
                              },
                              e => {
                                if (e !== o.e.innerText) {
                                  o.text = o.e.innerText
                                  o.e.innerText = e
                                  setTimeout(function () {
                                    o.e.innerText = o.text
                                  }, 1500)
                                }
                              }
                            )
                          }
                        } else {
                          if (v && 'selection' in v) {
                            if (!f.time_range)
                              f.time_range =
                                site.data.meta.times[d].value[v.time_range.filtered_index[0]] +
                                ',' +
                                site.data.meta.times[d].value[v.time_range.filtered_index[1]]
                            site.data.export(f, v.selection.all, true)
                          } else site.data.export(f, site.data.entities, true)
                        }
                      }.bind(o)
                    : function () {
                        Object.keys(this.settings.effects).forEach(k => {
                          this.settings.effects[k] === '' || -1 == this.settings.effects[k]
                            ? _u[k].reset()
                            : _u[k].set(this.settings.effects[k])
                        })
                      }.bind(o)
                  : 'refresh' === o.target
                  ? global_update
                  : 'reset_selection' === o.target
                  ? global_reset
                  : 'reset_storage' === o.target
                  ? clear_storage
                  : function () {
                      if (this.target in _u) _u[this.target].reset()
                    }.bind(o)
              )
          },
        },
        buttongroup: {
          retrieve: function () {
            for (let i = this.options.length; i--; )
              if (this.options[i].checked) {
                this.set(i)
                break
              }
          },
          setter: function (v) {
            this.previous = this.value()
            this.current_index = 'string' === typeof v ? this.values.indexOf(v) : v
            if (-1 !== this.current_index) {
              this.source =
                this.values[this.current_index] in _u
                  ? _u[this.values[this.current_index]]
                  : this.values[this.current_index]
              this.options[this.current_index].checked = true
            } else this.source = undefined
            request_queue(this.id)
          },
          listener: function (e) {
            this.set(e.target.value)
          },
          adder: function (i, value, display) {
            var e = [document.createElement('input'), document.createElement('label')]
            e[0].className = 'btn-check'
            e[0].type = 'radio'
            e[0].name = this.e.id + '_options'
            e[0].autocomplete = 'off'
            e[0].value = value
            e[0].id = this.e.id + '_option' + i
            e[1].className = 'btn btn-primary'
            e[1].innerText = display
            e[1].setAttribute('for', e[0].id)
            this.e.appendChild(e[0])
            this.e.appendChild(e[1])
            return e
          },
        },
        radio: {
          retrieve: function () {
            for (let i = this.options.length; i--; ) {
              if (this.options[i].checked) {
                this.set(i)
                break
              }
            }
          },
          setter: function (v) {
            this.current_index = 'string' === typeof v ? this.values.indexOf(v) : v
            if (-1 !== this.current_index) {
              this.source =
                this.values[this.current_index] in _u
                  ? _u[this.values[this.current_index]]
                  : this.values[this.current_index]
              this.options[this.current_index].checked = true
            } else this.source = undefined
            request_queue(this.id)
          },
          listener: function (e) {
            this.set(e.target.value)
          },
          adder: function (value, display) {
            var e = document.createElement('div')
            this.e.appendChild(e)
            e.className = 'form-check'
            e.appendChild(document.createElement('input'))
            e.appendChild(document.createElement('label'))
            e.firstElementChild.class = 'form-check-input'
            e.firstElementChild.type = 'radio'
            e.firstElementChild.name = this.e.id + '_options'
            e.firstElementChild.id = this.e.id + '_option' + this.e.childElementCount
            e.firstElementChild.value = value
            e.lastElementChild.innerText = display
            e.lastElementChild.className = 'form-check-label'
            e.lastElementChild.setAttribute('for', e.firstElementChild.id)
            return this.e
          },
        },
        checkbox: {
          retrieve: function () {
            this.source = []
            this.current_index = []
            this.options.forEach(o => {
              if (o.checked) {
                this.source.push(this.values[i])
                this.current_index.push(i)
              }
            })
            request_queue(this.id)
          },
          setter: function (v) {
            if ('object' === typeof v) {
              this.source = []
              this.current_index = []
              this.values.forEach((v, i) => {
                if (-1 !== v.indexOf(v)) {
                  this.source.push(v)
                  this.current_index.push(i)
                  this.options[i].checked = true
                } else this.options[i].checked = false
              })
            } else {
              if ('string' === typeof v) {
                return this.set(v.split(','))
              } else {
                if (-1 !== v) this.options[v].checked = true
              }
            }
            request_queue(this.id)
          },
          listener: function (e) {
            if (e.target.checked) {
              this.source.push(e.target.value)
              this.current_index.push(this.values.indexOf(e.target.value))
            } else {
              var i = this.source.indexOf(e.target.value)
              if (i !== -1) {
                this.source.splice(i, 1)
                this.current_index.splice(i, 1)
              }
            }
            request_queue(this.id)
          },
          adder: function (value, display) {
            var e = document.createElement('div')
            this.e.appendChild(e)
            e.className = 'form-check'
            e.appendChild(document.createElement('input'))
            e.appendChild(document.createElement('label'))
            e.firstElementChild.class = 'form-check-input'
            e.firstElementChild.type = 'checkbox'
            e.firstElementChild.name = this.e.id + '_options'
            e.firstElementChild.id = this.e.id + '_option' + this.e.childElementCount
            e.firstElementChild.value = value
            e.lastElementChild.innerText = display
            e.lastElementChild.className = 'form-check-label'
            e.lastElementChild.setAttribute('for', e.firstElementChild.id)
            return this.e
          },
        },
        switch: {
          retrieve: function () {
            this.set(this.e.checked)
          },
          setter: function (v) {
            if ('string' === typeof v) v = 'on' === v
            if (v !== this.source) {
              this.previous = this.e.checked
              this.e.checked = this.source = v
              request_queue(this.id)
            }
          },
          listener: function (e) {
            this.set(e.target.checked)
          },
        },
        number: {
          init: function (o) {
            if (o.e.previousElementSibling && o.e.previousElementSibling.classList.contains('number-down')) {
              o.e.previousElementSibling.addEventListener(
                'click',
                function () {
                  this.set(Math.max(this.parsed.min, this.value() - 1))
                }.bind(o)
              )
              o.e.parentElement.lastElementChild.addEventListener(
                'click',
                function () {
                  this.set(Math.min(this.parsed.max, this.value() + 1))
                }.bind(o)
              )
            }
          },
          retrieve: function () {
            this.set(this.e.value)
          },
          setter: function (v) {
            if (!v) v = null
            if ('string' === typeof v) v = parseFloat(v)
            if (isFinite(v) && v !== this.source) {
              this.previous = parseFloat(this.e.value)
              if (!isFinite(this.parsed.min) && v < this.parsed.min) {
                v = this.parsed.min
              } else if (!isFinite(this.parsed.max) && v > this.parsed.max) v = this.parsed.max
              this.e.value = this.source = v
              this.current_index = v - this.parsed.min
              if ('range' === this.e.type) {
                this.e.nextElementSibling.firstElementChild.innerText = this.e.value
              }
              request_queue(this.id)
            }
          },
          listener: function (e) {
            this.set(e.target.value)
          },
        },
        text: {
          init: function (o) {
            if (site.text && o.id in site.text) {
              o.text = site.text[o.id].text
              o.condition = site.text[o.id].condition || []
              o.depends = {}
              o.text.forEach(oi => {
                if ('text' in oi) {
                  init_text(o, oi)
                  o.e.appendChild(oi.parts)
                } else {
                  o.e.appendChild(document.createElement('span'))
                  oi.forEach(t => init_text(o, t))
                }
              })
              o.condition.forEach(c => {
                if (c.id in _u) add_dependency(c.id, {type: 'display', id: o.id})
              })
              Object.keys(o.depends).forEach(k => add_dependency(k, {type: 'update', id: o.id}))
              o.update = elements.text.update.bind(o)
            }
            o.update()
          },
          update: function () {
            Object.keys(this.reference_options).forEach(k => (this.options[k] = valueOf(this.reference_options[k])))
            Object.keys(this.depends).forEach(k => {
              this.depends[k] = valueOf(k)
              if (this.depends[k] in site.data.entities)
                this.depends[k] = site.data.entities[this.depends[k]].features.name
            })
            this.text.forEach((o, i) => {
              var pass = true
              if (o.length) {
                for (let t = o.length; t--; ) {
                  if ('condition' in o[t]) {
                    for (let c = o[t].condition.length; c--; ) {
                      pass = o[t].condition[c].check()
                      if (!pass) break
                    }
                    if (pass) {
                      o = o[t]
                      break
                    }
                  }
                }
              } else {
                if ('condition' in o) {
                  for (let t = o.condition.length; t--; ) {
                    pass = o.condition[t].check()
                    if (!pass) break
                  }
                }
              }
              if (pass) {
                o.text.forEach((k, i) => {
                  if (Array.isArray(k)) {
                    k.forEach(ki => {
                      if (
                        'default' === ki.id ||
                        DataHandler.prototype.checks[ki.type](valueOf(ki.id), valueOf(ki.value))
                      )
                        k = ki.text
                    })
                  }
                  if (k in this.depends) {
                    o.parts.children[i].innerText = this.depends[k]
                  } else if (k in o.button) {
                    var s = ''
                    o.button[k].text.forEach(b => {
                      s = (b in this.depends ? this.depends[b] : b) + s
                    })
                    o.parts.children[i].innerText = s
                  } else o.parts.children[i].innerText = k
                })
                if (this.text[i].length) {
                  this.e.children[i].innerHTML = ''
                  this.e.children[i].appendChild(o.parts)
                } else o.parts.classList.remove('hidden')
              } else o.parts.classList.add('hidden')
            })
          },
        },
        select: {
          retrieve: function () {
            this.set(this.e.selectedIndex)
          },
          setter: function (v) {
            if ('number' === typeof v) v = this.options[v] ? this.options[v].value : v
            if (!v in this.values && v in this.display) v = this.options[this.display[v]].value
            if (v !== this.source) {
              this.e.selectedIndex = v in this.values ? this.values[v] : -1
              this.source = v
              request_queue(this.id)
            }
          },
          listener: function (e) {
            this.set(e.target.selectedIndex)
          },
          adder: function (value, display, meta) {
            const e = document.createElement('option')
            e.value = value
            e.innerText = display
            if (meta && meta.info) {
              e.title = meta.info.description || meta.info.short_description
            }
            return e
          },
        },
        plotly: {
          init: function (o) {
            if (o.id in site.plotly) {
              o.x = o.e.getAttribute('x')
              o.y = o.e.getAttribute('y')
              o.color = o.e.getAttribute('color')
              o.time = o.e.getAttribute('color-time')
              o.click = o.e.getAttribute('click')
              if (o.click in _u) o.clickto = _u[o.click]
              o.parsed = {}
              o.traces = {}
              o.tab = 'tabpanel' === o.e.parentElement.getAttribute('role') ? o.e.parentElement : void 0
              if (o.tab) {
                document.getElementById(o.e.parentElement.getAttribute('aria-labelledby')).addEventListener(
                  'click',
                  function () {
                    if (!o.e.parentElement.classList.contains('active')) {
                      setTimeout(this.update, 155)
                      setTimeout(trigger_resize, 155)
                    }
                  }.bind(o)
                )
              }
              o.show = function (e) {
                var trace = make_data_entry(
                  this,
                  e,
                  0,
                  0,
                  'hover_line',
                  defaults['border_highlight_' + site.settings.theme_dark]
                )
                if (trace) {
                  trace.line.width = 4
                  trace.marker.size = 12
                  Plotly.addTraces(this.e, trace, this.e.data.length)
                }
              }
              o.revert = function () {
                if (this.e.data.length && 'hover_line' === this.e.data[this.e.data.length - 1].name)
                  Plotly.deleteTraces(this.e, this.e.data.length - 1)
              }
              if (o.options) site.plotly[o.id].u = o
              site.plotly[o.id].data.forEach((p, i) => {
                Object.keys(p).forEach(k => {
                  if (patterns.period.test(k)) {
                    const es = k.split('.'),
                      n = es.length - 1
                    var pl = null
                    es.forEach((e, ei) => {
                      pl = pl ? (pl[e] = ei === n ? p[k] : {}) : (p[e] = {})
                    })
                  }
                })
                if (!('textfont' in p)) p.textfont = {}
                if (!('color' in p.textfont)) p.textfont.color = defaults.background_highlight
                if (!('line' in p)) p.line = {}
                if (!('color' in p.line)) p.line.color = defaults.background_highlight
                if (!('marker' in p)) p.marker = {}
                p.marker.size = 8
                if (!('color' in p.marker)) p.marker.color = defaults.background_highlight
                if (!('line' in p.marker)) p.marker.line = {}
                if (!('color' in p.marker.line)) p.marker.line.color = defaults.background_highlight
                if (!('text' in p)) p.text = []
                if (!('x' in p)) p.x = []
                if ('box' === p.type) {
                  p.hoverinfo = 'none'
                } else if (!('y' in p)) p.y = []
                o.traces[p.type] = JSON.stringify(p)
                if (!i) {
                  o.base_trace = p.type
                  if (o.base_trace in _u) add_dependency(o.base_trace, {type: 'update', id: o.id})
                }
              })
              if (!(o.x in site.data.variables)) {
                add_dependency(o.x, {type: 'update', id: o.id})
              }
              if (!(o.y in site.data.variables)) {
                add_dependency(o.y, {type: 'update', id: o.id})
              }
              if (o.time in _u) {
                add_dependency(o.time, {type: 'update', id: o.id})
              }
              if (o.view) {
                _c[o.view].push({type: 'update', id: o.id})
                _c[o.view + '_filter'].push({type: 'update', id: o.id})
                if (_u[o.view].time_agg in _u) add_dependency(_u[o.view].time_agg, {type: 'update', id: o.id})
              } else o.view = defaults.dataview
              queue_init_plotly.bind(o)()
            }
          },
          mouseover: function (d) {
            if (d.points && 1 === d.points.length && this.e.data[d.points[0].fullData.index]) {
              this.e.data[d.points[0].fullData.index].line.width = 4
              // this.e.data[d.points[0].fullData.index].marker.size = 12
              Plotly.react(this.e, this.e.data, this.e.layout)
              update_subs(this.id, 'show', site.data.entities[d.points[0].data.id])
            }
          },
          mouseout: function (d) {
            if (d.points && 1 === d.points.length && this.e.data[d.points[0].fullData.index]) {
              this.e.data[d.points[0].fullData.index].line.width = 2
              // this.e.data[d.points[0].fullData.index].marker.size = 8
              Plotly.react(this.e, this.e.data, this.e.layout)
              update_subs(this.id, 'revert', site.data.entities[d.points[0].data.id])
            }
          },
          click: function (d) {
            this.clickto && this.clickto.set(d.points[0].data.id)
          },
          update: async function (pass) {
            clearTimeout(this.queue)
            if (!pass) {
              if (!this.tab || this.tab.classList.contains('show')) this.queue = setTimeout(() => this.update(true), 50)
            } else {
              if (this.e.layout) {
                const v = _u[this.view],
                  s = v.selection && v.selection.all,
                  d = v.get.dataset(),
                  y = _u[this.time || v.time_agg]
                if (site.data.inited[d] && s && v.time_range.filtered.length) {
                  this.parsed.base_trace = valueOf(this.base_trace)
                  this.parsed.x = valueOf(this.x)
                  this.parsed.y = valueOf(this.y)
                  this.parsed.color = valueOf(this.color || v.y || this.parsed.y)
                  const varx = await get_variable(this.parsed.x, this.view),
                    vary = await get_variable(this.parsed.y, this.view),
                    varcol = await get_variable(this.parsed.color, this.view)
                  this.parsed.x_range = varx.time_range[d]
                  this.parsed.y_range = vary.time_range[d]
                  this.parsed.view = v
                  this.parsed.dataset = d
                  this.parsed.palette = valueOf(v.palette) || site.settings.palette
                  if (!(this.parsed.palette in palettes)) this.parsed.palette = defaults.palette
                  this.parsed.time = (y ? y.value() - site.data.meta.times[d].range[0] : 0) - varcol.time_range[d][0]
                  this.parsed.summary = varcol[this.view].summaries[d]
                  const summary = vary[this.view].summaries[d],
                    missing = this.parsed.summary.missing[this.parsed.time],
                    n = this.parsed.summary.n[this.parsed.time],
                    subset = n !== v.n_selected.dataset,
                    rank = subset ? 'subset_rank' : 'rank',
                    order = subset
                      ? varcol[this.view].order[d][this.parsed.time]
                      : varcol.info[d].order[this.parsed.time],
                    traces = []
                  var i = this.parsed.summary.missing[this.parsed.time],
                    k,
                    b,
                    fn = order ? order.length : 0,
                    lim = site.settings.trace_limit || 0,
                    jump,
                    state =
                      v.value() +
                      v.get.time_filters() +
                      d +
                      this.parsed.x +
                      this.parsed.y +
                      this.parsed.palette +
                      this.parsed.color +
                      site.settings.summary_selection +
                      site.settings.color_scale_center +
                      site.settings.color_by_order +
                      site.settings.trace_limit
                  lim = jump = lim && lim < n ? Math.ceil(Math.min(lim / 2, n / 2)) : 0
                  Object.keys(this.reference_options).forEach(
                    k => (this.options[k] = valueOf(this.reference_options[k]))
                  )
                  for (; i < fn; i++) {
                    if (order[i][0] in s) {
                      k = order[i][0]
                      const e = s[k]
                      state += k
                      traces.push(
                        make_data_entry(this, e, e[this.view][rank][this.parsed.color][this.parsed.time] - missing, n)
                      )
                      if (lim && !--jump) break
                    }
                  }
                  if (lim && i < fn) {
                    for (jump = i, i = fn - 1; i > jump; i--) {
                      if (order[i][0] in s) {
                        k = order[i][0]
                        const e = s[k]
                        state += k
                        traces.push(
                          make_data_entry(this, e, e[this.view][rank][this.parsed.color][this.parsed.time] - missing, n)
                        )
                        if (!--lim) break
                      }
                    }
                  }
                  state += traces.length && traces[0].type
                  if (site.settings.boxplots && 'box' in this.traces && s[k]) {
                    state += 'box' + site.settings.iqr_box
                    b = JSON.parse(this.traces.box)
                    traces.push(b)
                    b.line.color = defaults.border
                    b.median = summary.median
                    b.q3 = summary.q3
                    b.q1 = summary.q1
                    if (site.settings.iqr_box) {
                      b.upperfence = []
                      b.lowerfence = []
                      b.q1.forEach((q1, i) => {
                        if (isNaN(b.median[i])) b.median[i] = 0
                        const n = (b.q3[i] - q1) * 1.5,
                          med = b.median[i]
                        b.q3[i] = isNaN(b.q3[i]) ? med : Math.max(med, b.q3[i])
                        b.upperfence[i] = b.q3[i] + n
                        b.q1[i] = isNaN(b.q1[i]) ? med : Math.min(med, q1)
                        b.lowerfence[i] = q1 - n
                      })
                    } else {
                      b.upperfence = summary.max
                      b.lowerfence = summary.min
                    }
                    b.x = b.q1.map((_, i) => s[k].get_value(this.parsed.x, i + this.parsed.y_range[0]))
                  }
                  if (state !== this.state) {
                    if ('boolean' !== typeof this.e.layout.yaxis.title)
                      this.e.layout.yaxis.title =
                        site.data.format_label(this.parsed.y) +
                        (site.settings.trace_limit < v.n_selected.all
                          ? ' (' + site.settings.trace_limit + ' extremes)'
                          : '')
                    if ('boolean' !== typeof this.e.layout.xaxis.title)
                      this.e.layout.xaxis.title = site.data.format_label(this.parsed.x)
                    this.e.layout.yaxis.autorange = false
                    this.e.layout.yaxis.range = [Infinity, -Infinity]
                    if (!b) b = {upperfence: summary.max, lowerfence: summary.min}
                    summary.min.forEach((min, i) => {
                      const l = Math.min(b.lowerfence[i], min),
                        u = Math.max(b.upperfence[i], summary.max[i])
                      if (this.e.layout.yaxis.range[0] > l) this.e.layout.yaxis.range[0] = l
                      if (this.e.layout.yaxis.range[1] < u) this.e.layout.yaxis.range[1] = u
                    })
                    const r = (this.e.layout.yaxis.range[1] - this.e.layout.yaxis.range[0]) / 10
                    this.e.layout.yaxis.range[0] -= r
                    this.e.layout.yaxis.range[1] += r
                    if (site.data.variables[this.parsed.x].is_time) {
                      if (this.e.layout.xaxis.autorange) {
                        this.e.layout.xaxis.autorange = false
                        this.e.layout.xaxis.type = 'linear'
                        this.e.layout.xaxis.dtick = 1
                        this.e.layout.xaxis.range = [v.time_range.filtered[0] - 0.5, v.time_range.filtered[1] + 0.5]
                      } else {
                        this.e.layout.xaxis.range[0] = v.time_range.filtered[0] - 0.5
                        this.e.layout.xaxis.range[1] = v.time_range.filtered[1] + 0.5
                      }
                    }
                    Plotly.react(this.e, traces, this.e.layout)
                    setTimeout(trigger_resize, 300)
                    this.state = state
                  }
                }
              }
            }
          },
        },
        map: {
          init: function (o) {
            o.color = o.e.getAttribute('color')
            o.time = o.e.getAttribute('color-time')
            o.click = o.e.getAttribute('click')
            if (o.click && o.click in _u) o.clickto = _u[o.click]
            o.parsed = {}
            o.tab = 'tabpanel' === o.e.parentElement.getAttribute('role') ? o.e.parentElement : void 0
            o.show = function (e) {
              if (e.layer && e.layer[this.id]) {
                if (!site.data.inited[this.parsed.dataset + o.id]) {
                  const time = site.map[this.id].match_time(
                    site.data.meta.overall.value[
                      site.data.variables[this.parsed.color].time_range[this.parsed.dataset][0] + this.parsed.time
                    ]
                  )
                  if (e.layer[this.id][time])
                    e.layer[this.id][time].setStyle({
                      color: defaults['border_highlight_' + site.settings.theme_dark],
                    })
                } else {
                  e.layer[this.id].setStyle({
                    color: defaults['border_highlight_' + site.settings.theme_dark],
                  })
                }
              }
            }
            o.revert = function (e) {
              if (e.layer && e.layer[this.id]) {
                if (!site.data.inited[this.parsed.dataset + this.id]) {
                  const time = site.map[this.id].match_time(
                    site.data.meta.overall.value[
                      site.data.variables[this.parsed.color].time_range[this.parsed.dataset][0] + this.parsed.time
                    ]
                  )
                  if (e.layer[this.id][time]) e.layer[this.id][time].setStyle({color: defaults.border})
                } else {
                  e.layer[this.id].setStyle({color: defaults.border})
                }
              }
            }
            if (o.view) {
              add_dependency(o.view, {type: 'update', id: o.id})
              if (_u[o.view].time_agg in _u) add_dependency(_u[o.view].time_agg, {type: 'update', id: o.id})
              if (_u[o.view].y) add_dependency(_u[o.view].y, {type: 'update', id: o.id})
            } else o.view = defaults.dataview
            _c[o.view].push({type: 'update', id: o.id})
            if (o.color in _u) add_dependency(o.color, {type: 'update', id: o.id})
            if (o.time) add_dependency(o.time, {type: 'update', id: o.id})
            if (!o.e.style.height) o.e.style.height = o.options.height ? o.options.height : '400px'
            queue_init_map.bind(o)()
          },
          mouseover: function (e) {
            e.target.setStyle({
              color: defaults['border_highlight_' + site.settings.theme_dark],
            })
            update_subs(this.id, 'show', site.data.entities[e.target.feature.properties[e.target.source.id_property]])
          },
          mouseout: function (e) {
            update_subs(this.id, 'revert', site.data.entities[e.target.feature.properties[e.target.source.id_property]])
            e.target.setStyle({
              color: defaults.border,
            })
          },
          click: function (e) {
            if (this.clickto) this.clickto.set(e.target.feature.properties[e.target.source.id_property])
          },
          update: async function (entity, caller, pass) {
            clearTimeout(this.queue)
            if (!pass) {
              if (!this.tab || this.tab.classList.contains('show'))
                this.queue = setTimeout(() => this.update(void 0, void 0, true), 50)
            } else {
              if (this.view && this.displaying) {
                const view = site.dataviews[this.view],
                  d = view.get.dataset(),
                  time = valueOf(view.time_agg),
                  match_time = site.map[this.id].has_time ? site.map[this.id].match_time(time) : time,
                  has_time = d + match_time + this.id in site.data.inited,
                  mapId = has_time ? d + match_time : d
                if (site.map._queue && mapId in site.map._queue && !site.data.inited[mapId + this.id]) {
                  return retrieve_layer(this, site.map._queue[mapId], () => this.update(void 0, void 0, true))
                }
                if (!view.valid && site.data.inited[d]) {
                  view.state = ''
                  conditionals.dataview(view, void 0, true)
                }
                this.parsed.view = view
                this.parsed.dataset = d
                const vstate =
                    view.value() +
                    mapId +
                    site.settings.background_shapes +
                    site.data.inited[this.options.background_shapes],
                  a = view.selection.all,
                  s = view.selection[site.settings.background_shapes && this.options.background_shapes ? 'ids' : 'all'],
                  bgc = defaults.border,
                  c = valueOf(this.color || view.y)
                if (site.settings.map_overlay && c in site.map[this.id].triggers) {
                  show_overlay(this, site.map[this.id].triggers[c], site.data.meta.overall.value[view.parsed.time_agg])
                } else {
                  this.overlay_control.remove()
                  this.overlay.clearLayers()
                }
                if (site.data.inited[mapId + this.id] && s && view.valid) {
                  const ys = this.time
                    ? _u[this.time]
                    : view.time_agg
                    ? view.time_agg in _u
                      ? _u[view.time_agg]
                      : parseInt(view.time_agg)
                    : 0
                  this.parsed.palette = valueOf(view.palette) || site.settings.palette
                  if (!(this.parsed.palette in palettes)) this.parsed.palette = defaults.palette
                  const varc = await get_variable(c, this.view)
                  this.parsed.time =
                    (ys.parsed ? ys.value() - site.data.meta.times[d].range[0] : 0) - varc.time_range[d][0]
                  this.parsed.color = c
                  this.parsed.summary = varc[this.view].summaries[d]
                  const subset = this.parsed.summary.n[ys] === view.n_selected.dataset ? 'rank' : 'subset_rank'
                  if (vstate !== this.vstate) {
                    this.map._zoomAnimated = 'none' !== site.settings.map_animations
                    Object.keys(this.reference_options).forEach(k => {
                      this.options[k] = valueOf(this.reference_options[k])
                      if ('zoomAnimation' === k) this.map._zoomAnimated = this.options[k]
                    })
                    this.displaying.clearLayers()
                    this.fresh_shapes = true
                    this.vstate = false
                    var n = 0
                    Object.keys(s).forEach(k => {
                      const skl = s[k].layer
                      if (skl && skl[this.id]) {
                        const fg = k in a,
                          cl = skl[this.id].has_time ? skl[this.id][match_time] : skl[this.id]
                        if (cl && (fg || this.options.background_shapes === site.data.entities[k].group)) {
                          n++
                          cl.options.interactive = fg
                          cl.addTo(this.displaying)
                          if (!fg) {
                            cl.bringToBack()
                            cl.setStyle({
                              fillOpacity: 0,
                              color: bgc,
                              weight: 0.3,
                            })
                          }
                          if (!this.vstate) this.vstate = vstate
                        }
                      }
                    })
                    this.overlay.bringToFront()
                    if (n)
                      if ('fly' === site.settings.map_animations) {
                        setTimeout(() => this.map.flyToBounds(this.displaying.getBounds()), 400)
                      } else {
                        this.map.fitBounds(this.displaying.getBounds())
                      }
                  }

                  // coloring
                  const k =
                    c +
                    this.vstate +
                    this.parsed.palette +
                    this.parsed.time +
                    site.settings.polygon_outline +
                    site.settings.color_by_order +
                    site.settings.color_scale_center
                  if (k !== this.cstate) {
                    this.cstate = k
                    if (site.map[this.id]) {
                      const ls = this.displaying._layers
                      const n = this.parsed.summary.n[this.parsed.time]
                      const missing = this.parsed.summary.missing[this.parsed.time]
                      Object.keys(ls).forEach(id => {
                        const lsi = ls[id]
                        if (d === lsi.entity.group) {
                          const e = a[lsi.entity.features.id]
                          lsi.setStyle({
                            fillOpacity: 0.7,
                            color: defaults.border,
                            fillColor:
                              e && c in e[this.view][subset]
                                ? pal(
                                    e.get_value(c, this.parsed.time),
                                    this.parsed.palette,
                                    this.parsed.summary,
                                    this.parsed.time,
                                    e[this.view][subset][c][this.parsed.time] - missing,
                                    n
                                  )
                                : defaults.missing,
                            weight: site.settings.polygon_outline,
                          })
                        }
                      })
                    } else {
                      if (!('_waiting' in site.map)) site.map._waiting = {}
                      if (!(d in site.map._waiting)) site.map._waiting[d] = []
                      if (-1 === site.map._waiting[d].indexOf(this.id)) site.map._waiting[d].push(this.id)
                      if (-1 === site.map._waiting[d].indexOf(this.view)) site.map._waiting[d].push(this.view)
                    }
                  }
                }
              }
            }
          },
        },
        info: {
          init: function (o) {
            o.depends = {}
            o.has_default = o.options.default && (o.options.default.title || o.options.default.body)
            add_subs(o.view, o)
            if (o.options.floating) {
              document.body.appendChild(o.e)
              o.e.classList.add('hidden')
              document.addEventListener('mousemove', function (e) {
                if (o.showing) {
                  const f = page.content.getBoundingClientRect()
                  o.e.style.top = (e.y > f.height / 2 ? e.y - o.e.getBoundingClientRect().height - 10 : e.y + 10) + 'px'
                  o.e.style.left = (e.x > f.width / 2 ? e.x - o.e.getBoundingClientRect().width - 10 : e.x + 10) + 'px'
                }
              })
            }
            o.show = function (e, u) {
              this.update(e, u)
              this.showing = true
              if (this.options.floating) this.e.classList.remove('hidden')
              if (this.parts.title) {
                if (this.selection) {
                  this.parts.title.base.classList.add('hidden')
                } else this.parts.title.default.classList.add('hidden')
                this.parts.title.temp.classList.remove('hidden')
              }
              if (this.parts.body) {
                if (this.selection) {
                  this.parts.body.base.classList.add('hidden')
                } else this.parts.body.default.classList.add('hidden')
                this.parts.body.temp.classList.remove('hidden')
              }
            }
            o.revert = function () {
              this.showing = false
              if (this.options.floating) {
                this.e.classList.add('hidden')
              } else {
                if (this.parts.title) {
                  if (this.selection) {
                    this.parts.title.base.classList.remove('hidden')
                  } else if (this.has_default) this.parts.title.default.classList.remove('hidden')
                  this.parts.title.temp.classList.add('hidden')
                }
                if (this.parts.body) {
                  if (this.selection) {
                    this.parts.body.base.classList.remove('hidden')
                  } else if (this.has_default) this.parts.body.default.classList.remove('hidden')
                  this.parts.body.temp.classList.add('hidden')
                }
              }
            }
            o.parts = {}
            function parse_part(o, t) {
              const p = {
                parent: o,
                text: t,
                parsed: {},
                ref: true,
                selection: false,
                get: function (entity, caller) {
                  if (this.ref) {
                    if (entity)
                      if ('features' in this.parsed) {
                        return entity.features[this.parsed.features]
                      } else if ('data' in this.parsed) {
                        if ('value' === this.text) {
                          this.parsed.data = valueOf(o.options.variable || caller.color || caller.y || _u[o.view].y)
                        } else if (this.text in _u) this.parsed.data = valueOf(this.text)
                        if (!(this.parsed.data in site.data.variables)) return this.parsed.data
                        const info = site.data.variable_info[this.parsed.data],
                          v = site.data.format_value(
                            entity.get_value(this.parsed.data, this.parent.time),
                            info && info.type ? patterns.int_types.test(info.type) : true
                          )
                        return 'unknown' !== v && info.type in value_types ? value_types[info.type](v) : v
                      }
                    if ('data' in this.parsed) {
                      return site.data.meta.times[this.parent.dataset].value[this.parent.time_agg]
                    } else if (
                      'variables' in this.parsed &&
                      (this.value_source || this.parent.v in site.data.variable_info)
                    ) {
                      return site.data.variable_info[valueOf(this.value_source || this.parent.v)][this.parsed.variables]
                    }
                    return this.text
                  } else return this.text
                },
              }
              if ('value' === t) {
                p.parsed.data = o.options.variable
              } else if (patterns.features.test(t)) {
                p.parsed.features = t.replace(patterns.features, '')
              } else if (patterns.data.test(t)) {
                p.parsed.data = t.replace(patterns.data, '')
              } else if (patterns.variables.test(t)) {
                p.parsed.variables = t.replace(patterns.variables, '')
              } else p.ref = false
              return p
            }
            if (o.options.title) {
              o.parts.title = parse_part(o, o.options.title)
              if ('variables' in o.parts.title.parsed && patterns.measure_name.test(o.parts.title.parsed.variables)) {
                o.parts.title.base = document.createElement('button')
                o.parts.title.base.type = 'button'
                o.parts.title.base.setAttribute('data-bs-toggle', 'modal')
                o.parts.title.base.setAttribute('data-bs-target', '#variable_info_display')
                o.parts.title.base.addEventListener('click', show_variable_info.bind(o))
              } else o.parts.title.base = document.createElement('p')
              o.parts.title.temp = document.createElement('p')
              o.parts.title.default = document.createElement('p')
              o.parts.title.temp.className =
                o.parts.title.base.className =
                o.parts.title.default.className =
                  'info-title hidden'
              if (o.has_default && o.options.default.title) {
                o.e.appendChild(o.parts.title.default)
                o.parts.title.default.innerText = o.options.default.title
              }
              if (!o.parts.title.ref) o.parts.title.base.innerText = o.parts.title.get()
              o.e.appendChild(o.parts.title.base)
              o.e.appendChild(o.parts.title.temp)
              o.parts.title.base.classList.add('hidden')
              o.parts.title.temp.classList.add('hidden')
            }
            if (o.options.body) {
              o.parts.body = {
                base: document.createElement('div'),
                temp: document.createElement('div'),
                default: document.createElement('div'),
                rows: [],
              }
              o.parts.body.temp.className =
                o.parts.body.base.className =
                o.parts.body.default.className =
                  'info-body hidden'
              if (o.has_default && o.options.default.body) o.parts.body.default.innerText = o.options.default.body
              var h = 0
              o.options.body.forEach((op, i) => {
                const p = {
                  name: parse_part(o, op.name),
                  value: parse_part(o, op.value),
                }
                o.parts.body.rows[i] = p
                p.base = document.createElement('div')
                o.parts.body.base.appendChild(p.base)
                p.temp = document.createElement('div')
                o.parts.body.temp.appendChild(p.temp)
                p.temp.className = p.base.className = 'info-body-row-' + op.style
                h += 24 + ('stack' === op.style ? 24 : 0)
                if (p.name) {
                  if (
                    o.options.variable_info &&
                    'variables' in p.name.parsed &&
                    patterns.measure_name.test(p.name.parsed.variables)
                  ) {
                    p.base.appendChild(document.createElement('button'))
                    p.base.lastElementChild.type = 'button'
                    p.base.lastElementChild.setAttribute('data-bs-toggle', 'modal')
                    p.base.lastElementChild.setAttribute('data-bs-target', '#variable_info_display')
                    p.base.lastElementChild.addEventListener('click', show_variable_info.bind(o))
                  } else p.base.appendChild(document.createElement('div'))
                  p.temp.appendChild(document.createElement('div'))
                  p.temp.lastElementChild.className = p.base.lastElementChild.className = 'info-body-row-name'
                  p.temp.lastElementChild.innerText = p.base.lastElementChild.innerText = p.name.get()
                }
                if (p.value) {
                  p.base.appendChild(document.createElement('div'))
                  p.temp.appendChild(document.createElement('div'))
                  p.temp.lastElementChild.className = p.base.lastElementChild.className =
                    'info-body-row-value' + ('statement' === p.value.parsed.variables ? ' statement' : '')
                  if (!p.value.ref)
                    p.temp.lastElementChild.innerText = p.base.lastElementChild.innerText = p.value.get()
                }
              })
              o.e.style.minHeight = h + 'px'
              o.e.appendChild(o.parts.body.base)
              o.e.appendChild(o.parts.body.default)
              o.e.appendChild(o.parts.body.temp)
            }
            o.update()
          },
          update: function (entity, caller, pass) {
            const v = site.dataviews[this.view]
            const y = _u[v.time_agg]
            this.v = valueOf(this.options.variable || (caller && (caller.color || caller.y)) || v.y)
            this.dataset = v.get.dataset()
            if (y && !(this.dataset in site.data.meta.times)) return
            this.time_agg = y ? y.value() - site.data.meta.times[this.dataset].range[0] : 0
            const time_range = this.v && site.data.variables[this.v].time_range[this.dataset]
            this.time = time_range ? this.time_agg - time_range[0] : 0
            if (!this.processed) {
              this.processed = true
              if (!this.options.floating) {
                add_dependency(this.view, {type: 'update', id: this.id})
                if (v.y in _u) add_dependency(v.y, {type: 'update', id: this.id})
                if (y) add_dependency(v.time_agg, {type: 'update', id: this.id})
                if (this.options.variable in _u) add_dependency(this.options.variable, {type: 'update', id: this.id})
              }
              if (this.parts.body)
                this.parts.body.rows.forEach(p => {
                  if (!p.value.ref && p.value.text in _u && 'variables' in p.name.parsed) {
                    p.name.value_source = p.value.value_source = p.value.text
                    p.value.ref = true
                    p.value.parsed.data = ''
                  }
                })
            }
            if (entity) {
              // hover information
              if (this.parts.title) {
                this.parts.title.temp.innerText = this.parts.title.get(entity, caller)
              }
              if (this.parts.body) {
                this.parts.body.rows.forEach(p => {
                  if (p.name.ref) {
                    if (p.name.value_source) p.name.value_source = p.value.text
                    e = p.name.get(entity, caller)
                    if ('object' !== typeof e) {
                      p.temp.firstElementChild.innerText = parse_variables(e, p.value.parsed.variables, this, entity)
                    }
                  }
                  if (p.value.ref) {
                    if (p.value.value_source) p.value.value_source = p.value.text
                    e = p.value.get(entity, caller)
                    if ('object' !== typeof e) {
                      p.temp.lastElementChild.innerText = parse_variables(e, p.value.parsed.variables, this, entity)
                    }
                  }
                })
              }
            } else if (!this.options.floating) {
              clearTimeout(this.queue)
              if (!pass) {
                if (!this.tab || this.tab.classList.contains('show'))
                  this.queue = setTimeout(() => this.update(void 0, void 0, true), 50)
              } else {
                // base information
                entity = site.data.entities[v.get.ids()]
                if (entity) {
                  // when showing a selected region
                  this.selection = true
                  if (this.parts.title) {
                    if (this.parts.title.value_source) p.title.value_source = p.value.text
                    this.parts.title.base.classList.remove('hidden')
                    this.parts.title.default.classList.add('hidden')
                  }
                  if (this.parts.body && this.has_default) this.parts.body.default.classList.add('hidden')
                } else {
                  // when no ID is selected
                  this.selection = false
                  if (this.parts.title) {
                    if (this.has_default) {
                      this.parts.title.base.classList.add('hidden')
                      this.parts.title.default.classList.remove('hidden')
                    } else this.parts.title.base.classList.remove('hidden')
                  }
                  if (this.parts.body) {
                    this.parts.body.base.classList.add('hidden')
                    if (this.has_default) this.parts.body.default.classList.remove('hidden')
                  }
                }
                if (this.parts.title) {
                  this.parts.title.base.innerText = this.parts.title.get(entity, caller)
                }
                if (this.parts.body) {
                  if (!this.options.subto) this.parts.body.base.classList.remove('hidden')
                  this.parts.body.rows.forEach(p => {
                    if ('variables' in p.value.parsed && !(v.y in this.depends)) {
                      this.depends[v.y] = true
                      add_dependency(v.y, {type: 'update', id: this.id})
                    }
                    if (p.name.ref) {
                      if (p.name.value_source) p.name.value_source = p.value.text
                      const e = p.name.get(entity, caller)
                      if ('object' !== typeof e) {
                        p.base.firstElementChild.innerText = e
                      }
                    }
                    if (p.value.ref) {
                      const e = p.value.get(entity, caller)
                      if ('object' === typeof e) {
                        if (Array.isArray(e) && 'sources' === p.value.parsed.variables) {
                          p.base.innerHTML = ''
                          p.base.appendChild(document.createElement('table'))
                          p.base.lastElementChild.className = 'source-table'
                          p.base.firstElementChild.appendChild(document.createElement('thead'))
                          p.base.firstElementChild.firstElementChild.appendChild(document.createElement('tr'))
                          p.base.firstElementChild.firstElementChild.firstElementChild.appendChild(
                            document.createElement('th')
                          )
                          p.base.firstElementChild.firstElementChild.firstElementChild.appendChild(
                            document.createElement('th')
                          )
                          p.base.firstElementChild.firstElementChild.firstElementChild.firstElementChild.innerText =
                            'Source'
                          p.base.firstElementChild.firstElementChild.firstElementChild.lastElementChild.innerText =
                            'Accessed'
                          p.base.firstElementChild.appendChild(document.createElement('tbody'))
                          e.forEach(ei => {
                            p.base.firstElementChild.lastElementChild.appendChild(make_variable_source(ei))
                          })
                        }
                      } else {
                        p.base.lastElementChild.innerText = parse_variables(e, p.value.parsed.variables, this, entity)
                      }
                    }
                  })
                }
              }
            }
            this.revert()
          },
        },
        datatable: {
          init: function (o) {
            o.e.appendChild(document.createElement('tHead'))
            o.e.appendChild(document.createElement('tBody'))
            o.click = o.e.getAttribute('click')
            o.features = o.options.features
            o.parsed = {summary: {}, order: [], time: 0, color: '', dataset: _u[o.view].get.dataset()}
            o.header = []
            o.rows = {}
            o.rowIds = {}
            o.tab = 'tabpanel' === o.e.parentElement.getAttribute('role') ? o.e.parentElement : void 0
            const time = site.data.meta.times[o.parsed.dataset]
            if (o.tab) {
              document.getElementById(o.e.parentElement.getAttribute('aria-labelledby')).addEventListener(
                'click',
                function () {
                  if (!o.e.parentElement.classList.contains('active')) {
                    setTimeout(this.update, 155)
                    setTimeout(trigger_resize, 155)
                  }
                }.bind(o)
              )
            }
            o.e.addEventListener('mouseover', elements.datatable.mouseover.bind(o))
            o.e.addEventListener('mouseout', elements.datatable.mouseout.bind(o))
            if (o.click) {
              if (o.click in _u) o.clickto = _u[o.click]
              o.e.addEventListener('click', elements.datatable.click.bind(o))
            }
            o.show = function (e) {
              if (e.features && e.features.id in this.rows) {
                const row = this.rows[e.features.id].node()
                if (row) {
                  row.style.backgroundColor = defaults.background_highlight
                  if (site.settings.table_autoscroll) {
                    const h = this.e.parentElement.getBoundingClientRect().height,
                      top = row.getBoundingClientRect().y - this.e.getBoundingClientRect().y
                    this.e.parentElement.scroll({
                      top: h > this.e.scrollHeight - top ? this.e.parentElement.scrollHeight : top,
                      behavior: site.settings.table_scroll_behavior || 'smooth',
                    })
                  }
                }
              }
            }
            o.revert = function (e) {
              if (e.features && e.features.id in this.rows) {
                const row = this.rows[e.features.id].node()
                if (row) row.style.backgroundColor = 'inherit'
              }
            }
            o.options.variable_source = o.options.variables
            if (o.options.variables) {
              if ('string' === typeof o.options.variables) {
                if (o.options.variables in _u) {
                  add_dependency(o.options.variables, {type: 'update', id: o.id})
                  o.options.variables = valueOf(o.options.variables)
                  o.options.single_variable = 'string' === typeof o.options.variables
                } else if (!o.options.single_variable) {
                  o.options.single_variable = [{name: o.options.single_variable}]
                }
              }
            } else o.options.variables = Object.keys(site.data.variables)
            if (
              'string' !== typeof o.options.variables &&
              o.options.variables.length &&
              'string' === o.options.variables[0]
            ) {
              o.options.variables = o.options.variables.map(v => {
                name: v
              })
            }
            if (o.options.single_variable) {
              const c = o.options.variables,
                k = c.name || c
              o.header.push({title: 'Name', data: 'entity.features.name'})
              if (time.is_single) o.variable_header = true
              const t = site.data.variables[k].time_range[o.parsed.dataset]
              for (let n = t[1] - t[0] + 1; n--; ) {
                o.header[n + 1] = {
                  title: o.variable_header ? c.title || site.data.format_label(k) : time.value[n + t[0]] + '',
                  data: site.data.retrievers.vector,
                  render: site.data.retrievers.row_time.bind({
                    i: n,
                    o: t[0],
                    format_value: site.data.format_value.bind(site.data),
                  }),
                }
              }
              o.options.order = [[o.header.length - 1, 'dsc']]
            } else if (o.options.wide) {
              if (o.features) {
                if ('string' === typeof o.features) o.features = [{name: o.features}]
                o.features.forEach(f => {
                  o.header.push({
                    title: f.title || f.name,
                    data: 'entity.features.' + f.name.replace(patterns.all_periods, '\\.'),
                  })
                })
              }
              for (let i = o.options.variables.length; i--; ) {
                if ('string' === typeof o.options.variables[i]) o.options.variables[i] = {name: o.options.variables[i]}
                const c = o.options.variables[i]
                if (!c.source) c.source = c.name in site.data.variables ? 'data' : 'features'
                o.header.push(
                  'features' === c.source
                    ? {
                        title: c.title || site.data.format_label(c.name),
                        data: 'entity.features.' + c.name.toLowerCase().replace(patterns.all_periods, '\\.'),
                      }
                    : {
                        title: c.title || site.data.format_label(c.name),
                        render: async function (d, type, row) {
                          if ('data' === this.c.source) {
                            if (this.c.name in site.data.variables) {
                              const i =
                                row.time -
                                (await get_variable(this.c.name, this.view).time_range[this.o.parsed.dataset][0])
                              return i < 0 ? NaN : row.entity.get_value(this.c.name, i)
                            } else return NaN
                          } else
                            return this.c.source in row.entity && this.c.name in row.entity[this.c.source]
                              ? row.entity[this.c.source][this.c.name]
                              : NaN
                        }.bind({o, c}),
                      }
                )
              }
            } else {
              o.filters = o.options.filters
              o.current_filter = {}
              if (!time.is_single) {
                o.header.push({
                  title: 'Year',
                  data: 'entity.time.value',
                  render: function (d, type, row) {
                    const t = row.time + row.offset
                    return d && t >= 0 && t < d.length
                      ? 'number' === typeof d[t]
                        ? site.data.format_value(d[t], true)
                        : d[t]
                      : NaN
                  },
                })
              }
              if (o.features) {
                if ('string' === typeof o.features) o.features = [{name: o.features}]
                o.features.forEach(f => {
                  o.header.splice(0, 0, {
                    title: f.title || f.name,
                    data: 'entity.features.' + f.name.replace(patterns.all_periods, '\\.'),
                  })
                })
              }
              o.header.push({
                title: 'Variable',
                data: function (row) {
                  return row.variable in row.entity.variables
                    ? row.entity.variables[row.variable].meta.short_name
                    : row.variable
                },
              })
              o.header.push({
                title: 'Value',
                data: site.data.retrievers.vector,
                render: function (d, type, row) {
                  return d
                    ? 'number' === typeof d[row.time]
                      ? site.data.format_value(d[row.time], row.int)
                      : d[row.time]
                    : ''
                },
              })
            }
            if (o.view) {
              _c[o.view].push({type: 'update', id: o.id})
              _c[o.view + '_filter'].push({type: 'update', id: o.id})
            } else o.view = defaults.dataview
            queue_init_datatable.bind(o)()
          },
          update: async function (pass) {
            clearTimeout(this.queue)
            if (!pass) {
              if (!this.tab || this.tab.classList.contains('show')) this.queue = setTimeout(() => this.update(true), 50)
            } else {
              if (this.table) {
                var vn =
                  this.options.variable_source &&
                  valueOf(this.options.variable_source).replace(patterns.all_periods, '\\.')
                const v = _u[this.view],
                  d = v.get.dataset(),
                  state = d + v.value() + v.get.time_filters() + site.settings.digits + vn
                if (!site.data.inited[d]) return void 0
                if (state !== this.state) {
                  this.rows = {}
                  this.rowIds = {}
                  this.table.clear()
                  let redraw = true
                  if (v.selection) {
                    this.state = state
                    Object.keys(this.reference_options).forEach(
                      k => (this.options[k] = valueOf(this.reference_options[k]))
                    )
                    if (this.options.single_variable) {
                      const time = valueOf(v.time_agg),
                        variable = await get_variable(vn, this.view)
                      this.parsed.dataset = d
                      this.parsed.color = vn
                      this.parsed.time_range = variable.time_range[d]
                      this.parsed.time =
                        ('number' === typeof time ? time - site.data.meta.times[d].range[0] : 0) -
                        this.parsed.time_range[0]
                      this.parsed.summary = this.view in variable ? variable[this.view].summaries[d] : false
                      this.parsed.order = this.view in variable ? variable[this.view].order[d][this.parsed.time] : false
                      if (this.header.length < 2 || d !== this.header[1].dataset || vn !== this.header[1].variable) {
                        this.table.destroy()
                        $(this.e).empty()
                        this.header = [{title: 'Name', data: 'entity.features.name'}]
                        if (-1 !== this.parsed.time_range[0]) {
                          for (let n = this.parsed.time_range[2]; n--; ) {
                            this.header[n + 1] = {
                              dataset: d,
                              variable: vn,
                              title: this.variable_header
                                ? this.options.variables.title || site.data.format_label(vn)
                                : site.data.meta.times[d].value[n + this.parsed.time_range[0]] + '',
                              data: site.data.retrievers.vector,
                              render: site.data.retrievers.row_time.bind({
                                i: n,
                                o: this.parsed.time_range[0],
                                format_value: site.data.format_value.bind(site.data),
                              }),
                            }
                          }
                        } else this.state = ''
                        this.options.order[0][0] = this.header.length - 1
                        this.options.columns = this.header
                        this.table = $(this.e).DataTable(this.options)
                      }
                      const n = this.header.length
                      let reset
                      for (let i = 1; i < n; i++) {
                        this.table.column(i).visible(v.times[i - 1 + this.parsed.time_range[0]], false)
                        if (v.times[i - 1 + this.parsed.time_range[0]]) reset = false
                      }
                      if (reset) this.state = ''
                    }
                    if (this.options.wide) {
                      Object.keys(v.selection.all).forEach(k => {
                        if (vn) {
                          if (vn in v.selection.all[k][this.view].summary) {
                            this.rows[k] = this.table.row.add({
                              dataset: d,
                              variable: vn,
                              offset: this.parsed.time_range[0],
                              entity: v.selection.all[k],
                              int: patterns.int_types.test(site.data.variable_info[vn].type),
                            })
                            this.rowIds[this.rows[k].selector.rows] = k
                          }
                        } else {
                          for (let i = site.data.meta.times[d].n; i--; ) {
                            this.rows[k] = this.table.row.add({
                              time: i,
                              entity: v.selection.all[k],
                            })
                            this.rowIds[this.rows[k].selector.rows] = k
                          }
                        }
                      })
                    } else {
                      Object.keys(this.filters).forEach(f => {
                        this.current_filter[c] = valueOf(f)
                      })
                      const va = []
                      let varstate = '' + this.parsed.dataset + v.get.ids() + v.get.features() + site.settings.digits
                      for (let i = this.options.variables.length; i--; ) {
                        vn = this.options.variables[i].name || this.options.variables[i]
                        pass = false
                        if (vn in site.data.variables && 'meta' in variable) {
                          if (this.options.filters) {
                            for (const c in this.current_filter)
                              if (c in variable.meta) {
                                pass = variable.meta[c] === this.current_filter[c]
                                if (!pass) break
                              }
                          } else pass = true
                        }
                        if (pass) {
                          varstate += vn
                          va.push({
                            variable: vn,
                            int: patterns.int_types.test(site.data.variable_info[vn].type),
                            time_range: variable.time_range[d],
                            renderer: function (o, s) {
                              const k = s.features.id,
                                r = this.time_range,
                                n = r[1]
                              for (let i = r[0]; i <= n; i++) {
                                o.rows[k] = o.table.row.add({
                                  offset: this.time_range[0],
                                  time: i - this.time_range[0],
                                  dataset: d,
                                  variable: this.variable,
                                  entity: s,
                                  int: this.int,
                                })
                                o.rowIds[o.rows[k].selector.rows] = k
                              }
                            },
                          })
                        }
                      }
                      if (varstate === this.varstate) return void 0
                      this.varstate = varstate
                      Object.keys(v.selection.all).forEach(k => {
                        const e = v.selection.all[k]
                        if (this.options.single_variable) {
                          if (vn in e[v].summary && variable.code in e.data) {
                            this.rows[k] = this.table.row.add({
                              offset: this.parsed.time_range[0],
                              dataset: d,
                              variable: vn,
                              entity: e,
                              int: patterns.int_types.test(site.data.variable_info[vn].type),
                            })
                            this.rowIds[this.rows[k].selector.rows] = k
                          }
                        } else {
                          va.forEach(v => {
                            if (site.data.variables[v.variable].code in e.data) v.renderer(this, e)
                          })
                        }
                      })
                    }
                  }
                  redraw ? this.table.draw() : this.table.columns.adjust().draw(false)
                }
              }
            }
          },
          mouseover: function (e) {
            if (e.target._DT_CellIndex && e.target._DT_CellIndex.row in this.rowIds) {
              const id = this.rowIds[e.target._DT_CellIndex.row],
                row = this.rows[id].node()
              if (row) row.style.backgroundColor = defaults.background_highlight
              if (id in site.data.entities) {
                update_subs(this.id, 'show', site.data.entities[id])
              }
            }
          },
          mouseout: function (e) {
            if (e.target._DT_CellIndex && e.target._DT_CellIndex.row in this.rowIds) {
              const id = this.rowIds[e.target._DT_CellIndex.row],
                row = this.rows[id].node()
              if (row) row.style.backgroundColor = 'inherit'
              if (id in site.data.entities) {
                update_subs(this.id, 'revert', site.data.entities[id])
              }
            }
          },
          click: function (e) {
            if (this.clickto && e.target._DT_CellIndex && e.target._DT_CellIndex.row in this.rowIds) {
              const id = this.rowIds[e.target._DT_CellIndex.row]
              if (id in site.data.entities) this.clickto.set(id)
            }
          },
        },
        legend: {
          init: function (o) {
            add_dependency(o.view, {type: 'update', id: o.id})
            const view = _u[o.view]
            if (view.time_agg in _u) add_dependency(view.time_agg, {type: 'update', id: o.id})
            if (!o.palette) {
              if (view.palette) {
                o.palette = view.palette
                if (view.palette in _u) add_dependency(view.palette, {type: 'update', id: o.id})
              } else {
                o.palette = 'settings.palette' in _u ? 'settings.palette' : site.settings.palette
              }
            }
            o.variable = o.e.getAttribute('variable')
            if (o.variable) {
              if (o.variable in _u) add_dependency(o.variable, {type: 'update', id: o.id})
            } else if (view.y in _u) add_dependency(view.y, {type: 'update', id: o.id})
            if (o.palette in _u) {
              const palette = _u[o.palette]
              if (palette.e) {
                palette.e.addEventListener('change', o.update)
              }
            }
            o.parsed = {summary: {}, order: [], selection: {}, time: 0, color: ''}
            o.parts = {
              ticks: o.e.getElementsByClassName('legend-ticks')[0],
              scale: o.e.getElementsByClassName('legend-scale')[0],
              summary: o.e.getElementsByClassName('legend-summary')[0],
            }
            o.parts.ticks.setAttribute('of', o.id)
            o.parts.scale.setAttribute('of', o.id)
            o.parts.summary.setAttribute('of', o.id)
            o.e.addEventListener('mousemove', elements.legend.mouseover.bind(o))
            o.e.addEventListener('mouseout', elements.legend.mouseout.bind(o))
            o.e.addEventListener('click', elements.legend.click.bind(o))
            o.click = o.e.getAttribute('click')
            if (o.click in _u) o.clickto = _u[o.click]
            o.ticks = {
              center: o.parts.summary.appendChild(document.createElement('div')),
              min: o.parts.summary.appendChild(document.createElement('div')),
              max: o.parts.summary.appendChild(document.createElement('div')),
              entity: o.parts.ticks.appendChild(document.createElement('div')),
            }
            Object.keys(o.ticks).forEach(t => {
              o.ticks[t].setAttribute('of', o.id)
              o.ticks[t].className = 'legend-tick'
              o.ticks[t].appendChild((e = document.createElement('div')))
              e.setAttribute('of', o.id)
              e.appendChild(document.createElement('p'))
              e.lastElementChild.setAttribute('of', o.id)
              if ('m' !== t.substring(0, 1)) {
                e.appendChild(document.createElement('p'))
                e.lastElementChild.setAttribute('of', o.id)
                e.appendChild(document.createElement('p'))
                e.lastElementChild.setAttribute('of', o.id)
                if ('entity' === t) {
                  o.ticks[t].firstElementChild.lastElementChild.classList.add('entity')
                } else {
                  o.ticks[t].firstElementChild.firstElementChild.classList.add('summary')
                }
              }
            })
            o.ticks.entity.firstElementChild.classList.add('hidden')
            o.ticks.max.className = 'legend-tick-end max'
            o.ticks.min.className = 'legend-tick-end min'
            o.ticks.center.style.left = '50%'
            o.show = function (e, c) {
              if (e && 'parsed' in c && e.features.name) {
                const view = _u[this.view],
                  summary = c.parsed.summary,
                  string = summary && 'levels' in summary,
                  min = summary && !string ? summary.min[c.parsed.time] : 0,
                  range = summary ? (string ? summary.levels.length - min : summary.range[c.parsed.time]) : 1,
                  n = summary.n[c.parsed.time],
                  subset = n === view.n_selected.dataset ? 'rank' : 'subset_rank',
                  es = site.data.entities[e.features.id][this.view],
                  value = e.get_value(c.parsed.color, c.parsed.time),
                  p =
                    ((string ? value in summary.level_ids : 'number' === typeof value)
                      ? site.settings.color_by_order
                        ? NaN
                        : Math.max(
                            0,
                            Math.min(1, range ? ((string ? summary.level_ids[value] : value) - min) / range : 0)
                          )
                      : NaN) * 100,
                  t = this.ticks.entity.firstElementChild.children[1]
                if (isFinite(p)) {
                  t.parentElement.classList.remove('hidden')
                  t.innerText = site.data.format_value(value, this.integer)
                  this.ticks.entity.style.left = p + '%'
                  this.ticks.entity.firstElementChild.firstElementChild.innerText =
                    (p > 96 || p < 4) && e.features.name.length > 13
                      ? e.features.name.substring(0, 12) + '…'
                      : e.features.name
                } else if (site.settings.color_by_order && c.parsed.color in es[subset]) {
                  const i = es[subset][c.parsed.color][c.parsed.time],
                    po = (i / (n - 1)) * 100
                  this.ticks.entity.firstElementChild.firstElementChild.innerText =
                    i > -1 && (po > 96 || po < 4) && e.features.name.length > 13
                      ? e.features.name.substring(0, 12) + '…'
                      : e.features.name
                  if (i > -1) {
                    t.parentElement.classList.remove('hidden')
                    t.innerText = '# ' + (n - i)
                    this.ticks.entity.style.left = po + '%'
                  }
                }
                this.ticks.entity.style.marginLeft = -this.ticks.entity.getBoundingClientRect().width / 2 + 'px'
              }
            }
            o.revert = function () {
              this.ticks.entity.firstElementChild.classList.add('hidden')
            }
            o.update()
          },
          update: async function () {
            const view = _u[this.view],
              variable = valueOf(this.variable || view.y),
              d = view.get.dataset(),
              var_info = await get_variable(variable, this.view)
            if (view.valid && var_info && this.view in var_info) {
              const time = valueOf(view.time_agg),
                y =
                  ('number' === typeof time ? time - site.data.meta.times[d].range[0] : 0) - var_info.time_range[d][0],
                summary = var_info[this.view].summaries[d],
                ep = valueOf(this.palette).toLowerCase(),
                pn = ep in palettes ? ep : site.settings.palette in palettes ? site.settings.palette : defaults.palette,
                p = palettes[pn].colors
              this.parsed.summary = summary
              this.parsed.order = var_info[this.view].order[d][y]
              this.parsed.time = y
              this.parsed.color = variable
              if (summary && y < summary.n.length) {
                this.integer =
                  site.data.variable_info[variable] && site.data.variable_info[variable].type
                    ? patterns.int_types.test(site.data.variable_info[variable].type)
                    : true
                if (pn + site.settings.color_scale_center !== this.current_palette) {
                  this.current_palette = pn + site.settings.color_scale_center
                  this.parts.scale.innerHTML = ''
                  if ('discrete' === palettes[pn].type) {
                    if (site.settings.color_by_order || 'none' === site.settings.color_scale_center) {
                      p.forEach(color => {
                        this.parts.scale.appendChild(document.createElement('span'))
                        this.parts.scale.lastElementChild.setAttribute('of', this.id)
                        this.parts.scale.lastElementChild.style.backgroundColor = color
                      })
                    } else {
                      var i = 0,
                        n = Math.ceil(p.length / 2),
                        e
                      this.parts.scale.appendChild((e = document.createElement('div')))
                      e.setAttribute('of', this.id)
                      e.style.left = 0
                      for (; i < n; i++) {
                        e.appendChild(document.createElement('span'))
                        e.lastElementChild.setAttribute('of', this.id)
                        e.lastElementChild.style.backgroundColor = p[i]
                      }
                      this.parts.scale.appendChild((e = document.createElement('div')))
                      e.setAttribute('of', this.id)
                      e.style.right = 0
                      for (i = Math.floor(p.length / 2), n = p.length; i < n; i++) {
                        e.appendChild(document.createElement('span'))
                        e.lastElementChild.setAttribute('of', this.id)
                        e.lastElementChild.style.backgroundColor = p[i]
                      }
                    }
                  } else {
                    this.parts.scale.appendChild(document.createElement('span'))
                    this.parts.scale.appendChild(document.createElement('span'))
                    this.parts.scale.firstElementChild.style.background =
                      'linear-gradient(0.25turn, rgb(' +
                      p[2][0][0] +
                      ', ' +
                      p[2][0][1] +
                      ', ' +
                      p[2][0][2] +
                      '), rgb(' +
                      p[1][0] +
                      ', ' +
                      p[1][1] +
                      ', ' +
                      p[1][2] +
                      '))'
                    this.parts.scale.lastElementChild.style.background =
                      'linear-gradient(0.25turn, rgb(' +
                      p[1][0] +
                      ', ' +
                      p[1][1] +
                      ', ' +
                      p[1][2] +
                      '), rgb(' +
                      p[0][0][0] +
                      ', ' +
                      p[0][0][1] +
                      ', ' +
                      p[0][0][2] +
                      '))'
                  }
                }
                if (var_info.levels) {
                  this.ticks.center.classList.remove('hidden')
                  this.ticks.min.firstElementChild.firstElementChild.innerText = var_info.levels[0]
                  this.ticks.max.firstElementChild.firstElementChild.innerText =
                    var_info.levels[var_info.levels.length - 1]
                } else if (site.settings.color_by_order) {
                  this.ticks.center.classList.add('hidden')
                  this.ticks.min.firstElementChild.firstElementChild.innerText =
                    '# ' + (summary.n[y] ? summary.n[y] : 0)
                  this.ticks.max.firstElementChild.firstElementChild.innerText = '# ' + (summary.n[y] ? 1 : 0)
                } else {
                  this.ticks.center.classList.remove('hidden')
                  this.ticks.min.firstElementChild.firstElementChild.innerText = summary.n[y]
                    ? isFinite(summary.min[y])
                      ? site.data.format_value(summary.min[y], this.integer)
                      : 'unknown'
                    : 'unknown'
                  this.ticks.max.firstElementChild.firstElementChild.innerText = summary.n[y]
                    ? isFinite(summary.max[y])
                      ? site.data.format_value(summary.max[y], this.integer)
                      : 'unknown'
                    : 'unknown'
                  if ('none' !== site.settings.color_scale_center) {
                    this.ticks.center.firstElementChild.lastElementChild.innerText =
                      summary_levels[site.settings.summary_selection] + ' ' + site.settings.color_scale_center
                    this.ticks.center.firstElementChild.children[1].innerText = site.data.format_value(
                      summary[site.settings.color_scale_center][y]
                    )
                    this.ticks.center.style.left = summary['norm_' + site.settings.color_scale_center][y] * 100 + '%'
                  } else {
                    this.ticks.center.firstElementChild.lastElementChild.innerText =
                      summary_levels[site.settings.summary_selection] + ' median'
                    this.ticks.center.firstElementChild.children[1].innerText = site.data.format_value(
                      summary.median[y]
                    )
                    this.ticks.center.style.left = summary.norm_median[y] * 100 + '%'
                  }
                  if (2 === this.parts.scale.childElementCount) {
                    if ('none' === site.settings.color_scale_center) {
                      this.parts.scale.firstElementChild.style.width = '50%'
                      this.parts.scale.lastElementChild.style.width = '50%'
                    } else {
                      this.parts.scale.firstElementChild.style.width =
                        summary['norm_' + site.settings.color_scale_center][y] * 100 + '%'
                      this.parts.scale.lastElementChild.style.width =
                        100 - summary['norm_' + site.settings.color_scale_center][y] * 100 + '%'
                    }
                  }
                  this.ticks.center.style.marginLeft = -this.ticks.center.getBoundingClientRect().width / 2 + 'px'
                }
              }
            }
          },
          mouseover: function (e) {
            const s = this.parts.scale.getBoundingClientRect(),
              p = (Math.max(s.x, Math.min(s.x + s.width, e.clientX)) - s.x) / s.width
            var entity = false
            if (site.settings.color_by_order) {
              if (this.parsed.order && this.parsed.order.length)
                entity =
                  site.data.entities[
                    this.parsed.order[
                      Math.max(
                        this.parsed.summary.missing[this.parsed.time],
                        Math.min(this.parsed.order.length - 1, Math.floor((this.parsed.order.length - 1) * p))
                      )
                    ][0]
                  ]
            } else {
              const min = this.parsed.summary.min[this.parsed.time],
                max = this.parsed.summary.max[this.parsed.time],
                tv = min + p * (max - min)
              var i, n
              if (this.parsed.order && this.parsed.order.length) {
                n = this.parsed.summary.missing[this.parsed.time]
                if (n < this.parsed.order.length) {
                  if (1 === this.parsed.order.length || !p) {
                    entity = site.data.entities[this.parsed.order[n][0]]
                  } else {
                    for (i = this.parsed.order.length - 2; i >= n; --i) {
                      if ((this.parsed.order[i][1] + this.parsed.order[i + 1][1]) / 2 <= tv) break
                    }
                    i++
                    entity = site.data.entities[this.parsed.order[i][0]]
                  }
                }
              }
            }
            if (entity) {
              this.show(entity, this)
              if (!this.entity || entity.features.id !== this.entity.features.id) {
                if (!this.entity) {
                  this.entity = entity
                } else update_subs(this.id, 'revert', this.entity)
                update_subs(this.id, 'show', entity)
                this.entity = entity
              }
            }
          },
          mouseout: function (e) {
            if (e.relatedTarget && this.id !== e.relatedTarget.getAttribute('of')) {
              this.revert()
              if (this.entity) {
                update_subs(this.id, 'revert', this.entity)
                this.entity = false
              }
            }
          },
          click: function () {
            if (this.clickto && this.entity) {
              this.revert()
              this.clickto.set(this.entity.features.id)
            }
          },
        },
        credits: {
          init: function (o) {
            const s = site.credit_output && site.credit_output[o.id]
            o.exclude = []
            o.add = {}
            o.exclude = (s && s.exclude) || []
            o.add = (s && s.add) || {}
            o.e.appendChild(document.createElement('ul'))
            Object.keys(site.credits).forEach(k => {
              if (-1 === o.exclude.indexOf(k)) {
                const c = site.credits[k]
                var e
                o.e.lastElementChild.appendChild((e = document.createElement('li')))
                if ('url' in c) {
                  e.appendChild((e = document.createElement('a')))
                  e.href = c.url
                  e.target = '_blank'
                  e.rel = 'noreferrer'
                }
                e.innerText = c.name
                if ('version' in c) {
                  e.appendChild(document.createElement('span'))
                  e.lastElementChild.className = 'version-tag'
                  e.lastElementChild.innerText = c.version
                }
                if ('description' in c) {
                  e.parentElement.appendChild(document.createElement('p'))
                  e.parentElement.lastElementChild.innerText = c.description
                }
              }
            })
          },
        },
      },
      value_types = {
        percent: function (v) {
          return v + '%'
        },
        'drive time': function (v) {
          return v + ' minutes'
        },
        minutes: function (v) {
          return v + ' minutes'
        },
        dollar: function (v) {
          return '$' + v
        },
        'internet speed': function (v) {
          return v + ' MB/s'
        },
      },
      storage = {
        name: window.location.pathname || 'default',
        perm: window.localStorage || {
          setItem: function () {},
          getItem: function () {},
          removeItem: function () {},
        },
        set: function (opt, value) {
          const s = JSON.parse(this.perm.getItem(this.name)) || {}
          s[opt] = value
          this.perm.setItem(this.name, JSON.stringify(s))
        },
        get: function (opt) {
          const s = JSON.parse(this.perm.getItem(this.name))
          return s ? (opt ? s[opt] : s) : undefined
        },
      },
      page = {
        load_screen: document.getElementById('load_screen'),
        wrap: document.getElementById('site_wrap'),
        navbar: document.getElementsByClassName('navbar')[0],
        content: document.getElementsByClassName('content')[0],
        menus: document.getElementsByClassName('menu-wrapper'),
        panels: document.getElementsByClassName('panel'),
      },
      queue = {_timeout: 0},
      defaults = {
        time: 'time',
        dataview: 'default_view',
        palette: 'vik',
        background_highlight: '#adadad',
        border: '#7e7e7e',
        border_highlight_true: '#ffffff',
        border_highlight_false: '#000000',
        missing: '#00000000',
      },
      summary_levels = {dataset: 'Overall', filtered: 'Filtered', all: 'Selection'},
      meta = {
        retain_state: true,
      },
      subs = {},
      rule_conditions = {},
      keys = {},
      _u = {},
      _c = {},
      tree = {}

    document.body.className = storage.get('theme_dark') || site.settings.theme_dark ? 'dark-theme' : 'light-theme'
    if (page.content) {
      var i = page.menus.length,
        h = page.navbar ? page.navbar.getBoundingClientRect().height : 0
      for (; i--; )
        if (page.menus[i].classList.contains('menu-top')) {
          h = page.menus[i].getBoundingClientRect().height
          break
        }
      page.content.style.top = h + 'px'
    }

    function pal(value, which, summary, index, rank, total) {
      if (isNaN(value)) return defaults.missing
      const centered = 'none' !== site.settings.color_scale_center && !site.settings.color_by_order,
        fixed = 'discrete' === palettes[which].type,
        colors = palettes[which].colors,
        string = 'levels' in summary,
        min = !string ? summary.min[index] : 0,
        range = string ? summary.levels.length - min : summary.range[index],
        center_source =
          'none' === site.settings.color_scale_center || patterns.median.test(site.settings.color_scale_center)
            ? 'median'
            : 'mean',
        center = site.settings.color_by_order
          ? centered
            ? summary['break_' + center_source][index] / total
            : 0.5
          : isNaN(summary['norm_' + center_source][index])
          ? 0
          : summary['norm_' + center_source][index],
        r = fixed ? (centered && !site.settings.color_by_order ? Math.ceil(colors.length / 2) : colors.length) : 1,
        p = site.settings.color_by_order
          ? rank / total
          : range
          ? ((string ? summary.level_ids[value] : value) - min) / range
          : 0,
        upper = p > (centered ? center : 0.5)
      var v = centered
        ? range
          ? upper
            ? (p - center - summary['upper_' + center_source + '_min'][index]) /
              summary['upper_' + center_source + '_range'][index]
            : (p + center - summary['lower_' + center_source + '_min'][index]) /
              summary['lower_' + center_source + '_range'][index]
          : 0
        : p
      if (!fixed) {
        v = Math.max(0, Math.min(1, v))
        if (upper) v = 1 - v
        if (!centered) v *= 2
      }
      return (string ? value in summary.level_ids : 'number' === typeof value)
        ? fixed
          ? colors[
              Math.max(
                0,
                Math.min(
                  colors.length - 1,
                  Math.floor(centered ? (upper ? r - (colors.length % 2) + r * v : r * v) : r * v)
                )
              )
            ]
          : 'rgb(' +
            (upper
              ? colors[0][0][0] +
                v * colors[0][1][0] +
                ', ' +
                (colors[0][0][1] + v * colors[0][1][1]) +
                ', ' +
                (colors[0][0][2] + v * colors[0][1][2])
              : colors[2][0][0] +
                v * colors[2][1][0] +
                ', ' +
                (colors[2][0][1] + v * colors[2][1][1]) +
                ', ' +
                (colors[2][0][2] + v * colors[2][1][2])) +
            ')'
        : defaults.missing
    }

    function init_text(o, text) {
      if (!('button' in text)) text.button = {}
      if ('string' === typeof text.text) text.text = [text.text]
      text.parts = document.createElement('span')
      text.text.forEach(k => {
        if (k in text.button) {
          const p = text.button[k]
          text.parts.appendChild(document.createElement('button'))
          text.parts.lastElementChild.type = 'button'
          p.trigger = tooltip_trigger.bind({id: o.id + p.text, note: p.target, wrapper: text.parts.lastElementChild})
          if ('note' === p.type) {
            text.parts.lastElementChild.setAttribute('aria-description', p.target)
            text.parts.lastElementChild.setAttribute('of', o.id + p.text)
            text.parts.lastElementChild.className = 'has-note'
            text.parts.lastElementChild.addEventListener('mouseover', p.trigger)
            text.parts.lastElementChild.addEventListener('focus', p.trigger)
            text.parts.lastElementChild.addEventListener('blur', tooltip_clear)
          } else {
            text.parts.lastElementChild.className = 'btn btn-link'
            const u = _u[p.target]
            if (u && 'function' === typeof u[p.type]) {
              text.parts.lastElementChild.setAttribute('aria-label', p.text.join(''))
              text.parts.lastElementChild.addEventListener('click', u[p.type])
            }
          }
        } else {
          text.parts.appendChild(document.createElement('span'))
        }
      })
      if ('condition' in text) {
        for (let i = text.condition.length; i--; ) {
          const c = text.condition[i]
          if (c.id) {
            if ('default' === c.id) {
              c.check = function () {
                return true
              }
            } else {
              o.depends[c.id] = ''
              c.check = function () {
                return (
                  'default' === this.id ||
                  DataHandler.prototype.checks[this.type](valueOf(this.id), valueOf(this.value))
                )
              }.bind(c)
            }
          }
        }
      }
    }

    function fill_ids_options(u, d, out) {
      if (!(d in site.data.sets)) {
        site.data.data_queue[d][u.id] = function () {
          return fill_ids_options(u, d, out)
        }
        if (site.data.loaded[d]) site.data.load_id_maps()
        return
      }
      out[d] = {options: [], values: {}, display: {}}
      const current = u.values,
        s = out[d].options,
        values = out[d].values,
        disp = out[d].display
      var ck = !u.sensitive && !!u.current_set,
        n = 0
      Object.keys(site.data.entities).forEach(k => {
        if (d === site.data.entities[k].group) {
          if (ck && !(k in current)) {
            u.sensitive = true
            ck = false
          }
          s.push(u.add(k, site.data.entities[k].features.name))
          values[k] = n
          disp[site.data.entities[k].features.name] = n++
        }
      })
    }

    function fill_variables_options(u, d, out) {
      out[d] = {options: [], values: {}, display: {}}
      const current = u.values,
        s = out[d].options,
        values = out[d].values,
        disp = out[d].display
      var ck = !u.sensitive && !!u.current_set,
        n = 0
      site.metadata.info[d].schema.fields.forEach(m => {
        const v = site.data.variables[m.name]
        if (v && !v.is_time) {
          const l = site.data.format_label(m.name)
          if (ck && !(k in current)) {
            u.sensitive = true
            ck = false
          }
          s.push(u.add(m.name, l, m))
          values[m.name] = n
          disp[l] = n++
        }
      })
    }

    function fill_levels_options(u, d, v, out) {
      const m = site.data.variables[v].info[d],
        t = 'string' === m.type ? 'levels' : 'ids',
        l = m[t]
      if (l) {
        const k = d + v
        out[k] = {options: [], values: {}, display: {}}
        const current = u.values,
          s = out[k].options,
          values = out[k].values,
          disp = out[k].display
        var ck = !u.sensitive && !!u.current_set,
          n = 0
        Object.keys(l).forEach(k => {
          const lk = l[k]
          if (ck && !(k in current)) {
            u.sensitive = true
            ck = false
          }
          s.push(u.add(lk.id, lk.name))
          values[lk.id] = n
          disp[lk.name] = n++
        })
      } else if ('ids' === t) {
        site.data.data_queue[d][u.id] = function () {
          return fill_levels_options(u, d, v, out)
        }
        if (site.data.loaded[d]) site.data.load_id_maps()
      }
    }

    function sort_tree_children(a, b) {
      return !(a.id in tree) || !(b.id in tree) ? -Infinity : tree[a.id]._n.children - tree[b.id]._n.children
    }

    function add_dependency(id, o) {
      if (!(id in _c)) _c[id] = []
      _c[id].push(o)
      if (!(id in tree)) tree[id] = {_n: {children: 0, parents: 0}, children: {}, parents: {}}
      if (!(o.id in tree)) tree[o.id] = {_n: {children: 0, parents: 0}, children: {}, parents: {}}
      tree[id].children[o.id] = tree[o.id]
      tree[id]._n.children++
      tree[o.id].parents[id] = tree[id]
      tree[o.id]._n.parents++
      _c[id].sort(sort_tree_children)
      request_queue(id)
    }

    function add_subs(id, o) {
      if (!(id in subs)) subs[id] = []
      subs[id].push(o)
    }

    function update_subs(id, fun, e) {
      if (id in subs) {
        for (var i = subs[id].length; i--; ) {
          if (fun in subs[id][i]) subs[id][i][fun](e, _u[id])
        }
      }
    }

    function update_plot_theme(u) {
      if (u.dark_theme !== site.settings.theme_dark) {
        u.dark_theme = site.settings.theme_dark
        const s = getComputedStyle(document.body)
        if (!('style' in u)) {
          u.style = u.options.layout
          if (!('font' in u.style)) u.style.font = {}
          if (!('modebar' in u.style)) u.style.modebar = {}
          if (!('font' in u.style.xaxis)) u.style.xaxis.font = {}
          if (!('font' in u.style.yaxis)) u.style.yaxis.font = {}
        }
        u.style.paper_bgcolor = s.backgroundColor
        u.style.plot_bgcolor = s.backgroundColor
        u.style.font.color = s.color
        u.style.modebar.bgcolor = s.backgroundColor
        u.style.modebar.color = s.color
        if (u.e._fullLayout.xaxis.showgrid) u.style.xaxis.gridcolor = s.borderColor
        if (u.e._fullLayout.yaxis.showgrid) u.style.yaxis.gridcolor = s.borderColor
        u.style.xaxis.font.color = s.color
        u.style.yaxis.font.color = s.color
        Plotly.relayout(u.e, u.options.layout)
      }
    }

    function make_data_entry(u, e, rank, total, name, color) {
      if (e.data && u.parsed.x in site.data.variables) {
        const x = site.data.retrievers.vector({variable: u.parsed.x, entity: e}),
          y = site.data.retrievers.vector({variable: u.parsed.y, entity: e}),
          t = JSON.parse(u.traces[u.base_trace])
        for (let i = site.data.variables[u.parsed.x].time_range[u.parsed.dataset][2]; i--; ) {
          t.text[i] = e.features.name
          t.x[i] = u.parsed.x_range[0] <= i && i <= u.parsed.x_range[1] ? x[i - u.parsed.x_range[0]] : NaN
          t.y[i] = u.parsed.y_range[0] <= i && i <= u.parsed.y_range[1] ? y[i - u.parsed.y_range[0]] : NaN
        }
        t.type = u.parsed.base_trace
        t.color =
          t.line.color =
          t.marker.color =
          t.textfont.color =
            color ||
            pal(
              e.get_value(u.parsed.color, u.parsed.time),
              u.parsed.palette,
              u.parsed.summary,
              u.parsed.time,
              rank,
              total
            ) ||
            defaults.border
        if ('bar' === t.type) t.marker.line.width = 0
        t.name = name || e.features.name
        t.id = e.features.id
        return t
      }
    }

    function make_variable_reference(c) {
      const e = document.createElement('li'),
        n = c.author.length
      var s = '',
        j = 1 === n ? '' : 2 === n ? ' & ' : ', & '
      for (let i = n; i--; ) {
        const a = c.author[i]
        s = (i ? j : '') + a.family + (a.given ? ', ' + a.given.substring(0, 1) + '.' : '') + s
        j = ', '
      }
      e.innerHTML =
        s +
        ' (' +
        c.year +
        '). ' +
        c.title +
        '.' +
        (c.journal
          ? ' <em>' + c.journal + (c.volume ? ', ' + c.volume : '') + '</em>' + (c.page ? ', ' + c.page : '') + '.'
          : '') +
        (c.version ? ' Version ' + c.version + '.' : '') +
        (c.doi || c.url
          ? (c.doi ? ' doi: ' : ' url: ') +
            (c.doi || c.url
              ? '<a rel="noreferrer" target="_blank" href="' +
                (c.doi ? 'https://doi.org/' + c.doi : c.url) +
                '">' +
                (c.doi || c.url.replace(patterns.http, '')) +
                '</a>'
              : '')
          : '')
      return e
    }

    function make_variable_source(s) {
      var e = document.createElement('tr')
      if (s.name) {
        e.appendChild(document.createElement('td'))
        if (s.url) {
          e.firstElementChild.appendChild(document.createElement('a'))
          e.firstElementChild.firstElementChild.target = '_blank'
          e.firstElementChild.firstElementChild.rel = 'noreferrer'
          e.firstElementChild.firstElementChild.href = s.url
        } else {
          e.firstElementChild.appendChild(document.createElement('span'))
        }
        e.firstElementChild.firstElementChild.innerText = s.name
      }
      if (s.date_accessed) {
        e.appendChild(document.createElement('td'))
        e.lastElementChild.appendChild(document.createElement('span'))
        e.lastElementChild.firstElementChild.innerText = s.date_accessed
      }
      return e
    }

    function show_variable_info() {
      const v = _u[this.view],
        info = site.data.variable_info[valueOf(this.v || v.y)]
      page.modal.info.header.firstElementChild.innerText = info.short_name
      page.modal.info.title.innerText = info.long_name
      page.modal.info.description.innerText = info.long_description || info.description || info.short_description || ''
      page.modal.info.name.lastElementChild.innerText = info.measure || ''
      page.modal.info.type.lastElementChild.innerText = info.type || ''
      if (info.sources && info.sources.length) {
        page.modal.info.sources.lastElementChild.lastElementChild.innerHTML = ''
        page.modal.info.sources.classList.remove('hidden')
        info.sources.forEach(s => {
          page.modal.info.sources.lastElementChild.lastElementChild.appendChild(make_variable_source(s))
        })
      } else page.modal.info.sources.classList.add('hidden')
      if (info.citations && info.citations.length) {
        page.modal.info.references.lastElementChild.innerHTML = ''
        page.modal.info.references.classList.remove('hidden')
        if ('string' === typeof info.citations) info.citations = [info.citations]
        if ('references' in site.data) {
          delete site.data.variable_info._references
          delete site.data.references
        }
        if (!('_references' in site.data.variable_info)) {
          const r = {}
          site.data.variable_info._references = r
          Object.keys(site.data.info).forEach(d => {
            const m = site.data.info[d]
            if ('_references' in m) {
              Object.keys(m._references).forEach(t => {
                if (!(t in r))
                  r[t] = {
                    reference: m._references[t],
                    element: make_variable_reference(m._references[t]),
                  }
              })
            }
          })
        }
        const r = site.data.variable_info._references
        info.citations.forEach(c => {
          if (c in r) page.modal.info.references.lastElementChild.appendChild(r[c].element)
        })
      } else page.modal.info.references.classList.add('hidden')
    }

    function parse_variables(s, type, e, entity) {
      if ('statement' === type) {
        for (var m, v; (m = patterns.mustache.exec(s)); ) {
          if ('value' === m[1]) {
            v = entity
              ? site.data.format_value(
                  entity.get_value(e.v, e.time),
                  patterns.int_types.test(site.data.variable_info[e.v].type)
                )
              : 'unknown'
            s = s.replace(
              m[0],
              'unknown' !== v && site.data.variable_info[e.v].type in value_types
                ? value_types[site.data.variable_info[e.v].type](v)
                : v
            )
            patterns.mustache.lastIndex = 0
          } else if (entity) {
            if ('region_name' === m[1]) {
              s = s.replace(m[0], entity.features.name)
              patterns.mustache.lastIndex = 0
            } else if (patterns.features.test(m[1])) {
              s = s.replace(m[0], entity.features[m[1].replace(patterns.features, '')])
              patterns.mustache.lastIndex = 0
            } else if (patterns.variables.test(m[1])) {
              s = s.replace(m[0], entity.variables[e.v][m[1].replace(patterns.variables, '')])
              patterns.mustache.lastIndex = 0
            } else if (patterns.data.test(m[1])) {
              s = s.replace(m[0], entity.get_value(m[1].replace(patterns.data, ''), e.time))
              patterns.mustache.lastIndex = 0
            }
          }
        }
      }
      return s
    }

    var k, i, e, ee, c
    // get options from url
    site.query = k = window.location.search.replace('?', '')
    site.url_options = {}
    if (k) {
      e = k.split('&')
      for (i = e.length; i--; ) {
        c = e[i].split('=')
        if (c.length < 2) c.push('true')
        c[1] = patterns.bool.test(c[1]) ? !!c[1] || 'true' === c[1] : c[1].replace(patterns.url_spaces, ' ')
        site.url_options[c[0]] = c[1]
        if (patterns.settings.test(c[0])) storage.set(c[0].replace(patterns.settings, ''), c[1])
      }
    }

    // prepare embedded view
    if ('embedded' in site.url_options || 'hide_navbar' in site.url_options) {
      if (!('hide_logo' in site.url_options)) site.url_options.hide_logo = true
      if (!('hide_title' in site.url_options)) site.url_options.hide_title = true
      if (!('hide_navcontent' in site.url_options)) site.url_options.hide_navcontent = true
      if (!('hide_panels' in site.url_options)) site.url_options.hide_panels = true
      if ('embedded' in site.url_options && !('close_menus' in site.url_options)) site.url_options.close_menus = true
    }
    e = document.getElementsByClassName('navbar')[0]
    if (e) {
      if ('navcolor' in site.url_options) {
        if ('' === site.url_options.navcolor) site.url_options.navcolor = window.location.hash
        e.style.backgroundColor = site.url_options.navcolor.replace('%23', '#')
      }
      if (site.url_options.hide_logo && site.url_options.hide_title && site.url_options.hide_navcontent) {
        e.classList.add('hidden')
      } else {
        e = document.getElementsByClassName('navbar-brand')[0]
        if (e) {
          if (site.url_options.hide_logo && 'IMG' === e.firstElementChild.tagName)
            e.firstElementChild.classList.add('hidden')
          if (site.url_options.hide_title && 'IMG' !== e.lastElementChild.tagName)
            e.lastElementChild.classList.add('hidden')
        }
        if (site.url_options.hide_navcontent) {
          document.getElementsByClassName('navbar-toggler')[0].classList.add('hidden')
          e = document.getElementsByClassName('navbar-nav')[0]
          if (e) e.classList.add('hidden')
        }
      }
      if (site.url_options.hide_panels && page.panels.length) {
        for (i = page.panels.length; i--; ) {
          page.panels[i].classList.add('hidden')
        }
      }
    }

    // check for stored settings
    storage.copy = storage.get()
    if (storage.copy)
      for (const k in site.settings) {
        if (k in storage.copy) {
          let c = storage.copy[k]
          if (patterns.bool.test(c)) {
            c = !!c || 'true' === c
          } else if (patterns.number.test(c)) c = parseFloat(c)
          site.settings[k] = c
        }
      }

    // preprocess polynomial palettes
    function poly_channel(ch, pos, coefs) {
      const n = coefs.length
      for (var v = coefs[0][ch] + pos * coefs[1][ch], i = 2; i < n; i++) {
        v += Math.pow(pos, i) * coefs[i][ch]
      }
      return Math.max(0, Math.min(255, v))
    }
    Object.keys(palettes).forEach(k => {
      const n = 255,
        p = palettes[k]
      if ('continuous-polynomial' === p.type) {
        const c = p.colors
        p.type = 'discrete'
        p.colors = []
        for (let i = 0; i < n; i++) {
          const v = i / n
          p.colors.push(
            'rgb(' + poly_channel(0, v, c) + ', ' + poly_channel(1, v, c) + ', ' + poly_channel(2, v, c) + ')'
          )
        }
      }
    })

    window.onload = function () {
      page.navbar = document.getElementsByClassName('navbar')[0]
      page.navbar = page.navbar ? page.navbar.getBoundingClientRect() : {height: 0}
      page.content = document.getElementsByClassName('content')[0]
      page.menus = [...document.getElementsByClassName('menu-wrapper')]
      page.panels = [...document.getElementsByClassName('panel')]
      page.content_bounds = {
        top: page.navbar.height,
        right: 0,
        bottom: 0,
        left: 0,
      }
      page.script_style = document.head.appendChild(document.createElement('style'))
      if (site.settings.hide_tooltips) page.script_style.sheet.insertRule(tooltip_icon_rule, 0)
      page.menu_toggler = {
        hide: function () {
          this.classList.add('hidden')
          trigger_resize()
        },
        toggle: function (type) {
          clearTimeout(page.menu_toggler.timeout)
          if ('closed' === this.parentElement.state) {
            this.parentElement.state = 'open'
            this.parentElement.firstElementChild.classList.remove('hidden')
            this.parentElement.style[type] = '0px'
            page.content.style[type] =
              this.parentElement.getBoundingClientRect()['left' === type || 'right' === type ? 'width' : 'height'] +
              'px'
            setTimeout(trigger_resize, 300)
          } else {
            this.parentElement.state = 'closed'
            if ('left' === type || 'right' === type) {
              this.parentElement.style[type] = -this.parentElement.getBoundingClientRect().width + 'px'
              page.content.style[type] = page.content_bounds[type] + 'px'
            } else {
              page.content.style[type] =
                page.content_bounds[type] + ('top' === type ? page.content_bounds.top : 0) + 'px'
              this.parentElement.style[type] =
                -this.parentElement.getBoundingClientRect().height +
                ('top' === type ? page.content_bounds.top : 0) +
                'px'
            }
            page.menu_toggler.timeout = setTimeout(
              page.menu_toggler.hide.bind(this.parentElement.firstElementChild),
              300
            )
          }
        },
        timeout: -1,
      }
      page.modal = {
        info: {
          init: false,
          e: document.createElement('div'),
        },
        filter: {
          init: false,
          e: document.createElement('div'),
        },
      }
      page.load_screen = document.getElementById('load_screen')

      // make variable info popup
      e = page.modal.info.e
      document.body.appendChild(e)
      page.modal.info.init = true
      e.id = 'variable_info_display'
      e.className = 'modal fade'
      e.setAttribute('tabindex', '-1')
      e.setAttribute('aria-labelledby', 'variable_info_title')
      e.ariaHidden = 'true'
      e.appendChild(document.createElement('div'))
      e.firstElementChild.className = 'modal-dialog modal-dialog-scrollable'
      e.firstElementChild.appendChild(document.createElement('div'))
      e.firstElementChild.firstElementChild.className = 'modal-content'
      e.firstElementChild.firstElementChild.appendChild((page.modal.info.header = document.createElement('div')))
      e = page.modal.info
      e.header.className = 'modal-header'
      e.header.appendChild(document.createElement('p'))
      e.header.firstElementChild.className = 'h5 modal-title'
      e.header.firstElementChild.id = 'variable_info_title'
      e.header.appendChild(document.createElement('button'))
      e.header.lastElementChild.type = 'button'
      e.header.lastElementChild.className = 'btn-close'
      e.header.lastElementChild.setAttribute('data-bs-dismiss', 'modal')
      e.header.lastElementChild.title = 'close'
      e.header.insertAdjacentElement('afterEnd', (e.body = document.createElement('div')))
      e.body.className = 'modal-body'
      e.body.appendChild((e.title = document.createElement('p')))
      e.title.className = 'h4'
      e.body.appendChild((e.description = document.createElement('p')))

      e.body.appendChild(document.createElement('table'))
      e.body.lastElementChild.className = 'info-feature-table'

      e.body.lastElementChild.appendChild((e.name = document.createElement('tr')))
      e.name.appendChild(document.createElement('td'))
      e.name.firstElementChild.innerText = 'Name'
      e.name.appendChild(document.createElement('td'))

      e.body.lastElementChild.appendChild((e.type = document.createElement('tr')))
      e.type.appendChild(document.createElement('td'))
      e.type.firstElementChild.innerText = 'Type'
      e.type.appendChild(document.createElement('td'))

      e.body.appendChild((e.sources = document.createElement('div')))
      e.sources.appendChild((e = document.createElement('table')))
      e.className = 'source-table'
      e.appendChild(document.createElement('thead'))
      e.firstElementChild.appendChild(document.createElement('tr'))
      e.firstElementChild.firstElementChild.appendChild(document.createElement('th'))
      e.firstElementChild.firstElementChild.appendChild(document.createElement('th'))
      e.firstElementChild.firstElementChild.firstElementChild.innerText = 'Source'
      e.firstElementChild.firstElementChild.lastElementChild.innerText = 'Accessed'
      e.appendChild(document.createElement('tbody'))

      e = page.modal.info
      e.body.appendChild((e.references = document.createElement('div')))
      e.references.appendChild(document.createElement('p'))
      e.references.firstElementChild.className = 'h3'
      e.references.firstElementChild.innerText = 'References'
      e.references.appendChild((e = document.createElement('ul')))
      e.className = 'reference-list'

      // set up filter's time range
      document.body.appendChild((e = page.modal.filter.e))
      page.modal.filter.init = true
      e.id = 'filter_display'
      e.className = 'modal fade'
      e.setAttribute('tabindex', '-1')
      e.setAttribute('aria-labelledby', 'filter_title')
      e.ariaHidden = 'true'
      e.appendChild(document.createElement('div'))
      e.firstElementChild.className = 'modal-dialog'
      e.firstElementChild.appendChild(document.createElement('div'))
      e.firstElementChild.firstElementChild.className = 'modal-content'
      e.firstElementChild.firstElementChild.appendChild((page.modal.filter.header = document.createElement('div')))
      e = page.modal.filter
      e.header.className = 'modal-header'
      e.header.appendChild(document.createElement('p'))
      e.header.firstElementChild.className = 'h5 modal-title'
      e.header.firstElementChild.id = 'filter_title'
      e.header.firstElementChild.innerText = 'Filter'
      e.header.appendChild(document.createElement('button'))
      e.header.lastElementChild.type = 'button'
      e.header.lastElementChild.className = 'btn-close'
      e.header.lastElementChild.setAttribute('data-bs-dismiss', 'modal')
      e.header.lastElementChild.title = 'close'
      e.header.insertAdjacentElement('afterEnd', (e.body = document.createElement('div')))
      e.body.className = 'modal-body'
      e.body.appendChild(document.createElement('p'))
      e.body.lastElementChild.className = 'h6 text-muted'
      e.body.lastElementChild.innerText = 'Time Range'

      e.body.appendChild((e.time_range = document.createElement('div')))
      e.time_range.className = 'row'

      e.time_range.appendChild(document.createElement('div'))
      e.time_range.lastElementChild.className = 'col'
      e.time_range.lastElementChild.appendChild((ee = document.createElement('div')))
      ee.className = 'form-floating text-wrapper wrapper'
      ee.appendChild(document.createElement('input'))
      ee.lastElementChild.className = 'form-control auto-input'
      ee.lastElementChild.setAttribute('auto-type', 'number')
      ee.lastElementChild.setAttribute('default', 'min')
      ee.lastElementChild.max = 'filter.time_max'
      ee.lastElementChild.type = 'number'
      ee.lastElementChild.autoType = 'number'
      ee.lastElementChild.id = 'filter.time_min'
      ee.appendChild(document.createElement('label'))
      ee.lastElementChild.innerText = 'First Time'
      ee.lastElementChild.setAttribute('for', 'filter.time_min')
      e.time_range.appendChild(document.createElement('div'))
      e.time_range.lastElementChild.className = 'col'
      e.time_range.lastElementChild.appendChild((ee = document.createElement('div')))
      ee.className = 'form-floating text-wrapper wrapper'
      ee.appendChild(document.createElement('input'))
      ee.lastElementChild.className = 'form-control auto-input'
      ee.lastElementChild.setAttribute('auto-type', 'number')
      ee.lastElementChild.setAttribute('default', 'max')
      ee.lastElementChild.min = 'filter.time_min'
      ee.lastElementChild.type = 'number'
      ee.lastElementChild.autoType = 'number'
      ee.lastElementChild.id = 'filter.time_max'
      ee.appendChild(document.createElement('label'))
      ee.lastElementChild.innerText = 'Last Time'
      ee.lastElementChild.setAttribute('for', 'filter.time_max')

      page.panels.length &&
        page.panels.forEach(p => {
          page.content_bounds[p.classList.contains('panel-left') ? 'left' : 'right'] = p.getBoundingClientRect().width
          p.style.marginTop = page.content_bounds.top + 'px'
        })
      page.menus.length &&
        page.menus.forEach(m => {
          m.state = m.getAttribute('state')
          if (m.classList.contains('menu-top')) {
            page.top_menu = m
            page.top_menu.style.left = page.content_bounds.left + 'px'
            page.top_menu.style.right = page.content_bounds.right + 'px'
            if (m.lastElementChild.tagName === 'BUTTON') {
              m.lastElementChild.addEventListener('click', page.menu_toggler.toggle.bind(m.lastElementChild, 'top'))
              m.lastElementChild.style.top = page.content_bounds.top + 'px'
            }
          } else if (m.classList.contains('menu-right')) {
            page.right_menu = m
            page.right_menu.style.right = page.content_bounds.right + 'px'
            if (m.lastElementChild.tagName === 'BUTTON') {
              m.lastElementChild.addEventListener('click', page.menu_toggler.toggle.bind(m.lastElementChild, 'right'))
              m.lastElementChild.style.top = page.content_bounds.top + 'px'
            }
          } else if (m.classList.contains('menu-bottom')) {
            page.bottom_menu = m
            page.content_bounds.bottom = 40
            page.bottom_menu.style.left = page.content_bounds.left + 'px'
            page.bottom_menu.style.right = page.content_bounds.right + 'px'
            if (m.lastElementChild.tagName === 'BUTTON') {
              m.lastElementChild.addEventListener('click', page.menu_toggler.toggle.bind(m.lastElementChild, 'bottom'))
            }
          } else if (m.classList.contains('menu-left')) {
            page.left_menu = m
            page.left_menu.style.left = page.content_bounds.left + 'px'
            if (m.lastElementChild.tagName === 'BUTTON') {
              m.lastElementChild.addEventListener('click', page.menu_toggler.toggle.bind(m.lastElementChild, 'left'))
              m.lastElementChild.style.top = page.content_bounds.top + 'px'
            }
          }
          if (site.url_options.close_menus && 'open' === m.state) m.lastElementChild.click()
        })

      // initialize global tooltip
      page.tooltip = {
        e: document.createElement('div'),
        showing: '',
      }
      page.tooltip.e.className = 'tooltip hidden'
      page.tooltip.e.appendChild(document.createElement('p'))
      page.wrap.appendChild(page.tooltip.e)
      page.wrap.addEventListener('mouseover', tooltip_clear)

      // initialize inputs
      if (site.dataviews) {
        for (const k in site.dataviews)
          if (k in site.dataviews) {
            defaults.dataview = k
            break
          }
      } else {
        site.dataviews = {}
        site.dataviews[defaults.dataview] = {}
      }
      ;[...document.getElementsByClassName('auto-input')].forEach(e => {
        const o = {
          type: e.getAttribute('auto-type'),
          source: void 0,
          value: function () {
            const v = valueOf(this.source)
            return 'undefined' === typeof v ? valueOf(this.default) : v
          },
          default: e.getAttribute('default'),
          options_source: e.getAttribute('auto-options'),
          depends: e.getAttribute('depends'),
          variable: e.getAttribute('variable'),
          dataset: e.getAttribute('dataset'),
          view: e.getAttribute('data-view'),
          id: e.id || e.options_source || 'ui' + n++,
          note: e.getAttribute('aria-description') || '',
          current_index: -1,
          previous: '',
          e: e,
          values: [],
          display: [],
          data: [],
          input: true,
        }
        o.settings = o.type in site && o.id in site[o.type] ? site[o.type][o.id] : {}
        o.wrapper = o.e.parentElement.classList.contains('wrapper')
          ? o.e.parentElement
          : o.e.parentElement.parentElement
        if (o.wrapper) {
          if (o.note) o.wrapper.classList.add('has-note')
          o.wrapper.setAttribute('of', o.id)
          ;['div', 'label', 'fieldset', 'legend', 'input', 'button'].forEach(type => {
            const c = [...o.wrapper.getElementsByTagName(type)]
            if (c.length) c.forEach(ci => ci.setAttribute('of', o.id))
          })
        }
        if (o.note) {
          o.wrapper.addEventListener('mouseover', tooltip_trigger.bind(o))
          const p = 'DIV' !== o.e.tagName ? o.e : o.e.getElementsByTagName('input')[0]
          if (p) {
            p.addEventListener('focus', tooltip_trigger.bind(o))
            p.addEventListener('blur', tooltip_clear)
          }
        }
        if (patterns.number.test(o.default)) o.default = Number(o.default)
        if (o.type in elements) {
          const p = elements[o.type]
          if (p.init) p.init(o)
          o.options = [...(o.type === 'select' ? o.e.children : o.e.getElementsByTagName('input'))]
          if (p.setter) {
            o.set = p.setter.bind(o)
            o.reset = function () {
              this.set(valueOf(this.default))
            }.bind(o)
          }
          if (p.retrieve) o.get = p.retrieve.bind(o)
          if (p.adder) o.add = p.adder.bind(o)
          if (p.listener) o.listen = p.listener.bind(o)
          _u[o.id] = o
        }
      })

      // initialize variables
      if (site.variables && site.variables.length) {
        site.variables.forEach(v => {
          const k = v.id
          _u[k] = {
            id: k,
            type: 'virtual',
            source: v.default,
            previous: void 0,
            default: v.default,
            current_index: -1,
            values: [],
            states: v.states,
            update: function () {
              this.source = void 0
              for (var p, i = this.states.length; i--; ) {
                p = true
                for (let c = this.states[i].condition.length; c--; ) {
                  const r = this.states[i].condition[c]
                  if (DataHandler.prototype.checks[r.type](valueOf(r.id), valueOf(r.value))) {
                    if (r.any) {
                      p = true
                      break
                    }
                  } else p = false
                }
                if (p) {
                  this.source = this.states[i].value
                  break
                }
              }
              if (!this.source) this.source = this.default
              if (this.source !== this.previous) {
                this.previous = this.source
                request_queue(this.id)
              } else if (this.source in _u) {
                const r = _u[this.source].value()
                if (r !== this.previous) {
                  this.previous = r
                  request_queue(this.id)
                }
              }
            },
            value: function () {
              return valueOf(this.source)
            },
            set: function (v) {
              if (-1 !== this.values.indexOf(v)) {
                this.previous = this.source
                this.source = v
              } else if (this.source) {
                const c = _u[this.source]
                if ('select' === c.type ? v in c.values || v in c.display : -1 !== c.values.indexOf(v)) {
                  c.set(v)
                }
              }
              request_queue(this.id)
            },
          }
          if (_u[k].source) _u[k].values.push(_u[k].source)
          const p = {}
          _u[k].states.forEach(si => {
            _u[k].values.push(si.value)
            si.condition.forEach(c => {
              if (!(c.id in p)) {
                p[c.id] = {type: 'update', id: k}
              }
            })
          })
          Object.keys(p).forEach(k => add_dependency(k, p[k]))
        })
      }

      // initialize rules
      if (site.rules && site.rules.length) {
        site.rules.forEach((r, i) => {
          if ('display' in r.effects) {
            r.effects.display = {e: document.getElementById(r.effects.display)}
            e = r.effects.display.e.getElementsByClassName('auto-input')
            if (e.length) r.effects.display.u = _u[e[0].id]
          }
          r.condition.forEach(c => {
            if (c.type in DataHandler.prototype.checks) {
              c.check = function () {
                return DataHandler.prototype.checks[this.type](valueOf(this.id), valueOf(this.value))
              }.bind(c)
              if (c.id in _u) {
                add_dependency(c.id, {type: 'rule', id: c.id, condition: c, rule: i})
                if (!(c.id in rule_conditions)) rule_conditions[c.id] = {}
                rule_conditions[c.id][i] = r
              }
              if (c.check()) {
                Object.keys(r.effects).forEach(k => {
                  if (k in _u) _u[k].set(valueOf(r.effects[k]))
                })
              } else if (c.default) {
                Object.keys(r.effects).forEach(k => {
                  if (k in _u) _u[k].set(valueOf(c.default))
                })
              }
            }
          })
        })
      }

      keys._u = Object.keys(_u)
      window.addEventListener('resize', content_resize)

      if (!site.metadata.datasets) drop_load_screen()

      if (!site.dataviews[defaults.dataview].dataset) {
        if (1 === site.metadata.datasets.length) {
          defaults.dataset = site.metadata.datasets[0]
        } else {
          const info = site.metadata.info
          for (let i = keys._u.length; i--; ) {
            const u = _u[keys._u[i]]
            if (u.dataset in info) {
              defaults.dataset = u.dataset
              break
            } else if (u.default in info) {
              defaults.dataset = u.default
              break
            } else if ('select' === u.type && u.options[u.default] && u.options[u.default].value in info) {
              defaults.dataset = u.options[u.default].value
              break
            } else if (Array.isArray(u.values) && u.values[u.default] && u.values[u.default] in info) {
              defaults.dataset = u.values[u.default]
              break
            }
          }
          if (!defaults.dataset) defaults.dataset = site.metadata.datasets[site.metadata.datasets.length - 1]
        }
        keys._u.forEach(k => {
          const u = _u[k]
          if (!u.dataset) u.dataset = defaults.dataset
        })
        site.dataviews[defaults.dataview].dataset = defaults.dataset
      }
      if ('undefined' !== typeof DataHandler) {
        defaults.dataset = valueOf(site.dataviews[defaults.dataview].dataset)
        site.data = new DataHandler(site, defaults, site.data, {
          init: init,
          onload: function () {
            setTimeout(drop_load_screen, 150)
            delete this.onload
          },
          data_load: function () {
            Object.keys(_c).forEach(request_queue)
          },
        })
        site.data.retrievers.vector = site.data.retrievers.vector.bind(site.data)
        if (site.query) site.parsed_query = site.data.parse_query(site.query)
      }

      if (page.load_screen && site.data.inited) {
        site.data.inited.load_screen = setTimeout(drop_load_screen, 3000)
      } else {
        page.wrap.style.visibility = 'visible'
      }
    }

    function drop_load_screen() {
      if (site.data.inited) clearTimeout(site.data.inited.load_screen)
      page.wrap.style.visibility = 'visible'
      page.load_screen.style.display = 'none'
    }

    function content_resize() {
      page.content.style.top =
        (page.top_menu && 'open' === page.top_menu.state
          ? page.top_menu.getBoundingClientRect().height
          : page.content_bounds.top +
            ((!page.top_menu && !page.left_menu && !page.right_menu) ||
            (page.right_menu && 'open' === page.right_menu.state) ||
            (page.left_menu && 'open' === page.left_menu.state)
              ? 0
              : 40)) + 'px'
      page.content.style.right =
        page.content_bounds.right +
        (!page.right_menu || 'closed' === page.right_menu.state ? 0 : page.right_menu.getBoundingClientRect().width) +
        'px'
      page.content.style.bottom =
        page.content_bounds.bottom +
        (!page.bottom_menu || 'closed' === page.bottom_menu.state
          ? 0
          : page.bottom_menu.getBoundingClientRect().height) +
        'px'
      page.content.style.left =
        page.content_bounds.left +
        (!page.left_menu || 'closed' === page.left_menu.state ? 0 : page.left_menu.getBoundingClientRect().width) +
        'px'
    }

    function trigger_resize() {
      'undefined' === typeof module && window.dispatchEvent(new Event('resize'))
    }

    function get_options_url() {
      var s = ''
      keys._u.forEach(k => {
        if (_u[k].input && !patterns.settings.test(k)) {
          const v = _u[k].value()
          if ('' !== v && null != v && '-1' != v) s += (s ? '&' : '?') + k + '=' + v
        }
      })
      return window.location.protocol + '//' + window.location.host + window.location.pathname + s
    }

    function init() {
      // initialize inputs
      keys._u.forEach(async k => {
        if (_u[k].type in elements) {
          const o = _u[k]
          if ('select' === o.type) {
            // resolve options
            if (o.options_source) {
              if (patterns.palette.test(o.options_source)) {
                Object.keys(palettes).forEach(v => o.e.appendChild(o.add(v, palettes[v].name)))
                o.options = o.e.getElementsByTagName('option')
                if (-1 === o.default) o.default = defaults.palette
              } else if (patterns.datasets.test(o.options_source)) {
                site.metadata.datasets.forEach(d => o.e.appendChild(o.add(i, d, site.data.format_label(d))))
                o.options = o.e.getElementsByTagName('option')
              } else {
                o.sensitive = false
                o.option_sets = {
                  values: {},
                  displays: {},
                  options: [],
                }
                if (o.depends) add_dependency(o.depends, {type: 'options', id: o.id})
                if (o.dataset in _u) add_dependency(o.dataset, {type: 'options', id: o.id})
                if (o.view) add_dependency(o.view, {type: 'options', id: o.id})
                const v = valueOf(o.dataset) || defaults.dataset
                if (v in site.metadata.info) {
                  if (!o.dataset) o.dataset = v
                  conditionals.options(o)
                }
              }
            }
            if (Array.isArray(o.values)) {
              o.values = {}
              o.display = {}
              o.options = [...o.options]
              o.options.forEach((e, i) => {
                o.values[e.value] = i
                o.display[e.value] = i
              })
              if (!(o.default in o.values) && !(o.default in _u)) {
                o.default = Number(o.default)
                if (isNaN(o.default)) o.default = -1
              }
              o.source = ''
              o.id in site.url_options ? o.set(site.url_options[o.id]) : o.reset()
            }
            o.subset = o.e.getAttribute('subset') || 'all'
            if (o.type in site && o.id in site[o.type]) {
              o.settings = site[o.type][o.id]
              if (o.settings.filters) {
                o.filters = o.settings.filters
                o.current_filter = {}
                Object.keys(o.filters).forEach(f => {
                  add_dependency(o.filters[f], {type: 'filter', id: o.id})
                })
                o.filter = function () {
                  Object.keys(this.filters).forEach(f => {
                    this.current_filter[f] = valueOf(this.filters[f])
                  })
                  var first
                  Object.keys(this.values).forEach((v, i) => {
                    var pass = false
                    if (v in site.data.variables && 'meta' in site.data.variables[v]) {
                      for (const k in this.current_filter)
                        if (k in site.data.variables[v].meta) {
                          pass = site.data.variables[v].meta[k] === this.current_filter[k]
                          if (!pass) break
                        }
                    }
                    if (pass && !first) first = v
                    this.options[i].classList[pass ? 'remove' : 'add']('hidden')
                  })
                  this.current_index = this.values[this.value()]
                  if (
                    first &&
                    (-1 === this.current_index || this.options[this.current_index].classList.contains('hidden'))
                  ) {
                    this.set(first)
                  }
                }.bind(o)
              }
            }
          } else if ('number' === o.type) {
            // retrieve option values
            o.min = o.e.getAttribute('min')
            o.min_ref = parseFloat(o.min)
            o.max = o.e.getAttribute('max')
            o.max_ref = parseFloat(o.max)
            o.ref = isNaN(o.min_ref) || isNaN(o.max_ref)
            o.range = [o.min_ref, o.max_ref]
            o.step = parseFloat(o.e.step) || 1
            o.parsed = {min: undefined, max: undefined}
            o.depends = {}
            o.update = async function () {
              const view = _u[this.view],
                variable = valueOf(o.variable || view.y)
              if (!view.time_range) view.time_range = {time: []}
              var d = view.get ? view.get.dataset() : valueOf(this.dataset),
                min = valueOf(this.min) || view.time,
                max = valueOf(this.max) || view.time
              if (patterns.minmax.test(min)) min = _u[this.min][min]
              if (patterns.minmax.test(max)) max = _u[this.max][max]
              this.parsed.min = isNaN(this.min_ref)
                ? 'undefined' === typeof min
                  ? view.time_range.time[0]
                  : 'number' === typeof min
                  ? min
                  : min in site.data.variables
                  ? site.data.variables[min].info[d || site.data.variables[min].datasets[0]].min
                  : parseFloat(min)
                : this.min_ref
              this.parsed.max = isNaN(this.max_ref)
                ? 'undefined' === typeof max
                  ? view.time_range.time[1]
                  : 'number' === typeof max
                  ? max
                  : max in site.data.variables
                  ? site.data.variables[max].info[d || site.data.variables[max].datasets[0]].max
                  : parseFloat(max)
                : this.min_ref
              if (this.ref && variable in site.data.variables) {
                this.range[0] = this.e.min = isNaN(this.min_ref)
                  ? Math.max(view.time_range.time[0], this.parsed.min)
                  : this.min_ref
                this.range[1] = this.e.max = isNaN(this.max_ref)
                  ? Math.min(view.time_range.time[1], this.parsed.max)
                  : this.max_ref
                if (!this.depends[view.y]) {
                  this.depends[view.y] = true
                  add_dependency(view.y, {type: 'update', id: this.id})
                }
                if (variable !== this.variable) this.reset()
                this.variable = await get_variable(variable, this.view)
              } else {
                this.e.min = this.parsed.min
                if (this.parsed.min > this.source || (!this.source && 'min' === this.default)) this.set(this.parsed.min)
                this.e.max = this.parsed.max
                if (this.parsed.max < this.source || (!this.source && 'max' === this.default)) this.set(this.parsed.max)
              }
            }.bind(o)
            if (o.view) add_dependency(o.view, {type: 'update', id: o.id})
            if (!(o.max in site.data.variables)) {
              if (o.max in _u) {
                add_dependency(o.max, {type: 'max', id: o.id})
              } else o.e.max = parseFloat(o.max)
            } else if (o.view) {
              add_dependency(o.view + '_time', {type: 'max', id: o.id})
            }
            if (!(o.min in site.data.variables)) {
              if (o.min in _u) {
                add_dependency(o.min, {type: 'min', id: o.id})
              } else o.e.min = parseFloat(o.min)
            } else if (o.view) {
              add_dependency(o.view + '_time', {type: 'min', id: o.id})
            }
            if ('undefined' !== typeof o.default) {
              if (patterns.number.test(o.default)) {
                o.default = Number(o.default)
              } else
                o.reset =
                  'max' === o.default || 'last' === o.default
                    ? function () {
                        if (this.range) this.set(valueOf(this.range[1]))
                      }.bind(o)
                    : 'min' === o.default || 'first' === o.default
                    ? function () {
                        if (this.range) this.set(valueOf(this.range[0]))
                      }.bind(o)
                    : this.default in _u
                    ? function () {
                        this.set(valueOf(this.default))
                      }.bind(o)
                    : function () {}
            }
            if (o.variable) {
              const d = -1 === site.metadata.datasets.indexOf(o.dataset) ? defaults.dataset : o.dataset
              if (o.variable in _u) {
                add_dependency(o.variable, {type: 'update', id: o.id})
              } else if (o.variable in site.data.variables) {
                o.e.min = o.min = o.parsed.min = o.range[0] = site.data.variables[o.variable].info[d].min
                o.e.max = o.max = o.parsed.max = o.range[1] = site.data.variables[o.variable].info[d].max
              }
            }
          } else if ('checkbox' === o.type) {
            o.source = []
            o.current_index = []
            o.default = o.default.split(',')
          }
          if (Array.isArray(o.values)) {
            if (!o.values.length) o.values = o.options.map(o => o.value)
            if (o.values.length && !(o.default in _u) && -1 === o.values.indexOf(o.default)) {
              o.default = parseInt(o.default)
              o.default = o.values.length > o.default ? o.values[o.default] : ''
            }
          }

          // add listeners
          if ('select' === o.type || 'number' === o.type) {
            o.e.addEventListener('change', o.listen)
            if (
              o.e.parentElement.lastElementChild &&
              o.e.parentElement.lastElementChild.classList.contains('select-reset')
            ) {
              o.e.parentElement.lastElementChild.addEventListener('click', o.reset)
            }
          } else if ('switch' === o.type) {
            if ('boolean' !== typeof o.default) o.default = o.e.checked
            o.e.addEventListener('change', o.listen)
          } else {
            o.options.forEach(oi => oi.addEventListener('click', o.listen))
          }
          // initialize settings inputs
          if (patterns.settings.test(o.id)) {
            o.setting = o.id.replace(patterns.settings, '')
            if (null == o.default && o.setting in site.settings) o.default = site.settings[o.setting]
            add_dependency(o.id, {type: 'setting', id: o.id})
          }
          if (!o.view) o.view = defaults.dataview
          const v = site.url_options[o.id] || storage.get(o.id.replace(patterns.settings, ''))
          if (v) {
            o.set(patterns.bool.test(v) ? !!v || 'true' === v : v)
          } else o.reset && o.reset()
        }
      })
      // initialize dataviews
      Object.keys(site.dataviews).forEach(k => {
        const e = site.dataviews[k]
        _u[k] = e
        e.id = k
        e.value = function () {
          if (this.get) {
            this.reparse()
            return (
              '' +
              this.parsed.dataset +
              this.parsed.ids +
              this.parsed.features +
              this.parsed.variables +
              site.settings.summary_selection
            )
          }
        }.bind(e)
        if ('string' === typeof e.palette && e.palette in _u) {
          add_dependency(e.palette, {type: 'dataview', id: k})
        }
        if ('string' === typeof e.dataset && e.dataset in _u) {
          add_dependency(e.dataset, {type: 'dataview', id: k})
        }
        if ('string' === typeof e.ids && e.ids in _u) {
          add_dependency(e.ids, {type: 'dataview', id: k})
        }
        e.time_range = {dataset: '', variable: '', index: [], time: [], filtered: []}
        add_dependency(k, {type: 'time_range', id: k})
        if (e.x in _u) {
          add_dependency(e.x, {type: 'time_range', id: k})
        }
        if (e.y in _u) {
          add_dependency(e.y, {type: 'time_range', id: k})
        }
        if (e.features)
          Object.keys(e.features).forEach(f => {
            if ('string' === typeof e.features[f] && e.features[f] in _u) {
              add_dependency(e.features[f], {type: 'dataview', id: k})
            }
          })
        if (e.variables)
          e.variables.forEach(v => {
            if ('variable' in v) {
              if (v.variable in _u) {
                add_dependency(v.variable, {type: 'dataview', id: k})
              }
            } else e.variables.splice(i, 1)
            if ('type' in v) {
              if (v.type in _u) {
                add_dependency(v.type, {type: 'dataview', id: k})
              }
            } else v.type = '='
            if ('value' in v) {
              if (v.value in _u) {
                add_dependency(v.value, {type: 'dataview', id: k})
              }
            } else v.value = 0
          })
        compile_dataview(e)
        conditionals.dataview(e)
        e.reparse()
      })
      // initialize outputs
      ;[...document.getElementsByClassName('auto-output')].forEach((e, i) => {
        const o = {
          type: e.getAttribute('auto-type'),
          view: e.getAttribute('data-view') || defaults.dataview,
          id: e.id || 'out' + i,
          note: e.getAttribute('aria-description') || '',
          reference_options: {},
          e: e,
        }
        if (o.note) o.e.addEventListener('mouseover', tooltip_trigger.bind(o))
        o.options = o.type in site ? site[o.type][o.id] : void 0
        if (o.type in elements && 'update' in elements[o.type]) o.update = elements[o.type].update.bind(o)
        if (o.options) {
          if ('options' in o.options) o.options = o.options.options
          Object.keys(o.options).forEach(k => {
            if (o.options[k] in _u) o.reference_options[k] = o.options[k]
          })
          if ('subto' in o.options) {
            if ('string' === typeof o.options.subto) o.options.subto = [o.options.subto]
            if (Array.isArray(o.options.subto)) o.options.subto.forEach(v => add_subs(v, o))
          }
        }
        _u[o.id] = o
        if (o.view) {
          if (!(o.view in _c)) _c[o.view] = []
          if (!(o.view + '_filter' in _c)) _c[o.view + '_filter'] = []
        }
        if (o.type in elements && 'init' in elements[o.type]) {
          if (!o.view || _u[o.view].parsed.dataset in site.data.inited) {
            elements[o.type].init(o)
          } else {
            site.data.data_queue[_u[o.view].parsed.dataset][o.id] = elements[o.type].init.bind(null, o)
            if (site.data.loaded[_u[o.view].parsed.dataset]) site.data.load_id_maps()
          }
        }
      })

      // make filter popup
      e = page.modal.filter

      e.body.appendChild((e.variable_filters = document.createElement('div')))
      e.variable_filters.appendChild(document.createElement('p'))
      e.variable_filters.lastElementChild.className = 'h6 text-muted'
      e.variable_filters.lastElementChild.innerText = 'Variable Conditions'

      function add_filter_condition(event) {
        if ('A' === event.target.tagName) {
          if (!site.data.filter) site.data.filter = new Map()
          const e = document.createElement('div'),
            f = {
              e,
              index: site.data.filter.size,
              variable: event.target.value,
              component: 'selected',
              operator: '>=',
              value: '',
            }
          e.setAttribute('index', site.data.filter.size)
          site.data.filter.set(site.data.filter.size, f)
          e.className = 'row'
          e.appendChild(document.createElement('div'))
          e.lastElementChild.className = 'col'
          var ee
          e.lastElementChild.appendChild((ee = document.createElement('p')))
          ee.className = 'cell-text'
          ee.innerText = event.target.innerText

          e.appendChild(document.createElement('div'))
          e.lastElementChild.style.maxWidth = '140px'
          e.lastElementChild.className = 'col'
          e.lastElementChild.appendChild((ee = document.createElement('select')))
          ee.className = 'form-select'
          ee.default = '0'
          ee.addEventListener('change', e => {
            f.component = e.target.selectedOptions[0].value
            conditionals.dataview()
          })
          ;['selected'].forEach(k => {
            ee.appendChild(document.createElement('option'))
            ee.lastElementChild.component = ee.lastElementChild.innerText = k
            conditionals.dataview()
          })

          e.appendChild(document.createElement('div'))
          e.lastElementChild.style.maxWidth = '95px'
          e.lastElementChild.className = 'col'
          e.lastElementChild.appendChild((ee = document.createElement('select')))
          ee.className = 'form-select'
          ee.default = '0'
          ee.addEventListener('change', e => {
            f.operator = e.target.selectedOptions[0].value
            conditionals.dataview()
          })
          ;['>=', '<='].forEach(k => {
            ee.appendChild(document.createElement('option'))
            ee.lastElementChild.value = ee.lastElementChild.innerText = k
            conditionals.dataview()
          })

          e.appendChild(document.createElement('div'))
          e.lastElementChild.className = 'col-2'
          e.lastElementChild.appendChild((ee = document.createElement('input')))
          ee.className = 'form-control'
          ee.type = 'number'
          ee.addEventListener('change', e => {
            f.value = e.target.value
            conditionals.dataview()
          })

          e.appendChild(document.createElement('div'))
          e.lastElementChild.style.maxWidth = '36px'
          e.lastElementChild.className = 'col'
          e.lastElementChild.appendChild((ee = document.createElement('button')))
          ee.className = 'btn btn-close'
          ee.type = 'button'
          ee.addEventListener(
            'click',
            function () {
              this.e.parentElement.removeChild(this.e)
              site.data.filter.delete(this.index)
              conditionals.dataview()
            }.bind(f)
          )

          page.modal.filter.variable_filters.lastElementChild.appendChild(e)
        }
      }

      e.variable_filters.appendChild((ee = document.createElement('div')))
      ee.className = 'row'

      ee.appendChild(document.createElement('div'))
      ee.lastElementChild.className = 'col'
      ee.lastElementChild.appendChild((c = document.createElement('div')))
      c.className = 'dropdown'
      c.appendChild(document.createElement('button'))
      c.lastElementChild.type = 'button'
      c.lastElementChild.id = 'filter_variable_dropdown'
      c.lastElementChild.className = 'btn dropdown-toggle'
      c.lastElementChild.setAttribute('data-bs-toggle', 'dropdown')
      c.lastElementChild.setAttribute('aria-expanded', false)
      c.lastElementChild.innerText = 'Add Variable Condition'
      c.appendChild(document.createElement('ul'))
      c.lastElementChild.addEventListener('click', add_filter_condition.bind(e))
      c.lastElementChild.className = 'dropdown-menu'
      c.lastElementChild.setAttribute('aria-labelledby', 'filter_variable_dropdown')
      Object.keys(site.data.variables).forEach(k => {
        if ('time' !== k) {
          const e = document.createElement('li')
          e.appendChild(document.createElement('a'))
          e.lastElementChild.className = 'dropdown-item'
          e.lastElementChild.href = '#'
          e.lastElementChild.value = k
          e.lastElementChild.innerText = (site.data.variable_info[k] && site.data.variable_info[k].short_name) || k
          c.lastElementChild.appendChild(e)
        }
      })

      // ee.appendChild(document.createElement('div'))
      // ee.lastElementChild.className = 'col'
      // ee.lastElementChild.appendChild((c = document.createElement('div')))
      // c.className = 'dropdown'
      // c.appendChild(document.createElement('button'))
      // c.lastElementChild.type = 'button'
      // c.lastElementChild.id = 'filter_feature_dropdown'
      // c.lastElementChild.className = 'btn dropdown-toggle'
      // c.lastElementChild.setAttribute('data-bs-toggle', 'dropdown')
      // c.lastElementChild.setAttribute('aria-expanded', false)
      // c.lastElementChild.innerText = 'Add Feature Condition'
      // c.appendChild(document.createElement('ul'))
      // c.lastElementChild.addEventListener('click', add_filter_condition.bind(e))
      // c.lastElementChild.className = 'dropdown-menu'
      // c.lastElementChild.setAttribute('aria-labelledby', 'filter_feature_dropdown')
      // Object.keys(site.data.features).forEach(k => {
      //   const e = document.createElement('li')
      //   e.appendChild(document.createElement('a'))
      //   e.lastElementChild.className = 'dropdown-item'
      //   e.lastElementChild.href = '#'
      //   e.lastElementChild.innerText = k
      //   c.lastElementChild.appendChild(e)
      // })

      e.variable_filters.appendChild(document.createElement('div'))
      e.variable_filters.lastElementChild.className = 'row'

      keys._u = Object.keys(_u)
    }

    function valueOf(v) {
      if (v in _u) v = _u[v]
      if (v && v.value) v = valueOf(v.value())
      return v
    }

    function tooltip_trigger() {
      if (site.settings.hide_tooltips || this.id === page.tooltip.showing) return void 0
      page.tooltip.showing = this.id
      page.tooltip.e.firstElementChild.innerText = this.note
      page.tooltip.e.classList.remove('hidden')
      const s = page.wrap.getBoundingClientRect(),
        p = this.wrapper.getBoundingClientRect(),
        t = page.tooltip.e.getBoundingClientRect()
      page.tooltip.e.style.left = Math.max(0, Math.min(p.x, p.x + p.width / 2 - t.width / 2)) + 'px'
      page.tooltip.e.style.top = p.y + (p.y < s.height / 2 ? p.height + 5 : -t.height - 5) + 'px'
    }

    function tooltip_clear(e) {
      if (
        page.tooltip.showing &&
        ('blur' === e.type || page.tooltip.showing !== (e.target.getAttribute('of') || e.target.id))
      ) {
        page.tooltip.showing = ''
        page.tooltip.e.classList.add('hidden')
      }
    }

    async function retrieve_layer(u, source, callback) {
      if (source.url in site.map._raw) {
        process_layer(source, u)
        site.map._queue[source.name + (source.time ? source.time : '')].retrieved = true
        callback && callback()
      } else {
        const f = new window.XMLHttpRequest()
        f.onreadystatechange = () => {
          if (4 === f.readyState && 200 === f.status) {
            site.map._raw[source.url] = f.responseText
            if (source.name) {
              site.map._queue[source.name + (source.time || '')].retrieved = true
            }
            callback && callback()
          }
        }
        f.open('GET', source.url, true)
        f.send()
      }
    }

    function process_layer(source, u) {
      var p, id
      const has_time = 'time' in source,
        layerId = source.name + (has_time ? source.time : '')
      site.map[u.id]._layers[layerId] = L.geoJSON(JSON.parse(site.map._raw[source.url]), {
        onEachFeature: (f, l) => {
          l.on({
            mouseover: elements.map.mouseover.bind(u),
            mouseout: elements.map.mouseout.bind(u),
            click: elements.map.click.bind(u),
          })
          l.setStyle({weight: 0, fillOpacity: 0})
          l.source = source
          p = l.feature.properties
          id = p[source.id_property]
          if (!(id in site.data.entities) && patterns.leading_zeros.test(id))
            id = p[source.id_property] = id.replace(patterns.leading_zeros, '')
          if (id in site.data.entities) {
            if (!('layer' in site.data.entities[id])) site.data.entities[id].layer = {}
          } else {
            site.data.entities[id] = {layer: {}, features: {id: id}}
          }
          if (has_time) {
            if (!(u.id in site.data.entities[id].layer)) site.data.entities[id].layer[u.id] = {has_time: true}
            site.data.entities[id].layer[u.id][source.time] = l
          } else site.data.entities[id].layer[u.id] = l
          l.entity = site.data.entities[id]
          if (site.data.entities[id].features)
            Object.keys(p).forEach(f => {
              if (!(f in site.data.entities[id].features)) {
                if (
                  'name' === f.toLowerCase() &&
                  (!('name' in site.data.entities[id].features) ||
                    site.data.entities[id].features.id === site.data.entities[id].features.name)
                ) {
                  site.data.entities[id].features[f.toLowerCase()] = p[f]
                } else {
                  site.data.entities[id].features[f] = p[f]
                }
              }
            })
        },
      })
      site.data.inited[layerId + u.id] = true
      if (site.map._waiting && site.map._waiting[source.name]) {
        for (let i = site.map._waiting[source.name].length; i--; ) {
          request_queue(site.map._waiting[source.name][i])
        }
      }
    }

    function show_overlay(u, o, time) {
      var i = 0,
        source = 'string' === typeof o.source ? o.source : ''
      if (!source && o.source) {
        for (i = o.source.length; i--; ) {
          if (time === o.source[i].time) {
            if (o.source[i].name) delete o.source[i].name
            source = o.source[i].url
            break
          }
        }
      }
      if (source) {
        if (source in site.map._raw) {
          if (!(source in site.map[u.id]._layers)) {
            site.map[u.id]._layers[source] = L.geoJSON(JSON.parse(site.map._raw[source]), {
              pointToLayer: (point, coords) => {
                return L.circleMarker(coords)
              },
              onEachFeature: (feature, layer) => {
                const e = document.createElement('table')
                Object.keys(feature.properties).forEach(f => {
                  const r = document.createElement('tr')
                  r.appendChild(document.createElement('td'))
                  r.appendChild(document.createElement('td'))
                  r.firstElementChild.innerText = f
                  r.lastElementChild.innerText = feature.properties[f]
                  e.appendChild(r)
                })
                layer.bindTooltip(e)
              },
            })
          }
          u.overlay.clearLayers()
          var n = 0
          site.map[u.id]._layers[source].eachLayer(l => {
            if (o.filter) {
              for (let i = o.filter.length; i--; ) {
                if (!o.filter[i].check(l.feature.properties[o.filter[i].feature], o.filter[i].value)) return
              }
            }
            n++
            l.setRadius(site.settings.circle_radius).setStyle({
              weight: site.settings.polygon_outline,
              color: 'white',
              opacity: 0.5,
              fillOpacity: 0.5,
              fillColor: 'black',
            })
            l.addTo(u.overlay)
          })
          if (n) u.overlay_control.addTo(u.map)
        } else return retrieve_layer(u, o.source[i], show_overlay.bind(null, u, o, time))
      }
    }

    function compile_dataview(v) {
      v.times = []
      if (v.time_filters) {
        v.time_filters = [
          {variable: defaults.time, type: '>=', value: 'filter.time_min'},
          {variable: defaults.time, type: '<=', value: 'filter.time_max'},
        ]
        add_dependency(v.id + '_time', {type: 'min', id: 'filter.time_min'})
        add_dependency(v.id + '_time', {type: 'max', id: 'filter.time_max'})
        v.time_filters.forEach(f => {
          if (f.value in _u) {
            add_dependency(f.value, {type: 'time_filters', id: v.id})
          }
        })
      }
      v.selection = {ids: {}, features: {}, variables: [], dataset: {}, filtered: {}, all: {}}
      v.n_selected = {ids: 0, features: 0, variables: 0, dataset: 0, filtered: 0, all: 0}
      v.get = {
        dataset: function () {
          return (
            valueOf('string' === typeof v.dataset && v.dataset in _u ? _u[v.dataset].value() : v.dataset) ||
            defaults.dataset
          )
        },
        ids: function () {
          return valueOf('string' === typeof v.ids && v.ids in _u ? _u[v.ids].value() : v.ids)
        },
        features: function () {
          var s = ''
          v.features &&
            Object.keys(v.features).forEach(k => {
              s += k + valueOf(v.features[k])
            })
          return s
        },
        variables: function () {
          if (v.variables || (site.data.filter && site.data.filter.size)) {
            if (!v.parsed.variable_values.length) v.reparse()
            var s = ''
            v.parsed.variable_values.forEach(vi => {
              s += vi.name + vi.operator + vi.value
            })
            return s
          } else return ''
        },
        time_filters: function () {
          var s = ''
          v.time_filters &&
            v.time_filters.forEach(f => {
              s += f.value in _u ? valueOf(f.value) : f.value
            })
          return s
        },
      }
      v.ids_check =
        'object' === typeof v.get.ids()
          ? DataHandler.prototype.checks.includes
          : function (a, b) {
              return !a || -1 == a || a === b || (b && a.length > 2 && a === String(b).substring(0, a.length))
            }
      v.parsed = {
        dataset: '',
        ids: '',
        features: '',
        variables: '',
        time_filters: '',
        time_agg: 0,
        id_source: '',
        variable_values: [],
        feature_values: {},
      }
      v.reparse = function () {
        this.parsed.dataset = this.get.dataset()
        this.parsed.ids = this.get.ids()
        this.parsed.time_filters = this.get.time_filters()
        this.parsed.time_agg =
          this.parsed.dataset in site.data.meta.times
            ? valueOf(this.time_agg) - site.data.meta.times[this.parsed.dataset].range[0]
            : 0
        if (
          'string' === typeof this.ids &&
          this.ids in _u &&
          (('virtual' === _u[this.ids].type && _u[this.ids].source in _u) ||
            ('depends' in _u[this.ids] && _u[this.ids].depends in _u))
        ) {
          this.parsed.id_source =
            'virtual' === _u[this.ids].type
              ? valueOf(_u[_u[this.ids].source].dataset)
              : _u[_u[this.ids].depends].value()
        }
        if (this.features) {
          this.parsed.feature_values = {}
          for (var k in this.features)
            if (k in this.features) {
              this.parsed.feature_values[k] = {value: valueOf(this.features[k])}
              this.parsed.feature_values[k].operator =
                'string' === typeof this.parsed.feature_values[k].value ? 'equals' : 'includes'
            }
          this.parsed.features = this.get.features()
        } else this.parsed.features = ''
        this.parsed.variable_values = []
        if (site.data.filter && site.data.filter.size)
          site.data.filter.forEach(f => {
            const v = Number(f.value)
            if (!isNaN(v))
              this.parsed.variable_values.push({
                name: f.variable,
                operator: f.operator,
                value: v,
                value_type: 'number',
              })
          })
        if (this.variables || this.parsed.variable_values.length) {
          if (this.variables)
            for (var i = this.variables.length, v; i--; ) {
              v = valueOf(this.variables[i].value)
              this.parsed.variable_values.push({
                name: valueOf(this.variables[i].variable),
                operator: valueOf(this.variables[i].type),
                value: v,
                value_type: typeof v,
              })
            }
          this.parsed.variables = this.get.variables()
        } else this.parsed.variables = ''
      }.bind(v)
      v.checks = {
        dataset: function (e) {
          return this.parsed.dataset === e.group
        }.bind(v),
        ids: ('string' === typeof v.ids &&
        v.ids in _u &&
        (('virtual' === _u[v.ids].type && _u[v.ids].source in _u) ||
          ('depends' in _u[v.ids] && _u[v.ids].depends in _u))
          ? 'virtual' === _u[v.ids].type
            ? function (e) {
                return (
                  e.features &&
                  this.ids_check(
                    this.parsed.ids,
                    e.features[
                      !this.parsed.id_source ||
                      e.group === this.parsed.id_source ||
                      !(this.parsed.id_source in e.features)
                        ? 'id'
                        : this.parsed.id_source
                    ]
                  )
                )
              }
            : function (e) {
                return (
                  e.features &&
                  this.ids_check(
                    this.parsed.ids,
                    this.parsed.id_source in e.features ? valueOf(e.features[this.parsed.id_source]) : e.features.id
                  )
                )
              }
          : function (e) {
              return e.features && this.ids_check(this.parsed.ids, e.features.id)
            }
        ).bind(v),
        features: function (e) {
          if (e.features) {
            var k,
              v,
              pass = true
            for (k in this.parsed.feature_values) {
              if (k in this.parsed.feature_values) {
                v = this.parsed.feature_values[k]
                pass = DataHandler.prototype.checks[v.operator](v.value, valueOf(e.features[k]))
                if (!pass) break
              }
            }
            return pass
          } else return true
        }.bind(v),
        variables: function (e) {
          if (e.data) {
            var pass
            for (let i = this.parsed.variable_values.length; i--; ) {
              const v = this.parsed.variable_values[i],
                ev = e.get_value(
                  v.name,
                  this.parsed.time_agg - site.data.variables[v.name].info[this.parsed.dataset].time_range[0]
                )
              pass = isNaN(ev) || DataHandler.prototype.checks[v.operator](ev, v.value)
              if (!pass) break
            }
            return pass
          } else return true
        }.bind(v),
      }
      v.check = function (e) {
        return {
          ids: !this.ids || this.checks.ids(e),
          features: !this.features || this.checks.features(e),
          variables: (!this.variables && (!site.data.filter || !site.data.filter.size)) || this.checks.variables(e),
          dataset: !this.dataset || this.checks.dataset(e),
        }
      }.bind(v)
    }

    function clear_storage() {
      if (window.localStorage) storage.perm.removeItem(storage.name)
      window.location.reload()
    }

    async function get_variable(variable, view) {
      if (variable in site.data.variables) await site.data.calculate_summary(variable, view, true)
      return site.data.variables[variable]
    }

    function global_update() {
      meta.retain_state = false
      keys._u.forEach(request_queue)
    }

    function global_reset() {
      meta.retain_state = false
      keys._u.forEach(k => {
        if (!_u[k].setting && _u[k].reset) {
          _u[k].reset()
          request_queue(k)
        }
      })
    }

    function request_queue(id) {
      queue[id] = true
      clearTimeout(queue._timeout)
      queue._timeout = setTimeout(run_queue, 20)
      meta.lock_after = id
    }

    function run_queue() {
      clearTimeout(queue._timeout)
      keys._u.forEach(k => {
        if (queue[k]) {
          const d = refresh_conditions(k)
          if (d) {
            site.data.data_queue[d][k] = run_queue
            if (site.data.loaded[d]) site.data.load_id_maps()
            return false
          }
          queue[k] = false
        }
      })
      const k = get_options_url()
      if (site.data.inited.first && k !== site.state) {
        site.state = k
        Object.keys(site.url_options).forEach(s => {
          if (patterns.embed_setting.test(s))
            k +=
              '&' +
              s +
              '=' +
              ('navcolor' === s ? site.url_options[s].replace(patterns.hashes, '%23') : site.url_options[s])
        })
        if (!site.settings.hide_url_parameters) {
          window.history.replaceState(Date.now(), '', k)
        }
        setTimeout(content_resize, 50)
      }
    }

    function refresh_conditions(id) {
      if (id in _c) {
        const c = _u[id],
          d = _c[id],
          r = [],
          v = c && c.value() + '',
          dd = (c && c.dataset && valueOf(c.dataset)) || v
        if (c && (!meta.retain_state || c.state !== v)) {
          if (dd in site.metadata.info && !site.data.loaded[dd]) {
            site.data.retrieve(dd, site.metadata.info[dd].site_file)
            return dd
          }
          c.state = v
          d.forEach(di => {
            if ('rule' === di.type) {
              if (-1 === r.indexOf(di.rule)) {
                r.push(site.rules[di.rule])
              }
            } else {
              if ('function' === typeof _u[di.id][di.type]) {
                _u[di.id][di.type]()
              } else {
                conditionals[di.type](_u[di.id], c)
              }
            }
          })
          r.forEach(ri => {
            var pass = false
            const n = ri.condition.length
            for (let i = 0; i < n; i++) {
              const ck = ri.condition[i]
              pass = ck.check()
              if (ck.any ? pass : !pass) break
            }
            Object.keys(ri.effects).forEach(k => {
              const e = ri.effects[k]
              if (pass) {
                if (k === 'display') {
                  e.e.classList.remove('hidden')
                } else if (k in _u) {
                  _u[k].set(valueOf(e))
                }
              } else if (k === 'display') {
                e.e.classList.add('hidden')
                if (e.u) e.u.reset()
                ;[...e.e.getElementsByClassName('auto-input')].forEach(c => {
                  if (c.id in _u) _u[c.id].reset()
                })
              } else if ('default' in ri) {
                if (k in _u) {
                  _u[k].set(valueOf(ri.default))
                }
              }
            })
          })
          if (id === meta.lock_after) meta.retain_state = true
        }
      }
    }

    function queue_init_plotly() {
      const showing = this.deferred || !this.tab || this.tab.classList.contains('show')
      if (showing && window.Plotly) {
        Plotly.newPlot(this.e, this.options)
        this.e
          .on('plotly_hover', elements.plotly.mouseover.bind(this))
          .on('plotly_unhover', elements.plotly.mouseout.bind(this))
          .on('plotly_click', elements.plotly.click.bind(this))
        update_plot_theme(this)
        this.update()
      } else {
        this.deferred = true
        setTimeout(queue_init_plotly.bind(this), showing ? 0 : 2000)
      }
    }

    function queue_init_map() {
      const theme = site.settings.theme_dark ? 'dark' : 'light',
        showing = this.deferred || !this.tab || this.tab.classList.contains('show')
      if (showing && window.L) {
        this.map = L.map(this.e, this.options)
        this.options = this.map.options
        this.overlay = L.featureGroup().addTo(this.map)
        this.displaying = L.featureGroup().addTo(this.map)
        this.overlay_control = L.control
          .layers()
          .setPosition('topleft')
          .addOverlay(this.overlay, 'Overlay')
          .addTo(this.map)
        this.tiles = {}
        if (this.id in site.map) {
          const tiles = site.map[this.id].tiles
          site.map[this.id].u = this
          if (tiles) {
            if (tiles.url) {
              this.tiles[theme] = L.tileLayer(tiles.url, tiles.options)
              this.tiles[theme].addTo(this.map)
            } else {
              Object.keys(tiles).forEach(k => {
                this.tiles[k] = L.tileLayer(tiles[k].url, tiles[k].options)
                if (theme === k) this.tiles[k].addTo(this.map)
              })
            }
          }
          if (!('_raw' in site.map)) site.map._raw = {}
          if (!('_queue' in site.map)) site.map._queue = {}
          if (!('_layers' in site.map[this.id])) site.map[this.id]._layers = {}
          site.map[this.id].shapes.forEach((shape, i) => {
            const has_time = 'time' in shape
            if (!site.map[this.id].has_time && has_time) {
              site.map[this.id].has_time = true
              add_dependency(this.view, {type: 'update', id: this.id})
              site.map[this.id].match_time =
                'exact' === shape.resolution
                  ? time => {
                      return time + ''
                    }
                  : time => {
                      return Number(time) > 2019 ? '2020' : '2010'
                    }
            }
            var k = shape.name
            if (!k) shape.name = k = site.metadata.datasets[i < site.metadata.datasets.length ? i : 0]
            const mapId = k + (has_time ? shape.time : '')
            site.map._queue[mapId] = shape
            site.data.inited[mapId + this.id] = false
            if (
              site.data.loaded[k] &&
              (k === mapId ||
                shape.time == site.map[this.id].match_time(site.data.meta.overall.value[_u[this.view].parsed.time_agg]))
            )
              retrieve_layer(this, shape)
          })
          site.map[this.id].triggers = {}
          if (Array.isArray(site.map[this.id].overlays))
            site.map[this.id].overlays.forEach(l => {
              if ('string' === typeof l.source) l.source = [{url: l.source}]
              const source = l.source
              source.forEach(s => {
                s.retrieved = s.url in site.map._raw
                site.map._queue[s.url] = s
              })
              site.map[this.id].triggers[l.variable] = {source}
              const fs = l.filter
              if (fs) {
                const fa = Array.isArray(fs) ? fs : [fs]
                site.map[this.id].triggers[l.variable].filter = fa
                fa.forEach(f => {
                  f.check = site.data.checks[f.operator]
                })
              }
            })
        }
      } else {
        this.deferred = true
        setTimeout(queue_init_map.bind(this), showing ? 0 : 2000)
      }
    }

    function queue_init_datatable() {
      const showing = this.deferred || !this.tab || this.tab.classList.contains('show')
      if (showing && window.jQuery && window.DataTable && 'get' in site.dataviews[this.view]) {
        this.options.columns = this.header
        this.table = $(this.e).DataTable(this.options)
        this.update()
      } else {
        this.deferred = true
        setTimeout(queue_init_datatable.bind(this), showing ? 0 : 2000)
      }
    }
  }

  if ('undefined' === typeof module) {
    community(window, document, site)
  } else module.exports = community
})()
