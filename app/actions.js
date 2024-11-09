'use server'

import { ChatOpenAI } from "@langchain/openai"

//to interact with openAI using langchain
const chatModel = new ChatOpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
})

export async function generateRecipes(recipe){
    try{
        if(recipe.length < 1){
            throw new Error('Ingredients are empty');
        }
        //our prompt consists only of ingredients list so we need to pad it out with more information
        const prompt = `Generate three recipes by using ${recipe}. You do not need to use all ingredients at once, but use only those in the pantry. Do not mix sweet and savory ingredients in a single dish. Only give recipes that have been used in the past, do not create meaningless ones. The output should be in JSON array and each object should contain a recipe name field named 'name', description field named 'description', array of ingredients named 'ingredients', and a array of step by step instructions named 'instructions'. `
        const response  = await chatModel.invoke(prompt)
        return JSON.parse(String(response.content))
    }
    catch(error){
        if (error === 'Ingredients are empty') {
            return [{
                name: 'No Ingredients Found',
                description: 'The generated recipes did not contain any ingredients.',
                ingredients: [],
                instructions: []
            }];
        } else {
            return [{
                name: 'Error Loading Recommendations',
                description: 'You have reached the maximum of OpenAI credits. An upcoming version of this app will allow for more personalized recipe recommendations',
                ingredients: [],
                instructions: []
            }]
        }
    }
}

export async function generateStatus(ingredients){
    try{
        if(ingredients.length === 0){
            return [{status: 'Empty'}]
        }
        const prompt = `Based on the given ingredients ${ingredients}, evaluate on the whole and output a JSON array with one object with a status field named 'status' whose value is either “Very Healthy”, “Moderately Healthy”, or “Unhealthy”. If the list of ingredients is empty, return value as “Empty”.`
        const response  = await chatModel.invoke(prompt)
        // console.log(JSON.parse(String(response.content)));
        return JSON.parse(String(response.content))}
    catch(error){
        return [{status: 'Empty'}]
    }
}