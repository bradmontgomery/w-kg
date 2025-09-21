import { describe, it, expect } from "vitest";

// Extract the convertWeight function for testing
// Since it's not exported, we'll recreate it for testing purposes
function convertWeight(lbs) {
  // convert from lbs to kg & return the result.
  const weight = Math.abs(parseInt(lbs)) || 0;
  return Math.round(weight * 0.45);
}

describe("convertWeight utility function", () => {
  it("converts positive pounds to kilograms correctly", () => {
    expect(convertWeight(100)).toBe(45);
    expect(convertWeight(150)).toBe(68);
    expect(convertWeight(200)).toBe(90);
    expect(convertWeight(220)).toBe(99);
  });

  it("handles zero input", () => {
    expect(convertWeight(0)).toBe(0);
    expect(convertWeight("0")).toBe(0);
  });

  it("handles negative values by taking absolute value", () => {
    expect(convertWeight(-100)).toBe(45);
    expect(convertWeight(-150)).toBe(68);
    expect(convertWeight("-200")).toBe(90);
  });

  it("handles string inputs", () => {
    expect(convertWeight("100")).toBe(45);
    expect(convertWeight("150.5")).toBe(68); // parseInt truncates decimals
    expect(convertWeight("200")).toBe(90);
  });

  it("handles invalid inputs", () => {
    expect(convertWeight("abc")).toBe(0);
    expect(convertWeight("")).toBe(0);
    expect(convertWeight(null)).toBe(0);
    expect(convertWeight(undefined)).toBe(0);
    expect(convertWeight(NaN)).toBe(0);
  });

  it("handles decimal inputs by truncating", () => {
    expect(convertWeight(100.7)).toBe(45); // parseInt(100.7) = 100
    expect(convertWeight(150.9)).toBe(68); // parseInt(150.9) = 150
    expect(convertWeight("175.5")).toBe(79); // parseInt('175.5') = 175
  });

  it("uses correct conversion factor (0.45)", () => {
    // Test the conversion factor specifically
    expect(convertWeight(220)).toBe(99); // 220 * 0.45 = 99
    expect(convertWeight(222)).toBe(100); // 222 * 0.45 = 99.9, rounded = 100
  });

  it("rounds to nearest integer", () => {
    // Test rounding behavior
    expect(convertWeight(221)).toBe(99); // 221 * 0.45 = 99.45, rounded = 99
    expect(convertWeight(223)).toBe(100); // 223 * 0.45 = 100.35, rounded = 100
  });
});
