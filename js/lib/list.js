var appConfig = {
    zone: '#zone',
    card: '.card',
    listWidth: 400,
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
        var listWidth = $('.list')[0].offsetWidth;
        var listPlaceholderWidth = $('.add-list-placeholder')[0].offsetWidth;
        var totalListsWidth = $('.list')[0].offsetWidth * $('.list').length;
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
    form:
    {
        loopBind: function(){
            var n = $('.list').length;
            for(var i = 0; i <= n; i++)
            {
                var thisList = $('.list')[i];
                $(thisList).find('.address, .latlng, .card-title, .list-title').editable({
                    showbuttons: 'bottom'
                });

                $(thisList).find('.list-title, .card-title, .address, .latlng').on('shown', function(e, reason) {
                    $(thisList).find('.in-list').sortable( "disable" ); 

                    var inputText = $(this).siblings().find('input');  //  find x-editable form after shown event, $(this) == $(e.currentTarget).siblings()... 
                    var hasCache = $(this).attr('data-cache');
                    if (hasCache) inputText.val($(this).attr('data-cache'));
                    
                    inputText.on('keyup mouseup', function(e){ 
                        localStorage.listFormInputCache = $(this).val(); 
                    });
                });

                $(thisList).find('.list-title, .card-title, .address, .latlng').on('hidden', function(e, reason) {
                        console.log(reason);
                        if ( $(thisList).find('.card-content td').hasClass('editable-open'))
                             $(thisList).find('.in-list').sortable('disable');
                        else
                             $(thisList).find('.in-list').sortable('enable');
               
                        if (reason === 'nochange') console.log('nochange');
        
                        if (reason === 'onblur' || reason === 'manual') {
                            $(e.currentTarget).attr('data-cache', localStorage.listFormInputCache);
                        }
            
                    if( reason === 'cancel') {
                        localStorage.listFormInputCache = '';
                        $(this).removeAttr('data-cache');            
                    }
                });
            }
        },
        bindForm: function() 
        {
            console.log('bindForm');
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
                $('.in-list').sortable( "disable" ); 

                var inputText = $(this).siblings().find('input');  //  find x-editable form after shown event, $(this) == $(e.currentTarget).siblings()... 
                var hasCache = $(this).attr('data-cache');
                if (hasCache) inputText.val($(this).attr('data-cache'));
                
                inputText.on('keyup mouseup', function(e){ 
                    localStorage.listFormInputCache = $(this).val(); 
                });
            });
        
            $('.list-title, .card-title, .address, .latlng').on('hidden', function(e, reason) {
                console.log(reason);
                if ($('.card-content td').hasClass('editable-open'))
                    $('.in-list').sortable('disable');
                else
                    $('.in-list').sortable('enable');
        
                if (reason === 'nochange') console.log('nochange');
     
                if (reason === 'onblur' || reason === 'manual') {
                    $(e.currentTarget).attr('data-cache', localStorage.listFormInputCache);
                }
        
                if( reason === 'cancel') {
                    localStorage.listFormInputCache = '';
                    $(this).removeAttr('data-cache');            
                }
            });
        },
        bindNewForm: function(config) 
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


            config.inList.find('.card-title, .address, .latlng').on('shown', function(e, reason) {
                config.inList.sortable("disable");

                var inputText = $(this).siblings().find('input');  //  find x-editable form after shown event, $(this) == $(e.currentTarget).siblings()... 
                var hasCache = $(this).attr('data-cache');
                if (hasCache) inputText.val($(this).attr('data-cache'));
                
                inputText.on('keyup mouseup', function(e){ 
                    localStorage.listFormInputCache = $(this).val(); 
                });                
            });

            config.inList.find('.card-title, .address, .latlng').on('hidden', function(e, reason) {
                if (config.inList.find('.card-content td').hasClass('editable-open'))
                    config.inList.sortable('disable');
                else
                    config.inList.sortable('enable');

                if (reason === 'nochange') console.log('nochange');
     
                if (reason === 'onblur' || reason === 'manual') {
                    $(e.currentTarget).attr('data-cache', localStorage.listFormInputCache);
                }
        
                if( reason === 'cancel') {
                    localStorage.listFormInputCache = '';
                    $(this).removeAttr('data-cache');            
                }                
            });
        

        }
    },
    list:
    {
        add: function() {
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
            // List.form.bindForm(); //TESTING
            List.form.bindNewForm(lastListObj);
        },
        append: function(listPlaceholderPos){
            List.adjustBodyWidth(appConfig.adjustBodyOffset);        
            listPlaceholderPos.replaceWith(appConfig.listDom);
            var lastList = $(appConfig.zone).find('.list').last(); console.log(lastList);
            var lastInList = $(lastList).find('in-list');
            var lastListObj = {
                list: lastList,
                inList: lastInList
            };
            console.log(lastListObj);
            List.card.bindCardSortable();
            // List.form.bindForm(); testing
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
                }
            });
        },
        injectListPlaceholder: function() {
            $('#zone').append(appConfig.listPlaceholder);
            //listplaceholder events handler
            $('#zone').delegate('.add-list-placeholder', 'mouseover', function() {
                $('#zone').sortable('disable');
                var nextElementCount = $(this).next().siblings().length;                
                if (nextElementCount >= 1) $('#zone').append($(this)); //move listplaceholder to default position
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
                    $(ui.item.context).addClass('card-skew')
        
                },
                stop: function(event, ui) {
                    $('.card').css('cursor', 'pointer');
                    $(ui.item.context).removeClass('card-skew');
                    var thisInList = $(ui.item.context).parents('.in-list');
                    List.form.bindNewForm({ inList: thisInList });
                    // List.form.bindForm();  
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
    // List.form.bindForm(); //testing
    List.form.loopBind();
    List.setListBoxMaxHeight();
    List.list.injectListPlaceholder();
    List.iniBodyWidth();

    //main events handler
    $('body').delegate('#add-list-btn', 'click', function() {
        List.list.add();
    });

    $('#zone').delegate('#add-card', 'click', function() {
        List.card.add($(this));
    });

    $('#zone').delegate('.add-list-placeholder', 'click', function() {
        List.list.append($(this));
    });

    $(window).resize(function() { 
        List.setListBoxMaxHeight(); 
    });

});