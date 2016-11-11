window.onload = function () {
    chrome.storage.local.get('libId', function (result) {
        potato(result.libId);
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
};
