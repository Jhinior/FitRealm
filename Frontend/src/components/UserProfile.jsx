import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import '../assets/styles//UserProfile.css';


function Profile() {
    const [profileData, setProfileData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        gender: '',
        image: '',
        phone: '',
    });
     const userId = localStorage.getItem('userId');

    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchProfile = () => {
        axios.get(`http://127.0.0.1:8000/main/users/${userId}/`).then((res) => {
            setProfileData(res.data);
        });
    };

    useEffect(() => {
        fetchProfile();
    }, []);

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

        const res = await axios.get(`http://127.0.0.1:8000/main/users/${userId}/`);

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
            const res = await axios.patch(`http://127.0.0.1:8000/main/users/${userId}/`, formData);
            alert("success", "Profile updated successfully", "");
            setLoading(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("error", "An Error Occured", "");
        }
    };

    console.log(profileData);
    return (
        <>
            <section className="pt-5 pb-5" style={{ backgroundColor:"#151515", }}>
                <div className="container">
                    <div className="row mt-0 mt-md-4">
                        <div className="col-lg-12 col-md-8 col-12" style={{ backgroundColor:"#151515", }}>
                            {/* Card */}
                            <div className="card">
                                {/* Card header */}
                                <div className="card-header">
                                    <h3 className="mb-0"><h2>{profileData.first_name} {profileData.last_name}</h2></h3>
                                </div>
                                {/* Card body */}
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
                                        {/* Form */}
                                        <div className="row gx-3">
                                       {/* First name */}
                                            <div className="mb-3 col-12 col-md-12">
                                                <label className="form-label" htmlFor="fname">
                                                    First Name
                                                </label>
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

                                            {/* Last name */}
                                            <div className="mb-3 col-12 col-md-12">
                                                <label className="form-label" htmlFor="lname">
                                                    Last Name
                                                </label>
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

                                            {/* Email */}
                                            <div className="mb-3 col-12 col-md-12">
                                                <label className="form-label" htmlFor="email">
                                                    Email
                                                </label>
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

                                            {/* Gender */}
                                                <div className="mb-3 col-12 col-md-12 text-start">
                                                    <label className="form-label" htmlFor="gender">
                                                        Gender
                                                    </label>
                                                    <select
                                                        id="gender"
                                                        className="form-control mt-2" // Added margin-top for spacing
                                                        onChange={handleProfileChange}
                                                        name="gender"
                                                        value={profileData?.gender || ''}
                                                        style={{
                                                            color: "white",

                                                        }}
                                                    >
                                                        <option value="" disabled>Select Gender</option> {/* Placeholder option */}
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                    </select>
                                                </div>


                                            {/* Phone */}
                                            <div className="mb-3 col-12 col-md-12">
                                                <label className="form-label" htmlFor="phone">
                                                    Phone
                                                </label>
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
                                                {/* Button */}
                                                <button className="btn btn-primary" type="submit">
                                                    Update Profile <i className="fas fa-check-circle"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Profile;