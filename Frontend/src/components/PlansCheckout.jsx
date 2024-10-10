// import React, { useState, useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const Checkoutplans = () => {
//   const [userId, setUserId] = useState(null);
//   const [cart, setCart] = useState([]);
//   const [newList, setNewList] = useState([]);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');

//   useEffect(() => {
//     const storedUserId = localStorage.getItem('userId');
//     if (storedUserId) {
//       setUserId(parseInt(storedUserId, 10));  // Parse userId as an integer
//       console.log('User ID:', storedUserId);
//     }
//   }, []);

//   useEffect(() => {
//     const storedCart = localStorage.getItem('programDetails');
    
//     if (storedCart) {
//       const parsedCart = JSON.parse(storedCart);
//       setCart(parsedCart);
//       console.log('programDetails', parsedCart);

//       const transformedCart = [{
//         plan: parsedCart.id,  // Assuming the plan is based on the program ID
//         planName: parsedCart.planName,
//         price: parsedCart.price,
//         description: parsedCart.description,
//         user: userId,  // Add user ID here for each item
//         trainer: 1  // Setting the trainer to ID 3 as required
//       }];

//       setNewList(transformedCart);
//       console.log('Transformed Cart:', transformedCart);
//     } else {
//       console.log('Cart is empty or not found in localStorage');
//     }
//   }, [userId]);

//   const handleSendOrder = async () => {
//     if (newList.length > 0) {
//       try {
//         if(userId === null){
//           console.error('User ID is null. Cannot proceed with the request.');
//           return;
//         }
//         const requestBody = {
//           trainer: 1,   // Set trainer to ID 3
//           user: userId, // Use userId parsed as an integer
//           plan: newList[0].plan // Use the plan ID for the first item
//         };
//         console.log('This is your Request Body:', requestBody); // Add this line to inspect the request body

//         const response = await fetch('http://127.0.0.1:8000/api/subscriptions/', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(requestBody),  
//         });
  
//         if (response.ok) {
//           const data = await response.json();
//           console.log('Subscription successfully created:', data);
  
//           setSuccessMessage('Subscription successfully created!');
//           setErrorMessage('');
  
//           localStorage.removeItem('programDetails');
//           setCart([]);  
//           setNewList([]); 
  
//         } else {
//           const errorData = await response.json();
//           console.error('Failed to create subscription:', errorData);
//           setErrorMessage('Failed to create subscription.');
//           setSuccessMessage('');
//         }
//       } catch (error) {
//         console.error('Error creating subscription:', error);
//         setErrorMessage('An error occurred during the subscription process.');
//         setSuccessMessage('');
//       }
//     } else {
//       console.log('No items in the cart to send.');
//       setErrorMessage('No items in the cart to send.');
//       setSuccessMessage('');
//     }
//   };
  

//   return (
//     <div className="container mt-5 mb-4 p-2">
//       <h2 className="mb-4">Checkout</h2>
      
//       {newList.length > 0 && (
//         <div className="bg-dark p-3 rounded border">
//           <h4>Plan Details</h4>
//           <p><strong>Plan Name:</strong> {newList[0].planName}</p>
//           <p><strong>Price:</strong> {newList[0].price} USD</p>
//           <p><strong>Description:</strong> {newList[0].description}</p>
//         </div>
//       )}

//       {successMessage && (
//         <div className="alert alert-success mt-3">{successMessage}</div>
//       )}
//       {errorMessage && (
//         <div className="alert alert-danger mt-3">{errorMessage}</div>
//       )}

//       <button onClick={handleSendOrder} className="btn btn-primary mt-4">
//         Confirm Subscription
//       </button>
//     </div>
//   );
// };

// export default Checkoutplans;
// import React, { useState, useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const Checkoutplans = () => {
//   const [userId, setUserId] = useState(null);
//   const [cart, setCart] = useState([]);
//   const [newList, setNewList] = useState([]);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [trainers, setTrainers] = useState([]); 
//   const [selectedTrainer, setSelectedTrainer] = useState(null); 

//   useEffect(() => {
//     const storedUserId = localStorage.getItem('userId');
//     if (storedUserId) {
//       setUserId(parseInt(storedUserId, 10)); 
//       console.log('User ID:', storedUserId);
//     }
//   }, []);

  
//   useEffect(() => {
//     const fetchTrainers = async () => {
//       try {
//         const response = await fetch('http://127.0.0.1:8000/main/available-trainers/');
//         if (!response.ok) throw new Error('Failed to fetch trainers');

//         const trainersData = await response.json();
        
//         const availableTrainers = trainersData.filter(trainer => trainer.active_users < 10);
//         setTrainers(availableTrainers);
//         console.log('Available Trainers:', availableTrainers);
//       } catch (error) {
//         console.error('Error fetching trainers:', error);
//       }
//     };

//     fetchTrainers(); 
//   }, []);

//   useEffect(() => {
//     const storedCart = localStorage.getItem('programDetails');
    
//     if (storedCart) {
//       const parsedCart = JSON.parse(storedCart);
//       setCart(parsedCart);
//       console.log('programDetails', parsedCart);

