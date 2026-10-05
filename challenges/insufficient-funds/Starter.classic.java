import java.util.Scanner;

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

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Account account = new Account();
        int n = scanner.nextInt();
        for (int i = 0; i < n; i++) {
            String command = scanner.next();
            if (command.equals("deposit")) {
                int amount = scanner.nextInt();
                account.deposit(amount);
                System.out.println("Deposited " + amount);
            } else if (command.equals("balance")) {
                System.out.println("Balance: " + account.getBalance());
            } else {
                int amount = scanner.nextInt();
                // TODO: withdraw and print Withdrew <amount>, or Error: <the exception's message>
            }
        }
    }
}
