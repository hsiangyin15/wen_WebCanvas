var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')

/**************INITIALIZATION***************/
var s_clr;
var b_clr;
var circles = [];
var start_x = 0;
var start_y = 0;
var end_x = 0;
var end_y = 0;
var f_type = 'Arial';
var cPushArray = new Array();
var cStep = -1;
var bs = 1;
var es = 1;
var w = canvas.width
var h = canvas.height
var x1
var y1
var f_type
var isMouseActive = false
var isMouseActive = false;
var drag = false;
var canvasx = $(canvas).offset().left;
var canvasy = $(canvas).offset().top;

var operation_mode = 0;
//初始為 0, brush mode=1,eraser mode=2,text mode=3,shape mode =4
// square mode=5, circle mode=6,slash mode=8,multi-slash mode=9, bucket mode =10




/*******筆刷按鈕設置******/
function draw() {
  operation_mode = 1;
  document.getElementById("canvas").style.cursor = "url(brush.cur), auto";
  document.getElementById("font_option").style.display = "none";
  document.getElementById("img_option").style.display = "none";
  document.getElementById("eraser_option").style.display = "none";
  document.getElementById("shape_option").style.display = "none";
  document.getElementById("back_option").style.display = "none";
  document.getElementById("brush_option").style.display = "block";

  //取得顏色跟筆刷大小
  $('.brush_option input').change(function() {
    bs = $('#brush_size').val();
    clr = $('#brush_color').val();
    console.log("Change brush color:" + clr + " size:" + bs);
  });

}


/*******橡皮擦按鈕設置******/
function eraser() {
  operation_mode = 2;
  document.getElementById("canvas").style.cursor = "url(eraser.cur),  auto";
  document.getElementById("font_option").style.display = "none";
  document.getElementById("brush_option").style.display = "none";
  document.getElementById("img_option").style.display = "none";
  document.getElementById("shape_option").style.display = "none";
  document.getElementById("back_option").style.display = "none";
  document.getElementById("eraser_option").style.display = "block";

  //取得筆刷大小
  $('.eraser_option input').change(function() {
    es = $('#eraser_size').val();
    console.log("Change eraser size:" + es);
  });

}


/*******打字按鈕設置******/
function typeword() {
  operation_mode = 3;
  document.getElementById("canvas").style.cursor = "text";
  document.getElementById("brush_option").style.display = "none";
  document.getElementById("eraser_option").style.display = "none";
  document.getElementById("img_option").style.display = "none";
  document.getElementById("shape_option").style.display = "none";
  document.getElementById("back_option").style.display = "none";
  document.getElementById("font_option").style.display = "block";

  //讀取字體大小 顏色 輸入字詞
  $('.font_option input').change(function() {

    fs = $('#font_size').val();
    f_clr = $('#font_color').val();
    input_word = $('#font_word').val();
    console.log("Change font color:" + f_clr + " size:" + fs);
  });
  //讀取字體
  $('.font_option select').change(function() {

    f_type = $('#font_typeface').val();
    console.log("Change font typeface:" + f_type);
  });

}



/*******畫圖形按鈕設置******/
function drawshape(kind) {
  operation_mode = 4;
  document.getElementById("brush_option").style.display = "none";
  document.getElementById("font_option").style.display = "none";
  document.getElementById("eraser_option").style.display = "none";
  document.getElementById("img_option").style.display = "none";
  document.getElementById("back_option").style.display = "none";
  document.getElementById("shape_option").style.display = "block";

  //讀圖形顏色
  $('.shape_option input').change(function() {
    s_clr = $('#shape_color').val();
    console.log("Change shape color:" + s_clr);
  });

  if (kind === 'circle') {
    operation_mode = 6;
    document.getElementById("canvas").style.cursor = "url(circle.cur), auto";
  }
  if (kind === 'square') {
    operation_mode = 5;
    document.getElementById("canvas").style.cursor = "url(square.cur), auto";
  }
  if (kind === 'slash') {
    operation_mode = 8;
    document.getElementById("canvas").style.cursor = "url(slash.cur), auto";
  }
  if (kind === 'multi') {
    operation_mode = 9;
    document.getElementById("canvas").style.cursor = "url(multi.cur), auto";
  }
}


