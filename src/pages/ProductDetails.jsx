import { useState, useEffect, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Spinner,
  Alert,
  Badge,
  Modal,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProduct, deleteProduct } from "../utils/firestoreProducts";
import { useCart } from "../context/useCart.js";

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  const getProduct = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchProduct(id);
      setProduct(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch product details. Please try again later.");
      console.error("Error fetching product:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    getProduct();
  }, [getProduct]);

  const handleBackToProducts = () => {
    navigate("/products");
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

  const { dispatch } = useCart();
  const handleAddToCart = () => {
    dispatch({ type: "ADD_TO_CART", product });
    setToast({
      show: true,
      message: `"${product.title}" has been added to your cart!`,
      variant: "success",
    });
  };

  const handleDeleteProduct = async () => {
    try {
      setDeleting(true);
      await deleteProduct(id);
      setToast({
        show: true,
        message: `"${product.title}" has been deleted successfully!`,
        variant: "success",
      });
      setShowDeleteModal(false);

      // Navigate back to products page after a short delay
      setTimeout(() => {
        navigate("/products");
      }, 2000);
    } catch (err) {
      setToast({
        show: true,
        message: "Failed to delete product. Please try again.",
        variant: "danger",
      });
      setShowDeleteModal(false);
      console.error("Error deleting product:", err);
    } finally {
      setDeleting(false);
    }
  };

  const confirmDelete = () => {
    setShowDeleteModal(true);
  };

  if (loading) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6} className="text-center">
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-5">
                <div className="mb-4">
                  <Spinner
                    animation="border"
                    role="status"
                    variant="primary"
                    style={{ width: "3rem", height: "3rem" }}
                  >
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
                <h5 className="text-primary mb-3">Loading Product Details</h5>
                <p className="text-muted">
                  Please wait while we fetch the product information...
                </p>
                <div className="mt-3">
                  <div className="progress" style={{ height: "4px" }}>
                    <div
                      className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-5 text-center">
                <div className="mb-4" style={{ fontSize: "4rem" }}>
                  {error ? "⚠️" : "🔍"}
                </div>
                <h4 className="text-danger mb-3">
                  {error ? "Something Went Wrong" : "Product Not Found"}
                </h4>
                <p className="text-muted mb-4">
                  {error ||
                    "The product you are looking for does not exist or has been removed."}
                </p>
                <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                  <Button
                    variant="outline-danger"
                    onClick={fetchProduct}
                    className="px-4"
                  >
                    <span className="me-2">🔄</span>Try Again
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleBackToProducts}
                    className="px-4"
                  >
                    <span className="me-2">←</span>Back to Products
                  </Button>
                </div>
                <hr className="my-4" />
                <small className="text-muted">
                  Product ID: {id} • If this problem persists, please contact
                  support
                </small>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Product Details */}
      <Row>
        <Col lg={6} className="mb-4">
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <div
                style={{
                  height: "400px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f8f9fa",
                }}
              >
                <img
                  src={product.image}
                  alt={product.title}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <div className="sticky-top" style={{ top: "2rem" }}>
            <Badge
              bg={getCategoryColor(product.category)}
              className="mb-3"
              style={{ fontSize: "0.8rem" }}
            >
              {product.category.toUpperCase()}
            </Badge>

            <h1 className="display-6 fw-bold text-dark mb-3">
              {product.title}
            </h1>

            <div className="d-flex align-items-center mb-4">
              <div className="me-4">
                <h2 className="text-success fw-bold mb-0">${product.price}</h2>
              </div>
              <div className="d-flex align-items-center">
                <span
                  className="text-warning me-2"
                  style={{ fontSize: "1.2rem" }}
                >
                  {"⭐".repeat(Math.round(product.rating.rate))}
                </span>
                <span className="text-muted">
                  {product.rating.rate} ({product.rating.count} reviews)
                </span>
              </div>
            </div>

            <Card className="border-0 bg-light mb-4">
              <Card.Body>
                <h5 className="text-dark mb-3">📝 Description</h5>
                <p className="text-muted mb-0" style={{ lineHeight: "1.6" }}>
                  {product.description}
                </p>
              </Card.Body>
            </Card>

            <div className="d-grid gap-2">
              <Button
                variant="success"
                size="lg"
                className="fw-bold"
                onClick={handleAddToCart}
              >
                🛒 Add to Cart
              </Button>
              <Button variant="outline-primary" size="lg">
                💝 Add to Wishlist
              </Button>
              <Button
                variant="warning"
                size="lg"
                onClick={() => navigate(`/edit-product/${product.id}`)}
              >
                ✏️ Edit Product
              </Button>
              <Button
                variant="danger"
                size="lg"
                onClick={confirmDelete}
                className="mt-3"
              >
                🗑️ Delete Product
              </Button>
            </div>

            <Card className="border-0 bg-light mt-4">
              <Card.Body>
                <Row className="text-center">
                  <Col xs={4}>
                    <div className="mb-2">🚚</div>
                    <small className="text-muted">Free Shipping</small>
                  </Col>
                  <Col xs={4}>
                    <div className="mb-2">↩️</div>
                    <small className="text-muted">Easy Returns</small>
                  </Col>
                  <Col xs={4}>
                    <div className="mb-2">🔒</div>
                    <small className="text-muted">Secure Payment</small>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>

      {/* Additional Info */}
      <Row className="mt-5">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">📋 Product Information</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <td className="fw-bold">Product ID:</td>
                        <td>#{product.id}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Category:</td>
                        <td className="text-capitalize">{product.category}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Rating:</td>
                        <td>{product.rating.rate}/5</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Reviews:</td>
                        <td>{product.rating.count} customer reviews</td>
                      </tr>
                    </tbody>
                  </table>
                </Col>
                <Col md={6}>
                  <div className="bg-light p-3 rounded">
                    <h6 className="text-primary mb-2">
                      ✨ Why Choose This Product?
                    </h6>
                    <ul className="list-unstyled mb-0">
                      <li className="mb-1">✓ High-quality materials</li>
                      <li className="mb-1">✓ Excellent customer ratings</li>
                      <li className="mb-1">✓ Fast and free shipping</li>
                      <li className="mb-0">✓ 30-day return policy</li>
                    </ul>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this product?</p>
          <p className="fw-bold text-danger">"{product?.title}"</p>
          <p className="text-muted small">
            Note: This is a test API, so the product won't actually be removed
            from the database.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteProduct}
            disabled={deleting}
          >
            {deleting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  className="me-2"
                />
                Deleting...
              </>
            ) : (
              "Delete Product"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast Notifications */}
      <ToastContainer className="position-fixed bottom-0 end-0 p-3">
        <Toast
          show={toast.show}
          onClose={() => setToast((t) => ({ ...t, show: false }))}
          delay={3000}
          autohide
          bg={toast.variant}
        >
          <Toast.Header>
            <strong className="me-auto">
              {toast.variant === "success" ? "✅ Success" : "❌ Error"}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default ProductDetails;
