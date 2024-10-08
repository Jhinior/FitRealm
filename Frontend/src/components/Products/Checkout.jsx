// import React, { useState, useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';  // Import Bootstrap CSS

// const Checkout = () => {
//   const [userId, setUserId] = useState(null);
//   const [cart, setCart] = useState([]);
//   const [newList, setNewList] = useState([]);

//   // Retrieve the user ID from localStorage
//   useEffect(() => {
//     const storedUserId = localStorage.getItem('userId');
//     if (storedUserId) {
//       setUserId(storedUserId);
//       console.log('User ID:', storedUserId);
//     }
//   }, []);

//   // Retrieve the cart data and transform it into the desired list format
//   useEffect(() => {
//     const storedCart = localStorage.getItem('cart');
    
//     if (storedCart) {
//       const parsedCart = JSON.parse(storedCart);
//       setCart(parsedCart);
//       console.log('Cart data:', parsedCart);

//       const transformedCart = parsedCart.map((item) => ({
//         order: userId,
//         product: item.id,
//         price: item.price,
//         quantity: item.quantity
//       }));

//       setNewList(transformedCart);
//       console.log('Transformed Cart:', transformedCart);
//     } else {
//       console.log('Cart is empty or not found in localStorage');
//     }
//   }, [userId]);

//   // Function to send the newList data to the API when the button is clicked
//   const handleSendOrder = async () => {
//     if (newList.length > 0) {
//       try {
//         const response = await fetch(`http://127.0.0.1:8000/order/orders/${userId}/items/`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(newList),
//         });

//         if (response.ok) {
//           const data = await response.json();
//           console.log('Order successfully sent:', data);

//           // Clear cart data from localStorage after successful order
//           localStorage.removeItem('cart');
//           setCart([]);  // Clear the cart from state as well
//           setNewList([]); // Clear the transformed list

//         } else {
//           console.error('Failed to send order:', response.statusText);
//         }
//       } catch (error) {
//         console.error('Error sending order:', error);
//       }
//     } else {
//       console.log('No items in the cart to send.');
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h2 className="mb-4">Checkout</h2>
      
//       {/* Display the transformed cart data */}
//       {newList.length > 0 && (
//         <pre className="bg-light p-3 rounded border">{JSON.stringify(newList, null, 2)}</pre>
//       )}

//       {/* Button to send the cart data */}
//       <button onClick={handleSendOrder} className="btn btn-primary mt-4">
//         Submit Order
//       </button>
//     </div>
//   );
// };

// export default Checkout;

// 

// import React, { useState, useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

// const Checkout = () => {
//   const [userId, setUserId] = useState(null);
//   const [cart, setCart] = useState([]);
//   const [newList, setNewList] = useState([]);

//   // State for user data
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [email, setEmail] = useState("");
//   const [address, setAddress] = useState("");
//   const [zipcode, setZipcode] = useState("");
//   const [place, setPlace] = useState("");
//   const [size, setSize] = useState("");

//   // Retrieve the user ID from localStorage
//   useEffect(() => {
//     const storedUserId = localStorage.getItem('userId');
//     if (storedUserId) {
//       setUserId(storedUserId);
      
//       console.log('User ID:', storedUserId);
//     }
//     const userId = 1
//   }, []);

//   // Retrieve the cart data and transform it into the desired list format
//   useEffect(() => {
//     const storedCart = localStorage.getItem('cart');

//     if (storedCart) {
//       const parsedCart = JSON.parse(storedCart);
//       setCart(parsedCart);
//       console.log('Cart data:', parsedCart);

//       const transformedCart = parsedCart.map((item) => ({
//         order: 1,
//         product: item.id,
//         price: item.price,
//         quantity: item.quantity
//       }));

//       setNewList(transformedCart);
//       console.log('Transformed Cart:', transformedCart);
//     } else {
//       console.log('Cart is empty or not found in localStorage');
//     }
//   }, [userId]);

//   // Function to send the user data to create the order and then send the cart items
//   const handleSendOrder = async () => {
//     if (newList.length > 0) {
//       // Create the payload to send user data to create the order
//       const userPayload = {
//         user: '1',
//         first_name: firstName,
//         last_name: lastName,
//         email: email,
//         address: address,
//         zipcode: zipcode,
//         place: place,
//         size: size,
//       };
// console.log(userPayload)
// const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;


