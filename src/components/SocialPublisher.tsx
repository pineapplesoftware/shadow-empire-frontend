
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Share2, Send, Clock, CheckCircle, Youtube } from "lucide-react";
import { toast } from "sonner";

interface SocialPublisherProps {
  content: any[];
}

const SocialPublisher = ({ content }: SocialPublisherProps) => {
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [scheduleTime, setScheduleTime] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  const platforms = [
    { id: "instagram", name: "Instagram", color: "from-pink-500 to-purple-600", icon: "📷" },
    { id: "twitter", name: "Twitter", color: "from-blue-400 to-blue-600", icon: "🐦" },
    { id: "facebook", name: "Facebook", color: "from-blue-600 to-blue-800", icon: "📘" },
    { id: "linkedin", name: "LinkedIn", color: "from-blue-700 to-blue-900", icon: "💼" },
    { id: "youtube", name: "YouTube", color: "from-red-500 to-red-700", icon: "📺" },
    { id: "tiktok", name: "TikTok", color: "from-gray-800 to-black", icon: "🎵" },
  ];

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const publishContent = async () => {
    if (!selectedContent) {
      toast.error("Selecciona contenido para publicar");
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast.error("Selecciona al menos una plataforma");
      return;
    }

    setIsPublishing(true);
    console.log("Publicando contenido:", { selectedContent, selectedPlatforms, scheduleTime });

    try {
      // Simular publicación
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Si hay webhook, enviarlo
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "no-cors",
          body: JSON.stringify({
            content: selectedContent,
            platforms: selectedPlatforms,
            scheduleTime: scheduleTime,
            timestamp: new Date().toISOString(),
            source: "Shadow Empire",
          }),
        });
      }

      toast.success(`Contenido ${scheduleTime ? 'programado' : 'publicado'} exitosamente en ${selectedPlatforms.length} plataforma(s)`);
      setSelectedPlatforms([]);
      setScheduleTime("");
    } catch (error) {
      console.error("Error en publicación:", error);
      toast.error("Error al publicar el contenido");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gradient mb-2">
            Publicador de Redes Sociales
          </h2>
          <p className="text-empire-silver/70">
            Publica tu contenido en todas las plataformas simultáneamente
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Selección de Contenido */}
          <Card className="empire-card lg:col-span-1">
            <h3 className="text-lg font-semibold text-empire-gold mb-4">
              Contenido Disponible
            </h3>
            <div className="space-y-3">
              {content.length === 0 ? (
                <p className="text-empire-silver/50 text-center py-8">
                  No hay contenido disponible. Crea contenido primero en las secciones de Imágenes o Texto.
                </p>
              ) : (
                content.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedContent(item)}
                    className={`w-full text-left p-3 rounded-lg border transition-all duration-300 ${
                      selectedContent?.id === item.id
                        ? "border-empire-gold bg-empire-gold/10"
                        : "border-empire-gold/20 hover:border-empire-gold/40"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {item.type === "image" ? (
                        <img src={item.url} alt="Preview" className="w-12 h-12 rounded object-cover" />
                      ) : (
                        <div className="w-12 h-12 bg-purple-gradient rounded flex items-center justify-center">
                          <Share2 className="w-6 h-6 text-white" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-empire-silver font-medium truncate">
                          {item.type === "image" ? item.prompt : item.topic}
                        </p>
                        <p className="text-empire-silver/50 text-sm">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </Card>

          {/* Configuración de Publicación */}
          <Card className="empire-card lg:col-span-2">
            <h3 className="text-lg font-semibold text-empire-gold mb-4">
              Configurar Publicación
            </h3>
            
            <div className="space-y-6">
              {/* Selección de Plataformas */}
              <div>
                <label className="block text-sm font-medium text-empire-gold mb-3">
                  Plataformas de Destino
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => togglePlatform(platform.id)}
                      className={`p-4 rounded-lg border transition-all duration-300 ${
                        selectedPlatforms.includes(platform.id)
                          ? "border-empire-gold bg-empire-gold/10"
                          : "border-empire-gold/20 hover:border-empire-gold/40"
                      }`}
                    >
                      <div className={`w-8 h-8 bg-gradient-to-r ${platform.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                        <span className="text-white text-sm">{platform.icon}</span>
                      </div>
                      <p className="text-empire-silver text-sm font-medium">
                        {platform.name}
                      </p>
                      {selectedPlatforms.includes(platform.id) && (
                        <CheckCircle className="w-4 h-4 text-empire-gold mx-auto mt-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Programación */}
              <div>
                <label className="block text-sm font-medium text-empire-gold mb-2">
                  Programar Publicación (Opcional)
                </label>
                <Input
                  type="datetime-local"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="bg-empire-dark/50 border-empire-gold/20 text-empire-silver"
                />
              </div>

              {/* Webhook de Zapier */}
              <div>
                <label className="block text-sm font-medium text-empire-gold mb-2">
                  Webhook de Zapier (Opcional)
                </label>
                <Input
                  type="url"
                  placeholder="https://hooks.zapier.com/hooks/catch/..."
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="bg-empire-dark/50 border-empire-gold/20 text-empire-silver"
                />
                <p className="text-xs text-empire-silver/50 mt-1">
                  Conecta con Zapier para automatizar publicaciones adicionales
                </p>
              </div>

              {/* Vista Previa del Contenido */}
              {selectedContent && (
                <div>
                  <label className="block text-sm font-medium text-empire-gold mb-2">
                    Vista Previa
                  </label>
                  <div className="bg-empire-dark/30 rounded-lg p-4 border border-empire-gold/10">
                    {selectedContent.type === "image" ? (
                      <div className="space-y-3">
                        <img 
                          src={selectedContent.url} 
                          alt="Preview" 
                          className="w-full max-w-xs rounded-lg" 
                        />
                        <p className="text-empire-silver/80 text-sm">
                          {selectedContent.prompt}
                        </p>
                      </div>
                    ) : (
                      <Textarea
                        value={selectedContent.content}
                        readOnly
                        rows={6}
                        className="bg-transparent border-none text-empire-silver resize-none"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Botón de Publicación */}
              <Button
                onClick={publishContent}
                disabled={isPublishing || !selectedContent || selectedPlatforms.length === 0}
                className="w-full empire-button h-12 text-lg"
              >
                {isPublishing ? (
                  <>
                    <Clock className="w-5 h-5 mr-2 animate-spin" />
                    {scheduleTime ? "Programando..." : "Publicando..."}
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    {scheduleTime ? "Programar Publicación" : "Publicar Ahora"}
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SocialPublisher;
