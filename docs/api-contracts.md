# API Contracts

## Overview

This document defines the explicit API contracts between the frontend and backend of AWS CAMP. All API interactions use GraphQL via AWS AppSync.

## GraphQL Schema

### Complete Schema Definition

```graphql
# Business Type Definition
type Business {
  businessId: ID!
  name: String!
  category: String!
  description: String
}

# Query Operations (Read)
type Query {
  # List all businesses
  # Returns: Array of Business objects
  # Auth: Required (JWT token)
  listBusinesses: [Business]
  
  # Get a single business by ID
  # Args:
  #   businessId: Unique identifier for the business
  # Returns: Business object or null if not found
  # Auth: Required (JWT token)
  getBusiness(businessId: ID!): Business
}

# Input Types for Mutations
input CreateBusinessInput {
  businessId: ID!
  name: String!
  category: String!
  description: String
}

# Mutation Operations (Write)
type Mutation {
  # Create a new business
  # Args:
  #   input: Business data to create
  # Returns: Created Business object
  # Auth: Required (JWT token)
  createBusiness(input: CreateBusinessInput!): Business
}

# Root Schema
schema {
  query: Query
  mutation: Mutation
}
```

## API Endpoints

### Base URL
```
Production: https://3sjezw6eszgkbouzc34amiam4i.appsync-api.us-east-1.amazonaws.com/graphql
Development: (Same endpoint, different Cognito pool)
```

### Authentication
All requests require a valid JWT token from AWS Cognito in the Authorization header:
```
Authorization: <JWT_TOKEN>
```

## Query Contracts

### 1. List Businesses

**Operation:** `listBusinesses`

**Request:**
```graphql
query ListBusinesses {
  listBusinesses {
    businessId
    name
    category
    description
  }
}
```

**Response (Success):**
```json
{
  "data": {
    "listBusinesses": [
      {
        "businessId": "business-1",
        "name": "TechFlow Solutions",
        "category": "Technology",
        "description": "Leading cloud infrastructure provider"
      },
      {
        "businessId": "business-2",
        "name": "Verde Packaging Co",
        "category": "Manufacturing",
        "description": "Sustainable packaging solutions"
      }
    ]
  }
}
```

**Response (Empty):**
```json
{
  "data": {
    "listBusinesses": []
  }
}
```

**Response (Error - Unauthorized):**
```json
{
  "errors": [
    {
      "message": "Unauthorized",
      "errorType": "UnauthorizedException"
    }
  ]
}
```

**Frontend Implementation:**
```typescript
// src/lib/graphql-client.ts
export const LIST_BUSINESSES_QUERY = `
  query ListBusinesses {
    listBusinesses {
      businessId
      name
      category
      description
    }
  }
`;

// src/hooks/useBusinesses.ts
export function useBusinesses() {
  return useQuery({
    queryKey: ['businesses'],
    queryFn: async () => {
      const response = await graphqlRequest<ListBusinessesResponse>({
        query: LIST_BUSINESSES_QUERY,
      });
      return response.listBusinesses.map(mapApiBusinessToFrontend);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

**Contract Guarantees:**
- ✅ Returns array (never null)
- ✅ Empty array if no businesses exist
- ✅ Each business has required fields (businessId, name, category)
- ✅ Description may be null
- ✅ Requires valid JWT token
- ✅ Returns 401 if unauthorized

---

### 2. Get Business by ID

**Operation:** `getBusiness`

**Request:**
```graphql
query GetBusiness($businessId: ID!) {
  getBusiness(businessId: $businessId) {
    businessId
    name
    category
    description
  }
}
```

**Variables:**
```json
{
  "businessId": "business-1"
}
```

**Response (Success):**
```json
{
  "data": {
    "getBusiness": {
      "businessId": "business-1",
      "name": "TechFlow Solutions",
      "category": "Technology",
      "description": "Leading cloud infrastructure provider"
    }
  }
}
```

**Response (Not Found):**
```json
{
  "data": {
    "getBusiness": null
  }
}
```

**Response (Error - Missing Parameter):**
```json
{
  "errors": [
    {
      "message": "Variable 'businessId' has an invalid value: Variable 'businessId' cannot be null",
      "errorType": "ValidationError"
    }
  ]
}
```

**Frontend Implementation:**
```typescript
export const GET_BUSINESS_QUERY = `
  query GetBusiness($businessId: ID!) {
    getBusiness(businessId: $businessId) {
      businessId
      name
      category
      description
    }
  }
`;

