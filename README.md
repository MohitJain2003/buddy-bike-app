# Buddy Bike App 🚲

A modern, premium bike dealer web application built with React, Vite, and Supabase. Features a sleek dark theme interface with 3D animations, comprehensive bike catalog, admin dashboard, and EMI calculator.

**Live Demo**: [https://buddy-bike-app.vercel.app](https://buddy-bike-app.vercel.app)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Development](#development)
- [Building](#building)
- [Project Structure](#project-structure)
- [Pages & Routes](#pages--routes)
- [Admin Dashboard](#admin-dashboard)
- [Deployment](#deployment)
- [Scripts](#scripts)
- [Code Quality](#code-quality)
- [Contributing](#contributing)

---

## ✨ Features

### Customer Features
- **Home Page**: Hero section with 3D animations and featured bikes
- **Bike Catalog**: Browse all bikes with advanced filtering and search
- **Bike Details**: Detailed information about individual bikes with specs
- **EMI Calculator**: Calculate bike installment plans
- **Contact Page**: Customer inquiry form
- **Premium UI**: Modern dark theme with glass-morphism effects

### Admin Features
- **Admin Dashboard**: Comprehensive management interface
- **Bike Management**: Add, edit, and delete bikes
- **Inventory Management**: Track bike availability and pricing
- **Secure Login**: Protected admin routes

### Design Features
- ✅ Responsive Design (Mobile, Tablet, Desktop)
- ✅ Dark Theme with Premium Aesthetics
- ✅ Glass-morphism UI Components
- ✅ Smooth Transitions & Animations
- ✅ 3D Canvas Background (Three.js)
- ✅ Custom CSS Design Tokens System

---

## 🛠️ Tech Stack

### Frontend
- **React** 19.2.5 - UI library
- **Vite** 8.0.10 - Build tool & dev server
- **React Router DOM** 7.14.2 - Client-side routing

### Backend & Data
- **Supabase** 2.105.1 - Backend as a Service (PostgreSQL, Auth, Storage)

### 3D Graphics
- **Three.js** 0.184.0 - 3D animations & WebGL rendering

### UI & Icons
- **Lucide React** 1.14.0 - Icon library

### Development & Quality
- **ESLint** 10.2.1 - Code linting
- **Prettier** - Code formatting (configured)

---

## 📦 Prerequisites

Before you begin, ensure you have installed:

- **Node.js** (v18+)
- **npm** or **yarn** (v9+)
- A **Supabase account** with a project initialized

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/MohitJain2003/buddy-bike-app.git
cd buddy-bike-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

Get these values from your [Supabase Dashboard](https://app.supabase.com):
- Go to Project Settings → API
- Copy the "Project URL" and "anon public" key

---

## 🎯 Environment Setup

### Supabase Configuration

1. **Create a Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project

2. **Create Tables**:
   - `bikes` - Store bike inventory
   - `users` - Admin user authentication
   - Configure Row Level Security (RLS) policies

3. **Get API Keys**:
   - Navigate to Settings → API
   - Copy Project URL and anon key
   - Add to `.env.local`

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGc...` |

---

## 💻 Development

### Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Hot Module Replacement (HMR)
- Vite enables fast refresh—changes are reflected instantly
- Full page reload only when necessary

### Development Features
- ESLint validation
- Prettier formatting
- Source maps for debugging

---

## 🏗️ Building

### Production Build

```bash
npm run build
```

Output files are generated in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

This serves the production build locally for testing before deployment.

---

## 📁 Project Structure

```
buddy-bike-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── ...
│   ├── pages/               # Page components
│   │   ├── Home.jsx
│   │   ├── Bikes.jsx
│   │   ├── BikeDetails.jsx
│   │   ├── Contact.jsx
│   │   ├── EmiCalculator.jsx
│   │   └── admin/
│   │       ├── AdminLogin.jsx
│   │       ├── AdminDashboard.jsx
│   │       ├── ManageBikes.jsx
│   │       ├── AddBike.jsx
│   │       └── EditBike.jsx
│   ├── utils/               # Utility functions & API calls
│   ├── assets/              # Images, fonts, static files
│   ├── App.jsx              # Root component & routing
│   ├── main.jsx             # Entry point
│   ├── App.css              # App-level styles
│   └── index.css            # Global styles & design tokens
├── public/                  # Public assets
├── .env.local               # Environment variables (not in git)
├── .env.example             # Example environment variables
├── .gitignore               # Git ignore rules
├── eslint.config.js         # ESLint configuration
├── vite.config.js           # Vite configuration
├── vercel.json              # Vercel deployment config
├── package.json             # Dependencies & scripts
├── package-lock.json        # Locked dependency versions
└── README.md                # This file
```

---

## 🗺️ Pages & Routes

### Public Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | Home | Landing page with hero section |
| `/bikes` | Bikes | Browse all available bikes |
| `/bikes/:id` | BikeDetails | Individual bike information |
| `/contact` | Contact | Contact form for inquiries |
| `/emi-calculator` | EmiCalculator | EMI calculation tool |

### Admin Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/admin` | AdminLogin | Admin login page |
| `/admin/dashboard` | AdminDashboard | Main admin interface |
| `/admin/manage-bikes` | ManageBikes | Bike inventory management |
| `/admin/add-bike` | AddBike | Add new bike listing |
| `/admin/edit-bike/:id` | EditBike | Edit existing bike |

---

## 👨‍💼 Admin Dashboard

### Features
- **Secure Login**: Password-protected admin access
- **Bike Management**: CRUD operations on bike inventory
- **Pricing**: Update bike prices and EMI details
- **Inventory**: Track stock and availability

### Accessing Admin Panel
1. Navigate to `/admin`
2. Enter admin credentials
3. Access full management dashboard

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

The app is already configured for Vercel with `vercel.json`.

#### Option 1: Using Vercel CLI
```bash
npm install -g vercel
vercel
```

#### Option 2: Using GitHub Integration
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables in Vercel settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy

#### Option 3: Manual Deployment
```bash
npm run build
# Deploy the 'dist' folder to your hosting provider
```

### Environment Variables in Production
Ensure the following are set in your deployment platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## 📜 Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint on all files
npm run lint
```

---

## ✅ Code Quality

### ESLint
The project uses ESLint for code quality assurance.

**Check code**:
```bash
npm run lint
```

**Configuration**: See `eslint.config.js`

### Recommended Tools
- **Prettier**: Auto-format code
- **VS Code Extensions**:
  - ESLint
  - Prettier
  - ES7+ React/Redux/React-Native snippets

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature`
3. **Commit changes**: `git commit -am 'Add new feature'`
4. **Push to branch**: `git push origin feature/your-feature`
5. **Submit a Pull Request**

### Code Standards
- Follow ESLint rules
- Write meaningful commit messages
- Test your changes locally
- Update README if needed

---

## 🐛 Troubleshooting

### Port 5173 Already in Use
```bash
npm run dev -- --port 3000
```

### Supabase Connection Issues
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local`
- Check Supabase project is active
- Ensure RLS policies allow public access where needed

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📞 Support

For issues, questions, or suggestions:
- Open an [Issue](https://github.com/MohitJain2003/buddy-bike-app/issues)
- Check existing documentation
- Review deployment logs in Vercel dashboard

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🙏 Acknowledgments

- React & Vite communities for excellent tooling
- Supabase for backend infrastructure
- Three.js for 3D rendering capabilities
- Lucide React for beautiful icons

---

**Built with ❤️ by [Mohit Jain](https://github.com/MohitJain2003)**

**Last Updated**: June 2026
