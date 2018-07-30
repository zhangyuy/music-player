var gulp = require("gulp");
var imagemin = require("gulp-imagemin");
var newer = require("gulp-newer");
var htmlclean = require("gulp-htmlclean")
var uglify  = require("gulp-uglify")
var debug = require("gulp-strip-debug")
var concat = require("gulp-concat");
var less = require("gulp-less");
var postcss = require("gulp-postcss")
var autoprefixer = require("autoprefixer");
var cssnano = require("cssnano")
var connect = require("gulp-connect")

var devMode = process.env.NODE_ENV == 'development';
var folder = {       //文件变量
    src:"./src/",
   dist:"./dist/"
}

gulp.task("images",function () {
    gulp.src(folder.src + "images/*")
        .pipe(newer(folder.dist + "images")) //监听folder.build文件，不重复压缩
        .pipe(imagemin())      //压缩图片
        .pipe(gulp.dest(folder.dist+ "images"))
})
gulp.task("html",function () {
    var page = gulp.src(folder.src + "html/*")
        page.pipe(connect.reload())
        if(!devMode){
        page.pipe(htmlclean())   //压缩html代码
        }
        page.pipe(gulp.dest(folder.dist + "html"))
})
gulp.task("js",function () {
    var page = gulp.src(folder.src + "js/*")
        page.pipe(connect.reload())
        if(!devMode){
            page.pipe(debug())  //去掉运行环境中的调试代码
            page.pipe(uglify())     //压缩js文件
        }
        page.pipe(gulp.dest(folder.dist + "js"))
})
gulp.task("css",function () {
    var options = [autoprefixer()]
    var page = gulp.src(folder.src + "css/*")
                    .pipe(connect.reload())
                    .pipe(less()) //将less文件转成css文件
        if(!devMode){
            options.push(cssnano())  //在转成css文件后进行前缀添加，压缩
        }
        page.pipe(postcss(options))
        page.pipe(gulp.dest(folder.dist + "css"))
})

gulp.task("watch",function () {
    gulp.watch(folder.src + "html/*",["html"]);
    gulp.watch(folder.src + "images/*",["images"]);
    gulp.watch(folder.src + "css/*",["css"]);
    gulp.watch(folder.src + "js/*",["js"]);
})
gulp.task("server",function () {
    connect.server({
        livereload:true
    })
})
gulp.task("default",["html","images","js","css","watch","server"])