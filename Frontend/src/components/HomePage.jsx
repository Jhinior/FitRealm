import ropeJumping from "../assets/images/file.mp4";
import trainer2 from "../assets/images/trainer2.jpg";
import people6 from "../assets/images/people-6.jpg";
import '../assets/styles/HomePage.css';
const HomePage = () => {
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
                    <a href="/register" className="btn-solid">
                        BOOK NOW
                    </a>
                </div>
                </div>
            </div>
        </section>

        <section className="quote-section">
            <div className="quote-container">
                <p className="quote-text">
                    WHAT SEEMS IMPOSSIBLE TODAY WILL SOON BECOME YOUR WARM-UP
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
                <h3 className="about-name">FITREALM</h3>
                <p className="about-description">
                    At FitRealm, we believe that every fitness journey is unique, 
                    and we’re here to help you achieve your personal goals—whether it's losing weight, 
                    gaining muscle, or improving your overall strength. 
                    With our tailored gym training programs, expert guidance, 
                    and nutrition plans, you’ll be empowered to take control of your fitness. 
                    Whether you're a beginner or experienced, 
                    FitRealm offers the tools and support you need to turn what once seemed impossible into a routine. Together, 
                    we'll transform your aspirations into reality, one workout at a time.
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
            <a href="#">
                <button className="book-workout-button">BOOK A WORKOUT</button>
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
                <h3 className="blog-title">FITREALM BLOGS</h3>
                <p className="blog-description">
                   At FitRealm, we believe in the strength of community and the power of shared experiences. 
                   Our blog is filled with inspiring fitness tips, nutrition advice, 
                   and success stories that can ignite your motivation. 
                   We encourage you to explore our posts and discover the insights that resonate with your journey. 
                   Plus, we want to hear from you! Share your own fitness journey with us—your story could inspire someone else to take the leap towards their goals. Together, 
                   let’s motivate each other to become the best versions of ourselves. Check out our blog today and be part of the FitRealm community!
                </p>
                <a href="#">
                    <button className="blog-button">Explore Our Blog</button>
                </a>
            </div>
            </div>
        </section>

    </>
  );
};


export default HomePage;
