import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Badge } from "@/src/components/ui/badge";
import { cn } from "@/src/lib/utils";
import { db } from "@/src/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { GalleryItem } from "@/src/types";
import { Loader2 } from "lucide-react";

const categories = ["All", "Match", "Training", "Celebrations"];

export default function Gallery() {
  const [filter, setFilter] = useState("All");
  const [photos, setPhotos] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "gallery"), orderBy("date", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setPhotos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryItem)));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filteredPhotos = filter === "All" ? photos : photos.filter(p => p.category === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black italic mb-4">GALLERY</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Capturing the moments that define our club. From intense training sessions to glorious victories.
        </p>
      </div>

      <div className="flex justify-center flex-wrap gap-2 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              "px-6 py-2 rounded-full font-bold transition-all border",
              filter === cat 
                ? "bg-primary text-primary-foreground border-primary" 
                : "bg-card text-muted-foreground border-white/10 hover:border-primary/50"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredPhotos.map((photo) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={photo.id}
              className="group relative aspect-square rounded-3xl overflow-hidden border border-white/5"
            >
              <img 
                src={photo.imageUrl} 
                alt="Gallery" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <Badge className="w-fit mb-2 bg-primary text-primary-foreground">{photo.category}</Badge>
                <p className="text-xs text-muted-foreground">{photo.date}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {filteredPhotos.length === 0 && (
          <p className="text-center col-span-full py-20 text-muted-foreground">No photos found in this category.</p>
        )}
      </div>
    </div>
  );
}
