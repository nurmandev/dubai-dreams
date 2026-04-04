import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import Property from "../models/Property";
import { slugify } from "./string";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const generateSlugs = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error("MONGODB_URI is not defined");
        }

        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDB...");

        const properties = await Property.find({ slug: { $exists: false } });
        console.log(`Found ${properties.length} properties without slugs.`);

        for (const prop of properties) {
            prop.slug = slugify(prop.title);
            await prop.save();
            console.log(`Generated slug for: ${prop.title} -> ${prop.slug}`);
        }

        console.log("Slugs generation completed.");
        process.exit(0);
    } catch (error) {
        console.error("Error generating slugs:", error);
        process.exit(1);
    }
};

generateSlugs();
