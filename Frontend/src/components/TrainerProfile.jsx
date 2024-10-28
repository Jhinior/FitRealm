// import { useState, useEffect } from "react";
// import axios from 'axios';
// import '../assets/styles/TrainerProfile.css';

// function Profile() {
//     const [profileData, setProfileData] = useState({
//         user: {
//             first_name: '',
//             last_name: '',
//             email: '',
//             gender: '',
//             image: '',
//             phone: ''
//         },
//         rating: 0,
//         reviews: [],
//         years_of_experience: 0
//     });
//     const [subs,setSubs] = useState([])
//     const userId = localStorage.getItem('userId');
//     const [imagePreview, setImagePreview] = useState("");
//     const [loading, setLoading] = useState(false);
//     const token = localStorage.getItem('token');

//     const fetchProfile = async () => {
//         try {
//             const res = await axios.get(`http://127.0.0.1:8000/main/trainers/${userId}/`, {
//                 headers: {
//                     Authorization: `token ${token}`,
//                 },
//             });
//             setProfileData(res.data);
//         } catch (error) {
//             console.error("Error fetching profile data:", error);
//         }
//     };

//     const fetchSubs = async () => {
//         console.log('userID',userId)
//         try {
//             const res = await axios.get(`http://127.0.0.1:8000/main/users/assigned-trainer/${userId}/`, {
//                 headers: {
//                     Authorization: `token ${token}`,
//                 },
//             });
//             setSubs(res.data);
//         } catch (error) {
//             console.error("Error fetching profile data:", error);
//         }
//     };

//     useEffect(() => {
//         fetchProfile();
//         fetchSubs();
//         console.log(subs)
//     }, []);

//     const handleProfileChange = (event) => {
//         setProfileData({
//             ...profileData,
//             user: {
//                 ...profileData.user,
//                 [event.target.name]: event.target.value,
//             }
//         });
//     };

//     const handleFileChange = (event) => {
//         const selectedFile = event.target.files[0];
//         setProfileData({
//             ...profileData,
//             user: {
//                 ...profileData.user,
//                 image: selectedFile,
//             }
//         });

//         const reader = new FileReader();
//         reader.onloadend = () => {
//             setImagePreview(reader.result);
//         };
//         if (selectedFile) {
//             reader.readAsDataURL(selectedFile);
//         }
//     };

//     const handleFormSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         const formData = new FormData();

//         if (profileData.user.image) {
//             formData.append("image", profileData.user.image);
//         }
//         formData.append("first_name", profileData.user.first_name);
//         formData.append("last_name", profileData.user.last_name);
//         formData.append("email", profileData.user.email);
//         formData.append("gender", profileData.user.gender);
//         formData.append("phone", profileData.user.phone);
//         console.log(formData)
//         try {
//             await axios.patch(`http://127.0.0.1:8000/main/trainers/${userId}/`, formData, {
//                 headers: {
//                     Authorization: `token ${token}`,
//                 },
//             });
//             alert("Profile updated successfully");

//             // Fetch updated profile data
//             fetchProfile();
//         } catch (error) {
//             console.error("Error updating profile:", error.response ? error.response.data : error);
//             alert("An error occurred while updating the profile");
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (!profileData.user) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <>
//             <section className="pt-5 pb-5" style={{ backgroundColor:"#151515" }}>
//                 <div className="container" style={{ backgroundColor:"#151515" }}>
//                     <div className="row mt-0 mt-md-4">
//                         <div className="col-lg-12 col-md-8 col-12" style={{ backgroundColor:"#151515" }}>
//                             <div className="card">
//                                 <div className="card-header">
//                                     <h2>{profileData.user.first_name} {profileData.user.last_name}</h2>
//                                     <h5>Years Of Experience: {profileData.years_of_experience}</h5>
//                                 </div>
//                                 <form className="card-body" onSubmit={handleFormSubmit}>
//                                     <div className="d-lg-flex align-items-center justify-content-between">
//                                         <div className="d-flex align-items-center mb-4 mb-lg-0">
//                                             <img
//                                                 src={imagePreview || profileData.user.image}
//                                                 className="avatar-xl rounded-circle"
//                                                 alt="avatar"
//                                                 style={{ width: "350px", height: "350px", objectFit: "cover", border: "1px solid black" }}
//                                             />
//                                             <div className="ms-3">
//                                                 <h4 className="mb-0">Your avatar</h4>
//                                                 <input type="file" name="image" className="form-control mt-3" onChange={handleFileChange} />
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <hr className="my-5" />
//                                     <div>
//                                         <h4 className="mb-0">Personal Details</h4>
//                                         <p className="mb-4">Edit your personal information and address.</p>
//                                         <div className="row gx-3">
//                                             {/* First name */}
//                                             <div className="mb-3 col-12 col-md-12">
//                                                 <label className="form-label" htmlFor="fname">First Name</label>
//                                                 <input
//                                                     type="text"
//                                                     id="fname"
//                                                     className="form-control"
//                                                     placeholder="First Name"
//                                                     required
//                                                     onChange={handleProfileChange}
//                                                     name="first_name"
//                                                     value={profileData.user.first_name || ''}
//                                                 />
//                                             </div>

