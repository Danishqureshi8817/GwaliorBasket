import { Divider, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector,useDispatch } from "react-redux";

const CartItemPricing = (props) => {
  const [totalPrice, setTotalPrice] = useState("");


//   const dispatch = useDispatch();
//   const userData = useSelector((state) => state.user);
//  var userdata=Object.values(userData)[0]
//   const mobileno = Object.keys(userData);
//   console.log("Pricing User",userdata)


  const price = () => {
    let total =props.data.reduce((a,b) => {
     return a+b.offerprice*b.qty;
    },0);

    // userData[0]['totalpayment'] = total

    // dispatch({type:'ADD_USER',payload:[mobileno],userdata})
    setTotalPrice(total);
    // props.pageRefresh();
    
  };



  useEffect(() => {
    price();
  }, [props]);

  return (
    <>
      <Grid item xs={11.6} bgcolor="white" p={2} mx="auto" mt={3} lineHeight={1.8}>
        <div>
          <b>Items Total</b>
          <b style={{ float: "right" }}>Rs. {totalPrice}</b>
        </div>
        <div>
          <span>Handling Charge</span>
          <span style={{ float: "right" }}>Rs. 15</span>
        </div>
        <div>
          <span>Delivery Fee</span>
          <span style={{ float: "right" }}>Rs. 40</span>
        </div>
        <Divider sx={{ my: 1 }} />
        <div>
          <b>Total Fee</b>
          <b style={{ float: "right" }}>Rs. {totalPrice + 55}</b>
        </div>
      </Grid>
    </>
  );
};

export default CartItemPricing;
