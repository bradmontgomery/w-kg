import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import WattsPerKg from "../WattsPerKg.jsx";

// Mock FontAwesome icons to avoid import issues in tests
vi.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: ({ icon }) => <span data-testid="font-awesome-icon">{icon.iconName}</span>,
}));

describe("WattsPerKg Component", () => {
  it("renders the component with initial state", () => {
    render(<WattsPerKg />);

    expect(screen.getByText("w/kg targets")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your weight")).toBeInTheDocument();

    // Check that the kg input exists (readonly)
    const kgInput = document.querySelector("input[readonly]");
    expect(kgInput).toHaveValue("0");
  });

  it("displays the question section correctly", () => {
    render(<WattsPerKg />);

    expect(screen.getByText(/Question:/)).toBeInTheDocument();
    expect(screen.getByText(/How much power do I need to produce/)).toBeInTheDocument();
  });

  it("converts weight from lbs to kg correctly", async () => {
    const user = userEvent.setup();
    render(<WattsPerKg />);

    const weightInput = screen.getByPlaceholderText("Your weight");

    // Test weight conversion: 150 lbs should be ~68 kg (150 * 0.45 = 67.5, rounded = 68)
    await user.clear(weightInput);
    await user.type(weightInput, "150");

    const kgInput = screen.getByDisplayValue("68");
    expect(kgInput).toBeInTheDocument();
  });

  it("handles invalid input gracefully", async () => {
    const user = userEvent.setup();
    render(<WattsPerKg />);

    const weightInput = screen.getByPlaceholderText("Your weight");

    // Test with non-numeric input
    await user.clear(weightInput);
    await user.type(weightInput, "abc");

    // Should default to 0 - check the readonly kg input
    const kgInput = document.querySelector("input[readonly]");
    expect(kgInput).toHaveValue("0");
  });

  it("handles negative input correctly", async () => {
    const user = userEvent.setup();
    render(<WattsPerKg />);

    const weightInput = screen.getByPlaceholderText("Your weight");

    // Test with negative input
    await user.clear(weightInput);
    await user.type(weightInput, "-50");

    // Should convert absolute value: |-50| * 0.45 = 22.5, rounded = 23
    expect(screen.getByDisplayValue("23")).toBeInTheDocument();
  });

  it("displays all power targets", () => {
    render(<WattsPerKg />);

    const expectedTargets = [
      "2 W/Kg",
      "2.5 W/Kg",
      "3 W/Kg",
      "3.5 W/Kg",
      "4 W/Kg",
      "4.5 W/Kg",
      "5 W/Kg",
      "6 W/Kg",
      "7 W/Kg",
      "8 W/Kg",
      "9 W/Kg",
      "10 W/Kg",
    ];

    expectedTargets.forEach((target) => {
      expect(screen.getByText(target)).toBeInTheDocument();
    });
  });

  it("calculates power values correctly for given weight", async () => {
    const user = userEvent.setup();
    render(<WattsPerKg />);

    const weightInput = screen.getByPlaceholderText("Your weight");

    // Test with 100 lbs (45 kg)
    await user.clear(weightInput);
    await user.type(weightInput, "100");

    // Check some power calculations
    expect(screen.getByText("90")).toBeInTheDocument(); // 2 W/kg * 45kg = 90W
    expect(screen.getByText("135")).toBeInTheDocument(); // 3 W/kg * 45kg = 135W
    expect(screen.getByText("180")).toBeInTheDocument(); // 4 W/kg * 45kg = 180W
  });

  it("updates power values when weight changes", async () => {
    const user = userEvent.setup();
    render(<WattsPerKg />);

    const weightInput = screen.getByPlaceholderText("Your weight");

    // First set weight to 100 lbs (45 kg)
    await user.clear(weightInput);
    await user.type(weightInput, "100");
    expect(screen.getByText("90")).toBeInTheDocument(); // 2 W/kg * 45kg

    // Change weight to 200 lbs (90 kg)
    await user.clear(weightInput);
    await user.type(weightInput, "200");
    expect(screen.getByText("180")).toBeInTheDocument(); // 2 W/kg * 90kg
  });

  it("has correct accessibility attributes", () => {
    render(<WattsPerKg />);

    const abbreviation = screen.getByTitle("watts per kilogram");
    expect(abbreviation).toBeInTheDocument();
  });

  it("shows zero values when no weight is entered", () => {
    render(<WattsPerKg />);

    // All power targets should show 0 when weight is 0
    const powerElements = screen.getAllByText("0");
    expect(powerElements.length).toBeGreaterThan(10); // Should have multiple zeros for power targets
  });
});
