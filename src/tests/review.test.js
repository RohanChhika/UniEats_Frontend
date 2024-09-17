import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReviewForm from '../components/Pages/review'; // Adjust the import path as necessary
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

// Mocking `useParams` to simulate retrieving parameters from the URL (e.g., restaurant name)
jest.mock('react-router-dom', () => ({
  useParams: jest.fn()
}));

// Mocking Auth0 hooks (e.g., for getting tokens)
jest.mock('@auth0/auth0-react', () => ({
  useAuth0: jest.fn()
}));

// Mocking the global `fetch` function to simulate API calls
global.fetch = jest.fn();
// Mocking global `alert` to check if alert messages are triggered
global.alert = jest.fn();

// Helper function to set up the test environment with mocked URL params and Auth0 tokens
const setup = (params = { name: encodeURIComponent('LovelyEats') }) => {
  // Mock `useParams` to return a restaurant name from the URL
  useParams.mockReturnValue(params);

  // Mock `useAuth0` to return a fake token when requested
  useAuth0.mockReturnValue({
    getAccessTokenSilently: jest.fn().mockResolvedValue('fake_token')
  });

  // Render the `ReviewForm` component
  render(<ReviewForm />);
};

// Test suite for the `ReviewForm` component
describe('ReviewForm Component', () => {
  // Clear fetch and alert mocks before each test to avoid interference
  beforeEach(() => {
    fetch.mockClear();
    alert.mockClear();
  });

  // Test case: Ensure the form is rendered with initial empty values for rating and comment fields
  test('initial form render', () => {
    setup();
    expect(screen.getByLabelText(/Rating:/i)).toHaveValue('0'); // Rating field should start with '0'
    expect(screen.getByLabelText(/Comment:/i)).toHaveValue(''); // Comment field should be empty initially
  });

  // Test case: Ensure form fields (rating and comment) can be updated by the user
  test('allows input and selection changes', () => {
    setup();
    const ratingSelect = screen.getByLabelText(/Rating:/i); // Get the rating dropdown
    const commentTextarea = screen.getByLabelText(/Comment:/i); // Get the comment textarea

    // Simulate user selecting a rating of '5'
    fireEvent.change(ratingSelect, { target: { value: '5' } });
    expect(ratingSelect).toHaveValue('5'); // Ensure the rating is updated

    // Simulate user entering a comment
    fireEvent.change(commentTextarea, { target: { value: 'Great food and service!' } });
    expect(commentTextarea).toHaveValue('Great food and service!'); // Ensure the comment is updated
  });

  // Test case: Ensure the form submits data successfully when filled out correctly
  test('submits form data successfully', async () => {
    setup();
    // Mock successful API response for the form submission
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Review submitted successfully!' })
    });

    // Simulate filling out the form
    fireEvent.change(screen.getByLabelText(/Rating:/i), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText(/Comment:/i), { target: { value: 'Great food and service!' } });
    fireEvent.submit(screen.getByRole('button', { name: /Submit Review/i })); // Submit the form

    // Wait for the form submission to complete and verify the expected behavior
    await waitFor(() => {
      // Ensure fetch was called with the correct URL, headers, and body
      expect(fetch).toHaveBeenCalledWith(
        'https://sdpbackend-c3akgye9ceauethh.southafricanorth-01.azurewebsites.net/addReview',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer fake_token' // Auth token used in the request
          },
          body: JSON.stringify({
            restaurant: 'LovelyEats',
            rating: 5,
            comment: 'Great food and service!' // Submitted comment
          })
        })
      );
      // Ensure the alert shows the success message
      expect(global.alert).toHaveBeenCalledWith('Review submitted successfully!');
    });
  });

  // Test case: Ensure the form handles submission errors properly
  test('handles form submission errors', async () => {
    setup();
    // Mock an error response for the form submission
    fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: 'Failed to submit review' })
    });

    // Simulate form submission
    fireEvent.submit(screen.getByRole('button', { name: /Submit Review/i }));

    // Wait for the submission to complete and verify the expected behavior
    await waitFor(() => {
      // Ensure the alert shows an error message
      expect(global.alert).toHaveBeenCalledWith('Failed to submit review. Please try again.');
    });
  });

  // Test case: Ensure network errors are caught and handled gracefully
  test('catches exceptions thrown during network request', async () => {
    setup();
    // Mock a network error during the form submission
    fetch.mockRejectedValueOnce(new Error('Network Error'));

    // Simulate form submission
    fireEvent.submit(screen.getByRole('button', { name: /Submit Review/i }));

    // Wait for the error handling to complete
    await waitFor(() => {
      // Ensure the alert shows a network error message
      expect(global.alert).toHaveBeenCalledWith('Failed to submit review. Please try again.');
    });
  });
});
