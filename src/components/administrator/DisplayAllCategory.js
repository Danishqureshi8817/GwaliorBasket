import { useEffect,useState } from "react";
import MaterialTable from "@material-table/core";
import { getData } from "../services/ServerServices";
import { Avatar,Button,Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle,TextField,Grid,IconButton} from "@mui/material";
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { ServerURL } from "../services/ServerServices";
import {useStyles} from './DisplayAllCategoryCss' 
import CloseIcon from '@mui/icons-material/Close';
import Swal from "sweetalert2";
import { posttData } from "../services/ServerServices";
import { useNavigate } from "react-router-dom";


export default function DisplayAllCategories(props)
{

  var classes = useStyles()
   const[categoryId,setCategoryId] = useState('')
  const [categoryName, setCategoryName] = useState('');
    const [companyId, setCompanyId] = useState('');
    const [description, setDescription] = useState('');
    const [categoryIcon,setCategoryIcon]=useState({fileName:'/assets/watermark.png',bytes:''})

    const[btnStatus,setBtnStatus]= useState(false)
    const[message,setMessage]= useState("")
    const[oldPicture,setOldPicture] = useState('')

  const [categories,setCategories] = useState([]) 

  const navigate = useNavigate()

  const fetchAllCategory=async()=>{
     
    var result=await getData('category/fetch_all_category')
    //alert(JSON.stringify(result.data))
     setCategories(result.data)
  }

  useEffect(function(){
     fetchAllCategory()
  },[])

  const handleIcon=(event)=>{
    setCategoryIcon({fileName:URL.createObjectURL(event.target.files[0]),bytes:event.target.files[0]})
    setBtnStatus(true)
}

  const [open, setOpen] = useState(false);

  const handleCloseDialog=( )=>{
    setOpen(false)
  } 

  const handleOpenDialog=(rowData )=>{
    setCategoryId(rowData.categoryid)
    setCompanyId(rowData.companyid)
    setCategoryName(rowData.category)
    setDescription(rowData.description)
    setCategoryIcon({fileName:`${ServerURL}/images/${rowData.icon}`,bytes:''})
    setOldPicture(rowData.icon)
    setOpen(true)
  }


  const handleEditData =async()=>{
    var cd = new Date()
   var dd=cd.getFullYear()+"/"+(cd.getMonth()+1)+"/"+cd.getDate()+" "+cd.getHours()+":"+cd.getMinutes()+":"+cd.getSeconds()

    var body ={
        'categoryid':categoryId,
      'companyid':companyId,
      'category':categoryName,
       'description':description,
    'updateat':dd,
    'createdby':'ADMIN',
    }
    var result =await posttData('category/edit_category_data',body)
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
    fetchAllCategory()
  }
  
  
  const handleCancel=()=>{
    setCategoryIcon({fileName:`${ServerURL}/images/${oldPicture}`,bytes:''})
    setOldPicture('')
    setBtnStatus(false)
    setMessage("")
   }

   const handleSavePicture=async()=>{
    var formData = new FormData()
    formData.append('categoryid',categoryId)
    formData.append('icon',categoryIcon.bytes)
    var result = await posttData('category/edit_category_icon',formData)
    if(result.status)
    { 
     setMessage("assets/greentick.gif")
    }
    else{
      setMessage(result.message)
    }
    fetchAllCategory()
    setBtnStatus(false)
   }


   const handleDelete=async(rowData)=>{
  
    /*alert(result.status)*/
    Swal.fire({
      title: 'Do you want to delete caregory?',
      showDenyButton: true,
      denyButtonText: `Cancel`,
    
      confirmButtonText: 'Delete',
      
    }).then(async(result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        var res = await posttData('category/delete_category_data',{categoryid:rowData.categoryid})
        if(res.status){
        Swal.fire('Deleted', '', 'Successfully')
        fetchAllCategory()
        }
        else{
          Swal.fire({
            icon: 'error',
            title: result.message,
      
          })
        }
  
      } else if (result.isDenied) {
        Swal.fire('Delete Process Cancel', '', 'info')
      }
    })
    
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


  const showCategoryDetails=()=>{

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

            <Grid item xs={6} >
                <TextField fullWidth value={categoryName} onChange={(event)=>setCategoryName(event.target.value)} label="Category Name" variant="outlined"/>
                </Grid>
                <Grid item xs={6}>
                <TextField fullWidth value={companyId} onChange={(event)=>setCompanyId(event.target.value)} label="Company Id" variant="outlined"/>
                </Grid>
                <Grid item xs={12} >
                <TextField fullWidth value={description} onChange={(event)=>setDescription(event.target.value)} label="Description" variant="outlined"/>
                </Grid>
               

                
               
                <Grid item xs={12} className={classes.rowStyle}>
                <IconButton fullWidth color="primary" aria-label="upload picture" component="label">
                 <input hidden accept="image/*" type="file" onChange={handleIcon} />
                <PhotoCamera />
                </IconButton>

                <Avatar
                 alt="Icon"
                 variant="rounded"
                 src={categoryIcon.fileName}
                 sx={{ width: 56, height: 56 }}
                 />
                 <PictureButton/>
                </Grid>
               
            </Grid>

            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditData} >Edit</Button>
            <Button  onClick={handleCloseDialog}>
            Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }




    function showAllCategory() {
        return (
          <MaterialTable
            title={<span className={classes.headingStyle}>Category Details</span>}
            columns={[
              { title: 'Company Id', field: 'companyid' },
              { title: 'Category Name', field: 'category' },
              { title: 'Description', field: 'description'},

            { title: 'Last Updation',
              render:rowData=><div>{rowData.createdat}<br/>{rowData.updateat}<br/>{rowData.createdby}</div>
            },
            { title: 'Logo',
              render:rowData=><Avatar src={`${ServerURL}/images/${rowData.icon}`} style={{width:70,height:70}} variant="rounded" />
            },
            ]}
            data={ categories }        
            actions={[
              {
                  icon:'add',
                  isFreeAction:true,
                  tooltip:'Add Category',
                  onClick:()=>navigate('/dashboard/category')
                 },
              {
                icon: 'edit',
                tooltip: 'EditUser',
                onClick: (event, rowData) =>  handleOpenDialog(rowData )
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
        {showAllCategory()}
        {showCategoryDetails()}
        
     </div>
    </div>
)


}