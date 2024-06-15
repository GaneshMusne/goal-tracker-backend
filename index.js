const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb+srv://goal-tracker-admin:admin1234@cluster0.4r6maew.mongodb.net/Goals', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const GoalSchema = new mongoose.Schema({
  date: { type: String, unique: true },
});

const Goal = mongoose.model('Goal', GoalSchema);

app.post('/api/goals', async (req, res) => {
  try {
    const { date } = req.body;
    const goal = new Goal({ date });
    await goal.save();
    res.status(201).send(goal);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/api/goals', async (req, res) => {
  try {
    const goals = await Goal.find({});
    res.status(200).send(goals);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
