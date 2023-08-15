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
                    this.timer.innerText = '';
                }
                this.progress.innerText = 'Step ' + (this.current_step + 1) + ' of ' + t.n_steps;
                this.dialog.innerText = step.description;
                this.current_step++;
                this.waiting = false;
                this.focuser = setTimeout(function () { return _this.continue.focus(); }, 0);
            }
        };
        TutorialManager.prototype.end_tutorial = function () {
            this.in_progress = '';
            this.current_step = 0;
            this.container.classList.add('hidden');
            this.waiting = false;
            clearTimeout(this.focuser);
        };
        return TutorialManager;
    }());

    const community = function (window, document, site) {
      const tooltip_icon_rule =
          'button.has-note::after,.button-wrapper.has-note button::before,.has-note legend::before,.has-note label::before,.wrapper.has-note > div > label::before{display:none}',
        conditionals = {
          setting: function (u) {
            const v = u.value(),
              theme = v ? 'dark' : 'light';
            if (v !== site.settings[u.setting]) {
              site.settings[u.setting] = v;
              if ('theme_dark' === u.setting) {
                v
                  ? document.body.classList.replace('light-theme', 'dark-theme')
                  : document.body.classList.replace('dark-theme', 'light-theme');
                if (site.plotly) Object.keys(site.plotly).forEach(k => update_plot_theme(site.plotly[k].u));
                if (site.map)
                  Object.keys(site.map).forEach(k => {
                    const u = site.map[k].u;
                    if (u && theme in u.tiles) {
                      Object.keys(u.tiles).forEach(l => {
                        if (theme !== l) u.tiles[l].removeFrom(u.map);
                      });
                      u.tiles[theme].addTo(u.map);
                    }
                  });
              } else if ('hide_url_parameters' === u.setting) {
                window.history.replaceState(
                  Date.now(),
                  '',
                  site.settings.hide_url_parameters
                    ? window.location.protocol + '//' + window.location.host + window.location.pathname
                    : get_options_url()
                );
              } else if ('hide_tooltips' === u.setting) {
                v ? page.script_style.sheet.insertRule(tooltip_icon_rule, 0) : page.script_style.sheet.removeRule(0);
              } else if ('map_overlay' === u.setting) {
                Object.keys(site.map).forEach(id => {
                  if ('_' !== id[0]) {
                    if (v) {
                      site.map[id].u.update();
                    } else {
                      site.map[id].u.overlay.clearLayers();
                      site.map[id].u.overlay_control.remove();
                    }
                  }
                });
              } else if ('tracking' === u.setting) {
                if (v && site.tag_id && !dataLayer.length) {
                  gtag('js', new Date());
                  gtag('config', site.tag_id);
                  gtag('consent', 'default', {analytics_storage: 'denied'});
                }
                gtag('consent', 'update', {analytics_storage: v ? 'granted' : 'denied'});
              } else {
                global_update();
              }
              gtag('event', 'setting', {event_category: u.setting, event_label: v});
              storage.set(u.setting, site.settings[u.setting]);
            }
          },
          options: function (u) {
            const no_view = !u.view || !site.dataviews[u.view].selection,
              d = valueOf(u.dataset || no_view || site.dataviews[u.view].dataset) || defaults.dataset,
              va = valueOf(u.variable),
              k = d + (va ? va : ''),
              combobox = 'combobox' === u.type;
            if (!(k in u.option_sets)) {
              if (patterns.variable.test(u.optionSource)) {
                if (-1 === u.default) u.default = defaults.variable;
                fill_variables_options(u, d, u.option_sets);
              } else if (patterns.levels.test(u.optionSource)) {
                fill_levels_options(u, d, va, u.option_sets);
              } else if (patterns.ids.test(u.optionSource)) {
                fill_ids_options(u, d, u.option_sets);
              }
            }
            if (k in u.option_sets) {
              const fresh = k !== u.current_set && (u.sensitive || !u.current_set),
                c = u[combobox ? 'listbox' : 'e'];
              if (fresh || u.filter || u.selection_subset) {
                if (fresh) {
                  c.innerHTML = '';
                  if (u.option_sets[k].groups) u.groups = u.option_sets[k].groups;
                  u.values = u.option_sets[k].values;
                  u.display = u.option_sets[k].display;
                  u.options = u.option_sets[k].options;
                }
                let ns = 0;
                if ('ID' === u.variable || patterns.ids.test(u.optionSource)) {
                  const value = u.value();
                  let selection = -1 === value || '' === value ? u.subset : u.selection_subset,
                    v = {};
                  if (!no_view) {
                    if (selection in _u) selection = valueOf(selection);
                    if ('siblings' === selection) {
                      const rel = site.data.entity_tree && site.data.entity_tree[value];
                      if (rel) {
                        const parents = Object.keys(rel.parents);
                        if (parents.length) {
                          v = {};
                          parents.forEach(id => {
                            v = {...v, ...site.data.entity_tree[id].children};
                          });
                        }
                      }
                    } else {
                      v = site.dataviews[u.view].selection[selection];
                    }
                  }
                  u.options.forEach(si => {
                    if (fresh && !u.groups) c.appendChild(si);
                    if (no_view || (si.value || si.dataset.value) in v) {
                      si.classList.remove('hidden');
                      ns++;
                    } else {
                      si.classList.add('hidden');
                    }
                  });
                } else if (fresh) {
                  u.options.forEach(si => {
                    si.classList.remove('hidden');
                    if (!u.groups) c.appendChild(si);
                    ns++;
                  });
                } else ns++;
                if (fresh && u.groups) u.groups.e.forEach(e => c.appendChild(e));
                toggle_input(u, ns);
                u.current_set = k;
                if (fresh) {
                  if (combobox) {
                    u.source = [];
                  } else {
                    u.e.selectedIndex = -1;
                    u.source = '';
                  }
                  u.id in site.url_options
                    ? u.set(site.url_options[u.id])
                    : u.state in u.values
                    ? u.set(u.state)
                    : u.reset();
                }
                if (u.filter) u.filter();
              }
            }
          },
          set_current: function () {
            this.values = this.option_sets[this.dataset].values;
            this.display = this.option_sets[this.dataset].display;
            this.options = this.option_sets[this.dataset].options;
            this.source = '';
            this.id in site.url_options
              ? this.set(site.url_options[this.id])
              : this.state in this.values
              ? this.set(this.state)
              : this.reset();
          },
          min: async function (u, c) {
            let cv = c.value(),
              uv = u.value(),
              v = _u[u.view || c.view],
              variable;
            if (patterns.minmax.test(cv)) cv = c.parsed.min;
            if (v && v.y) {
              variable = valueOf(v.y);
              if (variable in site.data.variables) {
                if (!v.time_range.time.length) await conditionals.time_range(v, u, true);
                cv = Math.max(v.time_range.time[0], parseFloat(cv));
              }
              u.update();
            }
            u.e.min = 'undefined' === typeof u.parsed.min ? parseFloat(cv) : Math.max(u.parsed.min, parseFloat(cv));
            if (!u.e.value) {
              u.reset();
            } else if ('number' === typeof uv && isFinite(uv) && uv < cv) {
              u.set(cv);
            }
            if (u.min_indicator) u.min_indicator.firstElementChild.innerText = cv;
          },
          max: async function (u, c) {
            let cv = c.value(),
              uv = u.value(),
              v = _u[u.view || c.view],
              variable;
            if (patterns.minmax.test(cv)) cv = c.parsed.max;
            if (v && v.y) {
              variable = valueOf(v.y);
              if (variable in site.data.variables) {
                if (!v.time_range.time.length) await conditionals.time_range(v, u, true);
                cv = Math.min(v.time_range.time[1], parseFloat(cv));
              }
              u.update();
            }
            u.e.max = 'undefined' === typeof u.parsed.max ? parseFloat(cv) : Math.min(u.parsed.max, parseFloat(cv));
            if (!u.e.value) {
              u.reset();
            } else if ('number' === typeof uv && isFinite(uv) && uv > cv) {
              u.set(cv);
            }
            if (u.max_indicator) u.max_indicator.firstElementChild.innerText = cv;
          },
          dataview: function (f) {
            f = f || _u[defaults.dataview];
            const state = f.value();
            if (state !== f.state && _u._entity_filter.registered[f.parsed.dataset]) {
              if (site.data.inited[f.parsed.dataset]) {
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
                _u._base_filter.c.forEach(f => {
                  f.passed = 0;
                  f.failed = 0;
                });
                _u._entity_filter.entities.forEach(e => {
                  const c = f.check(e),
                    id = e.features.id;
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
                request_queue(f.id);
              } else {
                f.valid = false;
                site.data.data_queue[f.parsed.dataset][f.id] = function () {
                  return conditionals.dataview(f)
                };
              }
            }
          },
          time_filters: function (u) {
            u.time_range.filtered[0] = Infinity;
            u.time_range.filtered[1] = -Infinity;
            const d = u.get.dataset(),
              time = site.data.meta.times[d],
              current = u.time_range.filtered_index + '';
            if (!site.data.inited[d]) return
            for (let i = time.n; i--; ) {
              let pass = false;
              if (i >= u.time_range.index[0] && i <= u.time_range.index[1]) {
                for (let f = u.time_filters.length; f--; ) {
                  const v = {},
                    tf = u.time_filters[f];
                  if (!(tf.value in v)) v[tf.value] = valueOf(tf.value);
                  pass = DataHandler.checks[tf.type](time.value[i], v[tf.value]);
                  if (!pass) break
                }
              }
              u.times[i] = pass;
              if (pass) {
                if (u.time_range.filtered[0] > time.value[i]) u.time_range.filtered[0] = time.value[i];
                if (u.time_range.filtered[1] < time.value[i]) u.time_range.filtered[1] = time.value[i];
              }
            }
            u.time_range.filtered_index = [
              u.time_range.index[0] + u.time_range.filtered[0] - u.time_range.time[0],
              u.time_range.index[1] + u.time_range.filtered[1] - u.time_range.time[1],
            ];
            if (current !== u.time_range.filtered_index + '') {
              const c = _c[u.id + '_filter'];
              if (c)
                c.forEach(ci => {
                  if ('update' === ci.type) {
                    _u[ci.id].update();
                  } else if (ci.type in conditionals) {
                    conditionals[ci.type](_u[ci.id], u);
                  }
                });
            }
          },
          time_range: async function (u, c, passive) {
            const v = c && c.value(),
              d = u.get.dataset(),
              tv = u.time ? valueOf(u.time) : defaults.time,
              t = tv in site.data.variables ? site.data.variables[tv].info[d].min : 1,
              s = _c[u.id + '_time'],
              variable = v in site.data.variables ? v : valueOf(u.y);
            let r = variable && (await site.data.get_variable(variable, u.id));
            if (r) {
              const reset = d + variable != u.time_range.dataset + u.time_range.variable;
              r = r.time_range[d];
              if (-1 !== r[0]) {
                u.time_range.dataset = d;
                u.time_range.variable = variable;
                u.time_range.index[0] = r[0];
                u.time_range.time[0] = u.time_range.filtered[0] = t + r[0];
                u.time_range.index[1] = r[1];
                u.time_range.time[1] = u.time_range.filtered[1] = t + r[1];
              }
              if (!passive && s) {
                s.forEach(si => {
                  const su = _u[si.id],
                    value = su.value();
                  if ('min' === si.type) {
                    if (reset || (isFinite(u.time_range.time[0]) && parseFloat(su.e.min) !== u.time_range.time[0])) {
                      su.e.min = u.time_range.time[0];
                      if (reset || !meta.retain_state || u.time_range.time[0] > value) {
                        su.current_default = u.time_range.time[0];
                        su.set(su.current_default);
                      }
                    }
                  } else if ('max' === si.type) {
                    if (reset || (isFinite(u.time_range.time[1]) && parseFloat(su.e.max) !== u.time_range.time[1])) {
                      su.e.max = u.time_range.time[1];
                      if (reset || !meta.retain_state || u.time_range.time[1] < value || value < u.time_range.time[0]) {
                        su.current_default = u.time_range.time[1];
                        su.set(su.current_default);
                      }
                    }
                  }
                });
                conditionals.time_filters(u);
              }
            } else {
              u.time_range.dataset = d;
              u.time_range.index[0] = 0;
              u.time_range.time[0] = u.time_range.filtered[0] = 1;
              u.time_range.index[1] = 0;
              u.time_range.time[1] = u.time_range.filtered[1] = 1;
            }
          },
          id_filter: function () {
            const ids = {};
            _u._entity_filter.selected = [];
            _u._entity_filter.select_ids = ids;
            if (site.metadata.datasets) {
              site.metadata.datasets.forEach(d => {
                if (d in page.modal.filter.entity_inputs) {
                  const s = page.modal.filter.entity_inputs[d].value(),
                    cs = [];
                  if (s && s.length) {
                    s.forEach(id => {
                      const e = site.data.entities[id];
                      if (e) {
                        cs.push(id);
                        _u._entity_filter.selected.push(id);
                        ids[id] = true;
                        if (e.relations) {
                          Object.keys(e.relations.parents).forEach(k => (ids[k] = true));
                          Object.keys(e.relations.children).forEach(k => (ids[k] = true));
                        }
                      }
                    });
                    page.modal.filter.entity_inputs[d].source = cs;
                  }
                }
              });
            }
          },
        },
        elements = {
          button: {
            init: function (o) {
              o.target = o.e.getAttribute('data-target');
              if ('copy' === o.target) o.settings.endpoint = site.endpoint;
              if ('filter' === o.target) {
                o.e.setAttribute('data-bs-toggle', 'modal');
                o.e.setAttribute('data-bs-target', '#filter_display');
                o.notification = document.createElement('span');
                o.notification.className = 'filter-notification hidden';
                o.e.parentElement.appendChild(o.notification);
                add_dependency('_base_filter', {type: 'update', id: o.id});
                add_dependency('_entity_filter', {type: 'update', id: o.id});
                o.update = elements.button.update.bind(o);
                if (site.data) o.update();
              } else
                o.e.addEventListener(
                  'click',
                  o.settings.effects
                    ? 'export' === o.target || 'copy' === o.target
                      ? function () {
                          const f = {},
                            s = this.settings,
                            v = _u[s.dataview],
                            d = v && v.parsed.dataset;
                          Object.keys(s.query).forEach(k => (f[k] = valueOf(s.query[k])));
                          if (v) {
                            if (!('include' in f) && v.y) f.include = valueOf(v.y);
                            if (!('id' in f) && v.ids) f.id = valueOf(v.ids);
                          }
                          if ('copy' === this.target || this.api) {
                            let q = [];
                            if ('id' in f && '' !== f.id && -1 != f.id) {
                              q.push('id=' + f.id);
                            } else {
                              if (_u._entity_filter.selected.length) q.push('id=' + _u._entity_filter.selected.join(','));
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
                  ? this.source.length + ' of ' + this.options.length + ' selected'
                  : this.source[0] in this.values
                  ? this.options[this.values[this.source[0]]].firstChild.textContent
                  : this.settings.strict || -1 === this.source[0]
                  ? ''
                  : this.source[0]
                : '';
              if (this.settings.use_display) {
                this.selection.innerText = display;
              } else {
                this.input_element.value = display;
              }
              if (this.onchange) this.onchange();
              if (update) request_queue(this.id);
            },
            adder: function (value, display, noadd, meta) {
              const e = document.createElement('div');
              e.id = this.id + '_' + value;
              e.role = 'option';
              e.setAttribute('aria-selected', 'false');
              e.tabindex = '0';
              e.className = 'combobox-option combobox-component';
              e.dataset.value = value;
              e.innerText = display || site.data.format_label(value);
              if (meta && meta.info) {
                e.appendChild(document.createElement('p'));
                e.lastElementChild.className = 'combobox-option-description combobox-component';
                e.lastElementChild.innerText = meta.info.description || meta.info.short_description || '';
              }
              if (!noadd) this.listbox.appendChild(e);
              return e
            },
          },
          plotly: {
            init: function (o) {
              o.previous_span = 1;
              if (o.id in site.plotly) {
                o.x = o.e.getAttribute('data-x');
                o.y = o.e.getAttribute('data-y');
                o.color = o.e.getAttribute('data-color');
                o.time = o.e.getAttribute('data-colorTime');
                o.click = o.e.getAttribute('data-click');
                if (o.click in _u) o.clickto = _u[o.click];
                o.parsed = {};
                o.traces = {};
                o.tab = 'tabpanel' === o.e.parentElement.getAttribute('role') ? o.e.parentElement : void 0;
                if (o.tab) {
                  document.getElementById(o.e.parentElement.getAttribute('aria-labelledby')).addEventListener(
                    'click',
                    function () {
                      if (!this.e.parentElement.classList.contains('active')) {
                        setTimeout(this.update, 155);
                        setTimeout(trigger_resize, 155);
                      }
                    }.bind(o)
                  );
                }
                o.show = function (e) {
                  o.revert();
                  let trace = make_data_entry(
                    this,
                    e,
                    0,
                    0,
                    'hover_line',
                    defaults['border_highlight_' + site.settings.theme_dark]
                  );
                  if (trace) {
                    trace.line.width = 4;
                    trace.marker.size = 12;
                    Plotly.addTraces(this.e, trace, this.e.data.length);
                  }
                };
                o.revert = function () {
                  if (this.e.data.length && 'hover_line' === this.e.data[this.e.data.length - 1].name)
                    Plotly.deleteTraces(this.e, this.e.data.length - 1);
                };
                if (o.options) site.plotly[o.id].u = o;
                site.plotly[o.id].data.forEach((p, i) => {
                  Object.keys(p).forEach(k => {
                    if (patterns.period.test(k)) {
                      const es = k.split('.'),
                        n = es.length - 1;
                      let pl = null;
                      es.forEach((e, ei) => {
                        pl = pl ? (pl[e] = ei === n ? p[k] : {}) : (p[e] = {});
                      });
                    }
                  });
                  if (!('textfont' in p)) p.textfont = {};
                  if (!('color' in p.textfont)) p.textfont.color = defaults.background_highlight;
                  if (!('line' in p)) p.line = {};
                  if (!('color' in p.line)) p.line.color = defaults.background_highlight;
                  if (!('marker' in p)) p.marker = {};
                  p.marker.size = 8;
                  if (!('color' in p.marker)) p.marker.color = defaults.background_highlight;
                  if (!('line' in p.marker)) p.marker.line = {};
                  if (!('color' in p.marker.line)) p.marker.line.color = defaults.background_highlight;
                  if (!('text' in p)) p.text = [];
                  if (!('x' in p)) p.x = [];
                  if ('box' === p.type) {
                    p.hoverinfo = 'none';
                  } else if (!('y' in p)) p.y = [];
                  o.traces[p.type] = JSON.stringify(p);
                  if (!i) {
                    o.base_trace = p.type;
                    if (o.base_trace in _u) add_dependency(o.base_trace, {type: 'update', id: o.id});
                  }
                });
                if (o.x && !(o.x in site.data.variables)) {
                  add_dependency(o.x, {type: 'update', id: o.id});
                }
                if (o.y && !(o.y in site.data.variables)) {
                  add_dependency(o.y, {type: 'update', id: o.id});
                }
                if (o.color && !(o.color in site.data.variables)) {
                  add_dependency(o.color, {type: 'update', id: o.id});
                }
                if (o.time in _u) {
                  add_dependency(o.time, {type: 'update', id: o.id});
                }
                if (o.view) {
                  add_dependency(o.view, {type: 'update', id: o.id});
                  add_dependency(o.view + '_filter', {type: 'update', id: o.id});
                  if (_u[o.view].time_agg in _u) add_dependency(_u[o.view].time_agg, {type: 'update', id: o.id});
                } else o.view = defaults.dataview;
                o.queue = this.queue_init.bind(o)();
              }
            },
            queue_init: function () {
              const showing = this.deferred || !this.tab || this.tab.classList.contains('show');
              if (showing && window.Plotly) {
                Plotly.newPlot(this.e, this.options);
                this.e
                  .on('plotly_hover', elements.plotly.mouseover.bind(this))
                  .on('plotly_unhover', elements.plotly.mouseout.bind(this))
                  .on('plotly_click', elements.plotly.click.bind(this));
                update_plot_theme(this);
                this.update();
              } else {
                this.deferred = true;
                setTimeout(this.queue, showing ? 0 : 2000);
              }
            },
            mouseover: function (d) {
              if (d.points && 1 === d.points.length && this.e.data[d.points[0].fullData.index]) {
                Plotly.restyle(this.e, {'line.width': 5}, d.points[0].fullData.index);
                update_subs(this.id, 'show', site.data.entities[d.points[0].data.id]);
              }
            },
            mouseout: function (d) {
              if (d.points && 1 === d.points.length && this.e.data[d.points[0].fullData.index]) {
                Plotly.restyle(this.e, {'line.width': 2}, d.points[0].fullData.index);
                update_subs(this.id, 'revert', site.data.entities[d.points[0].data.id]);
              }
            },
            click: function (d) {
              this.clickto && this.clickto.set(d.points[0].data.id);
            },
            update: async function (pass) {
              if (this.queue > 0) clearTimeout(this.queue);
              this.queue = -1;
              if (!pass) {
                if (!this.tab || this.tab.classList.contains('show')) this.queue = setTimeout(() => this.update(true), 50);
              } else {
                if (this.e.layout) {
                  const v = _u[this.view],
                    s = v.selection && v.selection.all,
                    d = v.get.dataset(),
                    y = _u[this.time || v.time_agg],
                    parsed = this.parsed;
                  if (site.data.inited[d] && s && v.time_range.filtered.length) {
                    parsed.base_trace = valueOf(this.base_trace);
                    parsed.x = valueOf(this.x);
                    parsed.y = valueOf(this.y);
                    parsed.color = valueOf(this.color || v.y || parsed.y);
                    const varx = await site.data.get_variable(parsed.x, this.view),
                      vary = await site.data.get_variable(parsed.y, this.view),
                      varcol = await site.data.get_variable(parsed.color, this.view);
                    parsed.x_range = varx.time_range[d];
                    parsed.y_range = vary.time_range[d];
                    parsed.view = v;
                    parsed.dataset = d;
                    parsed.palette = valueOf(v.palette) || site.settings.palette;
                    if (!(parsed.palette in palettes)) parsed.palette = defaults.palette;
                    parsed.time = (y ? y.value() - site.data.meta.times[d].range[0] : 0) - varcol.time_range[d][0];
                    parsed.summary = varcol.views[this.view].summaries[d];
                    const ns = parsed.summary.n,
                      display_time = ns[parsed.time] ? parsed.time : 0,
                      summary = vary.views[this.view].summaries[d],
                      missing = parsed.summary.missing[display_time],
                      n = ns[display_time],
                      subset = n !== v.n_selected.dataset,
                      rank = subset ? 'subset_rank' : 'rank',
                      order = subset ? varcol.views[this.view].order[d][display_time] : varcol.info[d].order[display_time],
                      traces = [];
                    let i = parsed.summary.missing[display_time],
                      k,
                      b,
                      fn = order ? order.length : 0,
                      lim = site.settings.trace_limit || 0,
                      jump,
                      state =
                        v.value() +
                        v.get.time_filters() +
                        d +
                        parsed.x +
                        parsed.y +
                        parsed.time +
                        parsed.palette +
                        parsed.color +
                        site.settings.summary_selection +
                        site.settings.color_scale_center +
                        site.settings.color_by_order +
                        site.settings.trace_limit +
                        site.settings.show_empty_times;
                    lim = jump = lim && lim < n ? Math.ceil(Math.min(lim / 2, n / 2)) : 0;
                    Object.keys(this.reference_options).forEach(k => (this.options[k] = valueOf(this.reference_options[k])));
                    for (; i < fn; i++) {
                      if (order[i][0] in s) {
                        k = order[i][0];
                        const e = s[k];
                        state += k;
                        traces.push(
                          make_data_entry(this, e, e.views[this.view][rank][parsed.color][parsed.time] - missing, n)
                        );
                        if (lim && !--jump) break
                      }
                    }
                    if (lim && i < fn) {
                      for (jump = i, i = fn - 1; i > jump; i--) {
                        if (order[i][0] in s) {
                          k = order[i][0];
                          const e = s[k];
                          state += k;
                          traces.push(
                            make_data_entry(this, e, e.views[this.view][rank][parsed.color][parsed.time] - missing, n)
                          );
                          if (!--lim) break
                        }
                      }
                    }
                    state += traces.length && traces[0].type;
                    if (site.settings.boxplots && 'box' in this.traces && s[k]) {
                      state += 'box' + site.settings.iqr_box;
                      b = JSON.parse(this.traces.box);
                      traces.push(b);
                      b.line.color = defaults.border;
                      b.median = summary.median;
                      b.q3 = summary.q3;
                      b.q1 = summary.q1;
                      if (site.settings.iqr_box) {
                        b.upperfence = [];
                        b.lowerfence = [];
                        b.q1.forEach((q1, i) => {
                          if (isNaN(b.median[i])) b.median[i] = 0;
                          const n = (b.q3[i] - q1) * 1.5,
                            med = b.median[i];
                          b.q3[i] = isNaN(b.q3[i]) ? med : Math.max(med, b.q3[i]);
                          b.upperfence[i] = b.q3[i] + n;
                          b.q1[i] = isNaN(b.q1[i]) ? med : Math.min(med, q1);
                          b.lowerfence[i] = q1 - n;
                        });
                      } else {
                        b.upperfence = summary.max;
                        b.lowerfence = summary.min;
                      }
                      if (site.settings.show_empty_times) {
                        b.x = b.q1.map((_, i) => s[k].get_value(parsed.x, i + parsed.y_range[0]));
                      } else {
                        b.x = [];
                        for (i = b.q1.length; i--; ) {
                          if (ns[i]) {
                            b.x[i] = s[k].get_value(parsed.x, i + parsed.y_range[0]);
                          }
                        }
                      }
                    }
                    if (state !== this.state) {
                      if ('boolean' !== typeof this.e.layout.yaxis.title)
                        this.e.layout.yaxis.title =
                          site.data.format_label(parsed.y) +
                          (site.settings.trace_limit < v.n_selected.all
                            ? ' (' + site.settings.trace_limit + ' extremes)'
                            : '');
                      if ('boolean' !== typeof this.e.layout.xaxis.title)
                        this.e.layout.xaxis.title = site.data.format_label(parsed.x);
                      this.e.layout.yaxis.autorange = false;
                      this.e.layout.yaxis.range = [Infinity, -Infinity];
                      if (!b) b = {upperfence: summary.max, lowerfence: summary.min};
                      let any_skipped = false;
                      summary.min.forEach((min, i) => {
                        if (site.settings.show_empty_times || ns[i]) {
                          const l = Math.min(b.lowerfence[i], min),
                            u = Math.max(b.upperfence[i], summary.max[i]);
                          if (this.e.layout.yaxis.range[0] > l) this.e.layout.yaxis.range[0] = l;
                          if (this.e.layout.yaxis.range[1] < u) this.e.layout.yaxis.range[1] = u;
                        } else any_skipped = true;
                      });
                      const r = (this.e.layout.yaxis.range[1] - this.e.layout.yaxis.range[0]) / 10;
                      this.e.layout.yaxis.range[0] -= r;
                      this.e.layout.yaxis.range[1] += r;
                      if (this.e.layout.yaxis.range[1] > 100) {
                        const yinfo = vary.info[d].info;
                        if (yinfo && 'percent' === (yinfo.aggregation_method || yinfo.type))
                          this.e.layout.yaxis.range[1] = 100;
                      }
                      if (site.data.variables[parsed.x].is_time) {
                        const start = v.time_range.filtered[0],
                          end = v.time_range.filtered[1],
                          adj = any_skipped && end > start ? Math.log(end - start) : 0.5;
                        if (this.e.layout.xaxis.autorange) {
                          this.e.layout.xaxis.autorange = false;
                          this.e.layout.xaxis.type = 'linear';
                          this.e.layout.xaxis.dtick = 1;
                          this.e.layout.xaxis.range = [start - adj, end + adj];
                        } else {
                          this.e.layout.xaxis.range[0] = start - adj;
                          this.e.layout.xaxis.range[1] = end + adj;
                        }
                      }
                      if (b.lowerfence.length < this.previous_span) {
                        Plotly.newPlot(this.e, traces, this.e.layout, this.e.config);
                        this.e
                          .on('plotly_hover', elements.plotly.mouseover.bind(this))
                          .on('plotly_unhover', elements.plotly.mouseout.bind(this))
                          .on('plotly_click', elements.plotly.click.bind(this));
                      } else {
                        Plotly.react(this.e, traces, this.e.layout, this.e.config);
                      }
                      setTimeout(trigger_resize, 300);
                      this.previous_span = b.lowerfence.length;
                      this.state = state;
                    }
                  }
                }
              }
            },
          },
          map: {
            init: function (o) {
              o.color = o.e.getAttribute('data-color');
              o.time = o.e.getAttribute('data-colorTime');
              o.click = o.e.getAttribute('data-click');
              if (o.click && o.click in _u) o.clickto = _u[o.click];
              o.parsed = {};
              o.tab = 'tabpanel' === o.e.parentElement.getAttribute('role') ? o.e.parentElement : void 0;
              o.show = function (e) {
                if (e.layer && e.layer[this.id]) {
                  const highlight_style = {
                    color: 'var(--border-highlight)',
                    weight: site.settings.polygon_outline + 1,
                    fillOpacity: 1,
                  };
                  if (!site.data.inited[this.parsed.dataset + o.id]) {
                    const time = site.map[this.id].match_time(
                      site.data.meta.overall.value[
                        site.data.variables[this.parsed.color].time_range[this.parsed.dataset][0] + this.parsed.time
                      ]
                    );
                    if (e.layer[this.id][time]) e.layer[this.id][time].setStyle(highlight_style);
                  } else if (e.layer[this.id].setStyle) {
                    e.layer[this.id].setStyle(highlight_style);
                  }
                }
              };
              o.revert = function (e) {
                if (e.layer && e.layer[this.id]) {
                  const default_style = {
                    color: 'var(--border)',
                    weight: site.settings.polygon_outline,
                    fillOpacity: 0.7,
                  };
                  if (!site.data.inited[this.parsed.dataset + this.id]) {
                    const time = site.map[this.id].match_time(
                      site.data.meta.overall.value[
                        site.data.variables[this.parsed.color].time_range[this.parsed.dataset][0] + this.parsed.time
                      ]
                    );
                    if (e.layer[this.id][time]) e.layer[this.id][time].setStyle(default_style);
                  } else {
                    e.layer[this.id].setStyle(default_style);
                  }
                }
              };
              const dep = {type: 'update', id: o.id};
              if (o.view) {
                if (_u[o.view].time_agg in _u) add_dependency(_u[o.view].time_agg, dep);
                if (_u[o.view].y) add_dependency(_u[o.view].y, dep);
              } else o.view = defaults.dataview;
              add_dependency(o.view, dep);
              if (o.color in _u) add_dependency(o.color, dep);
              if (o.time) add_dependency(o.time, dep);
              if (!o.e.style.height) o.e.style.height = o.options.height ? o.options.height : '400px';
              if (o.options.overlays_from_measures && site.data.variable_info) {
                if (!Array.isArray(site.map[o.id].overlays)) site.map[o.id].overlays = [];
                const overlays = site.map[o.id].overlays;
                Object.keys(site.data.variable_info).forEach(variable => {
                  const info = site.data.variable_info[variable];
                  if (info.layer && info.layer.source) {
                    if ('string' === typeof info.layer.source && patterns.time_ref.test(info.layer.source)) {
                      const temp = info.layer.source;
                      info.layer.source = [];
                      for (
                        let range = site.data.meta.ranges[variable], y = range[0], max = range[1] + 1, time;
                        y < max;
                        y++
                      ) {
                        time = site.data.meta.overall.value[y];
                        info.layer.source.push({url: temp.replace(patterns.time_ref, time), time: time});
                      }
                    }
                    patterns.time_ref.lastIndex = 0;
                    const layer = {variable: variable, source: info.layer.source};
                    if (info.layer.filter && (Array.isArray(info.layer.filter) || info.layer.filter.feature))
                      layer.filter = info.layer.filter;
                    overlays.push(layer);
                  }
                });
              }
              o.queue = this.queue_init.bind(o)();
            },
            queue_init: function () {
              const theme = site.settings.theme_dark ? 'dark' : 'light',
                showing = this.deferred || !this.tab || this.tab.classList.contains('show');
              if (showing && window.L) {
                this.map = L.map(this.e, this.options);
                this.options = this.map.options;
                this.overlay = L.featureGroup().addTo(this.map);
                this.displaying = L.featureGroup().addTo(this.map);
                this.overlay_control = L.control
                  .layers()
                  .setPosition('topleft')
                  .addOverlay(this.overlay, 'Overlay')
                  .addTo(this.map);
                this.tiles = {};
                if (this.id in site.map) {
                  const tiles = site.map[this.id].tiles;
                  site.map[this.id].u = this;
                  if (tiles) {
                    if (tiles.url) {
                      this.tiles[theme] = L.tileLayer(tiles.url, tiles.options);
                      this.tiles[theme].addTo(this.map);
                    } else {
                      Object.keys(tiles).forEach(k => {
                        this.tiles[k] = L.tileLayer(tiles[k].url, tiles[k].options);
                        if (theme === k) this.tiles[k].addTo(this.map);
                      });
                    }
                  }
                  if (!('_raw' in site.map)) site.map._raw = {};
                  if (!('_queue' in site.map)) site.map._queue = {};
                  if (!('_layers' in site.map[this.id])) site.map[this.id]._layers = {};
                  const time = site.data.meta.overall.value[_u[this.view].parsed.time_agg],
                    by_time = [];
                  site.map[this.id].shapes.forEach((shape, i) => {
                    const has_time = 'time' in shape;
                    if (has_time) {
                      if (!site.map[this.id].has_time) {
                        site.map[this.id].has_time = true;
                        add_dependency(this.view, {type: 'update', id: this.id});
                      }
                      by_time.push(Number(shape.time));
                    }
                    let k = shape.name;
                    if (!k) shape.name = k = site.metadata.datasets[i < site.metadata.datasets.length ? i : 0];
                    const mapId = k + (has_time ? shape.time : '');
                    if (!(mapId in site.map._queue)) site.map._queue[mapId] = shape;
                    site.data.inited[mapId + this.id] = false;
                    if (
                      (site.data.loaded[k] || k === this.options.background_shapes) &&
                      (k === mapId ||
                        (time && site.map[this.id].match_time && shape.time == site.map[this.id].match_time(time)))
                    )
                      retrieve_layer(this, shape);
                  });
                  if (site.map[this.id].has_time) {
                    by_time.sort();
                    site.map[this.id].match_time = function (time) {
                      let i = by_time.length;
                      for (; i--; ) if (!i || by_time[i] <= time) break
                      return by_time[i]
                    }.bind(by_time);
                  }
                  site.map[this.id].triggers = {};
                  site.map[this.id].overlay_summaries = {};
                  if (Array.isArray(site.map[this.id].overlays)) {
                    site.map[this.id].overlays.forEach(l => {
                      if ('string' === typeof l.source) l.source = [{url: l.source}];
                      const source = l.source;
                      source.forEach(s => {
                        s.processed = false;
                        s.property_summaries = {};
                        site.map._queue[s.url] = s;
                      });
                      site.map[this.id].triggers[l.variable] = {source};
                      const fs = l.filter;
                      if (fs) {
                        const fa = Array.isArray(fs) ? fs : [fs];
                        site.map[this.id].triggers[l.variable].filter = fa;
                        fa.forEach(f => {
                          f.check = DataHandler.checks[f.operator];
                        });
                      }
                    });
                  }
                }
              } else {
                this.deferred = true;
                setTimeout(this.queue, showing ? 0 : 2000);
              }
            },
            mouseover: function (e) {
              e.target.setStyle({
                color: 'var(--border-highlight)',
              });
              update_subs(this.id, 'show', site.data.entities[e.target.feature.properties[e.target.source.id_property]]);
            },
            mouseout: function (e) {
              update_subs(this.id, 'revert', site.data.entities[e.target.feature.properties[e.target.source.id_property]]);
              e.target.setStyle({
                color: 'var(--border)',
              });
            },
            click: function (e) {
              if (this.clickto) this.clickto.set(e.target.feature.properties[e.target.source.id_property]);
            },
            update: async function (entity, caller, pass) {
              if (this.queue > 0) clearTimeout(this.queue);
              this.queue = -1;
              if (!pass) {
                if (!this.tab || this.tab.classList.contains('show'))
                  this.queue = setTimeout(() => this.update(void 0, void 0, true), 50);
              } else {
                if (this.view && this.displaying) {
                  const parsed = this.parsed,
                    view = site.dataviews[this.view],
                    d = view.get.dataset(),
                    time = valueOf(view.time_agg),
                    map_time = site.map[this.id].has_time ? site.map[this.id].match_time(time) : '',
                    inited = d + map_time + this.id in site.data.inited,
                    mapId = inited ? d + map_time : d;
                  if (site.map._queue && mapId in site.map._queue && !site.data.inited[mapId + this.id]) {
                    if (!inited || null !== time)
                      retrieve_layer(this, site.map._queue[mapId], () => this.update(void 0, void 0, true));
                    return
                  }
                  if (!view.valid && site.data.inited[d]) {
                    view.state = '';
                    conditionals.dataview(view, void 0, true);
                  }
                  parsed.view = view;
                  parsed.dataset = d;
                  const vstate =
                      view.value() +
                      mapId +
                      site.settings.background_shapes +
                      site.settings.background_top +
                      site.settings.background_polygon_outline +
                      site.data.inited[this.options.background_shapes],
                    a = view.selection.all,
                    s = view.selection[site.settings.background_shapes && this.options.background_shapes ? 'ids' : 'all'],
                    c = valueOf(this.color || view.y);
                  if (site.settings.map_overlay && c in site.map[this.id].triggers) {
                    show_overlay(this, site.map[this.id].triggers[c], site.data.meta.overall.value[view.parsed.time_agg]);
                  } else {
                    this.overlay_control.remove();
                    this.overlay.clearLayers();
                  }
                  if (site.data.inited[mapId + this.id] && s && view.valid) {
                    const ys = this.time
                      ? _u[this.time]
                      : view.time_agg
                      ? view.time_agg in _u
                        ? _u[view.time_agg]
                        : parseInt(view.time_agg)
                      : 0;
                    parsed.palette = valueOf(view.palette) || site.settings.palette;
                    if (!(parsed.palette in palettes)) parsed.palette = defaults.palette;
                    const varc = await site.data.get_variable(c, this.view),
                      summary = varc.views[this.view].summaries[d],
                      time = (ys.parsed ? ys.value() - site.data.meta.times[d].range[0] : 0) - varc.time_range[d][0];
                    parsed.summary = summary;
                    parsed.time = time;
                    parsed.color = c;
                    const subset = summary.n[ys] === view.n_selected.dataset ? 'rank' : 'subset_rank';
                    if (vstate !== this.vstate) {
                      this.map._zoomAnimated = 'none' !== site.settings.map_animations;
                      Object.keys(this.reference_options).forEach(k => {
                        this.options[k] = valueOf(this.reference_options[k]);
                        if ('zoomAnimation' === k) this.map._zoomAnimated = this.options[k];
                      });
                      this.displaying.clearLayers();
                      this.fresh_shapes = true;
                      this.vstate = false;
                      let n = 0;
                      Object.keys(s).forEach(k => {
                        const skl = s[k].layer;
                        if (skl && skl[this.id]) {
                          const fg = k in a,
                            cl = skl[this.id].has_time ? skl[this.id][map_time] : skl[this.id];
                          if (cl && (fg || this.options.background_shapes === site.data.entities[k].group)) {
                            n++;
                            cl.options.interactive = fg;
                            cl.addTo(this.displaying);
                            if (fg) {
                              if (site.settings.background_top) cl.bringToBack();
                            } else {
                              if (!site.settings.background_top) cl.bringToBack();
                              cl.setStyle({
                                fillOpacity: 0,
                                color: 'var(--border-highlight)',
                                weight: site.settings.background_polygon_outline,
                              });
                            }
                            if (!this.vstate) this.vstate = vstate;
                          }
                        }
                      });
                      this.overlay.bringToFront();
                      if (n)
                        if ('fly' === site.settings.map_animations) {
                          setTimeout(() => this.map.flyToBounds(this.displaying.getBounds()), 400);
                        } else {
                          this.map.fitBounds(this.displaying.getBounds());
                        }
                    }

                    // coloring
                    const k =
                      c +
                      this.vstate +
                      parsed.palette +
                      time +
                      site.settings.polygon_outline +
                      site.settings.color_by_order +
                      site.settings.color_scale_center;
                    if (k !== this.cstate) {
                      this.cstate = k;
                      if (site.map[this.id]) {
                        const ls = this.displaying._layers;
                        const n = summary.n[time];
                        const missing = summary.missing[time];
                        Object.keys(ls).forEach(id => {
                          const lsi = ls[id];
                          if (d === lsi.entity.group) {
                            const e = a[lsi.entity.features.id],
                              es = e && e.views[this.view][subset];
                            lsi.setStyle({
                              fillOpacity: 0.7,
                              color: 'var(--border)',
                              fillColor:
                                e && c in es
                                  ? pal(e.get_value(c, time), parsed.palette, summary, time, es[c][time] - missing, n)
                                  : defaults.missing,
                              weight: site.settings.polygon_outline,
                            });
                          }
                        });
                      } else {
                        if (!('_waiting' in site.map)) site.map._waiting = {};
                        if (!(d in site.map._waiting)) site.map._waiting[d] = [];
                        if (-1 === site.map._waiting[d].indexOf(this.id)) site.map._waiting[d].push(this.id);
                        if (-1 === site.map._waiting[d].indexOf(this.view)) site.map._waiting[d].push(this.view);
                      }
                    }
                  }
                }
              }
            },
          },
          info: {
            init: function (o) {
              o.depends = {};
              o.has_default = o.options.default && (o.options.default.title || o.options.default.body);
              add_subs(o.view, o);
              if (o.options.floating) {
                document.body.appendChild(o.e);
                o.e.classList.add('hidden');
                document.addEventListener('mousemove', function (e) {
                  if (o.showing) {
                    const f = page.content.getBoundingClientRect();
                    o.e.style.top = (e.y > f.height / 2 ? e.y - o.e.getBoundingClientRect().height - 10 : e.y + 10) + 'px';
                    o.e.style.left = (e.x > f.width / 2 ? e.x - o.e.getBoundingClientRect().width - 10 : e.x + 10) + 'px';
                  }
                });
              }
              o.show = function (e, u) {
                this.update(e, u);
                this.showing = true;
                if (this.options.floating) this.e.classList.remove('hidden');
                if (this.parts.title) {
                  if (this.selection) {
                    this.parts.title.base.classList.add('hidden');
                  } else this.parts.title.default.classList.add('hidden');
                  this.parts.title.temp.classList.remove('hidden');
                }
                if (this.parts.body) {
                  if (this.selection) {
                    this.parts.body.base.classList.add('hidden');
                  } else this.parts.body.default.classList.add('hidden');
                  this.parts.body.temp.classList.remove('hidden');
                }
              };
              o.revert = function () {
                this.showing = false;
                if (this.options.floating) {
                  this.e.classList.add('hidden');
                } else {
                  if (this.parts.title) {
                    if (this.selection) {
                      this.parts.title.base.classList.remove('hidden');
                    } else if (this.has_default) this.parts.title.default.classList.remove('hidden');
                    this.parts.title.temp.classList.add('hidden');
                  }
                  if (this.parts.body) {
                    if (this.selection) {
                      this.parts.body.base.classList.remove('hidden');
                    } else if (this.has_default) this.parts.body.default.classList.remove('hidden');
                    this.parts.body.temp.classList.add('hidden');
                  }
                }
              };
              o.parts = {};
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
                            this.parsed.data = valueOf(o.options.variable || caller.color || caller.y || _u[o.view].y);
                          } else if (this.text in _u) this.parsed.data = valueOf(this.text);
                          if (!(this.parsed.data in site.data.variables)) return this.parsed.data
                          const info = site.data.variables[this.parsed.data],
                            v = site.data.format_value(
                              entity.get_value(this.parsed.data, this.parent.time),
                              info && info.info[entity.group] && 'integer' === info.info[entity.group].type
                            );
                          let type = info.meta.unit || info.meta.type;
                          if (info.meta.aggregation_method && !(type in value_types)) type = info.meta.aggregation_method;
                          return NaN !== v && type in value_types ? value_types[type](v) : v
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
                };
                if ('value' === t) {
                  p.parsed.data = o.options.variable;
                } else if ('summary' === t) {
                  o.options.show_summary = true;
                  p.parsed.summary = make_summary_table(o.e);
                } else if ('filter' === t) {
                  const e = document.createElement('table');
                  e.className = 'info-filter';
                  p.parsed.filter = e;
                }
                if (patterns.features.test(t)) {
                  p.parsed.features = t.replace(patterns.features, '');
                } else if (patterns.data.test(t)) {
                  p.parsed.data = t.replace(patterns.data, '');
                } else if (patterns.variables.test(t)) {
                  p.parsed.variables = t.replace(patterns.variables, '');
                } else p.ref = false;
                return p
              }
              if (o.options.title) {
                o.parts.title = parse_part(o, o.options.title);
                if (
                  o.options.variable_info &&
                  'variables' in o.parts.title.parsed &&
                  patterns.measure_name.test(o.parts.title.parsed.variables)
                ) {
                  o.parts.title.base = document.createElement('button');
                  o.parts.title.base.type = 'button';
                  o.parts.title.base.setAttribute('data-bs-toggle', 'modal');
                  o.parts.title.base.setAttribute('data-bs-target', '#variable_info_display');
                  o.parts.title.base.addEventListener('click', show_variable_info.bind(o));
                } else o.parts.title.base = document.createElement('p');
                o.parts.title.base.appendChild(document.createElement('span'));
                o.parts.title.temp = document.createElement('p');
                o.parts.title.default = document.createElement('p');
                o.parts.title.temp.className =
                  o.parts.title.base.className =
                  o.parts.title.default.className =
                    'info-title hidden';
                if (o.has_default && o.options.default.title) {
                  o.e.appendChild(o.parts.title.default);
                  o.parts.title.default.innerText = o.options.default.title;
                }
                if (!o.parts.title.ref) o.parts.title.base.firstElementChild.innerText = o.parts.title.get();
                o.e.appendChild(o.parts.title.base);
                o.e.appendChild(o.parts.title.temp);
                o.parts.title.base.classList.add('hidden');
                o.parts.title.temp.classList.add('hidden');
              }
              if (o.options.body || (o.has_default && o.options.default.body)) {
                o.parts.body = {
                  base: document.createElement('div'),
                  temp: document.createElement('div'),
                  default: document.createElement('div'),
                  rows: [],
                };
                o.parts.body.temp.className =
                  o.parts.body.base.className =
                  o.parts.body.default.className =
                    'info-body hidden';
                if (o.has_default && o.options.default.body) o.parts.body.default.innerText = o.options.default.body;
                let h = 0;
                o.options.body &&
                  o.options.body.forEach((op, i) => {
                    const p = {
                      name: parse_part(o, op.name),
                      value: parse_part(o, op.value),
                    };
                    o.parts.body.rows[i] = p;
                    p.base = document.createElement('div');
                    o.parts.body.base.appendChild(p.base);
                    p.temp = document.createElement('div');
                    o.parts.body.temp.appendChild(p.temp);
                    p.temp.className = p.base.className = 'info-body-row-' + op.style;
                    h += 24 + ('stack' === op.style ? 24 : 0);
                    if (p.name) {
                      if (
                        o.options.variable_info &&
                        'variables' in p.name.parsed &&
                        patterns.measure_name.test(p.name.parsed.variables)
                      ) {
                        p.base.appendChild(document.createElement('button'));
                        p.base.lastElementChild.type = 'button';
                        p.base.lastElementChild.setAttribute('data-bs-toggle', 'modal');
                        p.base.lastElementChild.setAttribute('data-bs-target', '#variable_info_display');
                        p.base.lastElementChild.addEventListener('click', show_variable_info.bind(o));
                      } else p.base.appendChild(document.createElement('div'));
                      p.temp.appendChild(document.createElement('div'));
                      p.temp.lastElementChild.className = p.base.lastElementChild.className = 'info-body-row-name';
                      p.temp.lastElementChild.innerText = p.base.lastElementChild.innerText = p.name.get();
                    }
                    if (p.value) {
                      p.base.appendChild(document.createElement('div'));
                      p.temp.appendChild(document.createElement('div'));
                      if ('summary' in p.value.parsed) {
                        p.base.lastElementChild.appendChild(p.value.parsed.summary);
                      } else if ('filter' in p.value.parsed) {
                        p.base.lastElementChild.appendChild(p.value.parsed.filter);
                      } else {
                        p.temp.lastElementChild.className = p.base.lastElementChild.className =
                          'info-body-row-value' + ('statement' === p.value.parsed.variables ? ' statement' : '');
                        if (p.name.ref && 'value' === p.value.text) p.value.ref = true;
                        if (!p.value.ref)
                          p.temp.lastElementChild.innerText = p.base.lastElementChild.innerText = p.value.get();
                      }
                    }
                  });
                o.e.style.minHeight = h + 'px';
                o.e.appendChild(o.parts.body.base);
                o.e.appendChild(o.parts.body.default);
                o.e.appendChild(o.parts.body.temp);
              }
              o.update();
            },
            update: async function (entity, caller, pass) {
              const v = site.dataviews[this.view];
              const y = _u[v.time_agg];
              this.v = valueOf(this.options.variable || (caller && (caller.color || caller.y)) || v.y);
              this.dataset = v.get.dataset();
              if (y && !(this.dataset in site.data.meta.times)) {
                if (!(this.id in site.data.data_queue[this.dataset]))
                  site.data.data_queue[this.dataset][this.id] = this.update;
                return
              }
              this.time_agg = y ? y.value() - site.data.meta.times[this.dataset].range[0] : 0;
              const time_range = this.v in site.data.variables && site.data.variables[this.v].time_range[this.dataset];
              this.time = time_range ? this.time_agg - time_range[0] : 0;
              if (this.options.show_summary) {
                this.var = this.v && (await site.data.get_variable(this.v, this.view));
                this.summary = this.view in this.var.views && this.var.views[this.view].summaries[this.dataset];
              }
              if (!this.processed) {
                this.processed = true;
                if (!this.options.floating) {
                  add_dependency(this.view, {type: 'update', id: this.id});
                  if (v.y in _u) add_dependency(v.y, {type: 'update', id: this.id});
                  if (y) add_dependency(v.time_agg, {type: 'update', id: this.id});
                  if (this.options.variable in _u) add_dependency(this.options.variable, {type: 'update', id: this.id});
                }
                if (this.parts.body)
                  this.parts.body.rows.forEach(p => {
                    if (!p.value.ref && p.value.text in _u && 'variables' in p.name.parsed) {
                      p.name.value_source = p.value.value_source = p.value.text;
                      p.value.ref = true;
                      p.value.parsed.data = '';
                    }
                  });
              }
              if (entity) {
                // hover information
                if (this.parts.title) {
                  this.parts.title.temp.innerText = this.parts.title.get(entity, caller);
                }
                if (this.parts.body) {
                  this.parts.body.rows.forEach(p => {
                    if (p.name.ref) {
                      if (p.name.value_source) p.name.value_source = p.value.text;
                      e = p.name.get(entity, caller);
                      if ('object' !== typeof e) {
                        p.temp.firstElementChild.innerText = parse_variables(e, p.value.parsed.variables, this, entity);
                      }
                    }
                    if (p.value.ref) {
                      if (p.value.value_source) p.value.value_source = p.value.text;
                      e = p.value.get(entity, caller);
                      if ('object' !== typeof e) {
                        p.temp.lastElementChild.innerText = parse_variables(e, p.value.parsed.variables, this, entity);
                      }
                    }
                  });
                }
              } else if (!this.options.floating) {
                if (this.queue > 0) clearTimeout(this.queue);
                this.queue = -1;
                if (!pass) {
                  if (!this.tab || this.tab.classList.contains('show'))
                    this.queue = setTimeout(() => this.update(void 0, void 0, true), 50);
                } else {
                  // base information
                  entity = site.data.entities[v.get.ids(true)];
                  if (entity) {
                    // when showing a selected region
                    this.selection = true;
                    if (this.parts.title) {
                      if (this.parts.title.value_source) p.title.value_source = p.value.text;
                      this.parts.title.base.classList.remove('hidden');
                      this.parts.title.default.classList.add('hidden');
                    }
                    if (this.parts.body && this.has_default) this.parts.body.default.classList.add('hidden');
                  } else {
                    // when no ID is selected
                    this.selection = false;
                    if (this.parts.title) {
                      if (this.has_default) {
                        this.parts.title.base.classList.add('hidden');
                        this.parts.title.default.classList.remove('hidden');
                      } else if (!this.parts.title.ref || !('features' in this.parts.title.parsed))
                        this.parts.title.base.classList.remove('hidden');
                    }
                    if (this.parts.body) {
                      this.parts.body.base.classList.add('hidden');
                      if (this.has_default) this.parts.body.default.classList.remove('hidden');
                    }
                  }
                  if (this.parts.title) {
                    this.parts.title.base.firstElementChild.innerText = this.parts.title.get(entity, caller);
                  }
                  if (this.parts.body) {
                    if (!this.options.subto) this.parts.body.base.classList.remove('hidden');
                    this.parts.body.rows.forEach(p => {
                      if ('summary' in p.value.parsed) {
                        fill_summary_table(p.value.parsed.summary, this.summary, this.time);
                      } else if ('filter' in p.value.parsed) {
                        const e = p.value.parsed.filter;
                        let n = 0;
                        e.innerHTML = '';
                        if (_u._entity_filter.selected.length) {
                          n++;
                          const s = document.createElement('tr');
                          s.className = 'filter-display';
                          let ss = document.createElement('td');
                          s.appendChild(ss);
                          ss.appendChild(document.createElement('span'));
                          ss.lastElementChild.className = 'syntax-variable';
                          ss.lastElementChild.innerText = 'Select Entities';
                          ss = document.createElement('td');
                          s.appendChild(ss);
                          ss.appendChild(document.createElement('span'));
                          ss.lastElementChild.className = 'syntax-operator';
                          ss.lastElementChild.innerText = ':';
                          ss = document.createElement('td');
                          s.appendChild(ss);
                          ss.setAttribute('colspan', 2);
                          ss.appendChild(document.createElement('span'));
                          ss.lastElementChild.className = 'syntax-value';
                          let ids = '';
                          _u._entity_filter.selected.forEach(id => {
                            const entity = site.data.entities[id];
                            ids += (ids ? ', ' : '') + (entity && entity.features ? entity.features.name : id);
                          });
                          ss.lastElementChild.innerText = ids;
                          e.appendChild(s);
                        }
                        _u._base_filter.c.forEach(f => {
                          const checked = f.passed + f.failed;
                          if (f.active && checked) {
                            const result = f.passed + '/' + checked;
                            f.e.children[1].lastElementChild.innerText = result;
                            n++;
                            const s = document.createElement('tr'),
                              info = site.data.variable_info[f.variable];
                            s.className = 'filter-display';
                            let ss = document.createElement('td');
                            s.appendChild(ss);
                            ss.appendChild(document.createElement('span'));
                            ss.lastElementChild.className = 'syntax-variable';
                            ss.lastElementChild.title = f.variable;
                            ss.lastElementChild.innerText = info.short_name;
                            ss.appendChild(document.createElement('span'));
                            ss.lastElementChild.innerText = ' (';
                            ss.appendChild(document.createElement('span'));
                            ss.lastElementChild.className = 'syntax-component';
                            ss.lastElementChild.innerText = f.component;
                            ss.appendChild(document.createElement('span'));
                            ss.lastElementChild.innerText = ')';
                            ss = document.createElement('td');
                            s.appendChild(ss);
                            ss.appendChild(document.createElement('span'));
                            ss.lastElementChild.className = 'syntax-operator';
                            ss.lastElementChild.innerText = f.operator;
                            ss = document.createElement('td');
                            s.appendChild(ss);
                            ss.appendChild(document.createElement('span'));
                            ss.lastElementChild.className = 'syntax-value';
                            ss.lastElementChild.innerText =
                              'number' === typeof f.value ? site.data.format_value(f.value) : f.value;
                            ss = document.createElement('td');
                            s.appendChild(ss);
                            ss.appendChild(document.createElement('span'));
                            ss.lastElementChild.innerText =
                              '(' + (f.value_source ? f.value_source + '; ' : '') + result + ')';
                            e.appendChild(s);
                          }
                        });
                        this.e.classList[n ? 'remove' : 'add']('hidden');
                      }
                      if (('variables' in p.value.parsed || 'summary' in p.value.parsed) && !(v.y in this.depends)) {
                        this.depends[v.y] = true;
                        add_dependency(v.y, {type: 'update', id: this.id});
                      } else if ('filter' in p.value.parsed && !('_base_filter' in this.depends)) {
                        this.depends._base_filter = true;
                        add_dependency('_base_filter', {type: 'update', id: this.id});
                      }
                      if (p.name.ref) {
                        if (p.name.value_source) p.name.value_source = p.value.text;
                        const e = p.name.get(entity, caller);
                        if ('object' !== typeof e) {
                          p.base.firstElementChild.innerText = e;
                        }
                      }
                      if (p.value.ref) {
                        const e = p.value.get(entity, caller);
                        if ('object' === typeof e) {
                          if (Array.isArray(e) && 'sources' === p.value.parsed.variables) {
                            p.base.innerHTML = '';
                            p.base.appendChild(document.createElement('table'));
                            p.base.lastElementChild.className = 'source-table';
                            p.base.firstElementChild.appendChild(document.createElement('thead'));
                            p.base.firstElementChild.firstElementChild.appendChild(document.createElement('tr'));
                            p.base.firstElementChild.firstElementChild.firstElementChild.appendChild(
                              document.createElement('th')
                            );
                            p.base.firstElementChild.firstElementChild.firstElementChild.appendChild(
                              document.createElement('th')
                            );
                            p.base.firstElementChild.firstElementChild.firstElementChild.firstElementChild.innerText =
                              'Source';
                            p.base.firstElementChild.firstElementChild.firstElementChild.lastElementChild.innerText =
                              'Accessed';
                            p.base.firstElementChild.appendChild(document.createElement('tbody'));
                            e.forEach(ei => {
                              p.base.firstElementChild.lastElementChild.appendChild(make_variable_source(ei, true));
                            });
                          }
                        } else {
                          p.base.lastElementChild.innerText = parse_variables(e, p.value.parsed.variables, this, entity);
                        }
                      }
                    });
                  }
                }
              }
              this.revert();
            },
          },
          datatable: {
            init: function (o) {
              o.e.appendChild(document.createElement('thead'));
              o.e.appendChild(document.createElement('tbody'));
              o.click = o.e.getAttribute('data-click');
              o.features = o.options.features;
              o.parsed = {summary: {}, order: [], time: -1, color: '', dataset: _u[o.view].get.dataset(), time_index: {}};
              o.header = [];
              o.rows = {};
              o.rowIds = {};
              o.tab = 'tabpanel' === o.e.parentElement.getAttribute('role') ? o.e.parentElement : void 0;
              const time = site.data.meta.times[o.parsed.dataset];
              o.style = document.head.appendChild(document.createElement('style'));
              if (o.tab) {
                document.getElementById(o.e.parentElement.getAttribute('aria-labelledby')).addEventListener(
                  'click',
                  function () {
                    if (!this.e.parentElement.classList.contains('active')) {
                      setTimeout(this.update, 155);
                      setTimeout(trigger_resize, 155);
                    }
                  }.bind(o)
                );
              }
              o.e.addEventListener('mouseover', elements.datatable.mouseover.bind(o));
              o.e.addEventListener('mouseout', elements.datatable.mouseout.bind(o));
              if (o.click) {
                if (o.click in _u) o.clickto = _u[o.click];
                o.e.addEventListener('click', elements.datatable.click.bind(o));
              }
              o.show = function (e) {
                if (e.features && e.features.id in this.rows) {
                  if (site.settings.table_autoscroll) {
                    this.rows[e.features.id].scrollTo('smooth' === site.settings.table_scroll_behavior);
                  }
                  if (this.pending > 0) clearTimeout(this.pending);
                  this.pending = -1;
                  const row = this.rows[e.features.id].node();
                  if (row) {
                    row.classList.add('highlighted');
                  } else {
                    this.pending = setTimeout(
                      function () {
                        const row = this.node();
                        if (row) row.classList.add('highlighted');
                      }.bind(this.rows[e.features.id]),
                      0
                    );
                  }
                }
              };
              o.revert = function () {
                if (this.pending > 0) clearTimeout(this.pending);
                this.e.querySelectorAll('tr.highlighted').forEach(e => e.classList.remove('highlighted'));
              };
              o.options.variable_source = o.options.variables;
              if (o.options.variables) {
                if ('string' === typeof o.options.variables) {
                  if (o.options.variables in _u) {
                    add_dependency(o.options.variables, {type: 'update', id: o.id});
                    o.options.variables = valueOf(o.options.variables);
                    o.options.single_variable = 'string' === typeof o.options.variables;
                  } else if (!o.options.single_variable) {
                    o.options.single_variable = [{name: o.options.single_variable}];
                  }
                }
              } else o.options.variables = Object.keys(site.data.variables);
              if (
                'string' !== typeof o.options.variables &&
                o.options.variables.length &&
                'string' === o.options.variables[0]
              ) {
                o.options.variables = o.options.variables.map(v => {
                });
              }
              if (o.options.single_variable) {
                const c = o.options.variables,
                  k = c.name || c;
                o.header.push({title: 'Name', data: 'entity.features.name'});
                if (time && time.is_single) o.variable_header = true;
                const t = k in site.data.variables && site.data.variables[k].time_range[o.parsed.dataset];
                if (t)
                  for (let n = t[1] - t[0] + 1; n--; ) {
                    o.header[n + 1] = {
                      title: o.variable_header ? c.title || site.data.format_label(k) : time.value[n + t[0]] + '',
                      data: site.data.get_value,
                      render: DataHandler.retrievers.row_time.bind({
                        i: n,
                        o: t[0],
                        format_value: site.data.format_value.bind(site.data),
                      }),
                    };
                  }
                o.options.order = [[o.header.length - 1, 'dsc']];
              } else if (o.options.wide) {
                if (o.features) {
                  if ('string' === typeof o.features) o.features = [{name: o.features}];
                  o.features.forEach(f => {
                    o.header.push({
                      title: f.title || f.name,
                      data: 'entity.features.' + f.name.replace(patterns.all_periods, '\\.'),
                    });
                  });
                }
                for (let i = o.options.variables.length; i--; ) {
                  if ('string' === typeof o.options.variables[i]) o.options.variables[i] = {name: o.options.variables[i]};
                  const c = o.options.variables[i];
                  if (!c.source) c.source = c.name in site.data.variables ? 'data' : 'features';
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
                                const v = await site.data.get_variable(this.c.name, this.o.view);
                                const i = row.time - v.time_range[this.o.parsed.dataset][0];
                                return i < 0 ? NaN : row.entity.get_value(this.c.name, i)
                              } else return NaN
                            } else
                              return this.c.source in row.entity && this.c.name in row.entity[this.c.source]
                                ? row.entity[this.c.source][this.c.name]
                                : NaN
                          }.bind({o, c}),
                        }
                  );
                }
              } else {
                o.filters = o.options.filters;
                o.current_filter = {};
                if (!time.is_single) {
                  o.header.push({
                    title: 'Year',
                    data: 'entity.time.value',
                    render: function (d, type, row) {
                      const t = row.time + row.offset;
                      return d && t >= 0 && t < d.length ? d[t] : NaN
                    },
                  });
                }
                if (o.features) {
                  if ('string' === typeof o.features) o.features = [{name: o.features}];
                  o.features.forEach(f => {
                    o.header.splice(0, 0, {
                      title: f.title || f.name,
                      data: 'entity.features.' + f.name.replace(patterns.all_periods, '\\.'),
                    });
                  });
                }
                o.header.push({
                  title: 'Variable',
                  data: function (row) {
                    return row.variable in row.entity.variables
                      ? row.entity.variables[row.variable].meta.short_name
                      : row.variable
                  },
                });
                o.header.push({
                  title: 'Value',
                  data: site.data.get_value,
                  render: function (d, type, row) {
                    return d
                      ? 'number' === typeof d[row.time]
                        ? site.data.format_value(d[row.time], row.int)
                        : d[row.time]
                      : ''
                  },
                });
              }
              if (o.view) {
                add_dependency(o.view, {type: 'update', id: o.id});
                add_dependency(o.view + '_filter', {type: 'update', id: o.id});
                add_dependency(_u[o.view].time_agg, {type: 'update', id: o.id});
              } else o.view = defaults.dataview;
              o.queue = this.queue_init.bind(o)();
            },
            queue_init: function () {
              const showing = this.deferred || !this.tab || this.tab.classList.contains('show');
              if (showing && window.jQuery && window.DataTable && 'get' in site.dataviews[this.view]) {
                this.options.columns = this.header;
                this.table = $(this.e).DataTable(this.options);
                this.update();
              } else {
                this.deferred = true;
                setTimeout(this.queue, showing ? 0 : 2000);
              }
            },
            update: async function (pass) {
              if (this.queue > 0) clearTimeout(this.queue);
              this.queue = -1;
              if (!pass) {
                if (!this.tab || this.tab.classList.contains('show')) this.queue = setTimeout(() => this.update(true), 50);
              } else {
                if (this.table) {
                  let vn =
                    this.options.variable_source &&
                    valueOf(this.options.variable_source).replace(patterns.all_periods, '\\.');
                  const v = _u[this.view],
                    d = v.get.dataset();
                  if (!site.data.inited[d]) return
                  const times = site.data.meta.times[d],
                    state =
                      d +
                      v.value() +
                      v.get.time_filters() +
                      site.settings.digits +
                      vn +
                      site.settings.theme_dark +
                      site.settings.show_empty_times,
                    update = state !== this.state,
                    time = valueOf(v.time_agg),
                    variable = await site.data.get_variable(vn, this.view);
                  this.parsed.time_range = variable ? variable.time_range[d] : times.info.time_range[d];
                  this.parsed.time = ('number' === typeof time ? time - times.range[0] : 0) - this.parsed.time_range[0];
                  if (update) {
                    this.rows = {};
                    this.rowIds = {};
                    this.table.clear();
                    if (v.valid) {
                      this.state = state;
                      Object.keys(this.reference_options).forEach(
                        k => (this.options[k] = valueOf(this.reference_options[k]))
                      );
                      if (this.options.single_variable) {
                        this.parsed.time_index = {};
                        this.parsed.dataset = d;
                        this.parsed.color = vn;
                        this.parsed.summary = this.view in variable.views ? variable.views[this.view].summaries[d] : false;
                        this.parsed.order =
                          this.view in variable.views ? variable.views[this.view].order[d][this.parsed.time] : false;
                        if (this.header.length < 2 || d !== this.header[1].dataset || vn !== this.header[1].variable) {
                          this.table.destroy();
                          $(this.e).empty();
                          this.header = [{title: 'Name', data: 'entity.features.name', type: 'string'}];
                          if (-1 !== this.parsed.time_range[0]) {
                            for (let n = this.parsed.time_range[2]; n--; ) {
                              this.header[n + 1] = {
                                dataset: d,
                                variable: vn,
                                type: 'string' === variable.type ? 'string' : 'num',
                                title: this.variable_header
                                  ? this.options.variables.title || site.data.format_label(vn)
                                  : times.value[n + this.parsed.time_range[0]] + '',
                                data: site.data.get_value,
                                render: DataHandler.retrievers.row_time.bind({
                                  i: n,
                                  o: this.parsed.time_range[0],
                                  format_value: site.data.format_value.bind(site.data),
                                }),
                              };
                            }
                          } else this.state = '';
                          this.options.order[0][0] = this.header.length - 1;
                          this.options.columns = this.header;
                          this.table = $(this.e).DataTable(this.options);
                        }
                        const n = this.header.length,
                          ns = this.parsed.summary.n;
                        let reset;
                        for (let i = 1, show = false, nshowing = 0; i < n; i++) {
                          show = v.times[i - 1 + this.parsed.time_range[0]] && (site.settings.show_empty_times || ns[i - 1]);
                          this.table.column(i).visible(show, false);
                          if (show) {
                            this.parsed.time_index[times.value[i - 1 + this.parsed.time_range[0]]] = ++nshowing;
                            reset = false;
                          }
                        }
                        if (reset) this.state = '';
                      }
                      if (this.options.wide) {
                        Object.keys(v.selection.all).forEach(k => {
                          if (vn) {
                            if (vn in v.selection.all[k].views[this.view].summary) {
                              this.rows[k] = this.table.row.add({
                                dataset: d,
                                variable: vn,
                                offset: this.parsed.time_range[0],
                                entity: v.selection.all[k],
                                int:
                                  d in site.data.variables[vn].info && 'integer' === site.data.variables[vn].info[d].type,
                              });
                              this.rowIds[this.rows[k].selector.rows] = k;
                            }
                          } else {
                            for (let i = times.n; i--; ) {
                              this.rows[k] = this.table.row.add({
                                time: i,
                                entity: v.selection.all[k],
                              });
                              this.rowIds[this.rows[k].selector.rows] = k;
                            }
                          }
                        });
                      } else {
                        if (this.filters)
                          Object.keys(this.filters).forEach(f => {
                            this.current_filter[c] = valueOf(f);
                          });
                        const va = [];
                        let varstate = '' + this.parsed.dataset + v.get.ids(true) + v.get.features() + site.settings.digits;
                        for (let i = this.options.variables.length; i--; ) {
                          vn = this.options.variables[i].name || this.options.variables[i];
                          pass = !this.filters;
                          const variable = await site.data.get_variable(vn, this.view);
                          if (vn in site.data.variables && 'meta' in variable) {
                            if (this.options.filters) {
                              for (const c in this.current_filter)
                                if (c in variable.meta) {
                                  pass = variable.meta[c] === this.current_filter[c];
                                  if (!pass) break
                                }
                            } else pass = true;
                          }
                          if (pass) {
                            varstate += vn;
                            va.push({
                              variable: vn,
                              int: patterns.int_types.test(site.data.variables[vn].type),
                              time_range: variable.time_range[d],
                              renderer: function (o, s) {
                                const k = s.features.id,
                                  r = this.time_range,
                                  n = r[1];
                                for (let i = r[0]; i <= n; i++) {
                                  o.rows[k] = o.table.row.add({
                                    offset: this.time_range[0],
                                    time: i - this.time_range[0],
                                    dataset: d,
                                    variable: this.variable,
                                    entity: s,
                                    int: this.int,
                                  });
                                  o.rowIds[o.rows[k].selector.rows] = k;
                                }
                              },
                            });
                          }
                        }
                        if (varstate === this.varstate) return void 0
                        this.varstate = varstate;
                        Object.keys(v.selection.all).forEach(k => {
                          const e = v.selection.all[k];
                          if (this.options.single_variable) {
                            if (vn in e[v].summary && variable.code in e.data) {
                              this.rows[k] = this.table.row.add({
                                offset: this.parsed.time_range[0],
                                dataset: d,
                                variable: vn,
                                entity: e,
                                int: patterns.int_types.test(site.data.variables[vn].type),
                              });
                              this.rowIds[this.rows[k].selector.rows] = k;
                            }
                          } else {
                            va.forEach(v => {
                              if (site.data.variables[v.variable].code in e.data) v.renderer(this, e);
                            });
                          }
                        });
                      }
                    }
                    this.table.draw() ;
                  }
                  if (this.parsed.time > -1 && this.header.length > 1 && v.time_range.filtered_index) {
                    this.dark_highlight = site.settings.theme_dark;
                    if (this.style.sheet.rules.length) this.style.sheet.removeRule(0);
                    if (this.parsed.time_index[time])
                      this.style.sheet.insertRule(
                        '#' +
                          this.id +
                          ' td:nth-child(' +
                          (this.parsed.time_index[time] + 1) +
                          '){background-color: var(--background-highlight)}',
                        0
                      );
                    if (!update && site.settings.table_autosort) {
                      this.table.order([this.parsed.time + 1, 'dsc']).draw();
                    }
                    if (site.settings.table_autoscroll) {
                      const w = this.e.parentElement.getBoundingClientRect().width,
                        col = this.table.column(this.parsed.time + 1),
                        h = col.header().getBoundingClientRect();
                      if (h)
                        this.e.parentElement.scroll({
                          left: h.x - this.e.getBoundingClientRect().x + h.width + 16 - w,
                          behavior: site.settings.table_scroll_behavior || 'smooth',
                        });
                    }
                  }
                }
              }
            },
            mouseover: function (e) {
              if (e.target._DT_CellIndex && e.target._DT_CellIndex.row in this.rowIds) {
                const id = this.rowIds[e.target._DT_CellIndex.row],
                  row = this.rows[id].node();
                if (row) row.classList.add('highlighted');
                if (id in site.data.entities) {
                  update_subs(this.id, 'show', site.data.entities[id]);
                }
              }
            },
            mouseout: function (e) {
              if (e.target._DT_CellIndex && e.target._DT_CellIndex.row in this.rowIds) {
                const id = this.rowIds[e.target._DT_CellIndex.row],
                  row = this.rows[id].node();
                if (row) row.classList.remove('highlighted');
                if (id in site.data.entities) {
                  update_subs(this.id, 'revert', site.data.entities[id]);
                }
              }
            },
            click: function (e) {
              if (this.clickto && e.target._DT_CellIndex && e.target._DT_CellIndex.row in this.rowIds) {
                const id = this.rowIds[e.target._DT_CellIndex.row];
                if (id in site.data.entities) this.clickto.set(id);
              }
            },
          },
          table: {
            init: function (o) {
              o.click = o.e.getAttribute('data-click');
              o.features = o.options.features;
              o.parsed = {summary: {}, order: [], time: 0, color: '', dataset: defaults.dataview, time_index: {}};
              o.header = [];
              o.rows = {};
              o.parts = {
                head: document.createElement('thead'),
                body: document.createElement('tbody'),
              };
              o.parts.head.appendChild(document.createElement('tr'));
              o.e.appendChild(o.parts.head);
              o.e.appendChild(o.parts.body);
              if (o.click) o.e.classList.add('interactive');
              o.options.variable_source = o.options.variables;
              if (o.options.variables in _u) add_dependency(o.options.variables, {type: 'update', id: o.id});
              o.tab = 'tabpanel' === o.e.parentElement.getAttribute('role') ? o.e.parentElement : void 0;
              if (o.tab) {
                document.getElementById(o.e.parentElement.getAttribute('aria-labelledby')).addEventListener(
                  'click',
                  function () {
                    if (!this.e.parentElement.classList.contains('active')) {
                      setTimeout(this.update, 155);
                      setTimeout(trigger_resize, 155);
                    }
                  }.bind(o)
                );
              }
              o.e.addEventListener('mouseover', elements.table.mouseover.bind(o));
              o.e.addEventListener('mouseout', elements.table.mouseout.bind(o));
              if (o.click) {
                if (o.click in _u) o.clickto = _u[o.click];
                o.e.addEventListener('click', elements.table.click.bind(o));
              }
              o.show = function (e) {
                if (e.features) {
                  const row = this.rows[e.features.id];
                  if (row && row.parentElement) {
                    row.classList.add('highlighted');
                    if (site.settings.table_autoscroll) {
                      const h = this.e.parentElement.getBoundingClientRect().height,
                        top = row.getBoundingClientRect().y - row.parentElement.getBoundingClientRect().y;
                      this.e.parentElement.scroll({
                        top: h > this.e.scrollHeight - top ? this.e.parentElement.scrollHeight : top,
                        behavior: site.settings.table_scroll_behavior || 'smooth',
                      });
                    }
                  }
                }
              }.bind(o);
              o.revert = function (e) {
                if (e.features && e.features.id in this.rows) {
                  this.rows[e.features.id].classList.remove('highlighted');
                }
              }.bind(o);
              o.createHeader = function (v) {
                const dataset = this.parsed.dataset,
                  time = site.data.meta.times[dataset],
                  tr = this.parts.head.firstElementChild,
                  range = this.parsed.variable.time_range[dataset],
                  start = range[0],
                  end = range[1] + 1,
                  ns = this.parsed.summary.n;
                this.parsed.time_index = {};
                tr.innerHTML = '';
                tr.appendChild(document.createElement('th'));
                tr.lastElementChild.appendChild(document.createElement('span'));
                tr.firstElementChild.lastElementChild.innerText = 'Name';
                for (let i = start, nshowing = 0; i < end; i++) {
                  if (v.times[i] && (site.settings.show_empty_times || ns[i - start])) {
                    this.parsed.time_index[time.value[i]] = nshowing++;
                    tr.appendChild(document.createElement('th'));
                    tr.lastElementChild.appendChild(document.createElement('span'));
                    tr.lastElementChild.lastElementChild.innerText = time.value[i];
                  }
                }
              }.bind(o);
              o.appendRows = function (v) {
                const es = this.parsed.order,
                  variable = this.parsed.variable,
                  times = site.data.meta.times[this.parsed.dataset].value,
                  range = variable.time_range[this.parsed.dataset],
                  start = range[0],
                  dn = range[1] - start + 1,
                  selection = v.selection.all;
                this.current_variable = variable.code + this.parsed.dataset;
                this.parts.body.innerHTML = '';
                for (let n = es.length; n--; ) {
                  const id = es[n][0];
                  if (id in selection) {
                    const e = site.data.entities[id],
                      d = e.data[variable.code],
                      tr = document.createElement('tr');
                    this.rows[id] = tr;
                    tr.setAttribute('data-entityId', id);
                    let td = document.createElement('td');
                    td.innerText = e.features.name;
                    tr.appendChild(td);
                    if (1 === dn) {
                      tr.appendChild((td = document.createElement('td')));
                      td.innerText = site.data.format_value(d);
                      td.setAttribute('data-entityId', id);
                      td.classList.add('highlighted');
                    } else {
                      for (let i = 0; i < dn; i++) {
                        if (v.times[i + start] && times[i + start] in this.parsed.time_index) {
                          tr.appendChild((td = document.createElement('td')));
                          td.innerText = site.data.format_value(d[i]);
                          if (i === this.parsed.time) td.classList.add('highlighted');
                        }
                      }
                    }
                    this.parts.body.appendChild(tr);
                  }
                }
                if (
                  site.settings.table_autoscroll &&
                  this.parts.head.firstElementChild.childElementCount > 2 &&
                  this.parts.head.firstElementChild.childElementCount > this.parsed.time + 1
                ) {
                  const w = this.e.parentElement.getBoundingClientRect().width,
                    col = this.parts.head.firstElementChild.children[this.parsed.time + 1].getBoundingClientRect();
                  this.e.parentElement.scroll({
                    left: col.x - this.e.getBoundingClientRect().x + col.width + 16 - w,
                    behavior: site.settings.table_scroll_behavior || 'smooth',
                  });
                }
              }.bind(o);
              if (o.view) {
                add_dependency(o.view, {type: 'update', id: o.id});
                add_dependency(o.view + '_filter', {type: 'update', id: o.id});
                add_dependency(_u[o.view].time_agg, {type: 'update', id: o.id});
              } else o.view = defaults.dataview;
              o.update();
            },
            update: async function (pass) {
              if (this.queue > 0) clearTimeout(this.queue);
              this.queue = -1;
              if (!pass) {
                if (!this.tab || this.tab.classList.contains('show')) this.queue = setTimeout(() => this.update(true), 50);
              } else {
                let vn =
                  this.options.variable_source && valueOf(this.options.variable_source).replace(patterns.all_periods, '\\.');
                const v = _u[this.view],
                  d = v.get.dataset(),
                  time = valueOf(v.time_agg),
                  state =
                    d + v.value() + v.get.time_filters() + site.settings.digits + vn + time + site.settings.show_empty_times;
                if (!site.data.inited[d]) return void 0
                if (state !== this.state) {
                  this.state = state;
                  Object.keys(this.reference_options).forEach(k => (this.options[k] = valueOf(this.reference_options[k])));
                  const variable = await site.data.get_variable(vn, this.view);
                  this.parsed.dataset = d;
                  this.parsed.color = vn;
                  this.parsed.variable = variable;
                  this.parsed.time_range = variable.time_range[d];
                  this.parsed.time =
                    ('number' === typeof time ? time - site.data.meta.times[d].range[0] : 0) - this.parsed.time_range[0];
                  this.parsed.summary = variable.views[this.view].summaries[d];
                  this.parsed.order = variable.views[this.view].order[d][this.parsed.time];
                  this.createHeader(v);
                  this.appendRows(v);
                }
              }
            },
            mouseover: function (e) {
              const row = 'TD' === e.target.tagName ? e.target.parentElement : e.target,
                id = row.getAttribute('data-entityId');
              if (id) {
                row.classList.add('highlighted');
                update_subs(this.id, 'show', site.data.entities[id]);
              }
            },
            mouseout: function (e) {
              const row = 'TD' === e.target.tagName ? e.target.parentElement : e.target,
                id = row.getAttribute('data-entityId');
              if (id) {
                row.classList.remove('highlighted');
                update_subs(this.id, 'revert', site.data.entities[id]);
              }
            },
            click: function (e) {
              const row = 'TD' === e.target.tagName ? e.target.parentElement : e.target,
                id = row.getAttribute('data-entityId');
              if (this.clickto && id) this.clickto.set(id);
            },
          },
          legend: {
            init: function (o) {
              add_dependency(o.view, {type: 'update', id: o.id});
              const view = _u[o.view];
              if (view.time_agg in _u) add_dependency(view.time_agg, {type: 'update', id: o.id});
              if (!o.palette) {
                if (view.palette) {
                  o.palette = view.palette;
                  if (view.palette in _u) add_dependency(view.palette, {type: 'update', id: o.id});
                } else {
                  o.palette = 'settings.palette' in _u ? 'settings.palette' : site.settings.palette;
                }
              }
              o.variable = o.e.getAttribute('data-variable');
              if (o.variable) {
                if (o.variable in _u) add_dependency(o.variable, {type: 'update', id: o.id});
              } else if (view.y in _u) add_dependency(view.y, {type: 'update', id: o.id});
              if (o.palette in _u) {
                const palette = _u[o.palette];
                if (palette.e) {
                  palette.e.addEventListener('change', o.update);
                }
              }
              o.parsed = {summary: {}, order: [], selection: {}, time: 0, color: '', rank: false};
              o.state = '';
              o.queue = {
                lock: false,
                cooldown: -1,
                trigger: function () {
                  this.mouseover(this.queue.e);
                }.bind(o),
              };
              o.queue.reset = function () {
                this.lock = false;
              }.bind(o.queue);
              o.parts = {
                ticks: o.e.querySelector('.legend-ticks'),
                scale: o.e.querySelector('.legend-scale'),
                summary: o.e.querySelector('.legend-summary'),
              };
              o.parts.ticks.setAttribute('data-of', o.id);
              o.parts.scale.setAttribute('data-of', o.id);
              o.parts.summary.setAttribute('data-of', o.id);
              o.mouseover = elements.legend.mouseover.bind(o);
              o.e.addEventListener('mousemove', o.mouseover);
              o.e.addEventListener('mouseout', elements.legend.mouseout.bind(o));
              o.e.addEventListener('click', elements.legend.click.bind(o));
              o.click = o.e.getAttribute('data-click');
              if (o.click in _u) o.clickto = _u[o.click];
              o.ticks = {
                center: o.parts.summary.appendChild(document.createElement('div')),
                min: o.parts.summary.appendChild(document.createElement('div')),
                max: o.parts.summary.appendChild(document.createElement('div')),
                entity: o.parts.ticks.appendChild(document.createElement('div')),
              };
              Object.keys(o.ticks).forEach(t => {
                o.ticks[t].setAttribute('data-of', o.id);
                o.ticks[t].className = 'legend-tick';
                o.ticks[t].appendChild((e = document.createElement('div')));
                e.setAttribute('data-of', o.id);
                e.appendChild(document.createElement('p'));
                e.lastElementChild.setAttribute('data-of', o.id);
                if ('m' !== t.substring(0, 1)) {
                  e.appendChild(document.createElement('p'));
                  e.lastElementChild.setAttribute('data-of', o.id);
                  e.appendChild(document.createElement('p'));
                  e.lastElementChild.setAttribute('data-of', o.id);
                  if ('entity' === t) {
                    o.ticks[t].firstElementChild.lastElementChild.classList.add('entity');
                  } else {
                    o.ticks[t].firstElementChild.firstElementChild.classList.add('summary');
                  }
                }
              });
              o.ticks.entity.firstElementChild.classList.add('hidden');
              o.ticks.max.className = 'legend-tick-end max';
              o.ticks.min.className = 'legend-tick-end min';
              o.ticks.center.style.left = '50%';
              o.show = function (e, c) {
                if (e && 'parsed' in c && e.features.name) {
                  const view = _u[this.view],
                    summary = c.parsed.summary,
                    string = summary && 'string' === summary.type,
                    min = summary && !string ? summary.min[c.parsed.time] : 0,
                    range = summary ? (string ? summary.levels.length - min : summary.range[c.parsed.time]) : 1,
                    n = summary.n[c.parsed.time],
                    subset = n === view.n_selected.dataset ? 'rank' : 'subset_rank',
                    es = site.data.entities[e.features.id].views[this.view],
                    value = e.get_value(c.parsed.color, c.parsed.time),
                    p =
                      ((string ? value in summary.level_ids : 'number' === typeof value)
                        ? site.settings.color_by_order
                          ? NaN
                          : Math.max(
                              0,
                              Math.min(1, range ? ((string ? summary.level_ids[value] : value) - min) / range : 0.5)
                            )
                        : NaN) * 100,
                    container = this.ticks.entity,
                    t = container.firstElementChild.children[1];
                  if (isFinite(p)) {
                    t.parentElement.classList.remove('hidden');
                    t.innerText = site.data.format_value(value, this.integer);
                    container.style.left = p + '%';
                    container.firstElementChild.firstElementChild.innerText =
                      (p > 96 || p < 4) && e.features.name.length > 13
                        ? e.features.name.substring(0, 12) + '…'
                        : e.features.name;
                  } else if (site.settings.color_by_order && c.parsed.color in es[subset]) {
                    const i = es[subset][c.parsed.color][c.parsed.time],
                      po = n > 1 ? (i / (n - 1)) * 100 : 0;
                    container.firstElementChild.firstElementChild.innerText =
                      i > -1 && (po > 96 || po < 4) && e.features.name.length > 13
                        ? e.features.name.substring(0, 12) + '…'
                        : e.features.name;
                    if (i > -1) {
                      t.parentElement.classList.remove('hidden');
                      t.innerText = '# ' + (n - i);
                      container.style.left = po + '%';
                    }
                  }
                  container.style.marginLeft = -container.getBoundingClientRect().width / 2 + 'px';
                }
              };
              o.revert = function () {
                this.ticks.entity.firstElementChild.classList.add('hidden');
              };
              o.update();
            },
            update: async function () {
              const view = _u[this.view],
                variable = valueOf(this.variable || view.y),
                d = view.get.dataset(),
                var_info = await site.data.get_variable(variable, this.view),
                time = valueOf(view.time_agg);
              if (null !== time && view.valid && var_info && this.view in var_info.views) {
                const y =
                    ('number' === typeof time ? time - site.data.meta.times[d].range[0] : 0) - var_info.time_range[d][0],
                  summary = var_info.views[this.view].summaries[d],
                  ep = valueOf(this.palette).toLowerCase(),
                  pn = ep in palettes ? ep : site.settings.palette in palettes ? site.settings.palette : defaults.palette,
                  p = palettes[pn].colors,
                  s = this.parts.scale,
                  ticks = this.ticks;
                this.parsed.summary = summary;
                this.parsed.order = var_info.views[this.view].order[d][y];
                this.parsed.time = y;
                this.parsed.color = variable;
                if (summary && y < summary.n.length) {
                  this.integer = d in var_info.info && 'integer' === var_info.info[d].type;
                  const refresh = site.settings.color_by_order !== this.parsed.rank,
                    bins = s.querySelectorAll('span'),
                    odd = palettes[pn].odd,
                    remake =
                      'discrete' === palettes[pn].type
                        ? p.length !== bins.length - odd
                        : !s.firstElementChild || 'SPAN' !== s.firstElementChild.tagName;
                  if (pn + site.settings.color_scale_center !== this.current_palette || refresh) {
                    this.current_palette = pn + site.settings.color_scale_center;
                    this.parsed.rank = site.settings.color_by_order;
                    if (remake) s.innerHTML = '';
                    if ('discrete' === palettes[pn].type) {
                      let i = 0,
                        n = Math.ceil(p.length / 2),
                        e;
                      if (remake) {
                        s.appendChild((e = document.createElement('div')));
                        e.dataset.of = this.id;
                        e.style.left = 0;
                        const prop = (1 / (n - odd / 2)) * 100 + '%';
                        for (; i < n; i++) {
                          e.appendChild(document.createElement('span'));
                          e.lastElementChild.dataset.of = this.id;
                          e.lastElementChild.style.backgroundColor = p[i];
                          e.lastElementChild.style.width = prop;
                        }
                        if (odd) e.lastElementChild.style.width = ((1 / (n - odd / 2)) * 100) / 2 + '%';
                        s.appendChild((e = document.createElement('div')));
                        e.dataset.of = this.id;
                        e.style.right = 0;
                        for (i = Math.floor(p.length / 2), n = p.length; i < n; i++) {
                          e.appendChild(document.createElement('span'));
                          e.lastElementChild.dataset.of = this.id;
                          e.lastElementChild.style.backgroundColor = p[i];
                          e.lastElementChild.style.width = prop;
                        }
                        if (odd) e.firstElementChild.style.width = ((1 / (n - odd / 2)) * 100) / 2 + '%';
                      } else {
                        for (; i < n; i++) {
                          bins[i].style.backgroundColor = p[i];
                        }
                        for (i = Math.floor(p.length / 2), n = p.length; i < n; i++) {
                          bins[i + odd].style.backgroundColor = p[i];
                        }
                      }
                    } else {
                      if (remake) {
                        s.appendChild(document.createElement('span'));
                        s.appendChild(document.createElement('span'));
                      }
                      s.firstElementChild.style.background =
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
                        '))';
                      s.lastElementChild.style.background =
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
                        '))';
                    }
                  }
                  if ('string' === var_info.type) {
                    ticks.center.classList.remove('hidden');
                    ticks.min.firstElementChild.firstElementChild.innerText = var_info.levels[0];
                    ticks.max.firstElementChild.firstElementChild.innerText = var_info.levels[var_info.levels.length - 1];
                  } else if (site.settings.color_by_order) {
                    ticks.center.classList.add('hidden');
                    ticks.min.firstElementChild.firstElementChild.innerText = '# ' + (summary.n[y] ? summary.n[y] : 0);
                    ticks.max.firstElementChild.firstElementChild.innerText = '# ' + (summary.n[y] ? 1 : 0);
                  } else {
                    const state =
                      '' +
                      summary.n[y] +
                      summary.min[y] +
                      summary.max[y] +
                      site.settings.digits +
                      site.settings.color_scale_center +
                      site.settings.summary_selection;
                    if (remake || refresh || state !== this.state) {
                      this.state = state;
                      ticks.center.classList.remove('hidden');
                      ticks.min.firstElementChild.firstElementChild.innerText = summary.n[y]
                        ? isFinite(summary.min[y])
                          ? site.data.format_value(summary.min[y], this.integer)
                          : NaN
                        : NaN;
                      ticks.max.firstElementChild.firstElementChild.innerText = summary.n[y]
                        ? isFinite(summary.max[y])
                          ? site.data.format_value(summary.max[y], this.integer)
                          : NaN
                        : NaN;
                      if ('none' === site.settings.color_scale_center) {
                        ticks.center.firstElementChild.lastElementChild.innerText =
                          summary_levels[site.settings.summary_selection] + ' median';
                        ticks.center.firstElementChild.children[1].innerText = site.data.format_value(summary.median[y]);
                        ticks.center.style.left = summary.norm_median[y] * 100 + '%';
                      } else {
                        ticks.center.firstElementChild.lastElementChild.innerText =
                          summary_levels[site.settings.summary_selection] + ' ' + site.settings.color_scale_center;
                        ticks.center.firstElementChild.children[1].innerText = site.data.format_value(
                          summary[site.settings.color_scale_center][y]
                        );
                        ticks.center.style.left = summary['norm_' + site.settings.color_scale_center][y] * 100 + '%';
                      }
                      ticks.center.style.marginLeft = -ticks.center.getBoundingClientRect().width / 2 + 'px';
                    }
                  }
                  if (site.settings.color_by_order || 'none' === site.settings.color_scale_center) {
                    s.firstElementChild.style.width = '50%';
                    s.lastElementChild.style.width = '50%';
                  } else {
                    s.firstElementChild.style.width = summary['norm_' + site.settings.color_scale_center][y] * 100 + '%';
                    s.lastElementChild.style.width =
                      100 - summary['norm_' + site.settings.color_scale_center][y] * 100 + '%';
                  }
                }
              }
            },
            mouseover: function (e) {
              if (!this.queue.lock) {
                this.queue.lock = true;
                const s = this.parts.scale.getBoundingClientRect(),
                  p = (Math.max(s.x, Math.min(s.x + s.width, e.clientX)) - s.x) / s.width;
                let entity = false;
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
                      ];
                } else if ('min' in this.parsed.summary) {
                  const min = this.parsed.summary.min[this.parsed.time],
                    max = this.parsed.summary.max[this.parsed.time],
                    tv = min + p * (max - min);
                  let i, n;
                  if (this.parsed.order && this.parsed.order.length) {
                    n = this.parsed.summary.missing[this.parsed.time];
                    if (n < this.parsed.order.length) {
                      if (1 === this.parsed.order.length || !p) {
                        entity = site.data.entities[this.parsed.order[n][0]];
                      } else {
                        for (i = this.parsed.order.length - 2; i >= n; --i) {
                          if ((this.parsed.order[i][1] + this.parsed.order[i + 1][1]) / 2 <= tv) break
                        }
                        i++;
                        entity = site.data.entities[this.parsed.order[i][0]];
                      }
                    }
                  }
                }
                if (entity) {
                  this.show(entity, this);
                  if (!this.entity || entity.features.id !== this.entity.features.id) {
                    if (!this.entity) {
                      this.entity = entity;
                    } else update_subs(this.id, 'revert', this.entity);
                    update_subs(this.id, 'show', entity);
                    this.entity = entity;
                  }
                }
                setTimeout(this.queue.reset, 200);
              } else {
                if (this.queue.cooldown > 0) clearTimeout(this.queue.cooldown);
                this.queue.e = e;
                this.queue.cooldown = setTimeout(this.queue.trigger, 100);
              }
            },
            mouseout: function (e) {
              if (e.relatedTarget && this.id !== e.relatedTarget.getAttribute('data-of')) {
                if (this.queue.cooldown > 0) clearTimeout(this.queue.cooldown);
                this.queue.cooldown = -1;
                this.revert();
                if (this.entity) {
                  update_subs(this.id, 'revert', this.entity);
                  this.entity = false;
                }
              }
            },
            click: function () {
              if (this.clickto && this.entity) {
                this.revert();
                this.clickto.set(this.entity.features.id);
              }
            },
          },
          credits: {
            init: function (o) {
              const s = site.credit_output && site.credit_output[o.id];
              o.exclude = (s && s.exclude) || [];
              o.add = (s && s.add) || {};
              o.e.appendChild(document.createElement('ul'));
              o.credits = {...site.credits, ...o.add};
              Object.keys(o.credits).forEach(k => {
                if (-1 === o.exclude.indexOf(k)) {
                  const c = o.credits[k];
                  let e;
                  o.e.lastElementChild.appendChild((e = document.createElement('li')));
                  if ('url' in c) {
                    e.appendChild((e = document.createElement('a')));
                    e.href = c.url;
                    e.target = '_blank';
                    e.rel = 'noreferrer';
                  }
                  e.innerText = c.name;
                  if ('version' in c) {
                    e.appendChild(document.createElement('span'));
                    e.lastElementChild.className = 'version-tag';
                    e.lastElementChild.innerText = c.version;
                  }
                  if ('description' in c) {
                    e.parentElement.appendChild(document.createElement('p'));
                    e.parentElement.lastElementChild.innerText = c.description;
                  }
                }
              });
            },
          },
          init_input: function (e) {
            const o = {
              type: e.getAttribute('data-autoType'),
              source: void 0,
              value: function () {
                const v = valueOf(this.source);
                return 'undefined' === typeof v ? valueOf(this.default) : v
              },
              default: e.getAttribute('data-default'),
              optionSource: e.getAttribute('data-optionSource'),
              depends: e.getAttribute('data-depends'),
              variable: e.getAttribute('data-variable'),
              dataset: e.getAttribute('data-dataset'),
              view: e.getAttribute('data-view'),
              id: e.id || e.optionSource || 'ui' + page.elementCount++,
              note: e.getAttribute('aria-description') || '',
              current_index: -1,
              previous: '',
              e: e,
              values: [],
              display: [],
              data: [],
              input: true,
            };
            o.settings = o.type in site && o.id in site[o.type] ? site[o.type][o.id] : {};
            o.wrapper = o.e.parentElement.classList.contains('wrapper')
              ? o.e.parentElement
              : o.e.parentElement.parentElement;
            if (o.wrapper) {
              if (o.note) o.wrapper.classList.add('has-note');
              o.wrapper.setAttribute('data-of', o.id)
              ;['div', 'span', 'label', 'fieldset', 'legend', 'input', 'button'].forEach(type => {
                const c = o.wrapper.querySelectorAll(type);
                if (c.length) c.forEach(ci => ci.setAttribute('data-of', o.id));
              });
            }
            if (o.note) {
              o.wrapper.addEventListener('mouseover', tooltip_trigger.bind(o));
              const p = 'DIV' !== o.e.tagName ? o.e : o.e.querySelector('input');
              if (p) {
                p.addEventListener('focus', tooltip_trigger.bind(o));
                p.addEventListener('blur', tooltip_clear);
              }
            }
            if (patterns.number.test(o.default)) o.default = Number(o.default);
            if (o.type in elements) {
              const p = elements[o.type];
              if (p.setter) {
                o.set = p.setter.bind(o);
                o.reset = function () {
                  this.set(valueOf(this.default));
                }.bind(o);
              }
              if (p.retrieve) o.get = p.retrieve.bind(o);
              if (p.adder) o.add = p.adder.bind(o);
              if (p.listener) o.listen = p.listener.bind(o);
              if (p.init) p.init(o);
              if (!o.options) o.options = o.e.querySelectorAll('select' === o.type ? 'option' : 'input');
              if (o.optionSource && patterns.ids.test(o.optionSource)) {
                o.loader = function () {
                  if (!this.e.classList.contains('locked')) {
                    this.deferred = false;
                    this.e.removeEventListener('click', this.loader);
                    request_queue(this.id);
                  }
                }.bind(o);
                o.e.addEventListener('click', o.loader);
                o.deferred = true;
              } else if (
                'number' === typeof o.default &&
                o.default > -1 &&
                o.options &&
                o.options.length &&
                o.default < o.options.length
              )
                o.default = o.options[o.default].value || o.options[o.default].dataset.value;
              _u[o.id] = o;
            }
          },
          init_output: function (e, i) {
            const o = {
              type: e.getAttribute('data-autoType'),
              view: e.getAttribute('data-view') || defaults.dataview,
              id: e.id || 'out' + i,
              note: e.getAttribute('aria-description') || '',
              reference_options: {},
              e: e,
            };
            if (o.note) o.e.addEventListener('mouseover', tooltip_trigger.bind(o));
            o.options = o.type in site ? site[o.type][o.id] : void 0;
            if (o.options && o.options.dataview) o.view = o.options.dataview;
            if (o.type in elements && 'update' in elements[o.type]) o.update = elements[o.type].update.bind(o);
            if (o.options) {
              if ('options' in o.options) o.options = o.options.options;
              Object.keys(o.options).forEach(k => {
                if (o.options[k] in _u) o.reference_options[k] = o.options[k];
              });
              if ('subto' in o.options) {
                if ('string' === typeof o.options.subto) o.options.subto = [o.options.subto];
                if (Array.isArray(o.options.subto)) o.options.subto.forEach(v => add_subs(v, o));
              }
            }
            _u[o.id] = o;
            if (o.type in elements && 'init' in elements[o.type]) {
              if (!o.view || _u[o.view].parsed.dataset in site.data.inited) {
                elements[o.type].init(o);
              } else {
                site.data.data_queue[_u[o.view].parsed.dataset][o.id] = elements[o.type].init.bind(null, o);
              }
            }
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
            const s = JSON.parse(this.perm.getItem(this.name)) || {};
            s[opt] = value;
            this.perm.setItem(this.name, JSON.stringify(s));
          },
          get: function (opt) {
            const s = JSON.parse(this.perm.getItem(this.name));
            return s ? (opt ? s[opt] : s) : undefined
          },
        },
        keymap = {
          Enter: 'select',
          NumpadEnter: 'select',
          ArrowUp: 'move',
          Home: 'move',
          ArrowDown: 'move',
          End: 'move',
          Escape: 'close',
          Tab: 'close',
        },
        filter_components = {
          Time: ['first', 'selected', 'last'],
          summary: ['missing', 'min', 'q1', 'mean', 'median', 'q3', 'max'],
        },
        time_funs = {
          number: function (v) {
            return this - v.range[0]
          },
          first: function (v) {
            return 0
          },
          selected: function (v, p) {
            return p.time_agg - v.range[0]
          },
          last: function (v) {
            return v.range[1] - v.range[0]
          },
        },
        page = {
          load_screen: document.getElementById('load_screen'),
          wrap: document.getElementById('site_wrap'),
          navbar: document.querySelector('.navbar'),
          content: document.querySelector('.content'),
          overlay: document.createElement('div'),
          menus: document.getElementsByClassName('menu-wrapper'),
          panels: document.getElementsByClassName('panel'),
          elementCount: 0,
        },
        queue = {_timeout: 0},
        meta = {
          retain_state: true,
        },
        subs = {},
        rule_conditions = {},
        keys = {},
        _u = {
          _entity_filter: {
            id: '_entity_filter',
            registered: {},
            entities: new Map(),
            selected: [],
            select_ids: {},
            value: function (q, agg) {
              return Object.keys(this.select_ids).join(',')
            },
          },
          _base_filter: {
            id: '_base_filter',
            c: new Map(),
            value: function (q, agg) {
              const as_state = !q;
              if (as_state) q = [];
              _u._base_filter.c.forEach(f => {
                const component =
                  'selected' === f.component
                    ? site.data.meta.overall.value['undefined' === typeof agg ? _u[defaults.dataview].parsed.time_agg : agg]
                    : f.time_component
                    ? site.data.meta.overall.value[f.component]
                    : f.component;
                if (f.value) q.push(f.variable + '[' + component + ']' + f.operator + f.value + (as_state ? f.active : ''));
              });
              return q.join('&')
            },
          },
        },
        _c = {},
        tree = {};

      page.overlay.className = 'content-overlay';
      document.body.appendChild(page.overlay);
      document.body.className = storage.get('theme_dark') || site.settings.theme_dark ? 'dark-theme' : 'light-theme';
      if (page.content) {
        let i = page.menus.length,
          h = page.navbar ? page.navbar.getBoundingClientRect().height : 0;
        for (; i--; )
          if (page.menus[i].classList.contains('menu-top')) {
            h = page.menus[i].getBoundingClientRect().height;
            break
          }
        page.content.style.top = h + 'px';
      }
      if (!window.dataLayer) window.dataLayer = [];

      function pal(value, which, summary, index, rank, total) {
        if (isNaN(value)) return defaults.missing
        const centered = 'none' !== site.settings.color_scale_center && !site.settings.color_by_order,
          fixed = 'discrete' === palettes[which].type,
          colors = palettes[which].colors,
          odd = palettes[which].odd,
          string = 'string' === summary.type,
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
            ? 0.5
            : summary['norm_' + center_source][index],
          r = fixed
            ? centered && !site.settings.color_by_order
              ? Math.ceil(colors.length / 2) - odd / 2
              : colors.length
            : 1,
          p = site.settings.color_by_order
            ? rank / total
            : range
            ? ((string ? summary.level_ids[value] : value) - min) / range
            : 0.5,
          upper = p > (centered ? center : 0.5);
        let v = centered
          ? range
            ? upper
              ? (p - center - summary['upper_' + center_source + '_min'][index]) /
                summary['upper_' + center_source + '_range'][index]
              : (p + center - summary['lower_' + center_source + '_min'][index]) /
                summary['lower_' + center_source + '_range'][index]
            : 1
          : p;
        if (!fixed) {
          v = Math.max(0, Math.min(1, v));
          if (upper) v = 1 - v;
          if (!centered) v *= 2;
        }
        return (string ? value in summary.level_ids : 'number' === typeof value)
          ? fixed
            ? colors[Math.max(0, Math.min(colors.length - 1, Math.floor(centered ? (upper ? r + r * v : r * v) : r * v)))]
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
        if (!('button' in text)) text.button = {};
        if ('string' === typeof text.text) text.text = [text.text];
        text.parts = document.createElement('span');
        text.text.forEach(k => {
          if (k in text.button) {
            const p = text.button[k];
            text.parts.appendChild(document.createElement('button'));
            text.parts.lastElementChild.type = 'button';
            p.trigger = tooltip_trigger.bind({id: o.id + p.text, note: p.target, wrapper: text.parts.lastElementChild});
            if ('note' === p.type) {
              text.parts.lastElementChild.setAttribute('aria-description', p.target);
              text.parts.lastElementChild.setAttribute('data-of', o.id + p.text);
              text.parts.lastElementChild.className = 'has-note';
              text.parts.lastElementChild.addEventListener('mouseover', p.trigger);
              text.parts.lastElementChild.addEventListener('focus', p.trigger);
              text.parts.lastElementChild.addEventListener('blur', tooltip_clear);
            } else {
              text.parts.lastElementChild.className = 'btn btn-link';
              if (!Array.isArray(p.target)) p.target = [p.target];
              const m = new Map();
              p.target.forEach(t => {
                const u = _u[t];
                if (u && 'function' === typeof u[p.type]) m.set(t, u[p.type]);
              });
              if (m.size) {
                text.parts.lastElementChild.setAttribute('aria-label', p.text.join(''));
                text.parts.lastElementChild.addEventListener(
                  'click',
                  function () {
                    this.forEach(f => f());
                  }.bind(m)
                );
              }
            }
          } else {
            text.parts.appendChild(document.createElement('span'));
          }
          if (k in _u) o.depends.set(k, {id: k, u: _u[k], parsed: ''});
        });
        if ('condition' in text) {
          for (let i = text.condition.length; i--; ) {
            const c = text.condition[i];
            if (c.id) {
              if ('default' === c.id) {
                c.check = function () {
                  return true
                };
              } else {
                o.depends.set(c.id, c);
                c.check = function () {
                  return 'default' === this.id || DataHandler.checks[this.type](valueOf(this.id), valueOf(this.value))
                }.bind(c);
              }
            }
          }
        }
      }

      function fill_ids_options(u, d, out, onend) {
        if (!(d in site.data.sets)) {
          site.data.data_queue[d][u.id] = function () {
            u.e.removeEventListener('click', u.loader);
            fill_ids_options(u, d, out, onend);
            u.set_current();
            u.current_set = d;
            return
          };
          return
        }
        out[d] = {options: [], values: {}, display: {}};
        const current = u.values,
          s = out[d].options,
          values = out[d].values,
          disp = out[d].display,
          combobox = 'combobox' === u.type;
        let ck = !u.sensitive && !!u.current_set,
          n = 0;
        if (u.settings.group) {
          out[d].groups = {e: [], by_name: {}};
          if (combobox && u.settings.accordion) {
            u.listbox.classList.add('accordion');
            u.listbox.id = u.id + '-listbox';
          }
        }
        const ugroup = out[d].groups;
        Object.keys(site.data.entities).forEach(k => {
          const entity = site.data.entities[k];
          if (d === entity.group) {
            if (ck && !(k in current)) {
              u.sensitive = true;
              ck = false;
            }
            if (ugroup) {
              let groups = entity.features[u.settings.group] || ['No Group'];
              if (!Array.isArray(groups)) groups = [groups];
              for (let g = groups.length; g--; ) {
                const group = groups[g];
                if (!(group in ugroup.by_name)) {
                  const e = document.createElement(combobox ? 'div' : 'optgroup');
                  if (combobox) {
                    const id = u.id + '_' + group.replace(patterns.seps, '-');
                    let ee;
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
                    } else {
                      e.className = 'combobox-group combobox-component';
                      e.id = id;
                      e.role = 'group';
                      e.appendChild((ee = document.createElement('div')));
                      ee.appendChild((ee = document.createElement('label')));
                      ee.for = id;
                      ee.innerText = group;
                      ee.id = id + '-label';
                      ee.for = id;
                      ee.className = 'combobox-group-label combobox-component';
                    }
                  } else {
                    e.label = group;
                  }
                  ugroup.by_name[group] = e;
                  ugroup.e.push(e);
                }
                const o = u.add(k, entity.features.name, true);
                o.setAttribute('data-group', group);
                if (combobox && u.settings.accordion) {
                  ugroup.by_name[group].lastElementChild.lastElementChild.appendChild(o);
                } else {
                  ugroup.by_name[group].appendChild(o);
                }
              }
            } else {
              s.push(u.add(k, entity.features.name));
              values[k] = n;
              disp[entity.features.name] = n++;
            }
          }
        });
        if (u.settings.group) {
          n = 0;
          Object.keys(ugroup.by_name).forEach(g => {
            ugroup.by_name[g].querySelectorAll(combobox ? '.combobox-option' : 'option').forEach(c => {
              s.push(c);
              values[combobox ? c.dataset.value : c.value] = n;
              disp[c.innerText] = n++;
            });
          });
        }
        onend && onend();
      }

      function fill_variables_options(u, d, out) {
        out[d] = {options: [], values: {}, display: {}};
        const current = u.values,
          s = out[d].options,
          values = out[d].values,
          disp = out[d].display,
          combobox = 'combobox' === u.type;
        let ck = !u.sensitive && !!u.current_set,
          n = 0;
        if (u.settings.group) {
          out[d].groups = {e: [], by_name: {}};
          if (combobox && u.settings.accordion) {
            u.listbox.classList.add('accordion');
            u.listbox.id = u.id + '-listbox';
          }
        }
        const url_set = site.url_options[u.id],
          ugroup = out[d].groups;
        let ck_suffix = false;
        if (url_set && !(url_set in site.data.variables)) {
          site.url_options[u.id] = url_set.replace(patterns.pre_colon, '');
          if (!(site.url_options[u.id] in site.data.variables)) ck_suffix = true;
        }
        site.data.info[d].schema.fields.forEach(m => {
          const v = site.data.variables[m.name];
          if (v && !v.is_time) {
            const l = site.data.format_label(m.name);
            if (ck && !(m.name in current)) {
              u.sensitive = true;
              ck = false;
            }
            if (ugroup) {
              let groups = (m.info && m.info[u.settings.group]) || ['No Group'];
              if (!Array.isArray(groups)) groups = [groups];
              for (let g = groups.length; g--; ) {
                const group = groups[g];
                if (!(group in ugroup.by_name)) {
                  const e = document.createElement(combobox ? 'div' : 'optgroup');
                  if (combobox) {
                    const id = u.id + '_' + group.replace(patterns.seps, '-');
                    let ee;
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
                    } else {
                      e.className = 'combobox-group combobox-component';
                      e.role = 'group';
                      e.appendChild((ee = document.createElement('div')));
                      ee.appendChild((ee = document.createElement('label')));
                      ee.for = id;
                      ee.innerText = group;
                      ee.id = id;
                      ee.className = 'combobox-group-label combobox-component';
                    }
                  } else {
                    e.label = group;
                  }
                  ugroup.by_name[group] = e;
                  ugroup.e.push(e);
                }
                const o = u.add(m.name, l, true, m);
                o.setAttribute('data-group', group);
                if (combobox && u.settings.accordion) {
                  ugroup.by_name[group].lastElementChild.lastElementChild.appendChild(o);
                } else {
                  ugroup.by_name[group].appendChild(o);
                }
              }
            } else {
              s.push(u.add(m.name, l, true, m));
              s[n].id = u.id + '-option' + n;
              values[m.name] = n;
              disp[l] = n++;
            }
            if (ck_suffix && url_set === m.name.replace(patterns.pre_colon, '')) {
              site.url_options[u.id] = m.name;
              ck_suffix = false;
            }
          }
        });
        if (u.settings.group) {
          n = 0;
          Object.keys(ugroup.by_name).forEach(g => {
            ugroup.by_name[g].querySelectorAll(combobox ? '.combobox-option' : 'option').forEach(c => {
              s.push(c);
              s[n].id = u.id + '-option' + n;
              values[combobox ? c.dataset.value : c.value] = n;
              disp[(c.firstChild && c.firstChild.textContent) || c.innerText] = n++;
            });
          });
        }
        if (!u.settings.clearable && !(u.default in site.data.variables)) u.default = defaults.variable;
      }

      function fill_overlay_properties_options(u, source, out) {
        out[source] = {options: [], values: {}, display: {}};
        const current = u.values,
          s = out[source].options,
          values = out[source].values,
          disp = out[source].display;
          'combobox' === u.type;
        let ck = !u.sensitive && !!u.current_set,
          n = 0;
        if (u.settings.group) {
          out[source].groups = {e: [], by_name: {}};
        }
        Object.keys(site.map._queue[source].property_summaries).forEach(v => {
          const l = site.data.format_label(v);
          if (ck && !(v.name in current)) {
            u.sensitive = true;
            ck = false;
          }
          s.push(u.add(v, l));
          s[n].id = u.id + '-option' + n;
          values[v] = n;
          disp[l] = n++;
        });
      }

      function fill_levels_options(u, d, v, out) {
        const m = site.data.variables[v].info[d],
          t = 'string' === m.type ? 'levels' : 'ids',
          l = m[t];
        if (l) {
          const k = d + v;
          out[k] = {options: [], values: {}, display: {}};
          const current = u.values,
            s = out[k].options,
            values = out[k].values,
            disp = out[k].display;
          let ck = !u.sensitive && !!u.current_set,
            n = 0;
          Object.keys(l).forEach(k => {
            const lk = l[k];
            if (ck && !(k in current)) {
              u.sensitive = true;
              ck = false;
            }
            s.push(u.add(lk.id, lk.name, true));
            values[lk.id] = n;
            disp[lk.name] = n++;
          });
        } else if ('ids' === t) {
          site.data.data_queue[d][u.id] = function () {
            return fill_levels_options(u, d, v, out)
          };
        }
      }

      function toggle_input(u, enable) {
        if (enable && !u.e.classList.contains('locked')) {
          u.e.removeAttribute('disabled');
          u.e.classList.remove('disabled');
          if (u.input_element) u.input_element.removeAttribute('disabled');
        } else {
          u.e.setAttribute('disabled', 'true');
          u.e.classList.add('disabled');
          if (u.input_element) u.input_element.setAttribute('disabled', 'true');
        }
      }

      function sort_tree_children(a, b) {
        return !(a.id in tree) || !(b.id in tree) ? -Infinity : tree[a.id]._n.children - tree[b.id]._n.children
      }

      function add_dependency(id, o) {
        if (!(id in _c)) _c[id] = [];
        if (!o.uid) o.uid = JSON.stringify(o);
        const c = _c[id];
        for (let i = c.length; i--; ) if (o.uid === c[i].uid) return void 0
        c.push(o);
        if (!(id in tree)) tree[id] = {_n: {children: 0, parents: 0}, children: {}, parents: {}};
        if (!(o.id in tree)) tree[o.id] = {_n: {children: 0, parents: 0}, children: {}, parents: {}};
        tree[id].children[o.id] = tree[o.id];
        tree[id]._n.children++;
        tree[o.id].parents[id] = tree[id];
        tree[o.id]._n.parents++;
        c.sort(sort_tree_children);
        request_queue(id);
      }

      function add_subs(id, o) {
        if (!(id in subs)) subs[id] = [];
        subs[id].push(o);
      }

      function update_subs(id, fun, e) {
        if (id in subs) {
          for (let i = subs[id].length; i--; ) {
            if (fun in subs[id][i]) subs[id][i][fun](e, _u[id]);
          }
        }
      }

      function update_plot_theme(u) {
        if (u.dark_theme !== site.settings.theme_dark) {
          u.dark_theme = site.settings.theme_dark;
          const s = getComputedStyle(document.body);
          if (!('style' in u)) {
            u.style = u.options.layout;
            if (!('font' in u.style)) u.style.font = {};
            if (!('modebar' in u.style)) u.style.modebar = {};
            if (!('font' in u.style.xaxis)) u.style.xaxis.font = {};
            if (!('font' in u.style.yaxis)) u.style.yaxis.font = {};
          }
          u.style.paper_bgcolor = s.backgroundColor;
          u.style.plot_bgcolor = s.backgroundColor;
          u.style.font.color = s.color;
          u.style.modebar.bgcolor = s.backgroundColor;
          u.style.modebar.color = s.color;
          if (u.e._fullLayout.xaxis.showgrid) u.style.xaxis.gridcolor = s.borderColor;
          if (u.e._fullLayout.yaxis.showgrid) u.style.yaxis.gridcolor = s.borderColor;
          u.style.xaxis.font.color = s.color;
          u.style.yaxis.font.color = s.color;
          Plotly.relayout(u.e, u.options.layout);
        }
      }

      function make_data_entry(u, e, rank, total, name, color) {
        if (e.data && u.parsed.x in site.data.variables) {
          const x = site.data.get_value({variable: u.parsed.x, entity: e}),
            y = site.data.get_value({variable: u.parsed.y, entity: e}),
            t = JSON.parse(u.traces[u.base_trace]),
            yr = site.data.variables[u.parsed.y].time_range[u.parsed.dataset],
            xr = site.data.variables[u.parsed.x].time_range[u.parsed.dataset],
            n = Math.min(yr[1], xr[1]) + 1,
            ns = u.parsed.summary.n;
          for (let i = Math.max(yr[0], xr[0]); i < n; i++) {
            if (site.settings.show_empty_times || ns[i - u.parsed.y_range[0]]) {
              t.text.push(e.features.name);
              t.x.push(u.parsed.x_range[0] <= i && i <= u.parsed.x_range[1] ? x[i - u.parsed.x_range[0]] : NaN);
              t.y.push(u.parsed.y_range[0] <= i && i <= u.parsed.y_range[1] ? y[i - u.parsed.y_range[0]] : NaN);
            }
          }
          t.type = u.parsed.base_trace;
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
              defaults.border;
          if ('bar' === t.type) t.marker.line.width = 0;
          t.name = name || e.features.name;
          t.id = e.features.id;
          return t
        }
      }

      function make_summary_table(parent, summary, additional) {
        parent.classList.add('info-summary-wrapper');
        const e = document.createElement('table');
        e.className = 'info-summary';
        e.appendChild(document.createElement('tr'));
        e.appendChild(document.createElement('tr'));
        if (additional) {
          Object.keys(additional).forEach(h => {
            e.firstElementChild.appendChild(document.createElement('th'));
            e.firstElementChild.lastElementChild.innerText = h;
            e.lastElementChild.appendChild(document.createElement('td'));
            e.lastElementChild.lastElementChild.innerText = additional[h];
          });
        }
    ['NAs', 'Min', 'Q1', 'Mean', 'Median', 'Q3', 'Max'].forEach(h => {
          const lower = h.toLowerCase();
          if (!summary || lower in summary) {
            e.firstElementChild.appendChild(document.createElement('th'));
            e.firstElementChild.lastElementChild.innerText = h;
            e.lastElementChild.appendChild(document.createElement('td'));
            e.lastElementChild.lastElementChild.innerText = summary ? site.data.format_value(summary[lower]) : 'NA';
          }
        });
        parent.appendChild(e);
        return e
      }

      function fill_summary_table(table, summary, time) {
        const e = table.lastElementChild.children;
        filter_components.summary.forEach((c, i) => {
          e[i].innerText = site.data.format_value(summary[c][time], 0 === i);
        });
      }

      function make_variable_reference(c) {
        if (!Array.isArray(c.author)) c.author = [c.author];
        const e = document.createElement('li'),
          n = c.author.length;
        let s = '',
          j = 1 === n ? '' : 2 === n ? ' & ' : ', & ';
        for (let i = n; i--; ) {
          const a = c.author[i];
          s =
            (i ? j : '') +
            ('string' === typeof a ? a : a.family) +
            (a.given ? ', ' + a.given.substring(0, 1) + '.' : '') +
            s;
          j = ', ';
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
            : '');
        return e
      }

      function make_variable_source(s, table) {
        const e = document.createElement(table ? 'tr' : 'div');
        let ee;
        if (table) {
          if (s.name) {
            e.appendChild((ee = document.createElement('td')));
            if (s.url) {
              ee.appendChild((ee = document.createElement('a')));
              ee.target = '_blank';
              ee.rel = 'noreferrer';
              ee.href = s.url;
            } else {
              ee.appendChild(document.createElement('span'));
            }
            e.firstElementChild.firstElementChild.innerText = s.name;
          }
          if (s.date_accessed) {
            e.appendChild((ee = document.createElement('td')));
            ee.appendChild(document.createElement('span'));
            ee.firstElementChild.innerText = s.date_accessed;
          }
        } else {
          e.className = 'card';
          if (s.name) {
            e.appendChild((ee = document.createElement('div')));
            ee.className = 'card-header';
            if (s.url) {
              ee.appendChild((ee = document.createElement('a')));
              ee.target = '_blank';
              ee.rel = 'noreferrer';
              ee.href = s.url;
            } else {
              ee.appendChild(document.createElement('span'));
            }
            e.firstElementChild.firstElementChild.innerText = s.name;
          }
          e.appendChild(document.createElement('div'));
          e.lastElementChild.className = 'card-body';
          if (s.location) {
            e.lastElementChild.appendChild((ee = document.createElement('p')));
            ee.appendChild(document.createElement('span'));
            ee.lastElementChild.innerText = 'Location: ';
            ee.appendChild(document.createElement('span'));
            if (s.location_url) {
              ee.lastElementChild.appendChild((ee = document.createElement('a')));
              ee.target = '_blank';
              ee.rel = 'noreferrer';
              ee.href = s.location_url;
              ee.innerText = s.location;
            } else {
              ee.lastElementChild.innerText = s.location;
            }
          }
          if (s.date_accessed) {
            e.lastElementChild.appendChild((ee = document.createElement('p')));
            ee.appendChild(document.createElement('span'));
            ee.lastElementChild.innerText = 'Date Accessed: ';
            ee.appendChild(document.createElement('span'));
            ee.lastElementChild.innerText = s.date_accessed;
          }
        }
        return e
      }

      function show_variable_info() {
        const v = _u[this.view],
          name = valueOf(this.v || v.y),
          info = site.data.variable_info[name];
        page.modal.info.header.firstElementChild.innerText = info.short_name;
        page.modal.info.title.innerText = info.long_name;
        set_description(page.modal.info.description, info);
        page.modal.info.name.lastElementChild.innerText = name;
        page.modal.info.type.lastElementChild.innerText = info.unit || info.aggregation_method || info.type || '';
        if (info.sources && info.sources.length) {
          page.modal.info.sources.lastElementChild.innerHTML = '';
          page.modal.info.sources.classList.remove('hidden');
          info.sources.forEach(s => {
            page.modal.info.sources.lastElementChild.appendChild(make_variable_source(s));
          });
        } else page.modal.info.sources.classList.add('hidden');
        if (info.citations && info.citations.length) {
          page.modal.info.references.lastElementChild.innerHTML = '';
          page.modal.info.references.classList.remove('hidden');
          if ('string' === typeof info.citations) info.citations = [info.citations];
          if ('references' in site.data) {
            delete site.data.variable_info._references;
            delete site.data.references;
          }
          if (!('_references' in site.data.variable_info)) {
            const r = {};
            site.data.variable_info._references = r;
            Object.keys(site.data.info).forEach(d => {
              const m = site.data.info[d];
              if ('_references' in m) {
                Object.keys(m._references).forEach(t => {
                  if (!(t in r))
                    r[t] = {
                      reference: m._references[t],
                      element: make_variable_reference(m._references[t]),
                    };
                });
              }
            });
          }
          const r = site.data.variable_info._references;
          info.citations.forEach(c => {
            if (c in r) page.modal.info.references.lastElementChild.appendChild(r[c].element);
          });
        } else page.modal.info.references.classList.add('hidden');
        if ('origin' in info) {
          page.modal.info.origin.classList.remove('hidden');
          const l = page.modal.info.origin.lastElementChild;
          l.innerHTML = '';
          if ('string' === typeof info.origin) info.origin = [info.origin];
          info.origin.forEach(url => {
            const c = document.createElement('li'),
              repo = patterns.repo.exec(url)[1];
            let link = document.createElement('a');
            link.href = 'https://github.com/' + repo;
            link.target = '_blank';
            link.rel = 'noreferrer';
            link.innerText = repo;
            c.appendChild(link);
            c.appendChild(document.createElement('span'));
            c.lastElementChild.innerText = ' / ';
            link = document.createElement('a');
            link.href = url;
            link.target = '_blank';
            link.rel = 'noreferrer';
            link.innerText = url.replace(patterns.basename, '');
            c.appendChild(link);
            l.appendChild(c);
          });
        } else page.modal.info.origin.classList.add('hidden');
        if (info.source_file) {
          page.modal.info.source_file.classList.remove('hidden');
          page.modal.info.source_file.firstElementChild.href = info.source_file;
        } else page.modal.info.source_file.classList.add('hidden');
      }

      function parse_variables(s, type, e, entity) {
        if ('statement' === type) {
          for (let m, v; (m = patterns.mustache.exec(s)); ) {
            if ('value' === m[1]) {
              v = entity
                ? site.data.format_value(
                    entity.get_value(e.v, e.time),
                    e.dataset in site.data.variables[e.v] && 'integer' === site.data.variables[e.v][e.dataset].type
                  )
                : NaN;
              const info = site.data.variable_info[e.v];
              let type = info.unit || info.type;
              if (info.aggregation_method && !(type in value_types)) type = info.aggregation_method;
              s = s.replace(m[0], NaN !== v && type in value_types ? value_types[type](v) : v);
              patterns.mustache.lastIndex = 0;
            } else if (entity) {
              if ('region_name' === m[1]) {
                s = s.replace(m[0], entity.features.name);
                patterns.mustache.lastIndex = 0;
              } else if (patterns.features.test(m[1])) {
                s = s.replace(m[0], entity.features[m[1].replace(patterns.features, '')]);
                patterns.mustache.lastIndex = 0;
              } else if (patterns.variables.test(m[1])) {
                s = s.replace(m[0], entity.variables[e.v][m[1].replace(patterns.variables, '')]);
                patterns.mustache.lastIndex = 0;
              } else if (patterns.data.test(m[1])) {
                s = s.replace(m[0], entity.get_value(m[1].replace(patterns.data, ''), e.time));
                patterns.mustache.lastIndex = 0;
              }
            }
          }
        }
        return s
      }

      let k, i, e, ee, c;
      // get options from url
      site.query = k = window.location.search.replace('?', '');
      site.url_options = {};
      if (k) {
        e = k.split('&');
        for (i = e.length; i--; ) {
          c = e[i].split('=');
          if (c.length < 2) c.push('true');
          c[1] = patterns.bool.test(c[1]) ? !!c[1] || 'true' === c[1] : c[1].replace(patterns.url_spaces, ' ');
          site.url_options[c[0]] = c[1];
          if (patterns.settings.test(c[0])) storage.set(c[0].replace(patterns.settings, ''), c[1]);
        }
      }

      // prepare embedded view
      if ('embedded' in site.url_options || 'hide_navbar' in site.url_options) {
        if (!('hide_logo' in site.url_options)) site.url_options.hide_logo = true;
        if (!('hide_title' in site.url_options)) site.url_options.hide_title = true;
        if (!('hide_navcontent' in site.url_options)) site.url_options.hide_navcontent = true;
        if (!('hide_panels' in site.url_options)) site.url_options.hide_panels = true;
        if ('embedded' in site.url_options && !('close_menus' in site.url_options)) site.url_options.close_menus = true;
      }
      e = page.navbar;
      if (e) {
        e.querySelectorAll('button').forEach(b => {
          const panel = document.querySelector(b.getAttribute('data-bs-target'));
          if (panel && 'false' === panel.getAttribute('data-bs-backdrop')) {
            panel.addEventListener('show.bs.offcanvas', function () {
              page.content_bounds.outer_right = panel.getBoundingClientRect().width;
              content_resize(void 0, true);
              setTimeout(trigger_resize, 200);
            });
            panel.addEventListener('hide.bs.offcanvas', function () {
              page.content_bounds.outer_right = 0;
              content_resize(void 0, true);
              setTimeout(trigger_resize, 200);
            });
          }
        });
        if ('navcolor' in site.url_options) {
          if ('' === site.url_options.navcolor) site.url_options.navcolor = window.location.hash;
          e.style.backgroundColor = site.url_options.navcolor.replace('%23', '#');
        }
        if (site.url_options.hide_logo && site.url_options.hide_title && site.url_options.hide_navcontent) {
          e.classList.add('hidden');
        } else {
          e = document.querySelector('.navbar-brand');
          if (e) {
            if (site.url_options.hide_logo && 'IMG' === e.firstElementChild.tagName)
              e.firstElementChild.classList.add('hidden');
            if (site.url_options.hide_title && 'IMG' !== e.lastElementChild.tagName)
              e.lastElementChild.classList.add('hidden');
          }
          if (site.url_options.hide_navcontent) {
            document.querySelector('.navbar-toggler').classList.add('hidden');
            e = document.querySelector('.navbar-nav');
            if (e) e.classList.add('hidden');
          }
        }
        if (site.url_options.hide_panels && page.panels.length) {
          for (i = page.panels.length; i--; ) {
            page.panels[i].classList.add('hidden');
          }
        }
      }

      // check for stored settings
      storage.copy = storage.get();
      if (storage.copy)
        for (const k in site.settings) {
          if (k in storage.copy) {
            let c = storage.copy[k];
            if (patterns.bool.test(c)) {
              c = !!c || 'true' === c;
            } else if (patterns.number.test(c)) c = parseFloat(c);
            site.settings[k] = c;
          }
        }

      // preprocess polynomial palettes
      function poly_channel(ch, pos, coefs) {
        const n = coefs.length;
        let v = coefs[0][ch] + pos * coefs[1][ch],
          i = 2;
        for (; i < n; i++) {
          v += Math.pow(pos, i) * coefs[i][ch];
        }
        return Math.max(0, Math.min(255, v))
      }
      Object.keys(palettes).forEach(k => {
        const n = 255,
          p = palettes[k];
        if ('continuous-polynomial' === p.type) {
          const c = p.colors;
          p.type = 'discrete';
          p.colors = [];
          for (let i = 0; i < n; i++) {
            const v = i / n;
            p.colors.push(
              'rgb(' + poly_channel(0, v, c) + ', ' + poly_channel(1, v, c) + ', ' + poly_channel(2, v, c) + ')'
            );
          }
        }
        p.odd = p.colors.length % 2;
      });

      window.onload = function () {
        page.navbar = document.querySelector('.navbar');
        page.navbar = page.navbar ? page.navbar.getBoundingClientRect() : {height: 0};
        page.content = document.querySelector('.content');
        page.menus = document.querySelectorAll('.menu-wrapper');
        page.panels = document.querySelectorAll('.panel');
        page.content_bounds = {
          top: page.navbar.height,
          right: 0,
          bottom: 0,
          left: 0,
          outer_right: 0,
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
