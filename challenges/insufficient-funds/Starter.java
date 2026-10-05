// TODO: build the message "Insufficient funds: balance B, requested R"
class InsufficientFundsException extends Exception {
    InsufficientFundsException(int balance, int requested) {
        super("");
    }
}

class Account {
    private int balance;

    void deposit(int amount) {
        balance += amount;
    }

    // TODO: throw an InsufficientFundsException when amount is more than the balance
    void withdraw(int amount) throws InsufficientFundsException {
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
            // TODO: withdraw and print Withdrew <amount>, or Error: <the exception's message>
        }
    }
}
