// import { Link, useNavigate } from 'react-router-dom';
import RopeJumping from '../assets/images/ropeJumping.mp4'
import people3 from '../assets/images/people-6.jpg';
import people4 from '../assets/images/people-4.jpg';
import people5 from '../assets/images/people-5.jpg';

import '../assets/styles/ProgramsList.css';

function ProgramsList(){
    return (
      <>
        <video
          autoPlay
          loop
          muted
          id="video"
          className="rope"
          src={RopeJumping}
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

          <div className="div-3">
            <div className="left">
              <img className='people' src={people3}alt="person" />
              <h5>Total work out challenge</h5>
              <p>30 Days</p>
              <p>$100.00</p>
              <button className='v-details'>View Details</button>
            </div>
            <div className="middle">
              <img className='people' src={people4} alt="person" />
              <h5>Push Up Challenge</h5>
              <p>30 Days</p>
              <p>$100.00</p>
              <button className='v-details'>View Details</button>
            </div>
            <div className="right">
              <img className='people' src={people5} alt="person" />
              <h5>Flat Abs Challenge</h5>
              <p>14 Days</p>
              <p>$60.00</p>
              <button className='v-details'>View Details</button>
            </div>
          </div>
        </div>
      </>
    );
}
export default ProgramsList;