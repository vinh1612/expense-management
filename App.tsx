import React from 'react';
import AppNavigation from './src/navigation/index';
import GlobalLoadingOverlay from './src/components/GlobalLoadingOverlay';

export default function App() {

  return (
    <>
      <AppNavigation />
      <GlobalLoadingOverlay />
    </>
  )
}