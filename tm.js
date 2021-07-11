var state = 0;
var input = document.getElementById('input');
var status = document.getElementById('statusText');
var exp = [];
var tempexp = [];
var goodletter = ["B","T","P","S","X","V","E"]
var templetter = '';
var stepCounter = 0;
var running = 0;
var auto = 0;
var finished = 0;
var speed = 1000;


function generateRight(){
    tempexp = [];
    input.value = "";
    input.dispatchEvent(new Event('input'));
    tempexp.push("B"); // 1
    if(Math.floor(Math.random() * 11)> 5){ //2
        tempexp.push("T");
        templetter = "T";
    }
    else{
        tempexp.push("P");
        templetter = "P";
    }
    tempexp.push("B"); // 8
    //unterer Pfad
    if(Math.floor(Math.random() * 11)> 5){
        tempexp.push("P"); //9
        while(Math.floor(Math.random() * 11)> 4){
            tempexp.push("T"); // 9
        }
        tempexp.push("V"); // 10
        tempexp.push("V");// 11
    }
    //oberer Pfad
    else{
        tempexp.push("T");// 12
        while(Math.floor(Math.random() * 11)> 4){
            tempexp.push("S"); // 12
        }
        tempexp.push("X"); //13
        //oben bleiben
        if(Math.floor(Math.random() * 11)> 5){
            tempexp.push("S"); //11
        }
        //runter wechseln
        else{
            tempexp.push("X"); //9
            while(Math.floor(Math.random() * 11)> 4){
                tempexp.push("T"); // 9
            }
            tempexp.push("V"); // 10
            tempexp.push("V");// 11
            }
        }
    tempexp.push("E");//3
    if(templetter == "T"){
            tempexp.push("T"); // 4
    }
    else if(templetter == "P"){
        tempexp.push("P"); //5
    }
    tempexp.push("E");
    
    return tempexp;
}

function displayWrongWord(){
    reset();
    let output = generateRight();
    if(output[output.length-2] == "T") output[output.length-2] = "P";
    else if(output[output.length-2] == "P") output[output.length-2] = "T";
    output = output.join("");
    input.value = output;
    input.dispatchEvent(new Event('input'));
}

function displayRightWord(){
    reset();
    let output = generateRight().join("");
    input.value = output;
    input.dispatchEvent(new Event('input'));
}



function runAuto(){
    if(auto==0){
        auto = 1;
        autoStep();
    }
    else if(auto==1) auto = 0;
    
}

function autoStep(){
    run()
    if(auto==1){
        setTimeout(() => autoStep(), speed);
    }
    
}

//Sets the speed of auto mode
function setSpeed(value) {
    speed = Math.abs(10000/value);
}

function checkWord(){
    for(let m = 0; m < input.value.length; m++){ //Für jeden Buchstaben des Strings
        if(goodletter.includes(input.value.charAt(m))) continue;
        else return false;
    }
    return true;    
}

function run(){
    if(running == 0){
        if(checkWord()==false){
            document.getElementById('statusText').innerHTML = 'Wort enthält ungültige Zeichen!';
            auto=0;
            return 0;
        }
        else{
            exp = input.value.split('');
            running = 1;
        }
    }
    
    console.log("Button clicked");
    console.log(exp);
    if(runMachine(exp[stepCounter],stepCounter)){
        console.log(exp);
        stepCounter++;
        document.getElementById('graph').src='images/' + state + '.png'; //Bild aktualisieren
        if(state == 4 || state == 5){ //4 und 5 sind sonderfälle, weil hier nicht im Wort vorwärts, sonder zurückgeschaut wird. Der Stepcounter wird hier "pausiert" und der nächste Buchstabe erst beim nächsten Aufruf verarbeitet.
            stepCounter--;
        }    
    }
    else{
        console.log("Fehlgeschlagen" + state);
        document.getElementById('statusText').style.color = "red";
        auto=0;
        if(state==5) document.getElementById('graph').src='images/5f.png';
        else if(state==4) document.getElementById('graph').src='images/4f.png';
    }
    if(finished !== 1) document.getElementById('statusText').innerHTML = exp.join(''); //Statuszeile aktualisieren
    
}

