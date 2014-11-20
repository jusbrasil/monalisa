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
      //     'css/general.min.css': 'scss/general.scss'
      //   }
      // },
      dev: {
        options: {
          style: 'expanded'
        },
        files: {
          'css/general.css': 'scss/general.scss',
          'css/demo.css': 'scss/demo.scss'
        }
      }
    }

    ,watch: { // Watchs file modifications
      css: {
        files: '**/*.scss',
        tasks: [
          'sass',
          // 'cssmetrics'
        ]
      }
    }

    ,browserSync: { // Browser Sync to live reload
      bsFiles: {
        src : ['css/*.css', 'js/*.js', 'demo.html']
      },
      options: {
        watchTask: true,
        server: {
          baseDir: "./"
        }
      }
    }

    ,cssmetrics: {
      dev: {
        src: [
          'css/general.min.css'
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
          'css/general.min.css': 'css/general.min.css'
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-css-metrics');
  grunt.loadNpmTasks('grunt-cssc');

  grunt.registerTask('default', ['cssmetrics', 'browserSync', 'watch']);


};
