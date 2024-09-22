import { Link, useNavigate } from 'react-router-dom';
import dumblepic from '../assets/images/gym-1.jpg';

import '../assets/styles/OurPrograms.css';

function OurPrograms(){
    const navigate = useNavigate();
    return(
        <>
        
        <div className="container">
            <h1 className='head1'>Our plans and subscribtions</h1>
            <img className='dumble' src={dumblepic} alt="background-picture" />
            <Link className='p-One' to='/ProgramsList'><p>Plan One</p></Link>
            <Link className='p-Two' to='/ProgramsList'><p>Plan Two</p></Link>
            <Link className='p-Three' to='/ProgramsList'><p>Plan Three</p></Link>


            <button className='more' onClick={()=> navigate('/ProgramsList')}>Know more</button>
            
        </div>
        
        </>
    );
}
export default OurPrograms;