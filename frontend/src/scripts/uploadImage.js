/**
 * Created by Den on 04.10.2017.
 */

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 15; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}


function upload() {
  var file = $('#file').get(0).files[0];
  var newName = makeid();
  var blob = file.slice(0, -1, 'image/png');
  var newFile = new File([blob], newName+'.png', {type: 'image/png'});
  sendFile(newFile, 'http://localhost:8081/api/attachments/container1/upload');
  return newFile.name;
}
function sendFile(file, url) {
  return new Promise(function(resolve, reject) {

    var xhr = new XMLHttpRequest();
    var fd = new FormData();

    xhr.open("POST", url, true);
    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4 && xhr.status == 200) {
        resolve(JSON.parse(xhr.responseText));
      }
    };
    fd.append('file', file);
    xhr.send(fd);

  });
}
