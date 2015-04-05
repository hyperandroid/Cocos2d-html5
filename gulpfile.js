var gulp = require('gulp');

var concat = require('gulp-concat');
var uglify = require('gulp-uglifyjs');
var beautify = require('gulp-beautify');
var jshint = require('gulp-jshint');

var scripts= [
        "js/Boot.js",

    "js/util/Debug.js",
    "js/locale/Locale.js",

        "js/math/Color.js",
        "js/math/Matrix3.js",
        "js/math/Matrix4.js",
        "js/math/Point.js",
        "js/math/Rectangle.js",
        "js/math/Dimension.js",
        "js/math/path/Segment.js",
        "js/math/path/SegmentLine.js",
        "js/math/path/BezierTracer.js",
        "js/math/path/SegmentQuadratic.js",
        "js/math/path/SegmentBezier.js",
        "js/math/path/SegmentArc.js",
        "js/math/path/SegmentCardinalSpline.js",
        "js/math/path/ContainerSegment.js",
        "js/math/path/Subpath.js",
        "js/math/path/geometry/StrokeGeometry.js",
        "js/math/path/geometry/EarCut.js",
        "js/math/Path.js",
        "js/math/Shape.js",
        "js/node/Node.js",

        "js/action/Action.js",
        "js/action/TimeInterpolator.js",
        "js/action/AlphaAction.js",
        "js/action/MoveAction.js",
        "js/action/PropertyAction.js",
        "js/action/RotateAction.js",
        "js/action/ScaleAction.js",
        "js/action/SequenceAction.js",
        "js/action/TintAction.js",
        "js/action/AnimateAction.js",
        "js/action/PathAction.js",
        "js/action/JumpAction.js",
        "js/action/ActionManager.js",
        "js/action/SchedulerQueue.js",
        "js/action/ActionChainContext.js",

        "js/util/Measure.js",

        "js/node/Scene.js",
        "js/node/Director.js",
        "js/render/Texture2D.js",
        "js/node/sprite/SpriteFrame.js",
        "js/node/sprite/Animation.js",
        "js/node/Sprite.js",
        "js/node/FastSprite.js",

        "js/widget/Button.js",
        "js/widget/Label.js",

        "js/render/WebGLState.js",
        "js/transition/Transition.js",
        "js/render/shader/Uniform.js",
        "js/render/shader/Attribute.js",
        "js/render/shader/AbstractShader.js",
        "js/render/shader/SolidColorShader.js",
        "js/render/shader/TextureShader.js",
        "js/render/shader/TexturePatternShader.js",
        "js/render/shader/FastTextureShader.js",
        "js/render/shader/Buffer.js",
        "js/render/Renderer.js",
        "js/render/RenderingContext.js",
        "js/render/RenderingContextSnapshot.js",
        "js/render/GeometryBatcher.js",
        "js/render/DecoratedWebGLRenderingContext.js",
        "js/render/ScaleManager.js",
        "js/render/RenderUtil.js",
        "js/render/mesh/Mesh.js",

        "js/util/util.js",

        "js/transition/Transition.js",

        "js/plugin/loader/Resource.js",
        "js/plugin/loader/ResourceLoader.js",
        "js/plugin/loader/ResourceLoaderImage.js",
        "js/plugin/loader/ResourceLoaderJSON.js",
        "js/plugin/loader/ResourceLoaderAudioBuffer.js",
        "js/plugin/loader/Loader.js",
        "js/plugin/texture/TexturePacker.js",
        "js/plugin/font/SpriteFont.js",
        "js/plugin/font/SpriteFontHelper.js",
        "js/plugin/asset/AssetManager.js",
        "js/plugin/audio/AudioManager.js",
        "js/plugin/layout/LayoutManager.js",

        "js/input/InputManager.js",
        "js/input/MouseInputManager.js",
        "js/input/KeyboardInputManager.js",

        "js/game/Game.js",

        // backwards compatibility
        "js/action_bc/Action.js",
        "js/action_bc/ActionV2.js",
        "js/node/NodeV3.js",
        "js/plugin/asset/AssetManagerV3.js",

        "js/util/Class.js"


    ];

function toTS( scripts ) {
    var ret= [];
    scripts.map( function(v) {

        // replace js with src and .js with .ts.
        ret.push(v.replace( /\.js$/, ".ts").replace( /^js/, "src"));
    });

    return ret;
}

/**
 * Create a single all.ts file for compilation.
 */
gulp.task('concat-ts', function() {
    return gulp.src( toTS(scripts), {base: 'src/' })
        .pipe(concat('all.ts'))
        .pipe(gulp.dest('dist'));
});

gulp.task('uglify-js', function() {
    return gulp.src( ["dist/all.js"], {base: 'dist/'} )
        .pipe(uglify("all.min.js",
            {
                outSourceMap: true,
                mangle : false,
                basePath : "dist"
            }))
        .pipe(gulp.dest('dist'));
});



gulp.task('scripts', function() {
    return gulp.src( scripts, {base: 'js/' })
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('uglify', function() {
    return gulp.src( scripts, {base: 'js/'} )
        .pipe(uglify("all.min.js",
            {
                outSourceMap: true,
                mangle : false,
                basePath : "dist"
            }))
        .pipe(gulp.dest('dist'));
});

gulp.task('beautify', function() {
    return gulp.src( ["dist/all.min.js"] )
        .pipe(beautify({indentSize: 2}))
        .pipe(gulp.dest('dist/lib'));
});

gulp.task('lint', function() {
    return gulp.src('js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


// Rerun the task when a file changes
gulp.task('watch', function() {
    gulp.watch(scripts, ['scripts', 'uglify']);
});


gulp.task('default', ['lint','scripts', 'uglify']);
