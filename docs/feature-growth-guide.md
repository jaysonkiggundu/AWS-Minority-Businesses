# Incremental Feature Growth

## Overview

AWS CAMP is designed to support incremental feature growth without requiring major architectural changes. This document outlines the strategy, patterns, and guidelines for adding new features safely and efficiently.

## Design Principles

### 1. Modular Architecture
- Features are self-contained modules
- Minimal dependencies between features
- Clear interfaces and contracts
- Easy to add, modify, or remove

### 2. Backward Compatibility
- New features don't break existing ones
- API changes are additive, not destructive
- Graceful degradation for missing features
- Version management strategy

### 3. Progressive Enhancement
- Core functionality works for all users
- Advanced features enhance experience
- Fallbacks for unsupported features
- Mobile-first, desktop-enhanced

### 4. Scalable Infrastructure
- Serverless architecture scales automatically
- No capacity planning needed
- Pay-per-use pricing model
- Regional expansion ready

## Feature Addition Patterns

### Pattern 1: New Page/Route

**Example:** Adding a Business Detail Page

**Step 1: Create Page Component**
```typescript
// src/pages/BusinessDetail.tsx
import { useParams } from 'react-router-dom';
import { useBusiness } from '@/hooks/useBusinesses';

const BusinessDetail = () => {
  const { businessId } = useParams();
  const { data: business, isLoading } = useBusiness(businessId!);

  if (isLoading) return <div>Loading...</div>;
  if (!business) return <div>Business not found</div>;

  return (
    <div>
      <h1>{business.name}</h1>
      {/* Business details */}
    </div>
  );
};

export default BusinessDetail;
```

**Step 2: Add Route**
```typescript
// src/App.tsx
<Route path="/business/:businessId" element={<BusinessDetail />} />
```

**Step 3: Link from Existing Pages**
```typescript
// src/components/BusinessCard.tsx
<Link to={`/business/${business.id}`}>View Details</Link>
```

**Impact:** ✅ Zero impact on existing features

---

### Pattern 2: New API Endpoint

**Example:** Adding Business Reviews

**Step 1: Update GraphQL Schema**
```yaml
# infrastructure/backend.yaml
GraphQLSchema:
  Definition: |
    type Review {
      reviewId: ID!
      businessId: ID!
      userId: ID!
      rating: Int!
      comment: String
      createdAt: String!
    }
    
    type Query {
      listBusinesses: [Business]
      getBusiness(businessId: ID!): Business
      # NEW: Get reviews for a business
      getBusinessReviews(businessId: ID!): [Review]
    }
    
    type Mutation {
      createBusiness(input: CreateBusinessInput!): Business
      # NEW: Create a review
      createReview(input: CreateReviewInput!): Review
    }
```

**Step 2: Create DynamoDB Table**
```yaml
ReviewTable:
  Type: AWS::DynamoDB::Table
  Properties:
    TableName: !Sub aws-camp-reviews-${Environment}
    BillingMode: PAY_PER_REQUEST
    AttributeDefinitions:
      - AttributeName: reviewId
        AttributeType: S
      - AttributeName: businessId
        AttributeType: S
    KeySchema:
      - AttributeName: reviewId
        KeyType: HASH
    GlobalSecondaryIndexes:
      - IndexName: BusinessIdIndex
        KeySchema:
          - AttributeName: businessId
            KeyType: HASH
        Projection:
          ProjectionType: ALL
```

**Step 3: Add Resolvers**
```yaml
GetBusinessReviewsResolver:
  Type: AWS::AppSync::Resolver
  Properties:
    ApiId: !GetAtt GraphQLApi.ApiId
    TypeName: Query
    FieldName: getBusinessReviews
    DataSourceName: !GetAtt ReviewDataSource.Name
    RequestMappingTemplate: |
      {
        "version": "2017-02-28",
        "operation": "Query",
        "index": "BusinessIdIndex",
        "query": {
          "expression": "businessId = :businessId",
          "expressionValues": {
            ":businessId": $util.dynamodb.toDynamoDBJson($ctx.args.businessId)
          }
        }
      }
    ResponseMappingTemplate: |
      $util.toJson($ctx.result.items)
```

