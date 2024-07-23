import React from 'react';

const Main = () => {
  return (
    <div id="main">
      <section className="wrapper style1">
        <div className="inner">
          <header className="align-center">
            <h2>Nam eu nisi non ante sodale</h2>
            <p>Cras sagittis turpis sit amet est tempus, sit amet consectetur purus tincidunt.</p>
          </header>
          <div className="flex flex-2">
            <div className="video col">
              <div className="image fit">
                <img src={`${process.env.PUBLIC_URL}/assets/images/pic07.jpg`} alt="" />
                <div className="arrow">
                  <div className="icon fa-play"></div>
                </div>
              </div>
              <p className="caption">Pellentesque at nunc vitae urna suscipit mollis nec in arcu</p>
              <a href="generic.html" className="link"><span>Click Me</span></a>
            </div>
            <div className="video col">
              <div className="image fit">
                <img src={`${process.env.PUBLIC_URL}/assets/images/pic08.jpg`} alt="" />
                <div className="arrow">
                  <div className="icon fa-play"></div>
                </div>
              </div>
              <p className="caption">Morbi mattis ligula ut eros ipsum aliquam iaculis dictum suscipit</p>
              <a href="generic.html" className="link"><span>Click Me</span></a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Main;

