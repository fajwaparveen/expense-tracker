import { useMemo, useState, type CSSProperties, type FormEvent } from 'react';
import {
  BusFront,
  CircleDollarSign,
  MoreHorizontal,
  Plus,
  ReceiptText,
  ShoppingBag,
  Sparkles,
  Trash2,
  Utensils,
  WalletCards,
  type LucideIcon,
} from 'lucide-react';

type Category = 'Food' | 'Transport' | 'Shopping' | 'Bills' | 'Other';

type Expense = {
  id: number;
  description: string;
  amount: number;
  category: Category;
  date: string;
};

type CategoryConfig = {
  icon: LucideIcon;
  color: string;
};

const categories: Category[] = ['Food', 'Transport', 'Shopping', 'Bills', 'Other'];

const categoryConfig: Record<Category, CategoryConfig> = {
  Food: { icon: Utensils, color: 'hsl(14 71% 58%)' },
  Transport: { icon: BusFront, color: 'hsl(198 48% 44%)' },
  Shopping: { icon: ShoppingBag, color: 'hsl(278 34% 54%)' },
  Bills: { icon: ReceiptText, color: 'hsl(161 37% 35%)' },
  Other: { icon: MoreHorizontal, color: 'hsl(39 55% 48%)' },
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

function formatCurrency(amount: number) {
  return currencyFormatter.format(amount);
}

export default function ExpenseTrackerPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Food');
  const [error, setError] = useState('');

  const total = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [expenses],
  );

  const addExpense = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedDescription = description.trim();
    const parsedAmount = Number(amount);

    if (!trimmedDescription) {
      setError('Give this expense a short description.');
      return;
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError('Enter an amount greater than zero.');
      return;
    }

    const newExpense: Expense = {
      id: Date.now(),
      description: trimmedDescription,
      amount: parsedAmount,
      category,
      date: new Date().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    setExpenses((currentExpenses) => [...currentExpenses, newExpense]);
    setDescription('');
    setAmount('');
    setCategory('Food');
    setError('');
  };

  const deleteExpense = (idToDelete: number) => {
    setExpenses((currentExpenses) =>
      currentExpenses.filter((expense) => expense.id !== idToDelete),
    );
  };

  return (
    <main className="tracker-shell">
      <div className="tracker-page">
        <header className="tracker-topbar">
          <div className="brand-lockup">
            <div className="brand-mark" aria-hidden="true">
              <WalletCards size={20} strokeWidth={2.2} />
            </div>
            <div>
              <div className="brand-name" data-testid="text-brand-name">pocketwise</div>
              <div className="brand-caption">a calmer way to keep track</div>
            </div>
          </div>
          <div className="today-pill">
            <span className="today-dot" aria-hidden="true" />
            <span data-testid="text-local-status">Saved on this device</span>
          </div>
        </header>

        <section className="intro" aria-labelledby="page-title">
          <div>
            <p className="eyebrow">Your everyday money log</p>
            <h1 id="page-title">
              Small notes.
              <br />
              <em>Clearer days.</em>
            </h1>
            <p className="intro-copy">
              Keep the little purchases visible, without turning your day into a spreadsheet.
            </p>
          </div>
          <aside className="balance-card" aria-label="Expense summary">
            <p className="balance-label">Total spent</p>
            <strong className="balance-amount" data-testid="text-total-amount">
              {formatCurrency(total)}
            </strong>
            <div className="balance-meta">
              <CircleDollarSign size={16} aria-hidden="true" />
              <span>
                <strong data-testid="text-expense-count">{expenses.length}</strong>{' '}
                {expenses.length === 1 ? 'expense' : 'expenses'} logged
              </span>
            </div>
          </aside>
        </section>

        <section className="workspace" aria-label="Expense tracker workspace">
          <form className="panel form-panel" onSubmit={addExpense} noValidate>
            <div className="panel-heading">
              <div>
                <h2 className="panel-title">Add an expense</h2>
                <p className="panel-subtitle">A few details is all it takes.</p>
              </div>
              <div className="form-badge" aria-hidden="true">
                <Plus size={18} strokeWidth={2.4} />
              </div>
            </div>

            <label className="field">
              <span className="field-label">What was it?</span>
              <input
                className="field-input"
                data-testid="input-description"
                type="text"
                placeholder="Morning coffee, train ticket..."
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value);
                  if (error) setError('');
                }}
                autoComplete="off"
              />
            </label>

            <label className="field">
              <span className="field-label">How much?</span>
              <span className="input-with-prefix">
                <span className="input-prefix" aria-hidden="true">$</span>
                <input
                  className="field-input"
                  data-testid="input-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={amount}
                  onChange={(event) => {
                    setAmount(event.target.value);
                    if (error) setError('');
                  }}
                />
              </span>
            </label>

            <label className="field">
              <span className="field-label">Category</span>
              <select
                className="field-select"
                data-testid="select-category"
                value={category}
                onChange={(event) => setCategory(event.target.value as Category)}
              >
                {categories.map((categoryOption) => (
                  <option key={categoryOption} value={categoryOption}>
                    {categoryOption}
                  </option>
                ))}
              </select>
            </label>

            {error ? (
              <p className="field-error" data-testid="status-form-error" role="alert">
                {error}
              </p>
            ) : null}

            <button className="submit-button" data-testid="button-add-expense" type="submit">
              <Plus size={17} strokeWidth={2.6} aria-hidden="true" />
              Add expense
            </button>
          </form>

          <section className="panel list-panel" aria-labelledby="recent-expenses-title">
            <div className="panel-heading list-heading">
              <div>
                <h2 className="panel-title" id="recent-expenses-title">Recent expenses</h2>
                <p className="panel-subtitle">Your spending, one line at a time.</p>
              </div>
              <span className="count-pill" data-testid="text-list-count">{expenses.length}</span>
            </div>

            {expenses.length === 0 ? (
              <div className="empty-state" data-testid="status-empty-expenses">
                <div className="empty-illustration" aria-hidden="true">
                  <Sparkles size={27} strokeWidth={1.8} />
                </div>
                <h3>A clean slate</h3>
                <p>Add your first expense and it will appear here, ready when you need it.</p>
              </div>
            ) : (
              <div className="expense-list" data-testid="list-expenses">
                {expenses.map((expense, index) => {
                  const config = categoryConfig[expense.category];
                  const CategoryIcon = config.icon;

                  return (
                    <article
                      className="expense-row"
                      key={expense.id}
                      style={{
                        '--category-color': config.color,
                        animationDelay: `${Math.min(index, 8) * 35}ms`,
                      } as CSSProperties}
                      data-testid={`row-expense-${expense.id}`}
                    >
                      <div className="category-icon" aria-hidden="true">
                        <CategoryIcon size={17} strokeWidth={2.1} />
                      </div>
                      <div>
                        <p className="expense-description" title={expense.description}>
                          {expense.description}
                        </p>
                        <p className="expense-date">{expense.date}</p>
                      </div>
                      <span className="expense-category">{expense.category}</span>
                      <strong className="expense-amount">{formatCurrency(expense.amount)}</strong>
                      <button
                        className="delete-button"
                        data-testid={`button-delete-expense-${expense.id}`}
                        type="button"
                        aria-label={`Delete ${expense.description}`}
                        onClick={() => deleteExpense(expense.id)}
                      >
                        <Trash2 size={16} strokeWidth={2} aria-hidden="true" />
                      </button>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}