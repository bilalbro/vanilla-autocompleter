/**
 * Determine if element matches the given selector string.
 * @param {string} selector
 * @returns {boolean}
 */
 Element.prototype.matchesSelector = function(selector) {

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
}

/**
 * Determine if element is a descendant of the selector element
 * @param {string} selector
 * @returns {boolean | Element}
 */
Element.prototype.isItselfOrWithin = function(selector) {
   var element = this;
   selector = selector.toLowerCase();

   while (element !== document && element !== null) {
      if (element.matchesSelector(selector)) {
         return element;
      }
      
      element = element.parentNode;
   }

   return false;
}