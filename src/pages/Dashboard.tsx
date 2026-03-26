import { useState } from "react";
import { 
  LayoutDashboard, 
  User, 
  FileText, 
  Settings, 
  LogOut, 
  Plus, 
  Download, 
  ArrowLeft, 
  Check, 
  X, 
  Link as LinkIcon, 
  Pencil,
  Sparkles,
  Send,
  MoreVertical,
  Search,
  MessageSquare
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import logoMascot from "@/assets/logo-mascot.svg";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("tailor");
  const [jobName, setJobName] = useState("Mercado Libre");
  const [isEditing, setIsEditing] = useState(false);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden font-body">
      {/* SIDEBAR */}
      <aside className="w-64 bg-card border-r border-border flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <Link to="/" className="group flex items-center gap-2">
            <div className="w-10 h-10 transition-transform group-hover:scale-110">
              <img src={logoMascot} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-xl tracking-tight">CurriAI</span>
          </Link>
        </div>

        <div className="px-4 mb-4">
          <Button className="w-full justify-start gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl py-6 shadow-md shadow-primary/20">
            <Sparkles className="w-4 h-4" />
            <span>Plan Pro Ilimitado</span>
          </Button>
        </div>

        <nav className="flex-1 px-2 space-y-1">
          <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Principal
          </div>
          <button 
            onClick={() => setActiveTab("tailor")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "tailor" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Adaptar CV
          </button>
          <button 
            onClick={() => setActiveTab("info")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "info" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}
          >
            <User className="w-4 h-4" />
            Información Personal
          </button>
          <button 
            onClick={() => setActiveTab("docs")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "docs" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}
          >
            <FileText className="w-4 h-4" />
            Mis Documentos
          </button>

          <div className="px-4 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Sistema
          </div>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
            <Settings className="w-4 h-4" />
            Configuración
          </button>
          <Link to="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </Link>
        </nav>

        <div className="p-4 border-t border-border mt-auto">
          <div className="bg-muted/50 rounded-xl p-4 text-center">
            <p className="text-xs text-muted-foreground mb-2">¿Necesitas ayuda?</p>
            <a href="mailto:hola@curriai.co" className="text-xs font-bold text-primary hover:underline">hola@curriai.co</a>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-muted/20">
        {/* TOPBAR */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold px-4 py-1.5 rounded-full text-sm">
              Créditos: 2
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" className="gap-2 rounded-full px-5 font-bold">
              <Plus className="w-4 h-4" /> Adaptar nuevo CV
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm border border-primary/20 cursor-pointer hover:bg-primary/30 transition-colors outline-none">
                  JD
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl p-2 mt-2">
                <DropdownMenuItem 
                  className="rounded-lg gap-2 cursor-pointer py-2.5"
                  onClick={() => setIsAvatarDialogOpen(true)}
                >
                  <User className="w-4 h-4" />
                  <span>Elegir una foto</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
              <AlertDialogContent className="rounded-2xl border-border">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl font-bold">¿Deseas agregar una foto?</AlertDialogTitle>
                  <div className="text-muted-foreground space-y-4 pt-2">
                    <p>
                      Al subir una foto, esta se guardará en tu perfil y se incluirá automáticamente en tus **próximas generaciones de currículums**.
                    </p>
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800 text-sm">
                      <span className="font-bold">Nota importante:</span> El uso de fotografía en un CV depende del mercado (país) y la industria a la que apliques. En algunos mercados (como EE.UU. o UK) no es recomendable, mientras que en otros es estándar.
                    </div>
                  </div>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2 mt-4">
                  <AlertDialogCancel className="rounded-xl font-bold border-border">Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    className="rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => {
                      setIsAvatarDialogOpen(false);
                      setTimeout(() => {
                        document.getElementById('avatar-upload')?.click();
                      }, 100);
                    }}
                  >
                    Entendido, elegir foto
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <input 
              type="file" 
              id="avatar-upload" 
              className="hidden" 
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // Lógica para manejar la subida de la foto
                  console.log("Foto seleccionada:", file.name);
                }
              }}
            />
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-8 flex gap-8">
          <div className="flex-1 max-w-4xl space-y-6">
            <div className="flex items-center justify-between">
              <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" /> Volver a la lista
              </button>
              <Button variant="outline" className="gap-2 rounded-xl font-bold border-border hover:bg-card">
                <Download className="w-4 h-4" /> Descargar PDF
              </Button>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                CV ADAPTADO PARA
              </span>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl font-bold tracking-tight">{jobName}</h1>
                  <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors">
                    <Check className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* RESUME PREVIEW CARD */}
            <Card className="border-border shadow-xl rounded-2xl overflow-hidden bg-white">
              <div className="bg-muted/30 border-b border-border px-6 py-3 flex items-center justify-between">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/40"></div>
                  <div className="w-3 h-3 rounded-full bg-warning/40"></div>
                  <div className="w-3 h-3 rounded-full bg-primary/40"></div>
                </div>
                <Button variant="ghost" size="sm" className="text-xs h-8 gap-2 font-bold text-muted-foreground">
                  <Pencil className="w-3.5 h-3.5" /> Editar contenido
                </Button>
              </div>
              <CardContent className="p-12 space-y-8 text-[#2d3748]">
                {/* Header */}
                <div className="space-y-2 border-b-2 border-primary/20 pb-6">
                  <h2 className="text-3xl font-bold text-foreground">Juan Pérez</h2>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-medium">
                    <span>juan.perez@email.com</span>
                    <span>•</span>
                    <span>+34 600 000 000</span>
                    <span>•</span>
                    <a href="#" className="text-primary hover:underline">LinkedIn</a>
                    <a href="#" className="text-primary hover:underline">Portfolio</a>
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-primary uppercase tracking-widest">Resumen Profesional</h3>
                  <p className="text-base leading-relaxed">
                    Cuento con más de 2 años de experiencia en atención al cliente, manejo de POS y uso básico de computadoras de escritorio, donde cumplí procesos definidos con puntualidad y responsabilidad. Busco iniciar mi trayectoria en ingeniería de software y estoy dispuesto a aprender sobre desarrollo en la nube, programación, <mark className="bg-primary/20 text-foreground px-1 rounded">APIs</mark> y herramientas de <mark className="bg-primary/20 text-foreground px-1 rounded">monitoreo</mark> para aportar en entornos dinámicos y desafiantes.
                  </p>
                </div>

                {/* Experience */}
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-primary uppercase tracking-widest">Experiencia Laboral</h3>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-lg">Cajero <span className="font-medium text-muted-foreground">· Large Ducks Coffee</span></h4>
                        <span className="text-sm font-semibold text-muted-foreground">Junio 2023 – Actualidad</span>
                      </div>
                      <ul className="list-disc list-outside ml-4 space-y-2 text-sm leading-relaxed">
                        <li>Operé la caja registradora POS para cobrar a clientes y entregar cambio con precisión mientras preparaba alimentos y bebidas.</li>
                        <li>Manejé horarios de alta demanda mediante la multitarea y un servicio al cliente consistente, lo que se reflejó en múltiples reseñas de cinco estrellas.</li>
                        <li>Utilicé una computadora de escritorio para gestionar correo electrónico interno, completar capacitaciones en línea y administrar horarios de turnos.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Spacer for floating chat */}
            <div className="h-24"></div>
          </div>

          {/* RIGHT PANEL - Insights */}
          <aside className="w-80 shrink-0 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <Search className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Palabras clave detectadas</span>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4 flex flex-wrap gap-2 shadow-sm">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-3 py-1 rounded-full font-bold">monitoreo</Badge>
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-3 py-1 rounded-full font-bold">APIs</Badge>
                <Badge className="bg-muted text-muted-foreground border-none px-3 py-1 rounded-full font-bold italic opacity-50">+ Agregar</Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Cambios aplicados</span>
              </div>
              <div className="space-y-3">
                <Card className="border-border shadow-sm rounded-2xl overflow-hidden">
                  <div className="p-4 bg-muted/20 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <MessageSquare className="w-4 h-4 text-primary" />
                      Resumen
                    </div>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <p className="text-xs text-muted-foreground leading-relaxed pl-3 border-l-2 border-primary/30">
                      Se destacó explícitamente la experiencia en atención al cliente y manejo de POS, alineándola a cumplimiento de procesos.
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed pl-3 border-l-2 border-primary/30">
                      Se añadió una frase clara de búsqueda de inicio de trayectoria en ingeniería de software.
                    </p>
                    <div className="flex items-center gap-3 pt-2">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">¿Te sirvió?</span>
                      <div className="flex gap-2">
                        <button className="p-1.5 rounded-lg border border-border hover:border-primary/50 text-muted-foreground hover:text-primary transition-all">👍</button>
                        <button className="p-1.5 rounded-lg border border-border hover:border-destructive/50 text-muted-foreground hover:text-destructive transition-all">👎</button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
