var request = new XMLHttpRequest();
var script;
request.open('GET', 'assets/js/script.min.js', true);

request.onload = function() {
  if (this.status >= 200 && this.status < 400) {
    script = this.responseText;
    document.getElementById('start').setAttribute('onclick', 'javascript:(function(){'+script+'})();'); 
    document.getElementById('bookmarklet').setAttribute('href', 'javascript:(function(){'+script+'})();'); 
  } else {
    console.log('error');
  }
};

request.send();
