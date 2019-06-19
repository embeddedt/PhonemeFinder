/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
// Converts from degrees to radians.
Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
};

$.fn.mindim = function() {
    var w = $(this).width();
    var h = $(this).height();
    return h < w ? w : h;
};

var useWordList = -1;

var currentQuestion = 1;

var numQuestions = 10;

var oo_ou = [ "oo", "ou" ];
var ou_oo = [ "ou", "oo" ];

var oy_oi = [ "oy", "oi" ];
var oi_oy = [ "oi", "oy" ];

var ar_a_al = [ "ar", "a", "al"];
var a_ar_al = [ "a", "ar", "al"];
var al_ar_a = [ "al", "ar", "a"];

var air_are_ear = [ "air", "are", "ear"];
var are_air_ear = [ "are", "air", "ear"];
var ear_air_are = [ "ear", "air", "are"];

var ore = [ "ore", "or", "oar", "war"];
var oar = [ "oar", "or", "ore", "war"];
var or = [ "or", "ore", "oar", "war"];
var war = [ "war", "or", "oar", "ore"];

var aw = [ "aw" , "augh", "au", "al"];
var au = [ "au" , "augh", "aw", "al"];
var augh = [ "augh" , "aw", "au", "al"];
var al = [ "al" , "augh", "au", "aw"];

var ur = [ "ur", "ir", "er" ];
var er = [ "er", "ir", "ur" ];
var ir = [ "ir", "er", "ur" ];

var eer = [ "eer", "ere" ];
var ere = [ "ere", "eer" ];

var wordLists = [
    "oo/ou",
    "oy/oi",
    "a/ar/al",
    "ear/air/are",
    "war/oar/or/ore",
    "al/aw/au/augh",
    "ur/er/ir",
    "eer/ere"
];

var possibleWords = [
    [ 
        [ "l{0}t", oo_ou ],
        [ "c{0}nt", ou_oo ],
        [ "h{0}se", ou_oo ],
        [ "pron{0}nce", ou_oo ],
        [ "m{0}n", oo_ou ],
        [ "ab{0}t", ou_oo ],
        [ "l{0}nie", oo_ou],
        [ "c{0}ch", ou_oo ],
        [ "g{0}ey", oo_ou ],
        [ "s{0}n", oo_ou ]
    ],
    
    [ 
        [ "c{0}n", oi_oy ],
        [ "p{0}nt", oi_oy],
        [ "t{0}", oy_oi ],
        [ "b{0}l", oi_oy ],
        [ "app{0}nt", oi_oy ],
        [ "enj{0}", oy_oi],
        [ "v{0}age", oy_oi],
        ["turm{0}l", oi_oy],
        ["dec{0}", oy_oi],
        ["{0}ster", oy_oi]
    ],
    
    [
        [ "dec{0}", al_ar_a],
        [ "c{0}f", al_ar_a],
        [ "{0}l", al_ar_a ],
        [ "c{0}t", a_ar_al],
        [ "l{0}b", a_ar_al],
        [ "c{0}ll", a_ar_al ],
        [ "c{0}", ar_a_al ],
        [ "c{0}d", ar_a_al ],
        [ "t{0}", ar_a_al ],
        [ "f{0}", ar_a_al ]
    ],
    
    [
        [ "n{0}", ear_air_are],
        [ "c{0}", are_air_ear],
        [ "w{0}", ear_air_are],
        [ "s{0}", ear_air_are],
        [ "t{0}", ear_air_are],
        [ "bl{0}", are_air_ear],
        [ "s{0}ch", ear_air_are],
        [ "y{0}", ear_air_are],
        [ "ch{0}", air_are_ear],
        [ "app{0}", ear_air_are]
    ],
    [
        [ "{0}n", war],
        [ "{0}m", war],
        [ "b{0}", oar],
        [ "s{0}", oar],
        [ "h{0}d", oar],
        [ "to{0}d", war],
        [ "{0}", or],
        [ "n{0}", or],
        [ "p{0}", ore],
        [ "f{0}", ore]
    ],
    [
        [ "l{0}", augh ],
        [ "t{0}k", al ],
        [ "c{0}l", al ],
        [ "str{0}", aw ],
        [ "ch{0}k", al],
        [ "dr{0}", aw ],
        [ "st{0}k", al ],
        [ "d{0}ter", augh ],
        [ "n{0}ty", augh ],
        [ "{0}gust", au ]
    ],
    [
        [ "yo{0}", ur ],
        [ "a{0}", ir ],
        [ "de{0}", er ],
        [ "m{0}ry", er ],
        [ "to{0}", ur ],
        [ "bl{0}", ur ],
        [ "s{0}", ir ],
        [ "b{0}d", ir ],
        [ "h{0}b", er ],
        [ "find{0}", er ]
    ],
    [
        [ "d{0}", eer ],
        [ "h{0}", ere ],
        [ "th{0}", ere ],
        [ "wh{0}", ere ],
        [ "sph{0}", ere ],
        [ "sev{0}", ere ],
        [ "car{0}", eer ],
        [ "puppet{0}", eer ],
        [ "st{0}", eer ],
        [ "ch{0}", eer ]
    ]
];

