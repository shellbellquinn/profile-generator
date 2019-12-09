const fs = require("fs");
const axios = require("axios");
var pdf = require('html-pdf');
const inquirer = require("inquirer");

function generateHTML(data, color, starCount) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <style>
    .container{
      margin-right: 0;
      margin-left: 0;
    }
    .card-body{
      background-color: ${color};
      color:white;
      box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
      padding: 10px;
      margin: 20px;
      text-align: center;
    }
    img{
      width: 200px;
      height: 200px;
    }
    .bio{
      text-align: center;
    }
    </style> 
    <title>Document</title>
  </head>
    <body>
      <div class="container">
      <!--main card body-->
          <div class="row">
          <div class="col-lg-9 card-body">
                  <img src="${data.avatar_url}" alt="...">
                  <h2> Hi! </h2>
                  <h2> My name is ${data.name}</h2>
                  <h5> Currently @ ${data.company}</h5>
                  <h6> 
                    <a href="https://www.google.com/maps/place/${data.location}" target="_blank"><svg id="i-location" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                      <circle cx="16" cy="11" r="4" />
                      <path d="M24 15 C21 22 16 30 16 30 16 30 11 22 8 15 5 8 10 2 16 2 22 2 27 8 24 15 Z" />
                  </svg> ${data.location}</a>
                    <a href=${data.html_url} target="_blank">
                      <svg id="i-github" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="32" height="32">
                        <path stroke-width="0" fill="currentColor" d="M32 0 C14 0 0 14 0 32 0 53 19 62 22 62 24 62 24 61 24 60 L24 55 C17 57 14 53 13 50 13 50 13 49 11 47 10 46 6 44 10 44 13 44 15 48 15 48 18 52 22 51 24 50 24 48 26 46 26 46 18 45 12 42 12 31 12 27 13 24 15 22 15 22 13 18 15 13 15 13 20 13 24 17 27 15 37 15 40 17 44 13 49 13 49 13 51 20 49 22 49 22 51 24 52 27 52 31 52 42 45 45 38 46 39 47 40 49 40 52 L40 60 C40 61 40 62 42 62 45 62 64 53 64 32 64 14 50 0 32 0 Z" />
                    </svg> Git</a>
                    <a href=${data.blog} target="_blank">
                      <svg id="i-feed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                        <circle cx="6" cy="26" r="2" fill="currentColor" />
                        <path d="M4 15 C11 15 17 21 17 28 M4 6 C17 6 26 15 26 28" />
                    </svg> Blog</a>
                  </h6>
              </div>
          </div>
          <div class="row bio">
            <h3>${data.bio}</h3>
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
          <div class="row">
              <div class="col-lg-4 card-body">
                <h2>Github Stars</h2>
                <h4>${starCount}</h4>
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

function promptUser() {
  inquirer
    .prompt([
      {
        message: "Enter your GitHub username:",
        name: "username"
      },
      {
        message: "Enter your favourite color:",
        name: "color"
      }
    ])
    .then(function ({ username, color }) {
      const queryUrl = `https://api.github.com/users/${username}`;
      console.log(queryUrl)

      axios
        .get(queryUrl)
        .then(function (res) {
            const queryUrl = `https://api.github.com/users/${username}/repos`;
            axios
            .get(queryUrl)
            .then(function (response) {
               let result = response.data.map(repo => repo.stargazers_count);
               let count = result.reduce((a, b) => a + b, 0);
              //  console.log(count)
               const profile = generateHTML(res.data, color, count);
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
     
                 console.log('Saved html');
               });

              });
        });
    })

}

promptUser();
