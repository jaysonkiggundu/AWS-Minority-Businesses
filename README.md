# AWS CAMP for Minority Businesses

A modern React application for discovering and supporting minority-owned businesses, built with Vite, TypeScript, AWS Cognito, AppSync, and DynamoDB.

## Getting Started

### Prerequisites

Make sure you have Node.js installed on your machine. You can install it using [nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

### Installation

1. Clone the repository:
```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_DIRECTORY>
```

2. Install dependencies:
```sh
npm install
```

3. Start the development server:
```sh
npm run dev
```

The application will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run build:dev` - Build the project in development mode
- `npm run lint` - Run ESLint
- `npm run preview` - Preview the production build

## Tech Stack

This project is built with:

- **Vite** - Fast build tool and development server
- **React 18** - UI library
- **TypeScript** - Type safety
- **AWS Cognito** - Authentication and user management
- **AWS AppSync** - GraphQL API
- **AWS DynamoDB** - NoSQL database
- **AWS Amplify** - AWS SDK integration
- **shadcn/ui** - Modern UI components
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Query (@tanstack/react-query)** - Data fetching and caching
- **React Hook Form** - Form handling
- **Zod** - Schema validation

## Features

- **Business Directory** - Browse and search minority-owned businesses
- **Advanced Filtering** - Filter by category, region, diversity tags, and ratings
- **Authentication** - Secure sign up and login with AWS Cognito
- **Add Businesses** - Authenticated users can add new businesses
- **Real-time Data** - Connected to DynamoDB via AppSync GraphQL API
- **Responsive Design** - Mobile-friendly interface

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_COGNITO_USER_POOL_ID=your-user-pool-id
VITE_COGNITO_USER_POOL_CLIENT_ID=your-client-id
VITE_AWS_REGION=us-east-1
VITE_GRAPHQL_API_URL=your-graphql-api-url
```

Get these values from your CloudFormation stack outputs. See [docs/authentication.md](./docs/authentication.md) for detailed setup instructions.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Page components
├── App.tsx             # Main app component
├── main.tsx            # App entry point
└── index.css           # Global styles
```

## Deployment

Build the project for production:

```sh
npm run build
```

The built files will be in the `dist` directory, ready to be deployed to any static hosting service.
