var fling = window.fling || {};

(function () {
    'use strict';

    // namespace which should be equal to sender's.
    FlingPic.NAMESPACE = 'urn:flint:tv.matchstick.demo.flingpic';

    function FlingPic() {
        self = this;

        // create Recerver manager object which can be used to send messages through messagebus.
        self.flingPicManager = new FlintReceiverManager('~flingpic');

        // create messagebus which can send/recv namespace related messages
        self.messageBus = self.flingPicManager.createMessageBus(FlingPic.NAMESPACE);

        // called when receiving messages in the specfic namespace
        self.messageBus.on("message", function (message, senderId) {
            var data = JSON.parse(message);
            ("onMessage" in self) && self.onMessage(data, senderId);
        });

        // callback function, which is called when user entered the game
        self.messageBus.on('senderConnected', function (senderId) {
          self.onSenderConnected(senderId);
        });

        // called when user left
        self.messageBus.on('senderDisconnected', function(senderId) {
          self.onSenderDisconnected(senderId);
        });

        // ready to work
        self.flingPicManager.open();
    }

    // Adds event listening functions to FlingPic.prototype.
    FlingPic.prototype = {
        /**
         * Message received event; determines event message and command, and
         * choose function to call based on them.
         */
        onMessage: function (message, senderId) {
            console.log('onMessage: ' + message + " senderId:" + senderId);

            if (message.command == 'show') {
                this.onShow(senderId, message);
            } else {
                console.log('Invalid message command: ' + message.command);
            }
        },

        /**
         * Sender Connected event
         * @param {event} event the sender connected event.
         */
        onSenderConnected: function (event) {
            console.log('onSenderConnected. Total number of senders: ' + Object.keys(self.getSenderList()).length);
        },

        /**
         * Sender disconnected event; if all senders are disconnected,
         * closes the application.
         * @param {event} event the sender disconnected event.
         */
        onSenderDisconnected: function (event) {
            console.log('onSenderDisconnected. Total number of senders: ' + Object.keys(self.getSenderList()).length);
            if (Object.keys(self.getSenderList()).length == 0) {
                window.close();
            }
        },

        /**
         * Show pic
         *
         * @param {string} senderId
         * @param {string} message
         */
        onShow: function (senderId, message) {
            console.log('****onShow****:' + message.file);

            $("#pic").attr("src",message.file);
        },
    };

    // Exposes public functions and APIs
    fling.FlingPic = FlingPic;
})();
