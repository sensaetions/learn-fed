// fix for autoprefixer
require('es6-promise').polyfill();

// Plugins
var autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync'),
    combineMq = require('gulp-combine-mq'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    connectPhp = require('gulp-connect-php'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    imagemin = require('gulp-imagemin'),
    notify = require('gulp-notify'),
    pixrem = require('gulp-pixrem'),
    plumber = require('gulp-plumber'),
    reload = browserSync.reload,
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    sassGlob = require('gulp-sass-glob'),
    sourcemaps = require('gulp-sourcemaps'),
    svgmin = require('gulp-svgmin'),
    svgsymbols = require('gulp-svg-symbols'),
    watch = require('gulp-watch');


var config = {
    input: {
        images: 'images/*.{png,jpg,jpeg,gif}',
        markup: [
            '*.php',
            '**/*.php',
        ],
        sass: 'sass/**/*.scss',
        scripts: [
            'bower_components/jquery/dist/jquery.js',
            'bower_components/matchHeight/dist/jquery.matchHeight.js',
            'scripts/rainbow.offcanvas.1.4.3.min.js',
            'scripts/jquery.infieldlabel.min.js',
            'scripts/smooth-scroll.js',
            'scripts/functions.js'
        ],
        svg: 'images/svg/*.svg'
    },
    output: {
        images: 'dist/images',
        scripts: 'dist/scripts',
        styles: 'dist/styles'
    }
}


// PLUGIN OPTIONS
var sassOptions = {
    errLogToConsole: true,
    includePaths: [
        'bower_components/susy/sass',
        'bower_components/breakpoint-sass/stylesheets',
        'bower_components/normalize-css/'],
    outputStyle: 'expanded',
    //sourceComments: 'false'
};
var autoprefixerOptions = {
    browsers: ['last 2 versions', '> 1%', 'ie 8', 'ie 9']
};
var combineMqOptions = {
    beautify: true
};
var sourceMapOptions = {
    loadMaps: true
}


// BEGIN TASKS
gulp.task('markup', function () {
    return gulp.src(config.input.markup)
        .pipe(plumber({
            errorHandler: notify.onError('Error: <%= error.message %>')
        }))
        .pipe(reload({
            stream: true
        }));
})

gulp.task('styles', function () {
    return gulp.src(config.input.sass)
        .pipe(sassGlob())
        .pipe(sourcemaps.init(sourceMapOptions))
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(combineMq(combineMqOptions))
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(pixrem())
        .pipe(sourcemaps.write('/maps'))
        .pipe(plumber({
            errorHandler: notify.onError('Error: <%= error.message %>')
        }))
        .pipe(gulp.dest(config.output.styles))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('images', function (done) {
    return gulp.src(config.input.images)
        .pipe(imagemin())
        .pipe(plumber({
        errorHandler: notify.onError('Error: <%= error.message %>')
    }))
        .pipe(gulp.dest(config.output.images));
});


gulp.task('svg', function () {
    return gulp.src(config.input.svg)
        .pipe(svgmin())
        .pipe(svgsymbols({
            templates: ['default-svg', 'default-css']
        }))
        .pipe(browserSync.reload({
            stream: true
        }))
        .pipe(plumber({
            errorHandler: notify.onError('Error: <%= error.message %>')
        }))
        .pipe(gulp.dest(config.output.images));
});

gulp.task('scripts', function () {
    return gulp.src(config.input.scripts)
        .pipe(concat('bundle.js'))
        .pipe(plumber({
            errorHandler: notify.onError('Error: <%= error.message %>')
        }))
        .pipe(gulp.dest(config.output.scripts))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('connect', function () {
    connect.server({
        root: '',
        livereload: true
    });
});

gulp.task('connectPhp', function () {
    connectPhp.server({
        hostname: '0.0.0.0',
        port: 8000,
        base: '',
    });
});

gulp.task('connectSync', ['connectPhp'], function () {
    connectPhp.server({}, function () {
        browserSync({
            proxy: 'localhost:8000',
            open: {
                browser: 'Google Chrome'
            }
        });
    });

    gulp.watch(config.input.markup).on('change', function () {
        browserSync.reload();
    });
});

// run 'default' task before running watch
gulp.task('watch', function () {
    gulp.watch(config.input.markup, ['markup']);
    gulp.watch(config.input.sass, ['styles']);
    gulp.watch(config.input.scripts, ['scripts']);
    gulp.watch(config.input.images, ['images']);
    gulp.watch(config.input.svg, ['svg']);
});

// Default task
gulp.task('dynamic', ['markup', 'styles', 'images', 'svg', 'scripts', 'connectSync', 'watch']);
gulp.task('default', ['dynamic']);
