// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { getAuth, updateProfile, deleteUser } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import app from "../firebase";
import { useAuth } from "../hooks/useAuth";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", address: "" });
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const db = getFirestore(app);
  const auth = getAuth(app);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
          setForm({
            name: docSnap.data().name || "",
            address: docSnap.data().address || "",
          });
        }
      } catch (err) {
        setError(err.message || "Failed to fetch profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user, db]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, {
        name: form.name,
        address: form.address,
      });
      await updateProfile(auth.currentUser, { displayName: form.name });
      setEditMode(false);
      setProfile({ ...profile, name: form.name, address: form.address });
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This cannot be undone."
      )
    )
      return;
    setSaving(true);
    setError("");
    try {
      await deleteDoc(doc(db, "users", user.uid));
      await deleteUser(auth.currentUser);
      await logout();
      navigate("/register");
    } catch (err) {
      setError(err.message || "Failed to delete account.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <Spinner animation="border" className="d-block mx-auto mt-5" />;

  return (
    <Container className="py-5">
      <Card className="mx-auto" style={{ maxWidth: 500 }}>
        <Card.Body>
          <h3 className="mb-4">Profile</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          {profile ? (
            <>
              {!editMode ? (
                <>
                  <div className="text-center mb-3">
                    <img
                      src={
                        user.photoURL ||
                        "https://via.placeholder.com/100x100?text=Photo"
                      }
                      alt="Profile"
                      className="rounded-circle mb-2"
                      style={{
                        width: 100,
                        height: 100,
                        objectFit: "cover",
                        border: "2px solid #eee",
                      }}
                    />
                  </div>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Name:</strong> {profile.name || "-"}
                  </p>
                  <p>
                    <strong>Address:</strong> {profile.address || "-"}
                  </p>
                  <p>
                    <strong>Payment Methods:</strong>{" "}
                    <span className="text-muted">(Not yet implemented)</span>
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => setEditMode(true)}
                    className="me-2"
                  >
                    Edit Profile
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleDelete}
                    disabled={saving}
                  >
                    Delete Account
                  </Button>
                </>
              ) : (
                <Form onSubmit={handleSave}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Button type="submit" disabled={saving} className="me-2">
                    {saving ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setEditMode(false)}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                </Form>
              )}
            </>
          ) : (
            <p>No profile data found.</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;
