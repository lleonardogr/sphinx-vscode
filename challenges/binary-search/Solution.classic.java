import java.util.*;

public class Main {

    static int steps;

    static int search(int[] a, int value) {
        steps = 0;
        int low = 0, high = a.length - 1;
        while (low <= high) {
            int mid = (low + high) / 2;
            steps++;
            if (a[mid] == value) return mid;
            if (a[mid] < value) low = mid + 1;
            else high = mid - 1;
        }
        return -1;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] numbers = new int[n];
        for (int i = 0; i < n; i++) {
            numbers[i] = scanner.nextInt();
        }
        int q = scanner.nextInt();
        for (int i = 0; i < q; i++) {
            int value = scanner.nextInt();
            int index = search(numbers, value);
            if (index >= 0) System.out.println(value + " found at index " + index + ", steps: " + steps);
            else System.out.println(value + " not found, steps: " + steps);
        }
    }
}
