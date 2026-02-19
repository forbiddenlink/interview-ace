import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../card';

describe('Card', () => {
  describe('Card component', () => {
    it('renders children correctly', () => {
      render(<Card>Card content</Card>);
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<Card className="custom-card">Content</Card>);
      const card = screen.getByText('Content').closest('div');
      expect(card).toHaveClass('custom-card');
    });

    it('applies default styling', () => {
      render(<Card data-testid="card">Content</Card>);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('rounded-xl', 'border', 'shadow-sm');
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Card ref={ref}>Content</Card>);
      expect(ref).toHaveBeenCalled();
    });

    it('passes through additional props', () => {
      render(
        <Card data-testid="test-card" aria-label="Test card">
          Content
        </Card>
      );
      const card = screen.getByTestId('test-card');
      expect(card).toHaveAttribute('aria-label', 'Test card');
    });
  });

  describe('CardHeader component', () => {
    it('renders children correctly', () => {
      render(<CardHeader>Header content</CardHeader>);
      expect(screen.getByText('Header content')).toBeInTheDocument();
    });

    it('applies default spacing', () => {
      render(<CardHeader data-testid="header">Header</CardHeader>);
      const header = screen.getByTestId('header');
      expect(header).toHaveClass('p-6', 'flex', 'flex-col');
    });

    it('applies custom className', () => {
      render(<CardHeader className="custom-header">Header</CardHeader>);
      const header = screen.getByText('Header').closest('div');
      expect(header).toHaveClass('custom-header');
    });
  });

  describe('CardTitle component', () => {
    it('renders as h3 element', () => {
      render(<CardTitle>Title</CardTitle>);
      const title = screen.getByRole('heading', { level: 3 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Title');
    });

    it('applies default styling', () => {
      render(<CardTitle data-testid="title">Title</CardTitle>);
      const title = screen.getByTestId('title');
      expect(title).toHaveClass('text-xl', 'font-semibold');
    });

    it('applies custom className', () => {
      render(<CardTitle className="custom-title">Title</CardTitle>);
      const title = screen.getByRole('heading');
      expect(title).toHaveClass('custom-title');
    });
  });

  describe('CardDescription component', () => {
    it('renders as p element', () => {
      render(<CardDescription>Description</CardDescription>);
      const description = screen.getByText('Description');
      expect(description.tagName).toBe('P');
    });

    it('applies default styling', () => {
      render(
        <CardDescription data-testid="desc">Description</CardDescription>
      );
      const description = screen.getByTestId('desc');
      expect(description).toHaveClass('text-sm', 'text-zinc-500');
    });

    it('applies custom className', () => {
      render(<CardDescription className="custom-desc">Desc</CardDescription>);
      const description = screen.getByText('Desc');
      expect(description).toHaveClass('custom-desc');
    });
  });

  describe('CardContent component', () => {
    it('renders children correctly', () => {
      render(<CardContent>Content here</CardContent>);
      expect(screen.getByText('Content here')).toBeInTheDocument();
    });

    it('applies default padding without top', () => {
      render(<CardContent data-testid="content">Content</CardContent>);
      const content = screen.getByTestId('content');
      expect(content).toHaveClass('p-6', 'pt-0');
    });

    it('applies custom className', () => {
      render(<CardContent className="custom-content">Content</CardContent>);
      const content = screen.getByText('Content').closest('div');
      expect(content).toHaveClass('custom-content');
    });
  });

  describe('CardFooter component', () => {
    it('renders children correctly', () => {
      render(<CardFooter>Footer content</CardFooter>);
      expect(screen.getByText('Footer content')).toBeInTheDocument();
    });

    it('applies flex layout', () => {
      render(<CardFooter data-testid="footer">Footer</CardFooter>);
      const footer = screen.getByTestId('footer');
      expect(footer).toHaveClass('flex', 'items-center');
    });

    it('applies padding without top', () => {
      render(<CardFooter data-testid="footer">Footer</CardFooter>);
      const footer = screen.getByTestId('footer');
      expect(footer).toHaveClass('p-6', 'pt-0');
    });

    it('applies custom className', () => {
      render(<CardFooter className="custom-footer">Footer</CardFooter>);
      const footer = screen.getByText('Footer').closest('div');
      expect(footer).toHaveClass('custom-footer');
    });
  });

  describe('Card composition', () => {
    it('renders full card composition correctly', () => {
      render(
        <Card data-testid="full-card">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card description text</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Main content goes here</p>
          </CardContent>
          <CardFooter>
            <button>Action</button>
          </CardFooter>
        </Card>
      );

      expect(screen.getByRole('heading', { name: /card title/i })).toBeInTheDocument();
      expect(screen.getByText('Card description text')).toBeInTheDocument();
      expect(screen.getByText('Main content goes here')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /action/i })).toBeInTheDocument();
    });
  });
});
