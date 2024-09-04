import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

function ReviewForm() {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const { name } = useParams();
    const decodedName = decodeURIComponent(name);

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Construct the review data
        const reviewData = {
            restaurant: decodedName,
            rating: parseInt(rating, 10), // Convert rating to number
            comment
        };

        try {
            // Make the fetch request to your backend
            const response = await fetch('http://localhost:3001/addReview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reviewData)
            });
            if (response.ok) {
                const result = await response.json();
                console.log(result.message); // or handle the response as needed
                alert('Review submitted successfully!');
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
                alert('Failed to submit review. Please try again.');
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('Failed to submit review. Please try again.');
        }

        // Reset form fields
        setRating(0);
        setComment('');
    };

    return (
        <div>
            <h2>Leave a Review for {decodedName}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Rating:
                        <select value={rating} onChange={e => setRating(e.target.value)}>
                            <option value="0">Select a rating</option>
                            <option value="1">1 Star</option>
                            <option value="2">2 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="5">5 Stars</option>
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        Comment:
                        <textarea
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            placeholder="Type your comment here..."
                        />
                    </label>
                </div>
                <button type="submit">Submit Review</button>
            </form>
        </div>
    );
}

export default ReviewForm;
