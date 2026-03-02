import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Calendar, ArrowLeft, Share2, Facebook, Linkedin } from "lucide-react";
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
              className="text-left mb-12"
            >
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-gold font-body text-xs md:text-sm font-medium mb-10 hover:translate-x-1 transition-transform"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Insights
              </Link>

              <div className="flex items-center gap-4 mb-6">
                <span className="px-3 py-1 bg-gold/10 text-gold text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm border border-gold/20">
                  {post.category}
                </span>
                <span className="flex items-center gap-2 text-muted-foreground/60 font-body text-[10px] md:text-xs tracking-wider">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] mb-12 tracking-tight">
                {post.title}
              </h1>

              {/* Author & Share Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-8 py-10 border-y border-border/60 mb-12">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center text-primary shrink-0 border border-primary/10 font-display font-medium text-xl">
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-display font-bold text-foreground text-base md:text-lg">
                      {post.author}
                    </div>
                    <div className="text-muted-foreground text-[10px] md:text-xs font-body uppercase tracking-[0.15em] font-medium">
                      Market Analyst & Advisor
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground/40 font-bold mr-2 hidden sm:block">
                    Share Article
                  </span>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-md border border-border/60 hover:border-gold/40 hover:bg-gold/5 transition-all flex items-center justify-center group"
                    title="Share on Facebook"
                  >
                    <Facebook className="w-4 h-4 text-muted-foreground group-hover:text-gold transition-colors" />
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-md border border-border/60 hover:border-gold/40 hover:bg-gold/5 transition-all flex items-center justify-center group"
                    title="Share on LinkedIn"
                  >
                    <Linkedin className="w-4 h-4 text-muted-foreground group-hover:text-gold transition-colors" />
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Link copied to clipboard!");
                    }}
                    className="w-10 h-10 rounded-md border border-border/60 hover:border-gold/40 hover:bg-gold/5 transition-all flex items-center justify-center group"
                    title="Copy Link"
                  >
                    <Share2 className="w-4 h-4 text-muted-foreground group-hover:text-gold transition-colors" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Main Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.995 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl overflow-hidden shadow-2xl mb-16 aspect-[16/9] border border-border/40"
            >
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover transition-all duration-700"
              />
            </motion.div>

            {/* Article Body */}
            <div
              className="prose prose-sm sm:prose-base md:prose-lg prose-gold mx-auto font-body text-foreground/90 leading-[1.8]
                prose-headings:font-display prose-headings:font-bold prose-headings:text-foreground
                prose-h3:text-2xl prose-p:mb-8 prose-img:rounded-xl prose-strong:text-foreground prose-strong:font-bold prose-blockquote:border-gold/40 prose-blockquote:bg-gold/5 prose-blockquote:rounded-r-lg"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Newsletter Integration */}
            <div className="mt-28 p-10 md:p-14 bg-primary rounded-xl border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-gold/[0.03] rounded-full translate-x-1/4 -translate-y-1/4 blur-3xl group-hover:bg-gold/[0.05] transition-colors duration-700" />
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-12 h-[1px] bg-gold mb-8" />
                <h3 className="font-display text-2xl md:text-4xl font-bold text-white mb-6 tracking-tight">
                  Expert Market <span className="text-gold">Intelligence</span>
                </h3>
                <p className="max-w-xl text-white/50 font-body text-sm md:text-base leading-relaxed mb-10">
                  Join a network of sophisticated investors. Receive our curated
                  Dubai real estate reports and regulatory insights directly.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                  <input
                    type="email"
                    placeholder="Corporate email address"
                    className="flex-1 bg-white/[0.03] border border-white/10 rounded-lg px-6 py-4 text-white text-sm outline-none focus:border-gold/50 focus:bg-white/[0.05] transition-all"
                  />
                  <Button
                    variant="gold"
                    className="px-10 py-4 h-auto text-[10px] font-bold uppercase tracking-[0.25em] rounded-lg bg-gold hover:bg-gold/90 text-primary shadow-lg shadow-gold/10"
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
