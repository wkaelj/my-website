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
* @param {GeolocationPosition} position 
*/
function foundCoordintes(position)
{
  coordinates =  
    position.coords.latitude.toPrecision(8).toString() + ", " +
    position.coords.latitude.toPrecision(8).toString();
};

/**
 * 
 * @param {GeolocationPositionError} error 
 */
function noCoordinates (error)
{
  console.error(error);
}

function getCoordinates()
{

  navigator.geolocation.watchPosition(foundCoordintes, noCoordinates, );

}

async function getIPAddress()
{
  let req = new XMLHttpRequest()
  req.open( "GET", "https://api.ipify.org", false);
  req.send(null);
  return req.responseText.toString()
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

/**
 * @type {String}
 */
let ipAddress = "";

/**
 * @type {String}
 */
let coordinates = "Could not retrieve coordinates";

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
  window.onresize = resizeHandler;

  getIPAddress().then((string) => { ipAddress = string; });
  getCoordinates();
  console.log(ipAddress);
  console.log(coordinates);
  update();

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

class Square
{
  /**
   * @type {Number}
   */
  #increment = 2


  /**
   * @type {Number}
   */
  #max = window.innerWidth > window.innerHeight ? window.innerHeight * 0.25 : window.innerWidth * 0.25;

  /**
 * @type {Number}
 */
  #min = this.#max * 0.2;

  /**
   * @type {Number}
   */
  #sizepx = this.#min;

  /**
   * 
   * @param {CanvasRenderingContext2D} g 
   */
  update(g)
  {
    if(this.#sizepx > this.#max) this.#increment = -this.#increment;
    if(this.#sizepx < this.#min) this.#increment = -this.#increment;
    this.#sizepx += this.#increment;
    let x = window.innerWidth / 2 - this.#sizepx / 2;
    let y = window.innerHeight / 2 - this.#sizepx / 2;
    g.fillStyle = "#000000";
    g.fillRect(x, y, this.#sizepx, this.#sizepx)
  }

}

var hue = 0;
var hue2 = 0.5;
var angle = 0;
var angle2 = 0.5;
var angle3 = 1;
var angle4 = 1.5;

let square = new Square();

function update()
{
  g;
  requestAnimationFrame(update);
  const increment = 0.001;
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

  const angleIncrement = 0.01;
  angle += angleIncrement;
  if (angle >= 2) angle = 0;
  angle2 += angleIncrement;
  if (angle2 >= 2) angle2 = 0;
  angle3 += angleIncrement;
  if (angle3 >= 2) angle3 = 0;
  angle4 += angleIncrement;
  if (angle4 >= 2) angle4 = 0;

  drawCircle(g, Math.PI * angle);
  drawCircle(g, Math.PI * angle2);
  drawCircle(g, Math.PI * angle3);
  drawCircle(g, Math.PI * angle4);

  // draw user ip
  const fontSize = 30;
  g.font = fontSize.toString() + "px sans-serif";
  g.fillStyle = "#ffffff"
  g.fillText(ipAddress, 5, fontSize + 5, window.innerWidth);
  g.fillText(coordinates, 5, fontSize * 2 + 5, window.innerWidth);

  square.update(g);

  return;
}

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