function getRandColor(brightness){

    // Six levels of brightness from 0 to 5, 0 being the darkest
    var rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
    var mix = [brightness*51, brightness*51, brightness*51]; //51 => 255/5
    var mixedrgb = [rgb[0] + mix[0], rgb[1] + mix[1], rgb[2] + mix[2]].map(function(x){ return Math.round(x/2.0)})
    return "rgb(" + mixedrgb.join(",") + ")";
}

function generateWord(string, phonemeOptions) {
    if(!Array.isArray(phonemeOptions))
        phonemeOptions = [ phonemeOptions ];
    
    var longest_len = 0;
    var best = 0;
    
    for(var i = 0; i < phonemeOptions.length; i++) {
        var len = phonemeOptions[i].length;
        if(len > longest_len) {
            longest_len = len;
            best = phonemeOptions[i];
        }
    }
        
    var realString = string.replace(
      /\{([0-9]+)\}/g,
      function (_, index) { return phonemeOptions[0]; });
    
    var $word = $("<div class='phoneme-word'></div>");
    $word.append(realString);
    $(".game-container").append($word);
    var $phoneme = $("<div class='phoneme phoneme-ellipse'></div>");
    $phoneme.css({ left: string.indexOf('{') + 'ch' });
    $phoneme.append($("<span></span>").append(phonemeOptions[0]));
    $word.append($phoneme);
    return $word;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePhonemeEllipse(phoneme) {
    var $phoneme_obj = $("<div class='phoneme phoneme-ellipse'></div>");
    $phoneme_obj.append($("<span></span>").append(phoneme));
    $(".game-container").append($phoneme_obj);
    return $phoneme_obj;
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function generateRandomWord() {
    $(".phoneme-word").remove();
    $(".phoneme-ellipse").remove();
    
    
    var word_list_index;
    if(useWordList === -1)
        word_list_index = getRandomInt(0, possibleWords.length - 1);
    else
        word_list_index = useWordList;
    
    var word_list = possibleWords[word_list_index];
    var word_index = currentQuestion - 1; //getRandomInt(0, word_list.length - 1);
    
    console.log("Using word list " + possibleWords.indexOf(word_list));
    var word = word_list[word_index];
    console.log("Using word " + word_list.indexOf(word));
    console.log(word[0]);
    console.log(word[1]);
    generateWord(word[0], word[1]);
    $(".game-container").append("<p></p>");
    var shuffledWords = shuffle(word[1].slice());
    for(var i = 0; i < shuffledWords.length; i++) {
        generatePhonemeEllipse(shuffledWords[i]);
    }
    $(".phoneme-ellipse").each(function(i, obj) {
        $(obj).css({ 'background-color': getRandColor(4) });
    });
    var $wordPhonemes = $(".phoneme-word").find(".phoneme");
    var $draggablePhonemes = $(".phoneme").not($(".phoneme-word .phoneme"));
    $wordPhonemes.droppable({
      drop: function( event, ui ) {
        var $word = $(this).parent();
        var $dragged = $(ui.helper).clone().removeClass('ui-draggable-dragging');
        $(ui.helper).parent().append($dragged);
        var theirPhonemeText = $dragged.find("span").text();
        var ourPhonemeText = $(this).find("span").text();
        console.log(theirPhonemeText + " = " + ourPhonemeText);
        if(theirPhonemeText === ourPhonemeText) {
            $(ui.helper).removeClass('ui-draggable-dragging');
            $(this).hide();
            $word.addClass("phoneme-word-correct");
            $dragged.effect( "scale",
                { percent: ($("body").mindim() / $dragged.mindim()) * 400 },
                500,
                function() {
                    $dragged.remove();
                    if(currentQuestion < 10) {
                       currentQuestion++;
                       $("#current").text(currentQuestion);
                       generateRandomWord();
                    } else {
                        setTimeout(function() {
                            $("#whole-game").hide();
                            $("#whole-options").show();
                        }, 2000);
                    }
                }
            );
            
            
        } else {
            
            $dragged.remove();
            $word.effect("shake");
        }
      }
    });
    $draggablePhonemes.draggable({
        revert: "invalid",
        helper: 'clone',
        stop: function (e, ui) {              
        }
    });
}

function restartGame() {
    $("#whole-options").hide();
    $("#whole-game").show();
    currentQuestion = 1;
    $("#current").text(currentQuestion);
    generateRandomWord();
}

$(window).load(function() {
    $("#not-current").text(numQuestions);
    
    for(var i = 0; i < wordLists.length; i++) {
        var $radio = $("<button></button>");
        $radio.addClass("phoneme-type");
        $radio.append(wordLists[i]);
        $(".options-container").prepend($radio);
    }
    $("#whole-game").hide();
    $("#whole-options").show();
    $(".phoneme-type").button();
    $(".phoneme-type").click(function() {
        useWordList = wordLists.indexOf($(this).text());
        for(var i = 0; i < wordLists.length; i++) {
            possibleWords[i] = shuffle(possibleWords[i]);
        }
        restartGame();
    });
});
