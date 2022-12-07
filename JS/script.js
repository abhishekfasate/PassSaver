const savepassword=document.querySelector('.btn')

savepassword.addEventListener('click',()=>
{   
    //Getting value of text Field Of UserName
    const username=document.getElementById('email').value;
    
    //Getting value of text Field Of Password
    const password=document.getElementById('password').value;
    
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
            username:username,
            password:password
        })
    }   
})

// function addtodb(e)
// {
//     e.preventDefault();
//     const username=document.getElementById('email').value;
//     const password=document.getElementById('password').value;
//     alert(username,password)
//     const request=window.indexedDB.open('data',1)
//     request.onupgradeneeded = ()=>{
//         request.result.createObjectStore('')
//     };
// }