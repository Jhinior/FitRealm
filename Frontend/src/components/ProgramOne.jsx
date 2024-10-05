import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaDollarSign } from 'react-icons/fa';

import ropeJumping from "../assets/images/ropeJumbing.mp4";
import axiosInstance from '../axios';
import '../assets/styles/ProgramOne.css';

function ProgramOne() {
    const { id } = useParams(); 
    const [program, setProgram] = useState(null); 
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleMakePayment = () => {
      navigate(`/subscribe/${program.id}`, { state: { planName: program.plan_name, price: program.cost } });
    };

    useEffect(() => {
        const fetchPlanDetail = async () => {
          try {
            const response = await axiosInstance.get(`/api/plans/${id}/`);
            setProgram(response.data); 
          } catch (error) {
            console.error('Error fetching plan detail:', error);
            setError('Failed to load program details.');
          }
        };
      
        fetchPlanDetail();
    }, [id]);

    if (error) {
        return <p>{error}</p>;
    }

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
          className="rope-program-one"
          src={ropeJumping}
          alt="Rope-Jumping-video"
        />
        <div className="container-program-one">
          <div className="head-program-one">
            <h1 className="header">PROGRAM DETAILS</h1>
          </div>
          <div className="p-program-one">
            <p className="paragraph">
              Here are the details for the {program.plan_name} program.
            </p>
          </div>
          <div className="program-card-one">
            <div className="program-detail">
              <img
                className="people"
                src={program.image}
                alt={program.plan_name}
              />
              <h3>{program.name}</h3>
              <div className='program-one-cont'>
               <p>Price: {program.cost} <FaDollarSign/> </p>
              <p className="desc-program-one">{program.description}</p>

              <div className="program-detail-buttons">
                <Link to="/programslist">
                  <button className="v-l-details">Back to Programs</button>
                </Link>
                <button className="v-r-details" onClick={handleMakePayment}>Want to Make a Payment</button>
              </div>
              </div>
              
            </div>
          </div>
        </div>
      </>
    );
}

export default ProgramOne;
