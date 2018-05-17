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

var subs = [];
var s1 = [], s2 = [], s3 =[], s4 = [], s5 = [];

function donow(){
    //Get the values inputted by the user and hold them in variables respectively
    var name1 = sessionStorage.getItem("nam1");
    var name2 = sessionStorage.getItem("nam2");
    var name3 = sessionStorage.getItem("nam3");
    var name4 = sessionStorage.getItem("nam4");
    var name5 = sessionStorage.getItem("nam5");
    var num1 = sessionStorage.getItem("cou1");
    var num2 = sessionStorage.getItem("cou2");
    var num3 = sessionStorage.getItem("cou3");
    var num4 = sessionStorage.getItem("cou4");
    var num5 = sessionStorage.getItem("cou5");

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

    document.getElementById("contact").innerHTML = '<div class="row mt-sm-6 mt-md-0"><div class="container"><h1 class = "mb-5">All available classes</h1><div class="panel-group"><div class="panel panel-danger"><div class="panel-heading" id = "headc1">Class 1 options</div><div class="panel-body" id = "c1"></div></div><div class="panel panel-primary"><div class="panel-heading" id = "headc2">Class 2 options</div><div class="panel-body" id = "c2"></div></div><div class="panel panel-success"><div class="panel-heading" id = "headc3">Class 3 options</div><div class="panel-body" id = "c3"></div></div><div class="panel panel-info"><div class="panel-heading" id = "headc4">Class 4 options</div><div class="panel-body" id = "c4"></div></div><div class="panel panel-warning"><div class="panel-heading" id = "headc5">Class 5 options</div><div class="panel-body" id = "c5"></div></div><button class="btn btn-outline btn-xl js-scroll-trigger" onclick = "scheduler()">Build Auto Schedule!</button></div></div></div></div></div>'

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

function getSubs(){
    sessionStorage.clear();
    var firebaseD = firebase.database();
    var ref = firebaseD.ref("/");
    ref.once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();;
            subs[subs.length] = childSnapshot.key;
            console.log(subs[subs.length-1]);
        });
    });
}

function getCourses(sub, num){
    var s = [];
    var firebaseD = firebase.database().ref("/"+sub);
    firebaseD.once('value',function(snapshot){
        snapshot.forEach(function(childSnapshot){
            switch(num){
                case 1:
                    s1[s1.length] = childSnapshot.key;
                    s = s1;
                    break;
                case 2:
                    s2[s2.length] = childSnapshot.key;
                    s = s2;
                    break;
                case 3:
                    s3[s3.length] = childSnapshot.key;
                    s = s3;
                    break;
                case 4:
                    s4[s4.length] = childSnapshot.key;
                    s = s4;
                    break;
                case 5:
                    s5[s5.length] = childSnapshot.key;
                    s = s5;
                    break;
                default:
                    s = null;
                    console.log("couldn't find class num");
                    break;
            }
        });
    });
    setTimeout(function(){
        change2(sub, num, s);
    },1000);
}

