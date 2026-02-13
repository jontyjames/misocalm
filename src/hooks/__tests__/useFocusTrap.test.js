import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import useFocusTrap from '../useFocusTrap';

describe('useFocusTrap', () => {
  let container;
  let containerRef;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = `
      <button id="btn1">First</button>
      <input id="input1" />
      <button id="btn2">Last</button>
    `;
    document.body.appendChild(container);
    containerRef = { current: container };
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('focuses first focusable element on activation', () => {
    renderHook(() => useFocusTrap(containerRef, true));
    expect(document.activeElement).toBe(container.querySelector('#btn1'));
  });

  it('does not trap focus when inactive', () => {
    const prevFocus = document.activeElement;
    renderHook(() => useFocusTrap(containerRef, false));
    expect(document.activeElement).toBe(prevFocus);
  });

  it('restores focus on unmount', () => {
    const outsideButton = document.createElement('button');
    document.body.appendChild(outsideButton);
    outsideButton.focus();

    const { unmount } = renderHook(() => useFocusTrap(containerRef, true));
    expect(document.activeElement).toBe(container.querySelector('#btn1'));

    unmount();
    expect(document.activeElement).toBe(outsideButton);

    document.body.removeChild(outsideButton);
  });
});
