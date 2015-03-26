/**
 * License: see license.txt file
 */

var path = require('path');
var fs = require('fs');
var argv = require('optimist').argv;
var sys = require('sys');
var exec = require('child_process').exec;
var nodePackage = require('./cocos.json');

var Cocos = (function () {

    var Cocos = {
    };

    /**
     * Secuentially exec commands.
     * @type {{_execCommands: Array, _running: boolean, exec: Function, __execDescriptor: Function}}
     */
    var Exec= {
        _execCommands: [],
        _running : false,

        execSync: function (command, parameters, streamsCallback) {

            command= command.replace(/\//gi, path.sep);
            console.log(command);

            if (parameters && !parameters.env) {
                parameters.env = process.env;
            }

            this._execCommands.push({command: command, parameters: parameters, streamsCallback: streamsCallback});

            if ( this._running ) {
                return;
            }

            this.__execDescriptor();
        },

        __execDescriptor : function( ) {

            if ( this._execCommands.length===0 ) {
                this._running= false;
                return;
            }

            this._running= true;

            var currentExec = this._execCommands.shift();
            var me= this;

            (function (currentExec) {
                console.log("Executing command: '" + currentExec.command + "'");
                exec(currentExec.command, currentExec.parameters, function (error, stdout, stderr) {
                    currentExec.streamsCallback(error, stdout, stderr);
                    me.__execDescriptor();
                });
            })(currentExec);
        }
    };

    Cocos.cmd = function () {
        console.log('');
        console.log('Cocos v' + nodePackage.version);
        console.log('(c) 2014,2015 Chukong inc.');
        console.log('');

        if (argv.doc) {
            doc();
        }
        else if (argv.checkenv) {
            checkenv();
        } else if (argv.compiletest) {
            compile('js', false );
            compileTest();
        } else if (argv.compile) {
            compile('js', true );
        } else if (argv.build || argv['build-release'] || argv['build-debug']) {
            compile('js', false );
            compileTest();
            dist();
        } else if (argv.builddts ) {
            // new build process:
            // concat all ts into one single file
            // compile all.ts to all.js and get an all.d.ts file.
            // uglify all.js to all.min.js
            genericExecSync( "gulp concat-ts", "Concat all ts files into all.ts." );
            genericExecSync( "tsc -d -t ES5 dist/all.ts ./lib/webaudio/webaudio.d.ts", "Transpiling to js." );
            genericExecSync( "gulp uglify-js", "Minimizing all.js." );
        }
        else {
            help();
        }
    };

    function genericExecSync( command, msg ) {

        Exec.execSync(command,
            { cwd: getCocosPath() },
            function (error, stdout, stderr) {
                if (stdout !== ""){
                    console.log(stdout);
                }
                if (stderr !== "") {
                    console.log(stderr);
                }

                if ( typeof msg!=="undefined" ) {
                    console.log(msg);
                }

                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });
    }

    function dist() {

        Exec.execSync(
            'gulp scripts uglify',
            { cwd: getCocosPath() },
            function (error, stdout, stderr) {
                if (stdout !== ""){
                    console.log(stdout);
                }
                if (stderr !== "") {
                    console.log(stderr);
                }
                console.log('Building single file library files done.');
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });
    }

    function doc() {

        var cocosPath = getCocosPath();

        // generate a dynamic tsdoc.json file.
        var contents = {

            "tags": {
                "allowUnknownTags": true
            },
            "plugins": [
                "plugins/markdown",
                "/usr/local/lib/node_modules/tsdoc/template/plugins/TSDoc.js"
            ],
            "opts": {
                "template": "/usr/local/lib/node_modules/tsdoc/template",
                "recurse": "true",
                "query": "value",
                "private": true,
                "lenient": true
            },
            "templates": {
                "cleverLinks": false,
                "monospaceLinks": false
            },
            "source": {
                "includePattern": "(\\.d)?\\.ts$"
            },
            "markdown": {
                "parser": "gfm",
                "hardwrap": true
            },
            "tsdoc": {
                "source": "",
                "destination": "",
                "tutorials": "",
                "systemName": "CocosJS",
                "footer": "",
                "copyright": "CocosJS Copyright © 2014 Chukong inc.",
                "outputSourceFiles": true,
                "commentsOnly": true
            }
        };


        contents.tsdoc.source = path.join(cocosPath, "src");
        contents.tsdoc.destination = path.join(cocosPath, "doc-ts");

        fs.writeFileSync(path.join(cocosPath, "tsdoc.json"), JSON.stringify(contents, null, 2), {encondig: "utf-8" });

        var jsonParams = [
            "tsdoc"
        ].join(' ');

        Exec.execSync(jsonParams,
            { cwd: getCocosPath() },
            function (error, stdout, stderr) {
                if (stdout !== "") {
                    console.log(stdout);
                }
                console.log('Typescript Documentation done.');
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });

        Exec.execSync("jsdoc -c conf.json",
            { cwd: getCocosPath() },
            function (error, stdout, stderr) {
                if (stdout !== "") {
                    console.log(stdout);
                }
                console.log('Javascript Documentation done.');
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });
    }

    function checkenv( ) {
        function fn(p, size) {
            var ret = typeof packages.dependencies[p] !== "undefined";
            var ellipsis = Array(size - p.length).join('.');
            console.log( '        '+p + ellipsis + (ret ? 'OK' : 'ERROR'));
            return ret;
        }

        var packages;
        var output = "";

        console.log('    Checking environment');
        console.log('');
        console.log('    Cocos home="'+getCocosPath()+'"');
        var child = Exec.execSync(
            'npm -g ls --json ',
            {
                encoding: 'utf8',
                maxBuffer: 1024 * 1024
            },
            function (err, stdout, stderr) {

                if (stdout) {
                    output += stdout;

                    var lines = output.split('\n');
                    var nlines = [];
                    lines.forEach(function (e) {
                        if (e.indexOf('npm ERR!') !== 0 && e.indexOf('npm WARN') !== 0) {
                            nlines.push(e);
                        }
                    });

                    packages = JSON.parse(nlines.join('\n'));

                    var modules = ['typescript', 'tsdoc', 'jsdoc', 'gulp'];

                    var b = true;
                    var size = 0;
                    for (var i = 0; i < modules.length; i++) {
                        size = Math.max(size, modules[i].length);
                    }
                    size = size + (size % 4) + 4;
                    for (var i = 0; i < modules.length; i++) {
                        b = b && fn(modules[i], size);
                    }

                    console.log("");
                    console.log('    Environment ' + (b ? 'OK' : 'ERROR'));
                    console.log("");
                }
            });
    }

    function compile( dir, oneFile ) {

        var jsonParams = [ "tsc",
            "src/all.ts",
            //"--sourceMap",
            "--target ES5"
        ];

        if (oneFile) {
            jsonParams.push('-d');
            jsonParams.push('--out');
            jsonParams.push('dist/all.js');
        } else {
            jsonParams.push('-d');
            jsonParams.push("--outDir");
            jsonParams.push(dir);
        }

        jsonParams= jsonParams.join(' ');

        Exec.execSync(jsonParams,
            { cwd: getCocosPath() },
            function (error, stdout, stderr) {
                if (stdout !== ""){
                    console.log(stdout);
                }
                if (stderr !== "") {
                    console.log(stderr);
                }
                console.log('Building js files done.');
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });
    }

    function compileTest( dir ) {

        var jsonParams = [ "tsc",
            "src/test/tests/alltest.ts",
            //"--sourceMap",
            "--target ES5",
            "--outDir",
            "js"
        ];

        jsonParams= jsonParams.join(' ');

        Exec.execSync(jsonParams,
            { cwd: getCocosPath() },
            function (error, stdout, stderr) {
                if (stdout !== ""){
                    console.log(stdout);
                }
                if (stderr !== "") {
                    console.log(stderr);
                }
                console.log('Building test files done.');
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });
    }

    function help() {
        console.log("");
        console.log("cocosjs [--checkenv] [--doc] [--compile] [--compiletest] [--build[-release|-debug]]");
        console.log("");
        console.log("  --checkenv: check whether current working environment is suitable. ");
        console.log("  --doc: generate documentation. Invokes tsdoc configured from tsdoc.json and jsdoc. [JS+TS doc]");
        console.log("  --compile : generate js files.");
        console.log("  --compiletest : generate test js files.");
        console.log("  --test : execute jasmine unit tests.");
        console.log("  --build[-release|-debug] : generate build library file. By default builds debug library version.");
        console.log("");
    }

    Cocos.getUserName = function () {
        var userName = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE);
        return userName.substr(userName.lastIndexOf(path.sep) + 1);
    };

    function processPath(_path) {
        _path = _path.indexOf(':') !== -1 ? _path.split(':')[1] : _path;
        _path = _path.replace(/\\/gi, '/');
        return _path;
    }

    function existsFile(path) {
        path = processPath(path);
        return fs.existsSync(path);
    }

    function isCocosDir(_path) {
        return  existsFile(_path) &&
            existsFile(path.join(_path, "src")) &&
            existsFile(path.join(_path, "lib"));
    }

    var __cocosPath = null;
    function getCocosPath() {

        if (__cocosPath) {
            return __cocosPath;
        }

        var _path = process.env.COCOSJS_HOME;

        // look for CocosJS folder in modules.
        if (!_path) {
            //console.log("Guessing CocosJS path...");
            var modules = module.paths.concat();

            //console.log("\tModules:");
            for (var i = 0; i < modules.length; i++) {
                var tpath = path.join(modules[i], "CocosJS");
                //console.log("\t  Checking: " + tpath);
                if (isCocosDir(tpath)) {
                    //console.log("\t\tFound.");
                    _path = tpath;
                    break;
                }
            }

            // traverse current path
            if (!_path) {
                //console.log("\tCurrent working dir:"+process.cwd());
                var paths = process.cwd().split( path.sep );
                while (paths.length) {
                    var tpath = path.join.apply(null, paths);
                    //console.log("\t  Checking: " + tpath);
                    if (isCocosDir(tpath)) {
                        //console.log("\t\tFound.");
                        _path = tpath;
                        break;
                    } else {
                        tpath= path.sep+tpath;
                        if (isCocosDir(tpath)) {
                            //console.log("\t\tFound.");
                            _path = tpath;
                            break;
                        }
                    }
                    paths.pop();

                }

                if (!_path) {
                    throw new Error("Can't find Cocos");
                }
            }
        }

        return _path;
    }

    return Cocos;

})();

(module).exports = Cocos;