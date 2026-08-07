import { CostCalculator } from './cost-calculator.service';

describe('CostCalculator', () => {
  let calculator: CostCalculator;

  beforeEach(() => {
    calculator = new CostCalculator();
  });

  it('should calculate accurate token costs', () => {
    const cost = calculator.calculateCost(1000, 2000, 0.0015, 0.002);
    // (1000/1000 * 0.0015) + (2000/1000 * 0.002) = 0.0015 + 0.004 = 0.0055
    expect(cost).toBe(0.0055);
  });
});
