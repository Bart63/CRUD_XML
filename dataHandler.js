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

function saveRow(target){
    let tr = target.parentElement.parentElement;
    let index = tr.rowIndex-1;
    let tableName = tr.parentElement.parentElement.id
    let deleteEl = tableName.substring(0, tableName.indexOf("-"));
    
    let elements = Object.keys(json["grocery"]["additionalData"]["typesList"]);
    elements.push(Object.keys(json["grocery"]["additionalData"]["manufacturerList"]).toString());
    elements.push(Object.keys(json["grocery"]["items"]).toString());
    
    let data;
    
    switch (elements.indexOf(deleteEl)) {
        case 0:
            for(let i=0; i<2; i++)  {
                if(!tr.children[i].firstChild.checkValidity()){
                    alert("Dane nie waliduą się: '" + tr.children[i].firstChild.value+"'");
                    break;
                }
            }
            
            json["grocery"]["additionalData"]["typesList"]["types"][index]["@id"] = tr.children[0].firstChild.value;
            json["grocery"]["additionalData"]["typesList"]["types"][index]["#text"] = tr.children[1].firstChild.value;
            
            loadTypesTable();
            break;
        case 1:
            for(let i=0; i<7; i++)  {
                if(!tr.children[i].firstChild.checkValidity()){
                    alert("Dane nie waliduą się: '" + tr.children[i].firstChild.value+"'");
                    break;
                }
            }
            
            json["grocery"]["additionalData"]["manufacturerList"]["manufacturerEl"][index]["@id"] = tr.children[0].firstChild.value;
            json["grocery"]["additionalData"]["manufacturerList"]["manufacturerEl"][index]["name"] = tr.children[1].firstChild.value;
            json["grocery"]["additionalData"]["manufacturerList"]["manufacturerEl"][index]["email"] = tr.children[2].firstChild.value;
            json["grocery"]["additionalData"]["manufacturerList"]["manufacturerEl"][index]["telephone"] = tr.children[3].firstChild.value;
            json["grocery"]["additionalData"]["manufacturerList"]["manufacturerEl"][index]["address"]["city"] = tr.children[4].firstChild.value;
            json["grocery"]["additionalData"]["manufacturerList"]["manufacturerEl"][index]["address"]["postcode"] = tr.children[5].firstChild.value;
            json["grocery"]["additionalData"]["manufacturerList"]["manufacturerEl"][index]["address"]["street"] = tr.children[6].firstChild.value;
            
            loadManufacturerTable();
            break;
        case 2:
            for(let i=0; i<11; i++)  {
                if(i!=5 && !tr.children[i].firstChild.checkValidity()){
                    alert("Dane nie waliduą się: '" + tr.children[i].firstChild.value+"'");
                    break;
                }
            }
            
            json["grocery"]["items"]["item"][index]["@id"] = tr.children[0].firstChild.value;
            json["grocery"]["items"]["item"][index]["name"] = tr.children[1].firstChild.value;
            json["grocery"]["items"]["item"][index]["price"]["#text"] = tr.children[2].firstChild.value;
            json["grocery"]["items"]["item"][index]["price"]["@unit"] = tr.children[3].firstChild.value;
            json["grocery"]["items"]["item"][index]["description"] = tr.children[4].firstChild.value;
            json["grocery"]["items"]["item"][index]["country"] = tr.children[6].firstChild.value;
            json["grocery"]["items"]["item"][index]["weight"]["#text"] = tr.children[7].firstChild.value;
            json["grocery"]["items"]["item"][index]["weight"]["@unit"] = tr.children[8].firstChild.value;
            json["grocery"]["items"]["item"][index]["quantity"]["#text"] = tr.children[9].firstChild.value;
            json["grocery"]["items"]["item"][index]["quantity"]["@unit"] = tr.children[10].firstChild.value;
            
    }
    loadItemsTable();
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
        tableContent += "<tr><td>"
            +"<input value='"+types[i]["@id"]+"' pattern='[a-zA-Z0-9]+'/>"
            +"</td><td>"
            +"<input value='"+types[i]["#text"]+"' pattern='[a-zA-Z0-9]+'/>"
            +"</td><td>"
            +"<input type='button' onclick='deleteRow(this)' value='X' />"
            +"</td><td>"
            +"<input type='button' onclick='saveRow(this)' value='Zapisz' />"
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
        tableContent += "<tr><td>"
            +"<input value='"+manufacturers[i]["@id"]+"' pattern='[a-zA-Z0-9]+'/>"
            +"</td><td>"
            +"<input value='"+manufacturers[i]["name"]+"' pattern='[^#%&*:+$@!()_<>?-]*'/>"
            +"</td><td>"
            +"<input value='"+manufacturers[i]["email"]+"' pattern='[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'/>"
            +"</td><td>"
            +"<input value='"+manufacturers[i]["telephone"]+"' pattern='[1-9][0-9]{8}'/>"
            +"</td><td>"
            +"<input value='"+manufacturers[i]["address"]["city"]+"' pattern='[^#%&*:+$@!()_<>?-]*'/>"
            +"</td><td>"
            +"<input value='"+manufacturers[i]["address"]["postCode"]+"' pattern='[0-9]{2}-[0-9]{3}'/>"
            +"</td><td>"
            +"<input value='"+manufacturers[i]["address"]["street"]+"' pattern='[^#%&*:+$@!()_<>?-]*'/>"
            +"</td><td>"
            +"<input type='button' onclick='deleteRow(this)' value='X' />"
            +"</td><td>"
            +"<input type='button' onclick='saveRow(this)' value='Zapisz' />"
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
        
        tableContent += "<tr><td>"
            +"<input value='"+items[i]["@id"]+"' pattern='[a-zA-Z0-9]+'/>"
            +"</td><td>"
            +"<input value='"+items[i]["name"]+"' pattern='[^#%&*:+$@!_<>?]*'/>"
            +"</td><td>"
            +"<input value='"+items[i]["price"]["#text"]+"' pattern='[0-9]+(\.[0-9][0-9])?'/>"
            +"</td><td>"
            +"<input value='"+items[i]["price"]["@unit"]+"' pattern='[a-zA-Z/]*'/>"
            +"</td><td>"
            +"<input value='"+items[i]["description"].trim()+"' pattern='[^#&*+$@_<>?]*'/>"
            +"</td><td>"
            +manufacturersSelectEdit
            +"</td><td>"
            +"<input value='"+items[i]["country"]+"' pattern='[^#%&*:+$@!()_<>?-]*'/>"
            +"</td><td>"
            +"<input value='"+items[i]["weight"]["#text"]+"' pattern='[0-9]+(\.[0-9]{1,2,3})?'/>"
            +"</td><td>"
            +"<input value='"+items[i]["weight"]["@unit"]+"' pattern='[a-zA-Z/]*'/>"
            +"</td><td>"
            +"<input value='"+items[i]["quantity"]["#text"]+"' pattern='[1-9]?[0-9]*'/>"
            +"</td><td>"
            +"<input value='"+items[i]["quantity"]["@unit"]+"' pattern='[a-zA-Z/]*'/>"
            +"</td><td>"
            +typeSelectEdit
            +"</td><td>"
            +"<input type='button' onclick='deleteRow(this)' value='X' />"
            +"</td><td>"
            +"<input type='button' onclick='saveRow(this)' value='Zapisz' />"
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