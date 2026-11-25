export function gyroidValue(x: number, y: number, z: number, frequency = 2.6): number {
  const qx = x * frequency;
  const qy = y * frequency;
  const qz = z * frequency;
  return (
    Math.sin(qx) * Math.cos(qy) +
    Math.sin(qy) * Math.cos(qz) +
    Math.sin(qz) * Math.cos(qx)
  );
}

export function gyroidSDF(
  x: number,
  y: number,
  z: number,
  t = 0,
  frequency = 2.6,
  thickness = 0.14,
  radius = 1.12,
): number {
  const shell = (Math.abs(gyroidValue(x, y, z, frequency) - t) - thickness) / (frequency * 1.6);
  return Math.max(Math.hypot(x, y, z) - radius, shell);
}
