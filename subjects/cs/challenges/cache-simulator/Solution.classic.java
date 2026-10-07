import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int lines = scanner.nextInt();
        int blockSize = scanner.nextInt();
        int n = scanner.nextInt();
        int[] cache = new int[lines];
        for (int i = 0; i < lines; i++) {
            cache[i] = -1;
        }
        int hits = 0;
        for (int i = 0; i < n; i++) {
            int address = scanner.nextInt();
            int block = address / blockSize;
            boolean hit = cache[block % lines] == block;
            cache[block % lines] = block;
            if (hit) {
                hits++;
            }
            System.out.println(address + (hit ? " hit" : " miss"));
        }
        System.out.println("Hits: " + hits + "/" + n);
        System.out.printf("Hit rate: %.1f%%%n", hits * 100.0 / n);
    }
}
