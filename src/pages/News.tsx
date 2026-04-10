import { motion } from "motion/react";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent } from "@/src/components/ui/card";
import { Calendar, ArrowRight } from "lucide-react";
import { NewsItem } from "@/src/types";

const news: NewsItem[] = [
  {
    id: "1",
    title: "Olodo Hot Stars Secure Crucial Away Win",
    content: "In a thrilling match against Lake Victoria FC, the Stars showed incredible resilience to come back from a goal down and win 2-1. Goals from John Doe and Alex Smith secured the three points.",
    date: "2026-04-05",
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800",
    category: "Match Result"
  },
  {
    id: "2",
    title: "New Training Facility Inaugurated",
    content: "We are excited to announce the opening of our state-of-the-art training center in Olodo. This facility will serve both our senior and youth teams, providing them with the best environment to develop their skills.",
    date: "2026-04-01",
    imageUrl: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800",
    category: "Announcement"
  },
  {
    id: "3",
    title: "Upcoming Youth Tournament Trials",
    content: "Calling all young talents! Olodo Hot Stars will be holding trials for our U-17 team next weekend. If you think you have what it takes to be a star, come join us at the community grounds.",
    date: "2026-03-25",
    imageUrl: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=800",
    category: "Tournament"
  }
];

export default function News() {
  return (
    <div className="container py-12 px-4 max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black italic mb-4">NEWS & UPDATES</h1>
        <p className="text-muted-foreground">
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
                    src={item.imageUrl} 
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
      </div>
    </div>
  );
}
