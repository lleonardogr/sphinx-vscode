import java.util.*;

enum Coin {
    // TODO: dê a cada moeda o valor em centavos: PENNY 1, NICKEL 5, DIME 10, QUARTER 25
    PENNY, NICKEL, DIME, QUARTER;

    int cents() {
        return 0;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String[] names = scanner.nextLine().trim().split(" +");

        // TODO: conte as moedas, avise dos nomes desconhecidos e imprima a contagem de cada moeda e o total
    }
}
