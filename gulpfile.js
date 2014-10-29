var gulp = require("gulp");
var ts = require("gulp-typescript");
var jasmine = require("gulp-jasmine");
var eventStream = require("event-stream");
var del = require("del");

var tsCommonJS = ts.createProject({
    module: "CommonJS",
    target: "ES5",
    declarationFiles: true
});

var tsAMD = ts.createProject({
    module: "AMD",
    target: "ES5",
    declarationFiles: true
});

gulp.task("clean", function() {
    del.sync("dist/**");
});

gulp.task("build", ["clean"], function() {
    var amdStream = gulp.src(["src/**/*.ts"])
        .pipe(ts(tsAMD));
    var commonJSStream = gulp.src(["src/**/*.ts"])
        .pipe(ts(tsCommonJS));

    return eventStream.merge(
        amdStream.js.pipe(gulp.dest("dist/AMD")),
        commonJSStream.js.pipe(gulp.dest("dist/CommonJS")),
        gulp.src("src/**/*.d.ts").pipe(gulp.dest("dist/defs")));
});

gulp.task("test", ["build"], function () {
    return gulp.src(["tests/**/*.spec.js"])
        .pipe(jasmine({ includeStackTrace: false }));
});

gulp.task("watch", ["test"], function () {
    gulp.watch(["src/**/*.ts", "tests/**/*.spec.js"], ["test"]);
});