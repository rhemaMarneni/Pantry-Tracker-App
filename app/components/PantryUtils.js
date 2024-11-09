import React, { useState } from "react";
import { Button, Modal } from "@mui/material";
import { ContentCopy, Add } from "@mui/icons-material";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./../firebase";

export default function PantryUtils({
  searchQuery,
  setSearchQuery,
  newItem,
  setNewItem,
  pantryItems,
  showAlert,
}) {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const [selectedButtons, setSelectedButtons] = useState([]);
  const [copiedItems, setCopiedItems] = useState("");

  //all categories
  const buttonLabels = [
    { label: "Vegetable", color: "#35a145" },
    { label: "Fruit", color: "#EE6347" },
    { label: "Nuts", color: "#a17035" },
    { label: "Dairy", color: "#4f7fe0" },
    { label: "Grain", color: "##d9a045" },
    { label: "Rice & Pasta", color: "#adad74" },
    { label: "Meats", color: "#d94545" },
    { label: "Seafood", color: "#54bcbf" },
    { label: "Bread", color: "#cc8723" },
    { label: "Beverage", color: "#f01313" },
    { label: "Fats & Oils", color: "#f0c013" },
    { label: "Herbs & Spices", color: "#477a5d" },
    { label: "Sweets & Desserts", color: "#f06ede" },
    { label: "Frozen Food", color: "#84b1c2" },
    { label: "Snack", color: "#f58936" },
    { label: "Canned Food", color: "#FFA500" },
    { label: "Condiments & Sauces", color: "#c03a2b" },
    { label: "Legumes", color: "#194538" },
    { label: "Cooked Food", color: "#a252d1" },
    { label: "Other", color: "#9c9c9c" },
  ];

  //open modal
  function fillDetails() {
    setOpen(true);
  }

  //handleClick
  const handleButtonClick = (buttonLabel) => {
    setSelectedButtons((prevState) => {
      const updatedButtons = prevState.includes(buttonLabel)
        ? prevState.filter((label) => label !== buttonLabel)
        : [...prevState, buttonLabel];
      // Use the updated buttons here if needed
      setNewItem({ ...newItem, categories: updatedButtons });
      return updatedButtons; // Make sure to return the updated state
    });
  };

  //add items to DB
  const addItem = async (e) => {
    e.preventDefault();
    //prevent blanks
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
        categories: newItem.categories,
      });
      setNewItem({ name: "", quantity: "", measure: "", categories: [] });
    } else {
      setNewItem({ name: "", quantity: "", measure: "", categories: [] });
    }
    handleClose();
    setSelectedButtons([]);
    showAlert("Item added successfully", "success");
  };

  //copy items
  function copyItems(){
    const currArray = pantryItems.map((item)=> item.name);
    setCopiedItems(currArray.join(", "));
    navigator.clipboard.writeText(copiedItems).then(()=>{
      if (showAlert) {
        showAlert("Cart Items Copied", "info");
      }
    });
  }

  return (
    <div className="px-4 flex flex-row justify-between items-center gap-2">
      {/* search bar */}
      <form
        className="flex justify-center text-black w-2/4"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <input
          className="p-3 my-4 border border-black rounded-full w-full"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
          placeholder="Search Pantry"
        />
      </form>

      {/* copy button */}
      <Button
        variant="outlined"
        onClick={copyItems}
        className="border-gray-900 text-gray-900 font-bold hover:border-none hover:shadow-lg hover:bg-blue-400 hover:text-white h-12 text-sm"
      >
        <div className="flex flex-row gap-1 py-1 items-center text-sm">
          Copy Pantry
          <ContentCopy />
        </div>
      </Button>
      <Button
        variant="outlined"
        className="bg-orange-400 hover:bg-orange-500 text-white font-bold border-none shadow-lg h-12"
        type="submit"
        onClick={fillDetails}
      >
        <div className="flex flex-row gap-1 py-1 items-center">
          Add item
          <Add />
        </div>
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl w-full max-h-[80vh] overflow-auto bg-white border-2 border-black shadow-lg p-6 rounded">
          <h3 className="py-3 font-bold font-roboto uppercase">
            Add a new item into your pantry
          </h3>
          <form className="grid grid-cols-6 items-center text-black">
            <input
              className="col-span-2 p-3 border border-black rounded"
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              type="text"
              value={newItem.name}
              placeholder="Enter Item"
            />
            <input
              className="col-span-2 p-3 border border-black mx-1 rounded"
              onChange={(e) =>
                setNewItem({ ...newItem, quantity: e.target.value })
              }
              value={newItem.quantity}
              type="number"
              placeholder="Quantity"
            />
            <select
              id="options"
              value={newItem.measure}
              onChange={(e) =>
                setNewItem({ ...newItem, measure: e.target.value })
              }
              className="col-span-1 p-3 border border-black mx-1 rounded text-gray-500"
            >
              <option value="" disabled>
                Measure
              </option>
              <option value="ct">ct</option>
              <option value="lb">lb</option>
              <option value="oz">oz</option>
              <option value="kg">kg</option>
              <option value="g">g</option>
              <option value="l">l</option>
              <option value="ml">ml</option>
            </select>
          </form>
          <h3 className="py-3 font-bold">Choose upto 3 categories:</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {buttonLabels.map((category) => {
              const isSelected =
                Array.isArray(selectedButtons) &&
                selectedButtons.includes(category.label); // Check if the button is selected

              return (
                <Button
                  key={category.label}
                  onClick={() => handleButtonClick(category.label)}
                  variant={isSelected ? "contained" : "outlined"} // Conditionally set the variant
                  sx={{
                    minWidth: 120, // Set a minimum width for buttons to keep them consistent
                    fontWeight: isSelected ? "bold" : "normal", // Bold font for active buttons
                    backgroundColor: isSelected
                      ? category.color
                      : "transparent", // Background color when active
                    color: isSelected ? "#fff" : category.color, // Text color when active
                    borderColor: category.color, // Border color when active
                  }}
                >
                  {category.label}
                </Button>
              );
            })}
          </div>
          {/* Add item button */}
          <div className="flex flex-row justify-end">
            <Button
              variant="outlined"
              className="bg-orange-400 hover:bg-orange-500 text-white font-bold border-none shadow-lg h-12"
              type="submit"
              onClick={addItem}
            >
              <div className="flex flex-row gap-1 py-1 items-center">
                Add to pantry
              </div>
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
