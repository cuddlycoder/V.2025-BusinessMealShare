const local = true;

// Add scripts to head
const tfScript = document.createElement('script');
tfScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js';
document.head.appendChild(tfScript);

const tmScript = document.createElement('script');
tmScript.src = 'https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js';
document.head.appendChild(tmScript);

let model;
const URL = "https://teachablemachine.withgoogle.com/models/V8FHtn2Rp/";
// Load model
async function loadModel() {
    model = await tmImage.load(URL + "model.json", URL + "metadata.json");
}
// Wait a bit for scripts to load (not ideal, but simple)
setTimeout(() => {
    

    // Load model when page starts
    loadModel();
    console.log("Test")
}, 2000);

async function analyzeimage(file){
    if (!file) return;
    return new Promise((resolve) => {
        const img = new Image(); 
        img.src = window.URL.createObjectURL(file)
        // Wait for image to load, then predict
        img.onload = async function() {
            const predictions = await model.predict(img);
            
            // Find highest prediction
            let topPrediction = predictions[0];
            for (let i = 1; i < predictions.length; i++) {
                if (predictions[i].probability > topPrediction.probability) {
                    topPrediction = predictions[i];
                }
            }
            console.log(topPrediction.className)
            resolve(topPrediction.className)
        };
    })
    
    
}


// Create object to send requests
let xhr = null;

function getXmlHttpRequestObject() {
    if (!xhr) {
        // Create a new HTTP request object if it doesn't exist already
        xhr = new XMLHttpRequest();
    }
    return xhr;
}

async function SendDonateData(e) {
    e.preventDefault();
    let foodname = [];
    let foodweight = [];
    let confirm_message = document.getElementById("confirmation");
    let confirmation_done = document.getElementById("confirmation_done");
    
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

    let fileimage = dimageinput.files[0]
    let foodclass = await analyzeimage(fileimage)
    console.log(foodclass)
    if (foodclass != "Food"){
        confirm_message.innerHTML = "Please add a fresh food image. We do not accept stale food";
        confirm_message.style.color = "red";
        return
    }


    
    // Get image from input field
    let file = dimageinput.files[0];
    console.log(file);

    let allergies = document.getElementById("alle-rgies").value;
    console.log(allergies);

    let id = Math.floor(Math.random()* 1000000)
    console.log(id)

    

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
