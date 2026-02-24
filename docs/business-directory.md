# Business Directory Feature

## Overview

The business directory allows users to view, search, filter, and add minority-owned businesses. It integrates with AWS AppSync GraphQL API and DynamoDB for real-time data.

## Architecture

```
Browse Page
    ↓
useBusinesses Hook
    ↓
GraphQL Client
    ↓
AWS AppSync API (with Cognito Auth)
    ↓
DynamoDB BusinessTable
```

## Components

### Pages

- **`src/pages/Browse.tsx`** - Main directory page with filtering, sorting, and grid/list views
- **`src/pages/AddBusiness.tsx`** - Form to add new businesses to the directory

### Hooks

- **`src/hooks/useBusinesses.ts`** - React Query hooks for fetching and creating businesses
  - `useBusinesses()` - Fetches all businesses from API
  - `useCreateBusiness()` - Creates a new business

### API Client

- **`src/lib/graphql-client.ts`** - GraphQL client with authentication
  - Handles auth token injection
  - Provides GraphQL queries and mutations
  - Error handling

### Supporting Components

- **`src/components/BusinessCard.tsx`** - Individual business card display
- **`src/components/BusinessFilters.tsx`** - Filter controls for search, category, diversity tags
- **`src/lib/businessUtils.ts`** - Utility functions for filtering and sorting

## Features

### Browse Businesses

- **View All Businesses** - Grid or list view
- **Search** - By name, description, or tags
- **Filter** - By category, diversity tags, location, rating
- **Sort** - By rating, reviews, name, or newest
- **Responsive** - Mobile-friendly design

### Add Business

- **Authenticated Only** - Requires sign-in
- **Simple Form** - Name, category, description
- **Real-time Updates** - Automatically refreshes browse page

## Data Flow

### Fetching Businesses

1. User visits `/browse`
2. `useBusinesses()` hook triggers
3. GraphQL client gets auth token from Cognito
4. Sends `listBusinesses` query to AppSync
5. AppSync queries DynamoDB
6. Data returned and cached by React Query
7. Displayed in Browse page

### Creating Business

1. User fills form on `/add-business`
2. Submits form
3. `useCreateBusiness()` mutation triggers
4. GraphQL client sends `createBusiness` mutation
5. AppSync writes to DynamoDB
6. React Query invalidates cache
7. Browse page automatically refetches
8. User redirected to browse page

## GraphQL Schema

### Queries

```graphql
query ListBusinesses {
  listBusinesses {
    businessId
    name
    category
    description
  }
}

query GetBusiness($businessId: ID!) {
  getBusiness(businessId: $businessId) {
    businessId
    name
    category
    description
  }
}
```

### Mutations

```graphql
mutation CreateBusiness($input: CreateBusinessInput!) {
  createBusiness(input: $input) {
    businessId
    name
    category
    description
  }
}
```

## Usage

### Viewing Businesses

```tsx
import { useBusinesses } from '@/hooks/useBusinesses';

function MyComponent() {
  const { data: businesses, isLoading, error } = useBusinesses();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {businesses?.map(business => (
        <div key={business.id}>{business.name}</div>
      ))}
    </div>
  );
}
```

### Creating a Business

```tsx
import { useCreateBusiness } from '@/hooks/useBusinesses';

function AddBusinessForm() {
  const createBusiness = useCreateBusiness();

  const handleSubmit = async (data) => {
    await createBusiness.mutateAsync({
      businessId: `business-${Date.now()}`,
      name: data.name,
      category: data.category,
      description: data.description,
    });
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

## Fallback Behavior

The Browse page includes intelligent fallback:

- **API Available** - Shows real data from DynamoDB
- **API Empty** - Shows mock data with notice
- **API Error** - Shows mock data with error alert
- **Loading** - Shows loading spinner

This ensures the app is always functional, even during development or API issues.

## Authentication

All GraphQL requests require authentication:

1. User must be signed in
2. Auth token automatically included in requests
3. AppSync validates token with Cognito
4. Unauthorized requests are rejected

## Testing

### Add Test Data

1. Sign in to the app
2. Navigate to `/add-business`
3. Fill out the form:
   - Name: "Test Business"
   - Category: "Technology"
   - Description: "A test business"
4. Submit
5. Verify it appears on `/browse`

### Verify API Connection

1. Open browser DevTools → Network tab
2. Navigate to `/browse`
3. Look for POST request to AppSync API
4. Check request headers include Authorization token
5. Verify response contains business data

## Current Schema Limitations

The current DynamoDB schema only includes:
- businessId
- name
- category
- description

**Missing fields** (shown as placeholders):
- location (city, state, address)
- contact (email, phone, website)
- diversity tags
- rating and reviews
- verification status
- founded date, employees, revenue

These can be added to the CloudFormation template and GraphQL schema as needed.

## Future Enhancements

- [ ] Add full business schema (location, contact, diversity tags)
- [ ] Implement business detail page
- [ ] Add image upload (S3 integration)
- [ ] Implement reviews and ratings
- [ ] Add business verification workflow
- [ ] Implement pagination for large datasets
- [ ] Add advanced search with Elasticsearch
- [ ] Business owner dashboard
- [ ] Analytics and insights

## Troubleshooting

### "No authentication token available"
User needs to sign in first. Redirect to home page.

### "HTTP error! status: 401"
Token expired or invalid. Sign out and sign in again.

### GraphQL errors
Check CloudWatch logs for AppSync resolver errors.

### Empty results
- Verify DynamoDB table has data
- Check AppSync resolver configuration
- Verify IAM permissions

### Mock data showing instead of real data
- Check GraphQL API URL in `.env`
- Verify network request in DevTools
- Check for API errors in console

## Related Documentation

- [Authentication](./authentication.md) - How auth tokens are managed
- [AWS Infrastructure](../infrastructure/backend.yaml) - CloudFormation template
