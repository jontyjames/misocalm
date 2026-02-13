import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Input from '../Input';

describe('Input', () => {
  it('associates label with input via htmlFor', () => {
    render(<Input label="Email" value="" onChange={vi.fn()} />);
    const input = screen.getByLabelText('Email');
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe('INPUT');
  });

  it('shows error message with aria-invalid', () => {
    render(<Input label="Email" error="Required" value="" onChange={vi.fn()} />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('links error message via aria-describedby', () => {
    render(<Input label="Email" error="Required" value="" onChange={vi.fn()} />);
    const input = screen.getByLabelText('Email');
    const errorId = input.getAttribute('aria-describedby');
    expect(errorId).toBeTruthy();
    const errorEl = document.getElementById(errorId);
    expect(errorEl).toHaveTextContent('Required');
  });

  it('does not have aria-invalid when no error', () => {
    render(<Input label="Name" value="" onChange={vi.fn()} />);
    expect(screen.getByLabelText('Name')).not.toHaveAttribute('aria-invalid');
  });
});

describe('Input.Textarea', () => {
  it('associates label with textarea', () => {
    render(<Input.Textarea label="Notes" value="" onChange={vi.fn()} />);
    const textarea = screen.getByLabelText('Notes');
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('shows error with aria-invalid', () => {
    render(<Input.Textarea label="Notes" error="Too short" value="" onChange={vi.fn()} />);
    expect(screen.getByLabelText('Notes')).toHaveAttribute('aria-invalid', 'true');
  });
});

describe('Input.Select', () => {
  it('associates label with select', () => {
    render(
      <Input.Select
        label="Country"
        value=""
        onChange={vi.fn()}
        options={[{ value: 'us', label: 'US' }]}
      />
    );
    const select = screen.getByLabelText('Country');
    expect(select.tagName).toBe('SELECT');
  });
});