**Step 4: Frontend Hook**
```typescript
// src/hooks/useReviews.ts
export function useBusinessReviews(businessId: string) {
  return useQuery({
    queryKey: ['reviews', businessId],
    queryFn: async () => {
      const response = await graphqlRequest<GetBusinessReviewsResponse>({
        query: GET_BUSINESS_REVIEWS_QUERY,
        variables: { businessId },
      });
      return response.getBusinessReviews;
    },
    enabled: !!businessId,
  });
}
```

**Step 5: UI Component**
```typescript
// src/components/BusinessReviews.tsx
export function BusinessReviews({ businessId }: { businessId: string }) {
  const { data: reviews, isLoading } = useBusinessReviews(businessId);

  if (isLoading) return <Skeleton />;
  if (!reviews?.length) return <div>No reviews yet</div>;

  return (
    <div>
      {reviews.map(review => (
        <ReviewCard key={review.reviewId} review={review} />
      ))}
    </div>
  );
}
```

**Impact:** ✅ Existing features continue to work, new feature is optional

---

### Pattern 3: Extending Existing Types

**Example:** Adding Location Data to Business

**Step 1: Update Schema (Additive)**
```yaml
type Business {
  businessId: ID!
  name: String!
  category: String!
  description: String
  # NEW FIELDS (Optional)
  city: String
  state: String
  address: String
  website: String
  phone: String
}
```

**Step 2: Update Frontend Types**
```typescript
// src/types/business.ts
export interface ApiBusiness {
  businessId: string;
  name: string;
  category: string;
  description?: string;
  // NEW FIELDS
  city?: string;
  state?: string;
  address?: string;
  website?: string;
  phone?: string;
}
```

**Step 3: Update Queries (Backward Compatible)**
```typescript
// Old queries still work
query ListBusinesses {
  listBusinesses {
    businessId
    name
    category
  }
}

// New queries can request new fields
query ListBusinessesWithLocation {
  listBusinesses {
    businessId
    name
    category
    city
    state
  }
}
```

**Step 4: Update UI (Progressive Enhancement)**
```typescript
// src/components/BusinessCard.tsx
export function BusinessCard({ business }: BusinessCardProps) {
  return (
    <Card>
      <h3>{business.name}</h3>
      <p>{business.category}</p>
      
      {/* NEW: Show location if available */}
      {business.city && business.state && (
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-2" />
          {business.city}, {business.state}
        </div>
      )}
      
      {/* NEW: Show website if available */}
      {business.website && (
        <a href={business.website} target="_blank">
          Visit Website
        </a>
      )}
    </Card>
  );
}
```

**Impact:** ✅ Old data still displays, new data enhances experience

---

### Pattern 4: New Feature Flag

**Example:** Beta Features

**Step 1: Create Feature Flag System**
```typescript
// src/lib/feature-flags.ts
export const FEATURE_FLAGS = {
  REVIEWS: import.meta.env.VITE_FEATURE_REVIEWS === 'true',
  MESSAGING: import.meta.env.VITE_FEATURE_MESSAGING === 'true',
  ANALYTICS: import.meta.env.VITE_FEATURE_ANALYTICS === 'true',
} as const;

export function useFeatureFlag(flag: keyof typeof FEATURE_FLAGS) {
  return FEATURE_FLAGS[flag];
}
```

**Step 2: Conditional Rendering**
```typescript
// src/pages/BusinessDetail.tsx
import { useFeatureFlag } from '@/lib/feature-flags';

export function BusinessDetail() {
  const reviewsEnabled = useFeatureFlag('REVIEWS');

  return (
    <div>
      <BusinessInfo />
      
      {/* Only show if feature is enabled */}
      {reviewsEnabled && <BusinessReviews businessId={businessId} />}
    </div>
  );
}
```

**Step 3: Environment Configuration**
```env
# .env.development
VITE_FEATURE_REVIEWS=true
VITE_FEATURE_MESSAGING=false

# .env.production
VITE_FEATURE_REVIEWS=true
VITE_FEATURE_MESSAGING=true
```

**Impact:** ✅ Features can be toggled without code changes

---

## Feature Roadmap

### Phase 1: Foundation (✅ Complete)
- [x] User authentication (Cognito)
- [x] Business directory (Browse)
- [x] Business filtering
- [x] Add business functionality
- [x] Dark mode
- [x] Responsive design

