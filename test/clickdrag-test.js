/* eslint-env mocha */
import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import clickdrag from '../src/clickdrag';

const initialState = {
    isMouseDown: false,
    isMoving: false,
    mouseDownPositionX: 0,
    mouseDownPositionY: 0,
    moveDeltaX: 0,
    moveDeltaY: 0
};

function mouseDownAt(node, x, y, rightClick) {
    node.dispatchEvent(new MouseEvent('mousedown', {
        button: rightClick ? 1 : 0,
        clientX: x,
        clientY: y
    }));
}

function mouseMove(x, y, ctrl, shift, meta) {
    document.dispatchEvent(new MouseEvent('mousemove', {
        clientX: x,
        clientY: y,
        shiftKey: !!shift,
        metaKey: !!meta,
        ctrlKey: !!ctrl
    }));
}

it('should render the given component', () => {
    const Comp = () => <div>Hello</div>;
    const DecoraredComp = clickdrag(Comp);
    const wrapper = mount(<DecoraredComp />);

    expect(wrapper.html()).to.equal('<div>Hello</div>');
});

it('should have a default state on first render', () => {
    const Comp = () => <div>Hello</div>;
    const DecoraredComp = clickdrag(Comp);
    const wrapper = mount(<DecoraredComp />);

    expect(wrapper.state()).to.eql(initialState);
});

describe('attach/detach events', () => {
    const spyAttach = sinon.spy();
    const spyDetach = sinon.spy();
    let stubAttach;
    let stubDetach;

    beforeEach(() => {
        stubAttach = sinon.stub(document, 'addEventListener', spyAttach);
        stubDetach = sinon.stub(document, 'removeEventListener', spyDetach);
    });

    afterEach(() => {
        stubAttach.restore();
        stubDetach.restore();
    });

    it('should attach events on document', () => {
        const Comp = () => <div>Hello</div>;
        const DecoraredComp = clickdrag(Comp);

        mount(<DecoraredComp />);

        expect(spyAttach.calledWith('mouseup')).to.equal(true);
        expect(spyAttach.calledWith('mousemove')).to.equal(true);
    });

    it('should detach events on document', () => {
        const Comp = () => <div>Hello</div>;
        const DecoraredComp = clickdrag(Comp);

        const wrapper = mount(<DecoraredComp />);

        wrapper.unmount();

        expect(spyDetach.calledWith('mouseup')).to.equal(true);
        expect(spyDetach.calledWith('mousemove')).to.equal(true);
    });
});

describe('mousedown', () => {
    it('should set the mouse position and isMouseDown on left mousedown', () => {
        const Comp = () => <div>Hello</div>;
        const DecoraredComp = clickdrag(Comp);
        const wrapper = mount(<DecoraredComp />);

        // because we manually listen on the node, we cannot use enzyme simulate
        mouseDownAt(findDOMNode(wrapper.node), 132, 642);

        expect(wrapper.state()).to.eql({
            ...initialState,
            isMouseDown: true,
            mouseDownPositionX: 132,
            mouseDownPositionY: 642
        });
    });

    it('should not set the mouse position on right mousedown', () => {
        const Comp = () => <div>Hello</div>;
        const DecoraredComp = clickdrag(Comp);
        const wrapper = mount(<DecoraredComp />);

        // because we manually listen on the node, we cannot use enzyme simulate
        mouseDownAt(findDOMNode(wrapper.node), 1, 6, true);

        expect(wrapper.state()).to.eql(initialState);
    });
});

describe('mouseup', () => {
    it('should not update the sate without previously down', () => {
        const Comp = () => <div>Hello</div>;
        const DecoraredComp = clickdrag(Comp);
        const wrapper = mount(<DecoraredComp />);

        document.dispatchEvent(new MouseEvent('mouseup'));

        expect(wrapper.state()).to.eql(initialState);
    });

    it('should reset isMouseDown', () => {
        const Comp = () => <div>Hello</div>;
        const DecoraredComp = clickdrag(Comp);
        const wrapper = mount(<DecoraredComp />);

        mouseDownAt(findDOMNode(wrapper.node), 132, 642);
        document.dispatchEvent(new MouseEvent('mouseup'));

        expect(wrapper.state()).to.eql({
            ...initialState,
            isMouseDown: false,
            mouseDownPositionX: 132,
            mouseDownPositionY: 642
        });
    });
});

