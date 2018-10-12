var connectivity = (function () {
  //defaults
  var defaults = {
    useSockets: false,
    useHTTP: false,
    delay: 5 * 1000,
  };

  var connection = null,
    useHTTP = false,
    callback = null,
    useSockets = false,
    intervalId = false,
    delay = 5 * 1000,
    lastMessageId = null;
  // Keep this variable private inside this closure scope

  // Expose these functions via an interface while hiding
  // the implementation of the module within the function() block

  function sendHttpRequestWithDelay() {
    intervalId = setInterval(function () {
      getInfoByHttp();
    }, delay);
  }

  function getInfoByHttp() {
    $.post("/http?id=" + lastMessageId, function (data) {
      if (!Array.isArray(data)) { return; }
      data.forEach(function (message) {
        onMessage(message);
      });
    });
  }

  function onMessage(data) {
    if (data && data.id >= 0) {
      lastMessageId = data.id;
    }
    callback(data);
  }

  function onSocketMessage(data) {
    onMessage(data);
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    if (useHTTP) {
      sendHttpRequestWithDelay();
    }
  };

  return {
    /*
     * Usage: 
     *  subscribe({
     *      delay: 100,
     *      useSockets: true,
     *      useHTTP: true,
     *      callback: function () {}
     *  });
     *  to keep sockets connection
     *  unsubscribe({
     *      useSockets: true
     *  });
     *  to keep http connection
     *  unsubscribe({
     *      useHTTP: true
     *  });
     *  to unsubscribe from all
     *  unsubscribe();
     *
     */
    subscribe: function(params) {
      delay = params.delay || defaults.delay;
      useSockets = params.useSockets || defaults.useSockets;
      useHTTP = params.useHTTP || defaults.useHTTP;
      callback = params.callback;

      if (useSockets && !connection) {
        connection = io('http://localhost:3000');
        connection.on('message', onSocketMessage);
      }

      if (useHTTP && !intervalId) {
        sendHttpRequestWithDelay();
      }
    },
    unsubscribe: function(params, callback) {
      params = params || {};
      useSockets = params.useSockets || false;
      useHTTP = params.useHTTP || false;

      if (! useHTTP && intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      if (! useSockets && connection) {
        connection.close();
        connection = null;
      }
    }
  }
})();