import { Request, Response } from "express";
import Property from "../../models/Property";
import AuditLog from "../../models/AuditLog";
import User from "../../models/User";
import Inquiry from "../../models/Inquiry";

export class DashboardController {
  /**
   * GET /api/dashboard/stats
   * Returns aggregated stats for the authenticated user's dashboard.
   */
  static async getStats(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;

      const [totalProperties, totalPending, totalFavourites, viewsAgg] =
        await Promise.all([
          // Total properties owned by user
          Property.countDocuments({ ownerId: userId }),

          // Pending properties
          Property.countDocuments({ ownerId: userId, status: "pending" }),

          // Total times any of user's properties were favourited
          Property.aggregate([
            {
              $match: {
                ownerId: new (require("mongoose").Types.ObjectId)(userId),
              },
            },
            { $project: { count: { $size: "$favouritedBy" } } },
            { $group: { _id: null, total: { $sum: "$count" } } },
          ]),

          // Total views across all user properties
          Property.aggregate([
            {
              $match: {
                ownerId: new (require("mongoose").Types.ObjectId)(userId),
              },
            },
            { $group: { _id: null, total: { $sum: "$views" } } },
          ]),
        ]);

      const totalViews = viewsAgg.length > 0 ? viewsAgg[0].total : 0;
      const totalFavs =
        totalFavourites.length > 0 ? totalFavourites[0].total : 0;

      res.status(200).json({
        totalProperties,
        totalPending,
        totalViews,
        totalFavourites: totalFavs,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * GET /api/dashboard/views-chart
   * Returns daily property view data for the last 7 days.
   */
  static async getViewsChart(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;

      // Build last-7-days labels
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const today = new Date();
      const labels: string[] = [];
      const dateRanges: { start: Date; end: Date }[] = [];

      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        labels.push(days[d.getDay()]);
        const start = new Date(d.setHours(0, 0, 0, 0));
        const end = new Date(d.setHours(23, 59, 59, 999));
        dateRanges.push({ start, end });
      }

      // For a real app, you'd have a PropertyView event log.
      // Here we simulate with AuditLog entries where action = 'PROPERTY_VIEW'
      // (or just use real views tracking). For now, return seeded realistic data.
      const viewData = await Promise.all(
        dateRanges.map(async ({ start, end }) => {
          const count = await AuditLog.countDocuments({
            userId,
            action: "PROPERTY_VIEW",
            timestamp: { $gte: start, $lte: end },
          });
          return count;
        }),
      );

      res.status(200).json({ labels, data: viewData });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * GET /api/dashboard/recent-messages
   * Returns the most recent lead inquiries for the admin.
   */
  static async getRecentMessages(req: Request, res: Response) {
    try {
      // Inquiries are global for all admins in this implementation
      const inquiries = await Inquiry.find()
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();

      const messages = (inquiries as any[]).map((inquiry: any) => ({
        id: inquiry._id,
        name: inquiry.name,
        email: inquiry.email,
        phone: inquiry.phone,
        message: inquiry.message,
        propertyTitle: inquiry.propertyTitle,
        createdAt: inquiry.createdAt,
        status: inquiry.status,
      }));

      res.status(200).json({ messages });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * GET /api/dashboard/properties
   * Returns a paginated list of the user's properties.
   */
  static async getProperties(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const [properties, total] = await Promise.all([
        Property.find({ ownerId: userId })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Property.countDocuments({ ownerId: userId }),
      ]);

      res
        .status(200)
        .json({
          properties,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * PATCH /api/dashboard/inquiry/:id/status
   * Updates the status of an inquiry (resolved/archived).
   */
  static async updateInquiryStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!["new", "resolved", "archived"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const inquiry = await Inquiry.findByIdAndUpdate(
        id,
        { status },
        { new: true },
      );

      if (!inquiry) {
        return res.status(404).json({ message: "Inquiry not found" });
      }

      res.status(200).json({ message: `Inquiry marked as ${status}`, inquiry });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
