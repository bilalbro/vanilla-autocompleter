# Vanilla Autocompleter

A comprehensive autocompleter written entirely in vanilla JavaScript.

## What is it?

As the name suggests, `VanillaAutocompleter` is a library meant to simplify the task of autocompleting text inputs with the help of given suggestions, written entirely in vanilla JavaScript.

The library comes with a handful of features, some of which are described as follows:

- Support for array-based data stores.
- In case of data residing in backend databases, support for promises that eventually resolve to that data.
- Sorting suggestions
- Grouping suggestions based on given criteria.
- Keyboard-based navigation across suggestions.
- Selecting multiple suggestions.
- Highlighting the matching text in each suggestion.
- Customizing suggestion content.
- _...and many many more configurations._

## Motivation

In the early days of 2022, I decided to build a full-fledged vocabulary manager SPA (Single-Page Application) in JavaScript for which one of the prerequisites was an autocompleter. Technically, I could've just created an autocompleter specifically for the requirements of the vocab manager app, but I somehow felt that it was the high time to create a functioning autocompleter library on its own.

I thought that it would be very nice if I could just pass in a couple of configurations to the library, and then get the autocompleter of my choice, in an intuitive way. Plus, creating a library also meant that I could reuse the autocompletion functionality across numerous other applications.

And thus born `VanillaAutocompleter`.

As I mentioned in the `index.js` file (in the `src` directory), development began on 28th Feb 2022 and ended on 31st Feb 2022. So, building the whole library took roughly about 4 days to complete. _Isn't that amazing?_

## Potential improvements

At the time of this writing (of `README.md`), it has been almost a year since the development of this library, and in the meanwhile I can surely say that I've improved considerably as a library author. Now, if I analyze the codebase, I feel that there is room for a lot of improvements throughout.

For instance, I could add TypeScript typings to the library (i.e. an `index.d.ts` file) to allow for better intellisense for its consumers. Moreover, I could even improve the structure of the code at some places to make it a lot more sensible.

As a quick example, currently, `index.js` normalizes the provided options itself and if one is not provided, calls on the default from another module and uses that instead. I feel that, ideally, this should be a concern of those individual modules. `VanillaAutocompleter()` must only provide the individual modules with the options they require, if those options are provided to it, or else provide them with `undefined`. Thereafter, it's the job of those modules to use the default value of an option if not provided.

In addition to this, I can allow for a couple more ways to initialize an autocompleter, for e.g. via overloaded `VanillaAutocompleter()` constructors, or even via HTML `data-` attributes. Not only this, but at many places, I can see constant values (such as `'ac'`) buried down deep into the code. These can clearly be extracted to the top-level in the `constants.js` module and then used from there.

So overall, yes there are things to be done with this library in the coming future, but overall, I'd say that it still is a good feat of thinking and logic, which like almost all pieces of software, will mature with time. 👍

## Using the library

Let's now see how to get started with some autocompletion magic.

Invoke the `VanillaAutocompleter(options)` constructor to create a new autocompleter, with an _`options`_ argument object containing the following properties:

- The core properties:
  - **`inputElement`** (`Element`) - The `<input>` element where the autocompletion must be done.
  - **`suggestionsBoxElement`** (`Element`) - The element where the suggestions get displayed.
  - **`data`** (`Array`) - The data store where searching is performed in order to obtain matching suggestions for the given input. Typically, it's an array, but can be any other kind of object, as long as the searching mechanism for that object is defined.

- Other advanced properties:
  - **`debounceDelay`** (`number`) - The number of milliseconds to wait after an input in the `<input>` element before activating the autocompleter. The default is `0`.
  - **`inputValue`** (`Function`) - A function that is called with a suggestion entry, when that very suggestion is clicked, in order to determine what value to set the `<input>` element to.
  - **`suggestionHTML`** (`Function`) - A function that is called with a suggestion entry, when that suggestion ought to be displayed in the suggestions box, in order to determine what HTML to apply for it.
  - **`matchTarget`** (`Function`) - A function that is called with a data entry in order to determine what must be used in the matching for that very entry. For instance, if the entry is `[1, 'JavaScript']`, where the second item must be used in the matching, then `matchTarget` must be `dataEntry => dataEntry[1]`.
  - **`isMatch`** (`Function`) - A function that is called with two arguments — the input's value and a data entry — in order to determine whether that entry is a match or not for the given input.
  - **`group`** (`Function`) - A function that is called with a suggestion entry in order to determine which group it belongs to.
  - **`sort`** (`Function`) - A function that is used to sort suggestions.
  - **`sortGroup`** (`Function`) - A function that is used to sort groups.
  - **`arrowNav`** (`boolean`) - A Boolean that indicates whether keyboard-based arrow navigation across the suggestions should be enabled. The default is `true`.
  - **`showOnFocus`** (`boolean`) - A Boolean that indicates whether keyboard-based arrow navigation across the suggestions should be enabled. The default is `false`.
  - **`allOnEmpty`** (`boolean`) - A Boolean that indicates whether all suggestions should be shown when the input is empty. The default is `false`.
  - **`highlight`** (`boolean`) - A Boolean that indicates whether the matching text in each suggestion should be highlighted. The default is `false`.
  - **`multiple`** (`boolean`) - A Boolean that indicates whether multiple suggestions could be selected. The default is `false`.
  - **`showSelected`** (`boolean`) - A Boolean that indicates whether the suggestions already selected should be displayed in the suggestions box. The default is `false`.



