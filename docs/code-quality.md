# Code Quality Standards (QR-1)

## Overview

This document defines code quality standards for the AWS CAMP for Minority Businesses project. All code must be readable, consistently structured, and maintainable.

## Code Style & Formatting

### TypeScript/JavaScript Standards

**File Naming**
- Components: PascalCase (e.g., `BusinessCard.tsx`)
- Utilities/Hooks: camelCase (e.g., `useBusinesses.ts`, `businessUtils.ts`)
- Types: camelCase (e.g., `business.ts`)
- Constants: UPPER_SNAKE_CASE in files, camelCase for filenames

**Component Structure**
```typescript
// 1. Imports (grouped)
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Business } from '@/types/business';

// 2. Types/Interfaces
interface BusinessCardProps {
  business: Business;
  onSelect?: (id: string) => void;
}

// 3. Component
export function BusinessCard({ business, onSelect }: BusinessCardProps) {
  // 3a. Hooks
  const [isExpanded, setIsExpanded] = useState(false);
  
  // 3b. Event handlers
  const handleClick = () => {
    onSelect?.(business.id);
  };
  
  // 3c. Render
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
```

**Import Order**
1. React imports
2. Third-party libraries
3. UI components (`@/components/ui`)
4. Custom components (`@/components`)
5. Hooks (`@/hooks`)
6. Utils/Lib (`@/lib`)
7. Types (`@/types`)
8. Relative imports

**Naming Conventions**
- Variables: `camelCase`
- Functions: `camelCase`
- Components: `PascalCase`
- Types/Interfaces: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Private functions: prefix with `_` (e.g., `_handleInternalEvent`)

### React Best Practices

**Hooks**
- Custom hooks must start with `use` (e.g., `useBusinesses`)
- Keep hooks focused on single responsibility
- Document complex hooks with JSDoc comments

**Props**
- Destructure props in function signature
- Use TypeScript interfaces for prop types
- Mark optional props with `?`
- Provide default values when appropriate

**State Management**
- Use React Query for server state
- Use Context for global UI state (auth, theme)
- Use local state for component-specific UI state
- Avoid prop drilling - use Context when passing props > 2 levels

**Component Design**
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use composition over inheritance
- Prefer function components over class components

### TypeScript Standards

**Type Safety**
- Avoid `any` - use `unknown` if type is truly unknown
- Define interfaces for all data structures
- Use type guards for runtime type checking
- Leverage TypeScript's strict mode features

**Type Definitions**
```typescript
// Good: Explicit types
interface Business {
  id: string;
  name: string;
  category: string;
}

function getBusiness(id: string): Business | null {
  // ...
}

// Avoid: Implicit any
function getBusiness(id) {
  // ...
}
```

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components (shadcn/ui)
│   ├── BusinessCard.tsx
│   └── Navigation.tsx
├── pages/              # Route pages
│   ├── Index.tsx
│   └── Browse.tsx
├── hooks/              # Custom React hooks
│   └── useBusinesses.ts
├── lib/                # Utility functions
│   ├── utils.ts
│   └── graphql-client.ts
├── types/              # TypeScript type definitions
│   └── business.ts
├── contexts/           # React contexts
│   └── AuthContext.tsx
├── config/             # Configuration files
│   └── aws-config.ts
└── data/               # Mock/seed data
    └── mockBusinesses.ts
```

## Code Documentation

### JSDoc Comments

**Functions**
```typescript
/**
 * Fetches businesses from the API with optional filtering
 * 
 * @param filters - Optional filter criteria
 * @returns Promise resolving to array of businesses
 * @throws {Error} When API request fails
 * 
 * @example
 * const businesses = await fetchBusinesses({ category: 'Technology' });
 */
export async function fetchBusinesses(filters?: BusinessFilters): Promise<Business[]> {
  // ...
}
```

**Components**
```typescript
/**
 * Displays a business card with name, category, and description
 * 
 * @param business - Business data to display
 * @param onSelect - Optional callback when card is clicked
 * 
 * @example
 * <BusinessCard 
 *   business={business} 
 *   onSelect={(id) => navigate(`/business/${id}`)} 
 * />
 */
