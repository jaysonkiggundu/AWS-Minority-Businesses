# System Architecture

## Overview

AWS CAMP for Minority Businesses is a full-stack web application built on AWS serverless architecture, following a clear separation between frontend and backend responsibilities.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│                    (Frontend - React SPA)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Pages      │  │  Components  │  │    Hooks     │        │
│  │              │  │              │  │              │        │
│  │ - Index      │  │ - Navigation │  │ - useAuth    │        │
│  │ - Browse     │  │ - AuthModal  │  │ - useBusinesses      │
│  │ - Founders   │  │ - BusinessCard│  │ - useToast   │        │
│  │ - About      │  │ - Filters    │  │              │        │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘        │
│         │                 │                  │                 │
│         └─────────────────┼──────────────────┘                 │
│                           │                                     │
│                  ┌────────▼────────┐                           │
│                  │  State Management│                          │
│                  │                 │                           │
│                  │ - AuthContext   │                           │
│                  │ - React Query   │                           │
│                  └────────┬────────┘                           │
│                           │                                     │
│                  ┌────────▼────────┐                           │
│                  │  API Clients    │                           │
│                  │                 │                           │
│                  │ - GraphQL Client│                           │
│                  │ - AWS Amplify   │                           │
│                  └────────┬────────┘                           │
└───────────────────────────┼─────────────────────────────────────┘
                            │
                            │ HTTPS / WSS
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                         AWS CLOUD                               │
│                    (Backend - Serverless)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    AWS Cognito                           │  │
│  │                 (Authentication Layer)                   │  │
│  │                                                          │  │
│  │  ┌────────────────┐         ┌────────────────┐         │  │
│  │  │  User Pool     │         │  User Pool     │         │  │
│  │  │                │◄────────┤  Client        │         │  │
│  │  │ - Users        │         │                │         │  │
│  │  │ - Groups       │         │ - Client ID    │         │  │
│  │  │ - Attributes   │         │ - Auth Flows   │         │  │
│  │  │ - Policies     │         │ - No Secret    │         │  │
│  │  └────────┬───────┘         └────────────────┘         │  │
│  │           │                                             │  │
│  │           │ Issues JWT Tokens                           │  │
│  └───────────┼─────────────────────────────────────────────┘  │
│              │                                                 │
│              │ Validates Tokens                                │
│              │                                                 │
│  ┌───────────▼─────────────────────────────────────────────┐  │
│  │                  AWS AppSync                            │  │
│  │                 (API Gateway Layer)                     │  │
│  │                                                         │  │
│  │  ┌────────────────────────────────────────────────┐    │  │
│  │  │           GraphQL API                          │    │  │
│  │  │                                                │    │  │
│  │  │  Schema:                                       │    │  │
│  │  │  - Query: listBusinesses, getBusiness         │    │  │
│  │  │  - Mutation: createBusiness                   │    │  │
│  │  │                                                │    │  │
│  │  │  Resolvers:                                    │    │  │
│  │  │  - ListBusinessesResolver (Scan)              │    │  │
│  │  │  - GetBusinessResolver (GetItem)              │    │  │
│  │  │  - CreateBusinessResolver (PutItem)           │    │  │
│  │  └────────────────┬───────────────────────────────┘    │  │
│  └───────────────────┼─────────────────────────────────────┘  │
│                      │                                         │
│                      │ DynamoDB Operations                     │
│                      │                                         │
│  ┌───────────────────▼─────────────────────────────────────┐  │
│  │                  DynamoDB                               │  │
│  │                 (Data Layer)                            │  │
│  │                                                         │  │
│  │  ┌────────────────────────────────────────────────┐    │  │
│  │  │         BusinessTable                          │    │  │
│  │  │                                                │    │  │
│  │  │  Partition Key: businessId (String)           │    │  │
│  │  │                                                │    │  │
│  │  │  Attributes:                                   │    │  │
│  │  │  - businessId (PK)                            │    │  │
│  │  │  - name                                       │    │  │
│  │  │  - category                                   │    │  │
│  │  │  - description                                │    │  │
│  │  │                                                │    │  │
│  │  │  Billing: PAY_PER_REQUEST                     │    │  │
│  │  └────────────────────────────────────────────────┘    │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                  IAM Roles                              │  │
│  │                                                         │  │
│  │  - AppSyncDynamoDBRole                                 │  │
│  │    Permissions: GetItem, PutItem, Scan on BusinessTable│  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: 
  - React Context API (Auth)
  - TanStack React Query (Server state)
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod
- **AWS Integration**: AWS Amplify SDK

