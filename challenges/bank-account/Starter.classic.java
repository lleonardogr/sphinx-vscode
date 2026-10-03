import java.util.Scanner;

class BankAccount {
    // TODO: add a private int field called balance (it starts at 0)

    // TODO: add money and return true, or return false if amount is zero or negative
    boolean deposit(int amount) {
        return false;
    }

    // TODO: take money out and return true, or return false if there is not enough money
    boolean withdraw(int amount) {
        return false;
    }

    // TODO: return the current balance
    int getBalance() {
        return 0;
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
