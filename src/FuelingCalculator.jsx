import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faBoltLightning, faBolt, faCookie } from "@fortawesome/free-solid-svg-icons";

import "./FuelingCalculator.css";

/**
 * brand: Brand name,
 * name: product name,
 * carbs: Carbohydrates (in grams)
 * calories: Calories in one serving
 * serving: Serving size (in grams)
 */
const snacks = [
  { brand: "Junkless ", name: "Chocolate Chip", carbs: 21, calories: 130, serving: 31, type: "food" },
  { brand: "Cliff Bar", name: "White Chocolate Macadamia Nut", carbs: 42, calories: 260, serving: 68, type: "food" },
  { brand: "SIS", name: "GO Isotonic Gel", carbs: 22, calories: 87, serving: 60, type: "gel" },
  { brand: "Larabar", name: "Lemon Bar", carbs: 24, calories: 200, serving: 45, type: "food" },
  { brand: "Honey Stinger", name: "Organic Waffle", carbs: 27, calories: 150, serving: 28, type: "food" },
  { brand: "GU", name: "Energy Gel", carbs: 23, calories: 100, serving: 32, type: "gel" },
  { brand: "Cliff Shot", name: "Bloks", carbs: 23, calories: 100, serving: 36, type: "chew" },
  { brand: "PowerBar", name: "PowerGel", carbs: 25, calories: 100, serving: 32, type: "gel" },
  { brand: "Honey Stinger", name: "Organic Energy Chews", carbs: 24, calories: 100, serving: 40, type: "chew" },
  { brand: "SIS", name: "GO Energy Bar", carbs: 35, calories: 150, serving: 45, type: "food" },
  { brand: "Cliff Bar", name: "Energy Gel", carbs: 24, calories: 100, serving: 32, type: "gel" },
  { brand: "GU", name: "Chomps", carbs: 22, calories: 90, serving: 30, type: "chew" },
  { brand: "PowerBar", name: "PowerBar Protein Plus", carbs: 20, calories: 250, serving: 65, type: "food" },
  { brand: "Honey Stinger", name: "Organic Energy Bar", carbs: 26, calories: 210, serving: 45, type: "food" },
  { brand: "SIS", name: "GO Hydro", carbs: 18, calories: 72, serving: 500, type: "drink" },
  { brand: "Tailwind", name: "Endurance Fuel", carbs: 28, calories: 100, serving: 500, type: "drink" },
  { brand: "GU", name: "Energy Drink Mix", carbs: 22, calories: 80, serving: 500, type: "drink" },
  { brand: "Cliff Bar", name: "Electrolyte Drink Mix", carbs: 24, calories: 90, serving: 500, type: "drink" },
  { brand: "Nuun", name: "Sport Electrolyte Tablets", carbs: 7, calories: 25, serving: 500, type: "drink" },
  { brand: "Precision Fuel & Hydration", name: "PF 30 Gel", carbs: 30, calories: 120, serving: 32, type: "gel" },
  { brand: "Precision Fuel & Hydration", name: "PF 20 Chews", carbs: 20, calories: 80, serving: 30, type: "chew" },
  { brand: "Precision Fuel & Hydration", name: "PF 10 Bar", carbs: 40, calories: 150, serving: 45, type: "food" },
  { brand: "Precision Fuel & Hydration", name: "PH 1000", carbs: 30, calories: 120, serving: 500, type: "drink" },
  {
    brand: "Precision Fuel & Hydration",
    name: "60g Carb & Electrolyte Drink Mix",
    carbs: 30,
    calories: 120,
    serving: 2,
    type: "drink",
  },
];