### Backend (AWS Services)
- **Authentication**: AWS Cognito
- **API**: AWS AppSync (GraphQL)
- **Database**: DynamoDB
- **Infrastructure**: CloudFormation (IaC)
- **Region**: us-east-1

## Component Architecture

### Frontend Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── Navigation.tsx  # App navigation with auth
│   ├── AuthModal.tsx   # Authentication UI
│   ├── BusinessCard.tsx # Business display card
│   ├── BusinessFilters.tsx # Filter controls
│   ├── ThemeToggle.tsx # Dark mode toggle
│   └── AWSLogo.tsx     # AWS branding
│
├── pages/              # Route components
│   ├── Index.tsx       # Landing page
│   ├── Browse.tsx      # Business directory
│   ├── Founders.tsx    # Founder resources
│   ├── About.tsx       # About page
│   ├── AddBusiness.tsx # Add business form
│   └── NotFound.tsx    # 404 page
│
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state
│
├── hooks/              # Custom React hooks
│   ├── useBusinesses.ts # Business data fetching
│   ├── use-mobile.tsx  # Mobile detection
│   └── use-toast.ts    # Toast notifications
│
├── lib/                # Utility functions
│   ├── graphql-client.ts # GraphQL API client
│   ├── businessUtils.ts  # Business logic
│   └── utils.ts        # General utilities
│
├── types/              # TypeScript types
│   └── business.ts     # Business data types
│
├── data/               # Static data
│   └── mockBusinesses.ts # Sample data
│
└── config/             # Configuration
    └── aws-config.ts   # AWS Amplify config
```

## Data Flow

### Authentication Flow

```
1. User Action (Sign In/Sign Up)
   ↓
2. AuthModal Component
   ↓
3. AuthContext (useAuth hook)
   ↓
4. AWS Amplify SDK
   ↓
5. AWS Cognito User Pool
   ↓
6. JWT Tokens Issued
   ↓
7. Tokens Stored (localStorage via Amplify)
   ↓
8. AuthContext Updates State
   ↓
9. UI Re-renders (Navigation, Protected Routes)
```

### Business Data Flow

```
1. User Visits Browse Page
   ↓
2. useBusinesses Hook Triggered
   ↓
3. React Query Checks Cache
   ↓
4. GraphQL Client (if cache miss)
   ↓
5. Fetch Auth Token from Amplify
   ↓
6. HTTP POST to AppSync GraphQL API
   ↓
7. AppSync Validates JWT Token
   ↓
8. AppSync Resolver Executes
   ↓
9. DynamoDB Scan Operation
   ↓
10. Data Returned to Frontend
    ↓
11. React Query Caches Data (5 min)
    ↓
12. Component Renders Business Cards
```

### Create Business Flow

```
1. User Clicks "Add Business" (Auth Required)
   ↓
2. Navigate to /add-business
   ↓
3. ProtectedRoute Checks Auth
   ↓
4. User Fills Form
   ↓
5. Form Submit → useCreateBusiness Hook
   ↓
6. GraphQL Mutation with Auth Token
   ↓
7. AppSync Validates Token
   ↓
8. CreateBusinessResolver Executes
   ↓
9. DynamoDB PutItem Operation
   ↓
10. Success Response
    ↓
11. React Query Invalidates Cache
    ↓
12. Browse Page Auto-Refetches
    ↓
13. User Redirected to Browse
```

## Security Architecture

### Authentication & Authorization

1. **User Authentication**
   - AWS Cognito handles all user authentication
   - Passwords never stored in frontend
   - JWT tokens with expiration
   - Automatic token refresh via Amplify

2. **API Authorization**
   - All AppSync requests require valid JWT token
   - Token included in Authorization header
   - AppSync validates token with Cognito
   - Invalid tokens rejected with 401

3. **Data Access Control**
   - IAM roles control AppSync → DynamoDB access
   - Principle of least privilege
   - No direct DynamoDB access from frontend

### Security Layers

```
Layer 1: HTTPS/TLS
  ↓ All traffic encrypted
Layer 2: Cognito Authentication
  ↓ User identity verified
Layer 3: JWT Token Validation
  ↓ Token signature & expiration checked
Layer 4: AppSync Authorization
  ↓ User pool validation
Layer 5: IAM Role Permissions
  ↓ Service-to-service authorization
Layer 6: DynamoDB Access
  ↓ Data retrieved/stored
