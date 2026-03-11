import { graphqlRequest } from '../lib/graphql-client';
describe('graphqlRequest error handling', () => {
  it('throws error for invalid request object', async () => {
    await expect(graphqlRequest(null as any)).rejects.toThrow();
    await expect(graphqlRequest({} as any)).rejects.toThrow();
    await expect(graphqlRequest({ query: 123 } as any)).rejects.toThrow();
  });

  // add more tests for network errors and response errors by mocking fetch and auth
});