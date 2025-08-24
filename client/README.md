# Looklyy - Fashion Lookboard App

A beautiful fashion app for creating and managing brand lookboards with a modern purple theme.

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

### Starting Production Server
```bash
npm start
```

## 🎨 Tailwind Health Check

**IMPORTANT: Always run the health check before pushing to ensure styles are working correctly!**

### Running the Health Check
```bash
npm run check:styles
```

This script will:
1. ✅ Build the Next.js application
2. ✅ Start the server locally
3. ✅ Fetch the homepage
4. ✅ Check for Tailwind CSS classes
5. ✅ Verify custom CSS classes are present
6. ✅ Ensure the page is properly styled

### What the Health Check Validates
- **Tailwind Classes**: `bg-`, `text-`, `border-`, `rounded-`, `shadow-`, etc.
- **Custom Classes**: `auth-container`, `auth-box`, `auth-form`, etc.
- **Critical Elements**: Input fields, buttons, and form styling
- **CSS Inclusion**: Ensures CSS files are being loaded

### Pre-Deployment Checklist
Before pushing to production:
1. ✅ Run `npm run check:styles`
2. ✅ Ensure all tests pass
3. ✅ Verify the build completes successfully
4. ✅ Check that the app renders correctly locally

## 🎯 Features

- **Beautiful Authentication**: Sliding sign-in/sign-up forms
- **Purple Theme**: Consistent #8f1eae color scheme
- **Responsive Design**: Works on all devices
- **Modern UI/UX**: Smooth animations and transitions
- **Brand Identity**: Custom Looklyy logo and styling

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18
- **Styling**: Tailwind CSS, Custom CSS
- **Authentication**: JWT-based auth
- **Deployment**: Render (Frontend), Render (Backend)

## 📁 Project Structure

```
client/
├── src/
│   ├── app/
│   │   ├── page.js          # Main homepage
│   │   ├── layout.js        # Root layout
│   │   └── globals.css      # Global styles
│   └── components/
│       ├── AuthForm.js      # Authentication component
│       ├── AuthForm.css     # Auth form styles
│       └── Dashboard.js     # Dashboard component
├── check-styles.ps1         # Tailwind health check (Windows)
├── check-styles.sh          # Tailwind health check (Unix)
├── start.sh                 # Production start script
└── package.json
```

## 🚨 Troubleshooting

### Styles Not Loading
If you see unstyled content:
1. Run `npm run check:styles` to diagnose issues
2. Check that Tailwind CSS is properly configured
3. Verify CSS imports in components
4. Ensure build process completes successfully

### Build Failures
1. Check Node.js version (requires 18.x)
2. Clear `.next` directory: `rm -rf .next`
3. Reinstall dependencies: `npm install`
4. Run health check: `npm run check:styles`

## 📝 Contributing

1. Make your changes
2. Run `npm run check:styles` to ensure styles work
3. Test locally with `npm run dev`
4. Commit and push your changes

## 🎨 Brand Guidelines

- **Primary Color**: #8f1eae (Purple)
- **Logo**: Custom "Looklyy" design with overlapping circles
- **Tagline**: "LOOK BOARDS FOR SIMPLY FLAWLESS LOOKS"
- **Typography**: Modern sans-serif fonts
- **Style**: Clean, professional, fashion-forward
