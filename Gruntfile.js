var spawn = require('child_process').spawn,
    fs = require('fs');

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')

    ,sass: { // SASS compiler
      // prod: {
      //   options: {
      //     style: 'compressed'
      //   },
      //   files: {
      //     'dist/css/general.min.css': 'scss/general.scss'
      //   }
      // },
      dev: {
        options: {
          style: 'expanded'
        },
        files: {
          'dist/css/general.css': 'scss/general.scss',
          'dist/css/demo.css': 'scss/demo.scss'
        }
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
      }
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
          'dist/css/general.min.css': 'dist/css/general.min.css'
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
  grunt.registerTask('server', ['copy:dist', 'jekyll', 'watch']);

  grunt.registerTask('jekyll', function(){
    var done = this.async(),
        outStream = fs.createWriteStream('monalisa_server.log'),
        errStream = fs.createWriteStream('monalisa_server.err'),
        jekyll = spawn('jekyll', ['serve', '--watch', '--detach']);
    jekyll.stdout.on('data', function(data) { outStream.write(data); });
    jekyll.stdout.on('end', function(data) { outStream.end(); });
    jekyll.stderr.on('data', function(data) { errStream.write(data); });
    jekyll.stderr.on('end', function(data) { errStream.end(); });
    jekyll.on('exit', function(code) {
      if (code != 0) {
        grunt.log.error('Failed to start jekyll: ' + code);
      } else {
        grunt.log.oklns('Jekyll started');
      }
      done( code == 0 );
    });
  });
  grunt.registerTask('jekyll:stop', function(){
    var done = this.async(),
        err = false,
        process = spawn('pkill', ['-9', '-f', 'jekyll']);
    process.stderr.on('data', function(data) {
      err = true;
      grunt.log.errorlns(data);
    });
    process.on('exit', function(code) {
      if (code != 0 && err) {
        grunt.log.error('Failed to stop jekyll: ' + code);
      } else {
        grunt.log.oklns('Jekyll stopped');
      }
      done( code == 0 || !err );
    });
  });
  grunt.registerTask('jekyll:restart', ['jekyll:stop', 'jekyll']);

};
