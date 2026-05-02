import { useState } from 'react';
import ThreeBg from '../components/ThreeBg';

const EmiCalculator = () => {
  const [price, setPrice] = useState(100000);
  const [downPayment, setDownPayment] = useState(20000);
  const [interestRate, setInterestRate] = useState(10);
  const [loanTenure, setLoanTenure] = useState(24);
  const [result, setResult] = useState(null);

  const calculateEMI = () => {
    const p = parseFloat(price);
    const dp = parseFloat(downPayment);
    const rYearly = parseFloat(interestRate);
    const m = parseInt(loanTenure);

    if (isNaN(p) || isNaN(dp) || isNaN(rYearly) || isNaN(m) || p <= 0 || m <= 0) {
      alert("Please enter valid numbers in all fields.");
      return;
    }

    if (dp >= p) {
      alert("Down payment cannot be greater than or equal to the bike price.");
      return;
    }

    const principal = p - dp;
    const rMonthly = rYearly / 12 / 100;
    
    let emi = 0;
    if (rMonthly === 0) {
      emi = principal / m;
    } else {
      emi = (principal * rMonthly * Math.pow(1 + rMonthly, m)) / (Math.pow(1 + rMonthly, m) - 1);
    }

    const totalPayable = emi * m;
    const totalInterest = totalPayable - principal;

    setResult({
      emi: Math.round(emi),
      principal: Math.round(principal),
      totalInterest: Math.round(totalInterest),
      totalPayable: Math.round(totalPayable)
    });
  };

  return (
    <>
      <ThreeBg />
      <section className="calculator-section">
        <h1 className="glow" style={{ fontSize: '40px' }}>EMI Calculator</h1>
        <p style={{ marginBottom: '30px', color: '#aaa' }}>Plan your premium ride with ease</p>

        <div className="calc-container bike-card">
          <div className="input-group">
            <label htmlFor="bikePrice">Bike Price (₹)</label>
            <input type="number" id="bikePrice" placeholder="e.g. 150000" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>

          <div className="input-group">
            <label htmlFor="downPayment">Down Payment (₹)</label>
            <input type="number" id="downPayment" placeholder="e.g. 30000" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} />
          </div>

          <div className="input-group">
            <label htmlFor="interestRate">Interest Rate (% p.a.)</label>
            <input type="number" id="interestRate" placeholder="e.g. 10.5" value={interestRate} step="0.1" onChange={(e) => setInterestRate(e.target.value)} />
          </div>

          <div className="input-group">
            <label htmlFor="loanTenure">Loan Tenure (Months)</label>
            <input type="number" id="loanTenure" placeholder="e.g. 24" value={loanTenure} onChange={(e) => setLoanTenure(e.target.value)} />
          </div>

          <button className="solid-btn" onClick={calculateEMI} style={{ width: '100%', marginTop: '10px' }}>Calculate EMI</button>

          {result && (
            <div className="result-box" style={{ display: 'block', animation: 'fadeIn 0.5s ease-in-out' }}>
              <h3>Your Monthly EMI</h3>
              <h2 className="glow" style={{ fontSize: '36px', margin: '10px 0' }}>₹ {result.emi.toLocaleString('en-IN')}</h2>
              <div className="breakdown">
                <p>Principal Amount: <span>₹ {result.principal.toLocaleString('en-IN')}</span></p>
                <p>Total Interest: <span>₹ {result.totalInterest.toLocaleString('en-IN')}</span></p>
                <p>Total Amount Payable: <span>₹ {result.totalPayable.toLocaleString('en-IN')}</span></p>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default EmiCalculator;
