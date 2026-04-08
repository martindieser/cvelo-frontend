import { useOutletContext } from "react-router-dom";
import ResumePreview from "@/components/dashboard/ResumePreview";
import InsightsPanel from "@/components/dashboard/InsightsPanel";
import ResumeEnhancerFlow from "@/components/dashboard/ResumeEnhancerFlow";
import LoadingScreen from "@/components/LoadingScreen";
import { TailoredResumeViewModel } from "@/lib/viewmodels";

interface DashboardContext {
  profile: any;
  handleBackToTailor: () => void;
  currentTailoredResume: TailoredResumeViewModel | null;
  setCurrentTailoredResume: (resume: TailoredResumeViewModel | null) => void;
  tailoringLoading: boolean;
  isViewingSpecificDoc: boolean;
  activeHighlight: string | null;
  setActiveHighlight: (id: string | null) => void;
  refreshResumes: () => void;
}

const TailorSection = () => {
  const { 
    profile, 
    handleBackToTailor, 
    currentTailoredResume, 
    setCurrentTailoredResume, 
    tailoringLoading, 
    isViewingSpecificDoc, 
    activeHighlight, 
    setActiveHighlight,
    refreshResumes
  } = useOutletContext<DashboardContext>();

  if (currentTailoredResume) {
    return (
      <div className="flex flex-col xl:flex-row gap-4 lg:gap-8 w-full animate-in fade-in duration-500">
        <ResumePreview 
          onBack={handleBackToTailor} 
          data={currentTailoredResume}
          activeHighlight={activeHighlight}
          onHighlightClick={setActiveHighlight}
        />
        <InsightsPanel 
          keywords={currentTailoredResume.detectedKeywords} 
          changes={currentTailoredResume.appliedChanges} 
          activeHighlight={activeHighlight}
          onHighlightClick={setActiveHighlight}
        />
      </div>
    );
  }

  if (tailoringLoading || (isViewingSpecificDoc && !currentTailoredResume)) {
    return (
      <div className="flex-1 min-h-[60vh] flex items-center justify-center">
        <LoadingScreen fullScreen={false} message="Cargando documento..." />
      </div>
    );
  }

  if (profile) {
    return (
      <ResumeEnhancerFlow 
        profile={profile} 
        onComplete={(resume) => {
          setCurrentTailoredResume(resume);
          refreshResumes();
        }}
      />
    );
  }

  return null;
};

export default TailorSection;
