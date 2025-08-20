export class ColorUtility {
  /**
   * Convert hex color to RGB
   */
  static hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
      throw new Error('Invalid hex color format');
    }
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    };
  }

  /**
   * Convert RGB to hex
   */
  static rgbToHex(r, g, b) {
    const toHex = (n) => {
      const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  /**
   * Convert RGB to HSL
   */
  static rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: h * 360,
      s: s * 100,
      l: l * 100
    };
  }

  /**
   * Convert HSL to RGB
   */
  static hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }

  /**
   * Calculate color distance using simplified Euclidean distance
   */
  static getColorDistance(color1, color2) {
    const dr = color1.r - color2.r;
    const dg = color1.g - color2.g;
    const db = color1.b - color2.b;
    return Math.sqrt(dr * dr + dg * dg + db * db);
  }

  /**
   * Generate color harmonies
   */
  static generateHarmonies(color) {
    let rgb;
    
    if (typeof color === 'string') {
      rgb = this.hexToRgb(color);
    } else {
      rgb = color;
    }

    const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);

    // Complementary (opposite on color wheel)
    const complementaryHue = (hsl.h + 180) % 360;
    const complementary = this.rgbToHex(...Object.values(this.hslToRgb(complementaryHue, hsl.s, hsl.l)));

    // Analogous (30° apart)
    const analogous = [
      this.rgbToHex(...Object.values(this.hslToRgb((hsl.h - 30 + 360) % 360, hsl.s, hsl.l))),
      this.rgbToHex(...Object.values(this.hslToRgb((hsl.h + 30) % 360, hsl.s, hsl.l)))
    ];

    // Triadic (120° apart)
    const triadic = [
      this.rgbToHex(...Object.values(this.hslToRgb((hsl.h + 120) % 360, hsl.s, hsl.l))),
      this.rgbToHex(...Object.values(this.hslToRgb((hsl.h + 240) % 360, hsl.s, hsl.l)))
    ];

    // Split complementary (30° on either side of complementary)
    const splitComplementary = [
      this.rgbToHex(...Object.values(this.hslToRgb((complementaryHue - 30 + 360) % 360, hsl.s, hsl.l))),
      this.rgbToHex(...Object.values(this.hslToRgb((complementaryHue + 30) % 360, hsl.s, hsl.l)))
    ];

    // Tetradic (90° apart)
    const tetradic = [
      this.rgbToHex(...Object.values(this.hslToRgb((hsl.h + 90) % 360, hsl.s, hsl.l))),
      this.rgbToHex(...Object.values(this.hslToRgb((hsl.h + 180) % 360, hsl.s, hsl.l))),
      this.rgbToHex(...Object.values(this.hslToRgb((hsl.h + 270) % 360, hsl.s, hsl.l)))
    ];

    return {
      complementary,
      analogous,
      triadic,
      splitComplementary,
      tetradic
    };
  }

  /**
   * Find products with similar colors
   */
  static async findMatchingProducts(targetColor, products, maxResults = 10, similarityThreshold = 100) {
    let targetRgb;
    
    if (typeof targetColor === 'string') {
      targetRgb = this.hexToRgb(targetColor);
    } else {
      targetRgb = targetColor;
    }

    const matches = [];

    for (const product of products) {
      for (const productColor of product.colors) {
        try {
          const productRgb = this.hexToRgb(productColor);
          const distance = this.getColorDistance(targetRgb, productRgb);
          
          if (distance <= similarityThreshold) {
            const similarity = Math.max(0, 100 - (distance / similarityThreshold) * 100);
            
            matches.push({
              product,
              similarity,
              matchedColor: productColor
            });
          }
        } catch (error) {
          // Skip invalid colors
          continue;
        }
      }
    }

    // Sort by similarity (highest first) and remove duplicates
    const uniqueMatches = matches
      .sort((a, b) => b.similarity - a.similarity)
      .filter((match, index, self) => 
        index === self.findIndex(m => m.product.id === match.product.id)
      )
      .slice(0, maxResults);

    return uniqueMatches;
  }

  /**
   * Get color name from hex (basic mapping)
   */
  static getColorName(hex) {
    const colorMap = {
      '#FF0000': 'Red',
      '#00FF00': 'Green',
      '#0000FF': 'Blue',
      '#FFFF00': 'Yellow',
      '#FF00FF': 'Magenta',
      '#00FFFF': 'Cyan',
      '#FFA500': 'Orange',
      '#800080': 'Purple',
      '#FFC0CB': 'Pink',
      '#A52A2A': 'Brown',
      '#000000': 'Black',
      '#FFFFFF': 'White',
      '#808080': 'Gray',
      '#008080': 'Teal',
      '#4B0082': 'Indigo',
      '#EE82EE': 'Violet',
      '#FF1493': 'Deep Pink',
      '#32CD32': 'Lime Green',
      '#FFD700': 'Gold',
      '#DC143C': 'Crimson'
    };

    return colorMap[hex.toUpperCase()] || 'Unknown';
  }

  /**
   * Generate a color palette based on a base color
   */
  static generatePalette(baseColor, variations = 5) {
    const rgb = this.hexToRgb(baseColor);
    const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    const palette = [baseColor];
    
    // Generate lighter variations
    for (let i = 1; i <= Math.floor(variations / 2); i++) {
      const lightness = Math.min(100, hsl.l + (i * 15));
      const color = this.rgbToHex(...Object.values(this.hslToRgb(hsl.h, hsl.s, lightness)));
      palette.push(color);
    }
    
    // Generate darker variations
    for (let i = 1; i <= Math.floor(variations / 2); i++) {
      const lightness = Math.max(0, hsl.l - (i * 15));
      const color = this.rgbToHex(...Object.values(this.hslToRgb(hsl.h, hsl.s, lightness)));
      palette.push(color);
    }
    
    return palette.slice(0, variations);
  }

  /**
   * Check if a color is light or dark
   */
  static isLightColor(color) {
    let rgb;
    
    if (typeof color === 'string') {
      rgb = this.hexToRgb(color);
    } else {
      rgb = color;
    }
    
    // Calculate relative luminance
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    return luminance > 0.5;
  }

  /**
   * Get contrasting text color (black or white)
   */
  static getContrastColor(backgroundColor) {
    return this.isLightColor(backgroundColor) ? '#000000' : '#FFFFFF';
  }
}

// Export individual functions for convenience
export const {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  generateHarmonies,
  findMatchingProducts,
  getColorName,
  generatePalette,
  isLightColor,
  getContrastColor
} = ColorUtility;
