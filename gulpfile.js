var gulp = require("gulp");
var ts = require("gulp-typescript");
var jasmine = require("gulp-jasmine");

gulp.task("build", function() {
    return gulp.src(["src/**/*.ts"])
        .pipe(ts({
            module: "CommonJS",
            target: "ES5"
        }))
        .js.pipe(gulp.dest("dist/CommonJS"));
});

gulp.task("test", ["build"], function () {
    return gulp.src(["tests/**/*.spec.js"])
        .pipe(jasmine({ includeStackTrace: false }));
});