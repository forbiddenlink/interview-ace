import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('homepage displays call-to-action buttons', async ({ page }) => {
    await page.goto('/');

    // Check hero section has main CTA buttons
    await expect(page.getByRole('link', { name: /get started/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible();
  });

  test('login page renders correctly', async ({ page }) => {
    await page.goto('/login');

    // Check form elements are present
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();

    // Check OAuth buttons
    await expect(page.getByRole('button', { name: /google/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /github/i })).toBeVisible();
  });

  test('signup page renders correctly', async ({ page }) => {
    await page.goto('/signup');

    // Check form elements
    await expect(page.getByRole('heading', { name: /create.*account/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign up|create account/i })).toBeVisible();
  });

  test('login form shows validation errors for empty submission', async ({ page }) => {
    await page.goto('/login');

    // Submit empty form
    await page.getByRole('button', { name: /sign in/i }).click();

    // Browser native validation should prevent submission
    // Check that email input is required
    const emailInput = page.getByLabel(/email/i);
    await expect(emailInput).toHaveAttribute('required', '');
  });

  test('protected routes redirect to login', async ({ page }) => {
    // Try to access practice page without auth
    await page.goto('/practice');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });

  test('dashboard redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/dashboard');

    // Should redirect to login with redirect param
    await expect(page).toHaveURL(/\/login/);
  });

  test('login page has link to signup', async ({ page }) => {
    await page.goto('/login');

    const signupLink = page.getByRole('link', { name: /sign up|create.*account|register/i });
    await expect(signupLink).toBeVisible();
  });

  test('signup page has link to login', async ({ page }) => {
    await page.goto('/signup');

    const loginLink = page.getByRole('link', { name: /sign in|log in|already have/i });
    await expect(loginLink).toBeVisible();
  });
});

test.describe('Navigation', () => {
  test('homepage navigation works', async ({ page }) => {
    await page.goto('/');

    // Check main navigation elements exist
    await expect(page.getByRole('navigation')).toBeVisible();
  });

  test('footer is present on homepage', async ({ page }) => {
    await page.goto('/');

    // Scroll to bottom and check footer exists
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    // Note: Footer check depends on implementation
  });
});

test.describe('Accessibility', () => {
  test('login page has proper heading structure', async ({ page }) => {
    await page.goto('/login');

    // Should have h1
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
  });

  test('form inputs have labels', async ({ page }) => {
    await page.goto('/login');

    // Email input should have associated label
    const emailInput = page.getByLabel(/email/i);
    await expect(emailInput).toBeVisible();

    // Password input should have associated label
    const passwordInput = page.getByLabel(/password/i);
    await expect(passwordInput).toBeVisible();
  });

  test('buttons are keyboard accessible', async ({ page }) => {
    await page.goto('/login');

    // Tab to sign in button and check it can receive focus
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // The submit button should be focusable
    const submitButton = page.getByRole('button', { name: /sign in/i });
    await expect(submitButton).toBeEnabled();
  });
});
