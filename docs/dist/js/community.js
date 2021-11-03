void (function () {
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
      // from https://colorbrewer2.org
      divergent: ['#762a83', '#af8dc3', '#e7d4e8', '#d9f0d3', '#7fbf7b', '#1b7837'],
      reds: ['#f1eef6', '#d7b5d8', '#df65b0', '#dd1c77', '#980043'],
      greens: ['#ffffcc', '#c2e699', '#78c679', '#31a354', '#006837'],
      greys: ['#f7f7f7', '#cccccc', '#969696', '#525252'],
      cats: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c'],
    },
    patterns = {
      seps: /[\s._-]/g,
      word_start: /\b(\w)/g,
      datasets: /^dat/,
      variables: /^var/,
      levels: /^lev/,
      minmax: /^m[inax]{2}$/,
    },
    conditionals = {
      options: function (u, c) {
        var v,
          i,
          s,
          n,
          ns,
          k,
          d = valueOf(u.dataset) || valueOf(c.dataset),
          va = valueOf(u.variable)
        if (!Object.hasOwn(u, 'option_sets')) u.option_sets = {}
        u.e.innerHTML = ''
        if (c && Object.hasOwn(u.option_sets, (k = d + (va ? va : '')))) {
          u.values = u.option_sets[k].values
          u.display = u.option_sets[k].display
          if (u.view && 'ID' === u.variable) {
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
          u.e[ns < 2 ? 'setAttribute' : 'removeAttribute']('disabled', true)
        } else if (Object.hasOwn(_u, u.depends)) {
          if (patterns.variables.test(u.options_source)) {
            d = c.value()
            if (d) fill_variables_options(u, d, u.option_sets)
          } else if (patterns.levels.test(u.options_source)) {
            fill_levels_options(u, d, va, u.option_sets)
          }
        }
        u.set(u.value())
      },
      map_colors: function (u) {
        const v = site.dataviews[u.view],
          c = valueOf(u.color || v.y),
          d = v.get.dataset(),
          ys = u.time
            ? _u[u.time]
            : v.time_agg
            ? Object.hasOwn(_u, v.time_agg)
              ? _u[v.time_agg]
              : 'last' === v.time_agg && c
              ? variables[c][u.view].summaries[d].time_range[1]
              : parseInt(v.time_agg)
            : 0
        if (c && Object.hasOwn(v, 'get')) {
          var l,
            y = ys.parsed ? ys.value() - ys.parsed.min : 0,
            s = v.selection.all,
            k
          if (Object.hasOwn(site.maps, d) && Object.hasOwn(variables[c], u.view)) {
            l = variables[c][u.view].summaries[d]
            for (k in s)
              if (Object.hasOwn(s, k))
                if (Object.hasOwn(variables[c], u.view)) {
                  if (s[k].layer) {
                    s[k].layer.setStyle({
                      fillOpacity: 0.7,
                      color: '#000000',
                      fillColor: pal(s[k].data[c][y], v.palette, l, y),
                      weight: 1,
                    })
                  }
                }
          } else {
            if (!Object.hasOwn(site.maps, '_waiting')) site.maps._waiting = {}
            if (!Object.hasOwn(site.maps._waiting, d)) site.maps._waiting[d] = []
            if (-1 === site.maps._waiting[d].indexOf(c.id)) site.maps._waiting[d].push(c.id)
            if (-1 === site.maps._waiting[d].indexOf(u.view)) site.maps._waiting[d].push(u.view)
          }
        }
      },
      map_shapes: function (u) {
        if (u.view && u.displaying) {
          u.displaying.clearLayers()
          var s = site.dataviews[u.view].selection.all,
            k,
            n = 0
          if (s)
            for (k in s)
              if (Object.hasOwn(s, k)) {
                if (s[k].layer) {
                  n++
                  s[k].layer.addTo(u.displaying)
                }
              }
          if (n) u.map.flyToBounds(u.displaying.getBounds())
        }
      },
      min: function (u, c) {
        var cv = c.value(),
          uv = u.value(),
          v = _u[u.view],
          variable
        if (patterns.minmax.test(cv)) cv = c.parsed.min
        if (v && v.time_range) {
          variable = valueOf(v.y)
          if (Object.hasOwn(variables, variable)) {
            if (!v.time_range.time.length) conditionals.time_range(v, u, true)
            cv = Math.max(v.time_range.time[0], parseFloat(cv))
          }
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
          v = _u[u.view],
          variable
        if (patterns.minmax.test(cv)) cv = c.parsed.max
        if (v && v.y) {
          variable = valueOf(v.y)
          if (Object.hasOwn(variables, variable)) {
            if (!v.time_range.time.length) conditionals.time_range(v, u, true)
            cv = Math.min(v.time_range.time[1], parseFloat(cv))
          }
        }
        u.e.max = 'undefined' === typeof u.parsed.max ? parseFloat(cv) : Math.min(u.parsed.max, parseFloat(cv))
        if (!u.e.value) {
          u.reset()
        } else if ('number' === typeof uv && isFinite(uv) && uv > cv) {
          u.set(cv)
        }
      },
      dataview: function (f) {
        if (!f.check) compile_dataview(f)
        f.n_selected.ids = 0
        f.n_selected.features = 0
        f.n_selected.dataset = 0
        f.n_selected.all = 0
        f.selection.ids = {}
        f.selection.features = {}
        f.selection.dataset = {}
        f.selection.all = {}
        var c,
          k,
          id,
          first_all = ''
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
            if (c.dataset) {
              f.selection.dataset[id] = entities[id]
              f.n_selected.dataset++
              c.all++
            }
            if (3 === c.all) {
              if (!first_all) first_all = id
              f.selection.all[id] = entities[id]
              f.n_selected.all++
            }
          }
        if (first_all) {
          for (k in variables) if (Object.hasOwn(f.selection.all[first_all].data, k)) calculate_summary(k, f.id, true)
          update_subs(f.id, 'update')
        }
        request_queue(f.id)
      },
      time_filters: function (u) {
        u.time_range.filtered[0] = Infinity
        u.time_range.filtered[1] = -Infinity
        const s = variables[u.time][u.id].summaries[u.get.dataset()],
          c = _c[u.id + '_filter']
        for (var f, v = {}, pass, i = s.mean.length; i--; ) {
          if (i >= u.time_range.index[0] && i <= u.time_range.index[1]) {
            for (f = u.time_filters.length, pass = false; f--; ) {
              if (!Object.hasOwn(v, u.time_filters[f].value))
                v[u.time_filters[f].value] = valueOf(u.time_filters[f].value)
              pass = check_funs[u.time_filters[f].type](s.mean[i], v[u.time_filters[f].value])
              if (!pass) break
            }
          } else pass = false
          u.times[i] = pass
          if (pass) {
            if (u.time_range.filtered[0] > s.mean[i]) u.time_range.filtered[0] = s.mean[i]
            if (u.time_range.filtered[1] < s.mean[i]) u.time_range.filtered[1] = s.mean[i]
          }
        }
        if (c)
          for (var i = c.length; i--; ) {
            if ('update' === c[i].type) {
              _u[c[i].id].update()
            } else if (Object.hasOwn(conditionals, c[i].type)) {
              conditionals[c[i].type](_u[c[i].id], u)
            }
          }
      },
      time_range: function (u, c, passive) {
        const v = c.value(),
          d = u.get.dataset(),
          t = variables[valueOf(u.time)].info[d].min,
          s = _c[u.id + '_time']
        var r = variables[Object.hasOwn(variables, v) ? v : valueOf(u.y)]
        if (r) {
          r = r[u.id].summaries[d].time_range
          u.time_range.index[0] = r[0]
          u.time_range.time[0] = t + r[0]
          u.time_range.index[1] = r[1]
          u.time_range.time[1] = t + r[1]
          if (!passive && s)
            for (var i = s.length; i--; ) {
              if ('min' === s[i].type) {
                if (isFinite(u.time_range.time[0]) && parseFloat(_u[s[i].id].e.min) !== u.time_range.time[0]) {
                  _u[s[i].id].e.min = u.time_range.time[0]
                  _u[s[i].id].set(u.time_range.time[0])
                }
              } else if ('max' === s[i].type) {
                if (isFinite(u.time_range.time[1]) && parseFloat(_u[s[i].id].e.min) !== u.time_range.time[0]) {
                  _u[s[i].id].e.max = u.time_range.time[1]
                  _u[s[i].id].set(u.time_range.time[1])
                }
              }
            }
        }
      },
    },
    elements = {
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
            for (var i = v.length; i--; ) {
              this.source.push(this.values[i])
              this.current_index.push(i)
            }
          } else {
            if ('string' === typeof v) {
              const i = this.values.indexOf(v)
              if (-1 !== i) this.options[i].checked = true
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
      number: {
        retrieve: function () {
          this.set(this.e.value)
        },
        setter: function (v) {
          this.previous = this.value()
          if ('string' === typeof v) v = parseFloat(v)
          if (isFinite(v) && v !== this.previous) {
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
      select: {
        retrieve: function () {
          this.set(this.e.selectedIndex)
        },
        setter: function (v) {
          if ('string' === typeof v) {
            v = this.values.indexOf(v)
          }
          this.e.selectedIndex = v
          this.source = this.values[v]
          request_queue(this.id)
        },
        listener: function (e) {
          this.set(e.target.selectedIndex)
        },
        adder: function (value, display) {
          var e = document.createElement('option')
          e.value = value
          e.innerText = display
          this.e.appendChild(e)
          return e
        },
      },
      plot: {
        mouseover: function (d) {
          if (d.points && d.points.length === 1 && this.e.data[d.points[0].fullData.index]) {
            this.e.data[d.points[0].fullData.index].line.width = 4
            Plotly.react(this.e, this.e.data, this.e.layout)
            update_subs(this.id, 'show', entitiesByName[d.points[0].text])
          }
        },
        mouseout: function (d) {
          if (d.points && d.points.length === 1 && this.e.data[d.points[0].fullData.index]) {
            this.e.data[d.points[0].fullData.index].line.width = 2
            Plotly.react(this.e, this.e.data, this.e.layout)
            update_subs(this.id, 'revert', entitiesByName[d.points[0].text])
          }
        },
        click: function (d) {
          this.clickto.set(d.points[0].data.id)
        },
        update: function () {
          if (this.e.layout) {
            const v = _u[this.view],
              s = v.selection && v.selection.all
            if (s && v.n_selected.all) {
              this.parsed.x = valueOf(this.x)
              this.parsed.y = valueOf(this.y)
              var k,
                b,
                traces = [],
                summary = variables[this.parsed.y][this.view].summaries[v.get.dataset()]
              for (k in s)
                if (Object.hasOwn(s, k)) {
                  traces.push(make_data_entry(this, s[k]))
                }
              if (Object.hasOwn(this.traces, 'box') && s[k]) {
                traces.push((b = JSON.parse(this.traces.box)))
                b.x = s[k].data[this.parsed.x]
                b.upperfence = summary.max
                b.q3 = summary.q3
                b.median = summary.median
                b.q1 = summary.q1
                b.lowerfence = summary.min
              }
              if ('boolean' !== typeof this.e.layout.yaxis.title)
                this.e.layout.yaxis.title = format_label(this.parsed.y)
              if ('boolean' !== typeof this.e.layout.xaxis.title)
                this.e.layout.xaxis.title = format_label(this.parsed.x)
              if (this.parsed.x === meta.time_variable) {
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
            }
          }
        },
      },
      map: {
        mouseover: function (e) {
          e.target.setStyle({
            color: '#ffffff',
          })
          e.target.bringToFront()
          update_subs(this.id, 'show', entities[e.target.feature.properties.id])
        },
        mouseout: function (e) {
          update_subs(this.id, 'revert')
          e.target.setStyle({
            color: '#000000',
          })
        },
        click: function (e) {
          this.clickto.set(e.target.feature.properties.id)
        },
      },
      info: {
        update: function (entity) {
          var p, k, i, v
          if (entity) {
            // hover information
            p = this.temp.children
            p[0].innerText = entity.features.name
            for (i = p[1].childElementCount; i--; ) {
              k = p[1].children[i].firstElementChild.innerText
              if (Object.hasOwn(entity.features, k)) {
                p[1].children[i].classList.remove('hidden')
                p[1].children[i].lastElementChild.innerText = entity.features[k]
              } else {
                p[1].children[i].classList.add('hidden')
              }
            }
          } else {
            // base information
            if (this.view) {
              v = site.dataviews[this.view]
              p = this.base.children
              if (v.ids && (k = v.get.ids())) {
                // when showing a selected region
                entity = entities[k]
                p[0].innerText = entity.features.name
                for (i = p[2].childElementCount; i--; ) {
                  k = p[2].children[i].firstElementChild.innerText
                  if (Object.hasOwn(entity.features, k)) {
                    p[2].children[i].classList.remove('hidden')
                    p[2].children[i].lastElementChild.innerText = entity.features[k]
                  } else {
                    p[2].children[i].classList.add('hidden')
                  }
                }
                p[1].classList.add('hidden')
                p[2].classList.remove('hidden')
              } else {
                // when showing all regions
                p[0].innerText = this.defaults.title
                p[1].classList.remove('hidden')
                p[2].classList.add('hidden')
              }
            }
          }
        },
      },
      table: {
        update: function () {
          if (this.table) {
            const v = _u[this.view],
              d = v.get.dataset()
            this.table.clear()
            if (v.selection) {
              var k, c, i, n, vn, pass
              if (this.options.single_variable) {
                vn = valueOf(this.options.variables)
                if ('data.' + vn !== this.headers[d][1].data) {
                  this.table.destroy()
                  for (n = this.headers[d].length, i = 1; i < n; i++) {
                    this.headers[d][i].data = 'data.' + vn
                  }
                  this.options.columns = this.headers[d]
                  this.table = $(this.e).DataTable(this.options)
                }
                for (n = this.headers[d].length, i = 1; i < n; i++) {
                  this.table.column(i).visible(v.times[i - 1])
                }
              }
              if (this.options.wide) {
                for (k in v.selection.all)
                  if (Object.hasOwn(v.selection.all, k)) {
                    if (vn) {
                      if (
                        Object.hasOwn(v.selection.all[k].summaries, d) &&
                        Object.hasOwn(v.selection.all[k].summaries[d], vn) &&
                        v.selection.all[k].summaries[d][vn].n
                      )
                        this.table.row.add(v.selection.all[k])
                    } else {
                      for (i = meta.time_n; i--; ) {
                        this.i = i
                        this.table.row.add(v.selection.all[k])
                      }
                    }
                  }
              } else {
                for (k in v.selection.all)
                  if (Object.hasOwn(v.selection.all, k)) {
                    if (this.options.single_variable) {
                      if (
                        Object.hasOwn(v.selection.all[k].summaries, d) &&
                        Object.hasOwn(v.selection.all[k].summaries[d], vn) &&
                        v.selection.all[k].summaries[d][vn].n
                      )
                        this.table.row.add(v.selection.all[k])
                    } else {
                      for (c in this.filters)
                        if (Object.hasOwn(this.filters, c)) {
                          this.current_filter[c] = valueOf(this.filters[c])
                        }
                      for (vn in variables) {
                        pass = false
                        if (Object.hasOwn(variables, vn) && Object.hasOwn(variables[vn], 'meta')) {
                          for (c in this.current_filter)
                            if (Object.hasOwn(variables[vn].meta, c)) {
                              pass = variables[vn].meta[c] === this.current_filter[c]
                              if (!pass) break
                            }
                        }
                        if (pass)
                          for (
                            n = v.selection.all[k].summaries[d][vn].time_range[1],
                              i = v.selection.all[k].summaries[d][vn].time_range[0];
                            i <= n;
                            i++
                          ) {
                            this.i = i
                            this.v = vn
                            this.table.row.add(v.selection.all[k])
                          }
                      }
                    }
                  }
              }
            }
            this.table.draw()
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
        return !s || s === e
      },
      includes: function (s, e) {
        return !s.length || s.indexOf(e) !== -1
      },
      sort_a1: function (a, b) {
        return a[1] - b[1]
      },
      sort_tree_children: function (a, b) {
        return !Object.hasOwn(tree, a.id) || !Object.hasOwn(tree, b.id)
          ? -Infinity
          : tree[a.id]._n.children - tree[b.id]._n.children
      },
    }

  var page = {},
    variables = {},
    variable_info = {},
    queue = {_timeout: 0},
    colors = {},
    meta = {
      time_n: 0,
      time_range: [],
      time: [],
      time_variable: '',
    },
    subs = {},
    data_maps = {},
    entities = {},
    entitiesByName = {},
    rule_conditions = {},
    _u = {},
    _c = {},
    tree = {}

  function pal(value, which, summary, index) {
    const colors = palettes[Object.hasOwn(palettes, which) ? which : 'reds'],
      min = summary ? summary.min[index] : 0,
      max = summary ? summary.max[index] : 1,
      nm = summary ? summary.norm_median[index] : 0.5
    return 'number' === typeof value
      ? colors[
          Math.max(
            0,
            Math.min(
              colors.length - 1,
              Math.floor(
                which === 'divergent'
                  ? colors.length / 2 + colors.length * (max - min ? (value - min) / (max - min) - nm : 0)
                  : colors.length * (max - min ? (value - min) / (max - min) : 0)
              )
            )
          )
        ]
      : '#808080'
  }

  function format_value(v, int) {
    if (!int && 'number' === typeof v) {
      const d = Math.pow(10, site.digits),
        r = Math.round((v % 1) * d) / d + ''
      return (v >> 0) + '.' + (('0' === r ? '' : r.split('.')[1]) + '0000000000').substr(0, site.digits)
    } else {
      return v
    }
  }

  function format_label(l) {
    return Object.hasOwn(variables, l) && variables[l].meta
      ? variables[l].meta.short_name
      : l.replace(patterns.seps, ' ').replace(patterns.word_start, function (w) {
          return w.toUpperCase()
        })
  }

  function fill_variables_options(u, d, out) {
    var s, i, m, n, l
    out[d] = {options: [], values: [], display: []}
    s = out[d].options
    u.values = out[d].values
    u.display = out[d].display
    for (m = site.metadata.info[d].schema.fields, n = m.length, i = 0; i < n; i++) {
      l = format_label(m[i].name)
      s[i] = u.add(i, l, m[i].name)
      u.values.push(m[i].name)
      u.display.push(l)
    }
  }

  function fill_levels_options(u, d, v, out) {
    var m = variables[v].info[d],
      l = m['string' === m.type ? 'levels' : 'ids'],
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
    }
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
        if (Object.hasOwn(subs[id][i], fun)) subs[id][i][fun](e)
      }
    }
  }

  function make_data_entry(u, e, name, color) {
    const v = u.view && _u[u.view],
      t = JSON.parse(u.traces.scatter)
    var i,
      c = valueOf(u.colors || v.y),
      y = _u[u.time || v.time_agg]
    y = y ? y.value() - y.parsed.min : 0
    if (Object.hasOwn(e.data, u.parsed.x)) {
      for (i = e.data[u.parsed.x].length; i--; ) {
        t.text[i] = e.features.name
        t.x[i] = e.data[u.parsed.x][i]
        t.y[i] = e.data[u.parsed.y][i]
      }
      t.color =
        t.line.color =
        t.marker.color =
        t.marker.line.color =
        t.textfont.color =
          color || pal(e.data[c][y], v.palette, variables[c][v.id].summaries[v.get.dataset()], y) || '#808080'
      t.name = name || e.features.name
      t.id = e.features.id
    }
    return t
  }

  function init_location_table(t) {
    var l, k, e
    for (l in data_maps.tract)
      if (Object.hasOwn(data_maps.tract, l)) {
        t.innerHTML = ''
        for (k in data_maps.tract[l])
          if (Object.hasOwn(data_maps.tract[l], k) && k !== 'name') {
            e = document.createElement('tr')
            e.appendChild(document.createElement('td'))
            e.firstElementChild.innerText = k
            e.appendChild(document.createElement('td'))
            t.appendChild(e)
          }
        break
      }
  }

  function init_legend(e) {
    e.innerHTML = ''
    const p = palettes[e.parentElement.parentElement.parentElement.getAttribute('palette') || 'divergent']
    for (var i = 0, n = p.length; i < n; i++) {
      e.appendChild(document.createElement('span'))
      e.lastElementChild.style.background = p[i]
    }
  }

  document.onreadystatechange = function () {
    var k, i, e, c, p, ci, n, o

    page.navbar = document.getElementsByClassName('navbar')[0]
    page.navbar = page.navbar ? page.navbar.getBoundingClientRect() : {height: 0}
    page.content = document.getElementsByClassName('content')[0]
    page.menus = document.getElementsByClassName('menu-wrapper')
    page.content_bounds = {
      top: page.navbar.height,
      right: 0,
      bottom: 0,
      left: 0,
    }
    page.menu_toggler = {
      hide: function () {
        this.classList.add('hidden')
      },
      toggle: function (type) {
        clearTimeout(page.menu_toggler.timeout)
        if (this.parentElement.firstElementChild.classList.contains('hidden')) {
          this.parentElement.firstElementChild.classList.remove('hidden')
          this.parentElement.style[type] = '0px'
          page.content.style[type] =
            this.parentElement.getBoundingClientRect()[type === 'left' || type === 'right' ? 'width' : 'height'] + 'px'
        } else {
          this.parentElement.style[type] =
            -this.parentElement.getBoundingClientRect()[type === 'left' || type === 'right' ? 'width' : 'height'] +
            (type === 'top' ? page.content_bounds.top - 40 : 0) +
            'px'
          page.content.style[type] = page.content_bounds[type] + 'px'
          page.menu_toggler.timeout = setTimeout(page.menu_toggler.hide.bind(this.parentElement.firstElementChild), 700)
        }
      },
      timeout: -1,
    }
    for (i = page.menus.length; i--; ) {
      if (page.menus[i].classList.contains('menu-top')) {
        page.top_menu = page.menus[i]
        page.content_bounds.top += 40
        if (page.menus[i].lastElementChild.tagName === 'BUTTON') {
          page.menus[i].lastElementChild.addEventListener(
            'click',
            page.menu_toggler.toggle.bind(page.menus[i].lastElementChild, 'top')
          )
        }
      } else if (page.menus[i].classList.contains('menu-right')) {
        page.right_menu = page.menus[i]
        page.content_bounds.right = 40
        if (page.menus[i].lastElementChild.tagName === 'BUTTON') {
          page.menus[i].lastElementChild.addEventListener(
            'click',
            page.menu_toggler.toggle.bind(page.menus[i].lastElementChild, 'right')
          )
        }
      } else if (page.menus[i].classList.contains('menu-bottom')) {
        page.bottom_menu = page.menus[i]
        page.content_bounds.bottom = 40
        if (page.menus[i].lastElementChild.tagName === 'BUTTON') {
          page.menus[i].lastElementChild.addEventListener(
            'click',
            page.menu_toggler.toggle.bind(page.menus[i].lastElementChild, 'bottom')
          )
        }
      } else if (page.menus[i].classList.contains('menu-left')) {
        page.left_menu = page.menus[i]
        page.content_bounds.left = 40
        if (page.menus[i].lastElementChild.tagName === 'BUTTON') {
          page.menus[i].lastElementChild.addEventListener(
            'click',
            page.menu_toggler.toggle.bind(page.menus[i].lastElementChild, 'left')
          )
        }
      }
    }
    function content_resize() {
      page.content.style.top =
        (page.top_menu && !page.top_menu.firstElementChild.classList.contains('hidden')
          ? page.top_menu.getBoundingClientRect().height
          : page.content_bounds.top) + 'px'
      if (page.right_menu) {
        page.content.style.right =
          page.content_bounds.right +
          (page.right_menu.firstElementChild.classList.contains('hidden')
            ? 0
            : page.right_menu.getBoundingClientRect().width) +
          'px'
      } else if (page.bottom_menu) {
        page.content.style.bottom =
          page.content_bounds.bottom +
          (page.bottom_menu.firstElementChild.classList.contains('hidden')
            ? 0
            : page.bottom_menu.getBoundingClientRect().height) +
          'px'
      } else if (page.left_menu) {
        page.content.style.left =
          page.content_bounds.left +
          (page.left_menu.firstElementChild.classList.contains('hidden')
            ? 0
            : page.left_menu.getBoundingClientRect().width) +
          'px'
      }
    }

    // fill legends
    for (c = document.getElementsByClassName('legend-scale'), i = c.length; i--; ) init_legend(c[i])

    // initialize inputs
    for (c = document.getElementsByClassName('auto-input'), i = c.length, n = 0; i--; ) {
      e = c[i]
      o = {
        type: e.getAttribute('auto-type'),
        source: void 0,
        value: function () {
          return valueOf(this.source) || valueOf(this.default)
        },
        default: e.getAttribute('default'),
        options_source: e.getAttribute('auto-options'),
        depends: e.getAttribute('depends'),
        variable: e.getAttribute('variable'),
        dataset: e.getAttribute('dataset') || site.metadata.datasets[0],
        view: e.getAttribute('data-view'),
        id: e.id || e.options_source || 'ui' + n++,
        current_index: -1,
        previous: '',
        e: e,
        values: [],
        display: [],
        data: [],
      }
      if (Object.hasOwn(elements, o.type)) {
        p = elements[o.type]
        o.options = o.type === 'select' ? o.e.children : o.e.getElementsByTagName('input')
        o.set = p.setter.bind(o)
        o.get = p.retrieve.bind(o)
        if (p.adder) o.add = p.adder.bind(o)
        o.reset = function () {
          this.set(valueOf(this.default))
        }.bind(o)
        o.listen = p.listener.bind(o)
        _u[o.id] = o
      }
    }

    // resolving references in _u
    // for (k in _u)
    //   if (Object.hasOwn(_u, k)) {
    //     if ('string' === typeof _u[k].default && Object.hasOwn(_u, _u[k].default)) {
    //       _u[k].default = _u[_u[k].default]
    //     }
    //     if ('string' === typeof _u[k].dataset && Object.hasOwn(_u, _u[k].dataset))
    //       _u[k].dataset = _u[_u[k].dataset]
    //   }

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
                if (!check_funs[r.type](valueOf(r.id), valueOf(r.value))) p = false
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
        // setTimeout(_u[k].update, 0)
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
              for (k in site.rules[ci].effects) if (Object.hasOwn(_u, k)) _u[k].set(valueOf(site.rules[ci].effects[k]))
            } else if (e[i].default) {
              for (k in site.rules[ci].effects) if (Object.hasOwn(_u, k)) _u[k].set(valueOf(e[i].default))
            }
          }
        }
      }
    }

    content_resize()
    window.addEventListener('resize', content_resize)

    if (site && site.data) {
      queue_init()
    } else if (site && site.metadata.file) {
      load_data(site.metadata.file)
    } else {
      throw new Error('No data or metadata information present')
    }
  }

  function init() {
    var k, i, e, c, p, ce, ci, n, o, cond, v

    // initialize inputs
    for (k in _u)
      if (Object.hasOwn(_u, k) && Object.hasOwn(elements, _u[k].type)) {
        o = _u[k]

        // resolve options
        if (o.options_source) {
          if (patterns.datasets.test(o.options_source)) {
            for (ci = site.metadata.datasets.length; ci--; ) {
              o.add(ci, site.metadata.datasets[ci], format_label(site.metadata.datasets[ci]))
            }
            o.options = o.e.getElementsByTagName(o.type === 'select' ? 'option' : 'input')
          } else {
            o.option_sets = {}
            v = valueOf(o.dataset)
            if (Object.hasOwn(site.metadata.info, v)) {
              if (patterns.variables.test(o.options_source)) {
                fill_variables_options(o, v, o.option_sets)
              } else if (patterns.levels.test(o.options_source) && Object.hasOwn(variables, o.variable)) {
                fill_levels_options(o, v, o.variable, o.option_sets)
              }
              o.reset()
            }
            if (o.depends) add_dependency(o.depends, {type: 'options', id: o.id})
            if (o.view) add_dependency(o.view, {type: 'options', id: o.id})
          }
        }

        // retrieve option values
        if ('number' === o.type) {
          o.min = o.e.getAttribute('min')
          o.max = o.e.getAttribute('max')
          o.range = [o.min, o.max]
          o.step = parseFloat(o.e.step) || 1
          o.parsed = {min: undefined, max: undefined}
          o.depends = {}
          o.update = function () {
            const view = _u[this.view],
              variable = view && valueOf(view.y)
            var d = view ? view.get.dataset() : valueOf(this.dataset),
              min = valueOf(this.min) || view.time,
              max = valueOf(this.max) || view.time,
              v,
              reset = false
            if (patterns.minmax.test(min)) min = _u[this.min][min]
            if (patterns.minmax.test(max)) max = _u[this.max][max]
            if (!d && this.view) {
              d = view.get.dataset()
            }
            this.parsed.min =
              'undefined' === typeof min
                ? view.time_range.time[0]
                : 'number' === typeof min
                ? min
                : Object.hasOwn(variables, min)
                ? variables[min].info[d || variables[min].datasets[0]].min
                : parseFloat(min)
            this.parsed.max =
              'undefined' === typeof max
                ? view.time_range.time[1]
                : 'number' === typeof max
                ? max
                : Object.hasOwn(variables, max)
                ? variables[max].info[d || variables[max].datasets[0]].max
                : parseFloat(max)
            if (variable && Object.hasOwn(variables, variable)) {
              this.e.min = v = Math.max(view.time_range.time[0], this.parsed.min)
              if (this.range[0] !== v) reset = true
              this.range[0] = v
              if (v > this.source) {
                reset = false
                this.set(v)
              }
              this.e.max = v = Math.min(view.time_range.time[1], this.parsed.max)
              if (this.range[1] !== v) reset = true
              this.range[1] = v
              if (v < this.source) {
                reset = false
                this.set(v)
              }
              if (!this.depends[view.y]) {
                this.depends[view.y] = true
                add_dependency(view.y, {type: 'update', id: this.id})
              }
              v = this.value()
              if (reset) this.reset()
            } else {
              this.e.min = this.parsed.min
              if (this.parsed.min > this.source || (!this.source && 'min' === this.default)) this.set(this.parsed.min)
              this.e.max = this.parsed.max
              if (this.parsed.max < this.source || (!this.source && 'max' === this.default)) this.set(this.parsed.max)
            }
          }.bind(o)
          setTimeout(o.update, 0)
          if (o.view) {
            add_dependency(o.view, {type: 'update', id: o.id})
          } else if (o.dataset) {
            add_dependency(o.dataset, {type: 'update', id: o.id})
          }
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
          if (o.default) {
            if (!isNaN(parseFloat(o.default))) {
              o.default = parseFloat(o.default)
            } else
              o.reset = function () {
                const d = Object.hasOwn(_u, this.view) && _u[this.view].get.dataset()
                if ('max' === this.default) {
                  if (this.range) this.set(this.range[1])
                } else if ('min' === this.default) {
                  if (this.range) this.set(this.range[0])
                } else if (Object.hasOwn(_u, this.default)) {
                  this.set(valueOf(this.default))
                }
              }.bind(o)
          }
        } else {
          if (!o.values.length)
            for (ci = o.options.length; ci--; ) {
              o.values[ci] = o.options[ci].value
              o.display[ci] = format_label(o.options[ci].innerText.trim() || o.values[ci])
            }
          if ('checkbox' === o.type) {
            o.default = o.default.split(',')
            if (o.options.length)
              for (ci = o.options.length; ci--; ) {
                o.values[ci] = o.options[ci].value
              }
          } else if (o.values.length && !Object.hasOwn(_u, o.default) && -1 === o.values.indexOf(o.default)) {
            o.default = parseInt(o.default)
            o.default = o.values[o.default] ? o.values[o.default] : ''
          }
        }

        // add listeners
        if ('select' === o.type || 'number' === o.type) {
          o.e.addEventListener('input', o.listen)
          if (o.e.nextElementSibling && o.e.nextElementSibling.classList.contains('select-reset')) {
            o.e.nextElementSibling.addEventListener('click', o.reset)
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
              if (last && (-1 === this.current_index || this.options[this.current_index].classList.contains('hidden')))
                this.set(last)
            }.bind(o)
          }
        } else {
          for (ci = o.options.length; ci--; ) o.options[ci].addEventListener('click', o.listen)
        }
        o.reset()
      }

    // initialize dataviews
    if (site.dataviews)
      for (k in site.dataviews)
        if (Object.hasOwn(site.dataviews, k)) {
          _u[k] = e = site.dataviews[k]
          if (!Object.hasOwn(e, 'time')) e.time = meta.time_variable
          e.id = k
          e.value = function () {
            if (this.get) {
              var k,
                s = '' + this.get.dataset() + this.get.ids()
              for (k in this.get.features) if (Object.hasOwn(this.get.features, k)) s += this.get.features[k]()
              return s
            }
          }.bind(e)
          if (e.dataset && 'string' === typeof e.dataset && Object.hasOwn(_u, e.dataset)) {
            add_dependency(e.dataset, {type: 'dataview', id: k})
          }
          if (e.ids && 'string' === typeof e.ids && Object.hasOwn(_u, e.ids)) {
            add_dependency(e.ids, {type: 'dataview', id: k})
          }
          e.time_range = {index: [], time: [], filtered: []}
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
        }

    // initialize outputs
    for (c = document.getElementsByClassName('auto-output'), i = c.length, n = 0; i--; ) {
      e = c[i]
      n = meta.time_n
      o = {
        type: e.getAttribute('auto-type'),
        view: e.getAttribute('data-view'),
        id: e.id || 'out' + n++,
        e: e,
      }
      _u[o.id] = o
      if (o.view) {
        if (!Object.hasOwn(_c, o.view)) _c[o.view] = []
        if (!Object.hasOwn(_c, o.view + '_filter')) _c[o.view + '_filter'] = []
      }
      if ('info' === o.type) {
        o.base = e.firstElementChild
        o.temp = e.children[1]
        o.temp.lastElementChild.classList.remove('hidden')
        o.defaults = {
          title: e.firstElementChild.children[0].innerText,
          message: e.firstElementChild.children[1].innerText,
        }
        o.update = elements.info.update.bind(o)
        o.show = function (e) {
          this.update(e)
          this.base.classList.add('hidden')
          this.temp.classList.remove('hidden')
        }
        o.revert = function () {
          this.base.classList.remove('hidden')
          this.temp.classList.add('hidden')
        }
        if (o.view) add_subs(o.view, o)
        o.options = site.info[o.id]
        if (o.options && o.options.subto) for (ci = o.options.subto.length; ci--; ) add_subs(o.options.subto[ci], o)
        for (ce = e.getElementsByClassName('location-table'), ci = ce.length; ci--; ) {
          init_location_table(ce[ci])
        }
      } else if ('table' === o.type) {
        e.appendChild(document.createElement('tHead'))
        e.appendChild(document.createElement('tBody'))
        o.options = (site.tables && site.tables[o.id]) || {}
        o.update = elements.table.update.bind(o)
        o.headers = {}
        if ('tabpanel' === o.e.parentElement.getAttribute('role')) {
          document.getElementById(o.e.parentElement.getAttribute('aria-labelledby')).addEventListener(
            'click',
            function () {
              setTimeout(this.update, 155)
            }.bind(o)
          )
        }
        if (o.options.single_variable) {
          if ('object' === typeof o.options.variables) {
            o.options.variables = o.options.variables[0]
          }
          if (Object.hasOwn(_u, o.options.variables)) add_dependency(o.options.variables, {type: 'update', id: o.id})
          k = valueOf(o.options.variables)
          if (Object.hasOwn(variables, k)) {
            if (!Object.hasOwn(o.options, 'order')) o.options.order = [[meta.time_n, 'asc']]
            for (ci = variables[k].datasets.length; ci--; ) {
              p = variables[k].datasets[ci]
              if (!Object.hasOwn(o.headers, p)) o.headers[p] = []
              o.headers[p].push({title: 'Region', data: 'features.name'})
              for (n = meta.time_n; n--; ) {
                o.headers[p][n + 1] = {
                  title: meta.time[n] + '',
                  data: 'data.' + k,
                  render: function (d) {
                    var k = valueOf(this.v.variables),
                      p = variables[k].datasets[0]
                    return 'number' === typeof d[this.n]
                      ? format_value(d[this.n], 'integer' === variables[k].info[p].type)
                      : d[this.n]
                  }.bind({n, v: o.options}),
                }
              }
            }
          }
        } else if (o.options.wide) {
          for (k in variables)
            if (Object.hasOwn(variables, k)) {
              for (ci = variables[k].datasets.length; ci--; ) {
                p = variables[k].datasets[ci]
                if (!Object.hasOwn(o.headers, p)) o.headers[p] = []
                o.headers[p].push(
                  'ID' === k
                    ? {title: k, data: 'features.' + k.toLowerCase()}
                    : {
                        title: format_label(k),
                        data: 'data.' + k,
                        render: function (d, int) {
                          return 'number' === typeof d[this.i] ? format_value(d[this.i], int) : d[this.i]
                        }.bind(o, 'integer' === variables[k].info[p].type),
                      }
                )
              }
            }
        } else {
          o.filters = o.options.filters
          o.current_filter = {}
          if (Object.hasOwn(o.options, 'xfilters')) {
            for (p in o.filters)
              if (Object.hasOwn(o.filters, p) && Object.hasOwn(_u, o.filters[p])) {
                add_dependency(o.filters[p], {type: 'filter', id: o.id})
              }
            o.filter = function () {
              var k,
                c,
                y,
                i = 0,
                pass
              for (k in this.filters)
                if (Object.hasOwn(this.filters, k)) {
                  this.current_filter[k] = valueOf(this.filters[k])
                }
              for (k in variables) {
                pass = false
                if (Object.hasOwn(variables, k) && Object.hasOwn(variables[k], 'meta')) {
                  for (c in this.current_filter)
                    if (Object.hasOwn(variables[k].meta, c)) {
                      pass = variables[k].meta[c] === this.current_filter[c]
                      if (!pass) break
                    }
                }
                for (y = meta.time_n; y--; ) {
                  this.table.row(i++).visible(pass)
                }
              }
            }.bind(o)
          }
          for (k in site.data)
            if (Object.hasOwn(site.data, k)) {
              o.headers[k] = [
                {title: 'ID', data: 'features.id'},
                {title: 'Name', data: 'features.name'},
                {title: 'Type', data: 'features.type'},
                {
                  title: 'Year',
                  data: 'data.time',
                  render: function (d) {
                    return 'number' === typeof d[this.i] ? format_value(d[this.i], true) : d[this.i]
                  }.bind(o),
                },
                {
                  title: 'Measure',
                  data: function (d) {
                    return Object.hasOwn(d.variables, this.v) ? d.variables[this.v].short_name : this.v
                  }.bind(o),
                },
                {
                  title: 'Value',
                  data: function (d) {
                    return Object.hasOwn(d.data, this.v) ? d.data[this.v] : []
                  }.bind(o),
                  render: function (d) {
                    return 'number' === typeof d[this.i]
                      ? format_value(
                          d[this.i],
                          'integer' === variables[this.v].info[variables[this.v].datasets[0]].type
                        )
                      : d[this.i]
                  }.bind(o),
                },
              ]
            }
        }
        if (o.view) {
          _c[o.view].push({type: 'update', id: o.id})
          _c[o.view + '_filter'].push({type: 'update', id: o.id})
        }
        queue_init_table.bind(o)()
      } else if ('plot' === o.type) {
        if (Object.hasOwn(site.plots, o.id)) {
          o.update = elements.plot.update.bind(o)
          o.x = e.getAttribute('x')
          o.y = e.getAttribute('y')
          o.colors = e.getAttribute('color')
          o.time = e.getAttribute('color-time')
          o.click = e.getAttribute('click')
          if (o.click && Object.hasOwn(_u, o.click)) o.clickto = _u[o.click]
          o.parsed = {}
          o.config = site.plots[o.id]
          o.traces = {}
          o.show = function (e) {
            var trace = make_data_entry(this, e, 'hover_line', '#000')
            trace.line.width = 4
            Plotly.addTraces(this.e, trace, this.e.data.length)
          }.bind(o)
          o.revert = function () {
            if ('hover_line' === this.e.data[this.e.data.length - 1].name)
              Plotly.deleteTraces(this.e, this.e.data.length - 1)
          }.bind(o)
          if (o.config && o.config.subto) for (ci = o.config.subto.length; ci--; ) add_subs(o.config.subto[ci], o)
          for (ci = site.plots[o.id].data.length; ci--; ) {
            p = site.plots[o.id].data[ci]
            if (!Object.hasOwn(p, 'textfont')) p.textfont = {}
            if (!Object.hasOwn(p.textfont, 'color')) p.textfont.color = '#808080'
            if (!Object.hasOwn(p, 'line')) p.line = {}
            if (!Object.hasOwn(p.line, 'color')) p.line.color = '#808080'
            if (!Object.hasOwn(p, 'marker')) p.marker = {}
            if (!Object.hasOwn(p.marker, 'color')) p.marker.color = '#808080'
            if (!Object.hasOwn(p.marker, 'line')) p.marker.line = {}
            if (!Object.hasOwn(p.marker.line, 'color')) p.marker.lin.color = '#808080'
            if (!Object.hasOwn(p, 'text')) p.text = []
            if (!Object.hasOwn(p, 'x')) p.x = []
            if (p.type !== 'box' && !Object.hasOwn(p, 'y')) p.y = []
            o.traces[site.plots[o.id].data[ci].type] = JSON.stringify(site.plots[o.id].data[ci])
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
          }
          queue_init_plot.bind(o)()
        }
      } else if ('map' === o.type) {
        o.options = site.maps[o.id].options
        o.colors = e.getAttribute('color')
        o.time = e.getAttribute('color-time')
        o.click = e.getAttribute('click')
        if (o.click && Object.hasOwn(_u, o.click)) o.clickto = _u[o.click]
        o.show = function (e) {
          if (e && e.layer) {
            e.layer.setStyle({
              color: '#ffffff',
            })
          }
        }
        o.revert = function (e) {
          if (e && e.layer) {
            e.layer.setStyle({
              color: '#000000',
            })
          }
        }
        if (o.options && o.options.subto) for (ci = o.options.subto.length; ci--; ) add_subs(o.options.subto[ci], o)
        if (o.view) {
          add_dependency(o.view, {type: 'map_colors', id: o.id})
          if (_u[o.view].time_agg && Object.hasOwn(_u, _u[o.view].time_agg))
            add_dependency(_u[o.view].time_agg, {type: 'map_colors', id: o.id})
          _c[o.view].push({type: 'map_shapes', id: o.id})
          if (_u[o.view].y) add_dependency(_u[o.view].y, {type: 'map_colors', id: o.id})
        }
        if (o.colors) add_dependency(o.colors, {type: 'map_colors', id: o.id})
        if (o.time) add_dependency(o.time, {type: 'map_colors', id: o.id})
        if (!e.style.height) e.style.height = o.options.height ? o.options.height : '400px'
        queue_init_map.bind(o)()
      } else if ('text' === o.type) {
        if (site.text && Object.hasOwn(site.text, o.id)) {
          o.text = site.text[o.id].text
          o.depends = site.text[o.id].depends
          for (n = o.text.length, ci = 0; ci < n; ci++) {
            if (!Object.hasOwn(o.text[ci], 'button')) o.text[ci].button = {}
            o.e.appendChild((o.text[ci].parts = document.createElement('span')))
            if ('string' === typeof o.text[ci].text) o.text[ci].text = [o.text[ci].text]
            for (ce = o.text[ci].text.length, v = 0; v < ce; v++) {
              if (Object.hasOwn(o.text[ci].button, o.text[ci].text[v])) {
                p = o.text[ci].button[o.text[ci].text[v]]
                o.text[ci].parts.appendChild(document.createElement('button'))
                o.text[ci].parts.lastElementChild.type = 'button'
                o.text[ci].parts.lastElementChild.className = 'btn btn-link'
                if (Object.hasOwn(_u, p.target) && 'function' === typeof _u[p.target][p.type]) {
                  o.text[ci].parts.lastElementChild.setAttribute('aria-label', p.text.join(''))
                  o.text[ci].parts.lastElementChild.addEventListener('click', _u[p.target][p.type])
                }
              } else {
                o.text[ci].parts.appendChild(document.createElement('span'))
              }
            }
            if (Object.hasOwn(o.text[ci], 'condition')) {
              for (v = o.text[ci].condition.length; v--; ) {
                o.text[ci].condition[v].check = function () {
                  return check_funs[this.type](valueOf(this.id), valueOf(this.value))
                }.bind(o.text[ci].condition[v])
              }
            }
          }
          for (v in o.depends) if (Object.hasOwn(_u, v)) add_dependency(v, {type: 'update', id: o.id})
          o.update = function () {
            var k, i, t, s, pass, bt
            for (k in this.depends)
              if (Object.hasOwn(this.depends, k)) {
                this.depends[k] = valueOf(k)
                if (Object.hasOwn(entities, this.depends[k])) this.depends[k] = entities[this.depends[k]].features.name
              }
            for (i = this.text.length; i--; ) {
              pass = true
              if (Object.hasOwn(this.text[i], 'condition')) {
                for (t = this.text[i].condition.length; t--; ) {
                  pass = this.text[i].condition[t].check()
                  if (!pass) break
                }
              }
              if (pass) {
                for (t = this.text[i].text.length; t--; ) {
                  k = this.text[i].text[t]
                  if (Object.hasOwn(this.depends, k)) {
                    this.text[i].parts.children[t].innerText = this.depends[k]
                  } else if (Object.hasOwn(this.text[i].button, k)) {
                    for (s = '', bt = this.text[i].button[k].text.length; bt--; ) {
                      s =
                        (Object.hasOwn(this.depends, this.text[i].button[k].text[bt])
                          ? this.depends[this.text[i].button[k].text[bt]]
                          : this.text[i].button[k].text[bt]) + s
                    }
                    this.text[i].parts.children[t].innerText = s
                  } else this.text[i].parts.children[t].innerText = k
                }
                this.text[i].parts.classList.remove('hidden')
              } else this.text[i].parts.classList.add('hidden')
            }
          }.bind(o)
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

  function add_layer_listeners(feature, layer) {
    layer.on({
      mouseover: elements.map.mouseover.bind(this),
      mouseout: elements.map.mouseout.bind(this),
      click: elements.map.click.bind(this),
    })
  }

  function retrieve_layer(u, group, url) {
    if (!Object.hasOwn(site.maps, url)) {
      var f = new XMLHttpRequest()
      f.onreadystatechange = function (group) {
        if (4 === f.readyState) {
          if (200 === f.status) {
            site.maps[group] = L.geoJSON(JSON.parse(f.responseText), {
              onEachFeature: add_layer_listeners.bind(u),
            })
            var k, id
            for (k in site.maps[group]._layers)
              if (Object.hasOwn(site.maps[group]._layers, k)) {
                id = site.maps[group]._layers[k].feature.properties.id
                entities[id].layer = site.maps[group]._layers[k]
              } else {
                throw new Error('retrieve_layer failed: ' + f.responseText)
              }
            if (site.maps._waiting && site.maps._waiting[group]) {
              for (var i = site.maps._waiting[group].length; i--; ) {
                request_queue(site.maps._waiting[group][i], true)
              }
            }
          }
        }
      }.bind(null, group)
      f.open('GET', url, true)
      f.send()
    }
  }

  function quantile_inds(p, n) {
    const q = [p * (n - 1), 0, 0, 0]
    q[1] = q[0] % 1
    q[2] = 1 - q[1]
    q[3] = Math.ceil(q[0])
    q[0] = Math.floor(q[0])
    return q
  }

  function init_summaries(view) {
    view = view || 'default'
    var m, v, s, y
    for (v in variables)
      if (Object.hasOwn(variables, v)) {
        variables[v][view] = m = {order: {}, summaries: {}}
        for (s in site.data) {
          if (Object.hasOwn(site.data, s)) {
            m.order[s] = []
            m.summaries[s] = {
              time_range: [0, 0],
              missing: [],
              n: [],
              sum: [],
              max: [],
              q3: [],
              mean: [],
              norm_median: [],
              median: [],
              q1: [],
              min: [],
            }
            for (y = meta.time_n; y--; ) {
              m.order[s].push([])
              m.summaries[s].missing.push(0)
              m.summaries[s].n.push(0)
              m.summaries[s].sum.push(0)
              m.summaries[s].max.push(-Infinity)
              m.summaries[s].q3.push(0)
              m.summaries[s].mean.push(0)
              m.summaries[s].norm_median.push(0)
              m.summaries[s].median.push(0)
              m.summaries[s].q1.push(0)
              m.summaries[s].min.push(Infinity)
            }
          }
        }
      }
  }

  function calculate_summary(measure, view, full) {
    if (!Object.hasOwn(variables[measure], view))
      variables[measure][view] = JSON.parse(JSON.stringify(variables[measure].default))
    const v = site.dataviews[view],
      dataset = v.get.dataset(),
      m = variables[measure][view],
      mo = m.order[dataset],
      ms = m.summaries[dataset],
      ny = meta.time_n
    for (var k, id, dim, en, q1, q3, y = meta.time_n; y--; ) {
      mo[y] = []
      ms.missing[y] = 0
      ms.n[y] = 0
      ms.sum[y] = 0
      ms.mean[y] = 0
      ms.max[y] = -Infinity
      ms.min[y] = Infinity
    }
    for (k in v.selection.all)
      if (Object.hasOwn(v.selection.all, k)) {
        en = v.selection.all[k]
        if (!Object.hasOwn(en.summaries, dataset)) en.summaries[dataset] = {}
        if (!Object.hasOwn(en.summaries[dataset], measure))
          en.summaries[dataset][measure] = {n: 0, time_range: [Infinity, -Infinity]}
        en.summaries[dataset][measure].n = 0
        en.summaries[dataset][measure].time_range[0] = Infinity
        en.summaries[dataset][measure].time_range[1] = -Infinity
        id = en.features.id
        for (y = 0; y < ny; y++) {
          dim = en.data[measure][y]
          if (full) {
            mo[y].push([id, dim])
          }
          if ('number' === typeof dim) {
            en.summaries[dataset][measure].n++
            if (y < en.summaries[dataset][measure].time_range[0]) en.summaries[dataset][measure].time_range[0] = y
            if (y > en.summaries[dataset][measure].time_range[1]) en.summaries[dataset][measure].time_range[1] = y
            ms.sum[y] += dim
            ms.n[y]++
            if (dim > ms.max[y]) ms.max[y] = dim
            if (dim < ms.min[y]) ms.min[y] = dim
          } else ms.missing[y]++
        }
      }
    ms.time_range[0] = Infinity
    ms.time_range[1] = -Infinity
    if (full) {
      for (y = 0; y < ny; y++) if (ms.n[y]) mo[y].sort(check_funs.sort_a1)
      for (y = 0; y < ny; y++) {
        if (ms.n[y]) {
          if (y < ms.time_range[0]) ms.time_range[0] = y
          if (y > ms.time_range[1]) ms.time_range[1] = y
          q1 = quantile_inds(0.25, ms.n[y])
          q3 = quantile_inds(0.75, ms.n[y])
          ms.mean[y] = ms.sum[y] / ms.n[y]
          if (!isFinite(ms.min[y])) ms.min[y] = ms.mean[y]
          if (!isFinite(ms.max[y])) ms.max[y] = ms.mean[y]
          ms.median[y] =
            'numeric' === typeof mo[y][Math.floor(0.5 * ms.n[y])]
              ? Math.min(ms.q3[y], mo[y][Math.floor(0.5 * ms.n[y])][1])
              : ms.mean[y]
          ms.q3[y] =
            'numeric' === typeof q3[2]
              ? q3[2] * mo[y][q3[0]][1] + q3[1] * mo[y][q3[3]][1]
              : ms.median[y]
              ? (ms.max[y] + ms.median[y]) / 2
              : ms.mean[y]
          ms.q1[y] =
            'numeric' === typeof q1[2]
              ? Math.min(ms.median[y], q1[2] * mo[y][q1[0]][1] + q1[1] * mo[y][q1[3]][1])
              : ms.median[y]
              ? (ms.min[y] + ms.median[y]) / 2
              : ms.mean[y]
        } else {
          ms.max[y] = 0
          ms.q3[y] = 0
          ms.median[y] = 0
          ms.q1[y] = 0
          ms.min[y] = 0
        }
        ms.norm_median[y] =
          'number' === typeof ms.max[y] ? (ms.median[y] - ms.min[y]) / (ms.max[y] - ms.min[y]) : ms.median[y]
      }
    } else {
      for (y = 0; y < ny; y++) {
        if (ms.n[y]) {
          if (y < ms.time_range[0]) ms.time_range[0] = y
          if (y > ms.time_range[1]) ms.time_range[1] = y
          ms.mean[y] = ms.sum[y] / ms.n[y]
        }
      }
    }
  }

  // function make_aggregates(map) {
  //   var id,
  //     m,
  //     s,
  //     v,
  //     y,
  //     sets = {}
  //   for (id in map)
  //     if (Object.hasOwn(site.data, id)) {
  //       d = site.data[id]
  //       m = map[id]
  //       for (s in m)
  //         if (Object.hasOwn(d, s)) {
  //           if (!Object.hasOwn(sets, s)) {
  //             sets[s] = {}
  //           }
  //           if (!Object.hasOwn(sets[s], m[s])) {
  //             sets[s][m[s]] = JSON.parse(JSON.stringify(d[s]))
  //           } else {
  //             for (v in d[s])
  //               if (Object.hasOwn(d[s], v)) {
  //                 for (y = d[s][v].length; y--; ) {
  //                   sets[s][m[s]][v][y] += d[s][v][y]
  //                 }
  //               }
  //           }
  //         }
  //     }
  // }

  function load_id_maps() {
    var ids,
      i,
      f,
      k,
      queued = false
    for (k in site.metadata.info)
      if (Object.hasOwn(site.metadata.info, k)) {
        for (ids = site.metadata.info[k].ids, i = ids.length; i--; )
          if (Object.hasOwn(ids[i], 'map')) {
            if (Object.hasOwn(data_maps, ids[i].map)) {
              if (data_maps[ids[i].map].retrieved) {
                site.metadata.info[k].schema.fields[fi].ids = data_maps[k] = Object.hasOwn(
                  data_maps[ids[i].map].resource,
                  k
                )
                  ? data_maps[ids[i].map].resource[k]
                  : data_maps[ids[i].map].resource
                map_entities(k)
              } else {
                data_maps[ids[i].map].queue.push(k)
              }
            } else {
              f = new XMLHttpRequest()
              data_maps[ids[i].map] = {queue: [k], resource: {}, retrieved: false}
              f.onreadystatechange = function (url, fi) {
                if (4 === f.readyState) {
                  if (200 === f.status) {
                    data_maps[url].resource = JSON.parse(f.responseText)
                    data_maps[url].retrieved = true
                    for (var k, i = data_maps[url].queue.length; i--; ) {
                      site.metadata.info[data_maps[url].queue[i]].schema.fields[fi].ids = data_maps[
                        data_maps[url].queue[i]
                      ] = Object.hasOwn(data_maps[url].resource, data_maps[url].queue[i])
                        ? data_maps[url].resource[data_maps[url].queue[i]]
                        : data_maps[url].resource
                      map_entities(data_maps[url].queue[i])
                    }
                    map_variables()
                    init_summaries()
                    init()
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
              queued = true
            }
          }
      }
    return queued
  }

  function map_variables() {
    var k, v, i, t, ti, m
    for (k in site.metadata.info)
      if (Object.hasOwn(site.metadata.info, k)) {
        for (m = site.metadata.info[k], t = m.time, v = m.schema.fields, i = v.length; i--; ) {
          if (Object.hasOwn(variables, v[i].name)) {
            variables[v[i].name].datasets.push(k)
            variables[v[i].name].components[k] = []
            variables[v[i].name].info[k] = v[i]
          } else {
            variables[v[i].name] = {datasets: [k], info: {}, components: {}}
            variables[v[i].name].components[k] = []
            variables[v[i].name].info[k] = v[i]
            variables[v[i].name].meta = variables[v[i].name].info[k].info
            if (!variables[v[i].name].meta)
              variables[v[i].name].meta = {
                full_name: v[i].name,
                measure: v[i].name.split(':')[1],
                short_name: format_label(v[i].name),
              }
            if (!Object.hasOwn(variables[v[i].name].meta, 'full_name'))
              variables[v[i].name].meta.full_name = variables[v[i].name].meta.short_name
            if (!Object.hasOwn(variable_info, variables[v[i].name].meta.full_name))
              variable_info[variables[v[i].name].meta.full_name] = variables[v[i].name].meta
            if (!meta.time.length && v[i].name === t) {
              meta.time_range[0] = v[i].min
              meta.time_range[1] = v[i].max
              meta.time_variable = t
              for (ti = v[i].max - v[i].min + 1; ti--; ) meta.time[ti] = v[i].min + ti
              meta.time_n = meta.time.length
            }
          }
        }
      }
  }

  function map_entities(g) {
    var id, f
    for (var id in site.data[g])
      if (Object.hasOwn(site.data[g], id)) {
        f = data_maps[g][id]
        entities[id] = {group: g, data: site.data[g][id], variables: variable_info, features: f, summaries: {}}
        if (f) {
          entitiesByName[f.name] = entities[id]
          if (Object.hasOwn(f, 'district') && id.length > 4) {
            f.county = id.substr(0, 5)
          }
        }

        // fill out location hierarchies
        // for (var k in f)
        //   if (Object.hasOwn(site.data, k)) {
        //     if (!Object.hasOwn(f, 'parents')) f.parents = []
        //     f.parents.push(f[k])
        //   }
      }
  }

  function get_checkfun(e) {
    return check_funs[!e || 'string' === typeof e ? 'equals' : 'includes']
  }

  function compile_dataview(v) {
    var i, k
    v.times = {}
    if (v.time_filters) {
      for (i = v.time_filters.length; i--; )
        if (Object.hasOwn(_u, v.time_filters[i].value)) {
          add_dependency(v.time_filters[i].value, {type: 'time_filters', id: v.id})
        }
    }
    v.selection = {ids: {}, features: {}, dataset: {}, all: {}}
    v.n_selected = {ids: 0, features: 0, dataset: 0, all: 0}
    v.get = {
      dataset: function () {
        return valueOf(
          'string' === typeof v.dataset && Object.hasOwn(_u, v.dataset) ? _u[v.dataset].value() : v.dataset
        )
      },
      ids: function () {
        return valueOf('string' === typeof v.ids && Object.hasOwn(_u, v.ids) ? _u[v.ids].value() : v.ids)
      },
      features: {},
    }
    v.ids_check = get_checkfun(v.get.ids())
    v.feature_checks = {}
    if (v.features)
      for (k in v.features)
        if (Object.hasOwn(v.features, k)) {
          v.get.features[k] = function () {
            return valueOf(v.features[k])
          }
          v.feature_checks[k] = get_checkfun(valueOf(v.features[k]))
        }
    v.k = ''
    v.checks = {
      dataset: function (e) {
        return this.get.dataset() === e.group
      }.bind(v),
      ids: ('string' === typeof v.ids &&
      Object.hasOwn(_u, v.ids) &&
      (('virtual' === _u[v.ids].type && Object.hasOwn(_u, _u[v.ids].source)) ||
        (Object.hasOwn(_u[v.ids], 'depends') && Object.hasOwn(_u, _u[v.ids].depends)))
        ? 'virtual' === _u[v.ids].type
          ? function (e) {
              const c = _u[_u[this.ids].source]
              return (
                e.features &&
                this.ids_check(
                  this.get.ids(),
                  e.features[!c || e.group === valueOf(c.dataset) ? 'id' : valueOf(c.dataset)]
                )
              )
            }
          : function (e) {
              const f = _u[_u[this.ids].depends].value()
              return (
                e.features &&
                this.ids_check(this.get.ids(), Object.hasOwn(e.features, f) ? valueOf(e.features[f]) : e.features.id)
              )
            }
        : function (e) {
            return e.features && this.ids_check(this.get.ids(), e.features.id)
          }
      ).bind(v),
      features: function (e) {
        for (this.k in this.features)
          if (Object.hasOwn(this.features, this.k)) {
            return (
              e.features && this.feature_checks[this.k](valueOf(this.features[this.k]), valueOf(e.features[this.k]))
            )
          }
      }.bind(v),
    }
    v.check = function (e) {
      return {
        ids: !this.ids || this.checks.ids(e),
        features: !this.features || this.checks.features(e),
        dataset: !this.dataset || this.checks.dataset(e),
      }
    }.bind(v)
  }

  function request_queue(id, force) {
    queue[id] = true
    cancelAnimationFrame(queue._timeout)
    queue._timeout = requestAnimationFrame(run_queue.bind(null, force))
  }

  function run_queue(force) {
    for (var k in queue)
      if ('_timeout' !== k && Object.hasOwn(queue, k) && queue[k]) {
        queue[k] = false
        refresh_conditions(k, force)
      }
  }

  function refresh_conditions(id, force) {
    if (Object.hasOwn(_c, id)) {
      var c = _u[id],
        d = _c[id],
        v,
        i,
        ci,
        n,
        r = [],
        pass,
        k,
        v = c && c.value() + ''
      if (c && (force || c.state !== v)) {
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
            if (!pass) break
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
            } else if (Object.hasOwn(r[i], 'default')) {
              if (Object.hasOwn(_u, k)) {
                _u[k].set(valueOf(r[i].default))
              }
            }
        }
      }
    }
  }

  function queue_init_plot() {
    if (window.Plotly) {
      Plotly.newPlot(this.e, this.config)
      this.e
        .on('plotly_hover', elements.plot.mouseover.bind(this))
        .on('plotly_unhover', elements.plot.mouseout.bind(this))
        .on('plotly_click', elements.plot.click.bind(this))
    } else {
      setTimeout(queue_init_plot.bind(this), 10)
    }
  }

  function queue_init_map() {
    if (window.L) {
      this.map = L.map(this.e, this.options)
      this.displaying = L.featureGroup().addTo(this.map)
      if (Object.hasOwn(site.maps, this.id)) {
        if (site.maps[this.id].tiles && site.maps[this.id].tiles.url)
          L.tileLayer(site.maps[this.id].tiles.url, site.maps[this.id].tiles.options).addTo(this.map)
        for (var k in site.maps[this.id].shapes)
          if (Object.hasOwn(site.maps[this.id].shapes, k)) {
            retrieve_layer(this, k, site.maps[this.id].shapes[k])
          }
      }
    } else {
      setTimeout(queue_init_map.bind(this), 10)
    }
  }

  function queue_init_table() {
    if (window.jQuery && window.DataTable && Object.hasOwn(site.dataviews[this.view], 'get')) {
      this.options.columns = this.headers[site.dataviews[this.view].get.dataset()]
      this.table = $(this.e).DataTable(this.options)
      this.update()
    } else {
      setTimeout(queue_init_table.bind(this), 10)
    }
  }

  function queue_init() {
    if ('loading' !== document.readyState) {
      if (!load_id_maps()) {
        init()
        init_summaries()
        map_variables()
        for (var k in _c)
          if (Object.hasOwn(_c, k)) {
            request_queue(k)
          }
      }
    } else {
      setTimeout(queue_init, 5)
    }
  }

  function load_data(url) {
    var f = new XMLHttpRequest()
    f.onreadystatechange = function () {
      if (4 === f.readyState) {
        if (200 === f.status) {
          site.data = JSON.parse(f.responseText)
          queue_init()
        } else {
          throw new Error('load_data failed: ' + f.responseText)
        }
      }
    }
    f.open('GET', url, true)
    f.send()
  }
})()
