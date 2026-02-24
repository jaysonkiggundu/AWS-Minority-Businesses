import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { graphqlRequest, LIST_BUSINESSES_QUERY, CREATE_BUSINESS_MUTATION } from '@/lib/graphql-client';
import { Business } from '@/types/business';

interface ListBusinessesResponse {
  listBusinesses: Array<{
    businessId: string;
    name: string;
    category: string;
    description: string;
  }>;
}

interface CreateBusinessInput {
  businessId: string;
  name: string;
  category: string;
  description?: string;
}

interface CreateBusinessResponse {
  createBusiness: {
    businessId: string;
    name: string;
    category: string;
    description: string;
  };
}

// Convert API business to frontend Business type
function mapApiBusinessToFrontend(apiBusiness: any): Business {
  return {
    id: apiBusiness.businessId,
    name: apiBusiness.name,
    description: apiBusiness.description || '',
    category: apiBusiness.category,
    location: {
      city: 'N/A', // TODO: Add to schema
      state: 'N/A',
    },
    contact: {},
    diversity: [], // TODO: Add to schema
    rating: 0, // TODO: Add to schema
    reviewCount: 0, // TODO: Add to schema
    verified: false, // TODO: Add to schema
  };
}

export function useBusinesses() {
  return useQuery({
    queryKey: ['businesses'],
    queryFn: async () => {
      const response = await graphqlRequest<ListBusinessesResponse>({
        query: LIST_BUSINESSES_QUERY,
      });
      
      // Map API response to frontend Business type
      return response.listBusinesses.map(mapApiBusinessToFrontend);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateBusinessInput) => {
      const response = await graphqlRequest<CreateBusinessResponse>({
        query: CREATE_BUSINESS_MUTATION,
        variables: { input },
      });
      return mapApiBusinessToFrontend(response.createBusiness);
    },
    onSuccess: () => {
      // Invalidate and refetch businesses list
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
    },
  });
}
