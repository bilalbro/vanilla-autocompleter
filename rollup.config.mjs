import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';

export default {
   input: 'src/index.js',
   output: {
      file: 'dist/vanilla-autocompleter.min.js',
      format: 'umd',
      name: 'VanillaAutocompleter'
   },
   plugins: [
      babel({
         compact: true,
         babelHelpers: 'bundled',
         extensions: ['.js'],
         presets: ["@babel/preset-env"]
      }),
      terser()
   ]
}