  /*--------------------------- SELECTOR: NWMATCHER --------------------------*/

  (function(Selector) {
    var NWMatcher;

    Selector.match = function match(element, selector) {
      function match(element, selector) {
        return NWMatcher.match(element, String(selector || ''));
      }

      NWMatcher = NW.Dom;
      return (Selector.match = match)(element, selector);
    };

    Selector.select = function select(selector, context) {
      var select = function select(selector, context) {
        return NWMatcher.select(String(selector || ''), context || Fuse._doc, Fuse.List())
          .map(Element.extend);
      };

      if (Feature('ELEMENT_EXTENSIONS'))
        select = function select(selector, context) {
          return NWMatcher.select(String(selector || ''), context || Fuse._doc, Fuse.List());
        };

      NWMatcher = NW.Dom;
      return (Selector.select = select)(selector, context);
    };

    // prevent JScript bug with named function expressions
    var match = null, select = null;
  })(Fuse.Dom.Selector);
