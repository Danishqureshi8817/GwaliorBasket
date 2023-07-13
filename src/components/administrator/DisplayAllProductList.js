import { useEffect,useState } from "react";
import MaterialTable from "@material-table/core";
import { getData,posttData} from "../services/ServerServices";
import { Avatar,Button,Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle,TextField,Grid,IconButton,FormControl,InputLabel,Select,MenuItem,FormLabel,RadioGroup,FormControlLabel,Radio, } from "@mui/material";
import PhotoCamera from '@mui/icons-material/PhotoCamera';

import { ServerURL } from "../services/ServerServices";
import {useStyles} from './DisplayAllProductListCss' 
import CloseIcon from '@mui/icons-material/Close';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";


export default function DisplayAllProductList(props)
{
 
    var classes = useStyles()


    const navigate = useNavigate()


const [productLists,setProductLists] = useState([])
   

const fetchAllProductList=async()=>{
   
  var result=await getData('listproduct/fetch_all_productlist')
  //alert(JSON.stringify(result.data))
   setProductLists(result.data)
}

useEffect(function(){
   fetchAllProductList()
},[])




    function showAllProductList() {
        return (
          <MaterialTable
            title={<span className={classes.headingStyle}>ProductList Details</span>}
            columns={[
              { title: 'Company/Category', 
            render:rowData=><div>{rowData.companyname}<br/>{rowData.categoryname}</div> },
            { title: 'Product', field: 'productname' },
              { title: 'Weight', field: 'weight' },
      
            { title: 'Price', field: 'price' },
                 { title: 'Offerprice', field: 'offerprice' },
                      { title: 'Description', field: 'description' },
            { title: 'Last Updation',
              render:rowData=><div>{rowData.createdat}<br/>{rowData.updateat}<br/>{rowData.createdby}</div>
            },
           
            ]}
            data={ productLists }        
            actions={[
                 {
                  icon:'add',
                  isFreeAction:true,
                  tooltip:'Add Product',
                  onClick:()=>navigate('/dashboard/productlist')
                 },
  
              {
                icon: 'edit',
                tooltip: 'EditUser',
               
               
              },
              {
                icon: 'delete',
                tooltip: 'Delete User',
               
              }
            ]}
          />
        )
      }
  
  return(
  
    <div className={classes.mainContainer}>
     <div className={classes.box}>
        {showAllProductList()}
    
   
     </div>
    </div>
  )
  
  
  }