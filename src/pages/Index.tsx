
import { useState } from "react";
import Header from "../components/Header";
import Dashboard from "../components/Dashboard";
import ImageGenerator from "../components/ImageGenerator";
import VideoGenerator from "../components/VideoGenerator";
import TextGenerator from "../components/TextGenerator";
import SocialPublisher from "../components/SocialPublisher";
import Gallery from "../components/Gallery";
import CreditsManager from "../components/CreditsManager";
import { toast } from "sonner";

export type TabType = "dashboard" | "images" | "videos" | "text" | "social" | "gallery" | "credits";

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [generatedContent, setGeneratedContent] = useState<any[]>([]);
  const [credits, setCredits] = useState(100); // Créditos iniciales

  const addToGallery = (content: any) => {
    setGeneratedContent(prev => [content, ...prev]);
    toast.success("Contenido agregado a la galería");
  };

  const handleCreditsChange = (newCredits: number) => {
    setCredits(newCredits);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard onTabChange={setActiveTab} />;
      case "images":
        return (
          <ImageGenerator 
            onContentGenerated={addToGallery}
            credits={credits}
            onCreditsChange={handleCreditsChange}
          />
        );
      case "videos":
        return (
          <VideoGenerator 
            onContentGenerated={addToGallery}
            credits={credits}
            onCreditsChange={handleCreditsChange}
          />
        );
      case "text":
        return (
          <TextGenerator 
            onContentGenerated={addToGallery}
            credits={credits}
            onCreditsChange={handleCreditsChange}
          />
        );
      case "social":
        return <SocialPublisher content={generatedContent} />;
      case "gallery":
        return <Gallery content={generatedContent} />;
      case "credits":
        return (
          <CreditsManager 
            credits={credits}
            onCreditsChange={handleCreditsChange}
          />
        );
      default:
        return <Dashboard onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-empire-gradient">
      <Header 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        credits={credits}
      />
      <main className="animate-fade-in">
        {renderActiveTab()}
      </main>
    </div>
  );
};

export default Index;
