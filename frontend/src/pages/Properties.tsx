import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import PropertyCard from "@/components/PropertyCard";
import { api } from "@/lib/api";
import { type Property as PropertyType } from "@/data/properties";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Properties = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("search") || "";
  const initialType = searchParams.get("type") || "all";

  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [propertyType, setPropertyType] = useState(initialType);
  const [bedrooms, setBedrooms] = useState(searchParams.get("beds") || "all");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setCategory(searchParams.get("category") || "all");
    setSearch(searchParams.get("search") || "");
    setPropertyType(searchParams.get("type") || "all");
    setBedrooms(searchParams.get("beds") || "all");
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
  }, [searchParams]);

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
          }));
          setProperties(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch properties:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const filtered = useMemo(() => {
    return properties.filter((p: PropertyType) => {
      if (category !== "all" && p.category !== category) return false;
      if (propertyType !== "all" && p.type !== propertyType) return false;
      if (
        bedrooms !== "all" &&
        bedrooms !== "4" &&
        p.bedrooms !== Number(bedrooms)
      )
        return false;
      if (bedrooms === "4" && p.bedrooms < 4) return false;
      if (minPrice && p.price < Number(minPrice)) return false;
      if (maxPrice && p.price > Number(maxPrice)) return false;
      if (
        search &&
        !p.title.toLowerCase().includes(search.toLowerCase()) &&
        !p.location.toLowerCase().includes(search.toLowerCase()) &&
        !p.amenities?.some((a) =>
          a.toLowerCase().includes(search.toLowerCase()),
        )
      )
        return false;
      return true;
    });
  }, [
    properties,
    search,
    category,
    propertyType,
    bedrooms,
    minPrice,
    maxPrice,
  ]);

  const categories = [
    { value: "all", label: "All" },
    { value: "off-plan", label: "Off-Plan" },
    { value: "secondary", label: "Resale" },
    { value: "rental", label: "Rental" },
  ];

  const resetFilters = () => {
    setSearch("");
    setCategory("all");
    setPropertyType("all");
    setBedrooms("all");
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <Layout>
      {/* Header */}
      <section className="pt-20 bg-primary">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-gold font-body text-sm tracking-[0.3em] uppercase mb-2">
              Our Portfolio
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">
              Properties
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border bg-background sticky top-20 z-40">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Search */}
            <div className="flex-1 flex items-center gap-2 bg-muted rounded-lg px-4 py-3 w-full lg:max-w-md">
              <Search className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Search by name or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-foreground placeholder:text-muted-foreground font-body text-sm w-full outline-none"
              />
            </div>

            {/* Category tabs */}
            <div className="flex gap-1 bg-muted rounded-lg p-1">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`font-body text-sm px-4 py-2 rounded-md transition-all ${
                    category === cat.value
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Toggle filters */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:ml-auto"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-border"
            >
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="bg-muted text-foreground font-body text-sm rounded-lg px-4 py-2 outline-none border border-border"
              >
                <option value="all">All Types</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="townhouse">Townhouse</option>
                <option value="penthouse">Penthouse</option>
              </select>

              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="bg-muted text-foreground font-body text-sm rounded-lg px-4 py-2 outline-none border border-border"
              >
                <option value="all">Any Bedrooms</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3 Bedrooms</option>
                <option value="4">4+ Bedrooms</option>
              </select>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min AED"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="bg-muted text-foreground font-body text-sm rounded-lg px-4 py-2 outline-none border border-border w-32"
                />
                <input
                  type="number"
                  placeholder="Max AED"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="bg-muted text-foreground font-body text-sm rounded-lg px-4 py-2 outline-none border border-border w-32"
                />
              </div>

              <Button variant="ghost" size="sm" onClick={resetFilters}>
                <X className="w-4 h-4" /> Clear All
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <p className="text-muted-foreground font-body text-sm mb-8">
            {loading
              ? "Discovering luxury assets..."
              : `Showing ${filtered.length} properties`}
          </p>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="h-[400px] w-full bg-muted/20 animate-pulse rounded-lg"
                />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((property, i) => (
                <PropertyCard key={property.id} property={property} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="font-display text-2xl text-foreground mb-2">
                No properties found
              </p>
              <p className="text-muted-foreground font-body">
                Try adjusting your search or filters.
              </p>
              <Button variant="gold" className="mt-6" onClick={resetFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Properties;