export function useBusiness(businessId: string) {
  return useQuery({
    queryKey: ['business', businessId],
    queryFn: async () => {
      const response = await graphqlRequest<GetBusinessResponse>({
        query: GET_BUSINESS_QUERY,
        variables: { businessId },
      });
      return response.getBusiness;
    },
    enabled: !!businessId,
  });
}
```

**Contract Guarantees:**
- ✅ Returns Business object or null
- ✅ businessId parameter is required
- ✅ Returns null if business not found (not an error)
- ✅ Requires valid JWT token
- ✅ Validates businessId format

---

## Mutation Contracts

### 1. Create Business

**Operation:** `createBusiness`

**Request:**
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

**Variables:**
```json
{
  "input": {
    "businessId": "business-1708123456789",
    "name": "New Tech Startup",
    "category": "Technology",
    "description": "Innovative AI solutions"
  }
}
```

**Response (Success):**
```json
{
  "data": {
    "createBusiness": {
      "businessId": "business-1708123456789",
      "name": "New Tech Startup",
      "category": "Technology",
      "description": "Innovative AI solutions"
    }
  }
}
```

**Response (Error - Validation):**
```json
{
  "errors": [
    {
      "message": "Name must be at least 3 characters",
      "errorType": "ValidationException"
    }
  ]
}
```

**Response (Error - Duplicate):**
```json
{
  "errors": [
    {
      "message": "Business with this ID already exists",
      "errorType": "ConditionalCheckFailedException"
    }
  ]
}
```

**Frontend Implementation:**
```typescript
export const CREATE_BUSINESS_MUTATION = `
  mutation CreateBusiness($input: CreateBusinessInput!) {
    createBusiness(input: $input) {
      businessId
      name
      category
      description
    }
  }
`;

export function useCreateBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateBusinessInput) => {
      const response = await graphqlRequest<CreateBusinessResponse>({
        query: CREATE_BUSINESS_MUTATION,
        variables: { input },
      });
      return response.createBusiness;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
    },
  });
}
```

**Contract Guarantees:**
- ✅ Returns created Business object
- ✅ All required fields must be provided (businessId, name, category)
- ✅ Description is optional
- ✅ Requires valid JWT token
- ✅ Validates input data
- ✅ Returns error if business already exists
- ✅ Idempotent (same businessId = same result)

---

## Type Definitions

### TypeScript Types (Frontend)

```typescript
// src/types/business.ts

// API Response Types
export interface ApiBusiness {
  businessId: string;
  name: string;
  category: string;
  description?: string;
}

// Frontend Business Type (Extended)
export interface Business {
  id: string;                    // Mapped from businessId
  name: string;
  description: string;
  category: string;
  location: {
    city: string;
    state: string;
    address?: string;
  };
  contact: {
    email?: string;
    phone?: string;
    website?: string;
  };
  diversity: DiversityTag[];
  rating: number;
  reviewCount: number;
  verified: boolean;
  founded?: number;
  employees?: string;
  revenue?: string;
  logo?: string;
  images?: string[];
  tags?: string[];
}

// Input Types
export interface CreateBusinessInput {
  businessId: string;
  name: string;
  category: string;
  description?: string;
}

// Response Types
export interface ListBusinessesResponse {
  listBusinesses: ApiBusiness[];
}

export interface GetBusinessResponse {
  getBusiness: ApiBusiness | null;
}

export interface CreateBusinessResponse {
  createBusiness: ApiBusiness;
}
```

### DynamoDB Schema (Backend)

```json
{
  "businessId": "business-1708123456789",  // Partition Key (String)
  "name": "TechFlow Solutions",            // String, Required
  "category": "Technology",                // String, Required
  "description": "Cloud infrastructure"    // String, Optional
}
```

## Error Handling

### Error Types

| Error Type | HTTP Status | Description | Frontend Action |
|------------|-------------|-------------|-----------------|
| `UnauthorizedException` | 401 | Invalid or missing JWT token | Redirect to login |
| `ValidationException` | 400 | Invalid input data | Show error message |
| `ConditionalCheckFailedException` | 400 | Duplicate businessId | Show error message |
| `InternalServerError` | 500 | Server error | Show generic error, retry |

### Error Response Format

```json
{
  "errors": [
    {
      "message": "Human-readable error message",
      "errorType": "ErrorTypeName",
      "path": ["createBusiness"],
      "locations": [{ "line": 2, "column": 3 }]
    }
  ]
}
```

### Frontend Error Handling

```typescript
try {
  await createBusiness.mutateAsync(input);
  toast.success('Business created successfully!');
} catch (error: any) {
  // Handle specific error types
  if (error.message.includes('Unauthorized')) {
    // Redirect to login
    navigate('/');
    toast.error('Please sign in to continue');
  } else if (error.message.includes('already exists')) {
    toast.error('A business with this ID already exists');
  } else {
    // Generic error
    toast.error(error.message || 'Failed to create business');
  }
}
```

## Rate Limiting

### Current Limits
- **No explicit rate limiting** (AWS AppSync default limits apply)
- AWS AppSync default: 1000 requests per second per account
- DynamoDB: On-demand mode (no throttling)

### Future Considerations
- Implement per-user rate limiting
- Add caching layer (Redis/ElastiCache)
- Monitor CloudWatch metrics for throttling

## Versioning Strategy

### Current Version
- **Version:** 1.0 (Implicit)
- **No versioning in URLs** (single version)

### Future Versioning
When breaking changes are needed:

**Option 1: GraphQL Field Deprecation**
```graphql
type Business {
  businessId: ID! @deprecated(reason: "Use 'id' instead")
  id: ID!
  name: String!
}
```

**Option 2: Separate Schemas**
```
/graphql/v1  (Current)
/graphql/v2  (New version)
```

**Option 3: Schema Stitching**
- Maintain backward compatibility
- Add new fields without removing old ones
- Deprecate old fields gradually

## Testing Contracts

### Contract Tests (Frontend)

```typescript
// tests/api-contracts.test.ts

