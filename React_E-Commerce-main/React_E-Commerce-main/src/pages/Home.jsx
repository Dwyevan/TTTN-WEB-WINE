import { Navbar, Main, Categories, BestSellers, FeaturedWine, Newsletter, PairingGuide, Footer } from "../components";

function Home() {
  return (
    <div style={{ background: '#f5efe6' }}>
      <Navbar />
      <Main />
      <BestSellers />
      <FeaturedWine />
      <Categories />
      <PairingGuide />
      <Newsletter />
      <Footer />
    </div>
  )
}

export default Home;