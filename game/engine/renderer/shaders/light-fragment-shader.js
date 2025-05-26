const fragmentSourceCode = `#version 300 es
  precision mediump float;

  in vec4 v_color;
  in vec2 v_localPosition;
  in vec2 v_instanceScale;
  flat in int v_instanceShape;

  out vec4 o_color;

  vec4 renderCircle(vec4 baseColor) {
    float dist = length(v_localPosition);
    float edge = 0.49;
    float pixelSize = fwidth(dist);
    float borderOuter = edge;
    float borderInner = edge - (1.0 / max(v_instanceScale.x, v_instanceScale.y));

    float alpha = 1.0;
    vec3 premultiplied = baseColor.rgb * (baseColor.a * alpha);

    if (dist >= edge) {
      discard;
    }
    return vec4(baseColor.rgb, alpha);
  }

  vec4 renderRectangle(vec4 baseColor) {
    return baseColor;
  }

  void main() {
    vec4 baseColor;
    baseColor = v_color;

    if (v_instanceShape == 1) {
      o_color = renderCircle(baseColor);
    } else {
      o_color = renderRectangle(baseColor);
    }
  }`;

export default fragmentSourceCode