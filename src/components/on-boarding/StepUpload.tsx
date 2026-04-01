import { Upload, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StepUploadProps {
  file: File | null;
  fileId: string | null;
  apiStatus: string;
  apiError: string | null;
  onFileUpload: (file: File) => void;
}

const StepUpload = ({ file, fileId, apiStatus, apiError, onFileUpload }: StepUploadProps) => {
  const isError = apiStatus === "error" && apiError;
  const isUploading = apiStatus === "uploading";

  return (
    <div className="space-y-4">
      <div className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all bg-muted/20 relative group 
        ${fileId ? "cursor-default border-primary/30" : "hover:border-primary/50 cursor-pointer"}
        ${isError ? "border-destructive/50 bg-destructive/5" : "border-border"}
      `}>
        
        {!fileId && !isUploading && (
          <Input
            type="file"
            className="hidden"
            id="cv-upload"
            accept=".pdf,.docx"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];
              if (selectedFile) onFileUpload(selectedFile);
            }}
          />
        )}

        <Label htmlFor={fileId || isUploading ? "" : "cv-upload"} className={`space-y-4 block ${fileId || isUploading ? "cursor-default" : "cursor-pointer"}`}>
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto transition-all duration-300
            ${fileId ? "bg-primary/10 text-primary shadow-inner" : 
              isError ? "bg-destructive/10 text-destructive" : 
              isUploading ? "bg-primary/5 text-primary" : "bg-primary/10 text-primary"}
          `}>
            {fileId ? (
              <CheckCircle2 className="w-8 h-8 animate-in zoom-in-50 duration-300" />
            ) : isUploading ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : isError ? (
              <AlertCircle className="w-8 h-8" />
            ) : (
              <Upload className="w-8 h-8 group-hover:-translate-y-1 transition-transform" />
            )}
          </div>

          <div className="space-y-1">
            <p className={`font-bold text-lg transition-colors ${isError ? "text-destructive" : ""}`}>
              {isUploading ? "Subiendo archivo..." : 
               fileId ? file?.name : 
               isError ? "Ocurrió un error al subir" : 
               file ? file.name : "Sube tu CV actual"}
            </p>
            <p className="text-sm text-muted-foreground">
              {isUploading ? "Casi listo..." :
               fileId ? "Cargado correctamente" : 
               isError ? apiError : "Formatos PDF o DOCX admitidos"}
            </p>
          </div>

          {fileId && (
            <div className="pt-2">
              <span className="text-[10px] text-green-600 font-black uppercase tracking-widest bg-green-50 py-1 px-3 rounded-full border border-green-100">
                ✓ Listo para procesar
              </span>
            </div>
          )}

          {isError && (
            <p className="text-[10px] text-destructive font-black uppercase tracking-tighter mt-2 animate-pulse">
              Haz clic para intentar de nuevo
            </p>
          )}
        </Label>
      </div>
    </div>
  );
};

export default StepUpload;
