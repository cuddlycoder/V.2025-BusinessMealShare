const local = true

let chosen_content = null
function highlight_meal(selectedmeal){
    //remove highlight from other meals
    let meals = document.querySelectorAll(".meal")
    
    //loop through every single meal and remove highlight
    meals.forEach(meal => meal.classList.remove("highlight"))
    
    // add highlight class to select meal
    selectedmeal.classList.add("highlight")
    let contentname = selectedmeal.querySelector("span")
    chosen_content = contentname.textContent
    console.log(chosen_content)
    //we are getting the value of delivery email (where we want to send the email) and donatoremail (from the user's selected donation) and making them equal to eachother
    donatoremail = document.getElementById("donatoremail").value
    deliveryemail = document.getElementById("deliveryemail").value
    deliveryemail = donatoremail

    deliveryfoodname = document.getElementById("allfoodname").value
    deliveryfoodweight = document.getElementById("allfoodweight").value
    food = document.getElementById("food").value
    lbs = document.getElementById("lbs").value
    food = deliveryfoodname
    lbs = deliveryfoodweight
    
}


let xhr = null
getXmlHttpRequestObject = function(){
    if(!xhr){
        xhr = new XMLHttpRequest()
    }

    return xhr
}
function SendReceiveData(e){
    e.preventDefault()
    let orgnameinput = document.getElementById("org-name").value
    console.log(orgnameinput)

    let reporgnameinput = document.getElementById("rep-org-name").value
    console.log(reporgnameinput)

    let orgemailinput = document.getElementById("org-email").value
    console.log(orgemailinput)

    let orgaddress = document.getElementById("org-address").value
    console.log(orgaddress)

    let cityinput = document.getElementById("city").value
    console.log(cityinput)

    let state = document.getElementById("state").value
    console.log(state)

    let zipcode = document.getElementById("zipcode").value
    console.log(zipcode)
    console.log(chosen_content)

    let confirmation_receive = document.getElementById("confirm_receive")
    confirmation_receive.innerHTML = ""

    //Send Data to backend using PostRequest method  
    //allows us to send data to backend using http postrequest
    xhr = getXmlHttpRequestObject()

    //Send postresquest
    if(local){
        xhr.open("POST","http://127.0.0.1:8000/views/receive",true)
    }
    else{
        xhr.open("POST","https://businessmealshare.onrender.com/views/receive",true)
    }
    xhr.onload = function(){
        if (xhr.status === 200){
            confirmation_receive.innerHTML = "Your information has been sent! Thank you!"
            confirmation_receive.style.color = "green"
        }
        else{
            confirmation_receive.innerHTML = "Upload failed! Please try again!"
            confirmation_receive.style.color = "red"
        }
    }

    xhr.setRequestHeader("Accept","application/json")
    xhr.setRequestHeader("Content-Type","application/json")

    //attach (staple) data to request
    //JSON IS A DICTIONARY. (NAME OF DATA AND DATA)
    xhr.send(JSON.stringify({
        "content": chosen_content,
        "org-name": orgnameinput, 
        "rep-org-name": reporgnameinput, 
        "org-email": orgemailinput, 
        "org-address": orgaddress,
        "city": cityinput, 
        "state": state, 
       "zipcode": zipcode }))


}

//Send user to main page (back button)
document.getElementById("back-recieve").addEventListener("click",function(event){
    if(local){
       window.location.href = "http://127.0.0.1:8000/views/" 
    }
    else{
        window.location.href = "https://businessmealshare.onrender.com/views/"
    }
})






document.getElementById("send").addEventListener("click", SendReceiveData)

//emailjs.init()

