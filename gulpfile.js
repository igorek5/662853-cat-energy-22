const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const csso = require("postcss-csso");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const terser = require('gulp-terser');
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const del = require("del");

// Styles

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/js/**/*.js", gulp.series(scripts));
  gulp.watch("source/*.html", gulp.series(html, reload));
}

exports.default = gulp.series(
  styles, server, watcher
);

// HTML

const html = () => {
  return gulp.src("source/**/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'));
}

exports.html = html;

// js

const scripts = () => {
  return gulp.src("source/js/**/*.js")
    .pipe(terser())
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest("build/js"))
    .pipe(sync.stream());
}

exports.scripts = scripts;

// images

const optimizeImages = () => {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.mozjpeg({progressive: true}),
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"))
}

exports.images = optimizeImages;

const copyImages = () => {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(gulp.dest("build/img"))
}

exports.images = copyImages;

//Webp

const createWebp = () => {
  return gulp.src("source/img/**/*.{jpg,png}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/img"))
}

exports.createWebp = createWebp;

// sprite

const sprite = () => {
  return gulp.src("source/img/svg/icons/*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img/svg"));
}

exports.sprite = sprite;

// Copy

const copy = (done) => {
  gulp.src([
    "source/fonts/*.{woff2,woff}",
    "source/*.ico",
    "source/img/**/*.svg",
    "source/favicons.webmanifest",
    "!source/img/icons/*.svg"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"))
  done();
}

exports.copy = copy;

// Reload

const reload = (done) => {
  sync.reload();
  done();
}

// Clean

const clean = () => {
  return del("build");
};

//build

const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    sprite,
    createWebp
  ),
);

exports.build = build;

// Default

exports.default = gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    sprite,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  ));
