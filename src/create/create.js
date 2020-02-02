import templateJson from '../assets/json/chat';

$(function(){

    new ClipboardJS('.btn');

    // add to left character chat
    $('.js-left-add').on('click', function () {
        // TODO: replace with chosen avatar
        updateJson('avatars/blue-tenant.png');
    });

    // add to right character chat
    $('.js-right-add').on('click', function () {
        // TODO: replace with chosen avatar
        updateJson('avatars/link-cartoon-02.png');
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
                var link = window.location.origin + '/#'+ id;
                $('.js-copy-link').attr("href", link);
                $('.js-copy-link').text(link);
                $('.js-preview-link').show();
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
            // load avatars json
            // find avatar label
            // preview image...?
            $('.js-script').append('<p>' + chat[i][0] + ': ' + chat[i][1] + '</p>');
        }
    }

    $('.js-preview-link').hide();
    $('.js-add-text').focus();
});