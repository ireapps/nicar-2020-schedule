(function() {
  var sessions = document.getElementsByClassName('filterable');
  var examples = document.getElementsByClassName('ex-link');
  var input = document.getElementById('main-search');
  var speakers = document.getElementsByClassName('speaker');

  function debounce(func, wait, immediate) {
    /* https://davidwalsh.name/javascript-debounce-function */
    var timeout;

    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) {
          func.apply(context, args)
        };
      };
      
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) {
        func.apply(context, args)
      };
    };
  };

  function show_all() {
    for (var i=0; i<sessions.length; i++) {
      sessions[i].style.display = 'block';
    };
  };

  for (var i=0; i<examples.length; i++) {
      examples[i].addEventListener('click', function() {
        if (this.innerHTML === 'Clear') {
          input.value = '';
        } else {
          input.value = this.innerHTML;
        }
        filter_sessions();
      });
  };

  var filter_sessions = debounce(function() {
    if (!input.value) { show_all(); return; };
    var search_terms = input.value.split(' ').map(function(x) {
      return x.toLowerCase();
    });
    for (var i=0; i<sessions.length; i++) {
      var this_div = sessions[i];
      var match = false;
      var this_div_filters = this_div.dataset.filters;
      search_terms.forEach(function(term) {
        if (this_div_filters.indexOf(term) > -1) {
          match = true;
        } else {
          match = false;
        }
      });
      if (match) {
        this_div.style.display = 'block';
      } else {
        this_div.style.display = 'none';
      }
    };
  }, 150);

  input.addEventListener('input', filter_sessions);

  for (var i=0; i<speakers.length; i++) {
    speakers[i].addEventListener('click', function() {
      var arrow = this.querySelector('span.arrow-symbol');
      var bio = this.parentNode.querySelector('p.bio');
      if (arrow.innerHTML === '▼') {
        arrow.innerHTML = '▲';
        bio.style.display = 'block';
      } else {
        arrow.innerHTML = '▼';
        bio.style.display = 'none';
      }
    });
  }


})();