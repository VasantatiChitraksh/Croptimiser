#Instructions
    #install flask if not present
    #also pip install Flask-PyMongo    
    #run app.py and go to url http://127.0.0.1:5000/

from flask import Flask, render_template, request, redirect,url_for
from flask_pymongo import PyMongo
import time
import pickle 
import numpy as np 
from sklearn.svm import SVC
import random

app = Flask('__main__')
model = pickle.load(open('model.pkl', 'rb'))  #model could be opened inside the POST request instead for efficieny , not a big deal here tho.
model1 = pickle.load(open('Yield.pkl', 'rb'))
model2 = pickle.load(open('SVC.pkl', 'rb'))
app.config["MONGO_URI"] = "mongodb://localhost:27017/Croptimizer"
mongo = PyMongo(app)
userName = ""

def GenerateExamples(s):
    if(s=="Commercial"):
        return "Cotton, Oil Seeds, Cocoa, Coconut"
    elif(s=="Fruits/Vegetables"):
        return "Mango, Potato, Banana, Ladies Finger"
    elif (s=="Pulses"):
        return "Chole(chickpeas), Dal(lentil), Rajma(kidney beans), grams "
    else:
        return "Rice, Wheat, Maize, Barley"
def Balance(s):
    if(s==0):
        list1 = ["Pulses" , "Fruits/Vegetables"]
        return random.choices(list1,weights=(30,70))
    elif (s==2):
        list2 = ["Cereal" ,  "Commercial"]
        return random.choices(list2, weights=(70,30))
    
    else:
        return "Fruits/Vegetables"
def Randomizer(s):
    if(s=="High"):
        return random.choice(["High","High","Medium"])
    elif(s=="Medium"):
        return random.choice(["Medium" , "Medium" , "Low"])
    else:
        return "Low"

def getComments(val):
    global coms
    coms = mongo.db.comments.find({'art-id':val})
    print(coms)

def renderCommsHTML(coms):
    renderredHTML = ""
    coms = list(coms)
    for i in coms:
        renderredHTML += f'''   <div class="comment-container">
        <p class="comment-user">{i['user']}</p>
        <p class="the-comment">{i['comment']}</p>
    </div>'''
    return renderredHTML


@app.route('/')
def home() : 
    return render_template('index.html',userName=userName)

@app.route('/home')
def homeP() :
    return render_template('index.html',userName=userName)
@app.route('/donate')
def donate() :
    return "Donate page coming Soon..!"
@app.route('/sign-in-page')
def signInPage() :
    return render_template("sign-in.html")
@app.route('/sign-up-page')
def signUpPage() :
    return render_template("sign-up.html")

@app.route('/sign-in', methods = ['POST'])
def signIn():
    global userName
    name = request.form.get('user-name')
    pwd = request.form.get('password')
    req = mongo.db.users.find_one({'user':name})
    if req :
        if (pwd==req['password']):
            userName=name
            return render_template('index.html',userName=userName)
        else:
            
            return render_template('sign-in.html',pwdMsg="Invalid Password")
        
    return render_template('sign-in.html' ,userNameMsg = "user doesn't exist")

@app.route('/sign-up', methods=['POST'])
def signUP():
    global userName
    name = request.form.get('user-name')
    pwd = request.form.get('password')
    req = mongo.db.users.find_one({'user':name})
    if req :
        return render_template("sign-up.html", userNameMsg = "user already exists")
    else :
        if(not len(pwd)):
            return render_template("sign-up.html", pwdMsg = "Set a password first")
        else:
            mongo.db.users.insert_one({'user':name, 'password':pwd})
            userName=name
            return render_template('index.html',userName=userName)
@app.route('/logout')
def Logout():
    global userName
    userName = "" 
    return render_template("index.html")
@app.route('/read-article',   methods = ['POST','GET'])
def articlePage():
    global val
    val = request.form.get('art-id')
    req = mongo.db.articles.find()
    global data 
    getComments(int(val))
    data = req[int(val)]
    jinjaHTML = renderCommsHTML(coms)
    return render_template("articles.html" , output = data,commentcontainer=jinjaHTML,userName=userName)
@app.route('/post-comment' , methods= ['POST'])
def postComment():
    global userName
    global data
    global val
    com = request.form.get('comment')
    if(len(userName)==0):
        return render_template("articles.html",msg=f"Sign In or Sign Up to comment{userName}", output=data)
    else:
        
        mongo.db.comments.insert_one({'art-id':int(val), 'user':userName , 'comment': com})
        getComments(int(val))
        req = mongo.db.articles.find()
        data = req[int(val)]
        jinjaHTML = renderCommsHTML(coms)
        return render_template('articles.html',output=data, commentcontainer=jinjaHTML, userName=userName)

@app.route('/weather',   methods = ['POST'])
def weather():
    return render_template('weather.html')

@app.route('/forestfire',   methods = ['POST'])
def forestFire():
    return render_template('forest-fire.html')
@app.route('/submit', methods=['POST'])
def submit():
    temp = request.form.get('temperature')
    humid = request.form.get('humidity')
    oxy = request.form.get('oxygen')
    features = [int(temp) ,int(oxy), int(humid) ]
    final = [np.array(features)]
    print(features)
    print(final)
    prediction = model.predict_proba(final)
    output = '{0:.{1}f}'.format(prediction[0][1], 2)
    time.sleep(0.5)
    tempp = prediction[0][1]
    if(tempp>0.75):
        put = "Very High chance of forest fire"
    elif(tempp>0.5):
        put = "Moderate Chance"
    else:
        put = "Low Chance"

    return render_template('forest-fire.html', show_popup = True ,put = put, output = output, temperature = temp,humidity = humid, oxygen = oxy)

@app.route('/crop-yield')
def cropYield():
    return render_template('crop.html')
@app.route('/crop-predict' , methods=['POST'])
def cropPredict():
    soilType = request.form.get('soil-type')
    temp = request.form.get('temperature')
    rainfall = request.form.get('rainfall')
    orgContent = request.form.get('organic-content') #DONE convert to High,med low, dropdown
    soil_map = {
    "Loamy": 3,
    "Sandy Loam": 0,
    "Sandy": 2,
    "Black": 4,
    "Gravelly": 6,
    "Clayey": 5,
    "Clayey Loam": 1
    }
    print(soil_map[soilType],temp,rainfall,orgContent)
    temp1 = 6
    temp2  = 17
    temp3 = 120
    #


    arr = [soil_map[soilType],float(temp),float(rainfall)]
    out = model2.predict([arr]) # 0 : fruits or veg , 2 : puls or commer , 3: fruit ,  1 : commercial 
                      # balance function converts to the above comment format
    outBalanced = Balance(out)[0]

    out3 = GenerateExamples(outBalanced)

    
    return render_template('crop.html', out2= outBalanced, output=Randomizer(orgContent) ,out3=out3)

if __name__=='__main__':
    app.run(debug=True)
    