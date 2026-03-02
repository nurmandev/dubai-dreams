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
import { toast } from "sonner";

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
      <article className="pt-32 md:pt-40 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {/* Header & Meta */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-10"
            >
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-gold font-body text-xs md:text-sm font-medium mb-8 hover:gap-3 transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Insights
              </Link>

              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="px-3 py-1 bg-gold/10 text-gold text-[10px] font-black uppercase tracking-widest rounded-full border border-gold/20">
                  {post.category}
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground font-body text-[10px] md:text-xs">
                  <Calendar className="w-3.5 h-3.5" />{" "}
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-[1.2] mb-10">
                {post.title}
              </h1>

              {/* Author & Share Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-8 border-y border-border mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0 border border-primary/10 font-display font-bold">
                    {post.author.charAt(0)}
                  </div>
                  <div className="text-left">
                    <div className="font-display font-bold text-foreground text-sm md:text-base">
                      {post.author}
                    </div>
                    <div className="text-muted-foreground text-[10px] md:text-xs font-body uppercase tracking-wider">
                      Market Insight Expert
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-full bg-muted/20 hover:bg-muted transition-colors flex items-center justify-center"
                    title="Share on Facebook"
                  >
                    <Facebook className="w-4 h-4 text-muted-foreground" />
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-full bg-muted/20 hover:bg-muted transition-colors flex items-center justify-center"
                    title="Share on LinkedIn"
                  >
                    <Linkedin className="w-4 h-4 text-muted-foreground" />
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Link copied to clipboard!");
                    }}
                    className="p-2.5 rounded-full bg-muted/20 hover:bg-muted transition-colors flex items-center justify-center"
                    title="Copy Link"
                  >
                    <Share2 className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Main Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-2xl mb-16 aspect-video"
            >
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Article Body */}
            <div
              className="prose prose-sm sm:prose-base md:prose-lg prose-gold mx-auto font-body text-foreground/80 leading-relaxed
                prose-headings:font-display prose-headings:font-bold prose-headings:text-foreground
                prose-h3:text-2xl prose-p:mb-8 prose-img:rounded-3xl"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Newsletter Integration */}
            <div className="mt-24 p-8 md:p-12 bg-primary rounded-[2.5rem] border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-10">
                <div className="flex-1 text-center md:text-left">
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
                    OMNIS <span className="text-gold">Digest</span>
                  </h3>
                  <p className="text-white/60 font-body text-sm md:text-base leading-relaxed">
                    Join professional investors who receive our curated market
                    reports and luxury opportunities weekly.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <input
                    type="email"
                    placeholder="Expert email address"
                    className="flex-1 md:w-64 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm outline-none focus:ring-1 ring-gold transition-all"
                  />
                  <Button
                    variant="gold"
                    className="w-full sm:w-auto px-8 py-6 h-auto text-xs font-black uppercase tracking-[0.2em] rounded-2xl"
                  >
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default BlogDetails;
