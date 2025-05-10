// FlashDeals.jsx
const FlashDeals = () => {
  return (
    <section className="flash-deals">
      <div className="container">
        <h2 className="section-title">Ofertas fugaces</h2>
        <div className="countdown-timer">
          <div className="time-block">
            <div className="time-value">03</div>
            <div className="time-label">Días</div>
          </div>
          <div className="time-separator">:</div>
          <div className="time-block">
            <div className="time-value">23</div>
            <div className="time-label">Horas</div>
          </div>
          <div className="time-separator">:</div>
          <div className="time-block">
            <div className="time-value">19</div>
            <div className="time-label">Minutos</div>
          </div>
          <div className="time-separator">:</div>
          <div className="time-block">
            <div className="time-value">56</div>
            <div className="time-label">Segundos</div>
          </div>
        </div>
      </div>
    </section>
  );
};


export default FlashDeals