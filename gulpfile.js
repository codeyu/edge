var gulp = require('gulp');
var del = require('del');
var chalk = require('chalk');
var run = require('gulp-run');
var bump = require('gulp-bump');
var sequence = require('run-sequence');
var merge = require('merge2');

var paths = {
    src: ['src/**', 'test/**', './*.ts', 'typings/*.d.ts'],
    out: './lib',
    test: './lib/test/**/*.js',
    publish: './publish',
    coverage: './coverage',
};

gulp.task('package_clean', function() {
    var clean = [paths.publish + '/**/*'];
    console.log(chalk.blue('Cleaning ' + clean));
    return del(clean);
});

gulp.task('package_copy', function() {
    return merge(
        gulp.src(['./README.md', './package.json', './LICENSE.txt']).pipe(gulp.dest(paths.publish)),
        gulp.src(['./lib/**/*']).pipe(gulp.dest(paths.publish + '/lib'))
        );
});

gulp.task('package_npm', function() {
    run('npm publish --access public ' + paths.publish).exec();
});

gulp.task('package_bump', function() {
    return gulp.src('./package.json')
        .pipe(bump())
        .pipe(gulp.dest('./'));
});

gulp.task('package_pack', function() {
    run('npm pack ' + paths.publish).exec();
});

gulp.task('pack', function() {
    sequence('package_clean', 'package_copy', 'package_pack');
});

gulp.task('publish', function() {
    sequence('package_clean', 'package_copy', 'package_npm', 'package_bump');
});
