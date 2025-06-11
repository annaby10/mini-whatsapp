const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat");
const methodOverride = require("method-override");

// Set up views and view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({ extended:true }));
app.use(methodOverride("_method"));

// Connect to MongoDB
async function main() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
        console.log("Connection successful to MongoDB");
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
}
main();

// Start the server
app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});

// IMPORTANT: Order of routes matters sometimes!
// Define the more specific routes BEFORE less specific ones.

// Index route to display all chats - THIS IS THE ONE WE WANT TO HIT
app.get("/chats", async (req, res) => {
    console.log("GET /chats route hit!"); // Add this console log
    try {
        let chats = await Chat.find();
        console.log("Chats data found:", chats.length, "items");
        res.render('index.ejs', { chats: chats });
    } catch (error) {
        console.error("Error fetching chats:", error);
        res.status(500).send("Error loading chats.");
    }
});

//New Route
app.get("/chats/new",(req,res)=>
  {res.render("new.ejs")});

//Create Route
app.post("/chats",(req,res)=>
{let {from,to,msg}= req.body;
let newChat = new Chat({
  from: from,
  to: to,
  msg: msg,
  created_at: new Date()
})
newChat.save().then(res => {console.log("Chat was saved")}).catch(res=> {console.log(err)})
res.redirect("/chats")
});

//Edit Route
app.get("/chats/:id/edit",async (req,res)=>{
    let {id} = req.params;
    let chat= await Chat.findById(id);
    res.render("edit.ejs",{chat});
});

//Update Route
app.put("/chats/:id",async(req,res)=>{
    let {id} = req.params;
    let {msg:newMsg} = req.body;
    let updatedChat = await Chat.findByIdAndUpdate(id,{msg:newMsg},
        {runValidators:true,new:true});
    console.log(updatedChat);    
    res.redirect("/chats");
});


// Delete Route
app.delete("/chats/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await Chat.findByIdAndDelete(id);
        console.log(`Chat with ID ${id} deleted.`);
        res.redirect("/chats");
    } catch (err) {
        console.error("Error deleting chat:", err);
        res.status(500).send("Error deleting chat.");
    }
});


// Root route - This should *only* be hit if you go to http://localhost:8080/
app.get("/", (req, res) => {
    console.log("GET / root route hit!"); // Add this console log
    res.send("Root is working! Go to /chats to see chats.");
});
