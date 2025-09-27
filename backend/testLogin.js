const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const User = require('./models/User');

async function testLogin() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        // Find admin user
        const admin = await User.findOne({ email: 'admin@blogger.com' });
        if (!admin) {
            console.log('❌ Admin user not found!');
            process.exit(1);
        }

        console.log('✅ Admin user found:');
        console.log('- Username:', admin.username);
        console.log('- Email:', admin.email);
        console.log('- Role:', admin.role);
        console.log('- Created:', admin.createdAt);

        // Test password
        const isPasswordValid = await admin.comparePassword('admin123');
        if (isPasswordValid) {
            console.log('✅ Password is correct!');
        } else {
            console.log('❌ Password is incorrect!');
        }
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

// Run the test
testLogin();
