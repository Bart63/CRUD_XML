let json;

function loadDoc() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            loadJSON(this);
        }
    };
    xhttp.open("GET", "test.xml", true);
    xhttp.send();
}

function loadJSON(xml) {
    let dom = xml.responseXML;
    console.log(xml.responseText)
    let json_text = xml2json(dom);
    json = JSON.parse(json_text);
    toXML(json);
}

function toXML(json=json) {
    let xml_text = json2xml(json);
    console.log(xml_text);
}