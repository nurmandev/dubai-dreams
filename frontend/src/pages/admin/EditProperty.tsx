import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  ArrowLeft,
  Save,
  Building2,
  MapPin,
  Tag,
  Info,
  Bed,
  Bath,
  Square,
  Calendar,
  Home,
  Car,
  DollarSign,
  FileText,
  Video,
  Upload,
  X,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { AMENITIES_LIST } from "@/data/properties";

interface Property {
  id: string;
  _id?: string;
  title: string;
  description: string;
  location: string;
  address?: string;
  price: number;
  propertyType: string;
  status: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  amenities?: string[];
  yearBuilt?: number;
  kitchens?: number;
  garages?: number;
  garageSize?: number;
  floorsNo?: number;
  listedIn?: string;
  yearlyTaxRate?: number;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  videoUrl?: string;
  images: string[];
  floorPlans: string[];
}

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [amenitiesText, setAmenitiesText] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // File handling
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const [newFloorPlans, setNewFloorPlans] = useState<File[]>([]);
  const [floorPlanPreviews, setFloorPlanPreviews] = useState<string[]>([]);
  const [existingFloorPlans, setExistingFloorPlans] = useState<string[]>([]);

  const [newTechnicalPdf, setNewTechnicalPdf] = useState<File | null>(null);
  const [existingTechnicalPdf, setExistingTechnicalPdf] = useState<
    string | null
  >(null);

  const [formData, setFormData] = useState<Partial<Property>>({
    title: "",
    description: "",
    location: "",
    address: "",
    price: 0,
    propertyType: "apartment",
    status: "pending",
    listedIn: "Buy",
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    city: "",
    state: "",
    zipCode: "",
    country: "United Arab Emirates",
    yearBuilt: new Date().getFullYear(),
    kitchens: 1,
    garages: 0,
    garageSize: 0,
    floorsNo: 1,
    yearlyTaxRate: 0,
    videoUrl: "",
    images: [],
    floorPlans: [],
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data } = await api.get("/api/dashboard/properties");
        const properties = data.properties || [];
        const found = properties.find((p: any) => (p._id || p.id) === id);

        if (found) {
          setFormData({
            ...found,
            id: found._id || found.id,
          });
          setExistingImages(found.images || []);
          setExistingFloorPlans(found.floorPlans || []);
          setExistingTechnicalPdf(found.technicalPdf || null);
          if (found.amenities && Array.isArray(found.amenities)) {
            const predefined = found.amenities.filter((a: string) =>
              AMENITIES_LIST.includes(a),
            );
            const custom = found.amenities.filter(
              (a: string) => !AMENITIES_LIST.includes(a),
            );
            setSelectedAmenities(predefined);
            setAmenitiesText(custom.join(", "));
          }
        } else {
          toast.error("Property not found");
          navigate("/admin/properties");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Failed to load property details");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, navigate]);

  const handleNewFilesChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "images" | "floorPlans",
  ) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

      if (type === "images") {
        setNewImages((prev) => [...prev, ...newFiles]);
        setImagePreviews((prev) => [...prev, ...newPreviews]);
      } else {
        setNewFloorPlans((prev) => [...prev, ...newFiles]);
        setFloorPlanPreviews((prev) => [...prev, ...newPreviews]);
      }
    }
  };

  const removeExistingFile = (index: number, type: "images" | "floorPlans") => {
    if (type === "images") {
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setExistingFloorPlans((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const removeNewFile = (index: number, type: "images" | "floorPlans") => {
    if (type === "images") {
      setNewImages((prev) => prev.filter((_, i) => i !== index));
      setImagePreviews((prev) => {
        URL.revokeObjectURL(prev[index]);
        return prev.filter((_, i) => i !== index);
      });
    } else {
      setNewFloorPlans((prev) => prev.filter((_, i) => i !== index));
      setFloorPlanPreviews((prev) => {
        URL.revokeObjectURL(prev[index]);
        return prev.filter((_, i) => i !== index);
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const tagsArray = amenitiesText
        .split(",")
        .map((a) => a.trim())
        .filter((a) => a !== "");

      const allAmenities = Array.from(
        new Set([...selectedAmenities, ...tagsArray]),
      );

      // Use FormData for file updates
      const data = new FormData();

      // Basic fields
      const {
        id: _,
        _id: __,
        ownerId,
        createdAt,
        updatedAt,
        views,
        favouritedBy,
        images,
        floorPlans,
        ...updateFields
      } = formData as any;

      Object.entries(updateFields).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          data.append(key, value.toString());
        }
      });

      // Special handling for arrays
      allAmenities.forEach((a) => data.append("amenities", a));

      // Existing files to KEEP
      existingImages.forEach((img) => data.append("images", img));
      existingFloorPlans.forEach((plan) => data.append("floorPlans", plan));

      // NEW files to upload
      newImages.forEach((file) => data.append("images", file));
      newFloorPlans.forEach((file) => data.append("floorPlans", file));
      if (newTechnicalPdf) data.append("technicalPdf", newTechnicalPdf);
      if (existingTechnicalPdf)
        data.append("technicalPdf", existingTechnicalPdf);

      await api.patch(`/api/dashboard/properties/${id}`, { data });
      toast.success("Property updated successfully");
      navigate("/admin/properties");
    } catch (err: any) {
      console.error("Update error:", err);
      toast.error(err.response?.data?.message || "Failed to update property");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
        </div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="mb-8">
        <Button
          variant="ghost"
          asChild
          className="mb-4 -ml-4 text-muted-foreground hover:text-gold"
        >
          <Link to="/admin/properties">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Properties
          </Link>
        </Button>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Advanced Editor
        </h1>
        <p className="text-muted-foreground font-body">
          Managing assets and specifications for "{formData.title}"
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Content & Location */}
            <div className="bg-background rounded-xl p-8 shadow-sm border border-border space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <Building2 className="w-5 h-5 text-gold" />
                <h2 className="font-display font-bold text-lg text-foreground uppercase tracking-widest">
                  General Content
                </h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-body font-bold text-muted-foreground uppercase">
                    Property Title
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full bg-muted/30 border border-border rounded-lg px-4 py-2.5 outline-none font-body text-sm focus:border-gold transition-colors"
                    value={formData.title || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-body font-bold text-muted-foreground uppercase">
                    Description
                  </label>
                  <textarea
                    required
                    rows={6}
                    className="w-full bg-muted/30 border border-border rounded-lg px-4 py-2.5 outline-none font-body text-sm focus:border-gold transition-colors"
                    value={formData.description || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-body font-bold text-muted-foreground uppercase flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-gold" /> Street Address
                  </label>
                  <input
                    type="text"
                    className="w-full bg-muted/30 border border-border rounded-lg px-4 py-2.5 outline-none font-body text-sm focus:border-gold transition-colors"
                    value={formData.address || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                </div>

                {/* Geographical Taxonomy */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-body font-bold text-muted-foreground uppercase">
                      Location
                    </label>
                    <input
                      type="text"
                      className="w-full bg-muted/30 border border-border rounded-lg px-4 py-2.5 outline-none font-body text-sm focus:border-gold transition-colors"
                      value={formData.location || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-body font-bold text-muted-foreground uppercase">
                      Region
                    </label>
                    <input
                      type="text"
                      className="w-full bg-muted/30 border border-border rounded-lg px-4 py-2.5 outline-none font-body text-sm focus:border-gold transition-colors"
                      value={formData.region || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, region: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-body font-bold text-muted-foreground uppercase">
                      Area
                    </label>
                    <input
                      type="text"
                      className="w-full bg-muted/30 border border-border rounded-lg px-4 py-2.5 outline-none font-body text-sm focus:border-gold transition-colors"
                      value={formData.areaLocation || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          areaLocation: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-body font-bold text-muted-foreground uppercase">
                      City
                    </label>
                    <input
                      type="text"
                      className="w-full bg-muted/30 border border-border rounded-lg px-4 py-2.5 outline-none font-body text-sm focus:border-gold transition-colors"
                      value={formData.city || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Media Manager */}
            <div className="bg-background rounded-xl p-8 shadow-sm border border-border space-y-8">
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <ImageIcon className="w-5 h-5 text-gold" />
                <h2 className="font-display font-bold text-lg text-foreground uppercase tracking-widest">
                  Asset Management
                </h2>
              </div>

              {/* Photos */}
              <div className="space-y-4">
                <label className="text-xs font-body font-bold text-muted-foreground uppercase flex items-center gap-2">
                  Images & Gallery
                </label>

                {/* Existing Images */}
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mb-4">
                  {existingImages.map((img, idx) => (
                    <div
                      key={`exist-img-${idx}`}
                      className="relative group aspect-square rounded-lg overflow-hidden border border-border"
                    >
                      <img
                        src={
                          img.startsWith("http")
                            ? img
                            : `http://localhost:5000/${img}`
                        }
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingFile(idx, "images")}
                        className="absolute inset-0 bg-red-600/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  {/* New Previews */}
                  {imagePreviews.map((prev, idx) => (
                    <div
                      key={`new-img-${idx}`}
                      className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gold/50 border-dashed"
                    >
                      <img src={prev} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeNewFile(idx, "images")}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                      >
                        <X className="w-2 h-2" />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-gold flex flex-col items-center justify-center bg-muted/10 cursor-pointer transition-colors">
                    <Upload className="w-5 h-5 text-gold mb-1" />
                    <span className="text-[10px] text-muted-foreground font-bold">
                      ADD NEW
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleNewFilesChange(e, "images")}
                    />
                  </label>
                </div>
              </div>

              {/* Floor Plans */}
              <div className="space-y-4 pt-6 border-t border-border">
                <label className="text-xs font-body font-bold text-muted-foreground uppercase flex items-center gap-2">
                  Floor Plans (Blueprints)
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {existingFloorPlans.map((plan, idx) => (
                    <div
                      key={`exist-plan-${idx}`}
                      className="relative group aspect-square rounded-lg overflow-hidden border border-border bg-muted/20 flex items-center justify-center"
                    >
                      <FileText className="w-6 h-6 text-muted-foreground" />
                      <button
                        type="button"
                        onClick={() => removeExistingFile(idx, "floorPlans")}
                        className="absolute inset-0 bg-red-600/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  {floorPlanPreviews.map((prev, idx) => (
                    <div
                      key={`new-plan-${idx}`}
                      className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gold/50 border-dashed bg-muted/10 flex items-center justify-center"
                    >
                      <FileText className="w-6 h-6 text-gold" />
                      <button
                        type="button"
                        onClick={() => removeNewFile(idx, "floorPlans")}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                      >
                        <X className="w-2 h-2" />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-gold flex flex-col items-center justify-center bg-muted/10 cursor-pointer transition-colors">
                    <Upload className="w-5 h-5 text-gold mb-1" />
                    <span className="text-[10px] text-muted-foreground font-bold">
                      ADD PLAN
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*,application/pdf"
                      onChange={(e) => handleNewFilesChange(e, "floorPlans")}
                    />
                  </label>
                </div>
              </div>

              {/* Official Brochure (PDF) */}
              <div className="space-y-4 pt-6 border-t border-border">
                <label className="text-xs font-body font-bold text-muted-foreground uppercase flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gold" /> Official Brochure
                  (PDF)
                </label>
                <div className="flex items-center gap-4">
                  {existingTechnicalPdf || newTechnicalPdf ? (
                    <div className="flex-1 flex items-center justify-between bg-gold/10 border border-gold/20 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText className="w-5 h-5 text-gold shrink-0" />
                        <span className="text-xs font-bold text-foreground truncate">
                          {newTechnicalPdf
                            ? newTechnicalPdf.name
                            : "Existing Brochure.pdf"}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setNewTechnicalPdf(null);
                          setExistingTechnicalPdf(null);
                        }}
                        className="p-1 hover:bg-gold/20 rounded-full transition-colors"
                      >
                        <X className="w-4 h-4 text-gold" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex-1 border-2 border-dashed border-border hover:border-gold rounded-xl py-4 flex flex-col items-center justify-center bg-muted/5 cursor-pointer transition-all hover:bg-gold/5">
                      <Upload className="w-6 h-6 text-gold mb-1" />
                      <span className="text-[10px] text-muted-foreground font-black tracking-tighter uppercase">
                        Attach Technical PDF
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="application/pdf"
                        onChange={(e) => {
                          if (e.target.files?.[0])
                            setNewTechnicalPdf(e.target.files[0]);
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Specs Grid */}
            <div className="bg-background rounded-xl p-8 shadow-sm border border-border space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <Square className="w-5 h-5 text-gold" />
                <h2 className="font-display font-bold text-lg text-foreground uppercase tracking-widest">
                  Dimensions & Specs
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-body font-bold text-muted-foreground uppercase">
                    Beds
                  </label>
                  <input
                    type="number"
                    className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 outline-none font-body text-sm focus:border-gold"
                    value={formData.bedrooms || 0}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bedrooms: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-body font-bold text-muted-foreground uppercase">
                    Baths
                  </label>
                  <input
                    type="number"
                    className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 outline-none font-body text-sm focus:border-gold"
                    value={formData.bathrooms || 0}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bathrooms: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-body font-bold text-muted-foreground uppercase">
                    Kitchens
                  </label>
                  <input
                    type="number"
                    className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 outline-none font-body text-sm focus:border-gold"
                    value={formData.kitchens || 0}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        kitchens: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-body font-bold text-muted-foreground uppercase">
                    Area (SQFT)
                  </label>
                  <input
                    type="number"
                    className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 outline-none font-body text-sm focus:border-gold"
                    value={formData.area || 0}
                    onChange={(e) =>
                      setFormData({ ...formData, area: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-background rounded-xl p-6 shadow-sm border border-border space-y-6">
              <h3 className="font-display font-bold text-sm uppercase tracking-widest text-gold">
                Project Status
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-body font-bold text-muted-foreground uppercase">
                    Assigned Category*
                  </label>
                  <select
                    className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 outline-none font-body text-sm focus:border-gold"
                    value={formData.listedIn}
                    onChange={(e) =>
                      setFormData({ ...formData, listedIn: e.target.value })
                    }
                  >
                    <option value="Buy">Premium Sale</option>
                    <option value="Rent">Luxury Rental</option>
                    <option value="Off-Plan">Off-Plan Offering</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-body font-bold text-muted-foreground uppercase text-gold font-bold">
                    Price (AED)*
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full bg-primary text-white border-none rounded-lg px-4 py-3 outline-none font-display font-bold text-xl"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-body font-bold text-muted-foreground uppercase">
                    Availability Status
                  </label>
                  <select
                    className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 outline-none font-body text-sm focus:border-gold"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="sold">Sold</option>
                    <option value="rented">Rented</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <Button
                  variant="gold"
                  className="w-full py-6 text-lg"
                  type="submit"
                  disabled={saving}
                >
                  <Save className="w-5 h-5 mr-2" />
                  {saving ? "Saving..." : "Update Listing"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  asChild
                  disabled={saving}
                >
                  <Link to="/admin/properties">Cancel</Link>
                </Button>
              </div>
            </div>

            {/* Lifestyle Amenities Selection */}
            <div className="bg-background rounded-xl p-6 shadow-sm border border-border space-y-4">
              <div className="flex items-center gap-2 text-gold">
                <CheckCircle2 className="w-4 h-4" />
                <h3 className="font-display font-bold text-xs uppercase tracking-widest">
                  Lifestyle Amenities
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {AMENITIES_LIST.map((amenity) => (
                  <label
                    key={amenity}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border border-border/50 cursor-pointer hover:bg-gold/5 transition-colors group"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-border text-gold focus:ring-gold"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAmenities((prev) => [...prev, amenity]);
                        } else {
                          setSelectedAmenities((prev) =>
                            prev.filter((a) => a !== amenity),
                          );
                        }
                      }}
                    />
                    <span className="text-xs font-bold text-foreground/80 group-hover:text-gold transition-colors">
                      {amenity}
                    </span>
                  </label>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground">
                Standardized features for search optimization.
              </p>
            </div>

            <div className="bg-background rounded-xl p-6 shadow-sm border border-border space-y-4">
              <div className="flex items-center gap-2 text-gold">
                <Tag className="w-4 h-4" />
                <h3 className="font-display font-bold text-xs uppercase tracking-widest">
                  Additional Tags
                </h3>
              </div>
              <textarea
                rows={4}
                placeholder="Separate with commas..."
                className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 outline-none font-body text-sm focus:border-gold"
                value={amenitiesText}
                onChange={(e) => setAmenitiesText(e.target.value)}
              />
              <p className="text-[10px] text-muted-foreground">
                Used for filtering and discovery.
              </p>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

// Redundant import removed

export default EditProperty;
