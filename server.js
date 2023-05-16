import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/project-happy-thought-api";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

const { Schema } = mongoose;
const ThoughtSchema = new Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    trim: true
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  heart: {
    type: Number,
    default: 0
  }
}); 

const Thought = mongoose.model("Thought", ThoughtSchema);

app.post("/thoughts", async (req, res)=>{
  const {message} = req.body;
    try{
      const thoughtItem = await new Thought({message}).save();
      res.status(201).json({
       success: true,
        response: thoughtItem,
        message: "thought posted successfully"
      });
    } catch (e) {
      res.status(400).json({
        success: false,
        response: e,
        message: "post failed"
       });
     }
 });

 app.get("/thoughts", async (req, res) => {
  try {
    const thoughtItem = await Thought.find().sort({ createdAt: "desc" }).limit(20);
    res.status(200).json({
      success: true,
      response: thoughtItem,
      message: "Thought found successfully"
     });
  } catch(e) {
    res.status(400).json({
      success: false,
      response: e,
      message: "Thought not successfully found"
     });
  }
});

 // modify when nothing found
app.patch("/thoughts/:_id/like", async (req, res) => {
  const { _id } = req.params;
  try {
    const likedThought = await Thought.findByIdAndUpdate(_id, {
      $inc: { heart: 1},
    });
    res.status(200).json({
      success: true,
      response: likedThought,
      message: "like successfully"
     });
  } catch(e) {
    res.status(400).json({
      success: false,
      response: e,
      message: "like unsuccessfull"
     });
  }
});

// POST - create something
// PATCH - update
// PUT - replace

// delete
// https://stackoverflow.com/questions/54081114/what-is-the-difference-between-findbyidandremove-and-findbyidanddelete-in-mongoo
/* app.delete("/thoughts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // const thoughtItem = await Thought.findByIdAndDelete(id);
    const thoughtItem = await Thought.findByIdAndRemove(id);
    res.status(200).json({
      success: true,
      response: thoughtItem,
      message: "deleted successfully"
     });
  } catch(e) {
    res.status(400).json({
      success: false,
      response: e,
      message: "did not successfully delete"
     });
  }
}); */

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
