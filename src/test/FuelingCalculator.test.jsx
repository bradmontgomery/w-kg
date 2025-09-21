import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import FuelingCalculator from "../FuelingCalculator.jsx";

// Mock FontAwesome icons
vi.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: ({ icon }) => <span data-testid="font-awesome-icon">{icon.iconName}</span>,
}));

describe("FuelingCalculator Component", () => {
  it("renders the component with initial state", () => {
    render(<FuelingCalculator />);

    expect(screen.getByText("Fueling Calculator!")).toBeInTheDocument();
    expect(screen.getByText("Optimizing your carbohydrate intake for peak performance.")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Total ride time")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Target carbohydrates")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Fueling Frequency")).toBeInTheDocument();
  });

  it("shows initial message when no data is entered", () => {
    render(<FuelingCalculator />);

    expect(screen.getByText("👈 Enter details for Fueling!")).toBeInTheDocument();
  });

  it("processes form submission correctly", async () => {
    const user = userEvent.setup();
    render(<FuelingCalculator />);

    const rideTimeInput = screen.getByPlaceholderText("Total ride time");
    const totalCarbsInput = screen.getByPlaceholderText("Target carbohydrates");
    const frequencyInput = screen.getByPlaceholderText("Fueling Frequency");
    const submitButton = screen.getByText("Fuel Me!");

    // Fill out the form
    await user.type(rideTimeInput, "2:30"); // 2 hours 30 minutes
    await user.type(totalCarbsInput, "150"); // 150g carbs
    await user.type(frequencyInput, "60"); // 60 minutes

    await user.click(submitButton);

    // Should show the total minutes (2:30 = 150 minutes)
    await waitFor(() => {
      expect(screen.getByText(/150 total minutes/)).toBeInTheDocument();
    });
  });

  it("calculates ride time correctly from hh:mm format", async () => {
    const user = userEvent.setup();
    render(<FuelingCalculator />);

    const rideTimeInput = screen.getByPlaceholderText("Total ride time");
    const totalCarbsInput = screen.getByPlaceholderText("Target carbohydrates");
    const frequencyInput = screen.getByPlaceholderText("Fueling Frequency");
    const submitButton = screen.getByText("Fuel Me!");

    // Test different time formats
    await user.type(rideTimeInput, "1:15"); // 1 hour 15 minutes = 75 minutes
    await user.type(totalCarbsInput, "75");
    await user.type(frequencyInput, "30");

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/75 total minutes/)).toBeInTheDocument();
    });
  });

  it("generates fueling recommendations", async () => {
    const user = userEvent.setup();
    render(<FuelingCalculator />);

    const rideTimeInput = screen.getByPlaceholderText("Total ride time");
    const totalCarbsInput = screen.getByPlaceholderText("Target carbohydrates");
    const frequencyInput = screen.getByPlaceholderText("Fueling Frequency");
    const submitButton = screen.getByText("Fuel Me!");

    await user.type(rideTimeInput, "2:00"); // 2 hours = 120 minutes
    await user.type(totalCarbsInput, "120"); // 120g carbs
    await user.type(frequencyInput, "60"); // Every 60 minutes

    await user.click(submitButton);

    // Should generate feeding periods
    await waitFor(() => {
      expect(screen.getByText(/Feed 1/)).toBeInTheDocument();
      expect(screen.getByText(/Feed 2/)).toBeInTheDocument();
    });
  });

  it("shows calorie and carb totals", async () => {
    const user = userEvent.setup();
    render(<FuelingCalculator />);

    const rideTimeInput = screen.getByPlaceholderText("Total ride time");
    const totalCarbsInput = screen.getByPlaceholderText("Target carbohydrates");
    const frequencyInput = screen.getByPlaceholderText("Fueling Frequency");
    const submitButton = screen.getByText("Fuel Me!");

    await user.type(rideTimeInput, "1:00");
    await user.type(totalCarbsInput, "60");
    await user.type(frequencyInput, "60");

    await user.click(submitButton);

    // Should show total calories and carbs
    await waitFor(() => {
      expect(screen.getAllByText("calories")).toHaveLength(2); // Should have multiple instances
      expect(screen.getAllByText("g carbs")).toHaveLength(2); // carbs label - should appear in header and feed section
    });
  });

  it("resets form when reset button is clicked", async () => {
    const user = userEvent.setup();
    render(<FuelingCalculator />);

    const rideTimeInput = screen.getByPlaceholderText("Total ride time");
    const totalCarbsInput = screen.getByPlaceholderText("Target carbohydrates");
    const frequencyInput = screen.getByPlaceholderText("Fueling Frequency");
    const submitButton = screen.getByText("Fuel Me!");
    const resetButton = screen.getByText("Reset");

    // Fill and submit form
    await user.type(rideTimeInput, "2:00");
    await user.type(totalCarbsInput, "120");
    await user.type(frequencyInput, "60");
    await user.click(submitButton);

    // Verify data is shown
    await waitFor(() => {
      expect(screen.getByText(/120 total minutes/)).toBeInTheDocument();
    });

    // Reset form
    await user.click(resetButton);

    // Should return to initial state
    await waitFor(() => {
      expect(screen.getByText("👈 Enter details for Fueling!")).toBeInTheDocument();
    });
  });

  it("handles edge cases for time input", async () => {
    const user = userEvent.setup();
    render(<FuelingCalculator />);

    const rideTimeInput = screen.getByPlaceholderText("Total ride time");
    const totalCarbsInput = screen.getByPlaceholderText("Target carbohydrates");
    const frequencyInput = screen.getByPlaceholderText("Fueling Frequency");
    const submitButton = screen.getByText("Fuel Me!");

    // Test with just minutes
    await user.type(rideTimeInput, "0:45"); // 45 minutes
    await user.type(totalCarbsInput, "30");
    await user.type(frequencyInput, "30");

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/45 total minutes/)).toBeInTheDocument();
    });
  });

  it("displays fuel items with correct information", async () => {
    const user = userEvent.setup();
    render(<FuelingCalculator />);

    const rideTimeInput = screen.getByPlaceholderText("Total ride time");
    const totalCarbsInput = screen.getByPlaceholderText("Target carbohydrates");
    const frequencyInput = screen.getByPlaceholderText("Fueling Frequency");
    const submitButton = screen.getByText("Fuel Me!");

    await user.type(rideTimeInput, "1:00");
    await user.type(totalCarbsInput, "60");
    await user.type(frequencyInput, "60");

    await user.click(submitButton);

    // Should show fuel items with calories and carbs
    await waitFor(() => {
      const caloriesTexts = screen.getAllByText(/calories/);
      expect(caloriesTexts.length).toBeGreaterThanOrEqual(2); // Should have at least 2 instances (varies due to random algorithm)

      const carbsTexts = screen.getAllByText(/g carbs/);
      expect(carbsTexts.length).toBeGreaterThanOrEqual(1); // Should have at least 1 instance of g carbs
    });
  });

  it("has correct form labels and accessibility", () => {
    render(<FuelingCalculator />);

    expect(screen.getByTitle("Total ride time")).toBeInTheDocument();
    expect(screen.getByTitle("Target carbohydrates")).toBeInTheDocument();
    expect(screen.getByTitle("Fueling Frequency")).toBeInTheDocument();

    expect(screen.getByText("in hh:mm")).toBeInTheDocument();
    expect(screen.getByText("in grams")).toBeInTheDocument();
    expect(screen.getByText("in minutes")).toBeInTheDocument();
  });
});
