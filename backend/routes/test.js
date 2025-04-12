const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('✅ API hoạt động bình thường!');
});

module.exports = router;
