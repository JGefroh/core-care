const vertexSourceCode = `#version 300 es

layout(location = 0) in vec2 a_position;
in vec2 a_instanceOffset;
in vec2 a_instanceScale;
in float a_instanceAngleDegrees;
in vec2 a_instanceGradientSource;

uniform mat4 u_projectionMatrix;
out vec2 v_localPosition;


out vec2 v_worldPosition;
out vec2 v_gradientSourceWorld;
in vec4 a_instanceColor; 
out vec4 v_instanceColor;

void main() {
  float angle = radians(a_instanceAngleDegrees);
  float c = cos(angle);
  float s = sin(angle);

  vec2 scaled = a_position * a_instanceScale;
  vec2 rotated = vec2(
    scaled.x * c - scaled.y * s,
    scaled.x * s + scaled.y * c
  );

  vec2 worldPosition = rotated + a_instanceOffset;

  gl_Position = u_projectionMatrix * vec4(worldPosition, 0.0, 1.0);

  v_worldPosition = worldPosition;
  v_gradientSourceWorld = a_instanceGradientSource;
    v_instanceColor = a_instanceColor;
    v_localPosition = a_position;
}
  `;

export default vertexSourceCode