//                                             {/* Last name */}
//                                             <div className="mb-3 col-12 col-md-12">
//                                                 <label className="form-label" htmlFor="lname">Last Name</label>
//                                                 <input
//                                                     type="text"
//                                                     id="lname"
//                                                     className="form-control"
//                                                     placeholder="Last Name"
//                                                     required
//                                                     onChange={handleProfileChange}
//                                                     name="last_name"
//                                                     value={profileData.user.last_name || ''}
//                                                 />
//                                             </div>

//                                             {/* Email */}
//                                             <div className="mb-3 col-12 col-md-12">
//                                                 <label className="form-label" htmlFor="email">Email</label>
//                                                 <input
//                                                     type="email"
//                                                     id="email"
//                                                     className="form-control"
//                                                     placeholder="Email"
//                                                     required
//                                                     onChange={handleProfileChange}
//                                                     name="email"
//                                                     value={profileData.user.email || ''}
//                                                 />
//                                             </div>

//                                             {/* Gender */}
//                                             <div className="mb-3 col-12 col-md-12 text-start">
//                                                 <label className="form-label" htmlFor="gender">Gender</label>
//                                                 <select
//                                                     id="gender"
//                                                     className="form-control mt-2"
//                                                     onChange={handleProfileChange}
//                                                     name="gender"
//                                                     value={profileData.user.gender || ''}
//                                                 >
//                                                     <option value="" disabled>Select Gender</option>
//                                                     <option value="Male">Male</option>
//                                                     <option value="Female">Female</option>
//                                                 </select>
//                                             </div>

//                                             {/* Phone */}
//                                             <div className="mb-3 col-12 col-md-12">
//                                                 <label className="form-label" htmlFor="phone">Phone</label>
//                                                 <input
//                                                     type="text"
//                                                     id="phone"
//                                                     className="form-control"
//                                                     placeholder="Phone"
//                                                     onChange={handleProfileChange}
//                                                     name="phone"
//                                                     value={profileData.user.phone || ''}
//                                                 />
//                                             </div>
//                                             <div className="col-12">
//                                                 <button className="btn btn-primary" type="submit" disabled={loading}>
//                                                     {loading ? "Updating..." : "Update Profile"}
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//         </>
//     );
// }

// export default Profile;

