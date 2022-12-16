class Ordering {

   static defaultGroup(storeEntry) {
      return storeEntry.charAt(0);
   }

   static ascSorting(a, b) {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
   }

   static descSorting(a, b) {
      if (a < b) return 1;
      if (a > b) return -1;
      return 0;
   }

   getGroupNamesMap() {
      var matches = this.parent.store.matches;
      var groupNamesMap = {};

      var _this = this;
      matches.forEach(function(storeEntry) {
         var groupName = _this.group(storeEntry);

         if (!groupNamesMap[groupName]) {
            groupNamesMap[groupName] = [];
         }

         groupNamesMap[groupName].push(storeEntry);
      });

      return groupNamesMap;
   }

   doOrder() {
      return !!(this.group || this.sort || this.sortGroup);
   }

   // If ordering has to be done, i.e. sorting and/or grouping, call other
   // subroutines from within this function.
   // Otherwise, just proceed with the next function.
   activate() {

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
            groupNamesList.forEach(function(groupName) {
               matches = matches.concat(groupNamesMap[groupName]);
            });

            this.parent.store.matches = matches;
         }
      }

      this.parent.presentation.activate();
   }

   constructor(parent, options) {
      this.parent = parent;

      this.group = options.group;

      this.sort = options.sort;
      this.sortGroup = options.sortGroup;
   }
}

export default Ordering;