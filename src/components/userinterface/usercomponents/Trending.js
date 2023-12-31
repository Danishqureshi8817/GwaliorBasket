import React, { createRef,useEffect,useState } from "react";
import Slider from "react-slick";
import { ServerURL,getData, posttData } from "../../services/ServerServices";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import { Button, useMediaQuery, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

// import Button from "@mui/material";

export default function Trending() {
  
  const navigate = useNavigate()
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 5000,
    arrow: false,
    responsive: [
      {
        breakpoint: 1324,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },

      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 840,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }}]
  };

  var slider = createRef();
 

  function handleLeftClick() {
    slider.current.slickNext();
  }
  function handleRightClick() {
    slider.current.slickPrev();
  }


  const [trendingProduct,setTrendingProduct]=useState([])
  

  const handleClick = async(pid) =>{
  //  var result = await posttData("userinterface/fetch_all_by_productlist",{productid:pid})
  navigate(`/allcategory`,{state:{productid:pid,page:'Trending'}})
  }




  const fetchProducts = async () => {
    var result = await getData("userinterface/fetch_all_productstrending");
    
    

    setTrendingProduct(result.data)
  };
  useEffect(function () {
    fetchProducts();
  }, []);





  function playImages() {
    return trendingProduct.map((item) => {
      return (
        <div>
          <Paper onClick={()=>handleClick(item.productid)} elevation={3} style={{ width: 180, height: 260, margin: 10 }}>
            <div style={{ padding: 10 }}>
              <div
                style={{
                  width: 160,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <img
                  src={`${ServerURL}/images/${item.image}`}
                  style={{ width: 75, height: 75 }}
                />
              </div>

              <div
                style={{
                  fontWeight: "bolder",
                  fontSize: 14,
                  fontFamily: "Poppins",
                }}
              >
                <p>{item.productname}</p>
              </div>
              <div style={{ color: "#888", fontWeight: 400, marginTop: 9 }}>
                <p> Get best deals</p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: 160,
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div>
                    Hurry Limited Stock
                  </div>
                 
                </div>

                
              </div>
              <Button
                  style={{
                    borderColor: "red",
                    color: "red",
                    width: "95%",
                    height: 37,
                    marginTop:"5%"
                  }}
                  variant="outlined"
                >
                  ADD
                </Button>
            </div>
          </Paper>
        </div>
      );
    });
  }

  return (
    <div style={{ position: "relative" }}>
      {matches ? (
        <></>
      ) : (
        <div
          style={{
            background: "#FFF",
            width: 36,
            height: 36,
            borderRadius: 18,
            display: "flex",
            alignItems: "center",
            position: "absolute",
            left: "1%",
            top: "50%",
            zIndex: 1,
            opacity: 0.7,
          }}
        >
          <KeyboardArrowLeftIcon
            onClick={handleLeftClick}
            style={{ fontSize: 34 }}
          />
        </div>
      )}
      <h3>Trending Products</h3>
      <Slider ref={slider} {...settings}>
        {playImages()}
      </Slider>

      {matches ? (
        <></>
      ) : (
        <div
          style={{
            background: "#FFF",
            width: 36,
            height: 36,
            borderRadius: 18,
            display: "flex",
            alignItems: "center",
            position: "absolute",
            right: "1%",
            top: "50%",
            zIndex: 1,
            opacity: 0.7,
          }}
        >
          <KeyboardArrowRightIcon
            onClick={handleRightClick}
            style={{ fontSize: 34 }}
          />
        </div>
      )}
    </div>
  );
}
