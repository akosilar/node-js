const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');


//express app
const app = express();

//connect to mongoDB
const dbURI = 'mongodb+srv://root:kp9pwxnbx7ahANPhhYLD@cluster0.1e4lsm5.mongodb.net/node-tuts?retryWrites=true&w=majority';
mongoose.connect(dbURI)
    .then((result) =>  app.listen(3000))
    .catch((err) => console.log(err));
//register view engine
app.set('view engine', 'ejs');

//if views folder is named something else (myviews)
//app.set('views', 'myviews');

//listen for requests moved to inside the mongoose.connect after a successful db connection
// app.listen(3000);

//middleware & static files. Anything in the public folder will be accessible. No ned toe specify the path.
app.use(express.static('public'));

//3rd party middleware
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true})); //to accept form data

//mongoose and mongo sandbox routes
// app.get('/add-blog', (req,res) => {
//     const blog = new Blog({
//         title: 'new blog2',
//         snippet: 'about my new blog2',
//         body: 'more about my new blog 2'
//     });

//     blog.save()
//         .then((result) => {
//             res.send(result)
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// });

// app.get('/all-blogs', (req,res) => {
//     Blog.find()
//         .then((result) => {
//             res.send(result);
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// });

// app.get('/single-blog', (req,res) => {
//     Blog.findById('63182c6290393f76c1cf2f03')
//     .then((result) => {
//         res.send(result);
//     })
//     .catch((err) => {
//         console.log(err);
//     })
// })

//middleware
// app.use((req,res,next) => {
//     console.log('new request made');
//     console.log('host: ', req.hostname);
//     console.log('path: ', req.path);
//     console.log('method: ', req.method);
//     next();
// });

// app.use((req,res,next) => {
//     console.log('in the next middleware');
//     next();
// });

app.get('/', (req,res) => {
    //res.send('<p>home page</p>');
    // res.sendFile('./views/index.html', {root: __dirname});
    // const blogs = [
    //     {title: 'Yoshi finds eggs', snippet: 'Lorem ipsum dolor sit amet consectetur'},
    //     {title: 'Mario finds stars', snippet: 'Lorem ipsum dolor sit amet consectetur'},
    //     {title: 'How to defeat bowser', snippet: 'Lorem ipsum dolor sit amet consectetur'},
    //   ];
    // res.render('index',{ title: 'Home', blogs});
    res.redirect('/blogs');
});

app.get('/about', (req,res) => {
    //res.send('<p>about page</p>');
    //res.sendFile('./views/about.html', {root: __dirname});
    res.render('about', { title: 'About'});
});

//blog routes
app.get('/blogs/create', (req,res) => {
    res.render('create', { title: 'Create a new Blog'});
});

app.get('/blogs', (req,res) =>{
    Blog.find().sort({ createdAt: -1})
      .then((result) => {
        res.render('index', {title: 'All Blogs', blogs: result})
      })
      .catch((err) => {
        console.log(err);
      })

})      

app.post('/blogs', (req,res) => {
    //console.log(req.body);
    const blog = new Blog(req.body);
    blog.save()
        .then((result) => {
            res.redirect('/blogs');
        })
        .catch((err) => {
            console.log(err); 
        })
});

app.get('/blogs/:id', (req,res) => {
    const id = req.params.id;
    Blog.findById(id)
        .then((result) => {
            res.render('details', {blog: result, title: 'Blog Details'});
        })
        .catch((err)=>{
            console.log(err);
        })
});

app.delete('/blogs/:id', (req,res) => {
    const id = req.params.id;

    Blog.findByIdAndDelete(id)
        .then(result => {
            res.json({redirect: '/blogs'})
        })
        .catch(err =>{
            console.log(err);
        })
})

//redirects
app.get('/about-us', (req,res) => {
    res.redirect('/about');
});

//404 page (typically at the bottom of the code)
app.use((req,res) => {
    //res.status(404).sendFile('./views/404.html', {root: __dirname});
    res.status(404).render('404', { title: 404});
    
});