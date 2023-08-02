import Community from '.'
import {Options, elements} from './elements'

export function init(this: Community) {
  if (this.data.variables) {
    const variable = Object.keys(this.data.variables)
    this.defaults.variable = variable[variable.length - 1]
  }
  if (!this.spec.map) this.spec.map = {}
  if (!this.spec.map._overlay_property_selectors) this.spec.map._overlay_property_selectors = []
  // initialize inputs
  this.registered_elements.forEach(async (o, k) => {
    if (o.type in elements) {
      const combobox = 'combobox' === o.type
      if (o.optionSource) {
        if (this.patterns.palette.test(o.optionSource)) {
          o.options = []
          Object.keys(this.palettes).forEach(v => (o.options as HTMLElement[]).push(o.add(v, this.palettes[v].name)))
          if (-1 === o.default) o.default = this.defaults.palette
        } else if (this.patterns.datasets.test(o.optionSource)) {
          if (-1 === o.default) o.default = this.defaults.dataset
          o.options = []
          this.spec.metadata.datasets.forEach(d => (o.options as HTMLElement[]).push(o.add(d)))
        } else {
          o.sensitive = false
          o.option_sets = {}
          if (this.patterns.properties.test(o.optionSource)) {
            this.spec.map._overlay_property_selectors.push(o)
          }
          if (o.depends) this.add_dependency(o.depends, {type: 'options', id: o.id})
          if (o.dataset in this.registered_elements) this.add_dependency(o.dataset, {type: 'options', id: o.id})
          if (o.view) this.add_dependency(o.view, {type: 'options', id: o.id})
          const v = this.valueOf(o.dataset) || this.defaults.dataset
          if ('string' === typeof v) {
            if (!o.dataset) o.dataset = v
            if (v in this.data.info) this.conditionals.options(o)
          }
        }
      }
      if (combobox || 'select' === o.type) {
        // resolve options
        o.set_current = this.conditionals.set_current.bind(o)
        if (Array.isArray(o.values)) {
          o.values = {}
          o.display = {}
          let new_display = true
          const select = 'select' === o.type
          o.options.forEach(e => {
            if (select) e.dataset.value = e.value
            if (new_display) new_display = e.dataset.value === e.innerText
          })
          o.options.forEach((e, i) => {
            o.values[e.dataset.value] = i
            if (new_display) e.innerText = this.data.format_label(e.dataset.value)
            o.display[e.innerText] = i
          })
          if (!(o.default in o.values) && !(o.default in _u)) {
            o.default = Number(o.default)
            if (isNaN(o.default)) o.default = -1
            if (-1 !== o.default && o.default < o.options.length) {
              o.default = o.options[o.default].dataset.value
            } else {
              o.default = -1
            }
          }
          o.source = ''
          o.id in this.spec.url_options ? o.set(this.spec.url_options[o.id]) : o.reset()
        }
        o.subset = o.e.getAttribute('data-subset') || 'all'
        o.selection_subset = o.e.getAttribute('data-selectionSubset') || o.subset
        if (o.type in site && o.id in site[o.type]) {
          o.settings = site[o.type][o.id]
          if (o.settings.filters) {
            o.filters = o.settings.filters
            o.current_filter = {}
            Object.keys(o.filters).forEach(f => {
              this.add_dependency(o.filters[f], {type: 'filter', id: o.id})
            })
            o.filter = function () {
              Object.keys(this.filters).forEach(f => {
                this.current_filter[f] = this.valueOf(this.filters[f])
              })
              let first
              Object.keys(this.values).forEach((v, i) => {
                let pass = false
                if (v in this.data.variables && 'meta' in this.data.variables[v]) {
                  for (const k in this.current_filter)
                    if (k in this.data.variables[v].meta) {
                      pass = this.data.variables[v].meta[k] === this.current_filter[k]
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
        o.min_indicator = o.e.parentElement.parentElement.querySelector('.indicator-min')
        if (o.min_indicator) {
          o.min_indicator.addEventListener(
            'click',
            function () {
              this.set(this.parsed.min)
            }.bind(o)
          )
        }
        o.max = o.e.getAttribute('max')
        o.max_ref = parseFloat(o.max)
        o.max_indicator = o.e.parentElement.parentElement.querySelector('.indicator-max')
        if (o.max_indicator) {
          o.max_indicator.addEventListener(
            'click',
            function () {
              this.set(this.parsed.max)
            }.bind(o)
          )
        }
        o.ref = isNaN(o.min_ref) || isNaN(o.max_ref)
        o.range = [o.min_ref, o.max_ref]
        o.step = parseFloat(o.e.step) || 1
        o.parsed = {min: undefined, max: undefined}
        o.depends = {}
        o.default_max = 'max' === o.default || 'last' === o.default
        o.default_min = 'min' === o.default || 'first' === o.default
        o.update = async function () {
          const view = _u[this.view],
            variable = this.valueOf(this.variable || view.y)
          if (!view.time_range) view.time_range = {time: []}
          let d = view.get ? view.get.dataset() : this.valueOf(this.dataset),
            min = this.valueOf(this.min) || view.time,
            max = this.valueOf(this.max) || view.time
          if (this.patterns.minmax.test(min)) min = _u[this.min][min]
          if (this.patterns.minmax.test(max)) max = _u[this.max][max]
          this.parsed.min = isNaN(this.min_ref)
            ? 'undefined' === typeof min
              ? view.time_range.time[0]
              : 'number' === typeof min
              ? min
              : min in this.data.variables
              ? this.data.variables[min].info[d || this.data.variables[min].datasets[0]].min
              : parseFloat(min)
            : this.min_ref
          this.parsed.max = isNaN(this.max_ref)
            ? 'undefined' === typeof max
              ? view.time_range.time[1]
              : 'number' === typeof max
              ? max
              : max in this.data.variables
              ? this.data.variables[max].info[d || this.data.variables[max].datasets[0]].max
              : parseFloat(max)
            : this.min_ref
          if (this.default_min) {
            this.current_default = this.parsed.min
          } else if (this.default_max) {
            this.current_default = this.parsed.max
          }
          if (this.ref && variable in this.data.variables) {
            this.range[0] = this.e.min = isNaN(this.min_ref)
              ? Math.max(view.time_range.time[0], this.parsed.min)
              : this.min_ref
            this.range[1] = this.e.max = isNaN(this.max_ref)
              ? Math.min(view.time_range.time[1], this.parsed.max)
              : this.max_ref
            if (!this.depends[view.y]) {
              this.depends[view.y] = true
              this.add_dependency(view.y, {type: 'update', id: this.id})
            }
            if (this.source > this.parsed.max || this.source < this.parsed.min) this.reset()
            this.variable = await this.data.get_variable(variable, this.view)
          } else {
            this.e.min = this.parsed.min
            if (this.parsed.min > this.source || (!this.source && this.default_min)) this.set(this.parsed.min)
            this.e.max = this.parsed.max
            if (this.parsed.max < this.source || (!this.source && this.default_max)) this.set(this.parsed.max)
          }
        }.bind(o)
        if (o.view) this.add_dependency(o.view, {type: 'update', id: o.id})
        if (!(o.max in this.data.variables)) {
          if (o.max in _u) {
            this.add_dependency(o.max, {type: 'max', id: o.id})
          } else o.e.max = parseFloat(o.max)
        } else if (o.view) {
          this.add_dependency(o.view + '_time', {type: 'max', id: o.id})
        }
        if (!(o.min in this.data.variables)) {
          if (o.min in _u) {
            this.add_dependency(o.min, {type: 'min', id: o.id})
          } else o.e.min = parseFloat(o.min)
        } else if (o.view) {
          this.add_dependency(o.view + '_time', {type: 'min', id: o.id})
        }
        if ('undefined' !== typeof o.default) {
          if (this.patterns.number.test(o.default)) {
            o.default = Number(o.default)
          } else
            o.reset = o.default_max
              ? function () {
                  if (this.range) {
                    this.current_default = this.valueOf(this.range[1])
                    this.set(this.current_default)
                  }
                }.bind(o)
              : o.default_max
              ? function () {
                  if (this.range) {
                    this.current_default = this.valueOf(this.range[0])
                    this.set(this.current_default)
                  }
                }.bind(o)
              : this.default in _u
              ? function () {
                  this.current_default = this.valueOf(this.default)
                  this.set(this.current_default)
                }.bind(o)
              : function () {}
        }
        if (o.variable) {
          const d = -1 === this.spec.metadata.datasets.indexOf(o.dataset) ? this.defaults.dataset : o.dataset
          if (o.variable in _u) {
            this.add_dependency(o.variable, {type: 'update', id: o.id})
          } else if (o.variable in this.data.variables) {
            o.e.min = o.min = o.parsed.min = o.range[0] = this.data.variables[o.variable].info[d].min
            o.e.max = o.max = o.parsed.max = o.range[1] = this.data.variables[o.variable].info[d].max
          }
        }
      } else if ('checkbox' === o.type) {
        o.source = []
        o.current_index = []
        o.default = o.default.split(',')
      }
      if (Array.isArray(o.values)) {
        if (!o.values.length) {
          o.values = []
          if (o.options.length) o.options.forEach(e => o.values.push(e.value || e.dataset.value))
        }
        if (o.values.length && !(o.default in _u) && -1 === o.values.indexOf(o.default)) {
          o.default = parseInt(o.default)
          o.default = o.values.length > o.default ? o.values[o.default] : ''
        }
      }

      // add listeners
      if (combobox || 'select' === o.type || 'number' === o.type || 'intext' === o.type) {
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
      } else if (o.listen) {
        o.options.forEach(oi => oi.addEventListener('click', o.listen))
      }
      // initialize settings inputs
      if (this.patterns.settings.test(o.id)) {
        o.setting = o.id.replace(this.patterns.settings, '')
        if (null == o.default && o.setting in this.spec.settings) o.default = this.spec.settings[o.setting]
        this.add_dependency(o.id, {type: 'setting', id: o.id})
      }
      if (!o.view) o.view = this.defaults.dataview
      const v = this.spec.url_options[o.id] || storage.get(o.id.replace(this.patterns.settings, ''))
      if (v) {
        o.set(this.patterns.bool.test(v) ? !!v || 'true' === v : v)
      } else o.reset && o.reset()
    }
  })
  // initialize dataviews
  Object.keys(this.spec.dataviews).forEach(k => {
    const e = this.spec.dataviews[k]
    _u[k] = e
    e.id = k
    e.value = function () {
      if (this.get) {
        this.reparse()
        return (
          '' +
          this.parsed.dataset +
          _u._entity_filter.entities.size +
          this.data.inited[this.parsed.dataset] +
          this.parsed.id_source +
          Object.keys(this.parsed.ids) +
          this.parsed.features +
          this.parsed.variables +
          this.spec.settings.summary_selection
        )
      }
    }.bind(e)
    if ('string' === typeof e.palette && e.palette in _u) {
      this.add_dependency(e.palette, {type: 'dataview', id: k})
    }
    if ('string' === typeof e.dataset && e.dataset in _u) {
      this.add_dependency(e.dataset, {type: 'dataview', id: k})
    }
    if ('string' === typeof e.ids && e.ids in _u) {
      this.add_dependency(e.ids, {type: 'dataview', id: k})
    }
    e.time_range = {dataset: '', variable: '', index: [], time: [], filtered: []}
    this.add_dependency(k, {type: 'time_range', id: k})
    this.add_dependency('_base_filter', {type: 'dataview', id: k})
    this.add_dependency('_entity_filter', {type: 'dataview', id: k})
    if (e.x in _u) this.add_dependency(e.x, {type: 'time_range', id: k})
    if (e.y in _u) this.add_dependency(e.y, {type: 'time_range', id: k})
    if (e.features)
      Object.keys(e.features).forEach(f => {
        if ('string' === typeof e.features[f] && e.features[f] in _u) {
          this.add_dependency(e.features[f], {type: 'dataview', id: k})
        }
      })
    if (e.variables)
      e.variables.forEach(v => {
        if ('variable' in v) {
          if (v.variable in _u) {
            this.add_dependency(v.variable, {type: 'dataview', id: k})
          }
        } else e.variables.splice(i, 1)
        if ('type' in v) {
          if (v.type in _u) {
            this.add_dependency(v.type, {type: 'dataview', id: k})
          }
        } else v.type = '='
        if ('value' in v) {
          if (v.value in _u) {
            this.add_dependency(v.value, {type: 'dataview', id: k})
          }
        } else v.value = 0
      })
    compile_dataview(e)
    this.conditionals.dataview(e)
    e.reparse()
  })
  // initialize outputs
  document.querySelectorAll('.auto-output').forEach(elements.init_output)

  // make filter popup
  e = page.modal.filter
  e.body.className = 'filter-dialog'

  // // entity filter
  e.body.appendChild((e.entity_filters = document.createElement('div')))
  e.entity_filters.appendChild(document.createElement('p'))
  e.entity_filters.lastElementChild.className = 'h6'
  e.entity_filters.lastElementChild.innerText = 'Select Entities'
  e.entity_filters.lastElementChild.appendChild(document.createElement('span'))
  e.entity_filters.lastElementChild.lastElementChild.className = 'note'
  e.entity_filters.lastElementChild.lastElementChild.innerText = '(click disabled selectors to load)'
  e.entity_filters.appendChild(document.createElement('div'))
  e.entity_filters.lastElementChild.className = 'row'
  e.entity_inputs = {}
  Object.keys(this.data.loaded)
    .reverse()
    .forEach(d => {
      const u = elements.combobox.create(d, void 0, {search: true, multi: true, clearable: true}, 'filter.' + d)
      e.entity_inputs[d] = u
      e.entity_filters.lastElementChild.appendChild(document.createElement('div'))
      e.entity_filters.lastElementChild.lastElementChild.className = 'col-sm'
      e.entity_filters.lastElementChild.lastElementChild.appendChild(u.e.parentElement)
      u.e.parentElement.classList.add('form-floating')
      u.listbox.classList.add('multi')
      u.option_sets = {}
      u.dataset = d
      u.loader = function () {
        this.data.retrieve(this.dataset, this.data.info[this.dataset].site_file)
        this.e.removeEventListener('click', this.loader)
      }.bind(u)
      if (!this.data.loaded[d]) {
        u.e.addEventListener('click', u.loader)
      }
      u.onchange = function () {
        this.conditionals.id_filter()
        request_queue('_entity_filter')
      }.bind(u)
      u.set_current = this.conditionals.set_current.bind(u)
      fill_ids_options(
        u,
        d,
        u.option_sets,
        function () {
          this.set_current()
          toggle_input(this, !!this.options.length)
          Object.keys(this.values).forEach(id => {
            _u._entity_filter.entities.set(id, this.data.entities[id])
          })
          _u._entity_filter.registered[d] = true
          this.set(this.id in this.spec.url_options ? this.spec.url_options[this.id].split(',') : -1)
        }.bind(u)
      )
      toggle_input(u, !!u.options.length)
    })

  // // variable filter
  e.body.appendChild((e.variable_filters = document.createElement('div')))
  e.variable_filters.appendChild(document.createElement('p'))
  e.variable_filters.lastElementChild.className = 'h6'
  e.variable_filters.lastElementChild.innerText = 'Variable Conditions'

  function add_filter_condition(variable, presets) {
    presets = presets || {}
    const e = document.createElement('tr'),
      f = {
        e,
        variable: variable,
        component: presets.component || 'last',
        operator: presets.operator || '>=',
        value: presets.value || 0,
        active: true,
        id: variable + '_' + Date.now(),
        passed: 0,
        failed: 0,
        info: this.data.variables[variable].info,
        view: _u[this.defaults.dataview],
      },
      d = f.view.get.dataset(),
      range = f.info[d].time_range,
      times = this.data.meta.overall.value
    _u._base_filter.c.set(f.id, f)
    if (presets.time_component) f.component = String(times[f.component])

    let ee
    // variable name
    e.appendChild(document.createElement('td'))
    e.lastElementChild.appendChild((ee = document.createElement('p')))
    ee.id = f.id
    ee.className = 'cell-text'
    ee.innerText = f.info[d].info.short_name
    e.lastElementChild.appendChild(document.createElement('p'))
    f.summary = {
      f,
      update: function () {
        const d = this.f.view.get.dataset(),
          range = this.f.info[d].time_range,
          times = this.data.meta.overall.value
        if (d !== this.add.Dataset) {
          this.add.Dataset = d
          this.add.First = times[range[0]] || 'NA'
          this.add.Last = times[range[1]] || 'NA'
          const s = this.f.info[d]
          for (let i = this.table.firstElementChild.childElementCount; i--; ) {
            const h = this.table.firstElementChild.children[i].innerText,
              n = h.toLowerCase()
            this.table.lastElementChild.children[i].innerText = n in s ? this.data.format_value(s[n]) : this.add[h]
          }
        }
      },
      add: {
        Dataset: d,
        First: times[range[0]] || 'NA',
        Last: times[range[1]] || 'NA',
      },
    }
    f.summary.table = make_summary_table(e.lastElementChild.lastElementChild, f.info[d], f.summary.add)

    // filter result
    e.appendChild(document.createElement('td'))
    e.lastElementChild.appendChild((ee = document.createElement('p')))
    ee.setAttribute('aria-describedby', f.id)
    ee.className = 'cell-text'
    ee.innerText = '0/0'

    // active switch
    e.appendChild(document.createElement('td'))
    e.lastElementChild.appendChild((ee = document.createElement('label')))
    ee.innerText = 'Active'
    ee.className = 'filter-label'
    ee.id = f.id + '_switch'
    e.lastElementChild.appendChild((ee = document.createElement('div')))
    ee.className = 'form-check form-switch filter-form-input'
    ee.appendChild((ee = document.createElement('input')))
    ee.className = 'form-check-input'
    ee.type = 'checkbox'
    ee.role = 'switch'
    ee.setAttribute('aria-labelledby', f.id + '_switch')
    ee.setAttribute('aria-describedby', f.id)
    ee.checked = true
    ee.addEventListener(
      'change',
      function () {
        f.active = !f.active
        request_queue('_base_filter')
      }.bind(f)
    )

    // component combobox
    e.appendChild(document.createElement('td'))
    e.lastElementChild.appendChild((ee = document.createElement('label')))
    ee.innerText = 'Component'
    ee.className = 'filter-label'
    ee.id = f.id + '_component'
    const comp_select = elements.combobox.create('component', filter_components.Time)
    comp_select.default = f.component
    comp_select.set(f.component)
    e.lastElementChild.appendChild(comp_select.e.parentElement)
    comp_select.e.parentElement.removeChild(comp_select.e.parentElement.lastElementChild)
    comp_select.e.parentElement.classList.add('filter-form-input')
    comp_select.e.setAttribute('aria-labelledby', f.id + '_component')
    comp_select.input_element.setAttribute('aria-labelledby', f.id + '_component')
    comp_select.input_element.setAttribute('aria-describedby', f.id)
    comp_select.listbox.setAttribute('aria-labelledby', f.id + '_component')
    comp_select.onchange = function () {
      f.component = this.value()
      request_queue('_base_filter')
    }.bind(comp_select)

    // operator select
    e.appendChild(document.createElement('td'))
    e.lastElementChild.appendChild((ee = document.createElement('label')))
    ee.innerText = 'Operator'
    ee.className = 'filter-label'
    ee.id = f.id + '_operator'
    e.lastElementChild.appendChild((ee = document.createElement('select')))
    ee.className = 'form-select filter-form-input'
    ee.setAttribute('aria-labelledby', f.id + '_operator')
    ee.setAttribute('aria-describedby', f.id)
    ee.addEventListener('change', e => {
      f.operator = e.target.selectedOptions[0].value
      request_queue('_base_filter')
    })
    ;['>=', '=', '!=', '<='].forEach(k => {
      ee.appendChild(document.createElement('option'))
      ee.lastElementChild.value = ee.lastElementChild.innerText = k
      if (k === f.operator) ee.lastElementChild.selected = true
    })

    // value input
    e.appendChild(document.createElement('td'))
    e.lastElementChild.appendChild((ee = document.createElement('label')))
    ee.innerText = 'Value'
    ee.className = 'filter-label'
    ee.id = f.id + '_value'
    const value_select = elements.combobox.create('component', ['min', 'q1', 'median', 'mean', 'q3', 'max'])
    value_select.value_type = 'number'
    value_select.default = f.value
    value_select.set(f.value)
    e.lastElementChild.appendChild(value_select.e.parentElement)
    value_select.e.parentElement.removeChild(value_select.e.parentElement.lastElementChild)
    value_select.e.parentElement.classList.add('filter-form-input')
    value_select.e.setAttribute('aria-labelledby', f.id + '_value')
    value_select.input_element.setAttribute('aria-labelledby', f.id + '_value')
    value_select.input_element.setAttribute('aria-describedby', f.id)
    value_select.listbox.setAttribute('aria-labelledby', f.id + '_value')
    value_select.onchange = async function (f) {
      f.value = this.value()
      if (this.patterns.number.test(f.value)) {
        f.value = Number(f.value)
        f.value_source = ''
      } else {
        f.view.reparse()
        const v = await this.data.get_variable(f.variable, f.view.id),
          s = v && v.views[f.view.id].summaries[f.view.parsed.dataset]
        if (s && f.value in s) {
          const a = f.view.parsed.variable_values.get(f.id)
          f.value_source = f.value
          f.value = s[f.value][a.comp_fun(a, f.view.parsed)]
        }
      }
      request_queue('_base_filter')
    }.bind(value_select, f)

    // remove button
    e.appendChild(document.createElement('td'))
    e.lastElementChild.appendChild((ee = document.createElement('label')))
    ee.innerText = 'Remove'
    ee.className = 'filter-label'
    ee.id = f.id + '_remove'
    e.lastElementChild.appendChild((ee = document.createElement('button')))
    ee.className = 'btn-close filter-form-input'
    ee.type = 'button'
    ee.setAttribute('aria-labelledby', f.id + '_remove')
    ee.setAttribute('aria-describedby', f.id)
    ee.addEventListener(
      'mouseup',
      function (e) {
        if (1 === e.which) {
          this.e.parentElement.removeChild(this.e)
          _u._base_filter.c.delete(this.id)
          if (!_u._base_filter.c.size) page.modal.filter.variable_filters.lastElementChild.classList.add('hidden')
          request_queue('_base_filter')
        }
      }.bind(f)
    )
    request_queue('_base_filter')
    page.modal.filter.conditions.lastElementChild.appendChild(e)
    page.modal.filter.variable_filters.lastElementChild.classList.remove('hidden')
  }

  // variable filter dropdown
  e.variable_filters.appendChild((ee = document.createElement('div')))
  ee.className = 'row'

  ee.appendChild(document.createElement('div'))
  ee.lastElementChild.className = 'col'
  ee.lastElementChild.appendChild((c = document.createElement('div')))

  const filter_select = elements.combobox.create(
    'Add Variable Condition',
    void 0,
    {strict: true, search: true, clearable: true, floating: true, accordion: true, group: 'category'},
    'filter_variable_dropdown'
  )
  filter_select.input = false
  filter_select.settings.filter_table = document.querySelector('.filter-body')
  filter_select.onchange = function () {
    const value = this.value()
    if (value in this.data.variables) {
      add_filter_condition(value)
      this.selection.innerText = ''
      const input = document.querySelectorAll('.filter-body .combobox-input')
      if (input && input.length) input[input.length - 1].focus()
    }
  }.bind(filter_select)
  filter_select.view = this.defaults.dataview
  filter_select.option_sets = {}
  filter_select.optionSource = 'variables'
  this.add_dependency(this.defaults.dataview, {type: 'options', id: filter_select.id})
  c.appendChild(filter_select.e.parentElement)

  // variable filter table
  e.variable_filters.appendChild((ee = document.createElement('div')))
  ee.className = 'hidden'
  ee.appendChild((e.conditions = ee = document.createElement('table')))
  ee.className = 'table'
  ee.appendChild((ee = document.createElement('thead')))
  ee.className = 'filter-header'
  e.conditions.appendChild(document.createElement('tbody'))
  e.conditions.lastElementChild.className = 'filter-body'
  ee.appendChild((ee = document.createElement('tr')))
  ;['Variable', 'Result', 'Active', 'Component', 'Operator', 'Value', 'Remove'].forEach(h => {
    ee.appendChild(document.createElement('th'))
    if ('Component' === h || 'Result' === h) {
      const l =
        'Component' === h
          ? {
              wrapper: document.createElement('label'),
              id: 'filter_component_header',
              note: 'Component refers to which single value to filter on for each entity; select a dynamic time reference, or enter a time.',
            }
          : {
              wrapper: document.createElement('label'),
              id: 'filter_result_header',
              note: 'Passing / total entities across loaded datasets.',
            }
      ee.lastElementChild.appendChild(l.wrapper)
      ee.lastElementChild.className = 'has-note'
      l.wrapper.innerText = h
      l.wrapper.id = l.id
      l.wrapper.setAttribute('data-of', l.id)
      l.wrapper.setAttribute('aria-description', l.note)
      ee.lastElementChild.addEventListener('mouseover', tooltip_trigger.bind(l))
    } else {
      ee.lastElementChild.innerText = h
    }
  })
  e.variable_filters.lastElementChild.appendChild((ee = document.createElement('p')))
  ee.className = 'note'
  ee.innerText = 'Summaries are across time within each unfiltered dataset.'

  keys._u = Object.keys(_u)
  if (this.spec.query) {
    this.spec.parsed_query = this.data.parse_query(this.spec.query)
    if (this.spec.parsed_query.variables.conditions.length) {
      this.spec.parsed_query.variables.conditions.forEach(f => {
        const info = this.data.variable_info[f.name]
        if (info) add_filter_condition(f.name, f)
      })
    }
  }
}
