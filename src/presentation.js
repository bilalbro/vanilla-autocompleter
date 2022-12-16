
import {
   SUGGESTION_CLASS,
   SUGGESTION_GROUP_CLASS,
} from './constants';

class Presentation {

   static defaultSuggestionHTML(storeEntry, highlightedMatch) {
      return highlightedMatch ? highlightedMatch : storeEntry;
   }

   prependGroupIfNeeded(group, storeEntry) {
      var html = '';
      var groupName = group(storeEntry);

      if (this.prevGroupName !== groupName) {
         html = `<li class="${SUGGESTION_GROUP_CLASS}">${groupName}</li>`;
         this.prevGroupName = groupName;
      }

      return html;
   }

   getSuggestionsHTML(matches, highlightedMatches) {
      var html = '<ul>';
      var i = 0;

      var _this = this;
      var group = this.parent.ordering.group;

      var suggestionsBox = this.parent.suggestionsBox;
      var multiple = suggestionsBox.multiple;

      var suggestionsShown = false;

      matches.forEach(function(storeEntry) {
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

         html += `<li data-index="${i}" class="${SUGGESTION_CLASS + SELECTED_CLASS}">`
                  + _this.suggestionHTML(storeEntry, highlightedMatches[i])
                  + '</li>';

         suggestionsShown = true;

         i++;
      });

      html += '</ul>';

      return suggestionsShown && html;
   }

   activate() {
      var matches = this.parent.store.matches;
      var highlightedMatches = this.parent.store.highlightedMatches;

      var html = this.getSuggestionsHTML(matches, highlightedMatches);

      if (!html) {
         this.parent.suggestionsBox.noMatch();
         return;
      }

      this.parent.suggestionsBox.show(html);
   }

   constructor(parent, options) {
      this.parent = parent;
      this.suggestionHTML = options.suggestionHTML;
      this.prevGroupName = null;
      this.showSelected = options.showSelected;
   }
}

export default Presentation;