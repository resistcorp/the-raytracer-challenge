
export function makeTuple(x, y, z, w) {
  return { x, y, z, w };
}
export function makePoint(x, y, z) {
  return { x, y, z, w: 0.0 };
}
export function makeVector(x, y, z) {
  return { x, y, z, w: 1.0 };
}
export function isPoint(tuple) {
  return tuple.w == 1.0;
}
export function isVector(tuple) {
  return tuple.w == 0.0;
}
export default { makeTuple, makePoint, makeVector, isPoint, isVector };