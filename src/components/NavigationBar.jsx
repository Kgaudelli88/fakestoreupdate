import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { useCart } from "../context/useCart.js";

const NavigationBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return unsubscribe;
  }, [auth]);

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const { cart } = useCart();
  const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Navbar
      bg="primary"
      variant="dark"
      expand="lg"
      className="shadow-sm sticky-top"
      collapseOnSelect
    >
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand className="fw-bold d-flex align-items-center">
            <span className="me-2" style={{ fontSize: "1.5rem" }}>
              🛍️
            </span>
            <span className="d-none d-sm-inline">Fake Store</span>
            <span className="d-inline d-sm-none">FS</span>
          </Navbar.Brand>
        </LinkContainer>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link active={isActive("/")} className="px-3 py-2">
                <span className="d-inline d-lg-none">🏠 </span>
                <span className="d-none d-lg-inline">🏠 Home</span>
                <span className="d-inline d-lg-none">Home</span>
              </Nav.Link>
            </LinkContainer>

            <LinkContainer to="/products">
              <Nav.Link active={isActive("/products")} className="px-3 py-2">
                <span className="d-inline d-lg-none">📦 </span>
                <span className="d-none d-lg-inline">📦 Products</span>
                <span className="d-inline d-lg-none">Products</span>
              </Nav.Link>
            </LinkContainer>

            <LinkContainer to="/add-product">
              <Nav.Link active={isActive("/add-product")} className="px-3 py-2">
                <span className="d-inline d-lg-none">➕ </span>
                <span className="d-none d-lg-inline">➕ Add Product</span>
                <span className="d-inline d-lg-none">Add Product</span>
              </Nav.Link>
            </LinkContainer>
          </Nav>

          <Nav>
            <LinkContainer to="/cart">
              <Nav.Link className="text-light px-3 py-2">
                <span className="d-inline d-lg-none">🛒 </span>
                <span className="d-none d-lg-inline">
                  🛒 Cart ({cartCount})
                </span>
                <span className="d-inline d-lg-none">Cart ({cartCount})</span>
              </Nav.Link>
            </LinkContainer>
            {user ? (
              <>
                <LinkContainer to="/orders">
                  <Button variant="light" className="ms-2">
                    Orders
                  </Button>
                </LinkContainer>
                <LinkContainer to="/profile">
                  <Button variant="light" className="ms-2">
                    Profile
                  </Button>
                </LinkContainer>
                <Button
                  variant="outline-light"
                  className="ms-2"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <LinkContainer to="/login">
                  <Button variant="outline-light" className="ms-2">
                    Login
                  </Button>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Button variant="light" className="ms-2">
                    Register
                  </Button>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
