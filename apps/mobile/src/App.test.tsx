import { expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import App from './App';

it('renders the hello-world screen', async () => {
  await render(<App />);

  expect(screen.getByText('KAVACH')).toBeTruthy();
  expect(screen.getByText('Hello from the mobile app.')).toBeTruthy();
});
