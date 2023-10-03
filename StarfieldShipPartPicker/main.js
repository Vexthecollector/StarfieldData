function LoadCargo() {
    var thisbutton = document.getElementById("Cargo")
    SetButtonAsActive(thisbutton)
    LoadFileJson("Cargo.json")
}
function LoadEngines() {
    var thisbutton = document.getElementById("Engine")
    SetButtonAsActive(thisbutton)
    LoadFileJson("Engines.json")
}
function LoadFuelTanks() {
    var thisbutton = document.getElementById("FuelTank")
    SetButtonAsActive(thisbutton)
    LoadFileJson("FuelTanks.json")
}
function LoadEquipment() {
    var thisbutton = document.getElementById("Equipment")
    SetButtonAsActive(thisbutton)
    LoadFileJson("Equipment.json")
}
function LoadGravDrives() {
    var thisbutton = document.getElementById("GravDrive")
    SetButtonAsActive(thisbutton)
    LoadFileJson("GravDrives.json")
}
function LoadReactors() {
    var thisbutton = document.getElementById("Reactor")
    SetButtonAsActive(thisbutton)
    LoadFileJson("Reactors.json")
}
function LoadShields() {
    var thisbutton = document.getElementById("Shield")
    SetButtonAsActive(thisbutton)
    LoadFileJson("Shields.json")
}

function SetButtonAsActive(button) {
    var list = document.getElementsByClassName('active')
    for (var i = 0; i < list.length; i++) {
        list[i].classList.add('SelectButton')
        list[i].classList.remove('active')
    }
    button.classList.add('active')
    button.classList.remove('SelectButton')
}

var headers
var starterrows = []
var datarows = []



async function LoadFileJson(FileName){
    starterrows = await (await fetch(FileName)).json()
    headers = Object.keys(starterrows[0])
    FillTableJson()
}

function FillTableJson(){
    var headerRow = document.getElementById("MainTableHeaderRow")
    headerRow.innerHTML = ""
    for (var i = 0; i < headers.length; i++) {
        var heading = document.createElement("td")
        heading.innerHTML = headers[i]
        heading.id = "Header_"+headers[i]
        headerRow.appendChild(heading)
        heading.addEventListener('click', function (e) { SortJson(e) })
    }

    SetLimitJson()
}


async function CleanElements() {
    Array.from(document.querySelectorAll('.sortedA')).forEach(
        (el) => el.classList.remove('sortedA')
    );
    Array.from(document.querySelectorAll('.sortedD')).forEach(
        (el) => el.classList.remove('sortedD')
    );
    return;
}

async function SortJson(input){
    datarows = Array.from(await LimitLevelsJson(starterrows))
    let sortname=input.target.id.split("_")[1]
    let number = datarows[0][sortname]
    if (input.target.classList.contains("sortedA")) {
        if (!isNaN(number)) {
            datarows.sort(function (a, b) {
                return b[sortname] - a[sortname]
            })
        }
        else {
            datarows.sort(function (a, b) { return a[sortname] > b[sortname] ? 1 : -1; })
        }
        await CleanElements()
        input.target.classList.add("sortedD")

    }
    else if (input.target.classList.contains("sortedD")) {
        await CleanElements()


    }
    else {
        if (!isNaN(number)) {
            datarows.sort(function (a, b) {
                return a[sortname] - b[sortname]
            })
        }
        else {
            datarows.sort(function (a, b) { return a[sortname] > b[sortname] ? 1 : -1; })
            datarows.reverse()
        }
        await CleanElements()
        input.target.classList.add("sortedA")
    }

    FillRowsJson()
}

function FillRowsJson() {
    //datarows = Array.from(LimitLevels(starterrows))
    var table = document.getElementById("MainTable")
    for (var i = 1; i < table.rows.length; i) {
        table.deleteRow(1);
    }
    for (var i = 0; i < datarows.length; i++) {
        var datarow = document.createElement("tr")
        for (dataname of headers) {
            var cell = document.createElement("td")
            cell.innerHTML = datarows[i][dataname]
            datarow.appendChild(cell)
        }
        let t=i
        datarow.addEventListener("click", function() {SelectPart(t)})
        table.appendChild(datarow)
    }
}

function SelectPart(i){
    let curComponent = document.getElementsByClassName("active")[0].id
    let part = datarows[i]
    let selection= document.getElementById(curComponent+"Row")
    selection.children[0].innerHTML = JSON.stringify(part)
    selection.children[2].innerHTML = part["Name"]
    selection.children[3].innerHTML = part["Value"]
    selection.children[4].innerHTML = part["Location"]
    
}

function CalcData(){
    try{
        CalcShields()
    }  catch (error) {
        console.error(error);
    }
    CalcCredits()
    CalcMass()
    CalcMobility()
}

function CalcShields(){
    let shieldData=document.getElementById("ShieldRow")
    let shield=JSON.parse( shieldData.children[0].innerHTML)
    document.getElementById("ShieldData").innerHTML=shield["Shield Max Health"]
}

