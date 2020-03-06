/*jshint esversion: 6 */
/* jshint browser: true */
const users = {};
class User {
    constructor(email, password, nickname, phone, truename, birthday, address, zip){
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.nickname = nickname;
        this.truename = truename;
        this.birthday = birthday;
        this.address = address;
        this.zip = zip;
    }
}
//Add init users
users["usera@gmail.com"] = new User('usera@gmail.com', 'userapassword', 'Usera', '1111111111');
users["userb@gmail.com"] = new User( 'userb@gmail.com', 'userbpassword', 'Userb','1111211111');
users["userc@gmail.com"] = new User('userc@gmail.com', 'usercpassword', 'Userc', '1111311111');
users["a"] = new User('a', 'a', 'a', 'a');

const loginButton = document.getElementById('loginButton');
loginButton.addEventListener('click', loginAction);

function loginAction(e){
    e.preventDefault();
    let target = e.target;

    const emailInput = document.getElementById('emailInput').value;
    const passwordInput = document.getElementById('passwordInput').value;
    const loginStatusBar = document.getElementById('loginStatusBar');

    if (emailInput in users){
        if (users[emailInput].password === passwordInput){
            loginStatusBar.innerText = 'Passed. Redirecting';
            goToUserProfile(users[emailInput]);
        }else{
            let loginStatusBar = document.getElementById('loginStatusBar');
            loginStatusBar.innerText = 'Unpaired email and password';
        }
    }else{
        let loginStatusBar = document.getElementById('loginStatusBar');
        loginStatusBar.innerText = 'Unpaired email and password';
    }
}

function goToUserProfile(user) {
    document.write(`<!DOCTYPE html>
    <!--
    To change this license header, choose License Headers in Project Properties.
    To change this template file, choose Tools | Templates
    and open the template in the editor.
    -->
    <html lang="en">
        <head>
            <title>Profile View</title>
            <link rel="stylesheet" type="text/css" href="profileViewCSS.css">
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body>
            <div id='profilepiccontainer'></div>
            <div id='profiledescriptioncontainer'></div>
            <div class ="d1">
                <table id='userinteractionhistory'>
                    <tbody>

                    </tbody>
                </table>
                <div class="d2">
                    <button id ="uploaddataset">Upload Dataset</button>
                </div>
            </div>
            <script type="text/javascript" src="profileViewScript.js"></script>
        </body>
    </html>
`);
}
