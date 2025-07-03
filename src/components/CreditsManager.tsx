import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Coins, Plus, CreditCard } from "lucide-react";
import { toast } from "sonner";
import PaymentGateway from "./PaymentGateway";

interface CreditsManagerProps {
  credits: number;
  onCreditsChange: (newCredits: number) => void;
}

const CreditsManager = ({ credits, onCreditsChange }: CreditsManagerProps) => {
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [isRecharging, setIsRecharging] = useState(false);
  const [showGateway, setShowGateway] = useState(false);
  const [pendingAmount, setPendingAmount] = useState(0);
  const [pendingPrice, setPendingPrice] = useState(0);

  const creditPackages = [
    { amount: 50, price: 5, popular: false },
    { amount: 150, price: 12, popular: true },
    { amount: 300, price: 20, popular: false },
    { amount: 500, price: 30, popular: false },
  ];

  const rechargeCredits = async (amount: number) => {
    setIsRecharging(true);
    
    // Simular proceso de pago
    setTimeout(() => {
      onCreditsChange(credits + amount);
      toast.success(`¡${amount} créditos añadidos exitosamente!`);
      setIsRecharging(false);
      setRechargeAmount("");
    }, 2000);
  };

  const customRecharge = () => {
    const amount = parseInt(rechargeAmount);
    if (amount && amount > 0) {
      rechargeCredits(amount);
    } else {
      toast.error("Por favor, ingresa una cantidad válida");
    }
  };

  const openGateway = (amount: number, price: number) => {
    setPendingAmount(amount);
    setPendingPrice(price);
    setShowGateway(true);
  };

  const handleConfirmPayment = () => {
    setShowGateway(false);
    onCreditsChange(credits + pendingAmount);
    toast.success(`¡${pendingAmount} créditos añadidos exitosamente!`);
    setIsRecharging(false);
    setRechargeAmount("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gradient mb-2">
            Gestión de Créditos
          </h2>
          <p className="text-empire-silver/70">
            Recarga tus créditos para seguir creando contenido increíble
          </p>
        </div>

        {/* Balance Actual */}
        <Card className="empire-card mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Coins className="w-12 h-12 text-empire-gold mr-4" />
              <div>
                <h3 className="text-2xl font-bold text-empire-gold">{credits}</h3>
                <p className="text-empire-silver/70">Créditos disponibles</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-empire-dark/30 rounded-lg border border-empire-gold/10">
                <p className="text-sm text-empire-silver/70">Costo por imagen</p>
                <p className="text-lg font-semibold text-empire-gold">5 créditos</p>
              </div>
              <div className="p-4 bg-empire-dark/30 rounded-lg border border-empire-gold/10">
                <p className="text-sm text-empire-silver/70">Costo por video</p>
                <p className="text-lg font-semibold text-empire-gold">10 créditos</p>
              </div>
              <div className="p-4 bg-empire-dark/30 rounded-lg border border-empire-gold/10">
                <p className="text-sm text-empire-silver/70">Texto IA</p>
                <p className="text-lg font-semibold text-empire-gold">2 créditos</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Paquetes de Créditos */}
        <Card className="empire-card mb-8">
          <h3 className="text-xl font-semibold text-empire-gold mb-6">
            Paquetes de Créditos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {creditPackages.map((pkg, index) => (
              <div
                key={index}
                className={`p-6 rounded-lg border transition-all duration-300 hover:scale-105 ${
                  pkg.popular
                    ? "border-empire-gold bg-empire-gold/10"
                    : "border-empire-gold/20 bg-empire-dark/30"
                }`}
              >
                {pkg.popular && (
                  <div className="text-center mb-2">
                    <span className="bg-empire-gold text-empire-dark px-2 py-1 rounded-full text-xs font-semibold">
                      MÁS POPULAR
                    </span>
                  </div>
                )}
                <div className="text-center">
                  <h4 className="text-2xl font-bold text-empire-gold mb-2">
                    {pkg.amount}
                  </h4>
                  <p className="text-empire-silver/70 mb-4">créditos</p>
                  <p className="text-xl font-semibold text-empire-silver mb-4">
                    ${pkg.price}
                  </p>
                  <Button
                    onClick={() => openGateway(pkg.amount, pkg.price)}
                    disabled={isRecharging}
                    className="w-full empire-button"
                  >
                    {isRecharging ? (
                      "Procesando..."
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Comprar
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recarga Personalizada */}
        <Card className="empire-card">
          <h3 className="text-xl font-semibold text-empire-gold mb-6">
            Recarga Personalizada
          </h3>
          <div className="flex space-x-4">
            <Input
              type="number"
              placeholder="Cantidad de créditos"
              value={rechargeAmount}
              onChange={(e) => setRechargeAmount(e.target.value)}
              className="bg-empire-dark/50 border-empire-gold/20 text-empire-silver"
            />
            <Button
              onClick={() => {
                const amount = parseInt(rechargeAmount);
                if (amount && amount >= 10) {
                  openGateway(amount, amount * 0.1);
                } else {
                  toast.error("Por favor, ingresa una cantidad válida (mínimo 10)");
                }
              }}
              disabled={isRecharging || !rechargeAmount}
              className="empire-button"
            >
              <Plus className="w-4 h-4 mr-2" />
              Recargar
            </Button>
          </div>
          <p className="text-empire-silver/50 text-sm mt-2">
            Mínimo 10 créditos. Precio: $0.10 por crédito
          </p>
        </Card>
      </div>
      {/* Renderiza la pasarela de pago si es necesario */}
      {showGateway && (
        <PaymentGateway
          amount={pendingAmount}
          price={pendingPrice}
          onConfirm={handleConfirmPayment}
          onCancel={() => setShowGateway(false)}
        />
      )}
    </div>
  );
};

export default CreditsManager;
