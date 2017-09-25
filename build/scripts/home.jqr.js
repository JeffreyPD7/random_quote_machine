$(document).ready(function () {

    "use strict";

    function t(printOut) {
        console.log(printOut);
    }

    var quotes = [
        {
            quote: "Start by doing what's necessary; then do what's possible; and suddenly you are doing the impossible.",
            name: "Francis of Assisi"
        },
        {
            quote: "Believe you can and you're halfway there.",
            name: "Theodore Roosevelt"
        },
        {
            quote: "It does not matter how slowly you go as long as you do not stop.",
            name: "Confucius"
        },
        {
            quote: "Our greatest weakness lies in giving up. The most certain way to succeed is always to try just one more time.",
            name: "Thomas A. Edison"
        },
        {
            quote: "The will to win, the desire to succeed, the urge to reach your full potential... these are the keys that will unlock the door to personal excellence.",
            name: "Confucius"
        },
        {
            quote: "Don't watch the clock; do what it does. Keep going.",
            name: "Sam Levenson"
        },
        {
            quote: "A creative man is motivated by the desire to achieve, not by the desire to beat others.",
            name: "Ayn Rand"
        },
        {
            quote: "A creative man is motivated by the desire to achieve, not by the desire to beat others.",
            name: "Ayn Rand"
        },
        {
            quote: "Expect problems and eat them for breakfast.",
            name: "Alfred A. Montapert"
        },
        {
            quote: "Start where you are. Use what you have. Do what you can.",
            name: "Arthur Ashe"
        },
        {
            quote: "Ever tried. Ever failed. No matter. Try Again. Fail again. Fail better.",
            name: "Samuel Beckett"
        },
        {
            quote: "Be yourself; everyone else is already taken.",
            name: "Oscar Wilde"
        },
        {
            quote: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.",
            name: "Albert Einstein"
        },
        {
            quote: "Always remember that you are absolutely unique. Just like everyone else.",
            name: "Margaret Mead"
        },
        {
            quote: "Do not take life too seriously. You will never get out of it alive.",
            name: "Elbert Hubbard"
        },
        {
            quote: "People who think they know everything are a great annoyance to those of us who do.",
            name: "Isaac Asimov"
        },
        {
            quote: "Procrastination is the art of keeping up with yesterday.",
            name: "Don Marquis"
        },
        {
            quote: "Get your facts first, then you can distort them as you please.",
            name: "Mark Twain"
        },
        {
            quote: "A day without sunshine is like, you know, night.",
            name: "Steve Martin"
        },
        {
            quote: "My grandmother started walking five miles a day when she was sixty. She's ninety-seven now, and we don't know where the hell she is.",
            name: "Ellen DeGeneres"
        },
        {
            quote: "Don't sweat the petty things and don't pet the sweaty things.",
            name: "George Carlin"
        },
        {
            quote: "Always do whatever's next.",
            name: "George Carlin"
        },
        {
            quote: "Atheism is a non-prophet organization.",
            name: "George Carlin"
        },
        {
            quote: "Hapiness is not something ready made. It comes from your own actions.",
            name: "Dalai Lama"
        }

    ];

    // var memorizeQuotes = [];

    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    var animationIn = 'animated bounceIn';
    var animationOut = 'animated bounceOut';

    $('#home_-_button').on('click', function (e) {
        e.preventDefault();
        // var quotesLength = quotes.length;
        // var rand = Math.floor(Math.random() * quotesLength);

        // $('#home_-_quote').animateCss('zoomOut');

        // $('#home_-_quote')
        //     .addClass(animationIn)
        //     .one(animationEnd, function () {
        //         $(this).removeClass(animationIn);
        //     });

        $('#home_-_quote')
            .addClass('minimize')
            .one(animationEnd, function () {
                $(this).removeClass('minimize');
            });


        $('#home_-_quote')
            .addClass(animationOut)
            .one(animationEnd, function () {
                $(this).removeClass(animationOut);
            });


        // Get random quotes
        $.ajax({
            url: "https://api.forismatic.com/api/1.0/?",
            dataType: "jsonp",
            data: "method=getQuote&format=jsonp&lang=en&jsonp=?",
            success: function (response) {
                $('#home_-_quote__h2')
                    .delay(400)
                    .queue(function (n) {
                        $(this).html(response.quoteText);
                        $('#home_-_quote__h4').html(response.quoteAuthor);
                        n();
                    });

                // $("#tweet").attr("href", "https://twitter.com/home/?status=" + response.quoteText +
                //     ' (' + response.quoteAuthor + ')');
            }
        });


        // $('#home_-_quote').animateCss('bounceOut').css('animation-direction','alternate');


        // $('#home_-_quote').fadeOut(animatedTime, function() {
        //
        //     $('#home_-_quote').animateCss('bounceOut');
        //     $('#home_-_quote').animateCss('bounceIn');
        //
        //     $('#home_-_quote__h2').html(quote);
        //     $('#home_-_quote__h4').html(author);
        //
        //     $('#home_-_quote').fadeIn(animatedTime);
        // });


        t('end of function');


    }); //end of #home_-_button function

    // Hover effect on Button
    $('#home_-_button').hover(
        function(){$(this).toggleClass('cssanimation effect3d', 2000);}
    );




    // Animate.css Function
    $.fn.extend({
        animateCss: function (animationName) {
            var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
            this.addClass('animated ' + animationName).one(animationEnd, function () {
                $(this).removeClass('animated ' + animationName);
            });
            return this;
        }
    });

}); //end of document ready