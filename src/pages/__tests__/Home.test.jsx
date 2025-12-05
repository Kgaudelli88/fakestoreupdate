/* eslint-env jest */
import { describe, it, expect } from "@jest/globals";

import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { jest } from "@jest/globals";
// Mock useNavigate from react-router-dom
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});
import Home from "../Home";

describe("Home", () => {
  it("renders welcome message", () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    expect(screen.getByText(/Welcome to Fake Store/i)).toBeInTheDocument();
  });

  it("renders the Start Shopping button", () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    const button = screen.getByRole("button", { name: /start shopping now/i });
    expect(button).toBeInTheDocument();
  });

  it("calls navigate when Start Shopping button is clicked", () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    const button = screen.getByRole("button", { name: /start shopping now/i });
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith("/products");
  });
});
