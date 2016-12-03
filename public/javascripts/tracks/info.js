$(function(){
    //个人中心
    $('.my_on').on('click', function(event) {
        var zt = $(this).attr('class');
        var w = $('.myBox').width();

        if (zt=='my_off') {
            $('.myBox').animate({left:-(w/20) +'rem'}, 500)
            $(this).attr('class', 'my_on');
            $(this).find('span').removeClass('foot_2_on').addClass('foot_2');

        } else {
            $('.myBox').animate({left:0}, 500);
            $(this).attr('class', 'my_off');
            $(this).find('span').removeClass('foot_2').addClass('foot_2_on');

        }
        event.stopPropagation();
    }); 

    //委托弹出层
    $('#payShow,#entrust span').on('click', function() {
        $('#entrust,.mask').fadeToggle(200);
    }); 

    // 关注
    $(document).on('click', '.collect_no', function() {
        const this_element = $(this);
        $.ajax({
            url : '/tracks/set_attention',
            type : 'post',
            data : { auction_id : $(this).attr('id'), special_id : $(this).attr('special-id')},
            success : data => {
                if (data.code == 0) {
                    if (data.data.follow == 1) {
                        this_element.text('已关注');        
                        this_element.attr('class', 'collect_yes');
                    } else {
                        this_element.text('拍前提醒');        
                        this_element.attr('class', 'collect_no');
                    } 
                }
            }
        });
    });
    
    // 取消关注
    $(document).on('click', '.collect_yes', function() {
        const this_element = $(this);
        $.ajax({
            url : '/tracks/set_attention',
            type : 'post',
            data : { auction_id : $(this).attr('id'), special_id : $(this).attr('special-id')},
            success : data => {
                if (data.code == 0) {
                    if (data.data.follow == 1) {
                        this_element.text('已关注');        
                        this_element.attr('class', 'collect_yes');
                    } else {
                        this_element.text('拍前提醒');        
                        this_element.attr('class', 'collect_no');
                    }  
                }
            }
        });
    });

    //报名弹出层
    $('#book span').click(() => {
        $('#book,.mask').fadeToggle(200);
    });

    //报名弹出层
    $('.sign_up').click(function () {
        const bond = $(this).attr('bond');
        const auction_id = $(this).attr('id');
        const follow_me = $(this).attr('followmehtml');
        const h = $(window).height();
        if (bond != undefined && auction_id != undefined ) {
            $('#signup_bond_html').html(bond);
            $('#signup_bond').val(bond);
        }
        $('#signup_auctionid').val(auction_id);
        $('.follow_me').html(follow_me);
        $('#book, .mask').fadeToggle(200);
        $('.videoBox').css({top : '-11.5rem'});
        $('.centerCont').css({
            overflowY: 'inherit',
            overflowX: 'inherit',
            top: '0',
            height: h
        });
    });

    // 服务条款
    $('.services,.reRead').on('click', function() {
        $('.serverBox,.mask').fadeToggle(200);
    });

    // 关注我
    $('#follow_me').click(() => {
        const config_info = JSON.parse($('#config-info').val());
        window.location.href = config_info.interactive_domain + 'index.php/Admin/Qnrpmobile/share?uid=' + $('#user-id').val() + '&auctionid=' + $('#signup_auctionid').val();
    });

    // 报名确认
    $('#signup_confirm').click(() => {
        const config_info = JSON.parse($('#config-info').val());
        window.location.href = config_info.interactive_domain + 'index.php/Admin/Qnrpmobile/address?auctionid=' + $('#signup_auctionid').val() + '&fromtype=1';
    });
});