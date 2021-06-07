import React, { useReducer,useEffect, useState ,useCallback,useMemo, useRef} from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';


const ingredientReducer = (currentIngredient,action)=>{

  switch(action.type){
    case ('SET'): 
      return action.ingredient;
    case ('ADD'):
      return [...currentIngredient,action.ingredient]
    case ('DELETE'):
      return currentIngredient.filter((ing) => ing.id !==action.id);
    default:
       throw new Error();
  }
}

const httpReducer = (curHttpState,action) => {
  switch(action.type) {
    case 'SEND' :
      return {loading:true,error:null}
    case 'RESPONSE' :
      return {...curHttpState,loading:false}
    case 'ERROR' :
      return {loading:false,error:action.errorData}
    case 'CLEAR' :
      return {...curHttpState,error:null}
    default : throw new Error("never reach here check typo");
  }
}

const Ingredients = () => {

  const [userIngredients, dispatch] =  useReducer(ingredientReducer,[]);
  //const [userIngredients, setUserIngredients] = useState([]);
  //const [loadingIngr, setLoadingIngr] = useState(false);
  //const [error, setError] = useState();
  const[httpState,dispatchHttp] = useReducer(httpReducer,{loading:false,error:null});
  //this useeffect we dont need anymore as our search component already rendering in use effect
  
  // useEffect(()=>{   
  //   //use to get data when application reloads i.e after it mounted properly and want to show data existin the backend

  //   fetch('https://burgeryy-base-default-rtdb.firebaseio.com/hooks-ingredients.json')
  //   .then(response => response.json())
  //   .then(responseData => {
      
  //     const loadedData = [];
  //     for(const key in responseData)    //responseData =  {"-MSgw6e4ECG4pZZO0YJx":{"amount":"1","title":"almond"}}
  //     {
  //       loadedData.push({
  //         id:key,
  //         title:responseData[key].title,
  //         amount:responseData[key].amount
  //       })
  //     }
      
  //     setUserIngredients(loadedData);


  //   });

  // },[])




  const addIngredientHandler = ingredient => {

    //setLoadingIngr(true);
    dispatchHttp({type : 'SEND'});
    fetch('https://react-hooks-demo-ffee6-default-rtdb.firebaseio.com/ingredients.json',
    {
      method:'POST',
      body:JSON.stringify(ingredient),
      headers:{'Content-Type' : 'application/json' }
    }
    ).then(response => response.json())
    
    .then(responseData => {
      //setLoadingIngr(false);
      dispatchHttp({type : 'RESPONSE'});
      // setUserIngredients(prevIngredients => [
      //   ...prevIngredients,
      //   { id: responseData.name, ...ingredient }
      // ]);
      dispatch({type:'ADD',ingredient :{ id: responseData.name, ...ingredient }});
    }).catch(error => {
       //setError('Something Went Wrong!');
       dispatchHttp({type : 'ERROR',errorData:"Something Went Wrong"});

    });
    
   
  };

  const onRemoveItemHandler = (id1) => {
    console.log("in remove");
    console.log(id1);
    // let ingr = [...userIngredients];
    // const ingrIndex = ingr.findIndex((ingred) => ingred.id ===id)
    // console.log(ingr);
    // ingr.splice(ingrIndex,1);
    // console.log(ingr);
    // setUserIngredients({prevIngredients:ingr});
    
    // setUserIngredients(prevIngredients => (
    //   prevIngredients.filter(ingr => ingr.id !== id)
    // ));
    dispatch({type:'DELETE',id :id1});
  }

  const onSearchHandler = useCallback((ingredientSet) => {
    console.log('onSearch Handler');
    //setUserIngredients(ingredient);
    dispatch({type:'SET',ingredient :ingredientSet});

  },[])

  const closeHandler = () => {
    dispatchHttp({type : 'CLEAR'});
     // setLoadingIngr(false)
     dispatchHttp({type : 'RESPONSE'});
  }

  const ingrList = useMemo(()=>{
    return(<IngredientList ingredients={userIngredients} onRemoveItem={onRemoveItemHandler} />);
  },[userIngredients]
  );

  return (
    <div className="App">
      {httpState.error &&<ErrorModal onClose={closeHandler}>{httpState.error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={httpState.loading}/>

      <section>
        <Search filterIngredient={onSearchHandler}/>
        {ingrList}
      </section>
    </div>
  );
};

export default Ingredients;
