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


function donow(){

    //Get the values inputted by the user and hold them in variables respectively
    var c1Element = document.getElementById('class1').value;
    var c2Element = document.getElementById('class2').value;
    var c3Element = document.getElementById('class3').value;
    var c4Element = document.getElementById('class4').value;
    var c5Element = document.getElementById('class5').value;


    //Test window
    alert("You inputted:\n" + c1Element +"\n" 
                    + c2Element +"\n" 
                    + c3Element +"\n"  
                    + c4Element +"\n"  
                    + c5Element);

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

    allSelections(c1Ref, 1);
    allSelections(c2Ref, 2);
    allSelections(c3Ref, 3);
    allSelections(c4Ref, 4);
    allSelections(c5Ref, 5);

}

function getName1(){
    return name1;
}

function allSelections(ref, num){

    ref.on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            document.getElementById("headc" + num).innerHTML = childData.name || "not found";
            document.getElementById("c" + num).innerHTML = (document.getElementById("c"+num).innerHTML 
                    + "<div class='panel-body' id = '" +childData.sub +childData.course + childData.sec+"'>"
                    +"*elementId for this class = "+childData.sub +childData.course + childData.sec + "<br>" + childData.sub+ childData.course 
                    + " section:" + childData.sec + " @ " + childData.time + " on " + childData.days + "<br>"
                    +"Taught by: " + childData.pFirstName + " " + childData.pLastName + " who is rated x/5.0</div>");

        });
    });
}

