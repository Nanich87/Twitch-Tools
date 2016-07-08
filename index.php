<!DOCTYPE html>
<html lang="en">
    <head>
        <title>Twitch Tools - Watch live streams, check channel status, download past broadcasts and highlights</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <meta name="google-site-verification" content="08B1cvc7p6wjR9xCNBFhGpyF_QlWNgDE78Ru1u5y9kY" />
        <link rel="icon" href="http://sixeightone.eu/wp-content/uploads/2015/01/Firefox-panda-red-icon.png" type="image/x-icon" />
        <link rel="stylesheet" href="resources/css/seocss.css" />
        <link rel="stylesheet" href="resources/css/default.css" />
        <link rel="stylesheet" href="resources/css/responsive.css" />
        <link rel="stylesheet" href="resources/css/toastr.min.css" />    
        <link rel="stylesheet" href="resources/css/jquery-ui.min.css" />
    </head>
    <body>
        <div id="fb-root"></div>
        <script>(function (d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id))
                    return;
                js = d.createElement(s);
                js.id = id;
                js.src = "//connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v2.5";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        </script>
        <header class="header">
            <div class="header-logo-container">
                <a href="/" title="Twitch Tools"><img class="header-logo" src="resources/images/tv.png" alt="TV" /></a>
            </div>
            <div class="header-title-container">
                <h1 class="header-title">Twitch Tools</h1>
                <p class="header-description">Watch Twitch live streams, check channel status, download past broadcasts and highlights.</p>
            </div>
            <div class="header-readmore-container">
                <a class="btn btn-info" title="TwitchTools v2" href="/v2/">TwitchTools 2</a>
            </div>
            <div class="header-user-container"></div>
        </header>
        <nav class="nav">
            <ul class="nav-menu">
                <li class="nav-item">
                    <a data-item-id="1" title="Home" class="active" href="#/">Home</a>
                </li>
                <li class="nav-item">
                    <a data-item-id="4" title="Download past broadcasts and highlights" href="#/download">Download</a>
                </li>
                <li class="nav-item">
                    <a data-item-id="5" title="Login" href="#/login">Login</a>
                </li>
                <li class="nav-item">
                    <a data-item-id="2" title="MultiTwitch" href="#/multitwitch">MultiTwitch</a>
                </li>
                <li class="nav-item">
                    <a data-item-id="3" title="Contact Us" href="#/contact">Contact Us</a>
                </li>
            </ul>
        </nav>
        <div class="main">
            <div id="content">
            </div>
        </div>
        <footer class="footer">
            <div class="panel center-align ">
                <div class="fb-like" data-href="https://www.facebook.com/TwitchTools" data-layout="button_count" data-action="like" data-show-faces="true" data-share="true"></div>
            </div>
            <div class="panel center-align">
                <span class="small-text">Copyright &copy; 2015-2016 :: Twitch Tools v1.0.20160123 :: <a title="SixEightOne" href="http://sixeightone.eu"><span class="white">SixEightOne.eu</span></a></span>
            </div>
            <div class="panel center-align">
                <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                    <input type="hidden" name="cmd" value="_s-xclick">
                    <input type="hidden" name="hosted_button_id" value="L8YFAT833UYVN">
                    <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
                    <img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">
                </form>
                <div class="small-text">We need your support to keep this project alive</div>
            </div>
        </footer>
        <!-- Libraries -->
        <script src="libs/jquery-2.0.3.js"></script>
        <script src="libs/jquery-ui.min.js"></script>
        <script src="libs/sammy-0.7.6.min.js"></script>
        <script src="libs/handlebars.js"></script>
        <script src="libs/moment.js"></script>
        <script src="libs/toastr.min.js"></script>
        <script src="//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js"></script>

        <!-- Application: Loaders -->
        <script src="app/jsonRequester.js"></script>
        <script src="app/data.js"></script>
        <script src="app/templates.js"></script>

        <!-- Application: Helpers -->
        <script src="helpers/language.js"></script>
        <script src="helpers/validator.js"></script>
        <script src="helpers/pagination.js"></script>
        <script src="helpers/page.js"></script>

        <!-- Application: Controllers -->
        <script src="controllers/controller.js"></script>

        <!-- Application: Start -->
        <script src="app.js"></script>

        <script>
            (function (i, s, o, g, r, a, m) {
                i['GoogleAnalyticsObject'] = r;
                i[r] = i[r] || function () {
                    (i[r].q = i[r].q || []).push(arguments)
                }, i[r].l = 1 * new Date();
                a = s.createElement(o),
                        m = s.getElementsByTagName(o)[0];
                a.async = 1;
                a.src = g;
                m.parentNode.insertBefore(a, m)
            })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

            ga('create', 'UA-39345597-5', 'auto');
            ga('send', 'pageview');

        </script>
    </body>
</html>