/* eslint-env jest */
import { describe, it, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import NavigationBar from "../NavigationBar";
import { CartProvider } from "../../context/CartContext.jsx";

describe("NavigationBar", () => {
  it("renders the brand name", () => {
    render(
      <BrowserRouter>
        <CartProvider>
          <NavigationBar />
        </CartProvider>
      </BrowserRouter>
    );
    expect(screen.getByText(/Fake Store|FS/i)).toBeInTheDocument();
  });
});
