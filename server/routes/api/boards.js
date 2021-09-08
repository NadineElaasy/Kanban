const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const { Board, List, Card } = require("../../models/Board");

const {isEqual,getTitleFormat} =require ("../../utils/index");

const boardValidation = require("../../validations/boardValidation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
require("../../config/passport")(passport);

//BOARDS

//Getting all boards
router.get("/", async (req, res) => {
  const boards = await Board.find();
  res.json({ data: boards });
});
//Getting All Boards for a specific user
router.get(
  "/user/allboards",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    console.log("HELLO!")
    //const boardID = req.params.id;
    const userID = req.user.id;
    const board = await Board.find({owner :userID});
    //if (!board) return res.status(404).send({ error: "Board does not exist" });

    return res.json({ data: board });
    
    //return res.status(401).send({ error: "Not Authorized" });
  }
);

//Get a Specific Board
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const boardID = req.params.id;
    const userID = req.user.id;
    const board = await Board.findById(boardID);
    if (!board) return res.status(404).send({ error: "Board does not exist" });
    if (userID === board.owner) {
      return res.json({ data: board });
    }
    return res.status(401).send({ error: "Not Authorized" });
  }
);
//Creating new Board
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const name = req.body.name;
      const owner = req.user.id;
      const newBoard = {
        name,
        owner,
      };
      const isValidated = boardValidation.validate(newBoard);
      if (isValidated.error) {
        // console.log(isValidated.error.details[0].message);
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
      console.error(error);
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

      if (isValidated.error) {
        // console.log(isValidated.error.details[0].message);
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
      console.error(error);
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
      const boardOwner = await User.findById(userID);
      const ownerUpdatedBoards = boardOwner.boardLists.filter((list) => {
        return list !== boardID;
      });
      boardOwner.boardLists = ownerUpdatedBoards;
      await boardOwner.save();
      res.json({ msg: "Board was deleted successfully", data: deletedBoard });
    } catch (error) {
      console.error(error);
    }
  }
);

//LISTS

//Getting all Lists
router.get("/lists/:id", async (req, res) => {
  const board = await Board.findById(req.params.id);
  if (!board) return res.status(404).send({ error: "Board does not exist" });
  res.json({ data: board.lists });
});

//Creating a new List
router.post("/lists/:id", async (req, res) => {
  try {
    const name = req.body.name;
    const boardID = req.params.id;
    const board = await Board.findOne({ _id: boardID });
    if (!board) return res.status(404).send({ error: "Board does not exist" });

    board.lists.forEach((list) => {
      if (
        isEqual(getTitleFormat(list.name), getTitleFormat(name))
        // list.name === name
        ) {
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
    console.error(error);
  }
});

//Update a list name
router.put("/lists/:id", async (req, res) => {
  try {
    const oldName = req.body.oldName;
    const newName = req.body.newName;
    const boardID = req.params.id;
    let updatedList;
    const board = await Board.findOne({ _id: boardID });
    if (!board) return res.status(404).send({ error: "Board does not exist" });

    board.lists.forEach((list) => {

      if (
        isEqual(getTitleFormat(list.name), getTitleFormat(newName)))
        // list.name === newName) 
        {
          console.log( "1 " + list.name + " 2 "+ newName)
        return res.status(400).send({ error: "List name should be unique" });
      }
    });
    board.lists.forEach((list) => {
      if (
        isEqual(getTitleFormat(list.name), getTitleFormat(oldName))
        // list.name === oldName
        ) {
        list.name = newName;
        updatedList = list;
      }
    });
    await board.save();

    return res.json({
      msg: "List was updated successfully",
      data: updatedList,
    });
  } catch (error) {
    console.error(error);
  }
});

//Delete a List
router.delete(
  "/lists/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userID = req.user.id;
      const boardID = req.params.id;
      const name = req.body.name;

      const board = await Board.findById(boardID);
      if (!board)
        return res.status(404).send({ error: "Board does not exist" });
      if (!board.owner === userID) {
        return res.status(401).send({ error: "Not Authorized" });
      }
      const filteredLists = board.lists.filter((list) => {
        return list.name !== name;
      });

      board.lists = filteredLists;
      await board.save();

      return res.json({ msg: "List was deleted successfully", data: board });
    } catch (error) {
      console.error(error);
    }
  }
);

//CARDS

//Getting all cards for a specific board
router.get("/lists/cards/:id", async (req, res) => {
  const board = await Board.findById(req.params.id);
  let boardLists = [];
  if (!board) return res.status(404).send({ error: "Board does not exist" });

  board.lists.forEach((list) => {
    boardLists.push(list.cards);
  });
  return res.json({data: boardLists });
});

//Getting all cards for a specific list
router.get("/lists/cards/:id/:name", async (req, res) => {
  const board = await Board.findById(req.params.id);
  if (!board) return res.status(404).send({ error: "Board does not exist" });

  board.lists.forEach((list) => {
    if (
      isEqual(getTitleFormat(list.name), getTitleFormat(req.params.name))
      // list.name.toLowerCase().trim() === req.params.name.toLowerCase().trim()
    ) {
      return res.json({ data: list.cards });
    }
  });
  return res.status(404).json({ msg: "List Not Found", data: {} });
});

//Getting a specific card for a specific list
router.get("/lists/cards/:id/:name/:title", async (req, res) => {
  const cardTitle = req.params.title;
  const listName = req.params.name;

  const board = await Board.findById(req.params.id);
  if (!board) return res.status(404).send({ error: "Board does not exist" });

  board.lists.forEach((list) => {
    if (
      isEqual(getTitleFormat(list.name), getTitleFormat(listName))
      //list.name.toLowerCase().trim() === listName.toLowerCase().trim()
      ) {
      list.cards.forEach((card) => {
        if (
          //card.title.toLowerCase().trim() === cardTitle.toLowerCase().trim()
          isEqual(getTitleFormat(card.title), getTitleFormat(cardTitle))
        ) {
          return res.json({ data: card });
        }
      });
      return res.status(404).json({ msg: "Card Not Found", data: {} });
    }
  });
  return res.status(404).json({ msg: "Card Not Found", data: {} });
});

//Creating a new card for certain list
router.post("/lists/cards/:id", async (req, res) => {
  try {
    const title = req.body.title;
    const listName = req.body.listName;
    const boardID = req.params.id;
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
      //if(list.name===listName)
      if ( isEqual(getTitleFormat(list.name), getTitleFormat(listName))) {
        list.cards.forEach((card) => {
          //if (card.title === title)
          if( isEqual(getTitleFormat(card.title), getTitleFormat(title))) {
            return res
              .status(400)
              .send({ error: "Card name should be unique" });
          }
        });
      }
    });
    const dbCard = new Card(newCard);

    board.lists.forEach((list) => {
     // if (list.name === listName)
     if(isEqual(getTitleFormat(list.name), getTitleFormat(listName)))
       {
        list.cards.push(dbCard);
      }
    });
    await board.save();
    return res.json({ msg: "Card was created successfully", data: dbCard });
  } catch (error) {
    console.error(error);
  }
});

