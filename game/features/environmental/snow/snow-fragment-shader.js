const fragmentSourceCode = `#version 300 es
precision mediump float;

in vec2 vUV;
in float vAccumulation;

out vec4 fragColor;

float rand(vec2 co) {
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  vec2 seed = gl_FragCoord.xy;

  float noise = rand(seed);
  float snow = step(noise, vAccumulation);

  // Use noise to perturb color slightly (off-white hues)
  float tintR = 1.0 - rand(seed + 10.0) * 0.1;  // 0.9–1.0
  float tintG = 1.0 - rand(seed + 20.0) * 0.1;  // 0.9–1.0
  float tintB = 1.0 - rand(seed + 30.0) * 0.15; // 0.85–1.0, maybe slightly cooler

  vec3 snowColor = vec3(tintR, tintG, tintB);

  fragColor = vec4(snowColor, snow * 1.0);
}`;

export default fragmentSourceCode