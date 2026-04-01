import LoadingScreen from "@/components/LoadingScreen";

const StepAnalysisSimulated = () => {
  return (
    <div className="py-12">
      <LoadingScreen fullScreen={false} message="La IA está analizando tu perfil" />
    </div>
  );
};

export default StepAnalysisSimulated;
