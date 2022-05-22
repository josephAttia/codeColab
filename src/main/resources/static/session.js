'use strict';

var stompClient = null;
var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var peerVideo = document.querySelector("#peerVideo");
var editor = ace.edit("editor");
var username = null;

//on page load connect
window.addEventListener('load', function () {
    connect();
    username = prompt('Enter your name:');
});


function connect(event) {
    var socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, onConnected, onError);
}

function onError() {
    console.log('STOMP error ');
}

function onConnected() {
    // Subscribe to the Public Topic
    stompClient.subscribe('/topic/public', onMessageReceived);
    stompClient.subscribe('/topic/private', onCodeReceived);
    // document.getElementById("peerImageStatus").src = "https://www.freeiconspng.com/thumbs/checkmark-png/checkmark-png-5.png";
}

function sendMessage(event) {
    
    var messageContent = messageInput.value.trim();
    if (messageContent && stompClient) {
        var chatMessage = {
            sender: username,
            content: messageInput.value,
            type: 'CHAT'
        };
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    event.preventDefault();
}


function updateCode() {
    var code = editor.getValue();
    var json = JSON.stringify(code);
    if (stompClient) {
        var codeEditorValue = {
            sender: username,
            content: json,
            type: "CHAT "
        }
        stompClient.send("/app/chat.updateCode", {}, JSON.stringify(codeEditorValue));
    }      
   
}

function onMessageReceived(payload) {
    var textArea = document.querySelector('#text_box');
    var message = JSON.parse(payload.body);
    textArea.value += message.sender + ": " + message.content + "\n";
}

function onCodeReceived(payload) {
    var clone = JSON.parse(payload.body);
    var code = clone.content;
    code = code.replaceAll("\\n", "lol");
    code = code.replaceAll("\\", "");
    code = code.slice(1, -1);  
    code = code.replaceAll("lol", "\n");
    

    editor.setValue(code);

    if (window.getSelection) {window.getSelection().removeAllRanges();}
}

messageForm.addEventListener('submit', sendMessage, true)

// add key listener to whole document
document.addEventListener('keydown', function (event) {
    //if ctrl and enter are pressed call updatecode 
    if (event.ctrlKey && event.keyCode == 13) {
        updateCode();
    }
});


editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/java");


function generateName() {
    var wordList = ['3d', 'a', 'a1', 'aa', 'aaberg', 'aachen', 'aalborg', 'aalesund', 'aalii', 'aalst', 'aalto', 'aam', 'aara', 'aarau', 'aardvark', 'aardwolf', 'aaren', 'aargau', 'aarhus', 'aarika', 'aaron', 'aaron', 'aaronaaronic', 'aaronson', 'ab', 'aba', 'abaca', 'abacist', 'aback', 'abacus', 'abad', 'abad', 'abadan', 'abaddon', 'abaft', 'abagael', 'abagail', 'abalone', 'abamp', 'abampere', 'abana', 'abandon', 'abandoned', 'abarca', 'abase', 'abash', 'abate', 'abatement', 'abatis', 'abattoir', 'abaxial', 'abb', 'abba', 'abbacy', 'abbasid', 'abbate', 'abbate', 'abbatial', 'abbe', 'abbess', 'abbevillian', 'abbey', 'abbey', 'abbeyabbi', 'abbie', 'abbieabbot', 'abbotsen', 'abbotson', 'abbotsun', 'abbott', 'abbott', 'abbottson', 'abbreviate', 'abbreviated', 'abbreviation', 'abby', 'abbyabbye', 'abc', 'abcoulomb', 'abdel', 'abdella', 'abdias', 'abdicate', 'abdication', 'abdomen', 'abdominal', 'abdominous', 'abdu', 'abduce', 'abducent', 'abduct', 'abduction', 'abductor', 'abdul', 'abdulabdulla', 'abdullah', 'abe', 'abeabeam', 'abebi', 'abecedarian', 'abecedarium', 'abecedary', 'abed', 'abednego', 'abel', 'abel', 'abelabelard', 'abele', 'abell', 'abell', 'abelmosk', 'abeokuta', 'abercrombie', 'abercromby', 'aberdare', 'aberdeen', 'abernathy', 'abernathy', 'abernethy', 'abernon', 'aberrant', 'aberration', 'abert', 'abessive', 'abet', 'abettor', 'abeu', 'abey', 'abeyance', 'abeyant', 'abeyta', 'abfarad', 'abhenry', 'abhor', 'abhorrence', 'abhorrent', 'abib', 'abide', 'abiding', 'abidjan', 'abie', 'abigael', 'abigail', 'abigailabigale', 'abijah', 'abilene', 'ability', 'abingdon', 'abiogenesis', 'abiogenetic', 'abiosis', 'abiotic', 'abirritant', 'abirritate', 'abisha', 'abisia', 'abixah', 'abject', 'abjuration', 'abjure', 'ablate', 'ablation', 'ablative', 'ablaut', 'ablaze', 'able', 'ablebodied', 'ablepsia', 'ables', 'abloom', 'ablution', 'ably', 'abm', 'abmho', 'abnaki', 'abnegate', 'abner', 'abner', 'abney', 'abnormal', 'abnormality', 'abnormity', 'aboard', 'abode', 'abohm', 'abolish', 'abolition', 'abomasum', 'abomb', 'abominable', 'abominate', 'abomination', 'aboral', 'aboriginal', 'aborigine', 'aborn', 'aborning', 'abort', 'aborticide', 'abortifacient', 'abortion', 'abortionist', 'abortive', 'abott', 'aboulia', 'abound', 'about', 'aboutface', 'aboutship', 'above', 'aboveboard', 'aboveground', 'abra', 'abracadabra', 'abradant', 'abrade', 'abraham', 'abraham', 'abrahamabrahams', 'abrahamsen', 'abrahan', 'abram', 'abram', 'abramabramo', 'abrams', 'abrams', 'abramson', 'abramson', 'abran', 'abranchiate', 'abrasion', 'abrasive', 'abraxas', 'abreact', 'abreaction', 'abreast', 'abrego', 'abreu', 'abri', 'abridge', 'abridgment', 'abroach', 'abroad', 'abrogate', 'abroms', 'abrupt', 'abruption', 'abruzzi', 'absa', 'absalom', 'abscess', 'abscind', 'abscise', 'abscissa', 'abscission', 'abscond', 'abseil', 'absence', 'absent', 'absentee', 'absenteeism', 'absently', 'absentminded', 'absher', 'abshier', 'abshire', 'absinthe', 'absinthism', 'absolute', 'absolutely', 'absolution', 'absolutism', 'absolve', 'absonant', 'absorb', 'absorbance', 'absorbed', 'absorbefacient', 'absorbent', 'absorber', 'absorbing', 'absorptance', 'absorption', 'absorptivity', 'absquatulate', 'abstain', 'abstemious', 'abstention', 'abstergent', 'abstinence', 'abstract', 'abstracted', 'abstraction', 'abstractionism', 'abstractionist', 'abstriction', 'abstruse', 'absurd', 'absurdity', 'abubekr', 'abukir', 'abulia', 'abundance', 'abundant', 'abuse', 'abusive', 'abut', 'abutilon', 'abutment', 'abuttal', 'abuttals', 'abutter', 'abutting', 'abuzz', 'abvolt', 'abwatt', 'aby', 'abydos', 'abysm', 'abysmal', 'abyss', 'abyssal', 'abyssinia', 'ac', 'acacia', 'academe', 'academia', 'academic', 'academician', 'academicism', 'academy', 'acadia', 'acadian', 'acaleph', 'acalia', 'acanthaceous', 'acantho', 'acanthocephalan', 'acanthoid', 'acanthopterygian', 'acanthous', 'acanthus', 'acapulco', 'acariasis', 'acaricide', 'acarid', 'acaroid', 'acarology', 'acarpous', 'acarus', 'acatalectic', 'acaudal', 'acaulescent', 'accad', 'accalia', 'accede', 'accelerando', 'accelerant', 'accelerate', 'acceleration', 'accelerator', 'accelerometer', 'accent', 'accentor', 'accentual', 'accentuate', 'accentuation', 'accept', 'acceptable', 'acceptance', 'acceptant', 'acceptation', 'accepted', 'accepter', 'acceptor', 'access', 'accessary', 'accessible', 'accession', 'accessory', 'acciaccatura', 'accidence', 'accident', 'accidental', 'accidie', 'accipiter', 'accipitrine', 'acclaim', 'acclamation', 'acclimate', 'acclimatize', 'acclivity', 'accolade', 'accommodate', 'accommodating', 'accommodation', 'accommodative', 'accompaniment', 'accompanist', 'accompany', 'accompanyist', 'accomplice', 'accomplish', 'accomplished', 'accomplishment', 'accord', 'accordance', 'accordant', 'according', 'accordingly', 'accordion', 'accost', 'accouchement', 'accoucheur', 'account', 'accountable', 'accountancy', 'accountant', 'accounting', 'accouplement', 'accouter', 'accouterment', 'accoutre', 'accra', 'accredit', 'accrescent', 'accrete', 'accretion', 'accroach', 'accrual', 'accrue', 'acculturate', 'acculturation', 'acculturize', 'accumbent', 'accumulate', 'accumulation', 'accumulative', 'accumulator', 'accuracy', 'accurate', 'accursed', 'accusal', 'accusation', 'accusative', 'accusatorial', 'accusatory', 'accuse', 'accused', 'accustom', 'accustomed', 'ace', 'acea', 'aceae', 'acedia', 'aceldama', 'acentric', 'aceous', 'acephalous', 'acerate', 'acerb', 'acerbate', 'acerbic', 'acerbity', 'acerose', 'acervate', 'acescent', 'acetabulum', 'acetal', 'acetaldehyde', 'acetamide', 'acetanilide', 'acetate', 'acetic', 'acetify', 'aceto', 'acetometer', 'acetone', 'acetophenetidin', 'acetous', 'acetum', 'acetyl', 'acetylate', 'acetylcholine', 'acetylene', 'acetylide', 'acevedo', 'aceves', 'acey', 'aceydeucy', 'achaea', 'achaean', 'achaemenid', 'achates', 'ache', 'achelous', 'achene', 'acherman', 'achernar', 'acheron', 'achieve', 'achievement', 'achilles', 'achitophel', 'achlamydeous', 'achlorhydria', 'achondrite', 'achondroplasia', 'achorn', 'achromat', 'achromatic', 'achromaticity', 'achromatin', 'achromatism', 'achromatize', 'achromatous', 'achromic', 'acicula', 'acicular', 'aciculate', 'aciculum', 'acid', 'acidfast', 'acidforming', 'acidhead'];
    var chooseWord = wordList[Math.floor(Math.random() * wordList.length)];
    var randomNumber = Math.floor((Math.random() * 1000) + 1);
    return (chooseWord + randomNumber);
}