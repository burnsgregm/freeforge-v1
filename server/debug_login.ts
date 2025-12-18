import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './src/models/User';
import bcrypt from 'bcryptjs';

dotenv.config();

const runDebug = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error("No MONGODB_URI");

        console.log("1. Connecting to DB...");
        await mongoose.connect(uri);
        console.log("   Connected.");

        const email = 'admin@freeforge.com';
        console.log(`2. Finding user: ${email}`);
        const user = await User.findOne({ email });

        if (!user) {
            console.error("   User NOT FOUND.");
            process.exit(1);
        }
        console.log("   User found:", {
            id: user._id,
            email: user.email,
            role: user.role,
            hashPrefix: user.passwordHash?.substring(0, 10) + '...'
        });

        const password = 'nimda';
        console.log(`3. Testing password directly with bcryptjs: '${password}'`);
        const isValidBcrypt = await bcrypt.compare(password, user.passwordHash);
        console.log(`   bcrypt.compare result: ${isValidBcrypt}`);

        console.log("4. Testing user.validatePassword() method...");
        const isValidMethod = await user.validatePassword(password);
        console.log(`   user.validatePassword result: ${isValidMethod}`);

        if (isValidMethod) {
            console.log("✅ SUCCESS: Login logic is working in isolation.");
        } else {
            console.error("❌ FAILURE: Password rejected.");
        }

    } catch (err: any) {
        console.error("💥 CRASHED:", err);
    } finally {
        await mongoose.disconnect();
    }
};

runDebug();
