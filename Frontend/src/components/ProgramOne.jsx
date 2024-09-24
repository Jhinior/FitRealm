import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import { Button, Card, Col, Container, Row } from 'react-bootstrap';

const ProgramOne = () => {
  const { id } = useParams(); // Get the program ID from the URL
  const [programData, setProgramData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgramData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/main/plans/${id}/`);
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setProgramData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProgramData();
  }, [id]); // Added id as a dependency

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!programData) {
    return <p>No program data found.</p>;
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="mb-3">
            <Card.Header>
              <h5 className="card-title">{programData.plan_name || "Program Title"}</h5>
            </Card.Header>
            <Card.Body>
              <img src={programData.image} alt={programData.plan_name} className="img-fluid mb-2" />
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <h6 className="mb-0">Description</h6>
                  <p className="text-muted">{programData.description || "No details available."}</p>
                </li>
                <li className="list-group-item">
                  <h6 className="mb-0">Cost</h6>
                  <p className="text-muted">${programData.cost || "Price not specified."}</p>
                </li>
              </ul>
            </Card.Body>
            <Card.Footer>
              <Button variant="primary">Join</Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProgramOne;
