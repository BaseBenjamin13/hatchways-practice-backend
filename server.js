const express = require('express');
const recipes = require('./data.json');
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

// this returns a recipe or undefined, which can be used for both getByName and post route
function checkIfRecipeExists(name) {
    const recipe = recipes.recipes.find(recipe => recipe.name === name);
    return recipe;
}
// this returns true or fasle, which can only be used for post route
// function checkIfRecipeExists(name) {
//     const isTrue = recipes.recipes.find(recipe => recipe.name === name) ? true : false;
//     return isTrue;
// }

app.get('/recipes', (req, res) => {
    res.status(200).json(recipes.recipes.map(recipe => recipe.name));
})

app.get('/recipes/details/:name', (req, res) => {
    // const name = req.params.name
    // const recipe = recipes.recipes.find(recipe => recipe.name === name)
    const recipe = checkIfRecipeExists(req.params.name)
    console.log({recipe})
    if(recipe) {
        res.status(200).json({details:{
            ingredients: recipe.ingredients, 
            numSteps: recipe.instructions.length
        }});
    } else {
        res.status(200).json({})
    }
})

app.post('/recipes', (req, res) => {
    if(checkIfRecipeExists(req.body.name)) {
        res.status(400).json({error: "Recipe already exists"})
    } else {
            recipes.recipes.push({
                name: req.body.name,
                ingredients: req.body.ingredients,
                instructions: req.body.instructions
            })
            const lastRecipe = recipes.recipes.length - 1;
            res.status(201).json(recipes.recipes[lastRecipe])
            console.log(recipes.recipes)
    }
})

app.put('/recipes', (req, res) => {
    
    if(checkIfRecipeExists(req.body.name)) {
        const updatedRecipe = {
            name: req.body.name,
            ingredients: req.body.ingredients,
            instructions: req.body.instructions
        }
        recipes.recipes.forEach((recipe, index) => {
            if(recipe.name === req.body.name) {
                recipes.recipes[index] = updatedRecipe 
            }
        })
        // res.json(recipes.recipes)
        res.status(204).json()
    } else {
        res.status(404).json({error: "Recipe does not exist"})
    }
})




const port = 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})