import { Facebook, Mail, Phone, MessageCircle, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black mt-20">
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-primary p-1.5">
                <ShieldCheck className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-black text-xl tracking-tighter italic">OLODO</span>
                <span className="font-black text-xs tracking-[0.3em] text-primary">HOT STARS</span>
              </div>
            </div>
            <p className="text-muted-foreground max-w-sm font-medium leading-relaxed">
              Empowering talent, building stars. Join us in our journey to football excellence and community development.
            </p>
            <p className="mt-6 font-black italic text-2xl text-primary tracking-tighter">#FUTASIKUZOTE</p>
          </div>
          
          <div>
            <h4 className="font-black italic uppercase tracking-widest text-xs mb-6 text-white">Contact</h4>
            <div className="space-y-4">
              <a href="mailto:info@olodohotstars.com" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
                <Mail className="h-4 w-4" /> info@olodohotstars.com
              </a>
              <a href="tel:+254716773610" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
                <Phone className="h-4 w-4" /> +254 716 773 610
              </a>
              <a href="https://wa.me/254790244196" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
                <MessageCircle className="h-4 w-4" /> WhatsApp Us
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-black italic uppercase tracking-widest text-xs mb-6 text-white">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="p-3 bg-white/5 hover:bg-primary hover:text-primary-foreground transition-all">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/5 mt-20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <p>© {new Date().getFullYear()} Olodo Hot Stars Football Club.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-primary">Privacy Policy</a>
            <a href="#" className="hover:text-primary">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
