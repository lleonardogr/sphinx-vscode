// TODO: monte a mensagem "Insufficient funds: balance B, requested R"
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

    // TODO: lance uma InsufficientFundsException quando amount for maior que o saldo
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
            // TODO: saque e imprima Withdrew <amount>, ou Error: <a mensagem da exceção>
        }
    }
}
