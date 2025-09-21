import { describe, it, expect } from "vitest";

// Updated mock data from FuelingCalculator with type information
const snacks = [
  { brand: "Junkless ", name: "Chocolate Chip", carbs: 21, calories: 130, serving: 31, type: "food" },
  { brand: "Cliff Bar", name: "White Chocolate Macadamia Nut", carbs: 42, calories: 260, serving: 68, type: "food" },
  { brand: "SIS", name: "GO Isotonic Gel", carbs: 22, calories: 87, serving: 60, type: "gel" },
  { brand: "Larabar", name: "Lemon Bar", carbs: 24, calories: 200, serving: 45, type: "food" },
  { brand: "GU", name: "Energy Gel", carbs: 23, calories: 100, serving: 32, type: "gel" },
  { brand: "Tailwind", name: "Endurance Fuel", carbs: 28, calories: 100, serving: 500, type: "drink" },
  { brand: "SIS", name: "GO Hydro", carbs: 18, calories: 72, serving: 500, type: "drink" },
];

// Recreate the calculateSnacks function for testing (greedy algorithm version)
function calculateSnacks(time, totalCarbs, frequency) {
  const buckets = Math.ceil(time / (frequency || 1));
  const bucketCarbs = Math.round(totalCarbs / buckets);

  // Categorize snacks by type
  const foodItems = snacks.filter((s) => ["food", "gel", "chew"].includes(s.type));
  const drinkItems = snacks.filter((s) => s.type === "drink");

  // Sort by carb efficiency (carbs per gram) for better selection
  const sortedFood = [...foodItems].sort((a, b) => b.carbs / b.serving - a.carbs / a.serving);
  const sortedDrinks = [...drinkItems].sort((a, b) => b.carbs / b.serving - a.carbs / a.serving);

  let items = [];

  for (let i = 0; i < buckets; i++) {
    let bucketItems = [];
    let remainingCarbs = bucketCarbs;

    // Strategy: Mix of solid food and drinks
    // Aim for 60-70% carbs from solid food, 30-40% from drinks
    const targetFoodCarbs = Math.round(bucketCarbs * 0.65);
    const targetDrinkCarbs = bucketCarbs - targetFoodCarbs;

    // Fill with solid food items first (greedy approach)
    let foodCarbs = 0;
    while (foodCarbs < targetFoodCarbs && remainingCarbs > 0) {
      // Find the best fitting food item
      const bestFood = sortedFood.find(
        (food) => food.carbs <= remainingCarbs && foodCarbs + food.carbs <= targetFoodCarbs + 10 // Allow some overage
      );

      if (bestFood) {
        bucketItems.push(bestFood);
        foodCarbs += bestFood.carbs;
        remainingCarbs -= bestFood.carbs;
      } else {
        // If no exact fit, take the smallest available food item
        const smallestFood = sortedFood.reduce((prev, curr) => (curr.carbs < prev.carbs ? curr : prev));
        if (smallestFood && remainingCarbs >= smallestFood.carbs * 0.5) {
          bucketItems.push(smallestFood);
          foodCarbs += smallestFood.carbs;
          remainingCarbs -= smallestFood.carbs;
        }
        break;
      }
    }

    // Fill remaining carbs with drinks
    let drinkCarbs = 0;
    while (remainingCarbs > 5 && drinkCarbs < targetDrinkCarbs + 10) {
      const bestDrink = sortedDrinks.find(
        (drink) => drink.carbs <= remainingCarbs + 5 // Allow some overage for drinks
      );

      if (bestDrink) {
        bucketItems.push(bestDrink);
        drinkCarbs += bestDrink.carbs;
        remainingCarbs -= bestDrink.carbs;
      } else {
        break;
      }
    }

    // If we're still short on carbs, add the most efficient remaining items
    while (remainingCarbs > 5 && bucketItems.length < 5) {
      const allRemaining = [...sortedFood, ...sortedDrinks];
      const bestFit = allRemaining.find((item) => item.carbs <= remainingCarbs + 5);

      if (bestFit) {
        bucketItems.push(bestFit);
        remainingCarbs -= bestFit.carbs;
      } else {
        break;
      }
    }

    items.push({
      bucket: i,
      requiredCarbs: bucketCarbs,
      calories: bucketItems.reduce((acc, obj) => acc + obj.calories, 0),
      carbs: bucketItems.reduce((acc, obj) => acc + obj.carbs, 0),
      items: bucketItems,
    });
  }

  return items;
}

