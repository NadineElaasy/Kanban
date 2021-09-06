const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const { Board, List, Card } = require("../../models/Board");
const boardValidation = require("../../validations/boardValidation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
require("../../config/passport")(passport);

//Getting all boards
router.get("/", async (req, res) => {
  const boards = await Board.find();
  res.json({ data: boards });
});

//Creating new Board
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      console.log(req.body);

      const name = req.body.name;
      const owner = req.user.id;
      const newBoard = {
        name,
        owner,
      };
      const isValidated = boardValidation.validate(newBoard);
      console.log(isValidated);
      if (isValidated.error) {
        console.log(isValidated.error.details[0].message);
        return res.status(400).send({
          msg: isValidated.error.details[0].message,
          error: "validation error",
        });
      }
      const dbBoard = await Board.create(newBoard);
      const updatedUser = await User.updateOne(
        { _id: owner },
        { $push: { boardList: dbBoard._id } }
      );
      return res.json({ msg: "Board was created successfully", data: dbBoard });
    } catch (error) {
      console.log(error);
    }
  }
);

//Updating the Board
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userID = req.user.id;
      const boardID = req.params.id;

      const board = await Board.findById(boardID);

      if (!board)
        return res.status(404).send({ error: "Board does not exist" });
      if (!board.owner === userID) {
        return res.status(401).send({ error: "Not Authorized" });
      }
   
      const isValidated = boardValidation.validate(req.body);
      console.log(isValidated);
      
      if (isValidated.error) {
        console.log(isValidated.error.details[0].message);
        return res.status(400).send({
          msg: isValidated.error.details[0].message,
          error: "validation error",
        });
      }
      const updatedBoard = await Board.findByIdAndUpdate(
        { _id: boardID },
        req.body
      );
      res.json({ msg: "Board updated successfully" });
    } catch (error) {
      console.log(error);
    }
  }
);

//Deleting Board
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userID = req.user.id;
      const boardID = req.params.id;
      const board = await Board.findById(boardID);

      if (!board)
        return res.status(404).send({ error: "Board does not exist" });
      if (!board.owner === userID) {
        return res.status(401).send({ error: "Not Authorized" });
      }
      const deletedBoard = await Board.findByIdAndRemove(boardID);
      res.json({ msg: "Board was deleted successfully", data: deletedBoard });
    } catch (error) {
      console.log(error);
    }
  }
);
//Getting all Lists
router.get("/lists/:id", async (req, res) => {
  const board = await Board.findById(req.params.id);
  res.json({ data: board.lists });
});

//Creating a new List
router.post("/lists/", async (req, res) => {
  try {
    const name = req.body.name;
    const boardID = req.body.boardID;
    const board = await Board.findOne({ _id: boardID });
    board.lists.forEach((list) => {
      if (list.name === name) {
        return res.status(400).send({ error: "List name should be unique" });
      }
    });
    const newList = {
      name,
    };
    const dbList = new List(newList);
    const updatedBoard = await Board.updateOne(
      { _id: boardID },
      { $push: { lists: dbList } }
    );
    return res.json({ msg: "List was created successfully", data: dbList });
  } catch (error) {
    console.log(error);
  }
});

//Update a list name
router.put("/lists/", async (req, res) => {
  try {
    const oldName = req.body.oldName;
    const newName = req.body.newName;
    const boardID = req.body.boardID;
    let updatedList;
    const board = await Board.findOne({ _id: boardID });
    board.lists.forEach((list) => {
      if (list.name === newName) {
        return res.status(400).send({ error: "List name should be unique" });
      }
    });
    board.lists.forEach((list) => {
      if (list.name === oldName) {
        list.name = newName;
        updatedList = list;
      }
    });
    board.save();

    return res.json({
      msg: "List was updated successfully",
      data: updatedList,
    });
  } catch (error) {
    console.log(error);
  }
});

//Getting all cards for a specific board
router.get("/lists/cards/:id", async (req, res) => {
  const board = await Board.findById(req.params.id);
  let boardLists = [];
  board.lists.forEach((list) => {
    boardLists.push(list.cards);
  });
  res.json({ data: boardLists });
});

//Getting all cards for a specific list
router.get("/lists/cards/:id/:name", async (req, res) => {
  const board = await Board.findById(req.params.id);
  board.lists.forEach((list) => {
    if (
      list.name.toLowerCase().trim() === req.params.name.toLowerCase().trim()
    ) {
      return res.json({ data: list.cards });
    }
  });
  res.status(404).json({ msg: "List Not Found", data: {} });
});

//Getting a specific card for a specific list
router.get("/lists/cards/:id/:name/:title", async (req, res) => {
  const board = await Board.findById(req.params.id);
  board.lists.forEach((list) => {
    if (
      list.name.toLowerCase().trim() === req.params.name.toLowerCase().trim()
    ) {
      list.forEach((card) => {
        if (
          card.title.toLowerCase().trim() ===
          req.params.title.toLowerCase().trim()
        ) {
          return res.json({ data: card });
        }
      });
      return res.status(404).json({ msg: "Card Not Found", data: {} });
    }
  });
  res.status(404).json({ msg: "Card Not Found", data: {} });
});

//Creating a new card for certain list
router.post("/lists/cards", async (req, res) => {
  try {
    const title = req.body.title;
    const listName = req.body.listName;
    const boardID = req.body.boardID;
    let description;
    if (req.body.description) {
      description = req.body.description;
    }

    const newCard = {
      title,
      description,
    };
    const board = await Board.findOne({ _id: boardID });
    board.lists.forEach((list) => {
      if (list.name === listName) {
        list.cards.forEach((card) => {
          if (card.title === title) {
            return res
              .status(400)
              .send({ error: "Card name should be unique" });
          }
        });
      }
    });
    const dbCard = new Card(newCard);

    board.lists.forEach((list) => {
      if (list.name === listName) {
        list.cards.push(dbCard);
      }
    });
    await board.save();
    return res.json({ msg: "Card was created successfully", data: dbCard });
  } catch (error) {
    console.log(error);
  }
});

//Update the Card
router.put("/lists/cards/", async (req, res) => {
  try {
    const oldTitle = req.body.oldTitle;
    const newTitle = req.body.newTitle;
    const oldListName = req.body.oldListName;
    const newListName = req.body.newListName;
    const oldDescription = req.body.oldDescription;
    const newDescription = req.body.newDescription;
    const boardID = req.body.boardID;
    const oldCard = {
      title: oldTitle,
      description: oldDescription,
    };
    const newCard = {
      title: newTitle,
      description: newDescription,
    };
    const board = await Board.findOne({ _id: boardID });
    board.lists.forEach((list) => {
      if (list.name === newListName) {
        list.cards.forEach((card) => {
          if (card.title === newTitle) {
            return res
              .status(400)
              .send({ error: "Card name should be unique" });
          }
        });
      }
    });
    board.lists.forEach((list) => {
      // console.log(list.name , newListName, oldListName)
      if (list.name === newListName) {
        //console.log(list.name)
        const dbCardNew = new Card(newCard);
        list.cards.push(dbCardNew);
      }
      // TODO: should be replaced by util function check if exists
      if (list.name === oldListName) {
        let filteredCards = list.cards.filter((card) => {
          return card.title !== oldTitle;
        });
        list.cards = filteredCards;
      }
    });
    await board.save();
    return res.json({ msg: "Card was updated successfully", data: board });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
