import { Link, useNavigate } from 'react-router-dom';
import dumblepic from '../assets/images/gym-1.jpg';

import '../assets/styles/OurPrograms.css';

function OurPrograms(){
    const navigate = useNavigate();
    return(
        <>
       
        <div className="container">
        <img className='dumble' src={dumblepic} alt="background-picture" />
            <h1 className='head1'>Our plans and subscribtions</h1>
            

           <div className='div-1'>

            <div className='left-1'>
            <Link className='p-One' to='/ProgramsList'><p>Strength Training</p></Link>

            </div>
            <div className='middle-1'>
            <Link className='p-Two' to='/ProgramsList'><p>Cardio & Fitness</p></Link>

            </div>
            <div className='right-1'>
            <Link className='p-Three' to='/ProgramsList'><p>Flexibility Training</p></Link>

            </div>
           </div>


            <button className='more' onClick={()=> navigate('/ProgramsList')}>Know more</button>
            
        </div>
        
        </>
    );
}
export default OurPrograms;