import { Request, Response } from "express";
import Property from "../../models/Property";
import {
  deleteCloudinaryAsset,
  deleteCloudinaryAssets,
} from "../../utils/cloudinary";

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
        region,
        areaLocation,
        zipCode,
        country,
        address,
        unitTypes,
        handoverYear,
        totalFloors,
        paymentPlanOnBooking,
        paymentPlanDuringConstruction,
        paymentPlanOnHandover,
      } = req.body;

      // Extract uploaded files safely
      const files =
        (req.files as { [fieldname: string]: Express.Multer.File[] }) || {};
      const uploadedImages = files["images"]
        ? files["images"].map((file) => file.path)
        : [];
      const uploadedVideo =
        files["video"] && files["video"][0]
          ? files["video"][0].path
          : undefined;
      const uploadedFloorPlans = files["floorPlans"]
        ? files["floorPlans"].map((file) => file.path)
        : [];
      const uploadedTechnicalPdf =
        files["technicalPdf"] && files["technicalPdf"][0]
          ? files["technicalPdf"][0].path
          : undefined;

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
        address,
        location,
        propertyType: propertyType || "apartment",
        status: status || "pending",
        images: uploadedImages,
        videoUrl: uploadedVideo,
        technicalPdf: uploadedTechnicalPdf,
        floorPlans: uploadedFloorPlans,
        bedrooms:
          typeof bedrooms === "string" && bedrooms.includes("-")
            ? bedrooms
            : parseNum(bedrooms),
        bathrooms:
          typeof bathrooms === "string" && bathrooms.includes("-")
            ? bathrooms
            : parseNum(bathrooms),
        area:
          typeof area === "string" && area.includes("-")
            ? area
            : parseNum(area),
        amenities: Array.isArray(amenities)
          ? amenities
          : typeof amenities === "string"
            ? amenities.includes(",")
              ? amenities.split(",").map((a) => a.trim())
              : [amenities]
            : [],
        yearBuilt: parseNum(yearBuilt),
        kitchens: parseNum(kitchens),
        garages: parseNum(garages),
        garageSize: parseNum(garageSize),
        floorsNo: parseNum(floorsNo),
        listedIn,
        yearlyTaxRate: parseNum(yearlyTaxRate),
        city,
        state,
        region,
        areaLocation,
        zipCode,
        country,
        // Off-plan fields
        unitTypes,
        handoverYear,
        totalFloors: parseNum(totalFloors),
        paymentPlan: {
          onBooking: parseNum(paymentPlanOnBooking),
          duringConstruction: parseNum(paymentPlanDuringConstruction),
          onHandover: parseNum(paymentPlanOnHandover),
        },
      });

      await newProperty.save();

      res.status(201).json({
        message: "Property created successfully",
        property: newProperty,
      });
    } catch (error: any) {
      console.error("Error creating property:", error);
      require("fs").appendFileSync(
        "error_log.txt",
        (error.stack || error.message) + "\n",
      );
      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: Object.values(error.errors)
            .map((err: any) => err.message)
            .join(", "),
        });
      }
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
        "price",
        "yearBuilt",
        "kitchens",
        "garages",
        "garageSize",
        "floorsNo",
        "yearlyTaxRate",
        "totalFloors",
        "paymentPlanOnBooking",
        "paymentPlanDuringConstruction",
        "paymentPlanOnHandover",
      ];

      const updateData = { ...req.body };

      // Handle file uploads during update safely
      const files =
        (req.files as { [fieldname: string]: Express.Multer.File[] }) || {};
      const newImages = files["images"]
        ? files["images"].map((file) => file.path)
        : [];
      const newVideo =
        files["video"] && files["video"][0]
          ? files["video"][0].path
          : undefined;
      const newFloorPlans = files["floorPlans"]
        ? files["floorPlans"].map((file) => file.path)
        : [];
      const newTechnicalPdf =
        files["technicalPdf"] && files["technicalPdf"][0]
          ? files["technicalPdf"][0].path
          : undefined;

      // If body.images is present (it's the list of existing images to keep),
      // we need to ensure it's an array and merge with new ones.
      let finalImages = property.images;
      if (updateData.images) {
        // body-parser might send a string if only one item, or it's a JSON array
        const existingToKeep = Array.isArray(updateData.images)
          ? updateData.images
          : [updateData.images];
        // Delete removed images from Cloudinary
        const removedImages = property.images.filter(
          (img) => !existingToKeep.includes(img),
        );
        if (removedImages.length > 0) {
          deleteCloudinaryAssets(removedImages).catch(console.error);
        }
        finalImages = [...existingToKeep, ...newImages];
      } else if (newImages.length > 0) {
        finalImages = [...property.images, ...newImages];
      }
      updateData.images = finalImages;

      if (newVideo) {
        // Delete old video from Cloudinary if it's being replaced
        if (property.videoUrl) {
          deleteCloudinaryAsset(property.videoUrl).catch(console.error);
        }
        updateData.videoUrl = newVideo;
      } else if (updateData.videoUrl && Array.isArray(updateData.videoUrl)) {
        updateData.videoUrl = updateData.videoUrl[0];
      }

      // Handle floor plans: find removed ones and delete from Cloudinary
      if (newFloorPlans.length > 0 || updateData.floorPlans !== undefined) {
        const oldFloorPlans = property.floorPlans || [];
        const keptFloorPlans = updateData.floorPlans
          ? Array.isArray(updateData.floorPlans)
            ? updateData.floorPlans
            : [updateData.floorPlans]
          : oldFloorPlans;
        const removedFloorPlans = oldFloorPlans.filter(
          (fp) => !keptFloorPlans.includes(fp),
        );
        if (removedFloorPlans.length > 0) {
          deleteCloudinaryAssets(removedFloorPlans).catch(console.error);
        }
        updateData.floorPlans = [...keptFloorPlans, ...newFloorPlans];
      }

      if (newTechnicalPdf) {
        // Delete old brochure from Cloudinary if it's being replaced
        if (property.technicalPdf) {
          deleteCloudinaryAsset(property.technicalPdf).catch(console.error);
        }
        updateData.technicalPdf = newTechnicalPdf;
      } else if (
        updateData.technicalPdf &&
        Array.isArray(updateData.technicalPdf)
      ) {
        updateData.technicalPdf = updateData.technicalPdf[0];
      }

      fieldsToParse.forEach((field) => {
        if (updateData[field] !== undefined) {
          updateData[field] = parseNum(updateData[field]);
        }
      });

      // Special handling for beds/baths/area to support ranges
      ["bedrooms", "bathrooms", "area"].forEach((field) => {
        if (updateData[field] !== undefined) {
          if (
            typeof updateData[field] === "string" &&
            updateData[field].includes("-")
          ) {
            // Keep as string range
          } else {
            updateData[field] = parseNum(updateData[field]);
          }
        }
      });

      if (updateData.amenities) {
        updateData.amenities = Array.isArray(updateData.amenities)
          ? updateData.amenities
          : typeof updateData.amenities === "string"
            ? updateData.amenities.includes(",")
              ? updateData.amenities.split(",").map((a) => a.trim())
              : [updateData.amenities]
            : [];
      }

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

      // Handle nested paymentPlan if individual fields are provided
      if (
        updateData.paymentPlanOnBooking !== undefined ||
        updateData.paymentPlanDuringConstruction !== undefined ||
        updateData.paymentPlanOnHandover !== undefined
      ) {
        updateData.paymentPlan = {
          onBooking:
            updateData.paymentPlanOnBooking !== undefined
              ? updateData.paymentPlanOnBooking
              : property.paymentPlan?.onBooking,
          duringConstruction:
            updateData.paymentPlanDuringConstruction !== undefined
              ? updateData.paymentPlanDuringConstruction
              : property.paymentPlan?.duringConstruction,
          onHandover:
            updateData.paymentPlanOnHandover !== undefined
              ? updateData.paymentPlanOnHandover
              : property.paymentPlan?.onHandover,
        };
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
      require("fs").appendFileSync(
        "error_log.txt",
        (error.stack || error.message) + "\n",
      );
      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: Object.values(error.errors)
            .map((err: any) => err.message)
            .join(", "),
        });
      }
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

      const property = await Property.findOne({ _id: id, ownerId: userId });
      if (!property) {
        return res
          .status(404)
          .json({ message: "Property not found or unauthorized" });
      }

      // Collect all Cloudinary assets attached to this property
      const allAssets: string[] = [
        ...(property.images || []),
        ...(property.floorPlans || []),
        property.videoUrl,
        property.technicalPdf,
      ].filter((url): url is string => Boolean(url));

      // Delete all assets from Cloudinary (non-blocking – DB delete is the priority)
      if (allAssets.length > 0) {
        deleteCloudinaryAssets(allAssets).catch((err) =>
          console.error(
            "[Cloudinary] Cleanup error during property delete:",
            err,
          ),
        );
      }

      await property.deleteOne();

      res.status(200).json({ message: "Property deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
