/* eslint-env jest */
import { describe, it, expect, jest } from "@jest/globals";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "../../context/CartContext.jsx";
import ProductListing from "../ProductListing";
import CartPage from "../CartPage";

// Mock products to avoid Firestore dependency
const mockProducts = [
  {
    id: 1,
    title: "Test Product",
    price: 19.99,
    image: "https://via.placeholder.com/150",
    category: "electronics",
    rating: { rate: 4.5, count: 10 },
  },
];

jest.mock("../../utils/firestoreProducts", () => ({
  fetchProducts: () => Promise.resolve(mockProducts),
}));

describe("Cart Integration", () => {
  it("adds a product to the cart and displays it in CartPage", async () => {
    render(
      <BrowserRouter>
        <CartProvider>
          <ProductListing />
          <CartPage />
        </CartProvider>
      </BrowserRouter>
    );

    // Wait for products to load
    await waitFor(() =>
      expect(screen.getByText(/Test Product/i)).toBeInTheDocument()
    );

    // Click Add to Cart
    const addButton = screen.getByRole("button", { name: /add to cart/i });
    fireEvent.click(addButton);

    // CartPage should now show the product
    expect(screen.getByText(/Test Product/i)).toBeInTheDocument();
    expect(screen.getByText("$19.99")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument(); // quantity
  });
});
