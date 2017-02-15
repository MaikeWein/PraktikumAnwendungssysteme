var gulp = require('gulp');
var bowerFiles = require('main-bower-files'),
    inject = require('gulp-inject'),
    es = require('event-stream');
var angularFilesort = require('gulp-angular-filesort');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var apidoc = require('gulp-apidoc');
var concat = require('gulp-concat');
var watch = require('gulp-watch');


gulp.task('apidocProtectedApiCore',function(done){
    apidoc({
        src: "server/restfulapi/core",
        dest: "client/app/apidocumentation/apidocumentationcore",
        template: "client/apitemplate",
        debug: true
    },done);
});


gulp.task('apidocProtectedApiCustom',function(done){
    apidoc({
        src: "server/restfulapi/custom",
        dest: "client/app/apidocumentation/apidocumentationcustom",
        template: "client/apitemplate",
        debug: true
    },done);
});

gulp.task('apidocPublicApiCore',function(done){
    apidoc({
        src: "server/publicapi/core",
        dest: "client/app/apidocumentation/apipublicdocumentationcore",
        template: "client/apitemplate",
        debug: true
    },done);
});

gulp.task('apidocPublicApiCustom',function(done){
    apidoc({
        src: "server/publicapi/custom",
        dest: "client/app/apidocumentation/apipublicdocumentationcustom",
        template: "client/apitemplate",
        debug: true
    },done);
});

gulp.task('apidocRealtimeApiCore',function(done){
    apidoc({
        src: "server/socketapi/core",
        dest: "client/app/apidocumentation/apirealtimemsgdocumentationcore",
        template: "client/apitemplaterealtime",
        debug: true
    },done);
});
gulp.task('apidocRealtimeApiCustom',function(done){
    apidoc({
        src: "server/socketapi/custom",
        dest: "client/app/apidocumentation/apirealtimemsgdocumentationcustom",
        template: "client/apitemplaterealtime",
        debug: true
    },done);
});

gulp.task('LinkAdd', function() {

    gulp.src('web/index.html')
        .pipe(inject(gulp.src(bowerFiles(),{ base: 'web/lib'}), {name: 'bower',transform: function(filepath, file){


            if(filepath.match(/\.css/i) != null){

                return ' <link rel="stylesheet" type="text/css" href="' + filepath.replace("web","") + '">';

            }else{

                return '<script src="' + filepath.replace("web","") + '"></script>';
            }
        }}))

        .pipe(inject(es.merge(
            gulp.src(['web/css/**/*.css'])
        ), {transform: function(filepath, file){


            return '<link rel="stylesheet" type="text/css" href="' + filepath.replace("web","") + '">';

        }}))

        .pipe(inject(es.merge(
            gulp.src(['web/js/**/*.js']).pipe(angularFilesort())
        ), {transform: function(filepath, file){

            return '<script src="' + filepath.replace("web","") + '"></script>';

        }}))
        .pipe(gulp.dest('web'));
});







//    var cssTask = gulp.src('_public/template/**/*.scss')
/*
gulp.task('sass', function () {

    var options = {
        errLogToConsole: true
    };

        options.outputStyle = 'expanded';
        options.sourceComments = 'map';


        .pipe(sass(options));



        cssTask.pipe(minifyCSS());

    cssTask.pipe(gulp.dest('_public/css'));

});*/






gulp.task('sass', function() {
    gulp.src('./client/app/templates/**/*.scss','./client/app/index.scss')
        .pipe(sass())
        .pipe(concat('style.css')) // this is what was missing
        .pipe(gulp.dest('client/app/css/')); // output to theme root
});

gulp.task('sass:watch', function () {

    return watch(['./client/app/**/*.scss'], function () {
        gulp.src(['./client/app/templates/**/*.scss','./client/app/index.scss'])
            .pipe(sass())
            .pipe(concat('style.css')) // this is what was missing
            .pipe(gulp.dest('client/app/css/')); // output to theme root
    });
});




















// Rerun the task when a file changes 
gulp.task('watch', function() {
 var all =   gulp.watch('_public/**/**.*', ['LinkAdd']);

    function changeNotification(event) {
        console.log('File', event.path, 'was', event.type, ', running tasks...');
    }

    all.on('change', changeNotification);

});




// The default task (called when you run `gulp` from cli) 
gulp.task('default', ['watch', 'LinkAdd']);