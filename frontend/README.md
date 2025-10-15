# Recipe Explorer - Frontend

Modern, responsive Next.js frontend for exploring recipe data.

## 🎨 Features

- **Clean, Modern UI**: Material-UI components with custom theming
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Advanced Filtering**: Multiple search criteria with comparison operators
- **Star Ratings**: Visual rating display
- **Detail Drawer**: Slide-out panel with full recipe information
- **Pagination**: Customizable results per page (15-50)
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Backend API running on http://localhost:8000

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:3000 in your browser.

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
frontend/
├── components/
│   └── RecipeDrawer.tsx      # Recipe detail drawer component
├── lib/
│   └── api.ts                # API client and TypeScript types
├── pages/
│   ├── _app.tsx              # App wrapper with theme
│   └── index.tsx             # Main recipes page
├── styles/
│   └── globals.css           # Global styles
├── package.json
├── tsconfig.json
├── next.config.js
└── .env.local                # Environment variables
```

## 🔧 Configuration

Create `.env.local` file:

```env
NEXT_PUBLIC_API_BASE=http://localhost:8000
```

## 🎯 Components

### RecipeDrawer
Displays detailed recipe information in a slide-out drawer.

**Features:**
- Gradient header with title and cuisine
- Star rating display
- Expandable time breakdown
- Nutrition information table
- Smooth animations

### Main Page (index.tsx)
Recipe listing and search interface.

**Features:**
- Search and filter panel
- Responsive data table
- Pagination controls
- Click-to-view details
- Loading and error states

## 🎨 Theming

The app uses a custom Material-UI theme with:
- **Primary Color**: Blue (#2563eb)
- **Secondary Color**: Purple (#8b5cf6)
- **Background**: Light gray (#f8fafc)
- **Border Radius**: 12px
- **Font**: Inter

Customize in `pages/_app.tsx`.

## 📱 Responsive Breakpoints

- **xs**: 0-600px (mobile)
- **sm**: 600-900px (tablet)
- **md**: 900-1200px (small desktop)
- **lg**: 1200-1536px (desktop)
- **xl**: 1536px+ (large desktop)

## 🔍 Search Operators

### Numeric Fields (rating, total_time, calories)
- `>=4.5` - Greater than or equal to 4.5
- `<=30` - Less than or equal to 30
- `>100` - Greater than 100
- `<50` - Less than 50
- `=3.5` or `3.5` - Exactly 3.5

### Text Fields (title, cuisine)
- Partial, case-insensitive matching
- Example: "pie" matches "Apple Pie", "Pumpkin Pie", etc.

## 🎭 UI States

### Loading
- Centered spinner while fetching data
- Smooth transitions

### Empty State
- Friendly message when no recipes found
- Suggestions to adjust filters

### Error State
- Red alert banner with error message
- Automatic retry on filter change

## 📊 Performance

- **Code Splitting**: Automatic with Next.js
- **Image Optimization**: Next.js Image component ready
- **API Caching**: React state management
- **Lazy Loading**: Drawer component loads on demand

## 🧪 Testing

### Manual Testing Checklist
- [ ] Load page with recipes
- [ ] Apply title filter
- [ ] Apply cuisine filter
- [ ] Apply rating filter (>=4.5)
- [ ] Apply time filter (<=30)
- [ ] Apply calories filter (<=400)
- [ ] Change results per page
- [ ] Navigate between pages
- [ ] Click recipe to open drawer
- [ ] Expand time breakdown
- [ ] View nutrition table
- [ ] Close drawer
- [ ] Clear all filters
- [ ] Test on mobile device

## 🐛 Common Issues

### API Connection Failed
- Verify backend is running on port 8000
- Check NEXT_PUBLIC_API_BASE in .env.local
- Look for CORS errors in browser console

### Styles Not Loading
- Clear .next cache: `rm -rf .next`
- Reinstall dependencies: `npm install`
- Restart dev server

### TypeScript Errors
- Run type check: `npm run build`
- Check tsconfig.json configuration

## 📦 Dependencies

### Core
- **next**: 14.2.5
- **react**: 18.3.1
- **react-dom**: 18.3.1

### UI
- **@mui/material**: 5.16.7
- **@mui/icons-material**: 5.16.7
- **@emotion/react**: 11.13.3
- **@emotion/styled**: 11.13.0

### HTTP
- **axios**: 1.7.4

### Dev
- **typescript**: 5.x
- **@types/react**: 18.x
- **@types/node**: 20.x

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Material-UI Documentation](https://mui.com/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 📝 Future Enhancements

- [ ] Add recipe favorites
- [ ] Export search results
- [ ] Print recipe view
- [ ] Share recipe links
- [ ] Dark mode toggle
- [ ] Advanced sorting options
- [ ] Recipe comparison view
- [ ] Ingredient search

## 👤 Support

For issues or questions, refer to the main project README.
