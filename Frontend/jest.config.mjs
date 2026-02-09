export default {
  transform: {
    '^.+\\.jsx?$': 'babel-jest' // Transform JS and JSX files using babel-jest
  },
  transformIgnorePatterns: [
    '/node_modules/(?!react-syntax-highlighter)/' // Allow react-syntax-highlighter to be transformed by Babel
  ],
  testEnvironment: 'jest-environment-jsdom' // Use jsdom environment
};
