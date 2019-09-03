/*
 plugin: zepto.mdatertimer
 author: 吕大豹，CarryGor(改良)
 desc: 移动端日期时间选择控件
 version: 1.1
 */
(function ($) {
    /*tap event*/
    !function (a) {
        var b = {}, c = {};
        c.attachEvent = function (b, c, d) {
            return "addEventListener" in a ? b.addEventListener(c, d, !1) : void 0
        }, c.fireFakeEvent = function (a, b) {
            return document.createEvent ? a.target.dispatchEvent(c.createEvent(b)) : void 0
        }, c.createEvent = function (b) {
            if (document.createEvent) {
                var c = a.document.createEvent("HTMLEvents");
                return c.initEvent(b, !0, !0), c.eventName = b, c
            }
        }, c.getRealEvent = function (a) {
            return a.originalEvent && a.originalEvent.touches && a.originalEvent.touches.length ? a.originalEvent.touches[0] : a.touches && a.touches.length ? a.touches[0] : a
        };
        var d = [{
            test: ("propertyIsEnumerable" in a || "hasOwnProperty" in document) && (a.propertyIsEnumerable("ontouchstart") || document.hasOwnProperty("ontouchstart")),
            events: { start: "touchstart", move: "touchmove", end: "touchend" }
        }, {
            test: a.navigator.msPointerEnabled,
            events: { start: "MSPointerDown", move: "MSPointerMove", end: "MSPointerUp" }
        }, { test: a.navigator.pointerEnabled, events: { start: "pointerdown", move: "pointermove", end: "pointerup" } }];
        b.options = { eventName: "tap", fingerMaxOffset: 11 };
        var e, f, g, h, i = {};
        e = function (a) {
            return c.attachEvent(document.body, h[a], g[a])
        }, g = {
            start: function (a) {
                a = c.getRealEvent(a), i.start = [a.pageX, a.pageY], i.offset = [0, 0]
            }, move: function (a) {
                return i.start || i.move ? (a = c.getRealEvent(a), i.move = [a.pageX, a.pageY], void (i.offset = [Math.abs(i.move[0] - i.start[0]), Math.abs(i.move[1] - i.start[1])])) : !1
            }, end: function (d) {
                if (d = c.getRealEvent(d), i.offset[0] < b.options.fingerMaxOffset && i.offset[1] < b.options.fingerMaxOffset && !c.fireFakeEvent(d, b.options.eventName)) {
                    if (a.navigator.msPointerEnabled || a.navigator.pointerEnabled) {
                        var e = function (a) {
                            a.preventDefault(), d.target.removeEventListener("click", e)
                        };
                        d.target.addEventListener("click", e, !1)
                    }
                    d.preventDefault()
                }
                i = {}
            }, click: function (a) {
                //$(document).on('touchmove', function (e) {
                //    e.preventDefault();
                //})
                return c.fireFakeEvent(a, b.options.eventName) ? void 0 : a.preventDefault()
            }
        }, f = function () {
            for (var a = 0; a < d.length; a++) if (d[a].test) return h = d[a].events, e("start"), e("move"), e("end"), !1;
            return c.attachEvent(document.body, "click", g.click)
        }, c.attachEvent(a, "load", f), a.Tap = b
    }(window);

    /*! iScroll v5.2.0-snapshot ~ (c) 2008-2017 Matteo Spinelli ~ http://cubiq.org/license */
    (function (window, document, Math) {
        var rAF = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) { window.setTimeout(callback, 1000 / 60); };

        var utils = (function () {
            var me = {};

            var _elementStyle = document.createElement('div').style;
            var _vendor = (function () {
                var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
                    transform,
                    i = 0,
                    l = vendors.length;

                for (; i < l; i++) {
                    transform = vendors[i] + 'ransform';
                    if (transform in _elementStyle) return vendors[i].substr(0, vendors[i].length - 1);
                }

                return false;
            })();

            function _prefixStyle(style) {
                if (_vendor === false) return false;
                if (_vendor === '') return style;
                return _vendor + style.charAt(0).toUpperCase() + style.substr(1);
            }

            me.getTime = Date.now || function getTime() { return new Date().getTime(); };

            me.extend = function (target, obj) {
                for (var i in obj) {
                    target[i] = obj[i];
                }
            };

            me.addEvent = function (el, type, fn, capture) {
                el.addEventListener(type, fn, !!capture);
            };

            me.removeEvent = function (el, type, fn, capture) {
                el.removeEventListener(type, fn, !!capture);
            };

            me.prefixPointerEvent = function (pointerEvent) {
                return window.MSPointerEvent ?
                'MSPointer' + pointerEvent.charAt(7).toUpperCase() + pointerEvent.substr(8) :
                    pointerEvent;
            };

            me.momentum = function (current, start, time, lowerMargin, wrapperSize, deceleration) {
                var distance = current - start,
                    speed = Math.abs(distance) / time,
                    destination,
                    duration;

                deceleration = deceleration === undefined ? 0.0006 : deceleration;

                destination = current + (speed * speed) / (2 * deceleration) * (distance < 0 ? -1 : 1);
                duration = speed / deceleration;

                if (destination < lowerMargin) {
                    destination = wrapperSize ? lowerMargin - (wrapperSize / 2.5 * (speed / 8)) : lowerMargin;
                    distance = Math.abs(destination - current);
                    duration = distance / speed;
                } else if (destination > 0) {
                    destination = wrapperSize ? wrapperSize / 2.5 * (speed / 8) : 0;
                    distance = Math.abs(current) + destination;
                    duration = distance / speed;
                }

                return {
                    destination: Math.round(destination),
                    duration: duration
                };
            };

            var _transform = _prefixStyle('transform');

            me.extend(me, {
                hasTransform: _transform !== false,
                hasPerspective: _prefixStyle('perspective') in _elementStyle,
                hasTouch: 'ontouchstart' in window,
                hasPointer: !!(window.PointerEvent || window.MSPointerEvent), // IE10 is prefixed
                hasTransition: _prefixStyle('transition') in _elementStyle
            });

            /*
             This should find all Android browsers lower than build 535.19 (both stock browser and webview)
             - galaxy S2 is ok
             - 2.3.6 : `AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1`
             - 4.0.4 : `AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30`
             - galaxy S3 is badAndroid (stock brower, webview)
             `AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30`
             - galaxy S4 is badAndroid (stock brower, webview)
             `AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30`
             - galaxy S5 is OK
             `AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Mobile Safari/537.36 (Chrome/)`
             - galaxy S6 is OK
             `AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Mobile Safari/537.36 (Chrome/)`
             */
            me.isBadAndroid = (function () {
                var appVersion = window.navigator.appVersion;
                // Android browser is not a chrome browser.
                if (/Android/.test(appVersion) && !(/Chrome\/\d/.test(appVersion))) {
                    var safariVersion = appVersion.match(/Safari\/(\d+.\d)/);
                    if (safariVersion && typeof safariVersion === "object" && safariVersion.length >= 2) {
                        return parseFloat(safariVersion[1]) < 535.19;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            })();

            me.extend(me.style = {}, {
                transform: _transform,
                transitionTimingFunction: _prefixStyle('transitionTimingFunction'),
                transitionDuration: _prefixStyle('transitionDuration'),
                transitionDelay: _prefixStyle('transitionDelay'),
                transformOrigin: _prefixStyle('transformOrigin'),
                touchAction: _prefixStyle('touchAction')
            });

            me.hasClass = function (e, c) {
                var re = new RegExp("(^|\\s)" + c + "(\\s|$)");
                return re.test(e.className);
            };

            me.addClass = function (e, c) {
                if (me.hasClass(e, c)) {
                    return;
                }

                var newclass = e.className.split(' ');
                newclass.push(c);
                e.className = newclass.join(' ');
            };

            me.removeClass = function (e, c) {
                if (!me.hasClass(e, c)) {
                    return;
                }

                var re = new RegExp("(^|\\s)" + c + "(\\s|$)", 'g');
                e.className = e.className.replace(re, ' ');
            };

            me.offset = function (el) {
                var left = -el.offsetLeft,
                    top = -el.offsetTop;

                // jshint -W084
                while (el = el.offsetParent) {
                    left -= el.offsetLeft;
                    top -= el.offsetTop;
                }
                // jshint +W084

                return {
                    left: left,
                    top: top
                };
            };

            me.preventDefaultException = function (el, exceptions) {
                for (var i in exceptions) {
                    if (exceptions[i].test(el[i])) {
                        return true;
                    }
                }

                return false;
            };

            me.extend(me.eventType = {}, {
                touchstart: 1,
                touchmove: 1,
                touchend: 1,

                mousedown: 2,
                mousemove: 2,
                mouseup: 2,

                pointerdown: 3,
                pointermove: 3,
                pointerup: 3,

                MSPointerDown: 3,
                MSPointerMove: 3,
                MSPointerUp: 3
            });

            me.extend(me.ease = {}, {
                quadratic: {
                    style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    fn: function (k) {
                        return k * (2 - k);
                    }
                },
                circular: {
                    style: 'cubic-bezier(0.1, 0.57, 0.1, 1)',	// Not properly "circular" but this looks better, it should be (0.075, 0.82, 0.165, 1)
                    fn: function (k) {
                        return Math.sqrt(1 - (--k * k));
                    }
                },
                back: {
                    style: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    fn: function (k) {
                        var b = 4;
                        return (k = k - 1) * k * ((b + 1) * k + b) + 1;
                    }
                },
                bounce: {
                    style: '',
                    fn: function (k) {
                        if ((k /= 1) < (1 / 2.75)) {
                            return 7.5625 * k * k;
                        } else if (k < (2 / 2.75)) {
                            return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
                        } else if (k < (2.5 / 2.75)) {
                            return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
                        } else {
                            return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
                        }
                    }
                },
                elastic: {
                    style: '',
                    fn: function (k) {
                        var f = 0.22,
                            e = 0.4;

                        if (k === 0) { return 0; }
                        if (k == 1) { return 1; }

                        return (e * Math.pow(2, -10 * k) * Math.sin((k - f / 4) * (2 * Math.PI) / f) + 1);
                    }
                }
            });

            me.tap = function (e, eventName) {
                var ev = document.createEvent('Event');
                ev.initEvent(eventName, true, true);
                ev.pageX = e.pageX;
                ev.pageY = e.pageY;
                e.target.dispatchEvent(ev);
            };

            me.click = function (e) {
                var target = e.target,
                    ev;

                if (!(/(SELECT|INPUT|TEXTAREA)/i).test(target.tagName)) {
                    // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/initMouseEvent
                    // initMouseEvent is deprecated.
                    ev = document.createEvent(window.MouseEvent ? 'MouseEvents' : 'Event');
                    ev.initEvent('click', true, true);
                    ev.view = e.view || window;
                    ev.detail = 1;
                    ev.screenX = target.screenX || 0;
                    ev.screenY = target.screenY || 0;
                    ev.clientX = target.clientX || 0;
                    ev.clientY = target.clientY || 0;
                    ev.ctrlKey = !!e.ctrlKey;
                    ev.altKey = !!e.altKey;
                    ev.shiftKey = !!e.shiftKey;
                    ev.metaKey = !!e.metaKey;
                    ev.button = 0;
                    ev.relatedTarget = null;
                    ev._constructed = true;
                    target.dispatchEvent(ev);
                }
            };

            me.getTouchAction = function (eventPassthrough, addPinch) {
                var touchAction = 'none';
                if (eventPassthrough === 'vertical') {
                    touchAction = 'pan-y';
                } else if (eventPassthrough === 'horizontal') {
                    touchAction = 'pan-x';
                }
                if (addPinch && touchAction != 'none') {
                    // add pinch-zoom support if the browser supports it, but if not (eg. Chrome <55) do nothing
                    touchAction += ' pinch-zoom';
                }
                return touchAction;
            };

            me.getRect = function (el) {
                if (el instanceof SVGElement) {
                    var rect = el.getBoundingClientRect();
                    return {
                        top: rect.top,
                        left: rect.left,
                        width: rect.width,
                        height: rect.height
                    };
                } else {
                    return {
                        top: el.offsetTop,
                        left: el.offsetLeft,
                        width: el.offsetWidth,
                        height: el.offsetHeight
                    };
                }
            };

            return me;
        })();
        function IScroll(el, options) {
            this.wrapper = typeof el == 'string' ? document.querySelector(el) : el;
            this.scroller = this.wrapper.children[0];
            this.scrollerStyle = this.scroller.style;		// cache style for better performance

            this.options = {

                // INSERT POINT: OPTIONS
                disablePointer: !utils.hasPointer,
                disableTouch: utils.hasPointer || !utils.hasTouch,
                disableMouse: utils.hasPointer || utils.hasTouch,
                startX: 0,
                startY: 0,
                scrollY: true,
                directionLockThreshold: 5,
                momentum: true,

                bounce: true,
                bounceTime: 600,
                bounceEasing: '',

                preventDefault: true,
                preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/ },

                HWCompositing: true,
                useTransition: true,
                useTransform: true,
                bindToWrapper: typeof window.onmousedown === "undefined"
            };

            for (var i in options) {
                this.options[i] = options[i];
            }

            // Normalize options
            this.translateZ = this.options.HWCompositing && utils.hasPerspective ? ' translateZ(0)' : '';

            this.options.useTransition = utils.hasTransition && this.options.useTransition;
            this.options.useTransform = utils.hasTransform && this.options.useTransform;

            this.options.eventPassthrough = this.options.eventPassthrough === true ? 'vertical' : this.options.eventPassthrough;
            this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault;

            // If you want eventPassthrough I have to lock one of the axes
            this.options.scrollY = this.options.eventPassthrough == 'vertical' ? false : this.options.scrollY;
            this.options.scrollX = this.options.eventPassthrough == 'horizontal' ? false : this.options.scrollX;

            // With eventPassthrough we also need lockDirection mechanism
            this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough;
            this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold;

            this.options.bounceEasing = typeof this.options.bounceEasing == 'string' ? utils.ease[this.options.bounceEasing] || utils.ease.circular : this.options.bounceEasing;

            this.options.resizePolling = this.options.resizePolling === undefined ? 60 : this.options.resizePolling;

            if (this.options.tap === true) {
                this.options.tap = 'tap';
            }

            // https://github.com/cubiq/iscroll/issues/1029
            if (!this.options.useTransition && !this.options.useTransform) {
                if (!(/relative|absolute/i).test(this.scrollerStyle.position)) {
                    this.scrollerStyle.position = "relative";
                }
            }

            // INSERT POINT: NORMALIZATION

            // Some defaults
            this.x = 0;
            this.y = 0;
            this.directionX = 0;
            this.directionY = 0;
            this._events = {};

            // INSERT POINT: DEFAULTS

            this._init();
            this.refresh();

            this.scrollTo(this.options.startX, this.options.startY);
            this.enable();
        }

        IScroll.prototype = {
            version: '5.2.0-snapshot',

            _init: function () {
                this._initEvents();

                // INSERT POINT: _init

            },

            destroy: function () {
                this._initEvents(true);
                clearTimeout(this.resizeTimeout);
                this.resizeTimeout = null;
                this._execEvent('destroy');
            },

            _transitionEnd: function (e) {
                if (e.target != this.scroller || !this.isInTransition) {
                    return;
                }

                this._transitionTime();
                if (!this.resetPosition(this.options.bounceTime)) {
                    this.isInTransition = false;
                    this._execEvent('scrollEnd');
                }
            },

            _start: function (e) {
                // React to left mouse button only
                if (utils.eventType[e.type] != 1) {
                    // for button property
                    // http://unixpapa.com/js/mouse.html
                    var button;
                    if (!e.which) {
                        /* IE case */
                        button = (e.button < 2) ? 0 :
                            ((e.button == 4) ? 1 : 2);
                    } else {
                        /* All others */
                        button = e.button;
                    }
                    if (button !== 0) {
                        return;
                    }
                }

                if (!this.enabled || (this.initiated && utils.eventType[e.type] !== this.initiated)) {
                    return;
                }

                if (this.options.preventDefault && !utils.isBadAndroid && !utils.preventDefaultException(e.target, this.options.preventDefaultException)) {
                    e.preventDefault();
                }

                var point = e.touches ? e.touches[0] : e,
                    pos;

                this.initiated = utils.eventType[e.type];
                this.moved = false;
                this.distX = 0;
                this.distY = 0;
                this.directionX = 0;
                this.directionY = 0;
                this.directionLocked = 0;

                this.startTime = utils.getTime();

                if (this.options.useTransition && this.isInTransition) {
                    this._transitionTime();
                    this.isInTransition = false;
                    pos = this.getComputedPosition();
                    this._translate(Math.round(pos.x), Math.round(pos.y));
                    this._execEvent('scrollEnd');
                } else if (!this.options.useTransition && this.isAnimating) {
                    this.isAnimating = false;
                    this._execEvent('scrollEnd');
                }

                this.startX = this.x;
                this.startY = this.y;
                this.absStartX = this.x;
                this.absStartY = this.y;
                this.pointX = point.pageX;
                this.pointY = point.pageY;

                this._execEvent('beforeScrollStart');
            },

            _move: function (e) {
                if (!this.enabled || utils.eventType[e.type] !== this.initiated) {
                    return;
                }

                if (this.options.preventDefault) {	// increases performance on Android? TODO: check!
                    e.preventDefault();
                }

                var point = e.touches ? e.touches[0] : e,
                    deltaX = point.pageX - this.pointX,
                    deltaY = point.pageY - this.pointY,
                    timestamp = utils.getTime(),
                    newX, newY,
                    absDistX, absDistY;

                this.pointX = point.pageX;
                this.pointY = point.pageY;

                this.distX += deltaX;
                this.distY += deltaY;
                absDistX = Math.abs(this.distX);
                absDistY = Math.abs(this.distY);

                // We need to move at least 10 pixels for the scrolling to initiate
                if (timestamp - this.endTime > 300 && (absDistX < 10 && absDistY < 10)) {
                    return;
                }

                // If you are scrolling in one direction lock the other
                if (!this.directionLocked && !this.options.freeScroll) {
                    if (absDistX > absDistY + this.options.directionLockThreshold) {
                        this.directionLocked = 'h';		// lock horizontally
                    } else if (absDistY >= absDistX + this.options.directionLockThreshold) {
                        this.directionLocked = 'v';		// lock vertically
                    } else {
                        this.directionLocked = 'n';		// no lock
                    }
                }

                if (this.directionLocked == 'h') {
                    if (this.options.eventPassthrough == 'vertical') {
                        e.preventDefault();
                    } else if (this.options.eventPassthrough == 'horizontal') {
                        this.initiated = false;
                        return;
                    }

                    deltaY = 0;
                } else if (this.directionLocked == 'v') {
                    if (this.options.eventPassthrough == 'horizontal') {
                        e.preventDefault();
                    } else if (this.options.eventPassthrough == 'vertical') {
                        this.initiated = false;
                        return;
                    }

                    deltaX = 0;
                }

                deltaX = this.hasHorizontalScroll ? deltaX : 0;
                deltaY = this.hasVerticalScroll ? deltaY : 0;

                newX = this.x + deltaX;
                newY = this.y + deltaY;

                // Slow down if outside of the boundaries
                if (newX > 0 || newX < this.maxScrollX) {
                    newX = this.options.bounce ? this.x + deltaX / 3 : newX > 0 ? 0 : this.maxScrollX;
                }
                if (newY > 0 || newY < this.maxScrollY) {
                    newY = this.options.bounce ? this.y + deltaY / 3 : newY > 0 ? 0 : this.maxScrollY;
                }

                this.directionX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
                this.directionY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

                if (!this.moved) {
                    this._execEvent('scrollStart');
                }

                this.moved = true;

                this._translate(newX, newY);

                /* REPLACE START: _move */

                if (timestamp - this.startTime > 300) {
                    this.startTime = timestamp;
                    this.startX = this.x;
                    this.startY = this.y;
                }

                /* REPLACE END: _move */

            },

            _end: function (e) {
                if (!this.enabled || utils.eventType[e.type] !== this.initiated) {
                    return;
                }

                if (this.options.preventDefault && !utils.preventDefaultException(e.target, this.options.preventDefaultException)) {
                    e.preventDefault();
                }

                var point = e.changedTouches ? e.changedTouches[0] : e,
                    momentumX,
                    momentumY,
                    duration = utils.getTime() - this.startTime,
                    newX = Math.round(this.x),
                    newY = Math.round(this.y),
                    distanceX = Math.abs(newX - this.startX),
                    distanceY = Math.abs(newY - this.startY),
                    time = 0,
                    easing = '';

                this.isInTransition = 0;
                this.initiated = 0;
                this.endTime = utils.getTime();

                // reset if we are outside of the boundaries
                if (this.resetPosition(this.options.bounceTime)) {
                    return;
                }

                this.scrollTo(newX, newY);	// ensures that the last position is rounded

                // we scrolled less than 10 pixels
                if (!this.moved) {
                    if (this.options.tap) {
                        utils.tap(e, this.options.tap);
                    }

                    if (this.options.click) {
                        utils.click(e);
                    }

                    this._execEvent('scrollCancel');
                    return;
                }

                if (this._events.flick && duration < 200 && distanceX < 100 && distanceY < 100) {
                    this._execEvent('flick');
                    return;
                }

                // start momentum animation if needed
                if (this.options.momentum && duration < 300) {
                    momentumX = this.hasHorizontalScroll ? utils.momentum(this.x, this.startX, duration, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options.deceleration) : { destination: newX, duration: 0 };
                    momentumY = this.hasVerticalScroll ? utils.momentum(this.y, this.startY, duration, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options.deceleration) : { destination: newY, duration: 0 };
                    newX = momentumX.destination;
                    newY = momentumY.destination;
                    time = Math.max(momentumX.duration, momentumY.duration);
                    this.isInTransition = 1;
                }

                // INSERT POINT: _end

                if (newX != this.x || newY != this.y) {
                    // change easing function when scroller goes out of the boundaries
                    if (newX > 0 || newX < this.maxScrollX || newY > 0 || newY < this.maxScrollY) {
                        easing = utils.ease.quadratic;
                    }

                    this.scrollTo(newX, newY, time, easing);
                    return;
                }

                this._execEvent('scrollEnd');
            },

            _resize: function () {
                var that = this;

                clearTimeout(this.resizeTimeout);

                this.resizeTimeout = setTimeout(function () {
                    that.refresh();
                }, this.options.resizePolling);
            },

            resetPosition: function (time) {
                var x = this.x,
                    y = this.y;

                time = time || 0;

                if (!this.hasHorizontalScroll || this.x > 0) {
                    x = 0;
                } else if (this.x < this.maxScrollX) {
                    x = this.maxScrollX;
                }

                if (!this.hasVerticalScroll || this.y > 0) {
                    y = 0;
                } else if (this.y < this.maxScrollY) {
                    y = this.maxScrollY;
                }

                if (x == this.x && y == this.y) {
                    return false;
                }

                this.scrollTo(x, y, time, this.options.bounceEasing);

                return true;
            },

            disable: function () {
                this.enabled = false;
            },

            enable: function () {
                this.enabled = true;
            },

            refresh: function () {
                utils.getRect(this.wrapper);		// Force reflow

                this.wrapperWidth = this.wrapper.clientWidth;
                this.wrapperHeight = this.wrapper.clientHeight;

                var rect = utils.getRect(this.scroller);
                /* REPLACE START: refresh */

                this.scrollerWidth = rect.width;
                this.scrollerHeight = rect.height;

                this.maxScrollX = this.wrapperWidth - this.scrollerWidth;
                this.maxScrollY = this.wrapperHeight - this.scrollerHeight;

                /* REPLACE END: refresh */

                this.hasHorizontalScroll = this.options.scrollX && this.maxScrollX < 0;
                this.hasVerticalScroll = this.options.scrollY && this.maxScrollY < 0;

                if (!this.hasHorizontalScroll) {
                    this.maxScrollX = 0;
                    this.scrollerWidth = this.wrapperWidth;
                }

                if (!this.hasVerticalScroll) {
                    this.maxScrollY = 0;
                    this.scrollerHeight = this.wrapperHeight;
                }

                this.endTime = 0;
                this.directionX = 0;
                this.directionY = 0;

                if (utils.hasPointer && !this.options.disablePointer) {
                    // The wrapper should have `touchAction` property for using pointerEvent.
                    this.wrapper.style[utils.style.touchAction] = utils.getTouchAction(this.options.eventPassthrough, true);

                    // case. not support 'pinch-zoom'
                    // https://github.com/cubiq/iscroll/issues/1118#issuecomment-270057583
                    if (!this.wrapper.style[utils.style.touchAction]) {
                        this.wrapper.style[utils.style.touchAction] = utils.getTouchAction(this.options.eventPassthrough, false);
                    }
                }
                this.wrapperOffset = utils.offset(this.wrapper);

                this._execEvent('refresh');

                this.resetPosition();

                // INSERT POINT: _refresh

            },

            on: function (type, fn) {
                if (!this._events[type]) {
                    this._events[type] = [];
                }

                this._events[type].push(fn);
            },

            off: function (type, fn) {
                if (!this._events[type]) {
                    return;
                }

                var index = this._events[type].indexOf(fn);

                if (index > -1) {
                    this._events[type].splice(index, 1);
                }
            },

            _execEvent: function (type) {
                if (!this._events[type]) {
                    return;
                }

                var i = 0,
                    l = this._events[type].length;

                if (!l) {
                    return;
                }

                for (; i < l; i++) {
                    this._events[type][i].apply(this, [].slice.call(arguments, 1));
                }
            },

            scrollBy: function (x, y, time, easing) {
                x = this.x + x;
                y = this.y + y;
                time = time || 0;

                this.scrollTo(x, y, time, easing);
            },

            scrollTo: function (x, y, time, easing) {
                easing = easing || utils.ease.circular;

                this.isInTransition = this.options.useTransition && time > 0;
                var transitionType = this.options.useTransition && easing.style;
                if (!time || transitionType) {
                    if (transitionType) {
                        this._transitionTimingFunction(easing.style);
                        this._transitionTime(time);
                    }
                    this._translate(x, y);
                } else {
                    this._animate(x, y, time, easing.fn);
                }
            },

            scrollToElement: function (el, time, offsetX, offsetY, easing) {
                el = el.nodeType ? el : this.scroller.querySelector(el);

                if (!el) {
                    return;
                }

                var pos = utils.offset(el);

                pos.left -= this.wrapperOffset.left;
                pos.top -= this.wrapperOffset.top;

                // if offsetX/Y are true we center the element to the screen
                var elRect = utils.getRect(el);
                var wrapperRect = utils.getRect(this.wrapper);
                if (offsetX === true) {
                    offsetX = Math.round(elRect.width / 2 - wrapperRect.width / 2);
                }
                if (offsetY === true) {
                    offsetY = Math.round(elRect.height / 2 - wrapperRect.height / 2);
                }

                pos.left -= offsetX || 0;
                pos.top -= offsetY || 0;

                pos.left = pos.left > 0 ? 0 : pos.left < this.maxScrollX ? this.maxScrollX : pos.left;
                pos.top = pos.top > 0 ? 0 : pos.top < this.maxScrollY ? this.maxScrollY : pos.top;

                time = time === undefined || time === null || time === 'auto' ? Math.max(Math.abs(this.x - pos.left), Math.abs(this.y - pos.top)) : time;

                this.scrollTo(pos.left, pos.top, time, easing);
            },

            _transitionTime: function (time) {
                if (!this.options.useTransition) {
                    return;
                }
                time = time || 0;
                var durationProp = utils.style.transitionDuration;
                if (!durationProp) {
                    return;
                }

                this.scrollerStyle[durationProp] = time + 'ms';

                if (!time && utils.isBadAndroid) {
                    this.scrollerStyle[durationProp] = '0.0001ms';
                    // remove 0.0001ms
                    var self = this;
                    rAF(function () {
                        if (self.scrollerStyle[durationProp] === '0.0001ms') {
                            self.scrollerStyle[durationProp] = '0s';
                        }
                    });
                }

                // INSERT POINT: _transitionTime

            },

            _transitionTimingFunction: function (easing) {
                this.scrollerStyle[utils.style.transitionTimingFunction] = easing;

                // INSERT POINT: _transitionTimingFunction

            },

            _translate: function (x, y) {
                if (this.options.useTransform) {

                    /* REPLACE START: _translate */

                    this.scrollerStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.translateZ;

                    /* REPLACE END: _translate */

                } else {
                    x = Math.round(x);
                    y = Math.round(y);
                    this.scrollerStyle.left = x + 'px';
                    this.scrollerStyle.top = y + 'px';
                }

                this.x = x;
                this.y = y;

                // INSERT POINT: _translate

            },

            _initEvents: function (remove) {
                var eventType = remove ? utils.removeEvent : utils.addEvent,
                    target = this.options.bindToWrapper ? this.wrapper : window;

                eventType(window, 'orientationchange', this);
                eventType(window, 'resize', this);

                if (this.options.click) {
                    eventType(this.wrapper, 'click', this, true);
                }

                if (!this.options.disableMouse) {
                    eventType(this.wrapper, 'mousedown', this);
                    eventType(target, 'mousemove', this);
                    eventType(target, 'mousecancel', this);
                    eventType(target, 'mouseup', this);
                }

                if (utils.hasPointer && !this.options.disablePointer) {
                    eventType(this.wrapper, utils.prefixPointerEvent('pointerdown'), this);
                    eventType(target, utils.prefixPointerEvent('pointermove'), this);
                    eventType(target, utils.prefixPointerEvent('pointercancel'), this);
                    eventType(target, utils.prefixPointerEvent('pointerup'), this);
                }

                if (utils.hasTouch && !this.options.disableTouch) {
                    eventType(this.wrapper, 'touchstart', this);
                    eventType(target, 'touchmove', this);
                    eventType(target, 'touchcancel', this);
                    eventType(target, 'touchend', this);
                }

                eventType(this.scroller, 'transitionend', this);
                eventType(this.scroller, 'webkitTransitionEnd', this);
                eventType(this.scroller, 'oTransitionEnd', this);
                eventType(this.scroller, 'MSTransitionEnd', this);
            },

            getComputedPosition: function () {
                var matrix = window.getComputedStyle(this.scroller, null),
                    x, y;

                if (this.options.useTransform) {
                    matrix = matrix[utils.style.transform].split(')')[0].split(', ');
                    x = +(matrix[12] || matrix[4]);
                    y = +(matrix[13] || matrix[5]);
                } else {
                    x = +matrix.left.replace(/[^-\d.]/g, '');
                    y = +matrix.top.replace(/[^-\d.]/g, '');
                }

                return { x: x, y: y };
            },
            _animate: function (destX, destY, duration, easingFn) {
                var that = this,
                    startX = this.x,
                    startY = this.y,
                    startTime = utils.getTime(),
                    destTime = startTime + duration;

                function step() {
                    var now = utils.getTime(),
                        newX, newY,
                        easing;

                    if (now >= destTime) {
                        that.isAnimating = false;
                        that._translate(destX, destY);

                        if (!that.resetPosition(that.options.bounceTime)) {
                            that._execEvent('scrollEnd');
                        }

                        return;
                    }

                    now = (now - startTime) / duration;
                    easing = easingFn(now);
                    newX = (destX - startX) * easing + startX;
                    newY = (destY - startY) * easing + startY;
                    that._translate(newX, newY);

                    if (that.isAnimating) {
                        rAF(step);
                    }
                }

                this.isAnimating = true;
                step();
            },
            handleEvent: function (e) {
                switch (e.type) {
                    case 'touchstart':
                    case 'pointerdown':
                    case 'MSPointerDown':
                    case 'mousedown':
                        this._start(e);
                        break;
                    case 'touchmove':
                    case 'pointermove':
                    case 'MSPointerMove':
                    case 'mousemove':
                        this._move(e);
                        break;
                    case 'touchend':
                    case 'pointerup':
                    case 'MSPointerUp':
                    case 'mouseup':
                    case 'touchcancel':
                    case 'pointercancel':
                    case 'MSPointerCancel':
                    case 'mousecancel':
                        this._end(e);
                        break;
                    case 'orientationchange':
                    case 'resize':
                        this._resize();
                        break;
                    case 'transitionend':
                    case 'webkitTransitionEnd':
                    case 'oTransitionEnd':
                    case 'MSTransitionEnd':
                        this._transitionEnd(e);
                        break;
                    case 'wheel':
                    case 'DOMMouseScroll':
                    case 'mousewheel':
                        this._wheel(e);
                        break;
                    case 'keydown':
                        this._key(e);
                        break;
                    case 'click':
                        if (this.enabled && !e._constructed) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                        break;
                }
            }
        };
        IScroll.utils = utils;

        if (typeof module != 'undefined' && module.exports) {
            module.exports = IScroll;
        } else if (typeof define == 'function' && define.amd) {
            define(function () { return IScroll; });
        } else {
            window.IScroll = IScroll;
        }

    })(window, document, Math);


    $.fn.mdatetimer = function (opts) {
        var defaults = {
            mode: 1, //时间选择器模式：1：年月日，2：年月日时分（24小时），3：年月日时分（12小时），4：年月日时分秒
            format: 2, //时间格式化方式：1：2015年06月10日 17时30分46秒，2：2015-05-10  17:30:46
            years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017], //年份，数组或字符串'2000~2015'
            nowbtn: true,
            onOk: null,
            onCancel: null,
            checkHoliday: 0,
        };
        var option = $.extend(defaults, opts);

        //通用函数
        var F = {
            //计算某年某月有多少天
            getDaysInMonth: function (year, month) {
                return new Date(year, month + 1, 0).getDate();
            },
            getMonth: function (m) {
                return ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'][m];
            },
            //计算年某月的最后一天日期
            getLastDayInMonth: function (year, month) {
                return new Date(year, month, this.getDaysInMonth(year, month));
            },
            //小于10的数字前加0
            preZero: function (num) {
                num = parseInt(num);
                if (num < 10) {
                    return '0' + num;
                }
                else {
                    return num;
                }
            },
            formatDate: function (year, month, day, hour, minute, second) {
                month = F.preZero(month + 1);
                day = F.preZero(day);
                hour = F.preZero(hour);
                minute = F.preZero(minute);
                if (option.mode != 3) {
                    second = F.preZero(second);
                }
                else {
                    //可能点“现在”取时间，需根据时间判断上下午
                    if (second == 'am') {
                        second = '上午';
                    }
                    else if (second == 'pm') {
                        second = '下午';
                    }
                    else {
                        //传入的是秒数
                        if (hour < 12) {
                            second = '上午';
                        }
                        else {
                            second = '下午';
                        }
                    }

                }

                var result = '';
                if (option.format == 1) {
                    result += year + '年' + month + '月' + day + '日';
                    if (option.mode != 1 && hour) {
                        result += ' ' + hour + '时' + minute + '分';
                        if (option.mode != 2) {
                            if (!isNaN(parseInt(second))) {
                                result += second + '秒';
                            }
                            else {
                                result += ' ' + second;
                            }
                        }
                    }
                }
                else {
                    result += year + '-' + month + '-' + day;
                    if (option.mode != 1 && hour) {
                        result += ' ' + hour + ':' + minute + '';
                        if (option.mode != 2) {
                            if (!isNaN(parseInt(second))) {
                                result += ':' + second + '';
                            }
                            else {
                                result += ' ' + second;
                            }
                        }
                    }
                }
                return result;
            },
            getDateValue: function (value) {
                if (option.format == 2) {
                    return new Date(value);
                }
                else {
                    var array = value.replace(/\D ?/g, ',').slice(0, -1).split(',');
                    if (array.length == 7) {
                        //带有“上午、下午”
                        if (value.indexOf('上午') >= 0) {
                            return new Date(array[0], array[1] - 1, array[2], array[3], array[4]);
                        }
                        else {
                            return new Date(array[0], array[1] - 1, array[2], parseInt(array[3]) + 12, array[4]);
                        }

                    }
                    else {
                        return new Date(array[0], array[1] - 1, array[2], array[3], array[4], array[5]);
                    }
                }
            }
        }

        //滑动配置项
        var scrollConf = {
            snap: 'li',
            snapSpeed: 600,
            probeType: 1,
            // hScroll: false,
            // momentum: true,
            // lockDirection: true,
            tap: true
        };

        var input = $(this),
            itemHeight = 40;
        input.each(function (index, element) {
            var $element = $(element);
            var id = $element.attr('id');

            if (!id) {
                alert('请为input标签设置id');
            }
            var picker = {

                init: function () {
                    var _this = this;
                    // var tip = require('tip');
                    _this.renderHTML(id);
                    var container = $('.mt_poppanel_' + id),
                        mpYear = $('.mt_year', container),
                        mpMonth = $('.mt_month', container),
                        mpDay = $('.mt_day', container),
                        mpHour = $('.mt_hour', container),
                        mpMinute = $('.mt_minute', container),
                        mpSecond = $('.mt_second', container);
                    //初始化year

                    var defaultDate = $element.val() != '' ? F.getDateValue($element.val()) : new Date(),
                        dYear = defaultDate.getFullYear(),
                        dMonth = defaultDate.getMonth(),
                        dDate = defaultDate.getDate(),
                        dHour = defaultDate.getHours(),
                        dMinute = defaultDate.getMinutes(),
                        dSecond = defaultDate.getSeconds();

                    var yearStr = '';
                    for (var i = 0; i < option.years.length; i++) {
                        var y = option.years[i];
                        var sel = y == dYear ? 'selected' : '';
                        yearStr += '<li class="' + sel + '" data-year="' + y + '">' + y + '年</li>';
                    }
                    yearStr += '<li></li><li></li>';
                    mpYear.find('ul').append(yearStr);

                    //初始化month
                    var monthStr = '';
                    for (var j = 1; j <= 12; j++) {
                        var sel = j == dMonth + 1 ? 'selected' : '';
                        monthStr += '<li class="' + sel + '" data-month="' + (j - 1) + '">' + F.preZero(j) + '月</li>';
                    }
                    monthStr += '<li></li><li></li>';
                    mpMonth.find('ul').append(monthStr);

                    //初始化day
                    var dayStr = '';
                    var defaultDays = F.getDaysInMonth(dYear, dMonth);
                    for (var k = 1; k <= defaultDays; k++) {
                        var sel = k == dDate ? 'selected' : '';
                        dayStr += '<li class="' + sel + '" data-day="' + k + '">' + F.preZero(k) + '日</li>';
                    }
                    dayStr += '<li></li><li></li>';
                    mpDay.find('ul').append(dayStr);

                    if (option.mode == 1) {
                        //把不该显示的删除掉
                        $('.mt_body', container).css('height', 200);
                        $('.mt_year, .mt_month, .mt_day', container).css('height', '100%');
                        $('.mt_sepline, .mt_hour, .mt_minute, .mt_second, .mt_indicate.cate2', container).remove();
                    }
                    if (!option.nowbtn) {
                        $('.mt_setnow', container).remove();
                        $('.mt_cancel, .mt_ok', container).css('float', 'none');
                        $('.mt_cancel', container).css('border-right', '1px solid #4eccc4');
                    }

                    document.addEventListener('touchmove', function (e) {
                        //e.preventDefault();
                    }, false);
                    //初始化scroll
                    var elHeight = itemHeight;

                    var yearScroll = new IScroll('.mt_poppanel_' + id + ' .mt_year', scrollConf);
                    yearScroll.on('scroll', function () {
                        _this.updateSelected(mpYear, this);

                    });
                    yearScroll.on('scrollEnd', function () {
                        _this.updateSelected(mpYear, this);
                        _this.updateDay(mpYear, mpMonth, mpDay);
                    });

                    var monthScroll = new IScroll('.mt_poppanel_' + id + ' .mt_month', scrollConf);
                    monthScroll.on('scroll', function () {
                        _this.updateSelected(mpMonth, this);

                    });
                    monthScroll.on('scrollEnd', function () {
                        _this.updateSelected(mpMonth, this);
                        _this.updateDay(mpYear, mpMonth, mpDay);
                    });

                    var dayScroll = new IScroll('.mt_poppanel_' + id + ' .mt_day', scrollConf);
                    dayScroll.on('scroll', function () {
                        _this.updateSelected(mpDay, this);
                    });
                    dayScroll.on('scrollEnd', function () {
                        _this.updateSelected(mpDay, this);
                    });

                    this.yearScroll = yearScroll;
                    this.monthScroll = monthScroll;
                    this.dayScroll = dayScroll;

                    //初始化时分秒

                    //初始化hour
                    if (option.mode != 1) {
                        var hourStr = '';
                        var hourcount = option.mode == 3 ? 12 : 24;
                        for (var l = 1; l <= hourcount; l++) {
                            var sel = l == dHour ? 'selected' : '';
                            hourStr += '<li class="' + sel + '" data-hour="' + l + '">' + F.preZero(l) + '时</li>';
                        }
                        hourStr += '<li></li><li></li>';
                        mpHour.find('ul').append(hourStr);

                        var hourScroll = new IScroll('.mt_poppanel_' + id + ' .mt_hour', scrollConf);
                        hourScroll.on('scroll', function () {
                            _this.updateSelected(mpHour, this);
                        });
                        hourScroll.on('scrollEnd', function () {
                            _this.updateSelected(mpHour, this);
                        });
                        this.hourScroll = hourScroll;

                        //初始化minute
                        var minuteStr = '';
                        for (var m = 0; m <= 60; m++) {
                            var sel = m == dMinute ? 'selected' : '';
                            minuteStr += '<li class="' + sel + '" data-minute="' + m + '">' + F.preZero(m) + '分</li>';
                        }
                        minuteStr += '<li></li><li></li>';
                        mpMinute.find('ul').append(minuteStr);

                        var minuteScroll = new IScroll('.mt_poppanel_' + id + ' .mt_minute', scrollConf);
                        minuteScroll.on('scroll', function () {
                            _this.updateSelected(mpMinute, this);
                        });
                        minuteScroll.on('scrollEnd', function () {
                            _this.updateSelected(mpMinute, this);
                        });
                        this.minuteScroll = minuteScroll;

                        //初始化second
                        var secondStr = '';
                        if (option.mode == 4) {
                            for (var n = 0; n <= 60; n++) {
                                var sel = n == dSecond ? 'selected' : '';
                                secondStr += '<li class="' + sel + '" data-second="' + n + '">' + F.preZero(n) + '秒</li>';
                            }
                        }
                        else if (option.mode == 3) {
                            var sel1 = dHour <= 12 ? 'selected' : '';
                            var sel2 = dHour >= 12 ? 'selected' : '';
                            secondStr += '<li class="' + sel1 + '" data-second="am">上午</li><li class="' + sel2 + '" data-second="pm">下午</li>';
                        }

                        secondStr += '<li></li><li></li>';
                        mpSecond.find('ul').append(secondStr);

                        var secondScroll = new IScroll('.mt_poppanel_' + id + ' .mt_second', scrollConf);
                        secondScroll.on('scroll', function () {
                            _this.updateSelected(mpSecond, this);
                        });
                        secondScroll.on('scrollEnd', function () {
                            _this.updateSelected(mpSecond, this);
                        });
                        this.secondScroll = secondScroll;

                        if (option.mode == 2 || option.mode == 3) {
                            $('.mt_second .mt_note').html('&nbsp;');
                        }
                    }

                    //初始化点击input事件
                    $element.parent("a").on('tap', function (e) {
                        //$(this).find("input").blur();
                        $(document).on('touchmove', function (e) {
                            e.preventDefault();
                        });//1
                        if (container.hasClass('show')) {
                            _this.hidePanel(id);
                        }
                        else {
                            _this.showPanel(id);
                            var year = mpYear.find('.selected').data('year');
                            var month = mpMonth.find('.selected').data('month');
                            var day = mpDay.find('.selected').data('day');
                            var hour = mpHour.find('.selected').data('hour');
                            var minute = mpMinute.find('.selected').data('minute');
                            var second = mpSecond.find('.selected').data('second');
                            _this.setValue(year, month, day, hour, minute, second, id);
                        }
                    });

                    //初始化点击li
                    mpYear.on('tap', 'li', function () {
                        _this.checkYear($(this));
                    });
                    mpMonth.on('tap', 'li', function () {
                        _this.checkMonth($(this));
                    });
                    mpDay.on('tap', 'li', function () {
                        _this.checkDay($(this));
                    });
                    if (option.mode != 1) {
                        mpHour.on('tap', 'li', function () {
                            _this.checkHour($(this));
                        });
                        mpMinute.on('tap', 'li', function () {
                            _this.checkMinute($(this));
                        });
                        mpSecond.on('tap', 'li', function () {
                            _this.checkSecond($(this));
                        });
                    }

                    //初始化点击事件
                    $('.mt_ok', container).on('tap', function () {
                        //$(document).unbind();
                        var year = mpYear.find('.selected').data('year');
                        var month = mpMonth.find('.selected').data('month');
                        var day = mpDay.find('.selected').data('day');
                        var hour = mpHour.find('.selected').data('hour');
                        var minute = mpMinute.find('.selected').data('minute');
                        var second = mpSecond.find('.selected').data('second');
                        var dateStr = F.formatDate(year, month, day)

                        $element.val(F.formatDate(year, month, day, hour, minute, second));
                        option.onOk && typeof option.onOk == 'function' && option.onOk(container);
                        _this.hidePanel();

                        if (option.checkHoliday == null) {
                            return;
                        }
                        var wedding = $("#DateOfWedding").val().replace("-", "/").replace("-", "/");

                        var delivery = dateStr.replace("-", "/").replace("-", "/");

                        var date1 = new Date(wedding).getTime();

                        var date2 = new Date(delivery).getTime();

                        var nowTime = new Date();
                        var nowyear = nowTime.getFullYear();
                        var nowmonth = nowTime.getMonth() + 1;
                        var nowday = nowTime.getDate();
                        var nd = Date.parse('year-month-day'.replace('year', nowyear).replace('month', nowmonth).replace('day', nowday));
                        var nowDate = new Date(nd);
                        var date = nowDate.getTime();

                        var tip = require('tip');
                        var arr = [];
                        if (option.checkHoliday) {
                            //判断两个时间  
                            var wedding = $("#DateOfWedding").val().replace("-", "/").replace("-", "/");
                            var delivery = dateStr.replace("-", "/").replace("-", "/");
                            var date1 = new Date(wedding).getTime();
                            var date2 = new Date(delivery).getTime();
                            var compare = Math.floor((date1 - date2) / (24 * 60 * 60 * 1000));
                            var a = Math.floor((date2 - date) / (24 * 60 * 60 * 1000));
                            var b = Math.floor((date1 - date) / (24 * 60 * 60 * 1000));
                            if (a < 2) {
                                tip.warn("距离发货日期不足2天，请支付全款");
                            } else if (compare >= 14) {
                                tip.warn("距离婚期时日尚早，建议临婚期1周左右安排发货");
                            } else if (compare < 6) {
                                tip.warn("建议发货日期距离婚期大于6天，以免如遇突发状况无法安排协调，感谢您的理解和配合~ ");
                            } else if (b < 8) {
                                tip.warn("距离婚期不足8天，请联系网站客服下单");
                            } else if (b >= 8 && b < 14) {
                                tip.warn("距离婚期不足14天，请支付全款");
                            }
                            //判断是否是节假日
                            $.ajax({
                                type: 'POST',
                                async: false,
                                data: { time: dateStr },
                                url: '/judgesigledate',
                                success: function (rep) {
                                    if (rep.success) {
                                        var tip = require('tip');
                                        tip.warn("节假日不可选");
                                    }

                                    // tip.warn("节假日不可选")
                                    //$.each(rep.data, function (i, r) {
                                    //    var date = r;
                                    //    arr.push(date);
                                    //});

                                }
                            })
                            //同步请求节假日数组
                            //console.log("qingqiushuju")
                        } else {
                            //点击婚期时的;  
                            var wedding = dateStr.replace("-", "/").replace("-", "/");
                            var delivery = $("#DeliveryDate").val().replace("-", "/").replace("-", "/");
                            var date1 = new Date(wedding).getTime();
                            var date2 = new Date(delivery).getTime();

                            var nowTime = new Date();
                            var nowyear = nowTime.getFullYear();
                            var nowmonth = nowTime.getMonth() + 1;
                            var nowday = nowTime.getDate();
                            var nd = Date.parse('year-month-day'.replace('year', nowyear).replace('month', nowmonth).replace('day', nowday));
                            var nowDate = new Date(nd);
                            var date = nowDate.getTime();

                            if (date2 != "") {
                                var compare = Math.floor((date1 - date2) / (24 * 60 * 60 * 1000));
                                if (6 > compare) {
                                    tip.warn(" 建议发货日期距离婚期大于6天，以免如遇突发状况无法安排协调，感谢您的理解和配合~ ");
                                } else if (compare >= 14) {
                                    tip.warn("距离婚期时日尚早，建议临婚期1周左右安排发货");
                                }
                            }

                            var compare = Math.floor((date1 - date) / (24 * 60 * 60 * 1000));
                            if (compare < 8) {
                                tip.warn("距离婚期不足8天，请联系网站客服下单");
                            } else if (compare >= 8 && compare < 14 && ispreorder == false) {
                                tip.warn("距离婚期不足14天，请支付全款");
                            }
                        }




                    });
                    $('.mt_cancel', container).on('tap', function () {
                        //$(document).unbind();
                        _this.hidePanel();
                        option.onCancel && typeof option.onCancel == 'function' && option.onCancel(container);
                    });
                    $('.mt_setnow', container).on('tap', function () {
                        var n = new Date();
                        $element.val(F.formatDate(n.getFullYear(), n.getMonth(), n.getDate(), n.getHours(), n.getMinutes(), n.getSeconds()));
                        _this.hidePanel();
                    });

                    $('.mt_mask').on('tap', function () {
                        _this.hidePanel();
                    });


                    //初始化原有的数据
                    this.setValue(dYear, dMonth, dDate, dHour, dMinute, dSecond, id);
                },
                renderHTML: function (id) {
                    var stime = option.timeStart + ':00';
                    var etime = option.timeStart + option.timeNum + ':00';
                    var html = '<div class="mt_mask mt_mask_' + id + '"></div><div class="mt_poppanel mt_poppanel_' + id + '"><div class="mt_panel"><h3 class="mt_title">请选择时间</h3><div class="mt_body"><div class="mt_year"><ul><li class="mt_note">选择年份</li><li></li></ul></div><div class="mt_month"><ul><li class="mt_note">选择月份</li><li></li></ul></div><div class="mt_day"><ul><li class="mt_note">选择日期</li><li></li></ul></div><div class="mt_sepline"></div><div class="mt_hour"><ul><li class="mt_note">选择时</li><li></li></ul></div><div class="mt_minute"><ul><li class="mt_note">选择分</li><li></li></ul></div><div class="mt_second"><ul><li class="mt_note">选择秒</li><li></li></ul></div><div class="mt_indicate"></div><div class="mt_indicate cate2"></div></div><div class="mt_confirm"><a href="javascript:void(0);" class="mt_ok">确定</a><a href="javascript:void(0);" class="mt_setnow">现在</a><a href="javascript:void(0);" class="mt_cancel">取消</a></div></div></div>';
                    $(document.body).append(html);
                },
                updateSelected: function (container, iscroll) {
                    var index = ((-iscroll.y) + .5 * (itemHeight)) / itemHeight + 2;
                    var current = container.find('li').eq(index);
                    current.addClass('selected').siblings().removeClass('selected');
                    var $parent = current.parent('ul')
                    $parent.css('transition-duration', "500ms")
                    $parent.css('-webkit-transform', "translate(0px, " + (0 - Math.floor(index - 2) * 40) + "px) translateZ(0px)")
                },
                showPanel: function (id) {
                    $("body").unbind('touchmove')//解除body touchmove事件
                    $('.mt_poppanel_' + id + ', .mt_mask_' + id).addClass('show');
                },
                hidePanel: function () {
                    $(document).unbind('touchmove');//1
                    $("body").on('touchmove', function (e) {
                        e.preventDefault()
                        endY = e.touches[0].pageY
                        top1 = top1 + endY - startY
                        var height = $(window).height() - $("body").height()
                        console.log($(".container").css("top"))
                        if (top1 <= 0 && top1 >= height) {
                            $(".container").css("top", top1)
                        }
                        startY = endY
                    })

                    $('.mt_poppanel_' + id + ', .mt_mask_' + id).removeClass('show');
                },
                setValue: function (y, m, d, h, min, s, id) {
                    var container = $('.mt_poppanel' + '_' + id);
                    var yearItem = $('.mt_year li[data-year="' + y + '"]', container),
                        monthItem = $('.mt_month li[data-month="' + m + '"]', container),
                        dayItem = $('.mt_day li[data-day="' + d + '"]', container),
                        hourItem = $('.mt_hour li[data-hour="' + h + '"]', container),
                        minuteItem = $('.mt_minute li[data-minute="' + min + '"]', container),
                        secondItem = $('.mt_second li[data-second="' + s + '"]', container);
                    if (option.mode == 3) {
                        if (h - 12 > 0) {
                            s = 'pm';
                            hourItem = $('.mt_hour li[data-hour="' + (h - 12) + '"]', container);
                        }
                        else {
                            s = 'am';
                        }
                        secondItem = $('.mt_second li[data-second="' + s + '"]', container);
                    }
                    this.checkYear(yearItem);
                    this.checkMonth(monthItem);
                    this.checkDay(dayItem);
                    if (option.mode != 1) {
                        this.checkHour(hourItem);
                        this.checkMinute(minuteItem);
                        this.checkSecond(secondItem);
                    }

                },
                //滚动的时候动态调节日期，用于计算闰年的日期数
                updateDay: function (mpYear, mpMonth, mpDay) {

                    var checkedYear = mpYear.find('li.selected').data('year');
                    var checkedMonth = mpMonth.find('li.selected').data('month');
                    var checkedDay = mpDay.find('li.selected').data('day');
                    var days = F.getDaysInMonth(checkedYear, checkedMonth);


                    if (!option.checkHoliday) {
                        urshop_holiday = [];
                    } else {
                        urshop_holiday = a;
                    }


                    var _this = this;


                    var dayStr = '<li class="mt_note">选择日期</li><li></li>';
                    for (var k = 1; k <= days; k++) {

                        //判断是否节假日
                        var strMonth = checkedMonth + 1
                        strMonth = Number(strMonth)
                        var daystr = F.formatDate(checkedYear, checkedMonth, k)
                        // console.log(daystr)
                        var fal = ""
                        //灰色日期
                        if ($.inArray(daystr, urshop_holiday) != -1) {

                            fal = "fal"
                        }


                        var sel = k == checkedDay ? 'selected' : '';
                        dayStr += '<li class="' + sel + " " + fal + '" data-day="' + k + '">' + F.preZero(k) + '日</li>';
                    }
                    dayStr += '<li></li><li></li>';
                    mpDay.find('ul').html(dayStr);

                    //内容改变后，iscroll的滚动会发生错误，所以在此将日期scorll重新初始化一遍
                    this.dayScroll.destroy();
                    this.dayScroll = new IScroll('.mt_poppanel_' + id + ' .mt_day', scrollConf);
                    this.dayScroll.on('scroll', function () {
                        // alert("1")
                        _this.updateSelected(mpDay, this);
                    });
                    this.dayScroll.on('scrollEnd', function () {
                        // alert("1")
                        // var dayItem = $(".mt_day li.selected")
                        // console.log(dayItem)
                        // _this.checkDay(dayItem)
                        _this.updateSelected(mpDay, this);
                    });

                    //然后给day重新选择
                    // setTimeout(function () {
                    //     var dayEl = mpDay.find('li[data-day="' + checkedDay + '"]');
                    //     if (dayEl.length > 0) {
                    //         _this.checkDay(dayEl);
                    //     }
                    // }, 10);

                },
                checkYear: function (el) {
                    if (el.text() == '') return;
                    var target = el.prev('li').prev('li');
                    this.yearScroll.scrollToElement(target[0]);
                },
                checkMonth: function (el) {
                    if (el.text() == '') return;
                    var target = el.prev('li').prev('li');
                    this.monthScroll.scrollToElement(target[0]);
                },
                checkDay: function (el) {
                    if (el.text() == '') return;
                    var target = el.prev('li').prev('li');
                    this.dayScroll.scrollToElement(target[0]);
                },
                checkHour: function (el) {
                    if (el.text() == '') return;
                    var target = el.prev('li').prev('li');
                    this.hourScroll.scrollToElement(target[0]);
                },
                checkMinute: function (el) {
                    if (el.text() == '') return;
                    var target = el.prev('li').prev('li');
                    this.minuteScroll.scrollToElement(target[0]);
                },
                checkSecond: function (el) {
                    if (el.text() == '') return;
                    if (option.mode < 3) return;
                    var target = el.prev('li').prev('li');
                    this.secondScroll.scrollToElement(target[0]);
                }
            }
            picker.init();
        });


    }
    return $.fn.mdatetimer;
})(Zepto);
