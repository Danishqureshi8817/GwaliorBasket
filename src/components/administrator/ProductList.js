import React,{useState,useEffect}  from "react"
import {Avatar,TextField,Button,Grid,IconButton,FormControl,InputLabel,Select,MenuItem,} from "@mui/material"
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { getData } from "../services/ServerServices";

import {useStyles} from './ProductListCss' 
import { posttData } from "../services/ServerServices";
import Swal from "sweetalert2";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { useNavigate } from "react-router-dom";
import { DropzoneArea } from 'material-ui-dropzone';


export default function ProductList(props)
{    
   
    var classes=useStyles()
    const navigate = useNavigate()
    var admin = JSON.parse(localStorage.getItem('ADMIN'))

     const[companyId,setCompanyId] = useState(admin.companyid)
     const[categoryId,setCategoryId] = useState('')
     const [productId, setProductId] = useState('')
     const[weight,setWeight] = useState('')
     const [price, setPrice] = useState('')
     const [offerPrice, setOfferPrice] = useState('')
     const[description,setDescription] = useState('')
    const[categoryIdS,setCategoryIdS] = useState([])
    const [productLogos,setProductLogos]=useState({fileName:'/assets/watermark.png',bytes:''})
    const [productIds, setProductIds] = useState([])
    const [images, setImages] = useState([])
    const [error,setError] = useState({})
    

    const handleImages=(files)=>{
      //setProductLogos({fileName:URL.createObjectURL(event.target.files[0]),bytes:event.target.files[0]})
      setImages(files)
    }

    const clearValue=()=> 
{

  setCategoryId('Choose Category...')
  setProductId('Choose Product...')
  setWeight('')
  setPrice('')
  setOfferPrice('')
  setDescription('')
 
  setProductLogos({fileName:'/assets/watermark.png',bytes:''})

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


  const handleCategoryidOnchange=(e)=>{
    //  alert(e.target)
     //console.log('targeet',e.target)
      setCategoryId(e.target.value)
      fetchAllProductList(e.target.value) //--categyid
   }
   
    const fetchAllProductList = async(categoryid)=>{  
      var body = {'categoryid':categoryid}
  
        var result = await posttData('listproduct/fetch_all_productlist',body)
        console.log("products",result.data);
         setProductIds(result.data)
         
        /*alert(JSON.stringify(result))
         console.log("States",result)*/
      }
   
     const fillCategory=()=>{
      return categoryIdS.map((item)=>{
       return (<MenuItem value={item.categoryid}>{item.category}</MenuItem>) 
      })
    }
    
    const fillProducts=()=>{
      return productIds.map((item)=>{
       return (<MenuItem value={item.productid}>{item.productname}</MenuItem>) 
      })
    }



    const handleSubmit = async() =>{
      if (validation()) {
      var cd = new Date()
      var dd=cd.getFullYear()+"/"+(cd.getMonth()+1)+"/"+cd.getDate()+" "+cd.getHours()+":"+cd.getMinutes()+":"+cd.getSeconds()
   
      var formData = new FormData()
      formData.append('companyid',companyId)
      formData.append('categoryid',categoryId)
      formData.append('productid',productId)
      formData.append('weight',weight)
      formData.append('price',price)
      formData.append('offerprice',offerPrice)

      formData.append('description',description)

     
     // formData.append('images',productLogos.bytes)
      formData.append('createdat',dd)
      formData.append('updateat',dd)
      formData.append('createdby','ADMIN')
      images.map((item,i)=>{
         formData.append('picture'+i,item)
      })
      
      var result =await posttData('listProduct/add_new_productlist',formData)
     /*alert(result.status)*/
     if(result.status)
     {
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
     clearValue();
    }
   
    }
 
    const handleError=(inputs,value)=>{
      setError( prev => ({...prev,[inputs]:value}))
     }

     const validation=()=>{
      var isValid=true
      
       if (!categoryId || categoryId=="Choose Category...") {
        handleError("categoryId","Please Select Category")
        isValid=false 
       }
       if (!productId || productId=="Choose Product...") {
        handleError("productId","Please Select Product")
        isValid=false 
       }

       if (!weight) {
        handleError("weight","Please Input weight")
        isValid=false 
       }
       if (!price) {
        handleError("price","Please Input pricet")
        isValid=false 
       }
       if (!offerPrice) {
        handleError("offerPrice","Please Input offerPrice")
        isValid=false 
       }

       if (!description) {
        handleError("description","Please Input Description")
        isValid=false 
       }

       return isValid
    }

   


    return(
        <div className={classes.mainContainer} >
          <div className={classes.box}>
            <Grid container spacing={2}>
            <Grid item xs={12}  className={classes.rowStyle} >
            <div style={{display:'flex',flecDirection:'row'}}>
                <div><img src="/assets/logo.png" alt="Company logo" width="40"/></div>
              <div className={classes.headingStyle}>
              ProductList Entry
              </div>
                </div>
                <div>
                  <FormatListBulletedIcon onClick={()=>navigate('/dashboard/displayallproductlist')}/>
                </div>
             </Grid> 
               
                <Grid item xs={6}>
                <TextField fullWidth  value={companyId} onChange={(e)=>{setCompanyId(e.target.value)}}  label="Company Id" variant="outlined"/>
                </Grid>
                <Grid item xs={6}>
                 <FormControl fullWidth>
                   <InputLabel id="demo-simple-select-label">Category Id</InputLabel>
                   <Select
                   labelId="demo-simple-select-label"
                   id="demo-simple-select"
                   onChange={handleCategoryidOnchange}
                   value={categoryId}
                   label="Category Id"
                   error={!error.categoryId?false:true}
                   onFocus={()=>handleError("categoryId",null)}
                  
                    >
                   <MenuItem value={'Choose Category...'}>Choose Category...</MenuItem>
                     {fillCategory()}
                   </Select>
                   <div style={{fontSize:10,color:'red',padding:5}}>{error.categoryId}</div>
                 </FormControl>
                </Grid>
                <Grid item xs={6}>
                 <FormControl fullWidth>
                   <InputLabel id="demo-simple-select-label">Product Id</InputLabel>
                   <Select
                   labelId="demo-simple-select-label"
                   id="demo-simple-select"
                   onChange={(e)=>{setProductId(e.target.value)}}
                   value={productId}
                   label="Product Id"
                   error={!error.productId?false:true}
                   onFocus={()=>handleError("productId",null)}
                    >
                   <MenuItem value={'Choose Product...'}>Choose Product...</MenuItem>
                     {fillProducts()}
                   </Select>
                   <div style={{fontSize:10,color:'red',padding:5}}>{error.productId}</div>
                 </FormControl>
                </Grid>
                <Grid item xs={6}>
                <TextField fullWidth error={!error.weight?false:true} helperText={error.weight} onFocus={()=>{handleError("weight",null)}} value={weight} onChange={(e)=>{setWeight(e.target.value)}} label="Weight" variant="outlined"/>
                </Grid>
                <Grid item xs={6}>
                <TextField fullWidth error={!error.price?false:true} helperText={error.price} onFocus={()=>{handleError("price",null)}} value={price} onChange={(e)=>{setPrice(e.target.value)}} label="Price" variant="outlined"/>
                </Grid>
                <Grid item xs={6}>
                <TextField fullWidth error={!error.offerPrice?false:true} helperText={error.offerPrice} onFocus={()=>{handleError("offerPrice",null)}} value={offerPrice} onChange={(e)=>{setOfferPrice(e.target.value)}} label="Offer Price" variant="outlined"/>
                </Grid>
                <Grid item xs={12} >
                <TextField fullWidth error={!error.description?false:true} helperText={error.description} onFocus={()=>{handleError("description",null)}} value={description} onChange={(e)=>{setDescription(e.target.value)}} label="Description" variant="outlined"/>
                </Grid>
             
  
          
               

                {/* <Grid item xs={6} className={classes.rowStyleUpload}>
                <IconButton fullWidth color="primary" aria-label="upload image" component="label">
                 <input hidden accept="image/*" type="file" onChange={handleImages} required />
                <PhotoCamera />
                </IconButton>

                <Avatar
                 alt="Icon"
                 variant="rounded"
                 src={productLogos.fileName}
                 sx={{ width: 56, height: 56 }}
                 />
                </Grid> */}
                <Grid item xs={12}>

                <DropzoneArea
  acceptedFiles={['image/*']}
  dropzoneText={"Drag and drop an image here or click"}
  filesLimit={5}
  onChange={(files) => handleImages(files)}
/>
                </Grid>

                
               <Grid item xs={6}>
                  <Button fullWidth onClick={handleSubmit}  variant="contained"> Submit</Button>
               </Grid>
              
               <Grid item xs={6}>
                  <Button onClick={clearValue} fullWidth variant="contained"> Reset</Button>
               </Grid>

            </Grid>
            </div>
        </div>
    )

}
