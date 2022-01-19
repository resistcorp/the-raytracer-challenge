export function clamp(value, min, max) {
  if (value < min)
    return min;
  if (value > max)
    return max;
  return value;
}
const EPSILON = 1e-5;
export function epsilonEquals(a, b) {
  return Math.abs(a - b) < EPSILON;
}
