import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/60 bg-warm-cream">
      <div className="container py-12 lg:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand + Address */}
          <div className="space-y-3">
            <Link to="/" className="font-brand text-2xl font-semibold text-foreground">
              Casa Ceylon
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Elegant furniture for modern living. Crafted with care, designed for comfort.
            </p>
            <div className="space-y-2 pt-1">
              <p className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin size={15} className="mt-0.5 flex-shrink-0 text-accent" />
                42 Galle Road, Colombo 03, Sri Lanka
              </p>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone size={15} className="flex-shrink-0 text-accent" />
                +94 11 234 5678
              </p>
            </div>
          </div>

          {/* Browse */}
          <div className="space-y-3">
            <h4 className="font-display text-lg font-semibold text-foreground">Browse</h4>
            <nav className="flex flex-col gap-2">
              {[
                { label: "Home", to: "/" },
                { label: "Shop", to: "/shop" },
                { label: "Inspiration", to: "/inspiration" },
                { label: "About", to: "/about" },
                { label: "FAQ", to: "/faq" },
              ].map((link) => (
                <Link key={link.to} to={link.to} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h4 className="font-display text-lg font-semibold text-foreground">Support</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/about#contact" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Contact Us
              </Link>
              <Link to="/faq" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                FAQ
              </Link>
              <span className="text-sm text-muted-foreground">Privacy Policy</span>
              <span className="text-sm text-muted-foreground">Terms &amp; Conditions</span>
            </nav>
          </div>

          {/* Social */}
          <div className="space-y-3">
            <h4 className="font-display text-lg font-semibold text-foreground">Follow Us</h4>
            <div className="flex gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border/60 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Casa Ceylon. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
