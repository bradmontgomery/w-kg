class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { lbs: 0, kg: 0};
    this.handleLbsChange = this.handleLbsChange.bind(this);
    this.renderTargets = this.renderTargets.bind(this);
  }

  handleLbsChange(e) {
    const lbs = parseInt(e.target.value);
    const kg = Math.round(lbs * 0.45);
    this.setState({ lbs: parseInt(e.target.value), kg: kg });
  }

  renderTargets() {
    // W = wkg * kg
    const targets = [
      {name: "2 W/Kg", value: Math.round(this.state.kg * 2), state: "info"},
      {name: "2.5 W/Kg", value: Math.round(this.state.kg * 2.5), state: "info"},
      {name: "3 W/Kg", value: Math.round(this.state.kg * 3), state: "success"},
      {name: "3.5 W/Kg", value: Math.round(this.state.kg * 3.5), state: "success"},
      {name: "4 W/Kg", value: Math.round(this.state.kg * 4), state: "warning"},
      {name: "4.5 W/Kg", value: Math.round(this.state.kg * 4.5), state: "warning"},
      {name: "5 W/Kg", value: Math.round(this.state.kg * 5), state: "danger"},
      {name: "6 W/Kg", value: Math.round(this.state.kg * 6), state: "danger"},
      {name: "7 W/Kg", value: Math.round(this.state.kg * 7), state: "danger"}
    ];

    return (
      <div class="tile is-ancestor">
        {targets.map(target => (
          <div class="tile is-parent">
            <article class={"tile is-child has-text-centered notification is-" + target.state}>
              <p class="subtitle">{target.name}</p>
              <p class="title">{target.value}</p>
            </article>
          </div>
        ))}
      </div>
    );
  }

  render() {

    const targets = this.renderTargets();
    return (
      <div>
        <div class="box">
          <div class="field">
            <p class="control help">Enter your weight in lbs to get started</p>
            <div class="field has-addons">
              <p class="control">
                <input class="input"
                  type="text"
                  placeholder="Your weight"
                  value={this.state.lbs}
                  onChange={this.handleLbsChange} />
              </p>
              <p class="control">
                <a class="button is-static">
                  lbs
                </a>
              </p>
            </div>
          </div>
          <fieldset disabled>
              <div class="field has-addons">
                <p class="control">
                  <input class="input" type="text" value={this.state.kg} />
                </p>
                <p class="control">
                  <a class="button is-static">
                   kg
                  </a>
                </p>
              </div>
            </fieldset>
        </div>
        <div>{targets}</div>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
