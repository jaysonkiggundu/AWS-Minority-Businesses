# Frontend and Backend Separation

## Overview

AWS CAMP follows a strict separation between frontend and backend responsibilities, ensuring maintainability, scalability, and security.

## Architectural Boundaries

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND                               │
│                   (Client-Side)                             │
│                                                             │
│  Responsibilities:                                          │
│  ✓ User Interface & Experience                             │
│  ✓ Client-Side Routing                                     │
│  ✓ Form Validation (UX)                                    │
│  ✓ State Management                                        │
│  ✓ API Client Logic                                        │
│  ✓ Caching Strategy                                        │
│  ✓ Error Handling & Display                                │
│                                                             │
│  Does NOT:                                                  │
│  ✗ Store sensitive data                                    │
│  ✗ Implement business logic                                │
│  ✗ Direct database access                                  │
│  ✗ Authentication logic                                    │
│  ✗ Authorization decisions                                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS API Calls
                            │ (GraphQL + JWT)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND                                │
│                   (Server-Side)                             │
│                                                             │
│  Responsibilities:                                          │
│  ✓ Authentication & Authorization                          │
│  ✓ Business Logic                                          │
│  ✓ Data Validation (Security)                              │
│  ✓ Database Operations                                     │
│  ✓ API Contract (GraphQL Schema)                           │
│  ✓ Data Persistence                                        │
│  ✓ Security Enforcement                                    │
│                                                             │
│  Does NOT:                                                  │
│  ✗ Render UI                                               │
│  ✗ Handle user interactions                                │
│  ✗ Manage client state                                     │
│  ✗ Store UI preferences                                    │
└─────────────────────────────────────────────────────────────┘
```

## Responsibility Matrix

| Concern | Frontend | Backend | Notes |
|---------|----------|---------|-------|
| **User Authentication** | Initiates | Validates | Frontend calls Cognito via Amplify, Backend validates JWT |
| **Form Validation** | UX validation | Security validation | Frontend for UX, Backend for security |
| **Data Fetching** | Requests | Provides | Frontend requests via GraphQL, Backend queries DB |
| **Business Logic** | ❌ | ✅ | All business rules in backend resolvers |
| **Data Storage** | ❌ | ✅ | Only backend writes to DynamoDB |
| **Authorization** | ❌ | ✅ | Backend checks permissions |
| **Routing** | ✅ | ❌ | Client-side routing via React Router |
| **UI State** | ✅ | ❌ | React state, Context, React Query |
| **Caching** | ✅ | ❌ | React Query caches API responses |
| **Error Display** | ✅ | ❌ | Frontend shows user-friendly errors |
| **Error Logging** | ✅ | ✅ | Both log errors (CloudWatch for backend) |
| **Data Validation** | UX only | Security | Frontend validates for UX, Backend for security |
| **Session Management** | Stores tokens | Issues tokens | Frontend stores JWT, Backend issues via Cognito |

## Frontend Responsibilities

### 1. User Interface & Experience

**What Frontend Does:**
- Renders all UI components
- Handles user interactions (clicks, typing, etc.)
- Manages UI state (modals, dropdowns, forms)
- Provides visual feedback (loading, errors, success)
- Implements responsive design
- Manages theme (light/dark mode)

**Example:**
```typescript
// ✅ CORRECT: Frontend handles UI state
const [isModalOpen, setIsModalOpen] = useState(false);
const [theme, setTheme] = useState<'light' | 'dark'>('light');

// ✅ CORRECT: Frontend validates for UX
const validateEmail = (email: string) => {
  return email.includes('@'); // Quick UX validation
};
```

### 2. Client-Side Routing

**What Frontend Does:**
- Manages navigation between pages
- Protects routes based on auth state
- Handles 404 pages
- Manages browser history

**Example:**
```typescript
// ✅ CORRECT: Frontend routing
<Routes>
  <Route path="/" element={<Index />} />
  <Route path="/browse" element={<Browse />} />
  <Route 
    path="/add-business" 
    element={<ProtectedRoute><AddBusiness /></ProtectedRoute>} 
  />
</Routes>
```

### 3. State Management

**What Frontend Does:**
- Manages local component state
- Manages global UI state (auth, theme)
- Caches server data (React Query)
- Optimistic updates

**Example:**
```typescript
// ✅ CORRECT: Frontend manages state
const { user, isAuthenticated } = useAuth(); // Global auth state
const { data: businesses } = useBusinesses(); // Cached server data
const [filters, setFilters] = useState<Filters>({}); // Local state
```

### 4. API Client Logic

**What Frontend Does:**
- Constructs API requests
- Includes authentication tokens
- Handles API responses
- Manages request retries
- Implements caching strategy

**Example:**
```typescript
// ✅ CORRECT: Frontend makes API calls
export async function graphqlRequest<T>(request: GraphQLRequest): Promise<T> {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();

  const response = await fetch(GRAPHQL_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token, // Frontend includes token
    },
    body: JSON.stringify(request),
  });

  return response.json();
}
```

### 5. What Frontend Does NOT Do

```typescript
// ❌ WRONG: Frontend should NOT implement business logic
const calculateDiscount = (price: number, userType: string) => {
  if (userType === 'premium') return price * 0.8;
  return price;
};

