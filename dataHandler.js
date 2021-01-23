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

function addRow(target) {
    let tr = target.parentElement.parentElement;
    let tableName = tr.parentElement.parentElement.id
    let deleteEl = tableName.substring(0, tableName.indexOf("-"));
    
    let jsonType = json["grocery"]["additionalData"]["typesList"];
    let jsonManufacturer = json["grocery"]["additionalData"]["manufacturerList"];
    let jsonItems = json["grocery"]["items"];
    
    let elements = Object.keys(jsonType);
    elements.push(Object.keys(jsonManufacturer).toString());
    elements.push(Object.keys(jsonItems).toString());
    
    let value;
    
    switch (elements.indexOf(deleteEl)) {
        case 0:
            value = elements[0]+(jsonType[elements[0]].length+1);
            json["grocery"]["additionalData"]["typesList"]["types"].push({
                "@id" : value,
                "#text" : value
            });
            loadTypesTable();
            break;
        case 1:
            value = elements[1]+(jsonManufacturer[elements[1]].length+1);
            json["grocery"]["additionalData"]["manufacturerList"]["manufacturerEl"].push({
                "@id" : value,
                "name" : "",
                "email" : "",
                "telephone" : "",
                "address" : {
                    "city" : "",
                    "postCode" : "",
                    "street" : ""
                }
            });
            loadManufacturerTable();
            break;
        case 2:
            value = "I"+(jsonItems[elements[2]].length+1);
            json["grocery"]["items"]["item"].push({
                "@id" : value,
                "name" : "",
                "description" : "",
                "country" : "",
                "type" : {
                    "@id" : ""
                },
                "manufacturer" : {
                    "@id" : ""
                },
                "price" : {
                    "@unit" : "",
                    "#text" : ""
                },
                "weight" : {
                    "@unit" : "",
                    "#text" : ""
                },
                "quantity" : {
                    "@unit" : "",
                    "#text" : ""
                }
            }); 
    }
    loadItemsTable();
}

function loadTypesTable() {
    let tableEl = document.getElementById("types-grocery");
    let tableContent = "<tr><th>ID</th><th>Nazwa</th></tr>";
    
    let types = json["grocery"]["additionalData"]["typesList"]["types"];
    
    for(let i=0; i<types["length"]; i++) {
        tableContent += "<tr name="+i+"><td>"
            +"<input value='"+types[i]["@id"]+"'/>"
            +"</td><td>"
            +"<input value='"+types[i]["#text"]+"'/>"
            +"</td><td>"
            +"<input type='button' onclick='deleteRow(this)' value='X' />"
            +"</td><td>"
            +"<input type='button' onclick='deleteRow(this)' value='Zapisz' />"
            +"</td></tr>";
    }
    tableContent += "<tr><td><input type='button' onclick='addRow(this)' value='Dodaj' /></td></tr>"
    
    tableEl.innerHTML = tableContent;
}

function loadManufacturerTable() {
    let tableEl = document.getElementById("manufacturerEl-grocery");
    let tableContent = "<tr><th>ID</th><th>Nazwa</th><th>Email</th><th>Telefon</th><th>Miasto</th><th>Kod pocztowy</th><th>Ulica</th></tr>";
    
    let manufacturers = json["grocery"]["additionalData"]["manufacturerList"]["manufacturerEl"];
    
    for(let i=0; i<manufacturers["length"]; i++) {
        tableContent += "<tr name="+i+"><td>"
            +"<input value='"+manufacturers[i]["@id"]+"'/>"
            +"</td><td>"
            +"<input value='"+manufacturers[i]["name"]+"'/>"
            +"</td><td>"
            +"<input value='"+manufacturers[i]["email"]+"'/>"
            +"</td><td>"
            +"<input value='"+manufacturers[i]["telephone"]+"'/>"
            +"</td><td>"
            +"<input value='"+manufacturers[i]["address"]["city"]+"'/>"
            +"</td><td>"
            +"<input value='"+manufacturers[i]["address"]["postCode"]+"'/>"
            +"</td><td>"
            +"<input value='"+manufacturers[i]["address"]["street"]+"'/>"
            +"</td><td>"
            +"<input type='button' onclick='deleteRow(this)' value='X' />"
            +"</td><td>"
            +"<input type='button' onclick='deleteRow(this)' value='Zapisz' />"
            +"</td></tr>";
    }
    tableContent += "<tr><td><input type='button' onclick='addRow(this)' value='Dodaj' /></td></tr>"
    
    tableEl.innerHTML = tableContent;
}

