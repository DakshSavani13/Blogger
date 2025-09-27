const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const User = require('./models/User');
const Category = require('./models/Category');
const Post = require('./models/Post');

// Sample categories
const sampleCategories = [
    {
        name: 'Technology',
        description: 'Latest trends and news in technology',
        slug: 'technology'
    },
    {
        name: 'Travel',
        description: 'Travel guides and amazing destinations',
        slug: 'travel'
    },
    {
        name: 'Food & Recipes',
        description: 'Delicious recipes and food reviews',
        slug: 'food-recipes'
    },
    {
        name: 'Lifestyle',
        description: 'Tips for better living and wellness',
        slug: 'lifestyle'
    },
    {
        name: 'Business',
        description: 'Business insights and entrepreneurship',
        slug: 'business'
    }
];

// Sample posts
const samplePosts = [
    {
        title: 'Getting Started with React in 2024',
        slug: 'getting-started-with-react-in-2024',
        content: `React continues to be one of the most popular JavaScript libraries for building user interfaces. In this comprehensive guide, we'll explore what's new in React for 2024 and how to get started.

## What's New in React 2024?

React has introduced several exciting features this year:

### 1. Server Components
Server Components allow you to render components on the server, reducing the JavaScript bundle size and improving performance.

### 2. Concurrent Features
React's concurrent features help make your apps more responsive by allowing React to interrupt rendering to handle high-priority updates.

### 3. Automatic Batching
React now automatically batches multiple state updates for better performance.

## Getting Started

To create a new React app, you can use Create React App or Vite:

\`\`\`bash
npx create-react-app my-app
cd my-app
npm start
\`\`\`

Or with Vite for faster development:

\`\`\`bash
npm create vite@latest my-react-app -- --template react
cd my-react-app
npm install
npm run dev
\`\`\`

## Best Practices for 2024

1. **Use Functional Components**: Prefer functional components with hooks over class components
2. **TypeScript Integration**: Consider using TypeScript for better type safety
3. **Performance Optimization**: Use React.memo, useMemo, and useCallback wisely
4. **Testing**: Write comprehensive tests with React Testing Library

React's ecosystem continues to evolve, making it an excellent choice for modern web development. Start building your next project with React today!`,
        excerpt: 'Learn the latest React features for 2024 and how to build modern web applications with improved performance and developer experience.',
        tags: ['react', 'javascript', 'web-development', 'frontend', '2024'],
        status: 'published'
    },
    {
        title: 'Top 5 Hidden Gems in Southeast Asia',
        content: `Southeast Asia is full of incredible destinations, but some of the most beautiful places remain hidden from the typical tourist trail. Here are 5 amazing hidden gems you should add to your travel bucket list.

## 1. Siquijor Island, Philippines

Known as the "Island of Fire," Siquijor offers pristine beaches, mystical caves, and century-old balete trees. The island has a mysterious charm with its folklore and traditional healing practices.

**What to do:**
- Visit Cambugahay Falls for a refreshing swim
- Explore Salagdoong Beach with its cliff jumping spots
- Experience the healing traditions at local healers

## 2. Kampot, Cambodia

This charming riverside town is famous for its pepper plantations and French colonial architecture. Kampot offers a laid-back atmosphere perfect for relaxation.

**Highlights:**
- Tour the famous Kampot pepper farms
- Take a sunset cruise on the Kampot River
- Visit the nearby Bokor National Park

## 3. Nusa Penida, Indonesia

While Bali gets all the attention, Nusa Penida offers dramatic cliffs, crystal-clear waters, and fewer crowds. This island paradise is perfect for adventure seekers.

**Must-see spots:**
- Kelingking Beach with its T-Rex shaped cliff
- Angel's Billabong natural infinity pool
- Crystal Bay for snorkeling and diving

## 4. Koh Rong Sanloem, Cambodia

This pristine island offers some of the most beautiful beaches in Southeast Asia with powdery white sand and turquoise waters.

**Activities:**
- Relax on Saracen Bay Beach
- Go snorkeling in crystal-clear waters
- Experience bioluminescent plankton at night

## 5. Flores Island, Indonesia

Home to the famous Komodo dragons, Flores offers much more than just wildlife. The island features colorful lakes, traditional villages, and stunning landscapes.

**Don't miss:**
- Kelimutu's three-colored crater lakes
- Traditional villages in Bajawa
- Komodo National Park for dragon spotting

These hidden gems offer authentic experiences away from the crowds. Pack your bags and discover the untouched beauty of Southeast Asia!`,
        excerpt: 'Discover 5 incredible hidden destinations in Southeast Asia that offer pristine beaches, unique cultures, and unforgettable adventures away from the tourist crowds.',
        tags: ['travel', 'southeast-asia', 'hidden-gems', 'adventure', 'beaches'],
        status: 'published'
    },
    {
        title: 'The Ultimate Guide to Italian Pasta Making',
        content: `There's nothing quite like homemade pasta. The texture, flavor, and satisfaction of creating something from scratch makes every bite special. Let's dive into the art of Italian pasta making.

## The Foundation: Understanding Pasta Dough

Traditional Italian pasta uses just a few simple ingredients:
- **00 Flour** (Tipo 00): The finest grind, perfect for pasta
- **Eggs**: Fresh, room temperature eggs work best
- **Semolina**: For dusting and some pasta types
- **Salt**: Just a pinch for flavor
- **Olive Oil**: Optional, for certain recipes

## Basic Pasta Dough Recipe

### Ingredients:
- 400g 00 flour
- 4 large eggs
- 1 tsp salt
- 1 tbsp olive oil (optional)

### Instructions:

1. **Create a well**: Make a mound of flour on a clean surface and create a well in the center
2. **Add eggs**: Crack eggs into the well and add salt
3. **Mix gradually**: Using a fork, gradually incorporate flour into the eggs
4. **Knead**: Once a shaggy dough forms, knead for 8-10 minutes until smooth
5. **Rest**: Wrap in plastic and rest for 30 minutes

## Popular Pasta Shapes to Try

### 1. Fettuccine
Perfect for creamy sauces like Alfredo or Carbonara.

### 2. Pappardelle
Wide ribbons ideal for hearty meat sauces.

### 3. Ravioli
Stuffed pasta perfect for cheese, spinach, or meat fillings.

### 4. Gnocchi
Potato-based pasta that's pillowy and delicious.

## Pro Tips for Perfect Pasta

1. **Don't overwork the dough** - this makes pasta tough
2. **Keep unused dough covered** - prevents drying out
3. **Use plenty of flour for dusting** - prevents sticking
4. **Cook immediately or dry properly** - fresh pasta cooks in 2-3 minutes

## Classic Sauce Pairings

- **Aglio e Olio**: Simple garlic and olive oil
- **Cacio e Pepe**: Cheese and black pepper
- **Marinara**: Fresh tomato sauce with basil
- **Pesto**: Basil, pine nuts, and parmesan

## Storage Tips

- **Fresh pasta**: Use within 2 days or freeze for up to 3 months
- **Dried pasta**: Store in airtight containers for several weeks
- **Cooked pasta**: Refrigerate for up to 3 days

Making pasta from scratch is a rewarding experience that connects you to centuries of Italian tradition. Start with simple shapes and work your way up to more complex creations. Buon appetito!`,
        excerpt: 'Master the art of homemade Italian pasta with this comprehensive guide covering dough preparation, shaping techniques, and classic sauce pairings.',
        tags: ['cooking', 'italian-cuisine', 'pasta', 'recipes', 'homemade'],
        status: 'published'
    },
    {
        title: '10 Minimalist Living Tips for a Clutter-Free Life',
        content: `Minimalism isn't about living with nothing—it's about living with intention. Here are 10 practical tips to embrace minimalist living and create a more peaceful, organized life.

## 1. Start with One Room

Don't try to declutter your entire home at once. Choose one room and focus on it completely before moving to the next. This prevents overwhelm and gives you a sense of accomplishment.

**Action step**: Start with your bedroom—it's your sanctuary and should be peaceful.

## 2. Follow the One-Year Rule

If you haven't used something in a year, you probably don't need it. This rule helps you make decisions about items you're unsure about.

**Exception**: Seasonal items and emergency supplies.

## 3. Embrace the "One In, One Out" Policy

For every new item you bring home, remove one item. This prevents accumulation and forces you to be intentional about purchases.

## 4. Digitize When Possible

- Scan important documents
- Use digital receipts
- Store photos in the cloud
- Choose e-books over physical books

## 5. Create a Capsule Wardrobe

Build a wardrobe with 30-40 versatile pieces that mix and match easily. Focus on quality over quantity.

**Benefits**:
- Faster morning routines
- Less decision fatigue
- More space in your closet

## 6. Practice Mindful Consumption

Before buying anything, ask yourself:
- Do I really need this?
- Will this add value to my life?
- Do I have space for it?
- Can I borrow or rent instead?

## 7. Designate Homes for Everything

Every item should have a specific place. This makes cleaning easier and prevents clutter from accumulating.

## 8. Use the 90/90 Rule

If you haven't used something in the last 90 days and won't use it in the next 90 days, consider letting it go.

## 9. Focus on Experiences Over Things

Invest in experiences rather than material possessions:
- Travel and adventures
- Learning new skills
- Time with loved ones
- Personal growth activities

## 10. Regular Maintenance

Schedule monthly mini-decluttering sessions to prevent accumulation:
- 15 minutes per room
- Donate items immediately
- Review and adjust systems

## The Benefits of Minimalist Living

- **Reduced stress**: Less clutter = less visual noise
- **More time**: Less cleaning and organizing
- **Financial freedom**: Spending less on unnecessary items
- **Environmental impact**: Consuming less helps the planet
- **Mental clarity**: Clearer space = clearer mind

## Getting Started Today

1. Choose one drawer or shelf
2. Remove everything
3. Clean the space
4. Only put back items you use and love
5. Donate or discard the rest

Remember, minimalism looks different for everyone. Find what works for your lifestyle and embrace the freedom that comes with living with less.`,
        excerpt: 'Transform your life with these 10 practical minimalist living tips that will help you declutter your space, reduce stress, and focus on what truly matters.',
        tags: ['minimalism', 'lifestyle', 'organization', 'wellness', 'decluttering'],
        status: 'published'
    },
    {
        title: 'Starting a Successful Online Business in 2024',
        content: `The digital landscape offers incredible opportunities for entrepreneurs. Whether you're looking to start a side hustle or build a full-time business, here's your complete guide to launching a successful online business in 2024.

## Why Start an Online Business?

### Advantages:
- **Low startup costs**: No physical storefront needed
- **Global reach**: Access customers worldwide
- **Flexibility**: Work from anywhere
- **Scalability**: Grow without geographical limitations
- **24/7 operations**: Your business works while you sleep

## Step 1: Choose Your Business Model

### Popular Online Business Models:

#### 1. E-commerce Store
Sell physical products through platforms like Shopify, WooCommerce, or Amazon.

#### 2. Digital Products
Create and sell:
- Online courses
- E-books
- Software tools
- Templates and designs

#### 3. Service-Based Business
Offer services like:
- Consulting
- Web design
- Content writing
- Virtual assistance

#### 4. Affiliate Marketing
Promote other companies' products and earn commissions.

#### 5. Subscription Business
Recurring revenue through:
- Software as a Service (SaaS)
- Membership sites
- Subscription boxes

## Step 2: Validate Your Idea

Before investing time and money, validate your business idea:

### Market Research Methods:
- **Google Trends**: Check search volume for your keywords
- **Social media**: Look for discussions about your topic
- **Competitor analysis**: Study successful competitors
- **Surveys**: Ask potential customers directly
- **MVP testing**: Create a minimum viable product

## Step 3: Build Your Online Presence

### Essential Components:

#### Professional Website
- Choose a memorable domain name
- Use responsive design
- Optimize for search engines (SEO)
- Include clear calls-to-action

#### Social Media Strategy
- Choose 2-3 platforms where your audience is active
- Create consistent, valuable content
- Engage with your community
- Use social media advertising

#### Email Marketing
- Build an email list from day one
- Provide value through newsletters
- Use automation for nurturing leads
- Track and optimize performance

## Step 4: Legal and Financial Setup

### Legal Requirements:
- Register your business
- Get necessary licenses and permits
- Understand tax obligations
- Consider business insurance

### Financial Management:
- Separate business and personal finances
- Use accounting software
- Track all expenses
- Set aside money for taxes

## Step 5: Marketing and Growth Strategies

### Content Marketing
- Start a blog
- Create valuable, SEO-optimized content
- Share expertise through videos
- Guest post on relevant sites

### Paid Advertising
- Google Ads for search traffic
- Facebook/Instagram ads for social media
- LinkedIn ads for B2B businesses
- Retargeting campaigns

### Partnerships and Networking
- Collaborate with influencers
- Partner with complementary businesses
- Join online communities
- Attend virtual networking events

## Common Mistakes to Avoid

1. **Not validating the market**: Build something people actually want
2. **Perfectionism**: Launch early and improve based on feedback
3. **Ignoring SEO**: Optimize for search engines from the start
4. **Poor customer service**: Respond quickly and professionally
5. **Not tracking metrics**: Monitor what's working and what isn't

## Tools and Resources for Success

### Website Building:
- WordPress, Shopify, Squarespace
- Canva for design
- Google Analytics for tracking

### Marketing:
- Mailchimp for email marketing
- Hootsuite for social media management
- SEMrush for SEO research

### Business Management:
- QuickBooks for accounting
- Trello for project management
- Zoom for client meetings

## Timeline for Launch

### Month 1: Planning and Research
- Validate your idea
- Create business plan
- Set up legal structure

### Month 2: Build and Prepare
- Create website
- Develop initial products/services
- Set up marketing systems

### Month 3: Launch and Optimize
- Go live with your business
- Start marketing campaigns
- Gather feedback and improve

## Final Thoughts

Starting an online business requires dedication, patience, and continuous learning. Focus on providing real value to your customers, and success will follow. Remember, every successful entrepreneur started with a single step—take yours today!

The digital economy is booming, and there's never been a better time to start your online business journey. What are you waiting for?`,
        excerpt: 'Learn how to start and grow a successful online business in 2024 with this comprehensive guide covering business models, validation, marketing, and growth strategies.',
        tags: ['business', 'entrepreneurship', 'online-business', 'startup', 'digital-marketing'],
        status: 'published'
    }
];

