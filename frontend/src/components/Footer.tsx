import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <img src="/logo.png" alt="OMNIS" className="h-12 w-auto" />
            </Link>
            <p className="text-primary-foreground/60 font-body text-sm leading-relaxed mb-6">
              Your trusted partner in Dubai's premium real estate market. We
              connect investors and homebuyers with exceptional properties.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold text-gold mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                {
                  label: "Off-Plan Properties",
                  path: "/properties?category=off-plan",
                },
                {
                  label: "Resale Properties",
                  path: "/properties?category=secondary",
                },
                { label: "Rentals", path: "/properties?category=rental" },
                { label: "About Us", path: "/about" },
                { label: "Blog", path: "/blog" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-primary-foreground/60 hover:text-gold transition-colors text-sm font-body"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold text-gold mb-4">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold mt-1 shrink-0" />
                <span className="text-primary-foreground/60 text-sm font-body">
                  Business Bay, Dubai, UAE
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <a
                  href="tel:+971000000000"
                  className="text-primary-foreground/60 hover:text-gold text-sm font-body transition-colors"
                >
                  +971 00 000 0000
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <a
                  href="mailto:info@omnisproperties.ae"
                  className="text-primary-foreground/60 hover:text-gold text-sm font-body transition-colors"
                >
                  info@omnisproperties.ae
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display text-lg font-semibold text-gold mb-4">
              Legal
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/privacy"
                  className="text-primary-foreground/60 hover:text-gold transition-colors text-sm font-body"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-primary-foreground/60 hover:text-gold transition-colors text-sm font-body"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-emerald-light/20 mt-12 pt-8 text-center">
          <p className="text-primary-foreground/40 text-sm font-body">
            © {new Date().getFullYear()} Omnis Properties LLC. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
