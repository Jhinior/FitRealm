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
        
        localStorage.setItem('programDetails', JSON.stringify({
            id: program.id,
            planName: program.plan_name,
            price: program.cost,
            description: program.description,
            image: program.image
        }));
      
        
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
            <h1 className="header">{program.plan_name} PROGRAM DETAILS</h1>
          </div>
          <div className="program-card-one">
            <div className="program-detail">
              <img
                className="people"
                src={program.image}
                alt={program.plan_name}
              />
              <div className='program-one-cont'>
                <p>Price: {program.cost} <FaDollarSign/> </p>
                <p className="desc-program-one">{program.description}</p>
              

              <div className="program-detail-buttons">
                <Link to="/programslist">
                  <button className="v-l-details">All Programs</button>
                </Link>
                <button className="v-r-details" onClick={handleMakePayment}>Claim Your Spot</button>
              </div>
              </div>
              
            </div>
          </div>
        </div>
      </>
    );
}

export default ProgramOne;
