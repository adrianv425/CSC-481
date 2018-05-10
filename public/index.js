var arrowBtn = document.getElementById("arrowbtn");

//Variables for each class and course number
var name1 = "", num1 = "";
var name2 = "", num2 = "";
var name3 = "", num3 = "";
var name4 = "", num4 = "";
var name5 = "", num5 = "";

//Variables to hold the reference to each class in the database
var c1Ref, c2Ref, c3Ref, c4Ref, c5Ref;
var c1selections =[], c2selections =[], c3selections =[], c4selections =[], c5selections =[];

//variable to hold classes selected by algorithm
var selected = [];

function donow(){
    sessionStorage.clear();
    //Get the values inputted by the user and hold them in variables respectively
    var c1Element = document.getElementById('class1').value;
    var c2Element = document.getElementById('class2').value;
    var c3Element = document.getElementById('class3').value;
    var c4Element = document.getElementById('class4').value;
    var c5Element = document.getElementById('class5').value;


    //Test window
    /*alert("You inputted:\n" + c1Element +"\n" 
                    + c2Element +"\n" 
                    + c3Element +"\n"  
                    + c4Element +"\n"  
                    + c5Element);*/

    //Slice string to have the class name (CSC, BUS, CIS) and course number (101,121,301)
    if(c1Element.length > 5){
        name1 = c1Element.substr(0,3);
        num1 = c1Element.substr(4,3);
    }
    if(c2Element.length > 5){
        name2 = c2Element.substr(0,3);
        num2 = c2Element.substr(4,3);
    }
    if(c3Element.length > 5){
        name3 = c3Element.substr(0,3);
        num3 = c3Element.substr(4,3);
    }
    if(c4Element.length > 5){
        name4 = c4Element.substr(0,3);
        num4 = c4Element.substr(4,3);
    }
    if(c5Element.length > 5){
        name5 = c5Element.substr(0,3);
        num5 = c5Element.substr(4,3);
    }

    //Find the references in database
    var firebaseD = firebase.database();
    if(name1 != ""){
        c1Ref = firebaseD.ref("/"+name1+"/"+num1);
        if(name2 != ""){
            c2Ref = firebaseD.ref("/"+name2+"/"+num2);
            if(name3 != ""){
                c3Ref = firebaseD.ref("/"+name3+"/"+num3);
                if(name4 != ""){
                    c4Ref = firebaseD.ref("/"+name4+"/"+num4);
                    if(name5 != ""){
                        c5Ref = firebaseD.ref("/"+name5+"/"+num5)
                    }
                }
            }
        }
    }


    allSelections(c1Ref, 1, c1selections);
    allSelections(c2Ref, 2, c2selections);
    allSelections(c3Ref, 3, c3selections);
    allSelections(c4Ref, 4, c4selections);
    allSelections(c5Ref, 5, c5selections);
}

function allSelections(ref, num, sel){

    ref.once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            //display all available sections for each course
            document.getElementById("headc" + num).innerHTML = childData.name || "not found";
            document.getElementById("c" + num).innerHTML = (document.getElementById("c"+num).innerHTML 
                        + "<div class='panel-body' id = '" +childData.sub +childData.course + childData.sec+"'>"
                        +"*elementId for this class = "+childData.sub +childData.course + childData.sec + "<br>" + childData.sub+ childData.course 
                        + " section:" + childData.sec + " @ " + childData.time + " on " + childData.days + "<br>"
                        +"Taught by: " + childData.pFirstName + " " + childData.pLastName + " who is rated x/5.0</div>");
            sel[sel.length] = childData;
       });
      });
}

//function to zero an array
//code found at https://stackoverflow.com/questions/3689903/how-to-create-a-2d-array-of-zeroes-in-javascript
function zeroSchedule(dimensions){
    var array = [];

    for (var i = 0; i < dimensions[0]; ++i) {
        array.push(dimensions.length == 1 ? 0 : zeroSchedule(dimensions.slice(1)));
    }

    return array;
}

