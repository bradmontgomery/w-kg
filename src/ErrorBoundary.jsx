import {
    isRouteErrorResponse,
    useRouteError 
  } from 'react-router';


function ErrorBoundary() {
    const error = useRouteError();
    if(isRouteErrorResponse(error)) {
      return (
        <div className="notification is-warning">
          <h1>{error.status} {error.statusText}</h1>
          <p>{error.data}</p>
        </div>
      );
    } else if (error instanceof Error) {
      return (
        <div className="notification is-warning">
          <h1>Errors</h1>
          <p>{error.message}</p>
        </div>
      )
    } else {
      return (
        <div className="notification is-warning">
          <h1>Unknown Error</h1>
        </div>
      );
    }
}

export default ErrorBoundary;