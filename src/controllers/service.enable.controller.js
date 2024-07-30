import checkEmptyBody from "../utils/checkEmptyBody.js";
import validateBody from "../utils/validateBody.js";

export async function handleEnableService(req, res) {
    try {
        if(
            checkEmptyBody(req) &&
            validateBody(req.body, ['serviceName', 'port', 'method', 'endpoint'])
        ){
            return res.status(200).json(req.body);
        }
        
        return res.status(400).json({ Error: "Request body invalid" });
    
    } catch (err) {
        console.log(err);
        return res.status(500).json({ Error: "Internal server error" }); 
    }
}