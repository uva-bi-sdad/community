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
      divergent: ['#1b7837', '#7fbf7b', '#d9f0d3', '#e7d4e8', '#af8dc3', '#762a83'],
      reds: ['#f1eef6', '#d7b5d8', '#df65b0', '#dd1c77', '#980043'],
      greens: ['#ffffcc', '#c2e699', '#78c679', '#31a354', '#006837'],
      greys: ['#f7f7f7', '#cccccc', '#969696', '#525252'],
      cats: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c'],
    },
    patterns = {
      single_decimal: /(\.\d$)/,
      seps: /[\s._-]/g,
      word_start: /\b(\w)/g,
      datasets: /^dat/,
      variables: /^var/,
      levels: /^lev/,
    },
    conditionals = {
      display: function (u, c) {
        u.e.classList[u.current === c.current ? 'remove' : 'add']('hidden')
      },
      options: function (u, c) {
        var i, s, n, m, l, k
        if (!Object.hasOwn(u, 'option_sets')) u.option_sets = {}
        u.e.innerHTML = ''
        if (Object.hasOwn(u.option_sets, c.current)) {
          u.values = u.option_sets[c.current].values
          u.display = u.option_sets[c.current].display
          for (s = u.option_sets[c.current].options, n = s.length, i = 0; i < n; i++) {
            u.e.appendChild(s[i])
          }
        } else if (Object.hasOwn(_u, u.depends)) {
          if (-1 === _u[u.depends].current_index) {
            setTimeout(_u[u.depends].get, 0)
            return void 0
          }
          if (patterns.variables.test(u.options_source)) {
            u.option_sets[c.current] = {options: [], values: [], display: []}
            s = u.option_sets[c.current].options
            u.values = u.option_sets[c.current].values
            u.display = u.option_sets[c.current].display
            for (m = site.metadata.info[_u[u.depends].current].schema.fields, n = m.length, i = 0; i < n; i++) {
              l = format_label(m[i].name)
              s[i] = u.add(i, l, m[i].name)
              u.values.push(m[i].name)
              u.display.push(l)
            }
          } else if (patterns.levels.test(u.options_source)) {
            m = variables[u.variable ? u.variable : c.current].info[(c.depends ? _u[c.depends] : c).current]
            l = m['string' === m.type ? 'levels' : 'ids']
            if (l) {
              k = (c.depends ? _u[c.depends].current : '') + c.current
              if (Object.hasOwn(u.option_sets, k)) {
                u.values = u.option_sets[k].values
                u.display = u.option_sets[k].display
                for (s = u.option_sets[k].options, n = s.length, i = 0; i < n; i++) {
                  if (s[i].length) {
                    u.e.appendChild(s[i][0])
                    u.e.appendChild(s[i][1])
                  } else u.e.appendChild(s[i])
                }
              } else {
                u.option_sets[k] = {options: [], values: [], display: []}
                s = u.option_sets[k].options
                u.values = u.option_sets[k].values
                u.display = u.option_sets[k].display
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
        }
        if (-1 !== u.default && -1 === u.current_index) {
          if ('number' !== typeof u.default) {
            u.current_index = u.values.indexOf(u.default)
            if (-1 === u.current_index) u.current_index = u.display.indexOf(u.default)
            if (-1 === u.current_index) u.current_index = parseInt(u.default)
            u.default = isNaN(u.current_index) ? -1 : u.current_index
            u.current_index = -1
            u.set(u.default)
          }
        }
        u.current_index = -2
        u.reset()
      },
      map_colors: function (u, c) {
        if (u.colors && Object.hasOwn(_u, u.colors)) {
          c = _u[u.colors]
          var d = _s[site.dataviews[u.view].dataset],
            l = variables[c.current][u.view].summaries[d],
            y = u.time ? _u[u.time].current_index : 0,
            v = site.dataviews[u.view],
            s = v.selection,
            i = s.length
          if (Object.hasOwn(site.maps, d)) {
            for (; i--; )
              if (Object.hasOwn(variables[c.current], u.view)) {
                if (s[i].layer) {
                  s[i].layer.setStyle({
                    fillOpacity: 0.7,
                    color: '#000000',
                    fillColor: pal(s[i].data[c.current][y], 'divergent', l, y),
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
          for (var s = site.dataviews[u.view].selection, i = s.length, n = 0; i--; ) {
            if (s[i].layer) {
              n++
              s[i].layer.addTo(u.displaying)
            }
          }
          if (n) u.map.flyToBounds(u.displaying.getBounds())
        }
      },
      update: function (u) {
        u.update()
      },
      dataview: function (view) {
        const f = site.dataviews[view]
        if (!f.check) compile_dataview(f)
        f.selection = []
        for (var k in entities)
          if (Object.hasOwn(entities, k) && f.check(entities[k])) {
            f.selection.push(entities[k])
          }
        if (f.selection.length) {
          for (k in variables) if (Object.hasOwn(f.selection[0].data, k)) calculate_summary(k, view, true)
          update_subs(view, 'update')
        }
        request_queue(view)
      },
    },
    elements = {
      buttongroup: {
        getter: function () {
          for (var i = this.options.length; i--; )
            if (this.options[i].checked) {
              this.update(i, true)
              break
            }
          return this.current
        },
        setter: function (v, passive) {
          if ('string' === typeof v) {
            v = this.values.indexOf(v)
          }
          if (this.current_index !== v && v !== -1) {
            this.options[v].checked = true
            this.update(v, passive)
          }
        },
        listener: function (e) {
          this.update(this.values.indexOf(e.target.value))
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
        getter: function () {
          for (var i = this.options.length; i--; ) {
            if (this.options[i].checked) {
              this.update(i, true)
              break
            }
          }
          return this.current
        },
        setter: function (v, passive) {
          if ('string' === typeof v) {
            v = this.values.indexOf(v)
          }
          if (this.current_index !== v && v !== -1) {
            this.options[v].checked = true
            this.update(v, passive)
          }
        },
        listener: function (e) {
          this.update(this.values.indexOf(e.target.value))
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
        getter: function () {
          this.current = []
          this.current_index = []
          for (var i = this.options.length; i--; ) {
            if (this.options[i].checked) {
              this.current.push(this.values[i])
              this.current_index.push(i)
            }
          }
          this.update(true)
          return this.current
        },
        setter: function (v, passive) {
          this.current = []
          this.current_index = []
          for (var i = this.values.length; i--; ) {
            if (-1 === v.indexOf(this.values[i])) {
              this.options[i].checked = false
            } else {
              this.options[i].checked = true
              this.current.push(this.values[i])
              this.current_index.push(i)
            }
          }
          this.update(passive)
        },
        listener: function (e) {
          if (e.target.checked) {
            this.current.push(e.target.value)
            this.current_index.push(this.values.indexOf(e.target.value))
          } else {
            var i = this.current.indexOf(e.target.value)
            if (i !== -1) {
              this.current.splice(i, 1)
              this.current_index.splice(i, 1)
            }
          }
          this.update()
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
        updater: function (passive) {
          this.previous = this.current
          if (Object.hasOwn(_c, this.id)) request_queue(this.id)
        },
      },
      slider: {
        getter: function () {
          this.update(parseInt(this.e.value) - this.min, true)
          return this.current
        },
        setter: function (v, i, passive) {
          if ('string' === typeof v) {
            v = this.values.indexOf(v)
          }
          if (this.current_index !== v) {
            this.e.value = v
            this.update(i, passive)
          }
        },
        listener: function (e) {
          this.update(parseInt(e.target.value) - this.min)
        },
      },
      select: {
        getter: function () {
          this.update(this.e.selectedIndex, true)
          return this.current
        },
        setter: function (v, passive) {
          if ('string' === typeof v) {
            v = this.values.indexOf(v)
          }
          if (this.current_index !== v) {
            this.e.selectedIndex = v
            this.update(v, passive)
          }
        },
        listener: function (e) {
          this.update(e.target.selectedIndex)
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
          if (this.clickto && -1 !== this.clickto.values.indexOf(d.points[0].data.id))
            this.clickto.set(d.points[0].data.id)
        },
        update: function () {
          if (this.e.layout) {
            const v = site.dataviews[this.view],
              s = v.selection
            if (s && s.length) {
              this.parsed.x = Object.hasOwn(s[0].data, this.x) ? this.x : _s[this.x]
              this.parsed.y = Object.hasOwn(s[0].data, this.y) ? this.y : _s[this.y]
              var i,
                b,
                traces = [],
                summary =
                  variables[this.parsed.y][this.view].summaries[
                    'string' === typeof v.parsed.dataset ? v.parsed.dataset : v.parsed.dataset.current
                  ]
              for (i = s.length; i--; ) {
                traces.push(make_data_entry(this, s[i]))
                if (Object.hasOwn(this.traces, 'box')) {
                  traces.push((b = JSON.parse(this.traces.box)))
                  b.x = s[i].data[this.x]
                  b.upperfence = summary.max
                  b.q3 = summary.q3
                  b.median = summary.median
                  b.q1 = summary.q1
                  b.lowerfence = summary.min
                }
              }
              if (!Object.hasOwn(this.e.layout.yaxis, 'title')) this.e.layout.yaxis.title = {text: ''}
              this.e.layout.yaxis.title.text = variables[this.parsed.y].name
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
          if (this.clickto && -1 !== this.clickto.values.indexOf(e.target.feature.properties.id))
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
              if (v.parsed.ids && v.parsed.ids.current) {
                // when showing a selected region
                entity = entities[v.parsed.ids.current]
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
          const v = site.dataviews[this.view]
          this.table.clear()
          if (v.selection) {
            for (var i = v.selection.length, y; i--; ) {
              for (y = meta.time.length; y--; ) {
                this.i = y
                this.table.row.add(v.selection[i])
              }
            }
          }
          this.table.draw()
        },
      },
    },
    updaters = {
      selects: function (i) {
        this.previous = this.current
        this.current = _s[this.id] = this.values[i]
        this.current_index = i
        if (Object.hasOwn(_c, this.id)) request_queue(this.id)
      },
    },
    check_funs = {
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
      source_equals: function (s, e) {
        return !s.current || s.current === e
      },
      source_includes: function (s, e) {
        return !s.current.length || s.current.indexOf(e) !== -1
      },
    }

  var page = {},
    variables = {},
    queue = {_timeout: 0},
    rank_rows = {},
    colors = {},
    meta = {
      time_range: [],
      time: [],
      time_variable: '',
    },
    subs = {},
    data_maps = {},
    entities = {},
    entitiesByName = {},
    _u = {},
    _s = {
      n_extremes: 10,
    },
    _c = {}

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

  function format_value(v) {
    return 'number' === typeof v ? (Math.round(v * 1e2) / 1e2 + '').replace(patterns.single_decimal, '$10') : v
  }

  function format_label(l) {
    return l.replace(patterns.seps, ' ').replace(patterns.word_start, function (w) {
      return w.toUpperCase()
    })
  }

  function add_dependency(id, o) {
    if (!Object.hasOwn(_c, id)) _c[id] = []
    _c[id].push(o)
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
    for (
      var i = e.data[u.parsed.x].length, y = u.time ? _u[u.time].current_index : 0, t = JSON.parse(u.traces.scatter);
      i--;

    ) {
      t.text[i] = e.features.name
      t.x[i] = e.data[u.parsed.x][i]
      t.y[i] = e.data[u.parsed.y][i]
    }
    t.color =
      t.line.color =
      t.marker.color =
      t.marker.line.color =
      t.textfont.color =
        color ||
        pal(
          e.data[_s[u.colors]][y],
          'divergent',
          variables[_s[u.colors]][u.view].summaries[_s[site.dataviews[u.view].dataset]],
          y
        ) ||
        '#808080'
    t.name = name || e.features.name
    t.id = e.features.id
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
    for (var i = 0, n = 6; i < n; i++) {
      e.appendChild(document.createElement('span'))
      e.lastElementChild.style.background = pal(i / n, 'divergent')
    }
  }

  function init() {
    var k, i, e, c, p, ce, ci, n, o, cond

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
        if (this.nextElementSibling.classList.contains('hidden')) {
          this.nextElementSibling.classList.remove('hidden')
          this.parentElement.style[type] = '0px'
          page.content.style[type] =
            page.content_bounds[type] -
            (type === 'top' ? 40 : 0) +
            this.parentElement.getBoundingClientRect()[type === 'left' || type === 'right' ? 'width' : 'height'] +
            'px'
        } else {
          this.parentElement.style[type] =
            -this.parentElement.getBoundingClientRect()[type === 'left' || type === 'right' ? 'width' : 'height'] +
            (type === 'top' ? page.content_bounds.top - 40 : 0) +
            'px'
          page.content.style[type] = page.content_bounds[type] + 'px'
          page.menu_toggler.timeout = setTimeout(page.menu_toggler.hide.bind(this.nextElementSibling), 700)
        }
      },
      timeout: -1,
    }
    for (i = page.menus.length; i--; ) {
      if (page.menus[i].classList.contains('menu-top')) {
        page.top_menu = page.menus[i]
        page.content_bounds.top += 40
        if (page.menus[i].firstElementChild.tagName === 'BUTTON') {
          page.menus[i].firstElementChild.addEventListener(
            'click',
            page.menu_toggler.toggle.bind(page.menus[i].firstElementChild, 'top')
          )
          page.menus[i].style.height = page.menus[i].getBoundingClientRect().height + 'px'
        }
      } else if (page.menus[i].classList.contains('menu-right')) {
        page.right_menu = page.menus[i]
        page.content_bounds.right = 40
        if (page.menus[i].firstElementChild.tagName === 'BUTTON') {
          page.menus[i].firstElementChild.addEventListener(
            'click',
            page.menu_toggler.toggle.bind(page.menus[i].firstElementChild, 'right')
          )
        }
      } else if (page.menus[i].classList.contains('menu-bottom')) {
        page.bottom_menu = page.menus[i]
        page.content_bounds.bottom = 40
        if (page.menus[i].firstElementChild.tagName === 'BUTTON') {
          page.menus[i].firstElementChild.addEventListener(
            'click',
            page.menu_toggler.toggle.bind(page.menus[i].firstElementChild, 'bottom')
          )
          page.menus[i].style.height = page.menus[i].getBoundingClientRect().height + 'px'
        }
      } else if (page.menus[i].classList.contains('menu-left')) {
        page.left_menu = page.menus[i]
        page.content_bounds.left = 40
        if (page.menus[i].firstElementChild.tagName === 'BUTTON') {
          page.menus[i].firstElementChild.addEventListener(
            'click',
            page.menu_toggler.toggle.bind(page.menus[i].firstElementChild, 'left')
          )
        }
      }
    }
    function content_resize() {
      page.content.style.top =
        page.content_bounds.top +
        (page.top_menu && !page.top_menu.lastElementChild.classList.contains('hidden')
          ? page.top_menu.getBoundingClientRect().height - 40
          : 0) +
        'px'
      if (page.right_menu) {
        page.content.style.right =
          page.content_bounds.right +
          (page.right_menu.lastElementChild.classList.contains('hidden')
            ? 0
            : page.right_menu.getBoundingClientRect().width) +
          'px'
      } else if (page.bottom_menu) {
        page.content.style.bottom =
          page.content_bounds.bottom +
          (page.bottom_menu.lastElementChild.classList.contains('hidden')
            ? 0
            : page.bottom_menu.getBoundingClientRect().height) +
          'px'
      } else if (page.left_menu) {
        page.content.style.left =
          page.content_bounds.left +
          (page.left_menu.lastElementChild.classList.contains('hidden')
            ? 0
            : page.left_menu.getBoundingClientRect().width) +
          'px'
      }
    }
    content_resize()
    window.addEventListener('resize', content_resize)

    // initialize inputs
    for (c = document.getElementsByClassName('auto-input'), i = c.length, n = 0; i--; ) {
      e = c[i]
      o = {
        type: e.getAttribute('auto-type'),
        default: e.getAttribute('default'),
        options_source: e.getAttribute('auto-options'),
        depends: e.getAttribute('depends'),
        variable: e.getAttribute('variable'),
        dataset: e.getAttribute('dataset') || site.metadata.datasets[0],
        id: e.id || e.options_source || 'ui' + n++,
        current: '',
        current_index: -1,
        previous: '',
        e: e,
        values: [],
        display: [],
        data: [],
      }
      if (Object.hasOwn(elements, o.type)) {
        p = elements[o.type]
        o.options = o.type === 'select' ? e.children : e.getElementsByTagName('input')
        o.update = o.type === 'checkbox' ? p.updater.bind(o) : updaters.selects.bind(o)
        o.set = p.setter.bind(o)
        o.get = p.getter.bind(o)
        if (p.adder) o.add = p.adder.bind(o)
        o.reset = function () {
          if (this.default !== this.current_index) this.set(this.default)
        }.bind(o)
        o.listen = p.listener.bind(o)
        _u[o.id] = o

        // resolve options
        if (o.options_source) {
          if (patterns.datasets.test(o.options_source)) {
            for (ci = site.metadata.datasets.length; ci--; ) {
              o.add(ci, site.metadata.datasets[ci], format_label(site.metadata.datasets[ci]))
            }
            o.options = e.getElementsByTagName(o.type === 'select' ? 'option' : 'input')
          } else if (o.depends) {
            add_dependency(o.depends, {type: 'options', current: '', id: o.id})
          }
        }

        // retrieve option values
        if (o.type === 'slider') {
          o.values = o.display = o.options = []
          if (o.variable) {
            o.min = o.e.min = variables[o.variable].info[o.dataset].min
            o.max = o.e.max = variables[o.variable].info[o.dataset].max
          } else {
            o.min = parseInt(o.e.min)
            o.max = parseInt(o.e.max)
          }
          if ('number' !== typeof o.default || o.default > o.max || o.default < o.min) o.default = o.max
          o.e.value = o.current = o.default
          for (ci = o.min, n = o.max; ci <= n; ci++) {
            o.values.push(ci)
          }
        } else {
          for (ci = o.options.length; ci--; ) {
            o.values[ci] = o.options[ci].value
            o.display[ci] = format_label(o.options[ci].innerText.trim() || o.values[ci])
          }
          if ('checkbox' === o.type) {
            o.default = o.default.split(',')
          } else if (o.values.length) {
            o.current_index = o.values.indexOf(o.default)
            if (-1 === o.current_index) o.current_index = o.display.indexOf(o.default)
            if (-1 === o.current_index) o.current_index = parseInt(o.default)
            o.default = isNaN(o.current_index) ? -1 : o.current_index
            o.current_index = -1
            o.set(o.default)
          }
        }
        o.get()

        // add listeners
        if ('select' === o.type || 'slider' === o.type) {
          e.addEventListener('input', o.listen)
          if (e.nextElementSibling && e.nextElementSibling.classList.contains('select-reset')) {
            e.nextElementSibling.addEventListener('click', o.reset)
          }
        } else {
          for (ci = o.options.length; ci--; ) o.options[ci].addEventListener('click', o.listen)
        }

        // update display condition
        if ((cond = e.getAttribute('condition'))) {
          add_dependency(cond, {type: 'display', current: '', id: o.id})
          if (Object.hasOwn(_s, cond) && _s[cond] === o.id) {
            e.parentElement.parentElement.classList.remove('hidden')
          }
        }
      }
    }

    // initialize dataviews
    if (site.dataviews)
      for (k in site.dataviews)
        if (Object.hasOwn(site.dataviews, k)) {
          e = site.dataviews[k]
          if (e.dataset && 'string' === typeof e.dataset && Object.hasOwn(_u, e.dataset)) {
            add_dependency(e.dataset, {type: 'dataview', current: '', id: k})
          }
          if (e.ids && 'string' === typeof e.ids && Object.hasOwn(_u, e.ids)) {
            add_dependency(e.ids, {type: 'dataview', current: '', id: k})
          }
          for (cond in e.features)
            if (Object.hasOwn(e.features, cond)) {
              if ('string' === typeof e.features[cond] && Object.hasOwn(_u, e.features[cond])) {
                add_dependency(e.features[cond], {type: 'dataview', current: '', id: k})
              }
            }
        }

    // initialize rules
    if (site.rules && site.rules.length) {
      for (ci = site.rules.length; ci--; ) {
        for (e = site.rules[ci].condition, n = e.length, i = 0; i < n; i++) {
          if (Object.hasOwn(check_funs, e[i].type)) {
            e[i].check = function () {
              return check_funs[this.type](
                Object.hasOwn(_u, this.id) ? _u[this.id].current : this.id,
                Object.hasOwn(_u, this.value) ? _u[this.value].current : this.value
              )
            }.bind(e[i])
            if (Object.hasOwn(_u, e[i].id)) {
              add_dependency(e[i].id, {type: 'rule', current: '', id: e[i].id, condition: e[i], rule: ci})
            }
          }
        }
      }
    }

    // initialize outputs
    for (c = document.getElementsByClassName('auto-output'), i = c.length, n = 0; i--; ) {
      e = c[i]
      n = meta.time.length
      o = {
        type: e.getAttribute('auto-type'),
        view: e.getAttribute('data-view'),
        id: e.id || 'out' + n++,
        e: e,
      }
      _u[o.id] = o
      if (o.view) if (!Object.hasOwn(_c, o.view)) _c[o.view] = []
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
        for (ce = e.getElementsByClassName('measure-table'), ci = ce.length; ci--; ) {
          init_measure_table(ce[ci])
        }
      } else if ('rank' === o.type) {
        e.firstElementChild.firstElementChild.appendChild((e = document.createElement('tr')))
        e.appendChild(document.createElement('th'))
        e.lastElementChild.innerText = _u.shapes.display[_u.shapes.current_index]
        for (ci = 0; ci < n; ci++) {
          e.appendChild(document.createElement('th'))
          e.lastElementChild.innerText = meta.time[ci]
        }
      } else if ('table' === o.type) {
        e.appendChild(document.createElement('tHead'))
        e.appendChild(document.createElement('tBody'))
        o.options = site.tables && site.tables[o.id]
        o.update = elements.table.update.bind(o)
        o.headers = {}
        if (o.options && o.options.variables) {
          // for(ci = o.options.variables; ci--;){}
        } else {
          for (k in variables)
            if (Object.hasOwn(variables, k)) {
              for (ci = variables[k].datasets.length; ci--; ) p = variables[k].datasets[ci]
              if (!Object.hasOwn(o.headers, p)) o.headers[p] = []
              o.headers[p].push(
                'ID' === k
                  ? {title: 'ID', data: 'features.id'}
                  : {
                      title: format_label(k),
                      data: 'data.' + k,
                      render: function (d) {
                        return d[this.i]
                      }.bind(o),
                    }
              )
            }
        }
        _c[o.view].push({type: 'update', current: '', id: o.id})
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
            add_dependency(o.x, {type: 'update', current: '', id: o.id})
          }
          if (o.y && !Object.hasOwn(variables, o.y)) {
            add_dependency(o.y, {type: 'update', current: '', id: o.id})
          }
          if (o.time && Object.hasOwn(_u, o.time)) {
            add_dependency(o.time, {type: 'update', current: '', id: o.id})
          }
          _c[o.view].push({type: 'update', current: '', id: o.id})
          queue_init_plot.bind(o)()
        }
      } else if ('map' === o.type) {
        o.options = site.maps[o.id].options
        o.colors = e.getAttribute('color')
        o.time = e.getAttribute('color-time')
        o.click = e.getAttribute('click')
        if (o.click && Object.hasOwn(_u, o.click)) o.clickto = _u[o.click]
        o.show = function (e) {
          if (e.layer) {
            e.layer.setStyle({
              color: '#ffffff',
            })
          }
        }
        o.revert = function (e) {
          if (e.layer) {
            e.layer.setStyle({
              color: '#000000',
            })
          }
        }
        if (o.options && o.options.subto) for (ci = o.options.subto.length; ci--; ) add_subs(o.options.subto[ci], o)
        if (o.colors) {
          if (o.view) add_dependency(o.view, {type: 'map_colors', current: '', id: o.id})
          add_dependency(o.colors, {type: 'map_colors', current: '', id: o.id})
        }
        if (o.time) {
          add_dependency(o.time, {type: 'map_colors', current: '', id: o.id})
        }
        if (!e.style.height) e.style.height = o.options.height ? o.options.height : '400px'
        _c[o.view].push({type: 'map_shapes', current: '', id: o.id})
        queue_init_map.bind(o)()
      }
    }
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
    var q = [p * (n - 1), 0, 0, 0]
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
              max: [],
              q3: [],
              mean: [],
              norm_median: [],
              median: [],
              q1: [],
              min: [],
            }
            for (y = meta.time.length; y--; ) {
              m.order[s].push([])
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
      dataset = 'string' === typeof v.parsed.dataset ? v.parsed.dataset : v.parsed.dataset.current,
      m = variables[measure][view],
      mo = m.order[dataset],
      ms = m.summaries[dataset],
      ny = meta.time.length
    var n, i, id, dim, en, e, y, q1, q3
    for (y = meta.time.length; y--; ) {
      mo[y] = []
      ms.mean[y] = 0
      ms.max[y] = -Infinity
      ms.min[y] = Infinity
    }
    n = []
    for (i = v.selection.length; i--; ) {
      en = v.selection[i]
      id = en.features.id
      e = rank_rows[id] = document.createElement('tr')
      e.appendChild(document.createElement('td'))
      e.lastElementChild.innerText = en.features.name
      for (y = 0; y < ny; y++) {
        dim = en.data[measure][y]
        e.appendChild(document.createElement('td'))
        e.lastElementChild.appendChild(document.createElement('span'))
        e.lastElementChild.lastElementChild.className = 'value'
        e.lastElementChild.appendChild(document.createElement('div'))
        e.lastElementChild.lastElementChild.className = 'rank-bar'
        if (full) {
          mo[y].push([id, dim])
        }
        if ('number' === typeof dim) {
          if (!n[y]) n[y] = 0
          ms.mean[y] += dim
          n[y]++
        }
      }
    }
    if (full) {
      for (y = 0; y < ny; y++) {
        mo[y].sort(function sf(a, b) {
          return a[1] - b[1]
        })
      }
      for (y = 0; y < ny; y++) {
        if (n[y]) {
          q1 = quantile_inds(0.25, n[y])
          q3 = quantile_inds(0.75, n[y])
          ms.max[y] = mo[y][n[y] - 1][1]
          ms.q3[y] = q3[2] * mo[y][q3[0]][1] + q3[1] * mo[y][q3[3]][1]
          ms.mean[y] = ms.mean[y] / n[y]
          ms.median[y] = mo[y][Math.floor(0.5 * n[y])][1]
          ms.q1[y] = q1[2] * mo[y][q1[0]][1] + q1[1] * mo[y][q1[3]][1]
          ms.min[y] = mo[y][0][1]
        } else {
          ms.max[y] = 1
          ms.q3[y] = 0.75
          ms.mean[y] = 0
          ms.median[y] = 0.5
          ms.q1[y] = 0.25
          ms.min[y] = 0
        }
        ms.norm_median[y] = ms.max[y] - ms.min[y] ? (ms.median[y] - ms.min[y]) / (ms.max[y] - ms.min[y]) : ms.median[y]
      }
    } else {
      for (y = 0; y < ny; y++) ms.mean[y] = n[y] ? ms.mean[y] / n[y] : 0
    }
  }

  function make_aggregates(map) {
    var id,
      m,
      s,
      v,
      y,
      sets = {}
    for (id in map)
      if (Object.hasOwn(site.data, id)) {
        d = site.data[id]
        m = map[id]
        for (s in m)
          if (Object.hasOwn(d, s)) {
            if (!Object.hasOwn(sets, s)) {
              sets[s] = {}
            }
            if (!Object.hasOwn(sets[s], m[s])) {
              sets[s][m[s]] = JSON.parse(JSON.stringify(d[s]))
            } else {
              for (v in d[s])
                if (Object.hasOwn(d[s], v)) {
                  for (y = d[s][v].length; y--; ) {
                    sets[s][m[s]][v][y] += d[s][v][y]
                  }
                }
            }
          }
      }
  }

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
            if (!meta.time.length && v[i].name === t) {
              meta.time_range[0] = v[i].min
              meta.time_range[1] = v[i].max
              meta.time_variable = t
              for (ti = v[i].max - v[i].min + 1; ti--; ) meta.time.push(v[i].min + ti)
            }
          }
        }
      }
  }

  function map_entities(g) {
    var id, f, k
    for (var id in site.data[g])
      if (Object.hasOwn(site.data[g], id)) {
        f = data_maps[g][id]
        entities[id] = {group: g, data: site.data[g][id], features: f}
        if (f) {
          entitiesByName[f.name] = entities[id]
          if (Object.hasOwn(f, 'district') && id.length > 5) {
            f.county = id.substr(0, 5)
          }
        }

        // fill out location hierarchies
        // for (k in f)
        //   if (Object.hasOwn(site.data, k)) {
        //     if (!Object.hasOwn(f, 'parents')) f.parents = []
        //     f.parents.push(f[k])
        //   }
      }
  }

  function get_checkfun(e) {
    return check_funs[
      'string' === typeof e
        ? 'equals'
        : Object.hasOwn(e, 'current')
        ? 'object' === typeof e.current
          ? 'source_includes'
          : 'source_equals'
        : 'includes'
    ]
  }

  function compile_dataview(v) {
    v.parsed = {
      dataset: v.dataset ? (Object.hasOwn(site.data, v.dataset) ? v.dataset : _u[v.dataset]) : false,
      ids: 'string' === typeof v.ids && Object.hasOwn(_u, v.ids) ? _u[v.ids] : v.ids,
      features: v.features ? {} : false,
    }
    v.ids_check = get_checkfun(v.parsed.ids)
    v.feature_checks = {}
    if (v.parsed.features)
      for (var k in v.features)
        if (Object.hasOwn(v.features, k)) {
          v.parsed.features[k] =
            'object' === typeof v.features[k] || !Object.hasOwn(_u, v.features[k]) ? v.features[k] : _u[v.features[k]]
          v.feature_checks[k] = get_checkfun(v.parsed.features[k])
        }
    v.k = ''
    v.checks = {
      dataset: ('string' === typeof v.parsed.dataset
        ? function (e) {
            return this.parsed.dataset === e.group
          }
        : function (e) {
            return this.parsed.dataset.current === e.group
          }
      ).bind(v),
      ids: ('object' === typeof v.parsed.ids && Object.hasOwn(v.parsed.ids, 'dataset')
        ? function (e) {
            return (
              e.features &&
              this.ids_check(
                this.parsed.ids,
                Object.hasOwn(e.features, _s[this.parsed.ids.depends])
                  ? e.features[_s[this.parsed.ids.depends]]
                  : e.features.id
              )
            )
          }
        : function (e) {
            return e.features && this.ids_check(this.parsed.ids, e.features.id)
          }
      ).bind(v),
      features: function (e) {
        for (this.k in this.features)
          if (Object.hasOwn(this.features, this.k)) {
            return e.features && this.feature_checks[k](this.parsed.features[k], e.features[k])
          }
      }.bind(v),
    }
    v.check = function (e) {
      return (
        (!this.parsed.ids || this.checks.ids(e)) &&
        (!this.parsed.features || this.checks.features(e)) &&
        (!this.parsed.dataset || this.checks.dataset(e))
      )
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
        i,
        ci,
        n,
        r = [],
        pass,
        k
      for (i = d.length; i--; ) {
        if ('rule' === d[i].type) {
          if (-1 === r.indexOf(d[i].rule)) {
            r.push(site.rules[d[i].rule])
          }
        } else {
          if (
            Object.hasOwn(conditionals, d[i].type) &&
            (force || !c || 'string' !== typeof c.current || d[i].current !== c.current)
          ) {
            conditionals[d[i].type]('dataview' === d[i].type ? d[i].id : _u[d[i].id], c)
            if (c) d[i].current = c.current
          }
        }
      }
      if (r)
        for (i = r.length; i--; ) {
          for (n = r[i].condition.length, ci = 0; ci < n; ci++) {
            pass = r[i].condition[ci].check()
            if (!pass) break
          }
          if (pass) {
            for (k in r[i].effects)
              if (Object.hasOwn(_u, k)) {
                _u[k].set(r[i].effects[k])
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
    if (window.jQuery && window.DataTable) {
      this.table = $(this.e).DataTable({
        columns: this.headers[_s[site.dataviews[this.view].dataset]],
      })
    } else {
      setTimeout(queue_init_table.bind(this), 10)
    }
  }

  function queue_init() {
    if (document.readyState !== 'loading') {
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

  if (site && site.data) {
    queue_init()
  } else if (site && site.metadata.file) {
    load_data(site.metadata.file)
  } else {
    throw new Error('No data or metadata information present')
  }
})()
