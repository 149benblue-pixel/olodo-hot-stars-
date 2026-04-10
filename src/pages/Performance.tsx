import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Trophy, Calendar, MapPin, Clock, TrendingUp, Target, Shield } from "lucide-react";
import { Match, TeamStats } from "@/src/types";

const stats: TeamStats = {
  totalMatches: 24,
  wins: 15,
  draws: 5,
  losses: 4,
  goalsScored: 42,
  goalsConceded: 18,
  averageRating: 8.2
};

const matches: Match[] = [
  {
    id: "1",
    opponent: "Nairobi Warriors",
    date: "2026-04-15",
    time: "15:00",
    venue: "Olodo Community Grounds",
    competition: "Regional League",
    status: "upcoming",
    isHome: true
  },
  {
    id: "2",
    opponent: "Lake Victoria FC",
    date: "2026-04-05",
    competition: "Regional League",
    status: "played",
    score: { home: 2, away: 1 },
    isHome: true
  },
  {
    id: "3",
    opponent: "Highland Strikers",
    date: "2026-03-28",
    competition: "Cup Quarter-Final",
    status: "played",
    score: { home: 0, away: 2 },
    isHome: false
  }
];

export default function Performance() {
  return (
    <div className="container py-12 px-4">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black italic mb-4 tracking-tighter">PERFORMANCE</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Tracking our journey through the season. Every goal, every win, every step forward.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {[
          { label: "Matches", value: stats.totalMatches, icon: Calendar },
          { label: "Wins", value: stats.wins, icon: Trophy, color: "text-primary" },
          { label: "Goals Scored", value: stats.goalsScored, icon: Target },
          { label: "Team Rating", value: stats.averageRating, icon: TrendingUp },
        ].map((stat, i) => (
          <Card key={i} className="bg-card border-white/10 text-center p-6">
            <div className="flex justify-center mb-2">
              <stat.icon className={stat.color || "text-muted-foreground"} />
            </div>
            <p className="text-3xl font-black italic">{stat.value}</p>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">{stat.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Fixtures & Results */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold italic border-l-4 border-primary pl-4">FIXTURES & RESULTS</h2>
          <div className="space-y-4">
            {matches.map((match) => (
              <Card key={match.id} className="border-white/5 bg-card/30 hover:bg-card/50 transition-colors">
                <CardContent className="p-6 flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={match.status === 'upcoming' ? 'default' : 'secondary'} className="text-[10px] uppercase">
                        {match.status}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">{match.competition}</span>
                    </div>
                    <h3 className="text-lg font-bold">
                      {match.isHome ? "Olodo Hot Stars" : match.opponent} 
                      <span className="mx-2 text-primary">vs</span> 
                      {match.isHome ? match.opponent : "Olodo Hot Stars"}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {match.date}</span>
                      {match.venue && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {match.venue}</span>}
                    </div>
                  </div>
                  
                  <div className="text-right shrink-0">
                    {match.status === 'played' ? (
                      <div className="text-3xl font-black italic text-primary">
                        {match.score?.home} - {match.score?.away}
                      </div>
                    ) : (
                      <div className="text-xl font-mono font-bold bg-muted px-3 py-1 rounded">
                        {match.time}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Performance Chart / Breakdown */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold italic border-l-4 border-primary pl-4">SEASON BREAKDOWN</h2>
          <Card className="border-white/10 bg-card/50 p-8 h-full">
            <div className="space-y-8">
              <div className="flex justify-between items-end gap-4 h-40">
                {[
                  { label: "Wins", val: stats.wins, color: "bg-primary" },
                  { label: "Draws", val: stats.draws, color: "bg-muted-foreground" },
                  { label: "Losses", val: stats.losses, color: "bg-destructive" }
                ].map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${(item.val / stats.totalMatches) * 100}%` }}
                      className={`${item.color} w-full rounded-t-lg min-h-[10px]`}
                    />
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">{item.label}</span>
                    <span className="font-bold">{item.val}</span>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Goals Scored</p>
                  <p className="text-4xl font-black italic text-primary">{stats.goalsScored}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Goals Conceded</p>
                  <p className="text-4xl font-black italic">{stats.goalsConceded}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
