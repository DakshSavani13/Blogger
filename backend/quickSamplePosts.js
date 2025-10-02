const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const User = require('./models/User');
const Category = require('./models/Category');
const Post = require('./models/Post');

async function createQuickSample() {
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
            console.log('❌ Admin user not found!');
            process.exit(1);
        }

        // Create categories first
        const categories = [
            { name: 'Technology', description: 'Tech news and tutorials', slug: 'technology' },
            { name: 'Travel', description: 'Travel guides and tips', slug: 'travel' },
            { name: 'Food', description: 'Recipes and food reviews', slug: 'food' },
            { name: 'Lifestyle', description: 'Life tips and wellness', slug: 'lifestyle' }
        ];

        const createdCategories = [];
        for (const catData of categories) {
            let category = await Category.findOne({ name: catData.name });
            if (!category) {
                category = new Category(catData);
                await category.save();
                console.log(`✅ Created category: ${category.name}`);
            }
            createdCategories.push(category);
        }

        // Create sample posts
        const posts = [
            {
                title: 'Introduction to Modern Web Development',
                slug: 'introduction-to-modern-web-development',
                content: `Welcome to the exciting world of modern web development! In this comprehensive guide, we'll explore the latest technologies and best practices that are shaping the web today.

## What is Modern Web Development?

Modern web development encompasses a wide range of technologies, frameworks, and methodologies that help developers create fast, scalable, and user-friendly web applications.

### Key Technologies:

1. **Frontend Frameworks**
   - React.js for building interactive UIs
   - Vue.js for progressive web applications
   - Angular for enterprise-level applications

2. **Backend Technologies**
   - Node.js for JavaScript on the server
   - Python with Django/Flask
   - PHP with Laravel/Symfony

3. **Databases**
   - MongoDB for NoSQL solutions
   - PostgreSQL for relational data
   - Redis for caching

### Best Practices:

- **Responsive Design**: Ensure your website works on all devices
- **Performance Optimization**: Fast loading times are crucial
- **SEO Friendly**: Make your content discoverable
- **Security First**: Protect user data and prevent attacks

## Getting Started

If you're new to web development, start with the basics:
1. Learn HTML, CSS, and JavaScript
2. Understand how the web works
3. Choose a framework to specialize in
4. Build projects to practice your skills

The web development landscape is constantly evolving, so continuous learning is key to success. Start your journey today and join the millions of developers building the future of the web!`,
                excerpt: 'Discover the fundamentals of modern web development, including key technologies, frameworks, and best practices for building amazing web applications.',
                tags: ['web-development', 'programming', 'javascript', 'frontend', 'backend'],
                status: 'published',
                category: createdCategories[0]._id
            },
            {
                title: 'Amazing Weekend Getaways Near You',
                slug: 'amazing-weekend-getaways-near-you',
                content: `Looking for the perfect weekend escape? Whether you want to relax on a beach, explore a new city, or reconnect with nature, we've got you covered with these amazing weekend getaway ideas.

## Beach Destinations

### 1. Coastal Retreats
Nothing beats the sound of waves and the feel of sand between your toes. Consider these coastal gems:
- **Malibu, California**: Stunning beaches and celebrity spotting
- **Cape Cod, Massachusetts**: Charming seaside towns and fresh seafood
- **Outer Banks, North Carolina**: Wild horses and historic lighthouses

## Mountain Escapes

### 2. Alpine Adventures
For those who prefer mountain air and scenic vistas:
- **Asheville, North Carolina**: Blue Ridge Mountains and craft breweries
- **Park City, Utah**: Year-round outdoor activities
- **Gatlinburg, Tennessee**: Great Smoky Mountains National Park

## City Breaks

### 3. Urban Exploration
Discover new cultures and cuisines in these vibrant cities:
- **Charleston, South Carolina**: Historic charm and Southern hospitality
- **Portland, Oregon**: Food trucks and quirky culture
- **Savannah, Georgia**: Haunted tours and beautiful architecture

## Planning Tips

### Before You Go:
1. **Book accommodations early** for better rates
2. **Check local events** happening during your visit
3. **Pack appropriately** for the weather and activities
4. **Research local restaurants** and attractions

### Budget-Friendly Options:
- Look for package deals that include accommodation and activities
- Consider vacation rentals for longer stays
- Take advantage of free activities like hiking or beach walks
- Visit during off-peak seasons for lower prices

## Making the Most of Your Trip

- **Disconnect from work** and truly relax
- **Try local specialties** you can't get at home
- **Take photos** but don't forget to live in the moment
- **Be spontaneous** and open to unexpected adventures

A weekend getaway doesn't have to be expensive or far from home. Sometimes the best adventures are just a few hours away. Start planning your next escape today!`,
                excerpt: 'Discover perfect weekend getaway destinations including beaches, mountains, and cities, plus essential planning tips for your next short vacation.',
                tags: ['travel', 'weekend-trips', 'vacation', 'destinations', 'adventure'],
                status: 'published',
                category: createdCategories[1]._id
            },
            {
                title: 'Easy Healthy Recipes for Busy People',
                slug: 'easy-healthy-recipes-for-busy-people',
                content: `Eating healthy doesn't have to be complicated or time-consuming. Here are some delicious, nutritious recipes that you can prepare quickly, even on your busiest days.

## Quick Breakfast Ideas

### 1. Overnight Oats
**Prep time: 5 minutes | Serves: 1**

**Ingredients:**
- 1/2 cup rolled oats
- 1/2 cup milk of choice
- 1 tbsp chia seeds
- 1 tbsp honey or maple syrup
- Fresh fruits and nuts for topping

**Instructions:**
1. Mix all ingredients in a jar
2. Refrigerate overnight
3. Add toppings in the morning and enjoy!

### 2. Avocado Toast Plus
**Prep time: 5 minutes | Serves: 1**

**Ingredients:**
- 1 slice whole grain bread
- 1/2 ripe avocado
- 1 egg
- Salt, pepper, and red pepper flakes
- Optional: cherry tomatoes, feta cheese

**Instructions:**
1. Toast bread while cooking egg
2. Mash avocado with seasonings
3. Assemble and enjoy immediately

## Lunch Solutions

### 3. Mason Jar Salads
**Prep time: 20 minutes | Serves: 4**

**Layer from bottom to top:**
1. Dressing (2 tbsp)
2. Hard vegetables (carrots, bell peppers)
3. Protein (chicken, beans, cheese)
4. Soft vegetables (tomatoes, cucumbers)
5. Greens (lettuce, spinach)

**Benefits:**
- Stays fresh for up to 5 days
- Grab-and-go convenience
- Customizable to your taste

## Dinner Winners

### 4. One-Pan Chicken and Vegetables
**Prep time: 10 minutes | Cook time: 25 minutes | Serves: 4**

**Ingredients:**
- 4 chicken breasts
- 2 cups mixed vegetables (broccoli, carrots, bell peppers)
- 2 tbsp olive oil
- Seasonings: garlic powder, paprika, salt, pepper

**Instructions:**
1. Preheat oven to 425°F (220°C)
2. Toss everything with oil and seasonings
3. Bake for 25 minutes
4. Serve immediately

### 5. 15-Minute Pasta
**Prep time: 5 minutes | Cook time: 15 minutes | Serves: 4**

**Ingredients:**
- 12 oz whole wheat pasta
- 2 cups cherry tomatoes
- 3 cloves garlic, minced
- 1/4 cup olive oil
- Fresh basil and parmesan cheese

**Instructions:**
1. Cook pasta according to package directions
2. Sauté garlic and tomatoes in olive oil
3. Toss with pasta, basil, and cheese

## Meal Prep Tips

### Sunday Prep Session:
1. **Wash and chop vegetables** for the week
2. **Cook grains in bulk** (rice, quinoa, pasta)
3. **Prepare proteins** (grill chicken, hard-boil eggs)
4. **Make overnight oats** for the week

### Kitchen Essentials:
- Sharp knives for quick chopping
- Non-stick pans for easy cooking
- Glass containers for storage
- Slow cooker for hands-off meals

## Healthy Swaps

- **White rice → Cauliflower rice** (saves time and calories)
- **Regular pasta → Zucchini noodles** (more nutrients)
- **Sour cream → Greek yogurt** (more protein)
- **Butter → Avocado** (healthy fats)

## Snack Ideas

- Apple slices with almond butter
- Greek yogurt with berries
- Hummus with vegetable sticks
- Trail mix with nuts and dried fruit

Remember, healthy eating is about progress, not perfection. Start with one or two recipes and gradually build your repertoire. Your body (and taste buds) will thank you!`,
                excerpt: 'Discover quick and healthy recipes perfect for busy lifestyles, including breakfast, lunch, and dinner ideas that take 30 minutes or less to prepare.',
                tags: ['healthy-eating', 'quick-recipes', 'meal-prep', 'nutrition', 'cooking'],
                status: 'published',
                category: createdCategories[2]._id
            },
            {
                title: 'Building Better Habits: A Practical Guide',
                slug: 'building-better-habits-practical-guide',
                content: `Habits shape our lives more than we realize. From the moment we wake up to when we go to bed, our daily routines determine our success, health, and happiness. Here's how to build better habits that stick.

## Understanding Habits

### The Habit Loop
Every habit consists of three parts:
1. **Cue**: The trigger that initiates the behavior
2. **Routine**: The behavior itself
3. **Reward**: The benefit you gain from the behavior

Understanding this loop is key to changing existing habits and creating new ones.

## The Science of Habit Formation

### How Long Does It Take?
Contrary to popular belief, it doesn't take 21 days to form a habit. Research shows it can take anywhere from 18 to 254 days, with an average of 66 days.

### The Role of Your Brain
Your brain loves habits because they require less energy. Once a behavior becomes automatic, your brain can focus on other tasks.

## Strategies for Building Good Habits

### 1. Start Small
**The 2-Minute Rule**: Make your new habit so easy it takes less than 2 minutes to complete.

**Examples:**
- Want to read more? Start with one page per day
- Want to exercise? Start with 2 push-ups
- Want to meditate? Start with 2 minutes

### 2. Stack Your Habits
Link your new habit to an existing one using this formula:
"After I [existing habit], I will [new habit]."

**Examples:**
- After I pour my morning coffee, I will write in my journal
- After I sit down for dinner, I will say one thing I'm grateful for
- After I put on my pajamas, I will read for 10 minutes

### 3. Design Your Environment
Make good habits obvious and bad habits invisible:
- Put your workout clothes next to your bed
- Keep healthy snacks at eye level in the fridge
- Remove social media apps from your phone's home screen

### 4. Track Your Progress
What gets measured gets managed:
- Use a habit tracker app
- Mark an X on a calendar
- Keep a simple journal
- Use the "don't break the chain" method

## Common Habit-Building Mistakes

### 1. Trying to Change Too Much at Once
Focus on one habit at a time. Master it before adding another.

### 2. Setting Unrealistic Goals
"I'll work out for 2 hours every day" is less likely to succeed than "I'll do 10 minutes of exercise daily."

### 3. Focusing Only on Outcomes
Instead of "I want to lose 20 pounds," try "I want to become someone who exercises regularly."

### 4. Not Having a Plan for Obstacles
Identify potential barriers and plan how to overcome them.

## Breaking Bad Habits

### The 4-Step Process:
1. **Make it invisible**: Remove cues from your environment
2. **Make it unattractive**: Focus on the negative consequences
3. **Make it difficult**: Increase friction for the bad habit
4. **Make it unsatisfying**: Find an accountability partner

## Habit Ideas by Category

### Health & Fitness:
- Drink a glass of water upon waking
- Take the stairs instead of the elevator
- Do 5 minutes of stretching before bed
- Eat one piece of fruit with lunch

### Productivity:
- Plan tomorrow before ending today
- Check email only at designated times
- Use the Pomodoro Technique for focused work
- Clear your desk at the end of each day

### Personal Growth:
- Read for 15 minutes daily
- Practice gratitude journaling
- Learn one new word each day
- Listen to educational podcasts during commutes

### Relationships:
- Put your phone away during meals
- Send one appreciation message daily
- Have device-free conversations
- Schedule regular check-ins with loved ones

## Maintaining Momentum

### When You Miss a Day:
- Don't break the chain twice in a row
- Get back on track immediately
- Focus on consistency over perfection
- Remember why you started

### Celebrating Small Wins:
- Acknowledge your progress
- Reward yourself appropriately
- Share your success with others
- Use positive self-talk

## The Compound Effect

Small habits might seem insignificant, but they compound over time:
- Reading 10 pages daily = 18 books per year
- Saving $5 daily = $1,825 per year
- Walking 2,000 extra steps daily = 730,000 steps per year

## Getting Started Today

1. **Choose one habit** you want to build
2. **Make it specific**: "I will meditate for 5 minutes after I brush my teeth"
3. **Start immediately**: Don't wait for Monday or next month
4. **Track your progress**: Use whatever method works for you
5. **Be patient**: Remember, lasting change takes time

Building better habits is one of the most powerful ways to improve your life. Start small, be consistent, and trust the process. Your future self will thank you for the habits you build today.`,
                excerpt: 'Learn the science behind habit formation and discover practical strategies for building good habits and breaking bad ones that will transform your daily life.',
                tags: ['habits', 'self-improvement', 'productivity', 'personal-development', 'lifestyle'],
                status: 'published',
                category: createdCategories[3]._id
            }
        ];

        // Create posts
        for (const postData of posts) {
            const existingPost = await Post.findOne({ title: postData.title });
            if (!existingPost) {
                const post = new Post({
                    ...postData,
                    author: adminUser._id
                });
                await post.save();
                console.log(`✅ Created post: ${post.title}`);
            } else {
                console.log(`⚠️  Post "${postData.title}" already exists`);
            }
        }

        console.log('\n🎉 Sample content created successfully!');
        console.log('\n📊 Summary:');
        console.log(`   Categories: ${createdCategories.length}`);
        console.log(`   Posts: ${posts.length}`);
        console.log('\n🌐 Visit your blog at: http://localhost:3000');
        console.log('👤 Admin login: admin@blogger.com / admin123');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

createQuickSample();
