import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faBoltLightning, faBolt } from "@fortawesome/free-solid-svg-icons";

const BUCKETSIZE = 30; // feed periods in minutes...

/**
 * brand: Brand name,
 * name: product name,
 * carbs: Carbohydrates (in grams)
 * calories: Calories in one serving
 * serving: Serving size (in grams)
 */
const snacks = [
  { brand: "Junkless ", name: "Chocolate Chip", carbs: 21, calories: 130, serving: 31 },
  { brand: "Cliff Bar", name: "White Chocolate Macadamia Nut", carbs: 42, calories: 260, serving: 68 },
  { brand: "SIS", name: "GO Isotonic Gel", carbs: 22, calories: 87, serving: 60 },
  { brand: "Larabar", name: "Lemon Bar", carbs: 24, calories: 200, serving: 45 },
];

// for time (in minutes), caclulate snacks per bucket
const calculateSnacks = (time, totalCalories) => {
  const buckets = time / BUCKETSIZE;
  const bucketCals = Math.round(totalCalories / buckets, 2);
  let items = [];
  for (let i = 0; i < buckets; i++) {
    let _items = [];
    let _itemCals = 0;
    while (_itemCals <= bucketCals) {
      const obj = snacks[Math.floor(Math.random() * snacks.length)];
      _itemCals += obj.calories;
      _items.push(obj);
    }

    items.push({
      bucket: i,
      requiredCalories: bucketCals,
      calories: _items.reduce((accumulator, obj) => accumulator + obj.calories, 0),
      carbs: _items.reduce((accumulator, obj) => accumulator + obj.carbs, 0),
      items: _items,
    });
  }
  return items;
};

function FuelItem({ brand, name, carbs, calories }) {
  return (
    <li>
      {brand} / {name} / {carbs}g carbs / {calories}kcals
    </li>
  );
}

function FuelList(items) {
  const fuelItems = items.items.map((obj, i) => (
    <FuelItem key={"item-" + i} brand={obj.brand} name={obj.name} carbs={obj.carbs} calories={obj.calories} />
  ));
  return <ul>{fuelItems}</ul>;
}

function FuelingCalculator() {
  const [requiredCalories, setRequiredCalories] = useState(0);
  const [time, setTime] = useState(0);

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    let minutes = parseInt(formData.get("ridetime").split(":")[0]) * 60;
    minutes = minutes + parseInt(formData.get("ridetime").split(":")[1]);
    setTime(minutes);

    // assume kj == calorie
    setRequiredCalories(parseInt(formData.get("totalwork")));
  }

  function handleReset(event) {
    event.preventDefault();
    setRequiredCalories(0);
    setTime(0);
  }

  const allSnacks = calculateSnacks(time, requiredCalories);
  const totalCarbs = allSnacks.reduce((acc, obj) => acc + obj.carbs, 0);
  const totalCals = allSnacks.reduce((acc, obj) => acc + obj.calories, 0);

  const outputTags =
    requiredCalories > 0 ? (
      <div className="field is-grouped is-grouped-multiline">
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
      <div>
        <p className="is-size-4 has-text-weight-light">Feed {item.bucket + 1}</p>
        <div className="field is-grouped is-grouped-multiline">
          <div className="control">
            <div className="tags has-addons">
              <span className="tag">{item.calories}</span>
              <span className="tag is-dark">calories</span>
            </div>
          </div>
          <div className="control">
            <div className="tags has-addons">
              <span className="tag">{item.carbs}</span>
              <span className="tag is-dark">g carbs</span>
            </div>
          </div>
        </div>

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
                  defaultValue={time}
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
                  defaultValue={totalCals}
                />
                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faBoltLightning} />
                </span>
              </div>
              <div className="control">
                <a className="button is-static">in kJ</a>
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
          {time > 0 && <h2>For {time} total minutes...</h2>}
          {outputTags}
          <div>{food}</div>
        </div>
      </div>
    </>
  );
}

export default FuelingCalculator;
