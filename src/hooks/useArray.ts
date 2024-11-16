import React from "react";

export default function useArray<T>(defaultValue: T[]) {
  const [array, setArray] = React.useState<T[]>(defaultValue);

  function push(element: T) {
    setArray((a) => [...a, element]);
  }

  function unshift(element: T) {
    setArray((a) => [element, ...a]);
  }

  function filter(callback: (value: T, index: number, array: T[]) => boolean) {
    setArray((a) => a.filter(callback));
  }

  function updateAt(index: number, newElement: T) {
    setArray((a) => [...a.slice(0, index), newElement, ...a.slice(index + 1, a.length)]);
  }

  function removeAt(index: number) {
    setArray((a) => [...a.slice(0, index), ...a.slice(index + 1, a.length)]);
  }

  function clear() {
    setArray([]);
  }

  return { array, set: setArray, push, unshift, filter, updateAt, removeAt, clear };
}