// Takes a char in the siteswap range [0-9a-z]
// Returns an int representing a throw of that height
function toInt(c) {
  if (c.match(/^[0-9]$/)) {
		return parseInt(c, 10);
  } else if (c.match(/^[a-z]$/i)) {
    return c.charCodeAt(0) - 'a'.charCodeAt(0) + 10;
  } else {
    console.log('unknown char in input');
    throw c;
  }
}

// Takes an integer value in the siteswap range
// returns a char representing a throw of that height
function toToss(i) {
  if (i >= 0 && i <= 9) {
    return String.fromCharCode(i + 48);
  } else if (i >= 10 && i <= 35) {
    return String.fromCharCode(i + 97 - 10);
  }
}

// Takes a string representation of an async siteswap
// Returns its representation as an int list list
function toSiteswap(str) {
  var i = 0;
  var len = str.length;
  ret = [];
  while (i < len) {
    if (str[i] == '[') {
      i++;
      var temp = [];
      var end_index = str.indexOf(']', i+1);
      if (end_index == -1) {
        throw 'Mismatch';
      }
      for (; i < end_index; i++) {
        temp.push(toInt(str[i]));
      }
      ret.push(temp);
    } else {
      var s = toInt(str[i]);
      ret.push([s]);
    }
    i++;
  }
  return ret;
}

// Takes an int list list representing a siteswap
// Returns a formatted string representing the same information suitable for 
// printing.
function SSToString(ss) {
  var ret = '';
  for (i = 0; i < ss.length; i++) {
    if (ss[i].length == 1) {
      // vanilla throw
      ret += toToss(ss[i][0]);
    } else {
      // multiplex throw
      ret += '[';
      for (j = 0; j < ss[i].length; j++) {
        ret += toToss(ss[i][j]);
      }
      ret += ']';
    }
  }
  return ret;
}

// Takes a siteswap in int list list form
// Takes an int len
// Returns true if there exists a valid suffix of that len
function ExistsSuffix(prefix, len) {
  // determine the drop sites of all throws
  var countdown = [];
  for (i = 0; i < prefix.length; i++) {
    for (j = 0; j < prefix[i].length; j++) {
      var index = (prefix[i][j] + i) % (prefix.length + len);
      if (countdown[index] === undefined) {
        countdown[index] = 1;
      } else {
        countdown[index] += 1;
      }
    }
  }

  // check that no site has more balls dropping than the number of throws there
  for (i = 0; i < prefix.length; i++) {
    // if (countdown[i] !== undefined && countdown[i] > prefix[i].length) {
    // We intentionally do not return false when countdown[i] is undefined
    if (countdown[i] > prefix[i].length) {
      return false;
    }
  }
  return true;
}

function ExistsVanillaSuffix(prefix, len) {
  console.log(len);
  // determine the drop sites of all throws
  var countdown = [];
  for (i = 0; i < prefix.length; i++) {
    for (j = 0; j < prefix[i].length; j++) {
      var index = (prefix[i][j] + i) % (prefix.length + len);
      if (countdown[index] === undefined) {
        countdown[index] = 1;
      } else {
        countdown[index] += 1;
      }
    }
  }

  // check that no site has more balls dropping than the number of throws there
  for (i = 0; i < prefix.length; i++) {
    // We intentionally do not return false when countdown[i] is undefined
    if (countdown[i] > prefix[i].length) {
      return false;
    }
  }
  // check that no suffix member needs to be multiplex
  for (i = prefix.length; i < countdown.length; i++) {
    // We intentionally do not return false when countdown[i] is undefined
    if (countdown[i] > 1) {
      return false;
    }
  }
  return true;
}

function ExistsAnySuffix(prefix) {
  return ExistsSuffix(prefix, prefix.length + 35);
}

function ExistsAnyVanillaSuffix(prefix) {
  for (var i = 0; i < 35; i++) {
    if (ExistsVanillaSuffix(prefix, i)) {
      return true;
    }
  }
  return false;
}

