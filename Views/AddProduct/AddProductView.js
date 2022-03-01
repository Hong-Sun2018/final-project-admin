import { makeStyles } from "@mui/styles";
import { Box, Button, TextField, Typography, TextareaAutosize, Grid, Input} from '@mui/material';
import { memo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FormControl, MenuItem, InputLabel, Select } from '@mui/material'; 
import API from "../../Constants/API";
import axios from "axios";
import { setDialogMsg } from "../../Redux/Reducer/DialogReducer";
import { setUserInfo } from "../../Redux/Reducer/UserInfoReducer";

const useStyles = makeStyles(
  {
    root: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent:'cennter'
    },
    container: {
      width: '50%',
      // backgroundColor: 'yellow',
    },
    prodName : {
      marginBottom: '40px',
    },
    textArea: {
      width: '99.5%', 
      marginBottom: '40px',
    },
    selectContainer: {
      width: '100%',
      // backgroundColor: 'yellow',
    },
    select: {
      width: '100%',
    },
    newCategoryBox: {
      width: '100%',
      marginTop: '10px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      // backgroundColor: 'yellow'
    },
  }
);

const AddProductView = () => {
  
  ////////////////////////////////// States & Hooks ///////////////////////////
  const classes = useStyles();
  const [category1, setCategory1] = useState({categoryName: ''});
  const [category2, setCategory2] = useState({categoryName: ''});
  const [category3, setCategory3] = useState({categoryName: ''});
  const [categoryList1, setCategoryList1] = useState([]);
  const [categoryList2, setCategoryList2] = useState([]);
  const [categoryList3, setCategoryList3] = useState([]);
  const [categoryName1, setCategoryName1] = useState('');
  const [categoryName2, setCategoryName2] = useState('');
  const [categoryName3, setCategoryName3] = useState('');
  const [disableCate2, setDisableCate2] = useState(true);
  const [disableCate3, setDisableCate3] = useState(true);
  const dispatch = useDispatch();


  //////////////////////////////// Get Category List ////////////////////////////////////

  const getCategories = (url, parentID, setCategoryList) => {
    const apiUrl = `${url}/${parentID}`;
    // console.log(apiUrl);
    axios.get(apiUrl, {withCredentials: true}).then( res => {
      if (res && res.data) { 
        // console.log(res.data);
        setCategoryList(res.data);
        // console.log(categoryList1);
      }
    }).catch( err => {
      console.log(err);
    });
  } 

  const urlGetCateList = API('GetCategories');
  // get level 1 category
  const getList1 = useEffect(() => {
    getCategories(urlGetCateList, -1, setCategoryList1);
  }, []);

  // if have level 1 get level 2 category
  const getList2 = useEffect(() => {
    if (category1 && category1.categoryID){
      console.log("category1 changed!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      getCategories(urlGetCateList, category1.categoryID, setCategoryList2);
    }
  }, [category1])

  // if have level 2 get level 3 category
  const getList3 = useEffect(() => {
    if (category2 && category2.categoryID) {
      console.log("category2 changed !!!!!!!!!!!!!!!!!!!!!")
      getCategories(urlGetCateList, category2.categoryID, setCategoryList3);
    }
  }, [category2]);

  ///////////////////////////////////// Event handler ////////////////////////////////////////
  
  const changeCate1 = (event) => {
    setCategory1(categoryList1.find(c => c.categoryName == event.target.value));
    setDisableCate2(false);
    setDisableCate3(true);
    setCategory2({});
    setCategory3({});
  }
  const changeCate2 = (event) => {
    setCategory2(categoryList2.find(c => c.categoryName == event.target.value));
    setDisableCate3(false);
    setCategory3({});
  }
  const changeCate3 = (event) => {
    console.log("cate 3 sellected")
    setCategory3(categoryList3.find(c => c.categoryName == event.target.value))
  }
  const changeCateName1 = (event)=>{
    setCategoryName1(event.target.value);
  }
  const changeCateName2 = (event)=>{
    setCategoryName2(event.target.value);
  }
  const changeCateName3 = (event)=>{
    console.log("categoryname3 changed!!!!!!!!!")
    setCategoryName3(event.target.value);
    console.log(categoryName3);
  }



  //////////////////////////////// Create Category ////////////////////////////////////////////////
  const getReqBody = {
    body1: {
      CategoryName: categoryName1,
      ParentID: -1
    },
    body2: {
      CategoryName: categoryName2,
      ParentID: category1.categoryID
    },
    body3: {
      CategoryName: categoryName3,
      ParentID: category2.categoryID
    }
  }

  const postCategory = (url, body) => {
    console.log(body);

    if ( !body || !body.CategoryName.length){
      dispatch(setDialogMsg('Category name can not be empty. '));
      return;
    } 
    // console.log(url);
    // console.log(body);
    axios.post(url, body, {withCredentials: true}).then((res) => {
      dispatch(setDialogMsg('New category created'));
      getCategories(urlGetCateList, -1, setCategoryList1);
      if (category1 && category1.categoryID){
        console.log("category1 changed!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        getCategories(urlGetCateList, category1.categoryID, setCategoryList2);
      }
      if (category2 && category2.categoryID) {
        console.log("category2 changed !!!!!!!!!!!!!!!!!!!!!")
        getCategories(urlGetCateList, category2.categoryID, setCategoryList3);
      }
    }).catch(err => {
      if (!err.response){
        dispatch(setDialogMsg('Server not responding, check internet connection. '));
      }
      else if (err.response.status == 401){
        dispatch(setDialogMsg('Invalid login or login expired.'));
      } 
      else if (err.response.status == 409) {
        dispatch(setDialogMsg('Category name is not available.'))
      }
      else {
        dispatch(setDialogMsg('Unknown error. '));
        console.log(err);
      }
    })
  }

  const urlCreateCategory = API('CreateCategory');

  const createCategory1 = () => {
    setCategoryName1('');
    const reqBody = getReqBody['body1'];
    postCategory(urlCreateCategory, reqBody);
  }

  const createCategory2 = () => {
    const reqBody = getReqBody['body2'];
    postCategory(urlCreateCategory, reqBody);
    setCategoryName2('');
  }

  const createCategory3 = () => {
    const reqBody = getReqBody['body3'];
    // console.log(reqBody);
    postCategory(urlCreateCategory, reqBody);
    setCategoryName3('');
  }


  return (
    <Box className={classes.root}>
      <Box className={classes.container}>

        <Typography variant={'p'} >
          Product name:
        </Typography>
        <TextField className={classes.prodName} label={'Product name'} id={'prodName'} variant={'outlined'} fullWidth size={'small'}/>

        <Typography variant={'p'} >
          Product description:
        </Typography>
        <TextareaAutosize className={classes.textArea} placeholder={'Empty'} maxRows={10} minRows={10}/>

        <Typography variant={'p'} >
          Product category:
        </Typography>
        <Grid className={classes.selectContainer} container alignItems={'center'} justifyContent={'space-between'}>
          {/*/////////////////////////  Cate 1 ////////////////////////////////////////////*/}
          <Grid item xs={12} sm={12} md={3.5} lg={3.5}>
            <FormControl variant={'standard'} className={classes.select}>
              <InputLabel id={'category1-label'} >Select Category</InputLabel>
              <Select labelId={'category1-label'} id={'category1'} value={category1.categoryName} onChange={changeCate1}>
                {categoryList1.length >0 && categoryList1.map((item, index) => {
                  return (
                    <MenuItem key={index} value={item.categoryName}>{item.categoryName}</MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <Box className={classes.newCategoryBox}>
              <TextField value={categoryName1} variant={'filled'} label={'Create new category: '} fullWidth size={'small'} onChange={changeCateName1}/>
              <Button  onClick={createCategory1}>Submit</Button>
            </Box>
          </Grid>
           {/*/////////////////////////  Cate 2 ////////////////////////////////////////////*/}
          <Grid item xs={12} sm={12} md={3.5} lg={3.5}>
            <FormControl variant={'standard'} className={classes.select}>
              <InputLabel id={'category1-label'} >Select Category</InputLabel>
              <Select labelId={'category1-label'} id={'category2'} value={(category2 && category2.categoryName) ? category2.categoryName : ''} onChange={changeCate2} disabled={disableCate2}>
                {categoryList2.length >0 && categoryList2.map((item, index) => {
                  return (
                    <MenuItem key={index} value={item.categoryName}>{item.categoryName}</MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <Box className={classes.newCategoryBox}>
              <TextField value={categoryName2} variant={'filled'} label={'Create new category: '} fullWidth size={'small'} onChange={changeCateName2} disabled={disableCate2}/>
              <Button onClick={createCategory2} disabled={disableCate2}>Submit</Button>
            </Box>
          </Grid>
           {/*/////////////////////////  Cate 3 ////////////////////////////////////////////*/}
          <Grid item xs={12} sm={12} md={3.5} lg={3.5}>
            <FormControl variant={'standard'} className={classes.select}>
              <InputLabel id={'category1-label'} >Select Category</InputLabel>
              <Select labelId={'category1-label'} id={'category3'} value={(category3 && category3.categoryName) ? category3.categoryName : ''} onChange={changeCate3} disabled={disableCate3}>
              {categoryList3.length >0 && categoryList3.map((item, index) => {
                  return (
                    <MenuItem key={index} value={item.categoryName}>{item.categoryName}</MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <Box className={classes.newCategoryBox}>
              <TextField value={categoryName3} variant={'filled'} label={'Create new category: '} fullWidth size={'small'} onChange={changeCateName3} disabled={disableCate3}/>
              <Button  onClick={createCategory3} disabled={disableCate3} >Submit</Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default memo(AddProductView);