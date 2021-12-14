import React, { useState, useEffect } from 'react'
// import { useSelector, useDispatch } from 'react-redux';

import axios from 'axios';  // query server router
import { Link, useHistory } from 'react-router-dom';  // for URL synchronization

// import { Card } from 'react-bootstrap';
import '../App.css';
import SearchForm from './SearchForm';
import SubmitForm from './SubmitForm';

import { Card, CardContent, Grid, Typography, makeStyles } from '@material-ui/core';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';


const useStyles = makeStyles({
  card: {
    maxWidth: 250,
    height: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 5,
    border: '1px solid #1e8678',
    boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
  },
  titleHead: {
    borderBottom: '1px solid #1e8678',
    fontWeight: 'bold'
  },
  grid: {
    flexGrow: 1,
    flexDirection: 'row'
  },
  media: {
    height: '100%',
    width: '100%'
  },
  button: {
    color: '#1e8678',
    fontWeight: 'bold',
    fontSize: 12
  }
});


const ReceipePage = (props) => {
  const apiKey = '01378051ff2c4d99846649b53b91835a';
  // 1 - For fetch data
  const classes = useStyles();  // for using '@material-ui/core'
  const [ loading, setLoading ] = useState(true);  // ❤ setting my initial state is just like constructor(props) in Class-Based Compoennt
  const [ initialData, setInitialData ] = useState(undefined);
  const [ pageData, setPageData ] = useState(undefined);
  // For search
  const [ searchData, setSearchData] = useState(undefined);
  const [ receipeTerm, setReceipeTerm ] = useState('');
  let card = null;

  // 2 - For pagination
  props.match.params.page = parseInt(props.match.params.page);  // ❤ 
  const history = useHistory();  // update URL with button. https://stackoverflow.com/questions/66721132/trying-to-update-url-parameter-with-onclick-in-react
  const [ lastPageNum, setLastPageNum ] = useState(undefined);

  // 1 - initial loading data
  useEffect(() => {
    // console.log('Initial loading useeffect() in PokemonPage.js');
    async function fetchData() {
      try {
        const { data } = await axios.get(`http://localhost:3001/receipe/page/0`);
        // console.log(data.data.results);
        setInitialData(data.results);
        setLoading(false);
        setLastPageNum(Math.floor(data.totalResults/ data.number));  // set last page number. //! actually last page number could be 30, after that will repeat
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();  // call fetchData()
  }, []);


  // 2. receipeTerm fire this
  useEffect(() => {  // search form keyword fire this
    async function fetchData() {
      try {
        // const urlSearchForm = baseUrl + '?nameStartsWith=' + receipeTerm + '&ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
        console.log(`search: ${receipeTerm}`);
        const { data } = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${receipeTerm}`);
        setSearchData(data.results);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
    if (receipeTerm) {
      console.log('receipeTerm is set');
      fetchData();
    }
  }, [receipeTerm]);


  // 3 - 'props.match.params.page' fire this
  useEffect(() => {  
    // console.log(`'props.match.params.page' useEffect() fired'`);
    async function fetchData() {
      try {
        // console.log(props.match.params.page);
        const { data } = await axios.get(`http://localhost:3001/receipe/page/${props.match.params.page}`);
        // console.log('-------- pagenum useEffect data -----------');
        // console.log(data);
        setPageData(data.results);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }

    if (props.match.params.page) {
      fetchData();
    }
  }, [props.match.params.page]);


  const decrePageNum = async () => {
    props.match.params.page = props.match.params.page - 1;
  };

  const increPageNum = async () => {
    props.match.params.page = props.match.params.page + 1;
  };

  const buttonChangeUrl = async () => {
    history.push(`/receipe/page/${props.match.params.page}`);
  }

  const searchReceipeTerm = async (searchTerm) => {
    setReceipeTerm(searchTerm);
  }

  const submitReceipeTerm = async (submitTerm) => {
    setReceipeTerm(submitTerm);
  }

  // card UI
  const buildCard = (receipe) => {
    return (
      <Grid item xs={12} sm={4} md={2} lg={2} xl={2} key={receipe.id}>
        <Card className={classes.card} variant="outlined">
          <Link to={`/receipe/${receipe.id}`}>
            <img 
              className="card-img-top" 
              src={receipe.image}
              alt={receipe.title}
            ></img> {/* https://stackoverflow.com/questions/34097560/react-js-replace-img-src-onerror */}
            
            <CardActionArea>
              <CardContent>
                <Typography className={classes.titleHead} gutterBottom variant="h6" component="h2">
                  {receipe.title}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Link>

          <CardActions>
            {/* {isFavoriated !=-1 ? 
              <button onClick={() => { releasePokemonFromSelectedTrainer(pokemonState);}}>unFavoriated</button> :  */}
                <button onClick={() => {}}>Collect</button>
          </CardActions>
        </Card>
      </Grid>
    );
  };


  if (receipeTerm) {
    card = searchData && searchData.map((char) => {
      return buildCard(char);
    });
  }
  else if (props.match.params.page && props.match.params.page >= 0) {
    card = pageData && pageData.map((receipe) => {
      // console.log('page data:\n');
      return buildCard(receipe);
    });
    console.log('pageData:', card);
  }
  else {
    // console.log(initialData)
    // console.log('initial data:\n');
    // {
    //   "id": 716426,
    //   "title": "Cauliflower, Brown Rice, and Vegetable Fried Rice",
    //   "image": "https://spoonacular.com/recipeImages/716426-312x231.jpg",
    //   "imageType": "jpg"
    // },
    card = initialData && initialData.map((receipe) => {
      return buildCard(receipe);
    });
    console.log('initialData:', card);
  }

  // Error Component
  function ErrorComponent() {
    return (
      <div>
        <h1>404 - You're out of Receipe Page List</h1>
      </div>
    )
  }

  
  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } else {
    if (props.match.params.page < 0 || props.match.params.page > lastPageNum) {
      return (
        <ErrorComponent></ErrorComponent>
      );
    }
    else if (props.match.params.page === 0) {  // 1st page
      return <div>
          <SubmitForm searchValue={submitReceipeTerm}/>
          <SearchForm searchValue={searchReceipeTerm}/>
          <button onClick={() => { increPageNum(); buttonChangeUrl();}}>
            Next Page
          </button>
          <br />
          <br />
          <Grid container className={classes.grid} spacing={5}>
            {card}
          </Grid>
        </div>;
    }
    else if (props.match.params.page === lastPageNum) {  // last page
      return (
        <div>
          <SubmitForm searchValue={submitReceipeTerm}/>
          <SearchForm searchValue={searchReceipeTerm}/>
          <button onClick={() => { decrePageNum(); buttonChangeUrl();}}>
            Previous Page
          </button>
          <br />
          <br />
          <Grid container className={classes.grid} spacing={5}>
            {card}
          </Grid>
        </div>
      );
    } 
  
    return (
      <div>
        {props.match.params.page < lastPageNum && props.match.params.page > 0 && (
          <div>
            <SubmitForm searchValue={submitReceipeTerm}/>
            <SearchForm searchValue={searchReceipeTerm}/>
            <button onClick={() => { decrePageNum(); buttonChangeUrl();}}>   {/* https://upmostly.com/tutorials/multiple-onclick-events-in-react-with-examples#call-multiple-functions */}
              Previous Page
            </button> &nbsp;&nbsp;
            <button onClick={() => { increPageNum(); buttonChangeUrl();}}>
              Next Page
            </button>
            <br />
            <br />
            <Grid container className={classes.grid} spacing={5}>
              {card}
            </Grid>
          </div>
        )}
      </div>
    )
  }
};

export default ReceipePage
