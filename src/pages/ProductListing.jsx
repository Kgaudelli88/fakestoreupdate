import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Spinner,
  Alert,
  Badge,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "../utils/firestoreProducts";
import { useCart } from "../context/useCart.js";

const ProductListing = () => {
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch products. Please try again later.");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  const handleViewDetails = (productId) => {
    console.log("View Details clicked for productId:", productId);
    navigate(`/product/${productId}`);
  };

  const truncateTitle = (title, maxLength = 50) => {
    return title.length > maxLength
      ? `${title.substring(0, maxLength)}...`
      : title;
  };

  const getCategoryColor = (category) => {
    const colors = {
      "men's clothing": "primary",
      "women's clothing": "danger",
      jewelery: "warning",
      electronics: "info",
    };
    return colors[category] || "secondary";
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="d-flex flex-column align-items-center">
          <Spinner
            animation="border"
            role="status"
            variant="primary"
            style={{ width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3 text-muted lead">Loading amazing products...</p>
          <div className="mt-2">
            <div className="d-flex justify-content-center">
              <div
                className="spinner-grow text-primary me-1"
                style={{ width: "0.5rem", height: "0.5rem" }}
              ></div>
              <div
                className="spinner-grow text-primary me-1"
                style={{
                  width: "0.5rem",
                  height: "0.5rem",
                  animationDelay: "0.1s",
                }}
              ></div>
              <div
                className="spinner-grow text-primary"
                style={{
                  width: "0.5rem",
                  height: "0.5rem",
                  animationDelay: "0.2s",
                }}
              ></div>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Alert variant="danger" className="text-center shadow-sm">
              <div className="mb-3">
                <div style={{ fontSize: "3rem" }}>😕</div>
              </div>
              <Alert.Heading className="h4">
                Unable to Load Products
              </Alert.Heading>
              <p className="mb-3">{error}</p>
              <hr />
              <div className="mb-3">
                <small className="text-muted">This might be due to:</small>
                <ul className="list-unstyled small text-muted mt-2">
                  <li>• Network connectivity issues</li>
                  <li>• Server temporarily unavailable</li>
                  <li>• API rate limiting</li>
                </ul>
              </div>
              <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                <Button
                  variant="danger"
                  onClick={fetchProducts}
                  className="px-4"
                >
                  <span className="me-2">🔄</span>Try Again
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() => window.location.reload()}
                  className="px-4"
                >
                  <span className="me-2">↻</span>Refresh Page
                </Button>
              </div>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  const handleAddToCart = (product) => {
    dispatch({ type: "ADD_TO_CART", product });
  };

  return (
    <Container className="py-4">
      {/* Header Section */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="display-6 fw-bold text-primary mb-2">
                🛍️ Our Products
              </h1>
              <p className="text-muted mb-0">
                Discover {products.length} amazing products just for you
              </p>
            </div>
            <div className="d-none d-md-block">
              <Button
                variant="success"
                onClick={() => navigate("/add-product")}
              >
                ➕ Add Product
              </Button>
            </div>
          </div>
          <div className="d-block d-md-none mt-3">
            <Button
              variant="success"
              onClick={() => navigate("/add-product")}
              size="sm"
            >
              ➕ Add Product
            </Button>
          </div>
        </Col>
      </Row>

      {/* Products Grid */}
      <Row>
        {products.map((product) => (
          <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card
              className="h-100 shadow-sm border-0 product-card"
              style={{ transition: "all 0.3s ease" }}
            >
              <div
                className="position-relative"
                style={{ height: "200px", overflow: "hidden" }}
              >
                <Card.Img
                  variant="top"
                  src={product.image}
                  alt={product.title}
                  style={{
                    height: "100%",
                    objectFit: "contain",
                    padding: "10px",
                    backgroundColor: "#f8f9fa",
                  }}
                />
                <Badge
                  bg={getCategoryColor(product.category)}
                  className="position-absolute top-0 start-0 m-2"
                  style={{ fontSize: "0.7rem" }}
                >
                  {product.category}
                </Badge>
              </div>

              <Card.Body className="d-flex flex-column">
                <Card.Title
                  className="text-dark mb-2"
                  style={{ fontSize: "0.95rem", lineHeight: "1.3" }}
                >
                  {truncateTitle(product.title)}
                </Card.Title>

                <div className="mt-auto">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h5 className="text-success mb-0 fw-bold">
                        ${product.price}
                      </h5>
                      <div className="d-flex align-items-center mt-1">
                        <span className="text-warning me-1">⭐</span>
                        <small className="text-muted">
                          {product.rating &&
                          typeof product.rating.rate !== "undefined"
                            ? `${product.rating.rate} (${product.rating.count})`
                            : "No ratings"}
                        </small>
                      </div>
                    </div>
                  </div>

                  <div className="d-grid gap-1">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        console.log("Button clicked for product:", product);
                        handleViewDetails(product.id);
                      }}
                    >
                      👁️ View Details
                    </Button>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                    >
                      🛒 Add to Cart
                    </Button>
                    <Button
                      variant="outline-warning"
                      size="sm"
                      onClick={() => navigate(`/edit-product/${product.id}`)}
                    >
                      ✏️ Edit
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Footer Section */}
      <Row className="mt-5">
        <Col className="text-center">
          <p className="text-muted">Showing all {products.length} products</p>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductListing;
