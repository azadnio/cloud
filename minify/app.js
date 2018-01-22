'use strict';

var fs          = require('fs'),
    path        = require('path'),
    uglifyJs    = require('uglify-js'),
    htmlMinifier= require('html-minifier');


var applicationPath = path.join(__dirname, '../src');
var outPutPath = path.join(__dirname, '../srcmin');

    
//ignore directories (just copy entire files an folders of these directories)
var   copyDirectories = [],
        notIncludeDirectories = [".",".."],
        ignoreFiles = [];
    
var copyRecursiveSync = function(src, dest) {

    var exists = fs.existsSync(src);
    var stats = exists && fs.statSync(src);
    var isDirectory = exists && stats.isDirectory();

    if (exists && isDirectory) {
        fs.mkdirSync(dest);
        fs.readdirSync(src).forEach(function(childItemName) {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
    } else {
        fs.linkSync(src, dest);
    }
};    

//go through all files in app path
function minifyDirectory(appPath, outPutPath){
    
    fs.readdir(appPath, (err, files) => {

        if (!fs.existsSync(outPutPath)) {
            fs.mkdirSync(outPutPath);
        }

        files.forEach(file => {
            
            if(fs.statSync(path.join(appPath, file)).isDirectory()){
                
                if (notIncludeDirectories.indexOf(file) >= 0) {
                    console.log('\x1b[31m%s\x1b[0m', 'Ignoring Folder: '+ path.join(appPath, file));
                }
                else
                    if (copyDirectories.indexOf(file) >= 0) {
                        console.log('\x1b[33m%s\x1b[0m', 'Copying Folder: '+ path.join(appPath, file));
                        copyRecursiveSync(path.join(appPath, file), path.join(outPutPath, file));
                    }    
                    else {  
                        console.log('Minifying Folder: '+ path.join(appPath, file)); 
                        minifyDirectory(path.join(appPath, file), path.join(outPutPath, file));
                    }    
            }
            else{
                //send files to minify
                try {
                    minifyFile(file, appPath, outPutPath);
                } catch (error) {
                    console.log(error);
                    console.log(path.join(appPath, file));
                }
                
            }            
        });
    });
    
}

function minifyFile(file, srcDirectory, desDirectory){
    
    var fileExtension = path.extname(file).toLowerCase();

    if(ignoreFiles.indexOf(file) > -1)
        _copyFiles();

    //minify JS files
    else if(fileExtension === '.js'){

        var fileStr = fs.readFileSync(path.join(srcDirectory, file), 'utf8');

        var result = uglifyJs.minify(fileStr);
        fs.writeFile(path.join(desDirectory, file), result.code);
    }

    //minify HTML files
    else if(fileExtension === '.html'){

        

        fs.readFile(path.join(srcDirectory, file), 'utf8', function (err,data) {
            if (err) {
                console.log(path.join(srcDirectory, file));
                return console.log(err);
            }
        
            
            var result = htmlMinifier.minify(data,{
                minifyJS:true,
                minifyCSS:true,
                removeComments: true,
                removeTagWhitespace:true,
                trimCustomFragments:true,
                sortClassName:true,
                sortAttributes:true,
                // collapseWhitespace:true,
                conservativeCollapse:true,
                collapseInlineTagWhitespace:true
            });
            
            result = result.split('\n');

            var text = '';

            result.forEach(function(line){
                if(line.trim() !== ''){
                    text += line;}
            });
            result = text;
            
            fs.writeFile(path.join(desDirectory, file), result);


        });
    }

    //copy files to the dirrectory
    else
        _copyFiles();

    function _copyFiles(){
        fs.createReadStream(path.join(srcDirectory, file)).pipe(fs.createWriteStream(path.join(desDirectory, file)));
    }
}

minifyDirectory(applicationPath, outPutPath);

