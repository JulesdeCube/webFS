var socket = io('/webFS');
var goaldPath = pathPath('/');
var currentPath = pathPath('');

var tree = {name:'/', type:'root', content:undefined};

window.addEventListener('load', event => {
  pathB = document.getElementById('path');
  pathB.addEventListener('change', event => {
    console.log(pathB);
    
    changePath(pathB.value)
  });
});

socket.on('folderContent', list => {
/*   console.log('get path: ',list._metadata.call,list.result);
  console.log('\n'); */
  getByPath(list._metadata.call).content = list.result;
  for (const name in list.result) {
    if (list.result.hasOwnProperty(name)) {
      addElement(list.result[name], list._metadata.call);
    }
  }
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

function goPath(path, relative) {
  let out = pathPath(path);
  out.push(relative);
  return stringifyPath(out);
}



// navigate function
function getByPath(path) {
  path = sterilizePath(path);
  if (typeof path == 'string') {
    path = pathPath(path);
  }
  
  
  if (out.content === undefined) {
    return {undefined};
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
  if (getByPath(goaldPath).content === undefined) {
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


// DOM function
function isElement(obj) {
  // https://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
  try {
    //Using W3 DOM2 (works for FF, Opera and Chrome)
    return obj instanceof HTMLElement;
  }
  catch(e){
    //Browsers not supporting W3 DOM2 don't have HTMLElement and
    //an exception is thrown and we end up here. Testing some
    //properties that all elements have (works on IE7)
    return (typeof obj==="object") &&
      (obj.nodeType===1) && (typeof obj.style === "object") &&
      (typeof obj.ownerDocument ==="object");
  }
}

function addElement(element, parent) {
  if (!isElement(parent)) {
    parent = document.getElementById(parent);
  }
  console.log(parent);
  
  directoryB = document.createElement('div');
  directoryB.id = goPath(parent.id, element.name);
  directoryB.innerText = element.name;

  parent.appendChild(directoryB);

}