var socket = io('/webFS');
var goaldPath = pathPath('/');
var currentPath = pathPath('');

var tree = {
  '2019_Info-Spe': { name: '2019_Info-Spe', 
    'projet 1': { name: 'projet 1',
/*       'folder0.1':{name: 'folder0.1' }, */
      'style.css': {name: 'style.css'}
    }
  }
};

window.addEventListener('load', event => {
  pathB = document.getElementById('path');
  pathB.addEventListener('change', event => {
    goaldPath = pathB.value;
    updatePath();
  });

});

socket.on('fileList', list => {
  console.log(list._metadata.call,list.result);
});
i = 0;
function updatePath() {
  i++;
  console.log(goaldPath , currentPath);
  
  if (stringifyPath(goaldPath) !== stringifyPath(currentPath) && i < 7) {
    let level = currentPath.length;
    let afterRemainingPath = [...goaldPath];
    let nextPath = afterRemainingPath.splice(0, level + 1);
   /*  console.log('goaldPath: ',stringifyPath(goaldPath));
    console.log('afterRemainingPath: ', stringifyPath(afterRemainingPath));
    console.log('nextPath: ',stringifyPath(nextPath));
    console.log(getByArrayPath(tree, nextPath));
    console.log('\n'); */
    if (getByArrayPath(tree, nextPath) !== undefined) {
      currentPath = nextPath;
      updatePath();
    } else {
      console.log('not exist');
    }
  }
}

function changePath(path) {
  currentPath = pathPath('/');
  goaldPath = pathPath(path);
  updatePath();
}

changePath('/2019_Info-Spe/projet 1/folder0.1')

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
  return stringifyPath(pathPath(path));
}

function getByArrayPath(object, path) {
  if (typeof path == 'string') {
    path = pathPath(path);
  }
  
  let out = object;
  if (out === undefined) {
    return undefined;
  } else {
    for (let level = 0; level < path.length; level++) {
      const folder = path[level];
      if (out.hasOwnProperty(folder)) {
        out = out[folder]; 
      } else {
        return undefined;
      }
    }
    return out;
  }
}