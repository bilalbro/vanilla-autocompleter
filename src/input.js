
import {
   ARROW_UP,
   ARROW_DOWN,
   ENTER
} from './constants';


class Input {

   static defaultInputValue(storeEntry) {
      return storeEntry;
   }

   /**
    * The underlying key input handler.
    */
   keyEventHandler(e) {
      var query = this.element.value;

      this.query = query;
      this.parent.selection.activate();
   }

   /**
    * Set up input event handler.
    */
   setUpKeyEventHandler() {
      var _this = this;
      var timer = null;

      this.element.addEventListener('input', function() {
         if (_this.parent.selection.customMakeSelection) {
            _this.parent.suggestionsBox.showLoadingMessage();
         }
         
         clearTimeout(timer);
         timer = setTimeout(_this.keyEventHandler.bind(_this), _this.debounceDelay);
      });
   }

   arrowNavHandler(e) {
      if (!this.parent.suggestionsBox.noSuggestions()) {
         if (e.keyCode === ARROW_DOWN) {
            this.parent.suggestionsBox.goDown();
            e.preventDefault();
         }
         else if (e.keyCode === ARROW_UP) {
            this.parent.suggestionsBox.goUp();
            e.preventDefault();
         }
   
         else if (e.keyCode === ENTER) {
            this.parent.suggestionsBox.handleEnter();
         }
      }
   }

   setUpArrowNavHandler() {
      this.element.addEventListener('keydown', this.arrowNavHandler.bind(this));
   }

   blurHandler(e) {
      // If the suggestion box didn't register a mousedown event, we should hide
      // the suggestions box.
      if (!this.parent.suggestionsBox.mouseDown) {
         this.parent.suggestionsBox.hide();
         return;
      }

      this.parent.suggestionsBox.mouseDown = false;
   }

   setUpBlurHandler() {
      this.element.addEventListener('blur', this.blurHandler.bind(this));
   }

   focusHandler(e) {
      this.parent.selection.activate();
   }

   setUpFocusHandler() {
      this.element.addEventListener('focus', this.focusHandler.bind(this));
   }

   setInputValue(storeEntry) {
      var value = this.inputValue(storeEntry);
      this.query = value;
      this.element.value = value;
   }

   constructor(parent, options) {
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

}

export default Input;