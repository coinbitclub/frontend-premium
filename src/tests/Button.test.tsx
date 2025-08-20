import React from 'react';
import { render, screen } from '@testing-library/react'
import Button from '../components/Button'

test('renders button', () => {
  render(<Button>Click</Button>)
  expect(screen.getByText('Click')).toBeInTheDocument()
})


