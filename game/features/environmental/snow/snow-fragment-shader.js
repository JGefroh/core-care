const fragmentSourceCode = `#version 300 es
precision mediump float;

in vec2 vUV;
in float vAccumulation;
in vec2 v_instanceOffset;  // ✅ correct type

out vec4 fragColor;

float rand(vec2 co) {
  return fract(sin(dot(co.xy ,vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  // Use instance world offset as seed for consistent per-tile randomness
  vec2 seed = v_instanceOffset + floor(vUV * 50.0);  // adds slight per-fragment variation

  float noise = rand(seed);
  float snow = step(noise, vAccumulation);

  float tintR = 1.0 - rand(seed + 10.0) * 0.1;
  float tintG = 1.0 - rand(seed + 20.0) * 0.1;
  float tintB = 1.0 - rand(seed + 30.0) * 0.15;

  vec3 snowColor = vec3(tintR, tintG, tintB);

  fragColor = vec4(snowColor, snow * 1.0); // fully opaque for testing
}`;

export default fragmentSourceCode