//       try {
//         // Send user data to create the order
//         const userResponse = await fetch(`http://127.0.0.1:8000/order/orders/`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'X-CSRFToken': csrfToken, // Include CSRF token
//           },
//           body: JSON.stringify(userPayload),
//         });

//         if (userResponse.ok) {
//           const userData = await userResponse.json();
//           console.log('Order successfully created:', userData);

//           // Now send the cart items to the specific endpoint
//           const itemsResponse = await fetch(`http://127.0.0.1:8000/order/orders/${userId}/items/`, {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(newList), // Send the cart items
//           });

//           if (itemsResponse.ok) {
//             const itemsData = await itemsResponse.json();
//             console.log('Items successfully sent:', itemsData);

//             // Clear cart data from localStorage after successful order
//             localStorage.removeItem('cart');
//             setCart([]); // Clear the cart from state as well
//             setNewList([]); // Clear the transformed list
//           } else {
//             console.error('Failed to send items:', itemsResponse.statusText);
//           }
//         } else {
//           console.error('Failed to create order:', userResponse.statusText);
//         }
//       } catch (error) {
//         console.error('Error sending order:', error);
//       }
//     } else {
//       console.log('No items in the cart to send.');
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h2 className="mb-4">Checkout</h2>

//       {/* Input fields for user data */}
//       <div className="mb-3">
//         <label>First Name:</label>
//         <input type="text" className="form-control" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
//       </div>
//       <div className="mb-3">
//         <label>Last Name:</label>
//         <input type="text" className="form-control" value={lastName} onChange={(e) => setLastName(e.target.value)} />
//       </div>
//       <div className="mb-3">
//         <label>Email:</label>
//         <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
//       </div>
//       <div className="mb-3">
//         <label>Address:</label>
//         <input type="text" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} />
//       </div>
//       <div className="mb-3">
//         <label>Zipcode:</label>
//         <input type="text" className="form-control" value={zipcode} onChange={(e) => setZipcode(e.target.value)} />
//       </div>
//       <div className="mb-3">
//         <label>Place:</label>
//         <input type="text" className="form-control" value={place} onChange={(e) => setPlace(e.target.value)} />
//       </div>
//       <div className="mb-3">
//         <label>Size:</label>
//         <input type="text" className="form-control" value={size} onChange={(e) => setSize(e.target.value)} />
//       </div>

//       {/* Display the transformed cart data */}
//       {newList.length > 0 && (
//         <pre className="bg-light p-3 rounded border">{JSON.stringify(newList, null, 2)}</pre>
//       )}

//       {/* Button to send the cart data */}
//       <button onClick={handleSendOrder} className="btn btn-primary mt-4">
//         Submit Order
//       </button>
//     </div>
//   );
// };

// export default Checkout;


// import React, { useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const Checkout = () => {
//   // State to hold user details
//   const [formData, setFormData] = useState({
//     user: 1,
//     first_name: '',
//     last_name: '',
//     email: '',
//     address: '',
//     zipcode: '',
//     place: '',
//     size: '',
//   });

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

//     try {
//       const response = await fetch('http://127.0.0.1:8000/order/list/orders/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log('Order successfully created:', data);
//         // Optionally, reset the form after submission
//         setFormData({
//           user: null,
//           first_name: '',
//           last_name: '',
//           email: '',
//           address: '',
//           zipcode: '',
//           place: '',
//           size: '',
//         });
//       } else {
//         console.error('Failed to create order:', response.statusText);
//       }
//     } catch (error) {
//       console.error('Error sending order:', error);
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h2 className="mb-4">Checkout</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-3">
//           <label htmlFor="first_name" className="form-label">First Name</label>
//           <input
//             type="text"
//             className="form-control"
//             id="first_name"
//             name="first_name"
//             value={formData.first_name}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="mb-3">
//           <label htmlFor="last_name" className="form-label">Last Name</label>
//           <input
//             type="text"
//             className="form-control"
//             id="last_name"
//             name="last_name"
//             value={formData.last_name}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="mb-3">
//           <label htmlFor="email" className="form-label">Email</label>
//           <input
//             type="email"
//             className="form-control"
//             id="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="mb-3">
//           <label htmlFor="address" className="form-label">Address</label>
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
//         <div className="mb-3">
//           <label htmlFor="zipcode" className="form-label">Zip Code</label>
//           <input
//             type="text"
//             className="form-control"
//             id="zipcode"
//             name="zipcode"
//             value={formData.zipcode}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="mb-3">
//           <label htmlFor="place" className="form-label">Place</label>
//           <input
//             type="text"
//             className="form-control"
//             id="place"
//             name="place"
//             value={formData.place}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="mb-3">
//           <label htmlFor="size" className="form-label">Size</label>
//           <input
//             type="text"
//             className="form-control"
//             id="size"
//             name="size"
//             value={formData.size}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <button type="submit" className="btn btn-primary">Submit Order</button>
//       </form>
//     </div>
//   );
// };

