import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Shield, Users, Target, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative pt-20">
        <div className="h-80 md:h-96 relative overflow-hidden">
          <img
            src="/images/about-dubai.jpg"
            alt="Dubai skyline"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <p className="text-gold font-body text-sm tracking-[0.3em] uppercase mb-3">
                About Omnis Properties
              </p>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground">
                Your Gateway to Dubai
              </h1>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-gold font-body text-sm tracking-[0.2em] uppercase mb-2">Our Story</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Redefining Real Estate Excellence
              </h2>
              <p className="text-muted-foreground font-body leading-relaxed mb-4">
                Omnis Properties LLC is a Dubai-based real estate company dedicated to connecting
                global investors and homebuyers with exceptional properties across the UAE. We
                specialize in off-plan investments, premium resale properties, and exclusive rentals.
              </p>
              <p className="text-muted-foreground font-body leading-relaxed mb-6">
                Our team brings deep market knowledge, strong developer relationships, and a
                client-first approach to every transaction. Whether you're a first-time buyer or a
                seasoned investor, we ensure a seamless experience from consultation to handover.
              </p>
              <Button variant="gold" size="lg" asChild>
                <Link to="/contact">Get In Touch</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="/images/property-villa.jpg"
                alt="Luxury interior"
                className="rounded-xl shadow-luxury w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary rounded-xl p-6 shadow-luxury">
                <p className="text-gold font-display text-3xl font-bold">10+</p>
                <p className="text-primary-foreground/60 font-body text-sm">Years Experience</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-gold font-body text-sm tracking-[0.2em] uppercase mb-2">Our Values</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              What Drives Us
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: "Integrity", desc: "Transparent dealings and honest advice at every step." },
              { icon: Users, title: "Client-Centric", desc: "Your goals drive every decision we make." },
              { icon: Target, title: "Precision", desc: "Matching you with properties that fit your exact criteria." },
              { icon: Award, title: "Excellence", desc: "Setting the highest standards in Dubai real estate." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-background rounded-xl p-8 shadow-luxury text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-emerald mb-4">
                  <item.icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground font-body text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
