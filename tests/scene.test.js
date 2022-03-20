import { createColor } from "../src/canvas.js";
import { intersection } from "../src/lib.js";
import { material, pointLight } from "../src/lighting.js";
import { M4x4, scaling } from "../src/matrices.js";
import { sphere } from "../src/primitives.js";
import { createRay } from "../src/rays.js";
import { createWorld } from "../src/scene.js";
import { createPoint, createVector } from "../src/tuples.js";
import { checkMaterial } from "./lighting.test.js";
import test from "./test.js";

test("creating a world", assert => {
  const world = createWorld();
  assert.arrayEqual(world.objects, []);
  assert.arrayEqual(world.lights, []);
});

const defaultLight = () => pointLight(createPoint(-10, 10, -10), createColor(1, 1, 1));
const s1 = () => sphere(M4x4.identity(), material({ color: createColor(0.8, 1.0, 0.6), diffuse: 0.7, specular: 0.2 }));
const s2 = () => sphere(scaling(0.5, 0.5, 0.5));

export function defaultWorld(){
  const theWorld = createWorld();
  theWorld.addLight(defaultLight());
  theWorld.addObject(s1());
  theWorld.addObject(s2());

  return theWorld;
}

test("the default world", assert => {
  const world = defaultWorld();
  
  assert.arrayEqual(world.objects.length, 2);

  const expected = [s1(), s2()];
  for(let i = 0; i < 2; ++i){
    assert.matrixEqual(world.objects[i].transform, expected[i].transform);
    checkMaterial(assert, world.objects[i].material, expected[i].material);
  }

  assert.arrayEqual(world.lights.length, 1);
  assert.tupleEqual(world.lights[0].position, defaultLight().position);
  assert.tupleEqual(world.lights[0].intensity, defaultLight().intensity);
});

test("intersect a world with a ray", assert => {
  const world = defaultWorld();
  
  const ray = createRay(createPoint(0, 0, -5), createVector(0, 0, 1));
  const xs = world.intersect(ray);

  assert.arrayEqual(xs.map(x => x.t), [4, 4.5, 5.5, 6]);
});

test("precomputing intersection state", assert => {
  const ray = createRay(createPoint(0, 0, -5), createVector(0, 0, 1));
  const shape = sphere();
  const i = intersection(4, shape);
  const comps = ray.prepareComputations(i);
  assert.equal(comps.t, 4.0);
  assert.equal(comps.object, shape);
  assert.tupleEqual(comps.point, createPoint(0, 0, -1));
  assert.tupleEqual(comps.eyev, createVector(0, 0, -1));
  assert.tupleEqual(comps.normalv, createVector(0, 0, -1));
});

test("The hit, when intersection occurs on the outside", assert => {
  const ray = createRay(createPoint(0, 0, -5), createVector(0, 0, 1));
  
  const shape = sphere();
  const i = intersection(4, shape);
  const comps = ray.prepareComputations(i);

  assert.equal(comps.inside, false);
});

test("The hit, when intersection occurs on the intside", assert => {
  const ray = createRay(createPoint(0, 0, 0), createVector(0, 0, 1));
  
  const shape = sphere();
  const i = intersection(1, shape);
  const comps = ray.prepareComputations(i);

  assert.tupleEqual(comps.point, createPoint(0, 0, 1));
  assert.tupleEqual(comps.eyev, createVector(0, 0, -1));
  assert.ok(comps.inside);
  //flipped
  assert.tupleEqual(comps.normalv, createVector(0, 0, -1));
});

test("shading an intersection", assert => {
  const world = defaultWorld();

  const ray = createRay(createPoint(0, 0, -5), createVector(0, 0, 1));
  const shape = world.objects[0];
  const i = intersection(4, shape);
  const comps = ray.prepareComputations(i);

  const color = world.shade(comps);
  assert.tupleEqual(color, createColor(.38066, .47583, .2855));
});

test("shading an intersection from inside", assert => {
  const world = defaultWorld();
  world.lights[0] = pointLight(createPoint(0, 0.25, 0), createColor(1, 1, 1));

  const ray = createRay(createPoint(0, 0, 0), createVector(0, 0, 1));
  const shape = world.objects[1];

  const i = intersection(0.5, shape);
  const comps = ray.prepareComputations(i);
  const color = world.shade(comps);
  assert.tupleEqual(color, createColor(.90498, .90498, .90498));
});

test("The color when a ray misses", assert => {
  const world = defaultWorld();

  const ray = createRay(createPoint(0, 0, -5), createVector(0, 1, 0));
  const color = world.colorAt(ray);

  assert.tupleEqual(color, createColor(0, 0, 0));
});

test("The color when a ray hits", assert => {
  const world = defaultWorld();

  const ray = createRay(createPoint(0, 0, -5), createVector(0, 0, 1));
  const color = world.colorAt(ray);

  assert.tupleEqual(color, createColor(.38066, .47583, .2855));
});

test("The color with an intersection behind the ray", assert => {
  const world = defaultWorld();
  const outer = sphere(M4x4.identity(), material({ color: createColor(0.8, 1.0, 0.6), diffuse: 0.7, specular: 0.2, ambient: 1.0 }));
  const inner = sphere(scaling(0.5, 0.5, 0.5), material({ color: createColor(0.2, .1, 0.8), ambient: 1.0 }));
  world.objects = [ outer, inner ];

  const ray = createRay(createPoint(0, 0, 0.75), createVector(0, 0, -1));
  const color = world.colorAt(ray);

  assert.tupleEqual(color, inner.material.color );
});
