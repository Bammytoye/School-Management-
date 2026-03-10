import HeroSection from './HeroSection'
import FeaturesSection from './FeaturesSection'
import HowItWorks from './HowItWorks'
import StatsSection from './StatsSection'
import Testimonials from './Testimonials'
import CTASection from './CTASection'
import Footer from './Footer'

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans">
            <HeroSection />
            <FeaturesSection />
            <HowItWorks />
            <StatsSection />
            <Testimonials />
            <CTASection />
            <Footer />
        </div>
    )
}