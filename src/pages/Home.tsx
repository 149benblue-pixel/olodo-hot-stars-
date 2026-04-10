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
          totalAttendance += m.attendance;
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
    <div className="flex flex-col gap-12 pb-20">
      {/* Hero Dashboard Header */}
      <section className="relative pt-20 pb-12 overflow-hidden bg-black">
        <div className="absolute inset-0 z-0 opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2000&auto=format&fit=crop" 
            alt="Stadium" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        </div>
        
        <div className="container relative z-10 px-4">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-4 uppercase tracking-widest">
                <ShieldCheck className="h-3 w-3" />
                Olodo Hot Stars Dashboard
              </div>
              <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase">
                THE <span className="text-primary">HUB</span>
              </h1>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
              <div className="bg-card/50 backdrop-blur border border-white/5 p-4 rounded-2xl text-center">
                <p className="text-2xl font-black italic text-primary">{winRate}%</p>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Win Rate</p>
              </div>
              <div className="bg-card/50 backdrop-blur border border-white/5 p-4 rounded-2xl text-center">
                <p className="text-2xl font-black italic">{stats.totalMatches}</p>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Games</p>
              </div>
              <div className="bg-card/50 backdrop-blur border border-white/5 p-4 rounded-2xl text-center">
                <p className="text-2xl font-black italic">{avgAttendance}</p>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Avg Fans</p>
              </div>
              <div className="bg-card/50 backdrop-blur border border-white/5 p-4 rounded-2xl text-center">
                <p className="text-2xl font-black italic text-primary">{stats.wins}</p>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Victories</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container px-4 flex flex-col gap-12">
        {/* Next Match */}
        {nextMatch && (
          <Card className="border-primary/20 bg-primary/5 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-6 opacity-5">
              <Trophy className="h-32 w-32" />
            </div>
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary">UPCOMING FIXTURE</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8">
              <div className="text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-black italic mb-2">
                  {nextMatch.isHome ? "Olodo Hot Stars" : nextMatch.opponent} vs. {nextMatch.isHome ? nextMatch.opponent : "Olodo Hot Stars"}
                </h3>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-bold">
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {nextMatch.date}</span>
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {nextMatch.time || "TBD"}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {nextMatch.venue || "TBD"}</span>
                </div>
              </div>
              <Link to="/performance">
                <Button className="bg-primary text-primary-foreground font-bold group">
                  Match Center <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Recent Performance */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black italic uppercase tracking-tight">Recent Results</h2>
            <Link to="/performance" className="text-xs font-bold text-primary hover:underline uppercase tracking-widest">View All</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {matches.filter(m => m.status === 'played').slice(0, 3).map((match) => (
              <Card key={match.id} className="border-white/5 bg-card/30">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-10 rounded-full ${
                      match.score && (
                        (match.isHome && match.score.home > match.score.away) || 
                        (!match.isHome && match.score.away > match.score.home)
                      ) ? 'bg-primary' : (match.score && match.score.home === match.score.away ? 'bg-muted-foreground' : 'bg-destructive')
                    }`} />
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">{match.competition} • {match.date}</p>
                      <h4 className="font-bold text-sm">
                        {match.isHome ? "Olodo Hot Stars" : match.opponent} vs. {match.isHome ? match.opponent : "Olodo Hot Stars"}
                      </h4>
                    </div>
                  </div>
                  <div className="text-xl font-black italic text-primary">
                    {match.score?.home} - {match.score?.away}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team News Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black italic uppercase tracking-tight">Team News</h2>
            <Link to="/news" className="text-xs font-bold text-primary hover:underline uppercase tracking-widest">Read More</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestNews.slice(0, 3).map((item) => (
              <Card key={item.id} className="border-white/5 bg-card/30 overflow-hidden group">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={item.imageUrl || `https://picsum.photos/seed/${item.id}/600/400`} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-primary text-primary-foreground text-[10px] uppercase font-bold">{item.category}</Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold mb-2 line-clamp-1 group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{item.content}</p>
                  <Link to="/news" className="text-[10px] font-black uppercase text-primary flex items-center gap-1">
                    Read Story <ArrowRight className="h-3 w-3" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Season Progress & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-white/10 bg-card/50">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-widest italic">Season Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase">
                  <span>Win Rate</span>
                  <span className="text-primary">{winRate}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${winRate}%` }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                  <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Goals</p>
                  <p className="text-2xl font-black italic text-primary">{stats.goalsScored}</p>
                </div>
                <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                  <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Conceded</p>
                  <p className="text-2xl font-black italic">{stats.goalsConceded}</p>
                </div>
                <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                  <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Fans</p>
                  <p className="text-2xl font-black italic text-primary">{avgAttendance}</p>
                </div>
                <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                  <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Clean Sheets</p>
                  <p className="text-2xl font-black italic">5</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <div className="flex flex-col justify-center gap-4">
            <h2 className="text-xl font-black italic uppercase tracking-tight">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link to="/team">
                <Button variant="outline" className="w-full justify-between border-white/10 hover:bg-primary hover:text-primary-foreground h-14 font-bold uppercase tracking-widest text-xs">
                  View Squad <Users className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/gallery">
                <Button variant="outline" className="w-full justify-between border-white/10 hover:bg-primary hover:text-primary-foreground h-14 font-bold uppercase tracking-widest text-xs">
                  Photo Gallery <ImageIcon className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/donate">
                <Button variant="outline" className="w-full justify-between border-white/10 hover:bg-primary hover:text-primary-foreground h-14 font-bold uppercase tracking-widest text-xs">
                  Support Club <Trophy className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
