
import { Image, Type, Share2, Zap, TrendingUp, Users } from "lucide-react";
import { TabType } from "../pages/Index";

interface DashboardProps {
  onTabChange: (tab: TabType) => void;
}

const Dashboard = ({ onTabChange }: DashboardProps) => {
  const stats = [
    { label: "Imágenes Creadas", value: "1,247", icon: Image, color: "text-blue-400" },
    { label: "Textos Generados", value: "856", icon: Type, color: "text-green-400" },
    { label: "Posts Publicados", value: "423", icon: Share2, color: "text-purple-400" },
    { label: "Engagement Total", value: "89.2K", icon: TrendingUp, color: "text-yellow-400" },
  ];

  const quickActions = [
    {
      id: "images",
      title: "Generar Imagen",
      description: "Crea imágenes impresionantes con IA",
      icon: Image,
      gradient: "from-blue-500 to-purple-600",
    },
    {
      id: "text",
      title: "Crear Texto",
      description: "Genera contenido persuasivo con IA",
      icon: Type,
      gradient: "from-green-500 to-teal-600",
    },
    {
      id: "social",
      title: "Publicar en Redes",
      description: "Comparte tu contenido en todas las plataformas",
      icon: Share2,
      gradient: "from-purple-500 to-pink-600",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gradient mb-2">
          Bienvenido a Shadow Empire
        </h2>
        <p className="text-empire-silver/70 text-lg">
          Tu estudio de creación de contenido con IA más poderoso
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="empire-card hover:scale-105 transition-transform duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-empire-silver/70 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-empire-gold">{stat.value}</p>
                </div>
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-empire-gold mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => onTabChange(action.id as TabType)}
                className="empire-card hover:scale-105 transition-all duration-300 text-left group"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${action.gradient} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-empire-gold mb-2">
                  {action.title}
                </h4>
                <p className="text-empire-silver/70">{action.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="empire-card">
        <h3 className="text-xl font-semibold text-empire-gold mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2" />
          Actividad Reciente
        </h3>
        <div className="space-y-3">
          {[
            "Imagen generada: 'Paisaje futurista' - hace 2 horas",
            "Texto creado para Instagram - hace 4 horas",
            "Post publicado en Twitter - hace 6 horas",
            "Campaña de Facebook completada - hace 1 día",
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 bg-empire-dark/30 rounded-lg border border-empire-gold/10"
            >
              <div className="w-2 h-2 bg-empire-gold rounded-full"></div>
              <span className="text-empire-silver/80">{activity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
