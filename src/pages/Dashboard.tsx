import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { 
  Users, 
  Trophy, 
  Target, 
  Activity, 
  Bell, 
  Menu, 
  Calendar, 
  MapPin, 
  Loader2,
  TrendingUp,
  Swords
} from "lucide-react";
import { db } from "@/src/firebase";
import { collection, query, orderBy, limit, onSnapshot, where } from "firebase/firestore";
import { Match, Player } from "@/src/types";
import { cn } from "@/src/lib/utils";

export default function Dashboard() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSquad: 17,
    activePlayers: 16,
    injuredPlayers: 1,
    winRate: 7,
    wins: 2,
    draws: 2,
    losses: 5,
    goalsScored: 15,
    avgAttendance: 81
  });

  useEffect(() => {
    // Fetch players for squad stats
    const unsubPlayers = onSnapshot(collection(db, "players"), (snapshot) => {
      const allPlayers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Player));
      if (allPlayers.length > 0) {
        setStats(prev => ({
          ...prev,
          totalSquad: allPlayers.length,
          activePlayers: allPlayers.length - 1,
          injuredPlayers: 1
        }));
      }
    });

    // Fetch upcoming matches
    const qUpcoming = query(
      collection(db, "matches"),
      where("status", "==", "upcoming"),
      orderBy("date", "asc"),
      limit(3)
    );
    const unsubUpcoming = onSnapshot(qUpcoming, (snapshot) => {
      setUpcomingMatches(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Match)));
    });

    // Fetch recent results
    const qRecent = query(
      collection(db, "matches"),
      where("status", "==", "played"),
      orderBy("date", "desc"),
      limit(5)
    );
    const unsubRecent = onSnapshot(qRecent, (snapshot) => {
      const recentMatches = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Match));
      setMatches(recentMatches);

      // Calculate stats from all played matches
      const unsubAllPlayed = onSnapshot(
        query(collection(db, "matches"), where("status", "==", "played")),
        (allSnapshot) => {
          const allPlayed = allSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Match));
          if (allPlayed.length > 0) {
            let wins = 0, draws = 0, losses = 0, goals = 0;

            allPlayed.forEach(m => {
              if (m.score) {
                const isWin = m.isHome ? m.score.home > m.score.away : m.score.away > m.score.home;
                const isDraw = m.score.home === m.score.away;
                if (isWin) wins++;
                else if (isDraw) draws++;
                else losses++;

                goals += m.isHome ? m.score.home : m.score.away;
              }
            });

            setStats(prev => ({
              ...prev,
              wins,
              draws,
              losses,
              winRate: Math.round((wins / allPlayed.length) * 100),
              goalsScored: goals
            }));
          }
          setLoading(false);
        }
      );
    });

    return () => {
      unsubPlayers();
      unsubUpcoming();
      unsubRecent();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Menu className="h-6 w-6 text-white" />
          <h1 className="text-lg font-black tracking-[0.1em] uppercase">Dashboard</h1>
        </div>
        <div className="relative">
          <Bell className="h-6 w-6 text-white" />
          <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#ffcc00] rounded-full border-2 border-[#0a0a0a]" />
        </div>
      </header>

      <main className="container max-w-lg mx-auto px-4 pt-6 space-y-6">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4">
          <StatCard 
            title="Total Squad"
            value={stats.totalSquad}
            subtext={`${stats.activePlayers} active, ${stats.injuredPlayers} injured`}
            icon={<Users className="h-5 w-5" />}
          />
          <StatCard 
            title="Win Rate"
            value={`${stats.winRate}%`}
            subtext={`${stats.wins}W - ${stats.draws}D - ${stats.losses}L`}
            icon={<Trophy className="h-5 w-5" />}
          />
          <StatCard 
            title="Goals Scored"
            value={stats.goalsScored}
            subtext={<div className="flex items-center gap-1 text-[#22c55e] font-bold"><TrendingUp className="h-3 w-3" /> 12% <span className="text-muted-foreground font-medium ml-1">Across all competitions</span></div>}
            icon={<Target className="h-5 w-5" />}
          />
          <StatCard 
            title="Avg Attendance"
            value={`${stats.avgAttendance}%`}
            subtext="Training & Matches"
            icon={<Activity className="h-5 w-5" />}
          />
        </div>

        {/* Upcoming Fixtures */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Swords className="h-5 w-5 text-[#ffcc00]" />
              <h2 className="text-xl font-black tracking-tight uppercase">Upcoming Fixtures</h2>
            </div>
            <Badge className="bg-transparent text-[#ffcc00] font-black px-0 py-0 text-xs">
              {upcomingMatches.length} MATCHES
            </Badge>
          </div>

          <div className="space-y-3">
            {upcomingMatches.map((m) => (
              <div key={m.id}>
                <FixtureCard match={m} />
              </div>
            ))}
            {upcomingMatches.length === 0 && (
              <div className="bg-[#111111] rounded-2xl p-8 text-center border border-white/5 text-muted-foreground italic">
                No upcoming fixtures scheduled.
              </div>
            )}
          </div>
        </section>

        {/* Recent Results */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-[#ffcc00]" />
            <h2 className="text-xl font-black tracking-tight uppercase">Recent Results</h2>
          </div>

          <div className="bg-[#111111] rounded-3xl p-4 space-y-1 border border-white/5">
            {matches.map((m) => (
              <div key={m.id}>
                <ResultCard match={m} />
              </div>
            ))}
            {matches.length === 0 && (
              <div className="text-center py-4 text-muted-foreground italic">No recent results found.</div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}

function StatCard({ title, value, subtext, icon }: { title: string, value: string | number, subtext: React.ReactNode, icon: React.ReactNode }) {
  return (
    <Card className="bg-[#111111] border-white/5 rounded-2xl overflow-hidden shadow-lg">
      <CardContent className="p-6 flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{title}</p>
          <h3 className="text-4xl font-black tracking-tight">{value}</h3>
          <div className="text-[10px] text-muted-foreground pt-2">
            {subtext}
          </div>
        </div>
        <div className="bg-[#1a1a1a] p-3 rounded-xl text-muted-foreground border border-white/5">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

function FixtureCard({ match }: { match: Match }) {
  const date = new Date(match.date);
  const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
  const day = date.getDate();

  return (
    <Card className="bg-[#111111] border-white/5 rounded-2xl overflow-hidden p-4 shadow-md">
      <div className="flex gap-4">
        <div className="bg-[#1a1a1a] rounded-xl p-2 flex flex-col items-center justify-center min-w-[56px] h-[56px] border border-white/5">
          <span className="text-[10px] font-bold text-muted-foreground leading-none mb-1">{month}</span>
          <span className="text-xl font-black leading-none">{day}</span>
        </div>
        <div className="flex-1 space-y-1">
          <h4 className="text-base font-black uppercase tracking-tight">VS {match.opponent.toUpperCase()}</h4>
          <p className="text-xs text-muted-foreground font-medium">
            {match.competition} • {match.venue}
          </p>
          <div className="flex justify-end">
            <Button size="sm" className="bg-[#1a2b3c] text-[#3b82f6] hover:bg-[#1a2b3c]/80 font-black text-[10px] px-4 h-8 rounded-md transition-all">
              UPCOMING
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function ResultCard({ match }: { match: Match }) {
  if (!match.score) return null;

  const isWin = match.isHome ? match.score.home > match.score.away : match.score.away > match.score.home;
  const isLoss = match.isHome ? match.score.home < match.score.away : match.score.away < match.score.home;

  return (
    <div className="flex items-center justify-between py-3 px-2 border-b border-white/5 last:border-0">
      <div className="w-[38%] text-[11px] font-bold text-muted-foreground leading-tight">
        {match.isHome ? "Olodo Hot Stars" : match.opponent}
      </div>
      
      <div className="bg-[#1a1a1a] rounded-lg px-3 py-1.5 flex items-center gap-2 border border-white/5">
        <span className={cn("text-base font-black", match.isHome ? (isWin ? "text-[#22c55e]" : isLoss ? "text-white" : "text-white") : (isLoss ? "text-[#22c55e]" : isWin ? "text-white" : "text-white"))}>
          {match.score.home}
        </span>
        <span className="text-muted-foreground font-black text-sm">:</span>
        <span className={cn("text-base font-black", !match.isHome ? (isWin ? "text-[#22c55e]" : isLoss ? "text-white" : "text-white") : (isLoss ? "text-[#22c55e]" : isWin ? "text-white" : "text-white"))}>
          {match.score.away}
        </span>
      </div>

      <div className="w-[38%] text-[11px] font-bold text-right text-muted-foreground leading-tight">
        {match.isHome ? match.opponent : "Olodo Hot Stars"}
      </div>
    </div>
  );
}
