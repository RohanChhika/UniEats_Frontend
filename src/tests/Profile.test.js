import React from 'react';
import { render, waitFor, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Profile from '../components/Pages/Profile';
import { useAuth0 } from '@auth0/auth0-react';
import { MemoryRouter } from 'react-router-dom';

// Mock the Auth0 hook to simulate authentication behavior in tests
jest.mock('@auth0/auth0-react');

// Mocking the global fetch function to return predefined data for different URLs
beforeEach(() => {
    global.fetch = jest.fn((url) => {
        if (url.includes('viewUser')) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ credits: 120 }) // Assuming the endpoint returns an object with credits
            });
        } else if (url.includes('viewOrders')) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve([]) // Assuming this endpoint returns an array of orders
            });
        } else if (url.includes('deleteReservation')) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({}) // Simple OK response for reservation deletion
            });
        }
        return Promise.reject(new Error('Endpoint not mocked'));
    });
});

// Mock window.alert to test alert functionality
beforeEach(() => {
    window.alert = jest.fn();
});

// Restore mocks after each test to avoid test interference
afterEach(() => {
    jest.restoreAllMocks();
});

// Helper function to render the Profile component with the necessary setup for Auth0
const setup = (isAuthenticated = true) => {
  const user = {
    email: 'test@example.com',
    sub: 'auth0|123456',
    nickname: 'testuser'
  };

  // Mock the Auth0 hook to simulate authentication status and token retrieval
  useAuth0.mockReturnValue({
    isAuthenticated,
    user,
    getAccessTokenSilently: jest.fn().mockResolvedValue('fake-token'),
  });

  return render(
    <MemoryRouter>
      <Profile />
    </MemoryRouter>
  );
};

// Test suite for the Profile component
describe('Profile Component', () => {
  
  // Ensure that the global fetch function is mocked to return basic empty data before each test
  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve([]),
      ok: true
    }));
  });

  // Restore all mocks after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Test case: Ensure the loading state is displayed correctly when the user is not authenticated
  test('renders loading state correctly when not authenticated', async () => {
    setup(false);
    expect(screen.getByText('Loading...')).toBeInTheDocument(); // Ensure 'Loading...' is visible
  });

  // Test case: Display user information and fetch data correctly when authenticated
  test('displays user information and fetches data correctly when authenticated', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([{ _id: 1, date: new Date().toISOString(), restaurant: 'Testaurant', total: 50, status: 'ready for collection' }]), // Mock orders
    });
  
    setup(); // Call setup with authenticated user
  
    await waitFor(() => {
      // Ensure user details and data fetched from the API are displayed correctly
      expect(screen.getByText('testuser')).toBeInTheDocument(); // User's nickname
      expect(screen.getByText('R120.00')).toBeInTheDocument();  // User's credits
      expect(screen.getByText('Testaurant')).toBeInTheDocument();  // Restaurant from mock order
    });
  });
  
  // Test case: Handle reservation deletion correctly
  test('handles reservation deletion correctly', async () => {
    // Mock the fetch call for fetching reservations
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([{ _id: 2, date: new Date().toISOString(), restaurant: 'Cafe Test', numberOfGuests: 2, specialRequest: 'Window seat', time: '18:00' }]) // Mock reservation
      });
  
    setup(); // Call setup
  
    await waitFor(() => {
      // Ensure the reservation is displayed before deletion
      expect(screen.getByText('Cafe Test')).toBeInTheDocument();
    });
  
    // Mock user confirmation for deletion
    window.confirm = jest.fn().mockReturnValue(true);
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}) // Mock successful deletion
    });
  
    // Simulate clicking the "Delete Reservation" button
    const deleteButton = screen.getByText('Delete Reservation');
    fireEvent.click(deleteButton);
  
    await waitFor(() => {
      // Ensure the deletion request is sent and the reservation is no longer displayed
      expect(fetch).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ _id: 2 })
      }));
      expect(screen.queryByText('Cafe Test')).not.toBeInTheDocument(); // Reservation should be removed
    });
  });

  // Test case: Ensure an alert is shown for an invalid voucher code
  test('alerts user on invalid voucher code', async () => {
    const { getByText, getByPlaceholderText } = setup(); // Call setup
  
    // Simulate entering an invalid voucher code
    const voucherInput = getByPlaceholderText('Enter voucher code');
    fireEvent.change(voucherInput, { target: { value: 'InvalidCode' } });
    fireEvent.click(getByText('Apply Voucher')); // Click the "Apply Voucher" button
  
    // Ensure the alert is shown with the expected message
    await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith('Please enter a valid voucher code (OneHundred, TwoHundred, or Fifty).');
    });
  });
  
});
