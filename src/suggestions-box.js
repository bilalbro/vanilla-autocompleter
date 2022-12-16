
import {
   SELECTED_CLASS,
   HIGHLIGHTED_SUGGESTION_CLASS
} from './constants';

class SuggestionsBox {

   static defaultLoadingHTML() {
      return 'Loading...';
   }

   static defaultGetSelectionId(storeEntry) {
      return storeEntry;
   }

   // Determine if there are no suggestions currently shown to the user.
   // For there to be no suggestions, either suggestionElements will be null, or
   // will be an HTMLCollection with a length of 0.
   noSuggestions() {
      return !this.suggestionElements || this.suggestionElements.length === 0;
   }

   refreshSuggestionElements() {
      this.suggestionElements = this.element.querySelectorAll('.ac_suggestion');
   }

   show(html) {
      this.element.innerHTML = html;
      this.element.classList.add('ac_suggestions--shown');

      this.refreshSuggestionElements();
      this.navIndex = -1;

      this.shown = true;
   }

   hide() {
      this.element.innerHTML = '';
      this.element.classList.remove('ac_suggestions--shown');

      this.shown = false;
   }

   put(html) {
      this.element.innerHTML = html;
   }

   selectWithMultiple(li) {
      li.classList.add(SELECTED_CLASS);
   }

   unselectWithMultiple(li) {
      li.classList.remove(SELECTED_CLASS);
   }

   selectEntryWithMultiple(li, storeEntry) {
      var selectionId = this.getSelectionId(storeEntry);
      var store = this.parent.store;
      var showSelected = this.parent.presentation.showSelected;
      
      if (store.existsSelection(selectionId)) {
         store.removeSelection(selectionId);
         this.unselectWithMultiple(li);
      }

      else {
         store.addSelection(selectionId);

         if (showSelected) {
            this.selectWithMultiple(li, storeEntry);
         }
         else {
            li.parentNode.removeChild(li);
            this.refreshSuggestionElements();
            this.highlightLi();

            if (!this.suggestionElements.length) {
               this.noMatch();
            }
         }
      }
   }

   select(li) {
      var index = li.getAttribute('data-index');
      var storeEntry = this.parent.store.matches[index];

      if (!this.multiple) {
         // Put the desirable value inside the <input> field.
         this.parent.input.setInputValue(storeEntry);

         // Hide the suggestions box.
         this.parent.suggestionsBox.hide();
      }

      else {
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

   handleEnter() {
      var navIndex = this.navIndex;

      if (navIndex !== -1) {
         var li = this.suggestionElements[navIndex];
         this.select(li);
      }
   }

   clickHandler(e) {
      var li = e.target.isItselfOrWithin('.ac_suggestion');

      if (li) {
         this.select(li);
      }
   }

   setUpClickHandler() {
      this.element.addEventListener('click', this.clickHandler.bind(this));
   }

   bringSuggestionInView() {
      var index = this.navIndex;
      var element = this.element;

      if (index !== -1) {
         var sBoxHeight = element.clientHeight;
         
         var highlightedSuggestionElement = this.suggestionElements[index];

         var sOffsetTop = highlightedSuggestionElement.offsetTop;
         var sHeight = highlightedSuggestionElement.clientHeight;
   
         if ((sOffsetTop + sHeight - element.scrollTop) > sBoxHeight) {
            element.scrollTop = sOffsetTop + sHeight - sBoxHeight;
         }
         else if (element.scrollTop > sOffsetTop) {
            element.scrollTop = sOffsetTop
         }
      }
   }

   highlightLi() {
      var index = this.navIndex;
      var suggestionElements = this.suggestionElements;

      if (suggestionElements[index]) {
         suggestionElements[index].classList.add(HIGHLIGHTED_SUGGESTION_CLASS);
      }

      else {
         this.navIndex = -1;
      }
   }

   goDown() {
      var index = this.navIndex;
      var suggestionElements = this.suggestionElements;

      if (index === -1) {
         suggestionElements[++index].classList.add(HIGHLIGHTED_SUGGESTION_CLASS);
      }

      else if (index === suggestionElements.length - 1) {
         suggestionElements[index].classList.remove(HIGHLIGHTED_SUGGESTION_CLASS);
         this.element.scrollTop = 0;
         index = -1;
      }

      else {
         suggestionElements[index].classList.remove(HIGHLIGHTED_SUGGESTION_CLASS);
         suggestionElements[++index].classList.add(HIGHLIGHTED_SUGGESTION_CLASS);
      }

      this.navIndex = index;
      this.bringSuggestionInView();
   }

   goUp() {
      var index = this.navIndex;
      var suggestionElements = this.suggestionElements;

      if (index === -1) {
         index = suggestionElements.length - 1;
         suggestionElements[index].classList.add(HIGHLIGHTED_SUGGESTION_CLASS);
      }

      else if (index === 0) {
         suggestionElements[index].classList.remove(HIGHLIGHTED_SUGGESTION_CLASS);
         index = -1;
      }
      else {
         suggestionElements[index].classList.remove(HIGHLIGHTED_SUGGESTION_CLASS);
         suggestionElements[--index].classList.add(HIGHLIGHTED_SUGGESTION_CLASS);
      }

      this.navIndex = index;
      this.bringSuggestionInView();
   }

   noMatch() {
      this.show('Nothing found.');
   }

   showLoadingMessage() {
      this.show(this.loadingHTML());
   }

   mouseDownHandler(e) {
      this.mouseDown = true;
   }

   setUpMouseDownHandler() {
      this.element.addEventListener('mousedown', this.mouseDownHandler.bind(this));
   }

   constructor(parent, options) {
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
}

export default SuggestionsBox;