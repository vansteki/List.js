var appConfig = {
    zone: '#zone',
    card: '.card',
    listWidth: 400,
    placeholderWidth: 314,
    adjustBodyOffset: 340,
    cardPlaceholderWidth: 300,
    inputCache: '',
    listPlaceholder:
        "<div class='add-list-placeholder'>" +
            "<div class='add-list'>" +
                'Add a List ...' +
            '</div>' +
        '<div>'
    ,
    listDom: 
                "<div class='list'>" + 
                "<div class='list-title-banner'>" + 
                "<span class='list-title'>TITLE</span>" + 
                "</div>" + 
                "<div class='list-box'>" + 
                "<div class='in-list clearfix'>" + 
                "<div class='block'></div>" + 
                '</div>' + 
                '</div>' + 
                "<a id='add-card' href='#'>Add a card…</a>" + 
                '</div>',
    cardDom: 
                "<div class='card'>" + 
                "<div class='card-header'>" + 
                "<span class='card-title'>" + 'Feeds</span>' + 
                '</div>' + 
                "<div class='card-content'>" + 
                "<table>" + 
                "<thead>" + 
                "<tr>" + 
                "<th>" + "</th>" + 
                "<th>" + "</th>" + 
                "</tr>" + 
                "</thead>" + 
                    "<tbody>" + 
                    "<tr>" + 
                        "<td>" + "地址 </td>" + 
                        "<td class='address'>" + "THU</td>" + 
                    "</tr>" + 
                    "<tr>" + 
                        "<td>" + "經緯度 </td>" + 
                        "<td class='latlng'>" + "123321, 1234567</td>" + 
                    "</tr>" + 
                "</tbody>" + 
                "</table>" + 
                "</div>" + 
                "</div>"
};

