import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String[] input = scanner.next().split("/"); // por exemplo ["192.168.1.130", "26"]
        String[] parts = input[0].split("\\.");
        int prefix = Integer.parseInt(input[1]);

        // TODO: transforme o endereço num único número, ache o bloco em que ele está e imprima as cinco linhas
    }
}
