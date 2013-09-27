var api = '';
var appConfig = {
    zone: '#zone',
    card: '.card',
    listWidth: 400,
    placeholderWidth: 314,
    adjustBodyOffset: 340,
    cardPlaceholderWidth: 300,
    maxList: 2,
    enableXeditableRequest: true,
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
                        "<td class='address'>" + "</td>" + 
                    "</tr>" + 
                    "<tr>" + 
                        "<td>" + "經緯度 </td>" + 
                        "<td class='latlng'>" + "</td>" + 
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
        var listPlaceholderWidth = function(){
            var CurrentPlaceholderWidth = $('.add-list-placeholder')[0].offsetWidth;
            var width = ( CurrentPlaceholderWidth === 'undefined' ? appConfig.placeholderWidth : CurrentPlaceholderWidth );  
            return width;
        };
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
        if (nextElementCount >= 1) $(appConfig.zone).append($('.add-list-placeholder')); //move listplaceholder to default position
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
                    var thisList = $(this).parents('.list');
                    var inputText = $(this).siblings().find('input');  //  find x-editable form after shown event, $(this) == $(e.currentTarget).siblings()... 

                    $(thisList).find('.in-list').sortable( "disable" );
                });

                $(thisList).find('.list-title, .card-title, .address, .latlng').on('hidden', function(e, reason) {
                    var thisList = $(this).parents('.list');
                    $(thisList).find('.in-list').sortable( "disable" );

                    if ( $(thisList).find('.card-content td').hasClass('editable-open'))
                        $(thisList).find('.in-list').sortable('disable');
                    else
                        $(thisList).find('.in-list').sortable('enable');
                });
            }
        },
        bindNewCardForm: function(config) //only bind new(latest) list which placeholder was clicked
        {
            config.inList.find('.card').last().find('.address').editable({
                showbuttons: 'bottom'
            });
            config.inList.find('.card').last().find('.latlng').editable({
                showbuttons: 'bottom'
            }); 
            config.inList.find('.card').last().find('.card-title').editable({
                showbuttons: 'bottom'
            });


            config.inList.find('.card').last().find('.card-title, .address, .latlng').on('shown', function(e, reason) {
                var thisList = $(this).parents('.list');
                var inputText = $(this).siblings().find('input');  //  find x-editable form after shown event, $(this) == $(e.currentTarget).siblings()... 

                thisList.find('.in-list').sortable("disable");
            });

            config.inList.find('.card').last().find('.card-title, .address, .latlng').on('hidden', function(e, reason) {
                var thisList = $(this).parents('.list');
                $(thisList).find('.in-list').sortable( "disable" );

                if (thisList.find('.card-content td').hasClass('editable-open'))
                    thisList.find('.in-list').sortable('disable');
                else
                    thisList.find('.in-list').sortable('enable');
            });
        },
        bindNewListForm: function(config)
        {
            config.list.find('.list-title').editable({                
                url: api + 'demo',
                ajaxOptions: {
                    type: 'put',
                    dataType: 'json'
                },
                send: 'always',
                params:{
                    'sampledata': 'yooooo'
                },
                showbuttons: 'bottom'
            });            
        },
    },
    list:
    {
        appendByButton: function() {
            $(appConfig.zone).append(appConfig.listDom);
            var lastList = $(appConfig.zone).find('.list').last();
            var lastInList = $(lastList).find('in-list');
            var lastListObj = { list: lastList, inList: lastInList };            

            List.setListBoxMaxHeight();
            List.form.bindNewListForm(lastListObj);
            List.card.bindCardSortable();
            List.adjustBodyWidth(appConfig.adjustBodyOffset);
        },
        appendByPlaceholder: function(listPlaceholderPos){
            listPlaceholderPos.replaceWith(appConfig.listDom);
            var lastList = $(appConfig.zone).find('.list').last();
            var lastInList = $(lastList).find('in-list');
            var lastListObj = { list: lastList, inList: lastInList };
            
            List.setListBoxMaxHeight();
            List.form.bindNewListForm(lastListObj);
            List.card.bindCardSortable();
            List.list.injectListPlaceholder();            
            List.adjustBodyWidth(appConfig.adjustBodyOffset);
        },appendByLoading: function()
        {
            var lastList = $(appConfig.zone).find('.list').last();            
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
            $(appConfig.zone).append(appConfig.listPlaceholder);
            //listplaceholder events handler
            $(appConfig.zone).delegate('.add-list-placeholder', 'mouseover', function() {
                $(appConfig.zone).sortable('disable');
                List.rePosAddListPlaceholder(); //move listplaceholder to default position
            });
            $(appConfig.zone).delegate('.add-list-placeholder', 'mouseout', function() { 
                $(appConfig.zone).sortable('enable');
            });
            $(appConfig.zone).delegate('.add-list-placeholder', 'click', function() { 
                $(appConfig.zone).sortable('enable');
            });
        }
    },
    card: 
    {
        add: function(addCardElement)
        {
            var thisInList = addCardElement.parent().find('.in-list');
            thisInList.find('.block').before(appConfig.cardDom);
            List.card.decoCard({
                newCard: 'TRUE',
                whichInlist: thisInList //current .in-list
            });
            List.form.bindNewCardForm({ inList: thisInList });           
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
                    List.form.bindNewCardForm({ inList: thisInList });
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
        decoNewCard: function(inList) 
        {
            inList.find('.card').last().addClass('ui-widget ui-widget-content ui-helper-clearfix ui-corner-all')
                .find('.card-header')
                .addClass('ui-widget-header ui-corner-all')
                .prepend("<span class='ui-icon ui-icon-minusthick'></span>")
                .end()
                .find('.card-content');
        
            inList.find('.card').find('.card-header .ui-icon').first().click(function() {
                $(this).toggleClass('ui-icon-minusthick').toggleClass('ui-icon-plusthick');
                $(this).parents('.card:first').find('.card-content').toggle();
            });
        },        
    },
    data:
    {
        getPlanItems: function()
        {
           try { 
                $.getJSON( api + 'dogman/plans/1/all', function( data ) {             
                    localStorage.tmpPlanData = JSON.stringify(data['items']);
                    console.log('fetching data result:');
                    $.each( data['items'], function( key, val ) { 
                        console.log(key, val);
                    });
                });
                var result = JSON.parse(localStorage.tmpPlanData); localStorage.tmpPlanData = '';
                return result;
            }catch( err ){
                console.log('fetching plandata faild');
            }
        }
    }
};

