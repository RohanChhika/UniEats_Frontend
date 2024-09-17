import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import LandingPage from '../components/Pages/LandingPage';

jest.mock('@auth0/auth0-react'); // Mock the Auth0 hook to simulate authentication during tests

// Mock restaurant data to simulate API responses
const mockRestaurants = [
  {
    name: "Testaurant",
    image: "testaurant.jpg",
    description: "A place to test foods",
    rating: 4
  },
  {
    name: "Second Testaurant",
    image: "secondtest.jpg",
    description: "Another test eating place",
    rating: 3
  }
];

// Helper to wrap components with react-router's BrowserRouter
// This ensures that the components being tested have access to routing context
const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route); // Simulates navigation to a particular route
  return render(ui, { wrapper: BrowserRouter }); // Wrap the rendered component with BrowserRouter
};

describe('LandingPage', () => {
  // Mock the return value of the useAuth0 hook to simulate an authenticated user
  beforeEach(() => {
    useAuth0.mockReturnValue({
      user: { sub: 'auth0|testuser' }, // Simulated user object
      isAuthenticated: true, // Simulated authentication status
      getAccessTokenSilently: jest.fn().mockResolvedValue('mock_token') // Simulate fetching an access token
    });
  });

  // Test case: Verifies that restaurants are fetched and displayed successfully
  it('fetches and displays restaurants successfully', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true, // Simulate a successful fetch response
      json: jest.fn().mockResolvedValue(mockRestaurants) // Return the mock restaurant data
    });

    renderWithRouter(<LandingPage />); // Render the LandingPage component
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled(); // Ensure that fetch was called
      expect(screen.getByText("Testaurant")).toBeInTheDocument(); // Verify that the restaurant name appears in the document
      expect(screen.getByText("Another test eating place")).toBeInTheDocument(); // Verify the description appears
    });
  });

  // Test case: Verifies that the search filter works correctly
  it('filters restaurants based on search term', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true, // Simulate a successful fetch response
      json: jest.fn().mockResolvedValue(mockRestaurants) // Return the mock restaurant data
    });

    renderWithRouter(<LandingPage />); // Render the LandingPage component
    await waitFor(() => {
      // Simulate entering a search term in the search input field
      fireEvent.change(screen.getByPlaceholderText('Search for a restaurant'), { target: { value: 'second' } });
      expect(screen.getByText("Second Testaurant")).toBeInTheDocument(); // Verify the filtered restaurant is displayed
      expect(screen.queryByText("Testaurant")).not.toBeInTheDocument(); // Ensure the unfiltered restaurant is not displayed
    });
  });

  // Test case: Verifies the application handles fetch errors gracefully
  it('handles fetch errors gracefully', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false, // Simulate a failed fetch response
      json: jest.fn().mockResolvedValue({ message: 'Failed to fetch data' }) // Error message from the API
    });

    console.error = jest.fn(); // Mock console.error to verify it was called when an error occurs
    renderWithRouter(<LandingPage />); // Render the LandingPage component
    await waitFor(() => {
      // Ensure console.error is called with the expected error message
      expect(console.error).toHaveBeenCalledWith('Error fetching restaurant data:', new Error('Failed to fetch data'));
    });
  });

  // Test case: Verifies the user is signed up if not already registered
  it('signs up user if not already registered', async () => {
    // Mock two fetch calls: one for fetching restaurants and another for signing up the user
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockRestaurants) // Return restaurant data
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ message: 'User signed up successfully' }) // Return user sign-up confirmation
      });

    renderWithRouter(<LandingPage />); // Render the LandingPage component
    await waitFor(() => {
      // Ensure fetch is called twice: once for fetching restaurants and once for signing up the user
      expect(fetch).toHaveBeenCalledTimes(2); 
      // Verify that the sign-up request contains the correct method and user data in the request body
      expect(fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ userID: 'auth0|testuser' })
      }));
    });
  });
});
