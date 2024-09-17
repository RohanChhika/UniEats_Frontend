import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import ReservationPage from '../components/Pages/Reservation';

// Mock `useParams` to simulate retrieving parameters from the URL (in this case, the restaurant name)
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

// Mock `useAuth0` to simulate Auth0 hooks (e.g., user authentication and token retrieval)
jest.mock('@auth0/auth0-react');

// Before each test, reset the mocks and set up the required behavior for Auth0 and URL params
beforeEach(() => {
    // Clear any previous mock data to avoid test interference
    jest.clearAllMocks();
  
    // Set up mock for `useAuth0` to return a user and a token retrieval function
    useAuth0.mockReturnValue({
      user: { sub: 'auth0|123456' }, // Mocked user ID
      getAccessTokenSilently: jest.fn().mockResolvedValue('mocked_access_token'), // Mocked token retrieval
    });
  
    // Mock `useParams` to simulate a URL param for the restaurant name
    useParams.mockReturnValue({ name: encodeURIComponent('Testaurant') });
  
    // Mock `window.alert` to test alert behavior
    window.alert = jest.fn(); // Ensure `window.alert` is mocked as a jest spy
});

// Test suite for the `ReservationPage` component
describe('ReservationPage', () => {
  // Before each test, ensure Auth0 and URL params are mocked correctly
  beforeEach(() => {
    // Setup mock for `useAuth0` hook
    useAuth0.mockReturnValue({
      user: { sub: 'auth0|123456' }, // Mocked user
      getAccessTokenSilently: jest.fn().mockResolvedValue('mocked_access_token'), // Mocked token
    });

    // Mock `useParams` to return the restaurant name from the URL
    useParams.mockReturnValue({ name: encodeURIComponent('Testaurant') });
  });

  // Test case: Ensure the form is rendered with initial empty/default values
  it('renders correctly with initial form state', () => {
    const { getByLabelText } = render(
      <BrowserRouter>
        <ReservationPage />
      </BrowserRouter>
    );

    // Check that form fields are empty or set to default values
    expect(getByLabelText('Date:').value).toBe(''); // Date field should be empty initially
    expect(getByLabelText('Time:').value).toBe(''); // Time field should be empty initially
    expect(getByLabelText('Number of Guests:').value).toBe('1'); // Guests field should have a default value of 1
    expect(getByLabelText('Special Requests:').value).toBe(''); // Special requests field should be empty
  });

  // Test case: Ensure form fields can be updated by the user
  it('allows form field updates', () => {
    const { getByLabelText } = render(
      <BrowserRouter>
        <ReservationPage />
      </BrowserRouter>
    );

    // Simulate user entering a date
    fireEvent.change(getByLabelText('Date:'), { target: { value: '2024-09-21' } });
    expect(getByLabelText('Date:').value).toBe('2024-09-21'); // Ensure date field is updated

    // Simulate user entering a time
    fireEvent.change(getByLabelText('Time:'), { target: { value: '18:00' } });
    expect(getByLabelText('Time:').value).toBe('18:00'); // Ensure time field is updated

    // Simulate user updating the number of guests
    fireEvent.change(getByLabelText('Number of Guests:'), { target: { value: '4' } });
    expect(getByLabelText('Number of Guests:').value).toBe('4'); // Ensure number of guests field is updated

    // Simulate user entering special requests
    fireEvent.change(getByLabelText('Special Requests:'), { target: { value: 'Window seat' } });
    expect(getByLabelText('Special Requests:').value).toBe('Window seat'); // Ensure special requests field is updated
  });

  // Test case: Ensure the form submission is successful when the data is valid
  it('submits the form successfully', async () => {
    // Mock the `fetch` API to simulate a successful form submission
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Reservation submitted!' }) // Mocked success response
    });

    const { getByText, getByLabelText } = render(
      <BrowserRouter>
        <ReservationPage />
      </BrowserRouter>
    );

    // Simulate filling out the form
    fireEvent.change(getByLabelText('Date:'), { target: { value: '2024-09-21' } });
    fireEvent.change(getByLabelText('Time:'), { target: { value: '18:00' } });

    // Simulate form submission
    fireEvent.submit(getByText('Submit Reservation'));

    // Wait for the fetch call and ensure it was triggered
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled(); // Ensure the form submission fetch was triggered
    });
  });

  // Test case: Ensure form submission handles errors gracefully
  it('handles errors during form submission', async () => {
    // Mock the `fetch` API to simulate an error during form submission
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: 'Failed to submit reservation.' }) // Mocked error response
    });

    const { getByText, getByLabelText } = render(
      <BrowserRouter>
        <ReservationPage />
      </BrowserRouter>
    );

    // Simulate filling out the form
    fireEvent.change(getByLabelText('Date:'), { target: { value: '2024-09-21' } });
    fireEvent.change(getByLabelText('Time:'), { target: { value: '18:00' } });

    // Simulate form submission
    fireEvent.submit(getByText('Submit Reservation'));

    // Wait for the fetch call and ensure the error alert is shown
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled(); // Ensure the form submission fetch was triggered
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Failed to submit reservation')); // Ensure alert is shown with the correct message
    });
  });
});