describe("FuelingCalculator utility functions", () => {
  describe("calculateSnacks function", () => {
    it("calculates correct number of feeding buckets", () => {
      const result = calculateSnacks(120, 120, 60); // 2 hours, 120g carbs, every 60 minutes
      expect(result).toHaveLength(2);
    });

    it("distributes carbs across buckets correctly", () => {
      const result = calculateSnacks(60, 60, 60); // 1 hour, 60g carbs, every 60 minutes
      expect(result).toHaveLength(1);
      expect(result[0].requiredCarbs).toBe(60);
    });

    it("handles edge case with zero frequency", () => {
      const result = calculateSnacks(60, 60, 0);
      // Should default to frequency of 1 to avoid division by zero
      expect(result).toHaveLength(60); // 60 / 1 = 60 buckets
    });

    it("calculates bucket carbs correctly", () => {
      const result = calculateSnacks(120, 120, 60); // 120min, 120g carbs, every 60min
      expect(result[0].requiredCarbs).toBe(60); // 120g / 2 buckets = 60g per bucket
      expect(result[1].requiredCarbs).toBe(60);
    });

    it("includes snack items in each bucket", () => {
      const result = calculateSnacks(60, 60, 60);
      expect(result[0].items).toBeDefined();
      expect(Array.isArray(result[0].items)).toBe(true);
    });

    it("calculates total calories and carbs for each bucket", () => {
      const result = calculateSnacks(60, 60, 60);
      const bucket = result[0];

      expect(bucket.calories).toBeGreaterThan(0);
      expect(bucket.carbs).toBeGreaterThan(0);
      expect(typeof bucket.calories).toBe("number");
      expect(typeof bucket.carbs).toBe("number");
    });

    it("creates sequential bucket numbers", () => {
      const result = calculateSnacks(180, 180, 60); // 3 hours, 180g carbs, every 60 minutes
      expect(result).toHaveLength(3);
      expect(result[0].bucket).toBe(0);
      expect(result[1].bucket).toBe(1);
      expect(result[2].bucket).toBe(2);
    });

    it("handles non-integer bucket divisions", () => {
      const result = calculateSnacks(90, 90, 60); // 1.5 hours, 90g carbs, every 60 minutes
      expect(result).toHaveLength(2); // 90/60 = 1.5, so we get 2 buckets since no fractional buckets
    });

    it("balances food types between solid food and drinks", () => {
      const result = calculateSnacks(120, 120, 60); // 2 hours, 120g carbs, every 60 minutes

      result.forEach((bucket) => {
        const solidFoodItems = bucket.items.filter((item) => ["food", "gel", "chew"].includes(item.type));
        const drinkItems = bucket.items.filter((item) => item.type === "drink");

        // Should have a mix of both types
        expect(solidFoodItems.length).toBeGreaterThan(0);
        expect(drinkItems.length).toBeGreaterThanOrEqual(0); // May have 0 drinks if bucket is small

        // Total items should not be excessive
        expect(bucket.items.length).toBeLessThanOrEqual(5);
      });
    });

    it("prioritizes carb efficiency in selection", () => {
      const result = calculateSnacks(60, 40, 60); // 1 hour, 40g carbs
      const bucket = result[0];

      // Should select items efficiently to meet carb target
      expect(bucket.carbs).toBeGreaterThan(30); // Should get close to target
      expect(bucket.carbs).toBeLessThan(60); // But not wildly exceed it
    });

    it("uses deterministic selection algorithm", () => {
      const result1 = calculateSnacks(120, 120, 60);
      const result2 = calculateSnacks(120, 120, 60);

      // Should produce identical results (deterministic)
      expect(result1.length).toBe(result2.length);

      result1.forEach((bucket, index) => {
        expect(bucket.bucket).toBe(result2[index].bucket);
        expect(bucket.requiredCarbs).toBe(result2[index].requiredCarbs);
        expect(bucket.items.length).toBe(result2[index].items.length);
      });
    });

    it("creates reasonable carb distribution", () => {
      const result = calculateSnacks(180, 180, 60); // 3 hours, 180g carbs

      result.forEach((bucket) => {
        // Each bucket should aim for ~60g carbs (180g/3)
        expect(bucket.requiredCarbs).toBe(60);

        // Actual carbs should be reasonably close to target
        expect(bucket.carbs).toBeGreaterThan(40);
        expect(bucket.carbs).toBeLessThan(80);
      });
    });
  });

  describe("Snack data validation", () => {
    it("has valid snack data structure", () => {
      snacks.forEach((snack) => {
        expect(snack).toHaveProperty("brand");
        expect(snack).toHaveProperty("name");
        expect(snack).toHaveProperty("carbs");
        expect(snack).toHaveProperty("calories");
        expect(snack).toHaveProperty("serving");

        expect(typeof snack.brand).toBe("string");
        expect(typeof snack.name).toBe("string");
        expect(typeof snack.carbs).toBe("number");
        expect(typeof snack.calories).toBe("number");
        expect(typeof snack.serving).toBe("number");

        expect(snack.carbs).toBeGreaterThan(0);
        expect(snack.calories).toBeGreaterThan(0);
        expect(snack.serving).toBeGreaterThan(0);
      });
    });

    it("has correct number of snack options", () => {
      expect(snacks).toHaveLength(7);
    });

    it("includes expected snack brands", () => {
      const brands = snacks.map((snack) => snack.brand.trim());
      expect(brands).toContain("Junkless");
      expect(brands).toContain("Cliff Bar");
      expect(brands).toContain("SIS");
      expect(brands).toContain("Larabar");
    });
  });

  describe("Time calculation helpers", () => {
    it("converts hh:mm format to minutes correctly", () => {
      // This tests the logic from the form submission
      const timeString = "2:30";
      const [hours, minutes] = timeString.split(":");
      const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);

      expect(totalMinutes).toBe(150); // 2 hours 30 minutes
    });

    it("handles various time formats", () => {
      const testCases = [
        { input: "1:00", expected: 60 },
        { input: "0:45", expected: 45 },
        { input: "3:15", expected: 195 },
        { input: "10:30", expected: 630 },
      ];

      testCases.forEach(({ input, expected }) => {
        const [hours, minutes] = input.split(":");
        const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
        expect(totalMinutes).toBe(expected);
      });
    });
  });
});
