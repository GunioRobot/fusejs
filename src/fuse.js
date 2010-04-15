<%= include 'HEADER' %>
(function(global) {

  // private vars
  var DATA_ID_PROP, DOCUMENT_FRAGMENT_NODE, DOCUMENT_NODE, ELEMENT_NODE, TEXT_NODE,
   Class, Document, Element, Enumerable, Event, Form, Func, Obj, Node, NodeList,
   Window, $break, _extend, fuse, addArrayMethods, addNodeListMethod, bind, clone,
   concatList, defer, domData, eachKey, emptyFunction, envAddTest, envTest,
   escapeRegExpChars, expando, fromElement, getDocument, getNodeName, getWindow,
   getOrCreateTagClass, hasKey, inspect, isArray, isElement, isEmpty, isHash,
   isHostObject, isFunction, isNumber, isPrimitive, isRegExp, isSameOrigin,
   isString, isUndefined, K, nil, prependList, returnOffset, setTimeout, slice,
   toInteger, toString, undef, userAgent;

  fuse =
  global.fuse = function fuse() { };

  fuse._body  =
  fuse._div   =
  fuse._doc   =
  fuse._docEl =
  fuse._info  =
  fuse._root  =
  fuse._scrollEl = null;

  fuse.debug   = false;
  fuse.version = '<%= FUSEJS_VERSION %>';

  /*--------------------------------------------------------------------------*/

  // Host objects can return type values that are different from their actual data type.
  // The objects we are concerned with are usally of types object, function, or unknown.
  // For example:
  // typeof document.createElement('div').offsetParent -> unknown
  // typeof document.createElement -> object
  // typeof Image.create -> string
  isHostObject = (function() {
    var NON_HOST_TYPES = { 'boolean': 1, 'number': 1, 'string': 1, 'undefined': 1 };
    return function(object, property) {
      var type = typeof object[property];
      return type === 'object' ? !!object[property] : !NON_HOST_TYPES[type];
    };
  })();

  $break =
  fuse.$break = function $break() { };

  addArrayMethods =
  addNodeListMethod =
  emptyFunction =
  fuse.emptyFunction = function emptyFunction() { };

  K =
  fuse.K = function K(x) { return x };

  concatList = function(list, otherList) {
    var pad = list.length, length = otherList.length;
    while (length--) list[pad + length] = otherList[length];
    return list;
  };

  // Allow a pre-sugared array to be passed
  prependList = function(list, value, results) {
    (results || (results = []))[0] = value;
    var length = list.length;
    while (length--) results[1 + length] = list[length];
    return results;
  };

  escapeRegExpChars = (function() {
    var reSpecialChars = /([.*+?^=!:${}()|[\]\/\\])/g;
    return function(string) {
      return String(string).replace(reSpecialChars, '\\$1');
    };
  })();

  // ECMA-5 9.4 ToInteger implementation
  toInteger = function(object) {
    // fast coerce to number
    var number = +object;
    // avoid issues with numbers larger than
    // Math.pow(2, 31) against bitwise operators
    return number == 0 || !isFinite(number)
      ? number || 0
      : Math.abs(number) < 2147483648 ? number | 0 : number - (number % 1);
  };

  // global.document.createDocumentFragment() nodeType
  DOCUMENT_FRAGMENT_NODE = 11;

  // global.document node type
  DOCUMENT_NODE = 9;

  // element node type
  ELEMENT_NODE = 1;

  // textNode type
  TEXT_NODE = 3;

  // a unqiue 15 char id used throughout fuse
  expando = '_fuse' + String(+new Date).slice(0, 10);

  // helps minify nullifying the JScript function declarations
  nil = null;

  // a quick way to copy an array slice.call(array, 0)
  slice = [].slice;

  // shortcut
  setTimeout = global.setTimeout;

  // used to access the an object's internal [[Class]] property
  toString = {}.toString;

  // used for some required browser sniffing
  userAgent = global.navigator && navigator.userAgent || '';

  /*--------------------------------------------------------------------------*/

  (function() {

    var getNS = function getNS(path) {
      var key, i = -1, keys = path.split('.'), object = this;
      while (key = keys[++i])
        if (!(object = object[key])) return false;
      return object;
    },

    addNS = function addNS(path) {
      var Klass, key, i = -1,
       object = this,
       keys   = path.split('.'),
       length = keys.length;

      while (key = keys[++i]) {
        if (!object[key]) {
          Klass = Class(object, { 'constructor': key });
          object = object[key] = new Klass;
        }
        else object = object[key];
      }
      return object;
    },

    updateSubClassGenerics = function(object) {
      var subclass, subclasses = object.subclasses || [], i = -1;
      while (subclass = subclasses[++i]) {
        subclass.updateGenerics && subclass.updateGenerics();
        updateSubClassGenerics(subclass);
      }
    },

    updateGenerics = function updateGenerics(path, deep) {
      var paths, object, i = -1;
      if (isString(paths)) paths = [paths];
      if (!isArray(paths)) deep  = path;
      if (!paths) paths = ['Array', 'Date', 'Number', 'Object', 'RegExp', 'String', 'dom.Node']; 

      while (path = paths[++i]) {
        object = isString(path) ? fuse.getNS(path) : path;
        if (object) {
          object.updateGenerics && object.updateGenerics();
          deep && updateSubClassGenerics(object);
        }
      }
    };

    fuse.getNS =
    fuse.prototype.getNS = getNS;

    fuse.addNS = 
    fuse.prototype.addNS = addNS;

    fuse.updateGenerics  = updateGenerics;
  })();

<%= include(
   'env.js',
   'lang/features.js',
   'lang/fusebox.js',

   'lang/object.js',
   'lang/class.js',
   'lang/console.js',

   'lang/function.js',
   'lang/enumerable.js',
   'lang/array.js',
   'lang/number.js',
   'lang/regexp.js',
   'lang/string.js',

   'lang/hash.js',
   'lang/range.js',
   'lang/template.js',
   'lang/timer.js',

   'dom/dom.js',
   'dom/features.js',
   'dom/node.js',
   'dom/document.js',
   'dom/window.js',

   'dom/element/element.js',
   'dom/element/create.js',
   'dom/element/modification.js',
   'dom/element/attribute.js',
   'dom/element/style.js',
   'dom/element/position.js',

   'dom/form/field.js',
   'dom/form/form.js',
   'dom/form/event-observer.js',
   'dom/form/timed-observer.js',

   'dom/event/event.js',
   'dom/event/dom-loaded.js',

   'lang/grep.js',
   'lang/inspect.js',
   'lang/json.js',

   'dom/element/traversal.js',
   'dom/node-list.js',
   'dom/selector/selector.js',
   'dom/selector/nwmatcher.js',

   'ajax/ajax.js',
   'ajax/responders.js',
   'ajax/base.js',
   'ajax/request.js',
   'ajax/updater.js',
   'ajax/timed-updater.js') %>
  /*--------------------------------------------------------------------------*/

  // update native generics and element methods
  fuse.updateGenerics(true);
})(this);
