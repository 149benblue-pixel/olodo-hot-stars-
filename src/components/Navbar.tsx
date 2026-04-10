import { Link, useLocation } from "react-router-dom";
import { Trophy, Users, BarChart3, Image as ImageIcon, Newspaper, Heart, ShieldCheck, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/button";

const navItems = [
  { name: "Home", path: "/", icon: Trophy },
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
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary p-1 rounded">
              <ShieldCheck className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl tracking-tighter">OLODO HOT STARS</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary flex items-center gap-2",
                  location.pathname === item.path ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
            <Link to="/admin">
              <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                Admin
              </Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t bg-background px-4 py-4 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center gap-3 text-lg font-medium py-2",
                location.pathname === item.path ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
          <Link to="/admin" onClick={() => setIsOpen(false)} className="block pt-2">
            <Button className="w-full bg-primary text-primary-foreground">Admin Panel</Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
