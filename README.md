# Nike Clone - Athletic Footwear Store

![Nike Clone Preview](https://imgix.cosmicjs.com/f8826100-c9d0-11f0-93fd-8f6449263e4e-photo-1517836357463-d25dfeac3438-1764055980507.jpg?w=1200&h=300&fit=crop&auto=format,compress)

A premium athletic footwear e-commerce platform built with Next.js 16 and powered by Cosmic CMS. Features dynamic hero banners, product filtering, image galleries, and a responsive design inspired by Nike's iconic aesthetic.

## Features

- 🎯 **Dynamic Hero Banners** - Auto-rotating carousels with customizable content
- 👟 **Product Catalog** - Browse products with category and feature filtering
- 🔍 **Product Details** - Full specifications, image galleries, and size selection
- 🏷️ **Category Pages** - Dedicated collections for each product category
- 📱 **Fully Responsive** - Optimized for all screen sizes
- ⚡ **Server-Side Rendering** - Fast page loads with Next.js 16
- 🎨 **Nike-Inspired Design** - Bold typography and clean aesthetics

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](http://localhost:3040/projects/new?clone_bucket=69255b0ec1b1bf41aff1b9e4&clone_repository=69255c9fc1b1bf41aff1ba0a)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "Build a Nike clone."

### Code Generation Prompt

> "Based on the content model I created for 'Build a Nike clone.', now build a complete web application that showcases this content. Include a modern, responsive design with proper navigation, content display, and user-friendly interface."

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## Technologies

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **CMS**: [Cosmic](https://www.cosmicjs.com/docs) - Headless content management
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom configuration
- **Language**: TypeScript with strict type checking
- **Font**: Inter (Google Fonts)
- **Image Optimization**: imgix via Cosmic CDN

## Getting Started

### Prerequisites

- Node.js 18+ or Bun runtime
- Cosmic account with bucket configured
- Environment variables set up

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nike-clone
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your Cosmic credentials to `.env.local`:
```env
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-read-key
COSMIC_WRITE_KEY=your-write-key
```

5. Run the development server:
```bash
bun dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Cosmic SDK Examples

### Fetching Products

```typescript
import { cosmic } from '@/lib/cosmic'

// Get all products
const { objects: products } = await cosmic.objects
  .find({ type: 'products' })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1)

// Get featured products
const { objects: featured } = await cosmic.objects
  .find({ 
    type: 'products',
    'metadata.featured': true 
  })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1)
```

### Fetching Categories

```typescript
// Get all categories
const { objects: categories } = await cosmic.objects
  .find({ type: 'categories' })
  .props(['id', 'title', 'slug', 'metadata'])
```

## Cosmic CMS Integration

This application integrates with three Cosmic object types:

### Featured Banners
- Headline and subheadline text
- CTA button with customizable link
- Background image with text color options

### Products
- Product name, subtitle, and description
- Price with optional sale price
- Main image and gallery
- Category relationship
- Available sizes and colors
- Featured and new arrival flags

### Categories
- Category name and description
- Category image for visual display

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Netlify

1. Connect repository to Netlify
2. Set build command: `bun run build`
3. Set publish directory: `.next`
4. Add environment variables
5. Deploy

## License

MIT License - feel free to use this project for your own purposes.
<!-- README_END -->