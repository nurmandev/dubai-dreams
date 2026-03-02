import { Request, Response } from "express";
import Blog from "../../models/Blog";

export class BlogController {
  static async getAllBlogs(req: Request, res: Response) {
    try {
      const blogs = await Blog.find({ status: "published" }).sort({
        publishedAt: -1,
      });

      // If no blogs in DB, return some mock ones so the UI isn't empty initially
      if (blogs.length === 0) {
        const mockBlogs = [
          {
            _id: "m1",
            title: "Top 5 Areas to Invest in Dubai in 2026",
            slug: "top-5-areas-invest-dubai-2026",
            excerpt:
              "Discover the most promising neighborhoods for real estate investment in Dubai this year.",
            content: "Full content about Dubai investment areas...",
            date: "Feb 15, 2026",
            image: "/images/property-marina.jpg",
            category: "Investment",
            publishedAt: new Date("2026-02-15"),
          },
          {
            _id: "m2",
            title: "Understanding Off-Plan Properties in Dubai",
            slug: "understanding-off-plan-properties",
            excerpt:
              "A comprehensive guide to buying off-plan properties, payment plans, and developer guarantees.",
            content: "Full content about off-plan properties...",
            date: "Feb 10, 2026",
            image: "/images/property-offplan.jpg",
            category: "Guide",
            publishedAt: new Date("2026-02-10"),
          },
        ];
        return res.json({ blogs: mockBlogs });
      }

      res.json({ blogs });
    } catch (error) {
      res.status(500).json({ message: "Error fetching blogs", error });
    }
  }

  static async getBlogBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const blog = await Blog.findOne({ slug, status: "published" });

      if (!blog) {
        // Check mock slugs for demo purposes
        if (slug === "top-5-areas-invest-dubai-2026") {
          return res.json({
            blog: {
              title: "Top 5 Areas to Invest in Dubai in 2026",
              slug: "top-5-areas-invest-dubai-2026",
              excerpt:
                "Discover the most promising neighborhoods for real estate investment in Dubai this year.",
              content: `
                        <p>Dubai's real estate market continues to be a global magnet for investors. As we move into 2026, several key areas have emerged as hotspots for high rental yields and capital appreciation.</p>
                        <h3>1. Dubai Marina</h3>
                        <p>Always a favorite, the Marina continues to offer strong ROI due to its high demand for waterfront living.</p>
                        <h3>2. Business Bay</h3>
                        <p>With massive infrastructure improvements, Business Bay is becoming the preferred choice for young professionals.</p>
                        <h3>3. Palm Jumeirah</h3>
                        <p>The pinnacle of luxury. Demand for villas on the Palm remains at an all-time high.</p>
                    `,
              publishedAt: new Date("2026-02-15"),
              image: "/images/property-marina.jpg",
              category: "Investment",
              author: "Omnis Properties",
            },
          });
        }
        return res.status(404).json({ message: "Blog not found" });
      }

      res.json({ blog });
    } catch (error) {
      res.status(500).json({ message: "Error fetching blog details", error });
    }
  }
}
