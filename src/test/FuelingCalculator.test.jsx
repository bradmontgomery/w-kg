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
    expect(screen.getByText("Counting the Calroies & Carbs for you.")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Total ride time")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Expected total work")).toBeInTheDocument();
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
    const totalWorkInput = screen.getByPlaceholderText("Expected total work");
    const frequencyInput = screen.getByPlaceholderText("Fueling Frequency");
    const submitButton = screen.getByText("Fuel Me!");

    // Fill out the form
    await user.type(rideTimeInput, "2:30"); // 2 hours 30 minutes
    await user.type(totalWorkInput, "1500"); // 1500 kJ
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
    const totalWorkInput = screen.getByPlaceholderText("Expected total work");
    const frequencyInput = screen.getByPlaceholderText("Fueling Frequency");
    const submitButton = screen.getByText("Fuel Me!");

    // Test different time formats
    await user.type(rideTimeInput, "1:15"); // 1 hour 15 minutes = 75 minutes
    await user.type(totalWorkInput, "1000");
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
    const totalWorkInput = screen.getByPlaceholderText("Expected total work");
    const frequencyInput = screen.getByPlaceholderText("Fueling Frequency");
    const submitButton = screen.getByText("Fuel Me!");

    await user.type(rideTimeInput, "2:00"); // 2 hours = 120 minutes
    await user.type(totalWorkInput, "1200"); // 1200 kJ
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
    const totalWorkInput = screen.getByPlaceholderText("Expected total work");
    const frequencyInput = screen.getByPlaceholderText("Fueling Frequency");
    const submitButton = screen.getByText("Fuel Me!");

    await user.type(rideTimeInput, "1:00");
    await user.type(totalWorkInput, "600");
    await user.type(frequencyInput, "60");

    await user.click(submitButton);

    // Should show total calories and carbs
    await waitFor(() => {
      expect(screen.getAllByText("calories")).toHaveLength(2); // Should have multiple instances
      expect(screen.getByText("g")).toBeInTheDocument(); // carbs label
    });
  });

  it("resets form when reset button is clicked", async () => {
    const user = userEvent.setup();
    render(<FuelingCalculator />);

    const rideTimeInput = screen.getByPlaceholderText("Total ride time");
    const totalWorkInput = screen.getByPlaceholderText("Expected total work");
    const frequencyInput = screen.getByPlaceholderText("Fueling Frequency");
    const submitButton = screen.getByText("Fuel Me!");
    const resetButton = screen.getByText("Reset");

    // Fill and submit form
    await user.type(rideTimeInput, "2:00");
    await user.type(totalWorkInput, "1200");
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
    const totalWorkInput = screen.getByPlaceholderText("Expected total work");
    const frequencyInput = screen.getByPlaceholderText("Fueling Frequency");
    const submitButton = screen.getByText("Fuel Me!");

    // Test with just minutes
    await user.type(rideTimeInput, "0:45"); // 45 minutes
    await user.type(totalWorkInput, "300");
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
    const totalWorkInput = screen.getByPlaceholderText("Expected total work");
    const frequencyInput = screen.getByPlaceholderText("Fueling Frequency");
    const submitButton = screen.getByText("Fuel Me!");

    await user.type(rideTimeInput, "1:00");
    await user.type(totalWorkInput, "600");
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
    expect(screen.getByTitle("Expected total work")).toBeInTheDocument();
    expect(screen.getByTitle("Fueling Frequency")).toBeInTheDocument();

    expect(screen.getByText("in hh:mm")).toBeInTheDocument();
    expect(screen.getByText("in kJ")).toBeInTheDocument();
    expect(screen.getByText("in minutes")).toBeInTheDocument();
  });
});
