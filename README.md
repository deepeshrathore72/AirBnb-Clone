# 🏠 Wanderlust - Full Stack Accommodation Platform

A feature-rich, production-ready Wanderlust built with Node.js, Express, MongoDB, and EJS. This project showcases modern web development practices with a focus on user experience, real-time features, and clean architecture.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### User Features
- 🔐 **Authentication & Authorization**
  - User registration and login with Passport.js
  - Session-based authentication
  - Password hashing and security
  - Protected routes for authenticated users

- 🏡 **Listing Management**
  - Browse and search listings by location, title, or country
  - Filter by 8 categories: Beachfront, Mountains, Iconic Cities, Castles, Camping, Luxury, Countryside, Boats
  - View detailed listing information with high-quality images
  - Real-time rating and review system
  - Tax-inclusive price calculator (18% GST toggle)

- ❤️ **Wishlist System**
  - Save favorite listings to personal wishlist
  - Database-backed (no localStorage dependency)
  - Requires authentication for security
  - Quick access to saved properties

- ⭐ **Reviews & Ratings**
  - 5-star rating system with visual feedback
  - Leave detailed text reviews
  - Calculate and display average ratings
  - Delete own reviews

### Host Features
- 📝 **Create Listings**
  - Modern, user-friendly listing creation form
  - Image upload with Cloudinary integration
  - Category selection with visual icons
  - Real-time image preview
  - Form validation

- ✏️ **Manage Listings**
  - Edit existing listings
  - Update images, prices, and descriptions
  - Delete listings with confirmation
  - Owner-only access control

### UI/UX Features
- 🎨 **Modern Design**
  - Minimal clean interface
  - Responsive design for all devices
  - Smooth animations and transitions
  - Gradient backgrounds and modern typography

- 🔍 **Search & Filter**
  - Real-time search functionality
  - Category-based filtering
  - Toggle filter visibility
  - Clear active filters easily

- 📱 **Fully Responsive Layout**
  - **Mobile** (< 576px): Optimized for phones with touch-friendly navigation
  - **Tablet** (576px - 991px): Adaptive grid and navigation
  - **Desktop** (992px+): Full-featured experience
  - Touch device optimizations
  - Landscape orientation support
  - Print-friendly styles

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Frontend
- **EJS** - Templating engine
- **Bootstrap 5** - CSS framework
- **Font Awesome** - Icon library
- **Custom CSS** - Additional styling
- **Responsive CSS** - Mobile, tablet, desktop breakpoints

### Authentication & Security
- **Passport.js** - Authentication middleware
- **passport-local-mongoose** - Simplified authentication
- **express-session** - Session management
- **connect-mongo** - MongoDB session store

### File Upload & Storage
- **Cloudinary** - Cloud-based image storage
- **Multer** - Multipart form data handling

### Validation
- **Joi** - Schema validation
- **Custom middleware** - Server-side validation

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.0.0 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn** package manager
- **Cloudinary Account** (for image uploads)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/Wanderlust.git
cd Wanderlust
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB Configuration
ATLASDB_URL=mongodb://localhost:27017/wanderlust
# Or use MongoDB Atlas:
# ATLASDB_URL=mongodb+srv://username:password@cluster.mongodb.net/wanderlust

# Session Secret
SECRET=your-super-secret-key-change-this-in-production

# Cloudinary Configuration
CLOUD_NAME=your-cloudinary-cloud-name
CLOUD_API_KEY=your-cloudinary-api-key
CLOUD_API_SECRET=your-cloudinary-api-secret

# Server Configuration
PORT=8080
NODE_ENV=development
```

### 4. Initialize Database

Run the seed script to populate the database with sample data:

```bash
node init/index.js
```

### 5. Start the Application

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The application will be available at `http://localhost:8080`

## ⚙️ Configuration

### Cloudinary Setup