describe('API Contracts', () => {
  it('listBusinesses returns array of businesses', async () => {
    const response = await graphqlRequest({
      query: LIST_BUSINESSES_QUERY,
    });
    
    expect(response.listBusinesses).toBeInstanceOf(Array);
    response.listBusinesses.forEach(business => {
      expect(business).toHaveProperty('businessId');
      expect(business).toHaveProperty('name');
      expect(business).toHaveProperty('category');
    });
  });

  it('createBusiness requires authentication', async () => {
    // Remove auth token
    await expect(
      graphqlRequest({
        query: CREATE_BUSINESS_MUTATION,
        variables: { input: { ... } },
      })
    ).rejects.toThrow('Unauthorized');
  });
});
```

### Integration Tests (Backend)

```bash
# Test AppSync resolvers
aws appsync evaluate-mapping-template \
  --template file://resolver-template.vtl \
  --context file://test-context.json
```

## API Documentation

### GraphQL Playground
- **URL:** AppSync Console → Queries
- **Features:**
  - Interactive schema explorer
  - Query builder
  - Documentation browser
  - Request/response testing

### Generating Documentation

```bash
# Generate GraphQL schema documentation
npx graphql-markdown \
  --schema infrastructure/backend.yaml \
  --output docs/api-reference.md
```

## Migration Guide

### Adding New Fields

**Step 1: Update CloudFormation Schema**
```yaml
GraphQLSchema:
  Definition: |
    type Business {
      businessId: ID!
      name: String!
      category: String!
      description: String
      # NEW FIELD
      website: String
    }
```

**Step 2: Update DynamoDB (No schema change needed)**
- DynamoDB is schemaless
- New field automatically supported

**Step 3: Update Frontend Types**
```typescript
export interface ApiBusiness {
  businessId: string;
  name: string;
  category: string;
  description?: string;
  website?: string;  // NEW FIELD
}
```

**Step 4: Update Queries**
```graphql
query ListBusinesses {
  listBusinesses {
    businessId
    name
    category
    description
    website  # NEW FIELD
  }
}
```

**Step 5: Deploy**
1. Deploy CloudFormation stack (backend)
2. Deploy frontend (no breaking changes)

### Removing Fields (Breaking Change)

**Step 1: Deprecate Field**
```graphql
type Business {
  oldField: String @deprecated(reason: "Use newField instead")
  newField: String
}
```

**Step 2: Update Frontend**
- Migrate to new field
- Keep old field for backward compatibility

**Step 3: Wait for Adoption**
- Monitor usage of deprecated field
- Notify users of deprecation

**Step 4: Remove Field**
- After sufficient time, remove from schema
- Deploy backend and frontend together

## Best Practices

### DO ✅

1. **Always include required fields in queries**
   ```graphql
   query {
     listBusinesses {
       businessId  # Always include
       name        # Always include
       category    # Always include
     }
   }
   ```

2. **Handle null values**
   ```typescript
   const description = business.description || 'No description';
   ```

3. **Validate input before sending**
   ```typescript
   if (name.length < 3) {
     toast.error('Name must be at least 3 characters');
     return;
   }
   ```

4. **Use TypeScript types**
   ```typescript
   const response: ListBusinessesResponse = await graphqlRequest(...);
   ```

5. **Cache responses**
   ```typescript
   useQuery({
     queryKey: ['businesses'],
     staleTime: 5 * 60 * 1000, // 5 minutes
   });
   ```

### DON'T ❌

1. **Don't assume fields exist**
   ```typescript
   // ❌ BAD
   const desc = business.description.toUpperCase();
   
   // ✅ GOOD
   const desc = business.description?.toUpperCase() || '';
   ```

2. **Don't skip error handling**
   ```typescript
   // ❌ BAD
   await createBusiness(input);
   
   // ✅ GOOD
   try {
     await createBusiness(input);
   } catch (error) {
     handleError(error);
   }
   ```

3. **Don't hardcode API URLs**
   ```typescript
   // ❌ BAD
   const API_URL = 'https://...';
   
   // ✅ GOOD
   const API_URL = import.meta.env.VITE_GRAPHQL_API_URL;
   ```

4. **Don't send sensitive data**
   ```typescript
   // ❌ BAD
   createBusiness({ password: '...' });
   
   // ✅ GOOD - Auth handled by Cognito
   ```

## Related Documentation

- [Architecture](./architecture.md) - System architecture
- [Separation of Concerns](./separation-of-concerns.md) - Frontend/Backend boundaries
- [Authentication](./authentication.md) - Auth implementation
- [Business Directory](./business-directory.md) - Feature details
