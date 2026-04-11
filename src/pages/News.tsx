import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent } from "@/src/components/ui/card";
import { Calendar, ArrowRight, Loader2 } from "lucide-react";
import { NewsItem } from "@/src/types";
import { db } from "@/src/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "news"), orderBy("date", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setNews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsItem)));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-20 px-4 max-w-5xl mx-auto">
      <div className="text-center mb-20">
        <h1 className="text-[10vw] md:text-[8vw] font-black italic mb-4 leading-none uppercase tracking-tighter">
          NEWS & <span className="text-primary">UPDATES</span>
        </h1>
        <p className="text-muted-foreground font-medium">
          Stay informed with the latest happenings at Olodo Hot Stars.
        </p>
      </div>

      <div className="space-y-12">
        {news.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group"
          >
            <Card className="overflow-hidden border-white/5 bg-card/50 hover:bg-card/80 transition-all">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/5 aspect-video md:aspect-auto overflow-hidden">
                  <img 
                    src={item.imageUrl || `https://picsum.photos/seed/${item.id}/800/450`} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <CardContent className="p-8 md:w-3/5 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className="bg-primary text-primary-foreground">{item.category}</Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {item.date}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">{item.title}</h2>
                  <p className="text-muted-foreground mb-6 line-clamp-3">
                    {item.content}
                  </p>
                  <button className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
                    Read Full Story <ArrowRight className="h-4 w-4" />
                  </button>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        ))}
        {news.length === 0 && (
          <p className="text-center py-20 text-muted-foreground">No news articles published yet.</p>
        )}
      </div>
    </div>
  );
}
