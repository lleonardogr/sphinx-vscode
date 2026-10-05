import java.util.Scanner;

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
                // TODO: saque e imprima Withdrew <amount>, ou Error: <a mensagem da exceção>
            }
        }
    }
}