// for time (in minutes), calculate snacks per bucket using greedy algorithm
const calculateSnacks = (time, totalCalories, frequency) => {
  const buckets = Math.ceil(time / (frequency || 1));
  const bucketCals = Math.round(totalCalories / buckets);

  // Categorize snacks by type
  const foodItems = snacks.filter((s) => ["food", "gel", "chew"].includes(s.type));
  const drinkItems = snacks.filter((s) => s.type === "drink");

  // Sort by calorie efficiency (calories per gram) for better selection
  const sortedFood = [...foodItems].sort((a, b) => b.calories / b.serving - a.calories / a.serving);
  const sortedDrinks = [...drinkItems].sort((a, b) => b.calories / b.serving - a.calories / a.serving);

  let items = [];

  for (let i = 0; i < buckets; i++) {
    let bucketItems = [];
    let remainingCals = bucketCals;

    // Strategy: Mix of solid food and drinks
    // Aim for 60-70% calories from solid food, 30-40% from drinks
    const targetFoodCals = Math.round(bucketCals * 0.65);
    const targetDrinkCals = bucketCals - targetFoodCals;

    // Fill with solid food items first (greedy approach)
    let foodCals = 0;
    while (foodCals < targetFoodCals && remainingCals > 0) {
      // Find the best fitting food item
      const bestFood = sortedFood.find(
        (food) => food.calories <= remainingCals && foodCals + food.calories <= targetFoodCals + 50 // Allow some overage
      );

      if (bestFood) {
        bucketItems.push(bestFood);
        foodCals += bestFood.calories;
        remainingCals -= bestFood.calories;
      } else {
        // If no exact fit, take the smallest available food item
        const smallestFood = sortedFood.reduce((prev, curr) => (curr.calories < prev.calories ? curr : prev));
        if (smallestFood && remainingCals >= smallestFood.calories * 0.5) {
          bucketItems.push(smallestFood);
          foodCals += smallestFood.calories;
          remainingCals -= smallestFood.calories;
        }
        break;
      }
    }

    // Fill remaining calories with drinks
    let drinkCals = 0;
    while (remainingCals > 20 && drinkCals < targetDrinkCals + 50) {
      const bestDrink = sortedDrinks.find(
        (drink) => drink.calories <= remainingCals + 30 // Allow some overage for drinks
      );

      if (bestDrink) {
        bucketItems.push(bestDrink);
        drinkCals += bestDrink.calories;
        remainingCals -= bestDrink.calories;
      } else {
        break;
      }
    }

    // If we're still short on calories, add the most efficient remaining items
    while (remainingCals > 30 && bucketItems.length < 5) {
      const allRemaining = [...sortedFood, ...sortedDrinks];
      const bestFit = allRemaining.find((item) => item.calories <= remainingCals + 20);

      if (bestFit) {
        bucketItems.push(bestFit);
        remainingCals -= bestFit.calories;
      } else {
        break;
      }
    }

    items.push({
      bucket: i,
      requiredCalories: bucketCals,
      calories: bucketItems.reduce((acc, obj) => acc + obj.calories, 0),
      carbs: bucketItems.reduce((acc, obj) => acc + obj.carbs, 0),
      items: bucketItems,
    });
  }

  return items;
};

function FuelItem({ brand, name, carbs, calories }) {
  return (
    <div className="cell">
      <div className="card fuel-card">
        <div className="card-content">
          <p className="title is-size-4 has-text-weight-semibold">{brand}</p>
          <p className="subtitle has-text-weight-light">{name}</p>
        </div>
        <footer className="card-footer">
          <p className="card-footer-item m-0">
            <span>{calories} calories</span>
          </p>
          <p className="card-footer-item m-0">
            <span>{carbs}g carbs</span>
          </p>
        </footer>
      </div>
    </div>
  );
}

function FuelList(items) {
  const fuelItems = items.items.map((obj, i) => (
    <FuelItem key={"item-" + i} brand={obj.brand} name={obj.name} carbs={obj.carbs} calories={obj.calories} />
  ));
  return (
    <div className="fixed-grid has-2-cols">
      <div className="grid">{fuelItems}</div>
    </div>
  );
}

