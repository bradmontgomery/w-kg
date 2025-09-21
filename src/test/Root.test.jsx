import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Root from "../Root.jsx";

describe("Root Component", () => {
  it("renders the navigation bar correctly", () => {
    render(
      <MemoryRouter>
        <Root />
      </MemoryRouter>
    );

    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByText("🚲 Cycling Stuff!")).toBeInTheDocument();
  });

  it("displays navigation links", () => {
    render(
      <MemoryRouter>
        <Root />
      </MemoryRouter>
    );

    expect(screen.getByText("w/kg")).toBeInTheDocument();
    expect(screen.getByText("fueling calculator")).toBeInTheDocument();
  });

  it("has correct navigation structure", () => {
    render(
      <MemoryRouter>
        <Root />
      </MemoryRouter>
    );

    const nav = screen.getByRole("navigation");
    expect(nav).toHaveAttribute("aria-label", "main navigation");

    const brandLink = screen.getByText("🚲 Cycling Stuff!");
    expect(brandLink.closest("a")).toHaveClass("navbar-item");
    expect(brandLink.closest("a")).toHaveClass("has-text-danger");
    expect(brandLink.closest("a")).toHaveClass("is-size-3");
    expect(brandLink.closest("a")).toHaveClass("has-text-weight-bold");
  });

  it("renders the main section container", () => {
    render(
      <MemoryRouter>
        <Root />
      </MemoryRouter>
    );

    const section = document.querySelector("section.section");
    expect(section).toBeInTheDocument();

    const container = document.querySelector(".container");
    expect(container).toBeInTheDocument();

    const content = document.querySelector(".content");
    expect(content).toBeInTheDocument();
  });

  it("has proper CSS classes for styling", () => {
    render(
      <MemoryRouter>
        <Root />
      </MemoryRouter>
    );

    const navbar = screen.getByRole("navigation");
    expect(navbar).toHaveClass("navbar");

    const navbarBrand = document.querySelector(".navbar-brand");
    expect(navbarBrand).toBeInTheDocument();

    const navbarMenu = document.querySelector(".navbar-menu");
    expect(navbarMenu).toBeInTheDocument();

    const navbarStart = document.querySelector(".navbar-start");
    expect(navbarStart).toBeInTheDocument();
  });

  it("navigation links have correct href attributes", () => {
    render(
      <MemoryRouter>
        <Root />
      </MemoryRouter>
    );

    const wKgLink = screen.getByText("w/kg").closest("a");
    const fuelingLink = screen.getByText("fueling calculator").closest("a");

    expect(wKgLink).toHaveAttribute("href", "/");
    expect(fuelingLink).toHaveAttribute("href", "/fueling");
  });

  it("has accessibility features", () => {
    render(
      <MemoryRouter>
        <Root />
      </MemoryRouter>
    );

    const navigation = screen.getByRole("navigation");
    expect(navigation).toHaveAttribute("aria-label", "main navigation");
  });
});
