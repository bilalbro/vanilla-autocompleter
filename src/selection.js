
class Selection {

   static defaultHighlightTarget(storeEntry) {
      return storeEntry;
   }

   static defaultMatchTarget(storeEntry) {
      return storeEntry;
   }
   
   static defaultIsMatch(query, storeEntry) {
      var index = this.matchTarget(storeEntry).toLowerCase().indexOf(query.toLowerCase());
      if (index !== -1) {
         return [index, index + query.length - 1];
      }
      return false;
   }

   static defaultMakeSelection(query) {
      var matches = [];

      if (query.length === 0) {
         matches = this.parent.store.data;
         return matches;
      }

      var _this = this;
      this.parent.store.data.forEach(function(storeEntry) {
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


   highlightMatchAndStore(storeEntry, indexPair) {
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
   doneLoadingData() {
      if (this.parent.suggestionsBox.shown) {
         this.activate();
      }
   }

   doneMakingSelection(data) {
      this.proceed(data);
   }

   proceed(matches) {
      if (matches.length) {
         // Update the associated Store instance.
         this.parent.store.matches = matches;

         // Activate the next process in the chain.
         this.parent.ordering.activate(matches);
      }

      else {
         this.parent.suggestionsBox.noMatch();
      }
   }

   activate() {
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
      }

      else if (returnValue === undefined) {
         this.parent.suggestionsBox.showLoadingMessage();
         return;
      }

      // If matches were found, we have to proceed with the next step in the 
      // chain of processes.
      this.proceed(returnValue);
   }

   constructor(parent, options) {
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
}

export default Selection;