import { Request, Response } from "express";
import KYC from "../../models/KYC";

export class KYCController {
  /**
   * GET /api/dashboard/kyc
   * Returns all KYC submissions for admin review.
   */
  static async getAllSubmissions(req: Request, res: Response) {
    try {
      const submissions = await KYC.find()
        .populate("userId", "name email")
        .sort({ createdAt: -1 })
        .lean();

      res.status(200).json({ submissions });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * PATCH /api/dashboard/kyc/:id/status
   * Updates the status of a KYC submission.
   */
  static async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, remarks } = req.body;

      if (!["pending", "approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const kyc = await KYC.findByIdAndUpdate(
        id,
        { status, remarks },
        { new: true },
      );

      if (!kyc) {
        return res.status(404).json({ message: "KYC submission not found" });
      }

      res.status(200).json({ message: `KYC marked as ${status}`, kyc });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * GET /api/dashboard/kyc/:id/summary
   * placeholder for PDF summary generation
   */
  static async getSummary(req: Request, res: Response) {
    try {
      // In a real implementation, you would use a library like PDFKit or Puppeteer to generate a PDF.
      // For now, we return the data which the frontend can format if needed,
      // or we can simulate a JSON response that represents the summary.
      const kyc = await KYC.findById(req.params.id).populate(
        "userId",
        "name email",
      );
      if (!kyc) return res.status(404).json({ message: "Not found" });

      res.status(200).json({
        message: "PDF Summary generation initialized",
        data: kyc,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
