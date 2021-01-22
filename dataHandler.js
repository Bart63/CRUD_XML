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
    loadTypesTable();
    loadManufacturerTable();
    loadItemsTable()
}

function getXML() {
    return json2xml(json);
}

function loadTypesTable() {
    let tableEl = document.getElementById("types-grocery");
    let tableContent = "<tr><th>ID</th><th>Nazwa</th></tr>";
    
    let types = json["grocery"]["additionalData"]["typesList"]["types"];
    
    for(let i=0; i<types["length"]; i++) {
        tableContent += "<tr><td>"+types[i]["@id"]+"</td><td>"+types[i]["#text"]+"</td></tr>";
    }
    
    tableEl.innerHTML += tableContent;
}

function loadManufacturerTable() {
    let tableEl = document.getElementById("types-grocery");
    let tableContent = "<tr><th>ID</th><th>Nazwa</th></tr>";
    
    let types = json["grocery"]["additionalData"]["typesList"]["types"];
    
    for(let i=0; i<types["length"]; i++) {
        tableContent += "<tr><td>"+types[i]["@id"]+"</td><td>"+types[i]["#text"]+"</td></tr>";
    }
    
    tableEl.innerHTML += tableContent;
}

function loadManufacturerTable() {
    let tableEl = document.getElementById("manufacturers-grocery");
    let tableContent = "<tr><th>ID</th><th>Nazwa</th><th>Email</th><th>Telefon</th><th>Miasto</th><th>Kod pocztowy</th><th>Ulica</th></tr>";
    
    let manufacturers = json["grocery"]["additionalData"]["manufacturerList"]["manufacturerEl"];
    
    for(let i=0; i<manufacturers["length"]; i++) {
        tableContent += "<tr><td>"+manufacturers[i]["@id"]+"</td><td>"+manufacturers[i]["name"]+"</td>"+
            "<td>"+manufacturers[i]["email"]+"</td><td>"+manufacturers[i]["telephone"]+"</td>"+
            "<td>"+manufacturers[i]["address"]["city"]+"</td><td>"+manufacturers[i]["address"]["postCode"]+"</td>"+
            "<td>"+manufacturers[i]["address"]["street"]+"</td></tr>";
    }
    
    tableEl.innerHTML += tableContent;
}

function loadItemsTable() {
    let tableEl = document.getElementById("items-grocery");
    let tableContent = "<tr><th>ID</th><th>Nazwa</th><th>Cena</th><th>Jednostka</th><th>Opis</th><th>Producent</th><th>Kraj</th><th>Waga</th>"+
        "<th>Jednostka</th><th>Ilość</th><th>Jednostka</th><th>Typ</th></tr>";
    
    let items = json["grocery"]["items"]["item"];
    
    for(let i=0; i<items["length"]; i++) {
        tableContent += "<tr><td>"+items[i]["@id"]+"</td><td>"+items[i]["name"]+"</td>"+
            "<td>"+items[i]["price"]["#text"]+"</td><td>"+items[i]["price"]["@unit"]+"</td>"+
            "<td>"+items[i]["description"]+"</td><td>"+items[i]["manufacturer"]["@id"]+"</td>"+
            "<td>"+items[i]["country"]+"</td><td>"+items[i]["weight"]["#text"]+"</td>"+
            "<td>"+items[i]["weight"]["@unit"]+"</td><td>"+items[i]["quantity"]["#text"]+"</td>"+
            "<td>"+items[i]["quantity"]["@unit"]+"</td><td>"+items[i]["type"]["@id"]+"</td></tr>";
    }
    
    tableEl.innerHTML += tableContent;
}