const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const User = require('./models/User');
const Category = require('./models/Category');
const Post = require('./models/Post');

// Sample data
const sampleUsers = [
    {
        username: 'admin',
        email: 'admin@blogger.com',
        password: 'admin123',
        role: 'admin'
    },
    {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'user123',
        role: 'user'
    },
    {
        username: 'jane_smith',
        email: 'jane@example.com',
        password: 'user123',
        role: 'user'
    }
];

const sampleCategories = [
    {
        name: 'Technology',
        description: 'Latest trends and news in technology'
    },
    {
        name: 'Travel',
        description: 'Travel guides and experiences'
    },
    {
        name: 'Food',
        description: 'Recipes and food reviews'
    },
    {
        name: 'Lifestyle',
        description: 'Tips for better living'
    },
    {
        name: 'Business',
        description: 'Business insights and entrepreneurship'
    }
];

const samplePosts = [
    {
        title: 'Getting Started with Node.js',
        content: `Node.js has revolutionized server-side development by allowing developers to use JavaScript on the backend. In this comprehensive guide, we'll explore the fundamentals of Node.js and how to build your first application.

What is Node.js?
Node.js is a runtime environment that allows you to run JavaScript on the server side. Built on Chrome's V8 JavaScript engine, it provides an event-driven, non-blocking I/O model that makes it lightweight and efficient.

Key Features:
1. Asynchronous and Event-Driven
2. Fast execution with V8 engine
3. NPM ecosystem
4. Cross-platform compatibility

Getting Started:
First, install Node.js from the official website. Once installed, you can create your first application by creating a simple HTTP server.

This is just the beginning of your Node.js journey. With its vast ecosystem and active community, Node.js offers endless possibilities for building scalable applications.`,
        excerpt: 'Learn the fundamentals of Node.js and build your first server-side application with JavaScript.',
        tags: ['nodejs', 'javascript', 'backend', 'programming'],
        status: 'published'
    },
    {
        title: 'Top 10 Travel Destinations for 2024',
        content: `Planning your next adventure? Here are the top 10 travel destinations that should be on your bucket list for 2024.

1. Japan - Cherry Blossom Season
Experience the magical cherry blossom season in Japan. From Tokyo's bustling streets to Kyoto's serene temples, Japan offers a perfect blend of tradition and modernity.

2. Iceland - Northern Lights
Witness the spectacular Northern Lights in Iceland's pristine landscapes. The country also offers stunning waterfalls, geysers, and the famous Blue Lagoon.

3. New Zealand - Adventure Paradise
From bungee jumping in Queenstown to exploring the Hobbiton movie set, New Zealand is an adventure lover's paradise.

4. Portugal - Hidden Gem of Europe
Discover Portugal's charming cities, beautiful coastlines, and rich cultural heritage. Don't miss the colorful tiles of Porto and the beaches of Algarve.

5. Costa Rica - Eco-Tourism Haven
Experience incredible biodiversity, zip-lining through cloud forests, and relaxing on both Pacific and Caribbean coasts.

Each destination offers unique experiences and memories that will last a lifetime. Start planning your 2024 adventures today!`,
        excerpt: 'Discover the most exciting travel destinations for 2024, from Japan\'s cherry blossoms to Iceland\'s Northern Lights.',
        tags: ['travel', 'destinations', '2024', 'adventure'],
        status: 'published'
    },
    {
        title: 'The Art of Italian Cooking: Pasta Perfection',
        content: `Italian cuisine is beloved worldwide, and at its heart lies the perfect pasta dish. Today, we'll explore the secrets of authentic Italian pasta cooking.

The Foundation: Quality Ingredients
The key to great Italian cooking starts with quality ingredients. Use San Marzano tomatoes, extra virgin olive oil, fresh basil, and authentic Parmigiano-Reggiano cheese.

Pasta Cooking Techniques:
1. Use plenty of salted water (1 liter per 100g pasta)
2. Don't add oil to the water
3. Cook until al dente
4. Reserve pasta water for sauce

Classic Recipes to Master:
- Spaghetti Carbonara
- Cacio e Pepe
- Amatriciana
- Aglio e Olio

The Secret: Pasta Water
The starchy pasta water is liquid gold in Italian cooking. It helps bind the sauce to the pasta and creates that perfect creamy consistency.

Remember, Italian cooking is about simplicity and letting quality ingredients shine. Master these basics, and you'll be creating restaurant-quality pasta at home.`,
        excerpt: 'Master the art of Italian pasta cooking with authentic techniques and traditional recipes.',
        tags: ['cooking', 'italian', 'pasta', 'recipes'],
        status: 'published'
    },
    {
        title: 'Minimalist Living: Less is More',
        content: `In our consumer-driven world, minimalism offers a refreshing approach to living. It's not about having nothing; it's about having everything you need and nothing you don't.

What is Minimalism?
Minimalism is a lifestyle that focuses on living with intention. It's about removing excess to make room for what truly matters in your life.

Benefits of Minimalist Living:
1. Reduced stress and anxiety
2. More time and energy
3. Financial freedom
4. Environmental consciousness
5. Improved focus and clarity

Getting Started:
Begin with one area of your home. Ask yourself: "Does this item add value to my life?" If not, consider donating or selling it.

The 30-Day Minimalism Game:
Day 1: Remove 1 item
Day 2: Remove 2 items
Continue until Day 30: Remove 30 items

By the end, you'll have removed 465 items from your home!

Remember, minimalism looks different for everyone. Find what works for your lifestyle and embrace the freedom that comes with living with less.`,
        excerpt: 'Discover how minimalist living can reduce stress, save money, and bring more focus to your life.',
        tags: ['minimalism', 'lifestyle', 'wellness', 'organization'],
        status: 'published'
    },
    {
        title: 'Starting Your First Business: A Complete Guide',
        content: `Entrepreneurship is an exciting journey filled with challenges and rewards. If you're thinking about starting your first business, this guide will help you navigate the initial steps.

Step 1: Validate Your Idea
Before investing time and money, ensure there's a market for your product or service. Conduct surveys, interviews, and market research.

Step 2: Create a Business Plan
A solid business plan includes:
- Executive summary
- Market analysis
- Organization structure
- Product/service description
- Marketing strategy
- Financial projections

Step 3: Choose Your Business Structure
Options include:
- Sole Proprietorship
- Partnership
- LLC
- Corporation

Step 4: Secure Funding
Explore various funding options:
- Personal savings
- Bank loans
- Angel investors
- Crowdfunding
- Venture capital

Step 5: Build Your Team
Surround yourself with talented individuals who share your vision. Consider hiring for skills you lack.

Step 6: Launch and Iterate
Start small, gather feedback, and continuously improve your offering.

Remember, every successful entrepreneur started with an idea and the courage to take the first step. Your journey begins now!`,
        excerpt: 'Everything you need to know about starting your first business, from idea validation to launch.',
        tags: ['business', 'entrepreneurship', 'startup', 'guide'],
        status: 'published'
    }
];

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Category.deleteMany({});
        await Post.deleteMany({});
        console.log('Cleared existing data');

        // Create users
        const users = [];
        for (const userData of sampleUsers) {
            const user = new User(userData);
            await user.save();
            users.push(user);
            console.log(`Created user: ${user.username}`);
        }

        // Create categories
        const categories = [];
        for (const categoryData of sampleCategories) {
            const category = new Category(categoryData);
            await category.save();
            categories.push(category);
            console.log(`Created category: ${category.name}`);
        }

        // Create posts
        const adminUser = users.find(u => u.role === 'admin');
        for (let i = 0; i < samplePosts.length; i++) {
            const postData = {
                ...samplePosts[i],
                author: adminUser._id,
                category: categories[i % categories.length]._id
            };
            
            const post = new Post(postData);
            await post.save();
            console.log(`Created post: ${post.title}`);
        }

        console.log('\n✅ Database seeded successfully!');
        console.log('\nSample accounts created:');
        console.log('Admin: admin@blogger.com / admin123');
        console.log('User 1: john@example.com / user123');
        console.log('User 2: jane@example.com / user123');
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

// Run the seeder
seedDatabase();
