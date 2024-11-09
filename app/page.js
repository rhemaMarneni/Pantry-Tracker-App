"use client";
import React, { useState, useEffect } from "react";
import {
  CircularProgress,
  Modal,
  Typography,
  Drawer,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  Divider,
  Alert,
} from "@mui/material";
import {
  ShoppingBag,
  Book as BookIcon,
  AddCircleOutline,
  RemoveCircleOutline,
  Delete,
  Category,
} from "@mui/icons-material";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  querySnapshot,
  onSnapshot,
  query,
  deleteDoc,
  doc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { generateRecipes, generateStatus } from "./actions";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Title from "./components/Title";
import PantryUtils from "./components/PantryUtils";

export default function Home() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: "",
    measure: "",
    categories: [],
  });
  const [itemCount, setItemCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [status, setStatus] = useState([]);
  const [prompt, setPrompt] = useState([]);
  const [open, setOpen] = useState(false);
  const [comingsoon, setComingsoon] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleMessage = () => setComingsoon(false);
  const [loading, setLoading] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("");

  //Read items from DB
  useEffect(() => {
    let q = query(collection(db, "items"));

    //for search query
    if (searchQuery.trim() !== "") {
      q = query(
        collection(db, "items"),
        where("name", ">=", searchQuery),
        where("name", "<=", searchQuery + "\uf8ff")
      );
    }

    //for rendering all items in DB
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = [];
      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });
      setItems(itemsArr);

      //for ingredients in prompt
      const ingredients = itemsArr.map((item) => item.name);
      setPrompt(ingredients);

      //Get "total" from items
      const calculateItemCount = () => {
        setItemCount(itemsArr.length);
      };

      calculateItemCount();
      return () => unsubscribe();
    });
  }, [searchQuery]);

  //Deleting items
  const deleteItem = async (id) => {
    await deleteDoc(doc(db, "items", id));
  };

  //Updating quantities
  const increaseQuantity = async (id) => {
    const currDoc = doc(db, "items", id);
    const docData = await getDoc(currDoc);
    const newQuantity = parseFloat(docData.data().quantity) + 1;

    await updateDoc(currDoc, {
      quantity: newQuantity, // Increment quantity by 1
    });
  };

  const decreaseQuantity = async (id) => {
    const currDoc = doc(db, "items", id);
    const docData = await getDoc(currDoc);
    const itemQuantity = parseFloat(docData.data().quantity);

    if (itemQuantity > 1) {
      await updateDoc(currDoc, {
        quantity: itemQuantity - 1,
      });
    } else {
      deleteItem(id);
    }
  };

  //OpenAI for recipe recommendations (action.js)
  async function getRecipes() {
    setOpen(true);
    setLoading(true);
    let r = await generateRecipes(prompt);
    setRecipes(r);
    let s = await generateStatus(prompt);
    setStatus(s);
    setLoading(false);
  }

  function openMessage(){
    setComingsoon(true);
  }

  // Determine text color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case "Very Healthy":
        return "text-green-500";
      case "Moderately Healthy":
        return "text-yellow-500";
      case "Unhealthy":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  //for alerts
  const showAlert = (alertmsg, alertsev) => {
    setAlertMessage(alertmsg);
    setAlertSeverity(alertsev);
    setAlertVisible(true);
    setTimeout(() => {
      setAlertVisible(false);
    }, 3000);
  };

  return (
    <body>
      <main className="flex flex-col min-h-screen">
        {/* side menu */}
        <div className="fixed top-0 left-0 h-full w-1/6 bg-white p-4 flex items-center shadow z-20">
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={openMessage}>
                <ListItemIcon>
                  <ShoppingBag className="text-orange-400" />
                </ListItemIcon>
                <ListItemText primary="Grocery List" className="text-black" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={openMessage}>
                <ListItemIcon>
                  <BookIcon className="text-orange-400" />
                </ListItemIcon>
                <ListItemText primary="My Recipes" className="text-black" />
              </ListItemButton>
            </ListItem>
          </List>
        </div>
        {/* scrollable main component */}
        <div className="flex flex-col bg-gray-100 ml-[16.66%] flex-grow">
          <Header></Header>
          {/* rightside */}
          <div className="flex flex-grow gap-2 mr-4">
            <Stack
              direction="column"
              spacing={2}
              sx={{
                justifyContent: "center",
                alignItems: "center",
              }}
              className="flex-grow w-1/3 p-4"
            >
              {/* Pantry container */}
              <div className="p-1 w-full">
                <div className="flex flex-row justify-between items-center">
                  <Title />
                  {alertVisible && (
                    <div className="flex-1 ml-4">
                      <Alert severity={alertSeverity} variant="filled">
                        {alertMessage}
                      </Alert>
                    </div>
                  )}
                </div>
                <PantryUtils
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  newItem={newItem}
                  setNewItem={setNewItem}
                  pantryItems={items}
                  showAlert={showAlert}
                ></PantryUtils>
                {/* pantry box */}
                <div className="bg-white p-4 rounded-lg text-black shadow-md text-base">
                  <ul className="">
                    {/* each item */}
                    {items.map((item, id) => (
                      <React.Fragment key={id}>
                        <li
                          key={id}
                          className="my-4 flex justify-between flex-col"
                        >
                          <div className="p-1 w-full flex justify-between">
                            <span className="capitalize flex items-center">
                              {item.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <RemoveCircleOutline
                                onClick={() => decreaseQuantity(item.id)}
                                className="text-gray-500 hover:text-black cursor-pointer"
                                fontSize="medium"
                              />
                              <span className="px-2 w-12 text-center">
                                {item.quantity}
                                {item.measure}
                              </span>
                              <AddCircleOutline
                                onClick={() => increaseQuantity(item.id)}
                                className="text-gray-500 hover:text-black cursor-pointer"
                                fontSize="medium"
                              />
                              <Delete
                                onClick={() => deleteItem(item.id)}
                                className="text-gray-600 hover:text-red-500"
                              />
                            </div>
                          </div>
                          <div className="flex flex-row gap-2">
                            {Array.isArray(item.categories) &&
                              item.categories.length > 0 &&
                              item.categories.map((category, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-gray-200 rounded text-sm"
                                >
                                  {category}
                                </span>
                              ))}
                          </div>
                        </li>
                        {id < items.length - 1 && <Divider className="my-1" />}
                      </React.Fragment>
                    ))}
                  </ul>
                </div>
              </div>
            </Stack>
            {/* info box */}
            <div className="flex flex-1 justify-around bg-white p-4 rounded-lg text-black shadow-md h-[460px] md:h-520px w-72 lg:text-base md:text-sm sm:text-xs mt-28">
              <div className="flex flex-col justify-center items-center px-3 text-center font-sans">
                <p className="py-3 text-lg font-semibold text-orange-600">
                  Total Unique Ingredients: {itemCount}
                </p>
                <p className="py-3 font-bold italic">
                  “Ask Gorgon” helps you discover creative meal ideas based on
                  the items in your pantry. Simply provide your available
                  ingredients, and you’ll receive three quick and personalized{" "}
                  <span className="text-orange-800">
                    AI RECIPE RECOMMENDATIONS
                  </span>{" "}
                  to make the most of what you have.{" "}
                </p>
                <button
                  type="submit"
                  onClick={() => getRecipes()}
                  className="inline-flex items-center justify-center shadow-lg px-8 py-4 my-4 font-sans font-semibold text-base tracking-wide text-white bg-black rounded-lg h-[60px]"
                >
                  👨‍🍳 Ask Gorgon
                </button>
                <p className="py-3 text-sm italic">
                  This application is under constant improvements for OpenAI
                  integration. Please allow a wait time of{" "}
                  <strong>5-10 seconds</strong>.
                </p>
              </div>
            </div>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl w-full max-h-[80vh] overflow-auto bg-white border-2 border-black shadow-lg p-6 rounded">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <CircularProgress />
                    <p className="italic">
                      {" "}
                      Your recipes recommendations are loading...
                    </p>
                  </div>
                ) : (
                  <div>
                    <Typography
                      id="modal-modal-title"
                      variant="h4"
                      component="h2"
                    >
                      Recipe List
                    </Typography>
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h6"
                    >
                      Current status of your Pantry:{" "}
                      <span className={getStatusColor(status.status)}>
                        {status.status}
                      </span>
                    </Typography>
                    <div className="mt-4 flex justify-around gap-8 flex-wrap">
                      {recipes.map((recipe, index) => (
                        <div key={index} className="mb-6">
                          <Typography variant="h6">{recipe.name}</Typography>
                          <Typography variant="subtitle1">
                            {recipe.description}
                          </Typography>
                          <Typography
                            variant="body1"
                            className="mt-2 font-bold"
                          >
                            Ingredients:
                          </Typography>
                          <ul className="list-disc pl-5">
                            {recipe.ingredients.map((ingredient, i) => (
                              <li key={i}>{ingredient}</li>
                            ))}
                          </ul>
                          <Typography
                            variant="body1"
                            className="mt-2 font-bold"
                          >
                            Instructions:
                          </Typography>
                          <ol className="list-decimal pl-5">
                            {recipe.instructions.map((instruction, i) => (
                              <li>{instruction}</li>
                            ))}
                          </ol>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Modal>
            <Modal
        open={comingsoon}
        onClose={handleMessage}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl w-full max-h-[80vh] overflow-auto bg-white border-2 border-black shadow-lg p-6 rounded">
        <p className="text-center">New Feature Coming Soon</p></div>
      </Modal>
          </div>
          <Footer></Footer>
        </div>
      </main>
    </body>
  );
}
