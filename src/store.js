class Store {
   update(matches) {
      this.matches = matches;
   }

   doneLoadingData(data) {
      this.isLoading = false;
      this.data = data;
      this.parent.selection.doneLoadingData();
   }

   loadData() {
      var doneLoadingDataBound = this.doneLoadingData.bind(this);

      this.isLoading = true;
      var returnValue = this.initData(doneLoadingDataBound);

      if (returnValue instanceof Promise) {
         returnValue.then(doneLoadingDataBound);
      }
   }

   reset() {
      this.highlightedMatches = [];
   }

   addHighlightedMatch(match) {
      this.highlightedMatches.push(match);
   }
   
   addSelection(selectionId) {
      this.selectedEntries[selectionId] = true;
   }
   
   existsSelection(selectionId) {
      return selectionId in this.selectedEntries;
   }

   removeSelection(selectionId) {
      delete this.selectedEntries[selectionId];
   }
   
   constructor(parent, options) {
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
}

export default Store;