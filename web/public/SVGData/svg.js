    (function(window, document, exportName, undefined) {
    'use strict';
    var VENDOR_PREFIXES = ['', 'webkit', 'Moz', 'MS', 'ms', 'o'];
    var TEST_ELEMENT = document.createElement('div');
    
    var TYPE_FUNCTION = 'function';
    
    var round = Math.round;
    var abs = Math.abs;
    var now = Date.now;
    
    function setTimeoutContext(fn, timeout, context) {
    return setTimeout(bindFn(fn, context), timeout);
    }
    
    function invokeArrayArg(arg, fn, context) {
    if (Array.isArray(arg)) {
    each(arg, context[fn], context);
    return true;
    }
    return false;
    }
    
    function each(obj, iterator, context) {
    var i;
    
    if (!obj) {
    return;
    }
    
    if (obj.forEach) {
    obj.forEach(iterator, context);
    } else if (obj.length !== undefined) {
    i = 0;
    while (i < obj.length) {
    iterator.call(context, obj[i], i, obj);
    i++;
    }
    } else {
    for (i in obj) {
    obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
    }
    }
    }
    
    function deprecate(method, name, message) {
    var deprecationMessage = 'DEPRECATED METHOD: ' + name + '\n' + message + ' AT \n';
    return function() {
    var e = new Error('get-stack-trace');
    var stack = e && e.stack ? e.stack.replace(/^[^\(]+?[\n$]/gm, '')
    .replace(/^\s+at\s+/gm, '')
    .replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@') : 'Unknown Stack Trace';
    
    var log = window.console && (window.console.warn || window.console.log);
    if (log) {
    log.call(window.console, deprecationMessage, stack);
    }
    return method.apply(this, arguments);
    };
    }
    
    var assign;
    if (typeof Object.assign !== 'function') {
    assign = function assign(target) {
    if (target === undefined || target === null) {
    throw new TypeError('Cannot convert undefined or null to object');
    }
    
    var output = Object(target);
    for (var index = 1; index < arguments.length; index++) {
    var source = arguments[index];
    if (source !== undefined && source !== null) {
    for (var nextKey in source) {
    if (source.hasOwnProperty(nextKey)) {
    output[nextKey] = source[nextKey];
    }
    }
    }
    }
    return output;
    };
    } else {
    assign = Object.assign;
    }
    
    var extend = deprecate(function extend(dest, src, merge) {
    var keys = Object.keys(src);
    var i = 0;
    while (i < keys.length) {
    if (!merge || (merge && dest[keys[i]] === undefined)) {
    dest[keys[i]] = src[keys[i]];
    }
    i++;
    }
    return dest;
    }, 'extend', 'Use `assign`.');
    
    var merge = deprecate(function merge(dest, src) {
    return extend(dest, src, true);
    }, 'merge', 'Use `assign`.');
    
    function inherit(child, base, properties) {
    var baseP = base.prototype,
    childP;
    
    childP = child.prototype = Object.create(baseP);
    childP.constructor = child;
    childP._super = baseP;
    
    if (properties) {
    assign(childP, properties);
    }
    }
    
    function bindFn(fn, context) {
    return function boundFn() {
    return fn.apply(context, arguments);
    };
    }
    
    function boolOrFn(val, args) {
    if (typeof val == TYPE_FUNCTION) {
    return val.apply(args ? args[0] || undefined : undefined, args);
    }
    return val;
    }
    
    function ifUndefined(val1, val2) {
    return (val1 === undefined) ? val2 : val1;
    }
    
    function addEventListeners(target, types, handler) {
    each(splitStr(types), function(type) {
    target.addEventListener(type, handler, false);
    });
    }
    
    function removeEventListeners(target, types, handler) {
    each(splitStr(types), function(type) {
    target.removeEventListener(type, handler, false);
    });
    }
    
    function hasParent(node, parent) {
    while (node) {
    if (node == parent) {
    return true;
    }
    node = node.parentNode;
    }
    return false;
    }
    
    function inStr(str, find) {
    return str.indexOf(find) > -1;
    }
    
    function splitStr(str) {
    return str.trim().split(/\s+/g);
    }
    
    function inArray(src, find, findByKey) {
    if (src.indexOf && !findByKey) {
    return src.indexOf(find);
    } else {
    var i = 0;
    while (i < src.length) {
    if ((findByKey && src[i][findByKey] == find) || (!findByKey && src[i] === find)) {
    return i;
    }
    i++;
    }
    return -1;
    }
    }
    
    function toArray(obj) {
    return Array.prototype.slice.call(obj, 0);
    }
    
    function uniqueArray(src, key, sort) {
    var results = [];
    var values = [];
    var i = 0;
    
    while (i < src.length) {
    var val = key ? src[i][key] : src[i];
    if (inArray(values, val) < 0) {
    results.push(src[i]);
    }
    values[i] = val;
    i++;
    }
    
    if (sort) {
    if (!key) {
    results = results.sort();
    } else {
    results = results.sort(function sortUniqueArray(a, b) {
    return a[key] > b[key];
    });
    }
    }
    
    return results;
    }
    
    function prefixed(obj, property) {
    if (obj === undefined) {
    return undefined;
    }
    
    var prefix, prop;
    var camelProp = property[0].toUpperCase() + property.slice(1);
    
    var i = 0;
    while (i < VENDOR_PREFIXES.length) {
    prefix = VENDOR_PREFIXES[i];
    prop = (prefix) ? prefix + camelProp : property;
    
    if (prop in obj) {
    return prop;
    }
    i++;
    }
    return undefined;
    }
    
    var _uniqueId = 1;
    function uniqueId() {
    return _uniqueId++;
    }
    
    function getWindowForElement(element) {
    var doc = element.ownerDocument || element;
    return (doc.defaultView || doc.parentWindow || window);
    }
    
    var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;
    
    var SUPPORT_TOUCH = ('ontouchstart' in window);
    var SUPPORT_POINTER_EVENTS = prefixed(window, 'PointerEvent') !== undefined;
    var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);
    
    var INPUT_TYPE_TOUCH = 'touch';
    var INPUT_TYPE_PEN = 'pen';
    var INPUT_TYPE_MOUSE = 'mouse';
    var INPUT_TYPE_KINECT = 'kinect';
    
    var COMPUTE_INTERVAL = 25;
    
    var INPUT_START = 1;
    var INPUT_MOVE = 2;
    var INPUT_END = 4;
    var INPUT_CANCEL = 8;
    
    var DIRECTION_NONE = 1;
    var DIRECTION_LEFT = 2;
    var DIRECTION_RIGHT = 4;
    var DIRECTION_UP = 8;
    var DIRECTION_DOWN = 16;
    
    var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
    var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
    var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;
    
    var PROPS_XY = ['x', 'y'];
    var PROPS_CLIENT_XY = ['clientX', 'clientY'];
    
    function Input(manager, callback) {
    var self = this;
    this.manager = manager;
    this.callback = callback;
    this.element = manager.element;
    this.target = manager.options.inputTarget;
    
    this.domHandler = function(ev) {
    if (boolOrFn(manager.options.enable, [manager])) {
    self.handler(ev);
    }
    };
    
    this.init();
    
    }
    
    Input.prototype = {
    handler: function() { },
    
    init: function() {
    this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
    this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
    this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    },
    
    destroy: function() {
    this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
    this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
    this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    }
    };
    
    function createInputInstance(manager) {
    var Type;
    var inputClass = manager.options.inputClass;
    
    if (inputClass) {
    Type = inputClass;
    } else if (!SUPPORT_TOUCH && SUPPORT_POINTER_EVENTS) {
    Type = PointerEventInput;
    } else if (SUPPORT_ONLY_TOUCH) {
    Type = TouchInput;
    } else if (!SUPPORT_TOUCH) {
    Type = MouseInput;
    } else {
    Type = TouchMouseInput;
    }
    return new (Type)(manager, inputHandler);
    }
    
    function inputHandler(manager, eventType, input) {
    var pointersLen = input.pointers.length;
    var changedPointersLen = input.changedPointers.length;
    var isFirst = (eventType & INPUT_START && (pointersLen - changedPointersLen === 0));
    var isFinal = (eventType & (INPUT_END | INPUT_CANCEL) && (pointersLen - changedPointersLen === 0));
    
    input.isFirst = !!isFirst;
    input.isFinal = !!isFinal;
    
    if (isFirst) {
    manager.session = {};
    }
    
    input.eventType = eventType;
    
    computeInputData(manager, input);
    
    manager.emit('hammer.input', input);
    
    manager.recognize(input);
    manager.session.prevInput = input;
    }
    
    function computeInputData(manager, input) {
    var session = manager.session;
    var pointers = input.pointers;
    var pointersLength = pointers.length;
    
    if (!session.firstInput) {
    session.firstInput = simpleCloneInputData(input);
    }
    
    if (pointersLength > 1 && !session.firstMultiple) {
    session.firstMultiple = simpleCloneInputData(input);
    } else if (pointersLength === 1) {
    session.firstMultiple = false;
    }
    
    var firstInput = session.firstInput;
    var firstMultiple = session.firstMultiple;
    var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;
    
    var center = input.center = getCenter(pointers);
    input.timeStamp = now();
    input.deltaTime = input.timeStamp - firstInput.timeStamp;
    
    input.angle = getAngle(offsetCenter, center);
    input.distance = getDistance(offsetCenter, center);
    
    computeDeltaXY(session, input);
    input.offsetDirection = getDirection(input.deltaX, input.deltaY);
    
    var overallVelocity = getVelocity(input.deltaTime, input.deltaX, input.deltaY);
    input.overallVelocityX = overallVelocity.x;
    input.overallVelocityY = overallVelocity.y;
    input.overallVelocity = (abs(overallVelocity.x) > abs(overallVelocity.y)) ? overallVelocity.x : overallVelocity.y;
    
    input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
    input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;
    
    input.maxPointers = !session.prevInput ? input.pointers.length : ((input.pointers.length >
    session.prevInput.maxPointers) ? input.pointers.length : session.prevInput.maxPointers);
    
    computeIntervalInputData(session, input);
    
    var target = manager.element;
    if (hasParent(input.srcEvent.target, target)) {
    target = input.srcEvent.target;
    }
    input.target = target;
    }
    
    function computeDeltaXY(session, input) {
    var center = input.center;
    var offset = session.offsetDelta || {};
    var prevDelta = session.prevDelta || {};
    var prevInput = session.prevInput || {};
    
    if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
    prevDelta = session.prevDelta = {
    x: prevInput.deltaX || 0,
    y: prevInput.deltaY || 0
    };
    
    offset = session.offsetDelta = {
    x: center.x,
    y: center.y
    };
    }
    
    input.deltaX = prevDelta.x + (center.x - offset.x);
    input.deltaY = prevDelta.y + (center.y - offset.y);
    }
    
    function computeIntervalInputData(session, input) {
    var last = session.lastInterval || input,
    deltaTime = input.timeStamp - last.timeStamp,
    velocity, velocityX, velocityY, direction;
    
    if (input.eventType != INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined)) {
    var deltaX = input.deltaX - last.deltaX;
    var deltaY = input.deltaY - last.deltaY;
    
    var v = getVelocity(deltaTime, deltaX, deltaY);
    velocityX = v.x;
    velocityY = v.y;
    velocity = (abs(v.x) > abs(v.y)) ? v.x : v.y;
    direction = getDirection(deltaX, deltaY);
    
    session.lastInterval = input;
    } else {
    velocity = last.velocity;
    velocityX = last.velocityX;
    velocityY = last.velocityY;
    direction = last.direction;
    }
    
    input.velocity = velocity;
    input.velocityX = velocityX;
    input.velocityY = velocityY;
    input.direction = direction;
    }
    
    function simpleCloneInputData(input) {
    var pointers = [];
    var i = 0;
    while (i < input.pointers.length) {
    pointers[i] = {
    clientX: round(input.pointers[i].clientX),
    clientY: round(input.pointers[i].clientY)
    };
    i++;
    }
    
    return {
    timeStamp: now(),
    pointers: pointers,
    center: getCenter(pointers),
    deltaX: input.deltaX,
    deltaY: input.deltaY
    };
    }
    
    function getCenter(pointers) {
    var pointersLength = pointers.length;
    
    if (pointersLength === 1) {
    return {
    x: round(pointers[0].clientX),
    y: round(pointers[0].clientY)
    };
    }
    
    var x = 0, y = 0, i = 0;
    while (i < pointersLength) {
    x += pointers[i].clientX;
    y += pointers[i].clientY;
    i++;
    }
    
    return {
    x: round(x / pointersLength),
    y: round(y / pointersLength)
    };
    }
    
    function getVelocity(deltaTime, x, y) {
    return {
    x: x / deltaTime || 0,
    y: y / deltaTime || 0
    };
    }
    
    function getDirection(x, y) {
    if (x === y) {
    return DIRECTION_NONE;
    }
    
    if (abs(x) >= abs(y)) {
    return x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
    }
    return y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
    }
    
    function getDistance(p1, p2, props) {
    if (!props) {
    props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
    y = p2[props[1]] - p1[props[1]];
    
    return Math.sqrt((x * x) + (y * y));
    }
    
    function getAngle(p1, p2, props) {
    if (!props) {
    props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
    y = p2[props[1]] - p1[props[1]];
    return Math.atan2(y, x) * 180 / Math.PI;
    }
    
    function getRotation(start, end) {
    return getAngle(end[1], end[0], PROPS_CLIENT_XY) + getAngle(start[1], start[0], PROPS_CLIENT_XY);
    }
    
    function getScale(start, end) {
    return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
    }
    
    var MOUSE_INPUT_MAP = {
    mousedown: INPUT_START,
    mousemove: INPUT_MOVE,
    mouseup: INPUT_END
    };
    
    var MOUSE_ELEMENT_EVENTS = 'mousedown';
    var MOUSE_WINDOW_EVENTS = 'mousemove mouseup';
    
    function MouseInput() {
    this.evEl = MOUSE_ELEMENT_EVENTS;
    this.evWin = MOUSE_WINDOW_EVENTS;
    
    this.pressed = false; // mousedown state
    
    Input.apply(this, arguments);
    }
    
    inherit(MouseInput, Input, {
    handler: function MEhandler(ev) {
    var eventType = MOUSE_INPUT_MAP[ev.type];
    
    if (eventType & INPUT_START && ev.button === 0) {
    this.pressed = true;
    }
    
    if (eventType & INPUT_MOVE && ev.which !== 1) {
    eventType = INPUT_END;
    }
    
    if (!this.pressed) {
    return;
    }
    
    if (eventType & INPUT_END) {
    this.pressed = false;
    }
    
    this.callback(this.manager, eventType, {
    pointers: [ev],
    changedPointers: [ev],
    pointerType: INPUT_TYPE_MOUSE,
    srcEvent: ev
    });
    }
    });
    
    var POINTER_INPUT_MAP = {
    pointerdown: INPUT_START,
    pointermove: INPUT_MOVE,
    pointerup: INPUT_END,
    pointercancel: INPUT_CANCEL,
    pointerout: INPUT_CANCEL
    };
    
    var IE10_POINTER_TYPE_ENUM = {
    2: INPUT_TYPE_TOUCH,
    3: INPUT_TYPE_PEN,
    4: INPUT_TYPE_MOUSE,
    5: INPUT_TYPE_KINECT // see https://twitter.com/jacobrossi/status/480596438489890816
    };
    
    var POINTER_ELEMENT_EVENTS = 'pointerdown';
    var POINTER_WINDOW_EVENTS = 'pointermove pointerup pointercancel';
    
    if (window.MSPointerEvent && !window.PointerEvent) {
    POINTER_ELEMENT_EVENTS = 'MSPointerDown';
    POINTER_WINDOW_EVENTS = 'MSPointerMove MSPointerUp MSPointerCancel';
    }
    
    function PointerEventInput() {
    this.evEl = POINTER_ELEMENT_EVENTS;
    this.evWin = POINTER_WINDOW_EVENTS;
    
    Input.apply(this, arguments);
    
    this.store = (this.manager.session.pointerEvents = []);
    }
    
    inherit(PointerEventInput, Input, {
    handler: function PEhandler(ev) {
    var store = this.store;
    var removePointer = false;
    
    var eventTypeNormalized = ev.type.toLowerCase().replace('ms', '');
    var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
    var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;
    
    var isTouch = (pointerType == INPUT_TYPE_TOUCH);
    
    var storeIndex = inArray(store, ev.pointerId, 'pointerId');
    
    if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
    if (storeIndex < 0) {
    store.push(ev);
    storeIndex = store.length - 1;
    }
    } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
    removePointer = true;
    }
    
    if (storeIndex < 0) {
    return;
    }
    
    store[storeIndex] = ev;
    
    this.callback(this.manager, eventType, {
    pointers: store,
    changedPointers: [ev],
    pointerType: pointerType,
    srcEvent: ev
    });
    
    if (removePointer) {
    store.splice(storeIndex, 1);
    }
    }
    });
    
    var SINGLE_TOUCH_INPUT_MAP = {
    touchstart: INPUT_START,
    touchmove: INPUT_MOVE,
    touchend: INPUT_END,
    touchcancel: INPUT_CANCEL
    };
    
    var SINGLE_TOUCH_TARGET_EVENTS = 'touchstart';
    var SINGLE_TOUCH_WINDOW_EVENTS = 'touchstart touchmove touchend touchcancel';
    
    function SingleTouchInput() {
    this.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
    this.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
    this.started = false;
    
    Input.apply(this, arguments);
    }
    
    inherit(SingleTouchInput, Input, {
    handler: function TEhandler(ev) {
    var type = SINGLE_TOUCH_INPUT_MAP[ev.type];
    
    if (type === INPUT_START) {
    this.started = true;
    }
    
    if (!this.started) {
    return;
    }
    
    var touches = normalizeSingleTouches.call(this, ev, type);
    
    if (type & (INPUT_END | INPUT_CANCEL) && touches[0].length - touches[1].length === 0) {
    this.started = false;
    }
    
    this.callback(this.manager, type, {
    pointers: touches[0],
    changedPointers: touches[1],
    pointerType: INPUT_TYPE_TOUCH,
    srcEvent: ev
    });
    }
    });
    
    function normalizeSingleTouches(ev, type) {
    var all = toArray(ev.touches);
    var changed = toArray(ev.changedTouches);
    
    if (type & (INPUT_END | INPUT_CANCEL)) {
    all = uniqueArray(all.concat(changed), 'identifier', true);
    }
    
    return [all, changed];
    }
    
    var TOUCH_INPUT_MAP = {
    touchstart: INPUT_START,
    touchmove: INPUT_MOVE,
    touchend: INPUT_END,
    touchcancel: INPUT_CANCEL
    };
    
    var TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';
    
    function TouchInput() {
    this.evTarget = TOUCH_TARGET_EVENTS;
    this.targetIds = {};
    
    Input.apply(this, arguments);
    }
    
    inherit(TouchInput, Input, {
    handler: function MTEhandler(ev) {
    var type = TOUCH_INPUT_MAP[ev.type];
    var touches = getTouches.call(this, ev, type);
    if (!touches) {
    return;
    }
    
    this.callback(this.manager, type, {
    pointers: touches[0],
    changedPointers: touches[1],
    pointerType: INPUT_TYPE_TOUCH,
    srcEvent: ev
    });
    }
    });
    
    function getTouches(ev, type) {
    var allTouches = toArray(ev.touches);
    var targetIds = this.targetIds;
    
    if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
    targetIds[allTouches[0].identifier] = true;
    return [allTouches, allTouches];
    }
    
    var i,
    targetTouches,
    changedTouches = toArray(ev.changedTouches),
    changedTargetTouches = [],
    target = this.target;
    
    targetTouches = allTouches.filter(function(touch) {
    return hasParent(touch.target, target);
    });
    
    if (type === INPUT_START) {
    i = 0;
    while (i < targetTouches.length) {
    targetIds[targetTouches[i].identifier] = true;
    i++;
    }
    }
    
    i = 0;
    while (i < changedTouches.length) {
    if (targetIds[changedTouches[i].identifier]) {
    changedTargetTouches.push(changedTouches[i]);
    }
    
    if (type & (INPUT_END | INPUT_CANCEL)) {
    delete targetIds[changedTouches[i].identifier];
    }
    i++;
    }
    
    if (!changedTargetTouches.length) {
    return;
    }
    
    return [
    uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true),
    changedTargetTouches
    ];
    }
    
    
    var DEDUP_TIMEOUT = 2500;
    var DEDUP_DISTANCE = 25;
    
    function TouchMouseInput() {
    Input.apply(this, arguments);
    
    var handler = bindFn(this.handler, this);
    this.touch = new TouchInput(this.manager, handler);
    this.mouse = new MouseInput(this.manager, handler);
    
    this.primaryTouch = null;
    this.lastTouches = [];
    }
    
    inherit(TouchMouseInput, Input, {
    handler: function TMEhandler(manager, inputEvent, inputData) {
    var isTouch = (inputData.pointerType == INPUT_TYPE_TOUCH),
    isMouse = (inputData.pointerType == INPUT_TYPE_MOUSE);
    
    if (isMouse && inputData.sourceCapabilities && inputData.sourceCapabilities.firesTouchEvents) {
    return;
    }
    
    if (isTouch) {
    recordTouches.call(this, inputEvent, inputData);
    } else if (isMouse && isSyntheticEvent.call(this, inputData)) {
    return;
    }
    
    this.callback(manager, inputEvent, inputData);
    },
    
    destroy: function destroy() {
    this.touch.destroy();
    this.mouse.destroy();
    }
    });
    
    function recordTouches(eventType, eventData) {
    if (eventType & INPUT_START) {
    this.primaryTouch = eventData.changedPointers[0].identifier;
    setLastTouch.call(this, eventData);
    } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
    setLastTouch.call(this, eventData);
    }
    }
    
    function setLastTouch(eventData) {
    var touch = eventData.changedPointers[0];
    
    if (touch.identifier === this.primaryTouch) {
    var lastTouch = {x: touch.clientX, y: touch.clientY};
    this.lastTouches.push(lastTouch);
    var lts = this.lastTouches;
    var removeLastTouch = function() {
    var i = lts.indexOf(lastTouch);
    if (i > -1) {
    lts.splice(i, 1);
    }
    };
    setTimeout(removeLastTouch, DEDUP_TIMEOUT);
    }
    }
    
    function isSyntheticEvent(eventData) {
    var x = eventData.srcEvent.clientX, y = eventData.srcEvent.clientY;
    for (var i = 0; i < this.lastTouches.length; i++) {
    var t = this.lastTouches[i];
    var dx = Math.abs(x - t.x), dy = Math.abs(y - t.y);
    if (dx <= DEDUP_DISTANCE && dy <= DEDUP_DISTANCE) {
    return true;
    }
    }
    return false;
    }
    
    var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, 'touchAction');
    var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined;
    
    var TOUCH_ACTION_COMPUTE = 'compute';
    var TOUCH_ACTION_AUTO = 'auto';
    var TOUCH_ACTION_MANIPULATION = 'manipulation'; // not implemented
    var TOUCH_ACTION_NONE = 'none';
    var TOUCH_ACTION_PAN_X = 'pan-x';
    var TOUCH_ACTION_PAN_Y = 'pan-y';
    var TOUCH_ACTION_MAP = getTouchActionProps();
    
    function TouchAction(manager, value) {
    this.manager = manager;
    this.set(value);
    }
    
    TouchAction.prototype = {
    set: function(value) {
    if (value == TOUCH_ACTION_COMPUTE) {
    value = this.compute();
    }
    
    if (NATIVE_TOUCH_ACTION && this.manager.element.style && TOUCH_ACTION_MAP[value]) {
    this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
    }
    this.actions = value.toLowerCase().trim();
    },
    
    update: function() {
    this.set(this.manager.options.touchAction);
    },
    
    compute: function() {
    var actions = [];
    each(this.manager.recognizers, function(recognizer) {
    if (boolOrFn(recognizer.options.enable, [recognizer])) {
    actions = actions.concat(recognizer.getTouchAction());
    }
    });
    return cleanTouchActions(actions.join(' '));
    },
    
    preventDefaults: function(input) {
    var srcEvent = input.srcEvent;
    var direction = input.offsetDirection;
    
    if (this.manager.session.prevented) {
    srcEvent.preventDefault();
    return;
    }
    
    var actions = this.actions;
    var hasNone = inStr(actions, TOUCH_ACTION_NONE) && !TOUCH_ACTION_MAP[TOUCH_ACTION_NONE];
    var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_Y];
    var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_X];
    
    if (hasNone) {
    
    var isTapPointer = input.pointers.length === 1;
    var isTapMovement = input.distance < 2;
    var isTapTouchTime = input.deltaTime < 250;
    
    if (isTapPointer && isTapMovement && isTapTouchTime) {
    return;
    }
    }
    
    if (hasPanX && hasPanY) {
    return;
    }
    
    if (hasNone ||
    (hasPanY && direction & DIRECTION_HORIZONTAL) ||
    (hasPanX && direction & DIRECTION_VERTICAL)) {
    return this.preventSrc(srcEvent);
    }
    },
    
    preventSrc: function(srcEvent) {
    this.manager.session.prevented = true;
    srcEvent.preventDefault();
    }
    };
    
    function cleanTouchActions(actions) {
    if (inStr(actions, TOUCH_ACTION_NONE)) {
    return TOUCH_ACTION_NONE;
    }
    
    var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
    var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);
    
    if (hasPanX && hasPanY) {
    return TOUCH_ACTION_NONE;
    }
    
    if (hasPanX || hasPanY) {
    return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
    }
    
    if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
    return TOUCH_ACTION_MANIPULATION;
    }
    
    return TOUCH_ACTION_AUTO;
    }
    
    function getTouchActionProps() {
    if (!NATIVE_TOUCH_ACTION) {
    return false;
    }
    var touchMap = {};
    var cssSupports = window.CSS && window.CSS.supports;
    ['auto', 'manipulation', 'pan-y', 'pan-x', 'pan-x pan-y', 'none'].forEach(function(val) {
    
    touchMap[val] = cssSupports ? window.CSS.supports('touch-action', val) : true;
    });
    return touchMap;
    }
    
    var STATE_POSSIBLE = 1;
    var STATE_BEGAN = 2;
    var STATE_CHANGED = 4;
    var STATE_ENDED = 8;
    var STATE_RECOGNIZED = STATE_ENDED;
    var STATE_CANCELLED = 16;
    var STATE_FAILED = 32;
    
    function Recognizer(options) {
    this.options = assign({}, this.defaults, options || {});
    
    this.id = uniqueId();
    
    this.manager = null;
    
    this.options.enable = ifUndefined(this.options.enable, true);
    
    this.state = STATE_POSSIBLE;
    
    this.simultaneous = {};
    this.requireFail = [];
    }
    
    Recognizer.prototype = {
    defaults: {},
    
    set: function(options) {
    assign(this.options, options);
    
    this.manager && this.manager.touchAction.update();
    return this;
    },
    
    recognizeWith: function(otherRecognizer) {
    if (invokeArrayArg(otherRecognizer, 'recognizeWith', this)) {
    return this;
    }
    
    var simultaneous = this.simultaneous;
    otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
    if (!simultaneous[otherRecognizer.id]) {
    simultaneous[otherRecognizer.id] = otherRecognizer;
    otherRecognizer.recognizeWith(this);
    }
    return this;
    },
    
    dropRecognizeWith: function(otherRecognizer) {
    if (invokeArrayArg(otherRecognizer, 'dropRecognizeWith', this)) {
    return this;
    }
    
    otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
    delete this.simultaneous[otherRecognizer.id];
    return this;
    },
    
    requireFailure: function(otherRecognizer) {
    if (invokeArrayArg(otherRecognizer, 'requireFailure', this)) {
    return this;
    }
    
    var requireFail = this.requireFail;
    otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
    if (inArray(requireFail, otherRecognizer) === -1) {
    requireFail.push(otherRecognizer);
    otherRecognizer.requireFailure(this);
    }
    return this;
    },
    
    dropRequireFailure: function(otherRecognizer) {
    if (invokeArrayArg(otherRecognizer, 'dropRequireFailure', this)) {
    return this;
    }
    
    otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
    var index = inArray(this.requireFail, otherRecognizer);
    if (index > -1) {
    this.requireFail.splice(index, 1);
    }
    return this;
    },
    
    hasRequireFailures: function() {
    return this.requireFail.length > 0;
    },
    
    canRecognizeWith: function(otherRecognizer) {
    return !!this.simultaneous[otherRecognizer.id];
    },
    
    emit: function(input) {
    var self = this;
    var state = this.state;
    
    function emit(event) {
    self.manager.emit(event, input);
    }
    
    if (state < STATE_ENDED) {
    emit(self.options.event + stateStr(state));
    }
    
    emit(self.options.event); // simple 'eventName' events
    
    if (input.additionalEvent) { // additional event(panleft, panright, pinchin, pinchout...)
    emit(input.additionalEvent);
    }
    
    if (state >= STATE_ENDED) {
    emit(self.options.event + stateStr(state));
    }
    },
    
    tryEmit: function(input) {
    if (this.canEmit()) {
    return this.emit(input);
    }
    this.state = STATE_FAILED;
    },
    
    canEmit: function() {
    var i = 0;
    while (i < this.requireFail.length) {
    if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
    return false;
    }
    i++;
    }
    return true;
    },
    
    recognize: function(inputData) {
    var inputDataClone = assign({}, inputData);
    
    if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
    this.reset();
    this.state = STATE_FAILED;
    return;
    }
    
    if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
    this.state = STATE_POSSIBLE;
    }
    
    this.state = this.process(inputDataClone);
    
    if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
    this.tryEmit(inputDataClone);
    }
    },
    
    process: function(inputData) { }, // jshint ignore:line
    
    getTouchAction: function() { },
    
    reset: function() { }
    };
    
    function stateStr(state) {
    if (state & STATE_CANCELLED) {
    return 'cancel';
    } else if (state & STATE_ENDED) {
    return 'end';
    } else if (state & STATE_CHANGED) {
    return 'move';
    } else if (state & STATE_BEGAN) {
    return 'start';
    }
    return '';
    }
    
    function directionStr(direction) {
    if (direction == DIRECTION_DOWN) {
    return 'down';
    } else if (direction == DIRECTION_UP) {
    return 'up';
    } else if (direction == DIRECTION_LEFT) {
    return 'left';
    } else if (direction == DIRECTION_RIGHT) {
    return 'right';
    }
    return '';
    }
    
    function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
    var manager = recognizer.manager;
    if (manager) {
    return manager.get(otherRecognizer);
    }
    return otherRecognizer;
    }
    
    function AttrRecognizer() {
    Recognizer.apply(this, arguments);
    }
    
    inherit(AttrRecognizer, Recognizer, {
    defaults: {
    pointers: 1
    },
    
    attrTest: function(input) {
    var optionPointers = this.options.pointers;
    return optionPointers === 0 || input.pointers.length === optionPointers;
    },
    
    process: function(input) {
    var state = this.state;
    var eventType = input.eventType;
    
    var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
    var isValid = this.attrTest(input);
    
    if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
    return state | STATE_CANCELLED;
    } else if (isRecognized || isValid) {
    if (eventType & INPUT_END) {
    return state | STATE_ENDED;
    } else if (!(state & STATE_BEGAN)) {
    return STATE_BEGAN;
    }
    return state | STATE_CHANGED;
    }
    return STATE_FAILED;
    }
    });
    
    function PanRecognizer() {
    AttrRecognizer.apply(this, arguments);
    
    this.pX = null;
    this.pY = null;
    }
    
    inherit(PanRecognizer, AttrRecognizer, {
    defaults: {
    event: 'pan',
    threshold: 10,
    pointers: 1,
    direction: DIRECTION_ALL
    },
    
    getTouchAction: function() {
    var direction = this.options.direction;
    var actions = [];
    if (direction & DIRECTION_HORIZONTAL) {
    actions.push(TOUCH_ACTION_PAN_Y);
    }
    if (direction & DIRECTION_VERTICAL) {
    actions.push(TOUCH_ACTION_PAN_X);
    }
    return actions;
    },
    
    directionTest: function(input) {
    var options = this.options;
    var hasMoved = true;
    var distance = input.distance;
    var direction = input.direction;
    var x = input.deltaX;
    var y = input.deltaY;
    
    if (!(direction & options.direction)) {
    if (options.direction & DIRECTION_HORIZONTAL) {
    direction = (x === 0) ? DIRECTION_NONE : (x < 0) ? DIRECTION_LEFT : DIRECTION_RIGHT;
    hasMoved = x != this.pX;
    distance = Math.abs(input.deltaX);
    } else {
    direction = (y === 0) ? DIRECTION_NONE : (y < 0) ? DIRECTION_UP : DIRECTION_DOWN;
    hasMoved = y != this.pY;
    distance = Math.abs(input.deltaY);
    }
    }
    input.direction = direction;
    return hasMoved && distance > options.threshold && direction & options.direction;
    },
    
    attrTest: function(input) {
    return AttrRecognizer.prototype.attrTest.call(this, input) &&
    (this.state & STATE_BEGAN || (!(this.state & STATE_BEGAN) && this.directionTest(input)));
    },
    
    emit: function(input) {
    
    this.pX = input.deltaX;
    this.pY = input.deltaY;
    
    var direction = directionStr(input.direction);
    
    if (direction) {
    input.additionalEvent = this.options.event + direction;
    }
    this._super.emit.call(this, input);
    }
    });
    
    function PinchRecognizer() {
    AttrRecognizer.apply(this, arguments);
    }
    
    inherit(PinchRecognizer, AttrRecognizer, {
    defaults: {
    event: 'pinch',
    threshold: 0,
    pointers: 2
    },
    
    getTouchAction: function() {
    return [TOUCH_ACTION_NONE];
    },
    
    attrTest: function(input) {
    return this._super.attrTest.call(this, input) &&
    (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
    },
    
    emit: function(input) {
    if (input.scale !== 1) {
    var inOut = input.scale < 1 ? 'in' : 'out';
    input.additionalEvent = this.options.event + inOut;
    }
    this._super.emit.call(this, input);
    }
    });
    
    function PressRecognizer() {
    Recognizer.apply(this, arguments);
    
    this._timer = null;
    this._input = null;
    }
    
    inherit(PressRecognizer, Recognizer, {
    defaults: {
    event: 'press',
    pointers: 1,
    time: 251, // minimal time of the pointer to be pressed
    threshold: 9 // a minimal movement is ok, but keep it low
    },
    
    getTouchAction: function() {
    return [TOUCH_ACTION_AUTO];
    },
    
    process: function(input) {
    var options = this.options;
    var validPointers = input.pointers.length === options.pointers;
    var validMovement = input.distance < options.threshold;
    var validTime = input.deltaTime > options.time;
    
    this._input = input;
    
    if (!validMovement || !validPointers || (input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime)) {
    this.reset();
    } else if (input.eventType & INPUT_START) {
    this.reset();
    this._timer = setTimeoutContext(function() {
    this.state = STATE_RECOGNIZED;
    this.tryEmit();
    }, options.time, this);
    } else if (input.eventType & INPUT_END) {
    return STATE_RECOGNIZED;
    }
    return STATE_FAILED;
    },
    
    reset: function() {
    clearTimeout(this._timer);
    },
    
    emit: function(input) {
    if (this.state !== STATE_RECOGNIZED) {
    return;
    }
    
    if (input && (input.eventType & INPUT_END)) {
    this.manager.emit(this.options.event + 'up', input);
    } else {
    this._input.timeStamp = now();
    this.manager.emit(this.options.event, this._input);
    }
    }
    });
    
    function RotateRecognizer() {
    AttrRecognizer.apply(this, arguments);
    }
    
    inherit(RotateRecognizer, AttrRecognizer, {
    defaults: {
    event: 'rotate',
    threshold: 0,
    pointers: 2
    },
    
    getTouchAction: function() {
    return [TOUCH_ACTION_NONE];
    },
    
    attrTest: function(input) {
    return this._super.attrTest.call(this, input) &&
    (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
    }
    });
    
    function SwipeRecognizer() {
    AttrRecognizer.apply(this, arguments);
    }
    
    inherit(SwipeRecognizer, AttrRecognizer, {
    defaults: {
    event: 'swipe',
    threshold: 10,
    velocity: 0.3,
    direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
    pointers: 1
    },
    
    getTouchAction: function() {
    return PanRecognizer.prototype.getTouchAction.call(this);
    },
    
    attrTest: function(input) {
    var direction = this.options.direction;
    var velocity;
    
    if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
    velocity = input.overallVelocity;
    } else if (direction & DIRECTION_HORIZONTAL) {
    velocity = input.overallVelocityX;
    } else if (direction & DIRECTION_VERTICAL) {
    velocity = input.overallVelocityY;
    }
    
    return this._super.attrTest.call(this, input) &&
    direction & input.offsetDirection &&
    input.distance > this.options.threshold &&
    input.maxPointers == this.options.pointers &&
    abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
    },
    
    emit: function(input) {
    var direction = directionStr(input.offsetDirection);
    if (direction) {
    this.manager.emit(this.options.event + direction, input);
    }
    
    this.manager.emit(this.options.event, input);
    }
    });
    
    function TapRecognizer() {
    Recognizer.apply(this, arguments);
    
    this.pTime = false;
    this.pCenter = false;
    
    this._timer = null;
    this._input = null;
    this.count = 0;
    }
    
    inherit(TapRecognizer, Recognizer, {
    defaults: {
    event: 'tap',
    pointers: 1,
    taps: 1,
    interval: 300, // max time between the multi-tap taps
    time: 250, // max time of the pointer to be down (like finger on the screen)
    threshold: 9, // a minimal movement is ok, but keep it low
    posThreshold: 10 // a multi-tap can be a bit off the initial position
    },
    
    getTouchAction: function() {
    return [TOUCH_ACTION_MANIPULATION];
    },
    
    process: function(input) {
    var options = this.options;
    
    var validPointers = input.pointers.length === options.pointers;
    var validMovement = input.distance < options.threshold;
    var validTouchTime = input.deltaTime < options.time;
    
    this.reset();
    
    if ((input.eventType & INPUT_START) && (this.count === 0)) {
    return this.failTimeout();
    }
    
    if (validMovement && validTouchTime && validPointers) {
    if (input.eventType != INPUT_END) {
    return this.failTimeout();
    }
    
    var validInterval = this.pTime ? (input.timeStamp - this.pTime < options.interval) : true;
    var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;
    
    this.pTime = input.timeStamp;
    this.pCenter = input.center;
    
    if (!validMultiTap || !validInterval) {
    this.count = 1;
    } else {
    this.count += 1;
    }
    
    this._input = input;
    
    var tapCount = this.count % options.taps;
    if (tapCount === 0) {
    if (!this.hasRequireFailures()) {
    return STATE_RECOGNIZED;
    } else {
    this._timer = setTimeoutContext(function() {
    this.state = STATE_RECOGNIZED;
    this.tryEmit();
    }, options.interval, this);
    return STATE_BEGAN;
    }
    }
    }
    return STATE_FAILED;
    },
    
    failTimeout: function() {
    this._timer = setTimeoutContext(function() {
    this.state = STATE_FAILED;
    }, this.options.interval, this);
    return STATE_FAILED;
    },
    
    reset: function() {
    clearTimeout(this._timer);
    },
    
    emit: function() {
    if (this.state == STATE_RECOGNIZED) {
    this._input.tapCount = this.count;
    this.manager.emit(this.options.event, this._input);
    }
    }
    });
    
    function Hammer(element, options) {
    options = options || {};
    options.recognizers = ifUndefined(options.recognizers, Hammer.defaults.preset);
    return new Manager(element, options);
    }
    
    Hammer.VERSION = '2.0.7';
    
    Hammer.defaults = {
    domEvents: false,
    
    touchAction: TOUCH_ACTION_COMPUTE,
    
    enable: true,
    
    inputTarget: null,
    
    inputClass: null,
    
    preset: [
    [RotateRecognizer, {enable: false}],
    [PinchRecognizer, {enable: false}, ['rotate']],
    [SwipeRecognizer, {direction: DIRECTION_HORIZONTAL}],
    [PanRecognizer, {direction: DIRECTION_HORIZONTAL}, ['swipe']],
    [TapRecognizer],
    [TapRecognizer, {event: 'doubletap', taps: 2}, ['tap']],
    [PressRecognizer]
    ],
    
    cssProps: {
    userSelect: 'none',
    
    touchSelect: 'none',
    
    touchCallout: 'none',
    
    contentZooming: 'none',
    
    userDrag: 'none',
    
    tapHighlightColor: 'rgba(0,0,0,0)'
    }
    };
    
    var STOP = 1;
    var FORCED_STOP = 2;
    
    function Manager(element, options) {
    this.options = assign({}, Hammer.defaults, options || {});
    
    this.options.inputTarget = this.options.inputTarget || element;
    
    this.handlers = {};
    this.session = {};
    this.recognizers = [];
    this.oldCssProps = {};
    
    this.element = element;
    this.input = createInputInstance(this);
    this.touchAction = new TouchAction(this, this.options.touchAction);
    
    toggleCssProps(this, true);
    
    each(this.options.recognizers, function(item) {
    var recognizer = this.add(new (item[0])(item[1]));
    item[2] && recognizer.recognizeWith(item[2]);
    item[3] && recognizer.requireFailure(item[3]);
    }, this);
    }
    
    Manager.prototype = {
    set: function(options) {
    assign(this.options, options);
    
    if (options.touchAction) {
    this.touchAction.update();
    }
    if (options.inputTarget) {
    this.input.destroy();
    this.input.target = options.inputTarget;
    this.input.init();
    }
    return this;
    },
    
    stop: function(force) {
    this.session.stopped = force ? FORCED_STOP : STOP;
    },
    
    recognize: function(inputData) {
    var session = this.session;
    if (session.stopped) {
    return;
    }
    
    this.touchAction.preventDefaults(inputData);
    
    var recognizer;
    var recognizers = this.recognizers;
    
    var curRecognizer = session.curRecognizer;
    
    if (!curRecognizer || (curRecognizer && curRecognizer.state & STATE_RECOGNIZED)) {
    curRecognizer = session.curRecognizer = null;
    }
    
    var i = 0;
    while (i < recognizers.length) {
    recognizer = recognizers[i];
    
    if (session.stopped !== FORCED_STOP && ( // 1
    !curRecognizer || recognizer == curRecognizer || // 2
    recognizer.canRecognizeWith(curRecognizer))) { // 3
    recognizer.recognize(inputData);
    } else {
    recognizer.reset();
    }
    
    if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
    curRecognizer = session.curRecognizer = recognizer;
    }
    i++;
    }
    },
    
    get: function(recognizer) {
    if (recognizer instanceof Recognizer) {
    return recognizer;
    }
    
    var recognizers = this.recognizers;
    for (var i = 0; i < recognizers.length; i++) {
    if (recognizers[i].options.event == recognizer) {
    return recognizers[i];
    }
    }
    return null;
    },
    
    add: function(recognizer) {
    if (invokeArrayArg(recognizer, 'add', this)) {
    return this;
    }
    
    var existing = this.get(recognizer.options.event);
    if (existing) {
    this.remove(existing);
    }
    
    this.recognizers.push(recognizer);
    recognizer.manager = this;
    
    this.touchAction.update();
    return recognizer;
    },
    
    remove: function(recognizer) {
    if (invokeArrayArg(recognizer, 'remove', this)) {
    return this;
    }
    
    recognizer = this.get(recognizer);
    
    if (recognizer) {
    var recognizers = this.recognizers;
    var index = inArray(recognizers, recognizer);
    
    if (index !== -1) {
    recognizers.splice(index, 1);
    this.touchAction.update();
    }
    }
    
    return this;
    },
    
    on: function(events, handler) {
    if (events === undefined) {
    return;
    }
    if (handler === undefined) {
    return;
    }
    
    var handlers = this.handlers;
    each(splitStr(events), function(event) {
    handlers[event] = handlers[event] || [];
    handlers[event].push(handler);
    });
    return this;
    },
    
    off: function(events, handler) {
    if (events === undefined) {
    return;
    }
    
    var handlers = this.handlers;
    each(splitStr(events), function(event) {
    if (!handler) {
    delete handlers[event];
    } else {
    handlers[event] && handlers[event].splice(inArray(handlers[event], handler), 1);
    }
    });
    return this;
    },
    
    emit: function(event, data) {
    if (this.options.domEvents) {
    triggerDomEvent(event, data);
    }
    
    var handlers = this.handlers[event] && this.handlers[event].slice();
    if (!handlers || !handlers.length) {
    return;
    }
    
    data.type = event;
    data.preventDefault = function() {
    data.srcEvent.preventDefault();
    };
    
    var i = 0;
    while (i < handlers.length) {
    handlers[i](data);
    i++;
    }
    },
    
    destroy: function() {
    this.element && toggleCssProps(this, false);
    
    this.handlers = {};
    this.session = {};
    this.input.destroy();
    this.element = null;
    }
    };
    
    function toggleCssProps(manager, add) {
    var element = manager.element;
    if (!element.style) {
    return;
    }
    var prop;
    each(manager.options.cssProps, function(value, name) {
    prop = prefixed(element.style, name);
    if (add) {
    manager.oldCssProps[prop] = element.style[prop];
    element.style[prop] = value;
    } else {
    element.style[prop] = manager.oldCssProps[prop] || '';
    }
    });
    if (!add) {
    manager.oldCssProps = {};
    }
    }
    
    function triggerDomEvent(event, data) {
    var gestureEvent = document.createEvent('Event');
    gestureEvent.initEvent(event, true, true);
    gestureEvent.gesture = data;
    data.target.dispatchEvent(gestureEvent);
    }
    
    assign(Hammer, {
    INPUT_START: INPUT_START,
    INPUT_MOVE: INPUT_MOVE,
    INPUT_END: INPUT_END,
    INPUT_CANCEL: INPUT_CANCEL,
    
    STATE_POSSIBLE: STATE_POSSIBLE,
    STATE_BEGAN: STATE_BEGAN,
    STATE_CHANGED: STATE_CHANGED,
    STATE_ENDED: STATE_ENDED,
    STATE_RECOGNIZED: STATE_RECOGNIZED,
    STATE_CANCELLED: STATE_CANCELLED,
    STATE_FAILED: STATE_FAILED,
    
    DIRECTION_NONE: DIRECTION_NONE,
    DIRECTION_LEFT: DIRECTION_LEFT,
    DIRECTION_RIGHT: DIRECTION_RIGHT,
    DIRECTION_UP: DIRECTION_UP,
    DIRECTION_DOWN: DIRECTION_DOWN,
    DIRECTION_HORIZONTAL: DIRECTION_HORIZONTAL,
    DIRECTION_VERTICAL: DIRECTION_VERTICAL,
    DIRECTION_ALL: DIRECTION_ALL,
    
    Manager: Manager,
    Input: Input,
    TouchAction: TouchAction,
    
    TouchInput: TouchInput,
    MouseInput: MouseInput,
    PointerEventInput: PointerEventInput,
    TouchMouseInput: TouchMouseInput,
    SingleTouchInput: SingleTouchInput,
    
    Recognizer: Recognizer,
    AttrRecognizer: AttrRecognizer,
    Tap: TapRecognizer,
    Pan: PanRecognizer,
    Swipe: SwipeRecognizer,
    Pinch: PinchRecognizer,
    Rotate: RotateRecognizer,
    Press: PressRecognizer,
    
    on: addEventListeners,
    off: removeEventListeners,
    each: each,
    merge: merge,
    extend: extend,
    assign: assign,
    inherit: inherit,
    bindFn: bindFn,
    prefixed: prefixed
    });
    
    var freeGlobal = (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : {})); // jshint ignore:line
    freeGlobal.Hammer = Hammer;
    
    if (typeof define === 'function' && define.amd) {
    define(function() {
    return Hammer;
    });
    } else if (typeof module != 'undefined' && module.exports) {
    module.exports = Hammer;
    } else {
    window[exportName] = Hammer;
    }
    
    })(window, document, 'Hammer');
    
    /*****
    * @licstart
    *
    * The following is the license notice for the part of JavaScript code of this
    * page included between the '@jessyinkstart' and the '@jessyinkend' notes.
    */
    
    /*****  ******************************************************************
    *
    * Copyright 2008-2013 Hannes Hochreiner
    *
    * The JavaScript code included between the start note '@jessyinkstart'
    * and the end note '@jessyinkend' is subject to the terms of the Mozilla
    * Public License, v. 2.0. If a copy of the MPL was not distributed with
    * this file, You can obtain one at http://mozilla.org/MPL/2.0/.
    *
    * Alternatively, you can redistribute and/or that part of this file
    * under the terms of the GNU General Public License as published by
    * the Free Software Foundation, either version 3 of the License, or
    * (at your option) any later version.
    *
    * This program is distributed in the hope that it will be useful,
    * but WITHOUT ANY WARRANTY; without even the implied warranty of
    * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    * GNU General Public License for more details.
    *
    * You should have received a copy of the GNU General Public License
    * along with this program.  If not, see http://www.gnu.org/licenses/.
    */
    
    /*****
    *  You can find the complete source code of the JessyInk project at:
    *  @source http://code.google.com/p/jessyink/
    */
    
    /*****
    * @licend
    *
    * The above is the license notice for the part of JavaScript code of this
    * page included between the '@jessyinkstart' and the '@jessyinkend' notes.
    */
    
    
    /*****
    * @jessyinkstart
    *
    *  The following code is a derivative work of some parts of the JessyInk
    *  project.
    *  @source http://code.google.com/p/jessyink/
    */
    
    function getElementsByProperty( node, name )
    {
    var elements = [];
    
    if( node.getAttribute( name ) )
    elements.push( node );
    
    for( var counter = 0; counter < node.childNodes.length; ++counter )
    {
    if( node.childNodes[counter].nodeType == 1 )
    {
    var subElements = getElementsByProperty( node.childNodes[counter], name );
    elements = elements.concat( subElements );
    }
    }
    return elements;
    }
    
    function onKeyDown( aEvt )
    {
    if ( !aEvt )
    aEvt = window.event;
    
    var code = aEvt.keyCode || aEvt.charCode;
    
    
    if (code == 0 && aEvt.key != undefined) {
    switch (aEvt.key) {
    case 'UIKeyInputLeftArrow':
    code = LEFT_KEY;
    break;
    case 'UIKeyInputUpArrow':
    code = UP_KEY;
    break;
    case 'UIKeyInputRightArrow':
    code = RIGHT_KEY;
    break;
    case 'UIKeyInputDownArrow':
    code = DOWN_KEY;
    break;
    }
    
    }
    
    if( !processingEffect && keyCodeDictionary[currentMode] && keyCodeDictionary[currentMode][code] )
    {
    return keyCodeDictionary[currentMode][code]();
    }
    else
    {
    document.onkeypress = onKeyPress;
    return null;
    }
    }
    document.onkeydown = onKeyDown;
    
    function onKeyPress( aEvt )
    {
    document.onkeypress = null;
    
    if ( !aEvt )
    aEvt = window.event;
    
    var str = String.fromCharCode( aEvt.keyCode || aEvt.charCode );
    
    if ( !processingEffect && charCodeDictionary[currentMode] && charCodeDictionary[currentMode][str] )
    return charCodeDictionary[currentMode][str]();
    
    return null;
    }
    
    function getDefaultKeyCodeDictionary()
    {
    var keyCodeDict = {};
    
    keyCodeDict[SLIDE_MODE] = {};
    keyCodeDict[INDEX_MODE] = {};
    
    keyCodeDict[SLIDE_MODE][LEFT_KEY]
    = function() { return aSlideShow.rewindEffect(); };
    keyCodeDict[SLIDE_MODE][RIGHT_KEY]
    = function() { return dispatchEffects(1); };
    keyCodeDict[SLIDE_MODE][UP_KEY]
    = function() { return aSlideShow.rewindEffect(); };
    keyCodeDict[SLIDE_MODE][DOWN_KEY]
    = function() { return skipEffects(1); };
    keyCodeDict[SLIDE_MODE][PAGE_UP_KEY]
    = function() { return aSlideShow.rewindAllEffects(); };
    keyCodeDict[SLIDE_MODE][PAGE_DOWN_KEY]
    = function() { return skipAllEffects(); };
    keyCodeDict[SLIDE_MODE][HOME_KEY]
    = function() { return aSlideShow.displaySlide( 0, true ); };
    keyCodeDict[SLIDE_MODE][END_KEY]
    = function() { return aSlideShow.displaySlide( theMetaDoc.nNumberOfSlides - 1, true ); };
    keyCodeDict[SLIDE_MODE][SPACE_KEY]
    = function() { return dispatchEffects(1); };
    keyCodeDict[SLIDE_MODE][ESCAPE_KEY]
    = function() { return aSlideShow.exitSlideShowInApp(); };
    keyCodeDict[SLIDE_MODE][Q_KEY]
    = function() { return aSlideShow.exitSlideShowInApp(); };
    
    keyCodeDict[INDEX_MODE][LEFT_KEY]
    = function() { return indexSetPageSlide( theSlideIndexPage.selectedSlideIndex - 1 ); };
    keyCodeDict[INDEX_MODE][RIGHT_KEY]
    = function() { return indexSetPageSlide( theSlideIndexPage.selectedSlideIndex + 1 ); };
    keyCodeDict[INDEX_MODE][UP_KEY]
    = function() { return indexSetPageSlide( theSlideIndexPage.selectedSlideIndex - theSlideIndexPage.indexColumns ); };
    keyCodeDict[INDEX_MODE][DOWN_KEY]
    = function() { return indexSetPageSlide( theSlideIndexPage.selectedSlideIndex + theSlideIndexPage.indexColumns ); };
    keyCodeDict[INDEX_MODE][PAGE_UP_KEY]
    = function() { return indexSetPageSlide( theSlideIndexPage.selectedSlideIndex - theSlideIndexPage.getTotalThumbnails() ); };
    keyCodeDict[INDEX_MODE][PAGE_DOWN_KEY]
    = function() { return indexSetPageSlide( theSlideIndexPage.selectedSlideIndex + theSlideIndexPage.getTotalThumbnails() ); };
    keyCodeDict[INDEX_MODE][HOME_KEY]
    = function() { return indexSetPageSlide( 0 ); };
    keyCodeDict[INDEX_MODE][END_KEY]
    = function() { return indexSetPageSlide( theMetaDoc.nNumberOfSlides - 1 ); };
    keyCodeDict[INDEX_MODE][ENTER_KEY]
    = function() { return toggleSlideIndex(); };
    keyCodeDict[INDEX_MODE][SPACE_KEY]
    = function() { return toggleSlideIndex(); };
    keyCodeDict[INDEX_MODE][ESCAPE_KEY]
    = function() { return abandonIndexMode(); };
    
    return keyCodeDict;
    }
    
    function getDefaultCharCodeDictionary()
    {
    var charCodeDict = {};
    
    charCodeDict[SLIDE_MODE] = {};
    charCodeDict[INDEX_MODE] = {};
    
    charCodeDict[SLIDE_MODE]['i']
    = function () { return toggleSlideIndex(); };
    
    charCodeDict[INDEX_MODE]['i']
    = function () { return toggleSlideIndex(); };
    charCodeDict[INDEX_MODE]['-']
    = function () { return theSlideIndexPage.decreaseNumberOfColumns(); };
    charCodeDict[INDEX_MODE]['=']
    = function () { return theSlideIndexPage.increaseNumberOfColumns(); };
    charCodeDict[INDEX_MODE]['+']
    = function () { return theSlideIndexPage.increaseNumberOfColumns(); };
    charCodeDict[INDEX_MODE]['0']
    = function () { return theSlideIndexPage.resetNumberOfColumns(); };
    
    return charCodeDict;
    }
    
    
    function slideOnMouseUp( aEvt )
    {
    if (!aEvt)
    aEvt = window.event;
    
    var nOffset = 0;
    
    if( aEvt.button == 0 )
    nOffset = 1;
    else if( aEvt.button == 2 )
    nOffset = -1;
    
    if( 0 != nOffset )
    dispatchEffects( nOffset );
    return true; // the click has been handled
    }
    
    document.handleClick = slideOnMouseUp;
    
    
    function slideOnMouseWheel(aEvt)
    {
    var delta = 0;
    
    if (!aEvt)
    aEvt = window.event;
    
    if (aEvt.wheelDelta)
    { // IE Opera
    delta = aEvt.wheelDelta/120;
    }
    else if (aEvt.detail)
    { // MOZ
    delta = -aEvt.detail/3;
    }
    
    if (delta > 0)
    skipEffects(-1);
    else if (delta < 0)
    skipEffects(1);
    
    if (aEvt.preventDefault)
    aEvt.preventDefault();
    
    aEvt.returnValue = false;
    }
    
    if( window.addEventListener )
    {
    window.addEventListener( 'DOMMouseScroll', function( aEvt ) { return mouseHandlerDispatch( aEvt, MOUSE_WHEEL ); }, false );
    }
    
    window.onmousewheel
    = function( aEvt ) { return mouseHandlerDispatch( aEvt, MOUSE_WHEEL ); };
    
    function mouseHandlerDispatch( aEvt, anAction )
    {
    if( !aEvt )
    aEvt = window.event;
    
    var retVal = true;
    
    if ( mouseHandlerDictionary[currentMode] && mouseHandlerDictionary[currentMode][anAction] )
    {
    var subRetVal = mouseHandlerDictionary[currentMode][anAction]( aEvt );
    
    if( subRetVal != null && subRetVal != undefined )
    retVal = subRetVal;
    }
    
    if( aEvt.preventDefault && !retVal )
    aEvt.preventDefault();
    
    aEvt.returnValue = retVal;
    
    return retVal;
    }
    
    document.onmouseup = function( aEvt ) { return mouseHandlerDispatch( aEvt, MOUSE_UP ); };
    
    
    function mouseClickHelper( aEvt )
    {
    if( !Detect.isMozilla )
    {
    var aWindowObject = document.defaultView;
    if( aWindowObject )
    {
    var aTextSelection = aWindowObject.getSelection();
    var sSelectedText =  aTextSelection.toString();
    if( sSelectedText )
    {
    DBGLOG( 'text selection: ' + sSelectedText );
    if( sLastSelectedText !== sSelectedText )
    {
    bTextHasBeenSelected = true;
    sLastSelectedText = sSelectedText;
    }
    else
    {
    bTextHasBeenSelected = false;
    }
    return null;
    }
    else if( bTextHasBeenSelected )
    {
    bTextHasBeenSelected = false;
    sLastSelectedText = '';
    return null;
    }
    }
    else
    {
    log( 'error: HyperlinkElement.handleClick: invalid window object.' );
    }
    }
    
    var aSlideAnimationsHandler = theMetaDoc.aMetaSlideSet[nCurSlide].aSlideAnimationsHandler;
    if( aSlideAnimationsHandler )
    {
    var aCurrentEventMultiplexer = aSlideAnimationsHandler.aEventMultiplexer;
    if( aCurrentEventMultiplexer )
    {
    if( aCurrentEventMultiplexer.hasRegisteredMouseClickHandlers() )
    {
    return aCurrentEventMultiplexer.notifyMouseClick( aEvt );
    }
    }
    }
    return slideOnMouseUp( aEvt );
    }
    
    
    function getDefaultMouseHandlerDictionary()
    {
    var mouseHandlerDict = {};
    
    mouseHandlerDict[SLIDE_MODE] = {};
    mouseHandlerDict[INDEX_MODE] = {};
    
    mouseHandlerDict[SLIDE_MODE][MOUSE_UP]
    = mouseClickHelper;
    
    mouseHandlerDict[SLIDE_MODE][MOUSE_WHEEL]
    = function( aEvt ) { return slideOnMouseWheel( aEvt ); };
    
    mouseHandlerDict[INDEX_MODE][MOUSE_UP]
    = function( ) { return toggleSlideIndex(); };
    
    return mouseHandlerDict;
    }
    
    function indexSetPageSlide( nIndex )
    {
    var aMetaSlideSet = theMetaDoc.aMetaSlideSet;
    nIndex = getSafeIndex( nIndex, 0, aMetaSlideSet.length - 1 );
    
    var nSelectedThumbnailIndex = nIndex % theSlideIndexPage.getTotalThumbnails();
    var offset = nIndex - nSelectedThumbnailIndex;
    
    if( offset < 0 )
    offset = 0;
    
    if( offset != INDEX_OFFSET )
    {
    INDEX_OFFSET = offset;
    displayIndex( INDEX_OFFSET );
    }
    
    theSlideIndexPage.setSelection( nSelectedThumbnailIndex );
    }
    
    
    /*****
    * @jessyinkend
    *
    *  The above code is a derivative work of some parts of the JessyInk project.
    *  @source http://code.google.com/p/jessyink/
    */
    
    
    /*****
    * @licstart
    *
    * The following is the license notice for the part of JavaScript code of this
    * page included between the '@dojostart' and the '@dojoend' notes.
    */
    
    /*****  **********************************************************************
    *
    *  The 'New' BSD License:
    *  **********************
    *  Copyright (c) 2005-2012, The Dojo Foundation
    *  All rights reserved.
    *
    *  Redistribution and use in source and binary forms, with or without
    *  modification, are permitted provided that the following conditions are met:
    *
    *    * Redistributions of source code must retain the above copyright notice,
    *      this list of conditions and the following disclaimer.
    *    * Redistributions in binary form must reproduce the above copyright notice,
    *      this list of conditions and the following disclaimer in the documentation
    *      and/or other materials provided with the distribution.
    *    * Neither the name of the Dojo Foundation nor the names of its contributors
    *      may be used to endorse or promote products derived from this software
    *      without specific prior written permission.
    *
    *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS 'AS IS' AND
    *  ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
    *  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
    *  DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
    *  FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
    *  DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
    *  SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
    *  CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
    *  OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
    *  OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
    *
    ****************************************************************************/
    
    
    /*****
    * @licend
    *
    * The above is the license notice for the part of JavaScript code of this
    * page included between the '@dojostart' and the '@dojoend' notes.
    */
    
    
    /*****
    * @dojostart
    *
    *  The following code is a derivative work of some part of the dojox.gfx library.
    *  @source http://svn.dojotoolkit.org/src/dojox/trunk/_base/sniff.js
    */
    
    function has( name )
    {
    return has.cache[name];
    }
    
    has.cache = {};
    
    has.add = function( name, test )
    {
    has.cache[name] = test;
    };
    
    function configureDetectionTools()
    {
    if( !navigator )
    {
    log( 'error: configureDetectionTools: configuration failed' );
    return null;
    }
    
    var n = navigator,
    dua = n.userAgent,
    dav = n.appVersion,
    tv = parseFloat(dav);
    
    has.add('air', dua.indexOf('AdobeAIR') >= 0);
    has.add('khtml', dav.indexOf('Konqueror') >= 0 ? tv : undefined);
    has.add('webkit', parseFloat(dua.split('WebKit/')[1]) || undefined);
    has.add('chrome', parseFloat(dua.split('Chrome/')[1]) || undefined);
    has.add('safari', dav.indexOf('Safari')>=0 && !has('chrome') ? parseFloat(dav.split('Version/')[1]) : undefined);
    has.add('mac', dav.indexOf('Macintosh') >= 0);
    has.add('quirks', document.compatMode == 'BackCompat');
    has.add('ios', /iPhone|iPod|iPad/.test(dua));
    has.add('android', parseFloat(dua.split('Android ')[1]) || undefined);
    
    if(!has('webkit')){
    if(dua.indexOf('Opera') >= 0){
    has.add('opera', tv >= 9.8 ? parseFloat(dua.split('Version/')[1]) || tv : tv);
    }
    
    if(dua.indexOf('Gecko') >= 0 && !has('khtml') && !has('webkit')){
    has.add('mozilla', tv);
    }
    if(has('mozilla')){
    has.add('ff', parseFloat(dua.split('Firefox/')[1] || dua.split('Minefield/')[1]) || undefined);
    }
    
    if(document.all && !has('opera')){
    var isIE = parseFloat(dav.split('MSIE ')[1]) || undefined;
    
    var mode = document.documentMode;
    if(mode && mode != 5 && Math.floor(isIE) != mode){
    isIE = mode;
    }
    
    has.add('ie', isIE);
    }
    
    has.add('wii', typeof opera != 'undefined' && opera.wiiremote);
    }
    
    var detect =
    {
    isFF: has('ff'),
    
    isIE: has('ie'),
    
    isKhtml: has('khtml'),
    
    isWebKit: has('webkit'),
    
    isMozilla: has('mozilla'),
    isMoz: has('mozilla'),
    
    isOpera: has('opera'),
    
    isSafari: has('safari'),
    
    isChrome: has('chrome'),
    
    isMac: has('mac'),
    
    isIos: has('ios'),
    
    isAndroid: has('android'),
    
    isWii: has('wii'),
    
    isQuirks: has('quirks'),
    
    isAir: has('air')
    };
    return detect;
    }
    
    /*****
    * @dojoend
    *
    *  The above code is a derivative work of some part of the dojox.gfx library.
    *  @source http://svn.dojotoolkit.org/src/dojox/trunk/_base/sniff.js
    */
    
    /*****
    * @licstart
    *
    * The following is the license notice for the part of JavaScript code of this
    * file included between the '@svgpathstart' and the '@svgpathend' notes.
    */
    
    /*****  **********************************************************************
    *
    *   Copyright 2015 The Chromium Authors. All rights reserved.
    *
    *   The Chromium Authors can be found at
    *   http://src.chromium.org/svn/trunk/src/AUTHORS
    *
    *   Redistribution and use in source and binary forms, with or without
    *   modification, are permitted provided that the following conditions are
    *   met:
    *
    *   * Redistributions of source code must retain the above copyright
    *   notice, this list of conditions and the following disclaimer.
    *   * Redistributions in binary form must reproduce the above
    *   copyright notice, this list of conditions and the following disclaimer
    *   in the documentation and/or other materials provided with the
    *   distribution.
    *   * Neither the name of Google Inc. nor the names of its
    *   contributors may be used to endorse or promote products derived from
    *   this software without specific prior written permission.
    *
    *   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
    *   'AS IS' AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
    *   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
    *   A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
    *   OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
    *   SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
    *   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
    *   DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
    *   THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
    *   (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
    *   OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
    *
    ****************************************************************************/
    
    /*****
    * @licend
    *
    * The above is the license notice for the part of JavaScript code of this
    * file included between the '@svgpathstart' and the '@svgpathend' notes.
    */
    
    
    /*****
    * @svgpathstart
    *
    *  The following code is a derivative work of some part of the SVGPathSeg API.
    *
    *  This API is a drop-in replacement for the SVGPathSeg and SVGPathSegList APIs that were removed from
    *  SVG2 (https://lists.w3.org/Archives/Public/www-svg/2015Jun/0044.html), including the latest spec
    *  changes which were implemented in Firefox 43 and Chrome 46.
    *
    *  @source https://github.com/progers/pathseg
    */
    
    (function() { 'use strict';
    if (!('SVGPathSeg' in window)) {
    window.SVGPathSeg = function(type, typeAsLetter, owningPathSegList) {
    this.pathSegType = type;
    this.pathSegTypeAsLetter = typeAsLetter;
    this._owningPathSegList = owningPathSegList;
    }
    
    window.SVGPathSeg.prototype.classname = 'SVGPathSeg';
    
    window.SVGPathSeg.PATHSEG_UNKNOWN = 0;
    window.SVGPathSeg.PATHSEG_CLOSEPATH = 1;
    window.SVGPathSeg.PATHSEG_MOVETO_ABS = 2;
    window.SVGPathSeg.PATHSEG_MOVETO_REL = 3;
    window.SVGPathSeg.PATHSEG_LINETO_ABS = 4;
    window.SVGPathSeg.PATHSEG_LINETO_REL = 5;
    window.SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS = 6;
    window.SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL = 7;
    window.SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS = 8;
    window.SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL = 9;
    window.SVGPathSeg.PATHSEG_ARC_ABS = 10;
    window.SVGPathSeg.PATHSEG_ARC_REL = 11;
    window.SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_ABS = 12;
    window.SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_REL = 13;
    window.SVGPathSeg.PATHSEG_LINETO_VERTICAL_ABS = 14;
    window.SVGPathSeg.PATHSEG_LINETO_VERTICAL_REL = 15;
    window.SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS = 16;
    window.SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL = 17;
    window.SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_ABS = 18;
    window.SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_REL = 19;
    
    window.SVGPathSeg.prototype._segmentChanged = function() {
    if (this._owningPathSegList)
    this._owningPathSegList.segmentChanged(this);
    }
    
    window.SVGPathSegClosePath = function(owningPathSegList) {
    window.SVGPathSeg.call(this, window.SVGPathSeg.PATHSEG_CLOSEPATH, 'z', owningPathSegList);
    }
    window.SVGPathSegClosePath.prototype = Object.create(window.SVGPathSeg.prototype);
    window.SVGPathSegClosePath.prototype.toString = function() { return '[object SVGPathSegClosePath]'; }
    window.SVGPathSegClosePath.prototype._asPathString = function() { return this.pathSegTypeAsLetter; }
    window.SVGPathSegClosePath.prototype.clone = function() { return new window.SVGPathSegClosePath(undefined); }
    
    window.SVGPathSegMovetoAbs = function(owningPathSegList, x, y) {
    window.SVGPathSeg.call(this, window.SVGPathSeg.PATHSEG_MOVETO_ABS, 'M', owningPathSegList);
    this._x = x;
    this._y = y;
    }
    window.SVGPathSegMovetoAbs.prototype = Object.create(window.SVGPathSeg.prototype);
    window.SVGPathSegMovetoAbs.prototype.toString = function() { return '[object SVGPathSegMovetoAbs]'; }
    window.SVGPathSegMovetoAbs.prototype._asPathString = function() { return this.pathSegTypeAsLetter + ' ' + this._x + ' ' + this._y; }
    window.SVGPathSegMovetoAbs.prototype.clone = function() { return new window.SVGPathSegMovetoAbs(undefined, this._x, this._y); }
    Object.defineProperty(window.SVGPathSegMovetoAbs.prototype, 'x', { get: function() { return this._x; }, set: function(x) { this._x = x; this._segmentChanged(); }, enumerable: true });
    Object.defineProperty(window.SVGPathSegMovetoAbs.prototype, 'y', { get: function() { return this._y; }, set: function(y) { this._y = y; this._segmentChanged(); }, enumerable: true });
    
    window.SVGPathSegMovetoRel = function(owningPathSegList, x, y) {
    window.SVGPathSeg.call(this, window.SVGPathSeg.PATHSEG_MOVETO_REL, 'm', owningPathSegList);
    this._x = x;
    this._y = y;
    }
    window.SVGPathSegMovetoRel.prototype = Object.create(window.SVGPathSeg.prototype);
    window.SVGPathSegMovetoRel.prototype.toString = function() { return '[object SVGPathSegMovetoRel]'; }
    window.SVGPathSegMovetoRel.prototype._asPathString = function() { return this.pathSegTypeAsLetter + ' ' + this._x + ' ' + this._y; }
    window.SVGPathSegMovetoRel.prototype.clone = function() { return new window.SVGPathSegMovetoRel(undefined, this._x, this._y); }
    Object.defineProperty(window.SVGPathSegMovetoRel.prototype, 'x', { get: function() { return this._x; }, set: function(x) { this._x = x; this._segmentChanged(); }, enumerable: true });
    Object.defineProperty(window.SVGPathSegMovetoRel.prototype, 'y', { get: function() { return this._y; }, set: function(y) { this._y = y; this._segmentChanged(); }, enumerable: true });
    
    window.SVGPathSegLinetoAbs = function(owningPathSegList, x, y) {
    window.SVGPathSeg.call(this, window.SVGPathSeg.PATHSEG_LINETO_ABS, 'L', owningPathSegList);
    this._x = x;
    this._y = y;
    }
    window.SVGPathSegLinetoAbs.prototype = Object.create(window.SVGPathSeg.prototype);
    window.SVGPathSegLinetoAbs.prototype.toString = function() { return '[object SVGPathSegLinetoAbs]'; }
    window.SVGPathSegLinetoAbs.prototype._asPathString = function() { return this.pathSegTypeAsLetter + ' ' + this._x + ' ' + this._y; }
    window.SVGPathSegLinetoAbs.prototype.clone = function() { return new window.SVGPathSegLinetoAbs(undefined, this._x, this._y); }
    Object.defineProperty(window.SVGPathSegLinetoAbs.prototype, 'x', { get: function() { return this._x; }, set: function(x) { this._x = x; this._segmentChanged(); }, enumerable: true });
    Object.defineProperty(window.SVGPathSegLinetoAbs.prototype, 'y', { get: function() { return this._y; }, set: function(y) { this._y = y; this._segmentChanged(); }, enumerable: true });
    
    window.SVGPathSegLinetoRel = function(owningPathSegList, x, y) {
    window.SVGPathSeg.call(this, window.SVGPathSeg.PATHSEG_LINETO_REL, 'l', owningPathSegList);
    this._x = x;
    this._y = y;
    }
    window.SVGPathSegLinetoRel.prototype = Object.create(window.SVGPathSeg.prototype);
    window.SVGPathSegLinetoRel.prototype.toString = function() { return '[object SVGPathSegLinetoRel]'; }
    window.SVGPathSegLinetoRel.prototype._asPathString = function() { return this.pathSegTypeAsLetter + ' ' + this._x + ' ' + this._y; }
    window.SVGPathSegLinetoRel.prototype.clone = function() { return new window.SVGPathSegLinetoRel(undefined, this._x, this._y); }
    Object.defineProperty(window.SVGPathSegLinetoRel.prototype, 'x', { get: function() { return this._x; }, set: function(x) { this._x = x; this._segmentChanged(); }, enumerable: true });
    Object.defineProperty(window.SVGPathSegLinetoRel.prototype, 'y', { get: function() { return this._y; }, set: function(y) { this._y = y; this._segmentChanged(); }, enumerable: true });
    
    window.SVGPathSegCurvetoCubicAbs = function(owningPathSegList, x, y, x1, y1, x2, y2) {
    window.SVGPathSeg.call(this, window.SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS, 'C', owningPathSegList);
    this._x = x;
    this._y = y;
    this._x1 = x1;
    this._y1 = y1;
    this._x2 = x2;
    this._y2 = y2;
    }
    window.SVGPathSegCurvetoCubicAbs.prototype = Object.create(window.SVGPathSeg.prototype);
    window.SVGPathSegCurvetoCubicAbs.prototype.toString = function() { return '[object SVGPathSegCurvetoCubicAbs]'; }
    window.SVGPathSegCurvetoCubicAbs.prototype._asPathString = function() { return this.pathSegTypeAsLetter + ' ' + this._x1 + ' ' + this._y1 + ' ' + this._x2 + ' ' + this._y2 + ' ' + this._x + ' ' + this._y; }
    window.SVGPathSegCurvetoCubicAbs.prototype.clone = function() { return new window.SVGPathSegCurvetoCubicAbs(undefined, this._x, this._y, this._x1, this._y1, this._x2, this._y2); }
    Object.defineProperty(window.SVGPathSegCurvetoCubicAbs.prototype, 'x', { get: function() { return this._x; }, set: function(x) { this._x = x; this._segmentChanged(); }, enumerable: true });
    Object.defineProperty(window.SVGPathSegCurvetoCubicAbs.prototype, 'y', { get: function() { return this._y; }, set: function(y) { this._y = y; this._segmentChanged(); }, enumerable: true });
    Object.defineProperty(window.SVGPathSegCurvetoCubicAbs.prototype, 'x1', { get: function() { return this._x1; }, set: function(x1) { this._x1 = x1; this._segmentChanged(); }, enumerable: true });
    Object.defineProperty(window.SVGPathSegCurvetoCubicAbs.prototype, 'y1', { get: function() { return this._y1; }, set: function(y1) { this._y1 = y1; this._segmentChanged(); }, enumerable: true });
    Object.defineProperty(window.SVGPathSegCurvetoCubicAbs.prototype, 'x2', { get: function() { return this._x2; }, set: function(x2) { this._x2 = x2; this._segmentChanged(); }, enumerable: true });
    Object.defineProperty(window.SVGPathSegCurvetoCubicAbs.prototype, 'y2', { get: function() { return this._y2; }, set: function(y2) { this._y2 = y2; this._segmentChanged(); }, enumerable: true });
    
    window.SVGPathSegCurvetoCubicRel = function(owningPathSegList, x, y, x1, y1, x2, y2) {
    window.SVGPathSeg.call(this, window.SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL, 'c', owningPathSegList);
    this._x = x;
    this._y = y;
    this._x1 = x1;
    this._y1 = y1;
    this._x2 = x2;
    this._y2 = y2;
    }
    window.SVGPathSegCurvetoCubicRel.prototype = Object.create(window.SVGPathSeg.prototype);
    window.SVGPathSegCurvetoCubicRel.prototype.toString = function() { return '[object SVGPathSegCurvetoCubicRel]'; }
    window.SVGPathSegCurvetoCubicRel.prototype._asPathString = function() { return this.pathSegTypeAsLetter + ' ' + this._x1 + ' ' + this._y1 + ' ' + this._x2 + ' ' + this._y2 + ' ' + this._x + ' ' + this._y; }
    window.SVGPathSegCurvetoCubicRel.prototype.clone = function() { return new window.SVGPathSegCurvetoCubicRel(undefined, this._x, this._y, this._x1, this._y1, this._x2, this._y2); }
    Object.defineProperty(window.SVGPathSegCurvetoCubicRel.prototype, 'x', { get: function() { return this._x; }, set: function(x) { this._x = x; this._segmentChanged(); }, enumerable: true });
    Object.defineProperty(window.SVGPathSegCurvetoCubicRel.prototype, 'y', { get: function() { return this._y; }, set: function(y) { this._y = y; this._segmentChanged(); }, enumerable: true });
    Object.defineProperty(window.SVGPathSegCurvetoCubicRel.prototype, 'x1', { get: function() { return this._x1; }, set: function(x1) { this._x1 = x1; this._segmentChanged(); }, enumerable: true });
    Object.defineProperty(window.SVGPathSegCurvetoCubicRel.prototype, 'y1', { get: function() { return this._y1; }, set: function(y1) { this._y1 = y1; this._segmentChanged(); }, enumerable: true });
    Object.defineProperty(window.SVGPathSegCurvetoCubicRel.prototype, 'x2', { get: function() { return this._x2; }, set: function(x2) { this._x2 = x2; this._segmentChanged(); }, enumerable: true });
    Object.defineProperty(window.SVGPathSegCurvetoCubicRel.prototype, 'y2', { get: function() { return this._y2; }, set: function(y2) { this._y2 = y2; this._segmentChanged(); }, enumerable: true });
    
    window.SVGPathSegCurvetoQuadraticAbs = function(owningPathSegList, x, y, x1, y1) {
    window.SVGPathSeg.call(this, window.SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS, 'Q', owningPathSegList);
    this._x = x;
    this._y = y;
    this._x1 = x1;
    this._y1 = y1;
    }
    window.SVGPathSegCurvetoQuadraticAbs.prototype = Object.create(window.SVGPathSeg.prototype);
    window.SVGPathSegCurvetoQuadraticAbs.prototype.toString = function() { return '[object SVGPathSegCurvetoQuadraticAbs]'; }
    window.SVGPathSegCurvetoQuadraticAbs.prototype._asPathString = function() { return this.pathSegTypeAsLetter + ' ' + this._x1 + ' ' + this._y1 + ' ' + this._x + ' ' + this._y; }
    window.SVGPathSegCurvetoQuadraticAbs.prototype.clone = function() { return new window.SVGPathSegCurvetoQuadraticAbs(undefined, this._x, this._y, this._x1, this._y1); }
    Object.defineProperty(window.SVGPathSegCurvetoQuadraticAbs.prototype, 'x', { get: function() { return this._x; }, set: function(x) { this._x = x; this._segmentChanged(); }, enumerable: true });
    Object.defineProperty(window.SVGPathSegCurvetoQuadraticAbs.prototype, 'y', { get: function() { return this._y; }, set: function(y) { this._y = y; this._segmentChanged(); }, enumerable: true });
    Object.defineProperty(window.SVGPathSegCurvetoQuadraticAbs.prototype, 'x1', { get: function() { return this._x1; }, set: function(x1) { this._x1 = x1; this._segmentChanged(); }, enumerable: true });
    Object.defineProperty(window.SVGPathSegCurvetoQuadraticAbs.prototype, 'y1', { get: function() { return this._y1; }, set: function(y1) { this._y1 = y1; this._segmentChanged(); }, enumerable: true });
    
    window.SVGPathSegCurvetoQuadraticRel = function(owningPathSegList, x, y, x1, y1) {
    window.SVGPathSeg.call(this, window.SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL, 'q', owningPathSegList);
    this._x = x;
    this._y = y;
    this._x1 = x1;
    this._y1 = y1;
    }
    window.SVGPathSegCurvetoQuadraticRel.prototype = Object.create(window.SVGPathSeg.prototype);
    window.SVGPathSegCurvetoQuadraticRel.prototype.toString = function() { return '[object SVGPathSegCurvetoQuadraticRel]'; }
    window.SVGPathSegCurvetoQuadraticRel.prototype._asPathString = function() { return this.pathSegTypeAsLetter + ' ' + this._x1 + ' ' + this._y1 + ' ' + this._x + ' ' + this._y; }
    window.SVGPathSegCurvetoQuadraticRel.prototype.clone = function() { return new window.SVGPathSegCurvetoQuadraticRel(undefined, this._x, this._y, this._x1, this._y1); }
    Object.defineProperty(window.SVGPathSegCurvetoQuadraticRel.prototype, 'x', { get: function() { return this._x; }, set: function(x) { this._x = x; this._segmentChanged(); }, enumerable: true });
    Object.defineProperty(window.SVGPathSegCurvetoQuadraticRel.prototype, 'y', { get: function() { return this._y; }, set: function(y) { this._y = y; this._segmentChanged(); }, enumerable: true });
    Object.defineProperty(window.SVGPathSegCurvetoQuadraticRel.prototype, 'x1', { get: function() { return this._x1; }, set: function(x1) { this._x1 = x1; this._segmentChanged(); }, enumerable: true });
    Object.defineProperty(window.SVGPathSegCurvetoQuadraticRel.prototype, 'y1', { get: function() { return this._y1; }, set: function(y1) { this._y1 = y1; this._segmentChanged(); }, enumerable: true });
    
    window.SVGPathSegArcAbs = function(owningPathSegList, x, y, r1, r2, angle, largeArcFlag, sweepFlag) {
    window.SVGPathSeg.call(this, window.SVGPathSeg.PATHSEG_ARC_ABS, 'A', owningPathSegList);
    this._x = x;
    this._y = y;
    this._r1 = r1;
    this._r2 = r2;
    this._angle = angle;
    this._largeArcFlag = largeArcFlag;
    this._sweepFlag = sweepFlag;
    }
    window.SVGPathSegArcAbs.prototype = Object.create(window.SVGPathSeg.prototype);
    window.SVGPathSegArcAbs.prototype.toString = function() { return '[object SVGPathSegArcAbs]'; }
    window.SVGPathSegArcAbs.prototype._asPathString = function() { return this.pathSegTypeAsLetter + ' ' + this._r1 + ' ' + this._r2 + ' ' + this._angle + ' ' + (this._largeArcFlag ? '1' : '0') + ' ' + (this._sweepFlag ? '1' : '0') + ' ' + this._x + ' ' + this._y; }
    window.SVGPathSegArcAbs.prototype.clone = function() { return new window.SVGPathSegArcAbs(undefined, this._x, this._y, this._r1, this._r2, this._angle, this._largeArcFlag, this._sweepFlag); }
    Object.defineProperty(window.SVGPathSegArcAbs.prototype, 'x', { get: function() { return this._x; }, set: function(x) { this._x = x; this._segmentChanged(); }, enumerable: true });
    Object.defineProperty(window.SVGPathSegArcAbs.prototype, 'y', { get: function() { return this._y; }, set: function(y) { this._y = y; this._segmentChanged(); }, enumerable: true });
    Object.defineProperty(window.SVGPathSegArcAbs.prototype, 'r1', { get: function() { return this._r1; }, set: function(r1) { this._r1 = r1; this._segmentChanged(); }, enumerable: true });
    Object.defineProperty(window.SVGPathSegArcAbs.prototype, 'r2', { get: function() { return this._r2; }, set: function(r2) { this._r2 = r2; this._segmentChanged(); }, enumerable: true });
    Object.defineProperty(window.SVGPathSegArcAbs.prototype, 'angle', { get: function() { return this._angle; }, set: function(angle) { this._angle = angle; this._segmentChanged(); }, enumerable: true });
    Object.defineProperty(window.SVGPathSegArcAbs.prototype, 'largeArcFlag', { get: function() { return this._largeArcFlag; }, set: function(largeArcFlag) { this._largeArcFlag = largeArcFlag; this._segmentChanged(); }, enumerable: true });
    Object.defineProperty(window.SVGPathSegArcAbs.prototype, 'sweepFlag', { get: function() { return this._sweepFlag; }, set: function(sweepFlag) { this._sweepFlag = sweepFlag; this._segmentChanged(); }, enumerable: true });
    
    window.SVGPathSegArcRel = function(owningPathSegList, x, y, r1, r2, angle, largeArcFlag, sweepFlag) {
    window.SVGPathSeg.call(this, window.SVGPathSeg.PATHSEG_ARC_REL, 'a', owningPathSegList);
    this._x = x;
    this._y = y;
    this._r1 = r1;
    this._r2 = r2;
    this._angle = angle;
    this._largeArcFlag = largeArcFlag;
    this._sweepFlag = sweepFlag;
    }
    window.SVGPathSegArcRel.prototype = Object.create(window.SVGPathSeg.prototype);
    window.SVGPathSegArcRel.prototype.toString = function() { return '[object SVGPathSegArcRel]'; }
    window.SVGPathSegArcRel.prototype._asPathString = function() { return this.pathSegTypeAsLetter + ' ' + this._r1 + ' ' + this._r2 + ' ' + this._angle + ' ' + (this._largeArcFlag ? '1' : '0') + ' ' + (this._sweepFlag ? '1' : '0') + ' ' + this._x + ' ' + this._y; }
    window.SVGPathSegArcRel.prototype.clone = function() { return new window.SVGPathSegArcRel(undefined, this._x, this._y, this._r1, this._r2, this._angle, this._largeArcFlag, this._sweepFlag); }
    Object.defineProperty(window.SVGPathSegArcRel.prototype, 'x', { get: function() { return this._x; }, set: function(x) { this._x = x; this._segmentChanged(); }, enumerable: true });
    Object.defineProperty(window.SVGPathSegArcRel.prototype, 'y', { get: function() { return this._y; }, set: function(y) { this._y = y; this._segmentChanged(); }, enumerable: true });
    Object.defineProperty(window.SVGPathSegArcRel.prototype, 'r1', { get: function() { return this._r1; }, set: function(r1) { this._r1 = r1; this._segmentChanged(); }, enumerable: true });
    Object.defineProperty(window.SVGPathSegArcRel.prototype, 'r2', { get: function() { return this._r2; }, set: function(r2) { this._r2 = r2; this._segmentChanged(); }, enumerable: true });
    Object.defineProperty(window.SVGPathSegArcRel.prototype, 'angle', { get: function() { return this._angle; }, set: function(angle) { this._angle = angle; this._segmentChanged(); }, enumerable: true });
    Object.defineProperty(window.SVGPathSegArcRel.prototype, 'largeArcFlag', { get: function() { return this._largeArcFlag; }, set: function(largeArcFlag) { this._largeArcFlag = largeArcFlag; this._segmentChanged(); }, enumerable: true });
    Object.defineProperty(window.SVGPathSegArcRel.prototype, 'sweepFlag', { get: function() { return this._sweepFlag; }, set: function(sweepFlag) { this._sweepFlag = sweepFlag; this._segmentChanged(); }, enumerable: true });
    
    window.SVGPathSegLinetoHorizontalAbs = function(owningPathSegList, x) {
    window.SVGPathSeg.call(this, window.SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_ABS, 'H', owningPathSegList);
    this._x = x;
    }
    window.SVGPathSegLinetoHorizontalAbs.prototype = Object.create(window.SVGPathSeg.prototype);
    window.SVGPathSegLinetoHorizontalAbs.prototype.toString = function() { return '[object SVGPathSegLinetoHorizontalAbs]'; }
    window.SVGPathSegLinetoHorizontalAbs.prototype._asPathString = function() { return this.pathSegTypeAsLetter + ' ' + this._x; }
    window.SVGPathSegLinetoHorizontalAbs.prototype.clone = function() { return new window.SVGPathSegLinetoHorizontalAbs(undefined, this._x); }
    Object.defineProperty(window.SVGPathSegLinetoHorizontalAbs.prototype, 'x', { get: function() { return this._x; }, set: function(x) { this._x = x; this._segmentChanged(); }, enumerable: true });
    
    window.SVGPathSegLinetoHorizontalRel = function(owningPathSegList, x) {
    window.SVGPathSeg.call(this, window.SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_REL, 'h', owningPathSegList);
    this._x = x;
    }
    window.SVGPathSegLinetoHorizontalRel.prototype = Object.create(window.SVGPathSeg.prototype);
    window.SVGPathSegLinetoHorizontalRel.prototype.toString = function() { return '[object SVGPathSegLinetoHorizontalRel]'; }
    window.SVGPathSegLinetoHorizontalRel.prototype._asPathString = function() { return this.pathSegTypeAsLetter + ' ' + this._x; }
    window.SVGPathSegLinetoHorizontalRel.prototype.clone = function() { return new window.SVGPathSegLinetoHorizontalRel(undefined, this._x); }
    Object.defineProperty(window.SVGPathSegLinetoHorizontalRel.prototype, 'x', { get: function() { return this._x; }, set: function(x) { this._x = x; this._segmentChanged(); }, enumerable: true });
    
    window.SVGPathSegLinetoVerticalAbs = function(owningPathSegList, y) {
    window.SVGPathSeg.call(this, window.SVGPathSeg.PATHSEG_LINETO_VERTICAL_ABS, 'V', owningPathSegList);
    this._y = y;
    }
    window.SVGPathSegLinetoVerticalAbs.prototype = Object.create(window.SVGPathSeg.prototype);
    window.SVGPathSegLinetoVerticalAbs.prototype.toString = function() { return '[object SVGPathSegLinetoVerticalAbs]'; }
    window.SVGPathSegLinetoVerticalAbs.prototype._asPathString = function() { return this.pathSegTypeAsLetter + ' ' + this._y; }
    window.SVGPathSegLinetoVerticalAbs.prototype.clone = function() { return new window.SVGPathSegLinetoVerticalAbs(undefined, this._y); }
    Object.defineProperty(window.SVGPathSegLinetoVerticalAbs.prototype, 'y', { get: function() { return this._y; }, set: function(y) { this._y = y; this._segmentChanged(); }, enumerable: true });
    
    window.SVGPathSegLinetoVerticalRel = function(owningPathSegList, y) {
    window.SVGPathSeg.call(this, window.SVGPathSeg.PATHSEG_LINETO_VERTICAL_REL, 'v', owningPathSegList);
    this._y = y;
    }
    window.SVGPathSegLinetoVerticalRel.prototype = Object.create(window.SVGPathSeg.prototype);
    window.SVGPathSegLinetoVerticalRel.prototype.toString = function() { return '[object SVGPathSegLinetoVerticalRel]'; }
    window.SVGPathSegLinetoVerticalRel.prototype._asPathString = function() { return this.pathSegTypeAsLetter + ' ' + this._y; }
    window.SVGPathSegLinetoVerticalRel.prototype.clone = function() { return new window.SVGPathSegLinetoVerticalRel(undefined, this._y); }
    Object.defineProperty(window.SVGPathSegLinetoVerticalRel.prototype, 'y', { get: function() { return this._y; }, set: function(y) { this._y = y; this._segmentChanged(); }, enumerable: true });
    
    window.SVGPathSegCurvetoCubicSmoothAbs = function(owningPathSegList, x, y, x2, y2) {
    window.SVGPathSeg.call(this, window.SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS, 'S', owningPathSegList);
    this._x = x;
    this._y = y;
    this._x2 = x2;
    this._y2 = y2;
    }
    window.SVGPathSegCurvetoCubicSmoothAbs.prototype = Object.create(window.SVGPathSeg.prototype);
    window.SVGPathSegCurvetoCubicSmoothAbs.prototype.toString = function() { return '[object SVGPathSegCurvetoCubicSmoothAbs]'; }
    window.SVGPathSegCurvetoCubicSmoothAbs.prototype._asPathString = function() { return this.pathSegTypeAsLetter + ' ' + this._x2 + ' ' + this._y2 + ' ' + this._x + ' ' + this._y; }
    window.SVGPathSegCurvetoCubicSmoothAbs.prototype.clone = function() { return new window.SVGPathSegCurvetoCubicSmoothAbs(undefined, this._x, this._y, this._x2, this._y2); }
    Object.defineProperty(window.SVGPathSegCurvetoCubicSmoothAbs.prototype, 'x', { get: function() { return this._x; }, set: function(x) { this._x = x; this._segmentChanged(); }, enumerable: true });
    Object.defineProperty(window.SVGPathSegCurvetoCubicSmoothAbs.prototype, 'y', { get: function() { return this._y; }, set: function(y) { this._y = y; this._segmentChanged(); }, enumerable: true });
    Object.defineProperty(window.SVGPathSegCurvetoCubicSmoothAbs.prototype, 'x2', { get: function() { return this._x2; }, set: function(x2) { this._x2 = x2; this._segmentChanged(); }, enumerable: true });
    Object.defineProperty(window.SVGPathSegCurvetoCubicSmoothAbs.prototype, 'y2', { get: function() { return this._y2; }, set: function(y2) { this._y2 = y2; this._segmentChanged(); }, enumerable: true });
    
    window.SVGPathSegCurvetoCubicSmoothRel = function(owningPathSegList, x, y, x2, y2) {
    window.SVGPathSeg.call(this, window.SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL, 's', owningPathSegList);
    this._x = x;
    this._y = y;
    this._x2 = x2;
    this._y2 = y2;
    }
    window.SVGPathSegCurvetoCubicSmoothRel.prototype = Object.create(window.SVGPathSeg.prototype);
    window.SVGPathSegCurvetoCubicSmoothRel.prototype.toString = function() { return '[object SVGPathSegCurvetoCubicSmoothRel]'; }
    window.SVGPathSegCurvetoCubicSmoothRel.prototype._asPathString = function() { return this.pathSegTypeAsLetter + ' ' + this._x2 + ' ' + this._y2 + ' ' + this._x + ' ' + this._y; }
    window.SVGPathSegCurvetoCubicSmoothRel.prototype.clone = function() { return new window.SVGPathSegCurvetoCubicSmoothRel(undefined, this._x, this._y, this._x2, this._y2); }
    Object.defineProperty(window.SVGPathSegCurvetoCubicSmoothRel.prototype, 'x', { get: function() { return this._x; }, set: function(x) { this._x = x; this._segmentChanged(); }, enumerable: true });
    Object.defineProperty(window.SVGPathSegCurvetoCubicSmoothRel.prototype, 'y', { get: function() { return this._y; }, set: function(y) { this._y = y; this._segmentChanged(); }, enumerable: true });
    Object.defineProperty(window.SVGPathSegCurvetoCubicSmoothRel.prototype, 'x2', { get: function() { return this._x2; }, set: function(x2) { this._x2 = x2; this._segmentChanged(); }, enumerable: true });
    Object.defineProperty(window.SVGPathSegCurvetoCubicSmoothRel.prototype, 'y2', { get: function() { return this._y2; }, set: function(y2) { this._y2 = y2; this._segmentChanged(); }, enumerable: true });
    
    window.SVGPathSegCurvetoQuadraticSmoothAbs = function(owningPathSegList, x, y) {
    window.SVGPathSeg.call(this, window.SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_ABS, 'T', owningPathSegList);
    this._x = x;
    this._y = y;
    }
    window.SVGPathSegCurvetoQuadraticSmoothAbs.prototype = Object.create(window.SVGPathSeg.prototype);
    window.SVGPathSegCurvetoQuadraticSmoothAbs.prototype.toString = function() { return '[object SVGPathSegCurvetoQuadraticSmoothAbs]'; }
    window.SVGPathSegCurvetoQuadraticSmoothAbs.prototype._asPathString = function() { return this.pathSegTypeAsLetter + ' ' + this._x + ' ' + this._y; }
    window.SVGPathSegCurvetoQuadraticSmoothAbs.prototype.clone = function() { return new window.SVGPathSegCurvetoQuadraticSmoothAbs(undefined, this._x, this._y); }
    Object.defineProperty(window.SVGPathSegCurvetoQuadraticSmoothAbs.prototype, 'x', { get: function() { return this._x; }, set: function(x) { this._x = x; this._segmentChanged(); }, enumerable: true });
    Object.defineProperty(window.SVGPathSegCurvetoQuadraticSmoothAbs.prototype, 'y', { get: function() { return this._y; }, set: function(y) { this._y = y; this._segmentChanged(); }, enumerable: true });
    
    window.SVGPathSegCurvetoQuadraticSmoothRel = function(owningPathSegList, x, y) {
    window.SVGPathSeg.call(this, window.SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_REL, 't', owningPathSegList);
    this._x = x;
    this._y = y;
    }
    window.SVGPathSegCurvetoQuadraticSmoothRel.prototype = Object.create(window.SVGPathSeg.prototype);
    window.SVGPathSegCurvetoQuadraticSmoothRel.prototype.toString = function() { return '[object SVGPathSegCurvetoQuadraticSmoothRel]'; }
    window.SVGPathSegCurvetoQuadraticSmoothRel.prototype._asPathString = function() { return this.pathSegTypeAsLetter + ' ' + this._x + ' ' + this._y; }
    window.SVGPathSegCurvetoQuadraticSmoothRel.prototype.clone = function() { return new window.SVGPathSegCurvetoQuadraticSmoothRel(undefined, this._x, this._y); }
    Object.defineProperty(window.SVGPathSegCurvetoQuadraticSmoothRel.prototype, 'x', { get: function() { return this._x; }, set: function(x) { this._x = x; this._segmentChanged(); }, enumerable: true });
    Object.defineProperty(window.SVGPathSegCurvetoQuadraticSmoothRel.prototype, 'y', { get: function() { return this._y; }, set: function(y) { this._y = y; this._segmentChanged(); }, enumerable: true });
    
    window.SVGPathElement.prototype.createSVGPathSegClosePath = function() { return new window.SVGPathSegClosePath(undefined); }
    window.SVGPathElement.prototype.createSVGPathSegMovetoAbs = function(x, y) { return new window.SVGPathSegMovetoAbs(undefined, x, y); }
    window.SVGPathElement.prototype.createSVGPathSegMovetoRel = function(x, y) { return new window.SVGPathSegMovetoRel(undefined, x, y); }
    window.SVGPathElement.prototype.createSVGPathSegLinetoAbs = function(x, y) { return new window.SVGPathSegLinetoAbs(undefined, x, y); }
    window.SVGPathElement.prototype.createSVGPathSegLinetoRel = function(x, y) { return new window.SVGPathSegLinetoRel(undefined, x, y); }
    window.SVGPathElement.prototype.createSVGPathSegCurvetoCubicAbs = function(x, y, x1, y1, x2, y2) { return new window.SVGPathSegCurvetoCubicAbs(undefined, x, y, x1, y1, x2, y2); }
    window.SVGPathElement.prototype.createSVGPathSegCurvetoCubicRel = function(x, y, x1, y1, x2, y2) { return new window.SVGPathSegCurvetoCubicRel(undefined, x, y, x1, y1, x2, y2); }
    window.SVGPathElement.prototype.createSVGPathSegCurvetoQuadraticAbs = function(x, y, x1, y1) { return new window.SVGPathSegCurvetoQuadraticAbs(undefined, x, y, x1, y1); }
    window.SVGPathElement.prototype.createSVGPathSegCurvetoQuadraticRel = function(x, y, x1, y1) { return new window.SVGPathSegCurvetoQuadraticRel(undefined, x, y, x1, y1); }
    window.SVGPathElement.prototype.createSVGPathSegArcAbs = function(x, y, r1, r2, angle, largeArcFlag, sweepFlag) { return new window.SVGPathSegArcAbs(undefined, x, y, r1, r2, angle, largeArcFlag, sweepFlag); }
    window.SVGPathElement.prototype.createSVGPathSegArcRel = function(x, y, r1, r2, angle, largeArcFlag, sweepFlag) { return new window.SVGPathSegArcRel(undefined, x, y, r1, r2, angle, largeArcFlag, sweepFlag); }
    window.SVGPathElement.prototype.createSVGPathSegLinetoHorizontalAbs = function(x) { return new window.SVGPathSegLinetoHorizontalAbs(undefined, x); }
    window.SVGPathElement.prototype.createSVGPathSegLinetoHorizontalRel = function(x) { return new window.SVGPathSegLinetoHorizontalRel(undefined, x); }
    window.SVGPathElement.prototype.createSVGPathSegLinetoVerticalAbs = function(y) { return new window.SVGPathSegLinetoVerticalAbs(undefined, y); }
    window.SVGPathElement.prototype.createSVGPathSegLinetoVerticalRel = function(y) { return new window.SVGPathSegLinetoVerticalRel(undefined, y); }
    window.SVGPathElement.prototype.createSVGPathSegCurvetoCubicSmoothAbs = function(x, y, x2, y2) { return new window.SVGPathSegCurvetoCubicSmoothAbs(undefined, x, y, x2, y2); }
    window.SVGPathElement.prototype.createSVGPathSegCurvetoCubicSmoothRel = function(x, y, x2, y2) { return new window.SVGPathSegCurvetoCubicSmoothRel(undefined, x, y, x2, y2); }
    window.SVGPathElement.prototype.createSVGPathSegCurvetoQuadraticSmoothAbs = function(x, y) { return new window.SVGPathSegCurvetoQuadraticSmoothAbs(undefined, x, y); }
    window.SVGPathElement.prototype.createSVGPathSegCurvetoQuadraticSmoothRel = function(x, y) { return new window.SVGPathSegCurvetoQuadraticSmoothRel(undefined, x, y); }
    
    if (!('getPathSegAtLength' in window.SVGPathElement.prototype)) {
    window.SVGPathElement.prototype.getPathSegAtLength = function(distance) {
    if (distance === undefined || !isFinite(distance))
    throw 'Invalid arguments.';
    
    var measurementElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    measurementElement.setAttribute('d', this.getAttribute('d'));
    var lastPathSegment = measurementElement.pathSegList.numberOfItems - 1;
    
    if (lastPathSegment <= 0)
    return 0;
    
    do {
    measurementElement.pathSegList.removeItem(lastPathSegment);
    if (distance > measurementElement.getTotalLength())
    break;
    lastPathSegment--;
    } while (lastPathSegment > 0);
    return lastPathSegment;
    }
    }
    }
    
    if (!('SVGPathSegList' in window) || !('appendItem' in window.SVGPathSegList.prototype)) {
    window.SVGPathSegList = function(pathElement) {
    this._pathElement = pathElement;
    this._list = this._parsePath(this._pathElement.getAttribute('d'));
    
    this._mutationObserverConfig = { 'attributes': true, 'attributeFilter': ['d'] };
    this._pathElementMutationObserver = new MutationObserver(this._updateListFromPathMutations.bind(this));
    this._pathElementMutationObserver.observe(this._pathElement, this._mutationObserverConfig);
    }
    
    window.SVGPathSegList.prototype.classname = 'SVGPathSegList';
    
    Object.defineProperty(window.SVGPathSegList.prototype, 'numberOfItems', {
    get: function() {
    this._checkPathSynchronizedToList();
    return this._list.length;
    },
    enumerable: true
    });
    
    Object.defineProperty(window.SVGPathSegList.prototype, 'length', {
    get: function() {
    this._checkPathSynchronizedToList();
    return this._list.length;
    },
    enumerable: true
    });
    
    Object.defineProperty(window.SVGPathElement.prototype, 'pathSegList', {
    get: function() {
    if (!this._pathSegList)
    this._pathSegList = new window.SVGPathSegList(this);
    return this._pathSegList;
    },
    enumerable: true
    });
    Object.defineProperty(window.SVGPathElement.prototype, 'normalizedPathSegList', { get: function() { return this.pathSegList; }, enumerable: true });
    Object.defineProperty(window.SVGPathElement.prototype, 'animatedPathSegList', { get: function() { return this.pathSegList; }, enumerable: true });
    Object.defineProperty(window.SVGPathElement.prototype, 'animatedNormalizedPathSegList', { get: function() { return this.pathSegList; }, enumerable: true });
    
    window.SVGPathSegList.prototype._checkPathSynchronizedToList = function() {
    this._updateListFromPathMutations(this._pathElementMutationObserver.takeRecords());
    }
    
    window.SVGPathSegList.prototype._updateListFromPathMutations = function(mutationRecords) {
    if (!this._pathElement)
    return;
    var hasPathMutations = false;
    mutationRecords.forEach(function(record) {
    if (record.attributeName == 'd')
    hasPathMutations = true;
    });
    if (hasPathMutations)
    this._list = this._parsePath(this._pathElement.getAttribute('d'));
    }
    
    window.SVGPathSegList.prototype._writeListToPath = function() {
    this._pathElementMutationObserver.disconnect();
    this._pathElement.setAttribute('d', window.SVGPathSegList._pathSegArrayAsString(this._list));
    this._pathElementMutationObserver.observe(this._pathElement, this._mutationObserverConfig);
    }
    
    window.SVGPathSegList.prototype.segmentChanged = function(pathSeg) {
    this._writeListToPath();
    }
    
    window.SVGPathSegList.prototype.clear = function() {
    this._checkPathSynchronizedToList();
    
    this._list.forEach(function(pathSeg) {
    pathSeg._owningPathSegList = null;
    });
    this._list = [];
    this._writeListToPath();
    }
    
    window.SVGPathSegList.prototype.initialize = function(newItem) {
    this._checkPathSynchronizedToList();
    
    this._list = [newItem];
    newItem._owningPathSegList = this;
    this._writeListToPath();
    return newItem;
    }
    
    window.SVGPathSegList.prototype._checkValidIndex = function(index) {
    if (isNaN(index) || index < 0 || index >= this.numberOfItems)
    throw 'INDEX_SIZE_ERR';
    }
    
    window.SVGPathSegList.prototype.getItem = function(index) {
    this._checkPathSynchronizedToList();
    
    this._checkValidIndex(index);
    return this._list[index];
    }
    
    window.SVGPathSegList.prototype.insertItemBefore = function(newItem, index) {
    this._checkPathSynchronizedToList();
    
    if (index > this.numberOfItems)
    index = this.numberOfItems;
    if (newItem._owningPathSegList) {
    newItem = newItem.clone();
    }
    this._list.splice(index, 0, newItem);
    newItem._owningPathSegList = this;
    this._writeListToPath();
    return newItem;
    }
    
    window.SVGPathSegList.prototype.replaceItem = function(newItem, index) {
    this._checkPathSynchronizedToList();
    
    if (newItem._owningPathSegList) {
    newItem = newItem.clone();
    }
    this._checkValidIndex(index);
    this._list[index] = newItem;
    newItem._owningPathSegList = this;
    this._writeListToPath();
    return newItem;
    }
    
    window.SVGPathSegList.prototype.removeItem = function(index) {
    this._checkPathSynchronizedToList();
    
    this._checkValidIndex(index);
    var item = this._list[index];
    this._list.splice(index, 1);
    this._writeListToPath();
    return item;
    }
    
    window.SVGPathSegList.prototype.appendItem = function(newItem) {
    this._checkPathSynchronizedToList();
    
    if (newItem._owningPathSegList) {
    newItem = newItem.clone();
    }
    this._list.push(newItem);
    newItem._owningPathSegList = this;
    this._writeListToPath();
    return newItem;
    };
    
    window.SVGPathSegList.prototype.matrixTransform = function(aSVGMatrix) {
    this._checkPathSynchronizedToList();
    
    var nLength = this._list.length;
    for( var i = 0; i < nLength; ++i )
    {
    var nX;
    var aPathSeg = this._list[i];
    switch( aPathSeg.pathSegTypeAsLetter )
    {
    case 'C':
    nX = aPathSeg._x2;
    aPathSeg._x2 = aSVGMatrix.a * nX + aSVGMatrix.c * aPathSeg._y2 + aSVGMatrix.e;
    aPathSeg._y2 = aSVGMatrix.b * nX + aSVGMatrix.d * aPathSeg._y2 + aSVGMatrix.f;
    case 'Q':
    nX = aPathSeg._x1;
    aPathSeg._x1 = aSVGMatrix.a * nX + aSVGMatrix.c * aPathSeg._y1 + aSVGMatrix.e;
    aPathSeg._y1 = aSVGMatrix.b * nX + aSVGMatrix.d * aPathSeg._y1 + aSVGMatrix.f;
    case 'M':
    case 'L':
    nX = aPathSeg._x;
    aPathSeg._x = aSVGMatrix.a * nX + aSVGMatrix.c * aPathSeg._y + aSVGMatrix.e;
    aPathSeg._y = aSVGMatrix.b * nX + aSVGMatrix.d * aPathSeg._y + aSVGMatrix.f;
    break;
    default:
    log( 'SVGPathSeg.matrixTransform: unexpected path segment type: '
    + aPathSeg.pathSegTypeAsLetter );
    }
    }
    
    this._writeListToPath();
    };
    
    window.SVGPathSegList.prototype.changeOrientation = function() {
    this._checkPathSynchronizedToList();
    
    var aPathSegList = this._list;
    var nLength = aPathSegList.length;
    if( nLength == 0 ) return;
    
    var nCurrentX = 0;
    var nCurrentY = 0;
    
    var aPathSeg = aPathSegList[0];
    if( aPathSeg.pathSegTypeAsLetter == 'M' )
    {
    nCurrentX = aPathSeg.x;
    nCurrentY = aPathSeg.y;
    aPathSegList.shift();
    --nLength;
    }
    
    var i;
    for( i = 0; i < nLength; ++i )
    {
    aPathSeg = aPathSegList[i];
    switch( aPathSeg.pathSegTypeAsLetter )
    {
    case 'C':
    var nX = aPathSeg._x1;
    aPathSeg._x1 = aPathSeg._x2;
    aPathSeg._x2 = nX;
    var nY = aPathSeg._y1;
    aPathSeg._y1 = aPathSeg._y2;
    aPathSeg._y2 = nY;
    case 'M':
    case 'L':
    case 'Q':
    var aPoint = { x: aPathSeg._x, y: aPathSeg._y };
    aPathSeg._x = nCurrentX;
    aPathSeg._y = nCurrentY;
    nCurrentX = aPoint.x;
    nCurrentY = aPoint.y;
    break;
    default:
    log( 'SVGPathSegList.changeOrientation: unexpected path segment type: '
    + aPathSeg.pathSegTypeAsLetter );
    }
    
    }
    
    aPathSegList.reverse();
    
    var aMovePathSeg = new window.SVGPathSegMovetoAbs( this, nCurrentX, nCurrentY );
    aPathSegList.unshift( aMovePathSeg );
    
    this._writeListToPath();
    };
    
    window.SVGPathSegList._pathSegArrayAsString = function(pathSegArray) {
    var string = '';
    var first = true;
    pathSegArray.forEach(function(pathSeg) {
    if (first) {
    first = false;
    string += pathSeg._asPathString();
    } else {
    string += ' ' + pathSeg._asPathString();
    }
    });
    return string;
    }
    
    window.SVGPathSegList.prototype._parsePath = function(string) {
    if (!string || string.length == 0)
    return [];
    
    var owningPathSegList = this;
    
    var Builder = function() {
    this.pathSegList = [];
    }
    
    Builder.prototype.appendSegment = function(pathSeg) {
    this.pathSegList.push(pathSeg);
    }
    
    var Source = function(string) {
    this._string = string;
    this._currentIndex = 0;
    this._endIndex = this._string.length;
    this._previousCommand = window.SVGPathSeg.PATHSEG_UNKNOWN;
    
    this._skipOptionalSpaces();
    }
    
    Source.prototype._isCurrentSpace = function() {
    var character = this._string[this._currentIndex];
    return character <= ' ' && (character == ' ' || character == '\n' || character == '\t' || character == '\r' || character == '\f');
    }
    
    Source.prototype._skipOptionalSpaces = function() {
    while (this._currentIndex < this._endIndex && this._isCurrentSpace())
    this._currentIndex++;
    return this._currentIndex < this._endIndex;
    }
    
    Source.prototype._skipOptionalSpacesOrDelimiter = function() {
    if (this._currentIndex < this._endIndex && !this._isCurrentSpace() && this._string.charAt(this._currentIndex) != ',')
    return false;
    if (this._skipOptionalSpaces()) {
    if (this._currentIndex < this._endIndex && this._string.charAt(this._currentIndex) == ',') {
    this._currentIndex++;
    this._skipOptionalSpaces();
    }
    }
    return this._currentIndex < this._endIndex;
    }
    
    Source.prototype.hasMoreData = function() {
    return this._currentIndex < this._endIndex;
    }
    
    Source.prototype.peekSegmentType = function() {
    var lookahead = this._string[this._currentIndex];
    return this._pathSegTypeFromChar(lookahead);
    }
    
    Source.prototype._pathSegTypeFromChar = function(lookahead) {
    switch (lookahead) {
    case 'Z':
    case 'z':
    return window.SVGPathSeg.PATHSEG_CLOSEPATH;
    case 'M':
    return window.SVGPathSeg.PATHSEG_MOVETO_ABS;
    case 'm':
    return window.SVGPathSeg.PATHSEG_MOVETO_REL;
    case 'L':
    return window.SVGPathSeg.PATHSEG_LINETO_ABS;
    case 'l':
    return window.SVGPathSeg.PATHSEG_LINETO_REL;
    case 'C':
    return window.SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS;
    case 'c':
    return window.SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL;
    case 'Q':
    return window.SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS;
    case 'q':
    return window.SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL;
    case 'A':
    return window.SVGPathSeg.PATHSEG_ARC_ABS;
    case 'a':
    return window.SVGPathSeg.PATHSEG_ARC_REL;
    case 'H':
    return window.SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_ABS;
    case 'h':
    return window.SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_REL;
    case 'V':
    return window.SVGPathSeg.PATHSEG_LINETO_VERTICAL_ABS;
    case 'v':
    return window.SVGPathSeg.PATHSEG_LINETO_VERTICAL_REL;
    case 'S':
    return window.SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS;
    case 's':
    return window.SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL;
    case 'T':
    return window.SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_ABS;
    case 't':
    return window.SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_REL;
    default:
    return window.SVGPathSeg.PATHSEG_UNKNOWN;
    }
    }
    
    Source.prototype._nextCommandHelper = function(lookahead, previousCommand) {
    if ((lookahead == '+' || lookahead == '-' || lookahead == '.' || (lookahead >= '0' && lookahead <= '9')) && previousCommand != window.SVGPathSeg.PATHSEG_CLOSEPATH) {
    if (previousCommand == window.SVGPathSeg.PATHSEG_MOVETO_ABS)
    return window.SVGPathSeg.PATHSEG_LINETO_ABS;
    if (previousCommand == window.SVGPathSeg.PATHSEG_MOVETO_REL)
    return window.SVGPathSeg.PATHSEG_LINETO_REL;
    return previousCommand;
    }
    return window.SVGPathSeg.PATHSEG_UNKNOWN;
    }
    
    Source.prototype.initialCommandIsMoveTo = function() {
    if (!this.hasMoreData())
    return true;
    var command = this.peekSegmentType();
    return command == window.SVGPathSeg.PATHSEG_MOVETO_ABS || command == window.SVGPathSeg.PATHSEG_MOVETO_REL;
    }
    
    Source.prototype._parseNumber = function() {
    var exponent = 0;
    var integer = 0;
    var frac = 1;
    var decimal = 0;
    var sign = 1;
    var expsign = 1;
    
    var startIndex = this._currentIndex;
    
    this._skipOptionalSpaces();
    
    if (this._currentIndex < this._endIndex && this._string.charAt(this._currentIndex) == '+')
    this._currentIndex++;
    else if (this._currentIndex < this._endIndex && this._string.charAt(this._currentIndex) == '-') {
    this._currentIndex++;
    sign = -1;
    }
    
    if (this._currentIndex == this._endIndex || ((this._string.charAt(this._currentIndex) < '0' || this._string.charAt(this._currentIndex) > '9') && this._string.charAt(this._currentIndex) != '.'))
    return undefined;
    
    var startIntPartIndex = this._currentIndex;
    while (this._currentIndex < this._endIndex && this._string.charAt(this._currentIndex) >= '0' && this._string.charAt(this._currentIndex) <= '9')
    this._currentIndex++; // Advance to first non-digit.
    
    if (this._currentIndex != startIntPartIndex) {
    var scanIntPartIndex = this._currentIndex - 1;
    var multiplier = 1;
    while (scanIntPartIndex >= startIntPartIndex) {
    integer += multiplier * (this._string.charAt(scanIntPartIndex--) - '0');
    multiplier *= 10;
    }
    }
    
    if (this._currentIndex < this._endIndex && this._string.charAt(this._currentIndex) == '.') {
    this._currentIndex++;
    
    if (this._currentIndex >= this._endIndex || this._string.charAt(this._currentIndex) < '0' || this._string.charAt(this._currentIndex) > '9')
    return undefined;
    while (this._currentIndex < this._endIndex && this._string.charAt(this._currentIndex) >= '0' && this._string.charAt(this._currentIndex) <= '9') {
    frac *= 10;
    decimal += (this._string.charAt(this._currentIndex) - '0') / frac;
    this._currentIndex += 1;
    }
    }
    
    if (this._currentIndex != startIndex && this._currentIndex + 1 < this._endIndex && (this._string.charAt(this._currentIndex) == 'e' || this._string.charAt(this._currentIndex) == 'E') && (this._string.charAt(this._currentIndex + 1) != 'x' && this._string.charAt(this._currentIndex + 1) != 'm')) {
    this._currentIndex++;
    
    if (this._string.charAt(this._currentIndex) == '+') {
    this._currentIndex++;
    } else if (this._string.charAt(this._currentIndex) == '-') {
    this._currentIndex++;
    expsign = -1;
    }
    
    if (this._currentIndex >= this._endIndex || this._string.charAt(this._currentIndex) < '0' || this._string.charAt(this._currentIndex) > '9')
    return undefined;
    
    while (this._currentIndex < this._endIndex && this._string.charAt(this._currentIndex) >= '0' && this._string.charAt(this._currentIndex) <= '9') {
    exponent *= 10;
    exponent += (this._string.charAt(this._currentIndex) - '0');
    this._currentIndex++;
    }
    }
    
    var number = integer + decimal;
    number *= sign;
    
    if (exponent)
    number *= Math.pow(10, expsign * exponent);
    
    if (startIndex == this._currentIndex)
    return undefined;
    
    this._skipOptionalSpacesOrDelimiter();
    
    return number;
    }
    
    Source.prototype._parseArcFlag = function() {
    if (this._currentIndex >= this._endIndex)
    return undefined;
    var flag = false;
    var flagChar = this._string.charAt(this._currentIndex++);
    if (flagChar == '0')
    flag = false;
    else if (flagChar == '1')
    flag = true;
    else
    return undefined;
    
    this._skipOptionalSpacesOrDelimiter();
    return flag;
    }
    
    Source.prototype.parseSegment = function() {
    var lookahead = this._string[this._currentIndex];
    var command = this._pathSegTypeFromChar(lookahead);
    if (command == window.SVGPathSeg.PATHSEG_UNKNOWN) {
    if (this._previousCommand == window.SVGPathSeg.PATHSEG_UNKNOWN)
    return null;
    command = this._nextCommandHelper(lookahead, this._previousCommand);
    if (command == window.SVGPathSeg.PATHSEG_UNKNOWN)
    return null;
    } else {
    this._currentIndex++;
    }
    
    this._previousCommand = command;
    
    switch (command) {
    case window.SVGPathSeg.PATHSEG_MOVETO_REL:
    return new window.SVGPathSegMovetoRel(owningPathSegList, this._parseNumber(), this._parseNumber());
    case window.SVGPathSeg.PATHSEG_MOVETO_ABS:
    return new window.SVGPathSegMovetoAbs(owningPathSegList, this._parseNumber(), this._parseNumber());
    case window.SVGPathSeg.PATHSEG_LINETO_REL:
    return new window.SVGPathSegLinetoRel(owningPathSegList, this._parseNumber(), this._parseNumber());
    case window.SVGPathSeg.PATHSEG_LINETO_ABS:
    return new window.SVGPathSegLinetoAbs(owningPathSegList, this._parseNumber(), this._parseNumber());
    case window.SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_REL:
    return new window.SVGPathSegLinetoHorizontalRel(owningPathSegList, this._parseNumber());
    case window.SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_ABS:
    return new window.SVGPathSegLinetoHorizontalAbs(owningPathSegList, this._parseNumber());
    case window.SVGPathSeg.PATHSEG_LINETO_VERTICAL_REL:
    return new window.SVGPathSegLinetoVerticalRel(owningPathSegList, this._parseNumber());
    case window.SVGPathSeg.PATHSEG_LINETO_VERTICAL_ABS:
    return new window.SVGPathSegLinetoVerticalAbs(owningPathSegList, this._parseNumber());
    case window.SVGPathSeg.PATHSEG_CLOSEPATH:
    this._skipOptionalSpaces();
    return new window.SVGPathSegClosePath(owningPathSegList);
    case window.SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL:
    var points = {x1: this._parseNumber(), y1: this._parseNumber(), x2: this._parseNumber(), y2: this._parseNumber(), x: this._parseNumber(), y: this._parseNumber()};
    return new window.SVGPathSegCurvetoCubicRel(owningPathSegList, points.x, points.y, points.x1, points.y1, points.x2, points.y2);
    case window.SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS:
    var points = {x1: this._parseNumber(), y1: this._parseNumber(), x2: this._parseNumber(), y2: this._parseNumber(), x: this._parseNumber(), y: this._parseNumber()};
    return new window.SVGPathSegCurvetoCubicAbs(owningPathSegList, points.x, points.y, points.x1, points.y1, points.x2, points.y2);
    case window.SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL:
    var points = {x2: this._parseNumber(), y2: this._parseNumber(), x: this._parseNumber(), y: this._parseNumber()};
    return new window.SVGPathSegCurvetoCubicSmoothRel(owningPathSegList, points.x, points.y, points.x2, points.y2);
    case window.SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS:
    var points = {x2: this._parseNumber(), y2: this._parseNumber(), x: this._parseNumber(), y: this._parseNumber()};
    return new window.SVGPathSegCurvetoCubicSmoothAbs(owningPathSegList, points.x, points.y, points.x2, points.y2);
    case window.SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL:
    var points = {x1: this._parseNumber(), y1: this._parseNumber(), x: this._parseNumber(), y: this._parseNumber()};
    return new window.SVGPathSegCurvetoQuadraticRel(owningPathSegList, points.x, points.y, points.x1, points.y1);
    case window.SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS:
    var points = {x1: this._parseNumber(), y1: this._parseNumber(), x: this._parseNumber(), y: this._parseNumber()};
    return new window.SVGPathSegCurvetoQuadraticAbs(owningPathSegList, points.x, points.y, points.x1, points.y1);
    case window.SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_REL:
    return new window.SVGPathSegCurvetoQuadraticSmoothRel(owningPathSegList, this._parseNumber(), this._parseNumber());
    case window.SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_ABS:
    return new window.SVGPathSegCurvetoQuadraticSmoothAbs(owningPathSegList, this._parseNumber(), this._parseNumber());
    case window.SVGPathSeg.PATHSEG_ARC_REL:
    var points = {x1: this._parseNumber(), y1: this._parseNumber(), arcAngle: this._parseNumber(), arcLarge: this._parseArcFlag(), arcSweep: this._parseArcFlag(), x: this._parseNumber(), y: this._parseNumber()};
    return new window.SVGPathSegArcRel(owningPathSegList, points.x, points.y, points.x1, points.y1, points.arcAngle, points.arcLarge, points.arcSweep);
    case window.SVGPathSeg.PATHSEG_ARC_ABS:
    var points = {x1: this._parseNumber(), y1: this._parseNumber(), arcAngle: this._parseNumber(), arcLarge: this._parseArcFlag(), arcSweep: this._parseArcFlag(), x: this._parseNumber(), y: this._parseNumber()};
    return new window.SVGPathSegArcAbs(owningPathSegList, points.x, points.y, points.x1, points.y1, points.arcAngle, points.arcLarge, points.arcSweep);
    default:
    throw 'Unknown path seg type.'
    }
    }
    
    var builder = new Builder();
    var source = new Source(string);
    
    if (!source.initialCommandIsMoveTo())
    return [];
    while (source.hasMoreData()) {
    var pathSeg = source.parseSegment();
    if (!pathSeg)
    return [];
    builder.appendSegment(pathSeg);
    }
    
    return builder.pathSegList;
    }
    }
    }());
    
    /*****
    * @svgpathend
    *
    *  The above code is a derivative work of some part of the SVGPathSeg API.
    *
    *  This API is a drop-in replacement for the SVGPathSeg and SVGPathSegList APIs that were removed from
    *  SVG2 (https://lists.w3.org/Archives/Public/www-svg/2015Jun/0044.html), including the latest spec
    *  changes which were implemented in Firefox 43 and Chrome 46.
    *
    *  @source https://github.com/progers/pathseg
    */
    
    
    /*****
    * @licstart
    *
    * The following is the license notice for the part of JavaScript code  of
    * this page included between the '@libreofficestart' and the '@libreofficeend'
    * notes.
    */
    
    /*****  ******************************************************************
    *
    * This file is part of the LibreOffice project.
    *
    * This Source Code Form is subject to the terms of the Mozilla Public
    * License, v. 2.0. If a copy of the MPL was not distributed with this
    * file, You can obtain one at http://mozilla.org/MPL/2.0/.
    *
    * This file incorporates work covered by the following license notice:
    *
    *   Licensed to the Apache Software Foundation (ASF) under one or more
    *   contributor license agreements. See the NOTICE file distributed
    *   with this work for additional information regarding copyright
    *   ownership. The ASF licenses this file to you under the Apache
    *   License, Version 2.0 (the 'License'); you may not use this file
    *   except in compliance with the License. You may obtain a copy of
    *   the License at http://www.apache.org/licenses/LICENSE-2.0 .
    *
    ************************************************************************/
    
    /*****
    * @licend
    *
    * The above is the license notice for the part of JavaScript code  of
    * this page included between the '@libreofficestart' and the '@libreofficeend'
    * notes.
    */
    
    
    /*****
    * @libreofficestart
    *
    * Several parts of the following code are the result of the porting,
    * started on August 2011, of the C++ code included in the source
    * files placed under the folder '/slideshow/source' and
    * sub-folders. This got later rebased onto the AL2-licensed versions
    * of those files in early 2013.
    * @source https://cgit.freedesktop.org/libreoffice/core/tree/slideshow/source
    *
    */
    
    
    window.onload = init;
    
    
    var aOOOElemMetaSlides = 'ooo:meta_slides';
    var aOOOElemMetaSlide = 'ooo:meta_slide';
    var aOOOElemTextField = 'ooo:text_field';
    var aPresentationClipPathId = 'presentation_clip_path';
    var aPresentationClipPathShrinkId = 'presentation_clip_path_shrink';
    
    var aOOOAttrNumberOfSlides = 'number-of-slides';
    var aOOOAttrStartSlideNumber= 'start-slide-number';
    var aOOOAttrNumberingType = 'page-numbering-type';
    var aOOOAttrListItemNumberingType= 'numbering-type';
    var aOOOAttrUsePositionedChars = 'use-positioned-chars';
    
    var aOOOAttrSlide = 'slide';
    var aOOOAttrMaster = 'master';
    var aOOOAttrSlideDuration = 'slide-duration';
    var aOOOAttrHasTransition = 'has-transition';
    var aOOOAttrBackgroundVisibility = 'background-visibility';
    var aOOOAttrMasterObjectsVisibility = 'master-objects-visibility';
    var aOOOAttrPageNumberVisibility = 'page-number-visibility';
    var aOOOAttrDateTimeVisibility = 'date-time-visibility';
    var aOOOAttrFooterVisibility = 'footer-visibility';
    var aOOOAttrHeaderVisibility = 'header-visibility';
    var aOOOAttrDateTimeField = 'date-time-field';
    var aOOOAttrFooterField = 'footer-field';
    var aOOOAttrHeaderField = 'header-field';
    
    var aOOOAttrDateTimeFormat = 'date-time-format';
    
    var aOOOAttrTextAdjust = 'text-adjust';
    
    var aClipPathGroupClassName = 'ClipPathGroup';
    var aPageClassName = 'Page';
    var aSlideNumberClassName = 'Slide_Number';
    var aDateTimeClassName = 'Date/Time';
    var aFooterClassName = 'Footer';
    var aHeaderClassName = 'Header';
    
    var NSS = {};
    NSS['svg']='http://www.w3.org/2000/svg';
    NSS['rdf']='http://www.w3.org/1999/02/22-rdf-syntax-ns#';
    NSS['xlink']='http://www.w3.org/1999/xlink';
    NSS['xml']='http://www.w3.org/XML/1998/namespace';
    NSS['ooo'] = 'http://xml.openoffice.org/svg/export';
    NSS['presentation'] = 'http://sun.com/xmlns/staroffice/presentation';
    NSS['smil'] = 'http://www.w3.org/2001/SMIL20/';
    NSS['anim'] = 'urn:oasis:names:tc:opendocument:xmlns:animation:1.0';
    
    var SLIDE_MODE = 1;
    var INDEX_MODE = 2;
    
    var MOUSE_UP = 1;
    var MOUSE_DOWN = 2; // eslint-disable-line no-unused-vars
    var MOUSE_MOVE = 3; // eslint-disable-line no-unused-vars
    var MOUSE_WHEEL = 4;
    
    var LEFT_KEY = 37;          // cursor left keycode
    var UP_KEY = 38;            // cursor up keycode
    var RIGHT_KEY = 39;         // cursor right keycode
    var DOWN_KEY = 40;          // cursor down keycode
    var PAGE_UP_KEY = 33;       // page up keycode
    var PAGE_DOWN_KEY = 34;     // page down keycode
    var HOME_KEY = 36;          // home keycode
    var END_KEY = 35;           // end keycode
    var ENTER_KEY = 13;
    var SPACE_KEY = 32;
    var ESCAPE_KEY = 27;
    var Q_KEY = 81;
    
    var HIDDEN = 0;
    var VISIBLE = 1;
    var INHERIT = 2;
    var aVisibilityAttributeValue = [ 'hidden', 'visible', 'inherit' ];  // eslint-disable-line no-unused-vars
    var aVisibilityValue = { 'hidden' : HIDDEN, 'visible' : VISIBLE, 'inherit' : INHERIT };
    
    var ROOT_NODE = document.getElementsByTagNameNS( NSS['svg'], 'svg' )[0];
    var WIDTH = 0;
    var HEIGHT = 0;
    var INDEX_COLUMNS_DEFAULT = 3;
    var INDEX_OFFSET = 0;
    
    var Detect = configureDetectionTools();
    var theMetaDoc;
    var theSlideIndexPage;
    var currentMode = SLIDE_MODE;
    var processingEffect = false;
    var nCurSlide = undefined;
    var bTextHasBeenSelected = false;
    var sLastSelectedText = '';
    
    
    var charCodeDictionary = getDefaultCharCodeDictionary();
    var keyCodeDictionary = getDefaultKeyCodeDictionary();
    
    var mouseHandlerDictionary = getDefaultMouseHandlerDictionary();
    
    
    function object( aObject )
    {
    var F = function() {};
    F.prototype = aObject;
    return new F();
    }
    
    
    function extend( aSubType, aSuperType )
    {
    if (!aSuperType || !aSubType)
    {
    alert('extend failed, verify dependencies');
    }
    var OP = Object.prototype;
    var sp = aSuperType.prototype;
    var rp = object( sp );
    aSubType.prototype = rp;
    
    rp.constructor = aSubType;
    aSubType.superclass = sp;
    
    if (aSuperType != Object && sp.constructor == OP.constructor)
    {
    sp.constructor = aSuperType;
    }
    
    return aSubType;
    }
    
    
    function instantiate( TemplateClass, BaseType )
    {
    if( !TemplateClass.instanceSet )
    TemplateClass.instanceSet = [];
    
    var nSize = TemplateClass.instanceSet.length;
    
    for( var i = 0; i < nSize; ++i )
    {
    if( TemplateClass.instanceSet[i].base === BaseType )
    return TemplateClass.instanceSet[i].instance;
    }
    
    TemplateClass.instanceSet[ nSize ] = {};
    TemplateClass.instanceSet[ nSize ].base = BaseType;
    TemplateClass.instanceSet[ nSize ].instance = TemplateClass( BaseType );
    
    return TemplateClass.instanceSet[ nSize ].instance;
    }
    
    
    function Rectangle( aSVGRectElem )
    {
    var x = parseInt( aSVGRectElem.getAttribute( 'x' ) );
    var y = parseInt( aSVGRectElem.getAttribute( 'y' ) );
    var width = parseInt( aSVGRectElem.getAttribute( 'width' ) );
    var height = parseInt( aSVGRectElem.getAttribute( 'height' ) );
    
    this.left = x;
    this.right = x + width;
    this.top = y;
    this.bottom = y + height;
    }
    
    function getKeyByValue(aObj, value) {
    for(var key in aObj) {
    if(aObj[key] == value)
    return key;
    }
    return null;
    }
    
    function log( message )
    {
    if( typeof console == 'object' )
    {
    console.log( message );
    }
    else if( typeof opera == 'object' )
    {
    opera.postError( message );
    }
    else if( typeof java == 'object' && typeof java.lang == 'object' )
    {
    java.lang.System.out.println( message );
    }
    }
    
    function getNSAttribute( sNSPrefix, aElem, sAttrName )
    {
    if( !aElem ) return null;
    if( 'getAttributeNS' in aElem )
    {
    return aElem.getAttributeNS( NSS[sNSPrefix], sAttrName );
    }
    else
    {
    return aElem.getAttribute( sNSPrefix + ':' + sAttrName );
    }
    }
    
    function getOOOAttribute( aElem, sAttrName )
    {
    return getNSAttribute( 'ooo', aElem, sAttrName );
    }
    
    function setNSAttribute( sNSPrefix, aElem, sAttrName, aValue )
    {
    if( !aElem ) return false;
    if( 'setAttributeNS' in aElem )
    {
    aElem.setAttributeNS( NSS[sNSPrefix], sAttrName, aValue );
    return true;
    }
    else
    {
    aElem.setAttribute(sNSPrefix + ':' + sAttrName, aValue );
    return true;
    }
    }
    
    function getElementsByClassName( aElem, sClassName )
    {
    
    var aElementSet = [];
    if( 'getElementsByClassName' in aElem )
    {
    aElementSet = aElem.getElementsByClassName( sClassName );
    }
    else
    {
    var aElementSetByClassProperty = getElementsByProperty( aElem, 'class' );
    for( var i = 0; i < aElementSetByClassProperty.length; ++i )
    {
    var sAttrClassName = aElementSetByClassProperty[i].getAttribute( 'class' );
    if( sAttrClassName == sClassName )
    {
    aElementSet.push( aElementSetByClassProperty[i] );
    }
    }
    }
    return aElementSet;
    }
    
    function getElementByClassName( aElem, sClassName /*, sTagName */)
    {
    var aElementSet = getElementsByClassName( aElem, sClassName );
    if ( aElementSet.length == 1 )
    return aElementSet[0];
    else
    return null;
    }
    
    function getClassAttribute(  aElem )
    {
    if( aElem )
    return aElem.getAttribute( 'class' );
    return '';
    }
    
    function createElementGroup( aParentElement, aElementList, nFrom, nCount, sGroupClass, sGroupId )
    {
    var nTo = nFrom + nCount;
    if( nCount < 1 || aElementList.length < nTo )
    {
    log( 'createElementGroup: not enough elements available.' );
    return;
    }
    var firstElement = aElementList[nFrom];
    if( !firstElement )
    {
    log( 'createElementGroup: element not found.' );
    return;
    }
    var aGroupElement = document.createElementNS( NSS['svg'], 'g' );
    if( sGroupId )
    aGroupElement.setAttribute( 'id', sGroupId );
    if( sGroupClass )
    aGroupElement.setAttribute( 'class', sGroupClass );
    aParentElement.insertBefore( aGroupElement, firstElement );
    var i = nFrom;
    for( ; i < nTo; ++i )
    {
    aParentElement.removeChild( aElementList[i] );
    aGroupElement.appendChild( aElementList[i] );
    }
    }
    
    function initVisibilityProperty( aElement )
    {
    var nVisibility = VISIBLE;
    var sVisibility = aElement.getAttribute( 'visibility' );
    if( sVisibility ) nVisibility = aVisibilityValue[ sVisibility ];
    return nVisibility;
    }
    
    function getSafeIndex( nIndex, nMin, nMax )
    {
    if( nIndex < nMin )
    return nMin;
    else if( nIndex > nMax )
    return nMax;
    else
    return nIndex;
    }
    
    function getRandomInt( nMax )
    {
    return Math.floor( Math.random() * nMax );
    }
    
    function isTextFieldElement( aElement ) // eslint-disable-line no-unused-vars
    {
    var sClassName = aElement.getAttribute( 'class' );
    return ( sClassName === aSlideNumberClassName ) ||
    ( sClassName === aFooterClassName ) ||
    ( sClassName === aHeaderClassName ) ||
    ( sClassName === aDateTimeClassName );
    }
    
    
    function DebugPrinter()
    {
    this.bEnabled = false;
    }
    
    
    DebugPrinter.prototype.on = function()
    {
    this.bEnabled = true;
    };
    
    DebugPrinter.prototype.off = function()
    {
    this.bEnabled = false;
    };
    
    DebugPrinter.prototype.isEnabled = function()
    {
    return this.bEnabled;
    };
    
    DebugPrinter.prototype.print = function( sMessage, nTime )
    {
    if( this.isEnabled() )
    {
    var sInfo = 'DBG: ' + sMessage;
    if( nTime )
    sInfo += ' (at: ' + String( nTime / 1000 ) + 's)';
    log( sInfo );
    }
    };
    
    
    var aGenericDebugPrinter = new DebugPrinter();
    aGenericDebugPrinter.off();
    var DBGLOG = bind2( DebugPrinter.prototype.print, aGenericDebugPrinter );
    
    var NAVDBG = new DebugPrinter();
    NAVDBG.off();
    
    var ANIMDBG = new DebugPrinter();
    ANIMDBG.off();
    
    var aRegisterEventDebugPrinter = new DebugPrinter();
    aRegisterEventDebugPrinter.off();
    
    var aTimerEventQueueDebugPrinter = new DebugPrinter();
    aTimerEventQueueDebugPrinter.off();
    
    var aEventMultiplexerDebugPrinter = new DebugPrinter();
    aEventMultiplexerDebugPrinter.off();
    
    var aNextEffectEventArrayDebugPrinter = new DebugPrinter();
    aNextEffectEventArrayDebugPrinter.off();
    
    var aActivityQueueDebugPrinter = new DebugPrinter();
    aActivityQueueDebugPrinter.off();
    
    var aAnimatedElementDebugPrinter = new DebugPrinter();
    aAnimatedElementDebugPrinter.off();
    
    
    function MetaDocument()
    {
    var aMetaDocElem = document.getElementById( aOOOElemMetaSlides );
    assert( aMetaDocElem, 'MetaDocument: the svg element with id:' + aOOOElemMetaSlides + 'is not valid.');
    
    this.nNumberOfSlides = parseInt( aMetaDocElem.getAttributeNS( NSS['ooo'], aOOOAttrNumberOfSlides ) );
    assert( typeof this.nNumberOfSlides == 'number' && this.nNumberOfSlides > 0,
    'MetaDocument: number of slides is zero or undefined.' );
    this.nStartSlideNumber = parseInt( aMetaDocElem.getAttributeNS( NSS['ooo'], aOOOAttrStartSlideNumber ) ) || 0;
    this.sPageNumberingType = aMetaDocElem.getAttributeNS( NSS['ooo'], aOOOAttrNumberingType ) || 'arabic';
    this.bIsUsePositionedChars = ( aMetaDocElem.getAttributeNS( NSS['ooo'], aOOOAttrUsePositionedChars ) === 'true' );
    
    this.aClipPathGroup = getElementByClassName( ROOT_NODE, aClipPathGroupClassName );
    assert( this.aClipPathGroup, 'MetaDocument: the clip path group element is not valid.');
    
    this.aPresentationClipPath = document.getElementById( aPresentationClipPathId );
    assert( this.aPresentationClipPath,
    'MetaDocument: the presentation clip path element element is not valid.');
    
    this.aMetaSlideSet = [];
    this.aMasterPageSet = {};
    this.aTextFieldHandlerSet = {};
    this.aTextFieldContentProviderSet = [];
    this.aSlideNumberProvider = new SlideNumberProvider( this.nStartSlideNumber + 1, this.sPageNumberingType );
    
    this.bIsAnimated = false;
    this.aSlideAnimationsMap = {};
    this.initSlideAnimationsMap();
    
    this.theMetaDummySlide = new MetaSlide( 'ooo:meta_dummy_slide', this );
    
    for( var i = 0; i < this.nNumberOfSlides; ++i )
    {
    var sMetaSlideId = aOOOElemMetaSlide + '_' + i;
    this.aMetaSlideSet.push( new MetaSlide( sMetaSlideId, this ) );
    }
    assert( this.aMetaSlideSet.length == this.nNumberOfSlides,
    'MetaDocument: aMetaSlideSet.length != nNumberOfSlides.' );
    }
    
    MetaDocument.prototype =
    {
    
    getCurrentSlide : function()
    {
    return this.aMetaSlideSet[nCurSlide];
    },
    
    setCurrentSlide : function( nSlideIndex )
    {
    if( nSlideIndex >= 0 &&  nSlideIndex < this.nNumberOfSlides )
    {
    if( nCurSlide !== undefined )
    this.aMetaSlideSet[nCurSlide].hide();
    this.aMetaSlideSet[nSlideIndex].show();
    nCurSlide = nSlideIndex;
    }
    else
    {
    log('MetaDocument.setCurrentSlide: slide index out of range: ' + nSlideIndex );
    }
    },
    
    
    initSlideAnimationsMap : function()
    {
    var aAnimationsSection = document.getElementById( 'presentation-animations' );
    if( aAnimationsSection )
    {
    var aAnimationsDefSet = aAnimationsSection.getElementsByTagName( 'defs' );
    
    this.bIsAnimated = ( typeof aAnimationsDefSet.length =='number' &&
    aAnimationsDefSet.length > 0 );
    
    for( var i = 0; i < aAnimationsDefSet.length; ++i )
    {
    var sSlideId = aAnimationsDefSet[i].getAttributeNS( NSS['ooo'], aOOOAttrSlide );
    var aChildSet = getElementChildren( aAnimationsDefSet[i] );
    if( sSlideId && ( aChildSet.length === 1 ) )
    {
    this.aSlideAnimationsMap[ sSlideId ] = aChildSet[0];
    }
    }
    }
    }
    
    }; // end MetaDocument prototype
    
    function MetaSlide( sMetaSlideId, aMetaDoc )
    {
    this.theDocument = document;
    this.id = sMetaSlideId;
    this.theMetaDoc = aMetaDoc;
    
    this.element = this.theDocument.getElementById( this.id );
    assert( this.element,
    'MetaSlide: meta_slide element <' + this.id + '> not found.' );
    
    this.slideId = this.element.getAttributeNS( NSS['ooo'], aOOOAttrSlide );
    this.slideElement = this.theDocument.getElementById( this.slideId );
    assert( this.slideElement,
    'MetaSlide: slide element <' + this.slideId + '> not found.' );
    
    if( this.slideId !== 'dummy_slide' )
    this.nSlideNumber = parseInt( this.slideId.substr(2) );
    else
    this.nSlideNumber= -1;
    
    this.aContainerElement = this.slideElement.parentNode;
    this.slideContainerId = this.aContainerElement.getAttribute( 'id' );
    this.aVisibilityStatusElement = this.aContainerElement.parentNode;
    
    this.pageElement = getElementByClassName( this.slideElement, aPageClassName );
    assert( this.pageElement,
    'MetaSlide: page element <' + this.slideId + '> not found.' );
    
    this.masterPage = this.initMasterPage();
    
    this.nAreMasterObjectsVisible     = this.initVisibilityProperty( aOOOAttrMasterObjectsVisibility,  VISIBLE );
    this.nIsBackgroundVisible         = this.initVisibilityProperty( aOOOAttrBackgroundVisibility,     VISIBLE );
    this.nIsPageNumberVisible         = this.initVisibilityProperty( aOOOAttrPageNumberVisibility,     HIDDEN );
    this.nIsDateTimeVisible           = this.initVisibilityProperty( aOOOAttrDateTimeVisibility,       VISIBLE );
    this.nIsFooterVisible             = this.initVisibilityProperty( aOOOAttrFooterVisibility,         VISIBLE );
    this.nIsHeaderVisible             = this.initVisibilityProperty( aOOOAttrHeaderVisibility,         VISIBLE );
    
    this.bIsDateTimeVariable = undefined;
    
    this.aTextFieldContentProviderSet = {};
    this.aTextFieldContentProviderSet[aSlideNumberClassName]   = this.initSlideNumberFieldContentProvider();
    this.aTextFieldContentProviderSet[aDateTimeClassName]      = this.initDateTimeFieldContentProvider( aOOOAttrDateTimeField );
    this.aTextFieldContentProviderSet[aFooterClassName]        = this.initFixedTextFieldContentProvider( aOOOAttrFooterField );
    this.aTextFieldContentProviderSet[aHeaderClassName]        = this.initFixedTextFieldContentProvider( aOOOAttrHeaderField );
    
    this.fDuration = this.initSlideDuration();
    
    this.aTransitionHandler = null;
    this.bHasTransition = this.initHasTransition() || true;
    if( this.bHasTransition )
    {
    this.aTransitionHandler = new SlideTransition( this.getSlideAnimationsRoot(), this.slideId );
    }
    
    this.aSlideAnimationsHandler = new SlideAnimations( aSlideShow.getContext() );
    this.aSlideAnimationsHandler.importAnimations( this.getSlideAnimationsRoot() );
    this.aSlideAnimationsHandler.parseElements();
    
    if( false && this.aSlideAnimationsHandler.aRootNode )
    log( this.aSlideAnimationsHandler.aRootNode.info( true ) );
    
    this.aTextShapeSet = this.collectTextShapes();
    
    this.aHyperlinkSet = this.initHyperlinks();
    
    }
    
    MetaSlide.prototype =
    {
    
    show : function()
    {
    this.updateMasterPageView();
    this.aVisibilityStatusElement.setAttribute( 'visibility', 'inherit' );
    },
    
    hide : function()
    {
    this.aVisibilityStatusElement.setAttribute( 'visibility', 'hidden' );
    },
    
    updateMasterPageView : function()
    {
    if( !this.aMasterPageView )
    {
    this.aMasterPageView = new MasterPageView( this );
    this.aMasterPageView.attachToSlide();
    }
    this.aMasterPageView.update();
    },
    
    initMasterPage : function()
    {
    var sMasterPageId = this.element.getAttributeNS( NSS['ooo'], aOOOAttrMaster );
    
    if( !this.theMetaDoc.aMasterPageSet.hasOwnProperty( sMasterPageId ) )
    {
    this.theMetaDoc.aMasterPageSet[ sMasterPageId ] = new MasterPage( sMasterPageId, this );
    
    this.theMetaDoc.aTextFieldHandlerSet[ sMasterPageId ] = {};
    }
    return this.theMetaDoc.aMasterPageSet[ sMasterPageId ];
    },
    
    initSlideDuration : function()
    {
    var sSlideDuration = this.element.getAttributeNS( NSS['ooo'], aOOOAttrSlideDuration );
    if( sSlideDuration && sSlideDuration.length > 0 )
    return parseFloat( sSlideDuration );
    else
    return -1;
    },
    
    initHasTransition : function()
    {
    var sHasTransition = this.element.getAttributeNS( NSS['ooo'], aOOOAttrHasTransition );
    return ( sHasTransition === 'true' );
    },
    
    initVisibilityProperty : function( aVisibilityAttribute, nDefaultValue )
    {
    var nVisibility = nDefaultValue;
    var sVisibility = getOOOAttribute( this.element, aVisibilityAttribute );
    if( sVisibility )
    nVisibility = aVisibilityValue[ sVisibility ];
    return nVisibility;
    },
    
    initSlideNumberFieldContentProvider : function()
    {
    return this.theMetaDoc.aSlideNumberProvider;
    },
    
    initDateTimeFieldContentProvider : function( aOOOAttrDateTimeField )
    {
    var sTextFieldId = getOOOAttribute( this.element, aOOOAttrDateTimeField );
    if( !sTextFieldId )  return null;
    
    var nLength = aOOOElemTextField.length + 1;
    var nIndex = parseInt(sTextFieldId.substring( nLength ) );
    if( typeof nIndex != 'number') return null;
    
    if( !this.theMetaDoc.aTextFieldContentProviderSet[ nIndex ] )
    {
    var aTextField;
    var aTextFieldElem = document.getElementById( sTextFieldId );
    var sClassName = getClassAttribute( aTextFieldElem );
    if( sClassName == 'FixedDateTimeField' )
    {
    aTextField = new FixedTextProvider( aTextFieldElem );
    this.bIsDateTimeVariable = false;
    }
    else if( sClassName == 'VariableDateTimeField' )
    {
    aTextField = new CurrentDateTimeProvider( aTextFieldElem );
    this.bIsDateTimeVariable = true;
    }
    else
    {
    aTextField = null;
    }
    this.theMetaDoc.aTextFieldContentProviderSet[ nIndex ] = aTextField;
    }
    return this.theMetaDoc.aTextFieldContentProviderSet[ nIndex ];
    },
    
    initFixedTextFieldContentProvider : function( aOOOAttribute )
    {
    var sTextFieldId = getOOOAttribute( this.element, aOOOAttribute );
    if( !sTextFieldId ) return null;
    
    var nLength = aOOOElemTextField.length + 1;
    var nIndex = parseInt( sTextFieldId.substring( nLength ) );
    if( typeof nIndex != 'number') return null;
    
    if( !this.theMetaDoc.aTextFieldContentProviderSet[ nIndex ] )
    {
    var aTextFieldElem = document.getElementById( sTextFieldId );
    this.theMetaDoc.aTextFieldContentProviderSet[ nIndex ]
    = new FixedTextProvider( aTextFieldElem );
    }
    return this.theMetaDoc.aTextFieldContentProviderSet[ nIndex ];
    },
    
    collectTextShapes : function()
    {
    var aTextShapeSet = [];
    var aTextShapeIndexElem = getElementByClassName( document, 'TextShapeIndex' );
    if( aTextShapeIndexElem )
    {
    var aIndexEntryList = getElementChildren( aTextShapeIndexElem );
    var i;
    for( i = 0; i < aIndexEntryList.length; ++i )
    {
    var sSlideId = getOOOAttribute( aIndexEntryList[i], 'slide' );
    if( sSlideId === this.slideId )
    {
    var sTextShapeIds = getOOOAttribute( aIndexEntryList[i], 'id-list' );
    if( sTextShapeIds )
    {
    var aTextShapeIdSet =  sTextShapeIds.split( ' ' );
    var j;
    for( j = 0; j < aTextShapeIdSet.length; ++j )
    {
    var aTextShapeElem = document.getElementById( aTextShapeIdSet[j] );
    if( aTextShapeElem )
    {
    aTextShapeSet.push( aTextShapeElem );
    }
    else
    {
    log( 'warning: MetaSlide.collectTextShapes: text shape with id <' + aTextShapeIdSet[j] + '> is not valid.'  );
    }
    }
    }
    break;
    }
    }
    }
    return aTextShapeSet;
    },
    
    initHyperlinks : function()
    {
    var aHyperlinkSet = {};
    var i;
    for( i = 0; i < this.aTextShapeSet.length; ++i )
    {
    if( this.aTextShapeSet[i] )
    {
    var aHyperlinkIdList = getElementByClassName( this.aTextShapeSet[i], 'HyperlinkIdList' );
    if( aHyperlinkIdList )
    {
    var sHyperlinkIds = aHyperlinkIdList.textContent;
    if( sHyperlinkIds )
    {
    var aHyperlinkIdSet = sHyperlinkIds.trim().split( ' ' );
    var j;
    for( j = 0; j < aHyperlinkIdSet.length; ++j )
    {
    var sId = aHyperlinkIdSet[j];
    aHyperlinkSet[ sId ] = new HyperlinkElement( sId, this.aSlideAnimationsHandler.aEventMultiplexer );
    }
    }
    }
    }
    }
    return aHyperlinkSet;
    },
    
    getSlideAnimationsRoot : function()
    {
    return this.theMetaDoc.aSlideAnimationsMap[ this.slideId ];
    }
    
    }; // end MetaSlide prototype
    
    function MasterPage( sMasterPageId, aMetaSlide )
    {
    this.id = sMasterPageId;
    this.metaSlide = aMetaSlide;
    
    this.element = document.getElementById( this.id );
    assert( this.element,
    'MasterPage: master page element <' + this.id + '> not found.' );
    
    this.background = getElementByClassName( this.element, 'Background' );
    if( this.background )
    {
    this.backgroundId = this.background.getAttribute( 'id' );
    this.backgroundVisibility = initVisibilityProperty( this.background );
    }
    else
    {
    this.backgroundId = '';
    log( 'MasterPage: the background element is not valid.' );
    }
    
    this.backgroundObjects = getElementByClassName( this.element, 'BackgroundObjects' );
    if( this.backgroundObjects )
    {
    this.backgroundObjectsId = this.backgroundObjects.getAttribute( 'id' );
    this.backgroundObjectsVisibility = initVisibilityProperty( this.backgroundObjects );
    
    if( this.backgroundObjectsVisibility != HIDDEN )
    {
    var aBackgroundObjectList = getElementChildren( this.backgroundObjects );
    var nFrom = 0;
    var nCount = 0;
    var nSubGroupId = 1;
    var sClass;
    var sId = '';
    this.aBackgroundObjectSubGroupIdList = [];
    var i = 0;
    for( ; i < aBackgroundObjectList.length; ++i )
    {
    sClass = aBackgroundObjectList[i].getAttribute( 'class' );
    if( !sClass || ( ( sClass !== aDateTimeClassName ) && ( sClass !== aFooterClassName )
    && ( sClass !== aHeaderClassName ) && ( sClass !== aSlideNumberClassName ) ) )
    {
    if( nCount === 0 )
    {
    nFrom = i;
    sId = this.backgroundObjectsId + '.' + nSubGroupId;
    ++nSubGroupId;
    this.aBackgroundObjectSubGroupIdList.push( sId );
    }
    ++nCount;
    }
    else
    {
    this.aBackgroundObjectSubGroupIdList.push( sClass );
    if( nCount !== 0 )
    {
    createElementGroup( this.backgroundObjects, aBackgroundObjectList, nFrom, nCount, 'BackgroundObjectSubgroup', sId );
    nCount = 0;
    }
    }
    }
    if( nCount !== 0 )
    {
    createElementGroup( this.backgroundObjects, aBackgroundObjectList, nFrom, nCount, 'BackgroundObjectSubgroup', sId );
    }
    }
    }
    else
    {
    this.backgroundObjectsId = '';
    log( 'MasterPage: the background objects element is not valid.' );
    }
    
    this.aPlaceholderShapeSet = {};
    this.initPlaceholderShapes();
    }
    
    MasterPage.prototype =
    {
    
    initPlaceholderShapes : function()
    {
    this.aPlaceholderShapeSet[ aSlideNumberClassName ] = new PlaceholderShape( this, aSlideNumberClassName );
    this.aPlaceholderShapeSet[ aDateTimeClassName ] = new PlaceholderShape( this, aDateTimeClassName );
    this.aPlaceholderShapeSet[ aFooterClassName ] = new PlaceholderShape( this, aFooterClassName );
    this.aPlaceholderShapeSet[ aHeaderClassName ] = new PlaceholderShape( this, aHeaderClassName );
    }
    
    }; // end MasterPage prototype
    
    function PlaceholderShape( aMasterPage, sClassName )
    {
    this.masterPage = aMasterPage;
    this.className = sClassName;
    
    this.element = null;
    this.textElement = null;
    this.init();
    }
    
    PlaceholderShape.prototype.isValid = function()
    {
    return ( this.element && this.textElement );
    };
    
    
    PlaceholderShape.prototype.init = function()
    {
    
    var aTextFieldElement = getElementByClassName( this.masterPage.backgroundObjects, this.className );
    if( aTextFieldElement )
    {
    var aPlaceholderElement = getElementByClassName( aTextFieldElement, 'PlaceholderText' );
    if( aPlaceholderElement )
    {
    var aSVGRectElem = getElementByClassName( aTextFieldElement, 'BoundingBox' );
    if( aSVGRectElem )
    {
    var aRect = new Rectangle( aSVGRectElem );
    var sTextAdjust = getOOOAttribute( aTextFieldElement, aOOOAttrTextAdjust ) || 'left';
    var sTextAnchor, sX;
    if( sTextAdjust == 'left' )
    {
    sTextAnchor = 'start';
    sX = String( aRect.left );
    }
    else if( sTextAdjust == 'right' )
    {
    sTextAnchor = 'end';
    sX = String( aRect.right );
    }
    else if( sTextAdjust == 'center' )
    {
    sTextAnchor = 'middle';
    var nMiddle = ( aRect.left + aRect.right ) / 2;
    sX = String( parseInt( String( nMiddle ) ) );
    }
    if( sTextAnchor )
    aPlaceholderElement.setAttribute( 'text-anchor', sTextAnchor );
    if( sX )
    aPlaceholderElement.setAttribute( 'x', sX );
    }
    
    if( this.masterPage.metaSlide.theMetaDoc.bIsUsePositionedChars )
    {
    var aTextLineGroupElem = aPlaceholderElement.parentNode.parentNode;
    if( aTextLineGroupElem )
    {
    var sFontFamilyAttr = aTextLineGroupElem.getAttribute( 'font-family' );
    if( sFontFamilyAttr )
    {
    var aChildSet = getElementChildren( aTextLineGroupElem );
    if( aChildSet.length > 1  )
    var i = 1;
    for( ; i < aChildSet.length; ++i )
    {
    aTextLineGroupElem.removeChild( aChildSet[i] );
    }
    }
    }
    }
    this.element = aTextFieldElement;
    this.textElement = aPlaceholderElement;
    }
    }
    };
    
    function MasterPageView( aMetaSlide )
    {
    this.aMetaSlide = aMetaSlide;
    this.aSlideElement = aMetaSlide.slideElement;
    this.aPageElement = aMetaSlide.pageElement;
    this.aMasterPage = aMetaSlide.masterPage;
    this.aMPVElement = this.createElement();
    this.bIsAttached = false;
    }
    
    
    MasterPageView.prototype.attachToSlide = function()
    {
    if( !this.bIsAttached )
    {
    var aInsertedElement = this.aSlideElement.insertBefore( this.aMPVElement, this.aPageElement );
    assert( aInsertedElement === this.aMPVElement,
    'MasterPageView.attachToSlide: aInsertedElement != this.aMPVElement' );
    
    this.bIsAttached = true;
    }
    };
    
    MasterPageView.prototype.detachFromSlide = function()
    {
    if( this.bIsAttached )
    {
    this.aSlideElement.removeChild( this.aMPVElement );
    this.bIsAttached = false;
    }
    };
    
    MasterPageView.prototype.update = function()
    {
    if( this.aDateTimeFieldHandler && this.aMetaSlide.bIsDateTimeVariable )
    this.aDateTimeFieldHandler.update();
    };
    
    
    MasterPageView.prototype.createElement = function()
    {
    var theDocument = document;
    var aMasterPageViewElement = theDocument.createElementNS( NSS['svg'], 'g' );
    assert( aMasterPageViewElement,
    'MasterPageView.createElement: failed to create a master page view element.' );
    aMasterPageViewElement.setAttribute( 'class', 'MasterPageView' );
    
    var aWhiteRect = theDocument.createElementNS( NSS['svg'], 'rect' );
    var nWidthExt = WIDTH / 1000;
    var nHeightExt = HEIGHT / 1000;
    aWhiteRect.setAttribute( 'x', String( -nWidthExt / 2 ) );
    aWhiteRect.setAttribute( 'y', String( -nHeightExt / 2 ) );
    aWhiteRect.setAttribute( 'width', String( WIDTH + nWidthExt ) );
    aWhiteRect.setAttribute( 'height', String( HEIGHT + nHeightExt ) );
    aWhiteRect.setAttribute( 'fill', '#FFFFFF' );
    aMasterPageViewElement.appendChild( aWhiteRect );
    
    if( this.aMetaSlide.nIsBackgroundVisible )
    {
    this.aBackgroundElement = theDocument.createElementNS( NSS['svg'], 'use' );
    this.aBackgroundElement.setAttribute( 'class', 'Background' );
    setNSAttribute( 'xlink', this.aBackgroundElement,
    'href', '#' + this.aMasterPage.backgroundId );
    
    aMasterPageViewElement.appendChild( this.aBackgroundElement );
    }
    
    if( this.aMetaSlide.nAreMasterObjectsVisible )
    {
    this.aBackgroundObjectsElement = theDocument.createElementNS( NSS['svg'], 'g' );
    this.aBackgroundObjectsElement.setAttribute( 'class', 'BackgroundObjects' );
    
    var aBackgroundObjectSubGroupIdList = this.aMasterPage.aBackgroundObjectSubGroupIdList;
    this.aBackgroundSubGroupElementSet = [];
    var aPlaceholderShapeSet = this.aMasterPage.aPlaceholderShapeSet;
    var aTextFieldContentProviderSet = this.aMetaSlide.aTextFieldContentProviderSet;
    var aDefsElement = this.aMetaSlide.element.parentNode;
    var aTextFieldHandlerSet = this.aMetaSlide.theMetaDoc.aTextFieldHandlerSet;
    var sMasterSlideId = this.aMasterPage.id;
    
    var i = 0;
    var sId;
    for( ; i < aBackgroundObjectSubGroupIdList.length; ++i )
    {
    sId = aBackgroundObjectSubGroupIdList[i];
    if( sId === aSlideNumberClassName )
    {
    if( aPlaceholderShapeSet[aSlideNumberClassName] &&
    aPlaceholderShapeSet[aSlideNumberClassName].isValid() &&
    this.aMetaSlide.nIsPageNumberVisible &&
    aTextFieldContentProviderSet[aSlideNumberClassName] )
    {
    this.aSlideNumberFieldHandler =
    new SlideNumberFieldHandler( aPlaceholderShapeSet[aSlideNumberClassName],
    aTextFieldContentProviderSet[aSlideNumberClassName] );
    this.aSlideNumberFieldHandler.update( this.aMetaSlide.nSlideNumber );
    this.aSlideNumberFieldHandler.appendTo( this.aBackgroundObjectsElement );
    }
    }
    else if( sId === aDateTimeClassName )
    {
    if( this.aMetaSlide.nIsDateTimeVisible )
    {
    this.aDateTimeFieldHandler =
    this.initTextFieldHandler( aDateTimeClassName, aPlaceholderShapeSet,
    aTextFieldContentProviderSet, aDefsElement,
    aTextFieldHandlerSet, sMasterSlideId );
    }
    }
    else if( sId === aFooterClassName )
    {
    if( this.aMetaSlide.nIsFooterVisible )
    {
    this.aFooterFieldHandler =
    this.initTextFieldHandler( aFooterClassName, aPlaceholderShapeSet,
    aTextFieldContentProviderSet, aDefsElement,
    aTextFieldHandlerSet, sMasterSlideId );
    }
    }
    else if( sId === aHeaderClassName )
    {
    if( this.aMetaSlide.nIsHeaderVisible )
    {
    this.aHeaderFieldHandler =
    this.initTextFieldHandler( aHeaderClassName, aPlaceholderShapeSet,
    aTextFieldContentProviderSet, aDefsElement,
    aTextFieldHandlerSet, sMasterSlideId );
    }
    }
    else
    {
    var aBackgroundSubGroupElement = theDocument.createElementNS( NSS['svg'], 'use' );
    aBackgroundSubGroupElement.setAttribute( 'class', 'BackgroundObjectSubGroup' );
    setNSAttribute( 'xlink', aBackgroundSubGroupElement,
    'href', '#' + sId );
    this.aBackgroundSubGroupElementSet.push( aBackgroundSubGroupElement );
    this.aBackgroundObjectsElement.appendChild( aBackgroundSubGroupElement );
    }
    
    }
    aMasterPageViewElement.appendChild( this.aBackgroundObjectsElement );
    }
    
    return aMasterPageViewElement;
    };
    
    MasterPageView.prototype.initTextFieldHandler =
    function( sClassName, aPlaceholderShapeSet, aTextFieldContentProviderSet,
    aDefsElement, aTextFieldHandlerSet, sMasterSlideId )
    {
    var aTextFieldHandler = null;
    if( aPlaceholderShapeSet[sClassName] &&
    aPlaceholderShapeSet[sClassName].isValid()
    && aTextFieldContentProviderSet[sClassName] )
    {
    var sTextFieldContentProviderId = aTextFieldContentProviderSet[sClassName].sId;
    if ( !aTextFieldHandlerSet[ sMasterSlideId ][ sTextFieldContentProviderId ] )
    {
    aTextFieldHandlerSet[ sMasterSlideId ][ sTextFieldContentProviderId ] =
    new TextFieldHandler( aPlaceholderShapeSet[sClassName],
    aTextFieldContentProviderSet[sClassName] );
    aTextFieldHandler = aTextFieldHandlerSet[ sMasterSlideId ][ sTextFieldContentProviderId ];
    aTextFieldHandler.update();
    aTextFieldHandler.appendTo( aDefsElement );
    }
    else
    {
    aTextFieldHandler = aTextFieldHandlerSet[ sMasterSlideId ][ sTextFieldContentProviderId ];
    }
    
    var aTextFieldElement = document.createElementNS( NSS['svg'], 'use' );
    aTextFieldElement.setAttribute( 'class', sClassName );
    setNSAttribute( 'xlink', aTextFieldElement,
    'href', '#' + aTextFieldHandler.sId );
    this.aBackgroundObjectsElement.appendChild( aTextFieldElement );
    }
    return aTextFieldHandler;
    };
    
    function TextFieldHandler( aPlaceholderShape, aTextContentProvider )
    {
    this.aPlaceHolderShape = aPlaceholderShape;
    this.aTextContentProvider = aTextContentProvider;
    assert( this.aTextContentProvider,
    'TextFieldHandler: text content provider not defined.' );
    this.sId = 'tf' + String( TextFieldHandler.getUniqueId() );
    this.aTextFieldElement = null;
    this.aTextPlaceholderElement = null;
    this.cloneElement();
    }
    
    
    TextFieldHandler.CURR_UNIQUE_ID = 0;
    
    TextFieldHandler.getUniqueId = function()
    {
    ++TextFieldHandler.CURR_UNIQUE_ID;
    return TextFieldHandler.CURR_UNIQUE_ID;
    };
    
    TextFieldHandler.prototype.cloneElement = function()
    {
    assert( this.aPlaceHolderShape && this.aPlaceHolderShape.isValid(),
    'TextFieldHandler.cloneElement: placeholder shape is not valid.' );
    this.aTextFieldElement = this.aPlaceHolderShape.element.cloneNode( true /* deep clone */ );
    assert( this.aTextFieldElement,
    'TextFieldHandler.cloneElement: aTextFieldElement is not defined' );
    this.aTextFieldElement.setAttribute( 'id', this.sId );
    this.aTextFieldElement.removeAttribute( 'visibility' );
    this.aTextPlaceholderElement = getElementByClassName( this.aTextFieldElement, 'PlaceholderText' );
    assert( this.aTextPlaceholderElement,
    'TextFieldHandler.cloneElement: aTextPlaceholderElement is not defined' );
    };
    
    
    TextFieldHandler.prototype.appendTo = function( aParentNode )
    {
    if( !this.aTextFieldElement )
    {
    log( 'TextFieldHandler.appendTo: aTextFieldElement is not defined' );
    return;
    }
    if( !aParentNode )
    {
    log( 'TextFieldHandler.appendTo: parent node is not defined' );
    return;
    }
    
    aParentNode.appendChild( this.aTextFieldElement );
    };
    
    TextFieldHandler.prototype.setTextContent = function( sText )
    {
    if( !this.aTextPlaceholderElement )
    {
    log( 'PlaceholderShape.setTextContent: text element is not valid in placeholder of type '
    + this.className + ' that belongs to master slide ' + this.masterPage.id );
    return;
    }
    this.aTextPlaceholderElement.textContent = sText;
    };
    
    TextFieldHandler.prototype.update = function()
    {
    if( !this.aTextContentProvider )
    log('TextFieldHandler.update: text content provider not defined.');
    else
    this.aTextContentProvider.update( this );
    };
    
    function SlideNumberFieldHandler( aPlaceholderShape, aTextContentProvider )
    {
    SlideNumberFieldHandler.superclass.constructor.call( this, aPlaceholderShape, aTextContentProvider );
    }
    extend( SlideNumberFieldHandler, TextFieldHandler );
    
    
    SlideNumberFieldHandler.prototype.update = function( nPageNumber )
    {
    if( !this.aTextContentProvider )
    log('TextFieldHandler.update: text content provider not defined.');
    else
    this.aTextContentProvider.update( this, nPageNumber );
    };
    
    
    function TextFieldContentProvider( aTextFieldContentElement )
    {
    if( aTextFieldContentElement )
    this.sId = aTextFieldContentElement.getAttribute( 'id' );
    }
    
    function FixedTextProvider( aTextFieldContentElement )
    {
    FixedTextProvider.superclass.constructor.call( this, aTextFieldContentElement );
    this.text = aTextFieldContentElement.textContent;
    }
    extend( FixedTextProvider, TextFieldContentProvider );
    
    
    FixedTextProvider.prototype.update = function( aFixedTextField )
    {
    aFixedTextField.setTextContent( this.text );
    };
    
    function CurrentDateTimeProvider( aTextFieldContentElement )
    {
    CurrentDateTimeProvider.superclass.constructor.call( this, aTextFieldContentElement );
    this.dateTimeFormat = getOOOAttribute( aTextFieldContentElement, aOOOAttrDateTimeFormat );
    }
    extend( CurrentDateTimeProvider, TextFieldContentProvider );
    
    
    CurrentDateTimeProvider.prototype.update = function( aDateTimeField )
    {
    var sText = this.createDateTimeText( this.dateTimeFormat );
    aDateTimeField.setTextContent( sText );
    };
    
    
    CurrentDateTimeProvider.prototype.createDateTimeText = function( /*sDateTimeFormat*/ )
    {
    var aDate = new Date();
    var sDate = aDate.toLocaleString();
    return sDate;
    };
    
    function SlideNumberProvider( nInitialSlideNumber, sPageNumberingType )
    {
    SlideNumberProvider.superclass.constructor.call( this, null );
    this.nInitialSlideNumber = nInitialSlideNumber;
    this.pageNumberingType = sPageNumberingType;
    
    }
    extend( SlideNumberProvider, TextFieldContentProvider );
    
    
    SlideNumberProvider.prototype.getNumberingType = function()
    {
    return this.pageNumberingType;
    };
    
    
    SlideNumberProvider.prototype.update = function( aSlideNumberField, nSlideNumber )
    {
    if( nSlideNumber === undefined )
    {
    if( nCurSlide === undefined )
    nSlideNumber = this.nInitialSlideNumber;
    else
    nSlideNumber = nCurSlide + 1;
    }
    var sText = this.createSlideNumberText( nSlideNumber, this.getNumberingType() );
    aSlideNumberField.setTextContent( sText );
    };
    
    
    SlideNumberProvider.prototype.createSlideNumberText = function( nSlideNumber /*, sNumberingType*/ )
    {
    return String( nSlideNumber );
    };
    
    
    function SlideIndexPage()
    {
    this.pageElementId = 'slide_index';
    this.pageBgColor = 'rgb(252,252,252)';
    this.pageElement = this.createPageElement();
    assert( this.pageElement, 'SlideIndexPage: pageElement is not valid' );
    this.indexColumns = INDEX_COLUMNS_DEFAULT;
    this.totalThumbnails = this.indexColumns * this.indexColumns;
    this.selectedSlideIndex = undefined;
    
    this.xSpacingFactor = 600/28000;
    this.ySpacingFactor = 450/21000;
    this.xSpacing = WIDTH * this.xSpacingFactor;
    this.ySpacing = HEIGHT * this.ySpacingFactor;
    this.halfBorderWidthFactor = ( 300/28000 ) * ( this.indexColumns / 3 );
    this.halfBorderWidth = WIDTH * this.halfBorderWidthFactor;
    this.borderWidth = 2 * this.halfBorderWidth;
    this.scaleFactor = ( 1 - ( this.indexColumns + 1 ) * this.xSpacingFactor ) /
    ( this.indexColumns * ( 1 + 2 * this.halfBorderWidthFactor ) );
    
    this.thumbnailMouseAreaTemplateId = 'thumbnail_mouse_area';
    this.thumbnailMouseAreaTemplateElement = null;
    this.thumbnailBorderTemplateId = 'thumbnail_border';
    this.thumbnailBorderTemplateElement = null;
    this.createTemplateElements();
    
    this.aThumbnailSet = new Array( this.totalThumbnails );
    for( var i = 0; i < this.totalThumbnails; ++i )
    {
    this.aThumbnailSet[i] = new Thumbnail( this, i );
    this.aThumbnailSet[i].updateView();
    }
    
    this.curThumbnailIndex = 0;
    }
    
    
    SlideIndexPage.prototype.getTotalThumbnails = function()
    {
    return this.totalThumbnails;
    };
    
    SlideIndexPage.prototype.show = function()
    {
    this.pageElement.setAttribute( 'display', 'inherit' );
    };
    
    SlideIndexPage.prototype.hide = function()
    {
    this.pageElement.setAttribute( 'display', 'none' );
    };
    
    SlideIndexPage.prototype.setSelection = function( nIndex )
    {
    nIndex = getSafeIndex( nIndex, 0, this.getTotalThumbnails() - 1 );
    if( this.curThumbnailIndex != nIndex )
    {
    this.aThumbnailSet[ this.curThumbnailIndex ].unselect();
    this.aThumbnailSet[ nIndex ].select();
    this.curThumbnailIndex = nIndex;
    }
    this.selectedSlideIndex = this.aThumbnailSet[ nIndex ].slideIndex;
    };
    
    SlideIndexPage.prototype.createPageElement = function()
    {
    var aPageElement = document.createElementNS( NSS['svg'], 'g' );
    aPageElement.setAttribute( 'id', this.pageElementId );
    aPageElement.setAttribute( 'display', 'none' );
    aPageElement.setAttribute( 'visibility', 'visible' );
    
    var sPageBgColor = this.pageBgColor + ';';
    var aRectElement = document.createElementNS( NSS['svg'], 'rect' );
    aRectElement.setAttribute( 'x', 0 );
    aRectElement.setAttribute( 'y', 0 );
    aRectElement.setAttribute( 'width', WIDTH );
    aRectElement.setAttribute( 'height', HEIGHT );
    aRectElement.setAttribute( 'style', 'stroke:none;fill:' + sPageBgColor );
    
    aPageElement.appendChild( aRectElement );
    ROOT_NODE.appendChild( aPageElement );
    return( document.getElementById( this.pageElementId ) );
    };
    
    SlideIndexPage.prototype.createTemplateElements = function()
    {
    var aDefsElement = document.createElementNS( NSS['svg'], 'defs' );
    var aRectElement = document.createElementNS( NSS['svg'], 'rect' );
    aRectElement.setAttribute( 'id', this.thumbnailBorderTemplateId );
    aRectElement.setAttribute( 'x', -this.halfBorderWidth );
    aRectElement.setAttribute( 'y', -this.halfBorderWidth );
    aRectElement.setAttribute( 'rx', this.halfBorderWidth );
    aRectElement.setAttribute( 'ry', this.halfBorderWidth );
    aRectElement.setAttribute( 'width', WIDTH + this.halfBorderWidth );
    aRectElement.setAttribute( 'height', HEIGHT + this.halfBorderWidth );
    aRectElement.setAttribute( 'stroke-width', this.borderWidth );
    aRectElement.setAttribute( 'fill', 'none' );
    aDefsElement.appendChild( aRectElement );
    
    aRectElement = document.createElementNS( NSS['svg'], 'rect' );
    aRectElement.setAttribute( 'id', this.thumbnailMouseAreaTemplateId );
    aRectElement.setAttribute( 'x', 0 );
    aRectElement.setAttribute( 'y', 0 );
    aRectElement.setAttribute( 'width', WIDTH );
    aRectElement.setAttribute( 'height', HEIGHT );
    aRectElement.setAttribute( 'fill', this.pageBgColor );
    aDefsElement.appendChild( aRectElement );
    
    this.pageElement.appendChild( aDefsElement );
    
    this.thumbnailMouseAreaTemplateElement = document.getElementById( this.thumbnailMouseAreaTemplateId );
    this.thumbnailBorderTemplateElement = document.getElementById( this.thumbnailBorderTemplateId );
    };
    
    SlideIndexPage.prototype.decreaseNumberOfColumns  = function()
    {
    this.setNumberOfColumns( this.indexColumns - 1 );
    };
    
    SlideIndexPage.prototype.increaseNumberOfColumns  = function()
    {
    this.setNumberOfColumns( this.indexColumns + 1 );
    };
    
    SlideIndexPage.prototype.resetNumberOfColumns  = function()
    {
    this.setNumberOfColumns( INDEX_COLUMNS_DEFAULT );
    };
    
    SlideIndexPage.prototype.setNumberOfColumns  = function( nNumberOfColumns )
    {
    if( this.indexColumns == nNumberOfColumns )  return;
    if( nNumberOfColumns < 2 || nNumberOfColumns > 6 ) return;
    
    var suspendHandle = ROOT_NODE.suspendRedraw(500);
    
    var nOldTotalThumbnails = this.totalThumbnails;
    this.indexColumns = nNumberOfColumns;
    this.totalThumbnails = nNumberOfColumns * nNumberOfColumns;
    
    this.aThumbnailSet[this.curThumbnailIndex].unselect();
    
    var i;
    for( i = this.totalThumbnails; i < nOldTotalThumbnails; ++i )
    {
    this.aThumbnailSet[i].removeElement();
    }
    
    for( i = nOldTotalThumbnails; i < this.totalThumbnails; ++i )
    {
    this.aThumbnailSet[i] = new Thumbnail( this, i );
    }
    
    this.halfBorderWidthFactor = ( 300/28000 ) * ( this.indexColumns / 3 );
    this.halfBorderWidth = WIDTH * this.halfBorderWidthFactor;
    this.borderWidth = 2 * this.halfBorderWidth;
    this.scaleFactor = ( 1 - ( this.indexColumns + 1 ) * this.xSpacingFactor ) /
    ( this.indexColumns * ( 1 + 2 * this.halfBorderWidthFactor ) );
    
    var aRectElement = this.thumbnailBorderTemplateElement;
    aRectElement.setAttribute( 'x', -this.halfBorderWidth );
    aRectElement.setAttribute( 'y', -this.halfBorderWidth );
    aRectElement.setAttribute( 'rx', this.halfBorderWidth );
    aRectElement.setAttribute( 'ry', this.halfBorderWidth );
    aRectElement.setAttribute( 'width', WIDTH + this.halfBorderWidth );
    aRectElement.setAttribute( 'height', HEIGHT + this.halfBorderWidth );
    aRectElement.setAttribute( 'stroke-width', this.borderWidth );
    
    for( i = 0; i < this.totalThumbnails; ++i )
    {
    this.aThumbnailSet[i].updateView();
    }
    
    this.curThumbnailIndex = this.selectedSlideIndex % this.totalThumbnails;
    this.aThumbnailSet[this.curThumbnailIndex].select();
    
    INDEX_OFFSET = -1;
    indexSetPageSlide( this.selectedSlideIndex );
    
    ROOT_NODE.unsuspendRedraw( suspendHandle );
    ROOT_NODE.forceRedraw();
    };
    
    
    function Thumbnail( aSlideIndexPage, nIndex )
    {
    this.container = aSlideIndexPage;
    this.index = nIndex;//= getSafeIndex( nIndex, 0, this.container.getTotalThumbnails() );
    this.pageElement = this.container.pageElement;
    this.thumbnailId = 'thumbnail' + this.index;
    this.thumbnailElement = this.createThumbnailElement();
    this.slideElement = getElementByClassName( this.thumbnailElement, 'Slide' );
    this.borderElement = getElementByClassName( this.thumbnailElement, 'Border' );
    this.mouseAreaElement = getElementByClassName( this.thumbnailElement, 'MouseArea' );
    this.aTransformSet = new Array( 3 );
    this.visibility = VISIBLE;
    this.isSelected = false;
    }
    
    Thumbnail.prototype.sNormalBorderColor = 'rgb(216,216,216)';
    Thumbnail.prototype.sSelectionBorderColor = 'rgb(92,92,255)';
    
    Thumbnail.prototype.removeElement = function()
    {
    if( this.thumbnailElement )
    this.container.pageElement.removeChild( this.thumbnailElement );
    };
    
    Thumbnail.prototype.show = function()
    {
    if( this.visibility == HIDDEN )
    {
    this.thumbnailElement.setAttribute( 'display', 'inherit' );
    this.visibility = VISIBLE;
    }
    };
    
    Thumbnail.prototype.hide = function()
    {
    if( this.visibility == VISIBLE )
    {
    this.thumbnailElement.setAttribute( 'display', 'none' );
    this.visibility = HIDDEN;
    }
    };
    
    Thumbnail.prototype.select = function()
    {
    if( !this.isSelected )
    {
    this.borderElement.setAttribute( 'stroke', this.sSelectionBorderColor );
    this.isSelected = true;
    }
    };
    
    Thumbnail.prototype.unselect = function()
    {
    if( this.isSelected )
    {
    this.borderElement.setAttribute( 'stroke', this.sNormalBorderColor );
    this.isSelected = false;
    }
    };
    
    Thumbnail.prototype.updateView = function()
    {
    this.column = this.index % this.container.indexColumns;
    this.row = ( this.index - this.column ) / this.container.indexColumns;
    this.halfBorderWidth = this.container.halfBorderWidth;
    this.borderWidth = this.container.borderWidth;
    this.width = ( WIDTH + this.borderWidth ) * this.container.scaleFactor;
    this.height = ( HEIGHT + this.borderWidth ) * this.container.scaleFactor;
    this.aTransformSet[2] = 'translate(' + this.halfBorderWidth + ' ' + this.halfBorderWidth + ')';
    this.aTransformSet[1] = 'scale(' + this.container.scaleFactor + ')';
    var sTransformAttrValue = this.computeTransform();
    this.thumbnailElement.setAttribute( 'transform', sTransformAttrValue );
    this.mouseAreaElement.setAttribute( 'onmouseover', 'theSlideIndexPage.aThumbnailSet[' + this.index  + '].onMouseOver()' );
    };
    
    Thumbnail.prototype.update = function( nIndex )
    {
    if( this.slideIndex == nIndex )  return;
    
    var aMetaSlide = theMetaDoc.aMetaSlideSet[nIndex];
    aMetaSlide.updateMasterPageView();
    setNSAttribute( 'xlink', this.slideElement, 'href', '#' + aMetaSlide.slideId );
    this.slideIndex = nIndex;
    };
    
    Thumbnail.prototype.clear = function( )
    {
    setNSAttribute( 'xlink', this.slideElement, 'href', '' );
    };
    
    Thumbnail.prototype.createThumbnailElement = function()
    {
    var aThumbnailElement = document.createElementNS( NSS['svg'], 'g' );
    aThumbnailElement.setAttribute( 'id', this.thumbnailId );
    aThumbnailElement.setAttribute( 'display', 'inherit' );
    
    var aSlideElement = document.createElementNS( NSS['svg'], 'use' );
    setNSAttribute( 'xlink', aSlideElement, 'href', '' );
    aSlideElement.setAttribute( 'class', 'Slide' );
    aThumbnailElement.appendChild( aSlideElement );
    
    var aMouseAreaElement = document.createElementNS( NSS['svg'], 'use' );
    setNSAttribute( 'xlink', aMouseAreaElement, 'href', '#' + this.container.thumbnailMouseAreaTemplateId );
    aMouseAreaElement.setAttribute( 'class', 'MouseArea' );
    aMouseAreaElement.setAttribute( 'opacity', 0.0 );
    aThumbnailElement.appendChild( aMouseAreaElement );
    
    var aBorderElement = document.createElementNS( NSS['svg'], 'use' );
    setNSAttribute( 'xlink', aBorderElement, 'href', '#' + this.container.thumbnailBorderTemplateId );
    aBorderElement.setAttribute( 'stroke', this.sNormalBorderColor );
    aBorderElement.setAttribute( 'class', 'Border' );
    aThumbnailElement.appendChild( aBorderElement );
    
    this.container.pageElement.appendChild( aThumbnailElement );
    return( document.getElementById( this.thumbnailId ) );
    };
    
    Thumbnail.prototype.computeTransform = function()
    {
    var nXSpacing = this.container.xSpacing;
    var nYSpacing = this.container.ySpacing;
    
    var nXOffset = nXSpacing + ( this.width + nXSpacing ) * this.column;
    var nYOffset = nYSpacing + ( this.height + nYSpacing ) * this.row;
    
    this.aTransformSet[0] = 'translate(' + nXOffset + ' ' + nYOffset + ')';
    
    var sTransform = this.aTransformSet.join( ' ' );
    
    return sTransform;
    };
    
    Thumbnail.prototype.onMouseOver = function()
    {
    if( ( currentMode == INDEX_MODE ) && ( this.container.curThumbnailIndex !=  this.index ) )
    {
    this.container.setSelection( this.index );
    }
    };
    
    
    function init()
    {
    var VIEWBOX = ROOT_NODE.getAttribute('viewBox');
    
    if( VIEWBOX )
    {
    WIDTH = ROOT_NODE.viewBox.animVal.width;
    HEIGHT = ROOT_NODE.viewBox.animVal.height;
    }
    
    aSlideShow = new SlideShow();
    theMetaDoc =  new MetaDocument();
    aSlideShow.bIsEnabled = theMetaDoc.bIsAnimated;
    theSlideIndexPage = new SlideIndexPage();
    aSlideShow.displaySlide( theMetaDoc.nStartSlideNumber, false );
    
    var hammer = new Hammer(ROOT_NODE);
    hammer.on('swipeleft', function() {
    switchSlide(1, false);
    });
    hammer.on('swiperight', function() {
    switchSlide(-1, false);
    });
    hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
    hammer.on('swipeup', function() {
    aSlideShow.exitSlideShowInApp();
    });
    hammer.on('swipedown', function() {
    aSlideShow.exitSlideShowInApp();
    });
    }
    
    function presentationEngineStop(message)
    {
    alert( message + '\nThe presentation engine will be stopped' );
    document.onkeydown = null;
    document.onkeypress = null;
    document.onclick = null;
    window.onmousewheel = null;
    }
    
    function assert( condition, message )
    {
    if (!condition)
    {
    presentationEngineStop( message );
    if (typeof console == 'object')
    console.trace();
    throw new Error( message );
    }
    }
    
    function dispatchEffects(dir)
    {
    
    if( dir == 1 )
    {
    var bRet = aSlideShow.nextEffect();
    
    if( !bRet )
    {
    switchSlide( 1, false );
    }
    }
    else
    {
    switchSlide( dir, false );
    }
    }
    
    function skipAllEffects()
    {
    var bRet = aSlideShow.skipAllEffects();
    if( !bRet )
    {
    switchSlide( 1, true );
    }
    }
    
    function skipEffects(dir)
    {
    if( dir == 1 )
    {
    var bRet = aSlideShow.skipPlayingOrNextEffect();
    
    if( !bRet )
    {
    switchSlide( 1, true );
    }
    }
    else
    {
    switchSlide( dir, true );
    }
    }
    
    function switchSlide( nOffset, bSkipTransition )
    {
    var nNextSlide = nCurSlide + nOffset;
    aSlideShow.displaySlide( nNextSlide, bSkipTransition );
    }
    
    function displayIndex( offsetNumber )
    {
    var aMetaSlideSet = theMetaDoc.aMetaSlideSet;
    offsetNumber = getSafeIndex( offsetNumber, 0, aMetaSlideSet.length - 1 );
    
    var nTotalThumbnails = theSlideIndexPage.getTotalThumbnails();
    var nEnd = Math.min( offsetNumber + nTotalThumbnails, aMetaSlideSet.length);
    
    var aThumbnailSet = theSlideIndexPage.aThumbnailSet;
    var j = 0;
    for( var i = offsetNumber; i < nEnd; ++i, ++j )
    {
    aThumbnailSet[j].update( i );
    aThumbnailSet[j].show();
    }
    for( ; j < nTotalThumbnails; ++j )
    {
    aThumbnailSet[j].hide();
    }
    
    if (INDEX_OFFSET != offsetNumber)
    INDEX_OFFSET = offsetNumber;
    }
    
    function toggleSlideIndex()
    {
    if( currentMode == SLIDE_MODE )
    {
    
    theMetaDoc.getCurrentSlide().hide();
    INDEX_OFFSET = -1;
    indexSetPageSlide( nCurSlide );
    theSlideIndexPage.show();
    currentMode = INDEX_MODE;
    }
    else if( currentMode == INDEX_MODE )
    {
    theSlideIndexPage.hide();
    var nNewSlide = theSlideIndexPage.selectedSlideIndex;
    
    aSlideShow.displaySlide( nNewSlide, true );
    currentMode = SLIDE_MODE;
    }
    }
    
    function abandonIndexMode()
    {
    theSlideIndexPage.selectedSlideIndex = nCurSlide;
    toggleSlideIndex();
    }
    
    
    var CURR_UNIQUE_ID = 0;
    
    function getUniqueId()
    {
    ++CURR_UNIQUE_ID;
    return CURR_UNIQUE_ID;
    }
    
    function mem_fn( sMethodName )
    {
    return  function( aObject )
    {
    var aMethod = aObject[ sMethodName ];
    if( aMethod )
    aMethod.call( aObject );
    else
    log( 'method sMethodName not found' );
    };
    }
    
    function bind( aObject, aMethod )
    {
    return  function()
    {
    return aMethod.call( aObject, arguments[0] );
    };
    }
    
    function bind2( aFunction )
    {
    if( !aFunction  )
    log( 'bind2: passed function is not valid.' );
    
    var aBoundArgList = arguments;
    
    var aResultFunction = null;
    
    switch( aBoundArgList.length )
    {
    case 1: aResultFunction = function()
    {
    return aFunction.call( arguments[0], arguments[1],
    arguments[2], arguments[3],
    arguments[4] );
    };
    break;
    case 2: aResultFunction = function()
    {
    return aFunction.call( aBoundArgList[1], arguments[0],
    arguments[1], arguments[2],
    arguments[3] );
    };
    break;
    case 3: aResultFunction = function()
    {
    return aFunction.call( aBoundArgList[1], aBoundArgList[2],
    arguments[0], arguments[1],
    arguments[2] );
    };
    break;
    case 4: aResultFunction = function()
    {
    return aFunction.call( aBoundArgList[1], aBoundArgList[2],
    aBoundArgList[3], arguments[0],
    arguments[1] );
    };
    break;
    case 5: aResultFunction = function()
    {
    return aFunction.call( aBoundArgList[1], aBoundArgList[2],
    aBoundArgList[3], aBoundArgList[4],
    arguments[0] );
    };
    break;
    default:
    log( 'bind2: arity not handled.' );
    }
    
    return aResultFunction;
    }
    
    function getCurrentSystemTime()
    {
    return ( new Date() ).getTime();
    }
    
    function getSlideAnimationsRoot( sSlideId )
    {
    return theMetaDoc.aSlideAnimationsMap[ sSlideId ];
    }
    
    function getElementChildren( aElement )
    {
    var aChildrenArray = [];
    
    var nSize = aElement.childNodes.length;
    
    for( var i = 0; i < nSize; ++i )
    {
    if( aElement.childNodes[i].nodeType == 1 )
    aChildrenArray.push( aElement.childNodes[i] );
    }
    
    return aChildrenArray;
    }
    
    function removeWhiteSpaces( str )
    {
    if( !str )
    return '';
    
    var re = / */;
    var aSplitString = str.split( re );
    return aSplitString.join('');
    }
    
    function clamp( nValue, nMinimum, nMaximum )
    {
    if( nValue < nMinimum )
    {
    return nMinimum;
    }
    else if( nValue > nMaximum )
    {
    return nMaximum;
    }
    else
    {
    return nValue;
    }
    }
    
    function makeMatrixString( a, b, c, d, e, f )
    {
    var s = 'matrix(';
    s += a + ', ';
    s += b + ', ';
    s += c + ', ';
    s += d + ', ';
    s += e + ', ';
    s += f + ')';
    
    return s;
    }
    
    function matrixToString( aSVGMatrix )
    {
    return makeMatrixString( aSVGMatrix.a, aSVGMatrix.b, aSVGMatrix.c,
    aSVGMatrix.d, aSVGMatrix.e, aSVGMatrix.f );
    }
    
    
    function numberParser( sValue )
    {
    if( sValue === '.' )
    return undefined;
    var reFloatNumber = /^[+-]?[0-9]*[.]?[0-9]*$/;
    
    if( reFloatNumber.test( sValue ) )
    return parseFloat( sValue );
    else
    return undefined;
    }
    
    function booleanParser( sValue )
    {
    sValue = sValue.toLowerCase();
    if( sValue === 'true' )
    return true;
    else if( sValue === 'false' )
    return false;
    else
    return undefined;
    }
    
    function colorParser( sValue )
    {
    
    function hsl( nHue, nSaturation, nLuminance )
    {
    return new HSLColor( nHue, nSaturation / 100, nLuminance / 100 );
    }
    
    function rgb( nRed, nGreen, nBlue )
    {
    return new RGBColor( nRed / 255, nGreen / 255, nBlue / 255 );
    }
    
    function prgb( nRed, nGreen, nBlue )
    {
    return new RGBColor( nRed / 100, nGreen / 100, nBlue / 100 );
    }
    
    var sCommaPattern = ' *[,] *';
    var sIntegerPattern = '[+-]?[0-9]+';
    var sHexDigitPattern = '[0-9A-Fa-f]';
    
    var sHexColorPattern = '#(' + sHexDigitPattern + '{2})('
    + sHexDigitPattern + '{2})('
    + sHexDigitPattern + '{2})';
    
    var sRGBIntegerPattern = 'rgb[(] *' + sIntegerPattern + sCommaPattern
    + sIntegerPattern + sCommaPattern
    + sIntegerPattern + ' *[)]';
    
    var sRGBPercentPattern = 'rgb[(] *' + sIntegerPattern + '%' + sCommaPattern
    + sIntegerPattern + '%' + sCommaPattern
    + sIntegerPattern + '%' + ' *[)]';
    
    var sHSLPercentPattern = 'hsl[(] *' + sIntegerPattern + sCommaPattern
    + sIntegerPattern + '%' + sCommaPattern
    + sIntegerPattern + '%' + ' *[)]';
    
    var reHexColor = new RegExp( sHexColorPattern );
    var reRGBInteger = new RegExp( sRGBIntegerPattern );
    var reRGBPercent = new RegExp( sRGBPercentPattern );
    var reHSLPercent = new RegExp( sHSLPercentPattern );
    
    if( reHexColor.test( sValue ) )
    {
    var aRGBTriple = reHexColor.exec( sValue );
    
    var nRed    = parseInt( aRGBTriple[1], 16 ) / 255;
    var nGreen  = parseInt( aRGBTriple[2], 16 ) / 255;
    var nBlue   = parseInt( aRGBTriple[3], 16 ) / 255;
    
    return new RGBColor( nRed, nGreen, nBlue );
    }
    else if( reHSLPercent.test( sValue ) )
    {
    sValue = sValue.replace( '%', '' ).replace( '%', '' );
    return eval( sValue );
    }
    else if( reRGBInteger.test( sValue ) )
    {
    return eval( sValue );
    }
    else if( reRGBPercent.test( sValue ) )
    {
    sValue = 'p' + sValue.replace( '%', '' ).replace( '%', '' ).replace( '%', '' );
    return eval( sValue );
    }
    else
    {
    return null;
    }
    }
    
    
    function RGBColor( nRed, nGreen, nBlue )
    {
    this.eColorSpace = COLOR_SPACE_RGB;
    this.nRed = nRed;
    this.nGreen = nGreen;
    this.nBlue = nBlue;
    }
    
    
    RGBColor.prototype.clone = function()
    {
    return new RGBColor( this.nRed, this.nGreen, this.nBlue );
    };
    
    RGBColor.prototype.equal = function( aRGBColor )
    {
    return ( this.nRed == aRGBColor.nRed ) &&
    ( this.nGreen == aRGBColor.nGreen ) &&
    ( this.nBlue == aRGBColor.nBlue );
    };
    
    RGBColor.prototype.add = function( aRGBColor )
    {
    this.nRed += aRGBColor.nRed;
    this.nGreen += aRGBColor.nGreen;
    this.nBlue += aRGBColor.nBlue;
    return this;
    };
    
    RGBColor.prototype.scale = function( aT )
    {
    this.nRed *= aT;
    this.nGreen *= aT;
    this.nBlue *= aT;
    return this;
    };
    
    RGBColor.clamp = function( aRGBColor )
    {
    var aClampedRGBColor = new RGBColor( 0, 0, 0 );
    
    aClampedRGBColor.nRed   = clamp( aRGBColor.nRed, 0.0, 1.0 );
    aClampedRGBColor.nGreen = clamp( aRGBColor.nGreen, 0.0, 1.0 );
    aClampedRGBColor.nBlue  = clamp( aRGBColor.nBlue, 0.0, 1.0 );
    
    return aClampedRGBColor;
    };
    
    RGBColor.prototype.convertToHSL = function()
    {
    var nRed   = clamp( this.nRed, 0.0, 1.0 );
    var nGreen = clamp( this.nGreen, 0.0, 1.0 );
    var nBlue  = clamp( this.nBlue, 0.0, 1.0 );
    
    var nMax = Math.max( nRed, nGreen, nBlue );
    var nMin = Math.min( nRed, nGreen, nBlue );
    var nDelta = nMax - nMin;
    
    var nLuminance  = ( nMax + nMin ) / 2.0;
    var nSaturation = 0.0;
    var nHue = 0.0;
    if( nDelta !== 0 )
    {
    nSaturation = ( nLuminance > 0.5 ) ?
    ( nDelta / ( 2.0 - nMax - nMin) ) :
    ( nDelta / ( nMax + nMin ) );
    
    if( nRed == nMax )
    nHue = ( nGreen - nBlue ) / nDelta;
    else if( nGreen == nMax )
    nHue = 2.0 + ( nBlue - nRed ) / nDelta;
    else if( nBlue == nMax )
    nHue = 4.0 + ( nRed - nGreen ) / nDelta;
    
    nHue *= 60.0;
    
    if( nHue < 0.0 )
    nHue += 360.0;
    }
    
    return new HSLColor( nHue, nSaturation, nLuminance );
    
    };
    
    RGBColor.prototype.toString = function( bClamped )
    {
    var aRGBColor;
    if( bClamped )
    {
    aRGBColor = RGBColor.clamp( this );
    }
    else
    {
    aRGBColor = this;
    }
    
    var nRed = Math.round( aRGBColor.nRed * 255 );
    var nGreen = Math.round( aRGBColor.nGreen * 255 );
    var nBlue = Math.round( aRGBColor.nBlue * 255 );
    
    return ( 'rgb(' + nRed + ',' + nGreen + ',' + nBlue + ')' );
    };
    
    RGBColor.interpolate = function( aStartRGB , aEndRGB, nT )
    {
    var aResult = aStartRGB.clone();
    var aTEndRGB = aEndRGB.clone();
    aResult.scale( 1.0 - nT );
    aTEndRGB.scale( nT );
    aResult.add( aTEndRGB );
    
    return aResult;
    };
    
    
    function HSLColor( nHue, nSaturation, nLuminance )
    {
    this.eColorSpace = COLOR_SPACE_HSL;
    this.nHue = nHue;
    this.nSaturation = nSaturation;
    this.nLuminance = nLuminance;
    
    this.normalizeHue();
    }
    
    
    HSLColor.prototype.clone = function()
    {
    return new HSLColor( this.nHue, this.nSaturation, this.nLuminance );
    };
    
    HSLColor.prototype.equal = function( aHSLColor )
    {
    return ( this.nHue == aHSLColor.nHue ) &&
    ( this.nSaturation += aHSLColor.nSaturation ) &&
    ( this.nLuminance += aHSLColor.nLuminance );
    };
    
    HSLColor.prototype.add = function( aHSLColor )
    {
    this.nHue += aHSLColor.nHue;
    this.nSaturation += aHSLColor.nSaturation;
    this.nLuminance += aHSLColor.nLuminance;
    this.normalizeHue();
    return this;
    };
    
    HSLColor.prototype.scale = function( aT )
    {
    this.nHue *= aT;
    this.nSaturation *= aT;
    this.nLuminance *= aT;
    this.normalizeHue();
    return this;
    };
    
    HSLColor.clamp = function( aHSLColor )
    {
    var aClampedHSLColor = new HSLColor( 0, 0, 0 );
    
    aClampedHSLColor.nHue = aHSLColor.nHue % 360;
    if( aClampedHSLColor.nHue < 0 )
    aClampedHSLColor.nHue += 360;
    aClampedHSLColor.nSaturation = clamp( aHSLColor.nSaturation, 0.0, 1.0 );
    aClampedHSLColor.nLuminance = clamp( aHSLColor.nLuminance, 0.0, 1.0 );
    };
    
    HSLColor.prototype.normalizeHue = function()
    {
    this.nHue = this.nHue % 360;
    if( this.nHue < 0 ) this.nHue += 360;
    };
    
    HSLColor.prototype.toString = function()
    {
    return 'hsl(' + this.nHue.toFixed( 3 ) + ','
    + this.nSaturation.toFixed( 3 ) + ','
    + this.nLuminance.toFixed( 3 ) + ')';
    };
    
    HSLColor.prototype.convertToRGB = function()
    {
    
    var nHue = this.nHue % 360;
    if( nHue < 0 ) nHue += 360;
    var nSaturation =  clamp( this.nSaturation, 0.0, 1.0 );
    var nLuminance = clamp( this.nLuminance, 0.0, 1.0 );
    
    
    if( nSaturation === 0 )
    {
    return new RGBColor( nLuminance, nLuminance, nLuminance );
    }
    
    var nVal1 = ( nLuminance <= 0.5 ) ?
    ( nLuminance * (1.0 + nSaturation) ) :
    ( nLuminance + nSaturation - nLuminance * nSaturation );
    
    var nVal2 = 2.0 * nLuminance - nVal1;
    
    var nRed    = HSLColor.hsl2rgbHelper( nVal2, nVal1, nHue + 120 );
    var nGreen  = HSLColor.hsl2rgbHelper( nVal2, nVal1, nHue );
    var nBlue   = HSLColor.hsl2rgbHelper( nVal2, nVal1, nHue - 120 );
    
    return new RGBColor( nRed, nGreen, nBlue );
    };
    
    HSLColor.hsl2rgbHelper = function( nValue1, nValue2, nHue )
    {
    nHue = nHue % 360;
    if( nHue < 0 )
    nHue += 360;
    
    if( nHue < 60.0 )
    return nValue1 + ( nValue2 - nValue1 ) * nHue / 60.0;
    else if( nHue < 180.0 )
    return nValue2;
    else if( nHue < 240.0 )
    return ( nValue1 + ( nValue2 - nValue1 ) * ( 240.0 - nHue ) / 60.0 );
    else
    return nValue1;
    };
    
    HSLColor.interpolate = function( aFrom, aTo, nT, bCCW )
    {
    var nS = 1.0 - nT;
    
    var nHue = 0.0;
    if( aFrom.nHue <= aTo.nHue && !bCCW )
    {
    nHue = nS * (aFrom.nHue + 360.0) + nT * aTo.nHue;
    }
    else if( aFrom.nHue > aTo.nHue && bCCW )
    {
    nHue = nS * aFrom.nHue + nT * (aTo.nHue + 360.0);
    }
    else
    {
    nHue = nS * aFrom.nHue + nT * aTo.nHue;
    }
    
    var nSaturation = nS * aFrom.nSaturation + nT * aTo.nSaturation;
    var nLuminance = nS * aFrom.nLuminance + nT * aTo.nLuminance;
    
    return new HSLColor( nHue, nSaturation, nLuminance );
    };
    
    
    var SVGIdentityMatrix = document.documentElement.createSVGMatrix();
    
    SVGMatrix.prototype.setToIdentity = function()
    {
    this.a = this.d = 1;
    this.b = this.c = this.d = this.e = 0;
    };
    
    SVGMatrix.prototype.setToRotationAroundPoint = function( nX, nY, nAngle )
    {
    nAngle = Math.PI * nAngle / 180;
    var nSin = Math.sin( nAngle );
    var nCos = Math.cos( nAngle );
    
    this.a = nCos; this.c = -nSin; this.e = nX * (1 - nCos) + nY * nSin;
    this.b = nSin; this.d =  nCos; this.f = nY * (1 - nCos) - nX * nSin;
    };
    
    
    SVGPathElement.prototype.prependPath = function( aPath )
    {
    var sPathData = aPath.getAttribute( 'd' );
    sPathData += ( ' ' + this.getAttribute( 'd' ) );
    this.setAttribute( 'd', sPathData );
    };
    
    SVGPathElement.prototype.appendPath = function( aPath )
    {
    var sPathData = this.getAttribute( 'd' );
    sPathData += ( ' ' + aPath.getAttribute( 'd' ) );
    this.setAttribute( 'd', sPathData );
    };
    
    function flipOnYAxis( aPath )
    {
    var aPolyPath = aPath.cloneNode(true);
    var aTransform = document.documentElement.createSVGMatrix();
    aTransform.a = -1;
    aTransform.e = 1;
    aPolyPath.matrixTransform(aTransform);
    return aPolyPath;
    }
    
    function flipOnXAxis( aPath )
    {
    var aPolyPath = aPath.cloneNode(true);
    var aTransform = document.documentElement.createSVGMatrix();
    aTransform.d = -1;
    aTransform.f = 1;
    aPolyPath.matrixTransform(aTransform);
    return aPolyPath;
    }
    
    SVGPathElement.prototype.matrixTransform = function( aSVGMatrix )
    {
    if( SVGPathSegList.prototype.matrixTransform )
    {
    this.pathSegList.matrixTransform( aSVGMatrix );
    return;
    }
    
    var aPathSegList = this.pathSegList;
    var nLength = aPathSegList.numberOfItems;
    var i;
    for( i = 0; i < nLength; ++i )
    {
    aPathSegList.getItem( i ).matrixTransform( aSVGMatrix );
    }
    };
    
    SVGPathElement.prototype.changeOrientation = function()
    {
    var aPathSegList = this.pathSegList;
    var nLength = aPathSegList.numberOfItems;
    if( nLength == 0 ) return;
    
    if( SVGPathSegList.prototype.changeOrientation )
    {
    aPathSegList.changeOrientation();
    return;
    }
    
    var nCurrentX = 0;
    var nCurrentY = 0;
    
    var aPathSeg = aPathSegList.getItem( 0 );
    if( aPathSeg.pathSegTypeAsLetter == 'M' )
    {
    nCurrentX = aPathSeg.x;
    nCurrentY = aPathSeg.y;
    aPathSegList.removeItem( 0 );
    --nLength;
    }
    
    var i;
    for( i = 0; i < nLength; ++i )
    {
    aPathSeg = aPathSegList.getItem( i );
    var aPoint = aPathSeg.changeOrientation( nCurrentX, nCurrentY );
    nCurrentX = aPoint.x;
    nCurrentY = aPoint.y;
    }
    
    
    for( i = nLength - 2; i >= 0; --i )
    {
    aPathSeg = aPathSegList.removeItem( i );
    aPathSegList.appendItem( aPathSeg );
    }
    
    var aMovePathSeg = this.createSVGPathSegMovetoAbs( nCurrentX, nCurrentY );
    aPathSegList.insertItemBefore( aMovePathSeg, 0 );
    
    };
    
    
    try
    {   // Firefox, Google Chrome, Internet Explorer, Safari.
    
    SVGPathSegMovetoAbs.prototype.matrixTransform = function( aSVGMatrix )
    {
    SVGPathMatrixTransform( this, aSVGMatrix );
    };
    
    SVGPathSegLinetoAbs.prototype.matrixTransform = function( aSVGMatrix )
    {
    SVGPathMatrixTransform( this, aSVGMatrix );
    };
    
    SVGPathSegCurvetoQuadraticAbs.prototype.matrixTransform = function( aSVGMatrix )
    {
    SVGPathMatrixTransform( this, aSVGMatrix );
    var nX = this.x1;
    this.x1 = aSVGMatrix.a * nX + aSVGMatrix.c * this.y1 + aSVGMatrix.e;
    this.y1 = aSVGMatrix.b * nX + aSVGMatrix.d * this.y1 + aSVGMatrix.f;
    };
    
    SVGPathSegCurvetoCubicAbs.prototype.matrixTransform = function( aSVGMatrix )
    {
    SVGPathMatrixTransform( this, aSVGMatrix );
    var nX = this.x1;
    this.x1 = aSVGMatrix.a * nX + aSVGMatrix.c * this.y1 + aSVGMatrix.e;
    this.y1 = aSVGMatrix.b * nX + aSVGMatrix.d * this.y1 + aSVGMatrix.f;
    nX = this.x2;
    this.x2 = aSVGMatrix.a * nX + aSVGMatrix.c * this.y2 + aSVGMatrix.e;
    this.y2 = aSVGMatrix.b * nX + aSVGMatrix.d * this.y2 + aSVGMatrix.f;
    };
    
    
    SVGPathSegMovetoAbs.prototype.changeOrientation = function( nCurrentX, nCurrentY )
    {
    var aPoint = { x: this.x, y: this.y };
    this.x = nCurrentX;
    this.y = nCurrentY;
    return aPoint;
    };
    
    SVGPathSegLinetoAbs.prototype.changeOrientation = function( nCurrentX, nCurrentY )
    {
    var aPoint = { x: this.x, y: this.y };
    this.x = nCurrentX;
    this.y = nCurrentY;
    return aPoint;
    };
    
    SVGPathSegCurvetoQuadraticAbs.prototype.changeOrientation = function( nCurrentX, nCurrentY )
    {
    var aPoint = { x: this.x, y: this.y };
    this.x = nCurrentX;
    this.y = nCurrentY;
    return aPoint;
    };
    
    SVGPathSegCurvetoCubicAbs.prototype.changeOrientation = function( nCurrentX, nCurrentY )
    {
    var aPoint = { x: this.x, y: this.y };
    this.x = nCurrentX;
    this.y = nCurrentY;
    var nX = this.x1;
    this.x1 = this.x2;
    this.x2 = nX;
    var nY = this.y1;
    this.y1 = this.y2;
    this.y2 = nY;
    return aPoint;
    };
    
    }
    catch( e )
    {   // Opera
    
    if( e.name == 'ReferenceError' )
    {
    SVGPathSeg.prototype.matrixTransform = function( aSVGMatrix )
    {
    var nX;
    switch( this.pathSegTypeAsLetter )
    {
    case 'C':
    nX = this.x2;
    this.x2 = aSVGMatrix.a * nX + aSVGMatrix.c * this.y2 + aSVGMatrix.e;
    this.y2 = aSVGMatrix.b * nX + aSVGMatrix.d * this.y2 + aSVGMatrix.f;
    case 'Q':
    nX = this.x1;
    this.x1 = aSVGMatrix.a * nX + aSVGMatrix.c * this.y1 + aSVGMatrix.e;
    this.y1 = aSVGMatrix.b * nX + aSVGMatrix.d * this.y1 + aSVGMatrix.f;
    case 'M':
    case 'L':
    SVGPathMatrixTransform( this, aSVGMatrix );
    break;
    default:
    log( 'SVGPathSeg.matrixTransform: unexpected path segment type: '
    + this.pathSegTypeAsLetter );
    }
    };
    
    SVGPathSeg.prototype.changeOrientation = function( nCurrentX, nCurrentY )
    {
    switch( this.pathSegTypeAsLetter )
    {
    case 'C':
    var nX = this.x1;
    this.x1 = this.x2;
    this.x2 = nX;
    var nY = this.y1;
    this.y1 = this.y2;
    this.y2 = nY;
    case 'M':
    case 'L':
    case 'Q':
    var aPoint = { x: this.x, y: this.y };
    this.x = nCurrentX;
    this.y = nCurrentY;
    return aPoint;
    default:
    log( 'SVGPathSeg.changeOrientation: unexpected path segment type: '
    + this.pathSegTypeAsLetter );
    return null;
    }
    }
    }
    else throw e;
    }
    
    function SVGPathMatrixTransform( aPath, aSVGMatrix )
    {
    var nX = aPath.x;
    aPath.x = aSVGMatrix.a * nX + aSVGMatrix.c * aPath.y + aSVGMatrix.e;
    aPath.y = aSVGMatrix.b * nX + aSVGMatrix.d * aPath.y + aSVGMatrix.f;
    }
    
    
    function PriorityQueue( aCompareFunc )
    {
    this.aSequence = [];
    this.aCompareFunc = aCompareFunc;
    }
    
    PriorityQueue.prototype.clone = function()
    {
    var aCopy = new PriorityQueue( this.aCompareFunc );
    var src = this.aSequence;
    var dest = [];
    var i, l;
    for( i = 0, l = src.length; i < l; ++i )
    {
    if( i in src )
    {
    dest.push( src[i] );
    }
    }
    aCopy.aSequence = dest;
    return aCopy;
    };
    
    PriorityQueue.prototype.top = function()
    {
    return this.aSequence[this.aSequence.length - 1];
    };
    
    PriorityQueue.prototype.isEmpty = function()
    {
    return ( this.aSequence.length === 0 );
    };
    
    PriorityQueue.prototype.push = function( aValue )
    {
    this.aSequence.unshift( aValue );
    this.aSequence.sort(this.aCompareFunc);
    };
    
    PriorityQueue.prototype.clear = function()
    {
    this.aSequence = [];
    };
    
    PriorityQueue.prototype.pop = function()
    {
    return this.aSequence.pop();
    };
    
    
    var ANIMATION_NODE_CUSTOM               = 0;
    var ANIMATION_NODE_PAR                  = 1;
    var ANIMATION_NODE_SEQ                  = 2;
    var ANIMATION_NODE_ITERATE              = 3;
    var ANIMATION_NODE_ANIMATE              = 4;
    var ANIMATION_NODE_SET                  = 5;
    var ANIMATION_NODE_ANIMATEMOTION        = 6;
    var ANIMATION_NODE_ANIMATECOLOR         = 7;
    var ANIMATION_NODE_ANIMATETRANSFORM     = 8;
    var ANIMATION_NODE_TRANSITIONFILTER     = 9;
    var ANIMATION_NODE_AUDIO                = 10;
    var ANIMATION_NODE_COMMAND              = 11;
    
    var aAnimationNodeTypeInMap = {
    'par'               : ANIMATION_NODE_PAR,
    'seq'               : ANIMATION_NODE_SEQ,
    'iterate'           : ANIMATION_NODE_ITERATE,
    'animate'           : ANIMATION_NODE_ANIMATE,
    'set'               : ANIMATION_NODE_SET,
    'animatemotion'     : ANIMATION_NODE_ANIMATEMOTION,
    'animatecolor'      : ANIMATION_NODE_ANIMATECOLOR,
    'animatetransform'  : ANIMATION_NODE_ANIMATETRANSFORM,
    'transitionfilter'  : ANIMATION_NODE_TRANSITIONFILTER,
    'audio'             : ANIMATION_NODE_AUDIO,
    'command'           : ANIMATION_NODE_COMMAND
    };
    
    
    function getAnimationElementType( aElement )
    {
    var sName = aElement.localName.toLowerCase();
    
    if( sName && aAnimationNodeTypeInMap[ sName ] )
    return aAnimationNodeTypeInMap[ sName ];
    else
    return ANIMATION_NODE_CUSTOM;
    }
    
    
    var INVALID_NODE                = 0;
    var UNRESOLVED_NODE             = 1;
    var RESOLVED_NODE               = 2;
    var ACTIVE_NODE                 = 4;
    var FROZEN_NODE                 = 8;
    var ENDED_NODE                  = 16;
    
    function getNodeStateName( eNodeState )
    {
    switch( eNodeState )
    {
    case INVALID_NODE:
    return 'INVALID';
    case UNRESOLVED_NODE:
    return 'UNRESOLVED';
    case RESOLVED_NODE:
    return 'RESOLVED';
    case ACTIVE_NODE:
    return 'ACTIVE';
    case FROZEN_NODE:
    return 'FROZEN';
    case ENDED_NODE:
    return 'ENDED';
    default:
    return 'UNKNOWN';
    }
    }
    
    
    var IMPRESS_DEFAULT_NODE                    = 0;
    var IMPRESS_ON_CLICK_NODE                   = 1;
    var IMPRESS_WITH_PREVIOUS_NODE              = 2;
    var IMPRESS_AFTER_PREVIOUS_NODE             = 3;
    var IMPRESS_MAIN_SEQUENCE_NODE              = 4;
    var IMPRESS_TIMING_ROOT_NODE                = 5;
    var IMPRESS_INTERACTIVE_SEQUENCE_NODE       = 6;
    
    var aImpressNodeTypeInMap = {
    'on-click'                  : IMPRESS_ON_CLICK_NODE,
    'with-previous'             : IMPRESS_WITH_PREVIOUS_NODE,
    'after-previous'            : IMPRESS_AFTER_PREVIOUS_NODE,
    'main-sequence'             : IMPRESS_MAIN_SEQUENCE_NODE,
    'timing-root'               : IMPRESS_TIMING_ROOT_NODE,
    'interactive-sequence'      : IMPRESS_INTERACTIVE_SEQUENCE_NODE
    };
    
    var aImpressNodeTypeOutMap = [ 'default', 'on-click', 'with-previous', 'after-previous',
    'main-sequence', 'timing-root', 'interactive-sequence' ];
    
    
    var aPresetClassInMap = {};
    
    
    var aPresetIdInMap = {};
    
    
    var RESTART_MODE_DEFAULT            = 0;
    var RESTART_MODE_INHERIT            = 0; // eslint-disable-line no-unused-vars
    var RESTART_MODE_ALWAYS             = 1;
    var RESTART_MODE_WHEN_NOT_ACTIVE    = 2;
    var RESTART_MODE_NEVER              = 3;
    
    var aRestartModeInMap = {
    'inherit'       : RESTART_MODE_DEFAULT,
    'always'        : RESTART_MODE_ALWAYS,
    'whenNotActive' : RESTART_MODE_WHEN_NOT_ACTIVE,
    'never'         : RESTART_MODE_NEVER
    };
    
    var aRestartModeOutMap = [ 'inherit','always', 'whenNotActive', 'never' ];
    
    
    var FILL_MODE_DEFAULT           = 0;
    var FILL_MODE_INHERIT           = 0; // eslint-disable-line no-unused-vars
    var FILL_MODE_REMOVE            = 1;
    var FILL_MODE_FREEZE            = 2;
    var FILL_MODE_HOLD              = 3;
    var FILL_MODE_TRANSITION        = 4;
    var FILL_MODE_AUTO              = 5;
    
    var aFillModeInMap = {
    'inherit'       : FILL_MODE_DEFAULT,
    'remove'        : FILL_MODE_REMOVE,
    'freeze'        : FILL_MODE_FREEZE,
    'hold'          : FILL_MODE_HOLD,
    'transition'    : FILL_MODE_TRANSITION,
    'auto'          : FILL_MODE_AUTO
    };
    
    var aFillModeOutMap = [ 'inherit', 'remove', 'freeze', 'hold', 'transition', 'auto' ];
    
    
    var ADDITIVE_MODE_UNKNOWN       = 0; // eslint-disable-line no-unused-vars
    var ADDITIVE_MODE_BASE          = 1;
    var ADDITIVE_MODE_SUM           = 2;
    var ADDITIVE_MODE_REPLACE       = 3;
    var ADDITIVE_MODE_MULTIPLY      = 4;
    var ADDITIVE_MODE_NONE          = 5;
    
    var aAddittiveModeInMap = {
    'base'          : ADDITIVE_MODE_BASE,
    'sum'           : ADDITIVE_MODE_SUM,
    'replace'       : ADDITIVE_MODE_REPLACE,
    'multiply'      : ADDITIVE_MODE_MULTIPLY,
    'none'          : ADDITIVE_MODE_NONE
    };
    
    var aAddittiveModeOutMap = [ 'unknown', 'base', 'sum', 'replace', 'multiply', 'none' ];
    
    
    var ACCUMULATE_MODE_NONE        = 0;
    var ACCUMULATE_MODE_SUM         = 1;
    
    var aAccumulateModeOutMap = [ 'none', 'sum' ];
    
    var CALC_MODE_DISCRETE          = 1;
    var CALC_MODE_LINEAR            = 2;
    var CALC_MODE_PACED             = 3;
    var CALC_MODE_SPLINE            = 4;
    
    var aCalcModeInMap = {
    'discrete'      : CALC_MODE_DISCRETE,
    'linear'        : CALC_MODE_LINEAR,
    'paced'         : CALC_MODE_PACED,
    'spline'        : CALC_MODE_SPLINE
    };
    
    var aCalcModeOutMap = [ 'unknown', 'discrete', 'linear', 'paced', 'spline' ];
    
    
    var COLOR_SPACE_RGB = 0;
    var COLOR_SPACE_HSL = 1;
    
    var aColorSpaceInMap = { 'rgb': COLOR_SPACE_RGB, 'hsl': COLOR_SPACE_HSL };
    
    var aColorSpaceOutMap = [ 'rgb', 'hsl' ];
    
    
    var CLOCKWISE               = 0;
    var COUNTERCLOCKWISE        = 1;
    
    var aClockDirectionInMap = { 'clockwise': CLOCKWISE, 'counter-clockwise': COUNTERCLOCKWISE };
    
    var aClockDirectionOutMap = [ 'clockwise', 'counter-clockwise' ];
    
    
    var UNKNOWN_PROPERTY        = 0; // eslint-disable-line no-unused-vars
    var NUMBER_PROPERTY         = 1;
    var ENUM_PROPERTY           = 2;
    var COLOR_PROPERTY          = 3;
    var STRING_PROPERTY         = 4;
    var BOOL_PROPERTY           = 5;
    
    var aValueTypeOutMap = [ 'unknown', 'number', 'enum', 'color', 'string', 'boolean' ];
    
    
    var aAttributeMap =
    {
    'height':           {   'type':         NUMBER_PROPERTY,
    'get':          'getHeight',
    'set':          'setHeight',
    'getmod':       'makeScaler( 1/nHeight )',
    'setmod':       'makeScaler( nHeight)'          },
    
    'opacity':          {   'type':         NUMBER_PROPERTY,
    'get':          'getOpacity',
    'set':          'setOpacity'                    },
    
    'rotate':           {   'type':         NUMBER_PROPERTY,
    'get':          'getRotationAngle',
    'set':          'setRotationAngle'              },
    
    'width':            {   'type':         NUMBER_PROPERTY,
    'get':          'getWidth',
    'set':          'setWidth',
    'getmod':       'makeScaler( 1/nWidth )',
    'setmod':       'makeScaler( nWidth)'           },
    
    'x':                {   'type':         NUMBER_PROPERTY,
    'get':          'getX',
    'set':          'setX',
    'getmod':       'makeScaler( 1/nWidth )',
    'setmod':       'makeScaler( nWidth)'           },
    
    'y':                {   'type':         NUMBER_PROPERTY,
    'get':          'getY',
    'set':          'setY',
    'getmod':       'makeScaler( 1/nHeight )',
    'setmod':       'makeScaler( nHeight)'          },
    
    'fill':             {   'type':         ENUM_PROPERTY,
    'get':          'getFillStyle',
    'set':          'setFillStyle'                  },
    
    'stroke':           {   'type':         ENUM_PROPERTY,
    'get':          'getStrokeStyle',
    'set':          'setStrokeStyle'                },
    
    'visibility':       {   'type':         ENUM_PROPERTY,
    'get':          'getVisibility',
    'set':          'setVisibility'                 },
    
    'fill-color':       {   'type':         COLOR_PROPERTY,
    'get':          'getFillColor',
    'set':          'setFillColor'                  },
    
    'stroke-color':     {   'type':         COLOR_PROPERTY,
    'get':          'getStrokeColor',
    'set':          'setStrokeColor'                },
    
    'color':            {   'type':         COLOR_PROPERTY,
    'get':          'getFontColor',
    'set':          'setFontColor'                  }
    
    };
    
    
    var TRANSITION_INVALID              = 0;    // Invalid type
    var TRANSITION_CLIP_POLYPOLYGON     = 1;    // Transition expressed by parametric clip polygon
    var TRANSITION_SPECIAL              = 2;    // Transition expressed by hand-crafted function
    
    
    var BARWIPE_TRANSITION              = 1;
    var BOXWIPE_TRANSITION              = 2;
    var FOURBOXWIPE_TRANSITION          = 3;
    var ELLIPSEWIPE_TRANSITION          = 4; // 17
    var CLOCKWIPE_TRANSITION            = 5; // 22
    var PINWHEELWIPE_TRANSITION         = 6; // 23
    var PUSHWIPE_TRANSITION             = 7; // 35
    var SLIDEWIPE_TRANSITION            = 8; // 36
    var FADE_TRANSITION                 = 9; // 37
    var RANDOMBARWIPE_TRANSITION        = 10; // 38
    var CHECKERBOARDWIPE_TRANSITION     = 11; // 39
    var DISSOLVE_TRANSITION             = 12; // 40
    var SNAKEWIPE_TRANSITION            = 13; // 30
    var PARALLELSNAKESWIPE_TRANSITION   = 14; // 32
    var IRISWIPE_TRANSITION             = 15; // 12
    var BARNDOORWIPE_TRANSITION         = 16; // 4
    var VEEWIPE_TRANSITION              = 17; // 8
    var ZIGZAGWIPE_TRANSITION           = 18; // 10
    var BARNZIGZAGWIPE_TRANSITION       = 19; // 11
    var FANWIPE_TRANSITION              = 20; // 25
    var SINGLESWEEPWIPE_TRANSITION      = 21; // 24
    var WATERFALLWIPE_TRANSITION        = 22; // 34
    var SPIRALWIPE_TRANSITION           = 23; // 31
    var MISCDIAGONALWIPE_TRANSITION     = 24; // 7
    var BOXSNAKESWIPE_TRANSITION        = 25; // 33
    
    var aTransitionTypeInMap = {
    'barWipe'           : BARWIPE_TRANSITION,
    'boxWipe'           : BOXWIPE_TRANSITION,
    'barnDoorWipe'      : BARNDOORWIPE_TRANSITION,
    'fourBoxWipe'       : FOURBOXWIPE_TRANSITION,
    'ellipseWipe'       : ELLIPSEWIPE_TRANSITION,
    'clockWipe'         : CLOCKWIPE_TRANSITION,
    'pinWheelWipe'      : PINWHEELWIPE_TRANSITION,
    'miscDiagonalWipe'  : MISCDIAGONALWIPE_TRANSITION,
    'pushWipe'          : PUSHWIPE_TRANSITION,
    'slideWipe'         : SLIDEWIPE_TRANSITION,
    'fade'              : FADE_TRANSITION,
    'fanWipe'           : FANWIPE_TRANSITION,
    'randomBarWipe'     : RANDOMBARWIPE_TRANSITION,
    'checkerBoardWipe'  : CHECKERBOARDWIPE_TRANSITION,
    'dissolve'          : DISSOLVE_TRANSITION,
    'singleSweepWipe'   : SINGLESWEEPWIPE_TRANSITION,
    'snakeWipe'         : SNAKEWIPE_TRANSITION,
    'parallelSnakesWipe': PARALLELSNAKESWIPE_TRANSITION,
    'spiralWipe'        : SPIRALWIPE_TRANSITION,
    'boxSnakesWipe'     : BOXSNAKESWIPE_TRANSITION,
    'irisWipe'          : IRISWIPE_TRANSITION,
    'veeWipe'           : VEEWIPE_TRANSITION,
    'zigZagWipe'        : ZIGZAGWIPE_TRANSITION,
    'barnZigZagWipe'    : BARNZIGZAGWIPE_TRANSITION,
    'waterfallWipe'     : WATERFALLWIPE_TRANSITION
    };
    
    var DEFAULT_TRANS_SUBTYPE                       = 0;
    var LEFTTORIGHT_TRANS_SUBTYPE                   = 1;
    var TOPTOBOTTOM_TRANS_SUBTYPE                   = 2;
    var CORNERSIN_TRANS_SUBTYPE                     = 3; // 11
    var CORNERSOUT_TRANS_SUBTYPE                    = 4;
    var VERTICAL_TRANS_SUBTYPE                      = 5;
    var HORIZONTAL_TRANS_SUBTYPE                    = 6; // 14
    var DOWN_TRANS_SUBTYPE                          = 7; // 19
    var CIRCLE_TRANS_SUBTYPE                        = 8; // 27
    var CLOCKWISETWELVE_TRANS_SUBTYPE               = 9; // 33
    var CLOCKWISETHREE_TRANS_SUBTYPE                = 10;
    var CLOCKWISESIX_TRANS_SUBTYPE                  = 11;
    var CLOCKWISENINE_TRANS_SUBTYPE                 = 12;
    var TWOBLADEVERTICAL_TRANS_SUBTYPE              = 13;
    var TWOBLADEHORIZONTAL_TRANS_SUBTYPE            = 14;
    var FOURBLADE_TRANS_SUBTYPE                     = 15; // 39
    var FROMLEFT_TRANS_SUBTYPE                      = 16; // 97
    var FROMTOP_TRANS_SUBTYPE                       = 17;
    var FROMRIGHT_TRANS_SUBTYPE                     = 18;
    var FROMBOTTOM_TRANS_SUBTYPE                    = 19;
    var CROSSFADE_TRANS_SUBTYPE                     = 20;
    var FADETOCOLOR_TRANS_SUBTYPE                   = 21;
    var FADEFROMCOLOR_TRANS_SUBTYPE                 = 22;
    var FADEOVERCOLOR_TRANS_SUBTYPE                 = 23;
    var THREEBLADE_TRANS_SUBTYPE                    = 24;
    var EIGHTBLADE_TRANS_SUBTYPE                    = 25;
    var ONEBLADE_TRANS_SUBTYPE                      = 26; // 107
    var ACROSS_TRANS_SUBTYPE                        = 27;
    var TOPLEFTVERTICAL_TRANS_SUBTYPE               = 28; // 109
    var TOPLEFTHORIZONTAL_TRANS_SUBTYPE             = 29; // 64
    var TOPLEFTDIAGONAL_TRANS_SUBTYPE               = 30; // 65
    var TOPRIGHTDIAGONAL_TRANS_SUBTYPE              = 31; // 66
    var BOTTOMRIGHTDIAGONAL_TRANS_SUBTYPE           = 32; // 67
    var BOTTOMLEFTDIAGONAL_TRANS_SUBTYPE            = 33; // 68
    var RECTANGLE_TRANS_SUBTYPE                     = 34; // 101
    var DIAMOND_TRANS_SUBTYPE                       = 35; // 102
    var TOPLEFT_TRANS_SUBTYPE                       = 36; // 3
    var TOPRIGHT_TRANS_SUBTYPE                      = 37; // 4
    var BOTTOMRIGHT_TRANS_SUBTYPE                   = 38; // 5
    var BOTTOMLEFT_TRANS_SUBTYPE                    = 39; // 6
    var TOPCENTER_TRANS_SUBTYPE                     = 40; // 7
    var RIGHTCENTER_TRANS_SUBTYPE                   = 41; // 8
    var BOTTOMCENTER_TRANS_SUBTYPE                  = 42; // 9
    var LEFTCENTER_TRANS_SUBTYPE                    = 43; // 10
    var LEFT_TRANS_SUBTYPE                          = 44; // 20
    var UP_TRANS_SUBTYPE                            = 45; // 21
    var RIGHT_TRANS_SUBTYPE                         = 46; // 22
    var DIAGONALBOTTOMLEFT_TRANS_SUBTYPE            = 47; // 15
    var DIAGONALTOPLEFT_TRANS_SUBTYPE               = 48; // 16
    var CENTERTOP_TRANS_SUBTYPE                     = 49; // 48
    var CENTERRIGHT_TRANS_SUBTYPE                   = 50; // 49
    var TOP_TRANS_SUBTYPE                           = 51; // 50
    var BOTTOM_TRANS_SUBTYPE                        = 52; // 52
    var CLOCKWISETOP_TRANS_SUBTYPE                  = 53; // 40
    var CLOCKWISERIGHT_TRANS_SUBTYPE                = 54; // 41
    var CLOCKWISEBOTTOM_TRANS_SUBTYPE               = 55; // 42
    var CLOCKWISELEFT_TRANS_SUBTYPE                 = 56; // 43
    var CLOCKWISETOPLEFT_TRANS_SUBTYPE              = 57; // 44
    var COUNTERCLOCKWISEBOTTOMLEFT_TRANS_SUBTYPE    = 58; // 45
    var CLOCKWISEBOTTOMRIGHT_TRANS_SUBTYPE          = 59; // 46
    var COUNTERCLOCKWISETOPRIGHT_TRANS_SUBTYPE      = 60; // 47
    var VERTICALLEFT_TRANS_SUBTYPE                  = 61; // 93
    var VERTICALRIGHT_TRANS_SUBTYPE                 = 62; // 94
    var HORIZONTALLEFT_TRANS_SUBTYPE                = 63; // 95
    var HORIZONTALRIGHT_TRANS_SUBTYPE               = 64; // 96
    var TOPLEFTCLOCKWISE_TRANS_SUBTYPE              = 65; // 69
    var TOPRIGHTCLOCKWISE_TRANS_SUBTYPE             = 66; // 70
    var BOTTOMRIGHTCLOCKWISE_TRANS_SUBTYPE          = 67; // 71
    var BOTTOMLEFTCLOCKWISE_TRANS_SUBTYPE           = 68; // 72
    var TOPLEFTCOUNTERCLOCKWISE_TRANS_SUBTYPE       = 69; // 73
    var TOPRIGHTCOUNTERCLOCKWISE_TRANS_SUBTYPE      = 70; // 74
    var BOTTOMRIGHTCOUNTERCLOCKWISE_TRANS_SUBTYPE   = 71; // 75
    var BOTTOMLEFTCOUNTERCLOCKWISE_TRANS_SUBTYPE    = 72; // 76
    var DOUBLEBARNDOOR_TRANS_SUBTYPE                = 73; // 17
    var DOUBLEDIAMOND_TRANS_SUBTYPE                 = 74; // 18
    var VERTICALTOPSAME_TRANS_SUBTYPE               = 75; // 77
    var VERTICALBOTTOMSAME_TRANS_SUBTYPE            = 76; // 78
    var VERTICALTOPLEFTOPPOSITE_TRANS_SUBTYPE       = 77; // 79
    var VERTICALBOTTOMLEFTOPPOSITE_TRANS_SUBTYPE    = 78; // 80
    var HORIZONTALLEFTSAME_TRANS_SUBTYPE            = 79; // 81
    var HORIZONTALRIGHTSAME_TRANS_SUBTYPE           = 80; // 82
    var HORIZONTALTOPLEFTOPPOSITE_TRANS_SUBTYPE     = 81; // 83
    var HORIZONTALTOPRIGHTOPPOSITE_TRANS_SUBTYPE    = 82; // 84
    var DIAGONALBOTTOMLEFTOPPOSITE_TRANS_SUBTYPE    = 83; // 85
    var DIAGONALTOPLEFTOPPOSITE_TRANS_SUBTYPE       = 84; // 86
    var TWOBOXTOP_TRANS_SUBTYPE                     = 85; // 87
    var TWOBOXBOTTOM_TRANS_SUBTYPE                  = 86; // 88
    var TWOBOXLEFT_TRANS_SUBTYPE                    = 87; // 89
    var TWOBOXRIGHT_TRANS_SUBTYPE                   = 88; // 90
    var FOURBOXVERTICAL_TRANS_SUBTYPE               = 89; // 91
    var FOURBOXHORIZONTAL_TRANS_SUBTYPE             = 90; // 92
    
    var aTransitionSubtypeInMap = {
    'default'                       : DEFAULT_TRANS_SUBTYPE,
    'leftToRight'                   : LEFTTORIGHT_TRANS_SUBTYPE,
    'topToBottom'                   : TOPTOBOTTOM_TRANS_SUBTYPE,
    'cornersIn'                     : CORNERSIN_TRANS_SUBTYPE,
    'cornersOut'                    : CORNERSOUT_TRANS_SUBTYPE,
    'vertical'                      : VERTICAL_TRANS_SUBTYPE,
    'centerTop'                     : CENTERTOP_TRANS_SUBTYPE,
    'centerRight'                   : CENTERRIGHT_TRANS_SUBTYPE,
    'top'                           : TOP_TRANS_SUBTYPE,
    'right'                         : RIGHT_TRANS_SUBTYPE,
    'bottom'                        : BOTTOM_TRANS_SUBTYPE,
    'left'                          : LEFT_TRANS_SUBTYPE,
    'horizontal'                    : HORIZONTAL_TRANS_SUBTYPE,
    'down'                          : DOWN_TRANS_SUBTYPE,
    'circle'                        : CIRCLE_TRANS_SUBTYPE,
    'clockwiseTwelve'               : CLOCKWISETWELVE_TRANS_SUBTYPE,
    'clockwiseThree'                : CLOCKWISETHREE_TRANS_SUBTYPE,
    'clockwiseSix'                  : CLOCKWISESIX_TRANS_SUBTYPE,
    'clockwiseNine'                 : CLOCKWISENINE_TRANS_SUBTYPE,
    'clockwiseRight'                : CLOCKWISERIGHT_TRANS_SUBTYPE,
    'clockwiseTop'                  : CLOCKWISETOP_TRANS_SUBTYPE,
    'clockwiseBottom'               : CLOCKWISEBOTTOM_TRANS_SUBTYPE,
    'clockwiseLeft'                 : CLOCKWISELEFT_TRANS_SUBTYPE,
    'clockwiseTopLeft'              : CLOCKWISETOPLEFT_TRANS_SUBTYPE,
    'counterClockwiseBottomLeft'    : COUNTERCLOCKWISEBOTTOMLEFT_TRANS_SUBTYPE,
    'clockwiseBottomRight'          : CLOCKWISEBOTTOMRIGHT_TRANS_SUBTYPE,
    'counterClockwiseTopRight'      : COUNTERCLOCKWISETOPRIGHT_TRANS_SUBTYPE,
    'twoBladeVertical'              : TWOBLADEVERTICAL_TRANS_SUBTYPE,
    'twoBladeHorizontal'            : TWOBLADEHORIZONTAL_TRANS_SUBTYPE,
    'fourBlade'                     : FOURBLADE_TRANS_SUBTYPE,
    'fromLeft'                      : FROMLEFT_TRANS_SUBTYPE,
    'fromTop'                       : FROMTOP_TRANS_SUBTYPE,
    'fromRight'                     : FROMRIGHT_TRANS_SUBTYPE,
    'fromBottom'                    : FROMBOTTOM_TRANS_SUBTYPE,
    'crossfade'                     : CROSSFADE_TRANS_SUBTYPE,
    'fadeToColor'                   : FADETOCOLOR_TRANS_SUBTYPE,
    'fadeFromColor'                 : FADEFROMCOLOR_TRANS_SUBTYPE,
    'fadeOverColor'                 : FADEOVERCOLOR_TRANS_SUBTYPE,
    'threeBlade'                    : THREEBLADE_TRANS_SUBTYPE,
    'eightBlade'                    : EIGHTBLADE_TRANS_SUBTYPE,
    'oneBlade'                      : ONEBLADE_TRANS_SUBTYPE,
    'across'                        : ACROSS_TRANS_SUBTYPE,
    'topLeftVertical'               : TOPLEFTVERTICAL_TRANS_SUBTYPE,
    'topLeftHorizontal'             : TOPLEFTHORIZONTAL_TRANS_SUBTYPE,
    'topLeftDiagonal'               : TOPLEFTDIAGONAL_TRANS_SUBTYPE,
    'topRightDiagonal'              : TOPRIGHTDIAGONAL_TRANS_SUBTYPE,
    'bottomRightDiagonal'           : BOTTOMRIGHTDIAGONAL_TRANS_SUBTYPE,
    'topLeftClockwise'              : TOPLEFTCLOCKWISE_TRANS_SUBTYPE,
    'topRightClockwise'             : TOPRIGHTCLOCKWISE_TRANS_SUBTYPE,
    'bottomRightClockwise'          : BOTTOMRIGHTCLOCKWISE_TRANS_SUBTYPE,
    'bottomLeftClockwise'           : BOTTOMLEFTCLOCKWISE_TRANS_SUBTYPE,
    'topLeftCounterClockwise'       : TOPLEFTCOUNTERCLOCKWISE_TRANS_SUBTYPE,
    'topRightCounterClockwise'      : TOPRIGHTCOUNTERCLOCKWISE_TRANS_SUBTYPE,
    'bottomRightCounterClockwise'   : BOTTOMRIGHTCOUNTERCLOCKWISE_TRANS_SUBTYPE,
    'bottomLeftCounterClockwise'    : BOTTOMLEFTCOUNTERCLOCKWISE_TRANS_SUBTYPE,
    'bottomLeftDiagonal'            : BOTTOMLEFTDIAGONAL_TRANS_SUBTYPE,
    'rectangle'                     : RECTANGLE_TRANS_SUBTYPE,
    'diamond'                       : DIAMOND_TRANS_SUBTYPE,
    'topLeft'                       : TOPLEFT_TRANS_SUBTYPE,
    'topRight'                      : TOPRIGHT_TRANS_SUBTYPE,
    'bottomRight'                   : BOTTOMRIGHT_TRANS_SUBTYPE,
    'bottomLeft'                    : BOTTOMLEFT_TRANS_SUBTYPE,
    'topCenter'                     : TOPCENTER_TRANS_SUBTYPE,
    'rightCenter'                   : RIGHTCENTER_TRANS_SUBTYPE,
    'bottomCenter'                  : BOTTOMCENTER_TRANS_SUBTYPE,
    'leftCenter'                    : LEFTCENTER_TRANS_SUBTYPE,
    'up'                            : UP_TRANS_SUBTYPE,
    'diagonalBottomLeft'            : DIAGONALBOTTOMLEFT_TRANS_SUBTYPE,
    'diagonalTopLeft'               : DIAGONALTOPLEFT_TRANS_SUBTYPE,
    'verticalLeft'                  : VERTICALLEFT_TRANS_SUBTYPE,
    'verticalRight'                 : VERTICALRIGHT_TRANS_SUBTYPE,
    'horizontalLeft'                : HORIZONTALLEFT_TRANS_SUBTYPE,
    'horizontalRight'               : HORIZONTALRIGHT_TRANS_SUBTYPE,
    'doubleBarnDoor'                : DOUBLEBARNDOOR_TRANS_SUBTYPE,
    'doubleDiamond'                 : DOUBLEDIAMOND_TRANS_SUBTYPE,
    'verticalTopSame'               : VERTICALTOPSAME_TRANS_SUBTYPE,
    'verticalBottomSame'            : VERTICALBOTTOMSAME_TRANS_SUBTYPE,
    'verticalTopLeftOpposite'       : VERTICALTOPLEFTOPPOSITE_TRANS_SUBTYPE,
    'verticalBottomLeftOpposite'    : VERTICALBOTTOMLEFTOPPOSITE_TRANS_SUBTYPE,
    'horizontalLeftSame'            : HORIZONTALLEFTSAME_TRANS_SUBTYPE,
    'horizontalRightSame'           : HORIZONTALRIGHTSAME_TRANS_SUBTYPE,
    'horizontalTopLeftOpposite'     : HORIZONTALTOPLEFTOPPOSITE_TRANS_SUBTYPE,
    'horizontalTopRightOpposite'    : HORIZONTALTOPRIGHTOPPOSITE_TRANS_SUBTYPE,
    'diagonalBottomLeftOpposite'    : DIAGONALBOTTOMLEFTOPPOSITE_TRANS_SUBTYPE,
    'diagonalTopLeftOpposite'       : DIAGONALTOPLEFTOPPOSITE_TRANS_SUBTYPE,
    'twoBoxTop'                     : TWOBOXTOP_TRANS_SUBTYPE,
    'twoBoxBottom'                  : TWOBOXBOTTOM_TRANS_SUBTYPE,
    'twoBoxLeft'                    : TWOBOXLEFT_TRANS_SUBTYPE,
    'twoBoxRight'                   : TWOBOXRIGHT_TRANS_SUBTYPE,
    'fourBoxVertical'               : FOURBOXVERTICAL_TRANS_SUBTYPE,
    'fourBoxHorizontal'             : FOURBOXHORIZONTAL_TRANS_SUBTYPE
    };
    
    var TRANSITION_MODE_IN  = 1;
    var TRANSITION_MODE_OUT = 0;
    
    var aTransitionModeOutMap = [ 'out', 'in' ];
    
    
    var REVERSEMETHOD_IGNORE                    = 0;
    var REVERSEMETHOD_INVERT_SWEEP              = 1;
    var REVERSEMETHOD_SUBTRACT_POLYGON          = 2;
    var REVERSEMETHOD_SUBTRACT_AND_INVERT       = 3;
    var REVERSEMETHOD_ROTATE_180                = 4;
    var REVERSEMETHOD_FLIP_X                    = 5;
    var REVERSEMETHOD_FLIP_Y                    = 6;
    
    var aReverseMethodOutMap = ['ignore', 'invert sweep', 'subtract polygon',
    'subtract and invert', 'rotate 180', 'flip x', 'flip y'];
    
    
    var aTransitionInfoTable = {};
    
    aTransitionInfoTable[0] = {};
    aTransitionInfoTable[0][0] =
    {
    'class' : TRANSITION_INVALID,
    'rotationAngle' : 0.0,
    'scaleX' : 0.0,
    'scaleY' : 0.0,
    'reverseMethod' : REVERSEMETHOD_IGNORE,
    'outInvertsSweep' : false,
    'scaleIsotropically' : false
    };
    
    aTransitionInfoTable[SNAKEWIPE_TRANSITION] = {};
    aTransitionInfoTable[SNAKEWIPE_TRANSITION][TOPLEFTVERTICAL_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : -90.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_ROTATE_180,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[SNAKEWIPE_TRANSITION][TOPLEFTHORIZONTAL_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 0.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_ROTATE_180,
    'outInvertSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[SNAKEWIPE_TRANSITION][TOPLEFTDIAGONAL_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 0.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_ROTATE_180,
    'outInvertSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[SNAKEWIPE_TRANSITION][TOPRIGHTDIAGONAL_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 0.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_ROTATE_180,
    'outInvertSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[SNAKEWIPE_TRANSITION][BOTTOMRIGHTDIAGONAL_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 180.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_ROTATE_180,
    'outInvertSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[SNAKEWIPE_TRANSITION][BOTTOMLEFTDIAGONAL_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 180.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_ROTATE_180,
    'outInvertSweep' : true,
    'scaleIsotropically' : false
    }
    
    aTransitionInfoTable[PARALLELSNAKESWIPE_TRANSITION] = {};
    aTransitionInfoTable[PARALLELSNAKESWIPE_TRANSITION][VERTICALTOPSAME_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 0.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_IGNORE,
    'outInvertSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[PARALLELSNAKESWIPE_TRANSITION][VERTICALBOTTOMSAME_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 180.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_IGNORE,
    'outInvertSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[PARALLELSNAKESWIPE_TRANSITION][VERTICALTOPLEFTOPPOSITE_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 0.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_IGNORE,
    'outInvertSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[PARALLELSNAKESWIPE_TRANSITION][VERTICALBOTTOMLEFTOPPOSITE_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 0.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_IGNORE,
    'outInvertSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[PARALLELSNAKESWIPE_TRANSITION][HORIZONTALLEFTSAME_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : -90.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_IGNORE,
    'outInvertSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[PARALLELSNAKESWIPE_TRANSITION][HORIZONTALRIGHTSAME_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 90.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_IGNORE,
    'outInvertSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[PARALLELSNAKESWIPE_TRANSITION][HORIZONTALTOPLEFTOPPOSITE_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : -90.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_IGNORE,
    'outInvertSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[PARALLELSNAKESWIPE_TRANSITION][HORIZONTALTOPRIGHTOPPOSITE_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : -90.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_IGNORE,
    'outInvertSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[PARALLELSNAKESWIPE_TRANSITION][DIAGONALTOPLEFTOPPOSITE_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 0.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_IGNORE,
    'outInvertSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[PARALLELSNAKESWIPE_TRANSITION][DIAGONALBOTTOMLEFTOPPOSITE_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 0.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_IGNORE,
    'outInvertSweep' : true,
    'scaleIsotropically' : false
    };
    
    aTransitionInfoTable[SPIRALWIPE_TRANSITION] = {};
    aTransitionInfoTable[SPIRALWIPE_TRANSITION][TOPLEFTCLOCKWISE_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 0.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_SUBTRACT_AND_INVERT,
    'outInvertSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[SPIRALWIPE_TRANSITION][TOPRIGHTCLOCKWISE_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 90.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_SUBTRACT_AND_INVERT,
    'outInvertSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[SPIRALWIPE_TRANSITION][BOTTOMRIGHTCLOCKWISE_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 180.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_SUBTRACT_AND_INVERT,
    'outInvertSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[SPIRALWIPE_TRANSITION][BOTTOMLEFTCLOCKWISE_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 270.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_SUBTRACT_AND_INVERT,
    'outInvertSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[SPIRALWIPE_TRANSITION][TOPLEFTCOUNTERCLOCKWISE_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 90.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_SUBTRACT_AND_INVERT,
    'outInvertSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[SPIRALWIPE_TRANSITION][TOPRIGHTCOUNTERCLOCKWISE_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 180.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_SUBTRACT_AND_INVERT,
    'outInvertSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[SPIRALWIPE_TRANSITION][BOTTOMRIGHTCOUNTERCLOCKWISE_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 270.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_SUBTRACT_AND_INVERT,
    'outInvertSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[SPIRALWIPE_TRANSITION][BOTTOMLEFTCOUNTERCLOCKWISE_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 0.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_SUBTRACT_AND_INVERT,
    'outInvertSweep' : true,
    'scaleIsotropically' : false
    };
    
    aTransitionInfoTable[BOXSNAKESWIPE_TRANSITION] = {};
    aTransitionInfoTable[BOXSNAKESWIPE_TRANSITION][TWOBOXTOP_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 90.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_IGNORE,
    'outInvertSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[BOXSNAKESWIPE_TRANSITION][TWOBOXBOTTOM_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : -90.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_IGNORE,
    'outInvertSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[BOXSNAKESWIPE_TRANSITION][TWOBOXLEFT_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 0.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_IGNORE,
    'outInvertSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[BOXSNAKESWIPE_TRANSITION][TWOBOXRIGHT_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 180.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_IGNORE,
    'outInvertSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[BOXSNAKESWIPE_TRANSITION][FOURBOXVERTICAL_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 90.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_IGNORE,
    'outInvertSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[BOXSNAKESWIPE_TRANSITION][FOURBOXHORIZONTAL_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 0.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_IGNORE,
    'outInvertSweep' : true,
    'scaleIsotropically' : false
    };
    
    aTransitionInfoTable[BARNDOORWIPE_TRANSITION] = {};
    aTransitionInfoTable[BARNDOORWIPE_TRANSITION][VERTICAL_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle': 0.0,
    'scaleX': 1.0,
    'scaleY': 1.0,
    'reverseMethod': REVERSEMETHOD_SUBTRACT_AND_INVERT,
    'outInvertsSweep': true,
    'scaleIsotropically': false
    };
    aTransitionInfoTable[BARNDOORWIPE_TRANSITION][HORIZONTAL_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle': 90.0,
    'scaleX': 1.0,
    'scaleY': 1.0,
    'reverseMethod': REVERSEMETHOD_SUBTRACT_AND_INVERT,
    'outInvertsSweep': true,
    'scaleIsotropically': false
    };
    aTransitionInfoTable[BARNDOORWIPE_TRANSITION][DIAGONALBOTTOMLEFT_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle': 45.0,
    'scaleX': Math.SQRT2,
    'scaleY': Math.SQRT2,
    'reverseMethod': REVERSEMETHOD_SUBTRACT_AND_INVERT,
    'outInvertsSweep': true,
    'scaleIsotropically': false
    };
    aTransitionInfoTable[BARNDOORWIPE_TRANSITION][DIAGONALTOPLEFT_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle': -45.0,
    'scaleX': Math.SQRT2,
    'scaleY': Math.SQRT2,
    'reverseMethod': REVERSEMETHOD_SUBTRACT_AND_INVERT,
    'outInvertsSweep': true,
    'scaleIsotropically': false
    };
    
    aTransitionInfoTable[MISCDIAGONALWIPE_TRANSITION] = {};
    aTransitionInfoTable[MISCDIAGONALWIPE_TRANSITION][DOUBLEBARNDOOR_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle': 45.0,
    'scaleX': Math.SQRT2,
    'scaleY': Math.SQRT2,
    'reverseMethod': REVERSEMETHOD_IGNORE,
    'outInvertsSweep': true,
    'scaleIsotropically': false
    };
    aTransitionInfoTable[MISCDIAGONALWIPE_TRANSITION][DOUBLEDIAMOND_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle': 0.0,
    'scaleX': 1,
    'scaleY': 1,
    'reverseMethod': REVERSEMETHOD_IGNORE,
    'outInvertsSweep': true,
    'scaleIsotropically': false
    };
    
    aTransitionInfoTable[IRISWIPE_TRANSITION] = {};
    aTransitionInfoTable[IRISWIPE_TRANSITION][RECTANGLE_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle': 0.0,
    'scaleX': 1.0,
    'scaleY': 1.0,
    'reverseMethod': REVERSEMETHOD_SUBTRACT_AND_INVERT,
    'outInvertsSweep': true,
    'scaleIsotropically': false
    };
    
    aTransitionInfoTable[IRISWIPE_TRANSITION][DIAMOND_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle': 45.0,
    'scaleX': Math.SQRT2,
    'scaleY': Math.SQRT2,
    'reverseMethod': REVERSEMETHOD_SUBTRACT_AND_INVERT,
    'outInvertsSweep': true,
    'scaleIsotropically': false
    };
    
    aTransitionInfoTable[ZIGZAGWIPE_TRANSITION] = {};
    aTransitionInfoTable[ZIGZAGWIPE_TRANSITION][LEFTTORIGHT_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 0.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_FLIP_X,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[ZIGZAGWIPE_TRANSITION][TOPTOBOTTOM_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 90.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_FLIP_Y,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    
    aTransitionInfoTable[BARNZIGZAGWIPE_TRANSITION] = {};
    aTransitionInfoTable[BARNZIGZAGWIPE_TRANSITION][VERTICAL_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 0.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_IGNORE,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[BARNZIGZAGWIPE_TRANSITION][HORIZONTAL_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 90.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_IGNORE,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    
    aTransitionInfoTable[BARWIPE_TRANSITION] = {};
    aTransitionInfoTable[BARWIPE_TRANSITION][LEFTTORIGHT_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 0.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_FLIP_X,
    'outInvertsSweep' : false,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[BARWIPE_TRANSITION][TOPTOBOTTOM_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 90.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_FLIP_Y,
    'outInvertsSweep' : false,
    'scaleIsotropically' : false
    };
    
    aTransitionInfoTable[WATERFALLWIPE_TRANSITION] = {};
    aTransitionInfoTable[WATERFALLWIPE_TRANSITION][VERTICALLEFT_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 0.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_ROTATE_180,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[WATERFALLWIPE_TRANSITION][VERTICALRIGHT_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 0.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_ROTATE_180,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[WATERFALLWIPE_TRANSITION][HORIZONTALLEFT_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : -90.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_ROTATE_180,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[WATERFALLWIPE_TRANSITION][HORIZONTALRIGHT_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 90.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_ROTATE_180,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    
    aTransitionInfoTable[BOXWIPE_TRANSITION] = {};
    aTransitionInfoTable[BOXWIPE_TRANSITION][TOPLEFT_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 0.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_IGNORE,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[BOXWIPE_TRANSITION][TOPRIGHT_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 90.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_IGNORE,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[BOXWIPE_TRANSITION][BOTTOMRIGHT_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 180.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_IGNORE,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[BOXWIPE_TRANSITION][BOTTOMLEFT_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : -90.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_IGNORE,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[BOXWIPE_TRANSITION][TOPCENTER_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 0.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_FLIP_Y,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[BOXWIPE_TRANSITION][RIGHTCENTER_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 90.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_FLIP_X,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[BOXWIPE_TRANSITION][BOTTOMCENTER_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 180.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_FLIP_Y,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[BOXWIPE_TRANSITION][LEFTCENTER_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : -90.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_FLIP_X,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    
    aTransitionInfoTable[FOURBOXWIPE_TRANSITION] = {};
    aTransitionInfoTable[FOURBOXWIPE_TRANSITION][CORNERSIN_TRANS_SUBTYPE] =
    aTransitionInfoTable[FOURBOXWIPE_TRANSITION][CORNERSOUT_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 0.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_SUBTRACT_AND_INVERT,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    
    aTransitionInfoTable[ELLIPSEWIPE_TRANSITION] = {};
    aTransitionInfoTable[ELLIPSEWIPE_TRANSITION][CIRCLE_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 0.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_SUBTRACT_AND_INVERT,
    'outInvertsSweep' : true,
    'scaleIsotropically' : true
    };
    aTransitionInfoTable[ELLIPSEWIPE_TRANSITION][HORIZONTAL_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 0.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_SUBTRACT_AND_INVERT,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[ELLIPSEWIPE_TRANSITION][VERTICAL_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 90.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_SUBTRACT_AND_INVERT,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    
    aTransitionInfoTable[CLOCKWIPE_TRANSITION] = {};
    aTransitionInfoTable[CLOCKWIPE_TRANSITION][CLOCKWISETWELVE_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 0.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_FLIP_X,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[CLOCKWIPE_TRANSITION][CLOCKWISETHREE_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 90.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_FLIP_Y,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[CLOCKWIPE_TRANSITION][CLOCKWISESIX_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 180.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_FLIP_X,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[CLOCKWIPE_TRANSITION][CLOCKWISENINE_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 270.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_FLIP_Y,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    
    aTransitionInfoTable[VEEWIPE_TRANSITION] = {};
    aTransitionInfoTable[VEEWIPE_TRANSITION][DOWN_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 0.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_FLIP_Y,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[VEEWIPE_TRANSITION][LEFT_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 90.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_FLIP_X,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[VEEWIPE_TRANSITION][UP_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 180.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_FLIP_Y,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[VEEWIPE_TRANSITION][RIGHT_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : -90.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_FLIP_X,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    
    aTransitionInfoTable[FANWIPE_TRANSITION] = {};
    aTransitionInfoTable[FANWIPE_TRANSITION][CENTERTOP_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 0.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_FLIP_Y,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[FANWIPE_TRANSITION][CENTERRIGHT_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 90.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_FLIP_X,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[FANWIPE_TRANSITION][TOP_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 180.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_FLIP_Y,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[FANWIPE_TRANSITION][RIGHT_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : -90.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_FLIP_X,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[FANWIPE_TRANSITION][BOTTOM_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 180.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_FLIP_Y,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[FANWIPE_TRANSITION][LEFT_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 90.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_FLIP_X,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    
    
    aTransitionInfoTable[PINWHEELWIPE_TRANSITION] = {};
    aTransitionInfoTable[PINWHEELWIPE_TRANSITION][ONEBLADE_TRANS_SUBTYPE] =
    aTransitionInfoTable[PINWHEELWIPE_TRANSITION][TWOBLADEVERTICAL_TRANS_SUBTYPE] =
    aTransitionInfoTable[PINWHEELWIPE_TRANSITION][THREEBLADE_TRANS_SUBTYPE] =
    aTransitionInfoTable[PINWHEELWIPE_TRANSITION][FOURBLADE_TRANS_SUBTYPE] =
    aTransitionInfoTable[PINWHEELWIPE_TRANSITION][EIGHTBLADE_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 0.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_FLIP_X,
    'outInvertsSweep' : true,
    'scaleIsotropically' : true
    };
    aTransitionInfoTable[PINWHEELWIPE_TRANSITION][TWOBLADEHORIZONTAL_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : -90.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_FLIP_Y,
    'outInvertsSweep' : true,
    'scaleIsotropically' : true
    };
    
    aTransitionInfoTable[PUSHWIPE_TRANSITION] = {};
    aTransitionInfoTable[PUSHWIPE_TRANSITION][FROMLEFT_TRANS_SUBTYPE] =
    aTransitionInfoTable[PUSHWIPE_TRANSITION][FROMTOP_TRANS_SUBTYPE] =
    aTransitionInfoTable[PUSHWIPE_TRANSITION][FROMRIGHT_TRANS_SUBTYPE] =
    aTransitionInfoTable[PUSHWIPE_TRANSITION][FROMBOTTOM_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_SPECIAL,
    'rotationAngle' : 0.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_IGNORE,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    
    
    aTransitionInfoTable[SINGLESWEEPWIPE_TRANSITION] = {};
    aTransitionInfoTable[SINGLESWEEPWIPE_TRANSITION][CLOCKWISETOP_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 0.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_SUBTRACT_AND_INVERT,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[SINGLESWEEPWIPE_TRANSITION][CLOCKWISERIGHT_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 90.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_SUBTRACT_AND_INVERT,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[SINGLESWEEPWIPE_TRANSITION][CLOCKWISEBOTTOM_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 180.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_SUBTRACT_AND_INVERT,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[SINGLESWEEPWIPE_TRANSITION][CLOCKWISELEFT_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 270.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_SUBTRACT_AND_INVERT,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[SINGLESWEEPWIPE_TRANSITION][CLOCKWISETOPLEFT_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 0.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_SUBTRACT_AND_INVERT,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[SINGLESWEEPWIPE_TRANSITION][COUNTERCLOCKWISEBOTTOMLEFT_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 180.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_SUBTRACT_AND_INVERT,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[SINGLESWEEPWIPE_TRANSITION][CLOCKWISEBOTTOMRIGHT_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 180.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_SUBTRACT_AND_INVERT,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[SINGLESWEEPWIPE_TRANSITION][COUNTERCLOCKWISETOPRIGHT_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 0.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_SUBTRACT_AND_INVERT,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    
    aTransitionInfoTable[SLIDEWIPE_TRANSITION] = {};
    aTransitionInfoTable[SLIDEWIPE_TRANSITION][FROMLEFT_TRANS_SUBTYPE] =
    aTransitionInfoTable[SLIDEWIPE_TRANSITION][FROMTOP_TRANS_SUBTYPE] =
    aTransitionInfoTable[SLIDEWIPE_TRANSITION][FROMRIGHT_TRANS_SUBTYPE] =
    aTransitionInfoTable[SLIDEWIPE_TRANSITION][FROMBOTTOM_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_SPECIAL,
    'rotationAngle' : 0.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_IGNORE,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    
    aTransitionInfoTable[FADE_TRANSITION] = {};
    aTransitionInfoTable[FADE_TRANSITION][CROSSFADE_TRANS_SUBTYPE] =
    aTransitionInfoTable[FADE_TRANSITION][FADETOCOLOR_TRANS_SUBTYPE] =
    aTransitionInfoTable[FADE_TRANSITION][FADEFROMCOLOR_TRANS_SUBTYPE] =
    aTransitionInfoTable[FADE_TRANSITION][FADEOVERCOLOR_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_SPECIAL,
    'rotationAngle' : 0.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_IGNORE,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    
    
    aTransitionInfoTable[RANDOMBARWIPE_TRANSITION] = {};
    aTransitionInfoTable[RANDOMBARWIPE_TRANSITION][VERTICAL_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 90.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_IGNORE,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[RANDOMBARWIPE_TRANSITION][HORIZONTAL_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 0.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_IGNORE,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    
    aTransitionInfoTable[CHECKERBOARDWIPE_TRANSITION] = {};
    aTransitionInfoTable[CHECKERBOARDWIPE_TRANSITION][DOWN_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 90.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_FLIP_Y,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    aTransitionInfoTable[CHECKERBOARDWIPE_TRANSITION][ACROSS_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 0.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_FLIP_X,
    'outInvertsSweep' : true,
    'scaleIsotropically' : false
    };
    
    aTransitionInfoTable[DISSOLVE_TRANSITION] = {};
    aTransitionInfoTable[DISSOLVE_TRANSITION][DEFAULT_TRANS_SUBTYPE] =
    {
    'class' : TRANSITION_CLIP_POLYPOLYGON,
    'rotationAngle' : 0.0,
    'scaleX' : 1.0,
    'scaleY' : 1.0,
    'reverseMethod' : REVERSEMETHOD_IGNORE,
    'outInvertsSweep' : true,
    'scaleIsotropically' : true
    };
    
    
    function createStateTransitionTable()
    {
    var aSTT = {};
    
    aSTT[RESTART_MODE_NEVER] = {};
    aSTT[RESTART_MODE_WHEN_NOT_ACTIVE] = {};
    aSTT[RESTART_MODE_ALWAYS] = {};
    
    var aTable =
    aSTT[RESTART_MODE_NEVER][FILL_MODE_REMOVE] = {};
    aTable[INVALID_NODE]        = INVALID_NODE;
    aTable[UNRESOLVED_NODE]     = RESOLVED_NODE | ENDED_NODE;
    aTable[RESOLVED_NODE]       = ACTIVE_NODE | ENDED_NODE;
    aTable[ACTIVE_NODE]         = ENDED_NODE;
    aTable[FROZEN_NODE]         = INVALID_NODE;  // this state is unreachable here
    aTable[ENDED_NODE]          = ENDED_NODE;    // this state is a sink here (cannot restart)
    
    aTable =
    aSTT[RESTART_MODE_NEVER][FILL_MODE_FREEZE] =
    aSTT[RESTART_MODE_NEVER][FILL_MODE_HOLD] =
    aSTT[RESTART_MODE_NEVER][FILL_MODE_TRANSITION] = {};
    aTable[INVALID_NODE]        = INVALID_NODE;
    aTable[UNRESOLVED_NODE]     = RESOLVED_NODE | ENDED_NODE;
    aTable[RESOLVED_NODE]       = ACTIVE_NODE | ENDED_NODE;
    aTable[ACTIVE_NODE]         = FROZEN_NODE | ENDED_NODE;
    aTable[FROZEN_NODE]         = ENDED_NODE;
    aTable[ENDED_NODE]          = ENDED_NODE;   // this state is a sink here (cannot restart)
    
    aTable =
    aSTT[RESTART_MODE_WHEN_NOT_ACTIVE][FILL_MODE_REMOVE] = {};
    aTable[INVALID_NODE]        = INVALID_NODE;
    aTable[UNRESOLVED_NODE]     = RESOLVED_NODE | ENDED_NODE;
    aTable[RESOLVED_NODE]       = ACTIVE_NODE | ENDED_NODE;
    aTable[ACTIVE_NODE]         = ENDED_NODE;
    aTable[FROZEN_NODE]         = INVALID_NODE;  // this state is unreachable here
    aTable[ENDED_NODE]          = RESOLVED_NODE | ACTIVE_NODE | ENDED_NODE;  // restart is possible
    
    aTable =
    aSTT[RESTART_MODE_WHEN_NOT_ACTIVE][FILL_MODE_FREEZE] =
    aSTT[RESTART_MODE_WHEN_NOT_ACTIVE][FILL_MODE_HOLD] =
    aSTT[RESTART_MODE_WHEN_NOT_ACTIVE][FILL_MODE_TRANSITION] = {};
    aTable[INVALID_NODE]        = INVALID_NODE;
    aTable[UNRESOLVED_NODE]     = RESOLVED_NODE | ENDED_NODE;
    aTable[RESOLVED_NODE]       = ACTIVE_NODE | ENDED_NODE;
    aTable[ACTIVE_NODE]         = FROZEN_NODE | ENDED_NODE;
    aTable[FROZEN_NODE]         = RESOLVED_NODE | ACTIVE_NODE | ENDED_NODE;  // restart is possible
    aTable[ENDED_NODE]          = RESOLVED_NODE | ACTIVE_NODE | ENDED_NODE;  // restart is possible
    
    aTable =
    aSTT[RESTART_MODE_ALWAYS][FILL_MODE_REMOVE] = {};
    aTable[INVALID_NODE]        = INVALID_NODE;
    aTable[UNRESOLVED_NODE]     = RESOLVED_NODE | ENDED_NODE;
    aTable[RESOLVED_NODE]       = ACTIVE_NODE | ENDED_NODE;
    aTable[ACTIVE_NODE]         = RESOLVED_NODE | ACTIVE_NODE | ENDED_NODE;  // restart is possible
    aTable[FROZEN_NODE]         = INVALID_NODE;  // this state is unreachable here
    aTable[ENDED_NODE]          = RESOLVED_NODE | ACTIVE_NODE | ENDED_NODE;  // restart is possible
    
    aTable =
    aSTT[RESTART_MODE_ALWAYS][FILL_MODE_FREEZE] =
    aSTT[RESTART_MODE_ALWAYS][FILL_MODE_HOLD] =
    aSTT[RESTART_MODE_ALWAYS][FILL_MODE_TRANSITION] = {};
    aTable[INVALID_NODE]        = INVALID_NODE;
    aTable[UNRESOLVED_NODE]     = RESOLVED_NODE | ENDED_NODE;
    aTable[RESOLVED_NODE]       = ACTIVE_NODE | ENDED_NODE;
    aTable[ACTIVE_NODE]         = RESOLVED_NODE | ACTIVE_NODE | FROZEN_NODE | ENDED_NODE;
    aTable[FROZEN_NODE]         = RESOLVED_NODE | ACTIVE_NODE | ENDED_NODE;  // restart is possible
    aTable[ENDED_NODE]          = RESOLVED_NODE | ACTIVE_NODE | ENDED_NODE;  // restart is possible
    
    return aSTT;
    }
    
    var aStateTransitionTable = createStateTransitionTable();
    
    
    function getTransitionTable( eRestartMode, eFillMode )
    {
    if( eRestartMode == RESTART_MODE_DEFAULT )
    {
    log( 'getTransitionTable: unexpected restart mode: ' + eRestartMode
    + '. Used NEVER instead.');
    eRestartMode = RESTART_MODE_NEVER;
    }
    
    if( eFillMode == FILL_MODE_DEFAULT ||
    eFillMode == FILL_MODE_AUTO )
    {
    eFillMode = FILL_MODE_REMOVE;
    }
    
    return aStateTransitionTable[eRestartMode][eFillMode];
    }
    
    
    var EVENT_TRIGGER_UNKNOWN               = 0;
    var EVENT_TRIGGER_ON_SLIDE_BEGIN        = 1; // eslint-disable-line no-unused-vars
    var EVENT_TRIGGER_ON_SLIDE_END          = 2; // eslint-disable-line no-unused-vars
    var EVENT_TRIGGER_BEGIN_EVENT           = 3;
    var EVENT_TRIGGER_END_EVENT             = 4;
    var EVENT_TRIGGER_ON_CLICK              = 5;
    var EVENT_TRIGGER_ON_DBL_CLICK          = 6; // eslint-disable-line no-unused-vars
    var EVENT_TRIGGER_ON_MOUSE_ENTER        = 7; // eslint-disable-line no-unused-vars
    var EVENT_TRIGGER_ON_MOUSE_LEAVE        = 8; // eslint-disable-line no-unused-vars
    var EVENT_TRIGGER_ON_NEXT_EFFECT        = 9;
    var EVENT_TRIGGER_ON_PREV_EFFECT        = 10;
    var EVENT_TRIGGER_REPEAT                = 11; // eslint-disable-line no-unused-vars
    
    var aEventTriggerOutMap = [ 'unknown', 'slideBegin', 'slideEnd', 'begin', 'end', 'click',
    'doubleClick', 'mouseEnter', 'mouseLeave', 'next', 'previous', 'repeat' ];
    
    
    function getEventTriggerType( sEventTrigger )
    {
    if( sEventTrigger == 'begin' )
    return EVENT_TRIGGER_BEGIN_EVENT;
    else if( sEventTrigger == 'end' )
    return EVENT_TRIGGER_END_EVENT;
    else if( sEventTrigger == 'next' )
    return EVENT_TRIGGER_ON_NEXT_EFFECT;
    else if( sEventTrigger == 'prev' )
    return EVENT_TRIGGER_ON_PREV_EFFECT;
    else if( sEventTrigger == 'click' )
    return EVENT_TRIGGER_ON_CLICK;
    else
    return EVENT_TRIGGER_UNKNOWN;
    }
    
    
    var UNKNOWN_TIMING          = 0;
    var OFFSET_TIMING           = 1;
    var WALLCLOCK_TIMING        = 2; // eslint-disable-line no-unused-vars
    var INDEFINITE_TIMING       = 3;
    var EVENT_TIMING            = 4;
    var SYNCBASE_TIMING         = 5;
    var MEDIA_TIMING            = 6; // eslint-disable-line no-unused-vars
    
    var aTimingTypeOutMap = [ 'unknown', 'offset', 'wallclock', 'indefinite', 'event', 'syncbase', 'media' ];
    
    
    var CHARCODE_PLUS       = '+'.charCodeAt(0);
    var CHARCODE_MINUS      = '-'.charCodeAt(0);
    var CHARCODE_0          = '0'.charCodeAt(0);
    var CHARCODE_9          = '9'.charCodeAt(0);
    
    
    function Timing( aAnimationNode, sTimingAttribute )
    {
    this.aAnimationNode = aAnimationNode;     // the node, the timing attribute belongs to
    this.sTimingDescription = removeWhiteSpaces( sTimingAttribute );
    this.eTimingType = UNKNOWN_TIMING;
    this.nOffset = 0.0;                       // in seconds
    this.sEventBaseElementId = '';            // the element id for event based timing
    this.eEventType = EVENT_TRIGGER_UNKNOWN;  // the event type
    }
    
    Timing.prototype.getAnimationNode = function()
    {
    return this.aAnimationNode;
    };
    
    Timing.prototype.getType = function()
    {
    return this.eTimingType;
    };
    
    Timing.prototype.getOffset = function()
    {
    return this.nOffset;
    };
    
    Timing.prototype.getEventBaseElementId = function()
    {
    return this.sEventBaseElementId;
    };
    
    Timing.prototype.getEventType = function()
    {
    return this.eEventType;
    };
    
    Timing.prototype.parse = function()
    {
    if( !this.sTimingDescription )
    {
    this.eTimingType = OFFSET_TIMING;
    return;
    }
    
    if( this.sTimingDescription == 'indefinite' )
    this.eTimingType = INDEFINITE_TIMING;
    else
    {
    var nFirstCharCode = this.sTimingDescription.charCodeAt(0);
    var bPositiveOffset = !( nFirstCharCode == CHARCODE_MINUS );
    if ( ( nFirstCharCode == CHARCODE_PLUS ) ||
    ( nFirstCharCode == CHARCODE_MINUS ) ||
    ( ( nFirstCharCode >= CHARCODE_0 ) && ( nFirstCharCode <= CHARCODE_9 ) ) )
    {
    var sClockValue
    = ( ( nFirstCharCode == CHARCODE_PLUS ) || ( nFirstCharCode == CHARCODE_MINUS ) )
    ? this.sTimingDescription.substr( 1 )
    : this.sTimingDescription;
    
    var TimeInSec = Timing.parseClockValue( sClockValue );
    if( TimeInSec != undefined )
    {
    this.eTimingType = OFFSET_TIMING;
    this.nOffset = bPositiveOffset ? TimeInSec : -TimeInSec;
    }
    }
    else
    {
    var aTimingSplit = [];
    bPositiveOffset = true;
    if( this.sTimingDescription.indexOf( '+' ) != -1 )
    {
    aTimingSplit = this.sTimingDescription.split( '+' );
    }
    else if( this.sTimingDescription.indexOf( '-' ) != -1 )
    {
    aTimingSplit = this.sTimingDescription.split( '-' );
    bPositiveOffset = false;
    }
    else
    {
    aTimingSplit[0] = this.sTimingDescription;
    aTimingSplit[1] = '';
    }
    
    if( aTimingSplit[0].indexOf( '.' ) != -1 )
    {
    var aEventSplit = aTimingSplit[0].split( '.' );
    this.sEventBaseElementId = aEventSplit[0];
    this.eEventType = getEventTriggerType( aEventSplit[1] );
    }
    else
    {
    this.eEventType = getEventTriggerType( aTimingSplit[0] );
    }
    
    if( this.eEventType == EVENT_TRIGGER_UNKNOWN )
    return;
    
    if( ( this.eEventType == EVENT_TRIGGER_BEGIN_EVENT ) ||
    ( this.eEventType == EVENT_TRIGGER_END_EVENT ) )
    {
    this.eTimingType = SYNCBASE_TIMING;
    }
    else
    {
    this.eTimingType = EVENT_TIMING;
    }
    
    if( aTimingSplit[1] )
    {
    sClockValue = aTimingSplit[1];
    TimeInSec = Timing.parseClockValue( sClockValue );
    if( TimeInSec != undefined )
    {
    this.nOffset = ( bPositiveOffset ) ? TimeInSec : -TimeInSec;
    }
    else
    {
    this.eTimingType = UNKNOWN_TIMING;
    }
    
    }
    }
    }
    
    };
    
    Timing.parseClockValue = function( sClockValue )
    {
    if( !sClockValue )
    return 0.0;
    
    var nTimeInSec = undefined;
    
    var reFullClockValue = /^([0-9]+):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?$/;
    var rePartialClockValue = /^([0-5][0-9]):([0-5][0-9])(.[0-9]+)?$/;
    var reTimeCountValue = /^([0-9]+)(.[0-9]+)?(h|min|s|ms)?$/;
    
    if( reFullClockValue.test( sClockValue ) )
    {
    var aClockTimeParts = reFullClockValue.exec( sClockValue );
    
    var nHours = parseInt( aClockTimeParts[1] );
    var nMinutes = parseInt( aClockTimeParts[2] );
    var nSeconds = parseInt( aClockTimeParts[3] );
    if( aClockTimeParts[4] )
    nSeconds += parseFloat( aClockTimeParts[4] );
    
    nTimeInSec = ( ( nHours * 60 ) +  nMinutes ) * 60 + nSeconds;
    
    }
    else if( rePartialClockValue.test( sClockValue ) )
    {
    aClockTimeParts = rePartialClockValue.exec( sClockValue );
    
    nMinutes = parseInt( aClockTimeParts[1] );
    nSeconds = parseInt( aClockTimeParts[2] );
    if( aClockTimeParts[3] )
    nSeconds += parseFloat( aClockTimeParts[3] );
    
    nTimeInSec = nMinutes * 60 + nSeconds;
    }
    else if( reTimeCountValue.test( sClockValue ) )
    {
    aClockTimeParts = reTimeCountValue.exec( sClockValue );
    
    var nTimeCount = parseInt( aClockTimeParts[1] );
    if( aClockTimeParts[2] )
    nTimeCount += parseFloat( aClockTimeParts[2] );
    
    if( aClockTimeParts[3] )
    {
    if( aClockTimeParts[3] == 'h' )
    {
    nTimeInSec = nTimeCount * 3600;
    }
    else if( aClockTimeParts[3] == 'min' )
    {
    nTimeInSec = nTimeCount * 60;
    }
    else if( aClockTimeParts[3] == 's' )
    {
    nTimeInSec = nTimeCount;
    }
    else if( aClockTimeParts[3] == 'ms' )
    {
    nTimeInSec = nTimeCount / 1000;
    }
    }
    else
    {
    nTimeInSec = nTimeCount;
    }
    
    }
    
    if( nTimeInSec )
    nTimeInSec = parseFloat( nTimeInSec.toFixed( 3 ) );
    return nTimeInSec;
    };
    
    Timing.prototype.info = function( bVerbose )
    {
    
    var sInfo = '';
    
    if( bVerbose )
    {
    sInfo = 'description: ' + this.sTimingDescription + ', ';
    
    sInfo += ', type: ' +  aTimingTypeOutMap[ this.getType() ];
    sInfo += ', offset: ' + this.getOffset();
    sInfo += ', event base element id: ' + this.getEventBaseElementId();
    sInfo += ', timing event type: ' + aEventTriggerOutMap[ this.getEventType() ];
    }
    else
    {
    switch( this.getType() )
    {
    case INDEFINITE_TIMING:
    sInfo += 'indefinite';
    break;
    case OFFSET_TIMING:
    sInfo += this.getOffset();
    break;
    case EVENT_TIMING:
    case SYNCBASE_TIMING:
    if( this.getEventBaseElementId() )
    sInfo += this.getEventBaseElementId() + '.';
    sInfo += aEventTriggerOutMap[ this.getEventType() ];
    if( this.getOffset() )
    {
    if( this.getOffset() > 0 )
    sInfo += '+';
    sInfo += this.getOffset();
    }
    }
    }
    
    return sInfo;
    };
    
    
    function Duration( sDurationAttribute )
    {
    this.bIndefinite = false;
    this.bMedia = false;
    this.nValue = undefined;
    this.bDefined = false;
    
    if( !sDurationAttribute )
    return;
    
    if( sDurationAttribute == 'indefinite' )
    this.bIndefinite = true;
    else if( sDurationAttribute == 'media' )
    this.bMedia = true;
    else
    {
    this.nValue = Timing.parseClockValue( sDurationAttribute );
    if( this.nValue <= 0.0 )
    this.nValue = 0.001;  // duration must be always greater than 0
    }
    this.bDefined = true;
    }
    
    
    Duration.prototype.isSet = function()
    {
    return this.bDefined;
    };
    
    Duration.prototype.isIndefinite = function()
    {
    return this.bIndefinite;
    };
    
    Duration.prototype.isMedia = function()
    {
    return this.bMedia;
    };
    
    Duration.prototype.isValue = function()
    {
    return this.nValue != undefined;
    };
    
    Duration.prototype.getValue= function()
    {
    return this.nValue;
    };
    
    Duration.prototype.info= function()
    {
    var sInfo;
    
    if( this.isIndefinite() )
    sInfo = 'indefinite';
    else if( this.isMedia() )
    sInfo = 'media';
    else if( this.getValue() )
    sInfo = this.getValue();
    
    return sInfo;
    };
    
    
    function AnimationNode()
    {
    }
    
    AnimationNode.prototype.init = function() {};
    AnimationNode.prototype.resolve = function() {};
    AnimationNode.prototype.activate = function() {};
    AnimationNode.prototype.deactivate = function() {};
    AnimationNode.prototype.end = function() {};
    AnimationNode.prototype.getState = function() {};
    AnimationNode.prototype.registerDeactivatingListener = function() {};
    AnimationNode.prototype.notifyDeactivating = function() {};
    
    
    function NodeContext( aSlideShowContext )
    {
    this.aContext = aSlideShowContext;
    this.aAnimationNodeMap = null;
    this.aAnimatedElementMap = null;
    this.aSourceEventElementMap = null;
    this.nStartDelay = 0.0;
    this.bFirstRun = undefined;
    this.aSlideHeight = HEIGHT;
    this.aSlideWidth = WIDTH;
    }
    
    
    NodeContext.prototype.makeSourceEventElement = function( sId, aEventBaseElem )
    {
    if( !aEventBaseElem )
    {
    log( 'NodeContext.makeSourceEventElement: event base element is not valid' );
    return null;
    }
    
    if( !this.aContext.aEventMultiplexer )
    {
    log( 'NodeContext.makeSourceEventElement: event multiplexer not initialized' );
    return null;
    }
    
    if( !this.aSourceEventElementMap[ sId ] )
    {
    this.aSourceEventElementMap[ sId ] = new SourceEventElement( sId, aEventBaseElem, this.aContext.aEventMultiplexer );
    }
    return this.aSourceEventElementMap[ sId ];
    };
    
    
    function StateTransition( aBaseNode )
    {
    this.aNode = aBaseNode;
    this.eToState = INVALID_NODE;
    }
    
    StateTransition.prototype.enter = function( eNodeState, bForce )
    {
    if( !bForce ) bForce = false;
    
    if( this.eToState != INVALID_NODE )
    {
    log( 'StateTransition.enter: commit() before enter()ing again!' );
    return false;
    }
    if( !bForce && !this.aNode.isTransition( this.aNode.getState(), eNodeState  ) )
    return false;
    
    if( ( this.aNode.nCurrentStateTransition & eNodeState ) != 0 )
    return false; // already in wanted transition
    
    this.aNode.nCurrentStateTransition |= eNodeState;
    this.eToState = eNodeState;
    return true;
    };
    
    StateTransition.prototype.commit = function()
    {
    if( this.eToState != INVALID_NODE )
    {
    this.aNode.eCurrentState = this.eToState;
    this.clear();
    }
    };
    
    StateTransition.prototype.clear = function()
    {
    if( this.eToState != INVALID_NODE )
    {
    this.aNode.nCurrentStateTransition &= ~this.eToState;
    this.eToState = INVALID_NODE;
    }
    };
    
    
    function BaseNode( aAnimElem, aParentNode, aNodeContext )
    {
    this.nId = getUniqueId();
    this.sClassName = 'BaseNode';
    
    if( !aAnimElem )
    log( 'BaseNode(id:' + this.nId + ') constructor: aAnimElem is not valid' );
    
    if( !aNodeContext )
    log( 'BaseNode(id:' + this.nId + ') constructor: aNodeContext is not valid' );
    
    if( !aNodeContext.aContext )
    log( 'BaseNode(id:' + this.nId + ') constructor: aNodeContext.aContext is not valid' );
    
    
    this.bIsContainer = false;
    this.aElement = aAnimElem;
    this.aParentNode = aParentNode;
    this.aNodeContext = aNodeContext;
    this.aContext = aNodeContext.aContext;
    this.nStartDelay = aNodeContext.nStartDelay;
    this.eCurrentState = UNRESOLVED_NODE;
    this.nCurrentStateTransition = 0;
    this.aDeactivatingListenerArray = [];
    this.aActivationEvent = null;
    this.aDeactivationEvent = null;
    
    this.aBegin = null;
    this.aDuration = null;
    this.aEnd = null;
    this.bMainSequenceRootNode = false;
    this.bInteractiveSequenceRootNode = false;
    this.eFillMode = FILL_MODE_FREEZE;
    this.eRestartMode = RESTART_MODE_NEVER;
    this.nReapeatCount = undefined;
    this.nAccelerate = 0.0;
    this.nDecelerate = 0.0;
    this.bAutoReverse = false;
    
    }
    extend( BaseNode, AnimationNode );
    
    
    BaseNode.prototype.getId = function()
    {
    return this.nId;
    };
    
    BaseNode.prototype.parseElement = function()
    {
    var aAnimElem = this.aElement;
    
    var sIdAttr = aAnimElem.getAttributeNS( NSS['xml'], 'id' );
    if( sIdAttr )
    this.aNodeContext.aAnimationNodeMap[ sIdAttr ] = this;
    
    this.aBegin = null;
    var sBeginAttr = aAnimElem.getAttributeNS( NSS['smil'], 'begin' );
    this.aBegin = new Timing( this, sBeginAttr );
    this.aBegin.parse();
    
    this.aEnd = null;
    var sEndAttr = aAnimElem.getAttributeNS( NSS['smil'], 'end' );
    if( sEndAttr )
    {
    this.aEnd = new Timing( this, sEndAttr );
    this.aEnd.parse();
    }
    
    this.aDuration = null;
    var sDurAttr = aAnimElem.getAttributeNS( NSS['smil'], 'dur' );
    this.aDuration = new Duration( sDurAttr );
    if( !this.aDuration.isSet() )
    {
    if( this.isContainer() )
    this.aDuration = null;
    else
    this.aDuration = new Duration( 'indefinite' );
    }
    
    var sFillAttr = aAnimElem.getAttributeNS( NSS['smil'], 'fill' );
    if( sFillAttr && aFillModeInMap[ sFillAttr ])
    this.eFillMode = aFillModeInMap[ sFillAttr ];
    else
    this.eFillMode = FILL_MODE_DEFAULT;
    
    var sRestartAttr = aAnimElem.getAttributeNS( NSS['smil'], 'restart' );
    if( sRestartAttr && aRestartModeInMap[ sRestartAttr ] )
    this.eRestartMode = aRestartModeInMap[ sRestartAttr ];
    else
    this.eRestartMode = RESTART_MODE_DEFAULT;
    
    var sRepeatCount = aAnimElem.getAttributeNS( NSS['smil'], 'repeatCount' );
    if( !sRepeatCount )
    this.nReapeatCount = 1;
    else
    this.nReapeatCount = parseFloat( sRepeatCount );
    if( ( isNaN(this.nReapeatCount) ) && ( sRepeatCount != 'indefinite' ) )
    this.nReapeatCount = 1;
    
    this.nAccelerate = 0.0;
    var sAccelerateAttr = aAnimElem.getAttributeNS( NSS['smil'], 'accelerate' );
    if( sAccelerateAttr )
    this.nAccelerate = parseFloat( sAccelerateAttr );
    if( isNaN(this.nAccelerate) )
    this.nAccelerate = 0.0;
    
    this.nDecelerate = 0.0;
    var sDecelerateAttr = aAnimElem.getAttributeNS( NSS['smil'], 'decelerate' );
    if( sDecelerateAttr )
    this.nDecelerate = parseFloat( sDecelerateAttr );
    if( isNaN(this.nDecelerate) )
    this.nDecelerate = 0.0;
    
    this.bAutoreverse = false;
    var sAutoReverseAttr = aAnimElem.getAttributeNS( NSS['smil'], 'autoReverse' );
    if( sAutoReverseAttr == 'true' )
    this.bAutoreverse = true;
    
    
    if( this.eFillMode == FILL_MODE_DEFAULT )
    if( this.getParentNode() )
    this.eFillMode = this.getParentNode().getFillMode();
    else
    this.eFillMode = FILL_MODE_AUTO;
    
    if( this.eFillMode ==  FILL_MODE_AUTO ) // see SMIL recommendation document
    {
    this.eFillMode = ( this.aEnd ||
    ( this.nReapeatCount != 1) ||
    ( this.aDuration && !this.aDuration.isIndefinite() ) )
    ? FILL_MODE_REMOVE
    : FILL_MODE_FREEZE;
    }
    
    if( this.eRestartMode == RESTART_MODE_DEFAULT )
    if( this.getParentNode() )
    this.eRestartMode = this.getParentNode().getRestartMode();
    else
    this.eRestartMode = RESTART_MODE_ALWAYS;
    
    if( ( this.nAccelerate + this.nDecelerate ) > 1.0 )
    {
    this.nAccelerate = 0.0;
    this.nDecelerate = 0.0;
    }
    
    this.aStateTransTable = getTransitionTable( this.getRestartMode(), this.getFillMode() );
    
    return true;
    };
    
    BaseNode.prototype.getParentNode = function()
    {
    return this.aParentNode;
    };
    
    BaseNode.prototype.init = function()
    {
    this.DBG( this.callInfo( 'init' ) );
    if( ! this.checkValidNode() )
    return false;
    if( this.aActivationEvent )
    this.aActivationEvent.dispose();
    if( this.aDeactivationEvent )
    this.aDeactivationEvent.dispose();
    
    this.eCurrentState = UNRESOLVED_NODE;
    
    return this.init_st();
    };
    
    BaseNode.prototype.resolve = function()
    {
    if( ! this.checkValidNode() )
    return false;
    
    this.DBG( this.callInfo( 'resolve' ) );
    
    if( this.eCurrentState == RESOLVED_NODE )
    log( 'BaseNode.resolve: already in RESOLVED state' );
    
    var aStateTrans = new StateTransition( this );
    
    if( aStateTrans.enter( RESOLVED_NODE ) &&
    this.isTransition( RESOLVED_NODE, ACTIVE_NODE ) &&
    this.resolve_st() )
    {
    aStateTrans.commit();
    
    if( this.aActivationEvent )
    {
    this.aActivationEvent.charge();
    }
    else
    {
    this.aActivationEvent = makeDelay( bind( this, this.activate ), this.getBegin().getOffset() + this.nStartDelay );
    }
    registerEvent( this.getId(), this.getBegin(), this.aActivationEvent, this.aNodeContext );
    
    return true;
    }
    
    return false;
    };
    
    BaseNode.prototype.activate = function()
    {
    if( ! this.checkValidNode() )
    return false;
    
    if( this.eCurrentState == ACTIVE_NODE )
    log( 'BaseNode.activate: already in ACTIVE state' );
    
    this.DBG( this.callInfo( 'activate' ), getCurrentSystemTime() );
    
    var aStateTrans = new StateTransition( this );
    
    if( aStateTrans.enter( ACTIVE_NODE ) )
    {
    this.activate_st();
    aStateTrans.commit();
    if( !this.aContext.aEventMultiplexer )
    log( 'BaseNode.activate: this.aContext.aEventMultiplexer is not valid' );
    this.aContext.aEventMultiplexer.notifyEvent( EVENT_TRIGGER_BEGIN_EVENT, this.getId() );
    return true;
    }
    return false;
    };
    
    BaseNode.prototype.deactivate = function()
    {
    if( this.inStateOrTransition( ENDED_NODE | FROZEN_NODE ) || !this.checkValidNode() )
    return;
    
    if( this.isTransition( this.eCurrentState, FROZEN_NODE ) )
    {
    this.DBG( this.callInfo( 'deactivate' ), getCurrentSystemTime() );
    
    var aStateTrans = new StateTransition( this );
    if( aStateTrans.enter( FROZEN_NODE, true /* FORCE */ ) )
    {
    this.deactivate_st( FROZEN_NODE );
    aStateTrans.commit();
    
    this.notifyEndListeners();
    
    if( this.aActivationEvent )
    this.aActivationEvent.dispose();
    if( this.aDeactivationEvent )
    this.aDeactivationEvent.dispose();
    }
    }
    else
    {
    this.end();
    }
    };
    
    BaseNode.prototype.end = function()
    {
    var bIsFrozenOrInTransitionToFrozen = this.inStateOrTransition( FROZEN_NODE );
    if( this.inStateOrTransition( ENDED_NODE ) || !this.checkValidNode() )
    return;
    
    if( !(this.isTransition( this.eCurrentState, ENDED_NODE ) ) )
    log( 'BaseNode.end: end state not reachable in transition table' );
    
    this.DBG( this.callInfo( 'end' ), getCurrentSystemTime() );
    
    var aStateTrans = new StateTransition( this );
    if( aStateTrans.enter( ENDED_NODE, true /* FORCE */ ) )
    {
    this.deactivate_st( ENDED_NODE );
    aStateTrans.commit();
    
    if( !bIsFrozenOrInTransitionToFrozen )
    this.notifyEndListeners();
    
    if( this.aActivationEvent )
    this.aActivationEvent.dispose();
    if( this.aDeactivationEvent )
    this.aDeactivationEvent.dispose();
    }
    };
    
    BaseNode.prototype.dispose = function()
    {
    if( this.aActivationEvent )
    this.aActivationEvent.dispose();
    if( this.aDeactivationEvent )
    this.aDeactivationEvent.dispose();
    this.aDeactivatingListenerArray = [];
    };
    
    BaseNode.prototype.getState = function()
    {
    return this.eCurrentState;
    };
    
    BaseNode.prototype.registerDeactivatingListener = function( aNotifiee )
    {
    if (! this.checkValidNode())
    return false;
    
    if( !aNotifiee )
    {
    log( 'BaseNode.registerDeactivatingListener(): invalid notifiee' );
    return false;
    }
    this.aDeactivatingListenerArray.push( aNotifiee );
    
    return true;
    };
    
    BaseNode.prototype.notifyDeactivating = function( aNotifier )
    {
    assert( ( aNotifier.getState() == FROZEN_NODE ) || ( aNotifier.getState() == ENDED_NODE ),
    'BaseNode.notifyDeactivating: Notifier node is neither in FROZEN nor in ENDED state' );
    };
    
    BaseNode.prototype.isMainSequenceRootNode = function()
    {
    return this.bMainSequenceRootNode;
    };
    
    BaseNode.prototype.isInteractiveSequenceRootNode = function()
    {
    return this.bInteractiveSequenceRootNode;
    };
    
    BaseNode.prototype.makeDeactivationEvent = function( nDelay )
    {
    if( this.aDeactivationEvent )
    {
    this.aDeactivationEvent.charge();
    }
    else
    {
    if( typeof( nDelay ) == typeof(0) )
    this.aDeactivationEvent = makeDelay( bind( this, this.deactivate ), nDelay );
    else
    this.aDeactivationEvent = null;
    }
    return this.aDeactivationEvent;
    };
    
    BaseNode.prototype.scheduleDeactivationEvent = function( aEvent )
    {
    this.DBG( this.callInfo( 'scheduleDeactivationEvent' ) );
    
    if( !aEvent )
    {
    if( this.getDuration() && this.getDuration().isValue() )
    aEvent = this.makeDeactivationEvent( this.getDuration().getValue() );
    }
    if( aEvent )
    {
    this.aContext.aTimerEventQueue.addEvent( aEvent );
    }
    };
    
    BaseNode.prototype.checkValidNode = function()
    {
    return ( this.eCurrentState != INVALID_NODE );
    };
    
    BaseNode.prototype.init_st = function()
    {
    return true;
    };
    
    BaseNode.prototype.resolve_st = function()
    {
    return true;
    };
    
    BaseNode.prototype.activate_st = function()
    {
    this.scheduleDeactivationEvent();
    };
    
    BaseNode.prototype.deactivate_st = function( /*aNodeState*/ )
    {
    };
    
    BaseNode.prototype.notifyEndListeners = function()
    {
    var nDeactivatingListenerCount = this.aDeactivatingListenerArray.length;
    
    for( var i = 0; i < nDeactivatingListenerCount; ++i )
    {
    this.aDeactivatingListenerArray[i].notifyDeactivating( this );
    }
    
    this.aContext.aEventMultiplexer.notifyEvent( EVENT_TRIGGER_END_EVENT, this.getId() );
    if( this.getParentNode() && this.getParentNode().isMainSequenceRootNode() )
    this.aContext.aEventMultiplexer.notifyNextEffectEndEvent();
    
    if( this.isMainSequenceRootNode() )
    this.aContext.aEventMultiplexer.notifyAnimationsEndEvent();
    };
    
    BaseNode.prototype.getContext = function()
    {
    return this.aContext;
    };
    
    BaseNode.prototype.isTransition = function( eFromState, eToState )
    {
    return ( ( this.aStateTransTable[ eFromState ] & eToState ) != 0 );
    };
    
    BaseNode.prototype.inStateOrTransition = function( nMask )
    {
    return ( ( ( this.eCurrentState & nMask ) != 0 ) || ( ( this.nCurrentStateTransition & nMask ) != 0 ) );
    };
    
    BaseNode.prototype.isContainer = function()
    {
    return this.bIsContainer;
    };
    
    BaseNode.prototype.getBegin = function()
    {
    return this.aBegin;
    };
    
    BaseNode.prototype.getDuration = function()
    {
    return this.aDuration;
    };
    
    BaseNode.prototype.getEnd = function()
    {
    return this.aEnd;
    };
    
    BaseNode.prototype.getFillMode = function()
    {
    return this.eFillMode;
    };
    
    BaseNode.prototype.getRestartMode = function()
    {
    return this.eRestartMode;
    };
    
    BaseNode.prototype.getRepeatCount = function()
    {
    return this.nReapeatCount;
    };
    
    BaseNode.prototype.getAccelerateValue = function()
    {
    return this.nAccelerate;
    };
    
    BaseNode.prototype.getDecelerateValue = function()
    {
    return this.nDecelerate;
    };
    
    BaseNode.prototype.isAutoReverseEnabled = function()
    {
    return this.bAutoreverse;
    };
    
    BaseNode.prototype.info = function( bVerbose )
    {
    var sInfo = 'class name: ' + this.sClassName;
    sInfo += ';  element name: ' + this.aElement.localName;
    sInfo += ';  id: ' + this.getId();
    sInfo += ';  state: ' + getNodeStateName( this.getState() );
    
    if( bVerbose )
    {
    sInfo += ';  is container: ' + this.isContainer();
    
    if( this.getBegin() )
    sInfo += ';  begin: ' + this.getBegin().info();
    
    if( this.getDuration() )
    sInfo += ';  dur: ' + this.getDuration().info();
    
    if( this.getEnd() )
    sInfo += ';  end: ' + this.getEnd().info();
    
    if( this.getFillMode() )
    sInfo += ';  fill: ' + aFillModeOutMap[ this.getFillMode() ];
    
    if( this.getRestartMode() )
    sInfo += ';  restart: ' + aRestartModeOutMap[ this.getRestartMode() ];
    
    if( this.getRepeatCount() && ( this.getRepeatCount() != 1.0 ) )
    sInfo += ';  repeatCount: ' + this.getRepeatCount();
    
    if( this.getAccelerateValue() )
    sInfo += ';  accelerate: ' + this.getAccelerateValue();
    
    if( this.getDecelerateValue() )
    sInfo += ';  decelerate: ' + this.getDecelerateValue();
    
    if( this.isAutoReverseEnabled() )
    sInfo += ';  autoReverse: true';
    
    }
    
    return sInfo;
    };
    
    BaseNode.prototype.callInfo = function( sMethodName )
    {
    var sInfo = this.sClassName +
    '( ' + this.getId() +
    ', ' + getNodeStateName( this.getState() ) +
    ' ).' + sMethodName;
    return sInfo;
    };
    
    BaseNode.prototype.DBG = function( sMessage, nTime )
    {
    ANIMDBG.print( sMessage, nTime );
    };
    
    
    function AnimationBaseNode( aAnimElem, aParentNode, aNodeContext )
    {
    AnimationBaseNode.superclass.constructor.call( this, aAnimElem, aParentNode, aNodeContext );
    
    this.sClassName = 'AnimationBaseNode';
    this.bIsContainer = false;
    this.aTargetElement = null;
    this.bIsTargetTextElement = false;
    this.aAnimatedElement = null;
    this.aActivity = null;
    
    this.nMinFrameCount = undefined;
    this.eAdditiveMode = undefined;
    
    }
    extend( AnimationBaseNode, BaseNode );
    
    
    AnimationBaseNode.prototype.parseElement = function()
    {
    var bRet = AnimationBaseNode.superclass.parseElement.call( this );
    
    var aAnimElem = this.aElement;
    
    this.aTargetElement = null;
    var sTargetElementAttr = aAnimElem.getAttributeNS( NSS['smil'], 'targetElement' );
    if( sTargetElementAttr )
    this.aTargetElement = document.getElementById( sTargetElementAttr );
    
    if( !this.aTargetElement )
    {
    this.eCurrentState = INVALID_NODE;
    log( 'AnimationBaseNode.parseElement: target element not found: ' + sTargetElementAttr );
    }
    
    var sSubItemAttr = aAnimElem.getAttributeNS( NSS['anim'], 'sub-item' );
    this.bIsTargetTextElement = ( sSubItemAttr && ( sSubItemAttr === 'text' ) );
    
    var sAdditiveAttr = aAnimElem.getAttributeNS( NSS['smil'], 'additive' );
    if( sAdditiveAttr && aAddittiveModeInMap[sAdditiveAttr] )
    this.eAdditiveMode = aAddittiveModeInMap[sAdditiveAttr];
    else
    this.eAdditiveMode = ADDITIVE_MODE_REPLACE;
    
    this.nMinFrameCount = ( this.getDuration().isValue() )
    ? ( this.getDuration().getValue() * MINIMUM_FRAMES_PER_SECONDS )
    : MINIMUM_FRAMES_PER_SECONDS;
    if( this.nMinFrameCount < 1.0 )
    this.nMinFrameCount = 1;
    else if( this.nMinFrameCount > MINIMUM_FRAMES_PER_SECONDS )
    this.nMinFrameCount = MINIMUM_FRAMES_PER_SECONDS;
    
    
    if( this.aTargetElement )
    {
    if( aAnimElem.getAttributeNS( NSS['smil'], 'attributeName' ) === 'visibility' )
    {
    if( aAnimElem.getAttributeNS( NSS['smil'], 'to' ) === 'visible' )
    this.aTargetElement.setAttribute( 'visibility', 'hidden' );
    }
    
    if( !this.aNodeContext.aAnimatedElementMap[ sTargetElementAttr ] )
    {
    if( this.bIsTargetTextElement )
    {
    this.aNodeContext.aAnimatedElementMap[ sTargetElementAttr ]
    = new AnimatedTextElement( this.aTargetElement );
    }
    else
    {
    this.aNodeContext.aAnimatedElementMap[ sTargetElementAttr ]
    = new AnimatedElement( this.aTargetElement );
    }
    }
    this.aAnimatedElement = this.aNodeContext.aAnimatedElementMap[ sTargetElementAttr ];
    
    this.aAnimatedElement.setAdditiveMode( this.eAdditiveMode );
    }
    
    
    return bRet;
    };
    
    AnimationBaseNode.prototype.init_st = function()
    {
    if( this.aActivity )
    this.aActivity.activate( makeEvent( bind( this, this.deactivate ) ) );
    else
    this.aActivity = this.createActivity();
    return true;
    };
    
    AnimationBaseNode.prototype.resolve_st = function()
    {
    return true;
    };
    
    AnimationBaseNode.prototype.activate_st = function()
    {
    if( this.aActivity )
    {
    this.saveStateOfAnimatedElement();
    this.aActivity.setTargets( this.getAnimatedElement() );
    if( this.getContext().bIsSkipping  )
    {
    this.aActivity.end();
    }
    else
    {
    this.getContext().aActivityQueue.addActivity( this.aActivity );
    }
    }
    else
    {
    AnimationBaseNode.superclass.scheduleDeactivationEvent.call( this );
    }
    };
    
    AnimationBaseNode.prototype.deactivate_st = function( eDestState )
    {
    if( eDestState == FROZEN_NODE )
    {
    if( this.aActivity )
    this.aActivity.end();
    }
    if( eDestState == ENDED_NODE )
    {
    if( this.aActivity )
    this.aActivity.dispose();
    if( ( this.getFillMode() == FILL_MODE_REMOVE ) && this.getAnimatedElement()  )
    this.removeEffect();
    }
    };
    
    AnimationBaseNode.prototype.createActivity = function()
    {
    log( 'AnimationBaseNode.createActivity: abstract method called' );
    };
    
    AnimationBaseNode.prototype.fillActivityParams = function()
    {
    
    var nDuration = 0.001;
    if( this.getDuration().isValue() )
    {
    nDuration = this.getDuration().getValue();
    }
    else
    {
    log( 'AnimationBaseNode.fillActivityParams: duration is not a number' );
    }
    
    var aActivityParamSet = new ActivityParamSet();
    
    aActivityParamSet.aEndEvent             = makeEvent( bind( this, this.deactivate ) );
    aActivityParamSet.aTimerEventQueue      = this.aContext.aTimerEventQueue;
    aActivityParamSet.aActivityQueue        = this.aContext.aActivityQueue;
    aActivityParamSet.nMinDuration          = nDuration;
    aActivityParamSet.nMinNumberOfFrames    = this.getMinFrameCount();
    aActivityParamSet.bAutoReverse          = this.isAutoReverseEnabled();
    aActivityParamSet.nRepeatCount          = this.getRepeatCount();
    aActivityParamSet.nAccelerationFraction = this.getAccelerateValue();
    aActivityParamSet.nDecelerationFraction = this.getDecelerateValue();
    aActivityParamSet.nSlideWidth           = this.aNodeContext.aSlideWidth;
    aActivityParamSet.nSlideHeight          = this.aNodeContext.aSlideHeight;
    
    return aActivityParamSet;
    };
    
    AnimationBaseNode.prototype.hasPendingAnimation = function()
    {
    return true;
    };
    
    AnimationBaseNode.prototype.saveStateOfAnimatedElement = function()
    {
    this.getAnimatedElement().saveState( this.getId() );
    };
    
    AnimationBaseNode.prototype.removeEffect = function()
    {
    this.getAnimatedElement().restoreState( this.getId() );
    };
    
    AnimationBaseNode.prototype.getTargetElement = function()
    {
    return this.aTargetElement;
    };
    
    AnimationBaseNode.prototype.getAnimatedElement = function()
    {
    return this.aAnimatedElement;
    };
    
    AnimationBaseNode.prototype.dispose= function()
    {
    if( this.aActivity )
    this.aActivity.dispose();
    
    AnimationBaseNode.superclass.dispose.call( this );
    };
    
    AnimationBaseNode.prototype.getMinFrameCount = function()
    {
    return this.nMinFrameCount;
    };
    
    AnimationBaseNode.prototype.getAdditiveMode = function()
    {
    return this.eAdditiveMode;
    };
    
    AnimationBaseNode.prototype.info = function( bVerbose )
    {
    var sInfo = AnimationBaseNode.superclass.info.call( this, bVerbose );
    
    if( bVerbose )
    {
    if( this.getMinFrameCount() )
    sInfo += ';  min frame count: ' + this.getMinFrameCount();
    
    sInfo += ';  additive: ' + aAddittiveModeOutMap[ this.getAdditiveMode() ];
    
    if( this.getTargetElement() )
    {
    var sElemId = this.getTargetElement().getAttribute( 'id' );
    sInfo += ';  targetElement: ' +  sElemId;
    }
    }
    
    return sInfo;
    };
    
    
    function AnimationBaseNode2( aAnimElem, aParentNode, aNodeContext )
    {
    AnimationBaseNode2.superclass.constructor.call( this, aAnimElem, aParentNode, aNodeContext );
    
    this.sAttributeName = '';
    this.aToValue = null;
    
    }
    extend( AnimationBaseNode2, AnimationBaseNode );
    
    
    AnimationBaseNode2.prototype.parseElement = function()
    {
    var bRet = AnimationBaseNode2.superclass.parseElement.call( this );
    
    var aAnimElem = this.aElement;
    
    this.sAttributeName = aAnimElem.getAttributeNS( NSS['smil'], 'attributeName' );
    if( !this.sAttributeName )
    {
    this.eCurrentState = INVALID_NODE;
    log( 'AnimationBaseNode2.parseElement: target attribute name not found: ' + this.sAttributeName );
    }
    
    this.aToValue = aAnimElem.getAttributeNS( NSS['smil'], 'to' );
    
    return bRet;
    };
    
    AnimationBaseNode2.prototype.getAttributeName = function()
    {
    return this.sAttributeName;
    };
    
    AnimationBaseNode2.prototype.getToValue = function()
    {
    return this.aToValue;
    };
    
    AnimationBaseNode2.prototype.info = function( bVerbose )
    {
    var sInfo = AnimationBaseNode2.superclass.info.call( this, bVerbose );
    
    if( bVerbose )
    {
    if( this.getAttributeName() )
    sInfo += ';  attributeName: ' + this.getAttributeName();
    
    if( this.getToValue() )
    sInfo += ';  to: ' + this.getToValue();
    }
    
    return sInfo;
    };
    
    
    function AnimationBaseNode3( aAnimElem, aParentNode, aNodeContext )
    {
    AnimationBaseNode3.superclass.constructor.call( this, aAnimElem, aParentNode, aNodeContext );
    
    this.eAccumulate = undefined;
    this.eCalcMode = undefined;
    this.aFromValue = null;
    this.aByValue = null;
    this.aKeyTimes = null;
    this.aValues = null;
    this.aFormula= null;
    }
    extend( AnimationBaseNode3, AnimationBaseNode2 );
    
    
    AnimationBaseNode3.prototype.parseElement = function()
    {
    var bRet = AnimationBaseNode3.superclass.parseElement.call( this );
    
    var aAnimElem = this.aElement;
    
    this.eAccumulate = ACCUMULATE_MODE_NONE;
    var sAccumulateAttr = aAnimElem.getAttributeNS( NSS['smil'], 'accumulate' );
    if( sAccumulateAttr == 'sum' )
    this.eAccumulate = ACCUMULATE_MODE_SUM;
    
    this.eCalcMode = CALC_MODE_LINEAR;
    var sCalcModeAttr = aAnimElem.getAttributeNS( NSS['smil'], 'calcMode' );
    if( sCalcModeAttr && aCalcModeInMap[ sCalcModeAttr ] )
    this.eCalcMode = aCalcModeInMap[ sCalcModeAttr ];
    
    this.aFromValue = aAnimElem.getAttributeNS( NSS['smil'], 'from' );
    
    this.aByValue = aAnimElem.getAttributeNS( NSS['smil'], 'by' );
    
    this.aKeyTimes = [];
    var sKeyTimesAttr = aAnimElem.getAttributeNS( NSS['smil'], 'keyTimes' );
    sKeyTimesAttr = removeWhiteSpaces( sKeyTimesAttr );
    if( sKeyTimesAttr )
    {
    var aKeyTimes = sKeyTimesAttr.split( ';' );
    for( var i = 0; i < aKeyTimes.length; ++i )
    this.aKeyTimes.push( parseFloat( aKeyTimes[i] ) );
    }
    
    var sValuesAttr = aAnimElem.getAttributeNS( NSS['smil'], 'values' );
    if( sValuesAttr )
    {
    this.aValues = sValuesAttr.split( ';' );
    }
    else
    {
    this.aValues = [];
    }
    
    this.aFormula = aAnimElem.getAttributeNS( NSS['anim'], 'formula' );
    
    return bRet;
    };
    
    AnimationBaseNode3.prototype.getAccumulate = function()
    {
    return this.eAccumulate;
    };
    
    AnimationBaseNode3.prototype.getCalcMode = function()
    {
    return this.eCalcMode;
    };
    
    AnimationBaseNode3.prototype.getFromValue = function()
    {
    return this.aFromValue;
    };
    
    AnimationBaseNode3.prototype.getByValue = function()
    {
    return this.aByValue;
    };
    
    AnimationBaseNode3.prototype.getKeyTimes = function()
    {
    return this.aKeyTimes;
    };
    
    AnimationBaseNode3.prototype.getValues = function()
    {
    return this.aValues;
    };
    
    AnimationBaseNode3.prototype.getFormula = function()
    {
    return this.aFormula;
    };
    
    AnimationBaseNode3.prototype.info = function( bVerbose )
    {
    var sInfo = AnimationBaseNode3.superclass.info.call( this, bVerbose );
    
    if( bVerbose )
    {
    if( this.getAccumulate() )
    sInfo += ';  accumulate: ' + aAccumulateModeOutMap[ this.getAccumulate() ];
    
    sInfo += ';  calcMode: ' + aCalcModeOutMap[ this.getCalcMode() ];
    
    if( this.getFromValue() )
    sInfo += ';  from: ' + this.getFromValue();
    
    if( this.getByValue() )
    sInfo += ';  by: ' + this.getByValue();
    
    if( this.getKeyTimes().length )
    sInfo += ';  keyTimes: ' + this.getKeyTimes().join( ',' );
    
    if( this.getValues().length )
    sInfo += ';  values: ' + this.getValues().join( ',' );
    
    if( this.getFormula() )
    sInfo += ';  formula: ' + this.getFormula();
    }
    
    return sInfo;
    };
    
    
    function BaseContainerNode( aAnimElem, aParentNode, aNodeContext )
    {
    BaseContainerNode.superclass.constructor.call( this, aAnimElem, aParentNode, aNodeContext );
    
    this.sClassName = 'BaseContainerNode';
    this.bIsContainer = true;
    this.aChildrenArray = [];
    this.nFinishedChildren = 0;
    this.bDurationIndefinite = false;
    this.nLeftIterations = 1;
    
    this.eImpressNodeType = undefined;
    this.ePresetClass =  undefined;
    this.ePresetId =  undefined;
    }
    extend( BaseContainerNode, BaseNode );
    
    
    BaseContainerNode.prototype.parseElement= function()
    {
    var bRet = BaseContainerNode.superclass.parseElement.call( this );
    
    var aAnimElem = this.aElement;
    
    this.eImpressNodeType = IMPRESS_DEFAULT_NODE;
    var sNodeTypeAttr = aAnimElem.getAttributeNS( NSS['presentation'], 'node-type' );
    if( sNodeTypeAttr && aImpressNodeTypeInMap[ sNodeTypeAttr ] )
    this.eImpressNodeType = aImpressNodeTypeInMap[ sNodeTypeAttr ];
    this.bMainSequenceRootNode = ( this.eImpressNodeType == IMPRESS_MAIN_SEQUENCE_NODE );
    this.bInteractiveSequenceRootNode = ( this.eImpressNodeType == IMPRESS_INTERACTIVE_SEQUENCE_NODE );
    
    this.ePresetClass =  undefined;
    var sPresetClassAttr = aAnimElem.getAttributeNS( NSS['presentation'], 'preset-class' );
    if( sPresetClassAttr && aPresetClassInMap[ sPresetClassAttr ] )
    this.ePresetClass = aPresetClassInMap[ sPresetClassAttr ];
    
    this.ePresetId =  undefined;
    var sPresetIdAttr = aAnimElem.getAttributeNS( NSS['presentation'], 'preset-id' );
    if( sPresetIdAttr && aPresetIdInMap[ sPresetIdAttr ] )
    this.ePresetId = aPresetIdInMap[ sPresetIdAttr ];
    
    
    var nChildrenCount = this.aChildrenArray.length;
    for( var i = 0; i < nChildrenCount; ++i )
    {
    this.aChildrenArray[i].parseElement();
    }
    
    
    this.bDurationIndefinite
    = ( !this.getDuration() || this.getDuration().isIndefinite()  ) &&
    ( !this.getEnd() || ( this.getEnd().getType() != OFFSET_TIMING ) );
    
    return bRet;
    };
    
    BaseContainerNode.prototype.appendChildNode = function( aAnimationNode )
    {
    if( ! this.checkValidNode() )
    return ;
    
    if( aAnimationNode.registerDeactivatingListener( this ) )
    this.aChildrenArray.push( aAnimationNode );
    };
    
    BaseContainerNode.prototype.removeAllChildrenNodes = function()
    {
    this.aChildrenArray = [];
    };
    
    BaseContainerNode.prototype.init_st = function()
    {
    this.nLeftIterations = this.getRepeatCount();
    
    return this.init_children();
    };
    
    BaseContainerNode.prototype.init_children = function()
    {
    this.nFinishedChildren = 0;
    var nChildrenCount = this.aChildrenArray.length;
    var nInitChildren = 0;
    for( var i = 0; i < nChildrenCount; ++i )
    {
    if( this.aChildrenArray[i].init() )
    {
    ++nInitChildren;
    }
    }
    return ( nChildrenCount == nInitChildren );
    };
    
    
    BaseContainerNode.prototype.deactivate_st = function( eDestState )
    {
    this.nLeftIterations = 0;
    if( eDestState == FROZEN_NODE )
    {
    this.forEachChildNode( mem_fn( 'deactivate' ), ~( FROZEN_NODE | ENDED_NODE ) );
    }
    else
    {
    this.forEachChildNode( mem_fn( 'end' ), ~ENDED_NODE );
    if( this.getFillMode() == FILL_MODE_REMOVE )
    this.removeEffect();
    }
    };
    
    BaseContainerNode.prototype.hasPendingAnimation = function()
    {
    var nChildrenCount = this.aChildrenArray.length;
    for( var i = 0; i < nChildrenCount; ++i )
    {
    if( this.aChildrenArray[i].hasPendingAnimation() )
    return true;
    }
    return false;
    };
    
    BaseContainerNode.prototype.activate_st = function()
    {
    log( 'BaseContainerNode.activate_st: abstract method called' );
    };
    
    BaseContainerNode.prototype.notifyDeactivating = function( /*aAnimationNode*/ )
    {
    log( 'BaseContainerNode.notifyDeactivating: abstract method called' );
    };
    
    BaseContainerNode.prototype.isDurationIndefinite = function()
    {
    return this.bDurationIndefinite;
    };
    
    BaseContainerNode.prototype.isChildNode = function( aAnimationNode )
    {
    var nChildrenCount = this.aChildrenArray.length;
    for( var i = 0; i < nChildrenCount; ++i )
    {
    if( this.aChildrenArray[i].getId() == aAnimationNode.getId() )
    return true;
    }
    return false;
    };
    
    BaseContainerNode.prototype.notifyDeactivatedChild = function( aChildNode )
    {
    assert( ( aChildNode.getState() == FROZEN_NODE ) || ( aChildNode.getState() == ENDED_NODE ),
    'BaseContainerNode.notifyDeactivatedChild: passed child node is neither in FROZEN nor in ENDED state' );
    
    assert( this.getState() != INVALID_NODE,
    'BaseContainerNode.notifyDeactivatedChild: this node is invalid' );
    
    if( !this.isChildNode( aChildNode ) )
    {
    log( 'BaseContainerNode.notifyDeactivatedChild: unknown child notifier!' );
    return false;
    }
    
    var nChildrenCount = this.aChildrenArray.length;
    
    assert( ( this.nFinishedChildren < nChildrenCount ),
    'BaseContainerNode.notifyDeactivatedChild: assert(this.nFinishedChildren < nChildrenCount) failed' );
    
    ++this.nFinishedChildren;
    var bFinished = ( this.nFinishedChildren >= nChildrenCount );
    
    if( bFinished && this.isDurationIndefinite() )
    {
    if( this.nLeftIterations >= 1.0 )
    {
    this.nLeftIterations -= 1.0;
    }
    if( this.nLeftIterations >= 1.0 )
    {
    bFinished = false;
    var aRepetitionEvent = makeDelay( bind( this, this.repeat ), 0.0 );
    this.aContext.aTimerEventQueue.addEvent( aRepetitionEvent );
    }
    else
    {
    this.deactivate();
    }
    }
    
    return bFinished;
    };
    
    BaseContainerNode.prototype.repeat = function()
    {
    this.forEachChildNode( mem_fn( 'end' ), ~ENDED_NODE );
    this.removeEffect();
    var bInitialized = this.init_children();
    if( bInitialized )
    this.activate_st();
    return bInitialized;
    };
    
    BaseContainerNode.prototype.removeEffect = function()
    {
    var nChildrenCount = this.aChildrenArray.length;
    if( nChildrenCount == 0 )
    return;
    for( var i = nChildrenCount - 1; i >= 0; --i )
    {
    if( ( this.aChildrenArray[i].getState() & ( FROZEN_NODE | ENDED_NODE ) ) == 0 )
    {
    log( 'BaseContainerNode.removeEffect: child(id:'
    + this.aChildrenArray[i].getId() + ') is neither frozen nor ended;'
    + ' state: '
    + aTransitionModeOutMap[ this.aChildrenArray[i].getState() ] );
    continue;
    }
    this.aChildrenArray[i].removeEffect();
    }
    };
    
    BaseContainerNode.prototype.saveStateOfAnimatedElement = function()
    {
    var nChildrenCount = this.aChildrenArray.length;
    for( var i = 0; i < nChildrenCount; ++i )
    {
    this.aChildrenArray[i].saveStateOfAnimatedElement();
    }
    };
    
    BaseContainerNode.prototype.forEachChildNode = function( aFunction, eNodeStateMask )
    {
    if( !eNodeStateMask )
    eNodeStateMask = -1;
    
    var nChildrenCount = this.aChildrenArray.length;
    for( var i = 0; i < nChildrenCount; ++i )
    {
    if( ( eNodeStateMask != -1 ) && ( ( this.aChildrenArray[i].getState() & eNodeStateMask ) == 0 ) )
    continue;
    aFunction( this.aChildrenArray[i] );
    }
    };
    
    BaseContainerNode.prototype.dispose = function()
    {
    var nChildrenCount = this.aChildrenArray.length;
    for( var i = 0; i < nChildrenCount; ++i )
    {
    this.aChildrenArray[i].dispose();
    }
    
    BaseContainerNode.superclass.dispose.call( this );
    };
    
    BaseContainerNode.prototype.getImpressNodeType = function()
    {
    return this.eImpressNodeType;
    };
    
    BaseContainerNode.prototype.info = function( bVerbose )
    {
    var sInfo = BaseContainerNode.superclass.info.call( this, bVerbose );
    
    if( bVerbose )
    {
    if( this.getImpressNodeType() )
    sInfo += ';  node-type: ' + aImpressNodeTypeOutMap[ this.getImpressNodeType() ];
    }
    
    var nChildrenCount = this.aChildrenArray.length;
    for( var i = 0; i < nChildrenCount; ++i )
    {
    sInfo += '\n';
    sInfo += this.aChildrenArray[i].info( bVerbose );
    }
    
    return sInfo;
    };
    
    
    function ParallelTimeContainer( aAnimElem, aParentNode, aNodeContext )
    {
    ParallelTimeContainer.superclass.constructor.call( this, aAnimElem, aParentNode, aNodeContext );
    
    this.sClassName = 'ParallelTimeContainer';
    }
    extend( ParallelTimeContainer, BaseContainerNode );
    
    
    ParallelTimeContainer.prototype.activate_st = function()
    {
    var nChildrenCount = this.aChildrenArray.length;
    var nResolvedChildren = 0;
    for( var i = 0; i < nChildrenCount; ++i )
    {
    if( this.aChildrenArray[i].resolve() )
    {
    ++nResolvedChildren;
    }
    }
    
    if( nChildrenCount != nResolvedChildren )
    {
    log( 'ParallelTimeContainer.activate_st: resolving all children failed' );
    return;
    }
    
    
    if( this.isDurationIndefinite() && ( nChildrenCount == 0  ) )
    {
    this.scheduleDeactivationEvent( this.makeDeactivationEvent( 0.0 ) );
    }
    else
    {
    this.scheduleDeactivationEvent();
    }
    };
    
    ParallelTimeContainer.prototype.notifyDeactivating = function( aAnimationNode )
    {
    this.notifyDeactivatedChild( aAnimationNode );
    };
    
    
    function SequentialTimeContainer( aAnimElem, aParentNode, aNodeContext )
    {
    SequentialTimeContainer.superclass.constructor.call( this, aAnimElem, aParentNode, aNodeContext );
    
    this.sClassName = 'SequentialTimeContainer';
    this.bIsRewinding = false;
    this.aCurrentSkipEvent = null;
    this.aRewindCurrentEffectEvent = null;
    this.aRewindLastEffectEvent = null;
    }
    extend( SequentialTimeContainer, BaseContainerNode );
    
    
    SequentialTimeContainer.prototype.activate_st = function()
    {
    var nChildrenCount = this.aChildrenArray.length;
    for( ; this.nFinishedChildren < nChildrenCount; ++this.nFinishedChildren )
    {
    if( this.resolveChild( this.aChildrenArray[ this.nFinishedChildren ] ) )
    break;
    else
    log( 'SequentialTimeContainer.activate_st: resolving child failed!' );
    }
    
    if( this.isDurationIndefinite() && ( ( nChildrenCount == 0 ) || ( this.nFinishedChildren >= nChildrenCount ) ) )
    {
    this.scheduleDeactivationEvent( this.makeDeactivationEvent( 0.0 ) );
    }
    else
    {
    this.scheduleDeactivationEvent();
    }
    };
    
    SequentialTimeContainer.prototype.notifyDeactivating = function( aNotifier )
    {
    if( this.bIsRewinding )
    return;
    
    if( this.notifyDeactivatedChild( aNotifier ) )
    return;
    
    assert( this.nFinishedChildren < this.aChildrenArray.length,
    'SequentialTimeContainer.notifyDeactivating: assertion (this.nFinishedChildren < this.aChildrenArray.length) failed' );
    
    var aNextChild = this.aChildrenArray[ this.nFinishedChildren ];
    
    assert( aNextChild.getState() == UNRESOLVED_NODE,
    'SequentialTimeContainer.notifyDeactivating: assertion (aNextChild.getState == UNRESOLVED_NODE) failed' );
    
    if( !this.resolveChild( aNextChild ) )
    {
    this.deactivate();
    }
    };
    
    SequentialTimeContainer.prototype.skipEffect = function( aChildNode )
    {
    if( this.isChildNode( aChildNode ) )
    {
    this.getContext().aActivityQueue.endAll();
    this.getContext().bIsSkipping = true;
    this.getContext().aTimerEventQueue.forceEmpty();
    this.getContext().bIsSkipping = false;
    var aEvent = makeEvent( bind2( aChildNode.deactivate, aChildNode ) );
    this.getContext().aTimerEventQueue.addEvent( aEvent );
    }
    else
    {
    log( 'SequentialTimeContainer.skipEffect: unknown child: '
    + aChildNode.getId() );
    }
    };
    
    SequentialTimeContainer.prototype.rewindCurrentEffect = function( aChildNode )
    {
    if( this.isChildNode( aChildNode ) )
    {
    assert( !this.bIsRewinding,
    'SequentialTimeContainer.rewindCurrentEffect: is already rewinding.' );
    
    this.bIsRewinding = true;
    this.getContext().aActivityQueue.endAll();
    this.getContext().bIsSkipping = true;
    this.getContext().aTimerEventQueue.forceEmpty();
    this.getContext().bIsSkipping = false;
    this.getContext().aActivityQueue.endAll();
    
    aChildNode.end();
    aChildNode.removeEffect();
    aChildNode.init();
    this.resolveChild( aChildNode );
    this.notifyRewindedEvent( aChildNode );
    this.bIsRewinding = false;
    }
    else
    {
    log( 'SequentialTimeContainer.rewindCurrentEffect: unknown child: '
    + aChildNode.getId() );
    }
    };
    
    SequentialTimeContainer.prototype.rewindLastEffect = function( aChildNode )
    {
    if( this.isChildNode( aChildNode ) )
    {
    assert( !this.bIsRewinding,
    'SequentialTimeContainer.rewindLastEffect: is already rewinding.' );
    
    this.bIsRewinding = true;
    this.getContext().aTimerEventQueue.forceEmpty();
    this.getContext().aActivityQueue.clear();
    aChildNode.end();
    
    --this.nFinishedChildren;
    var aPreviousChildNode = this.aChildrenArray[ this.nFinishedChildren ];
    
    aPreviousChildNode.removeEffect();
    aPreviousChildNode.init();
    aChildNode.init();
    this.resolveChild( aPreviousChildNode );
    this.notifyRewindedEvent( aChildNode );
    this.bIsRewinding = false;
    }
    else
    {
    log( 'SequentialTimeContainer.rewindLastEffect: unknown child: '
    + aChildNode.getId() );
    }
    };
    
    SequentialTimeContainer.prototype.resolveChild = function( aChildNode )
    {
    var bResolved = aChildNode.resolve();
    
    if( bResolved && ( this.isMainSequenceRootNode() || this.isInteractiveSequenceRootNode() ) )
    {
    if( this.aCurrentSkipEvent )
    this.aCurrentSkipEvent.dispose();
    this.aCurrentSkipEvent = makeEvent( bind2( SequentialTimeContainer.prototype.skipEffect, this, aChildNode ) );
    
    if( this.aRewindCurrentEffectEvent )
    this.aRewindCurrentEffectEvent.dispose();
    this.aRewindCurrentEffectEvent = makeEvent( bind2( SequentialTimeContainer.prototype.rewindCurrentEffect, this, aChildNode ) );
    
    if( this.aRewindLastEffectEvent )
    this.aRewindLastEffectEvent.dispose();
    this.aRewindLastEffectEvent = makeEvent( bind2( SequentialTimeContainer.prototype.rewindLastEffect, this, aChildNode ) );
    
    if( this.isMainSequenceRootNode() )
    {
    this.aContext.aEventMultiplexer.registerSkipEffectEvent( this.aCurrentSkipEvent );
    this.aContext.aEventMultiplexer.registerRewindCurrentEffectEvent( this.aRewindCurrentEffectEvent );
    this.aContext.aEventMultiplexer.registerRewindLastEffectEvent( this.aRewindLastEffectEvent );
    }
    else if( this.isInteractiveSequenceRootNode() )
    {
    this.aContext.aEventMultiplexer.registerSkipInteractiveEffectEvent( aChildNode.getId(), this.aCurrentSkipEvent );
    this.aContext.aEventMultiplexer.registerRewindRunningInteractiveEffectEvent( aChildNode.getId(), this.aRewindCurrentEffectEvent );
    this.aContext.aEventMultiplexer.registerRewindEndedInteractiveEffectEvent( aChildNode.getId(), this.aRewindLastEffectEvent );
    }
    }
    return bResolved;
    };
    
    SequentialTimeContainer.prototype.notifyRewindedEvent = function( aChildNode )
    {
    if( this.isInteractiveSequenceRootNode() )
    {
    this.aContext.aEventMultiplexer.notifyRewindedEffectEvent( aChildNode.getId() );
    
    var sId = aChildNode.getBegin().getEventBaseElementId();
    if( sId )
    {
    this.aContext.aEventMultiplexer.notifyRewindedEffectEvent( sId );
    }
    }
    };
    
    SequentialTimeContainer.prototype.dispose = function()
    {
    if( this.aCurrentSkipEvent )
    this.aCurrentSkipEvent.dispose();
    
    SequentialTimeContainer.superclass.dispose.call( this );
    };
    
    
    function PropertyAnimationNode(  aAnimElem, aParentNode, aNodeContext )
    {
    PropertyAnimationNode.superclass.constructor.call( this, aAnimElem, aParentNode, aNodeContext );
    
    this.sClassName = 'PropertyAnimationNode';
    }
    extend( PropertyAnimationNode, AnimationBaseNode3 );
    
    
    PropertyAnimationNode.prototype.createActivity = function()
    {
    var aActivityParamSet = this.fillActivityParams();
    
    var aAnimation = createPropertyAnimation( this.getAttributeName(),
    this.getAnimatedElement(),
    this.aNodeContext.aSlideWidth,
    this.aNodeContext.aSlideHeight );
    
    var aInterpolator = null;  // createActivity will compute it;
    return createActivity( aActivityParamSet, this, aAnimation, aInterpolator );
    };
    
    
    function AnimationSetNode(  aAnimElem, aParentNode, aNodeContext )
    {
    AnimationSetNode.superclass.constructor.call( this, aAnimElem, aParentNode, aNodeContext );
    
    this.sClassName = 'AnimationSetNode';
    }
    extend( AnimationSetNode, AnimationBaseNode2 );
    
    
    AnimationSetNode.prototype.createActivity = function()
    {
    var aAnimation = createPropertyAnimation( this.getAttributeName(),
    this.getAnimatedElement(),
    this.aNodeContext.aSlideWidth,
    this.aNodeContext.aSlideHeight );
    
    var aActivityParamSet = this.fillActivityParams();
    
    return new SetActivity( aActivityParamSet, aAnimation, this.getToValue() );
    };
    
    
    function AnimationColorNode(  aAnimElem, aParentNode, aNodeContext )
    {
    AnimationColorNode.superclass.constructor.call( this, aAnimElem, aParentNode, aNodeContext );
    
    this.sClassName = 'AnimationColorNode';
    
    this.eColorInterpolation = undefined;
    this.eColorInterpolationDirection = undefined;
    }
    extend( AnimationColorNode, AnimationBaseNode3 );
    
    
    AnimationColorNode.prototype.parseElement = function()
    {
    var bRet = AnimationColorNode.superclass.parseElement.call( this );
    
    var aAnimElem = this.aElement;
    
    this.eColorInterpolation = COLOR_SPACE_RGB;
    var sColorInterpolationAttr = aAnimElem.getAttributeNS( NSS['anim'], 'color-interpolation' );
    if( sColorInterpolationAttr && aColorSpaceInMap[ sColorInterpolationAttr ] )
    this.eColorInterpolation = aColorSpaceInMap[ sColorInterpolationAttr ];
    
    this.eColorInterpolationDirection = CLOCKWISE;
    var sColorInterpolationDirectionAttr = aAnimElem.getAttributeNS( NSS['anim'], 'color-interpolation-direction' );
    if( sColorInterpolationDirectionAttr && aClockDirectionInMap[ sColorInterpolationDirectionAttr ] )
    this.eColorInterpolationDirection = aClockDirectionInMap[ sColorInterpolationDirectionAttr ];
    
    return bRet;
    };
    
    AnimationColorNode.prototype.createActivity = function()
    {
    var aActivityParamSet = this.fillActivityParams();
    
    var aAnimation = createPropertyAnimation( this.getAttributeName(),
    this.getAnimatedElement(),
    this.aNodeContext.aSlideWidth,
    this.aNodeContext.aSlideHeight );
    
    var aColorAnimation;
    var aInterpolator;
    if( this.getColorInterpolation() === COLOR_SPACE_HSL )
    {
    ANIMDBG.print( 'AnimationColorNode.createActivity: color space hsl'  );
    aColorAnimation = new HSLAnimationWrapper( aAnimation );
    var aInterpolatorMaker = aInterpolatorHandler.getInterpolator( this.getCalcMode(),
    COLOR_PROPERTY,
    COLOR_SPACE_HSL );
    aInterpolator = aInterpolatorMaker( this.getColorInterpolationDirection() );
    }
    else
    {
    ANIMDBG.print( 'AnimationColorNode.createActivity: color space rgb'  );
    aColorAnimation = aAnimation;
    aInterpolator = aInterpolatorHandler.getInterpolator( this.getCalcMode(),
    COLOR_PROPERTY,
    COLOR_SPACE_RGB );
    }
    
    return createActivity( aActivityParamSet, this, aColorAnimation, aInterpolator );
    };
    
    AnimationColorNode.prototype.getColorInterpolation = function()
    {
    return this.eColorInterpolation;
    };
    
    AnimationColorNode.prototype.getColorInterpolationDirection = function()
    {
    return this.eColorInterpolationDirection;
    };
    
    AnimationColorNode.prototype.info = function( bVerbose )
    {
    var sInfo = AnimationColorNode.superclass.info.call( this, bVerbose );
    
    if( bVerbose )
    {
    sInfo += ';  color-interpolation: ' + aColorSpaceOutMap[ this.getColorInterpolation() ];
    
    sInfo += ';  color-interpolation-direction: ' + aClockDirectionOutMap[ this.getColorInterpolationDirection() ];
    }
    return sInfo;
    };
    
    
    function AnimationTransitionFilterNode(  aAnimElem, aParentNode, aNodeContext )
    {
    AnimationTransitionFilterNode.superclass.constructor.call( this, aAnimElem, aParentNode, aNodeContext );
    
    this.sClassName = 'AnimationTransitionFilterNode';
    
    this.eTransitionType = undefined;
    this.eTransitionSubType = undefined;
    this.bReverseDirection = undefined;
    this.eTransitionMode = undefined;
    }
    extend( AnimationTransitionFilterNode, AnimationBaseNode );
    
    
    AnimationTransitionFilterNode.prototype.createActivity = function()
    {
    var aActivityParamSet = this.fillActivityParams();
    
    return createShapeTransition( aActivityParamSet,
    this.getAnimatedElement(),
    this.aNodeContext.aSlideWidth,
    this.aNodeContext.aSlideHeight,
    this );
    };
    
    AnimationTransitionFilterNode.prototype.parseElement = function()
    {
    var bRet = AnimationTransitionFilterNode.superclass.parseElement.call( this );
    var bIsValidTransition = true;
    
    var aAnimElem = this.aElement;
    
    this.eTransitionType = undefined;
    var sTypeAttr = aAnimElem.getAttributeNS( NSS['smil'], 'type' );
    if( sTypeAttr && aTransitionTypeInMap[ sTypeAttr ] )
    {
    this.eTransitionType = aTransitionTypeInMap[ sTypeAttr ];
    }
    else
    {
    bIsValidTransition = false;
    log( 'AnimationTransitionFilterNode.parseElement: transition type not valid: ' + sTypeAttr );
    }
    
    this.eTransitionSubType = undefined;
    var sSubTypeAttr = aAnimElem.getAttributeNS( NSS['smil'], 'subtype' );
    if( sSubTypeAttr === null )
    sSubTypeAttr = 'default';
    if( sSubTypeAttr && ( aTransitionSubtypeInMap[ sSubTypeAttr ] !== undefined  ) )
    {
    this.eTransitionSubType = aTransitionSubtypeInMap[ sSubTypeAttr ];
    }
    else
    {
    bIsValidTransition = false;
    log( 'AnimationTransitionFilterNode.parseElement: transition subtype not valid: ' + sSubTypeAttr );
    }
    
    if( !bIsValidTransition )
    {
    this.eTransitionType = FADE_TRANSITION;
    this.eTransitionSubType = CROSSFADE_TRANS_SUBTYPE;
    log( 'AnimationTransitionFilterNode.parseElement: in place of the invalid transition a crossfade transition is used' );
    }
    
    this.bReverseDirection = false;
    var sDirectionAttr = aAnimElem.getAttributeNS( NSS['smil'], 'direction' );
    if( sDirectionAttr == 'reverse' )
    this.bReverseDirection = true;
    
    this.eTransitionMode = TRANSITION_MODE_IN;
    var sModeAttr = aAnimElem.getAttributeNS( NSS['smil'], 'mode' );
    if( sModeAttr === 'out' )
    this.eTransitionMode = TRANSITION_MODE_OUT;
    
    return bRet;
    };
    
    AnimationTransitionFilterNode.prototype.getTransitionType = function()
    {
    return this.eTransitionType;
    };
    
    AnimationTransitionFilterNode.prototype.getTransitionSubType = function()
    {
    return this.eTransitionSubType;
    };
    
    AnimationTransitionFilterNode.prototype.getTransitionMode = function()
    {
    return this.eTransitionMode;
    };
    
    AnimationTransitionFilterNode.prototype.getReverseDirection = function()
    {
    return this.bReverseDirection;
    };
    
    AnimationTransitionFilterNode.prototype.info = function( bVerbose )
    {
    var sInfo = AnimationTransitionFilterNode.superclass.info.call( this, bVerbose );
    
    if( bVerbose )
    {
    sInfo += ';  type: ' + getKeyByValue(aTransitionTypeInMap, this.getTransitionType());
    
    sInfo += ';  subtype: ' + getKeyByValue(aTransitionSubtypeInMap, this.getTransitionSubType());
    
    if( this.getReverseDirection() )
    sInfo += ';  direction: reverse';
    }
    
    return sInfo;
    };
    
    
    function createAnimationTree( aRootElement, aNodeContext )
    {
    return createAnimationNode( aRootElement, null, aNodeContext );
    }
    
    
    function createAnimationNode( aElement, aParentNode, aNodeContext )
    {
    assert( aElement, 'createAnimationNode: invalid animation element' );
    
    var eAnimationNodeType = getAnimationElementType( aElement );
    
    var aCreatedNode = null;
    var aCreatedContainer = null;
    
    switch( eAnimationNodeType )
    {
    case ANIMATION_NODE_PAR:
    aCreatedNode = aCreatedContainer =
    new ParallelTimeContainer( aElement, aParentNode, aNodeContext );
    break;
    case ANIMATION_NODE_ITERATE:
    aCreatedNode = aCreatedContainer =
    new ParallelTimeContainer( aElement, aParentNode, aNodeContext );
    break;
    case ANIMATION_NODE_SEQ:
    aCreatedNode = aCreatedContainer =
    new SequentialTimeContainer( aElement, aParentNode, aNodeContext );
    break;
    case ANIMATION_NODE_ANIMATE:
    aCreatedNode = new PropertyAnimationNode( aElement, aParentNode, aNodeContext );
    break;
    case ANIMATION_NODE_SET:
    aCreatedNode = new AnimationSetNode( aElement, aParentNode, aNodeContext );
    break;
    case ANIMATION_NODE_ANIMATEMOTION:
    log( 'createAnimationNode: ANIMATEMOTION not implemented' );
    return null;
    case ANIMATION_NODE_ANIMATECOLOR:
    aCreatedNode = new AnimationColorNode( aElement, aParentNode, aNodeContext );
    break;
    case ANIMATION_NODE_ANIMATETRANSFORM:
    log( 'createAnimationNode: ANIMATETRANSFORM not implemented' );
    return null;
    case ANIMATION_NODE_TRANSITIONFILTER:
    aCreatedNode = new AnimationTransitionFilterNode( aElement, aParentNode, aNodeContext );
    break;
    case ANIMATION_NODE_AUDIO:
    log( 'createAnimationNode: AUDIO not implemented' );
    return null;
    case ANIMATION_NODE_COMMAND:
    log( 'createAnimationNode: COMMAND not implemented' );
    return null;
    default:
    log( 'createAnimationNode: invalid Animation Node Type: ' + eAnimationNodeType );
    return null;
    }
    
    if( aCreatedContainer )
    {
    if( eAnimationNodeType == ANIMATION_NODE_ITERATE )
    {
    createIteratedNodes( aElement, aCreatedContainer, aNodeContext );
    }
    else
    {
    var aChildrenArray = getElementChildren( aElement );
    for( var i = 0; i < aChildrenArray.length; ++i )
    {
    if( !createChildNode( aChildrenArray[i], aCreatedContainer, aNodeContext ) )
    {
    aCreatedContainer.removeAllChildrenNodes();
    break;
    }
    }
    }
    }
    
    return aCreatedNode;
    }
    
    
    function createChildNode( aElement, aParentNode, aNodeContext )
    {
    var aChildNode = createAnimationNode( aElement, aParentNode, aNodeContext );
    
    if( !aChildNode )
    {
    log( 'createChildNode: child node creation failed' );
    return false;
    }
    else
    {
    aParentNode.appendChildNode( aChildNode );
    return true;
    }
    }
    
    
    function createIteratedNodes( /*aElement, aContainerNode, aNodeContext*/ )
    {
    }
    
    
    function makeScaler( nScale )
    {
    if( ( typeof( nScale ) !== typeof( 0 ) ) || !isFinite( nScale ) )
    {
    log( 'makeScaler: not valid param passed: ' + nScale );
    return null;
    }
    
    return  function( nValue )
    {
    return ( nScale * nValue );
    };
    }
    
    
    function createPropertyAnimation( sAttrName, aAnimatedElement, nWidth, nHeight )
    {
    if( !aAttributeMap[ sAttrName ] )
    {
    log( 'createPropertyAnimation: attribute is unknown' );
    return null;
    }
    
    
    var aFunctorSet = aAttributeMap[ sAttrName ];
    
    var sGetValueMethod =   aFunctorSet.get;
    var sSetValueMethod =   aFunctorSet.set;
    
    if( !sGetValueMethod || !sSetValueMethod  )
    {
    log( 'createPropertyAnimation: attribute is not handled' );
    return null;
    }
    
    var aGetModifier =  eval( aFunctorSet.getmod );
    var aSetModifier =  eval( aFunctorSet.setmod );
    
    
    return new GenericAnimation( bind( aAnimatedElement, aAnimatedElement[ sGetValueMethod ] ),
    bind( aAnimatedElement, aAnimatedElement[ sSetValueMethod ] ),
    aGetModifier,
    aSetModifier);
    }
    
    
    function createShapeTransition( aActivityParamSet, aAnimatedElement,
    nSlideWidth, nSlideHeight,
    aAnimatedTransitionFilterNode )
    {
    if( !aAnimatedTransitionFilterNode )
    {
    log( 'createShapeTransition: the animated transition filter node is not valid.' );
    return null;
    }
    var eTransitionType = aAnimatedTransitionFilterNode.getTransitionType();
    var eTransitionSubType = aAnimatedTransitionFilterNode.getTransitionSubType();
    var bDirectionForward = ! aAnimatedTransitionFilterNode.getReverseDirection();
    var bModeIn = ( aAnimatedTransitionFilterNode.getTransitionMode() == FORWARD );
    
    var aTransitionInfo = aTransitionInfoTable[eTransitionType][eTransitionSubType];
    var eTransitionClass = aTransitionInfo['class'];
    
    switch( eTransitionClass )
    {
    default:
    case TRANSITION_INVALID:
    log( 'createShapeTransition: transition class: TRANSITION_INVALID' );
    return null;
    
    case TRANSITION_CLIP_POLYPOLYGON:
    var aParametricPolyPolygon
    = createClipPolyPolygon( eTransitionType, eTransitionSubType );
    var aClippingAnimation
    = new ClippingAnimation( aParametricPolyPolygon, aTransitionInfo,
    bDirectionForward, bModeIn );
    return new SimpleActivity( aActivityParamSet, aClippingAnimation, true );
    
    case TRANSITION_SPECIAL:
    switch( eTransitionType )
    {
    default:
    var aAnimation
    = createPropertyAnimation( 'opacity',
    aAnimatedElement,
    nSlideWidth,
    nSlideHeight );
    return new SimpleActivity( aActivityParamSet, aAnimation, bModeIn );
    }
    }
    
    }
    
    
    function ClippingAnimation( aParametricPolyPolygon, aTransitionInfo,
    bDirectionForward, bModeIn )
    {
    this.aClippingFunctor = new ClippingFunctor( aParametricPolyPolygon,
    aTransitionInfo,
    bDirectionForward, bModeIn );
    this.bAnimationStarted = false;
    }
    
    ClippingAnimation.prototype.start = function( aAnimatableElement )
    {
    assert( aAnimatableElement,
    'ClippingAnimation.start: animatable element is not valid' );
    this.aAnimatableElement = aAnimatableElement;
    this.aAnimatableElement.initClipPath();
    this.aAnimatableElement.notifyAnimationStart();
    
    if( !this.bAnimationStarted )
    this.bAnimationStarted = true;
    
    };
    
    ClippingAnimation.prototype.end = function()
    {
    if( this.bAnimationStarted )
    {
    this.aAnimatableElement.cleanClipPath();
    this.bAnimationStarted = false;
    this.aAnimatableElement.notifyAnimationEnd();
    }
    };
    
    ClippingAnimation.prototype.perform = function( nValue )
    {
    var nWidth = this.aAnimatableElement.aClippingBBox.width;
    var nHeight = this.aAnimatableElement.aClippingBBox.height;
    var aPolyPolygonElement = this.aClippingFunctor.perform( nValue, nWidth, nHeight );
    this.aAnimatableElement.setClipPath( aPolyPolygonElement );
    };
    
    ClippingAnimation.prototype.getUnderlyingValue = function()
    {
    return 0.0;
    };
    
    
    function GenericAnimation( aGetValueFunc, aSetValueFunc, aGetModifier, aSetModifier )
    {
    assert( aGetValueFunc && aSetValueFunc,
    'GenericAnimation constructor: get value functor and/or set value functor are not valid' );
    
    this.aGetValueFunc = aGetValueFunc;
    this.aSetValueFunc = aSetValueFunc;
    this.aGetModifier = aGetModifier;
    this.aSetModifier = aSetModifier;
    this.aAnimatableElement = null;
    this.bAnimationStarted = false;
    }
    
    
    GenericAnimation.prototype.start = function( aAnimatableElement )
    {
    assert( aAnimatableElement, 'GenericAnimation.start: animatable element is not valid' );
    
    this.aAnimatableElement = aAnimatableElement;
    this.aAnimatableElement.notifyAnimationStart();
    
    if( !this.bAnimationStarted )
    this.bAnimationStarted = true;
    };
    
    GenericAnimation.prototype.end = function()
    {
    if( this.bAnimationStarted )
    {
    this.bAnimationStarted = false;
    this.aAnimatableElement.notifyAnimationEnd();
    }
    };
    
    GenericAnimation.prototype.perform = function( aValue )
    {
    if( this.aSetModifier )
    aValue = this.aSetModifier( aValue );
    
    this.aSetValueFunc( aValue );
    };
    
    GenericAnimation.prototype.getUnderlyingValue = function()
    {
    var aValue = this.aGetValueFunc();
    if( this.aGetModifier )
    aValue = this.aGetModifier( aValue );
    return aValue;
    };
    
    
    function HSLAnimationWrapper( aColorAnimation )
    {
    assert( aColorAnimation,
    'HSLAnimationWrapper constructor: invalid color animation delegate' );
    
    this.aAnimation = aColorAnimation;
    }
    
    
    HSLAnimationWrapper.prototype.start = function( aAnimatableElement )
    {
    this.aAnimation.start( aAnimatableElement );
    };
    
    HSLAnimationWrapper.prototype.end = function()
    {
    this.aAnimation.end();
    };
    HSLAnimationWrapper.prototype.perform = function( aHSLValue )
    {
    this.aAnimation.perform( aHSLValue.convertToRGB() );
    };
    
    HSLAnimationWrapper.prototype.getUnderlyingValue = function()
    {
    return this.aAnimation.getUnderlyingValue().convertToHSL();
    };
    
    
    function SlideChangeBase(aLeavingSlide, aEnteringSlide)
    {
    this.aLeavingSlide = aLeavingSlide;
    this.aEnteringSlide = aEnteringSlide;
    this.bIsFinished = false;
    }
    
    SlideChangeBase.prototype.start = function()
    {
    };
    
    SlideChangeBase.prototype.end = function()
    {
    if( this.bIsFinished )
    return;
    
    this.aLeavingSlide.hide();
    this.aEnteringSlide.reset();
    this.aLeavingSlide.reset();
    
    this.bIsFinished = true;
    };
    
    SlideChangeBase.prototype.perform = function( nValue )
    {
    if( this.bIsFinished ) return false;
    
    if( this.aLeavingSlide )
    this.performOut( nValue );
    
    if( this.aEnteringSlide )
    this.performIn( nValue );
    
    return true;
    };
    
    SlideChangeBase.prototype.getUnderlyingValue = function()
    {
    return 0.0;
    };
    
    SlideChangeBase.prototype.performIn = function( )
    {
    log( 'SlideChangeBase.performIn: abstract method called' );
    };
    
    SlideChangeBase.prototype.performOut = function( )
    {
    log( 'SlideChangeBase.performOut: abstract method called' );
    };
    
    
    function FadingSlideChange( aLeavingSlide, aEnteringSlide )
    {
    FadingSlideChange.superclass.constructor.call( this, aLeavingSlide, aEnteringSlide );
    this.bFirstRun = true;
    }
    extend( FadingSlideChange, SlideChangeBase );
    
    FadingSlideChange.prototype.start = function()
    {
    FadingSlideChange.superclass.start.call( this );
    this.aEnteringSlide.notifyUsedAttribute( 'opacity' );
    this.aLeavingSlide.notifyUsedAttribute( 'opacity' );
    this.aEnteringSlide.setOpacity( 0.0 );
    this.aEnteringSlide.show();
    };
    
    FadingSlideChange.prototype.performIn = function( nT )
    {
    this.aEnteringSlide.setOpacity( nT );
    };
    
    FadingSlideChange.prototype.performOut = function( nT )
    {
    
    this.aLeavingSlide.setOpacity( 1 - nT );
    };
    
    
    function FadingOverColorSlideChange( aLeavingSlide, aEnteringSlide, sFadeColor )
    {
    FadingSlideChange.superclass.constructor.call( this, aLeavingSlide, aEnteringSlide );
    this.sFadeColor = sFadeColor;
    if( !this.sFadeColor )
    {
    log( 'FadingOverColorSlideChange: sFadeColor not valid.' );
    this.sFadeColor = '#000000';
    }
    this.aColorPlaneElement = this.createColorPlaneElement();
    }
    extend( FadingOverColorSlideChange, SlideChangeBase );
    
    FadingOverColorSlideChange.prototype.start = function()
    {
    FadingOverColorSlideChange.superclass.start.call( this );
    this.aEnteringSlide.notifyUsedAttribute( 'opacity' );
    this.aLeavingSlide.notifyUsedAttribute( 'opacity' );
    this.aLeavingSlide.insertBefore( this.aColorPlaneElement );
    this.aEnteringSlide.setOpacity( 0.0 );
    this.aEnteringSlide.show();
    };
    
    FadingOverColorSlideChange.prototype.end = function()
    {
    FadingOverColorSlideChange.superclass.end.call( this );
    this.aLeavingSlide.removeElement( this.aColorPlaneElement );
    };
    
    FadingOverColorSlideChange.prototype.performIn = function( nT )
    {
    this.aEnteringSlide.setOpacity( (nT > 0.55) ? 2.0*(nT-0.55) : 0.0 );
    };
    
    FadingOverColorSlideChange.prototype.performOut = function( nT )
    {
    this.aLeavingSlide.setOpacity( (nT > 0.45) ? 0.0 : 2.0*(0.45-nT) );
    };
    
    FadingOverColorSlideChange.prototype.createColorPlaneElement = function()
    {
    var aColorPlaneElement = document.createElementNS( NSS['svg'], 'rect' );
    aColorPlaneElement.setAttribute( 'width', String( this.aLeavingSlide.getWidth() ) );
    aColorPlaneElement.setAttribute( 'height', String( this.aLeavingSlide.getHeight() ) );
    aColorPlaneElement.setAttribute( 'fill', this.sFadeColor );
    return aColorPlaneElement;
    };
    
    
    function MovingSlideChange( aLeavingSlide, aEnteringSlide,
    aLeavingDirection, aEnteringDirection )
    {
    MovingSlideChange.superclass.constructor.call( this, aLeavingSlide, aEnteringSlide );
    this.aLeavingDirection = aLeavingDirection;
    this.aEnteringDirection = aEnteringDirection;
    }
    extend( MovingSlideChange, SlideChangeBase );
    
    MovingSlideChange.prototype.start = function()
    {
    MovingSlideChange.superclass.start.call( this );
    this.aEnteringSlide.notifyUsedAttribute( 'transform' );
    this.aLeavingSlide.notifyUsedAttribute( 'transform' );
    this.performIn( 0 );
    this.aEnteringSlide.show();
    };
    
    MovingSlideChange.prototype.performIn = function( nT )
    {
    var nS = nT - 1;
    var dx = nS * this.aEnteringDirection.x * this.aEnteringSlide.getWidth();
    var dy = nS * this.aEnteringDirection.y * this.aEnteringSlide.getHeight();
    this.aEnteringSlide.translate( dx, dy );
    };
    
    MovingSlideChange.prototype.performOut = function( nT )
    {
    var dx = nT * this.aLeavingDirection.x * this.aLeavingSlide.getWidth();
    var dy = nT * this.aLeavingDirection.y * this.aLeavingSlide.getHeight();
    this.aLeavingSlide.translate( dx, dy );
    };
    
    
    function ClippedSlideChange( aLeavingSlide, aEnteringSlide, aParametricPolyPolygon,
    aTransitionInfo, bIsDirectionForward )
    {
    ClippedSlideChange.superclass.constructor.call( this, aLeavingSlide, aEnteringSlide );
    
    var bIsModeIn = true;
    this.aClippingFunctor= new ClippingFunctor( aParametricPolyPolygon, aTransitionInfo,
    bIsDirectionForward, bIsModeIn );
    }
    extend( ClippedSlideChange, SlideChangeBase );
    
    ClippedSlideChange.prototype.start = function()
    {
    ClippedSlideChange.superclass.start.call( this );
    this.aEnteringSlide.notifyUsedAttribute( 'clip-path' );
    this.performIn( 0 );
    this.aEnteringSlide.show();
    };
    
    ClippedSlideChange.prototype.performIn = function( nT )
    {
    var nWidth = this.aEnteringSlide.getWidth();
    var nHeight = this.aEnteringSlide.getHeight();
    var aPolyPolygonElement = this.aClippingFunctor.perform( nT, nWidth, nHeight );
    this.aEnteringSlide.setClipPath( aPolyPolygonElement );
    };
    
    ClippedSlideChange.prototype.performOut = function( )
    {
    };
    
    
    function ClippingFunctor( aParametricPolyPolygon, aTransitionInfo,
    bIsDirectionForward, bIsModeIn)
    {
    this.aParametricPolyPolygon = aParametricPolyPolygon;
    this.aStaticTransformation = null;
    this.bForwardParameterSweep = true;
    this.bSubtractPolygon = false;
    this.bScaleIsotropically = aTransitionInfo.scaleIsotropically;
    this.bFlip = false;
    
    assert( this.aParametricPolyPolygon,
    'ClippingFunctor: parametric polygon is not valid' );
    
    if( aTransitionInfo.rotationAngle != 0.0 ||
    aTransitionInfo.scaleX != 1.0 ||  aTransitionInfo.scaleY != 1.0 )
    {
    this.aStaticTransformation = SVGIdentityMatrix.translate( 0.5, 0.5 );
    if( aTransitionInfo.scaleX != 1.0 ||  aTransitionInfo.scaleY != 1.0 )
    this.aStaticTransformation
    = this.aStaticTransformation.scaleNonUniform( aTransitionInfo.scaleX,
    aTransitionInfo.scaleY );
    if( aTransitionInfo.rotationAngle != 0.0 )
    this.aStaticTransformation
    = this.aStaticTransformation.rotate( aTransitionInfo.rotationAngle );
    this.aStaticTransformation = this.aStaticTransformation.translate( -0.5, -0.5 );
    }
    else
    {
    this.aStaticTransformation = document.documentElement.createSVGMatrix();
    }
    
    if( !bIsDirectionForward )
    {
    var aMatrix = null;
    switch( aTransitionInfo.reverseMethod )
    {
    default:
    log( 'ClippingFunctor: unexpected reverse method.' );
    break;
    case REVERSEMETHOD_IGNORE:
    break;
    case REVERSEMETHOD_INVERT_SWEEP:
    this.bForwardParameterSweep = !this.bForwardParameterSweep;
    break;
    case REVERSEMETHOD_SUBTRACT_POLYGON:
    this.bSubtractPolygon = !this.bSubtractPolygon;
    break;
    case REVERSEMETHOD_SUBTRACT_AND_INVERT:
    this.bForwardParameterSweep = !this.bForwardParameterSweep;
    this.bSubtractPolygon = !this.bSubtractPolygon;
    break;
    case REVERSEMETHOD_ROTATE_180:
    aMatrix = document.documentElement.createSVGMatrix();
    aMatrix.setToRotationAroundPoint( 0.5, 0.5, 180 );
    this.aStaticTransformation = aMatrix.multiply( this.aStaticTransformation );
    break;
    case REVERSEMETHOD_FLIP_X:
    aMatrix = document.documentElement.createSVGMatrix();
    aMatrix.a = -1; aMatrix.e = 1.0;
    this.aStaticTransformation = aMatrix.multiply( this.aStaticTransformation );
    this.bFlip = true;
    break;
    case REVERSEMETHOD_FLIP_Y:
    aMatrix = document.documentElement.createSVGMatrix();
    aMatrix.d = -1; aMatrix.f = 1.0;
    this.aStaticTransformation = aMatrix.multiply( this.aStaticTransformation );
    this.bFlip = true;
    break;
    }
    }
    
    if( !bIsModeIn )
    {
    if( aTransitionInfo.outInvertsSweep )
    {
    this.bForwardParameterSweep = !this.bForwardParameterSweep;
    }
    else
    {
    this.bSubtractPolygon = !this.bSubtractPolygon;
    }
    }
    }
    
    ClippingFunctor.aBoundingPath = document.createElementNS( NSS['svg'], 'path' );
    ClippingFunctor.aBoundingPath.setAttribute( 'd', 'M -1 -1 L 2 -1 L 2 2 L -1 2 L -1 -1' );
    
    ClippingFunctor.prototype.perform = function( nT, nWidth, nHeight )
    {
    var aClipPoly = this.aParametricPolyPolygon.perform( this.bForwardParameterSweep ? nT : (1 - nT) );
    
    
    if( this.bSubtractPolygon )
    {
    aClipPoly.changeOrientation();
    aClipPoly.prependPath( ClippingFunctor.aBoundingPath );
    }
    
    var aMatrix;
    if( this.bScaleIsotropically )
    {
    var nScaleFactor = Math.max( nWidth, nHeight );
    aMatrix = SVGIdentityMatrix.translate( -( nScaleFactor - nWidth ) / 2.0,
    -( nScaleFactor - nHeight ) / 2.0 );
    aMatrix = aMatrix.scale( nScaleFactor );
    aMatrix = aMatrix.multiply( this.aStaticTransformation );
    }
    else
    {
    aMatrix = SVGIdentityMatrix.scaleNonUniform( nWidth, nHeight );
    aMatrix = aMatrix.multiply( this.aStaticTransformation );
    }
    
    aClipPoly.matrixTransform( aMatrix );
    
    return aClipPoly;
    };
    
    
    function createClipPolyPolygon( nType, nSubtype )
    {
    switch( nType )
    {
    default:
    log( 'createClipPolyPolygon: unknown transition type: ' + nType );
    return null;
    case BARWIPE_TRANSITION:
    return new BarWipePath( 1 );
    case FOURBOXWIPE_TRANSITION:
    return new FourBoxWipePath( nSubtype === CORNERSOUT_TRANS_SUBTYPE );
    case BOXWIPE_TRANSITION:
    return new BoxWipePath( nSubtype == LEFTCENTER_TRANS_SUBTYPE ||
    nSubtype == TOPCENTER_TRANS_SUBTYPE ||
    nSubtype == RIGHTCENTER_TRANS_SUBTYPE ||
    nSubtype == BOTTOMCENTER_TRANS_SUBTYPE );
    case ELLIPSEWIPE_TRANSITION:
    return new EllipseWipePath( nSubtype );
    case FANWIPE_TRANSITION:
    return new FanWipePath(nSubtype == CENTERTOP_TRANS_SUBTYPE ||
    nSubtype == CENTERRIGHT_TRANS_SUBTYPE, true, false);
    case PINWHEELWIPE_TRANSITION:
    var nBlades;
    switch( nSubtype )
    {
    case ONEBLADE_TRANS_SUBTYPE:
    nBlades = 1;
    break;
    case DEFAULT_TRANS_SUBTYPE:
    case TWOBLADEVERTICAL_TRANS_SUBTYPE:
    nBlades = 2;
    break;
    case TWOBLADEHORIZONTAL_TRANS_SUBTYPE:
    nBlades = 2;
    break;
    case THREEBLADE_TRANS_SUBTYPE:
    nBlades = 3;
    break;
    case FOURBLADE_TRANS_SUBTYPE:
    nBlades = 4;
    break;
    case EIGHTBLADE_TRANS_SUBTYPE:
    nBlades = 8;
    break;
    default:
    log( 'createClipPolyPolygon: unknown subtype: ' + nSubtype );
    return null;
    }
    return new PinWheelWipePath( nBlades );
    case CLOCKWIPE_TRANSITION:
    return new ClockWipePath();
    case RANDOMBARWIPE_TRANSITION:
    return new RandomWipePath( 128, true /* bars */ );
    case CHECKERBOARDWIPE_TRANSITION:
    return new CheckerBoardWipePath( 10 );
    case ZIGZAGWIPE_TRANSITION:
    return new ZigZagWipePath( 5 );
    case BARNZIGZAGWIPE_TRANSITION:
    return new BarnZigZagWipePath( 5 );
    case IRISWIPE_TRANSITION:
    switch(nSubtype)
    {
    case RECTANGLE_TRANS_SUBTYPE:
    return new IrisWipePath(0);
    case DIAMOND_TRANS_SUBTYPE:
    return new IrisWipePath(1);
    default:
    log( 'createClipPolyPolygon: unknown subtype: ' + nSubtype );
    return null;
    }
    case BARNDOORWIPE_TRANSITION:
    return new BarnDoorWipePath(false);
    case SINGLESWEEPWIPE_TRANSITION:
    return new SweepWipePath(
    nSubtype == CLOCKWISETOP_TRANS_SUBTYPE ||
    nSubtype == CLOCKWISERIGHT_TRANS_SUBTYPE ||
    nSubtype == CLOCKWISEBOTTOM_TRANS_SUBTYPE ||
    nSubtype == CLOCKWISELEFT_TRANS_SUBTYPE,
    true,
    false,
    nSubtype == COUNTERCLOCKWISEBOTTOMLEFT_TRANS_SUBTYPE ||
    nSubtype == COUNTERCLOCKWISETOPRIGHT_TRANS_SUBTYPE );
    case WATERFALLWIPE_TRANSITION:
    return new WaterfallWipePath(128, // flipOnYAxis
    nSubtype == VERTICALRIGHT_TRANS_SUBTYPE ||
    nSubtype == HORIZONTALLEFT_TRANS_SUBTYPE);
    case MISCDIAGONALWIPE_TRANSITION:
    switch(nSubtype) {
    case DOUBLEBARNDOOR_TRANS_SUBTYPE:
    return new BarnDoorWipePath(true /* Doubled */);
    case DOUBLEDIAMOND_TRANS_SUBTYPE:
    return new DoubleDiamondWipePath();
    default:
    log( 'createClipPolyPolygon: unhandled subtype: ' + nSubtype );
    return null;
    }
    case DISSOLVE_TRANSITION:
    return new RandomWipePath( 16 * 16, false /* dissolve */ );
    case VEEWIPE_TRANSITION:
    return new VeeWipePath();
    case SNAKEWIPE_TRANSITION:
    return new SnakeWipePath( 8 * 8, // diagonal
    nSubtype == TOPLEFTDIAGONAL_TRANS_SUBTYPE     ||
    nSubtype == TOPRIGHTDIAGONAL_TRANS_SUBTYPE    ||
    nSubtype == BOTTOMRIGHTDIAGONAL_TRANS_SUBTYPE ||
    nSubtype == BOTTOMLEFTDIAGONAL_TRANS_SUBTYPE   ,
    nSubtype == TOPLEFTVERTICAL_TRANS_SUBTYPE     ||
    nSubtype == TOPRIGHTDIAGONAL_TRANS_SUBTYPE    ||
    nSubtype == BOTTOMLEFTDIAGONAL_TRANS_SUBTYPE
    );
    case PARALLELSNAKESWIPE_TRANSITION:
    return new ParallelSnakesWipePath(
    8 * 8, // elements
    nSubtype == DIAGONALBOTTOMLEFTOPPOSITE_TRANS_SUBTYPE ||
    nSubtype == DIAGONALTOPLEFTOPPOSITE_TRANS_SUBTYPE,
    nSubtype == VERTICALBOTTOMLEFTOPPOSITE_TRANS_SUBTYPE ||
    nSubtype == HORIZONTALTOPLEFTOPPOSITE_TRANS_SUBTYPE  ||
    nSubtype == DIAGONALTOPLEFTOPPOSITE_TRANS_SUBTYPE,
    nSubtype == VERTICALTOPLEFTOPPOSITE_TRANS_SUBTYPE    ||
    nSubtype == VERTICALBOTTOMLEFTOPPOSITE_TRANS_SUBTYPE ||
    nSubtype == HORIZONTALTOPLEFTOPPOSITE_TRANS_SUBTYPE  ||
    nSubtype == HORIZONTALTOPRIGHTOPPOSITE_TRANS_SUBTYPE ||
    nSubtype == DIAGONALBOTTOMLEFTOPPOSITE_TRANS_SUBTYPE ||
    nSubtype == DIAGONALTOPLEFTOPPOSITE_TRANS_SUBTYPE
    );
    
    case SPIRALWIPE_TRANSITION:
    return new SpiralWipePath(
    8 * 8, // elements
    nSubtype == TOPLEFTCOUNTERCLOCKWISE_TRANS_SUBTYPE     ||
    nSubtype == TOPRIGHTCOUNTERCLOCKWISE_TRANS_SUBTYPE    ||
    nSubtype == BOTTOMRIGHTCOUNTERCLOCKWISE_TRANS_SUBTYPE ||
    nSubtype == BOTTOMLEFTCOUNTERCLOCKWISE_TRANS_SUBTYPE );
    
    case BOXSNAKESWIPE_TRANSITION:
    return new BoxSnakesWipePath(
    8 * 8,
    nSubtype == FOURBOXVERTICAL_TRANS_SUBTYPE ||
    nSubtype == FOURBOXHORIZONTAL_TRANS_SUBTYPE );
    }
    }
    
    
    function createUnitSquarePath()
    {
    var aPath = document.createElementNS( NSS['svg'], 'path' );
    var sD = 'M 0 0 L 1 0 L 1 1 L 0 1 L 0 0';
    aPath.setAttribute( 'd', sD );
    return aPath;
    }
    
    function createEmptyPath()
    {
    var aPath = document.createElementNS( NSS['svg'], 'path' );
    var sD = 'M 0 0 L 0 0';
    aPath.setAttribute( 'd', sD );
    return aPath;
    }
    
    function pruneScaleValue( nVal )
    {
    if( nVal < 0.0 )
    return (nVal < -0.00001 ? nVal : -0.00001);
    else
    return (nVal > 0.00001 ? nVal : 0.00001);
    }
    
    
    function BarWipePath( nBars /* nBars > 1: blinds effect */ )
    {
    this.nBars = nBars;
    if( this.nBars === undefined || this.nBars < 1 )
    this.nBars = 1;
    this.aBasePath = createUnitSquarePath();
    }
    
    BarWipePath.prototype.perform = function( nT )
    {
    
    var aMatrix = SVGIdentityMatrix.scaleNonUniform( pruneScaleValue( nT / this.nBars ), 1.0 );
    
    var aPolyPath = this.aBasePath.cloneNode( true );
    aPolyPath.matrixTransform( aMatrix );
    
    if( this.nBars > 1 )
    {
    var i;
    var aTransform;
    var aPath;
    for( i = this.nBars - 1; i > 0; --i )
    {
    aTransform = SVGIdentityMatrix.translate( i / this.nBars, 0.0 );
    aTransform = aTransform.multiply( aMatrix );
    aPath = this.aBasePath.cloneNode( true );
    aPath.matrixTransform( aTransform );
    aPolyPath.appendPath( aPath );
    }
    }
    return aPolyPath;
    };
    
    
    function BoxWipePath(bIsTopCentered) {
    this.bIsTopCentered = bIsTopCentered;
    this.aBasePath = createUnitSquarePath();
    }
    
    BoxWipePath.prototype.perform = function( nT ) {
    var d = pruneScaleValue(nT);
    var aTransform = SVGIdentityMatrix;
    if(this.bIsTopCentered) {
    aTransform = aTransform.translate(-0.5, 0.0).scale(d, d).translate(0.5, 0.0);
    }
    else {
    aTransform = aTransform.scale(d, d);
    }
    var aPath = this.aBasePath.cloneNode(true);
    aPath.matrixTransform(aTransform);
    return aPath;
    }
    
    function SweepWipePath(bCenter, bSingle, bOppositeVertical, bFlipOnYAxis) {
    this.bCenter = bCenter;
    this.bSingle = bSingle;
    this.bOppositeVertical = bOppositeVertical;
    this.bFlipOnYAxis = bFlipOnYAxis;
    this.aBasePath = createUnitSquarePath();
    }
    
    SweepWipePath.prototype.perform = function( nT ) {
    nT /= 2.0;
    if(!this.bCenter)
    nT /= 2.0;
    if(!this.bSingle && !this.bOppositeVertical)
    nT /= 2.0;
    
    var poly = PinWheelWipePath.calcCenteredClock( nT + 0.25, 1.0 );
    var aTransform;
    
    if(this.bCenter) {
    aTransform = SVGIdentityMatrix.translate(0.5, 0.0);
    poly.matrixTransform(aTransform);
    }
    var res = poly;
    
    if(!this.bSingle) {
    if(this.bOppositeVertical) {
    aTransform = SVGIdentityMatrix.scale(1.0, -1.0);
    aTransform.translate(0.0, 1.0);
    poly.matrixTransform(aTransform);
    poly.changeOrientation();
    }
    else {
    aTransform = SVGIdentityMatrix.translate(-0.5, -0.5);
    aTransform.rotate(Math.PI);
    aTransform.translate(0.5, 0.5);
    poly.matrixTransform(aTransform);
    }
    res.appendPath(poly);
    }
    return this.bFlipOnYAxis ? flipOnYAxis(res) : res;
    }
    
    function FourBoxWipePath( bCornersOut )
    {
    this.bCornersOut = bCornersOut;
    this.aBasePath = createUnitSquarePath();
    }
    
    FourBoxWipePath.prototype.perform = function( nT )
    {
    var aMatrix;
    var d = pruneScaleValue( nT / 2.0 );
    
    if( this.bCornersOut )
    {
    aMatrix = SVGIdentityMatrix.translate( -0.25, -0.25 ).scale( d ).translate( -0.5, -0.5 );
    }
    else
    {
    aMatrix = SVGIdentityMatrix.translate( -0.5, -0.5 ).scale( d );
    }
    
    
    var aTransform = aMatrix;
    var aSquare = this.aBasePath.cloneNode( true );
    aSquare.matrixTransform( aTransform );
    var aPolyPath = aSquare;
    aMatrix = SVGIdentityMatrix.flipY();
    aTransform = aMatrix.multiply( aTransform );
    aSquare = this.aBasePath.cloneNode( true );
    aSquare.matrixTransform( aTransform );
    aSquare.changeOrientation();
    aPolyPath.appendPath( aSquare );
    aMatrix = SVGIdentityMatrix.flipX();
    aTransform = aMatrix.multiply( aTransform );
    aSquare = this.aBasePath.cloneNode( true );
    aSquare.matrixTransform( aTransform );
    aPolyPath.appendPath( aSquare );
    aMatrix = SVGIdentityMatrix.flipY();
    aTransform = aMatrix.multiply( aTransform );
    aSquare = this.aBasePath.cloneNode( true );
    aSquare.matrixTransform( aTransform );
    aSquare.changeOrientation();
    aPolyPath.appendPath( aSquare );
    
    aMatrix = SVGIdentityMatrix.translate( 0.5, 0.5 );
    aMatrix = aMatrix.scale( 1.1 );
    aPolyPath.matrixTransform( aMatrix );
    
    return aPolyPath;
    };
    
    
    function EllipseWipePath( eSubtype )
    {
    this.eSubtype = eSubtype;
    
    var sPathData = 'M 0.5 -0.207107 ' +
    'C 0.687536 -0.207107 0.867392 -0.132608 1 0 ' +
    'C 1.13261 0.132608 1.20711 0.312464 1.20711 0.5 ' +
    'C 1.20711 0.687536 1.13261 0.867392 1 1 ' +
    'C 0.867392 1.13261 0.687536 1.20711 0.5 1.20711 ' +
    'C 0.312464 1.20711 0.132608 1.13261 0 1 ' +
    'C -0.132608 0.867392 -0.207107 0.687536 -0.207107 0.5 ' +
    'C -0.207107 0.312464 -0.132608 0.132608 0 0 ' +
    'C 0.132608 -0.132608 0.312464 -0.207107 0.5 -0.207107';
    
    this.aBasePath = document.createElementNS( NSS['svg'], 'path' );
    this.aBasePath.setAttribute( 'd', sPathData );
    }
    
    EllipseWipePath.prototype.perform = function( nT )
    {
    
    var aTransform = SVGIdentityMatrix.translate( 0.5, 0.5 ).scale( nT ).translate( -0.5, -0.5 );
    var aEllipse = this.aBasePath.cloneNode( true );
    aEllipse.matrixTransform( aTransform );
    
    return aEllipse;
    };
    
    function FanWipePath(bIsCenter, bIsSingle, bIsFanIn) {
    this.bCenter = bIsCenter;
    this.bSingle = bIsSingle;
    this.bFanIn  = bIsFanIn;
    this.aBasePath = createUnitSquarePath();
    }
    
    FanWipePath.prototype.perform = function( nT ) {
    var res = this.aBasePath.cloneNode(true);
    var poly = PinWheelWipePath.calcCenteredClock(
    nT / ((this.bCenter && this.bSingle) ? 2.0 : 4.0), 1.0);
    res.appendPath(poly);
    var aTransform = SVGIdentityMatrix.flipY();
    aTransform = aTransform.scaleNonUniform(-1.0, 1.0);
    poly.matrixTransform(aTransform);
    res.appendPath(poly);
    
    if(this.bCenter) {
    aTransform = SVGIdentityMatrix.scaleNonUniform(0.5, 0.5).translate(0.5, 0.5);
    res.matrixTransform(aTransform);
    
    if(!this.bSingle)
    res.appendPath(flipOnXAxis(res));
    }
    else {
    aTransform = SVGIdentityMatrix.scaleNonUniform(0.5, 1.0).translate(0.5, 1.0);
    res.matrixTransform(aTransform);
    }
    return res;
    }
    
    function ClockWipePath() { }
    
    ClockWipePath.prototype.perform = function( nT ) {
    const aTransform = SVGIdentityMatrix.scaleNonUniform(0.5, 0.5).translate(0.5, 0.5);
    var aPolyPath = PinWheelWipePath.calcCenteredClock(nT, 1.0);
    aPolyPath.matrixTransform( aTransform );
    
    return aPolyPath;
    }
    
    function PinWheelWipePath( nBlades )
    {
    this.nBlades = nBlades;
    if( !this.nBlades || this.nBlades < 1 )
    this.nBlades = 1;
    }
    
    PinWheelWipePath.calcCenteredClock = function( nT, nE )
    {
    var nMAX_EDGE = 2;
    
    var aTransform = SVGIdentityMatrix.rotate( nT * 360 );
    
    var aPoint = document.documentElement.createSVGPoint();
    aPoint.y = -nMAX_EDGE;
    aPoint = aPoint.matrixTransform( aTransform );
    
    var sPathData = 'M ' + aPoint.x + ' ' + aPoint.y + ' ';
    if( nT >= 0.875 )
    sPathData += 'L ' + '-' + nE + ' -' + nE + ' ';
    if( nT >= 0.625 )
    sPathData += 'L ' + '-' + nE + ' ' + nE + ' ';
    if( nT >= 0.375 )
    sPathData += 'L ' + nE + ' ' + nE + ' ';
    if( nT >= 0.125 )
    sPathData += 'L ' + nE + ' -' + nE + ' ';
    
    sPathData += 'L 0 -' + nE + ' ';
    sPathData += 'L 0 0 ';
    sPathData += 'L '  + aPoint.x + ' ' + aPoint.y;
    
    var aPath = document.createElementNS( NSS['svg'], 'path' );
    aPath.setAttribute( 'd', sPathData );
    return aPath;
    };
    
    PinWheelWipePath.prototype.perform = function( nT )
    {
    var aBasePath = PinWheelWipePath.calcCenteredClock( nT / this.nBlades,
    2.0 /* max edge when rotating */  );
    
    var aPolyPath = aBasePath.cloneNode( true );
    var aPath;
    var aRotation;
    var i;
    for( i = this.nBlades - 1; i > 0; --i )
    {
    aRotation = SVGIdentityMatrix.rotate( (i * 360) / this.nBlades );
    aPath = aBasePath.cloneNode( true );
    aPath.matrixTransform( aRotation );
    aPolyPath.appendPath( aPath );
    }
    
    var aTransform = SVGIdentityMatrix.translate( 0.5, 0.5 ).scale( 0.5 );
    aPolyPath.matrixTransform( aTransform );
    
    return aPolyPath;
    };
    
    function BarnDoorWipePath(doubled) {
    this.aBasePath = createUnitSquarePath();
    this.doubled   = doubled;
    }
    
    BarnDoorWipePath.prototype.perform = function( nT ) {
    if(this.doubled)
    nT /= 2.0;
    var aTransform = SVGIdentityMatrix.translate(-0.5, -0.5);
    aTransform = aTransform.scaleNonUniform(pruneScaleValue(nT), 1.0).translate(0.5, 0.5);
    var aPath = this.aBasePath.cloneNode(true);
    aPath.matrixTransform(aTransform);
    var res = aPath;
    
    if(this.doubled) {
    aTransform = SVGIdentityMatrix.translate(-0.5, -0.5);
    aTransform = aTransform.rotate(Math.PI / 2).translate(0.5, 0.5);
    aPath.matrixTransform(aTransform);
    res.appendPath(aPath);
    }
    return res;
    }
    
    function WaterfallWipePath(nElements, bFlipOnYAxis) {
    this.bFlipOnYAxis = bFlipOnYAxis;
    
    var sqrtElements = Math.floor(Math.sqrt(nElements));
    var elementEdge = 1.0/sqrtElements;
    
    var aPath = 'M '+ 0.0 + ' ' + -1.0 + ' ';
    for(var pos = sqrtElements; pos--; ) {
    var xPos = sqrtElements - pos - 1;
    var yPos = pruneScaleValue( ((pos+1) * elementEdge) - 1.0);
    
    aPath += 'L ' + pruneScaleValue(xPos * elementEdge) + ' ' + yPos + ' ';
    aPath += 'L ' + pruneScaleValue((xPos+1)*elementEdge) + ' ' + yPos + ' ';
    }
    aPath += 'L ' + 1.0 + ' ' + -1.0 + ' ';
    aPath += 'L ' + 0.0 + ' ' + -1.0 + ' ';
    this.aBasePath = document.createElementNS( NSS['svg'], 'path');
    this.aBasePath.setAttribute('d', aPath);
    }
    
    WaterfallWipePath.prototype.perform = function( nT ) {
    var poly = this.aBasePath.cloneNode(true);
    var aTransform = SVGIdentityMatrix.translate(0.0, pruneScaleValue(2.0 * nT));
    poly.matrixTransform(aTransform);
    var aHead = 'M ' + 0.0 + ' ' + -1.0 + ' ';
    var aHeadPath= document.createElementNS( NSS['svg'], 'path');
    aHeadPath.setAttribute('d', aHead);
    
    var aTail = 'M ' + 1.0 + ' ' + -1.0 + ' ';
    var aTailPath = document.createElementNS( NSS['svg'], 'path');
    aTailPath.setAttribute('d', aTail);
    
    poly.prependPath(aHeadPath);
    poly.appendPath(aTailPath);
    
    return this.bFlipOnYAxis ? flipOnYAxis(poly) : poly;
    }
    
    function DoubleDiamondWipePath() { }
    
    DoubleDiamondWipePath.prototype.perform = function( nT ) {
    var a = pruneScaleValue(0.25 + (nT * 0.75));
    var aPath = 'M ' + (0.5 + a) + ' ' + 0.5 + ' ';
    aPath += 'L ' + 0.5 + ' ' + (0.5 - a) + ' ';
    aPath += 'L ' + (0.5 - a) + ' ' + 0.5 + ' ';
    aPath += 'L ' + 0.5 + ' ' + (0.5 + a) + ' ';
    aPath += 'L ' + (0.5 + a) + ' ' + 0.5 + ' ';
    var poly = document.createElementNS( NSS['svg'], 'path');
    poly.setAttribute('d', aPath);
    var res = poly.cloneNode(true);
    
    var b = pruneScaleValue( (1.0 - nT) * 0.25);
    aPath = 'M ' + (0.5 + b) + ' ' + 0.5 + ' ';
    aPath += 'L ' + 0.5 + ' ' + (0.5 + b) + ' ';
    aPath += 'L ' + (0.5 - b) + ' ' + 0.5 + ' ';
    aPath += 'L ' + 0.5 + ' ' + (0.5 - b) + ' ';
    aPath += 'L ' + (0.5 + b) + ' ' + 0.5 + ' ';
    poly = document.createElementNS( NSS['svg'], 'path');
    poly.setAttribute('d', aPath);
    res.appendPath(poly);
    
    return res;
    }
    
    function IrisWipePath(unitRect) {
    this.unitRect = unitRect;
    this.aBasePath = createUnitSquarePath();
    }
    
    
    IrisWipePath.prototype.perform = function( nT ) {
    var d = pruneScaleValue(nT);
    var aTransform = SVGIdentityMatrix.translate(-0.5, -0.5);
    aTransform = aTransform.multiply(SVGIdentityMatrix.scaleNonUniform(d, d).translate(0.5, 0.5));
    var aPath = this.aBasePath.cloneNode(true);
    aPath.matrixTransform(aTransform);
    return aPath;
    }
    
    function ZigZagWipePath(nZigs) {
    this.zigEdge = 1.0/nZigs;
    const d = this.zigEdge;
    const d2 = (d / 2.0);
    this.aBasePath = 'M ' + (-1.0 - d) + ' ' + -d + ' ';
    this.aBasePath += 'L ' + (-1.0 - d) + ' ' + (1.0 + d) + ' ';
    this.aBasePath += 'L ' + -d + ' ' + (1.0 + d) + ' ';
    
    for(var pos = (nZigs + 2); pos--; ) {
    this.aBasePath += 'L ' + 0.0 + ' ' + ((pos - 1) * d + d2) + ' ';
    this.aBasePath += 'L ' + -d + ' ' + (pos - 1) * d + ' ';
    }
    this.aBasePath += 'L ' + (-1.0 - d) + ' ' + -d + ' ';
    }
    
    ZigZagWipePath.prototype.perform = function( nT ) {
    var res = document.createElementNS( NSS['svg'], 'path');
    res.setAttribute('d', this.aBasePath);
    res.matrixTransform(SVGIdentityMatrix.translate((1.0 + this.zigEdge) * nT, 0.0));
    return res;
    }
    
    function BarnZigZagWipePath( nZigs ) { ZigZagWipePath.call(this, nZigs); }
    
    BarnZigZagWipePath.prototype = Object.create(ZigZagWipePath);
    
    BarnZigZagWipePath.prototype.perform = function( nT ) {
    var res = createEmptyPath();
    var poly = document.createElementNS( NSS['svg'], 'path');
    var aTransform = SVGIdentityMatrix.translate(
    ((1.0 + this.zigEdge) * (1.0 - nT)) / 2.0, 0.0);
    poly.setAttribute('d', this.aBasePath);
    poly.changeOrientation();
    poly.matrixTransform(aTransform);
    res.appendPath(poly);
    
    aTransform = SVGIdentityMatrix.scale(-1.0, 1.0);
    aTransform.translate(1.0, this.zigEdge / 2.0);
    poly = document.createElementNS( NSS['svg'], 'path');
    poly.setAttribute('d', this.aBasePath);
    poly.matrixTransform(aTransform);
    res.appendPath(poly);
    
    return res;
    }
    
    function CheckerBoardWipePath( unitsPerEdge )
    {
    this.unitsPerEdge = unitsPerEdge;
    if( this.unitsPerEdge === undefined || this.unitsPerEdge < 1 )
    this.unitsPerEdge = 10;
    this.aBasePath = createUnitSquarePath();
    }
    
    CheckerBoardWipePath.prototype.perform = function( nT )
    {
    var d = pruneScaleValue(1.0 / this.unitsPerEdge);
    var aMatrix = SVGIdentityMatrix.scaleNonUniform(pruneScaleValue( d*2.0*nT ),
    pruneScaleValue( d ) );
    
    var aPolyPath = null;
    var i, j;
    var aTransform;
    var aPath;
    for ( i = this.unitsPerEdge; i--; )
    {
    aTransform = SVGIdentityMatrix;
    
    if ((i % 2) == 1) // odd line
    aTransform = aTransform.translate( -d, 0.0 );
    
    aTransform = aTransform.multiply( aMatrix );
    
    for ( j = (this.unitsPerEdge / 2) + 1; j--;)
    {
    aPath = this.aBasePath.cloneNode( true );
    aPath.matrixTransform( aTransform );
    if (aPolyPath == null) aPolyPath = aPath;
    else aPolyPath.appendPath( aPath );
    aTransform = SVGIdentityMatrix.translate( d*2.0, 0.0 ).multiply( aTransform );
    }
    
    aMatrix = SVGIdentityMatrix.translate( 0.0, d ).multiply( aMatrix ); // next line
    }
    
    return aPolyPath;
    };
    
    
    function RandomWipePath( nElements, bRandomBars )
    {
    this.nElements = nElements;
    this.aBasePath = createUnitSquarePath();
    this.aPositionArray = new Array( nElements );
    this.aClipPath = createEmptyPath();
    this.nAlreadyAppendedElements = 0;
    
    var fEdgeLength, nPos, aTransform;
    
    if( bRandomBars ) // random bar wipe
    {
    fEdgeLength = 1.0 / nElements;
    for( nPos = 0; nPos < nElements; ++nPos )
    {
    this.aPositionArray[nPos] = { x: 0.0, y: pruneScaleValue( nPos * fEdgeLength ) }
    }
    aTransform = SVGIdentityMatrix.scaleNonUniform( 1.0, pruneScaleValue( fEdgeLength ) );
    }
    else // dissolve wipe
    {
    var nSqrtElements = Math.round( Math.sqrt( nElements ) );
    fEdgeLength = 1.0 / nSqrtElements;
    for( nPos = 0; nPos < nElements; ++nPos )
    {
    this.aPositionArray[nPos] = {
    x: pruneScaleValue( ( nPos % nSqrtElements ) * fEdgeLength ),
    y: pruneScaleValue( ( nPos / nSqrtElements ) * fEdgeLength ) }
    }
    aTransform = SVGIdentityMatrix.scale( pruneScaleValue( fEdgeLength ) );
    }
    this.aBasePath.matrixTransform( aTransform );
    
    var nPos1, nPos2;
    var tmp;
    for( nPos1 = nElements - 1; nPos1 > 0; --nPos1 )
    {
    nPos2 = getRandomInt( nPos1 + 1 );
    tmp = this.aPositionArray[nPos1];
    this.aPositionArray[nPos1] = this.aPositionArray[nPos2];
    this.aPositionArray[nPos2] = tmp;
    }
    }
    
    RandomWipePath.prototype.perform = function( nT )
    {
    var aPolyPath = createEmptyPath();
    var aPoint;
    var aPath;
    var aTransform;
    var nElements = Math.round( nT * this.nElements );
    if( nElements === 0 )
    {
    return aPolyPath;
    }
    if( this.nAlreadyAppendedElements >= nElements )
    {
    this.nAlreadyAppendedElements = 0;
    this.aClipPath = createEmptyPath();
    }
    var nPos;
    for( nPos = this.nAlreadyAppendedElements; nPos < nElements; ++nPos )
    {
    aPoint = this.aPositionArray[nPos];
    aPath = this.aBasePath.cloneNode( true );
    aTransform = SVGIdentityMatrix.translate( aPoint.x, aPoint.y );
    aPath.matrixTransform( aTransform );
    aPolyPath.appendPath( aPath );
    }
    
    this.nAlreadyAppendedElements = nElements;
    this.aClipPath.appendPath( aPolyPath );
    
    return this.aClipPath.cloneNode( true );
    };
    
    function SnakeWipePath(nElements, bDiagonal, bflipOnYAxis)
    {
    this.sqrtElements = Math.floor(Math.sqrt(nElements));
    this.elementEdge  = (1.0 / this.sqrtElements);
    this.diagonal     = bDiagonal;
    this.flipOnYAxis  = bflipOnYAxis;
    this.aBasePath    = createUnitSquarePath();
    }
    
    SnakeWipePath.prototype.calcSnake = function(t)
    {
    var aPolyPath = createEmptyPath();
    const area   = (t * this.sqrtElements * this.sqrtElements);
    const line_  = Math.floor(area) / this.sqrtElements;
    const line   = pruneScaleValue(line_ / this.sqrtElements);
    const col    = pruneScaleValue((area - (line_ * this.sqrtElements)) / this.sqrtElements);
    
    if(line != 0) {
    let aPath = 'M '+ 0.0 + ' ' + 0.0 + ' ';
    aPath += 'L ' + 0.0 + ' ' + line + ' ';
    aPath += 'L ' + 1.0 + ' ' + line + ' ';
    aPath += 'L ' + 1.0 + ' ' + 0.0 + ' ';
    aPath += 'L 0 0 ';
    let poly = document.createElementNS( NSS['svg'], 'path');
    poly.setAttribute('d', aPath);
    aPolyPath.appendPath(poly);
    }
    if(col != 0) {
    var offset = 0.0;
    if((line_ & 1) == 1) {
    offset = (1.0 - col);
    }
    let aPath = 'M ' + offset + ' ' + line + ' ';
    aPath += 'L '+ offset + ' ' + (line + this.elementEdge) + ' ';
    aPath += 'L ' + (offset+col) + ' ' + (line + this.elementEdge) + ' ';
    aPath += 'L ' + (offset+col) + ' ' + line + ' ';
    aPath += 'L ' + offset + ' ' + line + ' ';
    let poly = document.createElementNS( NSS['svg'], 'path');
    poly.setAttribute('d', aPath);
    aPolyPath.appendPath(poly);
    }
    
    return aPolyPath;
    }
    
    SnakeWipePath.prototype.calcHalfDiagonalSnake = function(nT, bIn) {
    var res = createEmptyPath();
    
    if(bIn) {
    const sqrtArea2 = Math.sqrt(nT * this.sqrtElements * this.sqrtElements);
    const edge = pruneScaleValue(sqrtArea2 / this.sqrtElements);
    
    var aPath, aPoint = document.documentElement.createSVGPoint();
    if(edge) {
    aPath = 'M ' + aPoint.x + ' ' + aPoint.y + ' ';
    aPoint.y = edge;
    aPath += 'L ' + aPoint.x + ' ' + aPoint.y + ' ';
    aPoint.x = edge;
    aPoint.y = 0.0;
    aPath += 'L ' + aPoint.x + ' ' + aPoint.y + ' ';
    aPoint.x = 0.0;
    aPath += 'L ' + aPoint.x + ' ' + aPoint.y + ' ';
    const poly = document.createElementNS( NSS['svg'], 'path');
    poly.setAttribute('d', aPath);
    res.appendPath(poly);
    }
    const a = (Math.SQRT1_2 / this.sqrtElements);
    const d = (sqrtArea2 - Math.floor(sqrtArea2));
    const len = (nT * Math.SQRT1_2 * d);
    const height = pruneScaleValue(Math.SQRT1_2 / this.sqrtElements);
    aPath = 'M ' + aPoint.x + ' ' + aPoint.y + ' ';
    aPoint.y = height;
    aPath += 'L ' + aPoint.x + ' ' + aPoint.y + ' ';
    aPoint.x = len + a;
    aPath += 'L ' + aPoint.x + ' ' + aPoint.y + ' ';
    aPoint.y = 0.0;
    aPath += 'L ' + aPoint.x + ' ' + aPoint.y + ' ';
    aPoint.x = 0.0;
    aPath += 'L ' + aPoint.x + ' ' + aPoint.y + ' ';
    const poly = document.createElementNS( NSS['svg'], 'path');
    poly.setAttribute('d', aPath);
    let aTransform;
    
    if((Math.floor(sqrtArea2) & 1) == 1) {
    aTransform = SVGIdentityMatrix.rotate((Math.PI)/2 + (Math.PI)/4);
    aTransform.translate(edge + this.elementEdge, 0.0);
    }
    else {
    aTransform = SVGIdentityMatrix.translate(-a, 0.0);
    aTransform.rotate(-(Math.PI/4));
    aTransform.translate(0.0, edge);
    }
    
    poly.matrixTransform(aTransform);
    res.appendPath(poly);
    }
    else { //out
    const sqrtArea2 = Math.sqrt(nT * this.sqrtElements * this.sqrtElements);
    const edge = pruneScaleValue(Math.floor(sqrtArea2)/this.sqrtElements);
    
    let aPath, aPoint = document.documentElement.createSVGPoint();
    if(edge != 0) {
    aPoint.y = 1.0;
    aPath = 'M ' + aPoint.x + ' ' + aPoint.y + ' ';
    aPoint.x = edge;
    aPath += 'L ' + aPoint.x + ' ' + aPoint.y + ' ';
    aPoint.x = 1.0;
    aPoint.y = edge;
    aPath += 'L ' + aPoint.x + ' ' + aPoint.y + ' ';
    aPoint.y = 0.0;
    aPath += 'L ' + aPoint.x + ' ' + aPoint.y + ' ';
    aPoint.x = 0.0;
    aPath += 'L ' + aPoint.x + ' ' + aPoint.y + ' ';
    const poly = document.createElementNS( NSS['svg'], 'path');
    poly.setAttribute('d', aPath);
    res.appendPath(poly);
    }
    const a = (Math.SQRT1_2 / this.sqrtElements);
    const d = (sqrtArea2 - Math.floor(sqrtArea2));
    const len = ((1.0 - nT) * Math.SQRT2 * d);
    const height = pruneScaleValue(Math.SQRT1_2 / this.sqrtElements);
    aPath = 'M ' + aPoint.x + ' ' + aPoint.y + ' ';
    aPoint.y = height;
    aPath += 'L ' + aPoint.x + ' ' + aPoint.y + ' ';
    aPoint.x = len + a;
    aPath += 'L ' + aPoint.x + ' ' + aPoint.y + ' ';
    aPoint.y = 0.0;
    aPath += 'L ' + aPoint.x + ' ' + aPoint.y + ' ';
    aPoint.x = 0.0;
    aPath += 'L ' + aPoint.x + ' ' + aPoint.y + ' ';
    const poly = document.createElementNS( NSS['svg'], 'path');
    poly.setAttribute('d', aPath);
    let aTransform;
    
    if((Math.floor(sqrtArea2) & 1) == 1) {
    aTransform = SVGIdentityMatrix.translate(0.0, -height);
    aTransform.rotate(Math.PI/2 + Math.PI/4);
    aTransform.translate(1.0, edge);
    }
    else {
    aTransform = SVGIdentityMatrix.rotate(-(Math.PI/4));
    aTransform = aTransform.translate(edge, 1.0);
    }
    poly.matrixTransform(aTransform);
    res.appendPath(poly);
    }
    return res;
    }
    
    SnakeWipePath.prototype.perform = function(nT) {
    var res = createEmptyPath();
    if(this.diagonal) {
    if(nT >= 0.5) {
    res.appendPath(this.calcHalfDiagonalSnake(1.0, true));
    res.appendPath(this.calcHalfDiagonalSnake(2.0*(nT-0.5), false));
    }
    else
    res.appendPath(this.calcHalfDiagonalSnake(2.0*nT, true));
    }
    else
    res = this.calcSnake(nT);
    
    return this.flipOnYAxis ? flipOnYAxis(res) : res;
    }
    
    function ParallelSnakesWipePath(nElements, bDiagonal, bFlipOnYAxis, bOpposite) {
    SnakeWipePath.call(this, nElements, bDiagonal, bFlipOnYAxis);
    this.bOpposite = bOpposite;
    }
    
    ParallelSnakesWipePath.prototype = Object.create(SnakeWipePath);
    
    ParallelSnakesWipePath.prototype.perform = function( nT ) {
    var res = createEmptyPath(), half, aTransform;
    if(this.diagonal) {
    assert(this.bOpposite);
    half = SnakeWipePath.prototype.calcHalfDiagonalSnake.call(this, nT, false);
    aTransform = SVGIdentityMatrix.scale(1, -1);
    aTransform.translate(-0.5, 0.5);
    aTransform.rotate(Math.PI/2);
    aTransform.translate(0.5, 0.5);
    half.matrixTransform(aTransform);
    half.changeOrientation();
    res.appendPath(half);
    
    aTransform = SVGIdentityMatrix.translate(-0.5, -0.5);
    aTransform.rotate(Math.PI);
    aTransform.translate(0.5, 0.5);
    half.matrixTransform(aTransform);
    res.appendPath(half);
    }
    else {
    half = SnakeWipePath.prototype.calcSnake.call(this, nT / 2.0 );
    aTransform = SVGIdentityMatrix.translate(-0.5, -0.5);
    aTransform = aTransform.rotate(Math.PI/2);
    aTransform = aTransform.translate(0.5, 0.5);
    half.matrixTransform(aTransform);
    res.appendPath(flipOnYAxis(half));
    res.appendPath(this.bOpposite ? flipOnXAxis(half) : half);
    }
    
    return this.flipOnYAxis ? flipOnYAxis(res) : res;
    }
    
    function SpiralWipePath(nElements, bFlipOnYAxis) {
    this.nElements    = nElements;
    this.sqrtElements = Math.floor(Math.sqrt(nElements));
    this.bFlipOnYAxis = bFlipOnYAxis;
    }
    
    SpiralWipePath.prototype.calcNegSpiral = function( nT ) {
    var area  = nT * this.nElements;
    var e     = (Math.sqrt(area) / 2.0);
    var edge  = Math.floor(e) * 2;
    
    var aTransform = SVGIdentityMatrix.translate(-0.5, -0.5);
    var edge_ = pruneScaleValue(edge / this.sqrtElements);
    
    aTransform = aTransform.scale(edge_, edge_);
    aTransform = aTransform.translate(0.5, 0.5);
    var poly = createUnitSquarePath();
    poly.matrixTransform(aTransform);
    var res = poly.cloneNode(true);
    
    if(1.0 - nT != 0) {
    var edge1 = edge + 1;
    var len   = Math.floor( (e - edge/2) * edge1 * 4);
    var w     = Math.PI / 2;
    
    while(len > 0) {
    var alen = Math.min(len, edge1);
    len -= alen;
    poly = createUnitSquarePath();
    aTransform = SVGIdentityMatrix.scale(
    pruneScaleValue( alen / this.sqrtElements ),
    pruneScaleValue( 1.0 / this.sqrtElements ));
    aTransform = aTransform.translate(
    - pruneScaleValue( (edge / 2) / this.sqrtElements ),
    pruneScaleValue( (edge / 2) / this.sqrtElements ));
    aTransform = aTransform.rotate( w );
    w -= Math.PI / 2;
    aTransform = aTransform.translate(0.5, 0.5);
    poly.matrixTransform(aTransform);
    res.appendPath(poly);
    }
    }
    
    return res;
    }
    
    SpiralWipePath.prototype.perform = function( nT ) {
    var res         = createUnitSquarePath();
    var innerSpiral = this.calcNegSpiral( 1.0 - nT );
    innerSpiral.changeOrientation();
    res.appendPath(innerSpiral);
    
    return this.bFlipOnYAxis ? flipOnYAxis(res) : res;
    }
    
    function BoxSnakesWipePath(nElements, bFourBox) {
    SpiralWipePath.call(this, nElements);
    this.bFourBox = bFourBox;
    }
    
    BoxSnakesWipePath.prototype = Object.create(SpiralWipePath);
    
    BoxSnakesWipePath.prototype.perform = function( nT ) {
    var res = createUnitSquarePath(), aTransform;
    var innerSpiral = SpiralWipePath.prototype.calcNegSpiral.call(this, 1.0 - nT);
    innerSpiral.changeOrientation();
    
    if(this.bFourBox) {
    aTransform = SVGIdentityMatrix.scale(0.5, 0.5);
    innerSpiral.matrixTransform(aTransform);
    res.appendPath(innerSpiral);
    res.appendPath(flipOnXAxis(innerSpiral));
    innerSpiral = flipOnYAxis(innerSpiral);
    res.appendPath(innerSpiral);
    res.appendPath(flipOnXAxis(innerSpiral));
    }
    else {
    aTransform = SVGIdentityMatrix.scale(1.0, 0.5);
    innerSpiral.matrixTransform(aTransform);
    res.appendPath(innerSpiral);
    res.appendPath(flipOnXAxis(innerSpiral));
    }
    return this.bFlipOnYAxis ? flipOnYAxis(res) : res;
    }
    
    function VeeWipePath() { }
    
    VeeWipePath.prototype.perform = function( nT ) {
    const d = pruneScaleValue(2.0 * nT);
    var polyPath = 'M ' + 0.0 + ' ' + -1.0 + ' ';
    polyPath += 'L ' + 0.0 + ' ' + (d - 1.0) + ' ';
    polyPath += 'L ' + 0.5 + ' ' + d + ' ';
    polyPath += 'L ' + 1.0 + ' ' + (d - 1.0) + ' ';
    polyPath += 'L ' + 1.0 + ' ' + -1.0 + ' ';
    polyPath += 'L ' + 0.0 + ' ' + -1.0 + ' ';
    
    var aPolyPolyPath = document.createElementNS( NSS['svg'], 'path');
    aPolyPolyPath.setAttribute('d', polyPath);
    return aPolyPolyPath;
    }
    
    
    function AnimatedSlide( aMetaSlide )
    {
    if( !aMetaSlide )
    {
    log( 'AnimatedSlide constructor: meta slide is not valid' );
    }
    
    this.aMetaSlide = aMetaSlide;
    this.aSlideElement = this.aMetaSlide.slideElement;
    this.sSlideId = this.aMetaSlide.slideId;
    
    this.aUsedAttributeSet = [];
    
    this.aClipPathElement = null;
    this.aClipPathContent = null;
    this.bIsClipped = false;
    }
    
    AnimatedSlide.prototype.show = function()
    {
    this.aMetaSlide.show();
    };
    
    AnimatedSlide.prototype.hide = function()
    {
    this.aMetaSlide.hide();
    };
    
    AnimatedSlide.prototype.notifyUsedAttribute = function( sName )
    {
    if( sName == 'clip-path' )
    {
    this.initClipPath();
    this.bIsClipped = true;
    }
    else
    {
    this.aUsedAttributeSet.push( sName );
    }
    };
    
    AnimatedSlide.prototype.reset = function()
    {
    if( this.bIsClipped )
    {
    this.cleanClipPath();
    this.bIsClipped = false;
    }
    
    var i;
    for( i = 0; i < this.aUsedAttributeSet.length; ++i )
    {
    var sAttrName = this.aUsedAttributeSet[i];
    this.aSlideElement.removeAttribute( sAttrName );
    }
    this.aUsedAttributeSet = [];
    };
    
    AnimatedSlide.prototype.initClipPath = function()
    {
    this.aClipPathElement = document.createElementNS( NSS['svg'], 'clipPath' );
    
    var sId = 'clip-path-' + this.sSlideId;
    this.aClipPathElement.setAttribute( 'id', sId );
    this.aClipPathElement.setAttribute( 'clipPathUnits', 'userSpaceOnUse' );
    
    this.aClipPathContent = document.createElementNS( NSS['svg'], 'path' );
    var sPathData = 'M 0 0 h ' + WIDTH + ' v ' + HEIGHT + ' h -' + WIDTH + ' z';
    this.aClipPathContent.setAttribute( 'd', sPathData );
    this.aClipPathElement.appendChild( this.aClipPathContent );
    
    var aClipPathGroup = theMetaDoc.aClipPathGroup;
    aClipPathGroup.appendChild( this.aClipPathElement );
    
    var sRef = 'url(#' + sId + ')';
    this.aSlideElement.parentNode.setAttribute( 'clip-path', sRef );
    };
    
    AnimatedSlide.prototype.cleanClipPath = function()
    {
    this.aSlideElement.parentNode.removeAttribute( 'clip-path' );
    
    if( this.aClipPathElement )
    {
    var aClipPathGroup = theMetaDoc.aClipPathGroup;
    aClipPathGroup.removeChild( this.aClipPathElement );
    this.aClipPathElement = null;
    this.aClipPathContent = null;
    }
    };
    
    AnimatedSlide.prototype.insertBefore = function( aElement )
    {
    if( aElement )
    {
    this.aSlideElement.parentNode.insertBefore( aElement, this.aSlideElement );
    }
    };
    
    AnimatedSlide.prototype.appendElement = function( aElement )
    {
    if( aElement )
    {
    this.aSlideElement.parentNode.appendChild( aElement );
    }
    };
    
    AnimatedSlide.prototype.removeElement = function( aElement )
    {
    if( aElement )
    {
    this.aSlideElement.parentNode.removeChild( aElement );
    }
    };
    
    AnimatedSlide.prototype.getWidth = function()
    {
    return WIDTH;
    };
    
    AnimatedSlide.prototype.getHeight = function()
    {
    return HEIGHT;
    };
    
    AnimatedSlide.prototype.setOpacity = function( nValue )
    {
    this.aSlideElement.setAttribute( 'opacity', nValue );
    };
    
    AnimatedSlide.prototype.translate = function( nDx, nDy )
    {
    var sTransformAttr = 'translate(' + nDx + ',' + nDy + ')';
    this.aSlideElement.setAttribute( 'transform', sTransformAttr );
    };
    
    AnimatedSlide.prototype.setClipPath = function( aClipPathContent )
    {
    if( this.aClipPathContent )
    {
    var sPathData = aClipPathContent.getAttribute( 'd' );
    this.aClipPathContent.setAttribute( 'd', sPathData );
    }
    };
    
    
    function AnimatedElement( aElement )
    {
    if( !aElement )
    {
    log( 'AnimatedElement constructor: element is not valid' );
    }
    
    this.aSlideShowContext = null;
    
    this.aBaseElement = aElement.cloneNode( true );
    this.aActiveElement = aElement;
    this.sElementId = this.aActiveElement.getAttribute( 'id' );
    
    this.aBaseBBox = this.aActiveElement.getBBox();
    this.nBaseCenterX = this.aBaseBBox.x + this.aBaseBBox.width / 2;
    this.nBaseCenterY = this.aBaseBBox.y + this.aBaseBBox.height / 2;
    
    
    this.aClipPathElement = null;
    this.aClipPathContent = null;
    
    this.aPreviousElement = null;
    this.aStateSet = {};
    
    this.eAdditiveMode = ADDITIVE_MODE_REPLACE;
    this.bIsUpdated = true;
    
    this.aTMatrix = document.documentElement.createSVGMatrix();
    this.aCTM = document.documentElement.createSVGMatrix();
    this.aICTM = document.documentElement.createSVGMatrix();
    
    this.initElement();
    }
    
    AnimatedElement.prototype.initElement = function()
    {
    this.nCenterX = this.nBaseCenterX;
    this.nCenterY = this.nBaseCenterY;
    this.nScaleFactorX = 1.0;
    this.nScaleFactorY = 1.0;
    this.nRotationAngle = 0.0;
    
    this.aActiveElement.setAttribute( 'transform', makeMatrixString( 1, 0, 0, 1, 0, 0 ) );
    };
    
    AnimatedElement.prototype.initClipPath = function()
    {
    this.aClipPathElement = document.createElementNS( NSS['svg'], 'clipPath' );
    
    var sId = 'clip-path-' + this.sElementId;
    this.aClipPathElement.setAttribute( 'id', sId );
    this.aClipPathElement.setAttribute( 'clipPathUnits', 'userSpaceOnUse' );
    
    this.aClipPathContent = document.createElementNS( NSS['svg'], 'path' );
    this.aClippingBBox = this.getBBoxWithStroke();
    var nWidth = this.aClippingBBox.width;
    var nHeight = this.aClippingBBox.height;
    var sPathData = 'M ' + this.aClippingBBox.x + ' ' + this.aClippingBBox.y +
    ' h ' + nWidth + ' v ' + nHeight + ' h -' + nWidth + ' z';
    this.aClipPathContent.setAttribute( 'd', sPathData );
    this.aClipPathElement.appendChild( this.aClipPathContent );
    
    var aClipPathGroup = theMetaDoc.aClipPathGroup;
    aClipPathGroup.appendChild( this.aClipPathElement );
    
    var sRef = 'url(#' + sId + ')';
    this.aActiveElement.setAttribute( 'clip-path', sRef );
    };
    
    AnimatedElement.prototype.cleanClipPath = function()
    {
    this.aActiveElement.removeAttribute( 'clip-path' );
    
    if( this.aClipPathElement )
    {
    var aClipPathGroup = theMetaDoc.aClipPathGroup;
    aClipPathGroup.removeChild( this.aClipPathElement );
    this.aClipPathElement = null;
    this.aClipPathContent = null;
    }
    };
    
    AnimatedElement.prototype.getId = function()
    {
    return this.aActiveElement.getAttribute( 'id' );
    };
    
    AnimatedElement.prototype.getAdditiveMode = function()
    {
    return this.eAdditiveMode;
    };
    
    AnimatedElement.prototype.setAdditiveMode = function( eAdditiveMode )
    {
    this.eAdditiveMode = eAdditiveMode;
    };
    
    AnimatedElement.prototype.setToElement = function( aElement )
    {
    if( !aElement )
    {
    log( 'AnimatedElement(' + this.getId() + ').setToElement: element is not valid' );
    return false;
    }
    
    var aClone = aElement.cloneNode( true );
    this.aPreviousElement = this.aActiveElement.parentNode.replaceChild( aClone, this.aActiveElement );
    this.aActiveElement = aClone;
    
    return true;
    };
    
    AnimatedElement.prototype.notifySlideStart = function( aSlideShowContext )
    {
    if( !aSlideShowContext )
    {
    log( 'AnimatedElement.notifySlideStart: slideshow context is not valid' );
    }
    this.aSlideShowContext = aSlideShowContext;
    
    var aClone = this.aBaseElement.cloneNode( true );
    this.aActiveElement.parentNode.replaceChild( aClone, this.aActiveElement );
    this.aActiveElement = aClone;
    
    this.initElement();
    this.DBG( '.notifySlideStart invoked' );
    };
    
    AnimatedElement.prototype.notifySlideEnd = function()
    {
    };
    
    AnimatedElement.prototype.notifyAnimationStart = function()
    {
    };
    
    AnimatedElement.prototype.notifyAnimationEnd = function()
    {
    };
    
    AnimatedElement.prototype.notifyNextEffectStart = function( /*nEffectIndex*/ )
    {
    };
    
    AnimatedElement.prototype.saveState = function( nAnimationNodeId )
    {
    ANIMDBG.print( 'AnimatedElement(' + this.getId() + ').saveState(' + nAnimationNodeId +')' );
    if( !this.aStateSet[ nAnimationNodeId ] )
    {
    this.aStateSet[ nAnimationNodeId ] = {};
    }
    var aState = this.aStateSet[ nAnimationNodeId ];
    aState.aElement = this.aActiveElement.cloneNode( true );
    aState.nCenterX = this.nCenterX;
    aState.nCenterY = this.nCenterY;
    aState.nScaleFactorX = this.nScaleFactorX;
    aState.nScaleFactorY = this.nScaleFactorY;
    aState.nRotationAngle = this.nRotationAngle;
    
    };
    
    AnimatedElement.prototype.restoreState = function( nAnimationNodeId )
    {
    if( !this.aStateSet[ nAnimationNodeId ] )
    {
    log( 'AnimatedElement(' + this.getId() + ').restoreState: state '
    +nAnimationNodeId  + ' is not valid' );
    return false;
    }
    
    ANIMDBG.print( 'AnimatedElement(' + this.getId() + ').restoreState(' + nAnimationNodeId +')' );
    var aState = this.aStateSet[ nAnimationNodeId ];
    var bRet = this.setToElement( aState.aElement );
    if( bRet )
    {
    this.nCenterX = aState.nCenterX;
    this.nCenterY = aState.nCenterY;
    this.nScaleFactorX = aState.nScaleFactorX;
    this.nScaleFactorY = aState.nScaleFactorY;
    this.nRotationAngle = aState.nRotationAngle;
    }
    return bRet;
    };
    
    AnimatedElement.prototype.getBaseBBox = function()
    {
    return this.aBaseBBox;
    };
    
    AnimatedElement.prototype.getBaseCenterX = function()
    {
    return this.nBaseCenterX;
    };
    
    AnimatedElement.prototype.getBaseCenterY = function()
    {
    return this.nBaseCenterY;
    };
    
    AnimatedElement.prototype.getBBox = function()
    {
    return this.aActiveElement.parentNode.getBBox();
    };
    
    AnimatedElement.prototype.getBBoxWithStroke = function()
    {
    var aBBox = this.aActiveElement.parentNode.getBBox();
    
    var aChildrenSet = this.aActiveElement.childNodes;
    
    var sStroke, sStrokeWidth;
    var nStrokeWidth = 0;
    var i;
    for( i = 0; i < aChildrenSet.length; ++i )
    {
    if( ! aChildrenSet[i].getAttribute  )
    continue;
    
    sStroke = aChildrenSet[i].getAttribute( 'stroke' );
    if( sStroke && sStroke != 'none' )
    {
    sStrokeWidth = aChildrenSet[i].getAttribute( 'stroke-width' );
    var nSW = parseFloat( sStrokeWidth );
    if( nSW > nStrokeWidth )
    nStrokeWidth = nSW;
    }
    }
    
    if( nStrokeWidth == 0 )
    {
    sStrokeWidth = ROOT_NODE.getAttribute( 'stroke-width' );
    nStrokeWidth = parseFloat( sStrokeWidth );
    }
    if( nStrokeWidth != 0 )
    {
    nStrokeWidth *= 1.1;
    var nHalfStrokeWidth = nStrokeWidth / 2;
    var nDoubleStrokeWidth = nStrokeWidth * 2;
    
    var aEBBox = document.documentElement.createSVGRect();
    aEBBox.x = aBBox.x - nHalfStrokeWidth;
    aEBBox.y = aBBox.y - nHalfStrokeWidth;
    aEBBox.width = aBBox.width + nDoubleStrokeWidth;
    aEBBox.height = aBBox.height + nDoubleStrokeWidth;
    aBBox = aEBBox;
    }
    return aBBox;
    };
    
    AnimatedElement.prototype.setClipPath = function( aClipPathContent )
    {
    if( this.aClipPathContent )
    {
    var aTranslation = SVGIdentityMatrix.translate( this.aClippingBBox.x,
    this.aClippingBBox.y);
    aClipPathContent.matrixTransform( aTranslation );
    var sPathData = aClipPathContent.getAttribute( 'd' );
    this.aClipPathContent.setAttribute( 'd', sPathData );
    }
    };
    
    
    AnimatedElement.prototype.getX = function()
    {
    return this.nCenterX;
    };
    
    AnimatedElement.prototype.getY = function()
    {
    return this.nCenterY;
    };
    
    AnimatedElement.prototype.getWidth = function()
    {
    return this.nScaleFactorX * this.getBaseBBox().width;
    };
    
    AnimatedElement.prototype.getHeight = function()
    {
    return this.nScaleFactorY * this.getBaseBBox().height;
    };
    
    AnimatedElement.prototype.updateTransformAttribute = function()
    {
    this.aTransformAttrList = this.aActiveElement.transform.baseVal;
    this.aTransformAttr = this.aTransformAttrList.getItem( 0 );
    this.aTransformAttr.setMatrix( this.aTMatrix );
    };
    
    AnimatedElement.prototype.setX = function( nNewCenterX )
    {
    if( nNewCenterX === this.nCenterX ) return;
    
    this.aTransformAttrList = this.aActiveElement.transform.baseVal;
    this.aTransformAttr = this.aTransformAttrList.getItem( 0 );
    this.aTMatrix = this.aTransformAttr.matrix.translate( nNewCenterX - this.nCenterX, 0 );
    this.aTransformAttr.setMatrix( this.aTMatrix );
    this.nCenterX = nNewCenterX;
    };
    
    AnimatedElement.prototype.setY = function( nNewCenterY )
    {
    if( nNewCenterY === this.nCenterY ) return;
    
    this.aTransformAttrList = this.aActiveElement.transform.baseVal;
    this.aTransformAttr = this.aTransformAttrList.getItem( 0 );
    this.aTMatrix = this.aTransformAttr.matrix.translate( 0, nNewCenterY - this.nCenterY );
    this.aTransformAttr.setMatrix( this.aTMatrix );
    this.nCenterY = nNewCenterY;
    };
    
    AnimatedElement.prototype.setWidth = function( nNewWidth )
    {
    ANIMDBG.print( 'AnimatedElement.setWidth: nNewWidth = ' + nNewWidth );
    if( nNewWidth < 0 )
    {
    log('AnimatedElement(' + this.getId() + ').setWidth: negative height!');
    nNewWidth = 0;
    }
    
    var nBaseWidth = this.getBaseBBox().width;
    var nScaleFactorX = nNewWidth / nBaseWidth;
    
    if( nScaleFactorX < 1e-5 ) nScaleFactorX = 1e-5;
    if( nScaleFactorX == this.nScaleFactorX ) return;
    
    this.aTMatrix = document.documentElement.createSVGMatrix()
    .translate( this.nCenterX, this.nCenterY )
    .rotate(this.nRotationAngle)
    .scaleNonUniform( nScaleFactorX, this.nScaleFactorY )
    .translate( -this.nBaseCenterX, -this.nBaseCenterY );
    this.updateTransformAttribute();
    
    this.nScaleFactorX = nScaleFactorX;
    };
    
    AnimatedElement.prototype.setHeight = function( nNewHeight )
    {
    ANIMDBG.print( 'AnimatedElement.setWidth: nNewHeight = ' + nNewHeight );
    if( nNewHeight < 0 )
    {
    log('AnimatedElement(' + this.getId() + ').setWidth: negative height!');
    nNewHeight = 0;
    }
    
    var nBaseHeight = this.getBaseBBox().height;
    var nScaleFactorY = nNewHeight / nBaseHeight;
    
    if( nScaleFactorY < 1e-5 ) nScaleFactorY = 1e-5;
    if( nScaleFactorY == this.nScaleFactorY ) return;
    
    this.aTMatrix = document.documentElement.createSVGMatrix()
    .translate( this.nCenterX, this.nCenterY )
    .rotate(this.nRotationAngle)
    .scaleNonUniform( this.nScaleFactorX, nScaleFactorY )
    .translate( -this.nBaseCenterX, -this.nBaseCenterY );
    this.updateTransformAttribute();
    
    this.nScaleFactorY = nScaleFactorY;
    };
    
    AnimatedElement.prototype.getOpacity = function()
    {
    return this.aActiveElement.getAttribute( 'opacity' );
    };
    
    AnimatedElement.prototype.setOpacity = function( nValue )
    {
    this.aActiveElement.setAttribute( 'opacity', nValue );
    };
    
    AnimatedElement.prototype.getRotationAngle = function()
    {
    return this.nRotationAngle;
    };
    
    AnimatedElement.prototype.setRotationAngle = function( nNewRotAngle )
    {
    this.aTMatrix = document.documentElement.createSVGMatrix()
    .translate( this.nCenterX, this.nCenterY )
    .rotate(nNewRotAngle)
    .scaleNonUniform( this.nScaleFactorX, this.nScaleFactorY )
    .translate( -this.nBaseCenterX, -this.nBaseCenterY );
    this.updateTransformAttribute();
    
    this.nRotationAngle = nNewRotAngle;
    };
    
    AnimatedElement.prototype.getVisibility = function()
    {
    
    var sVisibilityValue = this.aActiveElement.getAttribute( 'visibility' );
    if( !sVisibilityValue || ( sVisibilityValue === 'inherit' ) )
    return 'visible'; // TODO: look for parent visibility!
    else
    return sVisibilityValue;
    };
    
    AnimatedElement.prototype.setVisibility = function( sValue )
    {
    if( sValue == 'visible' )
    sValue = 'inherit';
    this.aActiveElement.setAttribute( 'visibility', sValue );
    };
    
    AnimatedElement.prototype.getStrokeStyle = function()
    {
    return 'solid';
    };
    
    AnimatedElement.prototype.setStrokeStyle = function( sValue )
    {
    ANIMDBG.print( 'AnimatedElement.setStrokeStyle(' + sValue + ')' );
    };
    
    AnimatedElement.prototype.getFillStyle = function()
    {
    return 'solid';
    };
    
    AnimatedElement.prototype.setFillStyle = function( sValue )
    {
    ANIMDBG.print( 'AnimatedElement.setFillStyle(' + sValue + ')' );
    };
    
    AnimatedElement.prototype.getFillColor = function()
    {
    var aChildSet = getElementChildren( this.aActiveElement );
    var sFillColorValue = '';
    for( var i = 0; i <  aChildSet.length; ++i )
    {
    sFillColorValue = aChildSet[i].getAttribute( 'fill' );
    if( sFillColorValue && ( sFillColorValue !== 'none' ) )
    break;
    }
    
    return colorParser( sFillColorValue );
    };
    
    AnimatedElement.prototype.setFillColor = function( aRGBValue )
    {
    assert( aRGBValue instanceof RGBColor,
    'AnimatedElement.setFillColor: value argument is not an instance of RGBColor' );
    
    var sValue = aRGBValue.toString( true /* clamped values */ );
    var aChildSet = getElementChildren( this.aActiveElement );
    
    var sFillColorValue = '';
    for( var i = 0; i <  aChildSet.length; ++i )
    {
    sFillColorValue = aChildSet[i].getAttribute( 'fill' );
    if( sFillColorValue && ( sFillColorValue !== 'none' ) )
    {
    aChildSet[i].setAttribute( 'fill', sValue );
    }
    }
    };
    
    AnimatedElement.prototype.getStrokeColor = function()
    {
    var aChildSet = getElementChildren( this.aActiveElement );
    var sStrokeColorValue = '';
    for( var i = 0; i <  aChildSet.length; ++i )
    {
    sStrokeColorValue = aChildSet[i].getAttribute( 'stroke' );
    if( sStrokeColorValue && ( sStrokeColorValue !== 'none' ) )
    break;
    }
    
    return colorParser( sStrokeColorValue );
    };
    
    AnimatedElement.prototype.setStrokeColor = function( aRGBValue )
    {
    assert( aRGBValue instanceof RGBColor,
    'AnimatedElement.setFillColor: value argument is not an instance of RGBColor' );
    
    var sValue = aRGBValue.toString( true /* clamped values */ );
    var aChildSet = getElementChildren( this.aActiveElement );
    
    var sStrokeColorValue = '';
    for( var i = 0; i <  aChildSet.length; ++i )
    {
    sStrokeColorValue = aChildSet[i].getAttribute( 'stroke' );
    if( sStrokeColorValue && ( sStrokeColorValue !== 'none' ) )
    {
    aChildSet[i].setAttribute( 'stroke', sValue );
    }
    }
    };
    
    AnimatedElement.prototype.getFontColor = function()
    {
    return new RGBColor( 0, 0, 0 );
    };
    
    AnimatedElement.prototype.setFontColor = function( sValue )
    {
    ANIMDBG.print( 'AnimatedElement.setFontColor(' + sValue + ')' );
    };
    
    AnimatedElement.prototype.DBG = function( sMessage, nTime )
    {
    aAnimatedElementDebugPrinter.print( 'AnimatedElement(' + this.getId() + ')' + sMessage, nTime );
    };
    
    
    function AnimatedTextElement( aElement, aEventMultiplexer )
    {
    var theDocument = document;
    
    var sTextType = aElement.getAttribute( 'class' );
    var bIsListItem = ( sTextType === 'ListItem' );
    if( ( sTextType !== 'TextParagraph' ) && !bIsListItem )
    {
    log( 'AnimatedTextElement: passed element is not a paragraph.' );
    return;
    }
    var aTextShapeElement = aElement.parentNode;
    sTextType = aTextShapeElement.getAttribute( 'class' );
    if( sTextType !== 'TextShape' )
    {
    log( 'AnimatedTextElement: element parent is not a text shape.' );
    return;
    }
    var aTextShapeGroup = aTextShapeElement.parentNode;
    var aAnimatedElementGroup = getElementByClassName( aTextShapeGroup, 'AnimatedElements' );
    if( !aAnimatedElementGroup )
    {
    aAnimatedElementGroup = theDocument.createElementNS( NSS['svg'], 'g' );
    aAnimatedElementGroup.setAttribute( 'class', 'AnimatedElements' );
    aTextShapeGroup.appendChild( aAnimatedElementGroup );
    }
    
    var aAnimatableElement = theDocument.createElementNS( NSS['svg'], 'g' );
    var aTextElement = theDocument.createElementNS( NSS['svg'], 'text' );
    var aParagraphElement = aElement.cloneNode( true );
    
    this.aGraphicGroupElement = theDocument.createElementNS( NSS['svg'], 'g' );
    this.aGraphicGroupElement.setAttribute( 'class', 'GraphicGroup' );
    
    var aBulletCharClone = null;
    var aBulletCharElem = null;
    var bIsBulletCharStyle =
    ( aElement.getAttributeNS( NSS['ooo'], aOOOAttrListItemNumberingType ) === 'bullet-style' );
    if( bIsBulletCharStyle )
    {
    var aBulletCharGroupElem = getElementByClassName( aTextShapeGroup, 'BulletChars' );
    if( aBulletCharGroupElem )
    {
    var aBulletPlaceholderElem = getElementByClassName( aElement, 'BulletPlaceholder' );
    if( aBulletPlaceholderElem )
    {
    var sId = aBulletPlaceholderElem.getAttribute( 'id' );
    sId = 'bullet-char(' + sId + ')';
    aBulletCharElem = theDocument.getElementById( sId );
    if( aBulletCharElem )
    {
    aBulletCharClone = aBulletCharElem.cloneNode( true );
    }
    else
    {
    log( 'AnimatedTextElement: ' + sId + ' not found.' );
    }
    }
    else
    {
    log( 'AnimatedTextElement: no bullet placeholder found' );
    }
    }
    else
    {
    log( 'AnimatedTextElement: no bullet char group found' );
    }
    }
    
    var aBitmapElemSet = [];
    var aBitmapCloneSet = [];
    var aBitmapPlaceholderSet = getElementsByClassName( aElement, 'BitmapPlaceholder' );
    var i;
    if( aBitmapPlaceholderSet )
    {
    for( i = 0; i < aBitmapPlaceholderSet.length; ++i )
    {
    sId = aBitmapPlaceholderSet[i].getAttribute( 'id' );
    var sBitmapChecksum = sId.substring( 'bitmap-placeholder'.length + 1, sId.length - 1 );
    sId = 'embedded-bitmap(' + sBitmapChecksum + ')';
    aBitmapElemSet[i] = theDocument.getElementById( sId );
    if( aBitmapElemSet[i] )
    {
    aBitmapCloneSet[i] = aBitmapElemSet[i].cloneNode( true );
    }
    else
    {
    log( 'AnimatedTextElement: ' + sId + ' not found.' );
    }
    }
    }
    
    
    this.sParagraphId = sId = aParagraphElement.getAttribute( 'id' );
    aParagraphElement.removeAttribute( 'id' );
    aAnimatableElement.setAttribute( 'id', sId +'.a' );
    if( aBulletCharClone )
    aBulletCharClone.removeAttribute( 'id' );
    for( i = 0; i < aBitmapCloneSet.length; ++i )
    {
    if( aBitmapCloneSet[i] )
    aBitmapCloneSet[i].removeAttribute( 'id' );
    }
    
    var sVisibilityAttr = aElement.getAttribute( 'visibility' );
    if( !sVisibilityAttr )
    sVisibilityAttr = 'inherit';
    aAnimatableElement.setAttribute( 'visibility', sVisibilityAttr );
    aParagraphElement.setAttribute( 'visibility', 'inherit' );
    this.aGraphicGroupElement.setAttribute( 'visibility', 'inherit' );
    if( aBulletCharElem )
    aBulletCharElem.setAttribute( 'visibility', 'hidden' );
    for( i = 0; i < aBitmapCloneSet.length; ++i )
    {
    if( aBitmapElemSet[i] )
    aBitmapElemSet[i].setAttribute( 'visibility', 'hidden' );
    }
    
    
    aTextElement.appendChild( aParagraphElement );
    aAnimatableElement.appendChild( aTextElement );
    
    if( aBulletCharClone )
    this.aGraphicGroupElement.appendChild( aBulletCharClone );
    for( i = 0; i < aBitmapCloneSet.length; ++i )
    {
    if( aBitmapCloneSet[i] )
    this.aGraphicGroupElement.appendChild( aBitmapCloneSet[i] );
    }
    aAnimatableElement.appendChild( this.aGraphicGroupElement );
    aAnimatedElementGroup.appendChild( aAnimatableElement );
    
    this.aParentTextElement = aElement.parentNode;
    this.aParagraphElement = aElement;
    this.aAnimatedElementGroup = aAnimatedElementGroup;
    this.nRunningAnimations = 0;
    
    this.aHyperlinkIdSet = [];
    var aHyperlinkElementSet = getElementsByClassName( this.aParagraphElement, 'UrlField' );
    var sHyperlinkId;
    for( i = 0; i < aHyperlinkElementSet.length; ++i )
    {
    sHyperlinkId = aHyperlinkElementSet[i].getAttribute( 'id' );
    if( sHyperlinkId )
    this.aHyperlinkIdSet.push( sHyperlinkId );
    else
    log( 'error: AnimatedTextElement constructor: hyperlink element has no id' );
    }
    
    AnimatedTextElement.superclass.constructor.call( this, aAnimatableElement, aEventMultiplexer );
    
    }
    extend( AnimatedTextElement, AnimatedElement );
    
    
    AnimatedTextElement.prototype.setToElement = function( aElement )
    {
    var bRet = AnimatedTextElement.superclass.setToElement.call( this, aElement );
    if( bRet )
    {
    this.aGraphicGroupElement = getElementByClassName( this.aActiveElement, 'GraphicGroup' );
    }
    return ( bRet && this.aGraphicGroupElement );
    };
    
    AnimatedTextElement.prototype.notifySlideStart = function( aSlideShowContext )
    {
    DBGLOG( 'AnimatedTextElement.notifySlideStart' );
    AnimatedTextElement.superclass.notifySlideStart.call( this, aSlideShowContext );
    this.aGraphicGroupElement = getElementByClassName( this.aActiveElement, 'GraphicGroup' );
    this.restoreBaseTextParagraph();
    };
    
    AnimatedTextElement.prototype.notifySlideEnd = function()
    {
    DBGLOG( 'AnimatedTextElement.notifySlideEnd' );
    this.aGraphicGroupElement.setAttribute( 'visibility', 'inherit' );
    };
    
    AnimatedTextElement.prototype.restoreBaseTextParagraph = function()
    {
    var aActiveParagraphElement = this.aActiveElement.firstElementChild.firstElementChild;
    if( aActiveParagraphElement )
    {
    var sVisibilityAttr = this.aActiveElement.getAttribute( 'visibility' );
    if( !sVisibilityAttr || ( sVisibilityAttr === 'visible' ) )
    sVisibilityAttr = 'inherit';
    if( sVisibilityAttr === 'inherit' )
    this.aGraphicGroupElement.setAttribute( 'visibility', 'visible' );
    else
    this.aGraphicGroupElement.setAttribute( 'visibility', 'hidden' );
    
    var aParagraphClone = aActiveParagraphElement.cloneNode( true );
    aParagraphClone.setAttribute( 'id', this.sParagraphId );
    aParagraphClone.setAttribute( 'visibility', sVisibilityAttr );
    this.aParentTextElement.replaceChild( aParagraphClone, this.aParagraphElement );
    this.aParagraphElement = aParagraphClone;
    
    
    var aEventMultiplexer = this.aSlideShowContext.aEventMultiplexer;
    var aHyperlinkIdSet = this.aHyperlinkIdSet;
    var aHyperlinkElementSet = getElementsByClassName( this.aParagraphElement, 'UrlField' );
    var i = 0;
    for( ; i < aHyperlinkIdSet.length; ++i )
    {
    aEventMultiplexer.notifyElementChangedEvent( aHyperlinkIdSet[i], aHyperlinkElementSet[i] );
    }
    }
    this.aActiveElement.setAttribute( 'visibility', 'hidden' );
    };
    
    AnimatedTextElement.prototype.notifyAnimationStart = function()
    {
    DBGLOG( 'AnimatedTextElement.notifyAnimationStart' );
    if( this.nRunningAnimations === 0 )
    {
    var sVisibilityAttr = this.aParagraphElement.getAttribute( 'visibility' );
    if( !sVisibilityAttr )
    sVisibilityAttr = 'inherit';
    this.aActiveElement.setAttribute( 'visibility', sVisibilityAttr );
    this.aGraphicGroupElement.setAttribute( 'visibility', 'inherit' );
    this.aParagraphElement.setAttribute( 'visibility', 'hidden' );
    }
    ++this.nRunningAnimations;
    };
    
    AnimatedTextElement.prototype.notifyAnimationEnd = function()
    {
    DBGLOG( 'AnimatedTextElement.notifyAnimationEnd' );
    --this.nRunningAnimations;
    if( this.nRunningAnimations === 0 )
    {
    this.restoreBaseTextParagraph();
    }
    };
    
    AnimatedTextElement.prototype.saveState = function( nAnimationNodeId )
    {
    if( this.nRunningAnimations === 0 )
    {
    var sVisibilityAttr = this.aParagraphElement.getAttribute( 'visibility' );
    this.aActiveElement.setAttribute( 'visibility', sVisibilityAttr );
    this.aGraphicGroupElement.setAttribute( 'visibility', 'inherit' );
    }
    AnimatedTextElement.superclass.saveState.call( this, nAnimationNodeId );
    };
    
    AnimatedTextElement.prototype.restoreState = function( nAnimationNodeId )
    {
    var bRet = AnimatedTextElement.superclass.restoreState.call( this, nAnimationNodeId );
    if( bRet )
    this.restoreBaseTextParagraph();
    return bRet;
    };
    
    
    function SlideTransition( aAnimationsRootElement, aSlideId )
    {
    this.sSlideId = aSlideId;
    this.bIsValid = false;
    this.eTransitionType = undefined;
    this.eTransitionSubType = undefined;
    this.bReverseDirection = false;
    this.eTransitionMode = TRANSITION_MODE_IN;
    this.sFadeColor = null;
    this.aDuration = null;
    this.nMinFrameCount = undefined;
    
    if( aAnimationsRootElement )
    {
    if( aAnimationsRootElement.firstElementChild &&
    ( aAnimationsRootElement.firstElementChild.getAttributeNS( NSS['smil'], 'begin' ) === (this.sSlideId + '.begin') ) )
    {
    var aTransitionFilterElement = aAnimationsRootElement.firstElementChild.firstElementChild;
    if( aTransitionFilterElement && ( aTransitionFilterElement.localName === 'transitionFilter' ) )
    {
    this.aElement = aTransitionFilterElement;
    this.parseElement();
    }
    aAnimationsRootElement.removeChild( aAnimationsRootElement.firstElementChild );
    }
    }
    }
    
    SlideTransition.prototype.createSlideTransition = function( aLeavingSlide, aEnteringSlide )
    {
    if( !this.isValid() )
    return null;
    if( this.eTransitionType == 0 )
    return null;
    
    if( !aEnteringSlide )
    {
    log( 'SlideTransition.createSlideTransition: invalid entering slide.' );
    return null;
    }
    
    var aTransitionInfo = aTransitionInfoTable[this.eTransitionType][this.eTransitionSubType];
    var eTransitionClass = aTransitionInfo['class'];
    
    switch( eTransitionClass )
    {
    default:
    case TRANSITION_INVALID:
    log( 'SlideTransition.createSlideTransition: transition class: TRANSITION_INVALID' );
    return null;
    
    case TRANSITION_CLIP_POLYPOLYGON:
    var aParametricPolyPolygon
    = createClipPolyPolygon( this.eTransitionType, this.eTransitionSubType );
    return new ClippedSlideChange( aLeavingSlide, aEnteringSlide, aParametricPolyPolygon,
    aTransitionInfo, this.isDirectionForward() );
    
    case TRANSITION_SPECIAL:
    switch( this.eTransitionType )
    {
    default:
    log( 'SlideTransition.createSlideTransition: ' +
    'transition class: TRANSITION_SPECIAL, ' +
    'unknown transition type: ' + this.eTransitionType );
    return null;
    
    case PUSHWIPE_TRANSITION:
    {
    var aDirection = null;
    switch( this.eTransitionSubType )
    {
    default:
    log( 'SlideTransition.createSlideTransition: ' +
    'transition type: PUSHWIPE_TRANSITION, ' +
    'unknown transition subtype: ' + this.eTransitionSubType );
    return null;
    case FROMTOP_TRANS_SUBTYPE:
    aDirection = { x: 0.0, y: 1.0 };
    break;
    case FROMBOTTOM_TRANS_SUBTYPE:
    aDirection = { x: 0.0, y: -1.0 };
    break;
    case FROMLEFT_TRANS_SUBTYPE:
    aDirection = { x: 1.0, y: 0.0 };
    break;
    case FROMRIGHT_TRANS_SUBTYPE:
    aDirection = { x: -1.0, y: 0.0 };
    break;
    }
    return new MovingSlideChange( aLeavingSlide, aEnteringSlide, aDirection, aDirection );
    }
    
    case SLIDEWIPE_TRANSITION:
    {
    var aInDirection = null;
    switch( this.eTransitionSubType )
    {
    default:
    log( 'SlideTransition.createSlideTransition: ' +
    'transition type: SLIDEWIPE_TRANSITION, ' +
    'unknown transition subtype: ' + this.eTransitionSubType );
    return null;
    case FROMTOP_TRANS_SUBTYPE:
    aInDirection = { x: 0.0, y: 1.0 };
    break;
    case FROMBOTTOM_TRANS_SUBTYPE:
    aInDirection = { x: 0.0, y: -1.0 };
    break;
    case FROMLEFT_TRANS_SUBTYPE:
    aInDirection = { x: 1.0, y: 0.0 };
    break;
    case FROMRIGHT_TRANS_SUBTYPE:
    aInDirection = { x: -1.0, y: 0.0 };
    break;
    }
    var aNoDirection = { x: 0.0, y: 0.0 };
    if( !this.bReverseDirection )
    {
    return new MovingSlideChange( aLeavingSlide, aEnteringSlide, aNoDirection, aInDirection );
    }
    else
    {
    return new MovingSlideChange( aLeavingSlide, aEnteringSlide, aInDirection, aNoDirection );
    }
    }
    
    case FADE_TRANSITION:
    switch( this.eTransitionSubType )
    {
    default:
    log( 'SlideTransition.createSlideTransition: ' +
    'transition type: FADE_TRANSITION, ' +
    'unknown transition subtype: ' + this.eTransitionSubType );
    return null;
    case CROSSFADE_TRANS_SUBTYPE:
    return new FadingSlideChange( aLeavingSlide, aEnteringSlide );
    case FADEOVERCOLOR_TRANS_SUBTYPE:
    return new FadingOverColorSlideChange( aLeavingSlide, aEnteringSlide, this.getFadeColor() );
    }
    }
    }
    };
    
    SlideTransition.prototype.parseElement = function()
    {
    this.bIsValid = true;
    var aAnimElem = this.aElement;
    
    this.eTransitionType = undefined;
    var sTypeAttr = aAnimElem.getAttributeNS( NSS['smil'], 'type' );
    if( sTypeAttr && aTransitionTypeInMap[ sTypeAttr ] )
    {
    this.eTransitionType = aTransitionTypeInMap[ sTypeAttr ];
    }
    else
    {
    this.bIsValid = false;
    log( 'SlideTransition.parseElement: transition type not valid: ' + sTypeAttr );
    }
    
    this.eTransitionSubType = undefined;
    var sSubTypeAttr = aAnimElem.getAttributeNS( NSS['smil'], 'subtype' );
    if( sSubTypeAttr === null )
    sSubTypeAttr = 'default';
    if( sSubTypeAttr && ( aTransitionSubtypeInMap[ sSubTypeAttr ] !== undefined ) )
    {
    this.eTransitionSubType = aTransitionSubtypeInMap[ sSubTypeAttr ];
    }
    else
    {
    this.bIsValid = false;
    log( 'SlideTransition.parseElement: transition subtype not valid: ' + sSubTypeAttr );
    }
    
    if( this.bIsValid && aTransitionInfoTable[this.eTransitionType][this.eTransitionSubType] === undefined )
    {
    this.bIsValid = false;
    log( 'SlideTransition.parseElement: transition not valid: type: ' + sTypeAttr + ' subtype: ' + sSubTypeAttr );
    }
    
    this.bReverseDirection = false;
    var sDirectionAttr = aAnimElem.getAttributeNS( NSS['smil'], 'direction' );
    if( sDirectionAttr == 'reverse' )
    this.bReverseDirection = true;
    
    this.sFadeColor = null;
    if( this.eTransitionType == FADE_TRANSITION &&
    ( this.eTransitionSubType == FADEFROMCOLOR_TRANS_SUBTYPE ||
    this.eTransitionSubType == FADEOVERCOLOR_TRANS_SUBTYPE ||
    this.eTransitionSubType == FADETOCOLOR_TRANS_SUBTYPE ) )
    {
    var sColorAttr = aAnimElem.getAttributeNS( NSS['smil'], 'fadeColor' );
    if( sColorAttr )
    this.sFadeColor = sColorAttr;
    else
    this.sFadeColor='#000000';
    }
    
    
    this.aDuration = null;
    var sDurAttr = aAnimElem.getAttributeNS( NSS['smil'], 'dur' );
    this.aDuration = new Duration( sDurAttr );
    if( !this.aDuration.isSet() )
    {
    this.aDuration = new Duration( null ); // duration == 0.0
    }
    
    this.nMinFrameCount = ( this.getDuration().isValue() )
    ? ( this.getDuration().getValue() * MINIMUM_FRAMES_PER_SECONDS )
    : MINIMUM_FRAMES_PER_SECONDS;
    if( this.nMinFrameCount < 1.0 )
    this.nMinFrameCount = 1;
    else if( this.nMinFrameCount > MINIMUM_FRAMES_PER_SECONDS )
    this.nMinFrameCount = MINIMUM_FRAMES_PER_SECONDS;
    
    };
    
    SlideTransition.prototype.isValid = function()
    {
    return this.bIsValid;
    };
    
    SlideTransition.prototype.getTransitionType = function()
    {
    return this.eTransitionType;
    };
    
    SlideTransition.prototype.getTransitionSubType = function()
    {
    return this.eTransitionSubType;
    };
    
    SlideTransition.prototype.getTransitionMode = function()
    {
    return this.eTransitionMode;
    };
    
    SlideTransition.prototype.getFadeColor = function()
    {
    return this.sFadeColor;
    };
    
    SlideTransition.prototype.isDirectionForward = function()
    {
    return !this.bReverseDirection;
    };
    
    SlideTransition.prototype.getDuration = function()
    {
    return this.aDuration;
    };
    
    SlideTransition.prototype.getMinFrameCount = function()
    {
    return this.nMinFrameCount;
    };
    
    SlideTransition.prototype.info = function()
    {
    
    var sInfo ='slide transition <' + this.sSlideId + '>: ';
    sInfo += ';  type: ' + getKeyByValue(aTransitionTypeInMap, this.getTransitionType());
    
    sInfo += ';  subtype: ' + getKeyByValue(aTransitionSubtypeInMap, this.getTransitionSubType());
    
    if( !this.isDirectionForward() )
    sInfo += ';  direction: reverse';
    
    sInfo += '; mode: ' + aTransitionModeOutMap[ this.getTransitionMode() ];
    
    if( this.getDuration() )
    sInfo += '; duration: ' + this.getDuration().info();
    
    return sInfo;
    };
    
    
    function SlideAnimations( aSlideShowContext )
    {
    this.aContext = new NodeContext( aSlideShowContext );
    this.aAnimationNodeMap = {};
    this.aAnimatedElementMap = {};
    this.aSourceEventElementMap = {};
    this.aNextEffectEventArray = new NextEffectEventArray();
    this.aInteractiveAnimationSequenceMap = {};
    this.aEventMultiplexer = new EventMultiplexer( aSlideShowContext.aTimerEventQueue );
    this.aRootNode = null;
    this.bElementsParsed = false;
    
    this.aContext.aAnimationNodeMap = this.aAnimationNodeMap;
    this.aContext.aAnimatedElementMap = this.aAnimatedElementMap;
    this.aContext.aSourceEventElementMap = this.aSourceEventElementMap;
    
    this.aEventMultiplexer.registerMouseClickHandler( document, 100 );
    }
    
    
    SlideAnimations.prototype.importAnimations = function( aAnimationRootElement )
    {
    if( !aAnimationRootElement )
    return false;
    
    this.aRootNode = createAnimationTree( aAnimationRootElement, this.aContext );
    
    return ( this.aRootNode ? true : false );
    };
    
    SlideAnimations.prototype.parseElements = function()
    {
    if( !this.aRootNode )
    return false;
    
    if( !this.aRootNode.parseElement() )
    return false;
    else
    this.bElementsParsed = true;
    };
    
    SlideAnimations.prototype.elementsParsed = function()
    {
    return this.bElementsParsed;
    };
    
    SlideAnimations.prototype.isFirstRun = function()
    {
    return this.aContext.bFirstRun;
    };
    
    SlideAnimations.prototype.isAnimated = function()
    {
    if( !this.bElementsParsed )
    return false;
    
    return this.aRootNode.hasPendingAnimation();
    };
    
    SlideAnimations.prototype.start = function()
    {
    if( !this.bElementsParsed )
    return false;
    
    this.chargeSourceEvents();
    this.chargeInterAnimEvents();
    
    aSlideShow.setSlideEvents( this.aNextEffectEventArray,
    this.aInteractiveAnimationSequenceMap,
    this.aEventMultiplexer );
    
    if( this.aContext.bFirstRun == undefined )
    this.aContext.bFirstRun = true;
    else if( this.aContext.bFirstRun )
    this.aContext.bFirstRun = false;
    
    if( !this.aRootNode.init() )
    return false;
    
    return this.aRootNode.resolve();
    };
    
    SlideAnimations.prototype.end = function( bLeftEffectsSkipped )
    {
    if( !this.bElementsParsed )
    return; // no animations there
    
    this.aRootNode.deactivate();
    this.aRootNode.end();
    
    if( bLeftEffectsSkipped && this.isFirstRun() )
    {
    this.aContext.bFirstRun = undefined;
    }
    else if( this.isFirstRun() )
    {
    this.aContext.bFirstRun = false;
    }
    
    };
    
    SlideAnimations.prototype.dispose = function()
    {
    if( this.aRootNode )
    {
    this.aRootNode.dispose();
    }
    };
    
    SlideAnimations.prototype.clearNextEffectEvents = function()
    {
    ANIMDBG.print( 'SlideAnimations.clearNextEffectEvents: current slide: ' + nCurSlide );
    this.aNextEffectEventArray.clear();
    this.aContext.bFirstRun = undefined;
    };
    
    SlideAnimations.prototype.chargeSourceEvents = function()
    {
    for( var id in this.aSourceEventElementMap )
    {
    this.aSourceEventElementMap[id].charge();
    }
    };
    
    SlideAnimations.prototype.chargeInterAnimEvents = function()
    {
    for( var id in this.aInteractiveAnimationSequenceMap )
    {
    this.aInteractiveAnimationSequenceMap[id].chargeEvents();
    }
    };
    
    
    function Event()
    {
    this.nId = Event.getUniqueId();
    }
    
    
    Event.CURR_UNIQUE_ID = 0;
    
    Event.getUniqueId = function()
    {
    ++Event.CURR_UNIQUE_ID;
    return Event.CURR_UNIQUE_ID;
    };
    
    Event.prototype.getId = function()
    {
    return this.nId;
    };
    
    
    function DelayEvent( aFunctor, nTimeout )
    {
    DelayEvent.superclass.constructor.call( this );
    
    this.aFunctor = aFunctor;
    this.nTimeout = nTimeout;
    this.bWasFired = false;
    }
    extend( DelayEvent, Event );
    
    
    DelayEvent.prototype.fire = function()
    {
    assert( this.isCharged(), 'DelayEvent.fire: assertion isCharged failed' );
    
    this.bWasFired = true;
    this.aFunctor();
    return true;
    };
    
    DelayEvent.prototype.isCharged = function()
    {
    return !this.bWasFired;
    };
    
    DelayEvent.prototype.getActivationTime = function( nCurrentTime )
    {
    return ( this.nTimeout + nCurrentTime );
    };
    
    DelayEvent.prototype.dispose = function()
    {
    if( this.isCharged() )
    this.bWasFired = true;
    };
    
    DelayEvent.prototype.charge = function()
    {
    if( !this.isCharged() )
    this.bWasFired = false;
    };
    
    
    function WakeupEvent( aTimer, aActivityQueue )
    {
    WakeupEvent.superclass.constructor.call( this );
    
    this.aTimer = new ElapsedTime( aTimer );
    this.nNextTime = 0.0;
    this.aActivity = null;
    this.aActivityQueue = aActivityQueue;
    }
    extend( WakeupEvent, Event );
    
    
    WakeupEvent.prototype.clone = function()
    {
    var aWakeupEvent = new WakeupEvent( this.aTimer.getTimeBase(), this.aActivityQueue );
    aWakeupEvent.nNextTime = this.nNextTime;
    aWakeupEvent.aActivity = this.aActivity;
    return aWakeupEvent;
    };
    
    WakeupEvent.prototype.dispose = function()
    {
    this.aActivity = null;
    };
    
    WakeupEvent.prototype.fire = function()
    {
    if( !this.aActivity )
    return false;
    
    return this.aActivityQueue.addActivity( this.aActivity );
    };
    
    WakeupEvent.prototype.isCharged = function()
    {
    return true;
    };
    
    WakeupEvent.prototype.getActivationTime = function( nCurrentTime )
    {
    var nElapsedTime = this.aTimer.getElapsedTime();
    
    return Math.max( nCurrentTime, nCurrentTime - nElapsedTime + this.nNextTime );
    };
    
    WakeupEvent.prototype.start = function()
    {
    this.aTimer.reset();
    };
    
    WakeupEvent.prototype.setNextTimeout = function( nNextTime )
    {
    this.nNextTime = nNextTime;
    };
    
    WakeupEvent.prototype.setActivity = function( aActivity )
    {
    this.aActivity = aActivity;
    };
    
    
    function makeEvent( aFunctor )
    {
    return new DelayEvent( aFunctor, 0.0 );
    }
    
    
    function makeDelay( aFunctor, nTimeout )
    {
    return new DelayEvent( aFunctor, nTimeout );
    }
    
    
    function registerEvent( nNodeId, aTiming, aEvent, aNodeContext )
    {
    var aSlideShowContext = aNodeContext.aContext;
    var eTimingType = aTiming.getType();
    
    registerEvent.DBG( aTiming );
    
    if( eTimingType == OFFSET_TIMING )
    {
    aSlideShowContext.aTimerEventQueue.addEvent( aEvent );
    }
    else if ( aNodeContext.bFirstRun )
    {
    var aEventMultiplexer = aSlideShowContext.aEventMultiplexer;
    if( !aEventMultiplexer )
    {
    log( 'registerEvent: event multiplexer not initialized' );
    return;
    }
    var aNextEffectEventArray = aSlideShowContext.aNextEffectEventArray;
    if( !aNextEffectEventArray )
    {
    log( 'registerEvent: next effect event array not initialized' );
    return;
    }
    var aInteractiveAnimationSequenceMap =
    aSlideShowContext.aInteractiveAnimationSequenceMap;
    if( !aInteractiveAnimationSequenceMap )
    {
    log( 'registerEvent: interactive animation sequence map not initialized' );
    return;
    }
    
    switch( eTimingType )
    {
    case EVENT_TIMING:
    var eEventType = aTiming.getEventType();
    var sEventBaseElemId = aTiming.getEventBaseElementId();
    if( sEventBaseElemId )
    {
    var aEventBaseElem = document.getElementById( sEventBaseElemId );
    if( !aEventBaseElem )
    {
    log( 'generateEvent: EVENT_TIMING: event base element not found: ' + sEventBaseElemId );
    return;
    }
    var aSourceEventElement = aNodeContext.makeSourceEventElement( sEventBaseElemId, aEventBaseElem );
    
    if( !aInteractiveAnimationSequenceMap[ nNodeId ] )
    {
    aInteractiveAnimationSequenceMap[ nNodeId ] = new InteractiveAnimationSequence(nNodeId);
    }
    
    var bEventRegistered = false;
    switch( eEventType )
    {
    case EVENT_TRIGGER_ON_CLICK:
    aEventMultiplexer.registerEvent( eEventType, aSourceEventElement.getId(), aEvent );
    aEventMultiplexer.registerRewindedEffectHandler( aSourceEventElement.getId(),
    bind2( aSourceEventElement.charge, aSourceEventElement ) );
    bEventRegistered = true;
    break;
    default:
    log( 'generateEvent: not handled event type: ' + eEventType );
    }
    if( bEventRegistered )
    {
    var aStartEvent = aInteractiveAnimationSequenceMap[ nNodeId ].getStartEvent();
    var aEndEvent = aInteractiveAnimationSequenceMap[ nNodeId ].getEndEvent();
    aEventMultiplexer.registerEvent( eEventType, aSourceEventElement.getId(), aStartEvent );
    aEventMultiplexer.registerEvent( EVENT_TRIGGER_END_EVENT, nNodeId, aEndEvent );
    aEventMultiplexer.registerRewindedEffectHandler(
    nNodeId,
    bind2( InteractiveAnimationSequence.prototype.chargeEvents,
    aInteractiveAnimationSequenceMap[ nNodeId ] )
    );
    }
    }
    else  // no base event element present
    {
    switch( eEventType )
    {
    case EVENT_TRIGGER_ON_NEXT_EFFECT:
    aNextEffectEventArray.appendEvent( aEvent );
    break;
    default:
    log( 'generateEvent: not handled event type: ' + eEventType );
    }
    }
    break;
    case SYNCBASE_TIMING:
    eEventType = aTiming.getEventType();
    sEventBaseElemId = aTiming.getEventBaseElementId();
    if( sEventBaseElemId )
    {
    var aAnimationNode = aNodeContext.aAnimationNodeMap[ sEventBaseElemId ];
    if( !aAnimationNode )
    {
    log( 'generateEvent: SYNCBASE_TIMING: event base element not found: ' + sEventBaseElemId );
    return;
    }
    aEventMultiplexer.registerEvent( eEventType, aAnimationNode.getId(), aEvent );
    }
    else
    {
    log( 'generateEvent: SYNCBASE_TIMING: event base element not specified' );
    }
    break;
    default:
    log( 'generateEvent: not handled timing type: ' + eTimingType );
    }
    }
    }
    
    registerEvent.DEBUG = aRegisterEventDebugPrinter.isEnabled();
    
    registerEvent.DBG = function( aTiming, nTime )
    {
    if( registerEvent.DEBUG )
    {
    aRegisterEventDebugPrinter.print( 'registerEvent( timing: ' + aTiming.info() + ' )', nTime );
    }
    };
    
    
    function SourceEventElement( sId, aElement, aEventMultiplexer )
    {
    this.sId = sId;
    this.aElement = aElement;
    this.aEventMultiplexer = aEventMultiplexer;
    
    this.aEventMultiplexer.registerMouseClickHandler( this, 1000 );
    
    this.bClickHandled = false;
    this.bIsPointerOver = false;
    this.aElement.addEventListener( 'mouseover', bind2( SourceEventElement.prototype.onMouseEnter, this), false );
    this.aElement.addEventListener( 'mouseout', bind2( SourceEventElement.prototype.onMouseLeave, this), false );
    }
    
    SourceEventElement.prototype.getId = function()
    {
    return this.sId;
    };
    
    SourceEventElement.prototype.onMouseEnter = function()
    {
    this.bIsPointerOver = true;
    this.setPointerCursor();
    };
    
    SourceEventElement.prototype.onMouseLeave = function()
    {
    this.bIsPointerOver = false;
    this.setDefaultCursor();
    };
    
    SourceEventElement.prototype.charge = function()
    {
    this.bClickHandled = false;
    this.setPointerCursor();
    };
    
    SourceEventElement.prototype.handleClick = function( /*aMouseEvent*/ )
    {
    if( !this.bIsPointerOver ) return false;
    
    if( this.bClickHandled )
    return false;
    
    this.aEventMultiplexer.notifyEvent( EVENT_TRIGGER_ON_CLICK, this.getId() );
    aSlideShow.update();
    this.bClickHandled = true;
    this.setDefaultCursor();
    return true;
    };
    
    SourceEventElement.prototype.setPointerCursor = function()
    {
    if( this.bClickHandled )
    return;
    
    this.aElement.setAttribute( 'style', 'cursor: pointer' );
    };
    
    SourceEventElement.prototype.setDefaultCursor = function()
    {
    this.aElement.setAttribute( 'style', 'cursor: default' );
    };
    
    
    function HyperlinkElement( sId, aEventMultiplexer )
    {
    var aElement = document.getElementById( sId );
    if( !aElement )
    {
    log( 'error: HyperlinkElement: no element with id: <' + sId + '> found' );
    return;
    }
    if( !aEventMultiplexer )
    {
    log( 'AnimatedElement constructor: event multiplexer is not valid' );
    }
    
    this.sId = sId;
    this.aElement = aElement;
    this.aEventMultiplexer = aEventMultiplexer;
    this.nTargetSlideIndex = undefined;
    
    this.sURL = getNSAttribute( 'xlink', this.aElement, 'href' );
    if( this.sURL )
    {
    if( this.sURL[0] === '#' )
    {
    if( this.sURL.substr(1, 5) === 'Slide' )
    {
    var sSlideIndex = this.sURL.split( ' ' )[1];
    this.nTargetSlideIndex = parseInt( sSlideIndex ) - 1;
    }
    }
    
    this.aEventMultiplexer.registerElementChangedHandler( this.sId, bind2( HyperlinkElement.prototype.onElementChanged, this) );
    this.aEventMultiplexer.registerMouseClickHandler( this, 1100 );
    
    this.bIsPointerOver = false;
    this.mouseEnterHandler = bind2( HyperlinkElement.prototype.onMouseEnter, this);
    this.mouseLeaveHandler = bind2( HyperlinkElement.prototype.onMouseLeave, this);
    this.aElement.addEventListener( 'mouseover', this.mouseEnterHandler, false );
    this.aElement.addEventListener( 'mouseout', this.mouseLeaveHandler, false );
    }
    else
    {
    log( 'warning: HyperlinkElement(' + this.sId + '): url is empty' );
    }
    }
    
    HyperlinkElement.prototype.onElementChanged = function( aElement )
    {
    if( !aElement )
    {
    log( 'error: HyperlinkElement: passed element is not valid' );
    return;
    }
    
    if( this.sURL )
    {
    this.aElement.removeEventListener( 'mouseover', this.mouseEnterHandler, false );
    this.aElement.removeEventListener( 'mouseout', this.mouseLeaveHandler, false );
    this.aElement = aElement;
    this.aElement.addEventListener( 'mouseover', this.mouseEnterHandler, false );
    this.aElement.addEventListener( 'mouseout', this.mouseLeaveHandler, false );
    }
    };
    
    HyperlinkElement.prototype.onMouseEnter = function()
    {
    this.bIsPointerOver = true;
    this.setPointerCursor();
    };
    
    HyperlinkElement.prototype.onMouseLeave = function()
    {
    this.bIsPointerOver = false;
    this.setDefaultCursor();
    };
    
    HyperlinkElement.prototype.handleClick = function( )
    {
    if( !this.bIsPointerOver ) return false;
    
    if( this.nTargetSlideIndex !== undefined )
    {
    aSlideShow.displaySlide( this.nTargetSlideIndex, true );
    }
    else
    {
    var aWindowObject = document.defaultView;
    if( aWindowObject )
    {
    aWindowObject.open( this.sURL, this.sId );
    }
    else
    {
    log( 'error: HyperlinkElement.handleClick: invalid window object.' );
    }
    }
    
    return true;
    };
    
    HyperlinkElement.prototype.setPointerCursor = function()
    {
    if( this.bClickHandled )
    return;
    
    this.aElement.setAttribute( 'style', 'cursor: pointer' );
    };
    
    HyperlinkElement.prototype.setDefaultCursor = function()
    {
    this.aElement.setAttribute( 'style', 'cursor: default' );
    };
    
    
    function InteractiveAnimationSequence( nId )
    {
    this.nId = nId;
    this.bIsRunning = false;
    this.aStartEvent = null;
    this.aEndEvent = null;
    }
    
    InteractiveAnimationSequence.prototype.getId = function()
    {
    return this.nId;
    };
    
    InteractiveAnimationSequence.prototype.getStartEvent = function()
    {
    if( !this.aStartEvent )
    {
    this.aStartEvent =
    makeEvent( bind2( InteractiveAnimationSequence.prototype.start, this ) );
    }
    return this.aStartEvent;
    };
    
    InteractiveAnimationSequence.prototype.getEndEvent = function()
    {
    if( !this.aEndEvent )
    {
    this.aEndEvent =
    makeEvent( bind2( InteractiveAnimationSequence.prototype.end, this ) );
    }
    return this.aEndEvent;
    };
    
    InteractiveAnimationSequence.prototype.chargeEvents = function()
    {
    if( this.aStartEvent )      this.aStartEvent.charge();
    if( this.aEndEvent )        this.aEndEvent.charge();
    };
    
    InteractiveAnimationSequence.prototype.isRunning = function()
    {
    return this.bIsRunning;
    };
    
    InteractiveAnimationSequence.prototype.start = function()
    {
    aSlideShow.notifyInteractiveAnimationSequenceStart( this.getId() );
    this.bIsRunning = true;
    };
    
    InteractiveAnimationSequence.prototype.end = function()
    {
    aSlideShow.notifyInteractiveAnimationSequenceEnd( this.getId() );
    this.bIsRunning = false;
    };
    
    
    function PriorityEntry( aValue, nPriority )
    {
    this.aValue = aValue;
    this.nPriority = nPriority;
    }
    
    PriorityEntry.compare = function( aLhsEntry, aRhsEntry )
    {
    if ( aLhsEntry.nPriority < aRhsEntry.nPriority )
    {
    return -1;
    }
    else if (aLhsEntry.nPriority > aRhsEntry.nPriority)
    {
    return 1;
    }
    else
    {
    return 0;
    }
    };
    
    
    function EventMultiplexer( aTimerEventQueue )
    {
    this.nId = EventMultiplexer.getUniqueId();
    this.aTimerEventQueue = aTimerEventQueue;
    this.aEventMap = {};
    this.aAnimationsEndHandler = null;
    this.aSkipEffectEndHandlerSet = [];
    this.aMouseClickHandlerSet = new PriorityQueue( PriorityEntry.compare );
    this.aSkipEffectEvent = null;
    this.aRewindCurrentEffectEvent = null;
    this.aRewindLastEffectEvent = null;
    this.aSkipInteractiveEffectEventSet = {};
    this.aRewindRunningInteractiveEffectEventSet = {};
    this.aRewindEndedInteractiveEffectEventSet = {};
    this.aRewindedEffectHandlerSet = {};
    this.aElementChangedHandlerSet = {};
    }
    
    EventMultiplexer.CURR_UNIQUE_ID = 0;
    
    EventMultiplexer.getUniqueId = function()
    {
    ++EventMultiplexer.CURR_UNIQUE_ID;
    return EventMultiplexer.CURR_UNIQUE_ID;
    };
    
    EventMultiplexer.prototype.getId = function()
    {
    return this.nId;
    };
    
    EventMultiplexer.prototype.hasRegisteredMouseClickHandlers = function()
    {
    return !this.aMouseClickHandlerSet.isEmpty();
    };
    
    EventMultiplexer.prototype.registerMouseClickHandler = function( aHandler, nPriority )
    {
    var aHandlerEntry = new PriorityEntry( aHandler, nPriority );
    this.aMouseClickHandlerSet.push( aHandlerEntry );
    };
    
    EventMultiplexer.prototype.notifyMouseClick = function( aMouseEvent )
    {
    var aMouseClickHandlerSet = this.aMouseClickHandlerSet.clone();
    while( !aMouseClickHandlerSet.isEmpty() )
    {
    var aHandlerEntry = aMouseClickHandlerSet.top();
    aMouseClickHandlerSet.pop();
    if( aHandlerEntry.aValue.handleClick( aMouseEvent ) )
    break;
    }
    };
    
    EventMultiplexer.prototype.registerEvent = function( eEventType, aNotifierId, aEvent )
    {
    this.DBG( 'registerEvent', eEventType, aNotifierId );
    if( !this.aEventMap[ eEventType ] )
    {
    this.aEventMap[ eEventType ] = {};
    }
    if( !this.aEventMap[ eEventType ][ aNotifierId ] )
    {
    this.aEventMap[ eEventType ][ aNotifierId ] = [];
    }
    this.aEventMap[ eEventType ][ aNotifierId ].push( aEvent );
    };
    
    
    EventMultiplexer.prototype.notifyEvent = function( eEventType, aNotifierId )
    {
    this.DBG( 'notifyEvent', eEventType, aNotifierId );
    if( this.aEventMap[ eEventType ] )
    {
    if( this.aEventMap[ eEventType ][ aNotifierId ] )
    {
    var aEventArray = this.aEventMap[ eEventType ][ aNotifierId ];
    var nSize = aEventArray.length;
    for( var i = 0; i < nSize; ++i )
    {
    this.aTimerEventQueue.addEvent( aEventArray[i] );
    }
    }
    }
    };
    
    EventMultiplexer.prototype.registerAnimationsEndHandler = function( aHandler )
    {
    this.aAnimationsEndHandler = aHandler;
    };
    
    EventMultiplexer.prototype.notifyAnimationsEndEvent = function()
    {
    if( this.aAnimationsEndHandler )
    this.aAnimationsEndHandler();
    };
    
    EventMultiplexer.prototype.registerNextEffectEndHandler = function( aHandler )
    {
    this.aSkipEffectEndHandlerSet.push( aHandler );
    };
    
    EventMultiplexer.prototype.notifyNextEffectEndEvent = function()
    {
    var nSize = this.aSkipEffectEndHandlerSet.length;
    for( var i = 0; i < nSize; ++i )
    {
    (this.aSkipEffectEndHandlerSet[i])();
    }
    this.aSkipEffectEndHandlerSet = [];
    };
    
    EventMultiplexer.prototype.registerSkipEffectEvent = function( aEvent )
    {
    this.aSkipEffectEvent = aEvent;
    };
    
    EventMultiplexer.prototype.notifySkipEffectEvent = function()
    {
    if( this.aSkipEffectEvent )
    {
    this.aTimerEventQueue.addEvent( this.aSkipEffectEvent );
    this.aSkipEffectEvent = null;
    }
    };
    
    EventMultiplexer.prototype.registerRewindCurrentEffectEvent = function( aEvent )
    {
    this.aRewindCurrentEffectEvent = aEvent;
    };
    
    EventMultiplexer.prototype.notifyRewindCurrentEffectEvent = function()
    {
    if( this.aRewindCurrentEffectEvent )
    {
    this.aTimerEventQueue.addEvent( this.aRewindCurrentEffectEvent );
    this.aRewindCurrentEffectEvent = null;
    }
    };
    
    EventMultiplexer.prototype.registerRewindLastEffectEvent = function( aEvent )
    {
    this.aRewindLastEffectEvent = aEvent;
    };
    
    EventMultiplexer.prototype.notifyRewindLastEffectEvent = function()
    {
    if( this.aRewindLastEffectEvent )
    {
    this.aTimerEventQueue.addEvent( this.aRewindLastEffectEvent );
    this.aRewindLastEffectEvent = null;
    }
    };
    
    EventMultiplexer.prototype.registerSkipInteractiveEffectEvent = function( nNotifierId, aEvent )
    {
    this.aSkipInteractiveEffectEventSet[ nNotifierId ] = aEvent;
    };
    
    EventMultiplexer.prototype.notifySkipInteractiveEffectEvent = function( nNotifierId )
    {
    if( this.aSkipInteractiveEffectEventSet[ nNotifierId ] )
    {
    this.aTimerEventQueue.addEvent( this.aSkipInteractiveEffectEventSet[ nNotifierId ] );
    }
    };
    
    EventMultiplexer.prototype.registerRewindRunningInteractiveEffectEvent = function( nNotifierId, aEvent )
    {
    this.aRewindRunningInteractiveEffectEventSet[ nNotifierId ] = aEvent;
    };
    
    EventMultiplexer.prototype.notifyRewindRunningInteractiveEffectEvent = function( nNotifierId )
    {
    if( this.aRewindRunningInteractiveEffectEventSet[ nNotifierId ] )
    {
    this.aTimerEventQueue.addEvent( this.aRewindRunningInteractiveEffectEventSet[ nNotifierId ] );
    }
    };
    
    EventMultiplexer.prototype.registerRewindEndedInteractiveEffectEvent = function( nNotifierId, aEvent )
    {
    this.aRewindEndedInteractiveEffectEventSet[ nNotifierId ] = aEvent;
    };
    
    EventMultiplexer.prototype.notifyRewindEndedInteractiveEffectEvent = function( nNotifierId )
    {
    if( this.aRewindEndedInteractiveEffectEventSet[ nNotifierId ] )
    {
    this.aTimerEventQueue.addEvent( this.aRewindEndedInteractiveEffectEventSet[ nNotifierId ] );
    }
    };
    
    EventMultiplexer.prototype.registerRewindedEffectHandler = function( aNotifierId, aHandler )
    {
    this.aRewindedEffectHandlerSet[ aNotifierId ] = aHandler;
    };
    
    EventMultiplexer.prototype.notifyRewindedEffectEvent = function( aNotifierId )
    {
    if( this.aRewindedEffectHandlerSet[ aNotifierId ] )
    {
    (this.aRewindedEffectHandlerSet[ aNotifierId ])();
    }
    };
    
    EventMultiplexer.prototype.registerElementChangedHandler = function( aNotifierId, aHandler )
    {
    this.aElementChangedHandlerSet[ aNotifierId ] = aHandler;
    };
    
    EventMultiplexer.prototype.notifyElementChangedEvent = function( aNotifierId, aElement )
    {
    if( this.aElementChangedHandlerSet[ aNotifierId ] )
    {
    (this.aElementChangedHandlerSet[ aNotifierId ])( aElement );
    }
    };
    
    EventMultiplexer.DEBUG = aEventMultiplexerDebugPrinter.isEnabled();
    
    EventMultiplexer.prototype.DBG = function( sMethodName, eEventType, aNotifierId, nTime )
    {
    if( EventMultiplexer.DEBUG )
    {
    var sInfo = 'EventMultiplexer.' + sMethodName;
    sInfo += '( type: ' + aEventTriggerOutMap[ eEventType ];
    sInfo += ', notifier: ' + aNotifierId + ' )';
    aEventMultiplexerDebugPrinter.print( sInfo, nTime );
    }
    };
    
    
    var aInterpolatorHandler = {};
    
    aInterpolatorHandler.getInterpolator = function( eCalcMode, eValueType, eValueSubtype )
    {
    var bHasSubtype = ( typeof( eValueSubtype ) === typeof( 0 ) );
    
    if( !bHasSubtype && aInterpolatorHandler.aLerpFunctorMap[ eCalcMode ][ eValueType ] )
    {
    return aInterpolatorHandler.aLerpFunctorMap[ eCalcMode ][ eValueType ];
    }
    else if( bHasSubtype && aInterpolatorHandler.aLerpFunctorMap[ eCalcMode ][ eValueType ][ eValueSubtype ] )
    {
    return aInterpolatorHandler.aLerpFunctorMap[ eCalcMode ][ eValueType ][ eValueSubtype ];
    }
    else
    {
    log( 'aInterpolatorHandler.getInterpolator: not found any valid interpolator for calc mode '
    + aCalcModeOutMap[eCalcMode]  + ' and value type ' + aValueTypeOutMap[eValueType]  );
    return null;
    }
    };
    
    aInterpolatorHandler.aLerpFunctorMap = [];
    aInterpolatorHandler.aLerpFunctorMap[ CALC_MODE_DISCRETE ] = [];
    aInterpolatorHandler.aLerpFunctorMap[ CALC_MODE_LINEAR ] = [];
    
    
    aInterpolatorHandler.aLerpFunctorMap[ CALC_MODE_LINEAR ][ NUMBER_PROPERTY ] =
    function ( nFrom, nTo, nT )
    {
    return ( ( 1.0 - nT )* nFrom + nT * nTo );
    };
    
    aInterpolatorHandler.aLerpFunctorMap[ CALC_MODE_LINEAR ][ COLOR_PROPERTY ] = [];
    
    aInterpolatorHandler.aLerpFunctorMap[ CALC_MODE_LINEAR ][ COLOR_PROPERTY ][ COLOR_SPACE_RGB ] =
    function ( nFrom, nTo, nT )
    {
    return RGBColor.interpolate( nFrom, nTo, nT );
    };
    
    aInterpolatorHandler.aLerpFunctorMap[ CALC_MODE_LINEAR ][ COLOR_PROPERTY ][ COLOR_SPACE_HSL ] =
    function ( bCCW  )
    {
    return  function ( nFrom, nTo, nT )
    {
    return HSLColor.interpolate( nFrom, nTo, nT, bCCW );
    };
    };
    
    
    function KeyStopLerp( aValueList )
    {
    KeyStopLerp.validateInput( aValueList );
    
    this.aKeyStopList = [];
    this.nLastIndex = 0;
    this.nKeyStopDistance = aValueList[1] - aValueList[0];
    if( this.nKeyStopDistance <= 0 )
    this.nKeyStopDistance = 0.001;
    
    for( var i = 0; i < aValueList.length; ++i )
    this.aKeyStopList.push( aValueList[i] );
    
    this.nUpperBoundIndex = this.aKeyStopList.length - 2;
    }
    
    
    KeyStopLerp.validateInput = function( aValueList )
    {
    var nSize = aValueList.length;
    assert( nSize > 1, 'KeyStopLerp.validateInput: key stop vector must have two entries or more' );
    
    for( var i = 1; i < nSize; ++i )
    {
    if( aValueList[i-1] > aValueList[i] )
    log( 'KeyStopLerp.validateInput: time vector is not sorted in ascending order!' );
    }
    };
    
    KeyStopLerp.prototype.reset = function()
    {
    KeyStopLerp.validateInput( this.aKeyStopList );
    this.nLastIndex = 0;
    this.nKeyStopDistance = this.aKeyStopList[1] - this.aKeyStopList[0];
    if( this.nKeyStopDistance <= 0 )
    this.nKeyStopDistance = 0.001;
    
    };
    
    KeyStopLerp.prototype.lerp = function( nAlpha )
    {
    if( nAlpha > this.aKeyStopList[ this.nLastIndex + 1 ] )
    {
    do
    {
    var nIndex = this.nLastIndex + 1;
    this.nLastIndex = clamp( nIndex, 0, this.nUpperBoundIndex );
    this.nKeyStopDistance = this.aKeyStopList[ this.nLastIndex + 1 ] - this.aKeyStopList[ this.nLastIndex ];
    }
    while( ( this.nKeyStopDistance <= 0 ) && ( this.nLastIndex < this.nUpperBoundIndex ) );
    }
    
    var nRawLerp = ( nAlpha - this.aKeyStopList[ this.nLastIndex ] ) / this.nKeyStopDistance;
    
    nRawLerp = clamp( nRawLerp, 0.0, 1.0 );
    
    var aResult = {};
    aResult.nIndex = this.nLastIndex;
    aResult.nLerp = nRawLerp;
    
    return aResult;
    };
    
    KeyStopLerp.prototype.lerp_ported = function( nAlpha )
    {
    if( ( this.aKeyStopList[ this.nLastIndex ] < nAlpha ) ||
    ( this.aKeyStopList[ this.nLastIndex + 1 ] >= nAlpha ) )
    {
    var i = 0;
    for( ; i < this.aKeyStopList.length; ++i )
    {
    if( this.aKeyStopList[i] >= nAlpha )
    break;
    }
    if( this.aKeyStopList[i] > nAlpha )
    --i;
    var nIndex = i - 1;
    this.nLastIndex = clamp( nIndex, 0, this.aKeyStopList.length - 2 );
    }
    
    var nRawLerp = ( nAlpha - this.aKeyStopList[ this.nLastIndex ] ) /
    ( this.aKeyStopList[ this.nLastIndex+1 ] - this.aKeyStopList[ this.nLastIndex ] );
    
    nRawLerp = clamp( nRawLerp, 0.0, 1.0 );
    
    var aResult = {};
    aResult.nIndex = this.nLastIndex;
    aResult.nLerp = nRawLerp;
    
    return aResult;
    };
    
    
    var aOperatorSetMap = [];
    
    aOperatorSetMap[ NUMBER_PROPERTY ] = {};
    
    aOperatorSetMap[ NUMBER_PROPERTY ].equal = function( a, b )
    {
    return ( a === b );
    };
    
    aOperatorSetMap[ NUMBER_PROPERTY ].add = function( a, b )
    {
    return ( a + b );
    };
    
    aOperatorSetMap[ NUMBER_PROPERTY ].scale = function( k, v )
    {
    return ( k * v );
    };
    
    aOperatorSetMap[ COLOR_PROPERTY ] = {};
    
    aOperatorSetMap[ COLOR_PROPERTY ].equal = function( a, b )
    {
    return a.equal( b );
    };
    
    aOperatorSetMap[ COLOR_PROPERTY ].add = function( a, b )
    {
    var c = a.clone();
    c.add( b );
    return c;
    };
    
    aOperatorSetMap[ COLOR_PROPERTY ].scale = function( k, v )
    {
    var r = v.clone();
    r.scale( k );
    return r;
    };
    
    aOperatorSetMap[ ENUM_PROPERTY ] = {};
    
    aOperatorSetMap[ ENUM_PROPERTY ].equal = function( a, b )
    {
    return ( a === b );
    };
    
    aOperatorSetMap[ ENUM_PROPERTY ].add = function( a )
    {
    return a;
    };
    
    aOperatorSetMap[ ENUM_PROPERTY ].scale = function( k, v )
    {
    return v;
    };
    
    aOperatorSetMap[ STRING_PROPERTY ] = aOperatorSetMap[ ENUM_PROPERTY ];
    
    aOperatorSetMap[ BOOL_PROPERTY ] = aOperatorSetMap[ ENUM_PROPERTY ];
    
    
    function ActivityParamSet()
    {
    this.aEndEvent = null;
    this.aWakeupEvent = null;
    this.aTimerEventQueue = null;
    this.aActivityQueue = null;
    this.nMinDuration = undefined;
    this.nMinNumberOfFrames = MINIMUM_FRAMES_PER_SECONDS;
    this.bAutoReverse = false;
    this.nRepeatCount = 1.0;
    this.nAccelerationFraction = 0.0;
    this.nDecelerationFraction = 0.0;
    this.nSlideWidth = undefined;
    this.nSlideHeight = undefined;
    this.aFormula = null;
    this.aDiscreteTimes = [];
    }
    
    
    function AnimationActivity()
    {
    this.nId = AnimationActivity.getUniqueId();
    }
    
    
    AnimationActivity.CURR_UNIQUE_ID = 0;
    
    AnimationActivity.getUniqueId = function()
    {
    ++AnimationActivity.CURR_UNIQUE_ID;
    return AnimationActivity.CURR_UNIQUE_ID;
    };
    
    AnimationActivity.prototype.getId = function()
    {
    return this.nId;
    };
    
    
    function SetActivity( aCommonParamSet, aAnimation, aToAttr  )
    {
    SetActivity.superclass.constructor.call( this );
    
    this.aAnimation = aAnimation;
    this.aTargetElement = null;
    this.aEndEvent = aCommonParamSet.aEndEvent;
    this.aTimerEventQueue = aCommonParamSet.aTimerEventQueue;
    this.aToAttr = aToAttr;
    this.bIsActive = true;
    }
    extend( SetActivity, AnimationActivity );
    
    
    SetActivity.prototype.activate = function( aEndEvent )
    {
    this.aEndEvent = aEndEvent;
    this.bIsActive = true;
    };
    
    SetActivity.prototype.dispose = function()
    {
    this.bIsActive = false;
    if( this.aEndEvent && this.aEndEvent.isCharged() )
    this.aEndEvent.dispose();
    };
    
    SetActivity.prototype.calcTimeLag = function()
    {
    return 0.0;
    };
    
    SetActivity.prototype.perform = function()
    {
    if( !this.isActive() )
    return false;
    
    this.bIsActive = false;
    
    if( this.aAnimation && this.aTargetElement )
    {
    this.aAnimation.start( this.aTargetElement );
    this.aAnimation.perform( this.aToAttr );
    this.aAnimation.end();
    }
    
    if( this.aEndEvent )
    this.aTimerEventQueue.addEvent( this.aEndEvent );
    
    };
    
    SetActivity.prototype.isActive = function()
    {
    return this.bIsActive;
    };
    
    SetActivity.prototype.dequeued = function()
    {
    };
    
    SetActivity.prototype.end = function()
    {
    this.perform();
    };
    
    SetActivity.prototype.setTargets = function( aTargetElement )
    {
    assert( aTargetElement, 'SetActivity.setTargets: target element is not valid' );
    this.aTargetElement = aTargetElement;
    };
    
    
    function ActivityBase( aCommonParamSet )
    {
    ActivityBase.superclass.constructor.call( this );
    
    this.aTargetElement = null;
    this.aEndEvent = aCommonParamSet.aEndEvent;
    this.aTimerEventQueue = aCommonParamSet.aTimerEventQueue;
    this.nRepeats = aCommonParamSet.nRepeatCount;
    this.nAccelerationFraction = aCommonParamSet.nAccelerationFraction;
    this.nDecelerationFraction = aCommonParamSet.nDecelerationFraction;
    this.bAutoReverse = aCommonParamSet.bAutoReverse;
    
    this.bFirstPerformCall = true;
    this.bIsActive = true;
    
    }
    extend( ActivityBase, AnimationActivity );
    
    
    ActivityBase.prototype.activate = function( aEndEvent )
    {
    this.aEndEvent = aEndEvent;
    this.bFirstPerformCall = true;
    this.bIsActive = true;
    };
    
    ActivityBase.prototype.dispose = function()
    {
    this.bIsActive = false;
    
    if( this.aEndEvent )
    this.aEndEvent.dispose();
    
    this.aEndEvent = null;
    };
    
    ActivityBase.prototype.perform = function()
    {
    if( !this.isActive() )
    return false; // no, early exit.
    
    assert( !this.bFirstPerformCall, 'ActivityBase.perform: assertion (!this.FirstPerformCall) failed' );
    
    return true;
    };
    
    ActivityBase.prototype.calcTimeLag = function()
    {
    if( this.isActive() && this.bFirstPerformCall )
    {
    this.bFirstPerformCall = false;
    
    this.startAnimation();
    }
    return 0.0;
    };
    
    ActivityBase.prototype.isActive = function()
    {
    return this.bIsActive;
    };
    
    ActivityBase.prototype.isDisposed = function()
    {
    return ( !this.bIsActive && !this.aEndEvent );
    };
    
    ActivityBase.prototype.dequeued = function()
    {
    if( !this.isActive() )
    this.endAnimation();
    };
    
    ActivityBase.prototype.setTargets = function( aTargetElement )
    {
    assert( aTargetElement, 'ActivityBase.setTargets: target element is not valid' );
    
    this.aTargetElement = aTargetElement;
    };
    
    ActivityBase.prototype.startAnimation = function()
    {
    throw ( 'ActivityBase.startAnimation: abstract method invoked' );
    };
    
    ActivityBase.prototype.endAnimation = function()
    {
    throw ( 'ActivityBase.endAnimation: abstract method invoked' );
    };
    
    ActivityBase.prototype.endActivity = function()
    {
    this.bIsActive = false;
    
    if( this.aEndEvent )
    this.aTimerEventQueue.addEvent( this.aEndEvent );
    
    this.aEndEvent = null;
    
    };
    
    ActivityBase.prototype.calcAcceleratedTime = function( nT )
    {
    
    
    nT = clamp( nT, 0.0, 1.0 );
    
    if( ( this.nAccelerationFraction > 0.0 || this.nDecelerationFraction > 0.0 ) &&
    ( this.nAccelerationFraction + this.nDecelerationFraction <= 1.0 ) )
    {
    var nC = 1.0 - 0.5*this.nAccelerationFraction - 0.5*this.nDecelerationFraction;
    
    var nTPrime = 0.0;
    
    if( nT < this.nAccelerationFraction )
    {
    nTPrime += 0.5 * nT * nT / this.nAccelerationFraction; // partial first interval
    }
    else
    {
    nTPrime += 0.5 * this.nAccelerationFraction; // full first interval
    
    if( nT <= ( 1.0 - this.nDecelerationFraction ) )
    {
    nTPrime += nT - this.nAccelerationFraction; // partial second interval
    }
    else
    {
    nTPrime += 1.0 - this.nAccelerationFraction - this.nDecelerationFraction; // full second interval
    
    var nTRelative = nT - 1.0 + this.nDecelerationFraction;
    
    nTPrime += nTRelative - 0.5*nTRelative*nTRelative / this.nDecelerationFraction;
    }
    }
    
    nT = nTPrime / nC;
    
    }
    return nT;
    };
    
    ActivityBase.prototype.getEventQueue = function()
    {
    return this.aTimerEventQueue;
    };
    
    ActivityBase.prototype.getTargetElement = function()
    {
    return this.aTargetElement;
    };
    
    ActivityBase.prototype.isRepeatCountValid = function()
    {
    return !!this.nRepeats; // first ! convert to bool
    };
    
    ActivityBase.prototype.getRepeatCount = function()
    {
    return this.nRepeats;
    };
    
    ActivityBase.prototype.isAutoReverse = function()
    {
    return this.bAutoReverse;
    };
    
    ActivityBase.prototype.end = function()
    {
    if( !this.isActive() || this.isDisposed() )
    return;
    
    if( this.bFirstPerformCall )
    {
    this.bFirstPerformCall = false;
    this.startAnimation();
    }
    
    this.performEnd();
    this.endAnimation();
    this.endActivity();
    };
    
    ActivityBase.prototype.performEnd = function()
    {
    throw ( 'ActivityBase.performEnd: abstract method invoked' );
    };
    
    
    function DiscreteActivityBase( aCommonParamSet )
    {
    DiscreteActivityBase.superclass.constructor.call( this, aCommonParamSet );
    
    this.aOriginalWakeupEvent = aCommonParamSet.aWakeupEvent;
    this.aOriginalWakeupEvent.setActivity( this );
    this.aWakeupEvent = this.aOriginalWakeupEvent;
    this.aWakeupEvent = aCommonParamSet.aWakeupEvent;
    this.aDiscreteTimes = aCommonParamSet.aDiscreteTimes;
    this.nMinSimpleDuration = aCommonParamSet.nMinDuration;
    this.nCurrPerformCalls = 0;
    }
    extend( DiscreteActivityBase, ActivityBase );
    
    
    DiscreteActivityBase.prototype.activate = function( aEndElement )
    {
    DiscreteActivityBase.superclass.activate.call( this, aEndElement );
    
    this.aWakeupEvent = this.aOriginalWakeupEvent;
    this.aWakeupEvent.setNextTimeout( 0 );
    this.nCurrPerformCalls = 0;
    };
    
    DiscreteActivityBase.prototype.startAnimation = function()
    {
    this.aWakeupEvent.start();
    };
    
    DiscreteActivityBase.prototype.calcFrameIndex = function( nCurrCalls, nVectorSize )
    {
    if( this.isAutoReverse() )
    {
    var nFrameIndex = nCurrCalls % (2 * nVectorSize);
    
    if( nFrameIndex >= nVectorSize )
    nFrameIndex = 2*nVectorSize - nFrameIndex; // invert sweep
    
    return nFrameIndex;
    }
    else
    {
    return nCurrCalls % nVectorSize;
    }
    };
    
    DiscreteActivityBase.prototype.calcRepeatCount = function( nCurrCalls, nVectorSize )
    {
    if( this.isAutoReverse() )
    {
    return Math.floor( nCurrCalls / (2*nVectorSize) ); // we've got 2 cycles per repeat
    }
    else
    {
    return Math.floor( nCurrCalls / nVectorSize );
    }
    };
    
    DiscreteActivityBase.prototype.performDiscreteHook = function( /*nFrame, nRepeatCount*/ )
    {
    throw ( 'DiscreteActivityBase.performDiscreteHook: abstract method invoked' );
    };
    
    DiscreteActivityBase.prototype.perform = function()
    {
    if( !SimpleContinuousActivityBase.superclass.perform.call( this ) )
    return false; // done, we're ended
    
    var nVectorSize = this.aDiscreteTimes.length;
    
    var nFrameIndex = this.calcFrameIndex(this.nCurrPerformCalls, nVectorSize);
    var nRepeatCount = this.calcRepeatCount( this.nCurrPerformCalls, nVectorSize );
    this.performDiscreteHook( nFrameIndex, nRepeatCount );
    
    ++this.nCurrPerformCalls;
    
    var nCurrRepeat = this.nCurrPerformCalls / nVectorSize;
    
    if( this.isAutoReverse() )
    nCurrRepeat /= 2;
    
    if( !this.isRepeatCountValid() || nCurrRepeat < this.getRepeatCount() )
    {
    
    
    nFrameIndex = this.calcFrameIndex(this.nCurrPerformCalls, nVectorSize);
    var nCurrentRepeatTime = this.aDiscreteTimes[nFrameIndex];
    nRepeatCount = this.calcRepeatCount( this.nCurrPerformCalls, nVectorSize );
    var nNextTimeout = this.nMinSimpleDuration * ( nRepeatCount + this.calcAcceleratedTime( nCurrentRepeatTime ) );
    this.aWakeupEvent.setNextTimeout( nNextTimeout );
    
    this.getEventQueue().addEvent( this.aWakeupEvent );
    }
    else
    {
    this.aWakeupEvent = null;
    
    this.endActivity();
    }
    
    return false; // remove from queue, will be added back by the wakeup event.
    };
    
    DiscreteActivityBase.prototype.dispose = function()
    {
    if( this.aWakeupEvent )
    this.aWakeupEvent.dispose();
    
    this.aWakeupEvent = null;
    
    DiscreteActivityBase.superclass.dispose.call(this);
    };
    
    
    function SimpleContinuousActivityBase( aCommonParamSet )
    {
    SimpleContinuousActivityBase.superclass.constructor.call( this, aCommonParamSet );
    
    this.aTimer = new ElapsedTime( aCommonParamSet.aActivityQueue.getTimer() );
    this.nMinSimpleDuration = aCommonParamSet.nMinDuration;
    this.nMinNumberOfFrames = aCommonParamSet.nMinNumberOfFrames;
    this.nCurrPerformCalls = 0;
    
    }
    extend( SimpleContinuousActivityBase, ActivityBase );
    
    
    SimpleContinuousActivityBase.prototype.startAnimation = function()
    {
    this.aTimer.reset();
    };
    
    SimpleContinuousActivityBase.prototype.calcTimeLag = function()
    {
    SimpleContinuousActivityBase.superclass.calcTimeLag.call( this );
    
    if( !this.isActive() )
    return 0.0;
    
    var nCurrElapsedTime = this.aTimer.getElapsedTime();
    
    
    var nFractionElapsedTime = nCurrElapsedTime / this.nMinSimpleDuration;
    
    var nFractionRequiredCalls = this.nCurrPerformCalls / this.nMinNumberOfFrames;
    
    
    if( nFractionElapsedTime < nFractionRequiredCalls )
    {
    return 0.0;
    }
    else
    {
    return ( ( nFractionElapsedTime - nFractionRequiredCalls ) * this.nMinSimpleDuration );
    }
    };
    
    SimpleContinuousActivityBase.prototype.perform = function()
    {
    if( !SimpleContinuousActivityBase.superclass.perform.call( this ) )
    return false; // done, we're ended
    
    var nCurrElapsedTime = this.aTimer.getElapsedTime();
    var nT = nCurrElapsedTime / this.nMinSimpleDuration;
    
    
    var bActivityEnding = false;
    
    if( this.isRepeatCountValid() )
    {
    
    var nRepeatCount = this.getRepeatCount();
    var nEffectiveRepeat = this.isAutoReverse() ? 2.0 * nRepeatCount : nRepeatCount;
    
    if( nEffectiveRepeat <= nT )
    {
    bActivityEnding = true;
    
    nT = nEffectiveRepeat;
    }
    }
    
    
    var nRepeats;
    var nRelativeSimpleTime;
    if( this.isAutoReverse() )
    {
    nRepeats = Math.floor( nT );
    var nFractionalActiveDuration =  nT - nRepeats;
    
    if( nRepeats % 2 )
    {
    nRelativeSimpleTime = 1.0 - nFractionalActiveDuration;
    }
    else
    {
    nRelativeSimpleTime = nFractionalActiveDuration;
    }
    
    nRepeats /= 2;
    }
    else
    {
    
    nRepeats = Math.floor( nT );
    nRelativeSimpleTime = nT - nRepeats;
    
    if( this.isRepeatCountValid() && ( nRepeats >= this.getRepeatCount() ) )
    {
    
    nRelativeSimpleTime = 1.0;
    nRepeats -= 1.0;
    }
    }
    
    
    this.simplePerform( nRelativeSimpleTime, nRepeats );
    
    if( bActivityEnding )
    this.endActivity();
    
    ++this.nCurrPerformCalls;
    
    return this.isActive();
    };
    
    SimpleContinuousActivityBase.prototype.simplePerform = function( /*nSimpleTime, nRepeatCount*/ )
    {
    throw ( 'SimpleContinuousActivityBase.simplePerform: abstract method invoked' );
    };
    
    
    function ContinuousKeyTimeActivityBase( aCommonParamSet )
    {
    var nSize = aCommonParamSet.aDiscreteTimes.length;
    assert( nSize > 1,
    'ContinuousKeyTimeActivityBase constructor: assertion (aDiscreteTimes.length > 1) failed' );
    
    assert( aCommonParamSet.aDiscreteTimes[0] == 0.0,
    'ContinuousKeyTimeActivityBase constructor: assertion (aDiscreteTimes.front() == 0.0) failed' );
    
    assert( aCommonParamSet.aDiscreteTimes[ nSize - 1 ] <= 1.0,
    'ContinuousKeyTimeActivityBase constructor: assertion (aDiscreteTimes.back() <= 1.0) failed' );
    
    ContinuousKeyTimeActivityBase.superclass.constructor.call( this, aCommonParamSet );
    
    this.aLerper = new KeyStopLerp( aCommonParamSet.aDiscreteTimes );
    }
    extend( ContinuousKeyTimeActivityBase, SimpleContinuousActivityBase );
    
    
    ContinuousKeyTimeActivityBase.prototype.activate = function( aEndElement )
    {
    ContinuousKeyTimeActivityBase.superclass.activate.call( this, aEndElement );
    
    this.aLerper.reset();
    };
    
    ContinuousKeyTimeActivityBase.prototype.performContinuousHook = function( /*nIndex, nFractionalIndex, nRepeatCount*/ )
    {
    throw ( 'ContinuousKeyTimeActivityBase.performContinuousHook: abstract method invoked' );
    };
    
    ContinuousKeyTimeActivityBase.prototype.simplePerform = function( nSimpleTime, nRepeatCount )
    {
    var nAlpha = this.calcAcceleratedTime( nSimpleTime );
    
    var aLerpResult = this.aLerper.lerp( nAlpha );
    
    this.performContinuousHook( aLerpResult.nIndex, aLerpResult.nLerp, nRepeatCount );
    };
    
    
    function ContinuousActivityBase( aCommonParamSet )
    {
    ContinuousActivityBase.superclass.constructor.call( this, aCommonParamSet );
    
    }
    extend( ContinuousActivityBase, SimpleContinuousActivityBase );
    
    
    ContinuousActivityBase.prototype.performContinuousHook = function( /*nModifiedTime, nRepeatCount*/ )
    {
    throw ( 'ContinuousActivityBase.performContinuousHook: abstract method invoked' );
    };
    
    ContinuousActivityBase.prototype.simplePerform = function( nSimpleTime, nRepeatCount )
    {
    this.performContinuousHook( this.calcAcceleratedTime( nSimpleTime ), nRepeatCount );
    };
    
    
    function SimpleActivity( aCommonParamSet, aNumberAnimation, eDirection )
    {
    assert( ( eDirection == BACKWARD ) || ( eDirection == FORWARD ),
    'SimpleActivity constructor: animation direction is not valid' );
    
    assert( aNumberAnimation, 'SimpleActivity constructor: animation object is not valid' );
    
    SimpleActivity.superclass.constructor.call( this, aCommonParamSet );
    
    this.aAnimation = aNumberAnimation;
    this.nDirection = ( eDirection == FORWARD ) ? 1.0 : 0.0;
    }
    extend( SimpleActivity, ContinuousActivityBase );
    
    
    SimpleActivity.prototype.startAnimation = function()
    {
    if( this.isDisposed() || !this.aAnimation )
    return;
    
    ANIMDBG.print( 'SimpleActivity.startAnimation invoked' );
    SimpleActivity.superclass.startAnimation.call( this );
    
    this.aAnimation.start( this.getTargetElement() );
    };
    
    SimpleActivity.prototype.endAnimation = function()
    {
    if( this.aAnimation )
    this.aAnimation.end();
    
    };
    
    SimpleActivity.prototype.performContinuousHook = function( nModifiedTime /*, nRepeatCount*/ )
    {
    
    if( this.isDisposed() || !this.aAnimation )
    return;
    
    var nT = 1.0 - this.nDirection + nModifiedTime * ( 2.0*this.nDirection - 1.0 );
    this.aAnimation.perform( nT );
    };
    
    SimpleActivity.prototype.performEnd = function()
    {
    if( this.aAnimation )
    this.aAnimation.perform( this.nDirection );
    };
    
    
    function FromToByActivityTemplate( BaseType ) // template parameter
    {
    
    function FromToByActivity( aFromValue, aToValue, aByValue,
    aActivityParamSet, aAnimation,
    aInterpolator, aOperatorSet, bAccumulate )
    {
    assert( aAnimation, 'FromToByActivity constructor: invalid animation object' );
    assert( ( aToValue != undefined ) || ( aByValue != undefined ),
    'FromToByActivity constructor: one of aToValue or aByValue must be valid' );
    
    FromToByActivity.superclass.constructor.call( this, aActivityParamSet );
    
    this.aFrom = aFromValue;
    this.aTo = aToValue;
    this.aBy = aByValue;
    this.aStartValue = null;
    this.aEndValue = null;
    this.aPreviousValue = null;
    this.aStartInterpolationValue = null;
    this.aAnimation = aAnimation;
    this.aInterpolator = aInterpolator;
    this.equal = aOperatorSet.equal;
    this.add = aOperatorSet.add;
    this.scale = aOperatorSet.scale;
    this.bDynamicStartValue = false;
    this.nIteration = 0;
    this.bCumulative = bAccumulate;
    this.aFormula = aActivityParamSet.aFormula;
    }
    extend( FromToByActivity, BaseType );
    
    FromToByActivity.prototype.initAnimatedElement = function()
    {
    if( this.aAnimation && this.aFrom )
    {
    var aValue = this.aFormula ? this.aFormula( this.aFrom ) : this.aFrom;
    this.aAnimation.perform(aValue);
    }
    };
    
    FromToByActivity.prototype.startAnimation = function()
    {
    if( this.isDisposed() || !this.aAnimation  )
    {
    log( 'FromToByActivity.startAnimation: activity disposed or not valid animation' );
    return;
    }
    
    FromToByActivity.superclass.startAnimation.call( this );
    
    this.aAnimation.start( this.getTargetElement() );
    
    
    var aAnimationStartValue = this.aAnimation.getUnderlyingValue();
    
    if( this.aFrom )
    {
    if( this.aTo )
    {
    this.aStartValue = this.aFrom;
    this.aEndValue = this.aTo;
    }
    else if( this.aBy )
    {
    this.aStartValue = this.aFrom;
    
    this.aEndValue = this.add( this.aStartValue, this.aBy );
    }
    }
    else
    {
    this.aStartValue = aAnimationStartValue;
    this.aStartInterpolationValue = this.aStartValue;
    
    if( this.aTo )
    {
    
    this.bDynamicStartValue = true;
    this.aPreviousValue = this.aStartValue;
    this.aEndValue = this.aTo;
    }
    else if( this.aBy )
    {
    this.aStartValue = aAnimationStartValue;
    
    this.aEndValue = this.add( this.aStartValue, this.aBy );
    }
    }
    
    ANIMDBG.print( 'FromToByActivity.startAnimation: aStartValue = ' + this.aStartValue + ', aEndValue = ' + this.aEndValue );
    };
    
    FromToByActivity.prototype.endAnimation = function()
    {
    if( this.aAnimation )
    this.aAnimation.end();
    };
    
    FromToByActivity.prototype.performContinuousHook = function( nModifiedTime, nRepeatCount )
    {
    if( this.isDisposed() || !this.aAnimation  )
    {
    log( 'FromToByActivity.performContinuousHook: activity disposed or not valid animation' );
    return;
    }
    
    
    if( this.bDynamicStartValue )
    {
    if( this.nIteration != nRepeatCount )
    {
    this.nIteration = nRepeatCount;
    this.aStartInterpolationValue =  this.aStartValue;
    }
    else
    {
    var aActualValue = this.aAnimation.getUnderlyingValue();
    if( !this.equal( aActualValue, this.aPreviousValue ) )
    this.aStartInterpolationValue = aActualValue;
    }
    }
    
    var aValue = this.aInterpolator( this.aStartInterpolationValue,
    this.aEndValue, nModifiedTime );
    
    if( this.bCumulative && !this.bDynamicStartValue )
    {
    aValue = this.add( this.scale( nRepeatCount, this.aEndValue ), aValue );
    }
    
    aValue = this.aFormula ? this.aFormula( aValue ) : aValue;
    this.aAnimation.perform( aValue );
    
    if( this.bDynamicStartValue )
    {
    this.aPreviousValue = this.aAnimation.getUnderlyingValue();
    }
    
    };
    
    FromToByActivity.prototype.performDiscreteHook = function( /*nFrame, nRepeatCount*/ )
    {
    if (this.isDisposed() || !this.aAnimation) {
    log('FromToByActivity.performDiscreteHook: activity disposed or not valid animation');
    return;
    }
    };
    
    FromToByActivity.prototype.performEnd = function()
    {
    if( this.aAnimation )
    {
    var aValue = this.isAutoReverse() ? this.aStartValue : this.aEndValue;
    aValue = this.aFormula ? this.aFormula( aValue ) : aValue;
    this.aAnimation.perform( aValue );
    }
    };
    
    FromToByActivity.prototype.dispose = function()
    {
    FromToByActivity.superclass.dispose.call( this );
    };
    
    
    return FromToByActivity;
    }
    
    
    var LinearFromToByActivity = instantiate( FromToByActivityTemplate, ContinuousActivityBase );
    var DiscreteFromToByActivity = instantiate( FromToByActivityTemplate, DiscreteActivityBase );
    
    
    function  ValueListActivityTemplate( BaseType ) // template parameter
    {
    
    function ValueListActivity( aValueList, aActivityParamSet,
    aAnimation, aInterpolator,
    aOperatorSet, bAccumulate )
    {
    assert( aAnimation, 'ValueListActivity constructor: invalid animation object' );
    assert( aValueList.length != 0, 'ValueListActivity: value list is empty' );
    
    ValueListActivity.superclass.constructor.call( this, aActivityParamSet );
    
    this.aValueList = aValueList;
    this.aAnimation = aAnimation;
    this.aInterpolator = aInterpolator;
    this.add = aOperatorSet.add;
    this.scale = aOperatorSet.scale;
    this.bCumulative = bAccumulate;
    this.aLastValue = this.aValueList[ this.aValueList.length - 1 ];
    this.aFormula = aActivityParamSet.aFormula;
    }
    extend( ValueListActivity, BaseType );
    
    ValueListActivity.prototype.activate = function( aEndEvent )
    {
    ValueListActivity.superclass.activate.call( this, aEndEvent );
    for( var i = 0; i < this.aValueList.length; ++i )
    {
    ANIMDBG.print( 'createValueListActivity: value[' + i + '] = ' + this.aValueList[i] );
    }
    };
    
    ValueListActivity.prototype.initAnimatedElement = function()
    {
    if( this.aAnimation )
    {
    var aValue = this.aValueList[0];
    aValue = this.aFormula ? this.aFormula( aValue ) : aValue;
    this.aAnimation.perform(aValue);
    }
    };
    
    ValueListActivity.prototype.startAnimation = function()
    {
    if( this.isDisposed() || !this.aAnimation  )
    {
    log( 'ValueListActivity.startAnimation: activity disposed or not valid animation' );
    return;
    }
    
    ValueListActivity.superclass.startAnimation.call( this );
    
    this.aAnimation.start( this.getTargetElement() );
    };
    
    ValueListActivity.prototype.endAnimation = function()
    {
    if( this.aAnimation )
    this.aAnimation.end();
    };
    
    ValueListActivity.prototype.performContinuousHook = function( nIndex, nFractionalIndex, nRepeatCount )
    {
    if( this.isDisposed() || !this.aAnimation  )
    {
    log( 'ValueListActivity.performContinuousHook: activity disposed or not valid animation' );
    return;
    }
    
    assert( ( nIndex + 1 ) < this.aValueList.length,
    'ValueListActivity.performContinuousHook: assertion (nIndex + 1 < this.aValueList.length) failed' );
    
    
    var aValue = this.aInterpolator( this.aValueList[ nIndex ],
    this.aValueList[ nIndex+1 ],
    nFractionalIndex );
    
    if( this.bCumulative )
    {
    aValue = this.add( aValue, this.scale( nRepeatCount, this.aLastValue ) );
    }
    
    aValue = this.aFormula ? this.aFormula( aValue ) : aValue;
    this.aAnimation.perform( aValue );
    };
    
    ValueListActivity.prototype.performDiscreteHook = function( nFrame, nRepeatCount )
    {
    if( this.isDisposed() || !this.aAnimation  )
    {
    log( 'ValueListActivity.performDiscreteHook: activity disposed or not valid animation' );
    return;
    }
    
    assert( nFrame < this.aValueList.length,
    'ValueListActivity.performDiscreteHook: assertion ( nFrame < this.aValueList.length) failed' );
    
    var aValue = this.aValueList[nFrame];
    
    if( this.bCumulative )
    {
    aValue = this.add( aValue, this.scale( nRepeatCount, this.aLastValue ) );
    }
    
    aValue = this.aFormula ? this.aFormula( aValue ) : aValue;
    this.aAnimation.perform( aValue );
    };
    
    ValueListActivity.prototype.performEnd = function()
    {
    if( this.aAnimation )
    {
    var aValue = this.aFormula ? this.aFormula( this.aLastValue ) : this.aLastValue;
    this.aAnimation.perform( aValue );
    }
    };
    
    ValueListActivity.prototype.dispose = function()
    {
    ValueListActivity.superclass.dispose.call( this );
    };
    
    
    return ValueListActivity;
    }
    
    
    var LinearValueListActivity = instantiate( ValueListActivityTemplate, ContinuousKeyTimeActivityBase );
    var DiscreteValueListActivity = instantiate( ValueListActivityTemplate, DiscreteActivityBase );
    
    
    function createActivity( aActivityParamSet, aAnimationNode, aAnimation, aInterpolator )
    {
    var eCalcMode = aAnimationNode.getCalcMode();
    
    var sAttributeName = aAnimationNode.getAttributeName();
    var aAttributeProp = aAttributeMap[ sAttributeName ];
    
    var eValueType = aAttributeProp[ 'type' ];
    var eValueSubtype = aAttributeProp[ 'subtype' ];
    
    if( ! aInterpolator )
    {
    aInterpolator = aInterpolatorHandler.getInterpolator( eCalcMode,
    eValueType,
    eValueSubtype );
    }
    
    var bAccumulate = ( aAnimationNode.getAccumulate() === ACCUMULATE_MODE_SUM )
    && !( eValueType === BOOL_PROPERTY ||
    eValueType === STRING_PROPERTY ||
    eValueType === ENUM_PROPERTY );
    
    if( aAnimationNode.getFormula() )
    {
    var sFormula =  aAnimationNode.getFormula();
    var reMath = /abs|sqrt|asin|acos|atan|sin|cos|tan|exp|log|min|max/g;
    sFormula = sFormula.replace(reMath, 'Math.$&');
    sFormula = sFormula.replace(/pi(?!\w)/g, 'Math.PI');
    sFormula = sFormula.replace(/e(?!\w)/g, 'Math.E');
    sFormula = sFormula.replace(/\$/g, '__PARAM0__');
    
    var aAnimatedElement = aAnimationNode.getAnimatedElement();
    var aBBox = aAnimatedElement.getBaseBBox();
    
    var width = aBBox.width / aActivityParamSet.nSlideWidth;
    var height = aBBox.height / aActivityParamSet.nSlideHeight;
    var x = ( aBBox.x + aBBox.width / 2 ) / aActivityParamSet.nSlideWidth;
    var y = ( aBBox.y + aBBox.height / 2 ) / aActivityParamSet.nSlideHeight;
    
    aActivityParamSet.aFormula = function( __PARAM0__ ) {
    
    return eval(sFormula);
    };
    }
    
    aActivityParamSet.aDiscreteTimes = aAnimationNode.getKeyTimes();
    
    var aValueSet = aAnimationNode.getValues();
    var nValueSetSize = aValueSet.length;
    
    if( nValueSetSize != 0 )
    {
    
    if( aActivityParamSet.aDiscreteTimes.length == 0 )
    {
    for( var i = 0; i < nValueSetSize; ++i )
    aActivityParamSet.aDiscreteTimes[i].push( i / nValueSetSize );
    }
    
    switch( eCalcMode )
    {
    case CALC_MODE_DISCRETE:
    aActivityParamSet.aWakeupEvent =
    new WakeupEvent( aActivityParamSet.aTimerEventQueue.getTimer(),
    aActivityParamSet.aActivityQueue );
    
    return createValueListActivity( aActivityParamSet,
    aAnimationNode,
    aAnimation,
    aInterpolator,
    DiscreteValueListActivity,
    bAccumulate,
    eValueType );
    
    default:
    log( 'createActivity: unexpected calculation mode: ' + eCalcMode );
    case CALC_MODE_PACED :
    case CALC_MODE_SPLINE :
    case CALC_MODE_LINEAR:
    return createValueListActivity( aActivityParamSet,
    aAnimationNode,
    aAnimation,
    aInterpolator,
    LinearValueListActivity,
    bAccumulate,
    eValueType );
    }
    }
    else
    {
    switch( eCalcMode )
    {
    case CALC_MODE_DISCRETE:
    log( 'createActivity: discrete calculation case not yet implemented' );
    aActivityParamSet.aWakeupEvent =
    new WakeupEvent( aActivityParamSet.aTimerEventQueue.getTimer(),
    aActivityParamSet.aActivityQueue );
    return createFromToByActivity(  aActivityParamSet,
    aAnimationNode,
    aAnimation,
    aInterpolator,
    DiscreteFromToByActivity,
    bAccumulate,
    eValueType );
    
    default:
    log( 'createActivity: unexpected calculation mode: ' + eCalcMode );
    case CALC_MODE_PACED :
    case CALC_MODE_SPLINE :
    case CALC_MODE_LINEAR:
    return createFromToByActivity(  aActivityParamSet,
    aAnimationNode,
    aAnimation,
    aInterpolator,
    LinearFromToByActivity,
    bAccumulate,
    eValueType );
    }
    }
    }
    
    
    function createValueListActivity( aActivityParamSet, aAnimationNode, aAnimation,
    aInterpolator, ClassTemplateInstance, bAccumulate, eValueType )
    {
    var aAnimatedElement = aAnimationNode.getAnimatedElement();
    var aOperatorSet = aOperatorSetMap[ eValueType ];
    assert( aOperatorSet, 'createValueListActivity: no operator set found' );
    
    var aValueSet = aAnimationNode.getValues();
    
    var aValueList = [];
    
    extractAttributeValues( eValueType,
    aValueList,
    aValueSet,
    aAnimatedElement.getBaseBBox(),
    aActivityParamSet.nSlideWidth,
    aActivityParamSet.nSlideHeight );
    
    for( var i = 0; i < aValueList.length; ++i )
    {
    ANIMDBG.print( 'createValueListActivity: value[' + i + '] = ' + aValueList[i] );
    }
    
    return new ClassTemplateInstance( aValueList, aActivityParamSet, aAnimation,
    aInterpolator, aOperatorSet, bAccumulate );
    }
    
    
    function createFromToByActivity( aActivityParamSet, aAnimationNode, aAnimation,
    aInterpolator, ClassTemplateInstance, bAccumulate, eValueType )
    {
    
    var aAnimatedElement = aAnimationNode.getAnimatedElement();
    var aOperatorSet = aOperatorSetMap[ eValueType ];
    assert( aOperatorSet, 'createFromToByActivity: no operator set found' );
    
    var aValueSet = [];
    aValueSet[0] = aAnimationNode.getFromValue();
    aValueSet[1] = aAnimationNode.getToValue();
    aValueSet[2] = aAnimationNode.getByValue();
    
    ANIMDBG.print( 'createFromToByActivity: value type: ' + aValueTypeOutMap[eValueType] +
    ', aFrom = ' + aValueSet[0] +
    ', aTo = ' + aValueSet[1] +
    ', aBy = ' + aValueSet[2] );
    
    var aValueList = [];
    
    extractAttributeValues( eValueType,
    aValueList,
    aValueSet,
    aAnimatedElement.getBaseBBox(),
    aActivityParamSet.nSlideWidth,
    aActivityParamSet.nSlideHeight );
    
    ANIMDBG.print( 'createFromToByActivity: ' +
    ', aFrom = ' + aValueList[0] +
    ', aTo = ' + aValueList[1] +
    ', aBy = ' + aValueList[2] );
    
    return new ClassTemplateInstance( aValueList[0], aValueList[1], aValueList[2],
    aActivityParamSet, aAnimation,
    aInterpolator, aOperatorSet, bAccumulate );
    }
    
    
    function extractAttributeValues( eValueType, aValueList, aValueSet, aBBox, nSlideWidth, nSlideHeight )
    {
    var i;
    switch( eValueType )
    {
    case NUMBER_PROPERTY :
    evalValuesAttribute( aValueList, aValueSet, aBBox, nSlideWidth, nSlideHeight );
    break;
    case BOOL_PROPERTY :
    for( i = 0; i < aValueSet.length; ++i )
    {
    var aValue = booleanParser( aValueSet[i] );
    aValueList.push( aValue );
    }
    break;
    case STRING_PROPERTY :
    for( i = 0; i < aValueSet.length; ++i )
    {
    aValueList.push( aValueSet[i] );
    }
    break;
    case ENUM_PROPERTY :
    for( i = 0; i < aValueSet.length; ++i )
    {
    aValueList.push( aValueSet[i] );
    }
    break;
    case COLOR_PROPERTY :
    for( i = 0; i < aValueSet.length; ++i )
    {
    aValue = colorParser( aValueSet[i] );
    aValueList.push( aValue );
    }
    break;
    default:
    log( 'createValueListActivity: unexpected value type: ' + eValueType );
    }
    
    }
    
    
    function evalValuesAttribute( aValueList, aValueSet, aBBox, nSlideWidth, nSlideHeight )
    {
    var width = aBBox.width / nSlideWidth;
    var height = aBBox.height / nSlideHeight;
    var x = ( aBBox.x + aBBox.width / 2 ) / nSlideWidth;
    var y = ( aBBox.y + aBBox.height / 2 ) / nSlideHeight;
    
    var reMath = /abs|sqrt|asin|acos|atan|sin|cos|tan|exp|log|min|max/g;
    
    for( var i = 0; i < aValueSet.length; ++i )
    {
    var sValue = aValueSet[i];
    sValue = sValue.replace(reMath, 'Math.$&');
    sValue = sValue.replace(/pi(?!\w)/g, 'Math.PI');
    sValue = sValue.replace(/e(?!\w)/g, 'Math.E');
    var aValue =  eval( sValue );
    aValueList.push( aValue );
    }
    }
    
    
    var BACKWARD    = 0;
    var FORWARD     = 1;
    
    var MAXIMUM_FRAME_COUNT                 = 60;
    var MINIMUM_TIMEOUT                     = 1.0 / MAXIMUM_FRAME_COUNT;
    var MAXIMUM_TIMEOUT                     = 4.0;
    var MINIMUM_FRAMES_PER_SECONDS          = 10;
    var PREFERRED_FRAMES_PER_SECONDS        = 50;
    var PREFERRED_FRAME_RATE                = 1.0 / PREFERRED_FRAMES_PER_SECONDS;
    
    
    function Effect( nId )
    {
    this.nId = ( typeof( nId ) === typeof( 1 ) ) ? nId : -1;
    this.eState = Effect.NOT_STARTED;
    }
    Effect.NOT_STARTED = 0;
    Effect.PLAYING = 1;
    Effect.ENDED = 2;
    
    Effect.prototype.getId = function()
    {
    return this.nId;
    };
    
    Effect.prototype.isMainEffect = function()
    {
    return ( this.nId === -1 );
    };
    
    Effect.prototype.isPlaying = function()
    {
    return ( this.eState === Effect.PLAYING );
    };
    
    Effect.prototype.isEnded = function()
    {
    return ( this.eState === Effect.ENDED );
    };
    
    Effect.prototype.start = function()
    {
    assert( this.eState === Effect.NOT_STARTED, 'Effect.start: wrong state.' );
    this.eState = Effect.PLAYING;
    };
    
    Effect.prototype.end = function()
    {
    assert( this.eState === Effect.PLAYING, 'Effect.end: wrong state.' );
    this.eState = Effect.ENDED;
    };
    
    
    function SlideShow()
    {
    this.aTimer = new ElapsedTime();
    this.aFrameSynchronization = new FrameSynchronization( PREFERRED_FRAME_RATE );
    this.aTimerEventQueue = new TimerEventQueue( this.aTimer );
    this.aActivityQueue = new ActivityQueue( this.aTimer );
    this.aNextEffectEventArray = null;
    this.aInteractiveAnimationSequenceMap = null;
    this.aEventMultiplexer = null;
    
    this.aContext = new SlideShowContext( this.aTimerEventQueue,
    this.aEventMultiplexer,
    this.aNextEffectEventArray,
    this.aInteractiveAnimationSequenceMap,
    this.aActivityQueue );
    this.bIsIdle = true;
    this.bIsEnabled = true;
    this.bNoSlideTransition = false;
    this.bIsTransitionRunning = false;
    
    this.nCurrentEffect = 0;
    this.bIsNextEffectRunning = false;
    this.bIsRewinding = false;
    this.bIsSkipping = false;
    this.bIsSkippingAll = false;
    this.nTotalInteractivePlayingEffects = 0;
    this.aStartedEffectList = [];
    this.aStartedEffectIndexMap = {};
    this.aStartedEffectIndexMap[ -1 ] = undefined;
    this.automaticAdvanceTimeout = null;
    }
    
    SlideShow.prototype.setSlideEvents = function( aNextEffectEventArray,
    aInteractiveAnimationSequenceMap,
    aEventMultiplexer )
    {
    if( !aNextEffectEventArray )
    log( 'SlideShow.setSlideEvents: aNextEffectEventArray is not valid' );
    
    if( !aInteractiveAnimationSequenceMap )
    log( 'SlideShow.setSlideEvents:aInteractiveAnimationSequenceMap  is not valid' );
    
    if( !aEventMultiplexer )
    log( 'SlideShow.setSlideEvents: aEventMultiplexer is not valid' );
    
    this.aContext.aNextEffectEventArray = aNextEffectEventArray;
    this.aNextEffectEventArray = aNextEffectEventArray;
    this.aContext.aInteractiveAnimationSequenceMap = aInteractiveAnimationSequenceMap;
    this.aInteractiveAnimationSequenceMap = aInteractiveAnimationSequenceMap;
    this.aContext.aEventMultiplexer = aEventMultiplexer;
    this.aEventMultiplexer = aEventMultiplexer;
    this.nCurrentEffect = 0;
    };
    
    SlideShow.prototype.createSlideTransition = function( aSlideTransitionHandler, aLeavingSlide, aEnteringSlide, aTransitionEndEvent )
    {
    if( !aEnteringSlide )
    {
    log( 'SlideShow.createSlideTransition: entering slide element is not valid.' );
    return null;
    }
    
    if( this.bNoSlideTransition ) return null;
    
    var aAnimatedLeavingSlide = null;
    if( aLeavingSlide )
    aAnimatedLeavingSlide = new AnimatedSlide( aLeavingSlide );
    var aAnimatedEnteringSlide = new AnimatedSlide( aEnteringSlide );
    
    var aSlideTransition = aSlideTransitionHandler.createSlideTransition( aAnimatedLeavingSlide, aAnimatedEnteringSlide );
    if( !aSlideTransition ) return null;
    
    var nDuration = 0.001;
    if( aSlideTransitionHandler.getDuration().isValue() )
    {
    nDuration = aSlideTransitionHandler.getDuration().getValue();
    }
    else
    {
    log( 'SlideShow.createSlideTransition: duration is not a number' );
    }
    
    var aCommonParameterSet = new ActivityParamSet();
    aCommonParameterSet.aEndEvent = aTransitionEndEvent;
    aCommonParameterSet.aTimerEventQueue = this.aTimerEventQueue;
    aCommonParameterSet.aActivityQueue = this.aActivityQueue;
    aCommonParameterSet.nMinDuration = nDuration;
    aCommonParameterSet.nMinNumberOfFrames = aSlideTransitionHandler.getMinFrameCount();
    aCommonParameterSet.nSlideWidth = WIDTH;
    aCommonParameterSet.nSlideHeight = HEIGHT;
    
    return new SimpleActivity( aCommonParameterSet, aSlideTransition, FORWARD );
    
    };
    
    SlideShow.prototype.isEnabled = function()
    {
    return this.bIsEnabled;
    };
    
    SlideShow.prototype.isRunning = function()
    {
    return !this.bIsIdle;
    };
    
    SlideShow.prototype.isTransitionPlaying = function()
    {
    return this.bIsTransitionRunning;
    };
    
    SlideShow.prototype.isMainEffectPlaying = function()
    {
    return this.bIsNextEffectRunning;
    };
    
    SlideShow.prototype.isInteractiveEffectPlaying = function()
    {
    return ( this.nTotalInteractivePlayingEffects > 0 );
    };
    
    SlideShow.prototype.isAnyEffectPlaying = function()
    {
    return ( this.isMainEffectPlaying() || this.isInteractiveEffectPlaying() );
    };
    
    SlideShow.prototype.hasAnyEffectStarted = function()
    {
    return ( this.aStartedEffectList.length > 0 );
    };
    
    SlideShow.prototype.notifyNextEffectStart = function()
    {
    assert( !this.bIsNextEffectRunning,
    'SlideShow.notifyNextEffectStart: an effect is already started.' );
    this.bIsNextEffectRunning = true;
    this.aEventMultiplexer.registerNextEffectEndHandler( bind2( SlideShow.prototype.notifyNextEffectEnd, this ) );
    var aEffect = new Effect();
    aEffect.start();
    this.aStartedEffectIndexMap[ -1 ] = this.aStartedEffectList.length;
    this.aStartedEffectList.push( aEffect );
    
    var aAnimatedElementMap = theMetaDoc.aMetaSlideSet[nCurSlide].aSlideAnimationsHandler.aAnimatedElementMap;
    for( var sId in aAnimatedElementMap )
    aAnimatedElementMap[ sId ].notifyNextEffectStart( this.nCurrentEffect );
    };
    
    SlideShow.prototype.notifyNextEffectEnd = function()
    {
    assert( this.bIsNextEffectRunning,
    'SlideShow.notifyNextEffectEnd: effect already ended.' );
    this.bIsNextEffectRunning = false;
    
    this.aStartedEffectList[ this.aStartedEffectIndexMap[ -1 ] ].end();
    if( this.automaticAdvanceTimeout !== null )
    {
    if( this.automaticAdvanceTimeout['rewindedEffect'] === this.nCurrentEffect )
    {
    this.automaticAdvanceTimeout = null;
    this.notifyAnimationsEnd();
    }
    }
    };
    
    SlideShow.prototype.notifyAnimationsEnd = function()
    {
    if( nCurSlide + 1 === theMetaDoc.nNumberOfSlides )
    return;
    
    assert (this.automaticAdvanceTimeout === null,
    'SlideShow.notifyAnimationsEnd: Timeout already set.')
    
    var nTimeout = Math.ceil(theMetaDoc.aMetaSlideSet[nCurSlide].fDuration * 1000);
    if( nTimeout < 0 )
    return;
    
    this.automaticAdvanceTimeout = window.setTimeout('switchSlide(1, false)', nTimeout);
    };
    
    SlideShow.prototype.notifySlideStart = function( nNewSlideIndex, nOldSlideIndex )
    {
    this.nCurrentEffect = 0;
    this.bIsRewinding = false;
    this.bIsSkipping = false;
    this.bIsSkippingAll = false;
    this.nTotalInteractivePlayingEffects = 0;
    this.aStartedEffectList = [];
    this.aStartedEffectIndexMap = {};
    this.aStartedEffectIndexMap[ -1 ] = undefined;
    
    var aAnimatedElementMap;
    var sId;
    if( nOldSlideIndex !== undefined )
    {
    aAnimatedElementMap = theMetaDoc.aMetaSlideSet[nOldSlideIndex].aSlideAnimationsHandler.aAnimatedElementMap;
    for( sId in aAnimatedElementMap )
    aAnimatedElementMap[ sId ].notifySlideEnd();
    }
    
    aAnimatedElementMap = theMetaDoc.aMetaSlideSet[nNewSlideIndex].aSlideAnimationsHandler.aAnimatedElementMap;
    for( sId in aAnimatedElementMap )
    aAnimatedElementMap[ sId ].notifySlideStart( this.aContext );
    };
    
    SlideShow.prototype.notifyTransitionEnd = function( nSlideIndex )
    {
    if( theMetaDoc.getCurrentSlide() )
    {
    var sRef = 'url(#' + aPresentationClipPathId + ')';
    theMetaDoc.getCurrentSlide().slideElement.setAttribute('clip-path', sRef);
    }
    
    this.bIsTransitionRunning = false;
    if( this.bIsRewinding )
    {
    theMetaDoc.aMetaSlideSet[nSlideIndex].hide();
    var nIndex = nCurSlide !== undefined ? nCurSlide : -1;
    this.displaySlide( nIndex, true );
    this.skipAllEffects();
    this.bIsRewinding = false;
    return;
    }
    
    theMetaDoc.setCurrentSlide(nSlideIndex);
    
    if( this.aSlideViewElement )
    {
    theMetaDoc.getCurrentSlide().aVisibilityStatusElement.parentNode.removeChild( this.aSlideViewElement );
    this.aSlideViewElement = null;
    }
    if( this.isEnabled() )
    {
    this.dispose();
    
    var aCurrentSlide = theMetaDoc.getCurrentSlide();
    if( aCurrentSlide.aSlideAnimationsHandler.elementsParsed() )
    {
    aCurrentSlide.aSlideAnimationsHandler.start();
    this.aEventMultiplexer.registerAnimationsEndHandler( bind2( SlideShow.prototype.notifyAnimationsEnd, this ) );
    }
    else
    this.notifyAnimationsEnd();
    
    this.update();
    }
    else
    this.notifyAnimationsEnd();
    };
    
    SlideShow.prototype.notifyInteractiveAnimationSequenceStart = function( nNodeId )
    {
    ++this.nTotalInteractivePlayingEffects;
    var aEffect = new Effect( nNodeId );
    aEffect.start();
    this.aStartedEffectIndexMap[ nNodeId ] = this.aStartedEffectList.length;
    this.aStartedEffectList.push( aEffect );
    };
    
    SlideShow.prototype.notifyInteractiveAnimationSequenceEnd = function( nNodeId )
    {
    assert( this.isInteractiveEffectPlaying(),
    'SlideShow.notifyInteractiveAnimationSequenceEnd: no interactive effect playing.' );
    
    this.aStartedEffectList[ this.aStartedEffectIndexMap[ nNodeId ] ].end();
    --this.nTotalInteractivePlayingEffects;
    };
    
    SlideShow.prototype.nextEffect = function()
    {
    if( !this.isEnabled() )
    return false;
    
    if( this.isTransitionPlaying() )
    {
    this.skipTransition();
    return true;
    }
    
    if( this.isAnyEffectPlaying() )
    {
    this.skipAllPlayingEffects();
    return true;
    }
    
    if( !this.aNextEffectEventArray )
    return false;
    
    if( this.nCurrentEffect >= this.aNextEffectEventArray.size() )
    return false;
    
    this.notifyNextEffectStart();
    
    this.aNextEffectEventArray.at( this.nCurrentEffect ).fire();
    ++this.nCurrentEffect;
    this.update();
    return true;
    };
    
    SlideShow.prototype.skipTransition  = function()
    {
    if( this.bIsSkipping || this.bIsRewinding )
    return;
    
    this.bIsSkipping = true;
    
    this.aActivityQueue.endAll();
    this.aTimerEventQueue.forceEmpty();
    this.aActivityQueue.endAll();
    this.update();
    this.bIsSkipping = false;
    };
    
    SlideShow.prototype.skipAllPlayingEffects  = function()
    {
    if( this.bIsSkipping || this.bIsRewinding )
    return true;
    
    this.bIsSkipping = true;
    for( var i = 0; i < this.aStartedEffectList.length; ++i )
    {
    var aEffect = this.aStartedEffectList[i];
    if( aEffect.isPlaying() )
    {
    if( aEffect.isMainEffect() )
    this.aEventMultiplexer.notifySkipEffectEvent();
    else
    this.aEventMultiplexer.notifySkipInteractiveEffectEvent( aEffect.getId() );
    }
    }
    this.update();
    this.bIsSkipping = false;
    return true;
    };
    
    SlideShow.prototype.skipNextEffect = function()
    {
    if( this.bIsSkipping || this.bIsRewinding )
    return true;
    
    assert( !this.isAnyEffectPlaying(),
    'SlideShow.skipNextEffect' );
    
    if( !this.aNextEffectEventArray )
    return false;
    
    if( this.nCurrentEffect >= this.aNextEffectEventArray.size() )
    return false;
    
    this.notifyNextEffectStart();
    
    this.bIsSkipping = true;
    this.aNextEffectEventArray.at( this.nCurrentEffect ).fire();
    this.aEventMultiplexer.notifySkipEffectEvent();
    ++this.nCurrentEffect;
    this.update();
    this.bIsSkipping = false;
    return true;
    };
    
    SlideShow.prototype.skipPlayingOrNextEffect = function()
    {
    if( this.isTransitionPlaying() )
    {
    this.skipTransition();
    return true;
    }
    
    if( this.isAnyEffectPlaying() )
    return this.skipAllPlayingEffects();
    else
    return this.skipNextEffect();
    };
    
    
    SlideShow.prototype.skipAllEffects = function()
    {
    if( this.bIsSkippingAll )
    return true;
    
    this.bIsSkippingAll = true;
    
    if( this.isTransitionPlaying() )
    {
    this.skipTransition();
    }
    
    if( this.isAnyEffectPlaying() )
    {
    this.skipAllPlayingEffects();
    }
    else if( !this.aNextEffectEventArray
    || ( this.nCurrentEffect >= this.aNextEffectEventArray.size() ) )
    {
    this.bIsSkippingAll = false;
    return false;
    }
    
    while( this.nCurrentEffect < this.aNextEffectEventArray.size() )
    {
    this.skipNextEffect();
    }
    this.bIsSkippingAll = false;
    return true;
    };
    
    SlideShow.prototype.rewindTransition = function()
    {
    if( this.bIsSkipping || this.bIsRewinding )
    return;
    
    this.bIsRewinding = true;
    this.aActivityQueue.endAll();
    this.update();
    this.bIsRewinding = false;
    };
    
    SlideShow.prototype.rewindEffect = function()
    {
    if( this.bIsSkipping || this.bIsRewinding )
    return;
    
    if( this.automaticAdvanceTimeout !== null && !this.automaticAdvanceTimeout['rewindedEffect'] )
    {
    window.clearTimeout( this.automaticAdvanceTimeout );
    this.automaticAdvanceTimeout = { 'rewindedEffect': this.nCurrentEffect };
    }
    
    if( !this.hasAnyEffectStarted() )
    {
    this.rewindToPreviousSlide();
    return;
    }
    
    this.bIsRewinding = true;
    
    var nFirstPlayingEffectIndex = undefined;
    
    var i = 0;
    for( ; i < this.aStartedEffectList.length; ++i )
    {
    var aEffect = this.aStartedEffectList[i];
    if( aEffect.isPlaying() )
    {
    nFirstPlayingEffectIndex = i;
    break;
    }
    }
    
    if( nFirstPlayingEffectIndex !== undefined )
    {
    i = this.aStartedEffectList.length - 1;
    for( ; i >= nFirstPlayingEffectIndex; --i )
    {
    aEffect = this.aStartedEffectList[i];
    if( aEffect.isPlaying() )
    {
    if( aEffect.isMainEffect() )
    {
    this.aEventMultiplexer.notifyRewindCurrentEffectEvent();
    if( this.nCurrentEffect > 0 )
    --this.nCurrentEffect;
    }
    else
    {
    this.aEventMultiplexer.notifyRewindRunningInteractiveEffectEvent( aEffect.getId() );
    }
    }
    else if( aEffect.isEnded() )
    {
    if( aEffect.isMainEffect() )
    {
    this.aEventMultiplexer.notifyRewindLastEffectEvent();
    if( this.nCurrentEffect > 0 )
    --this.nCurrentEffect;
    }
    else
    {
    this.aEventMultiplexer.notifyRewindEndedInteractiveEffectEvent( aEffect.getId() );
    }
    }
    }
    this.update();
    
    i = this.aStartedEffectList.length - 1;
    for( ; i >= nFirstPlayingEffectIndex; --i )
    {
    aEffect = this.aStartedEffectList.pop();
    if( !aEffect.isMainEffect() )
    delete this.aStartedEffectIndexMap[ aEffect.getId() ];
    }
    }
    else  // there is no playing effect
    {
    aEffect = this.aStartedEffectList.pop();
    if( !aEffect.isMainEffect() )
    delete this.aStartedEffectIndexMap[ aEffect.getId() ];
    if( aEffect.isEnded() )  // Well that is almost an assertion.
    {
    if( aEffect.isMainEffect() )
    {
    this.aEventMultiplexer.notifyRewindLastEffectEvent();
    if( this.nCurrentEffect > 0 )
    --this.nCurrentEffect;
    }
    else
    {
    this.aEventMultiplexer.notifyRewindEndedInteractiveEffectEvent( aEffect.getId() );
    }
    }
    this.update();
    }
    
    this.bIsRewinding = false;
    };
    
    SlideShow.prototype.rewindToPreviousSlide = function()
    {
    if( this.isTransitionPlaying() )
    {
    this.rewindTransition();
    return;
    }
    if( this.isAnyEffectPlaying() )
    return;
    var nNewSlide = nCurSlide - 1;
    this.displaySlide( nNewSlide, true );
    this.skipAllEffects();
    };
    
    SlideShow.prototype.rewindAllEffects = function()
    {
    if( !this.hasAnyEffectStarted() )
    {
    this.rewindToPreviousSlide();
    return;
    }
    
    while( this.hasAnyEffectStarted() )
    {
    this.rewindEffect();
    }
    };
    
    SlideShow.prototype.exitSlideShowInApp = function()
    {
    if (window.webkit !== undefined &&
    window.webkit.messageHandlers !== undefined &&
    window.webkit.messageHandlers.lool !== undefined)
    window.webkit.messageHandlers.lool.postMessage('EXITSLIDESHOW', '*');
    }
    
    SlideShow.prototype.displaySlide = function( nNewSlide, bSkipSlideTransition )
    {
    var aMetaDoc = theMetaDoc;
    var nSlides = aMetaDoc.nNumberOfSlides;
    if( nNewSlide < 0 && nSlides > 0 )
    nNewSlide = nSlides - 1;
    else if( nNewSlide >= nSlides ) {
    nNewSlide = 0;
    this.exitSlideShowInApp();
    }
    
    if( ( currentMode === INDEX_MODE ) && ( nNewSlide === nCurSlide ) )
    {
    aMetaDoc.getCurrentSlide().show();
    return;
    }
    
    if( this.isTransitionPlaying() )
    {
    this.skipTransition();
    }
    
    var nOldSlide = nCurSlide;
    if( nOldSlide !== undefined )
    {
    var oldMetaSlide = aMetaDoc.aMetaSlideSet[nOldSlide];
    if( this.isEnabled() )
    {
    if( oldMetaSlide.aSlideAnimationsHandler.isAnimated() )
    {
    oldMetaSlide.aSlideAnimationsHandler.end( bSkipSlideTransition );
    
    this.dispose();
    }
    }
    
    if( this.automaticAdvanceTimeout !== null )
    {
    window.clearTimeout( this.automaticAdvanceTimeout );
    this.automaticAdvanceTimeout = null;
    }
    }
    
    this.notifySlideStart( nNewSlide, nOldSlide );
    
    if( this.isEnabled() && !bSkipSlideTransition  )
    {
    if ( ( ( nOldSlide !== undefined ) &&
    ( ( nNewSlide > nOldSlide ) ||
    ( ( nNewSlide == 0) && ( nOldSlide == (aMetaDoc.nNumberOfSlides - 1) ) ) ) ) ||
    (  ( nOldSlide === undefined ) &&  ( nNewSlide == 0) )  // for transition on first slide
    )
    {
    
    var aOldMetaSlide = null;
    if( nOldSlide === undefined ) // for transition on first slide
    {
    aOldMetaSlide = aMetaDoc.theMetaDummySlide;
    }
    else
    {
    aOldMetaSlide = aMetaDoc.aMetaSlideSet[nOldSlide];
    }
    var aNewMetaSlide = aMetaDoc.aMetaSlideSet[nNewSlide];
    
    var aSlideTransitionHandler = aNewMetaSlide.aTransitionHandler;
    if( aSlideTransitionHandler && aSlideTransitionHandler.isValid() )
    {
    var sRef = 'url(#' + aPresentationClipPathShrinkId + ')';
    aOldMetaSlide.slideElement.setAttribute( 'clip-path', sRef );
    
    if( nOldSlide > nNewSlide )
    {
    this.aSlideViewElement = document.createElementNS( NSS['svg'], 'use' );
    setNSAttribute( 'xlink', this.aSlideViewElement, 'href', '#' + aOldMetaSlide.slideContainerId );
    aNewMetaSlide.aVisibilityStatusElement.parentNode.insertBefore( this.aSlideViewElement, aNewMetaSlide.aVisibilityStatusElement );
    aOldMetaSlide.hide();
    }
    
    var aLeavingSlide = aOldMetaSlide;
    var aEnteringSlide = aNewMetaSlide;
    var aTransitionEndEvent = makeEvent( bind2( this.notifyTransitionEnd, this, nNewSlide ) );
    
    var aTransitionActivity =
    this.createSlideTransition( aSlideTransitionHandler, aLeavingSlide,
    aEnteringSlide, aTransitionEndEvent );
    
    if( aTransitionActivity )
    {
    this.bIsTransitionRunning = true;
    this.aActivityQueue.addActivity( aTransitionActivity );
    this.update();
    }
    else
    {
    this.notifyTransitionEnd( nNewSlide );
    }
    }
    else
    {
    this.notifyTransitionEnd( nNewSlide );
    }
    }
    else
    {
    this.notifyTransitionEnd( nNewSlide );
    }
    }
    else
    {
    this.notifyTransitionEnd( nNewSlide );
    }
    
    };
    
    SlideShow.prototype.update = function()
    {
    this.aTimer.holdTimer();
    
    this.aTimerEventQueue.process();
    this.aActivityQueue.process();
    
    this.aFrameSynchronization.synchronize();
    
    this.aActivityQueue.processDequeued();
    
    this.aTimer.releaseTimer();
    
    var bActivitiesLeft = ( ! this.aActivityQueue.isEmpty() );
    var bTimerEventsLeft = ( ! this.aTimerEventQueue.isEmpty() );
    var bEventsLeft = ( bActivitiesLeft || bTimerEventsLeft );
    
    
    if( bEventsLeft )
    {
    var nNextTimeout;
    if( bActivitiesLeft )
    {
    nNextTimeout = MINIMUM_TIMEOUT;
    this.aFrameSynchronization.activate();
    }
    else
    {
    nNextTimeout = this.aTimerEventQueue.nextTimeout();
    if( nNextTimeout < MINIMUM_TIMEOUT )
    nNextTimeout = MINIMUM_TIMEOUT;
    else if( nNextTimeout > MAXIMUM_TIMEOUT )
    nNextTimeout = MAXIMUM_TIMEOUT;
    this.aFrameSynchronization.deactivate();
    }
    
    this.bIsIdle = false;
    window.setTimeout( 'aSlideShow.update()', nNextTimeout * 1000 );
    }
    else
    {
    this.bIsIdle = true;
    }
    };
    
    SlideShow.prototype.dispose = function()
    {
    this.aTimerEventQueue.clear();
    this.aActivityQueue.clear();
    this.aNextEffectEventArray = null;
    this.aEventMultiplexer = null;
    };
    
    SlideShow.prototype.getContext = function()
    {
    return this.aContext;
    };
    
    var aSlideShow = null;
    
    
    function SlideShowContext( aTimerEventQueue, aEventMultiplexer, aNextEffectEventArray, aInteractiveAnimationSequenceMap, aActivityQueue)
    {
    this.aTimerEventQueue = aTimerEventQueue;
    this.aEventMultiplexer = aEventMultiplexer;
    this.aNextEffectEventArray = aNextEffectEventArray;
    this.aInteractiveAnimationSequenceMap = aInteractiveAnimationSequenceMap;
    this.aActivityQueue = aActivityQueue;
    this.bIsSkipping = false;
    }
    
    
    function FrameSynchronization( nFrameDuration )
    {
    this.nFrameDuration = nFrameDuration;
    this.aTimer = new ElapsedTime();
    this.nNextFrameTargetTime = 0.0;
    this.bIsActive = false;
    
    this.markCurrentFrame();
    }
    
    
    FrameSynchronization.prototype.markCurrentFrame = function()
    {
    this.nNextFrameTargetTime = this.aTimer.getElapsedTime() + this.nFrameDuration;
    };
    
    FrameSynchronization.prototype.synchronize = function()
    {
    if( this.bIsActive )
    {
    while( this.aTimer.getElapsedTime() < this.nNextFrameTargetTime )
    ;
    }
    
    this.markCurrentFrame();
    
    };
    
    FrameSynchronization.prototype.activate = function()
    {
    this.bIsActive = true;
    };
    
    FrameSynchronization.prototype.deactivate = function()
    {
    this.bIsActive = false;
    };
    
    
    function NextEffectEventArray()
    {
    this.aEventArray = [];
    }
    
    
    NextEffectEventArray.prototype.size = function()
    {
    return this.aEventArray.length;
    };
    
    NextEffectEventArray.prototype.at = function( nIndex )
    {
    return this.aEventArray[ nIndex ];
    };
    
    NextEffectEventArray.prototype.appendEvent = function( aEvent )
    {
    var nSize = this.size();
    for( var i = 0; i < nSize; ++i )
    {
    if( this.aEventArray[i].getId() == aEvent.getId() )
    {
    aNextEffectEventArrayDebugPrinter.print( 'NextEffectEventArray.appendEvent: event(' + aEvent.getId() + ') already present' );
    return false;
    }
    }
    this.aEventArray.push( aEvent );
    aNextEffectEventArrayDebugPrinter.print( 'NextEffectEventArray.appendEvent: event(' + aEvent.getId() + ') appended' );
    return true;
    };
    
    NextEffectEventArray.prototype.clear = function( )
    {
    this.aEventArray = [];
    };
    
    
    function TimerEventQueue( aTimer )
    {
    this.aTimer = aTimer;
    this.aEventSet = new PriorityQueue( EventEntry.compare );
    }
    
    
    TimerEventQueue.prototype.addEvent = function( aEvent )
    {
    this.DBG( 'TimerEventQueue.addEvent event(' + aEvent.getId() + ') appended.' );
    if( !aEvent )
    {
    log( 'TimerEventQueue.addEvent: null event' );
    return false;
    }
    
    var nTime = aEvent.getActivationTime( this.aTimer.getElapsedTime() );
    var aEventEntry = new EventEntry( aEvent, nTime );
    this.aEventSet.push( aEventEntry );
    
    return true;
    };
    
    TimerEventQueue.prototype.forceEmpty = function()
    {
    this.process_(true);
    };
    
    
    TimerEventQueue.prototype.process = function()
    {
    this.process_(false);
    };
    
    TimerEventQueue.prototype.process_ = function( bFireAllEvents )
    {
    var nCurrentTime = this.aTimer.getElapsedTime();
    
    while( !this.isEmpty() && ( bFireAllEvents || ( this.aEventSet.top().nActivationTime <= nCurrentTime ) ) )
    {
    var aEventEntry = this.aEventSet.top();
    this.aEventSet.pop();
    
    var aEvent = aEventEntry.aEvent;
    if( aEvent.isCharged() )
    aEvent.fire();
    }
    };
    
    TimerEventQueue.prototype.isEmpty = function()
    {
    return this.aEventSet.isEmpty();
    };
    
    TimerEventQueue.prototype.nextTimeout = function()
    {
    var nTimeout = Number.MAX_VALUE;
    var nCurrentTime = this.aTimer.getElapsedTime();
    if( !this.isEmpty() )
    nTimeout = this.aEventSet.top().nActivationTime - nCurrentTime;
    return nTimeout;
    };
    
    TimerEventQueue.prototype.clear = function()
    {
    this.DBG( 'TimerEventQueue.clear invoked' );
    this.aEventSet.clear();
    };
    
    TimerEventQueue.prototype.getTimer = function()
    {
    return this.aTimer;
    };
    
    TimerEventQueue.prototype.DBG = function( sMessage, nTime )
    {
    aTimerEventQueueDebugPrinter.print( sMessage, nTime );
    };
    
    
    TimerEventQueue.prototype.insert = function( aEventEntry )
    {
    var nHoleIndex = this.aEventSet.length;
    var nParent = Math.floor( ( nHoleIndex - 1 ) / 2 );
    
    while( ( nHoleIndex > 0 ) && this.aEventSet[ nParent ].compare( aEventEntry ) )
    {
    this.aEventSet[ nHoleIndex ] = this.aEventSet[ nParent ];
    nHoleIndex = nParent;
    nParent = Math.floor( ( nHoleIndex - 1 ) / 2 );
    }
    this.aEventSet[ nHoleIndex ] = aEventEntry;
    };
    
    
    function EventEntry( aEvent, nTime )
    {
    this.aEvent = aEvent;
    this.nActivationTime = nTime;
    }
    
    
    EventEntry.compare = function( aLhsEventEntry, aRhsEventEntry )
    {
    if ( aLhsEventEntry.nActivationTime > aRhsEventEntry.nActivationTime )
    {
    return -1;
    }
    else if ( aLhsEventEntry.nActivationTime < aRhsEventEntry.nActivationTime )
    {
    return 1;
    }
    else
    {
    return 0;
    }
    };
    
    
    function ActivityQueue( aTimer )
    {
    this.aTimer = aTimer;
    this.aCurrentActivityWaitingSet = [];
    this.aCurrentActivityReinsertSet = [];
    this.aDequeuedActivitySet = [];
    }
    
    
    ActivityQueue.prototype.dispose = function()
    {
    var nSize = this.aCurrentActivityWaitingSet.length;
    var i;
    for( i = 0; i < nSize; ++i )
    this.aCurrentActivityWaitingSet[i].dispose();
    
    nSize = this.aCurrentActivityReinsertSet.length;
    for( i = 0; i < nSize; ++i )
    this.aCurrentActivityReinsertSet[i].dispose();
    };
    
    ActivityQueue.prototype.addActivity = function( aActivity )
    {
    if( !aActivity )
    {
    log( 'ActivityQueue.addActivity: activity is not valid' );
    return false;
    }
    
    this.aCurrentActivityWaitingSet.push( aActivity );
    aActivityQueueDebugPrinter.print( 'ActivityQueue.addActivity: activity appended' );
    return true;
    };
    
    ActivityQueue.prototype.process = function()
    {
    var nSize = this.aCurrentActivityWaitingSet.length;
    var nLag = 0.0;
    for( var i = 0; i < nSize; ++i )
    {
    nLag = Math.max( nLag,this.aCurrentActivityWaitingSet[i].calcTimeLag()  );
    }
    
    if( nLag > 0.0 )
    this.aTimer.adjustTimer( -nLag, true );
    
    
    while( this.aCurrentActivityWaitingSet.length != 0 )
    {
    var aActivity = this.aCurrentActivityWaitingSet.shift();
    var bReinsert = false;
    
    bReinsert = aActivity.perform();
    
    if( bReinsert )
    {
    this.aCurrentActivityReinsertSet.push( aActivity );
    }
    else
    {
    this.aDequeuedActivitySet.push( aActivity );
    }
    }
    
    if( this.aCurrentActivityReinsertSet.length != 0 )
    {
    this.aCurrentActivityWaitingSet = this.aCurrentActivityReinsertSet;
    this.aCurrentActivityReinsertSet = [];
    }
    };
    
    ActivityQueue.prototype.processDequeued = function()
    {
    var nSize = this.aDequeuedActivitySet.length;
    for( var i = 0; i < nSize; ++i )
    this.aDequeuedActivitySet[i].dequeued();
    
    this.aDequeuedActivitySet = [];
    };
    
    ActivityQueue.prototype.isEmpty = function()
    {
    return ( ( this.aCurrentActivityWaitingSet.length == 0 ) &&
    ( this.aCurrentActivityReinsertSet.length == 0 ) );
    };
    
    ActivityQueue.prototype.clear = function()
    {
    aActivityQueueDebugPrinter.print( 'ActivityQueue.clear invoked' );
    var nSize = this.aCurrentActivityWaitingSet.length;
    var i;
    for( i = 0; i < nSize; ++i )
    this.aCurrentActivityWaitingSet[i].dequeued();
    this.aCurrentActivityWaitingSet = [];
    
    nSize = this.aCurrentActivityReinsertSet.length;
    for( i = 0; i < nSize; ++i )
    this.aCurrentActivityReinsertSet[i].dequeued();
    this.aCurrentActivityReinsertSet = [];
    };
    
    ActivityQueue.prototype.endAll = function()
    {
    aActivityQueueDebugPrinter.print( 'ActivityQueue.endAll invoked' );
    var nSize = this.aCurrentActivityWaitingSet.length;
    var i;
    for( i = 0; i < nSize; ++i )
    this.aCurrentActivityWaitingSet[i].end();
    this.aCurrentActivityWaitingSet = [];
    
    nSize = this.aCurrentActivityReinsertSet.length;
    for( i = 0; i < nSize; ++i )
    this.aCurrentActivityReinsertSet[i].end();
    this.aCurrentActivityReinsertSet = [];
    };
    
    ActivityQueue.prototype.getTimer = function()
    {
    return this.aTimer;
    };
    
    ActivityQueue.prototype.size = function()
    {
    return ( this.aCurrentActivityWaitingSet.length +
    this.aCurrentActivityReinsertSet.length +
    this.aDequeuedActivitySet.length );
    };
    
    
    function ElapsedTime( aTimeBase )
    {
    this.aTimeBase = aTimeBase;
    this.nLastQueriedTime = 0.0;
    this.nStartTime = this.getCurrentTime();
    this.nFrozenTime = 0.0;
    this.bInPauseMode = false;
    this.bInHoldMode = false;
    }
    
    
    ElapsedTime.prototype.getTimeBase = function()
    {
    return this.aTimeBase;
    };
    
    ElapsedTime.prototype.reset = function()
    {
    this.nLastQueriedTime = 0.0;
    this.nStartTime = this.getCurrentTime();
    this.nFrozenTime = 0.0;
    this.bInPauseMode = false;
    this.bInHoldMode = false;
    };
    
    ElapsedTime.prototype.getElapsedTime = function()
    {
    this.nLastQueriedTime = this.getElapsedTimeImpl();
    return this.nLastQueriedTime;
    };
    
    ElapsedTime.prototype.pauseTimer = function()
    {
    this.nFrozenTime = this.getElapsedTimeImpl();
    this.bInPauseMode = true;
    };
    
    ElapsedTime.prototype.continueTimer = function()
    {
    this.bInPauseMode = false;
    
    var nPauseDuration = this.getElapsedTimeImpl() - this.nFrozenTime;
    
    this.nStartTime += nPauseDuration;
    };
    
    ElapsedTime.prototype.adjustTimer = function( nOffset, bLimitToLastQueriedTime )
    {
    if( bLimitToLastQueriedTime == undefined )
    bLimitToLastQueriedTime = true;
    
    this.nStartTime -= nOffset;
    
    if( this.bInHoldMode || this.bInPauseMode )
    this.nFrozenTime += nOffset;
    };
    
    ElapsedTime.prototype.holdTimer = function()
    {
    this.nFrozenTime = this.getElapsedTimeImpl();
    this.bInHoldMode = true;
    };
    
    ElapsedTime.prototype.releaseTimer = function()
    {
    this.bInHoldMode = false;
    };
    
    ElapsedTime.prototype.getSystemTime = function()
    {
    return ( getCurrentSystemTime() / 1000.0 );
    };
    
    ElapsedTime.prototype.getCurrentTime = function()
    {
    var nCurrentTime;
    if ( !this.aTimeBase )
    {
    nCurrentTime = this.getSystemTime();
    }
    else
    {
    nCurrentTime = this.aTimeBase.getElapsedTimeImpl();
    }
    
    assert( ( typeof( nCurrentTime ) === typeof( 0 ) ) && isFinite( nCurrentTime ),
    'ElapsedTime.getCurrentTime: assertion failed: nCurrentTime == ' + nCurrentTime );
    
    
    return nCurrentTime;
    };
    
    ElapsedTime.prototype.getElapsedTimeImpl = function()
    {
    if( this.bInHoldMode || this.bInPauseMode )
    {
    return this.nFrozenTime;
    }
    
    var nCurTime = this.getCurrentTime();
    return ( nCurTime - this.nStartTime );
    };
    
    
    /*****
    * @libreofficeend
    *
    * Several parts of the above code are the result of the porting,
    * started on August 2011, of the C++ code included in the source files
    * placed under the folder '/slideshow/source' and subfolders.
    * @source https://cgit.freedesktop.org/libreoffice/core/tree/slideshow/source
    *
    */