function deleteRow(target){
    let tr = target.parentElement.parentElement;
    let index = tr.rowIndex-1;
    let tableName = tr.parentElement.parentElement.id
    let deleteEl = tableName.substring(0, tableName.indexOf("-"));
    
    let elements = Object.keys(json["grocery"]["additionalData"]["typesList"]);
    elements.push(Object.keys(json["grocery"]["additionalData"]["manufacturerList"]).toString());
    elements.push(Object.keys(json["grocery"]["items"]).toString());
    
    switch (elements.indexOf(deleteEl)) {
        case 0:
            json["grocery"]["additionalData"]["typesList"]["types"].splice(index,1);
            loadTypesTable();
            break;
        case 1:
            json["grocery"]["additionalData"]["manufacturerList"]["manufacturerEl"].splice(index,1);
            loadManufacturerTable();
            break;
        case 2:
            json["grocery"]["items"]["item"].splice(index,1);
    }
    loadItemsTable();
}

let globalKurwa;

function loadItemsTable() {
    let tableEl = document.getElementById("item-grocery");
    let tableContent = "<tr><th>ID</th><th>Nazwa</th><th>Cena</th><th>Jednostka</th><th>Opis</th><th>Producent</th><th>Kraj</th><th>Waga</th>"+
        "<th>Jednostka</th><th>Ilość</th><th>Jednostka</th><th>Typ</th></tr>";
    
    let items = json["grocery"]["items"]["item"];

    let additionalData = json["grocery"]["additionalData"];
    
    let allTypes = additionalData["typesList"]["types"];
    let allManufacturers = additionalData["manufacturerList"]["manufacturerEl"];
    
    let allIDTypes = allTypes.map(item => item["@id"]);
    let allIDManufacturers = allManufacturers.map(item => item["@id"]);
    
    let allNameTypes = allTypes.map(item => item["#text"]);
    let allNameManufacturers = allManufacturers.map(item => item["name"]);
    
    let typesSelect = document.createElement("select");
    let manufacturersSelect = document.createElement("select");

    
    allIDTypes.forEach((opt, ind) => {
        let optEl = document.createElement("option");
        optEl.text = allNameTypes[ind];
        optEl.value = opt;
        typesSelect.add(optEl);
    })
    
    allIDManufacturers.forEach((opt, ind) => {
        let optEl = document.createElement("option");
        optEl.text = allNameManufacturers[ind];
        optEl.value = opt;
        manufacturersSelect.add(optEl);
    })
    
    let typeIndexArray = [];
    let manufacturersIndexArray = [];
    
    for(let i=0; i<items["length"]; i++) {
        let typeID = items[i]["type"]["@id"];
        let manufacturerID = items[i]["manufacturer"]["@id"];

        let typeIndex = allIDTypes.findIndex(item => item.localeCompare(typeID)==0)
        let manufacturerIndex = allIDManufacturers.findIndex(item => item.localeCompare(manufacturerID)==0)

        let typeSelectEdit = "<select name='selectType'"+typesSelect.outerHTML.substr(7);
        let manufacturersSelectEdit = "<select name='selectManufacturer'"+manufacturersSelect.outerHTML.substr(7);
        
        typeIndexArray.push(typeIndex);
        manufacturersIndexArray.push(manufacturerIndex);
        
        tableContent += "<tr name="+i+"><td>"
            +"<input value='"+items[i]["@id"]+"'/>"
            +"</td><td>"
            +"<input value='"+items[i]["name"]+"'/>"
            +"</td><td>"
            +"<input value='"+items[i]["price"]["#text"]+"'/>"
            +"</td><td>"
            +"<input value='"+items[i]["price"]["@unit"]+"'/>"
            +"</td><td>"
            +"<input value='"+items[i]["description"].trim()+"'/>"
            +"</td><td>"
            +manufacturersSelectEdit
            +"</td><td>"
            +"<input value='"+items[i]["country"]+"'/>"
            +"</td><td>"
            +"<input value='"+items[i]["weight"]["#text"]+"'/>"
            +"</td><td>"
            +"<input value='"+items[i]["weight"]["@unit"]+"'/>"
            +"</td><td>"
            +"<input value='"+items[i]["quantity"]["#text"]+"'/>"
            +"</td><td>"
            +"<input value='"+items[i]["quantity"]["@unit"]+"'/>"
            +"</td><td>"
            +typeSelectEdit
            +"</td><td>"
            +"<input type='button' onclick='deleteRow(this)' value='X' />"
            +"</td><td>"
            +"<input type='button' onclick='deleteRow(this)' value='Zapisz' />"
            +"</td></tr>";
    }
    tableContent += "<tr><td><input type='button' onclick='addRow(this)' value='Dodaj' /></td></tr>"
    
    tableEl.innerHTML = tableContent;
    
    document.getElementsByName("selectType").forEach((item, ind) => {
        item.selectedIndex = typeIndexArray[ind];
    });
    
    document.getElementsByName("selectManufacturer").forEach((item, ind) => {
        item.selectedIndex = manufacturersIndexArray[ind];
    });
}