var gulp = require('gulp');

//Gulp Plugins
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');
var pug = require('gulp-pug');
var gulpif = require('gulp-if');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var inject = require('gulp-inject');
var nodemon = require('gulp-nodemon');
var util = require('gulp-util');
var taskListing = require('gulp-task-listing');
var imagemin = require('gulp-imagemin');
var pugLint = require('gulp-pug-lint');
var stripCssComments = require('gulp-strip-css-comments');
var todo = require('gulp-todo');
var gulpDocumentation = require('gulp-documentation');

// Non-gulp Plugins
var browserSync = require('browser-sync');
// var merge = require('merge-stream');
var args = require('yargs').argv;
var del = require('del');

// Configs
var config = require('./gulp.config')();
var port = process.env.PORT || config.defaultPort;


////////////////////////////////////////////////////////////////////////////////
// Dynamic Section - Change code to set destinations ///////////////////////////
////////////////////////////////////////////////////////////////////////////////

// Watching Pug
gulp.task('watch-pug', function () {
    log('Watching Pug');
    var fileType = 'pug';

    gulp.watch([config.pug.index.watch],function(){watchTask(fileType,'index');});
    gulp.watch([config.pug.mod1.watch],function(){watchTask(fileType,'mod1');});
    /* TODO: Replicate with incremented number of mod for more modules */
});

// Watching Scripts
gulp.task('watch-scripts', function () {
    log('Watching Scripts');
    var fileType = 'script';

    gulp.watch([config.scripts.app.watch],function(){watchTask(fileType,'app')});
    gulp.watch([config.scripts.service.watch],function(){watchTask(fileType,'service')});
    gulp.watch([config.scripts.mod1.watch],function(){watchTask(fileType,'mod1')});
    /* TODO: Replicate with incremented number of mod for more modules */
});

// Build Pug
gulp.task('build-pug', function () {
    log('Compiling and Compressing All Pugs to Build Dir');

    pugTask(config.pug.index.src, config.pug.index.base, config.pug.index.dest);
    pugTask(config.pug.mod1.src, config.pug.mod1.base, config.pug.mod1.dest);
    /* TODO: Replicate with incremented number of mod for more modules */

    log('build-pug Done');
});

// Build Scripts
gulp.task('build-scripts', function () {
    log('Compiling and Compressing All Scripts to Build Dir');

    scriptsTask(config.scripts.app.src, config.scripts.app.base);
    scriptsTask(config.scripts.service.src, config.scripts.service.base);
    scriptsTask(config.scripts.mod1.src, config.scripts.mod1.base);
    /* TODO: Replicate with incremented number of mod for more modules */

    log('build-scripts Done');
});


/**
 * This function serves as a general task for watching file types and running
 * its concurrent function for compilation
 *
 * @param {string} fileType requests type of file
 * @param {string} fileName requests name of file
 */

function watchTask(fileType,fileName) {
    var src = config.pug[fileName].src;
    var base = config.pug[fileName].base;
    var dest = config.pug[fileName].dest;

    if (fileType === 'pug') {
        pugTask(src,base,dest).on('change', function(event) {
            changeEvent(event);
        });

    } else if (fileType === 'script') {
        scriptsTask(src, base).on('change', function (event) {
            changeEvent(event);
        });

    } else {
        console.log('Incorrect fileType!');
        window.alert('Incorrect fileType!');
    }
}

/**
 * This function compiles pug into html
 * @param {object} pugSrc  requests the source of pug
 * @param {object} pugBase requests the base of pug
 * @param {object} pugDest requests the destination of pug
 *
 * @returns {object} gulp
 */

function pugTask(pugSrc, pugBase, pugDest) {
    log('Compiling PUG --> HTML');

    return gulp
        .src([pugSrc], {base: pugBase})
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe(pugLint())
        .pipe(pug())
        // .pipe(pug({
        //     pretty: true
        // }))
        .pipe(gulp.dest(pugDest))
        .on('end', function () {
            browserSync.reload();
        });
}

/**
* This function optimizes and copies scripts to the build directory
* @param {object} scriptSrc  requests the source of script
* @param {object} scriptBase requests the base of script
*
* @returns {object} gulp
*/

function scriptsTask(scriptSrc, scriptBase) {
    log('Making changes to Scripts');

    return gulp
        .src([scriptSrc], {base: scriptBase})
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe(gulp.dest(config.bScripts))
        .on('end', function () {
            browserSync.reload();
        });
}

