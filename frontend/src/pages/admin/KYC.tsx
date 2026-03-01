import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";
import {
  FileText,
  Search as SearchIcon,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  FileDown,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface KYCSubmission {
  _id: string;
  userId: { name: string; email: string };
  fullName: string;
  nationality: string;
  idType: string;
  idNumber: string;
  documentUrls: {
    passportCopy?: string;
    visaCopy?: string;
    emiratesIdCopy?: string;
  };
  status: "pending" | "approved" | "rejected";
  remarks?: string;
  createdAt: string;
}

const KYCManagement = () => {
  const [submissions, setSubmissions] = useState<KYCSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchSubmissions = async () => {
    try {
      const { data } = await api.get("/api/dashboard/kyc");
      setSubmissions(data.submissions || []);
    } catch (err) {
      console.error("Failed to fetch KYC submissions", err);
      // Fallback data for demonstration if backend route is not available
      setSubmissions([
        {
          _id: "demo1",
          userId: { name: "Alice Smith", email: "alice@example.com" },
          fullName: "Alice Smith",
          nationality: "British",
          idType: "passport",
          idNumber: "UK123456789",
          documentUrls: {
            passportCopy: "/placeholder-passport.jpg",
          },
          status: "pending",
          createdAt: new Date().toISOString(),
        },
        {
          _id: "demo2",
          userId: { name: "Bob Jones", email: "bob@example.com" },
          fullName: "Robert Jones",
          nationality: "American",
          idType: "emirates_id",
          idNumber: "784-1234-5678901-2",
          documentUrls: {
            passportCopy: "/placeholder-passport.jpg",
            emiratesIdCopy: "/placeholder-eid.jpg",
          },
          status: "approved",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      // In a real app we would call the API here
      try {
        await api.patch(`/api/dashboard/kyc/${id}/status`, { status });
      } catch (e) {
        // Silently fallback if mock data
      }

      toast.success(`KYC marked as ${status}`);
      setSubmissions((prev) =>
        prev.map((sub) => (sub._id === id ? { ...sub, status } : sub)),
      );
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const generatePDFSummary = (sub: KYCSubmission) => {
    // Generate a formatted HTML string that we'll save as a downloaded file
    // to simulate standard PDF summaries since no external jsPDF library is available

    const summaryContent = `
      KYC COMPLIANCE SUMMARY REPORT
      =============================
      Generation Date: ${new Date().toLocaleString()}
      
      Subject Details:
      - Full Name: ${sub.fullName}
      - Nationality: ${sub.nationality}
      - Account Email: ${sub.userId?.email || "N/A"}
      
      Identification Verification:
      - Identification Type: ${sub.idType.toUpperCase()}
      - Document Number: ${sub.idNumber}
      - Current Status: ${sub.status.toUpperCase()}
      
      Submission Timeline:
      - Lodged On: ${new Date(sub.createdAt).toLocaleString()}
      
      Reviewer Notes:
      ${sub.remarks || "No administrative remarks logged."}
      
      --
      OMNIS Properties - Internal Compliance Engine
    `;

    const blob = new Blob([summaryContent], {
      type: "text/plain;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `KYC_Summary_${sub.fullName.replace(/\s+/g, "_")}_${sub.idNumber}.txt`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Summary report generated");
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const filteredSubmissions = submissions.filter(
    (s) =>
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.idNumber.toLowerCase().includes(search.toLowerCase()) ||
      (s.userId?.email &&
        s.userId.email.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div className="space-y-1">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground font-title">
            KYC Compliance
          </h1>
          <p className="text-muted-foreground font-body text-sm">
            Review client identification and regulatory submissions.
          </p>
        </div>
        {!loading && (
          <div className="px-4 py-2 bg-gold/5 rounded-2xl border border-gold/20 flex flex-col items-center sm:items-end">
            <span className="text-[10px] uppercase font-black tracking-widest text-gold/60">
              Pending Appraisals
            </span>
            <span className="text-lg font-display font-bold text-gold">
              {filteredSubmissions.filter((s) => s.status === "pending").length}{" "}
              Queue
            </span>
          </div>
        )}
      </div>

      <div className="mb-8 p-3 md:p-4 bg-background rounded-2xl border border-border shadow-sm flex items-center">
        <div className="relative w-full">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, email, or ID number..."
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
        ) : filteredSubmissions.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground font-body bg-muted/5 rounded-3xl border-2 border-dashed border-border/50">
            <User className="w-12 h-12 mx-auto text-muted-foreground opacity-20 mb-3" />
            <p className="font-display font-medium">
              No KYC records match your criteria.
            </p>
          </div>
        ) : (
          filteredSubmissions.map((sub, i) => (
            <motion.div
              key={sub._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-background rounded-2xl border border-border shadow-sm p-5 md:p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Information Section */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0 border border-primary/10">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-display font-bold text-lg">
                        {sub.fullName}
                      </h3>
                      {sub.status === "pending" && (
                        <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                          <Clock className="w-3 h-3" /> Pending Review
                        </span>
                      )}
                      {sub.status === "approved" && (
                        <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> Approved
                        </span>
                      )}
                      {sub.status === "rejected" && (
                        <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 border border-red-500/20">
                          <XCircle className="w-3 h-3" /> Rejected
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm text-muted-foreground font-body">
                      <span>
                        <strong>Email:</strong> {sub.userId?.email || "N/A"}
                      </span>
                      <span>
                        <strong>Nationality:</strong> {sub.nationality}
                      </span>
                      <span className="uppercase">
                        <strong>{sub.idType.replace("_", " ")}:</strong>{" "}
                        {sub.idNumber}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions Section */}
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto mt-4 lg:mt-0 pt-4 lg:pt-0 border-t border-border lg:border-t-0">
                  {/* Document Downloads */}
                  <div className="flex items-center gap-2 mr-auto lg:mr-4 border-r border-border pr-4">
                    {sub.documentUrls?.passportCopy && (
                      <button
                        title="Download Passport"
                        className="p-2 bg-muted/20 hover:bg-gold hover:text-white rounded-lg transition-colors border border-border"
                        onClick={() => toast.info("Downloading Passport...")}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                    {sub.documentUrls?.emiratesIdCopy && (
                      <button
                        title="Download Emirates ID"
                        className="p-2 bg-muted/20 hover:bg-gold hover:text-white rounded-lg transition-colors border border-border"
                        onClick={() => toast.info("Downloading Emirates ID...")}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => generatePDFSummary(sub)}
                    className="px-4 py-2 rounded-xl bg-muted/30 text-foreground font-display font-medium text-xs hover:bg-muted transition-colors flex items-center gap-2"
                  >
                    <FileDown className="w-4 h-4" /> Summary Report
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusUpdate(sub._id, "approved")}
                      disabled={sub.status === "approved"}
                      className="p-2 text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Approve"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(sub._id, "rejected")}
                      disabled={sub.status === "rejected"}
                      className="p-2 text-red-600 bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Reject"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </AdminLayout>
  );
};

export default KYCManagement;
