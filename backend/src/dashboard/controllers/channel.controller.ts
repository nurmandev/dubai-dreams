import { Request, Response } from "express";
import SocialChannel from "../../models/SocialChannel";

export class ChannelController {
  /**
   * Get all social channels
   */
  static async getChannels(req: Request, res: Response) {
    try {
      const channels = await SocialChannel.find().sort({ order: 1 });
      res.status(200).json({ channels });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch channels" });
    }
  }

  /**
   * Create a new social channel
   */
  static async createChannel(req: Request, res: Response) {
    try {
      const { name, url, icon, isActive, order } = req.body;
      const channel = new SocialChannel({ name, url, icon, isActive, order });
      await channel.save();
      res.status(201).json({ message: "Channel created successfully", channel });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to create channel" });
    }
  }

  /**
   * Update an existing social channel
   */
  static async updateChannel(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, url, icon, isActive, order } = req.body;
      const channel = await SocialChannel.findByIdAndUpdate(
        id,
        { name, url, icon, isActive, order },
        { new: true },
      );
      if (!channel) {
        return res.status(404).json({ message: "Channel not found" });
      }
      res.status(200).json({ message: "Channel updated successfully", channel });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to update channel" });
    }
  }

  /**
   * Delete a social channel
   */
  static async deleteChannel(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const channel = await SocialChannel.findByIdAndDelete(id);
      if (!channel) {
        return res.status(404).json({ message: "Channel not found" });
      }
      res.status(200).json({ message: "Channel deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to delete channel" });
    }
  }
}
