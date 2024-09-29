import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import "bootstrap/dist/css/bootstrap.min.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the API when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/product/api/products/");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        console.log(data);
        setProducts(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Render loading message
  if (loading) {
    return <div className="text-center my-5">Loading products...</div>;
  }

  // Render error message
  if (error) {
    return <div className="text-center my-5 text-danger">Error: {error}</div>;
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">Product List</h2>
      <div className="row">
        {products.length > 0 ? (
          products.map((product) => (
            <div className="col-md-3 mb-4" key={product.id}>
              <div className="card h-100 shadow-sm">
                <img
                  src={
                    product.thumbnail ||
                    "https://via.placeholder.com/150" // Placeholder image if no thumbnail
                  }
                  className="card-img-top img-fluid"
                  alt={product.name}
                  style={{ height: "200px", objectFit: "cover" }} // Ensures uniform image size
                />
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description}</p>
                  <p className="card-text">
                    <strong>Price:</strong> ${product.price}
                  </p>
                  <p className="card-text">
                    <small className="text-muted">
                      Added on: {new Date(product.date_added).toLocaleDateString()}
                    </small>
                  </p>
                  <Link to={`/product/${product.slug}`} className="btn btn-primary">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No products found</p>
        )}
      </div>
    </div>
  );
};

export default ProductList;
