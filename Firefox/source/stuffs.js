window.onload = function () {
    var libId = "";
    chrome.storage.local.get('libId', function (result) {
        libId = result.libId;
        if (libId == null) libId = "electro-hub";
        potato(libId);
        websocketthing();
    });
    document.getElementById('sweg').onchange = function () {
        document.getElementById('stuff').innerHTML = "";
        document.getElementById('theySeeMeLoading').innerHTML = '<img src="loading.gif" style="width: 100px;" /><br /><br />';
        var aaa = document.getElementById("sweg");
        var no = aaa.options[aaa.selectedIndex].id;
        chrome.storage.local.set({ 'libId': no });
        potato(no);
    }
    function potato(libId) {
        var request = new XMLHttpRequest();
        request.open('GET', 'https://temp.discord.fm/libraries/' + libId + '/queue', true);
        request.onload = function () {
            document.getElementById('stuff').innerHTML = '<p><b>Now Playing: </b><span id="song"></span></p><p><b>Queue:</b><br /><span id="queue"></span></p>';
            document.getElementById('theySeeMeLoading').innerHTML = "";
            var data = JSON.parse(request.responseText);
            document.getElementById(data.bot).selected = 'selected';
            document.getElementById('song').textContent = data.current.title;
            var poop = 1;
            document.getElementById('queue').innerHTML = "1: " + data.queue[0].title;
            while (poop !== data.queue.length) {
                document.getElementById('queue').innerHTML = document.getElementById('queue').innerHTML + "<br />" + (poop + 1) + ": " + data.queue[poop].title;
                poop++;
            }
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