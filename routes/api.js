const router = require("express").Router();
const Transaction = require("../models/transaction.js");

router.post("/api/transaction", ({body}, res) => {
  console.log("Post",body)
  Transaction.create(body)
    .then(dbTransaction => {
      console.log("Post",dbTransaction)
      res.json(dbTransaction);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

router.post("/api/transaction/bulk", ({body}, res) => {
  console.log("Bulk",body)
  Transaction.insertMany(body)
    .then(dbTransaction => {
      console.log("Tr bulk",dbTransaction)
      res.json(dbTransaction);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

router.get("/api/transaction", (req, res) => {
  console.log("GET")
  Transaction.find({})
    .then(dbTransaction => {
      console.log("Get",dbTransaction)
      res.json(dbTransaction);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

module.exports = router;
