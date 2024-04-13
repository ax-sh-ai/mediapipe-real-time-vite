import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from './App';

// @ts-ignore
global.URL.createObjectURL = vi.fn().mockImplementation(() => 'mocked-object-url');

afterEach(cleanup);

describe('Renders main page correctly', async () => {
  it.todo('Should render the page correctly', async () => {
    // Setup
    render(<App />);
    const h1 = screen.queryByText('Vite + React');

    // Expectations
    expect(h1).not.toBeNull();
  });
  it('upload test files', async () => {
    // const files = [
    //   new File(['hello'], 'hello.geojson', { type: 'application/json' }),
    //   new File(['there'], 'hello2.geojson', { type: 'application/json' })
    // ];
    const file = new File(['hello'], 'hello.geojson', {
      type: 'application/json'
    });
    render(<App />);
    const input = screen.getByTestId<HTMLInputElement>('dropzone');

    await userEvent.upload(input, file);
    // await userEvent.upload(input, files);

    console.log(input.files);
    // console.log(input);
    // expect(input.files).toHaveLength(2);
    // expect(input.files[0]).toStrictEqual(files[0]);
    // expect(input.files[1]).toStrictEqual(files[1]);
  });
});
