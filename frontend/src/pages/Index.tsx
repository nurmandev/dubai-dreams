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
  Users,
  CheckCircle,
  Zap,
  Award,
  Quote,
  Bed,
  DollarSign,
} from "lucide-react";
import { motion } from "framer-motion";
import PropertyCard from "@/components/PropertyCard";
import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Property as PropertyType } from "@/data/properties";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchType, setSearchType] = useState("buy");
  const [locationValue, setLocationValue] = useState("");
  const [propType, setPropType] = useState("all");
  const [beds, setBeds] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [homeStats, setHomeStats] = useState<any[]>([]);
  const [homeHotspots, setHomeHotspots] = useState<any[]>([]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (locationValue) params.set("search", locationValue);
    if (propType !== "all") params.set("type", propType);
    if (beds !== "all") params.set("beds", beds);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);

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

    const fetchStats = async () => {
      try {
        const { data } = await api.get("/api/public/stats");
        setHomeStats(data.stats || []);
        setHomeHotspots(data.hotspots || []);
      } catch (err) {
        console.error("Failed to fetch home stats", err);
      }
    };
    fetchStats();
  }, []);

  const featuredProperties = properties.slice(0, 6); // Just show the first 6 for featured

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[100svh] flex items-center py-20 lg:py-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="/images/hero-dubai.jpg"
        >
          <source src="/video/hero-intro-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-hero" />

        <div className="relative z-10 container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl pt-24 lg:pt-32"
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
              <div className="flex flex-wrap gap-1 mb-3 px-1 sm:px-2">
                {["buy", "rent", "off-plan"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setSearchType(t)}
                    className={`font-body text-[10px] sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all ${
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
                {/* Location */}
                <div className="flex items-center gap-2 bg-primary-foreground/10 rounded-lg px-4 py-3 min-w-0 lg:col-span-2">
                  <MapPin className="w-4 h-4 text-gold shrink-0" />
                  <input
                    type="text"
                    value={locationValue}
                    onChange={(e) => setLocationValue(e.target.value)}
                    placeholder="Search by location..."
                    className="bg-transparent text-primary-foreground placeholder:text-primary-foreground/40 font-body text-sm w-full outline-none"
                  />
                </div>

                {/* Property Type */}
                <div className="flex items-center gap-2 bg-primary-foreground/10 rounded-lg px-4 py-3 min-w-0">
                  <Building2 className="w-4 h-4 text-gold shrink-0" />
                  <select
                    value={propType}
                    onChange={(e) => setPropType(e.target.value)}
                    className="bg-transparent text-primary-foreground font-body text-sm outline-none cursor-pointer appearance-none pr-6 w-full"
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

                {/* Bedrooms */}
                <div className="flex items-center gap-2 bg-primary-foreground/10 rounded-lg px-4 py-3 min-w-0">
                  <Bed className="w-4 h-4 text-gold shrink-0" />
                  <select
                    value={beds}
                    onChange={(e) => setBeds(e.target.value)}
                    className="bg-transparent text-primary-foreground font-body text-sm outline-none cursor-pointer appearance-none pr-6 w-full"
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.4)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right center",
                      backgroundSize: "1rem",
                    }}
                  >
                    <option value="all" className="bg-primary text-white">
                      Beds (All)
                    </option>
                    <option value="0" className="bg-primary text-white">
                      Studio
                    </option>
                    <option value="1" className="bg-primary text-white">
                      1 Bed
                    </option>
                    <option value="2" className="bg-primary text-white">
                      2 Beds
                    </option>
                    <option value="3" className="bg-primary text-white">
                      3 Beds
                    </option>
                    <option value="4" className="bg-primary text-white">
                      4+ Beds
                    </option>
                  </select>
                </div>

                {/* Search Button */}
                <Button
                  variant="gold"
                  size="lg"
                  className="w-full h-full min-h-[50px] font-bold"
                  onClick={handleSearch}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>

              {/* Advanced Search Toggle */}
              <div className="mt-3 flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-xs font-body uppercase tracking-widest text-primary-foreground/70 hover:text-gold transition-colors font-bold"
                >
                  Advanced Search
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Expanded Filters */}
                {showAdvanced && (
                  <div className="flex flex-wrap items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <span className="text-primary-foreground/40 text-xs font-body uppercase tracking-wider">
                      Price Range (AED):
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-24 bg-primary-foreground/5 border border-primary-foreground/10 rounded-md px-3 py-1.5 text-xs text-primary-foreground outline-none focus:ring-1 ring-gold/50 transition-all"
                      />
                      <span className="text-primary-foreground/20">—</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-24 bg-primary-foreground/5 border border-primary-foreground/10 rounded-md px-3 py-1.5 text-xs text-primary-foreground outline-none focus:ring-1 ring-gold/50 transition-all"
                      />
                    </div>
                  </div>
                )}
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
                  className="h-[400px] w-full bg-muted/20 animate-pulse rounded-xl"
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

      {/* Stats Counter */}
      <section className="py-16 bg-primary border-y border-white/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {homeStats.length > 0
              ? homeStats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="text-center"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold/10 mb-4">
                      <Zap className="w-5 h-5 text-gold" />
                    </div>
                    <div className="text-3xl md:text-4xl font-display font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-gold/60 font-body text-xs uppercase tracking-widest">
                      {stat.label}
                    </div>
                  </motion.div>
                ))
              : [
                  { label: "Properties Sold", value: "2.4K+", icon: Building2 },
                  { label: "Active Investors", value: "10K+", icon: Users },
                  { label: "Total Transactions", value: "$4.1B+", icon: Zap },
                  { label: "Years Excellence", value: "15+", icon: Award },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="text-center"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold/10 mb-4">
                      <stat.icon className="w-5 h-5 text-gold" />
                    </div>
                    <div className="text-3xl md:text-4xl font-display font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-gold/60 font-body text-xs uppercase tracking-widest">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
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
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
              What Are You Looking For?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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

      {/* Investment Hotspots */}
      <section className="py-20 lg:py-28 overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <p className="text-gold font-body text-sm tracking-[0.2em] uppercase mb-2">
              Premium Districts
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Investment Hotspots
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {(homeHotspots.length > 0
              ? homeHotspots
              : [
                  {
                    name: "Downtown Dubai",
                    properties: "450+ Properties",
                    img: "/images/hero-dubai.jpg",
                    tag: "High ROI",
                  },
                  {
                    name: "Palm Jumeirah",
                    properties: "120+ Properties",
                    img: "/images/property-villa.jpg",
                    tag: "Exclusive",
                  },
                  {
                    name: "Dubai Marina",
                    properties: "380+ Properties",
                    img: "/images/property-marina.jpg",
                    tag: "High Yield",
                  },
                  {
                    name: "Business Bay",
                    properties: "290+ Properties",
                    img: "/images/property-offplan.jpg",
                    tag: "Commercial",
                  },
                ]
            ).map((area, i) => (
              <motion.div
                key={area.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative h-[400px] rounded-xl overflow-hidden cursor-pointer"
              >
                <img
                  src={area.img}
                  alt={area.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-gold text-accent-foreground text-[10px] font-black uppercase tracking-widest rounded-full">
                    {area.tag}
                  </span>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="font-display text-2xl font-bold text-white mb-1">
                    {area.name}
                  </h3>
                  <p className="text-white/60 font-body text-sm">
                    {area.properties}
                  </p>
                </div>
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

      {/* Newsletter */}
      <section className="py-20 bg-primary overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gold/5 skew-x-12 translate-x-20" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto bg-card/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-16 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gold/20 mb-6">
                <Globe className="w-6 h-6 text-gold" />
              </div>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
                Exclusive Opportunities
              </h2>
              <p className="text-gold/60 font-body text-lg mb-10 max-w-xl mx-auto">
                Join our private list to receive off-market luxury listings and
                market insights before they go public.
              </p>
              <form
                className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
                onSubmit={(e) => {
                  e.preventDefault();
                  toast.success("Welcome to the exclusive circle!");
                }}
              >
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white font-body outline-none focus:ring-1 ring-gold transition-all"
                  required
                />
                <Button variant="gold" size="xl" className="whitespace-nowrap">
                  Join Private List
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-28 bg-card/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-gold font-body text-sm tracking-[0.2em] uppercase mb-4">
                Client Success
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-8 leading-tight">
                What Our Elite <br />
                Clients Say
              </h2>
              <div className="flex gap-4">
                <div className="p-4 bg-primary rounded-xl border border-white/5">
                  <div className="text-2xl font-display font-bold text-white mb-1">
                    98%
                  </div>
                  <div className="text-gold/60 text-[10px] uppercase font-black">
                    Satisfaction
                  </div>
                </div>
                <div className="p-4 bg-primary rounded-xl border border-white/5">
                  <div className="text-2xl font-display font-bold text-white mb-1">
                    5.0
                  </div>
                  <div className="text-gold/60 text-[10px] uppercase font-black">
                    Average Rating
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="space-y-6">
              {[
                {
                  quote:
                    "Omnis Properties transformed our investment strategy in Dubai. Their off-market access is truly unrivaled.",
                  author: "Alexander Hartmann",
                  role: "Portfolio Manager",
                },
                {
                  quote:
                    "Professionalism at its finest. They found us our dream penthouse in Palm Jumeirah within a week.",
                  author: "Sarah Al-Maktoum",
                  role: "Investor",
                },
              ].map((t, i) => (
                <motion.div
                  key={t.author}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="bg-background p-8 rounded-xl border border-border shadow-luxury relative"
                >
                  <Quote className="absolute top-6 right-8 w-10 h-10 text-gold/10" />
                  <p className="text-foreground/80 font-body text-lg italic mb-6 leading-relaxed">
                    "{t.quote}"
                  </p>
                  <div>
                    <div className="font-display font-bold text-foreground">
                      {t.author}
                    </div>
                    <div className="text-gold text-xs font-black uppercase tracking-widest">
                      {t.role}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
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
        <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center sm:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <h2 className="font-display text-2xl md:text-5xl font-bold text-primary-foreground mb-4 max-w-2xl px-4">
              Ready to Invest in Dubai?
            </h2>
            <p className="text-primary-foreground/70 font-body text-sm md:text-lg max-w-2xl mx-auto mb-8 px-4">
              Let our team of experts guide you through Dubai's dynamic real
              estate market. Schedule a free consultation today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto px-4">
              <Button
                variant="hero"
                size="xl"
                asChild
                className="w-full sm:w-auto"
              >
                <Link to="/contact">Get In Touch</Link>
              </Button>
              <Button
                variant="hero-outline"
                size="xl"
                asChild
                className="w-full sm:w-auto"
              >
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
