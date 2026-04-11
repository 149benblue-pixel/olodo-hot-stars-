import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { 
  Trophy, 
  Calendar, 
  ArrowRight, 
  ShieldCheck, 
  Loader2, 
  TrendingUp, 
  Users, 
  Target,
  Clock,
  MapPin,
  Heart,
  Image as ImageIcon
} from "lucide-react";
import { Link } from "react-router-dom";
import { db } from "@/src/firebase";
import { collection, query, orderBy, limit, onSnapshot, where } from "firebase/firestore";
import { Match, NewsItem, TeamStats } from "@/src/types";

export default function Home() {
  const [nextMatch, setNextMatch] = useState<Match | null>(null);
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<TeamStats>({
    totalMatches: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsScored: 0,
    goalsConceded: 0,
    averageRating: 0
  });
  const [avgAttendance, setAvgAttendance] = useState(0);

  useEffect(() => {
    // Fetch next upcoming match
    const qNext = query(
      collection(db, "matches"),
      where("status", "==", "upcoming"),
      orderBy("date", "asc"),
      limit(1)
    );
    const unsubNext = onSnapshot(qNext, (snapshot) => {
      if (!snapshot.empty) {
        setNextMatch({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Match);
      }
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

    // Fetch all matches for stats
    const unsubMatches = onSnapshot(collection(db, "matches"), (snapshot) => {
      const allMatches = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Match));
      setMatches(allMatches);

      const played = allMatches.filter(m => m.status === 'played');
      let wins = 0, draws = 0, losses = 0, goalsScored = 0, goalsConceded = 0, totalAttendance = 0, attendanceCount = 0;

      played.forEach(m => {
        if (m.score) {
          const homeScore = m.score.home;
          const awayScore = m.score.away;
          if (m.isHome) {
            goalsScored += homeScore;
            goalsConceded += awayScore;
            if (homeScore > awayScore) wins++;
            else if (homeScore < awayScore) losses++;
            else draws++;
          } else {
            goalsScored += awayScore;
            goalsConceded += homeScore;
            if (awayScore > homeScore) wins++;
            else if (awayScore < homeScore) losses++;
            else draws++;
          }
        }
        if (m.attendance) {
          totalAttendance += Number(m.attendance);
          attendanceCount++;
        }
      });

      setStats({
        totalMatches: played.length,
        wins,
        draws,
        losses,
        goalsScored,
        goalsConceded,
        averageRating: 8.5
      });
      setAvgAttendance(attendanceCount > 0 ? Math.round(totalAttendance / attendanceCount) : 0);
      setLoading(false);
    });

    return () => {
      unsubNext();
      unsubNews();
      unsubMatches();
    };
  }, []);

  const winRate = stats.totalMatches > 0 ? Math.round((stats.wins / stats.totalMatches) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0 pb-20">
      {/* Hero Section - Massive Typography */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-black border-b border-white/10">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2000&auto=format&fit=crop" 
            alt="Stadium" 
            className="w-full h-full object-cover opacity-40 grayscale hover:grayscale-0 transition-all duration-1000"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        </div>
        
        <div className="container relative z-10 px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              <ShieldCheck className="h-3 w-3" />
              Official Club Portal
            </div>
            <h1 className="text-[15vw] md:text-[12vw] font-black leading-[0.85] italic uppercase tracking-tighter mb-8">
              HOT <span className="text-primary">STARS</span><br />
              <span className="text-outline text-transparent">RISING</span>
            </h1>
            
            <div className="flex flex-wrap gap-8 items-center">
              <Link to="/team">
                <Button className="h-16 px-10 bg-primary text-primary-foreground font-black italic text-lg hover:scale-105 transition-transform">
                  MEET THE SQUAD
                </Button>
              </Link>
              <div className="flex gap-12">
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Win Rate</p>
                  <p className="text-4xl font-black italic text-primary">{winRate}%</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Goals</p>
                  <p className="text-4xl font-black italic">{stats.goalsScored}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Content */}
      <section className="container px-4 -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Next Match - Large Bento Item */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-8 bg-card border border-white/10 p-8 flex flex-col justify-between min-h-[300px] relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Trophy className="h-48 w-48" />
            </div>
            <div>
              <Badge className="bg-primary text-primary-foreground mb-4">NEXT FIXTURE</Badge>
              {nextMatch ? (
                <>
                  <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-4">
                    {nextMatch.isHome ? "HOT STARS" : nextMatch.opponent} <span className="text-primary">VS</span> {nextMatch.isHome ? nextMatch.opponent : "HOT STARS"}
                  </h2>
                  <div className="flex flex-wrap gap-6 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    <span className="flex items-center gap-2 text-foreground"><Calendar className="h-4 w-4 text-primary" /> {nextMatch.date}</span>
                    <span className="flex items-center gap-2 text-foreground"><Clock className="h-4 w-4 text-primary" /> {nextMatch.time || "TBD"}</span>
                    <span className="flex items-center gap-2 text-foreground"><MapPin className="h-4 w-4 text-primary" /> {nextMatch.venue || "TBD"}</span>
                  </div>
                </>
              ) : (
                <h2 className="text-4xl font-black italic uppercase">No upcoming matches</h2>
              )}
            </div>
            <Link to="/performance" className="mt-8">
              <Button variant="outline" className="border-white/10 hover:bg-primary hover:text-primary-foreground font-bold italic">
                MATCH CENTER <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          {/* Quick Stats - Medium Bento Item */}
          <div className="md:col-span-4 grid grid-cols-2 gap-4">
            <div className="bg-primary p-6 flex flex-col justify-between">
              <Target className="h-8 w-8 text-primary-foreground/50" />
              <div>
                <p className="text-5xl font-black italic text-primary-foreground leading-none">{stats.wins}</p>
                <p className="text-[10px] font-bold uppercase text-primary-foreground/70 tracking-widest mt-2">Victories</p>
              </div>
            </div>
            <div className="bg-card border border-white/10 p-6 flex flex-col justify-between">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-5xl font-black italic leading-none">{avgAttendance}</p>
                <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest mt-2">Avg Fans</p>
              </div>
            </div>
            <div className="bg-card border border-white/10 p-6 flex flex-col justify-between col-span-2">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-4xl font-black italic leading-none">8.5</p>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest mt-2">Team Rating</p>
                </div>
                <TrendingUp className="h-12 w-12 text-primary opacity-20" />
              </div>
            </div>
          </div>

          {/* News Section - Wide Bento */}
          <div className="md:col-span-12 mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter">LATEST <span className="text-primary">NEWS</span></h2>
              <Link to="/news">
                <Button variant="link" className="text-primary font-bold uppercase tracking-widest text-xs">View All News</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestNews.map((item) => (
                <motion.div 
                  key={item.id}
                  whileHover={{ y: -5 }}
                  className="group cursor-pointer"
                >
                  <Card className="border-white/5 bg-card/50 overflow-hidden h-full flex flex-col">
                    <div className="aspect-[16/10] relative overflow-hidden">
                      <img 
                        src={item.imageUrl || `https://picsum.photos/seed/${item.id}/600/400`} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-primary text-primary-foreground font-black text-[10px]">{item.category}</Badge>
                      </div>
                    </div>
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">{item.date}</p>
                      <h3 className="text-xl font-bold mb-3 leading-tight group-hover:text-primary transition-colors">{item.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-6">{item.content}</p>
                      <Link to="/news" className="mt-auto inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                        Read More <ArrowRight className="h-3 w-3" />
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Results - Side Bento */}
          <div className="md:col-span-12 lg:col-span-6 mt-8">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6">RECENT <span className="text-primary">RESULTS</span></h2>
            <div className="space-y-3">
              {matches.filter(m => m.status === 'played').slice(0, 4).map((match) => (
                <div key={match.id} className="bg-card border border-white/5 p-4 flex items-center justify-between group hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-1 h-8 ${
                      match.score && (
                        (match.isHome && match.score.home > match.score.away) || 
                        (!match.isHome && match.score.away > match.score.home)
                      ) ? 'bg-primary' : (match.score && match.score.home === match.score.away ? 'bg-muted-foreground' : 'bg-destructive')
                    }`} />
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">{match.date} • {match.competition}</p>
                      <h4 className="font-bold text-sm uppercase italic">
                        {match.isHome ? "HOT STARS" : match.opponent} vs {match.isHome ? match.opponent : "HOT STARS"}
                      </h4>
                    </div>
                  </div>
                  <div className="text-2xl font-black italic text-primary">
                    {match.score?.home} - {match.score?.away}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Support Section - Side Bento */}
          <div className="md:col-span-12 lg:col-span-6 mt-8">
            <div className="bg-primary h-full p-8 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Heart className="h-64 w-64" />
              </div>
              <div>
                <h2 className="text-4xl font-black italic text-primary-foreground uppercase leading-none mb-4">SUPPORT<br />THE STARS</h2>
                <p className="text-primary-foreground/80 font-medium max-w-sm">
                  Help us grow the club and support our local talent. Every contribution makes a difference.
                </p>
              </div>
              <Link to="/donate" className="mt-8">
                <Button className="bg-black text-white font-black italic px-8 h-14 hover:scale-105 transition-transform">
                  DONATE NOW
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
