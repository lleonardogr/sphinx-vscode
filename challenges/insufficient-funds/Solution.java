class InsufficientFundsException extends Exception {
    InsufficientFundsException(int balance, int requested) {
        super("Insufficient funds: balance " + balance + ", requested " + requested);
    }
}

class Account {
    private int balance;

    void deposit(int amount) {
        balance += amount;
    }

    void withdraw(int amount) throws InsufficientFundsException {
        if (amount > balance) {
            throw new InsufficientFundsException(balance, amount);
        }
        balance -= amount;
    }

    int getBalance() {
        return balance;
    }
}

void main() {
    Account account = new Account();
    int n = Integer.parseInt(IO.readln().trim());
    for (int i = 0; i < n; i++) {
        String[] p = IO.readln().trim().split(" ");
        if (p[0].equals("deposit")) {
            int amount = Integer.parseInt(p[1]);
            account.deposit(amount);
            IO.println("Deposited " + amount);
        } else if (p[0].equals("balance")) {
            IO.println("Balance: " + account.getBalance());
        } else {
            int amount = Integer.parseInt(p[1]);
            try {
                account.withdraw(amount);
                IO.println("Withdrew " + amount);
            } catch (InsufficientFundsException e) {
                IO.println("Error: " + e.getMessage());
            }
        }
    }
}
