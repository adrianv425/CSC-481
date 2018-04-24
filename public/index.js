var arrowBtn = document.getElementById("arrowbtn");


function donow(){
    var firebaseRef = firebase.database().ref('BUS');
    window.alert("hi");
    firebaseRef.push("hahahah");
}