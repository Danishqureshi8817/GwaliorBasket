import { useEffect,useState } from "react";
import MaterialTable from "@material-table/core";
import { getData,posttData} from "../services/ServerServices";
import { Avatar,Button,Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle,TextField,Grid,IconButton,FormControl,InputLabel,Select,MenuItem,FormLabel,RadioGroup,FormControlLabel,Radio, } from "@mui/material";
import PhotoCamera from '@mui/icons-material/PhotoCamera';

import { ServerURL } from "../services/ServerServices";
import {useStyles} from './DisplayAllProductsCss' 
import CloseIcon from '@mui/icons-material/Close';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";


export default function DisplayAllProducts(props)
{
 
    var classes = useStyles()

    const[companyId,setCompanyId] = useState('')
     const[categoryId,setCategoryId] = useState('')
     const [productId, setProductId] = useState('')
     const[productName,setProductName] = useState('')
     const[description,setDescription] = useState('')
     const[status,setStatus] = useState('')
    const [trending,setTrending] = useState('')
    const[priceType,setPriceType] = useState('')
    const [deal,setDeal] = useState('')
    const[categoryIdS,setCategoryIdS] = useState([])
    const [productLogo,setProductLogo]=useState({fileName:'/assets/watermark.png',bytes:''})
    const [oldPicture, setOldPicture] = useState('')
    const[btnStatus,setBtnStatus] = useState(false)
    const[message,setMessage] = useState('')

    const navigate = useNavigate()

    const handleImage=(event)=>{
      setProductLogo({fileName:URL.createObjectURL(event.target.files[0]),bytes:event.target.files[0]})
      setBtnStatus(true)
    }


    const [open, setOpen] = useState(false);

    const handleCloseDialog=( )=>{
      setOpen(false)
    }


const handleOpenDialog=(rowData )=>{
setCompanyId(rowData.companyid)
setCategoryId(rowData.categoryid)
setProductId(rowData.productid)
setProductName(rowData.productname)
setDescription(rowData.description)
setStatus(rowData.status)
setTrending(rowData.trending)
setPriceType(rowData.pricetype)
setDeal(rowData.deals)

setProductLogo({fileName:`${ServerURL}/images/${rowData.image}`,bytes:''})
setOldPicture(rowData.image)
      setOpen(true)
    } 

    const fetchAllCategory = async()=>{ 
      var result = await getData('category/fetch_all_category')
        setCategoryIdS(result.data)
      /*alert(JSON.stringify(result))
       console.log("States",result)*/
    }
   
     useEffect(function(){
         fetchAllCategory()
     },[])
   
     const fillCategory=()=>{
      return categoryIdS.map((item)=>{
       return (<MenuItem value={item.categoryid}>{item.category}</MenuItem>) 
      })
    }



    const handleCancel=()=>{
      setProductLogo({fileName:`${ServerURL}/images/${oldPicture}`,bytes:''})
      setOldPicture('')
      setBtnStatus(false)
      setMessage("")
     }

     const handleSavePicture=async()=>{
      var formData = new FormData()
      formData.append('productid',productId)
      formData.append('image',productLogo.bytes)
      var result = await posttData('product/edit_product_image',formData)
      if(result.status)
      { 
       setMessage("assets/greentick.gif")
      }
      else{
        setMessage(result.message)
      }
      fetchAllProducts()
      setBtnStatus(false)
    }
  

    const PictureButton=()=>{
      return(<div>
        {btnStatus? <div style={{display:'flex',padding:10}}>
         <Button onClick={handleCancel}>Cancel</Button>
         <Button onClick={handleSavePicture}>Save</Button>
        </div>:<div style={{fontSize:10,color:'green',fontWeight:'bold'}}><img src={`${message}`} width="90"/></div>}
      </div>
  
       
      )
    }

    const handleEditData =async()=>{
      var cd = new Date()
     var dd=cd.getFullYear()+"/"+(cd.getMonth()+1)+"/"+cd.getDate()+" "+cd.getHours()+":"+cd.getMinutes()+":"+cd.getSeconds()
  
      var body ={
       'productid':productId,
        'companyid':companyId,
        'categoryid':categoryId, 
        'productname':productName, 
       'description':description, 
        'status':status,
         'trending':trending,
          'deals':deal, 
          'pricetype':priceType,
      'updateat':dd,
      'createdby':'ADMIN',
      }
      var result =await posttData('product/edit_product_data',body)
      /*alert(result.status)*/
      if(result.status)
      { setOpen(false)
        Swal.fire({
          
          icon: 'success',
          title: result.message,
    
        })
      }
      else{
        Swal.fire({
          icon: 'error',
          title: result.message,
    
        })
      }
      fetchAllProducts()
    }


    const handleDelete=async(rowData)=>{
  
      /*alert(result.status)*/
      Swal.fire({
        title: 'Do you want to delete product?',
        showDenyButton: true,
        denyButtonText: `Cancel`,
        confirmButtonText: 'Delete',
        
      }).then(async(result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          var res = await posttData('product/delete_product_data',{productid:rowData.productid})
          if(res.status){
          Swal.fire({
            icon: 'success',
          title: res.message,
          })
          fetchAllProducts()
          }
          else{
            Swal.fire({
              icon: 'error',
              title: res.message,
        
            })
          }
    
        } else if (result.isDenied) {
          Swal.fire('Delete Process Cancel', '', 'info')
        }
      })
      
    }

    const showProductDetails=()=>{


      return (
        <div>
          <Dialog
            open={open}
            //onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title" style={{display:'flex',justifyContent:'space-between'}}>
             <div style={{display:'flex',alignItems:'center'}}>
             <img src="/assets/logo.png" alt="Company logo" width="40"/>
              Edit Company
             </div>
              <div>
              <CloseIcon style={{cursor:'pointer'}} onClick={handleCloseDialog}/>
              </div>
             
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                         
              <Grid container spacing={2} style={{marginTop:5}}>
  
              <Grid item xs={6}>
                <TextField fullWidth value={companyId} onChange={(e)=>{setCompanyId(e.target.value)}}  label="Company Id" variant="outlined"/>
                </Grid>
                <Grid item xs={6}>
                 <FormControl fullWidth>
                   <InputLabel id="demo-simple-select-label">Category Id</InputLabel>
                   <Select
                   labelId="demo-simple-select-label"
                   id="demo-simple-select"
                   onChange={(e)=>{setCategoryId(e.target.value)}}
                   value={categoryId}
                   label="Category Id"
                  
                    >
                   <MenuItem value={'Choose Category'}>Choose Category...</MenuItem>
                     {fillCategory()}
                   </Select>
                 </FormControl>
                </Grid>
                <Grid item xs={6}>
                <TextField fullWidth value={productName} onChange={(e)=>{setProductName(e.target.value)}} label="Product Name" variant="outlined"/>
                </Grid>
                <Grid item xs={6} >
                <TextField fullWidth value={description} onChange={(e)=>{setDescription(e.target.value)}} label="Description" variant="outlined"/>
                </Grid>
                <Grid item xs={6}>
                 <FormControl fullWidth>
                   <InputLabel id="demo-simple-select-label">Status</InputLabel>
                   <Select
                   labelId="demo-simple-select-label"
                   id="demo-simple-select"
                  
                   onChange={(e)=>{setStatus(e.target.value)}}
                   value={status}
                   label="Status"
                  // onChange={handleChange}
                    >
                   <MenuItem value={"Choose Status"}>Choose Status...</MenuItem>
                   <MenuItem value={"Available"}>Available</MenuItem>
                   <MenuItem value={"Unavailable"}>Unavailable</MenuItem>
                     
                   </Select>
                 </FormControl>
                </Grid>
                <Grid item xs={6}>
                <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label">Trending</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={trending}
        onChange={(e)=>{setTrending(e.target.value)}}
      >
        <FormControlLabel  value="yes" control={<Radio />} label="Yes" />
        <FormControlLabel value="no" control={<Radio />}  label="No" />
        
      </RadioGroup>
    </FormControl>
                </Grid>
                <Grid item xs={6}>
                
                <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label">Deals</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={deal}
        onChange={(e)=>{setDeal(e.target.value)}}
      >
        <FormControlLabel  value={"yes"} control={<Radio />} label="Yes" />
        <FormControlLabel  value={"no"} control={<Radio />} label="No" />
       
      </RadioGroup>
    </FormControl>
                </Grid>
                <Grid item xs={6}>
                 <FormControl fullWidth>
                   <InputLabel id="demo-simple-select-label">Price Type</InputLabel>
                   <Select
                   labelId="demo-simple-select-label"
                   id="demo-simple-select"
                  
                   onChange={(e)=>{setPriceType(e.target.value)}}
                   value={priceType}
                   label="Price Type"
                  // onChange={handleChange}
                    >
                   <MenuItem value={"Choose Price Type"}>Choose Price Type...</MenuItem>
                   <MenuItem value={"Kg"}>Kg</MenuItem>
                   <MenuItem value={"Liter "}>Liter </MenuItem>
                   <MenuItem value={"Pieces"}>Pieces</MenuItem>

                   </Select>
                 </FormControl>
                </Grid>

               

                
               
                <Grid item xs={12} className={classes.rowStyle}>
                <IconButton fullWidth color="primary" aria-label="upload image" component="label">
                 <input hidden accept="image/*" type="file" onChange={handleImage}  />
                <PhotoCamera />
                </IconButton>

                <Avatar
                 alt="Icon"
                 variant="rounded"
                 src={productLogo.fileName}
                 sx={{ width: 56, height: 56 }}
                 />
                  <PictureButton/>
                </Grid>
                  
                 
              </Grid>
  
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button  onClick={handleEditData}>Edit</Button>
              <Button  onClick={handleCloseDialog}>
              Close
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    }
  



const [products,setProducts] = useState([])
   

const fetchAllProducts=async()=>{
   
  var result=await getData('product/fetch_all_product')
  //alert(JSON.stringify(result.data))
   setProducts(result.data)
}

useEffect(function(){
   fetchAllProducts()
},[])


  function showAllProducts() {
      return (
        <MaterialTable
          title={<span className={classes.headingStyle}>Product Details</span>}
          columns={[
            { title: 'Company/Category', 
            render:rowData=><div>{rowData.companyname}<br/>{rowData.categoryname}</div> },
        
            { title: 'Product', field: 'productname' },
            { title: 'Description', field: 'description' },
    
          { title: 'Status', field: 'status' },
               { title: 'Trending/Deals', 
               render:rowData=><div>{rowData.trending}<br/>{rowData.deals}</div> },
                    { title: 'PriceType', field: 'pricetype' },
         
          { title: 'Logo',
            render:rowData=><Avatar src={`${ServerURL}/images/${rowData.image}`} style={{width:70,height:70}} variant="rounded" />
          },
          ]}
          data={ products }        
          actions={[
               {
                icon:'add',
                isFreeAction:true,
                tooltip:'Add Product',
                onClick:()=>navigate('/dashboard/product')
               },

            {
              icon: 'edit',
              tooltip: 'EditUser',
              onClick: (event, rowData) => handleOpenDialog(rowData )
             
            },
            {
              icon: 'delete',
              tooltip: 'Delete User',
              onClick: (event, rowData) => handleDelete(rowData )
            }
          ]}
        />
      )
    }

return(

  <div className={classes.mainContainer}>
   <div className={classes.box}>
      {showAllProducts()}
      {showProductDetails()}
 
   </div>
  </div>
)


}