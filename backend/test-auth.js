const mongoose = require('mongoose');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

async function test() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const name = "Alice2", email = "alice2@test.com", password = "password123", role = "Admin";
        
        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log('User already exists');
            process.exit(0);
        }

        const user = await User.create({ name, email, password, role });

        if (user) {
            console.log({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        }
    } catch (error) {
        console.error('Caught error:', error);
    } finally {
        process.exit(0);
    }
}
test();
