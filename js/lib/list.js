var Api = '';
var User = {
    name: 'dogman' //@@ get from DOM model
};
var Models = {};

var AppConfig = {
    zone: '#zone',
    card: '.card',
    listWidth: 400,
    placeholderWidth: 314,
    adjustBodyOffset: 400,
    cardPlaceholderWidth: 400,
    maxList: 2,
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
            console.log('bindALL CALLED');
            $('.info-content').editable({
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

                $(thisList).find('.list-title, .card-title, .info-content, .latlng').on('shown', function(e, reason) {
                    var thisList = $(this).parents('.list');
                    var inputText = $(this).siblings().find('input');  //  find x-editable form after shown event, $(this) == $(e.currentTarget).siblings()... 

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
                    tUpe: 'put',
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
            $(AppConfig.zone).append(AppConfig.listDom);
            var lastList = $(AppConfig.zone).find('.list').last();
            var lastInList = $(lastList).find('in-list');
            var lastListObj = { list: lastList, inList: lastInList, planId: planId };            

            // List.form.bindNewListForm(lastListObj);
            // List.card.bindCardSortable();
            // List.uipatch.setListBoxMaxHeight();
            // List.uipatch.adjustBodyWidth(AppConfig.adjustBodyOffset);
        },
        appendByPlaceholder: function(listPlaceholderPos, planId){
            listPlaceholderPos.replaceWith(AppConfig.listDom);
            var lastList = $(AppConfig.zone).find('.list').last();
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
            console.log('ck when call appendbyLoading',Models);
            //render and inject list
            $(AppConfig.zone).append(this.renderNewList(planId));

            var cardViews = this.renderNewItems(planId);
            var lastList = $(AppConfig.zone).find('.list').last();
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
            List.uipatch.adjustCardColWidth();
            List.uipatch.setListBoxMaxHeight();
            List.uipatch.adjustBodyWidth(AppConfig.adjustBodyOffset);
        },
        renderNewList: function(planId)
        {
            var listTemp = 
                "<div class='list'>" + 
                    "<div class='list-title-banner'>" + 
                        "<span class='list-title'>" + 'new list' + "</span>" +  //@@ should put plan's title
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
        renderNewItems: function(planId)
        {
            console.log('check Models before render items');
            console.dir( Models );
            planItemModel = Models['plan' + planId].items;            
            var cardViews = [];
            cardViews = _.map(planItemModel, function(item){
                var view =
                    "<div class='card'>" + 
                        "<div class='card-header'>" + 
                        "<span class='card-title'>" + item.item_name + '</span>' + 
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
            $(AppConfig.zone).on('mouseenter', '.list-title-banner', this.sortableState );
            $(AppConfig.zone).on('mouseleave', '.list-title-banner', function(){ $(AppConfig.zone).sortable('disable'); } );
        },
        sortableState: function(){
            $(AppConfig.zone).sortable({
                    sort: function(event, ui) {
                        $('.ui-sortable-placeholder').css('height', ui.item.context.offsetHeight);
                        $(ui.item.context).addClass('list-sorting-skew list-sorting-shadow');
                    },
                    stop: function(event, ui) {
                        $(ui.item.context).removeClass('list-sorting-skew list-sorting-shadow');
                        // List.uipatch.rePosAddListPlaceholder();
                        $(AppConfig.zone).on('mouseover', '.list-title-banner', function(){ $(AppConfig.zone).sortable('enable'); } );
                    }
            });            
        },
        injectListPlaceholder: function() {
            $(AppConfig.zone).append(AppConfig.listPlaceholder);
            //listplaceholder events handler
            $(AppConfig.zone).delegate('.add-list-placeholder', 'mouseover', function() {
                $(AppConfig.zone).sortable('disable');
                List.uipatch.rePosAddListPlaceholder(); //move listplaceholder to default position
            });
            $(AppConfig.zone).delegate('.add-list-placeholder', 'mouseout', function() { 
                $(AppConfig.zone).sortable('enable');
            });
            $(AppConfig.zone).delegate('.add-list-placeholder', 'click', function() { 
                $(AppConfig.zone).sortable('enable');
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
            List.form.bindAll();          
        },        
        bindCardSortable: function()
        {
            $(".in-list").sortable({
                cancel: '.list-title-banner',
                connectWith: ".in-list",
                sort: function(event, ui) {
                    $('.card').css('cursor', '-webkit-grabbing').css('cursor', '-moz-grabbing');
                    $('.ui-sortable-placeholder').css('width', ui.item.context.offsetWidth - 10);
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
        }
    },
    uipatch:
    {
        adjustBodyWidth: function(nPixels) 
        {
            if (document.body.style.width === '') {
                $('body').width(document.body.clientWidth + 0); //document.body.style.width === will be set to 0 not ''
            }else{
                console.log('2');
                if(this.isZoneOverFlow) $('body').width( parseInt($('body').width(), 10) + nPixels); //right + left margins = 20
            }
            console.log($('body').css('width'));
        },
        adjustCardColWidth: function()
        {
            $('.list td#item-col').width('64');
        },
        isZoneOverFlow: function()
        {
            var arrWidth = _.map( $(AppConfig.zone).children(), function(c){ return $(c).width() });
            var sum = _.reduce(arrWidth, function(memo, num){ return memo + num; }, 0);
            var totalZoneElWidth = sum + (arrWidth.length * 20); console.log(totalZoneElWidth);
                if ( totalZoneElWidth > parseInt(localStorage.clientWidth, 10) )
                    return true;
                else
                    return false;
            // var el = $(AppConfig.zone).children(), sum = 0;
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
            var offSet = ( ( list.length === 0 ? 0 : listBox.position().top ) + listBox.position().top ) * 2
            listBox.css('max-height', document.documentElement.clientHeight - offSet);
        },
        rePosAddListPlaceholder: function()
        {
            var nextElementCount = $('.add-list-placeholder').next().siblings().length;                
            if (nextElementCount >= 1) $(AppConfig.zone).append($('.add-list-placeholder')); //move listplaceholder to default position
        },
        applyNewListWidth: function()
        {
            if (AppConfig.listWidth) { $('.list').width(AppConfig.listWidth); }
        },
        fadeInBackgroundImg: function()
        {
            $('.background-img').animate({opacity: 0}, 0).css({'background-image': 'url(http://i.imgur.com/XEtgQ.jpg)'}).animate({opacity: 1}, 500);
        }
    },    
    data:
    {
        remove: function(obj , config){ //remove(obj, {id:127})
            return _.without(obj, _.findWhere(obj, config));
        },
        dataReady: function(planId){
            var result = JSON.parse(localStorage.tmpPlanData);
            Model = result;
            console.log(result);
            List.list.appendByLoading(planId); 
        }
    }
};

function pi(){
    var planitem = this;
    var models = {};

    this.model = function(){ return planitem.models;};
    this.fetch = function(){
        var url = Api + User.name +'/plans/' + 1 + '/all';
        $.when( $.getJSON(url, function(res){}) ).then(function(res){
            planitem.saveModel(res);
        });

    };
    this.saveModel = function(res){
        planitem.models = res;
    }
    this.fetch();
}

Plan = 
{
    fetch: function(userName){
       var userName = (userName === 'undefined' ? User.name : 'dogman'); //@@ test
        return $.getJSON( Api + User.name + '/plans/', function(data){
            // $.each(data, function(key, val ) { console.log(key, val); });
            localStorage[userName + '.plans'] = JSON.stringify(data);            
        })
        .fail(function() {
            console.log('fetch plan info faild');
        });
    }
};


PlanItem =
{       
    fetch: function(planId) {        
        var promise = $.Deferred();
        var url = Api + User.name +'/plans/' + planId + '/all';
        $.getJSON(url, function(res){
            promise.resolve(res);
        }).fail(function(){
            console.log('fetch plan faild');
        });
        return promise;
    }
};

var initialize = function(){
    $.fn.editable.defaults.mode = 'inline';
    List.uipatch.fadeInBackgroundImg();
    localStorage.clientWidth = document.body.clientWidth;
    // Model[User.name] = {};
};

$(function() {
    initialize();

    var planId = 1;  //@@should get form jquery or other model

    // $.when( //single plan way
    //     Plan.fetch(),
    //     PlanItem.fetch(planId)
    // ).then(function(planRes, itemRes){
    //     Models['plans'] = planRes;
    //     Models['plan' + planId] = itemRes;
    //     List.list.appendByLoading(planId);
    // });

    var plans = Plan.fetch()     
    plans.done(function(res) { 
        Models['plans'] = res;
        for(i in Models['plans']) {
            var planId = Models['plans'][i].id;
            var items = PlanItem.fetch(planId).done(function(res) {
                Models['plan' + res.plan_id] = res;
                List.list.appendByLoading( res.plan_id);
                //show chose list on start
            });
        }
    });

    //deco/bind/patch
    //main events handler
    //$('body').delegate('#add-list-btn', 'click', function() { List.list.appendByButton(planId); });
    //$(AppConfig.zone).delegate('.add-list-placeholder', 'click', function() { List.list.appendByPlaceholder($(this), planId); });
    $(AppConfig.zone).delegate('#add-card', 'click', function() { List.card.add($(this)); });
    $(window).resize(function() { List.uipatch.setListBoxMaxHeight(); });
    $( window ).unload(function() {localStorage.clear(); });
});
