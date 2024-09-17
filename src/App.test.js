// App.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom';

test('renders the App component', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );

  // Using the exact text to avoid multiple matches
  expect(screen.getByText('Welcome to UNIEATS')).toBeInTheDocument();
});