function reset(){
    running=0;
    auto=0;
    state=0;
    stepCounter=0;
    finished=0;
    document.getElementById('graph').src='images/0.png';
    document.getElementById('statusText').innerHTML = 'System bereit';
    document.getElementById('statusText').style.color = "black";
}

function runMachine(letter, pos){
    switch(state){
        case 0:
            if(letter == 'B') {
                state = 1; 
                exp[pos] = '_';
                console.log("B erkannt")
                return true;
            }
            else return false;
            break;
        case 1:
            if(letter == 'T'){
                state = 2;
                console.log("T erkannt");
                return true;
            }
            else if(letter == 'P'){
                state = 2;
                console.log("P erkannt");
                return true;
            }
            else return false;
            break;
        case 2:
            if(letter == 'B') {
                state = 8; 
                exp[pos] = '_';
                console.log("B erkannt")
                return true;
            }
            else return false;
            break;
        case 3:
            if(letter == 'T'){
                state = 4;
                exp[pos] = '_';
                console.log("T erkannt");
                return true;
            }
            else if(letter == 'P'){
                state = 5;
                exp[pos] = '_';
                console.log("hinteres P erkannt");
                return true;
            }
            else return false;
            break;
        case 4: //Sonderfall, weil hier auf position 1 zurückgecheckt werden muss.
            for(let j = pos; j >= 0; j--){ //läuft rückwärts über das Band
                if(exp[j] == 'T'){
                    state = 6;
                    exp[j] = '_';
                    console.log("T erkannt");
                    return true;
                }
                else if(j == 0 && exp[j] !== 'T') return false;
            }
            break;
        case 5: //Sonderfall, weil hier auf position 1 zurückgecheckt werden muss.
            for(let j = pos; j >= 0; j--){ //läuft rückwärts über das Band
                if(exp[j] == 'P'){
                    state = 6;
                    exp[j] = '_';
                    console.log("vorderes P erkannt");
                    return true;
                }
                else if(j == 0 && exp[j] !== 'P') return false;
            }
            break;
        case 6:
            if(letter == 'E'){
                state = 7;
                exp[pos] = '_';
                console.log("Finales E erkannt");
                return true;
            }
            else return false;
            break;
        case 7:
            console.log("Erfolgreich durchgelaufen, Huzzah!");
            running = 0;
            auto = 0;
            finished = 1
            document.getElementById('statusText').style.color = "green";
            document.getElementById('statusText').innerHTML = "Erfolgreich!";
            return true;
            break;
        case 8:
            if(letter == 'T'){
                state = 12;
                exp[pos] = '_';
                console.log("T erkannt");
                return true;
            }
            else if(letter == 'P'){
                state = 9;
                exp[pos] = '_';
                console.log("P erkannt");
                return true;
            }
            else return false;
            break;
        case 9:
            if(letter == 'T'){
                state = 9;
                exp[pos] = '_';
                console.log("T erkannt");
                return true;
            }
            else if(letter == 'V'){
                state = 10;
                exp[pos] = '_';
                console.log("V erkannt");
                return true;
            }
            else return false;
            break;
        case 10:
            if(letter == 'P'){
                state = 13;
                exp[pos] = '_';
                console.log("P erkannt");
                return true;
            }
            else if(letter == 'V'){
                state = 11;
                exp[pos] = '_';
                console.log("V erkannt");
                return true;
            }
            else return false;
            break;
        case 11:
            if(letter == 'E'){
                state = 3;
                exp[pos] = '_';
                console.log("E erkannt");
                return true;
            }
            else return false;
            break;
        case 12:
            if(letter == 'S'){
                state = 12;
                exp[pos] = '_';
                console.log("S erkannt");
                return true;
            }
            else if(letter == 'X'){
                state = 13;
                exp[pos] = '_';
                console.log("X erkannt");
                return true;
            }
            else return false;
            break;
        case 13:
            if(letter == 'S'){
                state = 11;
                exp[pos] = '_';
                console.log("S erkannt");
                return true;
            }
            else if(letter == 'X'){
                state = 9;
                exp[pos] = '_';
                console.log("X erkannt");
                return true;
            }
            else return false;
            break;
        
    }
    
}
