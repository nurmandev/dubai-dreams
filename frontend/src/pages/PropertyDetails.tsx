import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { api } from "@/lib/api";
import {
  type Property as PropertyType,
  formatPrice,
  AMENITIES_LIST,
} from "@/data/properties";
import { Button } from "@/components/ui/button";
import {
  Bed,
  Bath,
  Maximize,
  MapPin,
  Building2,
  ArrowLeft,
  Phone,
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
import PriceDisplay from "@/components/PriceDisplay";
import DirhamIcon from "@/components/icons/DirhamIcon";
import { countries } from "@/data/countries";
import { CountryCodeSelector } from "@/components/CountryCodeSelector";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

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
    countryCode: "+971",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;

    setSubmitting(true);
    try {
      const submissionData = {
        ...form,
        phone: `${form.countryCode} ${form.phone}`,
        propertyId: property.id,
        propertyTitle: property.title,
      };
      await api.post("/api/public/inquiry", { data: submissionData });
      toast.success(
        "Enquiry securely transmitted. Our brokers will contact you shortly.",
      );
      setForm({
        name: "",
        email: "",
        countryCode: "+971",
        phone: "",
        message: "",
      });
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
            developer: p.developerName || p.owner?.name,
            amenities: p.amenities || [],
            yearBuilt: p.yearBuilt,
            kitchens: p.kitchens,
            garages: p.garages,
            garageSize: p.garageSize,
            floorsNo: p.floorsNo,
            videoUrl: p.videoUrl,
            technicalPdf: p.technicalPdf,
            floorPlans: p.floorPlans || [],
            // Off-plan fields
            unitTypes: p.unitTypes,
            handoverYear: p.handoverYear,
            totalFloors: p.totalFloors,
            paymentPlan: p.paymentPlan,
          };
          console.log("DEBUG property data:", data.property);
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

  const getDownloadUrl = (url: string) => {
    if (!url) return "";
    let downloadUrl = url;
    if (!url.startsWith("http")) {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || window.location.origin;
      downloadUrl = `${baseUrl.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
    }

    // Force download for Cloudinary URLs
    if (downloadUrl.includes("res.cloudinary.com") && downloadUrl.includes("/upload/")) {
      return downloadUrl.replace("/upload/", "/upload/fl_attachment/");
    }

    return downloadUrl;
  };

  const nextImage = useCallback(() => {
    if (property?.images) {
      setActiveImage((prev) => (prev + 1) % property.images!.length);
    }
  }, [property?.images]);

  const prevImage = () => {
    if (property?.images) {
      setActiveImage(
        (prev) =>
          (prev - 1 + property.images!.length) % property.images!.length,
      );
    }
  };

  // Auto-slide effect
  useEffect(() => {
    if (!property?.images || property.images.length <= 1) return;

    const timer = setInterval(() => {
      nextImage();
    }, 5000);

    return () => clearInterval(timer);
  }, [activeImage, property?.images, nextImage]);

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

  const isOffPlan = property.category === "off-plan";

  if (isOffPlan) {
    return (
      <Layout>
        <div className="pt-24 pb-20 bg-[#F9F9F7] font-body">
          <div className="container mx-auto px-4 max-w-7xl">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-[10px] md:text-[11px] font-black tracking-[0.2em] text-stone-500 uppercase mb-6 md:mb-8">
              <Link to="/" className="hover:text-[#0D3430] transition-colors">
                HOME
              </Link>
              <ChevronRight className="w-3 h-3 text-stone-300" />
              <Link
                to="/properties"
                className="hover:text-[#0D3430] transition-colors"
              >
                OFFLINE PROPERTIES
              </Link>
              <ChevronRight className="w-3 h-3 text-stone-300" />
              <span className="text-[#0D3430] truncate max-w-[150px] md:max-w-none">
                {property.title}
              </span>
            </nav>
          </div>

          {/* Wider Hero Section */}
          <div className="max-w-[1440px] mx-auto px-2 md:px-4 mb-20 md:mb-24">
            <div className="relative">
              <div className="relative h-[450px] sm:h-[500px] md:h-[650px] w-full bg-stone-100 overflow-hidden shadow-2xl transition-all rounded-[1rem] md:rounded-[1.25rem]">
                <img
                  src={property.images?.[activeImage] || property.image}
                  alt={property.title}
                  className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                />

                {/* Image display strictly 100% original as requested without overlays */}

                {/* Top Right Badges */}
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 flex items-center gap-2">
                  <div className="bg-yellow-400 text-stone-900 rounded-lg shadow-xl px-4 py-1.5 sm:px-6 sm:py-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      {property.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="bg-[#0D3430] rounded-lg shadow-xl px-4 py-1.5 sm:px-6 sm:py-2">
                    <span className="text-white text-[10px] font-bold uppercase tracking-widest">
                      OFF-PLAN
                    </span>
                  </div>
                </div>

                <div className="absolute top-16 md:top-24 left-4 sm:left-8 md:left-16 right-4 sm:right-8 md:right-16 drop-shadow-sm">
                  <div className="max-w-full overflow-hidden space-y-4 sm:space-y-6">
                    <h1 className="font-display text-[1.5rem] sm:text-[2.25rem] md:text-[3rem] lg:text-[3.5rem] font-bold text-primary tracking-tight leading-tight bg-white/30 backdrop-blur-md w-fit max-w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 rounded-[1.5rem] border border-white/20 shadow-sm whitespace-nowrap overflow-hidden text-ellipsis">
                      {property.title}
                    </h1>

                    <div className="flex items-center gap-2 sm:gap-3 text-stone-800 font-bold bg-white/95 backdrop-blur-md w-full sm:w-max max-w-full px-3 py-2 sm:px-6 sm:py-3 rounded-[1rem] shadow-xl border border-stone-100/50 overflow-hidden">
                      <div className="bg-[#EAD1B6]/30 p-1.5 sm:p-2 rounded-full shrink-0">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-[#DDB57A]" />
                      </div>
                      <span className="font-body text-xs sm:text-sm md:text-base pr-2 truncate">
                        {property.address || property.location}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Specs Bar - Refined according to visual design */}
              <div className="relative mx-auto -mt-16 z-20 md:mt-0 md:absolute md:-bottom-10 md:left-1/2 md:-translate-x-1/2 w-[95%] md:w-[90%] bg-white/95 backdrop-blur-3xl rounded-[1rem] md:rounded-[1.25rem] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] py-6 md:py-8 px-4 sm:px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-y-0 md:divide-x divide-stone-100 transition-all border border-stone-100/50">
                <div className="flex flex-col items-center md:items-start md:pl-4 justify-center">
                  <div className="flex items-center gap-4 mb-1">
                    <Bed
                      className="w-5 h-5 md:w-6 md:h-6 text-[#DDB57A]"
                      strokeWidth={1.5}
                    />
                    <span className="font-display font-medium text-[1.75rem] md:text-[2rem] text-[#0D3430] leading-none tracking-tight">
                      {property.bedrooms}
                    </span>
                  </div>
                  <span className="text-[12px] font-medium text-stone-600 capitalize md:ml-10">
                    Bedrooms
                  </span>
                </div>

                <div className="flex flex-col items-center md:items-start md:pl-12 justify-center">
                  <div className="flex items-center gap-4 mb-1">
                    <Bath
                      className="w-5 h-5 md:w-6 md:h-6 text-[#DDB57A]"
                      strokeWidth={1.5}
                    />
                    <span className="font-display font-medium text-[1.75rem] md:text-[2rem] text-[#0D3430] leading-none tracking-tight">
                      {property.bathrooms}
                    </span>
                  </div>
                  <span className="text-[12px] font-medium text-stone-600 capitalize md:ml-10">
                    Bathrooms
                  </span>
                </div>

                <div className="flex flex-col items-center md:items-start md:pl-12 justify-center">
                  <div className="flex items-center gap-2 sm:gap-4 mb-1">
                    <DirhamIcon className="w-5 h-5 md:w-6 md:h-6 text-[#DDB57A]" />
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] md:text-[11px] font-medium text-stone-600 mb-0.5 leading-none">
                        Starting from
                      </span>
                      <span className="font-display font-medium text-[1.25rem] md:text-[1.5rem] text-[#0D3430] leading-none tracking-tight whitespace-nowrap">
                        {property.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center md:items-start md:pl-12 justify-center">
                  <div className="flex items-center gap-4 mb-1">
                    <Maximize
                      className="w-5 h-5 md:w-6 md:h-6 text-[#DDB57A]"
                      strokeWidth={1.5}
                    />
                    <span className="font-display font-medium text-[1.75rem] md:text-[2rem] text-[#0D3430] leading-none tracking-tight">
                      {property.area}
                    </span>
                  </div>
                  <span className="text-[12px] font-medium text-stone-600 lowercase md:ml-10">
                    sq.ft.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 max-w-7xl">
            {/* Content Section */}
            <div className="mt-12 md:mt-20 space-y-16">
              {/* Project Overview */}
              <div className="space-y-4">
                <h2 className="font-display text-[2.5rem] font-bold text-[#0D3430] tracking-tight">
                  Project Overview
                </h2>
                <p className="text-stone-600 font-body leading-relaxed text-[15px] w-full max-w-none text-justify whitespace-pre-line">
                  {property.description}
                </p>

                {property.videoUrl && (
                  <div className="mt-16 rounded-[1.5rem] overflow-hidden shadow-2xl border-8 border-white aspect-video relative group">
                    <iframe
                      className="w-full h-full"
                      src={property.videoUrl.replace("watch?v=", "embed/")}
                      title="Project Virtual Tour"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                    <div className="absolute top-10 left-10 bg-[#0D3430] text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-2xl backdrop-blur-md">
                      Interactive Cinematic Tour
                    </div>
                  </div>
                )}

                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                  {/* 1. Payment Plan */}
                  <div className="bg-white rounded-[1rem] p-8 shadow-sm border border-stone-100 flex flex-col hover:shadow-lg transition-shadow">
                    <h3 className="font-display text-[1.4rem] font-bold text-[#0D3430] mb-8 leading-none">
                      Payment Plan
                    </h3>
                    <div className="space-y-6 flex-1">
                      <div className="space-y-3 pb-3 border-b border-stone-100 group">
                        <div className="flex justify-between items-center text-stone-800">
                          <span className="text-[13px] font-medium text-stone-600">
                            On Booking
                          </span>
                          <span className="font-display font-black text-xl text-stone-900 group-hover:text-gold transition-colors">
                            {property.paymentPlan?.onBooking}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#0D3430]"
                            style={{
                              width: `${property.paymentPlan?.onBooking}%`,
                            }}
                          />
                        </div>
                      </div>
                      <div className="space-y-3 pb-3 border-b border-stone-100 group">
                        <div className="flex justify-between items-center text-stone-800">
                          <span className="text-[13px] font-medium text-stone-600">
                            During Construction
                          </span>
                          <span className="font-display font-black text-xl text-stone-900 group-hover:text-gold transition-colors">
                            {property.paymentPlan?.duringConstruction ?? 40}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#0D3430]"
                            style={{
                              width: `${property.paymentPlan?.duringConstruction ?? 40}%`,
                            }}
                          />
                        </div>
                      </div>
                      <div className="space-y-3 pb-3 group">
                        <div className="flex justify-between items-center text-stone-800">
                          <span className="text-[13px] font-medium text-stone-600">
                            On Handover
                          </span>
                          <span className="font-display font-black text-xl text-stone-900 group-hover:text-gold transition-colors">
                            {property.paymentPlan?.onHandover ?? 50}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#0D3430]"
                            style={{
                              width: `${property.paymentPlan?.onHandover ?? 50}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. Technical Profile (Redesigned as Project Overview) */}
                  <div className="bg-white rounded-[1.5rem] p-8 shadow-sm border border-stone-100 h-full flex flex-col hover:shadow-lg transition-all duration-500">
                    <div className="mb-8">
                      <h3 className="font-display text-[1.5rem] md:text-[1.75rem] font-bold text-[#0D3430] leading-none mb-3">
                        Project Overview
                      </h3>
                      <div className="w-12 h-[2px] bg-[#0D3430]" />
                    </div>

                    <div className="space-y-8 flex-1">
                      <div className="flex items-center justify-between border-b border-stone-50 pb-6 group">
                        <div className="flex items-center gap-5">
                          <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center group-hover:bg-stone-100 transition-colors">
                            <Building2 className="w-5 h-5 text-[#DDB57A]" />
                          </div>
                          <span className="text-[14px] font-medium text-stone-600">
                            Developer
                          </span>
                        </div>
                        <span className="font-display font-bold text-lg text-stone-900">
                          {property.developer || "TBA"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-b border-stone-50 pb-6 group">
                        <div className="flex items-center gap-5">
                          <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center group-hover:bg-stone-100 transition-colors">
                            <Calendar className="w-5 h-5 text-[#DDB57A]" />
                          </div>
                          <span className="text-[14px] font-medium text-stone-600">
                            Expected Handover
                          </span>
                        </div>
                        <span className="font-display font-bold text-lg text-stone-900">
                          {property.handoverYear || "TBA"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-b border-stone-50 pb-6 group">
                        <div className="flex items-center gap-5">
                          <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center group-hover:bg-stone-100 transition-colors">
                            <Layers className="w-5 h-5 text-[#DDB57A]" />
                          </div>
                          <span className="text-[14px] font-medium text-stone-600">
                            Total Floors
                          </span>
                        </div>
                        <span className="font-display font-bold text-lg text-stone-900">
                          {property.totalFloors || "N/A"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between group">
                        <div className="flex items-center gap-5">
                          <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center group-hover:bg-stone-100 transition-colors">
                            <Home className="w-5 h-5 text-[#DDB57A]" />
                          </div>
                          <span className="text-[14px] font-medium text-stone-600">
                            Development Type
                          </span>
                        </div>
                        <span className="font-display font-bold text-lg text-stone-900">
                          {property.type.charAt(0).toUpperCase() +
                            property.type.slice(1)}
                        </span>
                      </div>
                    </div>

                    <Button
                      asChild
                      className="w-full mt-12 bg-[#0D3430] hover:bg-[#06201e] text-white rounded-[0.5rem] h-14 font-bold uppercase tracking-[0.2em] text-[11px] flex items-center justify-between px-8 transition-all border-none shadow-xl shadow-[#0D3430]/10"
                    >
                      <a href="/contact">
                        <span>ENQUIRE NOW</span>
                        <ChevronRight
                          className="w-[16px] h-[16px]"
                          strokeWidth={3}
                        />
                      </a>
                    </Button>
                  </div>

                  {/* 3. Lifestyle Amenities */}
                  {(() => {
                    const filteredAmenities = (property.amenities || [])
                      .flatMap((a) =>
                        typeof a === "string" ? a.split(",") : [a],
                      )
                      .map((a) => (typeof a === "string" ? a.trim() : a))
                      .filter((a) => AMENITIES_LIST.includes(a));

                    if (filteredAmenities.length === 0) return null;

                    return (
                      <div className="bg-white rounded-[1rem] p-8 shadow-sm border border-stone-100 h-full hover:shadow-lg transition-shadow">
                        <h3 className="font-display text-[1.4rem] font-bold text-[#0D3430] mb-8 leading-none">
                          Lifestyle Amenities
                        </h3>
                        <div className="flex flex-col gap-5">
                          {filteredAmenities.slice(0, 8).map((amenity, idx) => {
                            const original = AMENITIES_LIST.find(
                              (item) =>
                                item.toLowerCase() ===
                                amenity.toLowerCase().replace(/-/g, " "),
                            );
                            return (
                              <div
                                key={idx}
                                className="flex items-center gap-4 group"
                              >
                                <svg
                                  className="w-[14px] h-[14px] text-stone-700 shrink-0"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={3}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                <span className="text-[14px] font-medium text-stone-600 truncate group-hover:text-[#0D3430] transition-colors">
                                  {original || amenity.replace(/-/g, " ")}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Extended Sections */}
              <div className="mt-20 space-y-16">
                {/* Location Map */}
                <div className="bg-white rounded-[1.5rem] p-8 md:p-12 shadow-sm border border-stone-100">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-[3px] bg-gold rounded-full" />
                    <h3 className="font-display text-3xl font-black text-stone-900 tracking-tight">
                      Prime Location
                    </h3>
                  </div>
                  <div className="h-[500px] w-full rounded-[1rem] overflow-hidden border border-stone-100 shadow-inner">
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      scrolling="no"
                      marginHeight={0}
                      marginWidth={0}
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(
                        [
                          property.location,
                          property.areaLocation,
                          property.region,
                          property.city,
                        ]
                          .filter(Boolean)
                          .join(", "),
                      )}&t=&z=14&ie=UTF8&iwloc=B&output=embed`}
                    ></iframe>
                  </div>
                </div>

                {/* Gallery Showcase */}
                {property.images && property.images.length > 0 && (
                  <div className="bg-white rounded-[1.5rem] p-8 md:p-12 shadow-sm border border-stone-100">
                    <div className="flex items-center gap-4 mb-10">
                      <div className="w-12 h-[3px] bg-gold rounded-full" />
                      <h3 className="font-display text-3xl font-black text-stone-900 tracking-tight">
                        Project Visual Anthology
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                      {property.images.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-[4/3] group cursor-pointer overflow-hidden rounded-[1rem] border border-stone-50"
                          onClick={() => {
                            setActiveImage(idx);
                            setPreviewImage(img);
                          }}
                        >
                          <img
                            src={img}
                            alt={`${property.title} - Render ${idx + 1}`}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <span className="text-white text-[10px] font-black uppercase tracking-[0.3em] bg-[#0D3430]/90 backdrop-blur-md px-6 py-3 rounded-full shadow-2xl border border-white/10 scale-90 group-hover:scale-100 transition-transform">
                              Expand View
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Floor Plans */}
                {property.floorPlans && property.floorPlans.length > 0 && (
                  <div className="bg-white rounded-[1.5rem] p-8 md:p-12 shadow-sm border border-stone-100">
                    <div className="flex items-center gap-4 mb-10">
                      <div className="w-12 h-[3px] bg-gold rounded-full" />
                      <h3 className="font-display text-3xl font-black text-stone-900 tracking-tight">
                        Architectural Blueprints
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      {property.floorPlans.map((plan, idx) => (
                        <div
                          key={idx}
                          className="p-10 rounded-[1.25rem] border border-stone-100 bg-stone-50/50 flex flex-col items-center gap-6 group hover:border-gold/30 hover:bg-white transition-all cursor-pointer shadow-sm hover:shadow-xl"
                          onClick={() => setPreviewImage(plan)}
                        >
                          <div className="w-full h-64 overflow-hidden rounded-xl">
                            <img
                              src={plan}
                              alt={`Floor Plan ${idx + 1}`}
                              className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                            />
                          </div>
                          <span className="text-[11px] font-black text-stone-400 group-hover:text-gold uppercase tracking-[0.3em] transition-colors">
                            Floor Plan Layout Index 0{idx + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Official Brochure (PDF) - Off-Plan View */}
                {property.technicalPdf && property.technicalPdf !== "null" && property.technicalPdf.trim() !== "" && (
                  <div className="bg-white rounded-[1.5rem] p-8 md:p-12 shadow-sm border border-stone-100 flex flex-col items-center text-center">
                    <div className="flex items-center gap-4 mb-6 justify-center">
                      <div className="w-12 h-[3px] bg-gold rounded-full" />
                      <h3 className="font-display text-3xl font-black text-stone-900 tracking-tight">
                        Project Brochure
                      </h3>
                      <div className="w-12 h-[3px] bg-gold rounded-full" />
                    </div>
                    <p className="text-stone-500 font-body text-sm mb-8 max-w-lg">
                      Download the official project brochure to view full floor
                      plans, payment details, and technical specifications.
                    </p>
                    <a
                      href={getDownloadUrl(property.technicalPdf)}
                      target="_blank"
                      rel="noreferrer"
                      download
                      className="flex items-center gap-4 bg-[#0D3430] hover:bg-[#06201e] text-white font-bold uppercase tracking-[0.2em] text-[12px] px-12 py-5 rounded-full transition-all shadow-2xl hover:shadow-[0_20px_40px_-15px_rgba(13,52,48,0.4)] group"
                    >
                      <FileText className="w-5 h-5 text-gold group-hover:scale-110 transition-transform" />
                      Download Official Brochure (PDF)
                    </a>
                  </div>
                )}

                {/* Contact Section */}
                {/* <div
                  id="enquire"
                  className="bg-[#0D3430] rounded-[2rem] p-10 md:p-20 text-white shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full -mr-64 -mt-64 blur-[100px] pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold/5 rounded-full -ml-64 -mb-64 blur-[100px] pointer-events-none" />

                  <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div>
                      <h2 className="font-display text-4xl md:text-6xl font-black mb-8 leading-[1.1] tracking-tighter">
                        Experience <br />{" "}
                        <span className="text-gold">Dubai's Future</span>
                      </h2>
                      <p className="text-white/60 font-body text-xl mb-12 max-w-lg leading-relaxed">
                        Register your interest today to receive exclusive
                        whitepapers, private pricing tables, and VIP launch
                        event access.
                      </p>
                      <div className="space-y-6">
                        <div className="flex items-center gap-6 group">
                          <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-[#0D3430] transition-all border border-white/10">
                            <Phone className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-1">
                              Call Expertise
                            </p>
                            <p className="font-display font-black text-xl">
                              +971 4 123 4567
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 group">
                          <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center text-gold group-hover:bg-[#25D366] group-hover:text-white transition-all border border-white/10">
                            <WhatsAppIcon className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-1">
                              Instant Concierge
                            </p>
                            <p className="font-display font-black text-xl">
                              WhatsApp Inquiry
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <form
                      onSubmit={handleEnquiry}
                      className="bg-white rounded-[2.5rem] p-8 md:p-12 space-y-6 shadow-2xl"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest pl-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            required
                            className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 text-stone-900 text-sm focus:border-gold outline-none transition-all shadow-inner"
                            value={form.name}
                            onChange={(e) =>
                              setForm({ ...form, name: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest pl-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            required
                            className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 text-stone-900 text-sm focus:border-gold outline-none transition-all shadow-inner"
                            value={form.email}
                            onChange={(e) =>
                              setForm({ ...form, email: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest pl-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          required
                          className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 text-stone-900 text-sm focus:border-gold outline-none transition-all shadow-inner"
                          value={form.phone}
                          onChange={(e) =>
                            setForm({ ...form, phone: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest pl-1">
                          Personal Message
                        </label>
                        <textarea
                          rows={3}
                          className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 text-stone-900 text-sm focus:border-gold outline-none transition-all resize-none shadow-inner"
                          placeholder="I'm interested in this project..."
                          value={form.message}
                          onChange={(e) =>
                            setForm({ ...form, message: e.target.value })
                          }
                        />
                      </div>
                      <Button
                        disabled={submitting}
                        className="w-full bg-[#0D3430] hover:bg-gold text-white rounded-[1.5rem] h-16 font-black uppercase tracking-[0.3em] shadow-xl shadow-[#0D3430]/10 transition-all active:scale-95"
                      >
                        {submitting
                          ? "Establishing Connection..."
                          : "Secure Priority Access"}
                      </Button>
                    </form>
                  </div>
                </div> */}
              </div>

              {/* Global Image Preview Lightbox */}
              <AnimatePresence>
                {previewImage && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-4 md:p-10"
                    onClick={() => setPreviewImage(null)}
                  >
                    <motion.button
                      className="absolute top-10 right-10 p-5 text-white/30 hover:text-white transition-colors z-[110]"
                      whileHover={{ rotate: 90, scale: 1.2 }}
                      onClick={() => setPreviewImage(null)}
                    >
                      <X className="w-10 h-10" />
                    </motion.button>

                    <motion.div
                      className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center p-4"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{
                        type: "spring",
                        damping: 30,
                        stiffness: 200,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <img
                        src={previewImage}
                        alt="High Definition Preview"
                        className="max-w-full max-h-full object-contain rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/5"
                      />

                      {/* Overlay labels if it's a floor plan */}
                      {property.floorPlans?.includes(previewImage) && (
                        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-gold/90 backdrop-blur-xl px-10 py-4 rounded-full shadow-2xl border border-white/20">
                          <span className="text-xs font-black text-[#0D3430] uppercase tracking-[0.3em]">
                            Architectural Blueprint Overview
                          </span>
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
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
                    <div className="font-display text-4xl md:text-5xl font-black text-foreground">
                      <PriceDisplay
                        price={property.price}
                        category={property.category}
                        iconSize={32}
                        iconClassName="w-8 h-8 md:w-10 md:h-10 inline-block mr-1 mb-1.5 opacity-80"
                      />
                    </div>
                  </div>
                </div>

                {/* Core Specs Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 bg-muted/30 rounded-3xl border border-border/50">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center mb-3 shadow-inner">
                      <Bed className="w-5 h-5 text-gold" />
                    </div>
                    <p className="font-display text-xl font-black text-foreground">
                      {property.category === "off-plan"
                        ? property.unitTypes || "Various"
                        : property.bedrooms === 0
                          ? "Studio"
                          : property.bedrooms}
                    </p>
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                      {property.category === "off-plan"
                        ? "Unit Types"
                        : property.bedrooms === 0
                          ? "Unit Type"
                          : "Bedrooms"}
                    </p>
                  </div>
                  {property.category !== "off-plan" &&
                    Number(property.bathrooms) > 0 && (
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
                    )}
                  {property.category === "off-plan" &&
                    property.handoverYear && (
                      <div className="flex flex-col items-center border-l border-border/50">
                        <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center mb-3 shadow-inner">
                          <Calendar className="w-5 h-5 text-gold" />
                        </div>
                        <p className="font-display text-xl font-black text-foreground">
                          {property.handoverYear}
                        </p>
                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                          Handover
                        </p>
                      </div>
                    )}
                  {Number(property.area) > 0 && (
                    <div className="flex flex-col items-center border-l border-border/50">
                      <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center mb-3 shadow-inner">
                        <Maximize className="w-5 h-5 text-gold" />
                      </div>
                      <p className="font-display text-xl font-black text-foreground">
                        {typeof property.area === "number"
                          ? property.area.toLocaleString()
                          : property.area}
                      </p>
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                        Sq. Ft.
                      </p>
                    </div>
                  )}
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
                  <div className="prose prose-stone max-w-none w-full">
                    <p className="text-muted-foreground font-body leading-[1.8] text-base whitespace-pre-line text-justify w-full max-w-none">
                      {property.description ||
                        `Experience high-end urban living in this pristine ${property.type}. Located in the heart of ${property.location}, this residence combines architectural excellence with panoramic views.`}
                    </p>
                  </div>
                </div>

                {/* Payment Plan for Off-Plan */}
                {property.category === "off-plan" && property.paymentPlan && (
                  <div className="mt-12 pt-12 border-t border-border">
                    <h2 className="font-display text-2xl font-black text-foreground mb-8 uppercase tracking-tighter flex items-center gap-3">
                      <div className="w-7 h-7 flex items-center justify-center text-gold shrink-0 border border-gold/40 rounded-[4px] p-0.5">
                        <DirhamIcon className="w-full h-full" />
                      </div>{" "}
                      Payment Strategy
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-6 rounded-2xl bg-gold/5 border border-gold/10">
                        <p className="text-[10px] font-black text-gold uppercase tracking-[0.2em] mb-2">
                          On Booking
                        </p>
                        <p className="font-display text-3xl font-black text-foreground">
                          {property.paymentPlan.onBooking}%
                        </p>
                      </div>
                      <div className="p-6 rounded-2xl bg-muted/30 border border-border text-center md:text-left">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">
                          During Construction
                        </p>
                        <p className="font-display text-3xl font-black text-foreground">
                          {property.paymentPlan.duringConstruction}%
                        </p>
                      </div>
                      <div className="p-6 rounded-2xl bg-muted/30 border border-border text-center md:text-left">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">
                          On Handover
                        </p>
                        <p className="font-display text-3xl font-black text-foreground">
                          {property.paymentPlan.onHandover}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Technical Specs */}
                <div className="mt-12 pt-12 border-t border-border">
                  <h2 className="font-display text-2xl font-black text-foreground mb-8 uppercase tracking-tighter">
                    Technical Profile
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                    {property.developer && (
                      <div className="flex items-center gap-4">
                        <Building2 className="w-5 h-5 text-[#0D3430]" />
                        <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                            Developer
                          </p>
                          <p className="text-sm font-bold">{property.developer}</p>
                        </div>
                      </div>
                    )}
                    {Number(property.yearBuilt) > 0 && (
                      <div className="flex items-center gap-4">
                        <Calendar className="w-5 h-5 text-[#0D3430]" />
                        <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                            {property.category === "off-plan"
                              ? "Target Handover"
                              : "Year Built"}
                          </p>
                          <p className="text-sm font-bold">
                            {property.category === "off-plan"
                              ? property.handoverYear
                              : property.yearBuilt}
                          </p>
                        </div>
                      </div>
                    )}
                    {Number(property.kitchens) > 0 && (
                      <div className="flex items-center gap-4">
                        <Utensils className="w-5 h-5 text-[#0D3430]" />
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
                    {Number(property.garages) > 0 && (
                      <div className="flex items-center gap-4">
                        <Car className="w-5 h-5 text-[#0D3430]" />
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
                    {Number(property.floorsNo) > 0 && (
                      <div className="flex items-center gap-4">
                        <Layers className="w-5 h-5 text-[#0D3430]" />
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
                {(() => {
                  const filteredAmenities = (property.amenities || [])
                    .flatMap((a) =>
                      typeof a === "string" ? a.split(",") : [a],
                    )
                    .map((a) => (typeof a === "string" ? a.trim() : a))
                    .filter((a) => AMENITIES_LIST.includes(a));

                  if (filteredAmenities.length === 0) return null;

                  return (
                    <div className="mt-12 pt-12 border-t border-border">
                      <h2 className="font-display text-2xl font-black text-foreground mb-8 uppercase tracking-tighter">
                        Lifestyle Amenities
                      </h2>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {filteredAmenities.map((amenity, idx) => {
                          const original = AMENITIES_LIST.find(
                            (item) =>
                              item.toLowerCase() ===
                              amenity.toLowerCase().replace(/-/g, " "),
                          );
                          return (
                            <div
                              key={idx}
                              className="flex items-center gap-4 p-4 rounded-2xl bg-[#0D3430]/5 border border-[#0D3430]/10 group hover:border-gold/30 hover:bg-white transition-all shadow-sm"
                            >
                              <CheckCircle2 className="w-4 h-4 text-[#0D3430] shrink-0 fill-none" />
                              <span className="text-[10px] font-black text-stone-600 group-hover:text-[#0D3430] transition-colors uppercase tracking-widest truncate">
                                {original || amenity.replace(/-/g, " ")}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
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
                </div>
              )}

              {/* Official Brochure (PDF) - Regular Property View */}
              {property.technicalPdf && property.technicalPdf !== "null" && property.technicalPdf.trim() !== "" && (
                <div className="bg-background/80 backdrop-blur-2xl rounded-3xl shadow-xl p-8 md:p-12 border border-white/10 mt-8 flex flex-col items-center text-center">
                  <div className="flex items-center gap-4 mb-6 justify-center">
                    <div className="w-8 h-1 bg-gold rounded-full" />
                    <h2 className="font-display text-2xl font-black text-foreground uppercase tracking-tighter">
                      Official Brochure
                    </h2>
                    <div className="w-8 h-1 bg-gold rounded-full" />
                  </div>
                  <p className="text-muted-foreground font-body text-sm mb-8 max-w-lg">
                    Access the complete technical documentation and
                    specifications for this property.
                  </p>
                  <Button
                    variant="gold"
                    className="rounded-full px-16 py-8 font-bold uppercase tracking-[0.2em] text-[11px] shadow-2xl hover:shadow-gold/20 group"
                    asChild
                  >
                    <a
                      href={getDownloadUrl(property.technicalPdf)}
                      target="_blank"
                      rel="noreferrer"
                      download
                    >
                      <FileText className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                      Download Brochure (PDF)
                    </a>
                  </Button>
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

                  <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border">
                    <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center font-display font-black text-white text-xl">
                      V
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        Portfolio Manager
                      </p>
                      <p className="font-bold text-foreground">Vikas Kumar</p>
                    </div>
                  </div>

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
                      <div className="flex gap-2">
                        <CountryCodeSelector
                          value={form.countryCode}
                          onChange={(value) =>
                            setForm({ ...form, countryCode: value })
                          }
                          className="w-[100px] rounded-xl h-[46px]"
                          isDark
                        />
                        <input
                          required
                          type="tel"
                          value={form.phone}
                          onChange={(e) =>
                            setForm({ ...form, phone: e.target.value })
                          }
                          className="flex-1 bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm font-body outline-none focus:border-gold transition-colors"
                          placeholder="Phone Number *"
                        />
                      </div>
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
                    </form>

                    <div className="pt-4 flex justify-center gap-6 border-t border-border mt-2">
                      <a
                        href={`https://wa.me/971588251088?text=${encodeURIComponent(`Hi, I'm interested in the property: ${property.title}`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-muted-foreground hover:text-emerald transition-colors flex items-center gap-2 font-black uppercase text-[10px] tracking-widest"
                      >
                        <WhatsAppIcon className="w-5 h-5" /> Chat via WhatsApp
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
                    All property transactions are handled through RERA-regulated
                    escrow accounts ensuring full investor protection.
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
