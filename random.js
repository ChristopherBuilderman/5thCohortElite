

window.onload = function () {
    // your code 
    var color = document.getElementById("colorBack");
    
    color.onclick = function () {
        change()
    }
    function change() {
        document.body.style.backgroundColor = "red";
        var thisColor = Math.floor(Math.random() * 2);
        if (thisColor == 0) {
            document.getElementById("colorBack").style.backgroundColor = "lightblue";
        } else {
            document.body.style.backgroundColor = "red";
        }
        console.log("btn works i guss");
    }
};