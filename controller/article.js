const express = require("express")
const router = express.Router()
const path = require('path')
const fs = require('fs')
const articleModel = require('../model/article.model')


// article route to show all articles
router.get('/', async (req, res) => {
    const articles = await articleModel.find().sort({ createdAt: -1 }) 
    res.render('article', {articles: articles})
})



// route for new article
router.get('/new', (req, res) => {
    res.render('newArticle')
})



// post route for new articles
router.post('/new', (req, res) => {
    let errors = []
    let {title, title2, description} = req.body
    

    // for required fields
    if( !title || !title2 || !description){
        errors.push({msg: "ALl fields are required to fill in."})
    }
    // if any error exists
    if(errors.length > 0){
        res.render('newArticle', {
            title,
            title2, 
            description, 
            errors
        })
    }
    else{
        articleModel.findOne({title: title})
            .then((article) => {
                // if title already exists
                if(article){
                    errors.push({msg: 'Title name is already taken by somebody else. Try to change your title name.'})
                    res.render('newArticle', {
                        title,
                        title2, 
                        description, 
                        errors
                    })
                } 
                // if title not exists
                else{
                    // firstly to save in a static json file
                    fs.appendFile(path.join(__dirname,'../static' ,'articles.json'), "\n" + JSON.stringify(req.body) + ",", 'utf-8', (err) => {
                        if(err){
                            console.log(err)
                        }
                    })


                    // then to save to mongo database
                    const newArticle = new articleModel(req.body)

                    // save the model
                    newArticle.save()
                        .then((article) => {
                            res.redirect(`show/${article._id}`)
                        })
                        .catch((err) => {
                            console.log(err)
                        })

                }
            })
            .catch((err) => {console.log(err)})
    }

    
})


// show a particular article
router.get('/show/:id', (req, res) => {
    articleModel.findById(req.params.id, (err, showArticle) => {
        if(err){
            console.log(err)
        }
        else{
            // console.log(showArticle)
            res.render('show', {showArticle})
        }
    })
})


// a delete route for delete a particular article
router.delete('/delete/:id', async (req, res) => {
    await articleModel.findByIdAndDelete(req.params.id)
    res.redirect('/article')
})


// router to render edit page
router.get('/edit/:id', async (req, res) => {
    const article = await articleModel.findById(req.params.id)
    let { id, title, title2, description} = article
    res.render('edit', { id, title, title2, description })
})


// put article to edit aritcles
router.put('/edit/:id', async (req, res) => {
    let errors = []
    let {title, title2, description, senitizedHTML } = req.body
    

    // for required fields
    if( !title || !title2 || !description){
        errors.push({msg: "ALl fields are required to fill in."})
    }
    // if any error exists
    if(errors.length > 0){
        res.render('newArticle', {
            title,
            title2, 
            description, 
            errors
        })
    }
    else{
        const article = await articleModel.findById(req.params.id)
        article.title = title
        article.title2 = title2
        article.description = description 
        article.senitizedHTML = senitizedHTML
        article.__v += 1
        try{
            await article.save()
            res.redirect(`/article/show/${article._id}`)
        }
        catch(err){
            console.log(err)
        }
    }
})
module.exports = router;