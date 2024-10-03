// import { useEffect, useState } from 'react';
// import axiosInstance from '../axios';

// function ContactUs() {
//     const [info, setInfo] = useState({ address: '', phone: '', email: '' });
//     const [formData, setFormData] = useState({
//         subject: '',
//         email: '',
//         message: '',
//     });
//     const [feedbackSent, setFeedbackSent] = useState(false);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         axiosInstance.get('/contactus/contactinfo/') 
//             .then((response) => {
//                 setInfo(response.data);
//             })
//             .catch((error) => {
//                 console.error('Error fetching contact info:', error);
//             });
//     }, []);

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         setFeedbackSent(true);
//         setError('');

//         console.log('Form Data Submitted:', formData); 

//         axiosInstance.post('/contactus/contactus/', formData) 
//             .then((response) => {
//                 console.log('Response from server:', response); 
                
//                 setFormData({ subject: '', email: '', message: '' }); 
//                 setFeedbackSent(false); 
//             })
            
//             .catch((error) => {
//                 console.error('Error sending feedback:', error);
//                 setError('Failed to send feedback. Please try again.');
//             });
//     };

//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value,
//         });
//     };

//     return (
//         <>
//             <section className="bg-light py-3 py-md-5">
//                 <div className="container">
//                     <div className="row gy-3 gy-md-4 gy-lg-0 align-items-md-center">
//                         <div className="col-12 col-lg-6">
//                             <div className="row justify-content-xl-center">
//                                 <div className="col-12 col-xl-11">
//                                     <h2 className="h1 mb-3">Get in touch</h2>
//                                     <p className="lead fs-4 text-secondary mb-5">
//                                         We are always on the lookout to work with new clients. If you are interested in working with us, please get in touch in one of the following ways.
//                                     </p>
//                                     <div className="d-flex mb-5">
//                                         <div>
//                                             <h4 className="mb-3">Address</h4>
//                                             <address className="mb-0 text-secondary">
//                                                 {info.address}
//                                             </address>
//                                         </div>
//                                     </div>
//                                     <div className="row mb-5">
//                                         <div className="col-12 col-sm-6">
//                                             <div className="d-flex mb-5 mb-sm-0">
//                                                 <div>
//                                                     <h4 className="mb-3">Phone</h4>
//                                                     <p className="mb-0">
//                                                         <a className="link-secondary text-decoration-none" href={`tel:${info.phone}`}>
//                                                             {info.phone}
//                                                         </a>
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div className="col-12 col-sm-6">
//                                             <div className="d-flex mb-0">
//                                                 <div>
//                                                     <h4 className="mb-3">E-Mail</h4>
//                                                     <p className="mb-0">
//                                                         <a className="link-secondary text-decoration-none" href={`mailto:${info.email}`}>
//                                                             {info.email}
//                                                         </a>
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="col-12 col-lg-6">
                            
//                             <div className="bg-white border rounded shadow-sm overflow-hidden">
//                                 <form onSubmit={handleSubmit}>
//                                     <div className="row gy-4 gy-xl-5 p-4 p-xl-5">
//                                         <div className="col-12">
//                                             <label htmlFor="subject" className="form-label">Subject</label>
//                                             <input 
//                                                 type="text" 
//                                                 className="form-control form-control-contactus bg-white text-dark border-2 shadow-sm p-3"
//                                                 placeholder="Enter the subject" 
//                                                 name="subject" 
//                                                 value={formData.subject}
//                                                 onChange={handleChange} 
//                                                 required 
//                                             />
//                                         </div>
//                                         <div className="col-12">
//                                             <label htmlFor="email" className="form-label">Email</label>
//                                             <input 
//                                                 type="email" 
//                                                 className="form-control form-control-contactus bg-white text-dark border-2 shadow-sm p-3"

//                                                 placeholder="Enter your email" 
//                                                 name="email" 
//                                                 value={formData.email}
//                                                 onChange={handleChange} 
//                                                 required 
//                                             />
//                                         </div>
//                                         <div className="col-12">
//                                             <label htmlFor="message" className="form-label">Your valuable thoughts</label>
//                                             <textarea 
//                                                 className="form-control form-control-contactus bg-white text-dark border-2 shadow-sm p-3"
//                                                 rows="4" 
//                                                 placeholder="Enter your message" 
//                                                 name="message" 
//                                                 value={formData.message}
//                                                 onChange={handleChange} 
//                                                 required
//                                             ></textarea>
//                                         </div>
//                                         <div className="col-12">
//                                             <button type="submit" className="btn btn-primary">Submit</button>
//                                         </div>
//                                     </div>
//                                     {feedbackSent && <p className="text-success mt-3">Feedback sent successfully!</p>}
//                                     {error && <p className="text-danger mt-3">{error}</p>}
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//         </>
//     );
// }

