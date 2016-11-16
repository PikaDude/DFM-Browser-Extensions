window.onload = function () {
    var libId = "";
    var version = "1.3";
    chrome.storage.local.get('libId', function (result) {
        libId = result.libId;
        if (libId == null) libId = "electro-hub";
        potato(libId);
        websocketthing();
    });
    document.getElementById('sweg').onchange = function () {
        document.getElementById('theySeeMeLoading').style.visibility = 'visible';
        document.getElementById('stuff').style.visibility = 'hidden';
        var aaa = document.getElementById("sweg");
        var no = aaa.options[aaa.selectedIndex].id;
        chrome.storage.local.set({ 'libId': no });
        potato(no);
    }
    function potato(libId) {
        document.getElementById('stuff').style.visibility = 'hidden';
        var request = new XMLHttpRequest();
        request.open('GET', 'https://temp.discord.fm/libraries/' + libId + '/queue', true);
        request.onload = function () {
            var data = JSON.parse(request.responseText);
            document.getElementById(data.bot).selected = 'selected';
            document.getElementById('song').textContent = data.current.title;
            var poop = 0;
            while (poop !== data.queue.length) {
                document.getElementById('queue' + (poop + 1)).textContent = (poop + 1) + ": " + data.queue[poop].title;
                poop++;
            }
            document.getElementById('theySeeMeLoading').style.visibility = 'hidden';
            document.getElementById('stuff').style.visibility = 'visible';
        }
        request.send();
    }
    function websocketthing() {
        var wss = new WebSocket("wss://sockets.temp.discord.fm");
        wss.onmessage = function (message) {
            var data = message.data
            if (data == "helo") return;
            var jason = JSON.parse(data);
            if (jason.event == "play" && jason.data.bot == libId) {
                window.setTimeout(potato, 1000, libId);
            }
        }
    }
};