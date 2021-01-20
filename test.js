function loadDoc() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            loadTest(this);
        }
    };
    xhttp.open("GET", "test.xml", true);
    xhttp.send();
}

function loadTest(xml) {
    var i;
    var xmlDoc = xml.responseXML;
    var table="";
    var x = xmlDoc.getElementsByTagName("test");
    console.log(x);
    for (i = 0; i <x.length; i++) {
        table += x[i].textContent + '\n';
    }
    document.getElementById("tests").innerHTML = table;
}