// SCSS
gulp.task('styles', function () {
    log('Compiling SCSS --> CSS');
    // var autoprefixBrowsers = ['> 1%', 'last 2 versions', 'firefox >= 4',
    //     'safari 7','safari 8', 'IE 8', 'IE 9', 'IE 10', 'IE 11'];

    return gulp
        .src(config.scss)
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(stripCssComments())
        // .pipe(sassdoc())
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('.'))
        // .pipe(autoprefixer({                  /* FIXME: gulp-autoprefixer! */
        //     browsers: [autoprefixBrowsers],
        //     cascade: false
        // }))
        // .pipe(autoprefixer({
        //     browsers: ['last 2 versions']
        //     }))
        .pipe(gulp.dest(config.css))
        .pipe(browserSync.stream())
        .on('end', function () {
            log('CSS Compiled!');
        });
});

////////////////////////////////////////////////////////////////////////////////
// TODOs and Documentation /////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

gulp.task('todo', function() {
    log('Running Todo');

    return gulp
        .src([
            './*.js',
            'app/*.*',
            'app/**/*.*',
            '!./app{,/*.png}',//FIXME: png format file is not accepted by the gulp todo.
            '!./app/**{,/*.png}',
            '!./node_modules{,/**}'
        ])
        .pipe(plumber())
        .pipe(todo())
        .pipe(gulp.dest('./'))
        .on('end', function() {
            log('todo task Done');
        });
});

gulp.task('documentation', function () {
    return gulp
        .src([
            './*.js',
            'app/*.js',
            'app/**/*.js'
        ])
        .pipe(gulpDocumentation('html', {}, {
            name: 'My Project',
            version: '1.0.0'
        }))
        .pipe(gulp.dest('html-documentation'));
});

gulp.task('watch-docs-todo',['todo','documentation'],function () {
    log('Watching......');

    gulp.watch([
        './*.js',
        'app/*.*',
        'app/**/*.*',
        '!./node_modules{,/**}'
    ], ['todo']);

    gulp.watch([
        './*.js',
        'app/*.js',
        'app/**/*.js'
    ],['documentation']);
});

////////////////////////////////////////////////////////////////////////////////
// Static Section - No need to tamper with these codes /////////////////////////
////////////////////////////////////////////////////////////////////////////////

// This lists all tasks within gulp
gulp.task('help', taskListing);
gulp.task('default', ['help']);

// Copying and Compressing Images to Build Folder
gulp.task('images', ['clean-images'], function () {
    log('Copying and compressing the images');

    return gulp
        .src(config.images)
        .pipe(imagemin({optimizationLevel: 4}))
        .pipe(gulp.dest(config.bImages));
});

// Copying Fonts to Build Folder
gulp.task('fonts', ['clean-fonts'], function () {
    log('Copying fonts');

    return gulp
        .src(config.fonts)
        .pipe(gulp.dest(config.bFonts));
});

// Cleaning all assets and styles
gulp.task('clean-ALL', function () {
    var delconfig = [].concat([config.build + 'assets/**',
        config.build + '!assets/'], config.css);
    log('Cleaning: ' + util.colors.blue(delconfig));
    del(delconfig);
    log('Cleaning Done');
});

// Cleaning Fonts
gulp.task('clean-fonts', function () {
    clean(config.bFonts + '**/*.*');
    log('Fonts Deleted');
});

// Cleaning Images
gulp.task('clean-images', function () {
    clean(config.bImages + '**/*.*');
    log('Images Deleted');
});

// Cleaning Styles
gulp.task('clean-styles', function () {
    clean(config.css);
    log('Styles Deleted');
});

// Vetting JS
gulp.task('vet', function () {
    log('Analizing source with JSHint and JSCS');

    return gulp
        .src(config.alljs)
        .pipe(gulpif(args.verbose, print()))
        .pipe(jscs())
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish', {verbose: true}))
        .pipe(jshint.reporter('fail'));
});

function injectSrc(src,dest) {
    var options = config.getWiredepDefaultOptions();
    var wiredep = require('wiredep').stream;
    // var injections = 'injectApp'

    return gulp
        .src(src)
        .pipe(wiredep(options))
        .pipe(inject(gulp.src(config.injectSrc), config.injectOptions))
        .pipe(gulp.dest(dest));
}

// Injecting Dependencies in index.pug
gulp.task('wiredep', function () {
    log('Wire up the bower css js and our app js into the html');

    injectSrc(config.injectApp.link.src,config.injectApp.link.dest);
    injectSrc(config.injectApp.scripts.src,config.injectApp.scripts.dest);
    injectSrc(config.injectBower.link.src,config.injectBower.link.dest);
    injectSrc(config.injectBower.scripts.src,config.injectBower.scripts.dest);

    // return gulp
    //     .src(config.index)
    //     .pipe(wiredep(options))
    //     .pipe(inject(gulp.src(config.injectSrc), config.injectOptions))
    //     .pipe(gulp.dest(config.app));
});

