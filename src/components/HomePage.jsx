import Navigation from '../components/Navigation';
import Hero from './Hero';
import SearchBar from '../components/SearchBar';
import ListingsSection from '../components/ListingsSection';
import TimingSection from '../components/TimingSection';
import MapSection from '../components/MapSection';
import EstimatorSection from './EstimatorSection';
import ChatbotSection from './ChatbotSection';
import PhotoAnalysisSection from '../components/PhotoAnalysisSection';
import Standing from '../components/standing';
import CtaSection from './CtaSection';
import Footer from './Footer';

const HomePage = () => {
  return (
    <>
      <Navigation />
      <Hero />
      <div className="section-spacer" />
      <SearchBar />
      <div className="section-spacer" />
      <ListingsSection />
      <div className="section-spacer" />
      <TimingSection />
      <div className="section-spacer" />
      <MapSection />
      <div className="section-spacer" />
      <EstimatorSection />
      <div className="section-spacer" />
      <ChatbotSection />
      <div className="section-spacer" />
      <PhotoAnalysisSection />
      <div className="section-spacer" />
      <Standing />
      <div className="section-spacer" />
      <CtaSection />
      <Footer />
    </>
  );
};

export default HomePage;