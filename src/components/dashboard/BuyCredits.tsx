import { useState } from "react";
import { 
  CreditCard, 
  Plus, 
  Minus, 
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const BuyCredits = () => {
  const [amount, setAmount] = useState(1);
  const pricePerCredit = 3000;
  const totalPrice = amount * pricePerCredit;

  const increment = () => amount < 10 && setAmount(amount + 1);
  const decrement = () => amount > 1 && setAmount(amount - 1);

  return (
    <div className="space-y-6 py-1">
      <div className="flex flex-col items-center justify-center space-y-5">
        <div className="flex items-center gap-5">
          <Button 
            variant="outline" 
            size="icon" 
            className="w-9 h-9 rounded-xl border-2 hover:bg-primary/5 hover:border-primary/30 transition-all active:scale-95"
            onClick={decrement}
            disabled={amount <= 1}
          >
            <Minus className="w-4 h-4" />
          </Button>
          
          <div className="text-center min-w-[70px]">
            <span className="text-5xl font-black tracking-tighter text-primary">{amount}</span>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Créditos</p>
          </div>

          <Button 
            variant="outline" 
            size="icon" 
            className="w-9 h-9 rounded-xl border-2 hover:bg-primary/5 hover:border-primary/30 transition-all active:scale-95"
            onClick={increment}
            disabled={amount >= 10}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="w-full max-w-[200px] bg-muted/30 rounded-full p-1 flex gap-0.5 border border-border/50">
          {[...Array(10)].map((_, i) => (
            <div 
              key={i} 
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < amount ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2.5 pt-5 border-t border-dashed border-border">
        <div className="flex justify-between items-center text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
          <span>Subtotal ({amount} x ${pricePerCredit.toLocaleString()})</span>
          <Badge variant="outline" className="h-5 px-2 text-[9px] font-bold border-primary/20 text-primary bg-primary/5 rounded-md">
            ${pricePerCredit.toLocaleString()} c/u
          </Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-foreground/80">Total a pagar</span>
          <span className="text-2xl font-black text-primary tracking-tight">${totalPrice.toLocaleString()}</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <Button className="w-full py-5 rounded-xl font-bold text-base gap-2.5 shadow-md shadow-primary/10 transition-all hover:scale-[1.01] active:scale-[0.99] h-auto bg-primary hover:bg-primary/90">
          <CreditCard className="w-4 h-4" />
          Pagar con Mercado Pago
        </Button>
        
        <div className="flex items-center justify-center gap-1.5 text-[9px] text-muted-foreground uppercase tracking-widest font-bold">
          <ShieldCheck className="w-3 h-3 text-primary/70" />
          Transacción Segura
        </div>
      </div>
    </div>
  );
};

export default BuyCredits;