### Phase 2: Enhanced Discovery (Next)
- [ ] Business detail pages
- [ ] Advanced search (Elasticsearch)
- [ ] Business categories/tags
- [ ] Map view integration
- [ ] Save/favorite businesses
- [ ] Share functionality

### Phase 3: Social Features
- [ ] User reviews and ratings
- [ ] Business owner responses
- [ ] Photo uploads (S3)
- [ ] User profiles
- [ ] Follow businesses
- [ ] Activity feed

### Phase 4: Business Tools
- [ ] Business dashboard
- [ ] Analytics and insights
- [ ] Customer messaging
- [ ] Appointment booking
- [ ] Payment integration
- [ ] Inventory management

### Phase 5: Marketplace
- [ ] Product listings
- [ ] Shopping cart
- [ ] Checkout flow
- [ ] Order management
- [ ] Shipping integration
- [ ] Seller tools

### Phase 6: Community
- [ ] Forums/discussions
- [ ] Events calendar
- [ ] Networking features
- [ ] Mentorship matching
- [ ] Resource library
- [ ] Success stories

## Adding a New Feature: Step-by-Step

### 1. Planning Phase

**Questions to Answer:**
- What problem does this solve?
- Who is the target user?
- What are the requirements?
- What are the dependencies?
- What is the MVP scope?
- What can be added later?

**Documentation:**
- Create feature spec document
- Define user stories
- Design mockups/wireframes
- Define API contracts
- Identify risks

### 2. Backend Implementation

**Infrastructure (CloudFormation):**
```yaml
# Add new resources
NewFeatureTable:
  Type: AWS::DynamoDB::Table
  Properties:
    TableName: !Sub aws-camp-feature-${Environment}
    # ... configuration

# Add new resolvers
NewFeatureResolver:
  Type: AWS::AppSync::Resolver
  Properties:
    # ... configuration
```

**Deploy:**
```bash
aws cloudformation deploy \
  --template-file infrastructure/backend.yaml \
  --stack-name aws-camp-minority-businesses-dev \
  --parameter-overrides Environment=dev \
  --capabilities CAPABILITY_NAMED_IAM
```

**Verify:**
- Test in AppSync console
- Check CloudWatch logs
- Verify DynamoDB tables

### 3. Frontend Implementation

**Types:**
```typescript
// src/types/feature.ts
export interface NewFeature {
  id: string;
  // ... fields
}
```

**API Client:**
```typescript
// src/lib/graphql-client.ts
export const NEW_FEATURE_QUERY = `
  query GetFeature($id: ID!) {
    getFeature(id: $id) {
      id
      # ... fields
    }
  }
`;
```

**Hooks:**
```typescript
// src/hooks/useFeature.ts
export function useFeature(id: string) {
  return useQuery({
    queryKey: ['feature', id],
    queryFn: async () => {
      const response = await graphqlRequest<GetFeatureResponse>({
        query: NEW_FEATURE_QUERY,
        variables: { id },
      });
      return response.getFeature;
    },
  });
}
```

**Components:**
```typescript
// src/components/FeatureComponent.tsx
export function FeatureComponent() {
  const { data, isLoading } = useFeature(id);
  
  if (isLoading) return <Skeleton />;
  
  return <div>{/* Feature UI */}</div>;
}
```

**Pages:**
```typescript
// src/pages/FeaturePage.tsx
export default function FeaturePage() {
  return (
    <div>
      <Navigation />
      <FeatureComponent />
    </div>
  );
}
```

**Routes:**
```typescript
// src/App.tsx
<Route path="/feature" element={<FeaturePage />} />
```

### 4. Testing

**Unit Tests:**
```typescript
// tests/feature.test.ts
describe('Feature', () => {
  it('renders correctly', () => {
    render(<FeatureComponent />);
    expect(screen.getByText('Feature')).toBeInTheDocument();
  });
});
```

**Integration Tests:**
```typescript
// tests/feature-integration.test.ts
describe('Feature Integration', () => {
  it('fetches and displays data', async () => {
    render(<FeaturePage />);
    await waitFor(() => {
      expect(screen.getByText('Feature Data')).toBeInTheDocument();
    });
  });
});
```

