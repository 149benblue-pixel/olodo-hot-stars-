import { motion } from "motion/react";
import { Badge } from "@/src/components/ui/badge";
import { useState } from "react";
import { cn } from "@/src/lib/utils";

const categories = ["All", "Match", "Training", "Celebrations"];

const photos = [
  { id: 1, url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800", category: "Match", title: "Opening Match" },
  { id: 2, url: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800", category: "Training", title: "Morning Drill" },
  { id: 3, url: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=800", category: "Celebrations", title: "Victory Dance" },
  { id: 4, url: "https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=800", category: "Match", title: "Goal Celebration" },
  { id: 5, url: "https://images.unsplash.com/photo-1518091043644-c1d445bb5120?q=80&w=800", category: "Training", title: "Tactical Session" },
  { id: 6, url: "https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=800", category: "Celebrations", title: "Team Spirit" },
];

export default function Gallery() {
  const [filter, setFilter] = useState("All");

  const filteredPhotos = filter === "All" ? photos : photos.filter(p => p.category === filter);

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
        {filteredPhotos.map((photo) => (
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key={photo.id}
            className="group relative aspect-square rounded-3xl overflow-hidden border border-white/5"
          >
            <img 
              src={photo.url} 
              alt={photo.title} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
              <Badge className="w-fit mb-2 bg-primary text-primary-foreground">{photo.category}</Badge>
              <h3 className="text-xl font-bold">{photo.title}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
