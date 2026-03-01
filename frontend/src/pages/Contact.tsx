import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", budget: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Enquiry Submitted!", description: "Our team will get back to you shortly." });
    setForm({ name: "", email: "", phone: "", message: "", budget: "" });
  };

  return (
    <Layout>
      <section className="pt-20 bg-primary">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-gold font-body text-sm tracking-[0.3em] uppercase mb-2">Get In Touch</p>
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
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="font-body text-sm text-foreground mb-1 block">Full Name *</label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-muted rounded-lg px-4 py-3 text-foreground font-body text-sm outline-none border border-border focus:border-gold transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="font-body text-sm text-foreground mb-1 block">Email *</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-muted rounded-lg px-4 py-3 text-foreground font-body text-sm outline-none border border-border focus:border-gold transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="font-body text-sm text-foreground mb-1 block">Phone *</label>
                    <input
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full bg-muted rounded-lg px-4 py-3 text-foreground font-body text-sm outline-none border border-border focus:border-gold transition-colors"
                      placeholder="+971 XX XXX XXXX"
                    />
                  </div>
                  <div>
                    <label className="font-body text-sm text-foreground mb-1 block">Budget (Optional)</label>
                    <select
                      value={form.budget}
                      onChange={(e) => setForm({ ...form, budget: e.target.value })}
                      className="w-full bg-muted rounded-lg px-4 py-3 text-foreground font-body text-sm outline-none border border-border focus:border-gold transition-colors"
                    >
                      <option value="">Select budget range</option>
                      <option value="under-1m">Under AED 1M</option>
                      <option value="1m-3m">AED 1M - 3M</option>
                      <option value="3m-5m">AED 3M - 5M</option>
                      <option value="5m-10m">AED 5M - 10M</option>
                      <option value="above-10m">Above AED 10M</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="font-body text-sm text-foreground mb-1 block">Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-muted rounded-lg px-4 py-3 text-foreground font-body text-sm outline-none border border-border focus:border-gold transition-colors resize-none"
                    placeholder="Tell us about your requirements..."
                  />
                </div>
                <Button variant="gold" size="lg" type="submit">
                  <Send className="w-4 h-4" /> Send Enquiry
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
                <h3 className="font-display text-xl font-bold text-foreground mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-emerald flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="font-body text-sm font-medium text-foreground">Office Address</p>
                      <p className="text-muted-foreground font-body text-sm">Business Bay, Dubai, UAE</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-emerald flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="font-body text-sm font-medium text-foreground">Phone</p>
                      <a href="tel:+971000000000" className="text-muted-foreground hover:text-gold font-body text-sm transition-colors">
                        +971 00 000 0000
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-emerald flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="font-body text-sm font-medium text-foreground">Email</p>
                      <a href="mailto:info@omnisproperties.ae" className="text-muted-foreground hover:text-gold font-body text-sm transition-colors">
                        info@omnisproperties.ae
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <Button variant="whatsapp" size="xl" className="w-full" asChild>
                <a href="https://wa.me/971000000000" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
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
