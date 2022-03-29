void (function () {
  const community = function (window, document, site) {
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
            [0.3146, 16.3598, 93.5256],
            [276.4877, 654.9863, 678.309],
            [-6250.9645, -4422.6246, -6687.2207],
            [42090.4367, 25322.3241, 36184.6603],
            [-93988.2948, -56997.3024, -80039.8587],
            [86717.7586, 53230.7712, 74475.8209],
            [-28753.6504, -17788.6284, -24705.0099],
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
          var k,
            l,
            v = u.value(),
            theme = v ? 'dark' : 'light'
          if (v !== site.settings[u.setting]) {
            site.settings[u.setting] = v
            if ('theme_dark' === u.setting) {
              v
                ? document.body.classList.replace('light-theme', 'dark-theme')
                : document.body.classList.replace('dark-theme', 'light-theme')
              if (site.plotly)
                for (k in site.plotly) if (Object.hasOwn(site.plotly, k)) update_plot_theme(site.plotly[k].u)
              if (site.map)
                for (k in site.map)
                  if (Object.hasOwn(site.map, k) && site.map[k].u && Object.hasOwn(site.map[k].u.tiles, theme)) {
                    for (l in site.map[k].u.tiles)
                      if (theme !== l && Object.hasOwn(site.map[k].u.tiles, l))
                        site.map[k].u.tiles[l].removeFrom(site.map[k].u.map)
                    site.map[k].u.tiles[theme].addTo(site.map[k].u.map)
                  }
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
            } else {
              global_update()
            }
            storage.setItem(u.setting, site.settings[u.setting])
          }
        },
        options: function (u, c) {
          var v,
            i,
            s,
            n,
            ns = 0,
            k,
            d = u.dataset
              ? valueOf(u.dataset)
              : u.view
              ? _u[u.view].get.dataset()
              : valueOf(c.dataset) || defaults.dataset,
            va = valueOf(u.variable)
          if (!Object.hasOwn(u, 'option_sets')) u.option_sets = {}
          u.e.innerHTML = ''
          if (c && Object.hasOwn(u.option_sets, (k = d + (va ? va : '')))) {
            u.values = u.option_sets[k].values
            u.display = u.option_sets[k].display
            if (u.view && ('ID' === u.variable || 'ids' === u.options_source)) {
              for (
                v = site.dataviews[u.view].selection.all, s = u.option_sets[k].options, n = s.length, ns = 0, i = 0;
                i < n;
                i++
              ) {
                u.e.appendChild(s[i])
                if (Object.hasOwn(v, s[i].value)) {
                  s[i].classList.remove('hidden')
                  ns++
                } else {
                  s[i].classList.add('hidden')
                }
              }
            } else {
              for (s = u.option_sets[k].options, n = s.length, i = 0; i < n; i++) {
                u.e.appendChild(s[i])
                ns++
              }
            }
            u.e[ns ? 'removeAttribute' : 'setAttribute']('disabled', true)
          } else {
            if (patterns.variable.test(u.options_source)) {
              d = c.value()
              if (d) fill_variables_options(u, d, u.option_sets)
            } else if (patterns.levels.test(u.options_source)) {
              fill_levels_options(u, d, va, u.option_sets)
            } else if (patterns.ids.test(u.options_source)) {
              fill_ids_options(u, d, u.option_sets)
            }
          }
          u.set(u.value())
        },
        min: function (u, c) {
          var cv = c.value(),
            uv = u.value(),
            v = _u[u.view || c.view],
            variable
          if (patterns.minmax.test(cv)) cv = c.parsed.min
          if (v && v.y) {
            variable = valueOf(v.y)
            if (Object.hasOwn(variables, variable)) {
              if (!v.time_range.time.length) conditionals.time_range(v, u, true)
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
        max: function (u, c) {
          var cv = c.value(),
            uv = u.value(),
            v = _u[u.view || c.view],
            variable
          if (patterns.minmax.test(cv)) cv = c.parsed.max
          if (v && v.y) {
            variable = valueOf(v.y)
            if (Object.hasOwn(variables, variable)) {
              if (!v.time_range.time.length) conditionals.time_range(v, u, true)
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
          const state = f.value()
          if (state !== f.state) {
            var c,
              id,
              first_all = '',
              summary_state = site.settings.summary_selection
            if (init_log[f.parsed.dataset]) {
              f.valid = true
              f.n_selected.ids = 0
              f.n_selected.features = 0
              f.n_selected.variables = 0
              f.n_selected.dataset = 0
              f.n_selected.filtered = 0
              f.n_selected.all = 0
              f.selection.ids = {}
              f.selection.features = {}
              f.selection.variables = {}
              f.selection.dataset = {}
              f.selection.filtered = {}
              f.selection.all = {}
              f.reparse()
              for (id in entities)
                if (Object.hasOwn(entities, id)) {
                  c = f.check(entities[id])
                  c.all = 0
                  if (c.ids) {
                    f.selection.ids[id] = entities[id]
                    f.n_selected.ids++
                    c.all++
                  }
                  if (c.features) {
                    f.selection.features[id] = entities[id]
                    f.n_selected.features++
                    c.all++
                  }
                  if (c.variables) {
                    f.selection.variables[id] = entities[id]
                    f.n_selected.variables++
                    c.all++
                  }
                  if (c.dataset) {
                    f.selection.dataset[id] = entities[id]
                    f.n_selected.dataset++
                    c.all++
                  }
                  if (c.features && c.dataset) {
                    f.selection.filtered[id] = entities[id]
                    f.n_selected.filtered++
                  }
                  if (4 === c.all) {
                    if (!first_all) first_all = id
                    f.selection.all[id] = entities[id]
                    f.n_selected.all++
                    summary_state += id
                  }
                }
              if (first_all && summary_state !== f.summary_state) {
                f.summary_state = summary_state
                for (id in variables)
                  if (id !== meta.times[f.parsed.dataset].name && Object.hasOwn(variables, id))
                    calculate_summary(id, f.id, true)
                update_subs(f.id, 'update')
              }
              request_queue(f.id)
            } else {
              f.valid = false
              data_queue[f.parsed.dataset][f.id] = function () {
                return conditionals.dataview(f)
              }
            }
          }
        },
        time_filters: function (u) {
          u.time_range.filtered[0] = Infinity
          u.time_range.filtered[1] = -Infinity
          const d = u.get.dataset(),
            time = meta.times[d],
            c = _c[u.id + '_filter']
          if (!init_log[d]) return void 0
          for (var f, v = {}, pass, i = time.n; i--; ) {
            if (i >= u.time_range.index[0] && i <= u.time_range.index[1]) {
              for (f = u.time_filters.length, pass = false; f--; ) {
                if (!Object.hasOwn(v, u.time_filters[f].value))
                  v[u.time_filters[f].value] = valueOf(u.time_filters[f].value)
                pass = check_funs[u.time_filters[f].type](time.value[i], v[u.time_filters[f].value])
                if (!pass) break
              }
            } else pass = false
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
            for (i = c.length; i--; ) {
              if ('update' === c[i].type) {
                _u[c[i].id].update()
              } else if (Object.hasOwn(conditionals, c[i].type)) {
                conditionals[c[i].type](_u[c[i].id], u)
              }
            }
        },
        time_range: function (u, c, passive) {
          const v = c && c.value(),
            d = u.get.dataset(),
            tv = u.time ? valueOf(u.time) : defaults.time,
            t = Object.hasOwn(variables, tv) ? variables[tv].info[d].min : '',
            s = _c[u.id + '_time'],
            variable = Object.hasOwn(variables, v) ? v : valueOf(u.y)
          if (!init_log[d]) return void 0
          var r = variables[variable],
            i,
            value
          if (r) {
            if (!Object.hasOwn(r, u.id)) {
              return init_summaries(u.id).then(function () {
                elements.dataview.time_range(u, c, passive)
              })
            }
            r = r.info[d].time_range
            u.time_range.variable = variable
            u.time_range.index[0] = r[0]
            u.time_range.time[0] = u.time_range.filtered[0] = t + r[0]
            u.time_range.index[1] = r[1]
            u.time_range.time[1] = u.time_range.filtered[1] = t + r[1]
            if (!passive && s) {
              for (i = s.length; i--; ) {
                value = _u[s[i].id].value()
                if ('min' === s[i].type) {
                  if (isFinite(u.time_range.time[0]) && parseFloat(_u[s[i].id].e.min) !== u.time_range.time[0]) {
                    _u[s[i].id].e.min = u.time_range.time[0]
                    if (!meta.retain_state || u.time_range.time[0] > value) _u[s[i].id].set(u.time_range.time[0])
                  }
                } else if ('max' === s[i].type) {
                  if (isFinite(u.time_range.time[1]) && parseFloat(_u[s[i].id].e.max) !== u.time_range.time[1]) {
                    _u[s[i].id].e.max = u.time_range.time[1]
                    if (!meta.retain_state || u.time_range.time[1] < value || value < u.time_range.time[0])
                      _u[s[i].id].set(u.time_range.time[1])
                  }
                }
              }
              conditionals.time_filters(u)
            }
          }
        },
      },
      elements = {
        button: {
          init: function (o) {
            o.target = o.e.getAttribute('target')
            o.e.addEventListener(
              'click',
              o.settings.effects
                ? function () {
                    for (var k in this.settings.effects)
                      if (Object.hasOwn(_u, k)) {
                        this.settings.effects[k] === '' || -1 == this.settings.effects[k]
                          ? _u[k].reset()
                          : _u[k].set(this.settings.effects[k])
                      }
                  }.bind(o)
                : 'refresh' === o.target
                ? global_update
                : 'reset_selection' === o.target
                ? global_reset
                : 'reset_storage' === o.target
                ? clear_storage
                : function () {
                    if (Object.hasOwn(_u, this.target)) _u[this.target].reset()
                  }.bind(o)
            )
          },
        },
        buttongroup: {
          retrieve: function () {
            for (var i = this.options.length; i--; )
              if (this.options[i].checked) {
                this.set(i)
                break
              }
          },
          setter: function (v) {
            this.previous = this.value()
            this.current_index = 'string' === typeof v ? this.values.indexOf(v) : v
            if (-1 !== this.current_index) {
              this.source = Object.hasOwn(_u, this.values[this.current_index])
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
            for (var i = this.options.length; i--; ) {
              if (this.options[i].checked) {
                this.set(i)
                break
              }
            }
          },
          setter: function (v) {
            this.current_index = 'string' === typeof v ? this.values.indexOf(v) : v
            if (-1 !== this.current_index) {
              this.source = Object.hasOwn(_u, this.values[this.current_index])
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
            for (var i = this.options.length; i--; ) {
              if (this.options[i].checked) {
                this.source.push(this.values[i])
                this.current_index.push(i)
              }
            }
            request_queue(this.id)
          },
          setter: function (v) {
            if ('object' === typeof v) {
              this.source = []
              this.current_index = []
              for (var i = this.values.length; i--; )
                if (-1 !== v.indexOf(this.values[i])) {
                  this.source.push(this.values[i])
                  this.current_index.push(i)
                  this.options[i].checked = true
                } else this.options[i].checked = false
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
            if (site.text && Object.hasOwn(site.text, o.id)) {
              o.text = site.text[o.id].text
              o.condition = site.text[o.id].condition || []
              o.depends = {}
              for (var n = o.text.length, i = 0, tn, t, k; i < n; i++) {
                if (Object.hasOwn(o.text[i], 'text')) {
                  init_text(o, o.text[i])
                  o.e.appendChild(o.text[i].parts)
                } else {
                  o.e.appendChild(document.createElement('span'))
                  for (tn = o.text[i].length, t = 0; t < tn; t++) {
                    init_text(o, o.text[i][t])
                  }
                }
              }
              for (i = o.condition.length; i--; )
                if (Object.hasOwn(_u, o.condition[i].id)) add_dependency(o.condition[i].id, {type: 'display', id: o.id})
              for (k in o.depends) if (Object.hasOwn(_u, k)) add_dependency(k, {type: 'update', id: o.id})
              o.update = elements.text.update.bind(o)
            }
            o.update()
          },
          update: function () {
            var k, i, o, t, c, s, pass, bt
            for (k in this.reference_options)
              if (Object.hasOwn(this.reference_options, k)) this.options[k] = valueOf(this.reference_options[k])
            for (k in this.depends)
              if (Object.hasOwn(this.depends, k)) {
                this.depends[k] = valueOf(k)
                if (Object.hasOwn(entities, this.depends[k])) this.depends[k] = entities[this.depends[k]].features.name
              }
            for (i = this.text.length; i--; ) {
              pass = true
              o = this.text[i]
              if (o.length) {
                for (t = o.length; t--; ) {
                  if (Object.hasOwn(o[t], 'condition')) {
                    for (c = o[t].condition.length; c--; ) {
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
                if (Object.hasOwn(o, 'condition')) {
                  for (t = o.condition.length; t--; ) {
                    pass = o.condition[t].check()
                    if (!pass) break
                  }
                }
              }
              if (pass) {
                for (t = o.text.length; t--; ) {
                  k = o.text[t]
                  if ('object' === typeof k) {
                    for (bt = k.length; bt--; ) {
                      if ('default' === k[bt].id || check_funs[k[bt].type](valueOf(k[bt].id), valueOf(k[bt].value)))
                        k = k[bt].text
                    }
                  }
                  if (Object.hasOwn(this.depends, k)) {
                    o.parts.children[t].innerText = this.depends[k]
                  } else if (Object.hasOwn(o.button, k)) {
                    for (s = '', bt = o.button[k].text.length; bt--; ) {
                      s =
                        (Object.hasOwn(this.depends, o.button[k].text[bt])
                          ? this.depends[o.button[k].text[bt]]
                          : o.button[k].text[bt]) + s
                    }
                    o.parts.children[t].innerText = s
                  } else o.parts.children[t].innerText = k
                }
                if (this.text[i].length) {
                  this.e.children[i].innerHTML = ''
                  this.e.children[i].appendChild(o.parts)
                } else o.parts.classList.remove('hidden')
              } else o.parts.classList.add('hidden')
            }
          },
        },
        select: {
          retrieve: function () {
            this.set(this.e.selectedIndex)
          },
          setter: function (v) {
            if ('string' === typeof v) v = this.values.indexOf(v)
            if ('undefined' === typeof v) v = -1
            if (v !== this.e.selectedIndex || this.values[v] !== this.source) {
              this.e.selectedIndex = v
              this.source = this.values[v]
              request_queue(this.id)
            }
          },
          listener: function (e) {
            this.set(e.target.selectedIndex)
          },
          adder: function (value, display, meta) {
            var e = document.createElement('option')
            e.value = value
            e.innerText = display
            if (meta && meta.info) {
              e.title = meta.info.description || meta.info.short_description
            }
            this.e.appendChild(e)
            return e
          },
        },
        plotly: {
          init: function (o) {
            if (Object.hasOwn(site.plotly, o.id)) {
              var i, p, k, pl, es, en, ei
              o.x = o.e.getAttribute('x')
              o.y = o.e.getAttribute('y')
              o.color = o.e.getAttribute('color')
              o.time = o.e.getAttribute('color-time')
              o.click = o.e.getAttribute('click')
              if (o.click && Object.hasOwn(_u, o.click)) o.clickto = _u[o.click]
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
                var trace = make_data_entry(this, e, 0, 0, 'hover_line', site.settings.theme_dark ? '#fff' : '#000')
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
              for (i = site.plotly[o.id].data.length; i--; ) {
                p = site.plotly[o.id].data[i]
                for (k in p)
                  if (Object.hasOwn(p, k) && patterns.period.test(k)) {
                    for (es = k.split('.'), en = es.length, ei = 0, pl = false; ei < en; ei++) {
                      pl = pl ? (pl[es[ei]] = ei === en - 1 ? p[k] : {}) : (p[es[ei]] = {})
                    }
                  }
                if (!Object.hasOwn(p, 'textfont')) p.textfont = {}
                if (!Object.hasOwn(p.textfont, 'color')) p.textfont.color = '#adadad'
                if (!Object.hasOwn(p, 'line')) p.line = {}
                if (!Object.hasOwn(p.line, 'color')) p.line.color = '#adadad'
                if (!Object.hasOwn(p, 'marker')) p.marker = {}
                p.marker.size = 8
                if (!Object.hasOwn(p.marker, 'color')) p.marker.color = '#adadad'
                if (!Object.hasOwn(p.marker, 'line')) p.marker.line = {}
                if (!Object.hasOwn(p.marker.line, 'color')) p.marker.line.color = '#adadad'
                if (!Object.hasOwn(p, 'text')) p.text = []
                if (!Object.hasOwn(p, 'x')) p.x = []
                if ('box' !== p.type && !Object.hasOwn(p, 'y')) p.y = []
                o.traces[site.plotly[o.id].data[i].type] = JSON.stringify(site.plotly[o.id].data[i])
                if (!i) {
                  o.base_trace = site.plotly[o.id].data[i].type
                  if (Object.hasOwn(_u, o.base_trace)) add_dependency(o.base_trace, {type: 'update', id: o.id})
                }
              }
              if (o.x && !Object.hasOwn(variables, o.x)) {
                add_dependency(o.x, {type: 'update', id: o.id})
              }
              if (o.y && !Object.hasOwn(variables, o.y)) {
                add_dependency(o.y, {type: 'update', id: o.id})
              }
              if (o.time && Object.hasOwn(_u, o.time)) {
                add_dependency(o.time, {type: 'update', id: o.id})
              }
              if (o.view) {
                _c[o.view].push({type: 'update', id: o.id})
                _c[o.view + '_filter'].push({type: 'update', id: o.id})
                if (_u[o.view].time_agg && Object.hasOwn(_u, _u[o.view].time_agg))
                  add_dependency(_u[o.view].time_agg, {type: 'update', id: o.id})
              } else o.view = defaults.dataview
              queue_init_plotly.bind(o)()
            }
          },
          mouseover: function (d) {
            if (d.points && d.points.length === 1 && this.e.data[d.points[0].fullData.index]) {
              this.e.data[d.points[0].fullData.index].line.width = 4
              // this.e.data[d.points[0].fullData.index].marker.size = 12
              Plotly.react(this.e, this.e.data, this.e.layout)
              update_subs(this.id, 'show', entities[d.points[0].data.id])
            }
          },
          mouseout: function (d) {
            if (d.points && d.points.length === 1 && this.e.data[d.points[0].fullData.index]) {
              this.e.data[d.points[0].fullData.index].line.width = 2
              // this.e.data[d.points[0].fullData.index].marker.size = 8
              Plotly.react(this.e, this.e.data, this.e.layout)
              update_subs(this.id, 'revert', entities[d.points[0].data.id])
            }
          },
          click: function (d) {
            this.clickto && this.clickto.set(d.points[0].data.id)
          },
          update: function (pass) {
            clearTimeout(this.queue)
            if (!pass) {
              if (!this.tab || this.tab.classList.contains('show')) this.queue = setTimeout(() => this.update(true), 50)
            } else {
              if (this.e.layout) {
                const v = _u[this.view],
                  s = v.selection && v.selection.all,
                  d = v.get.dataset(),
                  y = _u[this.time || v.time_agg],
                  rank = 'all' === site.settings.summary_selection ? 'subset_rank' : 'rank'
                if (init_log[d] && s) {
                  this.parsed.base_trace = valueOf(this.base_trace)
                  this.parsed.x = valueOf(this.x)
                  this.parsed.x_range = variables[this.parsed.x].info[d].time_range
                  this.parsed.y = valueOf(this.y)
                  this.parsed.y_range = variables[this.parsed.y].info[d].time_range
                  this.parsed.view = v
                  this.parsed.dataset = d
                  this.parsed.palette = valueOf(v.palette) || site.settings.palette
                  if (!Object.hasOwn(palettes, this.parsed.palette)) this.parsed.palette = defaults.palette
                  this.parsed.color = valueOf(this.color || v.y || this.parsed.y)
                  this.parsed.time =
                    (y ? y.value() - meta.times[d].range[0] : 0) - variables[this.parsed.color].info[d].time_range[0]
                  this.parsed.summary = variables[this.parsed.color][this.view].summaries[d]
                  const summary = variables[this.parsed.y][this.view].summaries[d],
                    subset = this.parsed.summary.n[this.parsed.time] !== v.n_selected.all,
                    order = subset
                      ? variables[this.parsed.color][this.view].order[d][this.parsed.time]
                      : variables[this.parsed.color].info[d].order[this.parsed.time]
                  var i = this.parsed.summary.missing[this.parsed.time],
                    k,
                    b,
                    n = this.parsed.summary.n[this.parsed.time] - 1,
                    fn = order ? order.length : 0,
                    traces = [],
                    lim = site.settings.trace_limit || 0,
                    jump,
                    state =
                      v.value() +
                      v.get.time_filters() +
                      this.parsed.x +
                      this.parsed.y +
                      this.parsed.palette +
                      this.parsed.color +
                      site.settings.summary_selection +
                      site.settings.color_scale_center +
                      site.settings.color_by_order +
                      site.settings.trace_limit
                  lim = jump = lim && lim < n ? Math.ceil(Math.min(lim / 2, n / 2)) : 0
                  for (k in this.reference_options)
                    if (Object.hasOwn(this.reference_options, k)) this.options[k] = valueOf(this.reference_options[k])
                  for (; i < fn; i++) {
                    if (Object.hasOwn(s, order[i][0])) {
                      k = order[i][0]
                      state += k
                      traces.push(
                        make_data_entry(
                          this,
                          s[k],
                          s[k][rank][this.parsed.color][this.parsed.time] -
                            this.parsed.summary.missing[this.parsed.time],
                          n
                        )
                      )
                      if (lim && !--jump) break
                    }
                  }
                  if (lim && i < fn) {
                    for (jump = i, i = fn - 1; i > jump; i--) {
                      if (Object.hasOwn(s, order[i][0])) {
                        k = order[i][0]
                        state += k
                        traces.push(
                          make_data_entry(
                            this,
                            s[k],
                            s[k][rank][this.parsed.color][this.parsed.time] -
                              this.parsed.summary.missing[this.parsed.time],
                            n
                          )
                        )
                        if (!--lim) break
                      }
                    }
                  }
                  state += traces.length && traces[0].type
                  if (site.settings.boxplots && Object.hasOwn(this.traces, 'box') && s[k]) {
                    state += 'box' + site.settings.iqr_box
                    traces.push((b = JSON.parse(this.traces.box)))
                    b.line.color = site.settings.dark_theme ? '#757575' : '#787878'
                    b.median = summary.median
                    b.q3 = summary.q3
                    b.q1 = summary.q1
                    if (site.settings.iqr_box) {
                      for (b.upperfence = [], b.lowerfence = [], i = b.q1.length; i--; ) {
                        n = (b.q3[i] - b.q1[i]) * 1.5
                        b.q3[i] = Math.max(b.median[i], b.q3[i])
                        b.upperfence[i] = b.q3[i] + n
                        b.q1[i] = Math.min(b.median[i], b.q1[i])
                        b.lowerfence[i] = b.q1[i] - n
                      }
                    } else {
                      b.upperfence = summary.max
                      b.lowerfence = summary.min
                    }
                    b.x = []
                    for (i = b.q1.length; i--; ) {
                      b.x[i] = s[k].get_value(this.parsed.x, i + this.parsed.y_range[0])
                    }
                  }
                  if ('boolean' !== typeof this.e.layout.yaxis.title)
                    this.e.layout.yaxis.title =
                      format_label(this.parsed.y) +
                      (site.settings.trace_limit && site.settings.trace_limit < v.n_selected.all
                        ? ' (' + site.settings.trace_limit + ' extremes)'
                        : '')
                  if ('boolean' !== typeof this.e.layout.xaxis.title)
                    this.e.layout.xaxis.title = format_label(this.parsed.x)
                  this.e.layout.yaxis.autorange = false
                  this.e.layout.yaxis.range = [Infinity, -Infinity]
                  if (!b) b = {upperfence: summary.max, lowerfence: summary.min}
                  for (i = 0, n = summary.min.length; i < n; i++) {
                    lim = Math.min(b.lowerfence[i], summary.min[i])
                    if (this.e.layout.yaxis.range[0] > lim) this.e.layout.yaxis.range[0] = lim
                    lim = Math.max(b.upperfence[i], summary.max[i])
                    if (this.e.layout.yaxis.range[1] < lim) this.e.layout.yaxis.range[1] = lim
                  }
                  lim = (this.e.layout.yaxis.range[1] - this.e.layout.yaxis.range[0]) / 10
                  this.e.layout.yaxis.range[0] -= lim
                  this.e.layout.yaxis.range[1] += lim
                  if (variables[this.parsed.x].is_time) {
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
                  if (state !== this.state) {
                    Plotly.react(this.e, traces, this.e.layout)
                    setTimeout(trigger_resize, 300)
                  }
                  this.state = state
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
            if (o.click && Object.hasOwn(_u, o.click)) o.clickto = _u[o.click]
            o.parsed = {}
            o.tab = 'tabpanel' === o.e.parentElement.getAttribute('role') ? o.e.parentElement : void 0
            o.show = function (e) {
              if (e && e.layer && e.layer[this.id]) {
                e.layer[this.id].setStyle({
                  color: '#ffffff',
                })
                e.layer[this.id].bringToFront()
              }
            }
            o.revert = function (e) {
              if (e && e.layer && e.layer[this.id]) {
                e.layer[this.id].setStyle({
                  color: '#000000',
                })
              }
            }
            if (o.view) {
              add_dependency(o.view, {type: 'update', id: o.id})
              if (_u[o.view].time_agg && Object.hasOwn(_u, _u[o.view].time_agg))
                add_dependency(_u[o.view].time_agg, {type: 'update', id: o.id})
              if (_u[o.view].y) add_dependency(_u[o.view].y, {type: 'update', id: o.id})
            } else o.view = defaults.dataview
            _c[o.view].push({type: 'update', id: o.id})
            if (Object.hasOwn(_u, o.color)) add_dependency(o.color, {type: 'update', id: o.id})
            if (o.time) add_dependency(o.time, {type: 'update', id: o.id})
            if (!o.e.style.height) o.e.style.height = o.options.height ? o.options.height : '400px'
            queue_init_map.bind(o)()
          },
          mouseover: function (e) {
            e.target.setStyle({
              color: '#ffffff',
            })
            e.target.bringToFront()
            update_subs(this.id, 'show', entities[e.target.feature.properties[e.target.source.id_property]])
          },
          mouseout: function (e) {
            update_subs(this.id, 'revert', entities[e.target.feature.properties[e.target.source.id_property]])
            e.target.setStyle({
              color: '#000000',
            })
          },
          click: function (e) {
            this.clickto && this.clickto.set(e.target.feature.properties[e.target.source.id_property])
          },
          update: function (entity, caller, pass) {
            clearTimeout(this.queue)
            if (!pass) {
              if (!this.tab || this.tab.classList.contains('show'))
                this.queue = setTimeout(() => this.update(void 0, void 0, true), 50)
            } else {
              if (this.view && this.displaying) {
                const view = site.dataviews[this.view],
                  d = view.get.dataset()
                if (!view.valid && init_log[d]) {
                  view.state = ''
                  conditionals.dataview(view, void 0, true)
                }
                this.parsed.view = view
                this.parsed.dataset = d
                const vstate = view.value() + site.settings.background_shapes,
                  a = view.selection.all,
                  s = view.selection[site.settings.background_shapes && this.options.background_shapes ? 'ids' : 'all'],
                  bgc = site.settings.theme_dark ? '#666' : '#000',
                  c = valueOf(this.color || view.y),
                  subset = 'all' === site.settings.summary_selection ? 'subset_rank' : 'rank',
                  ys = this.time
                    ? _u[this.time]
                    : view.time_agg
                    ? Object.hasOwn(_u, view.time_agg)
                      ? _u[view.time_agg]
                      : parseInt(view.time_agg)
                    : 0
                var k,
                  n = 0,
                  fg,
                  id
                if (init_log[d + '_map'] && s && view.valid) {
                  if (vstate !== this.vstate) {
                    // updating shapes
                    if (
                      site.settings.background_shapes && this.options.background_shapes
                        ? !init_log[this.options.background_shapes]
                        : false
                    ) {
                      view.valid = false
                      data_queue[this.options.background_shapes][this.id] = this.update.bind(void 0, void 0, true)
                      return void 0
                    }
                    this.map._zoomAnimated = 'none' !== site.settings.map_animations
                    for (k in this.reference_options)
                      if (Object.hasOwn(this.reference_options, k)) {
                        this.options[k] = valueOf(this.reference_options[k])
                        if ('zoomAnimation' === k) this.map._zoomAnimated = this.options[k]
                      }
                    this.displaying.clearLayers()
                    this.fresh_shapes = true
                    this.vstate = false
                    for (k in s) {
                      fg = Object.hasOwn(a, k)
                      if (
                        Object.hasOwn(s, k) &&
                        s[k].layer &&
                        s[k].layer[this.id] &&
                        (fg || this.options.background_shapes === entities[k].group)
                      ) {
                        s[k].layer[this.id].options.interactive = fg
                        n++
                        s[k].layer[this.id].addTo(this.displaying)
                        if (!fg) {
                          s[k].layer[this.id].bringToBack()
                          s[k].layer[this.id]._path.classList.remove('na')
                          s[k].layer[this.id].setStyle({
                            fillOpacity: 0,
                            color: bgc,
                            weight: 1,
                          })
                        }
                        if (!this.vstate) this.vstate = vstate
                      }
                    }
                    if (n)
                      this.map['fly' === site.settings.map_animations ? 'flyToBounds' : 'fitBounds'](
                        this.displaying.getBounds()
                      )
                  }

                  // coloring
                  this.parsed.palette = valueOf(view.palette) || site.settings.palette
                  if (!Object.hasOwn(palettes, this.parsed.palette)) this.parsed.palette = defaults.palette
                  this.parsed.time =
                    (ys.parsed ? ys.value() - meta.times[d].range[0] : 0) - variables[c].info[d].time_range[0]
                  this.parsed.color = c
                  this.parsed.summary = Object.hasOwn(variables[c], this.view)
                    ? variables[c][this.view].summaries[d]
                    : false
                  k =
                    c +
                    this.vstate +
                    this.parsed.palette +
                    this.parsed.time +
                    site.settings.polygon_outline +
                    site.settings.color_by_order +
                    site.settings.color_scale_center
                  if (c && k !== this.cstate) {
                    this.cstate = k
                    if (
                      site.map[this.id]._layers &&
                      Object.hasOwn(site.map[this.id]._layers, d) &&
                      Object.hasOwn(variables[c], this.view)
                    ) {
                      const ls = this.displaying._layers
                      n = this.parsed.summary.n[this.parsed.time] - 1
                      for (id in ls)
                        if (Object.hasOwn(ls, id)) {
                          k = ls[id].entity.features.id
                          fg =
                            Object.hasOwn(a, k) && Object.hasOwn(a[k][subset], c)
                              ? pal(
                                  a[k].get_value(c, this.parsed.time),
                                  this.parsed.palette,
                                  this.parsed.summary,
                                  this.parsed.time,
                                  a[k][subset][c][this.parsed.time] - this.parsed.summary.missing[this.parsed.time],
                                  n
                                )
                              : ''
                          if (d === ls[id].entity.group) {
                            ls[id]._path.classList[fg ? 'remove' : 'add']('na')
                            ls[id].setStyle({
                              fillOpacity: 0.7,
                              color: '#000000',
                              fillColor: fg,
                              weight: site.settings.polygon_outline,
                            })
                          }
                        }
                    } else {
                      if (!Object.hasOwn(site.map, '_waiting')) site.map._waiting = {}
                      if (!Object.hasOwn(site.map._waiting, d)) site.map._waiting[d] = []
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
            var i, n, h, p
            o.view = o.options.dataview || defaults.dataview
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
                      if (Object.hasOwn(this.parsed, 'features')) {
                        return entity.features[this.parsed.features]
                      } else if (Object.hasOwn(this.parsed, 'data')) {
                        if ('value' === this.text) {
                          this.parsed.data = valueOf(o.options.variable || caller.color || caller.y || _u[o.view].y)
                        } else if (Object.hasOwn(_u, this.text)) this.parsed.data = valueOf(this.text)
                        const info = variable_info[this.parsed.data],
                          v = format_value(
                            entity.get_value(this.parsed.data, this.parent.time),
                            info && info.type ? patterns.int_types.test(info.type) : true
                          )
                        return 'unknown' !== v && Object.hasOwn(value_types, info.type) ? value_types[info.type](v) : v
                      }
                    if (Object.hasOwn(this.parsed, 'data')) {
                      return meta.times[this.parent.dataset].value[this.parent.time_agg]
                    } else if (
                      Object.hasOwn(this.parsed, 'variables') &&
                      (this.value_source || Object.hasOwn(variable_info, this.parent.v))
                    ) {
                      return variable_info[valueOf(this.value_source || this.parent.v)][this.parsed.variables]
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
              if (
                Object.hasOwn(o.parts.title.parsed, 'variables') &&
                patterns.measure_name.test(o.parts.title.parsed.variables)
              ) {
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
              for (n = o.options.body.length, i = 0, h = 0; i < n; i++) {
                o.parts.body.rows[i] = p = {
                  name: parse_part(o, o.options.body[i].name),
                  value: parse_part(o, o.options.body[i].value),
                }
                p.base = document.createElement('div')
                o.parts.body.base.appendChild(p.base)
                p.temp = document.createElement('div')
                o.parts.body.temp.appendChild(p.temp)
                p.temp.className = p.base.className = 'info-body-row-' + o.options.body[i].style
                h += 24 + ('stack' === o.options.body[i].style ? 24 : 0)
                if (p.name) {
                  if (
                    o.options.variable_info &&
                    Object.hasOwn(p.name.parsed, 'variables') &&
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
              }
              o.e.style.minHeight = h + 'px'
              o.e.appendChild(o.parts.body.base)
              o.e.appendChild(o.parts.body.default)
              o.e.appendChild(o.parts.body.temp)
            }
            o.update()
          },
          update: function (entity, caller, pass) {
            const v = site.dataviews[this.view]
            var p,
              e,
              i,
              n,
              ci,
              k,
              y = _u[v.time_agg]
            this.v = valueOf(this.options.variable || (caller && (caller.color || caller.y)) || v.y)
            this.dataset = v.get.dataset()
            this.time_agg = y ? y.value() - meta.times[this.dataset].range[0] : 0
            this.time = this.v ? this.time_agg - variables[this.v].info[this.dataset].time_range[0] : 0
            if (!this.processed) {
              this.processed = true
              if (this.view) {
                add_dependency(this.view, {type: 'update', id: this.id})
                if (y) add_dependency(v.time_agg, {type: 'update', id: this.id})
              } else this.view = defaults.dataview
              if (this.parts.body)
                for (i = this.parts.body.rows.length; i--; ) {
                  p = this.parts.body.rows[i]
                  if (!p.value.ref) {
                    if (Object.hasOwn(_u, p.value.text)) {
                      if (Object.hasOwn(p.name.parsed, 'variables')) {
                        p.name.value_source = p.value.value_source = p.value.text
                        p.value.ref = true
                        p.value.parsed.data = ''
                      }
                    }
                  }
                }
            }
            if (entity) {
              // hover information
              if (this.parts.title) {
                this.parts.title.temp.innerText = this.parts.title.get(entity, caller)
              }
              if (this.parts.body) {
                for (i = this.parts.body.rows.length; i--; ) {
                  p = this.parts.body.rows[i]
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
                }
              }
            } else if (!this.options.floating) {
              clearTimeout(this.queue)
              if (!pass) {
                if (!this.tab || this.tab.classList.contains('show'))
                  this.queue = setTimeout(() => this.update(void 0, void 0, true), 50)
              } else {
                // base information
                if (v.ids && (k = v.get.ids()) && '-1' !== k) {
                  // when showing a selected region
                  this.selection = true
                  entity = entities[k]
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
                  for (i = this.parts.body.rows.length; i--; ) {
                    p = this.parts.body.rows[i]
                    if (Object.hasOwn(p.value.parsed, 'variables') && !Object.hasOwn(this.depends, v.y)) {
                      this.depends[v.y] = true
                      add_dependency(v.y, {type: 'update', id: this.id})
                    }
                    if (p.name.ref) {
                      if (p.name.value_source) p.name.value_source = p.value.text
                      e = p.name.get(entity, caller)
                      if ('object' !== typeof e) {
                        p.base.firstElementChild.innerText = e
                      }
                    }
                    if (p.value.ref) {
                      e = p.value.get(entity, caller)
                      if ('object' === typeof e) {
                        if ('sources' === p.value.parsed.variables) {
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
                          for (n = e.length, ci = 0; ci < n; ci++) {
                            p.base.firstElementChild.lastElementChild.appendChild(make_variable_source(e[ci]))
                          }
                        }
                      } else {
                        p.base.lastElementChild.innerText = parse_variables(e, p.value.parsed.variables, this, entity)
                      }
                    }
                  }
                }
              }
            }
            this.revert()
          },
        },
        datatable: {
          init: function (o) {
            var k, n, i, c, t
            o.e.appendChild(document.createElement('tHead'))
            o.e.appendChild(document.createElement('tBody'))
            o.click = o.e.getAttribute('click')
            o.features = o.options.features
            o.parsed = {summary: {}, order: [], time: 0, color: '', dataset: _u[o.view].get.dataset()}
            o.header = []
            o.rows = {}
            o.rowIds = {}
            o.tab = 'tabpanel' === o.e.parentElement.getAttribute('role') ? o.e.parentElement : void 0
            const time = meta.times[o.parsed.dataset]
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
              if (Object.hasOwn(_u, o.click)) o.clickto = _u[o.click]
              o.e.addEventListener('click', elements.datatable.click.bind(o))
            }
            o.show = function (e) {
              if (Object.hasOwn(this.rows, e.features.id)) {
                const row = this.rows[e.features.id].node()
                if (row) {
                  row.style.backgroundColor = '#adadad'
                  if (site.settings.table_autoscroll)
                    this.e.parentElement.scroll({
                      top: row.getBoundingClientRect().y - this.e.getBoundingClientRect().y,
                      behavior: site.settings.table_scroll_behavior || 'smooth',
                    })
                }
              }
            }
            o.revert = function (e) {
              if (Object.hasOwn(this.rows, e.features.id)) {
                const row = this.rows[e.features.id].node()
                if (row) row.style.backgroundColor = 'inherit'
              }
            }
            o.options.variable_source = o.options.variables
            if (o.options.variables) {
              if ('string' === typeof o.options.variables) {
                if (Object.hasOwn(_u, o.options.variables)) {
                  add_dependency(o.options.variables, {type: 'update', id: o.id})
                  o.options.variables = valueOf(o.options.variables)
                  o.options.single_variable = 'string' === typeof o.options.variables
                } else if (!o.options.single_variable) {
                  o.options.single_variable = [{name: o.options.single_variable}]
                }
              }
            } else o.options.variables = Object.keys(variables)
            if (
              'string' !== typeof o.options.variables &&
              o.options.variables.length &&
              'string' === o.options.variables[0]
            ) {
              for (i = o.options.variables.length; i--; ) o.options.variables[i] = {name: o.options.variables[i]}
            }
            if (o.options.single_variable) {
              c = o.options.variables
              k = c.name || c
              o.header.push({title: 'Name', data: 'entity.features.name'})
              if (time.is_single) o.variable_header = true
              t = variables[k].info[o.parsed.dataset].time_range
              for (n = t[1] - t[0] + 1; n--; ) {
                o.header[n + 1] = {
                  title: o.variable_header ? c.title || format_label(k) : time.value[n + t[0]] + '',
                  data: data_retrievers.vector,
                  render: data_retrievers.row_time.bind({i: n, o: t[0]}),
                }
              }
              o.options.order = [[o.header.length - 1, 'dsc']]
            } else if (o.options.wide) {
              if (o.features) {
                if ('string' === typeof o.features) o.features = [{name: o.features}]
                for (n = o.features.length, i = 0; i < n; i++) {
                  o.header.push({
                    title: o.features[i].title || o.features[i].name,
                    data: 'entity.features.' + o.features[i].name.replace(patterns.all_periods, '\\.'),
                  })
                }
              }
              for (i = o.options.variables.length; i--; ) {
                if ('string' === typeof o.options.variables[i]) o.options.variables[i] = {name: o.options.variables[i]}
                c = o.options.variables[i]
                if (!c.source) c.source = Object.hasOwn(variables, c.name) ? 'data' : 'features'
                o.header.push(
                  'features' === c.source
                    ? {
                        title: c.title || format_label(c.name),
                        data: 'entity.features.' + c.name.toLowerCase().replace(patterns.all_periods, '\\.'),
                      }
                    : {
                        title: c.title || format_label(c.name),
                        render: function (d, type, row) {
                          if ('data' === this.c.source) {
                            if (Object.hasOwn(variables, this.c.name)) {
                              const i = row.time - variables[this.c.name].info[row.entity.group].time_range[0]
                              return i < 0 ? 'NA' : row.entity.get_value(this.c.name, i)
                            } else return 'NA'
                          } else
                            return Object.hasOwn(row.entity, this.c.source) &&
                              Object.hasOwn(row.entity[this.c.source], this.c.name)
                              ? row.entity[this.c.source][this.c.name]
                              : 'NA'
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
                        ? format_value(d[t], true)
                        : d[t]
                      : 'NA'
                  },
                })
              }
              if (o.features) {
                if ('string' === typeof o.features) o.features = [{name: o.features}]
                for (i = o.features.length; i--; ) {
                  o.header.splice(0, 0, {
                    title: o.features[i].title || o.features[i].name,
                    data: 'entity.features.' + o.features[i].name.replace(patterns.all_periods, '\\.'),
                  })
                }
              }
              o.header.push({
                title: 'Variable',
                data: function (row) {
                  return Object.hasOwn(row.entity.variables, row.variable)
                    ? row.entity.variables[row.variable].short_name
                    : row.variable
                },
              })
              o.header.push({
                title: 'Value',
                data: data_retrievers.vector,
                render: function (d, type, row) {
                  return d ? ('number' === typeof d[row.time] ? format_value(d[row.time], row.int) : d[row.time]) : ''
                },
              })
            }
            if (o.view) {
              _c[o.view].push({type: 'update', id: o.id})
              _c[o.view + '_filter'].push({type: 'update', id: o.id})
            } else o.view = defaults.dataview
            queue_init_datatable.bind(o)()
          },
          update: function (pass) {
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
                if (!init_log[d]) return void 0
                if (state !== this.state) {
                  this.rows = {}
                  this.rowIds = {}
                  this.table.clear()
                  if (v.selection) {
                    this.state = state
                    var k,
                      c,
                      i,
                      n,
                      va,
                      reset = true,
                      redraw = true,
                      varstate = '' + this.parsed.dataset + v.get.ids() + v.get.features() + site.settings.digits
                    for (k in this.reference_options)
                      if (Object.hasOwn(this.reference_options, k)) this.options[k] = valueOf(this.reference_options[k])
                    if (this.options.single_variable) {
                      const time = valueOf(v.time_agg)
                      this.parsed.dataset = d
                      this.parsed.color = vn
                      this.parsed.time_range = variables[vn].info[d].time_range
                      this.parsed.time =
                        ('number' === typeof time ? time - meta.times[d].range[0] : 0) - this.parsed.time_range[0]
                      this.parsed.summary = Object.hasOwn(variables[vn], this.view)
                        ? variables[vn][this.view].summaries[d]
                        : false
                      this.parsed.order = Object.hasOwn(variables[vn], this.view)
                        ? variables[vn][this.view].order[d][this.parsed.time]
                        : false
                      if (this.header.length < 2 || vn !== this.header[1].variable) {
                        this.table.destroy()
                        $(this.e).empty()
                        this.header = [{title: 'Name', data: 'entity.features.name'}]
                        if (-1 !== this.parsed.time_range[0]) {
                          for (n = this.parsed.time_range[1] - this.parsed.time_range[0] + 1; n--; ) {
                            this.header[n + 1] = {
                              variable: vn,
                              title: this.variable_header
                                ? this.options.variables.title || format_label(k)
                                : meta.times[d].value[n + this.parsed.time_range[0]] + '',
                              data: data_retrievers.vector,
                              render: data_retrievers.row_time.bind({i: n, o: this.parsed.time_range[0]}),
                            }
                          }
                        } else this.state = ''
                        this.options.order[0][0] = this.header.length - 1
                        this.options.columns = this.header
                        this.table = $(this.e).DataTable(this.options)
                      }
                      for (n = this.header.length, i = 1; i < n; i++) {
                        this.table.column(i).visible(v.times[i - 1 + this.parsed.time_range[0]], false)
                        if (v.times[i - 1 + this.parsed.time_range[0]]) reset = false
                      }
                      if (reset) this.state = ''
                    }
                    if (this.options.wide) {
                      for (k in v.selection.all)
                        if (Object.hasOwn(v.selection.all, k)) {
                          if (vn) {
                            if (Object.hasOwn(v.selection.all[k].summary, vn)) {
                              this.rows[k] = this.table.row.add({
                                variable: vn,
                                offset: this.parsed.time_range[0],
                                entity: v.selection.all[k],
                                int: patterns.int_types.test(variable_info[vn].type),
                              })
                              this.rowIds[this.rows[k].selector.rows] = k
                            }
                          } else {
                            for (i = meta.times[d].n; i--; ) {
                              this.rows[k] = this.table.row.add({
                                time: i,
                                entity: v.selection.all[k],
                              })
                              this.rowIds[this.rows[k].selector.rows] = k
                            }
                          }
                        }
                    } else {
                      for (c in this.filters)
                        if (Object.hasOwn(this.filters, c)) {
                          this.current_filter[c] = valueOf(this.filters[c])
                        }
                      for (va = [], i = this.options.variables.length; i--; ) {
                        vn = this.options.variables[i].name || this.options.variables[i]
                        pass = false
                        if (Object.hasOwn(variables, vn) && Object.hasOwn(variables[vn], 'meta')) {
                          if (this.options.filters) {
                            for (c in this.current_filter)
                              if (Object.hasOwn(variables[vn].meta, c)) {
                                pass = variables[vn].meta[c] === this.current_filter[c]
                                if (!pass) break
                              }
                          } else pass = true
                        }
                        if (pass) {
                          varstate += vn
                          va.push({
                            variable: vn,
                            int: patterns.int_types.test(variable_info[vn].type),
                            time_range: variables[vn].info[d].time_range,
                            renderer: function (o, s) {
                              for (var r = this.time_range, n = r[1], ci = r[0]; ci <= n; ci++) {
                                o.rows[s.features.id] = o.table.row.add({
                                  offset: this.time_range[0],
                                  time: ci - this.time_range[0],
                                  variable: this.variable,
                                  entity: s,
                                  int: this.int,
                                })
                                o.rowIds[o.rows[k].selector.rows] = s.features.id
                              }
                            },
                          })
                        }
                      }
                      if (varstate === this.varstate) return void 0
                      this.varstate = varstate
                      for (k in v.selection.all)
                        if (Object.hasOwn(v.selection.all, k)) {
                          if (this.options.single_variable) {
                            if (
                              Object.hasOwn(v.selection.all[k].summary, vn) &&
                              Object.hasOwn(v.selection.all[k].data, variables[vn].code)
                            ) {
                              this.rows[k] = this.table.row.add({
                                offset: this.parsed.time_range[0],
                                variable: vn,
                                entity: v.selection.all[k],
                                int: patterns.int_types.test(variable_info[vn].type),
                              })
                              this.rowIds[this.rows[k].selector.rows] = k
                            }
                          } else {
                            for (i = va.length; i--; )
                              if (Object.hasOwn(v.selection.all[k].data, variables[va[i].variable].code))
                                va[i].renderer(this, v.selection.all[k])
                          }
                        }
                    }
                  }
                  redraw ? this.table.draw() : this.table.columns.adjust().draw(false)
                }
              }
            }
          },
          mouseover: function (e) {
            if (e.target._DT_CellIndex && Object.hasOwn(this.rowIds, e.target._DT_CellIndex.row)) {
              const id = this.rowIds[e.target._DT_CellIndex.row],
                row = this.rows[id].node()
              if (row) row.style.backgroundColor = '#adadad'
              if (Object.hasOwn(entities, id)) {
                update_subs(this.id, 'show', entities[id])
              }
            }
          },
          mouseout: function (e) {
            if (e.target._DT_CellIndex && Object.hasOwn(this.rowIds, e.target._DT_CellIndex.row)) {
              const id = this.rowIds[e.target._DT_CellIndex.row],
                row = this.rows[id].node()
              if (row) row.style.backgroundColor = 'inherit'
              if (Object.hasOwn(entities, id)) {
                update_subs(this.id, 'revert', entities[id])
              }
            }
          },
          click: function (e) {
            if (this.clickto && e.target._DT_CellIndex && Object.hasOwn(this.rowIds, e.target._DT_CellIndex.row)) {
              const id = this.rowIds[e.target._DT_CellIndex.row]
              if (Object.hasOwn(entities, id)) this.clickto.set(id)
            }
          },
        },
        legend: {
          init: function (o) {
            add_dependency(o.view, {type: 'update', id: o.id})
            if (_u[o.view].y) add_dependency(_u[o.view].y, {type: 'update', id: o.id})
            if (Object.hasOwn(_u, _u[o.view].time_agg)) add_dependency(_u[o.view].time_agg, {type: 'update', id: o.id})
            if (!o.palette)
              o.palette = Object.hasOwn(_u, 'settings.palette') ? 'settings.palette' : site.settings.palette
            o.parsed = {summary: {}, order: [], selection: {}, selected_summary: {}, time: 0, color: ''}
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
            if (Object.hasOwn(_u, o.click)) o.clickto = _u[o.click]
            o.ticks = {
              center: o.parts.summary.appendChild(document.createElement('div')),
              min: o.parts.summary.appendChild(document.createElement('div')),
              max: o.parts.summary.appendChild(document.createElement('div')),
              entity: o.parts.ticks.appendChild(document.createElement('div')),
            }
            var t, e
            for (t in o.ticks)
              if (Object.hasOwn(o.ticks, t)) {
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
              }
            o.ticks.entity.firstElementChild.classList.add('hidden')
            o.ticks.max.className = 'legend-tick-end max'
            o.ticks.min.className = 'legend-tick-end min'
            o.ticks.center.style.left = '50%'
            o.show = function (e, c) {
              if (Object.hasOwn(c, 'parsed')) {
                const summary = c.parsed.summary,
                  string = summary && Object.hasOwn(summary, 'levels'),
                  min = summary && !string ? summary.min[c.parsed.time] : 0,
                  range = summary ? (string ? summary.levels.length - min : summary.range[c.parsed.time]) : 1,
                  subset = 'all' === site.settings.summary_selection ? 'subset_rank' : 'rank',
                  value = e.get_value(c.parsed.color, c.parsed.time),
                  p =
                    ((string ? Object.hasOwn(summary.level_ids, value) : 'number' === typeof value)
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
                  t.innerText = format_value(value, this.integer)
                  this.ticks.entity.style.left = p + '%'
                  this.ticks.entity.firstElementChild.firstElementChild.innerText =
                    (p > 96 || p < 4) && e.features.name.length > 13
                      ? e.features.name.substring(0, 12) + '…'
                      : e.features.name
                } else if (site.settings.color_by_order) {
                  var i =
                      entities[e.features.id][subset][c.parsed.color][c.parsed.time] - summary.missing[c.parsed.time],
                    po = (i / (summary.n[c.parsed.time] - 1)) * 100
                  this.ticks.entity.firstElementChild.firstElementChild.innerText =
                    i > -1 && (po > 96 || po < 4) && e.features.name.length > 13
                      ? e.features.name.substring(0, 12) + '…'
                      : e.features.name
                  if (i > -1) {
                    t.parentElement.classList.remove('hidden')
                    t.innerText = '# ' + (i + 1)
                    this.ticks.entity.style.left = po + '%'
                  }
                }
                this.ticks.entity.style.marginLeft = -this.ticks.entity.getBoundingClientRect().width / 2 + 'px'
              }
            }
            o.revert = function () {
              this.ticks.entity.firstElementChild.classList.add('hidden')
            }
            add_dependency(o.view, {type: 'update', id: o.id})
            if (Object.hasOwn(_u, o.palette)) {
              _u[o.palette].e.addEventListener('change', o.update)
            }
            o.update()
          },
          update: function () {
            const view = _u[this.view],
              variable = valueOf(view.y),
              time = valueOf(view.time_agg),
              d = view.get.dataset(),
              y =
                ('number' === typeof time ? time - meta.times[d].range[0] : 0) -
                variables[variable].info[d].time_range[0],
              summary = Object.hasOwn(variables[variable], this.view)
                ? variables[variable][this.view].summaries[d]
                : false,
              ep = valueOf(this.palette).toLowerCase(),
              pn = Object.hasOwn(palettes, ep)
                ? ep
                : Object.hasOwn(palettes, site.settings.palette)
                ? site.settings.palette
                : defaults.palette,
              p = palettes[pn].colors
            this.parsed.summary = summary
            this.parsed.selected_summary = Object.hasOwn(variables[variable], this.view)
              ? variables[variable][this.view].selected_summaries[d]
              : false
            this.parsed.order = Object.hasOwn(variables[variable], this.view)
              ? variables[variable][this.view].selected_order[d][y]
              : false
            this.parsed.time = y
            this.parsed.color = variable
            if (view.valid && summary && y < summary.n.length) {
              this.integer =
                variable_info[variable] && variable_info[variable].type
                  ? patterns.int_types.test(variable_info[variable].type)
                  : true
              if (pn !== this.current_palette + site.settings.color_scale_center) {
                this.current_palette = pn + site.settings.color_scale_center
                this.parts.scale.innerHTML = ''
                if ('discrete' === palettes[pn].type) {
                  if (site.settings.color_by_order || 'none' === site.settings.color_scale_center) {
                    for (var i = 0, n = p.length; i < n; i++) {
                      this.parts.scale.appendChild(document.createElement('span'))
                      this.parts.scale.lastElementChild.setAttribute('of', this.id)
                      this.parts.scale.lastElementChild.style.backgroundColor = p[i]
                    }
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
                } else if ('continuous-polynomial' === palettes[pn].type) {
                  this.parts.scale.appendChild(document.createElement('div'))
                  this.parts.scale.appendChild(document.createElement('div'))
                  for (var i = 0, n = 256, v, e; i < n; i++) {
                    v = i / n
                    this.parts.scale[i < 129 ? 'firstElementChild' : 'lastElementChild'].appendChild(
                      (e = document.createElement('span'))
                    )
                    e.setAttribute('of', this.id)
                    e.style.backgroundColor =
                      'rgb(' + poly_channel(0, v, p) + ', ' + poly_channel(1, v, p) + ', ' + poly_channel(2, v, p) + ')'
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
              if (site.settings.color_by_order) {
                this.ticks.center.classList.add('hidden')
                this.ticks.min.firstElementChild.firstElementChild.innerText = '# ' + (summary.n[y] ? 1 : 0)
                this.ticks.max.firstElementChild.firstElementChild.innerText = '# ' + (summary.n[y] ? summary.n[y] : 0)
              } else {
                this.ticks.center.classList.remove('hidden')
                this.ticks.min.firstElementChild.firstElementChild.innerText = summary.n[y]
                  ? isFinite(summary.min[y])
                    ? format_value(summary.min[y], this.integer)
                    : 'unknown'
                  : 'unknown'
                this.ticks.max.firstElementChild.firstElementChild.innerText = summary.n[y]
                  ? isFinite(summary.max[y])
                    ? format_value(summary.max[y], this.integer)
                    : 'unknown'
                  : 'unknown'
                if ('none' !== site.settings.color_scale_center) {
                  this.ticks.center.firstElementChild.lastElementChild.innerText =
                    summary_levels[site.settings.summary_selection] + ' ' + site.settings.color_scale_center
                  this.ticks.center.firstElementChild.children[1].innerText = format_value(
                    summary[site.settings.color_scale_center][y]
                  )
                  this.ticks.center.style.left = summary['norm_' + site.settings.color_scale_center][y] * 100 + '%'
                } else {
                  this.ticks.center.firstElementChild.lastElementChild.innerText =
                    summary_levels[site.settings.summary_selection] + ' median'
                  this.ticks.center.firstElementChild.children[1].innerText = format_value(summary.median[y])
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
          },
          mouseover: function (e) {
            const s = this.parts.scale.getBoundingClientRect(),
              p = (Math.max(s.x, Math.min(s.x + s.width, e.clientX)) - s.x) / s.width
            var entity = false
            if (site.settings.color_by_order) {
              entity =
                entities[
                  this.parsed.order[
                    Math.max(
                      this.parsed.selected_summary.missing[this.parsed.time],
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
                n = this.parsed.selected_summary.missing[this.parsed.time]
                if (n < this.parsed.order.length) {
                  if (1 === this.parsed.order.length || !p) {
                    entity = entities[this.parsed.order[n][0]]
                  } else {
                    for (i = this.parsed.order.length - 2; i >= n; --i) {
                      if ((this.parsed.order[i][1] + this.parsed.order[i + 1][1]) / 2 <= tv) break
                    }
                    i++
                    entity = entities[this.parsed.order[i][0]]
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
            var s = site.credit_output && site.credit_output[o.id],
              k,
              e
            o.exclude = []
            o.add = {}
            o.exclude = s && s.exclude ? s.exclude : []
            o.add = s && s.add ? s.add : {}
            o.e.appendChild(document.createElement('ul'))
            for (k in site.credits)
              if (Object.hasOwn(site.credits, k) && -1 === o.exclude.indexOf(k)) {
                o.e.lastElementChild.appendChild((e = document.createElement('li')))
                if (Object.hasOwn(site.credits[k], 'url')) {
                  e.appendChild((e = document.createElement('a')))
                  e.href = site.credits[k].url
                  e.target = '_blank'
                  e.rel = 'noreferrer'
                }
                e.innerText = site.credits[k].name
                if (Object.hasOwn(site.credits[k], 'version')) {
                  e.appendChild(document.createElement('span'))
                  e.lastElementChild.className = 'version-tag'
                  e.lastElementChild.innerText = site.credits[k].version
                }
                if (Object.hasOwn(site.credits[k], 'description')) {
                  e.parentElement.appendChild(document.createElement('p'))
                  e.parentElement.lastElementChild.innerText = site.credits[k].description
                }
              }
          },
        },
      },
      check_funs = {
        '!': function (a) {
          return !a || -1 == a
        },
        '': function (a) {
          return !!a && -1 != a
        },
        '=': function (a, b) {
          return a === b
        },
        '!=': function (a, b) {
          return a != b
        },
        '>': function (a, b) {
          return a > b
        },
        '<': function (a, b) {
          return a < b
        },
        '>=': function (a, b) {
          return a >= b
        },
        '<=': function (a, b) {
          return a <= b
        },
        equals: function (s, e) {
          return !s || -1 == s || s === e
        },
        includes: function (s, e) {
          return !s || !s.length || -1 !== s.indexOf(e)
        },
        sort_a1: function (a, b) {
          return isNaN(a[1]) ? (isNaN(b[1]) ? 0 : -1) : isNaN(b[1]) ? 1 : a[1] - b[1]
        },
        sort_tree_children: function (a, b) {
          return !Object.hasOwn(tree, a.id) || !Object.hasOwn(tree, b.id)
            ? -Infinity
            : tree[a.id]._n.children - tree[b.id]._n.children
        },
      },
      data_retrievers = {
        single: function (v, t) {
          if (t < 0) return 'NA'
          if (variables[v].is_time) {
            return t < this.time.value.length ? this.time.value[t] : 'NA'
          } else {
            v = variables[v].code
            return 0 === t && Object.hasOwn(this.data, v) ? this.data[v] : 'NA'
          }
        },
        multi: function (v, t) {
          if (t < 0) return 'NA'
          if (variables[v].is_time) {
            return this.time.value[t]
          } else {
            v = variables[v].code
            return Object.hasOwn(this.data, v)
              ? 'object' === typeof this.data[v]
                ? t < this.data[v].length
                  ? this.data[v][t]
                  : 'NA'
                : 0 === t
                ? this.data[v]
                : 'NA'
              : 'NA'
          }
        },
        vector: function (r) {
          if (variables[r.variable].is_time) {
            return r.entity.time.value
          } else {
            const v = variables[r.variable].code
            return Object.hasOwn(r.entity.data, v)
              ? 'object' === typeof r.entity.data[v]
                ? r.entity.data[v]
                : [r.entity.data[v]]
              : ['NA']
          }
        },
        row_time: function (d, type, row) {
          const i = this.i - (row.offset - this.o)
          return d && i >= 0 && i < d.length ? ('number' === typeof d[i] ? format_value(d[i], row.int) : d[i]) : 'NA'
        },
      },
      value_types = {
        percent: function (v) {
          return v + '%'
        },
        'drive time': function (v) {
          return v + ' minutes'
        },
        dollar: function (v) {
          return '$' + v
        },
        'internet speed': function (v) {
          return v + ' MB/s'
        },
      },
      storage = window.localStorage || {
        setItem: function () {},
        getItem: function () {},
        removeItem: function () {},
      },
      page = {
        load_screen: document.getElementById('load_screen'),
        wrap: document.getElementById('site_wrap'),
        navbar: document.getElementsByClassName('navbar')[0],
        content: document.getElementsByClassName('content')[0],
        menus: document.getElementsByClassName('menu-wrapper'),
        panels: document.getElementsByClassName('panel'),
      },
      variables = {},
      variable_codes = {},
      variable_info = {},
      queue = {_timeout: 0},
      defaults = {time: 'time', dataview: 'default_view', palette: 'grey'},
      summary_levels = {dataset: 'Overall', filtered: 'Filtered', all: 'Selection'},
      data_queue = {},
      data_loaded = {},
      init_log = {},
      meta = {
        times: {},
        variables: {},
        retain_state: true,
      },
      subs = {},
      data_maps = {},
      entities = {},
      rule_conditions = {},
      _u = {},
      _c = {},
      tree = {}

    document.body.className =
      (window.localStorage && 'true' === window.localStorage.getItem('theme_dark')) || site.settings.theme_dark
        ? 'dark-theme'
        : 'light-theme'
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

    function poly_channel(ch, pos, coefs) {
      for (var v = coefs[0][ch] + pos * coefs[1][ch], i = 2, n = coefs.length; i < n; i++) {
        v += Math.pow(pos, i) * coefs[i][ch]
      }
      return Math.max(0, Math.min(256, v))
    }
    function pal(value, which, summary, index, rank, total) {
      const centered = 'none' !== site.settings.color_scale_center && !site.settings.color_by_order,
        fixed = 'discrete' === palettes[which].type,
        poly = 'continuous-polynomial' === palettes[which].type,
        colors = palettes[which].colors,
        string = Object.hasOwn(summary, 'levels'),
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
        if (!poly) {
          if (upper) v = 1 - v
          if (!centered) v *= 2
        }
      }
      return (string ? Object.hasOwn(summary.level_ids, value) : 'number' === typeof value)
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
            (poly
              ? poly_channel(0, v, colors) + ', ' + poly_channel(1, v, colors) + ', ' + poly_channel(2, v, colors)
              : upper
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
        : ''
    }

    function init_text(o, text) {
      if (!Object.hasOwn(text, 'button')) text.button = {}
      if ('string' === typeof text.text) text.text = [text.text]
      text.parts = document.createElement('span')
      for (var n = text.text.length, i = 0, p; i < n; i++) {
        if (Object.hasOwn(text.button, text.text[i])) {
          p = text.button[text.text[i]]
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
            if (Object.hasOwn(_u, p.target) && 'function' === typeof _u[p.target][p.type]) {
              text.parts.lastElementChild.setAttribute('aria-label', p.text.join(''))
              text.parts.lastElementChild.addEventListener('click', _u[p.target][p.type])
            }
          }
        } else {
          text.parts.appendChild(document.createElement('span'))
        }
      }
      if (Object.hasOwn(text, 'condition')) {
        for (i = text.condition.length; i--; )
          if (text.condition[i].id) {
            if ('default' === text.condition[i].id) {
              text.condition[i].check = function () {
                return true
              }
            } else {
              o.depends[text.condition[i].id] = ''
              text.condition[i].check = function () {
                return 'default' === this.id || check_funs[this.type](valueOf(this.id), valueOf(this.value))
              }.bind(text.condition[i])
            }
          }
      }
    }

    function format_value(v, int) {
      if (null === v) return 'unknown'
      if (!int && 'number' === typeof v) {
        if (site.settings.digits > 0) {
          const d = Math.pow(10, site.settings.digits),
            r = (Math.round(v * d) / d + '').split('.')
          return r[0] + ('.' + (1 === r.length ? '' : r[1]) + '0000000000').substring(0, site.settings.digits + 1)
        } else return Math.round(v)
      } else {
        return 'NA' === v ? 'unknown' : v
      }
    }

    function format_label(l) {
      return Object.hasOwn(variables, l) && variables[l].meta && variables[l].meta.short_name
        ? variables[l].meta.short_name
        : l.replace(patterns.seps, ' ').replace(patterns.word_start, function (w) {
            return w.toUpperCase()
          })
    }

    function fill_ids_options(u, d, out) {
      if (!Object.hasOwn(data_maps, d)) {
        data_queue[d][u.id] = function () {
          return fill_ids_options(u, d, out)
        }
        return
      }
      var s, k
      out[d] = {options: [], values: [], display: []}
      s = out[d].options
      u.values = out[d].values
      u.display = out[d].display
      for (k in entities)
        if (Object.hasOwn(entities, k) && d === entities[k].group) {
          s.push(u.add(k, entities[k].features.name))
          u.values.push(k)
          u.display.push(entities[k].features.name)
        }
      Object.hasOwn(site.url_options, u.id) ? u.set(site.url_options[u.id]) : u.reset()
    }

    function fill_variables_options(u, d, out) {
      var s, i, m, n, l
      out[d] = {options: [], values: [], display: []}
      s = out[d].options
      u.values = out[d].values
      u.display = out[d].display
      for (m = site.metadata.info[d].schema.fields, n = m.length, i = 0; i < n; i++) {
        l = format_label(m[i].name)
        s[i] = u.add(i, l, m[i])
        u.values.push(m[i].name)
        u.display.push(l)
      }
      Object.hasOwn(site.url_options, u.id) ? u.set(site.url_options[u.id]) : u.reset()
    }

    function fill_levels_options(u, d, v, out) {
      const m = variables[v].info[d],
        t = 'string' === m.type ? 'levels' : 'ids'
      var l = m[t],
        k,
        i,
        n,
        s
      if (l) {
        k = d + v
        if (Object.hasOwn(out, k)) {
          u.values = out[k].values
          u.display = out[k].display
          for (s = out[k].options, n = s.length, i = 0; i < n; i++) {
            if (s[i].length) {
              u.e.appendChild(s[i][0])
              u.e.appendChild(s[i][1])
            } else u.e.appendChild(s[i])
          }
        } else {
          out[k] = {options: [], values: [], display: []}
          s = out[k].options
          u.values = out[k].values
          u.display = out[k].display
          i = 0
          for (k in l)
            if (Object.hasOwn(l, k)) {
              s[i++] = u.add(l[k].id, l[k].name)
              u.values.push(l[k].id)
              u.display.push(l[k].name)
            }
        }
      } else if ('ids' === t) {
        data_queue[d][u.id] = function () {
          return fill_levels_options(u, d, v, out)
        }
      }
      Object.hasOwn(site.url_options, u.id) ? u.set(site.url_options[u.id]) : u.reset()
    }

    function add_dependency(id, o) {
      if (!Object.hasOwn(_c, id)) _c[id] = []
      _c[id].push(o)
      if (!Object.hasOwn(tree, id)) tree[id] = {_n: {children: 0, parents: 0}, children: {}, parents: {}}
      if (!Object.hasOwn(tree, o.id)) tree[o.id] = {_n: {children: 0, parents: 0}, children: {}, parents: {}}
      tree[id].children[o.id] = tree[o.id]
      tree[id]._n.children++
      tree[o.id].parents[id] = tree[id]
      tree[o.id]._n.parents++
      _c[id].sort(check_funs.sort_tree_children)
      request_queue(id)
    }

    function add_subs(id, o) {
      if (!Object.hasOwn(subs, id)) subs[id] = []
      subs[id].push(o)
    }

    function update_subs(id, fun, e) {
      if (Object.hasOwn(subs, id)) {
        for (var i = subs[id].length; i--; ) {
          if (Object.hasOwn(subs[id][i], fun)) subs[id][i][fun](e, _u[id])
        }
      }
    }

    function update_plot_theme(u) {
      if (u.dark_theme !== site.settings.theme_dark) {
        u.dark_theme = site.settings.theme_dark
        const s = getComputedStyle(document.body)
        if (!Object.hasOwn(u, 'style')) {
          u.style = u.options.layout
          if (!Object.hasOwn(u.style, 'font')) u.style.font = {}
          if (!Object.hasOwn(u.style, 'modebar')) u.style.modebar = {}
          if (!Object.hasOwn(u.style.xaxis, 'font')) u.style.xaxis.font = {}
          if (!Object.hasOwn(u.style.yaxis, 'font')) u.style.yaxis.font = {}
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
      if (e.data && Object.hasOwn(variables, u.parsed.x)) {
        const x = data_retrievers.vector({variable: u.parsed.x, entity: e}),
          y = data_retrievers.vector({variable: u.parsed.y, entity: e})
        for (
          var i = variables[u.parsed.x].info[u.parsed.dataset].n_times, ci, t = JSON.parse(u.traces[u.base_trace]);
          i--;

        ) {
          t.text[i] = e.features.name
          t.x[i] = u.parsed.x_range[0] <= i && i <= u.parsed.x_range[1] ? x[i - u.parsed.x_range[0]] : 'NA'
          t.y[i] = u.parsed.y_range[0] <= i && i <= u.parsed.y_range[1] ? y[i - u.parsed.y_range[0]] : 'NA'
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
            '#adadad'
        if ('bar' === t.type) t.marker.line.width = 0
        t.name = name || e.features.name
        t.id = e.features.id
        return t
      }
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

    function make_variable_reference(c) {
      for (
        var e = document.createElement('li'), s = '', i = c.author.length, j = 1 === i ? '' : 2 === i ? ' & ' : ', & ';
        i--;

      ) {
        s = (i ? j : '') + c.author[i].family + ', ' + c.author[i].given.substring(0, 1) + '.' + s
        j = ', '
      }
      e.innerHTML =
        s +
        ' (' +
        c.year +
        '). ' +
        c.title +
        '. <em>' +
        c.journal +
        (c.volume ? ', ' + c.volume : '') +
        '</em>' +
        (c.page ? ', ' + c.page : '') +
        '.' +
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

    function show_variable_info() {
      const v = _u[this.view],
        info = variable_info[valueOf(this.v || v.y)]
      var n, i
      page.modal.info.header.firstElementChild.innerText = info.short_name
      page.modal.info.title.innerText = info.long_name
      page.modal.info.description.innerText = info.long_description || info.description || info.short_description || ''
      page.modal.info.name.lastElementChild.innerText = info.measure || ''
      page.modal.info.type.lastElementChild.innerText = info.type || ''
      if (info.sources && info.sources.length) {
        page.modal.info.sources.lastElementChild.lastElementChild.innerHTML = ''
        page.modal.info.sources.classList.remove('hidden')
        for (n = info.sources.length, i = 0; i < n; i++) {
          page.modal.info.sources.lastElementChild.lastElementChild.appendChild(make_variable_source(info.sources[i]))
        }
      } else page.modal.info.sources.classList.add('hidden')
      if (info.citations && info.citations.length && 'string' !== typeof info.citations) {
        page.modal.info.references.lastElementChild.innerHTML = ''
        page.modal.info.references.classList.remove('hidden')
        if ('string' === typeof info.citations) info.citations = [info.citations]
        for (n = info.citations.length, i = 0; i < n; i++)
          if (variable_info._references && Object.hasOwn(variable_info._references, info.citations[i])) {
            page.modal.info.references.lastElementChild.appendChild(
              variable_info._references[info.citations[i]].element
            )
          }
      } else page.modal.info.references.classList.add('hidden')
    }

    function parse_variables(s, type, e, entity) {
      if ('statement' === type) {
        for (var m, v; (m = patterns.mustache.exec(s)); ) {
          if ('value' === m[1]) {
            v = entity
              ? format_value(entity.get_value(e.v, e.time), patterns.int_types.test(variable_info[e.v].type))
              : 'unknown'
            s = s.replace(
              m[0],
              'unknown' !== v && Object.hasOwn(value_types, variable_info[e.v].type)
                ? value_types[variable_info[e.v].type](v)
                : v
            )
            patterns.mustache.lastIndex = 0
          } else if (entity) {
            if (patterns.features.test(m[1])) {
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

    var k, i, e, c
    // get options from url
    k = window.location.search.replace('?', '')
    site.url_options = {}
    if (k) {
      e = k.split('&')
      for (i = e.length; i--; ) {
        c = e[i].split('=')
        if (c.length < 2) c.push('true')
        c[1] = patterns.bool.test(c[1]) ? 'true' === c[1] : c[1].replace(patterns.url_spaces, ' ')
        site.url_options[c[0]] = c[1]
        if (patterns.settings.test(c[0])) storage.setItem(c[0].replace(patterns.settings, ''), c[1])
      }
    }

    // prepare embedded view
    if (Object.hasOwn(site.url_options, 'embedded') || Object.hasOwn(site.url_options, 'hide_navbar')) {
      if (!Object.hasOwn(site.url_options, 'hide_logo')) site.url_options.hide_logo = true
      if (!Object.hasOwn(site.url_options, 'hide_title')) site.url_options.hide_title = true
      if (!Object.hasOwn(site.url_options, 'hide_navcontent')) site.url_options.hide_navcontent = true
      if (!Object.hasOwn(site.url_options, 'hide_panels')) site.url_options.hide_panels = true
      if (Object.hasOwn(site.url_options, 'embedded') && !Object.hasOwn(site.url_options, 'close_menus'))
        site.url_options.close_menus = true
    }
    e = document.getElementsByClassName('navbar')[0]
    if (e) {
      if (Object.hasOwn(site.url_options, 'navcolor')) {
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
    for (k in site.settings)
      if (Object.hasOwn(storage, k)) {
        c = storage.getItem(k)
        if (patterns.bool.test(c)) {
          c = 'true' === c
        } else if (patterns.number.test(c)) c = parseFloat(c)
        site.settings[k] = c
      }
    if (site && site.metadata) map_variables()

    window.onload = function () {
      var k, i, e, c, p, ci, n, o
      page.navbar = document.getElementsByClassName('navbar')[0]
      page.navbar = page.navbar ? page.navbar.getBoundingClientRect() : {height: 0}
      page.content = document.getElementsByClassName('content')[0]
      page.menus = document.getElementsByClassName('menu-wrapper')
      page.panels = document.getElementsByClassName('panel')
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
      }
      page.load_screen = document.getElementById('load_screen')
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

      for (i = page.panels.length; i--; ) {
        page.content_bounds[page.panels[i].classList.contains('panel-left') ? 'left' : 'right'] =
          page.panels[i].getBoundingClientRect().width
        page.panels[i].style.marginTop = page.content_bounds.top + 'px'
      }
      for (i = page.menus.length; i--; ) {
        page.menus[i].state = page.menus[i].getAttribute('state')
        if (page.menus[i].classList.contains('menu-top')) {
          page.top_menu = page.menus[i]
          page.top_menu.style.left = page.content_bounds.left + 'px'
          page.top_menu.style.right = page.content_bounds.right + 'px'
          if (page.menus[i].lastElementChild.tagName === 'BUTTON') {
            page.menus[i].lastElementChild.addEventListener(
              'click',
              page.menu_toggler.toggle.bind(page.menus[i].lastElementChild, 'top')
            )
            page.menus[i].lastElementChild.style.top = page.content_bounds.top + 'px'
          }
        } else if (page.menus[i].classList.contains('menu-right')) {
          page.right_menu = page.menus[i]
          page.right_menu.style.right = page.content_bounds.right + 'px'
          if (page.menus[i].lastElementChild.tagName === 'BUTTON') {
            page.menus[i].lastElementChild.addEventListener(
              'click',
              page.menu_toggler.toggle.bind(page.menus[i].lastElementChild, 'right')
            )
            page.menus[i].lastElementChild.style.top = page.content_bounds.top + 'px'
          }
        } else if (page.menus[i].classList.contains('menu-bottom')) {
          page.bottom_menu = page.menus[i]
          page.content_bounds.bottom = 40
          page.bottom_menu.style.left = page.content_bounds.left + 'px'
          page.bottom_menu.style.right = page.content_bounds.right + 'px'
          if (page.menus[i].lastElementChild.tagName === 'BUTTON') {
            page.menus[i].lastElementChild.addEventListener(
              'click',
              page.menu_toggler.toggle.bind(page.menus[i].lastElementChild, 'bottom')
            )
          }
        } else if (page.menus[i].classList.contains('menu-left')) {
          page.left_menu = page.menus[i]
          page.left_menu.style.left = page.content_bounds.left + 'px'
          if (page.menus[i].lastElementChild.tagName === 'BUTTON') {
            page.menus[i].lastElementChild.addEventListener(
              'click',
              page.menu_toggler.toggle.bind(page.menus[i].lastElementChild, 'left')
            )
            page.menus[i].lastElementChild.style.top = page.content_bounds.top + 'px'
          }
        }
        if (site.url_options.close_menus && 'open' === page.menus[i].state) page.menus[i].lastElementChild.click()
      }

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
        for (k in site.dataviews)
          if (Object.hasOwn(site.dataviews, k)) {
            defaults.dataview = k
            break
          }
      } else {
        site.dataviews = {}
        site.dataviews[defaults.dataview] = {dataset: defaults.dataset}
      }
      for (c = document.getElementsByClassName('auto-input'), i = c.length, n = 0; i--; ) {
        e = c[i]
        o = {
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
          dataset: e.getAttribute('dataset') || defaults.dataset,
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
        o.settings = Object.hasOwn(site, o.type) && Object.hasOwn(site[o.type], o.id) ? site[o.type][o.id] : {}
        o.wrapper = o.e.parentElement.classList.contains('wrapper')
          ? o.e.parentElement
          : o.e.parentElement.parentElement
        if (o.wrapper) {
          if (o.note) o.wrapper.classList.add('has-note')
          o.wrapper.setAttribute('of', o.id)
          for (p = o.wrapper.getElementsByTagName('div'), n = p.length; n--; ) p[n].setAttribute('of', o.id)
          for (p = o.wrapper.getElementsByTagName('label'), n = p.length; n--; ) p[n].setAttribute('of', o.id)
          for (p = o.wrapper.getElementsByTagName('fieldset'), n = p.length; n--; ) p[n].setAttribute('of', o.id)
          for (p = o.wrapper.getElementsByTagName('legend'), n = p.length; n--; ) p[n].setAttribute('of', o.id)
          for (p = o.wrapper.getElementsByTagName('input'), n = p.length; n--; ) p[n].setAttribute('of', o.id)
          for (p = o.wrapper.getElementsByTagName('button'), n = p.length; n--; ) p[n].setAttribute('of', o.id)
        }
        if (o.note) {
          o.wrapper.addEventListener('mouseover', tooltip_trigger.bind(o))
          p = 'DIV' !== o.e.tagName ? o.e : o.e.getElementsByTagName('input')[0]
          if (p) {
            p.addEventListener('focus', tooltip_trigger.bind(o))
            p.addEventListener('blur', tooltip_clear)
          }
        }
        if ('-1' !== o.default && patterns.number.test(o.default)) o.default = Number(o.default)
        if (Object.hasOwn(elements, o.type)) {
          p = elements[o.type]
          if (p.init) p.init(o)
          o.options = o.type === 'select' ? o.e.children : o.e.getElementsByTagName('input')
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
      }

      // initialize variables
      if (site.variables && site.variables.length) {
        for (n = site.variables.length; n--; ) {
          k = site.variables[n].id
          _u[k] = {
            id: k,
            type: 'virtual',
            source: site.variables[n].default,
            previous: void 0,
            default: site.variables[n].default,
            current_index: -1,
            values: [],
            states: site.variables[n].states,
            update: function () {
              this.source = void 0
              for (var p, r, c, i = this.states.length; i--; ) {
                for (c = this.states[i].condition.length, p = true; c--; ) {
                  r = this.states[i].condition[c]
                  if (check_funs[r.type](valueOf(r.id), valueOf(r.value))) {
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
              } else if (Object.hasOwn(_u, this.source)) {
                r = _u[this.source].value()
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
              } else {
                if (Object.hasOwn(_u, this.source) && -1 !== _u[this.source].values.indexOf(v)) {
                  _u[this.source].set(v)
                }
              }
              request_queue(this.id)
            },
          }
          if (_u[k].source) _u[k].values.push(_u[k].source)
          for (p = {}, i = _u[k].states.length; i--; ) {
            _u[k].values.push(_u[k].states[i].value)
            for (ci = _u[k].states[i].condition.length; ci--; ) {
              if (!Object.hasOwn(p, _u[k].states[i].condition[ci].id)) {
                p[_u[k].states[i].condition[ci].id] = {type: 'update', id: k}
              }
            }
          }
          for (k in p) if (Object.hasOwn(p, k)) add_dependency(k, p[k])
        }
      }

      // initialize rules
      if (site.rules && site.rules.length) {
        for (ci = site.rules.length; ci--; ) {
          for (k in site.rules[ci].effects)
            if ('display' === k) {
              site.rules[ci].effects[k] = {e: document.getElementById(site.rules[ci].effects[k])}
              e = site.rules[ci].effects[k].e.getElementsByClassName('auto-input')
              if (e.length) site.rules[ci].effects[k].u = _u[e[0].id]
            }
          for (e = site.rules[ci].condition, n = e.length, i = 0; i < n; i++) {
            if (Object.hasOwn(check_funs, e[i].type)) {
              e[i].check = function () {
                return check_funs[this.type](valueOf(this.id), valueOf(this.value))
              }.bind(e[i])
              if (Object.hasOwn(_u, e[i].id)) {
                add_dependency(e[i].id, {type: 'rule', id: e[i].id, condition: e[i], rule: ci})
                if (!Object.hasOwn(rule_conditions, e[i].id)) rule_conditions[e[i].id] = {}
                rule_conditions[e[i].id][ci] = site.rules[ci]
              }
              if (e[i].check()) {
                for (k in site.rules[ci].effects)
                  if (Object.hasOwn(_u, k)) _u[k].set(valueOf(site.rules[ci].effects[k]))
              } else if (e[i].default) {
                for (k in site.rules[ci].effects) if (Object.hasOwn(_u, k)) _u[k].set(valueOf(e[i].default))
              }
            }
          }
        }
      }

      window.addEventListener('resize', content_resize)

      if (site && site.data) {
        queue_init()
      } else if (site && site.metadata.datasets) {
        site.data = {}
        if ('string' === typeof site.metadata.datasets) site.metadata.datasets = [site.metadata.datasets]
        for (i = site.metadata.datasets.length; i--; ) {
          data_loaded[site.metadata.datasets[i]] = false
          load_data(site.metadata.datasets[i], site.metadata.info[site.metadata.datasets[i]].site_file)
        }
      } else {
        queue_init()
        drop_load_screen()
      }

      if (page.load_screen) {
        init_log.load_screen = setTimeout(drop_load_screen, 3000)
      } else {
        page.wrap.style.visibility = 'visible'
      }
    }

    function drop_load_screen() {
      clearTimeout(init_log.load_screen)
      page.wrap.style.visibility = 'visible'
      page.load_screen.style.display = 'none'
    }

    function content_resize() {
      page.content.style.top =
        (page.top_menu && 'open' === page.top_menu.state
          ? page.top_menu.getBoundingClientRect().height
          : page.content_bounds.top +
            (!page.top_menu ||
            page.bottom_menu ||
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
      var s = '',
        k,
        v
      for (k in _u)
        if (Object.hasOwn(_u, k) && _u[k].input && !patterns.settings.test(k)) {
          v = _u[k].value()
          if ('' !== v && null != v && '-1' != v) s += (s ? '&' : '?') + k + '=' + v
        }
      return window.location.protocol + '//' + window.location.host + window.location.pathname + s
    }

    function init() {
      var k, i, e, c, n, o, cond, v
      defaults.dataset = site.metadata.datasets[0]

      // initialize inputs
      for (k in _u)
        if (Object.hasOwn(_u, k) && Object.hasOwn(elements, _u[k].type)) {
          o = _u[k]
          // resolve options
          if (o.options_source) {
            if (patterns.palette.test(o.options_source)) {
              for (v in palettes) if (Object.hasOwn(palettes, v)) o.add(v, palettes[v].name)
              o.options = o.e.getElementsByTagName(o.type === 'select' ? 'option' : 'input')
              o.reset()
            } else if (patterns.datasets.test(o.options_source)) {
              for (i = site.metadata.datasets.length; i--; ) {
                o.add(i, site.metadata.datasets[i], format_label(site.metadata.datasets[i]))
              }
              o.options = o.e.getElementsByTagName(o.type === 'select' ? 'option' : 'input')
            } else {
              o.option_sets = {}
              v = valueOf(o.dataset) || defaults.dataset
              if (Object.hasOwn(site.metadata.info, v)) {
                if (patterns.ids.test(o.options_source)) {
                  fill_ids_options(o, v, o.option_sets)
                } else if (patterns.variable.test(o.options_source)) {
                  fill_variables_options(o, v, o.option_sets)
                } else if (patterns.levels.test(o.options_source) && Object.hasOwn(variables, o.variable)) {
                  fill_levels_options(o, v, o.variable, o.option_sets)
                }
              }
              if (o.depends) add_dependency(o.depends, {type: 'options', id: o.id})
              if (Object.hasOwn(_u, o.dataset)) add_dependency(o.dataset, {type: 'options', id: o.id})
              if (o.view) add_dependency(o.view, {type: 'options', id: o.id})
            }
          }
          // retrieve option values
          if ('number' === o.type) {
            o.min = o.e.getAttribute('min')
            o.min_ref = parseFloat(o.min)
            o.max = o.e.getAttribute('max')
            o.max_ref = parseFloat(o.max)
            o.ref = isNaN(o.min_ref) || isNaN(o.max_ref)
            o.range = [o.min_ref, o.max_ref]
            o.step = parseFloat(o.e.step) || 1
            o.parsed = {min: undefined, max: undefined}
            o.depends = {}
            o.update = function () {
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
                  : Object.hasOwn(variables, min)
                  ? variables[min].info[d || variables[min].datasets[0]].min
                  : parseFloat(min)
                : this.min_ref
              this.parsed.max = isNaN(this.max_ref)
                ? 'undefined' === typeof max
                  ? view.time_range.time[1]
                  : 'number' === typeof max
                  ? max
                  : Object.hasOwn(variables, max)
                  ? variables[max].info[d || variables[max].datasets[0]].max
                  : parseFloat(max)
                : this.min_ref
              if (this.ref && variable && Object.hasOwn(variables, variable)) {
                this.range[0] =
                  this.e.min =
                  v =
                    isNaN(this.min_ref) ? Math.max(view.time_range.time[0], this.parsed.min) : this.min_ref
                this.range[1] =
                  this.e.max =
                  v =
                    isNaN(this.max_ref) ? Math.min(view.time_range.time[1], this.parsed.max) : this.max_ref
                if (!this.depends[view.y]) {
                  this.depends[view.y] = true
                  add_dependency(view.y, {type: 'update', id: this.id})
                }
                if (this.variable && variable !== this.variable) this.reset()
                if (variables[variable][this.view].summaries[d].filled) this.variable = variable
              } else {
                this.e.min = this.parsed.min
                if (this.parsed.min > this.source || (!this.source && 'min' === this.default)) this.set(this.parsed.min)
                this.e.max = this.parsed.max
                if (this.parsed.max < this.source || (!this.source && 'max' === this.default)) this.set(this.parsed.max)
              }
            }.bind(o)
            if (o.view) add_dependency(o.view, {type: 'update', id: o.id})
            if (o.max && !Object.hasOwn(variables, o.max)) {
              if (Object.hasOwn(_u, o.max)) {
                add_dependency(o.max, {type: 'max', id: o.id})
              } else o.e.max = parseFloat(o.max)
            } else if (o.view) {
              add_dependency(o.view + '_time', {type: 'max', id: o.id})
            }
            if (o.min && !Object.hasOwn(variables, o.min)) {
              if (Object.hasOwn(_u, o.min)) {
                add_dependency(o.min, {type: 'min', id: o.id})
              } else o.e.min = parseFloat(o.min)
            } else if (o.view) {
              add_dependency(o.view + '_time', {type: 'min', id: o.id})
            }
            if (!o.view) o.view = defaults.dataview
            if (null != typeof o.default) {
              if (patterns.number.test(o.default)) {
                o.default = Number(o.default)
              } else
                o.reset = function () {
                  if ('max' === this.default) {
                    if (this.range) this.set(valueOf(this.range[1]))
                  } else if ('min' === this.default) {
                    if (this.range) this.set(valueOf(this.range[0]))
                  } else if (Object.hasOwn(_u, this.default)) {
                    this.set(valueOf(this.default))
                  }
                }.bind(o)
            }
            if (o.variable) {
              if (Object.hasOwn(_u, o.variable)) {
                add_dependency(o.variable, {type: 'update', id: o.id})
              } else if (Object.hasOwn(variables, o.variable)) {
                o.e.min = o.min = o.parsed.min = o.range[0] = variables[o.variable].info[defaults.dataset].min
                o.e.max = o.max = o.parsed.max = o.range[1] = variables[o.variable].info[defaults.dataset].max
              }
            }
          } else {
            if (!o.values.length)
              for (i = o.options.length; i--; ) {
                o.values[i] = o.options[i].value
                o.display[i] = format_label(o.options[i].innerText.trim() || o.values[i])
              }
            if ('checkbox' === o.type) {
              o.source = []
              o.current_index = []
              o.default = o.default.split(',')
              if (o.options.length)
                for (i = o.options.length; i--; ) {
                  o.values[i] = o.options[i].value
                }
            } else if (o.values.length && !Object.hasOwn(_u, o.default) && -1 === o.values.indexOf(o.default)) {
              o.default = parseInt(o.default)
              o.default = o.values.length > o.default ? o.values[o.default] : ''
            }
          }
          // add listeners
          if ('select' === o.type || 'number' === o.type) {
            o.e.addEventListener('input', o.listen)
            if (
              o.e.parentElement.lastElementChild &&
              o.e.parentElement.lastElementChild.classList.contains('select-reset')
            ) {
              o.e.parentElement.lastElementChild.addEventListener('click', o.reset)
            }
            if (Object.hasOwn(site, o.type) && Object.hasOwn(site[o.type], o.id)) {
              o.filters = site[o.type][o.id]
              o.current_filter = {}
              for (c in o.filters)
                if (Object.hasOwn(o.filters, c) && Object.hasOwn(_u, o.filters[c])) {
                  add_dependency(o.filters[c], {type: 'filter', id: o.id})
                }
              o.filter = function () {
                var k, i, pass, last
                for (k in this.filters)
                  if (Object.hasOwn(this.filters, k)) {
                    this.current_filter[k] = valueOf(this.filters[k])
                  }
                for (i = this.values.length; i--; ) {
                  pass = false
                  if (Object.hasOwn(variables, this.values[i]) && Object.hasOwn(variables[this.values[i]], 'meta')) {
                    for (k in this.current_filter)
                      if (Object.hasOwn(variables[this.values[i]].meta, k)) {
                        pass = variables[this.values[i]].meta[k] === this.current_filter[k]
                        if (!pass) break
                      }
                  }
                  if (pass) last = this.values[i]
                  this.options[i].classList[pass ? 'remove' : 'add']('hidden')
                }
                this.current_index = this.values.indexOf(this.value())
                if (
                  last &&
                  (-1 === this.current_index || this.options[this.current_index].classList.contains('hidden'))
                ) {
                  this.set(last)
                }
              }.bind(o)
            }
          } else if ('switch' === o.type) {
            if ('boolean' !== typeof o.default) o.default = o.e.checked
            o.e.addEventListener('change', o.listen)
          } else {
            for (i = o.options.length; i--; ) o.options[i].addEventListener('click', o.listen)
          }
          // initialize settings inputs
          if (patterns.settings.test(o.id)) {
            o.setting = o.id.replace(patterns.settings, '')
            if (null == o.default && Object.hasOwn(site.settings, o.setting)) o.default = site.settings[o.setting]
            add_dependency(o.id, {type: 'setting', id: o.id})
          }
          v = site.url_options[o.id] || storage.getItem(o.id.replace(patterns.settings, ''))
          if (v) {
            if (patterns.bool.test(v)) v = 'true' === v
            o.set(v)
          } else o.reset && o.reset()
        }
      // initialize dataviews
      for (k in site.dataviews)
        if (Object.hasOwn(site.dataviews, k)) {
          _u[k] = e = site.dataviews[k]
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
          if (e.palette && 'string' === typeof e.palette && Object.hasOwn(_u, e.palette)) {
            add_dependency(e.palette, {type: 'dataview', id: k})
          }
          if (e.dataset && 'string' === typeof e.dataset && Object.hasOwn(_u, e.dataset)) {
            add_dependency(e.dataset, {type: 'dataview', id: k})
          }
          if (e.ids && 'string' === typeof e.ids && Object.hasOwn(_u, e.ids)) {
            add_dependency(e.ids, {type: 'dataview', id: k})
          }
          e.time_range = {variable: '', index: [], time: [], filtered: []}
          add_dependency(k, {type: 'time_range', id: k})
          if (Object.hasOwn(_u, e.x)) {
            add_dependency(e.x, {type: 'time_range', id: k})
          }
          if (Object.hasOwn(_u, e.y)) {
            add_dependency(e.y, {type: 'time_range', id: k})
          }
          for (cond in e.features)
            if (Object.hasOwn(e.features, cond)) {
              if ('string' === typeof e.features[cond] && Object.hasOwn(_u, e.features[cond])) {
                add_dependency(e.features[cond], {type: 'dataview', id: k})
              }
            }
          if (e.variables)
            for (i = e.variables.length; i--; ) {
              if (Object.hasOwn(e.variables[i], 'variable')) {
                if (Object.hasOwn(_u, e.variables[i].variable)) {
                  add_dependency(e.variables[i].variable, {type: 'dataview', id: k})
                }
              } else e.variables.splice(i, 1)
              if (Object.hasOwn(e.variables[i], 'type')) {
                if (Object.hasOwn(_u, e.variables[i].type)) {
                  add_dependency(e.variables[i].type, {type: 'dataview', id: k})
                }
              } else e.variables[i].type = '='
              if (Object.hasOwn(e.variables[i], 'value')) {
                if (Object.hasOwn(_u, e.variables[i].value)) {
                  add_dependency(e.variables[i].value, {type: 'dataview', id: k})
                }
              } else e.variables[i].value = 0
            }
          compile_dataview(e)
          conditionals.dataview(e)
          e.reparse()
        }
      // initialize outputs
      for (c = document.getElementsByClassName('auto-output'), i = c.length, n = 0; i--; ) {
        e = c[i]
        o = {
          type: e.getAttribute('auto-type'),
          view: e.getAttribute('data-view') || defaults.dataview,
          id: e.id || 'out' + n++,
          note: e.getAttribute('aria-description') || '',
          reference_options: {},
          e: e,
        }
        if (o.note) o.e.addEventListener('mouseover', tooltip_trigger.bind(o))
        o.options = Object.hasOwn(site, o.type) ? site[o.type][o.id] : void 0
        if (Object.hasOwn(elements, o.type)) {
          if (Object.hasOwn(elements[o.type], 'update')) o.update = elements[o.type].update.bind(o)
        }
        if (o.options) {
          if (Object.hasOwn(o.options, 'options')) o.options = o.options.options
          for (k in o.options)
            if (Object.hasOwn(o.options, k) && Object.hasOwn(_u, o.options[k])) o.reference_options[k] = o.options[k]
          if (Object.hasOwn(o.options, 'subto')) {
            if ('string' === typeof o.options.subto) o.options.subto = [o.options.subto]
            for (v = o.options.subto.length; v--; ) add_subs(o.options.subto[v], o)
          }
        }
        _u[o.id] = o
        if (o.view) {
          if (!Object.hasOwn(_c, o.view)) _c[o.view] = []
          if (!Object.hasOwn(_c, o.view + '_filter')) _c[o.view + '_filter'] = []
        }
        if (Object.hasOwn(elements, o.type) && Object.hasOwn(elements[o.type], 'init')) {
          if (!o.view || Object.hasOwn(init_log, _u[o.view].parsed.dataset)) {
            elements[o.type].init(o)
          } else {
            data_queue[_u[o.view].parsed.dataset][o.id] = elements[o.type].init.bind(null, o)
          }
        }
      }
    }

    function valueOf(v) {
      v = 'string' === typeof v && Object.hasOwn(_u, v) ? _u[v] : v
      if (v && v.value) {
        v = valueOf(v.value())
      }
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

    function add_layer_listeners(feature, layer) {
      layer.on({
        mouseover: elements.map.mouseover.bind(this),
        mouseout: elements.map.mouseout.bind(this),
        click: elements.map.click.bind(this),
      })
    }

    async function retrieve_layer(u, source) {
      if (Object.hasOwn(site.map._raw, source.url)) {
        process_layer(source, u)
      } else {
        const f = new window.XMLHttpRequest()
        f.onreadystatechange = function (u) {
          if (4 === f.readyState && 200 === f.status) {
            site.map._raw[source.url] = f.responseText
            process_layer(this, u)
          }
        }.bind(source, u)
        f.open('GET', source.url, true)
        f.send()
      }
    }

    function process_layer(source, u) {
      var k, l, p, f, id
      site.map[u.id]._layers[source.name] = L.geoJSON(JSON.parse(site.map._raw[source.url]), {
        onEachFeature: add_layer_listeners.bind(u),
      })
      init_log[source.name + '_map'] = true
      for (k in site.map[u.id]._layers[source.name]._layers)
        if (Object.hasOwn(site.map[u.id]._layers[source.name]._layers, k)) {
          l = site.map[u.id]._layers[source.name]._layers[k]
          l.setStyle({weight: 0, fillOpacity: 0})
          l.source = source
          p = l.feature.properties
          id = p[source.id_property]
          if (!Object.hasOwn(entities, id) && patterns.leading_zeros.test(id))
            id = p[source.id_property] = id.replace(patterns.leading_zeros, '')
          if (Object.hasOwn(entities, id)) {
            if (!Object.hasOwn(entities[id], 'layer')) entities[id].layer = {}
            entities[id].layer[u.id] = l
          } else {
            entities[id] = {layer: {}, features: {id: id}}
            entities[id].layer[u.id] = l
          }
          l.entity = entities[id]
          for (f in p)
            if (Object.hasOwn(p, f) && !Object.hasOwn(entities[id].features, f)) {
              if (
                'name' === f.toLowerCase() &&
                (!Object.hasOwn(entities[id].features, 'name') ||
                  entities[id].features.id === entities[id].features.name)
              ) {
                entities[id].features[f.toLowerCase()] = p[f]
              } else {
                entities[id].features[f] = p[f]
              }
            }
        } else {
          throw new Error('retrieve_layer failed: ' + f.responseText)
        }
      if (site.map._waiting && site.map._waiting[source.name]) {
        for (var i = site.map._waiting[source.name].length; i--; )
          if (u.id !== site.map._waiting[source.name][i]) {
            request_queue(site.map._waiting[source.name][i])
          }
      }
    }

    function quantile(p, n, o, x) {
      var a = p * (n - 1),
        ap = a % 1,
        bp = 1 - ap,
        b = o + Math.ceil(a)
      a = o + Math.floor(a)
      return x[a][1] * ap + x[b][1] * bp
    }

    async function init_summaries(view) {
      view = view || defaults.dataview
      var m, o, v, vi, d, y, i, l, k, da, ev, ny, n, at, c
      for (v in variables)
        if (Object.hasOwn(variables, v)) {
          vi = variables[v]
          c = vi.code
          if (!Object.hasOwn(vi, view))
            vi[view] = {order: {}, selected_order: {}, selected_summaries: {}, summaries: {}}
          m = vi[view]
          for (d in vi.info) {
            if (Object.hasOwn(vi.info, d)) {
              vi.info[d].n_times = ny = vi.info[d].time_range[1] - vi.info[d].time_range[0] + 1
              if (Object.hasOwn(site.data, d) && !Object.hasOwn(vi.info[d], 'order')) {
                vi.info[d].order = o = []
                for (y = ny; y--; ) {
                  o.push([])
                }
                da = site.data[d]
                n = site.metadata.info[d].entity_count
                at = !n || n > 65535 ? Uint32Array : n > 255 ? Uint16Array : Uint8Array
                for (k in da)
                  if ('_meta' !== k && Object.hasOwn(da, k) && Object.hasOwn(da[k], c)) {
                    ev = da[k][c]
                    if (1 === ny) {
                      o[0].push([k, ev])
                    } else {
                      for (y = ny; y--; ) {
                        o[y].push([k, ev[y]])
                      }
                    }
                    if (!Object.hasOwn(entities, k)) {
                      entities[k] = {rank: {}, subset_rank: {}}
                    }
                    entities[k].rank[v] = new at(ny)
                    entities[k].subset_rank[v] = new at(ny)
                  }
                for (y = ny; y--; ) {
                  ev = o[y]
                  ev.sort(check_funs.sort_a1)
                  Object.freeze(ev)
                  for (i = ev.length; i--; ) {
                    entities[ev[i][0]].rank[v][y] = i
                  }
                }
                Object.freeze(o)
              }
              if (!Object.hasOwn(m.summaries, d)) {
                m.order[d] = []
                m.selected_order[d] = []
                m.selected_summaries[d] = {n: [], missing: []}
                if ('string' === vi.info[d].type) {
                  m.table = {}
                  for (l in vi.levels_ids)
                    if (Object.hasOwn(vi.levels_ids, l)) {
                      m.table[l] = []
                      for (y = ny; y--; ) m.table[l].push(0)
                    }
                  m.summaries[d] = {
                    filled: false,
                    missing: [],
                    n: [],
                    mode: [],
                    level_ids: vi.levels_ids,
                    levels: vi.levels,
                  }
                  for (y = ny; y--; ) {
                    m.order[d].push([])
                    m.selected_order[d].push([])
                    m.summaries[d].missing.push(0)
                    m.summaries[d].n.push(0)
                    m.summaries[d].mode.push('')
                  }
                } else {
                  m.summaries[d] = {
                    filled: false,
                    missing: [],
                    n: [],
                    sum: [],
                    max: [],
                    q3: [],
                    mean: [],
                    range: [],
                    norm_median: [],
                    break_median: [],
                    lower_median_min: [],
                    lower_median_range: [],
                    upper_median_min: [],
                    upper_median_range: [],
                    norm_mean: [],
                    break_mean: [],
                    lower_mean_min: [],
                    lower_mean_range: [],
                    upper_mean_min: [],
                    upper_mean_range: [],
                    median: [],
                    q1: [],
                    min: [],
                  }
                  for (y = ny; y--; ) {
                    m.order[d].push([])
                    m.selected_order[d].push([])
                    m.selected_summaries[d].n.push(0)
                    m.selected_summaries[d].missing.push(0)
                    m.summaries[d].missing.push(0)
                    m.summaries[d].n.push(0)
                    m.summaries[d].sum.push(0)
                    m.summaries[d].max.push(-Infinity)
                    m.summaries[d].q3.push(0)
                    m.summaries[d].mean.push(0)
                    m.summaries[d].norm_median.push(0)
                    m.summaries[d].break_median.push(-1)
                    m.summaries[d].lower_median_min.push(-1)
                    m.summaries[d].lower_median_range.push(-1)
                    m.summaries[d].upper_median_min.push(-1)
                    m.summaries[d].upper_median_range.push(-1)
                    m.summaries[d].norm_mean.push(0)
                    m.summaries[d].break_mean.push(-1)
                    m.summaries[d].lower_mean_min.push(-1)
                    m.summaries[d].lower_mean_range.push(-1)
                    m.summaries[d].upper_mean_min.push(-1)
                    m.summaries[d].upper_mean_range.push(-1)
                    m.summaries[d].median.push(0)
                    m.summaries[d].q1.push(0)
                    m.summaries[d].min.push(Infinity)
                  }
                }
                Object.seal(m.order[d])
                Object.seal(m.selected_order[d])
                Object.seal(m.selected_summaries[d])
                Object.seal(m.summaries[d])
              }
            }
          }
        }
    }

    async function calculate_summary(measure, view, full) {
      if (!Object.hasOwn(variables[measure], view))
        variables[measure][view] = JSON.parse(JSON.stringify(variables[measure][defaults.dataview]))
      const v = site.dataviews[view],
        s = v.selection[site.settings.summary_selection],
        a = v.selection.all,
        dataset = v.get.dataset(),
        m = variables[measure][view],
        mo = m.order[dataset],
        mso = m.selected_order[dataset],
        mss = m.selected_summaries[dataset],
        ms = m.summaries[dataset],
        ny = variables[measure].info[dataset].n_times,
        order = variables[measure].info[dataset].order,
        levels = variables[measure].levels_ids,
        subset = v.n_selected.all !== v.n_selected.dataset
      for (var i, k, value, en, l, o, y = ny, rank, bmd, bme, n; y--; ) {
        mo[y] = subset ? [] : order[y]
        mso[y] = subset ? [] : order[y]
        mss.missing[y] = 0
        mss.n[y] = 0
        ms.missing[y] = 0
        ms.n[y] = 0
        if (levels) {
          ms.mode[y] = ''
          for (k in levels) if (Object.hasOwn(levels, k)) m.table[k][y] = 0
        } else {
          ms.sum[y] = 0
          ms.mean[y] = 0
          ms.max[y] = -Infinity
          ms.min[y] = Infinity
          ms.break_mean[y] = -1
          ms.break_median[y] = -1
        }
      }
      for (y = 0; y < ny; y++) {
        o = order[y]
        for (i = o.length, rank = v.n_selected[site.settings.summary_selection]; i--; ) {
          k = o[i][0]
          value = o[i][1]
          if (Object.hasOwn(s, k)) {
            en = s[k]
            if (!y) {
              if (!Object.hasOwn(en.summary, measure)) en.summary[measure] = {n: 0, overall: ms, order: mo}
              en.summary[measure].n = 0
            }
            en.subset_rank[measure][y] = --rank
            if (full && subset) {
              mo[y].splice(0, 0, o[i])
              if (Object.hasOwn(a, k)) {
                mso[y].splice(0, 0, o[i])
                if (levels ? Object.hasOwn(levels, value) : 'number' === typeof value) {
                  mss.n[y]++
                } else mss.missing[y]++
              }
            }
            if (levels ? Object.hasOwn(levels, value) : 'number' === typeof value) {
              en.summary[measure].n++
              ms.n[y]++
              if (levels) {
                m.table[value][y]++
              } else {
                ms.sum[y] += value
                if (value > ms.max[y]) ms.max[y] = value
                if (value < ms.min[y]) ms.min[y] = value
              }
            } else ms.missing[y]++
          }
        }
      }
      if (full) {
        for (y = 0; y < ny; y++) {
          o = mo[y]
          if (levels) {
            if (ms.n[y]) {
              l = 0
              for (k in m.table)
                if (Object.hasOwn(m.table, k)) {
                  if (m.table[k][y] > m.table[variables[measure].levels[l]][y]) l = levels[k]
                }
              ms.mode[y] = variables[measure].levels[l]
            } else ms.mode[y] = NaN
          } else {
            if (ms.n[y]) {
              ms.mean[y] = ms.sum[y] / ms.n[y]
              if (!isFinite(ms.min[y])) ms.min[y] = ms.mean[y]
              if (!isFinite(ms.max[y])) ms.max[y] = ms.mean[y]
              ms.range[y] = ms.max[y] - ms.min[y]
              if (1 === ms.n[y]) {
                ms.q3[y] = ms.median[y] = ms.q1[y] = null == o[0][1] ? ms.mean[y] : o[0][1]
              } else {
                ms.median[y] = quantile(0.5, ms.n[y], ms.missing[y], o)
                ms.q3[y] = quantile(0.75, ms.n[y], ms.missing[y], o)
                ms.q1[y] = quantile(0.25, ms.n[y], ms.missing[y], o)
              }
              for (i = ms.missing[y], n = o.length, bmd = false, bme = false; i < n; i++) {
                if (!bmd && o[i][1] > ms.median[y]) {
                  ms.break_median[y] = i - 1
                  bmd = true
                }
                if (!bme && o[i][1] > ms.mean[y]) {
                  ms.break_mean[y] = i - 1
                  bme = true
                }
                if (bmd && bme) break
              }
            } else {
              ms.max[y] = 0
              ms.q3[y] = 0
              ms.median[y] = 0
              ms.q1[y] = 0
              ms.min[y] = 0
            }
            if (ms.n[y]) {
              ms.norm_median[y] = ms.range[y] ? (ms.median[y] - ms.min[y]) / ms.range[y] : ms.median[y]
              if (-1 !== ms.break_median[y]) {
                ms.lower_median_min[y] = ms.norm_median[y] - (o[ms.missing[y]][1] - ms.min[y]) / ms.range[y]
                ms.lower_median_range[y] =
                  ms.norm_median[y] - ((o[ms.break_median[y]][1] - ms.min[y]) / ms.range[y] - ms.lower_median_min[y])
                ms.upper_median_min[y] = ms.norm_median[y] - (o[ms.break_median[y]][1] - ms.min[y]) / ms.range[y]
                ms.upper_median_range[y] =
                  (o[o.length - 1][1] - ms.min[y]) / ms.range[y] - ms.norm_median[y] - ms.upper_median_min[y]
              }
              ms.norm_mean[y] = ms.range[y] ? (ms.mean[y] - ms.min[y]) / ms.range[y] : ms.mean[y]
              if (-1 !== ms.break_mean[y]) {
                ms.lower_mean_min[y] = ms.norm_mean[y] - (o[ms.missing[y]][1] - ms.min[y]) / ms.range[y]
                ms.lower_mean_range[y] =
                  ms.norm_mean[y] - ((o[ms.break_mean[y]][1] - ms.min[y]) / ms.range[y] - ms.lower_mean_min[y])
                ms.upper_mean_min[y] = ms.norm_mean[y] - (o[ms.break_mean[y]][1] - ms.min[y]) / ms.range[y]
                ms.upper_mean_range[y] =
                  (o[o.length - 1][1] - ms.min[y]) / ms.range[y] - ms.norm_mean[y] - ms.upper_mean_min[y]
              }
            }
          }
        }
      } else {
        for (y = 0; y < ny; y++) {
          if (ms.n[y]) {
            if (levels) {
              q1 = 0
              for (k in m.table)
                if (Object.hasOwn(m.table, k)) {
                  if (m.table[k][y] > m.table[variables[measure].levels[q1]][y]) q1 = levels[k]
                }
              ms.mode[y] = variables[measure].levels[q1]
            } else ms.mean[y] = ms.sum[y] / ms.n[y]
          } else {
            ms[levels ? 'mode' : 'mean'][y] = NaN
          }
        }
      }
      ms.filled = true
    }

    async function load_id_maps() {
      var ids, i, f, k, has_map
      for (k in site.metadata.info)
        if (Object.hasOwn(site.data, k)) {
          for (ids = site.metadata.info[k].ids, i = ids.length, has_map = false; i--; )
            if (Object.hasOwn(ids[i], 'map')) {
              has_map = true
              if (Object.hasOwn(data_maps, ids[i].map)) {
                if (data_maps[ids[i].map].retrieved) {
                  site.metadata.info[k].schema.fields[i].ids = data_maps[k] = Object.hasOwn(
                    data_maps[ids[i].map].resource,
                    k
                  )
                    ? data_maps[ids[i].map].resource[k]
                    : data_maps[ids[i].map].resource
                  map_entities(k)
                } else {
                  if (-1 === data_maps[ids[i].map].queue.indexOf(k)) data_maps[ids[i].map].queue.push(k)
                }
              } else if ('string' !== typeof ids[i].map || ids[i].map_content) {
                if (ids[i].map_content) {
                  data_maps[ids[i].map] = {queue: [], resource: JSON.parse(ids[i].map_content), retrieved: true}
                  site.metadata.info[k].schema.fields[i].ids = data_maps[k] = Object.hasOwn(
                    data_maps[ids[i].map].resource,
                    k
                  )
                    ? data_maps[ids[i].map].resource[k]
                    : data_maps[ids[i].map].resource
                } else {
                  data_maps[k] = ids[i].map
                }
                map_entities(k)
              } else {
                data_maps[ids[i].map] = {queue: [k], resource: {}, retrieved: false}
                f = new window.XMLHttpRequest()
                f.onreadystatechange = function (url, fi) {
                  if (4 === f.readyState) {
                    if (200 === f.status) {
                      data_maps[url].resource = JSON.parse(f.responseText)
                      data_maps[url].retrieved = true
                      for (var k, i = data_maps[url].queue.length; i--; ) {
                        k = data_maps[url].queue[i]
                        if (Object.hasOwn(site.metadata.info, k) && site.metadata.info[k].schema.fields.length > fi) {
                          site.metadata.info[k].schema.fields[fi].ids = data_maps[k] = Object.hasOwn(
                            data_maps[url].resource,
                            k
                          )
                            ? data_maps[url].resource[k]
                            : data_maps[url].resource
                          map_entities(k)
                        }
                      }
                      for (k in _c)
                        if (Object.hasOwn(_c, k)) {
                          request_queue(k)
                        }
                    } else {
                      throw new Error('load_id_maps failed: ' + f.responseText)
                    }
                  }
                }.bind(null, ids[i].map, i)
                f.open('GET', ids[i].map, true)
                f.send()
              }
            }
          if (!has_map) {
            data_maps[k] = {}
            map_entities(k)
          }
        }
    }

    function map_variables() {
      var k, v, i, t, m, l
      for (k in site.metadata.info)
        if (Object.hasOwn(site.metadata.info, k)) {
          data_queue[k] = {}
          m = site.metadata.info[k]
          m.id_vars = []
          for (v = m.schema.fields, i = m.ids.length; i--; ) m.id_vars.push(m.ids[i].variable)
          for (i = v.length; i--; ) {
            if (Object.hasOwn(variables, v[i].name)) {
              variables[v[i].name].datasets.push(k)
              variables[v[i].name].info[k] = v[i]
              if ('string' === v[i].type) {
                for (l in v[i].table)
                  if (Object.hasOwn(v[i].table, l) && !Object.hasOwn(variables[v[i].name].levels_ids, l)) {
                    variables[v[i].name].levels_ids[l] = variables[v[i].name].levels.length
                    variables[v[i].name].levels.push(l)
                  }
              }
            } else {
              variables[v[i].name] = {datasets: [k], info: {}}
              variables[v[i].name].info[k] = v[i]
              variables[v[i].name].type = v[i].type
              if ('string' === v[i].type) {
                variables[v[i].name].levels = []
                variables[v[i].name].levels_ids = {}
                for (l in v[i].table)
                  if (Object.hasOwn(v[i].table, l)) {
                    variables[v[i].name].levels_ids[l] = variables[v[i].name].levels.length
                    variables[v[i].name].levels.push(l)
                  }
              }
              variables[v[i].name].meta = variables[v[i].name].info[k].info
              if (!variables[v[i].name].meta)
                variables[v[i].name].meta = {
                  full_name: v[i].name,
                  measure: v[i].name.split(':')[1],
                  short_name: format_label(v[i].name),
                  type: 'integer',
                }
              variables[v[i].name].meta.full_name = v[i].name
              if (!Object.hasOwn(variables[v[i].name].meta, 'measure'))
                variables[v[i].name].meta.measure = v[i].name.split(':')[1] || v[i].name
              if (!Object.hasOwn(variables[v[i].name].meta, 'short_name'))
                variables[v[i].name].meta.short_name = format_label(v[i].name)
              if (!Object.hasOwn(variables[v[i].name].meta, 'long_name'))
                variables[v[i].name].meta.long_name = variables[v[i].name].meta.short_name
              if (!Object.hasOwn(variable_info, v[i].name)) variable_info[v[i].name] = variables[v[i].name].meta
            }
          }
          if (Object.hasOwn(m, '_references')) {
            if (!Object.hasOwn(variable_info, '_references')) variable_info._references = {}
            for (t in m._references)
              if (Object.hasOwn(m._references, t))
                variable_info._references[t] = {
                  reference: m._references[t],
                  element: make_variable_reference(m._references[t]),
                }
          }
        }
    }

    async function map_entities(g) {
      var id,
        f,
        k,
        overwrite = false
      if (Object.hasOwn(site.data, g) && !init_log[g]) {
        if (Object.hasOwn(site.data[g], '_meta')) {
          if (Object.hasOwn(variables, site.data[g]._meta.time.name)) {
            meta.times[g] = site.data[g]._meta.time
            meta.times[g].info = variables[meta.times[g].name]
            meta.times[g].info.is_time = true
            if ('object' !== typeof meta.times[g].value) meta.times[g].value = [meta.times[g].value]
            meta.times[g].n = meta.times[g].value.length
            meta.times[g].is_single = 1 === meta.times[g].n
            meta.times[g].range = [meta.times[g].value[0], meta.times[g].value[meta.times[g].n - 1]]
          } else {
            meta.times[g] = {value: [0], n: 1, range: [0, 0], name: defaults.time, is_single: true}
          }
          meta.variables[g] = site.data[g]._meta.variables || {}
          for (k in meta.variables[g])
            if (Object.hasOwn(variables, k)) {
              variables[k].name = k
              variables[k].code = meta.variables[g][k]
              variable_codes[variables[k].code] = variables[k]
            }
          delete site.data[g]._meta
        }
        for (id in site.data[g]) {
          if (Object.hasOwn(site.data[g], id)) {
            overwrite = data_maps[g][id]
            f = overwrite || {id: id, name: id}
            f.id = id
            if (Object.hasOwn(entities, id)) {
              entities[id].group = g
              entities[id].data = site.data[g][id]
              entities[id].variables = variable_info
              if (!Object.hasOwn(entities[id], 'features')) entities[id].features = {}
              for (k in f)
                if ('id' === k || (Object.hasOwn(f, k) && (overwrite || !Object.hasOwn(entities[id].features, k))))
                  entities[id].features[k] = f[k]
              entities[id].summary = {}
              if (!Object.hasOwn(entities[id], 'rank')) {
                entities[id].rank = {}
                entities[id].subset_rank = {}
              }
            } else {
              entities[id] = {
                group: g,
                data: site.data[g][id],
                variables: variable_info,
                features: f,
                summary: {},
                rank: {},
                subset_rank: {},
              }
            }
            entities[id].time = meta.times[g]
            entities[id].get_value = data_retrievers[meta.times[g].is_single ? 'single' : 'multi'].bind(entities[id])
            if (f && Object.hasOwn(f, 'district') && id.length > 4) {
              f.county = id.substring(0, 5)
            }
          }
        }
        init_log[g] = true
        init_summaries().then(function () {
          if (!init_log.first) {
            init()
            init_log.first = true
          }
          for (id in data_queue[g])
            if (Object.hasOwn(data_queue[g], id)) {
              _u[id].state = false
              data_queue[g][id]()
              delete data_queue[g][id]
            }
          clearTimeout(init_log.load_screen)
          setTimeout(drop_load_screen, 250)
          content_resize()
        })
      }
    }

    function compile_dataview(v) {
      var i
      v.times = []
      if (v.time_filters) {
        for (i = v.time_filters.length; i--; )
          if (Object.hasOwn(_u, v.time_filters[i].value)) {
            add_dependency(v.time_filters[i].value, {type: 'time_filters', id: v.id})
          }
      }
      v.selection = {ids: {}, features: {}, variables: [], dataset: {}, filtered: {}, all: {}}
      v.n_selected = {ids: 0, features: 0, variables: 0, dataset: 0, filtered: 0, all: 0}
      v.get = {
        dataset: function () {
          return (
            valueOf(
              'string' === typeof v.dataset && Object.hasOwn(_u, v.dataset) ? _u[v.dataset].value() : v.dataset
            ) || defaults.dataset
          )
        },
        ids: function () {
          return valueOf('string' === typeof v.ids && Object.hasOwn(_u, v.ids) ? _u[v.ids].value() : v.ids)
        },
        features: function () {
          var s = '',
            k
          if (v.features)
            for (k in v.features)
              if (Object.hasOwn(v.features, k)) {
                s += k + valueOf(v.features[k])
              }
          return s
        },
        variables: function () {
          if (v.variables) {
            if (!v.parsed.variable_values.length) v.reparse()
            for (var s = '', i = v.parsed.variable_values.length; i--; )
              s +=
                v.parsed.variable_values[i].name +
                v.parsed.variable_values[i].operator +
                v.parsed.variable_values[i].value
            return s
          } else return ''
        },
        time_filters: function () {
          var s = ''
          if (v.time_filters && v.time_filters.length) {
            for (i = v.time_filters.length; i--; )
              s += Object.hasOwn(_u, v.time_filters[i].value)
                ? valueOf(v.time_filters[i].value)
                : v.time_filters[i].value
          }
          return s
        },
      }
      v.ids_check =
        'object' === typeof v.get.ids()
          ? check_funs.includes
          : function (a, b) {
              return !a || -1 == a || a === b || (b && a.length > 2 && a === b.substring(0, a.length))
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
        this.parsed.time_agg = Object.hasOwn(meta.times, this.parsed.dataset)
          ? valueOf(this.time_agg) - meta.times[this.parsed.dataset].range[0]
          : 0
        if (
          'string' === typeof this.ids &&
          Object.hasOwn(_u, this.ids) &&
          (('virtual' === _u[this.ids].type && Object.hasOwn(_u, _u[this.ids].source)) ||
            (Object.hasOwn(_u[this.ids], 'depends') && Object.hasOwn(_u, _u[this.ids].depends)))
        ) {
          this.parsed.id_source =
            'virtual' === _u[this.ids].type
              ? valueOf(_u[_u[this.ids].source].dataset)
              : _u[_u[this.ids].depends].value()
        }
        if (this.features) {
          this.parsed.feature_values = {}
          for (var k in this.features)
            if (Object.hasOwn(this.features, k)) {
              this.parsed.feature_values[k] = {value: valueOf(this.features[k])}
              this.parsed.feature_values[k].operator =
                'string' === typeof this.parsed.feature_values[k].value ? 'equals' : 'includes'
            }
          this.parsed.features = this.get.features()
        } else this.parsed.features = ''
        if (this.variables) {
          this.parsed.variable_values = []
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
        Object.hasOwn(_u, v.ids) &&
        (('virtual' === _u[v.ids].type && Object.hasOwn(_u, _u[v.ids].source)) ||
          (Object.hasOwn(_u[v.ids], 'depends') && Object.hasOwn(_u, _u[v.ids].depends)))
          ? 'virtual' === _u[v.ids].type
            ? function (e) {
                return (
                  e.features &&
                  this.ids_check(
                    this.parsed.ids,
                    e.features[
                      !this.parsed.id_source ||
                      e.group === this.parsed.id_source ||
                      !Object.hasOwn(e.features, this.parsed.id_source)
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
                    Object.hasOwn(e.features, this.parsed.id_source)
                      ? valueOf(e.features[this.parsed.id_source])
                      : e.features.id
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
              if (Object.hasOwn(this.parsed.feature_values, k)) {
                v = this.parsed.feature_values[k]
                pass = check_funs[v.operator](v.value, valueOf(e.features[k]))
                if (!pass) break
              }
            }
            return pass
          } else return true
        }.bind(v),
        variables: function (e) {
          if (e.data) {
            for (var i = this.parsed.variable_values.length, pass = true, v, ev; i--; ) {
              v = this.parsed.variable_values[i]
              ev = e.get_value(v.name, this.parsed.time_agg - variables[v.name].info[this.parsed.dataset].time_range[0])
              pass = v.value_type !== typeof ev || check_funs[v.operator](v.value, ev)
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
          variables: !this.variables || this.checks.variables(e),
          dataset: !this.dataset || this.checks.dataset(e),
        }
      }.bind(v)
    }

    function clear_storage() {
      if (window.localStorage) window.localStorage.clear()
      window.location.reload()
    }

    function global_update() {
      meta.retain_state = false
      for (var k in _u) if (Object.hasOwn(_u, k)) request_queue(k)
    }

    function global_reset() {
      meta.retain_state = false
      for (var k in _u)
        if (Object.hasOwn(_u, k) && !_u[k].setting && _u[k].reset) {
          _u[k].reset()
          request_queue(k)
        }
    }

    function request_queue(id) {
      queue[id] = true
      clearTimeout(queue._timeout)
      queue._timeout = setTimeout(run_queue, 20)
      meta.lock_after = id
    }

    function run_queue() {
      clearTimeout(queue._timeout)
      var k, s
      for (k in queue)
        if ('_timeout' !== k && Object.hasOwn(queue, k) && queue[k]) {
          queue[k] = false
          refresh_conditions(k)
        }
      k = get_options_url()
      if (init_log.first && k !== site.state) {
        site.state = k
        for (s in site.url_options)
          if (Object.hasOwn(site.url_options, s) && patterns.embed_setting.test(s))
            k +=
              '&' +
              s +
              '=' +
              ('navcolor' === s ? site.url_options[s].replace(patterns.hashes, '%23') : site.url_options[s])
        if (!site.settings.hide_url_parameters) {
          window.history.replaceState(Date.now(), '', k)
        }
        setTimeout(content_resize, 50)
      }
    }

    function refresh_conditions(id) {
      if (Object.hasOwn(_c, id)) {
        var c = _u[id],
          d = _c[id],
          i,
          ci,
          n,
          r = [],
          pass,
          k,
          ch,
          v = c && c.value() + ''
        if (c && (!meta.retain_state || c.state !== v)) {
          c.state = v
          for (i = d.length; i--; ) {
            if ('rule' === d[i].type) {
              if (-1 === r.indexOf(d[i].rule)) {
                r.push(site.rules[d[i].rule])
              }
            } else {
              if ('function' === typeof _u[d[i].id][d[i].type]) {
                _u[d[i].id][d[i].type]()
              } else {
                conditionals[d[i].type](_u[d[i].id], c)
              }
            }
          }
          for (i = r.length; i--; ) {
            for (n = r[i].condition.length, ci = 0; ci < n; ci++) {
              pass = r[i].condition[ci].check()
              if (r[i].condition[ci].any ? pass : !pass) break
            }
            for (k in r[i].effects)
              if (pass) {
                if (k === 'display') {
                  r[i].effects[k].e.classList.remove('hidden')
                } else if (Object.hasOwn(_u, k)) {
                  _u[k].set(valueOf(r[i].effects[k]))
                }
              } else if (k === 'display') {
                r[i].effects[k].e.classList.add('hidden')
                if (r[i].effects[k].u) r[i].effects[k].u.reset()
                for (ch = r[i].effects[k].e.getElementsByClassName('auto-input'), ci = ch.length; ci--; ) {
                  if (Object.hasOwn(_u, ch[ci].id)) _u[ch[ci].id].reset()
                }
              } else if (Object.hasOwn(r[i], 'default')) {
                if (Object.hasOwn(_u, k)) {
                  _u[k].set(valueOf(r[i].default))
                }
              }
          }
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
        this.displaying = L.featureGroup().addTo(this.map)
        this.tiles = {}
        var k, i
        if (Object.hasOwn(site.map, this.id)) {
          site.map[this.id].u = this
          if (site.map[this.id].tiles) {
            if (site.map[this.id].tiles.url) {
              this.tiles[theme] = L.tileLayer(site.map[this.id].tiles.url, site.map[this.id].tiles.options)
              this.tiles[theme].addTo(this.map)
            } else {
              for (k in site.map[this.id].tiles)
                if (Object.hasOwn(site.map[this.id].tiles, k)) {
                  this.tiles[k] = L.tileLayer(site.map[this.id].tiles[k].url, site.map[this.id].tiles[k].options)
                  if (theme === k) this.tiles[k].addTo(this.map)
                }
            }
          }
          if (!Object.hasOwn(site.map, '_raw')) site.map._raw = {}
          if (!Object.hasOwn(site.map[this.id], '_layers')) site.map[this.id]._layers = {}
          for (i = site.map[this.id].shapes.length; i--; ) {
            if (!site.map[this.id].shapes[i].name)
              site.map[this.id].shapes[i].name = site.metadata.datasets[i < site.metadata.datasets.length ? i : 0]
            retrieve_layer(this, site.map[this.id].shapes[i])
          }
        }
      } else {
        this.deferred = true
        setTimeout(queue_init_map.bind(this), showing ? 0 : 2000)
      }
    }

    function queue_init_datatable() {
      const showing = this.deferred || !this.tab || this.tab.classList.contains('show')
      if (showing && window.jQuery && window.DataTable && Object.hasOwn(site.dataviews[this.view], 'get')) {
        this.options.columns = this.header
        this.table = $(this.e).DataTable(this.options)
        this.update()
      } else {
        this.deferred = true
        setTimeout(queue_init_datatable.bind(this), showing ? 0 : 2000)
      }
    }

    function queue_init() {
      if ('loading' !== document.readyState) {
        load_id_maps()
      } else {
        setTimeout(queue_init, 10)
      }
    }

    async function load_data(name, url) {
      var f = new window.XMLHttpRequest()
      f.onreadystatechange = function () {
        if (4 === f.readyState) {
          if (200 === f.status) {
            site.data[name] = JSON.parse(f.responseText)
            data_loaded[name] = true
            if (site.settings.partial_init) {
              queue_init()
            } else {
              for (var k in data_loaded) if (Object.hasOwn(data_loaded, k) && !data_loaded[k]) return void 0
              queue_init()
            }
          } else {
            throw new Error('load_data failed: ' + f.responseText)
          }
        }
      }
      f.open('GET', url, true)
      f.send()
    }
  }

  if ('undefined' === typeof module) {
    community(window, document, site)
  } else module.exports = community
})()
