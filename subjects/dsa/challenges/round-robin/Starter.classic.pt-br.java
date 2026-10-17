import java.util.*;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int slice = scanner.nextInt();
        String[] names = new String[n];
        int[] needs = new int[n];
        for (int i = 0; i < n; i++) {
            names[i] = scanner.next();
            needs[i] = scanner.nextInt();
        }

        // TODO: rode os processos em turnos com uma fila, imprima quando cada um termina e depois a espera média
    }
}
