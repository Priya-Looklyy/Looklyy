export class ImageColorExtractor {
  /**
   * Extract dominant colors from a single image
   */
  static async extractColors(imageUrl, maxColors = 5) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set canvas size
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Draw image to canvas
          ctx.drawImage(img, 0, 0);
          
          // Get image data
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          // Extract dominant colors
          const dominantColors = this.extractColorsFromData(data, maxColors);
          
          // Calculate average color
          const averageColor = this.calculateAverageColor(data);
          
          // Find vibrant and muted colors
          const vibrantColor = this.findVibrantColor(dominantColors);
          const mutedColor = this.findMutedColor(dominantColors);
          
          resolve({
            dominantColors,
            averageColor,
            vibrantColor,
            mutedColor
          });
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = imageUrl;
    });
  }

  /**
   * Extract colors from image data
   */
  static extractColorsFromData(data, maxColors) {
    const colorMap = new Map();
    const step = 4; // RGBA values
    
    // Sample pixels (every 10th pixel for performance)
    for (let i = 0; i < data.length; i += step * 10) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Skip transparent pixels
      if (data[i + 3] < 128) continue;
      
      // Group similar colors
      const colorKey = this.getColorGroupKey({ r, g, b });
      
      if (colorMap.has(colorKey)) {
        colorMap.set(colorKey, colorMap.get(colorKey) + 1);
      } else {
        colorMap.set(colorKey, 1);
      }
    }
    
    // Convert to array and sort by frequency
    const colors = Array.from(colorMap.entries())
      .map(([colorKey, count]) => {
        const [r, g, b] = colorKey.split(',').map(Number);
        return {
          color: this.rgbToHex(r, g, b),
          rgb: { r, g, b },
          count,
          percentage: 0
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, maxColors);
    
    // Calculate percentages
    const totalCount = colors.reduce((sum, color) => sum + color.count, 0);
    colors.forEach(color => {
      color.percentage = (color.count / totalCount) * 100;
    });
    
    return colors;
  }

  /**
   * Calculate average color from image data
   */
  static calculateAverageColor(data) {
    let r = 0, g = 0, b = 0, count = 0;
    const step = 4;
    
    // Sample pixels for average calculation
    for (let i = 0; i < data.length; i += step * 5) {
      if (data[i + 3] >= 128) { // Skip transparent pixels
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
      }
    }
    
    if (count === 0) return '#808080'; // Default gray
    
    return this.rgbToHex(
      Math.round(r / count),
      Math.round(g / count),
      Math.round(b / count)
    );
  }

  /**
   * Find the most vibrant color from dominant colors
   */
  static findVibrantColor(colors) {
    if (colors.length === 0) return '#808080';
    
    // Find color with highest saturation
    let mostVibrant = colors[0];
    let maxSaturation = 0;
    
    for (const color of colors) {
      const hsl = this.rgbToHsl(color.rgb.r, color.rgb.g, color.rgb.b);
      if (hsl.s > maxSaturation) {
        maxSaturation = hsl.s;
        mostVibrant = color;
      }
    }
    
    return mostVibrant.color;
  }

  /**
   * Find the most muted color from dominant colors
   */
  static findMutedColor(colors) {
    if (colors.length === 0) return '#808080';
    
    // Find color with lowest saturation
    let mostMuted = colors[0];
    let minSaturation = 100;
    
    for (const color of colors) {
      const hsl = this.rgbToHsl(color.rgb.r, color.rgb.g, color.rgb.b);
      if (hsl.s < minSaturation) {
        minSaturation = hsl.s;
        mostMuted = color;
      }
    }
    
    return mostMuted.color;
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
   * Extract colors from multiple images
   */
  static async extractColorsFromMultipleImages(imageUrls, maxColorsPerImage = 3) {
    try {
      const allColors = [];
      
      // Extract colors from each image
      for (const imageUrl of imageUrls) {
        try {
          const palette = await this.extractColors(imageUrl, maxColorsPerImage);
          allColors.push(...palette.dominantColors);
        } catch (error) {
          console.warn(`Failed to extract colors from ${imageUrl}:`, error);
        }
      }
      
      if (allColors.length === 0) {
        throw new Error('No colors could be extracted from any images');
      }
      
      // Group similar colors across all images
      const groupedColors = this.groupSimilarColors(allColors);
      
      // Calculate overall averages
      const totalR = groupedColors.reduce((sum, color) => sum + color.rgb.r, 0);
      const totalG = groupedColors.reduce((sum, color) => sum + color.rgb.g, 0);
      const totalB = groupedColors.reduce((sum, color) => sum + color.rgb.b, 0);
      const count = groupedColors.length;
      
      const averageColor = this.rgbToHex(
        Math.round(totalR / count),
        Math.round(totalG / count),
        Math.round(totalB / count)
      );
      
      // Find vibrant and muted colors from the combined palette
      const vibrantColor = this.findVibrantColor(groupedColors);
      const mutedColor = this.findMutedColor(groupedColors);
      
      return {
        dominantColors: groupedColors.slice(0, 8), // Top 8 colors
        averageColor,
        vibrantColor,
        mutedColor
      };
    } catch (error) {
      throw new Error(`Failed to extract colors from multiple images: ${error.message}`);
    }
  }

  /**
   * Group similar colors together
   */
  static groupSimilarColors(colors) {
    const groups = [];
    const similarityThreshold = 30; // RGB distance threshold
    
    for (const color of colors) {
      let addedToGroup = false;
      
      for (const group of groups) {
        const distance = this.getColorDistance(color.rgb, group.rgb);
        if (distance <= similarityThreshold) {
          // Add to existing group
          group.count += color.count;
          group.percentage += color.percentage;
          addedToGroup = true;
          break;
        }
      }
      
      if (!addedToGroup) {
        groups.push({ ...color });
      }
    }
    
    // Sort by count and recalculate percentages
    groups.sort((a, b) => b.count - a.count);
    const totalCount = groups.reduce((sum, color) => sum + color.count, 0);
    groups.forEach(color => {
      color.percentage = (color.count / totalCount) * 100;
    });
    
    return groups;
  }

  /**
   * Calculate color distance between two RGB colors
   */
  static getColorDistance(color1, color2) {
    const dr = color1.r - color2.r;
    const dg = color1.g - color2.g;
    const db = color1.b - color2.b;
    return Math.sqrt(dr * dr + dg * dg + db * db);
  }

  /**
   * Get color group key for grouping similar colors
   */
  static getColorGroupKey(rgb) {
    // Round to nearest 10 for grouping
    const r = Math.round(rgb.r / 10) * 10;
    const g = Math.round(rgb.g / 10) * 10;
    const b = Math.round(rgb.b / 10) * 10;
    return `${r},${g},${b}`;
  }

  /**
   * Convert hex to RGB
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
}

// Export individual functions for convenience
export const {
  extractColors,
  extractColorsFromMultipleImages
} = ImageColorExtractor;
