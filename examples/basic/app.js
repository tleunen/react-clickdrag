'use strict';

var React = require('react');
//var clickDrag = require('../..'); // for some reasons, the code is broken with this code, even if it's the same, bug entered https://github.com/substack/node-browserify/issues/1181
var clickDrag = require('./clickDrag');


var ExampleComponent = React.createClass({

    getInitialState: function() {
        return {
            lastPositionX: 0,
            lastPositionY: 0,
            currentX: 0,
            currentY: 0
        };
    },

    componentWillReceiveProps: function(nextProps) {
        if(nextProps.dataDrag.isMoving) {
            this.setState({
                currentX: this.state.lastPositionX + nextProps.dataDrag.moveDeltaX,
                currentY: this.state.lastPositionY + nextProps.dataDrag.moveDeltaY
            });
        }
        else {
            this.setState({
                lastPositionX: this.state.currentX,
                lastPositionY: this.state.currentY
            });
        }
    },

    render: function () {
        var translation = 'translate('+this.state.currentX+'px, '+this.state.currentY+'px)';

        return React.createElement('div', {
            style: {width: '200px', height: '200px', backgroundColor: 'red', transform: translation}
        });
    }
});

var ClickDragExample = clickDrag(ExampleComponent);

React.render(React.createElement(ClickDragExample), document.getElementById('App'));