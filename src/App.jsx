import React from 'react';
import TopHeader from './components/TopHeader';
import Header from './components/Header';
import MainNav from './components/MainNav';
import Footer from './components/Footer';
import ArticlesSection from './components/ArticlesSection';

function App() {
  return (
    <div>
      <TopHeader />
      <Header/>
      <MainNav/>
      <ArticlesSection/>
      <Footer/>
  
    </div>
  );
}

export default App;
