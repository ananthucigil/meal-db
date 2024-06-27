import express from 'express';
import axios from 'axios';
const app = express();
const port = 3000;
app.use(express.static('public'));
let dropdown;
app.get('/',async(req,res)=>{
    try{
        const response = await axios.get("https://www.themealdb.com/api/json/v1/1/categories.php");
        dropdown = response.data.categories;
        res.render('index.ejs',{category:dropdown});
    }catch(error){
        console.log(error.response);
        res.status(500).send("An error occured");
    }
})
app.get('/category/:id',async(req,res)=>{
    let id = req.params.id;
    const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${id}`);
    res.render('index.ejs',{data:response.data.meals,category:dropdown});
})
app.get('/meal/:id',async(req,res)=>{
    let id = req.params.id;
    const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    let mealDetails = response.data.meals[0];
    const ingredients = [];
    const measure = [];
    const ingredientsWithMeasure = [];
    for(let property in mealDetails){
        if(/strIngredient\d+/.test(property)){
            if(mealDetails[property]){
                ingredients.push(mealDetails[property]);
            }
        }
        if(/strMeasure\d+/.test(property)){
            if(mealDetails[property]){
                measure.push(mealDetails[property]);
            }
        }
    }
    for(let i = 0;i < ingredients.length;i++){
        ingredientsWithMeasure.push({ing:ingredients[i],measure:measure[i]});
    }
    res.render('meals.ejs',{category:dropdown,meal:mealDetails,ingredients:ingredientsWithMeasure});

})

app.get('/search',async(req,res)=>{
    let id = req.query.search
    const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${id}`);
    if(response.data.meals===null){
      res.send('<h1>Sorry, no such dish.</h1>'); 
    }else if(response.data.meals.length===1){
      res.redirect(`/meal/${response.data.meals[0].idMeal}`);
    }else{
      res.redirect(`/category/${id}`);
    }
})

app.listen(port,()=>{
    console.log(`Server running on port ${port}.`)
})