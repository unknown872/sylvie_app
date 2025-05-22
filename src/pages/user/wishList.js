import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Swal from 'sweetalert2';
import Header from '@/components/user/Header';
import First from "@/assets/eau-perfume.png";
import Second from "@/assets/beau-perfume.png";
import Third from "@/assets/bottle-parfum.png";
import Fourth from "@/assets/blue-orange.png";
import Firsts from "@/assets/Firsts.png";
import Seconds from "@/assets/Seconds.png";
import Thirds from "@/assets/Thirds.png";
import Fourths from "@/assets/Fouths.png";

const WishList = () => {
  const products = [
    {
        id: 1,
        name: 'Parfum Noir',
        price: 75000,
        image: [First, Fourths],
        quant: 10
    },
    {
        id: 2,
        name: 'Eau de Cologne',
        price: 20000,
        image: [Second, Thirds],
        quant: 10
    },
    {
        id: 3,
        name: 'Essence Rare',
        price: 15000,
        image: [Third, Firsts],
        quant: 10
    },
    {
        id: 4,
        name: 'Cactus',
        price: 25000,
        image: [Fourth, Seconds],
        quant: 10
    },
    {
        id: 5,
        name: 'Cactus',
        price: 25000,
        image: [Fourth, Seconds],
        quant: 10
    },
];
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [openCart, setOpenCart] = useState(false);
  const cartMenuRef = useRef(null);
  const cartButtonRef = useRef(null);

  const handleOpenCart = () => {
    setOpenCart(!openCart);
  }

  const handleClickOutside = (event) => {
    if (
      cartMenuRef.current && !cartMenuRef.current.contains(event.target) &&
      !cartButtonRef.current.contains(event.target)
    ) {
      setOpenCart(false);  // Ferme le menu si on clique en dehors
    }
  };

  // Charger le panier depuis localStorage au démarrage
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Sauvegarder le panier dans localStorage chaque fois qu'il change
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (product) => {
    const existingProductIndex = cart.findIndex((item) => item.id === product.id);

    if (existingProductIndex !== -1) {
      // Si le produit est déjà dans le panier, on augmente la quantité
      const updatedCart = [...cart];
      updatedCart[existingProductIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      // Si le produit n'est pas dans le panier, on l'ajoute avec une quantité de 1
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const isAddToCartDisabled = (product) => {
    const productInCart = cart.find(item => item.id === product.id);
    return productInCart && productInCart.quantity >= product.quant;
  };

  const increaseQuantity = (productId) => {
    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
  };

  const decreaseQuantity = (productId) => {
    const updatedCart = cart.map((item) =>
      item.id === productId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCart(updatedCart.filter((item) => item.quantity > 0));
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
    // Mettre à jour le localStorage après suppression
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Récupération des données de la liste des envies
  useEffect(() => {
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
  }, []);

  // Suppression d'un produit de la liste des envies
  const removeFromWishlist = (id) => {
    const updatedWishlist = wishlist.filter((item) => item.id !== id);
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));

    Swal.fire({
      icon: 'success',
      title: 'Produit retiré',
      text: 'Le produit a été retiré de votre liste des envies.',
    });
  };

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <h1 className="text-2xl font-bold">Votre liste des envies est vide !</h1>
        <p className="text-gray-600 mt-4">
          Explorez nos produits et ajoutez vos favoris à votre liste des envies.
        </p>
      </div>
    );
  }

  return (
    <>
      <Header
        products={products}
        openCart={openCart}
        handleOpenCart={handleOpenCart}
        cartButtonRef={cartButtonRef}
        cartMenuRef={cartMenuRef}
        handleClickOutside={handleClickOutside}
        cart={cart}
        addToCart={addToCart}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        removeFromCart={removeFromCart}
      />
      <div className=" mx-auto py-6 font-poppins px-4 bg-slate-100">
        <div className='bg-white px-4 py-2 rounded-lg'>
          <h1 className="text-3xl my-6">Votre liste des envies</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="border p-4 flex flex-col items-center space-y-4"
              >
                <Image
                  src={product.image[0]}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="object-contain"
                />
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <p className="text-gray-600">{product.price} CFA</p>
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
                >
                  Retirer
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default WishList;
