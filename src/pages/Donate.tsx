import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Heart, Smartphone, Landmark, CheckCircle2 } from "lucide-react";
import React, { useState } from "react";

export default function Donate() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="container py-20 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 text-primary mb-6"
        >
          <Heart className="h-10 w-10 fill-primary" />
        </motion.div>
        <h1 className="text-5xl font-black italic mb-4">SUPPORT THE STARS</h1>
        <p className="text-xl text-muted-foreground">
          Your contributions help us with equipment, travel, and nurturing the next generation of football talent.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Payment Info */}
        <div className="space-y-8">
          <Card className="border-primary/20 bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Smartphone className="h-5 w-5" /> M-PESA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-muted-foreground">Paybill Number</span>
                <span className="font-mono font-bold text-lg">123456</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-muted-foreground">Account Name</span>
                <span className="font-mono font-bold text-lg">OLODO STARS</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Till Number</span>
                <span className="font-mono font-bold text-lg">987654</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Landmark className="h-5 w-5" /> BANK TRANSFER
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-muted-foreground">Bank Name</span>
                <span className="font-bold">KCB Bank</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-muted-foreground">Account Number</span>
                <span className="font-mono font-bold">0112233445566</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Branch</span>
                <span className="font-bold">Olodo Branch</span>
              </div>
            </CardContent>
          </Card>

          <div className="p-6 rounded-2xl bg-primary text-primary-foreground text-center font-bold italic">
            "Every contribution helps the team grow 💪"
          </div>
        </div>

        {/* Donation Form */}
        <div>
          {submitted ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full flex flex-col items-center justify-center text-center p-8 border rounded-3xl bg-card"
            >
              <CheckCircle2 className="h-16 w-16 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
              <p className="text-muted-foreground mb-6">
                Your pledge has been recorded. Please complete the payment using the details provided.
              </p>
              <Button onClick={() => setSubmitted(false)} variant="outline">Make another donation</Button>
            </motion.div>
          ) : (
            <Card className="border-white/10 bg-card/50 h-full">
              <CardHeader>
                <CardTitle>Donation Pledge</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name (Optional)</Label>
                    <Input id="name" placeholder="John Doe" className="bg-background border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (KES)</Label>
                    <Input id="amount" type="number" placeholder="1000" className="bg-background border-white/10" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <textarea 
                      id="message" 
                      className="w-full min-h-[120px] rounded-md border border-white/10 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      placeholder="Good luck team!"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-6 text-lg">
                    Submit Pledge
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
