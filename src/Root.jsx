import { Link, Outlet } from "react-router";

function Root() {
  return (
    <>
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <Link className="navbar-item has-text-danger is-size-3 has-text-weight-bold" to={""}>
            🚲 Cycling Stuff!
          </Link>
        </div>
        <div className="navbar-menu">
          <div className="navbar-start">
            <Link className="navbar-item" to={""}>
              w/kg
            </Link>
            <Link className="navbar-item" to={"fueling"}>
              fueling calculator
            </Link>
          </div>
        </div>
      </nav>
      <section className="section">
        <div className="container">
          <div className="content">
            <Outlet />
          </div>
        </div>
      </section>
    </>
  );
}

export default Root;
