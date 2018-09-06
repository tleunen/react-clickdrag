import React from 'react';
import { findDOMNode } from 'react-dom';
import { mount } from 'enzyme';
import clickdrag from '../src/clickdrag';

const initialState = {
  isMouseDown: false,
  isMoving: false,
  mouseDownPositionX: 0,
  mouseDownPositionY: 0,
  moveDeltaX: 0,
  moveDeltaY: 0,
};

function mouseDownAt(node, x, y, rightClick) {
  node.dispatchEvent(
    new MouseEvent('mousedown', {
      button: rightClick ? 1 : 0,
      clientX: x,
      clientY: y,
    })
  );
}

function mouseMove(x, y, ctrl, shift, meta) {
  document.dispatchEvent(
    new MouseEvent('mousemove', {
      clientX: x,
      clientY: y,
      shiftKey: !!shift,
      metaKey: !!meta,
      ctrlKey: !!ctrl,
    })
  );
}

it('should render the given component', () => {
  const Comp = () => <div>Hello</div>;
  const DecoraredComp = clickdrag(Comp);
  const wrapper = mount(<DecoraredComp />);

  expect(wrapper.html()).toEqual('<div>Hello</div>');
});

it('should have a default state on first render', () => {
  const Comp = () => <div>Hello</div>;
  const DecoraredComp = clickdrag(Comp);
  const wrapper = mount(<DecoraredComp />);

  expect(wrapper.state()).toEqual(initialState);
});

describe('attach/detach events', () => {
  let spyAttach;
  let spyDetach;

  beforeEach(() => {
    spyAttach = jest.spyOn(document, 'addEventListener').mockImplementation(() => jest.fn());
    spyDetach = jest.spyOn(document, 'removeEventListener').mockImplementation(() => jest.fn());
  });

  afterEach(() => {
    spyAttach.mockRestore();
    spyDetach.mockRestore();
  });

  it('should attach events on document', () => {
    const Comp = () => <div>Hello</div>;
    const DecoraredComp = clickdrag(Comp);

    mount(<DecoraredComp />);

    expect(spyAttach).toHaveBeenCalledTimes(2);
    expect(spyAttach.mock.calls[0][0]).toBe('mousemove');
    expect(spyAttach.mock.calls[1][0]).toBe('mouseup');
  });

  it('should detach events on document', () => {
    const Comp = () => <div>Hello</div>;
    const DecoraredComp = clickdrag(Comp);

    const wrapper = mount(<DecoraredComp />);

    wrapper.unmount();

    expect(spyDetach).toHaveBeenCalledTimes(2);
    expect(spyDetach.mock.calls[0][0]).toBe('mousemove');
    expect(spyDetach.mock.calls[1][0]).toBe('mouseup');
  });
});

describe('mousedown', () => {
  it('should set the mouse position and isMouseDown on left mousedown', () => {
    const Comp = () => <div>Hello</div>;
    const DecoraredComp = clickdrag(Comp);
    const wrapper = mount(<DecoraredComp />);

    // because we manually listen on the node, we cannot use enzyme simulate
    mouseDownAt(findDOMNode(wrapper.instance()), 132, 642);

    expect(wrapper.state()).toEqual({
      ...initialState,
      isMouseDown: true,
      mouseDownPositionX: 132,
      mouseDownPositionY: 642,
    });
  });

  it('should not set the mouse position on right mousedown', () => {
    const Comp = () => <div>Hello</div>;
    const DecoraredComp = clickdrag(Comp);
    const wrapper = mount(<DecoraredComp />);

    // because we manually listen on the node, we cannot use enzyme simulate
    mouseDownAt(findDOMNode(wrapper.instance()), 1, 6, true);

    expect(wrapper.state()).toEqual(initialState);
  });
});

describe('mouseup', () => {
  it('should not update the sate without previously down', () => {
    const Comp = () => <div>Hello</div>;
    const DecoraredComp = clickdrag(Comp);
    const wrapper = mount(<DecoraredComp />);

    document.dispatchEvent(new MouseEvent('mouseup'));

    expect(wrapper.state()).toEqual(initialState);
  });

  it('should reset isMouseDown', () => {
    const Comp = () => <div>Hello</div>;
    const DecoraredComp = clickdrag(Comp);
    const wrapper = mount(<DecoraredComp />);

    mouseDownAt(findDOMNode(wrapper.instance()), 132, 642);
    document.dispatchEvent(new MouseEvent('mouseup'));

    expect(wrapper.state()).toEqual({
      ...initialState,
      isMouseDown: false,
      mouseDownPositionX: 132,
      mouseDownPositionY: 642,
    });
  });
});

