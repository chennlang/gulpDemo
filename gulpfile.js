var gulp = require('gulp');
var connect = require('gulp-connect');
// css
var less = require('gulp-less') // 引入压缩less模板
var cleanCSS = require('gulp-clean-css');// 压缩css
var concat = require('gulp-concat');// 合并文件
var del = require('del');// 删除文件
var uglify = require('gulp-uglify');// 压缩js
var babel = require('gulp-babel');// es6转es5

var postcss = require('gulp-postcss');// 是一个插件，将现代css语法转换成兼容语法
var px2rem = require('postcss-px2rem');
var autoprefixer = require('autoprefixer');// 自动补全-moz -0 -webkit,处理浏览器私有前缀
var cssnext = require('cssnext');// 使用CSS未来的语法
var precss = require('precss'); // 像Sass的函数



var PATHS = {
    _static_: './src/static/', // 静态资源目录
    _DIST_: './dist/project/',// 打包后的目录
    _pages_:'./src/pages/', // 页面
    _lib_:'./lib/' 
};

var Config = {
	lib: {
        src:PATHS._lib_ + '**/*',
        dist: PATHS._DIST_ + 'lib'
    },
    html: {
        src: PATHS._pages_ + '**/*.html',
        dist: PATHS._DIST_ + 'pages'
    },
    less: {
        src: PATHS._static_ + 'css/**/*.less',
        dist: PATHS._DIST_ + 'static/css/',
    },
    scripts: {
        src: PATHS._static_ + 'js/**/*.js',
        dist: PATHS._DIST_ + 'static/js/',
    },
    img: {
        src: PATHS._static_ + 'images/**/*',
        dist: PATHS._DIST_ + 'static/images'
    },
    font: {
        src: PATHS._static_ + 'fonts/**/*',
        dist: PATHS._DIST_ + 'static/fonts',
    }
}
// gulp clear可以删除打包后的目录
gulp.task('clear', function () {
	del([
    	PATHS._DIST_
  ]);
});

gulp.task('less', function () {                   // 创建gulp任务
	// 加入处理的插件
	var processors = [
      autoprefixer({browsers: ['last 20 versions','Android >= 4.0','> 5%','ie >8']}),
      px2rem({                                    // px 转 rem
        remUnit: 75
      }),
      cssnext, 
      precss,
    ];

    return gulp.src('src/static/css/*.less')         // 获取多个less文件路径
    	.pipe(less())
        .pipe(postcss(processors))　　　　　　　　   // 执行less
        // .pipe(cleanCSS())                       // 压缩
        // .pipe(concat('main.css'))               // 合并css名为main.css
        .pipe(gulp.dest(Config.less.dist))       // 输出CSS文件路径
        .pipe(connect.reload())                  // 更新
});

gulp.task('allJs', function () {
    //打包所有js
    return gulp.src(Config.scripts.src)
    	// .pipe(uglify())                       // 压缩
        // .pipe(concat('main.js'))              // 合并js,名为main.js
        .pipe(babel())                           // es6 转 es5
        .pipe(gulp.dest(Config.scripts.dist))
        .pipe(connect.reload())
})

gulp.task('allPages', function () {
    //打包所有html
    return gulp.src(Config.html.src)
        .pipe(gulp.dest(Config.html.dist))
        .pipe(connect.reload())
})

gulp.task('fonts', function () {
    return gulp.src(Config.font.src)
        .pipe(gulp.dest(Config.font.dist))
        .pipe(connect.reload())
});
gulp.task('images', function () {
    return gulp.src(Config.img.src)
        .pipe(gulp.dest(Config.img.dist))
        .pipe(connect.reload())
});

gulp.task('watch',function(){                  // 这里监听src下的文件发生变化,就全部重新打包
    gulp.watch('./src/**/*',['update']);
})

gulp.task('webserver', function() {
    connect.server({
        livereload: true,
        port: 3333
    });
});
gulp.task('update',['less', 'allJs', 'allPages', 'fonts', 'images'])

gulp.task('default',['webserver', 'less', 'allJs', 'allPages', 'fonts', 'images', 'watch'])
