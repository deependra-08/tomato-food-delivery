import { useEffect, useState } from "react";
import axios from "axios";
import { StoreContext } from "./StoreContext.jsx";
import { food_list as staticFoodList } from "../assets/assets";

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  // In production, set VITE_BACKEND_URL in your deployment platform's
  // env vars (e.g. Vercel) to your deployed backend's URL.
  const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const [token, setToken] = useState();
  const [food_list, setFoodList] = useState(staticFoodList);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }

    if(token){
      await axios.post(url+"/api/cart/add",{itemId},{headers:{token}})
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if(token){
      await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}})
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => String(product._id) === String(item));
        if (!itemInfo) {
          itemInfo = staticFoodList.find((product) => String(product._id) === String(item));
        }
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(url + "/api/food/list");
      if (response?.data?.data?.length) {
        setFoodList(response.data.data);
      }
    } catch (error) {
      console.warn("Food list fetch failed, using static asset data.", error);
    }
  };

  const loadCartData = async (token) =>{
    const response = await axios.post(url+"/api/cart/get",{},{headers:{token}});
    setCartItems(response.data.cartData);
  }

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await loadCartData(localStorage.getItem("token"));
      }
    }
    loadData();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    search,
    setSearch,
    showSearch,
    setShowSearch,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
