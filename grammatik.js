var genExp = document.getElementById('input');
var stepsbox = document.getElementById('stepsbox')
var genWrongButton = document.getElementById('gen_but_wrong');
var stepbutton = document.getElementById('step');
var wronglist = ['AOA', '(A)', 'Z', 'O'];
var rightlist = ['AOA', 'Z'];
const badexp = ['()', 'Z(', 'OO', 'ZZ', ')Z', ')O', '(O', 'A(', ')A', ')('];
const operants = ['+', '-', '*', '/'];
var steps = [];
var rulesteps= [''];
var laststep = 'A';
var index = 0;
var busy = 0; //läuft gerade eine Darstellung?
var speed = 400
var stop = 0;


function getFalschAusdruck(ex){
    let result = ex;
    for (let i=0;i<3;i++){
        let r = getRandomNumber(0, wronglist.length -1);
        result += wronglist[r];
        }
    result = result.replace(/A/g, 'Z');
    return result;
}

function generateRandomWrongExpr(){
    reset();
    let result = getFalschAusdruck('Z');
    let resultWord = '';
    for (let i = 0; i < result.length; i++) {
        resultWord += ersetzen(result[i]);
    }
    genExp.value = resultWord;
    genExp.dispatchEvent(new Event('input'));
    console.log(resultWord);
}



function getRichtigAusdruck(ex) {
    let result = ex;
    for (let i = 0; i < 3; i++) {
        if(result.search('\\(A\\)')>=0){
            let r = getRandomNumber(0, rightlist.length - 1);
            result = result.replace('(A)','('+rightlist[r]+')');
        }
        else
        {let r = getRandomNumber(0, rightlist.length - 1);
            result = result.replace('A',rightlist[r]);}
    }
    result = result.replace(/[A]/g, 'Z');
    return result;
}

function generateRandomRightWord() {
    reset();
    let a = rightlist[getRandomNumber(0, rightlist.length - 1)];
    let result = getRichtigAusdruck(a);
    let resultWord = '';
    for (let i = 0; i < result.length; i++) {
        resultWord += ersetzen(result[i]);
    }
    genExp.value = resultWord;
    genExp.dispatchEvent(new Event('input'));
    console.log(resultWord);
}


function checkWord(e){
    let exp = genExp.value;
    steps.push(exp);
    rulesteps.push('Z2');
    if(exp.match(/\d/)){ //Wenn es Zahlen gibt, durch Z ersetzen
        exp = exp.replace(/\d/g, 'Z');
        steps.push(exp);
        rulesteps.push('Z2');
    }
    if(exp.match(/[+ \- / *]/)){ //Wenn es Operanden gibt, durch O ersetzen
        exp = exp.replace(/[+ \- / *]/g, 'O'); 
        steps.push(exp);
        rulesteps.push('O');
    }
    if(exp.includes('Z')){
        exp = exp.replaceAll('Z', 'A'); //Alle Z durch A ersetzen
        steps.push(exp);
        rulesteps.push('A');
    }
    if(isOrderCorrect(exp)!==true){
        stepsbox.innerHTML = "Der Angegebene Ausdruck ist unzulaessig";
        index = 1000;
    }
    while (exp.includes('AOA')){
       exp = reduceWord(exp);
       steps.push(exp);
        rulesteps.push('A');
    }   
    steps.reverse();
    rulesteps.reverse();
}

function reduceWord(exp){
    if (exp.includes('AOA')){
        console.log("replaced AOA");
        return exp.replace('AOA','A')
    }
}

function stepForward(e){
    if(!genExp.value){
        return;
    }
    if(busy===0) { //check ob wir checkWord schon ausgeführt haben
        checkWord(e);
        busy = 1;
    }
    if (index < steps.length){
        stepsbox.innerHTML += steps[index];
        stepsbox.innerHTML += '<br>';
        document.getElementById(laststep).style.color = "black";
        document.getElementById(rulesteps[index]).style.color = "blue";
        laststep = rulesteps[index];
        console.log("last step:" + laststep);
        console.log("should be:" + rulesteps[index]);
        index++;
    }
}

function autoForward(e){
    stop = 0;
    if(!genExp.value){
        return;
    }
    if(busy===0) { //check ob wir checkWord schon ausgeführt haben
        checkWord(e);
        busy = 1;
    }
    if(index < steps.length){
        stepsbox.innerHTML += steps[index];
        stepsbox.innerHTML += '<br>';
        document.getElementById(laststep).style.color = "black";
        document.getElementById(rulesteps[index]).style.color = "blue";
        laststep = rulesteps[index];
        index++;
        setTimeout(() => nextStep(), speed);

    }
    
}

function nextStep(){
    if(stop){
        return        
    }
    else{
        autoForward();
    }
    
}

//Returns true if no bad expressions found. Returns index of bad expression otherwise.
function isOrderCorrect(exp){
    for(let i=0; i<badexp.length; i++){
        if(exp.includes(badexp[i])){
            return exp.indexOf(badexp[i]);
            break; //break if bad expression found
        }
    }
    return true; //for loop passed without bad expression found. return true.
}
//Utilities
/**
 * calculates a random int within a given interval
 * @param start start of the interval
 * @param length length of the interval
 * @returns an int
 */
function getRandomNumber(start, length) {
    return start + Math.round(Math.random() * length);
}

function checkBadSymbol(e){
    return badexp.includes(e);
}

function ersetzen(e){
    if(e==='Z'){
        return getRandomNumber(0,9);
    }
    if(e==='O'){
        return operants[getRandomNumber(0,3)];
    }
    else return e;
    
}

// setzt alles wieder auf Anfang
function reset(){
    steps = [];
    index = 0;
    busy = 0;
    stepsbox.innerHTML = '';
    genExp.value = '';
    genExp.dispatchEvent(new Event('input'));
    document.getElementById(laststep).style.color = "black";
}

//Sets the speed of auto mode
function setSpeed(value) {
    speed = Math.abs(10000/value);
}

function pause(){
    stop = 1;
    console.log('stop');
}