// export default Checkout;


import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Checkout = () => {
  const [userId, setUserId] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  // Retrieve the user ID from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      console.log('User ID:', storedUserId);
    }
  }, [userId]);

  // State to hold user details
  const [formData, setFormData] = useState({
    user: userId,
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    zipcode: '',
    place: '',
    size: '',
  });

  // Calculate the total price from the cart
  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cartData.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalPrice(total);
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Prepare the data to be sent
    const payload = {
      address: formData.address,
      email: formData.email,
      first_name: formData.first_name,
      last_name: formData.last_name,
      place: formData.place,
      size: formData.size,
      user: userId || null, // Ensure user is set to null if not available
      zipcode: formData.zipcode,
    };

    try {
      // Step 1: Send order data to the first API
      const response = await fetch('http://127.0.0.1:8000/order/list/orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload), // Send the payload
      });

      if (response.ok) {
        const orderData = await response.json();
        console.log('Order successfully created:', orderData.id);

        // Wait for 30 seconds before sending cart data
        setTimeout(async () => {
          const cartData = JSON.parse(localStorage.getItem('cart')) || [];
          console.log('Cart Data:', cartData);

          for (const item of cartData) {
            const orderItemPayload = {
              order: orderData.id || null,
              product: item.id || null,
              price: item.price || null,
              quantity: item.quantity || null,
            };

            console.log('Order Item Payload:', orderItemPayload);

            const itemsResponse = await fetch('http://127.0.0.1:8000/order/order-items/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(orderItemPayload),
            });

            if (itemsResponse.ok) {
              const itemsData = await itemsResponse.json();
              console.log('Order item successfully created:', itemsData);
            } else {
              console.error('Failed to create order item:', await itemsResponse.json());
            }
          }
        }, 15000); // Adjust the delay as necessary
      } else {
        console.error('Failed to create order:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending order:', error);
    }

    setFormData({
      user: null,
      first_name: '',
      last_name: '',
      email: '',
      address: '',
      zipcode: '',
      place: '',
      size: '',
    });
  };

  // PayPal integration
  useEffect(() => {
    if (window.paypal) {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: totalPrice.toFixed(2), // Use totalPrice from state
                },
              },
            ],
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then((details) => {
            console.log('Transaction completed by', details.payer.name.given_name);
            alert('Transaction successful!');
          });
        },
        onError: (err) => {
          console.error('PayPal error:', err);
        },
      }).render('#paypal-button-container');
    }
  }, [totalPrice]);
  
  return (
    <div className="container mt-5">
      <h2 className="mb-4">Checkout</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="first_name" className="form-label">First Name</label>
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
          <label htmlFor="last_name" className="form-label">Last Name</label>
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
          <label htmlFor="email" className="form-label">Email</label>
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
          <label htmlFor="address" className="form-label">Address</label>
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
        <div className="mb-3">
          <label htmlFor="zipcode" className="form-label">Zip Code</label>
          <input
            type="text"
            className="form-control"
            id="zipcode"
            name="zipcode"
            value={formData.zipcode}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="place" className="form-label">Place</label>
          <input
            type="text"
            className="form-control"
            id="place"
            name="place"
            value={formData.place}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="size" className="form-label">Size</label>
          <input
            type="text"
            className="form-control"
            id="size"
            name="size"
            value={formData.size}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Submit Order</button>
        <div id="paypal-button-container"></div>
        </form>
    </div>
  );
};

export default Checkout;

