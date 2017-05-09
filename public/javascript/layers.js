

 $( document ).ready(function() {
  var ctx = $("#myCanvas")[0].getContext("2d");
  ctx.moveTo(0,0);
  ctx.lineTo(200,100);
  ctx.stroke();
  
  var ctx = $("#myCanvas1")[0].getContext("2d");
  ctx.moveTo(0,0);
  ctx.fillRect(0,0,10,5);
  ctx.fillStyle = "#FFff00";
  ctx.lineTo(200,100);
  ctx.stroke();
  
  
  var ctx = $("#myCanvas2")[0].getContext("2d");
  ctx.moveTo(0,0);
  ctx.fillRect(0,0,50,3);
  ctx.fillStyle = "#FFff00";
  ctx.lineTo(200,100);
  ctx.stroke();
  
  
});