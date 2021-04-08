import React from 'react';

import { robot } from 'assets/images';

function App() {
  return (
    <div
      className={'w-screen h-screen flex flex-col justify-center items-center'}>
      <img src={robot} alt={'robot'} className={'w-40 h-40'} />
      <div className={'mt-3 flex flex-col items-center'}>
        <h1 className={'text-3xl'}>Blue Nebula</h1>
        <h3 className={'mt-2 text-xl'}>Coming Soon</h3>
      </div>
    </div>
  );
}

export default App;
