var Session = (function () {

    var config = {
        sessionID: null,
        sessionTimeout: 10000,
        pollingTimeout: 4000,
        sessionID: 'JS-SESSION',
        exitUrl: 'session-expired.html',
        cache: localStorage
    };

    return {
        create: function (options) {
            console.log("Session created");
            var initTime = new Date().getTime();
            this.update({
                startTime: initTime,
                refreshTime: initTime,
                isExpireAlertOn: false,
                isExpired: false
            });
            this.registerEvents();
            this.setupPolling();
        },
        registerEvents: function () {
            document.onclick = document.onblur = this.refresh.bind(this);
        },
        setupPolling: function () {
            this.timeoutID = window.setInterval(this.poll.bind(this), config.pollingTimeout);
        },
        poll: function () {
            var diff = new Date().getTime() - this.getSession().refreshTime;
            console.log('Polling... diff = ' + diff);
            if (diff >= config.sessionTimeout) {
                if (!_session.isExpired) {
                    this.warn();
                }
            }
        },
        refresh: function () {
            var _session = this.getSession();
            this.update({
                startTime: _session.initTime,
                refreshTime: new Date().getTime(),
                isExpireAlertOn: false,
                isExpired: false
            });
            console.log("*Refreshing* = " + rmsSession.refreshTime);
        },
        warn: function () {
            var _session = this.getSession();

            if (!_session.isExpired) {
                if (!_session.isExpireAlertOn) {
                    var txt;
                    var r = confirm("Do you want to continue session? Session will expire in ");
                    if (r == true) {
                        this.refresh();
                    } else {
                        window.clearInterval(this.timeoutID);
                        this.expire();
                    }
                } else {
                    window.clearInterval(this.timeoutID);
                    this.expire();
                }
            } else {
                this.exit();
            }

        },
        update: function (state) {
            config.cache.setItem(this.sessionID, JSON.stringify(state));
        },
        expire: function () {
            this.update({
                isExpired: true
            });
        },
        expireServer: function () {

        },
        exit: function () {
            window.open(config.exitUrl, "_self");
        },
        getSession: function () {
            return JSON.parse(config.cache.getItem(this.sessionID));
        }
    };
})();