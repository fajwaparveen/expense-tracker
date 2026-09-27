import { useState } from "react"; 

type Expense = {
  description: string;
  amount: number;
  category: string;
  date: string;
}

export default function ExpenceTracker(){
 const [ expenses, setExpenses ] = useState<Expense[]>([]);
 const [ description, setDescription] = useState(""); 
 const [ amount, setAmount] = useState(""); 
 const [ category, setCategory] = useState("Food");
  
  const addExpense = () => {
    const newExpense: Expense = {
      description: description,
      amount: Number(amount),
      category: category,
      date: new Date().toLocaleDateString(),
    };
    
    setExpenses([...expenses, newExpense]);
    setDescription("");
    setAmount("");
    setCategory("Food");
    
  };
  
  const deleteExpense = (indexToDelete: number) => {
    setExpenses(expenses.filter((_, index) => index !== indexToDelete));
    
  };
  
  const total = expenses.reduce((sum , expense) => sum + expense.amount, 0);
  return (
    <div>
    <h1>Expense Tracker</h1>
      <p>Track your income and expenses.</p>
      <h2>Total: ${total} </h2>
      
      <input
        type="text"
        placeholder="Expence description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        />

      <input 
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        >
      <option value= "Food" > Food </option>
      <option value= "Transport" > Transport </option>
      <option value= "Shopping" > Shopping </option>
      <option value= "Bills" > Bills </option>
      <option value= "Other" > Other </option>
     </select>

      <button onClick={addExpense}> Add Expense </button>  
      {expenses.map((expence , index) => (
      <div key={index}>
        <p> {expence.description} </p>
        <p> {expence.amount} </p>
        <p> {expence.category} </p>
        <button onClick={() => deleteExpense(index)}> Delete </button>
      </div>
      
      ))}
    </div>
  );
}