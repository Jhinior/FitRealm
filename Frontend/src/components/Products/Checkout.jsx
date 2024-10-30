import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const [userId, setUserId] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const token = localStorage.getItem("token");
  const [profileData, setProfileData] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
      console.log("User ID retrieved:", storedUserId);
    } else {
      console.warn("No user ID found in localStorage");
    }
  }, []);

  const fetchProfile = async () => {
    if (userId && token) {
      try {
        console.log("Fetching profile for User ID:", userId);
        const res = await axios.get(
          `http://127.0.0.1:8000/main/users/${userId}/`,
          { headers: { Authorization: `token ${token}` } }
        );
        setProfileData(res.data);
        setDataLoaded(true);
        console.log("Profile data fetched:", res.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    } else {
      console.warn("User ID or token is missing.");
    }
  };

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const [formData, setFormData] = useState({
    user: userId,
    first_name: profileData.first_name || "",
    last_name: profileData.last_name || "",
    email: profileData.email || "",
    address: "",
  });

  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem("cart")) || [];
    const total = cartData.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, []);

  useEffect(() => {
    if (dataLoaded) {
      setFormData((prevData) => ({
        ...prevData,
        first_name: profileData.first_name || prevData.first_name,
        last_name: profileData.last_name || prevData.last_name,
        email: profileData.email || prevData.email,
      }));
    }
  }, [profileData, dataLoaded]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      address: formData.address,
      email: formData.email,
      first_name: formData.first_name,
      last_name: formData.last_name,
      user: userId || null,
    };
    console.log('payload',payload)
    try {
      const response = await fetch("http://127.0.0.1:8000/order/list/orders/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const orderData = await response.json();
        toast.success("Order created successfully!");

        setTimeout(async () => {
          const cartData = JSON.parse(localStorage.getItem("cart")) || [];
          const orderItemIds = [];

          for (const item of cartData) {
            const orderItemPayload = {
              order: orderData.id || null,
              product: item.id || null,
              price: item.price || null,
              quantity: item.quantity || null,
            };
            
            const itemsResponse = await fetch(
              "http://127.0.0.1:8000/order/order-items/",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderItemPayload),
              }
            );

            if (itemsResponse.ok) {
              const itemsData = await itemsResponse.json();
              orderItemIds.push(itemsData.id);
            }
          }

          localStorage.setItem("orderItemIds", JSON.stringify(orderItemIds));
          localStorage.setItem("cart", JSON.stringify([]));
        }, 1000);
      } else {
        toast.error("Failed to create order.");
      }
    } catch (error) {
      toast.error("Error sending order.");
      console.error("Error sending order:", error);
    }

    setFormData({
      user: null,
      first_name: "",
      last_name: "",
      email: "",
      address: "",
    });
  };

  useEffect(() => {
    const renderPayPalButton = () => {
      window.paypal
        .Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: { value: totalPrice.toFixed(2) },
                },
              ],
            });
          },
          onApprove: (data, actions) => {
            return actions.order.capture().then(async (details) => {
              toast.success("Transaction successful! Redirecting...");
              console.log(
                "Transaction completed by",
                details.payer.name.given_name
              );

              try {
                const orderItemIds =
                  JSON.parse(localStorage.getItem("orderItemIds")) || [];

                for (const orderItemId of orderItemIds) {
                  const response = await fetch(
                    `http://127.0.0.1:8000/order/order-items/${orderItemId}/`,
                    {
                      method: "PATCH",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `token ${token}`,
                      },
                      body: JSON.stringify({ payment: true }),
                    }
                  );

                  if (response.ok) {
                    const updatedItem = await response.json();
                    console.log("Payment updated for order item:", updatedItem);
                  }
                }
                setTimeout(() => {
                  navigate("/productList");
                }, 2000);
              } catch (error) {
                toast.error("Error updating payment status.");
                console.error("Error updating payment status:", error);
              }
            });
          },
          onError: (err) => {
            toast.error("Transaction failed. Please try again.");
            console.error("PayPal error:", err);
          },
        })
        .render("#paypal-button-container");
    };

    if (window.paypal) {
      renderPayPalButton();
    }

    return () => {
      const container = document.querySelector("#paypal-button-container");
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [totalPrice]);

  return (
    <div className="container mt-5">
      <ToastContainer />
      <h2 className="mb-4">Checkout</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="first_name" className="form-label">
            First Name
          </label>
          <input
            type="text"
            className="form-control"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="last_name" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            className="form-control"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="address" className="form-label">
            Address
          </label>
          <input
            type="text"
            className="form-control"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-4">
          Submit Order
        </button>
        <div id="paypal-button-container" className="mt-4"></div>
      </form>
    </div>
  );
};

export default Checkout;
