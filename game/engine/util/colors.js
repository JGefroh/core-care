export default class Colors {
    constructor() {
        this.colorConversionCache = {}
    }
    hexToRgb(hex) {
        hex = hex.replace('#', '');
        if (hex.length === 3) {
            hex = hex.split('').map(c => c + c).join('');
        }
        const bigint = parseInt(hex, 16);
        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255
        };
    }

    rgbToHex({ r, g, b }) {
        return '#' + [r, g, b].map(c => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, '0')).join('');
    }

    lighten(baseRgb, factor) {
        const { r, g, b } = baseRgb;
        return this.rgbToHex({
            r: r + (255 - r) * factor,
            g: g + (255 - g) * factor,
            b: b + (255 - b) * factor
        });
    }

    darken(baseRgb, factor) {
        const { r, g, b } = baseRgb;
        return this.rgbToHex({
            r: r * (1 - factor),
            g: g * (1 - factor),
            b: b * (1 - factor)
        });

    }

    getShades(baseHex) {
        return [
            this.lighten(this.hexToRgb(baseHex), 0.2),   // lighter shade
            this.lighten(this.hexToRgb(baseHex), 0.1),    // slightly lighter
            baseHex,         // original
            this.darken(this.hexToRgb(baseHex), 0.1),    // slightly darker
            this.darken(this.hexToRgb(baseHex), 0.2)      // darker
        ];
    }

    random(baseHex) {
        let collection = this.getShades(baseHex);
        return this._randomFrom(collection);
    }


    _randomFrom(array) {
        return array[Math.floor(Math.random() * array.length)];
    }



  colorToRaw(colorString, normalizeTo = 1) {
    if (this.colorConversionCache[colorString]) {
      return this.colorConversionCache[colorString]
    }

    let rgbaString = colorString;
    if (!colorString) {
      rgbaString = 'rgba(0,0,0,0)'
    }
    else if (colorString.indexOf('#') != -1) {
      rgbaString = this.hexToRgbaString(colorString);
    }
    else if (colorString.indexOf('rgb(') != -1) {
      rgbaString = this.rgbToRgbaString(colorString);
    }

    let result = this.rgbaStringToRaw(rgbaString, normalizeTo);
    this.colorConversionCache[colorString] = result
    return result;
  }
  
  hexToRgbaString(hex) {
    // Remove leading #
    hex = hex.replace(/^#/, '');
  
    if (hex.length !== 6 && hex.length !== 8) {
      throw new Error('Invalid hex color. Use #RRGGBB or #RRGGBBAA.');
    }
  
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;
  
    return `rgba(${r},${g},${b},${a})`;
  }

  rgbToRgbaString(rgbString) {
    const values = rgbString.slice(4, -1).split(',').map(v => parseFloat(v.trim()));
    const [r, g, b] = values;
    return `rgba(${r},${g},${b},1)`;
  }

  rgbaStringToRaw(string, normalizeTo = 1) {
    let parts = `${string}`.split('rgba(')[1].split(',');
    let result = {
      r: parseFloat(parts[0]) / normalizeTo,
      g: parseFloat(parts[1]) / normalizeTo,
      b: parseFloat(parts[2]) / normalizeTo,
      a: parseFloat(parts[3].split(')')[0])
    };
    return result;
  }

  parseGradientStops(fillArray) {
    const stops = [];
    const colors = [];

    for (const [offset, colorStr] of fillArray) {
      const rgba = this.colorToRaw(colorStr, 255); // returns {r, g, b, a}
      stops.push(offset);
      colors.push(rgba.r, rgba.g, rgba.b, rgba.a);
    }

    return {
      stopCount: fillArray.length,
      stops: new Float32Array(stops),
      colors: new Float32Array(colors)
    };
  }


  hexToRgb(hex) {
    hex = hex.replace('#', '');
    const bigint = parseInt(hex, 16);
    return [
      (bigint >> 16) & 255,
      (bigint >> 8) & 255,
      bigint & 255,
    ];
  }
  
  rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
  
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
        case g: h = ((b - r) / d + 2); break;
        case b: h = ((r - g) / d + 4); break;
      }
      h /= 6;
    }
    return [h, s, l];
  }
  
  hslToRgb(h, s, l) {
    const hue2rgb = (p, q, t) => {
      t = (t + 1) % 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
  
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }
  
  parseRgba(rgbaStr) {
    const match = rgbaStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!match) throw new Error('Invalid RGBA format');
    return [
      parseInt(match[1], 10),
      parseInt(match[2], 10),
      parseInt(match[3], 10),
      match[4] !== undefined ? parseFloat(match[4]) : 1
    ];
  }
  
  interpolateRgba(sourceRgba, targetRgba, steps, currentStep) {
    const [r1, g1, b1, a1] = this.parseRgba(sourceRgba);
    const [r2, g2, b2, a2] = this.parseRgba(targetRgba);
  
    const [h1, s1, l1] = this.rgbToHsl(r1, g1, b1);
    const [h2, s2, l2] = this.rgbToHsl(r2, g2, b2);
  
    const t = Math.min(Math.max(currentStep / steps, 0), 1);
    const interpolate = (a, b) => a + (b - a) * t;
  
    const h = this.interpolateHueShort(h1, h2, t);
    const s = interpolate(s1, s2);
    const l = interpolate(l1, l2);
    const a = interpolate(a1, a2);
  
    const [r, g, b] = this.hslToRgb(h, s, l);
    return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a.toFixed(3)})`;
  }

  interpolateHueShort(h1, h2, t) {
    const delta = ((h2 - h1 + 1.5) % 1) - 0.5;
    return (h1 + delta * t + 1) % 1;
  }
  parseRgba(rgbaString) {
    const match = rgbaString.match(/rgba?\((\d+),(\d+),(\d+),?([\d.]+)?\)/);
    return {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3]),
      a: parseFloat(match[4] ?? '1')
    };
  }
  
  interpolateParsedRgba(c1, c2, t) {
    return {
      r: Math.round(c1.r * (1 - t) + c2.r * t),
      g: Math.round(c1.g * (1 - t) + c2.g * t),
      b: Math.round(c1.b * (1 - t) + c2.b * t),
      a: c1.a * (1 - t) + c2.a * t,
    };
  }
  
  rgbaToString({r, g, b, a}) {
    return `rgba(${r},${g},${b},${a})`;
  }
}