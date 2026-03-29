import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useIsMobile } from '@/hooks/use-mobile';
import { Plus, Minus, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Configurar el worker de PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  url: string;
  highlights: string[];
}

const PDFViewer: React.FC<PDFViewerProps> = ({ url, highlights }) => {
  const isMobile = useIsMobile();
  const [numPages, setNumPages] = useState<number | null>(null);
  const [scale, setScale] = useState<number>(1.0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Ajustar escala inicial
  useEffect(() => {
    if (isMobile) setScale(0.8);
    else setScale(1.1);
  }, [isMobile]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    console.log("PDF cargado con éxito, páginas:", numPages);
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  }

  function onDocumentLoadError(err: Error) {
    console.error("Error al cargar el PDF:", err);
    setError(err.message);
    setLoading(false);
  }

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.2, 3.0));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.4));
  const handleResetZoom = () => setScale(isMobile ? 0.8 : 1.1);

  // Lógica de resaltado personalizada sobre la capa de texto de react-pdf
  useEffect(() => {
    if (loading) return;

    const timer = setTimeout(() => {
      const textLayers = document.querySelectorAll('.react-pdf__Page__textContent');
      const hasHighlights = highlights.length > 0;
      
      const searchTerms = hasHighlights 
        ? highlights.flatMap(h => h.toLowerCase().split(/[\s,.-]+/)).filter(w => w.length > 2)
        : [];

      textLayers.forEach(layer => {
        const spans = layer.querySelectorAll('span');

        spans.forEach((span: any) => {
          const text = span.textContent?.toLowerCase() || '';
          const isMatch = hasHighlights && searchTerms.some(term => text.includes(term));
          
          if (isMatch) {
            span.style.backgroundColor = 'rgba(255, 255, 0, 0.5)';
            span.style.borderRadius = '2px';
            span.style.boxShadow = '0 0 4px rgba(255, 255, 0, 0.8)';
          } else {
            span.style.backgroundColor = 'transparent';
            span.style.boxShadow = 'none';
          }
        });
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [highlights, scale, loading, numPages]);

  return (
    <div className="relative w-full h-full flex flex-col bg-muted/5 group">
      {/* Controles de Zoom */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-background/95 backdrop-blur-xl p-1.5 rounded-full border border-border shadow-2xl z-50 transition-all duration-300 opacity-90 group-hover:opacity-100 scale-90 md:scale-100">
        <Button variant="ghost" size="icon" onClick={handleZoomOut} className="h-8 w-8 rounded-full">
          <Minus className="h-4 w-4" />
        </Button>
        <button 
          onClick={handleResetZoom} 
          className="text-[10px] font-black min-w-[3.5rem] px-2 uppercase hover:text-primary transition-colors"
        >
          {Math.round(scale * 100)}%
        </button>
        <Button variant="ghost" size="icon" onClick={handleZoomIn} className="h-8 w-8 rounded-full">
          <Plus className="h-4 w-4" />
        </Button>
        <div className="w-[1px] h-4 bg-border/50 mx-0.5" />
        <Button variant="ghost" size="icon" onClick={handleResetZoom} className="h-8 w-8 rounded-full">
          <Maximize className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div ref={containerRef} className="flex-1 overflow-auto p-2 md:p-8 custom-scrollbar">
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          className="flex flex-col items-center"
          loading={
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Cargando PDF...</p>
            </div>
          }
          error={
            <div className="text-destructive font-bold p-8 text-center flex flex-col items-center gap-2">
              <p>Error al cargar el documento.</p>
              {error && <p className="text-[10px] font-mono opacity-70">{error}</p>}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.location.reload()}
                className="mt-2"
              >
                Reintentar
              </Button>
            </div>
          }
        >
          {numPages && Array.from(new Array(numPages), (el, index) => (
            <div key={`page_${index + 1}`} className="mb-8 shadow-2xl bg-white relative mx-auto w-fit">
              <Page
                pageNumber={index + 1}
                scale={scale}
                renderAnnotationLayer={false}
                loading={null}
                className="pdf-page"
              />
            </div>
          ))}
        </Document>
      </div>

      <style>{`
        .react-pdf__Page__textContent {
          z-index: 2 !important;
        }
        .react-pdf__Page__canvas {
          z-index: 1 !important;
          margin: 0 auto;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        }
        .pdf-page {
          max-width: 100%;
          transition: transform 0.2s ease-out;
        }
        /* Si la escala es mayor a 1 en mobile, permitimos scroll horizontal */
        @media (max-width: 768px) {
          .pdf-page {
             max-width: none;
          }
        }
      `}</style>
    </div>
  );
};

export default PDFViewer;
