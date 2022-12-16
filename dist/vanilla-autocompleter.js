(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.VanillaAutocompleter = factory());
})(this, (function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

  var SUGGESTION_CLASS = 'ac_suggestion';
  var SUGGESTION_GROUP_CLASS = 'ac_group';
  var SELECTED_CLASS = 'selected';
  var HIGHLIGHTED_SUGGESTION_CLASS = 'hl';
  var ARROW_UP = 38;
  var ARROW_DOWN = 40;
  var ENTER = 13;

  var Input = /*#__PURE__*/function () {
    function Input(parent, options) {
      _classCallCheck(this, Input);
      this.parent = parent;
      this.element = options.element;
      this.arrowNav = options.arrowNav;
      this.inputValue = options.inputValue;
      this.showOnFocus = options.showOnFocus;
      this.debounceDelay = options.debounceDelay;
      this.query = '';

      // Set up the key event handler and start listening for keyup.
      this.setUpKeyEventHandler();
      this.setUpBlurHandler();

      // Set up focus event handler, if asked to.
      if (this.showOnFocus) {
        this.setUpFocusHandler();
      }

      // Set up the arrow navigation logic is asked to
      if (this.arrowNav) {
        this.setUpArrowNavHandler();
      }
    }
    _createClass(Input, [{
      key: "keyEventHandler",
      value:
      /**
       * The underlying key input handler.
       */
      function keyEventHandler(e) {
        var query = this.element.value;
        this.query = query;
        this.parent.selection.activate();
      }

      /**
       * Set up input event handler.
       */
    }, {
      key: "setUpKeyEventHandler",
      value: function setUpKeyEventHandler() {
        var _this = this;
        var timer = null;
        this.element.addEventListener('input', function () {
          if (_this.parent.selection.customMakeSelection) {
            _this.parent.suggestionsBox.showLoadingMessage();
          }
          clearTimeout(timer);
          timer = setTimeout(_this.keyEventHandler.bind(_this), _this.debounceDelay);
        });
      }
    }, {
      key: "arrowNavHandler",
      value: function arrowNavHandler(e) {
        if (!this.parent.suggestionsBox.noSuggestions()) {
          if (e.keyCode === ARROW_DOWN) {
            this.parent.suggestionsBox.goDown();
            e.preventDefault();
          } else if (e.keyCode === ARROW_UP) {
            this.parent.suggestionsBox.goUp();
            e.preventDefault();
          } else if (e.keyCode === ENTER) {
            this.parent.suggestionsBox.handleEnter();
          }
        }
      }
    }, {
      key: "setUpArrowNavHandler",
      value: function setUpArrowNavHandler() {
        this.element.addEventListener('keydown', this.arrowNavHandler.bind(this));
      }
    }, {
      key: "blurHandler",
      value: function blurHandler(e) {
        // If the suggestion box didn't register a mousedown event, we should hide
        // the suggestions box.
        if (!this.parent.suggestionsBox.mouseDown) {
          this.parent.suggestionsBox.hide();
          return;
        }
        this.parent.suggestionsBox.mouseDown = false;
      }
    }, {
      key: "setUpBlurHandler",
      value: function setUpBlurHandler() {
        this.element.addEventListener('blur', this.blurHandler.bind(this));
      }
    }, {
      key: "focusHandler",
      value: function focusHandler(e) {
        this.parent.selection.activate();
      }
    }, {
      key: "setUpFocusHandler",
      value: function setUpFocusHandler() {
        this.element.addEventListener('focus', this.focusHandler.bind(this));
      }
    }, {
      key: "setInputValue",
      value: function setInputValue(storeEntry) {
        var value = this.inputValue(storeEntry);
        this.query = value;
        this.element.value = value;
      }
    }], [{
      key: "defaultInputValue",
      value: function defaultInputValue(storeEntry) {
        return storeEntry;
      }
    }]);
    return Input;
  }();

  var Selection = /*#__PURE__*/function () {
    function Selection(parent, options) {
      _classCallCheck(this, Selection);
      this.parent = parent;
      this.matchTarget = options.matchTarget;
      this.makeSelection = options.makeSelection;
      this.isMatch = options.isMatch;
      this.allOnEmpty = options.allOnEmpty;
      this.highlight = options.highlight;
      this.highlightTarget = options.highlightTarget;
      this.customMakeSelection = false;
      if (this.makeSelection !== Selection.defaultMakeSelection) {
        this.customMakeSelection = true;
      }
    }
    _createClass(Selection, [{
      key: "highlightMatchAndStore",
      value: function highlightMatchAndStore(storeEntry, indexPair) {
        var highlightedMatch;
        var highlightTargetChars = this.highlightTarget(storeEntry).split('');
        var start = indexPair[0];
        highlightTargetChars[start] = '<b>' + highlightTargetChars[start];
        var end = indexPair[1];
        highlightTargetChars[end] = highlightTargetChars[end] + '</b>';
        highlightedMatch = highlightTargetChars.join('');
        this.parent.store.addHighlightedMatch(highlightedMatch);
      }

      /**
       * Initiated by the Store component to inform this module that the loading of
       * data has completed and that we should resume processing the query.
       */
    }, {
      key: "doneLoadingData",
      value: function doneLoadingData() {
        if (this.parent.suggestionsBox.shown) {
          this.activate();
        }
      }
    }, {
      key: "doneMakingSelection",
      value: function doneMakingSelection(data) {
        this.proceed(data);
      }
    }, {
      key: "proceed",
      value: function proceed(matches) {
        if (matches.length) {
          // Update the associated Store instance.
          this.parent.store.matches = matches;

          // Activate the next process in the chain.
          this.parent.ordering.activate(matches);
        } else {
          this.parent.suggestionsBox.noMatch();
        }
      }
    }, {
      key: "activate",
      value: function activate() {
        var query = this.parent.input.query;

        // Reset highlightedMatches all the way in the Store component.
        this.parent.store.reset();

        // If the <input> box is empty and nothing has to be shown on an empty
        // value, go on and hide the suggestions box.
        if (query.length === 0 && !this.allOnEmpty) {
          this.parent.suggestionsBox.hide();
          return;
        }

        // If we are still loading data, display the respective loading message in
        // the suggestions box.
        if (this.parent.store.isLoading) {
          this.parent.suggestionsBox.showLoadingMessage();
          return;
        }

        // Beyond this point, we do need to show something in the suggestions box.

        var returnValue = this.makeSelection(query, this.doneMakingSelection.bind(this));
        if (returnValue instanceof Promise) {
          this.parent.suggestionsBox.showLoadingMessage();
          returnValue.then(this.doneMakingSelection.bind(this));
          return;
        } else if (returnValue === undefined) {
          this.parent.suggestionsBox.showLoadingMessage();
          return;
        }

        // If matches were found, we have to proceed with the next step in the 
        // chain of processes.
        this.proceed(returnValue);
      }
    }], [{
      key: "defaultHighlightTarget",
      value: function defaultHighlightTarget(storeEntry) {
        return storeEntry;
      }
    }, {
      key: "defaultMatchTarget",
      value: function defaultMatchTarget(storeEntry) {
        return storeEntry;
      }
    }, {
      key: "defaultIsMatch",
      value: function defaultIsMatch(query, storeEntry) {
        var index = this.matchTarget(storeEntry).toLowerCase().indexOf(query.toLowerCase());
        if (index !== -1) {
          return [index, index + query.length - 1];
        }
        return false;
      }
    }, {
      key: "defaultMakeSelection",
      value: function defaultMakeSelection(query) {
        var matches = [];
        if (query.length === 0) {
          matches = this.parent.store.data;
          return matches;
        }
        var _this = this;
        this.parent.store.data.forEach(function (storeEntry) {
          var isMatch = _this.isMatch(query, storeEntry);
          if (isMatch) {
            // If the current entry matches the query, AND if highlighting is
            // desired, perform the necessary <b> insertion on the story entry's
            // respective entity and move on.
            if (_this.highlight) {
              _this.highlightMatchAndStore(storeEntry, isMatch);
            }
            matches.push(storeEntry);
          }
        });
        return matches;
      }
    }]);
    return Selection;
  }();

  var SuggestionsBox = /*#__PURE__*/function () {
    function SuggestionsBox(parent, options) {
      _classCallCheck(this, SuggestionsBox);
      this.parent = parent;
      this.element = options.element;
      this.loadingHTML = options.loadingHTML;
      this.multiple = options.multiple;
      this.getSelectionId = options.getSelectionId;
      this.mouseDown = false;
      this.setUpMouseDownHandler();
      this.suggestionElements = null;
      this.navIndex = -1;
      this.onSelect = options.onSelect;
      this.setUpClickHandler();
    }
    _createClass(SuggestionsBox, [{
      key: "noSuggestions",
      value:
      // Determine if there are no suggestions currently shown to the user.
      // For there to be no suggestions, either suggestionElements will be null, or
      // will be an HTMLCollection with a length of 0.
      function noSuggestions() {
        return !this.suggestionElements || this.suggestionElements.length === 0;
      }
    }, {
      key: "refreshSuggestionElements",
      value: function refreshSuggestionElements() {
        this.suggestionElements = this.element.querySelectorAll('.ac_suggestion');
      }
    }, {
      key: "show",
      value: function show(html) {
        this.element.innerHTML = html;
        this.element.classList.add('ac_suggestions--shown');
        this.refreshSuggestionElements();
        this.navIndex = -1;
        this.shown = true;
      }
    }, {
      key: "hide",
      value: function hide() {
        this.element.innerHTML = '';
        this.element.classList.remove('ac_suggestions--shown');
        this.shown = false;
      }
    }, {
      key: "put",
      value: function put(html) {
        this.element.innerHTML = html;
      }
    }, {
      key: "selectWithMultiple",
      value: function selectWithMultiple(li) {
        li.classList.add(SELECTED_CLASS);
      }
    }, {
      key: "unselectWithMultiple",
      value: function unselectWithMultiple(li) {
        li.classList.remove(SELECTED_CLASS);
      }
    }, {
      key: "selectEntryWithMultiple",
      value: function selectEntryWithMultiple(li, storeEntry) {
        var selectionId = this.getSelectionId(storeEntry);
        var store = this.parent.store;
        var showSelected = this.parent.presentation.showSelected;
        if (store.existsSelection(selectionId)) {
          store.removeSelection(selectionId);
          this.unselectWithMultiple(li);
        } else {
          store.addSelection(selectionId);
          if (showSelected) {
            this.selectWithMultiple(li, storeEntry);
          } else {
            li.parentNode.removeChild(li);
            this.refreshSuggestionElements();
            this.highlightLi();
            if (!this.suggestionElements.length) {
              this.noMatch();
            }
          }
        }
      }
    }, {
      key: "select",
      value: function select(li) {
        var index = li.getAttribute('data-index');
        var storeEntry = this.parent.store.matches[index];
        if (!this.multiple) {
          // Put the desirable value inside the <input> field.
          this.parent.input.setInputValue(storeEntry);

          // Hide the suggestions box.
          this.parent.suggestionsBox.hide();
        } else {
          this.selectEntryWithMultiple(li, storeEntry);
        }
        if (this.onSelect) {
          var selectionId;
          if (this.multiple) {
            selectionId = this.getSelectionId(storeEntry);
          }
          this.onSelect(storeEntry, selectionId);
        }
      }
    }, {
      key: "handleEnter",
      value: function handleEnter() {
        var navIndex = this.navIndex;
        if (navIndex !== -1) {
          var li = this.suggestionElements[navIndex];
          this.select(li);
        }
      }
    }, {
      key: "clickHandler",
      value: function clickHandler(e) {
        var li = e.target.isItselfOrWithin('.ac_suggestion');
        if (li) {
          this.select(li);
        }
      }
    }, {
      key: "setUpClickHandler",
      value: function setUpClickHandler() {
        this.element.addEventListener('click', this.clickHandler.bind(this));
      }
    }, {
      key: "bringSuggestionInView",
      value: function bringSuggestionInView() {
        var index = this.navIndex;
        var element = this.element;
        if (index !== -1) {
          var sBoxHeight = element.clientHeight;
          var highlightedSuggestionElement = this.suggestionElements[index];
          var sOffsetTop = highlightedSuggestionElement.offsetTop;
          var sHeight = highlightedSuggestionElement.clientHeight;
          if (sOffsetTop + sHeight - element.scrollTop > sBoxHeight) {
            element.scrollTop = sOffsetTop + sHeight - sBoxHeight;
          } else if (element.scrollTop > sOffsetTop) {
            element.scrollTop = sOffsetTop;
          }
        }
      }
    }, {
      key: "highlightLi",
      value: function highlightLi() {
        var index = this.navIndex;
        var suggestionElements = this.suggestionElements;
        if (suggestionElements[index]) {
          suggestionElements[index].classList.add(HIGHLIGHTED_SUGGESTION_CLASS);
        } else {
          this.navIndex = -1;
        }
      }
    }, {
      key: "goDown",
      value: function goDown() {
        var index = this.navIndex;
        var suggestionElements = this.suggestionElements;
        if (index === -1) {
          suggestionElements[++index].classList.add(HIGHLIGHTED_SUGGESTION_CLASS);
        } else if (index === suggestionElements.length - 1) {
          suggestionElements[index].classList.remove(HIGHLIGHTED_SUGGESTION_CLASS);
          this.element.scrollTop = 0;
          index = -1;
        } else {
          suggestionElements[index].classList.remove(HIGHLIGHTED_SUGGESTION_CLASS);
          suggestionElements[++index].classList.add(HIGHLIGHTED_SUGGESTION_CLASS);
        }
        this.navIndex = index;
        this.bringSuggestionInView();
      }
    }, {
      key: "goUp",
      value: function goUp() {
        var index = this.navIndex;
        var suggestionElements = this.suggestionElements;
        if (index === -1) {
          index = suggestionElements.length - 1;
          suggestionElements[index].classList.add(HIGHLIGHTED_SUGGESTION_CLASS);
        } else if (index === 0) {
          suggestionElements[index].classList.remove(HIGHLIGHTED_SUGGESTION_CLASS);
          index = -1;
        } else {
          suggestionElements[index].classList.remove(HIGHLIGHTED_SUGGESTION_CLASS);
          suggestionElements[--index].classList.add(HIGHLIGHTED_SUGGESTION_CLASS);
        }
        this.navIndex = index;
        this.bringSuggestionInView();
      }
    }, {
      key: "noMatch",
      value: function noMatch() {
        this.show('Nothing found.');
      }
    }, {
      key: "showLoadingMessage",
      value: function showLoadingMessage() {
        this.show(this.loadingHTML());
      }
    }, {
      key: "mouseDownHandler",
      value: function mouseDownHandler(e) {
        this.mouseDown = true;
      }
    }, {
      key: "setUpMouseDownHandler",
      value: function setUpMouseDownHandler() {
        this.element.addEventListener('mousedown', this.mouseDownHandler.bind(this));
      }
    }], [{
      key: "defaultLoadingHTML",
      value: function defaultLoadingHTML() {
        return 'Loading...';
      }
    }, {
      key: "defaultGetSelectionId",
      value: function defaultGetSelectionId(storeEntry) {
        return storeEntry;
      }
    }]);
    return SuggestionsBox;
  }();

  var Presentation = /*#__PURE__*/function () {
    function Presentation(parent, options) {
      _classCallCheck(this, Presentation);
      this.parent = parent;
      this.suggestionHTML = options.suggestionHTML;
      this.prevGroupName = null;
      this.showSelected = options.showSelected;
    }
    _createClass(Presentation, [{
      key: "prependGroupIfNeeded",
      value: function prependGroupIfNeeded(group, storeEntry) {
        var html = '';
        var groupName = group(storeEntry);
        if (this.prevGroupName !== groupName) {
          html = "<li class=\"".concat(SUGGESTION_GROUP_CLASS, "\">").concat(groupName, "</li>");
          this.prevGroupName = groupName;
        }
        return html;
      }
    }, {
      key: "getSuggestionsHTML",
      value: function getSuggestionsHTML(matches, highlightedMatches) {
        var html = '<ul>';
        var i = 0;
        var _this = this;
        var group = this.parent.ordering.group;
        var suggestionsBox = this.parent.suggestionsBox;
        var multiple = suggestionsBox.multiple;
        var suggestionsShown = false;
        matches.forEach(function (storeEntry) {
          if (group) {
            html += _this.prependGroupIfNeeded(group, storeEntry);
          }
          var SELECTED_CLASS = '';
          if (multiple) {
            var selectionId = suggestionsBox.getSelectionId(storeEntry);
            if (_this.parent.store.existsSelection(selectionId)) {
              SELECTED_CLASS = ' selected';
              if (!_this.showSelected) {
                i++;
                return;
              }
            }
          }
          html += "<li data-index=\"".concat(i, "\" class=\"").concat(SUGGESTION_CLASS + SELECTED_CLASS, "\">") + _this.suggestionHTML(storeEntry, highlightedMatches[i]) + '</li>';
          suggestionsShown = true;
          i++;
        });
        html += '</ul>';
        return suggestionsShown && html;
      }
    }, {
      key: "activate",
      value: function activate() {
        var matches = this.parent.store.matches;
        var highlightedMatches = this.parent.store.highlightedMatches;
        var html = this.getSuggestionsHTML(matches, highlightedMatches);
        if (!html) {
          this.parent.suggestionsBox.noMatch();
          return;
        }
        this.parent.suggestionsBox.show(html);
      }
    }], [{
      key: "defaultSuggestionHTML",
      value: function defaultSuggestionHTML(storeEntry, highlightedMatch) {
        return highlightedMatch ? highlightedMatch : storeEntry;
      }
    }]);
    return Presentation;
  }();

  var Store = /*#__PURE__*/function () {
    function Store(parent, options) {
      _classCallCheck(this, Store);
      this.parent = parent;
      this.data = options.data;
      this.initData = options.initData;
      this.matches = null;
      this.highlightedMatches = [];
      this.selectedEntries = {};
      this.isLoading = false;
      if (this.initData) {
        this.loadData();
      }
    }
    _createClass(Store, [{
      key: "update",
      value: function update(matches) {
        this.matches = matches;
      }
    }, {
      key: "doneLoadingData",
      value: function doneLoadingData(data) {
        this.isLoading = false;
        this.data = data;
        this.parent.selection.doneLoadingData();
      }
    }, {
      key: "loadData",
      value: function loadData() {
        var doneLoadingDataBound = this.doneLoadingData.bind(this);
        this.isLoading = true;
        var returnValue = this.initData(doneLoadingDataBound);
        if (returnValue instanceof Promise) {
          returnValue.then(doneLoadingDataBound);
        }
      }
    }, {
      key: "reset",
      value: function reset() {
        this.highlightedMatches = [];
      }
    }, {
      key: "addHighlightedMatch",
      value: function addHighlightedMatch(match) {
        this.highlightedMatches.push(match);
      }
    }, {
      key: "addSelection",
      value: function addSelection(selectionId) {
        this.selectedEntries[selectionId] = true;
      }
    }, {
      key: "existsSelection",
      value: function existsSelection(selectionId) {
        return selectionId in this.selectedEntries;
      }
    }, {
      key: "removeSelection",
      value: function removeSelection(selectionId) {
        delete this.selectedEntries[selectionId];
      }
    }]);
    return Store;
  }();

  var Ordering = /*#__PURE__*/function () {
    function Ordering(parent, options) {
      _classCallCheck(this, Ordering);
      this.parent = parent;
      this.group = options.group;
      this.sort = options.sort;
      this.sortGroup = options.sortGroup;
    }
    _createClass(Ordering, [{
      key: "getGroupNamesMap",
      value: function getGroupNamesMap() {
        var matches = this.parent.store.matches;
        var groupNamesMap = {};
        var _this = this;
        matches.forEach(function (storeEntry) {
          var groupName = _this.group(storeEntry);
          if (!groupNamesMap[groupName]) {
            groupNamesMap[groupName] = [];
          }
          groupNamesMap[groupName].push(storeEntry);
        });
        return groupNamesMap;
      }
    }, {
      key: "doOrder",
      value: function doOrder() {
        return !!(this.group || this.sort || this.sortGroup);
      }

      // If ordering has to be done, i.e. sorting and/or grouping, call other
      // subroutines from within this function.
      // Otherwise, just proceed with the next function.
    }, {
      key: "activate",
      value: function activate() {
        if (this.doOrder()) {
          // If grouping is desired, perform it and then proceed with the next step.
          if (this.group) {
            var groupNamesMap = this.getGroupNamesMap();
            var groupNamesList = Object.keys(groupNamesMap);

            // If furthermore, sorting the groups is desired, sort all the keys
            // in the group names map.
            if (this.sortGroup) {
              groupNamesList.sort(this.sortGroup);
            }

            // If futhermore, sorting the individual items is also desired, go
            // over each key's array and sort it individually.
            if (this.sort) {
              for (var prop in groupNamesMap) {
                groupNamesMap[prop].sort(this.sort);
              }
            }

            // At this stage, we are done with our processing and now just need
            // to flatten the group names map into an array. This flattening is
            // crucial for the Presentation.getSuggestionHTML() method. It goes
            // over each entry in the Store.matches array and creates an <li>
            // element with a data-index attribute set to the index of the entry. 
            var matches = [];
            groupNamesList.forEach(function (groupName) {
              matches = matches.concat(groupNamesMap[groupName]);
            });
            this.parent.store.matches = matches;
          }
        }
        this.parent.presentation.activate();
      }
    }], [{
      key: "defaultGroup",
      value: function defaultGroup(storeEntry) {
        return storeEntry.charAt(0);
      }
    }, {
      key: "ascSorting",
      value: function ascSorting(a, b) {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      }
    }, {
      key: "descSorting",
      value: function descSorting(a, b) {
        if (a < b) return 1;
        if (a > b) return -1;
        return 0;
      }
    }]);
    return Ordering;
  }();

  /**
   * Determine if element matches the given selector string.
   * @param {string} selector
   * @returns {boolean}
   */
  Element.prototype.matchesSelector = function (selector) {
    // Tag selector.
    if (/^\w+$/.test(selector)) {
      return this.nodeName.toLowerCase() === selector;
    }

    // Class selector.
    else if (/^\./.test(selector)) {
      return this.classList.contains(selector.slice(1));
    }

    // ID selector.
    else if (/^\#/.test(selector)) {
      return this.getAttribute('id') === selector.slice(1);
    }
  };

  /**
   * Determine if element is a descendant of the selector element
   * @param {string} selector
   * @returns {boolean | Element}
   */
  Element.prototype.isItselfOrWithin = function (selector) {
    var element = this;
    selector = selector.toLowerCase();
    while (element !== document && element !== null) {
      if (element.matchesSelector(selector)) {
        return element;
      }
      element = element.parentNode;
    }
    return false;
  };

  var VanillaAutocompleter = /*#__PURE__*/function () {
    function VanillaAutocompleter(options) {
      _classCallCheck(this, VanillaAutocompleter);
      var normalizedOptions = this.defaults();
      for (var prop in options) {
        normalizedOptions[prop] = options[prop];
      }
      if (normalizedOptions.highlight && options.makeSelection) {
        throw new Error('Options `highlight` and `makeSelection` can\'t be set together.');
      }

      // At this stage, we have a map of normalized options.

      this.input = new Input(this, {
        element: normalizedOptions.inputElement,
        arrowNav: normalizedOptions.arrowNav,
        hideOnBlur: normalizedOptions.hideOnBlur,
        inputValue: normalizedOptions.inputValue,
        showOnFocus: normalizedOptions.showOnFocus,
        debounceDelay: normalizedOptions.debounceDelay
      });
      this.suggestionsBox = new SuggestionsBox(this, {
        element: normalizedOptions.suggestionsBoxElement,
        onSelect: normalizedOptions.onSelect,
        loadingHTML: normalizedOptions.loadingHTML,
        multiple: normalizedOptions.multiple,
        getSelectionId: normalizedOptions.getSelectionId
      });
      this.selection = new Selection(this, {
        makeSelection: normalizedOptions.makeSelection,
        matchTarget: normalizedOptions.matchTarget,
        isMatch: normalizedOptions.isMatch,
        allOnEmpty: normalizedOptions.allOnEmpty,
        highlight: normalizedOptions.highlight,
        highlightTarget: normalizedOptions.highlightTarget
      });
      this.store = new Store(this, {
        data: normalizedOptions.data,
        initData: normalizedOptions.initData
      });
      this.ordering = new Ordering(this, {
        group: normalizedOptions.group,
        sort: normalizedOptions.sort,
        sortGroup: normalizedOptions.sortGroup
      });
      this.presentation = new Presentation(this, {
        suggestionHTML: normalizedOptions.suggestionHTML,
        showSelected: normalizedOptions.showSelected
      });
    }
    _createClass(VanillaAutocompleter, [{
      key: "unselect",
      value: function unselect(selectionId) {
        this.store.removeSelection(selectionId);
      }
    }, {
      key: "defaults",
      value: function defaults() {
        var options = {};
        options.data = null;
        options.initData = null;
        options.allOnEmpty = false;
        options.inputElement = null;
        options.inputValue = Input.defaultInputValue;
        options.debounceDelay = 0;
        options.suggestionsBoxElement = null;
        options.suggestionHTML = Presentation.defaultSuggestionHTML;
        options.multiple = false;
        options.getSelectionId = SuggestionsBox.defaultGetSelectionId;
        options.showSelected = true;
        options.matchTarget = Selection.defaultMatchTarget;
        options.loadingHTML = SuggestionsBox.defaultLoadingHTML;
        options.onSelect = null;
        options.makeSelection = Selection.defaultMakeSelection;
        options.isMatch = Selection.defaultIsMatch;
        options.arrowNav = true;
        options.removeOnBlur = true;
        options.hideOnBlur = true;
        options.showOnFocus = false;
        options.group = null;
        options.sort = null;
        options.sortGroup = null;
        options.highlight = false;
        options.highlightTarget = Selection.defaultHighlightTarget;
        return options;
      }
    }]);
    return VanillaAutocompleter;
  }();
  VanillaAutocompleter.ascSorting = Ordering.ascSorting;
  VanillaAutocompleter.descSorting = Ordering.descSorting;
  VanillaAutocompleter.groupByFirstLetter = Ordering.defaultGroup;

  return VanillaAutocompleter;

}));
