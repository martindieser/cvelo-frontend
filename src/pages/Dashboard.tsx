import { useState } from "react";
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
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ResumePreview from "@/components/dashboard/ResumePreview";
import InsightsPanel from "@/components/dashboard/InsightsPanel";
import TailorCV from "@/components/dashboard/TailorCV";
import PersonalInfo from "@/components/dashboard/PersonalInfo";
import MyDocuments from "@/components/dashboard/MyDocuments";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("tailor");
  const [jobName, setJobName] = useState("Mercado Libre");
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [isTailored, setIsTailored] = useState(false);

  const handleAdaptCV = (description: string) => {
    // Aquí iría la lógica de llamada a la API o procesamiento
    console.log("Adaptando CV con descripción:", description);
    setIsTailored(true);
  };

  const handleViewDocument = (doc: any) => {
    setJobName(doc.companyName);
    setIsTailored(true);
    setActiveTab("tailor");
  };

  const handleBackToTailor = () => {
    setIsTailored(false);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden font-body">
      {/* SIDEBAR (Desktop fixed, Mobile hidden + Sheet) */}
      <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-muted/20">
        <DashboardHeader onAvatarClick={() => setIsAvatarDialogOpen(true)} />

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-[1600px] mx-auto flex flex-col xl:flex-row gap-8">
            
            {activeTab === "tailor" ? (
              !isTailored ? (
                <TailorCV onAdapt={handleAdaptCV} />
              ) : (
                <>
                  {/* CENTRAL RESUME VIEW */}
                  <ResumePreview jobName={jobName} onBack={handleBackToTailor} />

                  {/* RIGHT PANEL (Desktop sidebar, Mobile bottom sheet) */}
                  <InsightsPanel />
                </>
              )
            ) : activeTab === "info" ? (
              <PersonalInfo />
            ) : activeTab === "docs" ? (
              <MyDocuments onView={handleViewDocument} />
            ) : (
              <div className="flex-1 flex items-center justify-center h-[60vh] text-muted-foreground border-2 border-dashed border-border rounded-3xl">
                Sección {activeTab} en desarrollo...
              </div>
            )}
            
          </div>
          
          {/* Bottom padding for mobile floating buttons context */}
          <div className="h-20 lg:hidden" />
        </div>
      </main>

      {/* SHARED DIALOGS */}
      <AlertDialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
        <AlertDialogContent className="rounded-2xl border-border w-[90vw] max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">¿Deseas agregar una foto?</AlertDialogTitle>
            <div className="text-muted-foreground space-y-4 pt-2 text-sm lg:text-base">
              <p>
                Al subir una foto, esta se guardará en tu perfil y se incluirá automáticamente en tus **próximas generaciones de currículums**.
              </p>
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800 text-sm">
                <span className="font-bold">Nota importante:</span> El uso de fotografía en un CV depende del mercado (país) y la industria a la que aplique. En algunos mercados (como EE.UU. o UK) no es recomendable.
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 mt-4 flex-col sm:flex-row">
            <AlertDialogCancel className="rounded-xl font-bold border-border w-full sm:w-auto">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              className="rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
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

      {/* Hidden inputs */}
      <input 
        type="file" 
        id="avatar-upload" 
        className="hidden" 
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) console.log("Foto seleccionada:", file.name);
        }}
      />
    </div>
  );
};

export default Dashboard;
