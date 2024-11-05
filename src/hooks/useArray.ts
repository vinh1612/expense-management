import React from "react";

export default function useArray<T>(defaultValue: T[]) {
  const [array, setNewArray] = React.useState<T[]>(defaultValue);

  function push(element: T) {
    setNewArray((a) => [...a, element]);
  }

  function unshift(element: T) {
    setNewArray((a) => [element, ...a]);
  }

  function filter(callback: (value: T, index: number, array: T[]) => boolean) {
    setNewArray((a) => a.filter(callback));
  }

  function updateAt(index: number, newElement: T) {
    setNewArray((a) => [...a.slice(0, index), newElement, ...a.slice(index + 1, a.length)]);
  }

  function removeAt(index: number) {
    setNewArray((a) => [...a.slice(0, index), ...a.slice(index + 1, a.length)]);
  }

  function clear() {
    setNewArray([]);
  }

  return { array, set: setNewArray, push, unshift, filter, updateAt, removeAt, clear };
}