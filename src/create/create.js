import templateJson from '../assets/json/chat';

$(function(){

    new ClipboardJS('.btn');

    // add to left character chat
    $('.js-left-add').on('click', function () {
        updateJson('left');
    });

    // add to right character chat
    $('.js-right-add').on('click', function () {
        updateJson('right');
    });

    $('.js-publish-btn').on('click', function(){

        var data = JSON.stringify(templateJson);

        $.ajax({
            url: "https://api.myjson.com/bins",
            type: "POST",
            data: data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data, textStatus, jqXHR) {
                var json = JSON.stringify(data);
                var id = data.uri.split("/").pop();
                $('.js-copy-link').val(window.location.origin + '/#'+ id);
            }
        });
    });

    var getText = function(){   
        return $('.js-add-text').val();
    }

    var updateJson = function(character) {
        var chat = templateJson.chat;
        chat.push([character, getText()]);
        $('.js-add-text').val('');
        showChat();
        $('.js-add-text').focus();
        return;
    }

    // render chat json as script
    var showChat = function(){
        $('.js-script').empty();
        var chat = templateJson.chat;
        for(var i = 0; i < chat.length; i++) {
            $('.js-script').append('<p>' + chat[i][0] + ': ' + chat[i][1] + '</p>');
        }
    }
});