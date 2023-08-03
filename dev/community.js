(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Community = factory());
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

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

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

    var defaults$1 = {
        file_format: 'csv',
        table_format: 'mixed',
        features: { ID: 'id', Name: 'name' },
        feature_conditions: [],
        variables: {
            filter_by: [],
            conditions: [],
        },
    };
    var options$1 = {
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
            return -1 === options$1.file_format.indexOf(a);
        },
        table_format: function (a) {
            return -1 === options$1.table_format.indexOf(a);
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

    var patterns$1 = {
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
                        if (-1 === options$1.file_format.indexOf(query.file_format))
                            query.file_format = defaults$1.file_format;
                        if (!(query.table_format in row_writers))
                            query.table_format = defaults$1.table_format;
                        res = {
                            statusCode: 400,
                            headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Content-Disposition': 'attachment; filename=' },
                            body: 'Invalid Request',
                        }, inc = query.include && query.include.length
                            ? 'string' === typeof query.include
                                ? query.include.split(',')
                                : query.include
                            : Object.keys(this.variables), exc = query.exclude || [], vars = [], feats = query.features || JSON.parse(JSON.stringify(defaults$1.features)), rows = [], range = [Infinity, -Infinity], sep = 'csv' === query.file_format ? ',' : '\t', rw = row_writers[query.table_format].bind(this), no_filter = !query.variables.filter_by.length, no_feature_filter = !query.feature_conditions.length, in_group = !('dataset' in query)
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
                                ? this.variables[vars[0]].meta.short_name.toLowerCase().replace(patterns$1.non_letter_num, '-')
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
                : l.replace(patterns$1.seps, ' ').replace(patterns$1.word_start, function (w) {
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
    function init$1(v, d) {
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
                            Object.keys(v.table).forEach(function (l) {
                                ve_2.level_ids[l] = ve_2.levels.length;
                                ve_2.levels.push(l);
                            });
                        }
                        if (!ve_2.meta)
                            ve_2.meta = {
                                full_name: vn,
                                measure: vn.split(':')[1] || vn,
                                short_name: _this.format_label(vn),
                                type: v.type || 'unknown',
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
                                if (!e_1.views)
                                    e_1.views = {};
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

    var ps = {
        any: /\{(?:categor|variant)/,
        category: /\{categor(?:y|ies)(\.[^}]+?)?\}/g,
        variant: /\{variants?(\.[^}]+?)?\}/g,
        all: /\{(?:categor(?:y|ies)|variants?)(\.[^}]+?)?\}/g,
        desc: /description$/,
    };
    function replace_dynamic(e, p, s, v, d) {
        if (d === void 0) { d = 'default'; }
        p.lastIndex = 0;
        for (var m = void 0, k = void 0; (m = p.exec(e));) {
            var ss = v && 'v' === m[0].substring(1, 2) ? v : s;
            k = m[1] ? m[1].substring(1) : d;
            if (!(k in ss)) {
                if ('description' in ss && ps.desc.test(k)) {
                    k = d = 'description';
                }
                else if (k === d) {
                    k = 'default';
                }
            }
            var r = ss[k];
            if ('string' === typeof r) {
                while (e.includes(m[0]))
                    e = e.replace(m[0], r);
                p.lastIndex = 0;
            }
        }
        return e;
    }
    function prepare_source(name, o, s, p) {
        var r = { name: 'blank' === name ? '' : name };
        Object.keys(o).forEach(function (n) {
            var e = o[n];
            r[n] = 'string' === typeof e ? replace_dynamic(e, p, s) : e;
        });
        if (!('default' in r))
            r.default = r.name;
        return r;
    }
    function measure_info(info) {
        Object.keys(info).forEach(function (name) {
            if (ps.any.test(name)) {
                var base_1 = info[name];
                var bn_1 = Object.keys(base_1);
                if (base_1.categories || base_1.variants) {
                    var categories_1 = Array.isArray(base_1.categories) ? {} : base_1.categories || {};
                    var variants_1 = Array.isArray(base_1.variants) ? {} : base_1.variants || {};
                    var cats = Array.isArray(base_1.categories) ? base_1.categories : Object.keys(categories_1);
                    if (!cats.length)
                        cats.push('');
                    var vars_1 = Array.isArray(base_1.variants) ? base_1.variants : Object.keys(variants_1);
                    if (!vars_1.length)
                        vars_1.push('');
                    cats.forEach(function (cn) {
                        vars_1.forEach(function (vn) {
                            var cs = prepare_source(cn, categories_1[cn] || {}, variants_1[vn] || {}, ps.variant);
                            var vs = prepare_source(vn, variants_1[vn] || {}, categories_1[cn] || {}, ps.category);
                            var s = __assign(__assign({}, cs), vs);
                            var r = {};
                            bn_1.forEach(function (k) {
                                if ('categories' !== k && 'variants' !== k) {
                                    var temp = base_1[k];
                                    r[k] = 'string' === typeof temp ? replace_dynamic(temp, ps.all, cs, vs, k) : temp;
                                }
                            });
                            Object.keys(s).forEach(function (k) {
                                if (!(k in r) &&
                                    'default' !== k &&
                                    'name' !== k &&
                                    ('description' !== k || !(r.long_description || r.short_description)))
                                    r[k] = s[k];
                            });
                            info[replace_dynamic(name, ps.all, cs, vs)] = r;
                        });
                    });
                }
            }
        });
        return info;
    }
    function query(q) {
        var _this = this;
        var f = JSON.parse(JSON.stringify(defaults$1));
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
                    if (patterns$1.single_operator.test(k)) {
                        a = k.replace(patterns$1.single_operator, '$1=$2').split('=');
                        if (a.length > 1) {
                            k = a[0];
                            q[k] = a[1];
                        }
                    }
                    var aq = patterns$1.component.exec(k), tf = {
                        name: k.replace(patterns$1.greater, '>').replace(patterns$1.less, '<'),
                        component: 'mean',
                        operator: '=',
                        value: patterns$1.number.test(q[k]) ? Number(q[k]) : q[k],
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
                        if (-1 !== options$1.filter_components.indexOf(aq[2])) {
                            tf.component = aq[2];
                            tf.name = aq[1];
                        }
                        else if (patterns$1.number.test(aq[2])) {
                            var time = Number(aq[2]);
                            var i = time > 0 && time < _this.meta.overall.value.length ? time : _this.meta.overall.value.indexOf(time);
                            if (-1 !== i) {
                                tf.time_component = true;
                                tf.component = i;
                                tf.name = aq[1];
                            }
                        }
                    }
                    if (patterns$1.operator_start.test(k) && k[k.length - 1] in DataHandler.checks) {
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
                        patterns$1.comma.test(tf.value)) {
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
            this.init_summary = init$1;
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
            var init = function () {
                if (!_this.metadata.datasets || !_this.metadata.datasets.length) {
                    _this.metadata.datasets = Object.keys(_this.info);
                    if (!_this.metadata.datasets.length)
                        _this.metadata.datasets = Object.keys(_this.sets);
                }
                if (_this.metadata.measure_info) {
                    var info_1 = measure_info(_this.metadata.measure_info);
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
                            init();
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
                                init();
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
                init();
            }
        }
        DataHandler.retrievers = retrievers;
        DataHandler.checks = value_checks;
        return DataHandler;
    }());

    var defaults = {
        time: 'time',
        dataview: 'default_view',
        palette: 'vik',
        background_highlight: '#adadad',
        border: '#7e7e7e',
        border_highlight_true: '#ffffff',
        border_highlight_false: '#000000',
        missing: '#00000000',
    };

    var GlobalView = /** @class */ (function () {
        function GlobalView(site) {
            this.registered = {};
            this.entities = new Map();
            this.selected = [];
            this.select_ids = {};
            this.filters = new Map();
            // this.times = site.data.meta.overall.value
            // this.dataview = site.dataviews[site.defaults.dataview].parsed
        }
        GlobalView.prototype.filter_state = function (q, agg) {
            var _this = this;
            var as_state = !q;
            if (as_state)
                q = [];
            this.filters.forEach(function (f) {
                var component = 'selected' === f.component
                    ? _this.times['undefined' === typeof agg ? _this.dataview.time_agg : agg]
                    : f.time_component
                        ? _this.times[f.component]
                        : f.component;
                if (f.value)
                    q.push(f.variable + '[' + component + ']' + f.operator + f.value + (as_state ? f.active : ''));
            });
            return q.join('&');
        };
        GlobalView.prototype.id_state = function () {
            return Object.keys(this.select_ids).join(',');
        };
        return GlobalView;
    }());

    var patterns = {
        seps: /[\s,/._-]+/g,
        period: /\./,
        all_periods: /\./g,
        word_start: /\b(\w)/g,
        settings: /^settings?\./,
        features: /^features?\./,
        filter: /^filter\./,
        data: /^data\./,
        variables: /^variables?\./,
        properties: /prop/,
        palette: /^pal/,
        datasets: /^dat/,
        variable: /^var/,
        levels: /^lev/,
        ids: /^ids/,
        minmax: /^m[inax]{2}$/,
        int_types: /^(?:year|int|integer)$/,
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
        time_ref: /\{time\}/g,
        pre_colon: /^[^:]*:/,
        exclude_query: /^(?:features|time_range|id)$/,
        space: /\s+/,
        has_equation: /<math/,
        bracket_content: /(?:^|>)[^<]*(?:<|$)/,
        math_tags: /^(?:semantics|annotation|m|semantics)/,
        math_attributes: /^(?:xmlns|display|style|encoding|stretchy|alttext|scriptlevel|fence|math|separator)/,
        id_escapes: /(?<=#[^\s]+)([.[\](){}?*-])/g,
        repo: /\.com[/:]([^\/]+\/[^\/]+)/,
        basename: /^.*\//,
    };

    var storage$1 = {
        name: window.location.pathname || 'default',
        perm: window.localStorage,
        set: function (opt, value) {
            var s = JSON.parse(this.perm.getItem(this.name) || '{}');
            s[opt] = value;
            this.perm.setItem(this.name, JSON.stringify(s));
        },
        get: function (opt) {
            var s = JSON.parse(this.perm.getItem(this.name) || '{}');
            return s[opt];
        },
    };

    var Subscriptions = /** @class */ (function () {
        function Subscriptions(elements) {
            this.elements = elements;
            this.subs = {};
        }
        Subscriptions.prototype.add = function (id, o) {
            if (!(id in this.subs))
                this.subs[id] = new Map();
            this.subs[id].set(o.id, o);
        };
        Subscriptions.prototype.update = function (id, fun, e) {
            if (id in this.subs) {
                var tu_1 = this.elements[id];
                this.subs[id].forEach(function (u) {
                    if (fun in u)
                        u[fun](e, tu_1);
                });
            }
        };
        return Subscriptions;
    }());

    var keymap = {
        Enter: 'select',
        NumpadEnter: 'select',
        ArrowUp: 'move',
        Home: 'move',
        ArrowDown: 'move',
        End: 'move',
        Escape: 'close',
        Tab: 'close',
    };
    var tooltip_icon_rule = 'button.has-note::after,.button-wrapper.has-note ' +
        'button::before,.has-note legend::before,.has-note ' +
        'label::before,.wrapper.has-note > div > label::before{display:none}';

    function toggle_input$1(u, enable) {
        if (enable && !u.e.classList.contains('locked')) {
            u.e.removeAttribute('disabled');
            u.e.classList.remove('disabled');
            if (u.input_element)
                u.input_element.removeAttribute('disabled');
        }
        else {
            u.e.setAttribute('disabled', 'true');
            u.e.classList.add('disabled');
            if (u.input_element)
                u.input_element.setAttribute('disabled', 'true');
        }
    }
    function fill_ids_options$1(u, d, out, onend) {
        if (!(d in u.site.data.sets)) {
            u.site.data.data_queue[d][u.id] = function () {
                u.loader && u.e.removeEventListener('click', u.loader);
                fill_ids_options$1(u, d, out, onend);
                u.set_current();
                u.current_set = d;
            };
            return;
        }
        out[d] = { options: [], values: {}, display: {} };
        var current = u.values, s = out[d].options, values = out[d].values, disp = out[d].display, combobox = 'combobox' === u.type;
        var ck = !u.sensitive && !!u.current_set, n = 0;
        if (u.settings.group) {
            u.groups = { e: [], by_name: {} };
            if (combobox && u.settings.accordion) {
                u.listbox.classList.add('accordion');
                u.listbox.id = u.id + '-listbox';
            }
        }
        Object.keys(u.site.data.entities).forEach(function (k) {
            var entity = u.site.data.entities[k];
            if (d === entity.group) {
                if (ck && !(k in current)) {
                    u.sensitive = true;
                    ck = false;
                }
                if (u.groups) {
                    var groups = entity.features[u.settings.group] || ['No Group'];
                    if (!Array.isArray(groups))
                        groups = [groups];
                    for (var g = groups.length; g--;) {
                        var group = groups[g];
                        if (!(group in u.groups.by_name)) {
                            var e = document.createElement(combobox ? 'div' : 'optgroup');
                            if (combobox) {
                                var id = u.id + '_' + group.replace(patterns.seps, '-');
                                var ee = void 0;
                                if (u.settings.accordion) {
                                    e.setAttribute('data-group', group);
                                    e.className = 'combobox-group accordion-item combobox-component';
                                    e.appendChild((ee = document.createElement('div')));
                                    ee.className = 'accordion-header combobox-component';
                                    ee.appendChild((ee = document.createElement('button')));
                                    ee.id = id + '-label';
                                    ee.innerText = group;
                                    ee.type = 'button';
                                    ee.className = 'accordion-button combobox-component collapsed';
                                    ee.setAttribute('data-bs-toggle', 'collapse');
                                    ee.setAttribute('data-bs-target', '#' + id);
                                    ee.setAttribute('aria-expanded', 'false');
                                    ee.setAttribute('aria-controls', id);
                                    e.appendChild((ee = document.createElement('div')));
                                    ee.id = id;
                                    ee.className = 'combobox-component accordion-collapse collapse';
                                    ee.setAttribute('data-bs-parent', '#' + u.id + '-listbox');
                                    ee.appendChild((ee = document.createElement('div')));
                                    ee.className = 'accordion-body combobox-component';
                                    ee.role = 'group';
                                    ee.setAttribute('aria-labelledby', id + '-label');
                                }
                                else {
                                    e.className = 'combobox-group combobox-component';
                                    e.id = id;
                                    e.role = 'group';
                                    e.appendChild((ee = document.createElement('div')));
                                    ee.appendChild((ee = document.createElement('label')));
                                    ee.dataset.for = id;
                                    ee.innerText = group;
                                    ee.id = id + '-label';
                                    ee.className = 'combobox-group-label combobox-component';
                                }
                            }
                            else {
                                e.setAttribute('aria-label', group);
                            }
                            u.groups.by_name[group] = e;
                            u.groups.e.push(e);
                        }
                        var o = u.add(k, entity.features.name, true);
                        o.setAttribute('data-group', group);
                        if (combobox && u.settings.accordion) {
                            u.groups.by_name[group].lastElementChild.lastElementChild.appendChild(o);
                        }
                        else {
                            u.groups.by_name[group].appendChild(o);
                        }
                    }
                }
                else {
                    s.push(u.add(k, entity.features.name));
                    values[k] = n;
                    disp[entity.features.name] = n++;
                }
            }
        });
        if (u.settings.group) {
            n = 0;
            Object.keys(u.groups.by_name).forEach(function (g) {
                u.groups.by_name[g].querySelectorAll(combobox ? '.combobox-option' : 'option').forEach(function (c) {
                    s.push(c);
                    values[combobox ? c.dataset.value : c.value] = n;
                    disp[c.innerText] = n++;
                });
            });
        }
        onend && onend();
    }
    function fill_variables_options(u, d, out) {
        out[d] = { options: [], values: {}, display: {} };
        var current = u.values, s = out[d].options, values = out[d].values, disp = out[d].display, combobox = 'combobox' === u.type;
        var ck = !u.sensitive && !!u.current_set, n = 0;
        if (u.settings.group) {
            u.groups = { e: [], by_name: {} };
            if (combobox && u.settings.accordion) {
                u.listbox.classList.add('accordion');
                u.listbox.id = u.id + '-listbox';
            }
        }
        var url_set = u.site.url_options[u.id];
        var ck_suffix = false;
        if (url_set && !(url_set in u.site.data.variables)) {
            u.site.url_options[u.id] = url_set.replace(patterns.pre_colon, '');
            if (!(url_set in u.site.data.variables))
                ck_suffix = true;
        }
        u.site.data.info[d].schema.fields.forEach(function (m) {
            var v = u.site.data.variables[m.name];
            if (v && !v.is_time) {
                var l = u.site.data.format_label(m.name);
                if (ck && !(m.name in current)) {
                    u.sensitive = true;
                    ck = false;
                }
                if (u.groups) {
                    var groups = (m.info && m.info[u.settings.group]) || ['No Group'];
                    if (!Array.isArray(groups))
                        groups = [groups];
                    for (var g = groups.length; g--;) {
                        var group = groups[g];
                        if (!(group in u.groups.by_name)) {
                            var e = document.createElement(combobox ? 'div' : 'optgroup');
                            if (combobox) {
                                var id = u.id + '_' + group.replace(patterns.seps, '-');
                                var ee = void 0;
                                if (u.settings.accordion) {
                                    e.setAttribute('data-group', group);
                                    e.className = 'combobox-group accordion-item combobox-component';
                                    e.appendChild((ee = document.createElement('div')));
                                    ee.className = 'accordion-header combobox-component';
                                    ee.appendChild((ee = document.createElement('button')));
                                    ee.id = id + '-label';
                                    ee.innerText = group;
                                    ee.type = 'button';
                                    ee.className = 'accordion-button combobox-component collapsed';
                                    ee.setAttribute('data-bs-toggle', 'collapse');
                                    ee.setAttribute('data-bs-target', '#' + id);
                                    ee.setAttribute('aria-expanded', 'false');
                                    ee.setAttribute('aria-controls', id);
                                    e.appendChild((ee = document.createElement('div')));
                                    ee.id = id;
                                    ee.className = 'combobox-component accordion-collapse collapse';
                                    ee.setAttribute('data-bs-parent', '#' + u.id + '-listbox');
                                    ee.appendChild((ee = document.createElement('div')));
                                    ee.className = 'accordion-body combobox-component';
                                    ee.role = 'group';
                                    ee.setAttribute('aria-labelledby', id + '-label');
                                }
                                else {
                                    e.className = 'combobox-group combobox-component';
                                    e.role = 'group';
                                    e.appendChild((ee = document.createElement('div')));
                                    ee.appendChild((ee = document.createElement('label')));
                                    ee.dataset.for = id;
                                    ee.innerText = group;
                                    ee.id = id;
                                    ee.className = 'combobox-group-label combobox-component';
                                }
                            }
                            else {
                                e.setAttribute('aria-label', group);
                            }
                            u.groups.by_name[group] = e;
                            u.groups.e.push(e);
                        }
                        var o = u.add(m.name, l, true, m);
                        o.setAttribute('data-group', group);
                        if (combobox && u.settings.accordion) {
                            u.groups.by_name[group].lastElementChild.lastElementChild.appendChild(o);
                        }
                        else {
                            u.groups.by_name[group].appendChild(o);
                        }
                    }
                }
                else {
                    s.push(u.add(m.name, l, true, m));
                    s[n].id = u.id + '-option' + n;
                    values[m.name] = n;
                    disp[l] = n++;
                }
                if (ck_suffix && url_set === m.name.replace(patterns.pre_colon, '')) {
                    u.site.url_options[u.id] = m.name;
                    ck_suffix = false;
                }
            }
        });
        if (u.settings.group) {
            n = 0;
            Object.keys(u.groups.by_name).forEach(function (g) {
                u.groups.by_name[g].querySelectorAll(combobox ? '.combobox-option' : 'option').forEach(function (c) {
                    s.push(c);
                    s[n].id = u.id + '-option' + n;
                    values[combobox ? c.dataset.value : c.value] = n;
                    disp[(c.firstChild && c.firstChild.textContent) || c.innerText] = n++;
                });
            });
        }
        if (!u.settings.clearable && !(u.default in u.site.data.variables))
            u.default = u.site.defaults.variable;
    }
    function fill_levels_options(u, d, v, out) {
        var m = u.site.data.variables[v].info[d], t = 'string' === m.type ? 'levels' : 'ids', l = m[t];
        if (l) {
            var k = d + v;
            out[k] = { options: [], values: {}, display: {} };
            var current_1 = u.values, s_1 = out[k].options, values_1 = out[k].values, disp_1 = out[k].display;
            var ck_1 = !u.sensitive && !!u.current_set, n_1 = 0;
            Object.keys(l).forEach(function (k) {
                var lk = l[k];
                if (ck_1 && !(k in current_1)) {
                    u.sensitive = true;
                    ck_1 = false;
                }
                s_1.push(u.add(lk.id, lk.name, true));
                values_1[lk.id] = n_1;
                disp_1[lk.name] = n_1++;
            });
        }
        else if ('ids' === t) {
            u.site.data.data_queue[d][u.id] = function () {
                return fill_levels_options(u, d, v, out);
            };
        }
    }

    function setting(u) {
        var _this = this;
        this.spec.settings[u.setting]; var v = u.value(), theme = v ? 'dark' : 'light';
        if (v !== this.spec.settings[u.setting]) {
            this.spec.settings[u.setting] = v;
            if ('theme_dark' === u.setting) {
                v
                    ? document.body.classList.replace('light-theme', 'dark-theme')
                    : document.body.classList.replace('dark-theme', 'light-theme');
                if (this.spec.plotly)
                    Object.keys(this.spec.plotly).forEach(function (k) { return _this.spec.plotly[k].u.update_theme(); });
                if (this.spec.map)
                    Object.keys(this.spec.map).forEach(function (k) {
                        var u = _this.spec.map[k].u;
                        if (u && theme in u.tiles) {
                            Object.keys(u.tiles).forEach(function (l) {
                                if (theme !== l)
                                    u.tiles[l].removeFrom(u.map);
                            });
                            u.tiles[theme].addTo(u.map);
                        }
                    });
            }
            else if ('hide_url_parameters' === u.setting) {
                window.history.replaceState(Date.now(), '', this.spec.settings.hide_url_parameters
                    ? window.location.protocol + '//' + window.location.host + window.location.pathname
                    : this.get_options_url());
            }
            else if ('hide_tooltips' === u.setting) {
                v ? this.page.script_style.sheet.insertRule(tooltip_icon_rule, 0) : this.page.script_style.sheet.deleteRule(0);
            }
            else if ('map_overlay' === u.setting) {
                Object.keys(this.spec.map).forEach(function (id) {
                    if ('_' !== id[0]) {
                        var mu = _this.spec.map[id].u;
                        if (v) {
                            mu.update();
                        }
                        else {
                            mu.overlay.clearLayers();
                            mu.overlay_control.remove();
                        }
                    }
                });
            }
            else if ('tracking' === u.setting) {
                if (v && this.spec.tag_id) {
                    this.gtag('js', new Date());
                    this.gtag('config', this.spec.tag_id);
                    this.gtag('consent', 'default', { analytics_storage: 'denied' });
                }
                this.gtag('consent', 'update', { analytics_storage: v ? 'granted' : 'denied' });
            }
            else {
                this.global_update();
            }
            this.gtag('event', 'setting', { event_category: u.setting, event_label: v });
            this.storage.set(u.setting, this.spec.settings[u.setting]);
        }
    }
    function options(u) {
        var _this = this;
        var no_view = !u.view || !this.dataviews[u.view].selection, d = (this.valueOf(u.dataset || no_view ? '' : this.spec.dataviews[u.view].dataset) ||
            this.defaults.dataset), va = this.valueOf(u.variable), k = d + (va ? va : ''), combobox = 'combobox' === u.type;
        if (!(k in u.option_sets)) {
            if (this.patterns.variable.test(u.optionSource)) {
                if ('number' === typeof u.default && -1 === u.default)
                    u.default = this.defaults.variable;
                fill_variables_options(u, d, u.option_sets);
            }
            else if (this.patterns.levels.test(u.optionSource)) {
                fill_levels_options(u, d, va, u.option_sets);
            }
            else if (this.patterns.ids.test(u.optionSource)) {
                fill_ids_options$1(u, d, u.option_sets);
            }
        }
        if (k in u.option_sets) {
            var fresh_1 = k !== u.current_set && (u.sensitive || !u.current_set), c_1 = u[combobox ? 'listbox' : 'e'];
            if (fresh_1 || u.filter || u.selection_subset) {
                if (fresh_1) {
                    c_1.innerHTML = '';
                    u.values = u.option_sets[k].values;
                    u.display = u.option_sets[k].display;
                    u.options = u.option_sets[k].options;
                }
                var ns_1 = 0;
                if ('ID' === u.variable || this.patterns.ids.test(u.optionSource)) {
                    var value = u.value();
                    var selection = -1 === value || '' === value ? u.subset : u.selection_subset, v_1 = {};
                    if (!no_view) {
                        if (selection in this.inputs)
                            selection = this.valueOf(selection);
                        if ('siblings' === selection) {
                            var rel = this.data.entity_tree && this.data.entity_tree[value];
                            if (rel) {
                                var parents = Object.keys(rel.parents);
                                if (parents.length) {
                                    v_1 = {};
                                    parents.forEach(function (id) {
                                        v_1 = __assign(__assign({}, v_1), _this.data.entity_tree[id].children);
                                    });
                                }
                            }
                        }
                        else {
                            v_1 = this.spec.dataviews[u.view].selection[selection];
                        }
                    }
                    u.options.forEach(function (si) {
                        if (fresh_1 && !u.groups)
                            c_1.appendChild(si);
                        if (no_view || (si.value || si.dataset.value) in v_1) {
                            si.classList.remove('hidden');
                            ns_1++;
                        }
                        else {
                            si.classList.add('hidden');
                        }
                    });
                }
                else if (fresh_1) {
                    u.options.forEach(function (si) {
                        si.classList.remove('hidden');
                        if (!u.groups)
                            c_1.appendChild(si);
                        ns_1++;
                    });
                }
                else
                    ns_1++;
                if (fresh_1 && u.groups)
                    u.groups.e.forEach(function (e) { return c_1.appendChild(e); });
                toggle_input$1(u, !!ns_1);
                u.current_set = k;
                if (fresh_1) {
                    if (combobox) {
                        u.source = [];
                    }
                    else {
                        u.e.selectedIndex = -1;
                        u.source = '';
                    }
                    u.id in this.url_options ? u.set(this.url_options[u.id]) : u.state in u.values ? u.set(u.state) : u.reset();
                }
                if (u.filter)
                    u.filter();
            }
        }
    }
    function set_current() {
        this.values = this.option_sets[this.dataset].values;
        this.display = this.option_sets[this.dataset].display;
        this.options = this.option_sets[this.dataset].options;
        this.source = '';
        this.id in this.site.url_options
            ? this.set(this.site.url_options[this.id])
            : this.state in this.values
                ? this.set(this.state)
                : this.reset();
    }
    function min(u, c) {
        return __awaiter(this, void 0, void 0, function () {
            var cv, uv, v, variable;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cv = c.value(), uv = u.value(), v = this.dataviews[u.view || c.view];
                        if ('string' === typeof cv) {
                            cv = this.patterns.minmax.test(cv) ? c.parsed.min : parseFloat(cv);
                        }
                        if (!(v && v.y)) return [3 /*break*/, 4];
                        variable = this.valueOf(v.y);
                        if (!(variable in this.data.variables)) return [3 /*break*/, 3];
                        if (!!v.time_range.time.length) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.conditionals.time_range(v, u, true)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        cv = Math.max(v.time_range.time[0], cv);
                        _a.label = 3;
                    case 3:
                        u.update();
                        _a.label = 4;
                    case 4:
                        u.e.min = ('undefined' === typeof u.parsed.min ? cv : Math.max(u.parsed.min, cv)) + '';
                        if (!u.e.value) {
                            u.reset();
                        }
                        else if ('number' === typeof uv && isFinite(uv) && uv < cv) {
                            u.set(cv);
                        }
                        if (u.min_indicator)
                            u.min_indicator.firstElementChild.innerText = cv + '';
                        return [2 /*return*/];
                }
            });
        });
    }
    function max(u, c) {
        return __awaiter(this, void 0, void 0, function () {
            var cv, uv, v, variable;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cv = c.value(), uv = u.value(), v = this.dataviews[u.view || c.view];
                        if ('string' === typeof cv) {
                            cv = this.patterns.minmax.test(cv) ? c.parsed.min : parseFloat(cv);
                        }
                        if (!(v && v.y)) return [3 /*break*/, 4];
                        variable = this.valueOf(v.y);
                        if (!(variable in this.data.variables)) return [3 /*break*/, 3];
                        if (!!v.time_range.time.length) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.conditionals.time_range(v, u, true)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        cv = Math.min(v.time_range.time[1], cv);
                        _a.label = 3;
                    case 3:
                        u.update();
                        _a.label = 4;
                    case 4:
                        u.e.max = ('undefined' === typeof u.parsed.max ? cv : Math.min(u.parsed.max, cv)) + '';
                        if (!u.e.value) {
                            u.reset();
                        }
                        else if ('number' === typeof uv && isFinite(uv) && uv > cv) {
                            u.set(cv);
                        }
                        if (u.max_indicator)
                            u.max_indicator.firstElementChild.innerText = cv + '';
                        return [2 /*return*/];
                }
            });
        });
    }
    function dataview(f) {
        var _this = this;
        f = f || this.dataviews[this.defaults.dataview];
        var state = f.value();
        if (state !== f.state && this.view.registered[f.parsed.dataset]) {
            if (this.data.inited[f.parsed.dataset]) {
                f.valid = true;
                f.n_selected.ids = 0;
                f.n_selected.children = 0;
                f.n_selected.features = 0;
                f.n_selected.variables = 0;
                f.n_selected.dataset = 0;
                f.n_selected.filtered = 0;
                f.n_selected.full_filter = 0;
                f.n_selected.all = 0;
                f.selection.ids = {};
                f.selection.children = {};
                f.selection.features = {};
                f.selection.variables = {};
                f.selection.dataset = {};
                f.selection.filtered = {};
                f.selection.full_filter = {};
                f.selection.all = {};
                this.view.filters.forEach(function (f) {
                    f.passed = 0;
                    f.failed = 0;
                });
                this.view.entities.forEach(function (e) {
                    var c = f.check(e), id = e.features.id;
                    c.all = 0;
                    if (c.ids) {
                        f.selection.ids[id] = e;
                        f.n_selected.ids++;
                        c.all++;
                    }
                    if (c.features) {
                        f.selection.features[id] = e;
                        f.n_selected.features++;
                        c.all++;
                    }
                    if (c.variables) {
                        f.selection.variables[id] = e;
                        f.n_selected.variables++;
                        c.all++;
                    }
                    if (c.dataset) {
                        f.selection.dataset[id] = e;
                        f.n_selected.dataset++;
                        c.all++;
                    }
                    if (c.dataset && c.ids) {
                        f.selection.children[id] = e;
                        f.n_selected.children++;
                    }
                    if (c.features && c.variables) {
                        f.selection.full_filter[id] = e;
                        f.n_selected.full_filter++;
                    }
                    if (c.variables && c.features && c.ids) {
                        f.selection.filtered[id] = e;
                        f.n_selected.filtered++;
                    }
                    if (4 === c.all) {
                        f.selection.all[id] = e;
                        f.n_selected.all++;
                    }
                });
                this.request_queue(false, f.id);
            }
            else {
                f.valid = false;
                this.data.data_queue[f.parsed.dataset][f.id] = function () {
                    return _this.conditionals.dataview(f);
                };
            }
        }
    }
    function time_filters(u) {
        var _this = this;
        u.time_range.filtered[0] = Infinity;
        u.time_range.filtered[1] = -Infinity;
        var d = u.get.dataset(), time = this.data.meta.times[d], current = u.time_range.filtered_index + '';
        if (!this.data.inited[d])
            return;
        for (var i = time.n; i--;) {
            var pass = false;
            if (i >= u.time_range.index[0] && i <= u.time_range.index[1]) {
                for (var f = u.time_filters.length; f--;) {
                    var v = {}, tf = u.time_filters[f];
                    if (!(tf.value in v))
                        v[tf.value] = this.valueOf(tf.value);
                    pass = DataHandler.checks[tf.type](time.value[i], v[tf.value]);
                    if (!pass)
                        break;
                }
            }
            u.times[i] = pass;
            if (pass) {
                if (u.time_range.filtered[0] > time.value[i])
                    u.time_range.filtered[0] = time.value[i];
                if (u.time_range.filtered[1] < time.value[i])
                    u.time_range.filtered[1] = time.value[i];
            }
        }
        u.time_range.filtered_index = [
            u.time_range.index[0] + u.time_range.filtered[0] - u.time_range.time[0],
            u.time_range.index[1] + u.time_range.filtered[1] - u.time_range.time[1],
        ];
        if (current !== u.time_range.filtered_index + '') {
            var c = this.dependencies[u.id + '_filter'];
            if (c)
                c.forEach(function (ci) {
                    if ('update' === ci.type) {
                        _this.inputs[ci.id].update();
                    }
                    else if (ci.type in _this.conditionals) {
                        _this.conditionals[ci.type](_this.inputs[ci.id], u);
                    }
                });
        }
    }
    function time_range(u, c, passive) {
        return __awaiter(this, void 0, void 0, function () {
            var v, d, tv, t, s, variable, r, _a, reset_1, range;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        v = c && c.value(), d = u.get.dataset(), tv = u.time ? this.valueOf(u.time) : this.defaults.time, t = tv in this.data.variables ? this.data.variables[tv].info[d].min : 1, s = this.dependencies[u.id + '_time'], variable = v in this.data.variables ? v : this.valueOf(u.y);
                        _a = variable;
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.data.get_variable(variable, u.id)];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        r = _a;
                        if (r) {
                            reset_1 = d + variable != u.time_range.dataset + u.time_range.variable;
                            range = r.time_range[d];
                            if (-1 !== range[0]) {
                                u.time_range.dataset = d;
                                u.time_range.variable = variable;
                                u.time_range.index[0] = range[0];
                                u.time_range.time[0] = u.time_range.filtered[0] = t + range[0];
                                u.time_range.index[1] = range[1];
                                u.time_range.time[1] = u.time_range.filtered[1] = t + range[1];
                            }
                            if (!passive && s) {
                                s.forEach(function (si) {
                                    var su = _this.inputs[si.id], value = su.value();
                                    if ('min' === si.type) {
                                        if (reset_1 || (isFinite(u.time_range.time[0]) && parseFloat(su.e.min) !== u.time_range.time[0])) {
                                            su.e.min = u.time_range.time[0] + '';
                                            if (reset_1 || !_this.meta.retain_state || u.time_range.time[0] > value) {
                                                su.current_default = u.time_range.time[0];
                                                su.set(su.current_default);
                                            }
                                        }
                                    }
                                    else if ('max' === si.type) {
                                        if (reset_1 || (isFinite(u.time_range.time[1]) && parseFloat(su.e.max) !== u.time_range.time[1])) {
                                            su.e.max = u.time_range.time[1] + '';
                                            if (reset_1 || !_this.meta.retain_state || u.time_range.time[1] < value || value < u.time_range.time[0]) {
                                                su.current_default = u.time_range.time[1];
                                                su.set(su.current_default);
                                            }
                                        }
                                    }
                                });
                                this.conditionals.time_filters(u);
                            }
                        }
                        else {
                            u.time_range.dataset = d;
                            u.time_range.index[0] = 0;
                            u.time_range.time[0] = u.time_range.filtered[0] = 1;
                            u.time_range.index[1] = 0;
                            u.time_range.time[1] = u.time_range.filtered[1] = 1;
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    function id_filter() {
        var _this = this;
        var ids = {};
        this.view.selected = [];
        this.view.select_ids = ids;
        if (this.data.metadata.datasets) {
            this.data.metadata.datasets.forEach(function (d) {
                if (d in _this.page.modal.filter.entity_inputs) {
                    var s = _this.page.modal.filter.entity_inputs[d].value(), cs_1 = [];
                    if (Array.isArray(s)) {
                        s.forEach(function (id) {
                            var e = _this.data.entities[id];
                            if (e) {
                                cs_1.push(id);
                                _this.view.selected.push(id);
                                ids[id] = true;
                                if (e.relations) {
                                    Object.keys(e.relations.parents).forEach(function (k) { return (ids[k] = true); });
                                    Object.keys(e.relations.children).forEach(function (k) { return (ids[k] = true); });
                                }
                            }
                        });
                        _this.page.modal.filter.entity_inputs[d].source = cs_1;
                    }
                }
            });
        }
    }

    var conditionals = /*#__PURE__*/Object.freeze({
        __proto__: null,
        dataview: dataview,
        id_filter: id_filter,
        max: max,
        min: min,
        options: options,
        set_current: set_current,
        setting: setting,
        time_filters: time_filters,
        time_range: time_range
    });

    var palettes = {
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
    };

    var patterns = {
        seps: /[\s,/._-]+/g,
        period: /\./,
        all_periods: /\./g,
        word_start: /\b(\w)/g,
        settings: /^settings?\./,
        features: /^features?\./,
        filter: /^filter\./,
        data: /^data\./,
        variables: /^variables?\./,
        properties: /prop/,
        palette: /^pal/,
        datasets: /^dat/,
        variable: /^var/,
        levels: /^lev/,
        ids: /^ids/,
        minmax: /^m[inax]{2}$/,
        int_types: /^(?:year|int|integer)$/,
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
        time_ref: /\{time\}/g,
        pre_colon: /^[^:]*:/,
        exclude_query: /^(?:features|time_range|id)$/,
        space: /\s+/,
        has_equation: /<math/,
        bracket_content: /(?:^|>)[^<]*(?:<|$)/,
        math_tags: /^(?:semantics|annotation|m|semantics)/,
        math_attributes: /^(?:xmlns|display|style|encoding|stretchy|alttext|scriptlevel|fence|math|separator)/,
        id_escapes: /(?<=#[^\s]+)([.[\](){}?*-])/g,
        repo: /\.com[/:]([^\/]+\/[^\/]+)/,
        basename: /^.*\//,
    };

    var value_types = {
        percent: function (v) {
            return v + '%';
        },
        minute: function (v) {
            return v + ' minutes';
        },
        minutes: function (v) {
            return v + ' minutes';
        },
        dollars: function (v) {
            return '$' + v;
        },
        'Mb/s': function (v) {
            return v + ' Mbps';
        },
    };

    var defaults = {
        time: 'time',
        dataview: 'default_view',
        palette: 'vik',
        background_highlight: '#adadad',
        border: '#7e7e7e',
        border_highlight_true: '#ffffff',
        border_highlight_false: '#000000',
        missing: '#00000000',
    };

    var summary_levels = {
        dataset: 'Overall',
        filtered: 'Filtered',
        children: 'Unfiltered selection',
        all: 'Selection',
    };

    function set_description(e, info) {
        var description = info.long_description || info.description || info.short_description || '';
        var has_equation = patterns.has_equation.test(description);
        if (has_equation) {
            var tags = description.split(patterns.bracket_content);
            for (var i = tags.length; i--;) {
                var t = tags[i];
                if (t && '/' !== t.substring(0, 1)) {
                    var p = t.split(patterns.space), n = p.length;
                    has_equation = patterns.math_tags.test(p[0]);
                    if (!has_equation)
                        break;
                    for (var a = 1; a < n; a++) {
                        has_equation = patterns.math_attributes.test(p[a]);
                        if (!has_equation)
                            break;
                    }
                    if (!has_equation)
                        break;
                }
            }
        }
        e[has_equation ? 'innerHTML' : 'innerText'] = description;
    }

    var TutorialManager = /** @class */ (function () {
        function TutorialManager(tutorials, elements, resetter) {
            var _this = this;
            this.container = document.createElement('div');
            this.backdrop = document.createElement('div');
            this.highlight = document.createElement('div');
            this.menu = document.createElement('div');
            this.frame = document.createElement('div');
            this.header = document.createElement('p');
            this.dialog = document.createElement('p');
            this.timer = document.createElement('div');
            this.progress = document.createElement('div');
            this.continue = document.createElement('button');
            this.in_progress = '';
            this.waiting = false;
            this.current_step = 0;
            this.current_time = 0;
            this.tutorials = tutorials;
            this.site_elements = elements || {};
            this.site_reset = resetter || (function () { });
            this.start_tutorial = this.start_tutorial.bind(this);
            this.progress_tutorial = this.progress_tutorial.bind(this);
            this.execute_step = this.execute_step.bind(this);
            this.end_tutorial = this.end_tutorial.bind(this);
            // prepare menu
            document.body.appendChild(this.menu);
            this.menu.id = 'community_tutorials_menu';
            this.menu.className = 'modal fade';
            this.menu.tabIndex = -1;
            var e = document.createElement('div');
            this.menu.appendChild(e);
            e.className = 'modal-dialog modal-dialog-scrollable';
            e.appendChild((e = document.createElement('div')));
            e.className = 'modal-content';
            e.appendChild((e = document.createElement('div')));
            e.className = 'modal-header';
            e.appendChild((e = document.createElement('p')));
            e.className = 'modal-title h5';
            e.innerText = 'Tutorials';
            var close = document.createElement('button');
            e.insertAdjacentElement('afterend', close);
            close.type = 'button';
            close.className = 'btn-close';
            close.setAttribute('data-bs-dismiss', 'modal');
            close.setAttribute('aria-label', 'Close');
            var l = document.createElement('div');
            this.menu.lastElementChild.lastElementChild.appendChild(l);
            l.className = 'modal-body';
            Object.keys(tutorials).forEach(function (name) {
                var t = tutorials[name], e = document.createElement('div'), description = document.createElement('div'), start = document.createElement('button');
                t.manager = _this;
                t.n_steps = t.steps.length;
                var p = document.createElement('div');
                l.appendChild(e);
                e.className = 'tutorial-listing card';
                e.appendChild(p);
                p.className = 'card-header';
                p.innerText = t.title || name;
                e.appendChild((p = document.createElement('div')));
                p.className = 'card-body';
                p.appendChild(description);
                description.appendChild(document.createElement('p'));
                description.firstElementChild.innerText = t.description || '';
                if (t.steps.length && t.steps[0].before && !Array.isArray(t.steps[0].before)) {
                    var before_1 = t.steps[0].before, setting_display_1 = document.createElement('div'), header = document.createElement('span');
                    setting_display_1.className = 'tutorial-initial-settings';
                    setting_display_1.appendChild(header);
                    header.innerText = 'Initial Settings';
                    header.className = 'h6';
                    Object.keys(t.steps[0].before).forEach(function (k, i) {
                        var row = document.createElement('p');
                        var part = document.createElement('span');
                        part.className = 'syntax-variable';
                        part.innerText = k.replace(patterns.settings, '');
                        row.appendChild(part);
                        part = document.createElement('span');
                        part.className = 'syntax-operator';
                        part.innerText = ' = ';
                        row.appendChild(part);
                        part = document.createElement('span');
                        part.className = 'syntax-value';
                        part.innerText = before_1[k];
                        row.appendChild(part);
                        setting_display_1.appendChild(row);
                    });
                    description.appendChild(setting_display_1);
                }
                p.appendChild(start);
                start.type = 'button';
                start.className = 'btn';
                start.innerText = 'Start';
                start.dataset.name = name;
                start.addEventListener('click', _this.start_tutorial);
            });
            // prepare step display
            document.body.appendChild(this.container);
            this.container.appendChild(this.backdrop);
            this.container.className = 'tutorial-container hidden';
            this.container.addEventListener('keyup', this.progress_tutorial);
            this.backdrop.addEventListener('click', this.progress_tutorial);
            this.backdrop.className = 'tutorial-backdrop';
            this.container.appendChild(this.highlight);
            this.highlight.className = 'tutorial-highlight';
            this.highlight.addEventListener('click', this.progress_tutorial);
            this.container.appendChild(this.frame);
            this.frame.className = 'tutorial-frame';
            this.frame.style.left = '50%';
            this.frame.tabIndex = -1;
            this.frame.appendChild((e = document.createElement('div')));
            this.frame.id = 'community_tutorial_frame';
            this.frame.role = 'dialog';
            this.frame.setAttribute('aria-labelledby', 'community_tutorial_description');
            e.className = 'tutorial-step card';
            e.appendChild((e = document.createElement('div')));
            e.className = 'card-header';
            e.appendChild(this.header);
            this.header.className = 'card-title';
            this.header.id = 'community_tutorial_title';
            close = document.createElement('button');
            e.appendChild(close);
            close.type = 'button';
            close.className = 'btn-close';
            close.setAttribute('aria-label', 'Close Tutorial');
            close.addEventListener('click', this.end_tutorial);
            this.frame.firstElementChild.appendChild((e = document.createElement('div')));
            e.className = 'card-body';
            e.appendChild(this.dialog);
            this.dialog.role = 'status';
            this.dialog.id = 'community_tutorial_description';
            this.dialog.setAttribute('aria-labelledby', 'community_tutorial_progress');
            this.dialog.setAttribute('aria-live', 'polite');
            e.lastElementChild.className = 'card-text';
            this.frame.firstElementChild.appendChild((e = document.createElement('div')));
            e.className = 'tutorial-footer card-footer';
            e.appendChild(this.progress);
            this.progress.role = 'progressbar';
            this.progress.id = 'community_tutorial_progress';
            e.appendChild(this.timer);
            this.timer.role = 'timer';
            e.appendChild(this.continue);
            this.continue.addEventListener('click', this.progress_tutorial);
            this.continue.type = 'button';
            this.continue.className = 'btn';
            this.continue.innerText = 'Next';
            this.continue.setAttribute('aria-controls', 'community_tutorial_frame');
        }
        TutorialManager.prototype.retrieve_element = function (name) {
            var e;
            if (name in this.site_elements) {
                this.current_site_element = this.site_elements[name];
                e = this.current_site_element.e;
            }
            else if ('nav:' === name.substring(0, 4).toLowerCase()) {
                var text_1 = name.replace(patterns.pre_colon, '');
                document.querySelectorAll('.nav-item button').forEach(function (item) {
                    if (text_1 === item.innerText)
                        e = item;
                });
                var group = _this.listbox.querySelectorAll('.combobox-group');
                if (group.length) {
                    _this.groups = { e: [], by_name: {} };
                    group.forEach(function (e) {
                        var name = e.dataset.group;
                        _this.groups.e.push(e);
                        _this.groups.by_name[name] = e;
                    });
                }
            }
            _this.container.className = 'combobox-options-container combobox-component hidden';
            _this.site.page.overlay.appendChild(_this.container);
            _this.container.appendChild(_this.listbox);
            _this.selection = _this.e.firstElementChild.firstElementChild;
            _this.input_element = _this.e.firstElementChild.lastElementChild;
            if (2 === _this.e.childElementCount) {
                _this.e.lastElementChild.addEventListener('click', function () {
                    if (!this.e.classList.contains('locked')) {
                        this.cleared_selection = '';
                        this.set([]);
                        this.input_element.focus();
                    }
                }.bind(_this));
            }
            _this.input_element.addEventListener('focus', function () {
                this.e.classList.add('focused');
            }.bind(_this));
            _this.input_element.addEventListener('blur', function () {
                this.e.classList.remove('focused');
            }.bind(_this));
            _this.listbox.addEventListener('click', _this.set);
            window.addEventListener('resize', _this.resize);
            _this.e.addEventListener('mousedown', _this.toggle);
            _this.listbox.addEventListener('mouseover', _this.highlight);
            if (_this.settings.accordion) {
                _this.listbox.addEventListener('show.bs.collapse', function (e) {
                    var group = _this.hover_index === -1 ? '' : _this.options[_this.hover_index].getAttribute('data-group');
                    var et = e.target;
                    if (group !== et.getAttribute('data-group')) {
                        et.firstElementChild.firstElementChild.dispatchEvent(new MouseEvent('mouseover'));
                        _this.input_element.focus();
                    }
                });
            }
            if (_this.settings.search) {
                _this.input_element.addEventListener('keyup', _this.filterer);
            }
            _this.input_element.addEventListener('keydown', function (e) {
                var action = keymap[e.code];
                if (action) {
                    if ('close' === action) {
                        this.close();
                    }
                    else if ('select' === action) {
                        if (!this.expanded)
                            return this.toggle(void 0, this.input_element);
                        this.set(e);
                    }
                    else if ('move' === action) {
                        var value = this.input_element.value;
                        if (this.settings.strict || (this.expanded && '' === value)) {
                            e.preventDefault();
                            if ('ArrowUp' === e.code) {
                                if (this.filter_index && this.filter_index.length) {
                                    this.hover_index = this.filter_index.indexOf(this.hover_index) - 1;
                                    this.hover_index = this.filter_index[0 > this.hover_index ? 0 : this.hover_index];
                                }
                                else {
                                    this.hover_index = Math.max(0, this.hover_index - 1);
                                }
                            }
                            else if ('ArrowDown' === e.code) {
                                if (this.filter_index && this.filter_index.length) {
                                    this.hover_index = this.filter_index.indexOf(this.hover_index) + 1;
                                    this.hover_index =
                                        this.filter_index[this.filter_index.length - 1 < this.hover_index ? this.filter_index.length - 1 : this.hover_index];
                                }
                                else {
                                    this.hover_index = Math.min(this.options.length - 1, this.hover_index + 1);
                                }
                            }
                            else if ('Home' === e.code) {
                                this.hover_index = 0;
                            }
                            else if ('End' === e.code) {
                                this.hover_index = this.options.length - 1;
                            }
                            if (this.expanded) {
                                this.highlight();
                            }
                            else {
                                this.set(this.hover_index);
                            }
                        }
                        else if (patterns.number.test(value)) {
                            this.set(Number(value) + ('ArrowUp' === e.code ? 1 : -1));
                        }
                    }
                }
                else if (!this.expanded) {
                    this.toggle(void 0, this.input_element);
                }
                else {
                    this.clear_highlight();
                }
            }.bind(_this));
            _this.set = function (v, toggle) {
                if (!v)
                    v = this.input_element.value;
                var update = false, i = -1;
                if (!Array.isArray(v) && 'object' === typeof v) {
                    var t = v.target;
                    if ((this.settings.accordion ? 'BUTTON' : 'LABEL') === t.tagName)
                        return void 0;
                    i = this.hover_index;
                    if (-1 !== i &&
                        (this.options[i].classList.contains('hidden') || this.options[i].classList.contains('filter-hidden')))
                        i = -1;
                    v =
                        -1 === i
                            ? 'INPUT' === t.tagName
                                ? this.input_element.value
                                : t.dataset.value || t.innerText
                            : this.options[i].dataset.value || this.options[i].innerText;
                    toggle = this.settings.multi;
                }
                this.filter_reset();
                if (Array.isArray(v)) {
                    if (this.settings.multi) {
                        this.listbox.querySelectorAll('.selected').forEach(function (e) {
                            e.classList.remove('selected');
                            e.setAttribute('aria-selected', 'false');
                        });
                        this.source = -1 === v[0] ? [] : v;
                        v.forEach(this.set_selected);
                        update = true;
                    }
                    else
                        v = v[0];
                }
                if (!Array.isArray(this.source))
                    this.source = [];
                if (!Array.isArray(v)) {
                    if (this.settings.strict && 'string' === typeof v && !(v in this.values) && patterns.number.test(v))
                        v = +v;
                    if ('number' !== this.value_type && 'number' === typeof v && this.options[v]) {
                        v = this.options[v].dataset.value;
                    }
                    if ('string' === typeof v && v in this.display)
                        v = this.options[this.display[v]].dataset.value;
                    if (this.settings.strict && !(v in this.values))
                        v = this.default;
                    i = this.source.indexOf(v);
                    if (-1 === i) {
                        update = true;
                        if (-1 === v || '' === v) {
                            this.source = [];
                        }
                        else {
                            if (this.settings.multi) {
                                this.source.push(v);
                            }
                            else
                                this.source[0] = v;
                        }
                        if (v in this.values) {
                            if (!this.settings.multi) {
                                var selected = this.listbox.querySelector('.selected');
                                if (selected) {
                                    selected.classList.remove('selected');
                                    selected.setAttribute('aria-selected', 'false');
                                }
                            }
                            this.set_selected(v);
                        }
                    }
                    else if (toggle) {
                        update = true;
                        this.source.splice(i, 1);
                        if (v in this.values) {
                            var selection = this.options[this.values[v]];
                            selection.classList.remove('selected');
                            selection.setAttribute('aria-selected', 'false');
                        }
                    }
                }
                if (!this.settings.multi && this.expanded) {
                    this.input_element.focus();
                    this.close();
                    this.filter_reset();
                }
                var display = this.source.length
                    ? this.settings.multi
                        ? this.source.length + ' of ' + this.options.length + ' selected'
                        : this.source[0] in this.values
                            ? this.options[this.values[this.source[0]]].firstChild.textContent
                            : this.settings.strict || -1 === this.source[0]
                                ? ''
                                : this.source[0] + ''
                    : '';
                if (this.settings.use_display) {
                    this.selection.innerText = display;
                }
                else {
                    this.input_element.value = display;
                }
                if (this.onchange)
                    this.onchange();
                if (update)
                    this.site.request_queue(false, this.id);
            };
            _this.add = function (value, display, noadd, meta) {
                var e = document.createElement('div');
                e.id = this.id + '_' + value;
                e.role = 'option';
                e.setAttribute('aria-selected', 'false');
                e.tabIndex = 0;
                e.className = 'combobox-option combobox-component';
                e.dataset.value = value;
                e.innerText = display || this.site.data.format_label(value);
                if (meta && meta.info) {
                    e.appendChild(document.createElement('p'));
                    e.lastElementChild.className = 'combobox-option-description combobox-component';
                    e.lastElementChild.innerText = meta.info.description || meta.info.short_description || '';
                }
                if (!noadd)
                    this.listbox.appendChild(e);
                return e;
            };
            return _this;
        }
        Combobox.prototype.filterer = function () {
            var _this = this;
            var q = this.input_element.value.toLowerCase();
            if ('' === q) {
                this.filter_reset();
            }
            else {
                this.filter_index = [];
                if (this.groups) {
                    this.groups.e.forEach(function (g) { return g.firstElementChild.firstElementChild.classList.add('hidden'); });
                }
                this.options.forEach(function (o, i) {
                    if (!o.classList.contains('hidden') && o.innerText.toLowerCase().includes(q)) {
                        o.classList.remove('filter-hidden');
                        _this.filter_index.push(i);
                        var group = o.getAttribute('data-group');
                        if (group) {
                            _this.groups.by_name[group].firstElementChild.firstElementChild.classList.remove('hidden');
                            if (_this.settings.accordion) {
                                var g = _this.groups.by_name[group];
                                g.firstElementChild.nextElementSibling.classList.add('show');
                                g.firstElementChild.firstElementChild.classList.remove('collapsed');
                                g.firstElementChild.firstElementChild.setAttribute('aria-expanded', 'true');
                            }
                        }
                    }
                    else {
                        o.classList.add('filter-hidden');
                    }
                });
            }
        };
        Combobox.prototype.highlight = function (e, target) {
            if (e && !target)
                target = e.target;
            if (!target || target.dataset.value in this.values) {
                if (!this.groups)
                    this.settings.accordion = false;
                if (target && target.dataset.value) {
                    this.hover_index = this.values[target.dataset.value];
                }
                else if (-1 === this.hover_index && Array.isArray(this.source)) {
                    this.hover_index = this.values[this.source[0]];
                }
                if ('undefined' === typeof this.hover_index)
                    this.hover_index = -1;
                var o = this.options[this.hover_index];
                if (o) {
                    var previous = this.listbox.querySelector('.highlighted');
                    if (previous)
                        previous.classList.remove('highlighted');
                    if (e && 'mouseover' === e.type) {
                        target.classList.add('highlighted');
                    }
                    else {
                        o.classList.add('highlighted');
                        if (this.settings.accordion) {
                            var c = o.parentElement.parentElement;
                            if (!c.classList.contains('show')) {
                                c.classList.add('show');
                                c.previousElementSibling.firstElementChild.classList.remove('collapsed');
                                c.previousElementSibling.firstElementChild.setAttribute('aria-expanded', 'true');
                            }
                        }
                        this.input_element.setAttribute('aria-activedescendant', o.id);
                        var port = this.container.getBoundingClientRect(), item = o.getBoundingClientRect();
                        var top_1 = port.top;
                        if (this.groups && o.getAttribute('data-group'))
                            top_1 += this.groups.by_name[o.getAttribute('data-group')].firstElementChild.getBoundingClientRect().height;
                        if (top_1 > item.top) {
                            this.container.scrollTo(0, this.container.scrollTop + item.top - top_1);
                        }
                        else if (port.bottom < item.bottom) {
                            this.container.scrollTo(0, this.container.scrollTop + item.bottom - port.bottom);
                        }
                    }
                }
            }
        };
        Combobox.prototype.toggle = function (e, target) {
            var _this = this;
            if (e && !target)
                target = e.target;
            if (target && !e.button && !this.e.classList.contains('disabled') && 'BUTTON' !== target.tagName) {
                if (this.expanded) {
                    if (target !== this.input_element)
                        this.close();
                }
                else {
                    if (this.site.spec.combobox)
                        Object.keys(this.site.spec.combobox).forEach(function (id) {
                            if (id !== _this.id) {
                                var ou = _this.site.inputs[id];
                                ou.expanded && ou.close();
                            }
                        });
                    this.container.classList.remove('hidden');
                    if ('' !== this.selection.innerText)
                        this.cleared_selection = this.selection.innerText;
                    if (this.cleared_selection in this.display)
                        this.highlight(void 0, this.options[this.display[this.cleared_selection]]);
                    if (this.settings.use_display)
                        this.selection.innerText = '';
                    window.addEventListener('click', this.close);
                    this.e.setAttribute('aria-expanded', 'true');
                    if (!e || e.target !== this.input_element)
                        setTimeout(function () { return _this.input_element.focus(); }, 0);
                    this.resize();
                    this.expanded = true;
                }
            }
        };
        Combobox.prototype.value = function () {
            return this.source
                ? this.settings.multi
                    ? this.source
                    : Array.isArray(this.source) && this.source.length
                        ? this.source[0]
                        : ''
                : this.site.valueOf(this.default);
        };
        Combobox.prototype.close = function (e) {
            if (this.expanded &&
                (!e ||
                    !e.target.classList ||
                    !e.target.classList.contains('combobox-component'))) {
                if (this.settings.use_display &&
                    '' === this.selection.innerText &&
                    Array.isArray(this.source) &&
                    this.source.length)
                    this.selection.innerText = this.cleared_selection;
                if ('' !== this.input_element.value)
                    setTimeout(this.set, 0);
                this.e.setAttribute('aria-expanded', 'false');
                this.expanded = false;
                this.container.classList.add('hidden');
                window.removeEventListener('click', this.close);
            }
        };
        Combobox.prototype.resize = function () {
            var s = this.e.getBoundingClientRect();
            this.container.style.left = s.x + 'px';
            this.container.style.width = s.width + 'px';
            if (window.screen.height / 2 > s.y) {
                this.container.style.top = s.y + s.height + 'px';
                this.container.style.bottom = '';
            }
            else {
                this.container.style.top = '';
                this.container.style.bottom = -s.y + 'px';
            }
        };
        Combobox.prototype.clear_highlight = function () {
            if (-1 !== this.hover_index) {
                this.options[this.hover_index].classList.remove('highlighted');
                this.hover_index = -1;
            }
        };
        Combobox.prototype.filter_reset = function () {
            var _this = this;
            if (this.groups)
                this.groups.e.forEach(function (g) { return g.firstElementChild.firstElementChild.classList.remove('hidden'); });
            this.input_element.value = '';
            this.filter_index = [];
            this.options.forEach(function (o, i) {
                if (!o.classList.contains('hidden'))
                    _this.filter_index.push(i);
            });
            this.listbox.querySelectorAll('.filter-hidden').forEach(function (o) { return o.classList.remove('filter-hidden'); });
        };
        Combobox.prototype.set_selected = function (value) {
            if (value in this.values) {
                var option = this.options[this.values[value]];
                option.classList.add('selected');
                option.setAttribute('aria-selected', 'true');
            }
        };
        Combobox.prototype.create = function (label, options, settings, id) {
            var _this = this;
            id = id || 'created_combobox_' + ++this.site.page.elementCount;
            var main = document.createElement('div');
            var e = document.createElement('div'), div = document.createElement('div'), input = document.createElement('input'), button = document.createElement('button'), lab = document.createElement('label');
            if (settings) {
                if (!this.site.spec.combobox)
                    this.site.spec.combobox = {};
                this.site.spec.combobox[id] = settings;
            }
            e.className = 'wrapper combobox-wrapper';
            if (settings && settings.floating) {
                e.appendChild(div);
                div.className = 'form-floating';
                div.dataset.of = id;
                e = div;
            }
            e.appendChild(main);
            main.id = id;
            main.setAttribute('data-autoType', 'combobox');
            main.className = 'auto-input form-select combobox combobox-component';
            main.role = 'combobox';
            main.appendChild((div = document.createElement('div')));
            div.className = 'combobox-selection combobox-component';
            div.appendChild(document.createElement('span'));
            div.lastElementChild.className = 'combobox-component';
            div.lastElementChild.setAttribute('aria-live', 'assertive');
            div.lastElementChild.setAttribute('aria-atomic', 'true');
            div.lastElementChild.setAttribute('aria-role', 'log');
            div.appendChild(input);
            input.setAttribute('aria-haspopup', 'listbox');
            input.setAttribute('aria-expanded', 'false');
            input.setAttribute('aria-controls', id + '-listbox');
            input.className = 'combobox-input combobox-component';
            input.type = 'text';
            input.role = 'combobox';
            input.id = id + '-input';
            input.autocomplete = 'off';
            if (settings && settings.clearable) {
                e.firstElementChild.appendChild(button);
                button.type = 'button';
                button.className = 'btn-close';
                button.title = 'clear selection';
            }
            e.appendChild((div = document.createElement('div')));
            div.className = 'combobox-options combobox-component';
            div.setAttribute('aria-labelledby', id + '-label');
            div.role = 'listbox';
            div.tabIndex = -1;
            div.id = id + '-listbox';
            e.appendChild(lab);
            lab.id = id + '-label';
            lab.innerText = label;
            lab.setAttribute('for', id + '-input');
            var u = new Combobox(main, this.site);
            this.site.inputs[id] = u;
            var n = 0;
            var opts = [];
            u.options = opts;
            if (options)
                if (Array.isArray(options)) {
                    options.forEach(function (o) {
                        var l = _this.site.data.format_label(o);
                        u.display[l] = n;
                        u.values[o] = n++;
                        opts.push(u.add(o, l));
                    });
                }
                else {
                    u.groups = { e: [], by_name: {} };
                    Object.keys(options).forEach(function (k) {
                        var g = options[k];
                        var e = document.createElement('div'), id = u.id + '_group_' + k.replace(patterns.seps, '-');
                        e.className = 'combobox-group combobox-component';
                        e.setAttribute('aria-labelledby', id);
                        e.appendChild((lab = document.createElement('label')));
                        lab.innerText = k;
                        lab.id = id;
                        lab.className = 'combobox-group-label combobox-component';
                        u.groups.by_name[k] = e;
                        u.groups.e.push(e);
                        g.forEach(function (o) { return u.groups.by_name[k].appendChild(u.add(o, o, true)); });
                        u.listbox.appendChild(e);
                    });
                    Object.keys(u.groups.by_name).forEach(function (g) {
                        u.groups.by_name[g].querySelectorAll('.combobox-option').forEach(function (c) {
                            u.options.push(c);
                            c.setAttribute('data-group', g);
                            u.values[c.dataset.value] = n;
                            u.display[c.innerText] = n++;
                        });
                    });
                }
            return u;
        };
        Combobox.prototype.retrieve = function () {
            var s = [];
            this.listbox.querySelectorAll('.selected').forEach(function (o) { return s.push(o.dataset.value); });
            this.source = s;
            this.site.request_queue(false, this.id);
        };
        return Combobox;
    }(BaseInput));

    var elements = {
        combobox: Combobox,
        select: Combobox,
    };
    var BaseInput = /** @class */ (function () {
        function BaseInput(e, site) {
            this.current_index = -1;
            this.previous = '';
            this.settings = {};
            this.input = true;
            this.site = site;
            this.e = e;
            this.type = e.dataset.autoType;
            this.default = e.dataset.default;
            this.optionSource = e.dataset.optionSource;
            this.depends = e.dataset.depends;
            this.variable = e.dataset.variable;
            this.dataset = e.dataset.dataset;
            this.view = e.dataset.view;
            this.id = e.id || this.optionSource || 'ui' + site.page.elementCount++;
            this.note = e.getAttribute('aria-description') || '';
            if (this.type in site.spec && this.id in site.spec[this.type])
                this.settings = site.spec[this.type][this.id];
        }
        BaseInput.prototype.value = function () {
            if (Array.isArray(this.source))
                return this.source;
            var v = this.site.valueOf(this.source);
            return 'undefined' === typeof v ? this.site.valueOf(this.default) : v;
        };
        BaseInput.prototype.toggle = function () { };
        return BaseInput;
    }());

    function init() {
        var _this = this;
        if (this.data.variables) {
            var variable = Object.keys(this.data.variables);
            this.defaults.variable = variable[variable.length - 1];
        }
        if (!this.spec.map)
            this.spec.map = {};
        if (!this.spec.map._overlay_property_selectors)
            this.spec.map._overlay_property_selectors = [];
        // initialize inputs
        this.registered_elements.forEach(function (o, k) { return __awaiter(_this, void 0, void 0, function () {
            var combobox, v_1, new_display_1, select_1, d, v;
            var _this = this;
            return __generator(this, function (_a) {
                if (o.type in elements) {
                    combobox = 'combobox' === o.type;
                    if (o.optionSource) {
                        if (this.patterns.palette.test(o.optionSource)) {
                            o.options = [];
                            Object.keys(this.palettes).forEach(function (v) { return o.options.push(o.add(v, _this.palettes[v].name)); });
                            if (-1 === o.default)
                                o.default = this.defaults.palette;
                        }
                        else if (this.patterns.datasets.test(o.optionSource)) {
                            if (-1 === o.default)
                                o.default = this.defaults.dataset;
                            o.options = [];
                            this.spec.metadata.datasets.forEach(function (d) { return o.options.push(o.add(d)); });
                        }
                        else {
                            o.sensitive = false;
                            o.option_sets = {};
                            if (this.patterns.properties.test(o.optionSource)) {
                                this.spec.map._overlay_property_selectors.push(o);
                            }
                            if (o.depends)
                                this.add_dependency(o.depends, { type: 'options', id: o.id });
                            if (o.dataset in this.registered_elements)
                                this.add_dependency(o.dataset, { type: 'options', id: o.id });
                            if (o.view)
                                this.add_dependency(o.view, { type: 'options', id: o.id });
                            v_1 = this.valueOf(o.dataset) || this.defaults.dataset;
                            if ('string' === typeof v_1) {
                                if (!o.dataset)
                                    o.dataset = v_1;
                                if (v_1 in this.data.info)
                                    this.conditionals.options(o);
                            }
                        }
                    }
                    if (combobox || 'select' === o.type) {
                        // resolve options
                        o.set_current = this.conditionals.set_current.bind(o);
                        if (Array.isArray(o.values)) {
                            o.values = {};
                            o.display = {};
                            new_display_1 = true;
                            select_1 = 'select' === o.type;
                            o.options.forEach(function (e) {
                                if (select_1)
                                    e.dataset.value = e.value;
                                if (new_display_1)
                                    new_display_1 = e.dataset.value === e.innerText;
                            });
                            o.options.forEach(function (e, i) {
                                o.values[e.dataset.value] = i;
                                if (new_display_1)
                                    e.innerText = _this.data.format_label(e.dataset.value);
                                o.display[e.innerText] = i;
                            });
                            if (!(o.default in o.values) && !(o.default in _u)) {
                                o.default = Number(o.default);
                                if (isNaN(o.default))
                                    o.default = -1;
                                if (-1 !== o.default && o.default < o.options.length) {
                                    o.default = o.options[o.default].dataset.value;
                                }
                                else {
                                    o.default = -1;
                                }
                            }
                            o.source = '';
                            o.id in this.spec.url_options ? o.set(this.spec.url_options[o.id]) : o.reset();
                        }
                        o.subset = o.e.getAttribute('data-subset') || 'all';
                        o.selection_subset = o.e.getAttribute('data-selectionSubset') || o.subset;
                        if (o.type in site && o.id in site[o.type]) {
                            o.settings = site[o.type][o.id];
                            if (o.settings.filters) {
                                o.filters = o.settings.filters;
                                o.current_filter = {};
                                Object.keys(o.filters).forEach(function (f) {
                                    _this.add_dependency(o.filters[f], { type: 'filter', id: o.id });
                                });
                                o.filter = function () {
                                    var _this = this;
                                    Object.keys(this.filters).forEach(function (f) {
                                        _this.current_filter[f] = _this.valueOf(_this.filters[f]);
                                    });
                                    var first;
                                    Object.keys(this.values).forEach(function (v, i) {
                                        var pass = false;
                                        if (v in _this.data.variables && 'meta' in _this.data.variables[v]) {
                                            for (var k_1 in _this.current_filter)
                                                if (k_1 in _this.data.variables[v].meta) {
                                                    pass = _this.data.variables[v].meta[k_1] === _this.current_filter[k_1];
                                                    if (!pass)
                                                        break;
                                                }
                                        }
                                        if (pass && !first)
                                            first = v;
                                        _this.options[i].classList[pass ? 'remove' : 'add']('hidden');
                                    });
                                    this.current_index = this.values[this.value()];
                                    if (first &&
                                        (-1 === this.current_index || this.options[this.current_index].classList.contains('hidden'))) {
                                        this.set(first);
                                    }
                                }.bind(o);
                            }
                        }
                    }
                    else if ('number' === o.type) {
                        // retrieve option values
                        o.min = o.e.getAttribute('min');
                        o.min_ref = parseFloat(o.min);
                        o.min_indicator = o.e.parentElement.parentElement.querySelector('.indicator-min');
                        if (o.min_indicator) {
                            o.min_indicator.addEventListener('click', function () {
                                this.set(this.parsed.min);
                            }.bind(o));
                        }
                        o.max = o.e.getAttribute('max');
                        o.max_ref = parseFloat(o.max);
                        o.max_indicator = o.e.parentElement.parentElement.querySelector('.indicator-max');
                        if (o.max_indicator) {
                            o.max_indicator.addEventListener('click', function () {
                                this.set(this.parsed.max);
                            }.bind(o));
                        }
                        o.ref = isNaN(o.min_ref) || isNaN(o.max_ref);
                        o.range = [o.min_ref, o.max_ref];
                        o.step = parseFloat(o.e.step) || 1;
                        o.parsed = { min: undefined, max: undefined };
                        o.depends = {};
                        o.default_max = 'max' === o.default || 'last' === o.default;
                        o.default_min = 'min' === o.default || 'first' === o.default;
                        o.update = function () {
                            return __awaiter(this, void 0, void 0, function () {
                                var view, variable, d, min, max, _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            view = _u[this.view], variable = this.valueOf(this.variable || view.y);
                                            if (!view.time_range)
                                                view.time_range = { time: [] };
                                            d = view.get ? view.get.dataset() : this.valueOf(this.dataset), min = this.valueOf(this.min) || view.time, max = this.valueOf(this.max) || view.time;
                                            if (this.patterns.minmax.test(min))
                                                min = _u[this.min][min];
                                            if (this.patterns.minmax.test(max))
                                                max = _u[this.max][max];
                                            this.parsed.min = isNaN(this.min_ref)
                                                ? 'undefined' === typeof min
                                                    ? view.time_range.time[0]
                                                    : 'number' === typeof min
                                                        ? min
                                                        : min in this.data.variables
                                                            ? this.data.variables[min].info[d || this.data.variables[min].datasets[0]].min
                                                            : parseFloat(min)
                                                : this.min_ref;
                                            this.parsed.max = isNaN(this.max_ref)
                                                ? 'undefined' === typeof max
                                                    ? view.time_range.time[1]
                                                    : 'number' === typeof max
                                                        ? max
                                                        : max in this.data.variables
                                                            ? this.data.variables[max].info[d || this.data.variables[max].datasets[0]].max
                                                            : parseFloat(max)
                                                : this.min_ref;
                                            if (this.default_min) {
                                                this.current_default = this.parsed.min;
                                            }
                                            else if (this.default_max) {
                                                this.current_default = this.parsed.max;
                                            }
                                            if (!(this.ref && variable in this.data.variables)) return [3 /*break*/, 2];
                                            this.range[0] = this.e.min = isNaN(this.min_ref)
                                                ? Math.max(view.time_range.time[0], this.parsed.min)
                                                : this.min_ref;
                                            this.range[1] = this.e.max = isNaN(this.max_ref)
                                                ? Math.min(view.time_range.time[1], this.parsed.max)
                                                : this.max_ref;
                                            if (!this.depends[view.y]) {
                                                this.depends[view.y] = true;
                                                this.add_dependency(view.y, { type: 'update', id: this.id });
                                            }
                                            if (this.source > this.parsed.max || this.source < this.parsed.min)
                                                this.reset();
                                            _a = this;
                                            return [4 /*yield*/, this.data.get_variable(variable, this.view)];
                                        case 1:
                                            _a.variable = _b.sent();
                                            return [3 /*break*/, 3];
                                        case 2:
                                            this.e.min = this.parsed.min;
                                            if (this.parsed.min > this.source || (!this.source && this.default_min))
                                                this.set(this.parsed.min);
                                            this.e.max = this.parsed.max;
                                            if (this.parsed.max < this.source || (!this.source && this.default_max))
                                                this.set(this.parsed.max);
                                            _b.label = 3;
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            });
                        }.bind(o);
                        if (o.view)
                            this.add_dependency(o.view, { type: 'update', id: o.id });
                        if (!(o.max in this.data.variables)) {
                            if (o.max in _u) {
                                this.add_dependency(o.max, { type: 'max', id: o.id });
                            }
                            else
                                o.e.max = parseFloat(o.max);
                        }
                        else if (o.view) {
                            this.add_dependency(o.view + '_time', { type: 'max', id: o.id });
                        }
                        if (!(o.min in this.data.variables)) {
                            if (o.min in _u) {
                                this.add_dependency(o.min, { type: 'min', id: o.id });
                            }
                            else
                                o.e.min = parseFloat(o.min);
                        }
                        else if (o.view) {
                            this.add_dependency(o.view + '_time', { type: 'min', id: o.id });
                        }
                        if ('undefined' !== typeof o.default) {
                            if (this.patterns.number.test(o.default)) {
                                o.default = Number(o.default);
                            }
                            else
                                o.reset = o.default_max
                                    ? function () {
                                        if (this.range) {
                                            this.current_default = this.valueOf(this.range[1]);
                                            this.set(this.current_default);
                                        }
                                    }.bind(o)
                                    : o.default_max
                                        ? function () {
                                            if (this.range) {
                                                this.current_default = this.valueOf(this.range[0]);
                                                this.set(this.current_default);
                                            }
                                        }.bind(o)
                                        : this.default in _u
                                            ? function () {
                                                this.current_default = this.valueOf(this.default);
                                                this.set(this.current_default);
                                            }.bind(o)
                                            : function () { };
                        }
                        if (o.variable) {
                            d = -1 === this.spec.metadata.datasets.indexOf(o.dataset) ? this.defaults.dataset : o.dataset;
                            if (o.variable in _u) {
                                this.add_dependency(o.variable, { type: 'update', id: o.id });
                            }
                            else if (o.variable in this.data.variables) {
                                o.e.min = o.min = o.parsed.min = o.range[0] = this.data.variables[o.variable].info[d].min;
                                o.e.max = o.max = o.parsed.max = o.range[1] = this.data.variables[o.variable].info[d].max;
                            }
                        }
                    }
                    else if ('checkbox' === o.type) {
                        o.source = [];
                        o.current_index = [];
                        o.default = o.default.split(',');
                    }
                    if (Array.isArray(o.values)) {
                        if (!o.values.length) {
                            o.values = [];
                            if (o.options.length)
                                o.options.forEach(function (e) { return o.values.push(e.value || e.dataset.value); });
                        }
                        if (o.values.length && !(o.default in _u) && -1 === o.values.indexOf(o.default)) {
                            o.default = parseInt(o.default);
                            o.default = o.values.length > o.default ? o.values[o.default] : '';
                        }
                    }
                    // add listeners
                    if (combobox || 'select' === o.type || 'number' === o.type || 'intext' === o.type) {
                        o.e.addEventListener('change', o.listen);
                        if (o.e.parentElement.lastElementChild &&
                            o.e.parentElement.lastElementChild.classList.contains('select-reset')) {
                            o.e.parentElement.lastElementChild.addEventListener('click', o.reset);
                        }
                    }
                    else if ('switch' === o.type) {
                        if ('boolean' !== typeof o.default)
                            o.default = o.e.checked;
                        o.e.addEventListener('change', o.listen);
                    }
                    else if (o.listen) {
                        o.options.forEach(function (oi) { return oi.addEventListener('click', o.listen); });
                    }
                    // initialize settings inputs
                    if (this.patterns.settings.test(o.id)) {
                        o.setting = o.id.replace(this.patterns.settings, '');
                        if (null == o.default && o.setting in this.spec.settings)
                            o.default = this.spec.settings[o.setting];
                        this.add_dependency(o.id, { type: 'setting', id: o.id });
                    }
                    if (!o.view)
                        o.view = this.defaults.dataview;
                    v = this.spec.url_options[o.id] || storage.get(o.id.replace(this.patterns.settings, ''));
                    if (v) {
                        o.set(this.patterns.bool.test(v) ? !!v || 'true' === v : v);
                    }
                    else
                        o.reset && o.reset();
                }
                return [2 /*return*/];
            });
        }); });
        // initialize dataviews
        Object.keys(this.spec.dataviews).forEach(function (k) {
            var e = _this.spec.dataviews[k];
            _u[k] = e;
            e.id = k;
            e.value = function () {
                if (this.get) {
                    this.reparse();
                    return ('' +
                        this.parsed.dataset +
                        _u._entity_filter.entities.size +
                        this.data.inited[this.parsed.dataset] +
                        this.parsed.id_source +
                        Object.keys(this.parsed.ids) +
                        this.parsed.features +
                        this.parsed.variables +
                        this.spec.settings.summary_selection);
                }
            }.bind(e);
            if ('string' === typeof e.palette && e.palette in _u) {
                _this.add_dependency(e.palette, { type: 'dataview', id: k });
            }
            if ('string' === typeof e.dataset && e.dataset in _u) {
                _this.add_dependency(e.dataset, { type: 'dataview', id: k });
            }
            if ('string' === typeof e.ids && e.ids in _u) {
                _this.add_dependency(e.ids, { type: 'dataview', id: k });
            }
            e.time_range = { dataset: '', variable: '', index: [], time: [], filtered: [] };
            _this.add_dependency(k, { type: 'time_range', id: k });
            _this.add_dependency('_base_filter', { type: 'dataview', id: k });
            _this.add_dependency('_entity_filter', { type: 'dataview', id: k });
            if (e.x in _u)
                _this.add_dependency(e.x, { type: 'time_range', id: k });
            if (e.y in _u)
                _this.add_dependency(e.y, { type: 'time_range', id: k });
            if (e.features)
                Object.keys(e.features).forEach(function (f) {
                    if ('string' === typeof e.features[f] && e.features[f] in _u) {
                        _this.add_dependency(e.features[f], { type: 'dataview', id: k });
                    }
                });
            if (e.variables)
                e.variables.forEach(function (v) {
                    if ('variable' in v) {
                        if (v.variable in _u) {
                            _this.add_dependency(v.variable, { type: 'dataview', id: k });
                        }
                    }
                    else
                        e.variables.splice(i, 1);
                    if ('type' in v) {
                        if (v.type in _u) {
                            _this.add_dependency(v.type, { type: 'dataview', id: k });
                        }
                    }
                    else
                        v.type = '=';
                    if ('value' in v) {
                        if (v.value in _u) {
                            _this.add_dependency(v.value, { type: 'dataview', id: k });
                        }
                    }
                    else
                        v.value = 0;
                });
            compile_dataview(e);
            _this.conditionals.dataview(e);
            e.reparse();
        });
        // initialize outputs
        document.querySelectorAll('.auto-output').forEach(elements.init_output);
        // make filter popup
        e = page.modal.filter;
        e.body.className = 'filter-dialog';
        // // entity filter
        e.body.appendChild((e.entity_filters = document.createElement('div')));
        e.entity_filters.appendChild(document.createElement('p'));
        e.entity_filters.lastElementChild.className = 'h6';
        e.entity_filters.lastElementChild.innerText = 'Select Entities';
        e.entity_filters.lastElementChild.appendChild(document.createElement('span'));
        e.entity_filters.lastElementChild.lastElementChild.className = 'note';
        e.entity_filters.lastElementChild.lastElementChild.innerText = '(click disabled selectors to load)';
        e.entity_filters.appendChild(document.createElement('div'));
        e.entity_filters.lastElementChild.className = 'row';
        e.entity_inputs = {};
        Object.keys(this.data.loaded)
            .reverse()
            .forEach(function (d) {
            var u = elements.combobox.create(d, void 0, { search: true, multi: true, clearable: true }, 'filter.' + d);
            e.entity_inputs[d] = u;
            e.entity_filters.lastElementChild.appendChild(document.createElement('div'));
            e.entity_filters.lastElementChild.lastElementChild.className = 'col-sm';
            e.entity_filters.lastElementChild.lastElementChild.appendChild(u.e.parentElement);
            u.e.parentElement.classList.add('form-floating');
            u.listbox.classList.add('multi');
            u.option_sets = {};
            u.dataset = d;
            u.loader = function () {
                this.data.retrieve(this.dataset, this.data.info[this.dataset].site_file);
                this.e.removeEventListener('click', this.loader);
            }.bind(u);
            if (!_this.data.loaded[d]) {
                u.e.addEventListener('click', u.loader);
            }
            u.onchange = function () {
                this.conditionals.id_filter();
                request_queue('_entity_filter');
            }.bind(u);
            u.set_current = _this.conditionals.set_current.bind(u);
            fill_ids_options(u, d, u.option_sets, function () {
                var _this = this;
                this.set_current();
                toggle_input(this, !!this.options.length);
                Object.keys(this.values).forEach(function (id) {
                    _u._entity_filter.entities.set(id, _this.data.entities[id]);
                });
                _u._entity_filter.registered[d] = true;
                this.set(this.id in this.spec.url_options ? this.spec.url_options[this.id].split(',') : -1);
            }.bind(u));
            toggle_input(u, !!u.options.length);
        });
        // // variable filter
        e.body.appendChild((e.variable_filters = document.createElement('div')));
        e.variable_filters.appendChild(document.createElement('p'));
        e.variable_filters.lastElementChild.className = 'h6';
        e.variable_filters.lastElementChild.innerText = 'Variable Conditions';
        function add_filter_condition(variable, presets) {
            presets = presets || {};
            var e = document.createElement('tr'), f = {
                e: e,
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
            }, d = f.view.get.dataset(), range = f.info[d].time_range, times = this.data.meta.overall.value;
            _u._base_filter.c.set(f.id, f);
            if (presets.time_component)
                f.component = String(times[f.component]);
            var ee;
            // variable name
            e.appendChild(document.createElement('td'));
            e.lastElementChild.appendChild((ee = document.createElement('p')));
            ee.id = f.id;
            ee.className = 'cell-text';
            ee.innerText = f.info[d].info.short_name;
            e.lastElementChild.appendChild(document.createElement('p'));
            f.summary = {
                f: f,
                update: function () {
                    var d = this.f.view.get.dataset(), range = this.f.info[d].time_range, times = this.data.meta.overall.value;
                    if (d !== this.add.Dataset) {
                        this.add.Dataset = d;
                        this.add.First = times[range[0]] || 'NA';
                        this.add.Last = times[range[1]] || 'NA';
                        var s = this.f.info[d];
                        for (var i = this.table.firstElementChild.childElementCount; i--;) {
                            var h = this.table.firstElementChild.children[i].innerText, n = h.toLowerCase();
                            this.table.lastElementChild.children[i].innerText = n in s ? this.data.format_value(s[n]) : this.add[h];
                        }
                    }
                },
                add: {
                    Dataset: d,
                    First: times[range[0]] || 'NA',
                    Last: times[range[1]] || 'NA',
                },
            };
            f.summary.table = make_summary_table(e.lastElementChild.lastElementChild, f.info[d], f.summary.add);
            // filter result
            e.appendChild(document.createElement('td'));
            e.lastElementChild.appendChild((ee = document.createElement('p')));
            ee.setAttribute('aria-describedby', f.id);
            ee.className = 'cell-text';
            ee.innerText = '0/0';
            // active switch
            e.appendChild(document.createElement('td'));
            e.lastElementChild.appendChild((ee = document.createElement('label')));
            ee.innerText = 'Active';
            ee.className = 'filter-label';
            ee.id = f.id + '_switch';
            e.lastElementChild.appendChild((ee = document.createElement('div')));
            ee.className = 'form-check form-switch filter-form-input';
            ee.appendChild((ee = document.createElement('input')));
            ee.className = 'form-check-input';
            ee.type = 'checkbox';
            ee.role = 'switch';
            ee.setAttribute('aria-labelledby', f.id + '_switch');
            ee.setAttribute('aria-describedby', f.id);
            ee.checked = true;
            ee.addEventListener('change', function () {
                f.active = !f.active;
                request_queue('_base_filter');
            }.bind(f));
            // component combobox
            e.appendChild(document.createElement('td'));
            e.lastElementChild.appendChild((ee = document.createElement('label')));
            ee.innerText = 'Component';
            ee.className = 'filter-label';
            ee.id = f.id + '_component';
            var comp_select = elements.combobox.create('component', filter_components.Time);
            comp_select.default = f.component;
            comp_select.set(f.component);
            e.lastElementChild.appendChild(comp_select.e.parentElement);
            comp_select.e.parentElement.removeChild(comp_select.e.parentElement.lastElementChild);
            comp_select.e.parentElement.classList.add('filter-form-input');
            comp_select.e.setAttribute('aria-labelledby', f.id + '_component');
            comp_select.input_element.setAttribute('aria-labelledby', f.id + '_component');
            comp_select.input_element.setAttribute('aria-describedby', f.id);
            comp_select.listbox.setAttribute('aria-labelledby', f.id + '_component');
            comp_select.onchange = function () {
                f.component = this.value();
                request_queue('_base_filter');
            }.bind(comp_select);
            // operator select
            e.appendChild(document.createElement('td'));
            e.lastElementChild.appendChild((ee = document.createElement('label')));
            ee.innerText = 'Operator';
            ee.className = 'filter-label';
            ee.id = f.id + '_operator';
            e.lastElementChild.appendChild((ee = document.createElement('select')));
            ee.className = 'form-select filter-form-input';
            ee.setAttribute('aria-labelledby', f.id + '_operator');
            ee.setAttribute('aria-describedby', f.id);
            ee.addEventListener('change', function (e) {
                f.operator = e.target.selectedOptions[0].value;
                request_queue('_base_filter');
            });
            ['>=', '=', '!=', '<='].forEach(function (k) {
                ee.appendChild(document.createElement('option'));
                ee.lastElementChild.value = ee.lastElementChild.innerText = k;
                if (k === f.operator)
                    ee.lastElementChild.selected = true;
            });
            // value input
            e.appendChild(document.createElement('td'));
            e.lastElementChild.appendChild((ee = document.createElement('label')));
            ee.innerText = 'Value';
            ee.className = 'filter-label';
            ee.id = f.id + '_value';
            var value_select = elements.combobox.create('component', ['min', 'q1', 'median', 'mean', 'q3', 'max']);
            value_select.value_type = 'number';
            value_select.default = f.value;
            value_select.set(f.value);
            e.lastElementChild.appendChild(value_select.e.parentElement);
            value_select.e.parentElement.removeChild(value_select.e.parentElement.lastElementChild);
            value_select.e.parentElement.classList.add('filter-form-input');
            value_select.e.setAttribute('aria-labelledby', f.id + '_value');
            value_select.input_element.setAttribute('aria-labelledby', f.id + '_value');
            value_select.input_element.setAttribute('aria-describedby', f.id);
            value_select.listbox.setAttribute('aria-labelledby', f.id + '_value');
            value_select.onchange = function (f) {
                return __awaiter(this, void 0, void 0, function () {
                    var v, s, a;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                f.value = this.value();
                                if (!this.patterns.number.test(f.value)) return [3 /*break*/, 1];
                                f.value = Number(f.value);
                                f.value_source = '';
                                return [3 /*break*/, 3];
                            case 1:
                                f.view.reparse();
                                return [4 /*yield*/, this.data.get_variable(f.variable, f.view.id)];
                            case 2:
                                v = _a.sent(), s = v && v.views[f.view.id].summaries[f.view.parsed.dataset];
                                if (s && f.value in s) {
                                    a = f.view.parsed.variable_values.get(f.id);
                                    f.value_source = f.value;
                                    f.value = s[f.value][a.comp_fun(a, f.view.parsed)];
                                }
                                _a.label = 3;
                            case 3:
                                request_queue('_base_filter');
                                return [2 /*return*/];
                        }
                    });
                });
            }.bind(value_select, f);
            // remove button
            e.appendChild(document.createElement('td'));
            e.lastElementChild.appendChild((ee = document.createElement('label')));
            ee.innerText = 'Remove';
            ee.className = 'filter-label';
            ee.id = f.id + '_remove';
            e.lastElementChild.appendChild((ee = document.createElement('button')));
            ee.className = 'btn-close filter-form-input';
            ee.type = 'button';
            ee.setAttribute('aria-labelledby', f.id + '_remove');
            ee.setAttribute('aria-describedby', f.id);
            ee.addEventListener('mouseup', function (e) {
                if (1 === e.which) {
                    this.e.parentElement.removeChild(this.e);
                    _u._base_filter.c.delete(this.id);
                    if (!_u._base_filter.c.size)
                        page.modal.filter.variable_filters.lastElementChild.classList.add('hidden');
                    request_queue('_base_filter');
                }
            }.bind(f));
            request_queue('_base_filter');
            page.modal.filter.conditions.lastElementChild.appendChild(e);
            page.modal.filter.variable_filters.lastElementChild.classList.remove('hidden');
        }
        // variable filter dropdown
        e.variable_filters.appendChild((ee = document.createElement('div')));
        ee.className = 'row';
        ee.appendChild(document.createElement('div'));
        ee.lastElementChild.className = 'col';
        ee.lastElementChild.appendChild((c = document.createElement('div')));
        var filter_select = elements.combobox.create('Add Variable Condition', void 0, { strict: true, search: true, clearable: true, floating: true, accordion: true, group: 'category' }, 'filter_variable_dropdown');
        filter_select.input = false;
        filter_select.settings.filter_table = document.querySelector('.filter-body');
        filter_select.onchange = function () {
            var value = this.value();
            if (value in this.data.variables) {
                add_filter_condition(value);
                this.selection.innerText = '';
                var input = document.querySelectorAll('.filter-body .combobox-input');
                if (input && input.length)
                    input[input.length - 1].focus();
            }
        }.bind(filter_select);
        filter_select.view = this.defaults.dataview;
        filter_select.option_sets = {};
        filter_select.optionSource = 'variables';
        this.add_dependency(this.defaults.dataview, { type: 'options', id: filter_select.id });
        c.appendChild(filter_select.e.parentElement);
        // variable filter table
        e.variable_filters.appendChild((ee = document.createElement('div')));
        ee.className = 'hidden';
        ee.appendChild((e.conditions = ee = document.createElement('table')));
        ee.className = 'table';
        ee.appendChild((ee = document.createElement('thead')));
        ee.className = 'filter-header';
        e.conditions.appendChild(document.createElement('tbody'));
        e.conditions.lastElementChild.className = 'filter-body';
        ee.appendChild((ee = document.createElement('tr')));
        ['Variable', 'Result', 'Active', 'Component', 'Operator', 'Value', 'Remove'].forEach(function (h) {
            ee.appendChild(document.createElement('th'));
            if ('Component' === h || 'Result' === h) {
                var l = 'Component' === h
                    ? {
                        wrapper: document.createElement('label'),
                        id: 'filter_component_header',
                        note: 'Component refers to which single value to filter on for each entity; select a dynamic time reference, or enter a time.',
                    }
                    : {
                        wrapper: document.createElement('label'),
                        id: 'filter_result_header',
                        note: 'Passing / total entities across loaded datasets.',
                    };
                ee.lastElementChild.appendChild(l.wrapper);
                ee.lastElementChild.className = 'has-note';
                l.wrapper.innerText = h;
                l.wrapper.id = l.id;
                l.wrapper.setAttribute('data-of', l.id);
                l.wrapper.setAttribute('aria-description', l.note);
                ee.lastElementChild.addEventListener('mouseover', tooltip_trigger.bind(l));
            }
            else {
                ee.lastElementChild.innerText = h;
            }
        });
        e.variable_filters.lastElementChild.appendChild((ee = document.createElement('p')));
        ee.className = 'note';
        ee.innerText = 'Summaries are across time within each unfiltered dataset.';
        keys._u = Object.keys(_u);
        if (this.spec.query) {
            this.spec.parsed_query = this.data.parse_query(this.spec.query);
            if (this.spec.parsed_query.variables.conditions.length) {
                this.spec.parsed_query.variables.conditions.forEach(function (f) {
                    var info = _this.data.variable_info[f.name];
                    if (info)
                        add_filter_condition(f.name, f);
                });
            }
        }
    }

    var Community = /** @class */ (function () {
        function Community(spec) {
            var _this = this;
            this.storage = storage$1;
            this.patterns = patterns;
            this.palettes = palettes;
            this.conditionals = conditionals;
            this.init = init;
            this.registered_elements = new Map();
            this.defaults = defaults;
            this.dataviews = {};
            this.inputs = {};
            this.dependencies = {};
            this.url_options = {};
            this.queue = { timeout: 0, elements: new Map() };
            this.tree = {};
            this.meta = {
                retain_state: true,
                lock_after: '',
            };
            this.state = '';
            this.spec = spec;
            this.page = {
                load_screen: document.getElementById('load_screen'),
                wrap: document.getElementById('site_wrap'),
                navbar: document.querySelector('.navbar'),
                content: document.querySelector('.content'),
                overlay: document.createElement('div'),
                menus: document.getElementsByClassName('menu-wrapper'),
                panels: document.getElementsByClassName('panel'),
                script_style: document.createElement('style'),
                modal: {
                    info: {
                        init: false,
                        e: document.createElement('div'),
                        header: document.createElement('div'),
                        body: document.createElement('div'),
                        title: document.createElement('div'),
                        description: document.createElement('div'),
                        name: document.createElement('tr'),
                        sources: document.createElement('div'),
                        references: document.createElement('div'),
                        origin: document.createElement('div'),
                        source_file: document.createElement('div'),
                    },
                    filter: {
                        init: false,
                        e: document.createElement('div'),
                        header: document.createElement('div'),
                        conditions: document.createElement('div'),
                        variable_filters: document.createElement('div'),
                        entity_filters: document.createElement('div'),
                        entity_inputs: {},
                    },
                },
                content_bounds: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    outer_right: 0,
                },
                elementCount: 0,
                resize: function (e) {
                    var full = e && 'boolean' === typeof e, f = this[full ? 'wrap' : 'content'];
                    if (!full) {
                        f.style.top =
                            (this.top_menu && 'open' === this.top_menu.dataset.state
                                ? this.top_menu.getBoundingClientRect().height
                                : this.content_bounds.top +
                                    ((!this.top_menu && !this.left_menu && !this.right_menu) ||
                                        (this.right_menu && 'open' === this.right_menu.dataset.state) ||
                                        (this.left_menu && 'open' === this.left_menu.dataset.state)
                                        ? 0
                                        : 40)) + 'px';
                        f.style.bottom =
                            this.content_bounds.bottom +
                                (!this.bottom_menu || 'closed' === this.bottom_menu.dataset.state
                                    ? 0
                                    : this.bottom_menu.getBoundingClientRect().height) +
                                'px';
                        f.style.left =
                            this.content_bounds.left +
                                (!this.left_menu || 'closed' === this.left_menu.dataset.state
                                    ? 0
                                    : this.left_menu.getBoundingClientRect().width) +
                                'px';
                    }
                    f.style.right =
                        this.content_bounds[full ? 'outer_right' : 'right'] +
                            (!this.right_menu || 'closed' === this.right_menu.dataset.state
                                ? 0
                                : this.right_menu.getBoundingClientRect().width) +
                            'px';
                },
            };
            window.onload = function () {
                _this.data = new DataHandler(_this.spec, defaults, _this.data, {
                    init: _this.init,
                    onload: function () {
                        if (this.data.inited)
                            clearTimeout(this.data.inited.load_screen);
                        setTimeout(this.drop_load_screen, 600);
                        delete this.onload;
                    },
                    data_load: function () {
                        Object.keys(this.dependencies).forEach(this.request_queue);
                    }.bind(_this),
                });
                _this.subs = new Subscriptions(_this.inputs);
                _this.view = new GlobalView(_this);
            };
        }
        Community.prototype.global_update = function () {
            this.meta.retain_state = false;
            this.queue.elements.forEach(this.request_queue);
        };
        Community.prototype.request_queue = function (waiting, id) {
            if (!waiting) {
                this.queue.elements.set(id, true);
                if (this.queue.timeout !== 0)
                    clearTimeout(this.queue.timeout);
                this.queue.timeout = setTimeout(this.run_queue, 20);
                this.meta.lock_after = id;
            }
        };
        Community.prototype.run_queue = function () {
            var _this = this;
            if (this.queue.timeout !== 0)
                clearTimeout(this.queue.timeout);
            this.queue.timeout = -1;
            this.queue.elements.forEach(function (_, k) {
                var d = _this.refresh_conditions(k);
                if (d) {
                    if (!(k in _this.data.data_queue[d]))
                        _this.data.data_queue[d][k] = _this.run_queue;
                    return false;
                }
                _this.queue.elements.set(k, false);
            });
            var k = this.get_options_url();
            if (this.data.inited.first && k !== this.state) {
                this.state = k;
                Object.keys(this.url_options).forEach(function (s) {
                    var v = _this.url_options[s];
                    if ('string' === typeof v && patterns.embed_setting.test(s))
                        k += '&' + s + '=' + ('navcolor' === s ? v.replace(patterns.hashes, '%23') : v);
                });
                if (!this.spec.settings.hide_url_parameters) {
                    window.history.replaceState(Date.now(), '', k);
                }
                setTimeout(this.page.resize, 50);
            }
        };
        Community.prototype.refresh_conditions = function (id) {
            var _this = this;
            if (id in this.dependencies) {
                var c_1 = this.inputs[id], d = this.dependencies[id], r_1 = [], v = c_1 && c_1.value() + '';
                if (c_1 && (!this.meta.retain_state || c_1.state !== v)) {
                    var view = this.dataviews[c_1.view], dd = c_1.dataset ? this.valueOf(c_1.dataset) : view ? view.get.dataset() : v;
                    if (this.data.info && dd in this.data.loaded && !this.data.loaded[dd]) {
                        if (!c_1.deferred)
                            this.data.retrieve(dd, this.data.info[dd].site_file);
                        return dd;
                    }
                    c_1.state = v;
                    d.forEach(function (di) {
                        if ('rule' === di.type) {
                            if (-1 === r_1.indexOf(di.rule)) {
                                r_1.push(di.rule);
                            }
                        }
                        else if (di.conditional) {
                            _this.conditionals[di.conditional](_this.inputs[di.id], c_1);
                        }
                        else {
                            var fun = _this.inputs[di.id][di.type];
                            if ('function' === typeof fun) {
                                fun();
                            }
                        }
                    });
                    r_1.forEach(function (i) {
                        var pass = false;
                        var ri = _this.spec.rules[i], n = ri.condition.length;
                        for (var i_1 = 0; i_1 < n; i_1++) {
                            var ck = ri.condition[i_1];
                            pass = ck.check();
                            if (ck.any && pass)
                                break;
                        }
                        Object.keys(ri.effects).forEach(function (k) {
                            if (pass) {
                                if ('display' === k) {
                                    ri.parsed[k].e.classList.remove('hidden');
                                }
                                else if ('lock' === k) {
                                    ri.parsed[k].forEach(function (u) {
                                        u.e.classList.remove('locked');
                                        toggle_input$1(u, true);
                                    });
                                }
                                else if (k in _this.inputs) {
                                    _this.inputs[k].set(_this.valueOf(ri.effects[k]));
                                }
                            }
                            else if ('display' === k) {
                                var e = ri.parsed[k];
                                if (!e.e.classList.contains('hidden')) {
                                    e.e.classList.add('hidden');
                                    if (e.u && e.u.reset)
                                        e.u.reset();
                                    e.e.querySelectorAll('.auto-input').forEach(function (c) {
                                        var input = _this.inputs[c.id];
                                        if (input && input.reset)
                                            input.reset();
                                    });
                                }
                            }
                            else if ('lock' === k) {
                                ri.parsed[k].forEach(function (u) {
                                    u.e.classList.add('locked');
                                    toggle_input$1(u);
                                });
                            }
                            else if ('default' in ri) {
                                if (k in _this.inputs) {
                                    _this.inputs[k].set(_this.valueOf(ri.default));
                                }
                            }
                        });
                    });
                    if (id === this.meta.lock_after)
                        this.meta.retain_state = true;
                }
            }
        };
        Community.prototype.valueOf = function (v) {
            if ('string' === typeof v && v in this.inputs) {
                var u = this.inputs[v];
                if (u.value)
                    v = this.valueOf(u.value());
            }
            return v;
        };
        Community.prototype.get_options_url = function () {
            var s = '';
            this.registered_elements.forEach(function (u, k) {
                if (u.input && !patterns.settings.test(k)) {
                    if (!u.range || u.range[0] !== u.range[1]) {
                        var v = u.value();
                        if ('off_default' in u ? u.off_default : v !== u.default) {
                            if (Array.isArray(v))
                                v = v.join(',');
                            if ('' !== v && null != v && '-1' != v)
                                s += (s ? '&' : '?') + k + '=' + v;
                        }
                    }
                }
            });
            if (this.data && this.view.filters.size)
                s += (s ? '&' : '?') + this.view.filter_state([]);
            return window.location.protocol + '//' + window.location.host + window.location.pathname + s;
        };
        Community.prototype.gtag = function () {
            if (this.spec.settings.tracking)
                window.dataLayer.push(arguments);
        };
        Community.prototype.add_dependency = function (id, o) {
            var _this = this;
            if (!(id in this.dependencies))
                this.dependencies[id] = [];
            if (!o.uid)
                o.uid = JSON.stringify(o);
            if (o.type in this.conditionals) {
                o.conditional = o.type;
            }
            var c = this.dependencies[id];
            for (var i = c.length; i--;)
                if (o.uid === c[i].uid)
                    return void 0;
            c.push(o);
            if (!(id in this.tree))
                this.tree[id] = { _n: { children: 0, parents: 0 }, children: {}, parents: {} };
            if (!(o.id in this.tree))
                this.tree[o.id] = { _n: { children: 0, parents: 0 }, children: {}, parents: {} };
            this.tree[id].children[o.id] = this.tree[o.id];
            this.tree[id]._n.children++;
            this.tree[o.id].parents[id] = this.tree[id];
            this.tree[o.id]._n.parents++;
            c.sort(function (a, b) {
                return !(a.id in _this.tree) || !(b.id in _this.tree)
                    ? -Infinity
                    : _this.tree[a.id]._n.children - _this.tree[b.id]._n.children;
            });
            this.request_queue(false, id);
        };
        return Community;
    }());

    return Community;

}));
//# sourceMappingURL=community.js.map