// Takes a siteswap prefix in int list list form
// Returns the length of the shortest suffix
// No promises on whether or not the suffix will be vanilla.
function MinSuffixLen(prefix) {
  var len = 0;
  while (!ExistsSuffix(prefix, len)) {
    len++;
  }
  return len;
}

// Takes a siteswap prefix in int list list form
// Returns the length of the shortest suffix
// No promises on whether or not the suffix will be vanilla.
function MinVanillaSuffixLen(prefix) {
  var len = 0;
  while (!ExistsVanillaSuffix(prefix, len)) {
    len++;
  }
  return len;
}

// prefix is in int list list form
// len is an int
function GetSuffix(prefix, len) {
  // determine the drop sites of all throws
  var countdown = [];
  for (i = 0; i < prefix.length; i++) {
    for (j = 0; j < prefix[i].length; j++) {
      var index = (prefix[i][j] + i) % (prefix.length + len);
      if (countdown[index] === undefined) {
        countdown[index] = 1;
      } else {
        countdown[index] += 1;
      }
    }
  }

  // compute the drop state we want
  var ideal = [];
  for (i = 0; i < prefix.length + len; i++) {
    if (countdown[i] === undefined && prefix[i] === undefined) {
      ideal[i] = 1; // arbitrary choice
    } else if (countdown[i] === undefined) {
      ideal[i] = prefix[i].length;
    } else if (prefix[i] === undefined) {
      ideal[i] = countdown[i];
    } else {
      ideal[i] = Math.max(countdown[i], prefix[i].length);
    }
  }
  
  var want = []; // Places we need a throw to land: ideal - countdown
  for (i = 0; i < prefix.length + len; i++) {
    if (countdown[i] === undefined) {
      for (j = 0; j < ideal[i]; j++) {
        want.push(i);
      }
    } else {
      for (j = 0; j < ideal[i] - countdown[i]; j++) {
        want.push(i);
      }
    }
  }

  var have = []; // Places we need a throw to occur: ideal - prefix[i].length
  for (i = 0; i < prefix.length + len; i++) {
    if (prefix[i] === undefined) {
      for (j = 0; j < ideal[i]; j++) {
        have.push(i);
      }
    } else {
      for (j = 0; j < ideal[i] - prefix[i].length; j++) {
        have.push(i);
      }
    }
  }

  var ret = [];
  var suffix_index = 0;
  for (i = 0; i < want.length; i++) {
    suffix_index = have[i] - prefix.length;
    var toss = want[i] - have[i] + prefix.length + len;
    if (ret[suffix_index] === undefined) {
      ret[suffix_index] = [toss];
    } else {
      ret[suffix_index].push(toss);
    }
  }

  return ret;
}

// takes a prefix in int list list form
function GetMinSuffix(prefix) {
  return GetSuffix(prefix, MinSuffixLen(prefix));
}

// takes a prefix in int list list form
function GetMinVanillaSuffix(prefix) {
  return GetSuffix(prefix, MinVanillaSuffixLen(prefix));
}

function UpdateSuggestion(prefix) {
  // empty input
  if (!prefix) {
    suggestbox.options = ["531"];
    suggestbox.repaint();
    return;
  }
  
  ss_input = toSiteswap(prefix);

  if (document.getElementById("vanilla").checked) {
    if (ExistsAnyVanillaSuffix(ss_input)) { //
      ss_min_suffix = GetMinVanillaSuffix(ss_input);
      str_min_suffix = SSToString(ss_min_suffix);

      suggestbox.options = [prefix + str_min_suffix];
      suggestbox.repaint();
      $('#error').slideUp();
      return;
    } else {
      $('#error span').text('No valid suffixes exist');
      $('#error').slideDown();
    }
  } else if (document.getElementById("multiplex").checked) {
    if (ExistsAnySuffix(ss_input)) {
      ss_min_suffix = GetMinSuffix(ss_input);
      str_min_suffix = SSToString(ss_min_suffix);

      suggestbox.options = [prefix + str_min_suffix];
      suggestbox.repaint();
      $('#error').slideUp();
      return;
    } else {
      $('#error span').text('No valid suffixes exist');
      $('#error').slideDown();
    }
  } else {
    console.log("wtf");
  }
}
