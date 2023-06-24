(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.DataHandler = factory());
})(this, (function () { 'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */


    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (g && (g = 0, op[0] && (_ = 0)), _) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    var defaults = {
        file_format: 'csv',
        table_format: 'mixed',
        features: { ID: 'id', Name: 'name' },
        feature_conditions: [],
        variables: {
            filter_by: [],
            conditions: [],
        },
    };
    var options = {
        file_format: ['csv', 'tsv'],
        table_format: ['tall', 'mixed', 'wide'],
        filter_components: ['first', 'min', 'mean', 'sum', 'max', 'last'],
    };

    var group_checks = {
        '!': function (v) {
            return this !== v;
        },
        '=': function (v) {
            return this === v;
        },
        includes: function (v) {
            return -1 !== this.indexOf(v);
        },
        excludes: function (v) {
            return -1 === this.indexOf(v);
        },
    };
    var export_checks = {
        file_format: function (a) {
            return -1 === options.file_format.indexOf(a);
        },
        table_format: function (a) {
            return -1 === options.table_format.indexOf(a);
        },
        include: function (a, vars) {
            for (var i = a.length; i--;) {
                if (!(a[i] in vars))
                    return a[i];
            }
            return '';
        },
    };
    var value_checks = {
        '!': function (a) {
            return !a || -1 == a;
        },
        '': function (a) {
            return !!a && -1 != a;
        },
        '=': function (a, b) {
            return a === b;
        },
        '!=': function (a, b) {
            return a != b;
        },
        '>': function (a, b) {
            return a > b;
        },
        '<': function (a, b) {
            return a < b;
        },
        '>=': function (a, b) {
            return a >= b;
        },
        '<=': function (a, b) {
            return a <= b;
        },
        equals: function (s, e) {
            return !s || -1 == s || s === e;
        },
        includes: function (s, e) {
            return !s || !s.length || -1 !== s.indexOf(e);
        },
        excludes: function (s, e) {
            return !s || !s.length || -1 === s.indexOf(e);
        },
    };

    function vector_summary(vec, range) {
        if (Array.isArray(vec)) {
            var n = Math.min(range[1] + 1, vec.length), r = {
                missing: 0,
                first: vec[0],
                min: Infinity,
                mean: 0,
                sum: 0,
                max: -Infinity,
                last: vec[n - 1],
            };
            var on = 0;
            for (var i = Math.max(range[0], 0); i < n; i++) {
                var v = vec[i];
                if ('number' === typeof v) {
                    if (isNaN(v)) {
                        r.missing++;
                    }
                    else {
                        on++;
                        if (r.min > v)
                            r.min = v;
                        if (r.max < v)
                            r.max = v;
                        r.sum += v;
                    }
                }
                else {
                    if ('NA' !== v)
                        on++;
                }
            }
            r.mean = on ? r.sum / on : 0;
            return r;
        }
        else {
            return { missing: Number(isNaN(vec)) + 0, first: vec, min: vec, mean: vec, sum: vec, max: vec, last: vec };
        }
    }
    function passes_filter(entity, time_range, filter, variables) {
        var s = {}, adjs = {};
        for (var i = filter.filter_by.length; i--;) {
            var f = filter.filter_by[i];
            var c = variables[f].code;
            if (!(c in entity.data))
                return false;
            var r = entity.group in variables[f].info
                ? variables[f].info[entity.group].time_range
                : variables[f].time_range[entity.group];
            if (!r)
                return false;
            adjs[f] = r[0];
            s[f] = vector_summary(entity.data[c], [time_range[0] - r[0], Math.max(time_range[1] - r[0], time_range[1] - r[1])]);
        }
        for (var i = filter.conditions.length; i--;) {
            var co = filter.conditions[i];
            if (!(co.time_component ? co.check(entity.data[variables[co.name].code], adjs[co.name] || 0) : co.check(s[co.name])))
                return false;
        }
        return true;
    }
    function passes_feature_filter(entities, id, filter) {
        var entity = entities[id];
        var _loop_1 = function (i) {
            var value = filter[i].value;
            if (value !== '-1') {
                if ('id' === filter[i].name && Array.isArray(value)) {
                    var pass_1 = false;
                    value.forEach(function (id) {
                        if (!pass_1) {
                            var group = id in entities && entities[id].group;
                            if (group && group in entity.features
                                ? id === entity.features[group]
                                : id.length < entity.features.id.length
                                    ? id === entity.features.id.substring(0, id.length)
                                    : id === entity.features.id)
                                pass_1 = true;
                        }
                    });
                    return { value: pass_1 };
                }
                else if (!filter[i].check(entity.features[filter[i].name]))
                    return { value: false };
            }
        };
        for (var i = filter.length; i--;) {
            var state_1 = _loop_1(i);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        return true;
    }

    var patterns = {
        seps: /[\s._-]/g,
        comma: /,/,
        word_start: /\b(\w)/g,
        single_operator: /([<>!])([^=])/,
        greater: /%3E$/,
        less: /%3C$/,
        operator_start: /[<>!]$/,
        component: /^(.+)\[(.+)\]/,
        number: /^[0-9.+-]+$/,
        non_letter_num: /[^0-9a-z]+/g,
    };

    function tall(entity, time_range, feats, vars, sep) {
        var _this = this;
        if (entity.group in this.meta.times) {
            var op_1 = [], time_1 = this.meta.times[entity.group].value;
            var tr_1 = '';
            Object.keys(feats).forEach(function (f) {
                tr_1 += '"' + entity.features[feats[f]] + '"' + sep;
            });
            vars.forEach(function (k) {
                var vc = entity.variables[k].code;
                if (vc in entity.data) {
                    var range = _this.meta.variables[entity.group][k].time_range;
                    var r = '';
                    var yn = time_range[1] + 1;
                    for (var y = time_range[0]; y < yn; y++) {
                        if (y >= range[0] && y <= range[1]) {
                            var vec = entity.data[vc];
                            var value = Array.isArray(vec) ? vec[y - range[0]] : vec;
                            if (!isNaN(value)) {
                                r += (r ? '\n' : '') + tr_1 + time_1[y] + sep + '"' + k + '"' + sep + value;
                            }
                        }
                    }
                    if (r)
                        op_1.push(r);
                }
            });
            return op_1.join('\n');
        }
        return '';
    }
    function mixed(entity, time_range, feats, vars, sep) {
        var _this = this;
        if (entity.group in this.meta.times) {
            var op = [], time = this.meta.times[entity.group].value;
            var tr_2 = '';
            Object.keys(feats).forEach(function (f) {
                tr_2 += '"' + entity.features[feats[f]] + '"' + sep;
            });
            var yn = time_range[1] + 1;
            var _loop_1 = function (y) {
                var r = tr_2 + time[y];
                vars.forEach(function (k) {
                    var vc = entity.variables[k].code;
                    if (vc in entity.data) {
                        var trange = _this.meta.variables[entity.group][k].time_range;
                        var vec = entity.data[vc];
                        var value = NaN;
                        if (Array.isArray(vec)) {
                            if (y >= trange[0] && y <= trange[1])
                                value = vec[y - trange[0]];
                        }
                        else if (y === trange[0]) {
                            value = vec;
                        }
                        r += sep + (isNaN(value) ? 'NA' : value);
                    }
                    else
                        r += sep + 'NA';
                });
                op.push(r);
            };
            for (var y = time_range[0]; y < yn; y++) {
                _loop_1(y);
            }
            return op.join('\n');
        }
        return '';
    }
    function wide(entity, time_range, feats, vars, sep) {
        var _this = this;
        if (entity.group in this.meta.times) {
            var r_1 = '';
            Object.keys(feats).forEach(function (f) {
                r_1 += (r_1 ? sep : '') + '"' + entity.features[feats[f]] + '"';
            });
            vars.forEach(function (k) {
                var vc = entity.variables[k].code;
                var range = _this.meta.ranges[k];
                var trange = _this.meta.variables[entity.group][k].time_range;
                var yn = time_range[1] + 1;
                for (var y = time_range[0]; y < yn; y++) {
                    if (y >= range[0] && y <= range[1]) {
                        if (vc in entity.data) {
                            var vec = entity.data[vc];
                            var value = NaN;
                            if (Array.isArray(vec)) {
                                if (y >= trange[0] && y <= trange[1])
                                    value = vec[y - trange[0]];
                            }
                            else if (y === trange[0]) {
                                value = vec;
                            }
                            r_1 += sep + (isNaN(value) ? 'NA' : value);
                        }
                        else
                            r_1 += sep + 'NA';
                    }
                }
            });
            return r_1;
        }
        return '';
    }

    var row_writers = /*#__PURE__*/Object.freeze({
        __proto__: null,
        mixed: mixed,
        tall: tall,
        wide: wide
    });

    function exporter(query_string, entities, in_browser, all_data) {
        return __awaiter(this, void 0, void 0, function () {
            var query, res, inc, exc, vars, feats, rows, range, sep, rw, no_filter, no_feature_filter, in_group, k, r, first_entity, times, filename, e_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!in_browser) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.data_ready];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        query = this.parse_query(query_string);
                        entities = entities || this.entities;
                        if (-1 === options.file_format.indexOf(query.file_format))
                            query.file_format = defaults.file_format;
                        if (!(query.table_format in row_writers))
                            query.table_format = defaults.table_format;
                        res = {
                            statusCode: 400,
                            headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Content-Disposition': 'attachment; filename=' },
                            body: 'Invalid Request',
                        }, inc = query.include && query.include.length
                            ? 'string' === typeof query.include
                                ? query.include.split(',')
                                : query.include
                            : Object.keys(this.variables), exc = query.exclude || [], vars = [], feats = query.features || JSON.parse(JSON.stringify(defaults.features)), rows = [], range = [Infinity, -Infinity], sep = 'csv' === query.file_format ? ',' : '\t', rw = row_writers[query.table_format].bind(this), no_filter = !query.variables.filter_by.length, no_feature_filter = !query.feature_conditions.length, in_group = !('dataset' in query)
                            ? function () { return true; }
                            : group_checks[query.dataset.operator].bind(query.dataset.value);
                        inc.forEach(function (ii) {
                            if (ii in _this.features && !(ii in feats)) {
                                feats[ii] = _this.format_label(ii);
                            }
                        });
                        for (k in export_checks)
                            if (k in query) {
                                r = export_checks[k]('include' === k ? inc : query[k], this.variables);
                                if (r) {
                                    res.body = 'Failed check for ' + k + ': ' + r;
                                    return [2 /*return*/, res];
                                }
                            }
                        Object.keys(this.variable_codes).forEach(function (k) {
                            if (-1 !== inc.indexOf(_this.variable_codes[k].name) && -1 === exc.indexOf(_this.variable_codes[k].name)) {
                                vars.push(_this.variable_codes[k].name);
                                var tr = _this.meta.ranges[_this.variable_codes[k].name];
                                if (tr[0] < range[0])
                                    range[0] = tr[0];
                                if (tr[1] > range[1])
                                    range[1] = tr[1];
                            }
                        });
                        if (query.time_range[0] < range[0])
                            query.time_range[0] = range[0];
                        if (query.time_range[1] > range[1])
                            query.time_range[1] = range[1];
                        rows.push(Object.keys(feats).join(sep));
                        if ('wide' === query.table_format) {
                            vars.forEach(function (vi) {
                                var tr = _this.meta.ranges[vi], yn = Math.min(query.time_range[1], tr[1]) + 1;
                                for (var y = Math.max(query.time_range[0], tr[0]); y < yn; y++) {
                                    rows[0] += sep + vi + '_' + _this.meta.overall.value[y];
                                }
                            });
                        }
                        else
                            rows[0] += sep + 'time' + sep + ('mixed' === query.table_format ? vars : ['variable', 'value']).join(sep);
                        first_entity = '';
                        Object.keys(entities).forEach(function (k) {
                            var e = entities[k];
                            if (in_group(e.group) &&
                                (no_feature_filter || passes_feature_filter(entities, k, query.feature_conditions)) &&
                                (no_filter || passes_filter(e, query.time_range, query.variables, _this.variables))) {
                                var r = rw(e, query.time_range, feats, vars, sep);
                                if (r) {
                                    if (!first_entity)
                                        first_entity = k;
                                    rows.push(r);
                                }
                            }
                        });
                        res.headers['Content-Type'] = 'text/' + (',' === sep ? 'csv' : 'plain') + '; charset=utf-8';
                        res.body = rows.join('\n');
                        times = this.meta.overall.value, filename = 'export_' +
                            (in_browser && !all_data && first_entity
                                ? entities[first_entity].group + '_'
                                : query.dataset
                                    ? query.dataset.value + '_'
                                    : '') +
                            (query.time_range[0] === query.time_range[1]
                                ? times[query.time_range[0]]
                                : times[query.time_range[0]] + '-' + times[query.time_range[1]]) +
                            '_' +
                            (1 === vars.length
                                ? this.variables[vars[0]].meta.short_name.toLowerCase().replace(patterns.non_letter_num, '-')
                                : vars.length + '-variables') +
                            '_' +
                            (rows.join('\n').split('\n').length - 1) +
                            'x' +
                            rows[0].split(sep).length;
                        if (in_browser) {
                            e_1 = document.createElement('a');
                            document.body.appendChild(e_1);
                            e_1.rel = 'noreferrer';
                            e_1.target = '_blank';
                            e_1.download = filename + '.' + query.file_format;
                            e_1.href = URL.createObjectURL(new Blob([res.body], { type: res.headers['Content-Type'] }));
                            setTimeout(function () {
                                e_1.dispatchEvent(new MouseEvent('click'));
                                URL.revokeObjectURL.bind(null, e_1.href);
                                document.body.removeChild(e_1);
                            }, 0);
                        }
                        res.statusCode = 200;
                        res.headers['Content-Disposition'] += filename + '.' + query.file_format;
                        return [2 /*return*/, res];
                }
            });
        });
    }

    function single(v, t) {
        if (t < 0)
            return NaN;
        if (this.variables[v].is_time) {
            return Array.isArray(this.time.value) && t < this.time.value.length ? this.time.value[t] : NaN;
        }
        else {
            v = this.variables[v].code;
            return 0 === t && v in this.data ? this.data[v] : NaN;
        }
    }
    function multi(v, t) {
        if (t < 0)
            return NaN;
        if (this.variables[v].is_time) {
            return Array.isArray(this.time.value) ? this.time.value[t] : this.time.value;
        }
        else {
            v = this.variables[v].code;
            var value = this.data[v];
            return v in this.data ? (Array.isArray(value) ? (t < value.length ? value[t] : NaN) : 0 === t ? value : NaN) : NaN;
        }
    }
    function row_time(d, type, row) {
        var i = this.i - (row.offset - this.o);
        return d && i >= 0 && i < d.length ? ('number' === typeof d[i] ? this.format_value(d[i], row.int) : d[i]) : NaN;
    }

    var retrievers = /*#__PURE__*/Object.freeze({
        __proto__: null,
        multi: multi,
        row_time: row_time,
        single: single
    });

    function value(v, int) {
        if (null === v || isNaN(v)) {
            return NaN;
        }
        else if (int) {
            return v;
        }
        else {
            return 'string' === typeof this.settings.settings.digits
                ? v
                : v.toFixed(this.settings.settings.digits > 0 ? this.settings.settings.digits : 0);
        }
    }
    function label(l) {
        return 'string' !== typeof l
            ? ''
            : l in this.variables && this.variables[l].meta && this.variables[l].meta.short_name
                ? this.variables[l].meta.short_name
                : l.replace(patterns.seps, ' ').replace(patterns.word_start, function (w) {
                    return w.toUpperCase();
                });
    }

    function data(d, name) {
        var _this = this;
        this.sets[name] = d;
        this.loaded[name] = true;
        if (!(name in this.info))
            this.info[name] = { name: name, site_file: name + '.json', schema: { fields: [] }, ids: [] };
        if ('_meta' in d) {
            var time = d._meta.time;
            this.meta.times[name] = time;
            if ('number' === typeof time.value)
                time.value = [time.value];
            var times = time.value;
            time.n = times.length;
            time.is_single = 1 === time.n;
            time.range = [times[0], times[time.n - 1]];
            if (d._meta.time.name in this.variables) {
                time.info = this.variables[time.name];
                time.info.is_time = true;
            }
            if (time.range[0] < this.meta.overall.range[0])
                this.meta.overall.range[0] = time.range[0];
            if (time.range[1] > this.meta.overall.range[1])
                this.meta.overall.range[1] = time.range[1];
            times.forEach(function (v) {
                if (-1 === _this.meta.overall.value.indexOf(v))
                    _this.meta.overall.value.push(v);
            });
            this.meta.overall.value.sort();
            this.meta.variables[name] = d._meta.variables || {};
            Object.keys(this.meta.variables[name]).forEach(function (k) {
                if (!(k in _this.variables)) {
                    _this.variables[k] = {
                        datasets: [name],
                        info: {},
                        time_range: {},
                        type: 'unknown',
                        name: k,
                        code: k,
                        views: {},
                        meta: {
                            full_name: k,
                            measure: k.split(':')[1] || k,
                            short_name: _this.format_label(k),
                            long_name: k,
                            type: 'unknown',
                        },
                    };
                    _this.variable_info[k] = _this.variables[k].meta;
                }
                _this.variables[k].name = k;
                _this.variables[k].code = _this.meta.variables[name][k].code;
                var t = _this.meta.variables[name][k].time_range;
                _this.variables[k].time_range[name] = t;
                _this.variable_codes[_this.variables[k].code] = _this.variables[k];
                if (-1 !== t[0]) {
                    if (k in _this.meta.ranges) {
                        if (t[0] < _this.meta.ranges[k][0])
                            _this.meta.ranges[k][0] = t[0];
                        if (t[1] > _this.meta.ranges[k][1])
                            _this.meta.ranges[k][1] = t[1];
                    }
                    else {
                        _this.meta.ranges[k] = [t[0], t[1]];
                    }
                }
            });
        }
        this.load_id_maps();
    }
    function id_maps() {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.metadata.datasets &&
                    this.metadata.datasets.forEach(function (k) {
                        var has_map = false;
                        k in _this.info &&
                            _this.info[k].ids.forEach(function (id, i) {
                                if ('map' in id) {
                                    has_map = true;
                                    var map_1 = id.map;
                                    if (map_1 in _this.data_maps) {
                                        if (_this.data_maps[map_1].retrieved) {
                                            var features = (k in _this.data_maps[map_1].resource ? _this.data_maps[map_1].resource[k] : _this.data_maps[map_1].resource);
                                            _this.info[k].schema.fields[i].ids = _this.entity_features[k] = features;
                                            _this.map_entities(k);
                                        }
                                        else {
                                            var queue = _this.data_maps[map_1].queue;
                                            if (-1 === queue.indexOf(k))
                                                queue.push(k);
                                        }
                                    }
                                    else if ('string' !== typeof map_1 || id.map_content) {
                                        if ('string' === typeof map_1) {
                                            _this.data_maps[map_1] = { queue: [], resource: JSON.parse(id.map_content), retrieved: true };
                                            var features = (k in _this.data_maps[map_1].resource ? _this.data_maps[map_1].resource[k] : _this.data_maps[map_1].resource);
                                            _this.info[k].schema.fields[i].ids = _this.entity_features[k] = features;
                                        }
                                        else {
                                            _this.entity_features[k] = map_1;
                                        }
                                        _this.map_entities(k);
                                    }
                                    else {
                                        _this.data_maps[map_1] = { queue: [k], resource: {}, retrieved: false };
                                        if (_this.settings.entity_info && map_1 in _this.settings.entity_info) {
                                            var e = _this.settings.entity_info;
                                            if ('string' === typeof e[map_1])
                                                e[map_1] = JSON.parse(e[map_1]);
                                            _this.ingest_map(e[map_1], map_1, i);
                                        }
                                        else if ('undefined' === typeof window) {
                                            require('https')
                                                .get(map_1, function (r) {
                                                var c = [];
                                                r.on('data', function (d) {
                                                    c.push(d);
                                                });
                                                r.on('end', function () {
                                                    _this.ingest_map(JSON.parse(c.join('')), r.req.protocol + '//' + r.req.host + r.req.path, i);
                                                });
                                            })
                                                .end();
                                        }
                                        else {
                                            var f_1 = new window.XMLHttpRequest();
                                            f_1.onreadystatechange = function (url, fi) {
                                                if (4 === f_1.readyState) {
                                                    if (200 === f_1.status) {
                                                        this.ingest_map(JSON.parse(f_1.responseText), url, fi);
                                                    }
                                                    else {
                                                        throw new Error('data_handler.ingester.id_maps failed: ' + f_1.responseText);
                                                    }
                                                }
                                            }.bind(_this, map_1, i);
                                            f_1.open('GET', map_1, true);
                                            f_1.send();
                                        }
                                    }
                                }
                            });
                        if (!has_map) {
                            _this.entity_features[k] = {};
                            _this.map_entities(k);
                        }
                    });
                return [2 /*return*/];
            });
        });
    }
    function map(m, url, field) {
        var _this = this;
        this.data_maps[url].resource = m;
        this.data_maps[url].retrieved = true;
        this.data_maps[url].queue.forEach(function (k) {
            if (_this.info[k].schema.fields.length > field) {
                if (!(k in _this.entity_features))
                    _this.entity_features[k] = {};
                var features = (k in _this.data_maps[url].resource ? _this.data_maps[url].resource[k] : _this.data_maps[url].resource);
                _this.info[k].schema.fields[field].ids = _this.entity_features[k] = features;
                _this.map_entities(k);
            }
        });
        this.hooks.data_load && this.hooks.data_load();
    }

    function sort_a1(a, b) {
        return isNaN(a[1]) ? (isNaN(b[1]) ? 0 : -1) : isNaN(b[1]) ? 1 : a[1] - b[1];
    }
    function summary_template() {
        return {
            type: 'number',
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
            mode: [],
            level_ids: {},
            levels: [],
        };
    }
    function init(v, d) {
        var _this = this;
        if (!this.inited_summary[d + v]) {
            this.settings.view_names.forEach(function (view) {
                var vi = _this.variables[v];
                if (!(view in vi.views))
                    vi.views[view] = {
                        order: {},
                        selected_order: {},
                        selected_summaries: {},
                        summaries: {},
                        state: {},
                        table: {},
                    };
                if (!(d in vi.time_range)) {
                    vi.time_range[d] = [0, _this.meta.times[d].n - 1];
                }
                var ny = (vi.time_range[d][2] = vi.time_range[d][1] - vi.time_range[d][0] + 1);
                var m = vi.views[view], c = vi.code;
                if (d in _this.sets) {
                    var da_1 = _this.sets[d];
                    var n = _this.info[d].entity_count;
                    var at_1 = !n || n > 65535 ? Uint32Array : n > 255 ? Uint16Array : Uint8Array;
                    var info = vi.info[d];
                    var is_string_1 = 'string' === info.type;
                    var o_1 = info.order;
                    if (o_1) {
                        Object.keys(da_1).forEach(function (k) {
                            if (!(k in _this.entities))
                                return;
                            if (!(view in _this.entities[k].views))
                                _this.entities[k].views[view] = { summary: {}, rank: {}, subset_rank: {} };
                            _this.entities[k].views[view].rank[v] = new at_1(ny);
                            _this.entities[k].views[view].subset_rank[v] = new at_1(ny);
                        });
                    }
                    else {
                        info.order = o_1 = [];
                        for (var y = ny; y--;) {
                            o_1.push([]);
                        }
                        Object.keys(da_1).forEach(function (k) {
                            var dak = da_1[k];
                            if ('_meta' !== k && c in dak) {
                                var ev = dak[c];
                                if (Array.isArray(ev)) {
                                    for (var y = ny; y--;) {
                                        if (is_string_1 && ev[y] in vi.level_ids) {
                                            ev[y] = vi.level_ids[ev[y]];
                                        }
                                        else if ('number' !== typeof ev[y])
                                            ev[y] = NaN;
                                        o_1[y].push([k, ev[y]]);
                                    }
                                    Object.freeze(ev);
                                }
                                else {
                                    if (is_string_1 && ev in vi.level_ids) {
                                        o_1[0].push([k, vi.level_ids[ev]]);
                                    }
                                    else if ('number' !== typeof ev) {
                                        dak[c] = NaN;
                                        o_1[0].push([k, NaN]);
                                    }
                                    else
                                        o_1[0].push([k, ev]);
                                }
                                if (!(k in _this.entities))
                                    return;
                                if (!(view in _this.entities[k].views))
                                    _this.entities[k].views[view] = { summary: {}, rank: {}, subset_rank: {} };
                                var eview = _this.entities[k].views[view];
                                if (!(v in eview.rank)) {
                                    eview.rank[v] = new at_1(ny);
                                    eview.subset_rank[v] = new at_1(ny);
                                }
                            }
                        });
                    }
                    o_1.forEach(function (ev, y) {
                        if (!Object.isFrozen(ev)) {
                            ev.sort(sort_a1);
                            Object.freeze(ev);
                        }
                        ev.forEach(function (r, i) {
                            _this.entities[r[0]].views[view].rank[v][y] = i;
                        });
                    });
                }
                if (!(d in m.summaries)) {
                    m.order[d] = [];
                    m.selected_order[d] = [];
                    m.selected_summaries[d] = summary_template();
                    var s = summary_template();
                    if ('string' === vi.info[d].type) {
                        s.type = 'string';
                        s.level_ids = vi.level_ids;
                        s.levels = vi.levels;
                        m.table = {};
                        vi.levels.forEach(function (l) {
                            m.table[l] = [];
                            for (var y = ny; y--;)
                                m.table[l].push(0);
                        });
                        for (var y = ny; y--;) {
                            m.order[d].push([]);
                            m.selected_order[d].push([]);
                            s.missing.push(0);
                            s.n.push(0);
                            s.mode.push('');
                        }
                        m.summaries[d] = s;
                    }
                    else {
                        for (var y = ny; y--;) {
                            m.order[d].push([]);
                            m.selected_order[d].push([]);
                            m.selected_summaries[d].n.push(0);
                            m.selected_summaries[d].missing.push(0);
                            s.missing.push(0);
                            s.n.push(0);
                            s.sum.push(0);
                            s.max.push(-Infinity);
                            s.q3.push(0);
                            s.mean.push(0);
                            s.norm_median.push(0);
                            s.break_median.push(-1);
                            s.lower_median_min.push(-1);
                            s.lower_median_range.push(-1);
                            s.upper_median_min.push(-1);
                            s.upper_median_range.push(-1);
                            s.norm_mean.push(0);
                            s.break_mean.push(-1);
                            s.lower_mean_min.push(-1);
                            s.lower_mean_range.push(-1);
                            s.upper_mean_min.push(-1);
                            s.upper_mean_range.push(-1);
                            s.median.push(0);
                            s.q1.push(0);
                            s.min.push(Infinity);
                        }
                        m.summaries[d] = s;
                    }
                    Object.seal(m.order[d]);
                    Object.seal(m.selected_order[d]);
                    Object.seal(m.selected_summaries[d]);
                    Object.seal(m.summaries[d]);
                }
            });
        }
    }
    function quantile(p, n, o, x) {
        var a = p * (n - 1), ap = a % 1, bp = 1 - ap, b = o + Math.ceil(a), i = o + Math.floor(a);
        return x[i][1] * ap + x[b][1] * bp;
    }
    function calculate(measure, view, full) {
        return __awaiter(this, void 0, void 0, function () {
            var v, dataset, summaryId, variable, m, s_1, a_1, mo_1, mso_1, ny, order, levels_1, level_ids_1, subset_1, mss_1, ms_1, is_string_2, _loop_1, y, _loop_2, y;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        v = this.settings.dataviews[view];
                        dataset = v.get.dataset();
                        return [4 /*yield*/, this.data_processed[dataset]];
                    case 1:
                        _a.sent();
                        summaryId = dataset + measure;
                        if (!this.inited_summary[summaryId])
                            this.init_summary(measure, dataset);
                        this.inited_summary[summaryId] = new Promise(function (resolve) {
                            _this.summary_ready[summaryId] = resolve;
                        });
                        variable = this.variables[measure], m = variable.views[view];
                        if (!(m.state[dataset] !== v.state)) return [3 /*break*/, 2];
                        s_1 = v.selection[this.settings.settings.summary_selection], a_1 = v.selection.all, mo_1 = m.order[dataset], mso_1 = m.selected_order[dataset], ny = variable.time_range[dataset][2], order = variable.info[dataset].order, levels_1 = variable.levels, level_ids_1 = variable.level_ids, subset_1 = v.n_selected[this.settings.settings.summary_selection] !== v.n_selected.dataset, mss_1 = m.selected_summaries[dataset], ms_1 = m.summaries[dataset], is_string_2 = 'string' === variable.type;
                        _loop_1 = function (y) {
                            mo_1[y] = subset_1 ? [] : order[y];
                            mso_1[y] = subset_1 ? [] : order[y];
                            mss_1.missing[y] = 0;
                            mss_1.n[y] = 0;
                            ms_1.missing[y] = 0;
                            ms_1.n[y] = 0;
                            if (is_string_2) {
                                ms_1.mode[y] = '';
                                levels_1.forEach(function (k) { return (m.table[k][y] = 0); });
                            }
                            else {
                                ms_1.sum[y] = 0;
                                ms_1.mean[y] = 0;
                                ms_1.max[y] = -Infinity;
                                ms_1.min[y] = Infinity;
                                ms_1.break_mean[y] = -1;
                                ms_1.break_median[y] = -1;
                            }
                        };
                        for (y = ny; y--;) {
                            _loop_1(y);
                        }
                        order.forEach(function (o, y) {
                            var moy = mo_1[y], msoy = mso_1[y];
                            var rank = 0;
                            o.forEach(function (oi) {
                                var k = oi[0], value = oi[1];
                                if (k in s_1) {
                                    var en = s_1[k].views[view], present = !isNaN(value);
                                    if (!y) {
                                        if (!(measure in en.summary))
                                            en.summary[measure] = { n: 0, overall: ms_1, order: mo_1 };
                                        en.summary[measure].n = 0;
                                    }
                                    if (full && subset_1) {
                                        moy.push(oi);
                                        if (k in a_1) {
                                            msoy.push(oi);
                                            if (present) {
                                                mss_1.n[y]++;
                                            }
                                            else
                                                mss_1.missing[y]++;
                                        }
                                    }
                                    if (present) {
                                        en.subset_rank[measure][y] = rank++;
                                        en.summary[measure].n++;
                                        ms_1.n[y]++;
                                        if (is_string_2) {
                                            m.table[levels_1[value]][y]++;
                                        }
                                        else {
                                            ms_1.sum[y] += value;
                                            if (value > ms_1.max[y])
                                                ms_1.max[y] = value;
                                            if (value < ms_1.min[y])
                                                ms_1.min[y] = value;
                                        }
                                    }
                                    else
                                        ms_1.missing[y]++;
                                }
                            });
                        });
                        if (full) {
                            mo_1.forEach(function (o, y) {
                                if (is_string_2) {
                                    if (ms_1.n[y]) {
                                        var l_1 = 0;
                                        Object.keys(m.table).forEach(function (k) {
                                            if (m.table[k][y] > m.table[levels_1[l_1]][y])
                                                l_1 = level_ids_1[k];
                                        });
                                        ms_1.mode[y] = levels_1[l_1];
                                    }
                                    else
                                        ms_1.mode[y] = '';
                                }
                                else {
                                    if (ms_1.n[y]) {
                                        ms_1.mean[y] = ms_1.sum[y] / ms_1.n[y];
                                        if (!isFinite(ms_1.min[y]))
                                            ms_1.min[y] = ms_1.mean[y];
                                        if (!isFinite(ms_1.max[y]))
                                            ms_1.max[y] = ms_1.mean[y];
                                        ms_1.range[y] = ms_1.max[y] - ms_1.min[y];
                                        if (1 === ms_1.n[y]) {
                                            ms_1.q3[y] = ms_1.median[y] = ms_1.q1[y] = null == o[0][1] ? ms_1.mean[y] : o[0][1];
                                        }
                                        else {
                                            ms_1.median[y] = quantile(0.5, ms_1.n[y], ms_1.missing[y], o);
                                            ms_1.q3[y] = quantile(0.75, ms_1.n[y], ms_1.missing[y], o);
                                            ms_1.q1[y] = quantile(0.25, ms_1.n[y], ms_1.missing[y], o);
                                        }
                                        var n = o.length;
                                        for (var i = ms_1.missing[y], bmd = false, bme = false; i < n; i++) {
                                            var v_1 = o[i][1];
                                            if ('number' === typeof v_1) {
                                                if (!bmd && v_1 > ms_1.median[y]) {
                                                    ms_1.break_median[y] = i - 1;
                                                    bmd = true;
                                                }
                                                if (!bme && v_1 > ms_1.mean[y]) {
                                                    ms_1.break_mean[y] = i - 1;
                                                    bme = true;
                                                }
                                            }
                                            if (bmd && bme)
                                                break;
                                        }
                                    }
                                    else {
                                        ms_1.max[y] = 0;
                                        ms_1.q3[y] = 0;
                                        ms_1.median[y] = 0;
                                        ms_1.q1[y] = 0;
                                        ms_1.min[y] = 0;
                                    }
                                    if (ms_1.n[y]) {
                                        ms_1.norm_median[y] = ms_1.range[y] ? (ms_1.median[y] - ms_1.min[y]) / ms_1.range[y] : 0.5;
                                        if (-1 !== ms_1.break_median[y]) {
                                            ms_1.lower_median_min[y] = ms_1.norm_median[y] - (o[ms_1.missing[y]][1] - ms_1.min[y]) / ms_1.range[y];
                                            ms_1.lower_median_range[y] =
                                                ms_1.norm_median[y] - ((o[ms_1.break_median[y]][1] - ms_1.min[y]) / ms_1.range[y] - ms_1.lower_median_min[y]);
                                            ms_1.upper_median_min[y] = ms_1.norm_median[y] - (o[ms_1.break_median[y]][1] - ms_1.min[y]) / ms_1.range[y];
                                            ms_1.upper_median_range[y] =
                                                (o[o.length - 1][1] - ms_1.min[y]) / ms_1.range[y] - ms_1.norm_median[y] - ms_1.upper_median_min[y];
                                        }
                                        ms_1.norm_mean[y] = ms_1.range[y] ? (ms_1.mean[y] - ms_1.min[y]) / ms_1.range[y] : 0.5;
                                        if (-1 !== ms_1.break_mean[y]) {
                                            ms_1.lower_mean_min[y] = ms_1.norm_mean[y] - (o[ms_1.missing[y]][1] - ms_1.min[y]) / ms_1.range[y];
                                            ms_1.lower_mean_range[y] =
                                                ms_1.norm_mean[y] - ((o[ms_1.break_mean[y]][1] - ms_1.min[y]) / ms_1.range[y] - ms_1.lower_mean_min[y]);
                                            ms_1.upper_mean_min[y] = ms_1.norm_mean[y] - (o[ms_1.break_mean[y]][1] - ms_1.min[y]) / ms_1.range[y];
                                            ms_1.upper_mean_range[y] =
                                                (o[o.length - 1][1] - ms_1.min[y]) / ms_1.range[y] - ms_1.norm_mean[y] - ms_1.upper_mean_min[y];
                                        }
                                    }
                                }
                            });
                        }
                        else {
                            _loop_2 = function (y) {
                                if (ms_1.n[y]) {
                                    if (is_string_2) {
                                        var q1_1 = 0;
                                        Object.keys(m.table).forEach(function (k) {
                                            if (m.table[k][y] > m.table[levels_1[q1_1]][y])
                                                q1_1 = level_ids_1[k];
                                        });
                                        ms_1.mode[y] = levels_1[q1_1];
                                    }
                                    else
                                        ms_1.mean[y] = ms_1.sum[y] / ms_1.n[y];
                                }
                                else {
                                    ms_1[is_string_2 ? 'mode' : 'mean'][y] = NaN;
                                }
                            };
                            for (y = 0; y < ny; y++) {
                                _loop_2(y);
                            }
                        }
                        ms_1.filled = true;
                        m.state[dataset] = v.state;
                        this.summary_ready[summaryId]();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.summary_ready[summaryId]];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    }

    function variables() {
        var _this = this;
        this.metadata.datasets.forEach(function (k) {
            _this.data_queue[k] = {};
            var m = _this.info[k];
            if (m) {
                m.id_vars = m.ids.map(function (id) { return id.variable; });
                m.schema.fields.forEach(function (v) {
                    var vn = v.name;
                    if (vn in _this.variables) {
                        var ve_1 = _this.variables[vn];
                        ve_1.datasets.push(k);
                        ve_1.info[k] = v;
                        if ('string' === v.type) {
                            ve_1.levels = [];
                            ve_1.level_ids = {};
                            ((v.info && v.info.levels) || Object.keys(v.table)).forEach(function (l) {
                                if (!(l in ve_1.level_ids)) {
                                    ve_1.level_ids[l] = ve_1.levels.length;
                                    ve_1.levels.push(l);
                                }
                            });
                        }
                    }
                    else {
                        var ve_2 = (_this.variables[vn] = {
                            datasets: [k],
                            info: {},
                            time_range: {},
                            type: v.type,
                            code: vn,
                            name: vn,
                            meta: v.info,
                            levels: [],
                            level_ids: {},
                            table: {},
                            order: [],
                            views: {},
                        });
                        ve_2.info[k] = v;
                        if ('string' === v.type) {
                            ve_2.levels = [];
                            ve_2.level_ids = {};
                            (v.info.levels || Object.keys(v.table)).forEach(function (l) {
                                ve_2.level_ids[l] = ve_2.levels.length;
                                ve_2.levels.push(l);
                            });
                        }
                        if (!ve_2.meta)
                            ve_2.meta = {
                                full_name: vn,
                                measure: vn.split(':')[1] || vn,
                                short_name: _this.format_label(vn),
                                type: 'integer',
                            };
                        ve_2.meta.full_name = vn;
                        if (!('measure' in ve_2.meta))
                            ve_2.meta.measure = vn.split(':')[1] || vn;
                        if (!('short_name' in ve_2.meta))
                            ve_2.meta.short_name = _this.format_label(vn);
                        if (!('long_name' in ve_2.meta))
                            ve_2.meta.long_name = ve_2.meta.short_name;
                        if (!(vn in _this.variable_info))
                            _this.variable_info[vn] = ve_2.meta;
                    }
                });
            }
        });
    }
    function entities(g) {
        return __awaiter(this, void 0, void 0, function () {
            var s_1, time_1, retriever_1, datasets_1, infos_1, k;
            var _this = this;
            return __generator(this, function (_a) {
                if (g in this.sets && !this.inited[g] && g in this.meta.times) {
                    s_1 = this.sets[g], time_1 = this.meta.times[g], retriever_1 = DataHandler.retrievers[time_1.is_single ? 'single' : 'multi'], datasets_1 = Object.keys(this.sets), infos_1 = this.info;
                    Object.keys(s_1).forEach(function (id) {
                        var si = s_1[id], l = id.length;
                        if ('_meta' !== id) {
                            var overwrite_1 = _this.entity_features[g][id];
                            var f_1 = overwrite_1 || { id: id, name: id };
                            f_1.id = id;
                            if (!f_1.name)
                                f_1.name = id;
                            var e_1 = (id in _this.entities
                                ? _this.entities[id]
                                : {
                                    group: g,
                                    data: si,
                                    variables: _this.variables,
                                    features: f_1,
                                    views: {},
                                });
                            if (id in _this.entities) {
                                e_1.group = g;
                                e_1.data = si;
                                e_1.variables = _this.variables;
                                if (!e_1.features)
                                    e_1.features = {};
                            }
                            else {
                                _this.entities[id] = e_1;
                            }
                            if (!(id in _this.entity_tree))
                                _this.entity_tree[id] = { parents: {}, children: {} };
                            var rel_1 = _this.entity_tree[id];
                            e_1.relations = rel_1;
                            Object.keys(f_1).forEach(function (k) {
                                if (!(k in _this.features))
                                    _this.features[k] = _this.format_label(k);
                                if ('id' === k || overwrite_1 || !(k in e_1.features)) {
                                    e_1.features[k] = f_1[k];
                                }
                                if (-1 !== _this.metadata.datasets.indexOf(k)) {
                                    if (!(f_1[k] in _this.entity_tree))
                                        _this.entity_tree[f_1[k]] = { parents: {}, children: {} };
                                    _this.entity_tree[f_1[k]].children[id] = rel_1;
                                    rel_1.parents[f_1[k]] = _this.entity_tree[f_1[k]];
                                }
                            });
                            if (infos_1) {
                                datasets_1.forEach(function (d) {
                                    var p = d in infos_1 && infos_1[d].id_length;
                                    if (p && p < l) {
                                        var sl = id.substring(0, p);
                                        if (sl in _this.sets[d]) {
                                            if (!(sl in _this.entity_tree))
                                                _this.entity_tree[sl] = { parents: {}, children: {} };
                                            _this.entity_tree[sl].children[id] = rel_1;
                                            rel_1.parents[sl] = _this.entity_tree[sl];
                                        }
                                    }
                                });
                            }
                            _this.settings.view_names.forEach(function (v) {
                                if (!(v in e_1.views)) {
                                    e_1.views[v] = { summary: {}, rank: {}, subset_rank: {} };
                                }
                            });
                            e_1.time = time_1;
                            e_1.get_value = retriever_1.bind(e_1);
                        }
                    });
                    this.inited[g] = true;
                    this.data_promise[g]();
                    setTimeout(function () {
                        if (!_this.inited.first) {
                            _this.hooks.init && _this.hooks.init();
                            _this.inited.first = true;
                        }
                        g in _this.data_queue &&
                            Object.keys(_this.data_queue[g]).forEach(function (id) {
                                _this.data_queue[g][id]();
                                delete _this.data_queue[g][id];
                            });
                        _this.hooks.onload && _this.hooks.onload(g);
                    }, 0);
                }
                for (k in this.info)
                    if (Object.prototype.hasOwnProperty.call(this.info, k) && !this.inited[k])
                        return [2 /*return*/, void 0];
                this.all_data_ready();
                return [2 /*return*/];
            });
        });
    }

    function query(q) {
        var _this = this;
        var f = JSON.parse(JSON.stringify(defaults));
        if ('string' === typeof q) {
            if ('?' === q[0])
                q = q.substring(1);
            var aq = q.split('&');
            q = {};
            aq.forEach(function (aqi) {
                var a = aqi.split('=');
                q[a[0]] = a.length > 1 ? a[1] : '';
            });
        }
        q &&
            Object.keys(q).forEach(function (k) {
                if ('include' === k || 'exclude' === k || k in f) {
                    f[k] = q[k];
                }
                else {
                    var a = [];
                    if (patterns.single_operator.test(k)) {
                        a = k.replace(patterns.single_operator, '$1=$2').split('=');
                        if (a.length > 1) {
                            k = a[0];
                            q[k] = a[1];
                        }
                    }
                    var aq = patterns.component.exec(k), tf = {
                        name: k.replace(patterns.greater, '>').replace(patterns.less, '<'),
                        component: 'mean',
                        operator: '=',
                        value: patterns.number.test(q[k]) ? Number(q[k]) : q[k],
                        time_component: false,
                        check: function () { return false; },
                    };
                    if ('object' === typeof q[k]) {
                        if ('component' in q[k])
                            tf.component = q[k].component;
                        if ('operator' in q[k])
                            tf.operator = q[k].operator;
                        if ('value' in q[k])
                            tf.value = q[k].value;
                    }
                    k = tf.name;
                    if (aq) {
                        if (-1 !== options.filter_components.indexOf(aq[2])) {
                            tf.component = aq[2];
                            tf.name = aq[1];
                        }
                        else if (patterns.number.test(aq[2])) {
                            var time = Number(aq[2]);
                            var i = time > 0 && time < _this.meta.overall.value.length ? time : _this.meta.overall.value.indexOf(time);
                            if (-1 !== i) {
                                tf.time_component = true;
                                tf.component = i;
                                tf.name = aq[1];
                            }
                        }
                    }
                    if (patterns.operator_start.test(k) && k[k.length - 1] in DataHandler.checks) {
                        tf.operator = k[k.length - 1];
                        if (!a.length)
                            tf.operator += '=';
                        if (k === tf.name)
                            tf.name = k.substring(0, k.length - 1);
                    }
                    if (undefined === tf.value || '-1' == tf.value)
                        return;
                    if (('=' === tf.operator || '!' === tf.operator) &&
                        'string' === typeof tf.value &&
                        patterns.comma.test(tf.value)) {
                        tf.value = tf.value.split(',');
                        tf.operator = '=' === tf.operator ? 'includes' : 'excludes';
                    }
                    if ('time_range' === tf.name) {
                        if (Array.isArray(tf.value)) {
                            f.time_range = [
                                _this.meta.overall.value.indexOf(Number(tf.value[0])),
                                _this.meta.overall.value.indexOf(Number(tf.value[1])),
                            ];
                        }
                        else {
                            var i = _this.meta.overall.value.indexOf(Number(tf.value));
                            f.time_range =
                                '=' === tf.operator ? [i, i] : '>' === tf.operator ? [i, _this.meta.overall.value.length - 1] : [0, i];
                        }
                        if (-1 === f.time_range[0])
                            f.time_range[0] = 0;
                        if (-1 === f.time_range[1])
                            f.time_range[1] = _this.meta.overall.value.length ? _this.meta.overall.value.length - 1 : 0;
                    }
                    else if ('dataset' === tf.name) {
                        f.dataset = tf;
                    }
                    else if (tf.name in _this.features) {
                        if ('id' === tf.name && !tf.value)
                            tf.value = String(tf.value).split(',');
                        tf.check = group_checks[tf.operator].bind(tf.value);
                        f.feature_conditions.push(tf);
                    }
                    else if (tf.name in _this.variables) {
                        tf.check = (tf.time_component
                            ? function (d, adj) {
                                var multi = 'number' !== typeof d, i = 'number' === typeof this.condition.component ? this.condition.component - adj : 0;
                                return multi
                                    ? this.check(d[i], this.condition.value)
                                    : !i
                                        ? this.check(d, this.condition.value)
                                        : false;
                            }
                            : function (s) {
                                return this.check(s[this.condition.component], this.condition.value);
                            }).bind({ check: DataHandler.checks[tf.operator], condition: tf });
                        if (-1 === f.variables.filter_by.indexOf(tf.name))
                            f.variables.filter_by.push(tf.name);
                        f.variables.conditions.push(tf);
                    }
                }
            });
        if (!('time_range' in f))
            f.time_range = [0, this.meta.overall.value.length ? this.meta.overall.value.length - 1 : 0];
        return f;
    }

    var DataHandler = /** @class */ (function () {
        function DataHandler(settings, defaults, data$1, hooks) {
            var _this = this;
            this.hooks = {};
            this.defaults = { dataview: 'default_view', time: 'time' };
            this.settings = {};
            this.metadata = { datasets: [] };
            this.info = {};
            this.sets = {};
            this.dynamic_load = false;
            this.all_data_ready = function () { return false; };
            this.data_ready = new Promise(function (resolve) {
                _this.all_data_ready = resolve;
            });
            this.features = {};
            this.variables = {};
            this.variable_codes = {};
            this.variable_info = {};
            this.references = {};
            this.entities = {};
            this.entity_tree = {};
            this.meta = {
                times: {},
                variables: {},
                ranges: {},
                overall: {
                    range: [Infinity, -Infinity],
                    value: [],
                },
            };
            this.loaded = {};
            this.inited = {};
            this.inited_summary = {};
            this.summary_ready = {};
            this.entity_features = {};
            this.data_maps = {};
            this.data_queue = {};
            this.data_promise = {};
            this.data_processed = {};
            this.load_requests = {};
            this.retrieve = function (name, url) {
                return __awaiter(this, void 0, void 0, function () {
                    var f_1;
                    var _this = this;
                    return __generator(this, function (_a) {
                        if (!this.load_requests[name]) {
                            this.load_requests[name] = url;
                            f_1 = new window.XMLHttpRequest();
                            f_1.onreadystatechange = function () {
                                if (4 === f_1.readyState) {
                                    if (200 === f_1.status) {
                                        _this.ingest_data(JSON.parse(f_1.responseText), name);
                                    }
                                    else {
                                        throw new Error('DataHandler.retrieve failed: ' + f_1.responseText);
                                    }
                                }
                            };
                            f_1.open('GET', url, true);
                            f_1.send();
                        }
                        return [2 /*return*/];
                    });
                });
            };
            this.format_value = value;
            this.format_label = label;
            this.ingest_data = data;
            this.ingest_map = map;
            this.load_id_maps = id_maps;
            this.init_summary = init;
            this.calculate_summary = calculate;
            this.map_variables = variables;
            this.map_entities = entities;
            this.parse_query = query;
            this.export = exporter;
            this.get_variable = function (variable, view) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(variable in this.variables)) return [3 /*break*/, 2];
                                return [4 /*yield*/, this.calculate_summary(variable, view, true)];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2: return [2 /*return*/, this.variables[variable]];
                        }
                    });
                });
            };
            this.get_value = function vector(r) {
                if (this.variables[r.variable].is_time) {
                    return r.entity.time.value;
                }
                else {
                    var v = this.variables[r.variable].code;
                    return (v in r.entity.data ? (Array.isArray(r.entity.data[v]) ? r.entity.data[v] : [r.entity.data[v]]) : [NaN]);
                }
            };
            if (hooks)
                this.hooks = hooks;
            if (defaults)
                this.defaults = defaults;
            if (settings)
                this.settings = settings;
            if (this.settings.metadata)
                this.metadata = this.settings.metadata;
            if (data$1)
                this.sets = data$1;
            this.get_value = this.get_value.bind(this);
            this.dynamic_load = 'dataviews' in this.settings && this.settings.settings && !!this.settings.settings.partial_init;
            this.settings.view_names = this.dynamic_load ? Object.keys(this.settings.dataviews) : ['default_view'];
            if ('string' === typeof this.metadata.datasets)
                this.metadata.datasets = [this.metadata.datasets];
            var init$1 = function () {
                if (!_this.metadata.datasets || !_this.metadata.datasets.length) {
                    _this.metadata.datasets = Object.keys(_this.info);
                    if (!_this.metadata.datasets.length)
                        _this.metadata.datasets = Object.keys(_this.sets);
                }
                if (_this.metadata.measure_info) {
                    var info_1 = _this.metadata.measure_info;
                    _this.metadata.datasets.forEach(function (d) {
                        if (info_1._references)
                            _this.info[d]._references = info_1._references;
                        var v = _this.info[d].schema.fields;
                        v.forEach(function (e) { return (e.name in info_1 ? (e.info = info_1[e.name]) : ''); });
                    });
                }
                _this.map_variables();
                _this.metadata.datasets.forEach(function (k) {
                    _this.loaded[k] = k in _this.sets;
                    _this.inited[k] = false;
                    _this.data_processed[k] = new Promise(function (resolve) {
                        _this.data_promise[k] = resolve;
                    });
                    if (k in _this.info)
                        _this.info[k].site_file = (_this.metadata.url ? _this.metadata.url + '/' : '') + _this.info[k].name + '.json';
                    if (_this.loaded[k]) {
                        _this.ingest_data(_this.sets[k], k);
                    }
                    else if (!_this.dynamic_load ||
                        (_this.settings.settings && !_this.settings.settings.partial_init) ||
                        !_this.defaults.dataset ||
                        k === _this.defaults.dataset)
                        _this.retrieve(k, _this.info[k].site_file);
                });
            };
            if (this.metadata.package && !this.metadata.info) {
                if ('undefined' === typeof window) {
                    require('https')
                        .get(this.metadata.url + this.metadata.package, function (r) {
                        var c = [];
                        r.on('data', function (d) {
                            c.push(d);
                        });
                        r.on('end', function () {
                            _this.info = {};
                            var dp = JSON.parse(c.join(''));
                            if (dp.measure_info)
                                _this.metadata.measure_info = dp.measure_info;
                            dp.resources.forEach(function (r) { return (_this.info[r.name] = r); });
                            init$1();
                        });
                    })
                        .end();
                }
                else {
                    var f_2 = new window.XMLHttpRequest();
                    f_2.onreadystatechange = function () {
                        if (4 === f_2.readyState) {
                            if (200 === f_2.status) {
                                _this.info = {};
                                var dp = JSON.parse(f_2.responseText);
                                if (dp.measure_info)
                                    _this.metadata.measure_info = dp.measure_info;
                                dp.resources.forEach(function (r) { return (_this.info[r.name] = r); });
                                init$1();
                            }
                            else {
                                throw new Error('failed to load datapackage: ' + f_2.responseText);
                            }
                        }
                    };
                    f_2.open('GET', this.metadata.url + this.metadata.package);
                    f_2.send();
                }
            }
            else {
                if (this.metadata.info)
                    this.info = this.metadata.info;
                init$1();
            }
        }
        DataHandler.retrievers = retrievers;
        DataHandler.checks = value_checks;
        return DataHandler;
    }());

    return DataHandler;

}));
//# sourceMappingURL=data_handler.js.map
