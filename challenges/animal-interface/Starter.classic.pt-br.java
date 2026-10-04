import java.util.Scanner;

// TODO: crie uma interface Animal com dois métodos: String name() e String sound()

// TODO: crie as classes Dog, Cat, Cow e Duck que implementam Animal

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        // TODO: crie um array Animal[] com espaço para n animais

        for (int i = 0; i < n; i++) {
            String type = scanner.next();
            // TODO: crie o animal certo para este tipo e guarde no array
        }

        // TODO: percorra o array e imprima o que cada animal diz
    }
}
