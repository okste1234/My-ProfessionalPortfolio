
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const { engine } = require("express-handlebars");
const path = require("path");
const { getMaxListeners } = require("process");
const PORT = process.env.PORT || 3000
const app = express();

//View engine setup
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');


//Body Paser Middleware
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());

//Static or Public Folders
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res)=>{    
    res.render('index');
});

app.post('/send',(req, res)=>{
    const output = `
    <p>You have a New Job alert from:</p>
    <h3>${req.body.email}</h3>
    <ul>
        <li>Name :${req.body.name}</li>
        <li>Project :${req.body.project}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>`;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: 'okste1234@gmail.com',
            pass: '', // generated ethereal password
        },
    });
    
      // send mail with defined transport object
    const info ={
        from: req.body.email, // sender address
        to: "okste1234@gmail.com", // list of receivers
        subject: "Portfolio Message Alert", // Subject line
        text: "", // plain text body
        html: output, // html body
    };
    
    transporter.sendMail(info,(error, info)=>{
        if (error) {
            console.log('error');
            res.send('error');
        } else {
            console.log("Email sent :" + info.response)
            res.render("index", {msg:"Email successfully sent"});
            
        }
    })
});

app.listen(PORT, ()=> console.log(`server running on ${PORT}........`));