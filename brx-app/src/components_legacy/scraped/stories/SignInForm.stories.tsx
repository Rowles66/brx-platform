import type { Meta, StoryObj } from '@storybook/nextjs';
import { SignInForm } from '../SignInForm';
import { action } from '@storybook/addon-actions';

const meta: Meta<typeof SignInForm> = {
  title: 'BRX/Scraped/SignInForm',
  component: SignInForm,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Complete sign-in form component extracted from BRX Performance authentication page.'
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
type Story = StoryObj<typeof SignInForm>;

/**
 * Default sign-in form state
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
    error: 'Invalid email or password. Please try again.'
  }
};

/**
 * Form with network error
 */
export const NetworkError: Story = {
  args: {
    onSubmit: action('form-submitted'),
    loading: false,
    error: 'Unable to connect to server. Please check your internet connection and try again.'
  }
};

/**
 * Form with validation error
 */
export const ValidationError: Story = {
  args: {
    onSubmit: action('form-submitted'),
    loading: false,
    error: 'Please enter a valid email address.'
  }
};

