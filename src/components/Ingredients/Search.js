import React,{useEffect, useState,useRef} from 'react';

import Card from '../UI/Card';
import './Search.css';


const Search = React.memo(props => {

  const {filterIngredient} = props;
  const[enteredFilter,setEnteredFilter] = useState('');
  const inputRef = useRef();
  

//  let entersearch ='';

  useEffect(()=>{
    const timer = setTimeout(()=>{
      
      if(enteredFilter === inputRef.current.value){
      console.log("search useEfect called");
      const query = enteredFilter.length ===0 ?'' : `?orderBy="title"&equalTo="${enteredFilter}"`;
      fetch('https://react-hooks-demo-ffee6-default-rtdb.firebaseio.com/ingredients.json'+query)
      .then(response => response.json())
      .then(responseData => {
        //console.log(responseData);
        const loadedData = [];
        for(const key in responseData)
        {
          loadedData.push({
            id:key,
            title:responseData[key].title,
            amount:responseData[key].amount
          })
        }
        
       // setUserIngredients(loadedData);
      filterIngredient(loadedData)
  
  
      });
      }

    },500); //timer code ends
    //useEffect can return something which can only be function
    return ()=>{
      clearTimeout(timer);
    };
    },[enteredFilter,filterIngredient,inputRef])

  const handleSearch = (event) =>{
    
    const entersearch = event.target.value
    setEnteredFilter(entersearch);
    //props.search();
  }

  // function handleSearch (event){
  //   console.log(event.target.value);
  // }


  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input ref={inputRef} type="text" value={enteredFilter} onChange={event=>handleSearch(event)}/>
        </div>
      </Card>
    </section>
  );
});

export default Search;
