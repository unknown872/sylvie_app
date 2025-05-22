import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

const CartPage = () => {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [openCart, setOpenCart] = useState(false);
  const cartMenuRef = useRef(null);
  const cartButtonRef = useRef(null);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [notificationAddress, setNotificationAddress] = useState({
    message: "",
    type: "",
  });
  const [selectedLivraison, setSelectedLivraison] = useState(null);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const increaseQuantity = (productId) => {
    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const decreaseQuantity = (productId) => {
    const updatedCart = cart.map((item) =>
      item.id === productId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCart(updatedCart.filter((item) => item.quantity > 0));
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const [currentStep, setCurrentStep] = useState(1);

  // Fonction pour passer à l'étape suivante
  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Fonction pour revenir à l'étape précédente
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div>
      <h2 cla>Panier</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cart.map((item) => (
          <div key={item.id} className="cart-item">
            <p>{item.name}</p>
            <p>Price: {item.price} CFA</p>
            <p>Quantity: {item.quantity}</p>
            <button onClick={() => increaseQuantity(item.id)}>+</button>
            <button onClick={() => decreaseQuantity(item.id)}>-</button>
            <button onClick={() => removeFromCart(item.id)}>Remove</button>
          </div>
        ))
      )}
      <div>
        <h3>Total: {totalPrice} CFA</h3>
        <button>Proceed to Checkout</button>
      </div>
      <div className="max-w-lg mx-auto mt-10">
        {/* Stepper Header */}
        <div className="flex justify-between mb-6">
          {/* Étape Vérifier la commande */}
          <div
            className={`flex-1 text-center py-2 font-semibold ${
              currentStep >= 1
                ? "bg-amber-500 text-white"
                : "bg-gray-200 text-gray-500"
            } rounded-md`}
          >
            Vérifier la commande
          </div>
          {/* Étape Adresse */}
          <div
            className={`flex-1 text-center py-2 font-semibold ${
              currentStep >= 2
                ? "bg-amber-500 text-white"
                : "bg-gray-200 text-gray-500"
            } rounded-md`}
          >
            Adresse
          </div>
          {/* Étape Confirmer la commande */}
          <div
            className={`flex-1 text-center py-2 font-semibold ${
              currentStep >= 3
                ? "bg-amber-500 text-white"
                : "bg-gray-200 text-gray-500"
            } rounded-md`}
          >
            Confirmer la commande
          </div>
        </div>

        {/* Stepper Content */}
        <div className="step-content p-4 bg-white rounded-md shadow-md">
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-semibold">Vérifier la commande</h2>
              <p>
                Voici les articles dans votre panier. Vérifiez-les avant de
                continuer.
              </p>
              {/* Ajoute ici les détails de ton panier */}
            </div>
          )}
          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-semibold">Adresse</h2>
              <p>Entrez votre adresse de livraison.</p>
              <input
                type="text"
                placeholder="Votre adresse"
                className="border px-4 py-2 rounded w-full mt-2"
              />
            </div>
          )}
          {currentStep === 3 && (
            <div>
              <h2 className="text-xl font-semibold">Confirmer la commande</h2>
              <p>
                Vérifiez toutes les informations avant de confirmer votre
                commande.
              </p>
              {/* Ajoute ici les informations finales avant confirmation */}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          {/* Bouton Précédent */}
          <button
            onClick={prevStep}
            className={`px-6 py-2 text-white font-semibold rounded-md ${
              currentStep === 1
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gray-600 hover:bg-gray-700"
            }`}
            disabled={currentStep === 1}
          >
            Précédent
          </button>
          {/* Bouton Suivant */}
          <button
            onClick={nextStep}
            className={`px-6 py-2 text-white font-semibold rounded-md ${
              currentStep === 3
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-amber-500 hover:bg-amber-600"
            }`}
            disabled={currentStep === 3}
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
