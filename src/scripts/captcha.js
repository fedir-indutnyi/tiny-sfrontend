/**
 * Created by Den on 28.09.2017.
 */
function startCaptcha () {
  drowCaptcha();

  var input = document.getElementById('input');
  input.addEventListener("input", function () {
    if (strCaptcha === input.value.toString()) {
      $("#submit").slideDown();
    }
    else {
      $("#submit").slideUp();
    }
  });

  var changeCaptcha = document.getElementById('changeCaptcha');
  changeCaptcha.addEventListener("click", function () {
    $("#submit").slideUp();
    drowCaptcha();
      input.value = "";
  });


}
var strCaptcha = "";
function drowCaptcha() {
    var ranArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
        'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0',
        '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    strCaptcha = "";
    for(var i = 0; i < 6; i++) {
        strCaptcha += ranArray[Math.floor(Math.random() * ranArray.length)]
    }
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = "30px brush script mt,cursive";
    context.fillText(strCaptcha, 50, 50);
}
