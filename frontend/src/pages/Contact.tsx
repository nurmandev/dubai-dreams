import Layout from "@/components/Layout";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { countries } from "@/data/countries";
import { CountryCodeSelector } from "@/components/CountryCodeSelector";


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
