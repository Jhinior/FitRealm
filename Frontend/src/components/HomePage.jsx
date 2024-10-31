import ropeJumping from "../assets/images/file.mp4";
import trainer2 from "../assets/images/trainer2.jpg";
import people6 from "../assets/images/people-6.jpg";
import '../assets/styles/HomePage.css';
const HomePage = () => {
    const userId = localStorage.getItem('userId');
    return (
        <>
            <section className="first-section">
                <video
                    autoPlay
                    loop
                    muted
                    id="video"
                    className="rope"
                    src={ropeJumping}
                    alt="Rope-Jumping-video"
                />

                <div className="hero-container">
                    <div className="hero-content">
                        <h1 className="hero-heading">LET&apos;S GET MOVING</h1>
                        <div className="hero-buttons">
                            <a href={userId ? "/plans" : "/register"} className="btn-solid">
                                BOOK NOW
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section className="quote-section">
                <div className="quote-container">
                    <p className="quote-text">
                        "WHAT SEEMS IMPOSSIBLE TODAY WILL SOON BECOME YOUR WARM-UP"
                    </p>
                </div>
            </section>

            <section className="about-section">
                <div className="about-container">
                    <div className="about-image-container">
                        <img
                            src={trainer2}
                            alt="Weight lifting"
                            className="about-image"
                        />
                    </div>
                    <div className="about-text-container">
                        <h3 className="about-name">FitRealm</h3>
                        <p className="about-description">
                            At FitRealm, we believe every fitness journey is unique. We're here to help you reach your goals—whether that’s losing weight, building muscle, or enhancing strength. With customized training, expert guidance, and nutrition plans, FitRealm empowers you to take charge of your fitness. For beginners and seasoned athletes alike, we provide the tools to make your goals a reality, one workout at a time.
                        </p>
                    </div>
                </div>
            </section>
            <section className="workout-section">
                <h1 className="workout-title">WHAT WE OFFER</h1>
                <div className="workout-options">
                    <div className="workout-option">
                        <h2>Personalized Programs</h2>
                    </div>
                    <div className="workout-option">
                        <h2>Expert Guidance</h2>
                    </div>
                    <div className="workout-option">
                        <h2>Comprehensive Services</h2>
                    </div>
                    <div className="workout-option">
                        <h2>FitRealm Store</h2>
                    </div>
                    <div className="workout-option">
                        <h2>Proven Results</h2>
                    </div>
                    <div className="workout-option">
                        <h2>Community Support</h2>
                    </div>
                </div>
                <a href={userId ? "/plans" : "/register"}>
                    <button className="book-workout-button">Book Now</button>
                </a>
            </section>


            <section className="about-section">
                <div className="about-container">
                    <div className="about-image-container">
                        <img
                            src={people6}
                            alt="Weight lifting"
                            className="about-image"
                        />
                    </div>
                    <div className="blog-container">
                        <h3 className="blog-title">FitRealm Blog</h3>
                        <p className="blog-description">
                        At FitRealm, we believe in the power of community and shared experiences. Our blog is packed with fitness tips, nutrition advice, and inspiring stories to keep you motivated. Dive in to find insights that support your journey, and share your own story to inspire others. Join the FitRealm community and check out our blog today!
                        </p>
                        <a href={userId ? "/Blogs" : "/register"}>
                            <button className="blog-button">Explore Our Blog</button>
                        </a>
                    </div>
                </div>
            </section>

        </>
    );
};


export default HomePage;
