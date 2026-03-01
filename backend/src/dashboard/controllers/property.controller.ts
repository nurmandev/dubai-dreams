import { Request, Response } from "express";
import Property from "../../models/Property";

export class PropertyController {
  /**
   * Create a new property
   * POST /api/dashboard/properties
   */
  static async createProperty(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;

      const {
        title,
        description,
        price,
        location,
        propertyType,
        status,
        bedrooms,
        bathrooms,
        area,
        amenities,
        yearBuilt,
        kitchens,
        garages,
        garageSize,
        floorsNo,
        listedIn,
        yearlyTaxRate,
        city,
        state,
        zipCode,
        country,
      } = req.body;

      // Extract uploaded files
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const uploadedImages = files["images"]
        ? files["images"].map((file) => file.path)
        : [];
      const uploadedVideo = files["video"] ? files["video"][0].path : undefined;
      const uploadedFloorPlans = files["floorPlans"]
        ? files["floorPlans"].map((file) => file.path)
        : [];

      if (!title || !description || !price || !location) {
        return res.status(400).json({
          message: "Title, description, price, and location are required.",
        });
      }

      // Helper to safely parse numbers and handle strings like "3,210 sqft"
      const parseNum = (val: any) => {
        if (val === undefined || val === null || val === "") return undefined;
        if (typeof val === "number") return val;
        // Strip everything except digits and decimal point
        const sanitized = String(val).replace(/[^0-9.]/g, "");
        const num = parseFloat(sanitized);
        return isNaN(num) ? undefined : num;
      };

      const newProperty = new Property({
        ownerId: userId,
        title,
        description,
        price: parseNum(price) || 0,
        location,
        propertyType: propertyType || "apartment",
        status: status || "pending",
        images: uploadedImages,
        videoUrl: uploadedVideo,
        floorPlans: uploadedFloorPlans,
        bedrooms: parseNum(bedrooms),
        bathrooms: parseNum(bathrooms),
        area: parseNum(area),
        amenities: amenities || [],
        yearBuilt: parseNum(yearBuilt),
        kitchens: parseNum(kitchens),
        garages: parseNum(garages),
        garageSize: parseNum(garageSize),
        floorsNo: parseNum(floorsNo),
        listedIn,
        yearlyTaxRate: parseNum(yearlyTaxRate),
        city,
        state,
        zipCode,
        country,
      });

      await newProperty.save();

      res.status(201).json({
        message: "Property created successfully",
        property: newProperty,
      });
    } catch (error: any) {
      console.error("Error creating property:", error);
      res
        .status(500)
        .json({ message: error.message || "Failed to create property" });
    }
  }

  /**
   * Update an existing property
   * PATCH /api/dashboard/properties/:id
   */
  static async updateProperty(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const { id } = req.params;

      const property = await Property.findOne({ _id: id, ownerId: userId });
      if (!property) {
        return res
          .status(404)
          .json({ message: "Property not found or unauthorized" });
      }

      const parseNum = (val: any) => {
        if (val === undefined || val === null || val === "") return undefined;
        if (typeof val === "number") return val;
        const sanitized = String(val).replace(/[^0-9.]/g, "");
        const num = parseFloat(sanitized);
        return isNaN(num) ? undefined : num;
      };

      const fieldsToParse = [
        "price",
        "bedrooms",
        "bathrooms",
        "area",
        "yearBuilt",
        "kitchens",
        "garages",
        "garageSize",
        "floorsNo",
        "yearlyTaxRate",
      ];

      const updateData = { ...req.body };

      // Handle file uploads during update
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const newImages = files?.["images"]
        ? files["images"].map((file) => file.path)
        : [];
      const newVideo = files?.["video"] ? files["video"][0].path : undefined;
      const newFloorPlans = files?.["floorPlans"]
        ? files["floorPlans"].map((file) => file.path)
        : [];

      // If body.images is present (it's the list of existing images to keep),
      // we need to ensure it's an array and merge with new ones.
      let finalImages = property.images;
      if (updateData.images) {
        // body-parser might send a string if only one item, or it's a JSON array
        const existingToKeep = Array.isArray(updateData.images)
          ? updateData.images
          : [updateData.images];
        finalImages = [...existingToKeep, ...newImages];
      } else if (newImages.length > 0) {
        finalImages = [...property.images, ...newImages];
      }
      updateData.images = finalImages;

      if (newVideo) updateData.videoUrl = newVideo;

      if (newFloorPlans.length > 0) {
        updateData.floorPlans = [
          ...(property.floorPlans || []),
          ...newFloorPlans,
        ];
      }

      fieldsToParse.forEach((field) => {
        if (updateData[field] !== undefined) {
          updateData[field] = parseNum(updateData[field]);
        }
      });

      // Update location summary if address components change
      if (updateData.address || updateData.city || updateData.country) {
        const addr = updateData.address || property.address || "";
        const city = updateData.city || property.city || "";
        const country = updateData.country || property.country || "";
        const locationParts = [addr, city, country].filter(Boolean);
        updateData.location =
          locationParts.length > 0
            ? locationParts.join(", ")
            : property.location;
      }

      // Ensure ownerId is not changed
      delete updateData.ownerId;

      Object.assign(property, updateData);
      await property.save();

      res
        .status(200)
        .json({ message: "Property updated successfully", property });
    } catch (error: any) {
      console.error("Update error:", error);
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Delete a property
   * DELETE /api/dashboard/properties/:id
   */
  static async deleteProperty(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const { id } = req.params;

      const property = await Property.findOneAndDelete({
        _id: id,
        ownerId: userId,
      });
      if (!property) {
        return res
          .status(404)
          .json({ message: "Property not found or unauthorized" });
      }

      res.status(200).json({ message: "Property deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
