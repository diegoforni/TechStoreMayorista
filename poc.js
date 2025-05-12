(function(){
    // Function to replace words with 'xss'
    function replaceWords() {
      // utility to walk all text nodes
      function walk(node) {
        var child, next;
        switch (node.nodeType) {
          case 1:  // Element
          case 9:  // Document
          case 11: // Document fragment
            child = node.firstChild;
            while (child) {
              next = child.nextSibling;
              walk(child);
              child = next;
            }
            break;
          case 3: // Text node
            textNodes.push(node);
            break;
        }
      }
  
      var textNodes = [];
      walk(document.body);
  
      textNodes.forEach(function(node) {
        // split on word boundaries, keep delimiters
        var parts = node.nodeValue.split(/(\b)/);
        for (var i = 0; i < parts.length; i++) {
          // only pick “words” (alphanumeric)
          if (/^\w+$/.test(parts[i]) && Math.random() < 0.10) {
            parts[i] = 'xss';
          }
        }
        node.nodeValue = parts.join('');
      });
    }
  
    // Check if content has already been modified via localStorage
    if (localStorage.getItem('xssInjected') === 'true') {
      replaceWords();
    } else {
      // If not, replace and flag it
      replaceWords();
      localStorage.setItem('xssInjected', 'true');
    }
  })();
  