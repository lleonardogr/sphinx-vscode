import java.util.Scanner;

class BankAccount {
    // TODO: adicione um atributo private int chamado balance (ele começa em 0)

    // TODO: some o dinheiro e retorne true, ou retorne false se amount for zero ou negativo
    boolean deposit(int amount) {
        return false;
    }

    // TODO: tire o dinheiro e retorne true, ou retorne false se não houver dinheiro suficiente
    boolean withdraw(int amount) {
        return false;
    }

    // TODO: retorne o saldo atual
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
