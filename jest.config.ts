export { };
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    ".(ts|tsx)": "ts-jest"
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
