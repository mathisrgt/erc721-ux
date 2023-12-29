import Link from "next/link"
import ChainInfo from "./chainInfo/page"
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
  return (
    <main className="m-4">
      <ChainInfo />
      
      <div>
        <Link href="fakeBayc">
          <button type="button" className="btn btn-primary">
            FakeBayc
          </button>
        </Link>
      </div>

      <div className="mt-2">
        <Link href="fakeNefturians">
          <button type="button" className="btn btn-primary">
            FakeNefturians
          </button>
        </Link>
      </div>

      <div className="mt-2">
        <Link href="fakeMeebits">
          <button type="button" className="btn btn-primary">
            FakeMeebits
          </button>
        </Link>
      </div>
    </main>
  )
}
