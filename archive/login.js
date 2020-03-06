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

const wrapper = document.getElementById('wrapper');
wrapper.addEventListener('submit', loginAction);

function loginAction(e){
    e.preventDefault();
    const emailInput = document.getElementById('emailInput').value;
    const passwordInput = document.getElementById('passwordInput').value;
    const loginStatusBar = document.getElementById('loginStatusBar');

    if (emailInput in users){
        if (users[emailInput].password === passwordInput){
            loginStatusBar.innerText = 'Passed. Redirecting';
            window.location.replace("./profileView.html");
        }else{
            let loginStatusBar = document.getElementById('loginStatusBar');
            loginStatusBar.innerText = 'Unpaired email and password';
        }
    } else if (String(emailInput) == "admin") {
        window.location.replace("./controlPanel.html");
    } else {
        let loginStatusBar = document.getElementById('loginStatusBar');
        loginStatusBar.innerText = 'Unpaired email and password';
    }
}
