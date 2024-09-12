'use client'
import React, {useState, useEffect} from 'react';
import { CircularProgress, Modal, TableBody, Typography} from '@mui/material';
import { collection, addDoc, getDocs, getDoc, querySnapshot, onSnapshot, query, deleteDoc,doc, updateDoc, where} from "firebase/firestore"; 
import {db} from './firebase'
import {generateRecipes, generateStatus} from "./actions"
import Header from './components/Header';
import Footer from './components/Footer';

export default function Home() {
  const [items, setItems] = useState([])
  const [newItem, setNewItem] = useState({name:'', quantity:'', measure: ''})
  const [itemCount, setItemCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [status, setStatus]= useState([]);
  const [prompt, setPrompt] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [loading, setLoading] = useState(true);

  //add items to DB
  const addItem = async(e) =>{
    e.preventDefault();
    //prevent blanks
    if (newItem.name !== '' && newItem.quantity !== '' && newItem.quantity > 0 && newItem.measure !== ''){
      // setItems([...items, newItem]) //if no database
      await addDoc(collection(db, 'items'),{
        name: newItem.name.trim().toLowerCase(),
        quantity: newItem.quantity,
        measure: newItem.measure,
      })
      setNewItem({name: '', quantity:'', measure: ''})
    } else {setNewItem({name: '', quantity:'', measure: ''})}
  }

  //Read items from DB
  useEffect(()=>{
    let q = query(collection(db, 'items'))

    //for search query
    if (searchQuery.trim() !== '') {
      q = query(
        collection(db, 'items'),
        where('name', '>=', searchQuery),
        where('name', '<=', searchQuery + '\uf8ff')
      );
    }

    //for rendering all items in DB
    const unsubscribe = onSnapshot(q, (querySnapshot)=>{
      let itemsArr = []
      querySnapshot.forEach((doc) => {
        itemsArr.push({...doc.data(), id:doc.id})
      })
      setItems(itemsArr)

      //for ingredients in prompt
      const ingredients = itemsArr.map(item => item.name)
      setPrompt(ingredients)

      //Get "total" from items
      const calculateItemCount = () => {
        setItemCount(itemsArr.length)
      }

      calculateItemCount()
      return () => unsubscribe();
    })
  },[searchQuery])

  //Deleting items
  const deleteItem = async(id) => {
    await deleteDoc(doc(db, 'items', id))
  }

  //Updating quantities
  const increaseQuantity = async(id) => {
    const currDoc = doc(db, 'items', id)
    const docData = await getDoc(currDoc)
    const newQuantity = parseFloat(docData.data().quantity) + 1;

    await updateDoc(currDoc, {
      quantity: newQuantity // Increment quantity by 1
    })
  }

  const decreaseQuantity = async(id) => {
    const currDoc = doc(db, 'items', id)
    const docData = await getDoc(currDoc)
    const itemQuantity = parseFloat(docData.data().quantity);

    if (itemQuantity > 1){
      await updateDoc(currDoc, {
        quantity: itemQuantity - 1
      })
    } else {
      deleteItem(id)
    }
  }

  //OpenAI for recipe recommendations (action.js)
  async function getRecipes(){
    setOpen(true);
    setLoading(true);
    let r = await generateRecipes(prompt)
    setRecipes(r)
    let s = await generateStatus(prompt);
    setStatus(s)
    setLoading(false);
  }

  // Determine text color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Very Healthy':
        return 'text-green-500';
      case 'Moderately Healthy':
        return 'text-yellow-500';
      case 'Unhealthy':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };


  return (
    <body>
    <main className="flex min-h-screen flex-col items-center justify-between sm:p-24 p-4">
      <Header></Header>
      <div className="z-10 max-w-5xl w-full items-center justify-between font-sans text-sm">
          <div className="flex gap-5 flex-col sm:flex-row">
            {/* info box */}
            <div className="flex justify-around bg-white p-4 rounded-lg text-black shadow-md h-[460px] md:h-520px w-96 lg:text-base md:text-sm sm:text-xs">
              <div className="flex flex-col justify-center items-center px-3 text-center font-sans">
                <p className="py-3 text-lg font-semibold text-green-700">Total Unique Ingredients: {itemCount}</p>
                <p className="py-3 font-bold italic">“Ask Gorgon” helps you discover creative meal ideas based on the items in your pantry. Simply provide your available ingredients, and you’ll receive three quick and personalized <span className="text-green-500">AI RECIPE RECOMMENDATIONS</span> to make the most of what you have. </p>
                <button type="submit" onClick={()=>getRecipes()} className="inline-flex items-center justify-center shadow-lg px-8 py-4 my-4 font-sans font-semibold text-base tracking-wide text-white bg-black rounded-lg h-[60px]">
                👨‍🍳 Ask Gorgon
                </button>
                <p className="py-3 text-sm italic">This application is under constant improvements for OpenAI integration. Please allow a wait time of <strong>5-10 seconds</strong>.</p>
              </div>
            </div>
            {/* pantry box */}
            <div className="bg-white p-4 rounded-lg text-black shadow-md text-base">
              <form className="flex justify-center text-black" onSubmit={(e) => {e.preventDefault()}}>
                  <input
                    className=" w-3/4 p-3 my-4 border border-black rounded-full"
                    type="text"
                    value={searchQuery}
                    onChange={(e)=>setSearchQuery(e.target.value.toLowerCase())}
                    placeholder="Search Pantry"
                  />
              </form>
              <form className="grid grid-cols-6 items-center text-black">
                <input
                  className="col-span-2 p-3 border border-black rounded"
                  onChange={(e)=>setNewItem({...newItem, name: e.target.value})}
                  type="text"
                  value={newItem.name}
                  placeholder="Enter Item"
                />
                <input
                  className="col-span-2 p-3 border border-black mx-1 rounded"
                  onChange={(e)=>setNewItem({...newItem, quantity: e.target.value})}
                  value={newItem.quantity}
                  type="number"
                  placeholder="Quantity"
                />
                <select
                  id="options"
                  value={newItem.measure}
                  onChange={(e)=>setNewItem({...newItem, measure: e.target.value})}
                  className="col-span-1 p-3 border border-black mx-1 rounded text-gray-500"
                >
                  <option value="" disabled>Measure</option>
                  <option value="ct">ct</option>
                  <option value="lb">lb</option>
                  <option value="oz">oz</option>
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="l">l</option>
                  <option value="ml">ml</option>
                </select>
                <button className="text-black bg-gray-200 hover:bg-green-500 hover:text-white p-2.5 rounded text-lg" type="submit" onClick={addItem}>
                  Add
                </button>
              </form>
              <ul className="">
                {items.map((item,id)=>(
                  <li key={id} className="my-4 flex justify-between bg-slate-950">
                    <div className="p-4 w-full flex justify-between">
                      <span className="capitalize flex items-center">{item.name}</span>
                      <div className="flex items-center">
                        <button onClick={() => decreaseQuantity(item.id)} className="flex items-center rounded p-3 bg-green-500 hover:bg-gray-200 w-8 h-8">
                        -
                        </button>
                        <span className="px-5">{item.quantity}{item.measure}</span>
                        <button onClick={() => increaseQuantity(item.id)} className="flex items-center rounded p-3 bg-green-500 hover:bg-gray-200 w-8 h-8">
                          +
                        </button>
                        <button onClick={() => deleteItem(item.id)} className="p-1 mx-3 rounded bg-slate-200 w-16 h-8 text-black text-sm hover:text-white hover:bg-red-500">
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
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
                  <p className="italic"> Your recipes recommendations are loading...</p>
                </div>
                ) : (
                <div>
                <Typography id="modal-modal-title" variant="h4" component="h2">
                  Recipe List
                </Typography>
                <Typography id="modal-modal-title" variant="h6" component="h6">
                  Current status of your Pantry: <span className={getStatusColor(status.status)}>{status.status}</span>
                </Typography>
                <div className="mt-4 flex justify-around gap-8 flex-wrap">
                  {recipes.map((recipe, index) => (
                    <div key={index} className="mb-6">
                      <Typography variant="h6">{recipe.name}</Typography>
                      <Typography variant="subtitle1">{recipe.description}</Typography>
                      <Typography variant="body1" className="mt-2 font-bold">Ingredients:</Typography>
                      <ul className="list-disc pl-5">
                        {recipe.ingredients.map((ingredient, i) => (
                          <li key={i}>{ingredient}</li>
                        ))}
                      </ul>
                      <Typography variant="body1" className="mt-2 font-bold">Instructions:</Typography>
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
          </div>
      </div>
      <Footer></Footer>
    </main>
    </body>
  );
}