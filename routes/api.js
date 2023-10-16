// Imports
const express = require("express");
const bodyParser = require("body-parser");
const { PrismaClient } = require("@prisma/client");

// Initialize Router
const router = express.Router();

// Middleware
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Database
const prisma = new PrismaClient();

// Routes
router
  .route("/users")
  // Get All Users
  .get(async (req, res) => {
    const usersQuery = await prisma.user.findMany({});
    const usersArray = usersQuery.map((item) => {
      return {
        _id: item.id,
        username: item.username,
      };
    });
    res.status(200).json(usersArray);
  })
  // Add a new user
  .post(async (req, res) => {
    const { username } = req.body;
    if (!username) {
      res.status(400).json({
        error: "missing username.",
      });
      return;
    }
    // Create the user in the db
    const userQuery = await prisma.user.create({
      data: {
        username,
      },
    });

    // return 500 if the user could not be created
    if (!userQuery) {
      res.sendStatus(500);
      return;
    }

    res.status(200).json({
      _id: userQuery.id,
      username: userQuery.username,
    });
    return;
  });

// Exercises route
router.post("/users/:id/exercises", async (req, res) => {
  const { id } = req.params;
  const userQuery = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!userQuery) {
    res.status(400).json({
      error: `user with id "${id}" not found.`,
    });
    return;
  }

  // User found, proceed
  const { description, duration, date } = req.body;

  const exDuration = parseInt(duration);

  if (!description) {
    res.status(400).json({
      error: "description is required.",
    });
    return;
  }

  if (isNaN(exDuration)) {
    res.status(400).json({
      error: "a valid duration is required.",
    });
    return;
  }

  // Create the exercise
  const exerciseQuery = await prisma.exercise.create({
    data: {
      description,
      duration: exDuration,
      date: date ? new Date(date) : undefined,
      user: {
        connect: {
          id: userQuery.id,
        },
      },
    },
  });
  if (!exerciseQuery) {
    res.sendStatus(500);
    return;
  }
  res.status(200).json({
    username: userQuery.username,
    description: exerciseQuery.description,
    duration: exerciseQuery.duration,
    date: exerciseQuery.date.toDateString(),
    _id: userQuery.id,
  });
});

module.exports = router;
