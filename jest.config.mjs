/** @type {import('ts-jest').JestConfigWithTsJest} * */
export default {
  testEnvironment: 'node',
  transform: {
    '^.+\.tsx?$': ['ts-jest', {}],
  },
  testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['utils.ts'],
};
