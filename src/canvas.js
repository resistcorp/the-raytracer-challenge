import Tuples from "./tuples.js";
import {clamp} from "./lib.js"

const Canvas = {
  makeColor: function (r, g, b, a = 0.0) {
    return new Proxy(Tuples.makeTuple(r, g, b, a), colorHandler);
  },
  mult: function (a, b) {
    //FIXME: only makes sense for colors
    return Canvas.makeColor(a.r * b.r, a.g * b.g, a.b * b.b, a.a * b.a);
  },

  create: function (width, height) {
    let ret = Array(width * height);
    for (let i = 0; i < ret.length; i++)
      ret[i] = Canvas.makeColor(.0, .0, .0);
    Object.assign(ret, { width, height });
    return ret;
  },
  rangeCheck: function (cnv, x, y) {
    return x >= 0 && x < cnv.width && y >= 0 && y < cnv.height;
  },
  writePixel: function (cnv, x, y, color) {
    if( Canvas.rangeCheck(cnv, x, y))
      cnv[x + y * cnv.width] = Canvas.makeColor(color.r, color.g, color.b);
  },
  pixelAt: function (cnv, x, y) {
    if( Canvas.rangeCheck(cnv, x, y))
      return cnv[x + y * cnv.width];
  },
  colorToPPM: function (color) {
    return [color.red, color.green, color.blue].map(val => "" + Math.round(0.49 + 255 * clamp(val, 0, 1)));
  },
  toPPM: function (cnv) {
    let { width, height } = cnv;
    let header = ["P3", `${width} ${height}`, "255"];
    let data = [];
    for (let y = 0; y < height; y++) {
      let dataLine = "";
      for (let x = 0; x < width; x++) {
        let vals = Canvas.colorToPPM(Canvas.pixelAt(cnv, x, y));
        for (let val of vals) {
          if (dataLine.length + val.length > 69) {
            data.push(dataLine);
            dataLine = "";
          }
          if (dataLine != "")
            dataLine += " ";
          dataLine += val
        }
      }
      if (dataLine != "")
        data.push(dataLine);
    }
    return [...header, ...data, ""].join("\n");
  }
};

function colorToVec(obj, prop) {
  // TODO: check performance?
  /*
  return obj[{ r: "x", g: "y", b: "z" }[prop]];
  /*/
  switch (prop) {
    case 'red':
    case 'r':
      return obj.x;
    case 'green':
    case 'g':
      return obj.y;
    case 'blue':
    case 'b':
      return obj.z;
    case 'alpha':
    case 'a':
      return obj.w;
    default: return obj[prop]
  }
  //*/
}
const colorHandler = {
  get: colorToVec
}
export default Canvas;