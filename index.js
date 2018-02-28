var fs = require("fs"),
    scan = require("./scan"),
    path = require('path'),
    id3 = require("node-id3");

    var directory = "F:\\english\\podcast\\englishpod";
    //var directory = path.dirname(process.execPath);
    //var directory = __dirname;
    var writeStream = fs.createWriteStream("_log.txt");
    writeStream.write('start. ');   
    writeStream.write('directory: ' + directory);   
    writeStream.write('\n');   

    var folders = scan(directory, '');
    writeStream.write('scanning... items: ' + folders.items.length);   
    writeStream.write('\n');   

    extractfiles(folders.items, writeStream, 'pr.mp3');
    writeStream.end();

 function extractfiles(items, stream, extension){

    for (let index = 0; index < items.length; index++){
        const element = items[index];
        if(element.type == 'folder'){
            extractfiles(element.items, stream, extension);
        }
        else if(element.name.slice(extension.length * -1) == extension){
            doIt(stream, element.directory, element.path);
            // return;
        }
    }
 }

 function doIt(stream, dir, path){
    
    const albumPattern = ' | Lessons';
    const titlePattern = ' | ';
    let tags = id3.read(path);
    var part1 = '';
    var newname = '';
    if(tags == false)
    {
        stream.write('error rename file: ' + path + '. reason: cant read tags');   
        return;
    }

    if(tags.album.slice(albumPattern.length * -1) == albumPattern){
        part1 = tags.album.substring(0, tags.album.length - albumPattern.length).toLowerCase();
    }
    var numb = path.slice(-10, -6);

    if(tags.title.indexOf(titlePattern) > 0){
        newname = 'lessons - ' + numb + ' - ' + part1 + " - " + tags.title.substring(0, tags.title.indexOf(titlePattern)).toLowerCase();
    }
    else {
        newname = 'lessons - ' + numb + ' - ' + tags.title.toLowerCase();
    }
    newname = newname.replace('/', '').replace('\\', '').replace(':', '').replace('*', '').replace('?', '').replace('\"', '').replace('<', '').replace('>', '').replace('|', '');
    fs.rename(path, dir + '/' + newname + '.mp3', function(err) {
        if ( err ) {
            stream.write('error rename file: ' + path + '. reason: ' + err);   
        }
    });

    stream.write('rename ' + path + ' to ' + newname);   
    stream.write('\n');   
 }