// ❌ WRONG: Frontend should NOT directly access database
const db = new DynamoDB();
db.putItem({ ... });

// ❌ WRONG: Frontend should NOT make authorization decisions
if (user.role === 'admin') {
  // Allow delete - Backend should enforce this!
}

// ❌ WRONG: Frontend should NOT store sensitive data
localStorage.setItem('password', password);
localStorage.setItem('apiKey', apiKey);
```

## Backend Responsibilities

### 1. Authentication & Authorization

**What Backend Does:**
- Issues JWT tokens (Cognito)
- Validates JWT tokens (AppSync)
- Enforces user permissions
- Manages user sessions
- Handles password resets

**Example:**
```yaml
# ✅ CORRECT: Backend validates auth
GraphQLApi:
  Type: AWS::AppSync::GraphQLApi
  Properties:
    AuthenticationType: AMAZON_COGNITO_USER_POOLS
    UserPoolConfig:
      UserPoolId: !Ref CognitoUserPool
      DefaultAction: ALLOW # Backend enforces auth
```

### 2. Business Logic

**What Backend Does:**
- Implements all business rules
- Validates data for security
- Calculates derived values
- Enforces constraints
- Manages workflows

**Example:**
```yaml
# ✅ CORRECT: Backend implements business logic
CreateBusinessResolver:
  RequestMappingTemplate: |
    {
      "version": "2017-02-28",
      "operation": "PutItem",
      "key": {
        "businessId": $util.dynamodb.toDynamoDBJson($ctx.args.input.businessId)
      },
      "attributeValues": {
        "name": $util.dynamodb.toDynamoDBJson($ctx.args.input.name),
        "category": $util.dynamodb.toDynamoDBJson($ctx.args.input.category),
        "createdAt": $util.dynamodb.toDynamoDBJson($util.time.nowISO8601())
      }
    }
```

### 3. Data Persistence

**What Backend Does:**
- All database operations
- Data integrity enforcement
- Transaction management
- Data backup and recovery

**Example:**
```yaml
# ✅ CORRECT: Backend manages data
BusinessTable:
  Type: AWS::DynamoDB::Table
  Properties:
    TableName: !Sub aws-camp-minority-businesses-${Environment}
    BillingMode: PAY_PER_REQUEST
    AttributeDefinitions:
      - AttributeName: businessId
        AttributeType: S
    KeySchema:
      - AttributeName: businessId
        KeyType: HASH
```

### 4. API Contract

**What Backend Does:**
- Defines GraphQL schema
- Specifies data types
- Documents API operations
- Enforces schema validation

**Example:**
```graphql
# ✅ CORRECT: Backend defines API contract
type Business {
  businessId: ID!
  name: String!
  category: String!
  description: String
}

type Query {
  listBusinesses: [Business]
  getBusiness(businessId: ID!): Business
}

type Mutation {
  createBusiness(input: CreateBusinessInput!): Business
}
```

### 5. What Backend Does NOT Do

```yaml
# ❌ WRONG: Backend should NOT render UI
# Backend only returns data, not HTML

# ❌ WRONG: Backend should NOT manage client state
# No session storage of UI preferences

# ❌ WRONG: Backend should NOT handle routing
# Client-side routing is frontend responsibility
```

## Communication Protocol

### Frontend → Backend

**GraphQL Queries (Read Operations)**
```typescript
// Frontend sends:
{
  query: `
    query ListBusinesses {
      listBusinesses {
        businessId
        name
        category
      }
    }
  `
}

// Backend responds:
{
  data: {
    listBusinesses: [
      { businessId: "1", name: "Business A", category: "Tech" }
    ]
  }
}
```

**GraphQL Mutations (Write Operations)**
```typescript
// Frontend sends:
{
  query: `
    mutation CreateBusiness($input: CreateBusinessInput!) {
      createBusiness(input: $input) {
        businessId
        name
      }
    }
  `,
  variables: {
    input: {
      businessId: "business-123",
      name: "New Business",
      category: "Technology"
    }
  }
}

// Backend responds:
{
  data: {
    createBusiness: {
      businessId: "business-123",
      name: "New Business"
    }
  }
}
```

### Authentication Flow

```
Frontend                    Backend (Cognito)
   │                              │
   │  1. signUp(username, email)  │
   ├─────────────────────────────>│
   │                              │
   │  2. Confirmation code sent   │
   │<─────────────────────────────┤
   │                              │
   │  3. confirmSignUp(code)      │
   ├─────────────────────────────>│
   │                              │
   │  4. Account confirmed        │
   │<─────────────────────────────┤
   │                              │
   │  5. signIn(username, pass)   │
   ├─────────────────────────────>│
   │                              │
   │  6. JWT tokens issued        │
   │<─────────────────────────────┤
   │                              │
   │  7. Store tokens (Amplify)   │
   │                              │
