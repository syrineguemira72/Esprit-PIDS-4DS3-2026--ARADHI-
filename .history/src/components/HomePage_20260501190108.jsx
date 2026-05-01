import Navigation from './Navigation';
import Hero from './Hero';
import SearchBar from '../components/SearchBar';
import ListingsSection from '../components/ListingsSection';
import TimingSection from '../components/TimingSection';
import MapSection from '../components/MapSection';
import EstimatorSection from './EstimatorSection';
import ChatbotSection from './ChatbotSection';
import PhotoAnalysisSection from '../components/PhotoAnalysisSection';
import CtaSection from './CtaSection';
import Footer from './Footer';

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