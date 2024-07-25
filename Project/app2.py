from flask import Flask, render_template, request
import pickle 
import numpy as np 
from sklearn.svm import SVC
import random


app=Flask('__main__')
model = pickle.load(open('Yield.pkl', 'rb'))
model2 = pickle.load(open('SVC.pkl', 'rb'))

def Balance(s):
    if(s==0):
        return random.choice(["Fruit" , "Vegetables"])
    elif (s==2):
        return random.choice(["Pulses" , "Commercial"])
    elif (s==1):
        return "Commercial"
    else:
        return "Fruit"
def Randomizer(s):
    if(s=="High"):
        return random.choice(["High","High","Medium"])
    elif(s=="Medium"):
        return random.choice(["Medium" , "Medium" , "Low"])
    else:
        return "Low"

@app.route('/')
def home():
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


    arr = [temp1, temp2, temp3]
    out = model2.predict([arr]) # 0 : fruits or veg , 2 : puls or commer , 3: fruit ,  1 : commercial 
                      # balance function converts to the above comment format
    outBalanced = Balance(out)
        
    
    return render_template('crop.html', out2= outBalanced, output=Randomizer(orgContent))


if __name__=='__main__':
    app.run(debug=True)