//Allows local link and production link to run depending on link
const local = true
//Send user to donate page
document.getElementById("donate-btn").addEventListener("click",function(event){
    if(local){
        window.location.href = "http://127.0.0.1:8000/views/donate" //Local link
    }
    else{
        window.location.href = "https://businessmealshare.onrender.com/views/donate" //Production Link *SLAY* 
    }
})
//Send user to recieve page
document.getElementById("receive-btn").addEventListener("click",function(event){
    if(local){
        window.location.href = "http://127.0.0.1:8000/views/receive" //Local Link
    }
    else{
        window.location.href = "https://businessmealshare.onrender.com/views/receive" //Production Link *EVEN MORE SLAY*
    }
    })

document.getElementById("dropdown").addEventListener("mouseenter",() => {
    
})

