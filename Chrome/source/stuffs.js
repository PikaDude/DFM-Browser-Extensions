window.onload = function () {
    var libId = "";
    var version = "1.1";
    chrome.storage.local.get('libId', function (result) {
        libId = result.libId;
        if (libId == null) libId = "electro-hub";
        potato(libId);
        websocketthing();
        checkforupdates();
    });
    document.getElementById('sweg').onchange = function () {
        var aaa = document.getElementById("sweg");
        var no = aaa.options[aaa.selectedIndex].id;
        chrome.storage.local.set({ 'libId': no });
        potato(no);
    }
    function potato(libId) {
        var request = new XMLHttpRequest();
        request.open('GET', 'https://temp.discord.fm/libraries/' + libId + '/queue', true);
        request.onload = function () {
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
    function checkforupdates() {
        console.log("aaa");
        var memes = new XMLHttpRequest();
        memes.open('GET', 'https://github.com/PikaDude/DFM-Browser-Extensions/blob/master/Chrome/version.txt', true);
        memes.onload = function () {
            console.log(memes.responseText)
            if (memes.status >= 200 && memes.status < 400) {
                if (version == memes.responseText) {
                    document.getElementById('version').textContent = "Latest Version Installed (" + version + ")";
                }
                else {
                    document.getElementById('version').textContent = "New Version Available: " + memes.responseText;
                    document.getElementById('version').onclick = "function () { window.open('https://github.com/PikaDude/DFM-Browser-Extensions/blob/master/Chrome'); }";
                }
            }
            else {
                console.log("aaa")
                document.getElementById('version').textContent = "Failed to check for updates";
            }
        }
        memes.onerror = function () {
            document.getElementById('version').textContent = "Failed to check for updates";
        }
    }
};
