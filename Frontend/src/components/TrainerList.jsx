import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TrainerList = () => {
  const [trainers, setTrainers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newRatings, setNewRatings] = useState({});

  useEffect(() => {
    // Fetch trainer data from the API
    axios.get("http://127.0.0.1:8000/main/trainers/")
      .then(response => {
        setTrainers(response.data);
      })
      .catch(error => {
        console.error("Error fetching trainers:", error);
      });
  }, []);

  // Filter trainers based on search term
  const filteredTrainers = trainers.filter(trainer => {
    const fullName = `${trainer.user.first_name} ${trainer.user.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const handleRatingChange = (trainerId, value) => {
    setNewRatings(prevRatings => ({
      ...prevRatings,
      [trainerId]: value
    }));
  };

  const submitRating = (trainerId) => {
    const rating = parseFloat(newRatings[trainerId]);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      alert("Please enter a valid rating between 1 and 5.");
      return;
    }

    const payload = { rating };

    // Send rating to the API
    axios.put(`http://127.0.0.1:8000/main/trainer/${trainerId}/rate/`, payload)
      .then(response => {
        // Update state with the new average rating
        setTrainers(prevTrainers =>
          prevTrainers.map(t =>
            t.id === trainerId ? { ...t, avg_rating: response.data.avg_rating } : t
          )
        );
        setNewRatings(prevRatings => ({ ...prevRatings, [trainerId]: "" }));
      })
      .catch(error => {
        console.error("Error submitting rating:", error.response ? error.response.data : error.message);
        alert("Failed to submit rating. Please try again.");
      });
  };

  return (
    <div>
      <h2>Trainer List</h2>
      
      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ marginBottom: '20px', padding: '10px', width: '100%' }}
      />

      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', textAlign: 'left' }}>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Years of Experience</th>
            <th>Average Rating</th>
            <th>Salary</th>
            <th>Active Users</th>
            <th>New Rating</th>
          </tr>
        </thead>
        <tbody>
          {filteredTrainers.length > 0 ? (
            filteredTrainers.map(trainer => (
              <tr key={trainer.id}>
                <td>{trainer.user.first_name}</td>
                <td>{trainer.user.last_name}</td>
                <td>{trainer.user.email}</td>
                <td>{trainer.user.phone || 'N/A'}</td>
                <td>{trainer.years_of_experience}</td>
                <td>{trainer.avg_rating}</td>
                <td>{trainer.salary}</td>
                <td>{trainer.active_users}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    placeholder="Rate 1-5"
                    value={newRatings[trainer.id] || ""}
                    onChange={(e) => handleRatingChange(trainer.id, e.target.value)}
                  />
                  <button onClick={() => submitRating(trainer.id)}>Submit</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">No trainers found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TrainerList;
