import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import {
  FileText,
  Gavel,
  Scale,
  AlertCircle,
  HelpCircle,
  ShieldAlert,
} from "lucide-react";

const TermsConditions = () => {
  const lastUpdated = "March 05, 2026";

  const sections = [
    {
      icon: Gavel,
      title: "1. Acceptance of Terms",
      content: `By accessing and using the Dubai Dreams Showcase platform (the "Service"), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our platform. These terms apply to all visitors, users, and others who access or use the Service.`,
    },
    {
      icon: Scale,
      title: "2. Real Estate Disclaimer",
      content: `All property information, including prices, floor plans, and availability, is provided for informational purposes only. While we strive for accuracy, Omnis Properties LLC does not guarantee the completeness or reliability of any listings. 
      
      Off-plan project timelines and designs are subject to change by the respective developers (e.g., Emaar, Nakheel, Damac). Investment in real estate involves risk; we recommend independent financial and legal advice before committing to any transaction.`,
    },
    {
      icon: ShieldAlert,
      title: "3. User Conduct & KYC",
      content: `In compliance with UAE anti-money laundering (AML) and Know Your Customer (KYC) regulations, users may be required to provide valid documentation (e.g., Passport copy, Emirates ID) to facilitate property transactions. Users agree to provide truthful and accurate information and are prohibited from:
      • Misrepresenting their identity or affiliation.
      • Using the platform for any illegal or fraudulent activities.
      • Attempting to interfere with the proper functioning of the Service.`,
    },
    {
      icon: AlertCircle,
      title: "4. Intellectual Property",
      content: `The Service and its original content (excluding developer logos which are property of their respective owners), features, and functionality are and will remain the exclusive property of Omnis Properties LLC. Our brand assets, custom designs, and professional photography may not be used without prior written consent.`,
    },
    {
      icon: HelpCircle,
      title: "5. Limitation of Liability",
      content: `To the maximum extent permitted by UAE law, Omnis Properties LLC shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service. We do not act as a bank or financial lender; all financing arrangements are between the user and their chosen financial institution.`,
    },
    {
      icon: FileText,
      title: "6. Governing Law",
      content: `These Terms shall be governed and construed in accordance with the laws of the United Arab Emirates and the Emirate of Dubai. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the Courts of Dubai.`,
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
                Terms & Conditions
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
                Welcome to Omnis Properties. These Terms and Conditions govern
                your relationship with our platform and services. By engaging
                with our listings and expert consultants, you acknowledge the
                regulatory framework of the Dubai Real Estate market and agree
                to adhere to these standards.
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
                  Legal Inquiries
                </h3>
                <p className="mb-4">
                  For any legal concerns or formal inquiries regarding these
                  terms, please contact our legal department at the following
                  address:
                </p>
                <div className="text-gold font-bold">
                  Email: legal@omnisproperties.ae
                  <br />
                  Office: Suite 1205, Marina Plaza, Dubai Marina, UAE
                  <br />
                  Registration: Omnis Properties LLC (DED License #112233)
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TermsConditions;
