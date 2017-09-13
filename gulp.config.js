
module.exports = function () {

    /* Directory Structure ---------------------------------------------------*/

    // Main Directories
    var app = './app/';
    var build = './build/';
    var server = './server/';

    // App Directory
    var aAssets = app + 'assets/';
    var aViews = app + 'views/'; /* FIXME (bugRisk): The pages directory naming convention has changed to views */
    var aServices = app + 'services/';
    var aRegions = app + 'regions/';

    // App Sub-Directories
    var aFonts = aAssets + 'fonts/';
    var aImages = aAssets + 'images/';
    var aSources = aRegions + 'sources/';

    // Build Directory
    var bAssets = build + 'assets/';
    var bCSS = build + 'css/';
    var bScripts = build + 'scripts/';
    var bViews = build + 'views/';

    //Build Sub-Directories
    var bFonts = bAssets + 'fonts/';
    var bImages = bAssets + 'images/';

    /* Working Path Structure ------------------------------------------------*/

    // Paths / Directories
    var path1 = aViews + 'home/';               /* TODO: Set module path name */

    /* Start of Config -------------------------------------------------------*/

    var config = {


        // File paths --------------------\

        // Main Singles
        app: app,
        build: build,
        server: server,

        // Singles with Path
        css: bCSS,
        fonts: aFonts + '**/*.*',
        images: aImages + '**/*.*',
        index: app + 'index.pug',
        scss: app + 'master.scss',
        services: aServices,

        aFonts: aFonts,
        aImages: aImages,
        aRegions: aRegions,

        // Sub - Sub Directories
        aSources: aRegions + 'sources/',

        bAssets: bAssets,
        bFonts: bFonts,
        bImages: bImages,
        bScripts: bScripts,

        // Nested
        alljs: [ // Vetting all js
            './*.js',
            './server/*.js'
        ],

        pug: {
            index: {
                src: app + '*.pug',
                base: app,
                watch: [
                    app + '*.pug',
                    aSources + '*.pug',
                    aSources + '**/*.pug'
                ],
                dest: build
            },
            mod1: {                       /* TODO: Replicate for more modules */
                src: path1 + '*.pug',
                base: path1,
                watch: [
                    path1 + '*.pug',
                    path1 + 'sections/**/pug/*.pug'
                ],
                dest: bViews
            }
        },

        scripts: {
            app: {
                src: app + 'app.js',
                base: app,
                watch: app + 'app.js',
                dest: ''
            },
            service: {
                src: app + 'services/*.js',
                base: app + 'services/',
                watch: app + 'services/*.js',
                dest: ''
            },
            mod1: {                       /* TODO: Replicate for more modules */
                src: path1 + 'scripts/*.js',
                base: path1 + 'scripts/',
                watch: path1 + 'scripts/*.js',
                dest: ''
            }
        },

        regions: [
            aSources + 'app/app-links.pug',
            aSources + 'app/app-scripts.pug',
            aSources + 'bower-lib/bower-lib.pug',
            aSources + 'bower-lib/bower-scripts.pug'
        ],

        // Files Under Watch --------------------\

        watchSCSS: [
            app + '*.scss',
            app + 'modules/*.scss',
            app + 'modules/**/*.scss',
            app + 'smacss/*.scss',
            app + 'smacss/**/*.scss',
            app + 'smacss/**/**/*.scss',
            aViews + '**/*.scss',
            aViews + '**/global/*.scss',
            aViews + '**/sections/*.scss',
            aViews + '**/sections/**/*.scss'
        ],



        // Bower and NPM locations --------------------\

        bower: {
            json: require('./bower.json'),
            directory: build + 'libs/',
            ignorePath: '../../../../../build/'
            // ignorePath: '../build'
        },


         // Browsersync --------------------\

        browserReloadDelay: 1000,

        // Wiredep --------------------\

        injectSrc: [
            './build/scripts/*.js',
            '!build/scripts/app.js'
        ],

        injectOptions: {
            ignorePath: 'build',
            addRootSlash: false
        },

        injectApp: {
            link: {
                src: aSources + 'app/links/app-links.rgn.pug',
                dest: aSources + 'app/links/'
            },
            scripts: {
                src: aSources +'app/scripts/app-scripts.rgn.pug',
                dest: aSources +'app/scripts/'
            }
        },

        injectBower: {
            link: {
                src: aSources + 'bower-lib/links/bower-libs_links.rgn.pug',
                dest: aSources + 'bower-lib/links/'
            },
            scripts: {
                src: aSources + 'bower-lib/scripts/bower-libs_scripts.rgn.pug',
                dest: aSources + 'bower-lib/scripts/'
            }
        },

        // Node Settings --------------------\

        defaultPort: 5000,
        nodeServer: './server/server.js'
    }; // end-of-config-object

    // Functions --------------------\

    // Under work
    // config.getPug = function () {  /* TODO: Currently working on function */
    //   config.pug.sales = "dish";
    // };


    // Configs --------------------\


    config.getWiredepDefaultOptions = function () {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };

        return options;
    };

    return config;
};



