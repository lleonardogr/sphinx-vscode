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

void main() {
    BankAccount account = new BankAccount();
    int n = Integer.parseInt(IO.readln().trim());
    for (int i = 0; i < n; i++) {
        String[] parts = IO.readln().trim().split(" ");
        String command = parts[0];
        if (command.equals("balance")) {
            IO.println("Balance: " + account.getBalance());
            continue;
        }
        int amount = Integer.parseInt(parts[1]);
        if (command.equals("deposit")) {
            IO.println(account.deposit(amount) ? "Deposited " + amount : "Invalid amount");
        } else if (amount <= 0) {
            IO.println("Invalid amount");
        } else if (account.withdraw(amount)) {
            IO.println("Withdrew " + amount);
        } else {
            IO.println("Insufficient funds");
        }
    }
}
