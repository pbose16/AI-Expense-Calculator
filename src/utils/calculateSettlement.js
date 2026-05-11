export const calculateSettlement = (expenses, participants) => {
  if (!expenses || !participants || participants.length === 0) return [];

  // 1. Calculate net balances for each participant
  const balances = {};
  participants.forEach(p => {
    balances[p.id] = 0;
  });

  expenses.forEach(exp => {
    if (!exp.amount || !exp.payerId || !exp.participantIds || exp.participantIds.length === 0) return;
    
    const amount = parseFloat(exp.amount);
    const splitAmount = amount / exp.participantIds.length;
    
    // Payer gets back the amount they paid
    if (balances[exp.payerId] !== undefined) {
      balances[exp.payerId] += amount;
    }
    
    // Each participant owes their share
    exp.participantIds.forEach(id => {
      if (balances[id] !== undefined) {
        balances[id] -= splitAmount;
      }
    });
  });

  // 2. Separate into debtors and creditors
  const debtors = [];
  const creditors = [];

  for (const [id, balance] of Object.entries(balances)) {
    if (balance < -0.01) {
      debtors.push({ id, amount: Math.abs(balance) });
    } else if (balance > 0.01) {
      creditors.push({ id, amount: balance });
    }
  }

  // Sort by amount descending to minimize transactions
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  // 3. Match debtors and creditors
  const transactions = [];
  let d = 0;
  let c = 0;

  while (d < debtors.length && c < creditors.length) {
    const debtor = debtors[d];
    const creditor = creditors[c];
    
    const amount = Math.min(debtor.amount, creditor.amount);
    
    if (amount > 0.01) {
      transactions.push({
        from: debtor.id,
        to: creditor.id,
        amount: parseFloat(amount.toFixed(2))
      });
    }

    debtor.amount -= amount;
    creditor.amount -= amount;

    if (debtor.amount < 0.01) d++;
    if (creditor.amount < 0.01) c++;
  }

  return transactions;
};
