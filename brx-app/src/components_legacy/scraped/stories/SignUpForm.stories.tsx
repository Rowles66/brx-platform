import type { Meta, StoryObj } from '@storybook/nextjs';
import { SignUpForm } from '../SignUpForm';
import { action } from '@storybook/addon-actions';

const meta: Meta<typeof SignUpForm> = {
  title: 'BRX/Scraped/SignUpForm',
  component: SignUpForm,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Complete sign-up form component extracted from BRX Performance registration page.'
      }
    }
  },
  argTypes: {
    loading: {
      control: 'boolean',
      description: 'Whether the form is in a loading state'
    },
    error: {
      control: 'text',
      description: 'Error message to display'
    },
    onSubmit: {
      action: 'submitted',
      description: 'Callback fired when form is submitted'
    }
  }
};

export default meta;
type Story = StoryObj<typeof SignUpForm>;

/**
 * Default sign-up form state
 */
export const Default: Story = {
  args: {
    onSubmit: action('form-submitted'),
    loading: false,
    error: undefined
  }
};

/**
 * Form in loading state
 */
export const Loading: Story = {
  args: {
    onSubmit: action('form-submitted'),
    loading: true,
    error: undefined
  }
};

/**
 * Form with error message
 */
export const WithError: Story = {
  args: {
    onSubmit: action('form-submitted'),
    loading: false,
    error: 'An account with this email already exists. Please try a different email.'
  }
};

/**
 * Form with validation error
 */
export const ValidationError: Story = {
  args: {
    onSubmit: action('form-submitted'),
    loading: false,
    error: 'Password must be at least 8 characters long and contain at least one number.'
  }
};

/**
 * Form with server error
 */
export const ServerError: Story = {
  args: {
    onSubmit: action('form-submitted'),
    loading: false,
    error: 'Registration service is temporarily unavailable. Please try again later.'
  }
};

