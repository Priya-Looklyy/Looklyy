# 🎨 Look Suggestions Feature

The Look Suggestions feature automatically analyzes your lookboard images and suggests matching products based on color theory principles.

## ✨ Features

### **Automatic Color Extraction**
- Extracts dominant colors from uploaded images using Canvas API
- Identifies average, vibrant, and muted colors
- Calculates color percentages and distributions

### **Color Theory Integration**
- **Complementary Colors**: High contrast looks with opposite colors
- **Analogous Colors**: Harmonious looks with similar color families
- **Triadic Colors**: Balanced, vibrant color combinations

### **Smart Product Matching**
- Finds products with similar colors from your database
- Calculates color similarity percentages
- Groups suggestions by color harmony type

## 🚀 How to Use

### 1. **Navigate to a Lookboard**
- Go to your profile page
- Click on any existing lookboard
- Or create a new lookboard with images

### 2. **Generate Suggestions**
- Scroll down to the "Get Look Suggestions" section
- Click the **"Suggest Looks"** button
- Wait for the system to analyze your images

### 3. **View Results**
- **Extracted Color Palette**: See the dominant colors from your images
- **Look Suggestions**: Browse products organized by color theory
- **Product Details**: View matching products with similarity scores

## 🔧 Technical Implementation

### **Color Extraction Engine**
```typescript
// Extract colors from multiple images
const colorPalette = await ImageColorExtractor.extractColorsFromMultipleImages(
  lookboardImages,
  3 // max colors per image
)
```

### **Color Theory Application**
```typescript
// Generate harmonies for dominant colors
const harmonies = ColorUtility.generateHarmonies(dominantColor)

// Find matching products for each harmony type
const complementary = await ColorUtility.findMatchingProducts(
  harmonies.complementary,
  products,
  4, // max results
  80  // similarity threshold
)
```

### **Product Matching Algorithm**
- Uses Euclidean distance for color similarity
- Configurable similarity thresholds
- Removes duplicate products
- Sorts by similarity percentage

## 📁 File Structure

```
client/src/
├── components/
│   ├── LookSuggestions.tsx          # Main suggestions component
│   └── ColorSuggestionTool.tsx      # Color utility tool
├── utils/
│   ├── colorUtils.ts                # Color theory utilities
│   └── imageColorExtractor.ts       # Image color extraction
└── app/
    ├── lookboard/[id]/page.js       # Lookboard detail with suggestions
    ├── color-tool/page.js           # Color analysis tool
    └── test-color-extraction/page.js # Testing page
```

## 🎯 Use Cases

### **Fashion Styling**
- Create cohesive outfits based on color harmony
- Find complementary accessories
- Build seasonal color palettes

### **Interior Design**
- Match furniture colors to room aesthetics
- Create harmonious color schemes
- Find accent pieces

### **Brand Development**
- Analyze brand color consistency
- Create complementary product lines
- Develop seasonal color strategies

## 🧪 Testing

### **Test Color Extraction**
Visit `/test-color-extraction` to test the color extraction with any image URL.

### **Sample Data**
Run the seed script to populate your database with sample products:
```bash
cd server
npm run seed
```

## ⚙️ Configuration

### **Similarity Thresholds**
Adjust color matching sensitivity in `LookSuggestions.tsx`:
```typescript
const [complementary, analogous, triadic] = await Promise.all([
  ColorUtility.findMatchingProducts(harmonies.complementary, products, 4, 80), // 80 = threshold
  ColorUtility.findMatchingProducts(harmonies.analogous[0], products, 4, 80),
  ColorUtility.findMatchingProducts(harmonies.triadic[0], products, 4, 80)
])
```

### **Color Extraction Settings**
Modify extraction parameters in `imageColorExtractor.ts`:
```typescript
// Adjust canvas size for performance vs accuracy
const maxSize = 150 // pixels

// Change color quantization for grouping
const quantizedR = Math.floor(r / 32) * 32 // 32 = quantization factor
```

## 🔍 Troubleshooting

### **Common Issues**

1. **"No images available"**
   - Ensure your lookboard has uploaded images
   - Check image URLs are accessible

2. **"Failed to generate suggestions"**
   - Verify images are loading correctly
   - Check browser console for errors
   - Ensure products exist in database

3. **Poor color matches**
   - Adjust similarity threshold (lower = more strict)
   - Add more products with diverse colors
   - Check product color data format

### **Performance Tips**
- Limit images per lookboard (recommended: 3-5)
- Use compressed image formats
- Consider image dimensions (optimal: 400x300 to 800x600)

## 🎨 Color Theory Reference

### **Complementary Colors**
- Opposite on color wheel
- High contrast, dramatic looks
- Use sparingly for impact

### **Analogous Colors**
- Adjacent on color wheel
- Harmonious, cohesive looks
- Great for monochromatic schemes

### **Triadic Colors**
- Equilateral triangle on color wheel
- Balanced, vibrant combinations
- Professional, sophisticated appearance

## 🚀 Future Enhancements

- **AI-powered suggestions** using machine learning
- **Seasonal color trends** integration
- **Personal style preferences** learning
- **Social sharing** of color combinations
- **Export color palettes** for design tools

---

**Note**: This feature requires images to be accessible via HTTPS URLs and may not work with local file uploads due to browser security restrictions.
