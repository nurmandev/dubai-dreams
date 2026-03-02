import { Request, Response } from "express";
import Blog from "../../models/Blog";

export class BlogController {
  static async getAllBlogs(req: Request, res: Response) {
    try {
      const blogs = await Blog.find({
        $or: [{ status: "published" }, { status: { $exists: false } }],
      }).sort({
        publishedAt: -1,
      });

      res.json({ blogs: blogs || [] });
    } catch (error) {
      res.status(500).json({ message: "Error fetching blogs", error });
    }
  }

  static async getBlogBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const blog = await Blog.findOne({
        slug,
        $or: [{ status: "published" }, { status: { $exists: false } }],
      });

      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }

      res.json({ blog });
    } catch (error) {
      res.status(500).json({ message: "Error fetching blog details", error });
    }
  }

  static async getBlogById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const blog = await Blog.findById(id);

      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }

      res.json({ blog });
    } catch (error) {
      res.status(500).json({ message: "Error fetching blog details", error });
    }
  }
}