function FuelingCalculator() {
  const [requiredCalories, setRequiredCalories] = useState(0);
  const [time, setTime] = useState(0);
  const [frequency, setFrequency] = useState(60);

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    let minutes = parseInt(formData.get("ridetime").split(":")[0]) * 60;
    minutes = minutes + parseInt(formData.get("ridetime").split(":")[1]);
    setTime(minutes);

    // assume kj == calorie
    setRequiredCalories(parseInt(formData.get("totalwork")));

    // Set fueling frequency
    setFrequency(parseInt(formData.get("frequency")));
  }

  function handleReset(event) {
    event.preventDefault();
    setRequiredCalories(0);
    setTime(0);
    setFrequency(0);
  }

  const allSnacks = calculateSnacks(time, requiredCalories, frequency);
  const totalCarbs = allSnacks.reduce((acc, obj) => acc + obj.carbs, 0);
  const totalCals = allSnacks.reduce((acc, obj) => acc + obj.calories, 0);

  const outputTags =
    requiredCalories > 0 ? (
      <div className="field is-grouped is-grouped-multiline is-pulled-right">
        <div className="control">
          <div className="tags has-addons">
            <span className="tag is-large is-warning">{totalCals}</span>
            <span className="tag is-large is-dark">calories</span>
          </div>
        </div>
        <div className="control">
          <div className="tags has-addons">
            <span className="tag is-large is-info">{totalCarbs}</span>
            <span className="tag is-large is-dark">g</span>
          </div>
        </div>
      </div>
    ) : (
      ""
    );

  const food = allSnacks.map((item) => {
    return (
      <div key={`feed-${item.bucket}`}>
        <h3 className="is-size-4 has-text-weight-light mt-5">
          <span className="icon-text has-text-success">
            <span className="icon is-small is-left">
              <FontAwesomeIcon icon={faCookie} />
            </span>
            <span>&nbsp; Feed {item.bucket + 1}</span>
          </span>
          <div className="field is-grouped is-grouped-multiline is-pulled-right">
            <div className="control">
              <div className="tags has-addons">
                <span className="tag is-warning">{item.calories}</span>
                <span className="tag is-dark">calories</span>
              </div>
            </div>
            <div className="control">
              <div className="tags has-addons">
                <span className="tag is-info">{item.carbs}</span>
                <span className="tag is-dark">g carbs</span>
              </div>
            </div>
          </div>
        </h3>

        <FuelList items={[...item.items]} />
        <hr />
      </div>
    );
  });

  return (
    <>
      <h1>
        <span className="icon">🪫</span>
        <span> Fueling Calculator! </span>
        <span className="icon">🔋</span>
      </h1>
      <p className="subtitle">Counting the Calroies &amp; Carbs for you.</p>
      <div className="columns">
        <div className="column">
          <form action="#" onSubmit={handleSubmit}>
            <div className="field has-addons">
              <div className="control has-icons-left">
                <input
                  className="input"
                  type="text"
                  name="ridetime"
                  placeholder="Total ride time"
                  title="Total ride time"
                />
                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faClock} />
                </span>
              </div>
              <div className="control">
                <a className="button is-static">in hh:mm</a>
              </div>
            </div>
            <div className="field has-addons">
              <div className="control has-icons-left">
                <input
                  className="input"
                  type="text"
                  name="totalwork"
                  placeholder="Expected total work"
                  title="Expected total work"
                />
                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faBoltLightning} />
                </span>
              </div>
              <div className="control">
                <a className="button is-static">in kJ</a>
              </div>
            </div>
            <div className="field has-addons">
              <div className="control has-icons-left">
                <input
                  className="input"
                  type="text"
                  name="frequency"
                  placeholder="Fueling Frequency"
                  title="Fueling Frequency"
                />
                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faCookie} />
                </span>
              </div>
              <div className="control">
                <a className="button is-static">in minutes</a>
              </div>
            </div>
            <div className="field is-grouped">
              <p className="control">
                <button type="submit" className="button is-danger">
                  <span className="icon">
                    <FontAwesomeIcon icon={faBolt} />
                  </span>
                  <span>Fuel Me!</span>
                </button>
              </p>
              <p className="control">
                <button className="button is-dark" onClick={handleReset}>
                  Reset
                </button>
              </p>
            </div>
          </form>
        </div>
        <div className="column">
          {time > 0 && (
            <h2 className="is-clearfix">
              ⚡ {time} total minutes.
              {outputTags}
            </h2>
          )}
          {!time && <h2>👈 Enter details for Fueling!</h2>}
          <hr />
          <div>{food}</div>
        </div>
      </div>
    </>
  );
}

export default FuelingCalculator;
