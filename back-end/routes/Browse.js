
import { Router } from "express"; 
const router = Router();
import { get } from "axios";
import morgan from "morgan"; 



router.get("/", morgan("dev"),(req, res, next) => {
    // use axios to make a request to an API for animal data
    get("https://my.api.mockaroo.com/browse.json?key=d0d8c110")
      .then(apiResponse => res.json(apiResponse.data)) // pass data along directly to client
      .catch(err => next(err)) // pass any errors to express
  })

  export default router;