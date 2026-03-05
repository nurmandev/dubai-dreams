import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText, Scale, Globe } from "lucide-react";

const PrivacyPolicy = () => {
  const lastUpdated = "March 05, 2026";

  const sections = [
    {
      icon: Eye,
      title: "Data Minimization",
      content: `We believe in protecting your digital footprint. Unlike many platforms, we do not collect broad 'user data'. We only collect the specific information you voluntarily provide to facilitate a real estate inquiry or service. This is limited to your contact details (name, email, phone) and your stated property preferences. We do not track your activity outside of our platform or build broad behavioral profiles.`,
    },
    {
      icon: Lock,
      title: "Purpose-Driven Usage",
      content: `Your information is used strictly for the specific purpose it was provided. We use it to:
      • Connect you with the specific properties or developers you inquired about.
      • Send requested luxury market insights and investment opportunities.
      • Facilitate secure communication between you and our consultants.
      We do not use your data for automated marketing profiles or sell it to third-party data brokers.`,
    },
    {
      icon: Shield,
      title: "Focused Security",
      content: `Because we collect so little data, your risk is inherently minimized. What we do hold is protected by modern encryption and strict access controls. Our team follows a 'need-to-know' protocol, ensuring your contact details are only visible to the professionals handled your specific inquiry.`,
    },
    {
      icon: Globe,
      title: "Selective Sharing",
      content: `Sharing is restricted to the absolute essentials required to finalize a transaction or inquiry:
      • The specific Developer of a project you've expressed interest in.
      • Regulatory authorities (RERA/DLD) only when a formal transaction begins.
      We do not share your data with 'partner networks' for unrelated advertising.`,
    },
    {
      icon: Scale,
      title: "Your Privacy Rights",
      content: `You have full control. You can request to view, update, or permanently delete your contact information from our records at any time. As we do not store secondary or 'hidden' metadata, a deletion request results in a complete removal of your presence from our active databases.`,
    },
    {
      icon: FileText,
      title: "Policy Updates",
      content: `As we evolve, our commitment to collecting as little data as possible remains constant. Any refinements to our processes will be reflected here. We encourage you to check this page to see our continued dedication to your privacy.`,
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-20">
        <div className="h-64 md:h-80 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary" />
          <div className="absolute inset-0 bg-gradient-hero opacity-50" />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center px-4"
            >
              <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
                Privacy Policy
              </h1>
              <p className="text-gold font-body text-sm tracking-[0.2em] uppercase">
                Last Updated: {lastUpdated}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="prose prose-lg max-w-none text-muted-foreground font-body"
            >
              <p className="text-lg leading-relaxed mb-12">
                At Omnis Properties, we operate on a principle of transparency
                and minimalist data collection. This Privacy Policy outlines our
                commitment to your privacy, explaining why we only collect the
                absolute essentials necessary to connect you with Dubai's most
                exclusive real estate opportunities.
              </p>

              <div className="grid gap-12">
                {sections.map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="flex items-start gap-6">
                      <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                        <section.icon className="w-6 h-6 text-gold" />
                      </div>
                      <div>
                        <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                          {section.title}
                        </h2>
                        <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                          {section.content}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-20 p-8 rounded-2xl bg-card border border-border">
                <h3 className="font-display text-xl font-bold text-foreground mb-4">
                  Contact Our Privacy Officer
                </h3>
                <p className="mb-4">
                  If you have any questions or concerns about this policy or our
                  data practices, please do not hesitate to reach out to our
                  dedicated privacy team.
                </p>
                <div className="text-gold font-bold">
                  Email: privacy@omnisproperties.ae
                  <br />
                  Office: Suite 1205, Marina Plaza, Dubai Marina, UAE
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PrivacyPolicy;
