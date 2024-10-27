import { useNavigate } from 'react-router-dom';
import dumblepic from '../assets/images/gym-1.jpg';
import { useState, useEffect } from 'react';
import axiosInstance from '../axios';
import '../assets/styles/OurPrograms.css';

function OurPrograms(){
    
    const navigate = useNavigate();
    const [programs, setProgram] = useState([]);
    const [error, setError] = useState(null);
  
    const token = localStorage.getItem('token')
    useEffect(() => {
      const fetchPlans = async () => {
        try {
          const response = await axiosInstance.get(`api/plans/`,{
                                        headers: {
                                          Authorization: `token ${token}`,
                                        },
                                      });
          console.log(response.data);
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
  
    if (!programs.length) {
      return <p>Loading...</p>;
    }
    return(
        <>
        <div className="ourPrograms-container">
            <img className='ourPrograms-dumble' src={dumblepic} alt="background-picture" />
            <h1 className='ourPrograms-head1'>Our plans and subscriptions</h1>
            <div className='ourPrograms-list'>  
                {programs.map((program) => (
                    <div key={program.id} className='ourPrograms-item'> 
                        <button className='ourprograms-names' onClick={() => navigate(`/program/${program.id}`)}>
                          {program.plan_name}
                        </button>
                    </div>
                ))}
            </div>

            <button className='ourPrograms-more' onClick={() => navigate('/ProgramsList')}>
                Know more
            </button>
        </div>
        </>
    );
}

export default OurPrograms;
