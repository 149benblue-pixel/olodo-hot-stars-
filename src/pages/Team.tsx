import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import { User, Shield, Phone, Star, Loader2 } from "lucide-react";
import { Player, Official } from "@/src/types";
import { db } from "@/src/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { cn } from "@/src/lib/utils";

export default function Team() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [officials, setOfficials] = useState<Official[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"players" | "officials">("players");

  useEffect(() => {
    const unsubPlayers = onSnapshot(collection(db, "players"), (snapshot) => {
      setPlayers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Player)));
      setLoading(false);
    });

    const unsubOfficials = onSnapshot(collection(db, "officials"), (snapshot) => {
      setOfficials(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Official)));
    });

    return () => {
      unsubPlayers();
      unsubOfficials();
    };
  }, []);

  if (loading) {
    return (
      <div className="container min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black italic mb-4">OUR TEAM</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          The heart and soul of Olodo Hot Stars. Meet the players and officials who make it all happen.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex justify-center">
          <div className="bg-card border rounded-full p-1 flex gap-2">
            <button 
              onClick={() => setActiveTab("players")}
              className={cn(
                "px-6 py-2 rounded-full font-bold transition-all",
                activeTab === "players" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"
              )}
            >
              Players
            </button>
            <button 
              onClick={() => setActiveTab("officials")}
              className={cn(
                "px-6 py-2 rounded-full font-bold transition-all",
                activeTab === "officials" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"
              )}
            >
              Officials
            </button>
          </div>
        </div>

        {activeTab === "players" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {players.map((player) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <Card className="overflow-hidden border-white/10 bg-card/50 backdrop-blur">
                  <div className="aspect-[4/5] relative overflow-hidden">
                    <img 
                      src={player.photoUrl || `https://picsum.photos/seed/${player.id}/400/500`} 
                      alt={player.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary text-primary-foreground text-xl font-black px-3 py-1">
                        #{player.number}
                      </Badge>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                      <p className="text-primary font-bold uppercase text-xs tracking-widest">{player.position}</p>
                      <h3 className="text-xl font-bold">{player.name}</h3>
                    </div>
                  </div>
                  <CardContent className="p-4 bg-card">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="space-y-1">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Matches</p>
                        <p className="font-bold">{player.stats?.matchesPlayed || 0}</p>
                      </div>
                      <div className="space-y-1 border-x border-white/10">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Goals</p>
                        <p className="font-bold">{player.stats?.goals || 0}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Rating</p>
                        <p className="font-bold text-primary flex items-center justify-center gap-1">
                          {player.stats?.rating || 0} <Star className="h-3 w-3 fill-primary" />
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            {players.length === 0 && (
              <p className="text-muted-foreground col-span-full text-center py-20">No players registered yet.</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {officials.map((official) => (
              <motion.div
                key={official.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="flex items-center p-4 gap-6 border-white/10 bg-card/50">
                  <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-primary shrink-0">
                    <img 
                      src={official.photoUrl || `https://picsum.photos/seed/${official.id}/400/500`} 
                      alt={official.name} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer" 
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold">{official.name}</h3>
                    <p className="text-primary font-medium text-sm uppercase tracking-wider">{official.role}</p>
                    {official.contact && (
                      <p className="text-muted-foreground text-xs flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {official.contact}
                      </p>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
            {officials.length === 0 && (
              <p className="text-muted-foreground col-span-full text-center py-20">No officials registered yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
