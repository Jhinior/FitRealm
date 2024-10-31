
import { useContext, useState } from "react";
import { AuthContext } from "./TrainerAuthContext";
import { useFormik } from "formik";
import "../../assets/styles/Authentication/register.css";
import { TrainerSignupSchema } from "./Schema";
import Logo from "./Logo";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../assets/styles/Authentication/otpcard.css";
import OtpPopup from "./Otppopup";

const TrainerSignup = () => {

  // Popup state
  const [isPopupOpen, setPopupOpen] = useState(false);

  // email check api
  const sendOtp = async (values) => {
    const url = "http://localhost:8000/main/otpcheck";
    const email = values.email
    console.log(`Email from sendOTP: ${email}`)
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        "email": email
      })
    })

    // if email is valid, show popup
    if (res.status == 200) {
      setPopupOpen(true)
    }

    if (res.status != 200) {
      const data = await res.json()
      console.log(data.message)
      console.log(data.status)
      const warning = document.querySelector(".invalid-email")
      warning.style.display = "block";
    }
  }


  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { setWhoLogin } = useContext(AuthContext);

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      years_of_experience: "",
      passwd: "",
      confirmpasswd: "",
      sign_gender: "",
      photo: null,
    },
    validationSchema: TrainerSignupSchema,
  });

  const handleFileChange = (event) => {
    setFieldValue("photo", event.target.files[0]);
  };

  const x = () => {
    const P = document.querySelector("#invalid-email");
    if (P) {
      P.removeAttribute("id");
    }
  };

  // The email is accepted, and the OTP is sent
  if (isPopupOpen) {
    return (
      <>
        <OtpPopup values={values} api="http://127.0.0.1:8000/main/signup/trainer/" />
      </>
    )
  }

  // Fill form and submit the email
  if (!isPopupOpen) {
    return (
      <>
        <Logo />
        <div className="trainer-container">
          <div className="row"></div>
          <div className="col-md-12 cardd signup-form">
            <form onSubmit={async (e) => {
              e.preventDefault()
              console.log("Values:")
              console.log(values)
              sendOtp(values)
            }} className="box">
              <h1>Trainer Registration</h1>
              <p className="text-muted">
                {" "}
                Please enter your data for registration!
              </p>
              <label htmlFor="firstname">First Name:</label>


              <input
                type="text"
                id="firstname"
                placeholder="First Name"
                value={values.firstname}
                onChange={handleChange}
                onBlur={handleBlur}
                className={
                  errors.firstname && touched.firstname ? "input-error" : ""
                }
              />
              {errors.firstname && touched.firstname && (
                <p className="error">{errors.firstname}</p>
              )}
              <label htmlFor="lastname">Last Name:</label>

              <input
                type="text"
                id="lastname"
                placeholder="Last Name"
                value={values.lastname}
                onChange={handleChange}
                onBlur={handleBlur}
                className={
                  errors.lastname && touched.lastname ? "input-error" : ""
                }
              />
              {errors.lastname && touched.lastname && (
                <p className="error">{errors.lastname}</p>
              )}
              <label htmlFor="email">Email:</label>

              <input
                type="email"
                id="email"
                placeholder="Email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.email && touched.email ? "input-error" : ""}
              />
              <p className="invalid-email" style={{ display: "none" , color: "red"}}>
                This email is already used
              </p>
              {errors.email && touched.email && (
                <p className="error">{errors.email}</p>
              )}
              <label htmlFor="phone">Phone:</label>

              <input
                type="text"
                id="phone"
                placeholder="Phone"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.phone && touched.phone ? "input-error" : ""}
              />
              {errors.phone && touched.phone && (
                <p className="error">{errors.phone}</p>
              )}
              <label htmlFor="years_of_experience">Experience:</label>

              <input
                type="number"
                id="years_of_experience"
                placeholder="Years of Experience"
                value={values.years_of_experience}
                onChange={handleChange}
                onBlur={handleBlur}
                className=""
              />
              {errors.years_of_experience && touched.years_of_experience && (
                <p className="error">{errors.years_of_experience}</p>
              )}
              <div className="password-container">
                <div
                  className="password-container"
                  style={{ position: "relative" }}
                >
                  <label htmlFor="passwd">Password:</label>

                  <input
                    type={showPassword ? "text" : "password"}
                    id="passwd"
                    placeholder="Password"
                    value={values.passwd}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.passwd && touched.passwd ? "input-error" : ""
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="btn btn-link toggle-password"
                    style={{
                      position: "absolute",
                      right: "85px",
                      top: "72%",
                      transform: "translateY(-50%)",
                    }}
                  >
                    {showPassword ? (
                      <i className="fa-solid fa-eye-slash"></i>
                    ) : (
                      <i className="fa-solid fa-eye"></i>
                    )}
                  </button>
                </div>
              </div>
              {errors.passwd && touched.passwd && (
                <p className="error">{errors.passwd}</p>
              )}
              <div className="password-container">
                <div
                  className="password-container"
                  style={{ position: "relative" }}
                >
                  <label htmlFor="confirmpasswd">Confirm Password:</label>

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmpasswd"
                    placeholder="Confirm Password"
                    value={values.confirmpasswd}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.confirmpasswd && touched.confirmpasswd
                        ? "input-error"
                        : ""
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="btn btn-link toggle-password"
                    style={{
                      position: "absolute",
                      right: "85px",
                      top: "72%",
                      transform: "translateY(-50%)",
                    }}
                  >
                    {showConfirmPassword ? (
                      <i className="fa-solid fa-eye-slash"></i>
                    ) : (
                      <i className="fa-solid fa-eye"></i>
                    )}
                  </button>
                </div>
              </div>
              {errors.confirmpasswd && touched.confirmpasswd && (
                <p className="error">{errors.confirmpasswd}</p>
              )}

              <label className="custom-file-upload">
                Your Image
                <input type="file" id="photo" onChange={handleFileChange} />
              </label>
              <label className="custom-file-upload">
                Your Certificate
                <input type="file" id="photo" onChange={handleFileChange} />
              </label>

              <input
                type="submit"
                disabled={isSubmitting}
                value="Sign up"
                href="#"
              />
              <span className="spn">
                Already a member?
                <a
                  className="login text-muted"
                  onClick={() => setWhoLogin("trainer-login")}
                >
                  &nbsp;Login
                </a>
              </span>
            </form>
          </div>
        </div>
      </>
    )
  }
}

export default TrainerSignup;