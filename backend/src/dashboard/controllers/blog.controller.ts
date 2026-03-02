import { Request, Response } from "express";
import Blog from "../../models/Blog";

export class BlogAdminController {
  static async getAllBlogs(req: Request, res: Response) {
    try {
      const blogs = await Blog.find().sort({ createdAt: -1 });
      res.json({ blogs });
    } catch (error) {
      res.status(500).json({ message: "Error fetching blogs", error });
    }
  }

  static async createBlog(req: Request, res: Response) {
    try {
      const { title, excerpt, content, category, status } = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const coverImage = files?.coverImage?.[0]?.path;
      const previewImage = files?.previewImage?.[0]?.path;

      if (!coverImage || !previewImage) {
        return res
          .status(400)
          .json({ message: "Cover and preview images are required" });
      }

      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const blog = new Blog({
        title,
        slug,
        excerpt,
        content,
        category,
        status: status || "published",
        coverImage,
        previewImage,
        publishedAt: status === "published" ? new Date() : undefined,
      });

      await blog.save();
      res.status(201).json({ message: "Blog created successfully", blog });
    } catch (error) {
      res.status(500).json({ message: "Error creating blog", error });
    }
  }

  static async updateBlog(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, excerpt, content, category, status } = req.body;

      const updateData: any = {
        title,
        excerpt,
        content,
        category,
        status,
      };

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files?.coverImage?.[0]?.path)
        updateData.coverImage = files.coverImage[0].path;
      if (files?.previewImage?.[0]?.path)
        updateData.previewImage = files.previewImage[0].path;

      if (title) {
        updateData.slug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
      }

      const blog = await Blog.findByIdAndUpdate(id, updateData, { new: true });
      if (!blog) return res.status(404).json({ message: "Blog not found" });

      res.json({ message: "Blog updated successfully", blog });
    } catch (error) {
      res.status(500).json({ message: "Error updating blog", error });
    }
  }

  static async deleteBlog(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const blog = await Blog.findByIdAndDelete(id);
      if (!blog) return res.status(404).json({ message: "Blog not found" });
      res.json({ message: "Blog deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting blog", error });
    }
  }
}
