import postcss from 'rollup-plugin-postcss';
import multiEntry from '@rollup/plugin-multi-entry';

export default {
  input: 'src/pages/**/*.{css,scss}',
  output: {
    dir: 'dist',
    format: 'es'
  },
  plugins: [
    multiEntry(),  // Add this to handle multiple entries
    postcss({
      extract: 'open-truss-pages.css',
      minimize: true,
      extensions: ['.css', '.scss'],
      use: [
        ['sass', { includePaths: ['./src/styles'] }]
      ]
    })
  ]
};
