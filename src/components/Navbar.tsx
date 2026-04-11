import { Link, useLocation } from "react-router-dom";
import { Trophy, Users, BarChart3, Image as ImageIcon, Newspaper, Heart, ShieldCheck, Menu, X, ArrowRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/button";
import { motion } from "motion/react";

const navItems = [
  { name: "Home", path: "/", icon: Trophy },
  { name: "Dashboard", path: "/dashboard", icon: BarChart3 },
  { name: "Team", path: "/team", icon: Users },
  { name: "Performance", path: "/performance", icon: BarChart3 },
  { name: "Gallery", path: "/gallery", icon: ImageIcon },
  { name: "News", path: "/news", icon: Newspaper },
  { name: "Donate", path: "/donate", icon: Heart },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-primary p-1.5 transform group-hover:rotate-12 transition-transform">
              <ShieldCheck className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-black text-xl tracking-tighter italic">OLODO</span>
              <span className="font-black text-xs tracking-[0.3em] text-primary">HOT STARS</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-primary relative py-2",
                  location.pathname === item.path 
                    ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary" 
                    : "text-muted-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
            <div className="h-4 w-[1px] bg-white/10 mx-2" />
            <Link to="/admin">
              <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-primary-foreground">
                ADMIN
              </Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-primary" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden fixed inset-0 top-20 z-50 bg-black p-8 space-y-8"
        >
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center justify-between text-4xl font-black italic uppercase tracking-tighter",
                location.pathname === item.path ? "text-primary" : "text-white"
              )}
            >
              {item.name}
              <ArrowRight className={cn("h-8 w-8", location.pathname === item.path ? "opacity-100" : "opacity-20")} />
            </Link>
          ))}
          <div className="pt-8 border-t border-white/10">
            <Link to="/admin" onClick={() => setIsOpen(false)}>
              <Button className="w-full h-16 bg-primary text-primary-foreground font-black italic text-xl">
                ADMIN PANEL
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
