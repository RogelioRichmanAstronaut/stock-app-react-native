import { formatPrice, formatPercentageChange, getChangeColor } from '../stockUtils';

describe('Stock Utility Functions', () => {
  describe('formatPrice', () => {
    it('formats positive prices correctly', () => {
      expect(formatPrice(1234.56)).toBe('$1,234.56');
      expect(formatPrice(0.99)).toBe('$0.99');
      expect(formatPrice(1000000)).toBe('$1,000,000.00');
    });

    it('formats negative prices correctly', () => {
      expect(formatPrice(-1234.56)).toBe('-$1,234.56');
      expect(formatPrice(-0.99)).toBe('-$0.99');
    });

    it('handles zero correctly', () => {
      expect(formatPrice(0)).toBe('$0.00');
    });
  });

  describe('formatPercentageChange', () => {
    it('formats positive changes correctly', () => {
      expect(formatPercentageChange(5.678)).toBe('+5.68%');
      expect(formatPercentageChange(0.1)).toBe('+0.10%');
    });

    it('formats negative changes correctly', () => {
      expect(formatPercentageChange(-5.678)).toBe('-5.68%');
      expect(formatPercentageChange(-0.1)).toBe('-0.10%');
    });

    it('handles zero correctly', () => {
      expect(formatPercentageChange(0)).toBe('0.00%');
    });
  });

  describe('getChangeColor', () => {
    it('returns green for positive changes', () => {
      expect(getChangeColor(0.01)).toBe('#4CAF50');
      expect(getChangeColor(5.5)).toBe('#4CAF50');
    });

    it('returns red for negative changes', () => {
      expect(getChangeColor(-0.01)).toBe('#F44336');
      expect(getChangeColor(-5.5)).toBe('#F44336');
    });

    it('returns grey for zero change', () => {
      expect(getChangeColor(0)).toBe('#9E9E9E');
    });
  });
});
