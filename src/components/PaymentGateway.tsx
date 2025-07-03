import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PaymentGatewayProps {
  amount: number;
  price: number;
  onConfirm: () => void;
  onCancel: () => void;
}

const PaymentGateway = ({ amount, price, onConfirm, onCancel }: PaymentGatewayProps) => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [processing, setProcessing] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onConfirm();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-empire-dark p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-empire-gold mb-4">Pasarela de Pago</h2>
        <p className="text-empire-silver mb-2">
          Vas a comprar <span className="text-empire-gold font-semibold">{amount} créditos</span>
        </p>
        <p className="text-empire-silver mb-6">
          Total a pagar: <span className="text-empire-gold font-semibold">${price}</span>
        </p>
        <form
          className="space-y-4 text-left"
          onSubmit={e => {
            e.preventDefault();
            handlePay();
          }}
        >
          <div>
            <label className="block text-empire-gold text-sm mb-1">Número de Tarjeta</label>
            <Input
              type="text"
              maxLength={19}
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={e => setCardNumber(e.target.value.replace(/[^\d ]/g, ""))}
              required
            />
          </div>
          <div>
            <label className="block text-empire-gold text-sm mb-1">Nombre en la Tarjeta</label>
            <Input
              type="text"
              placeholder="Nombre Apellido"
              value={cardName}
              onChange={e => setCardName(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-empire-gold text-sm mb-1">Expiración</label>
              <Input
                type="text"
                maxLength={5}
                placeholder="MM/AA"
                value={expiry}
                onChange={e => setExpiry(e.target.value.replace(/[^\d/]/g, ""))}
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-empire-gold text-sm mb-1">CVC</label>
              <Input
                type="text"
                maxLength={4}
                placeholder="123"
                value={cvc}
                onChange={e => setCvc(e.target.value.replace(/[^\d]/g, ""))}
                required
              />
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <Button
              className="empire-button"
              type="submit"
              disabled={processing || !cardNumber || !cardName || !expiry || !cvc}
            >
              {processing ? "Procesando..." : "Pagar"}
            </Button>
            <Button variant="outline" onClick={onCancel} disabled={processing}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentGateway;