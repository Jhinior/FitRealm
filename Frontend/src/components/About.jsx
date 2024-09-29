import React from 'react';
import '../assets/styles/about.css';

const About = () => {
    return (
        <div className="aboutContainer">

            <section className="firstSection">
                <h1 className="aboutTitle">About FitRealm</h1>
                <h2 className="sectionTitle">Welcome to FitRealm!</h2>
                <p className="sectionText">
                    At FitRealm, we believe that fitness is not just a hobby—it's a way of life. Whether you're looking to transform your body, improve your health, or achieve new fitness goals, our platform provides everything you need to elevate your fitness journey.
                </p>
            </section>

            <section className="secondSection">
                <h2 className="sectionTitle">Who We Are</h2>
                <p className="sectionText">
                    FitRealm is your all-in-one digital fitness platform, designed for individuals who are passionate about living a healthy and active lifestyle. We offer personalized fitness plans, expert guidance, and an online store for supplements and health products, all from the convenience of your home.
                </p>
            </section>

            <section className="thirdSection">
                <div className='overLay'>
                    <div className='innerContainer'>
                        <h2 className="sectionTitle">What We Offer</h2>
                        <ul className="offerList">
                            <li className="offerItem">Personalized Workout Plans for every fitness level.</li>
                            <li className="offerItem">Expert Trainers providing realIime advice and motivation.</li>
                            <li className="offerItem">Supplements and Health Products to fuel your workouts.</li>
                            <li className="offerItem">Fitness Blog covering the latest trends and tips.</li>
                            <li className="offerItem">Community Support to connect with like-minded individuals.</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
