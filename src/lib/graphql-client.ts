import { fetchAuthSession } from 'aws-amplify/auth';
import { logger } from './logger';

interface GraphQLRequest {
  query: string;
  variables?: Record<string, any>;
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string; path?: string[] }>;
}

/**
 * GraphQL client with authentication and observability.
 * Logs all API calls for monitoring (QR-4).
 */
export async function graphqlRequest<T>(request: GraphQLRequest): Promise<T> {
  const startTime = performance.now();
  const endpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT;

  try {
    logger.debug('GraphQL Request', {
      endpoint,
      query: request.query.substring(0, 100) + '...',
      variables: request.variables,
    });

    // Get auth token
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();

    if (!token) {
      logger.warn('GraphQL request without authentication token');
    }

    // Make request
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: token }),
      },
      body: JSON.stringify(request),
    });

    const duration = performance.now() - startTime;

    if (!response.ok) {
      logger.error('GraphQL HTTP error', new Error(`HTTP ${response.status}`), {
        status: response.status,
        statusText: response.statusText,
        duration,
      });
      throw new Error(`GraphQL request failed: ${response.statusText}`);
    }

    const json: GraphQLResponse<T> = await response.json();

    // Log API call metrics
    logger.logApiCall(endpoint, 'POST', duration, response.status);

    if (json.errors) {
      logger.error('GraphQL errors', new Error(json.errors[0].message), {
        errors: json.errors,
        duration,
      });
      throw new Error(json.errors[0].message);
    }

    if (!json.data) {
      logger.error('GraphQL no data', new Error('No data in response'), { duration });
      throw new Error('No data returned from GraphQL');
    }

    logger.debug('GraphQL Response', {
      duration,
      dataKeys: Object.keys(json.data),
    });

    return json.data;
  } catch (error) {
    const duration = performance.now() - startTime;
    logger.error('GraphQL request failed', error as Error, {
      endpoint,
      duration,
      query: request.query.substring(0, 100),
    });
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
