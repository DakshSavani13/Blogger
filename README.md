# Blogger - Modern Blogging Platform

A full-stack blogging platform built with MongoDB, Express.js, Node.js, HTML, CSS, and JavaScript. Features include user authentication, blog post management, categories, comments system, search functionality, and beautiful image support.

## 🌟 Features

### For Users
- **User Registration & Authentication**: Secure user registration and login system with JWT tokens
- **Browse Posts**: View published blog posts with beautiful featured images and pagination
- **Search & Filter**: Advanced search by title, content, or tags; filter by categories
- **Comments System**: Post comments and replies with real-time interaction
- **Responsive Design**: Mobile-first design that works on all devices
- **Image Gallery**: Beautiful featured images for all blog posts
- **Interactive UI**: Smooth animations and modern user interface

### For Admins
- **Post Management**: Create, edit, delete, and publish blog posts with rich content
- **Image Management**: Add featured images to posts via URL
- **Category Management**: Create and organize post categories with descriptions
- **Comment Moderation**: Approve, reject, or delete user comments
- **Dashboard**: Comprehensive admin dashboard with analytics
- **Content Editor**: Rich text editing with markdown support

### Technical Features
- **Duplicate Prevention**: Prevents duplicate comments from the same user
- **Input Validation**: Client and server-side validation for all forms
- **JWT Authentication**: Secure token-based authentication system
- **RESTful API**: Well-structured API endpoints with proper HTTP methods
- **Error Handling**: Comprehensive error handling and user feedback
- **Image Optimization**: Responsive images with fallback support
- **SEO Friendly**: Proper meta tags and semantic HTML structure
- **Performance**: Optimized loading and caching strategies

## Project Structure

```
Blogger/
├── backend/                 # Node.js/Express.js API
│   ├── models/             # MongoDB models
│   │   ├── User.js         # User authentication & profiles
│   │   ├── Post.js         # Blog posts with featured images
│   │   ├── Category.js     # Post categories
│   │   └── Comment.js      # Comments with reply support
│   ├── routes/             # API routes
│   │   ├── auth.js         # Authentication endpoints
│   │   ├── posts.js        # Blog post CRUD operations
│   │   ├── categories.js   # Category management
│   │   └── comments.js     # Comment system with moderation
│   ├── middleware/         # Custom middleware
│   │   └── auth.js         # JWT authentication middleware
│   ├── utilities/          # Helper scripts
│   │   ├── createAdmin.js  # Create admin user
│   │   ├── addImages.js    # Add sample images
│   │   └── quickSamplePosts.js # Generate sample content
│   ├── package.json        # Dependencies and scripts
│   ├── server.js          # Express server configuration
│   └── .env               # Environment variables
├── frontend/               # Modern HTML/CSS/JS frontend
│   ├── css/
│   │   └── style.css      # Responsive CSS with animations
│   ├── js/
│   │   ├── api.js         # API communication layer
│   │   ├── auth.js        # Authentication management
│   │   ├── posts.js       # Post display and interaction
│   │   ├── comments.js    # Comment system frontend
│   │   ├── admin.js       # Admin dashboard functionality
│   │   └── app.js         # Main application controller
│   └── index.html         # Single-page application
├── start-backend.bat       # Windows batch file to start backend
├── start-frontend.bat      # Windows batch file to start frontend
└── README.md              # This documentation
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## 🚀 Quick Start

### Method 1: Using Batch Files (Windows)
1. **Start Backend**: Double-click `start-backend.bat`
2. **Start Frontend**: Double-click `start-frontend.bat`
3. **Open Browser**: Go to `http://localhost:3000`

### Method 2: Manual Setup

#### 1. Clone or Download the Project
```bash
# If using git
git clone <repository-url>
cd Blogger

# Or download and extract the project files
```

#### 2. Setup Backend
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create admin user and sample data
npm run seed
# or manually:
node createAdmin.js
node quickSamplePosts.js
node addImages.js
```

#### 3. Configure Environment Variables
The `.env` file is already configured with default values:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blogger
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

#### 4. Setup MongoDB
Make sure MongoDB is installed and running:
```bash
# Windows (if installed as service):
net start MongoDB

# macOS (with Homebrew):
brew services start mongodb-community

# Linux (systemd):
sudo systemctl start mongod
```

#### 5. Start the Servers
```bash
# Terminal 1: Start Backend
cd backend
npm start

# Terminal 2: Start Frontend
cd frontend
python -m http.server 3000
# or
http-server -p 3000
```

#### 6. Access the Application
- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`

## 📖 Usage Guide

### 🎯 Default Admin Account
- **Email**: `admin@blogger.com`
- **Password**: `admin123`

### 👤 User Experience
1. **Browse Posts**: View all published blog posts with beautiful featured images
2. **Search & Filter**: Use the search bar and category filter to find specific content
3. **Read Posts**: Click on any post to read the full content with images
4. **Register/Login**: Create an account to interact with posts
5. **Comment**: Post comments and replies on blog posts
6. **Responsive**: Enjoy the experience on desktop, tablet, or mobile