/*******清空按鈕設置******/
function refresh() {
  //  alert('You are going to reset your drawing board,sure about that?')
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}


/*******上傳按鈕設置******/
function upload_option() {
  document.getElementById("brush_option").style.display = "none";
  document.getElementById("font_option").style.display = "none";
  document.getElementById("eraser_option").style.display = "none";
  document.getElementById("shape_option").style.display = "none";
  document.getElementById("back_option").style.display = "none";
  document.getElementById("img_option").style.display = "block";

  //上傳功能實作
  $('#img').change(function() {

    var img = new Image();

    img.onload = function() {
      ctx.drawImage(this, 0, 0, this.width, this.height)
      URL.revokeObjectURL(src)
    }

    var file = this.files[0];
    var src = URL.createObjectURL(file);

    img.src = src;

  });

}



/*******油漆桶按鈕設置******/
function bucket() {
  operation_mode = 10;
  document.getElementById("canvas").style.cursor = "url(bucket.cur), auto";
  document.getElementById("brush_option").style.display = "none";
  document.getElementById("font_option").style.display = "none";
  document.getElementById("eraser_option").style.display = "none";
  document.getElementById("img_option").style.display = "none";
  document.getElementById("shape_option").style.display = "none";
  document.getElementById("back_option").style.display = "block";

  //讀取選取的背景色
  $('.back_option input').change(function() {
    b_clr = $('#back_color').val();
  });


}



/**************DRAWING***************/

// brush mode=1,eraser mode=2,text mode=3,shape mode =4
// square mode=5, circle mode=6,slash mode=8, bucket mode =10

