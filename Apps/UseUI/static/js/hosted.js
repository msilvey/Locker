userEmail = "";
userName = "";
userOptin = '';
externalHost = '';

function setUserGlobals(data) {
    userEmail = data.email;
    userName = data.name;
    userOptin = data.optin;
    externalHost = data.externalHost;
    
    $(".userEmail").text(userEmail);
    $(".user-name").text(userName);

    console.log('globals');
    var E = $("#customLogout");
    E.show();
    var width = $("#menuExpander .userEmail").width() + $("#menuExpander .expander").width() + 10;
    $("#menuExpander").width(width);
    E.width(width);
    E.position({left:$("#header").width() - width - 20, top:0});
    $("#userMenu").width(width);
}

$(document).ready(function() {
    $("#customLogout").hover(function() {
        $("#customLogout").toggleClass("userMenuHover");
    });

    $("#customLogout").click(function() {
        $("#customLogout").toggleClass("userMenu");
        $("#userMenu").toggle();
    });

    if (userOptin === "true") {
        $(".app-page").append('<script type="text/javascript" charset="utf-8" src="js/ga.js"></script>');
        
    }
});
