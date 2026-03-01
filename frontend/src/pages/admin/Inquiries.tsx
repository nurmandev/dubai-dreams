import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";
import {
  MessageSquare,
  Calendar,
  Search as SearchIcon,
  Mail,
  Phone as PhoneIcon,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Inquiry {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyTitle?: string;
  createdAt: string;
}

const ManageInquiries = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchInquiries = async () => {
    try {
      const { data } = await api.get("/api/dashboard/recent-messages");
      const mapped = (data.messages || []).map((m: any) => ({
        ...m,
        id: m._id || m.id,
      }));
      setInquiries(mapped);
    } catch (err) {
      console.error("Failed to fetch inquiries", err);
      toast.error("Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const filteredInquiries = inquiries.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.email.toLowerCase().includes(search.toLowerCase()) ||
      (i.propertyTitle &&
        i.propertyTitle.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div className="space-y-1">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground font-title">
            Lead Inquiries
          </h1>
          <p className="text-muted-foreground font-body text-sm">
            Respond to client engagement and property interests.
          </p>
        </div>
        {!loading && (
          <div className="px-4 py-2 bg-gold/5 rounded-2xl border border-gold/20 flex flex-col items-center sm:items-end">
            <span className="text-[10px] uppercase font-black tracking-widest text-gold/60">
              System Log
            </span>
            <span className="text-lg font-display font-bold text-gold">
              {filteredInquiries.length} Messages
            </span>
          </div>
        )}
      </div>

      <div className="mb-8 p-3 md:p-4 bg-background rounded-2xl border border-border shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search leads, emails or properties..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted/20 border-border font-body text-sm outline-none focus:ring-1 ring-gold/30 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-20 text-muted-foreground font-body">
            Verifying secure channels...
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground font-body bg-muted/5 rounded-3xl border-2 border-dashed border-border/50">
            <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground opacity-20 mb-3" />
            <p className="font-display font-medium">
              No inquiries found in this segment.
            </p>
          </div>
        ) : (
          filteredInquiries.map((inquiry, i) => (
            <motion.div
              key={inquiry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-background rounded-2xl p-5 md:p-8 shadow-sm border border-border hover:shadow-xl hover:shadow-gold/5 transition-all group overflow-hidden relative"
            >
              {/* Luxury Accent */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gold/40 group-hover:bg-gold transition-colors" />

              <div className="flex flex-col lg:flex-row justify-between gap-8">
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white font-bold font-display text-xl uppercase shadow-lg shadow-primary/20">
                      {inquiry.name[0]}
                    </div>
                    <div>
                      <h3 className="font-display font-black text-foreground text-lg md:text-xl tracking-tight leading-none mb-1">
                        {inquiry.name}
                      </h3>
                      {inquiry.propertyTitle && (
                        <p className="text-[10px] md:text-xs font-body font-bold text-gold uppercase tracking-widest flex items-center gap-1.5 px-2 py-0.5 bg-gold/5 rounded-full border border-gold/10 w-fit">
                          <Building2 className="w-3 h-3" />{" "}
                          {inquiry.propertyTitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="relative">
                    <p className="text-muted-foreground font-body text-sm md:text-base leading-relaxed p-5 bg-muted/10 rounded-2xl italic">
                      "{inquiry.message}"
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-3 pt-2">
                    <a
                      href={`mailto:${inquiry.email}`}
                      className="flex items-center gap-2 text-primary font-body font-bold text-xs hover:text-gold transition-colors border-b border-primary/10 pb-1"
                    >
                      <Mail className="w-3.5 h-3.5" /> {inquiry.email}
                    </a>
                    <a
                      href={`tel:${inquiry.phone}`}
                      className="flex items-center gap-2 text-muted-foreground font-body font-bold text-xs hover:text-gold transition-colors border-b border-border/20 pb-1"
                    >
                      <PhoneIcon className="w-3.5 h-3.5" /> {inquiry.phone}
                    </a>
                    <div className="flex items-center gap-2 text-muted-foreground/40 font-mono text-[10px]">
                      <Calendar className="w-3 h-3" />{" "}
                      {new Date(inquiry.createdAt).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex flex-row lg:flex-col justify-stretch gap-3 lg:w-48 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-border mt-4 lg:mt-0 lg:pl-8">
                  <button className="flex-1 items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gold text-white font-display font-bold text-xs uppercase tracking-widest hover:bg-primary transition-all flex shadow-lg shadow-gold/20 active:scale-95">
                    <CheckCircle2 className="w-4 h-4" /> Resolve
                  </button>
                  <button className="flex-1 items-center justify-center gap-2 px-6 py-4 rounded-xl bg-muted text-foreground/50 font-display font-bold text-xs uppercase tracking-widest hover:bg-destructive/10 hover:text-destructive transition-all flex border border-transparent hover:border-destructive/20">
                    <Trash2 className="w-4 h-4" /> Archive
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </AdminLayout>
  );
};

// Missing imports
import { Building2 } from "lucide-react";

export default ManageInquiries;
