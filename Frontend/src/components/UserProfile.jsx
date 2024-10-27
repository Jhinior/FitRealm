import { useState, useEffect } from "react";
import axios from 'axios';
import '../assets/styles/UserProfile.css';

function Profile() {
    const [profileData, setProfileData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        gender: '',
        image: '',
        phone: '',
    });

    const [trainer, setTrainer] = useState(null);
    const [plan, setPlan] = useState(null);
    const [subDetails, setSubDetails] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const userId = localStorage.getItem('userId');
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');

    const fetchProfile = async () => {
        const res = await axios.get(`http://127.0.0.1:8000/main/users/${userId}/`, {
            headers: { Authorization: `token ${token}` },
        });
        setProfileData(res.data);
    };

    const fetchUserSubs = async () => {
        try {
            const res = await axios.get(`http://127.0.0.1:8000/api/subscriptions/user/${userId}/`, {
                headers: { Authorization: `token ${token}` },
            });
            setSubDetails(res.data);
        } catch (error) {
            console.error("Error fetching subscriptions:", error);
        }
    };

    const fetchTrainerDetails = async () => {
        const response = await axios.get(`http://127.0.0.1:8000/main/trainers/${subDetails[0].trainer}/`, {
            headers: { Authorization: `token ${token}` },
        });
        setTrainer(response.data);
    };

    const fetchPlanDetails = async (planId) => {
        const response = await axios.get(`http://127.0.0.1:8000/api/plans/${planId}/`, {
            headers: { Authorization: `token ${token}` },
        });
        setPlan(response.data);
    };

    useEffect(() => {
        fetchProfile();
        fetchUserSubs();
    }, []);

    useEffect(() => {
        if (subDetails.length > 0) {
            const lastSubscription = subDetails[subDetails.length - 1];
            const trainerId = lastSubscription.trainer;
            const planId = lastSubscription.plan;

            if (trainerId) fetchTrainerDetails(trainerId);
            if (planId) fetchPlanDetails(planId);

            const subscriptionStartDate = lastSubscription.on_subscription;
            if (subscriptionStartDate) {
                setStartDate(subscriptionStartDate);
                const calculatedEndDate = new Date(subscriptionStartDate);
                calculatedEndDate.setDate(calculatedEndDate.getDate() + 30);
                setEndDate(calculatedEndDate.toISOString().split('T')[0]);
            }
        }
    }, [subDetails]);

    // Log subDetails whenever it updates
    useEffect(() => {
        console.log("Updated subDetails:", subDetails);
    }, [subDetails]);

    useEffect(() => {
        if (subDetails.length > 0) {
            const lastSubscription = subDetails[subDetails.length - 1];
            const trainerId = lastSubscription.trainer; // Ensure this matches your API response structure
            const planId = lastSubscription.plan; // Ensure this matches your API response structure

            if (trainerId) fetchTrainerDetails(trainerId);
            if (planId) fetchPlanDetails(planId);

            const subscriptionStartDate = lastSubscription.on_subscription;
            if (subscriptionStartDate) {
                setStartDate(subscriptionStartDate);
                const calculatedEndDate = new Date(subscriptionStartDate);
                calculatedEndDate.setDate(calculatedEndDate.getDate() + 30);
                setEndDate(calculatedEndDate.toISOString().split('T')[0]);
            }
        }
    }, [subDetails]);

    const handleProfileChange = (event) => {
        setProfileData({
            ...profileData,
            [event.target.name]: event.target.value,
        });
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setProfileData({
            ...profileData,
            [event.target.name]: selectedFile,
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

        const res = await axios.get(`http://127.0.0.1:8000/main/users/${userId}/`, {
            headers: {
                Authorization: `token ${token}`,
            },
        });

        const formData = new FormData();
        if (profileData.image && profileData.image !== res.data.image) {
            formData.append("image", profileData.image);
        }
        formData.append("first_name", profileData.first_name);
        formData.append("last_name", profileData.last_name);
        formData.append("email", profileData.email);
        formData.append("gender", profileData.gender);
        formData.append("phone", profileData.phone);

        try {
            await axios.patch(`http://127.0.0.1:8000/main/users/${userId}/`, formData, {
                headers: {
                    Authorization: `token ${token}`,
                },
            });
            alert("success", "Profile updated successfully", "");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("error", "An Error Occurred", "");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <section className="pt-5 pb-5" style={{ backgroundColor: "#151515" }}>
                <div className="container" style={{ backgroundColor: "#151515" }}>
                    <div className="row mt-0 mt-md-4">
                        <div className="col-lg-12 col-md-8 col-12" style={{ backgroundColor: "#151515" }}>
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="mb-0"><h2>{profileData.first_name} {profileData.last_name}</h2></h3>
                                </div>
                                <form className="card-body" onSubmit={handleFormSubmit}>
                                    <div className="d-lg-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center mb-4 mb-lg-0">
                                            <img
                                                src={imagePreview || profileData?.image}
                                                id="img-uploaded"
                                                className="avatar-xl rounded-circle"
                                                alt="avatar"
                                                style={{
                                                    width: "350px",
                                                    height: "350px",
                                                    borderRadius: "50%",
                                                    objectFit: "cover",
                                                    border: "1px solid black"
                                                }}
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
                                                    value={profileData?.first_name || ''}
                                                />
                                                <div className="invalid-feedback">Please enter first name.</div>
                                            </div>

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
                                                    value={profileData?.last_name || ''}
                                                />
                                                <div className="invalid-feedback">Please enter last name.</div>
                                            </div>

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
                                                    value={profileData?.email || ''}
                                                />
                                                <div className="invalid-feedback">Please enter a valid email.</div>
                                            </div>

                                            <div className="mb-3 col-12 col-md-12 text-start">
                                                <label className="form-label" htmlFor="gender">Gender</label>
                                                <select
                                                    id="gender"
                                                    className="form-control mt-2"
                                                    onChange={handleProfileChange}
                                                    name="gender"
                                                    value={profileData?.gender || ''}
                                                    style={{ color: "white" }}
                                                >
                                                    <option value="" disabled>Select Gender</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                </select>
                                            </div>

                                            <div className="mb-3 col-12 col-md-12">
                                                <label className="form-label" htmlFor="phone">Phone</label>
                                                <input
                                                    type="text"
                                                    id="phone"
                                                    className="form-control"
                                                    placeholder="Phone"
                                                    onChange={handleProfileChange}
                                                    name="phone"
                                                    value={profileData?.phone || ''}
                                                />
                                            </div>
                                            <div className="col-12">
                                                <button className="btn btn-primary" type="submit" disabled={loading}>
                                                    {loading ? 'Updating...' : 'Update Profile'} <i className="fas fa-check-circle"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="card subscribed-plans-card mt-4">
                                <div className="subscribed-plans-card-header">
                                    <h3 className="mb-0">Subscribed Plan</h3>
                                </div>
                                <div className="subscribed-plans-card-body">
                                    <div className="subscribed-plan-container">
                                        <div className="subscribed-plan-details">
                                            <h5>Plan Information</h5>
                                            <p>{plan?.plan_name || 'No plan subscribed'}</p>
                                            <p>Start Date: {startDate.split('T')[0]}</p>
                                            <p>End Date: {endDate}</p>
                                        </div>
                                        <div className="subscribed-plan-details">
                                            <h5>Trainer Information</h5>
                                            {trainer ? (
                                                <>
                                                    <p>Name: {trainer.first_name} {trainer.last_name}</p>
                                                    <p>Email: {trainer.email}</p>
                                                    <p>Phone: {trainer.phone}</p>
                                                </>
                                            ) : (
                                                <p>No trainer information available.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Profile;
