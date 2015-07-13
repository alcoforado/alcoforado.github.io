/// <reference path="./defines/jquery.d.ts" /> 

import $ = require("jquery");

export function Initialize() {


    $(document).ready(function () {
        var selector = $("[data-effects-on-hover-bright-background]")
        for (var i = 0; i < selector.length; i++) {
            (function () {
                var elem = selector[i];
                var old_background = $(elem).css("background-image")
                var background = old_background;

                var num = Number($(elem).attr("data-effects-on-hover-bright-background"));
                num = 1 + num / 100.0;
                var regexp = /rgb\([ ]*\d{1,3},[ ]*\d{1,3},[ ]*\d{1,3}\)/gi


                var result;
                var rgbs = [];
                while (result = regexp.exec(background)) {
                    rgbs.push(result[0]);
                }

                for (var j = 0; j < rgbs.length; j++) {
                    var rgb = rgbs[j];
                    var reg = /\d{1,3}/gi;
                    var rs;
                    var cmps = [];
                    while (rs = reg.exec(rgb)) { cmps.push(rs[0]); }


                    var r = Math.floor(Math.min(parseInt(cmps[0]) * num, 255));
                    var g = Math.floor(Math.min(parseInt(cmps[1]) * num, 255));
                    var b = Math.floor(Math.min(parseInt(cmps[2]) * num, 255));

                    var newRGB = "rgb(" + r + "," + g + "," + b + ")";
                    background = background.split(rgb).join(newRGB);
                }
                $(elem).hover(function () {
                    $(this).css("background", background);
                },
                    function () {
                        $(this).css("background", old_background);
                    })
            })();
        }


    });
}
