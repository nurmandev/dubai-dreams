import { Request, Response } from "express";
import User from "../../models/User";
import mongoose from "mongoose";

export class ProfileController {
  /**
   * Get user profile
   */
  static async getProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const user = await User.findById(userId).select(
        "-password -sessions -passwordHistory",
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const { firstName, lastName, phoneNumber, about, socials, address } =
        req.body;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update fields
      if (firstName !== undefined) user.firstName = firstName;
      if (lastName !== undefined) user.lastName = lastName;
      if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
      if (about !== undefined) user.about = about;
      if (socials !== undefined) user.socials = socials;
      if (address !== undefined) user.address = address;

      // Update name based on firstName and lastName if both provided
      if (firstName && lastName) {
        user.name = `${firstName} ${lastName}`;
      }

      await user.save();

      res.status(200).json({
        message: "Profile updated successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          about: user.about,
          socials: user.socials,
          address: user.address,
        },
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
