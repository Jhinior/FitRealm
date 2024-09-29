import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import axiosInstance from '../axios';
import ropeJumping from "../assets/images/ropeJumbing.mp4";
// import people3 from '../assets/images/people-6.jpg';
// import people4 from '../assets/images/people-4.jpg';
// import people5 from '../assets/images/people-5.jpg';

import '../assets/styles/ProgramsList.css';

function ProgramsList() {
  // const programs = [
  //   {
  //     id: 1,
  //     name: "Strength Training",
  //     price: "$50",
  //     image: people3, 
  //   },
  //   {
  //     id: 2,
  //     name: "Cardio & Fitness",
  //     price: "$40",
  //     image: people4,
  //   },
  //   {
  //     id: 3,
  //     name: "Flexibility Training",
  //     price: "$30",
  //     image: people5,
  //   },
  // ];
  const [programs, setProgram] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axiosInstance.get(`api/plans/`);
        setProgram(response.data); 
      } catch (error) {
        console.error('Error fetching plans:', error);
        setError('Failed to load program details.');

      }
    };
  
    fetchPlans();
  }, []);
  if (error) {
    return <p>{error}</p>;
}

if (!programs) {
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
      
      <div className="container">
        <div className="pro-list-head-1">
          <h1 className="header">CHOOSE YOUR FITNESS PROGRAM</h1>
        </div>
        <div className="div-2">
          <p className="paragraph">
            I am a paragraph. Click here to add your own text and edit me. It is easy.
            Just click “Edit Text” or double click me to add your own content and make
            changes to the font. I am a great place for you to tell a story and let your
            users know a little more about you.
          </p>
        </div>
        <div className="div-3">
          {programs.map((program, index) => (
            <div
              key={program.id}
              className={
                index === 0 ? "left" : index === 1 ? "middle" : "right"
              }
            >
              <img
                className="people"
                src={program.image}
                alt={program.name}
              />
              <h3>{program.plan_name}</h3>
              <p>Price: {program.cost}</p>
              <Link to={`/program/${program.id}`}>
                <button className='v-details'>View Details</button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ProgramsList;