//       const transformedCart = [{
//         plan: parsedCart.id, // Assuming the plan is based on the program I
//         planName: parsedCart.planName,
//         price: parsedCart.price,
//         description: parsedCart.description,
//         user: userId, 
//         trainer: selectedTrainer ? selectedTrainer.id : null 
//       }];

//       setNewList(transformedCart);
//       console.log('Transformed Cart:', transformedCart);
//     } else {
//       console.log('Cart is empty or not found in localStorage');
//     }
//   }, [userId, selectedTrainer]);

//   const handleSendOrder = async () => {
//     if (newList.length > 0) {
//       try {
//         if (userId === null) {
//           console.error('User ID is null. Cannot proceed with the request.');
//           return;
//         }
//         const requestBody = {
//           trainer: selectedTrainer ? selectedTrainer.id : null, 
//           user: userId, 
//           plan: newList[0].plan 
//         };
//         console.log('This is your Request Body:', requestBody); 

//         const response = await fetch('http://127.0.0.1:8000/api/subscriptions/', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(requestBody),
//         });

//         if (response.ok) {
//           const data = await response.json();
//           console.log('Subscription successfully created:', data);

//           setSuccessMessage('Subscription successfully created!');
//           setErrorMessage('');

//           localStorage.removeItem('programDetails');
//           setCart([]);
//           setNewList([]);
//         } else {
//           const errorData = await response.json();
//           console.error('Failed to create subscription:', errorData);
//           setErrorMessage('Failed to create subscription.');
//           setSuccessMessage('');
//         }
//       } catch (error) {
//         console.error('Error creating subscription:', error);
//         setErrorMessage('An error occurred during the subscription process.');
//         setSuccessMessage('');
//       }
//     } else {
//       console.log('No items in the cart to send.');
//       setErrorMessage('No items in the cart to send.');
//       setSuccessMessage('');
//     }
//   };
//    // PayPal Integration
//    useEffect(() => {
//     if (window.paypal && newList.length > 0) {
//       const totalPrice = newList[0].price; // Use the price from newList

//       window.paypal.Buttons({
//         createOrder: (data, actions) => {
//           return actions.order.create({
//             purchase_units: [
//               {
//                 amount: {
//                   value: totalPrice.toFixed(2), // Use totalPrice from state
//                 },
//               },
//             ],
//           });
//         },
//         onApprove: (data, actions) => {
//           return actions.order.capture().then(async (details) => {
//             alert('Transaction successful!');
  
//             // After successful transaction, update payment status to True for each order item
//             try {
//               const plansItemIds = JSON.parse(localStorage.getItem('plansItemIds')) || [];
  
//               for (const planItemId of plansItemIds) {
//                 const response = await fetch(`http://127.0.0.1:8000/api/subscriptions/${planItemId}/`, {
//                   method: 'PATCH',
//                   headers: {
//                     'Content-Type': 'application/json',
//                   },
//                   body: JSON.stringify({ payment: true }), // Update payment to true
//                 });
  
//                 if (response.ok) {
//                   const updatedItem = await response.json();
//                   console.log('Payment updated for order item:', updatedItem);
//                 } else {
//                   console.error('Failed to update payment status for order item:', planItemId);
//                 }
//               }
//             } catch (error) {
//               console.error('Error updating payment status:', error);
//             }
//           });
//         },
//         onError: (err) => {
//           console.error('PayPal error:', err);
//         },
//       }).render('#paypal-button-container');
//     }
//   }, [newList]);

//   return (
//     <div className="container mt-5 mb-4 p-2">
//       <h2 className="mb-4">Checkout</h2>

//       {newList.length > 0 && (
//         <div className="bg-dark p-3 rounded border">
//           <h4>Plan Details</h4>
//           <p><strong>Plan Name:</strong> {newList[0].planName}</p>
//           <p><strong>Price:</strong> {newList[0].price} USD</p>
//           <p><strong>Description:</strong> {newList[0].description}</p>
//         </div>
//       )}

//       <div className="mb-3">
//         <label htmlFor="trainerSelect" className="form-label">Select Trainer:</label>
//         <select
//           id="trainerSelect"
//           className="form-select"
//           onChange={(e) => setSelectedTrainer(trainers.find(trainer => trainer.id === parseInt(e.target.value)))}
//           value={selectedTrainer ? selectedTrainer.id : ''}
//         >
//           <option value="">Choose a trainer</option>
//           {trainers.map((trainer) => (
//             <option key={trainer.id} value={trainer.id}>
//               {trainer.first_name} (Active Trainees: {trainer.active_users})
//             </option>
//           ))}
//         </select>
//       </div>

//       {successMessage && (
//         <div className="alert alert-success mt-3">{successMessage}</div>
//       )}
//       {errorMessage && (
//         <div className="alert alert-danger mt-3">{errorMessage}</div>
//       )}

//       <button onClick={handleSendOrder} className="btn btn-primary mt-4">
//         Confirm Subscription
//       </button>
//     </div>
//   );
// };

