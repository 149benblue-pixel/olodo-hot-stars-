import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Badge } from "@/src/components/ui/badge";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import { Plus, Edit2, Trash2, Save, X, LogIn, LayoutDashboard, Users, Trophy, Newspaper, Image as ImageIcon, Loader2, Briefcase, Phone } from "lucide-react";
import { useAuth } from "@/src/AuthContext";
import { signInWithGoogle, logout, db } from "@/src/firebase";
import { collection, onSnapshot, query, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { Player, Match, NewsItem, Official } from "@/src/types";
import { handleFirestoreError, OperationType } from "@/src/lib/firestore-errors";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/src/components/ui/dialog";

export default function Admin() {
  const { user, loading: authLoading, isAuthReady } = useAuth();
  const [activeTab, setActiveTab] = useState("players");
  const [playerSearch, setPlayerSearch] = useState("");
  
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [officials, setOfficials] = useState<Official[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [isOfficialDialogOpen, setIsOfficialDialogOpen] = useState(false);
  const [editingOfficial, setEditingOfficial] = useState<Official | null>(null);
  const [officialForm, setOfficialForm] = useState({
    name: "",
    role: "",
    photoUrl: "",
    contact: ""
  });

  useEffect(() => {
    if (!isAuthReady || !user) return;

    const unsubPlayers = onSnapshot(collection(db, "players"), 
      (snapshot) => {
        setPlayers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Player)));
        setLoading(false);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, "players")
    );

    const unsubMatches = onSnapshot(collection(db, "matches"), 
      (snapshot) => {
        setMatches(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Match)));
      },
      (error) => handleFirestoreError(error, OperationType.LIST, "matches")
    );

    const unsubNews = onSnapshot(collection(db, "news"), 
      (snapshot) => {
        setNews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsItem)));
      },
      (error) => handleFirestoreError(error, OperationType.LIST, "news")
    );

    const unsubOfficials = onSnapshot(collection(db, "officials"), 
      (snapshot) => {
        setOfficials(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Official)));
      },
      (error) => handleFirestoreError(error, OperationType.LIST, "officials")
    );

    return () => {
      unsubPlayers();
      unsubMatches();
      unsubNews();
      unsubOfficials();
    };
  }, [isAuthReady, user]);

  const handleSaveOfficial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data: any = {
        name: officialForm.name,
        role: officialForm.role,
      };
      if (officialForm.photoUrl.trim()) data.photoUrl = officialForm.photoUrl.trim();
      if (officialForm.contact.trim()) data.contact = officialForm.contact.trim();

      if (editingOfficial) {
        await updateDoc(doc(db, "officials", editingOfficial.id), data);
      } else {
        await addDoc(collection(db, "officials"), data);
      }
      setIsOfficialDialogOpen(false);
      setEditingOfficial(null);
      setOfficialForm({ name: "", role: "", photoUrl: "", contact: "" });
    } catch (error) {
      handleFirestoreError(error, editingOfficial ? OperationType.UPDATE : OperationType.CREATE, "officials");
    }
  };

  const handleDeleteOfficial = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this official?")) return;
    try {
      await deleteDoc(doc(db, "officials", id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, "officials");
    }
  };

  const openOfficialDialog = (official?: Official) => {
    if (official) {
      setEditingOfficial(official);
      setOfficialForm({
        name: official.name,
        role: official.role,
        photoUrl: official.photoUrl,
        contact: official.contact || ""
      });
    } else {
      setEditingOfficial(null);
      setOfficialForm({ name: "", role: "", photoUrl: "", contact: "" });
    }
    setIsOfficialDialogOpen(true);
  };

  const filteredPlayers = players.filter(player => 
    player.name.toLowerCase().includes(playerSearch.toLowerCase()) || 
    player.number.toString().includes(playerSearch)
  );

  if (authLoading) {
    return (
      <div className="container min-h-[70vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container min-h-[70vh] flex items-center justify-center px-4">
        <Card className="w-full max-w-md border-white/10 bg-card/50 backdrop-blur">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-black italic">ADMIN LOGIN</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground mb-4">
              Access restricted to club officials. Please sign in with your authorized Google account.
            </p>
            <Button onClick={signInWithGoogle} className="w-full bg-primary text-primary-foreground font-bold py-6">
              <LogIn className="mr-2 h-4 w-4" /> Sign In with Google
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter">ADMIN PANEL</h1>
          <p className="text-muted-foreground">Manage your club's content and performance data.</p>
        </div>
        <Button variant="outline" onClick={logout} className="border-white/10 hover:bg-destructive hover:text-white">
          Logout
        </Button>
      </div>

      <Tabs defaultValue="players" className="space-y-8" onValueChange={setActiveTab}>
        <TabsList className="bg-card border border-white/10 p-1 rounded-xl w-full justify-start overflow-x-auto">
          <TabsTrigger value="players" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Users className="mr-2 h-4 w-4" /> Players
          </TabsTrigger>
          <TabsTrigger value="officials" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Briefcase className="mr-2 h-4 w-4" /> Officials
          </TabsTrigger>
          <TabsTrigger value="matches" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Trophy className="mr-2 h-4 w-4" /> Matches
          </TabsTrigger>
          <TabsTrigger value="news" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Newspaper className="mr-2 h-4 w-4" /> News
          </TabsTrigger>
          <TabsTrigger value="gallery" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <ImageIcon className="mr-2 h-4 w-4" /> Gallery
          </TabsTrigger>
        </TabsList>

        <TabsContent value="players" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold italic">Manage Players</h2>
            <div className="flex w-full sm:w-auto gap-2">
              <Input 
                placeholder="Search by name or #..." 
                value={playerSearch}
                onChange={(e) => setPlayerSearch(e.target.value)}
                className="max-w-[200px] bg-card border-white/10"
              />
              <Button className="bg-primary text-primary-foreground">
                <Plus className="mr-2 h-4 w-4" /> Add Player
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlayers.map((player) => (
              <Card key={player.id} className="border-white/5 bg-card/50">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg overflow-hidden bg-muted">
                    <img src={player.photoUrl || `https://picsum.photos/seed/${player.id}/100/100`} alt={player.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold">{player.name}</h3>
                    <p className="text-xs text-muted-foreground uppercase">{player.position} • #{player.number}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-primary"><Edit2 className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {players.length === 0 && !loading && (
              <p className="text-muted-foreground col-span-full text-center py-12">No players found. Add your first player!</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="officials" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold italic">Manage Officials</h2>
            <Dialog open={isOfficialDialogOpen} onOpenChange={setIsOfficialDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground" onClick={() => openOfficialDialog()}>
                  <Plus className="mr-2 h-4 w-4" /> Add Official
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-white/10 text-foreground">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold italic">
                    {editingOfficial ? "Edit Official" : "Add New Official"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSaveOfficial} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={officialForm.name}
                      onChange={(e) => setOfficialForm({ ...officialForm, name: e.target.value })}
                      placeholder="e.g. Coach Robert" 
                      className="bg-background border-white/10" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input 
                      id="role" 
                      value={officialForm.role}
                      onChange={(e) => setOfficialForm({ ...officialForm, role: e.target.value })}
                      placeholder="e.g. Head Coach" 
                      className="bg-background border-white/10" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="photoUrl">Photo URL</Label>
                    <Input 
                      id="photoUrl" 
                      value={officialForm.photoUrl}
                      onChange={(e) => setOfficialForm({ ...officialForm, photoUrl: e.target.value })}
                      placeholder="https://..." 
                      className="bg-background border-white/10" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact">Contact Information</Label>
                    <Input 
                      id="contact" 
                      value={officialForm.contact}
                      onChange={(e) => setOfficialForm({ ...officialForm, contact: e.target.value })}
                      placeholder="e.g. +254 700 000 000" 
                      className="bg-background border-white/10" 
                    />
                  </div>
                  <DialogFooter className="pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsOfficialDialogOpen(false)}>Cancel</Button>
                    <Button type="submit" className="bg-primary text-primary-foreground">
                      {editingOfficial ? "Update Official" : "Save Official"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {officials.map((official) => (
              <Card key={official.id} className="border-white/5 bg-card/50">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full overflow-hidden bg-muted border-2 border-primary/20">
                    <img src={official.photoUrl || `https://picsum.photos/seed/${official.id}/100/100`} alt={official.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold">{official.name}</h3>
                    <p className="text-xs text-primary font-bold uppercase tracking-wider">{official.role}</p>
                    {official.contact && (
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                        <Phone className="h-2 w-2" /> {official.contact}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-primary" onClick={() => openOfficialDialog(official)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleDeleteOfficial(official.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {officials.length === 0 && !loading && (
              <p className="text-muted-foreground col-span-full text-center py-12">No officials found. Add your first official!</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="matches" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold italic">Match Fixtures</h2>
            <Button className="bg-primary text-primary-foreground">
              <Plus className="mr-2 h-4 w-4" /> Add Match
            </Button>
          </div>
          <Card className="border-white/5 bg-card/50">
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {[1, 2].map((i) => (
                  <div key={i} className="p-6 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-primary uppercase mb-1">Regional League • April 15</p>
                      <h3 className="font-bold">vs. Nairobi Warriors</h3>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-white/10">Update Score</Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8"><Edit2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="news" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold italic">News Articles</h2>
            <Button className="bg-primary text-primary-foreground">
              <Plus className="mr-2 h-4 w-4" /> Create Post
            </Button>
          </div>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Card key={i} className="border-white/5 bg-card/50">
                <CardContent className="p-4 flex items-center gap-6">
                  <div className="h-20 w-32 rounded-lg overflow-hidden bg-muted shrink-0">
                    <img src={`https://picsum.photos/seed/news${i}/200/150`} alt="News" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold line-clamp-1">Article Title {i}</h3>
                    <p className="text-xs text-muted-foreground">Published on April {i}, 2026</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" className="h-8 w-8"><Edit2 className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold italic">Gallery Photos</h2>
            <Button className="bg-primary text-primary-foreground">
              <Plus className="mr-2 h-4 w-4" /> Upload Photo
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="group relative aspect-square rounded-xl overflow-hidden bg-muted">
                <img src={`https://picsum.photos/seed/gal${i}/300/300`} alt="Gallery" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-white"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
