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
- Customizing suggestion content.
- ...and many many more configurations.

## Motivation

In the early days of 2022, I decided to build a full-fledged vocabulary manager SPA (Single-Page Application) in JavaScript for which one of the prerequisites was an autocompleter. Technically, I could've just created an autocompleter specifically for the requirements of the vocab manager app, but I somehow felt that it was the high time to create a functioning autocompleter library on its own.

I thought that it would be very nice if I could just pass in a couple of configurations to the library, and then get the autocompleter of my choice, in an intuitive way. Plus, creating a library also meant that I could reuse the autocompletion functionality across numerous other applications.

And thus born `VanillaAutocompleter`.

As I mentioned in the `index.js` file (in the `src` directory), development began on 28th Feb 2022 and ended on 31st Feb 2022. So, building the whole library took roughly about 4 days to complete. Isn't that amazing?
