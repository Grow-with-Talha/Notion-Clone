import Footer from "./_components/Footer"
import Heroes from "./_components/Heroes"
import Heading from "./_components/heading"

const MarketingPage = () => {
  return (
    <div className='min-h-full flex flex-col'>
      <div className='flex flex-col items-center dark:bg-[#1f1f1f] justify-center md:justify-start text-center gap-y-8 flex-1 px-6 pb-0'>
        <Heading />
        <Heroes />
      </div>
      <Footer />
    </div>
  )
}

export default MarketingPage
