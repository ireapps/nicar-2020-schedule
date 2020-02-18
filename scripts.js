document.addEventListener('DOMContentLoaded', function() {

  var loading = document.getElementsByClassName('loading')[0];
  var main_content = document.getElementsByClassName('sessions')[0];

  loading.innerHTML = '&nbsp;';
  main_content.style.display = 'block';

  var sessions = document.getElementsByClassName('filterable');
  var examples = document.getElementsByClassName('ex-link');
  var input = document.getElementById('main-search');
  var speakers = document.getElementsByClassName('speaker');
  var day_divs = document.getElementsByClassName('day');
  var day_buttons = document.getElementsByClassName('col-top');
  var details_toggles = document.getElementsByClassName('show-more');
  var results_counters = document.getElementsByClassName('results-counter');

  var days = {
      0: 'Sunday',
      1: 'Monday',
      2: 'Tuesday',
      3: 'Wednesday',
      4: 'Thursday',
      5: 'Friday',
      6: 'Saturday'
    }

    // handle hash links for sessions F-SU
    if (window.location.hash) {
      var nohashtag = window.location.hash.slice(1);
      var datestring = nohashtag.split('_')[0];
      var year = datestring.substring(0, 4);
      var month = parseInt(datestring.substring(4, 6));
      var day = parseInt(datestring.substring(6, 8));
      var date = new Date(year, month-1, day);

      // make sure we actually made a date here
      if (date instanceof Date && !isNaN(date)) {
        
        // if it's 'all', we good
        if (nohashtag.indexOf('_all') < 0) {
          // otherwise, activate the switch function
          var wday = days[date.getDay()].toLowerCase();
          switch_day_divs(wday, nohashtag);
        }
      }

    }

  function switch_day_divs(weekday_name, url_hash) {
    for (var p=0; p<day_buttons.length; p++) {
      if (day_buttons[p].dataset.day === weekday_name) {
        day_buttons[p].classList.add('active');
      } else {
        day_buttons[p].classList.remove('active');
      }
    }
    for (var z=0; z<day_divs.length; z++) {
      if (day_divs[z].dataset.day === weekday_name) {
        day_divs[z].style.display = 'block';
      } else {
        day_divs[z].style.display = 'none';
      }
    }

    if (url_hash) {
      var target_div = document.getElementById(url_hash);
      if (target_div) {
        target_div.scrollIntoView();
      }
    }
  }

  for (var i=0; i<day_buttons.length; i++) {
    day_buttons[i].addEventListener('click', function() {
      var selected_day = this.dataset.day;
      switch_day_divs(selected_day);
    });
  }

  for (var i=0; i<details_toggles.length; i++) {
    details_toggles[i].addEventListener('click', function() {
      var details = this.nextSibling.nextSibling;
      if (this.innerHTML.toUpperCase().trim() === 'SHOW MORE') {
        this.innerHTML = 'SHOW LESS';
        details.style.display = 'block';
      } else {
        this.innerHTML = 'SHOW MORE';
        details.style.display = 'none';
      }
    })
  }

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
    Array.prototype.slice.call(results_counters).forEach(function(x) {
      x.innerHTML = '';
    })
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
    if (!input.value.trim()) { show_all(); return; };
    var search_terms = input.value.split(' ').map(function(x) {
      return x.toLowerCase();
    }).filter(function(x) {
      var term = x.trim().toLowerCase();
      return term !== '' && term !== 'and' && term !== 'or';
    });

    // handle searches for "r"
    var r_idx = search_terms.indexOf('r');
    if (r_idx > -1) {
      search_terms[r_idx] = 'TheRProgrammingLanguage';
    }

    var counts = {};
    for (var i=0; i<sessions.length; i++) {
      var this_div = sessions[i];
      var this_day = this_div.dataset.day;
      if (!counts[this_day]) {
        counts[this_day] = 0;
      }      
      var this_div_filters = this_div.dataset.filters;
      var match = false;
      search_terms.forEach(function(term) {
        if (this_div_filters.indexOf(term) > -1) {
          match = true;
        } else {
          match = false;
        }
      });
      if (match) {
        this_div.style.display = 'block';
        counts[this_day]++;
      } else {
        this_div.style.display = 'none';
      }
    };
    Array.prototype.slice.call(day_buttons).forEach(function(x) {
      var day = x.dataset.day;
      var count_span = x.querySelector('span.results-counter');
      count_span.innerHTML = '(' + counts[day] + ')';
    });
  }, 200);

  input.addEventListener('input', filter_sessions);

  for (var i=0; i<speakers.length; i++) {
    speakers[i].addEventListener('click', function() {
      var arrow = this.querySelector('span.arrow-symbol');
      if (arrow) {
        var bio = this.parentNode.querySelector('.bio');
        if (arrow.innerHTML === '👇') {
          arrow.innerHTML = '👆';
          bio.style.display = 'block';
        } else {
          arrow.innerHTML = '👇';
          bio.style.display = 'none';
        }
      }      
    });
  }

});