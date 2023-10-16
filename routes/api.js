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

// Log Route
router.get("/users/:id/logs", async (req, res) => {
  const { id } = req.params;
  const { from, to, limit } = req.query;
  const userExerciseQuery = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      exercises: {
        select: {
          description: true,
          duration: true,
          date: true,
        },
        where: {
          // Conditionally include date range filtering if "from" and "to" parameters are provided
          date: {
            gte: from ? new Date(from) : undefined, // "undefined" if "from" is not provided
            lte: to ? new Date(to) : undefined, // "undefined" if "to" is not provided
          },
        },
        // Conditionally set the limit if "limit" parameter is provided
        take: parseInt(limit) || undefined, // "undefined" if "limit" is not provided
      },
    },
  });
  if (!userExerciseQuery) {
    res.status(400).json({
      error: "invalid user id.",
    });
    return;
  }
  res.status(200).json({
    _id: userExerciseQuery.id,
    username: userExerciseQuery.username,
    from: from ? new Date(from).toDateString() : undefined,
    to: to ? new Date(to).toDateString() : undefined,
    count: userExerciseQuery.exercises.length,
    log: userExerciseQuery.exercises.map((item) => {
      return {
        description: item.description,
        duration: item.duration,
        date: item.date.toDateString(),
      };
    }),
  });
});
module.exports = router;
