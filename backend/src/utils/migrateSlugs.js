const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

const generateSlugs = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error("MONGODB_URI is not defined");
        }

        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDB...");

        const Property = mongoose.model("Property", new mongoose.Schema({
            title: String,
            slug: String
        }, { collection: "properties" }));

        const properties = await Property.find({ 
            $or: [
                { slug: { $exists: false } },
                { slug: null },
                { slug: "" }
            ]
        });
        console.log(`Found ${properties.length} properties to update.`);

        for (const prop of properties) {
            prop.slug = slugify(prop.title);
            await prop.save();
            console.log(`Updated slug: ${prop.title} -> ${prop.slug}`);
        }

        console.log("Completed successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

generateSlugs();
