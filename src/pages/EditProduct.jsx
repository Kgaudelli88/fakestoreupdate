import { useState, useEffect, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProduct, updateProduct } from "../utils/firestoreProducts";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    image: "",
  });
  const [errors, setErrors] = useState({});

  const categories = [
    "men's clothing",
    "women's clothing",
    "jewelery",
    "electronics",
  ];

  // Fetch product data on component mount
  const getProduct = useCallback(async () => {
    try {
      setLoading(true);
      const product = await fetchProduct(id);
      setFormData({
        title: product?.title || "",
        price: product?.price ? product.price.toString() : "",
        description: product?.description || "",
        category: product?.category || "",
        image: product?.image || "",
      });
      setError(null);
    } catch (err) {
      setError("Failed to load product data. Please try again.");
      console.error("Error fetching product:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      getProduct();
    }
  }, [getProduct, id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Product title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters long";
    }

    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = "Price must be a valid positive number";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters long";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (formData.image && !isValidUrl(formData.image)) {
      newErrors.image = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setUpdating(true);

      const productData = {
        title: formData.title.trim(),
        price: parseFloat(formData.price),
        description: formData.description.trim(),
        category: formData.category,
        image:
          formData.image ||
          "https://via.placeholder.com/300x300?text=Product+Image",
      };

      await updateProduct(id, productData);

      setToast({
        show: true,
        message: `Product "${formData.title}" updated successfully!`,
        variant: "success",
      });

      // Optionally navigate back after a delay
      setTimeout(() => {
        navigate(`/product/${id}`);
      }, 2000);
    } catch (err) {
      setToast({
        show: true,
        message: "Failed to update product. Please try again.",
        variant: "danger",
      });
      console.error("Error updating product:", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    navigate(`/product/${id}`);
  };

  if (loading) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col xs={12} md={6} className="text-center">
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-5">
                <div className="mb-4">
                  <div className="d-inline-block position-relative">
                    <Spinner
                      animation="border"
                      role="status"
                      variant="warning"
                      style={{ width: "3rem", height: "3rem" }}
                    >
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <div className="position-absolute top-50 start-50 translate-middle">
                      <span style={{ fontSize: "1.2rem" }}>✏️</span>
                    </div>
                  </div>
                </div>
                <h5 className="text-warning mb-3">Preparing Editor</h5>
                <p className="text-muted mb-3">
                  Loading product data for editing...
                </p>
                <div className="progress" style={{ height: "3px" }}>
                  <div
                    className="progress-bar bg-warning progress-bar-striped progress-bar-animated"
                    style={{ width: "100%" }}
                  ></div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-5 text-center">
                <div className="mb-4" style={{ fontSize: "4rem" }}>
                  ⚠️
                </div>
                <h4 className="text-danger mb-3">Cannot Load Product</h4>
                <p className="text-muted mb-4">{error}</p>
                <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                  <Button
                    variant="outline-danger"
                    onClick={fetchProduct}
                    className="px-4"
                  >
                    <span className="me-2">🔄</span>Try Again
                  </Button>
                </div>
                <hr className="my-4" />
                <small className="text-muted">
                  Product ID: {id} • Unable to fetch product data for editing
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
      {/* Header Section */}
      <Row className="mb-4">
        <Col>
          <div>
            <h1 className="display-6 fw-bold text-primary mb-2">
              ✏️ Edit Product
            </h1>
            <p className="text-muted mb-0">Update product information</p>
          </div>
        </Col>
      </Row>

      {/* Form Section */}
      <Row className="justify-content-center">
        <Col lg={8} xl={6}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-warning text-dark">
              <h5 className="mb-0">📝 Update Product Information</h5>
            </Card.Header>
            <Card.Body className="p-4">
              <Alert variant="info" className="mb-4">
                <Alert.Heading className="h6">📌 Note</Alert.Heading>
                Changes you make here are saved to your Firestore database and
                will update the product for all users in the store.
              </Alert>

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        Product Title <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter product title"
                        isInvalid={!!errors.title}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.title}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        Price <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        isInvalid={!!errors.price}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.price}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        Category <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        isInvalid={!!errors.category}
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category.charAt(0).toUpperCase() +
                              category.slice(1)}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.category}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={12} className="mb-3">
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        Description <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Enter product description (minimum 10 characters)"
                        isInvalid={!!errors.description}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.description}
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted">
                        {formData.description.length}/500 characters
                      </Form.Text>
                    </Form.Group>
                  </Col>

                  <Col md={12} className="mb-4">
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        Image URL <span className="text-muted">(Optional)</span>
                      </Form.Label>
                      <Form.Control
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        placeholder="https://example.com/image.jpg"
                        isInvalid={!!errors.image}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.image}
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted">
                        Leave empty to keep current image or use default
                        placeholder
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <Button
                    variant="outline-secondary"
                    onClick={handleCancel}
                    disabled={updating}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="warning"
                    type="submit"
                    disabled={updating}
                    className="px-4"
                  >
                    {updating ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Updating Product...
                      </>
                    ) : (
                      "✏️ Update Product"
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* Preview Section */}
          {formData.title && (
            <Card className="mt-4 shadow-sm border-0">
              <Card.Header className="bg-light">
                <h6 className="mb-0">👀 Preview</h6>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <img
                      src={
                        formData.image ||
                        "https://via.placeholder.com/200x200?text=Product+Image"
                      }
                      alt="Preview"
                      className="img-fluid rounded"
                      style={{
                        height: "150px",
                        objectFit: "cover",
                        width: "100%",
                      }}
                    />
                  </Col>
                  <Col md={8}>
                    <h5 className="text-primary">{formData.title}</h5>
                    <h6 className="text-success">
                      ${formData.price || "0.00"}
                    </h6>
                    <p className="text-muted small mb-2">
                      {formData.category && (
                        <span className="badge bg-secondary me-2">
                          {formData.category}
                        </span>
                      )}
                    </p>
                    <p className="text-muted small">
                      {formData.description || "No description provided"}
                    </p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      {/* Toast Notifications */}
      <ToastContainer className="position-fixed bottom-0 end-0 p-3">
        <Toast
          show={toast.show}
          onClose={() => setToast((t) => ({ ...t, show: false }))}
          delay={4000}
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

export default EditProduct;
