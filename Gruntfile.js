// To use this file in WebStorm, right click on the file name in the Project Panel (normally left) and select "Open Grunt Console"

/** @namespace __dirname */
/* jshint -W097 */// jshint strict:false
/*jslint node: true */
"use strict";

module.exports = function (grunt) {
    var prefix      = "https://raw.githubusercontent.com/OpenAutomationProject/knx-uf-iconset/master/raw_svg/";
    var httpSrcPath = 'https://github.com/OpenAutomationProject/knx-uf-iconset/tarball/master';
    var imgSrcPath = 'OpenAutomationProject-knx-uf-iconset-*/raw_svg/*.svg';

    // Project configuration.
    grunt.initConfig({
        clean: {
            all: ['www/*.svg', 'www/*.png', 'www/*.jpg', '.build']
        },
        copy: {
            icons: {
                files: [
                    {
                        expand: true,
                        cwd: __dirname + '/.build/icons/',
                        src: [imgSrcPath],
                        dest: __dirname + '/www',
                        rename: function (dest, src) {
                            var parts = src.replace(/\\/g, '/').split('/');
                            return __dirname + '/www/' + parts[parts.length - 1];
                        }
                    }
                ]
            }
        },
        curl: {
            '.build/icons.tar.gz': httpSrcPath
        },
        targz: {
            icons: {
                files: {
                    ".build/icons":  ".build/icons.tar.gz"
                }
            }
        }
    });

    grunt.registerTask('updateList', function () {
        var fs = require('fs');
        var dir = fs.readdirSync(__dirname + '/www');
        var readme = '';
        var html = '<html><body style="background: grey"><table>';
        var htmlLineImg = '<tr>';
        var htmlLineName = '<tr>';
        var inLine = 6;
        var currentWord = "";
        var cur = 0;
        for (var i = 0; i < dir.length; i++) {
            cur++;
            var parts = dir[i].split('_');
            if ((currentWord && currentWord != parts[0]) || (!(cur % inLine))) {
                html += htmlLineImg + '</tr>';
                html += htmlLineName + '</tr>';
                htmlLineImg  = '<tr>';
                htmlLineName = '<tr>';
                if (currentWord && currentWord != parts[0]) {
                    html += '<tr style="height:15px;background:lightblue"><td colspan="' + inLine + '" style="height:15px"></td></tr>';
                    readme += '===========================\n';
                }

                currentWord = parts[0];
                cur = 0;
            }
            if (!currentWord) currentWord = parts[0]
            //readme += '![' + dir[i] + '](www/' + dir[i] + ')\n';
            readme += '![' + dir[i] + '](' + prefix + dir[i] + ')\n';

            htmlLineImg  += '<td style="text-align: center"><img src="' + dir[i] + '" width="64" height="64"></td>\n';
            htmlLineName += '<td style="text-align: center">' + dir[i] + '</td>\n';
        }
        html += htmlLineImg + '</tr>';
        html += htmlLineName + '</tr>';
        html += '</table></body></html>';
        grunt.file.write('ICONLIST.md', readme);
        grunt.file.write('www/index.html', html);
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-tar.gz');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-curl');

    grunt.registerTask('default', [
        'clean',
        'curl',
        'targz',
        'copy',
        'updateList'
    ]);
};