// export default Checkoutplans;

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Checkoutplans = () => {
  const [userId, setUserId] = useState(null);
  const [cart, setCart] = useState([]);
  const [newList, setNewList] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [trainers, setTrainers] = useState([]); 
  const [selectedTrainer, setSelectedTrainer] = useState(null); 

  // PayPal Script Load Status
  const [isPayPalScriptLoaded, setIsPayPalScriptLoaded] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(parseInt(storedUserId, 10)); 
      console.log('User ID:', storedUserId);
    }
  }, []);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/main/available-trainers/');
        if (!response.ok) throw new Error('Failed to fetch trainers');

        const trainersData = await response.json();
        
        const availableTrainers = trainersData.filter(trainer => trainer.active_users < 10);
        setTrainers(availableTrainers);
        console.log('Available Trainers:', availableTrainers);
      } catch (error) {
        console.error('Error fetching trainers:', error);
      }
    };

    fetchTrainers(); 
  }, []);

  useEffect(() => {
    const storedCart = localStorage.getItem('programDetails');
    
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      setCart(parsedCart);
      console.log('programDetails', parsedCart);

      const transformedCart = [{
        plan: parsedCart.id,
        planName: parsedCart.planName,
        price: parsedCart.price,
        description: parsedCart.description,
        user: userId, 
        trainer: selectedTrainer ? selectedTrainer.id : null 
      }];

      setNewList(transformedCart);
      console.log('Transformed Cart:', transformedCart);
    } else {
      console.log('Cart is empty or not found in localStorage');
    }
  }, [userId, selectedTrainer]);

 //begining of paypal integration
 useEffect(() => {
  if (isPayPalScriptLoaded && newList.length > 0) {
    const totalPrice = newList[0].price;

    window.paypal.Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: totalPrice.toFixed(2), 
              },
            },
          ],
        });
      },
      onApprove: (data, actions) => {
        return actions.order.capture().then(async (details) => {
          alert('Transaction successful!');

          try {
            const plansItemIds = JSON.parse(localStorage.getItem('plansItemIds')) || [];

            for (const planItemId of plansItemIds) {
              const response = await fetch(`http://127.0.0.1:8000/api/subscriptions/${planItemId}/`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ payment: true }), 
              });

              if (response.ok) {
                const updatedItem = await response.json();
                console.log('Payment updated for order item:', updatedItem);
              } else {
                console.error('Failed to update payment status for order item:', planItemId);
              }
            }
          } catch (error) {
            console.error('Error updating payment status:', error);
          }
        });
      },
      onError: (err) => {
        console.error('PayPal error:', err);
      },
    }).render('#paypal-button-container'); 
  }
}, [isPayPalScriptLoaded, newList]);


  //end of paypal integration

  const handleSendOrder = async () => {
    if (newList.length > 0) {
      try {
        if (userId === null) {
          console.error('User ID is null. Cannot proceed with the request.');
          return;
        }
        const requestBody = {
          trainer: selectedTrainer ? selectedTrainer.id : null, 
          user: userId, 
          plan: newList[0].plan 
        };
        console.log('This is your Request Body:', requestBody); 

        const response = await fetch('http://127.0.0.1:8000/api/subscriptions/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Subscription successfully created:', data);

          setSuccessMessage('Subscription successfully created!');
          setErrorMessage('');

          localStorage.removeItem('programDetails');
          setCart([]);
          setNewList([]);
        } else {
          const errorData = await response.json();
          console.error('Failed to create subscription:', errorData);
          setErrorMessage('Failed to create subscription.');
          setSuccessMessage('');
        }
      } catch (error) {
        console.error('Error creating subscription:', error);
        setErrorMessage('An error occurred during the subscription process.');
        setSuccessMessage('');
      }
    } else {
      console.log('No items in the cart to send.');
      setErrorMessage('No items in the cart to send.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="container mt-5 mb-4 p-2">
      <h2 className="mb-4">Checkout</h2>

      {newList.length > 0 && (
        <div className="bg-dark p-3 rounded border">
          <h4>Plan Details</h4>
          <p><strong>Plan Name:</strong> {newList[0].planName}</p>
          <p><strong>Price:</strong> {newList[0].price} USD</p>
          <p><strong>Description:</strong> {newList[0].description}</p>
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="trainerSelect" className="form-label">Select Trainer:</label>
        <select
          id="trainerSelect"
          className="form-select"
          onChange={(e) => setSelectedTrainer(trainers.find(trainer => trainer.id === parseInt(e.target.value)))}
          value={selectedTrainer ? selectedTrainer.id : ''}
        >
          <option value="">Choose a trainer</option>
          {trainers.map((trainer) => (
            <option key={trainer.id} value={trainer.id}>
              {trainer.first_name} (Active Trainees: {trainer.active_users})
            </option>
          ))}
        </select>
      </div>

      {successMessage && (
        <div className="alert alert-success mt-3">{successMessage}</div>
      )}
      {errorMessage && (
        <div className="alert alert-danger mt-3">{errorMessage}</div>
      )}

      <button onClick={handleSendOrder} className="btn btn-primary mt-4">
        Confirm Subscription
      </button>

      <div id="paypal-button-container" className="mt-4">make a payment</div> 
    </div>
  );
};

export default Checkoutplans;





