import type { Meta, StoryObj } from '@storybook/nextjs';
import { FormField } from '../FormField';
import { useState } from 'react';
import { action } from '@storybook/addon-actions';

const meta: Meta<typeof FormField> = {
  title: 'BRX/Scraped/FormField',
  component: FormField,
  parameters: {
    docs: {
      description: {
        component: 'Reusable form field component matching BRX design system extracted from scraped HTML.'
      }
    }
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'Name attribute for the input field'
    },
    label: {
      control: 'text',
      description: 'Label text for the field'
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password'],
      description: 'Input type'
    },
    error: {
      control: 'boolean',
      description: 'Whether the field has an error state'
    },
    helperText: {
      control: 'text',
      description: 'Helper or error text to display'
    },
    required: {
      control: 'boolean',
      description: 'Whether the field is required'
    }
  }
};

export default meta;
type Story = StoryObj<typeof FormField>;

// Interactive wrapper component
function InteractiveFormField(props: React.ComponentProps<typeof FormField>) {
  const [value, setValue] = useState('');
  
  return (
    <FormField
      {...props}
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        action('field-changed')(e.target.value);
      }}
    />
  );
}

/**
 * Default form field
 */
export const Default: Story = {
  render: (args) => <InteractiveFormField {...args} />,
  args: {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: false,
    error: false
  }
};

/**
 * Required field with asterisk
 */
export const Required: Story = {
  render: (args) => <InteractiveFormField {...args} />,
  args: {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    error: false
  }
};

/**
 * Field with error state
 */
export const WithError: Story = {
  render: (args) => <InteractiveFormField {...args} />,
  args: {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    error: true,
    helperText: 'Please enter a valid email address'
  }
};

/**
 * Field with helper text
 */
export const WithHelperText: Story = {
  render: (args) => <InteractiveFormField {...args} />,
  args: {
    name: 'username',
    label: 'Username',
    type: 'text',
    required: false,
    error: false,
    helperText: 'Username must be at least 3 characters long'
  }
};

/**
 * Text field variant
 */
export const TextField: Story = {
  render: (args) => <InteractiveFormField {...args} />,
  args: {
    name: 'name',
    label: 'Full Name',
    type: 'text',
    required: false,
    error: false
  }
};

/**
 * Email field variant
 */
export const EmailField: Story = {
  render: (args) => <InteractiveFormField {...args} />,
  args: {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    required: true,
    error: false,
    autoComplete: 'email'
  }
};

