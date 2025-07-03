import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Video, Download, Wand2, Loader2, Settings } from "lucide-react";
import { toast } from "sonner";

interface VideoGeneratorProps {
  onContentGenerated: (content: any) => void;
  credits: number;
  onCreditsChange: (newCredits: number) => void;
}

const VideoGenerator = ({ onContentGenerated, credits, onCreditsChange }: VideoGeneratorProps) => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [n8nWebhookUrl, setN8nWebhookUrl] = useState("");

  const CREDITS_PER_VIDEO = 10;

  const generateVideo = async () => {
    if (!prompt.trim()) {
      toast.error("Por favor, ingresa una descripción para el video");
      return;
    }

    if (!n8nWebhookUrl.trim()) {
      toast.error("Por favor, configura la URL de tu webhook de n8n");
      return;
    }

    if (credits < CREDITS_PER_VIDEO) {
      toast.error(`Necesitas al menos ${CREDITS_PER_VIDEO} créditos para generar un video`);
      return;
    }

    setIsGenerating(true);
    console.log("Enviando solicitud a n8n:", { prompt, webhookUrl: n8nWebhookUrl });

    try {
      const response = await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "video",
          prompt: prompt,
          negative_prompt: "blurry, bad quality, distorted",
          width: "512",
          height: "512",
          num_frames: "16",
          model_id: "zeroscope",
          source: "Shadow Empire",
          timestamp: new Date().toISOString(),
        }),
      });

      const data = await response.json();
      console.log("Respuesta de n8n:", data);

      if (data.success && data.videoUrl) {
        setGeneratedVideo(data.videoUrl);
        
        // Descontar créditos
        onCreditsChange(credits - CREDITS_PER_VIDEO);
        
        const newContent = {
          id: Date.now(),
          type: "video",
          url: data.videoUrl,
          prompt: prompt,
          createdAt: new Date().toISOString(),
        };
        
        onContentGenerated(newContent);
        toast.success("¡Video generado exitosamente con n8n!");
      } else {
        console.error("Error en la respuesta de n8n:", data);
        toast.error(data.message || "Error al generar el video");
      }
    } catch (error) {
      console.error("Error conectando con n8n:", error);
      toast.error("Error de conexión con n8n. Verifica tu webhook URL.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadVideo = () => {
    if (generatedVideo) {
      const link = document.createElement("a");
      link.href = generatedVideo;
      link.download = `shadow-empire-video-${Date.now()}.mp4`;
      link.click();
      toast.success("Video descargado");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gradient mb-2">
            Generador de Videos IA
          </h2>
          <p className="text-empire-silver/70">
            Crea videos increíbles con n8n + ModelsLab AI
          </p>
          <div className="mt-4 p-3 bg-empire-gold/10 border border-empire-gold/20 rounded-lg inline-block">
            <p className="text-empire-gold font-semibold">
              Créditos disponibles: {credits} | Costo por video: {CREDITS_PER_VIDEO} créditos
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Panel de Configuración */}
          <Card className="empire-card">
            <div className="space-y-6">
              {/* Configuración de n8n */}
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-3">
                  <Settings className="w-5 h-5 text-blue-400" />
                  <h3 className="text-blue-400 font-semibold">Configuración n8n</h3>
                </div>
                <Input
                  placeholder="https://tu-n8n.com/webhook/video"
                  value={n8nWebhookUrl}
                  onChange={(e) => setN8nWebhookUrl(e.target.value)}
                  className="bg-empire-dark/50 border-empire-gold/20 text-empire-silver"
                />
                <p className="text-xs text-empire-silver/50 mt-2">
                  URL del webhook de tu flujo n8n para generar videos
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-empire-gold mb-2">
                  Descripción del Video
                </label>
                <Textarea
                  placeholder="Describe el video que quieres crear... Por ejemplo: 'Un paisaje de montañas con nubes moviéndose lentamente al atardecer'"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="bg-empire-dark/50 border-empire-gold/20 text-empire-silver resize-none"
                />
              </div>

              <Button
                onClick={generateVideo}
                disabled={isGenerating || !prompt.trim() || !n8nWebhookUrl.trim() || credits < CREDITS_PER_VIDEO}
                className="w-full empire-button h-12 text-lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generando con n8n...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 mr-2" />
                    Generar Video ({CREDITS_PER_VIDEO} créditos)
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Panel de Resultado */}
          <Card className="empire-card">
            <div className="text-center">
              {generatedVideo ? (
                <div className="space-y-4">
                  <video
                    src={generatedVideo}
                    controls
                    className="w-full rounded-lg shadow-xl border border-empire-gold/20"
                    crossOrigin="anonymous"
                  />
                  <div className="flex space-x-3">
                    <Button
                      onClick={downloadVideo}
                      className="flex-1 bg-purple-gradient text-white hover:scale-105 transition-transform duration-300"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Descargar
                    </Button>
                    <Button
                      onClick={() => setPrompt("")}
                      variant="outline"
                      className="flex-1 border-empire-gold/30 text-empire-gold hover:bg-empire-gold/10"
                    >
                      Nuevo Video
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="py-16">
                  <Video className="w-16 h-16 mx-auto text-empire-gold/50 mb-4" />
                  <p className="text-empire-silver/50">
                    {isGenerating
                      ? "Generando tu video con n8n..."
                      : "Tu video aparecerá aquí"}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Información sobre n8n */}
        <Card className="empire-card mt-8">
          <h3 className="text-lg font-semibold text-empire-gold mb-4">
            Configuración de tu flujo n8n
          </h3>
          <div className="bg-empire-dark/30 rounded-lg p-4 border border-empire-gold/10">
            <h4 className="text-empire-silver font-medium mb-2">Estructura esperada del payload:</h4>
            <pre className="text-xs text-empire-silver/70 bg-empire-dark/50 p-3 rounded overflow-x-auto">
{`{
  "type": "video",
  "prompt": "descripción del video",
  "negative_prompt": "blurry, bad quality, distorted",
  "width": "512",
  "height": "512",
  "num_frames": "16",
  "model_id": "zeroscope",
  "source": "Shadow Empire",
  "timestamp": "2024-01-01T00:00:00.000Z"
}`}
            </pre>
            <h4 className="text-empire-silver font-medium mb-2 mt-4">Respuesta esperada:</h4>
            <pre className="text-xs text-empire-silver/70 bg-empire-dark/50 p-3 rounded overflow-x-auto">
{`{
  "success": true,
  "videoUrl": "https://url-del-video-generado.mp4",
  "message": "Video generado exitosamente"
}`}
            </pre>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default VideoGenerator;
