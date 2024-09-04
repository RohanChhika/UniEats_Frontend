import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

function ReviewForm() {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const { name } = useParams();
    const decodedName = decodeURIComponent(name);

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(`Rating: ${rating}, Comment: '${comment}'`);
        // Add API call to submit the review here
        alert('Review submitted!');
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
