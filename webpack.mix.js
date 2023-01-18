const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

let publicPath = 'public';
mix.setPublicPath('./')
    .sourceMaps()
    .js('src/js/app.js', `${publicPath}/js`)
    .sass('src/sass/app.scss', `${publicPath}/css`)
    .version()
    .vue()

