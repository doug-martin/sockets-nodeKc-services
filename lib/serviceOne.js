(function () {
    "use strict";

    var comb = require("comb"),
        Service = require("monitor-client").CronService,
        path = require("path"),
        gofigure = require("gofigure")({monitor:true, locations:[path.resolve(process.env.HOME, "./monitor"), path.resolve(__dirname, "../config")]}),
        config = gofigure.loadSync(),
        serviceConfig = config.serviceOne;

    gofigure.on("logging.serviceOne.level", function (level) {
        LOGGER.info("LEVEL changed to " + level);
        LOGGER.level = level;
    });

    comb.logger.configure(config.logging);
    var LOGGER = comb.logger("serviceOne");

    comb.define(Service, {
        instance:{

            interval:serviceConfig.interval,


            maxErrorCount:serviceConfig.maxErrorCount,


            log:LOGGER,

            constructor:function () {
                this._super(arguments);
                gofigure.on("serviceOne.interval", function (interval) {
                    this.interval = interval;
                    this.restart();
                }.bind(this));
                gofigure.on("serviceOne.maxErrorCount", function (maxErrorCount) {
                    this.maxErrorCount = maxErrorCount;
                    this.restart();
                }.bind(this));
            },

            loop:function () {
                LOGGER.info("LOOPING!!!!!");
                process.nextTick(function doSomething() {
                    LOGGER.info("Doing something!!!");
                });
            }
        }
    }).as(module).start();

}());




