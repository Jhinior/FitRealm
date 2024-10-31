import '../../assets/styles/Authentication/otpcard.css';
import Trainer_Signup from './utils/TrainerSignup'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from './Logo';

const OtpPopup = ({ isOpen, onClose, values, api }) => {

    const submitCode = async () => {
        const code = document.querySelector("#otpfield");
        const email = values.email;
        console.log(`code: ${code.value}`)
        console.log(`email: ${email}`)
        const url = "http://localhost:8000/main/otpreview";
        const response = await fetch(url,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "email": email,
                    "code": code.value
                })
            }
        )
        if (response.status == 200) {
            const r = Trainer_Signup(values, api)
            if (r){
                toast.success("Your information is under review!");
                setTimeout(() => {
                    window.location.href = "/";
                }, 3000);
            };
        }
        if (response.status == 400) {
            const inp = document.querySelector("#otpfield")
            if (!document.querySelector(".invalid-email")) {
                const p = document.createElement("p");
                p.className = "invalid-email";
                p.style.color = "red";
                p.textContent = "invalid OTP";
                p.fontWeight = "bold";
                inp.insertAdjacentElement("afterend", p);
            }
        }
    }

    return (
        <>
            <Logo />
            <div id="otppopup">
                <div id="otpcard">
                    <form >
                        <label htmlFor="otpfield">Enter the code sent to your email</label>
                        <input type="text" id="otpfield" placeholder="OTP-Code"></input>
                        <input type="submit" value="submit" onClick={(e) => {
                            e.preventDefault();
                            submitCode()
                        }}></input>
                    </form>
                </div>
            </div>
        </>
    );
};

export default OtpPopup;
