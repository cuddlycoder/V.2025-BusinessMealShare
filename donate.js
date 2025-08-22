const local = true;

// Create object to send requests
let xhr = null;

function getXmlHttpRequestObject() {
    if (!xhr) {
        // Create a new HTTP request object if it doesn't exist already
        xhr = new XMLHttpRequest();
    }
    return xhr;
}

function SendDonateData(e) {
    e.preventDefault();
    let foodname = [];
    let foodweight = [];
    
    // Get input values from input field
    let bfullname = document.getElementById("b-full-name").value;
    console.log(bfullname);

    let bemailinput = document.getElementById("b-email").value;
    console.log(bemailinput);

    let baddress = document.getElementById("b-address").value;
    console.log(baddress);

    let dname = document.getElementsByClassName("food-name");
    let dweight = document.getElementsByClassName("food-weight");
    
    Array.from(dname).forEach(element => {
        console.log(element.value);
        foodname.push(element.value);
    });
    
    Array.from(dweight).forEach(element => {
        console.log(element.value);
        foodweight.push(element.value);
    });

    let dimageinput = document.getElementById("donation-image");
    console.log(dimageinput);
    
    // Get image from input field
    let file = dimageinput.files[0];
    console.log(file);

    let allergies = document.getElementById("alle-rgies").value;
    console.log(allergies);

    let id = Math.floor(Math.random()* 1000000)
    console.log(id)

    let confirm_message = document.getElementById("confirmation");
    let confirmation_done = document.getElementById("confirmation_done");

    if (!file) {
        confirm_message.innerHTML = "Please select a meal image!";
        confirm_message.style.color = "red";
        return;
    }

    // Clear old messages
    confirm_message.innerHTML = "";
    confirmation_done.innerHTML = "";

    const formdata = new FormData();

    // Attach (staple) data to request
    formdata.append("image", file);
    formdata.append("data", JSON.stringify({
        "business-name": bfullname,
        "business-email": bemailinput,
        "business-location": baddress,
        "donation-name": foodname,
        "donation-weight": foodweight,
        "allergies": allergies,
        "id" : id
    }));

    // Send Data to backend using POST request method
    xhr = getXmlHttpRequestObject();

    if (local) {
        xhr.open("POST", "http://127.0.0.1:8000/views/donate", true);
    } else {
        xhr.open("POST", "https://businessmealshare.onrender.com/views/donate", true);
    }

    xhr.onload = function () {
        if (xhr.status === 200) {
            confirmation_done.innerHTML = "Your information has been sent! Thank you!";
            confirmation_done.style.color = "green";
        } else {
            confirmation_done.innerHTML = "File upload failed! Please try again!";
            confirmation_done.style.color = "red";
        }
    };

    xhr.send(formdata);
}

document.getElementById("add-row").addEventListener("click", function (event) {
    const list = document.getElementById("List");
    const div = document.createElement("div");
    div.className = "list-item";
    div.id = "list-item";

    const nameinput = document.createElement("input");
    const weightinput = document.createElement("input");
    //const deletebutton = document.createElement("button")

    nameinput.type = "text";
    weightinput.type = "text";
    nameinput.name = "list-item";
    weightinput.name = "list-item";
    nameinput.className = "form-control food-name";
    weightinput.className = "form-control food-weight";
    weightinput.id = "weight";
    nameinput.id = "item";
    nameinput.placeholder = "Apples";
    weightinput.placeholder = "50lbs";
    //deletebutton.className = "deletebutton"
    //deletebutton.type = "button"
    //deletebutton.onclick = () => deleterow(event)
    
    div.appendChild(nameinput);
    div.appendChild(weightinput);
    //div.appendChild(deletebutton);

    list.appendChild(div);
});

document.getElementById("delete-row").addEventListener("click", function () {
    const list = document.getElementById("List"); 
    if (list.children.length > 0) {
        list.removeChild(list.lastElementChild);
    }
});

// Send user to main page (back button)
document.getElementById("back-donate").addEventListener("click", function (event) {
    if (local) {
        window.location.href = "http://127.0.0.1:8000/views/";
    } else {
        window.location.href = "https://businessmealshare.onrender.com/views/";
    }
});

document.getElementById("send").addEventListener("click", SendDonateData);


function deleterow(event){
    console.log("Working")
    console.log(event.target)
}


function deleter(){
    // Get all delete buttons
    const deleteButtons = document.querySelectorAll(".deletebutton");

    // Add event listener to each delete button
    deleteButtons.forEach(button => {
        button.addEventListener("click", function() {
            console.log("Working")
            // Get the parent li element and remove it
            const row = button.parentElement;
            row.remove();
        });
    });
}
