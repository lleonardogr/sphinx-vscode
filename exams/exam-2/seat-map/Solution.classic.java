import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int rows = scanner.nextInt();
        int seats = scanner.nextInt();
        int n = scanner.nextInt();
        char[][] map = new char[rows][seats];
        for (char[] row : map) java.util.Arrays.fill(row, '.');
        for (int i = 0; i < n; i++) {
            scanner.next();
            int r = scanner.nextInt() - 1;
            int s = scanner.nextInt() - 1;
            if (r < 0 || r >= rows || s < 0 || s >= seats) {
                System.out.println("Invalid seat");
            } else if (map[r][s] == 'X') {
                System.out.println("Seat taken");
            } else {
                map[r][s] = 'X';
                System.out.println("Booked row " + (r + 1) + " seat " + (s + 1));
            }
        }
        for (char[] row : map) System.out.println(new String(row));
    }
}
