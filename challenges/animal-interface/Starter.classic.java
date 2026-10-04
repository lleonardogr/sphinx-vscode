import java.util.Scanner;

// TODO: create an interface Animal with two methods: String name() and String sound()

// TODO: create classes Dog, Cat, Cow and Duck that implement Animal

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        // TODO: create an Animal[] array with room for n animals

        for (int i = 0; i < n; i++) {
            String type = scanner.next();
            // TODO: create the right animal for this type and store it in the array
        }

        // TODO: loop over the array and print what each animal says
    }
}
