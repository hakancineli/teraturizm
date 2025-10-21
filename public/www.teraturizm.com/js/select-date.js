
function validateForm()
{


    //Check_In bos olmaza
    var x=document.forms["selectdate"]["Check_In"].value;
    if (x==null || x=="")
    {
        alert("Please select a start date");
        return false;
    } //Check_In bos olmaza

    //select-Guests
    var x=document.forms["selectdate"]["select-Guests"].value;
    if (x==null || x=="")
    {
        alert("Please select a number of adults.");
        return false;
    } //select-Guests

    //formname
    var x=document.forms["selectdate"]["formname"].value;
    if (x==null || x=="")
    {
        alert("Please enter your name.");
        return false;
    } //formname

    //formsurnanme
    var x=document.forms["selectdate"]["formsurnanme"].value;
    if (x==null || x=="")
    {
        alert("Please enter your surname.");
        return false;
    } //formsurnanme

    //formsurnanme
    var x=document.forms["selectdate"]["formemail"].value;
    if (x==null || x=="")
    {
        alert("Please enter your email address.");
        return false;
    } //formsurnanme

    //formsurnanme
    var x=document.forms["selectdate"]["formtel"].value;
    if (x==null || x=="")
    {
        alert("Please enter your mobil phone.");
        return false;
    } //formsurnanme

    //formsurnanme
    if(!this.selectdate.formCheck1.checked)
    {
        alert("Please accept this condition.");
        return false;
    } //agreecheck kontrol//formsurnanme


}



