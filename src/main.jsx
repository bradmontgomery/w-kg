import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import Root from "./Root.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";
import WattPerKg from "./WattsPerKg.jsx";
import FuelingCalculator from "./FuelingCalculator.jsx";

const router = createBrowserRouter([
  {
    path: "/w-kg/",
    Component: Root,
    ErrorBoundary: ErrorBoundary,
    children: [
      { index: true, Component: WattPerKg },
      { path: "fueling", Component: FuelingCalculator },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
