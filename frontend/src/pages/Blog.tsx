import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const blogPosts = [
  {
    id: "1",
    title: "Top 5 Areas to Invest in Dubai in 2026",
    excerpt: "Discover the most promising neighborhoods for real estate investment in Dubai this year.",
    date: "Feb 15, 2026",
    image: "/images/property-marina.jpg",
    category: "Investment",
  },
  {
    id: "2",
    title: "Understanding Off-Plan Properties in Dubai",
    excerpt: "A comprehensive guide to buying off-plan properties, payment plans, and developer guarantees.",
    date: "Feb 10, 2026",
    image: "/images/property-offplan.jpg",
    category: "Guide",
  },
  {
    id: "3",
    title: "Dubai Golden Visa Through Real Estate",
    excerpt: "Learn how property investment can qualify you for the UAE's Golden Visa program.",
    date: "Feb 5, 2026",
    image: "/images/property-apartment.jpg",
    category: "News",
  },
];

const Blog = () => {
  return (
    <Layout>
      <section className="pt-20 bg-primary">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-gold font-body text-sm tracking-[0.3em] uppercase mb-2">Insights & News</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">Blog</h1>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-card rounded-xl overflow-hidden shadow-luxury hover:shadow-xl transition-all duration-500"
              >
                <div className="h-52 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-gold font-body text-xs font-semibold uppercase tracking-wider">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground font-body text-xs">
                      <Calendar className="w-3 h-3" /> {post.date}
                    </span>
                  </div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-2 group-hover:text-emerald transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground font-body text-sm leading-relaxed mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <span className="text-gold font-body text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read More <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
