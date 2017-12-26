(function (window, document, undefined) {
    function sendEmailRequest(a, b, c) {
        if (a) {
            var d = JSON.stringify({email: a, fromFacebook: !!b});
            $.ajax("/apiv2/preRegistration", {
                data: d,
                type: "POST",
                contentType: "application/json",
                success: function (a) {
                    c(a)
                },
                error: function (a, b) {
                }
            })
        }
    }


    function FB_handleStatusChangeCallback(a, b) {
        a && "connected" == a.status ? (isConnected = !0, setButtonText("CONNECTED"), FB.api("/me?fields=email,name,picture", function (a) {
            setButtonText("CONNECTED", a && a.picture && a.picture.data && a.picture.data.url), sendEmailRequest(a && a.email, !0, function (a) {
                b != -1 && (a.success ? ($("#thank-you-modal").modal("show"), ga("send", "event", "facebook" + b, "subscribed")) : "Such email already exists" == a.message && $("#email-exists-modal").modal("show"))
            })
        })) : (isConnected = !1, setButtonText("CONNECT WITH FB"))
    }

    function FB_connect(a) {
        ga("send", "event", "facebook" + a, "click"), isConnected || FB.login(function (b) {
            FB_handleStatusChangeCallback(b, a)
        }, {scope: "public_profile,email"})
    }

    function setButtonText(a, b) {
        var c = $(".connect-with-fb");
        b ? c.html('<img src="' + b + '" /> ' + a) : c.text(a)
    }


    window.fbAsyncInit = function () {
        FB.init({appId: "213690449092214", xfbml: !0, version: "v2.8"}), FB.getLoginStatus(function (a) {
            FB_handleStatusChangeCallback(a, -1)
        })
    };
    $(document).ready(function () {
        $(".connect-with-fb").click(function () {
            return FB_connect($(this).attr("data-pos")), !1
        }), $("form.input-group").submit(function (a) {
            a.preventDefault();
            var b = $(this).find("input[name='email']"), c = $(this).attr("data-pos");
            return b.removeClass("error"), b.next(".error-details").remove(), b.val() && /\S+@\S+\.\S+/.test(b.val()) ? (ga("send", "event", "email" + c, "click"), void sendEmailRequest(b.val(), !1, function (a) {
                a.success ? ($("#thank-you-modal").modal("show"), ga("send", "event", "email" + c, "subscribed"), b.val("")) : "Such email already exists" == a.message && $("#email-exists-modal").modal("show")
            })) : (b.addClass("error"), void $('<span class="error-details">Sorry. Your email is not valid</span>').insertAfter(b))
        })


    });


    $(document).ready(function () {
        var banner = $("#download-banner");

        if (document.referrer && document.referrer.match(/theroar\.io/g)) {
            banner.removeClass('hidden');

            $("#cta-download-link").click(function () {
                $(this).addClass('hidden');
                $('#huge-wrapper-banner').toggleClass('hidden');
            }).addClass("hidden");

            $("#close-banner-link").click(function () {
                $('#huge-wrapper-banner').addClass('hidden');
                $("#cta-download-link").removeClass("hidden");
            });

        }

        var $header = $('#header-phone');
        var headerContainer = $('.header-container');

        $(window).on('resize', function () {
            $header.css('transform', 'scale(' + (headerContainer.height() / 750) + ')');
        });
        $header.css('transform', 'scale(' + (headerContainer.height() / 750) + ')');
    });


})(window, document);