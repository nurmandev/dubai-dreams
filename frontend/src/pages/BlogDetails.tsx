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
      <article className="pt-32 md:pt-40 pb-24 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header & Meta Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-start md:items-center md:text-center mb-16"
            >
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-gold font-body text-xs md:text-sm font-medium mb-10 hover:translate-x-[-4px] transition-transform"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Insights
              </Link>

              <div className="flex flex-wrap items-center gap-4 mb-8 md:justify-center">
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

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-[1.05] mb-12 tracking-tight">
                {post.title}
              </h1>

              {/* Author & Share Suite */}
              <div className="w-full flex flex-col md:flex-row items-center justify-between gap-8 py-10 border-y border-border/60">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-lg bg-primary/5 flex items-center justify-center text-primary shrink-0 border border-primary/10 font-display font-medium text-2xl">
                    {post.author.charAt(0)}
                  </div>
                  <div className="text-left">
                    <div className="font-display font-bold text-foreground text-lg md:text-xl">
                      {post.author}
                    </div>
                    <div className="text-muted-foreground text-[10px] md:text-xs font-body uppercase tracking-[0.15em] font-medium">
                      Senior Market Strategist
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground/40 font-bold mr-2 hidden sm:block">
                    Recommend
                  </span>
                  <div className="flex gap-2">
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 rounded-md border border-border/60 hover:border-gold/40 hover:bg-gold/5 transition-all flex items-center justify-center group"
                      title="Share on Facebook"
                    >
                      <Facebook className="w-4 h-4 text-muted-foreground group-hover:text-gold transition-colors" />
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 rounded-md border border-border/60 hover:border-gold/40 hover:bg-gold/5 transition-all flex items-center justify-center group"
                      title="Share on LinkedIn"
                    >
                      <Linkedin className="w-4 h-4 text-muted-foreground group-hover:text-gold transition-colors" />
                    </a>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success("Link copied to clipboard!");
                      }}
                      className="w-11 h-11 rounded-md border border-border/60 hover:border-gold/40 hover:bg-gold/5 transition-all flex items-center justify-center group"
                      title="Copy Link"
                    >
                      <Share2 className="w-4 h-4 text-muted-foreground group-hover:text-gold transition-colors" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Immersive Cover Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.995 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl overflow-hidden shadow-2xl mb-20 aspect-[21/9] md:aspect-[16/7] border border-border/40 relative group"
            >
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-primary/10 mix-blend-overlay group-hover:opacity-0 transition-opacity" />
            </motion.div>

            {/* Content Column */}
            <div className="flex flex-col items-center">
              <div
                className="prose prose-sm sm:prose-base md:prose-lg xl:prose-xl prose-gold w-full font-body text-foreground/90 leading-[1.8]
                  prose-headings:font-display prose-headings:font-bold prose-headings:text-foreground
                  prose-h3:text-3xl prose-p:mb-8 prose-img:rounded-xl prose-strong:text-foreground prose-strong:font-bold prose-blockquote:border-gold/40 prose-blockquote:bg-gold/5 prose-blockquote:rounded-r-lg"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Newsletter Orchestration */}
              <div className="w-full mt-32 p-10 md:p-20 bg-primary rounded-xl border border-white/5 relative overflow-hidden group shadow-3xl">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/[0.02] rounded-full translate-x-1/4 -translate-y-1/4 blur-[100px] group-hover:bg-gold/[0.04] transition-colors duration-1000" />
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-16 h-[1px] bg-gold mb-10" />
                  <h3 className="font-display text-3xl md:text-5xl font-bold text-white mb-8 tracking-tighter">
                    Expert Market{" "}
                    <span className="text-gold">Intelligence</span>
                  </h3>
                  <p className="max-w-2xl text-white/50 font-body text-sm md:text-lg leading-relaxed mb-12">
                    Join a legacy of sophisticated investors. Receive our
                    curated Dubai real estate reports and regulatory insights
                    directly.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
                    <input
                      type="email"
                      placeholder="Corporate email address"
                      className="flex-1 bg-white/[0.04] border border-white/10 rounded-lg px-8 py-5 text-white text-base outline-none focus:border-gold/50 focus:bg-white/10 transition-all font-body"
                    />
                    <Button
                      variant="gold"
                      className="px-12 py-5 h-auto text-[11px] md:text-xs font-black uppercase tracking-[0.25em] rounded-lg bg-gold hover:bg-gold/90 text-primary shadow-2xl shadow-gold/20 transition-all active:scale-95"
                    >
                      Subscribe
                    </Button>
                  </div>
                  <p className="mt-8 text-white/20 text-[10px] uppercase tracking-widest font-black">
                    OMNIS Private Network
                  </p>
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
