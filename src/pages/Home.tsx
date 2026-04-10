import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Button } from "@/src/components/ui/button";
import { Trophy, Calendar, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { db } from "@/src/firebase";
import { collection, query, orderBy, limit, onSnapshot, where } from "firebase/firestore";
import { Match, NewsItem } from "@/src/types";

export default function Home() {
  const [nextMatch, setNextMatch] = useState<Match | null>(null);
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch next upcoming match
    const qMatches = query(
      collection(db, "matches"),
      where("status", "==", "upcoming"),
      orderBy("date", "asc"),
      limit(1)
    );
    const unsubMatches = onSnapshot(qMatches, (snapshot) => {
      if (!snapshot.empty) {
        setNextMatch({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Match);
      }
      setLoading(false);
    });

    // Fetch 3 latest news items
    const qNews = query(
      collection(db, "news"),
      orderBy("date", "desc"),
      limit(3)
    );
    const unsubNews = onSnapshot(qNews, (snapshot) => {
      setLatestNews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsItem)));
    });

    return () => {
      unsubMatches();
      unsubNews();
    };
  }, []);

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2000&auto=format&fit=crop" 
            alt="Football Stadium" 
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
        
        <div className="container relative z-10 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <ShieldCheck className="h-4 w-4" />
              Official Club Website
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 italic">
              OLODO <span className="text-primary">HOT STARS</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 font-mono">
              #FutaSikuZote
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/team">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8">
                  Meet the Team
                </Button>
              </Link>
              <Link to="/donate">
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 text-lg px-8">
                  Support Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Next Match Highlight */}
      {nextMatch && (
        <section className="container px-4">
          <div className="bg-card border rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Trophy className="h-40 w-40 text-primary" />
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-2">Next Match</h2>
                <p className="text-3xl font-bold mb-4">
                  {nextMatch.isHome ? "Olodo Hot Stars" : nextMatch.opponent} vs. {nextMatch.isHome ? nextMatch.opponent : "Olodo Hot Stars"}
                </p>
                <div className="flex flex-wrap gap-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> {nextMatch.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4" /> {nextMatch.competition}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-4">
                <div className="text-5xl font-black italic text-primary">{nextMatch.time || "TBD"}</div>
                <p className="text-sm font-medium text-muted-foreground uppercase">Local Time</p>
              </div>
              
              <Link to="/performance">
                <Button variant="secondary" className="group">
                  Match Details <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Latest News Preview */}
      <section className="container px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold italic">LATEST NEWS</h2>
          <Link to="/news" className="text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestNews.map((item) => (
            <motion.div 
              key={item.id}
              whileHover={{ y: -5 }}
              className="group cursor-pointer"
            >
              <Link to="/news">
                <div className="aspect-video rounded-2xl overflow-hidden mb-4 border border-white/5">
                  <img 
                    src={item.imageUrl || `https://picsum.photos/seed/${item.id}/800/450`} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-bold text-primary uppercase">{item.category}</div>
                  <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {item.content}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
          {!loading && latestNews.length === 0 && (
            <p className="text-muted-foreground col-span-full text-center py-12">No news updates yet.</p>
          )}
        </div>
      </section>

      {/* Club Description */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container px-4 text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-black italic mb-6">MORE THAN A CLUB</h2>
          <p className="text-xl leading-relaxed opacity-90">
            Olodo Hot Stars is a community-driven football club dedicated to nurturing local talent and promoting the spirit of sportsmanship. Founded with a passion for the beautiful game, we strive for excellence on and off the pitch.
          </p>
        </div>
      </section>
    </div>
  );
}
