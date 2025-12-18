import mongoose from 'mongoose';

export const connectDB = async () => {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        console.error('❌ MONGODB_URI environment variable is required');
        // In production, we might want to throw error, but for now we log error
        // throwing error would crash loop which is handled by index.ts
        throw new Error('MONGODB_URI environment variable is required');
    }

    if (uri === 'memory') {
        console.warn('⚠️ Running in IN-MEMORY mode (dev only). Persistence disabled.');
        return;
    }

    try {
        console.log(`[DATABASE] Connecting to MongoDB (URI ending in: ...${uri.slice(-4)})`);
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 10000, // 10 seconds
        });
        console.log('✅ MongoDB connected successfully');
    } catch (error: any) {
        console.error('❌ MongoDB connection failed:', error.message);
        throw error;
    }
};
