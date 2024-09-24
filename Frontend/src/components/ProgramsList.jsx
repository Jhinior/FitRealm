// ProgramsList.js
import React, { useEffect, useState } from 'react';
import ropeJumping from "../assets/images/ropeJumbing.mp4";
import '../assets/styles/ProgramsList.css';
import axios from 'axios';

function ProgramsList() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/main/plans/'); // Update the URL as necessary
        console.log(response.data)
        if (response.status !== 200) {
          throw new Error('Network response was not ok');
        }
        setPrograms(response.data); // Assuming the data is an array of program objects
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading programs: {error.message}</p>;

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
        <div className="div-1">
          <h1 className="header">CHOOSE YOUR FITNESS PROGRAM</h1>
        </div>

        <div className="div-2">
          <p className="paragraph">
            I am a paragraph. Click here to add your own text and edit me. It
            is easy. Just click “Edit Text” or double click me to add your own
            content and make changes to the font. I am a great place for you
            to tell a story and let your users know a little more about you.
          </p>
        </div>

        <div className="div-3 row">
          {programs.map(program => (
            <div className="col-md-4 mb-4" key={program.id}>
              <div className="card">
                <img className="card-img-top" src={program.image} alt={program.title} />
                <div className="card-body">
                  <h5 className="card-title">{program.plan_name}</h5>
                  <p className="card-text">{program.description}</p>
                  <p className="card-text">Cost: ${program.cost}</p>
                  <button className="btn btn-primary" onClick={() => navigate('/programdetails')}>View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ProgramsList;
