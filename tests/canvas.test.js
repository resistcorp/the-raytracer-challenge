import Tuples from "../src/tuples.js";
import Canvas, { createColor } from "../src/canvas.js";
import { test } from "./test.js"

test("a color is a (red, green, blue) tuple", assert => {
  let aColor = createColor(-0.5, 0.4, 1.7);
  assert.epsilonEqual(aColor.r,-0.5);
  assert.epsilonEqual(aColor.g, 0.4);
  assert.epsilonEqual(aColor.b, 1.7);
  assert.epsilonEqual(aColor.a, 0.0);
  assert.equal(aColor.r, aColor.red);
  assert.equal(aColor.r, aColor.x);
  assert.equal(aColor.g, aColor.green);
  assert.equal(aColor.b, aColor.blue);
  assert.equal(aColor.a, aColor.alpha);
});

test("The default color with one component c is createColor(c, c, c) ", assert => {
  assert.tupleEqual(createColor(0.1), createColor( 0.1, 0.1, 0.1));
});

test("The default color black ", assert => {
  assert.tupleEqual(createColor(), createColor( 0.0, 0.0, 0.0 ));
});

test("mutating a color", assert => {
  let aColor = createColor(0.0,0.0,0.0);
  aColor.r = 1.0;
  aColor.g = -1.7;
  aColor.b = 0.5;
  assert.equal(aColor.r, 1.0);
  assert.equal(aColor.g,-1.7);
  assert.equal(aColor.b, 0.5);
});
test("adding colors", assert => {
  let c1 = createColor(0.9, 0.6, 0.75);
  let c2 = createColor(0.7, 0.1, 0.25);
  let ex = createColor(1.6, 0.7, 1);
  const actual = Tuples.add(c1, c2);
  assert.tupleEqual(actual, ex);
});
test("substracting colors", assert => {
  let c1 = createColor(0.9, 0.6, 0.75);
  let c2 = createColor(0.7, 0.1, 0.25);
  let ex = createColor(0.2, 0.5, 0.5);
  const actual = Tuples.sub(c1, c2);
  assert.tupleEqual(actual, ex);
});
test("scaling colors", assert => {
  let c1 = createColor(0.2, 0.3, 0.4);
  let ex = createColor(0.4, 0.6, 0.8);
  const actual = Tuples.scale(c1, 2);
  assert.tupleEqual(actual, ex);
});
test("multiplying two colors", assert => {
  let c1 = createColor(1.0, 0.2, 0.4);
  let c2 = createColor(0.9, 1.0, 0.1);
  let ex = createColor(0.9, 0.2, 0.04);
  const actual = Canvas.mult(c1, c2);
  assert.tupleEqual(actual, ex);
});

//canvas
test("creating a canvas", assert =>{
  let cnv = Canvas.create(10, 20);
  assert.equal(cnv.width, 10)
  assert.equal(cnv.height, 20)
  const black = createColor(0.0, 0.0, 0.0);
  for(let pixel of cnv){
    assert.tupleEqual(pixel, black);
  }
});
test("addressing a canvas", assert =>{
  let cnv = Canvas.create(10, 20);
  assert.equal(cnv.width, 10)
  assert.equal(cnv.height, 20)
  const black = createColor(0.0, 0.0, 0.0);
  assert.tupleEqual(Canvas.pixelAt(cnv, 9, 9), black);
  assert.tupleEqual(Canvas.pixelAt(cnv, 9.5, 9.5), black);
});
test("constructing a ppm header", assert =>{
  let cnv = Canvas.create(5, 3);
  let ppm = Canvas.toPPM(cnv);
  let ex = `P3
5 3
255`;
  assert.ok(ppm.startsWith(ex));
});
test("constructing the ppm pixel data", assert =>{
  let cnv = Canvas.create(5, 3);
  Canvas.writePixel(cnv, 0, 0, createColor(1.5, 0.0, 0.0));
  Canvas.writePixel(cnv, 2, 1, createColor(0.0, 0.5, 0.0));
  Canvas.writePixel(cnv, 4, 2, createColor(-0.5, 0.0, 1.0));
  let ppm = Canvas.toPPM(cnv).split("\n");
  let ex = ["255 0 0 0 0 0 0 0 0 0 0 0 0 0 0",
            "0 0 0 0 0 0 0 128 0 0 0 0 0 0 0",
            "0 0 0 0 0 0 0 0 0 0 0 0 0 0 255"];
  assert.deepEqual(ppm.slice(3, 6), ex);
});
test("splitting long lines in ppm files", assert =>{
  let cnv = Canvas.create(10, 2);
  for(let x = 0; x < 10; x++){
    Canvas.writePixel(cnv, x, 0, createColor(1., 0.8, 0.6));
    Canvas.writePixel(cnv, x, 1, createColor(1., 0.8, 0.6));
  }
  let ppm = Canvas.toPPM(cnv).split("\n");
  let ex = ["255 204 153 255 204 153 255 204 153 255 204 153 255 204 153 255 204",
            "153 255 204 153 255 204 153 255 204 153 255 204 153",
            "255 204 153 255 204 153 255 204 153 255 204 153 255 204 153 255 204",
            "153 255 204 153 255 204 153 255 204 153 255 204 153"];
  assert.deepEqual(ppm.slice(3, 7), ex);
});

test("ppm files are terminated by a new line", assert =>{
  let cnv = Canvas.create(5, 3);
 
  let ppm = Canvas.toPPM(cnv);
  assert.ok(ppm.endsWith("\n"));
});

