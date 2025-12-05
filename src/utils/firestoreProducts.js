// src/utils/firestoreProducts.js
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import app from "../firebase";

const db = getFirestore(app);
const productsCol = collection(db, "products");

export const fetchProducts = async () => {
  const snapshot = await getDocs(productsCol);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const createProduct = async (product) => {
  const docRef = await addDoc(productsCol, product);
  return docRef.id;
};

export const fetchProduct = async (id) => {
  const docRef = doc(db, "products", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() };
  return null;
};

export const updateProduct = async (id, data) => {
  const docRef = doc(db, "products", id);
  await updateDoc(docRef, data);
};

export const deleteProduct = async (id) => {
  const docRef = doc(db, "products", id);
  await deleteDoc(docRef);
};