/******* mousedown ******/
canvas.addEventListener('mousedown', function(e) {
  //mouse的狀態,位置
  isMouseActive = true
  start_x = e.offsetX
  start_y = e.offsetY

  //各種 mode 的線條粗細，顏色設定
  if (operation_mode === 1) {
    ctx.lineWidth = bs;
    ctx.strokeStyle = clr;
  } else if (operation_mode === 2) {
    ctx.lineWidth = es;
  } else if (operation_mode === 3) {
    newSize = fs + "px";
    newFace = "'" + f_type + "'";
    ctx.font = newSize + " " + newFace;
    ctx.fillStyle = f_clr;
    ctx.fillText(input_word, start_x, start_y);
  } else if (operation_mode === 5) {
    ctx.fillStyle = s_clr;
    rect_startX = e.pageX - this.offsetLeft;
    rect_startY = e.pageY - this.offsetTop;
    drag = true;
  } else if (operation_mode === 6) {
    ctx.fillStyle = s_clr;
    var rect = canvas.getBoundingClientRect();
    x1 = e.clientX - rect.left;
    y1 = e.clientY - rect.top;
    isMouseActive = true;
  } else if (operation_mode === 10) {
    ctx.fillStyle = b_clr;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (operation_mode === 8) {
    ctx.fillStyle = s_clr;
    last_mousex = parseInt(e.clientX - canvasx);
    last_mousey = parseInt(e.clientY - canvasy);
  } else if (operation_mode === 9) {
    ctx.fillStyle = s_clr;
    last_mousex = parseInt(e.clientX - canvasx);
    last_mousey = parseInt(e.clientY - canvasy);
  }

})


/******* mousemove ******/
canvas.addEventListener('mousemove', function(e) {
  if (!isMouseActive) {
    return
  }
  // 取得終點座標
  end_x = e.offsetX
  end_y = e.offsetY

  // draw (筆刷跟橡皮擦)
  ctx.beginPath()
  ctx.moveTo(start_x, start_y)
  ctx.lineTo(end_x, end_y)
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  //Brush
  if (operation_mode === 1) {
    ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';

  }
  //Eraser
  else if (operation_mode === 2) {
    ctx.stroke();
    ctx.globalCompositeOperation = "destination-out";
  }
  //Text
  else if (operation_mode === 3) {
    ctx.globalCompositeOperation = "source-over";
  }
  //Rectangle
  else if (operation_mode === 5) {
    //ctx.beginPath();
    ctx.globalCompositeOperation = 'source-over';
    rec_w = (e.pageX - this.offsetLeft) - rect_startX;
    rec_h = (e.pageY - this.offsetTop) - rect_startY;
    ctx.clearRect(0, 0, w, h);
    undo();
    ctx.strokeRect(rect_startX, rect_startY, rec_w, rec_h);
    redo();
  }
  //Circle
  else if (operation_mode === 6) {
    ctx.globalCompositeOperation = 'source-over';
    var rect = canvas.getBoundingClientRect(),
      x2 = e.clientX - rect.left,
      y2 = e.clientY - rect.top;

    /// clear canvas
    ctx.clearRect(0, 0, w, h);
    /// draw ellipse
    undo();
    drawEllipse(x1, y1, x2, y2);
    redo();
  }

  //slash
  else if (operation_mode === 8) {
    ctx.beginPath();
    ctx.moveTo(last_mousex, last_mousey);
    ctx.lineTo(start_x, start_y);
    ctx.strokeStyle = s_clr;
    ctx.lineWidth = 1;
    ctx.lineJoin = ctx.lineCap = 'round';
    //ctx.stroke();
  } else if (operation_mode === 9) {
    ctx.beginPath();
    ctx.moveTo(last_mousex, last_mousey);
    ctx.lineTo(start_x, start_y);
    ctx.strokeStyle = s_clr;
    ctx.lineWidth = 1;
    ctx.lineJoin = ctx.lineCap = 'round';
    ctx.stroke();
  }


  // 更新起始點座標
  start_x = end_x
  start_y = end_y;
})


/******* mouseup ******/
canvas.addEventListener('mouseup', function(e) {
  isMouseActive = false

  if (operation_mode === 8) {
    ctx.stroke();
  } else if (operation_mode === 5) {
    drag = false;
  }
  //存畫布
  cPush();
})


/******* canvas推進array 為了redo跟undo ******/
function cPush() {
  cStep++;
  if (cStep < cPushArray.length) {
    cPushArray.length = cStep;
  }
  cPushArray.push(document.getElementById('canvas').toDataURL());
}


/******* 實作undo ******/
function undo() {
  if (cStep > -1) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cStep--;
    var canvasPic = new Image();
    canvasPic.src = cPushArray[cStep];
    canvasPic.onload = function() {
      ctx.drawImage(canvasPic, 0, 0);
    }
  }
}

/******* 實作redo ******/
function redo() {
  if (cStep < cPushArray.length - 1) {
    cStep++;
    var canvasPic = new Image();
    canvasPic.src = cPushArray[cStep];
    canvasPic.onload = function() {
      ctx.drawImage(canvasPic, 0, 0);
    }
  }
}


/******* 畫circle實作 ******/
function drawEllipse(x1, y1, x2, y2) {

  var radiusX = (x2 - x1) * 0.5,
    radiusY = (y2 - y1) * 0.5,
    centerX = x1 + radiusX,
    centerY = y1 + radiusY,
    step = 0.01,
    a = step,

    pi2 = Math.PI * 2 - step;

  ctx.beginPath();

  ctx.moveTo(centerX + radiusX * Math.cos(0),
    centerY + radiusY * Math.sin(0));

  for (; a < pi2; a += step) {
    ctx.lineTo(centerX + radiusX * Math.cos(a),
      centerY + radiusY * Math.sin(a));
  }

  ctx.closePath();
  ctx.strokeStyle = s_clr;
  ctx.stroke();
}
