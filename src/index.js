/**
 * Autocomplete Library.
 * 
 * Development begins: 28th Feb 2022.
 * Development completes: 31st Feb 2022.
 * 
 */

import Input from './input';
import Selection from './selection';
import SuggestionsBox from './suggestions-box';
import Presentation from './presentation';
import Store from './store';
import Ordering from './ordering';
import './additions';


class Autocompleter {

   unselect(selectionId) {
      this.store.removeSelection(selectionId);
   }

   defaults() {
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

   constructor(options) {

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
         getSelectionId: normalizedOptions.getSelectionId,
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
}

Autocompleter.ascSorting = Ordering.ascSorting;
Autocompleter.descSorting = Ordering.descSorting;
Autocompleter.groupByFirstLetter = Ordering.defaultGroup;

export default Autocompleter;