export function BusinessCard({ business, onSelect }: BusinessCardProps) {
  // ...
}
```

**Complex Logic**
```typescript
// Calculate weighted rating based on review count and average
// Uses Wilson score interval for statistical confidence
const weightedRating = calculateWilsonScore(
  business.rating,
  business.reviewCount
);
```

### README Documentation

Each major feature should have:
- Purpose and overview
- Setup instructions
- Usage examples
- API documentation (if applicable)
- Known limitations

## Linting & Formatting

### ESLint Configuration

The project uses ESLint with TypeScript support. Configuration is in `eslint.config.js`.

**Run linting:**
```bash
npm run lint
```

**Key Rules**
- No unused variables (warnings)
- React Hooks rules enforced
- TypeScript recommended rules
- React Refresh rules for HMR

### Prettier Configuration

Prettier ensures consistent code formatting across the team.

**Configuration (`.prettierrc`):**
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always"
}
```

**Run formatting:**
```bash
npm run format
```

**Format on save:**
Enable in your editor (VS Code: `"editor.formatOnSave": true`)

### EditorConfig

Ensures consistent editor settings across team members.

**Configuration (`.editorconfig`):**
```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.{js,jsx,ts,tsx,json,css}]
indent_style = space
indent_size = 2

[*.md]
trim_trailing_whitespace = false
```

## Error Handling

### Frontend Error Handling

**API Errors**
```typescript
try {
  const businesses = await fetchBusinesses();
  return businesses;
} catch (error) {
  if (error instanceof GraphQLError) {
    console.error('GraphQL Error:', error.message);
    toast.error('Failed to load businesses');
  } else {
    console.error('Unexpected error:', error);
    toast.error('An unexpected error occurred');
  }
  throw error;
}
```

**React Error Boundaries**
```typescript
// Wrap routes with error boundary
<ErrorBoundary fallback={<ErrorPage />}>
  <Routes>
    {/* routes */}
  </Routes>
</ErrorBoundary>
```

**Loading States**
```typescript
const { data, isLoading, error } = useBusinesses();

if (isLoading) return <Skeleton />;
if (error) return <ErrorMessage error={error} />;
if (!data) return <EmptyState />;

return <BusinessList businesses={data} />;
```

### Error Messages

**User-Facing Errors**
- Clear, actionable messages
- Avoid technical jargon
- Suggest next steps
- Use toast notifications for transient errors

**Developer Errors**
- Log full error details to console
- Include context (function name, parameters)
- Use structured logging for production

## Testing Standards

### Unit Tests

**File Naming**
- Test files: `ComponentName.test.tsx` or `functionName.test.ts`
- Place tests next to source files or in `__tests__` directory

**Test Structure**
```typescript
import { render, screen } from '@testing-library/react';
import { BusinessCard } from './BusinessCard';

describe('BusinessCard', () => {
  const mockBusiness = {
    id: '1',
    name: 'Test Business',
    category: 'Technology',
  };

  it('renders business name', () => {
    render(<BusinessCard business={mockBusiness} />);
    expect(screen.getByText('Test Business')).toBeInTheDocument();
  });

  it('calls onSelect when clicked', () => {
    const onSelect = jest.fn();
    render(<BusinessCard business={mockBusiness} onSelect={onSelect} />);
    
    screen.getByRole('button').click();
    expect(onSelect).toHaveBeenCalledWith('1');
  });
});
```

**Coverage Goals**
- Core business logic: 80%+ coverage
- UI components: 60%+ coverage
- Utility functions: 90%+ coverage

### Integration Tests

Test complete user flows:
```typescript
describe('Business Directory Flow', () => {
  it('allows user to browse and filter businesses', async () => {
    render(<App />);
    
    // Navigate to browse page
    await userEvent.click(screen.getByText('Browse Businesses'));
    
    // Apply filter
    await userEvent.selectOptions(screen.getByLabelText('Category'), 'Technology');
    
    // Verify filtered results
    expect(screen.getByText('Tech Business')).toBeInTheDocument();
    expect(screen.queryByText('Restaurant Business')).not.toBeInTheDocument();
  });
});
```

## Performance Best Practices

### React Performance

**Memoization**
```typescript
// Memoize expensive calculations
const sortedBusinesses = useMemo(
  () => businesses.sort((a, b) => b.rating - a.rating),
  [businesses]
);

// Memoize callbacks passed to children
const handleSelect = useCallback(
  (id: string) => navigate(`/business/${id}`),
  [navigate]
);
```

**Code Splitting**
```typescript
// Lazy load routes
const Browse = lazy(() => import('./pages/Browse'));
const About = lazy(() => import('./pages/About'));

// Wrap with Suspense
<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/browse" element={<Browse />} />
    <Route path="/about" element={<About />} />
  </Routes>
</Suspense>
```

**List Rendering**
```typescript
// Always use keys for lists
{businesses.map((business) => (
  <BusinessCard key={business.id} business={business} />
))}

// Virtualize long lists
import { useVirtualizer } from '@tanstack/react-virtual';
```

