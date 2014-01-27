var Api = '';
var User = {};
var Model = {};
var AppConfig = {
    zone: null,
    card: '.card',
    listWidth: 400,
    placeholderWidth: 314,
    adjustBodyOffset: 400,
    cardPlaceholderWidth: 400,
    cardInfoColWidth: 64,
    maxList: 2,
    bg: 'http://i.imgur.com/XEtgQ.jpg',
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
    test: function(){
        console.log('list test: ', User.name);
        console.log(AppConfig.zone);
    },
    moveModel: function(id ,originModel, newModel) {
        Object.keys(originModel).forEach(function(key) {
            if ( originModel[key].id == id) {
               newModel[Object.keyeys(newModel).length] = originModel[key];
               delete originModel[key];
            }
        });
    },
    form:
    {
        bindAll: function(){ //loop DOM to bind each list
            var userObj = {
                    name: User.name,
                    id: User.id,
                    tokenKey: User.tokenKey
                };                
            $('.list-title').editable({
                url: Api + 'planName',
                ajaxOptions: {type: 'put', dataType: 'json'},
                params:{ user: userObj },
                success: function(){ 
                    //Model update
                },
                error: function(err){ return 'update error'; },
                showbuttons: 'right'                
            });            
            $('.card-title').editable({
                url: Api + 'itemName',
                ajaxOptions: {type: 'put', dataType: 'json'},
                params:{user: userObj },
                success: function(){
                    //Model update
                },
                error: function(err){ return 'update error'; },
                showbuttons: 'right'
            });
            $('.info-content').editable({
                type: 'textarea',
                inputclass: 'input-info-content',
                showbuttons: 'bottom'
            });
            $('.latlng').editable({
                showbuttons: 'bottom'
            });

            var n = $('.list').length;
            for(var i = 0; i <= n; i++)
            {
                var thisList = $('.list')[i];

                $(thisList).find('.list-title, .card-title, .info-content, .latlng').on('shown', function(e, reason) {
                    var thisList = $(this).parents('.list');
                    var inputText = $(this).siblings().find('input');  //  find x-editable form after shown event, $(this) == $(e.currentTarget).siblings()... 
                    var dw = $(this).parents('.card-content').width() - AppConfig.cardInfoColWidth;
                    var input = $('.input-' + e.currentTarget.classList[0]);    //.input-info-content .input-latlng ...
                    console.log('bindallINputShow:', e.currentTarget.classList[0], input);
                    input.width(dw);
                    $(thisList).find('.in-list').sortable( "disable" );                    
                });

                $(thisList).find('.list-title, .card-title, .info-content, .latlng').on('hidden', function(e, reason) {
                    var thisList = $(this).parents('.list');
                    $(thisList).find('.in-list').sortable( "disable" );

                    if ( $(thisList).find('.card-content td').hasClass('editable-open'))
                        $(thisList).find('.in-list').sortable('disable');
                    else
                        $(thisList).find('.in-list').sortable('enable');
                });
            }
        },
        bindThisCardForm: function()
        {

        },
        bindNewCardForm: function()
        {

        },
        bindAddedCardForm: function(config) //only bind new(latest) list which card is last
        {
            config.inList.find('.card').last().find('.info-content').editable({
                  showbuttons: 'bottom'
            });
            config.inList.find('.card').last().find('.latlng').editable({
                showbuttons: 'bottom'
            }); 
            config.inList.find('.card').last().find('.card-title').editable({
                showbuttons: 'bottom'
            });


            config.inList.find('.card').last().find('.card-title, .info-content, .latlng').on('shown', function(e, reason) {
                var thisList = $(this).parents('.list');
                var inputText = $(this).siblings().find('input');  //  find x-editable form after shown event, $(this) == $(e.currentTarget).siblings()... 

                thisList.find('.in-list').sortable("disable");
            });

            config.inList.find('.card').last().find('.card-title, .info-content, .latlng').on('hidden', function(e, reason) {
                var thisList = $(this).parents('.list');
                $(thisList).find('.in-list').sortable( "disable" );

                if (thisList.find('.card-content td').hasClass('editable-open'))
                    thisList.find('.in-list').sortable('disable');
                else
                    thisList.find('.in-list').sortable('enable');
            });
        },
        bindNewListForm: function(config, planId)
        {
            config.list.find('.list-title').editable({                
                url: Api + 'demo',
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
        appendByButton: function(planId) 
        {
            AppConfig.zone.append(AppConfig.listDom);
            var lastList = AppConfig.zone.find('.list').last();
            var lastInList = $(lastList).find('in-list');
            var lastListObj = { list: lastList, inList: lastInList, planId: planId };            

            // List.form.bindNewListForm(lastListObj);
            // List.card.bindCardSortable();
            // List.uipatch.setListBoxMaxHeight();
            // List.uipatch.adjustBodyWidth(AppConfig.adjustBodyOffset);
        },
        appendByPlaceholder: function(listPlaceholderPos, planId){
            listPlaceholderPos.replaceWith(AppConfig.listDom);
            var lastList = AppConfig.zone.find('.list').last();
            var lastInList = $(lastList).find('in-list');
            var lastListObj = { list: lastList, inList: lastInList, planId: planId };
            
            // List.form.bindNewListForm(lastListObj);
            // // List.form.bindAddedCardForm({ inList: thisInList });
            // List.form.bindAll();
            // List.card.bindCardSortable();
            // List.list.injectListPlaceholder();            
            // List.uipatch.setListBoxMaxHeight();
            // List.uipatch.adjustBodyWidth(AppConfig.adjustBodyOffset);
        },
        appendByLoading: function(planId)
        {
            // console.log('appendByLoading:', AppConfig.zone);
            console.log('ck when call appendbyLoading', Model);
            //render and inject list
            AppConfig.zone.append(this.renderNewList( Model.plans.get(planId).toJSON()) );

            var cardViews = this.renderNewItems( Model.plans.get(planId).items.toJSON() );
            var lastList = AppConfig.zone.find('.list').last();
            var lastInList = lastList.find('.in-list');
            var lastListObj = { list: lastList, inList: lastInList, planId: planId };

            //append list           
            $(lastInList).prepend(cardViews);
            //deco/patch and bind:
            List.list.bindListSortable();
            List.card.bindCardSortable();
            List.card.decoCard({ addedCard: 'FALSE', list: lastList });
            // List.form.bindNewListForm(l  tListObj, planId);
            //binde old card
            List.form.bindAll(); //testing 

            List.uipatch.applyNewListWidth();
            List.uipatch.applyNewCardPropColWidth();
            List.uipatch.setListBoxMaxHeight();
            List.uipatch.adjustBodyWidth(AppConfig.adjustBodyOffset); //testing
        },
        renderNewList: function(plan)
        {
            var listTemp = 
                "<div class='list'>" + 
                    "<div class='list-title-banner'>" + 
                        "<span class='list-title' data-pk=" + plan.id + '>' + plan.name + "</span>" +  //@@ should put plan's title
                    "</div>" + 
                    "<div class='list-box'>" + 
                        "<div class='in-list clearfix'>" +
                            "<div class='block'></div>" + 
                        '</div>' + 
                    '</div>' + 
                    "<a id='add-card' href='#'>Add a card…</a>" + 
                '</div>';
            return listTemp;
        },
        renderNewItems: function(item)
        {
            console.log('check Model before render items', item);         
            var cardViews = [];
            cardViews = _.map(item, function(item){
                var view =
                    "<div class='card'>" + 
                        "<div class='card-header'>" + 
                        "<span class='card-title' data-pk=" + item.id + '>' + item.item_name + '</span>' + 
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
                                        "<td id=item-col>" + item.info_type + "</td>" + 
                                        "<td id=value-col class='info-content'>" + item.info_content + "</td>" + 
                                    "</tr>" + 
                                    "<tr>" + 
                                        "<td>" + "位置</td>" + 
                                        "<td class='latlng'>" + item.lat + ',' + item.lng + "</td>" + 
                                    "</tr>" + 
                            "</tbody>" + 
                            "</table>" + 
                        "</div>" + 
                    "</div>";
                return view;
            });
            console.log('_.map', cardViews);
            return cardViews;
        },
        bindListSortable: function()
        {
            AppConfig.zone.sortable({
                    // disabled: true,
                    delay: 150,
                    sort: function(event, ui) {
                        $('.ui-sortable-placeholder').css('height', ui.item.context.offsetHeight);
                        $('.ui-sortable-placeholder').css('width', ui.item.context.offsetWidth);
                        $(ui.item.context).addClass('list-sorting-skew list-sorting-shadow');
                    },
                    stop: function(event, ui) {
                        $(ui.item.context).removeClass('list-sorting-skew list-sorting-shadow');
                        // List.uipatch.rePosAddListPlaceholder();    
                    }
            });
        },
        injectListPlaceholder: function() {
            AppConfig.zone.append(AppConfig.listPlaceholder);
            //listplaceholder events handler
            AppConfig.zone.delegate('.add-list-placeholder', 'mouseover', function() {
                AppConfig.zone.sortable('disable');
                List.uipatch.rePosAddListPlaceholder(); //move listplaceholder to default position
            });
            AppConfig.zone.delegate('.add-list-placeholder', 'mouseout', function() { 
                AppConfig.zone.sortable('enable');
            });
            AppConfig.zone.delegate('.add-list-placeholder', 'click', function() { 
                AppConfig.zone.sortable('enable');
            });
        }
    },
    card: 
    {
        add: function(addCardElement)
        {
            var thisInList = addCardElement.parent().find('.in-list');
            thisInList.find('.block').before(AppConfig.cardDom);
            List.card.decoCard({
                addedCard: 'TRUE',
                whichInlist: thisInList //current .in-list
            });
            // List.form.bindAddedCardForm({ inList: thisInList });  //testing
            // List.form.bindAll();
        },        
        bindCardSortable: function()
        {
            $(".in-list").sortable({
                cancel: '.list-title-banner', //may not used anymore
                connectWith: ".in-list",
                delay: 150,
                sort: function(event, ui) {
                    $('.card').css('cursor', '-webkit-grabbing').css('cursor', '-moz-grabbing');
                    $('.ui-sortable-placeholder').css('width', ui.item.context.offsetWidth - 10);
                    $('.ui-sortable-placeholder').css('height', ui.item.context.offsetHeight);
                    $(ui.item.context).addClass('card-skew');
                },
                stop: function(event, ui) {
                    $('.card').css('cursor', 'pointer');
                    $(ui.item.context).removeClass('card-skew');
                    var thisInList = $(ui.item.context).parents('.in-list');
                    // List.form.bindAddedCardForm({ inList: thisInList }); //testing
                    List.form.bindAll();
                }
            });
        },        
        decoCard: function(config) 
        {
            if (config.addedCard === 'FALSE' || Object.keys(config).length === 0)
                this.decoOldCard(config.list);
            else
                this.decoAddedCard(config.whichInlist);
        },
        decoOldCard: function(list)
        {
            console.log('deco decoOldCard', list);
            list.find(".card").addClass("ui-widget ui-widget-content ui-helper-clearfix ui-corner-all")
                .find(".card-header")
                .addClass("ui-widget-header ui-corner-all")
                .prepend("<span class='ui-icon ui-icon-minusthick'></span>")
                .end()
                .find(".card-content");
        
            list.find(".card-header .ui-icon").click(function() {
                $(this).toggleClass("ui-icon-minusthick").toggleClass("ui-icon-plusthick");
                $(this).parents(".card:first").find(".card-content").toggle();
            });
        },
        decoAddedCard: function(inList) 
        {
            console.log('decoAddedCard:', inList)
            inList.find('.card').last().addClass('ui-widget ui-widget-content ui-helper-clearfix ui-corner-all')
                .find('.card-header')
                .addClass('ui-widget-header ui-corner-all')
                .prepend("<span class='ui-icon ui-icon-minusthick'></span>")
                .end()
                .find('.card-content');
        
            inList.find('.card').find('.card-header .ui-icon').last().click(function() {
                $(this).toggleClass('ui-icon-minusthick').toggleClass('ui-icon-plusthick');
                $(this).parents('.card:first').find('.card-content').toggle();
            });
        }
    },
    uipatch:
    {
        adjustBodyWidth: function(nPixels) 
        {
            if (document.body.style.width === '') {
                $('body').width(document.body.clientWidth + 0); //document.body.style.width === will be set to 0 not ''
            }else{
                console.log('adjust body width right now');
                if( this.isZoneOverFlow() === true) 
                    $('body').width( parseInt($('body').width(), 10) + nPixels); //right + left margins = 20
            }
            console.log($('body').css('width'));
        },
        applyNewCardPropColWidth: function()
        {
            $('.list td#item-col').width(AppConfig.cardInfoColWidth);
            // $('.list td#item-').width(AppConfig.cardInfoColWidth);
        },
        isZoneOverFlow: function()
        {
            var arrWidth = _.map( AppConfig.zone.children(), function(c){ return $(c).width() });
            var sum = _.reduce(arrWidth, function(memo, num){ return memo + num; }, 0);
            var totalZoneElWidth = sum + (arrWidth.length * 100); //threhold, should test this number from different kind of screen size 
                if ( totalZoneElWidth > parseInt(localStorage.clientWidth, 10) )
                    return true;
                else
                    return false;
            // var el = AppConfig.zone.children(), sum = 0;
            // for (i = 0; i <= el.size(); i++){ sum += $(el[i]).width(); } console.log(sum + (el.size() * 20) );
        },
        iniBodyWidth: function(){
            var listWidth = AppConfig.listWidth || $('.list')[0].offsetWidth;
            var listPlaceholderWidth = function() {
                var CurrentPlaceholderWidth = $('.add-list-placeholder')[0].offsetWidth;
                var width = ( CurrentPlaceholderWidth === 'undefined' ? AppConfig.placeholderWidth : CurrentPlaceholderWidth );  
                return width;
            };
            var listCount = ( $('.list').length === 0 ? 1 : $('.list').length );
            var totalListsWidth = listWidth * listCount;
            if( totalListsWidth + listPlaceholderWidth + 10 > document.body.clientWidth)
                $('body').css('width', parseInt($('body').css('width'), 10) + (document.body.clientWidth - totalListsWidth) );
        },
        setListBoxMaxHeight: function() //when to show scrollbar
        {
            var list = $('.list'), listBox = $('.list-box');
            if (! list ) return ;
            var offSet = ( ( list.length === 0 ? 0 : listBox.position().top) + listBox.position().top) * 2
            listBox.css('max-height', document.documentElement.clientHeight - offSet);
        },
        rePosAddListPlaceholder: function()
        {
            var nextElementCount = $('.add-list-placeholder').next().siblings().length;                
            if (nextElementCount >= 1) AppConfig.zone.append($('.add-list-placeholder')); //move listplaceholder to default position
        },
        applyNewListWidth: function()
        {
            if (AppConfig.listWidth) { $('.list').width(AppConfig.listWidth); }
        },
        fadeInBackgroundImg: function()
        {
            $('.background-img').animate({opacity: 0}, 0).css({'background-image': 'url('+ AppConfig.bg +')'}).animate({opacity: 1}, 500);
        },
        stricktSortMode: function(){
            AppConfig.zone.on('mouseover', '.list-title-banner', function(){ AppConfig.zone.sortable('enable'); })
            .on('mouseout', '.list', function(){ AppConfig.zone.sortable('disable'); })
            .on('mouseleave', '.list-title-banner', function(){ AppConfig.zone.sortable('disable'); });
        },
        scrollBarDragFix: function(){
            if( /Firefox/.test(navigator.userAgent) || /NET/.test(navigator.userAgent) ){
                console.log('ui strickt mode')
                this.stricktSortMode();
            }
        }
    },    
    data:
    {
        remove: function(obj , config){ //remove(obj, {id:127})
            return _.without(obj, _.findWhere(obj, config));
        },
        ini: function(){
            
        }
    }
};

Data = {
    plan: {
        fetch: function(userName) {
            var promise = $.Deferred();
             $.getJSON( Api + User.name + '/plans/', function(data){ promise.resolve(data); })
             .fail(function() { console.log('fetch plan info faild'); });
             return promise;
        }
    },
    item: {       
        fetch: function(planId) {        
            var url = Api + User.name +'/plans/' + planId + '/all';
            return $.getJSON(url, function(res){})
                    .fail(function(){ console.log('fetch plan faild'); });
        },
        fetchAll: function(userName) {
            var promise = $.Deferred();
            var url = Api + User.name + '/all';
            $.getJSON(url, function(res){ promise.resolve(res); })
            .fail(function(){
                console.log('fetchAll faild');
            });
            return promise;
        }
    } 
};

var Zone = {
    iniUI: function() {
        $('.close-alert').click(function(){ $('.alert').hide(); })
    }
};

var initialize = function(){
    AppConfig.zone = $('#zone');
    var userModel = $('#userModel');
    //prepare user data
    User = {
        name: userModel.find('div[data-name]').data('name'),
        id: userModel.find('div[data-id]').data('id'),
        tokenKey: userModel.find('div[data-tokenKey]').data('tokenkey')       
    };
    //prepare uipatch 
    $.fn.editable.defaults.mode = 'inline';
    List.uipatch.fadeInBackgroundImg();
    List.uipatch.scrollBarDragFix();    
    localStorage.clientWidth = document.body.clientWidth;
    Zone.iniUI();
};

$(function() {
    initialize();
    console.log(User);
    var planId = 1;

    //get all plandata of user and set Model
    var plans = new PlanItemsCollection();
    $.when(
        Data.plan.fetch(),
        Data.item.fetchAll()
    ).then(function(planData, itemData) {
        console.log('%c planData', 'background: #222; color: #bada55', planData);
        console.log('%c planData.result', 'background: #222; color: #bada55', planData.result);
        console.log('%c itemData', 'background: #222; color: #bada55', itemData);
        console.log('%c itemData.result', 'background: #222; color: #bada55', itemData.result);

        /* -----------------------------------------
        //  Model Structure:
        //  plans (PlanItemsCollection) 
        //     itemBox (ItemBox) 
        //         itemCol (ItemsCollection)
        ------------------------------------------*/
        itemData.result.forEach(function(itemSet) {
            var itemCol = new ItemsCollection(itemSet, {parse: true});
            console.log('result itemsSET: ', itemSet);
            var planObj = _.find(planData.result, function(planInfo){ return planInfo.id == itemSet.result.plan_id; });
            var itemBox = new ItemBox(planObj);
                itemBox.items = itemCol;
                plans.add(itemBox);
        });
        Model.plans = plans;
        List.list.appendByLoading(1);
        //begin render
    });

    //Zone.iniEvents
    AppConfig.zone.on('click', '.list #add-card', function() { List.card.add($(this)); })
        .on('mouseover','.ui-icon-minusthick, .ui-icon-plusthick', function(e){ $(e.currentTarget).parents().find('.in-list').sortable('disable')} )
        .on('mouseout','.ui-icon-minusthick, .ui-icon-plusthick', function(e){ $(e.currentTarget).parents().find('.in-list').sortable('enable')} )
    $(window).resize(function() { List.uipatch.setListBoxMaxHeight(); })
            .unload(function() {localStorage.clear(); });
});
