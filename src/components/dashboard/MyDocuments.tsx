import { useState, useEffect } from "react";
import { 
  Search, 
  FileText, 
  Download, 
  Trash2, 
  Pencil, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical,
  Calendar,
  Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import { AdaptedResumeViewModel } from "@/lib/viewmodels";

interface MyDocumentsProps {
  initialDocuments: AdaptedResumeViewModel[];
  onView: (doc: AdaptedResumeViewModel) => void;
}

const MyDocuments = ({ initialDocuments, onView }: MyDocumentsProps) => {
  // Estado interno manejado por el propio componente
  const [documents, setDocuments] = useState<AdaptedResumeViewModel[]>(initialDocuments);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Estado para edición
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<AdaptedResumeViewModel | null>(null);
  const [tempNames, setTempNames] = useState({ company: "", resume: "" });

  // Sincronizar si la data externa cambia (ej: se genera uno nuevo)
  useEffect(() => {
    setDocuments(initialDocuments);
  }, [initialDocuments]);

  // Filtrado y Paginación
  const filteredDocs = documents.filter(doc => 
    doc.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.resumeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDocs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDocs = filteredDocs.slice(startIndex, startIndex + itemsPerPage);

  // Handlers
  const handleDelete = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const openEditDialog = (doc: AdaptedResumeViewModel) => {
    setEditingDoc(doc);
    setTempNames({ company: doc.companyName, resume: doc.resumeName });
    setIsEditDialogOpen(true);
  };

  const saveEdit = () => {
    if (editingDoc) {
      setDocuments(documents.map(doc => 
        doc.id === editingDoc.id 
          ? { ...doc, companyName: tempNames.company, resumeName: tempNames.resume } 
          : doc
      ));
      setIsEditDialogOpen(false);
    }
  };

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500 font-body">
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-3xl font-bold tracking-tight">Mis Documentos</h1>
        <p className="text-muted-foreground">
          Historial de currículums adaptados. Puedes editarlos, descargarlos o eliminarlos.
        </p>
      </div>

      {/* BARRA DE BÚSQUEDA */}
      <div className="relative group max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input 
          placeholder="Buscar por empresa o nombre..." 
          className="pl-12 h-12 rounded-2xl border-border focus:ring-primary/20 text-base shadow-sm"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); 
          }}
        />
      </div>

      {/* LISTA DE DOCUMENTOS */}
      <div className="space-y-4">
        {currentDocs.length > 0 ? (
          currentDocs.map((doc) => (
            <Card 
              key={doc.id} 
              className="border-border hover:border-primary/30 transition-all hover:shadow-md rounded-2xl overflow-hidden group cursor-pointer"
              onClick={() => onView(doc)}
            >
              <CardContent className="p-4 lg:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <h3 className="font-bold text-base lg:text-lg truncate">{doc.resumeName}</h3>
                    <div className="flex items-center gap-3 text-xs lg:text-sm text-muted-foreground font-medium">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5" /> {doc.companyName}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {doc.date}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end sm:justify-start">
                  <Button variant="outline" size="sm" className="gap-2 rounded-xl font-bold h-10 border-border hover:bg-muted hidden md:flex">
                    <Download className="w-4 h-4" /> Descargar
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-xl hover:bg-primary/10 hover:text-primary h-10 w-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditDialog(doc);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-xl hover:bg-destructive/10 hover:text-destructive h-10 w-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(doc.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    
                    <div className="md:hidden">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl border-border">
                          <DropdownMenuItem className="gap-2 font-medium">
                            <Download className="w-4 h-4" /> Descargar PDF
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-20 bg-muted/20 border-2 border-dashed border-border rounded-3xl">
            <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold">No se encontraron documentos</h3>
            <p className="text-muted-foreground text-sm">Prueba buscando con otro nombre.</p>
          </div>
        )}
      </div>

      {/* PAGINACIÓN */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-xl border-border h-10 w-10"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                  currentPage === i + 1 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110" 
                    : "hover:bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-xl border-border h-10 w-10"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* DIÁLOGO DE EDICIÓN */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="rounded-2xl w-[90vw] max-w-md border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-left">Editar detalles</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 text-left">
            <div className="space-y-2">
              <Label htmlFor="resume-name" className="text-xs font-bold uppercase text-muted-foreground">Nombre del documento</Label>
              <Input 
                id="resume-name" 
                value={tempNames.resume} 
                onChange={(e) => setTempNames({...tempNames, resume: e.target.value})} 
                className="rounded-xl h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-name" className="text-xs font-bold uppercase text-muted-foreground">Empresa</Label>
              <Input 
                id="company-name" 
                value={tempNames.company} 
                onChange={(e) => setTempNames({...tempNames, company: e.target.value})} 
                className="rounded-xl h-12"
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" className="rounded-xl font-bold" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button className="rounded-xl font-bold" onClick={saveEdit}>
              Guardar cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyDocuments;
