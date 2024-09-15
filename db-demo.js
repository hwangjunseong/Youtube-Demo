// Get the client
const mysql = require("mysql2");

// Create the connection to database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "Youtube",
  password: "root",
  dateStrings: true, //뒤에 오는 .000Z없앰 =>vscode로 db에 있는거 불러올 때 string으로 부르는게 아니라 날 것의 상태로 불러왔었음
  //   timezone: "Asia/Seoul", //db에 있는 시간대 불러옴
});

// A simple SELECT query
connection.query("SELECT * FROM `users`", function (err, results, fields) {
  //const { id, email, name, created_at } = results[0];
  //   console.log(id, email, name, created_at);
  results.forEach(function (value, index, object) {
    // console.log(value, index, object);
    const { id, email, name, created_at } = value;
    console.log(id, email, name, created_at);
  });
  // console.log(results); // results contains rows returned by server
  console.log(fields); // fields contains extra meta data about results, if available
});
//results는 json array로 나옴
//fields는 results에 대한 describe을 포함하고있음

// Using placeholders
// connection.query(
//   "SELECT * FROM `table` WHERE `name` = ? AND `age` > ?",
//   ["Page", 45],
//   function (err, results) {
//     console.log(results);
//   }
// );

// WHERE `content` = `010-1234-5678`
