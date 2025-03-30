

// Import the function to be tested
describe('renderTitle() renderTitle method', () => {
  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should capitalize the first letter of each word and replace underscores with spaces', () => {
      const input = 'hello_world';
      const expectedOutput = 'Hello World';
      expect(renderTitle(input)).toBe(expectedOutput);
    });

    it('should handle single word input correctly', () => {
      const input = 'typescript';
      const expectedOutput = 'Typescript';
      expect(renderTitle(input)).toBe(expectedOutput);
    });

    it('should handle multiple underscores correctly', () => {
      const input = 'this_is_a_test';
      const expectedOutput = 'This Is A Test';
      expect(renderTitle(input)).toBe(expectedOutput);
    });

    it('should handle already capitalized words correctly', () => {
      const input = 'Already_Capitalized';
      const expectedOutput = 'Already Capitalized';
      expect(renderTitle(input)).toBe(expectedOutput);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should return an empty string when input is an empty string', () => {
      const input = '';
      const expectedOutput = '';
      expect(renderTitle(input)).toBe(expectedOutput);
    });

    it('should handle input with leading and trailing underscores', () => {
      const input = '_leading_and_trailing_';
      const expectedOutput = ' Leading And Trailing ';
      expect(renderTitle(input)).toBe(expectedOutput);
    });

    it('should handle input with consecutive underscores', () => {
      const input = 'consecutive__underscores';
      const expectedOutput = 'Consecutive  Underscores';
      expect(renderTitle(input)).toBe(expectedOutput);
    });

    it('should handle input with numbers and special characters', () => {
      const input = 'test_123_with_numbers_and_special_chars_!@#';
      const expectedOutput = 'Test 123 With Numbers And Special Chars !@#';
      expect(renderTitle(input)).toBe(expectedOutput);
    });

    it('should handle input with mixed case', () => {
      const input = 'mIxEd_CaSe';
      const expectedOutput = 'Mixed Case';
      expect(renderTitle(input)).toBe(expectedOutput);
    });
  });
});