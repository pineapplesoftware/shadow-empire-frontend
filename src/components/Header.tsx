
import { Crown, Image, Type, Share2, FolderOpen, Coins } from "lucide-react";
import { TabType } from "../pages/Index";

interface HeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  credits: number;
}

const Header = ({ activeTab, onTabChange, credits }: HeaderProps) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Crown },
    { id: "images", label: "Imágenes", icon: Image },
    { id: "videos", label: "Videos", icon: Image },
    { id: "text", label: "Texto", icon: Type },
    { id: "social", label: "Redes Sociales", icon: Share2 },
    { id: "gallery", label: "Galería", icon: FolderOpen },
    { id: "credits", label: "Créditos", icon: Coins },
  ];

  return (
    <header className="bg-empire-dark/90 backdrop-blur-sm border-b border-empire-gold/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gold-gradient rounded-lg flex items-center justify-center empire-glow">
              <Crown className="w-6 h-6 text-empire-dark" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient">SHADOW EMPIRE</h1>
              <p className="text-sm text-empire-silver/70">IA Creator Studio</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Credits Display */}
            <div className="flex items-center space-x-2 px-3 py-2 bg-empire-gold/10 border border-empire-gold/20 rounded-lg">
              <Coins className="w-4 h-4 text-empire-gold" />
              <span className="text-empire-gold font-semibold">{credits}</span>
              <span className="text-empire-silver/70 text-sm">créditos</span>
            </div>

            <nav className="flex items-center space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id as TabType)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      isActive
                        ? "bg-empire-gold text-empire-dark shadow-lg"
                        : "text-empire-silver hover:bg-empire-gold/10 hover:text-empire-gold"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
