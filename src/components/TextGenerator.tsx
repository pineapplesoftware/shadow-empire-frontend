import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Type, Copy, Wand2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface TextGeneratorProps {
  onContentGenerated: (content: any) => void;
  credits: number;
  onCreditsChange: (newCredits: number) => void;
}

const TextGenerator = ({ onContentGenerated, credits, onCreditsChange }: TextGeneratorProps) => {
  const [topic, setTopic] = useState("");
  const [contentType, setContentType] = useState("instagram");
  const [tone, setTone] = useState("casual");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState("");

  const CREDITS_PER_TEXT = 2;

  const contentTypes = [
    { value: "instagram", label: "Post de Instagram" },
    { value: "twitter", label: "Tweet" },
    { value: "facebook", label: "Post de Facebook" },
    { value: "linkedin", label: "Post de LinkedIn" },
    { value: "youtube", label: "Descripción de YouTube" },
    { value: "blog", label: "Artículo de Blog" },
  ];

  const tones = [
    { value: "casual", label: "Casual" },
    { value: "profesional", label: "Profesional" },
    { value: "divertido", label: "Divertido" },
    { value: "inspiracional", label: "Inspiracional" },
    { value: "urgente", label: "Urgente" },
    { value: "educativo", label: "Educativo" },
  ];

  const generateText = async () => {
    if (!topic.trim()) {
      toast.error("Por favor, ingresa un tema para el contenido");
      return;
    }

    if (credits < CREDITS_PER_TEXT) {
      toast.error(`Necesitas al menos ${CREDITS_PER_TEXT} créditos para generar texto`);
      return;
    }

    setIsGenerating(true);
    console.log("Generando texto:", { topic, contentType, tone });

    try {
      // Simulación de generación de texto con IA
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockTexts = {
        instagram: `🌟 ${topic} 

¿Sabías que esto puede cambiar tu perspectiva? Te cuento mi experiencia...

💫 Punto clave 1
✨ Punto clave 2  
🔥 Punto clave 3

¿Qué opinas? ¡Cuéntame en los comentarios! 👇

#${topic.replace(/\s+/g, '')} #inspiracion #contenido #shadowempire`,
        
        twitter: `🚀 ${topic}

Esto es lo que he aprendido:
→ Insight 1
→ Insight 2
→ Insight 3

¿Cuál es tu experiencia? 🧵

#${topic.replace(/\s+/g, '')} #twitter`,
        
        facebook: `${topic} - Mi reflexión personal

Hoy quiero compartir contigo algo que me ha marcado profundamente...

[Contenido desarrollado aquí con experiencias personales y llamada a la acción]

¿Te ha pasado algo similar? Me encantaría leer tus experiencias en los comentarios.`,
        
        linkedin: `${topic}: Insights desde mi experiencia profesional

En mis años de carrera, he observado que...

🔑 Puntos clave:
• Aspecto técnico 1
• Aspecto técnico 2
• Aspecto técnico 3

¿Cómo abordas tú este tema en tu industria?

#${topic.replace(/\s+/g, '')} #LinkedIn #Profesional`,
        
        youtube: `En este video exploramos ${topic} desde una perspectiva única.

🎯 Lo que aprenderás:
- Concepto fundamental
- Aplicación práctica
- Casos de estudio
- Tips avanzados

⏰ Timestamps:
00:00 Introducción
02:30 Desarrollo principal
08:45 Ejemplos prácticos
12:15 Conclusiones

💬 ¡Déjame saber qué piensas en los comentarios!

#${topic.replace(/\s+/g, '')} #YouTube #Educativo`,
        
        blog: `# ${topic}: Una Guía Completa

## Introducción
En el mundo actual, ${topic} se ha convertido en...

## Desarrollo Principal
### Subtema 1
Contenido detallado...

### Subtema 2
Análisis profundo...

### Subtema 3
Ejemplos prácticos...

## Conclusión
Para finalizar, ${topic} representa una oportunidad única para...

¿Qué opinas sobre este tema? ¡Comparte tus pensamientos!`
      };

      const baseText = mockTexts[contentType as keyof typeof mockTexts] || mockTexts.instagram;
      
      // Ajustar el tono
      let finalText = baseText;
      if (tone === "profesional") {
        finalText = finalText.replace(/🌟|💫|✨|🔥/g, "").replace(/¡|!/g, ".");
      } else if (tone === "divertido") {
        finalText = finalText + " 😄🎉✨";
      }
      
      setGeneratedText(finalText);
      
      // Descontar créditos
      onCreditsChange(credits - CREDITS_PER_TEXT);
      
      const newContent = {
        id: Date.now(),
        type: "text",
        content: finalText,
        topic: topic,
        platform: contentType,
        tone: tone,
        createdAt: new Date().toISOString(),
      };
      
      onContentGenerated(newContent);
      toast.success("¡Texto generado exitosamente!");
    } catch (error) {
      console.error("Error generando texto:", error);
      toast.error("Error al generar el texto. Inténtalo de nuevo.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText);
    toast.success("Texto copiado al portapapeles");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gradient mb-2">
            Generador de Texto IA
          </h2>
          <p className="text-empire-silver/70">
            Crea contenido persuasivo para todas tus plataformas
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Panel de Configuración */}
          <Card className="empire-card">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-empire-gold mb-2">
                  Tema del Contenido
                </label>
                <Textarea
                  placeholder="Describe el tema sobre el que quieres crear contenido... Ej: Marketing digital, Productividad, Tecnología"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  rows={3}
                  className="bg-empire-dark/50 border-empire-gold/20 text-empire-silver resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-empire-gold mb-2">
                  Tipo de Contenido
                </label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger className="bg-empire-dark/50 border-empire-gold/20 text-empire-silver">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-empire-dark border-empire-gold/20">
                    {contentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value} className="text-empire-silver">
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-empire-gold mb-2">
                  Tono del Mensaje
                </label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger className="bg-empire-dark/50 border-empire-gold/20 text-empire-silver">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-empire-dark border-empire-gold/20">
                    {tones.map((toneOption) => (
                      <SelectItem key={toneOption.value} value={toneOption.value} className="text-empire-silver">
                        {toneOption.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={generateText}
                disabled={isGenerating || !topic.trim()}
                className="w-full empire-button h-12 text-lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 mr-2" />
                    Generar Texto
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Panel de Resultado */}
          <Card className="empire-card">
            <div className="h-full flex flex-col">
              {generatedText ? (
                <>
                  <div className="flex-1 mb-4">
                    <Textarea
                      value={generatedText}
                      onChange={(e) => setGeneratedText(e.target.value)}
                      className="h-full min-h-[400px] bg-empire-dark/30 border-empire-gold/20 text-empire-silver resize-none"
                    />
                  </div>
                  <Button
                    onClick={copyToClipboard}
                    className="w-full bg-purple-gradient text-white hover:scale-105 transition-transform duration-300"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar Texto
                  </Button>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <Type className="w-16 h-16 mx-auto text-empire-gold/50 mb-4" />
                    <p className="text-empire-silver/50">
                      {isGenerating
                        ? "Generando tu contenido..."
                        : "Tu contenido aparecerá aquí"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TextGenerator;
