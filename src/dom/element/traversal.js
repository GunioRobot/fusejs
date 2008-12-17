  /*--------------------------- ELEMENT: TRAVERSAL ---------------------------*/

  Object.extend(Element.Methods, (function() {
    function adjacent(element) {
      element = $(element);
      var args = slice.call(arguments, 1),
       parent = Element.extend(element.parentNode),
       oldId = parent.id, newId = parent.identify();

      // ensure match against siblings and not children of siblings
      args = args.map(function(a) { return '#' + newId + '>' + a });
      var matches = Selector.matchElements(parent.childNodes, args).without(element);
      parent.id = oldId;
      return matches;
    }

    function ancestors(element) {
      return Element.recursivelyCollect(element, 'parentNode');
    }

    function descendants(element) {
      return Element.select(element, '*');
    }

    function firstDescendant(element) {
      element = $(element).firstChild;
      while (element && element.nodeType !== 1) element = element.nextSibling;
      return Element.extend(element);
    }

    function immediateDescendants(element) {
      if (!(element = $(element).firstChild)) return [];
      while (element && element.nodeType !== 1) element = element.nextSibling;
      if (element) return prependList(Element.nextSiblings(element), element);
      return [];
    }

    function next(element, expression, index) {
      if (arguments.length === 1) return Element.extend(Selector.handlers.nextElementSibling(element));
      var nextSiblings = Element.nextSiblings(element);
      return typeof expression === 'number' ? nextSiblings[expression] :
        Selector.findElement(nextSiblings, expression, index);
    }

    function previous(element, expression, index) {
      if (arguments.length == 1) return Element.extend(Selector.handlers.previousElementSibling(element));
      var previousSiblings = Element.previousSiblings(element);
      return typeof expression === 'number' ? previousSiblings[expression] :
        Selector.findElement(previousSiblings, expression, index);   
    }

    function nextSiblings(element) {
      return Element.recursivelyCollect(element, 'nextSibling');
    }

    function previousSiblings(element) {
      return Element.recursivelyCollect(element, 'previousSibling');
    }

    function recursivelyCollect(element, property) {
      element = $(element);
      var elements = [];
      while (element = element[property])
        if (element.nodeType === 1)
          elements.push(Element.extend(element));
      return elements;
    }

    function siblings(element) {
      return mergeList(Element.previousSiblings(element).reverse(), Element.nextSiblings(element));
    }

    function down(element, expression, index) {
      if (arguments.length == 1) return Element.firstDescendant(element);
      return typeof expression === 'number' ? Element.descendants(element)[expression] :
        Element.select(element, expression)[index || 0];
    }

    function up(element, expression, index) {
      if (arguments.length === 1) return Element.extend($(element).parentNode);
      var ancestors = Element.ancestors(element);
      return typeof expression === 'number' ? ancestors[expression] :
        Selector.findElement(ancestors, expression, index);
    }

    function match(element, selector) {
      if (typeof selector === 'string')
        selector = new Selector(selector);
      return selector.match($(element));
    }

    function select(element) {
      var args = slice.call(arguments, 1);
      return Selector.findChildElements($(element), args);
    }

    var descendantOf = (function() {
      function basic(element, ancestor) {
       element = $(element); ancestor = $(ancestor);
        while (element = element.parentNode)
          if (element == ancestor) return true;
        return false;
      }

      if (Feature('ELEMENT_COMPARE_DOCUMENT_POSITION')) {
        return function(element, ancestor) {
          element = $(element); ancestor = $(ancestor);
          return (element.compareDocumentPosition(ancestor) & 8) === 8;
        };
      }
      if (Feature('ELEMENT_CONTAINS')) {
        return function(element, ancestor) {
          if (ancestor.nodeType !== 1) return basic(element, ancestor);
          element = $(element); ancestor = $(ancestor);
          return ancestor.contains(element) && ancestor !== element;
        };
      }
      return basic;
    })();

    return {
      'adjacent':              adjacent,
      'ancestors':             ancestors,
      'childElements':         immediateDescendants,
      'descendantOf':          descendantOf,
      'descendants':           descendants,
      'down':                  down,
      'firstDescendant':       firstDescendant,
      'getElementsBySelector': select,
      'immediateDescendants':  immediateDescendants,
      'match':                 match,
      'next':                  next,
      'nextSiblings':          nextSiblings,
      'previous':              previous,
      'previousSiblings':      previousSiblings,
      'recursivelyCollect':    recursivelyCollect,
      'select':                select,
      'siblings':              siblings,
      'up':                    up
    };
  })());