//Update a Card
router.put("/lists/cards/:id", async (req, res) => {
  try {
    const oldTitle = req.body.oldTitle;
    const newTitle = req.body.newTitle;
    const oldListName = req.body.oldListName;
    const newListName = req.body.newListName;
    const oldDescription = req.body.oldDescription;
    const newDescription = req.body.newDescription;
    const boardID = req.params.id;
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
     // if (list.name.trim === newListName)
     if(isEqual(getTitleFormat(list.name), getTitleFormat(newListName))) {
        list.cards.forEach((card) => {
         // if (card.title === newTitle) 
         if(isEqual(getTitleFormat(card.title), getTitleFormat(newTitle))){
            return res
              .status(400)
              .send({ error: "Card name should be unique" });
          }
        });
      }
    });
    board.lists.forEach((list) => {
      // console.log(list.name , newListName, oldListName)
      //if (list.name === newListName)
     if(isEqual(getTitleFormat(list.name), getTitleFormat(newListName)))  {
        //console.log(list.name)
        const dbCardNew = new Card(newCard);
        list.cards.push(dbCardNew);
      }
      // TODO: should be replaced by util function check if exists
      //if (list.name === oldListName)
      if(isEqual(getTitleFormat(list.name), getTitleFormat(oldListName))) {
        let filteredCards = list.cards.filter((card) => {
          return card.title !== oldTitle;
        });
        list.cards = filteredCards;
      }
    });
    await board.save();
    return res.json({ msg: "Card is updated successfully", data: board });
  } catch (error) {
    console.error(error);
  }
});

//Delete a card
router.delete(
  "/lists/cards/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userID = req.user.id;
      const boardID = req.params.id;
      const listName = req.body.listName;
      const cardName = req.body.cardName;

      const board = await Board.findById(boardID);
      if (!board)
        return res.status(404).send({ error: "Board does not exist" });
      if (!board.owner === userID) {
        return res.status(401).send({ error: "Not Authorized" });
      }

      board.lists.forEach((list) => {
    //    if (list.name === listName) 
    if(isEqual(getTitleFormat(list.name), getTitleFormat(listName))){
          // console.log(list.name);
          let filteredCards = list.cards.filter((card) => {
            return card.title !== cardName;
          });
          list.cards = filteredCards;
        }
      });
      await board.save();
      return res.json({ msg: "Card was deleted successfully", data: board });
    } catch (error) {
      console.error(error);
    }
  }
);

module.exports = router;
