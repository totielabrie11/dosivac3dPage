// src/components/Home/Banner.jsx
import React from 'react';

const Banner = () => {
  return (
    <section id="banner" data-video="/images/banner">
      <div className="inner">
        <header>
          <h1>This is Broadcast</h1>
          <p>Morbi eu purus eget urna interdum dignissim sed consectetur augue<br />
            vivamus vitae libero in nulla iaculis eleifend non sit amet nulla.</p>
        </header>
        <a href="#main" className="button big alt scrolly">Dignissim</a>
      </div>
    </section>
  );
};

export default Banner;
