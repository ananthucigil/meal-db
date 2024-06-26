import express from 'express';
import axios from 'axios';
const app = express();
const port = 3000;
app.use(express.static('public'))
let dropdown;
app.get('/',async(req,res)=>{
    try{
        const response = await axios.get("https://www.themealdb.com/api/json/v1/1/categories.php");
        dropdown = response.data.categories;
        res.render('index.ejs',{category:response.data.categories});

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

app.listen(port,()=>{
    console.log(`Server running on port ${port}.`)
})