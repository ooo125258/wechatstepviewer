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

pathName = document.location.pathname.split('/');
if(pathName[pathName.length - 1] === 'login.html'){
    const wrapper = document.getElementById('wrapper');
    wrapper.addEventListener('submit', loginAction);
}else{
    document.getElementById("regisButton").addEventListener("click",regisAction);
}

function regisAction(e){
    console.log('received');
    e.preventDefault();
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
    const nicknameInput = document.getElementById('nicknameInput');
    const phoneInput = document.getElementById('phoneInput');
    const truenameInput = document.getElementById('truenameInput');
    const birthdayInput = document.getElementById('birthdayInput');
    const addressInput = document.getElementById('addressInput');
    const zipInput = document.getElementById('zipInput');
    
    let target = e.target;

    if(target.id != 'regisButton'){
        console.log(target);
        console.log("error");
        return;
    }
    const regisStatus = document.getElementsByClassName('Status')[0];
    console.log(emailInput);
    if (emailInput.value && passwordInput.value && nicknameInput.value && phoneInput.value){
        if (emailInput.value in users){
            regisStatus.innerText = "Registration failed. There is already an account linked with this email";
        }
        else{
            users[emailInput.value] = new User(emailInput.value,passwordInput.value,nicknameInput.value,phoneInput.value,truenameInput.value,birthdayInput.value,addressInput.value,zipInput.value);
            regisStatus.innerHTML = "<a class='login-element' href='./login.html'>Registration succeeded. Please click here go back to log in.</a>";
        }
    }else{
        console.log('inputs');
        console.log(emailInput);
        console.log(passwordInput);
        console.log(nicknameInput);
        console.log(phoneInput);
        regisStatus.innerText = "Registration failed. Are you lack of some information?";
    }
    
}


function loginAction(e){
    e.preventDefault();
    const emailInput = document.getElementById('emailInput').value;
    const passwordInput = document.getElementById('passwordInput').value;
    const loginStatusBar = document.getElementById('loginStatusBar');
    
    if (emailInput in users){
        if (users[emailInput].password === passwordInput){
            loginStatusBar.innerText = 'Passed. Redirecting';
            window.open("./profileView.html");
        }else{
            let loginStatusBar = document.getElementById('loginStatusBar');
            loginStatusBar.innerText = 'Unpaired email and password';
        }
    }else{
        let loginStatusBar = document.getElementById('loginStatusBar');
        loginStatusBar.innerText = 'Unpaired email and password';
    }   
}