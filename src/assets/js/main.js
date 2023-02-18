$(document).ready(function(){

equalHeight($(".card-info"));
equalHeight($(".sidenav"));
$('.client-carousel').owlCarousel({
    loop:true,
    margin:10,
    nav:false,
    dots:false,
    autoplay:true,
    autoplaySpeed:2000,
    responsive:{
        0:{
            items:1
        },
        600:{
            items:2
        },
        1000:{
            items:3
        }
    }
});

// expert caruusel
$('.expert-carousel').owlCarousel({
    loop:true,
    margin:10,
    nav:true,
    dots:false,
    autoplay:true,
    responsive:{
        0:{
            items:1
        },
        600:{
            items:2
        },
        1000:{
            items:5
        }
    }
});

// latestprjct caruusel
$('.latestprjct-carousel').owlCarousel({
    loop:true,
    margin:10,
    nav:false,
    dots:true,
    autoplay:true,
    autoplaySpeed:2000,
    responsive:{
        0:{
            items:1
        },
        600:{
            items:1
        },
        1000:{
            items:1
        }
    }
});
});


// equal height
function equalHeight(group) {
    tallest = 0;
    group.each(function() {
       thisHeight = $(this).height();
       if(thisHeight > tallest) {
          tallest = thisHeight;
       }
    });
    group.height(tallest);
 }


 
 jQuery(document).ready(function($) {
  
    $(".languages").click(function(){
        $(".languages ul").show();
      })
   $(".languages ul").mouseleave(function(){
     $(".languages ul").hide(); 
   });
    
   $(".languages li a").click(function(){
        $(".languages li a").removeClass('sel');
        $(this).addClass('sel');
        var selectedValue = $(this).text();
        var showLang = selectedValue.substring(0, 1);
        $('.languages .current').html(showLang);
        $('.languages .current').attr("title", selectedValue);
        $('.languages .hover').html(selectedValue);
      })
      
      
      
   });

   function myFunction() {
    var dots = document.getElementById("dots");
    var moreText = document.getElementById("more");
    var btnText = document.getElementById("myBtn");
  
    if (dots.style.display === "none") {
      dots.style.display = "inline";
      btnText.innerHTML = "Read more";
      moreText.style.display = "none";
    } else {
      dots.style.display = "none";
      btnText.innerHTML = "Read less";
      moreText.style.display = "inline";
    }
  }

  
  const terms = document.querySelector(".terms-and-conditions");
  const termsLastElement = terms.lastElementChild;
  const scrollToBottom = document.querySelector(".scroll-to-bottom");
  const acceptButton = document.querySelector(".accept-button");
  
  scrollToBottom.addEventListener("click", function(e) {
    termsLastElement.scrollIntoView({
      block: "start",
      behavior: "smooth",
      inline: "nearest"
    });
  });
  
  function obCallback(payload) {
    if (payload[0].isIntersecting) {
      scrollToBottom.setAttribute("aria-hidden", true);
      acceptButton.setAttribute("aria-hidden", false);
      observer.unobserve(termsLastElement);
    }
  }
  
  const observer = new IntersectionObserver(obCallback, { root: terms, threshold: 0.1 });
  
  observer.observe(termsLastElement);
  
  const msgerForm = get(".msger-inputarea");
  const msgerInput = get(".msger-input");
  const msgerChat = get(".msger-chat");
  
  const BOT_MSGS = [
    "Hi, how are you?",
    "Ohh... I can't understand what you trying to say. Sorry!",
    "I like to play games... But I don't know how to play!",
    "Sorry if my answers are not relevant. :))",
    "I feel sleepy! :("
  ];
  
  // Icons made by Freepik from www.flaticon.com
  const BOT_IMG = "https://image.flaticon.com/icons/svg/327/327779.svg";
  const PERSON_IMG = "https://image.flaticon.com/icons/svg/145/145867.svg";
  const BOT_NAME = "BOT";
  const PERSON_NAME = "Sajad";
  
  msgerForm.addEventListener("submit", event => {
    event.preventDefault();
  
    const msgText = msgerInput.value;
    if (!msgText) return;
  
    appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
    msgerInput.value = "";
  
    botResponse();
  });
  
  function appendMessage(name, img, side, text) {
    //   Simple solution for small apps
    const msgHTML = `
      <div class="msg ${side}-msg">
        <div class="msg-img" style="background-image: url(${img})"></div>
  
        <div class="msg-bubble">
          <div class="msg-info">
            <div class="msg-info-name">${name}</div>
            <div class="msg-info-time">${formatDate(new Date())}</div>
          </div>
  
          <div class="msg-text">${text}</div>
        </div>
      </div>
    `;
  
    msgerChat.insertAdjacentHTML("beforeend", msgHTML);
    msgerChat.scrollTop += 500;
  }
  
  function botResponse() {
    const r = random(0, BOT_MSGS.length - 1);
    const msgText = BOT_MSGS[r];
    const delay = msgText.split(" ").length * 100;
  
    setTimeout(() => {
      appendMessage(BOT_NAME, BOT_IMG, "left", msgText);
    }, delay);
  }
  
  // Utils
  function get(selector, root = document) {
    return root.querySelector(selector);
  }
  
  function formatDate(date) {
    const h = "0" + date.getHours();
    const m = "0" + date.getMinutes();
  
    return `${h.slice(-2)}:${m.slice(-2)}`;
  }
  
  function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
  

  $.fn.jQuerySimpleCounter = function (options) {
    var settings = $.extend(
      {
        start: 0,
        end: 100,
        easing: "swing",
        duration: 400,
        complete: ""
      },
      options
    );
  
    var thisElement = $(this);
  
    $({ count: settings.start }).animate(
      { count: settings.end },
      {
        duration: settings.duration,
        easing: settings.easing,
        step: function () {
          var mathCount = Math.ceil(this.count);
          thisElement.text(mathCount);
        },
        complete: settings.complete
      }
    );
  };
  
  $("#number1").jQuerySimpleCounter({ end: 12, duration: 3000 });
  $("#number2").jQuerySimpleCounter({ end: 55, duration: 3000 });
  $("#number3").jQuerySimpleCounter({ end: 359, duration: 2000 });
  $("#number4").jQuerySimpleCounter({ end: 246, duration: 2500 });
  
  /* AUTHOR LINK */
  $(".about-me-img").hover(
    function () {
      $(".authorWindowWrapper").stop().fadeIn("fast").find("p").addClass("trans");
    },
    function () {
      $(".authorWindowWrapper")
        .stop()
        .fadeOut("fast")
        .find("p")
        .removeClass("trans");
    }
  );

  $(function(){
    var $ul   =   $('.sidebar-navigation > ul');
    
    $ul.find('li a').click(function(e){
      var $li = $(this).parent();
      
      if($li.find('ul').length > 0){
        e.preventDefault();
        
        if($li.hasClass('selected')){
          $li.removeClass('selected').find('li').removeClass('selected');
          $li.find('ul').slideUp(400);
          $li.find('a em').removeClass('mdi-flip-v');
        }else{
          
          if($li.parents('li.selected').length == 0){
            $ul.find('li').removeClass('selected');
            $ul.find('ul').slideUp(400);
            $ul.find('li a em').removeClass('mdi-flip-v');
          }else{
            $li.parent().find('li').removeClass('selected');
            $li.parent().find('> li ul').slideUp(400);
            $li.parent().find('> li a em').removeClass('mdi-flip-v');
          }
          
          $li.addClass('selected');
          $li.find('>ul').slideDown(400);
          $li.find('>a>em').addClass('mdi-flip-v');
        }
      }
    });
    
    
    $('.sidebar-navigation > ul ul').each(function(i){
      if($(this).find('>li>ul').length > 0){
        var paddingLeft = $(this).parent().parent().find('>li>a').css('padding-left');
        var pIntPLeft   = parseInt(paddingLeft);
        var result      = pIntPLeft + 20;
        
        $(this).find('>li>a').css('padding-left',result);
      }else{
        var paddingLeft = $(this).parent().parent().find('>li>a').css('padding-left');
        var pIntPLeft   = parseInt(paddingLeft);
        var result      = pIntPLeft + 20;
        
        $(this).find('>li>a').css('padding-left',result).parent().addClass('selected--last');
      }
    });
    
    var t = ' li > ul ';
    for(var i=1;i<=10;i++){
      $('.sidebar-navigation > ul > ' + t.repeat(i)).addClass('subMenuColor' + i);
    }
    
    var activeLi = $('li.selected');
    if(activeLi.length){
      opener(activeLi);
    }
    
    function opener(li){
      var ul = li.closest('ul');
      if(ul.length){
        
          li.addClass('selected');
          ul.addClass('open');
          li.find('>a>em').addClass('mdi-flip-v');
        
        if(ul.closest('li').length){
          opener(ul.closest('li'));
        }else{
          return false;
        }
        
      }
    }
    
  });

  
  