```

### Data Flow

```
Frontend                    Backend (AppSync)         Backend (DynamoDB)
   │                              │                           │
   │  1. GraphQL Query + JWT      │                           │
   ├─────────────────────────────>│                           │
   │                              │                           │
   │                              │  2. Validate JWT          │
   │                              │  (with Cognito)           │
   │                              │                           │
   │                              │  3. Execute Resolver      │
   │                              │                           │
   │                              │  4. DynamoDB Scan         │
   │                              ├──────────────────────────>│
   │                              │                           │
   │                              │  5. Return Items          │
   │                              │<──────────────────────────┤
   │                              │                           │
   │  6. JSON Response            │                           │
   │<─────────────────────────────┤                           │
   │                              │                           │
   │  7. Cache & Display          │                           │
   │                              │                           │
```

## Security Boundaries

### Frontend Security
- **What Frontend Protects:**
  - UI state
  - User preferences
  - Cached data (non-sensitive)
  
- **What Frontend Does NOT Protect:**
  - Sensitive data (passwords, API keys)
  - Business logic
  - Authorization rules

### Backend Security
- **What Backend Protects:**
  - User credentials
  - Business data
  - API access
  - Authorization rules
  - Data integrity

### Trust Model

```
Frontend: UNTRUSTED
  ↓
  All requests validated
  ↓
Backend: TRUSTED
  ↓
  Enforces all security
```

**Key Principle:** Never trust the frontend. Always validate and authorize on the backend.

## Data Validation

### Frontend Validation (UX)
```typescript
// ✅ Frontend validates for user experience
const validateBusinessName = (name: string) => {
  if (name.length < 3) {
    return "Name must be at least 3 characters";
  }
  return null;
};
```

### Backend Validation (Security)
```yaml
# ✅ Backend validates for security
CreateBusinessResolver:
  RequestMappingTemplate: |
    #if($ctx.args.input.name.length() < 3)
      $util.error("Name must be at least 3 characters")
    #end
    #if(!$ctx.identity.username)
      $util.unauthorized()
    #end
```

**Both layers validate, but for different reasons:**
- Frontend: Fast feedback, better UX
- Backend: Security, data integrity

## Error Handling

### Frontend Error Handling
```typescript
// ✅ Frontend handles errors for UX
try {
  await createBusiness.mutateAsync(data);
  toast.success('Business created!');
} catch (error: any) {
  toast.error(error.message || 'Failed to create business');
  // Log to error tracking service
}
```

### Backend Error Handling
```yaml
# ✅ Backend returns structured errors
ResponseMappingTemplate: |
  #if($ctx.error)
    $util.error($ctx.error.message, $ctx.error.type)
  #end
  $util.toJson($ctx.result)
```

## Testing Boundaries

### Frontend Tests
- Component rendering
- User interactions
- Routing
- State management
- API client logic (mocked)

### Backend Tests
- API schema validation
- Resolver logic
- Database operations
- Authorization rules
- Error handling

### Integration Tests
- End-to-end user flows
- Frontend + Backend together
- Authentication flows
- Data persistence

## Deployment Independence

### Frontend Deployment
- Can be deployed independently
- Static files to CDN
- No backend changes required
- Fast rollback possible

### Backend Deployment
- Can be deployed independently
- CloudFormation stack update
- No frontend changes required
- Versioned API (future)

### Benefits
- Faster deployments
- Reduced risk
- Team independence
- Easier rollbacks

## Best Practices

### DO ✅

1. **Frontend:**
   - Use TypeScript for type safety
   - Validate inputs for UX
   - Cache API responses
   - Handle errors gracefully
   - Keep components small
   - Use React Query for server state

2. **Backend:**
   - Validate all inputs
   - Enforce authorization
   - Use IAM roles properly
   - Log all operations
   - Return structured errors
   - Version your API

### DON'T ❌

1. **Frontend:**
   - Don't implement business logic
   - Don't store sensitive data
   - Don't make authorization decisions
   - Don't directly access databases
   - Don't trust user input

2. **Backend:**
   - Don't render UI
   - Don't manage client state
   - Don't handle routing
   - Don't trust frontend validation
   - Don't expose internal errors

## Summary

| Aspect | Frontend | Backend |
|--------|----------|---------|
| **Primary Role** | User Interface | Business Logic & Data |
| **Trust Level** | Untrusted | Trusted |
| **Validation** | UX (optional) | Security (required) |
| **State** | UI & Cache | Persistent Data |
| **Security** | Display only | Enforcement |
| **Deployment** | CDN/Static | AWS Services |
| **Language** | TypeScript/React | CloudFormation/GraphQL |
| **Testing** | Component/E2E | Integration/Unit |

## Related Documentation

- [Architecture](./architecture.md) - Overall system architecture
- [Authentication](./authentication.md) - Auth implementation
- [Business Directory](./business-directory.md) - Feature details
