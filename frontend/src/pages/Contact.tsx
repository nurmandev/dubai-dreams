import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { countries } from "@/data/countries";
import { CountryCodeSelector } from "@/components/CountryCodeSelector";

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    countryCode: "+971",
    phone: "",
    message: "",
    budget: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submissionData = {
        ...form,
        phone: `${form.countryCode} ${form.phone}`,
      };
      await api.post("/api/public/inquiry", { data: submissionData });
      toast.success(
        "Enquiry Submitted! Our team will get back to you shortly.",
      );
      setForm({
        name: "",
        email: "",
        countryCode: "+971",
        phone: "",
        message: "",
        budget: "",
      });
    } catch (error) {
      toast.error("Failed to submit enquiry. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="pt-20 bg-primary">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-gold font-body text-sm tracking-[0.3em] uppercase mb-2">
              Get In Touch
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">
              Contact Us
            </h1>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="font-body text-sm text-foreground mb-1 block">
                      Full Name *
                    </label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="w-full bg-muted rounded-lg px-4 py-3 text-foreground font-body text-sm outline-none border border-border focus:border-gold transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="font-body text-sm text-foreground mb-1 block">
                      Email *
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="w-full bg-muted rounded-lg px-4 py-3 text-foreground font-body text-sm outline-none border border-border focus:border-gold transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="font-body text-sm text-foreground mb-1 block">
                      Phone Number *
                    </label>
                    <div className="flex gap-2">
                      <CountryCodeSelector
                        value={form.countryCode}
                        onChange={(value) =>
                          setForm({ ...form, countryCode: value })
                        }
                        className="w-[110px] sm:w-[130px] rounded-lg h-[46px]"
                      />
                      <input
                        required
                        type="tel"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        className="flex-1 bg-muted rounded-lg px-4 py-3 text-foreground font-body text-sm outline-none border border-border focus:border-gold transition-colors"
                        placeholder="XX XXX XXXX"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-body text-sm text-foreground mb-1 block">
                      Budget (Optional)
                    </label>
                    <select
                      value={form.budget}
                      onChange={(e) =>
                        setForm({ ...form, budget: e.target.value })
                      }
                      className="w-full bg-muted rounded-lg px-4 py-3 text-foreground font-body text-sm outline-none border border-border focus:border-gold transition-colors"
                    >
                      <option value="">Select budget range</option>
                      <option value="under-1m">Under D 1M</option>
                      <option value="1m-3m">D 1M - 3M</option>
                      <option value="3m-5m">D 3M - 5M</option>
                      <option value="5m-10m">D 5M - 10M</option>
                      <option value="above-10m">Above D 10M</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="font-body text-sm text-foreground mb-1 block">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    className="w-full bg-muted rounded-lg px-4 py-3 text-foreground font-body text-sm outline-none border border-border focus:border-gold transition-colors resize-none"
                    placeholder="Tell us about your requirements..."
                  />
                </div>
                <Button
                  variant="gold"
                  size="lg"
                  type="submit"
                  disabled={loading}
                >
                  <Send className="w-4 h-4" />{" "}
                  {loading ? "Sending..." : "Send Enquiry"}
                </Button>
              </form>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="bg-card rounded-xl p-8 shadow-luxury mb-8">
                <h3 className="font-display text-xl font-bold text-foreground mb-6">
                  Contact Information
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-emerald flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="font-body text-sm font-medium text-foreground">
                        Office Address
                      </p>
                      <p className="text-muted-foreground font-body text-sm leading-relaxed">
                        Office No. 301-21, DhanGuard Business Center
                        <br />
                        Khalid Bin Waleed Road
                        <br />
                        Mankhool, Dubai
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-emerald flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="font-body text-sm font-medium text-foreground flex items-center gap-2">
                        Phone & WhatsApp
                      </p>

                      <div className="flex flex-col gap-2 mt-1">
                        <div className="flex items-center gap-2 text-muted-foreground font-body text-sm">
                          <span>+971 58 825 1088</span>

                          <a
                            href="https://wa.me/971588251088"
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-gold transition-colors"
                          >
                            <WhatsAppIcon className="w-4 h-4 text-green-500" />
                          </a>
                          <a
                            href="tel:+971588251088"
                            className="hover:text-gold transition-colors"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground font-body text-sm">
                          <span>+971 58 153 0100</span>

                          <a
                            href="https://wa.me/971581530100"
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-gold transition-colors"
                          >
                            <WhatsAppIcon className="w-4 h-4 text-green-500" />
                          </a>

                          <a
                            href="tel:+971581530100"
                            className="hover:text-gold transition-colors"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground font-body text-sm">
                          <span>+91 76786 51405</span>
                          <a
                            href="https://wa.me/917678651405"
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-gold transition-colors"
                          >
                            <WhatsAppIcon className="w-4 h-4 text-green-500" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-emerald flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="font-body text-sm font-medium text-foreground">
                        Email
                      </p>
                      <a
                        href="mailto:info@omnisprop.com"
                        className="text-muted-foreground hover:text-gold font-body text-sm transition-colors"
                      >
                        info@omnisprop.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                variant="whatsapp"
                size="xl"
                className="w-full flex items-center gap-2"
                asChild
              >
                <a
                  href="https://wa.me/971588251088"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon className="w-5 h-5" /> Chat on WhatsApp
                </a>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