function getRatings(){
    var cRef = [];
    var cRat = [];
    var firebaseD = firebase.database();
    
    if(selected[0] != null){
        cRef[0] = firebaseD.ref("/profs/"+selected[0].pLastName);
        console.log("i = " + 0);
        cRef[0].once('value').then(function(snapshot) {
            if(snapshot.val() != null){
                var childData = snapshot.val().rating || 'N/A';
                sessionStorage.setItem("rating" + 0, childData);
                console.log(0);
            }
            else
            {
                sessionStorage.setItem("rating" + 0, 'N/A');
                console.log('2 ' + 0);
            }
        });
    }
    if(selected[1] != null){
        cRef[1] = firebaseD.ref("/profs/"+selected[1].pLastName);
        console.log("i = " + 1);
        cRef[1].once('value').then(function(snapshot) {
            if(snapshot.val() != null){
                var childData = snapshot.val().rating || 'N/A';
                sessionStorage.setItem("rating" + 1, childData);
                console.log(1);
            }
            else
            {
                sessionStorage.setItem("rating" + 1, 'N/A');
                console.log('2 ' + 1);
            }
        });
    }
    if(selected[2] != null){
        cRef[2] = firebaseD.ref("/profs/"+selected[2].pLastName);
        console.log("i = " + 2);
        cRef[2].once('value').then(function(snapshot) {
            if(snapshot.val() != null){
                var childData = snapshot.val().rating || 'N/A';
                sessionStorage.setItem("rating" + 2, childData);
                console.log(2);
            }
            else
            {
                sessionStorage.setItem("rating" + 2, 'N/A');
                console.log('2 ' + 2);
            }
        });
    }
    if(selected[3] != null){
        cRef[3] = firebaseD.ref("/profs/"+selected[3].pLastName);
        console.log("i = " + 3);
        cRef[3].once('value').then(function(snapshot) {
            if(snapshot.val() != null){
                var childData = snapshot.val().rating || 'N/A';
                sessionStorage.setItem("rating" + 3, childData);
                console.log(3);
            }
            else
            {
                sessionStorage.setItem("rating" + 3, 'N/A');
                console.log('2 ' + 3);
            }
        });
    }
    if(selected[4] != null){
        cRef[4] = firebaseD.ref("/profs/"+selected[4].pLastName);
        console.log("i = " + 4);
        cRef[4].once('value').then(function(snapshot) {
            if(snapshot.val() != null){
                var childData = snapshot.val().rating || 'N/A';
                sessionStorage.setItem("rating" + 4, childData);
                console.log(4);
            }
            else
            {
                sessionStorage.setItem("rating" + 4, 'N/A');
                console.log('2 ' + 4);
            }
        });
    }
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
    getRatings();
    document.getElementById("contact").innerHTML = document.getElementById("contact").innerHTML + '<button><a href="fullcalendar.html" class="btn btn-outline btn-xl js-scroll-trigger" onclick = "">See your schedule</a></button>'
}

function change(){
    document.getElementById("download").innerHTML = '<div class="container"><div class="row"><div class="col-md-8 mx-auto"><h2 class="section-heading">Add Classes</h2><div class="col mt-sm-6 mt-md-0"><div class="btn-group" id= "cb1"></div><div class="btn-group" id= "cb2"></div><div class="btn-group" id= "cb3"></div><div class="btn-group" id= "cb4"></div><div class="btn-group" id= "cb5"></div></div><button href="#contact" class="btn btn-outline btn-xl js-scroll-trigger" onclick = "donow()">Start!</button></div></div></div>';
    for(var j =1; j < 6; j++){
        document.getElementById("cb"+j).innerHTML = '<button type="button" class="btn btn-primary">Class Subject '+j+'</button><button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button><ul class="dropdown-menu scrollable-menu" role="menu" id = "ul'+j+'"></ul>';
        for(var i =0; i < subs.length; i++){
            console.log(i);
            document.getElementById("ul"+j).innerHTML =  document.getElementById("ul"+j).innerHTML + '<li><a onclick="getCourses(\'' + subs[i] + '\','+j+')">' + subs[i] + '</a></li>';
        };
    }
}

function change2(str,num,s){
    console.log(s.length);
    document.getElementById("cb"+num).innerHTML = '<button type="button" class="btn btn-primary">'+str+'</button><div class="btn-group"><button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">Course #<span class="caret"></span></button><ul class="dropdown-menu scrollable-menu" role="menu" id = "ull'+num+'"></ul>';
    for(var i =0; i < s.length; i++){
        console.log(i);
        document.getElementById("ull"+num).innerHTML =  document.getElementById("ull"+num).innerHTML + '<li><a onclick="change3(\''+ str+ '\',\'' + s[i] + '\', ' +num+','+s+')">' + s[i] + '</a></li>';
    }
}

function change3(str, sub, num, s){
    sessionStorage.setItem("nam"+num, str);
    sessionStorage.setItem("cou"+num, sub);
    document.getElementById("cb"+num).innerHTML = '<button type="button" class="btn btn-primary">'+str+'</button><div class="btn-group"><button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">'+ sub +'<span class="caret"></span></button><ul class="dropdown-menu scrollable-menu" role="menu" id = "ulll'+num+'"></ul>';
    for(var i =0; i < s.length; i++){
        console.log(i);
        document.getElementById("cb"+num).innerHTML =  document.getElementById("cb"+num).innerHTML + '<li><a onclick="change3(\''+ str+ '\',\'' + s[i] + '\', ' +num+',' + s +')">' + s[i] + '</a></li>';
    }
}

function getSchedule(){
    return selected[0].name;
}