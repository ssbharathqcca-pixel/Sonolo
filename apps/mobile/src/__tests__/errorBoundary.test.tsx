/**
 * Tests for the SN-017 global error boundary: branded glass fallback
 * on child crashes and recovery via the "Restart App" button.
 */

import { Text } from "react-native";
import { fireEvent, render, screen } from "@testing-library/react-native";

import { AppErrorBoundary } from "../components/ErrorBoundary";

let shouldThrow = false;

function Boom(): JSX.Element {
  if (shouldThrow) {
    throw new Error("kaboom");
  }
  return <Text>Back on track</Text>;
}

describe("AppErrorBoundary", () => {
  beforeEach(() => {
    shouldThrow = true;
    // React logs caught render errors via console.error; silence for
    // clean test output.
    jest.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders the glass fallback when a child crashes", async () => {
    render(
      <AppErrorBoundary>
        <Boom />
      </AppErrorBoundary>,
    );

    expect(await screen.findByText("Something went wrong")).toBeTruthy();
    expect(screen.queryByText("Back on track")).toBeNull();
    expect(screen.getByLabelText("Restart App")).toBeTruthy();
  });

  it("recovers into the live tree when Restart App is pressed", async () => {
    render(
      <AppErrorBoundary>
        <Boom />
      </AppErrorBoundary>,
    );
    await screen.findByText("Something went wrong");

    shouldThrow = false;
    fireEvent.press(screen.getByLabelText("Restart App"));

    expect(await screen.findByText("Back on track")).toBeTruthy();
    expect(screen.queryByText("Something went wrong")).toBeNull();
  });
});
