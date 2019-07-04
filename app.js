//requiring path and fs modules
const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const socketIo = require('socket.io');

const port = 3000;
const homeDirectory = path.join(__dirname, 'Documents');

var app = express();
var server = http.createServer(app);
var io = socketIo.listen(server);

app.use(express.static('./client'));


io.of('/webFS').on('connection', function(socket){
  socket.on('folderContent', msg => {
    getFolderContent(msg, list => {
      socket.emit('folderContent', list)
    });
    
  });
});

server.listen(port, function(){
  console.log('listening on http://127.0.0.1:3000' /* + port */);
});




function pathSterilisateur(thepath) {
  return path.join(homeDirectory, thepath);
}

function getFolderContent(directoryPath, callback) {
  realPath = pathSterilisateur(directoryPath);
  fs.exists(realPath, rsp => {
  console.log('thepath', directoryPath, '(',  realPath,') exist :',rsp);
    if (rsp) {
      fs.readdir(realPath, function (err, files) {
        let result = {};
        if (err) {
          return console.log('Unable to scan directory: ' + err);
        }
        files.forEach(file => {
          let filePath = path.join(realPath, file);
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
          result[file] = {name:file, type, size: fileStats.size, content: undefined};
        });
        callback({result, _metadata: {call:directoryPath, date: (new Date()).toISOString()}})
      });
    } else {
      //console.log('ERROR(unkwon):',directoryPath);
    }
  });
}