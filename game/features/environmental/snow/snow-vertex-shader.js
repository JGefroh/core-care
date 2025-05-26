const vertexSourceCode = `#version 300 es
layout(location = 0) in vec2 aPosition;               // Static quad vertices
in vec2 a_instanceOffset;
in vec2 a_instanceScale;
in float a_instanceAngleDegrees;
in float a_instanceAccumulation;

out vec2 vUV;
out float vAccumulation;
out vec2 v_instanceOffset;

uniform mat4 u_projectionMatrix;

void main() {
  // Convert angle to radians and rotate
  float angleRad = radians(a_instanceAngleDegrees);
  mat2 rotation = mat2(
    cos(angleRad), -sin(angleRad),
    sin(angleRad),  cos(angleRad)
  );

  vec2 scaled = aPosition * a_instanceScale;
  vec2 rotated = rotation * scaled;
  vec2 worldPos = rotated + a_instanceOffset;

  gl_Position = u_projectionMatrix * vec4(worldPos, 0.0, 1.0);

  vUV = aPosition * 0.5 + 0.5; // from [-1,1] to [0,1]
  vAccumulation = a_instanceAccumulation;
  v_instanceOffset = a_instanceOffset;
}
  `;

export default vertexSourceCode