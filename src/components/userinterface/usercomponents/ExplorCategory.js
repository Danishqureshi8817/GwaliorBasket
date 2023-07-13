import React, { createRef,useState,useEffect } from "react";
import Slider from "react-slick";

import { useMediaQuery } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { getData, ServerURL } from "../../services/ServerServices";
import { useNavigate } from "react-router-dom";

export default function ExplorCategory(){
      

  const navigate = useNavigate()
    const theme = useTheme();

  const xs = useMediaQuery(theme.breakpoints.down('xs'))
  const sm = useMediaQuery(theme.breakpoints.down('sm'))
  const md = useMediaQuery(theme.breakpoints.down('md'))
  const lg = useMediaQuery(theme.breakpoints.down('lg'))
  const xl = useMediaQuery(theme.breakpoints.down('xl'))
  const [categoryList,setCategoryList]=useState([])
  
 
 
  const fetchCategories = async () => {
    var result = await getData("userinterface/fetch_all_category");
    
    setCategoryList(result.data)
  };
  useEffect(function () {
    fetchCategories();
  }, []);

const handleClick=(categoryid)=>{
  navigate(`/allcategory`,{state:{categoryid:categoryid,page:'ExploreCategory'}})
}


  function ExplorImage()
  { return categoryList.map((item)=>{
        return(<div onClick={()=>handleClick(item.categoryid)} style={{width:'10%',padding:3,background:'#f7eaf9',borderRadius:
        '10%',margin:3,display:'flex',alignItems:'center',flexDirection:'column',cursor:"pointer"}}><div style={{color:'#792c85',fontFamily:'Poppins',
            fontSize:xs?4:sm?6:md?8:lg?16:16,fontWeight:'bolder',textAlign:'center'}}>{item.category}</div><img src={`${ServerURL}/images/${item.icon}`} style={{width:'60%'}}/></div>)
  })
  } 




    return(<div>
        
<h3>Explore By Categories</h3>
 <div style={{padding:5,display:'flex',flexDirection:'row',flexWrap:'wrap'}}>
 {ExplorImage()}
 </div>



    </div>)





}