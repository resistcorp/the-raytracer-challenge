import { createColor } from "../src/canvas.js";
import { lighting, material, pointLight } from "../src/lighting.js";
import { rotation_z, scaling, translation } from "../src/matrices.js";
import { sphere } from "../src/primitives.js";
import Tuples, { createPoint, createVector } from "../src/tuples.js";
import test from "./test.js";

const PI = Math.PI;
const SQRT2_OVER2 = Math.SQRT2 / 2;

test("normals of the sphere on axes", assert => {
  const axes = [createVector(1, 0, 0), createVector(0, 1, 0), createVector(0, 0, 1)];
  const s = sphere();
  for(const axis of axes){
    const p = Tuples.add(createPoint(0, 0, 0), axis);
    const n = s.normalAt(p);
    assert.tupleEqual(n, axis);
  }
});

test("the normal on a sphere at a non-axial point point", assert => {
  const s = sphere();
  const sqrt3Over3 = Math.sqrt(3) / 3;
  const n = s.normalAt(createPoint(sqrt3Over3, sqrt3Over3, sqrt3Over3));
  assert.tupleEqual(n, createVector(sqrt3Over3, sqrt3Over3, sqrt3Over3));
});

test("the normal is a normalized vector", assert => {
  const s = sphere();
  const n = s.normalAt(createPoint(1, 1, 1));
  
  //a bit useless if you ask me
  assert.tupleEqual(n, Tuples.normalize(n));
});

test("computing the normal on a translated sphere", assert => {
  const s = sphere(translation(0, 1, 0));
  const n = s.normalAt(createPoint(0, 1.70711, -0.70711));

  assert.tupleEqual(n, createVector(0, 0.70711, -0.70711));
});

//TODO: come back to this test
test("computing the normal on a transformed sphere", assert => {
  const s = sphere(scaling(1, 0.5, 1).mul(rotation_z(PI/5)));
  const n = s.normalAt(createPoint(0, SQRT2_OVER2, -Math.SQRT2/2));

  assert.tupleEqual(n, createVector(0, 0.97014, -0.24254));
});

test("reflecting a vector approaching at 45°", assert => {
  const v = createVector(1, -1, 0);
  const n = createVector(0, 1, 0);

  const r = Tuples.reflect(v, n);
  assert.tupleEqual(r, createVector(1, 1, 0));
});

test("reflecting a vector off a slanted surface", assert => {
  const v = createVector(0, -1, 0);
  const n = createVector(SQRT2_OVER2, SQRT2_OVER2, 0);

  const r = Tuples.reflect(v, n);
  assert.tupleEqual(r, createVector(1, 0, 0));
});

test("a pointlight has a position and intensity", assert => {
  const intensity = createColor(1, 1, 1);
  const position = createPoint(0, 0, 0);
  const light = pointLight(position, intensity);
  assert.tupleEqual(light.position, position);
  assert.tupleEqual(light.intensity, intensity);
});

test("the default material", assert => {
  const m = material();
  const color = createColor(1, 1, 1);
  const ambient = 0.1;
  const diffuse = 0.9;
  const specular = 0.9;
  const shininess = 200;
  checkMaterial(assert, m, {color, ambient, diffuse, specular, shininess});
});
test("a material can be constructed with other variables", assert => {
  const color = createColor(0, 0, 0);
  const ambient = 5;
  const diffuse = 2;
  const specular = 1;
  const shininess = 2000;
  const m = material({ color, ambient, diffuse, specular, shininess });
  checkMaterial(assert, m, { color, ambient, diffuse, specular, shininess });
});
test("a sphere has a default material", assert => {
  const s = sphere();
  checkMaterial(assert, s.material, material());
});
test("a sphere can be assigned a reference to a material", assert => {
  const s = sphere();
  const m = material();
  s.setMaterial(m);
  m.ambient = 1.0;
  checkMaterial(assert, s.material, material({ambient:1.0}));
});
function checkMaterial(assert, m, {color, ambient, diffuse, specular, shininess}) {
  assert.tupleEqual(m.color, color);
  assert.equal(m.ambient, ambient);
  assert.equal(m.diffuse, diffuse);
  assert.equal(m.specular, specular);
  assert.equal(m.shininess, shininess);
}

function lightTest(eyev, lightPos){
  return lighting(material(), pointLight(lightPos, createColor(1,1,1)), createPoint(0, 0, 0), eyev, createVector(0, 0, -1));
}

test("lighting with the eye between light and surface", assert => {
  const result = lightTest(createVector(0, 0, -1), createPoint(0, 0, -10));
  assert.tupleEqual(result, createColor(1.9, 1.9, 1.9));
});

test("lighting with the eye between light and surface, eye offset 45°", assert => {
  const result = lightTest(createVector(0, SQRT2_OVER2, -SQRT2_OVER2), createPoint(0, 0, -10));
  assert.tupleEqual(result, createColor(1.0, 1.0, 1.0));
});

test("lighting with the eye opposite surface, light offset 45°", assert => {
  const result = lightTest(createVector(0, 0, -1), createPoint(0, 10, -10));
  assert.tupleEqual(result, createColor(0.7364, 0.7364, 0.7364));
});

test("lighting with the eye in the path of the reflection", assert => {
  const result = lightTest(createVector(0, -SQRT2_OVER2, -SQRT2_OVER2), createPoint(0, 10, -10));
  assert.tupleEqual(result, createColor(1.6364, 1.6364, 1.6364));
});

test("lighting with the light behind the surface", assert => {
  const result = lightTest(createVector(0, 0, -1), createPoint(0, 0, 10));
  assert.tupleEqual(result, createColor(0.1, 0.1, 0.1));
});