// Injecting CSS in index.pug
gulp.task('inject', ['wiredep', 'styles'], function () {
    log('Wire up the app css into the html, and call wiredep ');

    return gulp
        .src(config.injectApp.link.src)
        .pipe(inject(gulp.src(config.css + 'master.css'), config.injectOptions))
        .pipe(gulp.dest(config.injectApp.link.dest));
});

// Starting Server
gulp.task('serve-dev', ['build-pug','build-scripts','inject','watch-pug','watch-scripts','watch-docs-todo'], function () {
    var isDev = true;

    var nodeOptions = {
        script: config.nodeServer,
        delayTime: 1,

        env: {
            'PORT': port,
            'NODE_ENV': isDev ? 'dev' : 'build'
        },
        watch: [config.server]
    };

    return nodemon(nodeOptions)
        .on('restart', function (ev) {
            log('*** nodemon restarted');
            log('files changed on restart:\n' + ev);
            setTimeout(function () {
                browserSync.notify('reloading now ...');
                browserSync.reload({stream: false});
            }, config.browserReloadDelay);
        })
        .on('start', function () {
            log('*** nodemon started');
            startBrowserSync();
        })
        .on('crash', function () {
            log('*** nodemon crashed: script crashed for some reason');
        })
        .on('exit', function () {
            log('*** nodemon exited cleanly');
        });
});


////////////////////////////////////////////////////////////////////////////////
// Functions ///////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// Cleaning Files
function clean(path) {
    log('Cleaning: ' + util.colors.blue(path));
    del(path);
}

// Watching on chage
function changeEvent(event) {
    var srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
    log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
}

// Starting BrowserSync
function startBrowserSync() {
    if (args.nosync || browserSync.active) {
        return;
    }

    log('Starting browser-sync on port ' + port);

    gulp.watch([config.watchSCSS], ['styles'])
        .on('change', function (event) {
            changeEvent(event);
        });

    var options = {
        proxy: 'localhost:' + port,
        port: 3000,
        files: [
            '!' + config.app + '**/*.*',
            '!' + config.watchSCSS,
            config.build + '*.html',
            '!' + config.css + '*.css'
        ],
        ghostMode: {
            clicks: true,
            location: false,
            forms: true,
            scroll: true
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'debug',
        logPrefix: 'gulp-patterns',
        notify: true,
        reloadDelay: 0 //1000
    };

    browserSync(options);
}


// Message Logger
function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                util.log(util.colors.blue(msg[item]));
            }
        }
    } else {
        util.log(util.colors.blue(msg));
    }
}

////////////////////////////////////////////////////////////////////////////////
// Deprecated tasks ////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// 8.24.17
// Watching Pug
// gulp.task('watch-pug', function () {
//     log('Watching Pug');
//
//     gulp.watch([config.pug.index.watch], function () {
//         pugTask(config.pug.index.src, config.pug.index.base, config.pug.index.dest)
//             .on('change', function (event) {
//                 changeEvent(event);
//             });
//     });
//
//     gulp.watch([config.pug.home.watch], function () {
//         pugTask(config.pug.home.src, config.pug.home.base, config.pug.home.dest)
//             .on('change', function (event) {
//                 changeEvent(event);
//             });
//     });
//
//     gulp.watch([config.pug.about.watch], function () {
//         pugTask(config.pug.about.src, config.pug.about.base, config.pug.about.dest)
//             .on('change', function (event) {
//                 changeEvent(event);
//             });
//     });
//
//     gulp.watch([config.pug.skills.watch], function () {
//         pugTask(config.pug.skills.src, config.pug.skills.base, config.pug.skills.dest)
//             .on('change', function (event) {
//                 changeEvent(event);
//             });
//     });
//
//     gulp.watch([config.pug.contact.watch], function () {
//         pugTask(config.pug.contact.src, config.pug.contact.base, config.pug.contact.dest)
//             .on('change', function (event) {
//                 changeEvent(event);
//             });
//     });
//
//     gulp.watch([config.pug.projects.watch], function () {
//         pugTask(config.pug.projects.src, config.pug.projects.base, config.pug.projects.dest)
//             .on('change', function (event) {
//                 changeEvent(event);
//             });
//     });
// });