var List = 
{
    adjustBodyWidth: function(nPixels) 
    {
        if (document.body.style.width === '') {
            $('body').css('width', document.body.clientWidth + 0); //document.body.style.width === will be set to 0 not ''
        }else{
            $('body').css('width', parseInt($('body').css('width'), 10) + nPixels);
        }
        console.log($('body').css('width'));
    },
    iniBodyWidth: function(){
        var listWidth = $('.list')[0].offsetWidth || appConfig.listWidth;
        var listPlaceholderWidth = $('.add-list-placeholder')[0].offsetWidth || appConfig.placeholderWidth;
        var listCount = ( $('.list').length === 0 ? 1 : $('.list').length );
        var totalListsWidth = listWidth * listCount;
        if( totalListsWidth + listPlaceholderWidth + 10 > document.body.clientWidth)
            $('body').css('width', parseInt($('body').css('width'), 10) + document.body.clientWidth - totalListsWidth);
    },
    setListBoxMaxHeight: function()
    {
        //when to show scrollbar
        // $('.list-box').css('max-height', document.body.scrollHeight - 150);
        var offSet = ( $('.list').position().top + $('.list-box').position().top ) * 2;
        $('.list-box').css('max-height', document.documentElement.clientHeight - offSet);
    },
    rePosAddListPlaceholder: function(){
        var nextElementCount = $('.add-list-placeholder').next().siblings().length;                
        if (nextElementCount >= 1) $('#zone').append($('.add-list-placeholder')); //move listplaceholder to default position
    },
    finalCheck: function(){
        this.rePosAddListPlaceholder();
    },
    fadeInBackgroundImg: function(){
        $('.background-img').animate({opacity: 0}, 0).css({'background-image': 'url(http://i.imgur.com/XEtgQ.jpg)'}).animate({opacity: 1}, 500);
    },
    form:
    {
        firstTimeBind: function(){ //loop DOM to bind each list
            $('.address').editable({
                showbuttons: 'bottom'
            });
            $('.latlng').editable({
                showbuttons: 'bottom'
            });
            $('.card-title').editable({
                showbuttons: 'bottom'
            });
            $('.list-title').editable({
                showbuttons: 'bottom'
            });

            var n = $('.list').length;
            for(var i = 0; i <= n; i++)
            {
                var thisList = $('.list')[i];

                $(thisList).find('.list-title, .card-title, .address, .latlng').on('shown', function(e, reason) {                    
                    var thisList = $(this).parents('.list'),
                        inputText = $(this).siblings().find('input'),  //  find x-editable form after shown event, $(this) == $(e.currentTarget).siblings()... 
                        hasCache = $(this).attr('data-cache');

                    $(thisList).find('.in-list').sortable( "disable" );
                    
                    if (hasCache) inputText.val( $(this).attr('data-cache') );
                    inputText.on('keyup mouseup', function(e){ appConfig.inputCache = $(this).val(); });
                });

                $(thisList).find('.list-title, .card-title, .address, .latlng').on('hidden', function(e, reason) {
                    console.log(reason);
                    var thisList = $(this).parents('.list');
                    $(thisList).find('.in-list').sortable( "disable" );

                    if ( $(thisList).find('.card-content td').hasClass('editable-open'))
                        $(thisList).find('.in-list').sortable('disable');
                    else
                        $(thisList).find('.in-list').sortable('enable');
               
                    if (reason === 'onblur' || reason === 'manual') $(this).attr('data-cache', appConfig.inputCache);

                    if( reason === 'cancel' || reason === 'save') {
                        appConfig.inputCache = ''; 
                        $(this).removeAttr('data-cache');
                    }
                });             
            }
        },
        bindNewForm: function(config) //only bind new(latest) list which placeholder was clicked
        {
            $('.address').editable({
                showbuttons: 'bottom'
            });
            $('.latlng').editable({
                showbuttons: 'bottom'
            });
            $('.card-title').editable({
                showbuttons: 'bottom'
            });
            $('.list-title').editable({
                showbuttons: 'right',
                url: '/post',    
                pk: 1,    
                title: 'Enter username',
                ajaxOptions: {
                    type: 'put'
                } 
            });

            config.inList.find('.card-title, .address, .latlng').on('shown', function(e, reason) {
                var thisList = $(this).parents('.in-list'),
                    inputText = $(this).siblings().find('input'),  //  find x-editable form after shown event, $(this) == $(e.currentTarget).siblings()... 
                    hasCache = $(this).attr('data-cache');

                thisList.sortable("disable");
                if (hasCache) inputText.val($(this).attr('data-cache'));
                inputText.on('keyup mouseup', function(e){ 
                    appConfig.inputCache = $(this).val(); 
                });
            });

            config.inList.find('.card-title, .address, .latlng').on('hidden', function(e, reason) {
                var thisList = $(this).parents('.list');
                $(thisList).find('.in-list').sortable( "disable" );

                if (thisList.find('.card-content td').hasClass('editable-open'))
                    thisList.find('.in-list').sortable('disable');
                else
                    thisList.find('.in-list').sortable('enable');

                if (reason === 'onblur' || reason === 'manual') {
                    $(e.currentTarget).attr('data-cache', appConfig.inputCache);
                }
            
                if( reason === 'cancel' || reason === 'save') { 
                    appConfig.inputCache = ''; 
                    $(this).removeAttr('data-cache');
                }
            });
            config = '';
        }
    },
    bindForm: function() //bind all in once
    {
        $('.address').editable({
            showbuttons: 'bottom'
        });
        $('.latlng').editable({
            showbuttons: 'bottom'
        });
        $('.card-title').editable({
            showbuttons: 'bottom'
        });
        $('.list-title').editable({
            showbuttons: 'right'
        });
        
        $('.list-title, .card-title, .address, .latlng').on('shown', function(e, reason) {
            $('.in-list').sortable( "disable" );
            var inputText = $(this).siblings().find('input');  //  find x-editable form after shown event, $(this) == $(e.currentTarget).siblings()... 
            var hasCache = $(this).attr('data-cache');
            if (hasCache) inputText.val($(this).attr('data-cache'));
            inputText.on('keyup mouseup', function(e){ appConfig.inputCache = $(this).val(); });
        });
        
        $('.list-title, .card-title, .address, .latlng').on('hidden', function(e, reason) {
            if ($('.card-content td').hasClass('editable-open'))
                $('.in-list').sortable('disable');
            else
                $('.in-list').sortable('enable');
            
            if (reason === 'onblur' || reason === 'manual') $(this).attr('data-cache', appConfig.inputCache);       
            
            if( reason === 'cancel' || reason === 'save') { 
                appConfig.inputCache = ''; 
                $(this).removeAttr('data-cache');
            }
        });
    },
    list:
    {
        appendByButton: function() {
            var lastList = $(appConfig.zone).find('.list').last(); console.log(lastList);
            var lastInList = $(lastList).find('in-list');
            var lastListObj = {
                list: lastList,
                inList: lastInList
            };            
            List.adjustBodyWidth(appConfig.adjustBodyOffset);
            $(appConfig.zone).append(appConfig.listDom);
            List.card.bindCardSortable();
            List.setListBoxMaxHeight();
            List.form.bindNewForm(lastListObj);
        },
        appendByPlaceholder: function(listPlaceholderPos){
            List.adjustBodyWidth(appConfig.adjustBodyOffset);        
            listPlaceholderPos.replaceWith(appConfig.listDom);
            var lastList = $(appConfig.zone).find('.list').last(); console.log(lastList);
            var lastInList = $(lastList).find('in-list');
            var lastListObj = {
                list: lastList,
                inList: lastInList
            };
            List.card.bindCardSortable();
            List.form.bindNewForm(lastListObj);
            List.setListBoxMaxHeight();
            List.list.injectListPlaceholder();            
        },        
        bindListSortable: function()
        {
            $(appConfig.zone).sortable({
                sort: function(event, ui) {
                    $('.ui-sortable-placeholder').css('height', ui.item.context.offsetHeight);
                    $(ui.item.context).addClass('list-skew')
                },
                stop: function(event, ui) {
                    $(ui.item.context).removeClass('list-skew');
                    List.finalCheck();
                }
            });
        },
        injectListPlaceholder: function() {
            $('#zone').append(appConfig.listPlaceholder);
            //listplaceholder events handler
            $('#zone').delegate('.add-list-placeholder', 'mouseover', function() {
                $('#zone').sortable('disable');
                List.rePosAddListPlaceholder(); //move listplaceholder to default position
            });
            $('#zone').delegate('.add-list-placeholder', 'mouseout', function() { 
                $('#zone').sortable('enable');
            });
            $('#zone').delegate('.add-list-placeholder', 'click', function() { 
                $('#zone').sortable('enable');
            });
        }
    },
    card: 
    {
        add: function(addCardElement){
            var thisInList = addCardElement.parent().find('.in-list').prepend(appConfig.cardDom);
            // var currentList = $(this).parent().find('.list').prepend(appConfig.cardDom);
            List.card.decoCard({
                newCard: 'TRUE',
                whichInlist: thisInList //current .in-list
            });
            List.form.bindNewForm({ inList: thisInList });
            // List.form.bindForm();            
        },        
        bindCardSortable: function()
        {
            $(".in-list").sortable({
                cancel: '.list-title-banner',
                connectWith: ".in-list",
                sort: function(event, ui) {
                    $('.card').css('cursor', '-webkit-grabbing').css('cursor', '-moz-grabbing');
                    $('.ui-sortable-placeholder').css('height', ui.item.context.offsetHeight);
                    $(ui.item.context).addClass('card-skew');
                },
                stop: function(event, ui) {
                    $('.card').css('cursor', 'pointer');
                    $(ui.item.context).removeClass('card-skew');
                    var thisInList = $(ui.item.context).parents('.in-list');
                    // List.form.bindForm();  
                    List.form.bindNewForm({ inList: thisInList });
                }
            });
        },        
        decoCard: function(config) 
        {
            if (config.newCard === 'FALSE' || Object.keys(config).length === 0)
                this.decoOldCard();
            else
                this.decoNewCard(config.whichInlist);
        },
        decoOldCard: function()
        {
            $(".card").addClass("ui-widget ui-widget-content ui-helper-clearfix ui-corner-all")
                .find(".card-header")
                .addClass("ui-widget-header ui-corner-all")
                .prepend("<span class='ui-icon ui-icon-minusthick'></span>")
                .end()
                .find(".card-content");
        
            $(".card-header .ui-icon").click(function() {
                $(this).toggleClass("ui-icon-minusthick").toggleClass("ui-icon-plusthick");
                $(this).parents(".card:first").find(".card-content").toggle();
            });
        },
        decoNewCard: function(inList) {
            inList.find(".card").first().addClass("ui-widget ui-widget-content ui-helper-clearfix ui-corner-all")
                .find(".card-header")
                .addClass("ui-widget-header ui-corner-all")
                .prepend("<span class='ui-icon ui-icon-minusthick'></span>")
                .end()
                .find(".card-content");
        
            inList.find(".card").find(".card-header .ui-icon").first().click(function() {
                $(this).toggleClass("ui-icon-minusthick").toggleClass("ui-icon-plusthick");
                $(this).parents(".card:first").find(".card-content").toggle();
            });
        },        

    }
};

$(function() {
    $.fn.editable.defaults.mode = 'inline';
    List.card.decoCard({ newCard: 'FALSE' });
    List.form.firstTimeBind();
    List.list.bindListSortable();
    List.card.bindCardSortable();
    List.setListBoxMaxHeight();
    List.list.injectListPlaceholder();
    List.iniBodyWidth();
    
    //main events handler
    $('body').delegate('#add-list-btn', 'click', function() {
        List.list.appendByButton();
    });

    $('#zone').delegate('#add-card', 'click', function() {
        List.card.add($(this));
    });

    $('#zone').delegate('.add-list-placeholder', 'click', function() {
        List.list.appendByPlaceholder($(this));
    });

    $(window).resize(function() { 
        List.setListBoxMaxHeight(); 
    });

    //ajax emulation
    $.mockjax({
        url: '/post',
        responseTime: 200,
        response: function(settings) {
            console.log(settings);
        }
    });

});