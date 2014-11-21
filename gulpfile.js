var gulp = require("gulp");
var ts = require("gulp-typescript");
var jasmine = require("gulp-jasmine");
var eventStream = require("event-stream");
var rename = require("gulp-rename");
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
        .pipe(ts(tsAMD))
        .js.pipe(rename("dashthis-uuid.js"))
        .pipe(gulp.dest("dist/AMD"));

    var commonJSStream = gulp.src(["src/**/*.ts"])
        .pipe(ts(tsCommonJS))
        .js.pipe(rename("dashthis-uuid.js"))
        .pipe(gulp.dest("dist/CommonJS"));

    var defStream = gulp.src("src/uuid.d.ts")
        .pipe(rename("dashthis-uuid.d.ts"))
        .pipe(gulp.dest("dist/defs"));

    return eventStream.merge(
        amdStream,
        commonJSStream,
        defStream);
});

gulp.task("test", ["build"], function () {
    return gulp.src(["tests/**/*.spec.js"])
        .pipe(jasmine({ includeStackTrace: false }));
});

gulp.task("watch", ["test"], function () {
    gulp.watch(["src/**/*.ts", "tests/**/*.spec.js"], ["test"]);
});