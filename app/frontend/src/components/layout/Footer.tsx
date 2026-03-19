import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-warm-walnut-dark text-primary-foreground mt-[50px]">
      <div className="container py-10 lg:py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand + Address */}
          <div className="space-y-4">
            <Link to="/" className="font-brand text-2xl font-semibold text-primary-foreground tracking-wide">
              Casa Ceylon
            </Link>
            <p className="text-sm leading-relaxed text-primary-foreground/70 max-w-xs">
              Elegant furniture for modern living. Crafted with care, designed for comfort.
            </p>
            <div className="space-y-2">
              <p className="flex items-start gap-2 text-sm text-primary-foreground/70">
                <MapPin size={14} className="mt-0.5 flex-shrink-0 text-primary-foreground/90" />
                <span>42 Galle Road, Colombo 03, Sri Lanka</span>
              </p>
              <p className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <Phone size={14} className="flex-shrink-0 text-primary-foreground/90" />
                <span>+94 11 234 5678</span>
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-display text-xs font-semibold uppercase tracking-widest text-primary-foreground mb-4">
              Browse
            </h4>
            <nav className="flex flex-col gap-2">
              {[
                { label: "Home", to: "/" },
                { label: "Shop", to: "/shop" },
                { label: "Inspiration", to: "/inspiration" },
                { label: "About", to: "/about" },
                { label: "FAQ", to: "/faq" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                   className="text-sm text-primary-foreground/60 transition-colors hover:text-primary-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="font-display text-xs font-semibold uppercase tracking-widest text-primary-foreground mb-4">
              Support
            </h4>
            <nav className="flex flex-col gap-2">
              <Link
                to="/about#contact"
                className="text-sm text-primary-foreground/60 transition-colors hover:text-primary-foreground"
              >
                Contact Us
              </Link>
              <Link
                to="/faq"
                className="text-sm text-primary-foreground/60 transition-colors hover:text-primary-foreground"
              >
                FAQ
              </Link>
              <span className="text-sm text-primary-foreground/60 cursor-pointer transition-colors hover:text-primary-foreground">
                Privacy Policy
              </span>
              <span className="text-sm text-primary-foreground/60 cursor-pointer transition-colors hover:text-primary-foreground">
                Terms &amp; Conditions
              </span>
            </nav>
          </div>

          <div>
            <h4 className="font-display text-xs font-semibold uppercase tracking-widest text-primary-foreground mb-4">
              Follow Us
            </h4>
            <div className="flex gap-2">
              {[
                { Icon: Instagram, label: "Instagram" },
                { Icon: Facebook, label: "Facebook" },
                { Icon: Twitter, label: "Twitter" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-primary-foreground/20 text-primary-foreground/70 transition-all hover:border-primary-foreground hover:bg-primary-foreground hover:text-primary"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="mt-8 pt-6 border-t border-primary-foreground/10">
          <p className="text-xs text-primary-foreground/50">
            © {new Date().getFullYear()} Casa Ceylon. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
