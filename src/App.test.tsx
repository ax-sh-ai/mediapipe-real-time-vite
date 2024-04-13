import { render, screen } from '@testing-library/react';

import App from './App';

// Tests
describe.todo('Renders main page correctly', async () => {
  it('Should render the page correctly', async () => {
    // Setup
    render(<App />);
    const h1 = screen.queryByText('Vite + React');

    // Expectations
    expect(h1).not.toBeNull();
  });
});
