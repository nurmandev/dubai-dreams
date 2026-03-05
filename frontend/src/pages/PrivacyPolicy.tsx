import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText, Scale, Globe } from "lucide-react";

const PrivacyPolicy = () => {
  const lastUpdated = "March 05, 2026";

  const sections = [
    {
      icon: Eye,
      title: "Information We Collect",
      content: `We collect information that you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us about a property. This may include your name, email address, phone number, and any property preferences you share. We also automatically collect certain technical information when you browse our platform, including your IP address and browsing behavior through cookies and similar technologies.`,
    },
    {
      icon: Lock,
      title: "How We Use Your Information",
      content: `Your data is used to provide and enhance our real estate services. Specifically, we use it to:
      • Facilitate property inquiries and viewings.
      • Send personalized investment opportunities and market updates.
      • Secure your account and prevent fraudulent activity.
      • Analyze platform usage to improve our user interface and features.
      • Comply with UAE legal and regulatory requirements for real estate transactions.`,
    },
    {
      icon: Shield,
      title: "Data Protection & Security",
      content: `We implement robust physical, technical, and administrative security measures designed to protect your personal information from unauthorized access, disclosure, or destruction. This includes end-to-end encryption for sensitive data and regular security audits of our infrastructure. However, please note that no method of transmission over the Internet is 100% secure.`,
    },
    {
      icon: Globe,
      title: "Sharing Your Information",
      content: `We do not sell your personal data. We may share your information with trusted partners only when necessary to fulfill your requests, such as:
      • Registered Developers for off-plan project inquiries.
      • Financial institutions for property financing applications.
      • Legal advisors for transaction processing.
      • Regulatory bodies like RERA or DLD when required by law.`,
    },
    {
      icon: Scale,
      title: "Your Rights & Choices",
      content: `You have the right to access, correct, or delete your personal information at any time. You can also opt-out of marketing communications by clicking the 'unsubscribe' link in our emails or by contacting our support team. For EU residents, we comply with relevant GDPR provisions regarding data portability and the right to be forgotten.`,
    },
    {
      icon: FileText,
      title: "Updates to This Policy",
      content: `We may update our Privacy Policy from time to time to reflect changes in our practices or the legal landscape. Any changes will be posted on this page with an updated 'Last Updated' date. We encourage you to review this policy periodically to stay informed about how we are protecting your privacy.`,
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
                At Omnis Properties, your privacy is a cornerstone of our
                service. This Privacy Policy explains how we collect, use, and
                safeguard your personal information as you interact with our
                platform and professionals across Dubai's real estate market.
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
