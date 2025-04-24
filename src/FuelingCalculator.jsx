import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faBoltLightning, faBolt } from "@fortawesome/free-solid-svg-icons";
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

function FuelingCalculator() {
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalCarbs, setTotalCarbs] = useState(0);
  const [time, setTime] = useState(0);

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    let minutes = parseInt(formData.get("ridetime").split(":")[0]) * 60;
    minutes = minutes + parseInt(formData.get("ridetime").split(":")[1]);
    setTime(minutes);

    // assume kj == calorie
    setTotalCalories(parseInt(formData.get("totalwork")));
  }

  function handleReset(event) {
    event.preventDefault();
    setTotalCalories(0);
    setTotalCarbs(0);
    setTime(0);
  }

  const outputTags =
    totalCalories + totalCarbs > 0 ? (
      <div className="field is-grouped is-grouped-multiline">
        <div className="control">
          <div className="tags has-addons is-large">
            <span className="tag is-warning">{totalCalories}</span>
            <span className="tag is-dark">calories</span>
          </div>
        </div>
        <div className="control">
          <div className="tags has-addons is-large">
            <span className="tag is-info">{totalCarbs}</span>
            <span className="tag is-dark">g</span>
          </div>
        </div>
      </div>
    ) : (
      ""
    );

  return (
    <>
      <h1>
        <span className="icon">🪫</span>
        <span> Fueling Calculator! </span>
        <span className="icon">🔋</span>
      </h1>
      <p className="subtitle">Counting the Calroies &amp; Carbs for you.</p>
      <div className="columns">
        <div class="column">
          <form action="#" onSubmit={handleSubmit}>
            <div className="field has-addons">
              <div className="control has-icons-left">
                <input className="input" type="text" name="ridetime" placeholder="Total ride time" />
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
                <input className="input" type="text" name="totalwork" placeholder="Expected total work" />
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
        <div class="column">
          {time && <h2>For {time} total minutes...</h2>}
          {outputTags}
        </div>
      </div>
    </>
  );
}

export default FuelingCalculator;
