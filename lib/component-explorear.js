

function initExploreAr() {
    var touch = "ontouchend" in document,
        moveEvent = (touch) ? 'touchmove' : 'mousemove',
        wrapperContainer = $('#use-case-package'),
        phoneScanner = $('#use-case-phone-scanner'),
        realView = $('#use-case-package-view'),
        augmentedView = $('#use-case-real-value'),
        hintsContainer = phoneScanner.children('.hints'),
        frictionX = .09,
        depth = 1.6,
        rotateDepth = 1.3,
        windowHeight = 0,
        windowWidth = 0,
        parentWidth = 0,
        centeringDelta = 380,
        realViewLeft = 0,
        currentMousePos = {
            x: parseInt(phoneScanner.css('left')),
            y: parseInt(phoneScanner.css('top'))
        },
        edge = {},
        clipValues = {
            top: 50,
            right: 885,
            bottom: 556,
            left: 595
        },
        parentPosition = {},
        moveStarted = false,
        calculateEdgesClipEdges = function () {
            var delta = (wrapperContainer.width() - augmentedView.width()) / 2;

            if (delta > 0) {
                delta = 0;
            }

            clipValues.right = 525 - delta;
            clipValues.left = 235 - delta;

        },
        calculateEdges = function () {
            windowHeight = $(window).height();
            windowWidth = $(window).width();
            parentPosition.left = wrapperContainer.offset().left;
            parentPosition.top = wrapperContainer.offset().top;
            parentWidth = wrapperContainer.width();

            edge.left = -230;
            edge.right = wrapperContainer.width() - phoneScanner.width() / 2 - centeringDelta + 260;
            realViewLeft = realView.offset().left;

            calculateEdgesClipEdges();

        };

    calculateEdges();



    function move(leftShift) {
        if (leftShift < edge.left || leftShift > edge.right) {
            return;
        }

        var centerOriginShift = (leftShift-centeringDelta)/2,
            translateX = centerOriginShift*frictionX,
            translatedValue = 3*(translateX*rotateDepth*.3);

        wrapperContainer.css('perspective', '6000px');
        //
        realView.css('-webkit-transform', 'translateX(calc(50% - '+(-translateX*depth)+'px)) rotateY('+(translateX*.3)+'deg)');
        augmentedView.css('-webkit-transform', 'translateX(50% - '+(-translateX)+'px))  rotateY('+(translateX*rotateDepth*.3)+'deg)');

        phoneScanner.css('left', leftShift);

        var newVar = (leftShift + clipValues.right);// + translateX + (translateX > 0 ? translatedValue : 0));
        var newVar2 = (leftShift + clipValues.left);// + translateX  + (translateX < 0 ? translatedValue+5 : translatedValue/5));
        augmentedView.css('clip',
            'rect(' +
            clipValues.top + 'px, ' +
            newVar + 'px, ' +
            clipValues.bottom + 'px, ' +
            newVar2 + 'px)');

        console.log(newVar2-newVar);
    }


    augmentedView.on('load', function () {
        calculateEdgesClipEdges();
        move(parseInt(phoneScanner.css('left')));
    }).attr("src", augmentedView.attr("src"));

    wrapperContainer.bind(moveEvent + '.usecasepackage', function (e) {
        var leftShift;

        if ($(window).width() > 768) {
            e.preventDefault();
        }
        currentMousePos.x = e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.pageX;
        //currentMousePos.y = e.originalEvent.touches ? e.originalEvent.touches[0].pageY : e.pageY;

        leftShift = currentMousePos.x - ((windowWidth - parentWidth) / 2) - centeringDelta;

        if (!moveStarted) {
            hintsContainer.addClass('hideHint');
            moveStarted = true;
        }

        move(leftShift);
    });


    $(window).bind("resize.usecasepackage", $.throttle(300, function () {
        calculateEdges();
    })).bind('scroll.toUsecasepackage', function () {
        var scrollPosition = $(window).scrollTop();
        if (scrollPosition + windowHeight * .3 < parentPosition.top) {
            return;
        }
        $(window).unbind('scroll.toUsecasepackage');
        hintsContainer.addClass('seen');
    });
}

$(document).ready(function () {
    initExploreAr();
});