**E2E Tests:**
```typescript
// e2e/feature.spec.ts
test('user can use feature', async ({ page }) => {
  await page.goto('/feature');
  await page.click('button[data-testid="feature-action"]');
  await expect(page.locator('.success-message')).toBeVisible();
});
```

### 5. Documentation

**Update Docs:**
- Add feature documentation to `docs/`
- Update API contracts
- Update architecture diagrams
- Add usage examples
- Update README

**Code Comments:**
```typescript
/**
 * FeatureComponent displays the new feature
 * 
 * @param {string} id - Feature identifier
 * @returns {JSX.Element} Feature UI
 * 
 * @example
 * <FeatureComponent id="feature-123" />
 */
export function FeatureComponent({ id }: { id: string }) {
  // ...
}
```

### 6. Deployment

**Development:**
```bash
# Deploy backend
aws cloudformation deploy ...

# Deploy frontend
npm run build
# Deploy to hosting platform
```

**Production:**
```bash
# Deploy backend to prod stack
aws cloudformation deploy \
  --stack-name aws-camp-minority-businesses-prod \
  --parameter-overrides Environment=prod

# Deploy frontend to production
npm run build
# Deploy to production hosting
```

### 7. Monitoring

**CloudWatch Metrics:**
- API request count
- Error rate
- Latency
- DynamoDB metrics

**User Analytics:**
- Feature usage
- User engagement
- Conversion rates
- Error tracking

## Deprecation Strategy

### Deprecating a Feature

**Step 1: Mark as Deprecated**
```typescript
/**
 * @deprecated Use NewFeature instead
 * This feature will be removed in v2.0
 */
export function OldFeature() {
  console.warn('OldFeature is deprecated. Use NewFeature instead.');
  // ... implementation
}
```

**Step 2: Add Migration Guide**
```markdown
# Migration Guide: OldFeature → NewFeature

## What's Changing
OldFeature is being replaced by NewFeature.

## Timeline
- v1.5: OldFeature marked as deprecated
- v1.8: Warning messages added
- v2.0: OldFeature removed

## How to Migrate
Replace:
```typescript
<OldFeature />
```

With:
```typescript
<NewFeature />
```
```

**Step 3: Monitor Usage**
- Track deprecated feature usage
- Notify users of deprecation
- Provide migration support

**Step 4: Remove Feature**
- After sufficient time (3-6 months)
- Remove code
- Update documentation
- Deploy new version

## Best Practices

### DO ✅

1. **Start Small**
   - Build MVP first
   - Add features incrementally
   - Get user feedback early

2. **Maintain Backward Compatibility**
   - Don't break existing features
   - Add, don't remove
   - Deprecate gracefully

3. **Use Feature Flags**
   - Test in production safely
   - Gradual rollout
   - Easy rollback

4. **Document Everything**
   - API contracts
   - Usage examples
   - Migration guides

5. **Test Thoroughly**
   - Unit tests
   - Integration tests
   - E2E tests

6. **Monitor Performance**
   - Track metrics
   - Set up alerts
   - Optimize bottlenecks

### DON'T ❌

1. **Don't Build Everything at Once**
   - Avoid big bang releases
   - Incremental is safer

2. **Don't Break Existing Features**
   - Test backward compatibility
   - Maintain API contracts

3. **Don't Skip Documentation**
   - Future you will thank you
   - Team members need it

4. **Don't Ignore Technical Debt**
   - Refactor as you go
   - Don't let it accumulate

5. **Don't Deploy Without Testing**
   - Always test in dev first
   - Use staging environment

## Scaling Considerations

### Horizontal Scaling
- **Frontend:** CDN distribution
- **Backend:** Serverless auto-scales
- **Database:** DynamoDB on-demand

### Vertical Scaling
- **Not needed** with serverless architecture
- AWS manages capacity automatically

### Regional Expansion
```yaml
# Add new region
Parameters:
  Region:
    Type: String
    Default: us-east-1
    AllowedValues:
      - us-east-1
      - us-west-2
      - eu-west-1
```

### Multi-Tenancy
- Separate stacks per environment
- Shared infrastructure for cost optimization
- Isolated data per tenant

## Related Documentation

- [Architecture](./architecture.md) - System architecture
- [API Contracts](./api-contracts.md) - API definitions
- [Separation of Concerns](./separation-of-concerns.md) - Boundaries
- [Authentication](./authentication.md) - Auth implementation
