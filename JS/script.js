const savepassword=document.getElementById('submitbtn')
const urlbolck=document.getElementById('url')

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
    urlbolck.innerHTML=`<a href="${mainUrl}">www.${domain}</a>`
})

window.onload = (event) => {
savepassword.addEventListener('click',(e)=>
{   
    e.preventDefault()
    
    //Getting value of text Field Of UserName
    const username=document.getElementById('email').value;
    var encrypted_username = CryptoJS.AES.encrypt(username,username)
    encrypted_username = encrypted_username.toString();

    //Getting value of text Field Of Password
    const password=document.getElementById('password').value;
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

    document.getElementById('email').value = ""
    document.getElementById('password').value = ""
})    
}