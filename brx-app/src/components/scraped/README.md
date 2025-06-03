# BRX Performance Scraped UI Components

This directory contains React/TypeScript components extracted from the BRX Performance web application using Firecrawl HTML scraping. These components faithfully reproduce the original design and functionality from the live application.

## 📦 Components

### Layout Components
- **AuthLayout** - Main authentication layout with branded background and logo
- **AuthCard** - Card container for authentication forms with error handling
- **Logo** - BRX Performance logo component

### Form Components
- **FormField** - Reusable form input field with BRX styling
- **PasswordField** - Password input with show/hide toggle functionality  
- **CheckboxField** - Custom checkbox with BRX design
- **AuthButton** - Button component with loading states

### Complete Page Components
- **SignInForm** - Complete sign-in form with validation
- **SignUpForm** - Complete registration form with terms acceptance

## 🎨 Design Fidelity

These components were extracted directly from the live BRX Performance application HTML and maintain:
- ✅ Original CSS class names and styling
- ✅ Exact component structure and hierarchy
- ✅ Original form behavior and validation
- ✅ Branded colors, fonts, and visual design
- ✅ Responsive layout patterns
- ✅ Accessibility attributes

## 🔧 Usage

```tsx
import { SignInForm, SignUpForm } from './components/scraped';

// Use the complete forms
<SignInForm 
  onSubmit={(data) => console.log(data)}
  loading={false}
  error={undefined}
/>

// Or use individual components
import { AuthLayout, FormField, AuthButton } from './components/scraped';

<AuthLayout>
  <form>
    <FormField 
      name="email" 
      label="Email" 
      type="email" 
      value={email}
      onChange={handleChange}
    />
    <AuthButton type="submit">Submit</AuthButton>
  </form>
</AuthLayout>
```

## 📚 Storybook

Each component includes comprehensive Storybook stories demonstrating:
- Default states
- Error states
- Loading states
- Interactive examples
- Accessibility features

Run Storybook to explore all component variations:
```bash
npm run storybook
```

## 🚀 TODO: Design Polish Items

Each component includes detailed TODO comments for design improvements:

### High Priority
- [ ] Add comprehensive form validation
- [ ] Implement proper error handling and user feedback
- [ ] Add loading states and skeleton screens
- [ ] Optimize SVG backgrounds for performance
- [ ] Add proper focus management and keyboard navigation

### Medium Priority
- [ ] Add dark mode support
- [ ] Implement responsive design improvements
- [ ] Add animation and micro-interactions
- [ ] Create component size variants
- [ ] Add proper ARIA labels and accessibility

### Low Priority
- [ ] Add password strength indicator
- [ ] Implement social login options
- [ ] Add form analytics tracking
- [ ] Create component grouping capabilities
- [ ] Add character count for text fields

## 🔍 Source Data

Components were extracted from these BRX Performance pages:
- **Sign In**: `https://online.brxperformance.com/login`
- **Sign Up**: `https://online.brxperformance.com/ex4/sign-up`
- **Home/Dashboard**: `https://online.brxperformance.com/`

## 🛠️ Technology Stack

- **React 18** - Component framework
- **TypeScript** - Type safety
- **Material-UI (MUI)** - Base component library (matches original)
- **Storybook** - Component documentation and testing
- **Firecrawl** - HTML extraction and conversion

## 📋 Component Architecture

Components follow a hierarchical structure:
```
AuthLayout (container)
├── Logo (branding)
└── AuthCard (form container)
    ├── FormField (inputs)
    ├── PasswordField (secure inputs)
    ├── CheckboxField (checkboxes)
    └── AuthButton (actions)
```

## 🔄 Next Steps

1. **Integration**: Connect forms to authentication API
2. **Validation**: Add client-side validation rules
3. **Testing**: Add unit and integration tests
4. **Optimization**: Improve performance and bundle size
5. **Enhancement**: Implement TODO items based on priority

## 📝 Notes

- All components maintain the original BRX Performance design system
- CSS class names from the original application are preserved
- Components are fully typed with TypeScript interfaces
- Storybook stories provide comprehensive documentation
- TODO comments indicate areas for future enhancement

