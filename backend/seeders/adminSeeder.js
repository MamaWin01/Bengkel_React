import mongoose from 'mongoose'
import AccountModel from '../models/account.js'
import dotenv from 'dotenv'
dotenv.config();

async function seedAdmin() {
    try {
        await mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Database connected successfully');

        const existingAdmin = await AccountModel.findOne({ name: 'Admin' });
        console.log(existingAdmin);
        if (!existingAdmin) {
            const adminCredentials = {
                name: 'Admin',
                email: 'admin@gmail.com',
                password: '123456',
            };
            const user = new AccountModel(adminCredentials);
            await user.save();

            console.log('Admin user created successfully');
        } else {
            console.log('Admin user already exists');
        }
    } catch (err) {
        console.error('Error seeding admin:', err);
    } finally {
        await mongoose.disconnect();
    }
}

seedAdmin().then(() => {
    console.log('Admin seeding completed');
    process.exit(0);
}).catch((err) => {
    console.error('Error seeding admin:', err);
    process.exit(1);
});
