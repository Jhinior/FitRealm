import { useEffect, useState } from 'react';
import axiosInstance from '../axios';

function ContactUs(){
    const [info, setinfo] = useState(null); 
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchContacts = async () => {
          try {
            const response = await axiosInstance.get(`contactus/contacts`);
            console.log(response.data); 
            setinfo(response.data); 
          } catch (error) {
            console.error('Error fetching contacts details:', error);
            setError('Failed to load our contact details.');
    
          }
        };
      
        fetchContacts();
      }, []);
      if (error) {
        return <p>{error}</p>;
    }
    
    if (!info) {
        return <p>Loading...</p>;
    }

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
                      We are always on the lookout to work with new clients. If
                      youare interested in working with us, please get in touch
                      in one of the following ways.
                    </p>
                    <div className="d-flex mb-5">
                      <div>
                        <h4 className="mb-3">Address</h4>
                        <address className="mb-0 text-secondary">
                          {info[0].address}
                        </address>
                      </div>
                    </div>
                    <div className="row mb-5">
                      <div className="col-12 col-sm-6">
                        <div className="d-flex mb-5 mb-sm-0">
                          <div>
                            <h4 className="mb-3">Phone</h4>
                            <p className="mb-0">
                              <a
                                className="link-secondary text-decoration-none"
                                href="tel:+15057922430"
                              >
                                {info[0].phone}
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
                              <a
                                className="link-secondary text-decoration-none"
                                href="mailto:demo@yourdomain.com"
                              >
                                {info[0].email}
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
                  <form method="post">
                    <div className="row gy-4 gy-xl-5 p-4 p-xl-5">
                      <div className="col-12">
                        <label htmlFor="name" className="form-label">
                          Subject
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter the subject"
                          name='  '
                        />
                      </div>
                      <div className="col-12">
                        <label htmlFor="email" className="form-label">
                          Email
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Enter your email"
                          name='email'
                        />
                      </div>
                      <div className="col-12">
                        <label htmlFor="textarea" className="form-label">
                          Your valuable thoughts
                        </label>
                        <textarea
                          className="form-control"
                          rows="4"
                          placeholder="Enter your message"
                          name='textarea'
                        ></textarea>
                      </div>

                      <div className="col-12">
                        <button type="submit" className="btn btn-primary">
                          Submit
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
}
export default ContactUs