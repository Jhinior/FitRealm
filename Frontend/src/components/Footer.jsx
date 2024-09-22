import apple from '../assets/images/apple.webp'
import google from '../assets/images/Google.webp'
import '../assets/styles/Footer.css'

function Footer(){
    return(
        <>
        <footer className='footer'>
            <h3>Join us on mobile!</h3>
            <p>Download the Spaces by FitRealm app and join us to easily stay updated on the go.</p>
            <div className='images'>
            <img src={apple} alt=" apple app logo" />
            <img src={google} alt="google app logo" />
            </div>
           
            <p> © 2035 by Fitness Coach. Powered and secured by FitRealm</p>
        </footer>

        </>
    );
}
export default Footer