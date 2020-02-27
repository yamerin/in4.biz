(function() {

    function ready(fn) {
        if (document.readyState != 'loading'){
            fn();
        } else if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            document.attachEvent('onreadystatechange', function() {
                if (document.readyState != 'loading')
                    fn();
            });
        }
    }

    ready(init);

    function init() {
        var request = new XMLHttpRequest(),
            pageString = document.body.innerHTML;

        request.open('GET', '/aff_url/api.php', true);

        request.onreadystatechange = function() {
            if (this.readyState === 4) {

                if (this.status >= 200 && this.status < 400) {

                    var data = JSON.parse(this.responseText),
                        changeLinks = data.block.join().replace(/\./g, '\\.').replace(/,/gi, '|'),
                        domR = new RegExp(changeLinks,'gi'),
                        newDom = data.work;


                    // no links coincidence
                    if (domR.test(pageString) != true) return;

		  // links
                    replaceUrl('a', 'href', newDom);
                    repOnClick('a', 'onclick', newDom);

                    // frames
                    replaceUrl('iframe', 'src', newDom);

                    // img
                    replaceUrl('img', 'src', newDom);

                    // replacer
                    function replaceUrl(tag, url, link) {
                        var objR = new RegExp('<'+tag+'.+'+url+'=["'+"|'"+'].*http[s]?:\/\/['+changeLinks+'].+["|'+"'][.+|>]", 'i'),
                            domCheck = objR.test(pageString);
                        if (domCheck == true) {
                            var els = document.getElementsByTagName(tag),
                                i = 0;

                            for(i; i < els.length; i++) {
                                if (els[i][url].search(domR) !== -1) {
                                    els[i][url] = els[i][url].replace(domR, link);
                                }
                            }

                        }
                    }

                    function repOnClick(tag, url, link) {
                        var objR = new RegExp('<'+tag+'.+'+url+'=["'+"|'"+'].*http[s]?:\/\/['+changeLinks+'].+["|'+"'][.+|>]", 'i'),
                            domCheck = objR.test(pageString);
                            
                        if (domCheck == true) {

                            var els = document.getElementsByTagName(tag),
                                i = 0;

                            for(i; i < els.length; i++) {
                                if (els[i][url].search(domR) !== -1) {
                                    var newEvent = els[i][url].toString().replace(domR, link);
                                    newEvent = newEvent.replace('function onclick(event) {', '');
                                    newEvent = newEvent.replace('}', '');

                                    els[i][url] = new Function(newEvent);
                                    console.log(els[i][url]);
                                }
                            }

                        }
                    }

                }
            }
        };

        request.send();
        request = null;

    }
})();
