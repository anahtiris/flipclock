export function pad2(n: number): readonly [string, string] {
  const s = n.toString().padStart(2, '0')
  return [s.charAt(0), s.charAt(1)] as const
}
