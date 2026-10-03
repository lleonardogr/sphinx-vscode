import java.util.Scanner;

class BankAccount {
    private int balance = 0;

    boolean deposit(int amount) {
        if (amount <= 0) {
            return false;
        }
        balance += amount;
        return true;
    }

    boolean withdraw(int amount) {
        if (amount > balance) {
            return false;
        }
        balance -= amount;
        return true;
    }

    int getBalance() {
        return balance;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        BankAccount account = new BankAccount();
        int n = scanner.nextInt();
        for (int i = 0; i < n; i++) {
            String command = scanner.next();
            if (command.equals("balance")) {
                System.out.println("Balance: " + account.getBalance());
                continue;
            }
            int amount = scanner.nextInt();
            if (command.equals("deposit")) {
                System.out.println(account.deposit(amount) ? "Deposited " + amount : "Invalid amount");
            } else if (amount <= 0) {
                System.out.println("Invalid amount");
            } else if (account.withdraw(amount)) {
                System.out.println("Withdrew " + amount);
            } else {
                System.out.println("Insufficient funds");
            }
        }
    }
}
