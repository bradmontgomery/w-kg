import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import ErrorBoundary from "../ErrorBoundary.jsx";

// Mock useRouteError hook
const mockUseRouteError = vi.fn();
const mockIsRouteErrorResponse = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useRouteError: () => mockUseRouteError(),
    isRouteErrorResponse: (error) => mockIsRouteErrorResponse(error),
  };
});

describe("ErrorBoundary Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders unknown error when error is not recognized", () => {
    mockUseRouteError.mockReturnValue(null);
    mockIsRouteErrorResponse.mockReturnValue(false);

    render(<ErrorBoundary />);

    expect(screen.getByText("Unknown Error")).toBeInTheDocument();
    expect(document.querySelector(".notification.is-warning")).toBeInTheDocument();
  });

  it("renders route error response correctly", () => {
    const routeError = {
      status: 404,
      statusText: "Not Found",
      data: "Page not found",
    };

    mockUseRouteError.mockReturnValue(routeError);
    mockIsRouteErrorResponse.mockReturnValue(true);

    render(<ErrorBoundary />);

    expect(screen.getByText("404 Not Found")).toBeInTheDocument();
    expect(screen.getByText("Page not found")).toBeInTheDocument();
  });

  it("renders generic Error instance correctly", () => {
    const error = new Error("Something went wrong");

    mockUseRouteError.mockReturnValue(error);
    mockIsRouteErrorResponse.mockReturnValue(false);

    render(<ErrorBoundary />);

    expect(screen.getByText("Errors")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("has correct CSS classes and structure", () => {
    mockUseRouteError.mockReturnValue(new Error("Test error"));
    mockIsRouteErrorResponse.mockReturnValue(false);

    render(<ErrorBoundary />);

    const section = document.querySelector("section.section");
    expect(section).toBeInTheDocument();

    const container = document.querySelector(".container");
    expect(container).toBeInTheDocument();

    const notification = document.querySelector(".notification.is-warning");
    expect(notification).toBeInTheDocument();

    const title = document.querySelector(".title");
    expect(title).toBeInTheDocument();
  });

  it("handles different error status codes", () => {
    const routeError = {
      status: 500,
      statusText: "Internal Server Error",
      data: "Server error occurred",
    };

    mockUseRouteError.mockReturnValue(routeError);
    mockIsRouteErrorResponse.mockReturnValue(true);

    render(<ErrorBoundary />);

    expect(screen.getByText("500 Internal Server Error")).toBeInTheDocument();
    expect(screen.getByText("Server error occurred")).toBeInTheDocument();
  });

  it("handles route error without data", () => {
    const routeError = {
      status: 403,
      statusText: "Forbidden",
    };

    mockUseRouteError.mockReturnValue(routeError);
    mockIsRouteErrorResponse.mockReturnValue(true);

    render(<ErrorBoundary />);

    expect(screen.getByText("403 Forbidden")).toBeInTheDocument();
  });

  it("maintains consistent layout structure", () => {
    mockUseRouteError.mockReturnValue(null);
    mockIsRouteErrorResponse.mockReturnValue(false);

    render(<ErrorBoundary />);

    // Check that the error is wrapped in the same section/container structure
    const section = document.querySelector("section.section");
    const container = section?.querySelector(".container");
    const notification = container?.querySelector(".notification");

    expect(section).toBeInTheDocument();
    expect(container).toBeInTheDocument();
    expect(notification).toBeInTheDocument();
  });
});
