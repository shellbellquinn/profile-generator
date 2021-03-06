const fs = require("fs");
const axios = require("axios");
var pdf = require('html-pdf');
const inquirer = require("inquirer");

function generateHTML(data, color) {
    return `
 
    <!DOCTYPE html>
    <html lang="en"><head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <style>
    .container{
      margin-right: 0;
      margin-left: 0;
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;    
    }
    .card-body{
      background-color: ${color};
      color:white;
      text-align: center;
      padding: 10px;
      margin: 10px;
    }
    img{
      width: 200px;
      height: 200px;
    }
    </style> 
    <title>Profile Generator</title>
  </head>
    <body>
      <div class="container">
      <!--main card body-->
          <div class="row">
          <div class="col-lg-9 card-body">
                  <img src="${data.avatar_url}" alt="...">
                  <h2> Hello World! </h2>
                  <h2> My name is ${data.name}</h2>
              </div>
          </div>
          <div class="row text-center">
              <div class="col-lg-4 card-body">
                <h2>Public Respositories</h2>
                <h4>${data.public_repos}</h4>
              </div>
              <div class="col-lg-4 card-body">
                  <h2>Followers</h2>
                  <h4>${data.followers}</h4>
                </div> 
          </div>
              <div class="col-lg-4 card-body">
                  <h2>Following</h2>
                  <h4>${data.following}</h4>
                </div> 
          </div>
      </div>
  
  </body>
  </html>`
}

function userInput() {
    inquirer
        .prompt([{
                message: "Enter your GitHub username:",
                name: "name"
            },
            {
                type: "list",
                message: "Enter your favorite color:",
                name: "color",
                choices: ["Blue", "Green", "Pink", "Purple", "Yellow", "Red"]
            }
        ])
        .then(function ({
            name,
            color
        }) {
            const queryUrl = `https://api.github.com/users/${name}`;
            console.log(queryUrl)

            axios
                .get(queryUrl)
                .then(function (res) {
                    const queryUrl = `https://api.github.com/users/${name}/repos`;
                    axios
                        .get(queryUrl)
                        .then(function () {
                            const profile = generateHTML(res.data, color);
                            console.log()
                            fs.writeFile("./profile.html", profile, function (err) {
                                if (err) {
                                    throw err;
                                }
                                var html = fs.readFileSync('./profile.html', 'utf8');
                                var options = {
                                    format: "Letter",
                                };
                                /* convert to pdf */
                                pdf.create(html, options).toFile('./profile.pdf', function (err, res) {
                                    if (err) return console.log(err);
                                    console.log(res);
                                });

                                console.log('HTML generated');
                            });

                        });
                });
        })

}

userInput();