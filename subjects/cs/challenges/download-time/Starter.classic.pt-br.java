import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        long sizeAmount = scanner.nextLong();
        String sizeUnit = scanner.next();   // por exemplo MB
        long speedAmount = scanner.nextLong();
        String speedUnit = scanner.next();  // por exemplo Mbps

        // TODO: transforme o tamanho em bytes e a velocidade em bits por segundo (escreva um método para cada),
        // depois imprima o tempo como Time: h:mm:ss, arredondado para cima até um segundo inteiro
    }
}
