const express = require('express');
const fs = require('fs');
const hbs = require('hbs');
const port = process.env.PORT ||3000 ;
var app = express();

/*Handle Bars Configuration  Start */ 
hbs.registerPartials(__dirname+'/views/partials');
hbs.registerHelper('getCurrentYear',() =>{
return new Date().getFullYear();
});

hbs.registerHelper('screamIt',(text) => {
    return text.toUpperCase();
})

hbs.registerHelper('list', (items,options) => {
    var out = "<ul>";

    for(var i=0, l=items.length; i<l; i++) {
      out = out + "<li>" + options.fn(items[i]) + "</li>";
    }
  
    return out + "</ul>";
});
app.set('view engine', 'hbs');
/*Handle Bars Configuration  End */ 

//configure express js 

app.use((req,res,next) => { 

    var now = new Date().toString(); 
    var log = `${now} # ${req.method} # ${req.path} `;
    console.log(log);
    fs.appendFile('server.log',log + '\n', (err) => {
        if(err) {
            console.log(err);
        }
        
    })
    
    next(); 
});

app.use((req,res,next) => {
    //res.render('maintenance.hbs'); //test

    if(req.path === '/dom') {
        res.redirect('/bad');

    } else {
        next();
    }
    
});

app.use(express.static(__dirname+'/public'));
/* default route */
app.get('/',(req,res) => {
//res.contentType('application/json');
//res.send('<h1>Hello Express</h1>');
res.render('home.hbs', {pageTitle: 'Home Page', welcomeMessage: 'Welcome aboard'});
});

app.get('/projects',(req, res) => {
   res.render('projects.hbs',{pageTitle: 'My Projects', projects:[{name: "elegOrg", link: "https://github.com/anilYanamandra/elegOrg"},{name: "nodeCode", link: "https://github.com/anilYanamandra/node-course-2-web-server"}]}) 
});

/* default route */
app.get('/about',(req,res) => {
//res.send('About Page');
res.render('about.hbs', { pageTitle: 'About Page'});
});

app.get('/bad', (req,res) => {
    var json =  {status: 'error',message: 'this is a bad route'};
    res.contentType('application/json');
    res.send(json);
})
app.listen(port,() => {
    console.log(`Server is up and running on ${port}`);
});