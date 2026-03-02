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
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState<PropertyType | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Enquiry Form State
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;

    setSubmitting(true);
    try {
      await api.post("/api/public/inquiry", {
        data: {
          ...form,
          propertyId: property.id,
          propertyTitle: property.title,
        },
      });
      toast.success(
        "Enquiry securely transmitted. Our brokers will contact you shortly.",
      );
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      toast.error("Failed to submit enquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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
            region: p.region,
            areaLocation: p.areaLocation,
            city: p.city,
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
            technicalPdf: p.technicalPdf,
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
              className="w-full h-full object-cover opacity-80 cursor-zoom-in"
              onClick={() =>
                setPreviewImage(
                  property.images?.[activeImage] || property.image,
                )
              }
            />
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 pointer-events-none" />

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
                className="bg-background/80 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/10"
              >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                  <div>
                    <h1 className="font-display text-4xl md:text-5xl font-black text-foreground tracking-tighter mb-4">
                      {property.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-2 text-muted-foreground font-body">
                      <div className="p-2 rounded-lg bg-gold/10 shrink-0">
                        <MapPin className="w-4 h-4 text-gold" />
                      </div>
                      <span className="text-sm font-medium tracking-wide">
                        {[
                          property.location,
                          property.areaLocation,
                          property.region,
                          property.city,
                        ]
                          .filter(Boolean)
                          .join(" • ")}
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
                {/* Location Map */}
                <div className="mt-12 pt-12 border-t border-border">
                  <h2 className="font-display text-2xl font-black text-foreground mb-8 uppercase tracking-tighter flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-gold" /> Location Map
                  </h2>
                  <div className="w-full bg-muted/20 rounded-xl overflow-hidden border border-border h-[400px]">
                    <iframe
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(
                        [
                          property.location,
                          property.areaLocation,
                          property.region,
                          property.city,
                        ]
                          .filter(Boolean)
                          .join(", "),
                      )}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full h-full"
                    ></iframe>
                  </div>
                </div>

                {/* All Images Grid */}
                {property.images && property.images.length > 0 && (
                  <div className="mt-12 pt-12 border-t border-border">
                    <h2 className="font-display text-2xl font-black text-foreground mb-8 uppercase tracking-tighter">
                      Visual Showcase
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {property.images.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-[4/3] group cursor-pointer overflow-hidden rounded-xl border border-border"
                          onClick={() => {
                            setActiveImage(idx);
                            setPreviewImage(img);
                          }}
                        >
                          <img
                            src={img}
                            alt={`${property.title} - Space ${idx + 1}`}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Maximize className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Blueprints Grid Section (Floor Plans) */}
              {property.floorPlans && property.floorPlans.length > 0 && (
                <div className="bg-background/80 backdrop-blur-2xl rounded-3xl shadow-xl p-8 md:p-12 border border-white/10 mt-8">
                  <h2 className="font-display text-2xl font-black text-foreground mb-8 flex items-center gap-3 uppercase tracking-tighter">
                    <div className="w-8 h-1 bg-gold rounded-full" />
                    Architectural Floor Plans (Blueprints)
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {property.floorPlans.map((plan, idx) => (
                      <div
                        key={idx}
                        className="relative group cursor-zoom-in overflow-hidden rounded-xl border border-border bg-muted/30 aspect-video flex items-center justify-center"
                        onClick={() => setPreviewImage(plan)}
                      >
                        <img
                          src={plan}
                          alt={`Floor Plan ${idx + 1}`}
                          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                          <Maximize className="w-8 h-8 mb-2" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-center px-4 leading-normal">
                            Expand Blueprint {idx + 1}
                          </span>
                        </div>
                        <div className="absolute top-4 right-4 bg-primary/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                          <span className="text-[10px] font-black text-white uppercase tracking-widest group-hover:text-gold transition-colors">
                            Plan {idx + 1}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {property.technicalPdf && (
                    <div className="mt-8 pt-8 border-t border-border/50 text-center">
                      <p className="text-muted-foreground text-xs italic mb-4">
                        Official architectural documentation and high-resolution
                        technical specifications are available for download.
                      </p>
                      <Button
                        variant="gold"
                        className="rounded-full px-12 py-6 font-bold uppercase tracking-widest text-[10px]"
                        asChild
                      >
                        <a
                          href={
                            property.technicalPdf.startsWith("http")
                              ? property.technicalPdf
                              : `http://localhost:5000/${property.technicalPdf}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          download
                        >
                          Download Technical PDF
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              )}
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
                    <form
                      onSubmit={handleEnquiry}
                      className="flex flex-col gap-3"
                    >
                      <input
                        required
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm font-body outline-none focus:border-gold transition-colors"
                        placeholder="Full Name *"
                      />
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm font-body outline-none focus:border-gold transition-colors"
                        placeholder="Email Address *"
                      />
                      <input
                        required
                        type="tel"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm font-body outline-none focus:border-gold transition-colors"
                        placeholder="Phone (with country code) *"
                      />
                      <textarea
                        required
                        rows={3}
                        value={form.message}
                        onChange={(e) =>
                          setForm({ ...form, message: e.target.value })
                        }
                        className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm font-body outline-none focus:border-gold transition-colors resize-none mb-1"
                        placeholder="I am interested in this property..."
                      />
                      <Button
                        variant="gold"
                        size="xl"
                        type="submit"
                        disabled={submitting}
                        className="w-full rounded-2xl py-6 shadow-xl shadow-gold/20 font-bold uppercase tracking-wider text-xs"
                      >
                        {submitting
                          ? "Sending..."
                          : "Request Details & Availability"}
                      </Button>
                    </form>

                    <div className="pt-4 flex justify-center gap-6 border-t border-border mt-2">
                      <a
                        href={`https://wa.me/971000000000?text=${encodeURIComponent(`Hi, I'm interested in the property: ${property.title}`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-muted-foreground hover:text-emerald transition-colors flex items-center gap-2 font-black uppercase text-[10px] tracking-widest"
                      >
                        <MessageCircle className="w-5 h-5" /> Chat via WhatsApp
                      </a>
                    </div>
                  </div>
                </div>

                {property.videoUrl && (
                  <div className="bg-primary text-white rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl shadow-primary/30 group">
                    <div className="relative">
                      <PlayCircle className="w-12 h-12 text-gold mb-4 group-hover:scale-110 transition-transform" />
                      <div className="absolute inset-0 bg-gold/20 rounded-full blur-xl scale-150 animate-pulse" />
                    </div>
                    <h3 className="font-display font-black text-lg uppercase mb-2">
                      Cinematic Video Tour
                    </h3>
                    <p className="text-white/60 text-xs mb-6 px-4">
                      Experience the spatial atmosphere through our professional
                      4K virtual walkthrough.
                    </p>
                    <Button
                      variant="gold"
                      className="rounded-full px-10 py-6"
                      asChild
                    >
                      <a
                        href={property.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Enter Virtual Experience
                      </a>
                    </Button>
                  </div>
                )}

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

        {/* Global Image Preview Lightbox */}
        <AnimatePresence>
          {previewImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-10"
              onClick={() => setPreviewImage(null)}
            >
              <motion.button
                className="absolute top-6 right-6 p-4 text-white/50 hover:text-white transition-colors z-[110]"
                whileHover={{ rotate: 90 }}
                onClick={() => setPreviewImage(null)}
              >
                <X className="w-8 h-8" />
              </motion.button>

              <motion.div
                className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center p-4"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={previewImage}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                />

                {/* Overlay labels if it's a floor plan */}
                {property.floorPlans?.includes(previewImage) && (
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-gold/90 backdrop-blur-md px-6 py-2 rounded-full">
                    <span className="text-[10px] font-black text-accent-foreground uppercase tracking-[0.2em]">
                      Technical Blueprint View
                    </span>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="h-20" />
      </div>
    </Layout>
  );
};

export default PropertyDetails;
