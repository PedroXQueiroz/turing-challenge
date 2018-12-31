var gulp = require('gulp');
var watch = require('gulp-watch');
var spawn = require('child_process').exec;

gulp.task('watch', () => {
    return watch('src/**/*.*', () => {
        console.log('rebuilding');
        spawn('npm run build', (err, output, outErr) => {
            if(err){
                console.log("ERROR ------------------------------------")
                console.log(err);
            }
            
            if(output){
                console.log("OUT ------------------------------------");
                console.log(output)
            }
        });
    });
});