import { useState } from 'react';
import { Calculator, IndianRupee, TrendingUp, Clock, ArrowRight, Info } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

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

  const inputGroups = [
    {
      id: 'bikePrice',
      label: 'Bike Price',
      value: price,
      setter: setPrice,
      placeholder: 'e.g. 150000',
      prefix: '₹',
      icon: <IndianRupee size={16} />,
    },
    {
      id: 'downPayment',
      label: 'Down Payment',
      value: downPayment,
      setter: setDownPayment,
      placeholder: 'e.g. 30000',
      prefix: '₹',
      icon: <IndianRupee size={16} />,
    },
    {
      id: 'interestRate',
      label: 'Interest Rate (per annum)',
      value: interestRate,
      setter: setInterestRate,
      placeholder: 'e.g. 10.5',
      step: '0.1',
      suffix: '%',
      icon: <TrendingUp size={16} />,
    },
    {
      id: 'loanTenure',
      label: 'Loan Tenure',
      value: loanTenure,
      setter: setLoanTenure,
      placeholder: 'e.g. 24',
      suffix: 'months',
      icon: <Clock size={16} />,
    },
  ];

  return (
    <>
      <section className="calculator-section">
        <ScrollReveal animation="fade">
          <div style={{ marginBottom: 'var(--space-8)' }}>
            <span className="section-label"><span className="section-icon"><IndianRupee size={16} /></span> Finance</span>
            <h1 style={{ fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-3)' }}>EMI Calculator</h1>
            <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto' }}>Plan your premium ride with ease. Calculate your monthly EMI in seconds.</p>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="scale" delay={100}>
          <div className="calc-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
            <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--primary)' }}>
              <Calculator size={20} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', fontWeight: 700 }}>Calculate Your EMI</h3>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Enter your loan details below</p>
            </div>
          </div>

          {inputGroups.map(input => (
            <div key={input.id} className="input-group">
              <label htmlFor={input.id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>{input.icon}</span>
                {input.label}
              </label>
              <div style={{ position: 'relative' }}>
                {input.prefix && (
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: 600, pointerEvents: 'none' }}>{input.prefix}</span>
                )}
                <input
                  type="number"
                  id={input.id}
                  placeholder={input.placeholder}
                  value={input.value}
                  step={input.step || undefined}
                  onChange={(e) => input.setter(e.target.value)}
                  style={{
                    paddingLeft: input.prefix ? '36px' : '16px',
                    paddingRight: input.suffix ? '70px' : '16px',
                  }}
                />
                {input.suffix && (
                  <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 'var(--text-sm)', pointerEvents: 'none' }}>{input.suffix}</span>
                )}
              </div>
            </div>
          ))}

          <button className="solid-btn btn-lg" onClick={calculateEMI} style={{ width: '100%', marginTop: 'var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)' }}>
            Calculate EMI <ArrowRight size={18} />
          </button>

          {result && (
            <div className="result-box">
              <h3>Your Monthly EMI</h3>
              <div className="result-amount">₹ {result.emi.toLocaleString('en-IN')}</div>

              {/* Visual Breakdown Bar */}
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <div style={{ display: 'flex', height: '8px', borderRadius: 'var(--radius-full)', overflow: 'hidden', background: 'var(--bg-primary)' }}>
                  <div style={{ width: `${(result.principal / result.totalPayable) * 100}%`, background: 'var(--primary)' }} />
                  <div style={{ width: `${(result.totalInterest / result.totalPayable) * 100}%`, background: 'var(--secondary)' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-2)' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', marginRight: '4px' }} />
                    Principal
                  </span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--secondary)', marginRight: '4px' }} />
                    Interest
                  </span>
                </div>
              </div>

              <div className="breakdown">
                <div className="breakdown-item">
                  <span>Principal Amount</span>
                  <span>₹ {result.principal.toLocaleString('en-IN')}</span>
                </div>
                <div className="breakdown-item">
                  <span>Total Interest</span>
                  <span style={{ color: 'var(--secondary)' }}>₹ {result.totalInterest.toLocaleString('en-IN')}</span>
                </div>
                <div className="breakdown-item" style={{ borderTop: '1px solid var(--border-default)', marginTop: 'var(--space-2)', paddingTop: 'var(--space-3)' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Total Amount Payable</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>₹ {result.totalPayable.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div style={{ marginTop: 'var(--space-4)', display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)', padding: 'var(--space-3)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                <Info size={14} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  This is an estimate. Actual EMI may vary based on lender terms and conditions.
                </p>
              </div>
            </div>
          )}
        </div>
        </ScrollReveal>
      </section>
    </>
  );
};

export default EmiCalculator;
