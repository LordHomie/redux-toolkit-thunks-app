import { uiActions } from "../ui-slice";
import { cartActions } from "../cart-slice";

export const fetchCartData = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await fetch(
        "https://redux-c13fe-default-rtdb.firebaseio.com/cart.json"
      );
      if (!response.ok) {
        throw new Error("Coudn't fetch cart data.");
      }

      const data = await response.json();

      return data;
    };

    try {
      const cartData = await fetchData();
      dispatch(
        cartActions.replaceCart({
          items: cartData.items || [],
          totalQuantity: cartData.totalQuantity,
        })
      );
    } catch (error) {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error!",
          message: "Sending cart failed!",
        })
      );
    }
  };
};

// This is an action creator Thunk. It's a function that returns another function which executes code with side effects and eventually returns the action object.
export const sendRequest = (cart) => {
  return async (dispatch) => {
    dispatch(
      uiActions.showNotification({
        status: "pending",
        title: "Sending...",
        message: "Sending cart date!",
      })
    );
    const sendCartData = async () => {
      // cart after the slash "/" wil make a new node in the database and write data to it
      // this link from Babushka.edu firebase account
      const response = await fetch(
        "https://redux-c13fe-default-rtdb.firebaseio.com/cart.json",
        {
          method: "PUT",
          body: JSON.stringify({
            items: cart.items,
            totalQuantity: cart.totalQuantity,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Sending cart data failed.");
      }
    };

    try {
      await sendCartData();
      dispatch(
        uiActions.showNotification({
          status: "success",
          title: "Success...",
          message: "Sending cart succeeded!",
        })
      );
    } catch (error) {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error!",
          message: "Sending cart failed!",
        })
      );
    }
  };
};
