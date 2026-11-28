export default function UsageMeter({ used, limit }: { used: number; limit: number }) {
  return (
    <p>
      {used} of {limit} lists
    </p>
  )
}
