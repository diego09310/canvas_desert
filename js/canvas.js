// Params
var refresh = 33;

// Settings
var fps = false;

// Global variables or incremented
var tapStart = 0;
var angle_acum = 0;

var isMobile = {
  Android: function() {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function() {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function() {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function() {
    return navigator.userAgent.match(/IEMobile/i);
  },
  any: function() {
    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
  }
};


if (isMobile.any()) {
  document.addEventListener('touchstart', doc_touchStart, false);
  document.addEventListener('touchend', doc_touchEnd, false);
} else {
  document.addEventListener('keyup', doc_keyUp, false);
}

function draw()
{
  canvas = document.getElementById("desert");
  var cnv = {
    w: window.innerWidth,
    h: window.innerHeight-3
  }
  canvas.width = cnv.w;
  canvas.height = cnv.h;

  if( canvas.getContext )
  {
    var ctx = canvas.getContext('2d');

    if (cnv.w > cnv.h)
      cactusNumMax = 5;
    else
      cactusNumMax = 3;
    cactusNum = Math.random()*cactusNumMax;
    var cactusXY = [];

    for (i=0; i<cactusNum; i++) {
      cactusXY.push({
        X: Math.random()*cnv.w*0.8/cactusNum + cnv.w*0.7*i/cactusNum + cnv.w*0.05,
        Y: Math.random()*cnv.h/4+cnv.h/3});
    }
    cactusXY.sort(compare_depth);

    // Add the tumbleweed
    image = new Image();
    image.src = 'img/tumbleweed.png';
    var tw = {S: cnv.h/5, x: 1.25*cnv.w, y: cnv.h/3, t: 0};

    var start, end = new Date().getTime();

    var interval = setInterval(function () {
      ctx.clearRect(0,0, canvas.width, canvas.height);
      draw_desert(ctx, cnv, cactusXY);
      draw_tumbleweed(ctx, cnv, tw);

      // FPS
      if (fps) {
        end = new Date().getTime();
        fontSize = cnv.h/50;
        ctx.font = fontSize + "px Arial";
        ctx.fillStyle = "black";
        ctx.fillText("FPS: " + Math.floor(1000/(end-start)), 10, fontSize*1.5);
        start = new Date().getTime();
      }
    }, refresh);
  }
}

function compare_depth (a,b) {
  return a.Y - b.Y;
}

function draw_desert (ctx, cnv, cactusXY) {
  var grd = ctx.createRadialGradient(cnv.w/2, cnv.h/2, Math.max(cnv.w, cnv.h)/20, cnv.w/2, cnv.h/2, (cnv.h+cnv.w)/2);
  grd.addColorStop(0, "#80ccff");
  grd.addColorStop(1, "#0099ff");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, cnv.w, cnv.h);

  var grd = ctx.createRadialGradient(cnv.w/2, cnv.h, Math.max(cnv.w, cnv.h)/20, cnv.w/2, cnv.h/2, Math.max(cnv.h, cnv.w));
  grd.addColorStop(0, "#f1ddb0");
  grd.addColorStop(1, "#f8d396");
  ctx.fillStyle = grd;
  //ctx.fillStyle = "#f1ddb0";
  ctx.fillRect(0, cnv.h/3, cnv.w, cnv.h*2/3);

  ctx.fillStyle = "#00aa00";
  ctx.strokeStyle = "#009000";

  for (i=0; i<cactusNum; i++) {
    cactusH = (cactusXY[i].Y-cnv.h/3)*1.3;//*(cactusXY[i].Y-cnv.h/3)/25;
    cactusW = cactusH/4;

    branch1H = cactusH/2;
    branch1W = cactusW/2;
    branch1X = cactusXY[i].X+cactusW;
    branch1Y = cactusXY[i].Y-cactusH/3;

    branch2H = cactusH/3;
    branch2W = cactusW/3;
    branch2X = cactusXY[i].X;
    branch2Y = cactusXY[i].Y-cactusH/2;

    ctx.beginPath();
    // Trunk
    ctx.moveTo(cactusXY[i].X, cactusXY[i].Y);
    ctx.lineTo(cactusXY[i].X, cactusXY[i].Y-cactusH);
    ctx.arc(cactusXY[i].X+cactusW/2, cactusXY[i].Y-cactusH, cactusW/2, Math.PI, 0, false);
    ctx.lineTo(cactusXY[i].X+cactusW, cactusXY[i].Y);

    // 1st branch
    ctx.moveTo(branch1X, branch1Y);
    ctx.lineTo(branch1X+branch1W, branch1Y);
    ctx.arc(branch1X+branch1W, branch1Y-branch1W, branch1W, Math.PI/2, 0, true);
    ctx.lineTo(branch1X+2*branch1W, branch1Y-branch1W-branch1H);
    ctx.arc(branch1X+1.5*branch1W,branch1Y-branch1W-branch1H, branch1W/2, 0, Math.PI, true);
    ctx.lineTo(branch1X+branch1W, branch1Y-1.5*branch1W);
    ctx.arc(branch1X+branch1W*3/4, branch1Y-1.5*branch1W, branch1W/4, 0, Math.PI/2, false);
    ctx.lineTo(branch1X, branch1Y-1.25*branch1W);

    // 2nd branch
    ctx.moveTo(branch2X, branch2Y);
    ctx.lineTo(branch2X-branch2W, branch2Y);
    ctx.arc(branch2X-branch2W, branch2Y-branch2W, branch2W, Math.PI/2, Math.PI, false);
    ctx.lineTo(branch2X-2*branch2W, branch2Y-branch2W-branch2H);
    ctx.arc(branch2X-1.5*branch2W, branch2Y-branch2W-branch2H, branch2W/2, Math.PI, 0, false);
    ctx.lineTo(branch2X-branch2W, branch2Y-1.5*branch2W);
    ctx.arc(branch2X-branch2W*3/4, branch2Y-1.5*branch2W, branch2W/4, Math.PI, Math.PI/2, true);
    ctx.lineTo(branch2X, branch2Y-1.25*branch2W);
    ctx.fill();

    // Lines of the cactus
    ctx.beginPath();
    ctx.moveTo(cactusXY[i].X+cactusW/3, cactusXY[i].Y);
    ctx.lineTo(cactusXY[i].X+cactusW/3, cactusXY[i].Y-cactusH - cactusW/2*0.9428);
    ctx.moveTo(cactusXY[i].X+cactusW*2/3, cactusXY[i].Y-cactusH - cactusW/2*0.9428);
    ctx.lineTo(cactusXY[i].X+cactusW*2/3, cactusXY[i].Y);

    ctx.stroke();
  }
}

function draw_tumbleweed(ctx, cnv, tw) {

  if (tw.x < -2*cnv.w)
    tw.x = cnv.w;
  tw.t += Math.floor(Math.random()+1.5);
  tw.x -= Math.abs(Math.sin(2*Math.PI*tw.t/100 - Math.PI/2)+3)*4;
  tw.y = cnv.h*8/9 - Math.abs(Math.sin(2*Math.PI*tw.t/200))*140;

  angle_acum += Math.floor(tw.y/cnv.h*26-19);
  angle = -tw.t*4-angle_acum;

  drawRotatedImage(ctx, image, tw.x, tw.y, angle, tw.S, tw.S);
}

// Function from http://creativejs.com/2012/01/day-10-drawing-rotated-images-into-canvas/
var TO_RADIANS = Math.PI/180;
function drawRotatedImage(context, image, x, y, angle, image_w, image_h) {

  // save the current co-ordinate system
  // before we screw with it
  context.save();

  // move to the middle of where we want to draw our image
  context.translate(x, y);

  // rotate around that point, converting our
  // angle from degrees to radians
  context.rotate(angle * TO_RADIANS);

  // draw it up and to the left by half the width
  // and height of the image
  context.drawImage(image, -(image_w/2), -(image_h/2), image_w, image_h);

  // and restore the co-ords to how they were when we began
  context.restore();
}

function doc_keyUp(e) {
  if (e.keyCode == 70)
    fps = !fps;
}

function doc_touchStart() {
  tapStart = new Date().getTime();
}

function doc_touchEnd() {
  var tapEnd = new Date().getTime();
  if ((tapEnd - tapStart) > 200)
    fps = !fps;
}
