import { fetchAuthSession } from 'aws-amplify/auth';

const GRAPHQL_API_URL = import.meta.env.VITE_GRAPHQL_API_URL;

interface GraphQLRequest {
  query: string;
  variables?: Record<string, any>;
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

class GraphQLRequestError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'GraphQLRequestError';
  }
}

export async function graphqlRequest<T>(
  request: GraphQLRequest
): Promise<T> {
  try {
    if (!request || typeof request !== 'object' || typeof request.query !== 'string') {
      throw new GraphQLRequestError('Invalid GraphQL request object');
    }

    // Get auth token
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();

    if (!token) {
      throw new GraphQLRequestError('No authentication token available');
    }

    const response = await fetch(GRAPHQL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new GraphQLRequestError(`HTTP error! status: ${response.status}`, { status: response.status, statusText: response.statusText });
    }

    let result: GraphQLResponse<T>;
    try {
      result = await response.json();
    } catch (jsonError) {
      throw new GraphQLRequestError('Failed to parse GraphQL response as JSON', jsonError);
    }

    if (result.errors && result.errors.length > 0) {
      throw new GraphQLRequestError(result.errors[0].message, result.errors);
    }

    if (!result.data) {
      throw new GraphQLRequestError('No data returned from GraphQL API', result);
    }

    return result.data;
  } catch (error) {
    if (!(error instanceof GraphQLRequestError)) {
      console.error('Unexpected GraphQL request error:', error);
      throw new GraphQLRequestError('Unexpected error during GraphQL request', error);
    } else {
      console.error('GraphQL request error:', error);
      throw error;
    }
  }
}

// GraphQL Queries
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