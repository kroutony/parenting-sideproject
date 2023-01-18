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

let publicPath = 'public/assets';
mix.setPublicPath('./')
    .sourceMaps()
    .js('public/src/js/app.js', `${publicPath}/js`)
    .sass('public/src/sass/app.scss', `${publicPath}/css`)
    .version()
    .vue()

