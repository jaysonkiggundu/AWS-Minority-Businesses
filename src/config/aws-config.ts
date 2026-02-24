// AWS Amplify Configuration
// Update these values with your actual Cognito User Pool details from CloudFormation outputs

export const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || '',
      userPoolClientId: import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID || '',
      region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
    }
  }
};
