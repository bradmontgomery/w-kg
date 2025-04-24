import { isRouteErrorResponse, useRouteError } from "react-router";

function ErrorBoundary() {
  const error = useRouteError();
  let content = (
    <div className="notification is-warning">
      <h1 className="title">Unknown Error</h1>
    </div>
  );
  if (isRouteErrorResponse(error)) {
    content = (
      <div className="notification is-warning">
        <h1 className="title">
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    content = (
      <div className="notification is-warning">
        <h1 className="title">Errors</h1>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <section className="section">
      <div className="container">{content}</div>
    </section>
  );
}

export default ErrorBoundary;
