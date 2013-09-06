var appConfig = {
    zone: '#zone',
    card: '.card',
    listWidth: 400,
    adjustBodyOffset: 340,
    cardPlaceholderWidth: 300,
    inputCache: '',
    listDom: "<div class='list'>" + 
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
    cardDom: "<div class='card'>" + 
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
            $('body').css('width', document.body.clientWidth + 0);
        }else{
            $('body').css('width', parseInt($('body').css('width'), 10) + nPixels);
        }
        console.log($('body').css('width'));
    },
    iniListBoxMaxHeight: function()
    {
        //when to show scrollbar
        // $('.list-box').css('max-height', document.body.scrollHeight - 150);
        var offSet = ( $('.list').position().top + $('.list-box').position().top ) * 2;
        $('.list-box').css('max-height', documnet.documentElement.clientHeight - offSet);
    },
    form:
    {
        bindForm: function() 
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
                showbuttons: 'bottom'
            });
        
            $('.list-title, .card-title, .address, .latlng').on('shown', function(e, reason) {
                $('.in-list').sortable("disable");
                var inputText = $(this).siblings().find('input');  //  find x-editable form after shown event, $(this) == $(e.currentTarget).siblings()... 
                var hasCache = $(this).attr('data-cache');
                if (hasCache) inputText.val($(this).attr('data-cache'));
                
                inputText.on('keyup mouseup', function(e){ 
                    localStorage.tmp = $(this).val(); 
                });
            });
        
            $('.list-title, .card-title, .address, .latlng').on('hidden', function(e, reason) {
                console.log(reason);
                if ($('.card-content td').hasClass('editable-open'))
                    $('.in-list').sortable('disable');
                else
                    $('.in-list').sortable('enable');
        
                if (reason === 'nochange') {
                    console.log('nochange');
                }
        
                if (reason === 'onblur' || reason === 'manual'){
                    $(e.currentTarget).attr('data-cache', localStorage.tmp);
                }
        
                if( reason === 'cancel'){
                    localStorage.tmp = '';
                    $(this).removeAttr('data-cache');            
                }
            });
        },
        bindNewForm: function(thisInList) 
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
                showbuttons: 'bottom'
            });
        
            thisInList.find('.card-title, .address, .latlng').on('hidden', function(e, reason) {
                if (thisInList.find('.card-content td').hasClass('editable-open'))
                    thisInList.sortable('disable');
                else
                    thisInList.sortable('enable');
            });
        
            thisInList.find('.card-title, .address, .latlng').on('shown', function(e, reason) {
                thisInList.sortable("disable");
            });
        }
    },
    list:
    {
        add: function() {
            List.adjustBodyWidth(appConfig.adjustBodyOffset);
            $(appConfig.zone).append(appConfig.listDom);
            List.card.bindCardSortable();
            List.iniListBoxMaxHeight();
            List.form.bindForm();
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
                }
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
            // bindNewForm(thisInList);
            List.form.bindForm();            
        },        
        bindCardSortable: function()
        {
            $(".in-list").sortable({
                cancel: '.list-title-banner',
                connectWith: ".in-list",
                sort: function(event, ui) {
                    $('.card').css('cursor', '-webkit-grabbing').css('cursor', '-moz-grabbing');
                    $('.ui-sortable-placeholder').css('height', ui.item.context.offsetHeight);
                    $(ui.item.context).addClass('card-skew')
        
                },
                stop: function(event, ui) {
                    $('.card').css('cursor', 'pointer');
                    $(ui.item.context).removeClass('card-skew');
                    var thiInList = $(ui.item.context).parents('.in-list');
                    List.form.bindNewForm(thiInList);
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
    List.list.bindListSortable();
    List.card.bindCardSortable();
    List.card.decoCard({ newCard: 'FALSE' });
    List.form.bindForm();
    List.iniListBoxMaxHeight();

    //main event handler
    $('body').delegate('#add-list-btn', 'click', function() {
        List.list.add();
    });

    $('#zone').delegate('#add-card', 'click', function() {
        List.card.add($(this));
    });

    $(window).resize(function() { 
        List.iniListBoxMaxHeight(); 
    });

});