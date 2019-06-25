//requiring path and fs modules
const http = require('http');
const path = require('path');
const fs = require('fs');

server = http.createServer();


const homeDirectory = path.join(__dirname, 'Documents');

console.log(homeDirectory);


getFilesList(homeDirectory, files=> {
  console.log(files);

});


function getFilesList(directoryPath, callback) {
  fs.readdir(directoryPath, function (err, files) {
    let result = [];
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }
    files.forEach(file => {
      let filePath = path.join(directoryPath, file);
      let fileStats = fs.lstatSync(filePath);
      let type;
      
      switch (true) {
        case fileStats.isFile():            type = 'file';            break;
        case fileStats.isDirectory():       type = 'directory';       break;
        case fileStats.isBlockDevice():     type = 'blockDevice';     break;
        case fileStats.isCharacterDevice(): type = 'characterDevice'; break;
        case fileStats.isSymbolicLink():    type = 'symbolicLink';    break;
        case fileStats.isFIFO():            type = 'FIFO';            break;
        case fileStats.isSocket():          type = 'socket';          break;
        default: type = 'undefined'; break;
      }
      result.push({name:file, type, size: fileStats.size});
    });
    callback({result, _metadata: {call:directoryPath, date: (new Date()).toISOString()}})
  });
}