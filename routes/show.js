const router = require("express").Router();
const File = require("../models/file");
router.get("/:uuid", async (req, res) => {
  // find uuid in database
    try {
        
        const file = await File.findOne({ uuid: req.params.uuid });
        if (!file) {
             return res.render("download", { error: "Link Expire or File is not Present in Database" });
        }
        return res.render("download", {
            uuid: file.uuid,
            fileName: file.filename,
            fileSize: file.size,
            downloadLink : `${process.env.APP_BASE_URL}/files/download/${file.uuid}`
        })
    } catch (err) {
        return res.render('download', {error:'Something went Wrong'});
    }
});

module.exports = router;
