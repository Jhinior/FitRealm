import React, { useContext, useState } from "react";
import { AuthContext } from "./UserAuthContext";
import { useFormik } from "formik";
import "../../assets/styles/Authentication/register.css";
import { signupSchema } from "./Schema";
import Logo from "./Logo";
import signupUser from "./utils/Signup";

const onSubmit = async (values, actions) => {
  try {
    const url = "http://127.0.0.1:8000/main/signup/";
    const response = await signupUser(values, url);

    if (response.success) {
      console.log("Sign-up successful:", response.message);
      actions.resetForm();
      window.location.href = "/home";
    } else {
      if (response.email === "super user with this email already exists.") {
        const P = document.querySelector(".invalid-email");
        P.setAttribute("id", "invalid-email");
      }
    }
  } catch (error) {
    console.error("Error during sign-up:", error);
  } finally {
    actions.setSubmitting(false);
  }
};

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      passwd: "",
      confirmpasswd: "",
      gender: "",
      image: null,
    },
    validationSchema: signupSchema,
    onSubmit,
  });

  const { setWhoLogin } = useContext(AuthContext);

  const handleFileChange = (event) => {
    setFieldValue("image", event.target.files[0]);
  };

  const x = () => {
    const P = document.querySelector("#invalid-email");
    if (P) {
      P.removeAttribute("id");
    }
  };

  return (
    <>
      <Logo />
      <div className="signup-container">
        <div className="row"></div>
        <div className="col-md-12 cardd signup-form">
          <form onSubmit={handleSubmit} className="box">
            <h1>Sign up</h1>
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
              onChange={(e) => {
                handleChange(e);
                x();
              }}
              onBlur={handleBlur}
              className={errors.email && touched.email ? "input-error" : ""}
            />
            <p className="invalid-email" style={{ display: "none" }}>
              This email is already used
            </p>
            {errors.email && touched.email && (
              <p className="error">{errors.email}</p>
            )}
            <label htmlFor="phone">phone:</label>

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
                className={errors.passwd && touched.passwd ? "input-error" : ""}
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
            {errors.passwd && touched.passwd && (
              <p className="error">{errors.passwd}</p>
            )}

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
            {errors.confirmpasswd && touched.confirmpasswd && (
              <p className="error">{errors.confirmpasswd}</p>
            )}

            <label htmlFor="gender">Gender:</label>

            <select
              id="gender"
              value={values.gender}
              onChange={handleChange}
              onBlur={handleBlur}
              className="form-select mb-3" 
            >
              <option value="" disabled>
                Choose Your Gender
              </option>{" "}
              
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <label className="custom-file-upload">
              <input type="file" id="photo" onChange={handleFileChange} />
              Your Image
            </label>

            <input type="submit" disabled={isSubmitting} value="Sign up" />
            <div id="login-google">
              <i className="fa-brands fa-google"></i>
            </div>
            <span className="spn">
              Already a member?
              <a
                className="login text-muted"
                onClick={() => setWhoLogin("user-login")}
              >
                &nbsp;Login
              </a>
            </span>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