import { useState, useEffect } from "react";
import axios from 'axios';
import '../assets/styles/TrainerProfile.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Profile() {
    const [profileData, setProfileData] = useState({
        user: {
            first_name: '',
            last_name: '',
            email: '',
            gender: '',
            image: '',
            phone: ''
        },
        rating: 0,
        reviews: [],
        years_of_experience: 0
    });
    const [orderItems, setOrderItems] = useState([]);
    const [subscribedPlan, setSubscribedPlan] = useState(null);
    const userId = localStorage.getItem('userId');
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');

    const fetchProfile = async () => {
        try {
            const res = await axios.get(`http://127.0.0.1:8000/main/trainers/${userId}/`, {
                headers: {
                    Authorization: `token ${token}`,
                },
            });
            setProfileData(res.data);
        } catch (error) {
            console.error("Error fetching profile data:", error);
            toast.error("Failed to load profile data.");
        }
    };


   // Fetch subscribed plan data
   const fetchSubscribedPlan = async () => {
        try {
            const res = await axios.get(`http://127.0.0.1:8000/api/trainer/${userId}/`, {
                headers: {
                    Authorization: `token ${token}`,
                },
            });
            setSubscribedPlan(res.data[0]);
        } catch (error) {
            console.error("Error fetching subscribed plan data:", error);
            toast.error("Failed to load subscribed plan data.");
        }
    };

    useEffect(() => {
        const fetchOrderItems = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/order/users/${userId}/order-items/`);
                if (!response.ok) {
                    throw new Error('Failed to fetch order items');
                }
                const data = await response.json();
                setOrderItems(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderItems();
    }, [userId]);


    useEffect(() => {
        fetchProfile();
        fetchSubscribedPlan();
    }, []);


    const handleProfileChange = (event) => {
        setProfileData({
            ...profileData,
            user: {
                ...profileData.user,
                [event.target.name]: event.target.value,
            }
        });
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setProfileData({
            ...profileData,
            user: {
                ...profileData.user,
                image: selectedFile,
            }
        });

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        if (selectedFile) {
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        if (profileData.user.image) {
            formData.append("image", profileData.user.image);
        }
        formData.append("first_name", profileData.user.first_name);
        formData.append("last_name", profileData.user.last_name);
        formData.append("email", profileData.user.email);
        formData.append("gender", profileData.user.gender);
        formData.append("phone", profileData.user.phone);

        try {
            await axios.patch(`http://127.0.0.1:8000/main/trainers/${userId}/`, formData, {
                headers: {
                    Authorization: `token ${token}`,
                },
            });
            toast.success("Profile updated successfully!");
            fetchProfile(); // Refresh profile data after update
        } catch (error) {
            console.error("Error updating profile:", error.response ? error.response.data : error);
            toast.error("An error occurred while updating the profile.");
        } finally {
            setLoading(false);
        }
    };

    if (!profileData.user) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
            <section className="pt-5 pb-5" style={{ backgroundColor:"#151515" }}>
                <div className="container" style={{ backgroundColor:"#151515" }}>
                    <div className="row mt-0 mt-md-4">
                        <div className="col-lg-12 col-md-8 col-12" style={{ backgroundColor:"#151515" }}>
                            <div className="card">
                                <div className="card-header">
                                    <h2>{profileData.user.first_name} {profileData.user.last_name}</h2>
                                    <h5>Years Of Experience: {profileData.years_of_experience}</h5>
                                </div>
                                <form className="card-body" onSubmit={handleFormSubmit}>
                                    <div className="d-lg-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center mb-4 mb-lg-0">
                                            <img
                                                src={imagePreview || profileData.user.image}
                                                className="avatar-xl rounded-circle"
                                                alt="avatar"
                                                style={{ width: "350px", height: "350px", objectFit: "cover", border: "1px solid black" }}
                                            />
                                            <div className="ms-3">
                                                <h4 className="mb-0">Your avatar</h4>
                                                <input type="file" name="image" className="form-control mt-3" onChange={handleFileChange} />
                                            </div>
                                        </div>
                                    </div>
                                    <hr className="my-5" />
                                    <div>
                                        <h4 className="mb-0">Personal Details</h4>
                                        <p className="mb-4">Edit your personal information and address.</p>
                                        <div className="row gx-3">
                                            {/* First name */}
                                            <div className="mb-3 col-12 col-md-12">
                                                <label className="form-label" htmlFor="fname">First Name</label>
                                                <input
                                                    type="text"
                                                    id="fname"
                                                    className="form-control"
                                                    placeholder="First Name"
                                                    required
                                                    onChange={handleProfileChange}
                                                    name="first_name"
                                                    value={profileData.user.first_name || ''}
                                                />
                                            </div>

                                            {/* Last name */}
                                            <div className="mb-3 col-12 col-md-12">
                                                <label className="form-label" htmlFor="lname">Last Name</label>
                                                <input
                                                    type="text"
                                                    id="lname"
                                                    className="form-control"
                                                    placeholder="Last Name"
                                                    required
                                                    onChange={handleProfileChange}
                                                    name="last_name"
                                                    value={profileData.user.last_name || ''}
                                                />
                                            </div>

                                            {/* Email */}
                                            <div className="mb-3 col-12 col-md-12">
                                                <label className="form-label" htmlFor="email">Email</label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    className="form-control"
                                                    placeholder="Email"
                                                    required
                                                    onChange={handleProfileChange}
                                                    name="email"
                                                    value={profileData.user.email || ''}
                                                />
                                            </div>

                                            {/* Gender */}
                                            <div className="mb-3 col-12 col-md-12 text-start">
                                                <label className="form-label" htmlFor="gender">Gender</label>
                                                <select
                                                    id="gender"
                                                    className="form-control mt-2"
                                                    onChange={handleProfileChange}
                                                    name="gender"
                                                    value={profileData.user.gender || ''}
                                                >
                                                    <option value="" disabled>Select Gender</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                </select>
                                            </div>

                                            {/* Phone */}
                                            <div className="mb-3 col-12 col-md-12">
                                                <label className="form-label" htmlFor="phone">Phone</label>
                                                <input
                                                    type="text"
                                                    id="phone"
                                                    className="form-control"
                                                    placeholder="Phone"
                                                    onChange={handleProfileChange}
                                                    name="phone"
                                                    value={profileData.user.phone || ''}
                                                />
                                            </div>
                                            <div className="col-12">
                                                <button className="btn btn-primary" type="submit" disabled={loading}>
                                                    {loading ? "Updating..." : "Update Profile"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>








                            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
<section className="pt-5 pb-5" style={{ backgroundColor: "#151515" }}>
    <div className="container" style={{ backgroundColor: "#151515" }}>
        <div className="row mt-0 mt-md-4">
            <div className="col-lg-12 col-md-8 col-12" style={{ backgroundColor: "#151515" }}>
                <div className="card">
                    {/* Profile Header and Form */}
                    {/* ... Existing profile form code ... */}
                </div>

                {/* Subscribed Plan Card */}
                {subscribedPlan && (
                    <div className="card subscribed-plans-card mt-4">
                        <div className="subscribed-plans-card-header">
                            <h3 className="mb-0">Subscribed Plan</h3>
                        </div>
                        <div className="subscribed-plans-card-body">
                            <div className="subscribed-plan-container">
                                <div className="subscribed-plan-details">
                                    <h5>Plan Information</h5>
                                    <p>{subscribedPlan.plan.plan_name || 'No plan subscribed'}</p>
                                    <p>Start Date: {subscribedPlan.on_subscription.split('T')[0]}</p>
                                </div>
                                <div className="subscribed-plan-details">
                                    <h5>Trainer Information</h5>
                                    {subscribedPlan.user ? (
                                        <>
                                            <p>Name: {subscribedPlan.user.first_name} {subscribedPlan.user.last_name}</p>
                                            <p>Email: {subscribedPlan.user.email}</p>
                                            <p>Phone: {subscribedPlan.user.phone}</p>
                                        </>
                                    ) : (
                                        <p>No trainer information available.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Orders Information Card */}
                <div className="card subscribed-plans-card mt-4">
                    <div className="subscribed-plans-card-header">
                        <h3 className="mb-0">Orders Information</h3>
                    </div>
                    <div className="subscribed-plans-card-body">
                        {orderItems.length > 0 ? (
                            orderItems.map((item) => (
                                <div key={item.id} className="subscribed-plan-container">
                                    <div className="subscribed-plan-details">
                                        <h5>Order Information</h5>
                                        <p>Product Name: {item.product_name || 'No product name available'}</p>
                                        <p>Price: ${item.price}</p>
                                        <p>Quantity: {item.quantity}</p>
                                        <p>Payment Status: {item.payment ? 'Paid' : 'Pending'}</p>
                                    </div>
                                    <div className="subscribed-plan-details">
                                        <h5>User Information</h5>
                                        <p>Name: {item.user.first_name} {item.user.last_name}</p>
                                        <p>Email: {item.user.email}</p>
                                        <p>Phone: {item.user.phone}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No orders available.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>






                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Profile;