async function createSampleContent() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        // Find admin user
        const adminUser = await User.findOne({ email: 'admin@blogger.com' });
        if (!adminUser) {
            console.log('❌ Admin user not found! Please run createAdmin.js first.');
            process.exit(1);
        }

        console.log('✅ Admin user found');

        // Create categories
        console.log('\n📁 Creating categories...');
        const createdCategories = [];
        
        for (const categoryData of sampleCategories) {
            // Check if category already exists
            const existingCategory = await Category.findOne({ name: categoryData.name });
            if (existingCategory) {
                console.log(`   ⚠️  Category "${categoryData.name}" already exists`);
                createdCategories.push(existingCategory);
            } else {
                const category = new Category(categoryData);
                await category.save();
                createdCategories.push(category);
                console.log(`   ✅ Created category: ${category.name}`);
            }
        }

        // Create posts
        console.log('\n📝 Creating blog posts...');
        
        for (let i = 0; i < samplePosts.length; i++) {
            const postData = {
                ...samplePosts[i],
                author: adminUser._id,
                category: createdCategories[i % createdCategories.length]._id
            };
            
            // Check if post already exists
            const existingPost = await Post.findOne({ title: postData.title });
            if (existingPost) {
                console.log(`   ⚠️  Post "${postData.title}" already exists`);
            } else {
                const post = new Post(postData);
                await post.save();
                console.log(`   ✅ Created post: ${post.title}`);
            }
        }

        console.log('\n🎉 Sample content created successfully!');
        console.log('\n📊 Summary:');
        console.log(`   Categories: ${createdCategories.length}`);
        console.log(`   Posts: ${samplePosts.length}`);
        console.log('\n🌐 You can now view these posts on your blog at http://localhost:3000');
        console.log('\n👤 Admin login: admin@blogger.com / admin123');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating sample content:', error);
        process.exit(1);
    }
}

// Run the script
createSampleContent();
