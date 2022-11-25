const express = require("express");
const path = require("path");
const format = require("date-fns/format");
const isValid = require("date-fns/isValid");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "todoApplication.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

// API 1 

// Scenario 1
const hasStatus = (requestQuery) => {
    return {
        requestQuery.status !== undefined;
    };
}


// Scenario 2 

const hasPriority = (requestQuery) => {
    return {
        requestQuery.priority !== undefined
    };
}

// Scenario 3

const hasPriorityStatus = (requestQuery) => {
    return{
        requestQuery.priority !== undefined && requestQuery.status !== undefined
    };
} 

// Scenario 4 

const hasSearch_q = (requestQuery) => {
    return{
        requestQuery.search_q !== undefined
    };
}

// Scenario 5 

const hasCategoryAndStatus = (requestQuery) => {
    return{
        requestQuery.category !== undefined && requestQuery.status !== undefined
    };
}

// Scenario 6 

const hasCategory = (requestQuery) => {
    return{
        requestQuery.category !== undefined 
    };
}

// Scenario 7 

const hasCategoryAndPriority = (requestQuery) => {
    return{
        requestQuery.category !== undefined && requestQuery.priority !== undefined
    };
}

// Writing API code for (GET)

app.get("/todos/",async (request,response) => {
    let getTodosQuery = "";
    const {category,priority,status,search_q = ""} = request.query;
    switch (true) {
        case hasStatus(request.query):
            
            getTodosQuery = `SELECT 
                * FROM todo
                WHERE status = '${status}'
            `;
            const dbData = await db.all(getTodosQuery);
            if (dbData === undefined){
                response.send("Invalid Todo Status");
                response.status(400)
            }else{
                response.send(dbData)
            }
            break;
       case hasPriority(request.query){
           getTodosQuery = `
            SELECT * FROM todo
            WHERE priority = '${priority}'
           `;
           const dbData = await db.all(getTodosQuery);
            if (dbData === undefined){
                response.send("Invalid Todo Priority");
                response.status(400)
            }else{
                response.send(dbData)
            }
            break;
       }
       case hasPriorityStatus(request.query){
           getTodosQuery = `
            SELECT * FROM todo
            WHERE priority = '${priority}'
            AND status = '${status}'
           `;
           const dbData = await db.all(getTodosQuery);
            if (dbData === undefined){
                response.send("Invalid Todo Priority");
                response.status(400)
            }else{
                response.send(dbData)
            }
            break;
       }

       case hasSearch_q(request.query){
           getTodosQuery = `
            SELECT * FROM todo
            WHERE todo LIKE "%${search_q}%";
           `;
           const dbData = await db.all(getTodosQuery);
            if (dbData === undefined){
                response.send("Invalid Todo Type");
                response.status(400)
            }else{
                response.send(dbData)
            }
            break;
       }

       case hasCategoryAndStatus(request.query){
           getTodosQuery = `
            SELECT * FROM todo
            WHERE category = "${category}" AND status = "${status}";
           `;
           const dbData = await db.all(getTodosQuery);
            if (dbData === undefined){
                response.send("Invalid Todo Category");
                response.status(400)
            }else{
                response.send(dbData)
            }
            break;
       }

       case hasCategory(request.query){
           getTodosQuery = `
            SELECT * FROM todo
            WHERE category = "${category}";
           `;
           const dbData = await db.all(getTodosQuery);
            if (dbData === undefined){
                response.send("Invalid Todo Category");
                response.status(400)
            }else{
                response.send(dbData)
            }
            break;
       }

       case hasCategoryAndPriority(request.query){
           const {category,priority} = request.query;
           getTodosQuery = `
            SELECT * FROM todo
            WHERE category = "${category}" AND priority = "${priority}";
           `;
           const dbData = await db.all(getTodosQuery);
            if (dbData === undefined){
                response.send("Invalid Todo Category");
                response.status(400)
            }else{
                response.send(dbData)
            }
            break;
       }
        default:
            getTodosQuery = `SELECT * FROM todo`
            break;
    }
})