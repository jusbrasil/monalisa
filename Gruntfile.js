var spawn = require('child_process').spawn,
    fs = require('fs');

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')

    ,sass: {
      base: {
        options: { style: 'expanded' },
        files: { 'dist/css/general.css': 'scss/general.scss' },
      }
      ,gh_app: {
        options: {
          style: 'expanded'
        },
        files: [{
          expand: true,
          cwd:'scss/app/',
          src: ['*.scss'],
          dest: 'docs/dist/css/app/',
          ext: '.css'
        }]
      }
    }

    ,watch: { // Watchs file modifications
      css: {
        files: '**/*.scss',
        tasks: [
          'sass',
          'copy:dist',
          'jekyll:restart'
        ]
      },
      jekyll_html: {
        files: 'docs/**/*.html',
        tasks: [
          'jekyll:restart'
        ]
      },
    }

    ,browserSync: { // Browser Sync to live reload
      bsFiles: {
        src : ['dist/css/*.css', 'dist/js/*.js', '*.html']
      },
      options: {
        watchTask: true,
        server: {
          baseDir: "./docs"
        }
      }
    }

    ,cssmetrics: {
      dev: {
        src: [
          'dist/css/general.min.css'
        ]
      }
    }

    ,cssc: {
      build: {
        options:{
          sortSelectors: true,
          lineBreaks: true,
          sortDeclarations: true,
          consolidateViaDeclarations: false,
          consolidateViaSelectors: false,
          consolidateMediaQueries: true
        },
        files: {
          'dist/css/general.min.css': 'dist/css/general.css'
        }
      }
    }

    ,copy: {
      dist: {
        src: 'dist/**',
        dest: 'docs/'
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-css-metrics');
  grunt.loadNpmTasks('grunt-cssc');

  grunt.registerTask('default', ['cssmetrics', 'browserSync', 'watch']);
  grunt.registerTask('build', ['sass', 'cssc', 'cssmetrics', 'copy:dist']);
  grunt.registerTask('server', ['build', 'jekyll', 'watch']);

  grunt.registerTask('jekyll', function(){
    var done = this.async(),
        outStream = fs.createWriteStream('monalisa_server.log'),
        errStream = fs.createWriteStream('monalisa_server.err'),
        // should run with '--watch' but there's a known bug in jekyll using
        // --detach with --watch; http://stackoverflow.com/q/22898039/1197796
        jekyll = spawn('jekyll', ['serve', '--detach']);
    jekyll.stdout.on('data', function(data) { outStream.write(data); });
    jekyll.stdout.on('end', function(data) { outStream.end(); });
    jekyll.stderr.on('data', function(data) { errStream.write(data); });
    jekyll.stderr.on('end', function(data) { errStream.end(); });
    jekyll.on('exit', function(code) {
      if (code != 0) {
        grunt.log.error('Failed to start jekyll: ' + code);
      } else {
        grunt.log.oklns('Jekyll started');
        // on ctrl+c -> kill server
        process.on('SIGINT', function(){
          grunt.task.run('jekyll:stop');
          process.exit();
        });
      }
      done( code == 0 );
    });
  });
  grunt.registerTask('jekyll:stop', function(){
    var gruntTask = this,
        done = this.async(),
        pkill = spawn('pkill', ['-9', '-f', 'jekyll']);
    pkill.stderr.on('data', function(data) { grunt.log.errorlns(data); });
    pkill.on('exit', function(code) {
      if (code != 0 && gruntTask.errorCount) {
        grunt.log.error('Failed to stop jekyll: ' + code);
      } else {
        grunt.log.oklns('Jekyll stopped');
      }
      done( code == 0 || !gruntTask.errorCount );
    });
  });
  grunt.registerTask('jekyll:restart', ['jekyll:stop', 'jekyll']);

};