function CalcMobility(){
    let mass=document.getElementById("MassData").innerHTML
    let mthrust=0
    let PartPickedTable= document.getElementById("PartPickedTable")
    for(let i=1;i<PartPickedTable.children[0].children.length;i++){
        let rawJson=PartPickedTable.children[0].children[i].children[0].innerHTML
        if(rawJson !=""){
            let jsonData=JSON.parse(rawJson)
            if(jsonData["Maneuvering Thrust"])
                mthrust+=jsonData["Maneuvering Thrust"]
        }
    }

    let mobility= Math.round(11.9*(mthrust / mass)-47.6)
    if(mobility>100){
        mobility=100
    }
    else if (mobility<0){
        mobility=0
    }
    else if (mobility=="NaN"){
        mobility=0
    }
    document.getElementById("MobilityData").innerHTML=mobility
}

function CalcCredits(){
    let creditcost=0
    let PartPickedTable= document.getElementById("PartPickedTable")
    for(let i=1;i<PartPickedTable.children[0].children.length;i++){
        let rawJson=PartPickedTable.children[0].children[i].children[0].innerHTML
        if(rawJson !=""){
            let jsonData=JSON.parse(rawJson)
            creditcost+=jsonData["Value"]
        }
    }
    document.getElementById("creditcost").value=creditcost
}

function CalcMass(){
    let mass=0
    let PartPickedTable= document.getElementById("PartPickedTable")
    for(let i=1;i<PartPickedTable.children[0].children.length;i++){
        let rawJson=PartPickedTable.children[0].children[i].children[0].innerHTML
        if(rawJson !=""){
            let jsonData=JSON.parse(rawJson)
            mass+=jsonData["Mass"]
        }
    }
    document.getElementById("MassData").innerHTML=mass
}


async function SetLimitJson(){
    datarows = Array.from( await LimitLevelsJson(starterrows))
    FillRowsJson()
}

async function LimitLevelsJson(inputarray) {
    start=Number(document.getElementById("min").value)
    end=Number(document.getElementById("max").value)
    var levels = headers.indexOf('Level')
    if(levels>=0){
        return inputarray.filter(i => i["Level"] <= end && i["Level"] >= start)
    }
    return inputarray
}
/*
async function LoadFile(FileName) {
    starterrows = []
    regexp = /(?!\B"[^"]*),(?![^"]*"\B)/g
    await fetch(FileName)
        .then((res) => res.text())
        .then((text) => {
            var rows = text.split("\n")
            headers = rows[0].split(",")
            for (var i = 1; i < rows.length; i++) {
                starterrows[i - 1] = rows[i].split(regexp)
            }
        })
        .catch((e) => console.error(e));
    datarows = Array.from(starterrows)
    FillTable()
}


function FillTable() {
    var table = document.getElementById("MainTable")
    var headerRow = document.getElementById("MainTableHeaderRow")
    headerRow.innerHTML = ""


    for (var i = 0; i < headers.length; i++) {
        var heading = document.createElement("td")
        heading.innerHTML = headers[i]
        heading.id = i
        headerRow.appendChild(heading)
        heading.addEventListener('click', function (e) { Sort(e) })
    }
    SetLimit()

}


async function Sort(input) {
    datarows = Array.from(await LimitLevels(starterrows))
    var number = datarows[0][input.target.id]
    if (input.target.classList.contains("sortedA")) {
        if (!isNaN(number)) {
            datarows.sort(function (a, b) {
                return b[input.target.id] - a[input.target.id]
            })
        }
        else {
            datarows.sort(function (a, b) { return a[input.target.id] > b[input.target.id] ? 1 : -1; })
        }
        await CleanElements()
        input.target.classList.add("sortedD")

    }
    else if (input.target.classList.contains("sortedD")) {
        await CleanElements()


    }
    else {
        if (!isNaN(number)) {
            datarows.sort(function (a, b) {
                return a[input.target.id] - b[input.target.id]
            })
        }
        else {
            datarows.sort(function (a, b) { return a[input.target.id] > b[input.target.id] ? 1 : -1; })
            datarows.reverse()
        }
        await CleanElements()
        input.target.classList.add("sortedA")
    }


    FillRows()


}


function FillRows() {
    //datarows = Array.from(LimitLevels(starterrows))
    var table = document.getElementById("MainTable")
    for (var i = 1; i < table.rows.length; i) {
        table.deleteRow(1);
    }
    for (var i = 0; i < datarows.length; i++) {
        var datarow = document.createElement("tr")
        for (var j = 0; j < datarows[i].length; j++) {
            var cell = document.createElement("td")
            cell.innerHTML = datarows[i][j]
            datarow.appendChild(cell)
        }
        let t=i
        datarow.addEventListener("click", function() {SelectPart(t)})
        table.appendChild(datarow)
    }
}



async function SetLimit(){
    datarows = Array.from( await LimitLevels(starterrows))
    FillRows()
}

async function LimitLevels(inputarray) {
    start=Number(document.getElementById("min").value)
    end=Number(document.getElementById("max").value)
    var levels = headers.indexOf('Level')
    if(levels>=0){
        return inputarray.filter(i => i[levels] <= end && i[levels] >= start)
    }
    return inputarray
}*/