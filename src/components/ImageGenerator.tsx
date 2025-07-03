import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Image, Download, Wand2, Loader2, Settings } from "lucide-react";
import { toast } from "sonner";

interface ImageGeneratorProps {
  onContentGenerated: (content: any) => void;
  credits: number;
  onCreditsChange: (newCredits: number) => void;
}

const SUGERENCIAS = [
  "Un dragón volando sobre una ciudad futurista, arte digital",
  "Un retrato de una reina azteca en estilo realista",
  "Un bosque encantado con criaturas mágicas, estilo Studio Ghibli",
  "Un robot tomando café en una terraza parisina, arte conceptual",
  "Un paisaje marciano al atardecer, colores vibrantes",
  "Un guerrero samurái en una tormenta de pétalos, estilo anime",
  "Un templo maya en la jungla, hiperrealista",
  "Un auto clásico en una carretera nevada, fotografía nocturna"
];

const ImageGenerator = ({ onContentGenerated, credits, onCreditsChange }: ImageGeneratorProps) => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [n8nWebhookUrl, setN8nWebhookUrl] = useState("https://n8n-n8n.zz3ost.easypanel.host/webhook/generate-media");
  const [sugerenciaIdx, setSugerenciaIdx] = useState(0);
  const CREDITS_PER_IMAGE = 5;

  useEffect(() => {
    const interval = setInterval(() => {
      setSugerenciaIdx((prev) => (prev + 1) % SUGERENCIAS.length);
    }, 60000); // 60 segundos
    return () => clearInterval(interval);
  }, []);

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error("Por favor, ingresa una descripción para la imagen");
      return;
    }

    if (!n8nWebhookUrl.trim()) {
      toast.error("Por favor, configura la URL de tu webhook de n8n");
      return;
    }

    if (credits < CREDITS_PER_IMAGE) {
      toast.error(`Necesitas al menos ${CREDITS_PER_IMAGE} créditos para generar una imagen`);
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
          type: "image",
          prompt: prompt,
          negative_prompt: "blurry, bad quality, distorted",
          width: "512",
          height: "512",
          model_id: "realistic-vision-v6",
          source: "Shadow Empire",
          timestamp: new Date().toISOString(),
        }),
      });

      const data = await response.json();
      // console.log("Respuesta de n8n:", data);
      // alert("Respuesta de n8n:\n" + JSON.stringify(data, null, 2));

      // Adaptar para distintos formatos de respuesta
      let imageUrl = null;
      if (typeof data.url === "string" && data.url.startsWith("http")) {
        imageUrl = data.url;
      } else if (data.success && data.imageUrl) {
        imageUrl = data.imageUrl;
      } else if (Array.isArray(data.output) && data.output.length > 0) {
        imageUrl = data.output[0];
      } else if (typeof data.output === "string") {
        imageUrl = data.output;
      } else if (data.tipo === "imagen" && data.url && data.status === "ok") {
        imageUrl = data.url;
      }

      if (imageUrl) {
        setGeneratedImage(imageUrl);

        // Descontar créditos
        onCreditsChange(credits - CREDITS_PER_IMAGE);

        const newContent = {
          id: Date.now(),
          type: "image",
          url: imageUrl,
          prompt: prompt,
          createdAt: new Date().toISOString(),
        };

        onContentGenerated(newContent);
        toast.success("Imagen generada con éxito");
      } else {
        console.error("Error en la respuesta de n8n:", data);
        toast.error(data.message || "Error al generar la imagen");
        // Mostrar el JSON recibido para depuración
        // alert("Respuesta de n8n:\n" + JSON.stringify(data, null, 2));
      }
    } catch (error) {
      console.error("Error conectando con n8n:", error);
      toast.error("Error de conexión con n8n. Verifica tu webhook URL.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (generatedImage) {
      const link = document.createElement("a");
      link.href = generatedImage;
      link.download = `shadow-empire-${Date.now()}.jpg`;
      link.click();
      toast.success("Imagen descargada");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gradient mb-2">
            Generador de Imágenes IA
          </h2>
          <p className="text-empire-silver/70">
            Crea imágenes increíbles con n8n + ModelsLab AI
          </p>
          <div className="mt-4 p-3 bg-empire-gold/10 border border-empire-gold/20 rounded-lg inline-block">
            <p className="text-empire-gold font-semibold">
              Créditos disponibles: {credits} | Costo por imagen: {CREDITS_PER_IMAGE} créditos
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Panel de Configuración n8n oculto */}
          {/* 
          <Card className="empire-card">
            <div className="space-y-6">
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-3">
                  <Settings className="w-5 h-5 text-blue-400" />
                  <h3 className="text-blue-400 font-semibold">Configuración n8n</h3>
                </div>
                <Input
                  placeholder="https://tu-n8n.com/webhook/imagen"
                  value={n8nWebhookUrl}
                  onChange={(e) => setN8nWebhookUrl(e.target.value)}
                  className="bg-empire-dark/50 border-empire-gold/20 text-empire-silver"
                />
                <p className="text-xs text-empire-silver/50 mt-2">
                  URL del webhook de tu flujo n8n para generar imágenes
                </p>
              </div>
            </div>
          </Card>
          */}
          {/* Panel de descripción de la imagen y botón de generar permanece visible */}
          <Card className="empire-card">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-empire-gold mb-2">
                  Descripción de la Imagen
                </label>
                <Textarea
                  placeholder="Describe la imagen que quieres crear... Por ejemplo: 'Un paisaje futurista con ciudades flotantes, estilo cyberpunk, colores neón'"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="bg-empire-dark/50 border-empire-gold/20 text-empire-silver resize-none"
                />
              </div>
              <Button
                onClick={generateImage}
                disabled={isGenerating || !prompt.trim() || credits < CREDITS_PER_IMAGE}
                className="w-full empire-button h-12 text-lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generando imagen...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 mr-2" />
                    Generar Imagen ({CREDITS_PER_IMAGE} créditos)
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Panel de Resultado */}
          <Card className="empire-card">
            <div className="text-center">
              {generatedImage ? (
                <div className="space-y-4">
                  <img
                    src={generatedImage}
                    alt="Imagen generada"
                    className="w-full rounded-lg shadow-xl border border-empire-gold/20"
                    crossOrigin="anonymous"
                  />
                  <div className="flex space-x-3">
                    <Button
                      onClick={downloadImage}
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
                      Nueva Imagen
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="py-16">
                  <Image className="w-16 h-16 mx-auto text-empire-gold/50 mb-4" />
                  <p className="text-empire-silver/50">
                    {isGenerating
                      ? "Generando imagen..."
                      : "Tu imagen aparecerá aquí"}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sugerencias de imágenes */}
        <Card className="empire-card mt-8">
          <h3 className="text-lg font-semibold text-empire-gold mb-4">
            Sugerencias para tu imagen IA
          </h3>
          <div className="bg-empire-dark/30 rounded-lg p-4 border border-empire-gold/10">
            <p className="text-empire-silver font-medium mb-2">¿No sabes qué pedir? Prueba esta sugerencia:</p>
            <div className="text-empire-gold text-lg font-semibold transition-all duration-500">
              {SUGERENCIAS[sugerenciaIdx]}
            </div>
            <p className="text-xs text-empire-silver/50 mt-3">
              Cambia cada 60 segundos. ¡Haz clic en la sugerencia para usarla!
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setPrompt(SUGERENCIAS[sugerenciaIdx])}
            >
              Usar esta sugerencia
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ImageGenerator;