function scheduler(){
    console.log("running...");
    //variables
    var schedule = zeroSchedule([7,64]);
    var row1, row2;
    var startTime, endTime, sTime, eTime, clength;
    var t = 0, i = 0;
    var terminator;

    //sort by least class selections first
    var temp = [c1selections, c2selections, c3selections, c4selections, c5selections];
    temp.sort(function(a, b){return a.length - b.length});

    console.log("Entering while loop: " + t);
    while (t<5){
        terminator = false;
        if(temp[t].length>0 && i < temp[t].length){
            //Numerate class day1
            console.log("numerating..." + temp[t][i].name);
            if(temp[t][i].days.substr(0,2) == ("Th"||"TH")){
                row1 = 3;
            }
            else if(temp[t][i].days.substr(0,2) == ("Su"||"SU")){
                row1 = 6
            }
            else{
                switch (temp[t][i].days.substr(0,1)){
                    case "M":
                        row1 = 0;
                        break;                
                    case "T":
                        row1 = 1;
                        break;
                    case "W":
                        row1 = 2;
                        break;                
                    case "F":
                        row1 = 4;
                        break;                        
                    case "S":
                        row1 = 5;
                        break;  
                    default:
                        row1 = 10;
                        console.log("class days not available: " + temp[t][i].days.substr(0,1));
                        break;
                }
            }
            //numerate second class day
            if(temp[t][i].days.substr(1,2) == ("Th"||"TH")){
                row2 = 3;
            }
            else if(temp[t][i].days.substr(1,2) == ("Su"||"SU")){
                row2 = 6
            }
            else{
                switch (temp[t][i].days.substr(1,1)){
                    case "M":
                        row2 = 0;
                        break;                
                    case "T":
                        row2 = 1;
                        break;
                    case "W":
                        row2 = 2;
                        break;                
                    case "F":
                        row2 = 4;
                        break;                        
                    case "S":
                        row2 = 5;
                        break;  
                    default:
                        row2 = row1;
                        console.log("class days not available: " + temp[t][i].days.substr(1,1));
                        break;
                }
            }
            //numerate third class day
            if(temp[t][i].days.substr(2,2) == ("Th"||"TH")){
                row3 = 3;
            }
            else if(temp[t][i].days.substr(2,2) == ("Su"||"SU")){
                row3 = 6
            }
            else{
                switch (temp[t][i].days.substr(2,1)){
                    case "M":
                        row3 = 0;
                        break;                
                    case "T":
                        row3 = 1;
                        break;
                    case "W":
                        row3 = 2;
                        break;                
                    case "F":
                        row3 = 4;
                        break;                        
                    case "S":
                        row3 = 5;
                        break;  
                    default:
                        row3 = row2;
                        console.log("class days not available: " + temp[t][i].days.substr(2,1));
                        break;
                }
            }
            //numerate ampm
            if(temp[t][i].ampm == ('PM')||('pm')){
                //Set to military time and convert to 'blocks'
                startTime = (parseInt(temp[t][i].time.substr(0,2)) + 12 - 7)*4;
                console.log("Parsed to " + startTime);
            }
            else{
                //convert to 'blocks'
                startTime = (parseInt(temp[t][i].time.substr(0,2)) - 7) * 4;
                console.log("Parsed to " + startTime);
            }
            switch(parseInt(temp[t][i].time.substr(2,3))){
                case 0:
                    sTime = 0;
                    break;
                case 15:
                    sTime = 1;
                    break;
                case 30:
                    sTime = 2;
                    break;
                case 45:
                    sTime = 3;
                    break;
                default:
                    console.log("Couldn't find the sTime: " + sTime);
                    break;
            }
            //update startTime
            startTime = startTime + sTime;

            //do same for endTime
            if(temp[t][i].ampm == ('PM')||('pm')){
                //Set to military time and convert to 'blocks'
                endTime = (parseInt(temp[t][i].time.substr(5,3)) + 12 - 7)*4;
                console.log("Parsed to " + endTime);
            }
            else{
                //convert to 'blocks'
                endTime = (parseInt(temp[t][i].time.substr(5,3)) - 7) * 4;
                console.log("Parsed to " + endTime);
            }

            switch(parseInt(temp[t][i].time.substr(2,3))){
                case 0:
                    eTime = 0;
                    break;
                case 15:
                    eTime = 1;
                    break;
                case 30:
                    eTime = 2;
                    break;
                case 45:
                    eTime = 3;
                    break;
                default:
                    console.log("Couldn't find the sTime: " + eTime);
                    break;
            }

            //update endTime
            endTime = endTime + eTime;

            //find length of class
            clength = endTime - startTime;

            //determine if class can fit in schedule
            var tempStartTime = startTime;

            for(var k=0; k < clength; k++){
                if(row1 != 10 && schedule[row1][tempStartTime]!= 0){
                    console.log(temp[t][i].time + " collision, "+ row1 +  " = row1 couldn't fit looking for another section");
                    //Collision on day1
                    terminator = true;
                    break;
                }
                else if(row2 != 10 && schedule[row2][tempStartTime]!= 0){
                    console.log(temp[t][i].time + " collision, "+ row2 +  " = row 2 couldn't fit looking for another section");
                    //Collision on day2
                    terminator = true;
                    break;
                }
                else if(row3 != 10 && schedule[row3][tempStartTime]!= 0){
                    console.log(temp[t][i].time + " collision, "+ row3 +  " = row 3 couldn't fit looking for another section");
                    //Collision on day3
                    terminator = true;
                    break;
                }
                tempStartTime++;
            }

            //if no collisions, class fits!
            if(terminator != true){
                //save times and days in storage
                sessionStorage.setItem("days" + t, row1);
                sessionStorage.setItem("days0"+t, row2);
                sessionStorage.setItem("sTime"+ t,sTime*15);
                sessionStorage.setItem("eTime"+ t,eTime*15);
                sessionStorage.setItem("startTime"+t, (startTime/4 + 7));
                sessionStorage.setItem("endTime"+t, (endTime/4 + 7));
                //save selected class
                selected[t] = temp[t][i];
                //mark all spaces in the schedule 2d array as occupied
                for(var k=0; k < clength; k++){
                    if(row1 != 10){
                        schedule[row1][startTime] = 1;
                    }
                    if(row2 != 10){
                        schedule[row2][startTime] = 1;
                    }
                    if(row3 != 10){
                        schedule[row3][startTime] = 1;
                    }
                    startTime++;
                }
                console.log(temp[t][i].name +" sec:"+ temp[t][i].sec + " fit looking for next course");
                t++;
            }
            //else look for another section to fit
            else{
                console.log(temp[t][i].name +" sec:"+ temp[t][i].sec + " couldn't fit looking for another section");
                i++;
            }
        }
        else{
            console.log("selection: " + t + " couldn't fit in schedule");
            t++;
        }
    }
    var str = JSON.stringify(selected);
    sessionStorage.setItem("selected", str);
}

function getSchedule(){
    return selected[0].name;
}
