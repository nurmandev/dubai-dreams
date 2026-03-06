import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";

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
                <Twitter className="w-5 h-5" />
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
                  Business Bay, Dubai, UAE
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-gold shrink-0 mt-1" />
                <div className="flex flex-col gap-1">
                  <a
                    href="https://wa.me/971588251088"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary-foreground/60 hover:text-gold text-sm font-body transition-colors flex items-center gap-1.5"
                  >
                    +971 58 825 1088{" "}
                    <WhatsAppIcon className="w-4 h-4 text-green-500" />
                  </a>
                  <a
                    href="tel:+971581530100"
                    className="text-primary-foreground/60 hover:text-gold text-sm font-body transition-colors"
                  >
                    +971 58 153 0100 (UAE)
                  </a>
                  <a
                    href="https://wa.me/917678651405"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary-foreground/60 hover:text-gold text-sm font-body transition-colors mt-1 flex items-center gap-1.5"
                  >
                    +91 76786 51405 (India{" "}
                    <WhatsAppIcon className="w-4 h-4 text-green-500 inline" />)
                  </a>
                </div>
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
