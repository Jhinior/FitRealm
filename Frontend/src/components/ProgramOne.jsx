import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ropeJumping from "../assets/images/ropeJumbing.mp4";
import people3 from '../assets/images/people-6.jpg';
import people4 from '../assets/images/people-4.jpg';
import people5 from '../assets/images/people-5.jpg';

import '../assets/styles/ProgramOne.css';

function ProgramOne() {
    const { id } = useParams(); 
    const [program, setProgram] = useState(null); 

    useEffect(() => {
        const programs = [
            {
                id: 1,
                name: "Strength Training",
                price: "$50",
                image: people3,
                description:"This program focuses on building muscle strength and endurance through resistance exercises. Participants will engage in a variety of workouts targeting major muscle groups, using weights and resistance bands to enhance performance. Ideal for all fitness levels, this program not only improves physical strength but also boosts metabolism and overall health"
            },
            {
                id: 2,
                name: "Cardio & Fitness",
                price: "$40",
                image: people4,
                description: "This program is designed to elevate your heart rate and improve cardiovascular health through dynamic aerobic exercises. Participants will engage in a variety of activities such as running, cycling, and dance to enhance endurance and stamina. Suitable for all fitness levels, Cardio Fitness helps burn calories, boost energy levels, and promote overall well-being"
            },
            {
                id: 3,
                name: "Flexibility Training",
                price: "$30",
                image: people5,
                description: "This program emphasizes improving your range of motion and flexibility through a series of stretching and mobility exercises. Participants will engage in various techniques, including dynamic stretching and yoga-inspired movements, to enhance muscle elasticity and joint mobility. Ideal for all fitness levels, Flexibility Training not only helps prevent injuries but also promotes relaxation and overall physical wellness."
            },
        ];

        const selectedProgram = programs.find(p => p.id === parseInt(id)); 
        setProgram(selectedProgram); 
    }, [id]);

    if (!program) {
        return <p>Loading...</p>; 
    }

    return (
        <>
            <video
                autoPlay
                loop
                muted
                id="video"
                className="rope"
                src={ropeJumping}
                alt="Rope-Jumping-video"
            />
            <div className="container-2">
                <div className="head-1">
                    <h1 className="header">PROGRAM DETAILS</h1>
                </div>
                <div className="p-2">
                    <p className="paragraph">
                        Here are the details for the {program.name} program.
                    </p>
                </div>
                <div className="program-3">
                    <div className="program-detail">
                        <img className="people" src={program.image} alt={program.name} />
                        <h3>{program.name}</h3>
                        <p>Price: {program.price}</p>
                        <p className='desc'>{program.description}</p>
                        <Link to="/programslist">
                            <button className='v-details'>Back to Programs</button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProgramOne;
