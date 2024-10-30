// import React, { useState, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import axios from "axios";

// const Checkout = () => {
//   const [userId, setUserId] = useState(null);
//   const [totalPrice, setTotalPrice] = useState(0);
//   const token = localStorage.getItem("token");
//   const [profileData, setProfileData] = useState({}); // Start as an empty object for rendering check
//   const [dataLoaded, setDataLoaded] = useState(false); // Dummy state to trigger re-render

//   // Retrieve the user ID from localStorage
//   useEffect(() => {
//     const storedUserId = localStorage.getItem("userId");
//     if (storedUserId) {
//       setUserId(storedUserId);
//       console.log("User ID retrieved:", storedUserId);
//     } else {
//       console.warn("No user ID found in localStorage");
//     }
//   }, []);

//   const fetchProfile = async () => {
//     if (userId && token) {
//       try {
//         console.log("Fetching profile for User ID:", userId);
//         const res = await axios.get(
//           `http://127.0.0.1:8000/main/users/${userId}/`,
//           {
//             headers: { Authorization: `token ${token}` },
//           }
//         );
//         setProfileData(res.data);
//         setDataLoaded(true); // Trigger re-render
//         console.log("Profile data fetched:", res.data);
//       } catch (error) {
//         console.error("Error fetching profile data:", error);
//       }
//     } else {
//       console.warn("User ID or token is missing.");
//     }
//   };

//   // Re-fetch profile data when userId is set
//   useEffect(() => {
//     if (userId) {
//       fetchProfile();
//     }
//   }, [userId]);

//   // State to hold user details
//   const [formData, setFormData] = useState({
//     user: userId,
//     first_name: "",
//     last_name: "",
//     email: "",
//     address: "",
//   });

//   // Calculate the total price from the cart
//   useEffect(() => {
//     const cartData = JSON.parse(localStorage.getItem("cart")) || [];
//     const total = cartData.reduce(
//       (acc, item) => acc + item.price * item.quantity,
//       0
//     );
//     setTotalPrice(total);
//   }, []);

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   // Function to handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Prevent the default form submission

//     // Prepare the data to be sent
//     const payload = {
//       address: formData.address,
//       email: formData.email,
//       first_name: formData.first_name,
//       last_name: formData.last_name,
//       user: userId || null, // Ensure user is set to null if not available
//     };

//     try {
//       // Step 1: Send order data to the first API
//       const response = await fetch("http://127.0.0.1:8000/order/list/orders/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `token ${token}`,
//         },
//         body: JSON.stringify(payload), // Send the payload
//       });

//       if (response.ok) {
//         const orderData = await response.json();
//         console.log("Order successfully created:", orderData.id);

//         // Wait for 15 seconds before sending cart data
//         setTimeout(async () => {
//           const cartData = JSON.parse(localStorage.getItem("cart")) || [];
//           console.log("Cart Data:", cartData);
//           console.log("1");
//           // Store order item IDs for later use
//           const orderItemIds = [];

//           for (const item of cartData) {
//             const orderItemPayload = {
//               order: orderData.id || null,
//               product: item.id || null,
//               price: item.price || null,
//               quantity: item.quantity || null,
//             };

//             console.log("Order Item Payload:", orderItemPayload);

//             const itemsResponse = await fetch(
//               "http://127.0.0.1:8000/order/order-items/",
//               {
//                 method: "POST",
//                 headers: {
//                   "Content-Type": "application/json",
//                   //  Authorization: `token ${token}`,
//                 },
//                 body: JSON.stringify(orderItemPayload),
//               }
//             );

//             if (itemsResponse.ok) {
//               const itemsData = await itemsResponse.json();
//               console.log("Order item successfully created:", itemsData);
//               orderItemIds.push(itemsData.id); // Store the order item ID
//             } else {
//               console.error(
//                 "Failed to create order item:",
//                 await itemsResponse.json()
//               );
//             }
//           }

//           // Save order item IDs in localStorage to use in PayPal integration
//           localStorage.setItem("orderItemIds", JSON.stringify(orderItemIds));
//           localStorage.setItem("cart", JSON.stringify([]));
//         }, 1000); // Adjust the delay as necessary
//       } else {
//         console.error("Failed to create order:", response.statusText);
//       }
//     } catch (error) {
//       console.error("Error sending order:", error);
//     }

//     setFormData({
//       user: null,
//       first_name: "",
//       last_name: "",
//       email: "",
//       address: "",
//     });
//   };

