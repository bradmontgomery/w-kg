/**
 * In the sport of cycling, riders' power numbers are
 * often "normalized" by dividing their power by their
 * weight in kg --> watts per kg.
 *  
 * This app is a calculator that shows the power you'd 
 * need to fit in common watts per kg "buckets"
 */

import { useState } from 'react';

function convertWeight(lbs) {
    // convert from lbs to kg & return the result.
    const weight = Math.abs(parseInt(lbs)) || 0;
    return Math.round(weight * 0.45);
}

// TODO: Still need to tweak the layout with the new bulma.  
function WattsPerKg() {
    const [lbs, setLbs] = useState(0);
    const kg = convertWeight(lbs);  
    const targets = renderTargets(kg);

    function renderTargets(kg) {
        // W = w/kg * kg
        const targetGroups = [
          [
            {name: "2 W/Kg", value: Math.round(kg * 2), state: "info"},
            {name: "2.5 W/Kg", value: Math.round(kg * 2.5), state: "info"},
            {name: "3 W/Kg", value: Math.round(kg * 3), state: "success"},
            {name: "3.5 W/Kg", value: Math.round(kg * 3.5), state: "success"},
            {name: "4 W/Kg", value: Math.round(kg * 4), state: "warning"},
          ],
          [
            {name: "4.5 W/Kg", value: Math.round(kg * 4.5), state: "warning"},
            {name: "5 W/Kg", value: Math.round(kg * 5), state: "warning"},
            {name: "6 W/Kg", value: Math.round(kg * 6), state: "danger"},
            {name: "7 W/Kg", value: Math.round(kg * 7), state: "danger"},
            {name: "8 W/Kg", value: Math.round(kg * 8), state: "danger"}
          ]
        ];
        return (
          <div>
            {targetGroups.map((targets, g) => (
              <div className="tile is-ancestor" key={g}>
                {targets.map((target, i) => (
                  <div key={i * (g+1)} className="tile is-parent">
                    <article className={"tile is-child has-text-centered notification is-" + target.state}>
                      <p className="subtitle">{target.name}</p>
                      <p className="title">{target.value}</p>
                    </article>
                  </div>
                ))}
              </div>
            ))}
          </div>
        );
      }
      
    return (
    <>
        <h1>
            <span class="icon">
                <i class="fa-solid fa-bullseye"></i>
            </span>
            <span>w/kg targets</span>  
        </h1>
        <div class="notification is-primary has-text-black">
            <span class="icon">
                <i class="fa-solid fa-bolt"></i>
            </span>
            <span><em>Question: </em> How much power do I need to produce to hit a 
                <abbr title="watts per kilogram">w/kg</abbr> target?</span>
        </div>
        <div>
            <div className="box">
            <div className="field">
                <p className="control help">Enter your weight in lbs to get started</p>
                <div className="field has-addons">
                <p className="control">
                    <input className="input"
                    type="text"
                    placeholder="Your weight"
                    value={lbs}
                    onChange={(e) => setLbs(parseInt(e.target.value) || 0)} />
                </p>
                <p className="control">
                    <a className="button is-static">
                    lbs
                    </a>
                </p>
                </div>
            </div>
            <fieldset disabled>
                <div className="field has-addons">
                    <p className="control">
                    <input className="input" type="text" value={kg} readOnly={true} />
                    </p>
                    <p className="control">
                    <a className="button is-static">
                        kg
                    </a>
                    </p>
                </div>
                </fieldset>
            </div>
            <div>{targets}</div>
        </div>
      </>
    );
  }

export default WattsPerKg;