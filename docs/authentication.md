# Authentication Feature

## Overview

This application uses AWS Cognito for user authentication, providing secure sign-up, sign-in, and session management capabilities.

## Architecture

```
React Frontend (Vite + TypeScript)
    ↓
AuthContext (State Management)
    ↓
AWS Amplify SDK
    ↓
AWS Cognito User Pool
```

## Components

### Core Files

- **`src/contexts/AuthContext.tsx`** - Manages authentication state and provides auth methods throughout the app
- **`src/components/AuthModal.tsx`** - UI for sign-in, sign-up, and email confirmation
- **`src/components/ProtectedRoute.tsx`** - Wrapper component to protect authenticated-only routes
- **`src/components/Navigation.tsx`** - Auth-aware navigation with user menu
- **`src/config/aws-config.ts`** - AWS Amplify configuration

### Authentication Flow

#### Sign Up
1. User fills out sign-up form (username, email, password)
2. Cognito creates account and sends verification code to email
3. User enters confirmation code
4. Account is activated

#### Sign In
1. User enters username and password
2. Cognito validates credentials
3. JWT tokens are issued and stored
4. User session is established

#### Sign Out
1. User clicks sign out
2. Session is cleared
3. User is redirected to home page

## Usage

### Using Auth in Components

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.username}!</p>
      ) : (
        <p>Please sign in</p>
      )}
    </div>
  );
}
```

### Protecting Routes

```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';

<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

### Making Authenticated API Calls

```tsx
import { fetchAuthSession } from 'aws-amplify/auth';

async function callAPI() {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();

  const response = await fetch(API_URL, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  return response.json();
}
```

## Configuration

### Environment Variables

Required variables in `.env`:

```env
VITE_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
VITE_COGNITO_USER_POOL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_AWS_REGION=us-east-1
```

### Getting Credentials

Retrieve from CloudFormation stack outputs:

```bash
aws cloudformation describe-stacks \
  --stack-name aws-camp-minority-businesses-dev \
  --query 'Stacks[0].Outputs'
```

## Setup for New Developers

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy environment template: `cp .env.example .env`
4. Get credentials from team lead and add to `.env`
5. Start dev server: `npm run dev`

## Deployment

### Environment Variables in Production

Add the same environment variables to your hosting platform:

**Vercel/Netlify:**
- Go to project settings → Environment Variables
- Add each `VITE_*` variable
- Redeploy

**AWS Amplify:**
- App settings → Environment variables
- Add variables
- Amplify rebuilds automatically

### Build Command

```bash
npm run build
```

The environment variables are baked into the build at build time.

## Security

- Passwords are never stored in the frontend
- JWT tokens are managed by AWS Amplify SDK
- Tokens are stored securely in browser localStorage
- All communication with Cognito is over HTTPS
- `.env` file is excluded from version control

## AWS Infrastructure

The authentication infrastructure is defined in `infrastructure/backend.yaml`:

- **Cognito User Pool** - Manages user accounts
- **Cognito User Pool Client** - Allows the app to authenticate users
- **AppSync GraphQL API** - Protected by Cognito authentication
- **DynamoDB Table** - Stores business data (access controlled by auth)

## Troubleshooting

### "User is not confirmed"
Check email for confirmation code. If not received, check spam folder.

### "Invalid credentials"
Ensure you're using the username (not email) to sign in.

### Environment variables not loading
- Restart dev server after changing `.env`
- Verify variables start with `VITE_`
- Check `.env` file is in project root

### Session not persisting
- Check browser localStorage is enabled
- Verify Cognito User Pool ID and Client ID are correct

## Future Enhancements

- [ ] Password reset functionality
- [ ] Social sign-in (Google, Facebook)
- [ ] Multi-factor authentication (MFA)
- [ ] User profile management
- [ ] Role-based access control
