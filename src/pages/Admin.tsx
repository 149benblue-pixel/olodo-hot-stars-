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
import { Player, Match, NewsItem, Official, GalleryItem, Position } from "@/src/types";
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
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [isPlayerDialogOpen, setIsPlayerDialogOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [playerForm, setPlayerForm] = useState({
    name: "",
    number: "",
    position: "Striker" as Position,
    photoUrl: "",
    stats: {
      matchesPlayed: 0,
      goals: 0,
      assists: 0,
      rating: 0
    }
  });

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

    const unsubGallery = onSnapshot(collection(db, "gallery"), 
      (snapshot) => {
        setGallery(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryItem)));
      },
      (error) => handleFirestoreError(error, OperationType.LIST, "gallery")
    );

    return () => {
      unsubPlayers();
      unsubMatches();
      unsubNews();
      unsubOfficials();
      unsubGallery();
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

  const handleSavePlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...playerForm,
        number: Number(playerForm.number),
        stats: {
          ...playerForm.stats,
          matchesPlayed: Number(playerForm.stats.matchesPlayed),
          goals: Number(playerForm.stats.goals),
          assists: Number(playerForm.stats.assists),
          rating: Number(playerForm.stats.rating)
        }
      };

      if (editingPlayer) {
        await updateDoc(doc(db, "players", editingPlayer.id), data);
      } else {
        await addDoc(collection(db, "players"), data);
      }
      setIsPlayerDialogOpen(false);
      setEditingPlayer(null);
      setPlayerForm({
        name: "",
        number: "",
        position: "Striker",
        photoUrl: "",
        stats: { matchesPlayed: 0, goals: 0, assists: 0, rating: 0 }
      });
    } catch (error) {
      handleFirestoreError(error, editingPlayer ? OperationType.UPDATE : OperationType.CREATE, "players");
    }
  };

  const handleDeletePlayer = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this player?")) return;
    try {
      await deleteDoc(doc(db, "players", id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, "players");
    }
  };

  const openPlayerDialog = (player?: Player) => {
    if (player) {
      setEditingPlayer(player);
      setPlayerForm({
        name: player.name,
        number: player.number.toString(),
        position: player.position,
        photoUrl: player.photoUrl || "",
        stats: { ...player.stats }
      });
    } else {
      setEditingPlayer(null);
      setPlayerForm({
        name: "",
        number: "",
        position: "Striker",
        photoUrl: "",
        stats: { matchesPlayed: 0, goals: 0, assists: 0, rating: 0 }
      });
    }
    setIsPlayerDialogOpen(true);
  };

  // Match CRUD
  const [isMatchDialogOpen, setIsMatchDialogOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [matchForm, setMatchForm] = useState({
    opponent: "",
    date: new Date().toISOString().split('T')[0],
    time: "",
    venue: "",
    competition: "Regional League",
    status: "upcoming" as "played" | "upcoming",
    isHome: true,
    score: { home: 0, away: 0 }
  });

  const handleSaveMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...matchForm,
        score: matchForm.status === 'played' ? {
          home: Number(matchForm.score.home),
          away: Number(matchForm.score.away)
        } : null
      };

      if (editingMatch) {
        await updateDoc(doc(db, "matches", editingMatch.id), data);
      } else {
        await addDoc(collection(db, "matches"), data);
      }
      setIsMatchDialogOpen(false);
      setEditingMatch(null);
    } catch (error) {
      handleFirestoreError(error, editingMatch ? OperationType.UPDATE : OperationType.CREATE, "matches");
    }
  };

  const openMatchDialog = (match?: Match) => {
    if (match) {
      setEditingMatch(match);
      setMatchForm({
        opponent: match.opponent,
        date: match.date,
        time: match.time || "",
        venue: match.venue || "",
        competition: match.competition,
        status: match.status,
        isHome: match.isHome,
        score: match.score || { home: 0, away: 0 }
      });
    } else {
      setEditingMatch(null);
      setMatchForm({
        opponent: "",
        date: new Date().toISOString().split('T')[0],
        time: "",
        venue: "",
        competition: "Regional League",
        status: "upcoming",
        isHome: true,
        score: { home: 0, away: 0 }
      });
    }
    setIsMatchDialogOpen(true);
  };

  const handleDeleteMatch = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this match?")) return;
    try {
      await deleteDoc(doc(db, "matches", id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, "matches");
    }
  };

  // News CRUD
  const [isNewsDialogOpen, setIsNewsDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [newsForm, setNewsForm] = useState({
    title: "",
    content: "",
    date: new Date().toISOString().split('T')[0],
    category: "Announcement" as any,
    imageUrl: ""
  });

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingNews) {
        await updateDoc(doc(db, "news", editingNews.id), newsForm);
      } else {
        await addDoc(collection(db, "news"), newsForm);
      }
      setIsNewsDialogOpen(false);
      setEditingNews(null);
    } catch (error) {
      handleFirestoreError(error, editingNews ? OperationType.UPDATE : OperationType.CREATE, "news");
    }
  };

  const openNewsDialog = (item?: NewsItem) => {
    if (item) {
      setEditingNews(item);
      setNewsForm({
        title: item.title,
        content: item.content,
        date: item.date,
        category: item.category,
        imageUrl: item.imageUrl || ""
      });
    } else {
      setEditingNews(null);
      setNewsForm({
        title: "",
        content: "",
        date: new Date().toISOString().split('T')[0],
        category: "Announcement",
        imageUrl: ""
      });
    }
    setIsNewsDialogOpen(true);
  };

  const handleDeleteNews = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    try {
      await deleteDoc(doc(db, "news", id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, "news");
    }
  };

  // Gallery CRUD
  const [isGalleryDialogOpen, setIsGalleryDialogOpen] = useState(false);
  const [galleryForm, setGalleryForm] = useState({
    imageUrl: "",
    category: "Match" as any,
    date: new Date().toISOString().split('T')[0]
  });

  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "gallery"), galleryForm);
      setIsGalleryDialogOpen(false);
      setGalleryForm({ imageUrl: "", category: "Match", date: new Date().toISOString().split('T')[0] });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "gallery");
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;
    try {
      await deleteDoc(doc(db, "gallery", id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, "gallery");
    }
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
              <Dialog open={isPlayerDialogOpen} onOpenChange={setIsPlayerDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-primary-foreground" onClick={() => openPlayerDialog()}>
                    <Plus className="mr-2 h-4 w-4" /> Add Player
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-white/10 text-foreground max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold italic">
                      {editingPlayer ? "Edit Player" : "Add New Player"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSavePlayer} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="p-name">Full Name</Label>
                      <Input id="p-name" value={playerForm.name} onChange={(e) => setPlayerForm({...playerForm, name: e.target.value})} className="bg-background border-white/10" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="p-number">Jersey Number</Label>
                      <Input id="p-number" type="number" value={playerForm.number} onChange={(e) => setPlayerForm({...playerForm, number: e.target.value})} className="bg-background border-white/10" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="p-pos">Position</Label>
                      <select id="p-pos" value={playerForm.position} onChange={(e) => setPlayerForm({...playerForm, position: e.target.value as Position})} className="w-full h-10 px-3 rounded-md bg-background border border-white/10 text-sm">
                        <option>Goalkeeper</option>
                        <option>Defender</option>
                        <option>Midfielder</option>
                        <option>Striker</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="p-photo">Photo URL</Label>
                      <Input id="p-photo" value={playerForm.photoUrl} onChange={(e) => setPlayerForm({...playerForm, photoUrl: e.target.value})} className="bg-background border-white/10" />
                    </div>
                    <div className="col-span-full border-t border-white/5 pt-4 mt-2">
                      <h4 className="text-sm font-bold uppercase text-primary mb-4">Player Statistics</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="s-matches">Matches</Label>
                          <Input id="s-matches" type="number" value={playerForm.stats.matchesPlayed} onChange={(e) => setPlayerForm({...playerForm, stats: {...playerForm.stats, matchesPlayed: Number(e.target.value)}})} className="bg-background border-white/10" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="s-goals">Goals</Label>
                          <Input id="s-goals" type="number" value={playerForm.stats.goals} onChange={(e) => setPlayerForm({...playerForm, stats: {...playerForm.stats, goals: Number(e.target.value)}})} className="bg-background border-white/10" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="s-assists">Assists</Label>
                          <Input id="s-assists" type="number" value={playerForm.stats.assists} onChange={(e) => setPlayerForm({...playerForm, stats: {...playerForm.stats, assists: Number(e.target.value)}})} className="bg-background border-white/10" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="s-rating">Rating (0-10)</Label>
                          <Input id="s-rating" type="number" step="0.1" value={playerForm.stats.rating} onChange={(e) => setPlayerForm({...playerForm, stats: {...playerForm.stats, rating: Number(e.target.value)}})} className="bg-background border-white/10" />
                        </div>
                      </div>
                    </div>
                    <DialogFooter className="col-span-full pt-6">
                      <Button type="button" variant="outline" onClick={() => setIsPlayerDialogOpen(false)}>Cancel</Button>
                      <Button type="submit" className="bg-primary text-primary-foreground">
                        {editingPlayer ? "Update Player" : "Save Player"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
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
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-primary" onClick={() => openPlayerDialog(player)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleDeletePlayer(player.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredPlayers.length === 0 && !loading && (
              <p className="text-muted-foreground col-span-full text-center py-12">No players found matching your search.</p>
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
            <Dialog open={isMatchDialogOpen} onOpenChange={setIsMatchDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground" onClick={() => openMatchDialog()}>
                  <Plus className="mr-2 h-4 w-4" /> Add Match
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-white/10 text-foreground max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold italic">
                    {editingMatch ? "Edit Match" : "Add New Match"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSaveMatch} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="m-opponent">Opponent</Label>
                    <Input id="m-opponent" value={matchForm.opponent} onChange={(e) => setMatchForm({...matchForm, opponent: e.target.value})} className="bg-background border-white/10" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="m-date">Date</Label>
                    <Input id="m-date" type="date" value={matchForm.date} onChange={(e) => setMatchForm({...matchForm, date: e.target.value})} className="bg-background border-white/10" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="m-comp">Competition</Label>
                    <Input id="m-comp" value={matchForm.competition} onChange={(e) => setMatchForm({...matchForm, competition: e.target.value})} className="bg-background border-white/10" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="m-status">Status</Label>
                    <select id="m-status" value={matchForm.status} onChange={(e) => setMatchForm({...matchForm, status: e.target.value as any})} className="w-full h-10 px-3 rounded-md bg-background border border-white/10 text-sm">
                      <option value="upcoming">Upcoming</option>
                      <option value="played">Played</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 py-2">
                    <input type="checkbox" id="m-home" checked={matchForm.isHome} onChange={(e) => setMatchForm({...matchForm, isHome: e.target.checked})} className="h-4 w-4 rounded border-white/10 bg-background" />
                    <Label htmlFor="m-home">Home Match</Label>
                  </div>
                  {matchForm.status === 'played' && (
                    <div className="col-span-full grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="s-home">Home Score</Label>
                        <Input id="s-home" type="number" value={matchForm.score.home} onChange={(e) => setMatchForm({...matchForm, score: {...matchForm.score, home: Number(e.target.value)}})} className="bg-background border-white/10" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="s-away">Away Score</Label>
                        <Input id="s-away" type="number" value={matchForm.score.away} onChange={(e) => setMatchForm({...matchForm, score: {...matchForm.score, away: Number(e.target.value)}})} className="bg-background border-white/10" />
                      </div>
                    </div>
                  )}
                  <DialogFooter className="col-span-full pt-6">
                    <Button type="button" variant="outline" onClick={() => setIsMatchDialogOpen(false)}>Cancel</Button>
                    <Button type="submit" className="bg-primary text-primary-foreground">
                      {editingMatch ? "Update Match" : "Save Match"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <Card className="border-white/5 bg-card/50">
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {matches.map((match) => (
                  <div key={match.id} className="p-6 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-primary uppercase mb-1">{match.competition} • {match.date}</p>
                      <h3 className="font-bold">
                        {match.isHome ? "Olodo Hot Stars" : match.opponent} vs. {match.isHome ? match.opponent : "Olodo Hot Stars"}
                      </h3>
                      {match.status === 'played' && match.score && (
                        <p className="text-2xl font-black italic mt-1">{match.score.home} - {match.score.away}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-primary" onClick={() => openMatchDialog(match)}><Edit2 className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleDeleteMatch(match.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
                {matches.length === 0 && (
                  <div className="p-12 text-center text-muted-foreground">No matches scheduled.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="news" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold italic">News Articles</h2>
            <Dialog open={isNewsDialogOpen} onOpenChange={setIsNewsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground" onClick={() => openNewsDialog()}>
                  <Plus className="mr-2 h-4 w-4" /> Create Post
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-white/10 text-foreground max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold italic">
                    {editingNews ? "Edit Article" : "Create New Article"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSaveNews} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="n-title">Title</Label>
                    <Input id="n-title" value={newsForm.title} onChange={(e) => setNewsForm({...newsForm, title: e.target.value})} className="bg-background border-white/10" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="n-date">Date</Label>
                      <Input id="n-date" type="date" value={newsForm.date} onChange={(e) => setNewsForm({...newsForm, date: e.target.value})} className="bg-background border-white/10" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="n-cat">Category</Label>
                      <select id="n-cat" value={newsForm.category} onChange={(e) => setNewsForm({...newsForm, category: e.target.value as any})} className="w-full h-10 px-3 rounded-md bg-background border border-white/10 text-sm">
                        <option>Match Result</option>
                        <option>Announcement</option>
                        <option>Tournament</option>
                        <option>Notice</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="n-img">Image URL</Label>
                    <Input id="n-img" value={newsForm.imageUrl} onChange={(e) => setNewsForm({...newsForm, imageUrl: e.target.value})} className="bg-background border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="n-content">Content</Label>
                    <textarea id="n-content" value={newsForm.content} onChange={(e) => setNewsForm({...newsForm, content: e.target.value})} className="w-full min-h-[150px] p-3 rounded-md bg-background border border-white/10 text-sm" required />
                  </div>
                  <DialogFooter className="pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsNewsDialogOpen(false)}>Cancel</Button>
                    <Button type="submit" className="bg-primary text-primary-foreground">
                      {editingNews ? "Update Article" : "Publish Article"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-4">
            {news.map((item) => (
              <Card key={item.id} className="border-white/5 bg-card/50">
                <CardContent className="p-4 flex items-center gap-6">
                  <div className="h-20 w-32 rounded-lg overflow-hidden bg-muted shrink-0">
                    <img src={item.imageUrl || `https://picsum.photos/seed/${item.id}/200/150`} alt="News" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold line-clamp-1">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">Published on {item.date}</p>
                    <Badge variant="outline" className="mt-2 text-[10px] border-white/10">{item.category}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-primary" onClick={() => openNewsDialog(item)}><Edit2 className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleDeleteNews(item.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {news.length === 0 && (
              <div className="p-12 text-center text-muted-foreground">No news articles yet.</div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold italic">Gallery Photos</h2>
            <Dialog open={isGalleryDialogOpen} onOpenChange={setIsGalleryDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground">
                  <Plus className="mr-2 h-4 w-4" /> Upload Photo
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-white/10 text-foreground">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold italic">Upload Photo</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSaveGallery} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="g-url">Image URL</Label>
                    <Input id="g-url" value={galleryForm.imageUrl} onChange={(e) => setGalleryForm({...galleryForm, imageUrl: e.target.value})} className="bg-background border-white/10" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="g-cat">Category</Label>
                    <select id="g-cat" value={galleryForm.category} onChange={(e) => setGalleryForm({...galleryForm, category: e.target.value as any})} className="w-full h-10 px-3 rounded-md bg-background border border-white/10 text-sm">
                      <option>Match</option>
                      <option>Training</option>
                      <option>Celebrations</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="g-date">Date</Label>
                    <Input id="g-date" type="date" value={galleryForm.date} onChange={(e) => setGalleryForm({...galleryForm, date: e.target.value})} className="bg-background border-white/10" required />
                  </div>
                  <DialogFooter className="pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsGalleryDialogOpen(false)}>Cancel</Button>
                    <Button type="submit" className="bg-primary text-primary-foreground">Upload</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {gallery.map((photo) => (
              <div key={photo.id} className="group relative aspect-square rounded-xl overflow-hidden bg-muted">
                <img src={photo.imageUrl} alt="Gallery" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:text-destructive" onClick={() => handleDeleteGallery(photo.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute bottom-2 left-2">
                  <Badge className="bg-black/50 backdrop-blur text-[8px] px-1 py-0 border-none">{photo.category}</Badge>
                </div>
              </div>
            ))}
            {gallery.length === 0 && (
              <div className="col-span-full p-12 text-center text-muted-foreground">No photos in the gallery.</div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
