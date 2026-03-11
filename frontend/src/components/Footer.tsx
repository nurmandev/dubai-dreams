import { Link } from "react-router-dom";
import { WhatsAppIcon } from "./icons/WhatsAppIcon";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";


const XIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

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
            <div className="flex items-center gap-4">
              <a
                href="https://www.facebook.com/Omnisprops/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-primary-foreground/60 hover:bg-gold hover:text-primary transition-all duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/omnispropertiesdubai/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-primary-foreground/60 hover:bg-gold hover:text-primary transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://x.com/OmnisProperties"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-primary-foreground/60 hover:bg-gold hover:text-primary transition-all duration-300"
              >
                <XIcon className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/omnis-properties-ba3648323/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-primary-foreground/60 hover:bg-gold hover:text-primary transition-all duration-300"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
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
                { label: "Our Services", path: "/services" },
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
                  Office No. 301-21, DhanGuard Business Center
                  <br />
                  Khalid Bin Waleed Road
                  <br />
                  Mankhool, Dubai
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-gold shrink-0 mt-1" />
                <div className="flex flex-col gap-2 mt-0.5">
                  <div className="flex items-center gap-2 text-primary-foreground/60 font-body text-sm">
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
                  <div className="flex items-center gap-2 text-primary-foreground/60 font-body text-sm">
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
                  <div className="flex items-center gap-2 text-primary-foreground/60 font-body text-sm">
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
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <a
                  href="mailto:info@omnisprop.com"
                  className="text-primary-foreground/60 hover:text-gold text-sm font-body transition-colors"
                >
                  info@omnisprop.com
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
                  to="/privacy-policy"
                  className="text-primary-foreground/60 hover:text-gold transition-colors text-sm font-body"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-conditions"
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