### Bundle Size

- Use tree-shaking friendly imports: `import { Button } from '@/components/ui/button'`
- Avoid importing entire libraries: `import debounce from 'lodash/debounce'` not `import _ from 'lodash'`
- Analyze bundle: `npm run build` and check dist size

## Accessibility Standards

### Semantic HTML

```typescript
// Good: Semantic elements
<nav>
  <ul>
    <li><a href="/browse">Browse</a></li>
  </ul>
</nav>

// Avoid: Divs for everything
<div onClick={handleClick}>
  <div>Browse</div>
</div>
```

### ARIA Labels

```typescript
// Add labels for screen readers
<button aria-label="Close dialog" onClick={onClose}>
  <X className="h-4 w-4" />
</button>

// Use semantic HTML when possible
<button onClick={onClose}>
  Close
</button>
```

### Keyboard Navigation

- All interactive elements must be keyboard accessible
- Maintain logical tab order
- Provide visible focus indicators
- Support common keyboard shortcuts (Esc to close, Enter to submit)

### Color Contrast

- Text must meet WCAG AA standards (4.5:1 for normal text)
- Don't rely on color alone to convey information
- Test with dark mode enabled

## Security Best Practices

### Input Validation

```typescript
// Validate and sanitize user input
const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
});

const result = schema.safeParse(formData);
if (!result.success) {
  // Handle validation errors
}
```

### Authentication

- Never store tokens in localStorage (use httpOnly cookies or secure storage)
- Always validate auth state on protected routes
- Implement proper session timeout
- Use AWS Cognito for authentication

### API Security

- Always authenticate API requests
- Validate permissions on backend
- Use HTTPS for all requests
- Sanitize GraphQL inputs

## Git Workflow

### Commit Messages

Follow conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(auth): add forgot password flow

Implement two-step password reset using Cognito
- Add forgot password form
- Add confirmation code input
- Update AuthModal component

Closes #123
```

### Branch Naming

- Feature: `feature/add-business-reviews`
- Bug fix: `fix/auth-redirect-loop`
- Hotfix: `hotfix/security-patch`
- Docs: `docs/update-api-contracts`

### Pull Request Guidelines

**PR Title:** Clear, descriptive summary

**PR Description:**
- What: What changes were made
- Why: Why these changes were needed
- How: How the changes were implemented
- Testing: How to test the changes
- Screenshots: For UI changes

**Before Submitting:**
- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] No linting errors
- [ ] Documentation updated
- [ ] Self-reviewed code
- [ ] Added tests for new features

## Code Review Checklist

### Functionality
- [ ] Code works as intended
- [ ] Edge cases handled
- [ ] Error handling implemented
- [ ] Loading states implemented

### Code Quality
- [ ] Code is readable and well-structured
- [ ] No code duplication
- [ ] Functions are focused and small
- [ ] Naming is clear and consistent

### Performance
- [ ] No unnecessary re-renders
- [ ] Expensive operations memoized
- [ ] Large lists virtualized
- [ ] Images optimized

### Security
- [ ] Input validated
- [ ] Auth checks in place
- [ ] No sensitive data exposed
- [ ] XSS vulnerabilities addressed

### Testing
- [ ] Unit tests added
- [ ] Integration tests added (if applicable)
- [ ] Tests are meaningful
- [ ] Coverage meets standards

### Documentation
- [ ] Code comments added for complex logic
- [ ] JSDoc comments for public APIs
- [ ] README updated (if needed)
- [ ] Type definitions complete

## Tools & IDE Setup

### VS Code Extensions

Recommended extensions:
- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- GitLens
- Error Lens

### VS Code Settings

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "non-relative"
}
```

## Continuous Integration

### Pre-commit Hooks

Use Husky to run checks before commits:

```bash
# Install Husky
npm install --save-dev husky

# Setup pre-commit hook
npx husky install
npx husky add .husky/pre-commit "npm run lint"
```

### CI Pipeline

GitHub Actions workflow runs on every PR:
- Lint check
- Type check
- Unit tests
- Build verification

## Related Documentation

- [Architecture](./architecture.md) - System architecture
- [API Contracts](./api-contracts.md) - API definitions
- [Feature Growth](./feature-growth-guide.md) - Adding new features
- [Separation of Concerns](./separation.md) - Boundaries

## Enforcement

Code quality standards are enforced through:
1. ESLint configuration
2. Prettier formatting
3. TypeScript strict mode
4. Pre-commit hooks
5. CI/CD pipeline checks
6. Code review process

All team members are expected to follow these standards. When in doubt, prioritize readability and maintainability over cleverness.
