import multer from "multer"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './Public/temp')
    },
    filename: function (req, file, cb) {
      // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    // console.log(file,"myfile")
    cb(null, file.fieldname)    }
  })
  
 export const upload = multer({storage })