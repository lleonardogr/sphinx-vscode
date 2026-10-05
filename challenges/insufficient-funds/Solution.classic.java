import java.util.Scanner;

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
                try {
                account.withdraw(amount);
                System.out.println("Withdrew " + amount);
            } catch (InsufficientFundsException e) {
                System.out.println("Error: " + e.getMessage());
            }
            }
        }
    }
}