1. Sign up for a free account at [Cloudinary](https://cloudinary.com/)
2. Navigate to your Dashboard
3. Copy your Cloud Name, API Key, and API Secret
4. Add them to your `.env` file

### MongoDB Atlas Setup (Optional)

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string
3. Replace the `ATLASDB_URL` in `.env` with your Atlas connection string

### Session Configuration

Update the session secret in `.env` for production:

```env
SECRET=your-long-random-string-for-production
```

## 📖 Usage

### For Guests

1. **Browse Listings**
   - Visit the homepage
   - Click "Explore All Listings"
   - Use search and filters to find properties

2. **View Listing Details**
   - Click on any listing card
   - View photos, description, location, and reviews
   - Check pricing and tax information

3. **Save to Wishlist**
   - Sign up/Login to your account
   - Click the heart icon on any listing
   - Access your wishlist from the navbar

4. **Leave Reviews**
   - Login to your account
   - Navigate to a listing page
   - Submit a rating and comment

### For Hosts

1. **Create Account**
   - Click "Sign Up" in the navbar
   - Fill in your details
   - Verify your email (if enabled)

2. **List Your Property**
   - Click "Host your place" in navbar
   - Fill in property details
   - Upload high-quality images
   - Select appropriate category
   - Set competitive pricing

3. **Manage Listings**
   - View your listings
   - Edit details anytime
   - Delete listings when needed

## 📁 Project Structure

```
Wanderlust/
├── controllers/          # Route controllers
│   ├── listings.js      # Listing CRUD operations
│   ├── reviews.js       # Review operations
│   └── users.js         # User authentication
├── models/              # Mongoose schemas
│   ├── listing.js       # Listing model
│   ├── review.js        # Review model
│   └── user.js          # User model
├── routes/              # Express routes
│   ├── listing.js       # Listing routes
│   ├── review.js        # Review routes
│   └── user.js          # User routes
├── views/               # EJS templates
│   ├── layouts/         # Layout templates
│   │   └── boilerplate.ejs
│   ├── includes/        # Partial templates
│   │   ├── navbar.ejs
│   │   ├── footer.ejs
│   │   └── flash.ejs
│   ├── listings/        # Listing views
│   │   ├── index.ejs    # All listings
│   │   ├── show.ejs     # Single listing
│   │   ├── new.ejs      # Create listing
│   │   ├── edit.ejs     # Edit listing
│   │   └── wishlist.ejs # User wishlist
│   ├── users/           # User views
│   │   ├── login.ejs
│   │   └── signup.ejs
│   └── home.ejs         # Landing page
├── public/              # Static files
│   ├── css/
│   │   ├── style.css    # Main styles
│   │   ├── rating.css   # Star rating styles
│   │   └── custom.css   # Custom styles
│   └── js/
│       └── script.js    # Client-side JS
├── init/                # Database initialization
│   ├── data.js          # Sample data
│   └── index.js         # Seed script
├── utils/               # Utility functions
│   ├── ExpressError.js  # Custom error class
│   └── wrapAsync.js     # Async error handler
├── middleware.js        # Custom middleware
├── schema.js            # Joi validation schemas
├── cloudConfig.js       # Cloudinary configuration
├── app.js               # Express app setup
├── package.json         # Dependencies
└── .env                 # Environment variables
```

## 🔗 API Endpoints

### Authentication
- `GET /signup` - Show signup form
- `POST /signup` - Register new user
- `GET /login` - Show login form
- `POST /login` - Authenticate user
- `GET /logout` - Logout user

### Listings
- `GET /` - Homepage
- `GET /listings` - Get all listings (with search & filter)
- `GET /listings/new` - Show create listing form
- `POST /listings` - Create new listing
- `GET /listings/:id` - Get single listing
- `GET /listings/:id/edit` - Show edit form
- `PUT /listings/:id` - Update listing
- `DELETE /listings/:id` - Delete listing
- `GET /listings/wishlist` - Get user's wishlist
- `POST /listings/:id/like` - Toggle like status

### Reviews
- `POST /listings/:id/reviews` - Create review
- `DELETE /listings/:id/reviews/:reviewId` - Delete review

## 🗄️ Database Schema

### User Model
```javascript
{
  username: String (unique),
  email: String (required),
  password: String (hashed),
  likedListings: [ObjectId] // References to Listing
}
```

### Listing Model
```javascript
{
  title: String (required),
  description: String (required),
  image: {
    url: String,
    filename: String
  },
  price: Number (required),
  location: String (required),
  country: String (required),
  category: String (enum: 8 categories),
  reviews: [ObjectId], // References to Review
  owner: ObjectId // Reference to User
}
```

### Review Model
```javascript
{
  rating: Number (1-5, required),
  comment: String (required),
  author: ObjectId, // Reference to User
  createdAt: Date
}
```

## 🎯 Key Features Implementation

### 1. Like System
- **Backend**: User schema stores array of liked listing IDs
- **Frontend**: Heart icon with toggle animation
- **Security**: Requires authentication, database-persisted

### 2. Search & Filter
- **Search**: MongoDB text index on title, location, country
- **Filter**: Category-based query filtering
- **Toggle**: Show/hide filter bar with smooth animation

### 3. Image Upload
- **Storage**: Cloudinary cloud storage
- **Processing**: Custom upload stream handler
- **Validation**: File type and size restrictions

### 4. Reviews & Ratings
- **Calculation**: Average rating computed from all reviews
- **Display**: Starability.css for visual star ratings
- **Ownership**: Users can only delete their own reviews

### 5. Tax Toggle
- **Calculation**: Real-time 18% GST computation
- **Display**: Switch between base and tax-inclusive prices
- **Format**: Indian number formatting (₹)

## 🧪 Testing

```bash
# Run tests (if implemented)
npm test

# Run linting
npm run lint
```

## 🚀 Deployment

### Deploy to Heroku

1. Install Heroku CLI
2. Login to Heroku: `heroku login`
3. Create new app: `heroku create your-app-name`
4. Set environment variables:
   ```bash
   heroku config:set ATLASDB_URL=your-mongodb-url
   heroku config:set SECRET=your-secret
   heroku config:set CLOUD_NAME=your-cloudinary-name
   heroku config:set CLOUD_API_KEY=your-api-key
   heroku config:set CLOUD_API_SECRET=your-api-secret
   ```
5. Deploy: `git push heroku main`

### Deploy to Render

1. Connect your GitHub repository
2. Set environment variables in dashboard
3. Deploy automatically on push

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/YourFeature`
3. Commit changes: `git commit -m 'Add YourFeature'`
4. Push to branch: `git push origin feature/YourFeature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- Icons from [Font Awesome](https://fontawesome.com)
- Images hosted on [Cloudinary](https://cloudinary.com)
- UI inspiration from modern web design trends

## 📸 Screenshots

### Homepage
Beautiful landing page with hero section and featured categories.

### Listings Page
Browse all listings with search, filter, and toggle features.

### Listing Details
Detailed view with images, reviews, and booking information.

### Wishlist
Save and manage your favorite properties.

### Create Listing
Modern form for hosts to list their properties.

---

**⭐ If you like this project, please give it a star on GitHub! ⭐**

## 📞 Support

For support, email your-email@example.com or open an issue on GitHub.

## 🔮 Future Enhancements

- [ ] Payment integration (Stripe/Razorpay)
- [ ] Real-time chat between guests and hosts
- [ ] Email notifications
- [ ] Booking system with calendar
- [ ] Advanced search with date ranges
- [ ] Multi-image upload per listing
- [ ] User profile pages
- [ ] Admin dashboard
- [ ] Progressive Web App (PWA) support
- [ ] Dark mode toggle

---

Made with ❤️ by [Your Name]
