# table row mover - jQuery Plugin

**DEMO : http://springbriz.github.io/table-row-mover/demo/initializr_bootstrap/**

you can move &lt;tr&gt; or &lt;tbody&gt; up, down, to the top, to the bottom.

### usage
```javascript
$('#sample-table').tableRowMover({
    rowTagName: 'tbody'
}, function($row) {
    $row.css('background-color', '#F2F2F2');
});
```

### first parameter - options
| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| rowTagName | string | 'tr' | 'tr' or 'tbody' |
| selectors | object | <ul><li>row: '.movable-table-row'</li><li>moveTop: '.move-top'</li><li>moveUp: '.move-up'</li><li>moveDown: '.move-down'</li><li>moveBottom: '.move-bottom'</li></ul> |  |
| animate | boolean | true | |
| animateDuration | string or integer | 'fast' | |
| animateEasing | string | 'swing' | |

### second parameter - complete callback
| Type | Arguments | Description |
| ---- | --------- | ----------- |
| function | row | <code>row</code> jQuery Object |

### Install using Bower
```
bower install table-row-mover
```

================
The MIT License.
