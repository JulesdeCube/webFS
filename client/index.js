var socket = io('/webFS');
var goaldPath = pathPath('/');
var currentPath = pathPath('');

var tree = {name:'/', type:'root'};

window.addEventListener('load', event => {
  pathB = document.getElementById('path');
  pathB.addEventListener('change', event => {
    goaldPath = pathB.value;
    updatePath();
  });
  changePath('/2019_Info-Spe/projet 1/folder0.1')
});

socket.on('folderContent', list => {
/*   console.log('get path: ',list._metadata.call,list.result);
  console.log('\n'); */
  getByPath(list._metadata.call).content = list.result
  updatePath(); 
});


// path function
function pathPath(path) {
  let out = path.split(RegExp('\\\\|/'));
  for (let i = 0; i < out.length; i++) {
    if (out[i] === '') {
      out.splice(i, 1);
      i--;
    } else if (out[i] === '..') {
      if (i !== 0) {
        out.splice(i - 1, 2);
        i -= 2;
      } else {
        out.shift();
        i--;
      }
    }
  }
  return out;
}

function stringifyPath(path) {
  let str = path.length === 0 ? '/' : '';
  path.forEach(folder => {
    str += '/' + folder
  });
  return str;
}

function sterilizePath(path) {
  out = typeof path === 'string' ? pathPath(path) : path;
  return stringifyPath(out);
}



// navigate function
function getByPath(path) {
  path = sterilizePath(path);
  if (typeof path == 'string') {
    path = pathPath(path);
  }
  
  
  if (out === undefined) {
    return undefined;
  } else {
    let out = tree;
    for (let level = 0; level < path.length; level++) {
      const folder = path[level];
      /* console.log(`folder:(level ${level}): ${folder} -> `, out.content); */
      if (out.content.hasOwnProperty(folder)) {
        out = out.content[folder]; 
      } else {
        return undefined;
      }
    }
    return out;
  }
}

function changePath(path) {
  currentPath = pathPath('/');
  goaldPath = pathPath(path);
/*   console.log('goald path: ',sterilizePath(path));
  console.log(''); */
  updatePath();
}

function updatePath() {
  if (stringifyPath(goaldPath) !== stringifyPath(currentPath)) {
    let level = currentPath.length;
    let afterRemainingPath = [...goaldPath];
    let nextPath = afterRemainingPath.splice(0, level + 1);
/*     console.log('curentpath: ',stringifyPath(currentPath), getByPath(currentPath));
    console.log('nextPath: ',stringifyPath(nextPath));
    console.log('\n'); */
    if (getByPath(currentPath).content !== undefined) {
      currentPath = nextPath;
      updatePath();
    } else {
      askForFolderContent(currentPath);
    }
  }
}

function askForFolderContent(path) {
/*   console.log('ask for: ', sterilizePath(path));
  console.log('\n'); */
  socket.emit('folderContent', sterilizePath(path));
}
