const fs = require("fs");

const filePath = "./texts/mongodbHistory.txt";

module.exports = {
  phonePreSave: function (next) {
    // this.createdBy = "JYS"
    next();
  },
  phonePostSave: function (doc, next) {
    const content = `User "${doc.createdBy}" had added new phone data with name "${doc.name}\n`;
    if (fs.existsSync(filePath)) {
      fs.writeFile(
        filePath,
        content,
        {
          encoding: "utf8",
          flag: "a",
        },
        (err) => {
          if (err) throw new Error(err.message);
        }
      );
    } else {
      fs.writeFile(
        filePath,
        content,
        {
          encoding: "utf8",
          flag: "w",
        },
        (err) => {
          if (err) throw new Error(err.message);
        }
      );
    }
    next();
  },
  phonePreFind: function (next) {
    this.find({ releaseYear: { $lte: Date.now() } });
    next();
  },

  phonePreAggregate: function (next) {
    this.pipeline().unshift({ $match: { releaseYear: { $lte: Date.now() } } });
    next();
  },
};
