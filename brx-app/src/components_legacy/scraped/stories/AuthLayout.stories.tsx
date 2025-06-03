import type { Meta, StoryObj } from '@storybook/nextjs';
import { AuthLayout } from '../AuthLayout';
import { Typography, Card } from '@mui/material';

const meta: Meta<typeof AuthLayout> = {
  title: 'BRX/Scraped/AuthLayout',
  component: AuthLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Authentication layout component with branded background and logo extracted from BRX Performance app.'
      }
    }
  },
  argTypes: {
    maxWidth: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Maximum width for the content container'
    },
    children: {
      control: false,
      description: 'Content to display within the layout'
    }
  }
};

export default meta;
type Story = StoryObj<typeof AuthLayout>;

/**
 * Default authentication layout with sample content
 */
export const Default: Story = {
  args: {
    maxWidth: 'sm',
    children: (
      <Card sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Sample Content
        </Typography>
        <Typography variant="body1">
          This is how content appears within the AuthLayout component.
          The background features the BRX Performance branded gradients
          and the logo is prominently displayed at the top.
        </Typography>
      </Card>
    )
  }
};

/**
 * Layout with medium width container
 */
export const MediumWidth: Story = {
  args: {
    maxWidth: 'md',
    children: (
      <Card sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Medium Width Container
        </Typography>
        <Typography variant="body1">
          This demonstrates the layout with a medium-width container.
          Notice how the content area expands to accommodate more content.
        </Typography>
      </Card>
    )
  }
};

/**
 * Layout with large width container
 */
export const LargeWidth: Story = {
  args: {
    maxWidth: 'lg',
    children: (
      <Card sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Large Width Container
        </Typography>
        <Typography variant="body1">
          This shows the layout with a large-width container,
          suitable for more complex forms or dashboard content.
        </Typography>
      </Card>
    )
  }
};

/**
 * Empty layout for testing
 */
export const Empty: Story = {
  args: {
    children: null
  }
};