### 👨‍💼 Admin Functions
1. **Dashboard Access**: Login as admin to access the management dashboard
2. **Create Posts**: Write new blog posts with rich content and featured images
3. **Manage Categories**: Create and organize post categories
4. **Moderate Comments**: Approve, reject, or delete user comments
5. **Edit Content**: Update existing posts and categories
6. **Image Management**: Add featured images via URL to make posts visually appealing

### 🎨 Sample Content Included
The platform comes with pre-loaded sample content:
- **4 Categories**: Technology, Travel, Food, Lifestyle
- **4 Blog Posts**: Complete with featured images and rich content
- **Beautiful Images**: Professional stock photos from Unsplash

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Posts
- `GET /api/posts` - Get all posts (with search/filter)
- `GET /api/posts/:slug` - Get single post
- `POST /api/posts` - Create post (Admin only)
- `PUT /api/posts/:id` - Update post (Admin only)
- `DELETE /api/posts/:id` - Delete post (Admin only)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get single category
- `POST /api/categories` - Create category (Admin only)
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)

### Comments
- `GET /api/comments/post/:postId` - Get comments for post
- `POST /api/comments` - Create comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment
- `GET /api/comments/admin` - Get all comments (Admin only)
- `PATCH /api/comments/:id/status` - Update comment status (Admin only)

## 🛠️ Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart on file changes
```

### Frontend Development
The frontend uses vanilla HTML/CSS/JS with modern features:
- **Live Reload**: Changes reflect immediately on browser refresh
- **Modular Structure**: Separate JS files for different functionalities
- **Responsive CSS**: Mobile-first design with CSS Grid and Flexbox
- **Modern JavaScript**: ES6+ features with async/await

### Adding New Features
1. **New API Endpoints**: Add routes in `backend/routes/`
2. **Database Models**: Create new models in `backend/models/`
3. **Frontend Components**: Add new JS modules in `frontend/js/`
4. **Styling**: Update `frontend/css/style.css`

## 🔧 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running: `net start MongoDB` (Windows)
   - Check the MONGODB_URI in your .env file
   - Verify MongoDB is accessible on port 27017

2. **CORS Errors**
   - Ensure backend server is running on port 5000
   - Check API_BASE_URL in `frontend/js/api.js`
   - Verify you're accessing frontend via `http://localhost:3000`

3. **Images Not Loading**
   - Check if featured image URLs are valid
   - Ensure images are accessible (not blocked by CORS)
   - Run `node addImages.js` to add sample images

4. **Authentication Issues**
   - Clear browser localStorage: `localStorage.clear()`
   - Check JWT_SECRET is set in .env file
   - Verify admin account exists: `node createAdmin.js`

5. **Port Already in Use**
   - Change PORT in .env file to different port
   - Update API_BASE_URL in frontend accordingly
   - Kill existing processes: `taskkill /f /im node.exe`

## 🎯 Key Features Implemented

### ✅ **All Requirements Met**
- ✅ **Admin CRUD Operations**: Create, edit, delete blog posts
- ✅ **Post Categories**: Organized content with category management
- ✅ **User Comments**: Interactive comment system with replies
- ✅ **Search & Filter**: Advanced search and category filtering
- ✅ **Duplicate Prevention**: Prevents duplicate comments and empty submissions
- ✅ **Image Support**: Beautiful featured images for all posts
- ✅ **Responsive Design**: Works perfectly on all devices
- ✅ **Modern UI**: Clean, professional interface with animations

### 🚀 **Bonus Features Added**
- 🎨 **Featured Images**: Professional image support with fallbacks
- 📱 **Mobile-First Design**: Optimized for mobile devices
- 🔍 **Advanced Search**: Search by title, content, and tags
- 💬 **Nested Comments**: Reply functionality for better discussions
- 🛡️ **Security**: JWT authentication with proper validation
- ⚡ **Performance**: Optimized loading and caching
- 🎭 **Animations**: Smooth transitions and hover effects
- 📊 **Analytics**: View counts and engagement metrics

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and test thoroughly
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Submit a pull request**

### Development Guidelines
- Follow existing code style and structure
- Add comments for complex functionality
- Test all features before submitting
- Update documentation for new features

## 🆘 Support

For support, questions, or feature requests:
- **Create an issue** in the repository
- **Check the troubleshooting section** above
- **Review the API documentation** for integration help

## 🙏 Acknowledgments

- **Unsplash** for providing beautiful stock photos
- **Font Awesome** for the icon library
- **Google Fonts** for the Inter font family
- **MongoDB, Express.js, Node.js** for the robust backend stack

## Developers
Daksh Savani-savanidaksh7@gmail.com
Om Rakholiya
---

**Built with ❤️ using the MERN stack and modern web technologies**
