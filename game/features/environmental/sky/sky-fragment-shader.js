const fragmentSourceCode = `#version 300 es
precision mediump float;

in vec2 v_worldPosition;         // unused
in vec2 v_gradientSourceWorld;   // unused
in vec4 v_instanceColor;
in vec2 v_localPosition;

out vec4 fragColor;


void main() {
  // Map y from [-0.5, 0.5] → [0.0, 1.0]
  float t = v_localPosition.y + 0.5;

  // Invert for gradient: 0.0 (top) to 1.0 (bottom)
  float gradient = mix(0.6, 1.0, t); // darker at top, lighter at bottom

  fragColor = vec4(v_instanceColor.rgb * gradient, v_instanceColor.a);
}`;

export default fragmentSourceCode