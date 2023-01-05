const savepassword=document.getElementById('submitbtn')
const urlbolck=document.getElementById('url')
const usernameField = document.getElementById('email');
const passwordField = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');

//Getting the URL name to make sure to save the password for particular site
chrome.tabs.query(
    {'active': true, 
    'lastFocusedWindow': true
    },
    function(tabs) 
    {
    var domain;
    var mainUrl = tabs[0].url;
    if (mainUrl.indexOf("://") > -1)
    {
        domain = mainUrl.split('/')[2];
    } 
    else
    {
        domain = mainUrl.split('/')[0];
    }    
    urlbolck.innerHTML=`<a href="${mainUrl}">${domain}</a>`
})

//  toggle Eye button password in version 10 we are using this button as decrypt button
eyeIcon()

//Submit button should be disabled if textfield is empty
 usernameField && passwordField.addEventListener("keyup",(e)=>
 {
            const value = e.target.value;
            savepassword.disabled=false
            if(value==="")
            {
                savepassword.disabled=true
            }
 })

/*On load of extension and click on savepassword button add username and password to the 
  the database using CryptoJS encryption
*/
window.onload = (event) => {
savepassword.addEventListener('click',(e)=>
{   
    e.preventDefault()
    
    //Getting value of text Field Of UserName
    const username=usernameField.value;
    var encrypted_username = CryptoJS.AES.encrypt(username,username)
    encrypted_username = encrypted_username.toString();

    //Getting value of text Field Of Password
    const password=passwordField.value;
    var encrypted_password = CryptoJS.AES.encrypt(password,username);
    encrypted_password = encrypted_password.toString();
    
    //Getting value of Url from the innertext field of the URL
    const url =document.getElementById('url').innerText

    //open takes arguments as (databasename,version[optional])
    let indexdb=indexedDB.open('PasswordSaver',1) 
    
    indexdb.onupgradeneeded=()=>
    {
        let res =indexdb.result;
        res.createObjectStore('data',{autoIncrement:true})
    }

    indexdb.onsuccess=()=>{
        let res=indexdb.result;
        let tx=res.transaction('data','readwrite')
        let store=tx.objectStore('data')
        store.put({
            username:encrypted_username,
            password:encrypted_password,
            url:url
        })
    }   

    //text-box should be empty after data store in database

    usernameField.value = ""
    passwordField.value = ""
})    
}

function eyeIcon() 
{
    togglePassword.addEventListener('click', function (e) {
    // toggle the type attribute
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
    // toggle the eye slash icon
    this.classList.toggle('fa-eye');
});
}