import { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { createProduct } from "../utils/firestoreProducts";

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });
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
      setLoading(true);

      const productData = {
        title: formData.title.trim(),
        price: parseFloat(formData.price),
        description: formData.description.trim(),
        category: formData.category,
        image:
          formData.image ||
          "https://via.placeholder.com/300x300?text=Product+Image",
        rating: {
          rate: 0,
          count: 0,
        },
      };

      const id = await createProduct(productData);

      setToast({
        show: true,
        message: `Product "${formData.title}" created successfully! ID: ${id}`,
        variant: "success",
      });

      // Reset form
      setFormData({
        title: "",
        price: "",
        description: "",
        category: "",
        image: "",
      });

      console.log("Product created:", id);
    } catch (err) {
      setToast({
        show: true,
        message: "Failed to create product. Please try again.",
        variant: "danger",
      });
      console.error("Error creating product:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      {/* Header Section */}
      <Row className="mb-4">
        <Col>
          <div>
            <h1 className="display-6 fw-bold text-primary mb-2">
              ➕ Add New Product
            </h1>
            <p className="text-muted mb-0">
              Create a new product for the store
            </p>
          </div>
        </Col>
      </Row>

      {/* Form Section */}
      <Row className="justify-content-center">
        <Col xs={12} sm={11} md={10} lg={8} xl={6}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">📝 Product Information</h5>
            </Card.Header>
            <Card.Body className="p-4">
              <Alert variant="info" className="mb-4">
                <Alert.Heading className="h6">📌 Note</Alert.Heading>
                Products you add here are saved to your Firestore database and
                will be visible to all users in the store.
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
                        Leave empty to use a default placeholder image
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate("/products")}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                    className="px-4"
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Creating Product...
                      </>
                    ) : (
                      "✨ Create Product"
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
                  <Col xs={12} sm={4} md={4} className="mb-3 mb-sm-0">
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
                  <Col xs={12} sm={8} md={8}>
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

export default AddProduct;
