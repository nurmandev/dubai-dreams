import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { api } from "@/lib/api";
import { type Property as PropertyType, formatPrice } from "@/data/properties";
import { Button } from "@/components/ui/button";
import {
  Bed,
  Bath,
  Maximize,
  MapPin,
  Building2,
  ArrowLeft,
  Phone,
  MessageCircle,
  Calendar,
  Home,
  Car,
  Utensils,
  Layers,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  PlayCircle,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState<PropertyType | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data } = await api.get(`/api/public/properties/${id}`);
        if (data && data.property) {
          const p = data.property;
          const mapped: PropertyType = {
            id: p.id,
            title: p.title,
            description: p.description,
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
            images: p.carousel_thumb?.map((img: any) => img.img) || [],
            developer: p.owner?.name,
            amenities: p.amenities || [],
            yearBuilt: p.yearBuilt,
            kitchens: p.kitchens,
            garages: p.garages,
            garageSize: p.garageSize,
            floorsNo: p.floorsNo,
            videoUrl: p.videoUrl,
            floorPlans: p.floorPlans || [],
          };
          setProperty(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch property details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProperty();
  }, [id]);

  const nextImage = () => {
    if (property?.images) {
      setActiveImage((prev) => (prev + 1) % property.images!.length);
    }
  };

  const prevImage = () => {
    if (property?.images) {
      setActiveImage(
        (prev) =>
          (prev - 1 + property.images!.length) % property.images!.length,
      );
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="pt-32 pb-20 text-center container mx-auto px-4">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-48 bg-muted/20 rounded mb-4" />
            <div className="h-4 w-64 bg-muted/10 rounded" />
            <div className="mt-12 h-[400px] w-full max-w-4xl bg-muted/5 rounded-2xl" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!property) {
    return (
      <Layout>
        <div className="pt-32 pb-20 text-center container mx-auto px-4">
          <h1 className="font-display text-3xl text-foreground mb-4">
            Property Not Found
          </h1>
          <Button variant="gold" asChild>
            <Link to="/properties">Back to Properties</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const categoryLabel = {
    "off-plan": "Off-Plan",
    secondary: "Resale",
    rental: "Rental",
  };

  return (
    <Layout>
      <div className="pt-20">
        {/* Gallery Hero */}
        <div className="relative h-[60vh] md:h-[75vh] w-full bg-black overflow-hidden group">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              src={property.images?.[activeImage] || property.image}
              alt={property.title}
              className="w-full h-full object-cover opacity-80"
            />
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

          {/* Gallery Controls */}
          {property.images && property.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-gold transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-gold transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
                {property.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`h-1 rounded-full transition-all ${idx === activeImage ? "w-8 bg-gold" : "w-2 bg-white/40"}`}
                  />
                ))}
              </div>
            </>
          )}

          <div className="absolute top-10 left-6 flex items-center gap-4">
            <Button
              variant="hero-outline"
              size="sm"
              asChild
              className="backdrop-blur-md bg-white/5 border-white/20"
            >
              <Link to="/properties">
                <ArrowLeft className="w-4 h-4 mr-2" /> All Properties
              </Link>
            </Button>
            <Badge className="bg-gold text-accent-foreground font-display py-1.5 px-4 rounded-full tracking-widest text-[10px] uppercase font-black">
              {categoryLabel[property.category]}
            </Badge>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 lg:px-8 -mt-24 relative z-20 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-background/80 backdrop-blur-2xl rounded-[2rem] shadow-2xl p-8 md:p-12 border border-white/10"
              >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                  <div>
                    <h1 className="font-display text-4xl md:text-5xl font-black text-foreground tracking-tighter mb-4">
                      {property.title}
                    </h1>
                    <div className="flex items-center gap-2 text-muted-foreground font-body">
                      <div className="p-2 rounded-lg bg-gold/10">
                        <MapPin className="w-4 h-4 text-gold" />
                      </div>
                      <span className="text-sm font-medium tracking-wide">
                        {property.location}
                      </span>
                    </div>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-[10px] font-black text-gold uppercase tracking-[0.3em] mb-2">
                      Asking Price
                    </p>
                    <p className="font-display text-4xl md:text-5xl font-black text-foreground">
                      {formatPrice(property.price, property.category)}
                    </p>
                  </div>
                </div>

                {/* Core Specs Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 bg-muted/30 rounded-3xl border border-border/50">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center mb-3 shadow-inner">
                      <Bed className="w-5 h-5 text-gold" />
                    </div>
                    <p className="font-display text-xl font-black text-foreground">
                      {property.bedrooms}
                    </p>
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                      Bedrooms
                    </p>
                  </div>
                  <div className="flex flex-col items-center border-l border-border/50">
                    <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center mb-3 shadow-inner">
                      <Bath className="w-5 h-5 text-gold" />
                    </div>
                    <p className="font-display text-xl font-black text-foreground">
                      {property.bathrooms}
                    </p>
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                      Bathrooms
                    </p>
                  </div>
                  <div className="flex flex-col items-center border-l border-border/50">
                    <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center mb-3 shadow-inner">
                      <Maximize className="w-5 h-5 text-gold" />
                    </div>
                    <p className="font-display text-xl font-black text-foreground">
                      {property.area.toLocaleString()}
                    </p>
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                      Sq. Ft.
                    </p>
                  </div>
                  <div className="flex flex-col items-center border-l border-border/50">
                    <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center mb-3 shadow-inner">
                      <Home className="w-5 h-5 text-gold" />
                    </div>
                    <p className="font-display text-base font-black text-foreground capitalize">
                      {property.type}
                    </p>
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                      Type
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-12">
                  <h2 className="font-display text-2xl font-black text-foreground mb-6 flex items-center gap-3 uppercase tracking-tighter">
                    <div className="w-8 h-1 bg-gold rounded-full" />
                    Property Narrative
                  </h2>
                  <div className="prose prose-stone max-w-none">
                    <p className="text-muted-foreground font-body leading-[1.8] text-base whitespace-pre-line">
                      {property.description ||
                        `Experience high-end urban living in this pristine ${property.type}. Located in the heart of ${property.location}, this residence combines architectural excellence with panoramic views.`}
                    </p>
                  </div>
                </div>

                {/* Technical Specs */}
                <div className="mt-12 pt-12 border-t border-border">
                  <h2 className="font-display text-2xl font-black text-foreground mb-8 uppercase tracking-tighter">
                    Technical Profile
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                    {property.yearBuilt && (
                      <div className="flex items-center gap-4">
                        <Calendar className="w-5 h-5 text-gold/50" />
                        <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                            Built Year
                          </p>
                          <p className="text-sm font-bold">
                            {property.yearBuilt}
                          </p>
                        </div>
                      </div>
                    )}
                    {property.kitchens && (
                      <div className="flex items-center gap-4">
                        <Utensils className="w-5 h-5 text-gold/50" />
                        <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                            Kitchens
                          </p>
                          <p className="text-sm font-bold">
                            {property.kitchens}
                          </p>
                        </div>
                      </div>
                    )}
                    {property.garages && (
                      <div className="flex items-center gap-4">
                        <Car className="w-5 h-5 text-gold/50" />
                        <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                            Parking
                          </p>
                          <p className="text-sm font-bold">
                            {property.garages}{" "}
                            {property.garageSize
                              ? `(${property.garageSize} sqft)`
                              : "Spaces"}
                          </p>
                        </div>
                      </div>
                    )}
                    {property.floorsNo && (
                      <div className="flex items-center gap-4">
                        <Layers className="w-5 h-5 text-gold/50" />
                        <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                            Total Floors
                          </p>
                          <p className="text-sm font-bold">
                            {property.floorsNo}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Amenities */}
                {property.amenities && property.amenities.length > 0 && (
                  <div className="mt-12 pt-12 border-t border-border">
                    <h2 className="font-display text-2xl font-black text-foreground mb-8 uppercase tracking-tighter">
                      Lifestyle Amenities
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {property.amenities.map((amenity, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-border/30"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald shrink-0" />
                          <span className="text-xs font-bold text-foreground/80 tracking-tight">
                            {amenity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Assets Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Floor Plans */}
                {property.floorPlans && property.floorPlans.length > 0 && (
                  <div className="bg-background rounded-3xl p-8 border border-border flex flex-col items-center text-center">
                    <FileText className="w-10 h-10 text-gold mb-4" />
                    <h3 className="font-display font-black text-lg uppercase mb-2">
                      Floor Plans Available
                    </h3>
                    <p className="text-muted-foreground text-xs mb-6">
                      Review the architectural layout and spatial flow.
                    </p>
                    <Button
                      variant="outline"
                      className="rounded-full px-8"
                      asChild
                    >
                      <a
                        href={property.floorPlans[0]}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View Schematics
                      </a>
                    </Button>
                  </div>
                )}
                {/* Video Tour */}
                {property.videoUrl && (
                  <div className="bg-primary text-white rounded-3xl p-8 flex flex-col items-center text-center">
                    <PlayCircle className="w-10 h-10 text-gold mb-4" />
                    <h3 className="font-display font-black text-lg uppercase mb-2">
                      Video Walkthrough
                    </h3>
                    <p className="text-white/60 text-xs mb-6">
                      Experience the property through a cinematic virtual tour.
                    </p>
                    <Button
                      variant="gold"
                      className="rounded-full px-8"
                      asChild
                    >
                      <a
                        href={property.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Launch Tour
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Sticky Interaction Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 space-y-6">
                <div className="bg-background rounded-3xl p-8 border border-border shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -mr-16 -mt-16 blur-3xl" />

                  <h3 className="font-display font-black text-xs uppercase tracking-[0.3em] text-gold mb-6">
                    Expert Consultation
                  </h3>

                  {property.developer && (
                    <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border">
                      <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center font-display font-black text-white text-xl">
                        {property.developer.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                          Portfolio Manager
                        </p>
                        <p className="font-bold text-foreground">
                          {property.developer}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <Button
                      variant="gold"
                      size="xl"
                      className="w-full rounded-2xl py-8 shadow-xl shadow-gold/20"
                      asChild
                    >
                      <Link to="/contact">
                        <MessageCircle className="w-5 h-5 mr-3" /> Get Official
                        Brochure
                      </Link>
                    </Button>
                    <Button
                      variant="hero-outline"
                      size="xl"
                      className="w-full rounded-2xl py-8 border-2"
                      asChild
                    >
                      <Link to="/contact">
                        <Phone className="w-5 h-5 mr-3" /> Schedule Private
                        Viewing
                      </Link>
                    </Button>

                    <div className="pt-6 flex justify-center gap-6">
                      <a
                        href="https://wa.me/971000000000"
                        target="_blank"
                        rel="noreferrer"
                        className="text-muted-foreground hover:text-emerald transition-colors"
                      >
                        <MessageCircle className="w-6 h-6" />
                      </a>
                      <div className="w-px h-6 bg-border" />
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest py-1">
                        Share Asset
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 rounded-3xl p-8 border border-gold/10">
                  <Building2 className="w-8 h-8 text-gold mb-4" />
                  <h4 className="font-display font-black text-sm uppercase mb-2">
                    Investment Security
                  </h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    All transfers in the Dubai Dreams showcase are handled via
                    RERA regulated Escrow accounts ensuring 100% investor
                    protection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PropertyDetails;
