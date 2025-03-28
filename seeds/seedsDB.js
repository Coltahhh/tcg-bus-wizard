import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import User from '../models/User.js';
import Tournament from '../models/Tournament.js';
import connectDB from '../config/db.js';

const seedUsers = async (count = 5) => {
    const users = [];
    for (let i = 0; i < count; i++) {
        users.push({
            username: faker.internet.userName(),
            email: faker.internet.email(),
            password: 'password123'
        });
    }
    return User.insertMany(users);
};

const seedTournaments = async (users) => {
    // ... tournament seeding logic
};

const seedDB = async () => {
    await connectDB();
    await mongoose.connection.dropDatabase();

    const users = await seedUsers();
    await seedTournaments(users);

    console.log('Database seeded!');
    process.exit();
};

seedDB();
