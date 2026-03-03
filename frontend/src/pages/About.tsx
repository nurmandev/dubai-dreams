import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import {
  Shield,
  Users,
  Target,
  Award,
  Home,
  Key,
  TrendingUp,
  Globe2,
  Building,
  CheckCircle2,
  Search,
  FileCheck,
  ShieldCheck,
  Linkedin,
  Mail,
} from "lucide-react";
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
              <p className="text-gold font-body text-sm tracking-[0.2em] uppercase mb-2">
                Our Story
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Redefining Real Estate Excellence
              </h2>
              <p className="text-muted-foreground font-body leading-relaxed mb-4">
                Omnis Properties LLC is a Dubai-based real estate company
                dedicated to connecting global investors and homebuyers with
                exceptional properties across the UAE. We specialize in off-plan
                investments, premium resale properties, and exclusive rentals.
              </p>
              <p className="text-muted-foreground font-body leading-relaxed mb-6">
                Our team brings deep market knowledge, strong developer
                relationships, and a client-first approach to every transaction.
                Whether you're a first-time buyer or a seasoned investor, we
                ensure a seamless experience from consultation to handover.
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
                <p className="text-primary-foreground/60 font-body text-sm">
                  Years Experience
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-gold font-body text-sm tracking-[0.2em] uppercase mb-2">
              Our Values
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              What Drives Us
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Integrity",
                desc: "Transparent dealings and honest advice at every step.",
              },
              {
                icon: Users,
                title: "Client-Centric",
                desc: "Your goals drive every decision we make.",
              },
              {
                icon: Target,
                title: "Precision",
                desc: "Matching you with properties that fit your exact criteria.",
              },
              {
                icon: Award,
                title: "Excellence",
                desc: "Setting the highest standards in Dubai real estate.",
              },
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
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground font-body text-sm">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-gold font-body text-sm tracking-[0.2em] uppercase mb-2">
              Our Approach
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">
              Your Journey to Excellence
            </h2>
            <p className="text-muted-foreground font-body text-lg">
              We've refined a seamless four-step process designed to take you
              from initial curiosity to ultimate investment success.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-border -translate-y-1/2 z-0" />
            {[
              {
                icon: Search,
                step: "01",
                title: "Discovery",
                desc: "We begin by understanding your unique requirements, budget, and lifestyle aspirations.",
              },
              {
                icon: CheckCircle2,
                step: "02",
                title: "Selection",
                desc: "Our experts curate a bespoke shortlist of properties that align perfectly with your goals.",
              },
              {
                icon: FileCheck,
                step: "03",
                title: "Acquisition",
                desc: "We handle all negotiations and legal complexities to ensure a seamless transaction.",
              },
              {
                icon: ShieldCheck,
                step: "04",
                title: "Succession",
                desc: "Our relationship continues with property management and portfolio optimization services.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative z-10 bg-white p-6 text-center group"
              >
                <div className="w-16 h-16 rounded-full bg-background border-2 border-gold/20 flex items-center justify-center mx-auto mb-6 group-hover:border-gold transition-colors">
                  <item.icon className="w-8 h-8 text-gold" />
                </div>
                <p className="text-gold font-display text-sm font-bold mb-2">
                  {item.step}
                </p>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-20 lg:py-28 bg-white border-y border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-gold font-body text-sm tracking-[0.2em] uppercase mb-2">
              Our Expertise
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Comprehensive Real Estate Services
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Home,
                title: "Property Sales",
                desc: "Expert guidance in buying and selling premium properties across Dubai's most sought-after communities.",
              },
              {
                icon: Key,
                title: "Luxury Rentals",
                desc: "Curated selection of high-end long term and short term rental properties tailored to your lifestyle.",
              },
              {
                icon: Building,
                title: "Property Management",
                desc: "End-to-end management services ensuring your investment is protected and yields maximum returns.",
              },
            ].map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-8 border border-border shadow-sm hover:shadow-luxury transition-all group"
              >
                <div className="w-16 h-16 rounded-xl bg-muted/50 flex items-center justify-center mb-6 group-hover:bg-gold/10 transition-colors">
                  <service.icon className="w-8 h-8 text-gold" />
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                  {service.title}
                </h3>
                <p className="text-muted-foreground font-body leading-relaxed">
                  {service.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="py-20 lg:py-28 bg-card">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-gold font-body text-sm tracking-[0.2em] uppercase mb-2">
              The Experts
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Meet Our Visionaries
            </h2>
            <p className="text-muted-foreground font-body max-w-2xl mx-auto">
              Our leadership team combines decades of international real estate
              experience with deep roots in the Dubai market.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                name: "Alexander Wright",
                role: "Chief Executive Officer",
                image: "/images/team-ceo.png",
                bio: "A visionary leader with 20+ years in global luxury real estate.",
              },
              {
                name: "Sarah Chen",
                role: "Head of Investment",
                image: "/images/team-investment.png",
                bio: "Specializing in high-yield off-plan portfolios and market analysis.",
              },
              {
                name: "Marcus Thorne",
                role: "Client Relations Manager",
                image: "/images/team-manager.png",
                bio: "Dedicated to providing a bespoke experience for every client.",
              },
            ].map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-2xl mb-6 shadow-luxury aspect-square">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-6">
                    <div className="flex gap-4">
                      <a
                        href="#"
                        className="w-10 h-10 rounded-full bg-gold/90 flex items-center justify-center text-primary hover:bg-white transition-colors"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                      <a
                        href="#"
                        className="w-10 h-10 rounded-full bg-gold/90 flex items-center justify-center text-primary hover:bg-white transition-colors"
                      >
                        <Mail className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-1 text-center">
                  {member.name}
                </h3>
                <p className="text-gold font-body text-sm uppercase tracking-wider mb-3 text-center">
                  {member.role}
                </p>
                <p className="text-muted-foreground font-body text-center text-sm leading-relaxed px-4">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Invest In Dubai */}
      <section className="py-20 lg:py-28 bg-primary text-primary-foreground relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "url('/images/pattern-bg.png')" }}
        />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-gold font-body text-sm tracking-[0.2em] uppercase mb-2">
                Global Hub
              </p>
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
                Why Invest in Dubai?
              </h2>
              <p className="font-body text-lg text-primary-foreground/80 mb-8 leading-relaxed">
                Dubai represents one of the world's most dynamic and secure real
                estate markets, offering unmatched opportunities for capital
                appreciation and rental yields.
              </p>
              <ul className="space-y-6">
                {[
                  {
                    icon: TrendingUp,
                    title: "High ROI",
                    desc: "Enjoy some of the highest rental yields globally, averaging 6-8%.",
                  },
                  {
                    icon: Shield,
                    title: "Tax-Free Investment",
                    desc: "0% property tax and 0% capital gains tax on your investments.",
                  },
                  {
                    icon: Globe2,
                    title: "Strategic Location",
                    desc: "Connecting East and West with world-class infrastructure and safety.",
                  },
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-14 h-14 shrink-0 rounded-full bg-gold/10 flex items-center justify-center border border-gold/20">
                      <item.icon className="w-6 h-6 text-gold" />
                    </div>
                    <div>
                      <h4 className="font-display text-xl font-bold mb-2">
                        {item.title}
                      </h4>
                      <p className="font-body text-primary-foreground/70">
                        {item.desc}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden aspect-[4/5] lg:aspect-auto lg:h-[600px] border border-white/10"
            >
              <img
                src="/images/hero-dubai.jpg"
                alt="Dubai Marina Skyline"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent flex items-end p-8">
                <div>
                  <div className="inline-block bg-gold px-3 py-1 rounded-full text-primary font-bold text-xs uppercase mb-3 shadow-lg">
                    Market Insight
                  </div>
                  <p className="font-display text-2xl md:text-3xl font-bold text-white shadow-sm">
                    +9.8% Average Capital Appreciation
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-primary rounded-[2rem] p-12 md:p-20 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl -ml-32 -mb-32" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-8">
                Ready to Begin Your <br />
                <span className="text-gold">Dubai Dream?</span>
              </h2>
              <p className="text-primary-foreground/70 font-body text-lg mb-10">
                Whether you're looking for a luxury residence or a high-yield
                investment, our team is here to guide you every step of the way.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="gold" size="xl" asChild>
                  <Link to="/properties">Explore Properties</Link>
                </Button>
                <Button
                  variant="outline"
                  size="xl"
                  className="border-white/20 text-white hover:bg-white/10"
                  asChild
                >
                  <Link to="/contact">Book a Consultation</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
