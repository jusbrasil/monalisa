window.onload = function(){

  function changeBackground(e){
    document.getElementsByClassName('colors')[0].style.background = window.getComputedStyle(e.target, null).backgroundColor;
    return false;
  }

  var pallets = document.getElementsByClassName('colorPallet-color');
  for (var i = 0; i < pallets.length; i++)
    pallets[i].onclick = changeBackground;

}