// 8.24.17
/* Watch Pug Content --------------------------------------------------------*/

// gulp.watch([config.pug.index.watch], function () {
//     pugTask(config.pug.index.src, config.pug.index.base).on('change', function (event) {
//         changeEvent(event);
//     });
// });
//
// gulp.watch([config.pug.home.watch], function () {
//     pugTask(config.pug.home.src, config.pug.home.base).on('change', function (event) {
//         changeEvent(event);
//     });
// });
//
// gulp.watch([config.pug.about.watch], function () {
//     pugTask(config.pug.about.src, config.pug.about.base).on('change', function (event) {
//         changeEvent(event);
//     });
// });
//
// gulp.watch([config.pug.skills.watch], function () {
//     pugTask(config.pug.skills.src, config.pug.skills.base).on('change', function (event) {
//         changeEvent(event);
//     });
// });
//
// gulp.watch([config.pug.contact.watch], function () {
//     pugTask(config.pug.contact.src, config.pug.contact.base).on('change', function (event) {
//         changeEvent(event);
//     });
// });
//
// gulp.watch([config.pug.projects.watch], function () {
//     pugTask(config.pug.projects.src, config.pug.projects.base).on('change', function (event) {
//         changeEvent(event);
//     });
// });

/* end of pug --------------------------------------------------------*/

// 9.1.17
// Watching files for changes
// gulp.task('watch', function () {
//     gulp.watch([config.watchSCSS], ['styles']);
//
//     gulp.watch('./*.js', ['vet']);
//     gulp.watch('app/assets/images/*', ['images']);
//     gulp.watch('app/assets/fonts/*', ['fonts']);
// });


// 9.5.17
// Watching Pug
// gulp.task('watch-pug', function () {
//     log('Watching Pug');
//
//     function extPug(fileName) {
//         var src = config.pug[fileName].src;
//         var base = config.pug[fileName].base;
//         var dest = config.pug[fileName].dest;
//
//         pugTask(src,base,dest).on('change', function(event) {
//             changeEvent(event);
//         });
//     }
//
//     gulp.watch([config.pug.index.watch],function(){extPug('index');});
//     // gulp.watch([config.pug.mod1.watch],function(){extPug('mod1');});
//     // gulp.watch([config.pug.path2.watch],function(){extPug('path2');});
//     // gulp.watch([config.pug.path3.watch],function(){extPug('path3');});
// });


// 9.5.17
// Watching Scripts
// gulp.task('watch-scripts', function () {
//     log('Watching Scripts');
//
//     function extScript(fileName) {
//         var src = config.pug[fileName].src;
//         var base = config.pug[fileName].base;
//
//         scriptsTask(src, base).on('change', function (event) {
//             changeEvent(event);
//         });
//     }
//
//     gulp.watch([config.scripts.app.watch],function(){watchTask('script','app')});
//     gulp.watch([config.scripts.service.watch],function(){watchTask('script','service')});
//     // gulp.watch([config.scripts.mod1.watch],function(){extScript('mod1')});
//     // gulp.watch([config.scripts.path2.watch],function(){extScript('path2')});
//     // gulp.watch([config.scripts.path3.watch],function(){extScript('path3')});
// });


// 9.7.17
// This will set the number of pages for the app
// var numOfPages = 0;
//
// // Watching All
// gulp.task('watch-ALL', function () {
//
//     for (var i=0; i < numOfPages; i++) {
//         var premod = 'mod' + i;
//         var mod = eval(premod);
//
//         var pugConfig = config.pug[mod].watch;
//         var scriptConfig = config.scripts[mod].watch;
//
//         log('Watching Pug');
//         gulp.watch([pugConfig],function(){watchTask('pug', mod);});
//
//         log('Watching Scripts');
//         gulp.watch([scriptConfig],function(){watchTask('script', mod)});
//     }
//
//     // Watch task for pug
//     (function () {
//         log('Watching Pug');
//         var fileType = 'pug';
//
//         gulp.watch([config.pug.index.watch],function(){watchTask(fileType,'index');});
//         // gulp.watch([config.pug.mod1.watch],function(){watchTask(fileType,'mod1');});
//
//     })();
//
//     // Watch task for scripts
//     (function () {
//         log('Watching Scripts');
//         var fileType = 'script';
//
//         gulp.watch([config.scripts.app.watch],function(){watchTask(fileType,'app')});
//         gulp.watch([config.scripts.service.watch],function(){watchTask(fileType,'service')});
//         // gulp.watch([config.scripts.mod1.watch],function(){watchTask(fileType,'mod1')});
//
//     })();
// });