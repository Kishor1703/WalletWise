import React, { useState } from 'react';

const Budget = () => {
  const [budget, setBudget] = useState(0);
  const [expenses, setExpenses] = useState(0);

  const handleSetBudget = (e) => {
    e.preventDefault();
    const enteredBudget = parseFloat(e.target.budget.value);
    if (!isNaN(enteredBudget)) setBudget(enteredBudget);
  };

  return (
    <div>
      <h2>Budget Management</h2>
      <form onSubmit={handleSetBudget}>
        <input type="number" name="budget" placeholder="Set your budget" required />
        <button type="submit">Set Budget</button>
      </form>
      <h3>Remaining Budget: {budget - expenses}</h3>
    </div>
  );
};

export default Budget;
