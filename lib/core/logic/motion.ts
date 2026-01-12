import { SHAKE_THRESHOLD } from "../constants";

type Vector3 = {
  x: number;
  y: number;
  z: number;
};

export const isShaking = (data: Vector3): boolean => {
  const magnitude = Math.sqrt(
    data.x ** 2 + data.y ** 2 + data.z ** 2
  );

  return magnitude > SHAKE_THRESHOLD;
};
