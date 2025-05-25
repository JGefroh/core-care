const fragmentSourceCode = `#version 300 es
  precision mediump float;

  in vec4 v_color;
  in vec2 v_localPosition;
  in float v_borderSize;
  in vec4 v_borderColor;
  in vec2 v_instanceScale;
  in vec4 v_scale;

  // Textures
  in vec2 v_texCoord;
  uniform sampler2D u_texture0;


  out vec4 o_color;

    
  float random(vec2 uv) {
    return fract(sin(dot(uv ,vec2(12.9898, 78.233))) * 43758.5453);
  } 
    
  void main() {
    bool hasTexture = any(greaterThan(v_texCoord, vec2(0.001)));

    if (hasTexture) {
      // Sample the texture only, no extra effects
      o_color = texture(u_texture0, v_texCoord);
    } else {
      // Normalize localPosition from [-0.5, 0.5] to [0.0, 1.0]
      vec2 uv = v_localPosition + vec2(0.5);
      vec2 edgeDist = min(uv, 1.0 - uv);

      float relativeBorderX = v_borderSize / v_instanceScale.x;
      float relativeBorderY = v_borderSize / v_instanceScale.y;
      bool isBorder = (edgeDist.x < relativeBorderX) || (edgeDist.y < relativeBorderY);

      if (isBorder) {
        o_color = v_borderColor;
      } else {
        vec2 uv = v_localPosition + vec2(0.5); // [0,1] range
        float gradient = uv.y; // Vertical gradient
        float noise = (random(uv * 50.0) - 0.5) * 0.02; // subtle
        gradient = clamp(gradient + noise, 0.0, 1.0);
        vec3 base = v_color.rgb;
        vec3 lighter = min(base * 1.3, vec3(1.0));
        vec3 color = mix(base, lighter, gradient);
        vec2 sunPos = vec2(0.5, 1.1); // Just above center top
        float sunDist = distance(uv, sunPos);
        float sunGlow = exp(-sunDist * 15.0);
        color += vec3(1.0, 0.8, 0.6) * sunGlow;
        o_color = vec4(color, v_color.a);
      }
    }
  }
  `;

export default fragmentSourceCode