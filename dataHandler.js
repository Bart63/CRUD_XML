let json;

function loadDoc(form) {
    let xml_name = form.firstElementChild.value;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            loadJSON(this);
        }
    };
    xhttp.open("GET", xml_name, true);
    xhttp.send();
}

function loadJSON(xml) {
    json = JSON.parse(xml2json(xml.responseXML));
    closeModal();
}

function getXML() {
    return json2xml(json);
}