(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
})((function () { 'use strict';

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
        math_tags: /^(?:semantics|annotation|annotation\-xml|m)/,
        math_attributes: /^(?:xmlns|display|displaystyle|style|encoding|stretchy|alttext|scriptlevel|fence|math)/,
        id_escapes: /(?<=#[^\s]+)([.[\](){}?*-])/g,
        repo: /\.com\/([^\/]+\/[^\/]+)/,
        basename: /^.*\//,
    };

    var value_types = {
        percent: function (v) {
            return v + '%';
        },
        'drive time': function (v) {
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
            }
            else {
                try {
                    e = document.querySelector(name.replace(patterns.id_escapes, '\\$1'));
                }
                catch (error) { }
            }
            return e;
        };
        TutorialManager.prototype.start_tutorial = function (event, name) {
            this.end_tutorial();
            document.querySelectorAll('[data-bs-dismiss]').forEach(function (close) { return close.click(); });
            this.in_progress = name ? name : event.target.dataset.name;
            if (!(this.in_progress in this.tutorials)) {
                console.error('tutorial does not exist:', this.in_progress);
                this.in_progress = '';
                return;
            }
            this.container.classList.remove('hidden');
            this.header.innerText = this.tutorials[this.in_progress].title || this.in_progress;
            this.current_step = 0;
            this.current_time = 0;
            this.dialog.innerText = 'Starting tutorial ' + this.header.innerText;
            this.timer.innerText = '';
            this.continue.innerText = 'Next';
            if (this.tutorials[this.in_progress].reset)
                this.site_reset();
            this.progress_tutorial();
        };
        TutorialManager.prototype.progress_tutorial = function (event) {
            var _this = this;
            var isClick = !event || !event.code;
            if (!isClick && 'Escape' === event.code)
                this.end_tutorial();
            if (this.in_progress && !this.waiting && (isClick || 'Enter' === event.code || 'ArrowRight' === event.code)) {
                this.waiting = true;
                clearTimeout(this.focuser);
                clearInterval(this.running_timer);
                var t = this.tutorials[this.in_progress];
                var step_1;
                var handle_object = function (obj) {
                    Object.keys(obj).forEach(function (k) {
                        if (patterns.number.test(k)) {
                            do_action_1(obj[k]);
                        }
                        else {
                            if (k in _this.site_elements && _this.site_elements[k].set) {
                                _this.site_elements[k].set(obj[k]);
                            }
                        }
                    });
                };
                var set_value_1 = function (value) {
                    if (_this.current_site_element && _this.current_site_element.set) {
                        _this.current_site_element.set(value);
                    }
                    else {
                        var input = 'value' in _this.current_element ? _this.current_element : _this.current_element.querySelector('input');
                        if (input) {
                            input.value = value;
                            input.dispatchEvent(new Event('change'));
                            input.dispatchEvent(new KeyboardEvent('keydown', { code: 'Enter' }));
                        }
                    }
                };
                var do_action_1 = function (action) {
                    action = String(action);
                    if ('set' === action) {
                        if ('option' in step_1)
                            set_value_1(step_1.option);
                    }
                    else if ('click' === action) {
                        if (_this.current_site_element &&
                            _this.current_site_element.toggle &&
                            action === _this.current_site_element.id) {
                            if (!_this.current_site_element.expanded)
                                _this.current_site_element.toggle({ target: _this.current_element });
                        }
                        else {
                            _this.current_element && _this.current_element.click();
                        }
                    }
                    else if ('close' === action) {
                        document.querySelectorAll('[data-bs-dismiss]').forEach(function (close) { return close.click(); });
                    }
                    else if ('value' === action.substring(0, 5)) {
                        set_value_1(action.replace(patterns.pre_colon, '').trimStart());
                    }
                    else {
                        var e = _this.retrieve_element(action);
                        if (e)
                            e.click();
                    }
                };
                // handle previous step's after action
                if (this.current_step > 0) {
                    step_1 = t.steps[this.current_step - 1];
                    if ('after' in step_1) {
                        if (Array.isArray(step_1.after)) {
                            step_1.after.forEach(do_action_1);
                        }
                        else {
                            handle_object(step_1.after);
                        }
                    }
                }
                if (this.current_step >= t.n_steps) {
                    this.end_tutorial();
                }
                else {
                    this.current_site_element = void 0;
                    // handle current step's before action
                    step_1 = t.steps[this.current_step];
                    this.current_element = this.retrieve_element(step_1.focus);
                    if ('before' in step_1) {
                        if (Array.isArray(step_1.before)) {
                            step_1.before.forEach(do_action_1);
                        }
                        else {
                            handle_object(step_1.before);
                        }
                    }
                    if (this.current_step === t.n_steps - 1)
                        this.continue.innerText = 'Finish';
                    if (this.current_element && this.current_element.scrollIntoView)
                        this.current_element.scrollIntoView();
                    // execute current step after actions have resolved
                    setTimeout(this.execute_step, 'wait' in step_1 ? step_1.wait : 400);
                }
            }
        };
        TutorialManager.prototype.execute_step = function () {
            var _this = this;
            if (this.in_progress) {
                var t = this.tutorials[this.in_progress];
                var step = t.steps[this.current_step];
                if (!this.current_element) {
                    var e = this.retrieve_element(step.focus);
                    if (!e) {
                        console.error('failed to retrieve element', step.focus);
                        return this.end_tutorial();
                    }
                    this.current_element = e;
                    if (e.scrollIntoView)
                        e.scrollIntoView();
                    setTimeout(this.execute_step, 0);
                    return;
                }
                this.continue.disabled = !!step.disable_continue;
                var b = this.current_element.getBoundingClientRect(), f = this.frame.getBoundingClientRect();
                this.highlight.style.top = b.top + 'px';
                this.highlight.style.left = b.left + 'px';
                this.highlight.style.width = b.width + 'px';
                this.highlight.style.height = b.height + 'px';
                this.frame.style.top = (b.y < screen.availHeight / 2 ? b.y + b.height + 10 : b.y - f.height - 10) + 'px';
                this.frame.style.marginLeft = -f.width / 2 + 'px';
                if (step.time) {
                    this.current_time = step.time;
                    this.timer.innerText = step.time + '';
                    this.running_timer = setInterval(function () {
                        _this.current_time--;
                        _this.timer.innerText = _this.current_time + '';
                        if (_this.current_time <= 0) {
                            clearInterval(_this.running_timer);
                            _this.progress_tutorial();
                        }
                    }, 1e3);
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
                            if (v) {
                              if (!f.time_range && v.time_range.filtered_index + '' !== v.time_range.index + '') {
                                q.push(
                                  'time_range=' +
                                    site.data.meta.times[d].value[v.time_range.filtered_index[0]] +
                                    ',' +
                                    site.data.meta.times[d].value[v.time_range.filtered_index[1]]
                                );
                              }
                              if (!v.features) v.features = {};
                              Object.keys(v.features).forEach(k => {
                                if (!(k in f)) {
                                  f[k] = valueOf(v.features[k]);
                                  if (Array.isArray(f[k])) f[k] = f[k].join(',');
                                  q.push(k + '=' + f[k]);
                                }
                              });
                              if (_u._base_filter.c.size) _u._base_filter.value(q, v.parsed.time_agg);
                            }
                            Object.keys(f).forEach(k => {
                              if (!patterns.exclude_query.test(k) && !(k in v.features)) q.push(k + '=' + f[k]);
                            });
                            const k = s.endpoint + (q.length ? '?' + q.join('&') : '');
                            if (this.api) {
                              window.location.href = k;
                            } else {
                              navigator.clipboard.writeText(k).then(
                                () => {
                                  if ('Copied!' !== o.e.innerText) {
                                    o.text = o.e.innerText;
                                    o.e.innerText = 'Copied!';
                                    setTimeout(function () {
                                      o.e.innerText = o.text;
                                    }, 500);
                                    gtag('event', 'export', {event_category: 'api link'});
                                  }
                                },
                                e => {
                                  if (e !== o.e.innerText) {
                                    o.text = o.e.innerText;
                                    o.e.innerText = e;
                                    setTimeout(function () {
                                      o.e.innerText = o.text;
                                    }, 1500);
                                  }
                                }
                              );
                            }
                          } else {
                            if (v && 'selection' in v) {
                              if (!f.time_range)
                                f.time_range =
                                  site.data.meta.times[d].value[v.time_range.filtered_index[0]] +
                                  ',' +
                                  site.data.meta.times[d].value[v.time_range.filtered_index[1]];
                              site.data.export(f, v.selection.all, true);
                            } else site.data.export(f, site.data.entities, true, true);
                            gtag('event', 'export', {event_category: 'download'});
                          }
                        }.bind(o)
                      : function () {
                          Object.keys(this.settings.effects).forEach(k => {
                            this.settings.effects[k] === '' || -1 == this.settings.effects[k]
                              ? _u[k].reset()
                              : _u[k].set(this.settings.effects[k]);
                          });
                        }.bind(o)
                    : 'refresh' === o.target
                    ? global_update
                    : 'reset_selection' === o.target
                    ? global_reset
                    : 'reset_storage' === o.target
                    ? clear_storage
                    : function () {
                        if (this.target in _u) _u[this.target].reset();
                      }.bind(o)
                );
            },
            update: function () {
              let n = Number(0 !== _u._entity_filter.selected.length);
              _u._base_filter.c.forEach(f => (n += f.active));
              if (n) {
                this.notification.innerText = n;
                this.notification.classList.remove('hidden');
              } else {
                this.notification.classList.add('hidden');
              }
            },
          },
          buttongroup: {
            retrieve: function () {
              for (let i = this.options.length; i--; )
                if (this.options[i].checked) {
                  this.set(i);
                  break
                }
            },
            setter: function (v) {
              this.previous = this.value();
              this.current_index = 'string' === typeof v ? this.values.indexOf(v) : v;
              if (-1 !== this.current_index) {
                this.source =
                  this.values[this.current_index] in _u
                    ? _u[this.values[this.current_index]]
                    : this.values[this.current_index];
                this.options[this.current_index].checked = true;
              } else this.source = undefined;
              request_queue(this.id);
            },
            listener: function (e) {
              this.set(e.target.value);
            },
            adder: function (i, value, display, noadd) {
              let e = [document.createElement('input'), document.createElement('label')];
              e[0].className = 'btn-check';
              e[0].type = 'radio';
              e[0].name = this.e.id + '_options';
              e[0].autocomplete = 'off';
              e[0].value = value;
              e[0].id = this.e.id + '_option' + i;
              e[1].className = 'btn btn-primary';
              e[1].innerText = display || site.data.format_label(value);
              e[1].setAttribute('for', e[0].id);
              if (!noadd) {
                this.e.appendChild(e[0]);
                this.e.appendChild(e[1]);
              }
              return e[0]
            },
          },
          radio: {
            retrieve: function () {
              for (let i = this.options.length; i--; ) {
                if (this.options[i].checked) {
                  this.set(i);
                  break
                }
              }
            },
            setter: function (v) {
              this.current_index = 'string' === typeof v ? this.values.indexOf(v) : v;
              if (-1 !== this.current_index) {
                this.source =
                  this.values[this.current_index] in _u
                    ? _u[this.values[this.current_index]]
                    : this.values[this.current_index];
                this.options[this.current_index].checked = true;
              } else this.source = undefined;
              request_queue(this.id);
            },
            listener: function (e) {
              this.set(e.target.value);
            },
            adder: function (value, display, noadd) {
              const e = document.createElement('div'),
                s = 'TRUE' === this.e.getAttribute('data-switch');
              e.className = 'form-check' + (s ? ' form-switch' : '');
              e.appendChild(document.createElement('input'));
              e.appendChild(document.createElement('label'));
              e.firstElementChild.autocomplete = 'off';
              e.firstElementChild.className = 'form-check-input';
              if (s) e.firstElementChild.role = 'switch';
              e.firstElementChild.type = 'radio';
              e.firstElementChild.name = this.e.id + '_options';
              e.firstElementChild.id = this.e.id + '_option' + this.e.childElementCount;
              e.firstElementChild.value = value;
              e.lastElementChild.innerText = display || site.data.format_label(value);
              e.lastElementChild.className = 'form-check-label';
              e.lastElementChild.setAttribute('for', e.firstElementChild.id);
              if (!noadd) this.e.appendChild(e);
              return e.firstElementChild
            },
          },
          checkbox: {
            retrieve: function () {
              this.source = [];
              this.current_index = [];
              this.off_default = false;
              this.options.forEach(o => {
                if (o.checked) {
                  this.source.push(this.values[i]);
                  this.current_index.push(i);
                } else {
                  this.off_default = true;
                }
              });
              request_queue(this.id);
            },
            setter: function (v) {
              if ('object' === typeof v) {
                this.source = [];
                this.current_index = [];
                this.off_default = false;
                this.values.forEach((cv, i) => {
                  if (-1 !== v.indexOf(cv)) {
                    this.source.push(cv);
                    this.current_index.push(i);
                    this.options[i].checked = true;
                  } else {
                    this.off_default = true;
                    this.options[i].checked = false;
                  }
                });
              } else {
                if ('string' === typeof v) {
                  return this.set('' === v ? this.values : v.split(','))
                } else {
                  if (-1 !== v) {
                    this.options[v].checked = true;
                    this.off_default = false;
                    this.options.forEach(o => {
                      if (!o.checked) this.off_default = true;
                    });
                  }
                }
              }
              request_queue(this.id);
            },
            listener: function (e) {
              if (e.target.checked) {
                this.source.push(e.target.value);
                this.current_index.push(this.values.indexOf(e.target.value));
                this.off_default = false;
                this.options.forEach(o => {
                  if (!o.checked) this.off_default = true;
                });
              } else {
                let i = this.source.indexOf(e.target.value);
                if (i !== -1) {
                  this.off_default = true;
                  this.source.splice(i, 1);
                  this.current_index.splice(i, 1);
                }
              }
              request_queue(this.id);
            },
            adder: function (value, display, noadd) {
              let e = document.createElement('div'),
                s = 'TRUE' === this.e.getAttribute('data-switch');
              e.className = 'form-check' + (s ? ' form-switch' : '');
              e.appendChild(document.createElement('input'));
              e.appendChild(document.createElement('label'));
              e.firstElementChild.autocomplete = 'off';
              e.firstElementChild.className = 'form-check-input';
              if (s) e.firstElementChild.role = 'switch';
              e.firstElementChild.type = 'checkbox';
              e.firstElementChild.name = this.e.id + '_options';
              e.firstElementChild.id = this.e.id + '_option' + this.e.childElementCount;
              e.firstElementChild.value = value;
              e.lastElementChild.innerText = display || site.data.format_label(value);
              e.lastElementChild.className = 'form-check-label';
              e.lastElementChild.setAttribute('for', e.firstElementChild.id);
              if (!noadd) this.e.appendChild(e);
              return e.firstElementChild
            },
          },
          switch: {
            retrieve: function () {
              this.set(this.e.checked);
            },
            setter: function (v) {
              if ('string' === typeof v) v = 'on' === v || 'true' === v;
              if (v !== this.source) {
                this.previous = this.e.checked;
                this.e.checked = this.source = v;
                request_queue(this.id);
              }
            },
            listener: function () {
              this.set(this.e.checked);
            },
          },
          number: {
            init: function (o) {
              const up = o.e.parentElement.parentElement.querySelector('.number-up');
              const down = o.e.parentElement.parentElement.querySelector('.number-down');
              if (down) {
                down.addEventListener(
                  'click',
                  function () {
                    this.set(Math.max(this.parsed.min, this.value() - 1));
                  }.bind(o)
                );
              }
              if (up) {
                up.addEventListener(
                  'click',
                  function () {
                    this.set(Math.min(this.parsed.max, this.value() + 1));
                  }.bind(o)
                );
              }
            },
            retrieve: function () {
              this.set(this.e.value);
            },
            setter: function (v, check) {
              if (!v) v = null;
              if ('string' === typeof v) v = parseFloat(v);
              if (isFinite(v) && v !== this.source) {
                this.previous = parseFloat(this.e.value);
                if (check) {
                  if (isFinite(this.parsed.min) && v < this.parsed.min) {
                    v = this.parsed.min;
                  } else if (isFinite(this.parsed.max) && v > this.parsed.max) {
                    v = this.parsed.max;
                  }
                }
                this.off_default = v !== this.current_default;
                this.e.value = this.source = v;
                this.current_index = v - this.parsed.min;
                if ('range' === this.e.type) {
                  this.e.nextElementSibling.firstElementChild.innerText = this.e.value;
                }
                request_queue(this.id);
              }
            },
            listener: function (e) {
              this.set(this.e.value, true);
            },
          },
          intext: {
            retrieve: function () {
              this.set(this.e.value);
            },
            setter: function (v, check) {
              this.previous = this.e.value;
              this.e.value = this.source = v;
              request_queue(this.id);
            },
            listener: function (e) {
              this.set(this.e.value, true);
            },
          },
          text: {
            init: function (o) {
              if (site.text && o.id in site.text) {
                o.text = site.text[o.id].text;
                o.condition = site.text[o.id].condition || [];
                o.depends = new Map();
                o.text.forEach(oi => {
                  if ('text' in oi) {
                    init_text(o, oi);
                    o.e.appendChild(oi.parts);
                  } else {
                    o.e.appendChild(document.createElement('span'));
                    oi.forEach(t => init_text(o, t));
                  }
                });
                o.condition.forEach(c => {
                  if (c.id in _u) add_dependency(c.id, {type: 'display', id: o.id});
                });
                o.depends.forEach(d => add_dependency(d.id, {type: 'update', id: o.id}));
                o.update = elements.text.update.bind(o);
              }
              o.update();
            },
            update: function () {
              Object.keys(this.reference_options).forEach(k => (this.options[k] = valueOf(this.reference_options[k])));
              this.depends.forEach(d => {
                d.parsed = valueOf(d.id);
                if (d.u) {
                  if (d.u.options) {
                    d.parsed = d.u.options[d.u.values[d.parsed]].innerText;
                  } else {
                    d.parsed =
                      d.u.display && d.parsed in d.u.display ? d.u.display[d.parsed] : site.data.format_label(d.parsed);
                  }
                } else if (d.parsed in site.data.entities) {
                  d.parsed = site.data.entities[d.parsed].features.name;
                }
              });
              this.text.forEach((o, i) => {
                let pass = true;
                if (o.length) {
                  for (let t = o.length; t--; ) {
                    if ('condition' in o[t]) {
                      for (let c = o[t].condition.length; c--; ) {
                        pass = o[t].condition[c].check();
                        if (!pass) break
                      }
                      if (pass) {
                        o = o[t];
                        break
                      }
                    }
                  }
                } else {
                  if ('condition' in o) {
                    for (let t = o.condition.length; t--; ) {
                      pass = o.condition[t].check();
                      if (!pass) break
                    }
                  }
                }
                if (pass) {
                  o.text.forEach((k, i) => {
                    if (Array.isArray(k)) {
                      k.forEach(ki => {
                        if ('default' === ki.id || DataHandler.checks[ki.type](valueOf(ki.id), valueOf(ki.value)))
                          k = ki.text;
                      });
                    }
                    if (this.depends.has(k)) {
                      o.parts.children[i].innerText = this.depends.get(k).parsed;
                    } else if (k in o.button) {
                      let s = '';
                      o.button[k].text.forEach(b => {
                        s = (this.depends.has(b) ? this.depends.get(b).parsed : b) + s;
                      });
                      o.parts.children[i].innerText = s;
                    } else o.parts.children[i].innerText = k;
                  });
                  if (this.text[i].length) {
                    this.e.children[i].innerHTML = '';
                    this.e.children[i].appendChild(o.parts);
                  } else o.parts.classList.remove('hidden');
                } else o.parts.classList.add('hidden');
              });
            },
          },
          select: {
            retrieve: function () {
              this.set(this.e.selectedIndex);
            },
            setter: function (v) {
              if ('string' === typeof v && !(v in this.values) && patterns.number.test(v)) v = Number(v);
              if ('number' === typeof v) v = this.options[v] ? this.options[v].value : v;
              if (!(v in this.values) && v in this.display) v = this.options[this.display[v]].value;
              if (v !== this.source) {
                this.e.selectedIndex = v in this.values ? this.values[v] : -1;
                this.source = v;
                request_queue(this.id);
              }
            },
            listener: function (e) {
              this.set(e.target.selectedIndex);
            },
            adder: function (value, display, meta, noadd) {
              const e = document.createElement('option');
              e.value = value;
              e.innerText = display || site.data.format_label(value);
              if (meta && meta.info) {
                e.title = meta.info.description || meta.info.short_description;
              }
              if (!noadd) this.e.appendChild(e);
              return e
            },
          },
          combobox: {
            create: function (label, options, settings, id) {
              id = id || 'created_combobox_' + ++page.elementCount;
              const main = document.createElement('div');
              let e = document.createElement('div'),
                c = document.createElement('div');
              if (settings) {
                if (!site.combobox) site.combobox = {};
                site.combobox[id] = settings;
              }
              e.className = 'wrapper combobox-wrapper';
              if (settings && settings.floating) {
                e.appendChild(c);
                c.className = 'form-floating';
                c.dataset.of = id;
                e = c;
              }
              e.appendChild(main);
              main.id = id;
              main.setAttribute('data-autoType', 'combobox');
              main.className = 'auto-input form-select combobox combobox-component';
              main.role = 'combobox';
              main.appendChild((c = document.createElement('div')));
              c.className = 'combobox-selection combobox-component';
              c.appendChild(document.createElement('span'));
              c.lastElementChild.className = 'combobox-component';
              c.lastElementChild.setAttribute('aria-live', 'assertive');
              c.lastElementChild.setAttribute('aria-atomic', 'true');
              c.lastElementChild.setAttribute('aria-role', 'log');
              c.appendChild((c = document.createElement('input')));
              c.setAttribute('aria-haspopup', 'listbox');
              c.setAttribute('aria-expanded', 'false');
              c.setAttribute('aria-controls', id + '-listbox');
              c.className = 'combobox-input combobox-component';
              c.type = 'text';
              c.role = 'combobox';
              c.id = id + '-input';
              c.autocomplete = 'off';
              if (settings && settings.clearable) {
                e.firstElementChild.appendChild((c = document.createElement('button')));
                c.type = 'button';
                c.className = 'btn-close';
                c.title = 'clear selection';
              }
              e.appendChild((c = document.createElement('div')));
              c.className = 'combobox-options combobox-component';
              c.setAttribute('aria-labelledby', id + '-label');
              c.role = 'listbox';
              c.tabindex = '-1';
              c.id = id + '-listbox';
              e.appendChild((c = document.createElement('label')));
              c.id = id + '-label';
              c.innerText = label;
              c.setAttribute('for', id + '-input');
              elements.init_input(main);
              const u = _u[id];
              let n = 0;
              u.options = [];
              if (options)
                if (Array.isArray(options)) {
                  options.forEach(o => {
                    const l = site.data.format_label(o);
                    u.display[l] = n;
                    u.values[o] = n++;
                    u.options.push(u.add(o, l));
                  });
                } else {
                  u.groups = {e: [], by_name: {}};
                  Object.keys(options).forEach(k => {
                    const g = options[k];
                    const e = document.createElement('div'),
                      id = u.id + '_group_' + k.replace(patterns.seps, '-');
                    e.className = 'combobox-group combobox-component';
                    e.setAttribute('aria-labelledby', id);
                    e.appendChild(document.createElement('label'));
                    e.firstElementChild.innerText = k;
                    e.firstElementChild.id = id;
                    e.firstElementChild.className = 'combobox-group-label combobox-component';
                    u.groups.by_name[k] = e;
                    u.groups.e.push(e);
                    g.forEach(o => u.groups.by_name[k].appendChild(u.add(o, o, true)));
                    u.listbox.appendChild(e);
                  });
                  Object.keys(u.groups.by_name).forEach(g => {
                    u.groups.by_name[g].querySelectorAll('.combobox-option').forEach(c => {
                      u.options.push(c);
                      c.setAttribute('data-group', g);
                      u.values[c.dataset.value] = n;
                      u.display[c.innerText] = n++;
                    });
                  });
                }
              return u
            },
            init: function (o) {
              o.hover_index = -1;
              o.cleared_selection = '';
              o.expanded = false;
              o.settings.use_display = o.settings.search || o.settings.multi;
              o.listbox = o.e.parentElement.children[1];
              o.options = o.listbox.querySelectorAll('.combobox-option');
              if (o.options.length) {
                o.values = {};
                o.display = {};
                o.options.forEach((e, i) => {
                  o.values[e.dataset.value] = i;
                  o.display[e.innerText] = i;
                });
                const group = o.listbox.querySelectorAll('.combobox-group');
                if (group.length) {
                  o.groups = {e: [], by_name: {}};
                  group.forEach(e => {
                    const name = e.dataset.group;
                    o.groups.e[name] = e;
                    o.groups.by_name[name] = e;
                  });
                }
              }
              o.container = document.createElement('div');
              o.container.className = 'combobox-options-container combobox-component hidden';
              page.overlay.appendChild(o.container);
              o.container.appendChild(o.listbox);
              o.selection = o.e.firstElementChild.firstElementChild;
              o.input_element = o.e.firstElementChild.lastElementChild;
              if (2 === o.e.childElementCount) {
                o.e.lastElementChild.addEventListener(
                  'click',
                  function () {
                    if (!this.e.classList.contains('locked')) {
                      this.cleared_selection = '';
                      this.set([]);
                      this.input_element.focus();
                    }
                  }.bind(o)
                );
              }
              o.value = function () {
                return this.source
                  ? this.settings.multi
                    ? this.source
                    : this.source.length
                    ? this.source[0]
                    : ''
                  : valueOf(this.default)
              }.bind(o);
              o.set_selected = function (value) {
                if (value in this.values) {
                  const option = this.options[this.values[value]];
                  option.classList.add('selected');
                  option.setAttribute('aria-selected', 'true');
                }
              }.bind(o);
              o.input_element.addEventListener(
                'focus',
                function () {
                  this.e.classList.add('focused');
                }.bind(o)
              );
              o.input_element.addEventListener(
                'blur',
                function () {
                  this.e.classList.remove('focused');
                }.bind(o)
              );
              o.listbox.addEventListener('click', o.set);
              o.close = function (e) {
                if (this.expanded && (!e || !e.target.classList || !e.target.classList.contains('combobox-component'))) {
                  if (this.settings.use_display && '' === this.selection.innerText && this.source.length)
                    this.selection.innerText = this.cleared_selection;
                  if ('' !== this.input_element.value) setTimeout(this.set, 0);
                  this.e.setAttribute('aria-expanded', 'false');
                  this.expanded = false;
                  this.container.classList.add('hidden');
                  window.removeEventListener('click', o.close);
                }
              }.bind(o);
              o.resize = function () {
                const s = this.e.getBoundingClientRect();
                this.container.style.left = s.x + 'px';
                this.container.style.width = s.width + 'px';
                if (window.screen.height / 2 > s.y) {
                  this.container.style.top = s.y + s.height + 'px';
                  this.container.style.bottom = '';
                } else {
                  this.container.style.top = '';
                  this.container.style.bottom = -s.y + 'px';
                }
              }.bind(o);
              window.addEventListener('resize', o.resize);
              o.toggle = function (e) {
                if (!e.button && !this.e.classList.contains('disabled') && 'BUTTON' !== e.target.tagName) {
                  if (this.expanded) {
                    if (e.target !== this.input_element) this.close();
                  } else {
                    if (site.combobox)
                      Object.keys(site.combobox).forEach(id => {
                        if (id !== this.id) {
                          const ou = _u[id];
                          ou.expanded && ou.close();
                        }
                      });
                    this.container.classList.remove('hidden');
                    if ('' !== this.selection.innerText) this.cleared_selection = this.selection.innerText;
                    if (this.cleared_selection in this.display)
                      this.highlight({target: this.options[this.display[this.cleared_selection]]});
                    if (this.settings.use_display) this.selection.innerText = '';
                    window.addEventListener('click', this.close);
                    this.e.setAttribute('aria-expanded', 'true');
                    if (!e || e.target !== this.input_element) setTimeout(() => this.input_element.focus(), 0);
                    this.resize();
                    this.expanded = true;
                  }
                }
              }.bind(o);
              o.e.addEventListener('mousedown', o.toggle);
              o.highlight = function (e) {
                if (!e || !e.target || e.target.dataset.value in this.values) {
                  if (!this.groups) this.settings.accordion = false;
                  if (e && e.target && e.target.dataset.value) {
                    this.hover_index = this.values[e.target.dataset.value];
                  } else if (-1 === this.hover_index && this.source) {
                    this.hover_index = this.values[this.source[0]];
                  }
                  if ('undefined' === typeof this.hover_index) this.hover_index = -1;
                  const o = this.options[this.hover_index];
                  if (o) {
                    const previous = this.listbox.querySelector('.highlighted');
                    if (previous) previous.classList.remove('highlighted');
                    if (e && 'mouseover' === e.type) {
                      e.target.classList.add('highlighted');
                    } else {
                      o.classList.add('highlighted');
                      if (this.settings.accordion) {
                        const c = o.parentElement.parentElement;
                        if (!c.classList.contains('show')) {
                          c.classList.add('show');
                          c.previousElementSibling.firstElementChild.classList.remove('collapsed');
                          c.previousElementSibling.firstElementChild.setAttribute('aria-expanded', 'true');
                        }
                      }
                      this.input_element.setAttribute('aria-activedescendant', o.id);
                      const port = this.container.getBoundingClientRect(),
                        item = o.getBoundingClientRect();
                      let top = port.top;
                      if (this.groups && o.getAttribute('data-group'))
                        top +=
                          this.groups.by_name[o.getAttribute('data-group')].firstElementChild.getBoundingClientRect().height;
                      if (top > item.top) {
                        this.container.scrollTo(0, this.container.scrollTop + item.top - top);
                      } else if (port.bottom < item.bottom) {
                        this.container.scrollTo(0, this.container.scrollTop + item.bottom - port.bottom);
                      }
                    }
                  }
                }
              }.bind(o);
              o.listbox.addEventListener('mouseover', o.highlight);
              if (o.settings.accordion) {
                o.listbox.addEventListener('show.bs.collapse', e => {
                  const group = o.hover_index === -1 ? '' : o.options[o.hover_index].getAttribute('data-group');
                  if (group !== e.target.getAttribute('data-group')) {
                    o.highlight({target: e.target.firstElementChild.firstElementChild});
                    o.input_element.focus();
                  }
                });
              }
              o.clear_highlight = function () {
                if (-1 !== this.hover_index) {
                  this.options[this.hover_index].classList.remove('highlighted');
                  this.hover_index = -1;
                }
              }.bind(o);
              o.filter_reset = function () {
                if (this.groups)
                  this.groups.e.forEach(g => g.firstElementChild.firstElementChild.classList.remove('hidden'));
                this.input_element.value = '';
                this.filter_index = [];
                this.options.forEach((o, i) => {
                  if (!o.classList.contains('hidden')) this.filter_index.push(i);
                });
                this.listbox.querySelectorAll('.filter-hidden').forEach(o => o.classList.remove('filter-hidden'));
              }.bind(o);
              if (o.settings.search) {
                o.filterer = function (e) {
                  const q = this.input_element.value.toLowerCase();
                  if ('' === q) {
                    this.filter_reset();
                  } else {
                    this.filter_index = [];
                    if (this.groups) {
                      this.groups.e.forEach(g => g.firstElementChild.firstElementChild.classList.add('hidden'));
                    }
                    this.options.forEach((o, i) => {
                      if (!o.classList.contains('hidden') && o.innerText.toLowerCase().includes(q)) {
                        o.classList.remove('filter-hidden');
                        this.filter_index.push(i);
                        const group = o.getAttribute('data-group');
                        if (group) {
                          this.groups.by_name[group].firstElementChild.firstElementChild.classList.remove('hidden');
                          if (this.settings.accordion) {
                            const g = this.groups.by_name[group];
                            g.firstElementChild.nextElementSibling.classList.add('show');
                            g.firstElementChild.firstElementChild.classList.remove('collapsed');
                            g.firstElementChild.firstElementChild.setAttribute('aria-expanded', 'true');
                          }
                        }
                      } else {
                        o.classList.add('filter-hidden');
                      }
                    });
                  }
                }.bind(o);
                o.input_element.addEventListener('keyup', o.filterer);
              }
              o.input_element.addEventListener(
                'keydown',
                function (e) {
                  const action = keymap[e.code];
                  if (action) {
                    if ('close' === action) {
                      this.close();
                    } else if ('select' === action) {
                      if (!this.expanded) return this.toggle({target: this.input_element})
                      this.set(e);
                    } else if ('move' === action) {
                      const value = this.input_element.value;
                      if (this.settings.strict || (this.expanded && '' === value)) {
                        e.preventDefault();
                        if ('ArrowUp' === e.code) {
                          if (this.filter_index && this.filter_index.length) {
                            this.hover_index = this.filter_index.indexOf(this.hover_index) - 1;
                            this.hover_index = this.filter_index[0 > this.hover_index ? 0 : this.hover_index];
                          } else {
                            this.hover_index = Math.max(0, this.hover_index - 1);
                          }
                        } else if ('ArrowDown' === e.code) {
                          if (this.filter_index && this.filter_index.length) {
                            this.hover_index = this.filter_index.indexOf(this.hover_index) + 1;
                            this.hover_index =
                              this.filter_index[
                                this.filter_index.length - 1 < this.hover_index
                                  ? this.filter_index.length - 1
                                  : this.hover_index
                              ];
                          } else {
                            this.hover_index = Math.min(this.options.length - 1, this.hover_index + 1);
                          }
                        } else if ('Home' === e.code) {
                          this.hover_index = 0;
                        } else if ('End' === e.code) {
                          this.hover_index = this.options.length - 1;
                        }
                        if (this.expanded) {
                          this.highlight();
                        } else {
                          this.set(this.hover_index);
                        }
                      } else if (patterns.number.test(value)) {
                        this.set(Number(value) + ('ArrowUp' === e.code ? 1 : -1));
                      }
                    }
                  } else if (!this.expanded) {
                    this.toggle({target: this.input_element});
                  } else {
                    this.clear_highlight();
                  }
                }.bind(o)
              );
            },
            retrieve: function () {
              this.source = [];
              this.listbox.querySelectorAll('.selected').forEach(o => this.source.push(o.dataset.value));
              request_queue(this.id);
            },
            setter: function (v, toggle) {
              if (!v) v = this.input_element.value;
              if (v.target && (this.settings.accordion ? 'BUTTON' : 'LABEL') === v.target.tagName) return void 0
              let update = false,
                i = -1;
              if (v.target) {
                i = this.hover_index;
                if (
                  -1 !== i &&
                  (this.options[i].classList.contains('hidden') || this.options[i].classList.contains('filter-hidden'))
                )
                  i = -1;
                v =
                  -1 === i
                    ? 'INPUT' === v.target.tagName
                      ? this.input_element.value
                      : v.target.dataset.value || v.target.innerText
                    : this.options[i].dataset.value || this.options[i].innerText;
                toggle = this.settings.multi;
              }
              this.filter_reset();
              if ('object' === typeof v) {
                if (this.settings.multi) {
                  this.listbox.querySelectorAll('.selected').forEach(e => {
                    e.classList.remove('selected');
                    e.setAttribute('aria-selected', 'false');
                  });
                  this.source = -1 === v ? [] : v;
                  v.forEach(this.set_selected);
                } else v = v[0];
              }
              if (!Array.isArray(this.source)) this.source = [];
              if ('object' === typeof v && this.settings.multi) {
                update = true;
              } else {
                if (this.settings.strict && 'string' === typeof v && !(v in this.values) && patterns.number.test(v))
                  v = Number(v);
                if ('number' !== this.value_type && 'number' === typeof v && this.options[v]) {
                  v = this.options[v].dataset.value;
                }
                if ('string' === typeof v && v in this.display) v = this.options[this.display[v]].dataset.value;
                if (this.settings.strict && !(v in this.values)) v = this.default;
                i = this.source.indexOf(v);
                if (-1 === i) {
                  update = true;
                  if (-1 === v || '' === v) {
                    this.source = [];
                  } else {
                    if (this.settings.multi) {
                      this.source.push(v);
                    } else this.source[0] = v;
                  }
                  if (v in this.values) {
                    if (!this.settings.multi) {
                      const selected = this.listbox.querySelector('.selected');
                      if (selected) {
                        selected.classList.remove('selected');
                        selected.setAttribute('aria-selected', 'false');
                      }
                    }
                    this.set_selected(v);
                  }
                } else if (toggle) {
                  update = true;
                  this.source.splice(i, 1);
                  if (v in this.values) {
                    const selection = this.options[this.values[v]];
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
              const display = this.source.length
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
                              info && info.type ? patterns.int_types.test(info.type) : true
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
                if ('variables' in o.parts.title.parsed && patterns.measure_name.test(o.parts.title.parsed.variables)) {
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
              if (o.options.body) {
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
                                int: patterns.int_types.test(site.data.variables[vn].type),
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
                  this.integer =
                    site.data.variable_info[variable] && site.data.variable_info[variable].type
                      ? patterns.int_types.test(site.data.variables[variable].type)
                      : true;
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
          u.groups = {e: [], by_name: {}};
          if (combobox && u.settings.accordion) {
            u.listbox.classList.add('accordion');
            u.listbox.id = u.id + '-listbox';
          }
        }
        Object.keys(site.data.entities).forEach(k => {
          const entity = site.data.entities[k];
          if (d === entity.group) {
            if (ck && !(k in current)) {
              u.sensitive = true;
              ck = false;
            }
            if (u.groups) {
              let groups = entity.features[u.settings.group] || ['No Group'];
              if (!Array.isArray(groups)) groups = [groups];
              for (let g = groups.length; g--; ) {
                const group = groups[g];
                if (!(group in u.groups.by_name)) {
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
                  u.groups.by_name[group] = e;
                  u.groups.e.push(e);
                }
                const o = u.add(k, entity.features.name, true);
                o.setAttribute('data-group', group);
                if (combobox && u.settings.accordion) {
                  u.groups.by_name[group].lastElementChild.lastElementChild.appendChild(o);
                } else {
                  u.groups.by_name[group].appendChild(o);
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
          Object.keys(u.groups.by_name).forEach(g => {
            u.groups.by_name[g].querySelectorAll(combobox ? '.combobox-option' : 'option').forEach(c => {
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
          u.groups = {e: [], by_name: {}};
          if (combobox && u.settings.accordion) {
            u.listbox.classList.add('accordion');
            u.listbox.id = u.id + '-listbox';
          }
        }
        const url_set = site.url_options[u.id];
        let ck_suffix = false;
        if (url_set && !(url_set in site.data.variables)) {
          site.url_options[u.id] = url_set.replace(patterns.pre_colon, '');
          if (!(site.url_options[u.id] in site.data.variables)) ck_suffix = true;
        }
        site.data.info[d].schema.fields.forEach(m => {
          const v = site.data.variables[m.name];
          if (v && !v.is_time) {
            const l = site.data.format_label(m.name);
            if (ck && !(k in current)) {
              u.sensitive = true;
              ck = false;
            }
            if (u.groups) {
              let groups = (m.info && m.info[u.settings.group]) || ['No Group'];
              if (!Array.isArray(groups)) groups = [groups];
              for (let g = groups.length; g--; ) {
                const group = groups[g];
                if (!(group in u.groups.by_name)) {
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
                  u.groups.by_name[group] = e;
                  u.groups.e.push(e);
                }
                const o = u.add(m.name, l, true, m);
                o.setAttribute('data-group', group);
                if (combobox && u.settings.accordion) {
                  u.groups.by_name[group].lastElementChild.lastElementChild.appendChild(o);
                } else {
                  u.groups.by_name[group].appendChild(o);
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
          Object.keys(u.groups.by_name).forEach(g => {
            u.groups.by_name[g].querySelectorAll(combobox ? '.combobox-option' : 'option').forEach(c => {
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
          u.groups = {e: [], by_name: {}};
        }
        Object.keys(site.map._queue[source].property_summaries).forEach(v => {
          const l = site.data.format_label(v);
          if (ck && !(k in current)) {
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
      }

      function parse_variables(s, type, e, entity) {
        if ('statement' === type) {
          for (let m, v; (m = patterns.mustache.exec(s)); ) {
            if ('value' === m[1]) {
              v = entity
                ? site.data.format_value(
                    entity.get_value(e.v, e.time),
                    patterns.int_types.test(site.data.variables[e.v].type)
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
        page.script_style = document.head.appendChild(document.createElement('style'));
        if (site.settings.hide_tooltips) page.script_style.sheet.insertRule(tooltip_icon_rule, 0);
        page.menu_toggler = {
          hide: function () {
            page.menu_toggler.timeout = -1;
            this.classList.add('hidden');
            content_resize();
          },
          toggle: function (type) {
            if (page.menu_toggler.timeout > 0) clearTimeout(page.menu_toggler.timeout);
            page.menu_toggler.timeout = -1;
            if ('closed' === this.parentElement.state) {
              this.parentElement.state = 'open';
              this.parentElement.firstElementChild.classList.remove('hidden');
              this.parentElement.style[type] = '0px';
              page.content.style[type] =
                this.parentElement.getBoundingClientRect()['left' === type || 'right' === type ? 'width' : 'height'] + 'px';
              if ('top' === type || 'bottom' === type) this.style[type] = page.content_bounds[type] + 'px';
              setTimeout(trigger_resize, 300);
            } else {
              this.parentElement.state = 'closed';
              if ('left' === type || 'right' === type) {
                this.parentElement.style[type] = -this.parentElement.getBoundingClientRect().width + 'px';
                page.content.style[type] = page.content_bounds[type] + 'px';
              } else {
                const b = this.parentElement.getBoundingClientRect();
                page.content.style[type] = page.content_bounds[type] + ('top' === type ? 40 : 0) + 'px';
                this.parentElement.style[type] = -b.height + ('top' === type ? page.content_bounds.top : 0) + 'px';
                if ('top' === type || 'bottom' === type) this.style[type] = b.height + 'px';
              }
              page.menu_toggler.timeout = setTimeout(page.menu_toggler.hide.bind(this.parentElement.firstElementChild), 300);
            }
          },
          timeout: -1,
        };
        page.modal = {
          info: {
            init: false,
            e: document.createElement('div'),
          },
          filter: {
            init: false,
            e: document.createElement('div'),
          },
        };
        page.load_screen = document.getElementById('load_screen');

        // initialize tags
        if (site.settings.tracking && site.tag_id) {
          gtag('js', new Date());
          gtag('config', site.tag_id);
        }

        // make variable info popup
        e = page.modal.info.e;
        document.body.appendChild(e);
        page.modal.info.init = true;
        e.id = 'variable_info_display';
        e.className = 'modal fade';
        e.setAttribute('tabindex', '-1');
        e.setAttribute('aria-labelledby', 'variable_info_title');
        e.ariaHidden = 'true';
        e.appendChild(document.createElement('div'));
        e.firstElementChild.className = 'modal-dialog modal-dialog-scrollable';
        e.firstElementChild.appendChild(document.createElement('div'));
        e.firstElementChild.firstElementChild.className = 'modal-content';
        e.firstElementChild.firstElementChild.appendChild((page.modal.info.header = document.createElement('div')));
        e = page.modal.info;
        e.header.className = 'modal-header';
        e.header.appendChild(document.createElement('p'));
        e.header.firstElementChild.className = 'h5 modal-title';
        e.header.firstElementChild.id = 'variable_info_title';
        e.header.appendChild(document.createElement('button'));
        e.header.lastElementChild.type = 'button';
        e.header.lastElementChild.className = 'btn-close';
        e.header.lastElementChild.setAttribute('data-bs-dismiss', 'modal');
        e.header.lastElementChild.title = 'close';
        e.header.insertAdjacentElement('afterEnd', (e.body = document.createElement('div')));
        e.body.className = 'modal-body';
        e.body.appendChild((e.title = document.createElement('p')));
        e.title.className = 'h4';
        e.body.appendChild((e.description = document.createElement('p')));

        e.body.appendChild(document.createElement('table'));
        e.body.lastElementChild.className = 'info-feature-table';

        e.body.lastElementChild.appendChild((e.name = document.createElement('tr')));
        e.name.appendChild(document.createElement('th'));
        e.name.firstElementChild.innerText = 'Name';
        e.name.appendChild(document.createElement('td'));

        e.body.lastElementChild.appendChild((e.type = document.createElement('tr')));
        e.type.appendChild(document.createElement('th'));
        e.type.firstElementChild.innerText = 'Type';
        e.type.appendChild(document.createElement('td'));

        e.body.appendChild((e.sources = document.createElement('div')));
        e.sources.appendChild(document.createElement('p'));
        e.sources.lastElementChild.innerText = 'Sources';
        e.sources.lastElementChild.className = 'h3';
        e.sources.appendChild(document.createElement('div'));
        e.sources.lastElementChild.className = 'sources-cards';

        e = page.modal.info;
        e.body.appendChild((e.references = document.createElement('div')));
        e.references.appendChild(document.createElement('p'));
        e.references.firstElementChild.className = 'h3';
        e.references.firstElementChild.innerText = 'References';
        e.references.appendChild((e = document.createElement('ul')));
        e.className = 'reference-list';

        e = page.modal.info;
        e.body.appendChild((e.origin = document.createElement('div')));
        e.origin.appendChild(document.createElement('p'));
        e.origin.firstElementChild.className = 'h3';
        e.origin.firstElementChild.innerText = 'Origin';
        e.origin.appendChild((e = document.createElement('ul')));
        e.className = 'origin-list';

        // set up filter's time range
        document.body.appendChild((e = page.modal.filter.e));
        page.modal.filter.init = true;
        e.id = 'filter_display';
        e.className = 'modal fade';
        e.setAttribute('aria-labelledby', 'filter_title');
        e.ariaHidden = 'true';
        e.appendChild(document.createElement('div'));
        e.firstElementChild.className = 'modal-dialog';
        e.firstElementChild.appendChild(document.createElement('div'));
        e.firstElementChild.firstElementChild.className = 'modal-content';
        e.firstElementChild.firstElementChild.appendChild((page.modal.filter.header = document.createElement('div')));
        e = page.modal.filter;
        e.header.className = 'modal-header';
        e.header.appendChild(document.createElement('p'));
        e.header.firstElementChild.className = 'h5 modal-title';
        e.header.firstElementChild.id = 'filter_title';
        e.header.firstElementChild.innerText = 'Filter';
        e.header.appendChild(document.createElement('button'));
        e.header.lastElementChild.type = 'button';
        e.header.lastElementChild.className = 'btn-close';
        e.header.lastElementChild.setAttribute('data-bs-dismiss', 'modal');
        e.header.lastElementChild.title = 'close';
        e.header.insertAdjacentElement('afterEnd', (e.body = document.createElement('div')));
        e.body.className = 'modal-body';
        e.body.appendChild(document.createElement('p'));
        e.body.lastElementChild.className = 'h6';
        e.body.lastElementChild.innerText = 'Time Range';

        e.body.appendChild((e.time_range = document.createElement('div')));
        e.time_range.className = 'row';

        e.time_range.appendChild(document.createElement('div'));
        e.time_range.lastElementChild.className = 'col';
        e.time_range.lastElementChild.appendChild((ee = document.createElement('div')));
        ee.className = 'form-floating text-wrapper wrapper';
        ee.appendChild(document.createElement('input'));
        ee.lastElementChild.className = 'form-control auto-input';
        ee.lastElementChild.setAttribute('data-autoType', 'number');
        ee.lastElementChild.setAttribute('data-default', 'min');
        ee.lastElementChild.max = 'filter.time_max';
        ee.lastElementChild.type = 'number';
        ee.lastElementChild.autoType = 'number';
        ee.lastElementChild.id = 'filter.time_min';
        ee.appendChild(document.createElement('label'));
        ee.lastElementChild.innerText = 'First Time';
        ee.lastElementChild.setAttribute('for', 'filter.time_min');
        e.time_range.appendChild(document.createElement('div'));
        e.time_range.lastElementChild.className = 'col';
        e.time_range.lastElementChild.appendChild((ee = document.createElement('div')));
        ee.className = 'form-floating text-wrapper wrapper';
        ee.appendChild(document.createElement('input'));
        ee.lastElementChild.className = 'form-control auto-input';
        ee.lastElementChild.setAttribute('data-autoType', 'number');
        ee.lastElementChild.setAttribute('data-default', 'max');
        ee.lastElementChild.min = 'filter.time_min';
        ee.lastElementChild.type = 'number';
        ee.lastElementChild.autoType = 'number';
        ee.lastElementChild.id = 'filter.time_max';
        ee.appendChild(document.createElement('label'));
        ee.lastElementChild.innerText = 'Last Time';
        ee.lastElementChild.setAttribute('for', 'filter.time_max');

        page.panels.length &&
          page.panels.forEach(p => {
            const side = p.classList.contains('panel-left') ? 'left' : 'right';
            page.content_bounds[side] = p.getBoundingClientRect().width;
            p.style.marginTop = page.content_bounds.top + 'px';
            p.lastElementChild.addEventListener(
              'click',
              function () {
                const w = p.getBoundingClientRect().width,
                  bw = p.lastElementChild.getBoundingClientRect().width;
                if ('true' === p.lastElementChild.getAttribute('aria-expanded')) {
                  page.content_bounds[side] = bw;
                  if (page.top_menu) page.top_menu.style[side] = bw + 'px';
                  if (page.bottom_menu) page.bottom_menu.style[side] = bw + 'px';
                  p.style[side] = -w + bw + 'px';
                  p.lastElementChild.setAttribute('aria-expanded', 'false');
                } else {
                  page.content_bounds[side] = w;
                  if (page.top_menu) page.top_menu.style[side] = w + 'px';
                  if (page.bottom_menu) page.bottom_menu.style[side] = w + 'px';
                  p.style[side] = '0px';
                  p.lastElementChild.setAttribute('aria-expanded', 'true');
                }
                content_resize();
                setTimeout(trigger_resize, 200);
              }.bind(p)
            );
          });
        page.menus.length &&
          page.menus.forEach(m => {
            const has_toggler = m.lastElementChild.tagName === 'BUTTON';
            m.state = m.getAttribute('data-state');
            if (m.classList.contains('menu-top')) {
              page.top_menu = m;
              page.top_menu.style.left = page.content_bounds.left + 'px';
              page.top_menu.style.right = page.content_bounds.right + 'px';
              if (has_toggler) {
                m.lastElementChild.addEventListener('click', page.menu_toggler.toggle.bind(m.lastElementChild, 'top'));
                m.lastElementChild.style.top = page.content_bounds.top + 'px';
              }
            } else if (m.classList.contains('menu-right')) {
              page.right_menu = m;
              page.right_menu.style.right = page.content_bounds.right + 'px';
              if (has_toggler) {
                m.lastElementChild.addEventListener('click', page.menu_toggler.toggle.bind(m.lastElementChild, 'right'));
                m.lastElementChild.style.top = page.content_bounds.top + 'px';
              }
            } else if (m.classList.contains('menu-bottom')) {
              page.bottom_menu = m;
              page.content_bounds.bottom = 40;
              page.bottom_menu.style.left = page.content_bounds.left + 'px';
              page.bottom_menu.style.right = page.content_bounds.right + 'px';
              if (has_toggler) {
                m.lastElementChild.addEventListener('click', page.menu_toggler.toggle.bind(m.lastElementChild, 'bottom'));
              }
            } else if (m.classList.contains('menu-left')) {
              page.left_menu = m;
              page.left_menu.style.left = page.content_bounds.left + 'px';
              if (has_toggler) {
                m.lastElementChild.addEventListener('click', page.menu_toggler.toggle.bind(m.lastElementChild, 'left'));
                m.lastElementChild.style.top = page.content_bounds.top + 'px';
              }
            }
            if (site.url_options.close_menus && 'open' === m.state) m.lastElementChild.click();
          });

        // initialize global tooltip
        page.tooltip = {
          e: document.createElement('div'),
          showing: '',
        };
        page.tooltip.e.className = 'tooltip hidden';
        page.tooltip.e.appendChild(document.createElement('p'));
        document.body.appendChild(page.tooltip.e);
        document.body.addEventListener('mouseover', tooltip_clear);

        // initialize tutorial selection dialog
        if (site.tutorials) {
          page.tutorials = new TutorialManager(site.tutorials, _u, global_reset);
          page.overlay.appendChild(page.tutorials.container);
        }

        // initialize inputs
        if (site.dataviews) {
          for (const k in site.dataviews)
            if (k in site.dataviews) {
              defaults.dataview = k;
              break
            }
        } else {
          site.dataviews = {};
          site.dataviews[defaults.dataview] = {};
        }
        document.querySelectorAll('.auto-input').forEach(elements.init_input);

        // initialize variables
        if (site.variables && site.variables.length) {
          site.variables.forEach(v => {
            const k = v.id,
              u = {
                id: k,
                type: 'virtual',
                source: v.default,
                previous: void 0,
                default: v.default,
                display: v.display,
                current_index: -1,
                values: [],
                states: v.states,
                update: function () {
                  this.source = void 0;
                  for (let p, i = this.states.length; i--; ) {
                    p = true;
                    for (let c = this.states[i].condition.length; c--; ) {
                      const r = this.states[i].condition[c];
                      if (DataHandler.checks[r.type](valueOf(r.id), valueOf(r.value))) {
                        if (r.any) {
                          p = true;
                          break
                        }
                      } else p = false;
                    }
                    if (p) {
                      this.source = this.states[i].value;
                      break
                    }
                  }
                  if (!this.source) this.source = this.default;
                  if (this.source !== this.previous) {
                    this.previous = this.source;
                    request_queue(this.id);
                  } else if (this.source in _u) {
                    const r = _u[this.source].value();
                    if (r !== this.previous) {
                      this.previous = r;
                      request_queue(this.id);
                    }
                  }
                },
                value: function () {
                  return valueOf(this.source)
                },
                set: function (v) {
                  if (-1 !== this.values.indexOf(v)) {
                    this.previous = this.source;
                    this.source = v;
                  } else if (this.source) {
                    const c = _u[this.source];
                    if (
                      'select' === c.type || 'combobox' === c.type
                        ? v in c.values || v in c.display
                        : -1 !== c.values.indexOf(v)
                    ) {
                      c.set(v);
                    }
                  }
                  request_queue(this.id);
                },
              };
            _u[k] = u;
            if (u.source) u.values.push(u.source);
            const p = {};
            u.states.forEach(si => {
              u.values.push(si.value);
              si.condition.forEach(c => {
                p[c.id] = {type: 'update', id: k};
                add_dependency(c.id, {type: 'update', id: k});
              });
            });
            u.values.forEach(id => {
              if (id in _u) add_dependency(id, {type: 'update', id: k});
            });
          });
        }

        // initialize rules
        if (site.rules && site.rules.length) {
          site.rules.forEach((r, i) => {
            if ('display' in r.effects) {
              r.effects.display = {e: document.getElementById(r.effects.display)};
              e = r.effects.display.e.querySelector('.auto-input');
              if (e) {
                const u = _u[e.id];
                u.rule = r;
                r.effects.display.u = u;
              }
            }
            if ('lock' in r.effects) {
              const us = new Map();
              document.querySelectorAll('#' + r.effects.lock + ' .auto-input').forEach(e => us.set(e.id, _u[e.id]));
              r.effects.lock = us;
            }
            r.condition.forEach(c => {
              if (c.type in DataHandler.checks) {
                c.check = function () {
                  return DataHandler.checks[this.type](valueOf(this.id), valueOf(this.value))
                }.bind(c);
                if (c.id in _u) {
                  add_dependency(c.id, {type: 'rule', id: c.id, condition: c, rule: i});
                  if (!(c.id in rule_conditions)) rule_conditions[c.id] = {};
                  rule_conditions[c.id][i] = r;
                }
                if (c.check()) {
                  Object.keys(r.effects).forEach(k => {
                    if (k in _u) _u[k].set(valueOf(r.effects[k]));
                  });
                } else if (c.default) {
                  Object.keys(r.effects).forEach(k => {
                    if (k in _u) _u[k].set(valueOf(c.default));
                  });
                }
              }
            });
          });
        }

        keys._u = Object.keys(_u);
        window.addEventListener('resize', content_resize);

        if (!site.metadata.datasets) drop_load_screen();

        if (!site.dataviews[defaults.dataview].dataset) {
          if (1 === site.metadata.datasets.length) {
            defaults.dataset = site.metadata.datasets[0];
          } else if (site.data) {
            const info = site.data.info;
            for (let i = keys._u.length; i--; ) {
              const u = _u[keys._u[i]];
              if (u.dataset in info) {
                defaults.dataset = u.dataset;
                break
              } else if (u.default in info) {
                defaults.dataset = u.default;
                break
              } else if ('select' === u.type && u.options[u.default] && u.options[u.default].value in info) {
                defaults.dataset = u.options[u.default].value;
                break
              } else if (Array.isArray(u.values) && u.values[u.default] && u.values[u.default] in info) {
                defaults.dataset = u.values[u.default];
                break
              }
            }
            if (!defaults.dataset) defaults.dataset = site.metadata.datasets[site.metadata.datasets.length - 1];
          }
          keys._u.forEach(k => {
            const u = _u[k];
            if (!u.dataset) u.dataset = defaults.dataset;
          });
          site.dataviews[defaults.dataview].dataset = defaults.dataset;
        }
        if ('undefined' === typeof DataHandler) {
          site.data = {};
        } else {
          defaults.dataset = valueOf(site.dataviews[defaults.dataview].dataset);
          if ('number' === typeof defaults.dataset) defaults.dataset = site.metadata.datasets[defaults.dataset];
          site.data = new DataHandler(site, defaults, site.data, {
            init: init,
            onload: function () {
              if (site.data.inited) clearTimeout(site.data.inited.load_screen);
              setTimeout(drop_load_screen, 600);
              delete this.onload;
            },
            data_load: function () {
              Object.keys(_c).forEach(request_queue);
            },
          });
        }

        if (page.load_screen && site.data.inited) {
          site.data.inited.load_screen = setTimeout(drop_load_screen, 3000);
        } else {
          page.wrap.style.visibility = 'visible';
        }
      };

      function drop_load_screen() {
        if (!site.data || site.data.inited) clearTimeout(site.data.inited.load_screen);
        page.wrap.style.visibility = 'visible';
        page.load_screen.style.display = 'none';
        if (site.tutorials && 'tutorial' in site.url_options) {
          setTimeout(
            page.tutorials.start_tutorial.bind(page.tutorials, {target: {dataset: {name: site.url_options.tutorial}}}),
            0
          );
        }
      }

      function clear_storage() {
        if (window.localStorage) storage.perm.removeItem(storage.name);
        window.location.reload();
      }

      function content_resize(e, full) {
        const f = page[full ? 'wrap' : 'content'];
        if (!full) {
          f.style.top =
            (page.top_menu && 'open' === page.top_menu.state
              ? page.top_menu.getBoundingClientRect().height
              : page.content_bounds.top +
                ((!page.top_menu && !page.left_menu && !page.right_menu) ||
                (page.right_menu && 'open' === page.right_menu.state) ||
                (page.left_menu && 'open' === page.left_menu.state)
                  ? 0
                  : 40)) + 'px';
          f.style.bottom =
            page.content_bounds.bottom +
            (!page.bottom_menu || 'closed' === page.bottom_menu.state
              ? 0
              : page.bottom_menu.getBoundingClientRect().height) +
            'px';
          f.style.left =
            page.content_bounds.left +
            (!page.left_menu || 'closed' === page.left_menu.state ? 0 : page.left_menu.getBoundingClientRect().width) +
            'px';
        }
        f.style.right =
          page.content_bounds[full ? 'outer_right' : 'right'] +
          (!page.right_menu || 'closed' === page.right_menu.state ? 0 : page.right_menu.getBoundingClientRect().width) +
          'px';
      }

      function trigger_resize() {
        'undefined' === typeof module && window.dispatchEvent(new Event('resize'));
      }

      function get_options_url() {
        let s = '';
        keys._u.forEach(k => {
          const u = _u[k];
          if (u.input && !patterns.settings.test(k)) {
            if (!u.range || u.range[0] !== u.range[1]) {
              let v = u.value();
              if ('off_default' in u ? u.off_default : v !== u.default) {
                if (Array.isArray(v)) v = v.join(',');
                if ('' !== v && null != v && '-1' != v) s += (s ? '&' : '?') + k + '=' + v;
              }
            }
          }
        });
        if (site.data && _u._base_filter.c.size) s += (s ? '&' : '?') + _u._base_filter.value([]);
        return window.location.protocol + '//' + window.location.host + window.location.pathname + s
      }

      function init() {
        if (site.data.variables) {
          defaults.variable = Object.keys(site.data.variables);
          defaults.variable = defaults.variable[defaults.variable.length - 1];
        }
        if (!site.map) site.map = {};
        if (!site.map._overlay_property_selectors) site.map._overlay_property_selectors = [];
        // initialize inputs
        keys._u.forEach(async k => {
          if (_u[k].type in elements) {
            const o = _u[k],
              combobox = 'combobox' === o.type;
            if (o.optionSource) {
              if (patterns.palette.test(o.optionSource)) {
                o.options = [];
                Object.keys(palettes).forEach(v => o.options.push(o.add(v, palettes[v].name)));
                if (-1 === o.default) o.default = defaults.palette;
              } else if (patterns.datasets.test(o.optionSource)) {
                if (-1 === o.default) o.default = defaults.dataset;
                o.options = [];
                site.metadata.datasets.forEach(d => o.options.push(o.add(d)));
              } else {
                o.sensitive = false;
                o.option_sets = {};
                if (patterns.properties.test(o.optionSource)) {
                  site.map._overlay_property_selectors.push(o);
                }
                if (o.depends) add_dependency(o.depends, {type: 'options', id: o.id});
                if (o.dataset in _u) add_dependency(o.dataset, {type: 'options', id: o.id});
                if (o.view) add_dependency(o.view, {type: 'options', id: o.id});
                const v = valueOf(o.dataset) || defaults.dataset;
                if (!o.dataset) o.dataset = v;
                if (v in site.data.info) conditionals.options(o);
              }
            }
            if (combobox || 'select' === o.type) {
              // resolve options
              o.set_current = conditionals.set_current.bind(o);
              if (Array.isArray(o.values)) {
                o.values = {};
                o.display = {};
                let new_display = true;
                const select = 'select' === o.type;
                o.options.forEach(e => {
                  if (select) e.dataset.value = e.value;
                  if (new_display) new_display = e.dataset.value === e.innerText;
                });
                o.options.forEach((e, i) => {
                  o.values[e.dataset.value] = i;
                  if (new_display) e.innerText = site.data.format_label(e.dataset.value);
                  o.display[e.innerText] = i;
                });
                if (!(o.default in o.values) && !(o.default in _u)) {
                  o.default = Number(o.default);
                  if (isNaN(o.default)) o.default = -1;
                  if (-1 !== o.default && o.default < o.options.length) {
                    o.default = o.options[o.default].dataset.value;
                  } else {
                    o.default = -1;
                  }
                }
                o.source = '';
                o.id in site.url_options ? o.set(site.url_options[o.id]) : o.reset();
              }
              o.subset = o.e.getAttribute('data-subset') || 'all';
              o.selection_subset = o.e.getAttribute('data-selectionSubset') || o.subset;
              if (o.type in site && o.id in site[o.type]) {
                o.settings = site[o.type][o.id];
                if (o.settings.filters) {
                  o.filters = o.settings.filters;
                  o.current_filter = {};
                  Object.keys(o.filters).forEach(f => {
                    add_dependency(o.filters[f], {type: 'filter', id: o.id});
                  });
                  o.filter = function () {
                    Object.keys(this.filters).forEach(f => {
                      this.current_filter[f] = valueOf(this.filters[f]);
                    });
                    let first;
                    Object.keys(this.values).forEach((v, i) => {
                      let pass = false;
                      if (v in site.data.variables && 'meta' in site.data.variables[v]) {
                        for (const k in this.current_filter)
                          if (k in site.data.variables[v].meta) {
                            pass = site.data.variables[v].meta[k] === this.current_filter[k];
                            if (!pass) break
                          }
                      }
                      if (pass && !first) first = v;
                      this.options[i].classList[pass ? 'remove' : 'add']('hidden');
                    });
                    this.current_index = this.values[this.value()];
                    if (
                      first &&
                      (-1 === this.current_index || this.options[this.current_index].classList.contains('hidden'))
                    ) {
                      this.set(first);
                    }
                  }.bind(o);
                }
              }
            } else if ('number' === o.type) {
              // retrieve option values
              o.min = o.e.getAttribute('min');
              o.min_ref = parseFloat(o.min);
              o.min_indicator = o.e.parentElement.parentElement.querySelector('.indicator-min');
              if (o.min_indicator) {
                o.min_indicator.addEventListener(
                  'click',
                  function () {
                    this.set(this.parsed.min);
                  }.bind(o)
                );
              }
              o.max = o.e.getAttribute('max');
              o.max_ref = parseFloat(o.max);
              o.max_indicator = o.e.parentElement.parentElement.querySelector('.indicator-max');
              if (o.max_indicator) {
                o.max_indicator.addEventListener(
                  'click',
                  function () {
                    this.set(this.parsed.max);
                  }.bind(o)
                );
              }
              o.ref = isNaN(o.min_ref) || isNaN(o.max_ref);
              o.range = [o.min_ref, o.max_ref];
              o.step = parseFloat(o.e.step) || 1;
              o.parsed = {min: undefined, max: undefined};
              o.depends = {};
              o.default_max = 'max' === o.default || 'last' === o.default;
              o.default_min = 'min' === o.default || 'first' === o.default;
              o.update = async function () {
                const view = _u[this.view],
                  variable = valueOf(this.variable || view.y);
                if (!view.time_range) view.time_range = {time: []};
                let d = view.get ? view.get.dataset() : valueOf(this.dataset),
                  min = valueOf(this.min) || view.time,
                  max = valueOf(this.max) || view.time;
                if (patterns.minmax.test(min)) min = _u[this.min][min];
                if (patterns.minmax.test(max)) max = _u[this.max][max];
                this.parsed.min = isNaN(this.min_ref)
                  ? 'undefined' === typeof min
                    ? view.time_range.time[0]
                    : 'number' === typeof min
                    ? min
                    : min in site.data.variables
                    ? site.data.variables[min].info[d || site.data.variables[min].datasets[0]].min
                    : parseFloat(min)
                  : this.min_ref;
                this.parsed.max = isNaN(this.max_ref)
                  ? 'undefined' === typeof max
                    ? view.time_range.time[1]
                    : 'number' === typeof max
                    ? max
                    : max in site.data.variables
                    ? site.data.variables[max].info[d || site.data.variables[max].datasets[0]].max
                    : parseFloat(max)
                  : this.min_ref;
                if (this.default_min) {
                  this.current_default = this.parsed.min;
                } else if (this.default_max) {
                  this.current_default = this.parsed.max;
                }
                if (this.ref && variable in site.data.variables) {
                  this.range[0] = this.e.min = isNaN(this.min_ref)
                    ? Math.max(view.time_range.time[0], this.parsed.min)
                    : this.min_ref;
                  this.range[1] = this.e.max = isNaN(this.max_ref)
                    ? Math.min(view.time_range.time[1], this.parsed.max)
                    : this.max_ref;
                  if (!this.depends[view.y]) {
                    this.depends[view.y] = true;
                    add_dependency(view.y, {type: 'update', id: this.id});
                  }
                  if (this.source > this.parsed.max || this.source < this.parsed.min) this.reset();
                  this.variable = await site.data.get_variable(variable, this.view);
                } else {
                  this.e.min = this.parsed.min;
                  if (this.parsed.min > this.source || (!this.source && this.default_min)) this.set(this.parsed.min);
                  this.e.max = this.parsed.max;
                  if (this.parsed.max < this.source || (!this.source && this.default_max)) this.set(this.parsed.max);
                }
              }.bind(o);
              if (o.view) add_dependency(o.view, {type: 'update', id: o.id});
              if (!(o.max in site.data.variables)) {
                if (o.max in _u) {
                  add_dependency(o.max, {type: 'max', id: o.id});
                } else o.e.max = parseFloat(o.max);
              } else if (o.view) {
                add_dependency(o.view + '_time', {type: 'max', id: o.id});
              }
              if (!(o.min in site.data.variables)) {
                if (o.min in _u) {
                  add_dependency(o.min, {type: 'min', id: o.id});
                } else o.e.min = parseFloat(o.min);
              } else if (o.view) {
                add_dependency(o.view + '_time', {type: 'min', id: o.id});
              }
              if ('undefined' !== typeof o.default) {
                if (patterns.number.test(o.default)) {
                  o.default = Number(o.default);
                } else
                  o.reset = o.default_max
                    ? function () {
                        if (this.range) {
                          this.current_default = valueOf(this.range[1]);
                          this.set(this.current_default);
                        }
                      }.bind(o)
                    : o.default_max
                    ? function () {
                        if (this.range) {
                          this.current_default = valueOf(this.range[0]);
                          this.set(this.current_default);
                        }
                      }.bind(o)
                    : this.default in _u
                    ? function () {
                        this.current_default = valueOf(this.default);
                        this.set(this.current_default);
                      }.bind(o)
                    : function () {};
              }
              if (o.variable) {
                const d = -1 === site.metadata.datasets.indexOf(o.dataset) ? defaults.dataset : o.dataset;
                if (o.variable in _u) {
                  add_dependency(o.variable, {type: 'update', id: o.id});
                } else if (o.variable in site.data.variables) {
                  o.e.min = o.min = o.parsed.min = o.range[0] = site.data.variables[o.variable].info[d].min;
                  o.e.max = o.max = o.parsed.max = o.range[1] = site.data.variables[o.variable].info[d].max;
                }
              }
            } else if ('checkbox' === o.type) {
              o.source = [];
              o.current_index = [];
              o.default = o.default.split(',');
            }
            if (Array.isArray(o.values)) {
              if (!o.values.length) {
                o.values = [];
                if (o.options.length) o.options.forEach(e => o.values.push(e.value || e.dataset.value));
              }
              if (o.values.length && !(o.default in _u) && -1 === o.values.indexOf(o.default)) {
                o.default = parseInt(o.default);
                o.default = o.values.length > o.default ? o.values[o.default] : '';
              }
            }

            // add listeners
            if (combobox || 'select' === o.type || 'number' === o.type || 'intext' === o.type) {
              o.e.addEventListener('change', o.listen);
              if (
                o.e.parentElement.lastElementChild &&
                o.e.parentElement.lastElementChild.classList.contains('select-reset')
              ) {
                o.e.parentElement.lastElementChild.addEventListener('click', o.reset);
              }
            } else if ('switch' === o.type) {
              if ('boolean' !== typeof o.default) o.default = o.e.checked;
              o.e.addEventListener('change', o.listen);
            } else if (o.listen) {
              o.options.forEach(oi => oi.addEventListener('click', o.listen));
            }
            // initialize settings inputs
            if (patterns.settings.test(o.id)) {
              o.setting = o.id.replace(patterns.settings, '');
              if (null == o.default && o.setting in site.settings) o.default = site.settings[o.setting];
              add_dependency(o.id, {type: 'setting', id: o.id});
            }
            if (!o.view) o.view = defaults.dataview;
            const v = site.url_options[o.id] || storage.get(o.id.replace(patterns.settings, ''));
            if (v) {
              o.set(patterns.bool.test(v) ? !!v || 'true' === v : v);
            } else o.reset && o.reset();
          }
        });
        // initialize dataviews
        Object.keys(site.dataviews).forEach(k => {
          const e = site.dataviews[k];
          _u[k] = e;
          e.id = k;
          e.value = function () {
            if (this.get) {
              this.reparse();
              return (
                '' +
                this.parsed.dataset +
                _u._entity_filter.entities.size +
                site.data.inited[this.parsed.dataset] +
                this.parsed.id_source +
                Object.keys(this.parsed.ids) +
                this.parsed.features +
                this.parsed.variables +
                site.settings.summary_selection
              )
            }
          }.bind(e);
          if ('string' === typeof e.palette && e.palette in _u) {
            add_dependency(e.palette, {type: 'dataview', id: k});
          }
          if ('string' === typeof e.dataset && e.dataset in _u) {
            add_dependency(e.dataset, {type: 'dataview', id: k});
          }
          if ('string' === typeof e.ids && e.ids in _u) {
            add_dependency(e.ids, {type: 'dataview', id: k});
          }
          e.time_range = {dataset: '', variable: '', index: [], time: [], filtered: []};
          add_dependency(k, {type: 'time_range', id: k});
          add_dependency('_base_filter', {type: 'dataview', id: k});
          add_dependency('_entity_filter', {type: 'dataview', id: k});
          if (e.x in _u) add_dependency(e.x, {type: 'time_range', id: k});
          if (e.y in _u) add_dependency(e.y, {type: 'time_range', id: k});
          if (e.features)
            Object.keys(e.features).forEach(f => {
              if ('string' === typeof e.features[f] && e.features[f] in _u) {
                add_dependency(e.features[f], {type: 'dataview', id: k});
              }
            });
          if (e.variables)
            e.variables.forEach(v => {
              if ('variable' in v) {
                if (v.variable in _u) {
                  add_dependency(v.variable, {type: 'dataview', id: k});
                }
              } else e.variables.splice(i, 1);
              if ('type' in v) {
                if (v.type in _u) {
                  add_dependency(v.type, {type: 'dataview', id: k});
                }
              } else v.type = '=';
              if ('value' in v) {
                if (v.value in _u) {
                  add_dependency(v.value, {type: 'dataview', id: k});
                }
              } else v.value = 0;
            });
          compile_dataview(e);
          conditionals.dataview(e);
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
        Object.keys(site.data.loaded)
          .reverse()
          .forEach(d => {
            const u = elements.combobox.create(d, void 0, {search: true, multi: true, clearable: true}, 'filter.' + d);
            e.entity_inputs[d] = u;
            e.entity_filters.lastElementChild.appendChild(document.createElement('div'));
            e.entity_filters.lastElementChild.lastElementChild.className = 'col-sm';
            e.entity_filters.lastElementChild.lastElementChild.appendChild(u.e.parentElement);
            u.e.parentElement.classList.add('form-floating');
            u.listbox.classList.add('multi');
            u.option_sets = {};
            u.dataset = d;
            u.loader = function () {
              site.data.retrieve(this.dataset, site.data.info[this.dataset].site_file);
              this.e.removeEventListener('click', this.loader);
            }.bind(u);
            if (!site.data.loaded[d]) {
              u.e.addEventListener('click', u.loader);
            }
            u.onchange = function () {
              conditionals.id_filter();
              request_queue('_entity_filter');
            }.bind(u);
            u.set_current = conditionals.set_current.bind(u);
            fill_ids_options(
              u,
              d,
              u.option_sets,
              function () {
                this.set_current();
                toggle_input(this, !!this.options.length);
                Object.keys(this.values).forEach(id => {
                  _u._entity_filter.entities.set(id, site.data.entities[id]);
                });
                _u._entity_filter.registered[d] = true;
                this.set(this.id in site.url_options ? site.url_options[this.id].split(',') : -1);
              }.bind(u)
            );
            toggle_input(u, !!u.options.length);
          });

        // // variable filter
        e.body.appendChild((e.variable_filters = document.createElement('div')));
        e.variable_filters.appendChild(document.createElement('p'));
        e.variable_filters.lastElementChild.className = 'h6';
        e.variable_filters.lastElementChild.innerText = 'Variable Conditions';

        function add_filter_condition(variable, presets) {
          presets = presets || {};
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
              info: site.data.variables[variable].info,
              view: _u[defaults.dataview],
            },
            d = f.view.get.dataset(),
            range = f.info[d].time_range,
            times = site.data.meta.overall.value;
          _u._base_filter.c.set(f.id, f);
          if (presets.time_component) f.component = String(times[f.component]);

          let ee;
          // variable name
          e.appendChild(document.createElement('td'));
          e.lastElementChild.appendChild((ee = document.createElement('p')));
          ee.id = f.id;
          ee.className = 'cell-text';
          ee.innerText = f.info[d].info.short_name;
          e.lastElementChild.appendChild(document.createElement('p'));
          f.summary = {
            f,
            update: function () {
              const d = this.f.view.get.dataset(),
                range = this.f.info[d].time_range,
                times = site.data.meta.overall.value;
              if (d !== this.add.Dataset) {
                this.add.Dataset = d;
                this.add.First = times[range[0]] || 'NA';
                this.add.Last = times[range[1]] || 'NA';
                const s = this.f.info[d];
                for (let i = this.table.firstElementChild.childElementCount; i--; ) {
                  const h = this.table.firstElementChild.children[i].innerText,
                    n = h.toLowerCase();
                  this.table.lastElementChild.children[i].innerText = n in s ? site.data.format_value(s[n]) : this.add[h];
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
          ee.addEventListener(
            'change',
            function () {
              f.active = !f.active;
              request_queue('_base_filter');
            }.bind(f)
          );

          // component combobox
          e.appendChild(document.createElement('td'));
          e.lastElementChild.appendChild((ee = document.createElement('label')));
          ee.innerText = 'Component';
          ee.className = 'filter-label';
          ee.id = f.id + '_component';
          const comp_select = elements.combobox.create('component', filter_components.Time);
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
          ee.addEventListener('change', e => {
            f.operator = e.target.selectedOptions[0].value;
            request_queue('_base_filter');
          })
          ;['>=', '=', '!=', '<='].forEach(k => {
            ee.appendChild(document.createElement('option'));
            ee.lastElementChild.value = ee.lastElementChild.innerText = k;
            if (k === f.operator) ee.lastElementChild.selected = true;
          });

          // value input
          e.appendChild(document.createElement('td'));
          e.lastElementChild.appendChild((ee = document.createElement('label')));
          ee.innerText = 'Value';
          ee.className = 'filter-label';
          ee.id = f.id + '_value';
          const value_select = elements.combobox.create('component', ['min', 'q1', 'median', 'mean', 'q3', 'max']);
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
          value_select.onchange = async function (f) {
            f.value = this.value();
            if (patterns.number.test(f.value)) {
              f.value = Number(f.value);
              f.value_source = '';
            } else {
              f.view.reparse();
              const v = await site.data.get_variable(f.variable, f.view.id),
                s = v && v.views[f.view.id].summaries[f.view.parsed.dataset];
              if (s && f.value in s) {
                const a = f.view.parsed.variable_values.get(f.id);
                f.value_source = f.value;
                f.value = s[f.value][a.comp_fun(a, f.view.parsed)];
              }
            }
            request_queue('_base_filter');
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
          ee.addEventListener(
            'mouseup',
            function (e) {
              if (1 === e.which) {
                this.e.parentElement.removeChild(this.e);
                _u._base_filter.c.delete(this.id);
                if (!_u._base_filter.c.size) page.modal.filter.variable_filters.lastElementChild.classList.add('hidden');
                request_queue('_base_filter');
              }
            }.bind(f)
          );
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

        const filter_select = elements.combobox.create(
          'Add Variable Condition',
          void 0,
          {strict: true, search: true, clearable: true, floating: true, accordion: true, group: 'category'},
          'filter_variable_dropdown'
        );
        filter_select.input = false;
        filter_select.settings.filter_table = document.querySelector('.filter-body');
        filter_select.onchange = function () {
          const value = this.value();
          if (value in site.data.variables) {
            add_filter_condition(value);
            this.selection.innerText = '';
            const input = document.querySelectorAll('.filter-body .combobox-input');
            if (input && input.length) input[input.length - 1].focus();
          }
        }.bind(filter_select);
        filter_select.view = defaults.dataview;
        filter_select.option_sets = {};
        filter_select.optionSource = 'variables';
        add_dependency(defaults.dataview, {type: 'options', id: filter_select.id});
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
        ee.appendChild((ee = document.createElement('tr')))
        ;['Variable', 'Result', 'Active', 'Component', 'Operator', 'Value', 'Remove'].forEach(h => {
          ee.appendChild(document.createElement('th'));
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
                  };
            ee.lastElementChild.appendChild(l.wrapper);
            ee.lastElementChild.className = 'has-note';
            l.wrapper.innerText = h;
            l.wrapper.id = l.id;
            l.wrapper.setAttribute('data-of', l.id);
            l.wrapper.setAttribute('aria-description', l.note);
            ee.lastElementChild.addEventListener('mouseover', tooltip_trigger.bind(l));
          } else {
            ee.lastElementChild.innerText = h;
          }
        });
        e.variable_filters.lastElementChild.appendChild((ee = document.createElement('p')));
        ee.className = 'note';
        ee.innerText = 'Summaries are across time within each unfiltered dataset.';

        keys._u = Object.keys(_u);
        if (site.query) {
          site.parsed_query = site.data.parse_query(site.query);
          if (site.parsed_query.variables.conditions.length) {
            site.parsed_query.variables.conditions.forEach(f => {
              const info = site.data.variable_info[f.name];
              if (info) add_filter_condition(f.name, f);
            });
          }
        }
      }

      function gtag() {
        if (site.settings.tracking) window.dataLayer.push(arguments);
      }

      function valueOf(v) {
        if (v in _u) v = _u[v];
        if (v && v.value) v = valueOf(v.value());
        return v
      }

      function tooltip_trigger() {
        if (site.settings.hide_tooltips || this.id === page.tooltip.showing) return void 0
        page.tooltip.showing = this.id;
        page.tooltip.e.firstElementChild.innerText = this.note;
        page.tooltip.e.classList.remove('hidden');
        const p = this.wrapper.getBoundingClientRect(),
          t = page.tooltip.e.getBoundingClientRect();
        page.tooltip.e.style.left = Math.max(0, Math.min(p.x, p.x + p.width / 2 - t.width / 2)) + 'px';
        page.tooltip.e.style.top = p.y + (p.y < t.height ? p.height + 5 : -t.height - 5) + 'px';
      }

      function tooltip_clear(e) {
        if (
          page.tooltip.showing &&
          ('blur' === e.type || page.tooltip.showing !== (e.target.getAttribute('data-of') || e.target.id))
        ) {
          page.tooltip.showing = '';
          page.tooltip.e.classList.add('hidden');
        }
      }

      async function retrieve_layer(u, source, callback) {
        const mapId = source.name ? source.name + (source.time || '') : source.url;
        if (source.url in site.map._raw) {
          process_layer(source, u);
          site.map._queue[mapId].retrieved = true;
          callback && callback();
        } else {
          if (site.map._queue[mapId] && 'retrieved' in site.map._queue[mapId]) {
            if (callback) {
              if (!site.map._queue[mapId].callbacks) site.map._queue[mapId].callbacks = [];
              site.map._queue[mapId].callbacks.push(callback);
            }
          } else {
            site.map._queue[mapId].retrieved = false;
            const f = new window.XMLHttpRequest();
            f.onreadystatechange = () => {
              if (4 === f.readyState && 200 === f.status) {
                site.map._raw[source.url] = f.responseText;
                if (source.name) {
                  site.map._queue[mapId].retrieved = true;
                }
                if (site.map._queue[mapId].callbacks) {
                  if (callback) site.map._queue[mapId].callbacks.push(callback);
                  site.map._queue[mapId].callbacks.forEach(f => f());
                } else callback && callback();
              }
            };
            f.open('GET', source.url, true);
            f.send();
          }
        }
      }

      function process_layer(source, u) {
        let p, id;
        const has_time = 'time' in source,
          layerId = source.name + (has_time ? source.time : '');
        site.map[u.id]._layers[layerId] = L.geoJSON(JSON.parse(site.map._raw[source.url]), {
          onEachFeature: (f, l) => {
            l.on({
              mouseover: elements.map.mouseover.bind(u),
              mouseout: elements.map.mouseout.bind(u),
              click: elements.map.click.bind(u),
            });
            l.setStyle({weight: 0, fillOpacity: 0});
            l.source = source;
            p = l.feature.properties;
            id = p[source.id_property];
            if (!(id in site.data.entities) && patterns.leading_zeros.test(id))
              id = p[source.id_property] = id.replace(patterns.leading_zeros, '');
            if (id in site.data.entities) {
              if (!('layer' in site.data.entities[id])) site.data.entities[id].layer = {};
            } else {
              site.data.entities[id] = {layer: {}, features: {id: id}};
            }
            if (has_time) {
              if (!(u.id in site.data.entities[id].layer)) site.data.entities[id].layer[u.id] = {has_time: true};
              site.data.entities[id].layer[u.id][source.time] = l;
            } else site.data.entities[id].layer[u.id] = l;
            l.entity = site.data.entities[id];
            if (site.data.entities[id].features)
              Object.keys(p).forEach(f => {
                if (!(f in site.data.entities[id].features)) {
                  if (
                    'name' === f.toLowerCase() &&
                    (!('name' in site.data.entities[id].features) ||
                      site.data.entities[id].features.id === site.data.entities[id].features.name)
                  ) {
                    site.data.entities[id].features[f.toLowerCase()] = p[f];
                  } else {
                    site.data.entities[id].features[f] = p[f];
                  }
                }
              });
          },
        });
        site.data.inited[layerId + u.id] = true;
        if (site.map._waiting && site.map._waiting[source.name]) {
          for (let i = site.map._waiting[source.name].length; i--; ) {
            request_queue(site.map._waiting[source.name][i]);
          }
        }
      }

      function show_overlay(u, o, time) {
        let i = 0,
          source = 'string' === typeof o.source ? o.source : '';
        if (!source && o.source) {
          for (i = o.source.length; i--; ) {
            if (!o.source[i].time || time === o.source[i].time) {
              if (o.source[i].name) delete o.source[i].name;
              source = o.source[i].url;
              break
            }
          }
        }
        if (source) {
          if (source in site.map._raw) {
            if (!(source in site.map[u.id]._layers)) {
              const s = {};
              if (!site.map._queue[source].processed) {
                site.map._queue[source].property_summaries = s;
              }
              site.map[u.id]._layers[source] = L.geoJSON(JSON.parse(site.map._raw[source]), {
                pointToLayer: (point, coords) => L.circleMarker(coords),
                onEachFeature: l => {
                  const props = l.properties;
                  if (props) {
                    Object.keys(props).forEach(f => {
                      const v = props[f];
                      if ('number' === typeof v) {
                        if (!(f in s)) s[f] = [Infinity, -Infinity];
                        if (v < s[f][0]) s[f][0] = v;
                        if (v > s[f][1]) s[f][1] = v;
                      }
                    });
                  }
                },
              }).on('mouseover', l => {
                const layer = l.layer;
                if (layer && !layer._tooltip) {
                  const props = layer.feature && layer.feature.properties;
                  if (props) {
                    const e = document.createElement('table');
                    Object.keys(props).forEach(f => {
                      const v = props[f],
                        r = document.createElement('tr');
                      r.appendChild(document.createElement('td'));
                      r.appendChild(document.createElement('td'));
                      r.firstElementChild.innerText = f;
                      r.lastElementChild.innerText = v;
                      e.appendChild(r);
                    });
                    layer.bindTooltip(e);
                    layer.openTooltip();
                  }
                }
              });
              Object.keys(s).forEach(f => {
                s[f].push(s[f][1] - s[f][0]);
                if (!s[f][2]) delete s[f];
              });
              site.map._overlay_property_selectors.forEach(u => {
                if (!(source in u.option_sets)) {
                  fill_overlay_properties_options(u, source, u.option_sets);
                  u.dataset = source;
                  u.variable = '';
                }
              });
            }
            site.map._overlay_property_selectors.forEach(u => {
              u.dataset = source;
              conditionals.options(u);
            });
            u.overlay.clearLayers();
            let n = 0;
            const summaries = site.settings.circle_property && site.map._queue[source].property_summaries,
              prop_summary = summaries && summaries[site.settings.circle_property];
            site.map[u.id]._layers[source].eachLayer(l => {
              if (o.filter) {
                for (let i = o.filter.length; i--; ) {
                  if (!o.filter[i].check(l.feature.properties[o.filter[i].feature], o.filter[i].value)) return
                }
              }
              n++;
              l.setRadius(
                prop_summary
                  ? ((l.feature.properties[site.settings.circle_property] - prop_summary[0]) / prop_summary[2] + 0.5) *
                      site.settings.circle_radius
                  : site.settings.circle_radius
              ).setStyle({
                weight: site.settings.polygon_outline,
                color: 'white',
                opacity: 0.5,
                fillOpacity: 0.5,
                fillColor: 'black',
              });
              l.addTo(u.overlay);
            });
            if (n) u.overlay_control.addTo(u.map);
          } else return retrieve_layer(u, o.source[i], show_overlay.bind(null, u, o, time))
        }
      }
      function component_fun(c) {
        if ('string' === typeof c && patterns.number.test(c)) {
          c = site.data.meta.overall.value.indexOf(Number(c));
          if (-1 === c)
            return function () {
              return NaN
            }
        }
        return 'number' === typeof c
          ? time_funs.number.bind(c)
          : c in time_funs
          ? time_funs[c]
          : function () {
              return NaN
            }
      }
      function compile_dataview(v) {
        v.times = [];
        if (v.time_filters) {
          v.time_filters = [
            {variable: defaults.time, type: '>=', value: 'filter.time_min'},
            {variable: defaults.time, type: '<=', value: 'filter.time_max'},
          ];
          add_dependency(v.id + '_time', {type: 'min', id: 'filter.time_min'});
          add_dependency(v.id + '_time', {type: 'max', id: 'filter.time_max'});
          v.time_filters.forEach(f => {
            if (f.value in _u) {
              add_dependency(f.value, {type: 'time_filters', id: v.id});
            }
          });
        }
        v.selection = {ids: {}, features: {}, variables: [], dataset: {}, filtered: {}, full_filter: {}, all: {}};
        v.n_selected = {ids: 0, features: 0, variables: 0, dataset: 0, filtered: 0, full_filter: 0, all: 0};
        v.get = {
          dataset: function () {
            let d = defaults.dataset;
            if ('string' === typeof v.dataset && v.dataset in _u) {
              d = valueOf(_u[v.dataset].value());
              if (!(d in site.data.data_queue)) {
                d = defaults.dataset;
                _u[v.dataset].set(d);
              }
            } else {
              d = valueOf(v.dataset);
            }
            return d in site.data.data_queue ? d : defaults.dataset
          },
          ids: function (single) {
            const id = valueOf('string' === typeof v.ids && v.ids in _u ? _u[v.ids].value() : v.ids);
            if ('' !== id && -1 != id) {
              if (single) return id
              const ids = {},
                e = site.data.entities[id];
              ids[id] = true;
              if (e && e.relations) Object.keys(e.relations.children).forEach(k => (ids[k] = true));
              return ids
            } else if (!single && _u._entity_filter.selected.length) {
              return _u._entity_filter.select_ids
            }
            return false
          },
          features: function () {
            let s = '';
            v.features &&
              Object.keys(v.features).forEach(k => {
                s += k + valueOf(v.features[k]);
              });
            return s
          },
          variables: function () {
            if (v.variables || _u._base_filter.c.size) {
              if (!v.parsed.variable_values.size) v.reparse();
              let s = '';
              v.parsed.variable_values.forEach(vi => {
                vi.filter.summary.update();
                s += vi.name + vi.operator + vi.component + vi.value + vi.active;
              });
              return s
            } else return ''
          },
          time_filters: function () {
            let s = '';
            v.time_filters &&
              v.time_filters.forEach(f => {
                s += f.value in _u ? valueOf(f.value) : f.value;
              });
            return s
          },
        };
        v.ids_check = function (a, b) {
          return !a || b in a
        };
        v.parsed = {
          dataset: '',
          ids: '',
          features: '',
          variables: '',
          time_filters: '',
          time_agg: 0,
          id_source: '',
          variable_values: new Map(),
          feature_values: {},
        };
        v.reparse = function () {
          this.parsed.dataset = this.get.dataset();
          this.parsed.ids = this.get.ids();
          this.parsed.time_filters = this.get.time_filters();
          this.parsed.time_agg =
            this.parsed.dataset in site.data.meta.times
              ? valueOf(this.time_agg) - site.data.meta.times[this.parsed.dataset].range[0]
              : 0;
          if (
            'string' === typeof this.ids &&
            this.ids in _u &&
            (('virtual' === _u[this.ids].type && _u[this.ids].source in _u) ||
              ('depends' in _u[this.ids] && _u[this.ids].depends in _u))
          ) {
            this.parsed.id_source =
              'virtual' === _u[this.ids].type ? valueOf(_u[_u[this.ids].source].dataset) : _u[_u[this.ids].depends].value();
          }
          if (this.features) {
            this.parsed.feature_values = {};
            for (let k in this.features)
              if (k in this.features) {
                this.parsed.feature_values[k] = {value: valueOf(this.features[k])};
                this.parsed.feature_values[k].operator =
                  'string' === typeof this.parsed.feature_values[k].value ? 'equals' : 'includes';
              }
            this.parsed.features = this.get.features();
          } else this.parsed.features = '';
          this.parsed.variable_values.clear();
          if (_u._base_filter.c.size)
            _u._base_filter.c.forEach(f => {
              this.parsed.variable_values.set(f.id, {
                filter: f,
                name: f.variable,
                range: site.data.variables[f.variable].info[this.parsed.dataset].time_range,
                operator: f.operator,
                value: f.value ? Number(f.value) : NaN,
                value_type: 'number',
                component: f.component,
                active: f.active,
                comp_fun: component_fun(f.component),
              });
            });
          if (this.variables || this.parsed.variable_values.size) {
            if (this.variables)
              this.variables.forEach(v => {
                const value = valueOf(v.value);
                this.parsed.variable_values.set(this.parsed.variable_values.size, {
                  name: v.variable,
                  operator: v.operator,
                  value: value,
                  component: v.component,
                  active: true,
                  comp_fun: component_fun(v.component),
                });
              });
            this.parsed.variables = this.get.variables();
          } else this.parsed.variables = '';
        }.bind(v);
        v.checks = {
          dataset: function (e) {
            return this.parsed.dataset === e.group
          }.bind(v),
          ids: function (e) {
            return e.features && this.ids_check(this.parsed.ids, e.features.id)
          }.bind(v),
          features: function (e) {
            if (e.features) {
              let k,
                v,
                pass = true;
              for (k in this.parsed.feature_values) {
                if (k in this.parsed.feature_values) {
                  v = this.parsed.feature_values[k];
                  pass = DataHandler.checks[v.operator](v.value, valueOf(e.features[k]));
                  if (!pass) break
                }
              }
              return pass
            } else return true
          }.bind(v),
          variables: function (e) {
            if (e.data) {
              let pass = true;
              this.parsed.variable_values.forEach(v => {
                if (v.active && !isNaN(v.value)) {
                  const ev = e.get_value(v.name, v.comp_fun(v, this.parsed)),
                    ck = !isNaN(ev) && DataHandler.checks[v.operator](ev, v.value);
                  v.filter[ck ? 'passed' : 'failed']++;
                  if (pass && !ck) pass = false;
                } else {
                  v.filter.failed++;
                }
              });
              return pass
            } else return true
          }.bind(v),
        };
        v.check = function (e) {
          return {
            ids: !this.ids || this.checks.ids(e),
            features: !this.features || this.checks.features(e),
            variables: (!this.variables && !_u._base_filter.c.size) || this.checks.variables(e),
            dataset: !this.dataset || this.checks.dataset(e),
          }
        }.bind(v);
      }

      function global_update() {
        meta.retain_state = false;
        keys._u.forEach(request_queue);
      }

      function global_reset() {
        meta.retain_state = false;
        keys._u.forEach(k => {
          if (!_u[k].setting && _u[k].reset) {
            _u[k].reset();
            request_queue(k);
          }
        });
      }

      function request_queue(id) {
        queue[id] = true;
        if (queue._timeout > 0) clearTimeout(queue._timeout);
        queue._timeout = setTimeout(run_queue, 20);
        meta.lock_after = id;
      }

      function run_queue() {
        if (queue._timeout > 0) clearTimeout(queue._timeout);
        queue._timeout = -1;
        keys._u.forEach(k => {
          if (queue[k]) {
            const d = refresh_conditions(k);
            if (d) {
              if (!(k in site.data.data_queue[d])) site.data.data_queue[d][k] = run_queue;
              return false
            }
            queue[k] = false;
          }
        });
        let k = get_options_url();
        if (site.data.inited.first && k !== site.state) {
          site.state = k;
          Object.keys(site.url_options).forEach(s => {
            if (patterns.embed_setting.test(s))
              k +=
                '&' +
                s +
                '=' +
                ('navcolor' === s ? site.url_options[s].replace(patterns.hashes, '%23') : site.url_options[s]);
          });
          if (!site.settings.hide_url_parameters) {
            window.history.replaceState(Date.now(), '', k);
          }
          setTimeout(content_resize, 50);
        }
      }

      function refresh_conditions(id) {
        if (id in _c) {
          const c = _u[id],
            d = _c[id],
            r = [],
            v = c && c.value() + '';
          if (c && (!meta.retain_state || c.state !== v)) {
            const view = site.dataviews[c.view],
              dd = c.dataset ? valueOf(c.dataset) : view ? view.get.dataset() : v;
            if (site.data.info && dd in site.data.loaded && !site.data.loaded[dd]) {
              if (!c.deferred) site.data.retrieve(dd, site.data.info[dd].site_file);
              return dd
            }
            c.state = v;
            d.forEach(di => {
              if ('rule' === di.type) {
                if (-1 === r.indexOf(di.rule)) {
                  r.push(di.rule);
                }
              } else {
                if ('function' === typeof _u[di.id][di.type]) {
                  _u[di.id][di.type]();
                } else {
                  conditionals[di.type](_u[di.id], c);
                }
              }
            });
            r.forEach(i => {
              let pass = false;
              const ri = site.rules[i],
                n = ri.condition.length;
              for (let i = 0; i < n; i++) {
                const ck = ri.condition[i];
                pass = ck.check();
                if (ck.any ? pass : !pass) break
              }
              Object.keys(ri.effects).forEach(k => {
                const e = ri.effects[k];
                if (pass) {
                  if ('display' === k) {
                    e.e.classList.remove('hidden');
                  } else if ('lock' === k) {
                    e.forEach(u => {
                      u.e.classList.remove('locked');
                      toggle_input(u, true);
                    });
                  } else if (k in _u) {
                    _u[k].set(valueOf(e));
                  }
                } else if ('display' === k) {
                  if (!e.e.classList.contains('hidden')) {
                    e.e.classList.add('hidden');
                    if (e.u && e.u.reset) e.u.reset();
                    e.e.querySelectorAll('.auto-input').forEach(c => {
                      if (c.id in _u && _u[c.id].reset) _u[c.id].reset();
                    });
                  }
                } else if ('lock' === k) {
                  e.forEach(u => {
                    u.e.classList.add('locked');
                    toggle_input(u);
                  });
                } else if ('default' in ri) {
                  if (k in _u) {
                    _u[k].set(valueOf(ri.default));
                  }
                }
              });
            });
            if (id === meta.lock_after) meta.retain_state = true;
          }
        }
      }
    };
    if ('undefined' === typeof module) {
      community(window, document, site);
    } else module.exports = community;

}));
//# sourceMappingURL=community.js.map
