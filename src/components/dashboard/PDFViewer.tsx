import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Configurar el worker de forma compatible con Vite y PDF.js 4.x
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

interface PDFViewerProps {
  url: string;
  highlights: string[];
}

const PDFViewer: React.FC<PDFViewerProps> = ({ url, highlights }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRendered, setIsRendered] = useState<boolean>(false);

  // EFECTO 1: Renderizar el PDF (Solo cuando cambia la URL)
  useEffect(() => {
    const renderPDF = async () => {
      setLoading(true);
      setIsRendered(false);
      try {
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        setNumPages(pdf.numPages);

        if (containerRef.current) {
          containerRef.current.innerHTML = ''; // Limpiar previo
          
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 1.5 });
            
            const pageContainer = document.createElement('div');
            pageContainer.className = 'relative mb-4 shadow-lg mx-auto bg-white pdf-page';
            pageContainer.style.width = `${viewport.width}px`;
            pageContainer.style.height = `${viewport.height}px`;
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            pageContainer.appendChild(canvas);
            
            const textLayer = document.createElement('div');
            textLayer.className = 'textLayer absolute top-0 left-0 right-0 bottom-0 overflow-hidden opacity-10 pointer-events-none';
            textLayer.style.width = `${viewport.width}px`;
            textLayer.style.height = `${viewport.height}px`;
            pageContainer.appendChild(textLayer);

            containerRef.current.appendChild(pageContainer);

            if (context) {
              await page.render({ canvasContext: context, viewport }).promise;
            }

            const textContent = await page.getTextContent();
            const textLayerInstance = new pdfjsLib.TextLayer({
              textContentSource: textContent,
              container: textLayer,
              viewport,
            });
            await textLayerInstance.render();
          }
          setIsRendered(true);
        }
      } catch (error) {
        console.error('Error al cargar el PDF:', error);
      } finally {
        setLoading(false);
      }
    };

    renderPDF();
  }, [url]); // SOLO depende de la URL

  // EFECTO 2: Aplicar resaltados (Instantáneo, sin recargar PDF)
  useEffect(() => {
    if (!isRendered || !containerRef.current) return;

    const spans = containerRef.current.querySelectorAll('.textLayer span');
    
    spans.forEach((span: any) => {
      const text = span.textContent?.toLowerCase() || '';
      let isMatch = false;
      
      if (highlights.length > 0) {
        isMatch = highlights.some(word => 
          word && word.length > 3 && text.includes(word.toLowerCase())
        );
      }

      if (isMatch) {
        span.style.backgroundColor = 'rgba(255, 255, 0, 0.6)';
        span.style.borderRadius = '2px';
        span.style.boxShadow = '0 0 4px rgba(255, 255, 0, 0.8)';
        span.style.transition = 'all 0.2s ease';
      } else {
        span.style.backgroundColor = 'transparent';
        span.style.boxShadow = 'none';
      }
    });
  }, [highlights, isRendered]); // Depende de los highlights y de que el render esté listo

  return (
    <div className="w-full h-full overflow-y-auto p-4 bg-muted/30 custom-scrollbar rounded-2xl border border-border/50">
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
      <div ref={containerRef} className="pdf-viewer-container" />
      
      {/* Estilos mínimos necesarios para pdf.js textLayer */}
      <style>{`
        .textLayer {
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
          opacity: 0.2;
          line-height: 1.0;
        }
        .textLayer span {
          color: transparent;
          position: absolute;
          white-space: pre;
          cursor: text;
          transform-origin: 0% 0%;
        }
      `}</style>
    </div>
  );
};

export default PDFViewer;
