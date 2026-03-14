import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Inspiration", to: "/inspiration" },
  { label: "About", to: "/about" },
  { label: "FAQ", to: "/faq" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authUser, setAuthUser] = useState<{ name?: string; email: string } | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const syncAuthUser = () => {
    const raw = localStorage.getItem("authUser");
    try {
      const parsed = raw ? JSON.parse(raw) : null;
      setAuthUser(parsed);
    } catch {
      setAuthUser(null);
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    syncAuthUser();

    const onStorage = (event: StorageEvent) => {
      if (event.key === "authUser") {
        syncAuthUser();
      }
    };

    const onAuthChanged = () => syncAuthUser();

    window.addEventListener("storage", onStorage);
    window.addEventListener("auth-changed", onAuthChanged as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth-changed", onAuthChanged as EventListener);
    };
  }, []);

  useEffect(() => {
    syncAuthUser();
  }, [location.pathname]);

  const isTransparent = isHome && !scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isTransparent
          ? "bg-transparent border-b border-transparent"
          : "bg-background/95 backdrop-blur-md border-b border-border/40 shadow-sm"
      }`}
    >
      <div className="container flex h-16 items-center justify-between gap-6 lg:h-[4.5rem]">
        {/* Brand */}
        <Link
          to="/"
          className={`flex-shrink-0 text-[1.55rem] font-bold tracking-[0.01em] transition-colors duration-300 ${
            isTransparent ? "text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]" : "text-foreground"
          }`}
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Casa Ceylon
        </Link>

        {/* Center nav — desktop */}
        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors duration-300 ${
                isTransparent
                  ? "text-white/95 hover:text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Auth — desktop */}
          <div className="hidden items-center gap-1 lg:flex">
            {authUser ? (
              <Link
                to="/"
                className={`flex items-center gap-2 rounded-full px-2.5 py-1.5 text-[13px] font-semibold tracking-wide transition-colors duration-300 ${
                  isTransparent
                    ? "text-white/95 hover:text-white hover:bg-white/10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
                    : "text-foreground/70 hover:text-foreground hover:bg-accent"
                }`}
                aria-label="Profile"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(28_35%_32%)] text-white text-sm font-semibold">
                  <User size={16} />
                </span>
                <span className="truncate max-w-[120px] text-left">{authUser.name || authUser.email}</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[13px] font-semibold tracking-wide transition-colors duration-300 ${
                    isTransparent
                      ? "text-white/95 hover:text-white hover:bg-white/10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
                      : "text-foreground/70 hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <User size={14} />
                  Login
                </Link>
                <span className={`text-xs ${isTransparent ? "text-white/25" : "text-border"}`}>|</span>
                <Link
                  to="/register"
                  className={`rounded-md px-2.5 py-1.5 text-[13px] font-semibold tracking-wide transition-colors duration-300 ${
                    isTransparent
                      ? "text-white/95 hover:text-white hover:bg-white/10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
                      : "text-foreground/70 hover:text-foreground hover:bg-accent"
                  }`}
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Cart */}
          <Link
            to="/cart"
            className={`relative rounded-full p-2 transition-colors duration-300 ${
              isTransparent
                ? "text-white/95 hover:text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
                : "text-foreground/70 hover:text-foreground"
            }`}
          >
            <ShoppingBag size={19} />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[hsl(28_35%_32%)] text-[10px] font-semibold text-white">
              3
            </span>
          </Link>

          {/* Try in Your Room — rightmost */}
          <Button
            onClick={() => navigate("/designer")}
            className="hidden text-[12px] font-medium uppercase tracking-wider lg:inline-flex bg-[hsl(28_35%_32%)] hover:bg-[hsl(28_35%_26%)] text-white h-9 px-4 rounded-sm"
            size="sm"
          >
            Try in Your Room
          </Button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`rounded-full p-2 lg:hidden transition-colors ${
              isTransparent ? "text-white" : "text-foreground/70"
            }`}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t border-border/40 bg-background lg:hidden">
          <nav className="container flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <Button
              onClick={() => { navigate("/designer"); setMobileOpen(false); }}
              className="mt-2 bg-[hsl(28_35%_32%)] hover:bg-[hsl(28_35%_26%)] text-white"
              size="sm"
            >
              Try in Your Room
            </Button>
            <div className="mt-2 flex gap-2">
              {authUser ? (
                <Button
                  onClick={() => { navigate("/"); setMobileOpen(false); }}
                  size="sm"
                  className="flex-1 bg-[hsl(28_35%_32%)] hover:bg-[hsl(28_35%_26%)] text-white"
                >
                  <User size={14} className="mr-2" /> Profile
                </Button>
              ) : (
                <>
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link to="/login" onClick={() => setMobileOpen(false)}>Login</Link>
                  </Button>
                  <Button asChild size="sm" className="flex-1 bg-[hsl(28_35%_32%)] hover:bg-[hsl(28_35%_26%)] text-white">
                    <Link to="/register" onClick={() => setMobileOpen(false)}>Register</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
