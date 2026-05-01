import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import SearchBar from '../components/SearchBar';
import ListingsSection from '../components/ListingsSection';
import TimingSection from '../components/TimingSection';
import MapSection from '../components/MapSection';
import EstimatorSection from '../components/EstimatorSection';
import ChatbotSection from '../components/ChatbotSection';
import PhotoAnalysisSection from '../components/PhotoAnalysisSection';
import CtaSection from '../components/CtaSection';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <>
      <Navigation />
      <Hero />
      <SearchBar />
      <ListingsSection />
      <TimingSection />
      <MapSection />
      <EstimatorSection />
      <ChatbotSection />
      <PhotoAnalysisSection />
      <CtaSection />
      <Footer />
    </>
  );
};

export default HomePage;