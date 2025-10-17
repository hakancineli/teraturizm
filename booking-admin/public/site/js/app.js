//setTimeout(function () {
//    $('.alert').slideUp(500);
//}, 5000);

function togglePassword() {
    var element = document.getElementById('password');
    element.type = (element.type == 'password' ? 'text' : 'password');
}

function FormSubmitControl() {

    $('#FromSubmitButton').attr("disabled", true);
    document.getElementById("FormButtonValue").style.display = "none";
    document.getElementById("FormButtonLoader").style.display = "inline-table";

}

function FormOrder() {
    document.getElementById('FormOrder').submit();
}


$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});



function myFunction() {
    var x = document.getElementById("myDIV");
    if (x.style.display === "block") {
        x.style.display = "none";
    } else {
        x.style.display = "block";
    }
}

function myFunction2() {
    var x = document.getElementById("myDIV2");
    if (x.style.display === "block") {
        x.style.display = "none";
    } else {
        x.style.display = "block";
    }
}

function myFunction3() {
    var x = document.getElementById("myDIV3");
    if (x.style.display === "block") {
        x.style.display = "none";
    } else {
        x.style.display = "block";
    }
}

function myFunction4() {
    var x = document.getElementById("myDIV4");
    if (x.style.display === "block") {
        x.style.display = "none";
    } else {
        x.style.display = "block";
    }
}

function myFunction5() {
    var x = document.getElementById("myDIV5");
    if (x.style.display === "block") {
        x.style.display = "none";
    } else {
        x.style.display = "block";
    }
}

function myFunction6() {
    var x = document.getElementById("myDIV6");
    if (x.style.display === "block") {
        x.style.display = "none";
    } else {
        x.style.display = "block";
    }
}


function starmouseOver() {

    document.getElementById("startrating1").onclick = function(){
        document.getElementById("startrating1").style.color = "#ea000d";
        document.getElementById("startrating2").style.color = "darkgrey";
        document.getElementById("startrating3").style.color = "darkgrey";
        document.getElementById("startrating4").style.color = "darkgrey";
        document.getElementById("startrating5").style.color = "darkgrey";
        document.getElementById('vote_customer_relationship').value = '1';
    };
    document.getElementById("startrating2").onclick = function(){
        document.getElementById("startrating1").style.color = "#ea000d";
        document.getElementById("startrating2").style.color = "#ea000d";
        document.getElementById("startrating3").style.color = "darkgrey";
        document.getElementById("startrating4").style.color = "darkgrey";
        document.getElementById("startrating5").style.color = "darkgrey";
        document.getElementById('vote_customer_relationship').value = '2';
    };
    document.getElementById("startrating3").onclick = function(){
        document.getElementById("startrating1").style.color = "#ea000d";
        document.getElementById("startrating2").style.color = "#ea000d";
        document.getElementById("startrating3").style.color = "#ea000d";
        document.getElementById("startrating4").style.color = "darkgrey";
        document.getElementById("startrating5").style.color = "darkgrey";
        document.getElementById('vote_customer_relationship').value = '3';
    };
    document.getElementById("startrating4").onclick = function(){
        document.getElementById("startrating1").style.color = "#ea000d";
        document.getElementById("startrating2").style.color = "#ea000d";
        document.getElementById("startrating3").style.color = "#ea000d";
        document.getElementById("startrating4").style.color = "#ea000d";
        document.getElementById("startrating5").style.color = "darkgrey";
        document.getElementById('vote_customer_relationship').value = '4';
    };
    document.getElementById("startrating5").onclick = function(){
        document.getElementById("startrating1").style.color = "#ea000d";
        document.getElementById("startrating2").style.color = "#ea000d";
        document.getElementById("startrating3").style.color = "#ea000d";
        document.getElementById("startrating4").style.color = "#ea000d";
        document.getElementById("startrating5").style.color = "#ea000d";
        document.getElementById('vote_customer_relationship').value = '5';
    };



    document.getElementById("startrating1").onmouseover = function(){
        document.getElementById("startrating1").style.color = "#ea000d";
        document.getElementById("startrating2").style.color = "darkgrey";
        document.getElementById("startrating3").style.color = "darkgrey";
        document.getElementById("startrating4").style.color = "darkgrey";
        document.getElementById("startrating5").style.color = "darkgrey";
        document.getElementById('vote_customer_relationship').value = '1';

    };

    document.getElementById("startrating2").onmouseover = function(){
        document.getElementById("startrating1").style.color = "#ea000d";
        document.getElementById("startrating2").style.color = "#ea000d";
        document.getElementById("startrating3").style.color = "darkgrey";
        document.getElementById("startrating4").style.color = "darkgrey";
        document.getElementById("startrating5").style.color = "darkgrey";
        document.getElementById('vote_customer_relationship').value = '2';
    };

    document.getElementById("startrating3").onmouseover = function(){
        document.getElementById("startrating1").style.color = "#ea000d";
        document.getElementById("startrating2").style.color = "#ea000d";
        document.getElementById("startrating3").style.color = "#ea000d";
        document.getElementById("startrating4").style.color = "darkgrey";
        document.getElementById("startrating5").style.color = "darkgrey";
        document.getElementById('vote_customer_relationship').value = '3';
    };

    document.getElementById("startrating4").onmouseover = function(){
        document.getElementById("startrating1").style.color = "#ea000d";
        document.getElementById("startrating2").style.color = "#ea000d";
        document.getElementById("startrating3").style.color = "#ea000d";
        document.getElementById("startrating4").style.color = "#ea000d";
        document.getElementById("startrating5").style.color = "darkgrey";
        document.getElementById('vote_customer_relationship').value = '4';
    };

    document.getElementById("startrating5").onmouseover = function(){
        document.getElementById("startrating1").style.color = "#ea000d";
        document.getElementById("startrating2").style.color = "#ea000d";
        document.getElementById("startrating3").style.color = "#ea000d";
        document.getElementById("startrating4").style.color = "#ea000d";
        document.getElementById("startrating5").style.color = "#ea000d";
        document.getElementById('vote_customer_relationship').value = '5';
    };

}
