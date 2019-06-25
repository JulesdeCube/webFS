var socket = io();

language='fr';
var languageDictionary = {
  fr: {
    name:'nom',
    size:'taille',
    type:'type'
  }
};
var properties = ['name', 'type', 'size'];

window.addEventListener('load', event => {
  pathB = document.getElementById('path');
  pathB.addEventListener('change', event => {
    console.log('test');
  
    changeDirectory(pathB.value);
  });
  changeDirectory(pathB.value);
});

function changeDirectory(path) {
  let pathB = document.getElementById('path');
  pathB.value = path;
  var files = getFiles(path);
  updateFiles(files, properties);
}

function updateFiles(files, properties) {
  updateProperties(properties);
  let filesB = document.getElementById('files');
  filesB.innerHTML = '';
  files.forEach(file => {
    fileB = document.createElement('tr');
    properties.forEach(property => {
      propertyB = document.createElement('td');
      propertyB.innerText = file[property];
      propertyB.setAttribute('property', property);
      fileB.appendChild(propertyB);
    });
    filesB.appendChild(fileB);
  });

}

function updateProperties(properties){
  let propertiesB = document.getElementById('property');
  propertiesB.innerHTML = '';
  properties.forEach(property => {
    propertyB = document.createElement('th');
    propertyB.innerText = languageDictionary[language][property];
    propertyB.setAttribute('property', property);
    propertiesB.appendChild(propertyB);
  });
}

function getFiles(path){
  return [
    {name: "2017_1erS", type: "directory", size: 0},
    {name: "2019_Info-Spe", type: "directory", size: 0},
    {name: "2020_Info-Sup", type: "directory", size: 0},
    {name: "2021_ING-1", type: "directory", size: 0},
    {name: "2022_ING-2", type: "directory", size: 0},
    {name: "2023_ING-3", type: "directory", size: 0},
    {name: "index.txt", type: "file", size: 21},
    {name: "index.html", type: "file", size: 264},
    {name: path, type: "file", size: 264}
  ];
}
