function rgbToHex(r, g, b)
{
  return "#" + 
    parseInt(r.toFixed(0)).toString(16) +
    parseInt(g.toFixed(0)).toString(16) + 
    parseInt(b.toFixed(0)).toString(16);
}

class Vector
{

  #x_ = 0;
  #y_ = 0;
  // #z_ = 0;
  constructor(x, y)
  {
    this.#x_ = x;
    this.#y_ = y;
  }

  get getX() { return this.#x_; }
  get getY() { return this.#y_; }
  // get getZ() { return this.#z_; }
  set setX(x) { this.#x_ = x; }
  set setY(y) { this.#y_ = y; }
  // set setZ(z) { this.#z_ = z; }
}

/**
 * 
 * @param {Number} degree 
 * @param {Number} magnitude 
 * @returns {Vector}
 */
function directionToVector(degree, magnitude)
{

  let x = Math.cos(degree) * magnitude;
  let y = Math.sin(degree) * magnitude;
  return new Vector(x, y);
}

/**
 * @type {CanvasRenderingContext2D}
 */
let g;

/**
 * @type {HTMLCanvasElement}
 */
let canvas;

function resizeHandler()
{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function run()
{
  canvas = document.querySelector('canvas');
  if (canvas.id !== "gameboard")
  {
    throw "Wrong canvas";
  }

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  g = canvas.getContext('2d');

  update();

  window.onresize = resizeHandler;
  
  return 0;
}

function drawCircle(g, degree)
{

    let height = window.innerHeight;
    if(window.innerWidth < window.innerHeight) height = window.innerWidth;
    height = height/2.5
    let circleCoords = directionToVector(degree, height);
    g.beginPath();
    g.arc(
    circleCoords.getX + window.innerWidth / 2, 
    circleCoords.getY + window.innerHeight / 2, 
    window.innerHeight/20, 0, Math.PI * 2, false);
    g.stroke();
}

var hue = 0;
var hue2 = 0.5;
var angle = 0;
var angle2 = 0.5;
var angle3 = 1;
var angle4 = 1.5;

function update()
{
  g;
  requestAnimationFrame(update);
  const increment = 0.01;
  hue += increment;
  hue2 += increment;
  if(hue > 1) hue = 0;
  if(hue2 > 1) hue2 = 0;
  let rgbColour = hsvToRgb(hue, 0.5, 0.8);
  let colourStr = rgbToHex(rgbColour[0], rgbColour[1], rgbColour[2]);
  let rgbColour2 = hsvToRgb(hue2, 0.5, 0.8);
  let colourStr2 = rgbToHex(rgbColour2[0], rgbColour2[1], rgbColour2[2]);

  let gradientStyle = g.createLinearGradient(0, 0, window.innerWidth, window.innerHeight);
  gradientStyle.addColorStop(0, colourStr);
  gradientStyle.addColorStop(1, colourStr2);
  g.fillStyle = gradientStyle;
  g.fillRect(0, 0, window.innerWidth, window.innerHeight);

  angle += 0.01;
  if (angle >= 2) angle = 0;
  angle2 += 0.01;
  if (angle2 >= 2) angle2 = 0;
  angle3 += 0.01;
  if (angle3 >= 2) angle3 = 0;
  angle4 += 0.01;
  if (angle4 >= 2) angle4 = 0;

  drawCircle(g, Math.PI * angle);
  drawCircle(g, Math.PI * angle2);
  drawCircle(g, Math.PI * angle3);
  drawCircle(g, Math.PI * angle4);

  return;
}

run();

/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  v       The value
 * @return  Array           The RGB representation
 */
function hsvToRgb(h, s, v) {
  let r, g, b;

  let i = Math.floor(h * 6);
  let f = h * 6 - i;
  let p = v * (1 - s);
  let q = v * (1 - f * s);
  let t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }

  return [ r * 255, g * 255, b * 255 ];
}