// export default ContactUs;
import { useEffect, useState } from 'react';
import axiosInstance from '../axios';

function ContactUs() {
    const [info, setInfo] = useState({ address: '', phone: '', email: '' });
    const [formData, setFormData] = useState({
        subject: '',
        email: '',
        message: '',
    });
    const [feedbackSent, setFeedbackSent] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchContactInfo = async () => {
            try {
                const response = await axiosInstance.get('/contactus/contactinfo/');
                setInfo(response.data);
            } catch (error) {
                console.error('Error fetching contact info:', error);
            }
        };
        fetchContactInfo();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true); 

        try {
            const response = await axiosInstance.post('/contactus/contactus/', formData);
            console.log('Response from server:', response); 

            setFormData({ subject: '', email: '', message: '' }); 
            setFeedbackSent(true); 
        } catch (error) {
            console.error('Error sending feedback:', error);
            setError('Failed to send feedback. Please try again.');
        } finally {
            setLoading(false); 
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <>
            <section className="bg-light py-3 py-md-5">
                <div className="container">
                    <div className="row gy-3 gy-md-4 gy-lg-0 align-items-md-center">
                        <div className="col-12 col-lg-6">
                            <div className="row justify-content-xl-center">
                                <div className="col-12 col-xl-11">
                                    <h2 className="h1 mb-3">Get in touch</h2>
                                    <p className="lead fs-4 text-secondary mb-5">
                                        We are always on the lookout to work with new clients. If you are interested in working with us, please get in touch in one of the following ways.
                                    </p>
                                    <div className="d-flex mb-5">
                                        <div>
                                            <h4 className="mb-3">Address</h4>
                                            <address className="mb-0 text-secondary">
                                                {info.address}
                                            </address>
                                        </div>
                                    </div>
                                    <div className="row mb-5">
                                        <div className="col-12 col-sm-6">
                                            <div className="d-flex mb-5 mb-sm-0">
                                                <div>
                                                    <h4 className="mb-3">Phone</h4>
                                                    <p className="mb-0">
                                                        <a className="link-secondary text-decoration-none" href={`tel:${info.phone}`}>
                                                            {info.phone}
                                                        </a>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-6">
                                            <div className="d-flex mb-0">
                                                <div>
                                                    <h4 className="mb-3">E-Mail</h4>
                                                    <p className="mb-0">
                                                        <a className="link-secondary text-decoration-none" href={`mailto:${info.email}`}>
                                                            {info.email}
                                                        </a>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-lg-6">
                            <div className="bg-white border rounded shadow-sm overflow-hidden">
                                <form onSubmit={handleSubmit}>
                                    <div className="row gy-4 gy-xl-5 p-4 p-xl-5">
                                        <div className="col-12">
                                            <label htmlFor="subject" className="form-label">Subject</label>
                                            <input 
                                                type="text" 
                                                className="form-control form-control-contactus bg-white text-dark border-2 shadow-sm p-3"
                                                placeholder="Enter the subject" 
                                                name="subject" 
                                                value={formData.subject}
                                                onChange={handleChange} 
                                                required 
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="email" className="form-label">Email</label>
                                            <input 
                                                type="email" 
                                                className="form-control form-control-contactus bg-white text-dark border-2 shadow-sm p-3"
                                                placeholder="Enter your email" 
                                                name="email" 
                                                value={formData.email}
                                                onChange={handleChange} 
                                                required 
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="message" className="form-label">Your valuable thoughts</label>
                                            <textarea 
                                                className="form-control form-control-contactus bg-white text-dark border-2 shadow-sm p-3"
                                                rows="4" 
                                                placeholder="Enter your message" 
                                                name="message" 
                                                value={formData.message}
                                                onChange={handleChange} 
                                                required
                                            ></textarea>
                                        </div>
                                        <div className="col-12">
                                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                                {loading ? 'Sending...' : 'Submit'}
                                            </button>
                                        </div>
                                    </div>
                                    {feedbackSent && <p className="text-success mt-3">Feedback sent successfully!</p>}
                                    {error && <p className="text-danger mt-3">{error}</p>}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default ContactUs;
