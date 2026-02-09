import sequelize from "../../../config/connectionDB.js";

export const showReport =async(req,res)=>{
    try{
        const response = {data:'api route working successfully'}//apply store procedur

        return res.json(response);

    }catch(error){
        throw error;
    }
}