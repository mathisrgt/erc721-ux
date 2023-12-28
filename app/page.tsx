import Link from "next/link"
import ChainInfo from "./chainInfo/page"

export default function Home() {
  return (
    <main>
      <ChainInfo/>
      <Link href="fakeBayc">-> FakeBayc</Link>
      <Link href="fakeNefturians">-> FakeNefturians</Link>
      <Link href="fakeMeebits">-> FakeMeebits</Link>
    </main>
  )
}
