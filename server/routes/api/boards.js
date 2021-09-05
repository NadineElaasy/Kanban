const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Board = require("../../models/Board");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenKey = require("../../config/keys").secretOrKey;
const passport = require("passport");
require("../../config/passport")(passport);

//Getting all boards
router.get("/", async (req, res) => {
  const boards = await Board.find();
  res.json({ data: boards });
});

//Creating new Board
router.post("/",  passport.authenticate("jwt", { session: false }),async (req, res) => {
  try {
    console.log(req.body);
    const name = req.body.name;
    const owner =req.user.id;
    const newBoard = {
      name,
      owner,
    };
    const dbBoard = await Board.create(newBoard);
    const updatedUser=await User.updateOne({_id:owner},{ $push: { boardList:dbBoard._id }})
    return res.json({ msg: "Board was created successfully", data: dbBoard });

  } catch (error) {
    console.log(error);
  }
});

//Updating the Board
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
        const userID=req.user.id
        const boardID = req.params.id;
        
      const board = await Board.findById(boardID);

      if (!board) return res.status(404).send({ error: "Board does not exist" });
        if(!board.owner===userID){
            return res.status(401).send({ error: "Not Authorized" });
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

//Deleting User
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
        const userID=req.user.id;
        const boardID = req.params.id;
        const board = await Board.findById(boardID);

      if (!board) return res.status(404).send({ error: "Board does not exist" });
        if(!board.owner===userID){
            return res.status(401).send({ error: "Not Authorized" });
        }
      const deletedBoard = await Board.findByIdAndRemove(boardID);
      res.json({ msg: "Board was deleted successfully", data: deletedBoard });
    } catch (error) {
      console.log(error);
    }
  }
);


module.exports = router;
