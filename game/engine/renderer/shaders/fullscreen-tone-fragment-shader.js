const fragmentSourceCode = `#version 300 es
precision mediump float;

in vec4 v_color;
in vec2 v_uv; // You must output this from the vertex shader
out vec4 o_color;

uniform sampler2D u_sourceTexture;

void main() {
  o_color = vec4(1,0,1,0);
  return;

  float mask = texture(u_sourceTexture, v_uv).r;

  // Invert the mask: where light is strong, alpha is reduced
  float toneAlpha = 1.0 - mask;

  vec3 toneColor = v_color.rgb * toneAlpha;
  o_color = vec4(toneColor, toneAlpha * v_color.a);
}
`;

export default fragmentSourceCode