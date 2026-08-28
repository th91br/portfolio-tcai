/**
 * Smooth interpolation and step helpers for scene progress animation.
 */

export const clamp = (val: number, min = 0, max = 1): number =>
  Math.min(max, Math.max(min, val));

export const range = (
  p: number,
  [p0, p1]: [number, number],
  [v0, v1]: [number, number]
): number => {
  if (p <= p0) return v0;
  if (p >= p1) return v1;
  const ratio = (p - p0) / (p1 - p0);
  return v0 + ratio * (v1 - v0);
};

export const smoothStep = (
  p: number,
  [p0, p1]: [number, number],
  [v0, v1]: [number, number]
): number => {
  const r = clamp((p - p0) / (p1 - p0), 0, 1);
  // Cubic smoothstep: 3x^2 - 2x^3
  const smoothR = r * r * (3 - 2 * r);
  return v0 + smoothR * (v1 - v0);
};
