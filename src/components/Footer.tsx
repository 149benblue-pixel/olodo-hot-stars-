import { Facebook, Mail, Phone, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-card mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">OLODO HOT STARS</h3>
            <p className="text-muted-foreground">
              Empowering talent, building stars. Join us in our journey to football excellence.
            </p>
            <p className="mt-4 font-mono text-sm text-primary">#FutaSikuZote</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <a href="mailto:info@olodohotstars.com" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-4 w-4" /> info@olodohotstars.com
              </a>
              <a href="tel:+254700000000" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Phone className="h-4 w-4" /> +254 700 000 000
              </a>
              <a href="https://wa.me/254700000000" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle className="h-4 w-4" /> WhatsApp Us
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all">
                <Facebook className="h-5 w-5" />
              </a>
              {/* Add other social icons as needed */}
            </div>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Olodo Hot Stars Football Club. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
