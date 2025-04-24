import {
    Link,
    Outlet
} from 'react-router';

function Root() {

    return (
        <>
            <nav className="navbar" role="navigation">
                <div className="navbar-brand">
                    <Link className="navbar-item" to={'wpkg'}>🚲</Link>
                </div>
                <div className="navbar-menu">
                    <div className="navbar-start">
                        <Link className="navbar-item" to={'wpkg'}>w/kg</Link>
                        <Link className="navbar-item" to={'fueling'}>fueling calculator</Link>
                    </div>
                </div>
            </nav>
            <section class="section">
                <div class="container">
                    <div className="content">
                        <Outlet />
                    </div>
                </div>
            </section>
        </>
    );
}

export default Root;