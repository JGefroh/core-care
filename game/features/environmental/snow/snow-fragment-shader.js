const fragmentSourceCode = `#version 300 es
precision mediump float;

in vec2 vUV;
in float vAccumulation;
in vec2 v_instanceOffset;

out vec4 fragColor;

float rand(vec2 co) {
  return fract(sin(dot(co.xy ,vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 seed = v_instanceOffset + floor(vUV * 50.0);

  float noise = rand(seed);
  float snow = step(noise, vAccumulation);

  if (snow == 0.0) {
    discard;
  }

  float tintR = 1.0 - rand(seed + 10.0) * 0.1;
  float tintG = 1.0 - rand(seed + 20.0) * 0.1;
  float tintB = 1.0 - rand(seed + 30.0) * 0.15;

  vec3 snowColor = vec3(tintR, tintG, tintB);
  fragColor = vec4(snowColor, 1.0); // snow pixels are fully opaque
}`;

export default fragmentSourceCode