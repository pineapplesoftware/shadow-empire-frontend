
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Image, Type, Download, Share2, Search, Filter, Eye } from "lucide-react";
import { toast } from "sonner";

interface GalleryProps {
  content: any[];
}

const Gallery = ({ content }: GalleryProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedContent, setSelectedContent] = useState<any>(null);

  const filteredContent = content.filter((item) => {
    const matchesSearch = searchTerm === "" || 
      (item.prompt?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.topic?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.content?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterType === "all" || item.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const downloadContent = (item: any) => {
    if (item.type === "image") {
      const link = document.createElement("a");
      link.href = item.url;
      link.download = `shadow-empire-${item.id}.jpg`;
      link.click();
    } else {
      const blob = new Blob([item.content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `shadow-empire-text-${item.id}.txt`;
      link.click();
      URL.revokeObjectURL(url);
    }
    toast.success("Contenido descargado");
  };

  const shareContent = (item: any) => {
    if (navigator.share) {
      navigator.share({
        title: "Shadow Empire Content",
        text: item.type === "image" ? item.prompt : item.content,
        url: item.type === "image" ? item.url : undefined,
      });
    } else {
      navigator.clipboard.writeText(
        item.type === "image" ? item.url : item.content
      );
      toast.success("Enlace copiado al portapapeles");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gradient mb-2">
            Galería de Contenido
          </h2>
          <p className="text-empire-silver/70">
            Todo tu contenido creado en un solo lugar
          </p>
        </div>

        {/* Controles de Búsqueda y Filtros */}
        <Card className="empire-card mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-empire-silver/50" />
              <Input
                placeholder="Buscar contenido..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-empire-dark/50 border-empire-gold/20 text-empire-silver"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-empire-gold" />
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40 bg-empire-dark/50 border-empire-gold/20 text-empire-silver">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-empire-dark border-empire-gold/20">
                  <SelectItem value="all" className="text-empire-silver">Todos</SelectItem>
                  <SelectItem value="image" className="text-empire-silver">Imágenes</SelectItem>
                  <SelectItem value="text" className="text-empire-silver">Textos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="empire-card text-center">
            <Image className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-empire-gold">
              {content.filter(item => item.type === "image").length}
            </p>
            <p className="text-empire-silver/70">Imágenes</p>
          </Card>
          <Card className="empire-card text-center">
            <Type className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-empire-gold">
              {content.filter(item => item.type === "text").length}
            </p>
            <p className="text-empire-silver/70">Textos</p>
          </Card>
          <Card className="empire-card text-center">
            <Share2 className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-empire-gold">
              {content.length}
            </p>
            <p className="text-empire-silver/70">Total</p>
          </Card>
        </div>

        {/* Grid de Contenido */}
        {filteredContent.length === 0 ? (
          <Card className="empire-card text-center py-16">
            {content.length === 0 ? (
              <>
                <Share2 className="w-16 h-16 mx-auto text-empire-gold/50 mb-4" />
                <p className="text-empire-silver/50 mb-2">Tu galería está vacía</p>
                <p className="text-empire-silver/30">Crea contenido para verlo aquí</p>
              </>
            ) : (
              <>
                <Search className="w-16 h-16 mx-auto text-empire-gold/50 mb-4" />
                <p className="text-empire-silver/50">No se encontraron resultados</p>
                <p className="text-empire-silver/30">Prueba con otros términos de búsqueda</p>
              </>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((item) => (
              <Card key={item.id} className="empire-card group hover:scale-105 transition-transform duration-300">
                <div className="space-y-4">
                  {/* Preview */}
                  <div className="relative aspect-square bg-empire-dark/30 rounded-lg overflow-hidden">
                    {item.type === "image" ? (
                      <img
                        src={item.url}
                        alt="Content preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="p-4 h-full flex items-center justify-center">
                        <div className="text-center">
                          <Type className="w-12 h-12 text-empire-gold mx-auto mb-2" />
                          <p className="text-empire-silver/80 text-sm line-clamp-4">
                            {item.content.substring(0, 150)}...
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button
                        onClick={() => setSelectedContent(item)}
                        className="bg-empire-gold text-empire-dark hover:bg-empire-gold/90"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Detalle
                      </Button>
                    </div>
                  </div>

                  {/* Info */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.type === "image" 
                          ? "bg-blue-500/20 text-blue-400" 
                          : "bg-green-500/20 text-green-400"
                      }`}>
                        {item.type === "image" ? "Imagen" : "Texto"}
                      </span>
                      <span className="text-empire-silver/50 text-xs">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-empire-silver font-medium truncate">
                      {item.type === "image" ? item.prompt : item.topic}
                    </p>
                    {item.platform && (
                      <p className="text-empire-silver/50 text-sm">
                        Para: {item.platform}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => downloadContent(item)}
                      size="sm"
                      className="flex-1 bg-purple-gradient text-white hover:scale-105 transition-transform duration-300"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Descargar
                    </Button>
                    <Button
                      onClick={() => shareContent(item)}
                      size="sm"
                      variant="outline"
                      className="flex-1 border-empire-gold/30 text-empire-gold hover:bg-empire-gold/10"
                    >
                      <Share2 className="w-3 h-3 mr-1" />
                      Compartir
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Modal de Detalle */}
        {selectedContent && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="empire-card max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-empire-gold">
                    Detalle del Contenido
                  </h3>
                  <Button
                    onClick={() => setSelectedContent(null)}
                    variant="outline"
                    size="sm"
                    className="border-empire-gold/30 text-empire-gold"
                  >
                    Cerrar
                  </Button>
                </div>

                {selectedContent.type === "image" ? (
                  <div className="space-y-4">
                    <img
                      src={selectedContent.url}
                      alt="Content detail"
                      className="w-full rounded-lg"
                    />
                    <div>
                      <p className="text-empire-gold font-medium mb-2">Prompt:</p>
                      <p className="text-empire-silver/80">{selectedContent.prompt}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className="text-empire-gold font-medium mb-2">Tema:</p>
                      <p className="text-empire-silver/80">{selectedContent.topic}</p>
                    </div>
                    <div>
                      <p className="text-empire-gold font-medium mb-2">Contenido:</p>
                      <div className="bg-empire-dark/30 rounded-lg p-4 border border-empire-gold/10">
                        <pre className="text-empire-silver/80 whitespace-pre-wrap font-sans text-sm">
                          {selectedContent.content}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3">
                  <Button
                    onClick={() => downloadContent(selectedContent)}
                    className="flex-1 bg-purple-gradient text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Descargar
                  </Button>
                  <Button
                    onClick={() => shareContent(selectedContent)}
                    variant="outline"
                    className="flex-1 border-empire-gold/30 text-empire-gold hover:bg-empire-gold/10"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Compartir
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
