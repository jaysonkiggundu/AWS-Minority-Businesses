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

export async function graphqlRequest<T>(
  request: GraphQLRequest
): Promise<T> {
  try {
    // Get auth token
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();

    if (!token) {
      throw new Error('No authentication token available');
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: GraphQLResponse<T> = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    if (!result.data) {
      throw new Error('No data returned from GraphQL API');
    }

    return result.data;
  } catch (error) {
    console.error('GraphQL request error:', error);
    throw error;
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
