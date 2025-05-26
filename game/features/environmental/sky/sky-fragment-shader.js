const fragmentSourceCode = `#version 300 es
precision mediump float;

in vec2 v_localPosition;
in vec4 v_instanceColor;
out vec4 fragColor;

void main() {
  fragColor = v_instanceColor;
}`;

export default fragmentSourceCode