//   // PayPal integration
//   useEffect(() => {
//     // Define the render function for PayPal buttons
//     const renderPayPalButton = () => {
//       window.paypal
//         .Buttons({
//           createOrder: (data, actions) => {
//             return actions.order.create({
//               purchase_units: [
//                 {
//                   amount: {
//                     value: totalPrice.toFixed(2), // Use totalPrice from state
//                   },
//                 },
//               ],
//             });
//           },
//           onApprove: (data, actions) => {
//             return actions.order.capture().then(async (details) => {
//               console.log(
//                 "Transaction completed by",
//                 details.payer.name.given_name
//               );
//               alert("Transaction successful!");

//               // After successful transaction, update payment status to True for each order item
//               try {
//                 const orderItemIds =
//                   JSON.parse(localStorage.getItem("orderItemIds")) || [];

//                 for (const orderItemId of orderItemIds) {
//                   const response = await fetch(
//                     `http://127.0.0.1:8000/order/order-items/${orderItemId}/`,
//                     {
//                       method: "PATCH",
//                       headers: {
//                         "Content-Type": "application/json",
//                         Authorization: `token ${token}`,
//                       },
//                       body: JSON.stringify({ payment: true }), // Update payment to true
//                     }
//                   );

//                   if (response.ok) {
//                     const updatedItem = await response.json();
//                     console.log("Payment updated for order item:", updatedItem);
//                   } else {
//                     console.error(
//                       "Failed to update payment status for order item:",
//                       orderItemId
//                     );
//                   }
//                 }
//               } catch (error) {
//                 console.error("Error updating payment status:", error);
//               }
//             });
//           },
//           onError: (err) => {
//             console.error("PayPal error:", err);
//           },
//         })
//         .render("#paypal-button-container");
//     };

//     // Check if PayPal has loaded and render only once
//     if (window.paypal) {
//       renderPayPalButton();
//     }

//     // Cleanup function to remove the PayPal button instance
//     return () => {
//       const container = document.querySelector("#paypal-button-container");
//       if (container) {
//         container.innerHTML = ""; // Clear the container
//       }
//     };
//   }, [totalPrice]);

//   // const clearStorage = () =>{
//   //   // localStorage.removeItem('cart');
//   //   localStorage.setItem('cart', JSON.stringify([]));
//   // }

//   return (
//     <div className="container mt-5">
//       <h2 className="mb-4">Checkout</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-3">
//           <label htmlFor="first_name" className="form-label">
//             First Name
//           </label>
//           <input
//             type="text"
//             className="form-control"
//             id="first_name"
//             name="first_name"
//             value={profileData.first_name}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="mb-3">
//           <label htmlFor="last_name" className="form-label">
//             Last Name
//           </label>
//           <input
//             type="text"
//             className="form-control"
//             id="last_name"
//             name="last_name"
//             value={profileData.last_name}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="mb-3">
//           <label htmlFor="email" className="form-label">
//             Email
//           </label>
//           <input
//             type="email"
//             className="form-control"
//             id="email"
//             name="email"
//             value={profileData.email}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="mb-3">
//           <label htmlFor="address" className="form-label">
//             Address
//           </label>
//           <input
//             type="text"
//             className="form-control"
//             id="address"
//             name="address"
//             value={formData.address}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           className="btn btn-primary mt-4" /*onClick={clearStorage}*/
//         >
//           Submit Order
//         </button>
//         <div id="paypal-button-container" className="mt-4"></div>
//       </form>
//     </div>
//   );
// };

// export default Checkout;

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
        {/* <div className="mb-3">
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
        </div> */}
        <div className="mb-3">
  <label htmlFor="streetAddress" className="form-label">
    Street Address
  </label>
  <input
    type="text"
    className="form-control"
    id="streetAddress"
    name="streetAddress"
    value={formData.streetAddress}
    onChange={handleChange}
    placeholder="123 Main St"
    required
  />
</div>

<div className="mb-3">
  <label htmlFor="city" className="form-label">
    City
  </label>
  <input
    type="text"
    className="form-control"
    id="city"
    name="city"
    value={formData.city}
    onChange={handleChange}
    placeholder="City"
    required
  />
</div>

<div className="mb-3">
  <label htmlFor="state" className="form-label">
    State
  </label>
  <input
    type="text"
    className="form-control"
    id="state"
    name="state"
    value={formData.state}
    onChange={handleChange}
    placeholder="State"
    required
  />
</div>

<div className="mb-3">
  <label htmlFor="postalCode" className="form-label">
    Postal Code
  </label>
  <input
    type="text"
    className="form-control"
    id="postalCode"
    name="postalCode"
    value={formData.postalCode}
    onChange={handleChange}
    placeholder="12345"
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