$(function() {
    var planData = List.data.getPlanItems();

    $.fn.editable.defaults.mode = 'inline'; 
    List.fadeInBackgroundImg();
    List.form.firstTimeBind();
    List.list.bindListSortable();
    List.card.bindCardSortable();
    List.card.decoCard({ newCard: 'FALSE' });
    List.setListBoxMaxHeight();
    // List.list.injectListPlaceholder();
    List.iniBodyWidth();
    

    //main events handler
    $('body').delegate('#add-list-btn', 'click', function() { List.list.appendByButton(); });
    $(appConfig.zone).delegate('.add-list-placeholder', 'click', function() { List.list.appendByPlaceholder($(this)); });
    $(appConfig.zone).delegate('#add-card', 'click', function() { List.card.add($(this)); });
    $(appConfig.zone).delegate('#add-card', 'mouseover', function(){ $(appConfig.zone).sortable('disable'); });
    $(appConfig.zone).delegate('#add-card', 'mouseout', function(){ $(appConfig.zone).sortable('enable'); });
    $(window).resize(function() { List.setListBoxMaxHeight(); });

    //test
    // window.dog = 'yooooooooo';
    // var Item = Backbone.Model.extend({});    
    // var Plan = Backbone.Collection.extend({
    //   model: Item,
    //   url: api + 'dogman/plans/1'
    // });
    // var plan = new Plan();
    // // plan.on('sync', function(item){ console.log('sync trigger',item) });
    // plan.on('remove', function(item){ console.log('model removed',item); }); 
    // plan.on('change', function(item){ console.log('item changed',item); });
    // plan.fetch();
    
});