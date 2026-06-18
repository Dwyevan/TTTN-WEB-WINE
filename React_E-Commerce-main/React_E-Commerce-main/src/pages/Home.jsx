import { Navbar, Main, Product, Footer } from "../components";

function Home() {
  return (
    <>
      <Navbar />
      <Main />
      <Product isHome={true} />
      <Footer />
    </>
  )
}

export default Home