const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsarray');
const stringEmptyOrUndefined = require('../utils/stringEmptyOrUndefined');

//index, show, update, destroy
module.exports = {

    async index(request, response) {
        const devs = await Dev.find();
        return response.json(devs);
    },
    
    async store(request, response) {  
    
    const { github_username , techs, latitude, longitude } =  request.body;

    let dev = await Dev.findOne({ github_username });

    if(!dev) {
        const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
        
        //se o name for nulo ele pega o valor do
        //login, que é obrigatório no github
        const {name = login, avatar_url, bio} = apiResponse.data;
            
    
        const techsArray = parseStringAsArray(techs);
    
        const location = {
            type: 'Point',
            coordinates: [longitude, latitude],
        }
    
         dev =  await Dev.create({
            github_username,
            name, 
            avatar_url, 
            bio,
            techs : techsArray,
            location
        })

    }

    return response.json(dev);
},

async update(request, response) {
    
    const {name , avatar_url, bio, latitude, longitude } =  request.body;
    
    const { id } =  request.params;    

    let dev = await Dev.findById(id);

    if(dev) {

        if(stringEmptyOrUndefined(name) == false){
            dev.name = name;
        }

        if(stringEmptyOrUndefined(avatar_url) == false){
            dev.avatar_url = avatar_url;
        }

        if(stringEmptyOrUndefined(bio) == false){
            dev.bio = bio;
        }

        if(stringEmptyOrUndefined(latitude) == false){
            dev.latitude = latitude;
        }

        if(stringEmptyOrUndefined(longitude) == false){
            dev.longitude = longitude;
        }

        Dev.updateOne(dev);

        return response.json(dev);
        

    } else {
        return response.status(404).send()
    }

},

async destroy(request, response) {
    const { id } =  request.params;    
    const { n } =  await Dev.deleteOne({ _id : id })
    
    if(n > 0){
        return response.status(200).send()
    }else {        
        return response.status(404).send();    
    }  
},

};