from flask import Blueprint, render_template,request
import json, sqlite3, ast

views = Blueprint(__name__, "views")

foods = []

#Insert donations in database
def insert_donation(name, email, location, imagename, dcontent, dweight, allergies, contentid, received):
    connection = sqlite3.connect("BusinessMealShareDatabase.db")
    cursor = connection.cursor()
    cursor.execute('''
        INSERT INTO Donator (BusinessName, BusinessEmail, BusinessLocation, ItemsName, ItemsWeight, ItemsImage, Allergies, ContentId, Received)
        VALUES (?,?,?,?,?,?,?,?,?)
    ''', (name, email, location, dcontent, dweight, imagename, allergies, contentid, received))

    connection.commit()
    connection.close()

def pull_donations():
    connection = sqlite3.connect("BusinessMealShareDatabase.db")
    cursor = connection.cursor()
    cursor.execute('''SELECT BusinessName, BusinessEmail, BusinessLocation, ItemsName, ItemsWeight, ItemsImage, Allergies, Received FROM Donator WHERE Received = 'NO' ''')
    donations = cursor.fetchall() 
    
    connection.close()
    formatteddonations = []
    print(donations)
    for item in donations:
        item = list (item) #convert donation data from tupple to a list
        #fix donated foods names data
        donatedfoods = item[3]
        donatedfoods = ast.literal_eval(donatedfoods) # convert string of donated foods into a list
        item[3] = donatedfoods
        

        #fix pounds data 
        foodsweight = item[4]
        foodsweight = ast.literal_eval(foodsweight)
        item[4] = foodsweight
        
        formatteddonations.append(item)

    print (formatteddonations)
    return formatteddonations


#Insert recievers in database
def insert_recievers(orgname, orgrep, email, location, contentid):
    connection = sqlite3.connect("BusinessMealShareDatabase.db")
    cursor = connection.cursor()
    cursor.execute('''
        INSERT INTO Receiver (Name, Representative, Email, Address, DonationId)
        VALUES (?,?,?,?,?)
    ''', (orgname, orgrep, email, location, contentid))

    connection.commit()
    connection.close()

def modify_donator(ContentId, value):
    connection = sqlite3.connect("BusinessMealShareDatabase.db")
    cursor = connection.cursor()
    cursor.execute('''
                    UPDATE Donator SET Received = ? WHERE ContentId = ?
                   ''',(value, ContentId))

    connection.commit()
    connection.close()




#Renders each page
@views.route("/")
def home():
    # pull donations from data base and show
    global foods
    if len(foods) == 0: # TO DO ; PULL DATA THAT DOESNT EXIST IN LIST ALREADY
        foods = pull_donations()
    return render_template("index.html")
    
@views.route("/donate",methods = ["POST", "GET"])
def donate():
    global foods
    
    #recieve data from front end
    if request.method == "POST": 
        #gets image
        file = request.files["image"]
        print(file)
        
        #saves the image
        file.save("static/images/" + file.filename)
        
        #Saves image name
        image_name = file.filename

        #Gets json data
        JSON_data = request.form.get("data")
        print(JSON_data)
        
        #Loads each json data
        pars_data = json.loads(JSON_data)
        
        bname = pars_data.get("business-name")
        bemail = pars_data.get("business-email")
        blocation = pars_data.get("business-location")
        d_content = pars_data.get("donation-name")
        d_weight = pars_data.get("donation-weight")
        allergies = pars_data.get("allergies")
        id = pars_data.get("id")

        donatedfood = [bname, bemail, blocation, d_content, d_weight, image_name, allergies, id]
        foods.append(donatedfood)
        content = str(d_content)
        weight = str(d_weight)
        content_id = int(id)
        insert_donation(bname, bemail, blocation, image_name, content, weight, allergies, content_id, received = "NO")
        print (donatedfood)
    return render_template("donate.html")

@views.route("/receive", methods = ["POST","GET"])
def receive():
    global foods
    #recieve data from front end
    if request.method == "POST":
        data = request.get_json()
        print(data)
        id = data["content"]
        id = int(id)
        orgname = data["org-name"]
        orgrep = data["rep-org-name"]
        orgemail = data["org-email"]
        orgaddress = data["org-address"] + data["city"] + data["state"] + data["zipcode"]
        insert_recievers(orgname, orgrep, orgemail, orgaddress, id)
        #modify_donator(str(id),"YES")

        #Looking to see if id of donation matches id that we have got then removing that whole donation from the foods list because user already received it.
        for donation in foods:
            if id in donation:
                print("DELETED")
                foods.remove(donation)
    return render_template("receive.html",meals = foods,zip = zip)

@views.route("/login")
def login():
    return render_template("login.html")

@views.route("/signup")
def signup():
    return render_template("signup.html")