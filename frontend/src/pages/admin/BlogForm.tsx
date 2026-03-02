import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";
import { ArrowLeft, Save, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const categories = [
  "Investment",
  "Guide",
  "News",
  "Lifestyle",
  "Market Report",
];

const BlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "News",
    status: "published",
    image: "/images/property-marina.jpg",
  });

  useEffect(() => {
    if (isEdit) {
      const fetchBlog = async () => {
        try {
          const { data } = await api.get(`/api/public/blogs/id/${id}`);
          // Note: need to add byId on public or use a different endpoint
          // For now let's assume dashboard has get blog by id or we use public
          setFormData({
            title: data.blog.title,
            excerpt: data.blog.excerpt,
            content: data.blog.content,
            category: data.blog.category,
            status: data.blog.status,
            image: data.blog.image,
          });
        } catch (err) {
          toast.error("Failed to load blog post");
          navigate("/admin/blogs");
        } finally {
          setLoading(false);
        }
      };
      fetchBlog();
    }
  }, [id, isEdit, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (isEdit) {
        await api.patch(`/api/dashboard/blogs/${id}`, formData);
        toast.success("Blog post updated successfully");
      } else {
        await api.post("/api/dashboard/blogs", formData);
        toast.success("Blog post created successfully");
      }
      navigate("/admin/blogs");
    } catch (err) {
      toast.error("Failed to save blog post");
    } finally {
      setSaving(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            to="/admin/blogs"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Articles
          </Link>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground font-title">
            {isEdit ? "Edit Article" : "Create New Article"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-background rounded-2xl border border-border p-6 md:p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Article Title
              </label>
              <input
                required
                type="text"
                placeholder="e.g., The Future of Dubai Real Estate"
                className="w-full bg-muted/20 border-border rounded-xl px-4 py-3 outline-none focus:ring-1 ring-gold font-body"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  Category
                </label>
                <select
                  className="w-full bg-muted/20 border-border rounded-xl px-4 py-3 outline-none focus:ring-1 ring-gold font-body appearance-none"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  Status
                </label>
                <select
                  className="w-full bg-muted/20 border-border rounded-xl px-4 py-3 outline-none focus:ring-1 ring-gold font-body appearance-none"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Featured Image URL
              </label>
              <div className="relative">
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="URL to featured image..."
                  className="w-full pl-11 pr-4 py-3 bg-muted/20 border-border rounded-xl outline-none focus:ring-1 ring-gold font-body text-sm"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Short Excerpt
              </label>
              <textarea
                required
                rows={3}
                placeholder="A brief summary for the blog card..."
                className="w-full bg-muted/20 border-border rounded-xl px-4 py-3 outline-none focus:ring-1 ring-gold font-body text-sm"
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Content
              </label>
              <div className="bg-muted/5 rounded-xl border border-border overflow-hidden min-h-[400px]">
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(val) => setFormData({ ...formData, content: val })}
                  modules={quillModules}
                  className="h-[350px] font-body"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" asChild disabled={saving}>
              <Link to="/admin/blogs">Cancel</Link>
            </Button>
            <Button variant="gold" type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />{" "}
                  {isEdit ? "Update Article" : "Publish Article"}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default BlogForm;
