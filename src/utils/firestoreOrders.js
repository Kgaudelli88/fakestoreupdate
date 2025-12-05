// src/utils/firestoreOrders.js
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import app from "../firebase";

const db = getFirestore(app);
const ordersCol = collection(db, "orders");

export const createOrder = async (order) => {
  // order: { userId, products: [{id, title, price, ...}], total, createdAt }
  const docRef = await addDoc(ordersCol, order);
  return docRef.id;
};

export const fetchUserOrders = async (userId) => {
  const q = query(ordersCol, where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const fetchOrder = async (orderId) => {
  const docRef = doc(db, "orders", orderId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() };
  return null;
};
