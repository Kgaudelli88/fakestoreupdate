/* eslint-env jest */
import { describe, it, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import CartPage from "../CartPage";
import { CartProvider } from "../../context/CartContext.jsx";

describe("CartPage", () => {
  it("renders empty cart message", () => {
    render(
      <BrowserRouter>
        <CartProvider>
          <CartPage />
        </CartProvider>
      </BrowserRouter>
    );
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });
});
