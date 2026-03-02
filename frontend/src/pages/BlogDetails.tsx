import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import {
  Calendar,
  User,
  ArrowLeft,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

interface BlogPost {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  coverImage: string;
  previewImage: string;
  category: string;
  publishedAt: string;
}

const BlogDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/api/public/blogs/${slug}`);
        setPost(data.blog);
      } catch (err) {
        console.error("Failed to fetch blog post", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <div className="pt-40 pb-20 container mx-auto px-4 text-center">
          <div className="animate-pulse space-y-8 max-w-4xl mx-auto">
            <div className="h-10 bg-muted rounded-xl w-3/4 mx-auto" />
            <div className="h-[400px] bg-muted rounded-2xl w-full" />
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-5/6" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="pt-40 pb-20 container mx-auto px-4 text-center">
          <h1 className="text-2xl font-display font-bold mb-4">
            Post not found
          </h1>
          <Button asChild variant="gold">
            <Link to="/blog">Return to Blog</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-gold font-body text-sm font-medium mb-8 hover:gap-3 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Insights
            </Link>

            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-gold/10 text-gold text-[10px] font-black uppercase tracking-widest rounded-full border border-gold/20">
                {post.category}
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground font-body text-xs">
                <Calendar className="w-3.5 h-3.5" />{" "}
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-8">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 mb-12 py-6 border-y border-border">
              <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0 border border-primary/10 font-display font-bold">
                {post.author.charAt(0)}
              </div>
              <div>
                <div className="font-display font-bold text-foreground">
                  {post.author}
                </div>
                <div className="text-muted-foreground text-xs font-body">
                  Market Insight Expert
                </div>
              </div>

              <div className="ml-auto flex items-center gap-2 md:gap-4">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-muted/30 hover:bg-muted transition-colors flex items-center justify-center"
                  title="Share on Facebook"
                >
                  <Facebook className="w-4 h-4 text-muted-foreground" />
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-muted/30 hover:bg-muted transition-colors flex items-center justify-center"
                  title="Share on LinkedIn"
                >
                  <Linkedin className="w-4 h-4 text-muted-foreground" />
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copied to clipboard!");
                  }}
                  className="p-2.5 rounded-full bg-muted/30 hover:bg-muted transition-colors flex items-center justify-center"
                  title="Copy Link"
                >
                  <Share2 className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="rounded-3xl overflow-hidden shadow-luxury mb-16 h-[500px]"
            >
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </motion.div>

            <div
              className="prose prose-lg prose-gold max-w-none font-body text-foreground/80 leading-relaxed
                prose-headings:font-display prose-headings:font-bold prose-headings:text-foreground
                prose-h3:text-2xl prose-p:mb-6"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Newsletter Integration */}
            <div className="mt-20 p-8 md:p-12 bg-primary rounded-3xl border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
                    Stay Informed
                  </h3>
                  <p className="text-white/60 font-body">
                    Get the latest Dubai real estate market reports and
                    investment opportunities delivered to your inbox.
                  </p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-1 ring-gold"
                  />
                  <Button variant="gold">Subscribe</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BlogDetails;
