export function getGuid() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) => {
    const cInt = parseInt(c);
    return (
      cInt ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (cInt / 4)))
    ).toString(16);
  });
}
