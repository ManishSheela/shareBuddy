/// this page contains coding of file upload on server

const router = require("express").Router();
const multer = require("multer");
const { v4: uuid4 } = require("uuid");

const File = require("../models/file");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    //20582048-ankita.png
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

let upload = multer({
  storage: storage,
  limit: { fileSize: 100000 * 100 }, // 100mb
});

router.post("/", upload.single("myfile"), async (req, res) => {
  console.log(req.file);
  if (!req.file) {
    return res.json({ error: "File is Not uploaded Successfully" });
  }
  // if (err) {
  //   return res.status(500).send({ error: err.message });
  // }
  // store file in Database
  const file = new File({
    filename: req.file.filename,
    uuid: uuid4(),
    path: req.file.path,
    size: req.file.size,
  });
  const response = await file.save();
  return res.json({
    // http://localhost:3000/files/23344hfjdfa-334adjf23
    file: `${process.env.APP_BASE_URL}/files/${response.uuid}`,
  });
});

module.exports = router;
