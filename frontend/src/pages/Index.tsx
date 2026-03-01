import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Building2,
  Shield,
  Globe,
  TrendingUp,
  Search,
  MapPin,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";
import PropertyCard from "@/components/PropertyCard";
import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Property as PropertyType } from "@/data/properties";

const Index = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchType, setSearchType] = useState("buy");
  const [locationValue, setLocationValue] = useState("");
  const [propType, setPropType] = useState("all");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (locationValue) params.set("search", locationValue);
    if (propType !== "all") params.set("type", propType);

    // Map searchType to category
    let category = "all";
    if (searchType === "off-plan") category = "off-plan";
    if (searchType === "rent") category = "rental";
    if (searchType === "buy") category = "secondary";

    params.set("category", category);

    navigate(`/properties?${params.toString()}`);
  };
  // ... (rest of the component structure)

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data } = await api.get("/api/public/properties");
        if (data && data.properties) {
          const mapped: PropertyType[] = data.properties.map((p: any) => ({
            id: p.id,
            title: p.title,
            price: p.price,
            area: p.property_info?.sqft || 0,
            bedrooms: p.property_info?.bed || 0,
            bathrooms: p.property_info?.bath || 0,
            location: p.location || p.address,
            type: p.type?.toLowerCase() || "apartment",
            category:
              p.listedIn === "Off-Plan"
                ? "off-plan"
                : p.listedIn === "Rent"
                  ? "rental"
                  : "secondary",
            status: p.status === "active" ? "ready" : "off-plan",
            image:
              p.carousel_thumb?.[0]?.img || "/images/property-placeholder.jpg",
            featured: true, // For home page we'll show them as featured
          }));
          setProperties(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch featured properties:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const featuredProperties = properties.slice(0, 6); // Just show the first 6 for featured

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-screen min-h-[700px] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/hero-dubai.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-hero" />

        <div className="relative z-10 container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <p className="text-gold font-body text-sm tracking-[0.3em] uppercase mb-4">
              Dubai's Premier Real Estate
            </p>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-6">
              Discover Luxury
              <br />
              <span className="text-gradient-gold">Living in Dubai</span>
            </h1>
            <p className="text-primary-foreground/70 font-body text-lg md:text-xl max-w-xl mb-8 leading-relaxed">
              Off-plan investments, premium resale properties, and exclusive
              rentals — curated for discerning investors worldwide.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/properties">
                  Explore Properties
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/contact">Schedule a Viewing</Link>
              </Button>
            </div>
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-12 max-w-4xl"
          >
            <div className="bg-primary-foreground/10 backdrop-blur-xl rounded-xl p-2 border border-primary-foreground/10">
              <div className="flex gap-1 mb-3 px-2">
                {["buy", "rent", "off-plan"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setSearchType(t)}
                    className={`font-body text-sm px-4 py-2 rounded-lg transition-all ${
                      searchType === t
                        ? "bg-gold text-accent-foreground"
                        : "text-primary-foreground/70 hover:text-primary-foreground"
                    }`}
                  >
                    {t === "off-plan"
                      ? "Off-Plan"
                      : t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 flex items-center gap-2 bg-primary-foreground/10 rounded-lg px-4 py-3 min-w-0">
                  <MapPin className="w-4 h-4 text-gold shrink-0" />
                  <input
                    type="text"
                    value={locationValue}
                    onChange={(e) => setLocationValue(e.target.value)}
                    placeholder="Search by location..."
                    className="bg-transparent text-primary-foreground placeholder:text-primary-foreground/40 font-body text-sm w-full outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 bg-primary-foreground/10 rounded-lg px-4 py-3 shrink-0">
                  <select
                    value={propType}
                    onChange={(e) => setPropType(e.target.value)}
                    className="bg-transparent text-primary-foreground font-body text-sm outline-none cursor-pointer appearance-none pr-6"
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.4)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right center",
                      backgroundSize: "1rem",
                    }}
                  >
                    <option value="all" className="bg-primary text-white">
                      All Types
                    </option>
                    <option value="apartment" className="bg-primary text-white">
                      Apartment
                    </option>
                    <option value="villa" className="bg-primary text-white">
                      Villa
                    </option>
                    <option value="townhouse" className="bg-primary text-white">
                      Townhouse
                    </option>
                    <option value="penthouse" className="bg-primary text-white">
                      Penthouse
                    </option>
                  </select>
                </div>
                <Button
                  variant="gold"
                  size="lg"
                  className="shrink-0"
                  onClick={handleSearch}
                >
                  <Search className="w-4 h-4" />
                  Search
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
          >
            <div>
              <p className="text-gold font-body text-sm tracking-[0.2em] uppercase mb-2">
                Handpicked Selection
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Featured Properties
              </h2>
            </div>
            <Link
              to="/properties"
              className="text-emerald hover:text-gold font-body text-sm font-medium flex items-center gap-1 mt-4 md:mt-0 transition-colors"
            >
              View All Properties <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              [1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-[400px] w-full bg-muted/20 animate-pulse rounded-lg"
                />
              ))
            ) : featuredProperties.length > 0 ? (
              featuredProperties.map((property, i) => (
                <PropertyCard key={property.id} property={property} index={i} />
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-muted-foreground">
                <p className="font-display text-xl">
                  No featured properties at the moment.
                </p>
                <p className="font-body mt-2">
                  Check back soon for our latest exclusive listings.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-gold font-body text-sm tracking-[0.2em] uppercase mb-2">
              Browse By Category
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              What Are You Looking For?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Off-Plan",
                desc: "Invest early in Dubai's most anticipated developments with flexible payment plans.",
                image: "/images/property-offplan.jpg",
                link: "/properties?category=off-plan",
              },
              {
                title: "Resale",
                desc: "Ready-to-move premium properties in Dubai's most sought-after communities.",
                image: "/images/property-villa.jpg",
                link: "/properties?category=secondary",
              },
              {
                title: "Rentals",
                desc: "Premium furnished and unfurnished rental options across Dubai.",
                image: "/images/property-marina.jpg",
                link: "/properties?category=rental",
              },
            ].map((cat, i) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <Link
                  to={cat.link}
                  className="group relative block h-80 rounded-xl overflow-hidden shadow-luxury"
                >
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-display text-2xl font-bold text-primary-foreground mb-2">
                      {cat.title}
                    </h3>
                    <p className="text-primary-foreground/70 font-body text-sm leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Omnis */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-gold font-body text-sm tracking-[0.2em] uppercase mb-2">
              Why Choose Us
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              The Omnis Advantage
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Globe,
                title: "Global Reach",
                desc: "Serving investors from across the globe with dedicated multilingual support.",
              },
              {
                icon: Shield,
                title: "Trusted Partner",
                desc: "Licensed and regulated by Dubai's Real Estate Regulatory Agency (RERA).",
              },
              {
                icon: TrendingUp,
                title: "Market Insights",
                desc: "In-depth market analysis and investment guidance for maximum ROI.",
              },
              {
                icon: Building2,
                title: "Premium Portfolio",
                desc: "Exclusive access to Dubai's most prestigious developments and communities.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-emerald mb-5 group-hover:shadow-gold transition-shadow duration-300">
                  <item.icon className="w-7 h-7 text-gold" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/about-dubai.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
              Ready to Invest in Dubai?
            </h2>
            <p className="text-primary-foreground/70 font-body text-lg max-w-2xl mx-auto mb-8">
              Let our team of experts guide you through Dubai's dynamic real
              estate market. Schedule a free consultation today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/contact">Get In Touch</Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <a
                  href="https://wa.me/971000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp Us
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
