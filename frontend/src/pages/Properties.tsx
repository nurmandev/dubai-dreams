import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import PropertyCard from "@/components/PropertyCard";
import { api } from "@/lib/api";
import {
  type Property as PropertyType,
  AMENITIES_LIST,
} from "@/data/properties";
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
  const [handoverYear, setHandoverYear] = useState(
    searchParams.get("handoverYear") || "all",
  );
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setCategory(searchParams.get("category") || "all");
    setSearch(searchParams.get("search") || "");
    setPropertyType(searchParams.get("type") || "all");
    setBedrooms(searchParams.get("beds") || "all");
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
    setHandoverYear(searchParams.get("handoverYear") || "all");
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
            // New Off-plan fields
            unitTypes: p.unitTypes,
            handoverYear: p.handoverYear,
            totalFloors: p.totalFloors,
            paymentPlan: p.paymentPlan,
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
        category === "off-plan" &&
        handoverYear !== "all" &&
        p.handoverYear !== handoverYear
      )
        return false;
      if (
        search &&
        !p.title.toLowerCase().includes(search.toLowerCase()) &&
        !p.location.toLowerCase().includes(search.toLowerCase()) &&
        !p.amenities?.some(
          (a) =>
            AMENITIES_LIST.includes(a) &&
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
    handoverYear,
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
    setHandoverYear("all");
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
        </div>
      </section>

      {/* Filters Modal Popup */}
      {showFilters && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowFilters(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-6 border-b border-stone-100 bg-stone-50/50">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#0D3430]">
                  Filter Properties
                </h2>
                <p className="text-stone-500 text-sm mt-1">
                  Refine your search parameters
                </p>
              </div>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-white rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-8 flex-1">
              {/* Main Categories Section inside popup */}
              <div className="space-y-4">
                <label className="text-sm font-bold tracking-widest uppercase text-stone-400">
                  Main Category
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setCategory(cat.value)}
                      className={`font-body text-sm px-4 py-3 rounded-xl border transition-all ${
                        category === cat.value
                          ? "bg-[#0D3430] border-[#0D3430] text-white shadow-md"
                          : "bg-white border-stone-200 text-stone-600 hover:border-gold hover:text-[#0D3430]"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sub Categories based on Main Category */}
              <div className="space-y-4">
                <label className="text-sm font-bold tracking-widest uppercase text-stone-400">
                  {category === "off-plan"
                    ? "Off-Plan Sub Category (Type)"
                    : "Property Type"}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { v: "all", l: "All Types" },
                    { v: "apartment", l: "Apartment" },
                    { v: "villa", l: "Villa" },
                    { v: "townhouse", l: "Townhouse" },
                    { v: "penthouse", l: "Penthouse" },
                  ].map((type) => (
                    <button
                      key={type.v}
                      onClick={() => setPropertyType(type.v)}
                      className={`font-body text-sm px-4 py-2.5 rounded-lg border transition-all ${
                        propertyType === type.v
                          ? "bg-gold/10 border-gold text-[#0D3430] font-bold"
                          : "bg-stone-50 border-transparent text-stone-600 hover:bg-stone-100"
                      }`}
                    >
                      {type.l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exclusive Off-Plan Filters */}
              {category === "off-plan" && (
                <div className="space-y-4 bg-stone-50 p-5 rounded-xl border border-stone-100">
                  <label className="text-sm font-bold tracking-widest uppercase text-gold">
                    Off-Plan Specifics
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-stone-500">
                        Handover Year
                      </span>
                      <select
                        value={handoverYear}
                        onChange={(e) => setHandoverYear(e.target.value)}
                        className="w-full bg-white text-stone-800 font-body text-sm rounded-lg px-4 py-3 outline-none border border-stone-200 focus:border-gold transition-colors"
                      >
                        <option value="all">Any Year</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                        <option value="2028">2028+</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Bedrooms */}
                <div className="space-y-4">
                  <label className="text-sm font-bold tracking-widest uppercase text-stone-400">
                    Bedrooms
                  </label>
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full bg-stone-50 text-stone-800 font-body text-sm rounded-xl px-4 py-3 outline-none border border-stone-200 focus:border-gold transition-colors"
                  >
                    <option value="all">Any Bedrooms</option>
                    <option value="1">1 Bedroom</option>
                    <option value="2">2 Bedrooms</option>
                    <option value="3">3 Bedrooms</option>
                    <option value="4">4+ Bedrooms</option>
                  </select>
                </div>

                {/* Price */}
                <div className="space-y-4">
                  <label className="text-sm font-bold tracking-widest uppercase text-stone-400">
                    Price Range (AED)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full bg-stone-50 text-stone-800 font-body text-sm rounded-xl px-4 py-3 outline-none border border-stone-200 focus:border-gold transition-colors placeholder:text-stone-400"
                    />
                    <span className="text-stone-400">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full bg-stone-50 text-stone-800 font-body text-sm rounded-xl px-4 py-3 outline-none border border-stone-200 focus:border-gold transition-colors placeholder:text-stone-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between">
              <button
                onClick={resetFilters}
                className="text-stone-500 font-medium text-sm hover:text-stone-900 transition-colors"
              >
                Clear all filters
              </button>
              <Button
                className="bg-[#0D3430] hover:bg-[#06201e] text-white px-8 h-12 rounded-xl rounded-bl-xl font-bold tracking-widest text-xs uppercase shadow-xl"
                onClick={() => setShowFilters(false)}
              >
                Apply Filters
              </Button>
            </div>
          </motion.div>
        </div>
      )}

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
