import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  const { category_slug, product_slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/product/api/${category_slug}/${product_slug}/`,{
                                        headers: {
                                          Authorization: `token ${token}`,
                                        },
                                      });
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [category_slug, product_slug]);

  const addToCart = () => {
    if (!product) return;

    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      const updatedCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      alert(`Increased quantity of ${product.name} in your cart.`);
    } else {
      const updatedCart = [...cart, { ...product, quantity: 1 }];
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      alert(`${product.name} has been added to your cart!`);
    }
  };

  if (loading) {
    return <div className="text-center my-5">Loading product details...</div>;
  }

  if (error) {
    return <div className="text-center my-5 text-danger">Error: {error}</div>;
  }

  if (!product) {
    return <div className="text-center my-5">No product found.</div>;
  }

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-6" style={{marginTop: "30px"}}>
          <img
            src={product.image || "https://via.placeholder.com/150"}
            alt={product.name}
            className="img-fluid mb-3"
          />
        </div>
        <div className="col-md-6" style={{marginTop: "30px"}}>
          <h2 className="mb-4">{product.name}</h2>
          <p><strong>Description:</strong> {product.description}</p>
          <p><strong>Price:</strong> ${product.price}</p>
          <p><strong>Category:</strong> {product.category[0]?.name || "Uncategorized"}</p>
          <p><strong>Added on:</strong> {new Date(product.date_added).toLocaleDateString()}</p>
          <button onClick={addToCart} className="btn btn-primary">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