describe('mousemove', () => {
    it('should not update the sate without previously down', () => {
        const Comp = () => <div>Hello</div>;
        const DecoraredComp = clickdrag(Comp);
        const wrapper = mount(<DecoraredComp />);

        document.dispatchEvent(new MouseEvent('mousemove'));

        expect(wrapper.state()).to.eql(initialState);
    });

    it('should set the move delta values', () => {
        const Comp = () => <div>Hello</div>;
        const DecoraredComp = clickdrag(Comp);
        const wrapper = mount(<DecoraredComp />);

        mouseDownAt(findDOMNode(wrapper.node), 100, 150);
        mouseMove(50, 125);

        expect(wrapper.state()).to.eql({
            isMouseDown: true,
            isMoving: true,
            mouseDownPositionX: 100,
            mouseDownPositionY: 150,
            moveDeltaX: -50,
            moveDeltaY: -25
        });
    });

    it('should also set the specified custom event data', () => {
        const Comp = () => <div>Hello</div>;
        const DecoraredComp = clickdrag(Comp, {
            getSpecificEventData: (e) => ({
                shiftKey: e.shiftKey,
                ctrlKey: e.ctrlKey
            }),
        });
        const wrapper = mount(<DecoraredComp />);

        mouseDownAt(findDOMNode(wrapper.node), 100, 150);
        mouseMove(50, 125, false, true);

        expect(wrapper.state()).to.eql({
            isMouseDown: true,
            isMoving: true,
            mouseDownPositionX: 100,
            mouseDownPositionY: 150,
            moveDeltaX: -50,
            moveDeltaY: -25,
            shiftKey: true,
            ctrlKey: false
        });
    });

    it('should not reset the mouse position when clicking on a special key', () => {
        const Comp = () => <div>Hello</div>;
        const DecoraredComp = clickdrag(Comp, {
            getSpecificEventData: (e) => ({
                ctrlKey: e.ctrlKey
            }),
        });
        const wrapper = mount(<DecoraredComp />);

        mouseDownAt(findDOMNode(wrapper.node), 100, 150);
        mouseMove(50, 125);
        mouseMove(1, 173, true);

        expect(wrapper.state()).to.eql({
            isMouseDown: true,
            isMoving: true,
            mouseDownPositionX: 100,
            mouseDownPositionY: 150,
            moveDeltaX: -99,
            moveDeltaY: 23,
            ctrlKey: true
        });
    });

    it('should reset the mouse position when clicking on a special key, with resetOnSpecialKeys', () => {
        const Comp = () => <div>Hello</div>;
        const DecoraredComp = clickdrag(Comp, {
            resetOnSpecialKeys: true,
            getSpecificEventData: (e) => ({
                ctrlKey: e.ctrlKey
            }),
        });
        const wrapper = mount(<DecoraredComp />);

        mouseDownAt(findDOMNode(wrapper.node), 100, 150);
        mouseMove(50, 125);
        mouseMove(1, 173, true);
        mouseMove(1, 174, true);

        expect(wrapper.state()).to.eql({
            isMouseDown: true,
            isMoving: true,
            mouseDownPositionX: 1,
            mouseDownPositionY: 173,
            moveDeltaX: 0,
            moveDeltaY: 1,
            ctrlKey: true
        });
    });
});

describe('handle touch events', () => {
    describe('attach/detach events', () => {
        const spyAttach = sinon.spy();
        const spyDetach = sinon.spy();
        let stubAttach;
        let stubDetach;

        beforeEach(() => {
            stubAttach = sinon.stub(document, 'addEventListener', spyAttach);
            stubDetach = sinon.stub(document, 'removeEventListener', spyDetach);
        });

        afterEach(() => {
            stubAttach.restore();
            stubDetach.restore();
        });

        it('should attach events on document', () => {
            const Comp = () => <div>Hello</div>;
            const DecoraredComp = clickdrag(Comp, { touch: true });

            mount(<DecoraredComp />);

            expect(spyAttach.calledWith('touchmove')).to.equal(true);
            expect(spyAttach.calledWith('touchend')).to.equal(true);
        });

        it('should detach events on document', () => {
            const Comp = () => <div>Hello</div>;
            const DecoraredComp = clickdrag(Comp, { touch: true });

            const wrapper = mount(<DecoraredComp />);

            wrapper.unmount();

            expect(spyDetach.calledWith('touchmove')).to.equal(true);
            expect(spyDetach.calledWith('touchend')).to.equal(true);
        });
    });

    // describe('touchstart', () => {
    //     it('should set the mouse position and isMouseDown', () => {
    //         const Comp = () => <div>Hello</div>;
    //         const DecoraredComp = clickdrag(Comp, { touch: true });
    //         const wrapper = mount(<DecoraredComp />);
    //
    //         findDOMNode(wrapper.node).dispatchEvent(new MouseEvent('touchstart', {
    //             changedTouches: [{
    //                 clientX: 1,
    //                 clientY: 4
    //             }]
    //         }));
    //
    //         expect(wrapper.state()).to.eql({
    //             ...initialState,
    //             isMouseDown: true,
    //             mouseDownPositionX: 123,
    //             mouseDownPositionY: 321
    //         });
    //     });
    // });
});
