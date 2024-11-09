import { addDoc, collection, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

  //add items to DB
  export const addItemToDB = async (newItem) => {
    if (
      newItem.name !== "" &&
      newItem.quantity !== "" &&
      newItem.quantity > 0 &&
      newItem.measure !== ""
    ) {
      // setItems([...items, newItem]) //if no database
      await addDoc(collection(db, "items"), {
        name: newItem.name.trim().toLowerCase(),
        quantity: newItem.quantity,
        measure: newItem.measure,
      });
    //   setNewItem({ name: "", quantity: "", measure: "" });
    } else {
    //   setNewItem({ name: "", quantity: "", measure: "" });
    }
  };