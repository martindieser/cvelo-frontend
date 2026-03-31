import { useState } from "react";
import { 
  CreditCard, 
  Plus, 
  Minus, 
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ArrowLeft,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePayment } from "@/hooks/usePayment";
import LoadingScreen from "@/components/LoadingScreen";
import { useUserProfile } from "@/hooks/useUserProfile";

interface BuyCreditsProps {
  onClose?: () => void;
}

const BuyCredits = ({ onClose }: BuyCreditsProps) => {
  const [amount, setAmount] = useState(1);
  const { status, checkoutInfo, createPayment, resetPayment } = usePayment();
  const { updateProfile } = useUserProfile();
  
  const pricePerCredit = 3000;
  const totalPrice = amount * pricePerCredit;

  const handleSuccess = () => {
    resetPayment();
    if (onClose) onClose();
  };

  const handleCancel = () => {
    resetPayment();
  };

  const increment = () => amount < 10 && setAmount(amount + 1);
  const decrement = () => amount > 1 && setAmount(amount - 1);

  const handlePayment = async () => {
    await createPayment(amount.toString());
  };

  if (status === "creating") {
    return <LoadingScreen fullScreen={false} message="Iniciando pago" />;
  }

  if (status === "awaiting_payment") {
    return (
      <div className="flex flex-col items-center justify-center py-4 space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center space-y-1">
          <h3 className="text-lg font-black tracking-tight">Escanea para pagar</h3>
          <p className="text-xs text-muted-foreground font-medium">Usa tu app de banco o Mercado Pago</p>
        </div>

        {/* QR CONTAINER WITH SCANNING ANIMATION */}
        <div className="relative p-4 bg-white rounded-3xl shadow-xl border border-border group overflow-hidden">
          <div className="w-48 h-48 relative z-10">
            <img 
              src={checkoutInfo?.qr_code?.startsWith('data:') 
                ? checkoutInfo.qr_code 
                : `data:image/png;base64,${checkoutInfo?.qr_code}`} 
              alt="QR Code" 
              className="w-full h-full object-contain"
            />
          </div>
          {/* Animated Scanning Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-primary/40 shadow-[0_0_15px_rgba(var(--primary),0.5)] animate-scan-line z-20 pointer-events-none" />
          
          {/* Decorative Corners */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-primary/40 rounded-tl-lg" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-primary/40 rounded-tr-lg" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-primary/40 rounded-bl-lg" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-primary/40 rounded-br-lg" />
        </div>

        <div className="flex flex-col items-center gap-3 w-full">
          <div className="flex items-center gap-2 text-xs font-bold text-primary">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Verificando pago...
          </div>

          <div className="pt-4 w-full border-t border-dashed border-border flex flex-col items-center gap-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">¿No puedes escanear?</p>
            <Button 
              variant="outline" 
              className="w-full rounded-xl font-bold gap-2 text-sm border-2 hover:bg-primary/5 hover:border-primary/20 transition-all h-11"
              onClick={() => window.open(checkoutInfo?.invoice_url, "_blank")}
            >
              <ExternalLink className="w-4 h-4" />
              Pagar en el navegador
            </Button>
            <Button 
              variant="outline" 
              className="w-full rounded-xl font-bold gap-2 text-sm border-2 hover:bg-destructive/5 hover:border-destructive/20 hover:text-destructive transition-all h-11"
              onClick={handleCancel}
            >
              Rechazar pago
            </Button>
          </div>
        </div>

        <style>{`
          @keyframes scan {
            0% { transform: translateY(0); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(224px); opacity: 0; }
          }
          .animate-scan-line {
            animation: scan 3s linear infinite;
          }
        `}</style>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black tracking-tight">¡Pago acreditado!</h3>
          <p className="text-sm text-muted-foreground font-medium">
            Tus {amount} créditos han sido añadidos exitosamente.
          </p>
        </div>
        <Button className="rounded-xl font-bold w-full" onClick={handleSuccess}>
          ¡Genial!
        </Button>
      </div>
    );
  }

  if (status === "error" || status === "expired") {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-6 text-center animate-in fade-in zoom-in-95">
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center text-destructive">
          <AlertCircle className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black tracking-tight">Algo salió mal</h3>
          <p className="text-sm text-muted-foreground font-medium">
            {status === "expired" 
              ? "El tiempo de espera se ha agotado." 
              : "No pudimos procesar tu pago. Por favor, intenta de nuevo."}
          </p>
        </div>
        <Button variant="outline" className="rounded-xl font-bold w-full gap-2" onClick={resetPayment}>
          <ArrowLeft className="w-4 h-4" /> Volver a intentar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-1 animate-in fade-in duration-300">
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
        <Button 
          onClick={handlePayment}
          className="w-full py-5 rounded-xl font-bold text-base gap-2.5 shadow-md shadow-primary/10 transition-all hover:scale-[1.01] active:scale-[0.99] h-auto bg-primary hover:bg-primary/90"
        >
          <CreditCard className="w-4 h-4" />
          Comprar con Mercado Pago
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