```

## Scalability Considerations

### Frontend Scalability
- **Static Hosting**: Can be deployed to CDN (CloudFront, Vercel, Netlify)
- **Code Splitting**: Vite automatically splits code by route
- **Lazy Loading**: Components loaded on demand
- **Caching**: React Query caches API responses (5 min TTL)
- **Optimistic Updates**: UI updates before API confirmation

### Backend Scalability
- **Serverless**: Auto-scales with demand
- **DynamoDB**: On-demand billing, unlimited scale
- **AppSync**: Managed service, auto-scales
- **Cognito**: Handles millions of users
- **No Servers**: Zero infrastructure management

### Performance Optimizations
- **React Query**: Reduces redundant API calls
- **Memoization**: useMemo for expensive computations
- **Debouncing**: Search input debounced
- **Pagination**: Ready for implementation (TODO)
- **Image Optimization**: Can add CloudFront + S3 for images

## Deployment Architecture

### Development Environment
```
Developer Machine
  ↓
npm run dev (Vite Dev Server)
  ↓
localhost:5173
  ↓
AWS Dev Stack (CloudFormation)
  - Cognito User Pool (dev)
  - AppSync API (dev)
  - DynamoDB Table (dev)
```

### Production Environment
```
GitHub Repository
  ↓
CI/CD Pipeline (GitHub Actions / AWS Amplify)
  ↓
npm run build
  ↓
Static Assets (dist/)
  ↓
CDN (CloudFront / Vercel / Netlify)
  ↓
Users (HTTPS)
  ↓
AWS Prod Stack (CloudFormation)
  - Cognito User Pool (prod)
  - AppSync API (prod)
  - DynamoDB Table (prod)
```

## Infrastructure as Code

All AWS resources defined in `infrastructure/backend.yaml`:

- **Cognito User Pool**: User authentication
- **Cognito User Pool Client**: App integration
- **AppSync GraphQL API**: API gateway
- **GraphQL Schema**: API contract
- **DynamoDB Table**: Data storage
- **IAM Roles**: Service permissions
- **Resolvers**: Query/Mutation handlers

Deployed via AWS CloudFormation CLI or Console.

## Monitoring & Observability

### Available Metrics
- **CloudWatch Logs**: AppSync resolver logs
- **Cognito Metrics**: Sign-in attempts, failures
- **DynamoDB Metrics**: Read/write capacity, throttles
- **AppSync Metrics**: Request count, latency, errors

### Recommended Additions
- [ ] Frontend error tracking (Sentry)
- [ ] User analytics (Google Analytics, Mixpanel)
- [ ] Performance monitoring (Web Vitals)
- [ ] CloudWatch Dashboards
- [ ] CloudWatch Alarms for errors

## Disaster Recovery

### Data Backup
- **DynamoDB**: Point-in-time recovery (can be enabled)
- **Cognito**: User data backed up by AWS
- **Code**: Version controlled in GitHub

### Recovery Procedures
1. **Database Corruption**: Restore from DynamoDB backup
2. **Stack Deletion**: Redeploy from CloudFormation template
3. **Code Issues**: Revert to previous Git commit
4. **Region Failure**: Deploy to different AWS region

## Cost Optimization

### Current Cost Structure
- **Cognito**: Free tier (50K MAU)
- **AppSync**: $4 per million requests
- **DynamoDB**: On-demand pricing
- **CloudFormation**: Free
- **Data Transfer**: Minimal (API responses small)

### Estimated Monthly Cost (10K users)
- Cognito: $0 (within free tier)
- AppSync: $4-10
- DynamoDB: $5-20
- **Total**: ~$10-30/month

## Future Architecture Enhancements

### Planned Improvements
1. **Caching Layer**: Add Redis/ElastiCache for hot data
2. **Search**: Integrate Elasticsearch for advanced search
3. **File Storage**: Add S3 for business images/documents
4. **Email Service**: Add SES for notifications
5. **Analytics**: Add Kinesis for real-time analytics
6. **CDN**: Add CloudFront for global distribution
7. **WAF**: Add Web Application Firewall for security

### Scalability Roadmap
- **Phase 1** (Current): Serverless foundation
- **Phase 2**: Add caching and search
- **Phase 3**: Multi-region deployment
- **Phase 4**: Real-time features (WebSockets)
- **Phase 5**: Machine learning recommendations

## Compliance & Standards

### Security Standards
- HTTPS enforced
- JWT token-based auth
- Password policies enforced
- Data encrypted at rest (DynamoDB)
- Data encrypted in transit (TLS)

### Best Practices Followed
- Infrastructure as Code
- Separation of concerns
- Stateless architecture
- Immutable deployments
- Version control
- Environment separation (dev/prod)

## Related Documentation

- [Authentication](./authentication.md) - Auth implementation details
- [Business Directory](./business-directory.md) - Feature documentation
- [README](../README.md) - Getting started guide
- [CloudFormation Template](../infrastructure/backend.yaml) - Infrastructure code
