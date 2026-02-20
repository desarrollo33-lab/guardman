/**
 * Test Auth App Entry Point
 * 
 * This is a separate entry point for testing Refine + Convex Auth compatibility.
 * To run: Update index.html to load this entry point instead of main.tsx
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import TestApp from "./App";
import "../index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TestApp />
  </StrictMode>
);