describe('mousemove', () => {
  it('should not update the sate without previously down', () => {
    const Comp = () => <div>Hello</div>;
    const DecoraredComp = clickdrag(Comp);
    const wrapper = mount(<DecoraredComp />);

    document.dispatchEvent(new MouseEvent('mousemove'));

    expect(wrapper.state()).toEqual(initialState);
  });

  it('should set the move delta values', () => {
    const Comp = () => <div>Hello</div>;
    const DecoraredComp = clickdrag(Comp);
    const wrapper = mount(<DecoraredComp />);

    mouseDownAt(findDOMNode(wrapper.instance()), 100, 150);
    mouseMove(50, 125);

    expect(wrapper.state()).toEqual({
      isMouseDown: true,
      isMoving: true,
      mouseDownPositionX: 100,
      mouseDownPositionY: 150,
      moveDeltaX: -50,
      moveDeltaY: -25,
    });
  });

  it('should also set the specified custom event data', () => {
    const Comp = () => <div>Hello</div>;
    const DecoraredComp = clickdrag(Comp, {
      getSpecificEventData: e => ({
        shiftKey: e.shiftKey,
        ctrlKey: e.ctrlKey,
      }),
    });
    const wrapper = mount(<DecoraredComp />);

    mouseDownAt(findDOMNode(wrapper.instance()), 100, 150);
    mouseMove(50, 125, false, true);

    expect(wrapper.state()).toEqual({
      isMouseDown: true,
      isMoving: true,
      mouseDownPositionX: 100,
      mouseDownPositionY: 150,
      moveDeltaX: -50,
      moveDeltaY: -25,
      shiftKey: true,
      ctrlKey: false,
    });
  });

  it('should not reset the mouse position when clicking on a special key', () => {
    const Comp = () => <div>Hello</div>;
    const DecoraredComp = clickdrag(Comp, {
      getSpecificEventData: e => ({
        ctrlKey: e.ctrlKey,
      }),
    });
    const wrapper = mount(<DecoraredComp />);

    mouseDownAt(findDOMNode(wrapper.instance()), 100, 150);
    mouseMove(50, 125);
    mouseMove(1, 173, true);

    expect(wrapper.state()).toEqual({
      isMouseDown: true,
      isMoving: true,
      mouseDownPositionX: 100,
      mouseDownPositionY: 150,
      moveDeltaX: -99,
      moveDeltaY: 23,
      ctrlKey: true,
    });
  });

  it('should reset the mouse position when clicking on a special key, with resetOnSpecialKeys', () => {
    const Comp = () => <div>Hello</div>;
    const DecoraredComp = clickdrag(Comp, {
      resetOnSpecialKeys: true,
      getSpecificEventData: e => ({
        ctrlKey: e.ctrlKey,
      }),
    });
    const wrapper = mount(<DecoraredComp />);

    mouseDownAt(findDOMNode(wrapper.instance()), 100, 150);
    mouseMove(50, 125);
    mouseMove(1, 173, true);
    mouseMove(1, 174, true);

    expect(wrapper.state()).toEqual({
      isMouseDown: true,
      isMoving: true,
      mouseDownPositionX: 1,
      mouseDownPositionY: 173,
      moveDeltaX: 0,
      moveDeltaY: 1,
      ctrlKey: true,
    });
  });
});

describe('handle touch events', () => {
  describe('attach/detach events', () => {
    let spyAttach;
    let spyDetach;

    beforeEach(() => {
      spyAttach = jest.spyOn(document, 'addEventListener').mockImplementation(() => jest.fn());
      spyDetach = jest.spyOn(document, 'removeEventListener').mockImplementation(() => jest.fn());
    });

    afterEach(() => {
      spyAttach.mockRestore();
      spyDetach.mockRestore();
    });

    it('should attach events on document', () => {
      const Comp = () => <div>Hello</div>;
      const DecoraredComp = clickdrag(Comp, { touch: true });

      mount(<DecoraredComp />);

      expect(spyAttach).toHaveBeenCalledTimes(4);
      expect(spyAttach.mock.calls[2][0]).toBe('touchmove');
      expect(spyAttach.mock.calls[3][0]).toBe('touchend');
    });

    it('should detach events on document', () => {
      const Comp = () => <div>Hello</div>;
      const DecoraredComp = clickdrag(Comp, { touch: true });

      const wrapper = mount(<DecoraredComp />);

      wrapper.unmount();

      expect(spyDetach).toHaveBeenCalledTimes(4);
      expect(spyDetach.mock.calls[2][0]).toBe('touchmove');
      expect(spyDetach.mock.calls[3][0]).toBe('touchend');
    });
  });

  // describe('touchstart', () => {
  //     it('should set the mouse position and isMouseDown', () => {
  //         const Comp = () => <div>Hello</div>;
  //         const DecoraredComp = clickdrag(Comp, { touch: true });
  //         const wrapper = mount(<DecoraredComp />);
  //
  //         findDOMNode(wrapper.instance()).dispatchEvent(new MouseEvent('touchstart', {
  //             changedTouches: [{
  //                 clientX: 1,
  //                 clientY: 4
  //             }]
  //         }));
  //
  //         expect(wrapper.state()).toBe({
  //             ...initialState,
  //             isMouseDown: true,
  //             mouseDownPositionX: 123,
  //             mouseDownPositionY: 321
  //         });
  //     });
  // });
});
