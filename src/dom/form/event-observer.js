  /*-------------------------- FORM: EVENT OBSERVER --------------------------*/

  (function() {
    var BaseEventObserver = Class(function() {
      function BaseEventObserver(element, callback) {
        var member, name, i = -1, 
         eventObserver = this, onElementEvent = this.onElementEvent;

        this.element = fuse.get(element);
        element = element.raw || element;

        this.onElementEvent = function() {
          onElementEvent.call(eventObserver);
        };

        if (getNodeName(element) === 'FORM') {
          return this.registerFormCallbacks();
        }

        name = element.name;
        this.group =
          (name && fuse.query(element.nodeName +
          '[name="' + name + '"]', getDocument(element)).get()) ||
          NodeList(fuse.get(element));

        this.callback = callback;
        this.lastValue = this.getValue();

        while (member = this.group[++i]) {
          this.registerCallback(member);
        }
      }

      return {'constructor': BaseEventObserver };
    });

    (function(plugin) {
      var CHECKED_INPUT_TYPES = { 'checkbox': 1, 'radio': 1 };

      plugin.onElementEvent = function onElementEvent() {
        var value = this.getValue();
        if (this.lastValue === value) return;
        this.callback(this.element, value);
        this.lastValue = value;
      };

      plugin.registerCallback = function registerCallback(element) {
        var type, decorator = fuse.get(element);
        element = decorator.raw || decorator;
        if (type = element.type) {
          decorator.observe(CHECKED_INPUT_TYPES[type] ? 'click' : 'change',
            this.onElementEvent);
        }
      };

      plugin.registerFormCallbacks = function registerFormCallbacks() {
        var element, elements = this.element.getControls(), i= 0;
        while (element = elements[i++]) this.registerCallback(element);
      };

      // prevent JScript bug with named function expressions
      var onElementEvent = nil, registerCallback = nil, registerFormCallbacks = nil;
    })(BaseEventObserver.plugin);

    /*------------------------------------------------------------------------*/

    var CHECKED_INPUT_TYPES = { 'checkbox': 1, 'radio': 1 },

    Field = fuse.dom.InputElement,

    getValue = nil;


    Field.EventObserver = (function() {
      var Klass = function() { },

      FieldEventObserver = function FieldEventObserver(element, callback) {
        return BaseEventObserver.call(new Klass, element, callback);
      };

      Class(BaseEventObserver, { 'constructor': FieldEventObserver });
      Klass.prototype = FieldEventObserver.plugin;
      return FieldEventObserver;
    })();

    Field.EventObserver.plugin.getValue = function getValue() {
      var element, member, value, i = -1;
      if (this.group.length === 1) {
        return this.element.getValue();
      }
      while (member = this.group[++i]) {
        element = member.raw || member;
        if (CHECKED_INPUT_TYPES[element.type]) {
          if (element.checked) {
            return member.getValue();
          }
        } else if (value = member.getValue()) {
          return value;
        }
      }
    };

    Form.EventObserver = (function() {
      var Klass = function() { },

      FormEventObserver = function FormEventObserver(element, callback) {
        return BaseEventObserver.call(new Klass, element, callback);
      };

      Class(BaseEventObserver, { 'constructor': FormEventObserver });
      Klass.prototype = FormEventObserver.plugin;
      return FormEventObserver;
    })();

    Form.plugin.getValue = function getValue() {
      return this.element.serialize();
    };
  })();
