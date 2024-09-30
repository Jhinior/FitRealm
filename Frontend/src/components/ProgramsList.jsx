import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axiosInstance from '../axios';
import ropeJumping from "../assets/images/ropeJumbing.mp4";
import '../assets/styles/ProgramsList.css';

function ProgramsList() {
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
        className="background-video"
        src={ropeJumping}
        alt="Rope-Jumping-video"
      />
      
      <div className="programs-container">
        <div className="programs-header">
          <h1 className="header-title">CHOOSE YOUR FITNESS PROGRAM</h1>
        </div>
        <div className="programs-description">
          <p className="description-text">
            I am a paragraph. Click here to add your own text and edit me. It is easy.
            Just click “Edit Text” or double click me to add your own content and make
            changes to the font. I am a great place for you to tell a story and let your
            users know a little more about you.
          </p>
        </div>
        <div className="programs-list">
          {programs.map((program, index) => (
            <div
              key={program.id}
              className={
                index === 0 ? "program-left" : index === 1 ? "program-middle" : "program-right"
              }
            >
              <img
                className="program-image"
                src={program.image}
                alt={program.name}
              />
              <h3>{program.plan_name}</h3>
              <p>Price: {program.cost}</p>
              <Link to={`/program/${program.id}`}>
                <button className='view-details-button'>View Details</button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ProgramsList;
